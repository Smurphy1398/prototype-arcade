import {clamp} from './math';
import {neutralInput,type Input,type DriveInput} from './Input';
import {tiltAngle,tiltTarget,smoothTilt} from './mobileSteering';
export {tiltAngle} from './mobileSteering';

export interface MobilePreferences {
  touch:'auto'|'on'|'off';steering:'buttons'|'tilt';autoAccelerate:boolean;
  sensitivity:number;deadZone:number;smoothing:number;
  graphics:'mobile'|'balanced'|'high';resolution:number;setupDone:boolean;
}
const defaults=():MobilePreferences=>({touch:'auto',steering:'tilt',autoAccelerate:true,
  sensitivity:1.4,deadZone:3,smoothing:.14,graphics:matchMedia('(pointer: coarse)').matches?'mobile':'high',
  resolution:matchMedia('(pointer: coarse)').matches?.7:1,setupDone:false});

export class MobileControls {
  prefs=defaults();
  private held=new Map<number,string>();
  private driftOrigin=new Map<number,number>();
  private driftSteer=0;
  private driftArmed=false;
  private root:HTMLElement;
  private sheet:HTMLDialogElement;
  private active=false;
  private suspended=false;
  private tiltEnabled=false;
  private received=false;
  private tiltZero:number|null=null;
  private tiltRaw=0;
  private tiltSmooth=0;
  private lastRead=performance.now();
  private permissionAttempt=0;
  private lastOrientation=this.orientation();
  private lastLandscape=this.landscape;
  private accepted:(()=>void)|undefined;
  private status='Tilt is recommended. Hold your phone in landscape, then enable it. Touch steering is also available.';

  constructor(private input:Input,private action:(a:string)=>void,private graphics:()=>void){
    try{
      const saved=localStorage.getItem('astro-mobile-v10');
      const p=JSON.parse(saved??localStorage.getItem('astro-mobile-v07')??'{}');
      for(const k of ['touch','graphics'] as const)if((k==='touch'?['auto','on','off']:['mobile','balanced','high']).includes(p[k]))(this.prefs as any)[k]=p[k];
      for(const [k,min,max] of [['sensitivity',.5,3],['deadZone',0,10],['smoothing',.04,.4],['resolution',.5,1.5]] as const)if(Number.isFinite(p[k]))this.prefs[k]=clamp(p[k],min,max);
      // Introduce the new defaults once; all choices made in this release persist.
      if(saved){if(['tilt','buttons'].includes(p.steering))this.prefs.steering=p.steering;
        this.prefs.autoAccelerate=p.autoAccelerate!==false;this.prefs.setupDone=p.setupDone===true;}
    }catch{}
    this.root=document.createElement('div');this.root.id='touch-controls';this.root.className='hidden';
    const button=(key:string,label:string)=>`<button type="button" data-touch="${key}" aria-label="${label}">${label}</button>`;
    this.root.innerHTML=`<div class="touch-top">${button('mobile-controls','Controls')}${button('pause','Pause')}</div>
      <div class="touch-steering"><div class="touch-arrows">${button('left','◀')}${button('right','▶')}</div>
      <div class="touch-assist">${button('brake','Brake / reverse')}${button('recenter','Center')}</div>${button('drift','Drift')}</div>
      <div class="touch-actions">${button('trick','Trick')}${button('item','Item')}${button('throttle','Drive')}</div>
      <div class="touch-notice" role="status"><span></span><button type="button" id="touch-resume">Resume controls</button></div>`;
    document.getElementById('app')!.append(this.root);
    this.sheet=document.createElement('dialog');this.sheet.id='mobile-control-sheet';
    this.sheet.setAttribute('aria-labelledby','mobile-controls-title');
    this.sheet.innerHTML=`<header><h2 id="mobile-controls-title">Make yourself comfortable</h2><button type="button" id="mobile-close" aria-label="Close controls">×</button></header>
      <p class="mobile-explainer">Drift with your left thumb. Items and tricks on your right. Auto-drive keeps you moving; brake always overrides it.</p>
      <div class="mobile-mode"><button type="button" id="tilt-enable">Enable Tilt</button><button type="button" id="touch-enable">Touch steering</button><button type="button" id="tilt-recenter">Recenter</button></div>
      <p id="tilt-status" role="status" aria-live="polite"></p>
      <label class="mobile-auto-label"><input id="mobile-auto" type="checkbox"> Auto-accelerate <small>Turn off to show Drive</small></label>
      <details><summary>Tilt tuning</summary><div class="mobile-tuning">
      <label>Sensitivity <output id="sensitivity-value"></output><input id="mobile-sensitivity" type="range" min=".5" max="3" step=".1"></label>
      <label>Dead zone <output id="deadZone-value"></output><input id="mobile-deadZone" type="range" min="0" max="10" step="1"></label>
      <label>Smoothing <output id="smoothing-value"></output><input id="mobile-smoothing" type="range" min=".04" max=".4" step=".02"></label>
      </div></details><div class="mobile-sheet-footer"><button type="button" id="mobile-recover">Return kart to road</button><button type="button" id="mobile-done">Ready to race</button></div>`;
    document.getElementById('app')!.append(this.sheet);
    this.sheet.addEventListener('keydown',e=>e.stopPropagation());
    this.sheet.addEventListener('cancel',()=>this.cancelSetup());
    this.sheet.querySelector('#mobile-close')!.addEventListener('click',()=>this.cancelSetup());
    this.sheet.querySelector('#mobile-done')!.addEventListener('click',()=>this.finishSetup());
    this.sheet.querySelector('#mobile-recover')!.addEventListener('click',()=>{if(this.finishSetup())this.action('recover');});
    this.sheet.querySelector('#tilt-enable')!.addEventListener('click',()=>void this.enableTilt());
    this.sheet.querySelector('#touch-enable')!.addEventListener('click',()=>this.fallback('Touch steering ready. Hold an arrow to turn. For corners, hold Drift and slide sideways to steer with one thumb.'));
    this.sheet.querySelector('#tilt-recenter')!.addEventListener('click',()=>{this.recenter();this.message('Centered. Hold this comfortable landscape position, then tilt to turn.');});
    this.sheet.querySelector('#mobile-auto')!.addEventListener('change',e=>{this.prefs.autoAccelerate=(e.target as HTMLInputElement).checked;this.save();});
    for(const key of ['sensitivity','deadZone','smoothing'] as const){this.sheet.querySelector('#mobile-'+key)!.addEventListener('input',e=>{this.prefs[key]=Number((e.target as HTMLInputElement).value);this.save();});}
    this.root.addEventListener('contextmenu',e=>e.preventDefault());
    this.root.addEventListener('pointerdown',e=>{
      const b=(e.target as HTMLElement).closest<HTMLButtonElement>('[data-touch]');if(!b)return;
      e.preventDefault();const key=b.dataset.touch!;
      if(key==='pause'||key==='mobile-controls'){this.action(key);return;}
      if(key==='recenter'){this.recenter();return;}
      if(this.suspended||!this.canDrive)return;
      b.setPointerCapture(e.pointerId);this.held.set(e.pointerId,key);b.classList.add('held');this.input.device='touch';
      if(key==='drift'){this.driftOrigin.set(e.pointerId,e.clientX);this.driftSteer=0;this.driftArmed=false;}
      if(key==='item'||key==='trick')this.input.trigger(key);
    });
    this.root.addEventListener('pointermove',e=>{const start=this.driftOrigin.get(e.pointerId);if(start!==undefined&&!this.usingTilt)this.driftSteer=clamp((e.clientX-start)/40,-1,1);});
    this.root.addEventListener('pointerup',e=>{this.held.delete(e.pointerId);if(this.driftOrigin.delete(e.pointerId))this.driftSteer=0;this.syncHeld();});
    // An unexpected cancellation releases every action, including auto-drive, until an explicit resume.
    this.root.addEventListener('lostpointercapture',e=>{if(this.held.has(e.pointerId))this.interrupt();});
    this.root.addEventListener('pointercancel',()=>this.interrupt());
    this.root.querySelector('#touch-resume')!.addEventListener('click',()=>{if(this.canDrive){this.recenter();this.suspended=false;this.sync();}else this.action('mobile-controls');});
    window.addEventListener('blur',()=>this.clear());
    document.addEventListener('visibilitychange',()=>{if(document.hidden)this.clear();});
    window.addEventListener('pagehide',()=>this.interrupt());
    const rotation=()=>{
      const angle=this.orientation(),landscape=this.landscape;
      if(angle!==this.lastOrientation||landscape!==this.lastLandscape){
        this.lastOrientation=angle;this.lastLandscape=landscape;this.recenter(true);
        if(this.active)this.interrupt();
      }
      this.sync();
    };
    window.addEventListener('resize',rotation);screen.orientation?.addEventListener('change',rotation);
    window.addEventListener('orientationchange',rotation);
    window.addEventListener('deviceorientation',e=>{
      if(!this.tiltEnabled||!Number.isFinite(e.beta)||!Number.isFinite(e.gamma)||e.beta===null||e.gamma===null)return;
      const first=!this.received;this.received=true;this.tiltRaw=tiltAngle(e.beta,e.gamma,this.orientation());
      if(this.tiltZero===null)this.tiltZero=this.tiltRaw;
      if(first)this.message('Tilt ready. Centered at your current position. Recenter whenever you change your grip.');
    });
    this.settings();this.input.mobile=this;if(this.visible)this.input.device='touch';this.sync();
  }
  get visible(){return this.prefs.touch==='on'||this.prefs.touch==='auto'&&(matchMedia('(pointer: coarse)').matches||navigator.maxTouchPoints>0);}
  get usingTilt(){return this.prefs.steering==='tilt'&&this.tiltEnabled&&this.received;}
  get needsSetup(){return this.visible&&(!this.prefs.setupDone||this.prefs.steering==='tilt'&&!this.usingTilt);}
  private get landscape(){return innerWidth>innerHeight;}
  private get canDrive(){return this.prefs.steering==='buttons'||this.usingTilt&&this.landscape;}
  private orientation(){return screen.orientation?.angle??Number((window as any).orientation??0);}
  setActive(active:boolean){
    if(this.active!==active){this.clear();this.suspended=false;this.recenter(true);}
    this.active=active;if(active&&this.visible)this.input.device='touch';this.sync();
  }
  clear(){this.held.clear();this.driftOrigin.clear();this.driftSteer=0;this.driftArmed=false;this.tiltSmooth=0;this.suspended=true;this.syncHeld();this.sync();}
  private interrupt(){this.input.clear();if(this.active)this.action('blur');this.sync();}
  recenter(fresh=false){this.tiltZero=fresh||!this.received?null:this.tiltRaw;this.tiltSmooth=0;this.lastRead=performance.now();}
  read():DriveInput{
    const now=performance.now(),dt=Math.min(.1,(now-this.lastRead)/1000);this.lastRead=now;
    if(!this.active||!this.visible||this.suspended||document.hidden||this.sheet.open||!this.canDrive)return neutralInput();
    const has=(key:string)=>[...this.held.values()].includes(key);
    let steer=Number(has('right'))-Number(has('left'))||this.driftSteer;
    if(this.usingTilt){this.tiltSmooth=smoothTilt(this.tiltSmooth,tiltTarget(this.tiltRaw,this.tiltZero??this.tiltRaw,this.prefs.deadZone,this.prefs.sensitivity),dt,this.prefs.smoothing);steer=this.tiltSmooth;}
    // Physics starts a drift on the press edge. Defer that edge until the thumb/tilt has turned.
    if(has('drift')&&Math.abs(steer)>.2)this.driftArmed=true;
    return {throttle:has('brake')?0:this.prefs.autoAccelerate||has('throttle')?1:0,brake:has('brake')?1:0,steer,drift:has('drift')&&this.driftArmed};
  }
  openSetup(accepted?:()=>void,recover=false){
    this.input.clear();this.accepted=accepted;
    this.sheet.querySelector<HTMLButtonElement>('#mobile-recover')!.hidden=!recover;
    this.sheet.querySelector('#mobile-done')!.textContent=accepted?'Ready to race':'Done';
    this.sync();if(!this.sheet.open)this.sheet.showModal();
  }
  private cancelSetup(){this.accepted=undefined;this.permissionAttempt++;this.sheet.close();}
  private finishSetup(){
    if(!this.canDrive)return false;
    this.prefs.setupDone=true;this.save();this.sheet.close();const done=this.accepted;this.accepted=undefined;
    this.recenter();this.suspended=false;done?.();this.sync();return true;
  }
  private save(){try{localStorage.setItem('astro-mobile-v10',JSON.stringify(this.prefs));}catch{}this.sync();}
  private syncHeld(){this.root.querySelectorAll<HTMLElement>('[data-touch]').forEach(b=>b.classList.toggle('held',[...this.held.values()].includes(b.dataset.touch!)));}
  private sync(){
    if(!this.root||!this.sheet)return;
    this.root.classList.toggle('hidden',!this.visible||!this.active);
    document.body.classList.toggle('touch-layout',this.visible);document.body.classList.toggle('tilt-driving',this.usingTilt);
    this.root.querySelector<HTMLElement>('.touch-arrows')!.hidden=this.usingTilt;
    this.root.querySelector<HTMLElement>('[data-touch=recenter]')!.hidden=!this.usingTilt;
    this.root.querySelector<HTMLElement>('[data-touch=throttle]')!.hidden=this.prefs.autoAccelerate;
    const notice=this.root.querySelector<HTMLElement>('.touch-notice')!;
    notice.hidden=!this.suspended&&this.canDrive;
    notice.querySelector('span')!.textContent=!this.canDrive?this.usingTilt?'Rotate to landscape, then resume.':'Choose Enable Tilt or Touch steering in Controls.':'Controls released.';
    this.sheet.querySelector('#tilt-status')!.textContent=this.usingTilt&&!this.landscape?'Rotate to landscape to center tilt and continue.':this.status;
    this.sheet.querySelector<HTMLButtonElement>('#mobile-done')!.disabled=!this.canDrive;
    this.sheet.querySelector<HTMLButtonElement>('#mobile-recover')!.disabled=!this.canDrive;
    this.sheet.querySelector<HTMLButtonElement>('#tilt-recenter')!.disabled=!this.usingTilt||!this.landscape;
    this.sheet.querySelector('#tilt-enable')!.setAttribute('aria-pressed',String(this.prefs.steering==='tilt'));
    this.sheet.querySelector('#tilt-enable')!.textContent=this.usingTilt?'Tilt enabled':'Enable Tilt';
    this.sheet.querySelector('#touch-enable')!.setAttribute('aria-pressed',String(this.prefs.steering==='buttons'));
    this.sheet.querySelector<HTMLInputElement>('#mobile-auto')!.checked=this.prefs.autoAccelerate;
    for(const key of ['sensitivity','deadZone','smoothing'] as const){
      this.sheet.querySelector<HTMLInputElement>('#mobile-'+key)!.value=String(this.prefs[key]);
      this.sheet.querySelector('#'+key+'-value')!.textContent=key==='deadZone'?`${this.prefs[key]}°`:key==='smoothing'?`${Math.round(this.prefs[key]*1000)} ms`:`${this.prefs[key].toFixed(1)}×`;
    }
  }
  private message(message:string){this.status=message;this.sync();}
  async enableTilt(){
    const attempt=++this.permissionAttempt,D=window.DeviceOrientationEvent as typeof DeviceOrientationEvent&{requestPermission?:()=>Promise<string>};
    if(!window.isSecureContext||!D){this.fallback('Tilt is unavailable in this browser. Touch steering is ready.');return;}
    this.message('Waiting for sensor permission. Keep your phone in a comfortable landscape position.');
    try{
      // Invoke inside the button gesture, before any asynchronous work (required on iOS).
      const permission=D.requestPermission?await D.requestPermission():'granted';
      if(attempt!==this.permissionAttempt)return;
      if(permission!=='granted'){this.fallback('Tilt permission was denied. Touch steering is ready; you can retry Enable Tilt.');return;}
      this.tiltEnabled=true;this.received=false;this.prefs.steering='tilt';this.recenter(true);this.save();
      this.message('Waiting for motion data. Hold your phone in landscape.');
      window.setTimeout(()=>{if(attempt===this.permissionAttempt&&!this.received)this.fallback('No motion data arrived. Touch steering is ready; retry Enable Tilt in a supported browser.');},2500);
    }catch{if(attempt===this.permissionAttempt)this.fallback('Tilt could not be enabled. Touch steering is ready.');}
  }
  private fallback(message:string){this.permissionAttempt++;this.tiltEnabled=false;this.received=false;this.prefs.steering='buttons';this.recenter(true);this.save();this.message(message);}
  private settings(){
    const section=document.createElement('section');section.className='mobile-settings';
    const select=(id:string,label:string,values:string[],value:string)=>`<label>${label}<select id="mobile-${id}">${values.map(v=>`<option value="${v}" ${v===value?'selected':''}>${v[0].toUpperCase()+v.slice(1)}</option>`).join('')}</select></label>`;
    section.innerHTML=`<h3>Phone & tablet</h3><button type="button" class="back-button mobile-open">Steering & thumb controls</button>${select('touch','Show touch controls',['auto','on','off'],this.prefs.touch)}<h3>Graphics</h3>${select('graphics','Preset',['mobile','balanced','high'],this.prefs.graphics)}<label>Resolution scale<input id="mobile-resolution" type="range" min=".5" max="1.5" step=".1" value="${this.prefs.resolution}"></label><p>Mobile reduces resolution and distant decoration. Hazards stay active and visible.</p>`;
    document.querySelector('.settings-body')!.prepend(section);
    for(const parent of ['.hero','#paused .pause-card'])document.querySelector(parent)?.insertAdjacentHTML('beforeend','<button type="button" class="back-button mobile-open mobile-entry">Tilt & touch controls</button>');
    document.querySelectorAll('.mobile-open').forEach(b=>b.addEventListener('click',()=>this.action('mobile-controls')));
    for(const key of ['touch','graphics','resolution'] as const)document.getElementById('mobile-'+key)!.addEventListener('change',e=>{
      const value=(e.target as HTMLInputElement).value;(this.prefs as any)[key]=key==='resolution'?Number(value):value;
      if(key==='graphics'){this.prefs.resolution=value==='mobile'?.7:value==='balanced'?.9:1;(document.getElementById('mobile-resolution') as HTMLInputElement).value=String(this.prefs.resolution);}
      this.save();this.graphics();
    });
  }
}
