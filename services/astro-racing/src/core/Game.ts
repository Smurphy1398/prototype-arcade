import { RoomClient } from '../network/RoomClient';
import {MobileControls} from './MobileControls';
import { applySnapshot } from '../network/protocol';
import { RoomPanel } from '../ui/RoomPanel';
import { createTrack,loadTrack } from '../tracks/catalog';
import type { TrackDefinition } from '../tracks/TrackDefinition';
import { DestinationTrack } from '../tracks/destinations/track';
import { DestinationWorld } from '../tracks/destinations/World';
import { Garage } from '../ui/Garage';
import { loadProfile,saveProfile,cleanName } from '../content/profile';
import { loadGarage, DRIVERS, type GarageSelection } from '../content/garage';
import * as THREE from 'three';
import { BUILD } from '../content/tuning';
import { Input } from './Input';
import { FixedStep } from './FixedStep';
import { CoastTrack } from '../tracks/sunspun/track';
import { CoastWorld } from '../tracks/sunspun/World';
import { KartView } from '../vehicle/KartView';
import { ChaseCamera } from '../vehicle/ChaseCamera';
import { GameAudio } from '../audio/GameAudio';
import { CupSession } from '../race/CupSession';
import type { SongId } from '../audio/scores';
import { RaceHud } from '../ui/RaceHud';
import { type Screen } from '../ui/Hud';
import { RaceSimulation } from '../race/RaceSimulation';
import { FeatureView } from '../tracks/FeatureView';

export class Game {
  private roomClient=new RoomClient(m=>this.networkMessage(m));
  private roomPanel!:RoomPanel;
  private networkRace='';
  private nextInput=0;
  private profile=loadProfile();
  private selection=loadGarage();
  private garage:Garage;
  private track:TrackDefinition=loadTrack();
  private race=new RaceSimulation(this.track,this.profile.difficulty,this.selection);
  private audio=new GameAudio();
  private hud=new RaceHud(this.track,a=>this.action(a));
  private input=new Input(a=>this.action(a));
  private mobile!:MobileControls;
  private clock=new FixedStep();
  private screen:Screen='menu';
  private cup:CupSession|null=null;
  private beforePause:Screen='driving';
  private backScreen:Screen='menu';
  private renderer:THREE.WebGLRenderer;
  private scene=new THREE.Scene();
  private camera=new THREE.PerspectiveCamera(65,innerWidth/innerHeight,.1,1500);
  private chase=new ChaseCamera(this.camera);
  private world:CoastWorld|DestinationWorld;
  private views:KartView[];
  private features:FeatureView;
  private lastTime=0;
  private time=0;
  private frameTimes:number[]=[];
  private automatePlayer=false;
  private hazardSounds=new Map<string,string>();
  constructor(){
    const canvas=document.getElementById('world') as HTMLCanvasElement;
    this.renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.6));this.renderer.setSize(innerWidth,innerHeight);
    this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.12;
    this.world=this.track instanceof CoastTrack?new CoastWorld(this.track,this.scene):new DestinationWorld(this.track as DestinationTrack,this.scene);this.views=this.race.racers.map(r=>new KartView(this.scene,r.livery,r.setup));
    this.features=new FeatureView(this.track,this.scene);this.hud.audioSettings(this.audio.musicVolume,this.audio.effectsVolume,this.audio.engineVolume);
    this.race.player.physics.reset(4);this.chase.snap(this.race.player.state);this.hud.screen('menu');
    this.hud.setTrack(this.track);
    this.garage=new Garage(this.selection,s=>this.configure(s),a=>this.action(a));this.configure(this.selection);
    document.getElementById('start')!.insertAdjacentHTML('afterend','<button id="open-garage" class="primary garage-entry">GARAGE <span>↗</span></button>');document.getElementById('open-garage')!.addEventListener('click',()=>this.action('garage'));
    this.roomPanel=new RoomPanel((a,v)=>this.roomAction(a,v));document.getElementById('start')!.insertAdjacentHTML('afterend','<button id="open-online" class="primary guest-entry">RACE TOGETHER <span>2 guests</span></button>');document.getElementById('open-online')!.addEventListener('click',()=>this.roomPanel.show(true));document.getElementById('hud')!.insertAdjacentHTML('beforeend','<div id="online-state" class="hidden"></div>');if(new URLSearchParams(location.search).has('room'))this.roomPanel.show(true);const savedRoom=this.roomClient.restoreSession();if(savedRoom){(document.getElementById('room-endpoint') as HTMLInputElement).value=savedRoom;this.roomPanel.show(true);this.roomPanel.message('Previous room found. Reconnect to reclaim your seat.',true);}
    window.addEventListener('resize',()=>{this.renderer.setSize(innerWidth,innerHeight);this.camera.aspect=innerWidth/innerHeight;this.camera.updateProjectionMatrix();});
    canvas.addEventListener('contextmenu',e=>e.preventDefault());
    canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();this.setScreen('paused');this.hud.error('Graphics were interrupted. Reload the page to restart the race.');});
    this.mobile=new MobileControls(this.input,a=>this.action(a),()=>this.applyGraphics());this.applyGraphics();
    this.renderer.compile(this.scene,this.camera);this.renderer.setAnimationLoop(ms=>this.frame(ms));
    Object.defineProperty(window,'astroDebug',{value:{snapshot:()=>this.snapshot(),...(new URLSearchParams(location.search).has('verify')?{game:this}:{})},configurable:true});
  }
  private applyGraphics(){if(!this.mobile)return;const p=this.mobile.prefs;this.renderer.setPixelRatio(Math.min(devicePixelRatio,p.graphics==='mobile'?1:1.6)*p.resolution);this.renderer.shadowMap.enabled=p.graphics==='high';this.renderer.setSize(innerWidth,innerHeight);if(this.world instanceof DestinationWorld)this.world.quality=p.graphics;}
  private changeTrack(id:string){
    const geometries=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>();
    this.scene.traverse(o=>{if(o instanceof THREE.Mesh||o instanceof THREE.Sprite){if(o instanceof THREE.Mesh)geometries.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])materials.add(m);}});
    for(const g of geometries)g.dispose();for(const m of materials){(m as THREE.MeshBasicMaterial).map?.dispose();m.dispose();}
    this.scene.clear();this.scene=new THREE.Scene();this.track=createTrack(id);this.race=new RaceSimulation(this.track,this.hud.difficulty,this.selection);
    this.world=this.track instanceof CoastTrack?new CoastWorld(this.track,this.scene):new DestinationWorld(this.track as DestinationTrack,this.scene);
    this.race.player.livery.name=this.profile.displayName||DRIVERS[this.selection.driver].name;this.views=this.race.racers.map(r=>new KartView(this.scene,r.livery,r.setup));this.features=new FeatureView(this.track,this.scene);this.hud.setTrack(this.track);this.race.player.physics.reset(4);this.chase.snap(this.race.player.state);
    this.hazardSounds.clear();this.applyGraphics();
    try{localStorage.setItem('astro-destination-v3',this.track.id??'classic');}catch{}
  }
  private configure(selection:GarageSelection){this.selection={...selection};this.race.configure(selection);this.race.player.livery.name=this.profile.displayName||DRIVERS[selection.driver].name;for(const view of this.views)view.dispose();this.views=this.race.racers.map(r=>new KartView(this.scene,r.livery,r.setup));this.audio.setProfile(selection.body);document.querySelector('.driver-label strong')!.textContent=DRIVERS[selection.driver].name;document.querySelector('.driver-label p')!.textContent=DRIVERS[selection.driver].tag;}
  private setScreen(screen:Screen,preserve=false){this.screen=screen;this.input.enabled=screen==='driving';if(!preserve)this.input.clear();this.clock.reset();this.hud.screen(screen);this.garage?.show(screen==='garage');
    this.mobile?.setActive(screen==='driving');
    if(screen==='paused'){document.querySelector('#paused .pause-card > p')!.textContent=this.networkRace?'The shared race continues. Your controls are neutral while this menu is open.':'Race paused. Resume here, or choose an action below.';const retry=document.getElementById('retry') as HTMLButtonElement;retry.disabled=!!this.networkRace;retry.textContent=this.networkRace?'REMATCH AFTER THE FINISH':'RESTART RACE';}
    const focus:Partial<Record<Screen,string>>={menu:'#start',paused:'#resume',results:'#rematch',settings:'#settings-back',garage:'#garage-back',destinations:'[data-track][aria-pressed=true]',news:'#news [data-back]'};
    if(focus[screen])document.querySelector<HTMLElement>(focus[screen]!)?.focus();else (document.activeElement as HTMLElement)?.blur?.();
  }
  private roomAction(action:string,v:any){
    if(action==='ready'&&v.ready&&this.mobile?.needsSetup){this.mobile.openSetup(()=>this.roomAction(action,v));return;}
    if(action==='back'){this.roomClient.close();this.networkRace='';this.roomPanel.reset();this.roomPanel.show(false);this.race.localPlayerId=0;this.hud.difficulty=this.profile.difficulty;this.changeTrack(this.track.id??'classic');this.setScreen('menu');return;}
    if(action==='create'||action==='join'){try{const url=new URL(v.endpoint);if(!['ws:','wss:'].includes(url.protocol))throw Error();this.roomPanel.message('Connecting...');this.roomClient.connect(v.endpoint,{type:action,name:v.name,code:v.code,garage:this.selection});}catch{this.roomPanel.message('Enter a ws:// or wss:// room address.');}return;}
    if(action==='reconnect'){this.roomClient.connect(v.endpoint,{type:'reconnect',code:this.roomClient.code,token:this.roomClient.token});return;}
    if(action==='share'&&navigator.share){const link=new URL(location.href);link.search='';link.searchParams.set('room',this.roomClient.code);link.searchParams.set('server',v.endpoint);void navigator.share({title:'Astro Racing room',url:link.href}).catch(()=>this.roomAction('copy',v));return;}
    if(action==='share'){this.roomAction('copy',v);return;}
    if(action==='copy'){const link=new URL(location.href);link.search='';link.searchParams.set('room',this.roomClient.code);link.searchParams.set('server',v.endpoint);if(navigator.clipboard)void navigator.clipboard.writeText(link.href).then(()=>this.roomPanel.message('Join link copied.')).catch(()=>this.roomPanel.message(link.href));else this.roomPanel.message(link.href);return;}
    this.roomClient.send({type:action,...(action==='settings'?{track:v.track,difficulty:v.difficulty}:action==='ready'?{ready:v.ready}:{})});
  }
  private networkMessage(m:any){
    if(m.type==='error'){this.roomPanel.message(m.message);return;}
    if(m.type==='closed'){this.roomPanel.show(true);this.roomPanel.message('Disconnected. Your seat is driven by a bot. Reconnect within 30 seconds.',true);this.input.clear();return;}
    if(m.type==='lobby'){this.roomPanel.update(m,this.roomClient.racerId);if(!m.racing){this.networkRace='';this.setScreen('menu');this.roomPanel.show(true);}return;}
    if(m.type!=='state')return;
    const fresh=this.networkRace!==m.raceId;
    if(fresh){this.networkRace=m.raceId;this.changeTrack(m.track);this.race.localPlayerId=this.roomClient.racerId;this.hud.difficulty=m.race.difficulty;applySnapshot(this.race,m.race);for(const view of this.views)view.dispose();this.views=this.race.racers.map(r=>new KartView(this.scene,r.livery,r.setup));this.audio.setProfile(this.race.player.setup.body);this.audio.beginRace(m.track);void this.audio.start().catch(()=>{});this.chase.snap(this.race.player.state);this.setScreen(m.race.status==='grid'?'countdown':'driving');}
    else applySnapshot(this.race,m.race);
    this.roomPanel.show(false);
    if(this.screen==='countdown'&&m.race.status!=='grid')this.setScreen('driving',true);
    for(const event of m.events){if(event.racer===this.race.localPlayerId){if(event.type==='recover')this.chase.snap(this.race.player.state);this.audio.cue(event.type==='bump'?'impact':event.type,event.value);if(event.type==='lap')this.hud.toast(this.race.player.progress.lap===3?'FINAL LAP!':'LAP TWO',this.time);}}
    if(this.race.player.progress.finished&&this.screen!=='results'){this.audio.finishRace(this.race.player.position);this.setScreen('results');}
  }
  private action(action:string){
    if(action==='mobile-controls'){
      const racing=this.screen==='driving'||this.screen==='countdown';
      if(racing){this.beforePause=this.screen as 'driving'|'countdown';this.setScreen('paused');}
      const resume=racing||this.screen==='paused';
      this.mobile.openSetup(resume?()=>this.action('pause'):undefined,resume&&this.beforePause==='driving');return;
    }
    if((action==='start'||action==='restart'||action==='enter'&&this.screen==='results')&&this.mobile?.needsSetup){
      this.mobile.openSetup(()=>this.action(action));return;
    }
    if(this.networkRace){
      if(action==='recover'){this.roomClient.send({type:'recover'});return;}
      if(action==='restart'||action==='start'||action==='enter'&&this.screen==='results'){this.roomClient.send({type:'rematch'});return;}
      if(action==='menu'){this.roomAction('back',{});return;}
      if(action==='blur'){this.input.clear();return;}
    }

    if(['garage','destinations','news','back','menu','pause'].includes(action)||action.startsWith('track:'))this.audio.cue('menu');
    if(action==='gamepad-menu'){this.action(this.screen==='menu'?'play':this.screen==='results'?(this.cup?'cup-next':'restart'):'pause');return;}
    if(action==='enter'&&this.screen==='results'&&this.cup){this.action('cup-next');return;}
    if(action.startsWith('name:')){this.profile.displayName=cleanName(action.slice(5));saveProfile(this.profile);this.configure(this.selection);return;}
    if(action.startsWith('difficulty:')){this.profile.difficulty=action.slice(11) as typeof this.profile.difficulty;this.race.difficulty=this.profile.difficulty;saveProfile(this.profile);return;}
    if(action.startsWith('track:')&&(this.screen==='menu'||this.screen==='destinations')){this.changeTrack(action.slice(6));return;}
    if(action==='cup-start'){this.cup=new CupSession((typeof document!=='undefined'?(document.getElementById('cup-choice') as HTMLSelectElement)?.value:undefined) as 'classic'|'city'|'wonders'||'classic');this.hud.cup=this.cup;this.changeTrack(this.cup.track);this.action('start');return;}
    if(action==='cup-next'&&this.cup){if(this.cup.complete){this.action('cup-start');return;}if(this.cup.advance()){this.changeTrack(this.cup.track);this.action('start');}return;}
    if(action==='play'||action==='enter'&&this.screen==='menu'){this.setScreen('destinations');return;}
    if(action==='destinations'||action==='news'){this.setScreen(action);return;}
    if(action==='settings'){this.backScreen=this.screen==='paused'?'paused':'menu';this.setScreen('settings');return;}
    if(action==='back'||action==='pause'&&['destinations','news','garage','settings'].includes(this.screen)){this.setScreen(this.screen==='garage'||this.screen==='settings'?this.backScreen:'menu');return;}
    if(action==='garage'){this.backScreen=this.screen==='destinations'?'destinations':'menu';this.setScreen('garage');return;}
    if(action==='preview-engine'){void this.audio.start().catch(()=>{});return;}
    if(action==='pause'&&this.screen==='garage'){this.setScreen('menu');return;}
    if(action==='pause'&&this.screen==='menu')return;
    if(action==='pause'&&this.screen==='results'){this.action('menu');return;}
    if(action.startsWith('volume:')){const [,channel,value]=action.split(':');this.audio.setVolume(channel as 'music'|'effects'|'engine',Number(value));this.hud.audioSettings(this.audio.musicVolume,this.audio.effectsVolume,this.audio.engineVolume);return;}
    if(action==='mute'){this.hud.mute(this.audio.toggle());if(!this.audio.muted)void this.audio.start().catch(()=>{});return;}
    if(action==='start'||action==='restart'||(action==='enter'&&(this.screen==='menu'||this.screen==='results'))){
      this.audio.beginRace((this.track.id??'classic') as SongId);void this.audio.start().catch(()=>this.hud.toast('Audio unavailable · racing still works',this.time));this.race.reset(this.hud.difficulty);this.chase.snap(this.race.player.state);this.setScreen('countdown');return;
    }
    if(action==='pause'||(action==='enter'&&this.screen==='paused')){
      if(this.screen==='paused'){void this.audio.start().catch(()=>{});this.setScreen(this.beforePause);}
      else if(this.screen==='driving'||this.screen==='countdown'){this.beforePause=this.screen;this.setScreen('paused');}return;
    }
    if(action==='blur'&&(this.screen==='driving'||this.screen==='countdown')){this.beforePause=this.screen;this.setScreen('paused');return;}
    if(action==='menu'){this.cup=null;this.hud.cup=null;this.race.reset(this.hud.difficulty);this.race.player.physics.reset(4);this.setScreen('menu');return;}
    if(action==='recover'&&this.screen==='driving'){this.race.recover();this.chase.snap(this.race.player.state);this.audio.cue('recover');this.hud.toast('BACK ON THE RACING LINE',this.time);}
  }
  private frame(ms:number){
    const raw=this.lastTime?(ms-this.lastTime)/1000:1/60;this.lastTime=ms;const dt=Math.min(raw,.1);this.time+=dt;
    this.frameTimes.push(raw*1000);if(this.frameTimes.length>600)this.frameTimes.shift();
    const controls=this.input.read(false);let alpha=1;
    if(this.screen==='garage'){this.garage.render(this.renderer,this.time,dt);this.audio.update(this.garage.state,this.garage.throttle,this.garage.throttle>0,false);return;}
    if(this.networkRace){alpha=Math.min(1,(performance.now()-this.roomClient.lastSnapshotAt)/50);if(this.time>=this.nextInput||controls.item||controls.trick){if(this.roomClient.input(controls))this.input.acknowledge();this.nextInput=this.time+1/30;}}
    if(!this.networkRace&&(this.screen==='driving'||this.screen==='countdown'||this.screen==='results')){
      let commands=controls;
      alpha=this.clock.advance(dt,step=>{
        this.race.step(commands,step,this.automatePlayer);this.input.acknowledge();commands={...controls,item:false,trick:false};
        for(const event of this.race.events){if(event.racer!==0)continue;if(event.type==='recover')this.chase.snap(this.race.player.state);this.audio.cue(event.type==='bump'?'impact':event.type,event.value);
          if(event.type==='go'){this.setScreen('driving',true);this.hud.toast('THREE LAPS. MAKE THEM COUNT.',this.time,2);}
          if(event.type==='boost')this.hud.toast(event.value===2?'✦ SUNBURST!':'✦ MINI BOOST',this.time,1.2);
          if(event.type==='lap')this.hud.toast(this.race.player.progress.lap===3?'FINAL LAP!':'LAP TWO · KEEP IT FLOWING',this.time,2);
          if(event.type==='finish'){const p=this.race.player;this.hud.best.record(this.track.id??'classic',this.race.difficulty,p.setup,p.progress.finishTime,p.livery.name);this.audio.finishRace(this.race.player.position);this.setScreen('results');}
          const feedback:Record<string,string>={'item-tripleBoost':'SUNBURST · CHARGE USED','item-ember':'EMBER AWAY','storm-warning':'STORM INCOMING · SHIELD NOW','storm-impact':'STORM SPARK','rocket-impact':'COMET IMPACT','item-empty':'NO ITEM · COLLECT A DIAMOND','item-unavailable':'ITEM UNAVAILABLE DURING RESCUE',pad:'» ROAD BOOST',pickup:'ITEM READY',hit:'HIT! · BRIEF RECOVERY PROTECTION','shield-block':'SEA BUBBLE SAVED YOU',trick:'BARREL ROLL! · STICK THE LANDING','trick-land':'CLEAN LANDING · TRICK BOOST','trick-miss':'TRICK MISSED · PRESS AT TAKEOFF','trick-ineligible':'TRICKS NEED A RAMP · WATCH FOR THE CUE','item-boost':'SUNBURST SODA!','item-shield':'SEA BUBBLE · HIT PROTECTION','item-bolt':'COCO ROLLER AWAY!','item-triple':'TRIPLE COCO · NEXT SHOT READY','item-pineapple':'PINEAPPLE AWAY · CLEAR THE BLAST','item-rocket':'COMET ROCKET · GUIDANCE ENGAGED','rocket-end':'YOUR WHEEL · TAKE CONTROL','shield-end':'SEA BUBBLE EXPIRED','item-trap':'COCO DROP!',recover:this.track.theme==='hotel'?'MOONBELL RESCUE · BACK ON THE ROAD':'SUN CLUB RESCUE · BACK ON THE ROAD'};
          if(feedback[event.type])this.hud.toast(feedback[event.type],this.time,1.3);
        }
      });
    }
    if(this.cup&&this.race.status==='finished')this.cup.record(this.race.finishOrder);
    if(this.screen==='countdown')this.hud.countdown(String(Math.ceil(this.race.countdown)));
    this.views.forEach((view,id)=>{const r=this.race.racers[id];view.group.visible=!['menu','destinations','news','settings'].includes(this.screen)||id===0;const label=view.group.getObjectByName('opponent-label');if(label){const local=this.race.player.state,distance=Math.hypot(r.state.x-local.x,r.state.z-local.z);label.visible=id!==this.race.localPlayerId&&distance>7&&distance<65;}view.update(r.physics.previous,r.state,alpha,this.screen==='paused'||this.screen==='menu'?0:dt,this.time,r);});
    const player=this.race.player.state,view=this.views[this.race.localPlayerId];
    if(['menu','destinations','news','settings'].includes(this.screen))this.chase.menu(player,this.time,dt);else if(this.screen!=='paused')this.chase.update({...player,x:view.group.position.x,y:view.group.position.y,z:view.group.position.z},dt,!!controls.lookBehind&&!player.falling&&player.rescueTime<=0);
    this.world.update(this.race.elapsed||this.time);this.features.update(this.race,this.time);this.hud.device=this.input.device;this.hud.updateRace(this.race,this.time);
    const online=document.getElementById('online-state')!;online.classList.toggle('hidden',!this.networkRace);online.textContent=`ROOM ${this.roomClient.code} / ${performance.now()-this.roomClient.lastSnapshotAt>1500?'CONNECTION STALLED':'LIVE'} / Esc opens controls; race continues`;
    if(this.networkRace&&this.screen==='results'){const b=document.getElementById('rematch') as HTMLButtonElement;b.disabled=this.race.status!=='finished'||this.roomPanel.room?.host!==this.roomClient.racerId;b.textContent=this.race.status!=='finished'?'WAITING FOR THE FIELD':this.roomPanel.room?.host===this.roomClient.racerId?'REMATCH LOBBY':'HOST STARTS REMATCH';}

    const driving=['driving','countdown','results'].includes(this.screen),f=player.progress/this.track.length;
    this.audio.environment(this.track.id??'classic',this.time,(f>.32&&f<.44)||(f>.63&&f<.72),driving);
    for(const h of this.race.mechanics.dynamicHazards){const stage=h.active?'active':h.warning?'warning':'clear';if(this.hazardSounds.get(h.id)!==stage&&Math.hypot(player.x-h.x,player.z-h.z)<100&&driving){if(stage!=='clear')this.audio.cue(stage==='warning'?'hazard-warning':'hazard-burst');}this.hazardSounds.set(h.id,stage);}
    this.audio.update(player,this.automatePlayer?1:controls.throttle,driving,driving);this.renderer.render(this.scene,this.camera);
  }
  private snapshot(){
    const sorted=[...this.frameTimes].sort((a,b)=>a-b),q=(p:number)=>sorted[Math.floor((sorted.length-1)*p)]??0;
    return {network:this.networkRace?{raceId:this.networkRace,code:this.roomClient.code,racerId:this.roomClient.racerId,tick:this.roomClient.lastTick,connected:this.roomClient.connected}:null,build:BUILD,track:this.track.id,cup:this.cup?{round:this.cup.round,totals:this.cup.totals}:null,garage:{...this.selection},screen:this.screen,raceStatus:this.race.status,difficulty:this.race.difficulty,elapsed:this.race.elapsed,finishOrder:[...this.race.finishOrder],
      racers:this.race.racers.map(r=>({name:r.livery.name,position:r.position,lap:r.progress.lap,nextGate:r.progress.nextGate,finished:r.progress.finished,recoveries:r.recoveries,item:r.item,shield:r.shield,protection:r.protection,kart:{...r.state}})),
      mechanics:{...this.race.mechanics.stats},items:{...this.race.items.stats,uses:{...this.race.items.stats.uses}},
      audio:{state:this.audio.status,muted:this.audio.muted,music:this.audio.musicVolume,effects:this.audio.effectsVolume,engine:this.audio.engineVolume},
      render:{...this.renderer.info.render},frameMs:{samples:this.frameTimes.length,p50:q(.5),p95:q(.95),p99:q(.99),max:Math.max(...this.frameTimes)}};
  }
}
