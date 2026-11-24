/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * What a goggles report is made of: the issue it opens, a pointer to the
 * exact element (through shadow roots), the replay bundle that lets a
 * maintainer see a private page's problem, and the accessibility checks.
 * No GitHub API is called from here: reports are links to new-issue pages,
 * and "already reported?" is a link to a GitHub search.
 */

export const ISSUES_REPO = "https://github.com/haxtheweb/issues";
// where a replay opens: HAXcms in the browser, on a scratch site that is never saved
export const REPLAY_HOME = "https://browser.hax.cloud/";

/*
 * One issue form per kind of report, in haxtheweb/issues
 * (.github/ISSUE_TEMPLATE/goggles-*.yml). The form applies the labels, so
 * they land for every reporter: GitHub ignores a labels= link parameter
 * from anyone who cannot already label issues.
 */
export const REPORT_KINDS = {
  bug: { form: "goggles-bug.yml", word: "bug" },
  wish: { form: "goggles-idea.yml", word: "idea" },
  docs: { form: "goggles-docs.yml", word: "docs" },
  a11y: { form: "goggles-a11y.yml", word: "a11y" },
};

// a new-issue link longer than this risks being cut off by the browser or GitHub
export const URL_BUDGET = 7600;
// a packed replay bundle up to this size rides in the link; bigger ones are attached
export const INLINE_BUNDLE = 2400;

/**
 * The issue title. The tag goes first, in backticks, so a search for the
 * tag in titles finds every goggles report about it.
 * @param {String} kind a REPORT_KINDS key
 * @param {String} tag
 * @param {String} summary the reporter's short description
 */
export function reportTitle(kind, tag, summary) {
  const word = (REPORT_KINDS[kind] || REPORT_KINDS.bug).word;
  return (
    "`" + tag + "` " + word + ": " + ((summary || "").trim() || "needs a look")
  );
}

/**
 * The Translate lens's report (several strings, one language) in the goggles
 * translation form. Its title and body stay as the lens writes them, so the
 * hax-i18n block reaches the translation ingest untouched.
 */
export function translateUrl(report, lang) {
  const p = new URLSearchParams();
  p.set("template", "goggles-translation.yml");
  p.set("title", report.title);
  p.set("description", report.body);
  p.set("locale", lang || "");
  return ISSUES_REPO + "/issues/new?" + p.toString();
}

/** open issues in haxtheweb/issues with the tag in the title */
export function openIssuesUrl(tag) {
  return (
    ISSUES_REPO +
    "/issues?q=" +
    encodeURIComponent("is:issue is:open in:title " + tag)
  );
}

/*
 * A pointer to one element through the shadow roots: the element, the host
 * of the root it lives in, that host's host, and so on up to the document.
 * Each step is the tag and its position among same-tag elements in its root,
 * which is enough to find the same element again on the same page.
 */
export function elementPath(el) {
  const steps = [];
  let node = el;
  while (node && steps.length < 24) {
    const root = node.getRootNode ? node.getRootNode() : null;
    if (!root || !root.querySelectorAll) {
      break;
    }
    const same = Array.from(root.querySelectorAll(node.localName));
    steps.unshift({ tag: node.localName, n: Math.max(same.indexOf(node), 0) });
    node = root.host || null;
  }
  return steps;
}

/** the path as people read it: tags only, long ones shortened in the middle */
export function pathText(steps) {
  const tags = steps.map((s) => s.tag);
  const shown =
    tags.length > 6 ? tags.slice(0, 2).concat("...", tags.slice(-3)) : tags;
  return shown.join(" > ");
}

/** the element a path points at, or null when the page has changed */
export function findByPath(steps, doc) {
  let scope = doc || globalThis.document;
  let found = null;
  for (let i = 0; i < steps.length; i++) {
    if (!scope) {
      return null;
    }
    found = scope.querySelectorAll(steps[i].tag)[steps[i].n] || null;
    if (!found) {
      return null;
    }
    scope = found.shadowRoot;
  }
  return found;
}

/*
 * The piece's place in the page content, as child positions from the
 * content's host (the theme in view mode, hax-body while editing). A piece
 * drawn inside another element's shadow root is marked by that element, the
 * deepest one the page content itself holds. Null when the piece is not in
 * the page content.
 */
export function contentMark(el, host) {
  let mark = [];
  let node = el;
  while (node && node !== host) {
    const parent = node.parentElement;
    if (!parent) {
      const root = node.getRootNode ? node.getRootNode() : null;
      // out of a shadow root: what was inside it is not page content
      node = root && root.host ? root.host : null;
      mark = [];
      continue;
    }
    mark.unshift(Array.prototype.indexOf.call(parent.children, node));
    node = parent;
  }
  return node === host ? mark : null;
}

/** "0.2.1" for a link, and back; anything else reads as no mark */
export function markText(mark) {
  return Array.isArray(mark) ? mark.join(".") : "";
}
export function parseMark(text) {
  const t = String(text || "");
  return /^\d{1,4}(\.\d{1,4}){0,40}$/.test(t)
    ? t.split(".").map((n) => parseInt(n, 10))
    : null;
}

/** the element a mark points at under the content host, or null */
export function findByMark(host, mark) {
  let node = host;
  for (let i = 0; node && mark && i < mark.length; i++) {
    node = node.children[mark[i]] || null;
  }
  return mark && mark.length && node !== host ? node : null;
}

/** the link that opens a packed replay on browser.hax.cloud */
export function replayLink(packed) {
  return REPLAY_HOME + "#replay=" + packed;
}

/*
 * Assets that only the site can serve (relative or same-origin URLs) are
 * swapped for placeholders that keep the layout, so a replay never carries
 * or points at private files. Scripts never ride along.
 */
const ASSET_ATTRS = ["src", "poster", "srcset", "href", "data", "source"];
const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 3'%3E%3Crect width='4' height='3' fill='%23ccc'/%3E%3C/svg%3E";
const isPrivate = (value, origin) => {
  const v = String(value || "").trim();
  if (!v || v.indexOf("data:") === 0 || v.charAt(0) === "#") {
    return false;
  }
  try {
    const u = new URL(v, origin + "/");
    return u.origin === origin;
  } catch {
    return true;
  }
};
export function placeholderAssets(markup, origin) {
  const home =
    origin ||
    (globalThis.location ? globalThis.location.origin : "http://localhost");
  const doc = new globalThis.DOMParser().parseFromString(
    "<body>" + String(markup || "") + "</body>",
    "text/html",
  );
  doc.querySelectorAll("script").forEach((s) => s.remove());
  const swapped = [];
  doc.body.querySelectorAll("*").forEach((el) => {
    // HAX blocks keep files in their own attributes (video-player source, ...)
    const attrs =
      el.localName.indexOf("-") > 0
        ? Array.from(el.attributes)
            .map((a) => a.name)
            .filter(
              (n) =>
                ASSET_ATTRS.indexOf(n) !== -1 ||
                /^(\.\/|\/)?files\//.test(el.getAttribute(n)) ||
                /^https?:\/\//.test(el.getAttribute(n)),
            )
        : ASSET_ATTRS.filter((n) => el.hasAttribute(n));
    attrs.forEach((attr) => {
      const value = el.getAttribute(attr);
      const parts =
        attr === "srcset"
          ? value.split(",").map((p) => p.trim().split(/\s+/)[0])
          : [value];
      if (!parts.some((p) => isPrivate(p, home))) {
        return;
      }
      // links keep working as text; only what would load a file is replaced
      if (attr === "href" && el.localName === "a") {
        el.setAttribute("href", "#");
      } else if (el.localName === "img" || attr === "poster") {
        el.setAttribute(attr, PLACEHOLDER);
      } else if (attr === "srcset") {
        el.removeAttribute(attr);
      } else {
        el.setAttribute(attr, "about:blank");
      }
      // file names can say too much: only the kind of file is kept
      const name = parts[0].split(/[?#]/)[0].split("/").pop();
      const ext =
        name.indexOf(".") > 0 ? name.split(".").pop().toLowerCase() : "file";
      el.setAttribute("data-goggles-placeholder", ext);
      swapped.push(ext);
    });
  });
  return { html: doc.body.innerHTML, swapped: swapped };
}

/**
 * Everything a replay route needs to show the problem on a scratch site:
 * the content (one block or the whole page), the theme, the build, the
 * language, and the pointer to the element.
 */
export function replayBundle(o) {
  const placed = placeholderAssets(o.html, o.origin);
  return {
    v: 1,
    scope: o.scope === "page" ? "page" : "block",
    tag: o.tag,
    path: o.path,
    mark: Array.isArray(o.mark) ? o.mark : [0],
    html: placed.html,
    swapped: placed.swapped,
    theme: o.theme || "",
    designSystem: o.designSystem || "",
    build: o.build || "",
    lang: o.lang || "",
    scheme: o.scheme || "",
    viewport: o.viewport || "",
  };
}

const toBase64Url = (bytes) => {
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  }
  return globalThis
    .btoa(s)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};
const fromBase64Url = (text) => {
  const b = text.replace(/-/g, "+").replace(/_/g, "/");
  const s = globalThis.atob(b + "===".slice((b.length + 3) % 4));
  const out = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) {
    out[i] = s.charCodeAt(i);
  }
  return out;
};
const pipe = async (bytes, stream) =>
  new Uint8Array(
    await new globalThis.Response(
      new globalThis.Blob([bytes]).stream().pipeThrough(stream),
    ).arrayBuffer(),
  );

/**
 * The bundle as one URL-safe string: "z." + deflated JSON where the browser
 * can compress, "j." + plain JSON where it cannot.
 */
export async function packBundle(bundle) {
  const bytes = new globalThis.TextEncoder().encode(JSON.stringify(bundle));
  if ("CompressionStream" in globalThis) {
    try {
      return (
        "z." +
        toBase64Url(
          await pipe(bytes, new globalThis.CompressionStream("deflate-raw")),
        )
      );
    } catch {
      // falls through to plain JSON
    }
  }
  return "j." + toBase64Url(bytes);
}

/** reads a packed bundle back (the replay route uses this) */
export async function unpackBundle(packed) {
  const text = String(packed || "").trim();
  const body = fromBase64Url(text.slice(2));
  let bytes = body;
  if (text.indexOf("z.") === 0) {
    bytes = await pipe(body, new globalThis.DecompressionStream("deflate-raw"));
  } else if (text.indexOf("j.") !== 0) {
    throw new Error("not a goggles replay bundle");
  }
  return JSON.parse(new globalThis.TextDecoder().decode(bytes));
}

/**
 * The fields of the goggles issue form, by field id. Values the form shows
 * as rendered markdown, written in English for the HAX maintainers.
 */
export function issueFields(i) {
  const context = [
    "- Page: " + (i.page || "(none)"),
    "- Theme: " + (i.theme || "(none)") + ", design system: " + i.designSystem,
    "- Build: webcomponents " + (i.build || "(unknown)"),
    "- Language: " + (i.lang || "(unknown)"),
    "- Viewport: " + i.viewport + ", " + i.scheme + " scheme",
    "- Edit mode: " + (i.edit ? "yes" : "no"),
    "- Browser: " + i.agent,
  ];
  if (i.errors && i.errors.length) {
    context.push("- Console errors:");
    i.errors.forEach((e) => context.push("  - `" + e + "`"));
  }
  if (i.makers && i.makers.length) {
    context.push("- People who know this piece: " + i.makers.join(", "));
  }
  const fields = {
    description: i.notes || "",
    element:
      "- Tag: `" +
      i.tag +
      "`" +
      (i.file ? " (elements/" + i.file + ")" : "") +
      "\n- Path: " +
      pathText(i.path) +
      "\n- Pointer: `" +
      JSON.stringify(i.path) +
      "`",
    context: context.join("\n"),
  };
  if (i.kind === "a11y" && i.check) {
    fields.check = i.check;
  }
  return fields;
}

/**
 * The new-issue link: the kind's form, prefilled. Parts are dropped from the
 * end (replay, then markup) until the link fits, and the caller is told what
 * was left out so it can offer it as an attachment instead.
 */
export function issueUrl(i, extras) {
  const k = REPORT_KINDS[i.kind] || REPORT_KINDS.bug;
  const fields = issueFields(i);
  const more = extras || {};
  const build = (parts) => {
    const p = new URLSearchParams();
    p.set("template", k.form);
    p.set("title", reportTitle(i.kind, i.tag, i.title));
    Object.keys(fields).forEach((key) => p.set(key, fields[key]));
    parts.forEach((key) => p.set(key, more[key]));
    return ISSUES_REPO + "/issues/new?" + p.toString();
  };
  const want = ["markup", "replay"].filter((key) => more[key]);
  let parts = want.slice();
  let url = build(parts);
  while (url.length > URL_BUDGET && parts.length) {
    parts = parts.slice(0, -1);
    url = build(parts);
  }
  return {
    url: url,
    left: want.filter((key) => parts.indexOf(key) === -1),
  };
}

/* ---------- accessibility ---------- */

// colors as [r, g, b, a], 0-255 and 0-1; anything else is not judged
const parseColor = (value) => {
  const v = String(value || "").trim();
  let m = v.match(/^rgba?\(([^)]+)\)$/);
  if (m) {
    const p = m[1].split(/[\s,/]+/).filter((x) => x);
    return [
      parseFloat(p[0]),
      parseFloat(p[1]),
      parseFloat(p[2]),
      p[3] === undefined ? 1 : parseFloat(p[3]),
    ];
  }
  m = v.match(/^color\(srgb ([^)]+)\)$/);
  if (m) {
    const p = m[1].split(/[\s/]+/).filter((x) => x);
    return [
      parseFloat(p[0]) * 255,
      parseFloat(p[1]) * 255,
      parseFloat(p[2]) * 255,
      p[3] === undefined ? 1 : parseFloat(p[3]),
    ];
  }
  return null;
};
const luminance = (c) => {
  const ch = c.slice(0, 3).map((x) => {
    const s = x / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
};
const over = (top, under) => {
  const a = top[3];
  return [
    top[0] * a + under[0] * (1 - a),
    top[1] * a + under[1] * (1 - a),
    top[2] * a + under[2] * (1 - a),
    1,
  ];
};
/** WCAG contrast ratio of two opaque colors */
export function contrastRatio(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
const parentOf = (el) =>
  el.assignedSlot ||
  el.parentElement ||
  (el.getRootNode && el.getRootNode().host) ||
  null;
// the background behind an element, or null under an image or unknown color
const backdrop = (el) => {
  const layers = [];
  let node = el;
  while (node && node.nodeType === 1) {
    const cs = globalThis.getComputedStyle(node);
    if (cs.backgroundImage && cs.backgroundImage !== "none") {
      return null;
    }
    const c = parseColor(cs.backgroundColor);
    if (c === null) {
      return null;
    }
    if (c[3] > 0) {
      layers.push(c);
      if (c[3] >= 1) {
        break;
      }
    }
    node = parentOf(node);
  }
  return layers.reduceRight(
    (under, top) => over(top, under),
    [255, 255, 255, 1],
  );
};
const ownText = (el) =>
  Array.from(el.childNodes).some(
    (n) => n.nodeType === 3 && n.textContent.trim(),
  );
const nameOf = (el) => {
  const root = el.getRootNode();
  if ((el.getAttribute("aria-label") || "").trim()) {
    return true;
  }
  const by = (el.getAttribute("aria-labelledby") || "").trim();
  if (
    by &&
    by.split(/\s+/).some((id) => root.getElementById && root.getElementById(id))
  ) {
    return true;
  }
  if ((el.getAttribute("title") || "").trim()) {
    return true;
  }
  if ((el.textContent || "").trim()) {
    return true;
  }
  return Array.from(el.querySelectorAll("img[alt]")).some((i) =>
    i.getAttribute("alt").trim(),
  );
};
const labelled = (el) => {
  if (
    (el.getAttribute("aria-label") || "").trim() ||
    (el.getAttribute("aria-labelledby") || "").trim() ||
    (el.getAttribute("title") || "").trim()
  ) {
    return true;
  }
  if (el.closest("label")) {
    return true;
  }
  const root = el.getRootNode();
  return !!(
    el.id &&
    root.querySelector &&
    root.querySelector('label[for="' + el.id.replace(/"/g, "") + '"]')
  );
};
const describe = (el) => {
  const id = el.id ? "#" + el.id : "";
  const cls =
    typeof el.className === "string" && el.className.trim()
      ? "." + el.className.trim().split(/\s+/)[0]
      : "";
  return el.localName + id + cls;
};
const visible = (el) => {
  const r = el.getBoundingClientRect();
  if (r.width < 1 || r.height < 1) {
    return false;
  }
  const cs = globalThis.getComputedStyle(el);
  return cs.visibility !== "hidden" && cs.display !== "none";
};

/**
 * The accessibility checks the goggles can run on one element, its light
 * children and its shadow tree. HAX should already prevent these, so a
 * finding points at a gap in HAX itself or in the authored content.
 * @returns {Array<{check: String, where: String, detail: String}>}
 */
export function a11yFindings(el, limit) {
  const max = limit || 12;
  const found = [];
  const seen = new Set();
  const add = (check, node, detail) => {
    const key = check + describe(node);
    if (found.length < max && !seen.has(key)) {
      seen.add(key);
      found.push({ check: check, where: describe(node), detail: detail || "" });
    }
  };
  let count = 0;
  const visit = (node) => {
    if (found.length >= max || count > 600) {
      return;
    }
    count++;
    const tag = node.localName;
    if (tag === "style" || tag === "script" || tag === "template") {
      return;
    }
    if (visible(node)) {
      if (
        tag === "img" &&
        !node.hasAttribute("alt") &&
        node.getAttribute("role") !== "presentation" &&
        node.getAttribute("aria-hidden") !== "true"
      ) {
        add("image-alt", node, node.getAttribute("src") || "");
      }
      if (
        (tag === "button" ||
          (tag === "a" && node.hasAttribute("href")) ||
          node.getAttribute("role") === "button") &&
        node.getAttribute("aria-hidden") !== "true" &&
        !nameOf(node)
      ) {
        add("control-name", node, "");
      }
      if (
        (tag === "input" || tag === "select" || tag === "textarea") &&
        node.getAttribute("type") !== "hidden" &&
        !labelled(node)
      ) {
        add("field-label", node, "");
      }
      if (ownText(node)) {
        const cs = globalThis.getComputedStyle(node);
        const fg = parseColor(cs.color);
        const bg = backdrop(node);
        if (fg && bg) {
          const ratio = contrastRatio(fg[3] < 1 ? over(fg, bg) : fg, bg);
          const size = parseFloat(cs.fontSize) || 16;
          const bold = parseInt(cs.fontWeight, 10) >= 700;
          const large = size >= 24 || (bold && size >= 18.66);
          if (ratio < (large ? 3 : 4.5)) {
            add("contrast", node, ratio.toFixed(2) + ":1");
          }
        }
      }
    }
    if (node.shadowRoot) {
      Array.from(node.shadowRoot.children).forEach(visit);
    }
    Array.from(node.children).forEach(visit);
  };
  visit(el);
  return found;
}
