import {authoredCourse,encounterState} from './destinations/encounters';
import type { TrackDefinition } from './TrackDefinition';
import type { Racer } from '../race/Racer';
import type { RaceEvent } from '../race/RaceSimulation';
import type { ItemSystem } from '../items/ItemSystem';
export class TrackMechanics {
  hazard={x:0,y:0,z:0,radius:0,lateral:0};
  dynamicHazards:{id:string;kind:string;x:number;y:number;z:number;radius:number;active:boolean;warning:boolean;lift:number;lateral:number;blocker?:boolean}[]=[];
  private cooldown=new Map<string,number>();
  stats={pads:0,hazards:0,tricks:0};
  constructor(readonly track:TrackDefinition){}
  reset(){this.cooldown.clear();this.stats={pads:0,hazards:0,tricks:0};this.updateHazard(0);}
  updateHazard(elapsed:number){const h=this.track.hazard;if(h){const p=this.track.at(h.s),lateral=Math.sin(elapsed*Math.PI*2/h.period)*h.amplitude;this.hazard={y:(p.y??0)+Math.tan(p.bank??0)*lateral,x:p.x+p.nx*lateral,z:p.z+p.nz*lateral,radius:h.radius,lateral};}
    this.dynamicHazards=(this.track.hazards??[]).map(h=>{
      if(authoredCourse(this.track.id))return encounterState(h,elapsed,this.track);
      const phase=((elapsed+h.phase)%h.period)/h.period,a=phase*Math.PI*2,p=this.track.at(h.s,h.route),lateral=h.lane+Math.sin(a)*h.amplitude;
      if(['trap','napalm','bomb','lava','log','rockfall','ghost','icefall','tide','crab','traffic','construction','fountain','syrup','current','jellyfish','toytrain','marble'].includes(h.kind)){
        const active=phase>=.34&&phase<(h.kind==='napalm'?.76:.59),warning=phase>=.12&&phase<.34;
        return {id:h.id,kind:h.kind,x:p.x+p.nx*lateral,z:p.z+p.nz*lateral,y:(p.y??0)+Math.tan(p.bank??0)*lateral,radius:h.radius,active,warning,lift:active?0:8,lateral};
      }
      const lift=h.kind==='press'||h.kind==='door'?phase<.25?0:phase<.4?(phase-.25)/.15*8:phase<.8?8:(1-phase)/.2*8:h.kind==='meteor'?Math.max(0,Math.sin(a))*24:h.kind==='chandelier'?Math.abs(Math.sin(a))*6:0;
      const active=lift<2.4;return {id:h.id,kind:h.kind,x:p.x+p.nx*lateral,z:p.z+p.nz*lateral,y:(p.y??0)+Math.tan(p.bank??0)*lateral+lift,radius:h.radius,active,warning:!active&&(lift<6||phase>.7),lift,lateral};
    });
    if(authoredCourse(this.track.id))for(const h of [...this.dynamicHazards])if(h.kind==='toytrain'||h.kind==='tractor'){
      const def=this.track.hazards!.find(d=>d.id===h.id)!,p=this.track.at(def.s,def.route);
      for(const offset of h.kind==='toytrain'?[5,10]:[6])this.dynamicHazards.push({...h,id:h.id+' trailer '+offset,kind:'carriage',x:h.x+p.nx*offset,z:h.z+p.nz*offset,blocker:true});
    }
  }
  step(racers:Racer[],elapsed:number,dt:number,items:ItemSystem,events:RaceEvent[]){
    this.updateHazard(elapsed);for(const [key,value]of this.cooldown)this.cooldown.set(key,Math.max(0,value-dt));
    for(const racer of racers){if(racer.progress.finished)continue;const k=racer.state;
      if(k.rescueTime>0||k.falling)continue;
      for(const belt of this.track.conveyors??[]){const p=this.track.at(belt.s),dx=k.x-p.x,dz=k.z-p.z;if(k.grounded&&k.route==='main'&&Math.abs(dx*p.tx+dz*p.tz)<belt.length/2&&Math.abs(dx*p.nx+dz*p.nz-belt.lane)<belt.width/2){k.vx+=p.tx*belt.force*dt;k.vz+=p.tz*belt.force*dt;const speed=Math.hypot(k.vx,k.vz),scale=Math.min(1,47/speed);k.vx*=scale;k.vz*=scale;k.speed=Math.hypot(k.vx,k.vz);}}
      for(const pad of this.track.boostPads??[]){
        const p=this.track.at(pad.s,pad.route),dx=k.x-(p.x+p.nx*pad.lane),dz=k.z-(p.z+p.nz*pad.lane),key=`${racer.id}/${pad.id}`;
        if(!racer.steeringRearm&&k.route===pad.route&&k.grounded&&Math.abs(dx*p.tx+dz*p.tz)<pad.length*.5&&Math.abs(dx*p.nx+dz*p.nz)<pad.width*.5+.5&&(this.cooldown.get(key)??0)<=0){
          racer.physics.grantBoost(pad.duration,4);racer.actionFlash=.5;this.cooldown.set(key,2.3);this.stats.pads++;events.push({type:'pad',racer:racer.id});
        }
      }
      if(this.track.hazard&&Math.abs(k.y-this.hazard.y)<1.8&&Math.hypot(k.x-this.hazard.x,k.z-this.hazard.z)<this.hazard.radius+.85){const result=items.hit(racer,events,'hazard');if(result==='hit'){this.stats.hazards++;events.push({type:'hazard-contact',racer:racer.id});}}
      for(const h of this.dynamicHazards)if(h.active&&Math.abs(k.y-h.y)<2.4&&Math.hypot(k.x-h.x,k.z-h.z)<h.radius+.85){
        const def=this.track.hazards?.find(d=>d.id===h.id),p=def?this.track.at(def.s,def.route):this.track.at(k.progress,k.route);
        if(authoredCourse(this.track.id)&&['current','syrup','fountain'].includes(h.kind)&&!(this.track.id==='candy'&&h.kind==='fountain')){
          if(h.kind==='current'){const force=Math.sin(elapsed*.65)*19;k.vx+=p.nx*force*dt;k.vz+=p.nz*force*dt;}
          else {const factor=Math.exp(-dt*(h.kind==='syrup'?1.2:.8));k.vx*=factor;k.vz*=factor;k.speed*=factor;}
          const key=racer.id+'/'+h.id;if((this.cooldown.get(key)??0)<=0){events.push({type:'surface-contact',racer:racer.id});this.cooldown.set(key,1);}continue;
        }
        if(h.blocker&&racer.rocket<=0){
          const dx=k.x-h.x,dz=k.z-h.z,d=Math.hypot(dx,dz)||1,push=Math.min(.2,h.radius+.85-d);
          k.x+=dx/d*push;k.z+=dz/d*push;
          const normal=k.vx*dx/d+k.vz*dz/d;if(normal<0){k.vx-=normal*dx/d;k.vz-=normal*dz/d;}k.speed=Math.hypot(k.vx,k.vz);
          const key=racer.id+'/'+h.id;if((this.cooldown.get(key)??0)<=0){events.push({type:'blocker-contact',racer:racer.id});this.stats.hazards++;this.cooldown.set(key,1);}continue;
        }
        const result=items.hit(racer,events,h.id);if(result==='hit'){this.stats.hazards++;events.push({type:'hazard-contact',racer:racer.id});}
      }
    }
    this.stats.tricks+=events.filter(e=>e.type==='trick-land').length;
  }
}
