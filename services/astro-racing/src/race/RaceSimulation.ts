import { DEFAULT_GARAGE, botGarage, DRIVERS, type GarageSelection } from '../content/garage';
import type { DriveInput } from '../core/Input';
import { neutralInput } from '../core/Input';
import { RACERS, type Difficulty } from '../content/racers';
import type { TrackDefinition } from '../tracks/TrackDefinition';
import { BotDriver } from '../ai/BotDriver';
import { Racer } from './Racer';
import type { KartEvent } from '../vehicle/KartPhysics';
import { ItemSystem } from '../items/ItemSystem';
import {guideRocket} from '../items/RocketGuidance';
import { TrackMechanics } from '../tracks/TrackMechanics';

export interface RaceEvent { type:string; racer:number; value?:number }
export class RaceSimulation {
  readonly racers:Racer[];
  readonly bots:BotDriver[];
  readonly rocketDrivers:BotDriver[];
  elapsed=0;
  countdown=3;
  status:'grid'|'racing'|'finished'='grid';
  events:RaceEvent[]=[];
  finishOrder:number[]=[];
  readonly items:ItemSystem;
  readonly mechanics:TrackMechanics;
  constructor(readonly track:TrackDefinition,public difficulty:Difficulty='normal',selection:GarageSelection=DEFAULT_GARAGE){
    this.racers=RACERS.map((livery,id)=>new Racer(id,{...livery},track));
    this.configure(selection);
    this.bots=this.racers.map(r=>new BotDriver(r.id,track,difficulty));this.rocketDrivers=this.racers.map(r=>new BotDriver(0,track,'hard'));this.items=new ItemSystem(track);this.mechanics=new TrackMechanics(track);this.reset(difficulty);
  }
  configure(selection:GarageSelection){const opponents=(Object.keys(DRIVERS) as GarageSelection['driver'][]).filter(id=>id!==selection.driver);for(const r of this.racers)r.configure(r.id===0?selection:{...botGarage(r.id),driver:opponents[r.id-1]});}
  localPlayerId=0;
  get player(){return this.racers[this.localPlayerId];}
  reset(difficulty=this.difficulty){
    this.difficulty=difficulty;this.elapsed=0;this.countdown=3;this.status='grid';this.events=[];this.finishOrder=[];
    this.items.reset();this.mechanics.reset();
    for(const r of this.racers){const row=Math.floor(r.id/2);r.grid(this.track.length-6-row*4.5,r.id%2?2.2:-2.2);this.bots[r.id].difficulty=difficulty;this.bots[r.id].reset();this.rocketDrivers[r.id].reset();}
    this.rank();
  }
  recover(id=0){const r=this.racers[id];if(r.progress.finished)return;r.recover();this.events.push({type:'recover',racer:id});}
  step(playerInput:DriveInput,dt:number,automatePlayer=false,humanInputs?:Map<number,DriveInput>){
    this.events=[];
    if(this.status==='finished'){this.items.update(this.racers,dt,this.events);this.autopilot(dt);return;}
    if(this.status==='grid'){
      const previous=Math.ceil(this.countdown);this.countdown=Math.max(0,this.countdown-dt);
      if(Math.ceil(this.countdown)!==previous)this.events.push({type:this.countdown===0?'go':'tick',racer:0});
      if(this.countdown<=0)this.status='racing';return;
    }
    this.elapsed+=dt;
    this.mechanics.updateHazard(this.elapsed);
    for(const r of this.racers){
      if(r.progress.finished)continue;
      r.itemFeedback=Math.max(0,r.itemFeedback-dt);r.shieldFlash=Math.max(0,r.shieldFlash-dt);r.actionFlash=Math.max(0,r.actionFlash-dt);
      if(r.shield>0&&r.shield<=dt)this.events.push({type:'shield-end',racer:r.id});
      if(r.state.boost>0&&r.state.boost<=dt)this.events.push({type:'boost-end',racer:r.id});
      r.protection=Math.max(0,r.protection-dt);r.shield=Math.max(0,r.shield-dt);r.stun=Math.max(0,r.stun-dt);r.hitFlash=Math.max(0,r.hitFlash-dt);
      const controlledByBot=humanInputs?!humanInputs.has(r.id):r.id!==0||automatePlayer;
      let controls=controlledByBot?this.bots[r.id].update(r,this.racers,this.elapsed,dt,[...(this.track.hazard?[this.mechanics.hazard]:[]),...this.mechanics.dynamicHazards.filter(h=>h.active||h.warning),...this.items.traps]):humanInputs?.get(r.id)??playerInput;
      if(r.steeringRearm){
        if(controlledByBot||Math.abs(controls.steer)<.15&&!controls.drift)r.steeringRearm=false;
        else controls={...controls,throttle:0,brake:0,steer:0,drift:false,trick:false};
      }
      if(r.stun>0)controls={...controls,throttle:.15,steer:controls.steer*.35,drift:false};
      const botReaction=this.difficulty==='easy'?2.4:this.difficulty==='normal'?1.2:.6;
      if(controls.item&&!controlledByBot){r.itemRequest=.35;if(!r.item)this.events.push({type:'item-empty',racer:r.id});else if(r.state.rescueTime>0||r.state.falling)this.events.push({type:'item-unavailable',racer:r.id});}
      if(controlledByBot?this.items.botShouldUse(r,this.racers,botReaction):r.itemRequest>0){if(this.items.use(r,this.racers,this.events))r.itemRequest=0;}r.itemRequest=Math.max(0,r.itemRequest-dt);
      if(r.rocket>0){r.physics.events=[];if(guideRocket(r,this.track,dt)){this.events.push({type:'rocket-end',racer:r.id});this.bots[r.id].reset();}}
      else r.physics.step(controls,dt);
      for(const e of r.physics.events)this.events.push({...e,racer:r.id});
      if(r.physics.events.some(e=>e.type==='recover'))r.recover();
      if(r.physics.events.some(e=>e.type==='land'||e.type==='trick-land'))r.actionFlash=.35;
    }
    for(const comet of this.racers){if(comet.rocket<=0)continue;const a=comet.physics.previous,b=comet.state,dx=b.x-a.x,dz=b.z-a.z;
      for(const r of this.racers){if(r===comet||r.progress.finished||r.state.rescueTime>0||r.protection>0||r.rocket>0||comet.rocketHits.has(r.id))continue;const u=Math.max(0,Math.min(1,((r.state.x-a.x)*dx+(r.state.z-a.z)*dz)/(dx*dx+dz*dz||1)));
        if(Math.hypot(r.state.x-a.x-dx*u,r.state.z-a.z-dz*u)<3&&Math.abs(r.state.y-b.y)<3){comet.rocketHits.add(r.id);this.items.hit(r,this.events,'rocket');this.events.push({type:'rocket-impact',racer:comet.id});}}
    }
    this.collisions();
    this.mechanics.step(this.racers,this.elapsed,dt,this.items,this.events);
    this.items.update(this.racers,dt,this.events);
    for(const r of this.racers){
      if(r.progress.finished)continue;
      // Contact resolution can move a kart onto a connected branch after physics
      // has projected its position. Use the final supporting deck consistently.
      const surface=this.track.surface(r.state.x,r.state.z,r.state.route,r.state.progress);
      r.state.progress=surface.s;r.state.route=surface.route??r.state.route;
      const event=r.progress.update(r.state,this.elapsed,dt,surface);
      if(event){this.events.push({type:event,racer:r.id});if(event==='finish'){this.finishOrder.push(r.id);r.item=null;r.charges=0;r.rocket=0;r.shield=0;r.stun=0;r.hitFlash=0;this.bots[r.id].reset();}}
    }
    this.finishOrder.sort((a,b)=>this.racers[a].progress.finishTime-this.racers[b].progress.finishTime||a-b);
    this.rank();
    if(this.finishOrder.length===this.racers.length)this.status='finished';
    this.autopilot(dt);
  }
  private autopilot(dt:number){
    for(const r of this.racers){if(!r.progress.finished)continue;
      r.protection=0;
      const controls=this.bots[r.id].update(r,[],this.elapsed,dt);
      r.physics.step({...controls,item:false,trick:false,drift:false},dt);
      if(r.physics.events.some(e=>e.type==='recover')){r.physics.reset(r.progress.safeS,r.progress.safeRoute);}
    }
  }
  private collisions(){
    for(let i=0;i<this.racers.length;i++)for(let j=i+1;j<this.racers.length;j++){
      const a=this.racers[i],b=this.racers[j];if(a.rocket>0||b.rocket>0||a.progress.finished||b.progress.finished||a.state.rescueTime>0||b.state.rescueTime>0||Math.abs(a.state.y-b.state.y)>1.7)continue;
      const dx=b.state.x-a.state.x,dz=b.state.z-a.state.z,d=Math.hypot(dx,dz),minimum=1.9;if(d>=minimum)continue;
      const nx=d>.001?dx/d:1,nz=d>.001?dz/d:0,push=(minimum-d)*.5;
      a.state.x-=nx*push;a.state.z-=nz*push;b.state.x+=nx*push;b.state.z+=nz*push;
      const closing=(a.state.vx-b.state.vx)*nx+(a.state.vz-b.state.vz)*nz;
      if(closing>0){const impulse=closing*.57;a.state.vx-=nx*impulse;a.state.vz-=nz*impulse;b.state.vx+=nx*impulse;b.state.vz+=nz*impulse;
        if(closing>3)this.events.push({type:'bump',racer:a.id===0?0:b.id,value:closing});}
    }
  }
  private rank(){
    const sorted=[...this.racers].sort((a,b)=>{
      if(a.progress.finished||b.progress.finished){if(a.progress.finished&&b.progress.finished)return a.progress.finishTime-b.progress.finishTime||a.id-b.id;return a.progress.finished?-1:1;}
      return b.progress.score-a.progress.score||a.id-b.id;
    });sorted.forEach((r,i)=>r.position=i+1);
  }
}
