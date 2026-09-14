import * as T from 'three';
import {SceneKit} from './SceneKit';
import {DestinationTrack} from './track';
import {mergeStatic} from '../../core/mergeStatic';

export class PlayroomFinish extends SceneKit {
 constructor(t:DestinationTrack,scene:T.Scene){super(t,scene);this.army();this.rescue();this.space();this.games();this.finish();this.static.name='final-playroom';}
 private bookStand(g:T.Group,width:number,depth:number){
  const height=g.position.y+3;this.box(0xe7d4ac,0,-height/2,0,width,height,depth,g);
  for(let y=0;y>-height;y-=4){this.box([0x6b9ba9,0xb16b78,0xcaa461][Math.floor(-y/4)%3],0,y-.35,0,width+.5,.6,depth+.5,g);this.box(0xf0dfb4,0,y-2,-depth/2-.03,width-2,1.8,.1,g);}
 }
 private army(){
  const g=this.place(.08,46,'main',true,'Green army tableau');g.position.y=-2;
  this.box(0xbbae80,0,-.4,0,46,.7,35,g);
  for(let n=0;n<6;n++){const man=this.group((n%3-1)*11,0,Math.floor(n/3)*13-7,g);const c=0x568b4e;this.ball(c,0,.1,0,1,man,2.8,.15,2);this.box(c,0,3.8,0,2.4,3.2,1.5,man);this.ball(c,0,6.4,0,1.25,man);this.mesh(new T.SphereGeometry(1.5,10,6,0,Math.PI*2,0,Math.PI/2),0x3e6f43,0,6.8,0,man);for(const side of [-1,1]){this.rod(c,[side*.7,2.5,0],[side*1,0,side*.6],.45,man);this.rod(c,[side*1.3,4.9,0],[side*.8,4,-2],.4,man);}this.rod(0x385c39,[-1,4,-2.2],[2.5,4,-2.2],.25,man);mergeStatic(man);}
  const tank=this.group(0,0,21,g);this.tank(tank);mergeStatic(g);this.animations.push(t=>{g.rotation.y=Math.atan2(this.track.at(.08*this.track.length).tx,this.track.at(.08*this.track.length).tz)+Math.sin(t*.5)*.018;});
 }
 private tank(g:T.Group){this.box(0x47784b,0,1.5,0,9,2.4,12,g);for(const x of [-4.2,4.2]){this.box(0x334c3a,x,1.2,0,1.7,2.6,13,g);for(let z=-4;z<=4;z+=2)this.ball(0x6f8e50,x*1.15,1.3,z,.85,g,.3,1,1);}this.cyl(0x658b51,0,3.5,0,3,2.7,g);this.rod(0x47784b,[0,4,0],[0,4,-10],.45,g);}
 private rescue(){
  const g=this.place(.445,42,'main',true,'Fire truck and dinosaur');g.position.y-=2;this.bookStand(g,38,29);
  const truck=this.group(-7,0,0,g);this.box(0xdc574d,0,2,0,7,3,17,truck);this.box(0xe36454,0,4,-5,7,4,5,truck);this.box(0x76b7ce,0,4.5,-7.6,5.8,2,.15,truck);for(const x of [-3.6,3.6])for(const z of [-5,5])this.ball(0x344b59,x,1.2,z,1.2,truck,.5,1,1);
  const ladder=this.group(0,5,4,truck);for(const x of [-1.4,1.4])this.rod(0xd5ddd5,[x,0,0],[x,0,-19],.2,ladder);for(let z=0;z>-19;z-=2)this.rod(0xd5ddd5,[-1.4,0,z],[1.4,0,z],.16,ladder);
  const beacons=[-2,2].map(x=>this.ball(0xffcd71,x,6.3,-5,.65,truck));
  const dino=this.group(13,0,0,g);dino.scale.setScalar(2.6);this.animal(dino,'dinosaur');dino.rotation.y=-.8;
  this.animations.push(t=>{ladder.rotation.x=.25+Math.sin(t*.5)*.12;dino.rotation.y=-.8+Math.sin(t*.6)*.1;beacons.forEach((b,n)=>b.scale.setScalar(.7+.3*Math.sin(t*5+n*Math.PI)));});
  // Ladder and lamps retain independent motion.
 }
 private space(){
  const g=this.place(.51,46,'main',true,'Rocket ships slinky and drawing toy');g.position.y-=3;this.bookStand(g,53,49);
  for(const x of [-12,1]){const ship=this.group(x,0,0,g);this.cyl(0xe8ded0,0,10,0,3.2,17,ship);this.cone(0xe27861,0,22,0,3.2,8,ship);this.ball(0x5aa9c3,0,14,-3,1.4,ship,1,1,.2);for(let n=0;n<3;n++){const fin=this.box(0xd96c58,Math.sin(n*2.094)*3.4,4,Math.cos(n*2.094)*3.4,.7,8,5,ship);fin.rotation.y=n*2.094;}mergeStatic(ship);}
  const slinky=this.group(17,1,0,g);for(let n=0;n<22;n++){const ring=this.ring(n%2?0x91cedb:0xd9d9cb,0,n*.6,0,4.5,.16,slinky);ring.rotation.x=Math.PI/2;}mergeStatic(slinky);this.animations.push(t=>{slinky.scale.y=.8+Math.sin(t*1.3)*.3;slinky.rotation.z=Math.sin(t*.7)*.12;});
  const board=this.group(4,0,23,g);this.box(0xd76556,0,8,0,30,21,2,board);this.box(0xb5c9bf,0,9,-1.1,25,13,.2,board);for(const x of [-11,11])this.ball(0xf1ead1,x,.3,-1.7,2.2,board,1,1,.5);
  const points=[[-9,4,-1.3],[-9,10,-1.3],[0,15,-1.3],[9,10,-1.3],[9,4,-1.3],[-9,4,-1.3]];for(let n=1;n<points.length;n++)this.rod(0x637c7a,points[n-1],points[n],.14,board);mergeStatic(board);
 }
 private games(){
  const g=this.place(.85,52,'main',false,'Board games log castle and stacking tower');g.position.y=-3;
  for(let n=0;n<10;n++)for(let j=0;j<3;j++){const b=this.box(0xc8a16f,20+(n%2?(j-1)*2.6:0),1+n*2.1,n%2?0:(j-1)*2.6,n%2?2.3:8,2,n%2?8:2.3,g);b.rotation.y=n%2?0:.015;}
  for(let n=0;n<7;n++)for(const side of [-1,1]){const log=this.cyl(0x947050,-15+side*10,n*2+1,0,1,25,g);log.rotation.x=Math.PI/2;const beam=this.cyl(0xa57d51,-15,n*2+1,side*10,1,25,g);beam.rotation.z=Math.PI/2;}
  for(const x of [-27,-3])for(const z of [-12,12]){this.box(0x8ea7bc,x,12,z,7,24,7,g);this.cone(0xd17e8d,x,28,z,6,9,g,4).rotation.y=Math.PI/4;}
  this.box(0x678bb0,0,.2,31,53,.6,29,g);for(let n=0;n<18;n++){const a=n/18*Math.PI*2,x=Math.sin(a)*23,z=31+Math.cos(a)*10;this.box([0xe9cc76,0xd78d93,0x88bfa6][n%3],x,.65,z,6,.2,5,g);if(n%5===0)this.cone(0xf2e5c4,x,2.5,z,1.4,4,g);}
  this.label('RACE AROUND THE ROOM',this.group(0,0,32,g),24,1.2);
  const tv=this.place(.96,43,'main',true,'Retro game television');this.box(0x475268,0,15,0,48,34,12,tv);this.box(0x28394f,0,0,0,12,6,9,tv);
  const canvas=document.createElement('canvas');canvas.width=256;canvas.height=160;const ctx=canvas.getContext('2d')!,map=new T.CanvasTexture(canvas);map.magFilter=T.NearestFilter;map.colorSpace=T.SRGBColorSpace;
  const screen=this.mesh(new T.PlaneGeometry(41,26),new T.MeshBasicMaterial({map,side:T.DoubleSide}),0,15,-6.1,tv);screen.rotation.y=Math.PI;
  let frame=-1;this.animations.push(t=>{const next=Math.floor(t*8);if(next===frame)return;frame=next;ctx.fillStyle='#182744';ctx.fillRect(0,0,256,160);ctx.fillStyle='#3c526a';ctx.fillRect(60,0,136,160);ctx.fillStyle='#f4d885';for(let y=0;y<160;y+=24)ctx.fillRect(126,(y+next*5)%160,3,12);for(let n=0;n<4;n++){ctx.fillStyle=['#f47e67','#81d8ce','#cba5ed','#ffe29c'][n];ctx.fillRect(75+n*28,((next*(2+n)%200)-30),12,19);}ctx.fillStyle='#81d8ce';ctx.fillRect(118+Math.sin(t)*24,125,15,24);ctx.fillStyle='#f8e5b6';ctx.font='bold 10px monospace';ctx.fillText('ASTRO POCKET RACER',18,15);map.needsUpdate=true;});
  const track=this.place(.76,37,'main',false,'Orange miniature race track');const curve=new T.CatmullRomCurve3([new T.Vector3(-15,1,0),new T.Vector3(-10,7,10),new T.Vector3(0,17,0),new T.Vector3(12,7,-10),new T.Vector3(20,1,0)]);this.mesh(new T.TubeGeometry(curve,44,1.5,5,false),0xf19545,0,0,0,track);for(const x of [-8,8])this.box(0x6994b6,x,5,0,2,10,3,track);
 }
}
