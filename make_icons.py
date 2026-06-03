#!/usr/bin/env python3
"""Generate Meltdown app icons (PNG) using only the Python standard library."""
import os, math, struct, zlib

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "icons")
os.makedirs(OUT, exist_ok=True)

def lerp(a, b, t):
    return a + (b - a) * t

def mix(c0, c1, t):
    return tuple(int(round(lerp(c0[i], c1[i], t))) for i in range(3))

def smoothstep(e0, e1, x):
    if e1 == e0:
        return 0.0 if x < e0 else 1.0
    t = max(0.0, min(1.0, (x - e0) / (e1 - e0)))
    return t * t * (3 - 2 * t)

# Brand palette
TOP    = (0x9b, 0x8a, 0xff)   # soft indigo
BOTTOM = (0x6d, 0x5c, 0xe6)   # deeper violet
GLOW   = (0x5e, 0xea, 0xd4)   # teal accent
WHITE  = (0xff, 0xff, 0xff)

def make_icon(size, maskable=False):
    px = bytearray(size * size * 4)
    cx = cy = (size - 1) / 2.0

    # corner radius (rounded square) — maskable fills the whole canvas
    radius = 0 if maskable else size * 0.225

    # ring geometry; keep inside maskable safe zone (~80%)
    safe = 0.80 if maskable else 1.0
    r_out = size * 0.30 * safe
    r_in  = size * 0.205 * safe
    ring_w = (r_out - r_in)

    # accent dot sits at top of the ring
    dot_ang = -math.pi / 2
    dot_x = cx + (r_out + r_in) / 2 * math.cos(dot_ang)
    dot_y = cy + (r_out + r_in) / 2 * math.sin(dot_ang)
    dot_r = ring_w * 0.62

    for y in range(size):
        for x in range(size):
            i = (y * size + x) * 4

            # ----- rounded-rect alpha mask -----
            if radius > 0:
                rx = min(x, size - 1 - x)
                ry = min(y, size - 1 - y)
                if rx < radius and ry < radius:
                    dx = radius - rx
                    dy = radius - ry
                    dist = math.hypot(dx, dy)
                    a_mask = 1.0 - smoothstep(radius - 1.2, radius + 0.6, dist)
                else:
                    a_mask = 1.0
            else:
                a_mask = 1.0

            if a_mask <= 0:
                px[i:i+4] = bytes((0, 0, 0, 0))
                continue

            # ----- diagonal gradient background -----
            t = (x + y) / (2.0 * (size - 1))
            r, g, b = mix(TOP, BOTTOM, t)

            # radial glow from upper-left
            gd = math.hypot(x - size * 0.28, y - size * 0.26) / (size * 0.9)
            gf = max(0.0, 1.0 - gd) * 0.45
            r = int(lerp(r, GLOW[0], gf))
            g = int(lerp(g, GLOW[1], gf))
            b = int(lerp(b, GLOW[2], gf))

            # ----- score ring (white) -----
            d = math.hypot(x - cx, y - cy)
            ring_a = smoothstep(r_in - 1.5, r_in + 0.8, d) * (1.0 - smoothstep(r_out - 0.8, r_out + 1.5, d))
            if ring_a > 0:
                r = int(lerp(r, WHITE[0], ring_a * 0.95))
                g = int(lerp(g, WHITE[1], ring_a * 0.95))
                b = int(lerp(b, WHITE[2], ring_a * 0.95))

            # ----- accent dot -----
            dd = math.hypot(x - dot_x, y - dot_y)
            dot_a = 1.0 - smoothstep(dot_r - 1.2, dot_r + 1.0, dd)
            if dot_a > 0:
                r = int(lerp(r, GLOW[0], dot_a))
                g = int(lerp(g, GLOW[1], dot_a))
                b = int(lerp(b, GLOW[2], dot_a))

            a = int(round(255 * a_mask))
            px[i] = max(0, min(255, r))
            px[i+1] = max(0, min(255, g))
            px[i+2] = max(0, min(255, b))
            px[i+3] = a

    return encode_png(size, size, px)

def encode_png(w, h, rgba):
    def chunk(typ, data):
        c = struct.pack(">I", len(data)) + typ + data
        return c + struct.pack(">I", zlib.crc32(typ + data) & 0xffffffff)

    raw = bytearray()
    stride = w * 4
    for y in range(h):
        raw.append(0)  # filter type 0
        raw.extend(rgba[y * stride:(y + 1) * stride])

    sig = b"\x89PNG\r\n\x1a\n"
    ihdr = struct.pack(">IIBBBBB", w, h, 8, 6, 0, 0, 0)  # 8-bit RGBA
    idat = zlib.compress(bytes(raw), 9)
    return sig + chunk(b"IHDR", ihdr) + chunk(b"IDAT", idat) + chunk(b"IEND", b"")

def write(name, data):
    with open(os.path.join(OUT, name), "wb") as f:
        f.write(data)
    print("wrote", name, len(data), "bytes")

if __name__ == "__main__":
    for s in (180, 192, 512):
        write(f"icon-{s}.png", make_icon(s))
    write("icon-512-maskable.png", make_icon(512, maskable=True))
    print("done")
