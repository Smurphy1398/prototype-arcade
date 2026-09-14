import {expedition} from './destinations/expeditions';
import { CoastTrack } from './sunspun/track';
import { DestinationTrack } from './destinations/track';
export const DESTINATIONS={
 barnyard:{name:'Barnyard Stampede',tag:'Farm traffic · barn loft · animal park',stamp:'FARM'},
 rally:{name:'Redline Rally',tag:'Dirt berms · quarry jumps · mud tactics',stamp:'RALLY'},
 dc:{name:'Washington, DC · Capital Circuit',tag:'Monumental avenues · terraces · basin',stamp:'CAPITAL'},
 nyc:{name:'NYC · Borough Dash',tag:'City grid · transit decks · park promenade',stamp:'NYC'},
 vegas:{name:'Vegas · Neon Mirage',tag:'Neon boulevard · casino · rooftop spiral',stamp:'VEGAS'},
 candy:{name:'Candy Island',tag:'Chocolate river · stepping wafers · taffy presses',stamp:'CANDY'},
 atlantis:{name:'Atlantis · Tidal Crown',tag:'Falling anchors · broken aqueduct · wreck hatch',stamp:'ATLANTIS'},
 toybox:{name:'Toybox · Small Wonders',tag:'Plastic track · storybook jump · giant playroom',stamp:'TOYBOX'},
  glacier:{name:'Glacier Archive',tag:'Snow valley · frozen artifacts · blue ice tunnels',stamp:'ARCHIVE'},
  vietnam:{name:'Vietnam Flashbacks',tag:'Jungle slalom · river ford · bombing run',stamp:'JUNGLE'},
  volcano:{name:'Volcano',tag:'Caldera climb · lava cavern · switchbacks',stamp:'CALDERA'},
  'sunspun-tour':{name:'Sunspun Grand Tour',tag:'Clifftops · cascade tunnel · 4 jumps',stamp:'SUN / CLUB'},
  moonbell:{name:'Moonbell Hotel',tag:'Ballroom · midnight gardens · 3 jumps',stamp:'MOON / BELL'},
  classic:{name:'Sunspun Classic',tag:'Original compact coast · Lagoon Cut',stamp:'CLASSIC'},
  factory:{name:'Clockwork Cargo',tag:'Conveyors · timed presses · crane crossing',stamp:'CARGO'},
  orbital:{name:'Orbital Drift',tag:'Banked rings · meteors · station shortcut',stamp:'ORBIT'},
} as const;
export type TrackId=keyof typeof DESTINATIONS;
export function createTrack(id:string){return id==='classic'?new CoastTrack():new DestinationTrack(expedition(id)?id as any:id==='glacier'||id==='vietnam'||id==='volcano'||id==='moonbell'||id==='factory'||id==='orbital'?id:'sunspun-tour');}
export function loadTrack(){try{const id=localStorage.getItem('astro-destination-v3');return createTrack(id??'sunspun-tour');}catch{return createTrack('sunspun-tour');}}
