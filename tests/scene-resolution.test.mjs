import {test} from 'node:test';
import assert from 'node:assert/strict';
import {scenePixelRatio} from '../src/scene-resolution.js';

test('scene resolution follows browser zoom instead of stretching its initial buffer',()=>{
  assert.equal(scenePixelRatio(460,345,1),1.25);
  assert.equal(scenePixelRatio(460,345,2),2);
  assert.equal(scenePixelRatio(460,345,3),3);
});

test('large zoomed scenes respect pixel and device texture budgets',()=>{
  for(const [width,height,dpr,limit] of [[1800,1350,4,8192],[2000,1500,4,2048],[460,345,10,4096]]){
    const ratio=scenePixelRatio(width,height,dpr,limit);
    assert.ok(width*height*ratio*ratio<=4_000_001);
    assert.ok(Math.max(width,height)*ratio<=Math.min(4096,limit));
    assert.ok(ratio<=4);
  }
});
