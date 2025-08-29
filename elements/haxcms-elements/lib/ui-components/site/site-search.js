/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-fields/lib/simple-fields-field.js";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/iframe-loader/lib/loading-indicator.js";
import {
  store,
  HAXcmsStore,
} from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { HAXCMSI18NMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSI18NMixin.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import "@haxtheweb/simple-fields/lib/simple-tag.js";
import "@haxtheweb/lunr-search/lunr-search.js";
import "@haxtheweb/simple-datetime/simple-datetime.js";
/**
 * `site-search`
 * `Searching HAXcms content using the auto-generated lunr search configuration`
 *
 * @demo demo/index.html
 */
class SiteSearch extends HAXCMSI18NMixin(DDD) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          color: light-dark(var(--ddd-primary-4), var(--ddd-accent-6));
        }
        [hidden] {
          display: none;
        }
        a.result {
          display: block;
          background-color: light-dark(
            var(--ddd-theme-default-limestoneLight, var(--ddd-accent-6)),
            var(--ddd-primary-4)
          );
          color: light-dark(var(--ddd-primary-4), var(--ddd-accent-6));
          padding: var(--ddd-spacing-4);
          margin: var(--ddd-spacing-2) 0;
          font-weight: var(--ddd-font-weight-regular);
          border-radius: var(--ddd-radius-xs);
          border: var(--ddd-border-xs)
            light-dark(
              var(--ddd-theme-default-limestoneGray, rgba(0, 0, 0, 0.1)),
              rgba(255, 255, 255, 0.2)
            );
          transition: all var(--ddd-duration-rapid) var(--ddd-theme-easing);
          text-decoration: none;
        }

        .result:hover,
        .result:focus {
          background-color: light-dark(
            var(--ddd-primary-2),
            var(--ddd-primary-10)
          );
          color: light-dark(
            var(--ddd-accent-6, #fff),
            var(--ddd-accent-6, #fff)
          );
          text-decoration: none;
          outline: var(--ddd-border-sm)
            light-dark(var(--ddd-primary-4), var(--ddd-accent-4));
          transform: translateY(-1px);
          box-shadow: var(--ddd-boxShadow-sm);
        }

        .result:hover .title,
        .result:focus .title {
          color: light-dark(
            var(--ddd-accent-6, #fff),
            var(--ddd-accent-6, #fff)
          );
        }

        .result:hover .link-text,
        .result:focus .link-text {
          color: light-dark(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9));
        }

        .result:hover div:last-child,
        .result:focus div:last-child {
          color: light-dark(
            rgba(255, 255, 255, 0.85),
            rgba(255, 255, 255, 0.85)
          );
        }

        .result:hover .breadcrumb,
        .result:focus .breadcrumb {
          color: light-dark(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8));
        }

        .result:hover simple-datetime,
        .result:focus simple-datetime {
          color: light-dark(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9));
        }
        .result .title {
          font-size: var(--ddd-font-size-s);
          margin: 0 0 var(--ddd-spacing-2) 0;
          font-weight: var(--ddd-font-weight-medium);
          font-family: var(--ddd-font-navigation);
        }
        simple-datetime {
          color: light-dark(
            var(--ddd-theme-default-coalyGray, #666),
            var(--ddd-theme-default-limestoneLight, #ccc)
          );
        }
        simple-icon-lite {
          --simple-icon-height: 12px;
          --simple-icon-width: 12px;
          vertical-align: baseline;
        }
        .result .link-text {
          font-size: var(--ddd-font-size-3xs);
          color: light-dark(
            var(--ddd-theme-default-coalyGray, #666),
            var(--ddd-theme-default-limestoneLight, #999)
          );
          font-style: italic;
          padding-left: var(--ddd-spacing-2);
        }
        .results-found-text {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-m);
          margin: 0 0 var(--ddd-spacing-4) 0;
          padding: 0;
          color: light-dark(var(--ddd-primary-4), var(--ddd-accent-6));
        }
        .result div:last-child {
          font-size: var(--ddd-font-size-xs);
          color: light-dark(
            var(--ddd-theme-default-coalyGray, #555),
            var(--ddd-theme-default-limestoneLight, #bbb)
          );
          margin-top: var(--ddd-spacing-2);
          line-height: var(--ddd-lh-120);
        }
        .result .breadcrumb {
          font-size: var(--ddd-font-size-3xs);
          color: light-dark(
            var(--ddd-theme-default-coalyGray, #777),
            var(--ddd-theme-default-limestoneLight, #aaa)
          );
          margin: var(--ddd-spacing-2) 0;
        }
        .result .breadcrumb simple-icon-lite {
          margin: 0 var(--ddd-spacing-1);
          --simple-icon-height: var(--ddd-icon-3xs);
          --simple-icon-width: var(--ddd-icon-3xs);
        }
        #search {
          flex-grow: 2;
          margin-right: 4px;
          margin-bottom: 0;
          font-size: var(--ddd-font-size-xs);
          --simple-fields-field-color: light-dark(
            black,
            var(--ddd-accent-6, #fff)
          );
          --simple-fields-field-background-color: light-dark(
            var(--ddd-accent-6, #fff),
            var(--ddd-primary-4, #333)
          );
          --simple-fields-field-border-color: light-dark(
            rgba(0, 0, 0, 0.1),
            rgba(255, 255, 255, 0.2)
          );
          --simple-fields-field-placeholder-color: light-dark(
            rgba(0, 0, 0, 0.6),
            rgba(255, 255, 255, 0.7)
          );
        }
        .page-title-icon {
          --simple-icon-height: 32px;
          --simple-icon-width: 32px;
          margin-right: 8px;
          vertical-align: middle;
        }
        simple-tag {
          margin: 0 4px;
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        .no-results {
          font-size: var(--ddd-font-size-s);
          color: light-dark(
            var(--ddd-theme-default-coalyGray, #666),
            var(--ddd-theme-default-limestoneLight, #ccc)
          );
          padding: var(--ddd-spacing-4);
          text-align: center;
        }
        .search-results {
          margin-top: var(--ddd-spacing-2);
        }
        .result .tags {
          margin-top: var(--ddd-spacing-2);
        }
        .result .description {
          margin-top: var(--ddd-spacing-2);
        }
      `,
    ];
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "site-search";
  }
  constructor() {
    super();
    this.HAXCMSI18NMixinBase = "../../../";
    this.t = this.t || {};
    this.t = {
      ...this.t,
      search: "Search",
      results: "results",
      found: "Found",
      typeAtLeast3LettersToStartSearch:
        "Type at least 3 letters to start search",
    };
    this.whileLoading = false;
    this.hideInput = false;
    this.search = "";
    this.showPath = false;
    this.showDate = false;
    this.__results = [];
  }
  // render function
  render() {
    return html`
      <simple-fields-field
        ?hidden="${this.hideInput}"
        id="search"
        always-float-label
        label="${this.t.search}"
        placeholder="${this.t.typeAtLeast3LettersToStartSearch}.."
        type="text"
        value="${this.search}"
        role="searchbox"
        aria-expanded="${this.__results.length > 0 ? "true" : "false"}"
        aria-owns="search-results"
        aria-describedby="search-status"
        @value-changed="${this._searchValueChanged}"
      >
        <simple-icon icon="search" slot="prefix"></simple-icon>
      </simple-fields-field>

      <!-- Screen reader status updates -->
      <div
        id="search-status"
        aria-live="polite"
        aria-atomic="true"
        class="sr-only"
      >
        ${this.whileLoading
          ? "Searching..."
          : this.search.length > 0
            ? `${this.__results.length} ${this.t.results} ${this.t.found.toLowerCase()}`
            : ""}
      </div>

      ${this.search.length > 0
        ? html`
            <h1 class="results-found-text" aria-hidden="true">
              ${this.t.found} ${this.__results.length} ${this.t.results}.
            </h1>
          `
        : html``}

      <lunr-search id="lunr"></lunr-search>
      <loading-indicator
        full
        ?loading="${this.whileLoading}"
        aria-label="Loading search results"
      ></loading-indicator>

      ${this.__results.length > 0
        ? html`
            <section
              id="search-results"
              role="region"
              aria-label="Search results"
              class="search-results"
            >
              ${this.__results.map(
                (item, index) => html`
                  <a
                    class="result"
                    .href="${item.slug ? item.slug : item.location}"
                    @click="${this.selectionMade}"
                    tabindex="0"
                    role="option"
                    aria-posinset="${index + 1}"
                    aria-setsize="${this.__results.length}"
                    aria-describedby="result-${index}-desc"
                  >
                    <div class="title">
                      ${item.icon
                        ? html`<simple-icon-lite
                            class="page-title-icon"
                            icon="${item.icon}"
                            aria-hidden="true"
                          ></simple-icon-lite>`
                        : ``}
                      ${item.title}<span
                        ?hidden="${!this.showPath}"
                        class="link-text"
                        aria-hidden="true"
                        >(${item.location})</span
                      >
                      ${item.tags && item.tags != ""
                        ? html`<div class="tags" role="list" aria-label="Tags">
                            ${item.tags
                              .split(",")
                              .map(
                                (tag) =>
                                  html`<simple-tag
                                    value="${tag.trim()}"
                                    role="listitem"
                                  ></simple-tag>`,
                              )}
                          </div>`
                        : ``}
                    </div>
                    <div class="date" ?hidden="${!this.showDate}">
                      <simple-datetime
                        format="M jS"
                        .timestamp="${item.created}"
                        unix
                        aria-label="Created on"
                        >${item.created}</simple-datetime
                      >
                    </div>
                    ${item.breadcrumb
                      ? html`<nav class="breadcrumb" aria-label="Page location">
                          ${item.breadcrumb.map(
                            (crumb, i) =>
                              html`${i != 0
                                  ? html`<simple-icon-lite
                                      icon="icons:chevron-right"
                                      aria-hidden="true"
                                    ></simple-icon-lite>`
                                  : ``}<span>${crumb.title}</span>`,
                          )}
                        </nav>`
                      : ``}
                    <div id="result-${index}-desc" class="description">
                      ${item.description}..
                    </div>
                  </a>
                `,
              )}
            </section>
          `
        : this.search.length > 0 && !this.whileLoading
          ? html`<div class="no-results" role="status">
              No results found for "${this.search}"
            </div>`
          : html``}
    `;
  }
  selectionMade(e) {
    this.dispatchEvent(
      new CustomEvent(`search-item-selected`, {
        detail: {
          value: e.detail,
        },
      }),
    );
    // hide modal if it's there
    globalThis.dispatchEvent(
      new CustomEvent("simple-modal-hide", {
        bubbles: true,
        cancelable: true,
        detail: {},
      }),
    );
  }
  _searchValueChanged(e) {
    this.search = e.detail.value;
    if (this.search) {
      if (store.getInternalRoute() !== "search") {
        globalThis.history.replaceState({}, null, "x/search");
      }
      const params = new URLSearchParams(globalThis.location.search);
      params.set("search", this.search);
      globalThis.history.replaceState(
        {},
        "",
        decodeURIComponent(`./x/search?${params}`),
      );
    }
  }
  async __resultsChanged(e) {
    if (e.detail.value) {
      setTimeout(() => {
        this.whileLoading = false;
      }, 100);
      let results = e.detail.value;
      await results.map(async (item) => {
        let fullItem = await store.findItemAsObject(
          item.location,
          "slug",
          "item",
        );
        var breadcrumb = [
          {
            title: fullItem ? fullItem.title : "",
          },
        ];
        let itemBuilder = fullItem;
        // walk back through parent tree
        while (itemBuilder && itemBuilder.parent != null) {
          itemBuilder = await store.manifest.items.find(
            (i) => i.id == itemBuilder.parent,
          );
          // double check structure is sound
          if (itemBuilder) {
            breadcrumb.unshift({
              title: itemBuilder.title,
            });
          }
        }
        item.breadcrumb = breadcrumb;
        if (fullItem) {
          item.slug = fullItem.slug;
          // look for type / tags to jaz up results
          if (fullItem.metadata && fullItem.metadata.pageType) {
            item.type = fullItem.metadata.pageType;
          }
          if (fullItem.metadata && fullItem.metadata.icon) {
            item.icon = fullItem.metadata.icon;
          }
          if (fullItem.metadata && fullItem.metadata.tags) {
            item.tags = fullItem.metadata.tags;
          }
        }
      });
      this.__results = [...results];
    } else {
      this.__results = [];
    }
  }
  /**
   * Mix in an opened status
   */
  static get properties() {
    return {
      ...super.properties,
      dataSource: {
        type: String,
        attribute: "data-source",
      },
      whileLoading: {
        type: Boolean,
      },
      showDate: {
        type: Boolean,
        attribute: "show-date",
      },
      showPath: {
        type: Boolean,
        attribute: "show-path",
      },
      hideInput: {
        type: Boolean,
        attribute: "hide-input",
      },
      search: {
        type: String,
      },
      __results: {
        type: Array,
      },
      t: {
        type: Object,
      },
    };
  }
  /**
   * LitElement life cycle - ready callback
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.shadowRoot
      .querySelector("#lunr")
      .addEventListener("results-changed", this.__resultsChanged.bind(this));
  }
  /**
   * LitElement life cycle - properties changed callback
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "search" && this[propName]) {
        this._searchChanged(this[propName], oldValue);
        this.shadowRoot.querySelector("#lunr").search = this[propName];
      }
      if (propName == "dataSource" && this[propName]) {
        this.shadowRoot.querySelector("#lunr").dataSource = this[propName];
      }
    });
  }
  /**
   * Notice search term changed and let's fire up some results
   */
  _searchChanged(term, oldTerm) {
    if (term.length >= 3) {
      this.whileLoading = true;
      // only load up the lunr source data once they have 3 or more characters
      if (typeof this.dataSource === typeof undefined) {
        this.dataSource = "lunrSearchIndex.json";
      }
    }
  }
}
globalThis.customElements.define(SiteSearch.tag, SiteSearch);
export { SiteSearch };
