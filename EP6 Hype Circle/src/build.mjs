// npm install --no-save marked, then node src/build.mjs from the episode directory.
import { createRequire } from 'node:module';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = dirname(here);
const resolver = createRequire(process.env.ARTIFACT_NODE_MODULES
  ? join(process.env.ARTIFACT_NODE_MODULES, '_entry.cjs')
  : import.meta.url);
const { marked } = await import(pathToFileURL(resolver.resolve('marked')).href);
const read = file => readFile(join(here, file), 'utf8');
const [source, shell, css, js, curve] = await Promise.all([
  read('../EP6-Hype-Circle.md'), read('shell.html'), read('style.css'), read('reader.js'), read('cycle.svg')
]);
const parts = source.split(/^## (?=\d{2} · )/m).slice(1);
const slides = parts.map((part, index) => {
  const titleEnd = part.indexOf('\n');
  const [number, title] = part.slice(0, titleEnd).split(' · ');
  const [main, notes] = part.slice(titleEnd).split(/^### 讲稿$/m);
  if (!notes || Number(number) !== index + 1) throw new Error('Invalid slide ' + number);
  const fragments = main.trim().split(/^### /m);
  const intro = marked.parse(fragments.shift()).replace(/<p><img[^>]+src="src\/cycle\.svg"[^>]*><\/p>/, curve);
  const cards = fragments.map(fragment => {
    const parsed = marked.parse('### ' + fragment);
    const boundary = parsed.indexOf('<p><strong>');
    return boundary < 0 ? { content: parsed } : { content: parsed.slice(0, boundary), ending: parsed.slice(boundary) };
  });
  const columns = cards.length ? '<div class="panels">' + cards.map(card => '<div>' + card.content + '</div>').join('') + '</div>' : '';
  const ending = cards.map(card => card.ending || '').join('');
  return `<section class="slide" id="s${number}" aria-labelledby="t${number}">
    <header class="folio"><span>AGENTIC THINKING　/　EP06</span><span>Hype Circle</span></header>
    <h2 id="t${number}">${title}</h2>
    <div class="body">${intro}${columns}${ending}</div>
    <footer>AI 技术周期的趋势 <span>${number} / ${parts.length}</span></footer>
    <details class="notes"><summary>讲稿与来源</summary><div>${marked.parse(notes.trim())}</div></details>
  </section>`;
});
if (slides.length !== 11) throw new Error('Expected 11 slides');
await writeFile(join(root, 'EP6-Hype-Circle.html'), shell
  .replace('@@STYLE@@', () => css).replace('@@SLIDES@@', () => slides.join('\n')).replace('@@SCRIPT@@', () => js));
console.log('Built ' + slides.length + ' slides.');
