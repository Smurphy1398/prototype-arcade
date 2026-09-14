import { RACER_COUNT } from '../content/racers';
import type { TrackId } from '../tracks/catalog';
export const CUP_TRACKS:TrackId[]=['sunspun-tour','factory','orbital'];
export const CUPS={discovery:{name:'Roads Less Traveled',tracks:['barnyard','rally','dc'] as TrackId[]},classic:{name:'Rivals & Rides',tracks:CUP_TRACKS},city:{name:'City Lights',tracks:['nyc','vegas','toybox'] as TrackId[]},wonders:{name:'Hidden Wonders',tracks:['candy','atlantis','glacier'] as TrackId[]}};
export const CUP_POINTS=[20,17,15,13,11,9,7,5,4,3,2,1] as const;
export class CupSession {
  constructor(readonly cup:keyof typeof CUPS='classic'){}
  get name(){return CUPS[this.cup].name+' Cup';}
  get tracks(){return CUPS[this.cup].tracks;}
  round=0;private scored=-1;
  readonly totals=Array.from({length:RACER_COUNT},(_,id)=>({id,points:0,wins:0,placeSum:0}));
  readonly rounds:number[][]=[];
  get track(){return this.tracks[this.round];}
  get ready(){return this.scored===this.round;}
  get complete(){return this.ready&&this.round===this.tracks.length-1;}
  record(order:readonly number[]){
    if(this.ready||order.length!==RACER_COUNT||new Set(order).size!==RACER_COUNT||order.some(id=>!Number.isInteger(id)||id<0||id>=RACER_COUNT))return false;
    this.rounds.push([...order]);order.forEach((id,i)=>{this.totals[id].points+=CUP_POINTS[i];this.totals[id].wins+=Number(i===0);this.totals[id].placeSum+=i+1;});this.scored=this.round;return true;
  }
  advance(){if(!this.ready||this.complete)return false;this.round++;return true;}
  standings(){return [...this.totals].sort((a,b)=>b.points-a.points||b.wins-a.wins||a.placeSum-b.placeSum||a.id-b.id);}
}
