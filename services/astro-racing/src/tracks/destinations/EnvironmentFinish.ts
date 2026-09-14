import * as T from 'three';
import {SceneKit} from './SceneKit';
import {DestinationTrack} from './track';
import {enclosurePanel,doorway} from '../enclosure';
import {mergeStatic} from '../../core/mergeStatic';

export class EnvironmentFinish extends SceneKit {
 constructor(t:DestinationTrack,scene:T.Scene){super(t,scene);if(t.id==='atlantis')this.treasure();if(t.id==='glacier')this.cave();if(t.id==='vietnam')this.river();if(t.id==='volcano')this.lava();this.finish();this.static.name='final-environment-'+t.id;}
 private treasure(){
  const g=this.place(.58,-32,'main',true,'Poseidon treasure alcove');g.scale.setScalar(.68);this.cyl(0x658f98,0,1,0,19,2,g);this.cyl(0x8eb8b4,0,3,0,13,2,g);
  const statue=this.group(5,4,3,g);this.cone(0x7bb4ac,0,10,0,5,20,statue);this.ball(0xa1cec0,0,22,0,3,statue);this.cone(0x72a49e,0,18,-2,2.1,6,statue).rotation.z=Math.PI;
  for(const side of [-1,1])this.rod(0x8fbfb4,[side*2.5,17,0],[side*7,14,-2],1.1,statue);
  this.rod(0xd4bc79,[8,0,-2],[8,32,-2],.38,statue);for(const x of [5,8,11]){this.rod(0xd4bc79,[8,27,-2],[x,29,-2],.3,statue);this.cone(0xffdc91,x,32,-2,.55,4,statue);}for(const x of [-2,0,2])this.cone(0xd9c27f,x,26,0,.6,3,statue);
  const chest=this.group(-8,4,-5,g);this.box(0x795e49,0,2,0,10,4,7,chest);for(const x of [-4.3,4.3])this.box(0xd7b46a,x,2,-3.55,.55,4.3,.2,chest);
  const lid=this.group(0,4,3.5,chest);this.box(0x986b48,0,1,-3.5,10,2,7,lid);for(const x of [-4.3,4.3])this.box(0xdfbd6d,x,2.05,-3.5,.65,.18,7,lid);
  for(let n=0;n<14;n++)this.mesh(new T.OctahedronGeometry(.7),this.mat([0x90fff0,0xe8a2ff,0xffdb81][n%3],true),(n%5-2)*1.4,3.5+Math.sin(n),Math.floor(n/5)*1.5-2,chest);
  const glow=this.mesh(new T.ConeGeometry(4,10,12,1,true),new T.MeshBasicMaterial({color:0x91fff0,transparent:true,opacity:.14,depthWrite:false,side:T.DoubleSide}),0,9,0,chest);glow.rotation.z=Math.PI;
  this.animations.push(t=>{const open=Math.max(0,Math.sin(t*.42));lid.rotation.x=-open*1.5;glow.visible=open>.15;glow.scale.y=.6+open*.6;});
  for(const side of [-1,1]){this.cyl(0x86bbb5,side*17,12,9,1.8,24,g);this.box(0xb0d2c0,side*17,25,9,5,3,5,g);}this.box(0x88b7b3,0,28,9,38,3,6,g);
  const swimmer=this.group(-10,24,9,g);this.ball(0x9bcac4,0,2,0,1.3,swimmer);this.cone(0x76b7aa,0,-1,0,1.7,5,swimmer);this.box(0x88c5c0,0,-4,0,5,.4,2,swimmer);this.animations.push(t=>{swimmer.position.x=-10+Math.sin(t*.3)*9;swimmer.rotation.z=Math.sin(t*.9)*.1;});
 }
 private cave(){
  const t=this.track,wall=this.mat(0x286a9d),roof=this.mat(0x245785),facet=this.mat(0x478fba),ice=this.mat(0x81e3f4,true);
  // A solid outer vault backs the curved panels where successive bends have
  // different elevations. This closes sightline slits without blocking portals.
  const points=t.samples.filter(p=>p.s/t.length>.21&&p.s/t.length<.655).flatMap(p=>[-48,48].map(lane=>new T.Vector2(p.x+p.nx*lane,p.z+p.nz*lane))).sort((a,b)=>a.x-b.x||a.y-b.y);
  const cross=(a:T.Vector2,b:T.Vector2,c:T.Vector2)=>(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x),lower:T.Vector2[]=[],upper:T.Vector2[]=[];
  for(const p of points){while(lower.length>1&&cross(lower.at(-2)!,lower.at(-1)!,p)<=0)lower.pop();lower.push(p);}
  for(const p of [...points].reverse()){while(upper.length>1&&cross(upper.at(-2)!,upper.at(-1)!,p)<=0)upper.pop();upper.push(p);}
  const shape=new T.Shape([...lower.slice(0,-1),...upper.slice(0,-1)]),cap=new T.ShapeGeometry(shape),height=Math.max(...t.samples.map(p=>p.y??0),...t.routes.flatMap(b=>b.samples.map(p=>p.y??0)))+26;
  cap.rotateX(Math.PI/2);const vault=new T.Mesh(cap,roof);vault.position.y=height;vault.userData.structure={role:'ceiling',name:'Solid outer ice vault'};this.static.add(vault);
  for(let s=t.length*.225;s<t.length*.635;s+=5){const e=Math.min(s+5.04,t.length*.635),f=s/t.length;
   const display=[.28,.385,.49,.59].some(a=>Math.abs(a-f)<.018),right=42;
   for(const [side,w]of [[-1,21],[1,right]]){
    if(!doorway(t,s,side*w))this.static.add(enclosurePanel(t,s,e,'main',side*w,side*w,-8,35,wall,'Sculpted ice cavern wall','wall'));
    this.static.add(enclosurePanel(t,s,e,'main',side*w,side*14,18,23,facet,'Faceted ice vault shoulder','ceiling'));
   }
   this.static.add(enclosurePanel(t,s,e,'main',-14,14,23,23,roof,'Enclosed glacier ceiling','ceiling'));
   if(Math.floor(s/5)%4===0&&!doorway(t,s,-18,'main',14)){const g=this.place(f,-18,'main',false,'Blue cave formations');g.userData.structure={role:'fixture',name:g.name};for(const h of [2,6,10])this.mesh(new T.OctahedronGeometry(1.2),ice,0,h,0,g);const stal=this.cone(0x77bad6,0,15,0,1.6,7,g);stal.rotation.z=Math.PI;}
  }
  for(const b of t.routes.filter(b=>b.id==='ice-tunnel'))for(let s=b.start+22;s<b.end-22;s+=5){const e=Math.min(b.end-22,s+5.04),w=b.halfWidth+3.5;for(const side of [-1,1])if(!doorway(t,s,side*w,b.id))this.static.add(enclosurePanel(t,s,e,b.id,side*w,side*w,0,14,wall,'Blue ice tunnel wall','wall'));this.static.add(enclosurePanel(t,s,e,b.id,-w,w,14,14,roof,'Blue ice tunnel ceiling','ceiling'));}
  for(const f of [.28,.385,.49,.59]){const g=this.place(f,25,'main',false,'Frozen exhibit footlights');g.userData.structure={role:'fixture',name:g.name};this.cyl(0x69deed,0,.2,0,7,.2,g);for(const x of [-7,7])this.cone(0x6bbedc,x,3,0,1.8,6,g);}
 }
 private river(){
  const t=this.track,bridge=t.routes.find(b=>b.id==='river')!,s=bridge.start+(bridge.end-bridge.start)*.53,p=t.at(s,bridge.id);
  const water=this.place(s/t.length,0,bridge.id,false,'River firefight water');water.position.y=(p.y??0)-3;water.userData.structure={role:'floor',name:water.name};for(const side of [-1,1])this.box(0x447d80,side*47,-1,0,66,1,100,water);
  const boats:T.Group[]=[];
  for(const side of [-1,1]){const g=this.place(s/t.length,side*36,bridge.id,true,side<0?'US river patrol':'VC river patrol');g.position.y=(p.y??0)-2;g.rotation.y+=side*Math.PI/2;
   this.ball(side<0?0x667653:0x80694c,0,0,0,1,g,3.6,1.3,11);this.box(0x657151,0,2,0,5,3,7,g);this.box(0x557d81,0,2.7,-3.55,4,1,.1,g);this.box(0x66775b,0,4,0,7,.4,9,g);this.cyl(0x465746,0,3,-7,.18,4,g);this.rod(0x394a3e,[0,4,-7],[0,4,-12],.16,g);this.label(side<0?'US PATROL':'VC PATROL',g,9,2,'#efe9ba','#465d4a');mergeStatic(g);boats.push(g);
   const flash=this.ball(0xffd083,0,0,0,.7,this.moving);const base=g.position.clone();this.animations.push(time=>{g.position.copy(base);g.position.z+=Math.sin(time*.35+side)*5;g.rotation.z=Math.sin(time*1.6)*.02;g.updateMatrixWorld(true);flash.position.copy(g.localToWorld(new T.Vector3(0,4,-12)));flash.visible=Math.sin(time*9+side)> .65;});
  }
  for(let n=0;n<12;n++){const tracer=this.ball(0xffcd77,0,0,0,.25,this.moving,2,.45,.45),splash=this.ball(0xa9d2bf,0,0,0,.5,this.moving);this.animations.push(time=>{const u=(time*.85+n/12)%1,a=boats[n%2].position,b=boats[1-n%2].position;tracer.position.lerpVectors(a,b,u);tracer.position.y+=3+Math.sin(u*Math.PI)*2;splash.position.copy(b);splash.position.x+=(n%3-1)*3;splash.position.y=(p.y??0)-1+Math.sin(u*Math.PI)*3;splash.scale.set(.5,1+u*2,.5);splash.visible=u>.78;});}
  for(const [f,side]of [[.20,-1],[.69,1]]){const g=this.place(f,side*31,'main',false,'Jungle tank emplacement');this.box(0x55694d,0,2,0,10,4,15,g);for(const x of [-5,5])this.box(0x3e4b3d,x,1.7,0,2,3.5,16,g);this.cyl(0x6c7852,0,5,0,3.5,3,g);this.rod(0x536445,[0,6,0],[10*side,7,-6],.6,g);}
  for(const [i,f]of [.25,.52,.70].entries()){const g=this.place(f,65*(i%2?1:-1),'main',true,'Distant timed bombing');const fire=this.ball(0xffa554,0,5,0,5,g),smoke=this.ball(0x677064,0,12,0,5,g);this.animations.push(time=>{const u=(time+i*3)%11;fire.visible=u<.65;fire.scale.setScalar(.5+u*1.4);smoke.visible=u<4;smoke.position.y=8+u*5;smoke.scale.setScalar(1+u*.35);});}
 }
 private lava(){
  const g=this.place(.54,-17,'main',true,'Flowing lavafall');g.rotation.y-=Math.PI/2;g.userData.structure={role:'fixture',name:g.name};
  this.box(0x70483c,0,5,0,13,36,8,g);this.box(this.mat(0xc74b29,true),0,7,-4.1,8,32,.2,g);
  const flows=Array.from({length:18},(_,n)=>this.box(this.mat(n%3?0xffad47:0xffe080,true),(n%3-1)*2.6,0,-4.3,1.6,3,.25,g));this.animations.push(time=>flows.forEach((m,n)=>{m.position.y=23-((time*7+n*2)%32);m.scale.y=.7+.4*Math.sin(time+n);}));
  this.ball(0xe76c31,0,-9,0,1,g,14,.5,10);
  for(let f=.445;f<.585;f+=.012){const lane=-this.track.halfWidth-3.5,channel=this.place(f,lane,'main',true,'Flowing lava channel');this.box(0x7e4a3f,0,-2,0,4.5,3,27,channel);this.box(this.mat(0xde572d,true),0,-.35,0,4,.12,27,channel);const streak=this.box(this.mat(0xffbe55,true),0,-.25,0,2,.12,5,channel);this.animations.push(time=>{streak.position.z=12-(time*5+f*200)%24;});}
 }
}
