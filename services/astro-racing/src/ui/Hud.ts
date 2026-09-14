import { BUILD, TUNING } from '../content/tuning';
import type { KartState } from '../vehicle/KartPhysics';
import type { TrackDefinition } from '../tracks/TrackDefinition';
import type { PracticeSession } from '../race/PracticeSession';
export type Screen='menu'|'driving'|'paused'|'countdown'|'results'|'garage'|'destinations'|'news'|'settings';
export const formatTime=(t:number)=>`${Math.floor(t/60).toString().padStart(2,'0')}:${(t%60).toFixed(2).padStart(5,'0')}`;
export class Hud {
  private root:HTMLElement;
  private map:HTMLCanvasElement;
  private ctx:CanvasRenderingContext2D;
  private els:Record<string,HTMLElement>={};
  private toastUntil=0;
  protected mapPoint:(x:number,z:number)=>[number,number];
  constructor(private track:TrackDefinition,onAction:(a:string)=>void){
    const points=[...track.samples,...(track.routes??[]).flatMap(r=>r.samples)],xs=points.map(p=>p.x),zs=points.map(p=>p.z),minX=Math.min(...xs),maxX=Math.max(...xs),minZ=Math.min(...zs),maxZ=Math.max(...zs);
    const scale=Math.min(180/Math.max(1,maxX-minX),230/Math.max(1,maxZ-minZ));
    this.mapPoint=(x,z)=>[110-(x-(minX+maxX)/2)*scale,135-(z-(minZ+maxZ)/2)*scale];
    this.root=document.getElementById('ui')!;
    this.root.innerHTML=`
      <div class="vignette"></div>
      <section id="menu" class="entry">
        <div class="topline"><span class="festival-mark">✦ &nbsp; THE ISLAND GRAND TOUR</span><span class="build">${BUILD}</span></div>
        <div class="hero"><p class="eyebrow"><span></span> SUNSHINE. SIDESLIDES. GOOD TIMES.</p>
          <h1>ASTRO<span>RACING<span class="title-star">✦</span></span></h1>
          <p class="tagline">A little sideways.<br>A world of possibility.</p>
          <div class="destination"><span class="destination-number">01</span><div><small>YOUR FIRST DESTINATION</small><strong>Sunspun Coast</strong><p>Tropical circuit &nbsp; · &nbsp; Free drive</p></div><span class="stamp">SUN<br>CLUB</span></div>
          <button class="primary" id="start">LET’S DRIVE <span>↗</span></button>
          <p class="entry-tip">PRESS ENTER TO HIT THE COAST</p>
        </div>
        <div class="driver-label"><span class="pill">MEET YOUR DRIVER</span><strong>Pip <span>✦</span></strong><p>Sun gecko. Corner enthusiast.</p></div>
        <div class="entry-footer"><span>ONE KART. ONE COAST. FIND YOUR FLOW.</span><button id="menu-sound" class="text-button">SOUND ON</button></div>
      </section>
      <section id="hud" class="hidden">
        <div class="hud-top"><div class="session-label"><span class="tiny">SUNSPUN COAST</span><strong>FREE DRIVE <i>01</i></strong></div><div class="time-ticket"><span class="tiny">LAP <b id="lap">01</b></span><strong id="timer">00:00.00</strong><small>BEST <span id="best">— —</span></small></div><button id="pause" class="icon-button" aria-label="Pause game">Ⅱ</button></div>
        <div id="toast" class="toast hidden" role="status"></div>
        <div id="wrongway" class="wrongway hidden">↶ WRONG WAY</div>
        <div id="count" class="count hidden"></div>
        <div class="hud-bottom"><div class="map-ticket"><span class="tiny">COASTAL ROUTE</span><canvas id="minimap" width="220" height="270" aria-label="Circuit minimap"></canvas><span class="map-caption">✦ &nbsp; FOLLOW THE SUN</span></div>
        <div class="drift-panel"><span id="drift-label">HOLD SPACE + TURN TO DRIFT</span><div class="drift-track"><div id="drift-fill"></div><i></i></div><small id="drive-hint">Release a charged drift for a boost</small></div>
        <div class="speedometer"><div><strong id="speed">000</strong><span>KM/H</span></div><div class="speed-line"><i id="speed-fill"></i></div><span id="surface">COASTING THE COAST</span></div></div>
        <div class="controls-bar"><span><kbd>W A S D</kbd> / <kbd>↑ ← ↓ →</kbd> DRIVE</span><span><kbd>SPACE</kbd> DRIFT</span><span><kbd>R</kbd> RECOVER</span><span><kbd>ESC</kbd> PAUSE</span></div>
      </section>
      <section id="paused" class="modal hidden"><div class="pause-card"><span class="eyebrow">TAKE A BREATHER</span><h2>Parked in<br>paradise.</h2><p>Race paused. Resume here, or choose an action below.</p><button id="resume" class="primary">BACK TO RACE <span>→</span></button><div class="pause-actions"><button id="retry">RESTART DRIVE</button><button id="return">MAIN MENU</button></div><div class="control-guide"><p><b>Accelerate</b> W / ↑ &nbsp; · &nbsp; <b>Brake / reverse</b> S / ↓</p><p><b>Steer</b> A D / ← → &nbsp; · &nbsp; <b>Hop / drift</b> Space / Shift</p><p><b>Reset to road</b> R &nbsp; · &nbsp; <b>Sound</b> M</p><p class="controller">GAMEPAD &nbsp; RT accelerate · LT brake · Stick steer<br>RB drift · Y recover · Menu pause</p></div><button id="pause-sound" class="text-button">SOUND ON</button></div></section>
      <div id="fatal" class="modal hidden"><div class="pause-card"><h2>One small<br>pit stop.</h2><p id="fatal-message"></p></div></div>`;
    for(const id of ['menu','hud','paused','lap','timer','best','speed','surface','speed-fill','drift-fill','drift-label','drive-hint','toast','count','wrongway','fatal','fatal-message'])this.els[id]=document.getElementById(id)!;
    for(const [id,action] of [['start','play'],['pause','pause'],['resume','pause'],['retry','restart'],['return','menu'],['menu-sound','mute'],['pause-sound','mute']])document.getElementById(id)!.addEventListener('click',()=>onAction(action));
    this.map=document.getElementById('minimap') as HTMLCanvasElement;this.ctx=this.map.getContext('2d')!;
  }
  setTrack(track:TrackDefinition){this.track=track;const points=[...track.samples,...(track.routes??[]).flatMap(r=>r.samples)],xs=points.map(p=>p.x),zs=points.map(p=>p.z),minX=Math.min(...xs),maxX=Math.max(...xs),minZ=Math.min(...zs),maxZ=Math.max(...zs),scale=Math.min(180/Math.max(1,maxX-minX),230/Math.max(1,maxZ-minZ));this.mapPoint=(x,z)=>[110-(x-(minX+maxX)/2)*scale,135-(z-(minZ+maxZ)/2)*scale];}
  screen(s:Screen){this.els.menu.classList.toggle('hidden',s!=='menu');this.els.hud.classList.toggle('hidden',!['driving','countdown','paused','results'].includes(s));this.els.paused.classList.toggle('hidden',s!=='paused');this.els.count.classList.toggle('hidden',s!=='countdown');if(s==='menu'){this.els.toast.classList.add('hidden');this.els.wrongway.classList.add('hidden');}}
  countdown(value:string){this.els.count.textContent=value;}
  toast(message:string,time:number,duration=2){this.els.toast.textContent=message;this.toastUntil=time+duration;this.els.toast.classList.remove('hidden');}
  mute(muted:boolean){for(const id of ['menu-sound','pause-sound'])document.getElementById(id)!.textContent=muted?'SOUND OFF':'SOUND ON';}
  update(k:KartState,session:{laps:number;lapTime:number;best:number;wrongWay:boolean},time:number){
    this.els.lap.textContent=String(session.laps+1).padStart(2,'0');this.els.timer.textContent=formatTime(session.lapTime);this.els.best.textContent=session.best?formatTime(session.best):'— —';
    this.els.speed.textContent=String(Math.round(Math.abs(k.speed)*3.6)).padStart(3,'0');this.els['speed-fill'].style.width=`${Math.min(100,Math.abs(k.speed)/45*100)}%`;
    this.els.surface.textContent=!k.grounded?'AIR TIME':k.boost>0?'BOOSTING!':k.offroad?'SAND · LOW GRIP':k.speed<-.5?'REVERSE':'COASTING THE COAST';
    const charge=Math.min(1,k.charge/TUNING.driftCharge2);this.els['drift-fill'].style.width=`${k.boost>0?Math.min(1,k.boost/1.45)*100:charge*100}%`;
    this.els['drift-fill'].classList.toggle('gold',k.charge>=TUNING.driftCharge2||k.boost>0);
    this.els['drift-label'].textContent=k.boost>0?'✦  SUNBURST BOOST':k.drifting?k.charge>=TUNING.driftCharge2?'GOLD CHARGE · RELEASE!':k.charge>=TUNING.driftCharge1?'BLUE CHARGE · RELEASE OR HOLD':'BUILDING A LITTLE SUNSHINE':'HOLD SPACE + TURN TO DRIFT';
    this.els['drive-hint'].textContent=k.drifting?'Steer into the corner · release Space to boost':'Release a charged drift for a boost';
    this.els.wrongway.classList.toggle('hidden',!session.wrongWay);if(time>this.toastUntil)this.els.toast.classList.add('hidden');this.drawMap(k);
  }
  private drawMap(k:KartState){
    const ctx=this.ctx;ctx.clearRect(0,0,220,270);
    const point=this.mapPoint;
    ctx.beginPath();this.track.samples.forEach((p,i)=>{const [x,y]=point(p.x,p.z);i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.closePath();ctx.strokeStyle='rgba(255,239,201,.17)';ctx.lineWidth=13;ctx.lineJoin='round';ctx.stroke();ctx.strokeStyle='#fce7b4';ctx.lineWidth=3;ctx.stroke();
    const [sx,sy]=point(0,0);ctx.fillStyle='#f7815c';ctx.fillRect(sx-6,sy-2,12,4);
    const [x,y]=point(k.x,k.z);ctx.save();ctx.translate(x,y);ctx.rotate(-k.heading);ctx.beginPath();ctx.moveTo(0,-8);ctx.lineTo(5,6);ctx.lineTo(0,3);ctx.lineTo(-5,6);ctx.closePath();ctx.fillStyle='#80f6dd';ctx.shadowColor='#67e3ca';ctx.shadowBlur=12;ctx.fill();ctx.restore();
  }
  error(message:string){this.els.fatal.classList.remove('hidden');this.els['fatal-message'].textContent=message;}
}
