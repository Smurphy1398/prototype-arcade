import * as THREE from 'three';
import { angleDelta, damp } from '../core/math';
import type { KartState } from './KartPhysics';
export class ChaseCamera {
  private heading=0;
  private rear=0;
  private look=new THREE.Vector3();
  private target=new THREE.Vector3();
  constructor(readonly camera:THREE.PerspectiveCamera) {}
  snap(k:KartState) {this.rear=0;this.heading=k.heading;this.camera.position.set(k.x-Math.sin(k.heading)*9,5.2+k.y,k.z-Math.cos(k.heading)*9);this.look.set(k.x,1.2+k.y,k.z);this.camera.lookAt(this.look);}
  update(k:KartState,dt:number,lookBehind=false) {
    this.rear=damp(this.rear,lookBehind?Math.PI:0,15,dt);
    this.heading+=angleDelta(this.heading,k.heading)*(1-Math.exp(-6*dt));
    const speed=Math.abs(k.speed),distance=8.4+Math.min(speed/33,1)*1.5;
    const cameraHeading=this.heading+this.rear;
    this.target.set(k.x-Math.sin(cameraHeading)*distance, k.y+5.3+Math.sin(this.rear)*2,k.z-Math.cos(cameraHeading)*distance);
    this.camera.position.lerp(this.target,1-Math.exp(-10*dt));
    this.look.lerp(new THREE.Vector3(k.x+Math.sin(cameraHeading)*5,1.45+k.y,k.z+Math.cos(cameraHeading)*5),1-Math.exp(-12*dt));
    this.camera.lookAt(this.look);
    const fov=damp(this.camera.fov,k.boost>0?73:62+speed*.1,5,dt);
    if(Math.abs(fov-this.camera.fov)>.005){this.camera.fov=fov;this.camera.updateProjectionMatrix();}
  }
  menu(k:KartState,time:number,dt:number){
    const h=k.heading+.52+Math.sin(time*.13)*.09;
    this.target.set(k.x+Math.cos(h)*6-Math.sin(h)*7,k.y+3.6,k.z-Math.sin(h)*6-Math.cos(h)*7);
    this.camera.position.lerp(this.target,1-Math.exp(-3*dt));
    this.look.set(k.x+3.3,k.y+1.25,k.z+2);this.camera.lookAt(this.look);this.camera.fov=52;this.camera.updateProjectionMatrix();
  }
}
