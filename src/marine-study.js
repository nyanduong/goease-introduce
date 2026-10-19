import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {createMarineModel,MARINE_SPECIES} from './marine-models.js';
const renderer=new THREE.WebGLRenderer({canvas:document.querySelector('canvas'),antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.toneMapping=THREE.ACESFilmicToneMapping;
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.1,100);camera.position.set(10,6,17);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.target.set(-.5,0,0);controls.minDistance=7;controls.maxDistance=35;
scene.add(new THREE.HemisphereLight(0xe6f6ff,0x6a8175,2.3));
const sun=new THREE.DirectionalLight(0xffecd7,3);sun.position.set(3,8,10);scene.add(sun);
const fill=new THREE.DirectionalLight(0xc1e8f0,1.3);fill.position.set(-5,4,-9);scene.add(fill);
let model,time=0,previous=null,paused=matchMedia('(prefers-reduced-motion: reduce)').matches;
const buttons=document.querySelectorAll('[data-species]');
const descriptions=[
  'Thân thon, đuôi chẻ với thùy dưới dài, cặp vây ngực mở để lướt. Đuôi quẫy ngang khi bơi; vây không vỗ như cánh chim.',
  'Thân liền khối, mõm ngắn, vây lưng cong và cặp vây ngực. Cuống đuôi uốn lên–xuống, hai thùy đuôi nằm ngang.',
  'Thân lớn, đầu rộng, vây ngực dài và các nếp dọc dưới họng. Nhịp đuôi chậm, thân uốn nhẹ khi bơi.',
];
function select(index){if(model){scene.remove(model.root);model.dispose();}model=createMarineModel(index);scene.add(model.root);model.root.scale.setScalar(index===0?1.5:index===1?1:.82);document.querySelector('h1').textContent=MARINE_SPECIES[index].name;document.querySelector('[data-description]').textContent=descriptions[index];buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));}
buttons.forEach((b,i)=>b.addEventListener('click',()=>select(i)));
document.querySelector('[data-pause]').addEventListener('click',event=>{paused=!paused;event.currentTarget.textContent=paused?'Tiếp tục chuyển động':'Dừng chuyển động';});
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{const views={side:[0,3,20],front:[20,3,0],above:[1,20,.01],below:[0,-13,14]};camera.position.set(...views[button.dataset.view]);controls.update();}));
function resize(){const bounds=renderer.domElement.getBoundingClientRect();renderer.setSize(bounds.width,bounds.height,false);camera.aspect=bounds.width/bounds.height;camera.updateProjectionMatrix();}new ResizeObserver(resize).observe(renderer.domElement);
select(0);renderer.setAnimationLoop(now=>{if(previous!==null&&!paused)time+=Math.min(.1,(now-previous)/1000);previous=now;model.pose(time,{air:1});controls.update();renderer.render(scene,camera);});
