export function shouldAutoplay(state) {
  return !state.paused && !state.reduced && !state.hidden && !state.hovered &&
    !state.focused && !state.modalOpen && !state.busy && state.inViewport !== false;
}

export function nextAvailableIndex(current, direction, total, failed = new Set()) {
  if (total < 1) return -1;
  for (let count = 1; count <= total; count += 1) {
    const index = ((current + direction * count) % total + total) % total;
    if (!failed.has(index)) return index;
  }
  return -1;
}
