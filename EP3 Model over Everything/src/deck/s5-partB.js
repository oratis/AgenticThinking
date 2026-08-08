const { C, F, newSlide, header, card, code, table, stat, bullets, band, divider } = require("./lib");

module.exports = function (pptx) {
  const P = "PART B · 前沿";

  divider(pptx, {
    num: "B", part: P, kicker: "PART B · FRONTIERS",
    title: "三大未来目标",
    sub: "三条主线看起来分散，底层是同一个缺口：今天的模型是一个静态的、无记忆的、不接触物理世界的函数。",
    items: ["B1 完全自主的 Agent —— 时间跨度", "B2 持续学习的 AI —— 知识更新", "B3 理解物理的机器人 —— 因果接地"],
  });

  // B 总览
  {
    const s = newSlide(pptx);
    const y = header(s, "Part B · 总览", "三条主线，三个缺口，与 2026 的位置", P);
    table(s, {
      x: 0.6, y: y + 0.1, w: 12.13, colW: [2.9, 3.2, 2.4, 3.63], size: 11.5, rowH: 0.62, boldFirst: true,
      head: ["主线", "一句话目标", "核心缺口", "2026 状态"],
      rows: [
        [{ t: "B1 完全自主的 Agent", b: true, c: C.accent }, "交给它一个目标，它自己做完", "长程可靠性", "50% 成功率的任务时长 ~14.5 小时，每 ~4.3 个月翻倍"],
        [{ t: "B2 持续学习的 AI", b: true, c: C.accent }, "用着用着就变强，且不忘旧的", "推理期不能写入永久知识", "Nested Learning / TTT 最有希望，但「该学什么」没有判据"],
        [{ t: "B3 理解物理的机器人", b: true, c: C.accent }, "在真实世界里可靠地做事", "数据 + 物理因果", "VLA 已能泛化，但数据比语言少 5–6 个数量级"],
      ],
    });
    band(s, {
      x: 0.6, y: y + 2.5, w: 12.13, h: 1.1,
      text: "它们在攻同一个函数的三个面：\n时间跨度（自主） · 知识更新（学习） · 因果接地（物理）",
      size: 16, lineSpacing: 26, align: "center",
    });
    card(s, {
      x: 0.6, y: y + 3.76, w: 12.13, h: 1.06, title: "本节的结论先行", titleSize: 14, bodySize: 13,
      body: ["三条线其实在等同一个东西：一个能在内部模拟世界的演化、并把模拟与现实的偏差永久写回自己的系统。也就是「预测 → 行动 → 惊讶 → 更新」这个回路。"],
    });
    s.addNotes("这一页是 Part B 的骨架，最后一页会回到它。");
  }

  // B1-1 什么叫自主
  {
    const s = newSlide(pptx);
    const y = header(s, "B1 · 完全自主的 Agent", "不是「能调工具」，而是无人监督下跨越很长时间完成目标", P);
    code(s, {
      x: 0.6, y: y + 0.08, w: 12.13, h: 0.6, size: 14,
      text: "自主性 = 时间跨度 × 环境开放度 × 目标抽象度 × 可靠性", color: C.accent,
    });
    table(s, {
      x: 0.6, y: y + 0.86, w: 12.13, colW: [2.6, 5.2, 4.33], size: 11.5, rowH: 0.44, boldFirst: true,
      head: ["维度", "今天在哪", "目标"],
      rows: [
        ["时间跨度", "数小时（软件任务）", "数天到数周"],
        ["环境开放度", "沙箱 / 有 API 的系统", "任意 GUI、任意真实系统"],
        ["目标抽象度", "「修好这个 bug」", "「把这个业务的转化率提升 10%」"],
        [{ t: "可靠性", b: true, c: C.warn }, "50% 成功率的时长才是 14.5 小时", "80% 成功率下大幅缩短 —— 生产要的是后者"],
      ],
    });
    s.addText("METR 时间跨度：最重要的一条曲线", {
      x: 0.6, y: y + 2.86, w: 12.13, h: 0.34, fontFace: F.sans, fontSize: 15, bold: true, color: C.fg, margin: 0, valign: "middle",
    });
    stat(s, { x: 0.6, y: y + 3.3, w: 3.6, value: "~7 个月", label: "2019–2023 的翻倍周期", size: 30, color: C.dim });
    stat(s, { x: 4.5, y: y + 3.3, w: 3.6, value: "4.3 个月", label: "2023 之后加速到（130.8 天）", size: 30 });
    stat(s, { x: 8.6, y: y + 3.3, w: 4.1, value: "14h30m", label: "2026-02 前沿模型的 50%-时间跨度\n≈ 熟练工程师大半个工作日的软件任务", size: 30 });
    band(s, {
      x: 0.6, y: y + 4.68, w: 12.13, h: 0.46,
      text: "若外推成立：「能自主管理一整个工作周」的 Agent 距今不到一年。", size: 13, align: "center",
    });
    s.addNotes("三个注脚：50% 门槛很低；主要测有明确验证信号的软件任务；但趋势本身足够震撼。");
  }

  // B1-2 Agent 系统 + Context Engineering
  {
    const s = newSlide(pptx);
    const y = header(s, "B1 · Agent 系统", "Context Engineering —— 2025–2026 最重要的实践学科", P);
    code(s, {
      x: 0.6, y: y + 0.05, w: 5.5, h: 2.2, size: 10, lineSpacing: 14.5,
      text: [
        "┌─────────────────────────────────┐",
        "│            Harness              │",
        "│ ┌──────┐ ┌───────┐ ┌─────────┐  │",
        "│ │Model │↔│Context│↔│  Tools  │  │",
        "│ └──────┘ └───────┘ └─────────┘  │",
        "│     ↑        ↑          ↑       │",
        "│     └─ Loop（计划/执行/观察）─┘  │",
        "│                                 │",
        "│ Memory · Permissions · Verify   │",
        "└─────────────────────────────────┘",
      ].join("\n"),
    });
    card(s, {
      x: 6.3, y: y + 0.05, w: 6.43, h: 1.34, title: "核心问题", titleSize: 13.5, bodySize: 11.5, bullet: true,
      body: ["上下文腐蚀：窗口越长，中间内容利用率越低（lost in the middle）", "注意力预算：塞入 100 个工具定义，选错工具的概率大增"],
    });
    table(s, {
      x: 6.3, y: y + 1.5, w: 6.43, colW: [1.9, 4.53], size: 10.5, rowH: 0.25, boldFirst: true,
      head: ["手段", "做什么"],
      rows: [
        ["压缩 Compaction", "把历史摘要成结构化笔记，保留决策与未完成项"],
        ["外部化", "中间产物写文件，上下文里只留路径"],
        ["子 Agent 隔离", "脏活在独立上下文里做，只回传结论"],
        ["即时加载", "不预加载，让 Agent 需要时自己去取"],
        ["工具最小化", "工具越少越准；命名空间 + 渐进式披露"],
      ],
    });
    band(s, {
      x: 0.6, y: y + 2.45, w: 5.5, h: 0.86,
      text: "反直觉结论：Agent 的性能提升，很多时候不来自换更强的模型，而来自从上下文里删东西。",
      size: 12.5, lineSpacing: 18,
    });
    table(s, {
      x: 0.6, y: y + 3.46, w: 5.96, colW: [1.6, 2.2, 2.16], size: 10.5, rowH: 0.28, boldFirst: true,
      head: ["记忆层", "载体", "生命周期"],
      rows: [
        ["工作记忆", "上下文窗口", "单次对话"],
        ["情景记忆", "对话日志 / 事件流", "可检索的历史"],
        ["语义记忆", "向量库 / 结构化笔记", "长期事实"],
        ["程序记忆", "Skills / 工作流", "长期技能"],
      ],
    });
    card(s, {
      x: 6.77, y: y + 3.46, w: 5.96, h: 1.5, title: "多智能体：买的是「独立上下文」和「独立视角」", titleSize: 13, bodySize: 11,
      body: ["有用：可并行搜索、对抗性验证、角色/权限隔离。", "是负担：串行依赖、需共享大量上下文、简单任务（多花 5–15× token）。", "不需要那两样时，单 Agent + 好工具更快更便宜。"],
    });
    s.addNotes("关键区分：RAG 不是学习。关掉检索，模型什么也没学会 —— 这直接引出 B2。");
  }

  // B1-3 可靠性
  {
    const s = newSlide(pptx);
    const y = header(s, "B1 · 最难的问题", "长程任务的成功率是每步成功率的连乘", P);
    code(s, {
      x: 0.6, y: y + 0.08, w: 5.96, h: 1.4, size: 13, lineSpacing: 24,
      text: "P(成功) = p^n\n\np=0.99, n=100  →  36.6%\np=0.99, n=500  →   0.7%", color: C.warn,
    });
    band(s, {
      x: 6.77, y: y + 0.08, w: 5.96, h: 1.4,
      text: "长程自主的本质挑战不是「更聪明」，而是把 p 逼近 1，或者引入纠错机制让错误不累积。",
      size: 14, lineSpacing: 21,
    });
    const paths = [
      { n: "1", t: "可验证的子目标", b: "让每一步都有 checkpoint（测试通过、编译成功、断言成立）。这是为什么编程是 Agent 最先攻克的领域 —— 它自带验证器。" },
      { n: "2", t: "自我纠错循环", b: "执行 → 观察 → 发现失败 → 回退重试。要求模型有「知道自己错了」的能力。" },
      { n: "3", t: "人在环上", b: "不是每步都批，而是在不可逆动作前停下来确认。" },
    ];
    let cy = y + 1.72;
    paths.forEach((p) => {
      s.addShape("roundRect", { x: 0.6, y: cy, w: 12.13, h: 0.86, rectRadius: 0.08, fill: { color: C.card }, line: { color: C.border, width: 1 } });
      s.addText(p.n, { x: 0.85, y: cy, w: 0.4, h: 0.86, fontFace: F.sans, fontSize: 18, bold: true, color: C.accent, margin: 0, valign: "middle" });
      s.addText(p.t, { x: 1.3, y: cy, w: 2.7, h: 0.86, fontFace: F.sans, fontSize: 14.5, bold: true, color: C.fg, margin: 0, valign: "middle" });
      s.addText(p.b, { x: 4.1, y: cy + 0.1, w: 8.4, h: 0.66, fontFace: F.sans, fontSize: 12, color: C.dim, margin: 0, valign: "middle", lineSpacing: 17 });
      cy += 1.0;
    });
    band(s, {
      x: 0.6, y: cy + 0.06, w: 5.96, h: 0.62,
      text: "不可逆性是划分权限的正确维度，不是「重要性」。", size: 12.5,
    });
    card(s, {
      x: 6.77, y: cy + 0.06, w: 5.96, h: 0.62, title: "", titleSize: 1, bodySize: 11.5,
      body: ["读文件 100 次没关系，rm -rf 一次就完了。"],
    });
    s.addNotes("未解问题：长程一致性、自知之明、跨会话经验累积（=B2）、开放环境评测、经济性。");
  }

  // B2-1 问题陈述
  {
    const s = newSlide(pptx);
    const y = header(s, "B2 · 持续学习的 AI", "最硬的一堵墙", P);
    band(s, {
      x: 0.6, y: y + 0.1, w: 12.13, h: 0.92,
      text: "大语言模型的概念只能在训练时建立，不能在引用（推理 / 交互）时建立。",
      size: 19, align: "center",
    });
    card(s, {
      x: 0.6, y: y + 1.2, w: 5.96, h: 1.3, title: "今天所有 LLM 的结构性事实", titleSize: 14, bodySize: 12, bullet: true,
      body: ["预训练结束 → 权重冻结 → 之后无论对话多少次，模型本身一个字都没学到", "你以为的「它记住了」：要么在上下文里（关掉就没），要么在外部数据库里（模型没变）"],
    });
    card(s, {
      x: 6.77, y: y + 1.2, w: 5.96, h: 1.3, title: "人类不是这样的", titleSize: 14, bodySize: 12,
      body: ["一次对话就可能永久改变你的知识结构。这个差距是通向 AGI 最硬的一堵墙之一。"],
      fill: C.accentSoft, line: C.accentDim,
    });
    s.addText("三重困难", { x: 0.6, y: y + 2.68, w: 12.13, h: 0.32, fontFace: F.sans, fontSize: 15, bold: true, color: C.fg, margin: 0, valign: "middle" });
    const hard = [
      { t: "① 灾难性遗忘", b: "在新数据上梯度更新会覆盖旧知识对应的权重。神经网络的知识是分布式存储的，没有「只改这一条」的手术刀。", fix: "EWC · 回放 · 参数隔离(LoRA/DEN) · 生成式回放" },
      { t: "② 稳定性-可塑性困境", b: "太稳定 → 学不进新东西；太可塑 → 忘掉旧东西。", fix: "这不是工程 bug，是根本性的权衡" },
      { t: "③ 没有「该不该学」的判据", b: "即使能推理期写入权重 —— 模型凭什么判断这条信息是对的、值得永久记住？", fix: "最被低估的问题（下一页）" },
    ];
    let x = 0.6;
    hard.forEach((h) => {
      s.addShape("roundRect", { x, y: y + 3.08, w: 3.9, h: 1.8, rectRadius: 0.09, fill: { color: C.card }, line: { color: h.t.startsWith("③") ? C.bad : C.border, width: 1 } });
      s.addText(h.t, { x: x + 0.24, y: y + 3.24, w: 3.42, h: 0.34, fontFace: F.sans, fontSize: 14, bold: true, color: h.t.startsWith("③") ? C.bad : C.fg, margin: 0, valign: "middle" });
      s.addText(h.b, { x: x + 0.24, y: y + 3.64, w: 3.42, h: 0.82, fontFace: F.sans, fontSize: 11, color: C.dim, margin: 0, valign: "top", lineSpacing: 15 });
      s.addText(h.fix, { x: x + 0.24, y: y + 4.48, w: 3.42, h: 0.32, fontFace: F.sans, fontSize: 10.5, bold: true, color: C.accent, margin: 0, valign: "middle" });
      x += 4.15;
    });
    s.addNotes("第三点来自 LISA 的 Learning in Referencing 研究，四轮对抗性文献调研的结果。");
  }

  // B2-2 三条结论
  {
    const s = newSlide(pptx);
    const y = header(s, "B2 · LISA 研究", "Learning in Referencing 的三条结论", P);
    const concl = [
      {
        n: "验证侧", t: "没有任何「无答案库的正确性接受/拒绝准则」",
        b: ["语义熵只测自洽 —— 自洽 ≠ 正确，模型可以一致地错", "期望信息增益 EIG 能选「该问什么」，但回答仍需 oracle", "朴素自我反思已被证伪 —— 模型会因被质疑而改掉正确答案"],
        hi: "压缩 / MDL 是地基已备但无人占用的路线：一条知识如果能让模型更好地压缩后续观察，它更可能是真的。",
      },
      {
        n: "架构侧", t: "「推理期写入」与「跨会话持久」在任何已验证架构中都不同时成立",
        b: ["能推理期写入的（TTT、快权重、Hopfield 记忆）→ 会话结束就没了", "能跨会话持久的（微调、RAG）→ 不是推理期发生的，需要离线批处理"],
        hi: "这两个属性的交集是空的 —— 这是个架构缺口，不是调参问题。",
      },
      {
        n: "门控侧", t: "门控本身有人做，但「用什么信号」是空白",
        b: ["DEN / SEMA / SAGE / Self-Sizing Hopfield / CN-DPM 都做了离散硬写入门", "现有信号：随机、类别平衡、损失/似然、参数漂移、容量/稀疏、表征新颖性、梯度干扰、代表性、不确定性、来源信誉"],
        hi: "「无标准答案下的概念级正确性」这一列仍然是空的。",
      },
    ];
    let cy = y + 0.02;
    concl.forEach((c2) => {
      s.addShape("roundRect", { x: 0.6, y: cy, w: 12.13, h: 1.55, rectRadius: 0.09, fill: { color: C.card }, line: { color: C.border, width: 1 } });
      s.addShape("roundRect", { x: 0.82, y: cy + 0.16, w: 1.1, h: 0.32, rectRadius: 0.16, fill: { color: C.accentSoft }, line: { color: C.accentDim, width: 1 } });
      s.addText(c2.n, { x: 0.82, y: cy + 0.16, w: 1.1, h: 0.32, align: "center", fontFace: F.sans, fontSize: 11, bold: true, color: C.accent, margin: 0, valign: "middle" });
      s.addText(c2.t, { x: 2.06, y: cy + 0.14, w: 10.4, h: 0.36, fontFace: F.sans, fontSize: 14.5, bold: true, color: C.fg, margin: 0, valign: "middle" });
      bullets(s, { x: 0.86, y: cy + 0.56, w: 7.6, h: 0.9, items: c2.b, size: 10.5, lineSpacing: 14, gap: 2 });
      s.addText(c2.hi, { x: 8.7, y: cy + 0.56, w: 3.8, h: 0.88, fontFace: F.sans, fontSize: 10.5, bold: true, color: C.accent, margin: 0, valign: "top", lineSpacing: 14 });
      cy += 1.7;
    });
    band(s, {
      x: 0.6, y: cy + 0.04, w: 12.13, h: 0.55,
      text: "一句话：我们知道怎么写，不知道该写什么。", size: 16, align: "center",
    });
    s.addNotes("第四轮对抗补全：12 目标 finder+verifier 一致，0 反例。目标会议 COLM / ICLR 2027。");
  }

  // B2-3 Nested Learning + 路线盘点
  {
    const s = newSlide(pptx);
    const y = header(s, "B2 · 2026 最新进展", "Nested Learning 与 Hope 架构", P);
    card(s, {
      x: 0.6, y: y + 0.05, w: 5.96, h: 1.5, title: "核心重构（Google Research）", titleSize: 14, bodySize: 11.5,
      body: ["把一个模型看作多层嵌套的优化问题，每一层有自己的上下文流和更新频率。", "传统视角：架构和优化器是两回事。Nested Learning 视角：它们是同一件事的不同频率层级 —— 反向传播本身就可以看作一层内循环的联想记忆。"],
      fill: C.accentSoft, line: C.accentDim,
    });
    card(s, {
      x: 6.77, y: y + 0.05, w: 5.96, h: 1.5, title: "Hope 架构的两个部件", titleSize: 14, bodySize: 11.5, bullet: true,
      body: ["连续记忆系统 CMS：不是短期/长期二分，而是多时间尺度的记忆连续谱，不同模块以不同频率更新", "自修改更新规则：依据是「压缩引起的惊讶度 surprise」"],
    });
    band(s, {
      x: 0.6, y: y + 1.72, w: 12.13, h: 0.92,
      text: "结果：类增量任务（CLINC / Banking / DBpedia）上超过纯 ICL、EWC 与外部学习方法；长上下文记忆管理优于 SOTA。\n值得注意：「惊讶度驱动写入」正好触及门控问题 —— 它给出了一个门控信号。是不是正确性的良好代理仍待验证，但方向对了。",
      size: 12.5, lineSpacing: 19,
    });
    table(s, {
      x: 0.6, y: y + 2.8, w: 12.13, colW: [2.9, 3.4, 1.6, 1.6, 2.63], size: 10.5, rowH: 0.3, boldFirst: true,
      head: ["路线", "机制", "推理期写入", "跨会话持久", "备注"],
      rows: [
        ["上下文学习 ICL", "全在 prompt 里", { t: "✓", c: C.accent }, { t: "✗", c: C.bad }, "不是学习，是临时告知"],
        ["RAG", "外部检索", { t: "✓外部", c: C.accent }, { t: "✓外部", c: C.accent }, "模型本身没变"],
        ["微调 / LoRA", "离线梯度更新", { t: "✗", c: C.bad }, { t: "✓", c: C.accent }, "需批量、需人决定学什么"],
        ["TTT", "推理时对当前输入做梯度步", { t: "✓", c: C.accent }, { t: "✗", c: C.bad }, "会话结束即失"],
        ["快权重 / Hopfield", "可写的联想记忆矩阵", { t: "✓", c: C.accent }, { t: "✗", c: C.bad }, "容量有限"],
        [{ t: "Agent 记忆", b: true }, "Agent 自己写笔记", { t: "✓", c: C.accent }, { t: "✓", c: C.accent }, "今天最实用，但是外置大脑"],
        [{ t: "Nested Learning / Hope", b: true, c: C.accent }, "多时间尺度 + 自修改", { t: "✓", c: C.accent }, { t: "部分✓", c: C.warn }, "2026 最前沿"],
      ],
    });
    s.addNotes("验收清单五条：推理期写入、跨会话持久、不遗忘、有门控、按对话者隔离。今天没有任何公开系统同时满足。");
  }

  // B3-1 为什么最难
  {
    const s = newSlide(pptx);
    const y = header(s, "B3 · 理解物理的机器人", "三条线里最难的一条", P);
    card(s, {
      x: 0.6, y: y + 0.05, w: 5.96, h: 0.95, title: "语言模型的世界", titleSize: 14, bodySize: 12,
      body: ["离散的、可回退的、无成本的 —— 说错一句话代价为零。"],
    });
    card(s, {
      x: 6.77, y: y + 0.05, w: 5.96, h: 0.95, title: "物理世界", titleSize: 14, bodySize: 12,
      body: ["连续的、不可回退的、有成本的 —— 打翻一个杯子就是打翻了。"],
      fill: C.card, line: C.warn,
    });
    table(s, {
      x: 0.6, y: y + 1.18, w: 12.13, colW: [2.6, 9.53], size: 11.5, rowH: 0.44, boldFirst: true,
      head: ["额外的硬约束", "说明"],
      rows: [
        [{ t: "数据稀缺", b: true, c: C.bad }, "语言有 15T token 公开语料；机器人真机数据全世界加起来百万级轨迹 —— 差 5–6 个数量级"],
        ["实时性", "控制回路要 30–1000 Hz。一个 100B 模型跑不到这个频率"],
        ["因果与物理", "需要理解「推它会倒」「这个杯子是满的所以重」，而不只是「这看起来像杯子」"],
        ["Sim2Real 间隙", "仿真便宜但不真；真机真但贵且慢"],
      ],
    });
    s.addText("VLA：一个模型，看图 + 读指令 + 直接输出电机指令", {
      x: 0.6, y: y + 3.16, w: 12.13, h: 0.34, fontFace: F.sans, fontSize: 15, bold: true, color: C.accent, margin: 0, valign: "middle",
    });
    table(s, {
      x: 0.6, y: y + 3.58, w: 12.13, colW: [2.6, 2.2, 2.3, 5.03], size: 10.5, rowH: 0.44, boldFirst: true,
      head: ["模型", "组织", "参数", "架构思想"],
      rows: [
        ["GR00T N1.7", "NVIDIA", "3B（开放可商用）", "双系统：慢思考(Cosmos-Reason2-2B) + 快反射(32 层 DiT)；EgoScale 用 20,854 小时人类第一视角视频预训练"],
        ["Gemini Robotics 1.5", "Google DeepMind", "云端 + 端侧", "先用语言思考再行动（embodied CoT）；首个开放微调的 VLA"],
        ["π0.5 / π0.7", "Physical Intelligence", "—", "流匹配 / 扩散生成动作（连续动作块）；π0.5 主打开放世界泛化，π0.7 强调可操控性"],
      ],
    });
    s.addNotes("VLA 把机器人从手工流水线变成端到端基础模型 —— 完全照搬 LLM 的成功路径。");
  }

  // B3-2 动作表示 + 数据放大
  {
    const s = newSlide(pptx);
    const y = header(s, "B3 · 关键设计", "动作怎么表示，数据怎么放大", P);
    table(s, {
      x: 0.6, y: y + 0.05, w: 12.13, colW: [3.2, 4.6, 4.33], size: 11, rowH: 0.38, boldFirst: true,
      head: ["动作表示方案", "做法", "优缺点"],
      rows: [
        ["离散 token（分箱）", "每个关节角分成 256 档，当词表 token", "复用 LLM 架构；但精度受限、序列太长"],
        ["FAST 编码", "对动作序列做 DCT + 熵编码再离散", "大幅压缩序列长度"],
        [{ t: "连续动作头（扩散/流匹配）", b: true, c: C.accent }, "一个小的扩散头直接生成动作块", "高频、平滑、精度好（π 系、GR00T 用）"],
        [{ t: "动作块 chunking", b: true, c: C.accent }, "一次预测未来 H 步而非 1 步", "减少累积误差和推理频率压力，几乎成为标配"],
      ],
    });
    s.addText("数据问题：真机数据太贵（一条轨迹要人遥操作），三条放大路径 ——", {
      x: 0.6, y: y + 1.96, w: 12.13, h: 0.34, fontFace: F.sans, fontSize: 14.5, bold: true, color: C.fg, margin: 0, valign: "middle",
    });
    const amp = [
      { n: "①", t: "人类第一视角视频", b: "人做家务的视频到处都是，缺的是动作标签 → 用 IDM 反推，或用 LAM 学潜在动作。GR00T 的 EgoScale（20,854 小时）就是这条路的规模化验证。" },
      { n: "②", t: "仿真 + 域随机化", b: "在仿真里生成海量数据，随机化光照/材质/物理参数，逼模型学到不依赖具体渲染的策略。核心风险是仿真的物理不够真。" },
      { n: "③", t: "世界模型当仿真器", b: "足够好的世界模型 = 一个可微的、无限的、免费的训练环境。机器人在「想象」里试错百万次，再把策略搬到真机。", hi: true },
    ];
    let x = 0.6;
    amp.forEach((a) => {
      s.addShape("roundRect", { x, y: y + 2.38, w: 3.9, h: 2.3, rectRadius: 0.09, fill: { color: a.hi ? C.accentSoft : C.card }, line: { color: a.hi ? C.accentDim : C.border, width: 1 } });
      s.addText(a.n, { x: x + 0.26, y: y + 2.54, w: 0.5, h: 0.34, fontFace: F.sans, fontSize: 16, bold: true, color: C.accent, margin: 0, valign: "middle" });
      s.addText(a.t, { x: x + 0.72, y: y + 2.54, w: 3.0, h: 0.34, fontFace: F.sans, fontSize: 14, bold: true, color: C.fg, margin: 0, valign: "middle" });
      s.addText(a.b, { x: x + 0.26, y: y + 2.98, w: 3.42, h: 1.56, fontFace: F.sans, fontSize: 11, color: C.dim, margin: 0, valign: "top", lineSpacing: 15.5 });
      x += 4.15;
    });
    band(s, {
      x: 0.6, y: y + 4.8, w: 12.13, h: 0.44,
      text: "所以 B3 和 A12 的世界模型是同一件事的两面 —— 世界模型不只是为了生成好看的视频，它是机器人的训练场。",
      size: 12.5, align: "center",
    });
    s.addNotes("第三条路是最有意思的，也是 Diogenes 在做的方向。");
  }

  // B3-3 Diogenes 实践
  {
    const s = newSlide(pptx);
    const y = header(s, "B3 · Diogenes 实践", "把游戏当作物理世界的代理：便宜、可控、数据充足", P);
    const four = [
      { t: "VLM", b: "游戏画面识别的 SOTA（看懂屏幕上发生了什么）" },
      { t: "Player Model", b: "毫秒级识别+判断+操作（行为克隆，对齐 VPT / Pearce CS:GO）" },
      { t: "World Model", b: "生成可交互的游戏世界（神经引擎）" },
      { t: "Action Model", b: "在世界模型环境里自动判别行为的后果" },
    ];
    let x = 0.6;
    four.forEach((f) => {
      card(s, { x, y: y + 0.05, w: 2.92, h: 1.1, title: f.t, body: [f.b], titleSize: 14, bodySize: 10.5 });
      x += 3.06;
    });
    s.addText("数据线 DataMiner 的四条原则（对任何具身数据采集都适用）", {
      x: 0.6, y: y + 1.3, w: 12.13, h: 0.3, fontFace: F.sans, fontSize: 14, bold: true, color: C.accent, margin: 0, valign: "middle",
    });
    table(s, {
      x: 0.6, y: y + 1.66, w: 12.13, colW: [2.5, 9.63], size: 10.5, rowH: 0.42, boldFirst: true,
      head: ["原则", "说明"],
      rows: [
        ["Consent-first", "没有有效 consent 不启动录制；is_trainable 门控 + 撤销级联 + 留存上限（≤365 天）"],
        [{ t: "两平面分离", b: true, c: C.accent }, "RAW 平面（原生分辨率/帧率，≥1080p30）与 DATASET 平面（规范化 chunk）。采集端只碰 RAW，规范化是可重放的纯函数 —— 未来要 60fps 或 640×360，直接从 RAW 重新物化"],
        [{ t: "时间 = 帧号", b: true, c: C.accent }, "用帧索引表达时间，把墙钟世界（QPC 时间戳）无损映射进帧号世界，对齐误差 ≤1 帧且可审计"],
        ["本地先行 crash-safe", "60s 分段落盘，每段独立可播"],
      ],
    });
    band(s, {
      x: 0.6, y: y + 3.6, w: 5.96, h: 0.72,
      text: "动作与画面的对齐误差直接决定 IDM 和行为克隆能不能学到东西 —— 差一帧，学的就是因果颠倒的关系。",
      size: 11.5, lineSpacing: 16,
    });
    card(s, {
      x: 6.77, y: y + 3.6, w: 5.96, h: 0.72, title: "训练线方法论", titleSize: 12.5, bodySize: 11,
      body: ["开源 teacher 标注 → 结构化 JSON 契约 → LoRA SFT → 硬验收门 →（后续）GRPO 精调"],
    });
    card(s, {
      x: 0.6, y: y + 4.44, w: 12.13, h: 0.66, title: "", titleSize: 1, bodySize: 11,
      body: ["合规是一等约束：闭源前沿模型做 teacher 是条款红线，不提供该后端。硬验收门写进 config 由 CI 强制：json_valid ≥0.95、game_top1 ≥0.90、event_class_acc ≥0.80。先用开源数据验证方法，再花钱采集。"],
    });
    s.addNotes("实测教训：resize@640×360 的 PSNR hud_bottom 只有 22.3 —— 而 HUD 里恰恰是弹药、血量这些决定动作的关键信息。");
  }

  // B 汇合
  {
    const s = newSlide(pptx);
    const y = header(s, "Part B 小结", "三条线在同一个点汇合", P);
    code(s, {
      x: 0.6, y: y + 0.02, w: 12.13, h: 2.5, size: 11, lineSpacing: 16,
      text: [
        "    B1 自主 Agent            B2 持续学习           B3 具身/物理",
        "         │                        │                     │",
        "  \"跨越长时间跨度\"        \"跨越会话持久化\"       \"跨越模拟与真实\"",
        "         │                        │                     │",
        "         └────────────┬───────────┴──────────┬──────────┘",
        "                      │                      │",
        "             需要一个可靠的           需要一个可写入的",
        "               世界模型                  记忆机制",
        "                      │                      │",
        "                      └──────────┬───────────┘",
        "                                 │",
        "                    一个能在\"想象\"中试错、",
        "                    并把结果永久内化的系统",
      ].join("\n"),
    });
    band(s, {
      x: 0.6, y: y + 2.72, w: 12.13, h: 0.92,
      text: "人类智能的两个基本回路：预测 → 行动 → 惊讶 → 更新。\n今天的 LLM 只有「预测」，Agent 补上了「行动」，「惊讶」和「更新」仍然缺失。",
      size: 15, lineSpacing: 24, align: "center",
    });
    card(s, {
      x: 0.6, y: y + 3.8, w: 12.13, h: 1.14, title: "如果只能押一个方向", titleSize: 15, bodySize: 13,
      body: ["押「惊讶信号」的定义与「更新门控」的判据。因为 B1 的可靠性、B2 的门控、B3 的 sim2real 修正，本质上是同一个问题 —— 如何在没有标准答案的情况下，知道自己错了。"],
      fill: C.accentSoft, line: C.accentDim,
    });
    s.addNotes("Part C 的 eval 体系，就是这个问题在生产环境里的一个工程近似。");
  }
};
