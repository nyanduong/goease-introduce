// Accessible page interactions. Product previews are intentionally local illustrations.
const root = document.documentElement;
const dialog = document.querySelector("#download-dialog");
const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
const mobileLayout = matchMedia("(max-width: 700px)");
const menuLayout = matchMedia("(max-width: 860px)");
const languageButton = document.querySelector("#language");
const menuButton = document.querySelector(".menu-button");
const mobileNav = document.querySelector("#mobile-nav");
const motionButton = document.querySelector(".motion-control");
const tabs = [...document.querySelectorAll(".guide-tab")];
const panels = [...document.querySelectorAll(".phone-screen")];
const stage = document.querySelector(".product-stage");
let language = "vi";
try {
  if (localStorage.getItem("goease-language") === "en") language = "en";
} catch {
  /* Storage is optional. */
}
let userPaused = false;
let previewIndex = 0;
let phoneDemo = null;
let dayIndex = 0;
let selectedPlatform = "ios";
let modalTrigger = null;
let closeTimer = null;
let savedScroll = 0;
let savedBodyStyle = null;
let savedRootOverflow = "";
let scrollLocked = false;
const textFor = (key) => (language === "vi" ? vi : en)[key];

function broadcastMotion() {
  const stopped = userPaused || motionPreference.matches;
  root.classList.toggle("motion-stopped", stopped);
  root.classList.toggle("page-hidden", document.hidden);
  motionButton.setAttribute("aria-pressed", String(userPaused));
  const label = textFor(userPaused ? "resumeMotion" : "pauseMotion");
  motionButton.setAttribute("aria-label", label);
  motionButton.title = label;
  motionButton.querySelector(".motion-symbol").textContent = userPaused
    ? "▷"
    : "Ⅱ";
  window.dispatchEvent(
    new CustomEvent("goease:motionchange", {
      detail: {
        paused: userPaused,
        reduced: motionPreference.matches,
        hidden: document.hidden,
        modalOpen: dialog.open,
      },
    }),
  );
}
motionButton.addEventListener("click", () => {
  userPaused = !userPaused;
  broadcastMotion();
});
motionPreference.addEventListener("change", broadcastMotion);
document.addEventListener("visibilitychange", broadcastMotion);

function updateMenuLabel() {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute(
    "aria-label",
    language === "vi"
      ? open
        ? "Đóng menu"
        : "Mở menu"
      : open
        ? "Close menu"
        : "Open menu",
  );
}
function setMenu(open, restore = false) {
  mobileNav.hidden = !open;
  menuButton.setAttribute("aria-expanded", String(open));
  updateMenuLabel();
  if (restore) menuButton.focus({ preventScroll: true });
}
menuButton.addEventListener("click", () => setMenu(mobileNav.hidden));
mobileNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenu(false);
});
document.addEventListener("click", (event) => {
  if (!mobileNav.hidden && !event.target.closest(".header")) setMenu(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !dialog.open && !mobileNav.hidden)
    setMenu(false, true);
});
menuLayout.addEventListener("change", (event) => {
  if (!event.matches) setMenu(false);
});

function updateDialogCopy() {
  const platform =
    selectedPlatform === "ios" ? "App Store · iOS" : "Google Play · Android";
  document.querySelector(".dialog-platform").textContent = platform;
  document.querySelector("#dialog-description").textContent =
    language === "vi"
      ? `GoEase chưa phát hành trên ${platform}. Theo dõi fanpage để biết ngày ra mắt.`
      : `GoEase has not launched on ${platform}. Follow our page for release updates.`;
}
function renderDay() {
  const timeline = document.querySelector(".sample-timeline");
  const rows = sampleDays[dayIndex].map(
    ([time, viTitle, viNote, enTitle, enNote], index) => {
      const row = document.createElement("div");
      const clock = document.createElement("time");
      clock.textContent = time;
      const copy = document.createElement("span");
      const title = document.createElement("b");
      title.textContent = language === "vi" ? viTitle : enTitle;
      const note = document.createElement("small");
      note.textContent = language === "vi" ? viNote : enNote;
      copy.append(title, note);
      const thumbnail = document.createElement('span');
      thumbnail.className = 'app-timeline-thumb';
      if (index === 1) {
        const image = document.createElement('img'); image.src = 'assets/ha-long-480.webp'; image.alt = ''; image.width = 48; image.height = 48;
        thumbnail.append(image);
      } else {
        const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
        svg.classList.add('icon'); svg.setAttribute('aria-hidden','true');
        const thumbnailIcons = [['#app-car', null, '#app-food'], ['#sun', null, '#compass'], ['#app-food', null, '#app-car']];
        const use = document.createElementNS('http://www.w3.org/2000/svg','use'); use.setAttribute('href',thumbnailIcons[dayIndex][index]); svg.append(use); thumbnail.append(svg);
      }
      row.append(clock, thumbnail, copy);
      return row;
    },
  );
  timeline.replaceChildren(...rows);
  phoneDemo?.syncTimeline();
  document
    .querySelectorAll("[data-day]")
    .forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(Number(button.dataset.day) === dayIndex),
      ),
    );
}
function selectPreview(index, focus = false) {
  previewIndex = index;
  tabs.forEach((tab, index) => {
    const selected = index === previewIndex;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    panels[index].hidden = !selected;
  });
  stage.dataset.step = String(index);
  const back=document.querySelector('.phone-back');
  back.disabled=index===0;
  const backLabel=language==='vi'?'Quay lại bước trước':'Back to the previous step';
  back.setAttribute('aria-label',backLabel);back.title=backLabel;
  document.querySelector('.phone-hint-title').textContent=(language==='vi'?['Nhấn để xem lịch trình','Nhấn để xem chi phí','Nhấn để xem lại']:['Tap to see the itinerary','Tap to see the costs','Tap to go back'])[index];
  document.querySelector('.phone-hint-note').textContent=language==='vi'?'Demo tương tác':'Interactive demo';
  document.querySelector('.phone-action-hint').setAttribute('aria-label',language==='vi'?'Thử nhấn nút trong điện thoại':'Try the button in the phone');
  document.querySelector('.phone-view-title').textContent = index === 0 ? textFor('appCreateTrip') : index === 1 ? 'Hạ Long – Cát Bà' : textFor('appBudget');
  document.querySelector(".preview-count").textContent = `0${index + 1} / 03`;
  document.querySelector(".preview-current-label").textContent = textFor(
    `guide${index + 1}`,
  );
  phoneDemo?.sync();
  if (focus) tabs[index].focus({ preventScroll: true });
}
function navigatePhone(index){
  selectPreview(index);
  // Keep focus and the viewport inside the device, rather than jumping to the
  // external guide tabs above it on mobile.
  const target=index>0?document.querySelector('.phone-back'):panels[index].querySelector('.app-primary');
  target.focus({preventScroll:true});
}
document.querySelectorAll('[data-screen-target]').forEach(button=>button.addEventListener('click',()=>navigatePhone(Number(button.dataset.screenTarget))));
document.querySelector('.phone-back').addEventListener('click',()=>{if(previewIndex>0){phoneDemo?.resetView();navigatePhone(previewIndex-1);}});
document.querySelector('.phone-action-hint').addEventListener('click',()=>panels[previewIndex].querySelector('.app-primary').click());

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {phoneDemo?.resetView();selectPreview(index);});
  tab.addEventListener("keydown", (event) => {
    let next;
    if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else if (["ArrowRight", "ArrowDown"].includes(event.key))
      next = (index + 1) % tabs.length;
    else if (["ArrowLeft", "ArrowUp"].includes(event.key))
      next = (index + tabs.length - 1) % tabs.length;
    else return;
    event.preventDefault();
    phoneDemo?.resetView();
    selectPreview(next, true);
  });
});
document.querySelectorAll("[data-day]").forEach((button) =>
  button.addEventListener("click", () => {
    dayIndex = Number(button.dataset.day);
    renderDay();
  }),
);
function updateGuideOrientation() {
  document
    .querySelector(".guide-tabs")
    .setAttribute(
      "aria-orientation",
      "vertical",
    );
}
mobileLayout.addEventListener("change", updateGuideOrientation);

function setLanguage(next) {
  language = next;
  root.lang = next;
  const messages = next === "vi" ? vi : en;
  for (const node of nodes) {
    if (node.dataset.i18n && messages[node.dataset.i18n] !== undefined)
      node.textContent = messages[node.dataset.i18n];
    if (node.dataset.i18nAlt)
      node.setAttribute("alt", messages[node.dataset.i18nAlt]);
    if (node.dataset.i18nAria)
      node.setAttribute("aria-label", messages[node.dataset.i18nAria]);
    if (node.dataset.i18nTitle)
      node.setAttribute("title", messages[node.dataset.i18nTitle]);
  }
  languageButton.textContent = next === "vi" ? "EN" : "VI";
  languageButton.setAttribute(
    "aria-label",
    next === "vi" ? "Switch to English" : "Chuyển sang tiếng Việt",
  );
  document.querySelector("meta[name=description]").content =
    next === "vi"
      ? "GoEase — Just go. We'll plan. Dự án trợ lý lập kế hoạch du lịch Việt Nam theo sở thích, thời gian và ngân sách của bạn."
      : "GoEase — Just go. We'll plan. An AI-assisted travel planning project for Vietnam, built around your interests, time and budget.";
  updateMenuLabel();
  updateDialogCopy();
  selectPreview(previewIndex);
  renderDay();
  broadcastMotion();
  try {
    localStorage.setItem("goease-language", next);
  } catch {
    /* Storage is optional. */
  }
  window.dispatchEvent(
    new CustomEvent("goease:languagechange", { detail: { language: next } }),
  );
}
languageButton.addEventListener("click", () =>
  setLanguage(language === "vi" ? "en" : "vi"),
);

function lockScroll() {
  if (scrollLocked) return;
  savedScroll = window.scrollY;
  savedBodyStyle = document.body.getAttribute("style");
  savedRootOverflow = root.style.overflow;
  const scrollbar = getComputedStyle(root).scrollbarGutter.includes("stable")
    ? 0
    : innerWidth - root.clientWidth;
  root.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
  document.body.style.paddingRight = `${scrollbar}px`;
  root.classList.add("modal-open");
  scrollLocked = true;
}
function unlockScroll() {
  if (!scrollLocked) return;
  if (savedBodyStyle === null) document.body.removeAttribute("style");
  else document.body.setAttribute("style", savedBodyStyle);
  root.style.overflow = savedRootOverflow;
  const previous = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo(0, savedScroll);
  root.style.scrollBehavior = previous;
  root.classList.remove("modal-open");
  scrollLocked = false;
}
function openDialog(button) {
  if (dialog.open) return;
  clearTimeout(closeTimer);
  dialog.classList.remove("is-closing");
  modalTrigger = button;
  updateDialogCopy();
  setMenu(false);
  lockScroll();
  dialog.showModal();
  document.querySelector(".dialog-close").focus({ preventScroll: true });
  broadcastMotion();
}
function closeDialog() {
  if (!dialog.open || dialog.classList.contains("is-closing")) return;
  if (userPaused || motionPreference.matches || document.hidden) {
    dialog.close();
    return;
  }
  // Essential close transitions are allowed even while background motion is stopped.
  dialog.classList.add("is-closing");
  closeTimer = setTimeout(() => {
    if (dialog.open) dialog.close();
  }, 180);
}
document.querySelectorAll("[data-platform]").forEach((button) =>
  button.addEventListener("click", () => {
    selectedPlatform = button.dataset.platform;
    if (downloadLinks[selectedPlatform]) {
      window.location.assign(downloadLinks[selectedPlatform]);
      return;
    }
    openDialog(button);
  }),
);
document.querySelector(".dialog-close").addEventListener("click", closeDialog);
document
  .querySelector(".dialog-confirm")
  .addEventListener("click", closeDialog);
dialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeDialog();
});
dialog.addEventListener("keydown", (event) => {
  if (event.key !== "Tab") return;
  const items = [
    ...dialog.querySelectorAll(
      'button,a[href],[tabindex]:not([tabindex="-1"])',
    ),
  ].filter((item) => !item.disabled && item.getClientRects().length);
  const first = items[0],
    last = items.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});
let pointerOutside = false;
function isOutside(event) {
  const rect = dialog.getBoundingClientRect();
  return (
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom
  );
}
dialog.addEventListener("pointerdown", (event) => {
  pointerOutside = event.target === dialog && isOutside(event);
});
dialog.addEventListener("click", (event) => {
  if (pointerOutside && event.target === dialog && isOutside(event))
    closeDialog();
  pointerOutside = false;
});
dialog.addEventListener("close", () => {
  clearTimeout(closeTimer);
  dialog.classList.remove("is-closing");
  unlockScroll();
  if (modalTrigger?.isConnected) modalTrigger.focus({ preventScroll: true });
  broadcastMotion();
});

// One-time image reveal, section navigation and offscreen route suspension.
const observers = [];
if ("IntersectionObserver" in window) {
  root.classList.add("js-motion");
  const reveal = new IntersectionObserver(
    (entries) => {
      for (const entry of entries)
        if (entry.isIntersecting) {
          entry.target.classList.add("seen");
          reveal.unobserve(entry.target);
        }
    },
    { threshold: 0.08 },
  );
  document
    .querySelectorAll(".reveal-image,.benefit-list")
    .forEach((item) => reveal.observe(item));
  observers.push(reveal);
  const visibility = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) =>
        entry.target.classList.toggle("in-view", entry.isIntersecting),
      ),
    { threshold: 0.05 },
  );
  document
    .querySelectorAll(".ambient-motion")
    .forEach((item) => visibility.observe(item));
  observers.push(visibility);
  const links = [...document.querySelectorAll(".desktop-nav a,#mobile-nav a")];
  const navigation = new IntersectionObserver(
    (entries) => {
      for (const entry of entries)
        if (entry.isIntersecting)
          links.forEach((link) => {
            if (link.hash === "#" + entry.target.id)
              link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
          });
    },
    { rootMargin: "-15% 0px -55% 0px" },
  );
  ["ve-goease", "tinh-nang", "trai-nghiem", "about", "tai-ung-dung"].forEach(
    (id) => navigation.observe(document.getElementById(id)),
  );
  observers.push(navigation);
} else
  document
    .querySelectorAll(".ambient-motion")
    .forEach((item) => item.classList.add("in-view"));

updateGuideOrientation();
setLanguage(language);
broadcastMotion();
window.addEventListener("pagehide", (event) => {
  clearTimeout(closeTimer);
  if (!event.persisted) observers.forEach((observer) => observer.disconnect());
});
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    if (dialog.open && dialog.classList.contains("is-closing")) dialog.close();
  }
  broadcastMotion();
});

import("./phone-demo.js?v=20261016-release1").then(({createPhoneDemo})=>{phoneDemo=createPhoneDemo({navigate:navigatePhone,getLanguage:()=>language});phoneDemo.sync();});
