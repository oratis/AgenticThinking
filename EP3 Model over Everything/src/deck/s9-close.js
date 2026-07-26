const { C, F, newSlide, header, card, code, table, stat, bullets, band } = require("./lib");

module.exports = function (pptx) {
  const P = "结语";

  // 结语 1：三层含义回顾
  {
    const s = newSlide(pptx);
    const y = header(s, "结语", "回到标题：Model over Everything", P);
    const layers = [
      { n: "01", t: "模型是天花板", from: "Part A", b: "从 1943 年的一个神经元，到今天 671B 参数、激活 37B 的 MoE。每一次跃迁都是同一个动作：减少人工先验，增加数据与算力。工程能把你推到模型能力的边界，但推不过去。" },
      { n: "02", t: "模型凌驾于一切之上", from: "Part C", b: "一个看起来只是「选个模型」的组件，实际同时决定了：可用性、成本结构、容量上限、安全面、产品定位。Model Router 是基础设施，值得像对待数据库连接池一样对待。" },
      { n: "03", t: "模型覆盖一切模态", from: "Part B", b: "三条主线在同一个点汇合：一个能在内部模拟世界演化、并把偏差永久写回自己的系统。也就是「预测 → 行动 → 惊讶 → 更新」。" },
    ];
    let cy = y + 0.05;
    layers.forEach((l) => {
      s.addShape("roundRect", { x: 0.6, y: cy, w: 12.13, h: 1.5, rectRadius: 0.09, fill: { color: C.card }, line: { color: C.border, width: 1 } });
      s.addText(l.n, { x: 0.85, y: cy + 0.3, w: 0.9, h: 0.9, fontFace: F.sans, fontSize: 36, bold: true, color: C.accentDim, margin: 0, valign: "middle" });
      s.addText(l.t, { x: 1.85, y: cy + 0.24, w: 4.2, h: 0.42, fontFace: F.sans, fontSize: 19, bold: true, color: C.fg, margin: 0, valign: "middle" });
      s.addShape("roundRect", { x: 1.85, y: cy + 0.76, w: 1.15, h: 0.3, rectRadius: 0.15, fill: { color: C.accentSoft }, line: { color: C.accentDim, width: 1 } });
      s.addText(l.from, { x: 1.85, y: cy + 0.76, w: 1.15, h: 0.3, align: "center", fontFace: F.sans, fontSize: 10.5, bold: true, color: C.accent, margin: 0, valign: "middle" });
      s.addText(l.b, { x: 6.3, y: cy + 0.2, w: 6.2, h: 1.1, fontFace: F.sans, fontSize: 11.5, color: C.dim, margin: 0, valign: "middle", lineSpacing: 16 });
      cy += 1.62;
    });
    s.addNotes("三层含义分别对应 Part A / Part C / Part B。");
  }

  // 结语 2：同一个问题
  {
    const s = newSlide(pptx);
    const y = header(s, "结语", "三条线，最后指向同一个问题", P);
    band(s, {
      x: 0.6, y: y + 0.3, w: 12.13, h: 1.3,
      text: "如何在没有标准答案的情况下，知道自己错了。",
      size: 30, align: "center",
    });
    const who = [
      { t: "B1 长程可靠性", b: "需要它 —— 不然错误会累积（p^n）" },
      { t: "B2 写入门控", b: "需要它 —— 不然会学进假知识" },
      { t: "B3 sim2real", b: "需要它 —— 不然仿真里的错误会带到现实" },
    ];
    let x = 0.6;
    who.forEach((w) => {
      card(s, { x, y: y + 1.86, w: 3.9, h: 1.0, title: w.t, body: [w.b], titleSize: 15, bodySize: 12 });
      x += 4.15;
    });
    card(s, {
      x: 0.6, y: y + 3.06, w: 12.13, h: 1.06, title: "甚至 Part C 的 eval 体系，也是它的一个工程近似", titleSize: 14, bodySize: 12.5,
      body: ["L1 硬断言 + L2 judge + 在线指标 —— 就是在没有标准答案的生产环境里，尽可能便宜地知道「我是不是错了」。"],
      fill: C.accentSoft, line: C.accentDim,
    });
    band(s, {
      x: 0.6, y: y + 4.3, w: 12.13, h: 0.76,
      text: "如果只能押一个方向：押「惊讶信号」的定义与「更新门控」的判据。",
      size: 16, align: "center",
    });
    s.addNotes("这是我认为整场分享最重要的一句话。");
  }

  // 结语 3：三条建议
  {
    const s = newSlide(pptx);
    const y = header(s, "结语", "三条给工程师的实用建议", P);
    const adv = [
      {
        n: "1", t: "花时间理解模型，不只是调用模型",
        b: "知道 MoE 的激活参数意味着什么、知道 decode 是访存密集的、知道 tokenizer 决定了中文成本 —— 这些认知会直接变成更好的架构决策。",
        hi: "「逐个模型读源码」那种笨办法，是我认为回报最高的学习方式。",
      },
      {
        n: "2", t: "假设一切上游都会背叛你",
        b: "模型会改名、会下线、会限流、会返回 200 OK 的垃圾。route 数组、同档降级、退款闭环、目录漂移告警 ——",
        hi: "这些不是过度设计，是已经发生过的事故的疫苗。",
      },
      {
        n: "3", t: "先建 eval，再换模型",
        b: "Cuddler 的教训是「知道该做 eval，但发布压力下先发了」。补做的对照报告成本只有 $0.05，却发现了一个提示注入漏洞、实锤了 judge 会幻觉、量化了一个未来会变成用户投诉的记忆退化。",
        hi: "eval 的价值不是给模型打分，是把未来的用户投诉提前变成今天的一个数字。",
      },
    ];
    let cy = y + 0.05;
    adv.forEach((a) => {
      s.addShape("roundRect", { x: 0.6, y: cy, w: 12.13, h: 1.52, rectRadius: 0.09, fill: { color: C.card }, line: { color: C.border, width: 1 } });
      s.addShape("roundRect", { x: 0.86, y: cy + 0.24, w: 0.56, h: 0.56, rectRadius: 0.28, fill: { color: C.accent }, line: { color: C.accent, width: 1 } });
      s.addText(a.n, { x: 0.86, y: cy + 0.24, w: 0.56, h: 0.56, align: "center", fontFace: F.sans, fontSize: 20, bold: true, color: "04120A", margin: 0, valign: "middle" });
      s.addText(a.t, { x: 1.6, y: cy + 0.2, w: 10.8, h: 0.38, fontFace: F.sans, fontSize: 17, bold: true, color: C.fg, margin: 0, valign: "middle" });
      s.addText(a.b, { x: 1.6, y: cy + 0.6, w: 10.8, h: 0.46, fontFace: F.sans, fontSize: 11.5, color: C.dim, margin: 0, valign: "top", lineSpacing: 16 });
      s.addText(a.hi, { x: 1.6, y: cy + 1.08, w: 10.8, h: 0.3, fontFace: F.sans, fontSize: 12, bold: true, color: C.accent, margin: 0, valign: "middle" });
      cy += 1.64;
    });
    s.addNotes("三条建议对应 Part A / Part C 的两半。");
  }

  // 资源
  {
    const s = newSlide(pptx);
    const y = header(s, "资源", "开源仓库与延伸阅读", P);
    const repos = [
      { t: "oratis/AgenticThinking", b: "本系列全部讲义（MD / HTML / PPT / 海报）· MIT", hi: true },
      { t: "oratis/Model-Research", b: "9 个开源大模型的架构剖析 + 源码走读 + 训练机制，含《从零到一：训练你自己的大模型》成本详算" },
      { t: "DiogenesModel/Diogenes", b: "玩家模型 / 世界模型的数据线（DataMiner）与训练线（VL / IDM / WM）" },
      { t: "oratis/LISA", b: "自主 Agent 实践与 Learning in Referencing 持续学习研究" },
    ];
    let cy = y + 0.05;
    repos.forEach((r) => {
      s.addShape("roundRect", { x: 0.6, y: cy, w: 12.13, h: 0.78, rectRadius: 0.07, fill: { color: r.hi ? C.accentSoft : C.card }, line: { color: r.hi ? C.accentDim : C.border, width: 1 } });
      s.addText(r.t, { x: 0.86, y: cy, w: 4.2, h: 0.78, fontFace: F.mono, fontSize: 13, bold: true, color: C.accent, margin: 0, valign: "middle" });
      s.addText(r.b, { x: 5.2, y: cy + 0.06, w: 7.3, h: 0.66, fontFace: F.sans, fontSize: 11, color: C.dim, margin: 0, valign: "middle", lineSpacing: 14.5 });
      cy += 0.86;
    });
    const cols = [
      { t: "论文与关键工作", b: ["Attention Is All You Need (1706.03762)", "Scaling Laws (2001.08361) · Chinchilla (2203.15556)", "DeepSeek V3 (2412.19437) · R1 (2501.12948)", "Qwen3 (2505.09388) · GLM-4.5 (2508.06471)", "OLMo 2 (2501.00656) · MiniMax-01 (2501.08313)", "Nested Learning · METR Time Horizon 1.1", "π0.7 (2604.15483) · VLA 综述 (2507.01925)"] },
      { t: "工程栈", b: ["预训练：Megatron-LM · TorchTitan · nanotron · DeepSpeed", "微调：LLaMA-Factory · Axolotl · TRL / PEFT · Unsloth", "对齐：TRL (DPO/PPO/GRPO) · OpenRLHF · verl", "推理：vLLM · SGLang · TensorRT-LLM", "评测：lm-evaluation-harness · OpenCompass · lighteval"] },
    ];
    let x = 0.6;
    cols.forEach((c2) => {
      card(s, { x, y: cy + 0.14, w: 5.96, h: 1.72, title: c2.t, body: c2.b, bullet: true, titleSize: 13.5, bodySize: 10, lineSpacing: 14, gap: 1 });
      x += 6.17;
    });
    s.addNotes("讲义仓库以 MIT 协议开源。");
  }

  // End
  {
    const s = newSlide(pptx);
    s.addShape("rect", { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: "050607" } });
    s.addText("Model over", {
      x: 0.9, y: 1.98, w: 11.5, h: 1.05, fontFace: F.sans, fontSize: 58, bold: true, color: C.fg, margin: 0, valign: "middle", align: "center",
    });
    s.addText("Everything", {
      x: 0.9, y: 2.9, w: 11.5, h: 1.05, fontFace: F.sans, fontSize: 58, bold: true, color: C.accent, margin: 0, valign: "middle", align: "center",
    });
    s.addShape("line", { x: 4.9, y: 4.14, w: 3.53, h: 0, line: { color: C.accentDim, width: 1 } });
    s.addText("模型是天花板；工程决定你离天花板多远。", {
      x: 0.9, y: 4.34, w: 11.5, h: 0.44, fontFace: F.sans, fontSize: 18, color: C.dim, margin: 0, valign: "middle", align: "center",
    });
    s.addText("Agentic Thinking EP03   ·   Oratis   ·   2026.07.28", {
      x: 0.9, y: 5.5, w: 11.5, h: 0.36, fontFace: F.sans, fontSize: 13, color: C.faint, margin: 0, valign: "middle", align: "center", charSpacing: 1.4,
    });
    s.addText("github.com/oratis/AgenticThinking   ·   MIT", {
      x: 0.9, y: 5.9, w: 11.5, h: 0.3, fontFace: F.mono, fontSize: 11, color: C.accentDim, margin: 0, valign: "middle", align: "center",
    });
    s.addNotes("Q&A。");
  }
};
