const { C, F, newSlide, header, card, code, table, stat, bullets, band } = require("./lib");

module.exports = function (pptx) {
  const P = "PART A · 基础";

  // A0-1 时间线上半
  {
    const s = newSlide(pptx);
    const y = header(s, "A0 · 时间线", "AI 的七十年（上）：从一个神经元到 Transformer", P);
    table(s, {
      x: 0.6, y: y + 0.05, w: 12.13, colW: [1.05, 3.5, 7.58], size: 11, rowH: 0.315, boldFirst: true,
      head: ["年份", "事件", "为什么重要"],
      rows: [
        ["1943", "McCulloch & Pitts 神经元", "第一次把神经元写成数学：加权求和 + 阈值"],
        ["1957", "Rosenblatt 感知机", "第一个能「学」的模型（权重可更新）"],
        ["1969", "Minsky《Perceptrons》", { t: "指出单层做不了 XOR → 第一次 AI 寒冬", c: C.warn }],
        ["1986", "Rumelhart / Hinton 反向传播", "多层网络可训练，XOR 问题解决"],
        ["1989–98", "LeCun CNN / LeNet-5", "卷积 = 把平移不变性写进结构（归纳偏置）"],
        ["1997", "LSTM", "门控解决梯度消失，序列建模主力 20 年"],
        ["2006", "深度置信网络", "「Deep Learning」正名，第二次寒冬结束"],
        ["2012", { t: "AlexNet 夺冠 ImageNet", b: true, c: C.accent }, "GPU + 大数据 + ReLU + Dropout；深度学习引爆"],
        ["2013", "word2vec", "词 → 稠密向量，「语义可计算」的开端"],
        ["2014", "GAN / seq2seq / Adam", "生成模型的对抗范式；编码-解码框架"],
        ["2015", "ResNet / BatchNorm / Attention", "残差让「深」成为可能；注意力让「对齐」可学"],
        ["2017", { t: "Attention Is All You Need", b: true, c: C.accent }, "Transformer：丢掉循环和卷积，全用注意力 → 可并行"],
      ],
    });
    s.addNotes("三次寒冬与三次跃迁。每一次跃迁的共同结构：减少人工先验，增加数据与算力。");
  }

  // A0-2 时间线下半
  {
    const s = newSlide(pptx);
    const y = header(s, "A0 · 时间线", "AI 的七十年（下）：从 BERT 到世界模型", P);
    table(s, {
      x: 0.6, y: y + 0.05, w: 12.13, colW: [1.05, 3.9, 7.18], size: 11, rowH: 0.36, boldFirst: true,
      head: ["年份", "事件", "为什么重要"],
      rows: [
        ["2018", "BERT / GPT-1 / ELMo", "「预训练 + 微调」范式确立"],
        ["2020", { t: "GPT-3(175B) / Scaling Laws / ViT", b: true, c: C.accent }, "涌现的 in-context learning；「规模就是能力」的信仰成型"],
        ["2021", "CLIP / Codex / Switch Transformer", "图文对齐；代码；MoE 万亿参数"],
        ["2022", { t: "ChatGPT / InstructGPT / Chinchilla", b: true, c: C.accent }, "对齐让能力可用；Chinchilla 修正「参数优先」；扩散取代 GAN"],
        ["2023", "LLaMA 开源 / GPT-4 / Mixtral", "开源生态爆发；多模态；稀疏 MoE 落地"],
        ["2024", "DeepSeek-V3 / Sora / o1", "MLA + 无辅助损失 MoE + FP8；视频生成；test-time compute"],
        ["2025", { t: "DeepSeek-R1 / Genie 3 / VLA 元年", b: true, c: C.accent }, "纯 RL 涌现长链推理并可蒸馏；实时交互世界模型；机器人基础模型"],
        ["2026", "混合架构 / 持续学习 / 长程 Agent", "Mamba·DeltaNet 混合成主流；Nested Learning；Agent 任务时长 ~14.5h"],
      ],
    });
    band(s, {
      x: 0.6, y: y + 3.05, w: 12.13, h: 0.92,
      text: "Bitter Lesson：长期看，靠「搜索与学习」（可随算力扩展）的方法总是赢过靠「人类知识」的方法。\n整条时间线就是这句话的注脚。",
      size: 14, lineSpacing: 22,
    });
    s.addNotes("Sutton 的苦涩教训。CNN 减掉手工特征，Transformer 减掉循环先验，大模型减掉任务特定架构。");
  }

  // A0-3 三次范式跃迁
  {
    const s = newSlide(pptx);
    const y = header(s, "A0 · 主线", "三次范式跃迁的共同结构", P);
    const items = [
      { t: "CNN", sub: "减掉了「手工特征」", was: "人工设计 SIFT / HOG 特征", now: "让网络自己从像素里学特征" },
      { t: "Transformer", sub: "减掉了「循环结构」这个先验", was: "RNN 的时序归纳偏置", now: "全用注意力，位置靠编码补回来" },
      { t: "大模型", sub: "减掉了「任务特定架构」", was: "每个任务一个模型一套结构", now: "一个模型干所有事，靠提示区分" },
    ];
    let cy = y + 0.15;
    items.forEach((it) => {
      s.addShape("roundRect", { x: 0.6, y: cy, w: 12.13, h: 1.3, rectRadius: 0.09, fill: { color: C.card }, line: { color: C.border, width: 1 } });
      s.addText(it.t, { x: 0.88, y: cy + 0.2, w: 3.0, h: 0.42, fontFace: F.sans, fontSize: 20, bold: true, color: C.accent, margin: 0, valign: "middle" });
      s.addText(it.sub, { x: 0.88, y: cy + 0.66, w: 3.4, h: 0.44, fontFace: F.sans, fontSize: 12, color: C.dim, margin: 0, valign: "top", lineSpacing: 16 });
      s.addText("之前", { x: 4.5, y: cy + 0.2, w: 1.0, h: 0.24, fontFace: F.sans, fontSize: 9.5, color: C.faint, charSpacing: 1.2, margin: 0 });
      s.addText(it.was, { x: 4.5, y: cy + 0.48, w: 3.6, h: 0.62, fontFace: F.sans, fontSize: 12.5, color: C.dim, margin: 0, valign: "top", lineSpacing: 17 });
      s.addText("之后", { x: 8.5, y: cy + 0.2, w: 1.0, h: 0.24, fontFace: F.sans, fontSize: 9.5, color: C.accent, charSpacing: 1.2, margin: 0 });
      s.addText(it.now, { x: 8.5, y: cy + 0.48, w: 4.0, h: 0.62, fontFace: F.sans, fontSize: 12.5, color: C.fg, margin: 0, valign: "top", lineSpacing: 17 });
      cy += 1.48;
    });
    band(s, { x: 0.6, y: cy + 0.12, w: 12.13, h: 0.62, text: "共同动作：减少人工先验，增加数据与算力。", size: 15, align: "center" });
    s.addNotes("这是理解整条历史线最有用的一把钥匙。");
  }

  // A1-1 神经元 + 激活
  {
    const s = newSlide(pptx);
    const y = header(s, "A1 · 神经网络", "最小单元：一个神经元只做两件事", P);
    code(s, {
      x: 0.6, y: y + 0.1, w: 5.9, h: 1.02, size: 13, lineSpacing: 22,
      text: "z = w·x + b      # 线性：加权求和\na = σ(z)         # 非线性：激活函数",
      color: C.accent,
    });
    card(s, {
      x: 6.83, y: y + 0.1, w: 5.9, h: 1.02, title: "为什么必须有非线性",
      body: ["若干线性层叠加仍是线性变换（W₂W₁x），叠一百层等于一层。非线性是「深度」有意义的前提。"],
      titleSize: 13, bodySize: 11.5,
    });
    table(s, {
      x: 0.6, y: y + 1.34, w: 12.13, colW: [2.0, 3.6, 6.53], size: 11, rowH: 0.36, boldFirst: true,
      head: ["激活函数", "形式", "特点"],
      rows: [
        ["Sigmoid", "1/(1+e⁻ᶻ)", "早期主力；两端饱和 → 梯度消失"],
        ["Tanh", "(eᶻ−e⁻ᶻ)/(eᶻ+e⁻ᶻ)", "零中心，但仍饱和"],
        [{ t: "ReLU", b: true, c: C.accent }, "max(0, z)", "AlexNet 关键之一；不饱和、稀疏、快；但会「死亡」"],
        ["GELU", "z·Φ(z)", "BERT / GPT 用；平滑版 ReLU"],
        [{ t: "SwiGLU", b: true, c: C.accent }, "Swish(W₁x) ⊙ (W₂x)", "现代 LLM 的 FFN 标配（Llama / Qwen / DeepSeek 全用）"],
      ],
    });
    band(s, {
      x: 0.6, y: y + 3.5, w: 12.13, h: 0.95,
      text: "SwiGLU 是「门控」思想：一路算内容，一路算开关，逐元素相乘。\n代价是 FFN 需要 3 个矩阵而非 2 个 —— 所以中间维度取 8/3·d 而非 4d 来保持参数量。",
      size: 13.5, lineSpacing: 21,
    });
    s.addNotes("激活函数的演进史就是一部「怎么让梯度活下去」的历史。");
  }

  // A1-2 训练四步 + 正则
  {
    const s = newSlide(pptx);
    const y = header(s, "A1 · 神经网络", "怎么学：损失 → 梯度 → 反向传播 → 更新", P);
    code(s, {
      x: 0.6, y: y + 0.1, w: 6.1, h: 1.62, size: 11.5, lineSpacing: 20,
      text: "① 前向：输入 → 层层计算 → 输出 ŷ\n② 损失：L = loss(ŷ, y)          # 交叉熵 / MSE\n③ 反向：链式法则逐层求 ∂L/∂w    # backprop\n④ 更新：w ← w − η·∂L/∂w        # 优化器",
    });
    card(s, {
      x: 7.03, y: y + 0.1, w: 5.7, h: 1.62, title: "三件事要记住", bullet: true, titleSize: 13, bodySize: 11.5,
      body: [
        "分类用交叉熵（等价最大似然）；LLM 预训练就是对下一个 token 的交叉熵",
        "反向传播不是算法，是自动微分在网络上的应用",
        "AdamW 每个参数存 2 个状态 → 显存大头",
      ],
    });
    const cols = [
      { t: "正则化：对抗过拟合", b: ["数据增强 / 更多数据（最有效）", "Dropout：训练时随机置零", "权重衰减 L2 · Early stopping", "归一化：BatchNorm(视觉) / RMSNorm(LLM)"] },
      { t: "三大稳训招式（大模型才需要）", b: ["QK-Norm：对 Q/K 归一化防 logits 爆炸", "Z-loss：惩罚 softmax 归一化项", "Pre-LN：归一化放进残差分支内部", "logit soft-capping：c·tanh(logits/c)"] },
    ];
    let x = 0.6;
    cols.forEach((c2) => {
      card(s, { x, y: y + 1.94, w: 5.96, h: 2.3, title: c2.t, body: c2.b, bullet: true, titleSize: 14, bodySize: 12 });
      x += 6.17;
    });
    band(s, {
      x: 0.6, y: y + 4.42, w: 12.13, h: 0.58,
      text: "RMSNorm 是现代标配：只除以均方根、不减均值、无 bias —— 比 LayerNorm 少一次统计量，等效更快。",
      size: 13, align: "center",
    });
    s.addNotes("模型大了以后 loss 会突然发散。QK-Norm / Z-loss 是开源社区总结出的稳定器。");
  }

  // A2 RNN / LSTM
  {
    const s = newSlide(pptx);
    const y = header(s, "A2 · 序列建模", "RNN → LSTM → 为什么被抛弃", P);
    code(s, {
      x: 0.6, y: y + 0.1, w: 5.9, h: 0.95, size: 12, lineSpacing: 20,
      text: "h_t = f(W_h·h_{t-1} + W_x·x_t)\ny_t = g(W_y·h_t)", color: C.accent,
    });
    card(s, {
      x: 6.83, y: y + 0.1, w: 5.9, h: 0.95, title: "h_t = 隐状态", titleSize: 13, bodySize: 11.5,
      body: ["理论上压缩了 t 之前的所有信息。这是很自然的建模 —— 也是今天又回来的思想（见 A6）。"],
    });
    const kill = [
      { t: "① 梯度消失 / 爆炸", b: "反向传播要穿过 T 步，梯度是 T 个雅可比矩阵连乘 → 指数级衰减或爆炸。结果：学不到长依赖。", fix: "LSTM 用门控 + 加法路径解决" },
      { t: "② 无法并行", b: "h_t 依赖 h_{t-1}，训练时时间维必须串行。GPU 是并行机器，串行 = 浪费算力。", fix: "无解 —— 这是它被 Transformer 取代的直接原因" },
    ];
    let x = 0.6;
    kill.forEach((k) => {
      s.addShape("roundRect", { x, y: y + 1.25, w: 5.96, h: 1.85, rectRadius: 0.09, fill: { color: C.card }, line: { color: C.border, width: 1 } });
      s.addText(k.t, { x: x + 0.26, y: y + 1.42, w: 5.44, h: 0.34, fontFace: F.sans, fontSize: 16, bold: true, color: C.bad, margin: 0, valign: "middle" });
      s.addText(k.b, { x: x + 0.26, y: y + 1.8, w: 5.44, h: 0.78, fontFace: F.sans, fontSize: 12, color: C.dim, margin: 0, valign: "top", lineSpacing: 17 });
      s.addText(k.fix, { x: x + 0.26, y: y + 2.66, w: 5.44, h: 0.32, fontFace: F.sans, fontSize: 11.5, bold: true, color: C.accent, margin: 0, valign: "middle" });
      x += 6.17;
    });
    card(s, {
      x: 0.6, y: y + 3.3, w: 5.96, h: 1.6, title: "LSTM：加一条几乎线性的细胞状态", titleSize: 14, bodySize: 12, bullet: true,
      body: ["遗忘门 f：从 c_{t-1} 丢掉什么", "输入门 i：写入多少新信息", "输出门 o：暴露多少给 h_t"],
    });
    code(s, {
      x: 6.77, y: y + 3.3, w: 5.96, h: 1.6, size: 11.5, lineSpacing: 19,
      text: "c_t = f_t ⊙ c_{t-1} + i_t ⊙ c̃_t\nh_t = o_t ⊙ tanh(c_t)\n\n关键：c_t 这条加法路径让梯度\n近乎无损地流过去。",
    });
    s.addNotes("LSTM 统治 2014-2017 的 NLP。问题①解决了，问题②无解。");
  }

  // A2-2 Seq2Seq → Attention
  {
    const s = newSlide(pptx);
    const y = header(s, "A2 · 注意力的诞生", "Seq2Seq 的瓶颈，与那次关键一跃", P);
    const flow = [
      { t: "Seq2Seq (2014)", b: "编码器 RNN 把源句压成一个固定向量，解码器 RNN 展开成目标句。", c: C.dim },
      { t: "瓶颈", b: "整句话压进一个向量，长句必然丢信息。", c: C.bad },
      { t: "Bahdanau Attention (2015)", b: "解码每一步，回头看编码器的所有隐状态，算一组权重加权求和。", c: C.accent },
    ];
    let cy = y + 0.15;
    flow.forEach((f) => {
      s.addShape("roundRect", { x: 0.6, y: cy, w: 12.13, h: 0.95, rectRadius: 0.09, fill: { color: C.card }, line: { color: f.c === C.accent ? C.accentDim : C.border, width: 1 } });
      s.addText(f.t, { x: 0.86, y: cy + 0.12, w: 4.0, h: 0.7, fontFace: F.sans, fontSize: 16, bold: true, color: f.c, margin: 0, valign: "middle" });
      s.addText(f.b, { x: 4.9, y: cy + 0.12, w: 7.6, h: 0.7, fontFace: F.sans, fontSize: 13, color: C.dim, margin: 0, valign: "middle", lineSpacing: 18 });
      cy += 1.12;
    });
    code(s, {
      x: 0.6, y: cy + 0.1, w: 12.13, h: 0.72, size: 12,
      text: "score(s_t, h_i) → softmax → α_i → context = Σ α_i·h_i", color: C.accent,
    });
    bullets(s, {
      x: 0.6, y: cy + 1.0, w: 12.13, h: 1.0, size: 13.5,
      items: [
        "这就是注意力的原型：动态的、可学的、内容相关的检索。解决了瓶颈，还附赠可解释性（对齐矩阵）",
        { t: "但底座还是 RNN，还是串行 —— 于是有了那个关键问题：既然注意力这么好用，能不能把 RNN 全扔掉？", b: true, c: C.accent },
      ],
    });
    s.addNotes("这一跃就是 2017 年那篇论文的动机。");
  }

  // A3 CNN 归纳偏置
  {
    const s = newSlide(pptx);
    const y = header(s, "A3 · 归纳偏置", "CNN 的核心是把先验知识写进结构", P);
    const three = [
      { t: "局部连接", b: "像素只和邻居相关" },
      { t: "权重共享", b: "同一个卷积核扫全图 → 平移不变性" },
      { t: "层次感受野", b: "边缘 → 纹理 → 部件 → 物体" },
    ];
    let x = 0.6;
    three.forEach((t) => {
      card(s, { x, y: y + 0.1, w: 3.9, h: 1.15, title: t.t, body: [t.b], titleSize: 16, bodySize: 12 });
      x += 4.15;
    });
    band(s, {
      x: 0.6, y: y + 1.45, w: 12.13, h: 0.85,
      text: "归纳偏置强 → 小数据也能学好，但天花板低。归纳偏置弱 → 需要大数据，但天花板更高。",
      size: 14.5, align: "center",
    });
    card(s, {
      x: 0.6, y: y + 2.5, w: 5.96, h: 1.72, title: "ViT (2020)：几乎没有视觉先验", titleSize: 15, bodySize: 12, bullet: true,
      body: ["把图切成 16×16 patch 当 token 丢进 Transformer", "小数据打不过 CNN，大数据上全面超越", "今天多模态的视觉侧几乎都是 ViT 系（CLIP-ViT / SigLIP）"],
    });
    card(s, {
      x: 6.77, y: y + 2.5, w: 5.96, h: 1.72, title: "ResNet 的残差连接 y = F(x) + x", titleSize: 15, bodySize: 12, bullet: true,
      body: ["让梯度有一条恒等高速公路", "是「深度可扩展」的前提", "Transformer 的每个子层都用了它"],
    });
    s.addNotes("ViT 是 Bitter Lesson 的又一次验证。");
  }
};
