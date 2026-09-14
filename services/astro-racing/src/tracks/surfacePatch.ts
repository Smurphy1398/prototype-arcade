import { BufferGeometry, Float32BufferAttribute } from 'three';
import type { TrackDefinition } from './TrackDefinition';
/** Draped road detail: curvature, elevation and banking use the road's samples. */
export function surfacePatch(track:TrackDefinition,start:number,end:number,left:number,right:number,offset=.05,route='main'){
 const positions:number[]=[],uv:number[]=[],indices:number[]=[],steps=Math.max(1,Math.ceil((end-start)/1.5));
 for(let i=0;i<=steps;i++){
  const s=start+(end-start)*i/steps,p=track.at(s,route);
  for(const lane of [left,right]){positions.push(p.x+p.nx*lane,(p.y??0)+Math.tan(p.bank??0)*lane+offset,p.z+p.nz*lane);uv.push((lane-left)/(right-left),i/steps);}
  if(i<steps){const j=i*2;indices.push(j,j+2,j+1,j+1,j+2,j+3);}
 }
 const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(positions,3));g.setAttribute('uv',new Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();return g;
}
