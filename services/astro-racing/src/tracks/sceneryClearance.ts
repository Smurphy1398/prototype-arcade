import {Box3,Mesh,Object3D,Vector3} from 'three';
import type {TrackDefinition} from './TrackDefinition';

/** Check the whole driving/camera corridor, including every alternate deck.
 * Run BEFORE static batching; otherwise one bad rock is inseparable from its world.
 * Ground ribbons are tagged terrain and clipped triangle-by-triangle instead.
 */
export function clearScenery(root:Object3D,track:TrackDefinition,exclude=new Set<Object3D>()){
 root.updateMatrixWorld(true);
 const corridors:Box3[]=[];
 for(const r of [{id:'main',samples:track.samples,halfWidth:track.halfWidth},...(track.routes??[])])for(let i=0;i<r.samples.length;i+=2){
  const p=r.samples[i],width=r.halfWidth+1.3,y=p.y??0;
  const a=new Vector3(p.x+p.nx*width,y+.25,p.z+p.nz*width),b=new Vector3(p.x-p.nx*width,y+8,p.z-p.nz*width);
  const box=new Box3().setFromPoints([a,b]);box.expandByVector(new Vector3(1.8,Math.abs(Math.tan(p.bank??0)*width),1.8));corridors.push(box);
 }
 const box=new Box3(),remove=new Set<Object3D>(),v=new Vector3();let clipped=0;
 root.traverse(o=>{
  if(!(o instanceof Mesh)||exclude.has(o))return;
  // Structural walls/ceilings/floors are authored against supported routes and
  // audited by triangle rays. A world-axis bounds overlap is not permission to
  // erase an interior. Keep the legacy behavior for untagged scenery (including
  // the protected Factory/Orbital and accepted Glacier design).
  for(let p:Object3D|null=o;p&&p!==root;p=p.parent)if(p.userData.structure)return;
  o.geometry.computeBoundingBox();box.copy(o.geometry.boundingBox!).applyMatrix4(o.matrixWorld);
  const near=corridors.filter(c=>c.intersectsBox(box));if(!near.length)return;
  if(o.userData.terrain){
   const g=o.geometry,index=g.index,position=g.getAttribute('position'),keep:number[]=[];
   for(let i=0;i<(index?.count??position.count);i+=3){box.makeEmpty();const ids=[];for(let n=0;n<3;n++){const j=index?index.getX(i+n):i+n;ids.push(j);v.fromBufferAttribute(position,j).applyMatrix4(o.matrixWorld);box.expandByPoint(v);}if(near.some(c=>c.intersectsBox(box)))clipped++;else keep.push(...ids);}
   g.setIndex(keep);g.computeVertexNormals();
  }else {let unit:Object3D=o;for(let parent=o.parent;parent&&parent!==root;parent=parent.parent)if(parent.userData.clearanceUnit)unit=parent;remove.add(unit);}
 });
 for(const o of remove)o.removeFromParent();
 root.userData.clearance={removed:remove.size,clipped};return root.userData.clearance;
}
