import {clamp} from './math';

export function tiltAngle(beta:number,gamma:number,orientation:number){
  const a=orientation*Math.PI/180;
  return gamma*Math.cos(a)+beta*Math.sin(a);
}
export function tiltTarget(raw:number,center:number,deadZone:number,sensitivity:number){
  const delta=((raw-center+540)%360+360)%360-180;
  if(Math.abs(delta)<=deadZone)return 0;
  return clamp(Math.sign(delta)*Math.max(0,Math.abs(delta)-deadZone)/25*sensitivity,-1,1);
}
// Time based response keeps the same feel at 30, 60 and 120 Hz.
export function smoothTilt(current:number,target:number,seconds:number,response:number){
  return current+(target-current)*(1-Math.exp(-Math.max(0,seconds)/response));
}
