import { createServer } from 'node:http';
import { randomBytes,randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve,extname,sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { WebSocketServer,WebSocket } from 'ws';
import { RaceSimulation } from '../src/race/RaceSimulation';
import { createTrack,DESTINATIONS } from '../src/tracks/catalog';
import { validateGarage,type GarageSelection } from '../src/content/garage';
import { cleanName } from '../src/content/profile';
import { DIFFICULTIES,type Difficulty } from '../src/content/racers';
import { neutralInput,type DriveInput } from '../src/core/Input';
import { cleanInput,PROTOCOL,raceSnapshot } from '../src/network/protocol';
type Seat={id:number;token:string;socket?:WebSocket;name:string;garage:GarageSelection;ready:boolean;input:DriveInput;seq:number;lastInput:number;disconnected:number;lastRecover:number};
type Room={code:string;host:number;seats:Seat[];track:string;difficulty:Difficulty;race?:RaceSimulation;raceId:string;tick:number;eventId:number;events:any[];touched:number;verifyRun?:boolean;consumed?:number[]};
export function createRoomServer(options:{port?:number;host?:string;manual?:boolean;origins?:string[];verify?:boolean}={}){
 const rooms=new Map<string,Room>(),dist=resolve('dist');let steps=0,stepMs=0,maxStepMs=0;
 const origins=options.origins??(process.env.ASTRO_ORIGINS?.split(',').map(s=>s.trim())??['http://127.0.0.1:5173','http://localhost:5173','http://127.0.0.1:4173','http://localhost:4173','http://127.0.0.1:8787','http://localhost:8787']);
 const http=createServer(async(req,res)=>{
  if(req.url==='/health'){res.setHeader('Content-Type','application/json');res.end(JSON.stringify({ok:true,version:'1.0.0-rc.1',protocol:PROTOCOL,rooms:rooms.size,steps,meanStepMs:steps?stepMs/steps:0,maxStepMs,verify:!!options.verify}));return;}
  try{const pathname=decodeURIComponent(new URL(req.url??'/', 'http://local').pathname),path=resolve(dist,'.'+(pathname==='/'?'/index.html':pathname));if(!path.startsWith(dist+sep))throw Error('path');const data=await readFile(path);res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg'} as Record<string,string>)[extname(path)]??'application/octet-stream');res.end(data);}catch{res.statusCode=404;res.end('Not found');}
 });
 const wss=new WebSocketServer({noServer:true,maxPayload:8192,perMessageDeflate:false});
 http.on('upgrade',(req,socket,head)=>{if(req.url!=='/rooms'||!origins.includes(req.headers.origin??'')||wss.clients.size>=64){socket.end('HTTP/1.1 403 Forbidden\r\n\r\n');return;}wss.handleUpgrade(req,socket,head,ws=>wss.emit('connection',ws,req));});
 const send=(ws:WebSocket|undefined,m:unknown)=>{if(ws?.readyState===WebSocket.OPEN){if(ws.bufferedAmount>500000){ws.close(1013,'Slow connection');return;}if((m as {type?:string}).type==='state'&&ws.bufferedAmount>128000)return;ws.send(JSON.stringify(m));}};
 const broadcast=(r:Room,m:unknown)=>r.seats.forEach(s=>send(s.socket,m));
 const lobby=(r:Room)=>broadcast(r,{type:'lobby',code:r.code,host:r.host,track:r.track,difficulty:r.difficulty,racing:!!r.race,seats:r.seats.map(s=>({id:s.id,name:s.name,garage:s.garage,ready:s.ready,connected:!!s.socket})),bots:12-r.seats.length});
 function begin(r:Room){
  r.race=new RaceSimulation(createTrack(r.track),r.difficulty);r.raceId=randomUUID();r.tick=0;r.events=[];r.eventId=0;r.consumed=[-1,-1];
  for(const s of r.seats){r.race.racers[s.id].configure(s.garage);r.race.racers[s.id].livery.name=s.name;s.input=neutralInput();s.seq=0;s.lastRecover=-10;}
  lobby(r);snapshot(r);
 }
 function snapshot(r:Room){if(r.race)broadcast(r,{type:'state',raceId:r.raceId,tick:r.tick,track:r.track,race:raceSnapshot(r.race),events:r.events,seats:r.seats.map(s=>({id:s.id,connected:!!s.socket}))});}
 wss.on('connection',ws=>{
  let room:Room|undefined,seat:Seat|undefined,messages=0,windowStart=Date.now();
  const error=(message:string)=>send(ws,{type:'error',message});
  let alive=true;ws.on('pong',()=>{alive=true;});const heartbeat=setInterval(()=>{if(!alive){ws.terminate();return;}alive=false;ws.ping();},15000);
  const intro=setTimeout(()=>{if(!seat)ws.close(1008,'Join timeout');},10000);
  ws.on('error',()=>{});
  ws.on('message',data=>{
   if(Date.now()-windowStart>1000){messages=0;windowStart=Date.now();}if(++messages>(options.verify?100000:100)){ws.close(1008,'Rate limit');return;}
   let m:any;try{m=JSON.parse(data.toString());if(!m||typeof m.type!=='string')throw Error();}catch{error('Invalid message');return;}
   if(!seat){
    if(m.protocol!==PROTOCOL){error('Client version mismatch. Reload the game.');return;}
    if(m.type==='reconnect'){
     room=rooms.get(String(m.code));seat=room?.seats.find(s=>s.token===m.token&&!s.socket&&Date.now()-s.disconnected<30000);
     if(!seat){error('Reconnect window expired. Create or join another room.');return;}
    }else if(m.type==='create'||m.type==='join'){
     if(m.type==='create'){if(rooms.size>=16){error('Room server full');return;}let code:string;do{code=randomBytes(3).toString('hex').toUpperCase();}while(rooms.has(code));room={code,host:0,seats:[],track:'classic',difficulty:'normal',raceId:'',tick:0,eventId:0,events:[],touched:Date.now()};rooms.set(code,room);}
     else room=rooms.get(String(m.code).trim().toUpperCase());
     if(!room){error('Room not found. Check the code.');return;}
     if(room.race){error('Race already started. Join after the host returns to the lobby.');return;}
     if(room.seats.length>=2){error('This room has two guest seats.');return;}
     seat={id:room.seats.some(s=>s.id===0)?1:0,token:randomBytes(24).toString('hex'),name:cleanName(String(m.name??''))||'Guest',garage:validateGarage(m.garage),ready:false,input:neutralInput(),seq:0,lastInput:0,disconnected:0,lastRecover:-10};room.seats.push(seat);
    }else {error('Create or join a room first.');return;}
    seat.socket=ws;seat.disconnected=0;seat.seq=0;room!.touched=Date.now();clearTimeout(intro);send(ws,{type:'welcome',code:room!.code,racerId:seat.id,token:seat.token});lobby(room!);snapshot(room!);return;
   }
   const r=room!;r.touched=Date.now();
   if(m.type==='input'){
    if(!r.race||m.raceId!==r.raceId||!Number.isSafeInteger(m.seq)||m.seq<=seat.seq)return;
    const input=cleanInput(m.input);input.item=!!input.item||!!seat.input.item;input.trick=!!input.trick||!!seat.input.trick;seat.input=input;seat.seq=m.seq;seat.lastInput=Date.now();
    if(options.verify&&r.verifyRun&&r.race.status!=='finished'&&r.seats.every(s=>s.seq>(r.consumed?.[s.id]??-1))){r.consumed=r.seats.map(s=>s.seq);queueMicrotask(()=>{for(let i=0;i<3;i++)step(r);});}return;
   }
   if(m.type==='recover'){if(r.race?.status==='racing'&&Date.now()-seat.lastInput<1000&&r.race.elapsed-seat.lastRecover>=3){r.race.recover(seat.id);r.events.push({type:'recover',racer:seat.id,id:++r.eventId,tick:r.tick});seat.lastRecover=r.race.elapsed;}return;}
   if(m.type==='ready'&&!r.race){seat.ready=m.ready===true;lobby(r);return;}
   if(m.type==='settings'&&!r.race&&seat.id===r.host){if(Object.hasOwn(DESTINATIONS,m.track))r.track=m.track;if(Object.hasOwn(DIFFICULTIES,m.difficulty))r.difficulty=m.difficulty;for(const s of r.seats)s.ready=false;lobby(r);return;}
   if(m.type==='start'&&seat.id===r.host&&!r.race){if(r.seats.length!==2||r.seats.some(s=>!s.ready||!s.socket)){error('Both guests must join and be ready.');return;}begin(r);return;}
   if(m.type==='rematch'&&seat.id===r.host&&r.race?.status==='finished'){r.race=undefined;r.seats=r.seats.filter(s=>s.socket);r.host=r.seats[0]?.id??0;for(const s of r.seats)s.ready=false;lobby(r);return;}
   if(m.type==='verify-step'&&options.verify&&seat.id===r.host&&r.race){const count=Math.min(600,Math.max(0,Number(m.count)||0));for(let i=0;i<count;i++)step(r);snapshot(r);return;}
   if(m.type==='verify-run'&&options.verify&&seat.id===r.host){r.verifyRun=m.enabled===true;r.consumed=[-1,-1];if(r.verifyRun)for(let i=0;i<3;i++)step(r);return;}
   if(m.type==='ping')send(ws,{type:'pong',time:m.time});
  });
  ws.on('close',()=>{clearInterval(heartbeat);clearTimeout(intro);if(!room||!seat||seat.socket!==ws)return;seat.socket=undefined;seat.disconnected=Date.now();seat.ready=false;seat.input=neutralInput();room.touched=Date.now();if(!room.race){room.seats=room.seats.filter(s=>s!==seat);room.host=room.seats[0]?.id??0;}lobby(room);});
 });
 function step(target?:Room){const start=performance.now();for(const r of rooms.values()){
  if(!r.race||(target?r!==target:!!r.verifyRun))continue;const inputs=new Map<number,DriveInput>();for(const s of r.seats)if(s.socket){inputs.set(s.id,Date.now()-s.lastInput<500?s.input:neutralInput());}
  const previousStatus=r.race.status;r.race.step(neutralInput(),1/60,false,inputs);r.tick++;
  for(const e of r.race.events)r.events.push({...e,id:++r.eventId,tick:r.tick});r.events=r.events.slice(-96);
  for(const s of r.seats){s.input={...s.input,item:false,trick:false};}
  if(r.tick%3===0||previousStatus!=='finished'&&r.race.status==='finished')snapshot(r);
 }const elapsed=performance.now()-start;stepMs+=elapsed;maxStepMs=Math.max(maxStepMs,elapsed);steps++;}
 let last=performance.now(),accumulator=0;
 const timer=options.manual?undefined:setInterval(()=>{const now=performance.now();accumulator+=Math.min(.1,(now-last)/1000);last=now;for(let n=0;accumulator>=1/60&&n<6;n++){step();accumulator-=1/60;}},8);
 function maintain(){for(const [code,r]of rooms){const host=r.seats.find(s=>s.id===r.host);if(host&&!host.socket&&Date.now()-host.disconnected>=30000){const next=r.seats.find(s=>s.socket);if(next){r.host=next.id;lobby(r);}}const connected=r.seats.some(s=>s.socket);if(!connected&&Date.now()-r.touched>60000||Date.now()-r.touched>30*60*1000){broadcast(r,{type:'error',message:'Room expired. Create a new room.'});r.seats.forEach(s=>s.socket?.close());rooms.delete(code);}}}const expiry=setInterval(maintain,10000);
 http.listen(options.port??Number(process.env.ASTRO_PORT??8787),options.host??process.env.ASTRO_HOST??'127.0.0.1');
 return {http,rooms,step,maintain,close(){if(timer)clearInterval(timer);clearInterval(expiry);wss.clients.forEach(ws=>ws.terminate());wss.close();http.close();}};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){createRoomServer({verify:process.env.ASTRO_VERIFY==='1'});console.log(`Astro Racing 1.0.0-rc.1 room server http://${process.env.ASTRO_HOST??'127.0.0.1'}:${process.env.ASTRO_PORT??8787} — /health, /rooms`);}
