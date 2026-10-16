import test from 'node:test';
import assert from 'node:assert/strict';
import { Vector3 } from 'three';
import { createFlightRoute, orbitPosition, runwayProgress, RUNWAY_DURATION, FLIGHT_PERIOD, TAKEOFF_DURATION, MIN_CRUISE_ALTITUDE } from '../src/flight-route.js';

test('runway accelerates from rest and finishes drawing before lift-off with no velocity jump',()=>{
  const start=new Vector3(-200,135,65),end=new Vector3(-20,135,65),route=createFlightRoute(start,end);
  for(let t=0;t<=RUNWAY_DURATION;t+=.01){
    const p=route(t);
    assert.equal(p.y,start.y);
    assert.ok(Math.abs((p.x-start.x)/(end.x-start.x)-runwayProgress(t))<1e-9);
  }
  assert.equal(runwayProgress(RUNWAY_DURATION),1);
  assert.ok(route(.001).distanceTo(start)/.001<.1);
  const h=1e-4;
  const a=route(RUNWAY_DURATION).sub(route(RUNWAY_DURATION-h)).divideScalar(h);
  const b=route(RUNWAY_DURATION+h).sub(route(RUNWAY_DURATION)).divideScalar(h);
  assert.ok(a.distanceTo(b)<.02);
});

test('takeoff starts at the slogan and joins the orbit with continuous velocity',()=>{
  for(const departure of [new Vector3(-55,105,65),new Vector3(235,310,65)]) {
    const route=createFlightRoute(departure);
    assert.ok(route(0).distanceTo(departure)<1e-9);
    assert.ok(route(TAKEOFF_DURATION).distanceTo(orbitPosition(0))<1e-9);
    const step=1e-4;
    const before=route(TAKEOFF_DURATION).sub(route(TAKEOFF_DURATION-step)).divideScalar(step);
    const after=route(TAKEOFF_DURATION+step).sub(route(TAKEOFF_DURATION)).divideScalar(step);
    assert.ok(before.distanceTo(after)<.01);
  }
});
test('cruise stays above the water and passes both behind and in front of the cliffs',()=>{
  let rear=0,front=0;
  for(let t=0;t<=FLIGHT_PERIOD;t+=.025) {
    const point=orbitPosition(t);
    assert.ok(point.y>=MIN_CRUISE_ALTITUDE-1e-8);
    assert.ok(point.x>=22-1e-8 && point.x<=338+1e-8);
    if(point.z<-40)rear++;
    if(point.z>40)front++;
    assert.ok(point.distanceTo(orbitPosition(t+FLIGHT_PERIOD))<1e-8);
  }
  assert.ok(rear>100 && front>100);
});
