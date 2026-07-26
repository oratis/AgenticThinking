# Agentic Thinking EP03 · Model over Everything

| | |
|---|---|
| **分享人** | Oratis |
| **时间** | 2026 年 7 月 28 日 11:00 |
| **系列** | Agentic Thinking — EP01《Human as Foundation》· EP02《Tools as Extension》· **EP03《Model over Everything》** |
| **本期主题** | 从 AI 的历史出发，把「模型」这件事从第一性原理讲透；再看业界通向未来的三条主线；最后回到一个真实产品（Cuddler）里，讲 Model Router 到底该怎么设计。 |

---

## 0. 开场：为什么这一期要讲模型

前两期我们讲的是 Agent 的**外围**：

- **EP01 Human as Foundation** —— Agent 的目标、约束、评价标准，最终都来自人。人是地基。
- **EP02 Tools as Extension** —— Agent 靠工具触达世界。工具是手脚。

但地基和手脚之上，有一个东西决定了**这个系统能到多高**：

```
Agent = Model × Context × Tools × Loop
```

这四项里，Context / Tools / Loop 都是**乘数**——它们能把模型的能力放大或者削弱，但**放大不出模型没有的东西**。
一个 3B 的模型给它再好的工具，也做不了需要 14 小时连续推理的任务；一个前沿模型即使工具很烂，也能自己想办法绕过去。

所以本期的标题是 **Model over Everything**，它有三层意思：

1. **模型是天花板（Model over Everything）** —— 上限由模型定，工程只决定你离上限多远。
2. **模型凌驾于一切之上（Model above Everything）** —— 产品里几乎每个功能背后都挂着一次模型调用；模型的选择、路由、成本、容错，是产品的**基础设施**，不是配置项。
3. **模型覆盖一切模态（Model over Everything）** —— 文本、图像、视频、语音、动作、物理世界，都在被同一套范式吞掉。

三个部分：

| 部分 | 内容 | 回答的问题 |
|---|---|---|
| **Part A · 基础** | 从 AI 历史到大模型的全部核心概念 | 模型**是什么**、**怎么造出来的** |
| **Part B · 前沿** | 完全自主的 Agent / 持续学习的 AI / 理解物理的机器人 | 模型**要去哪里** |
| **Part C · 实践** | Cuddler 项目的 Model Router 设计与方法论 | 模型**怎么用在生产里** |

> 素材来源：[oratis/Model-Research](https://github.com/oratis/Model-Research)（9 个开源大模型的架构与训练机制逐一剖析）、[DiogenesModel/Diogenes](https://github.com/DiogenesModel/Diogenes)（玩家模型 / 世界模型数据与训练线）、[oratis/LISA](https://github.com/oratis/LISA)（自主 Agent 与持续学习研究）、以及 Cuddler 生产代码与设计文档。

---
