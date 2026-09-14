import * as T from 'three';
import {SceneKit} from './SceneKit';
import {DestinationTrack} from './track';

export class FantasyWorlds extends SceneKit {
 constructor(track:DestinationTrack,scene:T.Scene){super(track,scene);if(track.id==='atlantis')this.atlantis();if(track.id==='toybox')this.toybox();if(track.id==='candy')this.candy();this.finish();}
 private atlantis(){
  this.box(0x132f48,-80,-76,-30,1700,15,1500);
  // Layered seabed mesas leave actual black water beneath the high causeways.
  for(let n=0;n<32;n++){const g=this.place(n/32,70*(n%2?1:-1));this.cone(n%2?0x24536b:0x2e6977,0,-28,0,30,65,g,7);this.cone(0x457580,0,-5,0,23,24,g,6);}
  const palace=this.place(.91,-62,'main',false,'Tidal Crown palace');palace.position.y=-6;
  for(let step=0;step<4;step++)this.box(0x568d99,0,step*3,0,90-step*9,3,56-step*7,palace);
  this.box(0x326875,0,26,5,57,32,30,palace);
  for(const x of [-27,-18,-9,0,9,18,27]){this.cyl(0x9bd6ce,x,27,-18,1.5,34,palace);this.box(0xc2e6c7,x,43,-18,4,2,4,palace);}
  this.cone(0x76c2bd,0,53,3,30,17,palace,4).rotation.y=Math.PI/4;
  for(const x of [-38,38]){this.cyl(0x518d9d,x,25,8,7,50,palace);this.cone(0x87d1c4,x,57,8,10,17,palace);}
  this.ring(0xf1d392,0,32,-20,8,1,palace);this.label('TIDAL CROWN',palace,36,17,'#b6ffdf');
  for(const f of [.025,.07,.115,.165,.205,.845,.885]){const g=this.place(f,0,'main',false,'Ruined avenue portal');this.arch(g,31,18,0x73a7ac);for(const side of [-1,1]){this.box(0x416c7a,side*22,0,0,10,2,18,g);this.cyl(0x7da7a7,side*22,5,0,2,10,g);this.ball(0x87bac0,side*22,11,0,3,g);}}
  const wreck=this.place(.31,-28,'main',false,'Shipwreck and hanging chains');
  const hull=this.ball(0x69594d,0,19,0,1,wreck,16,10,57);hull.rotation.z=.27;
  for(let n=-4;n<=4;n++)this.ring(0xa08863,0,21,n*10,13,.65,wreck).scale.y=.7;
  this.box(0x253c4c,0,22,-30,24,8,18,wreck);this.cyl(0x756750,0,53,0,.9,66,wreck);this.rod(0x908069,[-20,58,0],[20,58,0],.6,wreck);
  for(let n=0;n<15;n++){const link=this.ring(0x889f9c,22,48-n*2.4,0,1,.23,wreck);if(n%2)link.rotation.y=Math.PI/2;}
  for(let f=.34;f<.47;f+=.014)for(const side of [-1,1]){const g=this.place(f,side*23,'main',false,'Coral canyon');for(let j=0;j<4;j++){const c=[0xce82ad,0xe7a786,0x678fc1,0x77bd9b][j];this.cyl(c,(j-1.5)*4,8+j*2,0,.75,16+j*4,g);for(const sign of [-1,1])this.rod(c,[(j-1.5)*4,8+j*2,0],[(j-1.5)*4+sign*3,13+j*3,2],.5,g);}}
  const branch=this.track.routes.find(b=>b.id==='glass')!;
  for(let s=branch.start+28;s<branch.end-22;s+=20){const g=this.place(s/this.track.length,0,'glass',false,'Broken aqueduct');this.arch(g,20,13,0x76a5b2);for(const side of [-1,1])this.cyl(0x3b697d,side*9,-14,0,1.3,28,g);}
  for(let f=.49;f<.64;f+=.025){const g=this.place(f,0,'ruins',false,'Wreck passage ribs');this.arch(g,34,16,0x786a59);for(let j=-2;j<=2;j++)this.box(0x8a775e,j*6,17-Math.abs(j)*.7,0,5.8,.7,2,g);}
  for(let f=.73;f<.83;f+=.02){const g=this.place(f,0);this.arch(g,31,17,0x689cae);this.box(new T.MeshStandardMaterial({color:0x88dbe5,transparent:true,opacity:.1,depthWrite:false}),0,18,0,32,.3,20,g);}
  for(let n=0;n<12;n++){const g=this.place(n/12,35*(n%2?1:-1),'main',true,'Fish school');g.position.y+=20+n%3*9;for(let i=0;i<7;i++){this.ball([0xf1ce85,0x97e5d3,0x7dc6ed][n%3],i*3,Math.sin(i)*2,i%2*3,.8,g,2,.8,.6);this.cone(0xa7ddda,i*3+2,Math.sin(i)*2,i%2*3,1,1.5,g,3).rotation.z=Math.PI/2;}const x=g.position.x;this.animations.push(t=>{g.position.x=x+Math.sin(t*.16+n)*18;});}
  const whale=this.place(.62,35,'main',true,'Whale above the abyss');whale.position.y+=64;this.ball(0x609eb0,0,0,0,1,whale,8,6,25);for(const side of [-1,1])this.ball(0x548b9b,side*9,-2,3,1,whale,10,1.2,4);this.ball(0x8fc7c8,0,-4,-3,1,whale,6,2,15);this.animations.push(t=>{whale.rotation.z=Math.sin(t*.2)*.08;});
  for(let n=0;n<55;n++){const p=this.track.at(n/55*this.track.length),bubble=this.mesh(new T.IcosahedronGeometry(.15+n%3*.12,0),this.mat(0x83b5c7,true),p.x+20,p.y??0,p.z,this.moving),y=bubble.position.y;this.animations.push(t=>{bubble.position.y=y+(t*2+n*1.3)%36;});}
 }
 private toybox(){
  // A closed, furnished room at the same scale as the furniture route.
  this.box(0xc49a73,-140,-5,-30,850,4,670);
  for(const x of [-565,285]){this.box(0x8297b5,x,90,-30,5,190,670);this.box(0xf1dfbf,x,8,-30,6,16,670);}
  for(const z of [-365,305]){this.box(0xaab4c2,-140,90,z,850,190,5);this.box(0xf1dfbf,-140,8,z,850,16,6);}
  this.box(0xc9c5b8,-140,190,-30,850,5,670);
  const window=this.group(-160,95,299);this.box(0xf8e7bc,0,0,0,180,135,6,window);this.box(this.mat(0xb7dff1,true),0,0,-4,157,113,2,window);this.box(0xeae1cf,0,0,-6,6,115,5,window);this.box(0xeae1cf,0,0,-6,157,6,5,window);for(const side of [-1,1])this.box(0xc07c95,side*98,0,-8,33,160,8,window);
  const door=this.group(275,76,190);this.box(0xf4dfbc,0,0,0,9,158,84,door);this.box(0xc09364,-6,0,0,5,145,73,door);this.ball(0xe3bb55,-10,-10,-23,4,door);
  const rug=this.place(.025,0,'main',false,'Slot-car play rug');this.box(0x537f93,0,-2.2,25,180,.5,170,rug);for(let n=0;n<8;n++)this.box(n%2?0xe8ad67:0xa6cdb8,(n-3.5)*20,-1.9,25,5,.1,158,rug);
  const bed=this.place(.76,-90,'main',false,'Quilted bed and pillow landing');bed.position.y=-3;
  this.box(0xb37d58,0,8,0,112,17,135,bed);this.box(0xf5dfc9,0,23,0,108,17,130,bed);for(let x=-2;x<=2;x++)for(let z=-3;z<=3;z++)this.box([0x96bfd3,0xe6b278,0xe69b94,0xbed0a2][(x+z+8)%4],x*20,32,z*17,20,2,17,bed);this.box(0xb4805b,0,45,70,116,38,7,bed);for(const x of [-26,26])this.ball(0xffe9d5,x,38,43,1,bed,22,7,17);
  const desk=this.place(.31,-52,'main',false,'Desk and lamp');desk.position.y=-3;this.box(0xcead76,0,29,0,98,4,85,desk);for(const x of [-43,43])for(const z of [-36,36])this.box(0x92715b,x,12,z,6,29,6,desk);this.cyl(0x4e8095,-30,34,18,8,3,desk);this.rod(0x477a8c,[-30,35,18],[-23,72,18],1.4,desk);this.cone(0xe6a94b,-18,70,18,16,14,desk);this.ball(this.mat(0xffe5a4,true) as any,-18,63,18,4,desk);
  for(let n=0;n<6;n++){const pencil=this.cyl([0xdf7771,0x61a5aa,0xf1c670][n%3],n*4-7,33,-12,1,34,desk);pencil.rotation.z=1.48;}
  const shelf=this.place(.44,-61,'main',false,'Bookshelf');shelf.position.y=-3;for(const x of [-40,40])this.box(0xa77654,x,51,0,5,102,34,shelf);for(let row=0;row<4;row++){this.box(0xbf925f,0,row*31+5,0,85,4,35,shelf);for(let n=0;n<8;n++)this.box([0xd4776e,0x769daf,0xe0bd79,0x99ba9b][n%4],(n-3.5)*9,18+row*31,3,7,24,23,shelf);}
  const book=this.place(.15,0,'books',false,'Open storybook seesaw');for(const side of [-1,1]){const page=this.box(0xffe8bc,side*15,-1,0,30,2,42,book);page.rotation.z=side*.12;for(let n=0;n<5;n++)this.box(0xa99b82,side*15,.1,n*5-10,22,.1,.3,book);this.box(0x9e5557,side*15,-2,0,31,1,44,book);}
  for(const [from,to,color]of [[.285,.355,0xc5a16e],[.70,.775,0xbaa4be]] as const){for(let f=from;f<to;f+=.003){const p=this.track.at(f*this.track.length),q=this.track.at((f+.003)*this.track.length),g=this.place(f,0),length=Math.hypot(q.x-p.x,q.z-p.z)+.3;this.box(color,0,-1.6,length/2,31,2,length,g);if(Math.round(f*1000)%9<3)for(const side of [-1,1])this.box(0x987655,side*14,-((p.y??0)+3)/2,0,2.5,(p.y??0)+2,2.5,g);}}
  const chest=this.place(.54,43,'main',false,'Toy chest');this.box(0x719f9f,0,14,0,44,28,32,chest);const lid=this.box(0xf0bc71,0,31,7,46,3,34,chest);lid.rotation.x=-.7;this.label('TREASURES',chest,34,18);
  const doll=this.place(.64,50,'main',false,'Furnished dollhouse');doll.position.y=-3;
  this.box(0xd79da0,0,25,14,73,54,3,doll);for(const x of [-36,0,36])this.box(0xffd3bc,x,25,0,2,54,30,doll);for(const y of [0,27,54])this.box(0xf5d0a3,0,y,0,74,2,31,doll);this.cone(0xae6683,0,67,0,52,26,doll,4).rotation.y=Math.PI/4;for(const x of [-18,18]){this.box(0x7eafba,x,4,0,13,6,17,doll);this.box(0xb9cbce,x,8,5,12,4,7,doll);this.cyl(0xc19265,x,34,0,6,2,doll);for(const dx of [-5,5])this.box(0xc19265,x+dx,30,0,1,8,1,doll);}
  for(const [kind,f,lane,size] of [['bear',.06,-42,7],['dinosaur',.23,40,6],['elephant',.82,38,7],['giraffe',.59,-46,5]] as const){const g=this.place(f,lane,'main',true,'Plush '+kind),a=this.animal(g,kind,size);this.animations.push(t=>{a.rotation.y=Math.sin(t*.4+f)*.1;});}
  for(let n=0;n<28;n++){const g=this.place(n/28,(n%2?1:-1)*(22+n%3*5),'main',false,'Alphabet blocks and toy verge');g.position.y=-3;for(let j=0;j<3;j++){this.box([0xdd8375,0x75abb7,0xe0b966][(n+j)%3],(j-1)*5,2.5,0,4.6,5,5,g);this.label(String.fromCharCode(65+(n+j)%26),this.group((j-1)*5,0,-2.6,g),3.5,2.5,'#fff1d1','#758895');}if(n%4===0){this.car(this.group(0,5,0,g),0x74aeba);}}
  const robot=this.place(.375,22,'main',true,'Wind-up robot');this.robot(robot);robot.scale.setScalar(2);const ry=robot.position.y;this.animations.push(t=>{robot.position.y=ry+Math.abs(Math.sin(t*2))*.8;});
  const plane=this.place(.88,0,'main',true,'Toy aeroplane mobile');plane.position.y+=75;this.ball(0xe5ae5b,0,0,0,1,plane,3,3,14);this.box(0x69a7bd,0,0,0,35,1,8,plane);this.box(0xcc6f6f,0,1,11,13,1,4,plane);this.rod(0xe7d7b7,[0,0,0],[0,100,0],.2,plane);this.animations.push(t=>{plane.rotation.y=t*.15;});
  for(let n=0;n<9;n++){const g=this.place(.91+n*.004,23);this.box(0xeee2c9,0,3,0,3,6,1,g).rotation.z=n>5?.5:0;for(const side of [-1,1])this.ball(0x34516b,side*.6,3,-.53,.22,g);}
  const top=this.place(.5,28,'main',true,'Spinning top');this.cone(0xe5a450,0,4,0,6,7,top).rotation.x=Math.PI;this.cyl(0x689abb,0,8,0,1,5,top);this.animations.push(t=>{top.rotation.y=t*3;});
 }
 private candy(){
  this.box(0x479bad,-160,-23,0,2600,3,2400);
  const island=this.mesh(new T.CylinderGeometry(440,490,22,24),0xb98475,-150,-18,-5);island.scale.z=1.12;
  // Chocolate waterway is a continuous low ribbon; no road-normal terrain skirts.
  const river=new T.CatmullRomCurve3([new T.Vector3(-450,-10,250),new T.Vector3(-245,-10,170),new T.Vector3(-150,-10,0),new T.Vector3(-255,-10,-145),new T.Vector3(-100,-10,-280),new T.Vector3(155,-10,-390)]);
  const water=this.mesh(new T.TubeGeometry(river,100,16,8,false),new T.MeshStandardMaterial({color:0x593529,roughness:.22,metalness:.15}),0,0,0);water.scale.y=.4;
  for(let n=0;n<18;n++){const p=river.getPoint(n/18),foam=this.box(0xb88865,p.x,-3.5,p.z,5,.15,1,this.moving);this.animations.push(t=>{const q=river.getPoint((n/18+t*.016)%1);foam.position.set(q.x,-3.5,q.z);});}
  for(const [f,lane,height]of [[.18,65,92],[.26,-62,115],[.36,54,80],[.47,-58,65],[.76,65,105]] as const){const g=this.place(f,lane,'main',false,'Frosted candy mountain');g.position.y=-8;for(let n=0;n<4;n++){this.cyl([0xca827d,0xead0a6,0xe79da7,0xfbe0c8][n],0,height*.125+n*height*.22,0,47-n*9,height*.25,g,42-n*9,12);this.cyl(0xffecd5,0,height*.25+n*height*.22,0,48-n*9,3,g,45-n*9,12);}for(let n=0;n<12;n++)this.ball([0x80c8b0,0xf2bd69,0xad99cb][n%3],Math.sin(n*2)*22,height*.82+Math.cos(n)*6,Math.cos(n*2)*22,2.5,g);}
  for(let n=0;n<45;n++){const g=this.place(n/45,(n%2?1:-1)*(23+n%3*5),'main',false,'Gumdrop verge');g.position.y=-7;this.ball([0xd784aa,0x97c4b0,0xe7b56c][n%3],0,2,0,3,g,1,1.3,1);this.cyl(0xf3d7ac,0,.3,0,3.4,.6,g);}
  const falls=this.place(.34,-42,'main',true,'Chocolate waterfall');falls.position.y=-3;this.box(0x694030,0,11,0,20,36,3,falls);for(let n=0;n<9;n++){const ribbon=this.box(0x9b6242,(n-4)*2,10,0,1,7,3.3,falls);this.animations.push(t=>{ribbon.position.y=28-(t*9+n*3)%35;});}
  const outlet=falls.localToWorld(new T.Vector3(0,-1,0));let nearest=river.getPoint(0);for(let n=0;n<=100;n++){const q=river.getPoint(n/100);if(Math.hypot(q.x-outlet.x,q.z-outlet.z)<Math.hypot(nearest.x-outlet.x,nearest.z-outlet.z))nearest=q;}const tributary=new T.CatmullRomCurve3([outlet,new T.Vector3((outlet.x+nearest.x)/2,-4,(outlet.z+nearest.z)/2),new T.Vector3(nearest.x,-4,nearest.z)]);this.mesh(new T.TubeGeometry(tributary,24,9,6,false),0x593529,0,0,0);
  const factory=this.place(.61,38,'main',false,'Sugarworks factory');this.box(0xc87e6e,0,17,0,54,34,45,factory);for(const x of [-20,0,20]){this.cone(0xefc792,x,40,0,16,18,factory,4);this.cyl(0xd5a57c,x,51,8,3,39,factory);for(let n=0;n<4;n++)this.ring(0xf0d2af,x,42+n*6,8,3.2,.6,factory).rotation.x=Math.PI/2;}this.label('SUGARWORKS',factory,41,20,'#fff1ae','#70424c');for(const x of [-16,0,16])this.box(0xa6d3c3,x,10,-23,10,12,.3,factory);
  for(let f=.56;f<.69;f+=.023){const g=this.place(f,0,'cane',false,'Taffy factory conveyor');this.arch(g,24,15,0xe5b886);for(const side of [-1,1]){this.cyl(0xe99cae,side*22,8,0,2,16,g);for(let n=0;n<5;n++)this.ring(0xffe3bc,side*22,2+n*3,0,2.1,.45,g).rotation.x=Math.PI/2;}}
  const harbor=this.place(.015,-36,'main',false,'Biscuit harbor');harbor.position.y=-19;this.box(0xbc8b55,0,-3,0,64,2,63,harbor);for(let n=0;n<4;n++){const boat=this.group((n-1.5)*20,-2,35,harbor);this.ball(0xb57763,0,0,0,1,boat,6,3,12);this.cyl(0x5c3d42,0,9,0,.5,20,boat);this.cone(0xf2cd91,0,13,0,8,13,boat,3).scale.z=.1;}
  for(let n=0;n<42;n++){const g=this.place(n/42,(28+n%3*9)*(n%2?1:-1),'main',false,'Candy grove');g.position.y=-7;this.cyl(0xeed0b7,0,7,0,.65,14,g);const sweet=this.ball([0xef9dad,0x95cfb9,0xf0c974][n%3],0,16,0,5,g);this.ring(0xffe6bd,0,16,-.5,3.4,.7,g);}
  for(let n=0;n<18;n++){const a=n/18*Math.PI*2;const island=this.mesh(new T.IcosahedronGeometry(1,1),0xf0c3ae,-150+Math.sin(a)*490,-11,Math.cos(a)*525, this.static);island.scale.set(22,4,16);}
 }
}
