import type { Racer } from '../race/Racer';
import type { TrackDefinition } from '../tracks/TrackDefinition';
import { DIFFICULTIES, type Difficulty } from '../content/racers';
import { angleDelta, clamp, damp, mod } from '../core/math';
import { neutralInput, type DriveInput } from '../core/Input';
import { routeAim } from './routeAim';

export class BotDriver {
  private decision=0;
  private stuck=0;
  private previousS=0;
  private lane=0;
  private controls=neutralInput();
  plannedRoute='main';
  passingDecisions=0;
  driftBoosts=0;
  private driftRest=0;
  constructor(readonly id:number,readonly track:TrackDefinition,public difficulty:Difficulty='normal'){}
  reset(){this.decision=0;this.stuck=0;this.previousS=0;this.lane=0;this.controls=neutralInput();this.passingDecisions=0;this.plannedRoute='main';this.driftBoosts=0;this.driftRest=0;}
  update(racer:Racer,others:Racer[],elapsed:number,dt:number,dangers:{x:number;z:number;radius:number;y?:number}[]=[]):DriveInput {
    const k=racer.state,preset=DIFFICULTIES[this.difficulty],surface=this.track.surface(k.x,k.z,k.route,k.progress);
    this.driftRest=Math.max(0,this.driftRest-dt);
    const previousRoute=this.plannedRoute;this.plannedRoute='main';
    for(const branch of this.track.routes??[]){
      // Lagoon's tight entrance costs more braking time than its 11% distance saving.
      const loftAttempt=this.track.id==='barnyard'&&branch.id==='loft'&&this.difficulty==='hard'&&(this.id+racer.progress.completedLaps*3)%6===2;
      const routeValue=this.difficulty==='hard'?(this.track.id==='classic'?.82:['factory','orbital','moonbell','sunspun-tour'].includes(this.track.id??'')?1.04:.94):1.04;
      const worthwhile=branch.length<(branch.end-branch.start)*routeValue;const choose=loftAttempt||worthwhile&&(this.difficulty==='hard'?(this.id+racer.progress.completedLaps)%4!==0:this.difficulty==='normal'&&this.id%2===1);
      // Commit at the entrance. Losing a branch must not leave a stale plan
      // aiming through a wall halfway along the main road after a rocket/rescue.
      const technical=this.track.theme==='volcano'||this.track.theme==='vietnam'||this.track.theme==='glacier';
      if(k.route===branch.id||choose&&surface.s>branch.start-45&&surface.s<branch.start+(previousRoute===branch.id?95:25)){this.plannedRoute=branch.id;break;}
    }
    const moved=Math.abs(mod(k.progress-this.previousS+this.track.length/2,this.track.length)-this.track.length/2);
    this.previousS=k.progress;
    this.stuck=elapsed>2&&!k.falling&&k.grounded&&(Math.abs(k.speed)<3||moved<dt*.7||racer.progress.wrongWay||racer.progress.invalid)?this.stuck+dt:Math.max(0,this.stuck-dt*2);
    if(this.stuck>preset.recovery){racer.recover();this.stuck=0;}
    this.decision-=dt;if(this.decision>0)return {...this.controls,trick:k.airKind==='ramp'&&k.airTime>.22&&k.airTime<.42&&k.trick==='none'};this.decision=preset.reaction;
    let desiredLane=Math.sin(this.id*2.6)*(this.difficulty==='hard'?.8:1.8);
    let trafficBrake=0;
    const chosenBranch=this.track.routes?.find(r=>r.id===this.plannedRoute),routeScale=chosenBranch?(chosenBranch.end-chosenBranch.start)/chosenBranch.length:1;
    const look=(chosenBranch?5+Math.abs(k.speed)*(this.difficulty==='hard'?.28:.20):6+Math.abs(k.speed)*(this.difficulty==='hard'?(this.track.id==='classic'?.50:.42):.32))*routeScale;
    const aimS=chosenBranch?routeAim(chosenBranch,k.x,k.z,surface.s):surface.s;
    const ahead=this.track.at(aimS+look,this.plannedRoute);
    // Actively collect road boosts; the old fixed lane missed most of them.
    if(this.difficulty!=='easy'){
      const pad=this.track.boostPads?.find(p=>p.route===this.plannedRoute&&mod(p.s-surface.s,this.track.length)<(this.difficulty==='hard'?48:34));
      if(pad)desiredLane=pad.lane;
    }
    for(const other of others){
      if(other.id===racer.id||other.progress.finished)continue;
      const dx=other.state.x-k.x,dz=other.state.z-k.z;
      const forward=dx*surface.tx+dz*surface.tz,lateral=dx*surface.nx+dz*surface.nz;
      if(forward>0&&forward<18&&Math.abs(lateral)<3){
        const side=surface.lateral<0?-1:1;desiredLane=side*2.8;this.passingDecisions++;
        if(forward<5&&Math.abs(lateral)<1.8)trafficBrake=.45;
      }
    }
    const revised=['rally','candy','toybox','dc','nyc','vegas','barnyard','atlantis'].includes(this.track.id??'');
    const obstacles=[...this.track.obstacles,...dangers];let obstacleAhead=false;
    const avoidanceLook=this.difficulty==='hard'?Math.max(26,Math.abs(k.speed)*1.05):revised&&this.difficulty==='normal'?Math.max(32,Math.abs(k.speed)*1.1):21;
    // Resolve distant choices first so a nearby blocker owns the immediate line.
    // The former array order could steer around the second planter into the first.
    if(revised)obstacles.sort((a,b)=>(b.x-a.x)*surface.tx+(b.z-a.z)*surface.tz);
    for(const obstacle of obstacles){
      if('y' in obstacle&&typeof obstacle.y==='number'&&Math.abs(obstacle.y-k.y)>5)continue;
      const dx=obstacle.x-k.x,dz=obstacle.z-k.z;
      const forward=dx*surface.tx+dz*surface.tz;
      // Keep the avoidance line until the rear of the kart clears the blocker.
      // Returning to the racing line at its centre trapped bots against chicanes.
      if(forward>-obstacle.radius-2&&forward<avoidanceLook){const obstacleLane=surface.lateral+dx*surface.nx+dz*surface.nz;if(Math.abs(obstacleLane)<(surface.halfWidth??this.track.halfWidth)+obstacle.radius)obstacleAhead=true;if(Math.abs(desiredLane-obstacleLane)<obstacle.radius+1.5)desiredLane=obstacleLane>0?-Math.min(4.6,obstacle.radius+1.8):Math.min(4.6,obstacle.radius+1.8);}
    }
    // Narrow branches normally use the centre, but timed gates still need the
    // available passing space. A fixed 1.3 m cap pinned rivals against them.
    const branch=this.track.routes?.find(r=>r.id===this.plannedRoute),laneLimit=branch?(revised&&obstacleAhead?Math.min(4.8,branch.halfWidth-1.8):1.3):Math.min(4.8,(surface.halfWidth??this.track.halfWidth)-3);
    this.lane=damp(this.lane,clamp(desiredLane,-laneLimit,laneLimit),this.difficulty==='hard'||revised&&this.difficulty==='normal'&&obstacleAhead?5.5:2.8,preset.reaction);
    const targetX=ahead.x+ahead.nx*this.lane,targetZ=ahead.z+ahead.nz*this.lane;
    const error=angleDelta(k.heading,Math.atan2(targetX-k.x,targetZ-k.z));
    const later=this.track.at(aimS+37*routeScale,this.plannedRoute),current=this.track.at(aimS,this.plannedRoute);
    const curvature=Math.abs(angleDelta(Math.atan2(current.tx,current.tz),Math.atan2(later.tx,later.tz)));
    const technical=this.track.theme==='volcano'||this.track.theme==='vietnam'||this.track.theme==='glacier';
    const bendSpeed=branch?(this.difficulty==='hard'?Math.min(preset.corner,curvature>1.05?19:curvature>.75?24:curvature>.45?29:36):Math.min(preset.corner,23,curvature>.85?14:curvature>.5?20:25)):curvature>1.05?preset.corner-(technical?11:4):curvature>.78?preset.corner:Math.min(preset.pace,racer.physics.setup.topSpeed+1);
    let targetSpeed=(racer.progress.finished?24:bendSpeed)+(k.boost>0&&!(technical&&branch)&&curvature<(this.difficulty==='hard'?(this.track.id==='classic'?2:.85):.7)?12:0)-(this.id%3)*.15;
    if(Math.abs(error)>.55)targetSpeed=Math.min(targetSpeed,Math.abs(error)>.9?17:23);
    if(revised&&obstacleAhead)targetSpeed=Math.min(targetSpeed,this.difficulty==='hard'?(Math.abs(error)>.32?26:Math.abs(surface.lateral-this.lane)>2?30:37):25);
    const speed=Math.abs(k.speed);
    const steering=clamp(-error*2.8+Math.sin(elapsed*.85+this.id*3)*preset.error,-1,1);
    const clearRoad=!(revised&&obstacleAhead)&&!chosenBranch&&k.route==='main'&&!surface.ramp&&Math.abs(surface.slope??0)<.13&&!k.offroad&&Math.abs(surface.lateral)<(surface.halfWidth??this.track.halfWidth)-3;
    let drift=this.difficulty!=='easy'&&!racer.progress.finished&&racer.rocket<=0&&clearRoad&&speed>20&&this.driftRest<=0&&curvature>.06&&curvature<(technical?.5:this.difficulty==='hard'?(this.track.id==='classic'?1.35:1.05):.72)&&Math.abs(steering)>.12;
    if(k.drifting){drift=clearRoad&&k.charge<(this.difficulty==='hard'?.82:.88)&&Math.abs(error)<.7;if(!drift){this.driftRest=this.difficulty==='hard'?(this.track.id==='classic'?.1:.15):.55;if(k.charge>=.8)this.driftBoosts++;}}
    this.controls={throttle:speed<targetSpeed?1:0,brake:speed>targetSpeed+1?(branch||Math.abs(error)>.55?.8:.45):trafficBrake,
      steer:k.drifting?clamp((steering-k.driftSign*.4)/.85,-1,1):drift?Math.sign(steering)*Math.max(.22,Math.abs(steering)):steering,drift,trick:k.airKind==='ramp'&&k.airTime>.08&&k.airTime<.3&&k.trick==='none'};
    return this.controls;
  }
}
