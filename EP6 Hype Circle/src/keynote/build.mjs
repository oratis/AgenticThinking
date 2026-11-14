import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { authorDeck } from './deck.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const build = path.resolve(process.argv[2] || '/private/tmp/ep6-keynote-build');
const modules = process.env.ARTIFACT_NODE_MODULES;
const require = createRequire(modules ? path.join(modules, '_entry.cjs') : import.meta.url);
const { Presentation, PresentationFile } = await import(pathToFileURL(require.resolve('@oai/artifact-tool')).href);
await fs.mkdir(path.join(build, 'render'), { recursive: true });
const presentation = Presentation.create({ slideSize: { width: 1280, height: 720 } });
const chart = await fs.readFile(path.join(here, 'gartner-agentic-ai-2026.png'));
const records = authorDeck(presentation, chart.buffer.slice(chart.byteOffset, chart.byteOffset + chart.byteLength));
if (presentation.slides.items.length !== 22) throw new Error('The outline must contain 22 slides.');
await (await PresentationFile.exportPptx(presentation)).save(path.join(build, 'candidate.pptx'));
for (const [index, slide] of presentation.slides.items.entries()) {
  const png = await presentation.export({ slide, format: 'png', scale: 1.5 });
  await fs.writeFile(path.join(build, 'render', 'slide-' + String(index + 1).padStart(2, '0') + '.png'), new Uint8Array(await png.arrayBuffer()));
}
await fs.writeFile(path.join(build, 'slides.json'), JSON.stringify(records, null, 2));
const notes = ['# Agentic Thinking EP06 · Hype Circle', '', 'Oratis · 2026 年 11 月 18 日（周三）上午 11:00，北京时间', '',
  '演示按完整内容排列为 22 页。以下文字也保存在 Keynote 的演讲者备注中。', ''];
for (const page of records) {
  notes.push('## ' + String(page.number).padStart(2, '0') + ' · ' + page.title, '', page.notes, '');
  for (const [i, ref] of page.refs.entries()) notes.push('- [参考资料 ' + (i + 1) + '](' + ref + ')');
  notes.push('');
}
await fs.writeFile(path.join(root, 'EP6-Hype-Circle.md'), notes.join('\n'));
console.log('Built ' + records.length + ' editable slides, renders and speaker notes in ' + build);
