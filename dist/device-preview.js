// Size the complete device, including its bezel, rather than clipping its screen.
const phone=document.querySelector('.app-phone');
const stage=phone.closest('.product-stage');
const holder=document.createElement('div');holder.className='device-holder';phone.before(holder);holder.append(phone);holder.append(stage.querySelector('.phone-action-hint'));
function fitDevice(){
  const mobile=innerWidth<=1200;
  const introHeight=stage.querySelector('.phone-demo-intro')?.offsetHeight||0;
  const available=Math.max(300,Math.min(720,innerHeight-(mobile?250:230)-introHeight-14));
  const scale=Math.min(1,available/phone.offsetHeight,(stage.clientWidth-32)/phone.offsetWidth);
  holder.style.width=`${phone.offsetWidth*scale}px`;holder.style.height=`${phone.offsetHeight*scale}px`;
  phone.style.transform=`scale(${scale})`;
  stage.dataset.deviceHeight=String(Math.round(phone.offsetHeight*scale));
}
new ResizeObserver(fitDevice).observe(phone);
new ResizeObserver(fitDevice).observe(stage);
window.addEventListener('resize',fitDevice);
document.fonts.ready.then(fitDevice);
fitDevice();

const demoIntro=stage.querySelector('.phone-demo-intro');
function updateDemoIntro(language){
  const english=language==='en';
  demoIntro.querySelector('.demo-intro-title').textContent=english?'Try the phone below':'Bạn có thể thao tác trực tiếp trên điện thoại này';
  demoIntro.querySelector('.demo-intro-description').textContent=english?'Tap its fields, buttons and tabs to try the demo.':'Bấm vào các ô, nút và tab để dùng thử bản demo.';
  fitDevice();
}
new ResizeObserver(fitDevice).observe(demoIntro);
window.addEventListener('goease:languagechange',event=>updateDemoIntro(event.detail.language));
updateDemoIntro(document.documentElement.lang);
