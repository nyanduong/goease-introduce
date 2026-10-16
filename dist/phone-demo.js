// Local, deterministic product simulation. No AI requests or live quotes.
export function createPhoneDemo({navigate, getLanguage}) {
  const phone=document.querySelector('.app-phone');
  const create=phone.querySelector('.app-create');
  const itinerary=phone.querySelector('.app-itinerary');
  const budget=phone.querySelector('.app-budget');
  const t=(vi,en)=>getLanguage()==='vi'?vi:en;
  const money=n=>Math.round(n).toLocaleString('vi-VN')+'đ';
  const destinations=[
    ['Hạ Long, Quảng Ninh','Hạ Long – Cát Bà','ha-long-480.webp',['Khám phá vịnh Hạ Long','Chèo kayak ở Cát Bà','Dạo biển trước khi về'],['Explore Ha Long Bay','Kayak in Cat Ba','A morning by the sea']],
    ['Hội An, Quảng Nam','Hội An','hoi-an-480.webp',['Dạo phố cổ Hội An','Khám phá làng gốm','Ngắm sông Hoài buổi sáng'],['Walk the Ancient Town','Visit a pottery village','A morning by the Hoai River']],
    ['Sa Pa, Lào Cai','Sa Pa','sa-pa-480.webp',['Đi giữa ruộng bậc thang','Khám phá bản làng','Ngắm núi buổi sáng'],['Walk the rice terraces','Explore a local village','A morning in the mountains']],
    ['Đà Lạt, Lâm Đồng','Đà Lạt','da-lat-480.webp',['Dạo quanh hồ Xuân Hương','Khám phá đồi thông','Cà phê trước khi về'],['Walk around Xuan Huong Lake','Explore the pine hills','Coffee before heading home']]
  ];
  const state={destination:0,start:'2026-11-12',days:3,people:4,limit:10000000,interests:new Set([0]),costs:[2400000,3000000,1600000,1200000]};
  const initialCosts=[...state.costs];
  let activeTab='itinerary',saved=false,returnFocus=null;
  try {
    const stored=JSON.parse(localStorage.getItem('goease-trip-demo'));
    if(stored&&Number.isInteger(stored.destination)&&destinations[stored.destination]&&/^\d{4}-\d{2}-\d{2}$/.test(stored.start)&&[2,3,4,5].includes(stored.days)&&Number.isInteger(stored.people)&&stored.people>=1&&stored.people<=8&&[3000000,5000000,10000000,15000000,20000000].includes(stored.limit)&&Array.isArray(stored.costs)&&stored.costs.length===4&&stored.costs.every(n=>Number.isFinite(n)&&n>=0&&n<=100000000)&&Array.isArray(stored.interests)){
      Object.assign(state,{destination:stored.destination,start:stored.start,days:stored.days,people:stored.people,limit:stored.limit,costs:stored.costs,interests:new Set(stored.interests.filter(n=>Number.isInteger(n)&&n>=0&&n<6))});saved=true;
    }
  } catch { /* Optional browser storage. */ }
  const total=()=>state.costs.reduce((a,b)=>a+b,0);
  const fieldNames=[['Điểm đến','Destination'],['Thời gian','Dates'],['Số lượng người','Travelers'],['Ngân sách','Budget']];
  const fields=[...create.querySelectorAll('.app-field')];
  fields.forEach((field,index)=>{
    const content=field.querySelector('div');
    const button=document.createElement('button');button.type='button';button.className='demo-field-button';
    button.append(...content.childNodes);content.replaceWith(button);
    button.addEventListener('click',()=>edit(index,button));
  });
  const interests=[...create.querySelectorAll('.app-interest-grid>span')].map((span,index)=>{
    const button=document.createElement('button');button.type='button';button.className=span.className;button.append(...span.childNodes);span.replaceWith(button);
    button.addEventListener('click',()=>{state.interests.has(index)?state.interests.delete(index):state.interests.add(index);saved=false;sync();});return button;
  });
  const steps=[...create.querySelectorAll('.app-stepper li')].map((li,index)=>{
    const button=document.createElement('button');button.type='button';button.append(...li.childNodes);li.append(button);
    button.addEventListener('click',()=>{
      if(index===3){navigate(1);return;}
      create.querySelectorAll('.app-stepper li').forEach((item,i)=>item.classList.toggle('is-active',i===index));
      if(index===0)edit(0,button);
      if(index===1)interests[0].focus({preventScroll:true});
      if(index===2)edit(3,button);
    });return button;
  });
  const extra=document.createElement('div');extra.className='phone-extra-view';extra.hidden=true;
  itinerary.querySelector('.app-trip-tabs').after(extra);
  const sheets=document.createElement('div');sheets.className='phone-editor';sheets.hidden=true;sheets.setAttribute('role','dialog');sheets.setAttribute('aria-modal','true');sheets.setAttribute('aria-labelledby','phone-editor-title');phone.append(sheets);
  const notice=document.createElement('p');notice.className='phone-demo-notice';notice.setAttribute('role','status');phone.append(notice);
  let noticeTimer;
  function notify(message){notice.textContent=message;notice.classList.add('is-visible');clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>notice.classList.remove('is-visible'),2600);}
  function close(){sheets.hidden=true;document.querySelector('.phone-action-hint').inert=false;phone.querySelector('.phone-status').inert=false;phone.querySelector('.app-topbar').inert=false;phone.querySelectorAll('.phone-screen').forEach(e=>e.inert=false);(returnFocus?.isConnected?returnFocus:phone.querySelector('.phone-back')).focus({preventScroll:true});}
  function open(title,trigger){
    returnFocus=trigger||document.activeElement;sheets.replaceChildren();sheets.hidden=false;
    const header=document.createElement('header'),heading=document.createElement('h3'),back=document.createElement('button');
    heading.id='phone-editor-title';heading.textContent=title;back.type='button';back.className='demo-editor-close';back.textContent='×';back.setAttribute('aria-label',t('Đóng','Close'));back.addEventListener('click',close);header.append(heading,back);sheets.append(header);
    const body=document.createElement('div');body.className='phone-editor-body';sheets.append(body);
    const note=document.createElement('p');note.className='demo-editor-note';note.textContent=t('Bản demo tương tác · Dữ liệu mẫu','Interactive demo · Sample data');body.append(note);
    phone.querySelector('.phone-status').inert=true;phone.querySelector('.app-topbar').inert=true;phone.querySelectorAll('.phone-screen').forEach(e=>e.inert=true);
    document.querySelector('.phone-action-hint').inert=true;
    back.focus({preventScroll:true});return body;
  }
  sheets.addEventListener('keydown',event=>{
    if(event.key==='Escape'){event.stopPropagation();close();}
    if(event.key==='Tab'){
      const nodes=[...sheets.querySelectorAll('button,input,select')].filter(e=>!e.disabled);
      if(event.shiftKey&&document.activeElement===nodes[0]){event.preventDefault();nodes.at(-1).focus();}
      else if(!event.shiftKey&&document.activeElement===nodes.at(-1)){event.preventDefault();nodes[0].focus();}
    }
  });
  function rescaleCosts(){state.costs=initialCosts.map((n,i)=>Math.round(n*(state.people/4)*(i===0?1:state.days/3)/10000)*10000);}
  function edit(index,trigger){
    const body=open(t(...fieldNames[index]),trigger),form=document.createElement('form');
    const label=document.createElement('label');label.textContent=t(...fieldNames[index]);
    const input=document.createElement(index===1?'input':'select');input.id='phone-demo-value';label.htmlFor=input.id;
    if(index===0)destinations.forEach((d,i)=>input.add(new Option(d[0],i)));
    if(index===1){input.type='date';input.required=true;input.value=state.start;}
    if(index===2)for(let n=1;n<=8;n++)input.add(new Option(t(`${n} người`,`${n} travelers`),n));
    if(index===3)[3000000,5000000,10000000,15000000,20000000].forEach(n=>input.add(new Option(money(n),n)));
    if(index!==1)input.value=String(index===0?state.destination:index===2?state.people:state.limit);
    form.append(label,input);
    let duration;
    if(index===1){const l=document.createElement('label');l.textContent=t('Số ngày','Trip length');l.htmlFor='phone-demo-days';duration=document.createElement('select');duration.id=l.htmlFor;[2,3,4,5].forEach(n=>duration.add(new Option(t(`${n} ngày`,`${n} days`),n)));duration.value=state.days;form.append(l,duration);}
    const save=document.createElement('button');save.type='submit';save.className='app-primary';save.textContent=t('Áp dụng','Apply');form.append(save);body.append(form);
    form.addEventListener('submit',event=>{event.preventDefault();
      if(index===0)state.destination=Number(input.value);
      if(index===1){state.start=input.value;state.days=Number(duration.value);}
      if(index===2)state.people=Number(input.value);
      if(index===3)state.limit=Number(input.value);
      if(index===1||index===2)rescaleCosts();saved=false;sync();close();
    });
  }
  const tabKeys=['itinerary','details','budget','members'];
  phone.querySelectorAll('.app-trip-tabs').forEach(bar=>{
    bar.removeAttribute('aria-hidden');bar.setAttribute('role','group');bar.setAttribute('aria-label','Trip views');
    [...bar.children].forEach((span,i)=>{const button=document.createElement('button');button.type='button';button.dataset.tripView=tabKeys[i];if(span.dataset.i18n)button.dataset.i18n=span.dataset.i18n;button.textContent=span.textContent;span.replaceWith(button);button.addEventListener('click',()=>showTab(tabKeys[i]));});
  });
  function showTab(tab){activeTab=tab;navigate(tab==='budget'?2:1);sync();}
  function renderExtra(){
    extra.replaceChildren();
    const h=document.createElement('h3');h.textContent=activeTab==='members'?t('Nhóm của bạn','Your group'):t('Chuyến đi của bạn','Your trip');extra.append(h);
    const note=document.createElement('p');note.className='demo-editor-note';note.textContent=t('Thông tin minh họa, có thể thay đổi.','Sample information you can change.');extra.append(note);
    if(activeTab==='details'){
      fieldNames.forEach((name,i)=>{const button=document.createElement('button');button.type='button';button.className='demo-detail-row';const label=document.createElement('small');label.textContent=t(...name);const value=document.createElement('strong');value.textContent=fieldValues()[i]+' ›';button.append(label,value);button.addEventListener('click',()=>edit(i,button));extra.append(button);});
      const save=document.createElement('button');save.type='button';save.className='app-primary';save.textContent=saved?t('Đã lưu trên máy này','Saved on this device'):t('Lưu bản demo','Save demo');save.addEventListener('click',()=>{try{localStorage.setItem('goease-trip-demo',JSON.stringify({...state,interests:[...state.interests]}));saved=true;renderExtra();notify(t('Đã lưu bản demo trên trình duyệt này','Demo saved in this browser'));}catch{notify(t('Trình duyệt chưa cho phép lưu','Browser storage is unavailable'));}});extra.append(save);
      const reset=document.createElement('button');reset.type='button';reset.className='demo-reset';reset.textContent=t('Đặt lại dữ liệu mẫu','Reset sample data');reset.addEventListener('click',()=>{Object.assign(state,{destination:0,start:'2026-11-12',days:3,people:4,limit:10000000,interests:new Set([0]),costs:[...initialCosts]});saved=false;try{localStorage.removeItem('goease-trip-demo');}catch{}sync();extra.querySelector('.demo-reset').focus({preventScroll:true});notify(t('Đã khôi phục dữ liệu mẫu','Sample data restored'));});extra.append(reset);
    }else{
      for(let i=0;i<state.people;i++){const row=document.createElement('div');row.className='demo-member-row';row.textContent=(i===0?'◉ ':'○ ')+t(i===0?'Bạn · Trưởng nhóm':`Thành viên ${i+1}`,i===0?'You · Organizer':`Traveler ${i+1}`);extra.append(row);}
      const button=document.createElement('button');button.type='button';button.className='app-primary';button.textContent=t('Thay đổi số người','Change group size');button.addEventListener('click',()=>edit(2,button));extra.append(button);
    }
  }
  function fieldValues(){const date=new Date(state.start+'T12:00:00');return [destinations[state.destination][0],`${date.toLocaleDateString('vi-VN')} · ${state.days} ${t('ngày','days')}`,`${state.people} ${t('người','travelers')}`,money(state.limit)];}
  function syncTimeline(){
    const rows=itinerary.querySelectorAll('.sample-timeline>div');
    const day=Number(dayControls.querySelector('[aria-pressed="true"]')?.dataset.day??dayControls.querySelector('[aria-pressed="true"]')?.dataset.demoDay??0);
    const middle=rows[1];if(middle){middle.querySelector('b').textContent=destinations[state.destination][getLanguage()==='vi'?3:4][day%3];middle.querySelector('small').textContent=t('Khám phá theo sở thích của bạn.','Explore at your own pace.');middle.querySelector('img').src='assets/'+destinations[state.destination][2];}
    if(rows[0]){rows[0].querySelector('b').textContent=t(day===0?'Bắt đầu hành trình':'Một ngày khám phá',day===0?'Start your journey':'A day of discovery');rows[0].querySelector('small').textContent=t('Lịch trình mẫu, bạn có thể tùy chỉnh.','A sample plan you can customize.');}
    if(rows[2])rows[2].querySelector('b').textContent=t('Thưởng thức ẩm thực','Enjoy local food');
    if(state.interests.has(2)&&rows[2])rows[2].querySelector('b').textContent=t('Khám phá ẩm thực địa phương','Discover local flavors');
  }
  const dayControls=itinerary.querySelector('.day-controls');
  function sync(){
    const d=destinations[state.destination],values=fieldValues();
    fields.forEach((field,i)=>{const label=field.querySelector('strong');label.removeAttribute('data-i18n');label.textContent=values[i];field.querySelector('button').setAttribute('aria-label',t('Thay đổi ','Change ')+t(...fieldNames[i])+': '+values[i]);});
    interests.forEach((button,i)=>{button.classList.toggle('is-selected',state.interests.has(i));button.setAttribute('aria-pressed',String(state.interests.has(i)));});
    const chosen=[...state.interests].map(i=>interests[i].textContent.trim());
    create.querySelector('.app-smart-tip p').textContent=chosen.length?t('Đã chọn: ','Selected: ')+chosen.slice(0,2).join(', ')+(chosen.length>2?` +${chosen.length-2}`:''):t('Thử chọn những điều bạn thích.','Choose a few things you enjoy.');
    if(document.querySelector('.product-stage').dataset.step!=='0')phone.querySelector('.phone-view-title').textContent=document.querySelector('.product-stage').dataset.step==='2'?t('Ngân sách','Budget'):d[1];
    itinerary.querySelector('.app-cover img').src='assets/'+d[2];
    itinerary.querySelector('.app-trip-meta').textContent=values[1]+' · '+values[2];budget.querySelector('.app-trip-meta').textContent=d[1]+' · '+values[2];
    itinerary.querySelector('.phone-summary strong').textContent=money(total());
    const amount=budget.querySelector('.app-budget-overview>div:last-child');amount.querySelector('strong').textContent=money(total());amount.querySelector('p').textContent=t(`Cho cả nhóm ${state.people} người`,`For ${state.people} travelers`);
    const percent=Math.round(total()/state.limit*100);budget.querySelector('.app-budget-ring strong').textContent=percent+'%';budget.querySelector('.ring-value').style.strokeDasharray=`${Math.min(100,percent)} 100`;
    const remaining=budget.querySelector('.app-budget-remaining');remaining.classList.toggle('is-over-budget',total()>state.limit);remaining.querySelector('strong').textContent=total()<=state.limit?t('Trong ngân sách','Within budget'):t('Vượt ngân sách mẫu','Above sample budget');remaining.querySelector('p').textContent=t(total()<=state.limit?'Còn ':'Vượt ',total()<=state.limit?'Remaining: ':'Over by: ')+money(Math.abs(state.limit-total()));
    budget.querySelector('.app-split strong').textContent=money(total()/state.people);
    budget.querySelectorAll('.app-cost-list>div').forEach((row,i)=>{row.querySelector('strong').textContent=money(state.costs[i]);row.querySelector('i>span').style.width=(state.costs[i]/Math.max(1,total())*100)+'%';row.setAttribute('aria-label',t('Sửa chi phí: ','Edit cost: ')+row.querySelector('[data-i18n]').textContent);});
    const count=dayControls.children.length;
    if(count!==state.days){dayControls.replaceChildren();for(let i=0;i<state.days;i++){const button=document.createElement('button');button.type='button';button.dataset.demoDay=i;button.textContent=t('Ngày ','Day ')+(i+1);button.setAttribute('aria-pressed',String(i===0));dayControls.append(button);}}
    [...dayControls.children].forEach((button,i)=>{button.textContent=t('Ngày ','Day ')+(i+1);});
    const mapLabels=itinerary.querySelectorAll('.app-mini-map>span');mapLabels[0].textContent=d[1].split(' – ')[0];mapLabels[1].textContent=state.destination===0?'Cát Bà':t('Điểm khám phá','Explore');
    phone.querySelectorAll('[data-trip-view]').forEach(button=>{button.textContent=t(...({itinerary:['Lịch trình','Itinerary'],details:['Chi tiết','Details'],budget:['Ngân sách','Budget'],members:['Thành viên','Members']}[button.dataset.tripView]));const active=button.dataset.tripView===(document.querySelector('.product-stage').dataset.step==='2'?'budget':activeTab==='budget'?'itinerary':activeTab);button.classList.toggle('is-active',active);button.setAttribute('aria-pressed',String(active));});
    const subview=['details','members'].includes(activeTab);extra.hidden=!subview;itinerary.classList.toggle('is-subview',subview);
    [...itinerary.children].filter(el=>el.compareDocumentPosition(extra)&Node.DOCUMENT_POSITION_PRECEDING).forEach(el=>el.hidden=subview);
    if(subview){
      renderExtra();
      document.querySelector('.phone-hint-title').textContent=activeTab==='members'?t('Nhấn để đổi số người','Tap to change group size'):t('Nhấn để lưu bản demo','Tap to save this demo');
    }
    syncTimeline();
  }
  dayControls.addEventListener('click',event=>{const button=event.target.closest('button');if(!button)return;[...dayControls.children].forEach(b=>b.setAttribute('aria-pressed',String(b===button)));syncTimeline();});
  budget.querySelectorAll('.app-cost-list>div').forEach((row,i)=>{
    row.tabIndex=0;row.setAttribute('role','button');
    const editCost=()=>{const body=open(row.querySelector('[data-i18n]').textContent,row),form=document.createElement('form'),label=document.createElement('label'),input=document.createElement('input'),save=document.createElement('button');label.textContent=t('Chi phí mẫu (VND)','Sample cost (VND)');label.htmlFor='phone-demo-cost';input.id=label.htmlFor;input.type='number';input.min='0';input.max='100000000';input.step='10000';input.required=true;input.value=state.costs[i];save.type='submit';save.className='app-primary';save.textContent=t('Áp dụng','Apply');form.append(label,input,save);body.append(form);form.addEventListener('submit',event=>{event.preventDefault();state.costs[i]=Number(input.value);saved=false;sync();close();});};
    row.addEventListener('click',editCost);row.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();editCost();}});
  });
  const map=itinerary.querySelector('.app-mini-map');map.removeAttribute('aria-hidden');map.tabIndex=0;map.setAttribute('role','button');map.setAttribute('aria-label',t('Xem tuyến đường mẫu','View sample route'));
  const showMap=()=>{const body=open(t('Tuyến đường minh họa','Illustrative route'),map);const copy=map.cloneNode(true);copy.removeAttribute('role');copy.removeAttribute('tabindex');copy.removeAttribute('aria-label');body.append(copy);const text=document.createElement('p');text.textContent=t('Sơ đồ minh họa các điểm trong lịch trình. Đây không phải bản đồ chỉ đường trực tiếp.','An illustrative route between itinerary stops, not live navigation.');body.append(text);};map.addEventListener('click',showMap);map.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();showMap();}});
  phone.querySelectorAll('[data-screen-target]').forEach(button=>button.addEventListener('click',()=>{activeTab=Number(button.dataset.screenTarget)===2?'budget':'itinerary';sync();}));
  return {sync, syncTimeline, resetView(){activeTab='itinerary';if(!sheets.hidden)close();sync();}};
}
