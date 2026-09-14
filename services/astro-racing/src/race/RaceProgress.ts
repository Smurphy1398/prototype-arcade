import { mod, clamp } from '../core/math';
import type { KartState } from '../vehicle/KartPhysics';
import type { TrackDefinition, Surface } from '../tracks/TrackDefinition';

/** Ordered directed gates, plus bounded progress inside the current valid segment.
 * Recovery never grants distance; the grid-to-line approach is not a lap. */
export class RaceProgress {
  readonly gates=32;
  started=false;
  completedLaps=0;
  nextGate=0;
  finished=false;
  finishTime=0;
  lastLap=0;
  lapStart=0;
  safeS=0;
  safeRoute='main';
  wrongWay=false;
  invalid=false;
  private previousS=0;
  private previousX=0;
  private previousZ=0;
  private backwardTime=0;
  private scoreValue=0;
  private lastGateAbsolute=0;
  private previousRoute='main';
  constructor(readonly track:TrackDefinition,readonly totalLaps=3){}
  reset(k:KartState){
    this.started=false;this.completedLaps=0;this.nextGate=0;this.finished=false;this.finishTime=0;this.lastLap=0;this.lapStart=0;
    this.safeS=k.progress;this.safeRoute='main';this.wrongWay=false;this.invalid=false;this.backwardTime=0;this.lastGateAbsolute=0;
    this.previousS=k.progress;this.previousX=k.x;this.previousZ=k.z;this.scoreValue=k.progress-this.track.length;
    this.previousRoute=k.route;
  }
  rebase(k:KartState){this.previousS=k.progress;this.previousX=k.x;this.previousZ=k.z;this.previousRoute=k.route;this.backwardTime=0;this.wrongWay=false;this.invalid=false;}
  recoveryAnchor(){
    // Keep earned gates, but never respawn beyond the next unearned gate.
    const spacing=this.track.length/this.gates,last=mod(this.lastGateAbsolute,this.track.length);
    const ahead=mod(this.safeS-last,this.track.length);
    if(this.started&&ahead>=spacing&&ahead<this.track.length-spacing*2){
      let s=last;
      for(let i=0;i<spacing*2;i+=1){const p=this.track.at(s),q=this.track.surface(p.x,p.z,'main',s);if(q.supported!==false&&q.rescueSafe!==false)break;s=mod(s-1,this.track.length);}
      this.safeS=s;this.safeRoute='main';
    }
    return {s:this.safeS,route:this.safeRoute};
  }
  update(k:KartState,elapsed:number,dt:number,surface:Surface):'start'|'lap'|'finish'|undefined {
    if(this.finished)return;
    const length=this.track.length,spacing=length/this.gates;
    const ds=mod(k.progress-this.previousS+length/2,length)-length/2;
    const displacement=Math.hypot(k.x-this.previousX,k.z-this.previousZ);
    const routeChange=this.previousRoute!==k.route;
    const branch=this.track.routes?.find(r=>r.id===(k.route==='main'?this.previousRoute:k.route));
    // A connected fork changes coordinate systems (main arc / branch arc).
    // Validate the physical motion and selected surface separately from that
    // bounded projection shift. Ordered gates still require a real crossing.
    const junction=routeChange&&!!branch&&[k.progress,this.previousS].every(s=>s>=branch.start-110&&s<=branch.end+110);
    const projectionMatches=Math.abs(mod(surface.s-k.progress+length/2,length)-length/2)<8;
    const plausible=displacement<=Math.max(2.5,dt*80)&&Math.abs(ds)<=Math.max(junction?110:32,dt*110)&&projectionMatches;
    const valid=surface.valid!==false&&surface.distance<(surface.barrier??this.track.barrier)+1&&!k.falling&&k.y>=surface.height-2;
    this.backwardTime=ds<-.018&&Math.abs(k.speed)>3?this.backwardTime+dt:Math.max(0,this.backwardTime-dt*2);
    this.wrongWay=this.backwardTime>.8;
    let event:'start'|'lap'|'finish'|undefined;
    if(!plausible||!valid)this.invalid=true;
    const target=(this.nextGate%this.gates)*spacing;
    const toGate=mod(target-this.previousS,length);
    if(plausible&&valid&&ds>0&&toGate<=ds+1e-5){
      const crossing=elapsed-dt+dt*clamp(toGate/ds,0,1);
      this.invalid=false;
      if(!this.started){this.started=true;this.lapStart=crossing;this.nextGate=1;this.lastGateAbsolute=0;event='start';}
      else {
        this.lastGateAbsolute=this.completedLaps*length+target;
        if(this.nextGate===this.gates){
          this.completedLaps++;this.lastLap=crossing-this.lapStart;this.lapStart=crossing;
          this.lastGateAbsolute=this.completedLaps*length;this.nextGate=1;event='lap';
          if(this.completedLaps===this.totalLaps){this.finished=true;this.finishTime=crossing;event='finish';}
        }else this.nextGate++;
      }
    }
    if(plausible&&valid){
      if(this.started){
        const lastS=mod(this.lastGateAbsolute,length),within=mod(k.progress-lastS,length);
        // An out-of-order cut cannot jump standings or a recovery anchor ahead.
        if(within<spacing){this.scoreValue=this.lastGateAbsolute+within;if(!this.invalid&&surface.rescueSafe!==false&&surface.supported!==false&&k.grounded){this.safeS=k.progress;this.safeRoute=surface.route??'main';}}
        else if(within>length-spacing){this.scoreValue=this.lastGateAbsolute-(length-within);}
        else this.invalid=true;
      }else {this.scoreValue=k.progress>length*.8?k.progress-length:0;}
    }
    if(this.finished)this.scoreValue=this.totalLaps*length;
    this.previousS=k.progress;this.previousX=k.x;this.previousZ=k.z;this.previousRoute=k.route;
    return event;
  }
  get score(){return this.scoreValue;}
  get lap(){return Math.min(this.totalLaps,this.completedLaps+1);}
}
