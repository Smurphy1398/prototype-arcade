import { Hud, formatTime, type Screen } from './Hud';
import type { TrackDefinition } from '../tracks/TrackDefinition';
import type { RaceSimulation } from '../race/RaceSimulation';
import { DIFFICULTIES, type Difficulty } from '../content/racers';
import { DESTINATIONS, type TrackId } from '../tracks/catalog';
import { ITEMS } from '../items/definitions';
import { portrait } from './portraits';
import { destinationCards,DETAILS } from './Destinations';
import { CHANGELOG } from '../content/changelog';
import { CupSession } from '../race/CupSession';
import { BestTimes } from '../race/BestTimes';
import { BODIES,TIRES } from '../content/garage';
import { loadProfile,escapeText } from '../content/profile';

export class RaceHud extends Hud {
  difficulty:Difficulty=loadProfile().difficulty;
  device:'keyboard'|'gamepad'|'touch'='keyboard';
  readonly best=new BestTimes();
  cup:CupSession|null=null;
  private boardKey='';
  private itemKey='';
  private results:HTMLElement;
  private nextUpdate=0;
  constructor(private coast:TrackDefinition,onAction:(action:string)=>void){
    super(coast,onAction);
    document.querySelector('.destination p')!.textContent='12 racers · 3 laps';
    document.querySelector('.destination')!.insertAdjacentHTML('afterend','<button id="open-destinations" class="browse-tracks">EXPLORE 5 DESTINATIONS <span>→</span></button><p id="menu-record" class="record-note"></p>');
    document.getElementById('open-destinations')!.addEventListener('click',()=>onAction('destinations'));
    document.getElementById('ui')!.insertAdjacentHTML('beforeend',`<section id="destinations" class="destination-screen hidden"><div class="screen-heading"><div><span class="eyebrow">THE ASTRO ATLAS</span><h2>Where to next?</h2></div><div class="screen-actions"><button data-back class="back-button">← MAIN MENU</button><button data-race class="primary">RACE →</button></div></div><div class="destination-grid">${destinationCards()}</div><p id="track-summary"></p><p class="screen-help">Select a card, then Race. Tab moves focus · Enter selects · Escape goes back.</p></section><section id="news" class="news-screen hidden"><div class="screen-heading"><div><span class="eyebrow">WHAT’S NEW / ${CHANGELOG.date}</span><h2>${CHANGELOG.title}</h2><p>v${CHANGELOG.version} · ${CHANGELOG.status}</p></div><button data-back class="back-button">← MAIN MENU</button></div><div class="news-columns">${(['Added','Improved','Fixed'] as const).map(section=>`<article><h3>${section}</h3><ul>${CHANGELOG[section].map(line=>`<li>${line}</li>`).join('')}</ul></article>`).join('')}</div><p>${CHANGELOG.note}</p></section>`);
    for(const b of document.querySelectorAll<HTMLButtonElement>('[data-track]'))b.addEventListener('click',()=>onAction(`track:${b.dataset.track}`));
    for(const b of document.querySelectorAll<HTMLButtonElement>('[data-back]'))b.addEventListener('click',()=>onAction('back'));
    for(const b of document.querySelectorAll<HTMLButtonElement>('[data-race]'))b.addEventListener('click',()=>onAction('start'));
    document.querySelector('.hero')!.insertAdjacentHTML('beforeend','<button id="start-cup" class="cup-entry">RIVALS & RIDES CUP <span>3 races →</span></button><p class="cup-description">Grand Tour → Clockwork Cargo → Orbital Drift</p>');
    document.getElementById('start-cup')!.addEventListener('click',()=>onAction('cup-start'));
    document.querySelector('.entry-footer')!.insertAdjacentHTML('beforeend','<button id="whats-new" class="text-button">WHAT’S NEW · v0.4</button>');document.getElementById('whats-new')!.addEventListener('click',()=>onAction('news'));
    document.querySelector('.entry-footer > span')!.textContent='TWELVE RACERS. YOUR RIDE.';
    document.querySelector('#start')!.innerHTML='RACE THIS COURSE <span>↗</span>';
    document.querySelector('.entry-tip')!.textContent='WASD DRIVE · SPACE DRIFT · Q ITEM · E TRICK';
    document.querySelector('.hero')!.insertAdjacentHTML('beforeend','<details class="race-primer"><summary>First race? Controls &amp; items</summary><p>WASD / arrows drive · Space + turn drifts · release to boost.<br>Glowing diamonds give an item. Q fires, drops, boosts or shields.<br>E performs a trick after takeoff. R rescues you. Esc pauses.<br>Gamepad: RT drive · RB drift · LB item · X trick · Y rescue.</p></details>');
    document.querySelector('.hero')!.insertAdjacentHTML('beforeend',`<div class="difficulty-picker" aria-label="Race difficulty">${Object.entries(DIFFICULTIES).map(([id,p])=>`<button data-difficulty="${id}" aria-pressed="${id===this.difficulty}">${p.label}</button>`).join('')}</div><p id="difficulty-description">${DIFFICULTIES[this.difficulty].description}</p>`);
    for(const button of document.querySelectorAll<HTMLButtonElement>('[data-difficulty]'))button.addEventListener('click',()=>{
      this.difficulty=button.dataset.difficulty as Difficulty;onAction(`difficulty:${this.difficulty}`);
      for(const b of document.querySelectorAll('[data-difficulty]'))b.setAttribute('aria-pressed',String(b===button));
      document.getElementById('difficulty-description')!.textContent=DIFFICULTIES[this.difficulty].description;
    });
    document.querySelector('.session-label strong')!.innerHTML='<span id="position">1</span><small> / 12</small> <i id="difficulty-hud">NORMAL</i>';
    document.querySelector('.time-ticket small')!.innerHTML='RACE <span id="race-time">00:00.00</span>';
    document.getElementById('hud')!.insertAdjacentHTML('beforeend','<div id="race-leaderboard" class="race-leaderboard"></div>');
    document.getElementById('hud')!.insertAdjacentHTML('beforeend','<div class="item-ticket"><span id="item-state" class="tiny">EMPTY</span><strong id="item-symbol">✦</strong><b id="item-name">FIND A PICKUP</b><small id="item-action">Diamond beacons on the road</small></div><div id="shield-status" class="shield-status hidden"></div><div id="trick-cue" class="trick-cue hidden">PRESS <kbd>E</kbd> FOR A BARREL ROLL</div>');
    document.querySelector('.controls-bar')!.insertAdjacentHTML('beforeend','<span><kbd>C</kbd> LOOK BEHIND</span><span><kbd>Q</kbd> ITEM</span><span><kbd>E</kbd> AIR TRICK</span>');
    document.querySelector('.control-guide')!.insertAdjacentHTML('beforeend','<p><b>Use item</b> Q / LB · <b>Air trick</b> E / X</p><p>Press E shortly after leaving the ramp. A clean landing earns a small boost. Watch for signed alternate routes. Open edges lead to a fall and automatic rescue.</p>');
    const mix=(prefix:string)=>`<div class="audio-mix"><label>MUSIC <input aria-label="${prefix} music volume" data-mix="music" type="range" min="0" max="1" step="0.05" value="0.38"></label><label>EFFECTS <input aria-label="${prefix} effects volume" data-mix="effects" type="range" min="0" max="1" step="0.05" value="0.7"></label><label>ENGINE <input aria-label="${prefix} engine volume" data-mix="engine" type="range" min="0" max="1" step="0.05" value="0.55"></label></div>`;
    document.querySelector('.pause-card')!.insertAdjacentHTML('beforeend',mix('Pause'));
    document.querySelector('.entry-footer')!.insertAdjacentHTML('beforeend',mix('Menu'));
    for(const slider of document.querySelectorAll<HTMLInputElement>('[data-mix]'))slider.addEventListener('input',()=>onAction(`volume:${slider.dataset.mix}:${slider.value}`));
    document.querySelector('#retry')!.textContent='RESTART RACE';
    document.getElementById('ui')!.insertAdjacentHTML('beforeend',`<section id="results" class="modal hidden"><div class="results-card"><span class="eyebrow">ASTRO GRAND TOUR</span><h2 id="result-heading">Coast complete.</h2><p id="result-time"></p><ol id="finish-order"></ol><p id="result-status"></p><p id="result-record" class="record-note"></p><div id="cup-standings" class="cup-standings"></div><button id="rematch" class="primary">RACE AGAIN <span>↗</span></button><button id="results-menu" class="text-button">BACK TO MAIN MENU</button></div></section>`);
    this.results=document.getElementById('results')!;
    document.getElementById('rematch')!.addEventListener('click',()=>onAction(this.cup?'cup-next':'restart'));
    document.getElementById('results-menu')!.addEventListener('click',()=>onAction('menu'));
    // Four main actions; setup and settings own their controls.
    document.getElementById('ui')!.insertAdjacentHTML('beforeend',`<section id="settings" class="news-screen hidden"><div class="screen-heading"><div><span class="eyebrow">MAKE YOURSELF AT HOME</span><h2>Settings</h2></div><button id="settings-back" class="back-button">← Back</button></div><div class="settings-body"><h3>Sound mix</h3><div id="settings-mix"></div><button id="settings-mute" class="back-button">Toggle sound</button><h3>Controls</h3><p>WASD / arrows · Drive<br>Space / Shift + turn · Drift, then release to boost<br>Q · Item　 E · Ramp trick　 C · Look behind<br>R · Recover　 Esc / P · Pause / Resume　 M · Mute</p><p>Gamepad: RT / A drive · LT brake · stick steer · RB drift · LB item · X trick · L3 look behind · Y recover · Menu pause.</p><p>Menus: Tab / Shift+Tab, then Enter. Escape goes back.</p></div></section>`);
    document.querySelector('.settings-body')!.insertAdjacentHTML('beforeend',`<h3>Item field guide</h3><p>Q / LB / Item activates one charge. Triple items count 3 → 2 → 1. Shields absorb one attack; evade the warning or projectile. Wait during recovery, falls or hit stun. Release steering/drift after a guided Comet.</p><p>Triple Coco: the visible coconuts hit rivals or intercept Coco, Ember and Seeker projectiles. Each contact spends one coconut. Shields absorb the hit; immunity prevents repeated drains. A gap in the orbit remains vulnerable. Two orbiting coconuts consume each other. Pineapple still explodes at interception; lightning, nearby blasts, traps and Comets are not blocked by the orbit. Full Sea Bubble protection remains useful.</p><p>Single Soda spends its one boost immediately. Triple Soda spends one boost per action. A short 0.2-second item cooldown prevents duplicate activations.</p><div class="item-guide">${Object.entries(ITEMS).map(([id,item])=>`<article>${item.icon}<b>${item.name}</b><p>${item.description}</p>${id==='rocket'?'<small>Rare catch-up for 7th or lower with a substantial gap. At most two awards across the field, at least 60 seconds apart. No queued Comets.</small>':''}</article>`).join('')}</div>`);
    document.getElementById('settings-mix')!.append(document.querySelector('.entry-footer .audio-mix')!);
    document.getElementById('settings-back')!.addEventListener('click',()=>onAction('back'));
    document.getElementById('settings-mute')!.addEventListener('click',()=>onAction('mute'));
    const setup=document.getElementById('destinations')!;
    setup.querySelector('h2')!.textContent='Race setup';
    const bar=document.createElement('div');bar.className='setup-bar';
    bar.innerHTML='<div id="setup-ride"></div><button id="setup-garage" class="back-button">Change ride</button>';
    bar.append(document.querySelector('.difficulty-picker')!);setup.querySelector('.screen-heading')!.after(bar);
    bar.append(document.getElementById('difficulty-description')!);
    setup.querySelector('[data-race]')!.textContent='START RACE →';
    setup.querySelector('.screen-help')!.textContent='12 racers · 3 laps · Select a destination, then Start Race';
    document.getElementById('setup-garage')!.addEventListener('click',()=>onAction('garage'));
    document.getElementById('open-destinations')!.classList.add('hidden');
    document.querySelector('.destination')!.classList.add('hidden');
    document.querySelector('.race-primer')!.classList.add('hidden');
    document.getElementById('difficulty-description')!.classList.add('setup-description');
    document.querySelector('.cup-description')!.innerHTML='<label>Cup <select id="cup-choice"><option value="classic">Rivals & Rides · coast / factory / space</option><option value="city">City Lights · NYC / Vegas / Toybox</option><option value="wonders">Hidden Wonders · Candy / Atlantis / Glacier</option></select></label>';
    document.querySelector('#start')!.innerHTML='PLAY <span>→</span>';
    document.querySelector('#start-cup')!.innerHTML='CUP <span>3 races →</span>';
    document.querySelector('.hero')!.insertAdjacentHTML('beforeend','<button id="open-settings" class="primary secondary-entry">SETTINGS <span>→</span></button>');
    document.getElementById('open-settings')!.addEventListener('click',()=>onAction('settings'));
    document.getElementById('resume')!.textContent='RESUME';document.getElementById('garage-back')?.setAttribute('aria-label','Back');
    document.getElementById('whats-new')!.textContent="WHAT'S NEW · v0.6";

  }
  override setTrack(track:TrackDefinition){super.setTrack(track);this.coast=track;const entry=DESTINATIONS[(track.id??'classic') as TrackId];document.querySelector('.destination strong')!.textContent=entry.name;document.querySelector('.destination p')!.textContent=entry.tag;document.querySelector('.destination small')!.textContent='CHOOSE YOUR DESTINATION';document.querySelector('.stamp')!.textContent=entry.stamp;document.getElementById('track-summary')!.textContent=`${entry.name} · ${(track.length/1000).toFixed(2)} km · ${DETAILS[(track.id??'classic') as TrackId].subtitle} · ${entry.tag}`;document.querySelector('.session-label .tiny')!.textContent=entry.name.toUpperCase();document.querySelector('.map-ticket .tiny')!.textContent='RACE ROUTE';document.querySelector('.map-caption')!.textContent=track.theme==='hotel'?'FOLLOW THE MOON':'FOLLOW THE SUN';for(const b of document.querySelectorAll<HTMLButtonElement>('[data-track]'))b.setAttribute('aria-pressed',String(b.dataset.track===track.id));}
  override screen(s:Screen){super.screen(s);this.results?.classList.toggle('hidden',s!=='results');document.getElementById('destinations')?.classList.toggle('hidden',s!=='destinations');document.getElementById('news')?.classList.toggle('hidden',s!=='news');document.getElementById('settings')?.classList.toggle('hidden',s!=='settings');}
  audioSettings(music:number,effects:number,engine=.55){for(const input of document.querySelectorAll<HTMLInputElement>('[data-mix]'))input.value=String(input.dataset.mix==='music'?music:input.dataset.mix==='engine'?engine:effects);}
  updateRace(race:RaceSimulation,time:number){
    if(time<this.nextUpdate)return;this.nextUpdate=time+.05;
    const p=race.player,progress=p.progress;
    const best=this.best.get(race.track.id??'classic',race.difficulty,p.setup),recordText=`${best?'Best race '+formatTime(best.time):'No local best yet'} · ${BODIES[p.setup.body].name} / ${TIRES[p.setup.tires].name} / ${DIFFICULTIES[this.difficulty].label}`;
    document.getElementById('menu-record')!.textContent=recordText;
    document.getElementById('setup-ride')!.textContent=`${p.livery.name} · ${BODIES[p.setup.body].name} · ${TIRES[p.setup.tires].name}`;
    document.getElementById('result-record')!.textContent=recordText;
    super.update(p.state,{laps:Math.min(2,progress.completedLaps),lapTime:progress.finished?progress.lastLap:Math.max(0,race.elapsed-progress.lapStart),best:0,wrongWay:p.steeringRearm||progress.wrongWay||progress.invalid||p.state.falling||p.state.rescueTime>0},time);
    document.getElementById('wrongway')!.textContent=p.steeringRearm?'RELEASE STEERING / DRIFT TO DRIVE ON':p.state.falling?'RESCUE INCOMING':p.state.rescueTime>0?'BACK ON THE ROAD':progress.invalid?'MISSED GATE · PRESS R TO RECOVER':'↶ WRONG WAY';
    document.getElementById('lap')!.textContent=`${progress.lap} / 3`;
    document.getElementById('position')!.textContent=String(p.position);
    document.getElementById('difficulty-hud')!.textContent=DIFFICULTIES[race.difficulty].label.toUpperCase();
    document.getElementById('race-time')!.textContent=formatTime(progress.finished?progress.finishTime:race.elapsed);
    const item=p.item?ITEMS[p.item]:null,key=p.rocket>0?'active-rocket':p.item??'empty',hint=this.device==='touch'?'ITEM':this.device==='gamepad'?'LB':'Q';
    if(this.itemKey!==key){this.itemKey=key;document.getElementById('item-symbol')!.innerHTML=(p.rocket>0?ITEMS.rocket.icon:item?.icon)??'<span class="empty-diamond">◇</span>';}
    const collecting=!!item&&p.heldTime<.35,unavailable=p.state.falling||p.state.rescueTime>0||p.stun>0;
    document.getElementById('item-name')!.textContent=(p.rocket>0?'Comet Rocket':item?.name)??(p.itemFeedback>0?'ITEM USED':'FIND A PICKUP');
    document.getElementById('item-state')!.textContent=p.rocket>0?`GUIDED RIDE · ${p.rocket.toFixed(1)}s`:unavailable&&item?'WAIT FOR CONTROL':collecting?'PICKED UP':p.item&&['triple','tripleBoost','ember'].includes(p.item)?`${p.charges} CHARGES · ONE PER PRESS`:item?'READY TO USE':p.itemFeedback>0?'CONSUMED':'EMPTY';
    document.getElementById('item-action')!.innerHTML=p.rocket>0?'GUIDANCE ACTIVE<span>Steering returns when the timer ends</span>':item?`<kbd>${hint}</kbd> ${item.action}<span>${item.description}</span>`:'Drive through a glowing diamond';
    const ticket=document.querySelector('.item-ticket')!;ticket.classList.toggle('item-ready',!!item);ticket.classList.toggle('item-collecting',collecting);
    const incoming=race.items.projectiles.some(q=>q.kind==='seeker'&&q.target===p.id),storm=race.items.storms.some(s=>s.targets.includes(p.id));const shield=document.getElementById('shield-status')!;shield.classList.toggle('hidden',p.shield<=0&&!incoming&&!storm);shield.textContent=storm?'STORM SPARK INCOMING — SHIELD NOW':incoming?'WINGED COCO INCOMING - SHIELD OR EVADE':`SEA BUBBLE ACTIVE · ${p.shield.toFixed(1)}s · ONE HIT`;
    const trickCue=document.getElementById('trick-cue')!;trickCue.innerHTML=`PRESS <kbd>${this.device==='gamepad'?'X':'E'}</kbd> FOR A BARREL ROLL`;trickCue.classList.toggle('hidden',!(p.state.airKind==='ramp'&&p.state.airTime<=.35&&p.state.trick==='none'||p.state.grounded&&this.coast.surface(p.state.x,p.state.z,p.state.route).ramp));
    const boardKey=race.racers.map(r=>[r.position,r.progress.finished,r.livery.name,r.setup.driver].join('/')).join('|');
    if(boardKey!==this.boardKey){this.boardKey=boardKey;document.getElementById('race-leaderboard')!.innerHTML=[...race.racers].sort((a,b)=>a.position-b.position).map(r=>`<div class="${r.id===race.localPlayerId?'you':''}"><b>${r.position}</b>${portrait(r.setup.driver)}${escapeText(r.livery.name)}<span>${r.progress.finished?'FIN':r.id===race.localPlayerId?'YOU':''}</span></div>`).join('');}
    const canvas=document.getElementById('minimap') as HTMLCanvasElement,ctx=canvas.getContext('2d')!;
    for(const route of this.coast.routes??[]){ctx.beginPath();route.samples.forEach((p,i)=>{const [x,y]=this.mapPoint(p.x,p.z);i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.strokeStyle='#69dacf';ctx.lineWidth=2;ctx.stroke();}
    for(const r of race.racers){if(r.id===race.localPlayerId)continue;ctx.beginPath();const [x,y]=this.mapPoint(r.state.x,r.state.z);ctx.arc(x,y,4.5,0,Math.PI*2);ctx.fillStyle='#'+r.livery.color.toString(16).padStart(6,'0');ctx.fill();ctx.lineWidth=1.5;ctx.strokeStyle='#fff0cb';ctx.stroke();}
    ctx.save();const [px,py]=this.mapPoint(p.state.x,p.state.z);ctx.translate(px,py);ctx.rotate(-p.state.heading);ctx.beginPath();ctx.moveTo(0,-8);ctx.lineTo(5,6);ctx.lineTo(0,3);ctx.lineTo(-5,6);ctx.closePath();ctx.fillStyle='#80f6dd';ctx.fill();ctx.restore();
    if(progress.finished){
      const button=document.getElementById('rematch') as HTMLButtonElement;button.disabled=!!this.cup&&!this.cup.ready;button.textContent=this.cup?(this.cup.complete?'RACE THE CUP AGAIN':this.cup.ready?'NEXT CUP RACE →':'WAITING FOR THE FIELD…'):'RACE AGAIN →';
      const cup=this.cup;document.getElementById('cup-standings')!.innerHTML=cup?`<h3>${cup.complete?'FINAL CUP STANDINGS':`CUP · ROUND ${cup.round+1} / 3`}</h3><div>${cup.standings().map((r,i)=>`<p>${portrait(race.racers[r.id].setup.driver)}<b>${i+1}. ${escapeText(race.racers[r.id].livery.name)}</b><span>${r.points} pts</span></p>`).join('')}</div>`:'';

      document.getElementById('result-heading')!.textContent=p.position===1?'Destination champion!':p.position<=3?'On the podium!':'Tour complete.';
      document.getElementById('result-time')!.textContent=`${p.position} / 12 · ${formatTime(progress.finishTime)} · ${DIFFICULTIES[race.difficulty].label}`;
      document.getElementById('finish-order')!.innerHTML=[...race.racers].sort((a,b)=>a.position-b.position).map(r=>`<li class="${r.id===race.localPlayerId?'you':''}"><b>${r.position}</b>${portrait(r.setup.driver)}<span>${escapeText(r.livery.name)}${r.id===race.localPlayerId?' · YOU':''}</span><strong>${r.progress.finished?formatTime(r.progress.finishTime):'RACING…'}</strong></li>`).join('');
      document.getElementById('result-status')!.textContent=race.status==='finished'?'All racers finished · victory cruise · results locked':`${race.finishOrder.length} of 12 finished · remaining racers are still on track`;
    }
  }
}
