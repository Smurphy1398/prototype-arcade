import type {ExpeditionPlan,ExpeditionId} from './expeditions';

/** Owner-directed course revision. Route IDs are retained for saved selection;
 * revised best times are stored separately from v0.8 records. */
export function applyRepairs(plans:Record<ExpeditionId,ExpeditionPlan>){
 const rally=plans.rally;
 rally.jumps=[[.49,3.4,10,9]];rally.jumpNames=['Ravine crest'];
 Object.assign(rally.routes[0],{name:'Lower Ravine Bridge',rise:-8,jumps:[],width:6});
 Object.assign(rally.routes[1],{name:'Shaded Wash',rise:-3,jumps:[]});
 rally.hazards=rally.hazards.filter(h=>h.kind!=='tractor'&&h.name!=='Berm rock'&&h.name!=='Ridge marker tires');
 rally.hazards.push({name:'Loose sandstone fall',kind:'rockfall',f:.385,lane:3.8,radius:2.5,period:12,phase:3});
 // Narrow workshop follows the inside of the confectionery loop. Its entrances
 // no longer skip the whole first mountain/gumball sector.
 Object.assign(plans.candy.routes[0],{name:'Wafer Workshop',start:.12,end:.255,via:[[-188,164],[-181,226]],width:5.5,rise:0,jumps:[],exposed:[]});
 Object.assign(plans.candy.routes[1],{name:'Taffy Riverside',start:.555,end:.70,via:[[-278,-127],[-215,-147]],width:5.8,rise:0,jumps:[],exposed:[]});
 plans.candy.hazards=plans.candy.hazards.filter(h=>h.name!=='Wafer syrup');
 for(const h of plans.candy.hazards)if(h.route==='cane'){h.radius=Math.min(2.2,h.radius);h.lane=h.name.endsWith('A')?-2.3:2.3;}
 Object.assign(plans.toybox.routes[0],{name:'Open Storybook',rise:2,jumps:[],exposed:[]});
 plans.toybox.hazards=plans.toybox.hazards.filter(h=>h.name!=='Train carriage');
 const book=plans.toybox.hazards.find(h=>h.name==='Book seesaw');if(book){book.name='Bookend corner';book.kind='construction';book.lane=-3;book.radius=1.3;}
 Object.assign(plans.nyc.routes[1],{name:'Reservoir Path',jumps:[],exposed:[],rise:0});
 Object.assign(plans.dc.routes[1],{name:'Tidal Garden Walk',jumps:[],exposed:[],rise:0});
 Object.assign(plans.vegas.routes[1],{name:'Casino Service Lane',jumps:[],exposed:[],rise:0});
 // DC traffic and garden watering replace arbitrary repeated blocking rows.
 plans.dc.hazards=plans.dc.hazards.filter(h=>!['Parade chicane B','Final braking markers','Basin spray'].includes(h.name));
 for(const h of plans.dc.hazards){
  if(h.name==='Parade chicane A'){h.name='Downtown shuttle';h.kind='traffic';h.amplitude=15;h.lane=0;h.period=13;h.radius=2.5;}
  if(h.name==='Memorial terrace'){h.name='Memorial planter';h.lane=-5.5;h.radius=2;}
  if(h.name==='Mall sprinklers'){h.name='Garden watering';h.lane=-7.5;h.radius=2.5;}
  if(h.name==='White House chicane'){h.name='White House planters';h.lane=5.5;h.radius=2;}
 }
 const display=plans.vegas.hazards.find(h=>h.name==='Casino display');if(display){display.name='Casino service trolley';display.kind='traffic';display.amplitude=6;display.radius=1.6;}
 for(const h of plans.vegas.hazards)if(h.kind==='construction'){h.name=h.name==='Pyramid bend'?'Pyramid plaza planter':'Upper promenade planter';h.lane=Math.sign(h.lane)*7;h.radius=1.8;}
 const keeper=plans.barnyard.hazards.find(h=>h.name==='Keeper cart');if(keeper)keeper.radius=2.1;
}
