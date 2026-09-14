import { angleDelta, clamp, damp } from '../core/math';
import { handling, DEFAULT_GARAGE, type Handling } from '../content/garage';
import { TUNING as T } from '../content/tuning';
import type { DriveInput } from '../core/Input';
import type { TrackDefinition } from '../tracks/TrackDefinition';

export interface KartState {
  x: number; y: number; z: number; vx: number; vz: number; vy: number;
  heading: number; speed: number; steer: number; grounded: boolean;
  drifting: boolean; driftSign: number; charge: number; boost: number;
  offroad: boolean; progress: number; pitch: number;
  bank?:number;groundHeight:number; falling:boolean; rescueTime:number;
  route:string; airTime:number; airKind:'hop'|'ramp'|null; trick:'none'|'pending'|'missed'; trickTime:number;
}
export type KartEvent = { type: 'hop' | 'boost' | 'charge' | 'impact' | 'land' | 'recover'|'trick'|'trick-land'|'trick-miss'|'trick-ineligible'; value?: number };

export class KartPhysics {
  setup:Handling=handling(DEFAULT_GARAGE);
  state: KartState;
  previous: KartState;
  events: KartEvent[] = [];
  private driftHeld = false;
  private impactCooldown = 0;
  private rampLast = false;
  private stuckTime = 0;
  private chargeStage = 0;
  private trickBuffer=0;
  private trickHeld=false;
  constructor(readonly track: TrackDefinition) {
    this.state = this.spawn(4); this.previous = { ...this.state };
  }
  private spawn(s: number,route='main'): KartState {
    const p = this.track.at(s,route);
    const ground=this.track.surface(p.x,p.z,route,s);
    return { x: p.x, y: ground.height, z: p.z, vx: 0, vz: 0, vy: 0, heading: Math.atan2(p.tx, p.tz), speed: 0, steer: 0, grounded: true, drifting: false, driftSign: 0, charge: 0, boost: 0, offroad: false, progress: p.s, pitch: ground.slope??(ground.ramp?.17:0),groundHeight:ground.height,falling:false,rescueTime:0,route:ground.route??'main',airTime:0,airKind:null,trick:'none',trickTime:0 };
  }
  reset(s = 4,route='main') {
    this.state = this.spawn(s,route); this.previous = { ...this.state };
    this.driftHeld = false; this.rampLast = false; this.stuckTime = 0; this.chargeStage = 0;
    this.impactCooldown = 0; this.events = [];
    this.trickBuffer=0;this.trickHeld=false;
  }
  recover() {
    const {progress,route}=this.state;
    this.reset(progress,route); this.events.push({ type: 'recover' });
  }
  grantBoost(duration:number,impulse=0){const k=this.state;k.boost=Math.max(k.boost,duration);if(impulse){k.vx+=Math.sin(k.heading)*impulse;k.vz+=Math.cos(k.heading)*impulse;const speed=Math.hypot(k.vx,k.vz),scale=Math.min(1,(T.boostSpeed+2)/speed);k.vx*=scale;k.vz*=scale;k.speed=Math.hypot(k.vx,k.vz);}}
  step(input: DriveInput, dt: number) {
    this.previous = { ...this.state }; this.events = [];
    const k = this.state, surface = this.track.surface(k.x, k.z,k.route,k.progress);
    const trickPressed=!!input.trick&&!this.trickHeld;this.trickHeld=!!input.trick;
    this.trickBuffer=Math.max(0,this.trickBuffer-dt);
    if(trickPressed){this.trickBuffer=.15;if(k.airKind!=='ramp'&&!surface.ramp){this.events.push({type:'trick-ineligible'});}}
    if(k.rescueTime>0){k.rescueTime=Math.max(0,k.rescueTime-dt);return;}
    k.groundHeight=surface.height;k.bank=surface.bank??0;
    k.progress = surface.s; k.offroad = surface.offroad;k.route=surface.route??'main';
    this.impactCooldown = Math.max(0, this.impactCooldown - dt);
    k.boost = Math.max(0, k.boost - dt);
    k.steer = damp(k.steer, input.steer, 10, dt);
    const speed = Math.hypot(k.vx, k.vz), fx = Math.sin(k.heading), fz = Math.cos(k.heading);
    let forward = k.vx * fx + k.vz * fz;
    const driftPressed = input.drift && !this.driftHeld;
    if (driftPressed && k.grounded && speed > T.driftMinSpeed && !k.offroad) {
      k.vy = T.hopSpeed; k.grounded = false;
      k.airTime=0;k.airKind='hop';k.trick='none';k.trickTime=0;
      k.drifting = Math.abs(input.steer) > 0.2;
      k.driftSign = Math.sign(input.steer); k.charge = 0; this.chargeStage = 0;
      this.events.push({ type: 'hop' });
    }
    if (k.drifting && (!input.drift || speed < 7 || k.offroad)) {
      if (!input.drift && k.charge >= T.driftCharge1) {
        const level = k.charge >= T.driftCharge2 ? 2 : 1;
        k.boost = level === 2 ? T.boostDuration2 : T.boostDuration1;
        this.events.push({ type: 'boost', value: level });
      }
      k.drifting = false; k.charge = 0; this.chargeStage = 0;
    }
    this.driftHeld = input.drift;
    if (k.drifting) {
      k.charge += dt * (0.65 + Math.abs(k.steer) * 0.55);
      const stage = k.charge >= T.driftCharge2 ? 2 : k.charge >= T.driftCharge1 ? 1 : 0;
      if (stage > this.chargeStage) { this.events.push({ type: 'charge', value: stage }); this.chargeStage = stage; }
    }
    const surfaceScale=surface.speedScale??1,tireBenefit=surfaceScale<1?clamp((this.setup.offroadSpeed-15)/30,0,.10):0;
    const maxSpeed = k.offroad ? this.setup.offroadSpeed : k.boost > 0 ? T.boostSpeed : this.setup.topSpeed*(surfaceScale+tireBenefit);
    const acceleration = k.boost > 0 ? 35 : this.setup.acceleration;
    if (input.throttle > 0) forward += acceleration * input.throttle * dt;
    if (input.brake > 0) {
      if (forward > 0.5) forward = Math.max(0, forward - T.braking * input.brake * dt);
      else if (!input.throttle) forward = Math.max(-T.reverseSpeed, forward - 11 * input.brake * dt);
    }
    const resistance = T.rollingResistance*(surface.resistance??1) + Math.abs(forward) ** 2 * T.drag;
    forward -= Math.sign(forward) * Math.min(Math.abs(forward), resistance * dt);
    if (forward > maxSpeed) forward = Math.max(maxSpeed, forward - (k.offroad ? 32 : 17) * dt);
    forward = clamp(forward, -T.reverseSpeed, T.boostSpeed + 2);
    const steeringRate = (T.steerLow + (T.steerHigh - T.steerLow) * clamp(speed / T.topSpeed, 0, 1))*this.setup.steering;
    const driftSteer = k.drifting ? k.driftSign * 0.4 + k.steer * 0.85 : k.steer;
    // The model faces +Z: driver's right is -X in this right-handed world.
    k.heading -= driftSteer * steeringRate * clamp(speed / 7, 0, 1) * Math.sign(forward || 1) * (k.grounded ? 1 : 0.8) * dt;
    const side = k.vx * fz - k.vz * fx;
    const lateral = damp(side, k.drifting ? k.driftSign * speed * this.setup.slide : 0, (k.drifting ? T.driftGrip*this.setup.grip/10 : this.setup.grip)*(surface.grip??1), dt);
    k.vx = Math.sin(k.heading) * forward + Math.cos(k.heading) * lateral;
    k.vz = Math.cos(k.heading) * forward - Math.sin(k.heading) * lateral;
    k.x += k.vx * dt; k.z += k.vz * dt;
    let next = this.track.surface(k.x, k.z,k.route,k.progress);k.route=next.route??'main';
    if (k.grounded) {
      if (this.rampLast && !next.ramp && k.y > 1.5) {
        k.grounded = false; k.vy = Math.max(surface.launch??5, speed * (surface.launch?.24:.19));
        k.airTime=0;k.airKind='ramp';k.trick='none';k.trickTime=0;
      } else if(next.supported===false){
        k.grounded=false;k.vy=0;k.airTime=0;k.airKind=null;k.trick='none';
      } else {
        k.y = next.height;
        k.pitch = damp(k.pitch, next.slope??(next.ramp ? 0.17 : 0), 9, dt);
      }
    }
    if (!k.grounded) {
      k.airTime+=dt;
      if(this.trickBuffer>0&&k.airKind==='ramp'&&k.trick==='none'){
        k.trick=k.airTime<=.35?'pending':'missed';k.trickTime=0;this.trickBuffer=0;this.events.push({type:k.trick==='pending'?'trick':'trick-miss'});
      }
      if(k.trick==='pending')k.trickTime+=dt;
      k.vy -= T.gravity * dt; k.y += k.vy * dt;
      k.pitch = damp(k.pitch, clamp(k.vy * 0.025, -0.3, 0.25), 5, dt);
      // Swept landing on a rising road: a hop must not pass through the slope
      // while waiting for downward vertical velocity. A racer already below a
      // deck still falls normally and cannot snap up through it.
      const risingRoad=!k.falling&&surface.supported!==false&&this.previous.y>=surface.height-.5&&next.height-surface.height<=Math.max(1,speed*dt*.7);
      if (next.supported!==false && k.y <= next.height && (k.vy<=0||next.height>=this.previous.y) && (this.previous.y>=next.height-1.5||risingRoad)) {
        const impact = -k.vy;
        k.y = next.height; k.vy = 0; k.grounded = true;k.falling=false;
        if(k.trick==='pending'){this.grantBoost(.7,2.5);this.events.push({type:'trick-land'});}
        k.airKind=null;k.trick='none';k.airTime=0;
        if (impact > 3) this.events.push({ type: 'land', value: impact });
      }
    }
    k.falling=!k.grounded&&k.y<next.height-2.5;k.groundHeight=next.height;
    this.rampLast = next.ramp && k.grounded;
    const barrier=next.barrier??this.track.barrier;
    if (Math.abs(next.lateral) > barrier - T.kartRadius && k.y > next.height-1 && k.y < next.height+3.7 && (this.track.railAt?.(next.s,Math.sign(next.lateral),k.route)??true)) {
      const sign = Math.sign(next.lateral), nx = next.nx * sign, nz = next.nz * sign;
      const penetration = Math.abs(next.lateral) - (barrier - T.kartRadius);
      k.x -= nx * penetration; k.z -= nz * penetration;
      const impact = k.vx * nx + k.vz * nz;
      if (impact > 0) { k.vx -= nx * impact * 1.22; k.vz -= nz * impact * 1.22; k.vx *= 0.78; k.vz *= 0.78; this.hit(impact); }
    }
    for (const obstacle of this.track.obstacles) {
      const dx = k.x - obstacle.x, dz = k.z - obstacle.z, d = Math.hypot(dx, dz), min = obstacle.radius + T.kartRadius;
      if (d < min && Math.abs(k.y-next.height)<2) {
        const nx = d > 0.001 ? dx / d : next.nx, nz = d > 0.001 ? dz / d : next.nz;
        k.x = obstacle.x + nx * min; k.z = obstacle.z + nz * min;
        const dot = k.vx * nx + k.vz * nz;
        if (dot < 0) { k.vx -= nx * dot * 1.4; k.vz -= nz * dot * 1.4; this.hit(-dot); }
      }
    }
    k.speed = Math.hypot(k.vx, k.vz) * Math.sign(forward || 1);
    k.progress = next.s;
    this.stuckTime = k.falling || (next.supported===undefined&&(next.distance > 23 || k.y < -10)) ? this.stuckTime + dt : 0;
    if(this.stuckTime>1.1||k.y<next.height-22||k.airTime>4){if(next.supported===undefined)this.recover();else this.events.push({type:'recover'});}
    if (!Number.isFinite(k.x + k.y + k.z + k.heading)) this.reset();
    // Keep angles bounded without introducing an interpolation jump.
    if (Math.abs(k.heading) > Math.PI * 4) { const delta = angleDelta(0, k.heading); this.previous.heading += delta - k.heading; k.heading = delta; }
  }
  private hit(value: number) {
    this.state.drifting = false; this.state.charge = 0; this.state.boost = 0;this.state.trick='missed';
    if (this.impactCooldown <= 0 && value > 2) { this.events.push({ type: 'impact', value }); this.impactCooldown = 0.22; }
  }
}
