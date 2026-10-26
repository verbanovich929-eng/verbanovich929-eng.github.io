const SITE_CONFIG = { portfolioUrl: '', telegramUrl: 'https://t.me/veerrba' };
let portfolio = null;
try {const u = new URL(SITE_CONFIG.portfolioUrl); if (u.protocol === 'https:' && ['disk.yandex.ru','disk.yandex.com','yadi.sk'].includes(u.hostname)) portfolio = u.href;} catch {}
const dialog = document.querySelector('#portfolio-dialog');
document.querySelectorAll('.portfolio-button').forEach(button => button.addEventListener('click', () => {
  if (portfolio) window.open(portfolio, '_blank', 'noopener,noreferrer'); else dialog.showModal();
}));
if (portfolio) document.querySelector('.portfolio-note').textContent = 'Откроется на Яндекс Диске';
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {if (event.target !== dialog) return;const r = dialog.getBoundingClientRect();if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();});
document.querySelector('#year').textContent = new Date().getFullYear();
const stages = [
 {image:'stage-sketch', label:'BRIEF → PERSONALITY', eyebrow:'СНАЧАЛА — КТО ОН?', title:'Характер раньше формы.', text:'Определяем роль героя, его темперамент и историю. Смелый исследователь — значит открытый взгляд, уверенная поза и узнаваемый силуэт.'},
 {image:'stage-sketch', label:'PENCIL → SILHOUETTE', eyebrow:'ИЩЕМ В ЛИНИЯХ', title:'Силуэт, который узнают.', text:'Набрасываем пропорции, жест и выражение. Большие уши поддерживают любопытство, компактная фигура и объёмная куртка создают запоминаемый силуэт.'},
 {image:'stage-color', label:'PALETTE → EMOTION', eyebrow:'ЦВЕТ РАБОТАЕТ НА ХАРАКТЕР', title:'Не случайный оранжевый.', text:'Оранжевый делает героя энергичным и заметным. Тёплый светлый мех смягчает образ, графитовые детали добавляют контраст и собирают палитру.'},
 {image:'stage-3d', label:'MATERIAL → DETAIL', eyebrow:'У КАЖДОЙ ПОВЕРХНОСТИ СВОЙ ГОЛОС', title:'Фактура делает живым.', text:'Приближаем визуал: ткань куртки, мягкий мех, швы и детали. Разница материалов делает образ убедительнее ещё до первого движения.'},
 {image:'stage-3d', label:'LIGHT → DIMENSION', eyebrow:'ОБРАЗ ОБРЕТАЕТ ОБЪЁМ', title:'Готов к своей истории.', text:'Собираем финальную 3D-стилизацию: свет подчёркивает форму и фактуру, поза передаёт настроение. Затем образ может стать основой для анимации и рекламной истории.'}
];
let current = 0, timer = null;
const tabs = [...document.querySelectorAll('[data-stage]')];
const playButton = document.querySelector('#play-pipeline');
function showStage(index, focus = false) {
 current = (index + stages.length) % stages.length;
 const stage = stages[current];
 tabs.forEach((tab,i) => {tab.setAttribute('aria-selected', String(i === current));tab.tabIndex = i === current ? 0 : -1;});
 document.querySelector('#stage-panel').setAttribute('aria-labelledby', 'stage-' + current);
 document.querySelectorAll('.stage-image').forEach(image => image.classList.toggle('active', image.id === stage.image));
 document.querySelector('#brief-overlay').classList.toggle('off', current !== 0);
 document.querySelector('.stage-images').classList.toggle('texture', current === 3);
 document.querySelector('#stage-number').textContent = String(current + 1).padStart(2,'0');
 document.querySelector('#stage-image-label').textContent = stage.label;
 document.querySelector('#stage-eyebrow').textContent = stage.eyebrow;
 document.querySelector('#stage-title').textContent = stage.title;
 document.querySelector('#stage-text').textContent = stage.text;
 document.querySelector('#stage-palette').hidden = current !== 2;
 document.querySelector('#pipeline-progress').style.width = ((current + 1) * 20) + '%';
 if (focus) tabs[current].focus();
}
function stopPlayback() {if(timer) clearInterval(timer);timer = null;playButton.setAttribute('aria-pressed','false');playButton.innerHTML = '▶ <span>Проиграть весь процесс</span>';}
tabs.forEach((tab,index) => {
 tab.addEventListener('click', () => {stopPlayback();showStage(index);});
 tab.addEventListener('keydown', event => {
  let next;
  if (['ArrowRight','ArrowDown'].includes(event.key)) next = current + 1;
  if (['ArrowLeft','ArrowUp'].includes(event.key)) next = current - 1;
  if (event.key === 'Home') next = 0;
  if (event.key === 'End') next = stages.length - 1;
  if (next !== undefined) {event.preventDefault();stopPlayback();showStage(next,true);}
 });
});
playButton.addEventListener('click', () => {
 if (timer) {stopPlayback();return;}
 showStage(0);playButton.setAttribute('aria-pressed','true');playButton.innerHTML='Ⅱ <span>Остановить показ</span>';
 timer = setInterval(() => {if(current === stages.length-1) stopPlayback();else showStage(current+1);},3500);
});
document.addEventListener('visibilitychange', () => {if(document.hidden) stopPlayback();});
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
 const revealElements = document.querySelectorAll('.section-heading,.format-card,.project-card,.creator-intro,.credits article,.production-grid article');
 document.documentElement.classList.add('motion');
 const observer = new IntersectionObserver(entries => entries.forEach(entry => {if(entry.isIntersecting){entry.target.classList.add('in');observer.unobserve(entry.target);}}),{threshold:.06});
 revealElements.forEach(el => {el.classList.add('reveal');observer.observe(el);});
 const labObserver = new IntersectionObserver(entries => {if (!entries[0].isIntersecting) stopPlayback();},{threshold:0});labObserver.observe(document.querySelector('.pipeline'));
}
