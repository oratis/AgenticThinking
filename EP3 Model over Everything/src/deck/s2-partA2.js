const { C, F, newSlide, header, card, code, table, stat, bullets, band } = require("./lib");

module.exports = function (pptx) {
  const P = "PART A · 基础";

  // A4-1 Self-attention
  {
    const s = newSlide(pptx);
    const y = header(s, "A4 · Transformer", "Attention Is All You Need：注意力就够了", P);
    const qkv = [
      { k: "Q", n: "Query", d: "我想找什么", a: "检索词" },
      { k: "K", n: "Key", d: "我是什么", a: "索引" },
      { k: "V", n: "Value", d: "我能给什么", a: "内容" },
    ];
    let x = 0.6;
    qkv.forEach((q) => {
      s.addShape("roundRect", { x, y: y + 0.1, w: 3.9, h: 1.1, rectRadius: 0.09, fill: { color: C.card }, line: { color: C.border, width: 1 } });
      s.addShape("roundRect", { x: x + 0.24, y: y + 0.32, w: 0.66, h: 0.66, rectRadius: 0.33, fill: { color: C.accentSoft }, line: { color: C.accentDim, width: 1 } });
      s.addText(q.k, { x: x + 0.24, y: y + 0.32, w: 0.66, h: 0.66, align: "center", fontFace: F.sans, fontSize: 24, bold: true, color: C.accent, margin: 0, valign: "middle" });
      s.addText(q.n, { x: x + 1.04, y: y + 0.3, w: 2.6, h: 0.32, fontFace: F.sans, fontSize: 15, bold: true, color: C.fg, margin: 0, valign: "middle" });
      s.addText(q.d + "   ·   类比：" + q.a, { x: x + 1.04, y: y + 0.64, w: 2.7, h: 0.34, fontFace: F.sans, fontSize: 11.5, color: C.dim, margin: 0, valign: "middle" });
      x += 4.15;
    });
    code(s, {
      x: 0.6, y: y + 1.36, w: 12.13, h: 0.66, size: 15,
      text: "Attention(Q, K, V) = softmax( QKᵀ / √d_k ) · V", color: C.accent,
    });
    table(s, {
      x: 0.6, y: y + 2.18, w: 12.13, colW: [1.5, 3.4, 7.23], size: 11.5, rowH: 0.34, boldFirst: true,
      head: ["步骤", "做什么", "为什么"],
      rows: [
        ["①", "QKᵀ", "每个 token 的 query 和所有 token 的 key 点积 → n×n 相关性矩阵"],
        ["②", "/ √d_k", "d 大时点积方差大，softmax 会饱和进梯度死区；除以 √d 保持方差为 1"],
        ["③", "softmax", "归一化成权重分布"],
        ["④", "· V", "按权重把 value 加权求和"],
      ],
    });
    band(s, {
      x: 0.6, y: y + 3.86, w: 12.13, h: 0.98,
      text: "本质：一次可微分的、内容寻址的软检索。任意两位置路径长度 O(1)（RNN 是 O(n)），且时间维完全并行。\n代价：注意力矩阵是 n×n —— 计算与显存都是 O(n²)。这是长上下文的根本困难，A5/A6 全在处理它。",
      size: 13.5, lineSpacing: 21,
    });
    s.addNotes("QKV 是理解 Transformer 的钥匙。O(n²) 是它的原罪。");
  }

  // A4-2 多头 + 位置编码
  {
    const s = newSlide(pptx);
    const y = header(s, "A4 · Transformer", "多头注意力与位置编码", P);
    card(s, {
      x: 0.6, y: y + 0.1, w: 5.96, h: 1.28, title: "多头（MHA）：为什么要切成 h 份",
      titleSize: 15, bodySize: 12, bullet: true,
      body: ["一个 softmax 只能形成一种关注模式", "多头 = 多个子空间并行地看不同关系（语法/指代/位置/语义）", "像 CNN 的多个卷积核"],
    });
    card(s, {
      x: 6.77, y: y + 0.1, w: 5.96, h: 1.28, title: "为什么必须显式注入位置",
      titleSize: 15, bodySize: 12,
      body: ["注意力是置换不变的 —— 打乱 token 顺序结果一样。所以位置信息必须额外给。"],
    });
    table(s, {
      x: 0.6, y: y + 1.58, w: 12.13, colW: [2.9, 5.0, 4.23], size: 11, rowH: 0.34, boldFirst: true,
      head: ["方案", "做法", "用在哪"],
      rows: [
        ["正弦绝对位置", "不同频率的 sin/cos 加到 embedding", "原始 Transformer"],
        ["可学绝对位置", "一个位置 embedding 表", "BERT / GPT-2"],
        [{ t: "RoPE 旋转位置编码", b: true, c: C.accent }, "把 Q/K 按位置旋转一个角度", { t: "现代 LLM 全用", c: C.accent }],
        ["ALiBi", "按距离给注意力打线性惩罚", "BLOOM"],
        ["NoPE", "干脆不加，靠因果掩码隐式获得位置", "Llama 4 的部分层"],
      ],
    });
    band(s, {
      x: 0.6, y: y + 3.62, w: 5.96, h: 1.02,
      text: "RoPE 为什么赢：把位置编码成旋转，两向量点积只依赖旋转角之差 → 天然是相对位置编码。且作用在 Q/K 上，可外推、可插值。",
      size: 12, lineSpacing: 18, bold: false, color: C.fg,
    });
    card(s, {
      x: 6.77, y: y + 3.62, w: 5.96, h: 1.02, title: "长上下文扩展（RoPE 的后续工程）",
      titleSize: 13, bodySize: 11.5, bullet: true,
      body: ["PI 位置插值 · NTK-aware / YaRN（按频率分段）", "LongRoPE（搜索每维最优缩放）· iRoPE（部分层 NoPE，Llama 4 达 10M）"],
    });
    s.addNotes("Qwen 用 YaRN 把 32K 扩到 128K–1M。");
  }

  // A4-3 Block + 三形态
  {
    const s = newSlide(pptx);
    const y = header(s, "A4 · Transformer", "完整的 Block，与三种形态", P);
    code(s, {
      x: 0.6, y: y + 0.1, w: 5.96, h: 0.92, size: 12.5, lineSpacing: 21,
      text: "x = x + Attention(Norm(x))   # Pre-LN\nx = x + FFN(Norm(x))", color: C.accent,
    });
    card(s, {
      x: 6.77, y: y + 0.1, w: 5.96, h: 0.92, title: "参数量的 2/3 在 FFN 里", titleSize: 13, bodySize: 11.5,
      body: ["中间维度通常 4d（SwiGLU 时约 8/3·d×2）"],
    });
    card(s, {
      x: 0.6, y: y + 1.2, w: 12.13, h: 0.86, title: "一个有用的直觉", titleSize: 14, bodySize: 12.5,
      body: ["注意力负责在 token 之间搬运信息；FFN 负责在每个 token 内部做知识查找（有研究把 FFN 看作 key-value 记忆）。"],
    });
    table(s, {
      x: 0.6, y: y + 2.24, w: 12.13, colW: [2.6, 3.0, 3.3, 3.23], size: 11.5, rowH: 0.4, boldFirst: true,
      head: ["形态", "代表", "注意力掩码", "适合"],
      rows: [
        ["Encoder-only", "BERT", "双向", "理解 / 分类 / 检索"],
        [{ t: "Decoder-only", b: true, c: C.accent }, "GPT / Llama / 所有现代 LLM", "因果（只看左边）", "生成"],
        ["Encoder-Decoder", "原始 Transformer / T5", "双向 + 因果 + 交叉注意力", "翻译 / 摘要"],
      ],
    });
    band(s, {
      x: 0.6, y: y + 4.0, w: 12.13, h: 0.92,
      text: "为什么 Decoder-only 赢了：训练目标（预测下一个 token）与使用方式（生成）完全一致；\n无需成对数据；架构最简单，最好 scale。",
      size: 13.5, lineSpacing: 21,
    });
    s.addNotes("Pre-LN vs Post-LN：原论文是 Post-LN，训练需 warmup 且不稳；现代全改 Pre-LN。");
  }

  // A5-1 现代配方 + 注意力怎么省
  {
    const s = newSlide(pptx);
    const y = header(s, "A5 · 现代配方", "2023–2026 主流开源模型高度收敛", P);
    code(s, {
      x: 0.6, y: y + 0.1, w: 12.13, h: 0.72, size: 13,
      text: "Decoder-only + RMSNorm(Pre-LN) + RoPE + SwiGLU + GQA + 无 bias + 权重绑定(小模型)", color: C.accent,
    });
    s.addText("分歧点一：注意力怎么省 —— 推理瓶颈不是算力，是 KV Cache", {
      x: 0.6, y: y + 1.0, w: 12.13, h: 0.34, fontFace: F.sans, fontSize: 14.5, bold: true, color: C.fg, margin: 0, valign: "middle",
    });
    code(s, {
      x: 0.6, y: y + 1.42, w: 12.13, h: 0.5, size: 11.5,
      text: "KV Cache 显存 = 2 × L层 × n序列 × h头 × d_head × 精度        上下文一长就爆",
    });
    table(s, {
      x: 0.6, y: y + 2.08, w: 12.13, colW: [2.7, 5.3, 1.9, 2.23], size: 11, rowH: 0.335, boldFirst: true,
      head: ["方案", "做法", "KV 压缩", "代表"],
      rows: [
        ["MHA", "每头独立 K/V", "1×", "原始"],
        ["MQA", "所有头共享一组 K/V", "h×", "PaLM"],
        [{ t: "GQA", b: true, c: C.accent }, "分组共享（如 8 头共享 1 组）", "g×", "Llama 2+ / Qwen / 几乎全部"],
        [{ t: "MLA", b: true, c: C.accent }, "K/V 低秩压缩到潜向量，用时再升维", { t: "~10–20×", c: C.accent }, "DeepSeek V2 / V3"],
        ["SWA 滑动窗口", "每层只看最近 W 个 token，层数叠加感受野", "与 n 无关", "Mistral"],
        ["局部/全局交替", "5 层局部 + 1 层全局", "大幅", "Gemma 2 / 3"],
      ],
    });
    band(s, {
      x: 0.6, y: y + 4.5, w: 12.13, h: 0.66,
      text: "MLA 的巧妙之处：RoPE 与低秩分解不兼容，需拆出一路「解耦 RoPE 维度」单独处理。",
      size: 12.5,
    });
    s.addNotes("KV Cache 是推理侧的第一大显存开销。GQA 已是标配，MLA 是 DeepSeek 最漂亮的一手。");
  }

  // A5-2 九个模型
  {
    const s = newSlide(pptx);
    const y = header(s, "A5 · 开源模型全景", "九个模型，一句话画像（Model-Research 提炼）", P);
    table(s, {
      x: 0.6, y: y + 0.02, w: 12.13, colW: [1.9, 3.5, 6.73], size: 10.5, rowH: 0.42, boldFirst: true,
      head: ["模型", "一句话", "最值得学的点"],
      rows: [
        ["Llama · Meta", "开源生态的事实标准", "经典 decoder 范本；L4 转 MoE + iRoPE + 原生多模态"],
        ["Qwen · 阿里", "中文/多语最强开源族", "混合思考模式（可设 thinking budget）；36T tokens；strong-to-weak 蒸馏"],
        [{ t: "DeepSeek · 深度求索", b: true, c: C.accent }, "算法创新密度最高", { t: "MLA + DeepSeekMoE + 无辅助损失均衡 + MTP + FP8；R1 的 GRPO", c: C.accent }],
        ["Mistral", "高效注意力代表", "滑动窗口 + 环形 KV cache；Mixtral 把稀疏 MoE 带火；源码最干净"],
        ["Gemma · Google", "蒸馏即预训练", "局部/全局交替 5:1；logit soft-capping；256k 大词表"],
        ["Phi · Microsoft", "数据为王", "Textbooks Are All You Need：合成 + 重筛数据让小模型对标大模型"],
        ["GLM · 智谱", "deep & thin 面向 Agent", "层深宽窄的 MoE；MTP；自研异步 RL 框架 slime"],
        [{ t: "OLMo · AllenAI", b: true, c: C.accent }, "完全开放", "数据 + 代码 + 全部 checkpoint + 训练日志；想读真实预训练循环就读它"],
        ["MiniMax", "线性注意力工程化", "Lightning Attention 与 Softmax 混合 7:1，1M→4M；CISPO"],
      ],
    });
    band(s, {
      x: 0.6, y: y + 4.32, w: 12.13, h: 0.62,
      text: "推荐精读顺序：Llama（打底）→ OLMo（读完整训练循环）→ Mistral（读 MoE 源码）→ DeepSeek（集大成）",
      size: 13.5, align: "center",
    });
    s.addNotes("github.com/oratis/Model-Research 里有逐个模型的架构剖析 + 源码走读。");
  }

  // A6 线性注意力 / RWKV / Mamba
  {
    const s = newSlide(pptx);
    const y = header(s, "A6 · 循环的回归", "线性注意力、RWKV、Mamba 与混合架构", P);
    code(s, {
      x: 0.6, y: y + 0.08, w: 12.13, h: 1.0, size: 12, lineSpacing: 19,
      text: "去掉 softmax，用核函数 φ 近似 —— 靠矩阵乘法结合律换个算法:\n\n  (φ(Q)·φ(K)ᵀ)·V   →   φ(Q)·(φ(K)ᵀ·V)          O(n²d)  →  O(n d²)",
      color: C.accent,
    });
    card(s, {
      x: 0.6, y: y + 1.22, w: 12.13, h: 0.68, title: "", titleSize: 1, bodySize: 12.5,
      body: ["而 φ(K)ᵀV 是一个可以增量更新的状态矩阵 —— 这就是一个 RNN。代价：削弱了「精确检索某个具体 token」的召回能力。"],
    });
    const boxes = [
      { t: "RWKV", b: ["训练时像 Transformer 并行，推理时像 RNN O(1)", "time-mixing 替代注意力，channel-mixing 替代 FFN", "推理状态固定大小 → 显存不随上下文增长"] },
      { t: "Mamba / SSM", b: ["S4：HiPPO 初始化，最优压缩历史", "Mamba(S6)：选择性 —— B/C/Δ 依赖输入，能选择性记忆遗忘", "Mamba-2：SSD 框架统一 SSM 与注意力；Mamba-3 (ICLR'26) state 减半更强"] },
    ];
    let x = 0.6;
    boxes.forEach((b) => {
      card(s, { x, y: y + 2.02, w: 5.96, h: 1.66, title: b.t, body: b.b, bullet: true, titleSize: 16, bodySize: 11.5 });
      x += 6.17;
    });
    table(s, {
      x: 0.6, y: y + 3.82, w: 12.13, colW: [3.4, 8.73], size: 11, rowH: 0.31, boldFirst: true,
      head: ["混合架构（2026 主流答案）", "混合方式"],
      rows: [
        ["MiniMax-01", "Lightning Attention : Softmax = 7:1，1M 训练 / 4M 外推"],
        ["Jamba (AI21)", "Transformer + Mamba 层交替 + MoE"],
        ["Nemotron 3 (NVIDIA)", "注意力层与 Mamba-2 层交替"],
        ["Qwen3.6", "用 Gated DeltaNet 替代非注意力部分"],
      ],
    });
    s.addNotes("一句话：少量全局注意力层 + 大量线性/状态空间层 + MoE，正在成为长上下文模型的新标准配方。");
  }

  // A7-1 MoE
  {
    const s = newSlide(pptx);
    const y = header(s, "A7 · MoE 稀疏专家", "容量与算力解耦", P);
    card(s, {
      x: 0.6, y: y + 0.1, w: 5.96, h: 1.15, title: "动机", titleSize: 15, bodySize: 12.5,
      body: ["Scaling law 说参数越多越好，但参数越多推理越贵。能不能只让一部分参数参与计算？"],
    });
    code(s, {
      x: 6.77, y: y + 0.1, w: 5.96, h: 1.15, size: 12, lineSpacing: 19,
      text: "把 FFN 换成 N 个专家 + 路由器\n每个 token 只激活 top-k 个专家\n\n671B-A37B = 总参 671B / 激活 37B", color: C.accent,
    });
    band(s, {
      x: 0.6, y: y + 1.42, w: 12.13, h: 0.6,
      text: "算力按激活参数算，容量按总参数算 —— 这就是 MoE 的全部魅力。", size: 14.5, align: "center",
    });
    table(s, {
      x: 0.6, y: y + 2.18, w: 12.13, colW: [2.4, 4.6, 5.13], size: 10.8, rowH: 0.44, boldFirst: true,
      head: ["工程问题", "说明", "解法"],
      rows: [
        ["负载不均", "路由器倾向于把 token 都送给几个明星专家，其他专家饿死", "辅助损失；容量因子 + token dropping"],
        ["辅助损失伤性能", "平衡损失与语言建模损失冲突，会掉点", { t: "DeepSeek：无辅助损失均衡 —— 可调 bias 只影响路由不影响梯度", c: C.accent }],
        ["专家粒度", "专家太大 → 组合数少，专业化不足", "细粒度专家：切成更多更小的（DeepSeek 256 个，top-8）"],
        ["通用知识重复", "每个专家都要学一遍常识，浪费", "共享专家：1–2 个永远激活，负责通用能力"],
        ["通信开销", "专家分布在不同 GPU 上，需要 all-to-all", "专家并行 EP；限制每 token 最多跨 4 个节点"],
      ],
    });
    s.addNotes("MoE 的工程复杂度远高于 dense，但性价比是碾压性的。");
  }

  // A7-2 DeepSeek
  {
    const s = newSlide(pptx);
    const y = header(s, "A7 · DeepSeek", "V3 把所有创新叠在一起，R1 换掉了训练范式", P);
    s.addText("DeepSeek-V3 · 671B-A37B · 六项创新", {
      x: 0.6, y: y, w: 6.0, h: 0.32, fontFace: F.sans, fontSize: 14, bold: true, color: C.accent, margin: 0, valign: "middle",
    });
    const v3 = [
      ["1. MLA", "KV cache 低秩压缩，省 10–20×"],
      ["2. DeepSeekMoE", "细粒度专家（256 routed + 1 shared，top-8）"],
      ["3. 无辅助损失均衡", "用可调 bias 而不是额外 loss"],
      ["4. MTP", "训练时预测多个未来 token；天然支持投机解码"],
      ["5. FP8 混合精度", "主要 GEMM 用 FP8 → 训练成本降 30–50%"],
      ["6. DualPipe", "计算与通信重叠的流水线调度"],
    ];
    let cy = y + 0.4;
    v3.forEach(([a, b]) => {
      s.addShape("roundRect", { x: 0.6, y: cy, w: 6.0, h: 0.55, rectRadius: 0.07, fill: { color: C.card }, line: { color: C.border, width: 1 } });
      s.addText(a, { x: 0.82, y: cy, w: 2.0, h: 0.55, fontFace: F.sans, fontSize: 12, bold: true, color: C.fg, margin: 0, valign: "middle" });
      s.addText(b, { x: 2.82, y: cy, w: 3.6, h: 0.55, fontFace: F.sans, fontSize: 10.5, color: C.dim, margin: 0, valign: "middle", lineSpacing: 14 });
      cy += 0.63;
    });
    s.addText("DeepSeek-R1 · 推理能力可以纯靠 RL 涌现", {
      x: 6.85, y: y, w: 5.9, h: 0.32, fontFace: F.sans, fontSize: 14, bold: true, color: C.accent, margin: 0, valign: "middle",
    });
    card(s, {
      x: 6.85, y: y + 0.4, w: 5.88, h: 1.28, title: "R1-Zero", titleSize: 14, bodySize: 11.5,
      body: ["直接在 base 上做 RL（不做任何 SFT），奖励只有「答案对不对 + 格式对不对」（RLVR）。模型自发学会更长思维链、自我检查、回溯 —— aha moment。"],
    });
    card(s, {
      x: 6.85, y: y + 1.82, w: 5.88, h: 1.0, title: "GRPO", titleSize: 14, bodySize: 11.5,
      body: ["PPO 的简化 —— 不要 critic 网络，用一组采样输出的组内相对优势当基线。省一半显存，是 R1 能跑起来的工程前提。"],
    });
    card(s, {
      x: 6.85, y: y + 2.96, w: 5.88, h: 0.82, title: "蒸馏", titleSize: 14, bodySize: 11.5,
      body: ["把 R1 输出蒸馏到 1.5B–70B dense 模型，小模型也能推理。"],
    });
    band(s, {
      x: 0.6, y: y + 4.5, w: 12.13, h: 0.62,
      text: "意义：推理能力不需要人类演示，只需要一个可验证的奖励信号 —— 把数据瓶颈部分转化成了算力瓶颈。",
      size: 13.5, align: "center",
    });
    s.addNotes("V3 官方口径训练成本约 278.8 万 H800 GPU 时，比同级别低一个数量级。");
  }
};
