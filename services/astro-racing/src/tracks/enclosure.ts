import * as T from 'three';
import type {TrackDefinition} from './TrackDefinition';

/** Structural surfaces have explicit roles. They are never deleted by scenery
 * cleanup: geometry conflicts are reported and repaired by the course author.
 * Panels follow the sampled road, rather than a rotated box's broad AABB. */
export function structural<TObject extends T.Object3D>(object:TObject,role:'wall'|'ceiling'|'floor'|'fixture',name:string):TObject {
 object.userData.structure={role,name};object.name=name;return object;
}

export function enclosurePanel(track:TrackDefinition,start:number,end:number,route:string,
 laneA:number,laneB:number,heightA:number,heightB:number,material:T.Material,name:string,role:'wall'|'ceiling'|'floor') {
 const positions:number[]=[],indices:number[]=[];
 const steps=Math.max(1,Math.ceil((end-start)/2));
 for(let i=0;i<=steps;i++){
  const p=track.at(start+(end-start)*i/steps,route);
  for(const [lane,h] of [[laneA,heightA],[laneB,heightB]]){
   const x=p.x+p.nx*lane,z=p.z+p.nz*lane;let y=(p.y??0)+Math.tan(p.bank??0)*lane+h;
   if(role==='floor'){const q=track.surface(x,z,route,p.s);if(q.distance<(q.halfWidth??track.halfWidth)+3)y=Math.min(y,q.height+h);}
   positions.push(x,y,z);
  }
  if(i<steps){const n=i*2;indices.push(n,n+2,n+1,n+1,n+2,n+3);}
 }
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();
 const m=new T.Mesh(g,material);m.material.side=T.DoubleSide;return structural(m,role,name);
}

/** Open only the actual side doorway where another supported route joins. */
export function doorway(track:TrackDefinition,s:number,lane:number,route='main',height=6){
 const p=track.at(s,route),x=p.x+p.nx*lane,z=p.z+p.nz*lane;
 for(const other of [{id:'main',samples:track.samples,halfWidth:track.halfWidth},...(track.routes??[])]){
  if(other.id===route)continue;
  for(let i=0;i<other.samples.length;i+=2){const q=other.samples[i];
   if(Math.abs((p.y??0)-(q.y??0))<height&&Math.hypot(q.x-x,q.z-z)<other.halfWidth+2)return true;
  }
 }
 return false;
}
