/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/iron-icons/av-icons.js";
import "@polymer/iron-icons/communication-icons.js";
import "@polymer/iron-icons/device-icons.js";
import "@polymer/iron-icons/editor-icons.js";
import "@polymer/iron-icons/hardware-icons.js";
import "@polymer/iron-icons/image-icons.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/maps-icons.js";
import "@polymer/iron-icons/notification-icons.js";
import "@polymer/iron-icons/places-icons.js";
import "@polymer/iron-icons/social-icons.js";
import "@lrnwebcomponents/lrn-icons/lrn-icons.js";
import "@lrnwebcomponents/mdi-iconset-svg/mdi-iconset-svg.js";
import "@lrnwebcomponents/hax-iconset/hax-iconset.js";
import {
  HaxSchematizer,
  HaxElementizer
} from "@lrnwebcomponents/hax-body-behaviors/lib/HAXFields.js";
import "@lrnwebcomponents/simple-fields/simple-fields.js";
import { SimpleFieldsForm } from "@lrnwebcomponents/simple-fields/lib/simple-fields-form.js";
import "./hax-element-card-list.js";
/**
 * `hax-element-list-selector`
 * selects a hax element
 * @demo demo/hax.html
 * @element hax-element-list-selector
 */
class HaxElementListSelector extends LitElement {
  static get tag() {
    return "hax-element-list-selector";
  }
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        :host([loading]) hax-element-card-list {
          visibility: hidden;
          opacity: 0;
          transition: 1s ease-in-out all;
        }
        hax-element-card-list {
          visibility: visible;
          opacity: 1;
        }
        hexagon-loader[loading] {
          position: absolute;
          width: 100%;
        }
        [hidden] {
          display: none !important;
        }
      `
    ];
  }
  constructor() {
    super();
    this.loading = false;
    this.cols = 3;
    this.showCardList = false;
    this.imports = [];
    this.haxData = [];
    this.noSchema = {};
    this.method = "GET";
    this.autoload = true;
    // default fields json blob, most implementations should provide their own though obviously
    this.loadEndpoint =
      this.pathFromUrl(decodeURIComponent(import.meta.url)) + "fields.json";
    if (window.WCGlobalBasePath) {
      this.basePath = window.WCGlobalBasePath;
    } else {
      this.basePath =
        this.pathFromUrl(decodeURIComponent(import.meta.url)) + "../../../";
    }
    setTimeout(() => {
      window.addEventListener(
        "active-tab-changed",
        this._activeTabChanged.bind(this)
      );
    }, 0);
    this.addEventListener("response", this._response);
    this.addEventListener("value-changed", this._valueChanged);
  }
  static get properties() {
    return {
      ...SimpleFieldsForm.properties,
      /**
       * Show card list so that it SEEMS like its happenign when we click HAX elements
       */
      showCardList: {
        type: Boolean
      },
      /**
       * JS imports
       */
      imports: {
        type: Object
      },
      /**
       * HAXSchema array
       */
      haxData: {
        type: Array
      },
      /**
       * Valid tags on the CDN but that don't have haxSchema.
       */
      noSchema: {
        type: Object
      },
      /**
       * Data filtered by form changes
       */
      filteredHaxData: {
        type: Array
      },
      /**
       * Columns to render
       */
      cols: {
        type: Number
      },
      /**
       * End point to load this data
       */
      fieldsEndpoint: {
        type: String,
        attribute: "fields-endpoint"
      },
      /**
       * End point to load up a list of imports
       */
      wcRegistryEndpoint: {
        type: String,
        attribute: "wc-registry-endpoint"
      },
      /**
       * Request method
       */
      method: {
        type: String
      },
      loading: {
        type: Boolean,
        reflect: true
      }
    };
  }
  // simple path from a url modifier
  pathFromUrl(url) {
    return url.substring(0, url.lastIndexOf("/") + 1);
  }
  render() {
    return html`
      <simple-fields-form
        id="form"
        autoload
        load-endpoint="${this.loadEndpoint}"
        method="${this.method}"
        .schematizer="${HaxSchematizer}"
        .elementizer="${HaxElementizer}"
        @response="${this._response}"
        @haxcore.search.haxcore-search-autoloader-value-changed="${e =>
          console.log("--changed", e, e.detail)}"
        @haxcore.search.haxcore-search-columns-value-changed="${e =>
          (this.cols = e.detail.value)}"
        @value-changed="${this._valueChanged}"
      >
      </simple-fields-form>
    `;
  }
  _activeTabChanged(e) {
    if (e.detail.activeTab == "haxcore.search") {
      this.showCardList = true;
    } else {
      this.showCardList = false;
    }
  }
  _getElement(id) {
    return this.form && this.form.formElements && this.form.formElements[id]
      ? this.form.formElements[id].element
      : undefined;
  }
  get form() {
    return this.shadowRoot && this.shadowRoot.querySelector("#form")
      ? this.shadowRoot.querySelector("#form")
      : undefined;
  }
  get cardList() {
    return this._getElement("haxcore.search.haxcore-search-autoloader");
  }
  get searchColumns() {
    this._getElement("haxcore.search.haxcore-search-columns");
  }
  get haxTags() {
    this._getElement("haxcore.providerdetails.haxcore-providerdetails-haxtags");
  }
  get otherTags() {
    this._getElement(
      "haxcore.providerdetails.haxcore-providerdetails-othertags"
    );
  }
  updated(changedProperties) {
    changedProperties.forEach(async (oldValue, propName) => {
      if (propName == "loading" && this.cardList)
        this.cardList.loading = this.loading;
      if (propName == "showCardList" && this.cardList)
        this.cardList.showCardList = this.showCardList;
      if (propName == "cols" && this.cardList) this.cardList.cols = this.cols;
      if (propName == "cols" && this.searchColumns)
        this.searchColumns.value = this.cols;

      if (propName == "wcRegistryEndpoint") {
        this.haxData = [];
        this.imports = [];
        fetch(this.wcRegistryEndpoint)
          .then(response => {
            this.loading = true;
            return response.json();
          })
          .then(data => {
            this.imports = data;
          });
      }
      // when imports changes make sure we import everything found
      if (propName == "imports") {
        let list = this.haxData,
          noSchema = this.noSchema;
        for (var tag in this[propName]) {
          let file = this[propName][tag];
          try {
            await import(`${this.basePath}${file}`).then(module => {
              if (
                module &&
                Object.keys(module)[0] &&
                module[Object.keys(module)[0]].haxProperties &&
                module[Object.keys(module)[0]].haxProperties.gizmo &&
                module[Object.keys(module)[0]].haxProperties.gizmo.title
              ) {
                let detail = {
                  tag: tag,
                  file: file,
                  schema: module[Object.keys(module)[0]].haxProperties
                };
                list.push(detail);
              } else {
                noSchema[tag] = file;
                //console.log(`${tag} doesn't have haxSchema`);
              }
            });
          } catch (e) {
            console.warn(e);
          }
        }
        this.haxData = [...list];
        this.noSchema = {};
        this.noSchema = noSchema;
        this.loading = false;
      }
      // this is the local data we don't let change
      if (propName == "haxData") {
        if (this.form) console.log("imports", this.form.value);
        this.filteredHaxData = [...this.haxData];
        if (this.haxData.length > 0) {
          let renderHaxData = {};
          for (var i in this.haxData) {
            renderHaxData[this.haxData[i].tag] = this.haxData[i].file;
          }
          if (this.cardList) this.cardList.list = this.filteredHaxData;
          if (this.haxTags)
            this.haxTags.editorValue = JSON.stringify(renderHaxData, null, 2);

          console.log(
            "haxData changed",
            this.haxData,
            this.filteredHaxData,
            renderHaxData,
            this.haxTags
          );
        }
        
      }
      if(propName == "filteredHaxData" && this.cardList) 
      this.cardList.filteredTags = this.filteredHaxData.map(el=>el.tag);
      if (
        propName == "noSchema" &&
        Object.keys(this.noSchema).length > 0 &&
        this.otherTags
      )
        this.otherTags.editorValue = JSON.stringify(this.noSchema, null, 2);
    });
  }
  applyFilters(filters) {
    let data = [...this.haxData];
    Object.keys(filters || {}).forEach(key => {
      if (filters[key] != "") {
        switch (key) {
          case "haxcore-search-search":
            data = data.filter(item => {
              if (
                item.schema.gizmo.title
                  .toLowerCase()
                  .includes(filters[key].toLowerCase())
              ) {
                return true;
              }
              return false;
            });
            break;
          case "haxcore-search-tags":
            data = data.filter(item => {
              if (item.schema.gizmo.groups.includes(filters[key])) {
                return true;
              }
              return false;
            });
            break;
          case "haxcore-search-hasdemo":
            // only filter if box checked otherwise show all
            if (filters[key]) {
              data = data.filter(item => {
                if (item.schema.demoSchema) {
                  return true;
                }
                return false;
              });
            }
            break;
        }
      }
    });
    if (cols) this.cols = cols;
    console.log('filteredHaxData',this.filteredHaxData);
    this.filteredHaxData = [...data];
  }
  /**
   * Listen for response and then apply initial settings
   */
  _response(e) {
    if (this.searchColumns) this.searchColumns.value = this.cols;
    if (this.cardList) this.cardList.cols = this.cols;
    //this._valueChanged(e);
  }
  /**
   * notice any value changing and then getting the form fresh
   */
  _valueChanged() {
    clearTimeout(this.__valueDebounce);
    this.__valueDebounce = setTimeout(() => {
      let haxcore =
        this.form && this.form.value && this.form.value.haxcore
          ? this.form.value.haxcore
          : undefined;
      console.log("_valueChanged", this.value, this.form.value, haxcore);
      if (haxcore) {
        let cols =
          haxcore.search && haxcore.search["haxcore-search-columns"]
            ? haxcore.search["haxcore-search-columns"]
            : undefined;
        // look for CDN provider
        console.log("haxcore.providers", haxcore, haxcore.providers);
        if (haxcore.providers["haxcore-providers-cdn"] == "other") {
          this.wcRegistryEndpoint =
            haxcore.providers["haxcore-providers-other"] + "wc-registry.json";
        } else {
          this.wcRegistryEndpoint =
            haxcore.providers["haxcore-providers-cdn"] + "wc-registry.json";
        }
        // apply filters
        this.applyFilters(haxcore.search);
        if (this.cardList) this.cardList.requestUpdate();
        if (this.cardList) {
          console.log("cardList", this.cardList.list, this.cardList.value);
          this.dispatchEvent(
            new CustomEvent("appstore-changed", {
              detail: {
                value: this.getAppstoreValues()
              }
            })
          );
        }
      }
    }, 50);
  }
  /**
   * Return the appstore values
   */
  getAppstoreValues() {
    // get form values
    let value = this.shadowRoot.querySelector("#form").submit();
    console.log("getAppstoreValues", value);
    value.haxcore = value.haxcore || {
      templates: {},
      providers: {}
    };
    let appstore = {
      providers: {
        cdn: value.haxcore.providers["haxcore-providers-cdn"],
        other: value.haxcore.providers["haxcore-providers-other"],
        pk: value.haxcore.providers["haxcore-providers-pk"]
      },
      apps: {},
      blox: value.haxcore.templates["haxcore-templates-templates"],
      stax: value.haxcore.templates["haxcore-templates-layouts"],
      autoloader: value.haxcore.search["haxcore-search-autoloader"]
    };
    // find the API keys
    for (var key in value.haxcore.integrations) {
      appstore.apps[key.replace("haxcore-integrations-", "")] =
        value.haxcore.integrations[key];
    }
    return appstore;
  }
  /**
   * Autoloader is a simple keypair
   */
  getAutoloader(data) {
    let autoload = {};
    for (var i in data) {
      if (data[i].status) {
        autoload[data[i].tag] = data[i].file;
      }
    }
    return autoload;
  }
}

window.customElements.define(
  HaxElementListSelector.tag,
  HaxElementListSelector
);
