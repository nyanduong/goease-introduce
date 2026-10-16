// Lightweight, interruptible selection motion for the opaque paper header.
const nav=document.querySelector('.desktop-nav');
const links=[...nav.querySelectorAll('a')];
const header=document.querySelector('.header');
const marker=document.createElement('span');
marker.className='header-nav-indicator';marker.setAttribute('aria-hidden','true');nav.prepend(marker);
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const stopped=()=>reduced.matches||document.documentElement.classList.contains('motion-stopped')||document.hidden;
let selected=-1,ready=false,clickUntil=0,clickTimer,scrollFrame=0;
function place(index,snap=false){
  selected=index;
  links.forEach((link,i)=>link.toggleAttribute('data-header-selected',i===index));
  const item=links[index];
  if(!item){marker.style.opacity='0';return;}
  const instant=snap||stopped()||!ready;
  if(instant)marker.style.transition='none';
  marker.style.transform=`translate3d(${item.offsetLeft}px,${item.offsetTop}px,0)`;
  marker.style.width=`${item.offsetWidth}px`;marker.style.height=`${item.offsetHeight}px`;
  if(instant){void marker.offsetWidth;marker.style.transition='';}
  marker.style.opacity='1';ready=true;
}
function sync(){
  if(performance.now()<clickUntil)return;
  place(links.findIndex(link=>link.hasAttribute('aria-current')));
}
links.forEach((link,index)=>link.addEventListener('click',()=>{
  clickUntil=performance.now()+1100;place(index);
  clearTimeout(clickTimer);clickTimer=setTimeout(sync,1120);
}));
nav.addEventListener('keydown',event=>{
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  const index=links.indexOf(document.activeElement);if(index<0)return;
  event.preventDefault();
  const next=event.key==='Home'?0:event.key==='End'?links.length-1:(index+(event.key==='ArrowRight'?1:links.length-1))%links.length;
  links[next].focus({preventScroll:true});
});
new MutationObserver(sync).observe(nav,{subtree:true,attributes:true,attributeFilter:['aria-current']});
new ResizeObserver(()=>place(selected,true)).observe(nav);
window.addEventListener('goease:languagechange',()=>place(selected,true));
window.addEventListener('goease:motionchange',()=>{if(stopped())place(selected,true);});
reduced.addEventListener('change',()=>place(selected,true));
document.fonts.ready.then(()=>place(selected,true));
window.addEventListener('scroll',()=>{
  if(!scrollFrame)scrollFrame=requestAnimationFrame(()=>{scrollFrame=0;header.classList.toggle('is-scrolled',scrollY>24);});
},{passive:true});
window.addEventListener('pagehide',()=>{cancelAnimationFrame(scrollFrame);clearTimeout(clickTimer);});
sync();header.classList.toggle('is-scrolled',scrollY>24);
