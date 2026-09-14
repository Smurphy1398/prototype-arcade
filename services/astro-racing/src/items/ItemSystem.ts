import {COCO_RADIUS,orbitMask,orbitPoint,spendCoco,contactTime} from './OrbitCoco';
import type { Racer } from '../race/Racer';
import type { TrackDefinition } from '../tracks/TrackDefinition';
import type { RaceEvent } from '../race/RaceSimulation';
import { angleDelta, clamp, random, mod } from '../core/math';
import type { ItemType } from './definitions';

export interface Projectile { id:number; owner:number; x:number; z:number; y:number; vx:number; vz:number; life:number; route:string;progress?:number; vy:number; age:number; kind:'coco'|'pineapple'|'seeker'|'ember';target?:number;bounces:number;distance:number;wallContact:string }
export interface Trap { id:number; owner:number; x:number; z:number; y:number; radius:number; life:number; age:number;vy:number;route:string;progress?:number }
export class ItemSystem {
  projectiles:Projectile[]=[];
  storms:{owner:number;targets:number[];time:number}[]=[];
  bursts:{x:number;y:number;z:number;life:number;blocked:boolean;radius?:number}[]=[];
  traps:Trap[]=[];
  pickupCooldowns=new Map<string,number>();
  stats={pickups:0,uses:{boost:0,bolt:0,triple:0,pineapple:0,trap:0,shield:0,rocket:0,seeker:0,tripleBoost:0,storm:0,ember:0},hits:0,blocks:0,ricochets:0,explosions:0};
  private rng=random(461);
  private serial=0;
  time=0;
  seed=461;
  cometAwards=0;
  lastCometAward=-Infinity;
  private cometRecipients=new Set<number>();
  private awardSerial=0;
  private heldAwards=new Map<number,number>();
  telemetry:{event:'award'|'use';eventId:number;awardId:number;seed:number;time:number;item:ItemType;racer:number;position:number;deficit:number;pickup:string;natural:boolean}[]=[];
  private eventSerial=0;
  private deficit(r:Racer,racers:Racer[]){return Math.max(0,...racers.map(other=>other.progress.score-r.progress.score));}
  canAwardComet(r:Racer,racers:Racer[]){return r.position>=7&&this.deficit(r,racers)>=140&&this.time>=25&&this.cometAwards<2&&this.time-this.lastCometAward>=60&&!this.cometRecipients.has(r.id)&&!racers.some(other=>other.rocket>0||other.item==='rocket');}
  private naturalAward(r:Racer,racers:Racer[],pickup:string){
    const pool=pickupPool(r.position);let item=pool[Math.floor(this.rng()*pool.length)];
    if(this.canAwardComet(r,racers)&&this.rng()<.025){item='rocket';this.cometAwards++;this.lastCometAward=this.time;this.cometRecipients.add(r.id);}
    const awardId=this.awardSerial++;this.heldAwards.set(r.id,awardId);
    this.telemetry.push({event:'award',eventId:this.eventSerial++,awardId,seed:this.seed,time:this.time,item,racer:r.id,position:r.position,deficit:this.deficit(r,racers),pickup,natural:true});return item;
  }

  constructor(readonly track:TrackDefinition){}
  reset(seed=this.seed){this.seed=seed;this.time=0;this.cometAwards=0;this.lastCometAward=-Infinity;this.cometRecipients.clear();this.heldAwards.clear();this.telemetry=[];this.eventSerial=0;this.awardSerial=0;this.storms=[];this.bursts=[];this.projectiles=[];this.traps=[];this.pickupCooldowns.clear();this.rng=random(this.seed);this.serial=0;this.stats={pickups:0,uses:{boost:0,bolt:0,triple:0,pineapple:0,trap:0,shield:0,rocket:0,seeker:0,tripleBoost:0,storm:0,ember:0},hits:0,blocks:0,ricochets:0,explosions:0};}
  use(racer:Racer,racers:Racer[],events:RaceEvent[]){
    const item=racer.item;if(!item||racer.progress.finished||racer.stun>0||racer.itemCooldown>0||racer.rocket>0||racer.state.falling||racer.state.rescueTime>0)return;
    if(item==='rocket'&&racers.some(r=>r!==racer&&r.rocket>0))return;
    if(item==='triple'){
      racer.orbitMask=orbitMask(racer);const slot=[0,1,2].find(i=>!!(racer.orbitMask&(1<<i)));
      if(slot===undefined||!spendCoco(racer,slot))return;
    }else racer.charges=['tripleBoost','ember'].includes(item)?(racer.charges||3)-1:0;
    if(racer.charges===0)racer.item=null;
    racer.itemCooldown=.2;racer.heldTime=0;racer.itemFeedback=1.1;racer.actionFlash=.45;this.stats.uses[item]++;
    const awardId=this.heldAwards.get(racer.id)??-1;
    const award=this.telemetry.find(e=>e.event==='award'&&e.awardId===awardId);
    this.telemetry.push({event:'use',eventId:this.eventSerial++,awardId,seed:this.seed,time:this.time,item,racer:racer.id,position:racer.position,deficit:this.deficit(racer,racers),pickup:award?.pickup??'forced',natural:award?.item===item});
    if(!racer.item)this.heldAwards.delete(racer.id);
    const k=racer.state;events.push({type:`item-${item}`,racer:racer.id});
    if(item==='boost'||item==='tripleBoost'){racer.physics.grantBoost(1.65,5);return true;}
    if(item==='shield'){racer.shield=4;return true;}
    if(item==='storm'){const targets=racers.filter(r=>r.id!==racer.id&&!r.progress.finished&&mod(r.state.progress-racer.state.progress,this.track.length)<230).map(r=>r.id);this.storms.push({owner:racer.id,targets,time:.8});for(const id of targets)events.push({type:'storm-warning',racer:id});return true;}
    if(item==='rocket'){racer.rocket=7;racer.rocketHits.clear();racer.rocketOverrun=0;racer.stun=0;racer.state.drifting=false;racer.state.charge=0;return true;}
    if(item==='trap'){
      const x=k.x-Math.sin(k.heading)*3.5,z=k.z-Math.cos(k.heading)*3.5;
      this.traps.push({id:this.serial++,owner:racer.id,x,z,y:Math.max(k.y,this.track.surface(x,z,k.route,k.progress).height),radius:.9,life:17,age:0,vy:0,route:k.route,progress:k.progress});
      if(this.traps.length>24)this.traps.shift();return true;
    }
    let heading=k.heading,nearest=55;
    for(const other of racers){
      if(other===racer||other.progress.finished||Math.abs(other.state.y-k.y)>3)continue;
      const dx=other.state.x-k.x,dz=other.state.z-k.z,d=Math.hypot(dx,dz),error=angleDelta(heading,Math.atan2(dx,dz));
      if(d<nearest&&Math.abs(error)<.2){heading+=clamp(error,-.1,.1);nearest=d;}
    }
    const speed=49+Math.abs(k.speed)*.25;
    const target=item==='seeker'?[...racers].filter(r=>r.id!==racer.id&&!r.progress.finished).sort((a,b)=>a.position-b.position)[0]?.id:undefined;
    this.projectiles.push({id:this.serial++,owner:racer.id,x:k.x+Math.sin(heading)*2.3,z:k.z+Math.cos(heading)*2.3,y:k.y+(item==='pineapple'?1.3:.8),vx:Math.sin(heading)*speed,vz:Math.cos(heading)*speed,life:item==='ember'?2.4:item==='seeker'?18:10,route:k.route,progress:k.progress,vy:item==='ember'?8:item==='pineapple'?5:2.5,age:0,kind:item==='ember'?'ember':item==='pineapple'?'pineapple':item==='seeker'?'seeker':'coco',target,bounces:0,distance:0,wallContact:''});
    if(target!==undefined)events.push({type:'seeker-incoming',racer:target});
    if(this.projectiles.length>32)this.projectiles.shift();return true;
  }
  private explode(p:Projectile,racers:Racer[],events:RaceEvent[]){
    if(p.life<=0)return;p.life=0;const radius=p.kind==='pineapple'?6:2;
    this.bursts.push({x:p.x,y:p.y,z:p.z,life:.5,blocked:false,radius});
    events.push({type:'explosion',racer:p.owner});this.stats.explosions++;
    if(p.kind==='pineapple')for(const r of racers)if(!r.progress.finished&&!(r.id===p.owner&&p.age<.6)&&Math.hypot(r.state.x-p.x,r.state.z-p.z)<radius&&Math.abs(r.state.y+.8-p.y)<3)this.hit(r,events,'pineapple');
    if(this.bursts.length>24)this.bursts.shift();
  }
  hit(racer:Racer,events:RaceEvent[],source:string){
    const result=racer.hit();
    if(result==='hit'){this.stats.hits++;events.push({type:'hit',racer:racer.id});}
    if(result==='blocked'){this.stats.blocks++;events.push({type:'shield-block',racer:racer.id});}
    if(result!=='protected'){this.bursts.push({x:racer.state.x,y:racer.state.y+1,z:racer.state.z,life:.5,blocked:result==='blocked'});if(this.bursts.length>24)this.bursts.shift();}
    return result;
  }
  update(racers:Racer[],dt:number,events:RaceEvent[]){
    const previousTime=this.time;this.time+=dt;
    for(const r of racers){r.orbitTime=this.time;r.orbitMask=orbitMask(r);}
    // Launches resolve before this update. Every collision atomically spends its
    // stable slot, so the same coconut can never also launch or hit twice.
    const eligible=(r:Racer)=>!r.progress.finished&&r.state.rescueTime<=0&&!r.state.falling&&r.rocket<=0;
    const center=(k:Racer['state'])=>({x:k.x,y:k.y+1,z:k.z});
    const contactOwners=new Set<string>();
    for(const owner of racers){if(!eligible(owner))continue;
      for(let slot=0;slot<3;slot++){if(!(orbitMask(owner)&(1<<slot)))continue;
        const a=orbitPoint(owner.physics.previous,previousTime,slot),b=orbitPoint(owner.state,this.time,slot);
        for(const target of racers){if(target===owner||!eligible(target)||target.protection>0)continue;
          const key=[owner.id,target.id].sort((x,y)=>x-y).join('/');if(contactOwners.has(key))continue;
          let intercepted=false;
          for(let other=0;other<3;other++)if(orbitMask(target)&(1<<other)){
            if(contactTime(a,b,orbitPoint(target.physics.previous,previousTime,other),orbitPoint(target.state,this.time,other),COCO_RADIUS*2)<Infinity){
              spendCoco(owner,slot);spendCoco(target,other);this.bursts.push({...b,life:.4,blocked:true});events.push({type:'coco-intercept',racer:owner.id});contactOwners.add(key);intercepted=true;break;
            }
          }
          if(intercepted)break;
          if(contactTime(a,b,center(target.physics.previous),center(target.state),COCO_RADIUS+.9)<Infinity){
            if(spendCoco(owner,slot)){this.hit(target,events,'orbit-coco');events.push({type:'coco-contact',racer:owner.id});contactOwners.add(key);}break;
          }
        }
      }
    }

    for(const storm of this.storms){storm.time-=dt;if(storm.time<=0)for(const id of storm.targets){const r=racers[id];if(!r||r.progress.finished)continue;const result=this.hit(r,events,'storm');if(result==='hit'){r.stun=.32;r.protection=3;}events.push({type:'storm-impact',racer:id});}}this.storms=this.storms.filter(s=>s.time>0);
    this.bursts=this.bursts.filter(b=>(b.life-=dt)>0);
    for(const [id,cooldown]of this.pickupCooldowns)this.pickupCooldowns.set(id,Math.max(0,cooldown-dt));
    for(const racer of racers){
      if(racer.progress.finished)continue;
      racer.itemCooldown=Math.max(0,racer.itemCooldown-dt);
      racer.heldTime=racer.item?racer.heldTime+dt:0;
      for(const pickup of this.track.pickups??[]){
        if(racer.item||racer.rocket>0||racer.state.rescueTime>0||(this.pickupCooldowns.get(pickup.id)??0)>0)continue;
        const p=this.track.at(pickup.s,pickup.route),x=p.x+p.nx*pickup.lane,z=p.z+p.nz*pickup.lane;
        if(!racer.state.falling&&Math.hypot(racer.state.x-x,racer.state.z-z)<2&&Math.abs(racer.state.y-(p.y??0)-Math.tan(p.bank??0)*pickup.lane)<2){
          racer.heldTime=0;racer.actionFlash=.55;racer.item=this.naturalAward(racer,racers,pickup.id);racer.charges=['triple','tripleBoost','ember'].includes(racer.item)?3:1;racer.orbitMask=racer.item==='triple'?7:0;this.pickupCooldowns.set(pickup.id,3.5);this.stats.pickups++;events.push({type:'pickup',racer:racer.id});
        }
      }
    }
    for(const projectile of this.projectiles){
      if(projectile.kind==='seeker'){
        let target=racers.find(r=>r.id===projectile.target&&!r.progress.finished&&r.id!==projectile.owner);
        if(!target){target=[...racers].filter(r=>r.id!==projectile.owner&&!r.progress.finished).sort((a,b)=>a.position-b.position)[0];projectile.target=target?.id;if(target)events.push({type:'seeker-incoming',racer:target.id});}
        if(!target){this.explode(projectile,racers,events);continue;}
        const s=projectile.progress??0,branch=this.track.routes?.find(r=>r.id===projectile.route),scale=branch?(branch.end-branch.start)/branch.length:1;
        const ahead=this.track.at(s+14*scale,projectile.route),gap=mod(target.state.progress-s,this.track.length),near=gap<24&&target.state.route===projectile.route;
        const lane=near?clamp(this.track.surface(target.state.x,target.state.z,target.state.route,target.state.progress).lateral,-4,4):0;
        const heading=Math.atan2(projectile.vx,projectile.vz),desired=Math.atan2(ahead.x+ahead.nx*lane-projectile.x,ahead.z+ahead.nz*lane-projectile.z),turn=heading+clamp(angleDelta(heading,desired),-3.8*dt,3.8*dt);
        projectile.vx=Math.sin(turn)*55;projectile.vz=Math.cos(turn)*55;projectile.vy=0;
        const ground=this.track.surface(projectile.x,projectile.z,projectile.route,s);projectile.y=ground.height+1.1;
      }
      const oldX=projectile.x,oldZ=projectile.z,oldY=projectile.y;projectile.x+=projectile.vx*dt;projectile.z+=projectile.vz*dt;projectile.life-=dt;projectile.age+=dt;projectile.distance+=Math.hypot(projectile.vx,projectile.vz)*dt;projectile.vy-=23*dt;projectile.y+=projectile.vy*dt;
      const from={x:oldX,y:oldY,z:oldZ},to=projectile;
      const contacts:{racer:Racer;t:number;slot?:number}[]=[];
      for(const r of racers){if(r.id===projectile.owner||!eligible(r))continue;
        // Actual orbit spheres, never a full ring or automatic shield. A
        // pineapple can be intercepted but still explodes at that contact.
        for(let slot=0;slot<3;slot++)if(orbitMask(r)&(1<<slot)){
          const t=contactTime(from,to,orbitPoint(r.physics.previous,previousTime,slot),orbitPoint(r.state,this.time,slot),COCO_RADIUS+.9);
          if(t<Infinity)contacts.push({racer:r,t,slot});
        }
        if(r.protection<=0){const t=contactTime(from,to,center(r.physics.previous),center(r.state),1.3);if(t<Infinity)contacts.push({racer:r,t});}
      }
      contacts.sort((a,b)=>a.t-b.t||a.racer.id-b.racer.id||(a.slot??4)-(b.slot??4));
      const contact=contacts[0];
      if(contact){
        projectile.x=oldX+(projectile.x-oldX)*contact.t;projectile.y=oldY+(projectile.y-oldY)*contact.t;projectile.z=oldZ+(projectile.z-oldZ)*contact.t;
        if(contact.slot!==undefined){spendCoco(contact.racer,contact.slot);events.push({type:'coco-intercept',racer:contact.racer.id});this.bursts.push({x:projectile.x,y:projectile.y,z:projectile.z,life:.4,blocked:true});}
        else if(projectile.kind!=='pineapple')this.hit(contact.racer,events,projectile.kind);
        this.explode(projectile,racers,events);
      }
      if(projectile.life<=0)continue;
      const surface=this.track.surface(projectile.x,projectile.z,projectile.route,projectile.progress);projectile.progress=surface.s;projectile.route=surface.route??'main';const barrier=surface.barrier??this.track.barrier;
      if(surface.supported!==false&&projectile.y<surface.height+.78&&projectile.y>surface.height-1.8){if(projectile.kind==='pineapple'){this.explode(projectile,racers,events);continue;}projectile.y=surface.height+.78;projectile.vy=projectile.kind==='ember'?8:2.8;}
      const wall=projectile.y<surface.height+2.7&&projectile.y>surface.height-1&&Math.abs(surface.lateral)>barrier-.7&&(this.track.railAt?.(surface.s,Math.sign(surface.lateral),projectile.route)??true);
      if(!wall&&Math.abs(surface.lateral)<barrier-1.2)projectile.wallContact='';
      if(wall){
        const sign=Math.sign(surface.lateral),nx=surface.nx*sign,nz=surface.nz*sign,key=projectile.route+':'+sign;
        const dot=projectile.vx*nx+projectile.vz*nz;
        projectile.x-=nx*(Math.abs(surface.lateral)-(barrier-.85));projectile.z-=nz*(Math.abs(surface.lateral)-(barrier-.85));
        if(projectile.kind==='pineapple'){this.explode(projectile,racers,events);continue;}
        if(dot>0){projectile.vx-=2*nx*dot;projectile.vz-=2*nz*dot;
          if(projectile.wallContact!==key){projectile.bounces++;this.stats.ricochets++;events.push({type:'ricochet',racer:projectile.owner,value:projectile.bounces});}
          projectile.wallContact=key;if(projectile.bounces>=6){this.explode(projectile,racers,events);continue;}
        }
      }
      if(projectile.y<surface.height-14||surface.distance>barrier+4||projectile.distance>(projectile.kind==='seeker'?1100:550)||this.track.obstacles.some(o=>Math.hypot(projectile.x-o.x,projectile.z-o.z)<o.radius+.7))this.explode(projectile,racers,events);
    }
    for(const trap of this.traps){
      trap.life-=dt;trap.age+=dt;const ground=this.track.surface(trap.x,trap.z,trap.route,trap.progress);trap.vy-=23*dt;trap.y+=trap.vy*dt;
      if(ground.supported!==false&&trap.y<=ground.height){trap.y=ground.height;trap.vy=0;}if(trap.y<ground.height-15)trap.life=0;
      for(const racer of racers){if(racer.id===trap.owner&&trap.age<.7||racer.progress.finished)continue;
        if(Math.hypot(racer.state.x-trap.x,racer.state.z-trap.z)<1.55&&Math.abs(racer.state.y-trap.y)<1.7){this.hit(racer,events,'trap');trap.life=0;break;}}
    }
    this.projectiles=this.projectiles.filter(p=>p.life>0);this.traps=this.traps.filter(p=>p.life>0);
  }
  botShouldUse(racer:Racer,racers:Racer[],reaction:number){
    if(!racer.item||racer.heldTime<reaction)return false;
    const k=racer.state,p=this.track.at(k.progress+25,k.route),turn=Math.abs(angleDelta(k.heading,Math.atan2(p.x-k.x,p.z-k.z)));
    if(racer.item==='boost'||racer.item==='tripleBoost')return turn<.45&&k.grounded;
    if(racer.item==='rocket')return k.grounded&&!racer.progress.invalid;
    if(racer.item==='storm')return true;
    if(racer.item==='seeker')return racers.some(r=>r.id!==racer.id&&!r.progress.finished);
    if(racer.item==='shield')return this.projectiles.some(s=>s.owner!==racer.id&&Math.hypot(s.x-k.x,s.z-k.z)<22)||racer.heldTime>3;
    if(racer.item==='trap')return racers.some(r=>r!==racer&&Math.hypot(r.state.x-k.x,r.state.z-k.z)<20)||racer.heldTime>4;
    return racers.some(r=>r!==racer&&!r.progress.finished&&Math.hypot(r.state.x-k.x,r.state.z-k.z)<45&&Math.abs(angleDelta(k.heading,Math.atan2(r.state.x-k.x,r.state.z-k.z)))<.24)||racer.heldTime>5&&turn<.2;
  }
}
// Comet is a separate rare draw after field-wide eligibility and reservation.
export function pickupPool(position:number):ItemType[]{return position<=2?['bolt','bolt','trap','trap','shield','boost','boost','pineapple','triple','ember','tripleBoost']:position<=5?['bolt','triple','pineapple','shield','boost','boost','tripleBoost','seeker','ember','storm']:['triple','seeker','pineapple','boost','boost','boost','tripleBoost','tripleBoost','ember','storm'];}
