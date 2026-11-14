# EP06 · Hype Circle

**AI 技术周期的趋势**

分享人 Oratis · 2026 年 11 月 18 日（周三）上午 11:00，北京时间

热度退去之后，用户为什么还会回来？用 Gartner Hype Cycle 理解市场预期，用毛利检验每次交付，再用陪伴和内容两个场景讨论应用团队可以积累什么。

[离线演示讲义](EP6-Hype-Circle.html) · [逐页讲稿与来源](EP6-Hype-Circle.md) · [JPG 海报](cover.jpg) · [PNG 海报](cover.png)

桌面用方向键翻页，按 N 打开当前页讲稿，按 R 切换连续阅读。手机默认连续阅读，可展开每页的讲稿与来源。浏览器打印按 11 页演示版排版。

## 修改与构建

修改 [Markdown 讲稿](EP6-Hype-Circle.md) 后，从本目录运行以下命令重新生成单文件 HTML。需要 Node.js 和 marked。已有依赖目录时，也可用环境变量 `ARTIFACT_NODE_MODULES` 指向其 node_modules。

```sh
npm install --no-save marked
node src/build.mjs
```

[海报排版](src/poster/cover.html) 中的标题、讲者和时间均可编辑。[主视觉](src/poster/hype-circle.png) 为本期生成的插图。在浏览器用 1440 × 2560 视口、设备像素比 1 截取排版页，即可导出原尺寸海报。
