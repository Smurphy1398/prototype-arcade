export const DRIVERS={
  pip:{name:'Pip',tag:'Sun gecko. Corner enthusiast.',skin:0xf9be50,accent:0xf77646},
  rove:{name:'Rove',tag:'Island dog. Unreasonably optimistic.',skin:0xd9a16b,accent:0x489ad1},
  moss:{name:'Moss',tag:'Night frog. Impeccable jump timing.',skin:0x83c367,accent:0x9c70c3},
  lexo:{name:'Lexo',tag:'Cyber leek. Sunglasses on, brakes optional.',skin:0xb9e188,accent:0x625ce2},
  aya:{name:'Aya',tag:'Axolotl mechanic. She builds it, she sends it.',skin:0xf3a6ba,accent:0x35b1ae},
  bolt:{name:'Bolt',tag:'Scrap robot. A heart of gold and spare parts.',skin:0x9faec4,accent:0xf6bd54},
  ember:{name:'Ember',tag:'Red panda. Snack hoarder, apex collector.',skin:0xd87442,accent:0x58aaa9},
  rivet:{name:'Rivet',tag:'Raccoon street mechanic. Every corner is a workshop.',skin:0x8d969e,accent:0xefb34c},
  coco:{name:'Coco',tag:'Cockatoo show-off. Loud feathers, clean passes.',skin:0xf3eed4,accent:0xeb9951},
  nadia:{name:'Nadia',tag:'Raptor rally driver. She reads the road three turns ahead.',skin:0x78bca0,accent:0xf09a72},
  orbit:{name:'Orbit',tag:'Tiny squid astronaut. Eight arms, one perfect apex.',skin:0xaaa1ea,accent:0x72d9df},
  juno:{name:'Juno',tag:'Stunt pilot. Her next jump is always the best one.',skin:0xb77b56,accent:0xdc5788},
} as const;
export const BODIES={
  rally:{name:'Boulder Bug',tag:'Rally buggy · braced cage · planted on rough ground',speed:32,acceleration:21.8,steering:1.02,grip:11.5,engine:'Boulder Bug · gravel boxer twin',pitch:.63,wave:'triangle',gain:1.1},
  scooter:{name:'Nova Scoot',tag:'Retro scooter · nimble steering · relaxed top speed',speed:31,acceleration:22.5,steering:1.16,grip:10.4,engine:'Nova Scoot · soft vintage putter',pitch:.83,wave:'triangle',gain:.9},
  classic:{name:'Sunbug',tag:'The original · balanced all-rounder',speed:33,acceleration:19,steering:1,grip:10,engine:'Sunbug · bright two-stroke',pitch:1,wave:'sawtooth',gain:1},
  buggy:{name:'Tidehopper',tag:'Quick launch · planted turns · lower top speed',speed:31.5,acceleration:22,steering:1.06,grip:10.8,engine:'Tidehopper · low twin rumble',pitch:.69,wave:'triangle',gain:1.25},
  arrow:{name:'Comet',tag:'Fast straights · slower launch · wider turns',speed:35.5,acceleration:16.8,steering:.91,grip:9.4,engine:'Comet · smooth turbine whine',pitch:1.48,wave:'sine',gain:1.1},
  cargo:{name:'Cargo Cub',tag:'Sturdy workhorse · strong grip · measured steering',speed:32.5,acceleration:20.5,steering:.94,grip:12,engine:'Cargo Cub · warm diesel pulse',pitch:.58,wave:'triangle',gain:1.15},
  saucer:{name:'Orbit Disc',tag:'Wide saucer · quick turn-in · loose rear grip',speed:34,acceleration:18.2,steering:1.1,grip:8.8,engine:'Orbit Disc · soft electric hum',pitch:1.18,wave:'sine',gain:.85},
  roadbike:{name:'Neon Needle',tag:'Road motorcycle · fast lean-in · lower loose-surface grip',speed:35,acceleration:20,steering:1.12,grip:8.5,engine:'Neon Needle · rounded four-cylinder',pitch:1.05,wave:'sawtooth',gain:.75},
  scrambler:{name:'Dune Finch',tag:'Scrambler motorcycle · quick launch · forgiving dirt grip',speed:31,acceleration:23.5,steering:1.04,grip:11.3,engine:'Dune Finch · mellow single-cylinder',pitch:.53,wave:'triangle',gain:1.05},
} as const;
export const TIRES={
  snow:{name:'Polar cleats',tag:'Chunky snow tread · high grip · -1.5 speed',speed:-1.5,grip:1.22,steering:.96,offroad:17.5,radius:.5},
  whitewall:{name:'Sunday spokes',tag:'Spoked whitewalls · balanced grip and turn-in',speed:-.3,grip:1.04,steering:1.01,offroad:15,radius:.46},
  cosmic:{name:'Photon rings',tag:'Luminous sidewalls · quick turn-in · playful grip',speed:.2,grip:.95,steering:1.04,offroad:14.5,radius:.45},
  road:{name:'Ribbon slicks',tag:'Road speed · lighter steering',speed:0,grip:1,steering:1,offroad:14,radius:.44},
  trail:{name:'Reef tread',tag:'More grip and shoulder speed · −1 top speed',speed:-1,grip:1.16,steering:.98,offroad:17,radius:.49},
  drift:{name:'Cloud drifters',tag:'Sharper turn-in · easier slides · less traction',speed:-.5,grip:.86,steering:1.08,offroad:15,radius:.46},
} as const;
export const PAINTS={lagoon:{name:'Lagoon',color:0x0e9e9b},guava:{name:'Guava',color:0xe95b61},sunbeam:{name:'Sunbeam',color:0xf2af2f},moon:{name:'Moonberry',color:0x7361c4},salt:{name:'Sea salt',color:0xe4eacb},blue:{name:'Blue tide',color:0x2783d4},orchid:{name:'Orchid',color:0xc659b3},mint:{name:'Mint',color:0x8add9e},coal:{name:'Carbon',color:0x344253},tangerine:{name:'Tangerine',color:0xf08d34},ice:{name:'Ice',color:0x92dfed},cherry:{name:'Cherry',color:0xb93c58}} as const;
export const DECALS={stripe:{name:'Racing stripe'},star:{name:'Sun star'},chevron:{name:'Double chevron'},plain:{name:'Clean paint'}} as const;
export interface GarageSelection {driver:keyof typeof DRIVERS;body:keyof typeof BODIES;tires:keyof typeof TIRES;paint:keyof typeof PAINTS;decal?:keyof typeof DECALS;primary?:string;secondary?:string}
export const DEFAULT_GARAGE:GarageSelection={driver:'pip',body:'classic',tires:'road',paint:'lagoon',decal:'stripe'};
export const isBike=(body:GarageSelection['body'])=>body==='roadbike'||body==='scrambler'||body==='scooter';
export interface Handling {topSpeed:number;acceleration:number;steering:number;grip:number;offroadSpeed:number;lean:number;slide:number}
export function handling(selection:GarageSelection):Handling {const b=BODIES[selection.body],t=TIRES[selection.tires],bike=isBike(selection.body);return {topSpeed:b.speed+t.speed,acceleration:b.acceleration,steering:b.steering*t.steering,grip:b.grip*t.grip,offroadSpeed:t.offroad+(selection.body==='scrambler'?2:selection.body==='roadbike'?-4:0),lean:bike?.4:.08,slide:bike?.12:.19};}
export function validateGarage(raw:unknown):GarageSelection {
  const r=(raw&&typeof raw==='object'?raw:{}) as Record<string,unknown>,s={...DEFAULT_GARAGE};
  for(const [key,catalog] of Object.entries({driver:DRIVERS,body:BODIES,tires:TIRES,paint:PAINTS,decal:DECALS}))if(typeof r[key]==='string'&&Object.hasOwn(catalog,r[key] as string))(s as unknown as Record<string,unknown>)[key]=r[key];
  for(const key of ['primary','secondary'] as const)if(typeof r[key]==='string'&&/^#[0-9a-f]{6}$/i.test(r[key] as string))s[key]=r[key] as string;
  return s;
}
export function loadGarage(storage?:Pick<Storage,'getItem'>):GarageSelection {try{return validateGarage(JSON.parse((storage??localStorage).getItem('astro-garage-v3')??'null'));}catch{return {...DEFAULT_GARAGE};}}
export function saveGarage(selection:GarageSelection,storage?:Pick<Storage,'setItem'>){try{(storage??localStorage).setItem('astro-garage-v3',JSON.stringify(validateGarage(selection)));return true;}catch{return false;}}
export function botGarage(id:number):GarageSelection {return {driver:(Object.keys(DRIVERS) as GarageSelection['driver'][])[id%Object.keys(DRIVERS).length],body:(Object.keys(BODIES) as GarageSelection['body'][])[id%Object.keys(BODIES).length],tires:('road trail drift'.split(' ') as GarageSelection['tires'][])[id%3],paint:(Object.keys(PAINTS) as GarageSelection['paint'][])[id%12],decal:(Object.keys(DECALS) as NonNullable<GarageSelection['decal']>[])[id%4]};}
// Following milestone: equipment and vehicle families remain independent of driver identity.
export type VehicleFamily='kart'|'motorcycle';
export interface FlightEquipment {id:string;deploymentHeight:number;airSteering:number;descentControl:number}
