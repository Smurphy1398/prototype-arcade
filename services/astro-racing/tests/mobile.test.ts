import test from 'node:test';
import assert from 'node:assert/strict';
import {tiltAngle,tiltTarget,smoothTilt} from '../src/core/mobileSteering';
import {CoastTrack} from '../src/tracks/sunspun/track';
import {KartPhysics} from '../src/vehicle/KartPhysics';
import {RaceSimulation} from '../src/race/RaceSimulation';
import {neutralInput} from '../src/core/Input';

test('tilt maps both landscape directions and portrait, including angle wrap',()=>{
  assert.ok(Math.abs(tiltAngle(12,3,90)-12)<1e-9);
  assert.ok(Math.abs(tiltAngle(12,3,270)+12)<1e-9);
  assert.equal(tiltAngle(12,3,0),3);
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
