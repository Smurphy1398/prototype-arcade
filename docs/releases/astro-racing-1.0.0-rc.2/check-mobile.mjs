import {chromium} from 'file:///C:/Users/Simon/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright-core/index.mjs';
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const out=fileURLToPath(new URL('../../evidence/rc2/',import.meta.url));
const url=process.env.ASTRO_TEST_URL??'http://127.0.0.1:8803/?verify';
const report={url,kind:'Emulated Edge touch viewport, synthetic sensor permission/orientation, CDP simultaneous touch. Not a physical phone test.',checks:[],errors:[]};
const browser=await chromium.launch({headless:true,channel:'msedge',args:['--enable-webgl','--ignore-gpu-blocklist']});
const contexts=[];
const check=(name,data={})=>{report.checks.push({name,passed:true,...data});console.log('PASS',name);};
async function pageFor(permission='granted',mobile=true){
 const context=await browser.newContext({viewport:mobile?{width:844,height:340}:{width:1280,height:800},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1});contexts.push(context);
 await context.addInitScript(({permission})=>{
  window.__orientation=90;
  Object.defineProperty(screen.orientation,'angle',{get:()=>window.__orientation,configurable:true});
  if(permission==='unavailable')Object.defineProperty(window,'DeviceOrientationEvent',{value:undefined,configurable:true});
  else DeviceOrientationEvent.requestPermission=()=>{window.__permissionCalls=(window.__permissionCalls??0)+1;return permission==='pending'?new Promise(resolve=>window.__permissionResolve=resolve):Promise.resolve(permission);};
 },{permission});
 const page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));
 await page.goto(url);await page.waitForFunction(()=>window.astroDebug?.game);
 await page.evaluate(()=>window.astroDebug.game.renderer.setAnimationLoop(null));return page;
}
async function motion(page,beta=0,gamma=0){await page.evaluate(({beta,gamma})=>{const e=new Event('deviceorientation');Object.assign(e,{beta,gamma});window.dispatchEvent(e);},{beta,gamma});}
async function startFixture(page){await page.evaluate(()=>{const g=window.astroDebug.game;g.changeTrack('volcano');g.race.status='racing';g.setScreen('driving');g.race.player.physics.reset(25);g.frame(performance.now());g.hud.updateRace(g.race,g.time+1);});}
const controls=page=>page.evaluate(()=>window.astroDebug.game.input.read(false));
async function contacts(page,keys){return Promise.all(keys.map(async(key,i)=>{const r=await page.locator('[data-touch='+key+']').boundingBox();assert.ok(r,key+' visible');return {id:i+1,x:r.x+r.width/2,y:r.y+r.height/2};}));}
async function touch(cdp,type,points=[]){await cdp.send('Input.dispatchTouchEvent',{type,touchPoints:points});}
async function neutral(page){const c=await controls(page);assert.equal(c.throttle,0);assert.equal(c.brake,0);assert.equal(c.steer,0);assert.equal(c.drift,false);assert.ok(!c.item&&!c.trick);}
async function layout(page,label){
 const result=await page.evaluate(()=>{
  const selectors=['[data-touch=left]','[data-touch=right]','[data-touch=brake]','[data-touch=recenter]','[data-touch=drift]','[data-touch=item]','[data-touch=trick]','[data-touch=throttle]','.speedometer','.drift-panel','.session-label','.time-ticket','.item-ticket','.touch-top'];
  const bounds=selectors.map(selector=>{const el=document.querySelector(selector),r=el.getBoundingClientRect();return {selector,x:r.x,y:r.y,w:r.width,h:r.height,visible:!!r.width&&!!r.height&&getComputedStyle(el).display!=='none'};}).filter(b=>b.visible);
  return {width:innerWidth,height:innerHeight,bounds};
 });
 await page.screenshot({path:out+label+'.png'});
 for(const b of result.bounds)assert.ok(b.x>=-.5&&b.y>=-.5&&b.x+b.w<=result.width+.5&&b.y+b.h<=result.height+.5,label+' out of viewport '+JSON.stringify(b));
 for(let i=0;i<result.bounds.length;i++)for(let j=i+1;j<result.bounds.length;j++){
  const a=result.bounds[i],b=result.bounds[j];const intersects=Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x)>.5&&Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y)>.5;
  assert.ok(!intersects,label+' overlap '+JSON.stringify([a,b]));
 }
 await page.screenshot({path:out+label+'.png'});check(label,result);
}
try{
 const page=await pageFor();
 await page.evaluate(()=>window.astroDebug.game.action('start'));
 assert.ok(await page.locator('#mobile-control-sheet').isVisible());
 assert.ok(await page.locator('#mobile-auto').isChecked());
 assert.ok(await page.locator('#mobile-done').isDisabled());
 await page.locator('#tilt-enable').click();await motion(page,12);
 assert.equal(await page.evaluate(()=>window.__permissionCalls),1);
 assert.ok(await page.locator('#mobile-done').isEnabled());
 await page.screenshot({path:out+'tilt-setup.png'});
 await page.locator('#mobile-done').click();await startFixture(page);await motion(page,12);
 assert.equal((await controls(page)).throttle,1);assert.equal((await controls(page)).steer,0);
 assert.ok(await page.locator('[data-touch=left]').isHidden());assert.ok(await page.locator('[data-touch=throttle]').isHidden());
 check('Default tilt permission, landscape calibration, default auto-drive, hidden arrows/gas');
 const cdp=await page.context().newCDPSession(page);
 await motion(page,32);await page.waitForTimeout(80);
 const pts=await contacts(page,['drift','item','trick']);
 await page.evaluate(()=>{const g=window.astroDebug.game,p=g.race.player;p.item='tripleBoost';p.charges=3;p.heldTime=1;p.state.speed=18;p.state.vx=Math.sin(p.state.heading)*18;p.state.vz=Math.cos(p.state.heading)*18;});
 await touch(cdp,'touchStart',pts);
 let c=await controls(page);assert.equal(c.throttle,1);assert.ok(c.steer>.2);assert.equal(c.drift,true);assert.equal(c.item,true);assert.equal(c.trick,true);
 await page.evaluate(()=>{const g=window.astroDebug.game;g.race.step(g.input.read(false),1/60);g.input.acknowledge();});
 assert.equal(await page.evaluate(()=>window.astroDebug.game.race.player.charges),2);
 assert.equal((await controls(page)).item,false);
 await touch(cdp,'touchEnd',[pts[1],pts[2]]);c=await controls(page);assert.equal(c.drift,true);assert.ok(c.steer>.2);
 await touch(cdp,'touchEnd',[]);assert.equal((await controls(page)).drift,false);
 check('Tilt + drift + item + trick simultaneous, one charge consumed; releasing right thumb preserves drift');
 await motion(page,32);await page.locator('[data-touch=recenter]').tap();assert.ok(Math.abs((await controls(page)).steer)<.01);
 const brake=await contacts(page,['brake']);await touch(cdp,'touchStart',brake);c=await controls(page);assert.equal(c.throttle,0);assert.equal(c.brake,1);await touch(cdp,'touchEnd',[]);
 await layout(page,'tilt-volcano-844x340');
 check('Recenter and brake override');
 // Browser chrome changing height within landscape must not pause or reset held input.
 await touch(cdp,'touchStart',await contacts(page,['drift']));await page.setViewportSize({width:844,height:390});
 assert.equal(await page.evaluate(()=>window.astroDebug.snapshot().screen),'driving');await touch(cdp,'touchEnd',[]);check('Address-bar height changes keep race active');
 await page.evaluate(()=>{window.__orientation=270;window.dispatchEvent(new Event('orientationchange'));});
 assert.equal(await page.evaluate(()=>window.astroDebug.snapshot().screen),'paused');await neutral(page);
 await page.evaluate(()=>window.astroDebug.game.action('pause'));await motion(page,10);assert.ok(Math.abs((await controls(page)).steer)<.01);
 await motion(page,30);await page.waitForTimeout(80);assert.ok((await controls(page)).steer<-.2);check('Opposite landscape orientation pauses, recalibrates, and reverses sensor axis');
 await page.setViewportSize({width:390,height:760});await neutral(page);
 await page.evaluate(()=>window.astroDebug.game.action('pause'));await neutral(page);assert.ok(await page.locator('.touch-notice').isVisible());
 await page.setViewportSize({width:844,height:340});await page.evaluate(()=>window.astroDebug.game.action('pause'));await motion(page,10);check('Portrait blocks tilt auto-drive; landscape resume resets input');
 await page.locator('[data-touch=mobile-controls]').tap();await page.locator('#touch-enable').click();await page.locator('#mobile-done').click();
 let touches=await contacts(page,['left','drift','item']);await touch(cdp,'touchStart',touches);
 c=await controls(page);assert.equal(c.steer,-1);assert.equal(c.drift,true);assert.equal(c.item,true);assert.equal(c.throttle,1);
 await touch(cdp,'touchCancel',[]);await neutral(page);assert.equal(await page.evaluate(()=>window.astroDebug.snapshot().screen),'paused');
 await page.evaluate(()=>window.astroDebug.game.action('pause'));check('Touch arrows + drift + item simultaneous; cancellation clears all and pauses solo');
 // Single left thumb can steer and begin the drift after sliding, while right thumb uses an item.
 touches=await contacts(page,['drift','item']);await touch(cdp,'touchStart',touches);assert.equal((await controls(page)).drift,false);
 await page.evaluate(()=>{const p=window.astroDebug.game.race.player;p.physics.reset(30);p.state.speed=18;p.state.vx=Math.sin(p.state.heading)*18;p.state.vz=Math.cos(p.state.heading)*18;p.physics.step(window.astroDebug.game.input.read(false),1/60);});
 touches[0].x+=36;await touch(cdp,'touchMove',touches);c=await controls(page);assert.ok(c.steer>.8);assert.equal(c.drift,true);
 await page.evaluate(()=>{const g=window.astroDebug.game;g.race.player.physics.step(g.input.read(false),1/60);});
 assert.equal(await page.evaluate(()=>window.astroDebug.game.race.player.state.drifting),true);
 await touch(cdp,'touchEnd',[]);check('Touch fallback Drift slide starts a real physics drift with a single left thumb');
 await page.locator('[data-touch=mobile-controls]').tap();await page.locator('#mobile-auto').uncheck();
 await page.locator('summary').filter({hasText:'Tilt tuning'}).click();
 await page.locator('#mobile-sensitivity').fill('2');await page.locator('#mobile-deadZone').fill('5');await page.locator('#mobile-smoothing').fill('0.2');
 await page.locator('#mobile-done').click();assert.equal((await controls(page)).throttle,0);assert.ok(await page.locator('[data-touch=throttle]').isVisible());
 await touch(cdp,'touchStart',await contacts(page,['throttle','brake']));c=await controls(page);assert.equal(c.throttle,0);assert.equal(c.brake,1);
 await touch(cdp,'touchEnd',[]);check('Manual Drive option and brake override even when both are held');
 // Lost capture and background never resume the throttle by themselves.
 await touch(cdp,'touchStart',await contacts(page,['throttle']));
 const initialMove=await contacts(page,['throttle']);initialMove[0].x+=4;await touch(cdp,'touchMove',initialMove);await page.waitForTimeout(30);
 await page.evaluate(()=>{const b=document.querySelector('[data-touch=throttle]');b.releasePointerCapture([...window.astroDebug.game.mobile.held.keys()][0]);});
 const moved=await contacts(page,['throttle']);moved[0].x+=8;await touch(cdp,'touchMove',moved);await page.waitForTimeout(30);await neutral(page);await touch(cdp,'touchEnd',[]);
 await page.evaluate(()=>window.astroDebug.game.action('pause'));
 await touch(cdp,'touchStart',await contacts(page,['throttle']));await page.evaluate(()=>window.dispatchEvent(new Event('blur')));await neutral(page);
 await page.evaluate(()=>window.dispatchEvent(new Event('focus')));await neutral(page);await touch(cdp,'touchEnd',[]);
 check('Lost pointer capture and blur/focus release inputs until explicit resume');
 await page.evaluate(()=>{const g=window.astroDebug.game;g.action('pause');Object.defineProperty(document,'hidden',{value:true,configurable:true});document.dispatchEvent(new Event('visibilitychange'));});await neutral(page);
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{value:false,configurable:true});document.dispatchEvent(new Event('visibilitychange'));});await neutral(page);
 await page.evaluate(()=>{window.astroDebug.game.action('pause');window.dispatchEvent(new Event('pagehide'));});await neutral(page);check('Visibility change and pagehide neutralize input; returning remains paused');
 await page.evaluate(()=>window.astroDebug.game.action('mobile-controls'));await page.locator('#mobile-recover').click();
 assert.ok(await page.evaluate(()=>window.astroDebug.game.race.player.recoveries)>0);check('Return kart to road resumes and invokes approved recovery');
 for(const [width,height] of [[844,340],[667,300],[568,320],[390,760]]){
  await page.setViewportSize({width,height});await page.evaluate(()=>{const g=window.astroDebug.game;g.setScreen('paused');g.setScreen('driving');g.chase.snap(g.race.player.state);g.frame(performance.now());g.hud.updateRace(g.race,g.time+10);});
  await layout(page,`touch-manual-${width}x${height}`);
 }
 await page.setViewportSize({width:844,height:340});await page.evaluate(()=>{const g=window.astroDebug.game;g.setScreen('driving');for(const [key,value] of Object.entries({'--touch-left':'44px','--touch-right':'44px','--touch-bottom':'21px','--touch-top':'8px'}))document.documentElement.style.setProperty(key,value);});
 await layout(page,'touch-safe-insets');
 await page.reload();await page.waitForFunction(()=>window.astroDebug?.game);await page.evaluate(()=>window.astroDebug.game.renderer.setAnimationLoop(null));
 const prefs=await page.evaluate(()=>window.astroDebug.game.mobile.prefs);assert.equal(prefs.steering,'buttons');assert.equal(prefs.autoAccelerate,false);assert.equal(prefs.sensitivity,2);assert.equal(prefs.deadZone,5);assert.equal(prefs.smoothing,.2);check('Steering, auto-drive, sensitivity, dead zone and smoothing persist',prefs);
 for(const permission of ['denied','unavailable','granted','pending']){
  const p=await pageFor(permission);await p.evaluate(()=>window.astroDebug.game.action('start'));await p.locator('#tilt-enable').click();
  if(permission==='granted')await p.waitForTimeout(2700);
  if(permission==='pending'){await p.locator('#touch-enable').click();await p.evaluate(()=>window.__permissionResolve('granted'));}
  await p.waitForFunction(()=>window.astroDebug.game.mobile.prefs.steering==='buttons');
  assert.ok(await p.locator('#mobile-done').isEnabled());await p.locator('#mobile-done').click();await startFixture(p);
  assert.ok(await p.locator('[data-touch=left]').isVisible());check(`Tilt ${permission==='granted'?'no sensor data':permission} falls back to usable touch`);
  await p.context().close();
 }
 const desktop=await pageFor('granted',false);await startFixture(desktop);assert.ok(await desktop.locator('#touch-controls').isHidden());assert.equal((await controls(desktop)).throttle,0);
 await desktop.keyboard.down('w');await desktop.keyboard.down('a');await desktop.keyboard.down('Space');await desktop.keyboard.press('q');c=await controls(desktop);assert.equal(c.throttle,1);assert.equal(c.steer,-1);assert.equal(c.drift,true);assert.equal(c.item,true);
 await desktop.screenshot({path:out+'desktop-controls.png'});check('Desktop keyboard controls preserved; mobile auto-drive does not engage');
 assert.deepEqual(report.errors,[]);report.passed=true;
}catch(e){report.passed=false;report.failure=e.stack;throw e;}
finally{writeFileSync(out+'mobile-checks.json',JSON.stringify(report,null,2));await browser.close();}
