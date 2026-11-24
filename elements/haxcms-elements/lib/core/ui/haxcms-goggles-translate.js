/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
/*
 * The goggles' Translate lens, the parts that are not drawing: finding the
 * interface text on screen that comes from an element's this.t, telling which
 * locale file each string lives in, and writing the issue a translator sends.
 *
 * Rules the lens keeps:
 * - A translator never sees a key or a file. They see the English, what HAX
 *   says now in their language, and a box for their own words.
 * - The locale file of a suggestion is worked out from the i18n manager's own
 *   registration (namespace and localesPath), never from anything typed, and
 *   is always elements/<package>/.../locales/<namespace>.<lang>.json.
 * - A suggestion keeps every {placeholder} its English has, or it cannot be
 *   added to the list.
 * - The issue's prose is in the translator's language; everything a machine
 *   needs is in one fenced `json hax-i18n` block (format hax-i18n/1).
 */
import { I18NManagerStore } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

export const TRANSLATE_LIST_KEY = "haxcms-goggles-translate-list";
export const TRANSLATE_LANG_KEY = "haxcms-goggles-translate-lang";
export const TRANSLATE_FORMAT = "hax-i18n/1";
// the lenses a link can put on (?goggles=<lens>)
export const LINK_LENSES = ["code", "makers", "flag", "translate"];
const TOKEN = /\{[a-zA-Z0-9_]+\}/g;
// a BCP 47 tag as people write them: en, fr, pt-BR, zh-Hant, es-419
const LANG = /^[a-zA-Z]{2,3}(-[a-zA-Z0-9]{2,8}){0,3}$/;

/** a language tag from a link or a picker, or "" when it is not one */
export const cleanLang = (value) => {
  const v = typeof value === "string" ? value.trim() : "";
  return LANG.test(v) ? v : "";
};
const base = (l) => (l || "en").split("-")[0].toLowerCase();
export const isEnglish = (l) => base(l) === "en";

/** a language's own name, as its speakers write it */
export const langName = (l) => {
  try {
    const n = new Intl.DisplayNames([l], { type: "language" }).of(l);
    return n ? n.charAt(0).toUpperCase() + n.slice(1) : l;
  } catch {
    return l;
  }
};

/** the {placeholders} a string must keep */
export const tokensOf = (s) => String(s || "").match(TOKEN) || [];

/** which of the English's placeholders a suggestion lost */
export const lostTokens = (en, suggested) =>
  tokensOf(en).filter((k) => String(suggested || "").indexOf(k) === -1);

/** still the English, when there are words in it to translate (not "{percent}%") */
export const stillEnglish = (s, lang) =>
  !isEnglish(lang) &&
  s.now === s.en &&
  /\p{L}{2,}/u.test(String(s.en).replace(TOKEN, ""));

/** a test for one string as it shows on screen, placeholders filled in */
const matcher = (value) => {
  const v = String(value).trim();
  if (!v) {
    return null;
  }
  if (v.indexOf("{") === -1) {
    return (text) => text === v;
  }
  const parts = v.split(TOKEN);
  // each filled placeholder is some text; the parts between are literal
  return (text) => {
    if (!text.startsWith(parts[0]) || !text.endsWith(parts[parts.length - 1])) {
      return false;
    }
    let at = parts[0].length;
    const end = text.length - parts[parts.length - 1].length;
    for (let i = 1; i < parts.length - 1; i++) {
      const next = parts[i] ? text.indexOf(parts[i], at + 1) : at + 1;
      if (next === -1 || next > end) {
        return false;
      }
      at = next + parts[i].length;
    }
    return at < end || parts.length === 1;
  };
};

/**
 * The repo path of the locale file a registration reads, for one language.
 * Only a path inside a @haxtheweb package's folder is returned.
 */
export const localeFileOf = (detail, lang) => {
  const l = cleanLang(lang);
  if (!detail || !detail.localesPath || !detail.namespace || !l) {
    return "";
  }
  if (!/^[a-zA-Z0-9_.-]+$/.test(detail.namespace)) {
    return "";
  }
  let path = "";
  try {
    path = new URL(
      String(detail.localesPath).replace(/\/?$/, "/"),
      globalThis.document.baseURI,
    ).pathname;
  } catch {
    return "";
  }
  const parts = path.split("/").filter((p) => p && p !== ".");
  // the package name is the first part after @haxtheweb (node_modules and
  // the CDN), or after elements (the monorepo's own demos)
  let at = parts.indexOf("@haxtheweb");
  if (at === -1) {
    at = parts.lastIndexOf("elements");
  }
  if (at === -1 || at === parts.length - 1 || parts.indexOf("..") !== -1) {
    return "";
  }
  return (
    "elements/" +
    parts.slice(at + 1).join("/") +
    "/" +
    detail.namespace +
    "." +
    l +
    ".json"
  );
};

/** a name a translator can read for a part of HAX */
export const partName = (ctx) => {
  const hp = ctx && ctx.constructor ? ctx.constructor.haxProperties : null;
  if (hp && typeof hp === "object" && hp.gizmo && hp.gizmo.title) {
    return hp.gizmo.title;
  }
  return String(ctx ? ctx.localName : "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

/** the strings of one element: key, English, and what it says now */
export const stringsOf = (ctx) => {
  if (!ctx || !ctx._t || !ctx.t) {
    return [];
  }
  return Object.keys(ctx._t)
    .filter(
      (k) =>
        typeof ctx._t[k] === "string" &&
        ctx._t[k].trim() &&
        typeof ctx.t[k] === "string",
    )
    .map((k) => ({ key: k, en: ctx._t[k], now: ctx.t[k] }));
};

/** every connected element that speaks through this.t, once, skipping some tags */
export const speakers = (skip) => {
  const seen = new Set();
  const out = [];
  (I18NManagerStore.elements || []).forEach((d) => {
    const c = d.context;
    if (
      !c ||
      seen.has(c) ||
      !c.isConnected ||
      !c.t ||
      !c._t ||
      (skip && skip.indexOf(c.localName) !== -1)
    ) {
      return;
    }
    seen.add(c);
    out.push({ ctx: c, detail: d });
  });
  return out;
};

/**
 * The interface text on screen that comes from an element's this.t: text,
 * and placeholders people read in empty fields. Only text that is really
 * seen counts: a skip link moved off screen or text under something else is
 * left out.
 */
export const scanScreen = (lang, skip) => {
  const doc = globalThis.document;
  const vw = globalThis.innerWidth;
  const vh = globalThis.innerHeight;
  const marks = [];
  const all = speakers(skip);
  const owners = new Set(all.map((s) => s.ctx));
  const deepHit = (x, y) => {
    let h = doc.elementFromPoint(x, y);
    while (h && h.shadowRoot) {
      const n = h.shadowRoot.elementFromPoint(x, y);
      if (!n || n === h) {
        break;
      }
      h = n;
    }
    return h;
  };
  const within = (a, b) => {
    let n = b;
    while (n) {
      if (n === a) {
        return true;
      }
      n = n.assignedSlot || n.parentNode || n.host;
    }
    return false;
  };
  const seen = (r, el) => {
    if (!(
      r.width > 1 &&
      r.height > 1 &&
      r.bottom > 0 &&
      r.right > 0 &&
      r.top < vh &&
      r.left < vw
    )) {
      return false;
    }
    const h = deepHit(
      Math.min(Math.max(r.left + r.width / 2, 0), vw - 1),
      Math.min(Math.max(r.top + r.height / 2, 0), vh - 1),
    );
    return !!h && (within(el, h) || within(h, el));
  };
  all.forEach(({ ctx, detail }) => {
    const strings = stringsOf(ctx)
      .map((s) => Object.assign(s, { test: matcher(s.now) }))
      .filter((s) => s.test);
    if (!strings.length) {
      return;
    }
    const add = (r, el, hit) =>
      marks.push({
        x: Math.max(r.left - 3, 2),
        y: Math.max(r.top - 2, 2),
        w: Math.min(r.width + 6, vw - 4),
        h: r.height + 4,
        el: el,
        ctx: ctx,
        detail: detail,
        key: hit.key,
        en: hit.en,
        now: hit.now,
        missing: stillEnglish(hit, lang),
      });
    // its own tree, and the trees of the plain parts it draws (not other speakers')
    const walk = (root) => {
      const w = doc.createTreeWalker(
        root,
        globalThis.NodeFilter.SHOW_ELEMENT | globalThis.NodeFilter.SHOW_TEXT,
      );
      let n = w.nextNode();
      while (n) {
        if (n.nodeType === 3) {
          const host = n.parentElement;
          const text = n.textContent.replace(/\s+/g, " ").trim();
          if (
            text &&
            host &&
            host.localName !== "style" &&
            host.localName !== "script"
          ) {
            const hit = strings.find((s) => s.test(text));
            if (hit) {
              const range = doc.createRange();
              range.selectNodeContents(n);
              const r = range.getBoundingClientRect();
              if (seen(r, host)) {
                add(r, host, hit);
              }
            }
          }
        } else {
          const ph = n.getAttribute("placeholder");
          if (ph && !n.value) {
            const hit = strings.find((s) => s.test(ph.trim()));
            if (hit) {
              const r = n.getBoundingClientRect();
              if (seen(r, n)) {
                add(r, n, hit);
              }
            }
          }
          if (n.shadowRoot && !owners.has(n)) {
            walk(n.shadowRoot);
          }
        }
        n = w.nextNode();
      }
    };
    walk(ctx.shadowRoot || ctx);
  });
  return marks;
};

/** the issue a translator sends: their words in their language, the rest for the ingest */
export const translateIssue = ({ list, lang, note, theme, base }) => {
  const items = Array.isArray(list) ? list : [];
  const parts = [...new Set(items.map((x) => x.namespace))];
  const title =
    "[translate] " +
    lang +
    ": " +
    items.length +
    (items.length === 1 ? " suggestion" : " suggestions") +
    (parts.length
      ? " (" +
        parts.slice(0, 3).join(", ") +
        (parts.length > 3 ? ", +" + (parts.length - 3) : "") +
        ")"
      : "");
  const block = {
    format: TRANSLATE_FORMAT,
    lang: lang,
    base: base || "haxtheweb/webcomponents",
    theme: theme || "",
    changes: items.map((x) => ({
      file: x.file,
      namespace: x.namespace,
      key: x.key,
      en: x.en,
      now: x.now,
      suggested: x.suggested,
      why: x.why,
      note: x.note || "",
      page: x.page || "",
    })),
  };
  // markdown the translator typed stays text: no code fence can end early
  const plain = (s) => String(s || "").replace(/`/g, "'");
  const lines = [
    "<!-- Sent with the goggles Translate lens. The hax-i18n block below is read by the translation ingest; leave it as it is. -->",
    "### " + langName(lang) + " (" + lang + ")",
    plain(note).trim() || "-",
    "",
    "### Suggestions",
  ];
  items.forEach((x, i) => {
    lines.push(
      i +
        1 +
        ". **" +
        plain(x.en) +
        "**: " +
        (x.now ? "`" + plain(x.now) + "` → " : "") +
        "`" +
        plain(x.suggested) +
        "` (" +
        x.why +
        ", " +
        x.namespace +
        ")" +
        (x.note ? "\n   > " + plain(x.note).replace(/\n/g, " ") : ""),
    );
  });
  lines.push(
    "",
    "```json hax-i18n",
    JSON.stringify(block, null, 1).replace(/`/g, "\\u0060"),
    "```",
  );
  return { title: title, body: lines.join("\n") };
};

/** the goggles a link asks for: ?goggles=<lens>&lang=<language> */
export const gogglesFromLink = (search) => {
  let params = null;
  try {
    params = new URLSearchParams(
      typeof search === "string" ? search : globalThis.location.search,
    );
  } catch {
    return null;
  }
  const lens = params.get("goggles");
  if (!lens || LINK_LENSES.indexOf(lens) === -1) {
    return null;
  }
  return { lens: lens, lang: cleanLang(params.get("lang")) };
};

/** this page, with the Translate lens and a language in its link */
export const translateLink = (lang, href) => {
  let url = null;
  try {
    url = new URL(href || globalThis.location.href);
  } catch {
    return "";
  }
  url.searchParams.set("goggles", "translate");
  const l = cleanLang(lang);
  if (l) {
    url.searchParams.set("lang", l);
  } else {
    url.searchParams.delete("lang");
  }
  url.hash = "";
  return url.href;
};
