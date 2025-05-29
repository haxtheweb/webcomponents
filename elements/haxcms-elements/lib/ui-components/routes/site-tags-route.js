/**
 * Copyright 2022 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css, nothing } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { HAXCMSI18NMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSI18NMixin.js";
import { autorun, toJS } from "mobx";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import "@haxtheweb/collection-list/collection-list.js";
import "@haxtheweb/collection-list/lib/collection-item.js";
import "@haxtheweb/simple-fields/lib/simple-tag.js";

/**
 * `site-tags-route`
 * `Route for displaying tags of a site`
 *
 * @demo demo/index.html
 */
export class SiteTagsRoute extends HAXCMSI18NMixin(DDD) {
  static get tag() {
    return "site-tags-route";
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          font-size: 16px;
        }

        simple-tag {
          margin: 0 4px 4px 0;
          cursor: pointer;
        }
        simple-tag:hover,
        simple-tag:focus {
          background-color: var(--simple-colors-default-theme-accent-color-3);
          color: var(--simple-colors-default-theme-accent-color-12);
          border-color: var(--simple-colors-default-theme-accent-color-12);
          transition: all 0.3s ease-in-out;
        }

        .all-tags {
          display: block;
        }
      `,
    ];
  }

  constructor() {
    super();
    this.windowControllers = new AbortController();
    this.HAXCMSI18NMixinBase = "../../../";
    this.search = globalThis.location.search;
    this.t.tags = "Tags";
    this.filteredItems = [];
    this.resultsTags = {};
    this.params = {};
    this.renderXTagsItems = this._renderXTagsItems;
    this.renderXTagsTag = this._renderXTagsTag;
    this.__disposer = this.__disposer || [];
    autorun((reaction) => {
      const theme = toJS(store.themeElement);
      this._processCustomThemeRoutes();
      this.__disposer.push(reaction);
    });
    window.addEventListener(
      "haxcms-theme-ready",
      (e) => {
        this._processCustomThemeRoutes();
      },
      { signal: this.windowControllers.signal },
    );
  }

  _processCustomThemeRoutes() {
    const theme = toJS(store.themeElement);
    if (
      theme &&
      theme.HAXSiteCustomRenderRoutes &&
      theme.HAXSiteCustomRenderRoutes["x/tags"]
    ) {
      if (theme.HAXSiteCustomRenderRoutes["x/tags"].items) {
        this.renderXTagsItems = theme.HAXSiteCustomRenderRoutes["x/tags"].items;
      } else {
        this.renderXTagsItems = this._renderXTagsItems;
      }
      if (store.themeElement.HAXSiteCustomRenderRoutes["x/tags"].tag) {
        this.renderXTagsTag = theme.HAXSiteCustomRenderRoutes["x/tags"].tag;
      } else {
        this.renderXTagsTag = this._renderXTagsTag;
      }
    }
  }

  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
    this.windowControllers.abort();
    super.disconnectedCallback();
  }

  _tagClick(e) {
    let tag = e.target.value;
    const rawParams = new URLSearchParams(this.search);
    rawParams.set("tag", tag.trim());
    globalThis.history.replaceState(
      {},
      "",
      decodeURIComponent(`./x/tags?${rawParams}`),
    );
    this.search = globalThis.location.search;
  }

  _resetClick(e) {
    const rawParams = new URLSearchParams(this.search);
    rawParams.delete("tag");
    globalThis.history.replaceState({}, "", decodeURIComponent(`./x/tags`));
    this.search = globalThis.location.search;
  }

  // i don't know why I have to do this, but I do
  _tagKeydown(e) {
    if (e.key === "Enter") {
      this._tagClick(e);
    }
  }
  // i don't know why I have to do this either, but I do
  _resetKeydown(e) {
    if (e.key === "Enter") {
      this._resetClick(e);
    }
  }

  render() {
    return html`${this.renderXTags(this)}`;
  }

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    // I don't love this but only way to get it to consistently work
    // as we paint so quickly (if this is the page that starts) that
    // we end up missing the data. It's fine if it wasn't the initial route
    setTimeout(() => {
      this._processCustomThemeRoutes();
      this.requestUpdate();
    }, 500);
  }

  renderXTags() {
    return html` ${this.params && this.params.tag
      ? html`<simple-tag
          class="all-tags"
          part="simple-tag all-tags"
          value="Remove '${this.params.tag}' filter"
          @click="${this._resetClick}"
          @keydown="${this._resetKeydown}"
          tabindex="0"
        ></simple-tag>`
      : nothing}
    ${Object.keys(this.resultsTags).map(
      (tag) =>
        html` ${this.params.tag === tag.trim()
          ? nothing
          : html`${this.renderXTagsTag(tag)}`}`,
    )}
    ${this.renderXTagsItems(this.filteredItems)}`;
  }

  _renderXTagsTag(tag) {
    return html` <simple-tag
      part="simple-tag"
      accent-color="grey"
      value="${tag.trim()}"
      @click="${this._tagClick}"
      @keydown="${this._tagKeydown}"
      tabindex="0"
      >${this.resultsTags[tag] > 1
        ? html` (${this.resultsTags[tag]})`
        : nothing}
    </simple-tag>`;
  }

  _renderXTagsItems(items) {
    return html`
      <collection-list>
        ${items.map(
          (item) =>
            html` <collection-item
              line1="${item.title}"
              line2="${item.description}"
              url="${item.slug}"
              image="${item.metadata.image}"
              tags="${item.metadata.tags}"
              icon="${item.metadata.icon}"
              accent-color="grey"
              saturate
            ></collection-item>`,
        )}
      </collection-list>
    `;
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "search") {
        const rawParams = new URLSearchParams(this.search);
        const searchParams = Object.fromEntries(rawParams);
        this.params = {};
        this.params = searchParams;
      }
      if (propName === "params" && store.manifest.items) {
        this.filteredItems = [
          ...toJS(store.manifest.items).filter((item) => {
            if (!this.params.tag) {
              return true;
            }
            return (
              item.metadata.tags &&
              item.metadata.tags.split(",").some((tag) => {
                return tag
                  .toLowerCase()
                  .includes(this.params.tag.toLowerCase());
              })
            );
          }),
        ];
      }
      if (propName === "filteredItems") {
        this.updateResultsTags(this.filteredItems);
      }
    });
  }

  async updateResultsTags(filteredItems) {
    let resultsTags = [];
    await filteredItems.forEach(async (item) => {
      if (item.metadata.tags) {
        const tags = item.metadata.tags.trim().split(",");
        resultsTags.push(...tags);
      }
    });
    this.resultsTags = { ...this.countDuplicates(resultsTags) };
  }

  countDuplicates(arr) {
    const counts = {};
    for (const element of arr) {
      counts[element] = (counts[element] || 0) + 1;
    }
    return counts;
  }

  static get properties() {
    return {
      ...super.properties,
      search: {
        type: String,
      },
      params: {
        type: Object,
      },
      filteredItems: {
        type: Array,
      },
      resultsTags: {
        type: Object,
      },
    };
  }
}

globalThis.customElements.define(SiteTagsRoute.tag, SiteTagsRoute);
