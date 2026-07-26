const { C, F, newSlide, header, card, code, table, stat, bullets, band } = require("./lib");

module.exports = function (pptx) {
  const P = "PART C · 实践";

  // C4 单一事实源
  {
    const s = newSlide(pptx);
    const y = header(s, "C4 · 正确性", "最重要的一条原则：路由与计费必须同源", P);
    code(s, {
      x: 0.6, y: y + 0.02, w: 12.13, h: 0.82, size: 11, lineSpacing: 17,
      text: "计费用：getModelById(effectiveModelId).tier      ← \"请求档\"\n路由用：resolveOpenRouterModel(id, plan)          ← 越权时降级成 \"免费档\"",
      color: C.bad,
    });
    card(s, {
      x: 0.6, y: y + 1.0, w: 12.13, h: 1.0, title: "可复现路径（不是理论）", titleSize: 13.5, bodySize: 12,
      body: ["Ultra 用户在某聊天里选了 Celestial → mobile 存进 AsyncStorage → 订阅到期掉成 Pro → 下一条消息 mobile 仍发 modelId=celestial → 服务端按 flagship 收 5 credits，实际用 Spark 生成回复。方向永远是「多收 + 降质」，而且服务端不返回 403，只是静默降级。"],
      line: C.bad,
    });
    code(s, {
      x: 0.6, y: y + 2.16, w: 6.6, h: 1.55, size: 9.5, lineSpacing: 13.5,
      text: [
        "/**",
        " * Resolve the model ACTUALLY served for (modelId, plan).",
        " * Pricing AND routing both derive from this.",
        " */",
        "export function resolveModel(modelId, plan): ModelDef {",
        "  const model = getModelById(modelId);",
        "  if (model && canAccessModel(modelId, plan)) return model;",
        "  return getModelById(DEFAULT_MODEL_ID)!;   // 静默降级 Spark",
        "}",
      ].join("\n"),
      color: C.accent,
    });
    code(s, {
      x: 7.4, y: y + 2.16, w: 5.33, h: 1.55, size: 9, lineSpacing: 13,
      text: [
        "请求 modelId",
        "  → clampModelToTier            (未成年)",
        "  → resolveModel(effective, plan)   ← 单一锚点",
        "  → servedModel.route: string[]",
        "  → getMessageCreditCost(servedModel) ← 按服务档扣",
        "  → chargeCreditsOrThrow        (前置, ultra 免)",
        "  → generate/streamChatResponse(route, …)",
        "  → 整条失败 → refundOnFail() + 降级 + 兜底句",
      ].join("\n"),
    });
    code(s, {
      x: 0.6, y: y + 3.86, w: 5.96, h: 0.62, size: 11,
      text: "expect(cost).toBe(1);   // not 7", color: C.accent,
    });
    band(s, {
      x: 6.77, y: y + 3.86, w: 5.96, h: 0.62,
      text: "用一条测试把它焊死。", size: 13, align: "center",
    });
    band(s, {
      x: 0.6, y: y + 4.6, w: 12.13, h: 0.5,
      text: "方法论：凡是有「请求的 X」和「实际的 X」两个概念的地方，必须只保留一个事实源，让另一个从它派生。",
      size: 13, align: "center",
    });
    s.addNotes("这个模式在计费、限流、审计、埋点里反复出现。");
  }

  // C5 计费与单位经济学
  {
    const s = newSlide(pptx);
    const y = header(s, "C5 · 计费", "从「按 tier 计价」到「按模型计价」", P);
    table(s, {
      x: 0.6, y: y + 0.02, w: 7.4, h: 0, colW: [1.4, 1.4, 2.5, 1.05, 1.05], size: 10.5, rowH: 0.3, boldFirst: true,
      head: ["id", "Tier", "上游主选", "解锁", "credits"],
      rows: [
        ["spark ⚡", "free", "gemini-2.5-flash-lite", "全部", "1"],
        ["breeze 🍃", "free", "minimax/minimax-m2.5", "全部", "1"],
        ["aurora 🌅", "premium", "anthropic/claude-haiku-4.5", "lite+", "3"],
        ["ember 🔥", "premium", "google/gemini-2.5-flash", "pro+", "3"],
        ["crystal 💎", "premium", "openai/gpt-4o-mini", "pro+", "3"],
        [{ t: "persona 🎭", b: true, c: C.accent }, "flagship", "ark:doubao-seed-character", "pro+", { t: "3", b: true, c: C.accent }],
        ["nebula 🌌", "flagship", "openai/gpt-4o", "ultra", { t: "6", b: true }],
        ["celestial ✨", "flagship", "anthropic/claude-sonnet-4.5", "ultra", { t: "7", b: true }],
      ],
    });
    card(s, {
      x: 8.2, y: y + 0.02, w: 4.53, h: 1.5, title: "同一个 tier 内成本差 15 倍", titleSize: 13, bodySize: 11,
      body: ["Persona (doubao) ~$0.0025/条 → 原价 5，现价 3", "Nebula (GPT-4o) ~$0.028/条 → 现价 6", "Celestial (Sonnet) ~$0.035/条 → 现价 7"],
      bullet: true,
    });
    band(s, {
      x: 8.2, y: y + 1.64, w: 4.53, h: 1.1,
      text: "原则：让 1 credit ≈ 一个固定的 COGS 单元（≤$0.006）。credit 价由实测上游成本机械推导：credits = ceil(成本 / $0.006)。",
      size: 11.5, lineSpacing: 17,
    });
    card(s, {
      x: 0.6, y: y + 2.86, w: 12.13, h: 1.06, title: "审计发现的最大产品问题不在技术，在定位", titleSize: 14, bodySize: 12.5,
      body: ["catalog 里唯一为角色扮演专门微调、且上游最便宜的模型（Persona / doubao-seed-character，~$0.0025/条），被锁在 Ultra 独占；而免费默认给的是 RP 适配最差的推理模型 —— 代码里那段专门剥 <think> 的逻辑就是铁证。"],
      line: C.bad,
    });
    band(s, {
      x: 0.6, y: y + 4.06, w: 12.13, h: 0.98,
      text: "把最适配、最便宜的模型压在最高门槛，用最不适配的模型做免费默认。\n裁决：Persona 下放到 Pro 并按模型定价 3 credits；flagship 的差异化靠 Celestial/Nebula 的英文写作上限撑。",
      size: 13, lineSpacing: 21, align: "center",
    });
    s.addNotes("Router 的模型选择直接决定产品的定位与毛利。");
  }

  // C5-2 毛利
  {
    const s = newSlide(pptx);
    const y = header(s, "C5 · 单位经济学", "文本全绿，媒体全红", P);
    table(s, {
      x: 0.6, y: y + 0.02, w: 12.13, colW: [3.1, 1.4, 2.0, 2.1, 1.9, 1.63], size: 10.5, rowH: 0.32, boldFirst: true,
      head: ["操作", "credits", "收入 @$0.02/cr", "上游成本", "单位毛利", "毛利率"],
      rows: [
        ["Free 消息", "1", "$0.02", "$0", { t: "+$0.020", c: C.accent }, "~100%"],
        ["Premium (Ember/Crystal)", "3", "$0.06", "$0.0015", { t: "+$0.059", c: C.accent }, "98%"],
        ["Premium (Aurora)", "3", "$0.06", "$0.010", { t: "+$0.050", c: C.accent }, "83%"],
        ["Flagship (Persona)", "3", "$0.06", "$0.0025", { t: "+$0.058", c: C.accent }, "96%"],
        ["Flagship (Celestial)", "7", "$0.14", "$0.035", { t: "+$0.105", c: C.accent }, "75%"],
        ["生成图片", "0 → 6", "$0", "$0.035", { t: "−$0.035", c: C.bad }, "亏"],
        ["TTS 播放", "0", "$0", "~$0.05", { t: "−$0.050", c: C.bad }, "亏"],
        [{ t: "文生视频", b: true }, "10 → 30", "$0.20", { t: "$0.70–1.25", c: C.bad }, { t: "−$0.80", c: C.bad, b: true }, { t: "亏 4 倍", c: C.bad }],
      ],
    });
    s.addText("同一个订阅档位，不同用户画像的毛利从 +93% 到 −200%", {
      x: 0.6, y: y + 2.88, w: 12.13, h: 0.32, fontFace: F.sans, fontSize: 14, bold: true, color: C.fg, margin: 0, valign: "middle",
    });
    table(s, {
      x: 0.6, y: y + 3.28, w: 12.13, colW: [2.5, 1.3, 1.9, 1.6, 1.5, 1.6, 1.73], size: 10.5, rowH: 0.32, boldFirst: true,
      head: ["画像", "档位", "模型", "消息/天", "视频/月", "AI 成本", "单位毛利"],
      rows: [
        ["轻度纯文字", "Pro", "Ember", "15", "0", "$0.68", { t: "+$8.42 (93%)", c: C.accent, b: true }],
        ["重度文字·贵模型", "Pro", "Aurora", "40", "0", "$12.00", { t: "−$2.90", c: C.bad, b: true }],
        ["轻度旗舰", "Ultra", "Persona", "30", "0", "$2.25", { t: "+$16.50 (88%)", c: C.accent, b: true }],
        ["旗舰 + 媒体", "Ultra", "Celestial", "30", "10", "$56.50", { t: "−$37.75", c: C.bad, b: true }],
      ],
    });
    band(s, {
      x: 0.6, y: y + 4.86, w: 12.13, h: 0.44,
      text: "典型的 whale-vs-minnow 自助餐经济学。Router 的模型选择直接决定你在这张表的哪一行。",
      size: 12.5, align: "center",
    });
    s.addNotes("视频严重低价销售是最大漏洞：收 10-12 credits，成本 $0.70-1.25/条。");
  }

  // C6 容量
  {
    const s = newSlide(pptx);
    const y = header(s, "C6 · 容量", "一个扩容救不了的天花板", P);
    card(s, {
      x: 0.6, y: y + 0.02, w: 12.13, h: 0.7, title: "", titleSize: 1, bodySize: 12.5,
      body: ["原有容量评估的结论是「Cloud Run 绰绰有余，DB 连接是第一瓶颈」—— 这份分析只看了自有基础设施，没看 AI 供应商的账户级限额。"],
      line: C.warn,
    });
    bullets(s, {
      x: 0.6, y: y + 0.86, w: 6.2, h: 1.5, size: 11.5, lineSpacing: 17, gap: 5,
      items: [
        { t: "~20 请求/分钟（RPM），账户级全局", b: true, c: C.bad },
        { t: "1,000 请求/天（曾购买 ≥$10 credits 的账户）", c: C.dim },
        { t: "「我们全局治理容量，多开账号/API key 不会提升你的限额」→ 横向加 key 无效", b: true, c: C.bad },
        { t: "失败请求也计入配额", c: C.dim },
      ],
    });
    code(s, {
      x: 7.0, y: y + 0.86, w: 5.73, h: 1.5, size: 9, lineSpacing: 12.5,
      text: [
        "1000 DAU，免费占 85% (≈850)",
        "",
        "N=8  (保守): 850×8  = 6,800/天   = 6.8× 超日限",
        "N=20 (现实): 850×20 = 17,000/天  = 17×  超日限",
        "",
        "20 RPM = 全局每 3 秒才允许 1 条免费请求",
        "峰值 ~68 个免费用户在线 → 30–68 条/分钟 → 持续 429",
      ].join("\n"),
      color: C.warn,
    });
    const worse = [
      { t: "更糟的是", b: "整条 fallback 链全是 :free 变体 → 撞 20 RPM 时整条链一起 429，容错机制在这种失败模式下归零。" },
      { t: "还有放大器", b: "后台 LLM 调用（journal / summary / openers / room-AI）也全走免费路由。一次用户发送 = 最多 3 个 :free 请求。" },
    ];
    let x = 0.6;
    worse.forEach((w) => {
      card(s, { x, y: y + 2.5, w: 5.96, h: 1.0, title: w.t, body: [w.b], titleSize: 13, bodySize: 11.5, line: C.bad });
      x += 6.17;
    });
    table(s, {
      x: 0.6, y: y + 3.66, w: 12.13, colW: [4.4, 2.0, 2.9, 2.83], size: 10.5, rowH: 0.3, boldFirst: true,
      head: ["方案", "每条成本", "1000 DAU 月成本", "裁决"],
      rows: [
        [{ t: "免费档 → 廉价付费小模型（Flash-Lite 档）", b: true, c: C.accent }, "~$0.0008", "$165–410/月", { t: "✓ 首选（顺带 RP 质量更好）", c: C.accent }],
        ["免费档 → Persona (doubao) 付费变体", "~$0.0025", "$510–1,275/月", "RP 最优、中文强，但更贵"],
        ["维持 :free + 接受限流", "$0", "$0", { t: "✗ 免费漏斗崩坏", c: C.bad }],
        ["多开 OpenRouter 账号", "—", "—", { t: "✗ 无效：全局治理", c: C.bad }],
      ],
    });
    s.addNotes("判定：1000 DAU 下付费部分能撑，免费部分会在几百并发时被打穿。");
  }

  // C6-2 修复技巧
  {
    const s = newSlide(pptx);
    const y = header(s, "C6 · 修复", "把 :free 从「主力」降为「兜底」—— 一个 env 变量完成容量修复", P);
    code(s, {
      x: 0.6, y: y + 0.05, w: 12.13, h: 2.35, size: 10.5, lineSpacing: 15,
      text: [
        "/**",
        " * Upstream string for the free default model. Overridable via `FREE_CHAT_MODEL`",
        " * so free users can be routed OFF OpenRouter `:free` variants WITHOUT a code",
        " * deploy. Unset = unchanged.",
        " */",
        "const FREE_DEFAULT_UPSTREAM =",
        "  process.env.FREE_CHAT_MODEL?.trim() || UPSTREAM.nemotron[0];",
        "",
        "export const FREE_ROUTE = dedup([",
        "  FREE_DEFAULT_UPSTREAM,      // env 指定的廉价付费串（主力）",
        "  ...UPSTREAM.nemotron,       // `:free` 降为溢出兜底",
        "  ...UPSTREAM.openrouterAuto,",
        "]);",
      ].join("\n"),
      color: C.accent,
    });
    band(s, {
      x: 0.6, y: y + 2.58, w: 12.13, h: 1.0,
      text: "教训：做容量规划时，必须把上游供应商的账户级限额当成一等资源来算。\n它和 CPU / 内存 / 连接数不同 —— 你无法通过扩容解决，只能通过换供应商或换计费模式解决。",
      size: 15, lineSpacing: 24, align: "center",
    });
    const cmp = [
      { t: "能扩容解决的", b: ["Cloud Run 实例数", "数据库连接池", "缓存容量", "带宽"], c: C.accent },
      { t: "扩容救不了的", b: ["上游账户级 RPM / RPD", "上游账户余额（402 会打死全部聊天）", "上游模型下线 / 改名", "上游全局故障"], c: C.bad },
    ];
    let x = 0.6;
    cmp.forEach((k) => {
      s.addShape("roundRect", { x, y: y + 3.76, w: 5.96, h: 1.3, rectRadius: 0.09, fill: { color: C.card }, line: { color: k.c, width: 1 } });
      s.addText(k.t, { x: x + 0.26, y: y + 3.9, w: 5.44, h: 0.3, fontFace: F.sans, fontSize: 14, bold: true, color: k.c, margin: 0, valign: "middle" });
      bullets(s, { x: x + 0.26, y: y + 4.24, w: 5.44, h: 0.76, items: k.b, size: 11, lineSpacing: 15, gap: 1 });
      x += 6.17;
    });
    s.addNotes("Cloud Run cuddler-web 已设 FREE_CHAT_MODEL=google/gemini-2.5-flash-lite。");
  }

  // C7 GenMeta
  {
    const s = newSlide(pptx);
    const y = header(s, "C7 · 可观测性", "容错让故障静默 —— 这是它的价值，也是它的危险", P);
    card(s, {
      x: 0.6, y: y + 0.02, w: 12.13, h: 0.66, title: "", titleSize: 1, bodySize: 12.5,
      body: ["问题：一条乱码回复出现了，你怎么知道是哪个上游产出的？Message.model 存的是 route[0]，但同档 in-route fallover 不会更新它 —— 所有诊断都指向主选，而实际产出的可能是第 3 个候选。"],
      line: C.warn,
    });
    code(s, {
      x: 0.6, y: y + 0.84, w: 6.9, h: 2.9, size: 9, lineSpacing: 12.8,
      text: [
        "export interface GenMeta {",
        "  /** 真正产出这条回复的候选（route[i]，不是 route[0]）*/",
        "  servedModel: string;",
        "  /** servedModel !== route[0] —— 在 route 内发生了 fallover */",
        "  degraded: boolean;",
        "  temperature: number;  maxTokens: number;  topP: number;",
        "  /** 尝试过的完整有序 route（事后可查\"降了多远\"）*/",
        "  route: string[];",
        "  /** OpenRouter 底层的实际 provider —— 可定位坏掉的 :free 端点 */",
        "  provider?: string;",
        "  /** stop | length | content_filter | error */",
        "  finishReason?: string;",
        "  /** 流式回复空/退化后静默重试成功 —— 否则恢复不留痕迹 */",
        "  degenerateRecovered?: boolean;",
        "  /** 本次 KV cache 命中/写入的 prompt token 数 */",
        "  cachedInputTokens?: number;  cacheWriteTokens?: number;",
        "}",
      ].join("\n"),
      color: C.accent,
    });
    const qs = [
      ["这条乱码是哪个上游产出的？", "servedModel + provider"],
      ["多少比例的付费请求实际降级了？", "degraded 聚合"],
      ["截断是撞 max_tokens 还是上游断流？", "finishReason === \"length\""],
      ["缓存命中率、prompt caching 省了多少？", "cachedInputTokens"],
      ["「请求档 ≠ 实际档」的错配率？", "requestedModelId vs servedModelId"],
    ];
    s.addText("这套字段能回答的问题（每一个都曾经答不上来）", {
      x: 7.7, y: y + 0.84, w: 5.03, h: 0.3, fontFace: F.sans, fontSize: 12.5, bold: true, color: C.fg, margin: 0, valign: "middle",
    });
    let cy = y + 1.2;
    qs.forEach(([q, a]) => {
      s.addShape("roundRect", { x: 7.7, y: cy, w: 5.03, h: 0.5, rectRadius: 0.06, fill: { color: C.card }, line: { color: C.border, width: 1 } });
      s.addText(q, { x: 7.9, y: cy + 0.04, w: 4.7, h: 0.24, fontFace: F.sans, fontSize: 10, color: C.dim, margin: 0, valign: "middle" });
      s.addText(a, { x: 7.9, y: cy + 0.26, w: 4.7, h: 0.22, fontFace: F.mono, fontSize: 9.5, color: C.accent, margin: 0, valign: "middle" });
      cy += 0.56;
    });
    band(s, {
      x: 0.6, y: y + 3.9, w: 12.13, h: 0.98,
      text: "原则：凡是有 fallback 的地方，都必须记录「实际发生了什么」，而不只是「打算做什么」。\n可观测性是容错的必要配套，不是可选项。",
      size: 14, lineSpacing: 22, align: "center",
    });
    s.addNotes("外加请求侧上下文：requestedModelId / servedModelId / plan / freeDegrade。");
  }

  // C8 健康探测
  {
    const s = newSlide(pptx);
    const y = header(s, "C8 · 健康探测", "让静默失效变成告警", P);
    code(s, {
      x: 0.6, y: y + 0.02, w: 7.3, h: 2.75, size: 8.8, lineSpacing: 12.5,
      text: [
        "/**",
        " * External-API health check: balances + model-catalog drift.",
        " *",
        " * Why this exists: `FREE_CHAT_MODEL` routes every free-default LLM call",
        " * through a PAID model first, so a drained OpenRouter balance 402s and",
        " * degrades ALL chat — that must page someone. And provider snapshot",
        " * renames (Anthropic `-4-5`→`-4.5`) silently retire pinned ids,",
        " * downgrading a friendly model to its tail without any error.",
        " */",
        "export interface BalanceReport {",
        "  openrouterRemainingUsd: number | null;",
        "  elevenlabsRemainingChars: number | null;",
        "  /** 已不在上游目录里的路由 id（待清理）*/",
        "  deadUpstreamIds: string[];",
        "  /** 主选(route[0])已死 → 正在静默服务 fallback */",
        "  degradedModels: Array<{ id: string; primary: string }>;",
        "  /** 媒体模型存活性（OpenRouter 目录看不到的管线）*/",
        "  mediaProbes: MediaProbeResult[];",
        "}",
      ].join("\n"),
    });
    table(s, {
      x: 8.1, y: y + 0.02, w: 4.63, h: 0, colW: [1.3, 3.33], size: 10, rowH: 0.5, boldFirst: true,
      head: ["监控类型", "触发条件"],
      rows: [
        ["余额", "OpenRouter 美元 / ElevenLabs 字符 < 阈值 → 飞书告警"],
        ["目录漂移", "路由 id vs 上游实时目录，主选 404 → 告警"],
        ["降级率", "genMeta.degraded 聚合 / [AI][DEGRADE] 日志异常升高 → 告警"],
      ],
    });
    card(s, {
      x: 8.1, y: y + 1.86, w: 4.63, h: 0.9, title: "三类监控，缺一不可", titleSize: 12.5, bodySize: 10.5,
      body: ["余额耗尽会 402 打死所有聊天（包括免费档，因为免费档已切到付费串）。"],
    });
    code(s, {
      x: 0.6, y: y + 2.94, w: 12.13, h: 1.1, size: 9.5, lineSpacing: 13.5,
      text: [
        "const DIRECT_PROVIDER_PREFIXES = [",
        "  \"ark:\", \"anthropic:\", \"openai:\", \"google:\", \"glm:\", \"azure:\", \"bedrock:\",",
        "] as const;   // 注意末尾的冒号 —— 它把 `google:` 与 OpenRouter 的 `google/gemini…:free` 区分开",
      ].join("\n"),
      color: C.accent,
    });
    band(s, {
      x: 0.6, y: y + 4.2, w: 12.13, h: 0.72,
      text: "必要的排除逻辑：直连 id 不能拿去和 OpenRouter 目录 diff，否则 openai:gpt-4o 会被误判成「OpenRouter 下线了这个模型」而误告警。",
      size: 12.5, lineSpacing: 18, align: "center",
    });
    s.addNotes("balance-monitor 每 30 分钟 cron 一次。");
  }
};
