/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { HAXCMSLitElementTheme } from "@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NManagerStore } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { autorun, toJS } from "mobx";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-title.js";

// how many posts the home page lists before pointing to the archive
const RECENT_COUNT = 10;

/**
 * Turn a HAXcms timestamp (seconds) into a Date, or null
 */
function toDate(seconds) {
  const n = Number(seconds);
  return Number.isFinite(n) && n > 0 ? new Date(n * 1000) : null;
}

/**
 * The tags on an item, as a list
 */
function tagsOf(item) {
  const tags = item && item.metadata ? item.metadata.tags : null;
  if (Array.isArray(tags)) {
    return tags.filter((t) => typeof t === "string" && t.trim() !== "");
  }
  if (typeof tags === "string" && tags.trim() !== "") {
    return tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");
  }
  return [];
}

/**
 * `writing-theme`
 * A theme with nothing but the writing (haxtheweb/issues#3062): the site
 * name and the top-level pages as links; a home page that is the author's
 * intro and the 10 most recent posts as title and date; a post page with
 * its date and tags; an archive of every post by year, filterable by tag.
 * Posts are the pages under the top-level page with the slug "posts" (the
 * writing skeleton sets this up), newest first by when they were created.
 *
 * @title Writing
 * @haxcms-theme-category Website, Blog
 * @haxcms-theme-layout Single column
 * @haxcms-theme-priority 5
 * @element writing-theme
 */
class WritingTheme extends DDDSuper(HAXCMSLitElementTheme) {
  static get tag() {
    return "writing-theme";
  }

  constructor() {
    super();
    this.siteTitle = "";
    this.topLevel = [];
    this.posts = [];
    this.activeItem = null;
    this.homeId = null;
    this.tagFilter = "";
    this.t = this.t || {};
    this.t = {
      ...this.t,
      skipToContent: "Skip to content",
      site: "Site",
      recentPosts: "Recent posts",
      moreInArchive: "More in the archive",
      byTag: "By tag",
      posted: "Posted",
      updated: "Updated",
      tags: "Tags",
      postsTagged: "Posts tagged {tag}",
      allPosts: "All posts",
      madeWithHax: "Made with HAX",
    };
    // no I18NMixin in this class chain, so register with the store directly
    I18NManagerStore.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/writing-theme.en.json", import.meta.url).href +
        "/../",
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this.__writingDisposer = [
      autorun(() => {
        const manifest = toJS(store.manifest);
        Promise.resolve().then(() => this._readManifest(manifest));
      }),
      autorun(() => {
        const item = toJS(store.activeItem);
        Promise.resolve().then(() => {
          this.activeItem = item || null;
          this.tagFilter = this._readTagFilter();
        });
      }),
    ];
  }

  static get properties() {
    return {
      ...super.properties,
      siteTitle: { type: String },
      topLevel: { type: Array },
      posts: { type: Array },
      activeItem: { type: Object },
      homeId: { type: String },
      tagFilter: { type: String },
    };
  }

  /**
   * Split the outline into the nav row (top-level, shown pages) and the
   * posts (published pages under "posts"), newest first
   */
  _readManifest(manifest) {
    const items =
      manifest && Array.isArray(manifest.items) ? manifest.items : [];
    this.siteTitle = manifest && manifest.title ? manifest.title : "";
    const shown = (item) =>
      item &&
      item.metadata &&
      item.metadata.published !== false &&
      item.metadata.hideInMenu !== true;
    const top = items
      .filter((item) => !item.parent)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    this.homeId = top.length ? top[0].id : null;
    this.topLevel = top.filter(shown);
    const postsPage = top.find((item) => item.slug === "posts");
    this.postsId = postsPage ? postsPage.id : null;
    this.posts = postsPage
      ? items
          .filter(
            (item) =>
              item.parent === postsPage.id &&
              item.metadata &&
              item.metadata.published !== false,
          )
          .sort(
            (a, b) =>
              Number(b.metadata.created || 0) - Number(a.metadata.created || 0),
          )
      : [];
  }

  _readTagFilter() {
    try {
      const params = new URLSearchParams(globalThis.location.search);
      return (params.get("tag") || "").trim();
    } catch {
      return "";
    }
  }

  _formatDate(date) {
    if (!date) {
      return "";
    }
    const lang =
      (store.manifest &&
        store.manifest.metadata &&
        store.manifest.metadata.site &&
        store.manifest.metadata.site.lang) ||
      globalThis.document.documentElement.lang ||
      "en";
    try {
      return date.toLocaleDateString(lang, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return date.toDateString();
    }
  }

  _dateTag(date) {
    return date ? date.toISOString().slice(0, 10) : "";
  }

  _isPost(item) {
    return !!(item && this.postsId && item.parent === this.postsId);
  }

  _isArchive(item) {
    return !!(
      item &&
      !item.parent &&
      (item.slug === "archive" || item.id === this.postsId)
    );
  }

  _archiveLink() {
    const archive = this.topLevel.find((item) => item.slug === "archive");
    return archive ? archive.slug : "posts";
  }

  _tagLink(tag) {
    return `${this._archiveLink()}?tag=${encodeURIComponent(tag)}`;
  }

  _postList(posts) {
    return html`<ul class="posts">
      ${posts.map((post) => {
        const date = toDate(post.metadata.created);
        return html`<li>
          <a href="${post.slug}">${post.title}</a>
          ${
            date
              ? html`<span class="sep" aria-hidden="true">–</span>
                  <time datetime="${this._dateTag(date)}"
                    >${this._formatDate(date)}</time
                  >`
              : ``
          }
        </li>`;
      })}
    </ul>`;
  }

  _allTags() {
    const tags = new Set();
    this.posts.forEach((post) => tagsOf(post).forEach((tag) => tags.add(tag)));
    return [...tags].sort((a, b) => a.localeCompare(b));
  }

  /**
   * The home page: recent posts under the author's intro
   */
  renderHome() {
    if (!this.posts.length) {
      return ``;
    }
    const tags = this._allTags();
    return html`<section class="listing" aria-labelledby="recent-heading">
      <h2 id="recent-heading">${this.t.recentPosts}</h2>
      ${this._postList(this.posts.slice(0, RECENT_COUNT))}
      ${
        this.postsId
          ? html`<p>
              <a href="${this._archiveLink()}">${this.t.moreInArchive}</a>
            </p>`
          : ``
      }
      ${
        tags.length
          ? html`<h3 class="tags-heading">${this.t.byTag}</h3>
              <ul class="tags">
                ${tags.map(
                  (tag) =>
                    html`<li><a href="${this._tagLink(tag)}">${tag}</a></li>`,
                )}
              </ul>`
          : ``
      }
    </section>`;
  }

  /**
   * The archive: every post by year, or only one tag's posts
   */
  renderArchive() {
    const filtered = this.tagFilter
      ? this.posts.filter((post) => tagsOf(post).includes(this.tagFilter))
      : this.posts;
    const years = [];
    filtered.forEach((post) => {
      const date = toDate(post.metadata.created);
      const year = date ? String(date.getFullYear()) : "";
      let group = years.find((g) => g.year === year);
      if (!group) {
        group = { year: year, posts: [] };
        years.push(group);
      }
      group.posts.push(post);
    });
    return html`<section class="listing" aria-labelledby="archive-heading">
      <h2 id="archive-heading">
        ${
          this.tagFilter
            ? this.t.postsTagged.replace("{tag}", () => this.tagFilter)
            : this.t.allPosts
        }
      </h2>
      ${
        this.tagFilter
          ? html`<p><a href="${this._archiveLink()}">${this.t.allPosts}</a></p>`
          : ``
      }
      ${years.map(
        (group) =>
          html`${group.year ? html`<h3>${group.year}</h3>` : ``}
          ${this._postList(group.posts)}`,
      )}
    </section>`;
  }

  /**
   * One quiet line under a post's title: posted, updated when different,
   * and its tags
   */
  renderByline(item) {
    const created = toDate(item.metadata.created);
    const updated = toDate(item.metadata.updated);
    const showUpdated =
      created &&
      updated &&
      this._dateTag(updated) !== this._dateTag(created) &&
      updated > created;
    const tags = tagsOf(item);
    return html`<p class="byline">
      ${
        created
          ? html`${this.t.posted}
              <time datetime="${this._dateTag(created)}"
                >${this._formatDate(created)}</time
              >`
          : ``
      }
      ${
        showUpdated
          ? html`<span aria-hidden="true">·</span> ${this.t.updated}
              <time datetime="${this._dateTag(updated)}"
                >${this._formatDate(updated)}</time
              >`
          : ``
      }
      ${
        tags.length
          ? html`<span aria-hidden="true">·</span> ${this.t.tags}:
              ${tags.map(
                (tag, i) =>
                  html`${i ? ", " : ""}<a href="${this._tagLink(tag)}"
                      >${tag}</a
                    >`,
              )}`
          : ``
      }
    </p>`;
  }

  render() {
    const item = this.activeItem;
    const isHome = !!(item && item.id === this.homeId);
    const isPost = this._isPost(item);
    const isArchive = this._isArchive(item);
    return html`
      <a class="skip-link" href="#contentcontainer">${this.t.skipToContent}</a>
      <div class="col">
        <header>
          <a class="brand" href="${store.homeLink}">${this.siteTitle}</a>
          ${
            this.topLevel.length
              ? html`<nav aria-label="${this.t.site}">
                  <ul>
                    ${this.topLevel.map(
                      (top) =>
                        html`<li>
                          <a
                            href="${top.slug}"
                            aria-current="${
                              item &&
                              (item.id === top.id || item.parent === top.id)
                                ? "page"
                                : "false"
                            }"
                            >${top.title}</a
                          >
                        </li>`,
                    )}
                  </ul>
                </nav>`
              : ``
          }
        </header>
        <main>
          <site-active-title></site-active-title>
          ${isPost ? this.renderByline(item) : ``}
          <article id="contentcontainer">
            <div id="slot"><slot></slot></div>
          </article>
          ${isHome && !this.editMode ? this.renderHome() : ``}
          ${isArchive && !this.editMode ? this.renderArchive() : ``}
        </main>
        <footer>${this.t.madeWithHax}</footer>
      </div>
    `;
  }

  HAXCMSGlobalStyleSheetContent() {
    return [
      ...super.HAXCMSGlobalStyleSheetContent(),
      css`
        body {
          margin: var(--ddd-spacing-0);
          background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
        }
      `,
    ];
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-limestoneMaxLight)
          );
          background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          font-family: var(--ddd-font-primary);
          --writing-theme-muted: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneGray)
          );
          --writing-theme-line: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          --writing-theme-link: light-dark(
            var(--ddd-theme-default-link),
            var(--ddd-theme-default-skyBlue)
          );
        }
        .col {
          max-width: 62ch;
          margin: 0 auto;
          padding: var(--ddd-spacing-8) var(--ddd-spacing-5)
            var(--ddd-spacing-10);
        }
        a {
          color: var(--writing-theme-link);
          text-decoration-thickness: 1px;
          text-underline-offset: 3px;
        }
        header {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          justify-content: space-between;
          gap: var(--ddd-spacing-2) var(--ddd-spacing-5);
          padding-block-end: var(--ddd-spacing-3);
          margin-block-end: var(--ddd-spacing-6);
          border-block-end: var(--ddd-border-xs);
          border-color: var(--writing-theme-line);
        }
        .brand {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-s);
          font-weight: var(--ddd-font-weight-bold);
          color: inherit;
          text-decoration: none;
        }
        nav ul {
          list-style: none;
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-0);
          display: flex;
          flex-flow: row wrap;
          gap: var(--ddd-spacing-4);
        }
        nav a[aria-current="page"] {
          color: inherit;
          font-weight: var(--ddd-font-weight-bold);
          text-decoration: none;
        }
        site-active-title h1 {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-xl);
          line-height: var(--ddd-lh-120);
          margin: 0 0 var(--ddd-spacing-2);
          text-wrap: balance;
        }
        .byline {
          color: var(--writing-theme-muted);
          font-size: var(--ddd-font-size-4xs);
          margin: 0 0 var(--ddd-spacing-6);
        }
        :host(:not([edit-mode])) #slot {
          min-height: 0;
        }
        #slot {
          font-size: var(--ddd-font-size-xs);
          line-height: var(--ddd-lh-150);
        }
        .listing h2 {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-s);
          margin: var(--ddd-spacing-8) 0 var(--ddd-spacing-3);
        }
        .listing h3 {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-3xs);
          margin: var(--ddd-spacing-6) 0 var(--ddd-spacing-2);
        }
        .posts {
          margin: var(--ddd-spacing-0);
          padding-inline-start: var(--ddd-spacing-6);
        }
        .posts li {
          margin-block-end: var(--ddd-spacing-2);
          font-size: var(--ddd-font-size-xs);
          line-height: var(--ddd-lh-140);
        }
        .posts time,
        .posts .sep {
          color: var(--writing-theme-muted);
          font-size: var(--ddd-font-size-4xs);
          font-variant-numeric: tabular-nums;
        }
        .tags {
          list-style: none;
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-0);
          display: flex;
          flex-flow: row wrap;
          gap: var(--ddd-spacing-1) var(--ddd-spacing-3);
        }
        footer {
          margin-block-start: var(--ddd-spacing-10);
          padding-block-start: var(--ddd-spacing-3);
          border-block-start: var(--ddd-border-xs);
          border-color: var(--writing-theme-line);
          color: var(--writing-theme-muted);
          font-size: var(--ddd-font-size-4xs);
        }
        @media (max-width: 600px) {
          .col {
            padding: var(--ddd-spacing-5) var(--ddd-spacing-4)
              var(--ddd-spacing-8);
          }
          site-active-title h1 {
            font-size: var(--ddd-font-size-l);
          }
        }
      `,
    ];
  }

  disconnectedCallback() {
    (this.__writingDisposer || []).forEach((dispose) => dispose());
    this.__writingDisposer = [];
    super.disconnectedCallback();
  }
}

globalThis.customElements.define(WritingTheme.tag, WritingTheme);
export { WritingTheme };
