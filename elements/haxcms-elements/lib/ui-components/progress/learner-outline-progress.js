/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * The "All pages" view of learner progress (haxtheweb/issues#3267), shared
 * by the My learning panel (my-learning-panel.js, All pages tab) and the
 * My learning dashboard (my-learning.js), so both show the same numbers the
 * same way:
 *
 *   ring + percent   "All pages" (or the section in scope)
 *                    "N of M pages done"
 *   one row per outline item at the top of the scope: its page icon in its
 *   own DDD progress ring (not started / in progress / almost / done with a
 *   check), its title, "N pages" when it holds more, and its percent. Each
 *   row is a link to that page; the percent is its hover text and is
 *   spoken after the title.
 *
 *   import {
 *     LearnerOutlineStyles,
 *     learnerOutlineModel,
 *     renderLearnerOutline,
 *   } from ".../progress/learner-outline-progress.js";
 *
 * learnerOutlineModel() turns the manifest and siteProgress() into rows;
 * renderLearnerOutline() draws them (the caller's strings, its own go
 * handler).
 */
import { html, css, nothing } from "lit";
import {
  DDDProgressRingStyles,
  dddProgressPercent,
  dddProgressValue,
  renderDDDProgressRing,
} from "@haxtheweb/d-d-d/lib/DDDProgressRing.js";
import { iconFromPageType } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { siteUrl } from "@haxtheweb/user-action/lib/xapi.js";

/**
 * Same-site URL of an outline item, built from its slug in the manifest,
 * optionally with an activity key as the fragment. "" when the slug leads
 * off this site (another origin, outside the site base, not http).
 * @param {Object} item manifest item
 * @param {string} [key] activity key (see activityKey in xapi.js)
 * @returns {string}
 */
export function sitePageUrl(item, key = "") {
  if (!item || typeof item.slug !== "string" || !item.slug) {
    return "";
  }
  let url = null;
  let base = null;
  try {
    url = new URL(item.slug, globalThis.document.baseURI);
    base = new URL(siteUrl());
  } catch {
    return "";
  }
  if (
    (url.protocol !== "https:" && url.protocol !== "http:") ||
    url.origin !== globalThis.location.origin ||
    url.origin !== base.origin ||
    url.pathname.indexOf(base.pathname) !== 0
  ) {
    return "";
  }
  url.search = "";
  url.hash = key ? encodeURIComponent(String(key)) : "";
  return url.href;
}

/**
 * How a row moves to its page: the HAXcms router the site menu uses
 * (history.pushState plus popstate, no reload) when the site has one, else
 * loading the URL. Tests replace go.
 */
export const LearnerOutlineNavigation = {
  go(url) {
    let router = null;
    try {
      router = globalThis.HAXCMS.requestAvailability().storePieces.siteRouter;
    } catch {
      router = null;
    }
    if (router) {
      globalThis.history.pushState({}, "", url);
      globalThis.dispatchEvent(new PopStateEvent("popstate"));
      return "router";
    }
    globalThis.location.assign(url);
    return "load";
  },
};

const visible = (i) =>
  i &&
  i.id &&
  !(i.metadata && (i.metadata.hideInMenu || i.metadata.published === false));

/**
 * Rows and summary of the All pages view.
 * @param {Object[]} items manifest items
 * @param {Object} site siteProgress(): { percentByPage, byPage }
 * @param {Object} [options]
 * @param {string[]} [options.pageIds] pages that count (LearnerProgress
 *   .pageIds()); default every visible item
 * @param {string|null} [options.root] show the items under this one (a
 *   scope's root); null for the top of the outline. A root with nothing
 *   under it shows itself.
 * @param {string[]} [options.pages] pages in scope for the summary
 *   (default: every page that counts)
 * @returns {{ percent: number, done: number, total: number,
 *   rows: Object[] }} rows: { id, title, slug, url, icon, count, hasKids,
 *   percent, done }
 */
export function learnerOutlineModel(items, site, options = {}) {
  const list = Array.isArray(items) ? items.filter((i) => i && i.id) : [];
  const counted = new Set(
    Array.isArray(options.pageIds)
      ? options.pageIds
      : list.filter(visible).map((i) => i.id),
  );
  const byPage = site && site.percentByPage ? site.percentByPage : {};
  const status = site && site.byPage ? site.byPage : {};
  const pct = (id) => dddProgressValue(byPage[id]);
  const kids = {};
  list.forEach((i) => {
    if (i.parent) {
      (kids[i.parent] = kids[i.parent] || []).push(i);
    }
  });
  Object.keys(kids).forEach((k) =>
    kids[k].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0)),
  );
  const subtree = (item, out, depth) => {
    out.push(item);
    if (depth < 50) {
      (kids[item.id] || []).forEach((c) => subtree(c, out, depth + 1));
    }
    return out;
  };
  const root = options.root || null;
  const rootItem = root ? list.find((i) => i.id === root) : null;
  let top = list
    .filter((i) => visible(i) && (root ? i.parent === root : !i.parent))
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
  if (root && !top.length && rootItem && visible(rootItem)) {
    top = [rootItem];
  }
  const rows = top.map((i) => {
    const pages = subtree(i, [], 0).filter((p) => counted.has(p.id));
    const sum = pages.reduce((t, p) => t + pct(p.id), 0);
    const hasKids = (kids[i.id] || []).some(visible);
    const meta = i.metadata || {};
    const percent = pages.length ? sum / pages.length : 0;
    return {
      id: i.id,
      title: i.title || "",
      slug: i.slug || "",
      url: sitePageUrl(i),
      count: pages.length,
      hasKids,
      icon:
        meta.icon ||
        (meta.pageType ? iconFromPageType(meta.pageType) : "") ||
        (hasKids ? "icons:folder-open" : "icons:description"),
      percent,
      done: pages.length > 0 && pages.every((p) => status[p.id] === "done"),
    };
  });
  const scoped = (
    Array.isArray(options.pages) ? options.pages : Array.from(counted)
  ).filter((id) => counted.has(id));
  const total = scoped.length;
  const done = scoped.filter((id) => status[id] === "done").length;
  const percent = total ? scoped.reduce((t, id) => t + pct(id), 0) / total : 0;
  return { percent, done, total, rows };
}

const fill = (str, values) =>
  String(str).replace(/\{([a-zA-Z]+)\}/g, (m, k) =>
    Object.prototype.hasOwnProperty.call(values, k) ? String(values[k]) : m,
  );

/**
 * "49% complete" / "Complete"
 */
export function learnerOutlineStatus(percent, t) {
  return dddProgressValue(percent) >= 1
    ? t.complete
    : fill(t.percentComplete, { percent: dddProgressPercent(percent) });
}

/**
 * The All pages view.
 * @param {Object} model learnerOutlineModel()
 * @param {Object} o
 * @param {Object} o.t strings: allPages (or o.title), pagesDone,
 *   pagesCount, percent, percentComplete, complete
 * @param {string} [o.title] name of the summary (default t.allPages)
 * @param {Function} [o.onGo] (event, row) when a row is followed
 * @param {string} [o.part] part name of the list
 * @returns {TemplateResult}
 */
export function renderLearnerOutline(model, o) {
  const opts = o || {};
  const t = opts.t || {};
  const m = model || { percent: 0, done: 0, total: 0, rows: [] };
  const pct = (p) => fill(t.percent, { percent: dddProgressPercent(p) });
  return html`<div class="lop-summary">
      ${renderDDDProgressRing({
        percent: m.percent,
        glyph: html`<span>${pct(m.percent)}</span>`,
      })}
      <span class="lop-text">
        <span class="lop-name">${opts.title || t.allPages}</span>
        <span class="lop-meta"
          >${fill(t.pagesDone, { done: m.done, total: m.total })}</span
        >
      </span>
    </div>
    <ol class="lop-list" part="${opts.part || nothing}">
      ${m.rows.map((r) => {
        const status = learnerOutlineStatus(r.percent, t);
        const inner = html`${renderDDDProgressRing({
            percent: r.done ? 1 : r.percent,
            icon: r.icon,
          })}
          <span class="lop-text"
            ><span class="lop-name">${r.title}</span> ${
              r.hasKids
                ? html`<span class="lop-meta"
                    >${fill(t.pagesCount, { count: r.count })}</span
                  >`
                : nothing
            }</span
          >
          <span class="lop-pct" aria-hidden="true">${pct(r.percent)}</span
          ><span class="lop-sr">, ${status}</span>`;
        return html`<li
          class="lop-row"
          data-id="${r.id}"
          data-state="${r.done ? "done" : "todo"}"
        >
          ${
            r.url
              ? html`<a
                  class="lop-go"
                  href="${r.url}"
                  title="${r.title}, ${status}"
                  @click="${(e) => (opts.onGo ? opts.onGo(e, r) : null)}"
                  >${inner}</a
                >`
              : html`<span class="lop-go" title="${r.title}, ${status}"
                  >${inner}</span
                >`
          }
        </li>`;
      })}
    </ol>`;
}

/**
 * Follow a row inside the site (plain clicks only; new tab / window
 * clicks are left to the browser). before() runs first (close the dialog).
 * Returns true when it navigated.
 */
export function followLearnerOutlineRow(e, row, before) {
  if (
    !row ||
    !row.url ||
    (e &&
      (e.defaultPrevented ||
        e.button > 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey))
  ) {
    return false;
  }
  if (e) {
    e.preventDefault();
  }
  if (typeof before === "function") {
    before(row);
  }
  LearnerOutlineNavigation.go(row.url);
  return true;
}

export const LearnerOutlineStyles = [
  ...DDDProgressRingStyles,
  css`
    .lop-summary {
      display: flex;
      align-items: center;
      gap: var(--ddd-spacing-3);
      padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
    }
    .lop-summary .ddd-ring {
      --ddd-component-progress-ring-size: var(--ddd-icon-lg);
    }
    .lop-text {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      min-width: 0;
    }
    .lop-name {
      font-size: var(--ddd-font-size-4xs);
      font-weight: var(--ddd-font-weight-bold);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .lop-meta,
    .lop-pct {
      font-family: var(--ddd-font-navigation);
      font-size: var(--ddd-font-size-4xs);
      color: light-dark(
        var(--ddd-theme-default-slateGray),
        var(--ddd-theme-default-limestoneLight)
      );
    }
    .lop-pct {
      flex: none;
      font-variant-numeric: tabular-nums;
    }
    .lop-list {
      list-style: none;
      margin: 0;
      padding: 0 var(--ddd-spacing-2) var(--ddd-spacing-2);
    }
    .lop-row {
      margin: 0;
      padding: 0;
    }
    .lop-go {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: var(--ddd-spacing-3);
      width: 100%;
      padding: var(--ddd-spacing-2);
      border-radius: var(--ddd-radius-sm);
      color: inherit;
      text-decoration: none;
      line-height: var(--ddd-lh-120);
      --simple-icon-color: currentColor;
    }
    a.lop-go:hover,
    a.lop-go:focus-visible {
      background-color: light-dark(
        var(--ddd-theme-default-limestoneMaxLight),
        var(--ddd-theme-default-slateGray)
      );
    }
    a.lop-go:hover .lop-name {
      text-decoration: underline;
    }
    a.lop-go:focus-visible {
      outline: var(--ddd-focus-ring);
      outline-offset: calc(-1 * var(--ddd-focus-offset));
    }
    .lop-sr {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
      border: 0;
    }
    @media (forced-colors: active) {
      a.lop-go:focus-visible {
        outline-color: Highlight;
      }
    }
  `,
];
