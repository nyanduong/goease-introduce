import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

// Local +X is forward, +Y is dorsal, and +/-Z are the two wings.
export const BIRD_SPECIES = [
  {id:'swallow',name:'Chim én',body:0x173c56,belly:0xf1e5cc,wing:0x15344e,tip:0x102737,accent:0x9f5136,scale:4.1,span:5.1,hz:5.1,amplitude:.72,tail:3.2},
  {id:'macaw',name:'Vẹt đuôi dài đỏ',body:0xc93627,belly:0xe14e28,wing:0xe7b843,tip:0x2879ab,accent:0xf5ede0,scale:4.6,span:4.6,hz:2.9,amplitude:.86,tail:4.5},
  {id:'cockatoo',name:'Vẹt mào vàng',body:0xebe9df,belly:0xf5efdc,wing:0xd8dcd3,tip:0xb9c5be,accent:0xecc344,scale:4.3,span:4.1,hz:3.4,amplitude:.9,tail:2.1},
  {id:'parakeet',name:'Vẹt xanh đầu mận',body:0x4c9a46,belly:0x85b54d,wing:0x34773c,tip:0x176260,accent:0x875c9d,scale:4.1,span:3.7,hz:4.1,amplitude:.8,tail:3.1},
];

const bodyGeometry=new THREE.SphereGeometry(1,28,20);
const eyeGeometry=new THREE.SphereGeometry(1,16,12);
const featherGeometry=makeFeather();
function makeFeather(){
  // A tapered, cambered volume with a central ridge, rather than a flat sprite.
  const positions=[],indices=[];
  const rings=15,sides=8;
  for(let j=0;j<=rings;j++){
    const t=j/rings;
    const width=.025+Math.pow(Math.sin(Math.PI*t),.65)*.475;
    for(let k=0;k<sides;k++){
      const angle=k/sides*Math.PI*2;
      positions.push(Math.cos(angle)*width,Math.sin(angle)*width*.17+Math.sin(t*Math.PI)*.09,t);

    }
  }
  for(let j=0;j<rings;j++)for(let k=0;k<sides;k++){
    const a=j*sides+k,b=j*sides+(k+1)%sides,c=a+sides,d=b+sides;
    indices.push(a,b,c,b,d,c);
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();return g;
}
const mat=color=>new THREE.MeshStandardMaterial({color,roughness:.82,metalness:0});
function ellipsoid(parent,material,position,scale,rotation=0,geometry=bodyGeometry){
  const m=new THREE.Mesh(geometry,material);m.position.set(...position);m.scale.set(...scale);m.rotation.z=rotation;parent.add(m);return m;
}
function feathers(parent,material,items){
  const mesh=new THREE.InstancedMesh(featherGeometry,material,items.length),dummy=new THREE.Object3D();
  items.forEach((f,i)=>{dummy.position.set(...f.p);dummy.rotation.set(f.rx||0,f.ry||0,f.rz||0);dummy.scale.set(f.w,.85,f.length);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);});
  mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();parent.add(mesh);return mesh;
}
function beak(parent,material,large){
  ellipsoid(parent,material,[1.7,.62,0],[.34,.27,large?.23:.16],-.18);
  const path=new THREE.CatmullRomCurve3([new THREE.Vector3(1.45,.73,0),new THREE.Vector3(1.92,.64,0),new THREE.Vector3(2.08,.42,0),new THREE.Vector3(1.94,.23,0)]);
  const geometry=new THREE.TubeGeometry(path,18,large?.24:.16,10,false);
  const a=geometry.attributes.position;
  // Taper the hooked tip along the curved centerline.
  for(let i=0;i<a.count;i++){
    const t=Math.floor(i/11)/18,center=path.getPointAt(t),factor=1-.88*t;
    a.setXYZ(i,center.x+(a.getX(i)-center.x)*factor,center.y+(a.getY(i)-center.y)*factor,center.z+(a.getZ(i)-center.z)*factor);
  }
  geometry.computeVertexNormals();parent.add(new THREE.Mesh(geometry,material));
}

export function createBirdModel(speciesIndex=0,{batch=false}={}){
  const species=BIRD_SPECIES[speciesIndex],root=new THREE.Group(),body=new THREE.Group();root.add(body);
  root.name=species.id;
  const materials={body:mat(species.body),belly:mat(species.belly),wing:mat(species.wing),tip:mat(species.tip),accent:mat(species.accent),beak:mat(speciesIndex===3?0xe5a04b:0x343638),iris:mat(speciesIndex===0?0x313638:0xd1b271),pupil:mat(0x090d0d),glint:mat(0xffffff)};
  const swallow=speciesIndex===0,macaw=speciesIndex===1,cockatoo=speciesIndex===2;
  ellipsoid(body,materials.body,[-.3,0,0],[swallow?1.6:1.45,swallow?.45:.72,.59],-.08);
  ellipsoid(body,materials.belly,[.02,-.2,0],[1.18,swallow?.42:.56,.49],-.1);
  ellipsoid(body,materials.body,[.75,.38,0],[.64,.66,.52],.25);
  ellipsoid(body,swallow||macaw||cockatoo?materials.body:materials.accent,[1.1,.69,0],[swallow?.46:.59,swallow?.38:.58,.52],.12);
  if(swallow){
    ellipsoid(body,materials.accent,[1.35,.47,0],[.3,.23,.43]);
    const g=new THREE.ConeGeometry(.14,.56,12);g.rotateZ(-Math.PI/2);ellipsoid(body,materials.beak,[1.72,.63,0],[1,1,1],0,g);
  }else{
    if(macaw)for(const side of [-1,1]){
      ellipsoid(body,materials.accent,[1.38,.73,side*.42],[.36,.38,.1],.1);
      // Fine facial feather lines distinguish the macaw's bare cheek patch.
      for(let k=0;k<3;k++)ellipsoid(body,materials.beak,[1.23+k*.11,.56,side*.51],[.015,.1,.009],-.4);
    }
    beak(body,materials.beak,macaw||cockatoo);
    ellipsoid(body,materials.beak,[1.7,.28,0],[.28,.12,.15],-.2);
  }
  for(const side of [-1,1]){
    ellipsoid(body,materials.iris,[1.27,.87,side*.49],[.085,.09,.035],0,eyeGeometry);
    ellipsoid(body,materials.pupil,[1.29,.87,side*.53],[.055,.061,.022],0,eyeGeometry);
    ellipsoid(body,materials.glint,[1.32,.915,side*.552],[.016,.018,.009],0,eyeGeometry);
    // Feet are tucked under the belly during flight, with small curved toes.
    ellipsoid(body,materials.beak,[-.54,-.65,side*.3],[.18,.1,.12],-.6);
  }
  if(cockatoo){
    const crest=[];for(let i=0;i<6;i++)crest.push({p:[.76-i*.09,1.11,0],length:1+i*.06,w:.2,rx:-Math.PI/2,ry:-.4-i*.055});
    feathers(body,materials.accent,crest);
  }
  if(speciesIndex===3)ellipsoid(body,materials.beak,[.7,.21,0],[.41,.08,.535],.08);

  // Overlapping scapular feathers break up the smooth body silhouette.
  const mantle=[];
  for(let row=0;row<5;row++)for(let column=-2;column<=2;column++){
    const x=.35-row*.31,z=column*.18;
    const y=Math.sqrt(Math.max(.05,1-Math.pow((x+.3)/1.6,2)-Math.pow(z/.69,2)))*(swallow?.44:.69);
    mantle.push({p:[x,y+.035,z],length:swallow?.55:.66,w:.26,ry:-Math.PI/2,rz:column*.12});
  }
  feathers(body,materials.body,mantle);

  const shoulders=[],wrists=[];
  for(const side of [-1,1]){
    const shoulder=new THREE.Group();shoulder.position.set(-.25,.24,side*.43);body.add(shoulder);shoulders.push({group:shoulder,side});
    ellipsoid(shoulder,materials.body,[-.22,0,side*.85],[.94,.23,1.2],0);
    const coverts=[],secondaries=[];
    for(let i=0;i<7;i++){
      coverts.push({p:[.46-i*.2,.06,side*.3],w:.35,length:2-i*.07,ry:(-.12-i*.065),rx:side<0?Math.PI:0});
      secondaries.push({p:[-.38-i*.15,-.02,side*.7],w:swallow?.26:.42,length:2.15-i*.11,ry:(-.3-i*.045),rx:side<0?Math.PI:0});
    }
    feathers(shoulder,materials.wing,secondaries);feathers(shoulder,materials.body,coverts);
    const wrist=new THREE.Group();wrist.position.set(-.35,0,side*1.75);shoulder.add(wrist);wrists.push({group:wrist,side});
    const primaries=[];
    for(let i=0;i<(swallow?7:9);i++)primaries.push({p:[.35-i*.14,.015,0],w:swallow?.23:.33,length:species.span-1.7-i*(swallow?.13:.09),ry:(-.23-i*(swallow?.075:.09)),rx:side<0?Math.PI:0});
    feathers(wrist,materials.tip,primaries);
    if(macaw)feathers(wrist,materials.wing,primaries.slice(0,5).map(f=>({...f,w:f.w*1.2,length:f.length*.43,p:[f.p[0],.07,f.p[2]]})));
  }
  const tail=new THREE.Group();tail.position.set(-1.25,.02,0);body.add(tail);
  const tailFeathers=[];
  const count=swallow?6:7;
  for(let i=0;i<count;i++){
    const side=(i-(count-1)/2)/((count-1)/2);
    const length=swallow?1.4+1.9*Math.pow(Math.abs(side),2.1):species.tail*(1-.27*Math.abs(side));
    tailFeathers.push({p:[0,0,side*.16],w:swallow?.18:.34,length,ry:-Math.PI/2-side*(swallow?.16:.095)});
  }
  feathers(tail,macaw?materials.tip:materials.wing,tailFeathers);
  const phase=speciesIndex*2.17;
  function pose(time,{bank=0,climb=0,glide=0}={}){
    const beat=time*species.hz*Math.PI*2+phase;
    const power=(1-glide)*species.amplitude;
    const flap=(Math.sin(beat)+.13*Math.sin(beat*2))*.85;
    shoulders.forEach(({group,side})=>{
      group.rotation.x=side*(-flap*power-.09-glide*.06);
      group.rotation.y=side*(.06+glide*.1+(1-glide)*Math.max(0,-Math.cos(beat))*.13);
      group.rotation.z=.03*Math.sin(beat-.25)*(1-glide);
    });
    wrists.forEach(({group,side})=>{
      // Wrist flex follows the shoulder, letting the primaries trail the upstroke.
      group.rotation.x=side*(-Math.sin(beat-.58)*power*.44);
      group.rotation.y=side*(.09+Math.max(0,-Math.sin(beat-.2))*(1-glide)*.32);
    });
    tail.rotation.x=-bank*.2;tail.rotation.z=climb*.18+.025*Math.sin(beat-.7)*(1-glide);
    tail.scale.z=1+Math.abs(bank)*.35;
    body.rotation.z=.025*Math.sin(beat)*(1-glide);
  }
  pose(0);
  if(batch){
    // Each moving joint becomes one draw call. Keep the rig, merge its rigid
    // feather/body pieces with vertex colours for a lightweight full flock.
    const surface=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.82});
    materials.batched=surface;
    function bake(group){
      group.children.filter(child=>child.isGroup).forEach(bake);
      const pieces=[],sources=new Set();
      for(const mesh of [...group.children].filter(child=>child.isMesh)){
        mesh.updateMatrix();sources.add(mesh.geometry);
        const count=mesh.isInstancedMesh?mesh.count:1;
        for(let i=0;i<count;i++){
          const matrix=mesh.matrix.clone();if(mesh.isInstancedMesh){const instance=new THREE.Matrix4();mesh.getMatrixAt(i,instance);matrix.multiply(instance);}
          const geometry=mesh.geometry.clone().applyMatrix4(matrix);
          geometry.deleteAttribute('uv');
          const color=mesh.material.color,colors=new Float32Array(geometry.attributes.position.count*3);
          for(let k=0;k<colors.length;k+=3){colors[k]=color.r;colors[k+1]=color.g;colors[k+2]=color.b;}
          geometry.setAttribute('color',new THREE.BufferAttribute(colors,3));pieces.push(geometry);
        }
        group.remove(mesh);
      }
      if(pieces.length){const geometry=mergeGeometries(pieces);group.add(new THREE.Mesh(geometry,surface));pieces.forEach(piece=>piece.dispose());}
      sources.forEach(geometry=>{if(![bodyGeometry,eyeGeometry,featherGeometry].includes(geometry))geometry.dispose();});
    }
    bake(body);
  }
  return {root,species,pose,dispose(){Object.values(materials).forEach(m=>m.dispose());root.traverse(o=>{if(o.geometry&&o.geometry!==bodyGeometry&&o.geometry!==featherGeometry&&o.geometry!==eyeGeometry)o.geometry.dispose();});}};
}
