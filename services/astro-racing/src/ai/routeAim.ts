import type {AlternateRoute} from '../tracks/TrackDefinition';
import {clamp} from '../core/math';
/** Navigation only: project onto the planned branch before choosing a look-ahead.
 * Canonical standings remain owned by the actual supporting deck. */
export function routeAim(route:AlternateRoute,x:number,z:number,progress:number){
 if(progress<route.start||progress>route.end)return progress;
 let best=Infinity,s=progress;
 for(let i=0;i<route.samples.length-1;i++){const a=route.samples[i],b=route.samples[i+1];if(Math.abs(a.s-progress)>140)continue;const dx=b.x-a.x,dz=b.z-a.z,t=clamp(((x-a.x)*dx+(z-a.z)*dz)/(dx*dx+dz*dz),0,1),d=(x-a.x-dx*t)**2+(z-a.z-dz*t)**2;if(d<best){best=d;s=a.s+(b.s-a.s)*t;}}
 return s;
}
