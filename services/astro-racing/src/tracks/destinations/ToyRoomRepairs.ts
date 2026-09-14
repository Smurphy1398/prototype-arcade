import * as T from 'three';
import {SceneKit} from './SceneKit';
import {DestinationTrack} from './track';
import {enclosurePanel,doorway,structural} from '../enclosure';

/** Repairs the existing furnished room; keeps its quilt, window, plush toys and
 * furniture while making the track actually occupy books and dollhouse rooms. */
export class ToyRoomRepairs extends SceneKit {
 constructor(track:DestinationTrack,scene:T.Scene){super(track,scene);
  const b=track.routes.find(b=>b.id==='blocks')!;
  for(let s=b.start+24;s<b.end-24;s+=4){const e=Math.min(b.end-24,s+4.04),w=b.halfWidth+4;
   this.static.add(enclosurePanel(track,s,e,b.id,-w,w,14,14,this.mat(0xf5d0a3),'Dollhouse ceiling','ceiling'));
   this.static.add(enclosurePanel(track,s,e,b.id,-w,w,-.7,-.7,this.mat(0xdeb585),'Dollhouse floor','floor'));
   for(const side of [-1,1])if(!doorway(track,s,w*side,b.id))this.static.add(enclosurePanel(track,s,e,b.id,w*side,w*side,0,14,this.mat(0xffd3bc),'Dollhouse wallpaper','wall'));
  }
  for(const fraction of [.59,.625,.654]){const g=this.place(fraction,b.halfWidth+2,b.id);g.userData.structure={role:'fixture',name:'Dollhouse furnishings'};
   this.box(0x7eafba,0,1.5,0,2,3,5,g);this.box(0xbad1d3,0,3.3,1,2,1,2,g);this.box(0xdeba75,0,8,0,.15,3,3,g);
  }
  const books=track.routes.find(b=>b.id==='books')!;
  for(let s=books.start+14;s<books.end-16;s+=5){const p=track.at(s,books.id),g=this.place(s/track.length,0,books.id);g.userData.structure={role:'floor',name:'Book-page support'};
   const q=track.at(s-2.7,books.id),v=track.at(s+2.7,books.id),top=Math.min(track.surface(q.x,q.z,books.id,q.s).height,track.surface(v.x,v.z,books.id,v.s).height)-.45,h=top+3;this.box(0xad5d6e,0,top-(p.y??0)-h/2,0,books.halfWidth*2+1,h,5.4,g);this.static.add(enclosurePanel(track,s-2.7,s+2.7,books.id,-books.halfWidth,books.halfWidth,-.12,-.12,this.mat(0xf3dfb7),'Graded book pages','floor'));
   for(let y=1;y<h;y+=1.2)this.box(0xe8d4ac,0,top-(p.y??0)-y,0,books.halfWidth*2+.2,.1,5.25,g);
  }
  // A visible feeder gives the marble crossings a source, not a spawning dot.
  for(const f of [.425,.452]){const g=this.place(f,-23,'main',false,'Marble run feeder');g.userData.structure={role:'fixture',name:'Marble feeder'};
   for(const x of [-5,5])this.box(0x8bacb7,x,5,0,1,10,1,g);this.box(0xddac66,0,11,0,14,1.3,8,g);
   const chute=this.box(0x6999b9,9,7,0,20,.8,5,g);chute.rotation.z=-.34;for(const z of [-2.5,2.5]){const rail=this.box(0xe4c879,9,8,z,20,1,0.4,g);rail.rotation.z=-.34;}
   for(let n=0;n<3;n++)this.ball([0x67bcd2,0xe6ae53,0xcc7e9e][n],(n-1)*3,13,0,1.8,g);
  }
  // The crossing train runs on its own recognizable rails and timber sleepers.
  const train=track.hazards.find(h=>h.kind==='toytrain')!;
  if(train){const g=this.place(train.s/track.length,0,train.route);g.userData.structure={role:'floor',name:'Toy railway'};
   for(let x=-48;x<=48;x+=2.5)this.box(0xad8258,x,.02,0,1.5,.08,5.8,g);
   for(const z of [-1.9,1.9])this.box(0xabb8be,0,.1,z,100,.13,.3,g);
   for(const side of [-1,1]){this.cyl(0xc26d5c,side*25,5,5,.4,10,g);const board=this.box(0xf4d995,side*25,9,5,6,1.1,.4,g);board.rotation.z=.65;const cross=this.box(0xf4d995,side*25,9,5,6,1.1,.4,g);cross.rotation.z=-.65;}
  }
  const top=this.place(.507,19,'main',true,'Wobbling wooden top');this.cone(0xd2944e,0,3,0,4,6,top).rotation.x=Math.PI;this.cyl(0x638ea5,0,6.4,0,.5,2.4,top);this.animations.push(t=>{top.rotation.y=t*5;top.rotation.z=Math.sin(t*2)*.16;});
  this.finish();
 }
}
