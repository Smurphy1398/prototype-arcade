import type { GarageSelection } from '../content/garage';
import type { Difficulty } from '../content/racers';
export interface TimeRecord {time:number;date:string;name:string;driver:GarageSelection['driver']}
const key=(track:string,difficulty:Difficulty,s:GarageSelection)=>`${['rally','candy','toybox','nyc','dc','vegas','barnyard','atlantis'].includes(track)?'v10':'v08'}/${track}/${difficulty}/${s.body}/${s.tires}/manual`;
export class BestTimes {
  private records:Record<string,TimeRecord>={};
  constructor(private storage?:Pick<Storage,'getItem'|'setItem'>){try{const raw=JSON.parse((storage??localStorage).getItem('astro-best-v4')??'{}');for(const [id,r] of Object.entries(raw??{})){const v=r as TimeRecord;if((id.startsWith('v04/')||id.startsWith('v06/')||id.startsWith('v07/')||id.startsWith('v08/')||id.startsWith('v10/'))&&Number.isFinite(v.time)&&v.time>0&&typeof v.date==='string'&&typeof v.name==='string'&&typeof v.driver==='string')this.records[id]=v;}}catch{}}
  get(track:string,difficulty:Difficulty,setup:GarageSelection){return this.records[key(track,difficulty,setup)];}
  record(track:string,difficulty:Difficulty,setup:GarageSelection,time:number,name:string,date=new Date().toISOString().slice(0,10)){
    if(!Number.isFinite(time)||time<=0)return false;const id=key(track,difficulty,setup);if(this.records[id]&&this.records[id].time<=time)return false;
    this.records[id]={time,date,name,driver:setup.driver};try{(this.storage??localStorage).setItem('astro-best-v4',JSON.stringify(this.records));}catch{}return true;
  }
}
