/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import "@lrnwebcomponents/simple-fields/lib/simple-fields-field.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/iframe-loader/lib/loading-indicator.js";
import {
  store,
  HAXcmsStore,
} from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { HAXCMSI18NMixin } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/HAXCMSI18NMixin.js";
import "@lrnwebcomponents/simple-fields/lib/simple-tag.js";
import "@lrnwebcomponents/lunr-search/lunr-search.js";
import "@lrnwebcomponents/simple-datetime/simple-datetime.js";
/**
 * `site-search`
 * `Searching HAXcms content using the auto-generated lunr search configuration`
 *
 * @demo demo/index.html
 */
class SiteSearch extends HAXCMSI18NMixin(LitElement) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          font-size: 16px;
          color: var(--site-search-color, #383f45);
        }
        [hidden] {
          display: none;
        }
        .result {
          display: block;
          background-color: var(--site-search-result-background-color, #eeeeee);
          color: var(--site-search-result-color, #222222);
          padding: 12px;
          margin: 4px 0;
        }
        .result:hover,
        .result:focus {
          background-color: var(
            --site-search-result-background-color-hover,
            #dddddd
          );
          color: var(--site-search-link-color-hover, #000000);
          text-decoration: none;
          outline: 4px solid grey;
        }
        .result .title {
          font-size: 28px;
          margin: 0 0 8px 0;
          line-height: 1;
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
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
        }
        #search {
          flex-grow: 2;
          margin-right: 4px;
          --simple-fields-accent-color: var(--site-search-text-color, #000);
          color: var(--site-search-placeholder-color, #222);
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
          <a class="result" .href="${item.slug}" @click="${this.selectionMade}">
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
                        html`<simple-tag value="${tag.trim()}"></simple-tag>`
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
                        : ``}${crumb.title}`
                  )}
                </div>`
              : ``}
            <div>${item.description}..</div>
          </a>
        `
      )}
    `;
  }
  selectionMade(e) {
    this.dispatchEvent(
      new CustomEvent(`search-item-selected`, {
        detail: {
          value: e.detail,
        },
      })
    );
    // hide modal if it's there
    globalThis.dispatchEvent(
      new CustomEvent("simple-modal-hide", {
        bubbles: true,
        cancelable: true,
        detail: {},
      })
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
        decodeURIComponent(`./x/search?${params}`)
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
          "item"
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
            (i) => i.id == itemBuilder.parent
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
