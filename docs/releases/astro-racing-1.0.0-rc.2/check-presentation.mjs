import {chromium} from 'file:///C:/Users/Simon/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright-core/index.mjs';
import {fileURLToPath} from 'node:url';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const out=fileURLToPath(new URL('../../evidence/rc2/',import.meta.url));
const base=process.env.ARCADE_BASE??'http://127.0.0.1:8804/';
const manifest=JSON.parse(readFileSync(new URL('../../arcade/services/astro-racing/RELEASE-MANIFEST.json',import.meta.url),'utf8'));
const browser=await chromium.launch({headless:true,channel:'msedge',args:['--enable-webgl','--ignore-gpu-blocklist']});
const report={base,checkedAt:new Date().toISOString(),version:manifest.version,checks:[],errors:[],kind:'Browser verification; phone checks are emulated, not physical.'};
try{
 const context=await browser.newContext({viewport:{width:1280,height:900},deviceScaleFactor:1});const page=await context.newPage();
 page.on('pageerror',e=>report.errors.push(e.message));
 for(const [relative,hash] of Object.entries(manifest.distFiles)){
  const r=await context.request.get(base+'games/astro-racing/'+relative);assert.equal(r.status(),200,relative);assert.equal(createHash('sha256').update(await r.body()).digest('hex'),hash,relative);
 }
 for(const [relative,hash] of Object.entries(manifest.presentation)){
  const r=await context.request.get(base+relative);assert.equal(r.status(),200,relative);assert.equal(createHash('sha256').update(await r.body()).digest('hex'),hash,relative);
 }
 report.checks.push('All 25 active runtime hashes and both promotional image hashes match RC2 manifest');
 await page.goto(base);const cabinet=page.locator('.cabinet').filter({hasText:'Astro Racing'});await cabinet.scrollIntoViewIfNeeded();
 assert.ok((await cabinet.locator('img').getAttribute('src')).includes('sunspun-card-rc2'));await cabinet.screenshot({path:out+'arcade-card-desktop.png'});
 await cabinet.getByRole('link',{name:'Play',exact:true}).click();assert.ok(page.url().includes('games/astro-racing.html'));
 await page.locator('main>img').waitFor();await page.screenshot({path:out+'landing-desktop.png',fullPage:true});
 assert.ok((await page.locator('main>img').getAttribute('src')).includes('sunspun-rc2'));assert.ok((await page.locator('#rooms').textContent()).includes('not available'));
 await page.locator('#launch').click();await page.waitForFunction(()=>window.astroDebug?.snapshot().build.includes('rc.2'));
 assert.equal(new URL(page.url()).pathname,new URL(base).pathname+'games/astro-racing/index.html');
 assert.equal(await page.locator('[data-track]').count(),16);await page.locator('#start').click();await page.locator('[data-track="classic"]').click();
 await page.getByRole('button',{name:/start race/i}).click();await page.waitForFunction(()=>window.astroDebug.snapshot().screen==='driving');
 await page.keyboard.down('w');await page.waitForTimeout(1000);await page.keyboard.up('w');assert.ok((await page.evaluate(()=>window.astroDebug.snapshot().racers[0].kart.speed))>2);
 report.checks.push('Arcade card → landing → correct RC2 game; 16 previews, keyboard driving, public room availability disclosed');
 const phoneContext=await browser.newContext({viewport:{width:390,height:760},deviceScaleFactor:1,isMobile:true,hasTouch:true});const phone=await phoneContext.newPage();phone.on('pageerror',e=>report.errors.push(e.message));
 await phone.goto(base+'games/astro-racing.html');await phone.screenshot({path:out+'landing-mobile.png',fullPage:true});
 assert.ok(await phone.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await phone.goto(base);const card=phone.locator('.cabinet').filter({hasText:'Astro Racing'});await card.scrollIntoViewIfNeeded();await card.screenshot({path:out+'arcade-card-mobile.png'});
 await phoneContext.addInitScript(()=>{DeviceOrientationEvent.requestPermission=()=>Promise.resolve('granted');Object.defineProperty(screen.orientation,'angle',{value:90,configurable:true});});
 await phone.setViewportSize({width:844,height:340});await phone.goto(base+'games/astro-racing/index.html');await phone.waitForFunction(()=>window.astroDebug);
 await phone.locator('#start').click();await phone.locator('[data-track="volcano"]').click();await phone.getByRole('button',{name:/start race/i}).click();
 await phone.locator('#tilt-enable').click();await phone.evaluate(()=>{setInterval(()=>{const e=new Event('deviceorientation');Object.assign(e,{beta:12,gamma:0});window.dispatchEvent(e);},50);});
 await phone.waitForFunction(()=>!document.querySelector('#mobile-done').disabled);await phone.locator('#mobile-done').click();await phone.waitForFunction(()=>window.astroDebug.snapshot().screen==='driving');await phone.waitForTimeout(1200);
 assert.ok(await phone.locator('[data-touch=left]').isHidden());assert.ok(await phone.locator('[data-touch=throttle]').isHidden());assert.ok((await phone.evaluate(()=>window.astroDebug.snapshot().racers[0].kart.speed))>2);
 await phone.screenshot({path:out+'phone-tilt-live-render.png'});
 assert.ok(!(await phone.locator('#drift-label').textContent()).includes('SPACE'));report.checks.push('Actual UI path: choose Volcano, Enable Tilt, calibrate, countdown, auto-accelerate; emulated permission/sensor');
 await phone.locator('[data-touch=mobile-controls]').tap();await phone.locator('#touch-enable').click();await phone.locator('#mobile-done').click();await phone.setViewportSize({width:568,height:320});await phone.waitForTimeout(250);
 if(await phone.locator('#resume').isVisible())await phone.locator('#resume').click();await phone.waitForTimeout(250);await phone.screenshot({path:out+'phone-touch-live-render-568x320.png'});
 report.checks.push('Desktop/mobile landing and cabinet crops, compact 844×340 tilt and 568×320 touch render inspected');
 report.build=await page.evaluate(()=>window.astroDebug.snapshot().build);assert.deepEqual(report.errors,[]);report.passed=true;
 console.log(JSON.stringify(report,null,2));
}catch(e){report.passed=false;report.failure=e.stack;throw e;}finally{writeFileSync(out+(base.startsWith('https:')?'public-presentation.json':'local-presentation.json'),JSON.stringify(report,null,2));await browser.close();}
