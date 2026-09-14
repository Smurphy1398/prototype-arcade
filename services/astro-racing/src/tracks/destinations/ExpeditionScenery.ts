import {StreetDistricts} from './StreetDistricts';
import {FarmLife} from './FarmLife';
import {DiscoveryWorlds} from './DiscoveryWorlds';
import {CanyonWorld} from './CanyonWorld';
import {ConfectioneryWorld} from './ConfectioneryWorld';
import {ToyRoomRepairs} from './ToyRoomRepairs';
import {CityWorlds} from './CityWorlds';
import {FantasyWorlds} from './FantasyWorlds';
import * as T from 'three';
import {DestinationTrack} from './track';
import {expedition} from './expeditions';
import {mergeStatic} from '../../core/mergeStatic';
import {clearScenery} from '../sceneryClearance';
import {random} from '../../core/math';

/** Each destination has its own architecture, silhouettes and scenic movement.
 * Decorative objects have no hidden collisions; marked mechanisms are shared. */
export class ExpeditionScenery {
 readonly static=new T.Group();readonly moving=new T.Group();private rng=random(709);
 private fantasy?:FantasyWorlds;private cityWorld?:CityWorlds;private discovery?:DiscoveryWorlds;
 private districts?:StreetDistricts;private farmLife?:FarmLife;
 private repairWorld?:CanyonWorld|ConfectioneryWorld|ToyRoomRepairs;
 private materials=new Map<number,T.MeshStandardMaterial>();private animations:{object:T.Object3D;kind:string;phase:number;base:T.Vector3}[]=[];
 constructor(readonly track:DestinationTrack,scene:T.Scene){
  const plan=expedition(track.id)!;this.static.name='destination-decoration';this.moving.name='destination-motion';scene.add(this.static,this.moving);
  scene.background=new T.Color(plan.sky);scene.fog=new T.Fog(plan.fog,track.id==='atlantis'?110:260,track.id==='atlantis'?620:1100);
  if(['nyc','vegas'].includes(track.id))this.box(plan.ground,-140,-7,-20,1700,8,1500);
  this.terrain();if(['barnyard','dc'].includes(track.id))this.discovery=new DiscoveryWorlds(track,scene);if(['nyc','vegas'].includes(track.id))this.cityWorld=new CityWorlds(track,scene);if(['atlantis','toybox'].includes(track.id))this.fantasy=new FantasyWorlds(track,scene);
  if(track.id==='rally')this.repairWorld=new CanyonWorld(track,scene);if(track.id==='candy')this.repairWorld=new ConfectioneryWorld(track,scene);if(track.id==='toybox')this.repairWorld=new ToyRoomRepairs(track,scene);
  if(['dc','nyc','vegas'].includes(track.id))this.districts=new StreetDistricts(track,scene);if(track.id==='barnyard')this.farmLife=new FarmLife(track,scene);
  clearScenery(this.static,track);this.static.userData.blockTunnels=this.static.children.filter(g=>g.name==='toy-block-arch').length;mergeStatic(this.static);
 }
 private mat(c:number){if(!this.materials.has(c))this.materials.set(c,new T.MeshStandardMaterial({color:c,roughness:.72,flatShading:true}));return this.materials.get(c)!;}
 private mesh(geometry:T.BufferGeometry,c:number|T.Material,x:number,y:number,z:number,parent:T.Object3D=this.static){const m=new T.Mesh(geometry,typeof c==='number'?this.mat(c):c);m.position.set(x,y,z);parent.add(m);return m;}
 private box(c:number|T.Material,x:number,y:number,z:number,w:number,h:number,d:number,parent:T.Object3D=this.static){return this.mesh(new T.BoxGeometry(w,h,d),c,x,y,z,parent);}
 private glow(c:number){return new T.MeshBasicMaterial({color:c});}
 private place(f:number,lane:number,route='main',moving=false){const p=this.track.at(f*this.track.length,route),g=new T.Group();g.position.set(p.x+p.nx*lane,p.y??0,p.z+p.nz*lane);g.rotation.y=Math.atan2(p.tx,p.tz);g.userData.clearanceUnit=true;(moving?this.moving:this.static).add(g);return g;}
 private animate(object:T.Object3D,kind:string,phase=0){this.animations.push({object,kind,phase,base:object.position.clone()});}
 private safe(x:number,z:number,r:number){return ![this.track.samples,...this.track.routes.map(b=>b.samples)].some(points=>points.some((p,i)=>i%3===0&&Math.hypot(p.x-x,p.z-z)<this.track.halfWidth+r+6));}
 private label(text:string,g:T.Object3D,color='#ffe5a3',width=18,y=10){const canvas=document.createElement('canvas');canvas.width=768;canvas.height=192;const c=canvas.getContext('2d')!;c.fillStyle='#193647';c.fillRect(0,0,768,192);c.strokeStyle=color;c.lineWidth=10;c.strokeRect(8,8,752,176);c.fillStyle=color;c.font=`900 ${Math.min(66,660/(text.length*.55))}px Trebuchet MS`;c.textAlign='center';c.fillText(text,384,118);const map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;const m=this.mesh(new T.PlaneGeometry(width,width/4),new T.MeshBasicMaterial({map}),0,y,0,g);m.rotation.y=Math.PI;const near=this.track.surface(g.position.x,g.position.z,'main');const span=near.distance<this.track.halfWidth?Math.max(width*.43,this.track.halfWidth+4):width*.43;for(const side of [-1,1])this.box(0x526574,side*span,y/2,0,.5,y,.5,g);if(near.distance<this.track.halfWidth)this.box(0x526574,0,y+width/8,0,span*2,.4,.5,g);}
 private tree(g:T.Object3D,h=12,c=0x458565){this.mesh(new T.CylinderGeometry(.5,.8,h,5),0x785745,0,h/2,0,g);const crown=this.mesh(new T.IcosahedronGeometry(h*.4,1),c,0,h,0,g);crown.scale.y=.8;}
 private tunnel(route:string,color:number,glass=false){const b=this.track.routes.find(b=>b.id===route)!;
  for(let s=b.start+22;s<b.end-22;s+=12){const g=this.place(s/this.track.length,0,route),w=b.halfWidth+4.5;
   for(const side of [-1,1])this.box(color,side*w,5.5,0,.65,11,.65,g);this.box(color,0,11,0,w*2,.7,.7,g);
   if(glass)this.box(new T.MeshStandardMaterial({color:0x74d8e2,transparent:true,opacity:.12,depthWrite:false}),0,11.5,0,w*2,.18,12,g);
  }
 }
 private terrain(){
  const plan=expedition(this.track.id)!;
  // Wide land shoulders descend into the landscape. Every vertex stays below
  // its road deck; elevated bridge sections keep their open air silhouette.
  if(this.track.id==='toybox')return;
  // The former 65 m normal-offset shoulder folded over tight turns and crossed
  // stacked decks. Clearance then removed individual giant triangles, leaving
  // the comb/wedge artifacts. Use a bounded vertical fascia and discrete piers;
  // terrain is authored as land masses, never stretched from every road normal.
  const positions:number[]=[],indices:number[]=[];
  for(const p of this.track.samples)for(const side of [-1,1]){
    const lane=(this.track.widthAt(p.s)+.55)*side;
    const y=(p.y??0)+Math.tan(p.bank??0)*lane;
    positions.push(p.x+p.nx*lane,y-.35,p.z+p.nz*lane,p.x+p.nx*lane,y-1.8,p.z+p.nz*lane);
  }
  for(let i=0;i<this.track.samples.length;i++)for(const side of [0,2]){
    if(this.track.profile(this.track.samples[i].s).gap)continue;
    const a=i*4+side,b=((i+1)%this.track.samples.length)*4+side;
    indices.push(a,b,a+1,a+1,b,b+1);
  }
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.setIndex(indices);geo.computeVertexNormals();this.mesh(geo,plan.ground,0,0,0);
  for(let f=.02;f<1;f+=.035){const p=this.track.at(f*this.track.length);if((p.y??0)<7||this.track.profile(p.s).gap)continue;const g=this.place(f,0);this.box(plan.ground,0,-((p.y??0)+4)/2,0,4,(p.y??0)+1,4,g);}
  if(this.track.id==='nyc'||this.track.id==='vegas')for(let f=0;f<1;f+=.007){const p=this.track.at(f*this.track.length);if((p.y??0)>12)continue;for(const side of [-1,1]){const g=this.place(f,side*(this.track.halfWidth+4));this.box(this.track.id==='nyc'?0x969ea0:0x826d8d,0,-.55,0,6,.8,16,g);}}
 }
 private city(){
  const colors=[0x735e62,0x788993,0x526577,0x967c69,0x596879];
  for(let x=-660;x<350;x+=57)for(let z=-430;z<530;z+=59){if(!this.safe(x,z,22))continue;const h=35+this.rng()*125,g=new T.Group();g.position.set(x,-3,z);g.userData.clearanceUnit=true;this.static.add(g);this.box(colors[Math.floor(this.rng()*colors.length)],0,h/2,0,38,h,38,g);this.box(0x304657,0,h+2,0,31,4,31,g);for(let y=9;y<h-5;y+=9)for(const side of [-1,1]){this.box(0xa4c5ce,side*19.1,y,0,.2,3.5,29,g);this.box(0xbee0da,0,y,side*19.1,29,3.5,.2,g);}if(h>75){this.mesh(new T.CylinderGeometry(3.5,3.5,6,9),0x9b7a58,0,h+7,0,g);this.mesh(new T.ConeGeometry(4.3,3,9),0x455565,0,h+11,0,g);}}
  for(let f=.005;f<.31;f+=.023){const g=this.place(f,20);this.box(0x536472,0,9,0,.6,18,.6,g);this.box(0x546575,-5,17,0,10,.7,.7,g);this.box(this.glow(0xffe5ac),-9,16.6,0,3,.4,1,g);}
  // Elevated transit crosses above the city; its rolling cars stay off the road.
  const rail=this.place(.315,35);rail.userData.clearanceUnit=false;this.box(0x415566,0,18,0,100,2,9,rail);for(const x of [-40,0,40])this.box(0x607589,x,8,0,2,20,2,rail);
  const train=this.place(.315,35,'main',true);train.position.y+=21;for(let i=0;i<4;i++){this.box(0xa7bbc2,(i-1.5)*16,0,0,15,5,6,train);this.box(0x214c63,(i-1.5)*16,1,-3.1,12,2,.1,train);}this.animate(train,'train');
  for(let f=.69;f<.82;f+=.013)for(const side of [-1,1]){const g=this.place(f,22*side);this.tree(g,10+this.rng()*9);this.box(0x488465,0,-1,0,13,1,13,g);}
  const park=this.place(.74,42);const pond=this.mesh(new T.CircleGeometry(27,32),0x4b99ad,0,-1,0,park);pond.rotation.x=-Math.PI/2;this.label('RESERVOIR PARK',this.place(.68,-24),'#acdca1',17,6);
  const market=this.track.routes.find(b=>b.id==='alley')!;for(let s=market.start+25;s<market.end-20;s+=20){const g=this.place(s/this.track.length,11,'alley');this.box(0xb75c49,0,5,0,8,10,16,g);this.box(0xf4c16c,-3,4,-1,8,.5,8,g);for(let i=0;i<3;i++)this.box([0xe89767,0x88b86a,0xe9c86d][i],-4,.6,(i-1)*2,2,1,1.5,g);}
  // Marked junctions and facades make the street grid legible from the kart.
  for(const f of [.052,.25,.57,.91]){const g=this.place(f,0);for(let i=-4;i<=4;i++)this.box(0xe4ddc9,i*2,.025,0,1.1,.035,6,g);g.userData.clearanceUnit=false;}
  for(const f of [.02,.20,.58,.88]){const g=this.place(f,-25);this.box(0xa26354,0,8,0,16,16,28,g);for(let j=0;j<3;j++){this.box(0x303c47,0,4+j*5,-14.3,15,.5,2,g);for(const x of [-6,6])this.box(0x344853,x,9,-15,.3,15,.3,g);}this.box(0xedc782,0,3,-15.5,17,1,4,g);}
  this.label('BOROUGH DASH',this.place(.008,0),'#ffd266',24,11);
 }
 private vegas(){
  const neon=[0xff76ce,0x88eafb,0xffd86c,0xc38bff];
  for(let i=0;i<44;i++){const f=i/44,side=i%2?1:-1,g=this.place(f,48*side),h=26+(i%5)*15;this.box([0x342e50,0x6a4268,0x394b64][i%3],0,h/2,0,28,h,32,g);for(const x of [-13,13])this.box(this.glow(neon[i%4]),x,h/2,-16.2,.35,h,.4,g);for(let y=5;y<h;y+=9)this.box(this.glow(neon[(i+1)%4]),0,y,-16.2,26,.3,.3,g);if(i%4===0)this.label(['MIRAGE','STARLIGHT','LUCKY MOON','NEON CLUB'][i%4],g,'#ffd86c',23,h-6);}
  for(let f=.005;f<.18;f+=.012)for(const side of [-1,1]){const g=this.place(f,side*23);this.tree(g,12,0x465f61);this.box(this.glow(0xfec179),0,12,0,2,.5,2,g);}
  for(const [i,f]of [.04,.09,.15,.94].entries()){const g=this.place(f,-44);this.label(['NEON MIRAGE','SILVER COMET','STARLIGHT','MOON PALACE'][i],g,['#ff98cd','#a0f3ff','#ffdf93','#b0a7ff'][i],28,24);for(let k=0;k<8;k++)this.mesh(new T.SphereGeometry(.65,6,4),this.glow(neon[i]),(k-3.5)*3.8,19,0,g);}
  const casino=this.track.routes.find(b=>b.id==='casino')!;
  for(let s=casino.start+25;s<casino.end-20;s+=13){const g=this.place(s/this.track.length,0,'casino');for(const side of [-1,1]){this.box(0x71516e,side*16,6,0,3,12,13,g);this.box(0x533d57,side*13,1.7,0,1.5,3.4,2,g);this.box(this.glow(0xf4ca6c),side*12.15,2.2,0,.1,1.3,1.3,g);}this.box(0x483857,0,14,0,37,2,13,g);for(const x of [-5,5])this.mesh(new T.SphereGeometry(.7,8,6),this.glow(0xffc58c),x,11,0,g);}
  this.label('STARLIGHT CASINO',this.place(.09,0,'casino'),'#f7a6e4',20,11);
  for(let f=.025;f<.12;f+=.016){const g=this.place(f,26,'main',true);this.box(0x7b80a8,0,0,0,8,1,8,g);for(let i=0;i<6;i++){const jet=this.mesh(new T.CylinderGeometry(.2,.4,9,6),this.glow(neon[i%4]),Math.sin(i)*3,4,Math.cos(i)*3,g);this.animate(jet,'fountain',i*.5+f*30);}}
  for(let f=.66;f<.90;f+=.025){const g=this.place(f,38*(f% .05<.025?1:-1));this.mesh(new T.ConeGeometry(18,26,5),0xbe795e,0,6,0,g);this.mesh(new T.CapsuleGeometry(.9,7,3,6),0x718452,24,3,0,g);this.box(0x718452,22,4,0,4,.8,.8,g);}
  const wheel=this.place(.92,80,'main',true);wheel.position.y+=35;this.mesh(new T.TorusGeometry(25,.45,5,70),this.glow(0xf991da),0,0,0,wheel);for(let i=0;i<12;i++){const a=i*Math.PI/6;this.mesh(new T.SphereGeometry(2,8,6),this.glow(neon[i%4]),Math.sin(a)*25,Math.cos(a)*25,0,wheel);}this.animate(wheel,'wheel');
 }
 private candy(){
  const colors=[0xf4b1d6,0xffe0a2,0x9fdace,0xc0a1dc];
  for(let i=0;i<110;i++){const g=this.place(i/110,(25+this.rng()*40)*(i%2?1:-1));g.position.y-=3;const scoop=this.mesh(new T.SphereGeometry(7+this.rng()*8,10,6),colors[i%4],0,1,0,g);scoop.scale.y=.6;for(let k=0;k<6;k++){const x=(this.rng()-.5)*8,z=(this.rng()-.5)*8;this.box(colors[(i+k+1)%4],x,4,z,.5,.5,2,g);}}
  for(let i=0;i<36;i++){const g=this.place(i/36,24*(i%2?1:-1));this.mesh(new T.CylinderGeometry(.4,.4,12,7),0xffead1,0,6,0,g);const lolly=this.mesh(new T.TorusGeometry(4,1.6,7,22),colors[i%4],0,14,0,g);this.mesh(new T.SphereGeometry(2.5,10,7),0xfff0bc,0,14,0,g);lolly.rotation.y=i;}
  for(const name of ['wafer','cane']){const b=this.track.routes.find(b=>b.id===name)!;for(let s=b.start+15;s<b.end-15;s+=10){const g=this.place(s/this.track.length,0,name);if(name==='wafer'){g.userData.clearanceUnit=false;this.box(0xc49659,0,-1.7,0,b.halfWidth*2,2.7,10,g);for(const x of [-b.halfWidth,b.halfWidth])this.box(0xffeccb,x,.7,0,.7,1.4,10,g);}else{for(const side of [-1,1])for(let y=1;y<11;y+=2)this.box(y%4===1?0xf596b1:0xffefd3,side*12.5,y,0,1.2,2,1.2,g);this.box(0xffefd3,0,11,0,26,1,1,g);}}}
  for(let f=.03;f<.29;f+=.035){const g=this.place(f,-18);for(let k=0;k<5;k++)this.mesh(new T.CylinderGeometry(.7,.7,5,8),0x542b48,k*1.5,1,0,g).rotation.z=Math.PI/2;}
  this.label('SUGAR SHOALS',this.place(.02,0),'#ffd8ec',22,11);
 }
 private atlantis(){
  for(let i=0;i<80;i++){const g=this.place(i/80,(24+this.rng()*30)*(i%2?1:-1));for(let k=0;k<4;k++){const coral=this.mesh(new T.CapsuleGeometry(.65,5+k,3,5),[0xd97597,0x95b6cb,0xd2a879,0x66b9b5][i%4],(k-1.5)*1.7,2+k,0,g);coral.rotation.z=(k-1.5)*.32;}this.mesh(new T.IcosahedronGeometry(4,0),0x688984,0,-1,0,g);}
  for(let i=0;i<24;i++){const g=this.place(i/24,30*(i%2?1:-1));for(const side of [-1,1]){this.mesh(new T.CylinderGeometry(1.5,1.8,18,10),0x83b7b2,side*9,8,0,g);this.box(0xa2cbc0,side*9,18,0,5,2,5,g);}this.box(0x72a8a7,0,20,0,23,3,6,g);}
  const palace=this.place(.31,75);for(let i=-2;i<=2;i++){this.box(0x629ba6,i*16,19,0,13,38,24,palace);this.mesh(new T.ConeGeometry(10,14,6),0xb4dac6,i*16,45,0,palace);}this.label('THE TIDAL CROWN',palace,'#a6f3df',38,20);
  this.tunnel('glass',0x8fdbd6,true);this.tunnel('ruins',0x96c4b8);
  for(let i=0;i<14;i++){const g=this.place(i/14,15*(i%2?1:-1),'main',true);g.position.y+=45+(i%3)*13;const fish=this.mesh(new T.SphereGeometry(1,9,6),i%2?0xa1d1da:0xacc5cb,0,0,0,g);fish.scale.set(i%4===0?10:3,2,6);const fin=this.mesh(new T.ConeGeometry(3,5,3),0x669fb4,0,0,-7,g);fin.rotation.x=Math.PI/2;this.animate(g,'fish',i);}
  for(let i=0;i<30;i++){const g=this.place(i/30,55*(i%2?1:-1),'main',true);for(let k=0;k<4;k++)this.mesh(new T.SphereGeometry(.3+k*.12,6,4),new T.MeshBasicMaterial({color:0x8bdded,transparent:true,opacity:.23,depthWrite:false}),k,4+k*5,0,g);this.animate(g,'bubbles',i*.9);}
 }
 private toybox(){
  // Real room proportions: the road is a tabletop toy, every prop towers over it.
  this.box(0xbccdd5,-150,155,510,1350,320,12);this.box(0xabbccc,-680,155,-10,12,320,1040);this.box(0xf2ddb8,-150,4,490,1300,18,12);
  for(let x=-650;x<450;x+=55)this.box(0x947053,x,-2,-10,.5,.2,1030);
  this.box(0x766044,-390,91,290,210,12,120);for(const x of [-470,-310])for(const z of [250,330])this.box(0x846847,x,41,z,12,90,12);
  const bed=this.place(.91,100);bed.position.y=-3;this.box(0x737f9f,0,40,0,120,70,190,bed);this.box(0xb69fce,0,82,0,125,22,190,bed);this.box(0xeee1d6,0,100,55,85,15,45,bed);
  for(let i=0;i<35;i++){const g=this.place(i/35,34*(i%2?1:-1));g.position.y=-3;const colors=[0xe28359,0x6594ca,0x85b77c,0xd5b25a];for(let k=0;k<1+i%3;k++){const cube=this.box(colors[(i+k)%4],0,8+k*16,0,16,16,16,g);cube.rotation.y=k*.15;}if(i%6===0)this.label(String.fromCharCode(65+i%26),g,'#fff1c4',12,10);}
  for(const name of ['books','blocks']){const b=this.track.routes.find(b=>b.id===name)!;for(let s=b.start+15;s<b.end-15;s+=16){const g=this.place(s/this.track.length,0,name);if(name==='books'){this.box(0xf5e4bb,0,-1,0,17,1.2,17,g);this.box(0xa15868,0,-1.8,0,18,.6,18,g);for(const x of [-5,0,5])this.box(0xafa18e,x,-.36,0,.2,.05,12,g);}else{g.name='toy-block-arch';for(const side of [-1,1])this.box(0x76a7cb,side*45,16,0,6,32,7,g);this.box(0xe4b953,0,34,0,96,4,7,g);}}}
  const rug=this.place(.06,-80);rug.position.y=-2.8;for(let i=0;i<8;i++)this.box(i%2?0x766d97:0xcdad81,(i-3.5)*15,0,0,15,.15,150,rug);
  for(const [i,f]of [.25,.65,.86].entries()){const g=this.place(f,75);g.position.y=-2;this.box([0xb45c6d,0x78a8b5,0xa38bc6][i],0,5,0,65,10,90,g);this.box(0xe7d8af,0,6,0,62,7,86,g);this.box([0xb45c6d,0x78a8b5,0xa38bc6][i],0,10,0,65,1,90,g);}
  const bear=this.place(.47,75);bear.position.y=-3;for(const x of [-14,14]){this.mesh(new T.SphereGeometry(9,10,7),0x987353,x,4,7,bear);this.mesh(new T.SphereGeometry(8,10,7),0xb58c62,x,42,0,bear);}this.mesh(new T.SphereGeometry(22,12,8),0xb68c60,0,16,0,bear);this.mesh(new T.SphereGeometry(18,12,8),0xc49b6b,0,39,0,bear);this.mesh(new T.SphereGeometry(10,10,7),0xe0bd8f,0,35,-13,bear);for(const x of [-7,7])this.mesh(new T.SphereGeometry(1.7,7,5),0x303646,x,43,-15,bear);
  const mobile=this.place(.15,40,'main',true);mobile.position.y+=100;for(let i=0;i<5;i++){const star=this.mesh(new T.OctahedronGeometry(5),this.glow([0xffc45d,0xa2d8d0,0xd3a3d9][i%3]),Math.sin(i)*30,Math.cos(i)*6,Math.cos(i)*30,mobile);this.box(0x868692,star.position.x,20,star.position.z,.3,40,.3,mobile);}this.animate(mobile,'mobile');
 }
 update(time:number,quality='high'){this.fantasy?.update(time);this.cityWorld?.update(time);this.discovery?.update(time);this.repairWorld?.update(time);this.districts?.update(time);this.farmLife?.update(time);
  this.animations.forEach((a,i)=>{const {object:o,base:b,kind,phase}=a,t=time+phase;o.visible=quality!=='mobile'||i%2===0;
   if(kind==='train')o.position.x=b.x+Math.sin(t*.23)*35;if(kind==='wheel')o.rotation.z=t*.12;if(kind==='mobile')o.rotation.y=t*.1;
   if(kind==='fountain'){o.scale.y=.1+Math.max(0,Math.sin(t*1.2))*.95;o.position.y=b.y*o.scale.y;}
   if(kind==='fish'){o.position.x=b.x+Math.sin(t*.15)*35;o.position.y=b.y+Math.sin(t*.3)*3;o.rotation.z=Math.sin(t)*.07;}
   if(kind==='bubbles')o.position.y=b.y+t*3%40;
  });
 }
}
