/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 * `site-search`
 * `Searching HAXcms content using the auto-generated lunr search configuration`
 *

 * @polymer
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
          height: 55vh;
          width: 60vh;
        }
        .result {
          display: block;
          background-color: #eeeeee;
          color: #222222;
          border: 1px solid black;
          padding: 16px;
        }
        .result:hover,
        .result:focus {
          background-color: #dddddd;
          color: black;
          color: var(--site-search-link-color-hover, #000000);
          text-decoration: underline;
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
        .result .link-text {
          font-size: 12px;
          color: var(--site-search-link-text-color, #999999);
          font-style: italic;
          padding-left: 8px;
        }
        #search {
          flex-grow: 2;
          margin-right: 4px;
          --paper-input-container-input-color: var(
            --site-search-text-color,
            #000
          );
          --paper-input-container-shared-input-style_-_color: var(
            --site-search-text-color,
            #000
          );
          --paper-input-container-focus-color: var(
            --site-search-line-color,
            #000
          );
          --paper-input-container-color: var(
            --site-search-placeholder-color,
            #222
          );
          color: var(--site-search-placeholder-color, #222);
        }
      `
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
    this.search = "";
    this.__results = [];
    setTimeout(() => {
      import("@polymer/paper-input/paper-input.js");
      import("@polymer/iron-icons/iron-icons.js");
      import("@polymer/iron-icon/iron-icon.js");
      import("@lrnwebcomponents/lunr-search/lunr-search.js");
      import("@lrnwebcomponents/simple-datetime/simple-datetime.js");
    }, 0);
  }
  // render function
  render() {
    return html`
      <paper-input
        id="search"
        always-float-label
        label="Search"
        @value-changed="${this._searchValueChanged}"
      >
        <iron-icon icon="search" slot="prefix"></iron-icon>
      </paper-input>
      ${this.search.length > 0
        ? html`
            Found ${this.__results.length} results.
          `
        : html``}
      <lunr-search id="lunr"></lunr-search>

      ${this.__results.map(
        item => html`
          <a class="result" .href="${item.slug}">
            <div class="title">
              ${item.title}<span class="link-text" aria-hidden="true"
                >(${item.slug})</span
              >
            </div>
            <div class="date">
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
        attribute: "data-source"
      },
      search: {
        type: String
      },
      __results: {
        type: Array
      }
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
