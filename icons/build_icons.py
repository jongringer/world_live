#!/usr/bin/env python3
"""WORLD LIVE PWA 아이콘 생성기 (Pillow + numpy).

디자인: 다크 블루 슬레이트 배경 + 입체 지구본(골드 대륙) + 뒤편의 골드 궤도·신호 링 + 골드 라이트닝.
출력: icons/icon-512.png, icons/icon-192.png, icons/icon-maskable-512.png,
      icons/icon-maskable-192.png, icons/apple-touch-icon.png
실행: python3 icons/build_icons.py
"""
import math
import os
import re

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = 1024          # 논리 좌표계
SS = 2               # 슈퍼샘플 배율
S = BASE * SS

GOLD_HI = (255, 236, 170)
GOLD = (247, 189, 66)
GOLD_DK = (196, 125, 14)


def hexc(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def lerp_stops(stops, t):
    t = np.clip(t, 0.0, 1.0)
    out_rgb = np.zeros(t.shape + (3,), np.float32)
    out_a = np.zeros(t.shape, np.float32)
    for i in range(len(stops) - 1):
        p0, c0, a0 = stops[i]
        p1, c1, a1 = stops[i + 1]
        m = (t >= p0) & (t <= p1)
        if not m.any():
            continue
        f = np.zeros_like(t)
        f[m] = (t[m] - p0) / max(p1 - p0, 1e-6)
        for k in range(3):
            out_rgb[..., k][m] = np.array(c0[k], np.float32) + f[m] * (c1[k] - c0[k])
        out_a[m] = a0 + f[m] * (a1 - a0)
    return out_rgb, out_a


def radial_layer(cx, cy, r, stops, size=S):
    yy, xx = np.mgrid[0:size, 0:size].astype(np.float32)
    d = np.sqrt((xx - cx * SS) ** 2 + (yy - cy * SS) ** 2) / (r * SS)
    rgb, a = lerp_stops(stops, d)
    return np.dstack([rgb / 255.0, a])


def linear_layer(p0, p1, stops, size=S):
    yy, xx = np.mgrid[0:size, 0:size].astype(np.float32)
    x0, y0 = p0[0] * SS, p0[1] * SS
    x1, y1 = p1[0] * SS, p1[1] * SS
    vx, vy = x1 - x0, y1 - y0
    L2 = vx * vx + vy * vy
    t = ((xx - x0) * vx + (yy - y0) * vy) / L2
    rgb, a = lerp_stops(stops, t)
    return np.dstack([rgb / 255.0, a])


def comp(dst, src):
    sa = src[..., 3:4]
    da = dst[..., 3:4]
    oa = sa + da * (1 - sa)
    with np.errstate(invalid="ignore", divide="ignore"):
        rgb = (src[..., :3] * sa + dst[..., :3] * da * (1 - sa)) / np.maximum(oa, 1e-6)
    return np.dstack([np.nan_to_num(rgb), oa])


def to_img(arr):
    return Image.fromarray((np.clip(arr, 0, 1) * 255).astype(np.uint8), "RGBA")


def mask_from_draw(fn, size=S):
    m = Image.new("L", (size, size), 0)
    fn(ImageDraw.Draw(m))
    return np.asarray(m, np.float32) / 255.0


def shape_layer(mask, grad):
    out = grad.copy()
    out[..., 3] = grad[..., 3] * mask
    return out


def sc(*v):
    return [x * SS for x in v]


def sc_pts(pts):
    return [(x * SS, y * SS) for x, y in pts]


def flat(alpha_rgba):
    return np.asarray(alpha_rgba, np.float32) / 255.0


# ── 1. 배경 ───────────────────────────────────────────────────────────
def build_background():
    bg = radial_layer(512, 380, 980, [
        (0.00, hexc("17324F"), 1.0),
        (0.34, hexc("0F2742"), 1.0),
        (0.68, hexc("08172A"), 1.0),
        (1.00, hexc("03060B"), 1.0),
    ])
    halo = radial_layer(512, 500, 380, [
        (0.00, hexc("46BFF8"), 0.22),
        (0.55, hexc("2C7BD6"), 0.09),
        (1.00, hexc("2C7BD6"), 0.0),
    ])
    return comp(bg, halo)


# ── 2. 지구본 ─────────────────────────────────────────────────────────
LAND = [
    # 대륙별 단순화 좌표 (1024 논리 좌표 · 지구본 중심 512,516 / 반지름 262 안쪽)
    # 북아메리카
    [(344, 372), (378, 340), (424, 330), (462, 348), (470, 378), (446, 396), (430, 420),
     (404, 438), (378, 452), (352, 432), (338, 404)],
    # 중남미
    [(430, 436), (456, 458), (466, 498), (452, 540), (438, 592), (424, 648), (410, 690),
     (396, 656), (398, 600), (382, 548), (372, 496), (388, 458)],
    # 그린란드
    [(452, 312), (482, 304), (498, 326), (486, 352), (458, 356), (444, 334)],
    # 유럽
    [(502, 414), (532, 402), (556, 414), (548, 442), (524, 458), (500, 446), (494, 428)],
    # 아프리카
    [(512, 470), (546, 462), (570, 492), (566, 540), (548, 596), (524, 646), (504, 610),
     (496, 552), (488, 502)],
    # 아시아
    [(566, 376), (622, 352), (682, 362), (718, 396), (712, 434), (678, 448), (644, 440),
     (610, 458), (574, 448), (556, 414)],
    # 인도
    [(600, 452), (622, 456), (628, 486), (610, 512), (596, 484)],
    # 동남아시아 제도
    [(636, 470), (664, 466), (676, 484), (656, 498), (634, 490)],
    # 오스트레일리아
    [(628, 594), (668, 588), (688, 612), (672, 644), (636, 646), (620, 620)],
]


def smooth_closed(points, samples=10):
    """Catmull-Rom 폐곡선 → 부드러운 대륙 외곽."""
    n = len(points)
    out = []
    for i in range(n):
        p0 = points[(i - 1) % n]
        p1 = points[i]
        p2 = points[(i + 1) % n]
        p3 = points[(i + 2) % n]
        for s in range(samples):
            t = s / samples
            t2, t3 = t * t, t * t * t
            x = 0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t
                       + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2
                       + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3)
            y = 0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t
                       + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2
                       + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)
            out.append((x, y))
    return out


def flatten_path(d):
    toks = re.findall(r"[MmLlCcZz]|-?\d*\.?\d+", d)
    pts, i, cur, start, cmd = [], 0, (0.0, 0.0), None, None
    while i < len(toks):
        t = toks[i]
        if t in "MmLlCcZz":
            cmd = t
            i += 1
            if t in "Zz" and start:
                cur = start
            continue
        if cmd in "Mm":
            x, y = float(toks[i]), float(toks[i + 1]); i += 2
            cur = (x, y) if cmd == "M" else (cur[0] + x, cur[1] + y)
            start = cur
            pts.append(cur)
            cmd = "L" if cmd == "M" else "l"
        elif cmd in "Ll":
            x, y = float(toks[i]), float(toks[i + 1]); i += 2
            cur = (x, y) if cmd == "L" else (cur[0] + x, cur[1] + y)
            pts.append(cur)
        elif cmd in "Cc":
            v = [float(x) for x in toks[i:i + 6]]; i += 6
            p0 = cur
            p1 = (v[0], v[1]) if cmd == "C" else (cur[0] + v[0], cur[1] + v[1])
            p2 = (v[2], v[3]) if cmd == "C" else (cur[0] + v[2], cur[1] + v[3])
            p3 = (v[4], v[5]) if cmd == "C" else (cur[0] + v[4], cur[1] + v[5])
            for s in range(1, 13):
                u = s / 12.0
                w = 1 - u
                pts.append((w**3*p0[0] + 3*w*w*u*p1[0] + 3*w*u*u*p2[0] + u**3*p3[0],
                            w**3*p0[1] + 3*w*w*u*p1[1] + 3*w*u*u*p2[1] + u**3*p3[1]))
            cur = p3
    return pts


CX, CY, R = 512, 512, 292


def build_globe():
    cx, cy, r = CX, CY, R
    ocean = radial_layer(cx - 84, cy - 98, 600, [
        (0.00, hexc("6FD8F7"), 1.0),
        (0.16, hexc("2AA3E2"), 1.0),
        (0.40, hexc("0B6FAE"), 1.0),
        (0.66, hexc("07497A"), 1.0),
        (0.86, hexc("043254"), 1.0),
        (1.00, hexc("011C31"), 1.0),
    ])
    gmask = mask_from_draw(lambda d: d.ellipse(sc(cx - r, cy - r, cx + r, cy + r), fill=255))
    globe = shape_layer(gmask, ocean)

    # 대륙 — 골드
    def draw_land(d):
        for poly in LAND:
            d.polygon(sc_pts(smooth_closed(poly)), fill=255)

    lmask = mask_from_draw(draw_land) * gmask
    land = linear_layer((cx, cy - 260), (cx + 120, cy + 270), [
        (0.00, hexc("FAD35F"), 1.0),
        (0.34, hexc("EDB531"), 1.0),
        (0.70, hexc("D39012"), 1.0),
        (1.00, hexc("9C5F06"), 1.0),
    ])
    globe = comp(globe, shape_layer(lmask, land))

    # 대륙 외곽선 — 작은 크기에서도 윤곽이 살도록
    om = Image.new("L", (S, S), 0)
    od = ImageDraw.Draw(om)
    for poly in LAND:
        pts = smooth_closed(poly)
        od.line(sc_pts(pts + [pts[0]]), fill=255, width=max(2, int(2.0 * SS)), joint="curve")
    outline = np.zeros_like(globe)
    outline[..., :3] = np.array([90, 56, 8], np.float32) / 255
    outline[..., 3] = (np.asarray(om, np.float32) / 255.0) * gmask * 0.72
    globe = comp(globe, outline)

    # 격자
    gm = Image.new("L", (S, S), 0)
    gd = ImageDraw.Draw(gm)
    lw = max(2, int(2.2 * SS))
    for rx in (64, 142, 212):
        gd.ellipse(sc(cx - rx, cy - r, cx + rx, cy + r), outline=255, width=lw)
    gd.line(sc(cx - r, cy, cx + r, cy), fill=255, width=lw)
    for ey, rx, ry in ((cy - 118, 232, 32), (cy, 262, 44), (cy + 118, 232, 32)):
        gd.ellipse(sc(cx - rx, ey - ry, cx + rx, ey + ry), outline=255, width=lw)
    grid = np.zeros_like(globe)
    grid[..., :3] = np.array([186, 230, 253], np.float32) / 255
    grid[..., 3] = (np.asarray(gm, np.float32) / 255.0) * gmask * 0.26
    globe = comp(globe, grid)

    # 입체 명암 — 광원은 좌상단
    light = radial_layer(cx - 92, cy - 100, r * 1.95, [
        (0.00, (255, 255, 255), 1.0),
        (0.24, (255, 255, 255), 1.0),
        (0.50, (198, 216, 236), 1.0),
        (0.76, (74, 92, 120), 1.0),
        (1.00, (12, 18, 32), 1.0),
    ])
    globe = np.dstack([globe[..., :3] * light[..., :3], globe[..., 3]])

    # 스페큘러
    spec = radial_layer(cx - 34, cy - 172, 118, [
        (0.00, (255, 255, 255), 0.42),
        (0.55, hexc("E2F6FF"), 0.09),
        (1.00, (255, 255, 255), 0.0),
    ])
    globe = comp(globe, spec)

    # 대기권 링 (원 바깥으로 번지는 광)
    atmo = radial_layer(cx, cy, r * 1.16, [
        (0.00, hexc("56CDFF"), 0.0),
        (0.855, hexc("56CDFF"), 0.0),
        (0.935, hexc("8BE3FF"), 0.34),
        (1.00, hexc("56CDFF"), 0.0),
    ])
    globe = comp(globe, atmo)

    # 림 라이트 (좌상단 밝게 / 우하단 어둡게)
    rim = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    rd = ImageDraw.Draw(rim)
    steps = 360
    for i in range(steps):
        a0 = 360.0 * i / steps
        p0 = (cx + r * math.cos(math.radians(a0)), cy + r * math.sin(math.radians(a0)))
        p1 = (cx + r * math.cos(math.radians(a0 + 360.0 / steps)), cy + r * math.sin(math.radians(a0 + 360.0 / steps)))
        f = 0.5 + 0.5 * math.cos(math.radians(a0 + 135))
        col = (int(210 + 45 * f), int(235 + 20 * f), 255)
        rd.line([sc_pts([p0])[0], sc_pts([p1])[0]], fill=col + (int(120 * f + 30),), width=int(4 * SS))
    rglow = rim.filter(ImageFilter.GaussianBlur(4 * SS))
    globe = comp(globe, np.asarray(rglow, np.float32) / 255)
    globe = comp(globe, np.asarray(rim, np.float32) / 255)
    return globe, gmask


# ── 3. 배경 레이어(궤도·신호) ────────────────────────────────────────
def rotated_point(cx, cy, x, y, deg):
    a = math.radians(deg)
    dx, dy = x - cx, y - cy
    return (cx + dx * math.cos(a) - dy * math.sin(a), cy + dx * math.sin(a) + dy * math.cos(a))


def build_orbit():
    layer = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    cx, cy, rx, ry = CX, CY, 398, 138
    steps = 260
    for i in range(steps):
        a0 = 2 * math.pi * i / steps
        a1 = 2 * math.pi * (i + 1) / steps
        p0 = rotated_point(cx, cy, cx + rx * math.cos(a0), cy + ry * math.sin(a0), -20)
        p1 = rotated_point(cx, cy, cx + rx * math.cos(a1), cy + ry * math.sin(a1), -20)
        f = 0.35 + 0.65 * (0.5 + 0.5 * math.cos(a0 + 2.2))
        col = tuple(int(GOLD_HI[k] * f + GOLD_DK[k] * (1 - f)) for k in range(3))
        w = int((3.0 + 3.0 * f) * SS)
        d.line([sc_pts([p0])[0], sc_pts([p1])[0]], fill=col + (int(70 + 120 * f),), width=w)
    glow = layer.filter(ImageFilter.GaussianBlur(5 * SS))
    return comp(flat(glow), flat(layer))


def build_satellite():
    layer = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    p = rotated_point(CX, CY, CX - 398, CY, -20)
    x, y = p
    d.rounded_rectangle([(x - 15)*SS, (y - 12)*SS, (x + 15)*SS, (y + 12)*SS], radius=4*SS,
                        fill=GOLD_HI + (255,), outline=(120, 80, 20, 190), width=int(1.2*SS))
    for side in (-1, 1):
        x0 = x - 50 if side < 0 else x + 20
        d.rounded_rectangle([x0*SS, (y - 8)*SS, (x0 + 30)*SS, (y + 8)*SS], radius=2*SS,
                            fill=(20, 62, 108, 255), outline=GOLD + (255,), width=int(2.0*SS))
        d.line([((x0 + 15)*SS, (y - 6)*SS), ((x0 + 15)*SS, (y + 6)*SS)], fill=GOLD_HI + (170,), width=int(1.2*SS))
    glow = layer.filter(ImageFilter.GaussianBlur(4 * SS))
    return comp(flat(glow), flat(layer))


def build_signals():
    """지구 뒤편에서 퍼져 나가는 골드 신호 링 (우상단 사분면)."""
    layer = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for (rad, w, op) in ((346, 13, 200), (412, 10, 130), (476, 7, 78)):
        box = sc(CX - rad, CY - rad, CX + rad, CY + rad)
        d.arc(box, start=-88, end=-2, fill=GOLD_HI + (op,), width=int(w * SS))
    glow = layer.filter(ImageFilter.GaussianBlur(6 * SS))
    return comp(flat(glow), flat(layer))


# ── 4. 라이트닝 ───────────────────────────────────────────────────────
def build_bolt():
    pts = [(588, 262), (430, 568), (536, 582), (456, 792), (676, 486), (566, 472), (654, 262)]
    bm = mask_from_draw(lambda d: d.polygon(sc_pts(pts), fill=255))
    bgrad = linear_layer((470, 280), (640, 790), [
        (0.00, hexc("FFFDF2"), 1.0),
        (0.20, hexc("FFE483"), 1.0),
        (0.50, hexc("F7B72C"), 1.0),
        (0.78, hexc("D98C0E"), 1.0),
        (1.00, hexc("8F5505"), 1.0),
    ])
    bolt = shape_layer(bm, bgrad)

    edge = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    ed = ImageDraw.Draw(edge)
    ed.line(sc_pts(pts + [pts[0]]), fill=(96, 54, 4, 130), width=int(7 * SS), joint="curve")
    shadow = edge.filter(ImageFilter.GaussianBlur(9 * SS))

    hl = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    hd = ImageDraw.Draw(hl)
    hd.line(sc_pts([(588, 262), (430, 568), (536, 582)]), fill=(255, 252, 235, 120), width=int(3.5 * SS), joint="curve")

    out = comp(flat(shadow), bolt)
    out = comp(out, flat(edge))
    out = comp(out, flat(hl))
    return out


def vignette():
    return radial_layer(512, 512, 720, [
        (0.00, (255, 255, 255), 0.0),
        (0.60, (255, 255, 255), 0.0),
        (1.00, (2, 5, 10), 0.5),
    ])


def build_shadow():
    """지구본이 배경에 드리우는 부드러운 그림자 — 입체감."""
    m = Image.new("L", (S, S), 0)
    d = ImageDraw.Draw(m)
    d.ellipse(sc(CX - R * 1.12, CY - R * 1.02, CX + R * 1.12, CY + R * 1.16), fill=255)
    m = m.filter(ImageFilter.GaussianBlur(46 * SS))
    arr = np.asarray(m, np.float32) / 255.0
    out = np.zeros((S, S, 4), np.float32)
    out[..., 3] = arr * 0.55
    return out


def main():
    arr = build_background()
    arr = comp(arr, build_shadow())
    arr = comp(arr, build_signals())
    arr = comp(arr, build_orbit())
    arr = comp(arr, build_satellite())
    globe, _ = build_globe()
    arr = comp(arr, globe)
    arr = comp(arr, build_bolt())
    arr = comp(arr, vignette())

    master = to_img(arr).resize((BASE, BASE), Image.LANCZOS)
    master.save(os.path.join(HERE, "icon-master-1024.png"))
    master.resize((512, 512), Image.LANCZOS).save(os.path.join(HERE, "icon-512.png"))
    master.resize((192, 192), Image.LANCZOS).save(os.path.join(HERE, "icon-192.png"))
    master.resize((180, 180), Image.LANCZOS).convert("RGB").save(os.path.join(HERE, "apple-touch-icon.png"))

    bg_only = to_img(build_background()).resize((BASE, BASE), Image.LANCZOS)
    inner = master.resize((int(BASE * 0.80), int(BASE * 0.80)), Image.LANCZOS)
    maskable = bg_only.copy()
    off = (BASE - inner.size[0]) // 2
    maskable.paste(inner, (off, off), inner)
    maskable.resize((512, 512), Image.LANCZOS).save(os.path.join(HERE, "icon-maskable-512.png"))
    maskable.resize((192, 192), Image.LANCZOS).save(os.path.join(HERE, "icon-maskable-192.png"))

    sheet = Image.new("RGB", (940, 340), (8, 13, 22))
    sheet.paste(master, (0, 0), master) if False else None
    x = 16
    for s in (300, 192, 96, 48):
        im = master.resize((s, s), Image.LANCZOS)
        sheet.paste(im, (x, (340 - s) // 2), im)
        x += s + 24
    sheet.save(os.path.join(HERE, "..", "preview_icons.png"))
    print("done")


if __name__ == "__main__":
    main()
