import * as T from 'three';
import {SceneKit} from './SceneKit';
import {DestinationTrack} from './track';
import {mergeStatic} from '../../core/mergeStatic';

/** Compact landmarks placed beside the racing approach, with bounded ambient motion. */
export class CityFinish extends SceneKit {
 constructor(t:DestinationTrack,scene:T.Scene){super(t,scene);if(t.id==='dc')this.dc();if(t.id==='nyc')this.nyc();if(t.id==='vegas')this.vegas();this.finish();this.static.name='final-city-'+t.id;}
 private flag(g:T.Group,x:number,z:number,h=16){
  this.cyl(0xc5c8b5,x,h/2,z,.16,h,g);this.ball(0xf3d295,x,h,z,.3,g);
  const cloth=new T.Group();cloth.position.set(x,h-1,z);g.add(cloth);
  const geo=new T.PlaneGeometry(7,3.7,14,6);geo.translate(3.5,-1.85,0);
  const colors:number[]=[];const pos=geo.attributes.position;
  for(let i=0;i<pos.count;i++){const c=new T.Color(pos.getX(i)<3&&pos.getY(i)>-2?0x304e89:Math.floor(-pos.getY(i)/3.7*13)%2?0xf6eee0:0xc74f54);colors.push(c.r,c.g,c.b);}
  geo.setAttribute('color',new T.Float32BufferAttribute(colors,3));const fabric=new T.Mesh(geo,new T.MeshBasicMaterial({vertexColors:true,side:T.DoubleSide}));cloth.add(fabric);
  for(let row=0;row<4;row++)for(let col=0;col<5;col++)this.ball(0xffffff,.35+col*.5,-.25-row*.43,-.04,.085,cloth);
  // The flag is an animated child of the supported pole; static batching must leave it intact.
  g.updateMatrixWorld(true);this.moving.attach(cloth);
  this.animations.push(t=>{for(let i=0;i<pos.count;i++){const x=pos.getX(i);pos.setZ(i,Math.sin(t*3+x*.85)*x*.07);}pos.needsUpdate=true;});
 }
 private palm(g:T.Group,x:number,z:number,h=16){this.cyl(0xb2926d,x,h/2,z,.45,h,g,.3);for(let n=0;n<7;n++){const a=n/7*Math.PI*2;this.rod(0x508f78,[x,h,z],[x+Math.sin(a)*6,h-2,z+Math.cos(a)*6],.45,g);this.ball(0x3a7668,x+Math.sin(a)*3.4,h-1,z+Math.cos(a)*3.4,1,g,Math.abs(Math.sin(a))*2.6+.5,.22,Math.abs(Math.cos(a))*2.6+.5);}}
 private dc(){
  for(const f of [.24,.28,.40,.73,.89])for(const side of [-1,1]){const g=this.place(f,side*24,'main',false,'American flag plaza');g.userData.structure={role:'fixture',name:g.name};this.cyl(0xc9c3a6,0,.15,0,1.8,.3,g);this.flag(g,0,0);}
  const park=this.place(.775,-75,'main',false,'Nationals Park');park.rotation.y+=Math.PI/2;park.position.y=-3;
  this.box(0xaa9a88,0,2,0,100,5,76,park);this.box(0x62926c,0,5,0,80,.3,60,park);
  const diamond=this.box(0xc7a172,0,5.3,4,34,.2,34,park);diamond.rotation.y=Math.PI/4;
  for(let tier=0;tier<4;tier++){const h=6+tier*3;this.box(0xb4b8b1,0,h,30-tier*3,95,2,4,park);for(const side of [-1,1])this.box(0xb4b8b1,side*(45-tier*3),h,0,4,2,60,park);}
  this.box(0x315a55,0,22,31,70,13,2,park);this.label('NATIONALS PARK',this.group(0,0,32.4,park),62,24,'#ffe9d4','#274e51').rotation.y=0;this.label('NATIONALS PARK',this.group(0,0,29.8,park),62,24,'#ffe9d4','#274e51');this.label('WASHINGTON  •  HOME  7',this.group(0,0,29,park),44,17,'#ffd594','#274e51');
  for(const x of [-42,42]){this.cyl(0xa6b6b4,x,19,28,.4,38,park);this.box(this.mat(0xffe2ac,true),x,38,28,12,3,1,park);}
  const water=this.place(.60,63,'main',false,'Potomac waterfront');water.position.y=-3;
  this.box(0x547f88,0,-.7,0,88,1,180,water);this.box(0x548fa9,0,-.12,0,80,.15,174,water);
  for(let z=-80;z<80;z+=10){this.box(0xc2b698,-44,1,z,7,2,10,water);this.cyl(0x566c72,-40,2.5,z,.15,3,water);if(z<70)this.rod(0x61777d,[-40,4,z],[-40,4,z+10],.1,water);}
  this.label('POTOMAC WATERFRONT',this.place(.57,24,'main',false,'Waterfront promenade sign'),20,5);
  const boat=this.group(0,0,0,this.moving,'Potomac river launch');this.boat(boat,0xf1e4be);mergeStatic(boat);
  this.animations.push(t=>{water.updateMatrixWorld(true);boat.position.copy(water.localToWorld(new T.Vector3(8+Math.sin(t*.12)*12,1,Math.sin(t*.08)*62)));boat.rotation.y=water.rotation.y;});
 }
 private boat(g:T.Group,c:number){this.ball(c,0,0,0,1,g,3,1,9);this.box(0xebdec0,0,1.8,0,4,2.5,7,g);this.box(0x416a80,0,2,-3.55,3,1,.1,g);this.cyl(0x947a62,0,5,0,.14,7,g);this.box(0xeff3e4,1.8,5,0,3.4,4,.1,g);}
 private nyc(){
  const empire=this.place(.92,-65,'main',false,'Empire State Building');empire.position.y=-3;empire.scale.setScalar(.60);empire.userData.structure={role:'fixture',name:empire.name};
  for(const [w,h,y]of [[48,60,30],[37,47,83.5],[28,35,124.5],[19,23,153.5],[12,18,174]] as number[][]){this.box(0xb7b9b0,0,y,0,w,h,w*.75,empire);for(const side of [-1,1])for(let x=-w*.38;x<w*.4;x+=5)this.box(0x778e95,x,y,side*(w*.375+.05),1.5,h-4,.1,empire);}
  this.cyl(0xd1d4c6,0,196,0,2.4,28,empire,1.3);this.cone(0xe3dfc9,0,219,0,1.5,22,empire);this.label('EMPIRE STATE',empire,35,12);
  for(const [i,f]of [.028,.053,.078,.104].entries())for(const side of [-1,1]){const g=this.place(f,side*30,'main',false,'Times Square billboards');g.rotation.y+=side*Math.PI/3;this.box(0x384657,0,15,0,20,30,5,g);
   const color=['#ffcc65','#f791cc','#9bf5ee','#b9b5ff'][i],m=this.label(['ASTRO / LIVE','COCO RADIO','PLAY ALL NIGHT','TIMES SQUARE'][i],g,23,23,color,'#192b46');m.position.z=-2.6;this.label(['RACE THE CITY','88.6 FM','ARCADE','NEW YORK'][i],g,21,12,'#fff0c4','#39556c').position.z=-2.6;
   const strips:T.Mesh[]=[];for(const x of [-12,12])strips.push(this.box(new T.MeshBasicMaterial({color}),x,17,0,.3,28,.4,g));
   this.animations.push(t=>{(m.material as T.MeshBasicMaterial).color.setScalar(.82+.18*Math.sin(t*1.6+i));});
  }
  const entrance=this.place(.66,-25,'main',false,'Central Park entrance');this.box(0xbca58b,0,3,0,4,6,4,entrance);this.cyl(0x577c6c,0,8,0,.18,10,entrance);this.label('CENTRAL PARK',entrance,18,11,'#f1e8c4','#345d4c');
  for(let f=.685;f<.82;f+=.016){const g=this.place(f,-30,'main',false,'Park lawn and promenade');g.position.y=-3;this.box(0x609364,0,-.7,0,22,1,32,g);this.box(0xccbea0,0,-.14,0,5,.15,32,g);for(const side of [-1,1]){this.tree(this.group(side*8,0,0,g),10,0x507f59);this.box(0x8e7556,side*6,.85,5,1,1.7,4,g);}}
  const jet=this.group(0,0,0,this.moving,'Occasional city airplane');this.box(0xe8e7d6,0,0,0,2.6,2.5,20,jet);this.box(0xb9cad2,0,0,0,25,.4,4,jet);this.box(0xbdced0,0,3,-8,.4,6,4,jet);mergeStatic(jet);
  this.animations.push(t=>{const u=t%80;jet.visible=u<24;jet.position.set(-650+u*45,160,-40+u*8);jet.rotation.y=Math.PI/2;});
  for(const f of [.19,.89]){const g=this.place(f,39,'main',true,'Rooftop steam');g.position.y+=62;this.cyl(0x6d625d,0,0,0,1.4,5,g);const smoke=Array.from({length:5},(_,n)=>this.ball(0xb0bdba,n*.5,4+n*2,0,1.2,g));this.animations.push(t=>smoke.forEach((p,n)=>{const u=(t*.45+n/5)%1;p.position.set(u*5,u*16+3,0);p.scale.setScalar(.5+u*2);}));}
 }
 private vegas(){
  const tower=this.place(.245,43,'main',false,'Vegas Eiffel Tower');tower.position.y=-3;tower.scale.setScalar(.60);const c=0xd5b581;
  const levels=[[0,15],[23,8],[43,4],[73,1]];
  for(let n=0;n<3;n++){const [y,w]=levels[n],[ny,nw]=levels[n+1];for(const x of [-1,1])for(const z of [-1,1]){this.rod(c,[x*w,y,z*w],[x*nw,ny,z*nw],.8,tower);this.rod(0xab845e,[x*w,y,z*w],[-x*nw,ny,z*nw],.27,tower);this.rod(0xab845e,[x*w,y,z*w],[x*nw,ny,-z*nw],.27,tower);}this.box(c,0,ny,0,nw*2+4,1.5,nw*2+4,tower);}
  this.cyl(0xffe1aa,0,79,0,.5,14,tower);this.label('PARIS • LAS VEGAS',tower,34,16,'#ffd28b','#513854');
  const palace=this.place(.69,48,'main',false,'Caesars palace frontage');palace.position.y=-3;palace.rotation.y+=Math.PI/2;palace.scale.setScalar(.75);
  this.box(0xd2bb9d,0,13,0,104,26,33,palace);for(let x=-45;x<=45;x+=9){this.cyl(0xf0dfb4,x,14,-20,1.5,27,palace);this.box(0xe7cea0,x,28,-20,4,2,4,palace);}this.box(0xe7d5b0,0,30,-17,110,3,14,palace);
  this.label('CAESARS PALACE',this.group(0,0,-28,palace),48,26,'#e4b863','#4b4054');this.cone(0xe1cead,0,35,-16,22,10,palace,4).rotation.y=Math.PI/4;
  for(const x of [-40,40]){this.ball(0xe5d5ad,x,34,-19,2,palace);this.cyl(0xdcc59e,x,31,-19,1,5,palace);}
  const liberty=this.place(.59,43,'main',false,'Vegas miniature Liberty');liberty.scale.setScalar(.62);this.box(0xb29b85,0,5,0,14,10,14,liberty);this.cone(0x6fa99a,0,20,0,6,21,liberty);this.ball(0x8bc3a7,0,32,0,2.8,liberty);this.rod(0x77ad98,[-2,27,0],[-8,42,0],1.2,liberty);this.cyl(0xc2a274,-8,44,0,1,4,liberty);this.cone(0xffca72,-8,48,0,1.7,5,liberty);for(let n=0;n<7;n++){const a=n*Math.PI/6;this.rod(0x8bc3a7,[Math.cos(a)*2,33+Math.sin(a)*2,0],[Math.cos(a)*5,33+Math.sin(a)*5,0],.3,liberty);}this.box(0x81b6a4,4,23,-1,3,7,1,liberty);
  for(const f of [.19,.225,.265,.57,.61,.67,.73,.78,.86,.95])for(const side of [-1,1]){const g=this.place(f,side*24,'main',false,'Strip palm boulevard');this.palm(g,0,0,14);this.cyl(0xb99c87,0,.3,0,2.8,.6,g);this.ring(0xffcd81,0,.7,0,2.7,.14,g).rotation.x=Math.PI/2;}
  const welcome=this.place(.545,-24,'main',false,'Welcome to Las Vegas');this.cyl(0x9ba6ad,0,7,0,.3,14,welcome);this.box(0xb8c7c5,0,14,0,23,10,1,welcome);this.label('WELCOME TO LAS VEGAS',welcome,26,14,'#fbcb85','#36495d');
 }
}
