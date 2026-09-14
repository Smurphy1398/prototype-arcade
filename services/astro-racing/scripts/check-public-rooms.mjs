import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const {chromium}=await import(process.env.ASTRO_PLAYWRIGHT_MODULE??'playwright');
const endpoint=process.env.ASTRO_PUBLIC_ROOM_URL;
const gameURL=process.env.ASTRO_PUBLIC_GAME_URL??'https://smurphy1398.github.io/prototype-arcade/games/astro-racing/index.html';
assert.ok(endpoint,'Set ASTRO_PUBLIC_ROOM_URL to the actual deployed wss://HOST/rooms endpoint.');
const server=new URL(endpoint),game=new URL(gameURL),local=process.env.ASTRO_ALLOW_LOCAL==='1';
if(!local){assert.equal(server.protocol,'wss:');assert.equal(game.protocol,'https:');assert.ok(!['localhost','127.0.0.1','::1'].includes(server.hostname));}
const healthURL=new URL('/health',server);healthURL.protocol=server.protocol==='wss:'?'https:':'http:';
const health=await (await fetch(healthURL)).json();assert.equal(health.ok,true);assert.equal(health.version,'1.0.0-rc.1');assert.equal(health.protocol,2);assert.equal(health.verify,false);
const out=process.env.ASTRO_ROOM_EVIDENCE??'room-evidence';await fs.mkdir(out,{recursive:true});
const report={method:`${local?'Local preparation check':'Public deployment check'}: two independent browser contexts, actual guest share link, separate automated input pilots, normal server time. Client ?verify exposes diagnostics only; no server acceleration or physics edits. Not physical devices or two people.`,game:game.href,endpoint,health,at:new Date().toISOString(),errors:[],races:[]};
const browser=await chromium.launch({headless:true,channel:process.env.ASTRO_BROWSER_CHANNEL??'msedge',args:['--enable-webgl','--ignore-gpu-blocklist']});
try{
 const contexts=await Promise.all([0,1].map(()=>browser.newContext({viewport:{width:1100,height:700},permissions:['clipboard-read','clipboard-write']})));
 const pages=await Promise.all(contexts.map(c=>c.newPage()));
 for(const p of pages)p.on('pageerror',e=>report.errors.push(String(e)));
 const host=new URL(game);host.searchParams.set('server',endpoint);host.searchParams.set('verify','');
 await pages[0].goto(host.href);await pages[0].locator('#open-online').click();await pages[0].locator('#guest-name').fill('Host verification');await pages[0].locator('#room-create').click();await pages[0].locator('#room-copy').waitFor({state:'visible'});
 await pages[0].locator('#room-copy').click();await pages[0].waitForFunction(()=>document.querySelector('#room-message').textContent==='Join link copied.');
 const shared=await pages[0].evaluate(()=>navigator.clipboard.readText());const join=new URL(shared);assert.equal(join.searchParams.get('server'),endpoint);assert.match(join.searchParams.get('room'),/^[A-F0-9]{6}$/);assert.equal(join.pathname,game.pathname);
 report.joinLink=shared;
 // First verify the exact owner's copied link without diagnostic additions.
 await pages[1].goto(shared);await pages[1].locator('#room-join').waitFor({state:'visible'});assert.equal(await pages[1].locator('#room-endpoint').inputValue(),endpoint);assert.equal(await pages[1].locator('#room-code').inputValue(),join.searchParams.get('room'));
 report.guestLinkPrefills=true;join.searchParams.set('verify','');await pages[1].goto(join.href);await pages[1].locator('#guest-name').fill('Guest verification');await pages[1].locator('#room-join').click();
 await pages[1].waitForFunction(()=>window.astroDebug?.game?.roomPanel.room?.seats.length===2);
 for(const p of pages)await p.evaluate(()=>{
  const g=window.astroDebug.game;g.nextInput=Infinity;g.mobile.prefs.graphics='mobile';g.mobile.prefs.resolution=.7;g.applyGraphics();
  window.pilotMessages=0;window.pilotTimer=setInterval(()=>{
   if(!g.networkRace||!g.roomClient.connected||g.race.status==='finished')return;
   const race=g.race,r=race.player,before=r.recoveries;
   const input=race.bots[race.localPlayerId].update(r,race.racers,race.elapsed,.05,[...race.mechanics.dynamicHazards.filter(h=>h.active||h.warning),...race.items.traps]);
   if(r.recoveries>before)g.roomClient.send({type:'recover'});if(r.steeringRearm){input.steer=0;input.drift=false;}
   input.item=race.items.botShouldUse(r,race.racers,.6);g.roomClient.input(input);window.pilotMessages++;
  },50);
 });
 let previousRace='';
 for(let attempt=0;attempt<2;attempt++){
  await pages[0].locator('#room-track').selectOption('candy');await pages[0].locator('#room-difficulty').selectOption('hard');
  await pages[1].waitForFunction(()=>window.astroDebug.game.roomPanel.room.track==='candy'&&window.astroDebug.game.roomPanel.room.difficulty==='hard');
  for(const p of pages)await p.locator('#room-ready').click();await pages[0].locator('#room-start').click();
  await pages[0].waitForFunction(old=>window.astroDebug.snapshot().network?.raceId&&window.astroDebug.snapshot().network.raceId!==old,previousRace);
  const start=Date.now();
  for(let seconds=0;seconds<600;seconds+=5){await pages[0].waitForTimeout(5000);const s=await pages[0].evaluate(()=>window.astroDebug.snapshot());if(seconds%30===0)console.log(`Race ${attempt+1}: ${s.elapsed.toFixed(1)}s, ${s.finishOrder.length}/12 finished`);if(s.raceStatus==='finished')break;if(seconds===595)throw Error('Race exceeded ten-minute timeout');}
  await pages[1].waitForFunction(()=>window.astroDebug.snapshot().raceStatus==='finished');
  const peers=await Promise.all(pages.map(p=>p.evaluate(()=>({snapshot:window.astroDebug.snapshot(),times:window.astroDebug.game.race.racers.map(r=>r.progress.finishTime),messages:window.pilotMessages}))));
  assert.deepEqual(peers[0].times,peers[1].times);assert.deepEqual(peers[0].snapshot.finishOrder,peers[1].snapshot.finishOrder);assert.equal(peers[0].snapshot.finishOrder.length,12);
  assert.equal(peers[0].snapshot.network.racerId,0);assert.equal(peers[1].snapshot.network.racerId,1);assert.equal(peers[0].snapshot.network.raceId,peers[1].snapshot.network.raceId);
  const wallSeconds=(Date.now()-start)/1000;assert.ok(peers[0].snapshot.elapsed<wallSeconds+3,'Unexpected acceleration');
  previousRace=peers[0].snapshot.network.raceId;
  for(const [i,p]of pages.entries())await p.screenshot({path:`${out}/race-${attempt+1}-peer-${i}.png`});
  report.races.push({attempt:attempt+1,wallSeconds,peers,agreed:true});await fs.writeFile(out+'/report.json',JSON.stringify(report,null,2)+'\n');
  if(attempt===0){await pages[0].locator('#rematch').click();await pages[1].waitForFunction(()=>!window.astroDebug.game.roomPanel.room.racing);report.rematchLobby=true;}
 }
 assert.equal(report.errors.length,0);report.status='passed';console.log('PASS: guest link, two separate clients, full race and full rematch on normal server time.');
}catch(e){report.status='failed';report.failure=String(e);throw e;}
finally{await fs.writeFile(out+'/report.json',JSON.stringify(report,null,2)+'\n');await browser.close();}
