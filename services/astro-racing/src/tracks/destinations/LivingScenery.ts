import {riverActionCourt} from './riverActionCourt';
import {enclosurePanel,doorway,structural} from '../enclosure';
import * as T from 'three';
import { DestinationTrack } from './track';
import { clearScenery } from '../sceneryClearance';
import { mergeStatic } from '../../core/mergeStatic';
import { random } from '../../core/math';
/** Bounded scene objects; animated ornaments never decide collision outcomes. */
export class LivingScenery {
 readonly static=new T.Group();readonly moving=new T.Group();private mats=new Map<number,T.Material>();private rng=random(606);
 private animated:{root:T.Object3D;kind:string;base:T.Vector3;phase:number}[]=[];
 constructor(readonly track:DestinationTrack,scene:T.Scene){scene.add(this.static,this.moving);this.static.name='living-world-static';this.moving.name='living-world-motion';
  if(track.id==='glacier')this.glacier(scene);if(track.id==='vietnam')this.jungle();if(track.id==='volcano')this.lava();if(track.id==='sunspun-tour')this.coast();if(track.id==='moonbell')this.hotel();if(track.id==='orbital')this.cosmos();if(track.id==='factory')this.factory();this.enrich();clearScenery(this.static,track);mergeStatic(this.static);
 }
 private mat(c:number){if(!this.mats.has(c))this.mats.set(c,new T.MeshStandardMaterial({color:c,roughness:.72,flatShading:true}));return this.mats.get(c)!;}
 private mesh(g:T.BufferGeometry,c:number|T.Material,x:number,y:number,z:number,parent:T.Object3D=this.static){const m=new T.Mesh(g,typeof c==='number'?this.mat(c):c);m.position.set(x,y,z);parent.add(m);return m;}
 private box(c:number|T.Material,x:number,y:number,z:number,w:number,h:number,d:number,parent:T.Object3D=this.static){return this.mesh(new T.BoxGeometry(w,h,d),c,x,y,z,parent);}
 private group(f:number,lane:number,route='main',moving=false){const p=this.track.at(f*this.track.length,route),g=new T.Group();g.position.set(p.x+p.nx*lane,p.y??0,p.z+p.nz*lane);g.rotation.y=Math.atan2(p.tx,p.tz);(moving?this.moving:this.static).add(g);return g;}
 private clear(g:T.Group,radius=5){return ![this.track.samples,...this.track.routes.map(r=>r.samples)].some(points=>points.some((p,i)=>i%4===0&&Math.hypot(p.x-g.position.x,p.z-g.position.z)<this.track.halfWidth+radius&&Math.abs((p.y??0)-g.position.y)<20));}
 private animate(root:T.Object3D,kind:string,phase=0){if(root instanceof T.Group&&['ghost','furniture','planet','meteor'].includes(kind))mergeStatic(root);this.animated.push({root,kind,base:root.position.clone(),phase});}
 private label(text:string,g:T.Object3D,y=4,width=12){const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d')!;ctx.fillStyle='#153f59';ctx.fillRect(0,0,512,128);ctx.fillStyle='#f1f7df';ctx.font='bold 34px Trebuchet MS';ctx.textAlign='center';ctx.fillText(text,256,78);const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;const m=this.mesh(new T.PlaneGeometry(width,width/4),new T.MeshBasicMaterial({map:texture}),0,y,0,g);m.rotation.y=Math.PI;this.box(0x416d88,0,y/2,0,.3,y,.3,g);}
 private glacier(scene:T.Scene){scene.background=new T.Color(0x9fd5ed);scene.fog=new T.Fog(0xb9e0ef,230,780);
  const snow=this.mat(0xeaf4ee),roof=new T.MeshStandardMaterial({color:0x82bbd1,emissive:0x294b68,emissiveIntensity:.5,roughness:.7}),ice=new T.MeshStandardMaterial({color:0x72bedf,transparent:true,opacity:.25,roughness:.22,metalness:.1,depthWrite:false});
  const ground=this.mesh(new T.PlaneGeometry(2200,2200),0xd9e7e6,-70,-18,-30);ground.rotation.x=-Math.PI/2;
  for(let i=0;i<44;i++){const a=i*2.399,g=this.group(i/44,90+(i%4)*26);if(!this.clear(g,55)){g.removeFromParent();continue;}const mountain=this.mesh(new T.ConeGeometry(35+i%5*8,80+i%7*10,6),i%2?0x98bccc:0xc6dce3,0,10,0,g);mountain.rotation.y=a;this.mesh(new T.ConeGeometry(21+i%4*3,43,6),snow,0,49,0,g);}
  for(const [f,text]of [[.205,'GLACIER ARCHIVE'],[.32,'BLUE ICE'],[.66,'DAYLIGHT EXIT']] as const)this.label(text,this.group(f,-22),5,15);
  for(const [i,f]of [.28,.385,.49,.59].entries()){
   const g=this.group(f,27);g.name=['Frozen mammoth','Ammonite archive','Ancient ship','Unexplained saucer'][i];
   this.box(0x98cde2,0,-.8,0,20,2,19,g);this.box(0x689fbf,12,8,0,2,18,24,g);this.box(roof,0,18,0,26,3,26,g);const exhibit=new T.Group();g.add(exhibit);exhibit.rotation.y=-Math.PI/2;
   if(i===0){const body=this.mesh(new T.SphereGeometry(4,10,7),0x795c65,0,5,0,exhibit);body.scale.set(1.2,1,1.7);this.mesh(new T.SphereGeometry(2.7,10,7),0x91736f,0,6,5,exhibit);for(const x of [-2.8,2.8])for(const z of [-3,3])this.mesh(new T.CylinderGeometry(.9,1.1,5,7),0x80636a,x,2,z,exhibit);const trunk=this.mesh(new T.TorusGeometry(2.5,.65,6,14,Math.PI),0x80636a,0,4,6.8,exhibit);trunk.rotation.y=Math.PI/2;for(const x of [-1.8,1.8]){const tusk=this.mesh(new T.ConeGeometry(.55,5,8),0xffedc7,x,4.7,7,exhibit);tusk.rotation.x=.8;}}
   if(i===1){for(let n=0;n<5;n++){const shell=this.mesh(new T.TorusGeometry(3.7-n*.65,.45,6,22,Math.PI*1.8),0xc2ab86,0,5,0,exhibit);shell.rotation.z=n*.55;}for(let j=0;j<5;j++){const fish=this.mesh(new T.ConeGeometry(.8,3,5),0x8f9fab,4,3+j,2-j,exhibit);fish.rotation.z=Math.PI/2;}}
   if(i===2){const hull=this.mesh(new T.SphereGeometry(1,12,6),0x7a6657,0,3,0,exhibit);hull.scale.set(4,2,7);this.box(0x5d5654,0,7,0,.5,11,.5,exhibit);this.box(0xe0d5b4,0,8.5,.2,7,5,.25,exhibit);for(const side of [-1,1])this.box(0x413b45,side*3,4,0,.25,.5,10,exhibit);}
   if(i===3){const ship=this.mesh(new T.SphereGeometry(1,14,8),0x9e93c1,0,5,0,exhibit);ship.scale.set(6,1.4,6);this.mesh(new T.SphereGeometry(2.4,12,8),0x8be3d3,0,6.2,0,exhibit);for(let n=0;n<10;n++)this.mesh(new T.SphereGeometry(.3,6,4),new T.MeshBasicMaterial({color:0xffdf8c}),Math.sin(n)*5.7,5,Math.cos(n)*5.7,exhibit);}
   this.box(ice,0,6.2,0,18,14,18,g);this.label(['THE TUNDRA WALKER','SPIRAL SEA','THE LOST VOYAGER','CATALOGUE: UNKNOWN'][i],g,1.3,13);
  }
  for(const route of this.track.routes){for(let s=route.start+20;s<route.end-20;s+=18){const p=this.track.at(s,route.id);if(this.track.samples.some((q,i)=>i%3===0&&Math.hypot(q.x-p.x,q.z-p.z)<this.track.halfWidth+route.halfWidth+3))continue;const g=this.group(s/this.track.length,0,route.id);for(const side of [-1,1])this.box(0xa1dce7,side*(route.halfWidth+1.7),3,0,2,8,5,g);if(route.id==='ice-tunnel')this.box(ice,0,8,0,17,2,5,g);else this.mesh(new T.ConeGeometry(1,3,5),snow,route.halfWidth+3,3,0,g);}}
 }
 private jungle(){
  for(let i=0;i<360;i++){const f=this.rng(),lane=(this.rng()>.5?1:-1)*(18+this.rng()*37),g=this.group(f,lane);if(!this.clear(g,3)||riverActionCourt(this.track,g.position.x,g.position.z)){g.removeFromParent();continue;}const height=7+this.rng()*16;this.mesh(new T.CylinderGeometry(.3,.7,height,5),0x68513d,0,height/2-2,0,g);for(let k=0;k<3;k++){const canopy=this.mesh(new T.IcosahedronGeometry(3.3+k,0),[0x2c6a48,0x4d8354,0x286650][k],Math.sin(i+k)*2,height-k*3,Math.cos(i)*2,g);canopy.scale.y=.7;}for(let k=0;k<3;k++){const leaf=this.mesh(new T.ConeGeometry(2,2.8,4),0x5b9256,k-1,0,2,g);leaf.rotation.z=(k-1)*.5;}if(i%5===0)this.mesh(new T.CylinderGeometry(.09,.09,height*.7,4),0x52783d,2,height*.55,0,g);}
  for(const [f,side]of [[.18,1],[.65,-1],[.82,1]]){const g=this.group(f,34*side);this.box(0x596b42,0,1.5,0,8,3,6,g);this.box(0x8c9670,0,3.2,0,9,.4,7,g);for(let i=0;i<5;i++)this.box(0x8d825a,(i-2)*2,.6,6,1.8,1.2,1.2,g);this.label(side>0?'US OUTPOST':'VC OUTPOST',g,4,8);}
  for(let i=0;i<5;i++){const g=this.group(.10+i*.17,42*(i%2?1:-1),'main',true);g.position.y+=15;this.mesh(new T.CapsuleGeometry(1.3,3,3,7),0x455e4c,0,0,0,g).rotation.x=Math.PI/2;this.box(0x6d7c5b,0,0,-4,.4,.5,5,g);const rotor=this.box(0x314b48,0,1.7,0,11,.12,.28,g);this.animate(rotor,'rotor');this.animate(g,'helicopter',i);}
  for(let i=0;i<12;i++){const g=this.group(.14+i*.06,27*(i%2?1:-1),'main',true);const burst=this.mesh(new T.IcosahedronGeometry(3,0),new T.MeshBasicMaterial({color:i%2?0xffb654:0xff7351}),0,3,0,g);this.animate(burst,'explosion',i*1.7);}
  // Checkpoint 24 green cover/angled roots, raised and connected into a
  // continuous supported passage. The old 8 m roof was culled by clearance.
  const tunnel=this.track.routes.find(r=>r.id==='jungle');
  if(tunnel){const w=tunnel.halfWidth+4;
   for(let s=tunnel.start+16;s<tunnel.end-16;s+=3){const e=Math.min(tunnel.end-16,s+3.05);
    this.static.add(enclosurePanel(this.track,s,e,'jungle',-w,w,12,12,this.mat(0x2e704b),'Root Tunnel canopy','ceiling'));
    for(const side of [-1,1])if(!doorway(this.track,s,side*w,'jungle'))this.static.add(enclosurePanel(this.track,s,e,'jungle',side*w,side*(w+.8),1,12,this.mat(0x315c46),'Root Tunnel foliage wall','wall'));
   }
   for(let s=tunnel.start+18;s<tunnel.end-16;s+=11){const g=this.group(s/this.track.length,0,'jungle');
    for(const side of [-1,1]){if(doorway(this.track,s,side*w,'jungle'))continue;const root=structural(this.box(0x594f39,side*(w+.2),5.5,0,.9,12,1,g),'fixture','Root Tunnel angled support');root.rotation.z=-side*.12;}
    structural(this.box(0x594f39,0,11.5,0,w*2+.8,.6,1,g),'fixture','Root Tunnel roof beam');
   }
  }

 }
 private lava(){const glow=new T.MeshBasicMaterial({color:0xff773a});
  for(let i=0;i<9;i++){const g=this.group(.20+i*.047,30*(i%2?1:-1));if(!this.clear(g,8)){g.removeFromParent();continue;}this.box(0x593a47,0,-6,0,12,35,9,g);const fall=this.box(glow,0,-4,-5,5,31,.3,g);fall.name='Lavafall';for(let k=0;k<4;k++){const streak=this.box(new T.MeshBasicMaterial({color:0xffc752}),0,-k*7,-5.3,3,1.5,.3,this.moving);streak.position.add(g.position);this.animate(streak,'lava',k);}}
 }
 private coast(){const p=this.track.at(.31*this.track.length),x=p.x+p.nx*50,z=p.z+p.nz*50;
  this.mesh(new T.CylinderGeometry(25,39,(p.y??0)+27,10),0x9c9378,x,((p.y??0)-27)/2,z);this.mesh(new T.CylinderGeometry(27,29,2,16),0x7fae78,x,(p.y??0)-2,z);
  for(let i=0;i<14;i++){const a=i*Math.PI/7,rx=x+Math.sin(a)*23,rz=z+Math.cos(a)*23;if(this.track.samples.some(q=>Math.hypot(q.x-rx,q.z-rz)<22))continue;const rock=this.mesh(new T.IcosahedronGeometry(1,0),i%2?0xb9a47d:0x938970,rx,(p.y??0)-14-i%3*3,rz);rock.scale.set(8+i%3,17+i%4*2,8+i%2*3);rock.rotation.y=a;}
  for(let i=0;i<20;i++){const a=i*2.4;this.mesh(new T.IcosahedronGeometry(5+i%4,0),0xb9a47d,x+Math.sin(a)*25,-15+i%5*3,z+Math.cos(a)*25);}
  for(let i=0;i<3;i++){const g=this.group(.12+i*.3,44,'main',true);g.position.y+=38;this.box(0xf8d079,0,0,0,1.5,1.4,9,g);this.box(0x69babc,0,.2,0,13,.35,2,g);this.box(0xe77c67,0,1,-3,5,.4,1,g);this.box(0x345862,0,0,-9,.08,.08,9,g);this.box(0xffedba,0,0,-16,9,3,.1,g);const banner=new T.Group();banner.position.z=-16.1;g.add(banner);this.label('SUN CLUB / FLY HAPPY',banner,0,9);this.animate(g,'plane',i*2);}
  for(let i=0;i<40;i++){const f=i/40,g=this.group(f,20+(i%3)*6);if(g.position.y>8||this.track.profile(f*this.track.length).ramp||!this.clear(g,3)){g.removeFromParent();continue;}g.position.y-=1.5;if(i%3===0){this.mesh(new T.ConeGeometry(3,1.2,8),i%2?0xf49276:0x76c6bc,0,4,0,g);this.box(0xcbb581,0,2,0,.2,4,.2,g);}else{this.box(0xf3e2ab,0,.2,0,3,.3,6,g);this.box(0x559bae,0,.4,0,2.5,.2,5.8,g);}}
  const b=this.track.routes[0];for(let s=b.start+45;s<b.end-35;s+=16){const g=this.group(s/this.track.length,0,b.id);for(const side of [-1,1])this.box(0x859993,side*9,4,0,4,10,17,g);this.box(0x91a89e,0,10,0,23,4,17,g);}
 }
 private hotel(){const glow=new T.MeshBasicMaterial({color:0x8be6dd,transparent:true,opacity:.48,depthWrite:false});
  for(let i=0;i<24;i++){const g=this.group(.11+i*.029,i%2?17:-17,'main',true);this.mesh(new T.SphereGeometry(1.2,8,6),glow,0,3,0,g);this.mesh(new T.ConeGeometry(1.8,3,8),glow,0,1,0,g);for(const x of [-.38,.38])this.mesh(new T.SphereGeometry(.18,6,4),0x183d51,x,3.1,-1,g);this.animate(g,'ghost',i);}
  for(let i=0;i<12;i++){const g=this.group(.12+i*.015,i%2?14:-14);g.rotation.y+=(i%2?1:-1)*Math.PI/2;this.box(0xd7ae69,0,5,0,3,4,.3,g);this.box(0x423152,0,5,-.2,2.5,3.5,.1,g);this.mesh(new T.SphereGeometry(.7,8,6),0xa7a5c6,0,5.4,-.4,g);}
  const b=this.track.routes.find(r=>r.id==='balcony');if(b)for(let s=b.start+20;s<b.end-20;s+=12){const g=this.group(s/this.track.length,0,b.id);for(const side of [-1,1]){this.box(0xa68aaa,side*6.4,1.5,0,.5,3,.5,g);this.mesh(new T.SphereGeometry(.3,7,5),glow,side*6.4,3.1,0,g);}}
 }
 private cosmos(){const colors=[0xff6abc,0xffc654,0x79f4a9,0x64defb,0xaf8bff];
  for(let i=0;i<18;i++){const g=this.group(i/18,40*(i%2?1:-1),'main',true);const ring=this.mesh(new T.TorusGeometry(9+i%4*3,.4,5,48),new T.MeshBasicMaterial({color:colors[i%5]}),0,12,0,g);ring.rotation.x=.5;this.animate(ring,'orbit',i);}
  for(let i=0;i<7;i++){const g=this.group(.10+i*.12,100*(i%2?1:-1));for(let k=0;k<6;k++){const ribbon=this.box(new T.MeshBasicMaterial({color:colors[(i+k)%5],transparent:true,opacity:.16,depthWrite:false}),k*10,80+Math.sin(k)*12,0,10,60,1,g);ribbon.rotation.z=.4;}}
 }
 private factory(){for(let i=0;i<12;i++){const g=this.group(.08+i*.065,19*(i%2?1:-1),'main',true);const gear=this.mesh(new T.TorusGeometry(2.4,.6,4,12),0xe7ac55,0,5,0,g);for(let k=0;k<8;k++)this.box(0xe7ac55,Math.sin(k*Math.PI/4)*2.7,Math.cos(k*Math.PI/4)*2.7,0,.7,.7,.7,gear);this.animate(gear,'gear',i);}}
 private enrich(){
  const id=this.track.id;
  if(id==='vietnam'){
   // Layered terrain and canopy continue along both choices, not only the loop.
   for(let i=0;i<42;i++){const g=this.group(i/42,110+(i%4)*28);if(!this.clear(g,55)){g.removeFromParent();continue;}this.mesh(new T.ConeGeometry(42,55+i%5*12,6),i%2?0x54735b:0x728364,0,-5,0,g);}
   for(const b of this.track.routes)for(let s=b.start+25;s<b.end-20;s+=13)for(const side of [-1,1]){const g=this.group(s/this.track.length,side*(b.halfWidth+13),b.id);g.userData.clearanceUnit=true;if(!this.clear(g,6)||riverActionCourt(this.track,g.position.x,g.position.z)){g.removeFromParent();continue;}const h=14+(s%8);this.mesh(new T.CylinderGeometry(.45,.9,h,5),0x605441,0,h/2-2,0,g);for(let k=0;k<3;k++){const crown=this.mesh(new T.IcosahedronGeometry(5,0),[0x315c46,0x42774c,0x607f4e][k],k-1,h-k*3,0,g);crown.scale.y=.6;}}
   for(const route of ['main',...this.track.routes.map(b=>b.id)]){const b=this.track.routes.find(b=>b.id===route),start=b?.start??0,end=b?.end??this.track.length;for(let s=start+60;s<end-25;s+=125){const f=s/this.track.length,g=this.group(f,36,route,true);for(let k=0;k<4;k++){const puff=this.mesh(new T.IcosahedronGeometry(2+k,1),new T.MeshBasicMaterial({color:0x56685b,transparent:true,opacity:.27,depthWrite:false}),k,6+k*5,0,g);this.animate(puff,'smoke',s+k);}
    const fight=this.group(f,-31,route,true);for(let k=0;k<4;k++){const flash=this.box(new T.MeshBasicMaterial({color:0xffd37e}),0,2+k*.3,k*2,.12,.12,7,fight);this.animate(flash,'tracer',s+k*.21);}this.box(0x53654a,0,1,0,7,2,4,fight);}}
  }
  if(id==='volcano')for(let i=0;i<24;i++){const g=this.group(.08+i*.034,27*(i%2?1:-1),'main',true);const plume=this.mesh(new T.ConeGeometry(1.5,8,7),new T.MeshBasicMaterial({color:0xfead4b,transparent:true,opacity:.55}),0,1,0,g);this.animate(plume,'vent',i*.8);}
  if(id==='moonbell'){
   for(const route of ['main',...this.track.routes.map(b=>b.id)]){const b=this.track.routes.find(b=>b.id===route),start=b?.start??this.track.length*.14,end=b?.end??this.track.length*.86;for(let s=start+22;s<end-22;s+=102){const g=this.group(s/this.track.length,(b?b.halfWidth+11:23)*(Math.round(s)%2?1:-1),route,true);this.box(0x826979,0,2.4,0,6,.7,3,g);for(const x of [-2.4,2.4])for(const z of [-1,1])this.box(0x694f62,x,1.2,z,.35,2.5,.35,g);this.mesh(new T.ConeGeometry(1.5,1.9,8),new T.MeshBasicMaterial({color:0xf4cc93}),0,5,0,g);this.box(0xd5aa81,0,3.6,0,.25,2,.25,g);this.animate(g,'furniture',s);}}
   for(let f=.18;f<.7;f+=.075){const g=this.group(f,0);for(const x of [-6,6])this.mesh(new T.OctahedronGeometry(.8),new T.MeshBasicMaterial({color:0xb4a9e9}),x,12,0,g);this.box(0x84749f,0,13,0,13,.2,.2,g);this.box(0x84749f,0,15,0,.2,4,.2,g);}
  }
  if(id==='glacier')for(const b of this.track.routes){const p=this.group((b.start-28)/this.track.length,-24);this.mesh(new T.OctahedronGeometry(3),new T.MeshBasicMaterial({color:0x61cde0}),0,5,0,p);this.box(0x277291,0,2,0,2,4,2,p);}
  if(id==='orbital'){
   for(let i=0;i<7;i++){const g=this.group(i/7,170*(i%2?1:-1),'main',true);g.position.y+=40-i*8;this.mesh(new T.SphereGeometry(20+i*3,16,12),[0x735c93,0x4a88a4,0xbd8b68][i%3],0,0,0,g);const ring=this.mesh(new T.TorusGeometry(34+i*3,1.5,5,70),new T.MeshBasicMaterial({color:0xc6a8db}),0,0,0,g);ring.rotation.x=1.15;this.animate(g,'planet',i);}
   for(let i=0;i<14;i++){const g=this.group(i/14,90,'main',true);g.position.y+=60;const rock=this.mesh(new T.IcosahedronGeometry(1.8,0),0x90a9c5,0,0,0,g);this.box(new T.MeshBasicMaterial({color:0x98b6de,transparent:true,opacity:.22}),0,0,-10,1,1,20,g);this.animate(g,'meteor',i);}
  }
  if(id==='factory')for(let f=.05;f<.94;f+=.09){const g=this.group(f,26);for(const side of [-1,1])this.box(0x586d78,side*4,4,0,.8,8,.8,g);this.box(0xe4ad57,0,8,0,12,1,1,g);this.mesh(new T.CylinderGeometry(1.4,1.4,5,8),0x70818b,0,5,0,g);}
 }
 update(time:number,quality='high'){for(const [i,a] of this.animated.entries()){const {root,base,phase}=a,t=time+phase;root.visible=quality!=='mobile'||i%2===0;if(!root.visible)continue;
  if(a.kind==='smoke'){root.position.y=base.y+(t*.8%9);root.scale.setScalar(1+Math.sin(t*.2)*.15);}
  if(a.kind==='tracer'){root.visible=t%3<.14;root.position.z=base.z+(t%3)*18;}
  if(a.kind==='vent'){root.visible=t%6<.7;root.scale.y=.15+Math.sin((t%6)/.7*Math.PI)*.9;}
  if(a.kind==='furniture'){root.position.y=base.y+Math.sin(t)*.7;root.rotation.y=Math.sin(t*.8)*.12;}
  if(a.kind==='planet')root.rotation.y=t*.035;
  if(a.kind==='meteor'){root.position.x=base.x+Math.sin(t*.04)*80;root.position.y=base.y+Math.cos(t*.04)*30;}
  if(a.kind==='rotor')root.rotation.y=t*23;
  if(a.kind==='gear')root.rotation.z=t*.5;
  if(a.kind==='orbit'){root.rotation.z=t*.12;root.rotation.y=t*.18;}
  if(a.kind==='ghost'){root.position.y=base.y+Math.sin(t*1.4)*1.5;root.rotation.y=Math.sin(t*.6)*.3;}
  if(a.kind==='helicopter'){root.position.x=base.x+Math.sin(t*.3)*12;root.position.y=base.y+Math.sin(t)*2;}
  if(a.kind==='plane'){root.position.x=base.x+Math.sin(t*.1)*100;root.position.z=base.z+Math.cos(t*.1)*60;root.rotation.y=t*.1;}
  if(a.kind==='lava')root.position.y=base.y-(t*4%7);
  if(a.kind==='explosion'){const f=(t%8)/8;root.visible=f<.15;root.scale.setScalar(.5+f*16);}
 }}
}
