const { C, F, newSlide, header, card, code, table, stat, bullets, band } = require("./lib");

module.exports = function (pptx) {
  const P = "PART A · 基础";

  // A10 VAE / GAN / Diffusion
  {
    const s = newSlide(pptx);
    const y = header(s, "A10 · 生成模型", "另一条谱系：VAE → GAN → Diffusion", P);
    const g = [
      { t: "VAE (2013)", b: ["让 latent 服从高斯分布，于是可以采样生成", "代价：生成结果偏糊"], hi: "今天最重要的角色不是生成，是当 tokenizer —— Diffusion / 世界模型都先用 VAE 把像素压进 latent。保真度直接决定整个系统上限。" },
      { t: "GAN (2014)", b: ["生成器造假，判别器鉴别，博弈到纳什均衡", "优点：生成锐利，采样一次前向", "缺点：训练不稳、模式崩溃、无似然"], hi: "遗产：「当你无法写出损失函数时，就学一个」—— 从 GAN 到 RLHF 的奖励模型是同一个母题。" },
      { t: "Diffusion (2020–)", b: ["前向逐步加噪，反向训网络预测噪声去噪", "训练目标是简单回归 → 稳定、不崩溃", "代价：采样几十上百步 → 慢"], hi: "Latent Diffusion 在 VAE latent 里扩散；DiT 把 U-Net 换成 Transformer（Sora / 现代视频模型全是 DiT）。" },
    ];
    let x = 0.6;
    g.forEach((it) => {
      s.addShape("roundRect", { x, y: y + 0.08, w: 3.9, h: 3.5, rectRadius: 0.09, fill: { color: C.card }, line: { color: C.border, width: 1 } });
      s.addText(it.t, { x: x + 0.26, y: y + 0.26, w: 3.4, h: 0.36, fontFace: F.sans, fontSize: 17, bold: true, color: C.accent, margin: 0, valign: "middle" });
      bullets(s, { x: x + 0.26, y: y + 0.72, w: 3.38, h: 1.5, items: it.b, size: 11.5, lineSpacing: 16, gap: 5 });
      s.addShape("line", { x: x + 0.26, y: y + 2.24, w: 3.38, h: 0, line: { color: C.border, width: 1 } });
      s.addText(it.hi, { x: x + 0.26, y: y + 2.36, w: 3.38, h: 1.06, fontFace: F.sans, fontSize: 11, color: C.fg, margin: 0, valign: "top", lineSpacing: 15 });
      x += 4.15;
    });
    code(s, {
      x: 0.6, y: y + 3.72, w: 5.96, h: 0.6, size: 12,
      text: "L = E‖ε − ε_θ(x_t, t)‖²      # 极其简单稳定", color: C.accent,
    });
    card(s, {
      x: 6.77, y: y + 3.72, w: 5.96, h: 0.6, title: "", titleSize: 1, bodySize: 11.5,
      body: ["少步采样：DDIM / Progressive / Consistency / Self-Forcing（压到 1–4 步）。Flow Matching / Rectified Flow 路径更直 —— SD3、FLUX、机器人 VLA 动作头都在用。"],
    });
    band(s, {
      x: 0.6, y: y + 4.48, w: 12.13, h: 0.52,
      text: "扩散语言模型（LLaDA / Mercury / Gemini Diffusion）：并行迭代去噪整段文本 —— 值得关注但尚未成为主流。",
      size: 12.5, align: "center",
    });
    s.addNotes("GAN 在 2022 年后被 Diffusion 大面积取代，但对抗损失作为辅助损失仍广泛使用。");
  }

  // A11 多模态
  {
    const s = newSlide(pptx);
    const y = header(s, "A11 · 多模态与全模态", "如何把所有模态统一成 token 序列", P);
    table(s, {
      x: 0.6, y: y + 0.05, w: 12.13, colW: [2.9, 6.0, 3.23], size: 11, rowH: 0.42, boldFirst: true,
      head: ["接法", "做法", "代表"],
      rows: [
        ["投影/适配器（后接）", "冻结视觉编码器 → MLP/Q-Former 投影成视觉 token → 拼进 LLM 上下文", "LLaVA、BLIP-2、Qwen-VL"],
        ["交叉注意力", "在 LLM 的层里插入 cross-attention 读视觉特征", "Flamingo、Llama 3.2-V"],
        [{ t: "原生多模态（早融合）", b: true, c: C.accent }, "从预训练阶段就混合多模态 token 一起训", "GPT-4o、Gemini、Llama 4、Qwen3-Omni"],
      ],
    });
    band(s, {
      x: 0.6, y: y + 1.62, w: 12.13, h: 0.5,
      text: "趋势非常清楚：从「后接」走向「原生」。后接便宜但模态间是翻译关系；原生贵但真正共享表示。",
      size: 13, align: "center",
    });
    const mods = [
      { t: "文本", b: "BPE token（离散，天然）" },
      { t: "图像", b: "ViT patch → 连续特征；或 VQ-VAE → 离散视觉 token" },
      { t: "音频", b: "梅尔谱 → 编码器；或神经音频编解码器（EnCodec / SNAC）→ 离散 token" },
      { t: "视频", b: "时空 patch（3D tokenizer）；或逐帧 + 时序压缩" },
      { t: "动作", b: "连续动作离散化（分箱 / FAST）；或连续动作头" },
    ];
    let cy = y + 2.28;
    mods.forEach((m) => {
      s.addShape("roundRect", { x: 0.6, y: cy, w: 5.96, h: 0.46, rectRadius: 0.06, fill: { color: C.card }, line: { color: C.border, width: 1 } });
      s.addText(m.t, { x: 0.82, y: cy, w: 1.1, h: 0.46, fontFace: F.sans, fontSize: 12, bold: true, color: C.accent, margin: 0, valign: "middle" });
      s.addText(m.b, { x: 1.92, y: cy, w: 4.5, h: 0.46, fontFace: F.sans, fontSize: 10.5, color: C.dim, margin: 0, valign: "middle", lineSpacing: 13 });
      cy += 0.54;
    });
    card(s, {
      x: 6.77, y: y + 2.28, w: 5.96, h: 1.2, title: "输出侧的两条路", titleSize: 13.5, bodySize: 11.5, bullet: true,
      body: ["离散 token 统一自回归：架构统一、真端到端，但 tokenizer 保真成瓶颈", "混合头：文本自回归 + 图像/音频扩散头，质量更好但非纯端到端"],
    });
    card(s, {
      x: 6.77, y: y + 3.6, w: 5.96, h: 1.38, title: "为什么端到端语音重要", titleSize: 13.5, bodySize: 11.5,
      body: ["传统 ASR→LLM→TTS 级联会丢掉语气、情绪、停顿、打断，且延迟叠加。原生语音模型直接在音频 token 上工作，保留副语言信息、支持全双工打断。"],
    });
    s.addNotes("最终形态是 any-to-any：输入输出都是任意模态的交错序列。");
  }

  // A12-1 世界模型定义
  {
    const s = newSlide(pptx);
    const y = header(s, "A12 · 世界模型", "从预测像素到理解物理", P);
    code(s, {
      x: 0.6, y: y + 0.08, w: 5.96, h: 0.68, size: 15,
      text: "s_{t+1} ~ p( · | s_t , a_t )", color: C.accent,
    });
    card(s, {
      x: 6.77, y: y + 0.08, w: 5.96, h: 0.68, title: "", titleSize: 1, bodySize: 12,
      body: ["价值：智能体可以在脑子里试错（想象），不必在真实世界里试。"],
    });
    table(s, {
      x: 0.6, y: y + 0.96, w: 12.13, colW: [2.4, 3.4, 3.0, 3.33], size: 11, rowH: 0.5, boldFirst: true,
      head: ["路线", "代表", "在哪个空间预测", "优缺点"],
      rows: [
        ["生成式（像素）", "Genie、Cosmos、GameNGen、Sora", "直接预测下一帧图像", "直观、可玩；但浪费算力在无关细节上"],
        [{ t: "预测式（表征）", b: true, c: C.accent }, "JEPA / V-JEPA 2（LeCun 路线）", "在抽象表征空间预测", "只预测「可预测的部分」，更接近理解；但不能直接看"],
      ],
    });
    band(s, {
      x: 0.6, y: y + 2.14, w: 12.13, h: 0.86,
      text: "LeCun 的论点：让模型预测像素是错的，因为世界本质上不可完全预测；应该预测抽象表征，把不可预测的部分交给隐变量。",
      size: 13, lineSpacing: 19,
    });
    s.addText("关键概念：真实视频有画面但没有动作标签，两个办法 ——", {
      x: 0.6, y: y + 3.14, w: 12.13, h: 0.32, fontFace: F.sans, fontSize: 14, bold: true, color: C.fg, margin: 0, valign: "middle",
    });
    card(s, {
      x: 0.6, y: y + 3.54, w: 5.96, h: 1.3, title: "IDM · 逆动力学模型", titleSize: 15, bodySize: 12,
      body: ["给定前后两帧，反推中间执行了什么动作。用少量标注训一个 IDM，给海量无标注视频自动打动作标签 —— OpenAI VPT 的核心招式（70k 小时视频只标了 2k 小时）。"],
    });
    card(s, {
      x: 6.77, y: y + 3.54, w: 5.96, h: 1.3, title: "LAM · 潜在动作模型", titleSize: 15, bodySize: 12,
      body: ["干脆不定义动作是什么，无监督地学一套潜在动作码本。Genie 就是这么做的：从无标注视频学出离散潜在动作空间，让用户可以「按键」控制生成。"],
    });
    s.addNotes("IDM 和 LAM 是数据放大器 —— 把人类标注瓶颈变成算力瓶颈。");
  }

  // A12-2 2026 格局 + 三条真相
  {
    const s = newSlide(pptx);
    const y = header(s, "A12 · 世界模型", "2026 格局，与三条工程真相", P);
    table(s, {
      x: 0.6, y: y + 0.02, w: 12.13, colW: [2.5, 2.1, 2.7, 4.83], size: 10.5, rowH: 0.4, boldFirst: true,
      head: ["系统", "组织", "参数", "关键数字"],
      rows: [
        [{ t: "Genie 3", b: true, c: C.accent }, "Google DeepMind", "未披露", "720p / 24fps 实时，文本或图像生成可交互 3D 环境；物体恒常性 + 涌现物理；会话仍只有几分钟"],
        ["Cosmos", "NVIDIA", "4B–14B（C3 到 32B+32B）", "物理感知视频生成 + 合成传感数据；宽松商用许可"],
        ["V-JEPA 2", "Meta", "—", "100 万小时视频 + <62 小时机器人数据 → 零样本机器人规划"],
        ["Matrix-Game 3.0", "Skywork", "5B 实时 / 2×14B MoE", "8 GPU，40fps 720p；分钟级记忆靠检索而非参数"],
        ["Yan（元梦之星）", "腾讯", "未披露（4 步蒸馏 + FP8）", "1080p/60fps，0.11s 延迟；>4 亿帧单游戏数据"],
        ["MIRA", "General Intuition", "5B", "10,000 小时纯 bot 对局（零人类数据），20fps"],
      ],
    });
    const truths = [
      { n: "1", t: "参数量不是瓶颈", b: "公开的单游戏可玩引擎全在 0.3–5B。质量瓶颈排序：VAE/tokenizer 保真 ＞ 少步蒸馏配方 ＞ 数据质量 ＞ 参数量。17B 的 Matrix-Game 1.0 反而只能离线出片 —— 大就等于不可玩。" },
      { n: "2", t: "长程记忆不能靠参数堆", b: "DIAMOND 作者自述「scale 治不了记忆」；Matrix-Game 3.0 的分钟级记忆靠相机感知检索。记忆是架构问题，不是规模问题。" },
      { n: "3", t: "钱应该花在数据上", b: "Cosmos 3 用 20T token。前沿实验室的投入一致砸向数据 + 统一动作空间 + 记忆机制，不是参数军备竞赛。" },
    ];
    let x = 0.6;
    truths.forEach((t) => {
      s.addShape("roundRect", { x, y: y + 2.66, w: 3.9, h: 2.28, rectRadius: 0.09, fill: { color: C.accentSoft }, line: { color: C.accentDim, width: 1 } });
      s.addText(t.n, { x: x + 0.26, y: y + 2.8, w: 0.4, h: 0.34, fontFace: F.sans, fontSize: 17, bold: true, color: C.accent, margin: 0, valign: "middle" });
      s.addText(t.t, { x: x + 0.68, y: y + 2.8, w: 2.98, h: 0.34, fontFace: F.sans, fontSize: 13.5, bold: true, color: C.fg, margin: 0, valign: "middle" });
      s.addText(t.b, { x: x + 0.26, y: y + 3.24, w: 3.4, h: 1.56, fontFace: F.sans, fontSize: 11, color: C.dim, margin: 0, valign: "top", lineSpacing: 15 });
      x += 4.15;
    });
    s.addNotes("来自 Diogenes 的单游戏 vs 通用世界模型规模调研。");
  }

  // A13 评测 / 幻觉 / 对齐
  {
    const s = newSlide(pptx);
    const y = header(s, "A13 · 评测与对齐", "benchmark 测的能力，可能不是你需要的能力", P);
    table(s, {
      x: 0.6, y: y + 0.02, w: 12.13, colW: [2.0, 5.2, 4.93], size: 11, rowH: 0.38, boldFirst: true,
      head: ["类型", "例子", "局限"],
      rows: [
        ["知识", "MMLU / MMLU-Pro / GPQA", "污染严重；MMLU 已饱和"],
        ["数学", "GSM8K / MATH / AIME", "AIME 每年新题，相对干净"],
        ["代码", "HumanEval / LiveCodeBench / SWE-bench", "SWE-bench 最接近真实工作"],
        [{ t: "Agent", b: true, c: C.accent }, "TAU-bench / BFCL / WebArena / METR 时间跨度", "最贵也最有信息量"],
        ["对话 / 创作", "LMArena Elo / EQ-Bench / RPBench", "主观；单轮 arena 排名 ≠ 多轮能力"],
        ["长上下文", "RULER / LongBench / 大海捞针", "捞针太简单，RULER 更严"],
      ],
    });
    band(s, {
      x: 0.6, y: y + 2.5, w: 12.13, h: 0.98,
      text: "两个必须知道的坑：① 厂商自报分数设置不一（few-shot 数、CoT、温度、投票），不能直接横向排名。\n② RPBench-Auto 显示「单轮 arena 冠军」在多轮角色扮演里能掉到下半区 —— 这一点 Part C 会再出现。",
      size: 13, lineSpacing: 20,
    });
    card(s, {
      x: 0.6, y: y + 3.62, w: 5.96, h: 1.36, title: "幻觉：为什么根治不了", titleSize: 14, bodySize: 11.5,
      body: ["模型优化的是「下一个 token 的似然」，不是真实性。当训练分布里「自信的回答」比「我不知道」更常见时，模型就学会了自信地编。缓解手段都有，但没有一个能根治 —— 模型没有「知道自己不知道」的机制。"],
    });
    card(s, {
      x: 6.77, y: y + 3.62, w: 5.96, h: 1.36, title: "对齐与安全", titleSize: 14, bodySize: 11.5, bullet: true,
      body: ["Helpful / Harmless / Honest 三元张力", "越狱与提示注入：把用户内容或工具返回当指令执行 —— Agent 时代最大的安全面", "Part C 有一个真实案例：两个模型都中招了"],
    });
    s.addNotes("「知道自己不知道」这个缺口，会在 Part B 再次出现 —— 它是持续学习门控的核心难题。");
  }

  // Part A 小结
  {
    const s = newSlide(pptx);
    const y = header(s, "Part A 小结", "一张概念地图，与三句话", P);
    code(s, {
      x: 0.6, y: y + 0.02, w: 7.0, h: 3.55, size: 9.5, lineSpacing: 13.5,
      text: [
        "                ┌─ 数据（清洗/配比/合成/tokenizer）── 决定上限",
        "                │",
        "   训练 ────────┼─ 算力（GPU/显存/带宽/并行/精度）── 决定可行性",
        "                │",
        "                └─ 配方（架构/超参/对齐算法）────── 决定效率",
        "                         │",
        "   ┌─────────────────────┼─────────────────────┐",
        "   │                     │                     │",
        " 架构选择             注意力效率              稀疏化",
        "Dense / MoE     GQA→MLA→线性/SSM→混合    MoE+细粒度+共享专家",
        "   │                     │                     │",
        "   └─────────────────────┴─────────────────────┘",
        "                         │",
        "               ┌─────────┴─────────┐",
        "            文本 LLM            生成模型",
        "               │           VAE/GAN/Diffusion/DiT",
        "               └─────────┬─────────┘",
        "                         │",
        "                   多模态 / 全模态",
        "                         │",
        "                     世界模型",
        "               预测 s_{t+1} | s_t, a_t",
      ].join("\n"),
    });
    const three = [
      "数据决定上限，算力决定可行，配方决定效率。",
      "现代架构创新的一大半是内存带宽优化。",
      "能力可以靠 scale 涌现，但记忆和持续学习是架构问题 —— scale 治不了。",
    ];
    let cy = y + 0.02;
    three.forEach((t, i) => {
      s.addShape("roundRect", { x: 7.85, y: cy, w: 4.88, h: 1.12, rectRadius: 0.09, fill: { color: C.accentSoft }, line: { color: C.accentDim, width: 1 } });
      s.addText(String(i + 1), { x: 8.08, y: cy + 0.14, w: 0.4, h: 0.34, fontFace: F.sans, fontSize: 16, bold: true, color: C.accent, margin: 0, valign: "middle" });
      s.addText(t, { x: 8.08, y: cy + 0.46, w: 4.4, h: 0.56, fontFace: F.sans, fontSize: 13, bold: true, color: C.fg, margin: 0, valign: "top", lineSpacing: 18 });
      cy += 1.24;
    });
    band(s, {
      x: 7.85, y: cy + 0.06, w: 4.88, h: 0.5,
      text: "第 3 条，就是 Part B 的起点。", size: 13, align: "center",
    });
    s.addNotes("Part A 结束。Part B 从「scale 治不了什么」开始。");
  }
};
