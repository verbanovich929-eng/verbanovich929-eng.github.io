const SITE_CONFIG = {portfolioUrl:'',telegramUrl:'https://t.me/veerrba'};
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = selector => document.querySelector(selector);
const dialog = $('#portfolio-dialog');
let portfolio;
try {const u=new URL(SITE_CONFIG.portfolioUrl);if(u.protocol==='https:'&&['disk.yandex.ru','disk.yandex.com','yadi.sk'].includes(u.hostname))portfolio=u.href;}catch{}
document.querySelectorAll('.portfolio-button').forEach(button=>button.addEventListener('click',()=>{if(portfolio)window.open(portfolio,'_blank','noopener,noreferrer');else dialog.showModal();}));
if(portfolio)$('.hero-action>span').textContent='ПОРТФОЛИО НА ЯНДЕКС ДИСКЕ';
$('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
$('#year').textContent=new Date().getFullYear();
const stages=[
 {base:'sketch',overlay:'sketch',label:'CHARACTER BRIEF / 001',kicker:'СНАЧАЛА — ИСТОРИЯ',title:'КТО ОН<br>И ЗАЧЕМ ОН ЗДЕСЬ?',text:'Начинаем с характера и роли в истории. Наш герой — городской курьер: быстрый, уверенный, немного дерзкий. Этот характер определяет позу, силуэт, одежду и движение.',hint:'НАЖМИТЕ «СКЕТЧ», ЧТОБЫ ПЕРЕЙТИ К ЛИНИЯМ',specific:'personality'},
 {base:'paper',overlay:'sketch',label:'PENCIL STUDY / 002',kicker:'СИЛУЭТ ДО ДЕТАЛЕЙ',title:'ХАРАКТЕР<br>ПРОЯВЛЯЕТСЯ В ЛИНИЯХ.',text:'Ищем форму от руки: крупный верх, устойчивые ноги, спокойная уверенная поза. Конструктивные линии помогают проверить пропорции и узнаваемость героя до цвета.',hint:'ЛИНИИ ПРОЯВЛЯЮТСЯ СЛЕВА НАПРАВО',specific:null},
 {base:'sketch',overlay:'color',label:'COLOR SYSTEM / 003',kicker:'НЕ СЛУЧАЙНАЯ ПАЛИТРА',title:'ЦВЕТ<br>ЗАДАЁТ ТЕМП.',text:'Лаймовый жилет делает героя заметным, красные кроссовки дают импульс. Графитовая основа удерживает баланс. Потяните ползунок: цвет проявится поверх карандашного скетча.',hint:'ДВИГАЙТЕ ПОЛЗУНОК ПОД ИЗОБРАЖЕНИЕМ',specific:'palette',from:'КАРАНДАШНЫЙ СКЕТЧ',to:'ЦВЕТНОЙ КОНЦЕПТ',control:'ПРОЯВИТЬ ЦВЕТ'},
 {base:'color',overlay:'texture',label:'MATERIAL DEVELOPMENT / 004',kicker:'МОЖНО ПОЧТИ ПОТРОГАТЬ',title:'ПОВЕРХНОСТЬ<br>СТАНОВИТСЯ МАТЕРИАЛОМ.',text:'Плоская заливка превращается в ткань, металл и резину. Проявите фактуры ползунком, затем выберите материал ниже, чтобы рассмотреть его на крупном плане.',hint:'ВЫБЕРИТЕ НЕЙЛОН, МЕТАЛЛ ИЛИ РЕЗИНУ',specific:'materials',from:'ПЛОСКИЙ ЦВЕТ',to:'ФАКТУРА И СВЕТ',control:'НАЛОЖИТЬ ФАКТУРЫ'},
 {base:'wire',overlay:'texture',label:'VOLUME & FINAL LOOK / 005',kicker:'ФОРМА. СВЕТ. ОБЪЁМ.',title:'ВНУТРИ — СЕТКА.<br>СНАРУЖИ — ХАРАКТЕР.',text:'Показываем логику объёма в CGI-стилизации. На серой форме видна схема сетки; поверх неё проявляется финальный визуал с фактурами, светом и глубиной.',hint:'СРАВНИТЕ СЕТКУ И ФИНАЛЬНЫЙ ОБРАЗ',specific:'wire-notes',from:'СЕТКА / CLAY',to:'ФИНАЛЬНЫЙ ОБРАЗ',control:'ПРОЯВИТЬ ФИНАЛ'}
];
const tabs=[...document.querySelectorAll('[data-stage]')];
let current=0,playTimer=null,revealFrame=null,scanTimer=null;
const asset=name=>name==='paper'?'assets/paper.svg':'assets/courier-'+name+'.jpg';
const slider=$('#reveal-range');
function setReveal(value){value=Math.min(100,Math.max(0,Number(value)));slider.value=value;$('#overlay-image').style.clipPath=`inset(0 ${100-value}% 0 0)`;$('#reveal-edge').style.left=value+'%';$('#reveal-output').textContent=Math.round(value)+'%';slider.setAttribute('aria-valuetext',Math.round(value)+'% следующего этапа');}
function animateReveal(){if(revealFrame)cancelAnimationFrame(revealFrame);if(reduceMotion){setReveal(100);return;}setReveal(0);let start;function tick(now){if(start===undefined)start=now;const t=Math.min(1,(now-start)/1500);setReveal(100*(1-Math.pow(1-t,3)));if(t<1)revealFrame=requestAnimationFrame(tick);else revealFrame=null;}revealFrame=requestAnimationFrame(tick);}
function stop(){if(playTimer)clearInterval(playTimer);playTimer=null;$('#play-process').setAttribute('aria-pressed','false');$('#play-process').innerHTML='<span>▶︎</span> АВТОПОКАЗ';}
function showStage(index,focus=false){
 if(revealFrame)cancelAnimationFrame(revealFrame);if(scanTimer)clearTimeout(scanTimer);
 current=(index+stages.length)%stages.length;const s=stages[current];
 tabs.forEach((t,i)=>{t.setAttribute('aria-selected',String(i===current));t.tabIndex=i===current?0:-1;});
 $('#stage-panel').setAttribute('aria-labelledby','tab-'+current);
 $('#base-image').src=asset(s.base);$('#base-image').alt=s.from||'Предыдущий этап разработки';
 $('#overlay-image').src=asset(s.overlay);$('#overlay-image').alt=s.to||'Карандашный скетч персонажа';
 $('#view-label').textContent=s.label;$('#view-counter').textContent=String(current+1).padStart(2,'0')+'—05';
 $('#stage-kicker').textContent=s.kicker;$('#stage-title').innerHTML=s.title;$('#stage-text').textContent=s.text;$('#stage-hint').textContent=s.hint;
 $('#brief-board').classList.toggle('off',current!==0);
 $('.character-view').classList.toggle('dark',current>=3);
 $('.character-view').classList.toggle('comparable',current>=2);$('#comparison-controls').hidden=current<2;$('#reveal-edge').hidden=current<2;
 document.querySelectorAll('.stage-specific').forEach(el=>el.hidden=el.id!==s.specific);
 if(current>=2){$('#comparison-label').textContent=s.control;$('#compare-from').textContent=s.from;$('#compare-to').textContent=s.to;slider.setAttribute('aria-label',s.control);}
 $('.character-view').classList.remove('scanning');
 if(current!==0){void $('.character-view').offsetWidth;$('.character-view').classList.add('scanning');scanTimer=setTimeout(()=>$('.character-view').classList.remove('scanning'),1300);animateReveal();}else setReveal(100);
 if(focus)tabs[current].focus();
}
tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>{stop();showStage(i);});tab.addEventListener('keydown',event=>{let n;if(['ArrowRight','ArrowDown'].includes(event.key))n=current+1;if(['ArrowLeft','ArrowUp'].includes(event.key))n=current-1;if(event.key==='Home')n=0;if(event.key==='End')n=stages.length-1;if(n!==undefined){event.preventDefault();stop();showStage(n,true);}});});
slider.addEventListener('input',()=>{stop();if(revealFrame)cancelAnimationFrame(revealFrame);setReveal(slider.value);});
$('#next-stage').addEventListener('click',()=>{stop();showStage(current+1);});
$('#play-process').addEventListener('click',()=>{if(playTimer){stop();return;}showStage(0);$('#play-process').setAttribute('aria-pressed','true');$('#play-process').innerHTML='<span>Ⅱ</span> ПАУЗА';playTimer=setInterval(()=>{if(current===4)stop();else showStage(current+1);},4500);});
document.querySelectorAll('[data-material]').forEach(button=>button.addEventListener('click',()=>{const m=button.dataset.material;document.querySelectorAll('[data-material]').forEach(b=>b.classList.toggle('selected',b===button));$('#material-detail').dataset.material=m;$('#material-description').textContent={nylon:'Ткань: переплетение, швы, мягкий объём.',metal:'Металл: гладкая оболочка шлема, отражения и блики.',rubber:'Резина: плотная подошва, рельеф и следы износа.'}[m];}));
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
if('IntersectionObserver' in window){
 const labObserver=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)stop();});labObserver.observe($('#stage-panel'));
 if(!reduceMotion){document.documentElement.classList.add('motion');const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');obs.unobserve(e.target);}}),{threshold:.06});document.querySelectorAll('.section-heading,.format-ticket,.project-card,.creator-intro,.credits article').forEach(el=>{el.classList.add('reveal');obs.observe(el);});}
}

// Preload the states used by the comparison, preserving a smooth first transition.
['color','texture','wire'].forEach(name=>{const image=new Image();image.src=asset(name);});
const characterView=$('.character-view');
let dragging=false;
function dragReveal(event){if(current<2)return;stop();if(revealFrame)cancelAnimationFrame(revealFrame);const r=characterView.getBoundingClientRect();setReveal(100*(event.clientX-r.left)/r.width);}
characterView.addEventListener('pointerdown',event=>{if(current<2||event.button!==0)return;dragging=true;characterView.setPointerCapture(event.pointerId);dragReveal(event);});
characterView.addEventListener('pointermove',event=>{if(dragging)dragReveal(event);});
characterView.addEventListener('pointerup',()=>{dragging=false;});
characterView.addEventListener('pointercancel',()=>{dragging=false;});
document.querySelectorAll('[data-material]').forEach(button=>{button.setAttribute('aria-pressed',String(button.classList.contains('selected')));button.addEventListener('click',()=>document.querySelectorAll('[data-material]').forEach(b=>b.setAttribute('aria-pressed',String(b===button))));});
