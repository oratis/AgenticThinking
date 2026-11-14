// Slides 11–24: tools, opportunities, our choices, margin, AI-native work, AGI and the close.
import { Slide, C, SERIF, bez, polar, arcArrow, glow, chip, hype, measure } from './lib.mjs';
import { frame } from './part1.mjs';

/* 11 · From tools to dynamic software */
function dynamic() {
  const s = frame(new Slide(
    '从 tool，到 connector – skill – tool 的体系，再到 dynamic software engineering。\n\n' +
    'Agentic 产品，从单纯的 CoT 和调用工具，转变为 Manus、Dot、Muse 等产品的体系：connector（源自 MCP，其实就是 MCP 的平民化版本）→ 基于 connect 获取上下文 → 基于上下文提供 skill → 最后再调用 tool，用 worker 在本地或边缘完成任务并回报。\n\n' +
    '而未来，Agent 产品应该是完全动态的：每一个用户的 Codex 都跟另一个人完全不一样，是他在使用过程中，根据他自己的上下文调整出来的。这个趋势从 Claude Mods 和 DSH 就已经逐步出现。\n\n未来的设计，更多的是能力设计、演变式设计，而非产品设计。',
  ), 'slope', [{ t: '从 Tool，到 ' }, { t: 'Dynamic', color: C.hot }, { t: ' Software' }], 11);

  const cols = [100, 700, 1300], w = 520, top = 290, hgt = 570;
  cols.forEach((x, i) => {
    s.rect(x, top, w, hgt, { fill: C.panel, r: 30 });
    s.text(['过去', '现在', '未来'][i], x + 44, top + 56, { size: 24, color: C.mute, spacing: 3 });
    if (i < 2) s.line(x + w + 14, top + hgt / 2, x + w + 66, top + hgt / 2, { stroke: C.ink, sw: 5, arrow: 'end' });
  });

  // past: think ⇄ tool
  const a = [222, 540], b = [498, 540];
  s.line(304, 520, 416, 520, { stroke: C.dim, sw: 4, arrow: 'end' });
  s.line(416, 560, 304, 560, { stroke: C.dim, sw: 4, arrow: 'end' });
  [[a, '思考'], [b, '工具']].forEach(([p, t]) => { s.circle(...p, 72, { fill: C.panel2, stroke: C.ink, sw: 2.5 }); s.text(t, p[0], p[1], { size: 32, bold: true, align: 'c' }); });
  s.text('CoT + 调工具', 360, 770, { size: 38, bold: true, align: 'c' });

  // present: connector → context → skill → tool → worker
  ['Connector', 'Context', 'Skill', 'Tool · Worker'].forEach((t, i) => {
    const y = 412 + i * 84;
    chip(s, t, 960, y, { w: 320, h: 62, r: 16, size: 28, fill: C.panel2, bold: i === 0, color: i === 0 ? C.cool : C.ink });
    if (i < 3) s.line(960, y + 33, 960, y + 51, { stroke: C.mute, sw: 3, arrow: 'end' });
  });
  s.text('Connector – Skill – Tool', 960, 770, { size: 38, bold: true, align: 'c' });
  s.text('Manus · Dot · Muse', 960, 822, { size: 24, color: C.dim, align: 'c' });

  // future: every user's agent takes a different shape
  const cell = 40, shapes = [
    [[0, 0], [1, 0], [0, 1], [0, 2], [1, 2]],
    [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]],
    [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]],
  ];
  shapes.forEach((cells, k) => {
    const ox = 1358 + k * 164, oy = 426;
    cells.forEach(([cx, cy], j) => {
      const fill = [C.hot, C.cool, C.ink][k], x = ox + cx * cell, y = oy + cy * cell;
      if ((j + k) % 3 === 0) s.circle(x + cell / 2 - 2, y + cell / 2 - 2, cell / 2 - 3, { fill });
      else s.rect(x, y, cell - 5, cell - 5, { fill, fillAlpha: j % 2 ? 0.55 : 1, r: 9 });
    });
    s.text(['你的', '我的', '他的'][k], ox + 58, 606, { size: 24, color: C.dim, align: 'c' });
  });
  s.text('Dynamic Software', 1560, 770, { size: 38, bold: true, color: C.hot, align: 'c' });
  s.text('Claude Mods · DSH', 1560, 822, { size: 24, color: C.dim, align: 'c' });

  s.text([{ t: '能力设计 · 演变式设计', bold: true }, { t: '   >   ', color: C.mute }, { t: '产品设计', color: C.dim }], 960, 948, { size: 44, align: 'c' });
  return s;
}

/* 12 · The opportunities this era guarantees */
function opportunities() {
  const s = frame(new Slide(
    '时代中必然的机遇。\n\n' +
    'A. Agentic AI 将会整体改变人们工作的方式，会越来越重视 intelligence。Knowledge is to know the right answer, but intelligence is to know the right question. 但是，问对问题的关键，其实是每个人独特的生活体验。\n\n' +
    'B. 在现有的智能框架下，Agent 产品已经存在极大的发挥空间，大部分场景在 30B 模型下已经可以得到充分解决，而且模型蒸馏还会让它变小。\n\n' +
    'C. 多模态 AI 将会整体改变人们娱乐的方式，从创作者的一头一尾，最终做到消费即生成的真正个性化体验。',
  ), 'slope', [{ t: '时代中' }, { t: '必然', color: C.cool }, { t: '的机遇' }], 12);

  const cols = [100, 700, 1300], w = 520;
  cols.forEach((x, i) => {
    s.rect(x, 290, w, 650, { fill: C.panel, r: 30 });
    s.circle(x + 66, 356, 28, { stroke: C.cool, sw: 2.5 });
    s.text('ABC'[i], x + 66, 356, { size: 28, bold: true, color: C.cool, align: 'c' });
    s.text(['工作', 'Agent', '娱乐'][i], x + 114, 356, { size: 30, color: C.dim });
  });

  // A: answer → question
  s.text('!', 240, 560, { size: 210, bold: true, color: C.mute, align: 'c' });
  s.line(296, 570, 372, 570, { stroke: C.ink, sw: 5, arrow: 'end' });
  s.text('?', 470, 556, { size: 260, bold: true, color: C.hot, align: 'c' });
  s.text('Knowledge', 240, 722, { size: 26, color: C.dim, align: 'c' });
  s.text('right answer', 240, 758, { size: 22, color: C.mute, align: 'c' });
  s.text('Intelligence', 470, 722, { size: 30, bold: true, align: 'c' });
  s.text('right question', 470, 760, { size: 24, color: C.hot, align: 'c' });
  s.text('问对问题，靠独特的生活体验', 360, 870, { size: 28, bold: true, align: 'c' });

  // B: small models are enough, and shrinking
  s.circle(850, 560, 118, { stroke: C.mute, sw: 3, dash: 'dash' });
  s.line(972, 560, 1000, 560, { stroke: C.mute, sw: 3, arrow: 'end' });
  s.circle(1070, 560, 66, { fill: C.cool, fillAlpha: 0.14 });
  s.circle(1070, 560, 52, { fill: C.cool });
  s.text('30B', 1070, 560, { size: 32, bold: true, color: C.bg, align: 'c' });
  s.line(1138, 560, 1160, 560, { stroke: C.mute, sw: 3, arrow: 'end' });
  s.circle(1182, 560, 16, { stroke: C.cool, sw: 3 });
  s.text('前沿大模型', 850, 560, { size: 24, color: C.mute, align: 'c' });
  s.text('蒸馏', 1182, 606, { size: 22, color: C.dim, align: 'c' });
  s.text('30B 已经够用，还会更小', 960, 870, { size: 28, bold: true, align: 'c' });

  // C: consuming is generating
  s.circle(1420, 470, 13, { fill: C.mute });
  s.circle(1700, 470, 13, { fill: C.mute });
  s.line(1433, 470, 1687, 470, { stroke: C.mute, sw: 3 });
  s.text('创作', 1420, 426, { size: 24, color: C.dim, align: 'c' });
  s.text('消费', 1700, 426, { size: 24, color: C.dim, align: 'c' });
  s.line(1560, 500, 1560, 540, { stroke: C.mute, sw: 3, arrow: 'end' });
  arcArrow(s, 1560, 670, 104, -80, 250, { stroke: C.hot, sw: 6, head: 28 });
  s.text('消费\n即生成', 1560, 670, { size: 34, bold: true, align: 'c', lh: 1.05 });
  s.text('真正个性化的娱乐', 1560, 870, { size: 28, bold: true, align: 'c' });
  return s;
}

function stack(s, x, y, active, color) {
  ['Model', 'Context', 'Tool'].forEach((t, i) => {
    const on = t === active;
    s.rect(x, y + i * 84, 320, 68, { fill: on ? color : C.panel2, r: 16 });
    s.text(t, x + 160, y + i * 84 + 34, { size: 28, bold: on, color: on ? C.bg : C.mute, align: 'c' });
  });
}

/* 13 · Companionship or content */
function choice() {
  const s = frame(new Slide('陪伴和内容的选择。\n\n陪伴：围绕上下文，对应逗逗 AI 和 HakkoAI。\n内容：围绕 tool，对应 Cuddler。\n\n接下来两部分分别展开两条线的设计理念。'),
    'slope', [{ t: '陪伴', color: C.cool }, { t: ' 与 ' }, { t: '内容', color: C.hot }, { t: '：我们的选择' }], 13);
  [[100, '陪伴', 'Context', C.cool, '逗逗 AI · HakkoAI'], [1000, '内容', 'Tool', C.hot, 'Cuddler']].forEach(([x, name, layer, color, products]) => {
    s.rect(x, 290, 820, 650, { fill: C.panel, r: 30 });
    s.text(name, x + 56, 440, { size: 150, bold: true, color });
    s.text([{ t: '围绕 ', color: C.dim }, { t: layer, bold: true }], x + 64, 590, { size: 46 });
    stack(s, x + 440, 370, layer, color);
    s.line(x + 64, 760, x + 756, 760, { stroke: C.line, sw: 2 });
    s.text(products, x + 64, 846, { size: 50, bold: true });
  });
  return s;
}

/* 14 · Companionship: the moat is context */
function companion() {
  const s = frame(new Slide(
    '陪伴：围绕上下文的设计理念。三层：model – context – tool。\n\n' +
    'Model 层只要做 router 设计就可以。随着 model 的进展，产品应该越变越好，这要求快速、灵活、稳定。\n\n' +
    'Tool 层很薄。AI 自己可以改进自己，任何一个牛逼的 tool，在当天就会被其他 AI 复制到自身。\n\nAI 应用的壁垒，必须在 context 层。',
  ), 'slope', [{ t: '陪伴：壁垒必须在 ' }, { t: 'Context', color: C.cool }, { t: ' 层' }], 14);

  const x = 100, w = 880;
  s.rect(x, 300, w, 110, { fill: C.panel2, r: 22 });
  s.text('Model', x + 48, 355, { size: 40, bold: true });
  s.rect(x, 432, w, 380, { fill: C.cool, fillAlpha: 0.14, stroke: C.cool, sw: 4, r: 22 });
  s.text('Context', x + w / 2, 606, { size: 130, bold: true, color: C.cool, align: 'c' });
  s.text('壁垒', x + w / 2, 728, { size: 36, bold: true, align: 'c' });
  s.rect(x, 834, w, 56, { stroke: C.mute, sw: 2.5, dash: 'dash', r: 16 });
  s.text('Tool', x + 48, 862, { size: 28, color: C.dim });

  [[355, '只做 Router', '模型越强，产品越好 · 快速 · 灵活 · 稳定', C.ink], [622, 'AI 应用的壁垒', '必须在这一层', C.cool], [862, '很薄', '任何牛逼的 Tool，当天就被复制', C.ink]].forEach(([y, a, b, color], i) => {
    s.line(x + w + 16, y, 1076, y, { stroke: C.mute, sw: 2 });
    s.text(a, 1100, y - (i === 2 ? 0 : 22), { size: i === 1 ? 46 : 38, bold: true, color });
    s.text(b, i === 2 ? 1200 : 1100, y + (i === 2 ? 0 : i === 1 ? 34 : 28), { size: 26, color: C.dim });
  });
  return s;
}

/* 15 · Content: the C in AIGC */
function contentC() {
  const s = frame(new Slide(
    '内容：围绕 tool 的设计理念。\n\nAIGC 的关键是 C，也就是生成的到底是什么。Roleplay 本质还是生成文本；而娱乐性内容，本质都是故事，而且是有获得感、快乐感、共鸣感、节奏感的故事。\n\n但是，文本性质的娱乐内容一定是初级阶段的内容，下一阶段一定是视频乃至互动的形态。',
  ), 'slope', [{ t: '内容：AIGC 的关键是 ' }, { t: 'C', color: C.hot }], 15);

  s.text('C', 96, 590, { size: 440, bold: true, color: C.hot });
  s.text('= 故事', 420, 560, { size: 96, bold: true });
  ['获得感', '快乐感', '共鸣感', '节奏感'].forEach((t, i) => chip(s, t, 196 + i * 172, 850, { size: 28, fill: C.panel2, w: 156 }));

  // text → video → interactive
  const base = 930, steps = [['文本', 'Roleplay · 初级阶段', 170, C.panel2, C.dim], ['视频', '下一阶段', 330, C.panel2, C.ink], ['互动', '再往后', 500, C.hot, C.bg]];
  steps.forEach(([name, sub, h, fill, color], i) => {
    const x = 960 + i * 292;
    s.rect(x, base - h, 276, h, { fill, r: 22 });
    s.text(name, x + 36, base - h + 62, { size: 56, bold: true, color });
    s.text(sub, x + 38, base - h + 122, { size: 22, color: i === 2 ? C.bg : C.mute });
  });
  return s;
}

/* 16 · Content: the tool layer gets squeezed */
function squeezeLayers() {
  const s = frame(new Slide(
    '当前视频生成领域有三层。模型层：比如 Seedance 和 Kling。工具层：比如 OpenArt 和 TapNow。商业化层：比如红果和抖音。\n\n' +
    '模型层和商业化层会不断挤压工具层，导致工具层没有毛利。进一步，tool 的复制成本在 AI 时代变得极低：TapNow 做的 CineWorld，第二天 LibTV 就完成了上线；Higgsfield 的 Genjutsu，当天所有人都完成了复刻上线。\n\n' +
    '我们的方向，是走向商业化层，搭建视频创作和视频消费的商业化闭环。',
  ), 'slope', [{ t: '工具层没有毛利，走向' }, { t: '商业化层', color: C.cool }], 16);

  const x = 100, w = 860;
  s.rect(x, 300, w, 170, { fill: C.panel2, r: 24 });
  s.text('模型层', x + 50, 385, { size: 50, bold: true });
  s.text('Seedance · Kling', x + w - 50, 385, { size: 30, color: C.dim, align: 'r' });
  s.rect(x, 710, w, 170, { fill: C.cool, fillAlpha: 0.14, stroke: C.cool, sw: 4, r: 24 });
  s.text('商业化层', x + 50, 795, { size: 50, bold: true, color: C.cool });
  s.text('红果 · 抖音', x + w - 50, 795, { size: 30, color: C.dim, align: 'r' });
  s.rect(x, 562, w, 56, { stroke: C.hot, sw: 2.5, dash: 'dash', r: 16 });
  s.text('工具层', x + 50, 590, { size: 28, bold: true, color: C.hot });
  s.text('OpenArt · TapNow', x + w - 50, 590, { size: 24, color: C.dim, align: 'r' });
  [250, 530, 810].forEach((dx) => {
    s.line(x + dx, 486, x + dx, 548, { stroke: C.hot, sw: 5, arrow: 'end' });
    s.line(x + dx, 694, x + dx, 632, { stroke: C.hot, sw: 5, arrow: 'end' });
  });
  s.text('Tool 的复制成本 → 0，当天就被复刻', x, 944, { size: 28, color: C.dim });

  // our direction: a closed loop of creation and consumption
  const cx = 1440, cy = 600;
  s.text('我们的方向', cx, 330, { size: 28, color: C.dim, align: 'c' });
  arcArrow(s, cx, cy + 140, 260, -121, -57, { stroke: C.cool, sw: 5, head: 26 });
  arcArrow(s, cx, cy - 140, 260, 59, 123, { stroke: C.cool, sw: 5, head: 26 });
  [[cx - 220, '创作'], [cx + 220, '消费']].forEach(([px, t]) => { s.circle(px, cy, 104, { fill: C.panel2, stroke: C.cool, sw: 4 }); s.text(t, px, cy, { size: 48, bold: true, align: 'c' }); });
  s.text('商业化\n闭环', cx, cy, { size: 30, bold: true, color: C.cool, align: 'c', lh: 1.05 });
  s.text('Cuddler', cx, 880, { size: 60, bold: true, align: 'c' });
  return s;
}

/* 17 · Where the money comes from */
function money() {
  const s = frame(new Slide(
    '改善毛利：一个重要的问题，钱从哪里来。\n\n找到当前就有群体（可以小）正在付费的场景（也可以小），用 Agent 化去改造它，让它的效率好 10 倍，完成切换。\n\n' +
    '如果一个场景现在就没有人为它付费，就不要做。如果一个场景现在有人为它付费，但是 Agent 不能让它好十倍，就不要做。\n\n比如攻略，现在没人付费。比如客服，有人付费，可以好十倍。',
  ), 'slope', [{ t: '改善毛利：' }, { t: '钱', color: C.cool }, { t: '，从哪里来？' }], 17);

  const y = 560, g1 = 640, g2 = 1160, end = 1650;
  chip(s, '一个场景', 220, y, { size: 30, fill: C.panel2, w: 220, h: 84 });
  s.text('群体可以小 · 场景可以小', 220, y + 78, { size: 22, color: C.mute, align: 'c' });
  s.line(336, y, g1 - 96, y, { stroke: C.ink, sw: 4, arrow: 'end' });
  s.line(g1 + 92, y, g2 - 96, y, { stroke: C.cool, sw: 4, arrow: 'end' });
  s.line(g2 + 92, y, end - 96, y, { stroke: C.cool, sw: 4, arrow: 'end' });
  [[g1, '有人在\n付费？', '攻略', '没人付费'], [g2, '能好\n10 倍？', '', '好不了十倍']].forEach(([gx, q, ex, why]) => {
    s.path([['M', gx, y - 110], ['L', gx + 90, y], ['L', gx, y + 110], ['L', gx - 90, y], ['Z']], { fill: C.panel, stroke: C.ink, sw: 3 });
    s.text(q, gx, y, { size: 30, bold: true, align: 'c', lh: 1.05 });
    s.text('是', gx + 130, y - 30, { size: 26, bold: true, color: C.cool, align: 'c' });
    s.line(gx, y + 112, gx, y + 236, { stroke: C.hot, sw: 3, dash: 'dash', arrow: 'end' });
    s.text('否', gx + 30, y + 160, { size: 26, bold: true, color: C.hot });
    s.text('不做', gx, y + 280, { size: 44, bold: true, color: C.hot, align: 'c' });
    s.text(ex ? `${ex} · ${why}` : why, gx, y + 336, { size: 26, color: C.dim, align: 'c' });
  });
  s.circle(end, y, 124, { fill: C.cool, fillAlpha: 0.1 });
  s.circle(end, y, 92, { fill: C.cool });
  s.text('切入', end, y, { size: 52, bold: true, color: C.bg, align: 'c' });
  s.text('客服 · 有人付费 · 好十倍', end, y + 170, { size: 26, color: C.dim, align: 'c' });
  s.text('用 Agent 改造一个已经在付费的场景', 100, 300, { size: 30, color: C.dim });
  return s;
}

/* 18 · Using models efficiently */
function efficiency() {
  const s = frame(new Slide(
    '改善毛利：如何高效、低成本地利用模型，是一个 AI 应用技术的底色。\n\n' +
    '左图：简单任务，AI 远比人工便宜；面对复杂的循环任务，Token 消耗呈指数级增长，API 账单会反超人力成本。Agent 循环思考、多模态、长上下文，都在放大推理成本，推理成本正在反噬 AI 落地。\n\n' +
    '所以：高效地应用卡，高效地应用 API，匹配使用。',
  ), 'slope', [{ t: '改善毛利：把模型用得' }, { t: '又好又省', color: C.cool }], 18);

  const ax = 150, ay = 890, top = 320, right = 1010;
  s.line(ax, top, ax, ay, { stroke: C.mute, sw: 2 });
  s.line(ax, ay, right, ay, { stroke: C.mute, sw: 2, arrow: 'end' });
  s.text('累计成本', ax + 18, top + 4, { size: 22, color: C.mute });
  const human = (x) => ay - 40 - (x - ax) * 0.42;
  s.line(ax, human(ax), right - 30, human(right - 30), { stroke: C.dim, sw: 4 });
  const q = [[ax, ay - 12], [620, ay - 40], [820, 720], [930, 340]];
  s.path([['M', ...q[0]], ['C', ...q[1], ...q[2], ...q[3]]], { stroke: C.hot, sw: 6 });
  let cross = null;
  for (let t = 0.05; t <= 1; t += 0.002) { const p = bez(...q, t); if (p[1] <= human(p[0])) { cross = p; break; } }
  s.line(cross[0], cross[1], cross[0], ay + 14, { stroke: C.mute, sw: 2, dash: 'dot' });
  s.line(ax, ay, cross[0], ay, { stroke: C.cool, sw: 6 });
  s.line(cross[0], ay, right - 30, ay, { stroke: C.hot, sw: 6 });
  glow(s, cross[0], cross[1], 12, C.ink);
  s.text('成本交叉点', cross[0] - 30, cross[1] - 50, { size: 26, bold: true, align: 'r' });
  s.text('人力成本', 290, human(290) - 66, { size: 24, color: C.dim });
  s.text('Token 成本', 900, 330, { size: 24, bold: true, color: C.hot, align: 'r' });
  s.text('简单任务：AI 便宜', (ax + cross[0]) / 2, ay + 44, { size: 24, bold: true, color: C.cool, align: 'c' });
  s.text('复杂循环：反超人力', cross[0] + 12, ay + 44, { size: 24, bold: true, color: C.hot });

  s.line(1112, 300, 1112, 940, { stroke: C.line, sw: 2 });

  // match cards and APIs
  const cy = 590;
  s.circle(1360, cy, 170, { fill: C.cool, fillAlpha: 0.12, stroke: C.cool, sw: 3.5 });
  s.circle(1590, cy, 170, { fill: C.ink, fillAlpha: 0.06, stroke: C.ink, sw: 3.5 });
  s.text('卡', 1300, cy, { size: 96, bold: true, color: C.cool, align: 'c' });
  s.text('API', 1660, cy, { size: 72, bold: true, align: 'c' });
  s.text('匹配', 1475, cy, { size: 34, bold: true, color: C.hot, align: 'c' });
  s.text('高效用卡 × 高效用 API', 1475, 850, { size: 38, bold: true, align: 'c' });
  s.text('AI 应用技术的底色', 1475, 906, { size: 26, color: C.dim, align: 'c' });
  return s;
}

/* 19 · Operations is about people */
function operations() {
  const s = frame(new Slide('改善毛利：运营是运营人，是运营关系。必须用心对待客户，必须重视每一段跟客户的对话。'),
    'slope', [{ t: '运营，是运营人，是运营' }, { t: '关系', color: C.cool }], 19);
  const a = [380, 590], b = [1540, 590];
  [-270, -180, -90, 0, 90, 180, 270].forEach((d, i) => {
    const on = i === 2;
    s.path([['M', a[0] + 120, a[1]], ['C', a[0] + 420, a[1] + d, b[0] - 420, b[1] + d, b[0] - 120, b[1]]], { stroke: on ? C.cool : C.mute, sw: on ? 5 : 2, alpha: on ? 1 : 0.7 });
  });
  glow(s, 960, 590 - 90 * 0.75, 13, C.cool);
  s.text('每一段对话', 960, 590 - 90 * 0.75 - 54, { size: 28, bold: true, color: C.cool, align: 'c' });
  [[a, '我们'], [b, '客户']].forEach(([p, t]) => { s.circle(...p, 132, { fill: C.panel2, stroke: C.ink, sw: 3 }); s.text(t, p[0], p[1], { size: 60, bold: true, align: 'c' }); });
  s.text('用心对待客户，重视每一段对话', 960, 940, { size: 44, bold: true, align: 'c' });
  return s;
}

/* 20 · The AI-native organisation */
function organisation() {
  const s = frame(new Slide(
    'AI native 组织：不是岗位招人，而是任务找人。异动管理重构：\n\n' +
    '录：重点考察“认知弹性”与“自主学习速度”，而非静态技能集。\n升/降/调：打破层级变动，实现任务角色的动态重配，超级个体可在不同项目中自由切换核心角色。\n离：离职不再是背叛，而是能力网络节点的暂时断裂，以及知识资产的交接与再激活。\n\n' +
    '从“人岗匹配”到“任务–能力体匹配”：常规岗位描述瞬间失效，HR 转化为动态撮合需求的“任务经纪人”。超级个体面前，岗位已死，任务永生：个体就绪时自动接单，完成即重组。',
  ), 'plateau', [{ t: 'AI native 组织：' }, { t: '任务找人', color: C.cool }, { t: '，而非岗位招人' }], 20);

  const c = [1390, 620], radii = [220, 300, 380];
  radii.forEach((r) => s.circle(...c, r, { stroke: C.line, sw: 2.5 }));
  const rows = [['录', '看认知弹性与学习速度，不看静态技能', 380, 204], ['升 · 降 · 调', '角色动态重配，项目间自由切换', 580, 180], ['离', '不是背叛，是能力节点暂时断开', 780, 156]];
  rows.forEach(([tag, line, y, ang]) => {
    const [nx, ny] = polar(...c, 380, ang);
    s.line(130 + measure(line, 28), y + 38, nx - 16, ny, { stroke: C.mute, sw: 2 });
    glow(s, nx, ny, 13, C.cool);
    s.text(tag, 100, y - 26, { size: 56, bold: true, color: C.cool });
    s.text(line, 100, y + 38, { size: 28, color: C.dim });
  });
  [[220, 20], [220, 250], [300, 300], [300, 70], [380, -20], [380, 100], [220, 130], [300, 215]].forEach(([r, ang]) => { const [x, y] = polar(...c, r, ang); s.circle(x, y, 11, { fill: C.ink }); });
  s.circle(...c, 150, { fill: C.cool, fillAlpha: 0.08 });
  s.circle(...c, 122, { fill: C.panel2, stroke: C.ink, sw: 3 });
  s.text('任务市场', c[0], c[1], { size: 44, bold: true, align: 'c' });
  s.text('HR = 任务经纪人', c[0], c[1] + 178, { size: 24, color: C.dim, align: 'c' });
  s.text([{ t: '岗位已死，' }, { t: '任务永生', color: C.cool }], 100, 950, { size: 50, bold: true });
  return s;
}

/* 21 · The AI-native individual */
function individual() {
  const s = frame(new Slide(
    'AI native 个人：核心问题是时间、注意力和精力的错位。AI 时代，成功不再取决于拥有多少时间，而在于能否将时间、注意力、精力对齐。\n\n' +
    '注意力：易被劫持，需要主动定向。时间：线性、固定、无法储存。精力：波动起伏，可以恢复，也需要管理。\n\n' +
    '两两重合但缺一：忙而低效、焦点浪费、精力耗散。只有三者重合的中心，才是真正的产出。从“管理时间”转向“整合自身资源”。',
  ), 'plateau', [{ t: 'AI native 个人：注意力、时间、精力的' }, { t: '错配', color: C.hot }], 21);

  const r = 210, A = [960, 470], T = [810, 730], E = [1110, 730];
  [[A, C.ink], [T, C.ink], [E, C.ink]].forEach(([p, color]) => s.circle(...p, r, { fill: color, fillAlpha: 0.05, stroke: color, sw: 3 }));
  glow(s, 960, 648, 20, C.hot);
  s.text('注意力', A[0], A[1] - 104, { size: 50, bold: true, align: 'c' });
  s.text('易被劫持 · 需主动定向', A[0], A[1] - 50, { size: 22, color: C.dim, align: 'c' });
  s.text('时间', T[0] - 76, T[1] + 40, { size: 50, bold: true, align: 'c' });
  s.text('线性 · 固定\n无法储存', T[0] - 76, T[1] + 108, { size: 22, color: C.dim, align: 'c', lh: 1.05 });
  s.text('精力', E[0] + 76, E[1] + 40, { size: 50, bold: true, align: 'c' });
  s.text('波动起伏\n可恢复 · 需管理', E[0] + 76, E[1] + 108, { size: 22, color: C.dim, align: 'c', lh: 1.05 });
  [[[848, 588], [560, 500], '忙而低效', 'r'], [[1072, 588], [1360, 500], '焦点浪费', 'l'], [[960, 800], [960, 992], '精力耗散', 'c']].forEach(([from, to, label, align]) => {
    s.circle(...from, 7, { fill: C.dim });
    s.line(from[0], from[1], to[0] + (align === 'r' ? 14 : align === 'l' ? -14 : 0), to[1] - (align === 'c' ? 34 : 0), { stroke: C.dim, sw: 2 });
    chip(s, label, to[0] + (align === 'r' ? -90 : align === 'l' ? 90 : 0), to[1], { size: 30, fill: C.panel2, bold: true, w: 196 });
  });
  s.text([{ t: '从“管理时间”\n转向“' }, { t: '整合自身资源', color: C.hot }, { t: '”' }], 1440, 700, { size: 38, bold: true, lh: 1.15 });
  s.line(990, 648, 1420, 648, { stroke: C.hot, sw: 2, dash: 'dot' });
  return s;
}

/* 22 · Taste in human–machine collaboration */
function taste() {
  const s = frame(new Slide(
    '人机协作中的审美，到底是什么？\n\n所有 AI 可以学会（有数据）的地方，AI 都会超过人。可意会不可言传的，是 AI 永远学不会的。\n\n' +
    '矩阵：横轴是“可言传的 / 可意会不可言传的”，纵轴是“人类知晓 / 人类未知”。书本中来到书本中去的知识，AI 擅长，价值下降；靠体验、需要和人与自然互动才能理解的只可意会的知识，价值保鲜；人类未知的部分，一半是人工智能启发的创新，一半是无中生有的创新。灰色是人工智能已经占有的区域。\n\n' +
    '《庄子·外物》：筌者所以在鱼，得鱼而忘筌；蹄者所以在兔，得兔而忘蹄；言者所以在意，得意而忘言。',
  ), 'plateau', [{ t: '人机协作中的' }, { t: '审美', color: C.hot }, { t: '，到底是什么？' }], 22);

  const x0 = 290, y0 = 350, cw = 440, ch = 280;
  s.text('可言传', x0 + cw / 2, 308, { size: 28, color: C.dim, align: 'c' });
  s.text('可意会，不可言传', x0 + cw * 1.5, 308, { size: 28, bold: true, align: 'c' });
  s.text('人类\n知晓', 190, y0 + ch / 2, { size: 28, color: C.dim, align: 'c', lh: 1.05 });
  s.text('人类\n未知', 190, y0 + ch * 1.5, { size: 28, color: C.dim, align: 'c', lh: 1.05 });
  s.rect(x0, y0, cw, ch, { fill: C.mute, fillAlpha: 0.55 });
  s.rect(x0, y0 + ch, cw, ch, { fill: C.mute, fillAlpha: 0.22 });
  s.rect(x0 + cw, y0, cw, ch, { fill: C.cool, fillAlpha: 0.12 });
  s.rect(x0 + cw, y0 + ch, cw, ch, { fill: C.hot, fillAlpha: 0.12 });
  s.rect(x0, y0, cw * 2, ch * 2, { stroke: C.ink, sw: 3 });
  s.line(x0 + cw, y0, x0 + cw, y0 + ch * 2, { stroke: C.ink, sw: 3 });
  s.line(x0, y0 + ch, x0 + cw * 2, y0 + ch, { stroke: C.ink, sw: 3 });
  const cell = (cx, cy, a, b, colA, colB) => { s.text(a, cx, cy - 22, { size: 40, bold: true, color: colA, align: 'c' }); s.text(b, cx, cy + 36, { size: 24, color: colB, align: 'c' }); };
  cell(x0 + cw / 2, y0 + ch / 2, '书本知识', 'AI 擅长 · 价值下降', C.dim, C.dim);
  cell(x0 + cw * 1.5, y0 + ch / 2, '只可意会的体验', '价值保鲜', C.ink, C.cool);
  cell(x0 + cw / 2, y0 + ch * 1.5, 'AI 启发的创新', '人机混合', C.dim, C.dim);
  cell(x0 + cw * 1.5, y0 + ch * 1.5, '无中生有的创新', '0 → 1', C.ink, C.hot);
  s.rect(x0, 950, 30, 30, { fill: C.mute, fillAlpha: 0.55 });
  s.text('AI 已经占有', x0 + 44, 965, { size: 22, color: C.dim });

  const qx = 1280;
  s.text('有数据的地方，\nAI 都会超过人', qx, 400, { size: 44, bold: true, lh: 1.1 });
  s.line(qx, 520, qx + 80, 520, { stroke: C.hot, sw: 4 });
  s.text('筌者所以在鱼，得鱼而忘筌；\n蹄者所以在兔，得兔而忘蹄；', qx, 630, { size: 32, color: C.dim, lh: 1.25 });
  s.text([{ t: '言者所以在意，' }, { t: '得意而忘言', color: C.hot }, { t: '。' }], qx, 748, { size: 32, bold: true });
  s.text('《庄子 · 外物》', qx, 820, { size: 24, color: C.mute });
  return s;
}

/* 23 · How far to AGI */
function agi() {
  const s = frame(new Slide(
    '我们离 AGI 还有多远。\n\nA. Transformer 不太可能是 AGI 的技术架构，能源效率太低（人脑约 20 瓦，前沿 AI 集群是吉瓦级）。\n\n' +
    'B. 模型架构的主要研究，将集中于单位能量单元的智能效率。\n\nC. 能力的拓展，从依赖数据，到依赖自我改进，最终还是依赖数据。发现别人没有的数据，做最难获取的数据，永远是有价值的。',
  ), 'plateau', [{ t: '我们离 ' }, { t: 'AGI', color: C.hot }, { t: ' 还有多远？' }], 23);

  const cols = [100, 700, 1300], w = 520;
  cols.forEach((x, i) => {
    s.rect(x, 290, w, 650, { fill: C.panel, r: 30 });
    s.circle(x + 66, 356, 28, { stroke: C.hot, sw: 2.5 });
    s.text('ABC'[i], x + 66, 356, { size: 28, bold: true, color: C.hot, align: 'c' });
    s.text(['架构', '方向', '数据'][i], x + 114, 356, { size: 30, color: C.dim });
  });

  // A: 20 W brain vs gigawatt cluster
  s.circle(420, 590, 150, { fill: C.hot, fillAlpha: 0.1, stroke: C.hot, sw: 3.5 });
  s.text('GW', 420, 574, { size: 80, bold: true, color: C.hot, align: 'c' });
  s.text('AI 集群', 420, 640, { size: 24, color: C.dim, align: 'c' });
  glow(s, 196, 690, 9, C.cool);
  s.text('20 W', 196, 736, { size: 26, bold: true, color: C.cool, align: 'c' });
  s.text('人脑', 196, 770, { size: 20, color: C.dim, align: 'c' });
  s.text('Transformer ≠ AGI 架构', 360, 850, { size: 32, bold: true, align: 'c' });
  s.text('能源效率太低', 360, 896, { size: 24, color: C.dim, align: 'c' });

  // B: intelligence per unit of energy
  s.text('智能', 960, 500, { size: 110, bold: true, align: 'c' });
  s.line(820, 590, 1100, 590, { stroke: C.ink, sw: 5 });
  s.text('能量', 960, 686, { size: 110, bold: true, color: C.mute, align: 'c' });
  s.text('单位能量的智能效率', 960, 850, { size: 32, bold: true, align: 'c' });
  s.text('架构研究的主战场', 960, 896, { size: 24, color: C.dim, align: 'c' });

  // C: data → self-improvement → data
  const c = [1560, 580], r = 150;
  arcArrow(s, ...c, r, -62, 62, { stroke: C.dim, sw: 4, head: 24 });
  arcArrow(s, ...c, r, 118, 242, { stroke: C.dim, sw: 4, head: 24 });
  chip(s, '数据', c[0], c[1] - r, { size: 34, bold: true, fill: C.cool, color: C.bg, w: 170, h: 72 });
  chip(s, '自我改进', c[0], c[1] + r, { size: 30, bold: true, fill: C.panel2, stroke: C.ink, w: 210, h: 72 });
  s.text('最难获取的数据', 1560, 850, { size: 32, bold: true, align: 'c' });
  s.text('永远有价值', 1560, 896, { size: 24, color: C.dim, align: 'c' });
  return s;
}

/* 24 · Close */
function close() {
  const s = new Slide(
    '认清生活的本质，但是仍然热爱生活。——罗曼·罗兰\n\n英文通行译本：There is only one heroism in the world: to see the world as it is, and to love it.\n' +
    '法文原文（《米开朗琪罗传》）：Il n\'y a qu\'un héroïsme au monde : c\'est de voir le monde tel qu\'il est, et de l\'aimer.\n\n回到本期：看清周期、成本和自己的局限之后，仍然认真做产品，认真对待客户。',
  );
  const h = hype(-60, 800, 2040, 240);
  s.path(h.segs, { stroke: C.line, sw: 4 });
  glow(s, ...h.at(2, 0.5), 11, C.cool);
  s.text('There is only one heroism in the world:', 150, 300, { size: 54, font: SERIF, italic: true, color: C.dim });
  s.text('to see the world as it is,', 146, 430, { size: 112, font: SERIF });
  s.text('and to love it.', 146, 570, { size: 112, font: SERIF, color: C.hot });
  s.text('— Romain Rolland', 150, 700, { size: 36, font: SERIF, italic: true, color: C.dim });
  s.text('认清生活的本质，但是仍然热爱生活', 1770, 702, { size: 28, color: C.mute, align: 'r' });
  return s;
}

export const part2 = () => [dynamic(), opportunities(), choice(), companion(), contentC(), squeezeLayers(), money(), efficiency(), operations(), organisation(), individual(), taste(), agi(), close()];
