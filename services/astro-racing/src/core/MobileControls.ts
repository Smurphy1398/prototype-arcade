import {clamp} from './math';
import type {Input,DriveInput} from './Input';
export interface MobilePreferences {touch:'auto'|'on'|'off';steering:'buttons'|'tilt';autoAccelerate:boolean;sensitivity:number;deadZone:number;smoothing:number;graphics:'mobile'|'balanced'|'high';resolution:number}
const defaults=():MobilePreferences=>({touch:'auto',steering:'buttons',autoAccelerate:false,sensitivity:1.4,deadZone:3,smoothing:.16,graphics:matchMedia('(pointer: coarse)').matches?'mobile':'high',resolution:matchMedia('(pointer: coarse)').matches?.7:1});
export function tiltAngle(beta:number,gamma:number,orientation:number){const a=orientation*Math.PI/180;return gamma*Math.cos(a)+beta*Math.sin(a);}
export class MobileControls {
 prefs=defaults();private held=new Map<number,string>();private root:HTMLElement;private active=false;private suspended=false;
 private tiltEnabled=false;private tiltZero:number|null=null;private tiltRaw=0;private tiltSmooth=0;private lastAngle=0;private received=false;private permissionAttempt=0;
 constructor(private input:Input,private action:(a:string)=>void,private graphics:()=>void){
  try{const p=JSON.parse(localStorage.getItem('astro-mobile-v07')??'{}');for(const k of ['touch','steering','graphics'] as const)if((k==='touch'?['auto','on','off']:k==='steering'?['buttons','tilt']:['mobile','balanced','high']).includes(p[k]))(this.prefs as any)[k]=p[k];for(const [k,min,max] of [['sensitivity',.5,3],['deadZone',0,10],['smoothing',.04,.5],['resolution',.5,1.5]] as const)if(Number.isFinite(p[k]))this.prefs[k]=clamp(p[k],min,max);this.prefs.autoAccelerate=p.autoAccelerate===true;}catch{}
  this.root=document.createElement('div');this.root.id='touch-controls';this.root.className='hidden';
  const button=(key:string,label:string)=>`<button type="button" data-touch="${key}" aria-label="${label}">${label}</button>`;
  this.root.innerHTML=`<div class="touch-top">${button('pause','Pause')}${button('recover','Recover')}${button('recenter','Recenter')}${button('lookBehind','Look back')}</div><div class="touch-steering">${button('left','◀')}${button('right','▶')}${button('brake','Brake / reverse')}</div><div class="touch-actions">${button('item','Item')}${button('trick','Trick')}${button('drift','Drift')}${button('throttle','Drive')}</div>`;document.getElementById('app')!.append(this.root);
  this.root.addEventListener('contextmenu',e=>e.preventDefault());
  this.root.addEventListener('pointerdown',e=>{const b=(e.target as HTMLElement).closest<HTMLButtonElement>('[data-touch]');if(!b)return;e.preventDefault();b.setPointerCapture(e.pointerId);this.suspended=false;const key=b.dataset.touch!;this.held.set(e.pointerId,key);b.classList.add('held');this.input.device='touch';if(key==='item'||key==='trick')this.input.trigger(key);else if(key==='recenter')this.recenter();else if(key==='pause'||key==='recover')this.action(key);});
  const up=(e:PointerEvent)=>{this.held.delete(e.pointerId);this.root.querySelectorAll<HTMLElement>('[data-touch]').forEach(b=>b.classList.toggle('held',[...this.held.values()].includes(b.dataset.touch!)));};
  for(const event of ['pointerup','lostpointercapture'])this.root.addEventListener(event,up as EventListener);
  this.root.addEventListener('pointercancel',()=>this.input.clear());
  window.addEventListener('blur',()=>this.clear());document.addEventListener('visibilitychange',()=>{if(document.hidden)this.clear();});window.addEventListener('pagehide',()=>this.clear());
  window.addEventListener('resize',()=>{this.input.clear();this.recenter();this.lastAngle=this.orientation();this.sync();});
  window.addEventListener('deviceorientation',e=>{if(!this.tiltEnabled||e.beta===null||e.gamma===null)return;this.received=true;this.tiltRaw=tiltAngle(e.beta,e.gamma,this.orientation());if(this.tiltZero===null)this.tiltZero=this.tiltRaw;});
  this.settings();this.input.mobile=this;this.sync();
 }
 get visible(){return this.prefs.touch==='on'||this.prefs.touch==='auto'&&(matchMedia('(pointer: coarse)').matches||navigator.maxTouchPoints>0);}
 setActive(active:boolean){if(this.active!==active){this.clear();this.suspended=false;}this.active=active;this.sync();}
 clear(){this.held.clear();this.tiltSmooth=0;this.tiltZero=null;this.suspended=true;this.root.querySelectorAll('.held').forEach(b=>b.classList.remove('held'));}
 private orientation(){return screen.orientation?.angle??Number((window as any).orientation??0);}
 recenter(){this.tiltZero=null;this.tiltSmooth=0;}
 read():DriveInput {
  const has=(key:string)=>[...this.held.values()].includes(key);if(!this.active||!this.visible||this.suspended||document.hidden)return {throttle:0,brake:0,steer:0,drift:false};
  let steer=has('left')?-1:has('right')?1:0;
  if(this.prefs.steering==='tilt'&&this.tiltEnabled&&this.received&&!steer){const delta=this.tiltRaw-(this.tiltZero??this.tiltRaw);const target=clamp(Math.sign(delta)*Math.max(0,Math.abs(delta)-this.prefs.deadZone)/25*this.prefs.sensitivity,-1,1);this.tiltSmooth+=(target-this.tiltSmooth)*this.prefs.smoothing;steer=this.tiltSmooth;}
  return {throttle:has('brake')?0:has('throttle')||this.prefs.autoAccelerate?1:0,brake:has('brake')?1:0,steer,drift:has('drift'),lookBehind:has('lookBehind')};
 }
 private save(){try{localStorage.setItem('astro-mobile-v07',JSON.stringify(this.prefs));}catch{}this.sync();}
 private sync(){this.root.classList.toggle('hidden',!this.visible||!this.active);document.body.classList.toggle('touch-layout',this.visible);this.root.querySelector<HTMLElement>('[data-touch=recenter]')!.hidden=this.prefs.steering!=='tilt';}
 private message(text:string){document.getElementById('tilt-status')!.textContent=text;}
 async enableTilt(){
  const attempt=++this.permissionAttempt,D=window.DeviceOrientationEvent as typeof DeviceOrientationEvent&{requestPermission?:()=>Promise<string>};
  if(!window.isSecureContext||!D){this.fallback('Tilt needs a supported sensor and HTTPS. Buttons are ready.');return;}
  try{if(D.requestPermission&&await D.requestPermission()!=='granted'){this.fallback('Tilt permission denied. Buttons are ready.');return;}if(attempt!==this.permissionAttempt)return;
   this.tiltEnabled=true;this.received=false;this.recenter();this.prefs.steering='tilt';this.save();this.message('Hold the device comfortably; tilt to steer. Recenter any time.');(document.getElementById('mobile-steering') as HTMLSelectElement).value='tilt';
   window.setTimeout(()=>{if(attempt===this.permissionAttempt&&!this.received)this.fallback('No orientation sensor data received. Buttons are ready.');},2500);
  }catch{this.fallback('Tilt is unavailable. Buttons are ready.');}
 }
 private fallback(message:string){this.tiltEnabled=false;this.prefs.steering='buttons';this.save();(document.getElementById('mobile-steering') as HTMLSelectElement).value='buttons';this.message(message);}
 private settings(){
  const section=document.createElement('section');section.className='mobile-settings';
  const select=(id:string,label:string,values:string[],value:string)=>`<label>${label}<select id="mobile-${id}">${values.map(v=>`<option value="${v}" ${v===value?'selected':''}>${v[0].toUpperCase()+v.slice(1)}</option>`).join('')}</select></label>`;
  section.innerHTML=`<h3>Phone & tablet</h3>${select('touch','Touch controls',['auto','on','off'],this.prefs.touch)}${select('steering','Steering',['buttons','tilt'],this.prefs.steering)}<label><input id="mobile-auto" type="checkbox" ${this.prefs.autoAccelerate?'checked':''}> Auto-accelerate (brake overrides)</label><div><button id="tilt-enable" class="back-button">Enable Tilt</button><button id="tilt-recenter" class="back-button">Recenter</button></div><p id="tilt-status" role="status">Tilt starts only after Enable Tilt. Buttons always remain available.</p><label>Sensitivity<input id="mobile-sensitivity" type="range" min=".5" max="3" step=".1" value="${this.prefs.sensitivity}"></label><label>Dead zone<input id="mobile-deadZone" type="range" min="0" max="10" step="1" value="${this.prefs.deadZone}"></label><label>Response smoothing<input id="mobile-smoothing" type="range" min=".04" max=".5" step=".02" value="${this.prefs.smoothing}"></label><h3>Graphics</h3>${select('graphics','Preset',['mobile','balanced','high'],this.prefs.graphics)}<label>Resolution scale<input id="mobile-resolution" type="range" min=".5" max="1.5" step=".1" value="${this.prefs.resolution}"></label><p>Mobile reduces resolution and distant decoration. Hazards stay active and visible.</p>`;
  document.querySelector('.settings-body')!.prepend(section);
  for(const key of ['touch','steering','graphics','sensitivity','deadZone','smoothing','resolution'] as const){document.getElementById('mobile-'+key)!.addEventListener('change',e=>{const value=(e.target as HTMLInputElement).value;(this.prefs as any)[key]=['touch','steering','graphics'].includes(key)?value:Number(value);if(key==='steering'&&value==='tilt'&&!this.tiltEnabled)this.message('Tap Enable Tilt to grant sensor access. Buttons work until then.');if(key==='graphics'){this.prefs.resolution=value==='mobile'?.7:value==='balanced'?.9:1;(document.getElementById('mobile-resolution') as HTMLInputElement).value=String(this.prefs.resolution);}this.clear();this.suspended=false;this.save();this.graphics();});}
  document.getElementById('mobile-auto')!.addEventListener('change',e=>{this.prefs.autoAccelerate=(e.target as HTMLInputElement).checked;this.save();});
  document.getElementById('tilt-enable')!.addEventListener('click',()=>void this.enableTilt());document.getElementById('tilt-recenter')!.addEventListener('click',()=>{this.recenter();this.message('Centered. Hold your comfortable driving position.');});
 }
}
