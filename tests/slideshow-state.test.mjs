import test from 'node:test';
import assert from 'node:assert/strict';
import { shouldAutoplay, nextAvailableIndex } from '../dist/motion-state.js';

test('autoplay runs only while the visitor can comfortably watch it', () => {
  assert.equal(shouldAutoplay({ inViewport: true }), true);
  for (const reason of ['paused','reduced','hidden','hovered','focused','modalOpen','busy']) {
    assert.equal(shouldAutoplay({ [reason]: true, inViewport: true }), false, reason);
  }
  assert.equal(shouldAutoplay({ inViewport: false }), false);
});
test('releasing one pause reason never bypasses another active pause', () => {
  assert.equal(shouldAutoplay({ paused: false, hidden: true }), false);
  assert.equal(shouldAutoplay({ hidden: false, reduced: true }), false);
  assert.equal(shouldAutoplay({ focused: false, modalOpen: true }), false);
  assert.equal(shouldAutoplay({ hovered: false, paused: true }), false);
});
test('manual navigation wraps correctly in both directions', () => {
  assert.equal(nextAvailableIndex(3, 1, 4), 0);
  assert.equal(nextAvailableIndex(0, -1, 4), 3);
  assert.equal(nextAvailableIndex(1, 1, 4), 2);
});
test('failed photographs are skipped without selecting a blank frame', () => {
  assert.equal(nextAvailableIndex(0, 1, 4, new Set([1,2])), 3);
  assert.equal(nextAvailableIndex(0, -1, 4, new Set([3,2])), 1);
  assert.equal(nextAvailableIndex(0, 1, 4, new Set([1,2,3])), 0);
});
test('an empty or fully failed collection has no new destination', () => {
  assert.equal(nextAvailableIndex(0, 1, 0), -1);
  assert.equal(nextAvailableIndex(0, 1, 4, new Set([0,1,2,3])), -1);
});
