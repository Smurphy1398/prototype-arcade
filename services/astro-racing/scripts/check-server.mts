import {createRoomServer} from '../server/room-server.ts';
import {RaceSimulation} from '../src/race/RaceSimulation.ts';
import {createTrack} from '../src/tracks/catalog.ts';
import {applySnapshot} from '../src/network/protocol.ts';
import {WebSocket} from 'ws';
import assert from 'node:assert/strict';
import {once} from 'node:events';
import {writeFile} from 'node:fs/promises';

const origin='https://smurphy1398.github.io';
const server=createRoomServer({host:'127.0.0.1',port:8802,origins:[origin],verify:false});
await once(server.http,'listening');
const clients:any[]=[];
let sentBytes=0,receivedBytes=0;
const sleep=(ms:number)=>new Promise(r=>setTimeout(r,ms));
const until=async(fn:()=>unknown)=>{for(let n=0;n<200;n++){if(fn())return;await sleep(25);}throw Error('Timed out');};
try{
 const rejected=await new Promise<number>((resolve,reject)=>{const ws=new WebSocket('ws://127.0.0.1:8802/rooms',{origin:'https://unapproved.example'});ws.on('unexpected-response',(_req,res)=>{res.resume();ws.terminate();resolve(res.statusCode!);});ws.on('error',()=>{});ws.on('open',()=>{ws.close();reject(Error('Unapproved origin accepted'));});});
 assert.equal(rejected,403);
 for(let i=0;i<2;i++){
  const p:any={ws:new WebSocket('ws://127.0.0.1:8802/rooms',{origin}),seq:0,mirror:new RaceSimulation(createTrack('classic'),'hard')};
  p.send=(m:any)=>{const data=JSON.stringify(m);sentBytes+=Buffer.byteLength(data);p.ws.send(data);};
  p.ws.on('message',(data:any)=>{receivedBytes+=data.length;const m=JSON.parse(data.toString());if(m.type==='welcome'){p.id=m.racerId;p.code=m.code;}if(m.type==='lobby')p.lobby=m;if(m.type==='error')p.error=m.message;if(m.type==='state'){
   p.last=m;applySnapshot(p.mirror,m.race);const race=p.mirror,r=race.racers[p.id],recoveries=r.recoveries;
   const input=race.bots[p.id].update(r,race.racers,race.elapsed,.05,[...race.mechanics.dynamicHazards.filter(h=>h.active||h.warning),...race.items.traps]);
   if(r.recoveries>recoveries)p.send({type:'recover'});if(r.steeringRearm){input.steer=0;input.drift=false;}
   input.item=race.items.botShouldUse(r,race.racers,.6);
   p.send({type:'input',raceId:m.raceId,seq:++p.seq,input});
  }});
  await once(p.ws,'open');clients.push(p);p.send({type:i?'join':'create',protocol:2,name:i?'Guest check':'Host check',code:clients[0].code});await until(()=>p.code);
 }
 clients[0].send({type:'settings',track:'classic',difficulty:'hard'});await until(()=>clients[1].lobby?.difficulty==='hard');
 for(const p of clients)p.send({type:'ready',ready:true});await until(()=>clients[0].lobby.seats.every((s:any)=>s.ready));
 clients[0].send({type:'start'});await until(()=>clients.every(p=>p.last));
 const started=performance.now(),cpu=process.cpuUsage(),bytes=receivedBytes;
 await sleep(500);const before=clients[0].last.tick;clients[0].send({type:'verify-step',count:600});await sleep(200);assert.ok(clients[0].last.tick-before<40,'Production verification commands must not accelerate ticks');
 for(let i=0;i<6;i++){await sleep(10000);console.log('Normal server elapsed',clients[0].last.race.elapsed.toFixed(2));}
 const wallSeconds=(performance.now()-started)/1000,cpuDelta=process.cpuUsage(cpu);
 const health=await (await fetch('http://127.0.0.1:8802/health')).json();
 assert.equal(health.version,'1.0.0-rc.1');assert.equal(health.protocol,2);assert.equal(health.verify,false);
 assert.ok(clients[0].last.race.elapsed>wallSeconds-5);
 assert.ok(clients.every(p=>!p.error&&p.last.race.racers[p.id].progress.started));
 const report={status:'passed',method:'Local production-mode Node server, normal 60 Hz clock, two independent WebSocket clients with separate snapshot-based input pilots. Includes client CPU overhead; not hosted capacity or public browser proof.',originAccepted:origin,unapprovedOriginStatus:rejected,verificationAccelerationDisabled:true,health,wallSeconds,simulationSeconds:clients[0].last.race.elapsed,cpuCoreEquivalent:(cpuDelta.user+cpuDelta.system)/(wallSeconds*1e6),memoryMiB:process.memoryUsage().rss/1048576,outboundBytesPerSecond:(receivedBytes-bytes)/wallSeconds,clientInputBytes:sentBytes,peers:clients.map(p=>({id:p.id,tick:p.last.tick,position:p.last.race.racers[p.id].position}))};
 await writeFile(process.env.ASTRO_SERVER_REPORT??'server-check.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
}finally{for(const p of clients)p.ws.terminate();server.close();}
