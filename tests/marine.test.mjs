import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Box3,Vector3} from 'three';
import {MARINE_SPECIES,createMarineModel} from '../src/marine-models.js';
import {MARINE_GROUPS,createMarineMotion,marineScale} from '../src/marine-motion.js';
import {BOAT_WIDTH} from '../src/bay-space.js';

test('all schools and pods stay in the sea and each species performs its own surface behaviour',()=>{
  const totals=[0,0,0];
  MARINE_GROUPS.forEach((group,index)=>{
    totals[group.kind]+=group.count;
    const motion=createMarineMotion({seed:76+index,index,kind:group.kind,lane:group.lane});
    let airborne=false,dived=false,blew=false;
    for(let frame=0;frame<60*130;frame++)for(let member=0;member<group.count;member++){
      const state=motion.sample(frame/60,member);
      assert.ok(Number.isFinite(state.position.length()+state.pitch+state.roll));
      assert.ok(state.position.x>=42&&state.position.x<=316);
      assert.ok(state.surfaceY>=29&&state.surfaceY<=80);
      assert.ok(state.position.y<92,'no animals swimming through the cliffs');
      assert.ok(state.visibility>=0&&state.visibility<=1);
      airborne ||= state.elevation>3;dived ||= state.elevation< -8;blew ||= state.breath>0;
    }
    if(group.kind<2)assert.ok(airborne,'fish glide and dolphins leap above the sea');
    else assert.ok(dived&&blew,'whale breathes and dives');
  });
  assert.deepEqual(totals,[32,0,0]);
});

test('models have finite volumes and their scene scale is consistent with the junk',()=>{
  MARINE_SPECIES.forEach((species,index)=>{
    const model=createMarineModel(index),bounds=new Box3(),size=new Vector3();
    for(let frame=0;frame<12;frame++){
      model.pose(frame/12,{air:1});model.root.scale.setScalar(marineScale(species,45));model.root.updateMatrixWorld(true);bounds.setFromObject(model.root);bounds.getSize(size);
      assert.ok(Number.isFinite(size.length())&&Math.min(size.x,size.y,size.z)>0);
      assert.ok(size.x<BOAT_WIDTH*(index===0?.15:index===1?.6:1.45));
    }
    model.pose(.13,{air:1});
    if(index===0){assert.equal(model.rig.tail.rotation.z,0);assert.notEqual(model.rig.tail.rotation.y,0);}
    else {assert.equal(model.rig.tail.rotation.y,0);assert.notEqual(model.rig.tail.rotation.z,0);}
    model.dispose();
  });
});

test('foreground animals are visibly larger than animals in the boat lane',()=>{
  MARINE_SPECIES.forEach(species=>{
    assert.ok(marineScale(species,43)>marineScale(species,75)*1.8);
    assert.ok(marineScale(species,60)<marineScale(species,43));
  });
});

test('waterline clips in world space and submerged silhouettes fade with depth',()=>{
  const model=createMarineModel(1,{detail:false});model.setWater(60);model.root.position.y=58;model.pose(.8);model.water(60,.8);
  const clips=[];model.root.traverse(object=>{if(object.isMesh)clips.push(...(object.material.clippingPlanes||[]));});
  assert.ok(clips.some(plane=>plane.distanceToPoint(new Vector3(0,61,0))>0&&plane.distanceToPoint(new Vector3(0,59,0))<0));
  assert.ok(clips.some(plane=>plane.distanceToPoint(new Vector3(0,61,0))<0&&plane.distanceToPoint(new Vector3(0,59,0))>0));
  const submerged=model.root.children[1];let material;submerged.traverse(object=>{if(object.isMesh)material=object.material;});const near=material.opacity;
  model.root.position.y=42;model.water(60,.8);assert.ok(material.opacity<near*.1);
  const sourceTail=model.rig.tail,copyTail=submerged.children[model.root.children[0].children.indexOf(sourceTail)];
  assert.ok(sourceTail.position.distanceTo(copyTail.position)<1e-8);model.dispose();
});
