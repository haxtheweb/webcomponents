/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css, LitElement } from "lit";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";

// the page tag that marks a top level page as a version of the site's docs
export const SITE_VERSION_TAG = "version";

/** a page's tags as a list, whether site.json keeps a list or "a,b" */
function tagsOf(item) {
  const tags = item && item.metadata ? item.metadata.tags : null;
  if (Array.isArray(tags)) {
    return tags.map((tag) => String(tag).trim().toLowerCase());
  }
  if (typeof tags === "string") {
    return tags.split(",").map((tag) => tag.trim().toLowerCase());
  }
  return [];
}

/**
 * The versions in an outline: published top level pages tagged "version",
 * in outline order (so the first is the current one).
 * @param {Array} items manifest.items
 * @returns {Array}
 */
export function siteVersions(items) {
  return (Array.isArray(items) ? items : [])
    .filter(
      (item) =>
        item &&
        !item.parent &&
        !(item.metadata && item.metadata.published === false) &&
        tagsOf(item).indexOf(SITE_VERSION_TAG) !== -1,
    )
    .sort((a, b) => a.order - b.order);
}

/**
 * The version a page belongs to: itself when it is a version, else the
 * version among its ancestors, else null.
 */
export function versionOf(items, pageId, versions) {
  const byId = {};
  (Array.isArray(items) ? items : []).forEach((item) => {
    byId[item.id] = item;
  });
  const ids = versions.map((version) => version.id);
  let item = byId[pageId];
  // an outline is a tree; the count guards a parent cycle in bad data
  let steps = 0;
  while (item && steps < 100) {
    if (ids.indexOf(item.id) !== -1) {
      return item;
    }
    item = item.parent ? byId[item.parent] : null;
    steps++;
  }
  return null;
}

/**
 * Where switching to another version lands: the page at the same path under
 * that version when it has one, else the version's own page.
 */
export function versionTarget(items, activeItem, fromVersion, toVersion) {
  if (
    activeItem &&
    fromVersion &&
    activeItem.id !== fromVersion.id &&
    typeof activeItem.slug === "string" &&
    activeItem.slug.indexOf(`${fromVersion.slug}/`) === 0
  ) {
    const rest = activeItem.slug.slice(fromVersion.slug.length + 1);
    const wanted = `${toVersion.slug}/${rest}`;
    const match = (Array.isArray(items) ? items : []).find(
      (item) =>
        item.slug === wanted &&
        !(item.metadata && item.metadata.published === false),
    );
    if (match) {
      return match;
    }
  }
  return toVersion;
}

/**
 * `site-version-switcher`
 * A select that moves between versions of a site's documentation.
 *
 * A version is a top level page tagged "version"; the pages under it are
 * that version's docs, and the outline order of the versions is the order
 * listed (put the current one first). Switching keeps the reader on the
 * same page when the other version has one at the same path, and otherwise
 * goes to that version's first page. With fewer than two versions the
 * element renders nothing, so a theme can always include it.
 *
 * @element site-version-switcher
 */
class SiteVersionSwitcher extends I18NMixin(LitElement) {
  static get tag() {
    return "site-version-switcher";
  }

  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      version: "Version",
      chooseVersion: "Choose a version",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../../../locales/", import.meta.url).href,
    });
    this.versions = [];
    this.activeVersion = "";
    this.empty = true;
    this.__items = [];
    this.__activeItem = null;
    this.__disposer = [];
  }

  static get properties() {
    return {
      ...super.properties,
      versions: { type: Array },
      activeVersion: { type: String, attribute: "active-version" },
      empty: { type: Boolean, reflect: true },
    };
  }

  static get styles() {
    return [
      css`
        :host {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
        }
        :host([empty]) {
          display: none;
        }
        label {
          /* the select's own text names the version; the label is for
             assistive tech */
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip-path: inset(50%);
          white-space: nowrap;
        }
        select {
          max-width: 100%;
          min-height: var(--ddd-control-height-sm, 40px);
          padding: 0 var(--ddd-spacing-2);
          border: var(--ddd-border-xs);
          border-color: var(--site-version-switcher-border-color, currentColor);
          border-radius: var(--ddd-radius-xs);
          color: var(--site-version-switcher-color, inherit);
          background-color: var(
            --site-version-switcher-background,
            transparent
          );
          font: inherit;
          cursor: pointer;
        }
        select:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset, 2px);
        }
        option {
          color: light-dark(var(--ddd-primary-4), var(--ddd-accent-6));
          background-color: light-dark(
            var(--ddd-accent-6),
            var(--ddd-primary-4)
          );
        }
      `,
    ];
  }

  render() {
    return html`
      <label for="version">${this.t.version}</label>
      <select id="version" part="select" @change="${this.__changed}">
        ${
          this.activeVersion
            ? ``
            : html`<option value="" selected disabled>
                ${this.t.chooseVersion}
              </option>`
        }
        ${this.versions.map(
          (version) =>
            html`<option
              value="${version.id}"
              ?selected="${version.id === this.activeVersion}"
            >
              ${version.title}
            </option>`,
        )}
      </select>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.__disposer.push(
      autorun(() => {
        const manifest = toJS(store.manifest);
        const activeId = toJS(store.activeId);
        const items =
          manifest && Array.isArray(manifest.items) ? manifest.items : [];
        const versions = siteVersions(items);
        const active = versionOf(items, activeId, versions);
        this.__items = items;
        this.__activeItem = items.find((item) => item.id === activeId) || null;
        this.versions = versions;
        this.activeVersion = active ? active.id : "";
        this.empty = versions.length < 2;
      }),
    );
  }

  disconnectedCallback() {
    this.__disposer.forEach((dispose) => dispose());
    this.__disposer = [];
    super.disconnectedCallback();
  }

  // a select keeps its own value once the reader picks; bring it back in
  // line with the page after every navigation
  updated(changedProperties) {
    if (changedProperties.has("activeVersion") && this.shadowRoot) {
      const select = this.shadowRoot.querySelector("select");
      if (select) {
        select.value = this.activeVersion;
      }
    }
  }

  __changed(e) {
    const to = this.versions.find((version) => version.id === e.target.value);
    if (!to) {
      return;
    }
    const from = this.versions.find(
      (version) => version.id === this.activeVersion,
    );
    const target = versionTarget(this.__items, this.__activeItem, from, to);
    if (!target || typeof target.slug !== "string" || target.slug === "") {
      return;
    }
    // the HAXcms router: pushState, then popstate so it reads the new URL
    globalThis.history.pushState({}, "", target.slug);
    globalThis.dispatchEvent(new PopStateEvent("popstate"));
  }
}
globalThis.customElements.define(SiteVersionSwitcher.tag, SiteVersionSwitcher);
export { SiteVersionSwitcher };
