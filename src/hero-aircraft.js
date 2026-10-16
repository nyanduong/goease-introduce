import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createLivingBay } from './hero-bay.js';
import { shouldAutoplay } from '../dist/motion-state.js';
import { createFlightRoute, TAKEOFF_DURATION, RUNWAY_DURATION, runwayProgress } from './flight-route.js';

const host = document.querySelector('.hero-flight');
const canvas = document.querySelector('.hero-aircraft-canvas');
if (host && canvas) initialize().catch(() => host.classList.remove('has-webgl'));

async function initialize() {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = .85;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.autoClear=false;
  const bay = await createLivingBay(renderer).catch(() => null);
  const scene = new THREE.Scene();
  // One coordinate system for aircraft, trails and terrain depth. The expanded
  // viewport also reaches the end of the slogan without moving the bay itself.
  const camera = new THREE.OrthographicCamera(0,360,270,0,.1,1000);
  camera.position.z=400;
  if(bay)scene.add(bay.createTerrainOccluder());
  let viewport={width:360,height:280,left:0,top:0};
  let departure=new THREE.Vector3(-55,105,65);
  let flightPosition=createFlightRoute(departure);
  const environment = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environmentMap = pmrem.fromScene(environment, .04);
  scene.environment = environmentMap.texture;
  environment.dispose();
  pmrem.dispose();
  scene.environmentIntensity = .65;
  scene.add(new THREE.HemisphereLight(0xeaf8ff, 0xb4ae91, .8));
  const sun = new THREE.DirectionalLight(0xffecd3, 2.5);
  sun.position.set(280,420,300);
  sun.target.position.set(180,180,0);scene.add(sun.target);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -220, right: 220, top: 220, bottom: -220, near:1, far:1000 });
  sun.shadow.camera.updateProjectionMatrix();
  sun.shadow.bias = -.0003;
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0xc9e6ff, 1.2);
  rim.position.set(-6, 3, -7);
  scene.add(rim);

  const white = new THREE.MeshPhysicalMaterial({ color: 0xf8faf7, metalness: .18, roughness: .27, clearcoat: .7 });
  const jade = new THREE.MeshPhysicalMaterial({ color: 0x086552, metalness: .25, roughness: .3, clearcoat: .8 });
  const silver = new THREE.MeshStandardMaterial({ color: 0xabb7bd, metalness: .85, roughness: .3 });
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x102d3c, metalness: .4, roughness: .12, clearcoat: 1 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x17232b, metalness: .65, roughness: .5 });
  const plane = new THREE.Group();
  const fans = [];
  scene.add(plane);
  function mesh(geometry, material, position = [0, 0, 0], parent = plane) {
    const item = new THREE.Mesh(geometry, material);
    item.position.set(...position);
    item.castShadow = true;
    item.receiveShadow = true;
    parent.add(item);
    return item;
  }

  // Smooth elliptical body, with an ogive nose and a tapered tail cone.
  const profile = [[-6.3, .035], [-5.8, .16], [-4.8, .43], [-3.8, .61], [-2.8, .68], [2.8, .68], [3.8, .64], [4.6, .52], [5.3, .31], [5.65, .11], [5.7, .015]];
  const smooth = new THREE.SplineCurve(profile.map(([x, radius]) => new THREE.Vector2(radius, x)));
  const bodyGeometry = new THREE.LatheGeometry(smooth.getPoints(110), 56);
  bodyGeometry.rotateZ(-Math.PI / 2);
  mesh(bodyGeometry, white);
  // A shaped belly follows the body, rather than a flat painted rectangle.
  const bellyGeometry = new THREE.LatheGeometry(smooth.getPoints(110), 40, Math.PI * .05, Math.PI * .9);
  bellyGeometry.rotateZ(-Math.PI / 2);
  bellyGeometry.scale(1.002, 1.002, 1.002);
  mesh(bellyGeometry, jade);

  // Closed, bevelled airfoils: the wings have real volume and swept leading edges.
  function foil(points, thickness, material, position = [0, 0, 0], vertical = false) {
    const shape = new THREE.Shape();
    points.forEach(([x, z], i) => i ? shape.lineTo(x, z) : shape.moveTo(x, z));
    shape.closePath();
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: .045, bevelThickness: .035 });
    if (!vertical) geometry.rotateX(Math.PI / 2);
    return mesh(geometry, material, position);
  }
  // Airfoil sections produce a rounded leading edge, camber and a thin trailing edge.
  function wing(side) {
    const vertices = [], indices = [];
    const spans = 12, sections = 40;
    for (let j = 0; j <= spans; j++) {
      const span = j / spans;
      const lead = 1.5 - 3.3 * span;
      const chord = 3.05 - 2.15 * span;
      for (let k = 0; k <= sections; k++) {
        const angle = k / sections * Math.PI * 2;
        const u = (1 - Math.cos(angle)) / 2;
        const thickness = 5 * .09 * chord * (.2969 * Math.sqrt(u) - .126 * u - .3516 * u*u + .2843 * u*u*u - .1036 * u*u*u*u);
        vertices.push(lead - u * chord, -.08 + span * .28 + Math.sin(Math.PI*u) * .045 + Math.sign(Math.sin(angle)) * thickness, side * (.48 + 5.75 * span));
        if (j < spans && k < sections) {
          const a = j * (sections+1) + k, b = a + sections+1;
          indices.push(a,b,a+1,b,b+1,a+1);
        }
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices,3));
    geometry.setIndex(indices); geometry.computeVertexNormals();
    const material = white.clone(); material.side = THREE.DoubleSide;
    mesh(geometry, material);
  }
  const labelCanvas = document.createElement('canvas');
  labelCanvas.width = 512; labelCanvas.height = 128;
  const labelContext = labelCanvas.getContext('2d');
  labelContext.fillStyle = '#125b50'; labelContext.font = 'bold 80px "Noto Sans", sans-serif';
  labelContext.textAlign = 'center'; labelContext.fillText('GoEase',256,92);
  const labelTexture = new THREE.CanvasTexture(labelCanvas); labelTexture.colorSpace = THREE.SRGBColorSpace;
  const labelMaterial = new THREE.MeshStandardMaterial({map:labelTexture, transparent:true, roughness:.4, depthWrite:false});
  for (const side of [-1, 1]) {
    wing(side);
    const wordmark = mesh(new THREE.PlaneGeometry(1.8,.45),labelMaterial,[1.5,-.12,side*.675]);
    if(side < 0) wordmark.rotation.y = Math.PI;
    // Upturned winglet, rooted at each swept wing tip.
    const winglet = foil([[0, 0], [-.05, .85], [-.4, 1.06], [-.62, .02]], .07, jade, [-2.05, .25, side * 6.12], true);
    winglet.rotation.x = side * .18;
    foil([[-4.35, side * .28], [-5.55, side * 2.5], [-6.2, side * 2.55], [-5.6, side * .2]], .09, white, [0, .16, 0]);
    // Flap-track fairings under the trailing edge.
    for (const z of [2, 3.4, 4.7]) {
      const fairing = mesh(new THREE.SphereGeometry(1, 12, 8), white, [-1.55, -.18, side * z]);
      fairing.scale.set(.5, .1, .1);
    }
    // Nacelle is open at the intake, with a metal rim and actual spinning fan blades.
    const nacelle = new THREE.Group();
    nacelle.position.set(.2, -.85, side * 2.15);
    plane.add(nacelle);
    mesh(new THREE.BoxGeometry(.75, .6, .12), white, [-.25, .46, 0], nacelle);
    const shell = mesh(new THREE.CylinderGeometry(.5, .43, 1.65, 40, 1, true), white, [0, 0, 0], nacelle);
    shell.rotation.z = -Math.PI / 2;
    const intake = mesh(new THREE.TorusGeometry(.47, .045, 10, 40), silver, [.825, 0, 0], nacelle);
    intake.rotation.y = Math.PI / 2;
    const interior = mesh(new THREE.CylinderGeometry(.44, .3, .65, 32, 1, true), dark, [.45, 0, 0], nacelle);
    interior.rotation.z = -Math.PI / 2;
    const fan = new THREE.Group();
    fan.position.x = .59;
    nacelle.add(fan);
    fans.push(fan);
    const hub = mesh(new THREE.ConeGeometry(.14, .28, 24), silver, [.04, 0, 0], fan);
    hub.rotation.z = -Math.PI / 2;
    for (let blade = 0; blade < 14; blade++) {
      const angle = blade / 14 * Math.PI * 2;
      const leaf = mesh(new THREE.BoxGeometry(.035, .3, .055), silver, [0, Math.cos(angle) * .25, Math.sin(angle) * .25], fan);
      leaf.rotation.x = angle;
      leaf.rotation.y = .4;
    }
    const nozzle = mesh(new THREE.CylinderGeometry(.31, .2, .4, 24, 1, true), dark, [-.9, 0, 0], nacelle);
    nozzle.rotation.z = -Math.PI / 2;
    // Rows of passenger glazing follow both sides of the fuselage.
    for (let x = -3.8; x < 3.65; x += .3) {
      const radius = x < -2.8 ? .61 + (x+3.8)*.07 : (x > 2.8 ? .68-(x-2.8)*.04 : .68);
      const window = mesh(new THREE.SphereGeometry(1, 10, 8), glass, [x, .22, side * (Math.sqrt(radius*radius-.22*.22)+.012)]);
      window.scale.set(.075, .105, .018);
    }
    const cockpit = mesh(new THREE.SphereGeometry(1, 20, 12), glass, [4.67, .33, side * .3]);
    cockpit.scale.set(.47, .17, .19);
    cockpit.rotation.z = -.22;
    // Door outlines are recessed metal frames with inset white panels.
    for (const x of [-3.9, 3.65]) {
      const door = mesh(new THREE.BoxGeometry(.3, .68, .018), silver, [x, -.04, side * .66]);
      mesh(new THREE.BoxGeometry(.26, .64, .021), white, [x, -.04, side * .672]);
    }
  }
  foil([[-4.8, .38], [-5.05, 2.65], [-5.8, 3], [-6.2, .32]], .09, jade, [0, 0, -.045], true);
  const beaconMaterial = new THREE.MeshBasicMaterial({ color: 0xff6b43 });
  const beacon = mesh(new THREE.SphereGeometry(.065, 12, 8), beaconMaterial, [-.7, .72, 0]);
  const red = new THREE.MeshBasicMaterial({ color: 0xe85950 });
  const green = new THREE.MeshBasicMaterial({ color: 0x75edaf });
  mesh(new THREE.SphereGeometry(.055, 10, 8), red, [-2.05, .08, -6.25]);
  mesh(new THREE.SphereGeometry(.055, 10, 8), green, [-2.05, .08, 6.25]);

  const xAxis = new THREE.Vector3(1,0,0), worldUp = new THREE.Vector3(0,1,0);
  const sideAxis = new THREE.Vector3(), upAxis = new THREE.Vector3();
  const tangent = new THREE.Vector3(), ahead = new THREE.Vector3(), behind = new THREE.Vector3();
  const orientation = new THREE.Matrix4(), targetRotation = new THREE.Quaternion(), roll = new THREE.Quaternion();
  const nextTangent=new THREE.Vector3(), future=new THREE.Vector3();
  // Local-only still frames make the depth crossings reproducible for visual QA.
  const frameParameter=['127.0.0.1','localhost'].includes(location.hostname)?new URLSearchParams(location.search).get('flight-frame'):null;
  const previewSecond=frameParameter!==null && Number.isFinite(Number(frameParameter))?Math.max(0,Number(frameParameter)):null;
  let elapsed = previewSecond ?? 0, previous = null, running = false, initialized = false;
  let bank = 0, emission = 0, particleCursor = 0;
  const particleCount = 420;
  const positions = new Float32Array(particleCount*3), ages = new Float32Array(particleCount), sizes = new Float32Array(particleCount);
  const particles = Array.from({length:particleCount}, () => ({age:10, position:new THREE.Vector3(), velocity:new THREE.Vector3(), seed:0}));
  const wakeGeometry = new THREE.BufferGeometry();
  wakeGeometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
  wakeGeometry.setAttribute('aAge',new THREE.BufferAttribute(ages,1));
  wakeGeometry.setAttribute('aSize',new THREE.BufferAttribute(sizes,1));
  const wakeMaterial = new THREE.ShaderMaterial({
    transparent:true, depthWrite:false,
    uniforms:{uPixelRatio:{value:renderer.getPixelRatio()},uWorldScale:{value:1}},
    vertexShader:`attribute float aAge; attribute float aSize; varying float vAge; uniform float uPixelRatio;uniform float uWorldScale;
      void main(){vAge=aAge;vec4 p=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*p;gl_PointSize=clamp(aSize*uWorldScale*uPixelRatio,0.,42.);}`,
    fragmentShader:`varying float vAge;
      void main(){vec2 uv=gl_PointCoord*2.-1.;float r=length(uv);if(r>1.||vAge>=1.)discard;
        float softness=exp(-r*r*4.)*(1.-smoothstep(.65,1.,r));
        float fade=smoothstep(0.,.08,vAge)*pow(1.-vAge,1.6);
        vec3 color=mix(vec3(.66,.76,.77),vec3(.96,.98,.97),(1.-smoothstep(.15,.8,r)));
        gl_FragColor=vec4(color,softness*fade*.48);}`
  });
  const wake = new THREE.Points(wakeGeometry,wakeMaterial);wake.frustumCulled=false;scene.add(wake);
  const wakeSamples = 140;
  const ribbons = [-1,1].map(side => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position',new THREE.BufferAttribute(new Float32Array(wakeSamples*6),3));
    geometry.setAttribute('uv',new THREE.BufferAttribute(new Float32Array(wakeSamples*4),2));
    const indices=[];
    for(let i=0;i<wakeSamples-1;i++){const a=i*2;indices.push(a,a+1,a+2,a+1,a+3,a+2);}
    geometry.setIndex(indices);
    const material=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,
      vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
      fragmentShader:`varying vec2 vUv;void main(){float across=abs(vUv.x*2.-1.);float edge=exp(-across*across*5.);float fade=smoothstep(0.,.04,vUv.y)*pow(max(0.,1.-vUv.y),1.4);gl_FragColor=vec4(.78,.86,.85,edge*fade*.33);}`
    });
    const item=new THREE.Mesh(geometry,material);item.frustumCulled=false;scene.add(item);
    return {side,item,history:[]};
  });
  const toCamera=new THREE.Vector3(), ribbonSide=new THREE.Vector3(), ribbonTangent=new THREE.Vector3();
  const emitter = new THREE.Vector3();
  function emitWake(side, age=0) {
    const particle = particles[particleCursor]; particleCursor=(particleCursor+1)%particleCount;
    emitter.set(-.78,-.85,side*2.15).multiplyScalar(plane.scale.x).applyQuaternion(plane.quaternion).add(plane.position);
    particle.position.copy(emitter);particle.age=age;
    particle.seed=particleCursor*2.39996;
    particle.velocity.copy(tangent).multiplyScalar(-.14);
    particle.velocity.y+=.035;
    const ribbon=ribbons[side<0?0:1];
    ribbon.history.unshift({position:emitter.clone(),born:elapsed});
    if(ribbon.history.length>wakeSamples)ribbon.history.pop();
  }
  const state = {paused:document.querySelector('.motion-control')?.getAttribute('aria-pressed')==='true',reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,hidden:document.hidden,inViewport:true,modalOpen:!!document.querySelector('dialog[open]')};
  function render(time) {
    // Resize/pause renders must never reset the animation clock.
    let dt=0,clockDelta=0;
    if(typeof time==='number') {
      if(previous!==null && running) clockDelta=Math.max(0,(time-previous)/1000);
      dt=Math.min(clockDelta,.08);
      previous=time;
    }
    // Keep route speed tied to active wall time even on slower GPUs. A capped
    // particle integration step must not turn a 20-second flight into a minute.
    elapsed+=clockDelta;
    if(clockDelta>.5) {
      initialized=false;emission=0;
      particles.forEach(particle=>particle.age=10);
      ribbons.forEach(ribbon=>ribbon.history.length=0);
    }
    if(host.dataset.flightSecond !== String(Math.floor(elapsed))) host.dataset.flightSecond=String(Math.floor(elapsed));
    flightPosition(elapsed,plane.position);
    document.querySelector("#hero-title em").style.setProperty("--runway-progress", String(Math.min(1,runwayProgress(elapsed)+.045)));
    const takeoffGrowth=THREE.MathUtils.smoothstep(elapsed,RUNWAY_DURATION,TAKEOFF_DURATION);
    plane.scale.setScalar(THREE.MathUtils.lerp(3.1,5.8,takeoffGrowth)*430/(430-plane.position.z));
    host.dataset.flightPhase=elapsed<RUNWAY_DURATION?'runway':elapsed<TAKEOFF_DURATION?'takeoff':plane.position.z<0?'behind-mountains':'in-front';
    flightPosition(elapsed+.12,ahead);flightPosition(elapsed-.12,behind);
    tangent.subVectors(ahead,behind).normalize();
    sideAxis.crossVectors(tangent,worldUp).normalize();upAxis.crossVectors(sideAxis,tangent).normalize();
    orientation.makeBasis(tangent,upAxis,sideAxis);targetRotation.setFromRotationMatrix(orientation);
    flightPosition(elapsed+.4,future);nextTangent.subVectors(future,plane.position).normalize();
    const turnRate=Math.atan2(tangent.z*nextTangent.x-tangent.x*nextTangent.z,tangent.x*nextTangent.x+tangent.z*nextTangent.z)/.4;
    const desiredBank=THREE.MathUtils.clamp(turnRate*.8,-.5,.5);
    bank=initialized?THREE.MathUtils.damp(bank,desiredBank,2.5,dt):desiredBank;
    roll.setFromAxisAngle(xAxis,bank);targetRotation.multiply(roll);
    if(!initialized)plane.quaternion.copy(targetRotation);
    else if(dt>0)plane.quaternion.slerp(targetRotation,1-Math.exp(-5.5*dt));
    initialized=true;
    if(dt>0) {
      emission+=dt;
      while(emission>=1/38){emission-=1/38;emitWake(-1);emitWake(1);}
    }
    for(let i=0;i<particleCount;i++) {
      const p=particles[i];p.age+=dt;
      if(p.age<4.8 && dt>0) {
        p.position.addScaledVector(p.velocity,dt);
        p.position.y+=Math.sin(p.seed+p.age*2)*dt*.024;
        p.position.z+=Math.cos(p.seed+p.age*1.8)*dt*.035;
      }
      positions[i*3]=p.position.x;positions[i*3+1]=p.position.y;positions[i*3+2]=p.position.z;
      ages[i]=p.age/4.8;sizes[i]=1.2+p.age*1.4;
    }
    wakeGeometry.attributes.position.needsUpdate=true;
    wakeGeometry.attributes.aAge.needsUpdate=true;wakeGeometry.attributes.aSize.needsUpdate=true;
    for(const {item,history} of ribbons) {
      for(let i=0;i<wakeSamples;i++) {
        const sample=history[Math.min(i,history.length-1)];
        if(!sample)continue;
        const age=Math.min(1,(elapsed-sample.born)/2.7);
        const next=history[Math.min(i+1,history.length-1)];
        ribbonTangent.subVectors(sample.position,next.position);
        if(ribbonTangent.lengthSq()<.000001)ribbonTangent.copy(tangent);
        toCamera.subVectors(camera.position,sample.position);
        ribbonSide.crossVectors(ribbonTangent,toCamera).normalize();
        const width=.16+age*.8;
        const drift=Math.sin(age*8+i*.1)*age*.035;
        for(let edge=0;edge<2;edge++){
          const offset=(edge?1:-1)*width;
          item.geometry.attributes.position.setXYZ(i*2+edge,sample.position.x+ribbonSide.x*offset,sample.position.y+ribbonSide.y*offset+age*.12+drift,sample.position.z+ribbonSide.z*offset);
          item.geometry.attributes.uv.setXY(i*2+edge,edge,age);
        }
      }
      item.geometry.attributes.position.needsUpdate=true;item.geometry.attributes.uv.needsUpdate=true;
      item.visible=history.length>2;
    }
    for(const fan of fans)fan.rotation.x=elapsed*32;
    beacon.visible=Math.sin(elapsed*5.5)>.92;
    renderer.clear();
    renderer.setViewport(viewport.left,0,viewport.width,viewport.height);
    if(bay){bay.update(elapsed);bay.render();renderer.clearDepth();}
    renderer.setViewport(0,0,viewport.width+viewport.left,viewport.height+viewport.top);
    renderer.render(scene,camera);
  }
  function update() {
    const next = shouldAutoplay(state) && previewSecond===null;
    host.dataset.flightRunning=String(next);
    if (next !== running) {
      running = next;
      previous = null;
      renderer.setAnimationLoop(next ? render : null);
    }
    if (!next) render();
  }
  function resize() {
    const bounds=host.getBoundingClientRect();
    const word=document.querySelector('#hero-title em').getBoundingClientRect();
    const {width,height}=bounds;
    const launchX=word.left+word.width*.05;
    const launchY=word.bottom-7;
    departure.set((launchX-bounds.left)/width*360,270-(launchY-bounds.top)/height*270,65);
    const runwayEnd=departure.clone();
    runwayEnd.x+=(word.width*.9)/width*360;
    flightPosition=createFlightRoute(departure,runwayEnd);
    const left=Math.max(0,-departure.x+45)/360*width;
    const top=Math.max(0,departure.y-270+35)/270*height;
    viewport={width,height,left,top};
    canvas.style.left=`${-left}px`;canvas.style.top=`${-top}px`;
    canvas.style.width=`${width+left}px`;canvas.style.height=`${height+top}px`;
    renderer.setSize(width+left,height+top,false);
    camera.left=-left/width*360;camera.right=360;camera.top=270+top/height*270;
    camera.updateProjectionMatrix();
    wakeMaterial.uniforms.uWorldScale.value=height/270;
    render();
  }
  new ResizeObserver(resize).observe(host);
  document.fonts.ready.then(resize);
  new IntersectionObserver(([entry]) => { state.inViewport = entry.isIntersecting; update(); }, { threshold: .05 }).observe(host);
  window.addEventListener('goease:motionchange', ({ detail }) => { Object.assign(state, detail); update(); });
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    renderer.setAnimationLoop(null);
    host.classList.remove('has-webgl','has-living-bay');
  });
  canvas.addEventListener('webglcontextrestored', () => location.reload());
  resize();
  host.classList.add('has-webgl');
  host.classList.toggle('has-living-bay',!!bay);
  update();
  // Release GPU allocations if this page is discarded, without interfering with bfcache.
  window.addEventListener('pagehide', event => {
    renderer.setAnimationLoop(null);
    if (event.persisted) return;
    scene.traverse(item => { item.geometry?.dispose(); if(item.material && item.material !== white) item.material.dispose(); });
    wakeMaterial.dispose(); labelMaterial.dispose(); labelTexture.dispose();
    for(const {item} of ribbons)item.material.dispose();
    for (const material of [white, jade, silver, glass, dark, beaconMaterial, red, green]) material.dispose();
    bay?.dispose();
    environmentMap.dispose();
    renderer.dispose();
  });
  window.addEventListener('pageshow', () => { previous = null; running = false; update(); });
}
