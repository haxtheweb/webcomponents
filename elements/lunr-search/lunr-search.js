/**
 * Inspired by https://github.com/olivernn/lunr.js
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";
import "@polymer/iron-ajax/iron-ajax.js";
/**
 * `lunr-search`
 * `LunrJS search element`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class LunrSearch extends PolymerElement {
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none;
        }
      </style>
      <iron-ajax
        auto
        url="[[dataSource]]"
        method="[[method]]"
        handle-as="json"
        on-response="_dataResponse"
      ></iron-ajax>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    let props = {
      dataSource: {
        name: "dataSource",
        type: String
      },
      data: {
        name: "data",
        type: Array,
        notify: true
      },
      method: {
        name: "method",
        type: String,
        value: "GET"
      },
      search: {
        type: String,
        notify: true
      },
      results: {
        type: Array,
        computed: "searched(data, search, index, minScore, limit)",
        notify: true
      },
      noStopWords: {
        type: Boolean,
        value: false,
        notify: true
      },
      fields: {
        type: Array,
        value: []
      },
      indexNoStopWords: {
        type: Object
      },
      index: {
        type: Object,
        computed: "_createIndex(data, fields, noStopWords, __lunrLoaded)"
      },
      __lunrLoaded: {
        type: Boolean
      },
      limit: {
        type: Number,
        value: 500
      },
      minScore: {
        type: Number,
        value: 0
      },
      log: {
        type: Boolean,
        value: false
      }
    };
    if (super.properties) {
      props = Object.assign(props, super.properties);
    }
    return props;
  }
  constructor() {
    super();
    const basePath = this.pathFromUrl(import.meta.url);
    const location = `${basePath}../../lunr/lunr.js`;
    window.addEventListener(
      "es-bridge-lunr-loaded",
      this._lunrLoaded.bind(this)
    );
    window.ESGlobalBridge.requestAvailability();
    window.ESGlobalBridge.instance.load("lunr", location);
    if (
      window.ESGlobalBridge.imports &&
      window.ESGlobalBridge.imports["lunr"]
    ) {
      this.__lunrLoaded = true;
    }
  }
  // simple path from a url modifier
  pathFromUrl(url) {
    return url.substring(0, url.lastIndexOf("/") + 1);
  }
  disconnectedCallback() {
    window.removeEventListener(
      "es-bridge-lunr-loaded",
      this._lunrLoaded.bind(this)
    );
    super.disconnectedCallback();
  }
  _lunrLoaded(e) {
    // callback when loaded
    this.__lunrLoaded = true;
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "lunr-search";
  }
  _dataResponse(e) {
    this.set("data", e.detail.response);
    this.notifyPath("data.*");
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
    if (data && index && search) {
      var results = [];
      if ("" + search !== "") {
        var searched = index.search(search);
        for (var i = 0; i < searched.length; i++) {
          if (i === limit || searched[i].score < minScore) {
            break;
          }
          // match on the id within the array of options
          let tmpItem = data.find(j => j.id == searched[i].ref);
          results.push(tmpItem);
        }
      }
      if (results.length === 0 && !this.noStopWords && "" + search !== "") {
        if (!this.indexNoStopWords) {
          this.indexNoStopWords = this._createIndex(
            data,
            this.fields,
            true,
            index
          );
        }
        searched = this.indexNoStopWords.search(search);
        var results = [];
        for (var i = 0; i < searched.length; i++) {
          if (i === limit || searched[i].score < minScore) {
            break;
          }
          let tmpItem = data.find(j => j.id == searched[i].ref);
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
          return lunr(function() {
            for (var i = 0; i < fields.length; i++) {
              if (fields[i].charAt(0) === fields[i].charAt(0).toUpperCase()) {
                this.field(fields[i], { boost: 10 });
              } else {
                this.field(fields[i]);
              }
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
            if (noStopWords) {
              this.pipeline.remove(lunr.stopWordFilter);
            }
          });
        } else {
          // find fields
          // TODO only word best fields.
          var fields = [];
          var ddup = {};
          return lunr(function() {
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
            if (noStopWords) {
              this.pipeline.remove(lunr.stopWordFilter);
            }
          });
        }
      }
    }
  }
}
window.customElements.define(LunrSearch.tag, LunrSearch);
export { LunrSearch };
