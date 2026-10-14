// Translation catalogue and original download links are supplied by app.js.
let language = 'vi';
try { if (localStorage.getItem('goease-language') === 'en') language = 'en'; } catch { /* Optional storage. */ }
const languageButton = document.querySelector('#language');
const menuButton = document.querySelector('.menu-button');
const mobileNav = document.querySelector('#mobile-nav');
const dialog = document.querySelector('#download-dialog');
const motionButtons = [...document.querySelectorAll('.motion-toggle, .motion-control')];
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const desktopPreview = matchMedia('(min-width: 901px)');
const root = document.documentElement;
let userPaused = false;
let selectedPlatform = 'ios';
let modalTrigger = null;
let closeTimer = null;
let savedScroll = 0;
let savedBodyStyle = null;
let savedRootOverflow = '';
const textFor = key => language === 'vi' ? vi[key] : en[key];

function syncMotionControls() {
  const key = userPaused ? 'resumeMotion' : 'pauseMotion';
  for (const button of motionButtons) {
    button.hidden = false;
    button.setAttribute('aria-pressed', String(userPaused));
    button.setAttribute('aria-label', textFor(key));
    button.title = textFor(key);
    if (button.classList.contains('motion-toggle')) button.textContent = textFor(key);
    else button.querySelector('.motion-symbol').textContent = userPaused ? '▷' : 'Ⅱ';
  }
}
function motionIsStopped() { return userPaused || motionPreference.matches || document.hidden; }
function broadcastMotion() {
  root.classList.toggle('motion-stopped', userPaused || motionPreference.matches);
  if (userPaused || motionPreference.matches) root.classList.add('entrance-settled');
  root.classList.toggle('page-hidden', document.hidden);
  root.classList.toggle('reduced-motion', motionPreference.matches);
  if (userPaused || motionPreference.matches) {
    document.querySelectorAll('.reveal').forEach(element => element.classList.add('is-visible'));
    document.querySelector('.app-preview').classList.add('phones-open');
    document.querySelector('.journey-board').classList.add('journey-active');
  }
  syncMotionControls();
  window.dispatchEvent(new CustomEvent('goease:motionchange', { detail: {
    paused: userPaused, reduced: motionPreference.matches, hidden: document.hidden, modalOpen: dialog.open,
  } }));
}
motionButtons.forEach(button => button.addEventListener('click', () => {
  userPaused = !userPaused;
  broadcastMotion();
}));
motionPreference.addEventListener('change', broadcastMotion);
document.addEventListener('visibilitychange', broadcastMotion);

function updateDialogCopy() {
  const platform = selectedPlatform === 'ios' ? 'App Store (iOS)' : 'Google Play (Android)';
  document.querySelector('#dialog-description').textContent = language === 'vi'
    ? `GoEase chưa có đường dẫn tải trên ${platform}. Chúng tôi sẽ cập nhật nút tải ngay khi ứng dụng được phát hành.`
    : `GoEase does not have a download link on ${platform} yet. We’ll update the download button as soon as the app is released.`;
}
function setLanguage(next) {
  language = next;
  root.lang = next;
  const messages = next === 'vi' ? vi : en;
  for (const node of nodes) {
    if (node.dataset.i18n) node.textContent = messages[node.dataset.i18n];
    if (node.dataset.i18nAlt) node.setAttribute('alt', messages[node.dataset.i18nAlt]);
    if (node.dataset.i18nAria) node.setAttribute('aria-label', messages[node.dataset.i18nAria]);
    if (node.dataset.i18nTitle) node.setAttribute('title', messages[node.dataset.i18nTitle]);
  }
  languageButton.innerHTML = `${next === 'vi' ? 'EN' : 'VI'} <span aria-hidden="true">↗</span>`;
  languageButton.setAttribute('aria-label', next === 'vi' ? 'Switch to English' : 'Chuyển sang tiếng Việt');
  document.querySelector('meta[name="description"]').content = next === 'vi'
    ? 'GoEase — Just go. We’ll plan. Khám phá dự án ứng dụng lập kế hoạch du lịch, lịch trình theo sở thích và quản lý ngân sách chuyến đi.'
    : 'GoEase — Just go. We’ll plan. Discover a travel planning app project built around your interests, itinerary and travel budget.';
  updateMenuLabel();
  updateDialogCopy();
  syncMotionControls();
  updatePreviewLabel();
  try { localStorage.setItem('goease-language', next); } catch { /* Optional storage. */ }
  window.dispatchEvent(new CustomEvent('goease:languagechange', { detail: { language: next } }));
}
languageButton.addEventListener('click', () => setLanguage(language === 'vi' ? 'en' : 'vi'));

function updateMenuLabel() {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-label', language === 'vi' ? (open ? 'Đóng menu' : 'Mở menu') : (open ? 'Close menu' : 'Open menu'));
}
function setMenu(open, restoreFocus = false) {
  mobileNav.hidden = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  updateMenuLabel();
  if (restoreFocus) menuButton.focus({ preventScroll: true });
}
menuButton.addEventListener('click', () => setMenu(mobileNav.hidden));
mobileNav.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileNav.hidden && !dialog.open) setMenu(false, true);
});
document.addEventListener('click', event => {
  if (!mobileNav.hidden && !event.target.closest('.header')) setMenu(false);
});
matchMedia('(min-width: 861px)').addEventListener('change', event => { if (event.matches) setMenu(false); });

function lockScroll() {
  savedScroll = window.scrollY;
  savedBodyStyle = document.body.getAttribute('style');
  savedRootOverflow = root.style.overflow;
  const scrollbar = getComputedStyle(root).scrollbarGutter.includes('stable') ? 0 : window.innerWidth - root.clientWidth;
  // Keep the document's coordinate space while the native dialog makes it inert.
  root.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = `${scrollbar}px`;
  root.classList.add('modal-open');
}
function unlockScroll() {
  if (savedBodyStyle === null) document.body.removeAttribute('style');
  else document.body.setAttribute('style', savedBodyStyle);
  root.style.overflow = savedRootOverflow;
  root.classList.remove('modal-open');
  // Avoid smooth anchor scrolling when restoring the document after a modal.
  const behavior = root.style.scrollBehavior;
  root.style.scrollBehavior = 'auto';
  window.scrollTo(0, savedScroll);
  root.style.scrollBehavior = behavior;
}
function openDialog(button) {
  if (dialog.open) return;
  clearTimeout(closeTimer);
  dialog.classList.remove('is-closing');
  modalTrigger = button;
  updateDialogCopy();
  lockScroll();
  dialog.showModal();
  document.querySelector('.dialog-close').focus({ preventScroll: true });
  broadcastMotion();
}
function closeDialog() {
  if (!dialog.open || dialog.classList.contains('is-closing')) return;
  if (motionIsStopped()) { dialog.close(); return; }
  dialog.classList.add('is-closing');
  closeTimer = setTimeout(() => { if (dialog.open) dialog.close(); }, 180);
}
document.querySelectorAll('[data-platform]').forEach(button => button.addEventListener('click', () => {
  selectedPlatform = button.dataset.platform;
  if (downloadLinks[selectedPlatform]) { window.location.assign(downloadLinks[selectedPlatform]); return; }
  openDialog(button);
}));
document.querySelector('.dialog-close').addEventListener('click', closeDialog);
document.querySelector('.dialog-confirm').addEventListener('click', closeDialog);
dialog.addEventListener('cancel', event => { event.preventDefault(); closeDialog(); });
dialog.addEventListener('keydown', event => {
  if (event.key !== 'Tab') return;
  const focusable = [...dialog.querySelectorAll('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter(element => !element.disabled && element.getClientRects().length);
  const first = focusable[0];
  const last = focusable.at(-1);
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});
let pointerStartedOutside = false;
const isOutsideDialog = event => {
  const rect = dialog.getBoundingClientRect();
  return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
};
dialog.addEventListener('pointerdown', event => { pointerStartedOutside = event.target === dialog && isOutsideDialog(event); });
dialog.addEventListener('click', event => {
  if (pointerStartedOutside && event.target === dialog && isOutsideDialog(event)) closeDialog();
  pointerStartedOutside = false;
});
dialog.addEventListener('close', () => {
  clearTimeout(closeTimer);
  dialog.classList.remove('is-closing');
  unlockScroll();
  if (modalTrigger?.isConnected) modalTrigger.focus({ preventScroll: true });
  broadcastMotion();
});

const revealTargets = [...document.querySelectorAll('.section-intro, .feature, .step-card, .showcase-top, .download-panel, .faq > div, .about-copy')].filter(element => !element.matches('.step-card') || !desktopPreview.matches);
if ('IntersectionObserver' in window && !motionPreference.matches) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -20px 0px', threshold: 0 });
  for (const element of revealTargets) {
    if (element.getBoundingClientRect().top < innerHeight) continue;
    element.classList.add('reveal');
    if (element.matches('.feature, .step-card')) element.style.setProperty('--reveal-delay', `${[...element.parentElement.children].indexOf(element) * 80}ms`);
    observer.observe(element);
  }
  document.addEventListener('focusin', event => {
    const element = event.target.closest('.reveal');
    if (element) { element.classList.add('is-visible'); observer.unobserve(element); }
  });
  window.addEventListener('pagehide', event => { if (!event.persisted) observer.disconnect(); });
}

const phoneShowcase = document.querySelector('.app-preview');
const phones = [...phoneShowcase.querySelectorAll('.phone')];
const journeyBoard = document.querySelector('.journey-board');
const downloadPanel = document.querySelector('.download-panel');
function configurePhoneLayout() {
  phoneShowcase.classList.toggle('motion-phones', desktopPreview.matches && !motionPreference.matches && !userPaused);
  if (!desktopPreview.matches) phoneShowcase.classList.add('phones-open');
}
configurePhoneLayout();
desktopPreview.addEventListener('change', configurePhoneLayout);
motionPreference.addEventListener('change', configurePhoneLayout);
if ('IntersectionObserver' in window) {
  if (!motionPreference.matches) journeyBoard.classList.add('motion-journey');
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.target === phoneShowcase && entry.isIntersecting) phoneShowcase.classList.add('phones-open');
      if (entry.target === journeyBoard && entry.isIntersecting) journeyBoard.classList.add('journey-active');
      if (entry.target === downloadPanel) downloadPanel.classList.toggle('ambient-active', entry.isIntersecting);
    }
  }, { threshold: .08 });
  [phoneShowcase, journeyBoard, downloadPanel].forEach(element => observer.observe(element));
  window.addEventListener('pagehide', event => { if (!event.persisted) observer.disconnect(); });
} else {
  phoneShowcase.classList.add('phones-open');
  journeyBoard.classList.add('journey-active');
}
const track = document.querySelector('.journey-track');
const routeVisibility = 'IntersectionObserver' in window ? new IntersectionObserver(([entry]) => {
  track.classList.toggle('route-in-view', entry.isIntersecting);
}, { threshold: .15 }) : null;
if (routeVisibility) routeVisibility.observe(track); else track.classList.add('route-in-view');
const routeResize = 'ResizeObserver' in window ? new ResizeObserver(() => {
  journeyBoard.style.setProperty('--route-distance', `${Math.max(0, track.clientWidth - 35)}px`);
}) : null;
routeResize?.observe(track);

// Tablet/mobile showcase: readable cards with scroll-snap, not three tiny screens.
const previewControls = document.querySelector('.preview-controls');
let previewIndex = 0;
let previewProgrammatic = false;
let previewScrollTimer = null;
function updatePreviewLabel() {
  const keys = ['previewHome', 'phoneCreate', 'previewItinerary'];
  document.querySelector('.preview-current-label').textContent = textFor(keys[previewIndex]);
  document.querySelector('.preview-count').textContent = `0${previewIndex + 1} / 03`;
  document.querySelector('.preview-previous').disabled = previewIndex === 0;
  document.querySelector('.preview-next').disabled = previewIndex === phones.length - 1;
}
function selectPreview(index) {
  previewProgrammatic = true;
  clearTimeout(previewScrollTimer);
  previewScrollTimer = setTimeout(() => { previewProgrammatic = false; }, 800);
  previewIndex = Math.max(0, Math.min(phones.length - 1, index));
  phoneShowcase.scrollTo({ left: phones[previewIndex].offsetLeft - 16, behavior: motionIsStopped() ? 'instant' : 'smooth' });
  updatePreviewLabel();
}
phoneShowcase.addEventListener('scrollend', () => { previewProgrammatic = false; });
phoneShowcase.addEventListener('pointerdown', () => { previewProgrammatic = false; });
previewControls.hidden = false;
document.querySelector('.preview-previous').addEventListener('click', () => selectPreview(previewIndex - 1));
document.querySelector('.preview-next').addEventListener('click', () => selectPreview(previewIndex + 1));
phoneShowcase.setAttribute('tabindex', '0');
phoneShowcase.addEventListener('keydown', event => {
  if (desktopPreview.matches || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
  event.preventDefault();
  selectPreview(previewIndex + (event.key === 'ArrowRight' ? 1 : -1));
});
if ('IntersectionObserver' in window) {
  const previewObserver = new IntersectionObserver(entries => {
    if (desktopPreview.matches || previewProgrammatic) return;
    const best = entries.filter(entry => entry.isIntersecting && entry.intersectionRatio > .65).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (best) { previewIndex = phones.indexOf(best.target); updatePreviewLabel(); }
  }, { root: phoneShowcase, threshold: [.65, .85] });
  phones.forEach(phone => previewObserver.observe(phone));
  window.addEventListener('pagehide', event => { if (!event.persisted) previewObserver.disconnect(); });
}

// Header and current-section feedback use observers rather than scroll loops.
if ('IntersectionObserver' in window) {
  const links = [...document.querySelectorAll('.desktop-nav a, #mobile-nav a')];
  const heroObserver = new IntersectionObserver(([entry]) => {
    document.querySelector('.header').classList.toggle('has-scrolled', !entry.isIntersecting);
    if (entry.isIntersecting) links.forEach(link => link.removeAttribute('aria-current'));
  }, { rootMargin: '-100px 0px 0px 0px' });
  heroObserver.observe(document.querySelector('.hero'));
  const activeObserver = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      links.forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
  }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
  ['tinh-nang','cach-hoat-dong','about'].forEach(id => activeObserver.observe(document.getElementById(id)));
  window.addEventListener('pagehide', event => { if (!event.persisted) { heroObserver.disconnect(); activeObserver.disconnect(); } });
}

// One stable official iframe; only a user retry or a real width change navigates it.
const facebookFrame = document.querySelector('[data-facebook-src]');
const facebookSlot = facebookFrame.parentElement;
const retryButton = document.querySelector('.facebook-retry');
const fallback = document.querySelector('.facebook-fallback');
let facebookStarted = false;
let facebookTimeout = null;
let facebookResizeTimer = null;
let facebookWidth = 0;
let facebookSource = '';
function setFacebookState(state) {
  facebookSlot.dataset.state = state;
  fallback.hidden = state !== 'fallback';
  retryButton.hidden = !['ready','fallback'].includes(state);
}
function loadFacebook(force = false) {
  const width = Math.min(500, Math.max(180, Math.floor(facebookSlot.clientWidth)));
  if (!force && facebookStarted && Math.abs(width - facebookWidth) < 24) return;
  facebookStarted = true;
  facebookWidth = width;
  const url = new URL(facebookFrame.dataset.facebookSrc);
  url.searchParams.set('width', String(width));
  url.searchParams.set('height', String(parseInt(getComputedStyle(facebookFrame).height, 10) || 560));
  facebookSource = url.toString();
  clearTimeout(facebookTimeout);
  setFacebookState('loading');
  facebookFrame.src = facebookSource;
  facebookTimeout = setTimeout(() => setFacebookState('fallback'), 12000);
}
facebookFrame.addEventListener('load', () => {
  if (!facebookStarted || facebookFrame.getAttribute('src') !== facebookSource) return;
  clearTimeout(facebookTimeout);
  setFacebookState('ready'); // Transport loaded; cross-origin content validity is not assumed.
});
facebookFrame.addEventListener('error', () => { clearTimeout(facebookTimeout); setFacebookState('fallback'); });
retryButton.addEventListener('click', () => loadFacebook(true));
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) { loadFacebook(); observer.disconnect(); }
  }, { rootMargin: '200px' });
  observer.observe(facebookSlot);
  window.addEventListener('pagehide', event => { if (!event.persisted) observer.disconnect(); });
} else loadFacebook();
const facebookResize = 'ResizeObserver' in window ? new ResizeObserver(() => {
  if (!facebookStarted) return;
  clearTimeout(facebookResizeTimer);
  facebookResizeTimer = setTimeout(() => loadFacebook(), 400);
}) : null;
facebookResize?.observe(facebookSlot);

setLanguage(language);
broadcastMotion();
root.classList.add('page-ready');
setTimeout(() => root.classList.add('entrance-settled'), 1100);
window.addEventListener('pagehide', () => {
  clearTimeout(closeTimer);
  clearTimeout(facebookTimeout);
  clearTimeout(facebookResizeTimer);
  clearTimeout(previewScrollTimer);
  routeResize?.disconnect();
  routeVisibility?.disconnect();
  facebookResize?.disconnect();
});
window.addEventListener('pageshow', event => {
  if (!event.persisted) return;
  if (dialog.open && dialog.classList.contains('is-closing')) dialog.close();
  root.classList.add('entrance-settled');
  revealTargets.forEach(element => element.classList.add('is-visible'));
  configurePhoneLayout();
  routeResize?.observe(track);
  routeVisibility?.observe(track);
  facebookResize?.observe(facebookSlot);
  if (facebookSlot.dataset.state === 'loading') facebookTimeout = setTimeout(() => setFacebookState('fallback'), 12000);
  broadcastMotion();
});
