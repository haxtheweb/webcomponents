/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
/**
 * `site-search`
 * `Searching HAXcms content using the auto-generated lunr search configuration`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SiteSearch extends PolymerElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "site-search";
  }
  constructor() {
    super();
    import("@polymer/paper-input/paper-input.js");
    import("@polymer/iron-icons/iron-icons.js");
    import("@polymer/iron-icon/iron-icon.js");
    import("@lrnwebcomponents/lunr-search/lunr-search.js");
    import("@lrnwebcomponents/simple-datetime/simple-datetime.js");
  }
  // render function
  static get template() {
    return html`
      <style>
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
          @apply --site-search-result;
        }
        .result:hover,
        .result:focus {
          background-color: #dddddd;
          color: black;
          color: var(--site-search-link-color-hover, #000000);
          text-decoration: underline;
          @apply --site-search-result-hover;
        }
        .result .title {
          font-size: 28px;
          margin: 0 0 8px 0;
          line-height: 1;
          @apply --site-search-link-text;
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
          @apply --site-search-link-text;
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
      </style>
      <paper-input
        id="search"
        always-float-label
        label="Search"
        value="{{search}}"
      >
        <iron-icon icon="search" slot="prefix"></iron-icon>
      </paper-input>
      <template is="dom-if" if="[[search]]">
        Found [[__results.length]] results.
      </template>
      <lunr-search
        data-source="[[dataSource]]"
        search="[[search]]"
        results="{{__results}}"
      ></lunr-search>
      <iron-list items="[[__results]]">
        <template>
          <a class="result" href$="[[item.location]]">
            <div class="title">
              [[item.title]]<span class="link-text" aria-hidden="true"
                >([[item.location]])</span
              >
            </div>
            <div class="date">
              <simple-datetime
                format="M jS"
                timestamp="[[item.created]]"
                unix
              ></simple-datetime>
            </div>
            <p>[[item.description]]..</p>
          </a>
        </template>
      </iron-list>
    `;
  }
  /**
   * Mix in an opened status
   */
  static get properties() {
    return {
      dataSource: {
        type: String
      },
      search: {
        type: String,
        observer: "_searchChanged"
      },
      __results: {
        type: Array
      }
    };
  }
  /**
   * Notice search term changed and let's fire up some results
   */
  _searchChanged(term, oldTerm) {
    // lazy load the search assets when they start typing on the first time
    if (term && typeof oldTerm === typeof undefined) {
      import("@polymer/iron-list/iron-list.js");
    }
    // only load up the lunr source data once they have 3 or more characters
    if (term.length >= 3 && typeof this.dataSource === typeof undefined) {
      this.dataSource = "lunrSearchIndex.json";
    }
  }
}
window.customElements.define(SiteSearch.tag, SiteSearch);
export { SiteSearch };
