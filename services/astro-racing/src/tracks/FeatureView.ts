import {authoredCourse} from './destinations/encounters';
import {ContextEncounters as EncounterView} from './destinations/ContextEncounters';
import type {DestinationTrack} from './destinations/track';
import * as THREE from 'three';
import type { TrackDefinition, TrackPoint } from './TrackDefinition';
import type { RaceSimulation } from '../race/RaceSimulation';
import type { ItemSystem } from '../items/ItemSystem';
import { mergeStatic } from '../core/mergeStatic';

/** Presentation consumes track mechanics data; it never changes physics or progress. */
export class FeatureView {
  readonly group=new THREE.Group();
  private encounters?:EncounterView;
  private pickups=new Map<string,THREE.Group>();
  private projectiles=new Map<number,THREE.Group>();
  private flows:THREE.Group[]=[];
  private bursts:THREE.Mesh[]=[];
  private stormRings:THREE.Mesh[]=[];
  private traps=new Map<number,THREE.Group>();
  private crab=new THREE.Group();
  private crabLegs:THREE.Mesh[]=[];
  private lamps:THREE.Mesh[]=[];
  private machinery=new Map<string,THREE.Group>();
  private belts:{group:THREE.Group;direction:number}[]=[];
  private padMaterial=new THREE.MeshStandardMaterial({color:0x20a7b1,emissive:0x0d7979,emissiveIntensity:.6,roughness:.45});
  private boltMaterial=new THREE.MeshBasicMaterial({color:0xffbd56});
  private coconutMaterial=new THREE.MeshStandardMaterial({color:0xa17a47,roughness:.9});
  constructor(readonly track:TrackDefinition,scene:THREE.Scene){
    scene.add(this.group);this.buildRoutes();mergeStatic(this.group);this.buildPads();this.buildPickups();this.buildHazard();this.buildMachinery();if(authoredCourse(track.id))this.encounters=new EncounterView(track as DestinationTrack,scene);
    for(let i=0;i<12;i++){const ring=this.mesh(new THREE.TorusGeometry(2,.14,5,20),new THREE.MeshBasicMaterial({color:0xc3b4ff}),0,0,0);ring.rotation.x=Math.PI/2;ring.visible=false;this.stormRings.push(ring);}
    for(let i=0;i<24;i++){const m=this.mesh(new THREE.TorusGeometry(1,.12,5,16),new THREE.MeshBasicMaterial({color:0xffdb8e,transparent:true,depthWrite:false}),0,0,0);m.rotation.x=Math.PI/2;m.visible=false;this.bursts.push(m);}
  }
  private material(color:number){return new THREE.MeshStandardMaterial({color,roughness:.85,flatShading:true});}
  private mesh(geometry:THREE.BufferGeometry,material:THREE.Material,x:number,y:number,z:number,parent:THREE.Object3D=this.group){const m=new THREE.Mesh(geometry,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
  private sign(text:string,detail:string,p:TrackPoint,lane:number,color='#cb6648',width=8){
    const canvas=document.createElement('canvas');canvas.width=768;canvas.height=256;const ctx=canvas.getContext('2d')!;
    ctx.fillStyle=color;ctx.fillRect(0,0,768,256);ctx.strokeStyle='#ffe6aa';ctx.lineWidth=10;ctx.strokeRect(12,12,744,232);ctx.fillStyle='#fff0cb';ctx.textAlign='center';ctx.font=`900 ${Math.min(67,670/(text.length*.6))}px Trebuchet MS`;ctx.fillText(text,384,120);ctx.font='bold 27px Trebuchet MS';ctx.fillText(detail,384,188);
    const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;
    lane=Math.sign(lane||1)*Math.max(Math.abs(lane),this.track.halfWidth+width/2+2);const x=p.x+p.nx*lane,z=p.z+p.nz*lane;
    const panel=this.mesh(new THREE.PlaneGeometry(width,width/3),new THREE.MeshStandardMaterial({map,side:THREE.FrontSide}),x,(p.y??0)+4.4,z);panel.rotation.y=Math.atan2(p.tx,p.tz)+Math.PI;
    this.mesh(new THREE.CylinderGeometry(.16,.16,4.4,7),this.material(0x255158),x,(p.y??0)+2.2,z);this.mesh(new THREE.BoxGeometry(1.2,.24,1.2),this.material(0x52777c),x,(p.y??0)+.12,z);
  }
  private buildRoutes(){
    const palette:Record<string,number>={nyc:0x607177,vegas:0x765180,candy:0xbd9059,atlantis:0x46969f,toybox:0xca7254,barnyard:0xa78156,rally:0x976d4e,dc:0xbab4a3};const planks=this.material(palette[this.track.theme??'']??(this.track.theme==='vietnam'?0x709b8b:this.track.theme==='volcano'?0x665064:this.track.theme==='glacier'?0x72c5df:this.track.theme==='hotel'?0x9678ae:this.track.theme==='orbital'?0x9b76e0:0xbb8752)),edge=this.material(this.track.theme==='orbital'?0x76f1dd:this.track.theme==='glacier'?0xc4f2fa:0xffdf9d),post=this.material(this.track.theme==='orbital'?0x746bcc:this.track.theme==='glacier'?0x90c6de:this.track.theme==='factory'?0x455e6a:this.track.theme==='hotel'?0x74617e:0xa98452);
    for(const route of this.track.routes??[]){
      const continuousJoin=['toybox','nyc','vegas','dc'].includes(this.track.id??'');const positions:number[]=[],indices:number[]=[],onMain:boolean[]=[],vertexS:number[]=[],across=Math.ceil(route.halfWidth*2/1.2),stride=across+1;
      route.samples.forEach((p,i)=>{for(let n=0;n<=across;n++){const lane=-route.halfWidth+2*route.halfWidth*n/across,x=p.x+p.nx*lane,z=p.z+p.nz*lane;const height=this.track.surface(x,z,route.id,p.s).height;positions.push(x,height+.014,z);const main=this.track.surface(x,z,'main',p.s);onMain.push(!continuousJoin&&main.route==='main'&&main.supported!==false&&Math.abs(main.height-height)<.12&&main.distance<(main.halfWidth??this.track.halfWidth)-.4);}if(i<route.samples.length-1&&!(this.track as any).profile?.((p.s+route.samples[i+1].s)/2,route.id).gap)for(let n=0;n<across;n++){const j=i*stride+n;for(const tri of [[j,j+stride,j+1],[j+1,j+stride,j+stride+1]])if(!tri.every(v=>onMain[v]))indices.push(...tri);}});
      for(const p of route.samples)for(let n=0;n<=across;n++)vertexS.push(p.s);
      // Join-height blending is nonlinear. Refine only triangles whose visible
      // plane deviates from the same supported surface queried by the kart.
      const refined:number[]=[],midpoints=new Map<string,number>();
      const midpoint=(a:number,b:number)=>{const key=Math.min(a,b)+':'+Math.max(a,b),cached=midpoints.get(key);if(cached!==undefined)return cached;const x=(positions[a*3]+positions[b*3])/2,z=(positions[a*3+2]+positions[b*3+2])/2,s=(vertexS[a]+vertexS[b])/2,h=this.track.surface(x,z,route.id,s).height,index=vertexS.length;positions.push(x,h+.014,z);vertexS.push(s);const main=this.track.surface(x,z,'main',s);onMain.push(!continuousJoin&&main.route==='main'&&main.supported!==false&&Math.abs(main.height-h)<.12&&main.distance<(main.halfWidth??this.track.halfWidth)-.4);midpoints.set(key,index);return index;};
      const refine=(a:number,b:number,c:number,depth=0)=>{if(onMain[a]&&onMain[b]&&onMain[c])return;const x=(positions[a*3]+positions[b*3]+positions[c*3])/3,z=(positions[a*3+2]+positions[b*3+2]+positions[c*3+2])/3,s=(vertexS[a]+vertexS[b]+vertexS[c])/3,y=(positions[a*3+1]+positions[b*3+1]+positions[c*3+1])/3;
        if(depth<(continuousJoin?5:3)&&Math.abs(this.track.surface(x,z,route.id,s).height+.014-y)>(continuousJoin?.035:.12)){const ab=midpoint(a,b),bc=midpoint(b,c),ca=midpoint(c,a);refine(a,ab,ca,depth+1);refine(ab,b,bc,depth+1);refine(ca,bc,c,depth+1);refine(ab,bc,ca,depth+1);}else refined.push(a,b,c);};
      for(let i=0;i<indices.length;i+=3)refine(indices[i],indices[i+1],indices[i+2]);
      const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(refined);g.computeVertexNormals();const deck=this.track.id==='toybox'&&route.id==='books'?this.material(0xf2dfb5):this.track.id==='rally'&&route.id==='mudline'?this.material(0x75543e):planks;deck.side=THREE.DoubleSide;this.mesh(g,deck,0,0,0);
      for(let s=route.start+4;s<route.end-3;s+=3.5){
        const p=this.track.at(s,route.id),yaw=Math.atan2(p.tx,p.tz);
        if(!['vietnam','volcano','glacier','coast','nyc','vegas','candy','atlantis','toybox','barnyard','rally','dc'].includes(this.track.theme??'')){const line=this.mesh(new THREE.BoxGeometry(route.halfWidth*2,.04,.065),edge,p.x,(p.y??0)+.042,p.z);line.rotation.order='YXZ';line.rotation.y=yaw;line.rotation.z=p.bank??0;}
        const merged=s<route.start+19||s>route.end-20;
        if(!merged)for(const side of [-1,1]){
          if(this.track.railAt&&!this.track.railAt(s,side,route.id))continue;
          const x=p.x+p.nx*route.barrier*side,z=p.z+p.nz*route.barrier*side;
          if(this.track.id==='toybox'){const lip=this.mesh(new THREE.BoxGeometry(.5,1.1,3.6),this.material(0xdf7144),x,(p.y??0)+.65,z);lip.rotation.order='YXZ';lip.rotation.y=yaw;lip.rotation.x=-Math.atan(((this.track.at(s+1.5,route.id).y??0)-(this.track.at(s-1.5,route.id).y??0))/3);continue;}
          this.mesh(new THREE.CylinderGeometry(.14,.17,1.3,7),post,x,(p.y??0)+.65,z);
          const rail=this.mesh(new THREE.BoxGeometry(.13,.16,3.55),edge,x,(p.y??0)+.8,z);rail.rotation.y=yaw;
        }
      }
      const entry=this.track.at(route.start),ahead=this.track.at(route.start+35,route.id),main=this.track.at(route.start+35),side=Math.sign((ahead.x-main.x)*entry.nx+(ahead.z-main.z)*entry.nz)||-1;
      this.sign((side>0?'← ':'→ ')+route.name.toUpperCase(),'',this.track.at(route.start-38),side*(this.track.halfWidth+7),'#11696c',10);


    }
  }
  private buildPads(){
    const cream=new THREE.MeshBasicMaterial({color:0xffffd5});
    for(const pad of this.track.boostPads??[]){
      const p=this.track.at(pad.s,pad.route),x=p.x+p.nx*pad.lane,z=p.z+p.nz*pad.lane,yaw=Math.atan2(p.tx,p.tz),root=new THREE.Group();root.position.set(x,(p.y??0)+Math.tan(p.bank??0)*pad.lane+.04,z);root.rotation.set(0,yaw,p.bank??0);this.group.add(root);
      this.mesh(new THREE.BoxGeometry(pad.width,.08,pad.length),this.padMaterial,0,0,0,root);
      for(const side of [-1,1])this.mesh(new THREE.BoxGeometry(.12,.05,pad.length),cream,side*pad.width*.5,.08,0,root);
      const flow=new THREE.Group();root.add(flow);this.flows.push(flow);
      for(const along of [-2,0,2])for(const side of [-1,1]){const bar=this.mesh(new THREE.BoxGeometry(.18,.04,1.7),cream,side*.58,.09,along,flow);bar.rotation.y=side*-.8;}
    }
  }
  private buildPickups(){
    const blue=new THREE.MeshStandardMaterial({color:0x70e4dd,emissive:0x0b6867,emissiveIntensity:.4,metalness:.15,roughness:.3});
    const star=new THREE.MeshBasicMaterial({color:0xffe58c});
    for(const pickup of this.track.pickups??[]){const p=this.track.at(pickup.s,pickup.route),root=new THREE.Group();root.position.set(p.x+p.nx*pickup.lane,(p.y??0)+Math.tan(p.bank??0)*pickup.lane+1.2,p.z+p.nz*pickup.lane);root.userData.baseY=(p.y??0)+Math.tan(p.bank??0)*pickup.lane;this.group.add(root);
      this.mesh(new THREE.OctahedronGeometry(.85),blue,0,0,0,root);const ring=this.mesh(new THREE.TorusGeometry(1.02,.07,5,16),star,0,0,0,root);ring.rotation.x=Math.PI/2;this.pickups.set(pickup.id,root);}
  }
  private buildHazard(){
    const h=this.track.hazard;if(!h)return;this.group.add(this.crab);const orange=this.material(0xee7450),dark=this.material(0x163f47),white=this.material(0xffeabd);
    if(this.track.theme==='factory'){
      this.mesh(new THREE.BoxGeometry(2,1.3,2.2),this.material(0xf0ad48),0,.8,0,this.crab);this.mesh(new THREE.BoxGeometry(1.2,1.7,.9),dark,0,1.7,-.4,this.crab);
      for(const side of [-1,1]){this.mesh(new THREE.BoxGeometry(.18,2,.2),dark,side*.65,1.1,1,this.crab);this.mesh(new THREE.BoxGeometry(.18,.18,1.4),dark,side*.65,.3,1.4,this.crab);}
    }else if(this.track.theme==='orbital'){
      this.mesh(new THREE.IcosahedronGeometry(1.1,1),this.material(0xf1d994),0,1.2,0,this.crab);
      for(const side of [-1,1])this.mesh(new THREE.BoxGeometry(2.2,.12,1.6),this.material(0x708fdb),side*1.9,1.2,0,this.crab);
      this.mesh(new THREE.ConeGeometry(.7,.4,12),white,0,2.4,0,this.crab);
    }else if(this.track.theme==='hotel'){
      const ghost=new THREE.MeshStandardMaterial({color:0xa9ede0,emissive:0x347b86,emissiveIntensity:.4,transparent:true,opacity:.9,flatShading:true});
      this.mesh(new THREE.ConeGeometry(1.2,2.4,9),ghost,0,1.6,0,this.crab);this.mesh(new THREE.SphereGeometry(.72,10,7),ghost,0,2.7,0,this.crab);
      this.mesh(new THREE.CylinderGeometry(.72,.72,.22,10),this.material(0x976caa),0,3.27,0,this.crab);
      for(const side of [-1,1])this.mesh(new THREE.SphereGeometry(.14,7,5),dark,side*.25,2.76,.63,this.crab);
      this.mesh(new THREE.BoxGeometry(2.8,.3,1.8),this.material(0xc5a26b),0,.4,0,this.crab);
      this.mesh(new THREE.BoxGeometry(.8,1.1,1.4),this.material(0x93667e),1,.95,0,this.crab);
      for(const side of [-1,1])this.mesh(new THREE.SphereGeometry(.25,8,6),dark,side*1,.2,.6,this.crab);
    }else{
    const shell=this.mesh(new THREE.SphereGeometry(1,10,7),orange,0,.62,0,this.crab);shell.scale.set(1.45,.72,1.05);
    for(const side of [-1,1]){
      for(let i=0;i<3;i++){const leg=this.mesh(new THREE.CapsuleGeometry(.1,1.1,3,5),orange,side*1.25,.35,(i-1)*.5,this.crab);leg.rotation.z=side*1.05;this.crabLegs.push(leg);}
      this.mesh(new THREE.CylinderGeometry(.07,.1,.7,6),orange,side*.55,1.2,.4,this.crab);
      this.mesh(new THREE.SphereGeometry(.24,8,6),white,side*.55,1.58,.4,this.crab);this.mesh(new THREE.SphereGeometry(.12,8,6),dark,side*.55,1.58,.59,this.crab);
      const claw=this.mesh(new THREE.IcosahedronGeometry(.58,0),orange,side*1.55,.8,.75,this.crab);claw.scale.set(1.1,.7,1.3);
    }
    }
    const p=this.track.at(h.s);this.crab.rotation.y=Math.atan2(p.nx,p.nz);
    this.sign(this.track.theme==='hotel'?'BELLHOP CROSSING':this.track.theme==='factory'?'FORKLIFT CROSSING':this.track.theme==='orbital'?'SATELLITE CROSSING':'CRAB CROSSING','↔',this.track.at(h.s-28),this.track.halfWidth+4,'#c76742',10);
    for(const side of [-1,1]){const lamp=this.mesh(new THREE.SphereGeometry(.4,8,6),new THREE.MeshBasicMaterial({color:0xffb333}),p.x+p.nx*15*side,(p.y??0)+2.1,p.z+p.nz*15*side);this.lamps.push(lamp);}
    for(let lane=-6;lane<=6;lane+=2){const warning=this.mesh(new THREE.BoxGeometry(1.2,.03,1.6),this.material(0xf7bd60),p.x+p.nx*lane-p.tx*7,(p.y??0)+.045,p.z+p.nz*lane-p.tz*7);warning.rotation.y=Math.atan2(p.tx,p.tz);}
  }
  private buildMachinery(){
    for(const h of authoredCourse(this.track.id)?[]:this.track.hazards??[]){const root=new THREE.Group(),p=this.track.at(h.s,h.route),metal=this.material(0x415464),yellow=this.material(0xe9ab49);this.group.add(root);root.rotation.y=Math.atan2(p.tx,p.tz);this.machinery.set(h.id,root);
      if(['trap','napalm','bomb','lava','log','rockfall','ghost','icefall','tide','crab','traffic','construction','fountain','syrup','current','jellyfish','toytrain','marble'].includes(h.kind)){
        root.userData.timed=true;
        if(h.kind==='traffic'||h.kind==='toytrain'){this.mesh(new THREE.BoxGeometry(3.5,1.1,1.8),this.material(h.kind==='traffic'?0xf5c25c:0x7aa8d8),0,.8,0,root);this.mesh(new THREE.BoxGeometry(1.8,.8,1.6),this.material(0x436373),0,1.6,0,root);for(const x of [-1.1,1.1])for(const z of [-.9,.9])this.mesh(new THREE.SphereGeometry(.4,7,5),this.material(0x293f4b),x,.4,z,root);}
        else if(h.kind==='fountain'||h.kind==='current'){for(let i=0;i<6;i++){const jet=this.mesh(new THREE.CylinderGeometry(.15,.45,4,7),new THREE.MeshBasicMaterial({color:0x87def3,transparent:true,opacity:.7}),Math.sin(i)*h.radius*.5,2,Math.cos(i)*h.radius*.5,root);if(h.kind==='current')jet.rotation.z=.9;}}
        else if(h.kind==='syrup'){const puddle=this.mesh(new THREE.SphereGeometry(h.radius,12,6),this.material(0xaa6f29),0,.1,0,root);puddle.scale.y=.13;}
        else if(h.kind==='marble'){this.mesh(new THREE.SphereGeometry(h.radius,12,8),this.material(0x7798d7),0,h.radius,0,root);const stripe=this.mesh(new THREE.TorusGeometry(h.radius,.18,5,20),this.material(0xf8c985),0,h.radius,0,root);stripe.rotation.x=.7;}
        else if(h.kind==='jellyfish'){this.mesh(new THREE.SphereGeometry(h.radius,12,6,0,Math.PI*2,0,Math.PI/2),new THREE.MeshStandardMaterial({color:0xe7aee5,transparent:true,opacity:.75,emissive:0x58385c}),0,2,0,root);for(let i=0;i<5;i++)this.mesh(new THREE.CylinderGeometry(.08,.05,2,5),this.material(0xe9c7ef),Math.sin(i),1,Math.cos(i),root);}
        else if(h.kind==='construction'){if(this.track.theme==='candy')this.mesh(new THREE.CylinderGeometry(h.radius,h.radius,3,10),this.material(0xffe7d6),0,1.5,0,root);else{this.mesh(new THREE.BoxGeometry(h.radius*2,1.3,.6),yellow,0,1.2,0,root);for(const x of [-h.radius,h.radius])this.mesh(new THREE.BoxGeometry(.2,2,.2),metal,x,1,0,root);}}
        else
        if(h.kind==='log'){const log=this.mesh(new THREE.CylinderGeometry(.65,.65,h.radius*2.2,9),this.material(0x735d3f),0,1,0,root);log.rotation.z=Math.PI/2;}
        else if(h.kind==='rockfall')this.mesh(new THREE.IcosahedronGeometry(h.radius,0),this.material(0x8b6460),0,h.radius*.7,0,root);
        else if(h.kind==='icefall')for(let k=0;k<5;k++){const shard=this.mesh(new THREE.ConeGeometry(.65,3+k%2,5),this.material(0xb4f2ff),Math.sin(k*3)*h.radius*.55,1,Math.cos(k*3)*h.radius*.55,root);shard.rotation.z=Math.PI;}
        else if(h.kind==='ghost'&&this.track.theme==='orbital'){this.mesh(new THREE.TorusGeometry(h.radius,.4,6,24),new THREE.MeshBasicMaterial({color:0x8df4fa}),0,2.2,0,root);this.mesh(new THREE.OctahedronGeometry(1.3),new THREE.MeshBasicMaterial({color:0xf5a4e8}),0,2.2,0,root);}
        else if(h.kind==='ghost'){this.mesh(new THREE.ConeGeometry(h.radius,3,8),new THREE.MeshStandardMaterial({color:0xb8f5ee,emissive:0x4e97ac,emissiveIntensity:.5,transparent:true,opacity:.8}),0,1.5,0,root);for(const side of [-1,1])this.mesh(new THREE.SphereGeometry(.22,6,4),this.material(0x183652),side*.5,2.2,-1,root);}
        else if(h.kind==='tide'){this.mesh(new THREE.SphereGeometry(h.radius,12,6),new THREE.MeshStandardMaterial({color:0x72dee1,transparent:true,opacity:.75}),0,.1,0,root);}
        else if(h.kind==='crab'){const body=this.mesh(new THREE.SphereGeometry(h.radius*.8,10,6),this.material(0xf38654),0,.7,0,root);body.scale.y=.6;for(const side of [-1,1]){this.mesh(new THREE.SphereGeometry(.5,7,5),this.material(0xe46f45),side*h.radius,.8,.8,root);for(let i=0;i<3;i++){const leg=this.mesh(new THREE.BoxGeometry(h.radius,.14,.15),this.material(0xe46f45),side*h.radius*.7,.3,(i-1)*.5,root);leg.rotation.z=side*.2;}}}
        else if(h.kind==='trap')for(let i=0;i<7;i++){const a=i*Math.PI*2/7;this.mesh(new THREE.ConeGeometry(.22,1.8,5),this.material(0xc4a768),Math.sin(a)*h.radius*.65,.7,Math.cos(a)*h.radius*.65,root);}
        else for(let i=0;i<9;i++){const a=i*Math.PI*2/9;this.mesh(new THREE.ConeGeometry(.55,2.5+(i%3),5),new THREE.MeshBasicMaterial({color:i%2?0xffc85e:0xef6c35}),Math.sin(a)*h.radius*.6,1,Math.cos(a)*h.radius*.6,root);}
      }else if(h.kind==='press'||h.kind==='door'){
        this.mesh(h.kind==='press'?new THREE.CylinderGeometry(h.radius,h.radius,.8,12):new THREE.BoxGeometry(h.radius*2,3,.5),h.kind==='press'?yellow:this.material(0xa679b7),0,h.kind==='press'?.7:1.5,0,root);
        if(h.id==='Sliding bookshelf'){for(let row=0;row<3;row++)for(let book=0;book<8;book++)this.mesh(new THREE.BoxGeometry(.35,.64,.4),this.material([0x67a9a1,0x9f726d,0xd3b783][(book+row)%3]),(book-3.5)*.45,.6+row*.8,-.45,root);}
        for(const side of [-1,1])this.mesh(new THREE.BoxGeometry(.25,11,.25),metal,p.x+p.nx*(side*(h.route==='main'?this.track.halfWidth+2:8)),(p.y??0)+5.5,p.z+p.nz*(side*(h.route==='main'?this.track.halfWidth+2:8)));
      }else if(h.kind==='crane'){
        this.mesh(new THREE.BoxGeometry(h.radius*1.65,2.5,h.radius*1.65),yellow,0,1.35,0,root);this.mesh(new THREE.CylinderGeometry(.065,.065,8,5),metal,0,6.5,0,root);
      }else if(h.kind==='meteor'){
        this.mesh(new THREE.IcosahedronGeometry(h.radius,1),this.material(0xa77778),0,h.radius*.65,0,root);const trail=this.mesh(new THREE.ConeGeometry(1,8,6),new THREE.MeshBasicMaterial({color:0xffb570,transparent:true,opacity:.5}),0,6,0,root);trail.rotation.z=-.35;
      }else {
        const ring=this.mesh(new THREE.TorusGeometry(h.radius,.2,6,16),yellow,0,1.8,0,root);ring.rotation.x=Math.PI/2;this.mesh(new THREE.CylinderGeometry(.06,.06,7,6),metal,0,5.2,0,root);
        for(let i=0;i<6;i++)this.mesh(new THREE.SphereGeometry(.23,6,4),new THREE.MeshBasicMaterial({color:0xffe3aa}),Math.sin(i*Math.PI/3)*h.radius,1.8,Math.cos(i*Math.PI/3)*h.radius,root);
      }
      this.sign(h.id.toUpperCase(),'⚠  ↔',this.track.at(h.s-36,h.route),-(h.route==='main'?this.track.halfWidth+4:9),'#6c4265',11);
      const zone=this.mesh(new THREE.TorusGeometry(h.radius+.8,.09,4,20),new THREE.MeshBasicMaterial({color:0xffc66d}),p.x+p.nx*h.lane,(p.y??0)+Math.tan(p.bank??0)*h.lane+.08,p.z+p.nz*h.lane);zone.rotation.x=Math.PI/2;zone.quaternion.premultiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0,Math.atan2(p.tx,p.tz),p.bank??0,'YXZ')));root.userData.zone=zone;
    }
    for(const belt of this.track.conveyors??[]){const p=this.track.at(belt.s),root=new THREE.Group();root.position.set(p.x+p.nx*belt.lane,(p.y??0)+.045,p.z+p.nz*belt.lane);root.rotation.y=Math.atan2(p.tx,p.tz);this.group.add(root);
      this.mesh(new THREE.BoxGeometry(belt.width,.08,belt.length),this.material(0x293f4f),0,0,0,root);const strips=new THREE.Group();root.add(strips);
      for(let z=-belt.length/2+2;z<belt.length/2-2;z+=2)this.mesh(new THREE.BoxGeometry(belt.width-.3,.04,.2),this.material(belt.force>0?0x82dfcc:0xf3bd6e),0,.09,z,strips);
      this.belts.push({group:strips,direction:Math.sign(belt.force)});this.sign(belt.force>0?'EXPRESS BELT':'RETURN BELT',belt.force>0?'↑':'← PASS',this.track.at(belt.s-belt.length/2-15),-16,'#6f532c',10);
    }
  }
  update(race:RaceSimulation,time:number){this.encounters?.render(race);
    for(const h of race.mechanics.dynamicHazards){const root=this.machinery.get(h.id);if(root){root.position.set(h.x,h.y,h.z);if(root.userData.timed){const falling=h.kind==='rockfall'||h.kind==='icefall';root.visible=h.active||falling&&h.warning;root.scale.y=falling?1:.9+Math.sin(race.elapsed*11)*.15;if(falling&&h.warning){const def=this.track.hazards!.find(d=>d.id===h.id)!,phase=((race.elapsed+def.phase)%def.period)/def.period;root.position.y+=12*(1-Math.pow(Math.max(0,Math.min(1,(phase-.22)/.12)),2));}}const zone=root.userData.zone as THREE.Mesh;const def=this.track.hazards!.find(d=>d.id===h.id)!,p=this.track.at(def.s,def.route);zone.position.set(h.x,(p.y??0)+Math.tan(p.bank??0)*h.lateral+.08,h.z);(zone.material as THREE.MeshBasicMaterial).color.setHex(h.active?0xf77b61:h.warning?0xffd278:0x78ddc6);zone.scale.setScalar(h.warning?1+Math.sin(time*12)*.12:1);}}
    for(const b of this.belts)b.group.position.z=(time*3%2)*b.direction;
    for(const [id,root]of this.pickups){root.visible=(race.items.pickupCooldowns.get(id)??0)<=0;root.rotation.y=time*1.6;root.position.y=(root.userData.baseY??0)+1.3+Math.sin(time*2.5+root.position.x)*.14;}
    this.flows.forEach(f=>f.position.z=(time*3)%2-1);
    this.bursts.forEach((m,i)=>{const b=race.items.bursts[i];m.visible=!!b;if(b){m.position.set(b.x,b.y,b.z);m.scale.setScalar(1+(1-b.life/.5)*((b.radius??5)-1));const mat=m.material as THREE.MeshBasicMaterial;mat.opacity=b.life*1.7;mat.color.setHex(b.blocked?0x84fff0:0xffd38c);}});
    this.padMaterial.emissiveIntensity=.5+Math.sin(time*6)*.18;
    this.crab.position.set(race.mechanics.hazard.x,race.mechanics.hazard.y,race.mechanics.hazard.z);
    this.crabLegs.forEach((leg,i)=>{leg.rotation.x=Math.sin(race.elapsed*13+i)*.35;});
    for(const lamp of this.lamps)(lamp.material as THREE.MeshBasicMaterial).color.setHex(Math.sin(race.elapsed*9)>0?0xffa52f:0xa65a35);
    this.syncItems(race.items,time);for(const [id,ring]of this.stormRings.entries()){const r=race.racers[id];ring.visible=!!r&&race.items.storms.some(s=>s.targets.includes(id));if(r){ring.position.set(r.state.x,r.state.y+3.7,r.state.z);ring.scale.setScalar(1+Math.sin(time*22)*.15);}}
  }
  private removeDynamic(root:THREE.Group){root.removeFromParent();const mats=new Set<THREE.Material>();root.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material])if(m!==this.coconutMaterial&&m!==this.boltMaterial)mats.add(m);}});for(const m of mats)m.dispose();}
  private syncItems(items:ItemSystem,time:number){
    const active=new Set(items.projectiles.map(p=>p.id));for(const [id,mesh]of this.projectiles)if(!active.has(id)){this.removeDynamic(mesh);this.projectiles.delete(id);}
    for(const p of items.projectiles){let root=this.projectiles.get(p.id);if(!root){root=new THREE.Group();this.group.add(root);this.projectiles.set(p.id,root);const orb=new THREE.Group();root.add(orb);
      if(p.kind==='ember'){this.mesh(new THREE.IcosahedronGeometry(.62,1),new THREE.MeshBasicMaterial({color:0xff6a35}),0,0,0,orb);this.mesh(new THREE.SphereGeometry(.37,8,5),new THREE.MeshBasicMaterial({color:0xffe89b}),0,.1,.1,orb);}else if(p.kind==='pineapple'){const fruit=this.mesh(new THREE.IcosahedronGeometry(.9,1),this.material(0xf2b935),0,0,0,orb);fruit.scale.y=1.35;for(let i=0;i<5;i++){const leaf=this.mesh(new THREE.ConeGeometry(.22,1,4),this.material(0x82be58),Math.sin(i)*.25,1.2,Math.cos(i)*.25,orb);leaf.rotation.z=(i-2)*.2;}}else this.mesh(new THREE.IcosahedronGeometry(.9,2),this.coconutMaterial,0,0,0,orb);
      if(p.kind==='seeker')for(const side of [-1,1]){const wing=this.mesh(new THREE.ConeGeometry(.7,2.1,3),this.material(0x92eaff),side*1.2,.4,0,root);wing.rotation.z=side*1.15;}
      this.mesh(new THREE.TorusGeometry(.91,.045,5,16),this.material(0xf4cc81),0,0,0,orb);
      for(const [x,y] of [[-.23,.2],[.23,.2],[0,-.2]])this.mesh(new THREE.SphereGeometry(.12,6,5),this.material(0x3c3024),x,y,.82,orb);
      const trail=this.mesh(new THREE.ConeGeometry(.55,3.5,6),this.boltMaterial,0,0,-2,root);trail.rotation.x=-Math.PI/2;
    }root.position.set(p.x,p.y,p.z);root.rotation.y=Math.atan2(p.vx,p.vz);root.children[0].rotation.x=-p.age*14;}
    const traps=new Set(items.traps.map(t=>t.id));for(const [id,mesh]of this.traps)if(!traps.has(id)){this.removeDynamic(mesh);this.traps.delete(id);}
    for(const trap of items.traps){let root=this.traps.get(trap.id);if(!root){root=new THREE.Group();const husk=this.mesh(new THREE.SphereGeometry(.78,8,5,0,Math.PI*2,0,Math.PI/2),this.coconutMaterial,0,.6,0,root);husk.rotation.x=Math.PI;this.mesh(new THREE.CylinderGeometry(.72,.6,.12,8),this.material(0xffefc7),0,.6,0,root);for(const side of [-1,1]){const leaf=this.mesh(new THREE.ConeGeometry(.35,.95,4),this.material(0x9bca56),side*.55,.85,0,root);leaf.rotation.z=-side;}this.group.add(root);this.traps.set(trap.id,root);}root.position.set(trap.x,trap.y,trap.z);root.rotation.z=Math.sin(time*5)*.09;}
  }
}
