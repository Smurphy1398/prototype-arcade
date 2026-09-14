import { mod } from '../core/math';
/** A practice lap counter only. Full race rules and standings belong to milestone 2. */
export class PracticeSession {
  elapsed=0;
  lapTime=0;
  laps=0;
  lastLap=0;
  best=0;
  nextGate=1;
  wrongWay=false;
  private previous=0;
  private backwardsTime=0;
  readonly gateCount=20;
  constructor(readonly length:number){try{this.best=Number(localStorage.getItem('astro-coast-best-v1'))||0;}catch{/* storage may be disabled */}}
  reset(s=4){this.elapsed=0;this.lapTime=0;this.laps=0;this.lastLap=0;this.nextGate=1;this.previous=s;this.backwardsTime=0;this.wrongWay=false;}
  recovered(s:number){this.previous=s;}
  update(s:number,speed:number,dt:number):boolean {
    this.elapsed+=dt;this.lapTime+=dt;
    const delta=mod(s-this.previous+this.length/2,this.length)-this.length/2;
    this.backwardsTime=delta<-.02&&Math.abs(speed)>3?this.backwardsTime+dt:Math.max(0,this.backwardsTime-dt*2);
    this.wrongWay=this.backwardsTime>1;
    let completed=false;
    if(delta>0&&delta<8){
      const target=(this.nextGate%this.gateCount)*this.length/this.gateCount;
      const distance=mod(target-this.previous,this.length);
      if(distance<=delta+.0001){
        this.nextGate++;
        if(this.nextGate>this.gateCount){
          this.laps++;this.lastLap=this.lapTime;this.lapTime=0;this.nextGate=1;completed=true;
          if(!this.best||this.lastLap<this.best){this.best=this.lastLap;try{localStorage.setItem('astro-coast-best-v1',String(this.best));}catch{}}
        }
      }
    }
    this.previous=s;return completed;
  }
}
