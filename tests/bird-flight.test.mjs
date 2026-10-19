import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createBirdFlight,CLIFFS,cliffDistance,FLIGHT_BOUNDS} from '../src/bird-flight.js';
import {FLOCK_SIZES,BOAT_WIDTH,birdScale,boatState,waterSurfaceY} from '../src/bay-space.js';
import {BIRD_SPECIES} from '../src/bird-models.js';

test('all four birds keep clearance, change depth, and steer without frame jumps over three minutes',()=>{
  for(let index=0;index<4;index++){
    const bird=createBirdFlight({index,seed:432+index,speed:[38,28,25,33][index]});
    let front=false,back=false;
    for(let frame=0;frame<60*180;frame++){
      const old=bird.position.clone(),{position,velocity}=bird.step(1/60);
      assert.ok(Number.isFinite(position.length()+velocity.length()));
      assert.ok(position.y>=FLIGHT_BOUNDS.bottom&&position.y<=FLIGHT_BOUNDS.top);
      assert.ok(position.x>=FLIGHT_BOUNDS.left&&position.x<=FLIGHT_BOUNDS.right);
      assert.ok(CLIFFS.every(c=>cliffDistance(position,c)>=1.0799));
      assert.ok(old.distanceTo(position)<.85,'no teleport between rendered frames');
      front ||= position.z>35;back ||= position.z< -35;
    }
    assert.ok(front&&back,'visits both sides of the mountains');assert.ok(bird.waypointCount>20);
  }
});
test('flight does not reset to a periodic orbit and a new seed gives a new journey',()=>{
  const a=createBirdFlight({seed:10}),b=createBirdFlight({seed:11});let last=a.position.clone();
  for(let second=0;second<150;second++){
    for(let frame=0;frame<60;frame++){a.step(1/60);b.step(1/60);}
    if(second%20===19){assert.ok(a.position.distanceTo(last)>2);last=a.position.clone();}
  }
  assert.ok(a.position.distanceTo(b.position)>5);
});

test('each flock stays together, visits the sea near the boat, and clears terrain',()=>{
  assert.ok(FLOCK_SIZES.every(count=>count>=2));
  const birds=[];
  [27,22,20,25].forEach((speed,index)=>{
    const leader=createBirdFlight({index,seed:430+index,speed});
    for(let member=0;member<FLOCK_SIZES[index];member++)birds.push({leader,member,
      flight:member?createBirdFlight({index,seed:430+index+member*997,speed,leader,member}):leader,nearSea:0});
  });
  for(let frame=0;frame<10800;frame++){
    const positions=birds.map(b=>b.flight.position.clone());
    birds.forEach((bird,index)=>{
      const before=bird.flight.position.clone(),{position}=bird.flight.step(1/60,positions.filter((_,j)=>j!==index));
      assert.ok(position.y>=waterSurfaceY(position.z)+9.99,'wings clear the sea at all depths');
      assert.ok(CLIFFS.every(c=>cliffDistance(position,c)>=1.0799));
      assert.ok(before.distanceTo(position)<.85,'continuous motion');
      if(bird.member)assert.ok(position.distanceTo(bird.leader.position)<45,'follower remains in its flock');
      if(position.y<120&&Math.abs(position.x-boatState(frame/60).x)<50)bird.nearSea++;
    });
  }
  assert.ok(birds.every(b=>b.nearSea>60),'all flock members spend time flying low near the boat');
});

test('perspective shrinks distant birds and keeps every wingspan far below boat size',()=>{
  BIRD_SPECIES.forEach((species,index)=>{
    const data={...species,index};
    assert.ok(birdScale(data,-90)<birdScale(data,90));
    for(let depth=-96;depth<=96;depth+=4){
      const projectedSpan=birdScale(data,depth)*2*(species.span+.6);
      assert.ok(projectedSpan<=BOAT_WIDTH*.125+1e-8);
    }
  });
});
