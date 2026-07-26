const { C, F, newSlide, header, card, code, table, stat, bullets, band, divider } = require("./lib");

module.exports = function (pptx) {
  const P = "AGENTIC THINKING EP03";

  // ---------- 1. Title ----------
  {
    const s = newSlide(pptx);
    s.addShape("rect", { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: "050607" } });
    s.addText("AGENTIC THINKING", {
      x: 0.95, y: 1.62, w: 9, h: 0.45, fontFace: F.sans, fontSize: 22, bold: true,
      color: C.fg, charSpacing: 3.4, margin: 0,
    });
    s.addShape("roundRect", {
      x: 5.62, y: 1.66, w: 1.05, h: 0.38, rectRadius: 0.19, fill: { color: C.accent }, line: { color: C.accent, width: 1 },
    });
    s.addText("EP03", {
      x: 5.62, y: 1.66, w: 1.05, h: 0.38, align: "center", fontFace: F.sans, fontSize: 13,
      bold: true, color: "04120A", margin: 0, valign: "middle",
    });
    s.addText("Model over", {
      x: 0.9, y: 2.22, w: 11.5, h: 1.2, fontFace: F.sans, fontSize: 68, bold: true, color: C.fg, margin: 0, valign: "middle",
    });
    s.addText("Everything", {
      x: 0.9, y: 3.26, w: 11.5, h: 1.2, fontFace: F.sans, fontSize: 68, bold: true, color: C.accent, margin: 0, valign: "middle",
    });
    s.addText("模型是天花板；工程决定你离天花板多远", {
      x: 0.95, y: 4.42, w: 11.5, h: 0.4, fontFace: F.sans, fontSize: 17, color: C.dim, margin: 0, valign: "middle",
    });
    s.addShape("line", { x: 0.95, y: 5.28, w: 11.45, h: 0, line: { color: C.border, width: 1 } });
    const meta = [
      ["分享人", "Oratis"],
      ["时间", "2026.07.28  11:00"],
      ["主题", "基础 · 前沿 · 实践"],
    ];
    let mx = 0.95;
    meta.forEach(([k, v]) => {
      s.addText(k, { x: mx, y: 5.5, w: 3.4, h: 0.26, fontFace: F.sans, fontSize: 10, color: C.faint, charSpacing: 1.4, margin: 0 });
      s.addText(v, { x: mx, y: 5.78, w: 3.4, h: 0.36, fontFace: F.sans, fontSize: 16, bold: true, color: C.fg, margin: 0 });
      mx += 3.85;
    });
    s.addNotes("EP03 Model over Everything。分享人 Oratis，2026年7月28日 11:00。本期分三部分：基础（从AI历史到大模型全部概念）、前沿（三大未来主线）、实践（Cuddler 的 Model Router）。");
  }

  // ---------- 2. 系列脉络 ----------
  {
    const s = newSlide(pptx);
    const y = header(s, "系列脉络", "前两期讲了 Agent 的外围，这一期讲它的天花板", P);
    const eps = [
      { tag: "EP01", t: "Human as Foundation", b: ["Agent 的目标、约束、评价标准", "最终都来自人 —— 人是地基"], on: false },
      { tag: "EP02", t: "Tools as Extension", b: ["Agent 靠工具触达世界", "工具是手脚"], on: false },
      { tag: "EP03", t: "Model over Everything", b: ["模型决定这个系统能到多高", "模型是天花板"], on: true },
    ];
    let x = 0.6;
    eps.forEach((e) => {
      card(s, {
        x, y: y + 0.15, w: 3.9, h: 2.2, tag: e.tag, title: e.t, body: e.b, bullet: true,
        fill: e.on ? C.accentSoft : C.card, line: e.on ? C.accentDim : C.border,
        tagColor: e.on ? C.accent : C.faint, bodySize: 12, titleSize: 16,
      });
      x += 4.15;
    });
    band(s, {
      x: 0.6, y: y + 2.62, w: 12.13, h: 1.0,
      text: "Agent = Model × Context × Tools × Loop\nContext / Tools / Loop 都是乘数 —— 它们能放大或削弱模型，但放大不出模型没有的东西。",
      size: 15, lineSpacing: 24,
    });
    bullets(s, {
      x: 0.6, y: y + 3.86, w: 12.13, h: 1.1,
      items: [
        { t: "一个 3B 模型给它再好的工具，也做不了需要 14 小时连续推理的任务", c: C.dim },
        { t: "一个前沿模型即使工具很烂，也能自己想办法绕过去", c: C.dim },
      ],
      size: 13.5,
    });
    s.addNotes("EP01 讲人是地基，EP02 讲工具是手脚。这一期讲模型 —— 四要素里，后三项都是乘数，乘数放大不出模型没有的能力。");
  }

  // ---------- 3. 三层含义 ----------
  {
    const s = newSlide(pptx);
    const y = header(s, "标题的三层含义", "Model over Everything", P);
    const layers = [
      { n: "01", t: "模型是天花板", en: "Model over Everything", b: "上限由模型定，工程只决定你离上限多远。选模型、评模型、理解模型的能力边界，是产品能力的一部分。" },
      { n: "02", t: "模型凌驾于一切之上", en: "Model above Everything", b: "产品里几乎每个功能背后都挂着一次模型调用。模型的选择、路由、成本、容错，是基础设施，不是配置项。" },
      { n: "03", t: "模型覆盖一切模态", en: "Model over all Modalities", b: "文本、图像、视频、语音、动作、物理世界，都在被同一套范式吞掉。" },
    ];
    let cy = y + 0.1;
    layers.forEach((l) => {
      s.addShape("roundRect", { x: 0.6, y: cy, w: 12.13, h: 1.42, rectRadius: 0.09, fill: { color: C.card }, line: { color: C.border, width: 1 } });
      s.addText(l.n, { x: 0.85, y: cy + 0.28, w: 0.9, h: 0.86, fontFace: F.sans, fontSize: 34, bold: true, color: C.accentDim, margin: 0, valign: "middle" });
      s.addText(l.t, { x: 1.85, y: cy + 0.22, w: 5.0, h: 0.4, fontFace: F.sans, fontSize: 19, bold: true, color: C.fg, margin: 0, valign: "middle" });
      s.addText(l.en, { x: 1.85, y: cy + 0.66, w: 5.0, h: 0.3, fontFace: F.sans, fontSize: 11, color: C.accent, margin: 0, charSpacing: 0.6 });
      s.addText(l.b, { x: 7.0, y: cy + 0.24, w: 5.5, h: 0.98, fontFace: F.sans, fontSize: 12, color: C.dim, margin: 0, valign: "middle", lineSpacing: 17 });
      cy += 1.6;
    });
    s.addNotes("三层含义：天花板、基础设施、全模态。这三层分别对应 Part A / Part C / Part B。");
  }

  // ---------- 4. Agenda ----------
  {
    const s = newSlide(pptx);
    const y = header(s, "本期结构", "三个部分，回答三个不同的问题", P);
    const parts = [
      { n: "A", t: "基础", sub: "Foundations", q: "模型是什么？怎么造出来的？", b: ["AI 七十年时间线", "NN / RNN / LSTM / Transformer", "MoE · DeepSeek · 线性注意力 · RWKV", "训练全流程 · 训练卡 · 显存与带宽", "GAN / Diffusion · 全模态 · 世界模型"] },
      { n: "B", t: "前沿", sub: "Frontiers", q: "模型要去哪？", b: ["完全自主的 Agent", "持续学习的 AI", "理解物理的机器人", "—", "三条线在同一个点汇合"] },
      { n: "C", t: "实践", sub: "Practice", q: "模型怎么用在生产里？", b: ["Cuddler Model Router 四代演进", "路由 / 韧性 / 计费 / 容量 / 可观测", "Eval 闭环与三个意外收获", "—", "13 条可复用的设计原则"] },
    ];
    let x = 0.6;
    parts.forEach((p) => {
      s.addShape("roundRect", { x, y: y + 0.1, w: 3.9, h: 4.75, rectRadius: 0.1, fill: { color: C.card }, line: { color: C.border, width: 1 } });
      s.addShape("roundRect", { x: x + 0.28, y: y + 0.34, w: 0.62, h: 0.62, rectRadius: 0.31, fill: { color: C.accent }, line: { color: C.accent, width: 1 } });
      s.addText(p.n, { x: x + 0.28, y: y + 0.34, w: 0.62, h: 0.62, align: "center", fontFace: F.sans, fontSize: 22, bold: true, color: "04120A", margin: 0, valign: "middle" });
      s.addText(p.t, { x: x + 1.05, y: y + 0.36, w: 2.6, h: 0.36, fontFace: F.sans, fontSize: 21, bold: true, color: C.fg, margin: 0, valign: "middle" });
      s.addText(p.sub, { x: x + 1.05, y: y + 0.72, w: 2.6, h: 0.26, fontFace: F.sans, fontSize: 10.5, color: C.accent, charSpacing: 1.2, margin: 0 });
      s.addText(p.q, { x: x + 0.28, y: y + 1.16, w: 3.34, h: 0.6, fontFace: F.sans, fontSize: 13, bold: true, color: C.fg, margin: 0, valign: "top", lineSpacing: 18 });
      s.addShape("line", { x: x + 0.28, y: y + 1.86, w: 3.34, h: 0, line: { color: C.border, width: 1 } });
      bullets(s, { x: x + 0.28, y: y + 2.0, w: 3.34, h: 2.7, items: p.b, size: 11.5, lineSpacing: 16, gap: 6 });
      x += 4.15;
    });
    s.addNotes("Part A 基础、Part B 前沿、Part C 实践。分享时长不限，可按听众背景跳过 A 的部分细节。");
  }

  // ---------- 5. Part A divider ----------
  divider(pptx, {
    num: "A", part: P, kicker: "PART A · FOUNDATIONS",
    title: "从 AI 的历史到大模型的一切",
    sub: "把「大模型」这个词拆开，让每一个零件都有名字、有出处、有为什么。",
    items: ["A1–A4 地基：神经网络 → 注意力", "A5–A9 现代 LLM 的工程实质", "A10–A13 模态、世界模型与评价"],
  });
};
