// Add official GoEase store URLs here when the app is released.
const downloadLinks = { ios: '', android: '' };
const en = {
  slideshowLabel: 'Vietnam travel inspiration', slidePrevious: 'Previous destination', slideNext: 'Next destination', slideIndicators: 'Choose a destination',
  previewPrevious: 'Previous screen', previewNext: 'Next screen', previewHome: 'Home', previewItinerary: 'Itinerary', previewHint: 'Swipe sideways or use the buttons to explore each screen.',
  facebookLoading: 'Preparing content from Facebook…', facebookFallbackTitle: 'The journey continues on Facebook.', facebookFallbackBody: 'Your browser or Facebook may block this embed. You can still see the latest posts directly on the GoEase page.', facebookRetry: 'Reload Facebook embed', imageCredits: 'Image credits',
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
vi.resumeMotion = 'Tiếp tục chuyển động';
vi.previewItinerary = 'Lịch trình';
