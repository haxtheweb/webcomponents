/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * One element on a HAXcms page, for review. The HAXcms demo
 * (elements/haxcms-elements/demo/index.html) imports this when its address
 * has ?goggles-demo=<element>: the page content is swapped, in this browser
 * only, for that element's own demo markup (lib/<element>.docs.json, the
 * same markup its gallery demo shows), and the goggles hold still on it with
 * the X-ray lens. On a pull request's preview every @haxtheweb element comes
 * from the branch, so this shows the change inside the real HAXcms chrome.
 * Nothing is saved: the demo has no backend, and the swap lasts until the
 * page is left.
 */
import { autorun } from "mobx";
import { sanitizeHTMLString } from "@haxtheweb/utils/lib/sanitize.js";
import { store } from "../haxcms-site-store.js";
import { contentMark } from "./haxcms-goggles-report.js";

export const DEMO_PARAM = "goggles-demo";

/** the element folder a link names, or "" for anything else */
export function demoSlug(search) {
  let params = null;
  try {
    params = new URLSearchParams(
      typeof search === "string" ? search : globalThis.location.search,
    );
  } catch {
    return "";
  }
  const slug = params.get(DEMO_PARAM) || "";
  return /^[a-z][a-z0-9-]{0,80}$/.test(slug) ? slug : "";
}

/** where an element's docs data is served, beside its package */
export function docsUrl(slug, base) {
  const root =
    base ||
    globalThis.WCGlobalBasePath ||
    globalThis.WCAutoloadBasePath ||
    "/node_modules/";
  return new URL(
    "@haxtheweb/" + slug + "/lib/" + slug + ".docs.json",
    new URL(root, globalThis.location.href),
  ).href;
}

/**
 * The element's demo: its tag and demo markup. Null when it has
 * none (themes and other pieces that are not blocks on a page).
 */
export async function loadDemo(slug, base) {
  const r = await globalThis.fetch(docsUrl(slug, base));
  if (!r.ok) {
    return null;
  }
  const docs = await r.json();
  const markup = typeof docs.demoHtml === "string" ? docs.demoHtml : "";
  if (!markup.trim()) {
    return null;
  }
  return {
    tag: typeof docs.tag === "string" ? docs.tag : slug,
    html: markup,
  };
}

/**
 * Puts the demo in place of the page content and returns where the element
 * sits in it (its first instance, or the first block when the markup has
 * none by that tag).
 */
export function placeDemo(host, demo) {
  const doc = host.ownerDocument || globalThis.document;
  const tpl = doc.createElement("template");
  tpl.innerHTML = sanitizeHTMLString(demo.html);
  host.replaceChildren(tpl.content);
  const el = host.querySelector(demo.tag) || host.firstElementChild;
  return el ? contentMark(el, host) : null;
}

/** resolves once the theme holds page content, or null after `wait` ms */
const contentArrives = (wait) =>
  new Promise((done) => {
    const started = Date.now();
    const look = () => {
      const host = store.themeElement;
      if (host && host.firstElementChild) {
        done(host);
      } else if (Date.now() - started > wait) {
        done(null);
      } else {
        setTimeout(look, 150);
      }
    };
    look();
  });

/**
 * Runs the review link: swaps in the element's demo, puts the goggles on
 * with the X-ray lens and holds still on it. The site builder can write the
 * page again after that (a theme change, a late load), so the demo is put
 * back whenever its content is replaced, until someone starts editing or
 * goes to another page.
 * @returns {Promise<boolean>} false when the link names no demo
 */
export async function gogglesDemo(search) {
  const slug = demoSlug(search);
  if (!slug) {
    return false;
  }
  const demo = await loadDemo(slug).catch(() => null);
  if (!demo) {
    return false;
  }
  const { GogglesState } = await import("./haxcms-goggles.js");
  let placed = [];
  let watcher = null;
  let times = 0;
  // the page the demo stands in for; going to another page leaves the demo
  let page = null;
  const show = (host) => {
    times++;
    const mark = placeDemo(host, demo);
    placed = Array.from(host.children);
    GogglesState.set({ on: true, lens: "code", lensOn: true, person: null });
    const goggles = globalThis.document.querySelector("haxcms-goggles");
    if (goggles && mark) {
      goggles.holdAt(mark);
    }
  };
  const ours = (host) =>
    host.children.length === placed.length &&
    placed.every((el, i) => host.children[i] === el);
  const watch = (host) => {
    if (watcher) {
      watcher.disconnect();
    }
    watcher = new MutationObserver(() => {
      // editing moves the content into hax-body, and another page is
      // somewhere else: either way the demo is done
      if (store.editMode || store.activeId !== page || times > 20) {
        watcher.disconnect();
        return;
      }
      if (host.firstElementChild && !ours(host)) {
        show(host);
      }
    });
    watcher.observe(host, { childList: true });
  };
  autorun(() => {
    const host = store.themeElement;
    if (!host) {
      return;
    }
    contentArrives(15000).then((ready) => {
      if (ready === host && !store.editMode) {
        if (page === null) {
          page = store.activeId;
        }
        show(host);
        watch(host);
      }
    });
  });
  return true;
}
