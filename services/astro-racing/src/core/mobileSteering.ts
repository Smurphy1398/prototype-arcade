import {clamp} from './math';

export function tiltAngle(beta:number,gamma:number,orientation:number){
  // W3C Z-X'-Y'' angles -> gravity along the screen's right axis.
  // Raw beta flips representation around an upright grip; gravity does not.
  const b=beta*Math.PI/180,g=gamma*Math.PI/180,a=orientation*Math.PI/180;
  return Math.asin(clamp(Math.cos(b)*Math.sin(g)*Math.cos(a)-Math.sin(b)*Math.sin(a),-1,1))*180/Math.PI;
}
export class TiltCalibration {
  private samples:number[]=[];
  private started=0;
  private last=-Infinity;
  private raw=0;
  private center:number|null=null;
  reset(){this.samples=[];this.center=null;this.last=-Infinity;}
  ready(now:number){return this.center!==null&&now-this.last<=500;}
  sample(beta:number|null,gamma:number|null,angle:number,now:number){
    if(beta===null||gamma===null||!Number.isFinite(beta)||!Number.isFinite(gamma)||!Number.isFinite(angle)||Math.abs(beta)>180||Math.abs(gamma)>90){this.reset();return false;}
    if(now-this.last>500)this.reset();
    this.last=now;this.raw=tiltAngle(beta,gamma,angle);
    if(this.center===null){
      if(!this.samples.length)this.started=now;
      this.samples.push(this.raw);
      if(Math.max(...this.samples)-Math.min(...this.samples)>2){this.samples=[this.raw];this.started=now;}
      if(this.samples.length>=5&&now-this.started>=200){this.center=this.samples.reduce((a,b)=>a+b,0)/this.samples.length;this.samples=[];}
    }
    return this.ready(now);
  }
  target(now:number,deadZone:number,sensitivity:number){return this.ready(now)?tiltTarget(this.raw,this.center!,deadZone,sensitivity):0;}
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
