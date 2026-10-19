import * as THREE from 'three';
import {createMarineModel} from './marine-models.js';
import {MARINE_GROUPS,createMarineMotion,marineScale} from './marine-motion.js';

export function createMarineScene(seed=1){
  const counts={fish:0,dolphins:0,whales:0};
  MARINE_GROUPS.forEach(group=>{counts[['fish','dolphins','whales'][group.kind]]+=group.count;});
  const root=new THREE.Group(),animals=[],motions=MARINE_GROUPS.map((group,index)=>createMarineMotion({seed:seed+index*1097,kind:group.kind,index,lane:group.lane}));
  const rippleGeometry=new THREE.PlaneGeometry(1,1);
  const rippleBase=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{uAge:{value:0},uStrength:{value:1}},
    vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:`varying vec2 vUv;uniform float uAge;uniform float uStrength;
      void main(){vec2 p=(vUv-.5)*2.;float r=length(p);float ring=exp(-pow((r-(.25+uAge*.55))*35.,2.));
      float broken=.5+.5*sin(atan(p.y,p.x)*17.+r*19.);float alpha=ring*(.55+broken*.45)*(1.-uAge)*.45*uStrength;
      gl_FragColor=vec4(.80,.94,.91,alpha);}`});
  const ripples=Array.from({length:52},()=>{
    const material=rippleBase.clone(),mesh=new THREE.Mesh(rippleGeometry,material);mesh.visible=false;root.add(mesh);return {mesh,material,age:9,life:1,size:1};
  });
  let rippleCursor=0;
  function ring(x,y,z,size,strength=1){const r=ripples[rippleCursor++%ripples.length];r.mesh.position.set(x,y,z);r.age=0;r.life=1.2+size*.025;r.size=size;r.material.uniforms.uStrength.value=strength;}
  const particleCount=280,positions=new Float32Array(particleCount*3),opacity=new Float32Array(particleCount),sizes=new Float32Array(particleCount);
  const particleGeometry=new THREE.BufferGeometry();particleGeometry.setAttribute('position',new THREE.BufferAttribute(positions,3));particleGeometry.setAttribute('aOpacity',new THREE.BufferAttribute(opacity,1));particleGeometry.setAttribute('aSize',new THREE.BufferAttribute(sizes,1));
  const particleMaterial=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{uPixelScale:{value:1}},
    vertexShader:`attribute float aOpacity;attribute float aSize;varying float vOpacity;uniform float uPixelScale;
      void main(){vOpacity=aOpacity;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_PointSize=max(1.,aSize*uPixelScale);}`,
    fragmentShader:`varying float vOpacity;void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.)discard;gl_FragColor=vec4(.86,.96,.94,(1.-r*r)*vOpacity);}`});
  const particles=new THREE.Points(particleGeometry,particleMaterial);particles.frustumCulled=false;root.add(particles);
  const droplets=Array.from({length:particleCount},()=>({position:new THREE.Vector3(),velocity:new THREE.Vector3(),age:9,life:1,floor:0,size:1}));let particleCursor=0;
  function splash(position,kind,blow=false){
    const count=blow?36:kind===0?4:kind===1?16:24;
    for(let i=0;i<count;i++){
      const p=droplets[particleCursor++%particleCount],angle=i*2.39996;
      p.position.copy(position);p.velocity.set(Math.cos(angle)*(blow?1.4:kind===0?1.5:3.5),blow?8+(i%5)*1.5:3+(i%7)*.7,Math.sin(angle));
      p.age=0;p.life=blow?1.5:.7+(i%4)*.12;p.floor=position.y-1;p.size=blow?2.8:kind===0?.55:1.1;
    }
  }
  MARINE_GROUPS.forEach((group,index)=>{
    for(let member=0;member<group.count;member++){
      const model=createMarineModel(group.kind,{detail:false});model.setWater(group.lane);root.add(model.root);
      animals.push({model,kind:group.kind,index,member,lastEvent:'',previous:null,wake:0});
    }
  });
  let previous=null;
  function update(time){
    const dt=previous===null?0:Math.min(1,Math.max(0,time-previous));previous=time;
    let surfaced=0;
    for(const animal of animals){
      const state=motions[animal.index].sample(time,animal.member),{model}=animal;
      model.root.position.copy(state.position);model.root.scale.setScalar(marineScale(model.species,state.surfaceY));
      model.root.rotation.set(state.roll,(state.direction<0?Math.PI:0)+state.yaw,state.pitch);
      model.pose(time+animal.member*.29,{air:state.air,strength:animal.kind===0?1-state.air*.9:1});model.water(state.surfaceY,state.visibility);
      if(state.visibility>.3&&state.elevation+(animal.kind===2?model.root.scale.x*1.3:0)>0)surfaced++;
      const splashPoint=new THREE.Vector3(state.position.x,state.surfaceY,state.position.z+3);
      const crossed=animal.previous&&animal.previous.cycle===state.cycle&&((animal.previous.elevation<0)!==(state.elevation<0));
      const waterEvent=crossed||animal.kind===2&&state.eventId&&state.eventId!==animal.lastEvent;
      if(waterEvent&&state.visibility>.2){
        animal.lastEvent=state.eventId;
        const blow=state.event==='blow';
        if(blow){splashPoint.x+=state.direction*model.root.scale.x*1.8;splashPoint.y+=3;}
        splash(splashPoint,animal.kind,blow);ring(splashPoint.x,state.surfaceY,splashPoint.z,animal.kind===0?4:animal.kind===1?12:24,animal.kind===0?.5:.9);
      }
      animal.previous={cycle:state.cycle,elevation:state.elevation};
      animal.wake+=dt;
      if(animal.wake>(animal.kind===0?.38:.5)&&state.visibility>.4&&state.elevation> -3){
        animal.wake=0;ring(state.position.x-state.direction*(animal.kind===2?10:2),state.surfaceY,state.position.z+1,animal.kind===0?3:animal.kind===1?7:15,animal.kind===0?.18:.35);
      }
    }
    for(const ripple of ripples){ripple.age+=dt;const t=ripple.age/ripple.life;ripple.mesh.visible=t<1;if(t<1){ripple.material.uniforms.uAge.value=t;ripple.mesh.scale.set(ripple.size*(.6+t),ripple.size*(.6+t)*.22,1);}}
    droplets.forEach((p,i)=>{
      p.age+=dt;if(p.age<p.life){p.velocity.y-=dt*11;p.position.addScaledVector(p.velocity,dt);if(p.position.y<p.floor)p.age=p.life;}
      positions[i*3]=p.position.x;positions[i*3+1]=p.position.y;positions[i*3+2]=p.position.z;
      opacity[i]=p.age<p.life?Math.pow(1-p.age/p.life,.75)*.6:0;sizes[i]=p.size;
    });
    particleGeometry.attributes.position.needsUpdate=true;particleGeometry.attributes.aOpacity.needsUpdate=true;particleGeometry.attributes.aSize.needsUpdate=true;
    return {...counts,surfaced};
  }
  return {root,update,resize(scale){particleMaterial.uniforms.uPixelScale.value=scale;},dispose(){animals.forEach(a=>a.model.dispose());ripples.forEach(r=>r.material.dispose());rippleGeometry.dispose();rippleBase.dispose();particleGeometry.dispose();particleMaterial.dispose();}};
}
