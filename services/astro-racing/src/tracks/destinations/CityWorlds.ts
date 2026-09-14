import * as T from 'three';import {SceneKit} from './SceneKit';import {DestinationTrack} from './track';
export class CityWorlds extends SceneKit {
 constructor(track:DestinationTrack,scene:T.Scene){super(track,scene);if(track.id==='nyc')this.nyc();else this.vegas();this.finish();}
 private nyc(){
  // Landmark district buildings have stepped crowns instead of identical slabs.
  for(let n=0;n<34;n++){const f=n/34,g=this.place(f,(n%2?1:-1)*55,'main',false,'Manhattan skyline');g.position.y=-3;g.rotation.y+=(n%2?1:-1)*Math.PI/2;if(f>.36&&f<.85||f<.13||f>.24&&f<.32)continue;
   const h=35+n%6*14,c=[0x6e8193,0xb1816b,0x82969b,0x697888][n%4];this.box(c,0,h/2,0,27,h,25,g);for(let k=0;k<3;k++)this.box(c,0,h+k*7,0,22-k*5,8,21-k*5,g);if(n%3===0)this.cone(0xb9c2b7,0,h+33,0,2,26,g);
   for(let y=6;y<h-3;y+=7)for(let x=-9;x<=9;x+=6)for(const side of [-1,1])this.box(n%2?0xe0d8b7:0xbcdbe0,x,y,side*12.6,3,3,.2,g);
   this.box(0x4b645e,0,3,-14,25,5,4,g);this.box(0xdbad7b,0,6,-15,29,.7,6,g);
   if(f<.22||f>.94){const billboard=this.group(0,h*.55,-14,g);this.label(['SUNBURST','ASTRO TONIGHT','COCO CLUB','BOROUGH RACE'][n%4],billboard,29,0,['#ffdb68','#90e8ee','#f7a1d3'][n%3],'#28344b');this.box(0x334b60,0,0,1,31,9,1,billboard);for(let i=0;i<9;i++)this.ball(0xffcf78,(i-4)*3.4,-5,-.5,.35,billboard);}
   for(let y=14;y<h*.5;y+=12){this.box(0x344953,11,y,-14,7,.3,3,g);this.rod(0x344953,[8,y,-15],[14,y+12,-15],.14,g);}
  }
  for(const f of [.018,.058,.104,.155]){const g=this.place(f,23,'main',false,'Street life');this.label(['FRESH BAGELS','METRO','ARCADE','PARK AVENUE'][Math.round(f*100)%4],g,14,6);this.box(0x728b90,0,3,1,16,6,8,g);for(let n=0;n<5;n++){this.cyl([0xf6c368,0xdf9788,0x78b8ab][n%3],(n-2)*2,1.7,-4,.4,1.5,g);this.ball(0xdeb190,(n-2)*2,2.8,-4,.45,g);}}
  // Supported elevated transit, with a complete train moving above work zones.
  for(let f=.235;f<.32;f+=.009){const g=this.place(f,20);g.userData.structure={role:"fixture",name:"Supported elevated subway"};for(const x of [-2.5,2.5])this.box(0x9eaeb0,x,20.15,0,.2,.3,25,g);this.box(0x566d78,0,19,0,9,2,25,g);for(const side of [-1,1])this.box(0x526574,side*4,9,0,.8,20,.8,g);}
  const metro=this.place(.278,20,'main',true,'Elevated subway train');
  for(let n=0;n<3;n++){const car=this.group(n*8,0,0,metro,'Subway carriage');this.box(0xbac9ce,0,2.2,0,7.2,3.4,3.5,car);this.box(0xc65d4f,0,1,0,7.3,.55,3.55,car);this.box(0x718997,0,4,0,7,.3,3.3,car);for(const side of [-1,1]){for(const x of [-2.5,0,2.5])this.box(0x355c70,x,2.8,side*1.79,1.8,1.2,.08,car);for(const x of [-2.4,2.4]){const wheel=this.cyl(0x263f49,x,.6,side*1.45,.55,.35,car);wheel.rotation.x=Math.PI/2;}}if(n<2)this.box(0x40535c,4,1.7,0,.8,1.9,2.3,car);}
  this.animations.push(t=>{const p=this.track.at((.275+Math.sin(t*.2)*.025)*this.track.length);metro.position.set(p.x+p.nx*20,(p.y??0)+20.3,p.z+p.nz*20);metro.rotation.y=Math.atan2(p.tx,p.tz)+Math.PI/2;});
  for(const f of [.42,.505]){const g=this.place(f,0,'main',false,'Brooklyn Bridge stone tower');g.userData.structure={role:'fixture',name:'Bridge tower and foundation'};this.arch(g,48,34,0xc3b79e);for(const side of [-1,1]){this.box(0x998f7d,side*24,17,0,5,34,9,g);this.box(0xc3b79e,side*24,36,0,8,3,11,g);const base=g.position.y+3;this.box(0x998f7d,side*24,-base/2,0,7,base,10,g);}}
  for(let f=.385;f<.56;f+=.008){const p=this.track.at(f*this.track.length),g=this.place(f,0),distance=Math.min(Math.abs(f-.42),Math.abs(f-.505)),h=31-distance*360;for(const side of [-1,1]){this.rod(0x88938b,[side*16,1,0],[side*16,Math.max(5,h),0],.13,g);const q=this.track.at((f+.008)*this.track.length),line=this.rod(0xc0b899,[p.x+p.nx*16*side,(p.y??0)+h,p.z+p.nz*16*side],[q.x+q.nx*16*side,(q.y??0)+Math.max(5,h-1),q.z+q.nz*16*side],.24,this.static);}}
  const harbor=this.place(.54,92,'main',false,'Liberty Island harbor');this.box(0x488caa,0,-24,0,280,1,180,harbor);this.cyl(0x779789,0,-17,0,25,12,harbor);this.box(0xb8aa8a,0,0,0,18,25,18,harbor);
  const liberty=this.group(0,13,0,harbor);this.cone(0x72b2a4,0,15,0,8,30,liberty);this.ball(0x8ac6b4,0,33,0,4.2,liberty);this.rod(0x79b4a6,[-3,27,0],[-11,46,0],2,liberty);this.cyl(0xd4b46c,-11,48,0,2,5,liberty);this.cone(0xffd267,-11,53,0,2.5,6,liberty);this.box(0x7bb5a6,6,22,-2,5,10,2,liberty);for(let n=0;n<7;n++){const a=n*Math.PI/6;this.rod(0x84c4b5,[Math.cos(a)*3,35+Math.sin(a)*3,0],[Math.cos(a)*7,35+Math.sin(a)*7,0],.4,liberty);}
  const ferry=this.place(.57,45,'main',true,'Harbor ferry');ferry.position.y=-12;this.ball(0xe3c58c,0,0,0,1,ferry,7,2,17);this.box(0xeee4c5,0,3,0,10,5,23,ferry);this.box(0x587e96,0,4,-12,8,2,.2,ferry);const fx=ferry.position.x;this.animations.push(t=>{ferry.position.x=fx+Math.sin(t*.12)*28;});
  for(let n=0;n<40;n++){const f=.655+n/40*.205,g=this.place(f,(n%2?1:-1)*(25+n%3*10),'main',false,'Central Park grove');g.position.y=-3;this.tree(g,13+n%4*3,[0x478966,0x669e64,0x87ab6a][n%3]);}
  const reservoir=this.place(.743,-44,'main',false,'Central Park reservoir');reservoir.position.y=-1.5;this.box(0x739c91,0,-1,0,94,1,124,reservoir);this.box(0x60afba,0,-.4,0,84,.2,114,reservoir);for(const x of [-45,45])this.box(0xb8b69a,x,1,0,3,3,124,reservoir);
  for(let f=.10;f<.23;f+=.021)for(const side of [-1,1]){const g=this.place(f,side*17,'alley',false,'Loading alley storefront');this.box(0x9c7b69,0,7,0,9,14,14,g);this.box(0x485e68,-side*4.6,3,0,.2,6,7,g);this.box(0xbe9e69,-side*6,1.2,4,2,2.4,2,g);this.box(0xd4ac71,0,8,-7.1,7,2,.1,g);}
 }
 private vegas(){
  const neon=[0xf28bd3,0x89e5ef,0xf7d782,0xc8a8f1],names=['MOON PALACE','SUNBURST ROYALE','ORBIT LOUNGE','GOLDEN COCO'];
  for(let n=0;n<23;n++){const f=n<14?n/14*.24:.77+(n-14)/9*.22,side=n%2?1:-1;
   // Leave an open fountain court between the Strip and its hotel frontage.
   const lane=side*(side===1&&f>.05&&f<.18?112:45),g=this.place(f,lane,'main',false,'Strip casino '+n),h=27+n%5*11,c=[0x67557d,0x8a607e,0x4f6d83,0x86725b][n%4];g.position.y=-3;g.rotation.y+=side*Math.PI/2;this.box(c,0,h/2,0,34,h,30,g);this.box(c,0,h+4,0,28,8,25,g);for(const side of [-1,1])this.box(this.mat(neon[n%4],true),side*16,h/2,-15.2,.5,h,.5,g);
   for(let y=6;y<h;y+=5)for(let x=-12;x<=12;x+=6)for(const z of [-15.2,15.2])this.box(this.mat(neon[(n+1)%4],true),x,y,z,3,1.5,.2,g);
   const marquee=this.group(0,9,-19,g);this.box(0x463a58,0,0,1,38,10,3,marquee);this.label(names[n%4],marquee,37,0,['#ffe599','#9eefff','#f5ade7'][n%3],'#322943').position.z=-.65;for(let i=0;i<11;i++)this.ball(0xffd27e,(i-5)*3.5,-5,-.5,.45,marquee);
  }
  const fountain=this.place(.11,49,'main',false,'Choreographed fountain basin');fountain.position.y=-3;this.box(0x807fa1,0,-1,0,62,2,132,fountain);this.box(0x365c83,0,.1,0,56,.2,124,fountain);
  const jets=new T.InstancedMesh(new T.SphereGeometry(.22,5,4),new T.MeshBasicMaterial({color:0xb8e9f1,transparent:true,opacity:.65,depthWrite:false}),280);jets.name='Fountain water droplets';this.moving.add(jets);const drop=new T.Object3D();
  for(let n=0;n<28;n++)this.cyl(0x617783,Math.sin(n/28*Math.PI*2)*22,.15,Math.cos(n/28*Math.PI*2)*48,.25,.3,fountain);
  this.animations.push(t=>{jets.position.copy(fountain.position);jets.quaternion.copy(fountain.quaternion);for(let n=0;n<28;n++)for(let j=0;j<10;j++){const a=n/28*Math.PI*2,u=(t*.55+j/10)%1,height=7+8*(.5+.5*Math.sin(t*.8+n*.35));drop.position.set(Math.sin(a)*(22-u*8),Math.sin(u*Math.PI)*height,Math.cos(a)*(48-u*8));drop.scale.set(.8,1.8,.8);drop.updateMatrix();jets.setMatrixAt(n*10+j,drop.matrix);}jets.instanceMatrix.needsUpdate=true;});

  const pyramid=this.place(.47,-102,'main',false,'Pyramid and sky beam');pyramid.position.set(-450,-.5,110);this.cone(0x365169,0,45,0,90,95,pyramid,4).rotation.y=Math.PI/4;
  for(const x of [-1,1])for(const z of [-1,1])this.rod(0xc9d89d,[x*64,-2,z*64],[0,92,0],.45,pyramid);
  const beam=this.mesh(new T.CylinderGeometry(1.5,5,650,12,1,true),new T.MeshBasicMaterial({color:0xbddfee,transparent:true,opacity:.16,depthWrite:false,side:T.DoubleSide}),0,412,0,pyramid);this.ball(0xe4e7b8,0,95,0,3,pyramid);
  const sphinx=this.place(.515,-52,'main',false,'Sphinx entrance');sphinx.position.set(-365,-3,80);this.ball(0xd7b478,0,7,0,1,sphinx,12,8,23);this.box(0xe3c28a,0,19,-15,18,21,13,sphinx);this.box(0xb69666,0,31,-15,25,5,17,sphinx);for(const side of [-1,1]){this.box(0xe7c891,side*9,3,-21,7,6,22,sphinx);this.box(0x365974,side*9,21,-22,4,18,1,sphinx);this.box(0x334b5e,side*4,23,-22,3,1.7,1,sphinx);}this.box(0xab875a,0,17,-22,5,1,1,sphinx);
  const wheel=this.place(.825,-70,'main',true,'Observation wheel');wheel.position.y=42;const legs=this.group(wheel.position.x,-3,wheel.position.z);legs.rotation.y=wheel.rotation.y;for(const side of [-1,1])this.rod(0x9ebdd0,[side*22,0,0],[0,45,0],1.1,legs);this.ring(0xf4b9df,0,0,0,39,.8,wheel);for(let n=0;n<16;n++){const a=n/16*Math.PI*2,x=Math.sin(a)*39,y=Math.cos(a)*39;this.rod(0x9ebdd0,[0,0,0],[x,y,0],.18,wheel);this.box(neon[n%4],x,y,0,3.5,4,4,wheel);}this.animations.push(t=>{wheel.rotation.z=t*.05;});
  const sphere=this.place(.93,68,'main',true,'Luminous sphere');sphere.position.y=-3;this.cyl(0x565177,0,1,0,24,3,sphere);this.mesh(new T.SphereGeometry(36,32,20),this.mat(0x786ed4,true),0,33,0,sphere);for(let n=0;n<7;n++){const band=this.ring(neon[n%4],0,33,0,36.5,.4,sphere);band.rotation.x=n*.3;this.animations.push(t=>{band.rotation.y=t*.08+n*.2;});}for(const x of [-12,12])this.ball(0xffe7a1,x,39,-33,4,sphere);this.ring(0xffe7a1,0,27,-34,10,.7,sphere).scale.y=.5;
  for(let f=.095;f<.21;f+=.016)for(const side of [-1,1]){const g=this.place(f,side*19,'casino',false,'Casino slot machines');for(let n=0;n<3;n++){this.box(0x473e59,(n-1)*2.5,2,0,2,4,2,g);this.box(this.mat(0xf4cc76,true),(n-1)*2.5,2.7,-1.05,1.6,1.6,.1,g);this.box(0xb07773,(n-1)*2.5,.7,-2,1.5,1.4,1.5,g);}}
  for(const f of [.11,.15,.19]){const g=this.place(f,0,'casino');this.ring(0xe7c585,0,17,0,4,.3,g).rotation.x=Math.PI/2;for(let n=0;n<8;n++)this.ball(0xffdd9b,Math.sin(n)*4,17,Math.cos(n)*4,.5,g);}
  for(let f=.68;f<.79;f+=.025){const g=this.place(f,0,'desert',false,'Service compression');this.arch(g,22,13,0x94647c);for(const side of [-1,1])this.box(this.mat(0x9bdddf,true),side*11,8,0,.3,6,.3,g);}
  for(let n=0;n<12;n++){const a=n/12*Math.PI*2;this.ball(0x694e66,-140+Math.sin(a)*740,-4,Math.cos(a)*730,1,this.static,130+n%3*15,24+n%4*6,65+n%3*12);}
 }
}
