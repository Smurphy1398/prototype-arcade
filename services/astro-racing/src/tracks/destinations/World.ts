import {refineRoad,clipRoadSkirt} from '../refineRoad';
import {CityFinish} from './CityFinish';
import {PlayroomFinish} from './PlayroomFinish';
import {EnvironmentFinish} from './EnvironmentFinish';
import {enclosurePanel,doorway,structural} from '../enclosure';
import {ExpeditionScenery} from './ExpeditionScenery';
import {expedition} from './expeditions';
import { LivingScenery } from './LivingScenery';
import * as THREE from 'three';
import { clearScenery } from '../sceneryClearance';
import { mergeStatic } from '../../core/mergeStatic';
import { random } from '../../core/math';
import { DestinationTrack } from './track';
import { surfacePatch } from '../surfacePatch';
import { WildScenery } from './WildScenery';
/** Destination architecture is authored around the same surface/edge queries used by every racer. */
export class DestinationWorld {
  readonly group=new THREE.Group();private materials=new Map<number,THREE.MeshStandardMaterial>();
  private starMaterial=new THREE.MeshBasicMaterial({color:0xc5e4ed});private lampMaterial=new THREE.MeshBasicMaterial({color:0xffd994});
  private rng=random(307);private water:THREE.Mesh;private beacon?:THREE.Mesh;
  private finalPolish?:CityFinish|PlayroomFinish|EnvironmentFinish;private wild?:WildScenery;private living:LivingScenery;private expeditionWorld?:ExpeditionScenery;quality='high';
  constructor(readonly track:DestinationTrack,scene:THREE.Scene){
    const night=['hotel','orbital','vegas','atlantis'].includes(track.theme),sky=track.theme==='orbital'?0x10162d:track.theme==='factory'?0x86a4ad:night?0x131e3b:0x9bdedb;scene.background=new THREE.Color(sky);scene.fog=new THREE.Fog(track.theme==='orbital'?0x17223c:track.theme==='factory'?0xa5b3b1:night?0x243353:0xb7e5df,night?200:260,night?750:850);scene.add(this.group);
    const hemi=new THREE.HemisphereLight(track.id==='glacier'?0xc8eeff:night?0x95b7ee:0xe5fff6,track.id==='glacier'?0x638cab:night?0x493954:0x9b8758,night?2.3:2.6);scene.add(hemi);
    const sun=new THREE.DirectionalLight(night?0xc4d0ff:0xffe8b6,night?2.2:3);sun.position.set(160,260,-170);scene.add(sun);
    const wild=track.id==='vietnam'||track.id==='volcano';
    if(wild){scene.background=new THREE.Color(track.id==='vietnam'?0xa6b6a1:0x332532);scene.fog=new THREE.Fog(track.id==='vietnam'?0x8d9f83:0x59363d,150,650);}
    this.road();const roadObjects=new Set<THREE.Object3D>();this.group.traverse(o=>roadObjects.add(o));this.living=new LivingScenery(track,scene);if(expedition(track.id))this.expeditionWorld=new ExpeditionScenery(track,scene);else if(track.id==='glacier'){}else if(wild)this.wild=new WildScenery(track,scene);else {this.landscape();this.landmarks();}this.signs();clearScenery(this.group,track,roadObjects);mergeStatic(this.group);
    if(['dc','nyc','vegas'].includes(track.id))this.finalPolish=new CityFinish(track,scene);
    if(track.id==='toybox')this.finalPolish=new PlayroomFinish(track,scene);
    if(['glacier','atlantis','vietnam','volcano'].includes(track.id))this.finalPolish=new EnvironmentFinish(track,scene);
    this.water=new THREE.Mesh(new THREE.PlaneGeometry(5000,5000),new THREE.MeshStandardMaterial({color:night?0x203856:0x239aa8,roughness:.4,metalness:.15}));this.water.rotation.x=-Math.PI/2;this.water.position.y=-27;scene.add(this.water);
    if(track.theme==='orbital'||track.id==='glacier'||wild||expedition(track.id))this.water.visible=false;if(track.theme==='factory')(this.water.material as THREE.MeshStandardMaterial).color.setHex(0x3a535b);
    const p=track.at(track.length*(night?.38:.31));this.beacon=new THREE.Mesh(new THREE.ConeGeometry(15,85,24,1,true),new THREE.MeshBasicMaterial({color:night?0xb3a0ff:0xffe7a6,transparent:true,opacity:.08,depthWrite:false,side:THREE.DoubleSide}));this.beacon.position.set(p.x+p.nx*50,(p.y??0)+45,p.z+p.nz*50);this.beacon.rotation.z=Math.PI/2;this.beacon.name='Coastal lighthouse beam';this.beacon.visible=track.theme==='coast';scene.add(this.beacon);
  }
  private mat(color:number){if(!this.materials.has(color))this.materials.set(color,new THREE.MeshStandardMaterial({color,roughness:.85,flatShading:true,side:THREE.DoubleSide}));return this.materials.get(color)!;}
  private mesh(g:THREE.BufferGeometry,c:number|THREE.Material,x:number,y:number,z:number,sx=1,sy=1,sz=1,ry=0){const m=new THREE.Mesh(g,typeof c==='number'?this.mat(c):c);m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.rotation.y=ry;m.castShadow=true;m.receiveShadow=true;this.group.add(m);return m;}
  private box(c:number,x:number,y:number,z:number,w:number,h:number,d:number,yaw=0){return this.mesh(new THREE.BoxGeometry(w,h,d),c,x,y,z,1,1,1,yaw);}
  private stone(x:number,y:number,z:number,w:number,h:number,d:number,c:number){this.mesh(new THREE.IcosahedronGeometry(1,0),c,x,y,z,w,h,d,this.rng()*6.28);}
  private ribbon(inner:number,outer:number,offset:number,material:THREE.Material,land=false){const positions:number[]=[],uv:number[]=[],indices:number[]=[],across=land?1:Math.max(1,Math.ceil((outer-inner)/2)),stride=across+1;
    // Include exact ramp/gap boundaries so tessellation cannot invent a sloping
    // lip after the physical launch edge or a partial bridge over a real gap.
    const path=[...this.track.samples.map(p=>p.s),this.track.length,...this.track.jumps.filter(j=>!j.route).flatMap(j=>[j.start,j.end-.001,j.end+.001,j.gapEnd+.001])].sort((a,b)=>a-b);
    for(let i=0;i<path.length;i++){const p=this.track.at(path[i]),exposed=this.track.exposed.some(([a,b])=>p.s/this.track.length>=a&&p.s/this.track.length<=b),map=(side:number)=>land?Math.sign(side)*(exposed?this.track.widthAt(p.s)+.7:30):Math.sign(side)*(this.track.widthAt(p.s)+Math.abs(side)-12),left=map(inner),right=map(outer);for(let n=0;n<=across;n++){const lane=left+(right-left)*n/across,x=p.x+p.nx*lane,z=p.z+p.nz*lane,analytic=(land?this.track.baseHeight(p.s):(p.y??0))+Math.tan(p.bank??0)*lane,nearJump=this.track.jumps.some(j=>p.s>=j.start-24&&p.s<=j.gapEnd+24),q=!land&&!nearJump?this.track.surface(x,z,'main',p.s):undefined,height=q?.route==='main'?q.height:analytic;positions.push(x,height+offset,z);uv.push(lane/8,path[i]/9);}if(i<path.length-1&&!this.track.profile((path[i]+path[i+1])/2).gap)for(let n=0;n<across;n++){const j=i*stride+n;indices.push(j,j+stride,j+1,j+1,j+stride,j+stride+1);}}
    if(this.track.id==='factory'&&land){const clean=clipRoadSkirt(this.track,positions,indices);indices.splice(0,indices.length,...clean);}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(!land&&['toybox','nyc','vegas','dc'].includes(this.track.id)?refineRoad(this.track,positions,uv,indices,path.flatMap(s=>Array(stride).fill(s)),offset):indices);g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.computeVertexNormals();if(this.track.id==='glacier'&&offset===0){const colors:number[]=[],c=new THREE.Color();for(const s of path){const f=s/this.track.length,inside=Math.min(1,Math.max(0,Math.min((f-.22)/.025,(.645-f)/.025)));c.setRGB(1-inside*.72,1-inside*.45,1-inside*.23);for(let n=0;n<stride;n++)colors.push(c.r,c.g,c.b);}g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));(material as THREE.MeshStandardMaterial).vertexColors=true;}const mesh=this.mesh(g,material,0,0,0);mesh.name=offset===0?'drivable-main':'road-detail';
  }
  private roadMaterial(){const night=this.track.theme==='hotel',c=document.createElement('canvas');c.width=c.height=128;const ctx=c.getContext('2d')!;ctx.fillStyle=night?'#69758a':'#d1bc8b';ctx.fillRect(0,0,128,128);
    if(this.track.theme==='vietnam'||this.track.theme==='volcano'){const jungle=this.track.theme==='vietnam';ctx.fillStyle=jungle?'#9b8553':'#63535c';ctx.fillRect(0,0,128,128);for(let i=0;i<600;i++){ctx.fillStyle=i%2?(jungle?'#796842':'#493c49'):(jungle?'#b09a66':'#84707a');ctx.fillRect(this.rng()*128,this.rng()*128,2,3);}ctx.fillStyle=jungle?'#b39e6f':'#98838c';ctx.fillRect(26,0,4,128);ctx.fillRect(96,0,4,128);}
    else if(this.track.theme==='glacier'){ctx.fillStyle='#76abc6';ctx.fillRect(0,0,128,128);ctx.fillStyle='#a4cddd';for(let n=0;n<20;n++)ctx.fillRect(this.rng()*128,this.rng()*128,2,8);}
    else if(this.track.theme==='factory'){ctx.fillStyle='#6e858d';ctx.fillRect(0,0,128,128);ctx.fillStyle='#364a59';ctx.fillRect(0,0,128,3);for(let x=8;x<128;x+=24)ctx.fillRect(x,12,3,3);}
    else if(this.track.theme==='orbital'){ctx.fillStyle='#5757ac';ctx.fillRect(0,0,128,128);ctx.fillStyle='#83f4de';ctx.fillRect(0,0,128,2);const hues=['#b676df','#798bea','#55bde0','#62d7c4','#b8d776','#e5ba77'];for(let i=0;i<6;i++){ctx.fillStyle=hues[i];ctx.fillRect(3+i*20,4,20,120);}}
    else if(night){for(let x=0;x<128;x+=32)for(let y=0;y<128;y+=32){ctx.fillStyle=(x+y)%64?'#708297':'#8895a3';ctx.fillRect(x+1,y+1,30,30);}}
    else for(let i=0;i<1100;i++){ctx.fillStyle=i%2?'#c5af83':'#dcc998';ctx.fillRect(this.rng()*128,this.rng()*128,1.5,1.5);}
    const plan=expedition(this.track.id);if(plan){ctx.fillStyle='#'+plan.road.toString(16).padStart(6,'0');ctx.fillRect(0,0,128,128);if(this.track.id==='toybox'){ctx.fillStyle='#f7a655';ctx.fillRect(0,0,128,128);ctx.fillStyle='#dc8840';ctx.fillRect(0,0,128,2);}if(this.track.id==='rally'||this.track.id==='barnyard'){ctx.fillStyle=this.track.id==='rally'?'#9a6246':'#8d784e';for(let i=0;i<450;i++)ctx.fillRect(this.rng()*128,this.rng()*128,1.5,3);ctx.fillStyle=this.track.id==='rally'?'#a97049':'#927b52';for(const x of [30,90])ctx.fillRect(x,0,6,128);}if(this.track.id==='candy'){ctx.fillStyle='#a3785a';for(let x=0;x<128;x+=16)ctx.fillRect(x,0,2,128);for(let y=0;y<128;y+=16)ctx.fillRect(0,y,128,2);}}
    const map=new THREE.CanvasTexture(c);map.wrapS=map.wrapT=THREE.RepeatWrapping;map.colorSpace=THREE.SRGBColorSpace;map.anisotropy=4;return new THREE.MeshStandardMaterial({map,roughness:.95,side:THREE.DoubleSide});
  }
  private road(){const night=this.track.theme==='hotel',edge=night?0x6ee1d9:0xffe5aa;
    if(!expedition(this.track.id)&&!['orbital','vietnam','volcano','glacier','nyc','vegas','candy','atlantis','toybox'].includes(this.track.theme))this.ribbon(-30,30,-1.5,this.mat(this.track.theme==='factory'?0x486571:night?0x3c5960:0x88af73),true);
    this.ribbon(-12.75,12.75,-.3,this.mat(night?0x35445d:0x9e7652));this.ribbon(-12,12,0,this.roadMaterial());
    this.ribbon(-12.5,-12,.04,this.mat(edge));this.ribbon(12,12.5,.04,this.mat(edge));
    for(let s=0;s<this.track.length;s+=5){const p=this.track.at(s),y=p.y??0,yaw=Math.atan2(p.tx,p.tz);if(this.track.profile(s).gap)continue;
      for(const side of [-1,1]){const lane=(this.track.widthAt(s)+1)*side,edgeY=y+Math.tan(p.bank??0)*lane;if(this.track.railAt(s,side)&&this.track.id==='toybox'){if(!this.track.railAt(s-2.6,side)||!this.track.railAt(s+2.6,side))continue;const rail=this.box(0xdd673c,p.x+p.nx*lane,edgeY+.65,p.z+p.nz*lane,.55,1.1,5.2,yaw);rail.rotation.order='YXZ';rail.rotation.x=-Math.atan((this.track.at(s+2).y!-this.track.at(s-2).y!)/4);}else if(this.track.railAt(s,side)&&this.track.id==='rally'){if(Math.floor(s/5)%4===0){this.box(0xd8bd8f,p.x+p.nx*lane,edgeY+.6,p.z+p.nz*lane,.18,1.2,.18,yaw);}}else if(this.track.railAt(s,side)&&['dc','nyc','vegas'].includes(this.track.id)){const curb=this.box(this.track.id==='vegas'?0xc2a6b3:0xb8bab0,p.x+p.nx*lane,edgeY+.28,p.z+p.nz*lane,.6,.55,5.15,yaw);curb.rotation.order='YXZ';curb.rotation.x=-Math.atan((this.track.at(s+2).y!-this.track.at(s-2).y!)/4);if(Math.floor(s/5)%3===0)this.box(0x5f747c,p.x+p.nx*lane,edgeY+.95,p.z+p.nz*lane,.18,1.35,.18,yaw);}else if(this.track.railAt(s,side)){this.box(this.track.theme==='glacier'?0x90c6de:this.track.theme==='orbital'?0x746bcc:night?0x75658d:0xb19468,p.x+p.nx*lane,edgeY+.72,p.z+p.nz*lane,.22,1.5,.22,yaw);this.box(this.track.theme==='glacier'?0xc4f2fa:this.track.theme==='orbital'?0x76f1dd:night?0xa9b7c9:0xf1d6a3,p.x+p.nx*lane,edgeY+.9,p.z+p.nz*lane,.16,.16,5.1,yaw);}else if(Math.floor(s/5)%2===0)this.box(0xf6b865,p.x+p.nx*(this.track.widthAt(s)+.45)*side,edgeY+.08,p.z+p.nz*(this.track.widthAt(s)+.45)*side,.35,.1,2,yaw);}
      if(!['rally','candy','toybox','barnyard'].includes(this.track.id)&&s%20<5){const dash=this.box(night?0xd1c6ed:0xf1deb0,p.x,y+.025,p.z,.16,.025,4,yaw);dash.rotation.x=-Math.atan((this.track.profile(s+2).height-this.track.profile(s-2).height)/4);}
    }
    for(const jump of this.track.jumps.filter(j=>!j.route)){for(let s=jump.start;s<jump.end;s+=1.4){const p=this.track.at(s+.6);this.box(night?0xc299ac:0xc79258,p.x,(p.y??0)+.025,p.z,23.7,.06,.28,Math.atan2(p.tx,p.tz));}
      const end=this.track.at(jump.end-1);this.box(0xffdd8c,end.x,(end.y??0)+.06,end.z,24,.08,.6,Math.atan2(end.tx,end.tz));
    }
    const start=this.track.at(0);for(let x=-12;x<12;x+=1.5)for(let z=0;z<3;z+=1.5)this.box((Math.round(x/1.5)+z/1.5)%2?0x183e4d:0xffedbe,start.x+start.nx*(x+.75)+start.tx*z,(start.y??0)+.06,start.z+start.nz*(x+.75)+start.tz*z,1.5,.08,1.5,Math.atan2(start.tx,start.tz));
  }
  private newLandscape(){
    const orbital=this.track.theme==='orbital';
    if(orbital){
      const planet=this.mesh(new THREE.SphereGeometry(125,40,24),0xc58f77,-600,-10,520);planet.name='Copper planet';
      for(const [radius,color] of [[162,0xefce94],[182,0xb49ace],[205,0x899abb]]){const ring=this.mesh(new THREE.TorusGeometry(radius,4,4,120),this.mat(color),-600,-10,520);ring.rotation.x=1.12;ring.rotation.z=.28;}
      for(let i=0;i<180;i++)this.mesh(new THREE.IcosahedronGeometry(.55+this.rng(),0),this.starMaterial,-900+this.rng()*1800,110+this.rng()*270,-900+this.rng()*1800);
      for(let s=0;s<this.track.length;s+=75){const p=this.track.at(s);if(this.track.profile(s).gap)continue;const brace=this.box(0x273650,p.x,(p.y??0)-3.5,p.z,26,3,5,Math.atan2(p.tx,p.tz));brace.rotation.order='YXZ';brace.rotation.z=p.bank??0;for(const side of [-1,1])this.mesh(new THREE.OctahedronGeometry(.6),this.starMaterial,p.x+p.nx*13.5*side,(p.y??0)+Math.tan(p.bank??0)*13.5*side+2,p.z+p.nz*13.5*side);}
    }else{
      for(let s=0;s<this.track.length;s+=50){const p=this.track.at(s);if(this.track.profile(s).gap)continue;this.box(0x40515a,p.x,(p.y??0)/2-13,p.z,5,(p.y??0)+25,5);}
      for(let i=0;i<35;i++){const s=(i+.5)/35*this.track.length,p=this.track.at(s),side=i%2?1:-1,x=p.x+p.nx*42*side,z=p.z+p.nz*42*side;if([...this.track.samples,...this.track.routes.flatMap(r=>r.samples)].some(q=>Math.hypot(q.x-x,q.z-z)<30))continue;
        for(let n=0;n<1+i%3;n++){this.box([0xb76b49,0x529296,0xccaa64][i%3],x,(p.y??0)+2+n*4,z,9,4,16,Math.atan2(p.tx,p.tz));for(const stripe of [-3,0,3])this.box(0x344c56,x+p.nx*stripe,(p.y??0)+2+n*4,z+p.nz*stripe,.12,3.8,16.1,Math.atan2(p.tx,p.tz));}
      }
    }
  }
  private newLandmarks(){
    const orbital=this.track.theme==='orbital';
    if(orbital){
      for(const [a,b,name] of [[.005,.045,'DEPARTURE STATION'],[.37,.415,'RING OBSERVATORY'],[.81,.835,'HOMEBOUND RELAY']] as [number,number,string][]){
        for(let s=a*this.track.length;s<b*this.track.length;s+=12){const p=this.track.at(s),yaw=Math.atan2(p.tx,p.tz),width=this.track.widthAt(s)+3;for(const side of [-1,1]){this.box(0x687ba1,p.x+p.nx*width*side,(p.y??0)+6,p.z+p.nz*width*side,1.2,12,1.2,yaw);this.box(0x34486c,p.x+p.nx*(width+2)*side,(p.y??0)+3,p.z+p.nz*(width+2)*side,3,6,11,yaw);}this.box(0x92b9cf,p.x,(p.y??0)+12,p.z,width*2,1.1,1.3,yaw);}
        this.sign(name,'KEEP THE RINGS IN SIGHT',a*this.track.length,0,27,10);
      }
      this.sign('THE COPPER GIANT','BANKED ARC / OPEN SPACE',.135*this.track.length,-17,13);
      this.sign('METEOR DIVIDE','BIG AIR / AIM FOR THE WIDE DECK',.645*this.track.length,18,14);
    }else{
      for(const [a,b,name] of [[.025,.09,'ASSEMBLY HALL'],[.14,.21,'STAMPING WORKS'],[.66,.71,'DISPATCH BAY']] as [number,number,string][]){
        for(let s=a*this.track.length;s<b*this.track.length;s+=14){const p=this.track.at(s),yaw=Math.atan2(p.tx,p.tz),w=this.track.widthAt(s)+4;for(const side of [-1,1]){this.box(0x455e6a,p.x+p.nx*w*side,(p.y??0)+6,p.z+p.nz*w*side,1,12,1,yaw);this.box(0xf2b94b,p.x+p.nx*w*side,(p.y??0)+2,p.z+p.nz*w*side,1.1,4,1.1,yaw);}this.box(0x526975,p.x,(p.y??0)+12,p.z,w*2,1.2,1.2,yaw);}
        this.sign(name,'KEEP THE FREIGHT MOVING',a*this.track.length,0,26,10);
      }
      const p=this.track.at(.57*this.track.length),yaw=Math.atan2(p.tx,p.tz);for(const side of [-1,1])this.box(0xe6a845,p.x+p.nx*22*side,(p.y??0)+14,p.z+p.nz*22*side,2,28,3,yaw);this.box(0xe6a845,p.x,(p.y??0)+28,p.z,46,3,3,yaw);
      const landmark=this.track.at(.48*this.track.length),x=landmark.x+landmark.nx*62,z=landmark.z+landmark.nz*62;
      this.mesh(new THREE.CylinderGeometry(12,15,40,16),0x536b76,x,(landmark.y??0)+20,z);const gear=this.mesh(new THREE.TorusGeometry(12,1.5,6,20),0xe2ac55,x,(landmark.y??0)+35,z+13);gear.name='Foundry clock';
      for(let i=0;i<12;i++)this.box(0xffdaa0,x+Math.sin(i*Math.PI/6)*12,(landmark.y??0)+35+Math.cos(i*Math.PI/6)*12,z+13,2,2,2);
      this.sign('CLOCKWORK CARGO','ASSEMBLE A WIN / TWELVE RACERS',0,0,28,10);
    }
  }
  private landscape(){const night=this.track.theme==='hotel';
    if(this.track.theme==='factory'||this.track.theme==='orbital'){this.newLandscape();return;}
    // Supports stop at genuine gaps; exposed sections have only a narrow deck and a visible drop to water.
    for(let s=0;s<this.track.length;s+=16){const p=this.track.at(s),profile=this.track.profile(s),y=this.track.baseHeight(s);if(profile.gap)continue;
      const exposed=this.track.exposed.some(([a,b])=>s/this.track.length>a&&s/this.track.length<b);
      if(exposed){if(s%64<16)this.box(night?0x3d425b:0xa78666,p.x,y/2-14,p.z,5,y+26,5);}
      else {this.stone(p.x,y-15,p.z,22,4,20,night?0x394e59:0x75a271);this.stone(p.x,y-22,p.z,23,12,20,night?0x373d52:0xae8767);}
      if(!exposed&&s%48<16){for(const side of [-1,1]){const x=p.x+p.nx*23*side,z=p.z+p.nz*23*side;
        if(this.track.surface(x,z).distance<(this.track.surface(x,z).halfWidth??12)+6||this.track.routes.some(r=>this.track.surface(x,z,r.id).distance<10))continue;
        if(night)this.tree(x,y,z,1+this.rng()*.3);else this.palm(x,y,z,.9+this.rng()*.6);
      }}
    }
    for(let i=0;i<38;i++){const x=-560+this.rng()*940,z=-440+this.rng()*1000;if([...this.track.samples,...this.track.routes.flatMap(r=>r.samples)].some(p=>Math.hypot(p.x-x,p.z-z)<80))continue;
      this.stone(x,-12,z,35+this.rng()*30,24+this.rng()*26,30+this.rng()*30,night?0x303950:0xb7a57c);
    }
    if(night){this.mesh(new THREE.SphereGeometry(25,24,16),new THREE.MeshBasicMaterial({color:0xffe5be}),-260,180,400);for(let i=0;i<110;i++)this.mesh(new THREE.IcosahedronGeometry(.7,0),this.starMaterial,-650+this.rng()*1300,110+this.rng()*200,-650+this.rng()*1300);}
    else for(let i=0;i<20;i++){const x=-600+this.rng()*1300,z=-600+this.rng()*1300;for(let j=0;j<3;j++)this.mesh(new THREE.IcosahedronGeometry(1,1),0xfff5d8,x+j*12,95+this.rng()*10,z,16,6,9);}
  }
  private palm(x:number,y:number,z:number,scale:number){this.mesh(new THREE.CylinderGeometry(.25,.48,11*scale,7),0x9a784b,x,y+5.5*scale,z);for(let i=0;i<7;i++){const a=i*Math.PI*2/7;const leaf=this.mesh(new THREE.SphereGeometry(1,6,4),i%2?0x4d9c69:0x76ba73,x+Math.sin(a)*2.5*scale,y+10*scale,z+Math.cos(a)*2.5*scale,.8*scale,.3*scale,3.5*scale,a);leaf.rotation.x=.25;}this.mesh(new THREE.IcosahedronGeometry(.65,0),0x9b7e47,x,y+10.4*scale,z);}
  private tree(x:number,y:number,z:number,scale:number){this.mesh(new THREE.CylinderGeometry(.35,.7,7*scale,6),0x4a4356,x,y+3.5*scale,z);for(let j=0;j<3;j++)this.mesh(new THREE.ConeGeometry((3.8-j*.8)*scale,6*scale,7),j%2?0x355f64:0x3f6c70,x,y+(6+j*3)*scale,z);}
  private sign(text:string,detail:string,s:number,lane=16,width=12,height=5){if(lane)lane=Math.sign(lane)*Math.max(Math.abs(lane),this.track.widthAt(s)+width/2+2);const p=this.track.at(s),x=p.x+p.nx*lane,z=p.z+p.nz*lane,y=p.y??0;const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=256;const ctx=canvas.getContext('2d')!;ctx.fillStyle=this.track.theme==='hotel'?'#423857':'#145860';ctx.fillRect(0,0,1024,256);ctx.strokeStyle='#f3d6a0';ctx.lineWidth=9;ctx.strokeRect(12,12,1000,232);ctx.textAlign='center';ctx.fillStyle='#ffedc6';ctx.font='900 62px Trebuchet MS';ctx.fillText(text,512,112);ctx.font='bold 27px Trebuchet MS';ctx.fillText(detail,512,182);
    const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;this.mesh(new THREE.PlaneGeometry(width,width/4),new THREE.MeshStandardMaterial({map,side:THREE.FrontSide,emissive:0xffffff,emissiveMap:map,emissiveIntensity:.15}),x,y+height,z,1,1,1,Math.atan2(p.tx,p.tz)+Math.PI);if(lane!==0){this.box(0x34535d,x,y+height/2,z,.25,height,.25);this.box(0x547977,x,y+.12,z,1.2,.24,1.2);}else{const yaw=Math.atan2(p.tx,p.tz),span=Math.max(width/2,this.track.halfWidth+3);for(const side of [-1,1])this.box(0x547977,p.x+p.nx*span*side,y+height/2,p.z+p.nz*span*side,.5,height,.5,yaw);this.box(0x547977,x,y+height+width/8,z,span*2,.4,.5,yaw);}
  }
  private landmarks(){const night=this.track.theme==='hotel';
    if(this.track.theme==='factory'||this.track.theme==='orbital'){this.newLandmarks();return;}
    if(night){
      // Recovered checkpoint 24 corridor, wall palette, sconces and circular
      // chandeliers. Continuous swept panels replace the boxes removed by the
      // v0.7 bounds cleanup. The central ballroom gains its enclosing high roof.
      const begin=this.track.length*.105,end=this.track.length*.31;
      for(let s=begin;s<end;s+=3){
        const last=Math.min(end,s+3.04),ballroom=s>this.track.length*.19&&s<this.track.length*.27;
        const w=this.track.widthAt(s)+(ballroom?6:4),height=ballroom?20:14.8;
        this.group.add(enclosurePanel(this.track,s,last,'main',-w,w,height,height,this.mat(ballroom?0x544763:0x544763),'Moonbell ceiling','ceiling'));
        this.group.add(enclosurePanel(this.track,s,last,'main',-w,w,-.06,-.06,this.mat(0x69758a),'Moonbell floor apron','floor'));
        for(const side of [-1,1]){
          if(doorway(this.track,s,side*w))continue;
          this.group.add(enclosurePanel(this.track,s,last,'main',side*w,side*w,0,height,this.mat(0x4a4162),'Moonbell panelled wall','wall'));
          for(const y of [1.4,9.5])this.group.add(enclosurePanel(this.track,s,last,'main',side*(w-.05),side*(w-.05),y,y+.16,this.mat(0xcdb89a),'Moonbell brass moulding','wall'));
        }
      }
      for(let s=begin;s<end;s+=14){const p=this.track.at(s),yaw=Math.atan2(p.tx,p.tz),y=p.y??0;
        const ballroom=s/this.track.length>.19&&s/this.track.length<.27,w=this.track.widthAt(s)+(ballroom?6:4);
        for(const side of [-1,1]){if(doorway(this.track,s,side*w))continue;
          const x=p.x+p.nx*(w-.12)*side,z=p.z+p.nz*(w-.12)*side;
          structural(this.box(0xcdb89a,x,y+7,z,.22,14,.5,yaw),'fixture','Moonbell wall pilaster');
          structural(this.box(0xffd994,x-p.nx*.2*side,y+8,z-p.nz*.2*side,.3,3,2.5,yaw),'fixture','Moonbell wall sconce');
        }
        const chandelier=structural(this.mesh(new THREE.TorusGeometry(ballroom?4.2:2.8,.16,6,24),0xe6c38b,p.x,y+(ballroom?14:11.2),p.z),'fixture','Moonbell ring chandelier');chandelier.rotation.x=Math.PI/2;
        for(let n=0;n<8;n++){const a=n*Math.PI/4,r=ballroom?4.2:2.8;structural(this.mesh(new THREE.SphereGeometry(.28,8,5),this.lampMaterial,p.x+Math.sin(a)*r,y+(ballroom?14.1:11.3),p.z+Math.cos(a)*r),'fixture','Moonbell chandelier candle');}
      }
      // The existing service choice is an indoor corridor, with side doorways
      // at the split/rejoin; retain current support and progression surfaces.
      const service=this.track.routes.find(r=>r.id==='service')!;
      for(let s=service.start+10;s<service.end-10;s+=3){const e=Math.min(service.end-10,s+3.04),w=service.halfWidth+3;
        this.group.add(enclosurePanel(this.track,s,e,service.id,-w,w,13,13,this.mat(0x544763),'Hotel service ceiling','ceiling'));
        for(const side of [-1,1])if(!doorway(this.track,s,w*side,service.id))this.group.add(enclosurePanel(this.track,s,e,service.id,w*side,w*side,0,13,this.mat(0x4a4162),'Hotel service wall','wall'));
      }
      this.sign('MOONBELL HOTEL','ALL GUESTS CHECK IN. SOME NEVER LEAVE.',this.track.length*.097,0,26,17);
      this.sign('THE BALLROOM','KEEP THE WALTZ MOVING',this.track.length*.23,0,23,12.5);
      this.sign('RECEPTION','WELCOME BACK / YOUR ROOM CAN WAIT',.115*this.track.length,0,22,11);
      for(const fraction of [.15,.235,.29]){
        const start=fraction*this.track.length,end=(fraction+.025)*this.track.length;
        this.mesh(surfacePatch(this.track,start,end,-6,6,.055),0x744566,0,0,0).name='ballroom-runner';
        for(const side of [-1,1])this.mesh(surfacePatch(this.track,start,end,side*5.5-.1,side*5.5+.1,.07),0xd6b778,0,0,0);
        for(let s=start+2;s<end-1;s+=6)this.mesh(surfacePatch(this.track,s,s+.18,-5.4,5.4,.07),0xb28b75,0,0,0);
      }
      for(const f of [.15,.235,.285]){const p=this.track.at(f*this.track.length);for(const side of [-1,1]){const x=p.x+p.nx*18*side,z=p.z+p.nz*18*side;if(!this.track.railAt(p.s,side))continue;this.box(f<.2?0xa68360:0x677d91,x,(p.y??0)+1.3,z,3,2.6,5,Math.atan2(p.tx,p.tz));this.mesh(new THREE.OctahedronGeometry(1.1),0xffd586,x,(p.y??0)+4,z);}}
      for(const f of [.095,.315]){const p=this.track.at(f*this.track.length);for(const side of [-1,1]){const offset=f>.3&&side<0?70:27;this.tower(p.x+p.nx*offset*side,p.y??0,p.z+p.nz*offset*side,true);}}
      const p=this.track.at(.39*this.track.length);this.tower(p.x+p.nx*45,p.y??0,p.z+p.nz*45,true);
      const court=this.track.at(.58*this.track.length);this.mesh(new THREE.CylinderGeometry(9,10,2,16),0x9184a0,court.x+court.nx*28,(court.y??0)+1,court.z+court.nz*28);this.mesh(new THREE.OctahedronGeometry(4),0x83d4ce,court.x+court.nx*28,(court.y??0)+7,court.z+court.nz*28);
      this.sign('MIDNIGHT GARDENS','MIND THE BELLHOP',.53*this.track.length,17,13);
    }else{
      for(let s=18;s<150;s+=30){const p=this.track.at(s),yaw=Math.atan2(p.tx,p.tz);for(const side of [-1,1]){const x=p.x+p.nx*22*side,z=p.z+p.nz*22*side;this.box(0xc3b797,x,-.65,z,10,2,11,yaw);this.box(side<0?0xe98469:0x55a7a0,x,3,z,9,6,10,yaw);this.box(0xffe5b1,x-p.nx*4.56*side,3,z-p.nz*4.56*side,.12,2.8,6.5,yaw);this.box(0x287d8a,x-p.nx*4.64*side,3,z-p.nz*4.64*side,.13,2.3,5.8,yaw);this.box(0xffe5b1,x-p.nx*4.74*side,3,z-p.nz*4.74*side,.15,2.4,.15,yaw);this.mesh(new THREE.ConeGeometry(8,3,4),0xf1d395,x,7.5,z,1,1,1,yaw+Math.PI/4);}
        for(let lane=-10;lane<=10;lane+=4)this.mesh(new THREE.ConeGeometry(.7,1.8,3),lane%3?0xf4bc6c:0xee8067,p.x+p.nx*lane,11,p.z+p.nz*lane,1,1,1,yaw);
      }
      const p=this.track.at(.31*this.track.length);this.tower(p.x+p.nx*50,p.y??0,p.z+p.nz*50,false);
      // An arched coastal tunnel follows the actual descent, with open portals and wide clearance.
      for(let s=.505*this.track.length;s<.54*this.track.length;s+=12){const p=this.track.at(s),yaw=Math.atan2(p.tx,p.tz),y=p.y??0;for(const side of [-1,1])this.box(0xb99a76,p.x+p.nx*16*side,y+7,p.z+p.nz*16*side,6,14,13,yaw);this.box(0xbfa07b,p.x,y+14,p.z,37,4,13,yaw);}
      const w=this.track.at(.585*this.track.length);this.stone(w.x+w.nx*30,(w.y??0)+17,w.z+w.nz*30,15,26,12,0xab9575);
      const fall=this.mesh(new THREE.PlaneGeometry(12,48),new THREE.MeshBasicMaterial({color:0x9feae0,transparent:true,opacity:.8,side:THREE.DoubleSide}),w.x+w.nx*24,(w.y??0)+7,w.z+w.nz*24,1,1,1,Math.atan2(w.tx,w.tz));
      for(let i=0;i<6;i++)this.mesh(new THREE.SphereGeometry(1,8,5),0xd4fff0,fall.position.x+(i-3)*2,(w.y??0)-15,fall.position.z,2.2,1.2,3);
      this.sign('CASCADE PASS','TUNNEL AHEAD / CLEARANCE 12m',.493*this.track.length,17,14);
      this.sign('LIGHTHOUSE RIDGE','OPEN EDGES / STAY ON THE DECK',.242*this.track.length,17,14);
    }
    for(const side of [-1,1])this.box(night?0x625477:0xe1795a,side*14,5.5,0,1.1,11,1.1);
    this.sign(night?'MOONBELL HOTEL':'SUNSPUN GRAND TOUR','ASTRO RACING / THREE LAPS / TWELVE DREAMERS',0,0,28,10);
  }
  private tower(x:number,y:number,z:number,night:boolean){this.stone(x,y-4,z,18,5,18,night?0x475168:0xa99170);this.mesh(new THREE.CylinderGeometry(5.3,7,34,night?8:14),night?0x655877:0xffe5b1,x,y+17,z);for(const h of [8,20,31])this.mesh(new THREE.CylinderGeometry(6,6.5,3,night?8:14),night?0xb09aab:0xe88163,x,y+h,z);this.mesh(new THREE.CylinderGeometry(4.8,4.8,5,10),night?0x9fe3d9:0x83d4d4,x,y+37,z);this.mesh(new THREE.ConeGeometry(8,9,night?8:14),night?0x514564:0xda785b,x,y+44,z);}
  private signs(){for(const j of this.track.jumps){this.sign(j.name.toUpperCase(),j.gapEnd>j.end?'ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬Ëœ GAP':'ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬Ëœ TRICK',j.start-30,17,14);}
    for(let s=95;s<this.track.length;s+=260){const a=this.track.at(s),b=this.track.at(s+35),cross=a.tx*b.tz-a.tz*b.tx;this.sign(cross>0?'ÃƒÂ¢Ã¢â€šÂ¬Ã‚Âº  ÃƒÂ¢Ã¢â€šÂ¬Ã‚Âº  ÃƒÂ¢Ã¢â€šÂ¬Ã‚Âº':'ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¹  ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¹  ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¹','',s,16,7,3.5);}
  }
  update(time:number){this.finalPolish?.update(time);this.water.position.y=-27+Math.sin(time*.5)*.13;if(this.beacon)this.beacon.rotation.y=time*.18;this.wild?.update(time);this.living.update(time,this.quality);this.expeditionWorld?.update(time,this.quality);}
}
