/** Build an offline slide preview from the final Keynote-rendered PNGs and slides.json. */
import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const build = path.resolve(process.argv[2] || '/private/tmp/ep6-keynote-build');
const require = createRequire(process.env.ARTIFACT_NODE_MODULES
  ? path.join(process.env.ARTIFACT_NODE_MODULES, '_entry.cjs') : import.meta.url);
const sharp = require('sharp');
const slides = JSON.parse(await readFile(path.join(build, 'slides.json'), 'utf8'));
if (slides.length !== 22) throw new Error('Expected 22 slide records.');

const escape = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]);
const sections = [];
for (const [index, slide] of slides.entries()) {
  const number = String(index + 1).padStart(2, '0');
  const image = await sharp(path.join(build, 'render', 'slide-' + number + '.png'))
    .resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 88 }).toBuffer();
  const notes = String(slide.notes || '').split(/\n\s*\n/)
    .map(paragraph => '<p>' + escape(paragraph).replace(/\n/g, '<br>') + '</p>').join('');
  const sources = (slide.refs || []).map((reference, i) => {
    const url = new URL(reference);
    if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Unsupported source URL.');
    return '<li><a href="' + escape(url.href) + '" target="_blank" rel="noopener noreferrer">参考 '
      + (i + 1) + ' · ' + escape(url.hostname) + '</a></li>';
  }).join('');
  sections.push(`<section class="page" id="s${number}" data-title="${escape(slide.title)}">
    <figure><img src="data:image/webp;base64,${image.toString('base64')}" width="1280" height="720" alt="第 ${index + 1} 页 · ${escape(slide.title)}"></figure>
    <details class="notes"><summary>讲稿与来源</summary><div class="note-body">${notes}${sources ? '<ul>' + sources + '</ul>' : ''}</div></details>
  </section>`);
}

const html = `<!doctype html>
<html lang="zh-CN">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Hype Circle · Agentic Thinking EP06</title>
<style>
:root{color-scheme:dark;font:16px/1.65 "Helvetica Neue","PingFang SC","Microsoft YaHei",sans-serif;color:#f5f4ee;background:#101813}
*{box-sizing:border-box}body{margin:0}button,select{font:inherit;color:inherit;background:#213428;border:1px solid #52644e;border-radius:5px;padding:5px 12px;cursor:pointer}button:hover:enabled,select:hover{border-color:#b0ef78}button:disabled{opacity:.35}button:focus-visible,select:focus-visible,summary:focus-visible,a:focus-visible{outline:2px solid #b0ef78;outline-offset:3px}a{color:#b0ef78;overflow-wrap:anywhere}figure{margin:0}img{display:block}.toolbar,.controls{display:flex;align-items:center;justify-content:center;gap:10px}.toolbar{height:60px;padding:8px 16px;font-size:14px}.brand{font-size:18px;font-weight:650;margin-right:8px}select{max-width:44vw}.controls{height:48px;font-size:14px}#count{min-width:75px;text-align:center;font-variant-numeric:tabular-nums}.controls button{font-size:20px;padding:0 14px}.page{display:none}.page.active{display:block;height:calc(100dvh - 108px);padding:6px 12px}.page figure{height:100%;display:flex;align-items:center;justify-content:center}.page img{max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain}.notes{display:none}.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}dialog{width:min(780px,94vw);max-height:86dvh;background:#18271d;color:#f5f4ee;border:1px solid #73836b;border-radius:8px;padding:24px 30px}dialog::backdrop{background:#000b}.dialog-head{display:flex;justify-content:space-between;align-items:flex-start;gap:20px}.dialog-head h2{margin:0;font-size:23px;line-height:1.4}.dialog-head button{flex-shrink:0}.note-body{line-height:1.85}.note-body ul{padding-left:20px}.note-body li{margin:4px 0}
.reading .toolbar{height:auto;min-height:60px;position:sticky;top:0;z-index:2;background:#101813;border-bottom:1px solid #344733}.reading .page{display:block;width:min(1120px,100%);height:auto;margin:0 auto 24px;padding:0;scroll-margin-top:65px}.reading .page figure{height:auto;display:block}.reading .page img{width:100%;height:auto;max-height:none}.reading .notes{display:block;margin:0 18px;padding:12px 0;border-bottom:1px solid #344733}.reading summary{color:#b0ef78;cursor:pointer}.reading .controls,.reading #notes-button{display:none}
@media(max-width:800px){.toolbar{gap:6px;flex-wrap:wrap;padding:8px 6px}.brand{display:none}button,select{font-size:13px;padding:5px 8px}select{max-width:55vw}.note-body{font-size:16px}dialog{padding:18px}.dialog-head h2{font-size:20px}}
@page{size:1280px 720px;margin:0}@media print{html,body{background:white;print-color-adjust:exact;-webkit-print-color-adjust:exact}.toolbar,.controls,.notes,dialog{display:none!important}.page,.page.active,.reading .page{display:block!important;width:1280px!important;height:720px!important;margin:0!important;padding:0!important;break-after:page;break-inside:avoid}.page:last-child{break-after:auto}.page figure,.reading .page figure{display:block!important;width:1280px!important;height:720px!important}.page img,.reading .page img{width:1280px!important;height:720px!important;max-height:none!important;object-fit:contain}}
</style></head>
<body>
<nav class="toolbar" aria-label="讲义导航"><span class="brand">Hype Circle</span><label><span class="sr">跳到指定页</span><select id="toc"></select></label><button id="notes-button">讲稿 N</button><button id="mode" aria-pressed="false">连续阅读 R</button><button id="fullscreen">全屏</button></nav>
<main>${sections.join('\n')}</main>
<nav class="controls" aria-label="翻页"><button id="previous" aria-label="上一页">←</button><span id="count" aria-live="polite"></span><button id="next" aria-label="下一页">→</button></nav>
<dialog id="notes-dialog" aria-labelledby="notes-title"><div class="dialog-head"><h2 id="notes-title"></h2><button id="close">关闭</button></div><div id="notes-copy"></div></dialog>
<script>
(() => {
  const byId = id => document.getElementById(id);
  const pages = [...document.querySelectorAll('.page')];
  const toc = byId('toc');
  const dialog = byId('notes-dialog');
  let current = 0;
  let reading = matchMedia('(max-width: 800px)').matches;
  let scrollPending = false;
  pages.forEach((page, index) => toc.add(new Option(String(index + 1).padStart(2, '0') + '　' + page.dataset.title, String(index))));
  function show(index, scroll = false) {
    current = Math.max(0, Math.min(index, pages.length - 1));
    pages.forEach((page, i) => page.classList.toggle('active', i === current));
    toc.value = String(current);
    byId('count').textContent = String(current + 1).padStart(2, '0') + ' / ' + pages.length;
    byId('previous').disabled = current === 0;
    byId('next').disabled = current === pages.length - 1;
    const hash = '#' + pages[current].id;
    if (location.hash !== hash) history.replaceState(null, '', hash);
    if (scroll && reading) pages[current].scrollIntoView({ block: 'start' });
  }
  function fromHash() {
    const index = pages.findIndex(page => '#' + page.id === location.hash);
    show(index < 0 ? 0 : index, true);
  }
  function setMode() {
    document.body.classList.toggle('reading', reading);
    byId('mode').textContent = reading ? '演示模式 R' : '连续阅读 R';
    byId('mode').setAttribute('aria-pressed', String(reading));
    if (!reading) window.scrollTo(0, 0);
    show(current, true);
  }
  function notes() {
    byId('notes-title').textContent = pages[current].dataset.title;
    byId('notes-copy').replaceChildren(pages[current].querySelector('.note-body').cloneNode(true));
    dialog.showModal();
    dialog.scrollTop = 0;
  }
  byId('previous').onclick = () => show(current - 1);
  byId('next').onclick = () => show(current + 1);
  toc.onchange = () => show(Number(toc.value), true);
  byId('notes-button').onclick = notes;
  byId('close').onclick = () => dialog.close();
  byId('mode').onclick = () => { reading = !reading; setMode(); };
  byId('fullscreen').onclick = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.().catch(() => {});
  };
  addEventListener('keydown', event => {
    if (dialog.open || event.ctrlKey || event.altKey || event.metaKey || event.target.matches('select,input,textarea')) return;
    if (event.key.toLowerCase() === 'r') { event.preventDefault(); byId('mode').click(); return; }
    if (reading) return;
    if (event.key.toLowerCase() === 'n') { event.preventDefault(); notes(); return; }
    if (event.key === ' ' && event.target.closest('button,a')) return;
    if (['ArrowRight','PageDown',' '].includes(event.key)) { event.preventDefault(); show(current + 1); }
    if (['ArrowLeft','PageUp'].includes(event.key)) { event.preventDefault(); show(current - 1); }
    if (event.key === 'Home') { event.preventDefault(); show(0); }
    if (event.key === 'End') { event.preventDefault(); show(pages.length - 1); }
  });
  addEventListener('scroll', () => {
    if (!reading || scrollPending) return;
    scrollPending = true;
    requestAnimationFrame(() => {
      scrollPending = false;
      const index = pages.findLastIndex(page => page.getBoundingClientRect().top < innerHeight * .4);
      if (index >= 0 && index !== current) show(index);
    });
  }, { passive: true });
  addEventListener('hashchange', fromHash);
  current = Math.max(0, pages.findIndex(page => '#' + page.id === location.hash));
  setMode();
})();
</script></body></html>`;
const output = path.join(root, 'EP6-Hype-Circle.html');
await writeFile(output, html);
console.log('Built ' + slides.length + ' offline slide previews in ' + output);
