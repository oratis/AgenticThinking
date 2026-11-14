# Agentic Thinking EP06 · Hype Circle

Oratis · 2026 年 11 月 18 日（周三）上午 11:00，北京时间

演示按完整内容排列为 22 页。以下文字也保存在 Keynote 的演讲者备注中。

## 01 · Gartner Hype Cycle for Agentic AI

本期从 2022 年 11 月 30 日的 ChatGPT 时刻出发。本页采用用户指定的 Gartner Hype Cycle for Agentic AI 完整图，标注日期为 2026 年 4 月。图中的 Agentic AI 处于期望膨胀峰值附近。Where we are 对应本期讨论的 Agentic 应用，Peak of anticipation 是讲者用语；Gartner 原图阶段名为 Peak of Inflated Expectations。五阶段名称、技术点位置及成熟时间均保留原图。横轴表示技术成熟过程，ChatGPT 日期是本期历史锚点。

- [参考资料 1](https://www.gartner.com/en/podcasts/thinkcast/the-2026-hype-cycle-for-agentic-ai-what-leaders-need-to-know)
- [参考资料 2](https://openai.com/index/chatgpt/)

## 02 · Peak of anticipation

高峰期的爆款来自三项条件同时到位。天时是行业预期，地利是模型能力，人和是产品能力。Seedance 与 Claude Code 让用户能够快速看见结果，增长又支撑更大的愿景。我们做逗逗 AI 时也经历过过度承诺的压力。讲故事、验证增长、延伸故事容易互相强化。随着客户开始追问复用率、成本与交付，这种打法的有效窗口会收窄。Claude Code 六个月达到 10 亿美元年化收入是 Anthropic 在 2025 年 12 月披露的口径。

- [参考资料 1](https://seed.bytedance.com/zh/blog/official-launch-of-seedance-2-0)
- [参考资料 2](https://www.anthropic.com/news/anthropic-acquires-bun-as-claude-code-reaches-usd1b-milestone)

## 03 · 中国开源 AI 压缩了时间差

贵族式与平民式是两种竞争策略的比喻。美国前沿实验室更多依赖尖端芯片与密集资本投入，受电网接入和容量约束。中国团队在先进芯片获取受限的条件下推进开放权重、成本优化和较宽松许可。两国都存在开放与封闭路线。Energy Institute 同口径 2024 年发电量，中国约 10,086.9 TWh，美国约 4,634.8 TWh，约 2.18 倍。IEA 2026 年更新预计全球数据中心用电由 2025 年 485 TWh 增至 2030 年约 950 TWh，其中 AI 是主要增量驱动。它测量数据中心用电，无法推导 2027 年推理开支 25 万亿美元。开放模型更早成为替代品，从技术突破到可比较产品的时间差因此可能缩短。

- [参考资料 1](https://www.energyinst.org/__data/assets/pdf_file/0007/1658077/Statistical-Review-of-World-Energy.pdf)
- [参考资料 2](https://www.iea.org/reports/key-questions-on-energy-and-ai/executive-summary)
- [参考资料 3](https://qwenlm.github.io/blog/qwen3/)
- [参考资料 4](https://github.com/deepseek-ai/DeepSeek-R1)

## 04 · 走进低谷，主线更清楚

当热度下降，跟风团队和无法兑现承诺的供应商会更难存活。我们的工作收敛为两个相互支撑的方向，持续改善用户真正拿到的结果，持续改善每次交付的毛利。毛利为复购、研发与运营留下空间，但企业仍要管理固定费用、获客与现金流。

- [参考资料 1](https://emt.gartnerweb.com/ngw/globalassets/en/articles/documents/see-3-of-the-most-popular-gartner-hype-cycles-updated.pdf)

## 05 · 模型即产品的悖论

Karpathy 的 Software 1.0 是显式编程，2.0 是训练神经网络权重，3.0 是用自然语言给模型写程序。在 2026 年的访谈中，他用 MenuGen 说明，生成模型升级会吸收原本由应用提供的单点能力。应用应在一个已付费的小群体里找到明确任务，把完整交付做成 Agent 的 use case。用户真正付费的流程、资产和关系，可以随着模型升级继续增值。

- [参考资料 1](https://www.youtube.com/watch?v=LCEmiRjPEtQ)
- [参考资料 2](https://www.youtube.com/watch?v=96jN2OCOfLs)

## 06 · 应用层的机会

应用要贴着模型能力和发展方向生长，同时拥有自己的资产、收入来源和获客方式。LLM 在走向可规划、调用工具和验证结果的 Agentic 循环。这里把用户提到的 DiT 三角循环工作化为理解、生成、编辑三种视觉能力的互相反馈，参考统一多模态研究，而非把它称作所有 DiT 架构共有的固定理论。下面三项是应用可以经营的基础，模型路由、上下文资产、可动态组合的工具。

- [参考资料 1](https://bagel-ai.org/)
- [参考资料 2](https://seed.bytedance.com/zh/blog/official-launch-of-seedance-2-0)

## 07 · 模型的不可能三角

成本、速度与效果构成工程取舍。图形是选择框架，同一个模型在不同推理预算和部署条件下可能落在不同位置。产品要先确定任务的效果门槛与响应时限，再选择成本可接受的方案。技术进步可以推动整条能力边界外移，三角形不能当成严格数学定律。

- [参考资料 1](https://qwenlm.github.io/blog/qwen3/)

## 08 · 从 model 到 model router

当一个外部模型下线就使产品大部分价值消失时，团队还没有掌握完整交付。路由要同时考虑用户购买什么价值、模型擅长什么技术以及总成本能否承受。三项条件互相约束，例如会员购买的低延迟与角色一致性，决定候选模型和回退标准，再决定可接受的成本。模型可替换的前提是验收和状态能迁移。


## 09 · Data · Harness · Context

模型仍面对高推理成本，以及在陌生任务上迁移不稳定的问题。产品最值得独占积累的两类数据，是基础模型没见过的真实事件、失败和纠错，以及经授权的个人偏好与共同经历。这是本期对差异化数据价值的选择，不表示公开数据或合成数据一概无用。Data 保存可学习的经历，harness 把经历变成可执行、可验收的流程，context 则为当下任务选取必要信息。

- [参考资料 1](https://arxiv.org/abs/2311.16863)
- [参考资料 2](https://github.com/deepseek-ai/DeepSeek-R1)

## 10 · 软件，随每个人生长

Connector 把应用和数据接进来，可以由 API 或 MCP 实现。连接器给出当前上下文，Skill 定义可复用工作方法，Tool 执行具体动作。Worker 可以在本地、云端或边缘运行，并回写结果。Manus、dot、Muse 已提供其中多种机制。Claude Mods 允许修改工具、提示词与 UI，DSH 以可组合插件构建运行时。由此推演，未来每个人的软件会随自身任务和历史调整。设计工作也会更多转向能力边界、演变路径与用户控制。

- [参考资料 1](https://www.manus.im/features/connectors)
- [参考资料 2](https://learn.chatgpt.com/docs/dots)
- [参考资料 3](https://muse.ai/blog/security-and-safety-for-ai-agents-our-approach-with-muse)
- [参考资料 4](https://claude.com/resources/articles/claude-code-mods)
- [参考资料 5](https://github.com/deepseek-ai/deepseek-harness)

## 11 · 时代中的三种机遇

工作的变化是，执行成本降低后，定义值得解决的问题更重要。问对问题依赖每个人独特的生活体验、真实处境和判断。明确边界且能验收的许多子任务，可以从 30B 级模型开始验证，并通过蒸馏继续降低成本，实际覆盖率需要任务测试。娱乐则从创作者的一头一尾逐步走向观众参与生成，消费动作可以触发下一幕。

- [参考资料 1](https://qwenlm.github.io/blog/qwen3/)
- [参考资料 2](https://github.com/deepseek-ai/DeepSeek-R1)
- [参考资料 3](https://cuddler.ai/docs/what-is-cuddler)

## 12 · 陪伴与内容

陪伴的回访理由是共同经历仍然被理解，内容的回访理由是还有下一幕值得看。逗逗 AI 和 HakkoAI 更强调实时上下文、个人记忆与关系。Cuddler 通过角色、视频、分支故事和创作工具，探索观看与创作的连接。两类产品都有模型、上下文与工具，只是建设重心不同。

- [参考资料 1](https://m.doudou.fun/)
- [参考资料 2](https://www.hakko.ai/)
- [参考资料 3](https://cuddler.ai/docs/what-is-cuddler)

## 13 · 陪伴的壁垒，在 Context

Model 层通过快速、灵活、稳定的 router 跟进模型进步。Tool 层的单点能力通常更容易被替代，但复杂工具仍有集成和验证成本。对陪伴产品，更难迁移的是上下文，谁和用户经历过什么，用户如何表达偏好，哪些记忆经过纠正。用三层厚度表达建设重心。用户应能控制记忆，模型升级应提升关系体验。

- [参考资料 1](https://www.hakko.ai/)
- [参考资料 2](https://m.doudou.fun/)

## 14 · 内容的终点，是创作与消费闭环

AIGC 的 C 需要给人故事的获得感、快乐、共鸣和节奏。文本 roleplay 可以继续有独立价值，同时视频与互动扩大表达空间。上游模型如 Seedance、Kling 下沉产品，下游红果、抖音掌握分发和付费，通用工具层容易承受毛利压力。OpenArt、TapNow 等仍可通过工作流创造价值。TapNow CineMap、LibTV 3D-BOX、Higgsfield Genjutsu 显示视觉工具快速丰富，但没有证据支持具体同日或次日抄袭。Cuddler 的方向是连接创作、观看、互动与付费，建设内容商业化闭环。

- [参考资料 1](https://cuddler.ai/docs/what-is-cuddler)
- [参考资料 2](https://docs.tapnow.ai/zh/docs/canvas/create-text-and-3d)
- [参考资料 3](https://www.liblib.tv/)
- [参考资料 4](https://higgsfield.ai/blog/higgsfield-genjutsu)
- [参考资料 5](https://seed.bytedance.com/zh/blog/official-launch-of-seedance-2-0)

## 15 · 钱，从哪里来？

商业化选择从一个今天已经有人付费的场景开始。群体和任务都可以小，但付费动机要具体。再问 Agent 能否在质量可比的条件下，把某个关键交付指标改善一个数量级。十倍是本团队的进入门槛，而非所有场景已实现的事实。一般攻略往往依赖免费供给，但教练、付费社区和定制攻略存在支付市场，应细分验证。客服已有企业预算，效率收益仍需实测并计入转人工和质量损失。


## 16 · 模型使用效率，决定毛利底色

每项任务都要匹配模型、硬件和服务方式。自部署要把卡的利用率、显存和内存带宽、并发和空闲成本算进去。使用 API 要考虑输入输出长度、缓存、批处理、速率限制和失败重试。两条路径最终应以同一质量门槛下每个合格结果的总成本比较。视频生成中，保留已经合格的镜头、只重做失败部分，经常同时改善体验和毛利。

- [参考资料 1](https://qwenlm.github.io/blog/qwen3/)
- [参考资料 2](https://arxiv.org/abs/2311.16863)

## 17 · 运营，是经营关系

每一段与客户的对话，都可能包含产品理解的缺口。运营要听懂用户完成什么，记下他遇到了什么，把问题带回团队，交付后主动确认是否真的解决。用户的理解、信任与复购由这些具体经历累积。把对话当作客户关系的一部分，既需要人投入，也需要 Agent 帮助保留上下文与追踪承诺。


## 18 · AI native 组织 · 任务找人

依照用户提供的参考图重绘。任务市场连接交付需求和可组合的能力体，人员可以在不同项目承担不同角色。组织先给出交付标准、算力预算和数据接口，再匹配具有认知弹性、自主学习能力及专业判断的人与 Agent。完成任务后，成果和经验回到组织，下一项需求可以重新组队。人仍需要对结果负责。


## 19 · AI native 个人 · 三种资源对齐

按用户提供的三圆图重绘。时间线性流逝，注意力容易被外部刺激夺走，精力有波动也能恢复。任务应该放在三者能够重合的时段。只有时间和注意力，可能透支精力；有时间和精力而缺乏目标，容易忙而低效；注意力和精力到位却时间碎片化，容易浪费焦点。使用 AI 的价值之一，是把机械执行让出去，为自己留住最适合判断和创造的交集。


## 20 · 人机协作中的审美

根据用户提供的已知/未知与可言传/可意会矩阵重绘。模型可以学习大量可观察的表达，但每个人经历过什么、此刻为何在意某个选择，仍有难以完整编码的部分。这里强调人的亲历和判断，不把 AI 永远无法学习默会知识当成已证实的定律。庄子《外物》以筌、蹄和语言说明手段与意义的关系，讲者可结合自身经历展开。

筌者所以在鱼，得鱼而忘筌；蹄者所以在兔，得兔而忘蹄；言者所以在意，得意而忘言。

- [参考资料 1](https://ctext.org/zhuangzi/what-comes-from-without/zh)

## 21 · 我们离 AGI 还有多远

我的判断是，今天的 Transformer 未必是 AGI 的最终架构，能效将成为架构竞争的主要维度之一。这是研究判断，当前证据不能给出可信的 AGI 倒计时。比较系统时，应固定任务、质量与时限，统计端到端每单位能量交付多少合格结果。AlphaGo Zero 通过自我对弈生成经历，围棋规则提供清晰反馈。开放世界的系统仍需要真实反馈、稀缺失败和难得的纠正。自我改进让数据的来源扩展了，可靠的学习信号仍然重要。

- [参考资料 1](https://arxiv.org/abs/2311.16863)
- [参考资料 2](https://www.nature.com/articles/nature24270)

## 22 · 认清生活的本质，仍然热爱生活

罗曼·罗兰原句的中文意译。馆藏原本《L’Humble Vie héroïque》（1912）印刷页 46 引自《Vie de Michel-Ange》：“Il n’y a qu’un héroïsme au monde : c’est de voir le monde tel qu’il est, — et de l’aimer.” 回到本期的立场，理解周期、成本和自己的局限之后，仍然认真做产品、对待客户、珍惜自己的生活。

- [参考资料 1](https://doi.org/10.3931/e-rara-69089)
