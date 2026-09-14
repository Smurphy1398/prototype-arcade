import * as T from 'three';import {SceneKit} from './SceneKit';import {DestinationTrack} from './track';import type {RaceSimulation} from '../../race/RaceSimulation';
export class EncounterView extends SceneKit {
 private models=new Map<string,{g:T.Group;zone:T.Mesh;spin?:T.Object3D}>();
 constructor(track:DestinationTrack,scene:T.Scene){super(track,scene);
  for(const h of track.hazards){const g=this.group(0,0,0,this.moving,h.id);let spin:T.Object3D|undefined;const p=track.at(h.s,h.route);g.rotation.y=Math.atan2(p.tx,p.tz);
   if(h.kind==='anchor'){this.rod(0x91a9ac,[0,1,0],[0,9,0],.5,g);this.rod(0x91a9ac,[-3,7,0],[3,7,0],.4,g);const hook=this.mesh(new T.TorusGeometry(3,.5,6,16,Math.PI),0x8ba3a8,0,3,0,g);hook.rotation.z=Math.PI;for(const side of [-1,1])this.cone(0xb8cdca,side*3,2,0,.85,2,g);for(let n=0;n<10;n++){const link=this.ring(0x719498,0,10+n*1.5,0,.65,.15,g);if(n%2)link.rotation.y=Math.PI/2;}}
   else if(h.kind==='traffic')this.car(g,track.id==='vegas'?0xd8d9ea:0xf7c34f);
   else if(h.kind==='toytrain')this.train(g);
   else if(h.kind==='robot')this.robot(g);
   else if(h.kind==='tractor'){this.box(0x71975c,0,1.7,0,4,2,3,g);this.box(0xdda94d,1,3,0,2,2,2.8,g);this.wheels(g,1.5,1.6,1);this.box(0xa67748,6,1.6,0,5,2,3,g);this.wheels(this.group(6,0,0,g),1.5,1.5,.7);}
   else if(h.kind==='animal')this.animal(g,h.id.toLowerCase().includes('sheep')?'sheep':'cow',.9);
   else if(h.kind==='marble'||h.kind==='roller'||h.kind==='ball'||h.kind==='hay'){const c=h.kind==='hay'?0xe4ba60:h.kind==='roller'?0xe78d9d:h.kind==='ball'?0xf0be64:0x71bbcb;spin=this.group(0,h.radius,0,g);this.ball(c,0,0,0,h.radius,spin);this.ring(0xffe8b6,0,0,0,h.radius,.14,spin).rotation.x=.8;this.ring(0x877caf,0,0,0,h.radius,.12,spin).rotation.y=.8;}
   else if(h.kind==='press'||h.kind==='gate'||h.kind==='door'){this.box(track.id==='candy'?0xc89465:0x81a9ac,0,2,0,h.radius*2,4,2,g);for(const side of [-1,1]){const post=this.place(h.s/track.length,side*((track.routes.find(b=>b.id===h.route)?.halfWidth??track.halfWidth)+3),h.route);this.box(0x587a84,0,10,0,1,20,1,post);}if(h.kind==='press')this.box(0xe9ae95,0,4,0,h.radius*2.5,1,3,g);}
   else if(h.kind==='fountain'||h.kind==='steam'||h.kind==='current'){for(let n=0;n<5;n++){const jet=this.cyl(h.kind==='steam'?0xe4ddc9:0x83dce0,(n-2)*h.radius*.4,3,0,.35,6,g,.12,6);if(h.kind==='current')jet.rotation.z=.8;}}
   else if(h.kind==='syrup'){this.ball(0x9c663c,0,.05,0,h.radius,g,1,.06,1);}
   else if(h.kind==='jellyfish'){this.mesh(new T.SphereGeometry(h.radius,12,8,0,Math.PI*2,0,Math.PI/2),this.mat(0xde93d4,true),0,3,0,g);for(let n=0;n<6;n++)this.cyl(0xf3c2d9,Math.sin(n)*h.radius*.7,1.5,Math.cos(n)*h.radius*.7,.07,3,g);}
   else {this.box(0xe1b360,0,1,0,h.radius*2,2,1.5,g);for(const x of [-h.radius,h.radius])this.box(0x50626f,x,1,0,.3,2.4,2,g);}
   const zone=this.ring(0xf9d17f,p.x,(p.y??0)+.12,p.z,h.radius+.75,.13,this.moving);zone.rotation.x=Math.PI/2;this.models.set(h.id,{g,zone,spin});
   // A fixed approach marker stays visible while the hazard is out of the lane.
   const sign=this.place((h.s-48)/track.length,-(track.halfWidth+6),h.route);this.cyl(0x587579,0,2,0,.15,4,sign);this.label(h.id,sign,10,4.8);
  }
  this.finish();
 }
 render(race:RaceSimulation){for(const h of race.mechanics.dynamicHazards){const model=this.models.get(h.id);if(!model)continue;const {g,zone,spin}=model,p=this.track.at(this.track.hazards.find(d=>d.id===h.id)!.s,this.track.hazards.find(d=>d.id===h.id)!.route);
   g.position.set(h.x,h.y,h.z);g.visible=h.active||h.warning||['anchor','gate','press','door'].includes(h.kind);zone.position.set(h.x,(p.y??0)+.12,h.z);(zone.material as T.MeshStandardMaterial).color.setHex(h.active?0xeb9b73:h.warning?0xffd76e:0x80baa4);
   if(spin){spin.rotation.x=race.elapsed*3;}
  }}
}
