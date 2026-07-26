#!/usr/bin/env python3
"""Build the self-contained EP3 HTML 讲义 from the master markdown."""
import re
import sys
import html as _html
from pathlib import Path

import markdown
from markdown.extensions.toc import TocExtension

SRC = Path(sys.argv[1])
OUT = Path(sys.argv[2])

text = SRC.read_text(encoding="utf-8")

# Strip the trailing centered HTML block's div wrapper issues (markdown handles raw html fine)
md = markdown.Markdown(
    extensions=[
        "extra",          # tables, fenced_code, attr_list, footnotes, def_list
        "sane_lists",
        "admonition",
        TocExtension(toc_depth="2-3", permalink="¶", anchorlink=False),
        "codehilite",
    ],
    extension_configs={
        "codehilite": {"guess_lang": False, "noclasses": False, "pygments_style": "monokai"},
    },
)
body = md.convert(text)
toc_html = md.toc

from pygments.formatters import HtmlFormatter
pyg_css = HtmlFormatter(style="monokai").get_style_defs(".codehilite")

# --- Post-process: wrap top-level <h1> sections so we can style part dividers ---
# Tag each h2 with a data-part attribute derived from the preceding h1 (best effort, cosmetic only).

CSS = """
*,*::before,*::after{box-sizing:border-box}
:root{
  --bg:#08090a; --bg-soft:#0f1113; --bg-card:#121517; --fg:#e8eaed; --fg-dim:#9aa0a6;
  --fg-faint:#6b7075; --accent:#22e06b; --accent-dim:#149c48; --accent-soft:rgba(34,224,107,.11);
  --border:#23272b; --border-soft:#1a1d20; --code-bg:#0d1013; --shadow:0 1px 3px rgba(0,0,0,.5);
  --sans:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",Roboto,"Helvetica Neue",Arial,sans-serif;
  --mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,"Liberation Mono",monospace;
  --maxw:920px;
}
@media (prefers-color-scheme: light){
  :root{
    --bg:#fbfbfa; --bg-soft:#f4f5f4; --bg-card:#fff; --fg:#16181a; --fg-dim:#5b6166;
    --fg-faint:#868c92; --accent:#0a8f3c; --accent-dim:#0a8f3c; --accent-soft:rgba(10,143,60,.09);
    --border:#e2e5e7; --border-soft:#edeff0; --code-bg:#f6f7f8; --shadow:0 1px 2px rgba(0,0,0,.06);
  }
}
:root[data-theme="dark"]{
  --bg:#08090a; --bg-soft:#0f1113; --bg-card:#121517; --fg:#e8eaed; --fg-dim:#9aa0a6;
  --fg-faint:#6b7075; --accent:#22e06b; --accent-dim:#149c48; --accent-soft:rgba(34,224,107,.11);
  --border:#23272b; --border-soft:#1a1d20; --code-bg:#0d1013; --shadow:0 1px 3px rgba(0,0,0,.5);
}
:root[data-theme="light"]{
  --bg:#fbfbfa; --bg-soft:#f4f5f4; --bg-card:#fff; --fg:#16181a; --fg-dim:#5b6166;
  --fg-faint:#868c92; --accent:#0a8f3c; --accent-dim:#0a8f3c; --accent-soft:rgba(10,143,60,.09);
  --border:#e2e5e7; --border-soft:#edeff0; --code-bg:#f6f7f8; --shadow:0 1px 2px rgba(0,0,0,.06);
}
html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--fg);font-family:var(--sans);
  font-size:16px;line-height:1.75;-webkit-font-smoothing:antialiased;
  font-feature-settings:"tnum" 0}

/* ---------- layout ---------- */
.shell{display:grid;grid-template-columns:288px minmax(0,1fr);gap:0;max-width:1360px;margin:0 auto}
.sidebar{position:sticky;top:0;height:100vh;overflow-y:auto;overscroll-behavior:contain;
  border-right:1px solid var(--border-soft);padding:26px 18px 60px 24px;background:var(--bg)}
.sidebar::-webkit-scrollbar{width:7px}
.sidebar::-webkit-scrollbar-thumb{background:var(--border);border-radius:4px}
main{min-width:0;padding:56px 44px 140px;max-width:var(--maxw)}

/* ---------- masthead ---------- */
.brand{display:block;text-decoration:none;color:inherit;margin-bottom:22px}
.brand .kicker{font-size:10.5px;letter-spacing:.19em;text-transform:uppercase;color:var(--fg-faint);font-weight:700}
.brand .ttl{font-size:16px;font-weight:800;letter-spacing:-.01em;margin-top:5px;line-height:1.3}
.brand .ttl em{font-style:normal;color:var(--accent)}
.pill{display:inline-block;background:var(--accent);color:#04120a;font-weight:800;font-size:10px;
  letter-spacing:.09em;padding:2px 8px;border-radius:999px;vertical-align:2px;margin-left:6px}
:root[data-theme="light"] .pill,@media(prefers-color-scheme:light){.pill{color:#fff}}

/* ---------- toc ---------- */
.toc-label{font-size:10px;letter-spacing:.17em;text-transform:uppercase;color:var(--fg-faint);
  font-weight:700;margin:0 0 8px;padding-top:14px;border-top:1px solid var(--border-soft)}
.toc ul{list-style:none;margin:0;padding:0}
.toc>ul>li{margin:0}
.toc a{display:block;text-decoration:none;color:var(--fg-dim);font-size:13.5px;line-height:1.45;
  padding:5px 10px;border-radius:6px;border-left:2px solid transparent;transition:.13s}
.toc a:hover{color:var(--fg);background:var(--bg-soft)}
.toc a.active{color:var(--accent);border-left-color:var(--accent);background:var(--accent-soft);font-weight:600}
.toc>ul>li>a{font-weight:650;color:var(--fg);font-size:13.5px;margin-top:9px}
.toc ul ul a{padding-left:20px;font-size:12.5px;color:var(--fg-faint)}
.toc ul ul ul{display:none}

/* ---------- typography ---------- */
h1,h2,h3,h4{line-height:1.28;letter-spacing:-.015em;scroll-margin-top:26px}
h1{font-size:clamp(28px,4.4vw,40px);font-weight:850;margin:0 0 26px;padding-bottom:16px;
  border-bottom:2px solid var(--accent)}
main>h1:not(:first-child){margin-top:88px}
h2{font-size:26px;font-weight:800;margin:60px 0 18px;padding-top:8px}
h3{font-size:19px;font-weight:750;margin:38px 0 12px;color:var(--fg)}
h4{font-size:16px;font-weight:700;margin:26px 0 9px;color:var(--fg-dim)}
h2 .headerlink,h3 .headerlink,h1 .headerlink{opacity:0;color:var(--accent);text-decoration:none;
  font-size:.6em;margin-left:.4em;transition:.15s}
h1:hover .headerlink,h2:hover .headerlink,h3:hover .headerlink{opacity:.55}
p{margin:0 0 16px}
a{color:var(--accent);text-decoration:none;border-bottom:1px solid color-mix(in srgb,var(--accent) 35%,transparent)}
a:hover{border-bottom-color:var(--accent)}
strong{font-weight:700;color:var(--fg)}
em{color:var(--fg-dim)}
ul,ol{margin:0 0 16px;padding-left:24px}
li{margin:5px 0}
li>ul,li>ol{margin:5px 0}
hr{border:0;border-top:1px solid var(--border);margin:52px 0}

/* ---------- blockquote ---------- */
blockquote{margin:22px 0;padding:14px 20px;background:var(--accent-soft);
  border-left:3px solid var(--accent);border-radius:0 8px 8px 0;color:var(--fg)}
blockquote p:last-child{margin-bottom:0}
blockquote>p:first-child{margin-top:0}

/* ---------- code ---------- */
code{font-family:var(--mono);font-size:.855em;background:var(--code-bg);
  padding:.14em .42em;border-radius:4px;border:1px solid var(--border-soft);
  word-break:break-word}
pre{background:var(--code-bg);border:1px solid var(--border);border-radius:10px;
  padding:16px 18px;overflow-x:auto;margin:20px 0;font-size:13px;line-height:1.6;
  box-shadow:var(--shadow)}
pre code{background:none;border:0;padding:0;font-size:inherit;white-space:pre}
.codehilite{background:var(--code-bg);border:1px solid var(--border);border-radius:10px;
  margin:20px 0;overflow-x:auto;box-shadow:var(--shadow)}
.codehilite pre{margin:0;border:0;box-shadow:none;background:none}
:root[data-theme="light"] .codehilite,:root[data-theme="light"] pre{background:#f6f7f8}

/* ---------- tables ---------- */
.tbl-wrap{overflow-x:auto;margin:22px 0;border:1px solid var(--border);border-radius:10px;
  box-shadow:var(--shadow);background:var(--bg-card)}
table{border-collapse:collapse;width:100%;font-size:13.8px;line-height:1.55}
th,td{padding:9px 13px;text-align:left;border-bottom:1px solid var(--border-soft);vertical-align:top}
thead th{background:var(--bg-soft);font-weight:700;font-size:12.5px;letter-spacing:.01em;
  color:var(--fg);border-bottom:1px solid var(--border);white-space:nowrap}
tbody tr:last-child td{border-bottom:0}
tbody tr:hover{background:var(--accent-soft)}
td code{font-size:.9em;white-space:nowrap}

/* ---------- meta header ---------- */
.doc-meta{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 34px}
.doc-meta span{font-size:12px;padding:4px 11px;border-radius:999px;border:1px solid var(--border);
  color:var(--fg-dim);background:var(--bg-soft)}
.doc-meta span.hi{border-color:var(--accent);color:var(--accent);background:var(--accent-soft);font-weight:600}

/* ---------- controls ---------- */
.controls{position:fixed;top:16px;right:18px;display:flex;gap:7px;z-index:50}
.controls button{font:inherit;font-size:12px;font-weight:600;padding:6px 12px;border-radius:8px;
  border:1px solid var(--border);background:var(--bg-card);color:var(--fg-dim);cursor:pointer;
  box-shadow:var(--shadow);transition:.14s}
.controls button:hover{color:var(--accent);border-color:var(--accent)}
.progress{position:fixed;top:0;left:0;height:2px;background:var(--accent);width:0;z-index:60;transition:width .1s}
.menu-btn{display:none}

/* ---------- responsive ---------- */
@media (max-width:1080px){
  .shell{grid-template-columns:1fr}
  .sidebar{position:fixed;left:0;top:0;width:290px;z-index:40;transform:translateX(-100%);
    transition:transform .22s;background:var(--bg);box-shadow:0 0 40px rgba(0,0,0,.4)}
  .sidebar.open{transform:none}
  main{padding:66px 22px 120px;max-width:none}
  .menu-btn{display:block}
  h1{font-size:26px} h2{font-size:22px} h3{font-size:17.5px}
  body{font-size:15.5px}
}
@media (max-width:520px){
  main{padding:62px 15px 100px}
  th,td{padding:7px 9px;font-size:12.8px}
  pre,.codehilite{font-size:11.6px}
}

/* ---------- print ---------- */
@media print{
  :root{--bg:#fff;--fg:#000;--fg-dim:#333;--border:#ccc;--border-soft:#e5e5e5;
    --bg-soft:#f7f7f7;--bg-card:#fff;--code-bg:#f7f7f7;--accent:#0a7a34;--accent-soft:#f0faf3}
  .sidebar,.controls,.progress{display:none}
  .shell{display:block;max-width:none}
  main{padding:0;max-width:none}
  h1{page-break-before:always}
  main>h1:first-child{page-break-before:avoid}
  h2,h3{page-break-after:avoid}
  pre,table,blockquote{page-break-inside:avoid}
  a{color:#000;border:0}
  body{font-size:10.5pt;line-height:1.55}
}
"""

JS = """
(function(){
  var root=document.documentElement;
  var saved=localStorage.getItem('ep3-theme');
  if(saved) root.setAttribute('data-theme',saved);
  function currentTheme(){
    return root.getAttribute('data-theme')
      || (matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
  }
  document.getElementById('theme-btn').addEventListener('click',function(){
    var next=currentTheme()==='dark'?'light':'dark';
    root.setAttribute('data-theme',next);
    localStorage.setItem('ep3-theme',next);
    this.textContent=next==='dark'?'☀ 亮色':'☾ 暗色';
  });
  document.getElementById('theme-btn').textContent=currentTheme()==='dark'?'☀ 亮色':'☾ 暗色';

  var sb=document.querySelector('.sidebar');
  var mb=document.getElementById('menu-btn');
  mb.addEventListener('click',function(){sb.classList.toggle('open')});
  document.querySelectorAll('.toc a').forEach(function(a){
    a.addEventListener('click',function(){if(innerWidth<=1080)sb.classList.remove('open')});
  });

  // scroll progress
  var bar=document.querySelector('.progress');
  // scroll spy
  var links={},heads=[];
  document.querySelectorAll('.toc a').forEach(function(a){
    var id=decodeURIComponent(a.getAttribute('href').slice(1));
    var el=document.getElementById(id);
    if(el){links[id]=a;heads.push(el);}
  });
  var ticking=false;
  function onScroll(){
    if(ticking)return; ticking=true;
    requestAnimationFrame(function(){
      var h=document.documentElement;
      bar.style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+'%';
      var cur=null;
      for(var i=0;i<heads.length;i++){
        if(heads[i].getBoundingClientRect().top<=120) cur=heads[i]; else break;
      }
      for(var k in links) links[k].classList.remove('active');
      if(cur&&links[cur.id]){
        var a=links[cur.id]; a.classList.add('active');
        var r=a.getBoundingClientRect(), sr=sb.getBoundingClientRect();
        if(r.top<sr.top+40||r.bottom>sr.bottom-40) a.scrollIntoView({block:'center'});
      }
      ticking=false;
    });
  }
  addEventListener('scroll',onScroll,{passive:true}); onScroll();
})();
"""


def wrap_tables(h: str) -> str:
    return re.sub(r"<table>", '<div class="tbl-wrap"><table>', h).replace("</table>", "</table></div>")


body = wrap_tables(body)

meta = (
    '<div class="doc-meta">'
    '<span class="hi">分享人 Oratis</span>'
    "<span>2026-07-28 11:00</span>"
    "<span>Agentic Thinking EP03</span>"
    "<span>全文 ~5.5 万字</span>"
    "</div>"
)

# insert meta right after the first </h1>
body = body.replace("</h1>", "</h1>\n" + meta, 1)

doc = f"""<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Model over Everything · Agentic Thinking EP03</title>
<meta name="description" content="从 AI 历史到大模型全部核心概念、三大未来主线、以及 Cuddler 项目的 Model Router 设计方法论。分享人 Oratis。">
<style>{pyg_css}</style>
<style>{CSS}</style>
</head>
<body>
<div class="progress"></div>
<div class="controls">
  <button id="menu-btn" class="menu-btn">☰ 目录</button>
  <button id="theme-btn">☾ 暗色</button>
  <button onclick="window.print()">⎙ 打印</button>
</div>
<div class="shell">
<aside class="sidebar">
  <a class="brand" href="#top">
    <div class="kicker">Agentic Thinking</div>
    <div class="ttl">Model over <em>Everything</em><span class="pill">EP03</span></div>
  </a>
  <div class="toc-label">目录</div>
  <nav class="toc">{toc_html}</nav>
</aside>
<main id="top">
{body}
</main>
</div>
<script>{JS}</script>
</body>
</html>
"""

OUT.write_text(doc, encoding="utf-8")
print(f"wrote {OUT} ({len(doc):,} bytes)")
