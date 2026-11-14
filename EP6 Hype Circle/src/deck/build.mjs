// Builds the editable deck, the offline preview and the speaker notes from one source.
//   node deck/build.mjs [qa-dir]   — qa-dir also receives one SVG per slide for visual checks
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import PptxGenJS from 'pptxgenjs';
import { toSVG, toPptx, FONT } from './lib.mjs';
import { part1 } from './part1.mjs';
import { part2 } from './part2.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const qa = process.argv[2] ? path.resolve(process.argv[2]) : null;
const slides = [...part1(), ...part2()];
const titles = ['Hype Circle', 'Where we are', 'Peak of anticipation 爬坡', '中国开源 AI 正在打破美国的创新周期', 'AI 的瓶颈是电', '幻灭低谷期，谁能活下来',
  '模型即产品的悖论', '应用层的机会在哪', '模型的不可能三角', '从 Model 到 Model Router', 'Data – Harness – Context', '从 Tool 到 Dynamic Software',
  '时代中必然的机遇', '陪伴与内容的选择', '陪伴：壁垒在 Context 层', '内容：AIGC 的关键是 C', '工具层没有毛利，走向商业化层', '改善毛利：钱从哪里来',
  '改善毛利：把模型用得又好又省', '运营是运营关系', 'AI native 组织', 'AI native 个人', '人机协作中的审美', '我们离 AGI 还有多远', '认清生活的本质，仍然热爱生活'];
if (titles.length !== slides.length) throw new Error(`titles (${titles.length}) and slides (${slides.length}) differ`);

// 1 · editable deck
const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE';
pptx.title = 'Hype Circle · Agentic Thinking EP06';
pptx.author = 'Oratis';
pptx.theme = { headFontFace: FONT, bodyFontFace: FONT };
for (const slide of slides) toPptx(slide, pptx.addSlide());
await pptx.writeFile({ fileName: path.join(root, 'EP6-Hype-Circle.pptx') });

// 2 · speaker notes
const md = ['# Agentic Thinking EP06 · Hype Circle', '', 'Oratis · 2026 年 11 月 18 日（周三）上午 11:00，北京时间', '',
  `共 ${slides.length} 页（含封面）。以下文字同时保存在演示文件每一页的演讲者备注里。`, ''];
slides.forEach((s, i) => md.push(`## ${String(i).padStart(2, '0')} · ${titles[i]}`, '', s.notes, ''));
await fs.writeFile(path.join(root, 'EP6-Hype-Circle.md'), md.join('\n'));

// 3 · offline preview
const svgs = slides.map(toSVG);
const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const html = `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Hype Circle · EP06</title>
<style>
html,body{margin:0;background:#000;color:#a1a1aa;font:15px/1.6 'PingFang SC',system-ui,sans-serif}
.s{display:none;height:100vh;align-items:center;justify-content:center;flex-direction:column}
.s.on{display:flex}.s svg{max-width:100vw;max-height:100vh;aspect-ratio:16/9;width:100%}
.n{display:none;position:fixed;left:0;right:0;bottom:0;max-height:38vh;overflow:auto;background:#16161bee;color:#f5f5f7;padding:20px 28px;white-space:pre-wrap;box-sizing:border-box}
body.notes .s.on .n{display:block}
#hint{position:fixed;right:14px;top:10px;font-size:12px;opacity:.5}
body.read .s{display:flex;height:auto;margin-bottom:8px}body.read .n{display:block;position:static;max-height:none}
@media(max-width:800px){.s{display:flex;height:auto;margin-bottom:8px}.n{display:block;position:static;max-height:none}#hint{display:none}}
@media print{.s{display:flex;height:auto;page-break-after:always}.n,#hint{display:none!important}}
</style>
<div id="hint">← → 翻页 · N 备注 · R 连续阅读</div>
${svgs.map((svg, i) => `<section class="s${i ? '' : ' on'}">${svg}<div class="n">${esc(slides[i].notes)}</div></section>`).join('\n')}
<script>
const s=[...document.querySelectorAll('.s')];let i=Math.min(s.length-1,Math.max(0,(+location.hash.slice(1)||0)));
const go=n=>{s[i].classList.remove('on');i=Math.max(0,Math.min(s.length-1,n));s[i].classList.add('on');history.replaceState(0,'','#'+i)};go(i);
addEventListener('keydown',e=>{if(['ArrowRight','ArrowDown',' ','PageDown'].includes(e.key))go(i+1);else if(['ArrowLeft','ArrowUp','PageUp'].includes(e.key))go(i-1);
else if(e.key==='n'||e.key==='N')document.body.classList.toggle('notes');else if(e.key==='r'||e.key==='R')document.body.classList.toggle('read')});
addEventListener('click',e=>{if(!document.body.classList.contains('read'))go(i+(e.clientX>innerWidth/2?1:-1))});
</script></html>`;
await fs.writeFile(path.join(root, 'EP6-Hype-Circle.html'), html);

if (qa) {
  await fs.mkdir(qa, { recursive: true });
  await Promise.all(svgs.map((svg, i) => fs.writeFile(path.join(qa, `slide-${String(i).padStart(2, '0')}.html`),
    `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:#000}svg{display:block;width:100vw;height:100vh}</style>${svg}`)));
}
if (qa) {
  // one single-slide deck per page, so Quick Look can render every page of the real file format
  for (const [i, slide] of slides.entries()) {
    const one = new PptxGenJS();
    one.layout = 'LAYOUT_WIDE';
    toPptx(slide, one.addSlide());
    await one.writeFile({ fileName: path.join(qa, `page-${String(i).padStart(2, '0')}.pptx`) });
  }
}
console.log(`Built ${slides.length} slides → EP6-Hype-Circle.pptx, .html, .md`);
