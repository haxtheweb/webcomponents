/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-fields/lib/simple-fields-field.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
/**
 * `site-search`
 * `Searching HAXcms content using the auto-generated lunr search configuration`
 *
 * @demo demo/index.html
 */
class SiteSearch extends LitElement {
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
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
        }
        .result:hover,
        .result:focus {
          background-color: var(
            --site-search-result-background-color-hover,
            #dddddd
          );
          color: var(--site-search-link-color-hover, #000000);
          text-decoration: none;
          outline: 2px solid grey;
          outline-offset: 4px;
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
    this.hideInput = false;
    this.search = "";
    this.showPath = false;
    this.showDate = false;
    this.__results = [];
    setTimeout(() => {
      import("@lrnwebcomponents/lunr-search/lunr-search.js");
      import("@lrnwebcomponents/simple-datetime/simple-datetime.js");
    }, 0);
  }
  // render function
  render() {
    return html`
      <simple-fields-field
        ?hidden="${this.hideInput}"
        id="search"
        always-float-label
        label="Search"
        type="text"
        @value-changed="${this._searchValueChanged}"
      >
        <simple-icon icon="search" slot="prefix"></simple-icon>
      </simple-fields-field>
      ${this.search.length > 0
        ? html`
            <h1 class="results-found-text">
              Found ${this.__results.length} results.
            </h1>
          `
        : html``}
      <lunr-search id="lunr"></lunr-search>

      ${this.__results.map(
        (item) => html`
          <a
            class="result"
            .href="${item.location}"
            @click="${this.selectionMade}"
          >
            <div class="title">
              ${item.title}<span
                ?hidden="${!this.showPath}"
                class="link-text"
                aria-hidden="true"
                >(${item.location})</span
              >
            </div>
            <div class="date" ?hidden="${!this.showDate}">
              <simple-datetime format="M jS" .timestamp="${item.created}" unix
                >${item.created}</simple-datetime
              >
            </div>
            <p>${item.description}..</p>
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
  }
  _searchValueChanged(e) {
    this.search = e.detail.value;
  }
  __resultsChanged(e) {
    if (e.detail.value) {
      this.__results = [...e.detail.value];
    } else {
      this.__results = [];
    }
  }
  /**
   * Mix in an opened status
   */
  static get properties() {
    return {
      dataSource: {
        type: String,
        attribute: "data-source",
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
    };
  }
  /**
   * LitElement life cycle - ready callback
   */
  firstUpdated(changedProperties) {
    this.shadowRoot
      .querySelector("#lunr")
      .addEventListener("results-changed", this.__resultsChanged.bind(this));
  }
  /**
   * LitElement life cycle - properties changed callback
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "search") {
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
    // only load up the lunr source data once they have 3 or more characters
    if (term.length >= 3 && typeof this.dataSource === typeof undefined) {
      this.dataSource = "lunrSearchIndex.json";
    }
  }
}
window.customElements.define(SiteSearch.tag, SiteSearch);
export { SiteSearch };
