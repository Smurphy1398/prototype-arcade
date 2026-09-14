import type {TrackDefinition} from './TrackDefinition';
/** Subdivide only where a triangle disagrees with the supported height field.
 * Inner-bend folds retain upward winding so refinement cannot leave slivers. */
export function refineRoad(track:TrackDefinition,positions:number[],uv:number[],indices:number[],vertexS:number[],offset:number){
 const refined:number[]=[],cache=new Map<string,number>();
 const midpoint=(a:number,b:number)=>{const key=Math.min(a,b)+':'+Math.max(a,b),known=cache.get(key);if(known!==undefined)return known;const x=(positions[a*3]+positions[b*3])/2,z=(positions[a*3+2]+positions[b*3+2])/2,s=(vertexS[a]+vertexS[b])/2,i=vertexS.length;positions.push(x,track.surface(x,z,'main',s).height+offset,z);uv.push((uv[a*2]+uv[b*2])/2,(uv[a*2+1]+uv[b*2+1])/2);vertexS.push(s);cache.set(key,i);return i;};
 const refine=(a:number,b:number,c:number,depth=0)=>{
  const ax=positions[a*3],az=positions[a*3+2],bx=positions[b*3],bz=positions[b*3+2],cx=positions[c*3],cz=positions[c*3+2];
  if((bz-az)*(cx-ax)-(bx-ax)*(cz-az)<0)[b,c]=[c,b];
  const x=(ax+bx+cx)/3,z=(az+bz+cz)/3,s=(vertexS[a]+vertexS[b]+vertexS[c])/3,y=(positions[a*3+1]+positions[b*3+1]+positions[c*3+1])/3;
  if(depth<5&&Math.abs(track.surface(x,z,'main',s).height+offset-y)>.025){const ab=midpoint(a,b),bc=midpoint(b,c),ca=midpoint(c,a);refine(a,ab,ca,depth+1);refine(ab,b,bc,depth+1);refine(ca,bc,c,depth+1);refine(ab,bc,ca,depth+1);}else refined.push(a,b,c);
 };
 for(let i=0;i<indices.length;i+=3)refine(indices[i],indices[i+1],indices[i+2]);return refined;
}

/** Cut a terrain-skirt triangle only when it covers a supported lower road.
 * Road meshes, collision surfaces, route layout and all buildings stay intact. */
export function clipRoadSkirt(track:TrackDefinition,positions:number[],indices:number[]){
 const probes=(track.routes??[]).flatMap(b=>b.samples.flatMap(p=>[-b.halfWidth,0,b.halfWidth].map(lane=>{const x=p.x+p.nx*lane,z=p.z+p.nz*lane;return {x,z,y:track.surface(x,z,b.id,p.s).height};}))),clean:number[]=[];
 for(let i=0;i<indices.length;i+=3){const ids=indices.slice(i,i+3),[a,b,c]=ids.map(i=>({x:positions[i*3],y:positions[i*3+1],z:positions[i*3+2]})),den=(b.z-c.z)*(a.x-c.x)+(c.x-b.x)*(a.z-c.z);if(Math.abs(den)<1e-8){clean.push(...ids);continue;}
  const overlap=probes.some(p=>{if(p.x<Math.min(a.x,b.x,c.x)||p.x>Math.max(a.x,b.x,c.x)||p.z<Math.min(a.z,b.z,c.z)||p.z>Math.max(a.z,b.z,c.z))return false;const u=((b.z-c.z)*(p.x-c.x)+(c.x-b.x)*(p.z-c.z))/den,v=((c.z-a.z)*(p.x-c.x)+(a.x-c.x)*(p.z-c.z))/den,w=1-u-v;if(u<0||v<0||w<0)return false;const y=a.y*u+b.y*v+c.y*w;return y>p.y+.25&&y<p.y+7;});
  if(!overlap)clean.push(...ids);
 }return clean;
}
