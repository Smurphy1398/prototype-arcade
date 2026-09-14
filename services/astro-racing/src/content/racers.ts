export interface RacerLivery { name:string; color:number; accent:number; skin:number; code:string }
export const RACER_COUNT=12;
// Stable slot identities are independent of driver, name and future input source.
export const RACERS:RacerLivery[]=[
  {name:'Pip',color:0x0e9e9b,accent:0xf77646,skin:0xf9be50,code:'01'},
  {name:'Coral',color:0xe95b61,accent:0xffe8a7,skin:0xf2b87e,code:'02'},
  {name:'Indigo',color:0x7361c4,accent:0xffbd50,skin:0xa5c68c,code:'03'},
  {name:'Lime',color:0x8bbd40,accent:0x173e53,skin:0xf0ca68,code:'04'},
  {name:'Marina',color:0x2783d4,accent:0xffded0,skin:0xeb9b73,code:'05'},
  {name:'Saffron',color:0xf2af2f,accent:0x8b445e,skin:0x9acead,code:'06'},
  {name:'Nova',color:0xdd719c,accent:0x93e2ed,skin:0xefb995,code:'07'},
  {name:'Byte',color:0x88d7bb,accent:0xffc968,skin:0x94a9bd,code:'08'},
  {name:'Rivet',color:0xe6a645,accent:0xffdf83,skin:0x8d969e,code:'09'},
  {name:'Coco',color:0xe6853c,accent:0xffedb6,skin:0xf3eed4,code:'10'},
  {name:'Nadia',color:0xa4bf44,accent:0xe6ff93,skin:0x925739,code:'11'},
  {name:'Orbit',color:0x8176c8,accent:0x9aeee7,skin:0xaaa1ea,code:'12'},
];
export type Difficulty='easy'|'normal'|'hard';
export const DIFFICULTIES={
  easy:{label:'Easy',description:'Relaxed pace, earlier braking, occasional wide lines.',pace:25.5,corner:19,reaction:.18,error:.07,recovery:2.8},
  normal:{label:'Normal',description:'Full throttle, passing lines, drift boosts and smart items.',pace:36,corner:29,reaction:.075,error:.025,recovery:1.8},
  hard:{label:'Hard',description:'Technical lines, late braking, shortcuts and sharp combat.',pace:39,corner:33,reaction:.045,error:.008,recovery:1.4},
} as const;
