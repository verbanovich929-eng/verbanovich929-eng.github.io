(() => {
 const root = document.querySelector('#avatar-lab');
 if (!root) return;
 const $ = selector => root.querySelector(selector);
 const tabs = [...root.querySelectorAll('[data-avatar-mode]')];
 const modes = {
  presenter: { kicker:'ИЗ БРИФА — В КАДР',title:'ВАШ СМЫСЛ.<br>ПОНЯТНАЯ ПОДАЧА.',text:'Ведущая, прямой взгляд в камеру и пространство, которое поддерживает тему. Показываем базовый кадр для разговорного ролика: объяснить, представить или рассказать историю.',frame:'ВЕДУЩАЯ. ВАША ИСТОРИЯ.' },
  room: { kicker:'МЕНЯЕМ КОНТЕКСТ',title:'ТА ЖЕ ВЕДУЩАЯ.<br>ДРУГОЕ ПРОСТРАНСТВО.',text:'Из светлого домашнего кабинета — в графитовую подкаст-студию. Сравните два подготовленных кадра: ведущая и композиция сохраняются, окружение меняет настроение.',frame:'ДВЕ КОМНАТЫ. ОДНА ИСТОРИЯ.' },
  identity: { kicker:'ПОДБИРАЕМ ГЕРОЯ',title:'ДРУГОЙ ОБРАЗ.<br>ТОТ ЖЕ СМЫСЛ.',text:'В этой же студии можно представить другую ведущую или мужчину. Выберите образ и сравните его с исходным: меняется внешность, а место и задача остаются.',frame:'ВНЕШНОСТЬ ПОД ВАШУ ЗАДАЧУ.' },
  voice: { kicker:'ГОЛОС И МАНЕРА ПОДАЧИ',title:'ГОЛОС<br>ПОД ВАШУ ИСТОРИЮ.',text:'Подбираем характер голоса под задачу: тембр, темп и интонацию. Можно создать индивидуальный голос или использовать вашу готовую запись для озвучивания аватара.',frame:'ИСТОРИЯ ОБРЕТАЕТ ГОЛОС.' }
 };
 const range = $('#avatar-range');
 let current = 'presenter', person = 'woman', dragging = false;
 const images = {home:'assets/avatar-home.jpg',studio:'assets/avatar-studio.jpg',woman:'assets/avatar-woman.jpg',man:'assets/avatar-man.jpg'};
 const alt = {home:'Ведущая в светлом домашнем кабинете',studio:'Та же ведущая в тёмной подкаст-студии',woman:'Другая ведущая в этой же студии',man:'Мужчина-ведущий в этой же студии'};
 function reveal(value) {
  value = Math.max(0,Math.min(100,Number(value)));
  range.value=value;
  $('#avatar-overlay').style.clipPath=`inset(0 ${100-value}% 0 0)`;
  $('#avatar-divider').style.left=value+'%';
  $('#avatar-range-output').textContent=Math.round(value)+'%';
  range.setAttribute('aria-valuetext',Math.round(value)+'% нового варианта');
 }
 function setImage(element,name) {element.src=images[name];element.alt=alt[name];}
 function updateFrame() {
  const comparison=current==='room'||current==='identity';
  const before=current==='presenter'||current==='room'?'home':'studio';
  const after=current==='identity'?person:'studio';
  setImage($('#avatar-base'),before);setImage($('#avatar-overlay'),after);
  $('#avatar-overlay').hidden=!comparison;$('#avatar-divider').hidden=!comparison;
  $('#avatar-compare-controls').hidden=!comparison;
  $('#avatar-frame').classList.toggle('comparable',comparison);
  $('#avatar-before').textContent=current==='room'?'ДОМАШНЯЯ СТУДИЯ':'ИСХОДНАЯ ВЕДУЩАЯ';
  $('#avatar-after').textContent=current==='room'?'ПОДКАСТ-СТУДИЯ':person==='woman'?'ДРУГАЯ ВЕДУЩАЯ':'МУЖЧИНА-ВЕДУЩИЙ';
  $('#avatar-range-label').textContent=current==='room'?'МЕНЯЕМ КОМНАТУ':'МЕНЯЕМ ВНЕШНОСТЬ';
  range.setAttribute('aria-label',current==='room'?'Сравнить комнаты':'Сравнить внешность ведущих');
  reveal(50);
 }
 function selectMode(mode,focus=false) {
  current=mode;
  tabs.forEach(tab=>{const selected=tab.dataset.avatarMode===mode;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;});
  $('#avatar-panel').setAttribute('aria-labelledby','avtab-'+mode);
  $('#avatar-kicker').textContent=modes[mode].kicker;$('#avatar-title').innerHTML=modes[mode].title;$('#avatar-description').textContent=modes[mode].text;$('#avatar-frame-title').textContent=modes[mode].frame;
  root.querySelectorAll('.avatar-mode-content').forEach(content=>content.hidden=content.id!=='avatar-'+mode+'-notes');
  updateFrame();if(focus)tabs.find(tab=>tab.dataset.avatarMode===mode).focus();
 }
 tabs.forEach((tab,index)=>{
  tab.addEventListener('click',()=>selectMode(tab.dataset.avatarMode));
  tab.addEventListener('keydown',event=>{
   let next;if(['ArrowRight','ArrowDown'].includes(event.key))next=(index+1)%tabs.length;if(['ArrowLeft','ArrowUp'].includes(event.key))next=(index-1+tabs.length)%tabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=tabs.length-1;
   if(next!==undefined){event.preventDefault();selectMode(tabs[next].dataset.avatarMode,true);}
  });
 });
 range.addEventListener('input',()=>reveal(range.value));
 const frame=$('#avatar-frame');
 function drag(event){if(!['room','identity'].includes(current))return;const r=frame.getBoundingClientRect();reveal((event.clientX-r.left)*100/r.width);}
 frame.addEventListener('pointerdown',event=>{if(!['room','identity'].includes(current)||event.button!==0)return;dragging=true;frame.setPointerCapture(event.pointerId);drag(event);});
 frame.addEventListener('pointermove',event=>{if(dragging)drag(event);});
 ['pointerup','pointercancel','lostpointercapture'].forEach(name=>frame.addEventListener(name,()=>dragging=false));
 root.querySelectorAll('[data-avatar-person]').forEach(button=>button.addEventListener('click',()=>{
  person=button.dataset.avatarPerson;root.querySelectorAll('[data-avatar-person]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));updateFrame();
 }));
 Object.values(images).forEach(src=>{const image=new Image();image.src=src;});
})();
