#!/usr/bin/env python3
"""Geometric QA for the EP3 deck: out-of-bounds shapes + estimated text overflow."""
import math
import sys
from pptx import Presentation
from pptx.util import Emu

DECK = sys.argv[1]
SLIDE_W, SLIDE_H = 13.333, 7.5
EMU = 914400.0

prs = Presentation(DECK)


def est_lines(text, box_w_in, font_pt):
    """Estimate wrapped line count. CJK chars ~1.0em wide, Latin ~0.52em."""
    if not text:
        return 0
    box_w_pt = box_w_in * 72.0
    lines = 0
    for para in text.split("\n"):
        if not para.strip():
            lines += 1
            continue
        w = 0.0
        for ch in para:
            if "一" <= ch <= "鿿" or "　" <= ch <= "〿" or "＀" <= ch <= "￯":
                w += font_pt * 1.0
            elif ch == " ":
                w += font_pt * 0.28
            else:
                w += font_pt * 0.52
        lines += max(1, math.ceil(w / max(box_w_pt, 1)))
    return lines


def walk(shapes, out):
    for sh in shapes:
        if sh.shape_type == 6:  # group
            walk(sh.shapes, out)
            continue
        out.append(sh)


problems = []
for idx, slide in enumerate(prs.slides, 1):
    shapes = []
    walk(slide.shapes, shapes)
    for sh in shapes:
        try:
            x, y = sh.left / EMU, sh.top / EMU
            w, h = sh.width / EMU, sh.height / EMU
        except (TypeError, AttributeError):
            continue
        # 1) out of bounds
        if x < -0.02 or y < -0.02 or x + w > SLIDE_W + 0.02 or y + h > SLIDE_H + 0.02:
            problems.append(
                f"S{idx:02d} OUT-OF-BOUNDS  {sh.shape_type}  "
                f"x={x:.2f} y={y:.2f} w={w:.2f} h={h:.2f}  "
                f"right={x+w:.2f} bottom={y+h:.2f}  text={(sh.text_frame.text[:40] if sh.has_text_frame else '')!r}"
            )
        # 2) estimated text overflow
        if not sh.has_text_frame:
            continue
        tf = sh.text_frame
        txt = tf.text
        if not txt.strip():
            continue
        sizes, spacings = [], []
        for p in tf.paragraphs:
            for r in p.runs:
                if r.font.size:
                    sizes.append(r.font.size.pt)
            ls = p.line_spacing
            if ls is not None:
                if hasattr(ls, "pt"):          # exact spacing (Length) → points
                    spacings.append(float(ls.pt))
                elif isinstance(ls, float):    # multiplier
                    spacings.append(None if ls <= 0 else -ls)
        font_pt = max(sizes) if sizes else 12.0
        ls_pt = next((s for s in spacings if s), None)
        if ls_pt is None:
            ls_pt = font_pt * 1.22
        elif ls_pt < 0:                        # multiplier form
            ls_pt = -ls_pt * font_pt
        # paragraph spacing after
        gap = 0.0
        for p in tf.paragraphs:
            if p.space_after:
                gap = max(gap, float(p.space_after.pt))
        n_para = max(1, len([p for p in tf.paragraphs if p.text.strip()]))
        # internal margins
        ml = (tf.margin_left or 0) / EMU
        mr = (tf.margin_right or 0) / EMU
        mt = (tf.margin_top or 0) / EMU
        mb = (tf.margin_bottom or 0) / EMU
        avail_w = max(w - ml - mr, 0.15)
        avail_h_pt = max(h - mt - mb, 0.05) * 72.0
        lines = est_lines(txt, avail_w, font_pt)
        need_pt = lines * ls_pt + (n_para - 1) * gap
        if need_pt > avail_h_pt * 1.08:
            problems.append(
                f"S{idx:02d} TEXT-OVERFLOW  box {w:.2f}x{h:.2f}in @({x:.2f},{y:.2f})  "
                f"font={font_pt:.0f}pt lines~{lines} need~{need_pt/72:.2f}in avail={avail_h_pt/72:.2f}in  "
                f"text={txt[:70]!r}"
            )

print(f"slides: {len(prs.slides)}")
print(f"problems: {len(problems)}")
for p in problems:
    print(" ", p)
