// Drawing primitives for the EP06 deck.
// Every slide is authored once on a 1920 × 1080 canvas and rendered twice:
// as native, editable PowerPoint/Keynote objects, and as SVG for the offline preview.

export const W = 1920, H = 1080;
const IN = 144;               // canvas px per inch (13.333in × 7.5in slide)
const PT = 0.5;               // canvas px → pt

export const C = {
  bg: '0B0B0E', ink: 'F5F5F7', dim: 'A1A1AA', mute: '63636E', line: '2E2E36',
  panel: '16161B', panel2: '22222A', hot: 'FF6A3D', cool: '3DDBA5',
};
export const FONT = 'PingFang SC';
export const SERIF = 'Baskerville';
const METRICS = { [FONT]: [1.06, 0.34], [SERIF]: [0.9, 0.25] };

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const n = (v) => Math.round(v * 100) / 100;

/** Rough text width in canvas px, used to size text boxes generously. */
export function measure(str, size, bold = false) {
  let em = 0;
  for (const ch of str) {
    const code = ch.codePointAt(0);
    if (code >= 0x2e80) em += 1;
    else if (ch === ' ') em += 0.28;
    else if (/[A-Z]/.test(ch)) em += 0.68;
    else if (/[0-9]/.test(ch)) em += 0.62;
    else if (/[a-z]/.test(ch)) em += 0.55;
    else em += 0.4;
  }
  return em * size * (bold ? 1.05 : 1);
}

export class Slide {
  constructor(notes = '') { this.items = []; this.notes = notes; this.bg = C.bg; }

  rect(x, y, w, h, o = {}) { this.items.push({ k: 'rect', x, y, w, h, ...o }); return this; }
  ellipse(cx, cy, rx, ry, o = {}) { this.items.push({ k: 'ellipse', cx, cy, rx, ry: ry ?? rx, ...o }); return this; }
  circle(cx, cy, r, o = {}) { return this.ellipse(cx, cy, r, r, o); }
  line(x1, y1, x2, y2, o = {}) { this.items.push({ k: 'line', x1, y1, x2, y2, ...o }); return this; }
  /** segs: ['M',x,y] ['L',x,y] ['C',x1,y1,x2,y2,x,y] ['Z'] in canvas px. */
  path(segs, o = {}) { this.items.push({ k: 'path', segs, ...o }); return this; }
  /**
   * Text anchored at (x, y): x follows `align` (l/c/r), y is the vertical middle of the block.
   * content: string (use \n for lines) or runs [{ t, color, bold, size, italic }].
   */
  text(content, x, y, o = {}) {
    const runs = typeof content === 'string' ? [{ t: content }] : content;
    this.items.push({ k: 'text', runs, x, y, size: 32, color: C.ink, align: 'l', font: FONT, lh: 1, ...o });
    return this;
  }
  image(file, x, y, w, h) { this.items.push({ k: 'image', file, x, y, w, h }); return this; }
}

/* ---------- geometry helpers ---------- */

export const bez = (p0, p1, p2, p3, t) => {
  const u = 1 - t;
  return [0, 1].map((i) => u * u * u * p0[i] + 3 * u * u * t * p1[i] + 3 * u * t * t * p2[i] + t * t * t * p3[i]);
};

const rad = (d) => (d * Math.PI) / 180;
export const polar = (cx, cy, r, deg) => [cx + r * Math.cos(rad(deg)), cy + r * Math.sin(rad(deg))];

/** Circular arc as cubic segments. Angles in degrees, clockwise on screen, 0 = east. */
export function arcSegs(cx, cy, r, a0, a1) {
  const segs = [['M', ...polar(cx, cy, r, a0)]];
  const steps = Math.max(1, Math.ceil(Math.abs(a1 - a0) / 60));
  const d = (a1 - a0) / steps;
  const k = (4 / 3) * Math.tan(rad(d) / 4) * r;
  for (let i = 0; i < steps; i++) {
    const s = a0 + i * d, e = s + d;
    const [sx, sy] = polar(cx, cy, r, s), [ex, ey] = polar(cx, cy, r, e);
    segs.push(['C', sx - k * Math.sin(rad(s)), sy + k * Math.cos(rad(s)), ex + k * Math.sin(rad(e)), ey - k * Math.cos(rad(e)), ex, ey]);
  }
  return segs;
}

/** Filled arrowhead with its tip at (x, y), pointing along `deg`. */
export function head(slide, x, y, deg, color, size = 22) {
  const [bx, by] = polar(x, y, -size, deg);
  const nx = -Math.sin(rad(deg)) * size * 0.5, ny = Math.cos(rad(deg)) * size * 0.5;
  slide.path([['M', x, y], ['L', bx + nx, by + ny], ['L', bx - nx, by - ny], ['Z']], { fill: color });
}

/** Arc with an arrowhead at its end. */
export function arcArrow(slide, cx, cy, r, a0, a1, o = {}) {
  const size = o.head ?? 22;
  const trim = ((size * 0.8) / r) * (180 / Math.PI) * Math.sign(a1 - a0);
  slide.path(arcSegs(cx, cy, r, a0, a1 - trim), { stroke: o.stroke ?? C.ink, sw: o.sw ?? 4, dash: o.dash, alpha: o.alpha });
  head(slide, ...polar(cx, cy, r, a1), a1 + (a1 > a0 ? 90 : -90) - trim / 2, o.stroke ?? C.ink, size);
}

/** Soft halo behind a focal dot. */
export function glow(slide, x, y, r, color) {
  slide.circle(x, y, r * 3.2, { fill: color, fillAlpha: 0.07 });
  slide.circle(x, y, r * 2.1, { fill: color, fillAlpha: 0.14 });
  slide.circle(x, y, r, { fill: color });
}

/** Rounded label. Returns its width. */
export function chip(slide, label, cx, cy, o = {}) {
  const size = o.size ?? 26, w = o.w ?? measure(label, size, o.bold) + size * 1.6, h = o.h ?? size * 2.1;
  slide.rect(cx - w / 2, cy - h / 2, w, h, { fill: o.fill, fillAlpha: o.fillAlpha, stroke: o.stroke, sw: o.sw ?? 2, dash: o.dash, r: o.r ?? h / 2 });
  slide.text(label, cx, cy, { size, color: o.color ?? C.ink, bold: o.bold, align: 'c' });
  return w;
}

/**
 * The hype-cycle curve fitted to a box. Returns path segments and a sampler:
 * at(stage, t) with stage 0 = rise, 1 = fall, 2 = recovery.
 */
export function hype(x, y, w, h) {
  const p = ([u, v]) => [x + u * w, y + (1 - v) * h];
  const parts = [
    [[0, 0.02], [0.13, 0.06], [0.2, 1], [0.27, 1]],
    [[0.27, 1], [0.35, 1], [0.37, 0.12], [0.48, 0.12]],
    [[0.48, 0.12], [0.62, 0.12], [0.7, 0.56], [1, 0.57]],
  ].map((q) => q.map(p));
  const segs = [['M', ...parts[0][0]], ...parts.map((q) => ['C', ...q[1], ...q[2], ...q[3]])];
  return { segs, parts, at: (stage, t) => bez(...parts[stage], t), part: (i) => [['M', ...parts[i][0]], ['C', ...parts[i][1], ...parts[i][2], ...parts[i][3]]] };
}

/* ---------- SVG renderer ---------- */

const dashArray = (dash, sw) => (dash === 'dot' ? `${sw} ${sw * 2.2}` : dash ? `${sw * 4} ${sw * 3}` : null);

function paint(o) {
  let s = o.fill ? ` fill="#${o.fill}"` : ' fill="none"';
  if (o.fill && o.fillAlpha != null) s += ` fill-opacity="${o.fillAlpha}"`;
  if (o.stroke) {
    const sw = o.sw ?? 2;
    s += ` stroke="#${o.stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"`;
    if (o.alpha != null) s += ` stroke-opacity="${o.alpha}"`;
    const d = dashArray(o.dash, sw);
    if (d) s += ` stroke-dasharray="${d}"`;
  }
  return s;
}

const pathD = (segs) => segs.map((s) => (s[0] === 'Z' ? 'Z' : s[0] + s.slice(1).map(n).join(' '))).join(' ');

function svgItem(it) {
  switch (it.k) {
    case 'rect': return `<rect x="${n(it.x)}" y="${n(it.y)}" width="${n(it.w)}" height="${n(it.h)}"${it.r ? ` rx="${n(Math.min(it.r, it.w / 2, it.h / 2))}"` : ''}${paint(it)}/>`;
    case 'ellipse': return `<ellipse cx="${n(it.cx)}" cy="${n(it.cy)}" rx="${n(it.rx)}" ry="${n(it.ry)}"${paint(it)}/>`;
    case 'path': return `<path d="${pathD(it.segs)}"${paint(it)}/>`;
    case 'image': return `<image href="${it.href}" x="${it.x}" y="${it.y}" width="${it.w}" height="${it.h}"/>`;
    case 'line': {
      const sw = it.sw ?? 2, stroke = it.stroke ?? C.ink;
      const ang = Math.atan2(it.y2 - it.y1, it.x2 - it.x1), size = Math.max(14, sw * 4.5);
      let { x1, y1, x2, y2 } = it, out = '';
      const tip = (x, y, a) => {
        const bx = x - Math.cos(a) * size, by = y - Math.sin(a) * size, nx = -Math.sin(a) * size * 0.5, ny = Math.cos(a) * size * 0.5;
        return `<path d="M${n(x)} ${n(y)} L${n(bx + nx)} ${n(by + ny)} L${n(bx - nx)} ${n(by - ny)} Z" fill="#${stroke}"${it.alpha != null ? ` fill-opacity="${it.alpha}"` : ''}/>`;
      };
      if (it.arrow === 'end' || it.arrow === 'both') { out += tip(x2, y2, ang); x2 -= Math.cos(ang) * size * 0.8; y2 -= Math.sin(ang) * size * 0.8; }
      if (it.arrow === 'both') { out += tip(x1, y1, ang + Math.PI); x1 += Math.cos(ang) * size * 0.8; y1 += Math.sin(ang) * size * 0.8; }
      return `<line x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}"${paint({ ...it, stroke, fill: null })}/>` + out;
    }
    case 'text': {
      const lines = textLines(it), [asc, desc] = METRICS[it.font] ?? METRICS[FONT];
      const pitch = (asc + desc) * it.size * it.lh, top = it.y - (lines.length * pitch) / 2;
      const anchor = { l: 'start', c: 'middle', r: 'end' }[it.align];
      const family = it.font === SERIF ? `'Baskerville','Georgia',serif` : `'PingFang SC','Helvetica Neue',sans-serif`;
      const body = lines.map((runs, i) => {
        const yy = top + i * pitch + pitch - desc * it.size;
        const spans = runs.map((r) => `<tspan fill="#${r.color ?? it.color}"${(r.bold ?? it.bold) ? ' font-weight="600"' : ''}${(r.italic ?? it.italic) ? ' font-style="italic"' : ''}${r.size ? ` font-size="${r.size}"` : ''}>${esc(r.t)}</tspan>`).join('');
        return `<text x="${n(it.x)}" y="${n(yy)}" xml:space="preserve">${spans}</text>`;
      }).join('');
      return `<g font-family="${family}" font-size="${it.size}" text-anchor="${anchor}"${it.spacing ? ` letter-spacing="${it.spacing * 2}"` : ''}${it.alpha != null ? ` opacity="${it.alpha}"` : ''}${it.rot ? ` transform="rotate(${it.rot} ${it.x} ${it.y})"` : ''}>${body}</g>`;
    }
  }
  return '';
}

/** Split runs on \n into lines of runs. */
function textLines(it) {
  const lines = [[]];
  for (const r of it.runs) {
    r.t.split('\n').forEach((piece, i) => {
      if (i > 0) lines.push([]);
      if (piece !== '') lines[lines.length - 1].push({ ...r, t: piece });
    });
  }
  return lines;
}

export function toSVG(slide) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#${slide.bg}"/>${slide.items.map(svgItem).join('')}</svg>`;
}

/* ---------- PowerPoint / Keynote renderer ---------- */

const inch = (v) => v / IN;
const pct = (a) => (a == null ? undefined : Math.round((1 - a) * 100));

function shapeStyle(it) {
  const s = {};
  if (it.fill) s.fill = { color: it.fill, transparency: pct(it.fillAlpha) };
  if (it.stroke) {
    s.line = { color: it.stroke, width: (it.sw ?? 2) * PT, transparency: pct(it.alpha) };
    if (it.dash) s.line.dashType = it.dash === 'dot' ? 'sysDot' : 'dash';
  }
  return s;
}

export function toPptx(slide, ps) {
  ps.background = { color: slide.bg };
  for (const it of slide.items) {
    switch (it.k) {
      case 'rect':
        ps.addShape(it.r ? 'roundRect' : 'rect', { x: inch(it.x), y: inch(it.y), w: inch(it.w), h: inch(it.h), ...shapeStyle(it), ...(it.r ? { rectRadius: inch(Math.min(it.r, it.w / 2, it.h / 2)) } : {}) });
        break;
      case 'ellipse':
        ps.addShape('ellipse', { x: inch(it.cx - it.rx), y: inch(it.cy - it.ry), w: inch(it.rx * 2), h: inch(it.ry * 2), ...shapeStyle(it) });
        break;
      case 'line': {
        const st = shapeStyle({ stroke: C.ink, ...it, fill: null });
        if (it.arrow === 'end' || it.arrow === 'both') st.line.endArrowType = 'triangle';
        if (it.arrow === 'both') st.line.beginArrowType = 'triangle';
        ps.addShape('line', { x: inch(Math.min(it.x1, it.x2)), y: inch(Math.min(it.y1, it.y2)), w: inch(Math.abs(it.x2 - it.x1)), h: inch(Math.abs(it.y2 - it.y1)), flipH: it.x2 < it.x1, flipV: it.y2 < it.y1, ...st });
        break;
      }
      case 'path': {
        const xs = [], ys = [];
        for (const s of it.segs) for (let i = 1; i < s.length; i += 2) { xs.push(s[i]); ys.push(s[i + 1]); }
        const x0 = Math.min(...xs), y0 = Math.min(...ys), w = Math.max(Math.max(...xs) - x0, 1), h = Math.max(Math.max(...ys) - y0, 1);
        const points = it.segs.map((s) => {
          if (s[0] === 'Z') return { close: true };
          if (s[0] === 'C') return { x: inch(s[5] - x0), y: inch(s[6] - y0), curve: { type: 'cubic', x1: inch(s[1] - x0), y1: inch(s[2] - y0), x2: inch(s[3] - x0), y2: inch(s[4] - y0) } };
          return { x: inch(s[1] - x0), y: inch(s[2] - y0), moveTo: s[0] === 'M' };
        });
        ps.addShape('custGeom', { x: inch(x0), y: inch(y0), w: inch(w), h: inch(h), points, ...shapeStyle(it) });
        break;
      }
      case 'image':
        ps.addImage({ path: it.file, x: inch(it.x), y: inch(it.y), w: inch(it.w), h: inch(it.h) });
        break;
      case 'text': {
        const lines = textLines(it), [asc, desc] = METRICS[it.font] ?? METRICS[FONT];
        const pitch = (asc + desc) * it.size * it.lh;
        const widest = Math.max(...lines.map((runs) => runs.reduce((a, r) => a + measure(r.t, r.size ?? it.size, r.bold ?? it.bold), 0) + (it.spacing ?? 0) * 2 * runs.reduce((a, r) => a + r.t.length, 0)));
        const w = it.w ?? widest * 1.16 + it.size * 0.8, h = lines.length * pitch + it.size * 0.3;
        const x = it.align === 'c' ? it.x - w / 2 : it.align === 'r' ? it.x - w : it.x;
        const runs = [];
        lines.forEach((line, li) => {
          const parts = line.length ? line : [{ t: ' ' }];
          parts.forEach((r, ri) => runs.push({
            text: r.t,
            options: { color: r.color ?? it.color, bold: !!(r.bold ?? it.bold), italic: !!(r.italic ?? it.italic), fontSize: (r.size ?? it.size) * PT, breakLine: ri === parts.length - 1 && li < lines.length - 1 },
          }));
        });
        ps.addText(runs, {
          x: inch(x), y: inch(it.y - h / 2), w: inch(w), h: inch(h), margin: 0, isTextBox: true, fit: 'none', wrap: true,
          fontFace: it.font, fontSize: it.size * PT, color: it.color, align: { l: 'left', c: 'center', r: 'right' }[it.align], valign: 'middle',
          ...(it.lh !== 1 ? { lineSpacingMultiple: it.lh } : {}), ...(it.spacing ? { charSpacing: it.spacing } : {}),
          ...(it.alpha != null ? { transparency: pct(it.alpha) } : {}), ...(it.rot ? { rotate: (it.rot + 360) % 360 } : {}),
        });
        break;
      }
    }
  }
  if (slide.notes) ps.addNotes(slide.notes);
}
