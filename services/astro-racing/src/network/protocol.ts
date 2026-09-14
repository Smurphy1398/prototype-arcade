import type { DriveInput } from '../core/Input';
import { neutralInput } from '../core/Input';
import type { RaceSimulation } from '../race/RaceSimulation';
export const PROTOCOL=2;
export const CONTENT_VERSION='v10';
export function cleanInput(raw:unknown):DriveInput {
 const r=(raw&&typeof raw==='object'?raw:{}) as Record<string,unknown>;
 const n=(key:string,min=0)=>typeof r[key]==='number'&&Number.isFinite(r[key])?Math.max(min,Math.min(1,r[key] as number)):0;
 return {...neutralInput(),throttle:n('throttle'),brake:n('brake'),steer:n('steer',-1),drift:r.drift===true,item:r.item===true,trick:r.trick===true};
}
export function raceSnapshot(race:RaceSimulation){return {
 elapsed:race.elapsed,countdown:race.countdown,status:race.status,finishOrder:race.finishOrder,difficulty:race.difficulty,
 racers:race.racers.map(r=>({id:r.id,state:r.state,progress:{...r.progress,track:undefined},setup:r.setup,livery:r.livery,position:r.position,recoveries:r.recoveries,steeringRearm:r.steeringRearm,item:r.item,charges:r.charges,orbitMask:r.orbitMask,orbitTime:r.orbitTime,itemCooldown:r.itemCooldown,rocket:r.rocket,heldTime:r.heldTime,itemFeedback:r.itemFeedback,shieldFlash:r.shieldFlash,actionFlash:r.actionFlash,shield:r.shield,protection:r.protection,stun:r.stun,hitFlash:r.hitFlash})),
 items:{storms:race.items.storms,projectiles:race.items.projectiles,traps:race.items.traps,bursts:race.items.bursts,pickupCooldowns:[...race.items.pickupCooldowns],stats:race.items.stats},
 mechanics:{hazard:race.mechanics.hazard,dynamicHazards:race.mechanics.dynamicHazards,stats:race.mechanics.stats}
};}
export type RaceSnapshot=ReturnType<typeof raceSnapshot>;
export function applySnapshot(race:RaceSimulation,s:RaceSnapshot){
 race.elapsed=s.elapsed;race.countdown=s.countdown;race.status=s.status;race.finishOrder=s.finishOrder;race.difficulty=s.difficulty;
 for(const data of s.racers){const r=race.racers[data.id];if(!r)continue;const {id,state,progress,...props}=data;if(JSON.stringify(r.setup)!==JSON.stringify(props.setup))r.configure(props.setup);r.physics.previous={...r.state};Object.assign(r,props);Object.assign(r.state,state);const {track,...values}=progress;Object.assign(r.progress,values);}
 const {pickupCooldowns,...items}=s.items;Object.assign(race.items,items);race.items.pickupCooldowns=new Map(pickupCooldowns);Object.assign(race.mechanics,s.mechanics);
}
