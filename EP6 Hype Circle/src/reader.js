(() => {
  const byId = id => document.getElementById(id);
  const slides = [...document.querySelectorAll('.slide')];
  const toc = byId('toc');
  const dialog = byId('script-dialog');
  let position = 0;
  let reading = matchMedia('(max-width: 700px)').matches;
  const pad = number => String(number).padStart(2, '0');
  for (const [index, slide] of slides.entries()) {
    toc.add(new Option(pad(index + 1) + '　' + slide.querySelector('h2').textContent, String(index)));
  }
  function fit() {
    const viewport = byId('viewport');
    const scale = Math.min((viewport.clientWidth - 8) / 1280, (viewport.clientHeight - 8) / 720);
    byId('stage').style.setProperty('--scale', String(scale));
  }
  function show(index, scroll = false) {
    position = Math.max(0, Math.min(index, slides.length - 1));
    slides.forEach((slide, i) => slide.classList.toggle('active', i === position));
    const slide = slides[position];
    toc.value = String(position);
    byId('count').textContent = pad(position + 1) + ' / ' + slides.length;
    byId('prev').disabled = position === 0;
    byId('next').disabled = position === slides.length - 1;
    if (location.hash !== '#' + slide.id) history.replaceState(null, '', '#' + slide.id);
    if (scroll && reading) slide.scrollIntoView({ block: 'start' });
  }
  function fromHash() {
    const index = slides.findIndex(slide => '#' + slide.id === location.hash);
    show(index < 0 ? 0 : index, true);
  }
  function setMode() {
    document.body.classList.toggle('reading', reading);
    byId('read').textContent = reading ? '演示模式' : '连续阅读';
    byId('read').setAttribute('aria-pressed', String(reading));
    if (!reading) window.scrollTo(0, 0);
    fit();
  }
  function notes() {
    byId('script-title').textContent = slides[position].querySelector('h2').textContent;
    byId('script-copy').replaceChildren(slides[position].querySelector('.notes > div').cloneNode(true));
    dialog.showModal();
    dialog.scrollTop = 0;
  }
  byId('prev').onclick = () => show(position - 1);
  byId('next').onclick = () => show(position + 1);
  toc.onchange = () => show(Number(toc.value), true);
  byId('notes').onclick = notes;
  byId('close').onclick = () => dialog.close();
  byId('read').onclick = () => { reading = !reading; setMode(); show(position, true); };
  byId('full').onclick = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.().catch(() => {});
  };
  addEventListener('keydown', event => {
    if (dialog.open || event.ctrlKey || event.altKey || event.metaKey || event.target.matches('select')) return;
    if (event.key.toLowerCase() === 'r') { byId('read').click(); return; }
    if (reading) return;
    if (event.key.toLowerCase() === 'n') { notes(); return; }
    if (event.key === ' ' && event.target.closest('button, a')) return;
    if (['ArrowRight', 'PageDown', ' '].includes(event.key)) { event.preventDefault(); show(position + 1); }
    if (['ArrowLeft', 'PageUp'].includes(event.key)) { event.preventDefault(); show(position - 1); }
    if (event.key === 'Home') { event.preventDefault(); show(0); }
    if (event.key === 'End') { event.preventDefault(); show(slides.length - 1); }
  });
  addEventListener('scroll', () => {
    if (!reading) return;
    const current = slides.findLastIndex(slide => slide.getBoundingClientRect().top < innerHeight * .4);
    if (current >= 0 && current !== position) show(current);
  }, { passive: true });
  addEventListener('hashchange', fromHash);
  addEventListener('resize', fit);
  addEventListener('beforeprint', () => document.body.classList.remove('reading'));
  addEventListener('afterprint', setMode);
  setMode();
  fromHash();
})();
