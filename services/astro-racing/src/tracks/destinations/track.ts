import {expedition,type ExpeditionId} from './expeditions';
import { CatmullRomCurve3, CubicBezierCurve3,Vector3 } from 'three';
import { clamp,mod } from '../../core/math';
import type { TrackDefinition,TrackPoint,Surface,AlternateRoute,BoostPad,PickupPoint,MovingHazard,CourseHazard,Conveyor } from '../TrackDefinition';
export interface Jump {name:string;route?:string;start:number;end:number;gapEnd:number;height:number;launch:number}
export type DestinationId='sunspun-tour'|'moonbell'|'factory'|'orbital'|'vietnam'|'volcano'|'glacier'|ExpeditionId;
/** All coordinates and mechanisms consume this one authored ribbon. Progress is horizontal arc distance. */
export class DestinationTrack implements TrackDefinition {
  readonly theme:'coast'|'hotel'|'factory'|'orbital'|'vietnam'|'volcano'|'glacier'|ExpeditionId;readonly name:string;readonly halfWidth:number;readonly barrier:number;
  readonly samples:TrackPoint[]=[];readonly routes:AlternateRoute[]=[];readonly obstacles=[];
  readonly boostPads:BoostPad[]=[];readonly pickups:PickupPoint[]=[];readonly hazard:MovingHazard|undefined;
  readonly length:number;readonly jumps:Jump[]=[];
  readonly hazards:CourseHazard[]=[];readonly conveyors:Conveyor[]=[];
  readonly exposed:[number,number][];readonly heights:[number,number][];
  constructor(readonly id:DestinationId){
    const plan=expedition(id);
    this.halfWidth=plan?.width??(id==='vietnam'?9:id==='volcano'?9.5:12);this.barrier=this.halfWidth+1;
    this.theme=id==='glacier'?'glacier':id==='vietnam'?'vietnam':id==='volcano'?'volcano':id==='moonbell'?'hotel':id==='factory'?'factory':id==='orbital'?'orbital':'coast';this.name=id==='glacier'?'Glacier Archive':id==='vietnam'?'Vietnam Flashbacks':id==='volcano'?'Volcano':id==='moonbell'?'Moonbell Hotel':id==='factory'?'Clockwork Cargo':id==='orbital'?'Orbital Drift':'Sunspun Grand Tour';
    if(plan){this.theme=plan.theme;this.name=plan.name;}
    const points=plan?.points??(id==='glacier'?[[0,0],[30,105],[-20,180],[-100,235],[-190,200],[-255,270],[-340,300],[-400,220],[-360,100],[-270,60],[-215,-30],[-300,-100],[-340,-190],[-235,-250],[-100,-220],[-45,-135],[40,-190],[135,-155],[165,-50],[70,0]]:id==='vietnam'?[
      [0,0],[10,75],[-35,135],[20,190],[-40,250],[-105,270],[-160,225],[-145,155],[-225,145],[-300,220],[-385,180],[-395,60],[-335,-20],[-370,-110],[-280,-190],[-200,-160],[-165,-70],[-90,-90],[-80,-210],[30,-275],[130,-230],[155,-140],[75,-90],[40,-40],
    ]:id==='volcano'?[
      [0,0],[-15,100],[-75,165],[-160,155],[-240,210],[-280,300],[-245,385],[-145,425],[-35,395],[35,320],[15,235],[-65,205],[-135,240],[-155,310],[-100,345],[-55,290],[-100,255],[-145,190],[-145,90],[-245,65],[-300,-5],[-225,-45],[-130,-35],[-95,-105],[-190,-150],[-165,-220],[-65,-230],[10,-150],[55,-60],
    ]:id==='factory'?[
      [0,0],[0,140],[-50,210],[-170,220],[-190,320],[-320,350],[-405,270],[-370,125],[-280,75],[-300,-55],[-410,-135],[-350,-265],[-160,-280],[-80,-210],[80,-230],[155,-115],[60,-65],
    ]:id==='orbital'?[
      [0,0],[0,160],[-100,285],[-290,310],[-400,200],[-470,35],[-400,-120],[-240,-175],[-215,-305],[-80,-440],[130,-420],[270,-285],[255,-100],[145,-5],[75,-70],
    ]:id==='moonbell'?[
      [0,0],[0,150],[-65,265],[-220,280],[-315,205],[-325,60],[-225,-15],[-185,-130],[-270,-230],[-210,-340],[-40,-355],[90,-285],[125,-145],[40,-80],
    ]:[
      [0,0],[0,180],[-40,340],[-165,430],[-325,385],[-380,225],[-330,75],[-450,-30],[-475,-190],[-350,-295],[-185,-255],[-75,-355],[80,-315],[150,-180],[85,-60],
    ]);
    const curve=new CatmullRomCurve3(points.map(([x,z])=>new Vector3(x,0,z)),true,'catmullrom',.35);curve.arcLengthDivisions=5000;this.length=curve.getLength();
    this.heights=plan?.heights??(id==='glacier'?[[0,5],[.13,28],[.24,16],[.43,18],[.57,25],[.68,12],[.78,38],[.9,18],[1,5]]:id==='vietnam'?[[0,4],[.12,10],[.23,5],[.30,8],[.40,25],[.50,9],[.58,5],[.68,30],[.78,26],[.88,8],[1,4]]:id==='volcano'?[[0,2],[.10,18],[.20,48],[.32,83],[.43,88],[.52,74],[.61,48],[.70,27],[.80,16],[.90,7],[1,2]]:id==='factory'?[[0,0],[.12,0],[.23,12],[.33,12],[.43,28],[.53,28],[.64,5],[.73,5],[.84,17],[.95,0],[1,0]]:id==='orbital'?[[0,12],[.12,12],[.24,30],[.36,30],[.48,8],[.57,8],[.7,25],[.8,25],[.9,5],[1,12]]:id==='moonbell'?[[0,0],[.1,0],[.2,9],[.29,9],[.38,27],[.48,27],[.60,8],[.72,3],[.82,13],[.93,0],[1,0]]:[[0,0],[.12,0],[.23,22],[.36,34],[.47,34],[.57,12],[.66,6],[.76,2],[.84,12],[.94,0],[1,0]]);
    this.exposed=plan?.exposed??(id==='glacier'?[[.72,.80]]:id==='vietnam'?[[.33,.46],[.66,.72]]:id==='volcano'?[[.27,.52],[.73,.78]]:id==='factory'?[[.36,.52],[.81,.89]]:id==='orbital'?[[.12,.35],[.43,.72],[.81,.95]]:id==='moonbell'?[[.345,.48],[.8,.86]]:[[.25,.46],[.79,.87]]);
    const count=Math.ceil(this.length/1.8);
    for(let i=0;i<count;i++){const u=i/count,p=curve.getPointAt(u),v=curve.getTangentAt(u).normalize();this.samples.push({x:p.x,z:p.z,tx:v.x,tz:v.z,nx:v.z,nz:-v.x,s:u*this.length,y:this.baseHeight(u*this.length)});}
    // Jump sites have flowing approaches and wide landing decks for every ride/tire setup.
    const specs=plan?.jumps??(id==='glacier'?[[.69,3,9,8]]:id==='vietnam'?[[.515,2.6,7,7]]:id==='volcano'?[[.605,3.4,10,12]]:id==='factory'?[[.105,4,9,0],[.445,6,14,21],[.84,5,12,18]]:id==='orbital'?[[.075,4,9,0],[.32,6,15,24],[.665,6,14,22],[.865,4,10,0]]:id==='moonbell'?[[.065,4,8,0],[.405,6,14,22],[.705,5,10,12]]:[[.08,4,8,0],[.405,6,14,24],[.685,5,10,14],[.845,4,9,0]]);
    const names=plan?.jumpNames??(id==='glacier'?['Daylight Leap']:id==='vietnam'?['Riverbank Hop']:id==='volcano'?['Cavern Exit']:id==='factory'?['Loading Dock','Foundry Flight','Freight Vault']:id==='orbital'?['Station Departure','Ring Leap','Meteor Divide','Homebound Burn']:id==='moonbell'?['Portico Hop','Moonbell Leap','Garden Vault']:['Festival Hop','Lighthouse Leap','Cascade Crossing','Homeward Flight']);
    for(const [i,[f,height,launch,gap]] of specs.entries()){const end=f*this.length;this.jumps.push({name:names[i],start:end-22,end,gapEnd:end+gap,height,launch});}
    const start=(id==='vietnam'?.29:id==='volcano'?.32:id==='factory'?.25:id==='orbital'?.48:id==='moonbell'?.13:.54)*this.length,end=(id==='vietnam'?.48:id==='volcano'?.435:id==='factory'?.405:id==='orbital'?.60:id==='moonbell'?.335:.655)*this.length,a=this.at(start),b=this.at(end),join=id==='vietnam'?80:55;
    const shortcut=new CubicBezierCurve3(new Vector3(a.x,0,a.z),new Vector3(a.x+a.tx*join,0,a.z+a.tz*join),new Vector3(b.x-b.tx*join,0,b.z-b.tz*join),new Vector3(b.x,0,b.z));shortcut.arcLengthDivisions=1000;
    const samples:TrackPoint[]=[];for(let i=0;i<=300;i++){const u=i/300,p=shortcut.getPointAt(u),v=shortcut.getTangentAt(u).normalize(),s=start+(end-start)*u;samples.push({x:p.x,z:p.z,tx:v.x,tz:v.z,nx:v.z,nz:-v.x,s,y:this.baseHeight(s)});}
    const routeId=id==='vietnam'?'river':id==='volcano'?'vent':id==='factory'?'delivery':id==='orbital'?'slingshot':id==='moonbell'?'service':'waterfall';this.routes.push({id:routeId,name:id==='vietnam'?'River Ford':id==='volcano'?'Vent Crossing':id==='factory'?'Delivery Lane':id==='orbital'?'Station Slingshot':id==='moonbell'?'Service Passage':'Waterfall Cut',start,end,length:shortcut.getLength(),halfWidth:id==='vietnam'?6:id==='volcano'?5.8:id==='factory'?5.2:6.2,barrier:id==='vietnam'?7:id==='volcano'?6.8:id==='factory'?6.1:7.1,samples});
    if(id==='glacier'||plan)this.routes.length=0;
    for(const [i,f] of [.035,.205,.37,.62,.785,.93].entries())this.boostPads.push({id:`${id}-pad-${i}`,s:f*this.length,route:'main',lane:i%2?-4:4,width:6,length:9,duration:1});
    this.boostPads.push({id:`${id}-branch`,s:(start+end)/2,route:routeId,lane:0,width:5,length:9,duration:.9});
    for(const [i,j]of this.jumps.entries())this.boostPads.push({id:`${id}-launch-${i}`,s:j.start-9,route:'main',lane:0,width:this.halfWidth*2-.4,length:10,duration:1.8});
    for(const [row,f]of [.025,.145,.315,.51,.745,.905].entries())for(const [col,lane]of [-6,0,6].entries())this.pickups.push({id:`${id}-item-${row}-${col}`,s:f*this.length,route:'main',lane});
    this.pickups.push({id:`${id}-branch-item`,s:start+(end-start)*.7,route:routeId,lane:0});
    if(id==='glacier'||plan){this.boostPads.splice(this.boostPads.findIndex(p=>p.route===routeId),1);this.pickups.splice(this.pickups.findIndex(p=>p.route===routeId),1);}
    if(plan)for(const r of plan.routes){
      const start=r.start*this.length,end=r.end*this.length,a=this.at(start),b=this.at(end),points=[new Vector3(a.x,0,a.z),new Vector3(a.x+a.tx*22,0,a.z+a.tz*22),...r.via.map(([x,z])=>new Vector3(x,0,z)),new Vector3(b.x-b.tx*22,0,b.z-b.tz*22),new Vector3(b.x,0,b.z)];
      if(plan){
        // Round the authored corners before interpolation: the full-width
        // promenade/library ribbons must not fold at a tight control point.
        const rounded=[points[0]];for(let i=1;i<points.length-1;i++){const p=points[i],incoming=p.clone().sub(points[i-1]),outgoing=points[i+1].clone().sub(p),distance=Math.min(30,incoming.length()*.45,outgoing.length()*.45);incoming.normalize();outgoing.normalize();if(incoming.dot(outgoing)<.7)rounded.push(p.clone().addScaledVector(incoming,-distance),p.clone().addScaledVector(outgoing,distance));else rounded.push(p);}rounded.push(points.at(-1)!);points.splice(0,points.length,...rounded);
      }
      const curve=new CatmullRomCurve3(points,false,'centripetal');curve.arcLengthDivisions=1400;const samples:TrackPoint[]=[];
      for(let i=0;i<=300;i++){const u=i/300,p=curve.getPointAt(u),v=curve.getTangentAt(u);samples.push({x:p.x,z:p.z,tx:v.x,tz:v.z,nx:v.z,nz:-v.x,s:start+(end-start)*u,y:0});}
      this.routes.push({id:r.id,name:r.name,start,end,length:curve.getLength(),halfWidth:r.width,barrier:r.width+1,samples});this.routeRise.set(r.id,r.rise);
      this.boostPads.push({id:r.id+'-boost',s:start+(end-start)*.6,route:r.id,lane:0,width:5,length:12,duration:1.2});this.pickups.push({id:r.id+'-item',s:start+(end-start)*.45,route:r.id,lane:0});
    }
    this.expandRoutes();
    this.alignBranchJoins();
    if(plan)for(const spec of plan.routes){const b=this.routes.find(b=>b.id===spec.id)!;const scale=(b.end-b.start)/b.length;
      for(const [i,j]of (spec.jumps??[]).entries()){const end=b.start+(b.end-b.start)*j.u;this.jumps.push({name:b.name+' leap '+(i+1),route:b.id,start:end-16*scale,end,gapEnd:end+j.gap*scale,height:j.height,launch:j.launch});
        this.boostPads.push({id:b.id+'-jump-'+i,s:end-23*scale,route:b.id,lane:0,width:b.halfWidth*1.8,length:10,duration:1.2});}
    }
    for(const p of this.samples)p.y=this.baseHeight(p.s);for(const r of this.routes)for(const p of r.samples){p.y=this.profile(p.s,r.id).height;p.bank=this.bankAt(p.s,r.id);}
    this.hazard={id:id==='moonbell'?'bellhop':id==='factory'?'forklift':id==='orbital'?'satellite':'crab-crossing',s:(id==='moonbell'?.565:id==='factory'?.735:id==='orbital'?.855:.925)*this.length,amplitude:10,period:id==='moonbell'?6.8:8,radius:1.65};
    if(id==='vietnam'||id==='volcano'||id==='glacier'||plan)this.hazard=undefined;
    const h=(name:string,kind:CourseHazard['kind'],fraction:number,lane:number,amplitude:number,period:number,radius:number,phase=0,route='main')=>this.hazards.push({id:name,kind,s:fraction*this.length,lane,amplitude,period,radius,phase,route});
    if(plan)for(const e of plan.hazards)h(e.name,e.kind,e.f,e.lane,e.amplitude??0,e.period,e.radius,e.phase??0,e.route??'main');
    if(id==='glacier'){h('Archive icefall','icefall',.35,-4,0,8,2.6);h('Crevasse icicles','icefall',.75,4,0,7,2.4,2);h('Tunnel icefall','icefall',.47,-2,0,9,1.5,2,'ice-tunnel');}
    else if(id==='vietnam'){
      h('Swinging jungle log','log',.225,0,5,8,2.0);h('Outpost bombing','bomb',.845,3.5,0,9,2.8,4);
      h('Bamboo trap','trap',.115,-3.5,0,7,2.5);h('River tripwire','trap',.405,-2,0,6.5,1.5,1,'river');h('Bombing run','bomb',.675,-3.5,0,11,3,0);h('Napalm lane','napalm',.696,-3.5,0,11,3.2,.6);
    }else if(id==='volcano'){
      h('Basalt rockfall','rockfall',.475,4,0,9,2.8);h('Rim rockfall','rockfall',.835,-2,0,10,1.7,2,'rim');
      h('Caldera burst','lava',.30,-4,0,8,3,1);h('Vent crossing burst','lava',.375,-2,0,6.5,2.2,0,'vent');h('Cavern geyser','lava',.565,4,0,7,2.6,3);
    }else if(id==='factory'){
      h('Stamping press','press',.17,-5,0,6.5,3.2);h('Crane crossing','crane',.585,0,10,10,2.2);h('Delivery stamp','press',.325,0,0,7.5,1.9,2,'delivery');
      this.conveyors.push({id:'Assembly belt',s:.065*this.length,lane:-4,width:7,length:40,force:7},{id:'Return belt',s:.755*this.length,lane:4,width:7,length:42,force:-8});
    }else if(id==='orbital'){h('Meteor crossing A','meteor',.21,0,15,7.5,2.6);h('Meteor crossing B','meteor',.755,0,16,8.5,2.6,3);h('Prism energy gate','ghost',.745,4,0,8,2.2);h('Station scanner','crane',.53,0,4,8,1.5,0,'slingshot');}
    else if(id==='moonbell'){h('Spectral procession','ghost',.575,0,6,9,2);h('Sliding bookshelf','door',.18,-2,0,8,2,1,'service');h('Poltergeist luggage','crane',.64,0,7,7,1.6);h('Ballroom doors','door',.20,-5,0,7,3.1);h('Swinging chandelier','chandelier',.265,0,7,6.5,2.1,1);}
  }
  private expandRoutes(){
    const id=this.id;
    if(id==='sunspun-tour'){this.routes[0].name='Tidal Sea Cave';this.addRoute('lighthouse','Lighthouse Cliff Path',.24,.35,-33,5.8,7);this.addRoute('boardwalk','Crab Boardwalk',.86,.965,-28,6,0);this.hazards.push({id:'High tide surge',kind:'tide',s:.59*this.length,route:'waterfall',lane:-2,amplitude:0,period:13,radius:2.2,phase:0},{id:'Boardwalk crabs',kind:'crab',s:.91*this.length,route:'boardwalk',lane:0,amplitude:3.5,period:7,radius:1.4,phase:0},{id:'Beach crab colony',kind:'crab',s:.16*this.length,route:'main',lane:0,amplitude:7,period:9,radius:1.8,phase:1});}
    if(id==='vietnam')this.addRoute('jungle','Root Tunnel',.74,.86,-26,5.4,-6);
    if(id==='volcano')this.addRoute('rim','Obsidian Rim',.78,.885,30,5.8,9);
    if(id==='moonbell')this.addRoute('balcony','Moonlit Balcony',.53,.66,30,5.5,8);
    if(id==='orbital')this.addRoute('outer-ring','Prism Orbit',.70,.82,-42,6.4,8);
    if(id==='factory')this.addRoute('freight','Freight Service Loop',.68,.78,27,5.8,0);
    if(id==='glacier'){this.addRoute('ice-tunnel','Blue Ice Tunnel',.36,.55,-28,6,-6);this.addRoute('snow-ridge','Fossil Ridge',.66,.86,28,8,7);}
  }
  private addRoute(id:string,name:string,a:number,b:number,offset:number,width:number,dy:number){
    const start=a*this.length,end=b*this.length,points=[];
    for(let i=0;i<=8;i++){const u=i/8,p=this.at(start+(end-start)*u),lane=Math.sin(u*Math.PI)**2*offset*(.8+.2*Math.sin(u*Math.PI*2));points.push(new Vector3(p.x+p.nx*lane,0,p.z+p.nz*lane));}
    if(this.id==='glacier'&&id==='snow-ridge'){
      // The former normal-offset path curled inside the daylight hairpin and
      // made its wide road ribbon overlap itself. Give the ridge its own broad
      // southern arc, with tangent approaches and a distinct landing bypass.
      const p=this.at(start),q=this.at(end);points.splice(0,points.length,
        new Vector3(p.x,0,p.z),new Vector3(p.x+p.tx*35,0,p.z+p.tz*35),
        new Vector3(-105,0,-302),new Vector3(50,0,-280),
        new Vector3(q.x-q.tx*35,0,q.z-q.tz*35),new Vector3(q.x,0,q.z));
    }
    const curve=new CatmullRomCurve3(points,false,'centripetal');curve.arcLengthDivisions=1000;const samples:TrackPoint[]=[];
    for(let i=0;i<=300;i++){const u=i/300,p=curve.getPointAt(u),v=curve.getTangentAt(u);samples.push({x:p.x,z:p.z,tx:v.x,tz:v.z,nx:v.z,nz:-v.x,s:start+(end-start)*u,y:0});}
    const route={id,name,start,end,length:curve.getLength(),halfWidth:width,barrier:width+1,samples};this.routes.push(route);this.routeRise.set(id,dy);
    this.boostPads.push({id:id+'-boost',s:start+(end-start)*.6,route:id,lane:0,width:4.5,length:8,duration:.8});this.pickups.push({id:id+'-pickup',s:start+(end-start)*.4,route:id,lane:0});
  }
  private routeRise=new Map<string,number>();
  private sampleFraction(samples:TrackPoint[],s:number){return clamp((s-samples[0].s)/(samples[samples.length-1].s-samples[0].s),0,1)*(samples.length-1);}
  private branchHeights=new Map<string,number[]>();private branchBanks=new Map<string,number[]>();
  private branchValue(map:Map<string,number[]>,s:number,route:string){const values=map.get(route),b=this.routes.find(r=>r.id===route);if(!values||!b)return undefined;const f=this.sampleFraction(b.samples,s),i=Math.min(values.length-2,Math.floor(f));return values[i]+(values[i+1]-values[i])*(f-i);}
  private alignBranchJoins(){

    for(const b of this.routes){const heights:number[]=[],banks:number[]=[];
      for(const p of b.samples){const q=this.project(p.x,p.z,this.samples,'main',p.s).point,lateral=(p.x-q.x)*q.nx+(p.z-q.z)*q.nz,d=Math.hypot(p.x-q.x,p.z-q.z),t=clamp((d-this.widthAt(q.s)-b.halfWidth-2)/12,0,1),blend=t*t*(3-2*t),bank=this.bankAt(q.s),mainHeight=this.profile(q.s).height+Math.tan(bank)*lateral;
        heights.push(mainHeight*(1-blend)+this.profile(p.s,b.id).height*blend);banks.push(Math.atan(Math.tan(bank)*(p.nx*q.nx+p.nz*q.nz))*(1-blend));
      }this.branchHeights.set(b.id,heights);this.branchBanks.set(b.id,banks);
    }
  }

  bankAt(s:number,route='main'){if(this.id==='rally'&&route==='main'){const f=mod(s,this.length)/this.length;for(const [a,b,bank]of [[.14,.21,.20],[.3,.43,-.16],[.55,.62,.18]])if(f>a&&f<b)return Math.sin((f-a)/(b-a)*Math.PI)*bank;}const branchBank=this.branchValue(this.branchBanks,s,route);if(branchBank!==undefined)return branchBank;if(this.id==='volcano'&&route==='main'){const u=mod(s,this.length)/this.length;return u>.20&&u<.49?Math.sin((u-.20)/.29*Math.PI)*.24:0;}if(this.id!=='orbital'||route!=='main'||this.jumps.some(j=>s>j.start-20&&s<j.gapEnd+80))return 0;const u=mod(s,this.length)/this.length;for(const [a,b] of [[.14,.26],[.70,.81]])if(u>a&&u<b)return Math.sin((u-a)/(b-a)*Math.PI)*.18;return 0;}
  widthAt(s:number){let width=this.halfWidth;for(const j of this.jumps.filter(j=>!j.route)){const from=j.end-12,to=j.gapEnd+90;if(s>from&&s<to){const fade=Math.min(1,(s-from)/12,(to-s)/22);width=Math.max(width,this.halfWidth+6*Math.max(0,fade));}}return width;}
  private rawHeight(s:number){const u=mod(s,this.length??1)/(this.length??1);for(let i=0;i<this.heights.length-1;i++){const [a,h]=this.heights[i],[b,j]=this.heights[i+1];if(u>=a&&u<=b){const t=(u-a)/(b-a),ease=t*t*(3-2*t);return h+(j-h)*ease;}}return 0;}
  baseHeight(s:number){let height=this.rawHeight(s);for(const route of this.routes)for(const center of [route.start,route.end]){const d=Math.abs(s-center);if(d<110){const t=clamp((110-d)/40,0,1),blend=t*t*(3-2*t);height=height*(1-blend)+this.rawHeight(center)*blend;}}return height;}
  profile(s:number,route='main'){
    const branch=this.routes.find(r=>r.id===route);
    const dip=branch&&(this.id==='vietnam'||this.id==='volcano')?Math.sin(clamp((s-branch.start)/(branch.end-branch.start),0,1)*Math.PI)**2*(this.id==='vietnam'?16:10):0;
    const rise=branch?Math.sin(clamp((s-branch.start)/(branch.end-branch.start),0,1)*Math.PI)**2*(this.routeRise.get(route)??0):0;
    const base=this.branchValue(this.branchHeights,s,route)??this.baseHeight(s)-dip+rise,jump=this.jumps.find(j=>(j.route??'main')===route&&s>=j.start&&s<=j.end);
    const gap=this.jumps.some(j=>(j.route??'main')===route&&j.gapEnd>j.end&&s>j.end&&s<j.gapEnd);
    return {height:base+(jump?(s-jump.start)/(jump.end-jump.start)*jump.height:0),ramp:!!jump,gap,launch:jump?.launch??0};
  }
  at(s:number,route='main'):TrackPoint {
    const branch=this.routes.find(r=>r.id===route&&s>=r.start&&s<=r.end),samples=branch?.samples??this.samples;
    const f=branch?this.sampleFraction(samples,s):mod(s,this.length)/this.length*samples.length;
    const i=Math.min(samples.length-1,Math.floor(f)),a=samples[i],b=samples[(i+1)%samples.length],t=f-i;
    const tx=a.tx+(b.tx-a.tx)*t,tz=a.tz+(b.tz-a.tz)*t,n=Math.hypot(tx,tz),canonical=mod(s,this.length);
    return {x:a.x+(b.x-a.x)*t,z:a.z+(b.z-a.z)*t,tx:tx/n,tz:tz/n,nx:tz/n,nz:-tx/n,s:canonical,y:this.profile(canonical,branch?.id??'main').height,bank:this.bankAt(canonical,route)};
  }
  private project(x:number,z:number,samples:TrackPoint[],route:string,progressHint?:number){
    const local=route==='main'&&progressHint!==undefined,center=local?Math.floor(mod(progressHint!,this.length)/this.length*samples.length):0,range=local?Math.ceil(100/this.length*samples.length):0;
    let closest=0,best=Infinity;for(let j=local?center-range:0;j<(local?center+range+1:samples.length);j++){const i=local?mod(j,samples.length):j,p=samples[i];const d=(x-p.x)**2+(z-p.z)**2;if(d<best){best=d;closest=i;}}
    let point=samples[closest],distance=best;
    for(const i of [closest-1,closest]){if(route!=='main'&&(i<0||i>=samples.length-1))continue;const a=samples[mod(i,samples.length)],b=samples[mod(i+1,samples.length)],dx=b.x-a.x,dz=b.z-a.z;
      const t=clamp(((x-a.x)*dx+(z-a.z)*dz)/(dx*dx+dz*dz),0,1),px=a.x+dx*t,pz=a.z+dz*t,d=(x-px)**2+(z-pz)**2;
      if(d<=distance){distance=d;point=this.at(a.s+mod(b.s-a.s,this.length)*t,route);}
    }return {point,distance};
  }
  surface(x:number,z:number,routeHint='main',progressHint?:number):Surface {
    const mainProjection=this.project(x,z,this.samples,'main',progressHint);let {point,distance}=mainProjection,route='main',halfWidth=this.widthAt(point.s),barrier=halfWidth+1;
    const deckHeight=(p:TrackPoint,id:string)=>{const lateral=(x-p.x)*p.nx+(z-p.z)*p.nz;let height=this.profile(p.s,id).height+Math.tan(this.bankAt(p.s,id))*lateral;
      if(id!=='main'&&this.branchHeights.has(id)){const main=mainProjection.point,m=this.profile(main.s),h=m.height+Math.tan(this.bankAt(main.s))*((x-main.x)*main.nx+(z-main.z)*main.nz);if(!m.gap&&mainProjection.distance<=(this.widthAt(main.s)+5)**2&&Math.abs(h-height)<6)height+=(h-height)*clamp((this.widthAt(main.s)+5-Math.sqrt(mainProjection.distance))/4,0,1);}return height;};
    for(const branch of this.routes){const junction=point.s>=branch.start-110&&point.s<=branch.end+110;if(routeHint!==branch.id&&!junction)continue;
      const other=this.project(x,z,branch.samples,branch.id);
      // A narrower branch must never steal support from the wider main pavement.
      // Choose among actual road ribbons before comparing centre-line distances.
      const branchSupports=other.distance<=(branch.halfWidth+.75)**2;
      const mainSupports=distance<=(halfWidth+.75)**2&&!this.profile(point.s).gap;
      const heightDelta=Math.abs(deckHeight(other.point,branch.id)-deckHeight(point,'main'));
      // Transfer only through a connected, level junction. In overlapping ribbons
      // the current deck owns the kart; a lower shortcut cannot pull it underground.
      const connected=heightDelta<1.5&&Math.abs(other.point.s-point.s)<110;
      const committed=routeHint===branch.id&&other.point.s>branch.start+3&&other.point.s<branch.end-3;
      if(branchSupports&&(committed||connected&&!mainSupports)||committed&&!mainSupports&&other.distance<(branch.barrier+2)**2){point=other.point;distance=other.distance;route=branch.id;halfWidth=branch.halfWidth;barrier=branch.barrier;}
    }
    const lateral=(x-point.x)*point.nx+(z-point.z)*point.nz,profile=this.profile(point.s,route),inside=distance<=(halfWidth+.75)**2;
    const slope=(this.profile(point.s+.4,route).height-this.profile(point.s-.4,route).height)/.8;
    const height=deckHeight(point,route);
    const f=point.s/this.length,material=this.id==='rally'?(route==='mudline'?'mud':f>.30&&f<.62?'gravel':'dirt'):this.id==='barnyard'?(route==='orchard'?'mud':'dirt'):undefined;
    const traction=material==='mud'?.61:material==='gravel'?.78:material==='dirt'?.90:1;
    return {material,speedScale:material==='mud'?.76:material==='gravel'?.94:1,resistance:material==='mud'?1.8:material==='gravel'?1.25:1,...point,lateral,distance:Math.sqrt(distance),height,ramp:profile.ramp,offroad:Math.abs(lateral)>halfWidth,route,halfWidth,barrier,
      grip:this.id==='glacier'&&(point.s/this.length>.32&&point.s/this.length<.39||route==='ice-tunnel')?.73:traction,valid:Math.sqrt(distance)<halfWidth+1.5,supported:inside&&!profile.gap,rescueSafe:inside&&!profile.ramp&&!profile.gap&&Math.abs(lateral)<halfWidth-1,slope:clamp(slope,-.4,.4),launch:profile.launch};
  }
  railAt(s:number,side:number,route='main'){
    const branch=this.routes.find(r=>r.id===route),p=this.at(s,route),offset=branch?.barrier??(this.widthAt(s)+1);
    if(this.profile(s,route).gap)return false;
    if(branch){const spec=expedition(this.id)?.routes.find(r=>r.id===route),u=(s-branch.start)/(branch.end-branch.start);if(spec?.exposed?.some(([a,b])=>u>=a&&u<=b))return false;}
    if(route==='main'&&this.exposed.some(([a,b])=>s/this.length>=a&&s/this.length<=b))return false;
    const x=p.x+p.nx*offset*side,z=p.z+p.nz*offset*side,others=branch?[{samples:this.samples,width:this.halfWidth}]:this.routes.map(r=>({samples:r.samples,width:r.halfWidth}));
    // At the tight television bend the inside offset folds back into the same
    // supported road. It is an open join, not a rail across a valid racing line.
    if(this.id==='toybox'&&!branch&&this.samples.some(q=>{const d=Math.abs(q.s-s);return d>3&&d<65&&Math.abs((q.y??0)-(p.y??0))<2&&Math.hypot(q.x-x,q.z-z)<this.widthAt(q.s)-.5;}))return false;
    return !others.some(r=>r.samples.some(q=>Math.hypot(q.x-x,q.z-z)<r.width+2));
  }
}
