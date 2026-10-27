#!/usr/bin/env node
/**
 * Draft an animated walkthrough storyboard for an element from its docs data.
 *
 * The draft is built from what the element really exposes: its HAX settings
 * (or attributes for elements that are not HAX-capable), its demo markup and a
 * sketch chosen by what kind of element it is (image, video, card, quiz,
 * chart, layout, button, embed and so on). It is a starting point for a
 * person to review in <documentation-player>, not a finished film.
 *
 * usage:
 *   node scripts/draft-element-walkthrough.mjs [--force] [--dry] <element ...>
 *
 * Writes elements/<name>/lib/<tag>.motion.json with review.status "draft".
 * A storyboard that was not made by this script (hand-written), or one a
 * person has approved, is never overwritten unless --force is passed.
 *
 * Node built-ins only.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { extractElementDocs } from "./extract-element-docs.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ELEMENTS = path.join(ROOT, "elements");
const GENERATOR = "draft-element-walkthrough";

/* ------------------------------------------------------------- text helpers */
const clip = (s, n) => {
  s = String(s === undefined || s === null ? "" : s)
    .replace(/\s+/g, " ")
    .trim();
  return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;
};
const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const isUrl = (v) => /^(https?:|\/|\.\/|data:)/.test(String(v));
const stripTags = (h) =>
  String(h || "")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, "\n")
    .split("\n")
    .map((x) => x.replace(/&[a-z]+;/g, " ").trim())
    .filter((x) => x.length > 1);
const sentence = (s) => {
  s = clip(s, 200);
  return s ? s[0].toUpperCase() + s.slice(1) : s;
};

/* ------------------------------------------------- what kind of element is it */
const KINDS = [
  ["compare", /compare/],
  ["quiz", /quiz|question|self.?check|fill-in|mark-the|flash.?card|rating|check.?list|nudge|grade/],
  ["video", /video|media-player|gif|aframe|unity|3d|screen-recorder|slide|h5p|pdf/],
  ["audio", /audio|spotify|music|midi|sound|podcast|mp3|sheet-music/],
  ["chart", /chart|donut|count|progress|metric|tableau|data viz|visuali/],
  ["table", /table|csv|grade-book|spreadsheet/],
  ["timeline", /timeline|list|bibliograph|calendar|ics|collection|playlist|play-list|pager/],
  ["quote", /quote|testimonial|blockquote|sarcasm/],
  ["note", /note|sidenote|callout|license|flag|course-design|course-model|nudge|tooltip|toast|popover/],
  ["disclosure", /collapse|details|tabs|accordion|menu-button|map-menu|modal/],
  ["code", /code|markdown|md-block|html|latex|la-tex|math|terminal|editor|container/],
  ["embed", /embed|iframe|discord|disqus|twitter|wikipedia|web-baseline|github|linkedin|portal/],
  ["card", /card|badge|author|product|glance|character|vcf|contact|sdg|offering|citation|share/],
  ["layout", /grid|layout|section|columns|plate|full-width/],
  ["button", /cta|button|action|explosion|horn|scroll|login|search|picker|input|range|datetime|emoji|autocomplete|fields/],
  ["heading", /heading|type-writer|word|logo|vocab|term|text|hex/],
  ["icon", /icon|q-r|qr/],
  ["image", /image|img|figure|photo|parallax|gallery|meme|picture|imagemap|inspector|pan-zoom/],
];
// tags the keyword rules above get wrong
const KIND_OVERRIDES = {
  "grade-book": "table",
  "place-holder": "image",
  "q-r": "icon",
  "git-corner": "icon",
  "hexagon-loader": "icon",
  "self-reflective-nudge": "note",
  "pdf-browser-viewer": "embed",
  "a11y-carousel": "image",
  "page-contents-menu": "timeline",
  "simple-toolbar": "button",
  "voice-recorder": "audio",
  "word-count": "heading",
};
export function kindOf(d) {
  if (KIND_OVERRIDES[d.tag]) return KIND_OVERRIDES[d.tag];
  const hay = [d.tag, d.title, ...(d.tags || [])].join(" ").toLowerCase();
  for (const [k, re] of KINDS) if (re.test(d.tag) || re.test(d.title.toLowerCase())) return k;
  for (const [k, re] of KINDS) if (re.test(hay)) return k;
  return "generic";
}

/* ---------------------------------------------------------- settings to show */
function settingsOf(d) {
  const s = (d.hax && d.hax.settings) || {};
  const demo = (d.hax.demoSchema && d.hax.demoSchema[0]) || {};
  const props = demo.properties || {};
  const pool = [...(s.configure || []), ...(s.advanced || [])].filter(
    (x) => (x.property || x.attribute || x.slot !== undefined) && x.inputMethod !== "code-editor",
  );
  const seen = new Set();
  const rows = [];
  for (const x of pool) {
    const isSlot = !x.property && !x.attribute;
    const attrRec = d.attributes.find((a) => (x.property ? a.property === x.property : a.name === x.attribute));
    const name = isSlot
      ? x.slot
        ? `slot ${x.slot}`
        : "content"
      : (attrRec && attrRec.name) || x.attribute || kebab(x.property);
    if (seen.has(name)) continue;
    seen.add(name);
    let value = isSlot ? "" : props[x.property || x.attribute];
    if (value === undefined && attrRec && attrRec.default !== "") {
      value = String(attrRec.default).replace(/^["'`]|["'`]$/g, "");
    }
    rows.push({
      name,
      attr: isSlot ? null : (attrRec && attrRec.name) || x.attribute || kebab(x.property),
      slot: isSlot ? x.slot || "" : null,
      title: x.title || name,
      desc: x.description || "",
      input: x.inputMethod || "textfield",
      options: x.options && typeof x.options === "object" ? Object.keys(x.options) : [],
      value,
      fromDemo: props[x.property || x.attribute] !== undefined,
    });
  }
  // prefer settings the demo actually uses, then text and select inputs
  const rank = (r) =>
    (r.fromDemo ? 0 : 4) +
    (r.input === "select" ? 0 : r.input === "boolean" ? 2 : r.input === "haxupload" ? 1 : 1) +
    (r.slot !== null ? 1 : 0);
  return rows
    .map((r, i) => [r, rank(r) * 100 + i])
    .sort((a, b) => a[1] - b[1])
    .map((x) => x[0])
    .slice(0, 4);
}

/** attributes of elements that are not HAX-capable */
// attributes that are plumbing (schema, ARIA, layout hooks) rather than
// something a person sets to change what the element does
const PLUMBING = /^(typeof|property|resource|prefix|vocab|about|schema-.*|dir|lang|role|tabindex|hidden|id|class|style|slot|aria-.*|data-.*|t|disabled-.*|editing|edit-mode|_.*)$/;
const humanize = (name) => String(name).replace(/[-_]+/g, " ").trim();

function attributesOf(d) {
  return d.attributes
    .filter((a) => !PLUMBING.test(a.name))
    .sort((x, y) => (y.description ? 1 : 0) - (x.description ? 1 : 0))
    .slice(0, 4)
    .map((a) => ({
      name: a.name,
      attr: a.name,
      slot: null,
      title: humanize(a.name),
      desc: a.description,
      input: /boolean/.test(a.type) ? "boolean" : /number/.test(a.type) ? "number" : "textfield",
      options: [],
      value: a.default ? String(a.default).replace(/^["'`]|["'`]$/g, "") : undefined,
    }));
}

/** a short noun for a setting, for beat titles */
function shortName(r) {
  const t = r.title || "";
  const usable = t.length <= 22 && !/\?$/.test(t) && !/^(is|are|should|does|do|can|show|hide|enable|disable|use|allow)\b/i.test(t);
  return humanize(usable ? t : r.attr || r.name).toLowerCase();
}

/** one sentence about what a setting does */
/** the setting's label as people see it in the HAX sidebar */
const fieldLabel = (r) => {
  const t = humanize(r.title || r.attr || r.name);
  return t.charAt(0).toUpperCase() + t.slice(1);
};

/** whether a setting has a description worth showing as is */
function goodDesc(r) {
  const d = (r.desc || "").replace(/\s+/g, " ").trim();
  return d.length > 14 && d.length <= 78 && !/\?$/.test(d) && /[a-z]/.test(d) && !/^(todo|@|https?:)/i.test(d);
}

/** one sentence about what a setting does */
function captionFor(r, hax) {
  const name = r.attr || r.name;
  if (goodDesc(r)) return sentence(r.desc.replace(/\s+/g, " ").trim().replace(/\.?$/, "."));
  if (r.input === "boolean")
    return hax ? `Switch ${fieldLabel(r)} on or off in the sidebar.` : `Add the ${name} attribute to switch it on.`;
  if (r.input === "select" && r.options.length) return clip(`Choose ${r.options.slice(0, 3).join(", ")}${r.options.length > 3 ? " and more" : ""} for ${fieldLabel(r)}.`, 80);
  if (r.input === "haxupload") return `Upload a file or paste a link for ${fieldLabel(r)}.`;
  if (r.input === "colorpicker") return `Pick a color for ${fieldLabel(r)}.`;
  if (r.slot !== null) return `${fieldLabel(r)} goes inside the tag as content.`;
  return hax ? `Fill in the ${fieldLabel(r)} field in the sidebar.` : `Add a ${name} attribute to the tag.`;
}

/** two settings in one sentence when neither has its own description */
function captionForPair(a, b, hax) {
  const plain = (r) => !goodDesc(r) && r.slot === null && !["boolean", "select", "haxupload", "colorpicker"].includes(r.input);
  if (plain(a) && plain(b)) {
    return hax
      ? `Fill in the ${fieldLabel(a)} and ${fieldLabel(b)} fields in the sidebar.`
      : `Add ${a.attr || a.name} and ${b.attr || b.name} attributes to the tag.`;
  }
  return `${captionFor(a, hax)} ${captionFor(b, hax)}`;
}

function exampleValue(r) {
  if (typeof r.value === "object" || typeof r.value === "function") r.value = undefined;
  if (r.value !== undefined && r.value !== null && r.value !== "") {
    if (typeof r.value === "boolean") return r.value;
    return String(r.value);
  }
  if (r.input === "boolean") return true;
  if (r.input === "select" && r.options.length) return r.options[0];
  if (r.input === "number" || r.input === "slider") return "3";
  if (r.input === "colorpicker") return "blue";
  if (r.input === "haxupload") return "photo.jpg";
  if (r.input === "iconpicker") return "star";
  return clip(r.title, 18);
}
function subFor(r) {
  if (r.input === "select" && r.options.length)
    return clip(r.options.slice(0, 3).join(" · ") + (r.options.length > 3 ? " …" : ""), 34);
  if (r.input === "boolean") return "on or off";
  if (r.input === "haxupload") return "upload or link";
  if (r.input === "colorpicker") return "any color";
  if (r.input === "iconpicker") return "pick an icon";
  if (r.input === "slider" || r.input === "number") return "a number";
  const v = exampleValue(r);
  return typeof v === "string" && !isUrl(v) ? clip(`"${v}"`, 30) : "text";
}

/* ------------------------------------------------------------------ sketches */
// Each sketch draws inside the preview area and returns its objects plus the
// x positions along its bottom edge where setting callouts can attach.
const AREA = { x: 520, y: 180, w: 400, h: 330 };

function sketch(kind, d, sample, at) {
  const { x, y, w, h } = AREA;
  const o = [];
  const pop = [at, 0.6];
  const title = (s, ty, extra = {}) => o.push({ type: "text", s: clip(s, 30), x: x + 24, y: ty, c: "vt", in: at + 0.4, ...extra });
  const lines = (n, ly, lw = w - 48, gap = 22) => {
    for (let i = 0; i < n; i++) {
      const lx2 = x + 24 + (i === n - 1 ? lw * 0.6 : lw);
      o.push({ type: "line", x1: x + 24, y1: ly + i * gap, x2: lx2, y2: ly + i * gap, v: "thin", in: at + 0.5 + i * 0.12, d: 0.5 });
    }
  };
  const frame = (v = "hug") => o.push({ type: "box", x, y, w, h, v, r: 8, pop });
  switch (kind) {
    case "image":
      o.push({ type: "box", x, y, w, h: h - 60, v: "hug", r: 6, xbox: true, pop });
      o.push({ type: "text", s: clip(sample.title, 40), x: x + 4, y: y + h - 30, c: "cdd", in: at + 0.6 });
      break;
    case "compare":
      o.push({ type: "box", x, y, w, h, v: "hug", r: 6, xbox: true, pop });
      o.push({ type: "line", x1: x + w / 2, y1: y, x2: x + w / 2, y2: y + h, v: "bold", in: at + 0.5 });
      o.push({ type: "glyph", name: "circle", x: x + w / 2, y: y + h / 2, s: 18, in: at + 0.7, keys: [[at + 2.4, { x: x + w * 0.3 }, 1.2], [at + 4, { x: x + w * 0.7 }, 1.2]] });
      o.push({ type: "text", s: "before", x: x + 14, y: y + 26, c: "dts", in: at + 0.8 });
      o.push({ type: "text", s: "after", x: x + w - 14, y: y + 26, c: "dts", a: "end", in: at + 0.8 });
      break;
    case "video":
      o.push({ type: "box", x, y: y + 20, w, h: 225, v: "hug", r: 6, pop });
      o.push({ type: "glyph", name: "play", x: x + w / 2, y: y + 132, s: 34, in: at + 0.5 });
      o.push({ type: "line", x1: x + 20, y1: y + 268, x2: x + w - 20, y2: y + 268, v: "thin", in: at + 0.6 });
      o.push({ type: "glyph", name: "circle", x: x + 20, y: y + 268, s: 7, v: "bold", in: at + 0.7, keys: [[at + 9, { x: x + w * 0.65 }, 8]] });
      o.push({ type: "text", s: clip(sample.title, 40), x: x + 4, y: y + 306, c: "cdd", in: at + 0.7 });
      break;
    case "audio":
      o.push({ type: "box", x, y: y + 110, w, h: 110, v: "hug", r: 55, pop });
      o.push({ type: "glyph", name: "play", x: x + 58, y: y + 165, s: 24, in: at + 0.5 });
      o.push({ type: "text", s: clip(sample.title, 26), x: x + 100, y: y + 152, c: "vt", in: at + 0.6 });
      o.push({ type: "line", x1: x + 100, y1: y + 180, x2: x + w - 40, y2: y + 180, v: "thin", in: at + 0.6 });
      o.push({ type: "glyph", name: "circle", x: x + 100, y: y + 180, s: 6, v: "bold", in: at + 0.7, keys: [[at + 9, { x: x + 250 }, 8]] });
      break;
    case "card":
      frame("obj");
      o.push({ type: "box", x: x + 16, y: y + 16, w: w - 32, h: 140, v: "well", r: 4, xbox: true, in: at + 0.4 });
      title(sample.title, y + 196, sample.titleStates ? { states: sample.titleStates, typed: true } : {});
      lines(3, y + 232);
      break;
    case "quote":
      o.push({ type: "line", x1: x + 8, y1: y + 30, x2: x + 8, y2: y + 240, v: "bold", in: at, d: 0.6 });
      o.push({ type: "text", s: "“", x: x + 30, y: y + 80, c: "big", in: at + 0.3 });
      o.push({ type: "text", s: clip(sample.body[0] || sample.title, 38), x: x + 30, y: y + 130, c: "cdd", in: at + 0.5 });
      o.push({ type: "text", s: clip(sample.body[1] || "", 38), x: x + 30, y: y + 156, c: "cdd", in: at + 0.6 });
      o.push({ type: "text", s: "— " + clip(sample.title, 28), x: x + 30, y: y + 214, c: "dts", in: at + 0.8, ...(sample.titleStates ? { states: sample.titleStates.map(([t, s]) => [t, "— " + s]) } : {}) });
      break;
    case "note":
      o.push({ type: "box", x, y: y + 40, w, h: 220, v: "well", r: 8, pop });
      o.push({ type: "glyph", name: /stop|license/.test(d.tag) ? "warning" : "info", x: x + 46, y: y + 100, s: 22, in: at + 0.5 });
      title(sample.title, y + 108, { x: x + 84, ...(sample.titleStates ? { states: sample.titleStates, typed: true } : {}) });
      o.push(...[0, 1, 2].map((i) => ({ type: "line", x1: x + 84, y1: y + 150 + i * 24, x2: x + (i === 2 ? 260 : w - 30), y2: y + 150 + i * 24, v: "thin", in: at + 0.6 + i * 0.1 })));
      break;
    case "disclosure":
      [0, 1, 2].forEach((i) => {
        o.push({ type: "box", x, y: y + 20 + i * 64, w, h: 52, v: i ? "hug" : "obj", r: 6, in: at + i * 0.15, keys: i ? [[at + 2.6, { y: y + 20 + i * 64 + 120 }, 0.6]] : [[at + 2.6, { h: 172 }, 0.6]] });
        o.push({ type: "glyph", name: "plus", x: x + w - 30, y: y + 46 + i * 64, s: 10, in: at + 0.3 + i * 0.15, keys: i ? [[at + 2.6, { y: y + 46 + i * 64 + 120 }, 0.6]] : [] });
      });
      o.push({ type: "text", s: clip(sample.title, 30), x: x + 20, y: y + 52, c: "vt", in: at + 0.4 });
      o.push({ type: "text", s: clip(sample.body[0] || "Hidden until opened", 40), x: x + 20, y: y + 100, c: "cdd", in: at + 2.9 });
      o.push({ type: "text", s: clip(sample.body[1] || "", 40), x: x + 20, y: y + 126, c: "cdd", in: at + 3.1 });
      break;
    case "quiz":
      frame("obj");
      title(sample.title, y + 46, sample.titleStates ? { states: sample.titleStates, typed: true } : {});
      [0, 1, 2].forEach((i) => {
        o.push({ type: "box", x: x + 24, y: y + 84 + i * 62, w: w - 48, h: 48, v: "hug", r: 6, in: at + 0.5 + i * 0.12 });
        o.push({ type: "glyph", name: "circle", x: x + 50, y: y + 108 + i * 62, s: 9, in: at + 0.6 + i * 0.12 });
        o.push({ type: "text", s: clip(sample.body[i] || `Answer ${i + 1}`, 32), x: x + 72, y: y + 113 + i * 62, c: "dt", in: at + 0.7 + i * 0.12 });
      });
      o.push({ type: "glyph", name: "check", x: x + w - 54, y: y + 170, s: 14, v: "bold", in: at + 2.6 });
      break;
    case "chart": {
      o.push({ type: "line", x1: x + 30, y1: y + h - 30, x2: x + w - 10, y2: y + h - 30, v: "thin", in: at });
      o.push({ type: "line", x1: x + 30, y1: y + 20, x2: x + 30, y2: y + h - 30, v: "thin", in: at });
      const hs = [120, 200, 150, 250, 180];
      hs.forEach((bh, i) => {
        const bx = x + 60 + i * 66;
        o.push({ type: "box", x: bx, y: y + h - 32, w: 40, h: 2, v: "hug", r: 2, in: at + 0.3, keys: [[at + 1.2 + i * 0.15, { y: y + h - 30 - bh, h: bh }, 0.8]] });
      });
      break;
    }
    case "table":
      frame("obj");
      for (let i = 1; i < 5; i++) o.push({ type: "line", x1: x, y1: y + i * 66, x2: x + w, y2: y + i * 66, v: i === 1 ? "bold" : "thin", in: at + 0.3 + i * 0.08 });
      for (let i = 1; i < 3; i++) o.push({ type: "line", x1: x + (i * w) / 3, y1: y, x2: x + (i * w) / 3, y2: y + h, v: "thin", in: at + 0.5 });
      ["Name", "Value", "Notes"].forEach((s, i) => o.push({ type: "text", s, x: x + 16 + (i * w) / 3, y: y + 40, c: "dts", in: at + 0.7 }));
      break;
    case "timeline":
      o.push({ type: "line", x1: x + 30, y1: y + 20, x2: x + 30, y2: y + h - 20, v: "thin", in: at });
      [0, 1, 2, 3].forEach((i) => {
        o.push({ type: "glyph", name: "circle", x: x + 30, y: y + 50 + i * 76, s: 9, v: "bold", in: at + 0.3 + i * 0.2 });
        o.push({ type: "text", s: clip(sample.body[i] || `Item ${i + 1}`, 34), x: x + 60, y: y + 55 + i * 76, c: "dt", in: at + 0.4 + i * 0.2 });
        o.push({ type: "line", x1: x + 60, y1: y + 74 + i * 76, x2: x + 260, y2: y + 74 + i * 76, v: "thin", in: at + 0.5 + i * 0.2 });
      });
      break;
    case "layout":
      frame("slot");
      [0, 1].forEach((i) => {
        o.push({ type: "box", x: x + 16 + i * ((w - 16) / 2), y: y + 16, w: (w - 48) / 2, h: h - 32, v: "hug", r: 4, in: at + 0.4 + i * 0.2, label: `col-${i + 1}` });
        o.push(...[0, 1, 2].map((j) => ({ type: "line", x1: x + 32 + i * ((w - 16) / 2), y1: y + 70 + j * 24, x2: x + 150 + i * ((w - 16) / 2), y2: y + 70 + j * 24, v: "thin", in: at + 0.7 + j * 0.1 })));
      });
      break;
    case "button":
      o.push({ type: "box", x: x + 60, y: y + 130, w: w - 120, h: 64, v: "obj", r: 32, pop });
      o.push({ type: "text", s: clip(sample.title, 24), x: x + w / 2, y: y + 168, c: "vt", a: "middle", in: at + 0.4, ...(sample.titleStates ? { states: sample.titleStates } : {}) });
      o.push({ type: "cursor", keys: [[at + 0.6, x + w + 20, y + 260], [at + 1.8, x + w / 2 + 40, y + 172]], show: [[at + 0.6, at + 3.2]], clicks: [at + 2.1] });
      break;
    case "embed":
      frame("obj");
      o.push({ type: "line", x1: x, y1: y + 40, x2: x + w, y2: y + 40, v: "thin", in: at + 0.3 });
      o.push({ type: "glyph", name: "link", x: x + 24, y: y + 20, s: 9, in: at + 0.4 });
      o.push({ type: "text", s: clip(sample.url || d.tag, 34), x: x + 44, y: y + 25, c: "dts", in: at + 0.5 });
      o.push({ type: "box", x: x + 24, y: y + 64, w: w - 48, h: 150, v: "well", r: 4, xbox: true, in: at + 0.6 });
      lines(2, y + 250);
      break;
    case "code":
      o.push({ type: "box", x, y: y + 20, w, h: 260, v: "well", r: 6, pop });
      sample.code.slice(0, 7).forEach((s, i) => o.push({ type: "text", s: clip(s, 44), x: x + 20, y: y + 58 + i * 30, c: "cd", in: at + 0.5 + i * 0.12 }));
      break;
    case "heading":
      o.push({ type: "text", s: clip(sample.title, 16), x: x + w / 2, y: y + 160, c: "big", a: "middle", in: at, ...(sample.titleStates ? { states: sample.titleStates.map(([t, s]) => [t, clip(s, 16)]), typed: true } : { typed: true, states: [[at, clip(sample.title, 16)]], typeDur: 1.2 }) });
      o.push({ type: "line", x1: x + 40, y1: y + 190, x2: x + w - 40, y2: y + 190, v: "thin", in: at + 1 });
      break;
    case "icon":
      o.push({ type: "box", x: x + 100, y: y + 40, w: 200, h: 200, v: "hug", r: 8, pop });
      o.push({ type: "glyph", name: /q-r|qr/.test(d.tag) ? "lock" : "check", x: x + 200, y: y + 140, s: 56, v: "bold", in: at + 0.4 });
      o.push({ type: "text", s: clip(sample.title, 30), x: x + 200, y: y + 280, c: "cdd", a: "middle", in: at + 0.6 });
      break;
    default:
      frame("hug");
      o.push({ type: "text", s: `<${d.tag}>`, x: x + w / 2, y: y + h / 2, c: "code", a: "middle", in: at + 0.4 });
  }
  // callouts attach just under the lowest thing the sketch draws
  let bottom = y;
  for (const it of o) {
    const end = it.keys ? it.keys.reduce((m, k) => Math.max(m, (k[1].y || 0) + (k[1].h || it.h || 0)), 0) : 0;
    bottom = Math.max(bottom, end, it.y !== undefined ? it.y + (it.h || 0) : 0, it.y2 || 0);
  }
  return { objects: o, attach: [x + 70, x + 250], bottom: Math.min(bottom + 8, 560) };
}

/* --------------------------------------------------------------- storyboard */
export function draftWalkthrough(d) {
  const kind = kindOf(d);
  const hax = d.haxCapable && d.hax && d.hax.settings;
  const rows = hax ? settingsOf(d) : attributesOf(d);
  const demo = (d.hax && d.hax.demoSchema && d.hax.demoSchema[0]) || {};
  const props = demo.properties || {};
  const propTexts = Object.values(props).filter(
    (v) => typeof v === "string" && !isUrl(v) && v.length > 2 && v.length < 60 && /[a-z]/i.test(v) && !/^#|^\d/.test(v),
  );
  const contentTexts = stripTags(demo.content);
  const texts = [...propTexts, ...contentTexts];
  const url = Object.values(props).find((v) => typeof v === "string" && /^https?:/.test(v));
  const sample = {
    title: texts[0] || d.title,
    body: contentTexts.length ? contentTexts.filter((t) => t !== texts[0]) : texts.slice(1),
    url: url ? url.replace(/^https?:\/\//, "") : "",
    code: d.demoHtml ? d.demoHtml.split("\n") : [`<${d.tag}></${d.tag}>`],
  };
  // a text setting the sketch can show changing, when there is one
  const live = rows.find((r) => r.input !== "select" && r.input !== "boolean" && r.input !== "haxupload" && /title|heading|label|name|question|term|text/i.test(r.title + r.name));

  const T = { drop: hax ? 2.6 : 1.4, s1: 5.0, s2: 7.4, s3: 10.0, s4: 12.4, edit: 14.8, end: 17.8, dur: 20.5 };
  const actTimes = [T.s1, T.s2, T.s3, T.s4];
  if (live) {
    const i = rows.indexOf(live);
    const v = exampleValue(live);
    sample.titleStates = [[T.drop, clip(sample.title, 30)]];
    if (typeof v === "string" && v !== sample.title && !isUrl(v)) sample.titleStates.push([actTimes[i], clip(v, 30)]);
  }
  const sk = sketch(kind, d, sample, T.drop);
  const objects = [];

  // beat 1: drag the block in (HAX) or import the module
  if (hax) {
    objects.push({ type: "text", s: "HAX blocks", x: 80, y: 200, c: "vt", in: 0.4, out: 4.4 });
    objects.push({ type: "box", x: 80, y: 214, w: 330, h: 62, v: "obj", r: 10, in: 0.5, out: 4.4 });
    objects.push({ type: "text", s: clip(d.title, 24), x: 104, y: 251, c: "rn", in: 0.7, out: 4.4 });
    objects.push({ type: "glyph", name: "plus", x: 380, y: 245, s: 10, in: 0.8, out: 4.4 });
    // a ghost of the block follows the cursor to the drop point
    objects.push({ type: "box", x: 196, y: 232, w: 150, h: 36, v: "slot", r: 8, in: 1.5, d: 0.2, out: T.drop, od: 0.2, keys: [[T.drop - 0.1, { x: 650, y: 322 }, T.drop - 1.7]] });
    objects.push({ type: "cursor", keys: [[0.8, 300, 360], [1.4, 240, 248], [T.drop - 0.1, 720, 340]], show: [[0.8, T.drop + 0.6]], clicks: [1.5, T.drop] });
  } else {
    objects.push({ type: "text", s: `import "${clip(d.import, 52)}";`, x: 80, y: 150, c: "cd", in: 0.5, typed: true, states: [[0.5, `import "${clip(d.import, 52)}";`]], typeDur: 1.4 });
  }
  objects.push(...sk.objects);

  // settings panel and the code it writes
  const panelIn = hax ? 4.6 : 2.4;
  if (rows.length) {
    objects.push({
      type: "panel",
      title: hax ? "HAX settings" : "attributes",
      x: 80,
      y: 214,
      w: 330,
      rowH: 62,
      gap: 12,
      in: panelIn,
      rows: rows.map((r) => ({
        name: clip(r.name, 22),
        desc: clip(
          r.title.toLowerCase() === r.name.replace(/-/g, " ").toLowerCase() && r.desc ? r.desc : r.title,
          32,
        ),
      })),
      active: rows.map((r, i) => [actTimes[i], i]).concat([[T.edit, 0]]),
    });
  }
  // the markup grows a line at a time as each setting is used; the closing
  // lines slide down to make room
  const cx = 1000,
    y0 = 240,
    lh = 32;
  const attrRows = rows.map((r, i) => [r, actTimes[i]]).filter(([r]) => r.attr);
  const slotRows = rows.map((r, i) => [r, actTimes[i]]).filter(([r]) => !r.attr);
  objects.push({ type: "text", x: cx, y: y0, c: "code", in: T.drop + 0.2, s: clip(`<${d.tag}${attrRows.length ? "" : ">"}`, 46) });
  attrRows.forEach(([r, t], i) => {
    const v = exampleValue(r);
    objects.push({ type: "text", x: cx + 22, y: y0 + (i + 1) * lh, c: "code", in: t, s: clip(v === true ? r.attr : `${r.attr}="${clip(v, 24)}"`, 44) });
  });
  // a line that sits below n attribute lines once they have all appeared
  const sliding = (s, base, extra) => {
    const keys = attrRows.map(([, t], i) => [t, { y: y0 + (base + i + 1) * lh }, 0.4]);
    objects.push({ type: "text", x: extra ? cx + 22 : cx, y: y0 + base * lh, c: "code", in: T.drop + 0.3, s, ...(keys.length ? { keys } : {}) });
  };
  let line = 1;
  if (attrRows.length) sliding(">", line++);
  slotRows.forEach(([r, t]) => {
    const v = clip(sample.body[0] || r.title, 18);
    // track keys must not precede the line's own start, so start it already
    // moved past the attribute lines that appeared before it
    const before = attrRows.filter(([, at]) => at <= t).length;
    const keys = attrRows
      .map(([, at], i) => [at, { y: y0 + (line + i + 1) * lh }, 0.4])
      .filter(([at]) => at > t);
    objects.push({ type: "text", x: cx + 22, y: y0 + (line + before) * lh, c: "code", in: t, s: clip(r.slot ? `<p slot="${r.slot}">${v}</p>` : `<p>${v}</p>`, 44), ...(keys.length ? { keys } : {}) });
    line++;
  });
  sliding(`</${d.tag}>`, line);

  // callouts under the sketch, one per setting while its beat runs
  rows.forEach((r, i) => {
    const t = actTimes[i];
    const px = sk.attach[i % 2];
    objects.push({ type: "callout", px, py: sk.bottom, ex: px + 26, ey: sk.bottom + 52, label: clip(r.name, 20), sub: subFor(r), dir: 1, in: t + 0.2, out: t + 2.2 });
  });

  // beats
  const pair = (a, b) => {
    const rs = rows.slice(a, b);
    if (!rs.length) return null;
    const names = rs.map(shortName);
    const both = `Set ${names.join(" and ")}`;
    const title = both.length <= 30 ? both : clip(`Set ${names[0]}`, 30);
    let text = captionFor(rs[0], hax);
    if (rs[1]) {
      const more = captionForPair(rs[0], rs[1], hax);
      if (more.length <= 80) text = more;
    }
    return { title, text: clip(text, 80) };
  };
  const beats = [];
  beats.push(
    hax
      ? { t: 0.3, out: 4.6, title: clip(`Add ${d.title}`, 30), text: clip(`Find ${d.title} in the HAX blocks menu and drop it on the page.`, 80) }
      : { t: 0.3, out: 4.6, title: "Import it", text: "Load the module once; the tag then works anywhere in your HTML." },
  );
  const b2 = pair(0, 2);
  if (b2) beats.push({ t: 4.8, out: 9.8, ...b2 });
  const b3 = pair(2, 4);
  if (b3) beats.push({ t: 10, out: 14.6, ...b3 });
  beats.push(
    hax
      ? { t: 14.8, out: 17.4, title: "Edit in HAX", text: "Each setting is in the HAX sidebar and the page updates as you change it." }
      : { t: 14.8, out: 17.4, title: "Use it on a page", text: clip(`Set attributes in the markup to configure <${d.tag}>.`, 80) },
  );
  if (!b2 && !b3) beats[beats.length - 1].t = 5;

  const shortDemo = (d.demoHtml || "").split("\n")[0];
  return {
    version: 1,
    tag: d.tag,
    duration: T.dur,
    camera: [],
    objects,
    beats,
    end: {
      in: T.end,
      line: clip(d.description || d.title, 60),
      code: clip(shortDemo.length < 70 ? shortDemo : `<${d.tag}></${d.tag}>`, 70),
    },
    surfaceHash: d.surfaceHash,
    review: {
      status: "draft",
      generator: GENERATOR,
      sketch: kind,
      notes: "Generated from docs data. Check the sketch, wording and which settings are shown.",
    },
  };
}

function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const dry = args.includes("--dry");
  const names = args.filter((a) => !a.startsWith("--"));
  if (!names.length) {
    console.error("usage: draft-element-walkthrough.mjs [--force] [--dry] <element ...>");
    process.exit(1);
  }
  let wrote = 0;
  for (const name of names) {
    let d;
    try {
      d = extractElementDocs(name, ELEMENTS);
    } catch (e) {
      console.warn(`skipped ${name}: ${e.message}`);
      continue;
    }
    const file = path.join(ELEMENTS, name, "lib", `${d.tag}.motion.json`);
    if (fs.existsSync(file) && !force) {
      let prev = null;
      try {
        prev = JSON.parse(fs.readFileSync(file, "utf8"));
      } catch {
        prev = null;
      }
      if (!prev || !prev.review || prev.review.generator !== GENERATOR || prev.review.status === "approved") {
        console.warn(`kept ${name}: storyboard was not generated by this script (use --force)`);
        continue;
      }
    }
    const scene = draftWalkthrough(d);
    if (dry) {
      console.log(`${name}\t${scene.review.sketch}\t${scene.beats.length} beats`);
      continue;
    }
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(scene, null, 2) + "\n");
    wrote++;
  }
  if (!dry) console.log(`drafted ${wrote} storyboard(s)`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
