// Shared design system for the EP3 deck — dark + neon green, matching EP01/EP02 covers.
const C = {
  bg: "08090A",
  bg2: "101315",
  card: "15181B",
  card2: "1B1F22",
  border: "2A2F34",
  accent: "22E06B",
  accentDim: "12994A",
  accentSoft: "0E2418",
  fg: "ECEEF0",
  dim: "9AA0A6",
  faint: "6B7075",
  warn: "FFB020",
  bad: "FF5C5C",
};

const F = { sans: "Arial", mono: "Courier New" };

// ---------------------------------------------------------------------------
// Auto-fit helpers. PowerPoint does not clip overflowing text — it spills past
// the shape — so every text block is measured and shrunk until it fits its box.
// Width model: CJK ≈ 1.0em, Latin ≈ 0.52em, space ≈ 0.28em (Arial-ish).
// ---------------------------------------------------------------------------
function isCJK(ch) {
  const c = ch.codePointAt(0);
  return (
    (c >= 0x3000 && c <= 0x303f) || (c >= 0x3040 && c <= 0x30ff) ||
    (c >= 0x4e00 && c <= 0x9fff) || (c >= 0xff00 && c <= 0xffef) ||
    (c >= 0x3400 && c <= 0x4dbf)
  );
}

function textWidthPt(str, sizePt) {
  let w = 0;
  for (const ch of str) {
    if (isCJK(ch)) w += sizePt;
    else if (ch === " ") w += sizePt * 0.28;
    else w += sizePt * 0.52;
  }
  return w;
}

/** Estimated wrapped line count for `str` in a box `wIn` inches wide. */
function wrapLines(str, wIn, sizePt) {
  const boxPt = Math.max(wIn * 72, 1);
  let n = 0;
  for (const para of String(str).split("\n")) {
    if (!para.trim()) { n += 1; continue; }
    n += Math.max(1, Math.ceil(textWidthPt(para, sizePt) / boxPt));
  }
  return n;
}

/**
 * Largest font size ≤ base at which `str` fits in wIn × hIn.
 * `lsRatio` = line spacing as a multiple of font size; `gapPt` = paraSpaceAfter.
 */
function fitFont(str, wIn, hIn, base, lsRatio = 1.4, nPara = 1, gapPt = 0) {
  const availPt = Math.max(hIn * 72, 4);
  for (let s = base; s >= 6.5; s -= 0.5) {
    const lines = wrapLines(str, wIn, s);
    const need = lines * s * lsRatio + Math.max(0, nPara - 1) * gapPt * (s / base);
    if (need <= availPt) return s;
  }
  return 6.5;
}

/** Same idea for a monospace block: constrain by both longest line and height. */
function fitMono(str, wIn, hIn, base, lsRatio = 1.4) {
  const lines = String(str).split("\n");
  const longest = lines.reduce((m, l) => {
    let w = 0;
    for (const ch of l) w += isCJK(ch) ? 1.67 : 1; // CJK ≈ 1.67 mono cells
    return Math.max(m, w);
  }, 1);
  const availWpt = Math.max(wIn * 72, 4);
  const availHpt = Math.max(hIn * 72, 4);
  for (let s = base; s >= 5.5; s -= 0.25) {
    const wNeed = longest * s * 0.6; // Courier New advance ≈ 0.6em
    const hNeed = lines.length * s * lsRatio;
    if (wNeed <= availWpt && hNeed <= availHpt) return s;
  }
  return 5.5;
}

function setup(pptx, title) {
  pptx.layout = "LAYOUT_WIDE"; // 13.3 x 7.5
  pptx.author = "Oratis";
  pptx.company = "Agentic Thinking";
  pptx.title = title;
  pptx.defineSlideMaster({
    title: "DARK",
    background: { color: C.bg },
  });
}

let COUNT = 0;
function newSlide(pptx) {
  const s = pptx.addSlide({ masterName: "DARK" });
  COUNT++;
  return s;
}
function slideNo(s, part) {
  s.addText(String(COUNT).padStart(2, "0"), {
    x: 12.42, y: 6.92, w: 0.6, h: 0.3, align: "right",
    fontFace: F.sans, fontSize: 9, color: C.faint, margin: 0,
  });
  if (part) {
    s.addText(part, {
      x: 0.6, y: 6.92, w: 5, h: 0.3, align: "left",
      fontFace: F.sans, fontSize: 9, color: C.faint, charSpacing: 1.2, margin: 0,
    });
  }
}

// Standard content slide header. Returns the y where content may start.
function header(s, kicker, title, part) {
  if (kicker) {
    s.addText(kicker, {
      x: 0.6, y: 0.42, w: 12.1, h: 0.26, fontFace: F.sans, fontSize: 10.5,
      color: C.accent, bold: true, charSpacing: 1.6, margin: 0,
    });
  }
  const tSize = fitFont(title, 12.1, 0.72, 27, 1.24, 1, 0);
  s.addText(title, {
    x: 0.6, y: kicker ? 0.72 : 0.5, w: 12.1, h: 0.72,
    fontFace: F.sans, fontSize: tSize, bold: true, color: C.fg, margin: 0, valign: "top",
  });
  slideNo(s, part);
  return kicker ? 1.62 : 1.4;
}

// A card with optional heading + body lines.
function card(s, o) {
  s.addShape("roundRect", {
    x: o.x, y: o.y, w: o.w, h: o.h, rectRadius: 0.09,
    fill: { color: o.fill || C.card },
    line: { color: o.line || C.border, width: 1 },
  });
  let ty = o.y + 0.2;
  if (o.tag) {
    s.addText(o.tag, {
      x: o.x + 0.26, y: ty, w: o.w - 0.5, h: 0.24, fontFace: F.sans, fontSize: 10,
      bold: true, color: o.tagColor || C.accent, charSpacing: 1.1, margin: 0,
    });
    ty += 0.3;
  }
  if (o.title) {
    s.addText(o.title, {
      x: o.x + 0.26, y: ty, w: o.w - 0.5, h: o.titleH || 0.34,
      fontFace: F.sans, fontSize: o.titleSize || 15, bold: true, color: C.fg, margin: 0, valign: "top",
    });
    ty += (o.titleH || 0.34) + 0.06;
  }
  if (o.body) {
    const arr = (Array.isArray(o.body) ? o.body : [o.body]).filter((t) => t !== "");
    const bw = o.w - 0.5;
    const bh = Math.max(o.y + o.h - ty - 0.14, 0.18);
    const base = o.bodySize || 12;
    // Bullets consume ~1.1 em of indent, so measure against a narrower box.
    const effW = o.bullet ? bw - base / 72 : bw;
    const size = fitFont(arr.join("\n"), effW, bh, base, 1.42, arr.length, o.gap || 3);
    s.addText(
      arr.map((t, i) => ({
        text: t, options: { breakLine: i < arr.length - 1, bullet: o.bullet ? { code: "25AA" } : false },
      })),
      {
        x: o.x + 0.26, y: ty, w: bw, h: bh,
        fontFace: F.sans, fontSize: size, color: o.bodyColor || C.dim,
        lineSpacing: Math.round(size * 1.42), paraSpaceAfter: o.gap || 3, margin: 0, valign: "top",
      }
    );
  }
}

// Monospace code / ascii block.
function code(s, o) {
  s.addShape("roundRect", {
    x: o.x, y: o.y, w: o.w, h: o.h, rectRadius: 0.07,
    fill: { color: "0B0E10" }, line: { color: C.border, width: 1 },
  });
  const cw = o.w - 0.36, ch = o.h - 0.28;
  const size = fitMono(o.text, cw, ch, o.size || 10, 1.42);
  s.addText(o.text, {
    x: o.x + 0.18, y: o.y + 0.14, w: cw, h: ch,
    fontFace: F.mono, fontSize: size, color: o.color || "B9C6BE",
    lineSpacing: Math.round(size * 1.42 * 10) / 10, margin: 0, valign: "top",
  });
}

// Simple styled table.
function table(s, o) {
  const head = o.head.map((h) => ({
    text: h,
    options: { bold: true, color: C.fg, fill: { color: C.card2 }, fontSize: o.headSize || 11 },
  }));
  const rows = o.rows.map((r) =>
    r.map((cell, i) => {
      const isObj = typeof cell === "object" && cell !== null;
      const txt = isObj ? cell.t : cell;
      return {
        text: txt,
        options: {
          color: isObj && cell.c ? cell.c : i === 0 ? C.fg : C.dim,
          bold: isObj ? !!cell.b : i === 0 && !!o.boldFirst,
          fontSize: o.size || 10.5,
          fill: { color: C.bg },
        },
      };
    })
  );
  s.addTable([head, ...rows], {
    x: o.x, y: o.y, w: o.w, colW: o.colW,
    fontFace: F.sans, border: { type: "solid", color: C.border, pt: 0.5 },
    align: "left", valign: "middle", rowH: o.rowH || 0.3,
    margin: [3, 7, 3, 7],
  });
}

// Big number callout.
function stat(s, o) {
  s.addText(o.value, {
    x: o.x, y: o.y, w: o.w, h: o.vh || 0.78, align: o.align || "left",
    fontFace: F.sans, fontSize: o.size || 40, bold: true, color: o.color || C.accent, margin: 0, valign: "middle",
  });
  s.addText(o.label, {
    x: o.x, y: o.y + (o.vh || 0.78) - 0.04, w: o.w, h: o.lh || 0.5, align: o.align || "left",
    fontFace: F.sans, fontSize: o.labelSize || 11.5, color: C.dim, margin: 0, valign: "top",
    lineSpacing: 15,
  });
}

// Bullet list with green square markers.
function bullets(s, o) {
  const arr = o.items;
  const base = o.size || 13;
  const plain = arr.map((t) => (typeof t === "object" ? t.t : t));
  const size = fitFont(plain.join("\n"), o.w - base / 72, o.h, base, 1.44, arr.length, o.gap || 7);
  s.addText(
    arr.map((t, i) => {
      const isObj = typeof t === "object";
      return {
        text: isObj ? t.t : t,
        options: {
          breakLine: i < arr.length - 1,
          bullet: { code: "25AA" },
          color: isObj && t.c ? t.c : o.color || C.dim,
          bold: isObj ? !!t.b : false,
        },
      };
    }),
    {
      x: o.x, y: o.y, w: o.w, h: o.h, fontFace: F.sans, fontSize: size,
      lineSpacing: Math.round(size * 1.44), paraSpaceAfter: o.gap || 7, margin: 0, valign: "top",
    }
  );
}

// Quote / key-insight band.
function band(s, o) {
  s.addShape("roundRect", {
    x: o.x, y: o.y, w: o.w, h: o.h, rectRadius: 0.08,
    fill: { color: o.fill || C.accentSoft }, line: { color: o.line || C.accentDim, width: 1 },
  });
  const bw = o.w - 0.6, bh = o.h - 0.2;
  const nP = String(o.text).split("\n").length;
  const size = fitFont(o.text, bw, bh, o.size || 14, 1.46, nP, 0);
  s.addText(o.text, {
    x: o.x + 0.3, y: o.y + 0.1, w: bw, h: bh,
    fontFace: F.sans, fontSize: size, bold: o.bold !== false, color: o.color || C.accent,
    margin: 0, valign: "middle", lineSpacing: Math.round(size * 1.46), align: o.align || "left",
  });
}

// Section divider slide.
function divider(pptx, o) {
  const s = newSlide(pptx);
  s.addShape("rect", { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: "060708" } });
  s.addText(o.num, {
    x: 0.85, y: 1.28, w: 4, h: 2.34, fontFace: F.sans, fontSize: 130, bold: true,
    color: "141A16", margin: 0, valign: "middle",
  });
  s.addText(o.kicker, {
    x: 0.9, y: 2.55, w: 11.5, h: 0.3, fontFace: F.sans, fontSize: 12,
    color: C.accent, bold: true, charSpacing: 2.4, margin: 0,
  });
  s.addText(o.title, {
    x: 0.9, y: 2.95, w: 11.5, h: 1.0, fontFace: F.sans, fontSize: 46, bold: true,
    color: C.fg, margin: 0, valign: "top",
  });
  const subSize = fitFont(o.sub, 10.6, 0.86, 15, 1.46, String(o.sub).split("\n").length, 0);
  s.addText(o.sub, {
    x: 0.9, y: 4.02, w: 10.6, h: 0.86, fontFace: F.sans, fontSize: subSize, color: C.dim,
    margin: 0, valign: "top", lineSpacing: Math.round(subSize * 1.46),
  });
  if (o.items) {
    let x = 0.9;
    o.items.forEach((it) => {
      const w = 3.5;
      s.addShape("roundRect", {
        x, y: 5.0, w, h: 0.95, rectRadius: 0.08,
        fill: { color: C.card }, line: { color: C.border, width: 1 },
      });
      const sz = fitFont(it, w - 0.44, 0.72, 12, 1.42, 1, 0);
      s.addText(it, {
        x: x + 0.22, y: 5.12, w: w - 0.44, h: 0.72, fontFace: F.sans, fontSize: sz,
        color: C.dim, margin: 0, valign: "middle", lineSpacing: Math.round(sz * 1.42),
      });
      x += w + 0.32;
    });
  }
  slideNo(s, o.part);
  return s;
}

module.exports = { C, F, setup, newSlide, header, card, code, table, stat, bullets, band, divider, slideNo,
  fitFont, fitMono, wrapLines, count: () => COUNT };
