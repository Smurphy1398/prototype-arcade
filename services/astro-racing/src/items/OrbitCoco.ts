import {clamp} from '../core/math';
import type {Racer} from '../race/Racer';
import type {KartState} from '../vehicle/KartPhysics';

export const COCO_RADIUS=.43;
export function chargeCount(mask:number){return (mask&1)+((mask>>1)&1)+((mask>>2)&1);}
export function orbitMask(r:Pick<Racer,'item'|'charges'|'orbitMask'>){
  if(r.item!=='triple')return 0;
  // Also supports developer grants and saved snapshots predating stable slots.
  return chargeCount(r.orbitMask)===r.charges?r.orbitMask:(1<<r.charges)-1;
}
export function orbitPoint(k:Pick<KartState,'x'|'y'|'z'|'heading'>,time:number,slot:number){
  const phase=time*2+slot*Math.PI*2/3,a=phase+k.heading;
  return {x:k.x+Math.sin(a)*2,y:k.y+1.05+Math.cos(phase*2)*.12,z:k.z+Math.cos(a)*2};
}
export type Point3={x:number;y:number;z:number};
/** Relative swept spheres, including the target's movement during the step. */
export function contactTime(a:Point3,b:Point3,c:Point3,d:Point3,radius:number){
  const x=a.x-c.x,y=a.y-c.y,z=a.z-c.z,dx=b.x-a.x-d.x+c.x,dy=b.y-a.y-d.y+c.y,dz=b.z-a.z-d.z+c.z;
  const q=x*x+y*y+z*z-radius*radius;if(q<=0)return 0;
  const v=dx*dx+dy*dy+dz*dz,h=x*dx+y*dy+z*dz,disc=h*h-v*q;
  if(v<1e-12||disc<0)return Infinity;
  const t=(-h-Math.sqrt(disc))/v;return t>=0&&t<=1?clamp(t,0,1):Infinity;
}
export function spendCoco(r:Racer,slot:number){
  r.orbitMask=orbitMask(r);if(!(r.orbitMask&(1<<slot)))return false;
  r.orbitMask&=~(1<<slot);r.charges=chargeCount(r.orbitMask);if(!r.charges)r.item=null;
  r.itemFeedback=.5;r.actionFlash=.3;return true;
}
