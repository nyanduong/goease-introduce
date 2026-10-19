import * as THREE from 'three';
import {createLivingBay} from './hero-bay.js';
import {createBirdModel} from './bird-models.js';
import {createBirdFlight} from './bird-flight.js';
import {shouldAutoplay} from '../dist/motion-state.js';
import {birdScale,FLOCK_SIZES} from './bay-space.js';
import {createMarineScene} from './marine-scene.js';
import {scenePixelRatio} from './scene-resolution.js';

const host=document.querySelector('.hero-flight');
if(host)start().catch(error=>{console.warn('Bird scene unavailable:',error);host.classList.remove('has-webgl','has-living-bay');});
async function start(){
  const canvas=host.querySelector('canvas');
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});
  renderer.autoClear=false;
  renderer.localClippingEnabled=true;
  renderer.setClearColor(0,0);renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
  const bay=await createLivingBay(renderer),scene=new THREE.Scene();
  const camera=new THREE.OrthographicCamera(0,360,270,0,.1,1000);camera.position.z=400;
  const terrain=bay.createTerrainOccluder();scene.add(terrain);
  scene.add(new THREE.HemisphereLight(0xe4f4ff,0x6b7054,2.3));
  const sun=new THREE.DirectionalLight(0xffefd8,3.1);sun.position.set(-80,300,200);scene.add(sun);
  const fill=new THREE.DirectionalLight(0xb4dce0,.8);fill.position.set(300,200,-150);scene.add(fill);
  const seeds=crypto.getRandomValues(new Uint32Array(4));
  const marine=createMarineScene(seeds[0]);scene.add(marine.root);
  const birds=[];
  [27,22,20,25].forEach((speed,index)=>{
    const leader=createBirdFlight({seed:seeds[index],index,speed});
    for(let member=0;member<FLOCK_SIZES[index];member++){
      const model=createBirdModel(index,{batch:true});
      const flight=member?createBirdFlight({seed:seeds[index]+member*997,index,speed,leader,member}):leader;
      scene.add(model.root);birds.push({model,flight,member,index,initialized:false});
    }
  });
  const worldUp=new THREE.Vector3(0,1,0),forward=new THREE.Vector3(),right=new THREE.Vector3(),up=new THREE.Vector3(),basis=new THREE.Matrix4(),rotation=new THREE.Quaternion(),roll=new THREE.Quaternion(),localX=new THREE.Vector3(1,0,0);
  const state={paused:document.querySelector('.motion-control')?.getAttribute('aria-pressed')==='true',reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,hidden:document.hidden,inViewport:true};
  let running=false,previous=null,elapsed=0;
  function render(time){
    const dt=running&&previous!==null&&typeof time==='number'?Math.min(1,Math.max(0,(time-previous)/1000)):0;
    if(typeof time==='number')previous=time;
    elapsed+=dt;
    const substeps=Math.max(1,Math.ceil(dt/.1));let movements;
    for(let step=0;step<substeps;step++){
      const neighbors=birds.map(b=>b.flight.position.clone());
      movements=birds.map((bird,index)=>bird.flight.step(dt/substeps,neighbors.filter((_,i)=>i!==index)));
    }
    for(const [index,bird] of birds.entries()){
      const movement=movements[index];
      const {model}=bird;
      model.root.position.copy(movement.position);
      model.root.scale.setScalar(birdScale({...model.species,index:bird.index},movement.position.z));
      forward.copy(movement.velocity).normalize();right.crossVectors(forward,worldUp).normalize();up.crossVectors(right,forward).normalize();
      basis.makeBasis(forward,up,right);rotation.setFromRotationMatrix(basis);
      roll.setFromAxisAngle(localX,movement.bank);rotation.multiply(roll);
      if(!bird.initialized)model.root.quaternion.copy(rotation);
      else model.root.quaternion.slerp(rotation,1-Math.exp(-7*dt));
      bird.initialized=true;
      model.pose(elapsed+bird.member*.173,{bank:movement.bank,climb:forward.y,glide:state.reduced?1:movement.glide});
    }
    host.dataset.birdCount=String(birds.length);host.dataset.flockSizes=FLOCK_SIZES.join(',');host.dataset.flightSecond=String(Math.floor(elapsed));
    host.dataset.birdBehindCount=String(birds.filter(b=>b.flight.position.z<0).length);
    host.dataset.birdLowCount=String(birds.filter(b=>b.flight.position.y<120).length);
    const sea=marine.update(elapsed);host.dataset.marineFish=String(sea.fish);host.dataset.marineDolphins=String(sea.dolphins);host.dataset.marineWhales=String(sea.whales);host.dataset.marineSurfaced=String(sea.surfaced);
    renderer.clear();bay.update(elapsed);bay.render();renderer.clearDepth();renderer.render(scene,camera);
  }
  function update(){
    const next=shouldAutoplay(state);host.dataset.flightRunning=String(next);
    if(next!==running){running=next;previous=null;renderer.setAnimationLoop(next?render:null);}
    if(!next)render();
  }
  function resize(){
    const {width,height}=host.getBoundingClientRect();
    if(width&&height){
      const ratio=scenePixelRatio(width,height,window.devicePixelRatio*(window.visualViewport?.scale||1),renderer.capabilities.maxTextureSize);
      if(renderer.getPixelRatio()!==ratio)renderer.setPixelRatio(ratio);
      renderer.setSize(width,height,false);marine.resize(height/270*ratio);render();
    }
  }
  let resolutionQuery;
  function followResolution(){
    resolutionQuery?.removeEventListener('change',followResolution);
    resolutionQuery=matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    resolutionQuery.addEventListener('change',followResolution);resize();
  }
  followResolution();
  window.addEventListener('resize',resize);
  window.visualViewport?.addEventListener('resize',resize);
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);
  const intersection=new IntersectionObserver(([entry])=>{state.inViewport=entry.isIntersecting;update();},{threshold:.05});intersection.observe(host);
  window.addEventListener('goease:motionchange',({detail})=>{Object.assign(state,detail);update();});
  document.addEventListener('visibilitychange',()=>{state.hidden=document.hidden;update();});
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();renderer.setAnimationLoop(null);host.classList.remove('has-webgl','has-living-bay');});
  canvas.addEventListener('webglcontextrestored',()=>location.reload());
  host.classList.add('has-webgl','has-living-bay');resize();update();
  window.addEventListener('pagehide',event=>{
    renderer.setAnimationLoop(null);if(event.persisted)return;
    resizeObserver.disconnect();intersection.disconnect();resolutionQuery?.removeEventListener('change',followResolution);window.removeEventListener('resize',resize);window.visualViewport?.removeEventListener('resize',resize);birds.forEach(b=>b.model.dispose());terrain.geometry.dispose();terrain.material.dispose();marine.dispose();bay.dispose();renderer.dispose();
  });
  window.addEventListener('pageshow',()=>{previous=null;running=false;update();});
}
