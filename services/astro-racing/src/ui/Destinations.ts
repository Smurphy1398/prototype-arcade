import {COURSE_PREVIEWS} from '../content/previews';
import { createTrack,DESTINATIONS,type TrackId } from '../tracks/catalog';
import type { TrackDefinition } from '../tracks/TrackDefinition';
export const DETAILS:Record<TrackId,{subtitle:string;level:string;colors:[string,string];motif:string}>={
 barnyard:{subtitle:'Mind the tractor. Take the loft.',level:'Farm traffic / mud / animal park',colors:['#a7c783','#b96a52'],motif:'farm'},
 rally:{subtitle:'Settle the slide. Commit to the jump.',level:'Expert / dirt / gravel / mud',colors:['#be845e','#e4c89c'],motif:'rally'},
 dc:{subtitle:'Every monument is another braking point.',level:'Technical / pool edge / garden leap',colors:['#a7cbd6','#eee2c7'],motif:'capital'},
 nyc:{subtitle:'Five boroughs. One green light.',level:'Grid · alley · elevated descent',colors:['#85c4dc','#f6c361'],motif:'city'},
 vegas:{subtitle:'The strip never sleeps.',level:'Boulevard · casino · rooftop',colors:['#df76be','#4b347c'],motif:'neon'},
 candy:{subtitle:'Take the sweet racing line.',level:'Switchbacks · wafer · syrup',colors:['#ed9ec6','#f1ca81'],motif:'candy'},
 atlantis:{subtitle:'Race beneath the tides.',level:'Anchors · aqueduct · wreck',colors:['#237d94','#98e7cb'],motif:'ocean'},
 toybox:{subtitle:'Small racers. Giant imagination.',level:'Playroom · books · toy train',colors:['#e7a05a','#7fd7ca'],motif:'toys'},
 glacier:{subtitle:'A gallery frozen in time.',level:'Alpine · archive · crevasse',colors:['#6ac6e1','#bbdded'],motif:'glacier'},
 vietnam:{subtitle:'River below. Rotor blades above.',level:'Technical · river or ridge',colors:['#405c41','#cc9d58'],motif:'jungle'},
 volcano:{subtitle:'Climb the rim. Escape through the heart.',level:'Expert · banked caldera',colors:['#51394b','#f5a149'],motif:'volcano'},
 'sunspun-tour':{subtitle:'Chase the coast',level:'Flowing · 4 jumps',colors:['#74dfcc','#d3af6d'],motif:'coast'},
 moonbell:{subtitle:'Check in. Check out the shortcuts.',level:'Technical · 3 jumps',colors:['#8895ca','#4b386c'],motif:'hotel'},
 classic:{subtitle:'Where the tour began',level:'Approachable · 1 jump',colors:['#51c8c3','#f3c780'],motif:'coast'},
 factory:{subtitle:'Built for the fast lane',level:'Technical · 3 jumps',colors:['#77a7ae','#e4aa51'],motif:'factory'},
 orbital:{subtitle:'Take the long way around Saturnâ€™s cousin',level:'Exposed · 4 jumps',colors:['#7187c2','#d9a994'],motif:'orbital'},
};
const previews=new Map<string,string>();
export function routePreview(t:TrackDefinition){
 const points=[...t.samples,...(t.routes??[]).flatMap(r=>r.samples)],xs=points.map(p=>p.x),zs=points.map(p=>p.z),minX=Math.min(...xs),maxX=Math.max(...xs),minZ=Math.min(...zs),maxZ=Math.max(...zs),scale=Math.min(100/(maxX-minX),100/(maxZ-minZ));
 const path=(samples:typeof points)=>samples.filter((_,i)=>i%5===0).map((p,i)=>`${i?'L':'M'}${(16+(maxX-p.x)*scale).toFixed(1)} ${(14+(maxZ-p.z)*scale).toFixed(1)}`).join(' ');
 return `<svg class="route-preview" viewBox="0 0 136 128" aria-hidden="true"><path d="${path(t.samples)}Z" fill="none" stroke="#18384c" stroke-width="10" stroke-linejoin="round"/><path d="${path(t.samples)}Z" fill="none" stroke="#fff0cb" stroke-width="4" stroke-linejoin="round"/>${(t.routes??[]).map(r=>`<path d="${path(r.samples)}" fill="none" stroke="#80ffdf" stroke-width="3"/>`).join('')}</svg>`;
}
export function destinationCards(){return Object.entries(DESTINATIONS).map(([key,t],i)=>{
 const id=key as TrackId,d=DETAILS[id],track=createTrack(id);if(!previews.has(id))previews.set(id,routePreview(track));
 return `<button data-track="${id}" class="destination-card" aria-pressed="false" style="--card-a:${d.colors[0]};--card-b:${d.colors[1]}"><div class="destination-art"><img src="${import.meta.env.BASE_URL}courses/${COURSE_PREVIEWS[id]?.file??id+'.jpg'}" alt="${t.name} rendered course" loading="lazy">${previews.get(id)}</div><span class="destination-index">${String(i+1).padStart(2,'0')} / ${(track.length/1000).toFixed(2)} km</span><strong>${t.name}</strong><small>${d.level}</small></button>`;
}).join('');}
