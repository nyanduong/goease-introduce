import {Vector3,MathUtils} from 'three';
import {boatState,waterSurfaceY} from './bay-space.js';
export const FLIGHT_BOUNDS={left:18,right:342,bottom:78,top:264,back:-96,front:96};
export const CLIFFS=[
  {x:66,y:150,z:0,rx:40,ry:58,rz:20},
  {x:176,y:177,z:0,rx:63,ry:80,rz:28},
  {x:284,y:150,z:0,rx:43,ry:62,rz:22},
];
export function seededRandom(seed){let value=seed>>>0;return ()=>{value=(value+0x6D2B79F5)>>>0;let n=value;n=Math.imul(n^(n>>>15),n|1);n^=n+Math.imul(n^(n>>>7),n|61);return ((n^(n>>>14))>>>0)/4294967296;};}
export function cliffDistance(position,cliff){return Math.hypot((position.x-cliff.x)/cliff.rx,(position.y-cliff.y)/cliff.ry,(position.z-cliff.z)/cliff.rz);}

export function createBirdFlight({seed=1,index=0,speed=30,leader=null,member=0}={}){
  const starts=[[84,103,74],[125,210,65],[205,230,-65],[285,175,55]];
  const random=seededRandom(seed),position=leader?leader.position.clone().add(new Vector3(-member*7,member*3,member%2?6:-6)):new Vector3(...starts[index%4]);
  const velocity=leader?leader.velocity.clone():new Vector3(index%2?-speed:speed,0,0);
  const acceleration=new Vector3(),target=new Vector3(),desired=new Vector3(),offset=new Vector3(),side=new Vector3();
  let angle=index*1.67,direction=index%2?-1:1,remaining=0,elapsed=0,waypoints=0,bank=0,glide=0;
  let mode=index===0?'approach':'cruise',cruiseStops=index===3?1:0,modeRemaining=1+random()*2,gliding=false,skimOrbit=random()*Math.PI*2;
  const skimOffset=(index%2?-1:1)*(12+random()*12),skimHeight=18+random()*8;
  function chooseTarget(){
    if(mode==='cruise'&&cruiseStops++>=2){mode='approach';cruiseStops=0;}
    else if(mode==='approach')mode='skim';
    else if(mode==='skim')mode='climb';
    else if(mode==='climb')mode='cruise';
    if(mode==='approach'||mode==='skim'){
      const boat=boatState(elapsed);
      target.set(MathUtils.clamp(boat.x+skimOffset,38,320),boat.waterline+skimHeight,70+random()*12);
      remaining=mode==='approach'?15+random()*5:5+random()*4;
    }else{
      if(random()<.12)direction*=-1;
      angle+=direction*(.8+random()*1.05);
      target.set(180+Math.cos(angle)*(125+random()*30),mode==='climb'?207+random()*36:172+random()*73,Math.sin(angle)*(52+random()*35));
      for(const cliff of CLIFFS)if(cliffDistance(target,cliff)<1.5)target.z=(target.z<0?-1:1)*(55+random()*30);
      remaining=mode==='climb'?9:5+random()*4;
    }
    waypoints++;
  }
  if(!leader)chooseTarget();
  function step(dt,neighbors=[]){
    const steps=Math.ceil(Math.min(dt,.2)/(1/90)),h=Math.min(dt,.2)/Math.max(1,steps);
    for(let n=0;n<steps;n++){
      elapsed+=h;remaining-=h;
      if(leader){
        desired.copy(leader.velocity).normalize();side.set(-desired.z,0,desired.x).normalize();
        target.copy(leader.position).addScaledVector(desired,-(7+member*4)).addScaledVector(side,(member%2?1:-1)*(5+member*2));
        target.y+=2+Math.sin(elapsed*.8+member)*1.5;
        target.y=Math.max(target.y,waterSurfaceY(target.z)+12);
        desired.subVectors(target,position).multiplyScalar(1.9).add(leader.velocity).clampLength(0,speed*1.28);
      }else{
        if(remaining<=0||(mode!=='skim'&&position.distanceToSquared(target)<180))chooseTarget();
        if(mode==='skim'){
          const boat=boatState(elapsed);skimOrbit+=h*(.65+index*.04);
          target.x=MathUtils.clamp(boat.x+Math.cos(skimOrbit)*32,32,328);
          target.y=boat.waterline+skimHeight+Math.sin(skimOrbit*1.3)*5;
          target.z=66+Math.sin(skimOrbit)*15;
        }
        desired.copy(target);
        // Clear the cliff faces before descending, and gain height before
        // turning into the rear half of the bay on the return journey.
        if(mode==='approach'&&position.z<45){desired.z=76;desired.y=Math.max(180,position.y);}
        if(mode==='climb'&&position.y<165){desired.z=Math.max(60,position.z);desired.y=215;}
        desired.sub(position);const distance=desired.length();
        // Ease around the boat rather than overshooting and snapping back.
        desired.normalize().multiplyScalar(speed*(mode==='skim'?.65:.9)*Math.min(1,distance/22));
      }
      acceleration.subVectors(desired,velocity).multiplyScalar(1.5);
      for(const cliff of CLIFFS){
        const d=cliffDistance(position,cliff);
        if(d<1.65){offset.set((position.x-cliff.x)/(cliff.rx*cliff.rx),(position.y-cliff.y)/(cliff.ry*cliff.ry),(position.z-cliff.z)/(cliff.rz*cliff.rz));if(offset.lengthSq())acceleration.addScaledVector(offset.normalize(),(1.65-d)*90);}
      }
      for(const other of neighbors){offset.subVectors(position,other);const distance=offset.length();if(distance>.001&&distance<6)acceleration.addScaledVector(offset,(6-distance)*8/distance);}
      const floor=waterSurfaceY(position.z)+10;
      acceleration.x+=Math.max(0,32-position.x)*2-Math.max(0,position.x-328)*2;
      acceleration.y+=Math.max(0,floor+6-position.y)*4-Math.max(0,position.y-249)*3;
      acceleration.z+=Math.max(0,-82-position.z)*2-Math.max(0,position.z-82)*2;
      acceleration.clampLength(0,38);velocity.addScaledVector(acceleration,h).clampLength(0,speed*1.3);position.addScaledVector(velocity,h);
      for(const cliff of CLIFFS){const d=cliffDistance(position,cliff);if(d<1.1){offset.set(position.x-cliff.x,position.y-cliff.y,position.z-cliff.z).multiplyScalar(1.1/Math.max(d,.001));position.set(cliff.x,cliff.y,cliff.z).add(offset);}}
      position.x=MathUtils.clamp(position.x,18,342);position.z=MathUtils.clamp(position.z,-96,96);position.y=MathUtils.clamp(position.y,waterSurfaceY(position.z)+10,264);
      const horizontal=Math.max(20,velocity.x*velocity.x+velocity.z*velocity.z);
      const turn=(velocity.x*acceleration.z-velocity.z*acceleration.x)/horizontal;
      bank=MathUtils.damp(bank,MathUtils.clamp(-turn*.9,-.72,.72),4,h);
      modeRemaining-=h;if(modeRemaining<=0){gliding=!gliding;modeRemaining=gliding?1.4+random()*3:1.6+random()*2.5;}
      glide=MathUtils.damp(glide,gliding&&Math.abs(velocity.y)<12?.92:0,3,h);
    }
    return {position,velocity,acceleration,bank,glide,elapsed,waypoints,mode:leader?'flock':mode};
  }
  return {position,velocity,target,step,get waypointCount(){return waypoints;}};
}
