// Add official GoEase store URLs here when the app is released.
const downloadLinks = { ios: '', android: '' };
const en = {
  pauseMotion: 'Pause motion', resumeMotion: 'Resume motion',
  ticket1: 'CHOOSE A DESTINATION', ticket2: 'CHART YOUR JOURNEY', ticket3: 'READY TO EXPLORE',
  aboutEyebrow: 'ABOUT GOEASE', aboutTitle1: 'Go further.', aboutTitle2: 'Connect more.',
  aboutBody: 'GoEase started with a wish to make getting ready for a trip simpler. We are building a travel planning experience around your interests, time and budget.',
  aboutCommunity: 'Follow the story of GoEase, share your ideas and talk with us on Facebook.',
  facebookVisit: 'Visit GoEase on Facebook', facebookCaption: 'A new journey, together.', facebookFrameTitle: 'GoEase Facebook page',
  facebookNote: 'If Facebook does not display here, you can open the page using the button below.', facebookOpen: 'Open Facebook page',
  appPreview: 'Illustrative GoEase experience', phoneHello: 'Hello,', phoneReady: 'Ready for a new adventure?',
  phoneCreate: 'Create a trip', phoneTrip: 'Your trips', phoneStart: 'Your journey starts here', phoneOwn: 'A plan that feels like you.',
  phoneDestination: 'Destination', phoneDuration: 'Duration', phoneDays: '3 days of discovery', phoneBudget: 'Estimated budget',
  phoneStyle: 'What do you love?', phoneNature: 'Nature', phoneFood: 'Food', phoneCulture: 'Culture', phoneNext: 'Next',
  phoneMoments: 'Moments to remember.', phoneDay1: 'Day 1', phoneDay2: 'Day 2', phoneDay3: 'Day 3',
  phoneDepart: 'The journey begins', phoneDepartNote: 'A new day. Let’s go!', phoneExplore: 'Discover Hạ Long Bay', phoneExploreNote: 'Nature, all around you',
  phoneLunch: 'Taste the local flavors', phoneLunchNote: 'A little taste of somewhere new', phoneBudgetSummary: 'Estimated cost', phoneSave: 'Save trip',
  skip: 'Skip to content', nav: 'Main navigation', mobileNav: 'Mobile navigation', menu: 'Open menu',
  navAbout: 'About GoEase', navFeatures: 'Experience', navSteps: 'How it works', navDownload: 'Get the app',
  eyebrow: 'A NEW JOURNEY WITH GOEASE', heroLine1: 'Just go.', heroLine2: 'Your journey,', heroLine3: 'we’ll plan.',
  heroDescription: 'Less time planning. More time enjoying. GoEase is being built around trips that fit your interests, your time and your budget.',
  availableSoon: 'COMING SOON TO', releaseNote: 'In development · For iOS & Android', exploreDesign: 'Discover GoEase',
  halongAlt: 'Illustration of Hạ Long Bay, with limestone islands and boats at sunset', photoSmall: 'GO FURTHER. LIVE FULLER.',
  yourNextTrip: 'YOUR NEXT ADVENTURE', sampleTrip: '3 days · 4 travelers', example: 'EXAMPLE', tripStyle: 'Nature & relaxation', tripStyleNote: 'One journey, your own way', visualCaption: 'It starts with a destination.',
  strip1: 'Explore with ease', strip2: 'Plan smarter', strip3: 'Experience more',
  featureEyebrow: 'LESS WORRY, MORE DISCOVERY', featureTitle1: 'A memorable trip.', featureTitle2: 'Starts with a good plan.',
  featureDescription: 'GoEase is creating a place for your ideas, itinerary and budget — to make getting ready for your next trip a little easier.',
  feature1Title: 'Built around your interests', feature1Body: 'Nature, culture or food? Start with what you love to shape a journey that feels like you.', feature1Tag: 'Make your trip your own',
  feature2Title: 'An itinerary you can follow', feature2Body: 'Organize activities by day, view places on a map and adjust your plans whenever inspiration strikes.', feature2Tag: 'Take each day your way',
  feature3Title: 'Keep your budget in sight', feature3Body: 'Estimate costs for each activity and the whole trip. Know what you plan to spend, so you can enjoy more comfortably.', feature3Tag: 'Keep track of travel costs',
  developmentCaption: 'These experiences describe features currently planned for development.',
  showcaseEyebrow: 'A GLIMPSE OF GOEASE', showcaseTitle1: 'Inspiration in your hands.', showcaseTitle2: 'Adventure up ahead.', designPreview: 'DESIGN REFERENCE',
  showcaseBody: 'From your first idea to a clear itinerary. This is a glimpse of the GoEase experience we are working toward.',
  previewAlt: 'GoEase design reference showing the home screen, trip creation and Hạ Long – Cát Bà itinerary', imageCaption: 'Illustrative design reference. The interface and features may change before release.',
  stepsEyebrow: 'FROM “LET’S GO” TO “READY TO GO”', stepsTitle1: 'Your next adventure.', stepsTitle2: 'A simpler beginning.',
  stepsDescription: 'A planned experience designed to help you spend less time preparing and more time exploring.',
  step1Title: 'Tell us about your trip', step1Body: 'Choose your destination, dates, number of travelers, budget and the experiences you love.',
  step2Title: 'Make the plan your own', step2Body: 'Browse your day-by-day itinerary, adjust activities and balance costs around your needs.',
  step3Title: 'Save it and get ready', step3Body: 'Keep your travel plan to revisit. Take your inspiration with you and begin your journey.',
  downloadEyebrow: 'SEE YOU ON YOUR NEXT ADVENTURE', downloadBody: 'One little app. A world of adventures.\nGoEase is getting ready for its first release.', downloadNote: 'Downloads are not open yet. We’ll update this page when the app launches.',
  faqEyebrow: 'A FEW THINGS YOU MAY WONDER', faqTitle: 'Before you set off.',
  faq1Question: 'What is GoEase?', faq1Answer: 'GoEase is a travel planning app project, designed around your interests, available time, group size and budget. Our slogan is “Just go. We’ll plan.”.',
  faq2Question: 'Can I download the app now?', faq2Answer: 'GoEase is currently in development. The App Store and Google Play buttons do not have download links yet. Official links will be added here when the app is released.',
  faq3Question: 'Do these images show a finished app?', faq3Answer: 'The images on this website are design references and illustrations. They show our intended GoEase experience; the actual interface and features will evolve during development.',
  footerMessage: 'Go further. Live fuller. With GoEase.', close: 'Close', dialogEyebrow: 'A NEW JOURNEY IS IN THE MAKING', dialogTitle: 'GoEase is coming soon.', dialogConfirm: 'See you soon!',
};
const nodes = [...document.querySelectorAll('[data-i18n], [data-i18n-alt], [data-i18n-aria], [data-i18n-title]')];
const vi = {};
for (const node of nodes) {
  if (node.dataset.i18n) vi[node.dataset.i18n] = node.textContent;
  if (node.dataset.i18nAlt) vi[node.dataset.i18nAlt] = node.getAttribute('alt');
  if (node.dataset.i18nAria) vi[node.dataset.i18nAria] = node.getAttribute('aria-label');
  if (node.dataset.i18nTitle) vi[node.dataset.i18nTitle] = node.getAttribute('title');
}
vi.downloadBody = 'Một ứng dụng nhỏ. Những hành trình lớn.\nGoEase đang chuẩn bị cho lần ra mắt đầu tiên.';
let language = 'vi';
try { if (localStorage.getItem('goease-language') === 'en') language = 'en'; } catch { /* Language still works without storage. */ }
const languageButton = document.querySelector('#language');
const menuButton = document.querySelector('.menu-button');
const mobileNav = document.querySelector('#mobile-nav');
const dialog = document.querySelector('#download-dialog');
const motionToggle = document.querySelector('.motion-toggle');
let ambientPaused = false;
let selectedPlatform = 'ios';
function dialogDescription() {
  const platform = selectedPlatform === 'ios' ? 'App Store (iOS)' : 'Google Play (Android)';
  document.querySelector('#dialog-description').textContent = language === 'vi'
    ? `GoEase chưa có đường dẫn tải trên ${platform}. Chúng tôi sẽ cập nhật nút tải ngay khi ứng dụng được phát hành.`
    : `GoEase does not have a download link on ${platform} yet. We’ll update the download button as soon as the app is released.`;
}
function setLanguage(next) {
  language = next;
  const messages = language === 'vi' ? vi : en;
  document.documentElement.lang = language;
  for (const node of nodes) {
    if (node.dataset.i18n) node.textContent = messages[node.dataset.i18n];
    if (node.dataset.i18nAlt) node.setAttribute('alt', messages[node.dataset.i18nAlt]);
    if (node.dataset.i18nAria) node.setAttribute('aria-label', messages[node.dataset.i18nAria]);
    if (node.dataset.i18nTitle) node.setAttribute('title', messages[node.dataset.i18nTitle]);
  }
  languageButton.innerHTML = `${language === 'vi' ? 'EN' : 'VI'} <span aria-hidden="true">↗</span>`;
  languageButton.setAttribute('aria-label', language === 'vi' ? 'Switch to English' : 'Chuyển sang tiếng Việt');
  document.querySelector('meta[name="description"]').content = language === 'vi'
    ? 'GoEase — Just go. We’ll plan. Khám phá dự án ứng dụng lập kế hoạch du lịch, lịch trình theo sở thích và quản lý ngân sách chuyến đi.'
    : 'GoEase — Just go. We’ll plan. Discover a travel planning app project built around your interests, itinerary and travel budget.';
  if (menuButton.getAttribute('aria-expanded') === 'true') menuButton.setAttribute('aria-label', language === 'vi' ? 'Đóng menu' : 'Close menu');
  dialogDescription();
  syncMotionToggle();
  try { localStorage.setItem('goease-language', language); } catch { /* No storage required. */ }
}
function syncMotionToggle() {
  motionToggle.textContent = language === 'vi'
    ? (ambientPaused ? 'Tiếp tục chuyển động' : 'Tạm dừng chuyển động')
    : (ambientPaused ? en.resumeMotion : en.pauseMotion);
  motionToggle.setAttribute('aria-pressed', String(ambientPaused));
}
motionToggle.hidden = false;
motionToggle.addEventListener('click', () => {
  ambientPaused = !ambientPaused;
  document.querySelector('.download-panel').classList.toggle('motion-paused', ambientPaused);
  syncMotionToggle();
});
languageButton.addEventListener('click', () => setLanguage(language === 'vi' ? 'en' : 'vi'));
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', language === 'vi' ? (open ? 'Đóng menu' : 'Mở menu') : (open ? 'Close menu' : 'Open menu'));
  mobileNav.hidden = !open;
});
mobileNav.addEventListener('click', event => {
  if (event.target.closest('a')) {
    mobileNav.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', language === 'vi' ? 'Mở menu' : 'Open menu');
  }
});
document.querySelectorAll('[data-platform]').forEach(button => {
  button.addEventListener('click', () => {
    selectedPlatform = button.dataset.platform;
    if (downloadLinks[selectedPlatform]) { window.location.assign(downloadLinks[selectedPlatform]); return; }
    dialogDescription();
    dialog.showModal();
  });
});
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
document.querySelector('.dialog-confirm').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const bounds = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
});
setLanguage(language);

// Reveal each section once. Native scrolling stays in control of the browser.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
if (!motionPreference.matches && 'IntersectionObserver' in window) {
  const revealTargets = [...document.querySelectorAll(
    '.section-intro, .feature, .showcase-top, .download-panel, .faq > div, .about-copy, .social-preview'
  )];
  const revealObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });
  for (const element of revealTargets) {
    if (element.getBoundingClientRect().top < window.innerHeight) continue;
    element.classList.add('reveal');
    if (element.matches('.feature, .steps-grid article')) {
      const order = [...element.parentElement.children].indexOf(element);
      element.style.setProperty('--reveal-delay', `${Math.min(order, 2) * 60}ms`);
    }
    revealObserver.observe(element);
  }
  // Keyboard navigation must never land on hidden content.
  document.addEventListener('focusin', event => {
    const section = event.target.closest('.reveal');
    if (section) {
      section.classList.add('is-visible');
      revealObserver.unobserve(section);
    }
  });
  motionPreference.addEventListener('change', event => {
    if (!event.matches) return;
    revealObserver.disconnect();
    revealTargets.forEach(element => element.classList.add('is-visible'));
  });
}

const phoneShowcase = document.querySelector('.app-preview');
const journeyBoard = document.querySelector('.journey-board');
const downloadPanel = document.querySelector('.download-panel');
const travelSections = [phoneShowcase, journeyBoard, downloadPanel];
if ('IntersectionObserver' in window && !motionPreference.matches) {
  phoneShowcase.classList.add('motion-phones');
  journeyBoard.classList.add('motion-journey');
  const travelObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const element = entry.target;
      if (element === phoneShowcase) {
        if (entry.isIntersecting) element.classList.add('phones-open');
        else if (element.getBoundingClientRect().top > window.innerHeight) element.classList.remove('phones-open');
      }
      if (element === journeyBoard && entry.isIntersecting) element.classList.add('journey-active');
      if (element === downloadPanel) element.classList.toggle('ambient-active', entry.isIntersecting);
    }
  }, { threshold: .16 });
  travelSections.forEach(element => travelObserver.observe(element));
  motionPreference.addEventListener('change', event => {
    if (event.matches) {
      travelObserver.disconnect();
      phoneShowcase.classList.remove('motion-phones');
      journeyBoard.classList.remove('motion-journey');
      downloadPanel.classList.remove('ambient-active');
    }
  });
}
// Set the paper plane's travel distance on resize, never on every scroll frame.
const track = document.querySelector('.journey-track');
const updateRoute = () => journeyBoard.style.setProperty('--route-distance', `${Math.max(0, track.clientWidth - 28)}px`);
updateRoute();
if ('ResizeObserver' in window) new ResizeObserver(updateRoute).observe(track);
const updatePhoneScale = () => phoneShowcase.style.setProperty('--phone-scale', String(Math.min(.72, (phoneShowcase.clientWidth - 18) / (242 * 3))));
updatePhoneScale();
if ('ResizeObserver' in window) new ResizeObserver(updatePhoneScale).observe(phoneShowcase);

const facebookFrame = document.querySelector('[data-facebook-src]');
function loadFacebookPreview() {
  const url = new URL(facebookFrame.dataset.facebookSrc);
  url.searchParams.set('width', String(Math.min(340, Math.max(180, facebookFrame.parentElement.clientWidth))));
  facebookFrame.src = url.toString();
}
if ('IntersectionObserver' in window) {
  const socialObserver = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      loadFacebookPreview();
      socialObserver.disconnect();
    }
  }, { rootMargin: '150px' });
  socialObserver.observe(facebookFrame);
} else loadFacebookPreview();
