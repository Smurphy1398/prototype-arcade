import type { DriveInput } from '../core/Input';
import { PROTOCOL } from './protocol';
export class RoomClient {
 socket?:WebSocket;seq=0;lastTick=-1;raceId='';racerId=0;token='';code='';connected=false;lastEvent=0;lastSnapshotAt=0;private endpoint='';private savedAt=0;
 constructor(readonly receive:(message:any)=>void){}
 connect(endpoint:string,request:Record<string,unknown>){
  this.close();this.endpoint=endpoint;this.seq=0;this.lastTick=-1;if(request.type!=='reconnect'){this.raceId='';this.lastEvent=0;}
  const socket=new WebSocket(endpoint);this.socket=socket;
  socket.onopen=()=>{this.connected=true;this.send({...request,protocol:PROTOCOL});};
  socket.onmessage=e=>{let m:any;try{m=JSON.parse(e.data);}catch{return;}
   if(m.type==='welcome'){this.token=m.token;this.code=m.code;this.racerId=m.racerId;this.saveSession();}
   if(m.type==='state'){if(m.raceId!==this.raceId){this.raceId=m.raceId;this.lastTick=-1;this.lastEvent=0;}if(m.tick<=this.lastTick)return;this.lastTick=m.tick;this.lastSnapshotAt=performance.now();if(Date.now()-this.savedAt>2000)this.saveSession();m.events=m.events.filter((e:any)=>e.id>this.lastEvent);if(m.events.length)this.lastEvent=m.events.at(-1).id;}
   this.receive(m);
  };
  socket.onclose=()=>{if(this.socket!==socket)return;this.connected=false;this.saveSession();this.receive({type:'closed'});};
  socket.onerror=()=>this.receive({type:'error',message:'Room server unavailable. Check the server address and launch command.'});
 }
 send(message:Record<string,unknown>){if(this.socket?.readyState===WebSocket.OPEN&&this.socket.bufferedAmount<65536){this.socket.send(JSON.stringify(message));return true;}return false;}
 input(input:DriveInput){return this.send({type:'input',seq:++this.seq,raceId:this.raceId,input});}
 private saveSession(){if(!this.code||!this.token)return;this.savedAt=Date.now();try{sessionStorage.setItem('astro-room-v07',JSON.stringify({code:this.code,token:this.token,racerId:this.racerId,endpoint:this.endpoint,time:this.savedAt}));}catch{}}
 restoreSession(){try{const v=JSON.parse(sessionStorage.getItem('astro-room-v07')??'null');if(v&&Date.now()-v.time<30000&&typeof v.code==='string'&&typeof v.token==='string'&&/^wss?:/.test(v.endpoint)){this.code=v.code;this.token=v.token;this.racerId=v.racerId;return v.endpoint as string;}}catch{}return null;}
 close(){try{sessionStorage.removeItem('astro-room-v07');}catch{}const s=this.socket;this.socket=undefined;this.connected=false;s?.close();}
}
