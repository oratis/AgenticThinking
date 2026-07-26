# 结语 · Model over Everything

三个部分讲完了，回到标题。

### 第一层：模型是天花板

Part A 讲的是模型**怎么被造出来**。从 1943 年的一个神经元，到今天 671B 参数、激活 37B 的 MoE。
这条路上每一次跃迁都是同一个动作：**减少人工先验，增加数据与算力**。

工程能做的事是把你推到模型能力的边界，**但推不过去**。所以选模型、评模型、理解模型的能力边界，是产品能力的一部分——不是技术细节。

### 第二层：模型凌驾于一切之上

Part C 讲的是模型**怎么进入产品**。一个看起来只是"选个模型"的组件，实际同时决定了：

- **可用性**（上游改名会不会静默打穿你的付费档）
- **成本结构**（同 tier 内 15× 的成本差）
- **容量上限**（一个扩容救不了的 20 RPM 全局墙）
- **安全面**（用户可编辑内容进 system prompt = 提示注入）
- **产品定位**（最适配的模型被锁在最高档，最不适配的做免费默认）

**Model Router 是基础设施，不是配置项。** 它值得像对待数据库连接池一样对待。

### 第三层：模型覆盖一切模态

Part B 讲的是模型**要去哪**。三条主线——自主 Agent、持续学习、理解物理——看起来分散，但它们在同一个点汇合：

> 一个能在内部**模拟**世界演化、并把模拟与现实的**偏差永久写回自己**的系统。
>
> 也就是：**预测 → 行动 → 惊讶 → 更新**。
>
> 今天的 LLM 只有"预测"，Agent 补上了"行动"，**"惊讶"和"更新"仍然缺失**。

而这两个缺失的环节，本质上是同一个问题：

> **如何在没有标准答案的情况下，知道自己错了。**

B1 的长程可靠性需要它（不然错误会累积）。
B2 的写入门控需要它（不然会学进假知识）。
B3 的 sim2real 需要它（不然仿真里的错误会带到现实）。

甚至 Part C 的 eval 体系也是它的一个工程近似——**L1 硬断言 + L2 judge + 在线指标**，就是在没有标准答案的生产环境里，尽可能便宜地知道"我是不是错了"。

---

### 三条给工程师的实用建议

**1. 花时间理解模型，不只是调用模型。**
知道 MoE 的激活参数意味着什么、知道 decode 是访存密集的、知道 tokenizer 决定了中文成本——这些认知会直接变成更好的架构决策。Model-Research 那种"逐个模型读源码"的笨办法，是我认为回报最高的学习方式。

**2. 假设一切上游都会背叛你。**
模型会改名、会下线、会限流、会返回 200 OK 的垃圾。route 数组、同档降级、退款闭环、目录漂移告警——这些不是过度设计，是**已经发生过的事故的疫苗**。

**3. 先建 eval，再换模型。**
Cuddler 的教训是"知道该做 eval，但发布压力下先发了"。补做的对照报告成本只有 **$0.05**，却发现了一个提示注入漏洞、实锤了 judge 会幻觉、量化了一个未来会变成用户投诉的记忆退化。
**eval 的价值不是给模型打分，是把未来的用户投诉提前变成今天的一个数字。**

---

### 系列脉络

| EP | 主题 | 一句话 |
|---|---|---|
| **EP01** | Human as Foundation | Agent 的目标与评价标准来自人 |
| **EP02** | Tools as Extension | Agent 靠工具触达世界 |
| **EP03** | **Model over Everything** | **模型是天花板；工程决定你离天花板多远** |
| EP04 | Focus on what matters | — |
| EP05 | Build for Future | — |

---

## 附录 A · 术语速查

| 术语 | 全称 / 含义 |
|---|---|
| **Attention / QKV** | 注意力机制；Query 查询 / Key 索引 / Value 内容 |
| **MHA / MQA / GQA** | 多头 / 多查询（共享 KV）/ 分组查询注意力 |
| **MLA** | Multi-head Latent Attention，KV 低秩压缩（DeepSeek） |
| **RoPE / YaRN / LongRoPE** | 旋转位置编码及其长上下文扩展方案 |
| **SwiGLU / RMSNorm** | 现代 LLM 的标准激活与归一化 |
| **MoE / A37B / 共享专家** | 稀疏专家混合；A=激活参数；始终激活的通用专家 |
| **MTP** | Multi-Token Prediction，训练时预测多个未来 token |
| **SSM / Mamba / RWKV** | 状态空间模型 / 选择性 SSM / 可并行训练的 RNN |
| **KV Cache / PagedAttention** | 推理时缓存历史 K/V；用分页管理它 |
| **Prefill / Decode** | 推理的两阶段：算力密集 / 访存密集 |
| **MFU** | Model FLOPs Utilization，算力有效利用率 |
| **6ND** | 训练算力估算公式：6 × 参数 × tokens |
| **DP/TP/PP/EP/CP** | 数据/张量/流水线/专家/上下文并行 |
| **ZeRO / FSDP** | 切分优化器状态与参数的显存优化 |
| **SFT / RLHF / DPO / GRPO / RLVR** | 监督微调 / 人类反馈强化学习 / 直接偏好优化 / 组相对策略优化 / 可验证奖励 |
| **Chinchilla** | 参数与数据的最优配比法则（~20 tokens/参数） |
| **VAE / GAN / Diffusion / DiT** | 变分自编码器 / 生成对抗网络 / 扩散模型 / 扩散 Transformer |
| **CLIP / SigLIP / ViT** | 图文对比学习 / sigmoid 版 / 视觉 Transformer |
| **VLA** | Vision-Language-Action，机器人基础模型 |
| **IDM / LAM** | 逆动力学模型（反推动作）/ 潜在动作模型（无监督学动作） |
| **World Model** | 预测 `s_{t+1} \| s_t, a_t` 的模型 |
| **JEPA** | 在表征空间而非像素空间预测（LeCun 路线） |
| **TTT** | Test-Time Training，推理时做梯度更新 |
| **Nested Learning / Hope** | 多层嵌套优化的持续学习范式 / 其架构实现 |
| **Route / Fallover / Degrade** | 有序候选数组 / 候选间切换 / 整路失败后降档 |
| **GenMeta** | 记录"实际服务者"的生成诊断元数据 |
| **COGS** | Cost of Goods Sold，单位服务成本 |

---

## 附录 B · 参考资料

### 本人仓库

- **[oratis/Model-Research](https://github.com/oratis/Model-Research)** —— 9 个开源大模型的架构剖析 + 源码走读 + 训练机制，含《从零到一：训练你自己的大模型》成本详算
- **[DiogenesModel/Diogenes](https://github.com/DiogenesModel/Diogenes)** —— 玩家模型 / 世界模型的数据线（DataMiner）与训练线（VL / IDM / WM）
- **[oratis/LISA](https://github.com/oratis/LISA)** —— 自主 Agent 实践与 *Learning in Referencing* 持续学习研究

### 论文与关键工作

| 主题 | 参考 |
|---|---|
| Transformer | Attention Is All You Need (1706.03762) |
| Scaling | Kaplan et al. (2001.08361) · Chinchilla (2203.15556) |
| Llama | Llama 3 Herd (2407.21783) |
| DeepSeek | V3 (2412.19437) · R1 (2501.12948) |
| Qwen | Qwen3 (2505.09388) |
| Mistral / Mixtral | (2310.06825) · (2401.04088) |
| Gemma | Gemma 3 (2503.19786) |
| Phi | Textbooks Are All You Need (2306.11644) · Phi-4 (2412.08905) |
| GLM | GLM-4.5 (2508.06471) |
| OLMo | OLMo 2 (2501.00656) |
| MiniMax | MiniMax-01 (2501.08313) · M1 (2506.13585) |
| 状态空间 | Mamba · Mamba-2 (SSD) · Mamba-3 (ICLR 2026) |
| 持续学习 | [Nested Learning (Google Research)](https://research.google/blog/introducing-nested-learning-a-new-ml-paradigm-for-continual-learning/) |
| Agent 时间跨度 | [METR Time Horizon 1.1](https://metr.org/blog/2026-1-29-time-horizon-1-1/) · [Measuring AI Ability to Complete Long Tasks](https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/) |
| VLA / 机器人 | [VLA 架构对比：GR00T / Gemini Robotics / π](https://blog.pebblous.ai/report/vla-architecture-comparison/en/) · π0.7 (2604.15483) · VLA 综述 (2507.01925) |
| 世界模型 | [Genie 3](https://en.wikipedia.org/wiki/Genie_(world_model)) · NVIDIA Cosmos · V-JEPA 2 · VPT · LAPO / LAPA |
| 高效注意力 | Efficient Attention Mechanisms Survey (2507.19595) |

### 工程栈

- **预训练**：Megatron-LM · TorchTitan · nanotron · DeepSpeed · NeMo
- **微调**：LLaMA-Factory · Axolotl · TRL / PEFT · Unsloth
- **对齐**：TRL（DPO/PPO/GRPO）· OpenRLHF · verl
- **推理**：vLLM · SGLang · TensorRT-LLM
- **评测**：lm-evaluation-harness · OpenCompass · lighteval

---

<div align="center">

**Agentic Thinking EP03 · Model over Everything**

分享人 **Oratis** · 2026 年 7 月 28 日 11:00

*模型是天花板；工程决定你离天花板多远。*

</div>
