import * as T from 'three';
import {SceneKit} from './SceneKit';
import {DestinationTrack} from './track';
import {enclosurePanel,doorway} from '../enclosure';

/** Connected streets and close frontage. Buildings face the road; their depth
 * and height are checked before placement instead of being scattered far away. */
export class StreetDistricts extends SceneKit {
 constructor(track:DestinationTrack,scene:T.Scene){super(track,scene);
  if(track.id==='vegas'){this.vegas();}else this.streets(track.id==='dc');
  this.finish();
 }
 private free(x:number,y:number,z:number,r:number){
  return ![...this.track.samples.filter((_,i)=>i%3===0).map(p=>({...p,width:this.track.widthAt(p.s)})),...this.track.routes.flatMap(b=>b.samples.filter((_,i)=>i%3===0).map(p=>({...p,width:b.halfWidth})))].some(p=>Math.hypot(p.x-x,p.z-z)<p.width+r+2&&(p.y??0)>y-7&&(p.y??0)<y+70);
 }
 private streets(dc:boolean){
  const t=this.track,step=dc?25:23;
  for(let s=8;s<t.length;s+=step){const f=s/t.length,p=t.at(s),urban=dc?(f<.205||f>.742):!(f>.36&&f<.64||f>.67&&f<.83);
   if(!urban)continue;
   for(const side of [-1,1]){
    if(dc&&side===-1&&f>.705&&f<.815)continue;
    if(!dc&&(f<.13||side===-1&&f>.245&&f<.32))continue;
    // Reserve the elevated railway's swept space; nearby facades previously
    // intersected its carriages above the road-clearance sampling height.
    const w=t.widthAt(s),setback=!dc&&side===1&&f>.215&&f<.34?37:17,lane=side*(w+setback),x=p.x+p.nx*lane,z=p.z+p.nz*lane;
    if(!this.free(x,p.y??0,z,13))continue;
    const g=this.place(f,lane,'main',false,dc?'Capital street frontage':'Borough street frontage');g.userData.structure={role:'wall',name:'Checked street frontage'};
    const n=Math.floor(s/step),h=dc?18+n%4*7:35+n%6*13,c=dc?[0xb1a18e,0xbc9a7d,0xd0c4a8,0x939b96][n%4]:[0x997863,0x6d7e8c,0xa48670,0x88959b,0x826f70][n%5];
    // Local X faces the road; local Z joins the next block.
    this.box(c,0,h/2,0,20,h,step-.5,g);this.box(0x465c64,0,h+.8,0,21,1.6,step,g);
    for(let y=7;y<h-3;y+=6)for(let z=-step/2+3;z<step/2-2;z+=5){this.box(dc?0x718b95:0xa9c9ce,-side*10.06,y,z,.12,2.8,2.7,g);this.box(0xd3c4a2,-side*10.15,y-1.7,z,.3,.3,3.2,g);}
    for(let z=-7;z<=7;z+=7){this.box(0x355b69,-side*10.2,2.5,z,.2,4,5.5,g);this.box(dc?0x637d71:0xb87456,-side*12,4.9,z,4,.3,6,g);}
    const pavement=this.place(f,side*(w+3));pavement.userData.structure={role:'floor',name:'Street sidewalk'};this.static.add(enclosurePanel(t,s-step/2,s+step/2,'main',side*(w+.8),side*(w+6),-.18,-.18,this.mat(0xb5b6a5),'Graded street sidewalk','floor'));
    if(n%3===0){const lamp=this.place(f,side*(w+3));lamp.userData.structure={role:'fixture',name:'Street lamp'};this.cyl(0x4e6466,0,4,0,.18,8,lamp);this.rod(0x4e6466,[0,8,0],[-side*2,8,0],.14,lamp);this.ball(0xffe2a0,-side*2,7.8,0,.5,lamp);this.box(0x806d53,side*1.5,.8,2,1.3,1.5,3,lamp);}
    if(!dc&&n%3===1){for(let y=10;y<h*.6;y+=10){this.box(0x405159,-side*11,y,0,2,.18,9,g);for(const z of [-4,4])this.rod(0x405159,[-side*11,y,z],[-side*11,y+10,z+3],.1,g);}}
    if(n%4===0){const stop=this.place(f,side*(w+5));stop.userData.structure={role:'fixture',name:'Bus shelter'};for(const z of [-2,2])this.cyl(0x6b807e,0,1.8,z,.1,3.6,stop);this.box(0x648998,0,3.7,0,2,.2,5,stop);this.box(0x93bbc5,side*.8,2,0,.1,3,4.8,stop);}
   }
  }
  for(const f of dc?[.025,.165,.77,.87]:[.015,.09,.19,.29,.88,.97]){
   const p=t.at(f*t.length),g=this.place(f,0);g.userData.structure={role:'floor',name:'Connected city intersection'};
   // Follow the road grade at intersections, including the elevated subway approach.
   this.static.add(enclosurePanel(t,p.s-9,p.s+9,'main',-40,40,-.12,-.12,this.mat(dc?0xa8aaa0:0x596a72),'Graded intersection','floor'));
   for(const along of [-7,7])for(let x=-9;x<=9;x+=2.2)this.static.add(enclosurePanel(t,p.s+along-1.5,p.s+along+1.5,'main',x-.575,x+.575,.04,.04,this.mat(0xe7dfc7),'Crosswalk paint','floor'));
   for(const side of [-1,1]){const signal=this.place(f,side*(t.halfWidth+5));this.cyl(0x627974,0,4,0,.18,8,signal);this.box(0x364853,0,7,0,.8,2,.6,signal);this.ball(0x92c18a,0,6.5,-.34,.22,signal);}
  }
  // Low-cost distant blocks close vistas beyond the parks without filling the Mall.
  for(let i=0;i<32;i++){const a=i/32*Math.PI*2,x=-130+Math.sin(a)*480,z=-35+Math.cos(a)*440,h=dc?25+i%4*10:80+i%5*25;
   const g=this.group(x,-3,z,this.static,'Outer city block');this.box(dc?0x9c9f96:0x758997,0,h/2,0,65,h,58,g);for(let y=8;y<h;y+=8)this.box(0xafbabb,0,y,-29.1,57,2,.1,g);
  }
 }
 private vegas(){
  const t=this.track,b=t.routes.find(b=>b.id==='casino')!;
  // Recover the interior as a curved casino concourse. A giant rectangular slab
  // used to overhang unrelated Strip sectors and present a black plane overhead.
  for(let s=b.start+18;s<b.end-20;s+=4){const e=Math.min(b.end-20,s+4.04),w=b.halfWidth+7;
   this.static.add(enclosurePanel(t,s,e,b.id,-w,w,18,18,this.mat(0x705273),'Starlight casino ceiling','ceiling'));
   this.static.add(enclosurePanel(t,s,e,b.id,-w,w,-.1,-.1,this.mat(0x946876),'Starlight casino floor','floor'));
   for(const side of [-1,1])if(!doorway(t,s,w*side,b.id)){
    this.static.add(enclosurePanel(t,s,e,b.id,w*side,w*side,0,18,this.mat(0x714968),'Casino wall','wall'));
    this.static.add(enclosurePanel(t,s,e,b.id,w*side,w*side,12,12.2,this.mat(0xf3c380,true),'Casino gold cornice','wall'));
   }
  }
  for(let s=b.start+40;s<b.end-35;s+=25){const g=this.place(s/t.length,0,b.id);g.userData.structure={role:'fixture',name:'Casino lighting'};for(const side of [-1,1]){const lane=side*(b.halfWidth+3);this.box(0x52475e,lane,2,0,2,4,5,g);for(const z of [-1.5,0,1.5])this.box(this.mat(0xf8cc70,true),lane-side*1.05,2.5,z,.1,1.3,1,g);this.cyl(0xc5a580,lane-side*2,.7,0,.7,1.4,g);}this.ring(0xf0c985,0,15,0,4,.25,g).rotation.x=Math.PI/2;}
  // Strip building entrances connect to plazas/sidewalks rather than ending in sand.
  for(let f=.012;f<.98;f+=.012){if(f>.31&&f<.66)continue;const p=t.at(f*t.length),w=t.widthAt(p.s);for(const side of [-1,1]){
   const g=this.place(f,side*(w+5));g.userData.structure={role:'floor',name:'Strip pavement'};this.static.add(enclosurePanel(t,p.s-14,p.s+14,'main',side*(w+1),side*(w+10),-.22,-.22,this.mat(0x927e92),'Graded Strip pavement','floor'));
  }}
 }
}
