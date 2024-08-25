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
          background-color: var(
            --site-search-result-background-color,
            var(--ddd-theme-default-limestoneLight, #ddd)
          );
          color: var(--site-search-result-color, #222222);
          padding: var(--ddd-spacing-2);
          margin: var(--ddd-spacing-2) 0;
          font-weight: var(--ddd-font-weight-regular);
          transition: background-color 0.3s ease-in-out;
        }

        .result:hover,
        .result:focus {
          background-color: var(
            --site-search-result-background-color-hover,
            var(--ddd-theme-default-infoLight)
          );
          color: var(
            --site-search-link-color-hover,
            var(--ddd-theme-default-info, #000)
          );
          text-decoration: none;
          outline: 3px solid var(--ddd-theme-default-info);
        }
        .result .title {
          font-size: var(--ddd-font-size-xs);
          margin: 0 0 var(--ddd-spacing-4) 0;
          font-weight: var(--ddd-font-weight-medium);
        }
        .result {
          color: var(--site-search-link-color, #444444);
          text-decoration: none;
        }
        simple-datetime {
          color: var(--site-search-link-color, #444444);
        }
        simple-icon-lite {
          --simple-icon-height: 12px;
          --simple-icon-width: 12px;
          vertical-align: baseline;
        }
        .result .link-text {
          font-size: 12px;
          color: var(--site-search-link-text-color, #999999);
          font-style: italic;
          padding-left: 8px;
        }
        .results-found-text {
          font-family: var(--ddd-font-secondary);
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
        }
        #search {
          flex-grow: 2;
          margin-right: 4px;
          margin-bottom: 0;
          font-size: var(--ddd-font-size-xs);
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
        @value-changed="${this._searchValueChanged}"
      >
        <simple-icon icon="search" slot="prefix"></simple-icon>
      </simple-fields-field>
      ${this.search.length > 0
        ? html`
            <h1 class="results-found-text">
              ${this.t.found} ${this.__results.length} ${this.t.results}.
            </h1>
          `
        : html``}
      <lunr-search id="lunr"></lunr-search>
      <loading-indicator
        full
        ?loading="${this.whileLoading}"
      ></loading-indicator>
      ${this.__results.map(
        (item) => html`
          <a
            class="result"
            .href="${item.slug ? item.slug : item.location}"
            @click="${this.selectionMade}"
          >
            <div class="title">
              ${item.icon
                ? html`<simple-icon-lite
                    class="page-title-icon"
                    icon="${item.icon}"
                  ></simple-icon-lite>`
                : ``}
              ${item.title}<span
                ?hidden="${!this.showPath}"
                class="link-text"
                aria-hidden="true"
                >(${item.location})</span
              >
              ${item.tags && item.tags != ""
                ? html`${item.tags
                    .split(",")
                    .map(
                      (tag) =>
                        html`<simple-tag value="${tag.trim()}"></simple-tag>`,
                    )}`
                : ``}
            </div>
            <div class="date" ?hidden="${!this.showDate}">
              <simple-datetime format="M jS" .timestamp="${item.created}" unix
                >${item.created}</simple-datetime
              >
            </div>
            ${item.breadcrumb
              ? html`<div>
                  ${item.breadcrumb.map(
                    (crumb, i) =>
                      html`${i != 0
                        ? html`<simple-icon-lite
                            icon="icons:chevron-right"
                          ></simple-icon-lite>`
                        : ``}${crumb.title}`,
                  )}
                </div>`
              : ``}
            <div>${item.description}..</div>
          </a>
        `,
      )}
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
customElements.define(SiteSearch.tag, SiteSearch);
export { SiteSearch };
