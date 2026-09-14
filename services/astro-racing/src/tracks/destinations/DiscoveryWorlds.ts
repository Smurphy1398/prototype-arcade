import * as T from 'three';import {SceneKit} from './SceneKit';import {DestinationTrack} from './track';
export class DiscoveryWorlds extends SceneKit {
 constructor(track:DestinationTrack,scene:T.Scene){super(track,scene);if(track.id==='barnyard')this.farm();if(track.id==='rally')this.rally();if(track.id==='dc')this.capital();this.finish();}
 private farm(){
  this.box(0x8baa65,-130,-5,-40,1400,4,1200);
  // Follow the bending pavement with complete wall/roof sections. A single
  // rectangular barn intersected the bend and lost its walls to clearance.
  for(const route of ['main','loft'])for(let f=route==='main'?.106:.116;f<(route==='main'?.155:.188);f+=.004){const g=this.place(f,0,route,false,route==='main'?'Red barn passage':'Upper barn loft'),width=route==='main'?19:15,h=route==='main'?26:15,p=this.track.at(f*this.track.length,route),q=this.track.at((f+.004)*this.track.length,route),length=Math.hypot(q.x-p.x,q.z-p.z)+.4;
   for(const side of [-1,1]){this.box(0xb95244,side*width,h/2,length/2,3,h,length,g);this.box(0xf0d2a7,side*(width-1.7),h/2,0,.25,h,.45,g);const roof=this.box(0x4b6870,side*width/2,h+2,length/2,width+3,1,length,g);roof.rotation.z=-side*.24;const base=(p.y??0)+3;this.box(0x996a48,side*width,-base/2,0,3,base,2,g);}
  }
  const barn=this.place(.106,0,'main',false,'Barn entrance');this.arch(barn,38,24,0xf0ce9b);this.label('SUNSPUN FARM',barn,30,25);
  const silo=this.place(.12,-47,'main',false,'Grain silo');silo.position.y=-3;this.cyl(0xbac4b1,0,19,0,9,38,silo);this.ball(0x899e9f,0,39,0,9,silo,1,.6,1);for(let y=4;y<35;y+=6)this.ring(0x7e928d,0,y,0,9.1,.2,silo).rotation.x=Math.PI/2;
  const windmill=this.place(.22,45,'main',true,'Farm windmill');windmill.position.y=-3;this.cone(0xc6b78d,0,20,0,5,40,windmill,4);const rotor=this.group(0,39,-3,windmill);for(let n=0;n<4;n++){const blade=this.box(0xebdaba,0,8,0,3,15,.6,rotor);blade.rotation.z=n*Math.PI/2;blade.position.set(Math.sin(n*Math.PI/2)*8,Math.cos(n*Math.PI/2)*8,0);}this.animations.push(t=>{rotor.rotation.z=t*.4;});
  for(let n=0;n<20;n++){const g=this.place(.26+n*.008,(n%2?1:-1)*35,'main',false,'Orchard');g.position.y=-3;this.tree(g,12+n%3*3,0x779a51);for(let j=0;j<5;j++)this.ball(0xd7764c,Math.sin(j)*3,10+Math.cos(j)*2,Math.cos(j)*3,.6,g);}
  for(let n=0;n<16;n++){const g=this.place(.01+n*.009,38);g.position.y=-3;for(let j=0;j<4;j++)this.box(0xdcbc6d,(j-1.5)*4,1.8,0,3.5,3.6,5,g);}
  const pond=this.place(.80,44,'main',false,'Farm pond');pond.position.y=0;this.ball(0x82b4b4,0,-2,0,1,pond,46,.3,35);for(let n=0;n<9;n++)this.cyl(0x647f4a,(n-4)*4,1,28,.2,5,pond);
  const zoo=this.place(.59,0,'main',false,'Animal park entrance');this.arch(zoo,32,16,0x998867);this.label('ANIMAL PARK',zoo,28,16,'#ffe0a0','#516d56');
  const shed=this.place(.91,-33,'main',false,'Tractor shed');for(const x of [-16,16])this.box(0x90694e,x,7,0,1,14,25,shed);this.box(0x718677,0,15,0,35,2,29,shed);for(let n=0;n<8;n++)this.box(0x81a75e,(n-4)*6,0,30,3,1,40,shed);
 }
 private rally(){
  this.box(0xa98d6c,-140,-8,-30,1500,5,1400);
  for(let n=0;n<40;n++){const f=n/40,g=this.place(f,(n%2?1:-1)*(35+n%3*15),'main',false,'Layered quarry bank');const h=(this.track.at(f*this.track.length).y??0)+18;g.position.y=-6;for(let tier=0;tier<3;tier++)this.cyl([0x937259,0xb18b66,0xc4a57f][tier],0,h*(tier+.5)/3,0,31-tier*4,h/3,g,28-tier*4,7);}
  // Purposeful tire walls, low relief shoulders and course flags frame the berms.
  for(let n=0;n<70;n++){const f=n/70,p=this.track.at(f*this.track.length),g=this.place(f,(n%2?1:-1)*(this.track.widthAt(p.s)+4));const tire=this.cyl(0x35424a,0,.7,0,1.2,1.4,g,.7,10);if(n%3===0){this.cyl(0xd0ad75,0,3,0,.12,6,g);this.box(n%2?0xdd8356:0xeee2bd,1,5.5,0,2,1.2,.06,g);}}
  const pits=this.place(.018,-43,'main',false,'Rally paddock');for(let n=0;n<4;n++){const g=this.group((n-1.5)*22,0,0,pits);for(const x of [-9,9])for(const z of [-8,8])this.cyl(0x73858b,x,4,z,.2,8,g);this.cone([0xda7958,0x5999ad,0xe1c580,0x8b83aa][n],0,11,0,15,7,g,4).rotation.y=Math.PI/4;this.box(0x526474,0,2,0,9,4,5,g);}
  const gantry=this.place(.008,0,'main',false,'Redline timing gantry');this.arch(gantry,33,14,0x405968);this.label('REDLINE RALLY',gantry,30,14,'#ffe1a0','#8e4d3c');
  for(let f=.10;f<.24;f+=.03){const g=this.place(f,-26,'main',false,'Rally spectators');for(let row=0;row<3;row++){this.box(0x8b7861,0,row*2,0,25,1,5+row*4,g);for(let n=0;n<8;n++){this.cyl([0xcc826a,0xc3bb76,0x7eafa9][n%3],(n-3.5)*3,row*2+1.5,-row*2,.35,1.2,g);this.ball(0xdab08a,(n-3.5)*3,row*2+2.4,-row*2,.4,g);}}}
  const crane=this.place(.48,48,'main',false,'Quarry excavator');this.box(0x54616b,0,3,0,18,5,10,crane);this.box(0xe9b559,0,8,0,12,7,8,crane);this.box(0x507887,3,11,-4,5,4,.2,crane);this.rod(0xd49b46,[-2,10,0],[-18,26,0],1.6,crane);this.rod(0xd49b46,[-18,26,0],[-31,11,0],1.3,crane);this.box(0x5b6262,-31,9,0,7,6,9,crane);
  for(let n=0;n<16;n++){const p=this.track.at((.64+n*.008)*this.track.length,'mudline');this.ball(0x71523e,p.x,(p.y??0)-.5,p.z,1,this.static,4,.3,7);}
  // Bounded local dust, never removes a gameplay object on low quality.
  for(let n=0;n<24;n++){const g=this.place(n/24,(n%2?1:-1)*14,'main',true,'Shoulder dust');const dust=this.ball(0xc7ae8c,0,1,0,1.2,g,2,.3,1);const y=g.position.y;this.animations.push(t=>{g.position.y=y+(t+n)%3;dust.scale.x=1+(t+n)%3;});}
 }
 private columns(g:T.Group,width:number,count:number,height:number,c=0xe9e0c9){for(let n=0;n<count;n++)this.cyl(c,(n/(count-1)-.5)*width,height/2,-13,1.3,height,g);this.box(c,0,height+1,-12,width+5,3,8,g);}
 private capital(){
  this.box(0x91ad7b,-125,-5,-30,1500,4,1300);
  const capitol=this.place(.07,-73,'main',false,'US Capitol dome');capitol.position.y=-3;this.box(0xe3dfcc,0,11,0,112,22,35,capitol);this.box(0xd3d0c0,0,26,0,44,20,36,capitol);this.columns(capitol,98,13,24);this.cyl(0xe6e3d2,0,42,0,15,18,capitol);this.mesh(new T.SphereGeometry(16,24,12,0,Math.PI*2,0,Math.PI/2),0xe7e4d5,0,50,0,capitol);this.cyl(0xe9e6d3,0,69,0,2.8,9,capitol);this.ball(0x74847f,0,75,0,1.7,capitol);for(const z of [-17.7,17.7])for(let x=-48;x<=48;x+=8)for(const y of [7,16])this.box(0x829698,x,y,z,3,5,.35,capitol);for(const x of [-56.2,56.2])for(const z of [-10,0,10])for(const y of [7,16])this.box(0x829698,x,y,z,.3,5,3,capitol);for(let n=0;n<16;n++){const a=n/16*Math.PI*2;this.cyl(0xb6bdb3,Math.sin(a)*15.1,42,Math.cos(a)*15.1,.5,17,capitol);}this.box(0xb9bcaf,0,23,0,115,2,37,capitol);
  const castle=this.place(.18,46,'main',false,'Smithsonian Castle');castle.position.y=-3;this.box(0xab755a,0,13,0,64,26,28,castle);for(const x of [-26,0,26]){this.box(0xa97258,x,24,0,12,45+(x===0?15:0),14,castle);this.cone(0x755a54,x,x===0?62:49,0,10,16,castle,4).rotation.y=Math.PI/4;}for(let n=0;n<8;n++)this.box(0x344f5d,(n-3.5)*7,14,-14.2,3,8,.2,castle);
  const monument=this.place(.26,53,'main',false,'Washington Monument');monument.position.y=-3;monument.scale.setScalar(.57);this.box(0xe4dec2,0,1,0,30,3,30,monument);this.cyl(0xe5dfc6,0,51,0,8,100,monument,5.7,4).rotation.y=Math.PI/4;this.cone(0xeae4c9,0,105,0,5.7,9,monument,4).rotation.y=Math.PI/4;
  const pool=this.place(.33,32,'main',false,'Reflecting pool');pool.position.y=-1.5;this.box(0xc8c5ab,0,-2,0,30,2,136,pool);this.box(0x70aeb7,0,-.9,0,25,.1,130,pool);
  const lincoln=this.place(.44,-55,'main',false,'Lincoln Memorial');lincoln.position.y=-3;for(let n=0;n<5;n++)this.box(0xd5d2ba,0,n*1.5,0,79-n*5,1.5,51-n*3,lincoln);this.box(0xc4c6b7,0,17,7,57,25,26,lincoln);this.columns(lincoln,55,9,31);this.box(0xe2ddc4,0,33,0,68,4,41,lincoln);const statue=this.group(0,10,-5,lincoln);this.box(0xe6e3d7,0,7,0,7,12,5,statue);this.ball(0xe6e3d7,0,15,0,2.7,statue);
  const basin=this.place(.62,43,'main',false,'Tidal Basin');basin.position.y=.5;this.ball(0x73b9c1,0,-3,0,1,basin,62,.2,84);
  const jefferson=this.place(.665,-62,'main',false,'Jefferson Memorial');jefferson.position.y=-3;this.cyl(0xd7d9c5,0,2,0,31,4,jefferson);this.cyl(0xd5d8c7,0,18,4,22,27,jefferson);for(let n=0;n<16;n++){const a=n/16*Math.PI*2;this.cyl(0xeae5ce,Math.sin(a)*25,18,Math.cos(a)*25,1.5,29,jefferson);}this.mesh(new T.SphereGeometry(28,24,10,0,Math.PI*2,0,Math.PI/2),0xe3dfc6,0,34,0,jefferson).scale.y=.45;this.box(0xe8e3ce,0,34,0,55,3,55,jefferson);
  const house=this.place(.894,55,'main',false,'White House');house.position.y=-3;this.box(0xe9e7d8,0,13,0,79,26,31,house);this.columns(house,30,6,28);this.cone(0xe5e2d3,0,32,-10,25,11,house,4).rotation.y=Math.PI/4;for(let x=-32;x<=32;x+=8)for(const y of [8,19])this.box(0x668590,x,y,-15.7,4,6,.3,house);for(let x=-32;x<=32;x+=8)for(const y of [8,19])this.box(0x668590,x,y,15.7,4,6,.3,house);this.box(0xb8c5b6,0,28,0,80,3,32,house);this.rod(0x879185,[0,29,0],[0,48,0],.2,house);this.box(0xd18a79,4,45,0,8,4,.1,house);
  for(let n=0;n<52;n++){const f=.48+n/52*.38,g=this.place(f,(n%2?1:-1)*(23+n%3*5),'main',false,'Cherry blossoms');g.position.y=-3;this.tree(g,11+n%3*2,n%2?0xe9b9c1:0xf1d4cc);}
  for(const f of [.10,.23,.40,.72,.93]){const g=this.place(f,22);this.cyl(0x59716e,0,5,0,.3,10,g);this.ball(0xf3e2b0,0,11,0,1.2,g);this.box(0x688e97,0,7,0,3,5,.1,g);}
 }
}
