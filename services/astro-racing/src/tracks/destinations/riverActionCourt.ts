import type {DestinationTrack} from './track';
export function riverActionCourt(t:DestinationTrack,x:number,z:number){
 const b=t.routes.find(b=>b.id==='river');if(t.id!=='vietnam'||!b)return false;
 const p=t.at(b.start+(b.end-b.start)*.53,b.id),dx=x-p.x,dz=z-p.z;
 return Math.abs(dx*p.tx+dz*p.tz)<72&&Math.abs(dx*p.nx+dz*p.nz)<75;
}
