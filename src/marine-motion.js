import {MathUtils,Vector3} from 'three';
import {seededRandom} from './bird-flight.js';
import {boatState,BOAT_WIDTH} from './bay-space.js';

export const MARINE_GROUPS=[
  {kind:0,count:8,lane:43},{kind:0,count:7,lane:64},{kind:0,count:9,lane:37},{kind:0,count:8,lane:55},
];
export function marineScale(species,surfaceY){
  // For a flat sea, projected size grows with distance below the horizon.
  // The boat sits at y≈75 and the water horizon at y≈90: a y=45 foreground
  // animal is about three times closer in the image than one beside the boat.
  const perspective=MathUtils.clamp((90-surfaceY)/(90-75),.85,3.6);
  const target=Math.min(species.sceneLength*perspective,species.id==='humpback'?BOAT_WIDTH*1.35:species.id==='dolphin'?BOAT_WIDTH*.52:BOAT_WIDTH*.12);
  return target/species.length;
}
export function createMarineMotion({seed=1,kind=0,index=0,lane=60}={}){
  const random=seededRandom(seed);let start=0,cycle=0,duration,from,to,direction,surface,leapAt;
  function choose(){
    duration=kind===2?36+random()*8:kind===1?17+random()*5:13+random()*5;
    direction=random()<.5?-1:1;
    const margin=kind===2?82:kind===1?72:58;
    from=direction>0?margin+random()*18:360-margin-random()*18;
    to=direction>0?360-margin-random()*18:margin+random()*18;
    surface=lane+(random()-.5)*5;
    leapAt=kind===2?2:kind===1?1.2+(index%2)*2.2+random()*.5:.8+(index%4)*1.65+random()*.5;
    cycle++;
  }
  choose();
  return {sample(time,member=0){
    while(time>=start+duration){start+=duration;choose();}
    const age=time-start,progress=age/duration,lag=member*(kind===0?.15:.6);
    const t=MathUtils.clamp((age-lag)/duration,0,1);
    const spacing=kind===0?MathUtils.lerp(3.2,6.8,MathUtils.smoothstep(75-lane,0,35)):14;
    const x=MathUtils.lerp(from,to,t)-direction*member*spacing;
    const boat=boatState(time),avoid=Math.exp(-Math.pow((x-boat.x)/34,2));
    const stagger=kind===0?(member%3-1)*1.6:kind===1?member*2.5:0;
    const water=Math.max(32,surface-(kind===2?0:avoid*5)+Math.sin(t*Math.PI)*2+stagger);
    const speed=(to-from)/duration;
    const visibility=MathUtils.smoothstep(progress,0,.05)*(1-MathUtils.smoothstep(progress,.91,1));
    let elevation,vertical=0,air=0,event='',eventId='',roll=0,pitch=0,breath=0,yaw=0;
    if(kind===0){
      const flightDuration=6+(index%3)*.45,q=(age-leapAt-lag)/flightDuration;
      if(q>=0&&q<=1){elevation=-1.4+Math.sin(q*Math.PI)*8.5;vertical=Math.cos(q*Math.PI)*8.5*Math.PI/flightDuration;air=MathUtils.smoothstep(q,0,.12)*(1-MathUtils.smoothstep(q,.88,1));event=q>.06&&q<.12?'launch':q>.88&&q<.94?'splash':'';}
      else elevation=-1.4+Math.sin(age*5+member)*.12;
      roll=(.22+Math.sin(age*.8+member)*.1)*(member%2?1:-1);yaw=Math.sin(age*.5+member*.2)*.18;
      eventId=event?index+':'+cycle+':'+member+':'+event:'';
    }else if(kind===1){
      const leapLength=3.3,local=age-leapAt-lag;
      const leap=local>=0&&local<=leapLength;
      const second=age-leapAt-lag-6.5,leap2=second>=0&&second<=leapLength;
      const q=(leap?local:second)/leapLength;
      if(leap||leap2){elevation=-.25+Math.sin(q*Math.PI)*11;vertical=Math.cos(q*Math.PI)*11*Math.PI/leapLength;air=MathUtils.smoothstep(elevation,-1,1);event=q<.12?'launch':q>.88?'splash':'';eventId=event?index+':'+cycle+':'+member+':'+(leap?0:1)+':'+event:'';}
      else {elevation=-.25+Math.sin(age*1.8+member)*.28;vertical=Math.cos(age*1.8+member)*.5;}
      roll=Math.sin(age*.6+member)*.1;yaw=Math.sin(age*.45+member)*.12;
    }else{
      if(age<19){elevation=.15+Math.sin(age*.3)*.55;breath=MathUtils.smoothstep(age,2,2.3)*(1-MathUtils.smoothstep(age,3.7,4.3));event=age>=2&&age<2.5?'blow':'';}
      else if(age<27){const q=(age-19)/8;elevation=.15-MathUtils.smoothstep(q,0,1)*11.15;pitch=-Math.sin(q*Math.PI)*.73;vertical=-Math.sin(q*Math.PI)*1.9;event=q>.35&&q<.46?'splash':'';}
      else {elevation=-11;}
      eventId=event?index+':'+cycle+':'+event:'';
      yaw=.12+Math.sin(age*.25)*.08;roll=Math.sin(age*.3)*.06;
    }
    if(kind!==2)pitch=Math.atan2(vertical,Math.abs(speed));
    const position=new Vector3(MathUtils.clamp(x,42,316),water+elevation,55+(73-water)*.9);
    return {position,velocity:new Vector3(speed,vertical,0),surfaceY:water,elevation,air,pitch,roll,yaw,direction,visibility,breath,event,eventId,cycle};
  }};
}
