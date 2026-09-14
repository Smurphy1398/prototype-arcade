import { TUNING } from '../content/tuning';
export class FixedStep {
  private accumulator=0;
  reset(){this.accumulator=0;}
  advance(frameSeconds:number,step:(dt:number)=>void){
    this.accumulator+=Math.min(Math.max(frameSeconds,0),.1);
    let steps=0;
    while(this.accumulator+1e-10>=TUNING.fixedDt&&steps<TUNING.maxCatchup){
      step(TUNING.fixedDt);this.accumulator=Math.max(0,this.accumulator-TUNING.fixedDt);steps++;
    }
    if(steps===TUNING.maxCatchup)this.accumulator=0;
    return this.accumulator/TUNING.fixedDt;
  }
}
