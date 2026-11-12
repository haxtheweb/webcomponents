/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
/**
 * The ecosystem web's data model, layout and geometry, kept free of the DOM so
 * it can be tested on its own. Ported from the PRAW ecosystem player
 * (https://github.com/haxtheweb/praw/tree/main/ecosystem); the source format is
 * the same: a Mermaid flowchart subset with `%%@` annotations, plus a JSON file
 * of details per web.
 */

// DDD named colours a tile may use (`color=<name>` on its %%@ line)
export const COLORS = {
  pughBlue: "#96bee6",
  beaverBlue: "#1e407c",
  nittanyNavy: "#001e44",
  slateGray: "#314d64",
  creekTeal: "#3ea39e",
  skyBlue: "#009cde",
  shrineTan: "#b88965",
  roarGolden: "#bf8226",
  original87Pink: "#bc204b",
  discoveryCoral: "#f2665e",
  wonderPurple: "#491d70",
  athertonViolet: "#ac8dce",
  inventOrange: "#e98300",
  keystoneYellow: "#ffd100",
  opportunityGreen: "#008755",
  futureLime: "#99cc00",
  forestGreen: "#4a7729",
  landgrantBrown: "#6a3028",
  limestoneGray: "#a2aaad",
  coalyGray: "#262626",
};
export const MOTIONS = [
  "pop",
  "wiggle",
  "tilt",
  "pulse",
  "lift",
  "spin",
  "nudge",
  "strike",
  "glow",
];
const SHAPES = {
  "((": "circle",
  "{{": "hex",
  "[[": "org",
  "[(": "cyl",
  "([": "pill",
  "[": "box",
  ">": "talk",
};
const OPENERS = ["((", "{{", "[[", "[(", "([", "[", ">"];
const CLOSERS = ["))", "}}", "]]", ")]", "])", "]"];
const ARROWS = ["-.->", "-->", "---", "--o", "==>"];
const WORD = /^\w+$/;
/** text between brackets, without its surrounding spaces and quotes */
function unquote(s) {
  let t = String(s).trim();
  if (t.startsWith('"')) t = t.slice(1);
  if (t.endsWith('"')) t = t.slice(0, -1);
  return t.trim();
}
const KINDS = {
  "-->": "rel",
  "==>": "pillar",
  "-.->": "schema",
  "--o": "org",
  "---": "contrib",
};
export const KIND_ORDER = ["pillar", "contrib", "org", "schema", "rel"];
export const DEF_RINGS = [0, 182, 440, 640, 880];
export const DEF_SIZES = [92, 62, 50, 46, 40];
const TAU = Math.PI * 2;
const wrap = (a) => {
  a %= TAU;
  return a < 0 ? a + TAU : a;
};
const adiff = (a, b) => {
  const d = wrap(a - b);
  return d > Math.PI ? d - TAU : d;
};

/** `a=1 b portal=x` -> {a: "1", b: true, portal: "x"} */
export function kv(s) {
  const o = {};
  (s || "")
    .split(/\s+/)
    .filter(Boolean)
    .forEach((p) => {
      const i = p.indexOf("=");
      if (i < 0) o[p] = true;
      else o[p.slice(0, i)] = p.slice(i + 1);
    });
  return o;
}

/** WCAG relative luminance of a #rrggbb colour */
export function luminance(hex) {
  const c = [1, 3, 5]
    .map((i) => parseInt(hex.substr(i, 2), 16) / 255)
    .map((v) =>
      v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4),
    );
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
/** black or white, whichever reads better on the tile colour */
export function glyphFor(hex) {
  const L = luminance(hex);
  return (L + 0.05) / 0.05 >= 1.05 / (L + 0.05) ? "#000" : "#fff";
}

/** Parse one web's .mmd text. Returns {groups, nodes (Map), edges, errors, rings, sizes}. */
export function parseWeb(text) {
  const groups = [];
  const nodes = new Map();
  const edges = [];
  const errors = [];
  const ann = [];
  const lay = {};
  let cur = null;
  String(text || "")
    .split(/\r?\n/)
    .forEach((raw, i) => {
      // one space between words, so the matching below never backtracks over runs of whitespace
      const l = raw.split(/\s/).filter(Boolean).join(" ");
      const ln = i + 1;
      if (!l) return;
      if (l.startsWith("%%@")) {
        const w = l.slice(3).trim().split(" ");
        if ((w[0] === "group" || w[0] === "node") && WORD.test(w[1] || ""))
          ann.push({ t: w[0], id: w[1], a: kv(w.slice(2).join(" ")), ln });
        else if (w[0] === "layout") {
          const a = kv(w.slice(1).join(" "));
          if (a.rings) lay.rings = String(a.rings).split(",").map(Number);
          if (a.sizes) lay.sizes = String(a.sizes).split(",").map(Number);
        } else if (w[0] !== "scene")
          errors.push(`Line ${ln}: unknown annotation "${w[0]}"`);
        return;
      }
      if (
        l.startsWith("%%") ||
        l.startsWith("flowchart") ||
        l.startsWith("graph")
      )
        return;
      if (l.startsWith("subgraph ")) {
        const rest = l.slice(9);
        const cut = [rest.indexOf(" "), rest.indexOf("[")].filter(
          (x) => x >= 0,
        );
        const id = cut.length ? rest.slice(0, Math.min(...cut)) : rest;
        const a = rest.indexOf("[");
        const b = rest.lastIndexOf("]");
        const label = a >= 0 && b > a ? unquote(rest.slice(a + 1, b)) : "";
        if (WORD.test(id)) {
          cur = { id, label: label || id, tier: 2 };
          groups.push(cur);
          return;
        }
      }
      if (l === "end") {
        cur = null;
        return;
      }
      const head = l.match(/^\w+/);
      if (head) {
        const id = head[0];
        const rest = l.slice(id.length).trim();
        const arrow = ARROWS.find((x) => rest.startsWith(x));
        if (arrow) {
          let tail = rest.slice(arrow.length).trim();
          let label = "";
          if (tail.startsWith("|")) {
            const j = tail.indexOf("|", 1);
            if (j > 0) {
              label = tail.slice(1, j).trim();
              tail = tail.slice(j + 1).trim();
            }
          }
          if (WORD.test(tail)) {
            edges.push({ from: id, to: tail, kind: KINDS[arrow], label, ln });
            return;
          }
        }
        const open = OPENERS.find((x) => rest.startsWith(x));
        const close = CLOSERS.find((x) => rest.endsWith(x));
        if (open && close && rest.length >= open.length + close.length) {
          if (nodes.has(id)) {
            errors.push(`Line ${ln}: "${id}" is declared twice`);
            return;
          }
          nodes.set(id, {
            id,
            label: unquote(rest.slice(open.length, rest.length - close.length)),
            shape: SHAPES[open],
            group: cur,
            tier: 2,
            color: COLORS.limestoneGray,
            motion: "pop",
          });
          return;
        }
      }
      errors.push(`Line ${ln}: couldn't read "${l.slice(0, 40)}"`);
    });
  ann.forEach((a) => {
    if (a.t === "group") {
      const g = groups.find((x) => x.id === a.id);
      if (!g) errors.push(`Line ${a.ln}: no subgraph "${a.id}"`);
      else if (a.a.tier != null) g.tier = +a.a.tier;
      return;
    }
    const n = nodes.get(a.id);
    if (!n) {
      errors.push(`Line ${a.ln}: no node "${a.id}"`);
      return;
    }
    if (a.a.icon) n.icon = a.a.icon;
    if (a.a.image) n.image = a.a.image;
    if (a.a.motion) n.motion = a.a.motion;
    if (a.a.new) n.isNew = true;
    if (a.a.mono) n.mono = String(a.a.mono).slice(0, 5);
    if (a.a.logo) n.logo = a.a.logo;
    if (a.a.web) n.web = a.a.web;
    if (a.a.portal) n.portal = a.a.portal === true ? true : String(a.a.portal);
    if (a.a.color) {
      const c =
        COLORS[a.a.color] ||
        (/^#[0-9a-f]{6}$/i.test(a.a.color) ? a.a.color : null);
      if (!c) errors.push(`Line ${a.ln}: unknown DDD color "${a.a.color}"`);
      else {
        n.color = c;
        n.colorName = a.a.color;
      }
    }
    if (MOTIONS.indexOf(n.motion) < 0)
      errors.push(`Line ${a.ln}: unknown motion "${n.motion}"`);
  });
  nodes.forEach((n) => {
    n.tier = n.group ? n.group.tier : 2;
  });
  edges.forEach((e) =>
    [e.from, e.to].forEach((id) => {
      if (!nodes.has(id))
        errors.push(`Line ${e.ln}: edge uses undeclared node "${id}"`);
    }),
  );
  return { groups, nodes, edges, errors, rings: lay.rings, sizes: lay.sizes };
}

/**
 * Attach a web's JSON details to its parsed model. `lookup(webId)` returns the
 * model of another web, so a portal tile can borrow its look and details from
 * the web that owns it.
 */
export function attachDetails(M, D, lookup) {
  M.D = D || {};
  M.meta = M.D.meta || {};
  const dn = M.D.nodes || {};
  Object.keys(dn).forEach((id) => {
    if (!M.nodes.has(id))
      M.errors.push(`JSON: details for unknown node "${id}"`);
  });
  M.nodes.forEach((n) => {
    n.doc = dn[n.id] || {};
    if (!n.portal) return;
    const src = lookup ? lookup(n.portal === true ? "main" : n.portal) : null;
    const b = src && src.nodes.get(n.id);
    if (!b) {
      M.errors.push(`Portal "${n.id}" has no node in its home web`);
      return;
    }
    [
      "icon",
      "image",
      "mono",
      "logo",
      "color",
      "colorName",
      "motion",
      "isNew",
      "shape",
      "web",
    ].forEach((k) => {
      if (b[k] != null && !(k === "web" && n.web)) n[k] = b[k];
    });
    if (n.label === n.id) n.label = b.label;
    n.doc = Object.assign({}, b.doc || {}, n.doc);
  });
  M.evidence = M.D.evidence || {};
  M.tours = (M.D.tours || []).map((t) => ({
    ...t,
    scenes: (t.scenes || []).map((s) => ({
      caption: s.caption,
      ids: (s.nodes || []).filter((id) => M.nodes.has(id)),
    })),
  }));
  if (!M.tours.length)
    M.tours = [
      {
        id: "everyone",
        label: "Everyone",
        message: "",
        scenes: [{ caption: "Everything at once.", ids: [] }],
      },
    ];
  return M;
}

/**
 * Place every tile on its ring. Sets n.x, n.y, n.a on each node and returns
 * {width, center, rings, sizes, neighbours}. Deterministic: the same web
 * always lays out the same way.
 */
export function layoutWeb(M) {
  const rings = M.rings && M.rings.length ? M.rings : DEF_RINGS;
  const sizes = M.sizes && M.sizes.length ? M.sizes : DEF_SIZES;
  let maxT = 0;
  M.nodes.forEach((n) => {
    maxT = Math.max(maxT, n.tier);
  });
  const width =
    2 * ((rings[maxT] != null ? rings[maxT] : rings[rings.length - 1]) + 80);
  const C = width / 2;
  const T = [[], [], [], [], []];
  M.nodes.forEach((n) => T[Math.min(4, Math.max(0, n.tier))].push(n));
  const nb = new Map();
  M.nodes.forEach((n) => nb.set(n.id, []));
  M.edges.forEach((e) => {
    if (nb.has(e.from) && nb.has(e.to)) {
      nb.get(e.from).push(e.to);
      nb.get(e.to).push(e.from);
    }
  });
  T[0].forEach((n, i) => {
    n.x = C + (i - (T[0].length - 1) / 2) * 118;
    n.y = C;
    n.a = null;
  });
  let units = 0;
  let prev = null;
  const slots = [];
  T[2].forEach((n) => {
    if (prev && n.group !== prev) units += 0.7;
    slots.push(units);
    units += 1;
    prev = n.group;
  });
  units += 0.7;
  T[2].forEach((n, i) => {
    n.a = wrap(-Math.PI / 2 + (slots[i] / units) * TAU);
  });
  [1, 3, 4].forEach((t) =>
    T[t].forEach((n, i, arr) => {
      n.a = wrap(-Math.PI / 2 + (i / arr.length) * TAU);
    }),
  );
  const place = (t, maxTier) => {
    T[t].forEach((n) => {
      let sx = 0;
      let sy = 0;
      nb.get(n.id).forEach((id) => {
        const o = M.nodes.get(id);
        if (o.a == null || o.tier > maxTier) return;
        const w = o.tier === 2 ? 1 : o.tier === t ? 0.5 : 0.7;
        sx += Math.cos(o.a) * w;
        sy += Math.sin(o.a) * w;
      });
      n.want = sx || sy ? wrap(Math.atan2(sy, sx)) : n.a;
    });
    const arr = T[t].slice().sort((a, b) => a.want - b.want);
    const N = arr.length;
    if (!N) return;
    let best = 0;
    let bs = 1e9;
    for (let k = 0; k < 240; k++) {
      const off = ((k / 240) * TAU) / N;
      let s = 0;
      arr.forEach((n, j) => {
        const d = adiff(off + (j / N) * TAU, n.want);
        s += d * d;
      });
      if (s < bs) {
        bs = s;
        best = off;
      }
    }
    arr.forEach((n, j) => {
      n.a = wrap(best + (j / N) * TAU);
    });
  };
  const tt = M.meta && M.meta.timelineTier;
  if (tt != null) {
    const arr = T[tt]
      .slice()
      .sort(
        (a, b) =>
          (a.doc.year || 9999) - (b.doc.year || 9999) ||
          a.label.localeCompare(b.label),
      );
    arr.forEach((n, j) => {
      n.a = wrap(-Math.PI / 2 + (j / arr.length) * TAU);
    });
    const free = [1, 2, 3, 4].filter((t) => t !== tt && T[t].length);
    for (let it = 0; it < 5; it++) free.forEach((t) => place(t, 4));
  } else {
    for (let it = 0; it < 4; it++) {
      place(1, 3);
      place(3, 3);
    }
    for (let it = 0; it < 3; it++) place(4, 4);
  }
  [1, 2, 3, 4].forEach((t) =>
    T[t].forEach((n) => {
      const R = rings[t] != null ? rings[t] : rings[rings.length - 1];
      n.x = C + R * Math.cos(n.a);
      n.y = C + R * Math.sin(n.a);
    }),
  );
  return { width, center: C, rings, sizes, neighbours: nb };
}

/** A quadratic curve between two placed tiles, bowed toward the center for same-ring links. */
export function edgePath(M, e, C) {
  const a = M.nodes.get(e.from);
  const b = M.nodes.get(e.to);
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  let cx;
  let cy;
  if (a.tier === b.tier && a.tier > 0) {
    const ux = C - mx;
    const uy = C - my;
    const ul = Math.hypot(ux, uy) || 1;
    cx = mx + (ux / ul) * len * 0.28;
    cy = my + (uy / ul) * len * 0.28;
  } else {
    const s = (a.a || 0) > (b.a || 0) ? 1 : -1;
    cx = mx - dy * 0.1 * s;
    cy = my + dx * 0.1 * s;
  }
  return `M${a.x.toFixed(1)} ${a.y.toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}

/** Split a label into lines of at most `max` characters, breaking on spaces. */
export function labelLines(t, max) {
  const out = [];
  let line = "";
  String(t || "")
    .split(" ")
    .forEach((x) => {
      if ((line + " " + x).trim().length > max && line) {
        out.push(line);
        line = x;
      } else line = (line + " " + x).trim();
    });
  out.push(line);
  return out;
}
export function labelWidth(n, tier) {
  return n.shape === "talk"
    ? 18
    : tier === 0
      ? 20
      : tier === 1 || tier === 2
        ? 11
        : 13;
}

/** The square that holds every listed tile, padded, as an SVG view {x, y, w}. */
export function boxOf(M, ids, pad, minW, width) {
  let x0 = 1e9;
  let y0 = 1e9;
  let x1 = -1e9;
  let y1 = -1e9;
  ids.forEach((id) => {
    const n = M.nodes.get(id);
    if (!n) return;
    x0 = Math.min(x0, n.x);
    y0 = Math.min(y0, n.y);
    x1 = Math.max(x1, n.x);
    y1 = Math.max(y1, n.y);
  });
  if (x0 > x1) return { x: 0, y: 0, w: width };
  const w = Math.max(minW || 0, x1 - x0 + pad * 2, y1 - y0 + pad * 2);
  return { x: (x0 + x1) / 2 - w / 2, y: (y0 + y1) / 2 - w / 2 + 10, w };
}

/** The steps of a tour: each adds its tiles to what is already shown. */
export function tourSteps(M, tourId) {
  const t = M.tours.find((x) => x.id === tourId) || M.tours[0];
  return t.scenes.map((s) => ({
    caption: s.caption,
    ids: s.ids,
    label: t.label,
  }));
}
/** The tiles visible at a step (null = all). */
export function visibleAt(steps, step) {
  if (step < 0 || !steps.length) return null;
  const S = steps[Math.min(step, steps.length - 1)];
  if (step >= steps.length - 1 && !S.ids.length) return null;
  return new Set(steps.slice(0, step + 1).flatMap((s) => s.ids));
}

/** A URL is followed only when it is http(s); anything else becomes "#". */
export function safeUrl(u) {
  return /^https?:\/\//i.test(u || "") ? u : "#";
}

/**
 * Build every web in a bundle ({order: [...ids], webs: {id: {mmd, json}}}) into
 * laid-out models. The main web is built first, so portals can find their home.
 */
export function buildWebs(bundle) {
  const raw = (bundle && bundle.webs) || {};
  const order = (bundle && bundle.order) || Object.keys(raw);
  const models = {};
  const lookup = (id) => {
    if (models[id]) return models[id];
    const r = raw[id];
    if (!r) return null;
    const M = parseWeb(r.mmd);
    models[id] = M;
    attachDetails(M, r.json, lookup);
    M.geo = layoutWeb(M);
    M.id = id;
    return M;
  };
  if (raw.main) lookup("main");
  order.forEach((id) => lookup(id));
  return models;
}

/** The SVG shapes a glyph may use, and the attributes kept on each. */
const GLYPH_ATTRS = {
  path: ["d", "fill-rule", "clip-rule"],
  circle: ["cx", "cy", "r"],
  ellipse: ["cx", "cy", "rx", "ry"],
  rect: ["x", "y", "width", "height", "rx", "ry"],
  polygon: ["points"],
  polyline: ["points"],
  line: ["x1", "y1", "x2", "y2"],
};
const GLYPH_COMMON = ["transform", "opacity", "fill", "stroke", "stroke-width"];

/**
 * Turn an icon's SVG markup into plain shape records ({tag, a: {attr: value}})
 * so the drawing can render it with templates instead of injecting markup.
 * Only basic shapes and their geometry survive; scripts, links, styles and
 * event attributes are dropped. Groups are flattened (their transform is
 * not kept, which the HAX iconsets do not use).
 * @param {string} markup the inner markup of an <svg>, or a whole <svg> file
 * @param {string} [vb] viewBox, when the markup has no <svg> root
 * @returns {{vb: string, shapes: Array<{tag: string, a: Object}>}|null}
 */
export function parseGlyph(markup, vb) {
  if (!markup || typeof globalThis.DOMParser === "undefined") return null;
  const whole = markup.trim().startsWith("<svg") || markup.includes("<svg ");
  const text = whole
    ? markup
    : `<svg xmlns="http://www.w3.org/2000/svg">${markup}</svg>`;
  const doc = new globalThis.DOMParser().parseFromString(text, "image/svg+xml");
  const root = doc.documentElement;
  if (!root || root.nodeName !== "svg") return null;
  const shapes = [];
  root.querySelectorAll("*").forEach((el) => {
    const keep = GLYPH_ATTRS[el.nodeName];
    if (!keep) return;
    const a = {};
    keep.concat(GLYPH_COMMON).forEach((k) => {
      const v = el.getAttribute(k);
      if (v == null) return;
      // paint is either "none" or the icon's own color, never a URL
      if ((k === "fill" || k === "stroke") && v !== "none") {
        a[k] = "currentColor";
        return;
      }
      a[k] = v;
    });
    shapes.push({ tag: el.nodeName, a });
  });
  if (!shapes.length) return null;
  return {
    vb: vb || root.getAttribute("viewBox") || "0 0 24 24",
    shapes,
  };
}

/** Ease-out cubic, for camera moves. */
export function easeOut(p) {
  return 1 - Math.pow(1 - p, 3);
}

/** The camera part way (e, 0..1) from view a to view b. */
export function lerpView(a, b, e) {
  return {
    x: a.x + (b.x - a.x) * e,
    y: a.y + (b.y - a.y) * e,
    w: a.w + (b.w - a.w) * e,
  };
}
