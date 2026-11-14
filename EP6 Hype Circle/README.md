# EP06 · Hype Circle

**AI 技术周期的趋势**

分享人 Oratis · 2026 年 11 月 18 日（周三）上午 11:00，北京时间

我们正站在期望膨胀的顶点。这一期从 Gartner Hype Cycle 讲起，谈低谷期怎么活下来：坚持改进产品，把毛利当生命线，再到 AI native 的组织和个人。

## 使用

- [演示稿](EP6-Hype-Circle.pptx) 共 25 页（含封面），用 Keynote 或 PowerPoint 直接打开。每一页的文字、线条、曲线和图形都是原生对象，可以逐个选中修改。在 Keynote 里另存一次即得到 `.key` 文件。
- [离线预览](EP6-Hype-Circle.html) 用浏览器打开，左右方向键翻页，N 显示备注，R 切换连续阅读。
- [逐页讲稿](EP6-Hype-Circle.md) 与演示稿的演讲者备注一致，页面上只留关键词，展开的内容都在这里。
- [独立文章](Hype-Circle-article.md) 是上一版演示稿配套的报刊文章，尚未随本版更新。
- [JPG 海报](cover.jpg) 和 [PNG 海报](cover.png)。

字体使用 macOS 自带的 PingFang SC 和 Baskerville。第 1 页的 Gartner Hype Cycle for Agentic AI（2026 年 4 月）是按原图重绘的可编辑版本，原图保存在 [src/deck](src/deck/gartner-agentic-ai-2026.png)。

## 待核实

第 4 页“2027 年全球 AI 推理成本 25 万亿美元，超过美国 GDP”没有找到公开出处，页面上带有“数据待核实”标记，上台前请确认或替换。

## 重新生成

现场微调直接改演示稿即可。需要批量调整时改 [src/deck](src/deck/) 下的源码再构建，演示稿、预览和讲稿由同一份源码生成，构建会覆盖这三个文件。

```sh
cd src && npm install && npm run build
```

- `deck/lib.mjs` 画图基础件，同一份描述同时输出演示稿对象和预览用的 SVG
- `deck/part1.mjs`、`deck/part2.mjs` 每一页的内容、坐标和演讲者备注
- `deck/build.mjs` 构建入口。追加一个目录参数时，会额外输出逐页的 HTML 和单页演示稿，便于截图检查版面

[海报排版](src/poster/cover.html) 的标题、讲者和时间均可编辑。[主视觉](src/poster/hype-circle.png) 为本期生成的插图。
