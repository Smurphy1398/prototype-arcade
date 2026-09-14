import {riverActionCourt} from './riverActionCourt';
import {enclosurePanel,structural} from '../enclosure';
import * as THREE from 'three';
import { DestinationTrack } from './track';
import { clearScenery } from '../sceneryClearance';
import { mergeStatic } from '../../core/mergeStatic';
import { random } from '../../core/math';

/** Authored destination scenery; motion consumes time and never awards progress. */
export class WildScenery {
 readonly group=new THREE.Group();
 readonly moving=new THREE.Group();
 private rng=random(505);
 private mats=new Map<number,THREE.Material>();
 private helicopters:{root:THREE.Group;rotor:THREE.Group;s:number;phase:number}[]=[];
 private plane?:THREE.Group;
 private tracers:THREE.Mesh[]=[];
 private fire:THREE.Mesh[]=[];
 private bombs:THREE.Mesh[]=[];
 constructor(readonly track:DestinationTrack,scene:THREE.Scene){
  scene.add(this.group,this.moving);this.terrain();
  if(track.id==='vietnam')this.jungle();else this.volcano();
  clearScenery(this.group,track);mergeStatic(this.group);
 }
 private mat(color:number,glow=false){const key=color+(glow?0x1000000:0);if(!this.mats.has(key))this.mats.set(key,glow?new THREE.MeshBasicMaterial({color}):new THREE.MeshStandardMaterial({color,roughness:.9,flatShading:true}));return this.mats.get(key)!;}
 private mesh(g:THREE.BufferGeometry,c:number,x:number,y:number,z:number,parent:THREE.Object3D=this.group,glow=false){const m=new THREE.Mesh(g,this.mat(c,glow));m.position.set(x,y,z);parent.add(m);return m;}
 private box(c:number,x:number,y:number,z:number,w:number,h:number,d:number,yaw=0,parent:THREE.Object3D=this.group){const m=this.mesh(new THREE.BoxGeometry(w,h,d),c,x,y,z,parent);m.rotation.y=yaw;return m;}
 private at(s:number,lane:number,route='main'){const p=this.track.at(s,route);return {x:p.x+p.nx*lane,y:(p.y??0)+Math.tan(p.bank??0)*lane,z:p.z+p.nz*lane,yaw:Math.atan2(p.tx,p.tz)};}
 private clearRoad(x:number,z:number,height:number){for(const route of [{samples:this.track.samples},...this.track.routes])for(let i=0;i<route.samples.length;i+=3){const p=route.samples[i];if(Math.hypot(p.x-x,p.z-z)<this.track.halfWidth+8)height=Math.min(height,(p.y??0)-4);}return height;}
 private groundAt(x:number,z:number){let distance=Infinity,height=-20;for(const route of [{samples:this.track.samples,id:'main'},...this.track.routes])for(let i=0;i<route.samples.length;i+=3){const p=route.samples[i],d=Math.hypot(p.x-x,p.z-z);if(d<distance){distance=d;height=(p.y??0)-2-Math.max(0,d-this.track.halfWidth)*.5;}}if(this.track.id==='volcano'&&Math.hypot(x+120,z-305)<88&&distance>this.track.halfWidth+4)height=Math.min(height,25);return Math.max(-25,height);}
 private sign(text:string,detail:string,f:number,lane=14){if(lane)lane=Math.sign(lane)*Math.max(Math.abs(lane),this.track.halfWidth+10);const height=lane?6:12;const p=this.at(f*this.track.length,lane),c=document.createElement('canvas');c.width=1024;c.height=256;const ctx=c.getContext('2d')!;ctx.fillStyle=this.track.id==='vietnam'?'#263b2c':'#342c37';ctx.fillRect(0,0,1024,256);ctx.strokeStyle='#edbc6c';ctx.lineWidth=10;ctx.strokeRect(10,10,1004,236);ctx.fillStyle='#fff1cb';ctx.textAlign='center';ctx.font='bold 64px Trebuchet MS';ctx.fillText(text,512,108);ctx.font='bold 29px Trebuchet MS';ctx.fillText(detail,512,188);const map=new THREE.CanvasTexture(c);map.colorSpace=THREE.SRGBColorSpace;const m=new THREE.Mesh(new THREE.PlaneGeometry(14,3.5),new THREE.MeshBasicMaterial({map,side:THREE.FrontSide}));m.position.set(p.x,p.y+height,p.z);m.rotation.y=p.yaw+Math.PI;this.group.add(m);if(lane)this.box(0x514634,p.x,p.y+3,p.z,.4,6,.4);else{const main=this.track.at(f*this.track.length),span=this.track.halfWidth+4;for(const side of [-1,1])this.box(0x514634,p.x+main.nx*span*side,p.y+6,p.z+main.nz*span*side,.6,12,.6);this.box(0x514634,p.x,p.y+13.8,p.z,span*2,.5,.5,p.yaw);}}
 private terrain(){
  const t=this.track,vietnam=t.id==='vietnam';
  // Continuous terrain removes floating tree bases and joins the authored skirts.
  const groundPos:number[]=[],groundIndices:number[]=[],size=90,step=10;
  for(let iz=0;iz<=size;iz++)for(let ix=0;ix<=size;ix++){const x=-600+ix*step,z=-360+iz*step;groundPos.push(x,this.clearRoad(x,z,this.groundAt(x,z)-3),z);if(ix<size&&iz<size){const a=iz*(size+1)+ix;groundIndices.push(a,a+size+1,a+1,a+1,a+size+1,a+size+2);}}
  const ground=new THREE.BufferGeometry();ground.setAttribute('position',new THREE.Float32BufferAttribute(groundPos,3));ground.setIndex(groundIndices);ground.computeVertexNormals();this.mesh(ground,vietnam?0x49663c:0x44363f,0,0,0).userData.terrain=true;
  // A continuous skirt under each drivable sector: road elevation and actual bank
  // define its top. Broad lower slopes overlap beneath it, never through pavement.
  const pos:number[]=[],indices:number[]=[],lanes=[-52,-24,-(t.halfWidth+.7),t.halfWidth+.7,24,52];
  const n=Math.ceil(t.length/5);
  for(let i=0;i<=n;i++){const s=t.length*i/n,p=t.at(s);for(const lane of lanes){const outer=Math.abs(lane),drop=outer>30?35:outer>t.halfWidth+1?9:1.7,x=p.x+p.nx*lane,z=p.z+p.nz*lane;let y=(p.y??0)+Math.tan(p.bank??0)*lane-drop;if(!vietnam&&Math.hypot(x+120,z-305)<100&&outer>t.halfWidth+1)y=Math.min(y,25);pos.push(x,this.clearRoad(x,z,y),z);}if(i<n&&!t.profile(s+2.5).gap)for(let k=0;k<5;k++){const j=i*6+k;indices.push(j,j+6,j+1,j+1,j+6,j+7);}}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(indices);g.computeVertexNormals();this.mesh(g,vietnam?0x455e35:0x56434a,0,0,0).userData.terrain=true;
  for(let s=0;s<t.length;s+=24){const p=t.at(s);if(t.profile(s).gap||t.samples.some(q=>Math.abs(q.s-s)>35&&Math.abs(q.s-s)<t.length-35&&Math.hypot(q.x-p.x,q.z-p.z)<t.halfWidth*2+15&&(q.y??0)>(p.y??0)-38&&(q.y??0)<(p.y??0)+3))continue;const pillar=this.mesh(new THREE.CylinderGeometry(t.halfWidth+1,t.halfWidth+9,30,7),vietnam?0x617146:0x5b4545,p.x,(p.y??0)-17,p.z);pillar.rotation.y=s;}
 }
 private palm(s:number,lane:number){const p=this.at(s,lane);if(riverActionCourt(this.track,p.x,p.z)||this.track.samples.some(q=>Math.hypot(q.x-p.x,q.z-p.z)<this.track.halfWidth+9)||this.track.routes.some(r=>r.samples.some(q=>Math.hypot(q.x-p.x,q.z-p.z)<r.halfWidth+8)))return;
  p.y=this.groundAt(p.x,p.z)-4;
  const h=15+this.rng()*8;this.mesh(new THREE.CylinderGeometry(.45,.9,h,6),0x726145,p.x,p.y+h/2,p.z);
  for(let i=0;i<5;i++){const a=i*Math.PI*2/5,leaf=this.mesh(new THREE.SphereGeometry(1,5,3),i%2?0x3e7847:0x709255,p.x+Math.sin(a)*3,p.y+h,p.z+Math.cos(a)*3);leaf.scale.set(1.2,.6,6);leaf.rotation.y=a;leaf.rotation.x=.24;}
  const crown=this.mesh(new THREE.IcosahedronGeometry(4,0),0x456e39,p.x,p.y+h-1,p.z);crown.scale.y=.6;
 }
 private helicopter(f:number,phase:number){const root=new THREE.Group(),rotor=new THREE.Group();this.moving.add(root);
  const body=this.mesh(new THREE.SphereGeometry(1,12,8),0x536344,0,0,0,root);body.scale.set(2,1.6,4.3);
  const glass=this.mesh(new THREE.SphereGeometry(1,12,8),0x8dc3b8,0,.45,2.5,root);glass.scale.set(1.8,1.3,2);
  this.box(0x3e4d34,0,.3,-6,.7,.8,6,0,root);this.box(0x536344,0,1.4,-8,.5,3,2,0,root);
  for(const side of [-1,1]){this.box(0x273931,side*2,-1.9,0,.15,.15,6,0,root);this.box(0x273931,side*1.5,-1.25,-.6,.15,1.4,.2,0,root);}
  root.add(rotor);rotor.position.y=2.2;this.box(0x22342d,0,0,0,19,.1,.55,0,rotor);this.box(0x22342d,0,0,0,.55,.1,19,0,rotor);
  this.helicopters.push({root,rotor,s:f*this.track.length,phase});
 }
 private jungle(){
  const t=this.track;
  for(let s=10;s<t.length;s+=19)for(const side of [-1,1]){this.palm(s,(19+this.rng()*12)*side);if(s%57<19)this.palm(s,(40+this.rng()*12)*side);}
  // River passes beneath the ridge and through the low ford.
  const a=t.at(t.length*.37,'river'),water=this.mesh(new THREE.CircleGeometry(105,48),0x4e9890,a.x,-2,a.z);water.rotation.x=-Math.PI/2;water.scale.set(1,1.8,1);
  for(const f of [.20,.52]){const p=t.at(t.length*f),yaw=Math.atan2(p.tx,p.tz);for(const side of [-1,1]){this.box(0x584b35,p.x+p.nx*11*side,(p.y??0)-3,p.z+p.nz*11*side,1,15,1,yaw);this.box(0xa38855,p.x+p.nx*10.5*side,(p.y??0)+1,p.z+p.nz*10.5*side,.3,.3,24,yaw);}for(let s=f*t.length-12;s<f*t.length+12;s+=1.8){const q=t.at(s);this.box(0xb6a477,q.x,(q.y??0)-.35,q.z,t.halfWidth*2+.8,.5,1.7,Math.atan2(q.tx,q.tz));}}
  for(const [f,side,us] of [[.365,1,1],[.40,-1,0],[.67,1,1]] as number[][]){const p=this.at(f*t.length,side*28),color=us?0x6c7550:0x544c3e;
    const base=this.groundAt(p.x,p.z)-5;this.box(0x68714b,p.x,(p.y+base)/2,p.z,20,Math.max(2,p.y-base),16,p.yaw);
    this.box(color,p.x,p.y+2,p.z,13,4,8,p.yaw);const roof=this.mesh(new THREE.ConeGeometry(10,4,4),us?0x737d54:0x71674e,p.x,p.y+5,p.z);roof.rotation.y=p.yaw+Math.PI/4;
    for(let i=-3;i<=3;i++)for(let row=0;row<2;row++){const q=this.at(f*t.length+i*1.9,side*18);this.box(0x9a895c,q.x,q.y+.55+row*.75,q.z,2,1,1.5,q.yaw);}
    for(let i=0;i<4;i++){const q=this.at(f*t.length+(i-1.5)*4,side*21);this.mesh(new THREE.CapsuleGeometry(.35,.9,3,6),color,q.x,q.y+1,q.z);this.mesh(new THREE.SphereGeometry(.36,7,5),0xc7986a,q.x,q.y+1.9,q.z);const helmet=this.mesh(us?new THREE.SphereGeometry(.44,8,5,0,Math.PI*2,0,Math.PI/2):new THREE.ConeGeometry(.55,.35,8),color,q.x,q.y+2.1,q.z);this.box(0x28342f,q.x,q.y+1.3,q.z+side*.5,.12,.12,1.4,p.yaw);}
    this.sign(us?'US RIVER OUTPOST':'VIET CONG POSITION','BACKGROUND ACTION',f,side*28);
  }
  for(let i=0;i<10;i++){const p=this.at(t.length*(.365+i*.004),0);const m=this.mesh(new THREE.BoxGeometry(.12,.12,4),0xffdc8a,p.x,p.y+3,p.z,new THREE.Group(),true);this.moving.add(m);m.userData.s=t.length*(.365+i*.004);this.tracers.push(m);}
  this.helicopter(.39,0);this.helicopter(.68,3);
  this.plane=new THREE.Group();this.moving.add(this.plane);this.box(0x656b60,0,0,0,1.4,1.3,12,0,this.plane);this.box(0x656b60,0,0,-1,17,.3,3,0,this.plane);this.box(0x656b60,0,1,-5,5,.3,2,0,this.plane);
  for(let i=0;i<3;i++){const m=this.mesh(new THREE.CapsuleGeometry(.4,1.2,3,7),0x36372d,0,0,0,new THREE.Group());this.moving.add(m);this.bombs.push(m);}
  this.sign('VIETNAM FLASHBACKS','',.005,0);this.sign('BAMBOO ALLEY','⚠  KEEP RIGHT',.075,-14);this.sign('RIVER OR RIDGE','← FORD  /  RIDGE →',.285,-14);this.sign('LANDING ZONE','⚠  KEEP RIGHT',.64,-14);
 }
 private volcano(){
  const t=this.track;
  const lava=this.mesh(new THREE.CircleGeometry(86,56),0xf26e36,-120,33,305,this.group,true);lava.rotation.x=-Math.PI/2;
  for(let i=0;i<8;i++){const ring=this.mesh(new THREE.TorusGeometry(15+i*8,.45,4,44),i%2?0xffac46:0xb93332,-120,33.2,305,this.group,true);ring.rotation.x=Math.PI/2;}
  for(let s=0;s<t.length;s+=28){const p=t.at(s);for(const side of [-1,1]){const q=this.at(s,side*(18+this.rng()*8));if(Math.hypot(q.x+120,q.z-305)<108||t.samples.some(a=>Math.hypot(a.x-q.x,a.z-q.z)<t.halfWidth+10))continue;const rock=this.mesh(new THREE.IcosahedronGeometry(1,0),side>0?0x66515b:0x40323c,q.x,q.y-1,q.z);rock.scale.set(8,9+this.rng()*8,7);}
   if(s/t.length>.23&&s/t.length<.49){const q=this.at(s,-t.halfWidth-.8);this.mesh(new THREE.OctahedronGeometry(.65),0xffaa5c,q.x,q.y+1,q.z,this.group,true);}}
  for(let s=t.length*.50;s<t.length*.595;s+=6){const p=t.at(s);this.box(0xee6336,p.x,(p.y??0)-3.8,p.z,38,.3,8,Math.atan2(p.tx,p.tz));}
  // Checkpoint 24 basalt cavern; continuous side rock and overhead volume
  // follow the current (repaired) road rather than restoring the old physics.
  for(let s=t.length*.50;s<t.length*.595;s+=3){const e=Math.min(t.length*.595,s+3.04),w=t.widthAt(s)+4;
   for(const side of [-1,1]){
    this.group.add(enclosurePanel(t,s,e,'main',side*w,side*(w+1.4),-2,15,this.mat(0x413240),'Volcano cavern rock wall','wall'));
    this.group.add(enclosurePanel(t,s,e,'main',side*w,side*(w-.25),.3,.5,this.mat(0xee6336,true),'Cavern lava fissure','floor'));
   }
   this.group.add(enclosurePanel(t,s,e,'main',-w-1.4,w+1.4,15,15,this.mat(0x40303c),'Volcano cavern roof','ceiling'));
  }
  for(let s=t.length*.505;s<t.length*.59;s+=15){const p=t.at(s);for(const side of [-1,1]){const q=this.at(s,side*(t.widthAt(s)+3));
   const crystal=structural(this.mesh(new THREE.ConeGeometry(.7,3,5),0xffab52,q.x,q.y+3,q.z,this.group,true),'fixture','Cavern amber crystal');crystal.rotation.z=side*.3;
  }}
  for(let i=0;i<16;i++){const p=this.at(t.length*(.52+i*.004),i%2?-12:12),m=this.mesh(new THREE.ConeGeometry(.7,3,5),i%2?0xffc75d:0xee6535,p.x,p.y+.8,p.z,new THREE.Group(),true);this.moving.add(m);this.fire.push(m);}
  this.sign('VOLCANO','',.005,0);this.sign('CALDERA RIM','OPEN EDGE',.22,-15);this.sign('VENT CROSSING','⚠  VENTS',.29,-15);this.sign('INTO THE HEART','CAVERN',.48,0);this.sign('SWITCHBACK DESCENT','BRAKE',.64,-15);
 }
 update(time:number){
  for(const h of this.helicopters){const p=this.at(h.s,Math.sin(time*.27+h.phase)*45);h.root.position.set(p.x,p.y+20+Math.sin(time*.8+h.phase)*3,p.z);h.root.rotation.set(Math.sin(time)*.035,p.yaw+Math.PI/2,Math.sin(time*.27+h.phase)*.12);h.rotor.rotation.y=time*28;}
  if(this.plane){const phase=(time%11)/11,p=this.at(this.track.length*.68,-3.5);this.plane.position.set(p.x-180+phase*360,p.y+53,p.z);this.plane.rotation.y=Math.PI/2;
   this.bombs.forEach((m,i)=>{const fall=((time+i*.25)%11)/11;m.visible=fall>.12&&fall<.35;m.position.set(p.x+(i-1)*6,p.y+55*(1-(fall-.12)/.23),p.z+(i-1)*5);});}
  this.tracers.forEach((m,i)=>{const p=this.at(m.userData.s,Math.sin(time*5+i)*22);m.position.set(p.x,p.y+3,p.z);m.rotation.y=p.yaw+Math.PI/2;m.visible=Math.sin(time*13+i*3)>.35;});
  this.fire.forEach((m,i)=>{m.scale.set(1,1+Math.sin(time*7+i)*.3,1);});
 }
}
