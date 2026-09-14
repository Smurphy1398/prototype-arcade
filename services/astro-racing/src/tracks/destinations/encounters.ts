import type {CourseHazard,TrackDefinition} from '../TrackDefinition';
export const authoredCourse=(id?:string)=>['nyc','vegas','candy','atlantis','toybox','barnyard','rally','dc','volcano'].includes(id??'');
export function encounterState(h:CourseHazard,elapsed:number,track:TrackDefinition){
 const phase=((elapsed+h.phase)%h.period)/h.period,p=track.at(h.s,h.route);
 const moving=['traffic','toytrain','marble','roller','ball','robot','tractor','animal','hay','jellyfish'].includes(h.kind);
 let lateral=h.lane+Math.sin(phase*Math.PI*2)*h.amplitude;
 let lift=0,active=true,warning=false;
 if(h.kind==='rockfall'){
  lift=phase<.3?18:phase<.43?18*(1-(phase-.3)/.13):phase<.66?0:18;
  active=phase>=.41&&phase<.66;warning=phase>.16&&phase<.43;
  if(phase>=.43&&phase<.66)lateral=h.lane-(phase-.43)/.23*4;
 }else if(h.kind==='anchor'||h.kind==='press'||h.kind==='gate'||h.kind==='door'){
  lift=phase<.22?17:phase<.36?17*(1-(phase-.22)/.14):phase<.66?0:phase<.84?17*(phase-.66)/.18:17;
  active=lift<2.5;warning=phase>=.12&&phase<.36;
 }else if(h.kind==='lava'){active=phase>.34&&phase<.61;warning=phase>.12&&phase<=.34;}
 else if(h.kind==='fountain'||h.kind==='steam'){active=phase>.30&&phase<.68;warning=phase>.12&&phase<=.30;}
 else if(moving){active=true;warning=Math.abs(lateral)<track.halfWidth+7;}
 if(h.kind==='ball')lift=Math.abs(Math.sin(elapsed*3))*3;
 const blocker=['traffic','toytrain','robot','tractor','animal','hay','gate','door','construction'].includes(h.kind)||h.kind==='anchor'&&phase>.39;
 return {id:h.id,kind:h.kind,x:p.x+p.nx*lateral,z:p.z+p.nz*lateral,y:(p.y??0)+Math.tan(p.bank??0)*lateral+lift,radius:h.radius,active,warning,lift,lateral,blocker};
}
