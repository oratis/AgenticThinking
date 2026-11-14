/**
 * EP06 visual lecture. Every text box, line and diagram is a native slide object.
 * Gartner's full chart is the supplied source image. Sources live in speaker notes.
 */
export const palette = {
  paper: '#F5F4EE', ink: '#16231D', muted: '#718073',
  green: '#B0EF78', deep: '#214E39', gray: '#DDE2D7',
  coral: '#D46B4E', white: '#FFFFFF', pale: '#E5EBD9',
};
export const sources = {
  gartner: 'https://emt.gartnerweb.com/ngw/globalassets/en/articles/documents/see-3-of-the-most-popular-gartner-hype-cycles-updated.pdf',
  gartnerAgentic: 'https://www.gartner.com/en/podcasts/thinkcast/the-2026-hype-cycle-for-agentic-ai-what-leaders-need-to-know',
  chatgpt: 'https://openai.com/index/chatgpt/',
  claudeGrowth: 'https://www.anthropic.com/news/anthropic-acquires-bun-as-claude-code-reaches-usd1b-milestone',
  seedance: 'https://seed.bytedance.com/zh/blog/official-launch-of-seedance-2-0',
  iea: 'https://www.iea.org/reports/key-questions-on-energy-and-ai/executive-summary',
  ei: 'https://www.energyinst.org/__data/assets/pdf_file/0007/1658077/Statistical-Review-of-World-Energy.pdf',
  karpathy: 'https://www.youtube.com/watch?v=LCEmiRjPEtQ',
  menugen: 'https://www.youtube.com/watch?v=96jN2OCOfLs',
  qwen: 'https://qwenlm.github.io/blog/qwen3/',
  deepseek: 'https://github.com/deepseek-ai/DeepSeek-R1',
  bagel: 'https://bagel-ai.org/',
  manus: 'https://www.manus.im/features/connectors',
  muse: 'https://muse.ai/blog/security-and-safety-for-ai-agents-our-approach-with-muse',
  dot: 'https://learn.chatgpt.com/docs/dots',
  mods: 'https://claude.com/resources/articles/claude-code-mods',
  dsh: 'https://github.com/deepseek-ai/deepseek-harness',
  hakko: 'https://www.hakko.ai/',
  doudou: 'https://m.doudou.fun/',
  cuddler: 'https://cuddler.ai/docs/what-is-cuddler',
  tapnow: 'https://docs.tapnow.ai/zh/docs/canvas/create-text-and-3d',
  libtv: 'https://www.liblib.tv/',
  genjutsu: 'https://higgsfield.ai/blog/higgsfield-genjutsu',
  energy: 'https://arxiv.org/abs/2311.16863',
  alpha: 'https://www.nature.com/articles/nature24270',
  zhuangzi: 'https://ctext.org/zhuangzi/what-comes-from-without/zh',
  rolland: 'https://doi.org/10.3931/e-rara-69089',
};

export function authorDeck(presentation, gartnerBytes) {
  const C = palette;
  const records = [];
  let s, record, ink, muted;
  function text(str, x, y, w, h, size = 30, color = ink, bold = false, align = 'left') {
    const o = s.shapes.add({
      name: str.slice(0, 40), geometry: 'textbox',
      position: { left: x, top: y, width: w, height: h },
      fill: 'none', line: { fill: 'none', width: 0 },
    });
    o.text = str;
    o.text.style = {
      typeface: 'PingFang SC', fontSize: size, color, bold,
      alignment: align, verticalAlignment: 'middle', insets: 0,
      autoFit: 'none', wrap: 'square',
    };
    record.text.push(str);
    return o;
  }
  function shape(geometry, x, y, w, h, fill = 'none', stroke = 'none', width = 1) {
    return s.shapes.add({
      geometry, position: { left: x, top: y, width: w, height: h },
      fill, line: { style: 'solid', fill: stroke, width },
    });
  }
  function rect(x, y, w, h, fill, stroke = 'none', width = 1) {
    return shape('rect', x, y, w, h, fill, stroke, width);
  }
  function circle(x, y, d, fill = 'none', stroke = ink, width = 2) {
    return shape('ellipse', x, y, d, d, fill, stroke, width);
  }
  function path(points, color = ink, width = 3, close = false, fill = 'none') {
    const commands = points.map((v, i) => i ? { lineTo: { x: v[0], y: v[1] } } : { moveTo: { x: v[0], y: v[1] } });
    if (close) commands.push({ close: {} });
    return s.shapes.add({
      geometry: 'custom', position: { left: 0, top: 0, width: 1280, height: 720 },
      fill, line: { style: 'solid', fill: color, width },
      customPaths: [{ width: 1280, height: 720, commands }],
    });
  }
  function curve(commands, color = ink, width = 3) {
    return s.shapes.add({
      geometry: 'custom', position: { left: 0, top: 0, width: 1280, height: 720 },
      fill: 'none', line: { fill: color, width },
      customPaths: [{ width: 1280, height: 720, commands }],
    });
  }
  function arrow(x1, y1, x2, y2, color = ink, width = 2) {
    path([[x1, y1], [x2, y2]], color, width);
    const a = Math.atan2(y2-y1, x2-x1), l = 10;
    path([[x2-l*Math.cos(a-.45), y2-l*Math.sin(a-.45)], [x2, y2], [x2-l*Math.cos(a+.45), y2-l*Math.sin(a+.45)]], color, width);
  }
  function labelBox(str, x, y, w, h, fill = C.green, size = 28, color = C.ink) {
    const box = rect(x, y, w, h, fill);
    text(str, x+10, y+4, w-20, h-8, size, color, true, 'center');
    return box;
  }
  function dot(x, y, d = 12, color = C.deep) { return circle(x-d/2, y-d/2, d, color, 'none'); }
  function base(title, notes, refs = [], dark = false) {
    s = presentation.slides.add();
    ink = dark ? C.paper : C.ink;
    muted = dark ? '#A9B5A7' : C.muted;
    s.background.fill = dark ? C.ink : C.paper;
    record = { number: records.length+1, title, notes, refs: refs.map(k => sources[k] || k), text: [] };
    records.push(record);
    if (title) text(title, 62, 48, 1156, 76, 48, ink, true);
    text('HYPE CIRCLE', 62, 677, 250, 20, 13, muted, true);
    text(String(records.length).padStart(2, '0'), 1166, 677, 50, 20, 13, muted, false, 'right');
    s.speakerNotes.text = notes + '\n\n' + record.refs.join('\n');
    return s;
  }

  // 01. Public Gartner chart with two editable callouts.
  base('', '本期从 2022 年 11 月 30 日的 ChatGPT 时刻出发。本页采用用户指定的 Gartner Hype Cycle for Agentic AI 完整图，标注日期为 2026 年 4 月。图中的 Agentic AI 处于期望膨胀峰值附近。Where we are 对应本期讨论的 Agentic 应用，Peak of anticipation 是讲者用语；Gartner 原图阶段名为 Peak of Inflated Expectations。五阶段名称、技术点位置及成熟时间均保留原图。横轴表示技术成熟过程，ChatGPT 日期是本期历史锚点。', ['gartnerAgentic','chatgpt']);
  record.title = 'Gartner Hype Cycle for Agentic AI';
  s.background.fill = C.white;
  s.images.add({ blob: gartnerBytes, contentType: 'image/png', alt: 'Gartner Hype Cycle for Agentic AI, April 2026，用户指定完整图',
    position: { left: 55, top: 42, width: 820, height: 625 }, fit: 'contain' });
  text('2022.11.30', 910, 137, 320, 58, 40, C.ink, true);
  text('ChatGPT 时刻', 910, 200, 320, 40, 28, C.muted);
  text('Where we are', 910, 328, 330, 50, 38, C.deep, true);
  text('Peak of anticipation', 910, 384, 330, 40, 24, C.deep);
  // Agentic AI is the peak point at approximately (493, 318) in the source.
  circle(332, 215, 32, 'none', C.deep, 3);
  path([[910,444],[845,444],[364,240]], C.deep, 2);
  // 02.
  base('Peak of anticipation', '高峰期的爆款来自三项条件同时到位。天时是行业预期，地利是模型能力，人和是产品能力。Seedance 与 Claude Code 让用户能够快速看见结果，增长又支撑更大的愿景。我们做逗逗 AI 时也经历过过度承诺的压力。讲故事、验证增长、延伸故事容易互相强化。随着客户开始追问复用率、成本与交付，这种打法的有效窗口会收窄。Claude Code 六个月达到 10 亿美元年化收入是 Anthropic 在 2025 年 12 月披露的口径。', ['seedance','claudeGrowth']);
  path([[632,170],[632,598]], C.gray, 2);
  circle(158,214,205,C.green+'/50',C.deep,2);
  circle(322,214,205,C.green+'/30',C.deep,2);
  circle(240,345,205,C.green+'/70',C.deep,2);
  text('天时',184,265,140,45,32,C.ink,true,'center');
  text('地利',359,265,140,45,32,C.ink,true,'center');
  text('人和',272,433,140,45,32,C.ink,true,'center');
  text('Seedance / Claude Code',115,571,460,40,26,C.deep,true,'center');
  labelBox('讲故事',770,185,280,66,C.ink,30,C.paper);
  labelBox('验证增长',930,370,268,66,C.green);
  labelBox('延伸故事',666,457,268,66,C.pale);
  arrow(1050,253,1080,350); arrow(952,450,922,470); arrow(759,435,791,271);
  text('过度承诺',754,319,250,48,34,C.coral,true,'center');
  text('这个阶段，即将结束',707,580,480,46,31,C.ink,true,'center');
  // 03.
  base('中国开源 AI 压缩了时间差', '贵族式与平民式是两种竞争策略的比喻。美国前沿实验室更多依赖尖端芯片与密集资本投入，受电网接入和容量约束。中国团队在先进芯片获取受限的条件下推进开放权重、成本优化和较宽松许可。两国都存在开放与封闭路线。Energy Institute 同口径 2024 年发电量，中国约 10,086.9 TWh，美国约 4,634.8 TWh，约 2.18 倍。IEA 2026 年更新预计全球数据中心用电由 2025 年 485 TWh 增至 2030 年约 950 TWh，其中 AI 是主要增量驱动。它测量数据中心用电，无法推导 2027 年推理开支 25 万亿美元。开放模型更早成为替代品，从技术突破到可比较产品的时间差因此可能缩短。', ['ei','iea','qwen','deepseek']);
  text('美国 AI',90,178,460,50,40,C.ink,true);
  text('中国 AI',720,178,460,50,40,C.ink,true);
  text('“贵族式”',90,246,460,38,27,C.muted);
  text('“平民式”',720,246,460,38,27,C.muted);
  labelBox('尖端芯片 × 算力',90,318,470,75,C.ink,32,C.paper);
  labelBox('开放权重 × 低成本 × 宽许可',720,318,470,75,C.green,27);
  text('电力约束',90,413,220,42,30,C.coral,true);
  text('先进芯片约束',720,413,300,42,30,C.coral,true);
  text('2.18×',90,505,300,65,55,C.deep,true);
  text('中 / 美发电量 · 2024',90,586,315,30,18,C.muted);
  text('485 → 950',452,505,380,65,47,C.deep,true);
  text('TWh · 全球数据中心用电',452,580,380,27,17,C.muted);
  text('2025 实际 / 2030 预测',452,611,380,27,17,C.muted);
  text('突破',907,508,110,36,24);
  text('普及',1100,508,110,36,24);
  arrow(910,565,1190,565,C.gray,5);
  arrow(976,565,1118,565,C.deep,5);
  text('时间差缩短',908,593,290,42,27,C.deep,true,'center');
  // 04.
  base('走进低谷，主线更清楚', '当热度下降，跟风团队和无法兑现承诺的供应商会更难存活。我们的工作收敛为两个相互支撑的方向，持续改善用户真正拿到的结果，持续改善每次交付的毛利。毛利为复购、研发与运营留下空间，但企业仍要管理固定费用、获客与现金流。', ['gartner'], true);
  curve([{moveTo:{x:70,y:275}},{cubicBezTo:{x1:215,y1:110,x2:260,y2:477,x:448,y:489}},{cubicBezTo:{x1:600,y1:505,x2:685,y2:380,x:780,y:365}}], '#697769', 4);
  dot(448,489,24,C.green);
  text('幻灭低谷',347,532,240,44,32,C.green,true,'center');
  text('持续改产品',790,254,400,64,49,C.paper,true);
  text('持续改商业化',790,373,420,64,49,C.green,true);
  path([[790,340],[1190,340]],'#435145',2);
  text('毛利，是运营生命线',790,490,430,45,28,C.paper);
  // 05.
  base('模型即产品的悖论', 'Karpathy 的 Software 1.0 是显式编程，2.0 是训练神经网络权重，3.0 是用自然语言给模型写程序。在 2026 年的访谈中，他用 MenuGen 说明，生成模型升级会吸收原本由应用提供的单点能力。应用应在一个已付费的小群体里找到明确任务，把完整交付做成 Agent 的 use case。用户真正付费的流程、资产和关系，可以随着模型升级继续增值。', ['karpathy','menugen']);
  const sx=[90,470,850], sv=['1.0','2.0','3.0'], sl=['代码','权重','语言'];
  sx.forEach((x,i)=>{
    text(sv[i],x,174,300,70,67,C.deep,true);
    labelBox(sl[i],x,266,300,100,i===2?C.green:C.gray,37);
    if(i<2)arrow(x+312,315,x+362,315,C.muted,2);
  });
  text('MenuGen',90,445,240,45,34,C.ink,true);
  text('单点功能被模型吸收',90,501,400,42,28,C.muted);
  arrow(495,502,610,502,C.deep,3);
  labelBox('小群体 × 已付费任务',660,442,490,72,C.ink,34,C.paper);
  text('一个 Agent use case，完成切入',660,537,490,45,29,C.deep,true);
  // 06.
  base('应用层的机会', '应用要贴着模型能力和发展方向生长，同时拥有自己的资产、收入来源和获客方式。LLM 在走向可规划、调用工具和验证结果的 Agentic 循环。这里把用户提到的 DiT 三角循环工作化为理解、生成、编辑三种视觉能力的互相反馈，参考统一多模态研究，而非把它称作所有 DiT 架构共有的固定理论。下面三项是应用可以经营的基础，模型路由、上下文资产、可动态组合的工具。', ['bagel','seedance']);
  text('LLM · Agentic',85,168,480,45,34,C.deep,true);
  labelBox('规划',85,251,140,64,C.pale,27);
  labelBox('行动',272,251,140,64,C.pale,27);
  labelBox('验证',459,251,140,64,C.green,27);
  arrow(232,282,260,282);arrow(420,282,449,282);
  path([[530,332],[530,371],[154,371],[154,330]],C.deep,2);
  arrow(154,371,154,330,C.deep,2);
  text('视觉模型 · 三角循环',748,168,450,45,34,C.deep,true);
  path([[915,244],[780,388],[1070,388],[915,244]],C.deep,2);
  labelBox('理解',850,228,130,58,C.pale,27);
  labelBox('生成',708,365,140,58,C.green,27);
  labelBox('编辑',1000,365,140,58,C.pale,27);
  const items=[['Model','Router'],['Asset','Context'],['Tool','Dynamic']];
  items.forEach(([a,b],i)=>{const x=85+i*390;path([[x,493],[x+340,493]],C.ink,3);text(a,x,510,340,55,43,C.ink,true);text(b,x,573,340,42,30,C.muted)});
  // 07.
  base('模型的不可能三角', '成本、速度与效果构成工程取舍。图形是选择框架，同一个模型在不同推理预算和部署条件下可能落在不同位置。产品要先确定任务的效果门槛与响应时限，再选择成本可接受的方案。技术进步可以推动整条能力边界外移，三角形不能当成严格数学定律。', ['qwen']);
  path([[637,202],[302,565],[972,565]],C.deep,4,true,C.pale);
  path([[637,310],[429,525],[844,525]],'#91A97F',2,true,C.green+'/40');
  circle(601,400,72,C.ink,'none');
  text('任务',603,416,68,38,22,C.paper,true,'center');
  text('效果',517,139,240,60,46,C.ink,true,'center');
  text('成本',169,568,240,60,46,C.ink,true,'center');
  text('速度',869,568,240,60,46,C.ink,true,'center');
  text('选择一个任务的\n最佳平衡',936,281,280,90,28,C.muted);
  arrow(930,377,680,430,C.muted,2);
  // 08.
  base('从 model 到 model router', '当一个外部模型下线就使产品大部分价值消失时，团队还没有掌握完整交付。路由要同时考虑用户购买什么价值、模型擅长什么技术以及总成本能否承受。三项条件互相约束，例如会员购买的低延迟与角色一致性，决定候选模型和回退标准，再决定可接受的成本。模型可替换的前提是验收和状态能迁移。');
  labelBox('用户任务',84,300,210,100,C.ink,32,C.paper);
  arrow(304,350,382,350,C.deep,3);
  rect(394,188,470,338,C.pale);
  text('ROUTER',424,205,400,45,31,C.deep,true,'center');
  const criteria=[['用户价值',286],['技术能力',355],['成本调控',424]];
  criteria.forEach(([a,y])=>labelBox(a,460,y,340,54,a==='技术能力'?C.green:C.white,28));
  arrow(626,342,626,351,C.deep,2);arrow(626,411,626,420,C.deep,2);
  ['模型 A','模型 B','模型 C'].forEach((a,i)=>{let y=199+i*132;labelBox(a,981,y,220,74,i===1?C.green:C.gray,30);arrow(874,350,970,y+37,C.deep,2)});
  text('同一承诺，多种模型完成',393,572,520,55,37,C.deep,true);
  // 09.
  base('Data · Harness · Context', '模型仍面对高推理成本，以及在陌生任务上迁移不稳定的问题。产品最值得独占积累的两类数据，是基础模型没见过的真实事件、失败和纠错，以及经授权的个人偏好与共同经历。这是本期对差异化数据价值的选择，不表示公开数据或合成数据一概无用。Data 保存可学习的经历，harness 把经历变成可执行、可验收的流程，context 则为当下任务选取必要信息。', ['energy','deepseek']);
  text('高能耗',82,163,250,42,27,C.coral,true);
  text('迁移不稳',351,163,250,42,27,C.coral,true);
  circle(190,248,268,C.pale,'none');
  circle(817,248,268,C.green,'none');
  text('AI 未见过的',208,305,232,44,32,C.ink,true,'center');
  text('真实数据',208,359,232,52,42,C.ink,true,'center');
  text('这个用户的',835,305,232,44,32,C.ink,true,'center');
  text('个人数据',835,359,232,52,42,C.ink,true,'center');
  text('失败 / 纠错 / 新经历',170,537,310,38,24,C.muted,false,'center');
  text('偏好 / 记忆 / 关系',802,537,310,38,24,C.muted,false,'center');
  labelBox('Harness',520,330,240,68,C.ink,31,C.paper);
  arrow(468,364,508,364);arrow(806,364,772,364);
  text('Context',523,466,235,42,30,C.deep,true,'center');
  arrow(640,410,640,454,C.deep,2);
  // 10.
  base('软件，随每个人生长', 'Connector 把应用和数据接进来，可以由 API 或 MCP 实现。连接器给出当前上下文，Skill 定义可复用工作方法，Tool 执行具体动作。Worker 可以在本地、云端或边缘运行，并回写结果。Manus、dot、Muse 已提供其中多种机制。Claude Mods 允许修改工具、提示词与 UI，DSH 以可组合插件构建运行时。由此推演，未来每个人的软件会随自身任务和历史调整。设计工作也会更多转向能力边界、演变路径与用户控制。', ['manus','dot','muse','mods','dsh']);
  const chain=[['Connector','接入上下文'],['Skill','选择做法'],['Tool','执行动作'],['Worker','回报结果']];
  chain.forEach(([a,b],i)=>{let x=72+i*302;labelBox(a,x,222,256,80,i===1?C.green:C.ink,33,i===1?C.ink:C.paper);text(b,x,320,256,38,26,C.muted,false,'center');if(i<3)arrow(x+264,261,x+290,261,C.deep,2)});
  path([[1110,370],[1110,411],[184,411],[184,370]],C.deep,2);
  arrow(184,411,184,370,C.deep,2);
  text('本地 / 云端 / 边缘',880,438,320,30,20,C.muted,false,'center');
  labelBox('用户 A',75,494,165,58,C.gray,25);
  labelBox('用户 B',75,575,165,58,C.gray,25);
  [282,351,420,489].forEach((x,i)=>rect(x,496,53,53,[C.deep,C.green,C.gray,C.deep][i]));
  [282,351,420,489,558,627].forEach((x,i)=>rect(x,578,53,53,[C.green,C.gray,C.deep,C.green,C.deep,C.gray][i]));
  text('能力设计 · 演变式设计',760,518,450,47,34,C.deep,true);
  text('Claude Mods / DSH',760,581,450,32,24,C.muted);
  // 11.
  base('时代中的三种机遇', '工作的变化是，执行成本降低后，定义值得解决的问题更重要。问对问题依赖每个人独特的生活体验、真实处境和判断。明确边界且能验收的许多子任务，可以从 30B 级模型开始验证，并通过蒸馏继续降低成本，实际覆盖率需要任务测试。娱乐则从创作者的一头一尾逐步走向观众参与生成，消费动作可以触发下一幕。', ['qwen','deepseek','cuddler'], true);
  const yy=[193,359,525];
  ['工作','模型','娱乐'].forEach((a,i)=>text(a,80,yy[i],190,64,44,C.green,true));
  text('独特体验',310,195,270,56,37,C.paper,true);
  arrow(591,224,727,224,C.green,3);
  text('问对问题',768,195,390,56,42,C.paper,true);
  text('30B',310,350,270,74,66,C.paper,true);
  arrow(591,389,727,389,C.green,3);
  text('任务验收 + 蒸馏',768,365,430,56,37,C.paper,true);
  text('创作两端',310,527,270,56,37,C.paper,true);
  arrow(591,554,727,554,C.green,3);
  text('消费即生成',768,527,430,56,42,C.paper,true);
  path([[80,316],[1200,316]],'#465246',1);path([[80,481],[1200,481]],'#465246',1);
  // 12.
  base('陪伴与内容', '陪伴的回访理由是共同经历仍然被理解，内容的回访理由是还有下一幕值得看。逗逗 AI 和 HakkoAI 更强调实时上下文、个人记忆与关系。Cuddler 通过角色、视频、分支故事和创作工具，探索观看与创作的连接。两类产品都有模型、上下文与工具，只是建设重心不同。', ['doudou','hakko','cuddler']);
  path([[640,176],[640,613]],C.gray,2);
  circle(230,208,210,C.green,'none');
  circle(860,208,210,C.pale,C.deep,2);
  text('陪伴',240,270,190,66,55,C.ink,true,'center');
  text('内容',870,270,190,66,55,C.ink,true,'center');
  text('CONTEXT',140,451,390,55,42,C.deep,true,'center');
  text('TOOL',766,451,390,55,42,C.deep,true,'center');
  text('逗逗 AI / HakkoAI',114,536,440,47,31,C.muted,false,'center');
  text('Cuddler',780,536,380,47,34,C.muted,false,'center');
  // 13.
  base('陪伴的壁垒，在 Context', 'Model 层通过快速、灵活、稳定的 router 跟进模型进步。Tool 层的单点能力通常更容易被替代，但复杂工具仍有集成和验证成本。对陪伴产品，更难迁移的是上下文，谁和用户经历过什么，用户如何表达偏好，哪些记忆经过纠正。用三层厚度表达建设重心。用户应能控制记忆，模型升级应提升关系体验。', ['hakko','doudou']);
  rect(90,180,1100,80,C.gray);
  text('MODEL',124,200,330,42,32,C.ink,true);
  text('Router · 快速 / 灵活 / 稳定',513,200,620,42,28,C.ink);
  rect(90,291,1100,224,C.green);
  text('CONTEXT',124,317,420,65,50,C.ink,true);
  ['共同经历','长期记忆','个人偏好','关系'].forEach((a,i)=>{text(a,143+i*254,422,240,48,31,C.ink,true,'center');if(i<3)arrow(369+i*254,445,392+i*254,445,C.deep,2)});
  rect(90,546,1100,64,C.pale);
  text('TOOL',124,556,330,42,30,C.ink,true);
  text('可组合的动作',623,556,510,42,26,C.muted,false,'right');
  // 14.
  base('内容的终点，是创作与消费闭环', 'AIGC 的 C 需要给人故事的获得感、快乐、共鸣和节奏。文本 roleplay 可以继续有独立价值，同时视频与互动扩大表达空间。上游模型如 Seedance、Kling 下沉产品，下游红果、抖音掌握分发和付费，通用工具层容易承受毛利压力。OpenArt、TapNow 等仍可通过工作流创造价值。TapNow CineMap、LibTV 3D-BOX、Higgsfield Genjutsu 显示视觉工具快速丰富，但没有证据支持具体同日或次日抄袭。Cuddler 的方向是连接创作、观看、互动与付费，建设内容商业化闭环。', ['cuddler','tapnow','libtv','genjutsu','seedance']);
  const stack=[['模型层','Seedance / Kling',207,88,C.gray],['工具层','OpenArt / TapNow',337,62,C.pale],['商业化层','红果 / 抖音',443,88,C.green]];
  stack.forEach(([a,b,y,h,fill])=>{rect(78,y,530,h,fill);text(a,101,y+10,180,h-20,30,C.ink,true);text(b,300,y+10,287,h-20,25,C.ink)});
  arrow(343,301,343,328,C.coral,3);arrow(343,434,343,407,C.coral,3);
  text('工具层毛利受挤压',143,565,400,45,29,C.coral,true,'center');
  circle(776,228,264,C.green,'none');
  text('Cuddler',794,319,228,60,43,C.ink,true,'center');
  labelBox('创作',737,167,135,54,C.ink,26,C.paper);
  labelBox('观看',1034,303,135,54,C.ink,26,C.paper);
  labelBox('付费',890,500,135,54,C.ink,26,C.paper);
  labelBox('互动',659,400,135,54,C.ink,26,C.paper);
  arrow(880,197,1037,291);arrow(1097,368,1001,491);arrow(881,527,798,448);arrow(713,390,768,230);
  text('获得感  快乐  共鸣  节奏',660,587,534,37,27,C.deep,true,'center');
  // 15.
  base('钱，从哪里来？', '商业化选择从一个今天已经有人付费的场景开始。群体和任务都可以小，但付费动机要具体。再问 Agent 能否在质量可比的条件下，把某个关键交付指标改善一个数量级。十倍是本团队的进入门槛，而非所有场景已实现的事实。一般攻略往往依赖免费供给，但教练、付费社区和定制攻略存在支付市场，应细分验证。客服已有企业预算，效率收益仍需实测并计入转人工和质量损失。');
  text('已经有人付费',104,184,450,63,46,C.ink,true);
  text('关键效率 10×',743,184,455,63,46,C.ink,true);
  circle(243,285,170,C.pale,C.deep,3);
  circle(878,285,170,C.green,'none');
  text('¥',263,321,130,89,77,C.deep,true,'center');
  text('10×',891,328,145,76,56,C.ink,true,'center');
  arrow(437,369,849,369,C.deep,4);
  text('小群体 × 小任务',435,418,410,50,33,C.deep,true,'center');
  path([[100,534],[1180,534]],C.gray,2);
  text('通用攻略',100,564,280,42,31,C.muted,true);
  text('先验证付费意愿',100,614,370,32,23,C.muted);
  text('企业客服',743,564,280,42,31,C.deep,true);
  text('已有预算，再验证交付提升',743,614,450,32,23,C.muted);
  // 16.
  base('模型使用效率，决定毛利底色', '每项任务都要匹配模型、硬件和服务方式。自部署要把卡的利用率、显存和内存带宽、并发和空闲成本算进去。使用 API 要考虑输入输出长度、缓存、批处理、速率限制和失败重试。两条路径最终应以同一质量门槛下每个合格结果的总成本比较。视频生成中，保留已经合格的镜头、只重做失败部分，经常同时改善体验和毛利。', ['qwen','energy']);
  labelBox('任务与验收',466,174,350,68,C.ink,33,C.paper);
  arrow(510,253,329,323,C.deep,3);arrow(771,253,957,323,C.deep,3);
  rect(120,334,420,202,C.pale);
  rect(744,334,420,202,C.green);
  text('卡',150,355,150,74,62,C.ink,true);
  text('API',774,355,300,74,62,C.ink,true);
  text('利用率 / 并发 / 量化',150,468,354,35,27,C.ink);
  text('路由 / 缓存 / 批处理',774,468,354,35,27,C.ink);
  arrow(329,546,510,598,C.deep,3);arrow(957,546,771,598,C.deep,3);
  text('总交付成本 ÷ 合格结果',345,603,604,48,37,C.deep,true,'center');
  // 17.
  base('运营，是经营关系', '每一段与客户的对话，都可能包含产品理解的缺口。运营要听懂用户完成什么，记下他遇到了什么，把问题带回团队，交付后主动确认是否真的解决。用户的理解、信任与复购由这些具体经历累积。把对话当作客户关系的一部分，既需要人投入，也需要 Agent 帮助保留上下文与追踪承诺。');
  circle(120,274,170,C.green,'none');
  text('用户',132,328,146,60,43,C.ink,true,'center');
  circle(991,274,170,C.pale,C.deep,2);
  text('团队',1003,328,146,60,43,C.ink,true,'center');
  const relationshipSteps=[['听懂',355],['兑现',556],['回访',757]];
  relationshipSteps.forEach(([a,x])=>labelBox(a,x,327,168,70,C.ink,32,C.paper));
  arrow(300,361,344,361);arrow(528,361,546,361);arrow(730,361,748,361);arrow(931,361,981,361);
  curve([{moveTo:{x:1075,y:457}},{cubicBezTo:{x1:1080,y1:620,x2:210,y2:620,x:205,y:457}}],C.deep,3);
  arrow(209,482,205,457,C.deep,3);
  text('每一次对话，都有人认真接住',285,187,720,53,39,C.deep,true,'center');
  text('信任 · 复购 · 下一次对话',357,589,584,43,29,C.muted,false,'center');
  // 18.
  base('AI native 组织 · 任务找人', '依照用户提供的参考图重绘。任务市场连接交付需求和可组合的能力体，人员可以在不同项目承担不同角色。组织先给出交付标准、算力预算和数据接口，再匹配具有认知弹性、自主学习能力及专业判断的人与 Agent。完成任务后，成果和经验回到组织，下一项需求可以重新组队。人仍需要对结果负责。');
  labelBox('交付标准',75,218,225,58,C.gray,26);
  labelBox('算力预算',75,319,225,58,C.gray,26);
  labelBox('数据接口',75,420,225,58,C.gray,26);
  [247,348,449].forEach(y=>arrow(312,y,435,348,C.deep,2));
  circle(454,233,230,C.green,'none');
  text('任务',485,290,168,56,44,C.ink,true,'center');
  text('市场',485,349,168,56,44,C.ink,true,'center');
  const people=[['人',855,207],['Agent',1083,275],['人',842,457],['Agent',1054,499]];
  people.forEach(([a,x,y],i)=>{
    if(i===3) {
      curve([{moveTo:{x:695,y:348}},{cubicBezTo:{x1:890,y1:342,x2:964,y2:381,x:997,y:499}}],C.deep,2);
      arrow(990,476,997,499,C.deep,2);
    } else arrow(695,348,x-57,y,C.deep,2);
    circle(x-57,y-57,114,i%2?C.pale:C.ink,'none');
    text(a,x-57,y-29,114,58,a==='人'?39:22,i%2?C.ink:C.paper,true,'center');
  });
  text('任务结束，能力继续流动',393,589,700,51,37,C.deep,true,'center');
  // 19.
  base('AI native 个人 · 三种资源对齐', '按用户提供的三圆图重绘。时间线性流逝，注意力容易被外部刺激夺走，精力有波动也能恢复。任务应该放在三者能够重合的时段。只有时间和注意力，可能透支精力；有时间和精力而缺乏目标，容易忙而低效；注意力和精力到位却时间碎片化，容易浪费焦点。使用 AI 的价值之一，是把机械执行让出去，为自己留住最适合判断和创造的交集。');
  circle(456,167,322,C.green+'/38',C.deep,2);
  circle(315,340,322,C.green+'/25',C.deep,2);
  circle(597,340,322,C.green+'/55',C.deep,2);
  text('注意力',495,232,244,58,42,C.ink,true,'center');
  text('主动定向',501,299,232,34,24,C.muted,false,'center');
  text('时间',354,472,244,58,42,C.ink,true,'center');
  text('不可储存',360,543,232,34,24,C.muted,false,'center');
  text('精力',636,472,244,58,42,C.ink,true,'center');
  text('可以恢复',642,543,232,34,24,C.muted,false,'center');
  circle(575,414,84,C.ink,'none');
  text('对齐',577,437,80,37,24,C.paper,true,'center');
  text('忙而低效',155,375,170,36,24,C.coral);
  text('焦点浪费',960,375,180,36,24,C.coral);
  text('精力耗散',497.333333,640,240,34,24,C.coral,false,'center');
  // 20.
  base('人机协作中的审美', '根据用户提供的已知/未知与可言传/可意会矩阵重绘。模型可以学习大量可观察的表达，但每个人经历过什么、此刻为何在意某个选择，仍有难以完整编码的部分。这里强调人的亲历和判断，不把 AI 永远无法学习默会知识当成已证实的定律。庄子《外物》以筌、蹄和语言说明手段与意义的关系，讲者可结合自身经历展开。');
  text('可言传',248,164,250,42,29,C.muted,false,'center');
  text('可意会',707,164,250,42,29,C.deep,true,'center');
  rect(195,230,890,340,C.gray);
  rect(640,230,445,170,C.green);
  path([[640,230],[640,570]],C.paper,3);path([[195,400],[1085,400]],C.paper,3);
  text('已知',90,288,100,42,27,C.muted);
  text('未知',90,457,100,42,27,C.muted);
  text('知识',287,285,250,60,39,C.ink,true,'center');
  text('体验与审美',685,285,355,60,39,C.ink,true,'center');
  text('探索',287,453,250,60,39,C.ink,true,'center');
  text('创造',732,453,250,60,39,C.ink,true,'center');
  text('言者所以在意，得意而忘言',195,601,890,53,37,C.deep,true,'center');
  s.speakerNotes.text += '\n\n筌者所以在鱼，得鱼而忘筌；蹄者所以在兔，得兔而忘蹄；言者所以在意，得意而忘言。\n' + sources.zhuangzi;
  record.notes += '\n\n筌者所以在鱼，得鱼而忘筌；蹄者所以在兔，得兔而忘蹄；言者所以在意，得意而忘言。';
  record.refs.push(sources.zhuangzi);
  // 21.
  base('我们离 AGI 还有多远', '我的判断是，今天的 Transformer 未必是 AGI 的最终架构，能效将成为架构竞争的主要维度之一。这是研究判断，当前证据不能给出可信的 AGI 倒计时。比较系统时，应固定任务、质量与时限，统计端到端每单位能量交付多少合格结果。AlphaGo Zero 通过自我对弈生成经历，围棋规则提供清晰反馈。开放世界的系统仍需要真实反馈、稀缺失败和难得的纠正。自我改进让数据的来源扩展了，可靠的学习信号仍然重要。', ['energy','alpha']);
  text('可靠智能',100,210,490,78,66,C.ink,true,'center');
  path([[110,310],[579,310]],C.deep,4);
  text('单位能量',100,334,490,78,66,C.deep,true,'center');
  text('架构竞争的下一把尺',100,467,490,44,30,C.muted,false,'center');
  const dataCycle=[['真实数据',795,182],['自我改进',954,346],['新数据',695,469]];
  dataCycle.forEach(([a,x,y],i)=>labelBox(a,x,y,220,62,i===1?C.green:C.pale,29));
  arrow(1028,257,1058,330);arrow(950,426,900,466);arrow(760,449,835,256);
  text('最难获取的数据，仍然有价值',674,586,537,50,32,C.deep,true);
  // 22.
  base('', '罗曼·罗兰原句的中文意译。馆藏原本《L’Humble Vie héroïque》（1912）印刷页 46 引自《Vie de Michel-Ange》：“Il n’y a qu’un héroïsme au monde : c’est de voir le monde tel qu’il est, — et de l’aimer.” 回到本期的立场，理解周期、成本和自己的局限之后，仍然认真做产品、对待客户、珍惜自己的生活。', ['rolland'], true);
  record.title = '认清生活的本质，仍然热爱生活';
  circle(963,138,120,C.green,'none');
  path([[64,532],[1216,532]],'#829275',2);
  curve([{moveTo:{x:64,y:531}},{cubicBezTo:{x1:328,y1:521,x2:483,y2:600,x:709,y:571}},{cubicBezTo:{x1:880,y1:551,x2:1000,y2:493,x:1216,y:530}}],'#526B4D',2);
  text('认清生活的本质',88,219,1080,99,72,C.paper,true);
  text('仍然热爱生活',88,331,1080,99,72,C.green,true);
  text('罗曼·罗兰 · 意译',90,463,700,40,24,muted);
  text('Oratis · 2026.11.18',88,598,900,40,25,C.paper);
  return records;
}
