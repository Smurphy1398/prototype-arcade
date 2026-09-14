import * as T from 'three';
import type {DestinationTrack} from './track';
import {structural} from '../enclosure';

/** A connected terrain surface shaped by the authored roads. Near pavement its
 * height follows the same bank and support queries; no detached normal skirts. */
export function landform(track:DestinationTrack,kind:'canyon'|'confectionery',parent:T.Object3D){
 const paths=[...track.samples.filter((_,i)=>i%4===0).map(p=>({...p,width:track.widthAt(p.s),route:'main'})),...track.routes.flatMap(b=>b.samples.filter((_,i)=>i%3===0).map(p=>({...p,width:b.halfWidth,route:b.id})))];
 const xmin=-650,xmax=340,zmin=-460,zmax=460,step=8,nx=Math.ceil((xmax-xmin)/step),nz=Math.ceil((zmax-zmin)/step),pos:number[]=[],colors:number[]=[],index:number[]=[];
 const rock=[new T.Color(0x914e3c),new T.Color(0xb56e4a),new T.Color(0xd19364),new T.Color(0xdeb082)],sweet=[new T.Color(0xc08b58),new T.Color(0xe9bb88),new T.Color(0xf0c9ac),new T.Color(0xffdfd4)];
 const height=(x:number,z:number)=>{
  let best=Infinity,p=paths[0];for(const q of paths){const d=(x-q.x)**2+(z-q.z)**2;if(d<best){best=d;p=q;}}
  const dist=Math.sqrt(best),lane=(x-p.x)*p.nx+(z-p.z)*p.nz,road=(p.y??0)+Math.tan(p.bank??0)*lane;
  const shoulder=Math.max(0,dist-p.width-9),noise=Math.sin(x*.022)*Math.cos(z*.027)*4+Math.sin(x*.055+z*.02)*2;
  if(kind==='canyon'){
   const gorge=Math.abs(z-(70+Math.sin(x*.008)*25));
   // The ravine opens below the bridge; its abutments live outside this wash.
   if((p.route==='ravine'||p.route==='main'&&p.s/track.length>.46&&p.s/track.length<.51)&&dist<22)return -54+dist*.13;
   if(dist<=p.width+9)return road-3;
   const f=p.s/track.length,blend=Math.min(1,Math.max(0,(f-.02)/.10),Math.max(0,(.91-f)/.12));
   const approach=road-1.4-Math.min(10,shoulder*.12)+noise*.15;
   if(p.route==='mudline')return road-1+Math.min(50,shoulder*.7)+noise*Math.min(1,shoulder/30);
   const ledge=p.s/track.length>.32&&p.s/track.length<.44&&lane<0;
   if(ledge&&dist<75)return road-2-Math.min(78,shoulder*2.7);
   const rim=road-1+Math.min(105,shoulder*1.35)+noise*Math.min(1,shoulder/25);
   return gorge<10&&dist>70?-55:approach+(rim-approach)*blend;
  }
  const channel=Math.abs(x-(-195+Math.sin(z*.013)*75));
  if(dist<=p.width+9)return road-3;
  // Candy is an open rolling island, with authored cake mountains standing above
  // it. It must not inherit the canyon's continuous cliff-walled driving trench.
  const blend=Math.min(1,shoulder/28),rolling=-6+Math.sin(x*.008)*Math.cos(z*.012)*3;
  const frosting=(road-1.4)*(1-blend)+rolling*blend;
  return channel<16&&dist>35?-12:frosting;
 };
 for(let iz=0;iz<=nz;iz++)for(let ix=0;ix<=nx;ix++){
  const x=xmin+ix*step,z=zmin+iz*step,y=height(x,z);pos.push(x,y,z);
  const palette=kind==='canyon'?rock:sweet,band=((Math.floor(y/(kind==='canyon'?9:6))%4)+4)%4,c=palette[band].clone();c.multiplyScalar(.94+.06*Math.sin(x*.1+z*.07));colors.push(c.r,c.g,c.b);
  if(ix<nx&&iz<nz){const a=iz*(nx+1)+ix;index.push(a,a+nx+1,a+1,a+1,a+nx+1,a+nx+2);}
 }
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('color',new T.Float32BufferAttribute(colors,3));g.setIndex(index);g.computeVertexNormals();
 const m=structural(new T.Mesh(g,new T.MeshStandardMaterial({vertexColors:true,roughness:.97,flatShading:true,side:T.DoubleSide})),'floor',kind==='canyon'?'Connected sandstone canyon':'Cake strata and frosting terrain');parent.add(m);
 return m;
}

export function liquidChannel(points:T.Vector3[],width:number,material:T.Material,parent:T.Object3D,name:string){
 const curve=new T.CatmullRomCurve3(points),pos:number[]=[],idx:number[]=[];
 for(let i=0;i<=160;i++){const p=curve.getPoint(i/160),t=curve.getTangent(i/160),n=new T.Vector3(t.z,0,-t.x).normalize();for(const side of [-1,1])pos.push(p.x+n.x*width*side,p.y,p.z+n.z*width*side);if(i<160){const k=i*2;idx.push(k,k+2,k+1,k+1,k+2,k+3);}}
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(pos,3));geo.setIndex(idx);geo.computeVertexNormals();const m=structural(new T.Mesh(geo,material),'floor',name);parent.add(m);return curve;
}
