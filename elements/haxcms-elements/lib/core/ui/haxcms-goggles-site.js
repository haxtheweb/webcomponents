/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * A site's own goggles lens on a published site (hax.cloud's Connect, Learn's
 * Update, Lab's Ask). The goggles normally ride the editor; this puts them on
 * for a visitor, from Merlin's developer list (">developer/goggles") or a link
 * (?goggles=<lens>), with the site's lens added and its panel slotted into
 * the goggles.
 *
 *   siteLens({
 *     id: "update", text: "Update", icon: "icons:update",
 *     about: "What Merlin says about the goggles on this site",
 *     load: async () => ({ sayText, pick, choose, panel: "my-panel-tag", fromLink }),
 *   });
 *
 * `load` runs the first time the goggles go on, so a lens and its panel cost
 * nothing until someone asks for them. It resolves to what haxcms-goggles'
 * registerLens takes (sayText, pick, choose) plus `panel`, the tag of the
 * element shown in the goggles while the lens is chosen (it gets `lensOn`),
 * and an optional `fromLink(params)` for the rest of a ?goggles= link.
 */
import { html } from "lit";
import { localStorageGet } from "@haxtheweb/utils/lib/storage.js";
import { store } from "../haxcms-site-store.js";

const LENS_KEY = "haxcms-goggles-lens";
const BUILT_IN = ["code", "makers", "flag", "translate"];
export const GOGGLES_COMMAND = ">developer/goggles";
const T = {
  title: "Developer mode: goggles",
  about:
    "Put on the goggles: lenses that show how this site is built and help improve it",
};
const goggles = () => import("./haxcms-goggles.js");

const lenses = new Map();
let wired = false;
let ready = null;

/** the goggles, with every lens this site added (each loaded the first time) */
function register() {
  if (!ready) {
    ready = goggles().then(async (m) => {
      for (const def of lenses.values()) {
        if (def.full) continue;
        def.full = (await def.load()) || {};
        m.registerLens({
          id: def.id,
          text: def.text,
          icon: def.icon,
          sayText: def.full.sayText || "",
          pick: def.full.pick,
          choose: def.full.choose,
          panel: !!def.full.panel,
        });
      }
      return m;
    });
  }
  return ready;
}

/** the chosen lens's panel rides inside the goggles, which put themselves on the body */
function attach(state) {
  const g = globalThis.document.querySelector("haxcms-goggles");
  lenses.forEach((def) => {
    const tag = def.full && def.full.panel;
    if (!tag) return;
    let panel = globalThis.document.querySelector(tag);
    if (!state || !state.on || !g || state.lens !== def.id) {
      return;
    }
    if (!panel) {
      panel = globalThis.document.createElement(tag);
    }
    if (panel.parentNode !== g) {
      panel.setAttribute("slot", "lens-panel");
      g.appendChild(panel);
    }
    panel.lensOn = !!state.lensOn;
  });
}

/**
 * Goggles on or off. The first time on this browser they open on `lens`
 * (default: the first lens this site added); after that, on the lens last used.
 */
export async function toggleGoggles(lens) {
  const m = await register();
  const s = m.GogglesState;
  if (s.on) {
    s.set({ on: false });
    return;
  }
  const first = lens || (lenses.size ? lenses.keys().next().value : "");
  const remembered = localStorageGet(LENS_KEY, null);
  s.set(
    remembered && !lens
      ? { on: true, lensOn: true }
      : { on: true, lensOn: true, lens: first, person: null },
  );
}

/** Merlin's developer list gets the goggles, once per Merlin */
function defineCommand(merlin) {
  if (!merlin || typeof merlin.defineOption !== "function") return;
  if (merlin.__haxcmsGogglesSite) return;
  merlin.__haxcmsGogglesSite = true;
  const first = lenses.values().next().value;
  merlin.defineOption({
    title: T.title,
    icon: "hax:goggles",
    tags: ["Developer", "goggles", "developer mode", ...lenses.keys()],
    path: GOGGLES_COMMAND,
    // developer commands only (the > list), never global search
    context: [">"],
    more: html`<span>${(first && first.about) || T.about}</span>`,
    value: { target: { toggleGoggles }, method: "toggleGoggles", args: [] },
    eventName: "super-daemon-element-method",
  });
}

/** ?goggles=<lens> puts them on with that lens; the lens reads the rest of the link */
async function fromLink() {
  let asked = null;
  try {
    asked = new URLSearchParams(globalThis.location.search);
  } catch {
    asked = null;
  }
  const lens = asked ? asked.get("goggles") : "";
  if (!lens || (BUILT_IN.indexOf(lens) === -1 && !lenses.has(lens))) {
    return;
  }
  const m = await register();
  m.GogglesState.set({ on: true, lensOn: true, lens, person: null });
  const def = lenses.get(lens);
  if (def && def.full && typeof def.full.fromLink === "function") {
    def.full.fromLink(asked);
  }
}

const KIND = {
  p: "Paragraph",
  h1: "Heading",
  h2: "Heading",
  h3: "Heading",
  h4: "Heading",
  h5: "Heading",
  h6: "Heading",
  ul: "List",
  ol: "List",
  img: "Image",
  "media-image": "Image",
  "video-player": "Video",
  "audio-player": "Audio",
  "code-sample": "Code",
  "ddd-steps-list": "Steps",
  "a11y-collapse": "Section",
  "a11y-tabs": "Tabs",
  "grid-plate": "Layout",
  table: "Table",
  "editable-table": "Table",
  blockquote: "Quote",
};
const NOT_BLOCKS = ["page-break", "style", "script", "template"];

/**
 * The block of the page's content under the pointer: the top-level element
 * of the page's HTML (a paragraph, a video, a set of steps), as the HAX
 * editor would select it. Null outside the content.
 */
export function pageBlock(path) {
  const theme = store.themeElement;
  if (!theme || !path) return null;
  for (let i = 0; i < path.length; i++) {
    const n = path[i];
    if (n && n.nodeType === 1 && n.parentNode === theme) {
      return NOT_BLOCKS.indexOf(n.localName) === -1 ? n : null;
    }
  }
  return null;
}

/** What a block is ("Video", "Steps"), its place among the page's blocks and a short excerpt of its text */
export function describeBlock(el) {
  const tag = el.localName;
  const blocks = [...el.parentNode.children].filter(
    (c) => NOT_BLOCKS.indexOf(c.localName) === -1,
  );
  let text = String(el.textContent || "")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) {
    text =
      el.getAttribute("alt") ||
      el.getAttribute("title") ||
      el.getAttribute("source") ||
      el.getAttribute("src") ||
      "";
  }
  return {
    tag,
    kind: KIND[tag] || tag,
    index: blocks.indexOf(el),
    id: el.id || "",
    excerpt: text.length > 280 ? text.slice(0, 277) + "..." : text,
  };
}

/** The page shown: its title, slug, file and address */
export function currentPage(site) {
  const a = store.activeItem || {};
  const base = site || "";
  return {
    title: a.title || "",
    slug: a.slug || "",
    location: a.location || "",
    url: base + (a.slug || ""),
  };
}

/** Add this site's lens: Merlin's developer list, ?goggles= links and the panel follow. */
export function siteLens(def) {
  if (!def || !def.id || lenses.has(def.id) || typeof def.load !== "function") {
    return;
  }
  lenses.set(def.id, Object.assign({ text: def.id, icon: "hax:goggles" }, def));
  if (!wired) {
    wired = true;
    globalThis.addEventListener("haxcms-goggles-changed", (e) =>
      attach(e.detail),
    );
    // the network bar asks the page for its Merlin options the first time Merlin opens
    globalThis.addEventListener("hax-network-merlin", (e) =>
      defineCommand(e.detail ? e.detail.merlin : null),
    );
    globalThis.setTimeout(fromLink, 0);
  }
}
