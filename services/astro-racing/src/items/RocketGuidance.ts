import type {Racer} from '../race/Racer';
import type {TrackDefinition} from '../tracks/TrackDefinition';
import {clamp,mod} from '../core/math';
/** The comet follows the current legal ribbon, including its canonical branch
 * progress. It flies over authored jumps and waits for a supported handback. */
export function guideRocket(r:Racer,track:TrackDefinition,dt:number){
 const k=r.state;r.physics.previous={...k};
 const branch=track.routes?.find(b=>b.id===k.route&&k.progress<b.end),scale=branch?(branch.end-branch.start)/branch.length:1;
 const speed=Math.min(70,Math.max(32,k.speed)+55*dt),s=mod(k.progress+speed*dt*scale,track.length),route=branch&&s<=branch.end?branch.id:'main',p=track.at(s,route);
 const current=track.surface(k.x,k.z,k.route,k.progress),lane=clamp(current.lateral,-(current.halfWidth??track.halfWidth)+1,(current.halfWidth??track.halfWidth)-1),offset=Math.sign(lane)*Math.max(0,Math.abs(lane)-dt*8),x=p.x+p.nx*offset,z=p.z+p.nz*offset,surface=track.surface(x,z,route,s),height=Math.max(surface.height+.3,k.y-34*dt);
 // Ease into the guide from a wide racing line. A lateral teleport would be
 // correctly rejected by progression's independent physical displacement check.
 Object.assign(k,{x,z,y:height,groundHeight:surface.height,heading:Math.atan2(p.tx,p.tz),vx:p.tx*speed,vz:p.tz*speed,vy:0,speed,progress:s,route,grounded:true,falling:false,pitch:surface.slope??0,bank:p.bank??0,drifting:false,boost:.12,airKind:null,trick:'none'});
 r.rocket=Math.max(0,r.rocket-dt);r.protection=Math.max(r.protection,.3);
 if(r.rocket===0){
  if(surface.supported===false||surface.rescueSafe===false||height-surface.height>1){r.rocket=.02;r.rocketOverrun+=dt;if(r.rocketOverrun<2)return false;r.recover();}
  else{const returnSpeed=clamp(speed,0,40);k.y=surface.height;k.speed=returnSpeed;k.vx=p.tx*returnSpeed;k.vz=p.tz*returnSpeed;k.boost=0;r.physics.previous={...k};r.steeringRearm=true;r.protection=1;}
  return true;
 }
 return false;
}
