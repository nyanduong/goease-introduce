import {MathUtils} from 'three';
// Shared scene units: the junk is the size reference for every flying bird.
export const BOAT_WIDTH=44;
export function boatState(time){
  const phase=(time/64)%1;
  return {x:62+235*phase,waterline:70+Math.sin(phase*Math.PI)*7,
    visibility:MathUtils.smoothstep(phase,0,.09)*(1-MathUtils.smoothstep(phase,.89,1))};
}
export function waterSurfaceY(depth){return MathUtils.mapLinear(depth,-96,96,102,68);}
const ratios=[.045,.105,.085,.068];
export function birdScale(species,depth){
  const span=2*(species.span+.6),perspective=430/(430-depth);
  return Math.min(BOAT_WIDTH*ratios[species.index??0]*perspective,BOAT_WIDTH*.125)/span;
}
export const FLOCK_SIZES=[3,2,2,3];
