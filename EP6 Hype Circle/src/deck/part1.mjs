// Slides 00–10: the peak, the trough, and how to keep improving the product.
import { Slide, C, bez, polar, arcArrow, head, glow, chip, hype, measure } from './lib.mjs';

const STAGES = {
  peak: { label: 'PEAK', at: [0, 1], color: C.hot },
  trough: { label: 'TROUGH', at: [1, 1], color: C.ink },
  slope: { label: 'SLOPE', at: [2, 0.42], color: C.cool },
  plateau: { label: 'PLATEAU', at: [2, 0.96], color: C.cool },
};

/** Running head, stage tracker, title and page number shared by content slides. */
export function frame(s, stage, title, page) {
  s.text('HYPE CIRCLE · EP06', 100, 76, { size: 20, color: C.mute, spacing: 2 });
  if (stage) {
    const st = STAGES[stage], h = hype(1660, 48, 160, 54);
    s.path(h.segs, { stroke: C.mute, sw: 2.5 });
    const [dx, dy] = h.at(...st.at);
    s.circle(dx, dy, 9, { fill: st.color });
    s.text(st.label, 1636, 76, { size: 20, color: C.mute, spacing: 2, align: 'r' });
  }
  if (title) s.text(title, 100, 184, { size: 68, bold: true });
  if (page != null) s.text(String(page).padStart(2, '0'), 1820, 1036, { size: 20, color: C.mute, align: 'r' });
  return s;
}

/* 00 · Cover */
function cover() {
  const s = new Slide('开场。Hype Circle：AI 技术周期的趋势。Agentic Thinking EP06，Oratis，2026 年 11 月 18 日。');
  const h = hype(820, 250, 1040, 620);
  s.path(h.segs, { stroke: C.line, sw: 5 });
  s.path(h.part(0), { stroke: C.hot, sw: 6 });
  glow(s, ...h.at(0, 1), 13, C.hot);
  s.text('AGENTIC THINKING · EP06', 104, 250, { size: 24, color: C.mute, spacing: 3 });
  s.text('Hype\nCircle', 96, 500, { size: 196, bold: true, lh: 0.84 });
  s.text('AI 技术周期的趋势', 104, 760, { size: 50, color: C.dim });
  s.text('Oratis · 2026.11.18', 104, 960, { size: 28, color: C.mute });
  return s;
}

/* 01 · Gartner Hype Cycle for Agentic AI, redrawn as editable objects */
function whereWeAre() {
  const s = new Slide(
    '只讲两件事。第一，2022 年 11 月 30 日，ChatGPT 时刻，这一轮周期的起点。第二，where we are：我们正站在 Peak of anticipation，期望膨胀的顶点。\n\n' +
    '图为 Gartner Hype Cycle for Agentic AI（2026 年 4 月）的重绘版，30 个技术点的位置与成熟时间按原图标注，Agentic AI、AI Coding Agents、MCP 都挤在峰顶。Gartner 原图的阶段名是 Peak of Inflated Expectations。原图 PNG 保存在 src/deck/gartner-agentic-ai-2026.png，需要时可直接替换。',
  );
  const gx = (x) => 330 + (x - 185) * 1.44, gy = (y) => 150 + (y - 210) * 1.271;
  const curve = [
    [[150, 800], [215, 750], [360, 400], [425, 315]],
    [[425, 315], [444, 290], [468, 288], [490, 297]],
    [[490, 297], [560, 326], [585, 718], [672, 718]],
    [[672, 718], [800, 718], [860, 530], [1190, 505]],
  ].map((q) => q.map(([x, y]) => [gx(x), gy(y)]));

  s.text([{ t: 'Hype Cycle for Agentic AI', bold: true }, { t: '   Gartner · April 2026', color: C.mute }], 100, 56, { size: 26 });
  // legend
  s.text('Time to plateau', 1478, 56, { size: 18, color: C.mute, align: 'r' });
  [['< 2 yrs', 0, 1506], ['2–5 yrs', 1, 1614], ['5–10 yrs', 2, 1726]].forEach(([t, kind, x]) => { dot(s, x, 56, kind); s.text(t, x + 16, 56, { size: 18, color: C.dim }); });

  // plot frame and phases
  const bounds = [100, gx(388), gx(538), gx(748), gx(1008), 1820];
  ['Innovation\nTrigger', 'Peak of Inflated\nExpectations', 'Trough of\nDisillusionment', 'Slope of\nEnlightenment', 'Plateau of\nProductivity'].forEach((name, i) => {
    s.text(name, (bounds[i] + bounds[i + 1]) / 2, 112, { size: 18, color: i === 1 ? C.hot : C.mute, align: 'c' });
    if (i > 0) s.line(bounds[i], 150, bounds[i], 900, { stroke: C.line, sw: 1.5 });
  });
  s.line(100, 150, 100, 900, { stroke: C.mute, sw: 2 });
  s.line(100, 900, 1820, 900, { stroke: C.mute, sw: 2, arrow: 'end' });
  s.text('EXPECTATIONS', 112, 168, { size: 15, color: C.mute, spacing: 3 });
  s.text('TIME', 1800, 928, { size: 17, color: C.mute, spacing: 3, align: 'r' });

  s.path([['M', ...curve[0][0]], ...curve.map((q) => ['C', ...q[1], ...q[2], ...q[3]])], { stroke: 'D4D4DC', sw: 4 });

  // technologies: [name, x, y, kind, right-side label position]
  const tech = [
    ['Computer Use for AI Agents', 190, 775, 2, [412, 874]], ['Guardian Agent', 206, 762, 1], ['Agent Development Life Cycle', 222, 745, 2, [462, 846]],
    ['Agent Orchestration', 226, 738, 2, [478, 818]], ['Agent Experience', 231, 728, 1], ['Agentic Browser', 240, 711, 1], ['FinOps for Agentic AI', 253, 684, 1],
    ['Agentic Commerce', 263, 660, 2], ['Continual Learning', 273, 634, 2], ['AI Agents in Software Engineering', 277, 622, 2], ['Agent Marketplace', 295, 571, 2],
    ['AI Agent Communication Protocols', 303, 548, 2], ['Agent Management Platform', 308, 532, 1], ['Embodied AI', 317, 505, 1],
    ['Human-Agent Collaboration Workspace', 340, 442, 0], ['Context Graphs', 352, 413, 1], ['Domain-Specific AI Agents', 357, 404, 1], ['World Models', 366, 388, 2],
    ['AI Agent Development Platform', 369, 380, 1], ['Polyfunctional Robots', 385, 355, 1], ['Agentic AI Governance', 393, 343, 1], ['Enterprise AI Assistants', 402, 332, 1],
    ['No-Code Agent Builders', 419, 318, 0], ['Agentic AI Security', 427, 311, 1], ['Agentic Analytics', 439, 304, 1], ['Multiagent Systems', 447, 300, 2],
    ['Machine Customers', 457, 298, 1, [650, 344]], ['AI Coding Agents', 463, 297, 1, [806, 170]], ['Agentic AI', 468, 297, 1, [820, 201]], ['Model Context Protocol', 487, 297, 1, [834, 232]],
  ];
  // snap every dot onto the drawn curve
  const samples = [];
  for (const q of curve.slice(0, 2)) for (let t = 0; t <= 1; t += 0.002) samples.push(bez(...q, t));
  const placed = tech.map(([name, x, y, kind, right]) => {
    const tx = gx(x), ty = gy(y);
    const [px, py] = samples.reduce((best, p) => (Math.hypot(p[0] - tx, p[1] - ty) < Math.hypot(best[0] - tx, best[1] - ty) ? p : best));
    return { name, x: px, y: py, kind, right };
  });
  // left labels fan out so they never overlap
  const left = placed.filter((d) => !d.right).sort((a, b) => a.y - b.y), gap = 25.5;
  const blocks = [];
  left.forEach((d, i) => {
    blocks.push({ start: i, n: 1, sum: d.y });
    while (blocks.length > 1) {
      const b = blocks.at(-1), a = blocks.at(-2);
      if (a.sum / a.n + a.n * gap <= b.sum / b.n) break;
      blocks.pop(); a.sum += b.sum - b.n * a.n * gap; a.n += b.n;
    }
  });
  blocks.forEach((b) => { for (let j = 0; j < b.n; j++) left[b.start + j].ly = b.sum / b.n + j * gap; });
  left.forEach((d) => {
    const rx = d.x - 40;
    s.line(rx + 8, d.ly, d.x - 8, d.y, { stroke: C.mute, sw: 1.5 });
    s.text(d.name, rx, d.ly, { size: 18, color: C.dim, align: 'r' });
  });
  placed.filter((d) => d.right).forEach((d) => {
    const [lx, ly] = d.right, hotLabel = ly < 260;
    const below = ly > d.y + 30 && lx > 600, twoLine = d.name.includes('\n');
    if (below) s.line(lx + 26, ly - (twoLine ? 30 : 16), d.x + 2, d.y + 9, { stroke: C.mute, sw: 1.5 });
    else s.line(lx - 8, ly, d.x + 7, d.y + (ly < d.y - 12 ? -5 : 2), { stroke: C.mute, sw: 1.5 });
    s.text(d.name, lx, ly, { size: hotLabel ? 21 : 18, color: hotLabel ? C.ink : C.dim, bold: hotLabel });
  });

  // where we are
  const peak = placed[28];
  s.circle(peak.x - 4, peak.y, 50, { fill: C.hot, fillAlpha: 0.14, stroke: C.hot, sw: 3 });
  placed.forEach((d) => dot(s, d.x, d.y, d.kind));
  s.line(1168, 262, peak.x + 52, 262, { stroke: C.hot, sw: 3, arrow: 'end' });
  s.text('WHERE WE ARE', 1190, 262, { size: 78, bold: true, color: C.hot });
  s.text('Peak of anticipation', 1194, 346, { size: 46 });

  // the ChatGPT moment
  const [ox, oy] = curve[0][0];
  s.line(ox, oy, ox, 1024, { stroke: C.hot, sw: 2.5 });
  glow(s, ox, oy, 10, C.hot);
  s.text('2022.11.30', ox + 26, 968, { size: 62, bold: true });
  s.text('ChatGPT moment', ox + 372, 974, { size: 34, color: C.hot });
  s.text('Source: Gartner (April 2026), redrawn', 1820, 1036, { size: 18, color: C.mute, align: 'r' });
  return s;
}

function dot(s, x, y, kind) {
  if (kind === 0) s.circle(x, y, 7, { fill: C.bg, stroke: C.ink, sw: 2 });
  else s.circle(x, y, 7.5, { fill: kind === 1 ? 'C9D6EA' : '5B7BA8' });
}

/* 02 · Climbing the peak */
function climbing() {
  const s = frame(new Slide(
    '页面分两部分。\n\n左：在期望膨胀期，天时（行业的技术预期）、地利（模型的技术能力）、人和（团队的产品能力）三者结合，才能产出 Seedance、Claude Code 这样的爆款。特征是增长极快，并且用增长继续讲故事，比如 OpenAI 和 AGI 的故事。\n\n' +
    '右：这个时期最容易出现的情况就是过度承诺。我们做逗逗 AI 的时候也有这个问题，因为这个阶段的打法就是：讲故事 → 验证增长 → 延伸故事 的循环。\n\n但是，这个阶段即将结束。',
  ), 'peak', [{ t: 'Peak of anticipation ' }, { t: '爬坡', color: C.hot }], 2);

  // recipe: three conditions aligned → breakout
  [['天时', '行业预期', 400], ['地利', '模型能力', 590], ['人和', '产品能力', 780]].forEach(([a, b, y]) => {
    s.circle(190, y, 82, { stroke: C.ink, sw: 2.5, fill: C.panel });
    s.text(a, 190, y - 14, { size: 40, bold: true, align: 'c' });
    s.text(b, 190, y + 30, { size: 20, color: C.dim, align: 'c' });
    s.line(278, y, 468, 590 + (y - 590) * 0.12, { stroke: C.mute, sw: 2 });
  });
  s.circle(490, 590, 16, { fill: C.hot });
  s.path([['M', 490, 590], ['C', 660, 590, 780, 560, 850, 330]], { stroke: C.hot, sw: 7 });
  head(s, 858, 305, -72, C.hot, 34);
  s.text('爆款', 640, 400, { size: 84, bold: true, color: C.hot, align: 'c' });
  s.text('Seedance · Claude Code', 700, 700, { size: 34, bold: true, align: 'c' });
  s.text('用增长，继续讲故事', 700, 756, { size: 26, color: C.dim, align: 'c' });

  s.line(960, 300, 960, 940, { stroke: C.line, sw: 2 });

  // the loop
  const cx = 1420, cy = 580, r = 210, nodes = [['讲故事', -90], ['验证增长', 30], ['延伸故事', 150]];
  nodes.forEach(([, a]) => arcArrow(s, cx, cy, r, a + 26, a + 94, { stroke: C.hot, sw: 5, head: 26 }));
  nodes.forEach(([label, a]) => {
    const [x, y] = polar(cx, cy, r, a);
    s.circle(x, y, 84, { fill: C.panel2, stroke: C.ink, sw: 2.5 });
    s.text(label, x, y, { size: 32, bold: true, align: 'c' });
  });
  s.text('过度承诺', cx, cy + 6, { size: 46, bold: true, color: C.hot, align: 'c' });
  s.text('逗逗 AI 也踩过', cx, cy + 62, { size: 22, color: C.dim, align: 'c' });
  s.text([{ t: '但这个阶段，' }, { t: '即将结束', color: C.hot }], cx, 952, { size: 44, bold: true, align: 'c' });
  return s;
}

/* 03 · China's open-source AI breaks the cycle */
function china() {
  const s = frame(new Slide(
    '中国开源 AI 正在打破美国创新周期（西方科技创新资本市场）的底层逻辑：从技术突破（0→1）到市场突破之间的时间 Gap 变短，技术红利期变短，一级市场融资红利期也随之变短。这缩短了期望膨胀期。\n\n' +
    '美国 AI：贵族式。尖端芯片 + 计算能力，但缺电。\n中国 AI：平民式。开源 + 低成本 + 许可宽松，但少芯。',
  ), 'peak', [{ t: '中国开源 AI，正在' }, { t: '打破', color: C.hot }, { t: '美国的创新周期' }], 3);

  // the timeline: 0 → 1 (tech) ⇢ 1 (market) → N
  const y = 400, x0 = 150, x1 = 540, x2 = 1090, x3 = 1520, x4 = 1770;
  s.line(x0, y, x1, y, { stroke: C.ink, sw: 5 });
  s.line(x1, y, x2, y, { stroke: C.ink, sw: 5, dash: 'dash' });
  s.line(x2, y, x4 - 16, y, { stroke: C.ink, sw: 5, arrow: 'end' });
  [[x0, '0'], [x1, '1'], [x2, '1'], [x4, 'N']].forEach(([x, t]) => { s.circle(x, y, 15, { fill: C.bg, stroke: C.ink, sw: 4 }); s.text(t, x, y - 52, { size: 34, bold: true, align: 'c' }); });
  head(s, x3, y - 4, -90, C.hot, 34);
  s.text('技术突破', x1, y + 62, { size: 30, color: C.dim, align: 'c' });
  s.text('市场突破', x2, y + 62, { size: 30, color: C.dim, align: 'c' });
  squeeze(s, x1, x2, y + 150, '时间 Gap 变短');
  squeeze(s, x2, x3, y - 116, '技术红利期变短');

  // two styles
  const card = (x, name, style, strengths, weak, tri) => {
    s.rect(x, 640, 800, 320, { fill: C.panel, r: 30 });
    s.path([['M', x + 140, 890], ['L', x + 140 - tri[0] / 2, 890], ['L', x + 140, 890 - tri[1]], ['L', x + 140 + tri[0] / 2, 890], ['Z']], { stroke: C.ink, sw: 3, fill: C.panel2 });
    s.text(name, x + 300, 700, { size: 26, color: C.dim });
    s.text(style, x + 298, 772, { size: 68, bold: true });
    let cx = x + 300;
    strengths.forEach((t) => { const w = measure(t, 26) + 44; chip(s, t, cx + w / 2, 890, { fill: C.panel2, size: 26, w }); cx += w + 14; });
    s.text('瓶颈', x + 740, 700, { size: 24, color: C.mute, align: 'r' });
    s.text(weak, x + 744, 772, { size: 68, bold: true, color: C.hot, align: 'r' });
  };
  card(100, '美国 AI', '贵族式', ['尖端芯片', '计算能力'], '缺电', [90, 210]);
  card(1020, '中国 AI', '平民式', ['开源', '低成本', '许可宽松'], '少芯', [230, 110]);
  s.text('VS', 960, 800, { size: 30, bold: true, color: C.mute, align: 'c' });
  return s;
}

/** A span being squeezed from both sides. */
function squeeze(s, xa, xb, y, label) {
  const mid = (xa + xb) / 2, w = measure(label, 30, true) / 2 + 26;
  s.line(xa, y, mid - w, y, { stroke: C.hot, sw: 3, arrow: 'end' });
  s.line(xb, y, mid + w, y, { stroke: C.hot, sw: 3, arrow: 'end' });
  s.line(xa, y - 22, xa, y + 22, { stroke: C.hot, sw: 3 });
  s.line(xb, y - 22, xb, y + 22, { stroke: C.hot, sw: 3 });
  s.text(label, mid, y, { size: 30, bold: true, color: C.hot, align: 'c' });
}

/* 04 · Energy is the bottleneck */
function energy() {
  const s = frame(new Slide(
    '一方面，中国发电量是美国的 2 倍以上（Energy Institute《世界能源统计年鉴》2024 年口径：中国约 10,087 TWh，美国约 4,635 TWh，约 2.2 倍）。\n\n' +
    '另一方面，AI 的极度耗能已经形成发展的瓶颈。预计 2027 年，维持全球 AI 推理的成本将达到 25 万亿美元，超过美国的 GDP。\n\n' +
    '⚠ 待核实：没有找到“25 万亿美元”的公开出处。已知口径里，Gartner 预计 2026 年全球 AI 总支出约 2.5 万亿美元；美国 GDP 约 30 万亿美元。上台前请确认这个数字和“超过美国 GDP”的说法。',
  ), 'peak', [{ t: 'AI 的瓶颈，是' }, { t: '电', color: C.hot }], 4);

  // generation bars
  const base = 900, scale = 520 / 10087;
  s.text('年发电量 · TWh · 2024', 150, 300, { size: 24, color: C.mute });
  [['中国', 10087, 210, C.cool], ['美国', 4635, 470, C.mute]].forEach(([name, v, x, color]) => {
    const h = v * scale;
    s.rect(x, base - h, 190, h, { fill: color, r: 14 });
    s.text(v.toLocaleString('en-US'), x + 95, base - h - 36, { size: 34, bold: true, align: 'c' });
    s.text(name, x + 95, base + 44, { size: 32, color: C.dim, align: 'c' });
  });
  s.line(150, base, 730, base, { stroke: C.mute, sw: 2 });
  s.text('2.2×', 712, 560, { size: 112, bold: true, color: C.cool });

  s.line(1030, 300, 1030, 940, { stroke: C.line, sw: 2 });

  // inference cost curve crossing US GDP
  const ax = 1100, ay = 880, top = 330, right = 1800;
  s.line(ax, top, ax, ay, { stroke: C.mute, sw: 2 });
  s.line(ax, ay, right, ay, { stroke: C.mute, sw: 2, arrow: 'end' });
  s.line(ax, 520, right - 20, 520, { stroke: C.dim, sw: 2.5, dash: 'dash' });
  s.text('美国 GDP', right - 20, 488, { size: 26, color: C.dim, align: 'r' });
  const q = [[ax, ay - 14], [1420, ay - 30], [1560, 760], [1660, 400]];
  s.path([['M', ...q[0]], ['C', ...q[1], ...q[2], ...q[3]]], { stroke: C.hot, sw: 6 });
  let cross = q[0];
  for (let t = 0; t <= 1; t += 0.002) { const p = bez(...q, t); if (p[1] <= 520) { cross = p; break; } }
  s.line(cross[0], 520, cross[0], ay, { stroke: C.hot, sw: 2, dash: 'dot' });
  glow(s, cross[0], 520, 11, C.hot);
  s.text('2027', cross[0], ay + 40, { size: 30, bold: true, color: C.hot, align: 'c' });
  s.text('全球 AI 推理成本', 1140, 372, { size: 28, color: C.dim });
  s.text('25 万亿美元', 1136, 440, { size: 68, bold: true, color: C.hot });
  chip(s, '数据待核实', 1228, 608, { size: 20, color: C.mute, stroke: C.mute, sw: 1.5, dash: 'dash' });
  return s;
}

/* 05 · Who survives the trough */
function trough() {
  const s = frame(new Slide(
    '而在幻灭低谷期，只有坚持改进产品、并视毛利为运营生命线的企业才可以存活。\n\n那么，我们的主线目标非常确定：坚持改进产品，坚持改进商业化模型。接下来讲怎么做。',
  ), 'trough', [{ t: '幻灭低谷期，谁能' }, { t: '活下来', color: C.cool }, { t: '？' }], 5);

  const h = hype(100, 330, 1720, 560);
  s.path(h.segs, { stroke: C.mute, sw: 5 });
  s.path(h.part(2), { stroke: C.cool, sw: 6 });
  // the ones that fall through
  let seed = 7;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const [tx, ty] = h.at(1, 1);
  for (let i = 0; i < 46; i++) {
    const dx = (rnd() - 0.5) * 520, dy = 34 + rnd() * 120 + Math.abs(dx) * 0.05;
    s.circle(tx + dx * 0.8, ty + dy, 5 + rnd() * 7, { fill: C.mute, fillAlpha: 0.25 + rnd() * 0.45 });
  }
  const [px, py] = h.at(0, 1);
  s.circle(px, py, 13, { fill: C.hot });
  s.text('现在', px, py - 44, { size: 26, color: C.hot, bold: true, align: 'c' });
  // the two that climb out
  [[0.34, '1'], [0.56, '2']].forEach(([t, label]) => {
    const [x, y] = h.at(2, t);
    glow(s, x, y, 24, C.cool);
    s.text(label, x, y, { size: 28, bold: true, color: C.bg, align: 'c' });
  });
  [['1', '坚持改进产品', 392], ['2', '视毛利为生命线', 492]].forEach(([k, t, y]) => {
    s.circle(1034, y, 26, { fill: C.cool });
    s.text(k, 1034, y, { size: 28, bold: true, color: C.bg, align: 'c' });
    s.text(t, 1084, y, { size: 60, bold: true });
  });
  return s;
}

/* 06 · The model-is-the-product paradox */
function paradox() {
  const s = frame(new Slide(
    'Andrej Karpathy 的 Software 1.0 → 3.0：1.0 是人写代码，2.0 是训练出来的权重，3.0 是用自然语言（Prompt）给模型编程。\n\n' +
    'MenuGen：Karpathy 2025 年 vibe coding 做的 App，拍一张菜单，生成每道菜的图片。他回顾说最难的不是代码，而是把支付、登录、数据库、域名、部署这些服务拼起来（见 2026 年 3 月 26 日的推文，引用 Patrick Collison 的“像拼宜家家具”）。' +
    '到 2026 年，把菜单照片直接丢给 Gemini，就能在菜单上叠出菜品图，他在 Sequoia AI Ascent 2026 上说 “That app shouldn\'t exist.”。App 直接被模型吃掉了。\n\n' +
    'Agent 产品在哪里找增长？找到一个高付费的小群体对应的小产品，直接做成 Agent 的 use case，完成切入。',
  ), 'slope', [{ t: '模型即产品的' }, { t: '悖论', color: C.hot }], 6);

  // Software 1.0 → 3.0
  s.text('SOFTWARE · ANDREJ KARPATHY', 100, 296, { size: 20, color: C.mute, spacing: 3 });
  [['1.0', '代码', 100], ['2.0', '权重', 440], ['3.0', 'Prompt', 780]].forEach(([v, word, x], i) => {
    s.text(v, x, 386, { size: 110, bold: true, color: i === 2 ? C.hot : C.ink });
    s.text(word, x + 6, 474, { size: 34, color: i === 2 ? C.ink : C.dim });
    if (i < 2) s.line(x + 232, 386, x + 306, 386, { stroke: C.mute, sw: 4, arrow: 'end' });
  });

  // MenuGen: the app gets eaten
  s.rect(100, 566, 440, 330, { stroke: C.mute, sw: 2.5, dash: 'dash', r: 30 });
  s.text('MenuGen App · 2025', 320, 612, { size: 26, color: C.dim, align: 'c' });
  ['Auth', 'Payments', 'Database', 'API Keys', 'Domain', 'Deploy'].forEach((t, i) => chip(s, t, 216 + (i % 2) * 208, 688 + Math.floor(i / 2) * 70, { size: 22, color: C.dim, fill: C.panel2, w: 184, h: 52, r: 12 }));
  s.line(566, 730, 676, 730, { stroke: C.hot, sw: 5, arrow: 'end' });
  s.circle(860, 730, 164, { fill: C.hot, fillAlpha: 0.08 });
  s.circle(860, 730, 134, { fill: C.hot, fillAlpha: 0.14, stroke: C.hot, sw: 4 });
  s.text('模型', 860, 708, { size: 64, bold: true, align: 'c' });
  s.text('菜单照片 → 菜品图', 860, 778, { size: 22, color: C.dim, align: 'c' });
  s.text([{ t: 'App 被模型吃掉', bold: true, color: C.hot }, { t: '   “That app shouldn’t exist.”', color: C.dim, italic: true }], 100, 950, { size: 30 });

  // where agent products find growth
  s.rect(1130, 290, 690, 650, { fill: C.panel, r: 30 });
  s.text('Agent 产品，去哪找增长？', 1180, 356, { size: 34, bold: true });
  s.circle(1475, 610, 190, { stroke: C.mute, sw: 2, dash: 'dash' });
  s.text('大市场', 1475, 458, { size: 22, color: C.mute, align: 'c' });
  glow(s, 1475, 610, 30, C.cool);
  s.text('高付费的小群体', 1475, 716, { size: 26, bold: true, align: 'c' });
  s.text([{ t: '小产品 → Agent use case → ' }, { t: '切入', color: C.cool, bold: true }], 1475, 870, { size: 28, align: 'c' });
  return s;
}

/* 07 · Where the application layer wins */
function appLayer() {
  const s = frame(new Slide(
    '如果模型即产品，那么应用层的机会在哪？\n\nAI 应用必须贴合模型的能力和发展方向，但要建立自己差异化的护城河、商业模式和流量模式。\n\n' +
    '贴合模型：LLM 在走 Agentic 方向，DiT 模型在走三角循环。\n\n三个方面：Model（Router）— Asset（Context）— Tool（Dynamic）。后面三页分别展开。',
  ), 'slope', [{ t: '模型即产品，应用层的' }, { t: '机会', color: C.cool }, { t: '在哪？' }], 7);

  const w = 546, top = 300, hgt = 430;
  [['MODEL', 'Router', 100], ['ASSET', 'Context', 687], ['TOOL', 'Dynamic', 1274]].forEach(([tag, word, x], i) => {
    s.rect(x, top, w, hgt, { fill: C.panel, r: 30 });
    s.text(tag, x + 48, top + 62, { size: 24, color: C.mute, spacing: 4 });
    s.text(word, x + 44, top + hgt - 86, { size: 92, bold: true });
    const cx = x + w - 150, cy = top + 150;
    if (i === 0) {
      [-70, 0, 70].forEach((dy, j) => { s.line(cx - 80, cy, cx + 70, cy + dy, { stroke: j === 1 ? C.cool : C.mute, sw: 3 }); s.circle(cx + 82, cy + dy, 13, { fill: j === 1 ? C.cool : C.mute }); });
      s.circle(cx - 80, cy, 20, { fill: C.ink });
    } else if (i === 1) {
      [86, 58, 30].forEach((r, j) => s.circle(cx, cy, r, j === 2 ? { fill: C.cool } : { stroke: C.mute, sw: 3 }));
    } else {
      s.rect(cx - 96, cy - 28, 56, 56, { stroke: C.mute, sw: 3 });
      s.rect(cx - 28, cy - 28, 56, 56, { stroke: C.mute, sw: 3, r: 18 });
      s.circle(cx + 68, cy, 28, { fill: C.cool });
    }
  });
  s.text('自己的 护城河 · 商业模式 · 流量模式', 1820, 184, { size: 26, color: C.dim, align: 'r' });

  // the current the app must ride
  const y = 790, hh = 150;
  s.path([['M', 100, y], ['L', 1730, y], ['L', 1820, y + hh / 2], ['L', 1730, y + hh], ['L', 100, y + hh], ['Z']], { fill: C.panel2 });
  s.text('贴合模型的方向', 148, y + hh / 2, { size: 26, color: C.dim });
  s.text([{ t: 'LLM → ', color: C.dim }, { t: 'Agentic', bold: true }], 640, y + hh / 2, { size: 40 });
  s.text([{ t: 'DiT → ', color: C.dim }, { t: '三角循环', bold: true }], 1180, y + hh / 2, { size: 40 });
  const tc = [1560, y + hh / 2 + 6];
  [0, 1, 2].forEach((i) => { const a = polar(...tc, 40, -90 + i * 120), b = polar(...tc, 40, 30 + i * 120); s.line(a[0], a[1], b[0], b[1], { stroke: C.ink, sw: 3, arrow: 'end' }); });
  return s;
}

/* 08 · The impossible triangle */
function triangle() {
  const s = frame(new Slide('模型的不可能三角：成本、速度、效果，三者不可兼得，只能三选二。要效果又要速度，就贵；要效果又要便宜，就慢；要便宜又要快，效果就差。这是下一页 Model Router 的前提。'),
    'slope', [{ t: '模型的' }, { t: '不可能三角', color: C.hot }], 8);
  const A = [960, 326], B = [520, 920], D = [1400, 920];
  s.path([['M', ...A], ['L', ...D], ['L', ...B], ['Z']], { fill: C.panel, stroke: C.ink, sw: 4 });
  [[A, '效果', 0, -64], [B, '成本', -110, 6], [D, '速度', 110, 6]].forEach(([p, t, dx, dy]) => {
    glow(s, p[0], p[1], 15, C.ink);
    s.text(t, p[0] + dx, p[1] + dy, { size: 60, bold: true, align: 'c' });
  });
  s.text('三选二', 960, 720, { size: 76, bold: true, color: C.hot, align: 'c' });
  s.text([{ t: '好 + 省 = ', color: C.dim }, { t: '慢', bold: true }], 690, 600, { size: 36, align: 'r' });
  s.text([{ t: '好 + 快 = ', color: C.dim }, { t: '贵', bold: true }], 1230, 600, { size: 36 });
  s.text([{ t: '省 + 快 = ', color: C.dim }, { t: '差', bold: true }], 960, 980, { size: 36, align: 'c' });
  return s;
}

/* 09 · From model to model router */
function router() {
  const s = frame(new Slide(
    '从 model 到 model router。\n\n如果一个产品依赖一个模型，没有这个模型就会极大地损失产品价值，那么这个产品不能成立。\n\n多模型，意味着三个层面的适配：用户价值、技术能力、成本调控，而且三个层面是打通的。',
  ), 'slope', [{ t: '从 Model，到 Model ' }, { t: 'Router', color: C.cool }], 9);

  // one model: fragile
  s.circle(210, 560, 84, { stroke: C.dim, sw: 3, fill: C.panel });
  s.text('模型', 210, 560, { size: 34, bold: true, align: 'c' });
  s.line(300, 560, 520, 560, { stroke: C.mute, sw: 4, dash: 'dash' });
  s.line(388, 536, 436, 584, { stroke: C.hot, sw: 6 });
  s.line(436, 536, 388, 584, { stroke: C.hot, sw: 6 });
  s.rect(530, 476, 168, 168, { stroke: C.mute, sw: 3, dash: 'dash', r: 26 });
  s.text('产品', 614, 560, { size: 34, color: C.mute, align: 'c' });
  s.text([{ t: '只依赖一个模型 = ' }, { t: '不成立', color: C.hot, bold: true }], 412, 760, { size: 34, align: 'c' });

  s.line(790, 560, 900, 560, { stroke: C.ink, sw: 5, arrow: 'end' });

  // many models through a router
  const hub = [1380, 560];
  [[1060, 340, 26, C.mute], [1020, 450, 38, C.dim], [1060, 570, 20, C.mute], [1020, 680, 32, C.dim], [1060, 790, 24, C.mute]].forEach(([x, y, r, color]) => {
    s.line(x, y, hub[0], hub[1], { stroke: C.mute, sw: 2 });
    s.circle(x, y, r, { fill: color });
  });
  s.line(hub[0], hub[1], 1640, 560, { stroke: C.cool, sw: 5 });
  s.circle(...hub, 128, { fill: C.cool, fillAlpha: 0.08 });
  s.circle(...hub, 100, { fill: C.bg, stroke: C.cool, sw: 4 });
  s.text('Router', hub[0], hub[1], { size: 40, bold: true, color: C.cool, align: 'c' });
  s.rect(1640, 476, 168, 168, { fill: C.panel2, stroke: C.ink, sw: 3, r: 26 });
  s.text('产品', 1724, 560, { size: 34, bold: true, align: 'c' });
  // three layers, wired together
  s.line(1130, 900, 1690, 900, { stroke: C.cool, sw: 3 });
  ['用户价值', '技术能力', '成本调控'].forEach((t, i) => chip(s, t, 1130 + i * 280, 900, { fill: C.bg, stroke: C.cool, size: 28, w: 190 }));
  s.text('三层适配，层层打通', 1410, 976, { size: 24, color: C.dim, align: 'c' });
  return s;
}

/* 10 · Data, harness, context */
function dataHarnessContext() {
  const s = frame(new Slide(
    '独特的 data – harness – context 体系。\n\n当前 AI 架构的两个核心问题：耗能高，只会背。\n\n数据是一切的核心，而且只有两种数据有价值：一种是 AI 从未获得的数据，另一种是用户的个人数据。',
  ), 'slope', [{ t: '独特的 ' }, { t: 'Data', color: C.cool }, { t: ' – Harness – Context' }], 10);

  s.text('当前 AI 架构的两个问题', 100, 290, { size: 26, color: C.dim });
  chip(s, '耗能高', 492, 290, { size: 26, color: C.hot, stroke: C.hot, bold: true });
  chip(s, '只会背', 640, 290, { size: 26, color: C.hot, stroke: C.hot, bold: true });

  const c = [470, 670];
  s.circle(...c, 270, { stroke: C.mute, sw: 2.5, fill: C.panel });
  s.circle(...c, 186, { stroke: C.dim, sw: 2.5, fill: C.panel2 });
  s.circle(...c, 130, { fill: C.cool, fillAlpha: 0.12 });
  s.circle(...c, 100, { fill: C.cool });
  s.text('Data', c[0], c[1], { size: 50, bold: true, color: C.bg, align: 'c' });
  s.text('Harness', c[0], c[1] - 143, { size: 28, align: 'c' });
  s.text('Context', c[0], c[1] - 228, { size: 28, color: C.dim, align: 'c' });

  s.line(900, 300, 900, 940, { stroke: C.line, sw: 2 });

  s.text('只有两种数据有价值', 990, 330, { size: 26, color: C.dim });
  s.circle(1210, 690, 220, { fill: C.panel2 });
  s.text('模型已经\n背下的世界', 1210, 690, { size: 34, color: C.mute, align: 'c', lh: 1.1 });
  glow(s, 1600, 520, 20, C.hot);
  s.text('AI 从未获得的数据', 1600, 606, { size: 34, bold: true, align: 'c' });
  glow(s, 1600, 790, 20, C.cool);
  s.text('用户的个人数据', 1600, 876, { size: 34, bold: true, align: 'c' });
  return s;
}

export const part1 = () => [cover(), whereWeAre(), climbing(), china(), energy(), trough(), paradox(), appLayer(), triangle(), router(), dataHarnessContext()];
