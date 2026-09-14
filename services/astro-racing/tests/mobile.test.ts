import test from 'node:test';
import assert from 'node:assert/strict';
import {tiltAngle,tiltTarget,smoothTilt,TiltCalibration} from '../src/core/mobileSteering';
import {CoastTrack} from '../src/tracks/sunspun/track';
import {KartPhysics} from '../src/vehicle/KartPhysics';
import {RaceSimulation} from '../src/race/RaceSimulation';
import {neutralInput} from '../src/core/Input';

test('tilt maps both landscape directions and portrait, including angle wrap',()=>{
  assert.ok(Math.abs(tiltAngle(12,3,90)+12)<1e-9);
  assert.ok(Math.abs(tiltAngle(12,3,270)-12)<1e-9);
  assert.ok(Math.abs(tiltAngle(0,3,0)-3)<1e-9);
  assert.equal(tiltTarget(2,0,3,1.4),0);
  assert.equal(tiltTarget(-2,0,3,1.4),0);
  assert.equal(tiltTarget(50,0,3,1.4),1);
  assert.equal(tiltTarget(-50,0,3,1.4),-1);
  assert.ok(Math.abs(tiltTarget(-179,179,0,1)-.08)<1e-9);
});
test('smoothing has the same response across frame rates and tuning changes',()=>{
  const integrate=(hz:number)=>{let value=0;for(let i=0;i<hz;i++)value=smoothTilt(value,.8,1/hz,.14);return value;};
  assert.ok(Math.abs(integrate(30)-integrate(120))<1e-12);
  assert.ok(smoothTilt(0,1,.1,.04)>smoothTilt(0,1,.1,.4));
  assert.equal(smoothTilt(.5,1,0,.14),.5);
});
test('throttle at a barrier stays finite and reverse moves away; recovery rearms after centered steering',()=>{
  const track=new CoastTrack(),physics=new KartPhysics(track),p=track.at(30);
  const barrier=track.surface(p.x,p.z).barrier??track.barrier;
  physics.state.x=p.x+p.nx*(barrier-.8);physics.state.z=p.z+p.nz*(barrier-.8);
  physics.state.heading=Math.atan2(p.nx,p.nz);
  for(let i=0;i<90;i++)physics.step({...neutralInput(),throttle:1},1/60);
  assert.ok(Number.isFinite(physics.state.speed));
  assert.ok(Math.abs(physics.state.speed)<4,'barrier can hold a powered kart at low speed');
  const atWall=Math.abs(track.surface(physics.state.x,physics.state.z).lateral);
  for(let i=0;i<45;i++)physics.step({...neutralInput(),brake:1},1/60);
  assert.ok(Math.abs(track.surface(physics.state.x,physics.state.z).lateral)<atWall-1,'brake/reverse backs off wall');
  const race=new RaceSimulation(track);race.status='racing';race.recover();
  race.step({...neutralInput(),throttle:1,steer:1,drift:true},1/60);assert.equal(race.player.steeringRearm,true);
  race.step({...neutralInput(),throttle:1},1/60);assert.equal(race.player.steeringRearm,false);
  for(let i=0;i<90;i++)race.step({...neutralInput(),throttle:1},1/60);
  assert.ok(race.player.state.speed>4,'recovered and centered kart accelerates normally');
});

test('gravity mapping survives Euler representation flips in both landscape grips',()=>{
  for(const angle of [90,270,-90]){
    assert.ok(Math.abs(tiltAngle(5,89,angle)-tiltAngle(175,-89,angle))<1e-9);
    assert.ok(Math.abs(tiltAngle(0,60,angle))<1e-9);
  }
  assert.ok(tiltAngle(-15,60,90)>0); // Right edge down.
  assert.ok(tiltAngle(15,-60,270)>0);
  assert.ok(tiltAngle(15,60,90)<0);
  assert.ok(tiltAngle(-15,-60,270)<0);
});
test('calibration requires stable valid samples and never steers from stale or invalid data',()=>{
  const sensor=new TiltCalibration();
  sensor.sample(12,60,90,0);assert.equal(sensor.ready(0),false);
  for(let t=50;t<=200;t+=50)sensor.sample(12,60,90,t);
  assert.equal(sensor.ready(200),true);assert.equal(sensor.target(200,3,1.4),0);
  sensor.sample(-8,60,90,250);assert.ok(sensor.target(250,3,1.4)>.5);
  sensor.sample(12,60,90,300);assert.equal(sensor.target(300,3,1.4),0);
  assert.equal(sensor.target(801,3,1.4),0);assert.equal(sensor.ready(801),false);
  for(const invalid of [null,NaN,Infinity,181]){
    assert.equal(sensor.sample(invalid,60,90,900),false);
    assert.equal(sensor.target(900,3,1.4),0);
  }
  sensor.reset();
  for(let t=0;t<=500;t+=50)sensor.sample(t%100?20:0,60,90,t);
  assert.equal(sensor.ready(500),false,'moving phone must not calibrate');
  sensor.reset();assert.equal(sensor.target(0,3,1.4),0);
});
