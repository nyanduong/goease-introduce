import { shouldAutoplay, nextAvailableIndex } from './motion-state.js';

const region = document.querySelector('.destination-slideshow');
const layers = [...region.querySelectorAll('.slide-layer')];
const indicators = [...region.querySelectorAll('.slide-indicator')];
const destination = document.querySelector('#slide-destination');
const announcement = document.querySelector('#slide-announcement');
const errorLabel = document.querySelector('#slide-error');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const slides = [
  { file: 'ha-long', name: { vi: 'Hạ Long, Việt Nam', en: 'Hạ Long, Vietnam' }, position: '59% center', alt: { vi: 'Minh họa vịnh Hạ Long với núi đá và thuyền trong ánh hoàng hôn', en: 'Illustration of Hạ Long Bay with limestone islands and boats at sunset' } },
  { file: 'hoi-an', name: { vi: 'Hội An, Việt Nam', en: 'Hội An, Vietnam' }, position: '48% center', alt: { vi: 'Phố cổ Hội An và thuyền bên bờ sông lúc chiều tối', en: 'Hội An old town and boats by the river at dusk' } },
  { file: 'sa-pa', name: { vi: 'Sa Pa, Việt Nam', en: 'Sa Pa, Vietnam' }, position: '48% center', alt: { vi: 'Ruộng bậc thang xanh trong thung lũng Sa Pa', en: 'Green terraced rice fields in a Sa Pa valley' } },
  { file: 'da-lat', name: { vi: 'Đà Lạt, Việt Nam', en: 'Đà Lạt, Vietnam' }, position: '58% center', alt: { vi: 'Hồ Xuân Hương và cảnh quan thành phố Đà Lạt', en: 'Xuân Hương Lake and the cityscape of Đà Lạt' } },
];
let current = 0;
let activeLayer = 0;
let queuedIndex = null;
let timer = null;
let fadeTimer = null;
let lastChange = Date.now();
let alive = true;
const prepared = new Map();
const failed = new Set();
const state = { paused: document.documentElement.classList.contains('motion-stopped'), reduced: reduced.matches, hidden: document.hidden, hovered: false, focused: region.contains(document.activeElement), busy: false, inViewport: true, modalOpen: false };
const language = () => document.documentElement.lang === 'en' ? 'en' : 'vi';
const imageProps = slide => ({
  sizes: '(max-width: 600px) calc(100vw - 60px), (max-width: 860px) 45vw, 540px',
  srcset: `assets/${slide.file}-480.webp 480w, assets/${slide.file}-960.webp 960w, assets/${slide.file}-1280.webp 1280w`,
  src: `assets/${slide.file}-960.webp`,
});

function prepare(index) {
  if (prepared.has(index)) return prepared.get(index);
  const task = new Promise((resolve, reject) => {
    const image = new Image();
    const timeout = setTimeout(() => finish(new Error('Image load timed out')), 10000);
    function finish(error) {
      clearTimeout(timeout);
      image.onload = image.onerror = null;
      if (error) reject(error); else resolve(image);
    }
    image.onload = () => image.decode().catch(() => {}).then(() => finish());
    image.onerror = () => finish(new Error('Image load failed'));
    image.decoding = 'async';
    image.fetchPriority = 'low';
    Object.assign(image, imageProps(slides[index]));
  });
  prepared.set(index, task);
  task.catch(() => { failed.add(index); prepared.delete(index); });
  return task;
}
function preloadNext() {
  const next = nextAvailableIndex(current, 1, slides.length, failed);
  if (next >= 0 && next !== current) prepare(next).catch(() => {});
}
function syncLabels(manual = false) {
  const lang = language();
  destination.textContent = slides[current].name[lang];
  layers[activeLayer].querySelector('img').alt = slides[current].alt[lang];
  indicators.forEach((button, index) => {
    button.setAttribute('aria-label', `${slides[index].name[lang]}, ${lang === 'vi' ? 'ảnh' : 'slide'} ${index + 1} / ${slides.length}`);
    if (index === current) button.setAttribute('aria-current', 'true');
    else button.removeAttribute('aria-current');
  });
  if (manual) announcement.textContent = `${slides[current].name[lang]} · ${current + 1} / ${slides.length}`;
}
function schedule() {
  clearTimeout(timer);
  if (!alive || !shouldAutoplay(state) || failed.size >= slides.length - 1) return;
  timer = setTimeout(() => {
    const next = nextAvailableIndex(current, 1, slides.length, failed);
    if (next >= 0 && next !== current) goTo(next, false);
  }, Math.max(700, 5000 - (Date.now() - lastChange)));
}
function finishTransition() {
  clearTimeout(fadeTimer);
  state.busy = false;
  region.removeAttribute('aria-busy');
  if (!alive) { queuedIndex = null; return; }
  if (queuedIndex !== null && queuedIndex !== current) {
    const next = queuedIndex;
    queuedIndex = null;
    goTo(next, true);
  } else {
    queuedIndex = null;
    preloadNext();
    schedule();
  }
}
async function goTo(index, manual) {
  if (index < 0 || index === current) return;
  if (state.busy) { queuedIndex = index; return; }
  clearTimeout(timer);
  state.busy = true;
  region.setAttribute('aria-busy', 'true');
  if (manual) failed.delete(index);
  try {
    await prepare(index);
    if (!alive) { finishTransition(); return; }
    // An automatic request that was loading when motion stopped must not commit.
    if (!manual && (state.paused || state.reduced || state.hidden || state.hovered || state.focused || state.modalOpen || !state.inViewport)) {
      finishTransition();
      return;
    }
    const incomingIndex = 1 - activeLayer;
    const incoming = layers[incomingIndex];
    const image = incoming.querySelector('img');
    Object.assign(image, imageProps(slides[index]));
    image.style.objectPosition = slides[index].position;
    image.alt = slides[index].alt[language()];
    const outgoing = layers[activeLayer];
    incoming.removeAttribute('aria-hidden');
    outgoing.setAttribute('aria-hidden', 'true');
    incoming.classList.add('is-active');
    outgoing.classList.remove('is-active');
    current = index;
    activeLayer = incomingIndex;
    lastChange = Date.now();
    errorLabel.hidden = true;
    region.dataset.slideIndex = String(current);
    syncLabels(manual);
    const duration = state.reduced || state.paused ? 0 : 950;
    fadeTimer = setTimeout(finishTransition, duration);
  } catch {
    failed.add(index);
    errorLabel.textContent = language() === 'vi' ? 'Ảnh chưa tải được. Bạn vẫn có thể xem điểm đến khác.' : 'This image could not load. You can still explore another destination.';
    errorLabel.hidden = false;
    lastChange = Date.now();
    if (!layers[activeLayer].querySelector('img').naturalWidth && queuedIndex === null) {
      const recovery = nextAvailableIndex(current, 1, slides.length, failed);
      if (recovery >= 0 && recovery !== current) queuedIndex = recovery;
    }
    finishTransition();
  }
}
function navigate(direction) {
  goTo(nextAvailableIndex(queuedIndex ?? current, direction, slides.length, failed), true);
}
region.querySelector('.slide-previous').addEventListener('click', () => navigate(-1));
region.querySelector('.slide-next').addEventListener('click', () => navigate(1));
indicators.forEach((button, index) => button.addEventListener('click', () => goTo(index, true)));
region.addEventListener('keydown', event => {
  if (!['ArrowLeft','ArrowRight'].includes(event.key)) return;
  event.preventDefault();
  navigate(event.key === 'ArrowRight' ? 1 : -1);
});
region.addEventListener('pointerenter', event => {
  if (event.pointerType === 'touch' || !finePointer.matches) return;
  state.hovered = true; schedule();
});
region.addEventListener('pointerleave', () => { state.hovered = false; lastChange = Date.now(); schedule(); });
region.addEventListener('focusin', () => { state.focused = true; schedule(); });
region.addEventListener('focusout', () => queueMicrotask(() => {
  state.focused = region.contains(document.activeElement);
  if (!state.focused) lastChange = Date.now();
  schedule();
}));
window.addEventListener('goease:motionchange', event => {
  Object.assign(state, event.detail);
  region.classList.toggle('slideshow-paused', state.paused || state.reduced || state.hidden || state.modalOpen);
  lastChange = Date.now();
  schedule();
});
window.addEventListener('goease:languagechange', () => syncLabels());
document.addEventListener('visibilitychange', () => { state.hidden = document.hidden; lastChange = Date.now(); schedule(); });
reduced.addEventListener('change', event => { state.reduced = event.matches; lastChange = Date.now(); schedule(); });
let visibilityObserver = null;
if ('IntersectionObserver' in window) {
  visibilityObserver = new IntersectionObserver(([entry]) => {
    state.inViewport = entry.isIntersecting;
    region.classList.toggle('slideshow-offscreen', !entry.isIntersecting);
    lastChange = Date.now();
    schedule();
  }, { threshold: .05 });
  visibilityObserver.observe(region);
}
window.addEventListener('pagehide', event => {
  alive = false;
  clearTimeout(timer); clearTimeout(fadeTimer);
  if (!event.persisted) visibilityObserver?.disconnect();
});
window.addEventListener('pageshow', () => { alive = true; state.hidden = document.hidden; state.busy = false; region.removeAttribute('aria-busy'); lastChange = Date.now(); schedule(); });
region.dataset.slideIndex = '0';
syncLabels();
const firstImage = layers[0].querySelector('img');
const begin = () => { preloadNext(); lastChange = Date.now(); schedule(); };
const recoverInitial = () => { failed.add(0); navigate(1); };
if (firstImage.complete) {
  if (firstImage.naturalWidth > 0) begin(); else recoverInitial();
} else {
  firstImage.addEventListener('load', begin, { once: true });
  firstImage.addEventListener('error', recoverInitial, { once: true });
}
