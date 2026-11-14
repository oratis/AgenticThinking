# EP06 · Hype Circle

**AI 技术周期的趋势**

分享人 Oratis · 2026 年 11 月 18 日（周三）上午 11:00，北京时间

用曲线、循环、架构与对照图展开现场讲述。从预期高峰谈到产品和毛利，再讨论陪伴、内容、AI 原生组织与个人的选择。

## 使用

- [Keynote 演示稿](EP6-Hype-Circle.key) 可直接打开并手动修改文字、线条和图形。
- [离线预览](EP6-Hype-Circle.html) 支持左右方向键翻页、N 打开讲稿、R 切换连续阅读。手机默认连续阅读，浏览器打印为 22 页。
- [逐页讲稿与来源](EP6-Hype-Circle.md) 与演示稿的演讲者备注对应。
- [独立文章](Hype-Circle-article.md) 已按报刊文章组织成文，引用来源附在相关段落末尾。
- [JPG 海报](cover.jpg) 和 [PNG 海报](cover.png) 标注 11 月 18 日上午 11:00，北京时间。

提纲中的两处重复页码按完整内容顺序展开，演示稿共 22 页。第一页使用用户指定的 Gartner 2026 年 4 月 Agentic AI Hype Cycle 完整图，重点标注可编辑。其余页面的文字与示意图使用可编辑对象绘制。资料出处和需要口头展开的内容放在演讲者备注中。

## 编辑与构建

现场微调直接编辑 Keynote 文件。需要重新生成全套文件时，编辑 [演示源文件](src/keynote/deck.mjs)，其中保存页面内容、图形位置、讲稿及来源。逐页 Markdown 讲稿由该源文件生成，构建会覆盖讲稿文件。独立文章单独维护。

构建需要 Node.js、`@oai/artifact-tool`、`sharp`，原生导出需要 macOS、Keynote Creator Studio 和 `pdftoppm`。使用经典 Keynote 时设置 `KEYNOTE_APP=Keynote`。可通过 `ARTIFACT_NODE_MODULES` 指定已有依赖的 `node_modules` 目录。从本目录运行以下命令，所有步骤使用同一个构建目录。

```sh
node src/build.mjs /private/tmp/ep6-keynote-build
node src/keynote/export-keynote.mjs /private/tmp/ep6-keynote-build
node src/keynote/preview.mjs /private/tmp/ep6-keynote-build
```

第一步生成中间 PPTX、初步渲染和逐页讲稿。第二步默认读取构建目录内的 `candidate.pptx`，也可传入第二个参数指定已验证的 PPTX 路径。该步骤生成原生 Keynote 文件，并用 Keynote 渲染更新构建目录内的页面图片。第三步将这些页面图片及讲稿嵌入单文件 HTML，供离线预览。

[海报排版](src/poster/cover.html) 的标题、讲者和时间均可编辑。[主视觉](src/poster/hype-circle.png) 为本期生成的插图。按 1440 × 2560 视口、设备像素比 1 渲染排版页，可导出原尺寸海报。
