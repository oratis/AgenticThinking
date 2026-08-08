const { C, F, newSlide, header, card, code, table, stat, bullets, band, divider } = require("./lib");

module.exports = function (pptx) {
  const P = "PART C · 实践";

  divider(pptx, {
    num: "C", part: P, kicker: "PART C · PRACTICE",
    title: "Cuddler 的 Model Router",
    sub: "在一个有付费用户、有成本压力的真实产品里，怎么把一堆模型组织成一个可靠的系统。\n所有代码引用来自生产仓库，所有数字来自实际审计与 eval。",
    items: ["架构四代演进 + 三层容错", "计费 / 容量 / 可观测 / Eval 闭环", "13 条可复用的设计原则"],
  });

  // C0 为什么需要 router
  {
    const s = newSlide(pptx);
    const y = header(s, "C0 · 动机", "一个稍具规模的 AI 产品，模型调用点会迅速膨胀", P);
    const scenes = [
      ["1:1 聊天（用户可选模型）", "LLM × 8 个友好名"],
      ["多人房间 AI", "LLM"],
      ["开场白 / 日记 / 剧情事件 / 摘要", "LLM（后台）"],
      ["快速创建角色", "LLM × 2 + 图像"],
      ["Remix（角色/事件/日记/场景/视频）", "LLM + 图像 + 视频"],
      ["图像生成 / 视频生成", "Seedream / Seedance（异步）"],
      ["TTS / 语音克隆", "ElevenLabs"],
      ["内容审核 / 反馈分类 / 漂移检测", "Moderation + VLM judge"],
    ];
    let cy = y + 0.05;
    scenes.forEach(([a, b]) => {
      s.addShape("roundRect", { x: 0.6, y: cy, w: 6.1, h: 0.42, rectRadius: 0.05, fill: { color: C.card }, line: { color: C.border, width: 1 } });
      s.addText(a, { x: 0.8, y: cy, w: 3.7, h: 0.42, fontFace: F.sans, fontSize: 11, color: C.fg, margin: 0, valign: "middle" });
      s.addText(b, { x: 4.5, y: cy, w: 2.0, h: 0.42, fontFace: F.sans, fontSize: 10, color: C.accent, margin: 0, valign: "middle" });
      cy += 0.5;
    });
    s.addText("没有 router 会发生什么（都是真实发生过的）", {
      x: 6.95, y: y + 0.05, w: 5.78, h: 0.32, fontFace: F.sans, fontSize: 14, bold: true, color: C.bad, margin: 0, valign: "middle",
    });
    const bad = [
      "上游把模型改名（Anthropic claude-haiku-4-5 → 4.5），硬编码模型串 404，付费用户静默拿到免费模型的质量，没有任何告警",
      "OpenRouter :free 撞上账户级全局限流（~20 RPM），免费用户大面积 429 —— 扩容 Cloud Run 和数据库一点忙都帮不上",
      "计费按「用户请求的档位」，路由按「实际降级后的档位」→ 超额收费",
      "生成失败了，credit 已经扣了，没有退款路径",
    ];
    let by = y + 0.48;
    bad.forEach((b) => {
      s.addShape("roundRect", { x: 6.95, y: by, w: 5.78, h: 0.86, rectRadius: 0.07, fill: { color: C.card }, line: { color: C.bad, width: 1 } });
      s.addText(b, { x: 7.17, y: by + 0.06, w: 5.36, h: 0.74, fontFace: F.sans, fontSize: 10.5, color: C.dim, margin: 0, valign: "middle", lineSpacing: 14.5 });
      by += 0.96;
    });
    band(s, {
      x: 0.6, y: y + 4.24, w: 12.13, h: 0.78,
      text: "Model Router 不是「选模型」这么简单 —— 它同时承担 路由 / 韧性 / 计费 / 权限 / 可观测 五个职责。",
      size: 15, align: "center",
    });
    s.addNotes("这五个职责是本节的骨架。");
  }

  // C1 四代演进
  {
    const s = newSlide(pptx);
    const y = header(s, "C1 · 架构演进", "四个阶段", P);
    const gens = [
      { v: "v0", t: "硬编码单模型", b: "换模型要改代码、上游挂了没退路、没法按档位区分。", c: C.bad },
      { v: "v1", t: "前缀分发（两段式）", b: "友好 id → 上游串（内联做 plan 鉴权，越权静默降级）；上游串 → 靠字符串前缀 ark: 二分。fallback 链只含 5 个 free 模型。", c: C.warn },
      { v: "v2", t: "route[] 路由数组 + 同档 fallover", b: "把「一个模型串」变成「一个有序的候选数组」；付费模型 fallover 到同档付费而不是掉到免费。", c: C.accent },
      { v: "v3", t: "Provider Registry + 直连 + wire 方言", b: "把 ark: 这一个特例泛化成 provider registry，新增 anthropic:/openai:/google:/glm:/azure: 前缀，直连候选编织进每个模型的 route[]。", c: C.accent },
    ];
    let cy = y + 0.05;
    gens.forEach((g) => {
      s.addShape("roundRect", { x: 0.6, y: cy, w: 12.13, h: 0.92, rectRadius: 0.08, fill: { color: g.c === C.accent ? C.accentSoft : C.card }, line: { color: g.c === C.accent ? C.accentDim : C.border, width: 1 } });
      s.addText(g.v, { x: 0.85, y: cy, w: 0.85, h: 0.92, fontFace: F.sans, fontSize: 22, bold: true, color: g.c, margin: 0, valign: "middle" });
      s.addText(g.t, { x: 1.78, y: cy, w: 3.5, h: 0.92, fontFace: F.sans, fontSize: 14.5, bold: true, color: C.fg, margin: 0, valign: "middle" });
      s.addText(g.b, { x: 5.4, y: cy + 0.08, w: 7.1, h: 0.76, fontFace: F.sans, fontSize: 11, color: C.dim, margin: 0, valign: "middle", lineSpacing: 15 });
      cy += 1.02;
    });
    card(s, {
      x: 0.6, y: cy + 0.02, w: 5.96, h: 1.34, title: "v1 的三个致命缺陷", titleSize: 13, bodySize: 10.5, bullet: true,
      body: ["付费串不在 fallback 链 → indexOf −1 → 零重试", "付费档反而比免费档更脆弱", "计费与路由两个事实源 → 超额收费"],
      line: C.bad,
    });
    band(s, {
      x: 6.77, y: cy + 0.02, w: 5.96, h: 1.34,
      text: "v3 的关键洞察：router 早就是前缀分发架构。所以「接入直连」= 把 ark: 这一个特例泛化。零新架构。",
      size: 12.5, lineSpacing: 18,
    });
    s.addNotes("最好的架构演进往往是「发现你已经有的抽象，然后把它泛化」。");
  }

  // C1-2 resolveUpstream + wire
  {
    const s = newSlide(pptx);
    const y = header(s, "C1 · Provider Registry", "抽象的维度不是 provider，而是 wire（协议方言）", P);
    code(s, {
      x: 0.6, y: y + 0.02, w: 6.6, h: 2.72, size: 9.5, lineSpacing: 13.5,
      text: [
        "function resolveUpstream(candidate): ResolvedUpstream {",
        "  const colon = candidate.indexOf(\":\");",
        "  if (colon > 0) {",
        "    const model = candidate.slice(colon + 1);",
        "    switch (candidate.slice(0, colon)) {",
        "      case \"ark\":       return {provider:\"ark\",       model, wire:\"openai\"};",
        "      case \"openai\":    return {provider:\"openai\",    model, wire:\"openai\"};",
        "      case \"google\":    return {provider:\"google\",    model, wire:\"openai\"};",
        "      case \"glm\":       return {provider:\"glm\",       model, wire:\"openai\"};",
        "      case \"azure\":     return {provider:\"azure\",     model, wire:\"openai\"};",
        "      case \"anthropic\": return {provider:\"anthropic\", model, wire:\"anthropic\"};",
        "      // 无法识别的前缀（如 nvidia/…:free）→ 落到 OpenRouter",
        "    }",
        "  }",
        "  return { provider: \"openrouter\", model: candidate, wire: \"openai\" };",
        "}",
      ].join("\n"),
    });
    card(s, {
      x: 7.4, y: y + 0.02, w: 5.33, h: 1.3, title: "wire: openai", titleSize: 14, bodySize: 11,
      body: ["OpenRouter · Ark · OpenAI · Google(/v1beta/openai) · GLM · Azure", "共用一套请求/响应/SSE 代码路径。差异只在 URL + auth header + 少量 body 参数。"],
    });
    card(s, {
      x: 7.4, y: y + 1.44, w: 5.33, h: 1.3, title: "wire: anthropic", titleSize: 14, bodySize: 11,
      body: ["真正不同的协议：system 是顶层字段、响应是 content[].text、SSE 是 typed 事件（content_block_delta），无 [DONE] 哨兵。"],
      line: C.warn,
    });
    band(s, {
      x: 0.6, y: y + 2.94, w: 12.13, h: 0.72,
      text: "按 provider 抽象会写 7 个 adapter；按 wire 抽象只写 2 个。第七家接进来只需要加一个 case + 一个 URL。",
      size: 14, align: "center",
    });
    card(s, {
      x: 0.6, y: y + 3.78, w: 12.13, h: 1.4, title: "顺带记录踩过的坑（全部收敛在 toAnthropicRequest 一个函数里）", titleSize: 13, bodySize: 11.5, bullet: true,
      body: ["Claude 4+ 同时传 temperature 和 top_p 会 400", "首条消息必须是 user role（要丢弃开头的 assistant turn）", "image_url 要转成 image.source.url"],
    });
    s.addNotes("这是我在这个设计里最满意的一个决策。");
  }

  // C2 UPSTREAM 目录
  {
    const s = newSlide(pptx);
    const y = header(s, "C2 · 路由表", "语义命名 + 集中目录 —— 上游改名是一行修改", P);
    code(s, {
      x: 0.6, y: y + 0.02, w: 7.3, h: 3.2, size: 9.5, lineSpacing: 13.5,
      text: [
        "const UPSTREAM = {",
        "  // — free / open-weight —",
        "  nemotron:        [\"nvidia/nemotron-3-super-120b-a12b:free\"],",
        "  openrouterAuto:  [\"openrouter/free\"],      // 兜底 auto-router",
        "  minimax:         [\"minimax/minimax-m2.5\"],",
        "  // — premium — (VERIFIED live vs OpenRouter /models 2026-07-04)",
        "  geminiFlashLite: [\"google/gemini-2.5-flash-lite\"],",
        "  gpt4oMini:       [\"openai/gpt-4o-mini\"],",
        "  claudeHaiku:     [\"anthropic/claude-haiku-4.5\"],",
        "  geminiFlash:     [\"google/gemini-2.5-flash\"],",
        "  // — flagship —",
        "  claudeSonnet:    [\"anthropic/claude-sonnet-4.5\",",
        "                    \"anthropic/claude-sonnet-4\"],",
        "  gpt4o:           [\"openai/gpt-4o\"],",
        "  personaArk:      [\"ark:doubao-seed-character-251128\",",
        "                    \"ark:doubao-seed-character\"],",
        "} as const;",
      ].join("\n"),
    });
    const pts = [
      { t: "引用语义名", b: "路由表引用 UPSTREAM.claudeHaiku，不引用字面串" },
      { t: "一处修改", b: "真实事件：Anthropic 把 -4-5 改成 -4.5，旧 id 全部 404，Aurora 静默降级了一段时间才被发现" },
      { t: "newest-first 数组", b: "当前稳定 slug + 上一个大版本兜底" },
      { t: "标注核验日期", b: "这是一个会腐烂的常量，必须标明保质期" },
    ];
    let cy = y + 0.02;
    pts.forEach((p) => {
      s.addShape("roundRect", { x: 8.1, y: cy, w: 4.63, h: 0.76, rectRadius: 0.07, fill: { color: C.card }, line: { color: C.border, width: 1 } });
      s.addText(p.t, { x: 8.32, y: cy + 0.06, w: 4.2, h: 0.26, fontFace: F.sans, fontSize: 12, bold: true, color: C.accent, margin: 0, valign: "middle" });
      s.addText(p.b, { x: 8.32, y: cy + 0.3, w: 4.2, h: 0.42, fontFace: F.sans, fontSize: 10, color: C.dim, margin: 0, valign: "top", lineSpacing: 13 });
      cy += 0.82;
    });
    band(s, {
      x: 0.6, y: y + 3.4, w: 12.13, h: 0.62,
      text: "同档尾巴：付费模型 fallover 到同档付费模型，而不是掉到免费。", size: 13.5, align: "center",
    });
    code(s, {
      x: 0.6, y: y + 4.12, w: 12.13, h: 0.8, size: 10, lineSpacing: 14,
      text: "const PREMIUM_TAIL  = dedup([...UPSTREAM.geminiFlashLite, ...UPSTREAM.gpt4oMini]);\nconst FLAGSHIP_TAIL = dedup([UPSTREAM.claudeSonnet[0], UPSTREAM.gpt4o[0]]);",
    });
    s.addNotes("语义命名是最便宜也最有效的一条原则。");
  }

  // C2-2 weave + flag
  {
    const s = newSlide(pptx);
    const y = header(s, "C2 · 编织", "直连候选与 env flag 灰度", P);
    code(s, {
      x: 0.6, y: y + 0.02, w: 6.5, h: 2.5, size: 9.5, lineSpacing: 13.5,
      text: [
        "const DIRECT: Record<string, string[]> = {",
        "  spark:     [\"google:gemini-2.5-flash-lite\"],",
        "  breeze:    [\"glm:glm-4-flash\"],",
        "  aurora:    [\"anthropic:claude-haiku-4-5\"],",
        "  ember:     [\"google:gemini-2.5-flash\"],",
        "  crystal:   [\"openai:gpt-4o-mini\"],",
        "  celestial: [\"anthropic:claude-sonnet-4-5\"],",
        "  nebula:    [\"openai:gpt-4o\"],",
        "  persona:   [],            // doubao 无非 Ark 源",
        "};",
        "",
        "const PREFER_DIRECT = process.env.PREFER_DIRECT_PROVIDERS === \"1\";",
        "",
        "function weave(openRouterRoute, direct) {",
        "  return dedup(PREFER_DIRECT",
        "    ? [...direct, ...openRouterRoute]     // 省加价 + 逃离账户限流",
        "    : [...openRouterRoute, ...direct]);   // 默认：直连当兜底尾",
        "}",
      ].join("\n"),
    });
    code(s, {
      x: 7.3, y: y + 0.02, w: 5.43, h: 1.45, size: 8.5, lineSpacing: 12,
      text: [
        "实测 resolveModelRoute(\"aurora\", \"ultra\"):",
        "",
        "flag=0: [\"anthropic/claude-haiku-4.5\",",
        "         \"google/gemini-2.5-flash-lite\",",
        "         \"openai/gpt-4o-mini\",",
        "         \"anthropic:claude-haiku-4-5\"]",
        "",
        "flag=1: [\"anthropic:claude-haiku-4-5\",",
        "         \"anthropic/claude-haiku-4.5\", ...]",
      ].join("\n"),
    });
    const why = [
      "route[0] 不变 → 生产服务字节级不变、计费不变，上线是零行为变更",
      "直连作为同档兜底尾，比旧的「直接降级到免费」严格更优",
      "改 env 即可灰度，免部署代码",
    ];
    let cy = y + 1.62;
    why.forEach((w, i) => {
      s.addShape("roundRect", { x: 7.3, y: cy, w: 5.43, h: 0.62, rectRadius: 0.06, fill: { color: C.card }, line: { color: C.border, width: 1 } });
      s.addText(String(i + 1), { x: 7.5, y: cy, w: 0.3, h: 0.62, fontFace: F.sans, fontSize: 13, bold: true, color: C.accent, margin: 0, valign: "middle" });
      s.addText(w, { x: 7.84, y: cy + 0.04, w: 4.72, h: 0.54, fontFace: F.sans, fontSize: 10, color: C.dim, margin: 0, valign: "middle", lineSpacing: 13 });
      cy += 0.7;
    });
    band(s, {
      x: 0.6, y: y + 2.72, w: 12.13, h: 0.92,
      text: "最重要的上线原则：一个大改动，上线时必须是 no-op。\n让「接入新能力」和「启用新能力」是两次独立的、可分别回滚的动作。",
      size: 15, lineSpacing: 24, align: "center",
    });
    code(s, {
      x: 0.6, y: y + 3.8, w: 12.13, h: 1.1, size: 9.5, lineSpacing: 13.5,
      text: [
        "const MODEL_ROUTES = {",
        "  spark:  weave(FREE_ROUTE, DIRECT.spark),",
        "  aurora: weave(dedup([...UPSTREAM.claudeHaiku, ...PREMIUM_TAIL]),  DIRECT.aurora),",
        "  celestial: weave(dedup([...UPSTREAM.claudeSonnet, ...FLAGSHIP_TAIL]), DIRECT.celestial),  /* … */ };",
      ].join("\n"),
    });
    s.addNotes("PREFER_DIRECT_PROVIDERS / FREE_CHAT_MODEL / REGEN_CREDIT_MULTIPLIER 都是这个模式。");
  }

  // C3 route runner
  {
    const s = newSlide(pptx);
    const y = header(s, "C3 · 路由执行器", "整个 router 的心脏：三层容错", P);
    code(s, {
      x: 0.6, y: y + 0.02, w: 7.2, h: 3.35, size: 9, lineSpacing: 12.8,
      text: [
        "for (let i = 0; i < route.length; i++) {      // ← 第2层：候选间 fallover",
        "  const candidate = route[i];",
        "  for (let attempt = 0; ; attempt++) {       // ← 第1层：同候选重试",
        "    try {",
        "      text = await callChatOnce(candidate, messages, …);",
        "    } catch (e) {",
        "      lastStatus = e instanceof UpstreamError ? e.status : 0;",
        "      // 瞬时错误（429/5xx）→ 退避后重试同一个候选",
        "      if (isTransientStatus(lastStatus) && attempt < maxRetries) {",
        "        await sleep(400 * (attempt + 1));",
        "        continue;",
        "      }",
        "      break;                    // 放弃这个候选 → 试下一个",
        "    }",
        "    if (meta) {",
        "      meta.servedModel = candidate;",
        "      meta.degraded    = i > 0;  // ← 记录是否发生了 fallover",
        "    }",
        "    return text;",
        "  }",
        "}",
        "// 整条 route 打尽 → 调用方降级到免费模型 + 退款",
        "logDegrade(route[0], lastStatus, maxRetries);",
        "throw new Error(`All models failed for route [${route.join(\", \")}]`);",
      ].join("\n"),
    });
    const layers = [
      { n: "①", t: "同候选重试", trig: "瞬时错误（429 / 5xx）", act: "退避 400ms × n，最多 2 次", u: "无（稍慢）", c: C.accent },
      { n: "②", t: "候选间 fallover", trig: "该候选彻底不可用（404 / 持续 429）", act: "换同档下一个候选", u: "无（质量档不变）", c: C.accent },
      { n: "③", t: "整路降级", trig: "整条 route 打尽", act: "降到免费模型 + 退款 + 告警", u: "有（质量下降，但退钱）", c: C.warn },
    ];
    let cy = y + 0.02;
    layers.forEach((l) => {
      s.addShape("roundRect", { x: 8.0, y: cy, w: 4.73, h: 1.08, rectRadius: 0.07, fill: { color: C.card }, line: { color: C.border, width: 1 } });
      s.addText(l.n + " " + l.t, { x: 8.22, y: cy + 0.06, w: 4.3, h: 0.26, fontFace: F.sans, fontSize: 12.5, bold: true, color: l.c, margin: 0, valign: "middle" });
      s.addText("触发：" + l.trig, { x: 8.22, y: cy + 0.34, w: 4.3, h: 0.24, fontFace: F.sans, fontSize: 9.5, color: C.dim, margin: 0, valign: "middle" });
      s.addText("动作：" + l.act, { x: 8.22, y: cy + 0.56, w: 4.3, h: 0.24, fontFace: F.sans, fontSize: 9.5, color: C.fg, margin: 0, valign: "middle" });
      s.addText("用户感知：" + l.u, { x: 8.22, y: cy + 0.78, w: 4.3, h: 0.24, fontFace: F.sans, fontSize: 9.5, color: C.faint, margin: 0, valign: "middle" });
      cy += 1.16;
    });
    card(s, {
      x: 0.6, y: y + 3.55, w: 12.13, h: 1.34, title: "三个容易漏掉的细节", titleSize: 13.5, bodySize: 11.5, bullet: true,
      body: [
        "空回复当失败：EMPTY_COMPLETION_STATUS = 502。:free 端点返回 200 但内容是垃圾/空，当成功就会把乱码给用户",
        "流式只掐 TTFB 不掐流长（30s）：防上游挂死占住 Cloud Run slot 和数据库连接，但不腰斩长回复",
        "<think> 剥离：非流式直接剥；流式要做跨 chunk 的有状态过滤器（标签可能被切在两个 chunk 中间）",
      ],
    });
    s.addNotes("三层的语义各不相同，混在一起写就会漏掉退款或漏掉告警。");
  }
};
