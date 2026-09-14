import * as T from 'three';
import {SceneKit} from './SceneKit';
import {DestinationTrack} from './track';
import {landform,liquidChannel} from './Landform';
import {structural,enclosurePanel,doorway} from '../enclosure';

export class CanyonWorld extends SceneKit {
 constructor(track:DestinationTrack,scene:T.Scene){super(track,scene);
  scene.background=new T.Color(0xe3bd91);scene.fog=new T.Fog(0xd5ad88,300,1200);
  landform(track,'canyon',this.static);
  const water=new T.MeshStandardMaterial({color:0x638f8d,roughness:.3,metalness:.15,side:T.DoubleSide});
  liquidChannel([new T.Vector3(-660,-52,56),new T.Vector3(-400,-52,89),new T.Vector3(-190,-52,48),new T.Vector3(320,-52,77)],8,water,this.static,'Ravine river');
  for(let n=0;n<18;n++){const angle=n/18*Math.PI*2,g=this.group(-160+Math.sin(angle)*670,-12,Math.cos(angle)*580,this.static,'Distant stratified rim');const h=95+(n%4)*24;
   for(let i=0;i<5;i++)this.cyl([0x965d48,0xb77854,0xc18c65,0xd4a179,0xe0b58b][i],0,(i+.5)*h/5,0,98-i*5,h/5,g,92-i*5,7);
  }
  // Both crossing choices have load-bearing decks, piers and masonry abutments.
  for(const route of ['main','ravine']){
   const b=track.routes.find(b=>b.id===route),from=b?b.start+18:track.length*.465,to=b?b.end-20:track.length*.52;
   for(let s=from;s<to;s+=7){const p=track.at(s,route);if(track.profile(s,route).gap)continue;const w=b?b.halfWidth:track.widthAt(s),g=this.place(s/track.length,0,route);g.userData.structure={role:'floor',name:'Ravine bridge framing'};
    this.static.add(enclosurePanel(track,s-3.6,s+3.6,route,-w-.5,w+.5,-.65,-.65,this.mat(0x8b6d55),'Ravine bridge underside','floor'));
    for(const side of [-1,1])this.box(0x464c4b,side*(w-.4),-4.2,0,.7,2.2,7.5,g);
    if(Math.floor((s-from)/7)%5===0){const h=(p.y??0)+51;for(const side of [-1,1]){this.box(0x946d50,side*(w-.5),-h/2-2,0,3.2,h,5,g);this.rod(0x515757,[side*(w-.5),-8,-12],[side*(w-.5),-2,0],.35,g);}}
   }
   for(const s of [from,to]){const g=this.place(s/track.length,0,route),w=b?b.halfWidth:track.widthAt(s);g.userData.structure={role:'floor',name:'Bridge abutment'};this.box(0xa17b58,0,-6,0,w*2+7,10,10,g);}
  }
  // The low wash is part of the land, with water and a visibly dry outer line.
  const wash=track.routes.find(b=>b.id==='mudline')!;
  for(let s=wash.start+25;s<wash.end-25;s+=5){const g=this.place(s/track.length,0,wash.id);g.userData.structure={role:'floor',name:'Wet wash bed'};this.static.add(enclosurePanel(track,s-2.6,s+2.6,wash.id,-wash.halfWidth-3,wash.halfWidth+3,-.6,-.6,this.mat(0x785641),'Wash terrain bed','floor'));for(const side of [-1,1])if(!doorway(track,s,side*(wash.halfWidth+5),wash.id))this.ball(0x927359,side*(wash.halfWidth+5),-.4,0,1,g,1.3,.5,1);}
  const pits=this.place(.016,-39,'main',false,'Rally service paddock');
  for(let n=0;n<3;n++){const g=this.group(0,0,(n-1)*23,pits);for(const x of [-8,8])for(const z of [-8,8])this.cyl(0x68767a,x,4,z,.18,8,g);this.cone([0xd36c4d,0x528b9d,0xe8c99a][n],0,10,0,13,5,g,4).rotation.y=Math.PI/4;this.box(0x385266,0,1.4,0,4,2.2,8,g);this.box(0x9ec5ce,0,2.9,0,3.2,1.3,4,g);this.wheels(g,2,2.5,.8);}
  for(const f of [.08,.17,.53,.93]){const g=this.place(f,track.widthAt(f*track.length)+5);for(let n=0;n<5;n++)for(let h=0;h<2;h++){const tire=this.ring(0x343b3d,0,.6+h*1.2,(n-2)*2.5,1,.35,g);tire.rotation.x=Math.PI/2;}}
  const gate=this.place(.008,0,'main',false,'Redline timing gantry');this.arch(gate,32,13,0x485356);this.label('REDLINE RALLY',gate,28,13,'#ffe1ad','#853f30');
  for(let i=0;i<12;i++){const g=this.place(.05+i*.006,-24,'main',false,'Spectator turnout');this.cyl([0xcf765b,0x759a9c,0xe0c381][i%3],0,1.7,0,.45,1.5,g);this.ball(0xd7aa83,0,2.8,0,.5,g);}
  this.finish();
 }
}
