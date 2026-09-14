import * as T from 'three';
import {SceneKit} from './SceneKit';
import {DestinationTrack} from './track';
import {mergeStatic} from '../../core/mergeStatic';

export class FarmLife extends SceneKit {
 constructor(track:DestinationTrack,scene:T.Scene){super(track,scene);
  // One mounted assembly owns wheel, axle, mill, millrace and outflow. Rotation
  // is around the local hub; it cannot orbit the world origin as the old wheel did.
  const mill=this.place(.805,43,'main',false,'Working watermill');
  const foundation=mill.position.y+5;
  this.box(0x8c8970,0,-(foundation+1)/2,0,34,foundation-1,62,mill);
  this.ball(0x87a366,0,-foundation-2,8,1,mill,45,foundation+.7,57);
  this.box(0x9e8f70,-7,-1,0,20,2,24,mill);this.box(0xc3af89,-7,9,0,18,18,20,mill);
  for(const side of [-1,1]){const roof=this.box(0x826f58,-7+side*5,20,0,12,1.2,25,mill);roof.rotation.z=-side*.4;}
  this.box(0x688b98,-7,11,-10.1,6,7,.2,mill);this.box(0x75573e,-7,4,-10.2,6,8,.4,mill);
  for(const z of [-4,4])this.box(0x84765c,9,4,z,2,9,2,mill);
  this.rod(0x504a3a,[1,6.8,0],[16,6.8,0],.6,mill);
  const wheelRoot=this.group(0,0,0,this.moving,'Mounted paddle wheel');
  const rotor=this.group(9,6.8,0,wheelRoot);rotor.rotation.y=Math.PI/2;
  for(const z of [-2.4,2.4]){this.ring(0x795639,0,0,z,7,.55,rotor);for(let n=0;n<10;n++){const a=n*Math.PI/5;this.rod(0x9f7847,[0,0,z],[Math.sin(a)*7,Math.cos(a)*7,z],.23,rotor);}}
  for(let n=0;n<14;n++){const a=n*Math.PI/7,paddle=this.box(0xb18a52,Math.sin(a)*7,Math.cos(a)*7,0,2,.45,5.4,rotor);paddle.rotation.z=-a;}
  mergeStatic(rotor);
  const race=this.group(9,-.35,0,mill);this.box(0x557f79,0,0,0,12,.25,56,race);for(const x of [-7,7])this.box(0x8e8462,x,.3,0,2,1,60,race);this.ball(0x71968b,0,-.3,40,1,race,23,.2,22);
  for(let n=0;n<10;n++){const drop=this.ball(0xc0e0cf,0,0,0,.23,wheelRoot);this.animations.push(t=>{const u=(t+n*.13)%1;drop.position.set(9+Math.sin(n)*2,1-u*1.7,6+u*4);});}
  this.animations.push(t=>{wheelRoot.position.copy(mill.position);wheelRoot.quaternion.copy(mill.quaternion);rotor.rotation.z=-t*.6;});
  const paddocks=[['cow',.28,-29,1.45],['pig',.34,27,1.15],['sheep',.445,-29,1.35],['horse',.48,29,1.7],['giraffe',.625,-36,2.0],['elephant',.69,35,2.3],['zebra',.738,-31,1.75],['chicken',.18,27,.8]] as const;
  for(const [kind,f,lane,size]of paddocks){
   const pen=this.place(f,lane,'main',false,kind+' living paddock');
   const ground=pen.position.y+5;
   this.box(0x929268,0,-ground/2,0,28,ground,24,pen);
   this.ball(0x87a366,0,-ground,0,1,pen,24,ground-.5,21);
   this.box(0x82a064,0,-2,0,28,3,24,pen);this.box(0xb19a70,0,-4,0,28,1.2,24,pen);
   for(const z of [-12,12])for(let x=-14;x<=14;x+=7){this.box(0xa1845e,x,1,z,.3,2.8,.3,pen);this.box(0xd1b380,x,1.5,z,7,.25,.25,pen);}
   for(const x of [-14,14])this.box(0xc3a375,x,1.5,0,.25,.25,24,pen);
   const herd=this.group(0,0,0,this.moving,kind+' animated herd');
   for(let n=0;n<(kind==='chicken'?4:2);n++){
    const a=this.animal(herd,kind,size),bodyParts=new T.Group();
    // Name/rig parts locally so all feet move and the head can graze separately.
    const legs=a.children.filter(o=>o instanceof T.Mesh&&(o.geometry as T.CylinderGeometry).parameters?.height===2);
    for(const leg of legs)leg.removeFromParent();
    for(const child of [...a.children])bodyParts.add(child);a.add(bodyParts);mergeStatic(bodyParts);
    const feet:T.Group[]=[];for(const x of [-.8,.8])for(const z of [-1.3,1.3]){const leg=this.group(x,1.8,z,a);this.cyl(kind==='pig'?0xe59ca9:kind==='elephant'?0x8e9da5:0xb49a74,0,-.8,0,.22,1.6,leg);this.box(0x5a5549,0,-1.55,-.1,.5,.3,.65,leg);mergeStatic(leg);feet.push(leg);}
    const tail=this.group(0,2.8,2,a);this.cyl(0x9d8b6a,0,0,.4,.09,1.2,tail).rotation.x=.7;const phase=f*23+n*2.6;
    this.animations.push(t=>{const u=t*.24+phase,walking=Math.sin(u*.7)>.0,pace=walking?1:.08;a.position.set(Math.sin(u)*5+(n-.5)*5,0,Math.cos(u)*4);a.rotation.y=u+Math.PI/2;bodyParts.rotation.x=walking?Math.sin(t*5+phase)*.035:.12+Math.sin(t+phase)*.06;feet.forEach((leg,i)=>leg.rotation.x=Math.sin(t*5+phase+(i%2)*Math.PI)*.4*pace);tail.rotation.z=Math.sin(t*2+phase)*.3;});
   }
   this.animations.push(()=>{herd.position.copy(pen.position);herd.quaternion.copy(pen.quaternion);});
  }
  // Farm backdrop encloses the fields without flat green infinity.
  for(let i=0;i<18;i++){const a=i/18*Math.PI*2;this.ball(0x73965a,-140+Math.sin(a)*530,-8,Math.cos(a)*470,1,this.static,100,25+i%4*8,70);}
  this.finish();
 }
}
