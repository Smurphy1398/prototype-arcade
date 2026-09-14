import {orbitMask} from '../items/OrbitCoco';
import * as THREE from 'three';
import { angleDelta, lerp } from '../core/math';
import type { KartState } from './KartPhysics';
import { DEFAULT_GARAGE, DRIVERS, PAINTS, TIRES, isBike, handling, type GarageSelection } from '../content/garage';
import { RACERS, type RacerLivery } from '../content/racers';
import { mergeStatic } from '../core/mergeStatic';

export class KartView {
  readonly group = new THREE.Group();
  private body = new THREE.Group();
  private driver = new THREE.Group();
  private frontWheels: THREE.Group[] = [];
  private wheels: THREE.Group[] = [];
  private flames: THREE.Mesh[] = [];
  private sparkBatch:THREE.InstancedMesh;private particleTransform=new THREE.Object3D();private particleColor=new THREE.Color();
  private shadow: THREE.Mesh;
  private bubble:THREE.Mesh;
  private rocketView=new THREE.Group();
  private orbitCharges:THREE.Mesh[]=[];
  constructor(scene: THREE.Scene, livery:RacerLivery=RACERS[0], readonly selection:GarageSelection=DEFAULT_GARAGE) {
    scene.add(this.group); this.group.add(this.body);
    this.bubble=new THREE.Mesh(new THREE.SphereGeometry(1.8,16,12),new THREE.MeshBasicMaterial({color:0x7af3e5,transparent:true,opacity:.18,wireframe:true,depthWrite:false}));this.bubble.position.y=1.2;this.bubble.visible=false;this.group.add(this.bubble);
    for(let i=0;i<3;i++){const m=new THREE.Mesh(new THREE.IcosahedronGeometry(.43,1),new THREE.MeshStandardMaterial({color:0xab7343}));this.group.add(m);this.orbitCharges.push(m);m.visible=false;}
    const teal = new THREE.MeshStandardMaterial({color:selection.primary??livery.color,roughness:.38,metalness:.16});
    const dark = new THREE.MeshStandardMaterial({color:0x123d47,roughness:.68});
    const cream = new THREE.MeshStandardMaterial({color:0xffefc7,roughness:.55});
    const trim=new THREE.MeshStandardMaterial({color:selection.secondary??0xffefc7,roughness:.5});
    const coral = new THREE.MeshStandardMaterial({color:livery.accent,roughness:.5});
    const gold = new THREE.MeshStandardMaterial({color:DRIVERS[selection.driver].skin,roughness:.65});
    const rubber = new THREE.MeshStandardMaterial({color:0x263137,roughness:.98});
    const metal = new THREE.MeshStandardMaterial({color:0xa7c5c3,metalness:.7,roughness:.3});
    const mesh = (g:THREE.BufferGeometry,m:THREE.Material,x:number,y:number,z:number,parent:THREE.Object3D=this.body,sx=1,sy=1,sz=1) => {const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;};
    const box=(m:THREE.Material,x:number,y:number,z:number,sx:number,sy:number,sz:number,parent:THREE.Object3D=this.body)=>mesh(new THREE.BoxGeometry(sx,sy,sz),m,x,y,z,parent);
    this.group.add(this.rocketView);this.rocketView.visible=false;
    const rocketBody=mesh(new THREE.CapsuleGeometry(.75,2.5,4,10),cream,0,1,0,this.rocketView);rocketBody.rotation.x=Math.PI/2;
    const nose=mesh(new THREE.ConeGeometry(.75,1.2,10),coral,0,1,2.05,this.rocketView);nose.rotation.x=Math.PI/2;
    for(const side of [-1,1])box(teal,side*.9,.7,-1.1,.9,.17,1.4,this.rocketView);
    mesh(new THREE.SphereGeometry(.4,10,7),dark,0,1.67,.4,this.rocketView);
    const exhaust=mesh(new THREE.ConeGeometry(.55,2,8),new THREE.MeshBasicMaterial({color:0xa7eaff}),0,1,-2.2,this.rocketView);exhaust.rotation.x=-Math.PI/2;
    const bike=isBike(selection.body);
    if(!bike)box(dark,0,.47,0,1.65,.32,2.5);
    else {
      box(dark,0,.9,-.1,.48,.22,1.7);box(teal,0,1.13,.4,.66,.6,1.1);box(dark,0,1.2,-.58,.55,.18,.95);
      mesh(new THREE.CylinderGeometry(.24,.3,.62,8),metal,0,.69,0).rotation.z=Math.PI/2;
      for(const side of [-1,1]){const fork=box(metal,side*.2,.94,1.05,.07,1.05,.08);fork.rotation.x=-.18;box(coral,side*.44,1.48,.83,.4,.07,.09);}
      box(metal,0,1.46,.83,1,.08,.1);
      const lamp=mesh(new THREE.SphereGeometry(.22,10,7),cream,0,1.21,1.06);lamp.scale.z=.4;
      if(selection.body==='scooter'){mesh(new THREE.SphereGeometry(1,12,8),teal,0,.95,.8,this.body,.65,.8,.28);mesh(new THREE.SphereGeometry(1,12,8),teal,0,.8,-.7,this.body,.65,.5,.7);box(trim,0,1.2,.98,.18,.8,.06);box(trim,0,.52,-.05,1,.15,1.5);}
      else if(selection.body==='roadbike'){const cowl=mesh(new THREE.ConeGeometry(.55,1.1,6),teal,0,1.2,.8);cowl.rotation.x=Math.PI/2;box(coral,0,.88,-1.2,.55,.13,.5);}
      else {box(trim,0,1.18,1.16,.5,.1,.85);box(coral,0,1.32,-.7,.5,.12,1);box(metal,.4,.87,-.75,.19,.2,.8);}
    }
    if(selection.decal!=='plain'){
      const y=bike?1.47:selection.body==='cargo'?1.14:selection.body==='arrow'?1.12:1.04,z=bike?.42:.74;
      if(selection.decal==='star'){const star=new THREE.Shape();for(let i=0;i<10;i++){const a=i*Math.PI/5,r=i%2?.13:.3;const x=Math.sin(a)*r,zz=Math.cos(a)*r;i?star.lineTo(x,zz):star.moveTo(x,zz);}star.closePath();const badge=mesh(new THREE.ShapeGeometry(star),cream,0,y,z);badge.rotation.x=-Math.PI/2;}
      else if(selection.decal==='chevron'){for(const along of [-.15,.2])for(const side of [-1,1]){const stripe=box(trim,side*.13,y,z+along,.075,.025,.38);stripe.rotation.y=side*.7;}}
      else box(trim,0,y,z,.15,.025,.8);
    }
    if(selection.body==='classic'){
      mesh(new THREE.SphereGeometry(1,12,8),teal,0,.63,.66,this.body,.91,.4,1.1);
      box(trim,0,.84,1.06,.25,.08,1.35);box(coral,0,.53,1.52,1.93,.21,.3);
    }else if(selection.body==='rally'){
      box(teal,0,.75,.6,1.8,.55,1.35);box(trim,0,1.04,.6,1.8,.08,1.35);box(coral,0,.7,-1.1,1.8,.5,.6);
      for(const side of [-1,1]){box(metal,side*.8,1.35,-.55,.12,1.7,.12);box(metal,side*.8,2.15,-.3,.12,.12,1.1);box(teal,side*1,.94,.1,.32,.13,2.65);box(metal,side*.95,.5,1.6,.25,.3,.25);}
      box(metal,0,2.15,-.6,1.7,.12,.12);box(metal,0,.5,1.6,2.2,.18,.18);
      for(const x of [-.5,0,.5])mesh(new THREE.SphereGeometry(.18,8,6),cream,x,2.25,-.5);
      const spare=mesh(new THREE.TorusGeometry(.36,.14,6,12),rubber,0,1.1,-1.5);spare.rotation.y=Math.PI/2;
    }else if(selection.body==='buggy'){
      box(teal,0,.77,.68,1.45,.6,1.15);box(trim,0,1.09,.7,.3,.04,1.12);
      box(metal,0,.52,1.5,2.05,.18,.22);box(metal,0,.65,-1.45,2,.18,.22);
      for(const side of [-1,1]){box(dark,side*.71,1.4,-.65,.12,1.6,.12);box(dark,side*.71,2.16,-.35,.12,.12,.8);box(coral,side*.92,.9,-.1,.28,.17,2.45);}
      box(dark,0,2.16,-.7,1.55,.12,.12);
      for(const side of [-1,1])mesh(new THREE.SphereGeometry(.22,8,6),cream,side*.52,.95,1.32);
      const spare=mesh(new THREE.TorusGeometry(.36,.14,6,12),rubber,0,1,-1.46);spare.rotation.x=.2;
    }else if(selection.body==='cargo'){
      box(teal,0,.8,.55,1.6,.5,1.15);box(trim,0,1.09,.55,1.7,.08,1.25);
      box(coral,0,.84,-.94,1.75,.58,.75);for(const side of [-1,1])box(metal,side*.84,1.16,-.91,.12,.12,.9);
      for(const side of [-1,1])mesh(new THREE.SphereGeometry(.19,8,6),cream,side*.56,.98,1.18);
      box(metal,0,.55,1.4,1.9,.18,.24);
    }else if(selection.body==='saucer'){
      mesh(new THREE.SphereGeometry(1,20,8),teal,0,.65,.12,this.body,1.42,.36,1.65);
      const ring=mesh(new THREE.TorusGeometry(1,.07,6,24),coral,0,.69,.12);ring.rotation.x=Math.PI/2;ring.scale.set(1.4,1.62,1);
      for(const side of [-1,1])box(trim,side*.8,.94,.45,.25,.07,.75);
    }else if(selection.body==='arrow'){
      const nose=mesh(new THREE.ConeGeometry(.78,2.3,5),teal,0,.68,.9,this.body,1,.9,.65);nose.rotation.x=Math.PI/2;
      box(trim,0,.92,.68,.17,.06,1.8);box(coral,0,.44,1.64,2.4,.12,.52);
      for(const side of [-1,1]){mesh(new THREE.SphereGeometry(1,10,6),teal,side*.77,.56,-.4,this.body,.3,.25,1.1);const fin=mesh(new THREE.ConeGeometry(.36,.8,3),coral,side*.7,1,-1.2);fin.rotation.x=-.5;}
    }
    for(const side of [-1,1]) {
      if(selection.body==='classic'){box(teal,side*.78,.67,-.48,.38,.52,1.38);box(trim,side*.81,.86,-.48,.39,.08,1.24);}
      // Family attachment points keep pipes and boost flames on the moving body.
      if(!bike||side===1){const x=bike?.36:side*.6,y=bike?.91:.57,z=bike?-.89:-1.35;
        const pipe=mesh(new THREE.CylinderGeometry(.12,.16,bike?.86:.52,10),metal,x,y,z);pipe.rotation.x=Math.PI/2;pipe.name='attached-exhaust';
        if(bike){box(metal,.28,.8,-.54,.18,.16,.6);box(dark,.35,.91,-.65,.32,.12,.09);}
        const flame=mesh(new THREE.ConeGeometry(.19,1.2,7),new THREE.MeshBasicMaterial({color:0x8bfff0}),x,y,z-(bike?.94:.67));flame.rotation.x=-Math.PI/2;flame.visible=false;this.flames.push(flame);
      }
      for(const front of [false,true]) {
        if(bike&&side===1)continue;
        const pivot=new THREE.Group();pivot.position.set(bike?0:side*1.02,TIRES[selection.tires].radius+(bike?.12:0),front?(bike?1.14:.86):(bike?-1.16:-.9));this.body.add(pivot);if(front)this.frontWheels.push(pivot);
        const spin=new THREE.Group();pivot.add(spin);this.wheels.push(spin);
        const wheel=mesh(new THREE.CylinderGeometry(TIRES[selection.tires].radius+(bike?.12:0),TIRES[selection.tires].radius+(bike?.12:0),selection.tires==='trail'?.47:.37,14),rubber,0,0,0,spin);wheel.rotation.z=Math.PI/2;
        if(selection.tires==='snow'){for(let n=0;n<12;n++){const tread=box(dark,0,Math.sin(n*Math.PI/6)*(TIRES.snow.radius+(bike?.12:0)),Math.cos(n*Math.PI/6)*(TIRES.snow.radius+(bike?.12:0)),.43,.11,.19,spin);tread.rotation.x=-n*Math.PI/6;}}
        if(selection.tires==='whitewall'||selection.tires==='cosmic'){const radius=TIRES[selection.tires].radius+(bike?.12:0);for(const sideBand of [-.2,.2]){const ring=mesh(new THREE.TorusGeometry(radius*.72,.055,5,20),selection.tires==='cosmic'?new THREE.MeshBasicMaterial({color:0x77f6e9}):cream,sideBand,0,0,spin);ring.rotation.y=Math.PI/2;}if(selection.tires==='whitewall')for(let n=0;n<8;n++){const spoke=box(metal,.21,0,0,.035,.035,radius*1.6,spin);spoke.rotation.x=n*Math.PI/4;}}
        if(selection.tires==='trail'){for(const sideBand of [-.19,.19]){const tread=mesh(new THREE.TorusGeometry(.46,.065,4,10),dark,sideBand,0,0,spin);tread.rotation.y=Math.PI/2;}}
        const hub=mesh(new THREE.CylinderGeometry(.24,.24,selection.tires==='trail'?.5:.4,10),cream,0,0,0,spin);hub.rotation.z=Math.PI/2;
        const center=mesh(new THREE.CylinderGeometry(.105,.105,selection.tires==='trail'?.52:.42,8),coral,0,0,0,spin);center.rotation.z=Math.PI/2;
      }
      if(selection.body==='classic'){box(dark,side*.62,1.08,-1.05,.12,.8,.13);box(coral,side*.62,1.46,-1.05,.3,.1,.44);}
    }
    if(selection.body==='classic'){box(teal,0,1.49,-1.05,1.98,.13,.44);box(trim,0,1.56,-1.05,.3,.025,.43);}
    if(!bike)box(dark,0,.96,-.39,.86,.73,.72);
    if(!bike){const steering=mesh(new THREE.TorusGeometry(.28,.05,6,12),dark,0,1.12,.34);steering.rotation.x=-.7;}
    else for(const side of [-1,1]){box(metal,side*.35,.69,-.1,.4,.08,.12);box(dark,side*.47,1.46,.83,.2,.1,.13);}
    this.body.add(this.driver);
    if(selection.driver==='pip'){
    // Pip, an original sun gecko: round snout, swept coral head fins, a curled tail, racing goggles.
    mesh(new THREE.SphereGeometry(1,12,9),coral,0,1.42,-.22,this.driver,.43,.56,.36);
    mesh(new THREE.SphereGeometry(1,14,10),gold,0,2.12,-.15,this.driver,.58,.51,.54);
    mesh(new THREE.SphereGeometry(1,12,8),gold,0,1.94,.28,this.driver,.48,.26,.4);
    mesh(new THREE.SphereGeometry(1,10,7),cream,0,1.78,.38,this.driver,.37,.1,.24);
    for(const side of [-1,1]) {
      const fin=mesh(new THREE.ConeGeometry(.23,.71,5),coral,side*.45,2.45,-.39,this.driver);fin.rotation.z=-side*.4;fin.rotation.x=-.3;
      mesh(new THREE.SphereGeometry(1,10,8),cream,side*.32,2.19,.25,this.driver,.27,.25,.23);
      mesh(new THREE.SphereGeometry(1,10,8),dark,side*.32,2.19,.42,this.driver,.2,.17,.075);
      mesh(new THREE.SphereGeometry(1,8,6),new THREE.MeshBasicMaterial({color:0xa3eae3}),side*.37,2.25,.479,this.driver,.05,.04,.01);
      const arm=mesh(new THREE.CapsuleGeometry(.13,.48,4,8),gold,side*.36,1.43,.16,this.driver);arm.rotation.x=-.8;arm.rotation.z=side*.23;
      mesh(new THREE.SphereGeometry(.16,8,6),cream,side*.32,1.22,.4,this.driver);
    }
    const tail=mesh(new THREE.TorusGeometry(.38,.13,6,12,Math.PI*1.4),gold,.22,1.07,-.82,this.driver);tail.rotation.y=.6;
    box(cream,0,1.53,.131,.15,.4,.02,this.driver);
    }else if(!['rove','moss'].includes(selection.driver)){
      const id=selection.driver;
      mesh(new THREE.SphereGeometry(1,12,8),coral,0,1.42,-.22,this.driver,.43,.53,.36);
      if(id==='lexo'){
        mesh(new THREE.CylinderGeometry(.36,.49,1.12,10),gold,0,2.16,-.1,this.driver);
        const green=new THREE.MeshStandardMaterial({color:0x4cb775,roughness:.6});
        for(let i=0;i<5;i++){const leaf=mesh(new THREE.ConeGeometry(.19,.88,5),green,(i-2)*.13,2.88,-.13,this.driver);leaf.rotation.z=(i-2)*-.22;}
        box(dark,0,2.34,.27,.87,.23,.1,this.driver);box(cream,0,2.02,.29,.25,.035,.04,this.driver);
        for(const side of [-1,1])box(metal,side*.22,2.38,.331,.21,.025,.02,this.driver);
      }else if(id==='rivet'){
        mesh(new THREE.SphereGeometry(1,12,9),gold,0,2.1,-.12,this.driver,.59,.46,.46);
        for(const side of [-1,1]){mesh(new THREE.SphereGeometry(.23,9,6),gold,side*.44,2.5,-.18,this.driver);mesh(new THREE.SphereGeometry(1,10,7),dark,side*.25,2.2,.26,this.driver,.26,.14,.16);}
        mesh(new THREE.SphereGeometry(.22,9,6),cream,0,2.01,.35,this.driver);mesh(new THREE.SphereGeometry(.09,7,5),dark,0,2.06,.54,this.driver);
        for(let i=0;i<6;i++)mesh(new THREE.SphereGeometry(.2,8,6),i%2?dark:gold,.48,1.15,-.7-i*.15,this.driver);
      }else if(id==='coco'){
        mesh(new THREE.SphereGeometry(1,12,9),gold,0,2.1,-.12,this.driver,.48,.56,.42);
        for(let i=0;i<4;i++){const crest=mesh(new THREE.ConeGeometry(.14,.65,5),coral,(i-1.5)*.14,2.77,-.1,this.driver);crest.rotation.z=(i-1.5)*-.17;}
        const beak=mesh(new THREE.ConeGeometry(.22,.5,6),dark,0,2.05,.4,this.driver);beak.rotation.x=1.2;
        for(const side of [-1,1])mesh(new THREE.SphereGeometry(1,8,6),gold,side*.42,1.52,-.2,this.driver,.2,.45,.25);
      }else if(id==='orbit'){
        mesh(new THREE.SphereGeometry(1,12,10),gold,0,2.15,-.12,this.driver,.53,.65,.49);
        for(let i=0;i<6;i++){const arm=mesh(new THREE.CapsuleGeometry(.10,.42,3,6),gold,Math.sin(i*Math.PI/3)*.44,1.71,Math.cos(i*Math.PI/3)*.32,this.driver);arm.rotation.z=Math.sin(i)*.7;}
        const helmet=mesh(new THREE.SphereGeometry(.76,16,12),new THREE.MeshStandardMaterial({color:0xb8f3ff,transparent:true,opacity:.18,roughness:.2,depthWrite:false}),0,2.2,-.1,this.driver);
        const seal=mesh(new THREE.TorusGeometry(.57,.07,6,16),cream,0,1.75,-.1,this.driver);seal.rotation.x=Math.PI/2;
      }else if(id==='nadia'){
        mesh(new THREE.SphereGeometry(1,12,9),gold,0,2.17,-.14,this.driver,.5,.51,.47);
        mesh(new THREE.SphereGeometry(1,12,8),gold,0,1.98,.35,this.driver,.39,.24,.58);
        box(cream,0,1.83,.46,.54,.08,.51,this.driver);
        for(const side of [-1,1]){mesh(new THREE.SphereGeometry(.18,9,6),cream,side*.34,2.29,.22,this.driver);mesh(new THREE.SphereGeometry(.09,8,5),dark,side*.35,2.30,.38,this.driver);mesh(new THREE.SphereGeometry(.045,6,4),dark,side*.2,2.04,.83,this.driver);}
        for(let i=0;i<3;i++)mesh(new THREE.ConeGeometry(.13,.26,4),coral,0,2.6-i*.08,-.3-i*.17,this.driver);
        box(dark,0,2.57,-.02,.85,.1,.25,this.driver);box(metal,0,2.59,.12,.63,.19,.1,this.driver);box(dark,0,2.59,.18,.49,.09,.025,this.driver);
        const tail=mesh(new THREE.ConeGeometry(.21,1.05,7),gold,.48,1.27,-.95,this.driver);tail.rotation.x=-1.25;tail.rotation.z=-.4;
        box(coral,0,1.67,.1,.6,.15,.22,this.driver);
      }else if(id==='aya'){
        mesh(new THREE.SphereGeometry(1,14,10),gold,0,2.12,-.12,this.driver,.63,.45,.47);
        const pink=new THREE.MeshStandardMaterial({color:0xdb699c,roughness:.6});
        for(const side of [-1,1])for(let i=0;i<3;i++){const gill=mesh(new THREE.CapsuleGeometry(.09,.52,3,6),pink,side*.66,2+(i-1)*.23,-.1,this.driver);gill.rotation.z=side*(.65+i*.45);}
        box(dark,0,2.48,-.02,1,.1,.4,this.driver);for(const side of [-1,1])mesh(new THREE.SphereGeometry(.15,8,6),metal,side*.22,2.51,.2,this.driver);
        const tail=mesh(new THREE.ConeGeometry(.3,.85,6),pink,0,1.17,-1,this.driver);tail.rotation.x=-1.1;
      }else if(id==='bolt'){
        box(gold,0,2.1,-.12,1.1,.88,.82,this.driver);box(dark,0,2.23,.3,.89,.31,.04,this.driver);
        for(const side of [-1,1]){box(new THREE.MeshBasicMaterial({color:0x87ffdf}),side*.24,2.24,.33,.2,.055,.02,this.driver);box(coral,side*.63,2.15,-.15,.2,.45,.38,this.driver);}
        mesh(new THREE.CylinderGeometry(.035,.04,.3,6),metal,0,2.68,-.13,this.driver);mesh(new THREE.SphereGeometry(.12,8,6),coral,0,2.86,-.13,this.driver);box(dark,0,1.86,.31,.45,.08,.03,this.driver);
      }else if(id==='ember'){
        mesh(new THREE.SphereGeometry(1,14,9),gold,0,2.1,-.13,this.driver,.61,.48,.48);
        for(const side of [-1,1]){mesh(new THREE.SphereGeometry(.25,10,7),gold,side*.47,2.5,-.16,this.driver);mesh(new THREE.SphereGeometry(.16,8,6),cream,side*.48,2.51,.015,this.driver);const cheek=mesh(new THREE.SphereGeometry(1,8,6),cream,side*.37,2.03,.23,this.driver,.27,.14,.13);cheek.rotation.z=-side*.45;}
        mesh(new THREE.SphereGeometry(.11,8,6),dark,0,2.04,.43,this.driver);
        for(let i=0;i<6;i++){const tail=mesh(new THREE.SphereGeometry(1,8,6),i%2?gold:dark,.53,1.13+i*.035,-.8-i*.14,this.driver,.23,.23,.2);}
      }else {
        const hair=new THREE.MeshStandardMaterial({color:0x3b2941,roughness:.8});mesh(new THREE.SphereGeometry(1,12,9),hair,0,2.18,-.19,this.driver,.54,.56,.45);
        mesh(new THREE.SphereGeometry(1,14,10),gold,0,2.12,-.02,this.driver,.45,.47,.41);
        mesh(new THREE.SphereGeometry(1,10,7),hair,-.23,2.46,.11,this.driver,.33,.19,.27);
        const ponytail=mesh(new THREE.CapsuleGeometry(.19,.5,4,8),hair,.3,2.04,-.67,this.driver);ponytail.rotation.x=-.4;
        box(coral,0,2.47,.28,.78,.17,.14,this.driver);for(const side of [-1,1])box(metal,side*.2,2.49,.36,.25,.08,.04,this.driver);
        box(cream,0,1.5,.15,.13,.44,.07,this.driver);
      }
      if(id!=='lexo'&&id!=='bolt'&&id!=='nadia')for(const side of [-1,1])mesh(new THREE.SphereGeometry(.075,8,6),dark,side*.23,2.21,.36,this.driver);
      for(const side of [-1,1]){const arm=mesh(new THREE.CapsuleGeometry(.13,.48,4,8),id==='bolt'?metal:gold,side*.38,1.44,.15,this.driver);arm.rotation.x=-.8;arm.rotation.z=side*.23;mesh(new THREE.SphereGeometry(.16,8,6),cream,side*.32,1.22,.4,this.driver);}
    }else{
      const dog=selection.driver==='rove';
      mesh(new THREE.SphereGeometry(1,12,8),coral,0,1.42,-.22,this.driver,.43,.55,.37);
      mesh(new THREE.SphereGeometry(1,12,9),gold,0,2.06,-.13,this.driver,dog?.54:.7,dog?.52:.37,.5);
      if(dog){
        mesh(new THREE.SphereGeometry(1,10,7),cream,0,1.99,.33,this.driver,.4,.27,.38);
        mesh(new THREE.SphereGeometry(.17,8,6),dark,0,2.08,.65,this.driver,1,.75,.65);
        for(const side of [-1,1]){const ear=mesh(new THREE.ConeGeometry(.25,.81,5),gold,side*.41,2.62,-.24,this.driver);ear.rotation.z=side*.3;mesh(new THREE.SphereGeometry(1,8,6),dark,side*.27,2.21,.32,this.driver,.09,.13,.07);}
        const tail=mesh(new THREE.CapsuleGeometry(.13,.55,3,7),gold,.39,1.18,-.9,this.driver);tail.rotation.z=-.8;
      }else{
        for(const side of [-1,1]){mesh(new THREE.SphereGeometry(.32,10,8),gold,side*.44,2.39,.06,this.driver);mesh(new THREE.SphereGeometry(.235,10,7),cream,side*.44,2.42,.27,this.driver);mesh(new THREE.SphereGeometry(.12,8,6),dark,side*.44,2.43,.46,this.driver);}
        mesh(new THREE.SphereGeometry(1,10,6),cream,0,1.9,.32,this.driver,.51,.1,.19);
        const smile=mesh(new THREE.TorusGeometry(.3,.027,5,14,Math.PI),dark,0,1.98,.47,this.driver);smile.rotation.z=Math.PI;smile.scale.y=.26;
      }
      for(const side of [-1,1]){const arm=mesh(new THREE.CapsuleGeometry(.13,.48,4,8),gold,side*.39,1.44,.15,this.driver);arm.rotation.x=-.8;arm.rotation.z=side*.23;mesh(new THREE.SphereGeometry(.16,8,6),cream,side*.32,1.22,.4,this.driver);}
      box(cream,0,1.59,.16,.55,.12,.1,this.driver);
    }
    for(const side of [-1,1]){if(bike){const leg=mesh(new THREE.CapsuleGeometry(.12,.38,3,7),coral,side*.35,1,.08,this.driver);leg.rotation.x=-.6;mesh(new THREE.SphereGeometry(1,8,6),dark,side*.39,.63,.04,this.driver,.14,.14,.28);}else mesh(new THREE.SphereGeometry(1,8,6),cream,side*.27,.83,.42,this.driver,.17,.14,.32);}
    const badge=mesh(new THREE.CircleGeometry(.2,5),cream,0,.79,-1.267);badge.rotation.y=Math.PI;
    // Drivers react as one object; batch their fixed pieces without touching
    // wheel steering, tire rotation, exhaust or the whole-rider animation.
    mergeStatic(this.driver);const fixed=new THREE.Group();
    for(const child of [...this.body.children])if(child instanceof THREE.Mesh&&!this.flames.includes(child))fixed.add(child);
    this.body.add(fixed);mergeStatic(fixed);
    this.sparkBatch=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(.075,0),new THREE.MeshBasicMaterial({color:0xffffff}),18);this.sparkBatch.frustumCulled=false;this.sparkBatch.visible=false;scene.add(this.sparkBatch);for(const wheel of this.wheels)mergeStatic(wheel);
    const cvs=document.createElement('canvas');cvs.width=cvs.height=64;const ctx=cvs.getContext('2d')!,g=ctx.createRadialGradient(32,32,5,32,32,30);g.addColorStop(0,'rgba(13,48,47,.4)');g.addColorStop(1,'rgba(13,48,47,0)');ctx.fillStyle=g;ctx.fillRect(0,0,64,64);
    this.shadow=new THREE.Mesh(new THREE.PlaneGeometry(3.8,4.5),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cvs),transparent:true,depthWrite:false}));this.shadow.rotation.x=-Math.PI/2;scene.add(this.shadow);
    if(livery.code!=='01'){
      const label=document.createElement('canvas');label.width=256;label.height=64;const c=label.getContext('2d')!;c.fillStyle='#123f47';c.fillRect(0,0,256,64);c.fillStyle='#fff0cb';c.textAlign='center';c.font='bold 27px Trebuchet MS';c.fillText(`${livery.code}  ${livery.name.toUpperCase()}`,128,43);const map=new THREE.CanvasTexture(label);map.colorSpace=THREE.SRGBColorSpace;
      const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map,transparent:true,depthWrite:false}));sprite.name='opponent-label';sprite.position.y=3.25;sprite.scale.set(1.8,.45,1);this.group.add(sprite);
    }
  }
  dispose(){
    const objects:THREE.Object3D[]=[this.group,this.shadow,this.sparkBatch];const geometries=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>();
    for(const root of objects){root.removeFromParent();root.traverse(o=>{if(o instanceof THREE.Mesh||o instanceof THREE.Sprite){if(o instanceof THREE.Mesh)geometries.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])materials.add(m);}});}
    this.sparkBatch.dispose();for(const g of geometries)g.dispose();for(const m of materials){const map=(m as THREE.MeshBasicMaterial).map;map?.dispose();m.dispose();}
  }
  update(previous:KartState,k:KartState,alpha:number,dt:number,time:number,status:{shield:number;protection:number;hitFlash:number;shieldFlash?:number;actionFlash?:number;rocket?:number;item?:string|null;charges?:number;orbitMask?:number;orbitTime?:number}={shield:0,protection:0,hitFlash:0}) {
    const x=lerp(previous.x,k.x,alpha),y=lerp(previous.y,k.y,alpha),z=lerp(previous.z,k.z,alpha);
    const heading=previous.heading+angleDelta(previous.heading,k.heading)*alpha;
    this.group.position.set(x,y+.05,z);this.group.rotation.y=heading;
    this.body.rotation.z=(k.bank??0)+k.steer*Math.min(Math.abs(k.speed)/33,1)*handling(this.selection).lean+(k.trick==='pending'?Math.min(1,k.trickTime/.48)*Math.PI*2:0);
    this.body.rotation.y=status.hitFlash>0?(1-status.hitFlash/.65)*Math.PI*2:0;
    for(const [i,m]of this.orbitCharges.entries()){m.visible=this.group.visible&&['triple','tripleBoost','ember'].includes(status.item??'')&&(status.item==='triple'?!!(orbitMask({item:'triple',charges:status.charges??0,orbitMask:status.orbitMask??0})&(1<<i)):i<(status.charges??0));const a=(status.orbitTime??time)*2+i*Math.PI*2/3;m.position.set(Math.sin(a)*2,1+Math.cos(a*2)*.12,Math.cos(a)*2);const material=m.material as THREE.MeshStandardMaterial;material.color.setHex(status.item==='triple'?0xab7343:status.item==='ember'?0xff733d:0xffce4d);material.emissive.setHex(status.item==='triple'?0:status.item==='ember'?0x8b2200:0x665100);}
    this.rocketView.scale.setScalar(1.35);
    this.rocketView.visible=(status.rocket??0)>0;this.rocketView.rotation.z=Math.sin(time*6)*.07;
    this.body.visible=!this.rocketView.visible&&(status.protection<=0||Math.sin(time*27)>-.25);
    this.bubble.visible=status.shield>0||(status.shieldFlash??0)>0;this.bubble.scale.setScalar(1+(Math.max(status.shieldFlash??0,status.actionFlash??0))*.7);(this.bubble.material as THREE.MeshBasicMaterial).opacity=status.shield>0?.22:.5;this.bubble.rotation.y=time*.8;
    this.body.rotation.x=-k.pitch;this.driver.rotation.z=k.steer*(isBike(this.selection.body)?-.1:.12);this.driver.rotation.x=isBike(this.selection.body)?.18:0;
    this.driver.rotation.y=Math.sin(time*1.4)*.06*(Math.abs(k.speed)<1?1:0)+(status.hitFlash>0?.15:0);
    this.driver.position.y=(isBike(this.selection.body)?.13:0)+(k.grounded?Math.sin(time*29)*Math.min(Math.abs(k.speed)/33,1)*.017:0);
    for(const p of this.frontWheels)p.rotation.y=-k.steer*.34;
    for(const w of this.wheels)w.rotateX(k.speed*dt*2.3);
    for(const f of this.flames){f.visible=k.boost>0;f.scale.set(1.45,1.4+Math.sin(time*43)*.32,1.45);}
    const active=this.group.visible&&((status.actionFlash??0)>0||k.boost>0||k.drifting&&k.charge>.2);
    this.sparkBatch.visible=active;
    if(active){for(let i=0;i<18;i++){
      const age=((time*2+i/18)%1),side=i%2?1:-1,along=-1-age*((status.rocket??0)>0?22:k.boost>0?9:4),across=side*(.95+age*.7),p=this.particleTransform;
      p.position.set(x+Math.sin(heading)*along+Math.cos(heading)*across,y+.3+Math.sin(age*Math.PI)*.55,z+Math.cos(heading)*along-Math.sin(heading)*across);p.scale.setScalar((1-age)*1.4);p.updateMatrix();this.sparkBatch.setMatrixAt(i,p.matrix);this.particleColor.setHex(k.boost>0?0xffe09b:k.charge>=1.8?0xffbd43:0x68eaff);this.sparkBatch.setColorAt(i,this.particleColor);
    }this.sparkBatch.instanceMatrix.needsUpdate=true;this.sparkBatch.instanceColor!.needsUpdate=true;}
    this.shadow.visible=this.group.visible&&!k.falling&&k.y>=k.groundHeight-.5;this.shadow.position.set(x,k.groundHeight+.036,z);this.shadow.rotation.z=-heading;this.shadow.scale.setScalar(1+Math.max(0,y-k.groundHeight)*.055);
  }
}
