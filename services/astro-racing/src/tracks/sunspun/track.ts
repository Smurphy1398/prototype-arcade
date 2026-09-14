import { CatmullRomCurve3, CubicBezierCurve3, Vector3 } from 'three';
import { clamp, mod } from '../../core/math';
import { TUNING } from '../../content/tuning';

import type { TrackPoint, Surface, Obstacle, TrackDefinition } from '../TrackDefinition';
import type { AlternateRoute, BoostPad, PickupPoint, MovingHazard } from '../TrackDefinition';
export type { TrackPoint, Surface, Obstacle } from '../TrackDefinition';

/** Track-local data and surface queries. Kart physics does not know this route. */
export class CoastTrack implements TrackDefinition {
  readonly id='classic';
  readonly theme='coast' as const;
  readonly name = 'Sunspun Coast · Classic';
  readonly halfWidth = TUNING.roadHalfWidth;
  readonly barrier = TUNING.barrierOffset;
  readonly samples: TrackPoint[] = [];
  readonly obstacles: Obstacle[] = [];
  readonly length: number;
  readonly rampStart = 0.258;
  readonly rampEnd = 0.283;
  readonly routes:AlternateRoute[]=[];
  readonly boostPads:BoostPad[]=[];
  readonly pickups:PickupPoint[]=[];
  readonly hazard:MovingHazard;
  constructor() {
    const points = [
      [0, 0], [0, 75], [-15, 135], [-70, 166], [-128, 145],
      [-151, 91], [-126, 39], [-151, -10], [-143, -75], [-96, -115],
      [-40, -117], [3, -84], [13, -41],
    ].map(([x, z]) => new Vector3(x, 0, z));
    const curve = new CatmullRomCurve3(points, true, 'catmullrom', 0.45);
    curve.arcLengthDivisions = 2400;
    this.length = curve.getLength();
    for (let i = 0; i < 900; i++) {
      const u = i / 900, p = curve.getPointAt(u), t = curve.getTangentAt(u).normalize();
      this.samples.push({ x: p.x, z: p.z, tx: t.x, tz: t.z, nx: t.z, nz: -t.x, s: u * this.length });
    }
    for (const [fraction, side] of [[0.40, 5.3], [0.61, -5.8], [0.79, 5.7]]) {
      const p = this.at(fraction * this.length);
      this.obstacles.push({ x: p.x + p.nx * side, z: p.z + p.nz * side, radius: 1.1 });
    }
    const start=.19*this.length,end=.405*this.length,a=this.at(start),b=this.at(end);
    const branchCurve=new CubicBezierCurve3(
      new Vector3(a.x,0,a.z),new Vector3(a.x+a.tx*36,0,a.z+a.tz*36),
      new Vector3(b.x-b.tx*36,0,b.z-b.tz*36),new Vector3(b.x,0,b.z),
    );branchCurve.arcLengthDivisions=700;
    const samples:TrackPoint[]=[];
    for(let i=0;i<=240;i++){const u=i/240,p=branchCurve.getPointAt(u),t=branchCurve.getTangentAt(u).normalize();samples.push({x:p.x,z:p.z,tx:t.x,tz:t.z,nx:t.z,nz:-t.x,s:start+(end-start)*u});}
    this.routes.push({id:'lagoon',name:'Lagoon Cut',start,end,length:branchCurve.getLength(),halfWidth:3.2,barrier:4.1,samples});
    for(const [i,s] of [.055,.53,.88].entries())this.boostPads.push({id:`coast-${i}`,s:s*this.length,route:'main',lane:i===1?-2.5:0,width:4.2,length:7,duration:.95});
    this.boostPads.push({id:'lagoon-boost',s:.30*this.length,route:'lagoon',lane:0,width:3.8,length:7,duration:1.1});
    for(const [row,f] of [.095,.445,.735,.925].entries())for(const [i,lane] of [-3.5,0,3.5].entries())this.pickups.push({id:`pickup-${row}-${i}`,s:f*this.length,route:'main',lane});
    this.hazard={id:'crab-crossing',s:.675*this.length,amplitude:8.1,period:7.6,radius:1.45};
  }
  at(s: number, route='main'): TrackPoint {
    const alternative=this.routes.find(r=>r.id===route);
    if(alternative&&s>=alternative.start&&s<=alternative.end){
      const f=(s-alternative.start)/(alternative.end-alternative.start)*(alternative.samples.length-1),index=Math.min(alternative.samples.length-2,Math.floor(f));
      const a=alternative.samples[index],b=alternative.samples[index+1],t=f-index;
      const tx=a.tx+(b.tx-a.tx)*t,tz=a.tz+(b.tz-a.tz)*t,n=Math.hypot(tx,tz);
      return {x:a.x+(b.x-a.x)*t,z:a.z+(b.z-a.z)*t,tx:tx/n,tz:tz/n,nx:tz/n,nz:-tx/n,s};
    }
    const f = mod(s, this.length) / this.length * this.samples.length;
    const a = this.samples[Math.floor(f)], b = this.samples[(Math.floor(f) + 1) % this.samples.length], t = f % 1;
    const tx = a.tx + (b.tx - a.tx) * t, tz = a.tz + (b.tz - a.tz) * t, len = Math.hypot(tx, tz);
    return { x: a.x + (b.x - a.x) * t, z: a.z + (b.z - a.z) * t, tx: tx / len, tz: tz / len, nx: tz / len, nz: -tx / len, s: mod(s, this.length) };
  }
  surface(x: number, z: number, routeHint='main'): Surface {
    let closest = 0, best = Infinity;
    for (let i = 0; i < this.samples.length; i++) {
      const p = this.samples[i], d = (p.x - x) ** 2 + (p.z - z) ** 2;
      if (d < best) { best = d; closest = i; }
    }
    let point = this.samples[closest], bestD = Infinity;
    for (const index of [closest - 1, closest]) {
      const a = this.samples[mod(index, this.samples.length)], b = this.samples[mod(index + 1, this.samples.length)];
      const dx = b.x - a.x, dz = b.z - a.z;
      const t = clamp(((x - a.x) * dx + (z - a.z) * dz) / (dx * dx + dz * dz), 0, 1);
      const px = a.x + dx * t, pz = a.z + dz * t, d = (x - px) ** 2 + (z - pz) ** 2;
      if (d < bestD) { bestD = d; point = this.at(a.s + this.length / this.samples.length * t); }
    }
    let route='main',halfWidth:number=this.halfWidth,barrier:number=this.barrier;
    for(const branch of this.routes){
      const atJunction=Math.abs(point.s-branch.start)<65||Math.abs(point.s-branch.end)<65;
      if(routeHint!==branch.id&&!atJunction)continue;
      let branchPoint=branch.samples[0],branchD=Infinity;
      for(let i=0;i<branch.samples.length-1;i++){
        const a=branch.samples[i],b=branch.samples[i+1],dx=b.x-a.x,dz=b.z-a.z;
        const t=clamp(((x-a.x)*dx+(z-a.z)*dz)/(dx*dx+dz*dz),0,1),px=a.x+dx*t,pz=a.z+dz*t,d=(x-px)**2+(z-pz)**2;
        if(d<branchD){branchD=d;branchPoint=this.at(a.s+(b.s-a.s)*t,branch.id);}
      }
      const inside=branchPoint.s>branch.start+7&&branchPoint.s<branch.end-7;
      const mainLateral=(x-point.x)*point.nx+(z-point.z)*point.nz;
      const entering=routeHint==='main'&&Math.abs(mainLateral)>4.2&&branchD<Math.min(bestD-1,branch.halfWidth**2);
      if(entering&&bestD>this.halfWidth**2||(routeHint===branch.id&&(branchD<(branch.halfWidth+.75)**2||bestD>(this.halfWidth+.75)**2&&branchD<(branch.barrier+2)**2))){
        point=branchPoint;bestD=branchD;route=branch.id;halfWidth=branch.halfWidth;barrier=branch.barrier;
        // Open the shared approach/merge; fences exist only beyond the junction.
        if(branchPoint.s<branch.start+17||branchPoint.s>branch.end-17){halfWidth=5.4;barrier=7.4;}
      }
    }
    const lateral = (x - point.x) * point.nx + (z - point.z) * point.nz;
    const u = point.s / this.length;
    const ramp = route==='main'&&u >= this.rampStart && u <= this.rampEnd && Math.abs(lateral) < 5.5;
    const height = ramp ? (u - this.rampStart) / (this.rampEnd - this.rampStart) * 3.3 : 0;
    return { ...point, lateral, distance: Math.sqrt(bestD), height, ramp, offroad: Math.abs(lateral) > halfWidth,route,halfWidth,barrier,valid:Math.sqrt(bestD)<barrier+1 };
  }
  /** Remove a rail anywhere another driveable ribbon crosses it, on either side. */
  railAt(s:number,side:number,route='main') {
    const branch=this.routes.find(r=>r.id===route),p=this.at(s,route),offset=branch?.barrier??this.barrier;
    const x=p.x+p.nx*offset*side,z=p.z+p.nz*offset*side;
    const others=route==='main'?this.routes.map(r=>({samples:r.samples,width:r.halfWidth})): [{samples:this.samples,width:this.halfWidth}];
    return !others.some(r=>r.samples.some(q=>Math.hypot(q.x-x,q.z-z)<r.width+2.5));
  }
}
