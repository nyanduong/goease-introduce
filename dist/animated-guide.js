// Selection spring adapted from David Haz / React Bits AnimatedList.
// Original source and MIT + Commons Clause: vendor/react-bits-LICENSE.md.
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const stopped=()=>reduced.matches||document.documentElement.classList.contains('motion-stopped');
const entrances=new Set();
function settleEntrances(){if(stopped())for(const animation of entrances)animation.finish();}
window.addEventListener('goease:motionchange',settleEntrances);
reduced.addEventListener('change',settleEntrances);
function mountSelection(root,selector,attribute){
  const items=[...root.querySelectorAll(selector)];
  const marker=document.createElement('span');marker.className='selection-glider';marker.setAttribute('aria-hidden','true');root.prepend(marker);
  const motion={value:[0,0,0,0],velocity:[0,0,0,0],target:[0,0,0,0],ready:false};
  let raf=0,last=0;
  const write=()=>{
    const [x,y,w,h]=motion.value;marker.style.transform=`translate3d(${x}px,${y}px,0)`;
    marker.style.width=`${w}px`;marker.style.height=`${h}px`;
  };
  function frame(now){
    raf=0;
    const dt=Math.min(.05,(now-last)/1000||0);last=now;
    const steps=Math.max(1,Math.ceil(dt/(1/240))),h=dt/steps,omega=30,zeta=.78;
    for(let i=0;i<steps;i++)for(let j=0;j<4;j++){
      motion.velocity[j]+=(omega*omega*(motion.target[j]-motion.value[j])-2*zeta*omega*motion.velocity[j])*h;
      motion.value[j]+=motion.velocity[j]*h;
    }
    const moving=motion.value.some((v,j)=>Math.abs(v-motion.target[j])>.05||Math.abs(motion.velocity[j])>.5);
    if(!moving||stopped()){motion.value=[...motion.target];motion.velocity.fill(0);}
    write();if(moving&&!stopped())raf=requestAnimationFrame(frame);
  }
  function place(snap=false){
    const item=items.find(e=>e.getAttribute(attribute)==='true');if(!item)return;
    motion.target=[item.offsetLeft,item.offsetTop,item.offsetWidth,item.offsetHeight];
    if(snap||stopped()||!motion.ready){motion.value=[...motion.target];motion.velocity.fill(0);motion.ready=true;write();}
    else if(!raf){last=performance.now();raf=requestAnimationFrame(frame);}
  }
  new MutationObserver(()=>place()).observe(root,{subtree:true,attributes:true,attributeFilter:[attribute]});
  new ResizeObserver(()=>place(true)).observe(root);
  window.addEventListener('goease:motionchange',()=>place(true));reduced.addEventListener('change',()=>place(true));
  document.fonts.ready.then(()=>place(true));place(true);
  const observer=new IntersectionObserver(([entry])=>{
    if(!entry.isIntersecting)return;
    observer.disconnect();
    if(!stopped())items.forEach((item,i)=>{
      const animation=item.animate([{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'translateY(0)'}],{duration:620,delay:i*75,easing:'cubic-bezier(.22,1,.36,1)'});
      entrances.add(animation);animation.finished.then(()=>entrances.delete(animation),()=>entrances.delete(animation));
    });
  },{threshold:.25});observer.observe(root);
}
mountSelection(document.querySelector('.guide-tabs'),'.guide-tab','aria-selected');
mountSelection(document.querySelector('.story-steps'),'button','aria-pressed');

// Incoming views retain their native tab semantics and full screen dimensions.
const stage=document.querySelector('.product-stage');
let incoming;
window.addEventListener('goease:motionchange',()=>{if(stopped())incoming?.finish();});
reduced.addEventListener('change',()=>{if(stopped())incoming?.finish();});
new MutationObserver(()=>{
  const panel=stage.querySelector('.phone-screen:not([hidden])');
  if(!panel||stopped())return;
  incoming?.cancel();
  incoming=panel.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:460,easing:'cubic-bezier(.22,1,.36,1)'});
}).observe(stage,{attributes:true,attributeFilter:['data-step']});
