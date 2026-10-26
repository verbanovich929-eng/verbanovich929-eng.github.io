// Добавьте сюда публичные ссылки, когда они будут готовы.
const SITE_CONFIG = {
  portfolioUrl: '',
  telegramUrl: 'https://t.me/veerrba'
};
const safeUrl = (value, host) => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && host(url.hostname) ? url.href : null;
  } catch { return null; }
};
const portfolio = safeUrl(SITE_CONFIG.portfolioUrl, h => ['disk.yandex.ru', 'disk.yandex.com', 'yadi.sk'].includes(h));
const telegram = safeUrl(SITE_CONFIG.telegramUrl, h => ['t.me', 'telegram.me'].includes(h));
const dialog = document.querySelector('#portfolio-dialog');
document.querySelectorAll('.portfolio-button').forEach(button => {
  button.addEventListener('click', () => {
    if (portfolio) window.open(portfolio, '_blank', 'noopener,noreferrer');
    else dialog.showModal();
  });
});
if (portfolio) document.querySelector('.button-caption').textContent = 'Портфолио откроется на Яндекс Диске';
if (telegram) {
  const link = document.querySelector('#telegram-link');
  link.href = telegram;
  link.hidden = false;
}
document.querySelectorAll('.dialog-close, .dialog-done').forEach(button => button.addEventListener('click', () => dialog.close()));
dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
document.querySelector('#year').textContent = new Date().getFullYear();
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('js-motion');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), {threshold: .08});
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
}
