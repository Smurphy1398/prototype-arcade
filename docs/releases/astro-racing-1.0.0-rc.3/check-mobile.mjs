import {chromium} from 'file:///C:/Users/Simon/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright-core/index.mjs';
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const out=fileURLToPath(new URL('../../evidence/rc3/',import.meta.url));
const url=process.env.ASTRO_TEST_URL??'http://127.0.0.1:8806/?verify';
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
  else DeviceOrientationEvent.requestPermission=()=>{window.__permissionCalls=(window.__permissionCalls??0)+1;return permission==='pending'?new Promise(resolve=>window.__permissionResolve=resolve):Promise.resolve(permission==='no-data'?'granted':permission);};
 },{permission});
 const page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));
 await page.goto(url);await page.waitForFunction(()=>window.astroDebug?.game);
 await page.evaluate(()=>window.astroDebug.game.renderer.setAnimationLoop(null));return page;
}
async function motion(page,beta=0,gamma=0){await page.evaluate(({beta,gamma})=>{const e=new Event('deviceorientation');Object.assign(e,{beta,gamma});window.dispatchEvent(e);},{beta,gamma});}
async function startFixture(page){await page.evaluate(()=>{const g=window.astroDebug.game;g.changeTrack('classic');g.race.status='racing';g.setScreen('driving');g.race.recover();g.race.step({throttle:0,brake:0,steer:0,drift:false},1/60);g.frame(performance.now());g.hud.updateRace(g.race,g.time+1);});if(await page.locator('#touch-resume').isVisible())await page.locator('#touch-resume').tap();}
const controls=page=>page.evaluate(()=>window.astroDebug.game.input.read(false));
async function contacts(page,keys){return Promise.all(keys.map(async(key,i)=>{const r=await page.locator('[data-touch='+key+']').boundingBox();assert.ok(r,key+' visible');return {id:i+1,x:r.x+r.width/2,y:r.y+r.height/2};}));}
async function touch(cdp,type,points=[]){await cdp.send('Input.dispatchTouchEvent',{type,touchPoints:points});}
async function neutral(page){const c=await controls(page);assert.equal(c.throttle,0);assert.equal(c.brake,0);assert.equal(c.steer,0);assert.equal(c.drift,false);assert.ok(!c.item&&!c.trick);}
async function layout(page,label){
 const result=await page.evaluate(()=>{
  const selectors=['[data-touch=left]','[data-touch=right]','[data-touch=brake]','[data-touch=recenter]','[data-touch=drift]','[data-touch=item]','[data-touch=trick]','[data-touch=throttle]','.speedometer','.drift-panel','.session-label','.time-ticket','.item-ticket','[data-touch=pause]','[data-touch=mobile-controls]'];
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

async function calibrate(page,beta=12,gamma=60){for(let i=0;i<6;i++){await motion(page,beta,gamma);await page.waitForTimeout(45);}}
async function pointer(page,key,type,id){await page.locator('[data-touch='+key+']').dispatchEvent(type,{pointerId:id,pointerType:'touch',bubbles:true});}
try{
 const page=await pageFor();
 await page.evaluate(()=>window.astroDebug.game.action('start'));
 assert.ok(await page.locator('#mobile-control-sheet').isVisible());
 assert.equal(await page.locator('#mobile-auto').isChecked(),false);
 await page.locator('#tilt-enable').click();await motion(page,null,null);
 assert.ok(await page.locator('#mobile-done').isDisabled());
 await motion(page,12,60);assert.ok(await page.locator('#mobile-done').isDisabled());
 await calibrate(page);assert.ok(await page.locator('#mobile-done').isEnabled());
 assert.equal(await page.evaluate(()=>window.__permissionCalls),1);
 check('Permission gesture; invalid/one sample cannot calibrate; steady comfortable grip can');
 await page.locator('#mobile-done').click();await startFixture(page);await calibrate(page);
 assert.equal((await controls(page)).throttle,0);assert.equal((await controls(page)).steer,0);
 check('Fresh install defaults to hold-to-drive and centered phone steers straight');
 const cdp=await page.context().newCDPSession(page);
 const pts=await contacts(page,['throttle','drift','item','trick']);
 await touch(cdp,'touchStart',[pts[0]]);assert.equal((await controls(page)).throttle,1);
 await page.evaluate(()=>{const g=window.astroDebug.game;g.race.recover();for(let i=0;i<90;i++)g.race.step(g.input.read(false),1/60);});
 assert.ok(await page.evaluate(()=>window.astroDebug.game.race.player.state.speed>4));
 check('Held Drive accelerates the actual race simulation');
 await motion(page,-8,60);await page.waitForTimeout(90);
 await touch(cdp,'touchStart',pts);let c=await controls(page);
 assert.equal(c.throttle,1);assert.equal(c.drift,true);assert.equal(c.item,true);assert.equal(c.trick,true);assert.ok(c.steer>0);
 await page.evaluate(()=>window.astroDebug.game.input.acknowledge());
 await touch(cdp,'touchEnd',pts.slice(1));assert.equal((await controls(page)).throttle,1);
 await touch(cdp,'touchEnd',[]);assert.equal((await controls(page)).throttle,0);
 check('Native CDP four-finger Drive/Drift/Item/Trick and independent releases');
 await touch(cdp,'touchStart',[pts[0]]);
 // Synthetic per-pointer cancellation supplements native simultaneous touch.
 await touch(cdp,'touchStart',[pts[0],pts[2],pts[1]]);
 const ids=await page.evaluate(()=>Object.fromEntries([...window.astroDebug.game.mobile.held].map(([id,key])=>[key,id])));
 await pointer(page,'item','pointercancel',ids.item);assert.equal((await controls(page)).throttle,1);
 await pointer(page,'drift','lostpointercapture',ids.drift);assert.equal((await controls(page)).throttle,1);
 await touch(cdp,'touchEnd',[pts[1],pts[2]]);
 const brake=(await contacts(page,['brake']))[0];brake.id=9;
 await touch(cdp,'touchStart',[pts[0],brake]);c=await controls(page);assert.equal(c.throttle,0);assert.equal(c.brake,1);
 await touch(cdp,'touchEnd',[brake]);assert.equal((await controls(page)).throttle,1);
 await touch(cdp,'touchCancel',[]);assert.equal((await controls(page)).throttle,0);
 check('Unrelated cancellation/lost capture preserves Drive; brake overrides and release restores Drive; native cancel releases Drive');
 await calibrate(page);await motion(page,-3,60);await page.waitForTimeout(80);c=await controls(page);assert.ok(c.steer>0);
 await motion(page,12,60);assert.equal((await controls(page)).steer,0);
 await motion(page,32,60);await page.waitForTimeout(80);assert.ok((await controls(page)).steer<0);
 await motion(page,13,60);assert.equal((await controls(page)).steer,0);
 check('Left/right proportional direction, dead zone and immediate neutral return in landscape 90');
 await page.locator('[data-touch=recenter]').tap();await calibrate(page,30,70);assert.equal((await controls(page)).steer,0);
 check('Reachable Recenter uses new stable samples at a changed grip');
 await layout(page,'tilt-844x340');
 await page.evaluate(()=>{window.__orientation=270;window.dispatchEvent(new Event('orientationchange'));});
 await neutral(page);assert.equal(await page.evaluate(()=>window.astroDebug.game.screen),'paused');
 await page.evaluate(()=>window.astroDebug.game.action('pause'));await calibrate(page,-12,-60);
 await motion(page,8,-60);await page.waitForTimeout(90);assert.ok((await controls(page)).steer>0);
 await motion(page,-32,-60);await page.waitForTimeout(90);assert.ok((await controls(page)).steer<0);
 await motion(page,-12,-60);assert.equal((await controls(page)).steer,0);
 check('Rotation clears inputs/pauses; landscape 270 recalibrates and steers both ways');
 await motion(page,8,-60);await page.waitForTimeout(70);assert.ok((await controls(page)).steer>0);
 await motion(page,null,null);assert.equal((await controls(page)).steer,0);
 await calibrate(page,-12,-60);await motion(page,8,-60);await page.waitForTimeout(70);assert.ok((await controls(page)).steer>0);
 await page.waitForTimeout(550);assert.equal((await controls(page)).steer,0);
 assert.ok(await page.locator('[data-touch=left]').isVisible());
 check('Invalid readings neutralize immediately; stalled feed neutralizes and enables touch fallback');
 await page.evaluate(()=>window.astroDebug.game.action('mobile-controls'));await page.locator('#touch-enable').click();await page.locator('#mobile-done').click();
 const fallbackPts=await contacts(page,['throttle','left','drift']);await touch(cdp,'touchStart',fallbackPts);c=await controls(page);assert.equal(c.throttle,1);assert.equal(c.steer,-1);assert.equal(c.drift,true);
 await touch(cdp,'touchEnd',[]);await neutral(page);
 check('Touch steering fallback supports simultaneous Drive/left/Drift');
 for(const [w,h] of [[844,390],[667,300],[568,320],[390,760]]){await page.setViewportSize({width:w,height:h});await startFixture(page);await layout(page,'touch-'+w+'x'+h);}
 await page.setViewportSize({width:844,height:390});await startFixture(page);
 const drive=(await contacts(page,['throttle']))[0];await touch(cdp,'touchStart',[drive]);assert.equal((await controls(page)).throttle,1);
 await page.evaluate(()=>window.dispatchEvent(new Event('blur')));await neutral(page);assert.equal(await page.evaluate(()=>window.astroDebug.game.screen),'paused');
 await touch(cdp,'touchEnd',[]);await page.evaluate(()=>window.astroDebug.game.action('pause'));await neutral(page);
 check('Background/blur clears held Drive; explicit resume does not resurrect touches');
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{value:true,configurable:true});document.dispatchEvent(new Event('visibilitychange'));});await neutral(page);
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{value:false,configurable:true});document.dispatchEvent(new Event('visibilitychange'));window.dispatchEvent(new Event('pageshow'));});await neutral(page);
 check('Hidden page and restore stay neutral');
 await page.evaluate(()=>{localStorage.setItem('astro-mobile-v10',JSON.stringify({touch:'on',steering:'buttons',autoAccelerate:true,sensitivity:2.1,deadZone:5,smoothing:.22,graphics:'balanced',resolution:.9,setupDone:true}));});
 await page.reload();await page.waitForFunction(()=>window.astroDebug?.game);
 let prefs=await page.evaluate(()=>window.astroDebug.game.mobile.prefs);
 assert.equal(prefs.autoAccelerate,false);assert.equal(prefs.sensitivity,2.1);assert.equal(prefs.deadZone,5);assert.equal(prefs.smoothing,.22);assert.equal(prefs.graphics,'balanced');assert.equal(prefs.resolution,.9);assert.equal(prefs.steering,'buttons');assert.equal(prefs.setupDone,true);
 await page.evaluate(()=>window.astroDebug.game.action('mobile-controls'));await page.locator('#mobile-auto').check();await page.locator('#mobile-done').click();await page.reload();await page.waitForFunction(()=>window.astroDebug?.game);
 assert.equal(await page.evaluate(()=>window.astroDebug.game.mobile.prefs.autoAccelerate),true);
 check('RC2 auto-drive default corrected once without resetting tuning/graphics/setup; deliberate opt-in persists');
 for(const permission of ['denied','unavailable','pending','no-data']){
  const p=await pageFor(permission);await p.evaluate(()=>window.astroDebug.game.action('mobile-controls'));await p.locator('#tilt-enable').click();
  if(permission==='no-data')await p.waitForTimeout(2700);
  if(permission==='pending'){await p.locator('#touch-enable').click();await p.evaluate(()=>window.__permissionResolve('granted'));}
  assert.equal(await p.evaluate(()=>window.astroDebug.game.mobile.prefs.steering),'buttons');check('Permission '+permission+' uses touch fallback safely');
 }
 assert.equal(report.errors.length,0);report.passed=true;
}finally{writeFileSync(out+'mobile-checks.json',JSON.stringify(report,null,2)+'\n');await browser.close();}
