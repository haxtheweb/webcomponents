/**
 * Inspired by https://github.com/olivernn/lunr.js
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import "@haxtheweb/es-global-bridge/es-global-bridge.js";
/**
 * `lunr-search`
 * `LunrJS search element`
 * @demo demo/index.html
 * @element lunr-search
 */
class LunrSearch extends LitElement {
  //styles function
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none;
        }
        .result-title {
          font-weight: var(--ddd-font-weight-bold, bold);
        }
      `,
    ];
  }

  // render function
  render() {
    // demo results render as a list with aria-live for result updates;
    // no heading-per-result (heading hierarchy) and missing titles are
    // guarded so no empty headings render (haxtheweb/issues#3102)
    return html`
      ${this.demo
        ? html`<div class="results" aria-live="polite">
            ${this.results && this.results.length > 0
              ? html`<ul aria-label="Search results">
                  ${this.results.map(
                    (item) => html`<li>
                      ${item && item.title
                        ? html`<span class="result-title"
                            >${item.title}</span
                          >`
                        : ``}
                      ${item && item.description
                        ? html`<p>${item.description}</p>`
                        : ``}
                    </li>`,
                  )}
                </ul>`
              : ``}
          </div>`
        : ``}
      <slot></slot>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      dataSource: {
        type: String,
        attribute: "data-source",
      },
      __auto: {
        type: Boolean,
      },
      data: {
        type: Array,
      },
      method: {
        type: String,
      },
      search: {
        type: String,
      },
      results: {
        type: Array,
      },
      noStopWords: {
        type: Boolean,
        attribute: "no-stop-words",
      },
      fields: {
        type: Array,
      },
      indexNoStopWords: {
        type: Object,
      },
      index: {
        type: Object,
      },
      __lunrLoaded: {
        type: Boolean,
      },
      limit: {
        type: Number,
      },
      minScore: {
        type: Number,
      },
      log: {
        type: Boolean,
      },
      demo: {
        type: Boolean,
        reflect: true,
      },
    };
  }
  constructor() {
    super();
    this.windowControllers = new AbortController();
    this.method = "GET";
    this.noStopWords = false;
    this.dataSource = null;
    this.fields = [];
    this.limit = 500;
    this.__auto = false;
    this.minScore = 0;
    this.log = false;
    if (globalThis.WCGlobalBasePath) {
      this.basePath = globalThis.WCGlobalBasePath;
    } else {
      this.basePath =
        new URL("./lunr-search.js", import.meta.url).href + "/../../../";
    }
    const location = `${this.basePath}lunr/lunr.js`;
    globalThis.addEventListener(
      "es-bridge-lunr-loaded",
      this._lunrLoaded.bind(this),
      { signal: this.windowControllers.signal },
    );

    globalThis.ESGlobalBridge.requestAvailability().load("lunr", location);
    if (
      globalThis.ESGlobalBridge.requestAvailability().imports["lunr"] === true
    ) {
      setTimeout(() => {
        this.__lunrLoaded = true;
      }, 0);
    }
  }
  willUpdate(changedProperties) {
    if (super.willUpdate) {
      super.willUpdate(changedProperties);
    }
    // Derive __auto/index/results in willUpdate so they batch into the
    // current update cycle. Setting them in updated() scheduled a redundant
    // second update (Lit change-in-update warning). index is derived before
    // results so a data change computes results against the fresh index in
    // this same cycle instead of a follow-up update.
    // only request data when we actually have a data source
    if (changedProperties.has("dataSource") && this.dataSource) {
      this.__auto = true;
    }
    if (
      ["data", "fields", "noStopWords", "__lunrLoaded"].some((prop) =>
        changedProperties.has(prop),
      )
    ) {
      this.index = this._createIndex(
        this.data,
        this.fields,
        this.noStopWords,
        this.__lunrLoaded,
      );
    }
    if (
      ["data", "search", "index", "minScore", "limit"].some((prop) =>
        changedProperties.has(prop),
      )
    ) {
      this.results = this.searched(
        this.data,
        this.search,
        this.index,
        this.minScore,
        this.limit,
      );
    }
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (
        ["dataSource", "__auto", "method"].includes(propName) &&
        this.dataSource &&
        this.method
      ) {
        clearTimeout(this.__debounce);
        this.__debounce = setTimeout(() => {
          fetch(this.dataSource, {
            method: this.method,
          })
            .then((response) => {
              if (response.ok) return response.json();
            })
            .then((json) => {
              this._dataResponse(json);
            });
        }, 0);
      }
      let notifiedProps = ["data", "search", "results", "noStopWords"];
      if (notifiedProps.includes(propName)) {
        // notify
        let eventName = `${propName
          .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2")
          .toLowerCase()}-changed`;
        this.dispatchEvent(
          new CustomEvent(eventName, {
            detail: {
              value: this[propName],
            },
          }),
        );
      }
    });
  }
  disconnectedCallback() {
    this.windowControllers.abort();
    super.disconnectedCallback();
  }
  _lunrLoaded(e) {
    // callback when loaded
    this.__lunrLoaded = true;
    this.windowControllers.abort();
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "lunr-search";
  }
  _dataResponse(response) {
    // must get a real response
    if (response) {
      try {
        this.data = [...response];
      } catch (e) {
        console.warn(e);
      }
    }
  }
  /**
     Filters your input data
     
     @param {Array} data Array of Objects with common properties.
     @param {String} search The search term that filters results.
     @param {Object} index The lunr Index..
     @param {Number} minScore The minimum score of your results.
     @param {Number} limit The maximum number of results you'd like your results.
     
     @return {Array} The filtered data.
    */
  searched(data, search, index, minScore, limit) {
    // an explicit empty-string search has no results but must report
    // [] rather than undefined; null/undefined search still falls
    // through to the guard below (haxtheweb/issues#3102)
    if (data && index && "" + search === "") {
      return [];
    }
    if (data && index && search) {
      var results = [];
      if ("" + search !== "") {
        var searched = index.search(search);
        for (var i = 0; i < searched.length; i++) {
          if (i === limit || searched[i].score < minScore) {
            break;
          }
          // match on the id within the array of options
          let tmpItem = data.find((j) => j.id == searched[i].ref);
          results.push(tmpItem);
        }
      }
      if (results.length === 0 && !this.noStopWords && "" + search !== "") {
        if (!this.indexNoStopWords) {
          this.indexNoStopWords = this._createIndex(
            data,
            this.fields,
            true,
            this.__lunrLoaded,
          );
        }
        searched = this.indexNoStopWords.search(search);
        var results = [];
        for (var i = 0; i < searched.length; i++) {
          if (i === limit || searched[i].score < minScore) {
            break;
          }
          let tmpItem = data.find((j) => j.id == searched[i].ref);
          results.push(tmpItem);
        }
      }
      return results;
    }
  }
  _createIndex(data, fields, noStopWords, ready) {
    if (ready) {
      let root = this;
      if (Array.isArray(data) && data.length > 0) {
        if (Array.isArray(fields) && fields.length > 0) {
          return lunr(function () {
            // remove the stop word filter BEFORE add() so documents are
            // indexed with stop words intact, matching the queries that
            // keep them (haxtheweb/issues#3102)
            if (noStopWords) {
              this.pipeline.remove(lunr.stopWordFilter);
            }
            for (var i = 0; i < fields.length; i++) {
              if (fields[i].charAt(0) === fields[i].charAt(0).toUpperCase()) {
                this.field(fields[i], { boost: 10 });
              } else {
                this.field(fields[i]);
              }
            }
            for (var i = 0; i < data.length; i++) {
              // index under the data's own id when present so
              // searched() matches refs against j.id
              // (haxtheweb/issues#3102)
              var toIndex = {
                id:
                  data[i].id !== undefined && data[i].id !== null
                    ? data[i].id
                    : i,
              };
              for (var f = 0; f < fields.length; f++) {
                if (
                  data[i].hasOwnProperty(fields[f]) &&
                  data[i][fields[f]] !== null &&
                  typeof data[i][fields[f]].toString == "function" &&
                  (data[i][fields[f]].toString().split(" ").length > 2 ||
                    data[i][fields[f]].toString().length < 30)
                ) {
                  //indicate that they might be words in it
                  toIndex[fields[f]] = data[i][fields[f]].toString();
                } else {
                  toIndex[fields[f]] = "";
                }
              }
              this.add(toIndex);
            }
          });
        } else {
          // find fields
          // TODO only word best fields.
          var fields = [];
          var ddup = {};
          return lunr(function () {
            // remove the stop word filter BEFORE add() (see explicit
            // fields branch, haxtheweb/issues#3102)
            if (noStopWords) {
              this.pipeline.remove(lunr.stopWordFilter);
            }
            for (
              var indexOfData = 0;
              indexOfData < data.length;
              indexOfData++
            ) {
              for (var prop in data[indexOfData]) {
                if (
                  prop.charAt(0) !== "_" &&
                  !ddup.hasOwnProperty(prop) &&
                  (prop.toString().split(" ").length > 2 ||
                    prop.toString().length < 30)
                ) {
                  fields.push(prop);
                  if (prop.charAt(0) === prop.charAt(0).toUpperCase()) {
                    this.field(prop, { boost: 10 });
                  } else {
                    this.field(prop);
                  }
                  ddup[prop] = 1;
                }
              }
            }
            if (fields.length > 0) {
              root.fields = fields;
            }
            for (var i = 0; i < data.length; i++) {
              var toIndex = { id: i };
              for (var f = 0; f < fields.length; f++) {
                if (
                  data[i].hasOwnProperty(fields[f]) &&
                  data[i][fields[f]] !== null &&
                  typeof data[i][fields[f]].toString == "function" &&
                  (data[i][fields[f]].toString().split(" ").length > 2 ||
                    data[i][fields[f]].toString().length < 30)
                ) {
                  //indicate that they might be words in it
                  toIndex[fields[f]] = data[i][fields[f]].toString();
                } else {
                  toIndex[fields[f]] = "";
                }
              }
              this.add(toIndex);
            }
          });
        }
      }
    }
  }
}
globalThis.customElements.define(LunrSearch.tag, LunrSearch);
export { LunrSearch };
