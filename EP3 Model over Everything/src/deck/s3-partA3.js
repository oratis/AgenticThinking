const { C, F, newSlide, header, card, code, table, stat, bullets, band } = require("./lib");

module.exports = function (pptx) {
  const P = "PART A · 基础";

  // A8-1 训练全流程 + 数据
  {
    const s = newSlide(pptx);
    const y = header(s, "A8 · 训练全流程", "数据是真正的瓶颈，不是 GPU", P);
    code(s, {
      x: 0.6, y: y + 0.05, w: 12.13, h: 0.6, size: 12,
      text: "①数据 → ②预训练 → ③中训练/退火 → ④SFT → ⑤偏好对齐 → ⑥评测 → ⑦部署", color: C.accent,
    });
    table(s, {
      x: 0.6, y: y + 0.82, w: 12.13, colW: [1.85, 10.28], size: 11, rowH: 0.44, boldFirst: true,
      head: ["子项", "要点"],
      rows: [
        ["规模", "Chinchilla 最优 ≈ 20 tokens/参数；但 Llama 3 8B 用 15T ≈ 1875 tokens/参数 —— 推理成本比训练成本重要，宁可「过度训练」小模型"],
        ["来源", "FineWeb / FineWeb-Edu (15T+)、Dolma、The Stack v2、RedPajama、C4；中文 WuDao / Chinese-FineWeb / CCI"],
        ["清洗", "去重（MinHash / exact）、质量分类器、去毒、PII 脱敏、语言过滤 —— 决定模型上限"],
        ["配比与课程", "网页/代码/数学/多语的比例；后期用高质量数据「退火」（OLMo 2、Qwen 都这么做）"],
        ["合成数据", "Phi 的核心招式：用强模型生成教科书级数据。小团队弯道超车的路"],
        ["Tokenizer", "BPE / BBPE，词表 32k → 128k → 256k。大词表利多语但增大 embedding 参数"],
        ["合规", "CC-BY-NC 不能商用训练；代码/书籍/网页各有版权风险"],
      ],
    });
    band(s, {
      x: 0.6, y: y + 4.1, w: 12.13, h: 0.96,
      text: "Tokenizer 冷知识：它是模型的「感官」。中文在 32k 英文词表下可能 1 字 = 2–3 token，直接推高成本、降低有效上下文。\n也是模型不会数「strawberry 里有几个 r」的根因 —— 它看到的不是字母。",
      size: 13, lineSpacing: 20,
    });
    s.addNotes("语料免费，但清洗/去重要大量 CPU + 存储 + 人力；数据工程人力往往是最大隐性成本。");
  }

  // A8-2 对齐方法
  {
    const s = newSlide(pptx);
    const y = header(s, "A8 · 后训练", "从「续写器」到「助手」：SFT 与偏好对齐", P);
    card(s, {
      x: 0.6, y: y + 0.08, w: 12.13, h: 0.82, title: "SFT 监督微调", titleSize: 14, bodySize: 12,
      body: ["用（指令, 理想回答）对微调。数据量几万到几百万条，质量 >> 数量（LIMA：1000 条精选也 work）。训练时通常只在 assistant 部分算 loss。"],
    });
    table(s, {
      x: 0.6, y: y + 1.08, w: 12.13, colW: [2.5, 5.6, 4.03], size: 11, rowH: 0.42, boldFirst: true,
      head: ["方法", "机制", "特点"],
      rows: [
        ["RLHF (PPO)", "训一个奖励模型 RM，再用 PPO 优化策略", "InstructGPT 原版；四个模型同时在显存里，工程复杂"],
        ["拒绝采样", "采 N 个回答，用 RM 挑最好的做 SFT", "简单有效，Llama 2 用"],
        [{ t: "DPO", b: true, c: C.accent }, "直接用偏好对优化，不需要显式 RM", "数学上等价 RLHF 闭式解；简单稳定，Llama 3 改用它"],
        [{ t: "GRPO", b: true, c: C.accent }, "去掉 critic，用组内相对优势", "DeepSeek-R1；省显存，适合大规模 RL"],
        [{ t: "RLVR", b: true, c: C.accent }, "奖励来自可验证结果（代码跑通、数学答案对）", "无需人类标注，是推理模型的关键"],
        ["CISPO", "裁剪重要性采样权重而非 token", "MiniMax-M1，长上下文 RL 更稳"],
        ["Constitutional AI", "用 AI 反馈替代人类反馈 + 一套明文原则", "Anthropic"],
      ],
    });
    band(s, {
      x: 0.6, y: y + 4.22, w: 12.13, h: 0.68,
      text: "中训练 / 退火：预训练末期切到高质量数据 + 降 LR。长上下文扩展、代码数学强化、领域注入，成本远低于重训。",
      size: 13,
    });
    s.addNotes("RLVR 是 2025 年最重要的范式转变 —— 把标注瓶颈变成验证器瓶颈。");
  }

  // A8-3 三条路线成本
  {
    const s = newSlide(pptx);
    const y = header(s, "A8 · 现实路线", "「训练一个大模型」在花费上能差 6 个数量级", P);
    const routes = [
      { n: "A", t: "微调 / 继续训练", scale: "复用 0.5B–70B", cost: "$几十 ～ 几千", who: "绝大多数人", on: true, d: "现成开源底座做 SFT / LoRA / 继续预训练" },
      { n: "B", t: "从零预训练（中小）", scale: "0.1B–8B", cost: "$几千 ～ 几百万", who: "教学 / 科研 / 领域专用", on: false, d: "从随机初始化训" },
      { n: "C", t: "从零训练前沿", scale: "30B–500B+", cost: "$数百万 ～ 数千万+", who: "有融资的团队 / 大厂", on: false, d: "通用大模型，几百人 + 上万张卡" },
    ];
    let cy = y + 0.12;
    routes.forEach((r) => {
      s.addShape("roundRect", { x: 0.6, y: cy, w: 12.13, h: 1.24, rectRadius: 0.09, fill: { color: r.on ? C.accentSoft : C.card }, line: { color: r.on ? C.accentDim : C.border, width: 1 } });
      s.addText(r.n, { x: 0.85, y: cy + 0.28, w: 0.75, h: 0.68, fontFace: F.sans, fontSize: 34, bold: true, color: r.on ? C.accent : C.faint, margin: 0, valign: "middle" });
      s.addText(r.t, { x: 1.7, y: cy + 0.2, w: 3.6, h: 0.4, fontFace: F.sans, fontSize: 17, bold: true, color: C.fg, margin: 0, valign: "middle" });
      s.addText(r.d, { x: 1.7, y: cy + 0.62, w: 3.9, h: 0.46, fontFace: F.sans, fontSize: 11, color: C.dim, margin: 0, valign: "top", lineSpacing: 15 });
      s.addText("规模", { x: 5.8, y: cy + 0.22, w: 1.8, h: 0.24, fontFace: F.sans, fontSize: 9.5, color: C.faint, charSpacing: 1.1, margin: 0 });
      s.addText(r.scale, { x: 5.8, y: cy + 0.5, w: 1.9, h: 0.34, fontFace: F.sans, fontSize: 13, color: C.fg, margin: 0, valign: "middle" });
      s.addText("成本", { x: 7.9, y: cy + 0.22, w: 1.8, h: 0.24, fontFace: F.sans, fontSize: 9.5, color: C.faint, charSpacing: 1.1, margin: 0 });
      s.addText(r.cost, { x: 7.9, y: cy + 0.5, w: 2.5, h: 0.34, fontFace: F.sans, fontSize: 13.5, bold: true, color: r.on ? C.accent : C.fg, margin: 0, valign: "middle" });
      s.addText("适合谁", { x: 10.5, y: cy + 0.22, w: 2.0, h: 0.24, fontFace: F.sans, fontSize: 9.5, color: C.faint, charSpacing: 1.1, margin: 0 });
      s.addText(r.who, { x: 10.5, y: cy + 0.5, w: 2.1, h: 0.44, fontFace: F.sans, fontSize: 12, color: C.dim, margin: 0, valign: "top", lineSpacing: 15 });
      cy += 1.42;
    });
    band(s, {
      x: 0.6, y: cy + 0.1, w: 12.13, h: 0.75,
      text: "心法：先 A 跑通流程 → 再用 B 训一个 0.1–1B 完整复现「预训练→SFT→对齐」（几百美金，最好的学习）→ 有资源再谈 C。",
      size: 13.5, align: "center",
    });
    s.addNotes("本仓库研究的九个模型几乎都属路线 C。对个人/小团队，现实的是 A 与小号的 B。");
  }

  // A9-1 训练卡
  {
    const s = newSlide(pptx);
    const y = header(s, "A9 · 算力", "训练卡：显存带宽常常比算力更重要", P);
    table(s, {
      x: 0.6, y: y + 0.05, w: 12.13, colW: [2.4, 2.1, 2.2, 3.0, 2.43], size: 11, rowH: 0.4, boldFirst: true,
      head: ["GPU", "显存", "显存带宽", "定位", "租赁价（2026 约值）"],
      rows: [
        ["A100 80GB", "80 GB HBM2e", "~2.0 TB/s", "入门 / 微调", "$1–2 /卡·时"],
        [{ t: "H100 80GB", b: true, c: C.accent }, "80 GB HBM3", "~3.35 TB/s", "主力", "$2–4（承诺 $1.5–2.5）"],
        ["H200", "141 GB HBM3e", "~4.8 TB/s", "大模型 / 长上下文", "$3–5"],
        ["B200 / GB200", "180 GB+ HBM3e", "~8 TB/s", "新一代", "$4–8"],
        [{ t: "H20", b: true, c: C.warn }, "96 GB HBM3", "~4.0 TB/s", { t: "算力被阉割、带宽保留 → 适合推理", c: C.warn }, "国内可得"],
        ["昇腾 910B 等", "—", "—", "合规 / 供应受限", "经国内云"],
      ],
    });
    band(s, {
      x: 0.6, y: y + 2.72, w: 12.13, h: 0.95,
      text: "H20 是极端例子：FLOPS 大幅削减但 HBM 带宽保留 → 训练很差，推理（尤其 decode 阶段）却不差。\n因为自回归解码是访存密集，而非计算密集。",
      size: 13.5, lineSpacing: 21,
    });
    card(s, {
      x: 0.6, y: y + 3.85, w: 5.96, h: 1.2, title: "多机训练的硬约束", titleSize: 14, bodySize: 12, bullet: true,
      body: ["必须 InfiniBand / NVLink 高速互联，否则并行效率崩", "TP 通信极重 —— 必须在 NVLink 域内"],
    });
    card(s, {
      x: 6.77, y: y + 3.85, w: 5.96, h: 1.2, title: "租 vs 买", titleSize: 14, bodySize: 12, bullet: true,
      body: ["起步租云（Lambda / CoreWeave / RunPod / 三大云）", "H100 单卡 ~$25k–35k，8 卡整机 ~$250k–400k + IB + 机房 + 电"],
    });
    s.addNotes("显存带宽是被最多人忽略的一个维度。");
  }

  // A9-2 显存 + 并行
  {
    const s = newSlide(pptx);
    const y = header(s, "A9 · 显存", "训练一个 N 参数模型，显存都被谁吃了", P);
    table(s, {
      x: 0.6, y: y + 0.05, w: 5.96, colW: [3.86, 2.1], size: 11.5, rowH: 0.34, boldFirst: true,
      head: ["项（BF16 混合精度 + AdamW）", "大小"],
      rows: [
        ["参数（BF16）", "2N"],
        ["梯度（BF16）", "2N"],
        ["Adam 一阶动量（FP32）", "4N"],
        ["Adam 二阶动量（FP32）", "4N"],
        ["FP32 主参数副本", "4N"],
        [{ t: "小计", b: true, c: C.accent }, { t: "≈ 16N 字节", b: true, c: C.accent }],
        [{ t: "激活值", c: C.warn }, { t: "常常是最大项", c: C.warn }],
      ],
    });
    band(s, {
      x: 0.6, y: y + 2.66, w: 5.96, h: 0.86,
      text: "7B 模型光优化器状态就要 ~112 GB —— 单张 H100 装不下。这就是必须并行的原因。",
      size: 12.5, lineSpacing: 18,
    });
    table(s, {
      x: 6.77, y: y + 0.05, w: 5.96, colW: [1.85, 1.9, 2.21], size: 10.5, rowH: 0.4, boldFirst: true,
      head: ["并行策略", "切什么", "通信"],
      rows: [
        ["DP 数据并行", "切 batch", "all-reduce 梯度"],
        [{ t: "ZeRO / FSDP", b: true, c: C.accent }, "切优化器状态/梯度/参数", "all-gather + reduce-scatter"],
        ["TP 张量并行", "切单个矩阵", "每层 2 次 all-reduce"],
        ["PP 流水线并行", "切层", "点对点（有气泡）"],
        ["EP 专家并行", "切 MoE 专家", "all-to-all"],
        ["CP / SP", "切序列", "ring attention"],
      ],
    });
    card(s, {
      x: 6.77, y: y + 2.66, w: 5.96, h: 0.86, title: "大规模训练是它们的组合", titleSize: 13, bodySize: 11.5,
      body: ["如 TP=8, PP=16, DP=64。省显存的其他招：激活重计算、混合精度、CPU offload。"],
    });
    code(s, {
      x: 0.6, y: y + 3.66, w: 12.13, h: 1.24, size: 12, lineSpacing: 20,
      text: "训练算力 ≈ 6 × N(参数) × D(tokens)  FLOPs        # 6 = 前向2 + 反向4\nGPU·小时 = 6ND / (单卡FLOPS × MFU)               # MFU 好的实现 40–50%",
      color: C.accent,
    });
    s.addNotes("6ND 是必须记住的公式。");
  }

  // A9-3 成本表
  {
    const s = newSlide(pptx);
    const y = header(s, "A9 · 成本", "以 H100（有效 ~400 TFLOP/s）估算", P);
    table(s, {
      x: 0.6, y: y + 0.05, w: 12.13, colW: [1.9, 2.0, 2.9, 2.8, 2.53], size: 11.5, rowH: 0.4, boldFirst: true,
      head: ["模型 N", "tokens D", "GPU·小时 (H100)", "算力成本 @$2", "类比"],
      rows: [
        ["0.1B", "10B", "~4", { t: "~$10", b: true, c: C.accent }, "玩具 / 教学"],
        ["0.5B", "100B", "~210", { t: "~$420", b: true, c: C.accent }, "周末项目"],
        ["1B", "1T", "~4.2k", { t: "~$8k", b: true }, "小领域模型"],
        ["7B", "1T", "~29k", { t: "~$58k", b: true }, "入门可用"],
        ["7–8B", "15T", "~440k", { t: "~$0.9M（实际 $1–2.6M）", b: true, c: C.warn }, "Llama 3 8B 级"],
        ["70B", "15T", "~4.4M", { t: "~$9M（实际 $13M+）", b: true, c: C.warn }, "Llama 3 70B 级"],
        ["405B", "15T", "~25–30M", { t: "~$50–60M+", b: true, c: C.bad }, "前沿稠密"],
      ],
    });
    card(s, {
      x: 0.6, y: y + 3.28, w: 5.96, h: 1.1, title: "实际 ≈ 表中 × 1.5–3", titleSize: 14, bodySize: 12,
      body: ["MFU 达不到、失败重跑、调参实验、数据/存储/人力都没算进去。"],
      fill: C.card, line: C.warn,
    });
    card(s, {
      x: 6.77, y: y + 3.28, w: 5.96, h: 1.1, title: "省钱杠杆", titleSize: 14, bodySize: 12, bullet: true,
      body: ["FP8 训练（DeepSeek 做法）再降 30–50%", "MoE：同等效果激活参数更少"],
      fill: C.card, line: C.accentDim,
    });
    band(s, {
      x: 0.6, y: y + 4.56, w: 12.13, h: 0.5,
      text: "$420 就能训一个 0.5B 走完全流程 —— 这是最好的学习投资。", size: 13, align: "center",
    });
    s.addNotes("详见 Model-Research 的 docs/10-how-to-train.md。");
  }

  // A9-4 推理
  {
    const s = newSlide(pptx);
    const y = header(s, "A9 · 推理", "两个完全不同的阶段，与内存墙", P);
    const ph = [
      { t: "Prefill", d: "一次性处理整个 prompt", b: "算力密集（大矩阵乘）", o: "chunked prefill · prompt caching", c: C.accent },
      { t: "Decode", d: "一次生成一个 token", b: "访存密集（每 token 把全部权重从 HBM 读一遍）", o: "批处理提升算术强度 · 投机解码", c: C.warn },
    ];
    let x = 0.6;
    ph.forEach((p) => {
      s.addShape("roundRect", { x, y: y + 0.08, w: 5.96, h: 1.62, rectRadius: 0.09, fill: { color: C.card }, line: { color: C.border, width: 1 } });
      s.addText(p.t, { x: x + 0.26, y: y + 0.24, w: 5.44, h: 0.36, fontFace: F.sans, fontSize: 19, bold: true, color: p.c, margin: 0, valign: "middle" });
      s.addText(p.d, { x: x + 0.26, y: y + 0.62, w: 5.44, h: 0.28, fontFace: F.sans, fontSize: 12, color: C.dim, margin: 0, valign: "middle" });
      s.addText("瓶颈：" + p.b, { x: x + 0.26, y: y + 0.94, w: 5.44, h: 0.4, fontFace: F.sans, fontSize: 12, bold: true, color: C.fg, margin: 0, valign: "top", lineSpacing: 16 });
      s.addText("优化：" + p.o, { x: x + 0.26, y: y + 1.34, w: 5.44, h: 0.28, fontFace: F.sans, fontSize: 11.5, color: C.accent, margin: 0, valign: "middle" });
      x += 6.17;
    });
    band(s, {
      x: 0.6, y: y + 1.86, w: 12.13, h: 0.52,
      text: "因此 P/D 分离部署（prefill 与 decode 用不同机器/配置）成了 2025–2026 的主流做法。", size: 13, align: "center",
    });
    table(s, {
      x: 0.6, y: y + 2.54, w: 12.13, colW: [3.0, 9.13], size: 11, rowH: 0.36, boldFirst: true,
      head: ["关键推理技术", "说明"],
      rows: [
        ["KV Cache", "缓存历史 K/V 避免重算，代价是显存"],
        [{ t: "PagedAttention (vLLM)", b: true, c: C.accent }, "用操作系统分页思想管理 KV cache，消灭碎片，吞吐提升数倍"],
        ["连续批处理", "请求随到随入，不等一整批"],
        ["量化", "INT8 / FP8 / INT4（AWQ、GPTQ）—— 显存和带宽双降，消费级部署关键"],
        ["投机解码", "小模型（或 MTP 头）先猜 k 个 token，大模型一次并行验证 → 2–3× 加速"],
        [{ t: "Prompt Caching", b: true, c: C.accent }, "复用系统提示的 KV，成本可降 90% —— 对 Agent 尤其重要（上下文前缀高度重复）"],
      ],
    });
    band(s, {
      x: 0.6, y: y + 4.9, w: 12.13, h: 0.52,
      text: "内存墙：现代架构创新的一大半，本质上都是内存带宽优化。", size: 13.5, align: "center",
    });
    s.addNotes("GQA/MLA 少搬 KV；量化少搬权重；MoE 少搬激活权重；FlashAttention 不把 n×n 写回 HBM。");
  }
};
