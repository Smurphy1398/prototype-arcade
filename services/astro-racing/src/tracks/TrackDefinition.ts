export interface TrackPoint { x:number; z:number; tx:number; tz:number; nx:number; nz:number; s:number; y?:number; bank?:number }
export interface Surface extends TrackPoint { lateral:number; distance:number; height:number; ramp:boolean; offroad:boolean; route?:string; halfWidth?:number; barrier?:number; valid?:boolean; supported?:boolean; rescueSafe?:boolean; slope?:number; grip?:number; speedScale?:number; resistance?:number; material?:'dirt'|'gravel'|'mud'; launch?:number }
export interface Obstacle { x:number; z:number; radius:number }
export interface AlternateRoute { id:string; name:string; start:number; end:number; length:number; halfWidth:number; barrier:number; samples:TrackPoint[] }
export interface BoostPad { id:string; s:number; route:string; lane:number; width:number; length:number; duration:number }
export interface PickupPoint { id:string; s:number; route:string; lane:number }
export interface MovingHazard { id:string; s:number; amplitude:number; period:number; radius:number }
export interface CourseHazard {id:string;kind:'press'|'crane'|'meteor'|'door'|'chandelier'|'trap'|'napalm'|'bomb'|'lava'|'log'|'rockfall'|'ghost'|'icefall'|'tide'|'crab'|'traffic'|'construction'|'fountain'|'syrup'|'current'|'jellyfish'|'toytrain'|'marble'|'anchor'|'gate'|'roller'|'ball'|'robot'|'tractor'|'animal'|'steam'|'hay';s:number;route?:string;lane:number;amplitude:number;period:number;radius:number;phase:number}
export interface Conveyor {id:string;s:number;lane:number;width:number;length:number;force:number}
export interface TrackDefinition {
  readonly name:string;
  readonly id?:string;
  readonly theme?:'coast'|'hotel'|'factory'|'orbital'|'vietnam'|'volcano'|'glacier'|'nyc'|'vegas'|'candy'|'atlantis'|'toybox'|'barnyard'|'rally'|'dc';
  readonly length:number;
  readonly halfWidth:number;
  readonly barrier:number;
  readonly samples:TrackPoint[];
  readonly obstacles:Obstacle[];
  readonly routes?:AlternateRoute[];
  readonly boostPads?:BoostPad[];
  readonly pickups?:PickupPoint[];
  readonly hazard?:MovingHazard;
  readonly hazards?:CourseHazard[];
  readonly conveyors?:Conveyor[];
  at(s:number,route?:string):TrackPoint;
  surface(x:number,z:number,routeHint?:string,progressHint?:number):Surface;
  railAt?(s:number,side:number,route?:string):boolean;
}
