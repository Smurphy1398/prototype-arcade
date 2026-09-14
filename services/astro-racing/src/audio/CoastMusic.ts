/** Original eight-bar island/chiptune loop, scheduled against the audio clock.
 * No timers, downloads, or accumulating playback nodes on rematches. */
import { SCORES, type SongId } from './scores';
export class CoastMusic {
  private step=0;
  private next=0;
  private song:SongId='classic';
  private nodes=new Set<AudioScheduledSourceNode>();
  setSong(song:SongId,delay=0){this.stop();this.song=song;this.step=0;this.next=this.context.currentTime+delay;}
  stop(){for(const node of this.nodes){try{node.stop();}catch{}node.disconnect();}this.nodes.clear();}
  private noise:AudioBuffer;
  private melody=[76,79,81,79,76,74,72,-1, 76,79,84,81,79,-1,76,74, 77,81,84,81,79,77,76,-1, 74,79,83,81,79,74,71,-1,
    76,79,81,84,83,81,79,76, 72,76,81,79,76,74,72,-1, 74,77,81,79,77,76,74,-1, 71,74,79,83,81,79,74,71];
  constructor(private context:AudioContext,private output:GainNode){
    this.noise=context.createBuffer(1,context.sampleRate*.3,context.sampleRate);const data=this.noise.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;
  }
  update(active:boolean){
    const now=this.context.currentTime;if(!active){this.next=now+.04;return;}
    if(this.next<now-.3)this.next=now+.03;
    let count=0;
    while(this.next<now+.14&&count++<16){if(this.song==='classic')this.schedule(this.step%64,this.next);else this.arrange(this.step,this.next);this.step++;this.next+=60/(this.song==='classic'?134:SCORES[this.song].bpm)/2;}
  }
  private arrange(step:number,t:number){
    const score=SCORES[this.song as keyof typeof SCORES],barSteps=score.beat*2,eighth=step%barSteps,bar=Math.floor(step/barSteps),root=score.roots[bar%score.roots.length];
    if(eighth===0)for(const interval of [0,3,7,14])this.note(root+interval+12,t,this.song==='orbital'?1.1:.42,.025,'sine');
    if((score.steps as readonly number[]).includes(eighth))this.note(root-12+(eighth===3?7:0),t,.15,this.song==='factory'?.045:.11,score.bass);
    const note=score.lead[step%score.lead.length];if(note>=0){this.note(note,t,score.duration,this.song==='factory'?.025:.075,score.wave);if(this.song==='moonbell')this.note(note+19,t,.17,.014,'sine');}
    if(eighth===0||score.beat===4&&eighth===4)this.kick(t);
    if(this.song==='moonbell'){if(eighth===2||eighth===4)this.percussion(t,.06,.023,2400);}
    else {this.percussion(t,.025,.02,eighth%2?4800:3100);if(eighth===2||eighth===6)this.percussion(t,.08,.06,this.song==='factory'?700:1600);}
  }
  private schedule(step:number,t:number){
    const bar=Math.floor(step/8),eighth=step%8,roots=[48,45,41,43,48,45,50,43],root=roots[bar],minor=bar===1||bar===5||bar===6;
    if(eighth===0||eighth===4){for(const interval of [0,minor?3:4,7])this.note(root+interval,t,.45,.033,'triangle');}
    if([0,3,4,6].includes(eighth))this.note(root-12+(eighth===6?7:0),t,.19,.13,'triangle');
    if(this.melody[step]>=0){this.note(this.melody[step],t,.17,.09,'sine');this.note(this.melody[step]+12,t,.065,.014,'sine');}
    if(eighth===0||eighth===4)this.kick(t);
    if(eighth===2||eighth===6)this.percussion(t,.09,.09,1500);
    this.percussion(t,.04,eighth%2?.034:.022,6500);
  }
  private note(midi:number,t:number,duration:number,volume:number,type:OscillatorType){
    const c=this.context,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=440*2**((midi-69)/12);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(volume,t+.004);g.gain.exponentialRampToValueAtTime(.001,t+duration);o.connect(g);g.connect(this.output);this.nodes.add(o);o.start(t);o.stop(t+duration+.02);o.onended=()=>{this.nodes.delete(o);o.disconnect();g.disconnect();};
  }
  private kick(t:number){const c=this.context,o=c.createOscillator(),g=c.createGain();o.frequency.setValueAtTime(125,t);o.frequency.exponentialRampToValueAtTime(45,t+.12);g.gain.setValueAtTime(.22,t);g.gain.exponentialRampToValueAtTime(.001,t+.16);o.connect(g);g.connect(this.output);this.nodes.add(o);o.start(t);o.stop(t+.18);o.onended=()=>{this.nodes.delete(o);o.disconnect();g.disconnect();};}
  private percussion(t:number,duration:number,volume:number,frequency:number){const c=this.context,s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=this.noise;f.type='highpass';f.frequency.value=frequency;g.gain.setValueAtTime(volume,t);g.gain.exponentialRampToValueAtTime(.001,t+duration);s.connect(f);f.connect(g);g.connect(this.output);this.nodes.add(s);s.start(t);s.stop(t+duration+.02);s.onended=()=>{this.nodes.delete(s);s.disconnect();f.disconnect();g.disconnect();};}
}
