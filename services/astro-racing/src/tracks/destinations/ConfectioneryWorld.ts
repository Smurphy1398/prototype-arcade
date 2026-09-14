import * as T from 'three';
import {SceneKit} from './SceneKit';
import {DestinationTrack} from './track';
import {landform,liquidChannel} from './Landform';
import {enclosurePanel,doorway} from '../enclosure';

export class ConfectioneryWorld extends SceneKit {
 constructor(track:DestinationTrack,scene:T.Scene){super(track,scene);
  landform(track,'confectionery',this.static);
  const chocolate=new T.MeshStandardMaterial({color:0x663724,roughness:.2,metalness:.12,side:T.DoubleSide});
  const points=Array.from({length:12},(_,i)=>{const z=-460+i*85;return new T.Vector3(-195+Math.sin(z*.013)*75,-10,z);});
  const river=liquidChannel(points,14,chocolate,this.static,'Flowing chocolate river');
  for(let i=0;i<22;i++){const ripple=this.ring(0xb7764b,0,0,0,2,.11,this.moving);ripple.rotation.x=Math.PI/2;ripple.scale.set(1,.45,1);this.animations.push(t=>{const p=river.getPoint((i/22+t*.018)%1);ripple.position.set(p.x,-9.92,p.z);});}
  // Foreground wafer strata and soft, irregular frosting caps frame the road.
  for(const [f,lane,h]of [[.175,-65,79],[.26,-72,115],[.375,66,90],[.49,-52,63],[.79,75,105]] as const){
   const g=this.place(f,lane,'main',false,'Frosting mountain');g.position.y=-8;
   // Irregular edible peaks, with sloping cake strata and soft frosting drips.
   // Vary both radius and ridge height so these read as mountains, not stacked cakes.
   const layers=10,segments=18,positions:number[]=[],colors:number[]=[],indices:number[]=[];
   for(let level=0;level<=layers;level++)for(let n=0;n<=segments;n++){
    const a=n/segments*Math.PI*2,u=level/layers,r=45*Math.pow(1-u,.68)*(1+.22*Math.sin(a*3+f*12)+.13*Math.cos(a*5)),y=h*u*(.83+.17*Math.sin(a*2+f*17));
    positions.push(Math.sin(a)*r+u*12,y,Math.cos(a)*r);
    const color=new T.Color(level>=7?0xffd8de:[0xb47549,0xd59b68,0xf0c899][level%3]);colors.push(color.r,color.g,color.b);
    if(level<layers&&n<segments){const k=level*(segments+1)+n;indices.push(k,k+1,k+segments+1,k+1,k+segments+2,k+segments+1);}
   }
   const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.setAttribute('color',new T.Float32BufferAttribute(colors,3));geo.setIndex(indices);geo.computeVertexNormals();this.mesh(geo,new T.MeshStandardMaterial({vertexColors:true,roughness:.83,side:T.DoubleSide}),0,0,0,g);
   for(let n=0;n<12;n++){const a=n/12*Math.PI*2,r=18*(1+.2*Math.sin(a*3+f*12));this.ball(0xffd8de,Math.sin(a)*r+8,h*.66,Math.cos(a)*r,4,g,1,1.8+n%3,1);}
   this.ball(0xed789c,12,h*.86,0,4,g);
  }
  const glossy=[0xe981a7,0x71cdb5,0xeebb62,0xab86cf].map(color=>new T.MeshStandardMaterial({color,roughness:.19,metalness:.08}));
  for(let n=0;n<48;n++){const f=n/48,side=n%2?1:-1,g=this.place(f,side*(track.widthAt(f*track.length)+8+n%3*5),'main',false,'Candy grove');
   this.cyl(0xf7ddb9,0,5,0,.45,10,g);this.mesh(new T.SphereGeometry(4,12,8),glossy[n%4],0,12,0,g);const ring=this.ring(0xffedda,0,12,-3.4,2.5,.5,g);ring.rotation.z=n*.6;
   for(const x of [-4,4])this.ball([0x8dd1ba,0xf1b977,0xdc9fba][n%3],x,1.5,3,2,g,1,1.3,1);
  }
  // A real chocolate fall and splash pool feed the same watercourse.
  const fallZ=180,fallX=-195+Math.sin(fallZ*.013)*75,falls=this.group(fallX,-10,fallZ,this.static,'Chocolate falls');
  this.box(0xaa714c,0,13,-7,28,27,12,falls);this.box(chocolate,0,14,0,17,30,.6,falls);this.ball(0x663724,0,.1,5,1,falls,24,.1,18);
  for(let i=0;i<10;i++){const streak=this.box(0xa46b44,(i-4.5)*1.5,0,.4,1.1,4,.15,this.moving);this.animations.push(t=>{streak.position.set(fallX+(i-4.5)*1.5,17-(t*8+i*2)%27,fallZ+.4);});}
  const factory=this.place(.62,42,'main',false,'Sugarworks');
  this.box(0xc77676,0,14,0,45,28,36,factory);this.box(0xf0bd90,0,29,0,48,3,39,factory);
  for(const x of [-15,0,15]){this.cone(0xf6d5a0,x,38,0,13,16,factory,4);this.box(0x95c6c4,x,12,-18.2,10,11,.3,factory);this.cyl(0xca956d,x,43,10,2.5,23,factory);}
  this.label('SUGARWORKS',factory,36,24,'#ffebbd','#813f56');
  // Narrow wafer workshop: continuous walls, wide end portals and overhead gears.
  const wafer=track.routes.find(b=>b.id==='wafer')!;
  for(let s=wafer.start+24;s<wafer.end-25;s+=4){const end=Math.min(wafer.end-25,s+4.05),w=wafer.halfWidth+3;
   this.static.add(enclosurePanel(track,s,end,wafer.id,-w,w,12,12,this.mat(0xeacb9b),'Wafer workshop ceiling','ceiling'));
   for(const side of [-1,1])if(!doorway(track,s,w*side,wafer.id)){
    this.static.add(enclosurePanel(track,s,end,wafer.id,w*side,w*side,0,12,this.mat(0xb98150),'Wafer biscuit wall','wall'));
    const g=this.place(s/track.length,w*side,wafer.id);for(const y of [2,5,8,11])this.box(0xe8bd84,-side*.1,y,0,.15,.25,4,g);
   }
  }
  const cane=track.routes.find(b=>b.id==='cane')!;
  for(let s=cane.start+16;s<cane.end-18;s+=16){const g=this.place(s/track.length,0,cane.id,false,'Taffy rollers');g.userData.structure={role:'fixture',name:'Taffy frame'};
   for(const side of [-1,1]){this.cyl(0xf1c798,side*(cane.halfWidth+4),6,0,1,12,g);const wheel=this.ring(0xd8929a,side*(cane.halfWidth+4),8,0,2.4,.6,g);wheel.rotation.y=Math.PI/2;}
   this.box(0xeac09b,0,13,0,cane.halfWidth*2+9,1.2,2,g);
  }
  this.finish();
 }
}
