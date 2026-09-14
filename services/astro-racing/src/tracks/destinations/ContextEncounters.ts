import * as T from 'three';
import {SceneKit} from './SceneKit';
import {mergeStatic} from '../../core/mergeStatic';
import {DestinationTrack} from './track';
import type {RaceSimulation} from '../../race/RaceSimulation';
import type {CourseHazard} from '../TrackDefinition';

type Model={g:T.Group;zone:T.Mesh;def:CourseHazard;animate:(time:number,lateral:number,lift:number,active:boolean)=>void};
/** Course-specific silhouettes share simulation schedules, never a fallback box.
 * Every animated collision model consumes the authoritative hazard transform. */
export class ContextEncounters extends SceneKit {
 private models=new Map<string,Model>();
 constructor(track:DestinationTrack,scene:T.Scene){super(track,scene);
  for(const h of track.hazards){
   const g=this.group(0,0,0,this.moving,h.id),body=this.group(0,0,0,g),p=track.at(h.s,h.route),motions:((t:number,l:number,lift:number,active:boolean)=>void)[]=[];
   g.rotation.y=Math.atan2(p.tx,p.tz);const r=h.radius,theme=track.id;
   if(h.kind==='traffic')this.vehicle(h,body,g,motions);
   else if(h.kind==='tractor'){
    this.box(0x598f54,0,1.3,0,4.8,1.2,2.5,body);this.box(0x6d9e63,-1.1,2.2,0,2.2,1.3,2,body);this.box(0xc9dacf,1,2.8,0,1.7,2.4,2,body);this.box(0x507482,1,3,0,1.5,1.6,2.1,body);this.box(0xeacb82,1,4.15,0,2.5,.25,2.9,body);this.cyl(0x394749,-1.5,3.4,.55,.17,2,body);this.box(0x66563f,3.2,1,0,3,.3,.3,body);
    this.box(0x9f7249,6,1.2,0,4.8,.6,3,body);for(const z of [-1.5,1.5])this.box(0xb89a66,6,2,z,5,1.5,.2,body);for(let n=0;n<4;n++)this.box(0xddb666,5+n%2*1.6,2.1,Math.floor(n/2)*1.3-.65,1.45,1.5,1.2,body);
    this.wheel(g,1.2,1.4,1.15,motions);this.wheel(g,-1.5,1.25,.72,motions);this.wheel(g,6,1.6,.8,motions);
   }else if(h.kind==='animal'){
    const a=this.animal(body,h.id.toLowerCase().includes('sheep')?'sheep':'cow',.9);a.rotation.y=Math.PI/2;for(const o of [...a.children])if(o instanceof T.Mesh&&(o.geometry as T.CylinderGeometry).parameters?.height===2)o.removeFromParent();
    // Articulated legs are attached to the moving root; body is statically batched.
    for(const x of [-1.1,1.1])for(const z of [-.65,.65]){const leg=this.group(x,1.5,z,g);this.cyl(0xe8dfc8,0,-.6,0,.22,1.2,leg);motions.push(t=>{leg.rotation.z=Math.sin(t*6+x+z*2)*.36;});}
    motions.push(t=>{body.position.y=Math.sin(t*12)*.04;});
   }else if(h.kind==='toytrain'){
    this.train(body);for(const car of body.children)for(const mesh of [...car.children])if(mesh.position.y<.7)mesh.removeFromParent();
    for(let n=0;n<3;n++)for(const x of [-1.5,1.5])this.wheel(g,n*5+x,1.5,.65,motions);
    const smoke=this.ball(0xf2e7d8,-1,4.5,0,.5,g);motions.push(t=>{smoke.position.y=4.5+(t*1.6)%2;smoke.scale.setScalar(.6+(t*1.6)%2*.35);});
    this.box(0xdfa951,2,1,0,1,.3,.3,body);this.box(0xdfa951,7,1,0,1,.3,.3,body);
   }else if(h.kind==='robot'){
    this.box(0x79aabc,0,3.8,0,2.5,2.7,1.7,body);this.box(0xe5c88c,0,6.1,0,2.8,2,2,body);for(const x of [-.65,.65])this.ball(0x273c54,x,6.3,-1.04,.28,body);this.box(0xefd798,0,5.6,-1.1,1.4,.22,.1,body);this.cyl(0x475e6b,0,7.6,0,.12,1,body);this.ball(0xdd785e,0,8.2,0,.3,body);
    for(const side of [-1,1]){const leg=this.group(side*.75,2.5,0,g);this.box(0x506b81,0,-1,0,.9,2,1.1,leg);this.box(0xe5bf7c,0,-2,-.25,1.2,.45,1.8,leg);const arm=this.group(side*1.65,4.6,0,g);this.cyl(0xa9bcc0,0,-1,0,.35,2,arm);motions.push(t=>{leg.rotation.x=Math.sin(t*4+side*Math.PI/2)*.32;arm.rotation.x=-leg.rotation.x;});}
    const key=this.group(0,3.7,1.4,g);for(const side of [-1,1])this.ring(0xc7a96e,side*.55,0,0,.5,.14,key);motions.push(t=>{key.rotation.z=t*2;});
   }else if(h.kind==='anchor'){
    this.rod(0x87a0a5,[0,1.8,0],[0,7,0],.43,body);this.rod(0x91afb0,[-r*.8,5.4,0],[r*.8,5.4,0],.28,body);
    const hook=this.mesh(new T.TorusGeometry(r*.85,.4,6,18,Math.PI),0x78999f,0,3,0,body);hook.rotation.z=Math.PI;
    for(const side of [-1,1]){const fluke=this.cone(0xacc2bb,side*r*.85,2.2,0,.68,2,body,3);fluke.rotation.z=-side*.55;}
    this.ring(0x97b3b3,0,7.4,0,.65,.18,body);
    // The chain stretches from the moving anchor to a fixed overhead wreck beam.
    const chain=this.group(0,8,0,g);for(let n=0;n<21;n++){const link=this.ring(0x739698,0,n*1.3,0,.52,.12,chain);if(n%2)link.rotation.y=Math.PI/2;}
    motions.push((t,l,lift)=>{chain.scale.y=(34-lift)/27;chain.rotation.z=lift>2?Math.sin(t*3)*.025:0;});
    const rig=this.place(h.s/track.length,0,h.route);rig.userData.structure={role:'fixture',name:'Anchor hoist and supports'};this.arch(rig,track.halfWidth*2+12,43,0x6c6354);this.box(0x514d43,h.lane,42,0,7,3,9,rig);
   }else if(['roller','marble','ball','hay'].includes(h.kind)){
    const spin=this.group(0,r,0,g),c=h.kind==='hay'?0xd6ae5a:h.kind==='ball'?0xe48373:h.kind==='roller'?0xf09eb8:0x6caccc;
    if(h.kind==='hay'){this.cyl(c,0,0,0,r,r*1.6,spin).rotation.z=Math.PI/2;for(const x of [-r*.5,r*.5])this.ring(0x9f7a3b,x,0,0,r+.02,.1,spin).rotation.y=Math.PI/2;}
    else{this.mesh(new T.SphereGeometry(r,16,12),new T.MeshStandardMaterial({color:c,roughness:h.kind==='marble'?.12:.4,metalness:.05}),0,0,0,spin);for(const a of [0,1.1,2.2]){const ring=this.ring(h.kind==='roller'?0xffedb4:0xf1dba8,0,0,0,r+.02,.13,spin);ring.rotation.x=a;ring.rotation.y=a*.7;}}
    motions.push((t,l)=>{spin.rotation.z=-l/r;spin.rotation.x=t*.6;});
    if(h.kind==='roller'){const feeder=this.place(h.s/track.length,-track.halfWidth-8,h.route);this.cyl(0xbf8771,0,5,0,3,10,feeder);this.ball(0xe8bf98,0,11,0,4,feeder);const chute=this.box(0xd4a26e,5,4,0,10,.7,4,feeder);chute.rotation.z=-.42;}
   }else if(['gate','press','door'].includes(h.kind)){
    if(theme==='candy'){this.cyl(0xf2c5a1,0,1.8,0,r,3.2,body);for(const z of [-1.2,0,1.2])this.box(0xc57c8c,0,2,z,r*1.7,.35,.2,body);this.box(0xbd8458,0,3.7,0,r*2.2,.6,3.5,body);}
    else if(theme==='atlantis'){this.box(0x6d9ea3,0,2,0,r*2,4,1.4,body);for(const x of [-r*.55,0,r*.55]){this.cyl(0xb4d7c6,x,2.3,-.8,.45,3,body);this.ring(0x84c9c4,x,3,-.9,.4,.09,body);}}
    else if(theme==='toybox'){this.box(0xe6af91,0,2,0,r*2,4,.7,body);this.box(0xbc7e80,0,2,-.4,r*1.65,3.3,.15,body);this.ball(0xe8c57b,r*.6,2,-.6,.28,body);}
    else if(theme==='barnyard'){this.box(0xb85c49,0,2,0,r*2,4,.6,body);for(const side of [-1,1]){const brace=this.box(0xeacba0,0,2,-.4,r*2,.25,.2,body);brace.rotation.z=side*.6;}}
    else if(theme==='vegas'){this.box(0x72546c,0,2,0,r*2,4,1,body);for(const x of [-r*.8,r*.8])this.box(this.mat(0xf2c983,true),x,2,-.6,.18,3.7,.1,body);this.box(0xabbfc0,0,.2,0,r*2.2,.35,3,body);}
    else {this.box(0x8a9c9a,0,1.5,0,r*2,3,.65,body);for(let y=.5;y<3;y+=.5)this.box(0xd2d6c5,0,y,-.4,r*1.9,.12,.1,body);}
    const frame=this.place(h.s/track.length,0,h.route);this.arch(frame,(track.routes.find(b=>b.id===h.route)?.halfWidth??track.halfWidth)*2+8,21,theme==='candy'?0xd6ad7b:theme==='barnyard'?0x97724c:0x647f87);
    const piston=this.cyl(0x7d8d8d,0,0,0,.22,1,g);motions.push((t,l,lift)=>{const height=Math.max(.1,20-lift-4);piston.position.set(0,4+height/2,0);piston.scale.y=height;});
   }else if(['fountain','steam','current','syrup'].includes(h.kind)){
    if(h.kind==='syrup'){
     const isMud=theme==='rally'||theme==='barnyard';this.ball(isMud?0x765438:0x895130,0,.035,0,r,body,1,.014,1);for(let n=0;n<5;n++)this.ring(isMud?0x9b7850:0xb3804e,(n-2)*r*.25,.06,Math.sin(n)*r*.4,r*.18,.035,body).rotation.x=Math.PI/2;
    }else{
     const fluid=theme==='candy'?0x9e673e:h.kind==='steam'?0xe5e1d4:0x8cdeee;
     const translucent=new T.MeshBasicMaterial({color:fluid,transparent:true,opacity:h.kind==='current'?.36:.52,depthWrite:false});
     for(let n=0;n<10;n++){const particle=this.ball(fluid,0,0,0,.25,g);particle.material=translucent;motions.push((t,l,lift,active)=>{particle.visible=active;const u=(t*(h.kind==='current'?.55:.9)+n/10)%1;if(h.kind==='current'){particle.position.set((u-.5)*r*2*Math.sign(Math.sin(t*.65)),.8+Math.sin(n)*.4,Math.cos(n)*r*.5);particle.scale.set(2,.5,.5);}else{particle.position.set(Math.sin(n*2)*r*.7,Math.sin(u*Math.PI)*4,Math.cos(n*2)*r*.6);particle.scale.set(.6,1.7,.6);}});}
     if(h.kind!=='current'){this.cyl(theme==='candy'?0xb88759:0x728b96,0,.08,0,r*.65,.14,body);for(let n=0;n<5;n++)this.cyl(0x495f6b,Math.sin(n)*r*.45,.2,Math.cos(n)*r*.45,.18,.3,body);}
    }
   }else if(h.kind==='jellyfish'){
    this.mesh(new T.SphereGeometry(r,14,8,0,Math.PI*2,0,Math.PI/2),new T.MeshStandardMaterial({color:0xde9ed9,emissive:0x6a346e,emissiveIntensity:.6,transparent:true,opacity:.72}),0,3,0,body);
    for(let n=0;n<7;n++){const leg=this.cyl(0xefc4e5,Math.sin(n)*r*.6,1.5,Math.cos(n)*r*.6,.07,3,g);motions.push(t=>{leg.rotation.z=Math.sin(t*2+n)*.18;});}
   }else if(h.kind==='lava'){
    const crust=this.cyl(0x59433e,0,.12,0,r,.24,body);
    for(let n=0;n<9;n++){const jet=this.cone(n%2?0xffbf62:0xf87535,Math.sin(n)*r*.65,2,Math.cos(n)*r*.65,.5,4,g);motions.push((time,l,lift,active)=>{jet.scale.y=active?.7+Math.sin(time*8+n)*.3:.12;});}
   }else if(h.kind==='rockfall'){
    const rock=this.group(0,r,0,g);this.mesh(new T.IcosahedronGeometry(r,1),theme==='volcano'?0x68524b:0xa87550,0,0,0,rock);
    const shelf=this.place(h.s/track.length,track.halfWidth+14,h.route);this.box(0x9f7455,0,5,0,16,14,16,shelf);this.ball(0xc29263,0,13,0,5,shelf,1.5,.5,1.4);
    motions.push((t,l)=>{rock.rotation.z=-l/r;rock.rotation.x=t*1.4;});
    for(let n=0;n<6;n++){const dust=this.ball(theme==='volcano'?0x9c7863:0xd6b18a,0,0,0,.6,g);motions.push((time,l,lift)=>{dust.position.set(Math.sin(n*2)*r*1.5,.5+(time+n)%1.2,Math.cos(n*2)*r*1.5);dust.visible=lift<1;dust.scale.setScalar(.7+(time+n)%1.2);});}
   }else if(h.kind==='construction')this.obstacle(h,body);
   else throw new Error(`No authored model for ${track.id}/${h.kind}`);
   if(h.kind==='steam'||theme==='candy'&&h.kind==='fountain'){
    const cover=this.cyl(theme==='candy'?0xb88759:0x617683,0,.2,0,r*.64,.22,g);if(theme==='candy')for(let n=0;n<7;n++)this.ball(0x704b31,Math.sin(n)*r*.43,.35,Math.cos(n)*r*.43,.17,cover);
    motions.push(time=>{const phase=((time+h.phase)%h.period)/h.period,active=phase>.30&&phase<.68;cover.position.y=active?3.4:.2+(phase>.12&&phase<.3?Math.sin(time*24)*.08:0);cover.rotation.z=active?.28:0;});
   }
   if(['rockfall','lava','steam'].includes(h.kind)||theme==='candy'&&h.kind==='fountain'){
    const sign=this.place((h.s-43)/track.length,-(track.halfWidth+5),h.route,false,'Encounter warning '+h.id);this.cyl(0x6f7c70,0,2.5,0,.15,5,sign);this.label(h.kind==='rockfall'?'ROCKFALL':h.kind==='lava'?'LAVA VENT':theme==='candy'?'HOT CHOCOLATE':'STEAM VENT',sign,13,5.7);
   }
   mergeStatic(body);
   const zone=this.ring(0xe6c071,p.x,(p.y??0)+.08,p.z,r+.35,.065,this.moving);zone.rotation.x=Math.PI/2;
   this.models.set(h.id,{g,zone,def:h,animate:(t,l,lift,active)=>{for(const f of motions)f(t,l,lift,active);}});
  }
  this.finish();
 }
 private wheel(g:T.Group,x:number,z:number,r:number,motions:((t:number,l:number,lift:number,active:boolean)=>void)[]){for(const side of [-1,1]){const pivot=this.group(x,r,side*z,g),tire=this.cyl(0x29363c,0,0,0,r,.38,pivot);tire.rotation.x=Math.PI/2;this.ball(0xd7bf83,0,0,side*.23,r*.44,pivot,1,1,.2);this.box(0x727d80,0,0,side*.25,r*1.1,.1,.08,pivot);mergeStatic(pivot);motions.push((t,l)=>{pivot.rotation.z=l/r;});}}
 private vehicle(h:CourseHazard,body:T.Group,g:T.Group,motions:((t:number,l:number,lift:number,active:boolean)=>void)[]){
  const theme=this.track.id,r=h.radius,toy=theme==='toybox',farm=theme==='barnyard',limo=theme==='vegas',delivery=/delivery|shuttle|Museum/i.test(h.id),c=toy?0xd96c65:farm?0x7da083:limo?0xd7d3e5:delivery?0x819caa:0xf1bf46;
  const length=r*1.85,width=r*.92;this.box(c,0,1,0,length,1.1,width,body);this.box(0x477a91,.2,1.85,0,length*.52,.9,width*.87,body);this.box(c,.2,2.38,0,length*.61,.18,width*.94,body);
  if(delivery){this.box(c,.8,1.9,0,length*.5,2.1,width,body);for(const z of [-width/2-.03,width/2+.03])this.box(0xd4e2d8,.8,2,z,length*.34,.6,.08,body);}
  if(farm){for(const x of [-.8,.8])this.cyl(0x42665a,x,2,0,.1,2,body);this.box(0xd8c18f,0,3,0,length,.2,width*1.3,body);}
  if(toy){this.box(0xf5d187,0,1.06,0,.45,1.2,width+.08,body);this.box(0x417b99,-length*.35,1.8,0,.3,.25,width*1.45,body);this.box(0x293d50,0,.23,0,.4,.5,.35,body);}
  for(const side of [-1,1])this.box(side<0?0xffe6a5:0xe97c6b,side*length/2,1.2,0,.07,.35,width*.65,body);
  this.wheel(g,-length*.3,width*.53,toy?.58:.52,motions);this.wheel(g,length*.3,width*.53,toy?.58:.52,motions);
 }
 private obstacle(h:CourseHazard,g:T.Group){const r=h.radius,id=this.track.id;
  if(id==='rally'){for(let n=-1;n<=1;n++)for(let row=0;row<2;row++)this.ring(n%2?0xd3bb83:0x3d4141,n*r*.55,.5+row*.7,0,r*.45,.25,g).rotation.x=Math.PI/2;}
  else if(id==='candy'){for(let n=-1;n<=1;n++){const biscuit=this.cyl(0xcb975d,n*r*.55,1,0,r*.55,.6,g);biscuit.rotation.x=Math.PI/2;for(let i=0;i<5;i++)this.ball(0x795036,n*r*.55+Math.sin(i)*r*.28,1+Math.cos(i)*r*.28,-.35,.12,g);}}
  else if(id==='toybox'){for(let n=-1;n<=1;n++){const domino=this.box(0xf1dec1,n*r*.62,1.4,0,r*.55,2.8,.55,g);domino.rotation.z=n*.13;for(const y of [.8,2])this.ball(0x345570,n*r*.62,y,-.3,.16,g);}}
  else if(id==='atlantis'){const column=this.cyl(0x78a6a8,0,1.1,0,1.05,r*2,g);column.rotation.z=Math.PI/2;for(const x of [-r,r])this.box(0xa0c1b6,x,1.1,0,.4,2.4,2.4,g);}
  else {this.box(0x617d73,0,.8,0,r*1.7,1.6,1.8,g);this.box(0xc3c5a3,0,1.55,0,r*1.85,.18,2,g);for(let n=-1;n<=1;n++){this.ball(0x5e8a64,n*r*.5,2,0,.8,g);this.ball(id==='dc'?0xe7c2c3:0xe9b878,n*r*.5,2.5,0,.35,g);}}
 }
 render(race:RaceSimulation){for(const h of race.mechanics.dynamicHazards){const m=this.models.get(h.id);if(!m)continue;const p=this.track.at(m.def.s,m.def.route);m.g.position.set(h.x,h.y,h.z);m.g.visible=h.active||h.warning||['anchor','gate','press','door','traffic','toytrain','tractor','robot'].includes(h.kind);m.animate(race.elapsed,h.lateral,h.lift,h.active);m.zone.position.set(h.x,(p.y??0)+.1,h.z);m.zone.visible=h.warning||h.active&&['anchor','rockfall','fountain'].includes(h.kind);(m.zone.material as T.MeshStandardMaterial).color.setHex(h.active?0xe79969:0xffd879);}}
}
