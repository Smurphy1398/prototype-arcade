import type { KartEvent, KartState } from '../vehicle/KartPhysics';
import { BODIES, type GarageSelection } from '../content/garage';
import { CoastMusic } from './CoastMusic';
import type { SongId } from './scores';

/** Synthesis stays local, starts on a user gesture, and follows simulation events. */
export class GameAudio {
  private context?: AudioContext;
  private master?: GainNode;
  private effects?:GainNode;
  private musicGain?:GainNode;
  private music?:CoastMusic;
  private song:SongId='classic';
  private finished=false;
  engineVolume=.7;
  beginRace(song:SongId){this.song=song;this.finished=false;this.music?.setSong(song);}
  finishRace(place:number){if(this.finished)return;this.finished=true;this.music?.setSong(place===1?'victory':'finish',.75);if(this.context){this.tone(600,1500,.42,'sine',.12);this.tone(1200,1800,.2,'sine',.1,.38);}}
  musicVolume=.38;
  effectsVolume=.7;
  private engine?: OscillatorNode;
  private harmonic?:OscillatorNode;
  private engineFilter?:BiquadFilterNode;
  private lastSpeed=0;
  private profile:GarageSelection['body']='classic';
  setProfile(body:GarageSelection['body']){this.profile=body;if(this.engine)this.engine.type=BODIES[body].wave;}
  private engineGain?: GainNode;
  private tireGain?: GainNode;
  private tireFilter?: BiquadFilterNode;
  muted=false;
  private ambienceClock=0;
  environment(track:string,time:number,nearBattle:boolean,active:boolean){
    if(!active||!this.context||time<this.ambienceClock)return;
    this.ambienceClock=time+.18;
    if(track==='vietnam'&&nearBattle){this.tone(68,48,.12,'triangle',.06);if(Math.floor(time*5)%4===0)this.tone(650,160,.07,'triangle',.055);}
    if(track==='barnyard'&&Math.floor(time*5)%22===0)this.tone(180,110,.35,'triangle',.028);
    if(track==='rally'&&Math.floor(time*5)%3===0)this.tone(95,48,.10,'sawtooth',.012);
    if(track==='dc'&&Math.floor(time*5)%29===0)this.tone(740,820,.08,'sine',.02);
    if(track==='volcano'&&Math.floor(time*5)%8===0)this.tone(65,32,.24,'triangle',.08);
  }
  constructor(){try{const saved=JSON.parse(localStorage.getItem('astro-audio-v2')??'null');if(saved){if(Number.isFinite(saved.engine))this.engineVolume=Math.max(0,Math.min(1,saved.engine));this.musicVolume=Math.max(0,Math.min(1,Number(saved.music)||0));this.effectsVolume=Math.max(0,Math.min(1,Number(saved.effects)||0));}}catch{}}
  async start() {
    if(!this.context) {
      const c=this.context=new AudioContext();
      this.master=c.createGain();this.master.gain.value=this.muted?0:1;this.master.connect(c.destination);
      this.effects=c.createGain();this.effects.gain.value=this.effectsVolume*.55;this.effects.connect(this.master);
      this.musicGain=c.createGain();this.musicGain.gain.value=0;this.musicGain.connect(this.master);this.music=new CoastMusic(c,this.musicGain);this.music.setSong(this.song);
      const engine=c.createOscillator();engine.type=BODIES[this.profile].wave;engine.frequency.value=55;
      const filter=this.engineFilter=c.createBiquadFilter();filter.type='lowpass';filter.frequency.value=460;
      this.engineGain=c.createGain();this.engineGain.gain.value=0;engine.connect(filter);filter.connect(this.engineGain);this.engineGain.connect(this.master);engine.start();this.engine=engine;
      const harmonic=this.harmonic=c.createOscillator(),blend=c.createGain();harmonic.type='sine';blend.gain.value=.24;harmonic.connect(blend);blend.connect(filter);harmonic.start();
      const buffer=c.createBuffer(1,c.sampleRate*2,c.sampleRate);const data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;
      const noise=c.createBufferSource();noise.buffer=buffer;noise.loop=true;
      this.tireFilter=c.createBiquadFilter();this.tireFilter.type='bandpass';this.tireFilter.frequency.value=1100;this.tireFilter.Q.value=1.5;
      this.tireGain=c.createGain();this.tireGain.gain.value=0;noise.connect(this.tireFilter);this.tireFilter.connect(this.tireGain);this.tireGain.connect(this.effects);noise.start();
    }
    if(this.context.state==='suspended')await this.context.resume();
  }
  toggle() {this.muted=!this.muted;if(this.context&&this.master)this.master.gain.setTargetAtTime(this.muted?0:1,this.context.currentTime,.05);return this.muted;}
  setVolume(channel:'music'|'effects'|'engine',value:number){const v=Math.max(0,Math.min(1,value));if(channel==='music')this.musicVolume=v;else if(channel==='engine')this.engineVolume=v;else this.effectsVolume=v;
    if(this.context&&this.effects)this.effects.gain.setTargetAtTime(this.effectsVolume*.55,this.context.currentTime,.04);
    try{localStorage.setItem('astro-audio-v2',JSON.stringify({music:this.musicVolume,effects:this.effectsVolume,engine:this.engineVolume}));}catch{}
  }
  update(k:KartState,throttle:number,active:boolean,musicActive=active) {
    const c=this.context;if(!c||!this.engine||!this.engineGain||!this.tireGain)return;
    this.musicGain?.gain.setTargetAtTime(musicActive?this.musicVolume:0,c.currentTime,.12);this.music?.update(musicActive);
    const speed=Math.abs(k.speed),acceleration=Math.max(-1,Math.min(1,(speed-this.lastSpeed)*.3));this.lastSpeed=speed;
    const load=throttle*.65+Math.max(0,acceleration)*.35,gear=Math.min(3,Math.floor(speed/10.5));
    const rev=82+speed*3.1-gear*9+load*28+(k.boost>0?18:0)+(!k.grounded?12:0);
    this.engine.frequency.setTargetAtTime(rev*BODIES[this.profile].pitch,c.currentTime,throttle>.1?.1:.18);
    this.engineFilter?.frequency.setTargetAtTime(480+load*460+speed*4+(k.boost>0?100:0),c.currentTime,.06);
    this.harmonic?.frequency.setTargetAtTime(rev*BODIES[this.profile].pitch*2,c.currentTime,.12);
    this.engineGain.gain.setTargetAtTime(active?(.09+load*.085+speed*.0007)*(k.grounded?1:.8)*BODIES[this.profile].gain*this.engineVolume:0,c.currentTime,.055);
    this.tireGain.gain.setTargetAtTime(active?(k.drifting?.065:k.offroad&&speed>3?.038:0):0,c.currentTime,.07);
    this.tireFilter?.frequency.setTargetAtTime(k.offroad?460:1300+Math.sin(c.currentTime*18)*190,c.currentTime,.08);
  }
  cue(type:string,value=1) {
    const c=this.context;if(!c||!this.master)return;
    if(type==='menu')this.tone(620,830,.065,'sine',.045);
    else if(type==='hazard-warning'){this.tone(880,880,.14,'sine',.10);this.tone(1100,1100,.14,'sine',.10,.2);}
    else if(type==='hazard-burst')this.tone(100,25,.6,'triangle',.26);
    else if(type==='ricochet')this.tone(650+value*60,350,.08,'triangle',.12);
    else if(type==='explosion')this.tone(100,25,.25,'triangle',.22);
    else if(type==='shield-end'||type==='boost-end')this.tone(480,280,.12,'sine',.05);
    else if(type==='item-triple')this.tone(350,130,.15,'triangle',.13);
    else if(type==='item-pineapple')this.tone(220,800,.22,'triangle',.14);
    else if(type==='item-rocket'){this.tone(65,500,.8,'sawtooth',.15);this.tone(220,880,.6,'triangle',.15);}
    else if(type==='item-ember')this.tone(180,820,.13,'sawtooth',.12);
    else if(type==='storm-warning')this.tone(880,1100,.6,'sine',.12);
    else if(type==='storm-impact'||type==='rocket-impact'){this.tone(65,25,.25,'sawtooth',.22);this.tone(650,140,.22,'triangle',.16);}
    else if(type==='rocket-end')this.tone(780,390,.2,'sine',.12);
    else if(type==='boost'){this.tone(170,700,.3,'sawtooth',.12);this.tone(660,990,.35,'sine',.12);}
    else if(type==='charge'){this.tone(value===2?880:660,value===2?1320:880,.14,'sine',.18);}
    else if(type==='hop')this.tone(260,410,.09,'sine',.11);
    else if(type==='impact')this.tone(90,30,.16,'triangle',.25);
    else if(type==='land')this.tone(100,40,.12,'triangle',.15);
    else if(type==='recover')this.tone(320,740,.3,'sine',.15);
    else if(type==='go'||type==='lap'){this.tone(660,660,.16,'sine',.16);this.tone(880,880,.25,'sine',.13,.16);this.tone(1320,1320,.32,'sine',.12,.32);}
    else if(type==='tick')this.tone(440,440,.12,'sine',.14);
    else if(type==='pad'||type==='item-boost'||type==='item-tripleBoost'){this.tone(180,620,.22,'sawtooth',.12);this.tone(770,1100,.24,'sine',.1);}
    else if(type==='pickup'){this.tone(880,1175,.1,'sine',.16);this.tone(1320,1568,.15,'sine',.13,.09);}
    else if(type==='item-bolt')this.tone(1200,140,.2,'sawtooth',.13);
    else if(type==='item-trap')this.tone(220,90,.14,'triangle',.18);
    else if(type==='item-shield'||type==='shield-block'){this.tone(520,1040,.3,'sine',.14);this.tone(780,1560,.3,'sine',.08);}
    else if(type==='hit')this.tone(140,35,.26,'triangle',.3);
    else if(type==='trick'){this.tone(520,1300,.26,'sine',.15);}
    else if(type==='trick-land'){this.tone(880,880,.12,'sine',.16);this.tone(1320,1568,.22,'sine',.16,.1);}
    else if(type==='trick-miss')this.tone(330,180,.14,'sine',.1);
  }
  events(events:KartEvent[]){for(const e of events)this.cue(e.type,e.value);}
  private tone(from:number,to:number,duration:number,type:OscillatorType,volume:number,delay=0){
    const c=this.context!,t=c.currentTime+delay,o=c.createOscillator(),g=c.createGain();
    o.type=type;o.frequency.setValueAtTime(from,t);o.frequency.exponentialRampToValueAtTime(Math.max(1,to),t+duration);
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(volume,t+.008);g.gain.exponentialRampToValueAtTime(.001,t+duration);
    o.connect(g);g.connect(this.effects!);o.start(t);o.stop(t+duration+.02);o.onended=()=>{o.disconnect();g.disconnect();};
  }
  get status(){return this.context?.state??'not-started';}
}
