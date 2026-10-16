import { shouldAutoplay, nextAvailableIndex } from './motion-state.js?v=20261016-release1';

const gallery = document.querySelector('.download-photo');
const frames = [...gallery.querySelectorAll('.download-frame')];
const buttons = [...gallery.querySelectorAll('[data-gallery-slide]')];
// Depth layout adapted from React Bits DepthCarousel, David Haz.
// Original license: vendor/react-bits-LICENSE.md. Native rAF replaces GSAP.
let position=0, animation=0, drag=null;
frames.forEach(frame=>{
 const caption=document.createElement('span');caption.className='depth-card-caption';
 const label=document.createElement('small');label.textContent='GOEASE / VIỆT NAM';
 const name=document.createElement('span');name.textContent=frame.dataset.name;
 caption.append(label,name);frame.append(caption);
 frame.querySelector('img').loading='eager';
});
function layout(pos){
 const spread=gallery.clientWidth*.115, depth=150;
 frames.forEach((frame,i)=>{
  let d=((i-pos)%frames.length+frames.length)%frames.length;
  if(d>frames.length/2)d-=frames.length;
  const back=Math.max(0,d);
  frame.style.transform=`translate(-50%,-50%) translateX(${spread*d}px) translateZ(${-depth*d}px) rotateY(${22*Math.min(1,back)}deg)`;
  frame.style.opacity=String(d<0?Math.max(0,1+d):1);
  frame.style.filter=`brightness(${Math.max(.35,1-back*.18)})`;
  frame.style.zIndex=String(Math.round(2000-d*20));
 });
}
function tweenTo(index){
 cancelAnimationFrame(animation);
 let delta=index-position;delta-=Math.round(delta/frames.length)*frames.length;
 const from=position,to=position+delta,start=performance.now();
 function tick(now){
  const t=state.reduced||state.paused?1:Math.min(1,(now-start)/850);
  position=from+(to-from)*(1-Math.pow(1-t,4));layout(position);
  if(t<1)animation=requestAnimationFrame(tick);
  else{position=index;layout(position);finish();}
 }
 animation=requestAnimationFrame(tick);
}
new ResizeObserver(()=>layout(position)).observe(gallery);
gallery.tabIndex=0;
gallery.addEventListener('keydown',event=>{
 if(event.target!==gallery||!['ArrowLeft','ArrowRight'].includes(event.key))return;
 event.preventDefault();change((current+(event.key==='ArrowRight'?1:frames.length-1))%frames.length,true);
});
gallery.addEventListener('pointerdown',event=>{
 if(event.target.closest('button')||state.busy)return;
 drag={x:event.clientX,pos:position,id:event.pointerId,moved:false};
});
gallery.addEventListener('pointermove',event=>{
 if(!drag)return;
 const dx=event.clientX-drag.x;
 if(Math.abs(dx)<6&&!drag.moved)return;
 drag.moved=true;gallery.setPointerCapture(event.pointerId);clearTimeout(timer);
 position=drag.pos-dx/(gallery.clientWidth*.55);layout(position);
});
function endDrag(){
 if(!drag)return;
 const moved=drag.moved;drag=null;
 if(moved){const target=((Math.round(position)%frames.length)+frames.length)%frames.length;if(target===current){state.busy=true;tweenTo(current);}else change(target,true);}
}
gallery.addEventListener('pointerup',endDrag);gallery.addEventListener('pointercancel',endDrag);
gallery.addEventListener('dragstart',event=>event.preventDefault());
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const state = { paused:document.documentElement.classList.contains('motion-stopped'), reduced:reduced.matches, hidden:document.hidden, hovered:false, focused:false, modalOpen:false, busy:false, inViewport:false };
const failed = new Set();
let current = 0, timer, fadeTimer, queued = null, alive = true, lastChange = Date.now();

function schedule() {
  clearTimeout(timer);
  gallery.classList.toggle('gallery-paused', !shouldAutoplay({...state,busy:false}));
  if (alive && !drag && shouldAutoplay(state) && failed.size < frames.length - 1) timer = setTimeout(() => change(nextAvailableIndex(current,1,frames.length,failed)),Math.max(300,4000-(Date.now()-lastChange)));
}
function finish() {
  frames.forEach(frame => frame.classList.remove('is-outgoing'));
  state.busy = false;
  gallery.removeAttribute('aria-busy');
  if (queued !== null) { const target = queued; queued = null; change(target,true); }
  else schedule();
}
async function change(index, manual=false) {
  if (index < 0 || index === current || !alive) return;
  if (state.busy) { if (manual) queued=index; return; }
  clearTimeout(timer);
  state.busy=true;
  gallery.setAttribute('aria-busy','true');
  let decodeTimer;
  try {
    const image=frames[index].querySelector('img');
    image.loading='eager';
    await Promise.race([image.decode(),new Promise((_,reject)=>{decodeTimer=setTimeout(()=>reject(new Error('Image timeout')),10000);})]);
    if (!alive || (!manual && !shouldAutoplay({...state,busy:false}))) { finish(); return; }
    frames[current].classList.add('is-outgoing');
    frames[current].classList.remove('is-active');
    frames[current].setAttribute('aria-hidden','true');
    frames[index].classList.remove('is-outgoing');
    frames[index].classList.add('is-active');
    frames[index].removeAttribute('aria-hidden');
    current=index;
    lastChange=Date.now();
    gallery.dataset.galleryIndex=String(index);
    gallery.querySelector('.download-location-name').textContent=frames[index].dataset.name;
    buttons.forEach((button,i)=>i===index ? button.setAttribute('aria-current','true') : button.removeAttribute('aria-current'));
    tweenTo(index);
  } catch {
    failed.add(index);
    finish();
  } finally { clearTimeout(decodeTimer); }
}
buttons.forEach((button,index)=>button.addEventListener('click',()=>change(index,true)));
gallery.addEventListener('focusin',()=>{state.focused=true;schedule();});
gallery.addEventListener('focusout',()=>queueMicrotask(()=>{state.focused=gallery.contains(document.activeElement);schedule();}));
window.addEventListener('goease:motionchange',event=>{Object.assign(state,event.detail);schedule();});
document.addEventListener('visibilitychange',()=>{state.hidden=document.hidden;schedule();});
reduced.addEventListener('change',event=>{state.reduced=event.matches;schedule();});
const observer=new IntersectionObserver(([entry])=>{state.inViewport=entry.isIntersecting;lastChange=Date.now();schedule();},{threshold:.15});
observer.observe(gallery);
window.addEventListener('pagehide',()=>{alive=false;clearTimeout(timer);clearTimeout(fadeTimer);cancelAnimationFrame(animation);});
window.addEventListener('pageshow',()=>{alive=true;state.hidden=document.hidden;finish();});
gallery.dataset.galleryIndex='0';
schedule();

const backTop=document.querySelector('.back-to-top');
const topObserver=new IntersectionObserver(([entry])=>{backTop.classList.toggle('is-visible',!entry.isIntersecting);backTop.inert=entry.isIntersecting;},{threshold:0});
topObserver.observe(document.querySelector('#ve-goease'));
