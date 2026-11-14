# Agentic Thinking

> 一个关于 **AI Agent 工程实践** 的分享系列。每一期都从第一性原理出发，配一个真实项目的案例。
>
> 分享人：**Oratis** · 直播：Feishu / 飞书

---

## 系列

| # | 主题 | 一句话 | 时间 | 状态 |
|---|---|---|---|---|
| **EP01** | [Human as Foundation](EP1%20Human%20as%20Foundation/) | Agent 的目标、约束、评价标准最终都来自人 —— 人是地基 | 2026.05.08 | ✅ |
| **EP02** | [Tools as Extension](EP2%20Tools%20as%20Extension/) | Agent 靠工具触达世界 —— 工具是手脚 | 2026.05.21 | ✅ |
| **EP03** | [**Model over Everything**](EP3%20Model%20over%20Everything/) | **模型是天花板；工程决定你离天花板多远** | **2026.07.28 11:00** | 📦 讲义已就绪 |
| EP04 | Focus on what matters | — | — | 🕓 |
| EP05 | Build for Future | — | — | 🕓 |
| **EP06** | [**Hype Circle**](EP6%20Hype%20Circle/) | AI 技术周期的趋势：热度退去之后，用户为什么还会回来？ | **2026.11.18 11:00 北京时间** | 📦 Keynote / 文章 / 海报 |

---

## EP06 · Hype Circle

<img src="EP6%20Hype%20Circle/cover.jpg" width="260" align="right" alt="Hype Circle 第六期分享海报">

**AI 技术周期的趋势** · Oratis · 2026 年 11 月 18 日（周三）上午 11:00，北京时间。

从 ChatGPT 时刻和 Gartner Hype Cycle 出发，讨论开放模型如何压缩创新时间差，应用如何积累上下文与工具，以及产品、毛利和 AI native 组织如何一起改进。全套 22 页以图形表达为主，详细解释和来源保存在演讲者备注。

[下载可编辑 Keynote](EP6%20Hype%20Circle/EP6-Hype-Circle.key) · [22 页离线预览](EP6%20Hype%20Circle/EP6-Hype-Circle.html) · [报刊文章](EP6%20Hype%20Circle/Hype-Circle-article.md) · [逐页讲稿与来源](EP6%20Hype%20Circle/EP6-Hype-Circle.md) · [分享海报](EP6%20Hype%20Circle/cover.jpg)

<br clear="right"/>

---

## EP03 · Model over Everything

<img src="EP3%20Model%20over%20Everything/cover.jpg" width="300" align="right" alt="EP03 海报">

本期把「模型」这件事从第一性原理讲透，分三部分：

**Part A · 基础** —— 从 AI 的七十年历史出发，覆盖大模型的全部核心概念：
神经网络 / RNN / LSTM / CNN 与归纳偏置 → Transformer 与 Attention →
现代配方（RMSNorm · RoPE · SwiGLU · GQA · MLA）→ 线性注意力与 RWKV / Mamba / 混合架构 →
MoE 与 DeepSeek 的集大成 → 训练全流程（数据 / 预训练 / SFT / RLHF / DPO / GRPO / RLVR）→
训练卡、显存、带宽、并行、6ND 成本公式、推理优化与内存墙 →
VAE / GAN / Diffusion / DiT → 多模态与全模态 → 世界模型 → 评测与对齐。

**Part B · 前沿** —— 业界通向未来的三条主线：
完全自主的 Agent（METR 时间跨度、Context Engineering、可靠性 p^n）·
持续学习的 AI（灾难性遗忘、Nested Learning / Hope、门控信号的空白）·
理解物理的机器人（VLA、IDM / LAM、世界模型当仿真器）。

**Part C · 实践** —— 以 **Cuddler** 项目的 Model Router 为案例，讲一个真实的
路由 / 韧性 / 计费 / 容量 / 可观测 系统怎么设计，附 **13 条可复用的设计原则**。

### 交付物

| 文件 | 说明 |
|---|---|
| [`EP3-Model-over-Everything.md`](EP3%20Model%20over%20Everything/EP3-Model-over-Everything.md) | 整体讲义（Markdown，约 5.5 万字） |
| [`EP3-Model-over-Everything.html`](EP3%20Model%20over%20Everything/EP3-Model-over-Everything.html) | 单文件 HTML 讲义（侧边目录 / 明暗主题 / 可打印） |
| [`EP3-Model-over-Everything.pptx`](EP3%20Model%20over%20Everything/EP3-Model-over-Everything.pptx) | 演示文稿（72 页，含演讲者备注） |
| [`cover.jpg`](EP3%20Model%20over%20Everything/cover.jpg) | 海报（1440×2560） |
| [`src/`](EP3%20Model%20over%20Everything/src/) | 全部构建源码：讲义分章 Markdown、PPT 生成脚本、海报 HTML |

<br clear="right"/>

---

## 构建

讲义的三种形态都由源文件生成，可复现。

```bash
# 1. 拼装整体 Markdown
cat "EP3 Model over Everything"/src/parts/*.md > "EP3 Model over Everything/EP3-Model-over-Everything.md"
```

```bash
# 2. 生成 HTML 讲义（需 python3 + markdown + pygments）
python3 tools/build_html.py "EP3 Model over Everything/EP3-Model-over-Everything.md" "EP3 Model over Everything/EP3-Model-over-Everything.html"
```

```bash
# 3. 生成 PPT（需 node + pptxgenjs）
cd "EP3 Model over Everything/src/deck" && npm install && node build.js ../../EP3-Model-over-Everything.pptx
```

```bash
# 4. 渲染海报（需 Chrome）
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --hide-scrollbars --window-size=1440,2560 --screenshot=cover.png "file://$PWD/EP3 Model over Everything/src/poster/cover.html"
```

```bash
# 5. PPT 版面自检（越界 + 文字溢出）
python3 tools/deck_qa.py "EP3 Model over Everything/EP3-Model-over-Everything.pptx"
```

> `tools/deck_qa.py` 会检查每个形状是否越出画布、以及每段文字在其文本框内是否会溢出
> （PowerPoint 不会裁剪溢出文字，它会直接画到框外）。构建脚本内置了自动缩字，
> 正常情况下应输出 `problems: 0`。

---

## 相关仓库

| 仓库 | 内容 |
|---|---|
| [oratis/Model-Research](https://github.com/oratis/Model-Research) | 9 个开源大模型的架构剖析 + 源码走读 + 训练机制，含《从零到一：训练你自己的大模型》成本详算 |
| [DiogenesModel/Diogenes](https://github.com/DiogenesModel/Diogenes) | 玩家模型 / 世界模型的数据线（DataMiner）与训练线（VL / IDM / WM） |
| [oratis/LISA](https://github.com/oratis/LISA) | 自主 Agent 实践与 *Learning in Referencing* 持续学习研究 |

---

## 说明

- 讲义中的 benchmark 数字多为厂商**自报**，设置不一，**不能直接横向排名**。
- 成本估算为**规划级**（GPU 租赁价随厂商 / 地区 / 承诺用量浮动 3–5 倍），用于判断量级，非报价。
- Part C 的代码引用来自生产仓库，数字来自实际审计与 eval；引用时请注意快照时间。

## 许可

[MIT](LICENSE) © Oratis
