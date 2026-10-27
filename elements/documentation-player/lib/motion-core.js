/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 *
 * Portions of the line-drawing approach derive from the dimensional-drawing
 * skill by Enes Ozturk (MIT License, Copyright (c) Enes Ozturk).
 */
/**
 * motion-core.js
 * Framework-free storyboard player. A storyboard (plain JSON) describes drawing
 * objects and when they appear, move or change; createScene() builds the SVG once
 * and returns render(t), a pure function of time. Nothing is recorded, so any
 * frame can be drawn on demand (scrubbing, stills for review, MP4 export).
 *
 * Coordinate system: 1600 x 900. Look: monochrome line drawing.
 */
/** value, or a fallback when it is null or undefined */
const def = (v, d) => (v === undefined || v === null ? d : v);

const NS = "http://www.w3.org/2000/svg";
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a, b, t) => a + (b - a) * t;
const eo = (t) => 1 - (1 - t) * (1 - t);
const eio = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const ramp = (t, a, b) => eio(clamp01((t - a) / (b - a)));
const pulse = (t, c) => {
  const p = t - c;
  if (p < 0) return 0;
  return p < 0.12 ? p / 0.12 : Math.max(0, 1 - (p - 0.12) / 0.6);
};

export const MOTION_CSS = `
.dw text{font-family:var(--motion-sans,Arimo,Helvetica,Arial,sans-serif);text-transform:uppercase}
.dw .border{fill:none;stroke:var(--main);stroke-width:1.2}
.dw .obj{fill:var(--ground);stroke:var(--main);stroke-width:1.8;stroke-linejoin:round}
.dw .well{fill:color-mix(in srgb,var(--second) 5%,var(--ground));stroke:var(--main);stroke-width:1.2}
.dw .hug{fill:color-mix(in srgb,var(--second) 10%,var(--ground));stroke:var(--main);stroke-width:1.2}
.dw .slot{fill:none;stroke:color-mix(in srgb,var(--second) 75%,var(--ground));stroke-width:1;stroke-dasharray:5 4}
.dw .thin{fill:none;stroke:var(--main);stroke-width:1.1;stroke-linejoin:round;stroke-linecap:round}
.dw .bold{fill:none;stroke:var(--main);stroke-width:2.2;stroke-linejoin:round;stroke-linecap:round}
.dw .ph{fill:none;stroke:var(--main);stroke-width:1.2;stroke-dasharray:16 4 3 4}
.dw .cl{fill:none;stroke:var(--accent);stroke-width:.9;stroke-dasharray:18 4 2 4}
.dw .dl,.dw .lead{stroke:var(--main);stroke-width:.9;fill:none}
.dw .ext{stroke:var(--main);stroke-width:.7;fill:none}
.dw .arrow,.dw .dot{fill:var(--main)}
.dw .hl{stroke:color-mix(in srgb,var(--second) 70%,var(--ground));stroke-width:.8}
.dw .hs{stroke:var(--main);stroke-width:1}
.dw .nb{fill:var(--ground);stroke:var(--main);stroke-width:1.1}
.dw .dt{font-size:14px;fill:var(--main);paint-order:stroke;stroke:var(--ground);stroke-width:4px;stroke-linejoin:round}
.dw .dts{font-size:12.5px;letter-spacing:.07em;fill:color-mix(in srgb,var(--second) 72%,var(--ground));paint-order:stroke;stroke:var(--ground);stroke-width:3.5px;stroke-linejoin:round}
.dw .vt{font-size:15px;letter-spacing:.14em;fill:var(--main)}
.dw .rn{font-size:16px;letter-spacing:.12em;fill:var(--main)}
.dw .cd{font-size:13.5px;text-transform:none;letter-spacing:.01em;fill:color-mix(in srgb,var(--second) 72%,var(--ground))}
.dw .ct{font-size:22px;letter-spacing:.16em;fill:var(--main)}
.dw .cdd{font-size:15px;text-transform:none;letter-spacing:.01em;fill:color-mix(in srgb,var(--second) 80%,var(--ground))}
.dw .nbt{font-size:13px;font-weight:700;fill:var(--main)}
.dw .code{font-family:var(--motion-mono,ui-monospace,SFMono-Regular,Menlo,Consolas,monospace);font-size:18px;text-transform:none;letter-spacing:0;fill:var(--main)}
.dw .val{font-size:15px;text-transform:none;letter-spacing:0;font-weight:700;fill:var(--main)}
.dw .big{font-size:42px;font-weight:400;fill:var(--main)}
.dw .hero{font-size:46px;letter-spacing:.3em;fill:var(--main)}
.dw .head{font-size:28px;letter-spacing:.22em;fill:var(--main)}
.dw .sub{font-size:12.5px;letter-spacing:.14em;fill:color-mix(in srgb,var(--second) 72%,var(--ground))}
.dw .glyph{font-size:20px;fill:var(--main)}
.dw .impact{font-family:Impact,"Arial Black",sans-serif;font-weight:900;font-size:30px;letter-spacing:.06em;fill:var(--ground);stroke:var(--main);stroke-width:5px;paint-order:stroke;stroke-linejoin:round}
`;

/* ---------------------------------------------------------------- dom helpers */
function el(tag, attrs, parent) {
  const e = document.createElementNS(NS, tag);
  if (attrs)
    for (const k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
function setA(e, o) {
  for (const k in o) {
    const v = typeof o[k] === "number" ? Math.round(o[k] * 100) / 100 : o[k];
    e._a = e._a || {};
    if (e._a[k] !== v) {
      e._a[k] = v;
      e.setAttribute(k, v);
    }
  }
}
function setO(e, v) {
  const q = Math.round(v * 400) / 400;
  if (e._o !== q) {
    e._o = q;
    e.style.opacity = q;
  }
}
function setT(e, s) {
  if (e._s !== s) {
    e._s = s;
    e.textContent = s;
  }
}
/** register an element for stroke-draw ('d') or fade ('f') entrance */
function prep(e, mode) {
  e._m = mode;
  if (mode === "d") {
    e.setAttribute("pathLength", "1");
    e.style.strokeDasharray = "1 2";
    e.style.strokeDashoffset = "1";
  }
  e.style.opacity = "0";
  return e;
}
function paint(e, p, out) {
  let op,
    off = 0,
    fo = 1;
  if (e._m === "d") {
    off = 1 - eio(p);
    fo = clamp01((p - 0.55) / 0.45);
    op = (p > 0 ? 1 : 0) * out;
  } else op = eo(p) * out;
  const key = op.toFixed(3) + "|" + off.toFixed(3) + "|" + fo.toFixed(2);
  if (e._k === key) return;
  e._k = key;
  e.style.opacity = op;
  if (e._m === "d") {
    e.style.strokeDashoffset = off;
    e.style.fillOpacity = fo;
  }
}
const W = (o) => ({
  in: def(o.in, 0),
  d: def(o.d, 0.6),
  out: def(o.out, null),
  od: def(o.od, 0.4),
});
const prog = (t, w, delay = 0, dur) =>
  clamp01((t - w.in - delay) / def(dur, w.d));
const outf = (t, w) =>
  w.out == null ? 1 : 1 - eio(clamp01((t - w.out) / w.od));
const modeOf = (v) => (v === "slot" || v === "ph" || v === "cl" ? "f" : "d");

/* keyframes: [[t,{prop:value}],...] -> value of prop at t (arrive-by semantics) */
function makeTracks(base, keys, start) {
  const tr = {};
  for (const k in base) tr[k] = [[start, base[k]]];
  for (const [t, p, dur] of keys || [])
    for (const k in p) {
      const arr = (tr[k] = tr[k] || [[start, def(base[k], p[k])]]);
      if (dur) {
        const last = arr[arr.length - 1];
        arr.push([Math.max(last[0], t - dur), last[1]]);
      }
      arr.push([t, p[k]]);
    }
  for (const k in tr) tr[k].sort((a, b) => a[0] - b[0]);
  return tr;
}
function sampleTrack(a, t) {
  if (t <= a[0][0]) return a[0][1];
  for (let i = 0; i < a.length - 1; i++) {
    if (t < a[i + 1][0]) {
      const span = a[i + 1][0] - a[i][0];
      return span <= 0
        ? a[i + 1][1]
        : lerp(a[i][1], a[i + 1][1], eio((t - a[i][0]) / span));
    }
  }
  return a[a.length - 1][1];
}
const sampleAll = (tr, t) => {
  const o = {};
  for (const k in tr) o[k] = sampleTrack(tr[k], t);
  return o;
};

/* text that can swap (with a dip) or type in */
function textValue(o, t) {
  if (o.states) {
    let k = -1;
    for (let i = 0; i < o.states.length; i++) if (o.states[i][0] <= t) k = i;
    if (k < 0) return ["", 1];
    const [tk, s] = o.states[k];
    if (o.typed)
      return [
        s.slice(
          0,
          Math.round(s.length * clamp01((t - tk) / def(o.typeDur, 0.7))),
        ),
        1,
      ];
    if (k === 0) return [s, 1];
    const p = clamp01((t - tk) / 0.25);
    return p < 0.5 ? [o.states[k - 1][1], 1 - 2 * p] : [s, 2 * p - 1];
  }
  if (o.count) {
    const c = o.count,
      p = eo(clamp01((t - c.t0) / (c.t1 - c.t0))),
      v = lerp(
        c.from,
        c.to,
        c.linear ? clamp01((t - c.t0) / (c.t1 - c.t0)) : p,
      );
    const [ip, fp] = v.toFixed(c.dec || 0).split(".");
    return [
      (c.pre || "") +
        ip.replace(/\B(?=(\d{3})+(?!\d))/g, def(c.sep, ",")) +
        (fp ? "." + fp : "") +
        (c.suf || ""),
      1,
    ];
  }
  if (Array.isArray(o.type))
    return [
      o.s.slice(
        0,
        Math.round(
          o.s.length * clamp01((t - o.type[0]) / (o.type[1] - o.type[0])),
        ),
      ),
      1,
    ];
  return [def(o.s, ""), 1];
}

/* ---------------------------------------------------------------- glyph shapes (unit space -1..1) */
const CIRCLE = [
  ["M", -1, 0],
  ["A", 1, 1, 0, 1, 0, 1, 0],
  ["A", 1, 1, 0, 1, 0, -1, 0],
];
const SHAPES = {
  stop: [
    ["M", -0.38, -1],
    ["L", 0.38, -1],
    ["L", 1, -0.38],
    ["L", 1, 0.38],
    ["L", 0.38, 1],
    ["L", -0.38, 1],
    ["L", -1, 0.38],
    ["L", -1, -0.38],
    ["Z"],
    ["M", 0, -0.5],
    ["L", 0, 0.12],
    ["M", 0, 0.42],
    ["L", 0, 0.5],
  ],
  warning: [
    ["M", 0, -1],
    ["L", 1, 0.85],
    ["L", -1, 0.85],
    ["Z"],
    ["M", 0, -0.3],
    ["L", 0, 0.28],
    ["M", 0, 0.52],
    ["L", 0, 0.58],
  ],
  check: [...CIRCLE, ["M", -0.5, 0.05], ["L", -0.12, 0.42], ["L", 0.52, -0.38]],
  info: [
    ...CIRCLE,
    ["M", 0, -0.6],
    ["L", 0, -0.55],
    ["M", 0, -0.2],
    ["L", 0, 0.55],
  ],
  play: [["M", -0.5, -0.8], ["L", 0.8, 0], ["L", -0.5, 0.8], ["Z"]],
  pause: [
    ["M", -0.5, -0.75],
    ["L", -0.5, 0.75],
    ["M", 0.5, -0.75],
    ["L", 0.5, 0.75],
  ],
  lock: [
    ["M", -0.7, -0.1],
    ["L", 0.7, -0.1],
    ["L", 0.7, 0.9],
    ["L", -0.7, 0.9],
    ["Z"],
    ["M", -0.4, -0.1],
    ["L", -0.4, -0.5],
    ["A", 0.4, 0.4, 0, 0, 1, 0.4, -0.5],
    ["L", 0.4, -0.1],
  ],
  "chev-l": [
    ["M", 0.5, -1],
    ["L", -0.5, 0],
    ["L", 0.5, 1],
  ],
  "chev-r": [
    ["M", -0.5, -1],
    ["L", 0.5, 0],
    ["L", -0.5, 1],
  ],
  plus: [
    ["M", -1, 0],
    ["L", 1, 0],
    ["M", 0, -1],
    ["L", 0, 1],
  ],
  x: [
    ["M", -1, -1],
    ["L", 1, 1],
    ["M", 1, -1],
    ["L", -1, 1],
  ],
  circle: CIRCLE,
  rewind: [
    ["M", 0.9, -0.7],
    ["L", 0, 0],
    ["L", 0.9, 0.7],
    ["Z"],
    ["M", 0, -0.7],
    ["L", -0.9, 0],
    ["L", 0, 0.7],
    ["Z"],
  ],
  forward: [
    ["M", -0.9, -0.7],
    ["L", 0, 0],
    ["L", -0.9, 0.7],
    ["Z"],
    ["M", 0, -0.7],
    ["L", 0.9, 0],
    ["L", 0, 0.7],
    ["Z"],
  ],
  link: [
    ["M", -0.9, 0.9],
    ["L", 0.9, -0.9],
    ["M", 0.2, -0.9],
    ["L", 0.9, -0.9],
    ["L", 0.9, -0.2],
  ],
};
function shapeD(name, x, y, s) {
  const r = s / 2,
    cmds = SHAPES[name] || SHAPES.circle;
  return cmds
    .map((c) => {
      if (c[0] === "Z") return "Z";
      if (c[0] === "A")
        return `A${c[1] * r} ${c[2] * r} ${c[3]} ${c[4]} ${c[5]} ${(x + c[6] * r).toFixed(1)} ${(y + c[7] * r).toFixed(1)}`;
      return `${c[0]}${(x + c[1] * r).toFixed(1)} ${(y + c[2] * r).toFixed(1)}`;
    })
    .join(" ");
}

/* ---------------------------------------------------------------- layout generators for "stack" objects */
function genLayout(spec, n, area) {
  const [ax, ay, aw, ah] = area,
    out = [];
  const gap = def(spec.gap, 8);
  switch (spec.gen) {
    case "masonry": {
      const cols = spec.cols || 3,
        cw = (aw - gap * (cols - 1)) / cols,
        colY = Array(cols).fill(0);
      for (let i = 0; i < n; i++) {
        const c = i % cols,
          h = spec.heights[i];
        out.push({ x: ax + c * (cw + gap), y: ay + colY[c], w: cw, h });
        colY[c] += h + gap;
      }
      break;
    }
    case "grid": {
      const cols = spec.cols || 3,
        cw = (aw - gap * (cols - 1)) / cols,
        ch = def(spec.h, cw / (spec.aspect || 1));
      for (let i = 0; i < n; i++)
        out.push({
          x: ax + (i % cols) * (cw + gap),
          y: ay + Math.floor(i / cols) * (ch + gap),
          w: cw,
          h: ch,
        });
      break;
    }
    case "strip": {
      const s = spec.size || 56,
        g = def(spec.gap, 6);
      for (let i = 0; i < n; i++)
        out.push({ x: ax + i * (s + g), y: def(spec.y, ay), w: s, h: s });
      break;
    }
    case "list": {
      const count = spec.count || n,
        h = def(spec.h, (ah - gap * (count - 1)) / count),
        w = def(spec.w, aw);
      for (let i = 0; i < n; i++)
        out.push(
          i < count
            ? { x: ax + (aw - w) / 2, y: ay + i * (h + gap), w, h }
            : null,
        );
      break;
    }
    case "row": {
      const rs = spec.ratios,
        total = rs.reduce((a, b) => a + b, 0),
        usable = aw - gap * (rs.length - 1);
      let x = ax;
      for (let i = 0; i < n; i++) {
        if (i < rs.length) {
          const w = (usable * rs[i]) / total;
          out.push({ x, y: ay, w, h: def(spec.h, ah) });
          x += w + gap;
        } else out.push(null);
      }
      break;
    }
    case "explicit":
      for (let i = 0; i < n; i++) out.push(spec.boxes[i] || null);
      break;
    default:
      for (let i = 0; i < n; i++) out.push(null);
  }
  return out;
}

/* ---------------------------------------------------------------- object builders: each returns update(t) */
const BUILD = {};

BUILD.box = (o, ctx) => {
  const w = W(o),
    v = o.v || "hug",
    mode = modeOf(v);
  const g = el("g", {}, ctx.main);
  const r = prep(el("rect", { rx: def(o.r, 6), class: v }, g), mode);
  const xs = o.xbox
    ? [
        prep(el("line", { class: "thin" }, g), "f"),
        prep(el("line", { class: "thin" }, g), "f"),
      ]
    : [];
  const lab = o.label
    ? prep(el("text", { class: o.lc || "dts" }, g), "f")
    : null;
  if (lab) lab.textContent = o.label;
  const tr = makeTracks({ x: o.x, y: o.y, w: o.w, h: o.h }, o.keys, w.in);
  return (t) => {
    const p = prog(t, w),
      out = outf(t, w),
      b = sampleAll(tr, t);
    let { x, y, w: bw, h: bh } = b,
      s = 1;
    if (o.pop) {
      s = eo(clamp01((t - o.pop[0]) / def(o.pop[1], 0.6)));
      bw *= s;
      bh *= s;
      x += (b.w - bw) / 2;
      y += (b.h - bh) / 2;
    }
    const pp = o.pop ? (s > 0 ? 1 : 0) : p;
    setA(r, { x, y, width: Math.max(bw, 0.1), height: Math.max(bh, 0.1) });
    if (o.pop) {
      setO(r, s * out);
      r.style.fillOpacity = 1;
      r.style.strokeDashoffset = 0;
    } else paint(r, pp, out);
    xs.forEach((l, i) => {
      setA(
        l,
        i
          ? { x1: x + bw, y1: y, x2: x, y2: y + bh }
          : { x1: x, y1: y, x2: x + bw, y2: y + bh },
      );
      paint(l, o.pop ? s : clamp01((p - 0.4) / 0.6), out);
    });
    if (lab) {
      setA(lab, { x: x + 9, y: y + 18 });
      paint(
        lab,
        (o.pop ? s : clamp01((p - 0.6) / 0.4)) *
          clamp01((bw - def(o.labelMin, 90)) / 30) *
          clamp01((bh - 30) / 14),
        out,
      );
    }
  };
};

BUILD.text = (o, ctx) => {
  const w = W(o),
    e = el(
      "text",
      { class: o.c || "dt", "text-anchor": o.a || "start" },
      o.layer === "head" ? ctx.head : ctx.main,
    );
  prep(e, "f");
  const tr = makeTracks({ x: o.x, y: o.y, o: 1 }, o.keys, w.in);
  return (t) => {
    const p = prog(t, w),
      out = outf(t, w),
      b = sampleAll(tr, t),
      [s, a] = textValue(o, t);
    setA(e, { x: b.x, y: b.y });
    setT(e, s);
    paint(e, p, out * a * b.o);
  };
};

BUILD.path = (o, ctx) => {
  const w = W(o),
    e = prep(
      el("path", { d: o.d, class: o.v || "thin" }, ctx.main),
      modeOf(o.v || "thin"),
    );
  return (t) => paint(e, prog(t, w), outf(t, w));
};

BUILD.line = (o, ctx) => {
  const w = W(o),
    e = prep(
      el(
        "line",
        { x1: o.x1, y1: o.y1, x2: o.x2, y2: o.y2, class: o.v || "thin" },
        ctx.main,
      ),
      modeOf(o.v || "thin"),
    );
  return (t) => paint(e, prog(t, w), outf(t, w));
};

BUILD.glyph = (o, ctx) => {
  const w = W(o),
    e = prep(
      el("path", { class: o.v || "thin", style: o.style || "" }, ctx.main),
      "d",
    );
  const tr = makeTracks(
    { x: o.x, y: o.y, s: def(o.s, 24), o: 1, name: 0 },
    o.keys,
    w.in,
  );
  const shapeAt = (t) => {
    // optional swap list: names:[[t,"stop"],...]
    if (!o.swap) return o.name;
    let k = 0;
    for (let i = 0; i < o.swap.length; i++) if (o.swap[i][0] <= t) k = i;
    return o.swap[k][1];
  };
  return (t) => {
    const b = sampleAll(tr, t);
    setA(e, { d: shapeD(shapeAt(t), b.x, b.y, b.s) });
    paint(e, prog(t, w), outf(t, w) * b.o);
  };
};

BUILD.callout = (o, ctx) => {
  const w = W(o),
    s = def(o.dir, o.ex >= o.px ? 1 : -1);
  const dot = prep(
    el("circle", { cx: o.px, cy: o.py, r: 2.6, class: "dot" }, ctx.main),
    "f",
  );
  const ln = prep(
    el(
      "polyline",
      {
        points: `${o.px},${o.py} ${o.ex},${o.ey} ${o.ex + s * 10},${o.ey}`,
        class: "lead",
      },
      ctx.main,
    ),
    "d",
  );
  const a = s > 0 ? "start" : "end";
  const t1 = prep(
    el(
      "text",
      { x: o.ex + s * 14, y: o.ey - 3, class: "dt", "text-anchor": a },
      ctx.main,
    ),
    "f",
  );
  t1.textContent = o.label;
  const t2 = o.sub
    ? prep(
        el(
          "text",
          { x: o.ex + s * 14, y: o.ey + 13, class: "dts", "text-anchor": a },
          ctx.main,
        ),
        "f",
      )
    : null;
  if (t2) t2.textContent = o.sub;
  return (t) => {
    const out = outf(t, w);
    paint(dot, prog(t, w, 0, 0.3), out);
    paint(ln, prog(t, w, 0.1, 0.5), out);
    paint(t1, prog(t, w, 0.4, 0.4), out);
    if (t2) paint(t2, prog(t, w, 0.5, 0.4), out);
  };
};

BUILD.dim = (o, ctx) => {
  const w = W(o),
    parts = [];
  const ar = "url(#dw-ar)",
    h = o.axis !== "v";
  const [a, b] = o.range,
    at = o.at;
  (o.ext || []).forEach((e, i) => {
    if (e == null) return;
    const p = i ? b : a,
      sg = Math.sign(at - e) || 1;
    parts.push(
      prep(
        el(
          "line",
          h
            ? { x1: p, y1: e + sg * 3, x2: p, y2: at + sg * 5, class: "ext" }
            : { x1: e + sg * 3, y1: p, x2: at + sg * 5, y2: p, class: "ext" },
          ctx.main,
        ),
        "d",
      ),
    );
  });
  parts.push(
    prep(
      el(
        "line",
        h
          ? {
              x1: a,
              y1: at,
              x2: b,
              y2: at,
              class: "dl",
              "marker-start": ar,
              "marker-end": ar,
            }
          : {
              x1: at,
              y1: a,
              x2: at,
              y2: b,
              class: "dl",
              "marker-start": ar,
              "marker-end": ar,
            },
        ctx.main,
      ),
      "f",
    ),
  );
  const lx = h ? (a + b) / 2 : at - 6,
    ly = h ? (o.below ? at + 15 : at - 5) : (a + b) / 2;
  const tt = prep(
    el(
      "text",
      {
        x: lx,
        y: ly,
        class: o.c || "dt",
        "text-anchor": "middle",
        transform: h ? null : `rotate(-90 ${lx} ${ly})`,
      },
      ctx.main,
    ),
    "f",
  );
  tt.textContent = o.label;
  parts.push(tt);
  return (t) =>
    parts.forEach((e, i) => paint(e, prog(t, w, i * 0.06, 0.4), outf(t, w)));
};

BUILD.panel = (o, ctx) => {
  const w = W(o),
    rh = def(o.rowH, 52),
    gap = def(o.gap, 12),
    rows = [];
  const title = o.title
    ? prep(el("text", { x: o.x, y: o.y - 14, class: "vt" }, ctx.main), "f")
    : null;
  if (title) title.textContent = o.title;
  const act = o.active || [];
  o.rows.forEach((r, i) => {
    const ry = o.y + i * (rh + gap),
      rw = o.w;
    const hi = el(
      "rect",
      { x: o.x, y: ry, width: rw, height: rh, rx: 10, class: "hug" },
      ctx.main,
    );
    hi.style.opacity = "0";
    const dot = el(
      "circle",
      { cx: o.x + 18, cy: ry + 18, r: 4.5, class: "dot" },
      ctx.main,
    );
    dot.style.opacity = "0";
    const box = prep(
      el(
        "rect",
        { x: o.x, y: ry, width: rw, height: rh, rx: 10, class: "thin" },
        ctx.main,
      ),
      "d",
    );
    const nm = prep(
      el(
        "text",
        { x: o.x + 36, y: ry + (r.desc ? 23 : rh / 2 + 5), class: "rn" },
        ctx.main,
      ),
      "f",
    );
    nm.textContent = r.name;
    const ds = r.desc
      ? prep(
          el("text", { x: o.x + 36, y: ry + 42, class: "cd" }, ctx.main),
          "f",
        )
      : null;
    if (ds) ds.textContent = r.desc;
    const tg = r.tag
      ? prep(
          el(
            "text",
            {
              x: o.x + rw - 14,
              y: ry + 23,
              class: "dts",
              "text-anchor": "end",
            },
            ctx.main,
          ),
          "f",
        )
      : null;
    if (tg) tg.textContent = r.tag;
    const vl = r.value
      ? prep(
          el(
            "text",
            {
              x: o.x + rw - 16,
              y: ry + rh / 2 + 5,
              class: "val",
              "text-anchor": "end",
            },
            ctx.main,
          ),
          "f",
        )
      : null;
    rows.push({ hi, dot, box, nm, ds, tg, vl, r, i });
  });
  const has = (entry, i) =>
    (Array.isArray(entry[1]) ? entry[1].includes(i) : entry[1] === i) ? 1 : 0;
  return (t) => {
    const out = outf(t, w);
    if (title) paint(title, prog(t, w), out);
    let k = -1;
    for (let i = 0; i < act.length; i++) if (act[i][0] <= t) k = i;
    rows.forEach((rw) => {
      const d = rw.i * 0.1,
        p = prog(t, w, d);
      paint(rw.box, p, out);
      paint(rw.nm, prog(t, w, d + 0.15, 0.4), out);
      if (rw.ds) paint(rw.ds, prog(t, w, d + 0.2, 0.4), out);
      if (rw.tg) paint(rw.tg, prog(t, w, d + 0.3, 0.4), out);
      let wt = 0;
      if (k >= 0) {
        const cur = has(act[k], rw.i),
          prev = k > 0 ? has(act[k - 1], rw.i) : 0;
        wt = lerp(prev, cur, ramp(t, act[k][0], act[k][0] + 0.4));
      }
      for (const pl of o.pulse || [])
        if (pl[1] === rw.i) wt = Math.max(wt, pulse(t, pl[0]));
      const vis = prog(t, w, d, 0.5) > 0 ? out : 0;
      setO(rw.hi, wt * vis);
      setO(rw.dot, wt * vis * (o.dots === false ? 0 : 1));
      if (rw.vl) {
        const [s, a] = textValue(
          { states: rw.r.value, typed: rw.r.typed, typeDur: rw.r.typeDur },
          t,
        );
        setT(rw.vl, s);
        paint(rw.vl, prog(t, w, d + 0.3, 0.4), out * a);
      }
    });
  };
};

BUILD.stack = (o, ctx) => {
  const w = W(o),
    n = o.n,
    area = o.area,
    md = def(o.md, 0.8);
  const layouts = {};
  for (const k in o.layouts) layouts[k] = genLayout(o.layouts[k], n, area);
  const tl = o.timeline;
  const items = [];
  for (let i = 0; i < n; i++) {
    const g = el("g", {}, ctx.main);
    const r = el("rect", { rx: 6, class: o.v || "hug" }, g),
      l1 = el("line", { class: "thin" }, g),
      l2 = el("line", { class: "thin" }, g),
      lab = el("text", { class: "dts" }, g);
    [r, l1, l2, lab].forEach((e) => (e.style.opacity = "0"));
    prep(r, "d");
    prep(l1, "f");
    prep(l2, "f");
    prep(lab, "f");
    lab.textContent = (o.label || "Image {n}").replace("{n}", i + 1);
    items.push({ r, l1, l2, lab });
  }
  const appear = o.appear || [],
    as = o.as || [];
  const boxAt = (name, i) => layouts[name][i];
  const solve = (i, t) => {
    let k = 0;
    for (let j = 0; j < tl.length; j++) if (tl[j][0] <= t) k = j;
    const cur = tl[k][1],
      prevName = k > 0 ? tl[k - 1][1] : cur;
    const p = k > 0 ? eio(clamp01((t - tl[k][0]) / md)) : 1;
    const a = boxAt(prevName, i),
      b = boxAt(cur, i);
    const mid = (bx) => bx && { x: bx.x + bx.w / 2, y: bx.y + bx.h / 2 };
    const A = a || (b && { ...mid(b), w: 0, h: 0, o: 0 }),
      B = b || (a && { ...mid(a), w: 0, h: 0, o: 0 });
    if (!A || !B) return { x: 0, y: 0, w: 0, h: 0, o: 0 };
    const ao = a ? 1 : 0,
      bo = b ? 1 : 0;
    return {
      x: lerp(A.x, B.x, p),
      y: lerp(A.y, B.y, p),
      w: lerp(A.w, B.w, p),
      h: lerp(A.h, B.h, p),
      o: lerp(ao, bo, p),
    };
  };
  return (t) => {
    const out = outf(t, w);
    items.forEach((it, i) => {
      const ap = def(appear[i], 0),
        mode = Array.isArray(as) ? as[i] || "draw" : as || "draw";
      const b = solve(i, t);
      let { x, y, w: bw, h: bh } = b,
        p,
        s = 1,
        dy = 0;
      if (mode === "pop") {
        s = eo(clamp01((t - ap) / 0.6));
        p = s > 0 ? 1 : 0;
        const nw = bw * s,
          nh = bh * s;
        x += (bw - nw) / 2;
        y += (bh - nh) / 2;
        bw = nw;
        bh = nh;
      } else {
        const q = clamp01((t - ap) / 0.8);
        p = clamp01((t - ap) / 0.7);
        dy = (1 - eo(q)) * 16;
      }
      y += dy;
      setA(it.r, { x, y, width: Math.max(bw, 0.1), height: Math.max(bh, 0.1) });
      setA(it.l1, { x1: x, y1: y, x2: x + bw, y2: y + bh });
      setA(it.l2, { x1: x + bw, y1: y, x2: x, y2: y + bh });
      setA(it.lab, { x: x + 9, y: y + 18 });
      const vo = b.o * out;
      if (mode === "pop") {
        it.r.style.strokeDashoffset = 0;
        it.r.style.fillOpacity = 1;
        setO(it.r, s * vo);
        setO(it.l1, s * vo);
        setO(it.l2, s * vo);
        setO(
          it.lab,
          s * vo * clamp01((bw - 90) / 30) * clamp01((bh - 30) / 14),
        );
      } else {
        paint(it.r, p, vo);
        paint(it.l1, clamp01((p - 0.4) / 0.6), vo);
        paint(it.l2, clamp01((p - 0.4) / 0.6), vo);
        paint(
          it.lab,
          clamp01((p - 0.6) / 0.4) *
            clamp01((bw - 90) / 30) *
            clamp01((bh - 30) / 14),
          vo,
        );
      }
    });
  };
};

BUILD.cursor = (o, ctx) => {
  const g = el("g", {}, ctx.main);
  g.style.opacity = "0";
  el(
    "path",
    {
      d: "M0,0 L0,19 L5,14.5 L8.2,21.5 L11,20.2 L7.8,13.4 L14,13.4 Z",
      fill: "#111",
      stroke: "#fff",
      "stroke-width": 1.3,
      "stroke-linejoin": "round",
    },
    g,
  );
  const ring = el(
    "circle",
    { r: 5, fill: "none", stroke: "#111", "stroke-width": 1.4 },
    ctx.main,
  );
  ring.style.opacity = "0";
  const ks = o.keys;
  const pos = (t) => {
    if (t <= ks[0][0]) return [ks[0][1], ks[0][2]];
    for (let i = 0; i < ks.length - 1; i++)
      if (t < ks[i + 1][0]) {
        const p = eio((t - ks[i][0]) / (ks[i + 1][0] - ks[i][0]));
        return [
          lerp(ks[i][1], ks[i + 1][1], p),
          lerp(ks[i][2], ks[i + 1][2], p),
        ];
      }
    const l = ks[ks.length - 1];
    return [l[1], l[2]];
  };
  const win = (t, a, b) =>
    eo(clamp01((t - a) / 0.3)) * (1 - eio(clamp01((t - b) / 0.3)));
  return (t) => {
    const cv = Math.min(
        1,
        (o.show || []).reduce((s, [a, b]) => s + win(t, a, b), 0),
      ),
      [x, y] = pos(t);
    g.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
    setO(g, cv);
    let rv = 0,
      rp = 0;
    for (const c of o.clicks || []) {
      const d = (t - c) / 0.45;
      if (d >= 0 && d < 1) {
        rv = (1 - d) * 0.8;
        rp = d;
      }
    }
    setA(ring, { r: 4 + 18 * rp, cx: x, cy: y });
    setO(ring, rv * cv);
  };
};

BUILD.modal = (o, ctx) => {
  const w = W(o),
    [ax, ay, aw, ah] = o.area,
    [bx, by, bw, bh] = o.box;
  const E = [];
  const add = (e, m, delay) => {
    prep(e, m);
    E.push([e, delay]);
    return e;
  };
  add(
    el(
      "rect",
      {
        x: ax,
        y: ay,
        width: aw,
        height: ah,
        rx: 16,
        class: "hs",
        fill: "url(#dw-hat)",
        "fill-opacity": 0.45,
      },
      ctx.main,
    ),
    "f",
    0,
  );
  add(
    el(
      "rect",
      { x: bx, y: by, width: bw, height: bh, rx: 12, class: "obj" },
      ctx.main,
    ),
    "d",
    0.05,
  );
  add(
    el(
      "line",
      { x1: bx, y1: by + 40, x2: bx + bw, y2: by + 40, class: "thin" },
      ctx.main,
    ),
    "d",
    0.15,
  );
  const tt = add(
    el("text", { x: bx + 20, y: by + 26, class: "vt" }, ctx.main),
    "f",
    0.2,
  );
  tt.textContent = o.title || "";
  add(
    el(
      "line",
      {
        x1: bx + bw - 32,
        y1: by + 12,
        x2: bx + bw - 16,
        y2: by + 28,
        class: "thin",
      },
      ctx.main,
    ),
    "d",
    0.2,
  );
  add(
    el(
      "line",
      {
        x1: bx + bw - 16,
        y1: by + 12,
        x2: bx + bw - 32,
        y2: by + 28,
        class: "thin",
      },
      ctx.main,
    ),
    "d",
    0.25,
  );
  // dialogs set plain: true; without it the body shows an image placeholder
  if (o.plain) {
    return (t) =>
      E.forEach(([e, d]) => paint(e, prog(t, w, d, 0.4), outf(t, w)));
  }
  const ix = bx + 16,
    iy = by + 56,
    iw = bw - 32,
    ih = bh - 72;
  add(
    el(
      "rect",
      { x: ix, y: iy, width: iw, height: ih, rx: 6, class: "hug" },
      ctx.main,
    ),
    "d",
    0.25,
  );
  add(
    el(
      "line",
      { x1: ix, y1: iy, x2: ix + iw, y2: iy + ih, class: "thin" },
      ctx.main,
    ),
    "f",
    0.4,
  );
  add(
    el(
      "line",
      { x1: ix + iw, y1: iy, x2: ix, y2: iy + ih, class: "thin" },
      ctx.main,
    ),
    "f",
    0.4,
  );
  return (t) => E.forEach(([e, d]) => paint(e, prog(t, w, d, 0.4), outf(t, w)));
};

BUILD.keys = (o, ctx) => {
  const w = W(o),
    caps = [];
  o.caps.forEach((c, i) => {
    const x = o.x + i * 56;
    const r = prep(
      el(
        "rect",
        { x, y: o.y, width: 44, height: 44, rx: 8, class: "thin" },
        ctx.main,
      ),
      "d",
    );
    const hi = el(
      "rect",
      { x, y: o.y, width: 44, height: 44, rx: 8, class: "hug" },
      ctx.main,
    );
    hi.style.opacity = "0";
    const tg = prep(
      el(
        "text",
        { x: x + 22, y: o.y + 29, class: "glyph", "text-anchor": "middle" },
        ctx.main,
      ),
      "f",
    );
    tg.textContent = c;
    caps.push({ r, hi, tg });
  });
  const lb = o.label
    ? prep(
        el(
          "text",
          {
            x: o.x + (o.caps.length * 56 - 12) / 2,
            y: o.y + 68,
            class: "dts",
            "text-anchor": "middle",
          },
          ctx.main,
        ),
        "f",
      )
    : null;
  if (lb) lb.textContent = o.label;
  return (t) => {
    const out = outf(t, w);
    caps.forEach((c, i) => {
      paint(c.r, prog(t, w, i * 0.12), out);
      paint(c.tg, prog(t, w, i * 0.12 + 0.2, 0.4), out);
      let v = 0;
      for (const [pt, ci] of o.press || [])
        if (ci === i) v = Math.max(v, pulse(t, pt));
      setO(c.hi, v * out * (prog(t, w, i * 0.12) > 0 ? 1 : 0));
    });
    if (lb) paint(lb, prog(t, w, 0.3, 0.4), out);
  };
};

/* ---------------------------------------------------------------- scene */
export function createScene(svg, scene, docs) {
  svg.setAttribute("viewBox", "0 0 1600 900");
  svg.classList.add("dw");
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  const defs = el("defs", {}, svg);
  const mk = el(
    "marker",
    {
      id: "dw-ar",
      viewBox: "0 0 10 10",
      refX: 10,
      refY: 5,
      markerWidth: 7,
      markerHeight: 7,
      orient: "auto-start-reverse",
      markerUnits: "userSpaceOnUse",
    },
    defs,
  );
  el("path", { d: "M0,1.7 L10,5 L0,8.3 z", class: "arrow" }, mk);
  const pat = el(
    "pattern",
    {
      id: "dw-hat",
      width: 6,
      height: 6,
      patternUnits: "userSpaceOnUse",
      patternTransform: "rotate(45)",
    },
    defs,
  );
  el("line", { x1: 0, y1: 0, x2: 0, y2: 6, class: "hl" }, pat);
  el(
    "rect",
    { class: "border", x: 20, y: 20, width: 1560, height: 860, rx: 16 },
    svg,
  );

  const head = el("g", {}, svg),
    cam = el("g", {}, svg),
    main = el("g", {}, cam),
    endG = el("g", {}, svg);
  const ctx = { main, head };

  // header from the docs data, so a renamed element updates its own film
  const h1 = el("text", { x: 60, y: 80, class: "head" }, head);
  h1.textContent = scene.tag || (docs && docs.tag) || "";
  const h2 = el("text", { x: 60, y: 106, class: "sub" }, head);
  h2.textContent = `${docs && docs.title ? docs.title + " · " : ""}${(docs && docs.package) || "HAX element"}`;

  const updaters = scene.objects.map((o) => {
    const b = BUILD[o.type];
    if (!b) throw new Error("unknown storyboard object type: " + o.type);
    return b(o, ctx);
  });

  const beats = (scene.beats || []).map((b, i) => {
    const w = { in: b.t, d: 0.5, out: def(b.out, null), od: 0.4 };
    const nb = prep(
      el("rect", { x: 60, y: 808, width: 26, height: 26, class: "nb" }, head),
      "d",
    );
    const nt = prep(
      el(
        "text",
        { x: 73, y: 826, class: "nbt", "text-anchor": "middle" },
        head,
      ),
      "f",
    );
    nt.textContent = String(i + 1);
    const ti = prep(el("text", { x: 102, y: 828, class: "ct" }, head), "f");
    ti.textContent = b.title;
    const de = prep(el("text", { x: 102, y: 856, class: "cdd" }, head), "f");
    de.textContent = b.text;
    return (t) => {
      const o = outf(t, w);
      paint(nb, prog(t, w), o);
      paint(nt, prog(t, w, 0.1), o);
      paint(ti, prog(t, w, 0.15), o);
      paint(de, prog(t, w, 0.3), o);
    };
  });

  const end = scene.end;
  if (end) {
    const a = el(
      "text",
      { x: 800, y: 420, class: "hero", "text-anchor": "middle" },
      endG,
    );
    a.textContent = (scene.tag || (docs && docs.tag) || "")
      .replace(/^</, "")
      .replace(/>$/, "");
    el("line", { x1: 700, y1: 446, x2: 900, y2: 446, class: "thin" }, endG);
    const b = el(
      "text",
      {
        x: 800,
        y: 480,
        class: "sub",
        "text-anchor": "middle",
        style: "font-size:16px",
      },
      endG,
    );
    b.textContent = end.line || "";
    const c = el(
      "text",
      { x: 800, y: 540, class: "code", "text-anchor": "middle" },
      endG,
    );
    c.textContent = end.code || "";
  }
  endG.style.opacity = "0";

  const camKeys = scene.camera || [];
  const camAt = (t) => {
    if (!camKeys.length) return [800, 450, 1];
    if (t <= camKeys[0][0]) return camKeys[0].slice(1);
    for (let i = 0; i < camKeys.length - 1; i++) {
      if (t < camKeys[i + 1][0]) {
        const p = eio(
            (t - camKeys[i][0]) / (camKeys[i + 1][0] - camKeys[i][0]),
          ),
          a = camKeys[i],
          b = camKeys[i + 1];
        return [
          lerp(a[1], b[1], p),
          lerp(a[2], b[2], p),
          Math.exp(lerp(Math.log(a[3]), Math.log(b[3]), p)),
        ];
      }
    }
    return camKeys[camKeys.length - 1].slice(1);
  };

  return {
    duration: scene.duration,
    beats: scene.beats || [],
    render(t) {
      const [cx, cy, z] = camAt(t);
      cam.setAttribute(
        "transform",
        `translate(${(800 - cx * z).toFixed(2)} ${(450 - cy * z).toFixed(2)}) scale(${z.toFixed(4)})`,
      );
      const mainO = end ? 1 - ramp(t, end.in - 0.7, end.in - 0.2) : 1;
      cam.style.opacity = mainO;
      head.style.opacity = mainO;
      updaters.forEach((u) => u(t));
      beats.forEach((u) => u(t));
      if (end) {
        endG.style.opacity =
          eo(clamp01((t - end.in) / 0.6)) *
          (1 - eio(clamp01((t - (scene.duration - 0.5)) / 0.45)));
      }
    },
  };
}
