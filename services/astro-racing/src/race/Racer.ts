import { DEFAULT_GARAGE, type GarageSelection, handling, DRIVERS, PAINTS } from '../content/garage';
import { KartPhysics } from '../vehicle/KartPhysics';
import { RaceProgress } from './RaceProgress';
import type { RacerLivery } from '../content/racers';
import type { TrackDefinition } from '../tracks/TrackDefinition';
import type { ItemType } from '../items/definitions';
export class Racer {
  readonly physics:KartPhysics;
  readonly progress:RaceProgress;
  setup:GarageSelection={...DEFAULT_GARAGE};
  configure(selection:GarageSelection){this.setup={...selection};this.physics.setup=handling(selection);const d=DRIVERS[selection.driver];this.livery={...this.livery,name:d.name,color:selection.primary?parseInt(selection.primary.slice(1),16):PAINTS[selection.paint].color,skin:d.skin,accent:d.accent};}
  position=1;
  recoveries=0;
  steeringRearm=false;
  item:ItemType|null=null;
  charges=0;
  orbitMask=0;
  orbitTime=0;
  itemCooldown=0;
  itemRequest=0;
  rocket=0;
  rocketOverrun=0;
  rocketHits=new Set<number>();
  heldTime=0;
  itemFeedback=0;
  shieldFlash=0;
  actionFlash=0;
  shield=0;
  protection=0;
  stun=0;
  hitFlash=0;
  constructor(readonly id:number,public livery:RacerLivery,track:TrackDefinition){this.physics=new KartPhysics(track);this.progress=new RaceProgress(track);}
  get state(){return this.physics.state;}
  grid(s:number,lane:number){
    this.physics.reset(s);const p=this.physics.track.at(s);
    this.state.x+=p.nx*lane;this.state.z+=p.nz*lane;this.physics.previous={...this.state};
    this.progress.reset(this.state);this.recoveries=0;this.steeringRearm=false;
    this.rocketHits.clear();this.rocketOverrun=0;this.item=null;this.charges=0;this.orbitMask=0;this.orbitTime=0;this.itemCooldown=0;this.itemRequest=0;this.rocket=0;this.heldTime=0;this.itemFeedback=0;this.shieldFlash=0;this.actionFlash=0;this.shield=0;this.protection=0;this.stun=0;this.hitFlash=0;
  }
  recover(){this.steeringRearm=true;this.rocket=0;const anchor=this.progress.recoveryAnchor();this.physics.reset(anchor.s,anchor.route);this.progress.rebase(this.state);this.recoveries++;this.protection=2;this.stun=0;this.hitFlash=0;this.actionFlash=1;this.state.rescueTime=.6;}
  hit():'hit'|'blocked'|'protected'{
    if(this.progress.finished||this.protection>0||this.rocket>0)return 'protected';
    if(this.shield>0){this.shield=0;this.shieldFlash=.55;this.protection=1.2;return 'blocked';}
    this.protection=2.2;this.stun=.55;this.hitFlash=.65;
    this.state.vx*=.4;this.state.vz*=.4;this.state.speed*=.4;this.state.boost=0;this.state.drifting=false;this.state.charge=0;this.state.trick='missed';
    return 'hit';
  }
}
