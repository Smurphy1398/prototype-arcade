import * as THREE from 'three';
import { DRIVERS,BODIES,TIRES,PAINTS,DECALS,handling,saveGarage,type GarageSelection } from '../content/garage';
import { KartView } from '../vehicle/KartView';
import { KartPhysics } from '../vehicle/KartPhysics';
import { CoastTrack } from '../tracks/sunspun/track';
import { RACERS } from '../content/racers';
import { portrait } from './portraits';
import { loadProfile,cleanName } from '../content/profile';
export class Garage {
  readonly scene=new THREE.Scene();
  readonly camera=new THREE.PerspectiveCamera(38,1,.1,100);
  private view:KartView;
  private physics=new KartPhysics(new CoastTrack());
  private root:HTMLElement;
  private preview:HTMLElement;
  private yaw=.65;
  private zoom=8;
  private dragging=false;
  private revUntil=0;
  private clock=0;
  constructor(public selection:GarageSelection,private onChange:(s:GarageSelection)=>void,onAction:(s:string)=>void){
    const group=(label:string,key:keyof GarageSelection,catalog:Record<string,{name:string}>)=>`<fieldset data-category="${key}"><legend>${label}</legend><div class="garage-options">${Object.entries(catalog).map(([id,c])=>`<button data-part="${key}" data-choice="${id}" aria-pressed="false">${key==='driver'?portrait(id as GarageSelection['driver']):''}${key==='paint'?`<i style="background:#${PAINTS[id as keyof typeof PAINTS].color.toString(16).padStart(6,'0')}"></i>`:''}${c.name}</button>`).join('')}</div></fieldset>`;
    document.getElementById('ui')!.insertAdjacentHTML('beforeend',`<section id="garage" class="garage hidden"><div class="garage-top"><span class="eyebrow">SUN CLUB / CUSTOM WORKSHOP</span><button id="garage-back" class="text-button">← BACK</button><button id="garage-race" class="primary">CONTINUE →</button></div><div class="garage-panel"><h2>Your ride.<br>Your kind of strange.</h2><p class="garage-intro">Twelve personalities. Nine rides. Your racing signature.</p><label class="name-field">YOUR DISPLAY NAME <input id="display-name" maxlength="20" placeholder="Use driver name" autocomplete="off"><small>Local name · independent of your driver</small></label><nav class="garage-tabs" aria-label="Garage categories">${['Driver','Vehicle','Wheels','Style'].map((t,i)=>`<button data-category-tab="${['driver','body','tires','style'][i]}" aria-pressed="${i===0}">${t}</button>`).join('')}</nav>${group('01 / DRIVER · COSMETIC','driver',DRIVERS)}${group('02 / RIDE · SIX KARTS + THREE BIKES','body',BODIES)}${group('03 / TIRES','tires',TIRES)}${group('04 / PAINT · COSMETIC','paint',PAINTS)}${group('05 / DECAL · COSMETIC','decal',DECALS)}<fieldset data-category="colors"><legend>06 / INDEPENDENT COLORS</legend><label>PRIMARY <input id="paint-primary" type="color" value="#0e9e9b"></label><label>SECONDARY <input id="paint-secondary" type="color" value="#ffefc7"></label><small>Choose any color. Paint presets change Primary; Secondary stays yours.</small></fieldset><p id="garage-saved" role="status"></p></div><div class="garage-stage"><div id="garage-preview" aria-label="3D kart preview. Drag to rotate, scroll to zoom." tabindex="0"></div><div class="garage-caption"><span id="garage-personality"></span><h3 id="garage-title"></h3><p id="garage-tradeoff"></p><div id="garage-stats"></div><p id="garage-engine"></p><div class="garage-tools"><button id="garage-left" aria-label="Rotate preview left">↶</button><span>DRAG TO TURN · SCROLL TO ZOOM</span><button id="garage-right" aria-label="Rotate preview right">↷</button><button id="garage-rev">HEAR ENGINE</button></div></div></div></section>`);
    const name=document.getElementById('display-name') as HTMLInputElement;name.value=loadProfile().displayName;name.addEventListener('change',()=>{name.value=cleanName(name.value);onAction(`name:${name.value}`);});
    this.root=document.getElementById('garage')!;this.preview=document.getElementById('garage-preview')!;
    this.scene.background=new THREE.Color(0x164a53);this.scene.add(new THREE.HemisphereLight(0xd6fff5,0x39524b,3));const light=new THREE.DirectionalLight(0xffe3b0,4);light.position.set(4,8,6);this.scene.add(light);const rim=new THREE.DirectionalLight(0x82daf9,3);rim.position.set(-5,4,-5);this.scene.add(rim);const warm=new THREE.PointLight(0xffb88a,28,15);warm.position.set(2,4,1);this.scene.add(warm);
    const stage=new THREE.Mesh(new THREE.CylinderGeometry(2.8,3,.25,48),new THREE.MeshStandardMaterial({color:0x467e7d,roughness:.8}));stage.position.y=-.14;this.scene.add(stage);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(2.82,.035,6,64),new THREE.MeshBasicMaterial({color:0xe6ca8b}));ring.rotation.x=Math.PI/2;ring.position.y=.02;this.scene.add(ring);for(let i=0;i<12;i++){const marker=new THREE.Mesh(new THREE.BoxGeometry(.08,.025,.3),new THREE.MeshBasicMaterial({color:i%3===0?0xffc976:0x91dacc}));marker.position.set(Math.sin(i*Math.PI/6)*2.6,.005,Math.cos(i*Math.PI/6)*2.6);marker.rotation.y=i*Math.PI/6;this.scene.add(marker);}
    this.physics.reset(0);Object.assign(this.physics.state,{x:0,y:0,z:0,heading:0});this.view=this.makeView();this.refresh();
    for(const button of this.root.querySelectorAll<HTMLButtonElement>('[data-choice]'))button.addEventListener('click',()=>{const key=button.dataset.part as keyof GarageSelection;this.selection={...this.selection,[key]:button.dataset.choice,...(key==='paint'?{primary:undefined}:{})};this.view.dispose();this.view=this.makeView();this.refresh();const saved=saveGarage(this.selection);document.getElementById('garage-saved')!.textContent=saved?'✓ SAVED · READY FOR THE NEXT GRID':'Selected for this session · local saving unavailable';this.onChange(this.selection);});
    for(const key of ['primary','secondary'] as const)(document.getElementById('paint-'+key) as HTMLInputElement).addEventListener('input',e=>{this.selection={...this.selection,[key]:(e.target as HTMLInputElement).value};this.view.dispose();this.view=this.makeView();saveGarage(this.selection);this.onChange(this.selection);this.refresh();});
    const selectTab=(tab:string)=>{for(const f of this.root.querySelectorAll<HTMLElement>('[data-category]'))f.classList.toggle('hidden',tab==='style'?!['paint','decal','colors'].includes(f.dataset.category!):f.dataset.category!==tab);for(const b of this.root.querySelectorAll('[data-category-tab]'))b.setAttribute('aria-pressed',String((b as HTMLElement).dataset.categoryTab===tab));};
    for(const b of this.root.querySelectorAll<HTMLButtonElement>('[data-category-tab]'))b.addEventListener('click',()=>selectTab(b.dataset.categoryTab!));selectTab('driver');
    document.getElementById('garage-back')!.addEventListener('click',()=>onAction('back'));
    document.getElementById('garage-race')!.addEventListener('click',()=>onAction('destinations'));
    document.getElementById('garage-left')!.addEventListener('click',()=>this.yaw-=.45);document.getElementById('garage-right')!.addEventListener('click',()=>this.yaw+=.45);
    document.getElementById('garage-rev')!.addEventListener('click',()=>{this.revUntil=this.clock+2;onAction('preview-engine');});
    this.preview.addEventListener('pointerdown',e=>{this.dragging=true;this.preview.setPointerCapture(e.pointerId);});
    this.preview.addEventListener('pointermove',e=>{if(this.dragging)this.yaw-=e.movementX*.009;});
    this.preview.addEventListener('pointerup',()=>this.dragging=false);this.preview.addEventListener('pointercancel',()=>this.dragging=false);
    this.preview.addEventListener('wheel',e=>{e.preventDefault();this.zoom=THREE.MathUtils.clamp(this.zoom+e.deltaY*.005,5.5,11);},{passive:false});
    this.preview.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')this.yaw-=.15;if(e.key==='ArrowRight')this.yaw+=.15;});
  }
  private makeView(){const d=DRIVERS[this.selection.driver];return new KartView(this.scene,{...RACERS[0],name:d.name,skin:d.skin,accent:d.accent,color:PAINTS[this.selection.paint].color},this.selection);}
  private refresh(){(document.getElementById('paint-primary') as HTMLInputElement).value=this.selection.primary??'#'+PAINTS[this.selection.paint].color.toString(16).padStart(6,'0');(document.getElementById('paint-secondary') as HTMLInputElement).value=this.selection.secondary??'#ffefc7';const s=this.selection,b=BODIES[s.body],t=TIRES[s.tires],h=handling(s);this.physics.setup=h;
    for(const button of this.root.querySelectorAll<HTMLButtonElement>('[data-choice]'))button.setAttribute('aria-pressed',String(s[button.dataset.part as keyof GarageSelection]===button.dataset.choice));
    document.getElementById('garage-personality')!.textContent=DRIVERS[s.driver].tag;
    document.getElementById('garage-title')!.textContent=`${DRIVERS[s.driver].name} / ${b.name}`;
    document.getElementById('garage-tradeoff')!.textContent=`${b.tag}. ${t.tag}.`;
    document.getElementById('garage-engine')!.textContent=b.engine;
    document.getElementById('garage-stats')!.innerHTML=[['TOP SPEED',`${Math.round(h.topSpeed*3.6)} km/h`,h.topSpeed/38],['LAUNCH',h.acceleration>21?'Quick':h.acceleration<18?'Measured':'Balanced',h.acceleration/25],['TURNING',h.steering>1.05?'Nimble':h.steering<.96?'Wide':'Balanced',h.steering/1.2],['GRIP',h.grip>11?'Planted':h.grip<9?'Playful':'Balanced',h.grip/14]].map(([name,value,f])=>`<div><span>${name}</span><b>${value}</b><i><em style="width:${Number(f)*100}%"></em></i></div>`).join('');
  }
  show(visible:boolean){this.root.classList.toggle('hidden',!visible);if(!visible)this.revUntil=0;}
  get state(){return this.physics.state;}
  get throttle(){return this.clock<this.revUntil?1:0;}
  render(renderer:THREE.WebGLRenderer,time:number,dt:number){this.clock=time;const rect=this.preview.getBoundingClientRect();if(rect.width<1||rect.height<1)return;
    const k=this.physics.state;k.speed=this.throttle?15+Math.sin(time*3)*10:0;k.steer=Math.sin(time*.6)*.16;
    this.view.update(k,k,1,dt,time);this.camera.aspect=rect.width/rect.height;this.camera.position.set(Math.sin(this.yaw)*this.zoom,3.6,Math.cos(this.yaw)*this.zoom);this.camera.lookAt(0,1.12,0);this.camera.updateProjectionMatrix();
    renderer.setScissorTest(false);renderer.setViewport(0,0,innerWidth,innerHeight);renderer.setClearColor(0x164a53);renderer.clear();
    renderer.setViewport(rect.left,innerHeight-rect.bottom,rect.width,rect.height);renderer.setScissor(rect.left,innerHeight-rect.bottom,rect.width,rect.height);renderer.setScissorTest(true);renderer.render(this.scene,this.camera);renderer.setScissorTest(false);renderer.setViewport(0,0,innerWidth,innerHeight);
  }
}
