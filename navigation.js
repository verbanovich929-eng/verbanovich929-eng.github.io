(() => {
  const menu = document.querySelector('#site-contents');
  if (!menu) return;
  const summary = menu.querySelector('summary');
  const links = [...menu.querySelectorAll('nav a')];
  const entries = links.map(link => ({link, target: document.getElementById(link.hash.slice(1))})).filter(entry => entry.target);
  const progress = menu.querySelector('.contents-progress > span');
  let frame = 0;
  function update() {
    frame = 0;
    const threshold = Math.min(180, window.innerHeight * .25);
    let current = entries[0];
    for (const entry of entries) {
      if (entry.target.getBoundingClientRect().top <= threshold) current = entry;
    }
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    if (distance > 0 && window.scrollY >= distance - 4) current = entries[entries.length - 1];
    for (const entry of entries) {
      if (entry === current) entry.link.setAttribute('aria-current', 'location');
      else entry.link.removeAttribute('aria-current');
    }
    progress.style.width = (distance > 0 ? Math.min(100, Math.max(0, window.scrollY / distance * 100)) : 0) + '%';
  }
  function schedule() {if (!frame) frame = requestAnimationFrame(update);}
  function close(restoreFocus = false) {
    menu.open = false;
    if (restoreFocus) summary.focus({preventScroll: true});
  }
  menu.querySelector('.contents-close').addEventListener('click', () => close(true));
  menu.addEventListener('toggle', () => {
    if (!menu.open) return;
    update();
    menu.querySelector('[aria-current="location"]')?.scrollIntoView({block: 'nearest', behavior: 'instant'});
  });
  for (const {link, target} of entries) {
    link.addEventListener('click', event => {
      // Keep modified clicks available for opening a section in a new tab.
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      close();
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      requestAnimationFrame(() => target.focus({preventScroll: true}));
    });
  }
  document.addEventListener('pointerdown', event => {
    if (menu.open && !menu.contains(event.target)) close();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) {event.preventDefault(); close(true);}
  });
  window.addEventListener('scroll', schedule, {passive: true});
  window.addEventListener('resize', schedule);
  window.addEventListener('hashchange', schedule);
  window.addEventListener('load', schedule);
  if (document.fonts) document.fonts.ready.then(schedule);
  if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(document.querySelector('main'));
  update();
})();
