import * as T from 'three';
import {DestinationTrack} from './track';
import {mergeStatic} from '../../core/mergeStatic';
import {clearScenery} from '../sceneryClearance';

/** Small original low-poly modeling vocabulary. All placements use course coordinates. */
export class SceneKit {
 readonly static=new T.Group();readonly moving=new T.Group();
 readonly animations:((time:number)=>void)[]=[];readonly landmarks:{name:string;fraction:number;route:string}[]=[];
 private materials=new Map<string,T.Material>();
 constructor(readonly track:DestinationTrack,readonly scene:T.Scene){scene.add(this.static,this.moving);}
 mat(color:number,glow=false){const key=color+':'+glow;if(!this.materials.has(key))this.materials.set(key,glow?new T.MeshBasicMaterial({color}):new T.MeshStandardMaterial({color,roughness:.78,flatShading:true}));return this.materials.get(key)!;}
 mesh(g:T.BufferGeometry,c:number|T.Material,x:number,y:number,z:number,parent:T.Object3D=this.static){const m=new T.Mesh(g,typeof c==='number'?this.mat(c):c);m.position.set(x,y,z);parent.add(m);return m;}
 box(c:number|T.Material,x:number,y:number,z:number,w:number,h:number,d:number,parent:T.Object3D=this.static){return this.mesh(new T.BoxGeometry(w,h,d),c,x,y,z,parent);}
 ball(c:number,x:number,y:number,z:number,r:number,parent:T.Object3D=this.static,sx=1,sy=1,sz=1){const m=this.mesh(new T.SphereGeometry(r,12,8),c,x,y,z,parent);m.scale.set(sx,sy,sz);return m;}
 cyl(c:number,x:number,y:number,z:number,r:number,h:number,parent:T.Object3D=this.static,top=r,n=10){return this.mesh(new T.CylinderGeometry(top,r,h,n),c,x,y,z,parent);}
 cone(c:number,x:number,y:number,z:number,r:number,h:number,parent:T.Object3D=this.static,n=8){return this.mesh(new T.ConeGeometry(r,h,n),c,x,y,z,parent);}
 rod(c:number,a:number[],b:number[],r:number,parent:T.Object3D){const va=new T.Vector3(...a),vb=new T.Vector3(...b),d=vb.clone().sub(va),m=this.cyl(c,0,0,0,r,d.length(),parent);m.position.copy(va.add(vb).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());return m;}
 ring(c:number,x:number,y:number,z:number,r:number,tube:number,parent:T.Object3D=this.static){return this.mesh(new T.TorusGeometry(r,tube,6,32),c,x,y,z,parent);}
 group(x=0,y=0,z=0,parent:T.Object3D=this.static,name=''){const g=new T.Group();g.position.set(x,y,z);g.name=name;parent.add(g);return g;}
 place(f:number,lane:number,route='main',moving=false,name=''){const p=this.track.at(f*this.track.length,route),g=this.group(p.x+p.nx*lane,p.y??0,p.z+p.nz*lane,moving?this.moving:this.static,name);g.rotation.y=Math.atan2(p.tx,p.tz);g.userData.placement={f,lane,route};if(name)this.landmarks.push({name,fraction:f,route});return g;}
 label(text:string,g:T.Object3D,w=22,y=12,c='#fff1c4',bg='#17374b'){
  const canvas=document.createElement('canvas');canvas.width=768;canvas.height=192;const ctx=canvas.getContext('2d')!;ctx.fillStyle=bg;ctx.fillRect(0,0,768,192);ctx.strokeStyle=c;ctx.lineWidth=8;ctx.strokeRect(8,8,752,176);ctx.fillStyle=c;ctx.textAlign='center';ctx.font=`900 ${Math.min(74,660/(text.length*.56))}px Trebuchet MS`;ctx.fillText(text,384,121);
  const map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;const m=this.mesh(new T.PlaneGeometry(w,w/4),new T.MeshBasicMaterial({map,side:T.DoubleSide}),0,y,-.2,g);m.rotation.y=Math.PI;return m;
 }
 arch(g:T.Object3D,w:number,h:number,c:number){w=Math.max(w,this.track.halfWidth*2+18);for(const side of [-1,1]){this.box(c,side*w/2,h/2,0,2.2,h,3,g);this.box(c,side*w/2,h*.78,0,3.6,1.2,4,g);}this.box(c,0,h,0,w+3,2.5,4,g);}
 tree(g:T.Object3D,h=15,c=0x3f945f){this.cyl(0x76503d,0,h*.4,0,.7,h*.8,g);for(let n=0;n<3;n++)this.ball(c,Math.sin(n*2)*h*.16,h*.72+n*2,Math.cos(n*2)*h*.14,h*.27,g,1,1.1,1);}
 wheels(g:T.Object3D,x:number,z:number,r:number,c=0x253642){for(const side of [-1,1])for(const end of [-1,1]){const w=this.cyl(c,side*x,r,end*z,r,.6,g);w.rotation.z=Math.PI/2;this.ball(0xe7d5a0,side*(x+.32),r,end*z,r*.42,g,.16,1,1);}}
 car(g:T.Object3D,c=0xf6c151){this.box(c,0,1.1,0,3.8,1.2,2.1,g);this.box(0x406a84,0,2,0,1.7,.8,1.9,g);this.wheels(g,1.3,.9,.48);for(const side of [-1,1])this.box(0xfff4c7,side*1.91,1.2,0,.06,.3,1.3,g);}
 train(g:T.Object3D){for(let n=0;n<3;n++){const car=this.group(n*5,0,0,g);this.box([0xcf6858,0x59aebb,0xe6b256][n],0,1,0,4,1.4,2.8,car);this.wheels(car,1.3,1.3,.6);if(!n){const boiler=this.cyl(0x344863,0,2,0,1,2.7,car);boiler.rotation.z=Math.PI/2;this.cyl(0x303d50,-1,3.3,0,.4,1.5,car);this.box(0xf2c765,1.4,2.4,0,1.4,2,2.6,car);}else this.box(0xe6e4d0,0,2.2,0,3,1,2.3,car);}}
 robot(g:T.Object3D,c=0x81b5c4){this.box(c,0,4,0,3,3.5,2,g);this.box(0xd4bc8d,0,7,0,3.5,2.6,2.5,g);this.box(0x274c68,0,7,-1.3,2.8,.8,.1,g);for(const side of [-1,1]){this.ball(0xffd365,side*.8,7,-1.4,.25,g);this.cyl(c,side*2.2,3.6,0,.6,3.5,g);this.box(0x52657a,side*.85,1,0,1.2,2,2.7,g);}this.cyl(0x334c5c,0,9,0,.15,1.5,g);this.ball(0xee7959,0,9.8,0,.5,g);}
 animal(g:T.Object3D,kind:string,scale=1){
  const colors:Record<string,number>={cow:0xf5ead0,pig:0xf19baa,sheep:0xe8e0cb,horse:0xa16b42,giraffe:0xe5bd65,elephant:0x8e9da5,zebra:0xf5eee3,chicken:0xffebc4,bear:0xbf905d,dinosaur:0x78ad72};const c=colors[kind]??0xc39167;
  const a=this.group(0,0,0,g);a.scale.setScalar(scale);this.ball(c,0,2.2,0,1,a,1.4,1,2.1);
  const neck=kind==='giraffe'?6:kind==='horse'?1.5:0;
  if(neck)this.cyl(c,0,3+neck/2,-1.2,.5,neck,a);
  this.ball(c,0,3.1+neck,-1.6,.8,a,kind==='elephant'?1.4:1,1,1.3);
  for(const side of [-1,1]){for(const end of [-1,1])this.cyl(c,side*.8,1,end*1.3,.25,2,a);this.ball(c,side*.7,3.7+neck,-1.4,.4,a,kind==='elephant'?2:.65,1.3,.35);this.ball(0x223848,side*.48,3.35+neck,-2.2,.12,a);}
  if(kind==='elephant'){this.cyl(c,0,2.2,-2.45,.28,2.6,a);for(const side of [-1,1])this.cone(0xf5e3b9,side*.5,2.5,-2.5,.16,1.7,a).rotation.x=-1;}
  if(kind==='pig')this.cyl(0xd67d95,0,3.05,-2.35,.42,.2,a).rotation.x=Math.PI/2;
  if(kind==='cow'||kind==='giraffe'||kind==='zebra')for(let n=0;n<7;n++){const patch=this.ball(kind==='giraffe'?0x9b733b:0x35424a,(n%2?1:-1)*1.1,2.3+(n%3)*.2,(n%4-1.5)*.75,.43,a,.3,kind==='zebra'?1.7:1,1);}
  if(kind==='chicken'){this.cone(0xe9a644,0,3.1,-2.65,.27,.7,a).rotation.x=-Math.PI/2;this.cone(0xd85f51,0,4,-1.6,.4,.7,a);}
  if(kind==='dinosaur'){this.cone(c,0,2,3,1,4,a).rotation.x=.95;for(let n=0;n<4;n++)this.cone(0xf0cc73,0,3.5,-.5+n*.7,.4,1,a);}
  if(kind==='bear'){this.ball(0xebd3a0,0,2.3,-1.4,.85,a,1,1.2,.4);}
  return a;
 }
 finish(){
  // Move complete roadside assemblies to the nearest free location before
  // clearance. Deleting individual bed/temple/mountain parts made the world
  // look empty even though all of the requested models existed in source.
  const paths=[...this.track.samples,...this.track.routes.flatMap(r=>r.samples)],box=new T.Box3();
  for(const group of this.static.children){const place=group.userData.placement;if(group.userData.structure||!place?.lane||!group.name)continue;
   const p=this.track.at(place.f*this.track.length,place.route),side=Math.sign(place.lane),base=group.position.clone();
   let found=false;
   for(let radius=0;radius<=280&&!found;radius+=12)for(let direction=0;direction<(radius?12:1);direction++){
    const a=direction*Math.PI/6,dx=(p.nx*side*Math.cos(a)+p.tx*Math.sin(a))*radius,dz=(p.nz*side*Math.cos(a)+p.tz*Math.sin(a))*radius;
    group.position.set(base.x+dx,base.y,base.z+dz);group.updateMatrixWorld(true);let collision=false;
    group.traverse(o=>{if(collision||!(o instanceof T.Mesh))return;box.setFromObject(o);collision=paths.some((q,i)=>i%2===0&&box.max.y>(q.y??0)-.1&&box.min.y<(q.y??0)+11&&q.x>box.min.x-this.track.halfWidth-5&&q.x<box.max.x+this.track.halfWidth+5&&q.z>box.min.z-this.track.halfWidth-5&&q.z<box.max.z+this.track.halfWidth+5);});if(!collision){found=true;break;}
   }
  }
  this.static.name='authored-'+this.track.id;this.moving.name='active-world-'+this.track.id;this.static.userData.landmarks=this.landmarks;
  const groups=this.static.children.filter(g=>g.name).map(g=>({g,before:g.children.length}));clearScenery(this.static,this.track);
  this.static.userData.assemblies=groups.map(({g,before})=>({name:g.name,before,after:g.children.length,position:g.position.toArray()}));mergeStatic(this.static);
 }
 update(time:number){for(const f of this.animations)f(time);}
}
