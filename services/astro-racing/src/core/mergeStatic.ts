import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
/** Collapse an owned static subtree into one draw per material. Call before dynamics are added. */
export function mergeStatic(root:THREE.Group){
  root.updateMatrixWorld(true);const inverse=root.matrixWorld.clone().invert();
  const batches=new Map<THREE.Material,THREE.BufferGeometry[]>(),sources=new Set<THREE.BufferGeometry>();
  root.traverse(object=>{if(!(object instanceof THREE.Mesh)||Array.isArray(object.material))return;
    let geometry=object.geometry.index?object.geometry.toNonIndexed():object.geometry.clone();
    if(!geometry.getAttribute('uv'))geometry.setAttribute('uv',new THREE.Float32BufferAttribute(new Float32Array(geometry.getAttribute('position').count*2),2));
    geometry.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverse,object.matrixWorld));
    if(!batches.has(object.material))batches.set(object.material,[]);batches.get(object.material)!.push(geometry);sources.add(object.geometry);
  });
  root.clear();
  for(const [material,geometries]of batches){const merged=mergeGeometries(geometries,false);if(!merged)throw new Error('Static feature geometry could not be merged');const mesh=new THREE.Mesh(merged,material);mesh.castShadow=true;mesh.receiveShadow=true;root.add(mesh);for(const geometry of geometries)geometry.dispose();}
  for(const geometry of sources)geometry.dispose();
}
