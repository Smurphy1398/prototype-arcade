import {chromium} from 'file:///C:/Users/Simon/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright-core/index.mjs';
import {fileURLToPath} from 'node:url';
const out=fileURLToPath(new URL('../../evidence/rc2/',import.meta.url));
const browser=await chromium.launch({headless:true,channel:'msedge',args:['--enable-webgl','--ignore-gpu-blocklist']});
try{
 const page=await browser.newPage({viewport:{width:2560,height:1440},deviceScaleFactor:1});
 await page.goto('http://127.0.0.1:8803/?verify');await page.waitForFunction(()=>window.astroDebug?.game);
 await page.evaluate(()=>{const g=window.astroDebug.game;g.renderer.setAnimationLoop(null);g.changeTrack('classic');g.renderer.setPixelRatio(1);g.renderer.shadowMap.enabled=true;g.renderer.setSize(2560,1440);g.views.forEach(v=>v.group.visible=false);g.world.update(12);g.features.update(g.race,12);document.getElementById('ui').hidden=true;g.camera.fov=45;g.camera.aspect=2560/1440;g.camera.updateProjectionMatrix();});
 for(const [name,position,target] of [
  ['sunspun-overview',[170,145,260],[-65,0,25]],
  ['sunspun-coast',[100,45,135],[-40,0,25]],
  ['sunspun-road',[28,12,45],[-14,4,108]],
  ['sunspun-harbor',[-210,70,210],[-70,0,40]]
 ]){
  await page.evaluate(({position,target})=>{const g=window.astroDebug.game;g.camera.position.set(...position);g.camera.lookAt(...target);g.renderer.render(g.scene,g.camera);},{position,target});
  await page.screenshot({path:out+name+'.jpg',type:'jpeg',quality:95});
 }
 console.log('Saved four actual Sunspun Classic render compositions at 2560 × 1440.');
 await page.setViewportSize({width:1500,height:2000});
 await page.evaluate(()=>{const g=window.astroDebug.game;g.renderer.setSize(1500,2000);g.camera.aspect=.75;g.camera.fov=50;g.camera.updateProjectionMatrix();g.camera.position.set(28,12,45);g.camera.lookAt(-14,4,108);g.renderer.render(g.scene,g.camera);});
 await page.screenshot({path:out+'sunspun-card.jpg',type:'jpeg',quality:95});
}finally{await browser.close();}
