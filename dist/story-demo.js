// A deterministic illustration, using sample data only. No AI or pricing request.
import { shouldAutoplay } from "./motion-state.js?v=20261016-release1";

const demo = document.querySelector(".story-demo");
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const scenes = {
  vi: [
    [
      "Sở thích của bạn",
      "Thử một chuyến Hội An: 3 ngày, 4 người. Bạn chọn ẩm thực và văn hóa nhé.",
      "Đang chọn sở thích",
    ],
    [
      "Một ngày mẫu",
      "Phố cổ buổi sáng, món ngon buổi trưa, sông Hoài lúc chiều. Một ngày mẫu dần hiện ra.",
      "Đang phác thảo một ngày",
    ],
    [
      "Ngân sách rõ ràng",
      "Dự toán mẫu 8,2 triệu cho nhóm, còn 1,8 triệu dự phòng. Đây chưa phải báo giá.",
      "Đang minh họa dự toán",
    ],
  ],
  en: [
    [
      "Your interests",
      "Imagine 3 days in Hội An with 4 friends. Let’s choose food and culture.",
      "Choosing interests",
    ],
    [
      "A sample day",
      "Old-town walks, local flavors, then an evening by the Hoài river. A sample day takes shape.",
      "Sketching a day",
    ],
    [
      "A clear budget",
      "A sample estimate of 8.2 million VND leaves 1.8 million in reserve. This is not a quote.",
      "Illustrating the costs",
    ],
  ],
};
const labels = {
  vi: {
    previous: "Bước trước",
    next: "Bước tiếp theo",
    navigation: "Chuyển bước mô phỏng",
    walk: "Dạo phố cổ",
    walkNote: "Một buổi sáng thật chậm",
    lunch: "Thử món ngon địa phương",
    lunchNote: "Có chỗ cho những hương vị mới",
    river: "Ngắm chiều bên sông Hoài",
    riverNote: "Khoảng nghỉ dành riêng cho bạn",
    pause: "Ⅱ Tạm dừng demo",
    play: "▷ Chạy demo",
    stopped: "Đã dừng chuyển động",
  },
  en: {
    previous: "Previous step",
    next: "Next step",
    navigation: "Preview steps",
    walk: "Walk through the old town",
    walkNote: "A wonderfully slow morning",
    lunch: "Try the local flavors",
    lunchNote: "Room for something new",
    river: "An evening by the Hoài river",
    riverNote: "A little time just for you",
    pause: "Ⅱ Pause demo",
    play: "▷ Play demo",
    stopped: "Motion is paused",
  },
};
const views = [...demo.querySelectorAll("[data-story-view]")];
const steps = [...demo.querySelectorAll("[data-story-step]")];
const title = demo.querySelector(".story-title");
const typed = demo.querySelector(".story-typed");
const readable = demo.querySelector(".story-readable");
const status = demo.querySelector(".story-screen-status");
const counters = [...demo.querySelectorAll(".story-counter")];
const progress = demo.querySelector(".story-progress span");
const play = demo.querySelector(".story-play");
const state = {
  paused:
    document.querySelector(".motion-control").getAttribute("aria-pressed") ===
    "true",
  reduced: reduced.matches,
  hidden: document.hidden,
  modalOpen: document.querySelector("dialog").open,
  inViewport: false,
};
const duration = 9500;
let current = 0;
let elapsed = 0;
let playing = true;
let manual = false;
let frame = null;
let previousTime = null;
let renderedCount = -1;
const language = () => (document.documentElement.lang === "en" ? "en" : "vi");
const fullScene = () => manual || state.reduced;

function renderFrame() {
  const text = scenes[language()][current][1];
  const count = fullScene()
    ? text.length
    : Math.min(text.length, Math.floor(elapsed / 28));
  if (count !== renderedCount) {
    typed.textContent = text.slice(0, count);
    renderedCount = count;
  }
  const phase = fullScene() ? 4 : Math.min(4, Math.floor(elapsed / 1050));
  for (const item of views[current].querySelectorAll("[data-story-reveal]"))
    item.classList.toggle(
      "is-revealed",
      Number(item.dataset.storyReveal) <= phase,
    );
  progress.style.transform = `scaleX(${fullScene() ? 1 : Math.min(1, elapsed / duration)})`;
  demo.classList.toggle(
    "story-typing",
    count < text.length && shouldAutoplay(state) && playing,
  );
}
function renderScene() {
  const [heading, text, caption] = scenes[language()][current];
  demo.querySelector('.story-screen-nav').setAttribute('aria-label',labels[language()].navigation);
  demo.querySelector('[data-story-direction="-1"]').setAttribute('aria-label',labels[language()].previous);
  demo.querySelector('[data-story-direction="1"]').setAttribute('aria-label',labels[language()].next);
  title.textContent = heading;
  readable.textContent = text;
  status.textContent = caption;
  counters.forEach((node) => (node.textContent = `0${current + 1} / 03`));
  steps.forEach((button, index) =>
    button.setAttribute("aria-pressed", String(index === current)),
  );
  views.forEach((view, index) => (view.hidden = index !== current));
  demo
    .querySelectorAll("[data-story-label]")
    .forEach(
      (node) =>
        (node.textContent = labels[language()][node.dataset.storyLabel]),
    );
  demo.dataset.storyScene=String(current);
  if(!state.reduced&&!state.paused){
    for(const node of [title,typed,views[current]]){
      node.getAnimations().forEach(animation=>animation.cancel());
      node.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:500,easing:'cubic-bezier(.22,1,.36,1)'});
    }
  }
  renderedCount = -1;
  renderFrame();
}
function tick(time) {
  frame = null;
  if (!playing || !shouldAutoplay(state)) return;
  if (previousTime !== null) elapsed += Math.min(120, time - previousTime);
  previousTime = time;
  if (elapsed >= duration) {
    elapsed = 0;
    current = (current + 1) % views.length;
    renderScene();
  } else renderFrame();
  frame = requestAnimationFrame(tick);
}
function synchronize() {
  if (frame !== null) cancelAnimationFrame(frame);
  frame = null;
  previousTime = null;
  const stopped = state.paused || state.reduced;
  play.disabled = stopped;
  play.textContent =
    labels[language()][stopped ? "stopped" : playing ? "pause" : "play"];
  play.setAttribute("aria-pressed", String(playing));
  demo.classList.toggle("story-paused", !playing || !shouldAutoplay(state));
  renderFrame();
  if (playing && shouldAutoplay(state)) frame = requestAnimationFrame(tick);
}
function selectScene(index) {
  current = (index + views.length) % views.length;
  elapsed = 0;
  playing = false; // Both control groups keep manual reading on the chosen step.
  manual = true;
  renderScene();
  synchronize();
}
steps.forEach((button,index)=>button.addEventListener('click',()=>selectScene(index)));
demo.querySelectorAll('[data-story-direction]').forEach(button=>button.addEventListener('click',()=>selectScene(current+Number(button.dataset.storyDirection))));
play.addEventListener("click", () => {
  playing = !playing;
  if (playing && manual) elapsed = 0;
  manual = false;
  synchronize();
});
demo.querySelector(".story-replay").addEventListener("click", () => {
  current = 0;
  elapsed = 0;
  playing = true;
  manual = false;
  renderScene();
  synchronize();
});
window.addEventListener("goease:motionchange", (event) => {
  Object.assign(state, event.detail);
  synchronize();
});
window.addEventListener("goease:languagechange", () => {
  renderScene();
  synchronize();
});
document.addEventListener("visibilitychange", () => {
  state.hidden = document.hidden;
  synchronize();
});
reduced.addEventListener("change", (event) => {
  state.reduced = event.matches;
  synchronize();
});
let observer;
if ("IntersectionObserver" in window) {
  observer = new IntersectionObserver(
    ([entry]) => {
      state.inViewport = entry.isIntersecting;
      synchronize();
    },
    { threshold: 0.1 },
  );
  observer.observe(demo);
} else state.inViewport = true;
window.addEventListener("pagehide", (event) => {
  state.hidden = true;
  synchronize();
  if (!event.persisted) observer?.disconnect();
});
window.addEventListener("pageshow", () => {
  state.hidden = document.hidden;
  synchronize();
});
demo.classList.add("story-ready");
renderScene();
synchronize();
