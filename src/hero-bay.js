import * as THREE from 'three';

// Photographic layers share the aircraft's renderer, clock and pause policy.
export async function createLivingBay(renderer) {
  const loader = new THREE.TextureLoader();
  const textures = await Promise.all(['hero-bay-natural.webp','hero-junk-boat.webp','hero-cumulus.webp'].map(name => loader.loadAsync(`assets/${name}`)));
  textures.forEach(texture => { texture.colorSpace=THREE.SRGBColorSpace; texture.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy()); });
  const [landscape,boatTexture,cloudTexture]=textures;
  const scene=new THREE.Scene();
  const camera=new THREE.OrthographicCamera(0,360,270,0,.1,100);
  camera.position.z=20;
  const materials=[];
  function layer(texture,width,height,x,y,z,opacity=1) {
    const material=new THREE.MeshBasicMaterial({map:texture,transparent:true,opacity,depthWrite:false,toneMapped:false,side:THREE.DoubleSide});
    if(texture===cloudTexture) {
      material.onBeforeCompile=shader=>{
        shader.vertexShader='varying float vBayX;\n'+shader.vertexShader;
        shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvBayX=(modelMatrix*vec4(position,1.)).x;');
        shader.fragmentShader='varying float vBayX;\n'+shader.fragmentShader;
        shader.fragmentShader=shader.fragmentShader.replace('#include <alphatest_fragment>','diffuseColor.a*=smoothstep(0.,25.,vBayX)*(1.-smoothstep(335.,360.,vBayX));\n#include <alphatest_fragment>');
      };
    }
    materials.push(material);
    const item=new THREE.Mesh(new THREE.PlaneGeometry(width,height),material);
    item.position.set(x,y,z);scene.add(item);return item;
  }
  const backCloud=layer(cloudTexture,150,63,70,190,-3,.56);
  const distantCloud=layer(cloudTexture,105,44,260,221,-2,.46);
  const bayMaterial=new THREE.ShaderMaterial({
    transparent:true,depthWrite:false,
    uniforms:{map:{value:landscape},uTime:{value:0}},
    vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader:`uniform sampler2D map;uniform float uTime;varying vec2 vUv;
      void main(){vec2 uv=vUv;
        float water=1.-smoothstep(.23,.315,uv.y);
        float foreground=1.-smoothstep(.05,.32,uv.y);
        // Crossing wave trains distort reflections at different speeds and scales.
        float swell=sin(uv.y*105.+uv.x*13.-uTime*1.35);
        float wave=sin(uv.y*245.+sin(uv.x*29.-uTime*.55)*1.5-uTime*2.6);
        float crossWave=sin(uv.x*87.+uv.y*151.+uTime*1.8);
        float amplitude=.6+foreground*.7;
        uv.x+=(wave*.0038+swell*.0018)*water*amplitude;
        uv.y+=(crossWave*.0015+swell*.0012)*water*amplitude;
        vec4 color=texture2D(map,uv);
        float crest=pow(max(0.,wave),14.);
        float broken=.25+.75*smoothstep(.15,.85,sin(vUv.x*187.+vUv.y*53.+uTime*.7)*.5+.5);
        float sparkle=crest*broken;
        vec3 sunGlint=vec3(.80,.94,.87)*sparkle*.055;
        color.rgb+=(sunGlint+vec3(swell*.012+crossWave*.006))*water;
        // Keep the vignette's alpha edge stationary while the water within it moves.
        color.a=min(color.a,texture2D(map,vUv).a);
        gl_FragColor=color;
        #include <colorspace_fragment>
      }`
  });materials.push(bayMaterial);
  const bay=new THREE.Mesh(new THREE.PlaneGeometry(360,240),bayMaterial);bay.position.set(180,135,0);scene.add(bay);
  const boatWidth=44,boatHeight=boatWidth*boatTexture.image.height/boatTexture.image.width;
  const boat=layer(boatTexture,boatWidth,boatHeight,130,76+boatHeight/2,3);
  const reflection=layer(boatTexture,boatWidth,boatHeight,130,76-boatHeight*.32,1,.14);
  reflection.scale.y=-.64;
  reflection.material.color.set(0x79a6a2);
  const reflectionTime={value:0};
  reflection.material.onBeforeCompile=shader=>{
    shader.uniforms.uWaterTime=reflectionTime;
    shader.fragmentShader='uniform float uWaterTime;\n'+shader.fragmentShader;
    shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#ifdef USE_MAP
      vec2 reflectedUv=vMapUv;
      reflectedUv.x+=sin(reflectedUv.y*72.-uWaterTime*2.8)*.018;
      vec4 sampledDiffuseColor=texture2D(map,reflectedUv);
      diffuseColor*=sampledDiffuseColor;
      diffuseColor.a*=.65+.35*sin(reflectedUv.y*95.+uWaterTime*2.2);
    #endif`);
  };
  const wakeMaterial=new THREE.ShaderMaterial({transparent:true,depthWrite:false,
    uniforms:{uTime:{value:0},uOpacity:{value:1}},
    vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader:`varying vec2 vUv;uniform float uTime;uniform float uOpacity;
      void main(){float x=vUv.x;float y=abs(vUv.y-.5);float v=abs(y-(1.-x)*.29);
      float arms=exp(-v*v*1250.);float churn=exp(-y*y*360.)*.5;
      float ripple=.65+.35*sin(x*80.-uTime*3.+y*30.);
      float fade=smoothstep(0.,.15,x)*(1.-smoothstep(.86,1.,x));
      gl_FragColor=vec4(.83,.95,.91,(arms+churn)*ripple*fade*.57*uOpacity);}`
  });materials.push(wakeMaterial);
  const wake=new THREE.Mesh(new THREE.PlaneGeometry(78,17),wakeMaterial);wake.position.z=2;scene.add(wake);
  const bowMaterial=new THREE.ShaderMaterial({transparent:true,depthWrite:false,
    uniforms:{uTime:{value:0},uOpacity:{value:1}},
    vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader:`varying vec2 vUv;uniform float uTime;uniform float uOpacity;
      void main(){vec2 p=(vUv-.5)*2.;float r=length(p);float rings=pow(max(0.,sin(r*24.-uTime*3.7)),12.);
      float fade=(1.-smoothstep(.25,1.,r))*smoothstep(-.4,.3,p.x);
      gl_FragColor=vec4(.83,.97,.93,rings*fade*.23*uOpacity);}`
  });materials.push(bowMaterial);
  const bow=new THREE.Mesh(new THREE.PlaneGeometry(18,7),bowMaterial);bow.position.z=2;scene.add(bow);
  const frontCloud=layer(cloudTexture,116,49,310,163,5,.28);
  // Small low-opacity foreground mist adds depth without hiding the landscape.
  const mist=layer(cloudTexture,170,52,190,104,4,.10);
  function update(time) {
    bayMaterial.uniforms.uTime.value=time;
    reflectionTime.value=time;
    const phase=(time/64)%1;
    const x=62+235*phase;
    const visibility=THREE.MathUtils.smoothstep(phase,0,.09)*(1-THREE.MathUtils.smoothstep(phase,.89,1));
    const bob=Math.sin(time*1.1)*.52+Math.sin(time*.57)*.28;
    const waterline=70+Math.sin(phase*Math.PI)*7;
    boat.position.set(x,waterline+boatHeight/2+bob,3);
    boat.rotation.z=Math.sin(time*.83)*.012;
    boat.material.opacity=visibility;
    reflection.position.set(x,waterline-boatHeight*.32+bob*.45,1);
    reflection.material.opacity=.13*visibility;
    reflection.rotation.z=-boat.rotation.z;
    wake.position.set(x-boatWidth*.38-37,waterline+bob*.3,2);
    wakeMaterial.uniforms.uTime.value=time;wakeMaterial.uniforms.uOpacity.value=visibility;
    bow.position.set(x+boatWidth*.40,waterline+bob*.3,2);
    bowMaterial.uniforms.uTime.value=time;bowMaterial.uniforms.uOpacity.value=visibility;
    backCloud.position.x=-80+((time*1.65+90)%520);
    distantCloud.position.x=430-((time*.95+160)%520);
    frontCloud.position.x=-85+((time*2.3+370)%530);
    mist.position.x=180+Math.sin(time*.025)*55;
    backCloud.position.y=204+Math.sin(time*.06)*3;
    frontCloud.position.y=166+Math.sin(time*.045)*4;
  }
  return {
    update,
    createTerrainOccluder() {
      // Depth-only cutout of the exact displayed terrain. Transparent sky and
      // water cannot hide the aircraft; solid cliff pixels can.
      const material=new THREE.ShaderMaterial({
        uniforms:{map:{value:landscape}},depthWrite:true,depthTest:true,colorWrite:false,
        vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
        fragmentShader:`uniform sampler2D map;varying vec2 vUv;void main(){if(vUv.y<.34 || texture2D(map,vUv).a<.25)discard;gl_FragColor=vec4(0.);}`
      });
      const occluder=new THREE.Mesh(new THREE.PlaneGeometry(360,240),material);
      occluder.position.set(180,135,0);
      occluder.renderOrder=-20;
      return occluder;
    },
    render(){renderer.render(scene,camera);},
    dispose(){scene.traverse(item=>item.geometry?.dispose());materials.forEach(material=>material.dispose());textures.forEach(texture=>texture.dispose());}
  };
}
