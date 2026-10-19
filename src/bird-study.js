import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {createBirdModel,BIRD_SPECIES} from './bird-models.js';
const renderer=new THREE.WebGLRenderer({canvas:document.querySelector('canvas'),antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.toneMapping=THREE.ACESFilmicToneMapping;
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.1,100);
camera.position.set(9,5,12);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.target.set(-1,0,0);controls.minDistance=8;controls.maxDistance=30;
scene.add(new THREE.HemisphereLight(0xe8f4ff,0x6c7256,2.5));const sun=new THREE.DirectionalLight(0xffe9cd,3);sun.position.set(4,8,6);scene.add(sun);
const fill=new THREE.DirectionalLight(0xc8e7ee,1);fill.position.set(-6,4,-8);scene.add(fill);
let model,time=0,previous=null,paused=matchMedia('(prefers-reduced-motion: reduce)').matches;
const buttons=document.querySelectorAll('[data-species]');
function select(index){if(model){scene.remove(model.root);model.dispose();}model=createBirdModel(index);scene.add(model.root);document.querySelector('h1').textContent=BIRD_SPECIES[index].name;buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));}
buttons.forEach((b,i)=>b.addEventListener('click',()=>select(i)));
document.querySelector('[data-pause]').addEventListener('click',event=>{paused=!paused;event.currentTarget.textContent=paused?'Tiếp tục vỗ cánh':'Dừng vỗ cánh';});
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{const views={side:[0,3,16],front:[16,3,0],back:[-16,4,0],above:[1,17,.01]};camera.position.set(...views[button.dataset.view]);controls.update();}));
function resize(){const bounds=renderer.domElement.getBoundingClientRect();renderer.setSize(bounds.width,bounds.height,false);camera.aspect=bounds.width/bounds.height;camera.updateProjectionMatrix();}new ResizeObserver(resize).observe(renderer.domElement);
select(0);renderer.setAnimationLoop(now=>{if(previous!==null&&!paused)time+=Math.min(.05,(now-previous)/1000);previous=now;model.pose(time);controls.update();renderer.render(scene,camera);});
