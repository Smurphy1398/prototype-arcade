import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { random, angleDelta } from '../../core/math';
import { CoastTrack } from './track';

const C = { teal: 0x168d8b, deep: 0x164b52, cream: 0xffecc2, coral: 0xed724f, sand: 0xf6d69a, green: 0x58a657, trunk: 0x936d42 };
/** Authored silhouettes, local procedural textures, and batched static scenery. */
export class CoastWorld {
  readonly group = new THREE.Group();
  private batches = new Map<THREE.Material, THREE.BufferGeometry[]>();
  private materials = new Map<number, THREE.MeshStandardMaterial>();
  private sea: THREE.ShaderMaterial;
  private rng = random(72019);
  constructor(readonly track: CoastTrack, scene: THREE.Scene) {
    scene.background = new THREE.Color(0x8ddae2);
    scene.fog = new THREE.Fog(0x9cdbe0, 185, 590);
    scene.add(this.group);
    scene.add(new THREE.HemisphereLight(0xe1f7ff, 0xbc925c, 2.5));
    const sun = new THREE.DirectionalLight(0xffedc5, 3.1);
    sun.position.set(110, 170, -80); sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048); sun.shadow.camera.left = -220; sun.shadow.camera.right = 220;
    sun.shadow.camera.top = 220; sun.shadow.camera.bottom = -220; sun.shadow.camera.far = 500;
    sun.shadow.normalBias = 0.06; sun.shadow.bias = -0.00015;
    sun.target.position.set(-65, 0, 35); scene.add(sun, sun.target);
    const sky = new THREE.Mesh(new THREE.SphereGeometry(900, 32, 16), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      uniforms: {},
      vertexShader: 'varying vec3 vP; void main(){ vP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
      fragmentShader: 'varying vec3 vP; void main(){float h=normalize(vP).y; vec3 c=mix(vec3(.76,.93,.9),vec3(.12,.58,.77),smoothstep(0.,.8,h)); gl_FragColor=vec4(c,1.);}',
    })); scene.add(sky);
    this.sea = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
      vertexShader: 'varying vec3 vP; void main(){ vP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
      fragmentShader: `varying vec3 vP; uniform float time;
        void main(){ float wave=sin(vP.x*.17+vP.z*.36+time*.9)*sin(vP.z*.6-time*.7);
        float glint=pow(max(0.,sin(vP.x*.48+vP.z*1.2+time)*sin(vP.z*.21-time*.8)),22.);
        vec3 col=mix(vec3(.015,.53,.63),vec3(.06,.73,.71),.45+wave*.15);
        col+=vec3(.4,.65,.57)*glint*.6; gl_FragColor=vec4(col,1.); }`,
    });
    const water = new THREE.Mesh(new THREE.PlaneGeometry(2500, 2500), this.sea);
    water.rotation.x = -Math.PI / 2; water.position.y = -3.15; this.group.add(water);
    this.terrain(); this.road(); this.festival(); this.scenery();
    for (const [material, geometries] of this.batches) {
      const geometry = mergeGeometries(geometries, false);
      if (geometry) { const mesh = new THREE.Mesh(geometry, material); mesh.castShadow = true; mesh.receiveShadow = true; this.group.add(mesh); }
      for (const g of geometries) g.dispose();
    }
    this.batches.clear();
  }
  private mat(color: number) {
    if (!this.materials.has(color)) this.materials.set(color, new THREE.MeshStandardMaterial({ color, roughness: 0.86, flatShading: true }));
    return this.materials.get(color)!;
  }
  private put(g: THREE.BufferGeometry, color: number | THREE.Material, x: number, y: number, z: number, sx = 1, sy = 1, sz = 1, rx = 0, ry = 0, rz = 0) {
    const material = typeof color === 'number' ? this.mat(color) : color;
    // Batch compatible layouts: Three primitives mix indexed/non-indexed meshes,
    // while authored leaves and flags initially have no texture coordinates.
    if(g.index){const source=g;g=g.toNonIndexed();source.dispose();}
    if(!g.getAttribute('uv'))g.setAttribute('uv',new THREE.Float32BufferAttribute(new Float32Array(g.getAttribute('position').count*2),2));
    const transform = new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz)), new THREE.Vector3(sx, sy, sz));
    g.applyMatrix4(transform);
    if (!this.batches.has(material)) this.batches.set(material, []);
    this.batches.get(material)!.push(g);
  }
  private box(c: number, x: number, y: number, z: number, sx: number, sy: number, sz: number, ry = 0) { this.put(new THREE.BoxGeometry(1, 1, 1), c, x, y, z, sx, sy, sz, 0, ry); }
  private stone(x: number, y: number, z: number, sx: number, sy: number, sz: number, c = 0xd7a872) { this.put(new THREE.IcosahedronGeometry(1, 0), c, x, y, z, sx, sy, sz, 0, this.rng() * 6.28); }
  private strip(inner: number, outer: number, y: number, material: THREE.Material) {
    const pos: number[] = [], uv: number[] = [], index: number[] = [];
    for (let i = 0; i <= this.track.samples.length; i++) {
      const p = this.track.samples[i % this.track.samples.length];
      for (const side of [inner, outer]) { pos.push(p.x + p.nx * side, y, p.z + p.nz * side); uv.push(side / 7, i / 5); }
      if (i < this.track.samples.length) { const j = i * 2; index.push(j, j + 2, j + 1, j + 1, j + 2, j + 3); }
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(index); g.computeVertexNormals();
    // Two-sided ribbons tolerate either route winding and make the authored road unambiguous.
    material.side = THREE.DoubleSide;
    const m = new THREE.Mesh(g, material); m.receiveShadow = true; this.group.add(m);
  }
  private terrain() {
    this.put(new THREE.CylinderGeometry(1, 1.02, 1, 80), 0xecc78b, -74, -6.5, 28, 115, 10, 171);
    this.put(new THREE.CylinderGeometry(1, 1.1, 1, 64), 0x88b664, -77, -2.3, 30, 102, 4.2, 148);
    this.strip(-19, 19, -0.35, this.mat(C.sand));
    this.strip(-11.8, 11.8, -0.11, this.mat(0x94bd63));
    // Warm layered cliffs are the central landmark; the east coast opens to the ocean.
    for (let i = 0; i < 29; i++) {
      const a = i * 2.4, r = 12 + this.rng() * 32;
      const x = -77 + Math.cos(a) * r, z = 31 + Math.sin(a) * r * 1.7;
      if (Math.min(this.track.surface(x,z).distance,...this.track.routes.map(r=>this.track.surface(x,z,r.id).distance)) < 32) continue;
      const h = 9 + this.rng() * 17;
      this.stone(x, h * 0.38 - 1, z, 14 + this.rng() * 8, h, 14 + this.rng() * 6, [0xd89860, 0xe9b27b, 0xf0c38b][i % 3]);
      this.stone(x, h * 1.04, z, 11, 2.2, 11, 0x789f54);
    }
    for (const [x, z, size] of [[125, 170, 26], [160, -140, 37], [-285, 70, 40], [75, 325, 44]]) {
      this.stone(x, -2, z, size, size * 0.57, size, 0xa9c4a1);
      this.stone(x, size * 0.16, z, size * 0.84, size * 0.48, size * 0.8, 0x629c7a);
    }
  }
  private asphalt() {
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 128;
    const ctx = canvas.getContext('2d')!; ctx.fillStyle = '#d8c58f'; ctx.fillRect(0, 0, 128, 128);
    for (let i = 0; i < 3800; i++) { ctx.fillStyle = this.rng() > .5 ? 'rgba(255,245,201,.12)' : 'rgba(98,83,61,.07)'; ctx.fillRect(this.rng()*128, this.rng()*128, 1.2, 1.2); }
    const tex = new THREE.CanvasTexture(canvas); tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    return new THREE.MeshStandardMaterial({ map: tex, roughness: 1 });
  }
  private road() {
    this.strip(-7.5, 7.5, 0, this.asphalt());
    this.strip(-7.85, -7.5, 0.03, this.mat(C.cream)); this.strip(7.5, 7.85, 0.03, this.mat(C.cream));
    for (let s = 0; s < this.track.length; s += 3.5) {
      const p = this.track.at(s), yaw = Math.atan2(p.tx, p.tz);
      for (const side of [-1, 1]) {
        this.box(Math.floor(s / 3.5) % 2 ? C.cream : C.coral, p.x + p.nx * 8.12 * side, 0.05, p.z + p.nz * 8.12 * side, .54, .12, 3.6, yaw);
        const junction=!this.track.railAt(s,side);
        if(junction)continue;
        this.box(0xb29163, p.x + p.nx * 10.3 * side, .72, p.z + p.nz * 10.3 * side, .17, 1.45, .17, yaw);
        this.box(s / this.track.length < .22 ? 0xf8dfac : 0xd1b781, p.x + p.nx * 10.3 * side, .79, p.z + p.nz * 10.3 * side, .13, .17, 3.65, yaw);
      }
      if (s % 14 < 3.5) this.box(0xf2e2b4, p.x, .012, p.z, .14, .022, 3, yaw);
    }
    // Checker stripe and wooden ramp, using exactly the same surface profile as physics.
    for (let x = -7; x < 7; x++) for (let z = 0; z < 2; z++) this.box((x + z) % 2 ? C.deep : C.cream, x+.5, .028, z+.5, 1, .04, 1);
    for(let id=0;id<6;id++){
      const p=this.track.at(this.track.length-6-Math.floor(id/2)*4.5),lane=id%2?2.2:-2.2,yaw=Math.atan2(p.tx,p.tz);
      this.box(C.cream,p.x+p.nx*lane,.03,p.z+p.nz*lane,2.9,.04,.13,yaw);
      for(const side of [-1,1])this.box(C.cream,p.x+p.nx*(lane+side*1.45)-p.tx*1.1,.03,p.z+p.nz*(lane+side*1.45)-p.tz*1.1,.13,.04,2.2,yaw);
    }
    const start = this.track.rampStart * this.track.length, end = this.track.rampEnd * this.track.length;
    for (let s = start; s < end; s += .5) {
      const p = this.track.at(s+.25), h = (s+.25-start)/(end-start)*3.3;
      this.box(Math.floor(s * 2) % 3 ? 0xbf864c : 0xd69a58, p.x, h - .1, p.z, 11, .25, .54, Math.atan2(p.tx,p.tz));
    }
    for (const f of [.261, .270, .279]) this.arrow(f * this.track.length, 0, C.cream, this.track.surface(this.track.at(f*this.track.length).x, this.track.at(f*this.track.length).z).height+.06);
    for (const o of this.track.obstacles) {
      for(let i=0;i<3;i++) this.put(new THREE.TorusGeometry(.84,.27,6,14), i===1?C.coral:C.deep, o.x,.3+i*.45,o.z,1,1,1,Math.PI/2);
      this.put(new THREE.CylinderGeometry(.65,.65,.13,12), C.cream, o.x,1.38,o.z);
    }
  }
  private arrow(s: number, side = 0, color = C.cream, y = .045) {
    const p = this.track.at(s); const shape = new THREE.Shape();
    shape.moveTo(-1.6,-1.2);shape.lineTo(0,.2);shape.lineTo(1.6,-1.2);shape.lineTo(1.6,-.3);shape.lineTo(0,1.3);shape.lineTo(-1.6,-.3);shape.closePath();
    const geometry=new THREE.ShapeGeometry(shape);geometry.rotateX(Math.PI/2);
    this.put(geometry, color, p.x + p.nx*side,y,p.z+p.nz*side,1,1,1,0,Math.atan2(p.tx,p.tz));
  }
  private palm(x: number, z: number, size: number, lean = 0) {
    const h = size*8.5;
    for (let j=0;j<5;j++) this.put(new THREE.CylinderGeometry(.2*size,.26*size,h/5+0.08,7), j%2?0xa47d48:0xb18b52,x+lean*j*j/25,h*(j+.5)/5,z,1,1,1,0,0,-lean/h);
    const topX=x+lean, topY=h;
    this.put(new THREE.IcosahedronGeometry(.48,0),0x779347,topX,topY,z);
    for(let j=0;j<8;j++) {
      const a=j*Math.PI/4+this.rng()*.2;
      const pos = [0,0,0, Math.sin(a)*1.8*size,.65*size,Math.cos(a)*1.8*size,
        Math.sin(a+.26)*2.7*size,0,Math.cos(a+.26)*2.7*size, Math.sin(a)*5*size,-1.5*size,Math.cos(a)*5*size,
        Math.sin(a-.26)*2.7*size,0,Math.cos(a-.26)*2.7*size];
      const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex([0,1,2,1,3,2,1,4,3,0,4,1]);g.computeVertexNormals();
      this.mat(j%2?0x398747:0x64a650).side=THREE.DoubleSide;
      this.put(g,j%2?0x398747:0x64a650,topX,topY,z);
    }
    for(let j=0;j<3;j++) this.put(new THREE.IcosahedronGeometry(.27*size,0),0x846533,topX+Math.sin(j*2)*.38,topY-.4,z+Math.cos(j*2)*.38);
  }
  private sign(text: string, small: string, x: number, y: number, z: number, yaw: number, width = 12, color = '#125762') {
    const c=document.createElement('canvas');c.width=1024;c.height=256;const ctx=c.getContext('2d')!;
    ctx.fillStyle=color;ctx.fillRect(0,0,1024,256);ctx.strokeStyle='#ffdf9b';ctx.lineWidth=12;ctx.strokeRect(15,15,994,226);
    ctx.textAlign='center';ctx.fillStyle='#fff0c8';ctx.font='900 100px Trebuchet MS, sans-serif';ctx.fillText(text,512,134);
    ctx.font='bold 32px Trebuchet MS, sans-serif';ctx.fillText(small,512,202);
    const map=new THREE.CanvasTexture(c);map.colorSpace=THREE.SRGBColorSpace;map.anisotropy=4;
    const mesh=new THREE.Mesh(new THREE.BoxGeometry(width,width/4,.35),[this.mat(C.deep),this.mat(C.deep),this.mat(C.deep),this.mat(C.deep),new THREE.MeshStandardMaterial({map,roughness:1}),new THREE.MeshStandardMaterial({map,roughness:1})]);
    mesh.position.set(x,y,z);mesh.rotation.y=yaw;mesh.castShadow=true;this.group.add(mesh);
  }
  private festival() {
    // The postcard stretch: start arch, surf kiosk, cabanas, bunting, palms, and lighthouse.
    for (const side of [-1,1]) { this.box(C.deep,side*9.15,4.5,0,.65,9,.65); this.box(C.coral,side*9.15,1.2,0,1.4,2.4,1.4); }
    this.sign('SUNSPUN COAST','ASTRO  /  ISLAND GRAND TOUR',0,8.1,0,0,19);
    for (const s of [22,56,91]) {
      const p=this.track.at(s),yaw=Math.atan2(p.tx,p.tz);
      for(const side of [-1,1])this.box(C.cream,p.x+p.nx*10*side,5,p.z+p.nz*10*side,.18,10,.18);
      for(let j=-8;j<=8;j+=2) {
        const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([-.7,0,0,.7,0,0,0,-1.25,0],3));g.computeVertexNormals();
        const mat=this.mat([C.coral,C.cream,C.teal][Math.abs(j/2)%3]);mat.side=THREE.DoubleSide;
        this.put(g,mat,p.x+p.nx*j,9.5-Math.cos(j/10)*1.5,p.z+p.nz*j,1,1,1,0,yaw);
      }
    }
    this.house(-21,31,8,9,C.coral); this.sign('SUN CLUB','SURF  /  SODA  /  GOOD TIMES',-16,4.8,30,Math.PI/2,8);
    for(const [x,z] of [[-21,59],[-24,87],[-32,109]])this.house(x,z,7,7,[0xe6ae57,0x5ea8a0,0xf1b69b][Math.floor(this.rng()*3)]);
    for(const [x,z,s,l] of [[16,19,1.4,-1],[-15,16,1.1,1],[17,47,1.25,-1],[-17,71,1.45,1],[9,111,1.2,-1],[25,-24,1.55,-1]])this.palm(x,z,s,l);
    // Lighthouse on the small island ahead of the coastal straight.
    this.stone(55,-1,148,22,8,20,0xe5c693);
    this.put(new THREE.CylinderGeometry(4.5,5.6,23,12),C.cream,55,14,148);
    for(const y of [8,17])this.put(new THREE.CylinderGeometry(y===8?5:4.7,y===8?5.3:4.9,3.4,12),C.coral,55,y,148);
    this.put(new THREE.CylinderGeometry(6,6,1,12),C.deep,55,26,148);
    this.put(new THREE.CylinderGeometry(3.8,3.8,5,10),0x88dae0,55,29,148);
    this.put(new THREE.ConeGeometry(6,4,12),C.coral,55,33,148);
    this.palm(69,139,.9,-.5);this.palm(45,156,1.1,.5);
    for(const z of [37,68,96]) {
      const x=24;
      this.put(new THREE.CylinderGeometry(.12,.12,3.8,8),C.cream,x,.9,z);
      this.put(new THREE.ConeGeometry(3.6,1.5,8),z===68?C.coral:C.teal,x,3,z);
      this.box(C.cream,x,0,z-2,1.7,.35,3.2,-.25);
      this.stone(x+4,-1.4,z+1,1.7,.5,1.1,0xf1e0b4);
    }
    const rp=this.track.at((this.track.rampStart-.018)*this.track.length);
    this.sign('TAKE FLIGHT','KEEP IT STRAIGHT  /  ENJOY THE VIEW',rp.x+rp.nx*12,4.3,rp.z+rp.nz*12,Math.atan2(rp.tx,rp.tz),9,'#cf6347');
    this.box(C.deep,rp.x+rp.nx*12,2,rp.z+rp.nz*12,.3,4,.3);
  }
  private house(x:number,z:number,w:number,d:number,color:number) {
    this.box(color,x,2.4,z,w,4.8,d);
    this.put(new THREE.CylinderGeometry(0,1,1,4),0xbc6846,x,6,z,w*.85,3,d*.85,0,Math.PI/4);
    this.box(C.cream,x+w/2+.03,2.8,z,0.08,2.2,d*.62);
    this.box(C.teal,x+w/2+.09,2.8,z,.1,1.75,d*.45);
    this.box(C.cream,x+w/2+.14,2.8,z,.13,1.8,.14);
    for(const offset of [-d*.28,d*.28])this.box(C.deep,x+w/2+2,1.7,z+offset,.15,3.4,.15);
    this.box(C.cream,x+w/2+1.1,3.8,z,2.4,.18,d*.85);
  }
  private scenery() {
    for(let i=0;i<78;i++) {
      const s=(.16+this.rng()*.83)*this.track.length,p=this.track.at(s),side=i%2?-1:1,offset=13+this.rng()*9;
      const x=p.x+p.nx*offset*side,z=p.z+p.nz*offset*side;
      if(this.track.routes.some(r=>this.track.surface(x,z,r.id).route===r.id&&this.track.surface(x,z,r.id).distance<9))continue;
      if(i%3===0)this.palm(x,z,.7+this.rng()*.7,side*this.rng());
      else {this.stone(x,.3,z,1.2+this.rng()*2,1+this.rng()*1.8,1.4+this.rng()*1.5,0xd5b782);this.stone(x+1,.4,z+.5,1.8,1.4,1.8,i%2?0x77a357:0x65954c);}
    }
    for(const u of [.13,.18,.36,.45,.54,.67,.75,.88,.95]) {
      const p=this.track.at(u*this.track.length);
      const next=this.track.at(u*this.track.length+20);
      const right=angleDelta(Math.atan2(p.tx,p.tz),Math.atan2(next.tx,next.tz))<0;
      this.sign(right?'›  ›  ›':'‹  ‹  ‹','FOLLOW THE SUN',p.x+p.nx*11.2,2.3,p.z+p.nz*11.2,Math.atan2(p.tx,p.tz),5.8);
    }
    for(let i=0;i<23;i++) {
      const x=-400+this.rng()*800,z=-400+this.rng()*800,y=70+this.rng()*70;
      for(let j=0;j<4;j++)this.put(new THREE.IcosahedronGeometry(1,1),0xfff3da,x+j*6,y+Math.sin(j*2)*2,z,8+this.rng()*5,3+this.rng()*4,5+this.rng()*5);
    }
    // Sailboats add scale and a focal point on the exposed coast.
    for(const [x,z] of [[87,40],[150,93],[58,-70]]) {
      this.put(new THREE.SphereGeometry(1,8,5),C.cream,x,-2.7,z,2,.7,5);
      this.box(C.trunk,x,1.7,z,.13,9,.13);
      const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0,0,8,0,0,0,4.3],3));g.computeVertexNormals();this.mat(C.cream).side=THREE.DoubleSide;this.put(g,C.cream,x, -1.6,z);
    }
  }
  update(time: number) { this.sea.uniforms.time.value = time; }
}
