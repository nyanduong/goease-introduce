import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

// Local +X points to the nose; cetacean flukes spread along Z, fish tails along Y.
export const MARINE_SPECIES=[
  {id:'flying-fish',name:'Cá chuồn',length:4.9,sceneLength:1.25,back:0x8ba6b5,belly:0xe3ece5},
  {id:'dolphin',name:'Cá heo',length:8.2,sceneLength:6.5,back:0x6f8994,belly:0xd0d8d5},
  {id:'humpback',name:'Cá voi lưng gù',length:12.8,sceneLength:27,back:0x3d525d,belly:0xbfc9c6},
];
const sphere=new THREE.SphereGeometry(1,18,12);
const profiles=[
  [[-2.25,.04,.045],[-1.8,.14,.13],[-1,.25,.22],[0,.34,.27],[.8,.32,.25],[1.5,.24,.20],[1.95,.08,.10],[2,.015,.02]],
  [[-4,.08,.14],[-3.5,.17,.2],[-2.7,.29,.31],[-1.7,.46,.46],[-.6,.66,.62],[.5,.76,.68],[1.35,.65,.57],[1.95,.47,.43],[2.2,.35,.30],[2.35,.16,.17],[3,.11,.13],[3.18,.025,.035]],
  [[-5.6,.11,.23],[-4.7,.28,.40],[-3.5,.53,.62],[-2,.86,.87],[-.4,1.16,1.12],[1.2,1.3,1.27],[2.5,1.16,1.20],[3.6,.88,1.03],[4.15,.55,.81],[4.4,.12,.45],[4.42,.025,.04]],
];
function bodyGeometry(index,detail){
  const profile=profiles[index],positions=[],colors=[],indices=[];
  const rings=detail?(index===0?52:92):(index===0?20:48),sides=detail?(index===0?20:36):(index===0?10:20);
  const curve=new THREE.CatmullRomCurve3(profile.map(p=>new THREE.Vector3(...p)),false,'centripetal');
  const dark=new THREE.Color(MARINE_SPECIES[index].back),light=new THREE.Color(MARINE_SPECIES[index].belly),color=new THREE.Color();
  for(let row=0;row<=rings;row++){
    const p=curve.getPoint(row/rings);
    for(let side=0;side<=sides;side++){
      const a=side/sides*Math.PI*2,belly=THREE.MathUtils.smoothstep(-Math.cos(a),-.15,.82);
      const y=Math.cos(a)*Math.max(.01,p.y),z=Math.sin(a)*Math.max(.01,p.z);
      positions.push(p.x,y,z);color.copy(dark).lerp(light,belly*.88);
      const fleck=1+Math.sin(p.x*37+side*9)*Math.sin(p.x*13-side*7)*.035;color.multiplyScalar(fleck);
      colors.push(color.r,color.g,color.b);
    }
  }
  for(let row=0;row<rings;row++)for(let side=0;side<sides;side++){const a=row*(sides+1)+side,b=a+sides+1;indices.push(a,a+1,b,a+1,b+1,b);}
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geometry.setIndex(indices);geometry.computeVertexNormals();return geometry;
}
function fin(points,thickness=.04,horizontal=false){
  const shape=new THREE.Shape();shape.moveTo(...points[0]);
  for(let i=1;i<points.length;i++)shape.bezierCurveTo(...points[i]);
  shape.closePath();
  const geometry=new THREE.ExtrudeGeometry(shape,{depth:thickness,bevelEnabled:true,bevelThickness:thickness*.5,bevelSize:thickness*.6,bevelSegments:2,steps:1,curveSegments:10});
  geometry.translate(0,0,-thickness/2);if(horizontal)geometry.rotateX(Math.PI/2);return geometry;
}
function ellipsoid(parent,material,position,scale){const mesh=new THREE.Mesh(sphere,material);mesh.position.set(...position);mesh.scale.set(...scale);parent.add(mesh);return mesh;}
function line(parent,points,radius,material){const path=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));const mesh=new THREE.Mesh(new THREE.TubeGeometry(path,24,radius,5,false),material);parent.add(mesh);}

export function createMarineModel(index=0,{detail=true}={}){
  const species=MARINE_SPECIES[index],fish=index===0,whale=index===2,root=new THREE.Group(),body=new THREE.Group();root.add(body);
  root.name=species.id;
  const skin=new THREE.MeshPhysicalMaterial({vertexColors:true,roughness:fish?.36:.42,metalness:fish?.18:.02,clearcoat:.3,clearcoatRoughness:.3});
  const finMaterial=new THREE.MeshPhysicalMaterial({color:fish?0x92b9c6:whale?0xa2b5b6:0x718c96,roughness:.4,metalness:.02,clearcoat:.25,side:THREE.DoubleSide});
  const dark=new THREE.MeshStandardMaterial({color:0x17282c,roughness:.55}),ivory=new THREE.MeshStandardMaterial({color:0xbac8c7,roughness:.5}),crease=new THREE.MeshStandardMaterial({color:0x7c9291,roughness:.7});
  const dorsalMaterial=new THREE.MeshStandardMaterial({color:species.back,roughness:.42});
  const geometry=bodyGeometry(index,detail),hull=new THREE.Mesh(geometry,skin);body.add(hull);
  const eyeX=fish?1.5:whale?3.5:1.95,eyeY=fish?.11:whale?.12:.22,eyeZ=fish?.21:whale?1.07:.4,eyeSize=fish?.065:whale?.055:.065;
  if(detail)for(const side of [-1,1]){
    ellipsoid(body,dark,[eyeX,eyeY,side*eyeZ],[eyeSize,eyeSize,eyeSize*.5]);
    ellipsoid(body,ivory,[eyeX+.015,eyeY+.018,side*(eyeZ+eyeSize*.4)],[eyeSize*.2,eyeSize*.2,eyeSize*.12]);
    line(body,fish?[[1.35,.17,side*.23],[1.2,-.04,side*.27],[1.29,-.22,side*.18]]:whale?[[4.25,-.1,side*.52],[3.5,-.43,side*.96],[2.1,-.62,side*1.09]]:[[3.1,-.055,side*.08],[2.65,-.12,side*.13],[2.1,-.2,side*.36]],fish?.008:.012,dark);
  }
  if(!fish){
    ellipsoid(body,dark,[whale?1.8:1.05,whale?1.27:.72,0],[whale?.11:.07,.015,whale?.065:.035]);
    const dorsal=fin(whale?[[0,0],[-.1,.35,-.4,.82,-.58,.68],[-.6,.4,-.8,.1,-1.1,0]]:[[0,0],[-.05,.7,-.7,1.7,-1.05,1.55],[-.83,.85,-.88,.25,-1.55,0]],whale?.09:.07);
    if(!whale)dorsal.scale(1,.73,1);
    const dorsalMesh=new THREE.Mesh(dorsal,dorsalMaterial);dorsalMesh.position.set(whale?-2:-.45,whale?.85:.69,0);body.add(dorsalMesh);
  }
  if(whale&&detail){
    const profile=new THREE.CatmullRomCurve3(profiles[index].map(p=>new THREE.Vector3(...p)),false,'centripetal');
    function underside(x,z){
      let lo=0,hi=1;for(let n=0;n<22;n++){const middle=(lo+hi)/2;if(profile.getPoint(middle).x<x)lo=middle;else hi=middle;}
      const radius=profile.getPoint((lo+hi)/2);return -radius.y*Math.sqrt(Math.max(.01,1-Math.pow(z/radius.z,2)))-.012;
    }
    for(let i=-5;i<=5;i++){
      const points=[];for(let k=0;k<=18;k++){const t=k/18,x=3.96-t*4.1,z=i*.12*(.6+Math.sin(t*Math.PI)*.6);points.push([x,underside(x,z),z]);}
      line(body,points,.009,crease);
    }
    for(let i=0;i<9;i++){
      const x=2.8+i*.15;
      ellipsoid(body,finMaterial,[x,.83-(x-2.8)*.27,Math.sin(i*2.4)*.35],[.065,.04,.06]);
    }
  }
  const fins=[];
  for(const side of [-1,1]){
    const joint=new THREE.Group();joint.position.set(fish?.35:whale?1.6:.65,fish?-.06:-.4,side*(fish?.2:whale?1:.52));body.add(joint);
    const shape=fish?[[0,0],[.1,.9,-.6,2.3,-1.4,2.65],[-1.65,2.7,-1.7,.9,-.7,.13]]:whale?[[0,0],[-.1,1,-1.2,3.5,-2.2,4.05],[-2.65,4.2,-2.05,1.5,-.8,.1]]:[[0,0],[-.08,.6,-.8,1.9,-1.35,2.1],[-1.65,2.1,-1.1,.6,-.5,.05]];
    const g=fin(shape,fish?.014:whale?.10:.055,true);if(side<0){g.scale(1,1,-1);g.computeVertexNormals();}
    joint.add(new THREE.Mesh(g,finMaterial));fins.push({joint,side});
    if(fish&&detail)for(let ray=1;ray<=7;ray++)line(joint,[[0,0,0],[-ray*.16,.02,side*(1.1+ray*.16)]],.006,ivory);
  }
  const tail=new THREE.Group();tail.position.x=profiles[index][0][0];body.add(tail);
  const flukes=fin(fish?[[0,0],[-.2,.1,-.65,.7,-.95,.91],[-.87,.55,-.75,.14,-.5,0],[-.8,-.45,-1.1,-.98,-.95,-1.2],[-.4,-1.05,-.18,-.25,0,0]]:[[.1,0],[-.1,.65,-.8,1.6,-1.55,1.86],[-1.8,1.9,-1.3,.85,-.75,.13],[-1.3,-.85,-1.8,-1.9,-1.55,-1.86],[-.8,-1.6,-.1,-.65,.1,0]],fish?.025:.07,!fish);
  let flukeMaterial=finMaterial;
  if(whale){
    flukes.scale(1.3,1.3,1.3);flukeMaterial=new THREE.MeshPhysicalMaterial({vertexColors:true,roughness:.42,clearcoat:.25,side:THREE.DoubleSide});
    const colors=new Float32Array(flukes.attributes.position.count*3),back=new THREE.Color(species.back),underside=new THREE.Color(0xc5ceca),color=new THREE.Color();
    for(let i=0;i<flukes.attributes.position.count;i++){color.copy(back).lerp(underside,THREE.MathUtils.smoothstep(-flukes.attributes.normal.getY(i),-.2,.4));colors.set([color.r,color.g,color.b],i*3);}
    flukes.setAttribute('color',new THREE.BufferAttribute(colors,3));
  }
  tail.add(new THREE.Mesh(flukes,flukeMaterial));

  // Bake static details into one body mesh while retaining the moving fin joints.
  const pieces=[];
  for(const mesh of [...body.children].filter(o=>o.isMesh)){
    mesh.updateMatrix();let g=mesh.geometry.clone().applyMatrix4(mesh.matrix);if(g.index)g=g.toNonIndexed();g.deleteAttribute('uv');
    if(!g.attributes.color){const color=mesh.material.color,colors=new Float32Array(g.attributes.position.count*3);for(let k=0;k<colors.length;k+=3){colors[k]=color.r;colors[k+1]=color.g;colors[k+2]=color.b;}g.setAttribute('color',new THREE.BufferAttribute(colors,3));}
    pieces.push(g);body.remove(mesh);if(mesh.geometry!==sphere)mesh.geometry.dispose();
  }
  const combined=mergeGeometries(pieces);pieces.forEach(g=>g.dispose());const bodyMesh=new THREE.Mesh(combined,skin);body.add(bodyMesh);
  const base=combined.attributes.position.array.slice();
  const materials=[...new Set([skin,finMaterial,dark,ivory,crease,dorsalMaterial,flukeMaterial])];
  let submerged=null,submergedMaterial=null;
  function follow(source,target){
    target.position.copy(source.position);target.quaternion.copy(source.quaternion);target.scale.copy(source.scale);
    source.children.forEach((child,i)=>follow(child,target.children[i]));
  }
  function pose(time,{air=0,strength=1}={}){
    const hz=fish?8:whale?.48:1.75,beat=time*hz*Math.PI*2;
    const attr=combined.attributes.position;
    for(let i=0;i<attr.count;i++){
      const x=base[i*3],weight=THREE.MathUtils.smoothstep(-x,0,fish?2.25:whale?5.6:4),swing=Math.sin(beat+weight*1.5)*weight*weight*(fish?.12:whale?.27:.36)*strength;
      attr.setXYZ(i,x,base[i*3+1]+(fish?0:swing),base[i*3+2]+(fish?swing:0));
    }
    attr.needsUpdate=true;
    const tailWeight=Math.sin(beat+1.5)*(fish?.12:whale?.27:.36)*strength;
    tail.position.y=fish?0:tailWeight;tail.position.z=fish?tailWeight:0;
    tail.rotation.z=fish?0:Math.cos(beat+1.5)*.3*strength;tail.rotation.y=fish?Math.cos(beat+1.5)*.28*strength:0;
    fins.forEach(({joint,side})=>{joint.rotation.x=side*(fish?-.07:.18+Math.sin(beat-.5)*.12);joint.rotation.y=fish?-side*(1-air)*1.3:side*.13;});
    if(submerged)follow(body,submerged);
  }
  function setWater(surfaceY){
    for(const material of materials){
      material.transparent=true;material.depthWrite=false;
      // Native world-space clipping keeps the exact waterline stable even when
      // many animals share the same compiled physical-material program.
      const plane=new THREE.Plane(new THREE.Vector3(0,1,0),-surfaceY);
      material.clippingPlanes=[plane];material.userData.water=plane;
    }
    if(!fish){
      submergedMaterial=new THREE.MeshBasicMaterial({color:0x537f87,transparent:true,opacity:.32,depthWrite:false,side:THREE.DoubleSide});
      submergedMaterial.clippingPlanes=[new THREE.Plane(new THREE.Vector3(0,-1,0),surfaceY)];
      submerged=body.clone(true);submerged.traverse(o=>{if(o.isMesh)o.material=submergedMaterial;});root.add(submerged);
    }
  }
  pose(0);
  return {root,species,pose,rig:{tail,fins},setWater,
    water(surfaceY,fade=1){
      for(const material of materials)if(material.userData.water){material.userData.water.constant=-surfaceY;material.opacity=fade;}
      if(submergedMaterial){submergedMaterial.clippingPlanes[0].constant=surfaceY;submergedMaterial.opacity=fade*.32*Math.exp(-Math.max(0,surfaceY-root.position.y-2)*.2);}
    },
    dispose(){const geometries=new Set();root.traverse(o=>{if(o.geometry&&o.geometry!==sphere)geometries.add(o.geometry);});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());submergedMaterial?.dispose();}};
}
