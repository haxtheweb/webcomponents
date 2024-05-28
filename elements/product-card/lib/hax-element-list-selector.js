/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import {
  HaxSchematizer,
  HaxElementizer,
} from "@haxtheweb/hax-body-behaviors/lib/HAXFields.js";
import "@haxtheweb/simple-fields/simple-fields.js";
import { SimpleFieldsForm } from "@haxtheweb/simple-fields/lib/simple-fields-form.js";
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
      `,
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
    this.HaxSchematizer = HaxSchematizer;
    this.HaxElementizer = HaxElementizer;
    // default fields json blob, most implementations should provide their own though obviously
    this.fieldsEndpoint = new URL("./fields.json", import.meta.url).href;
    // allow flobal base path focibly set
    if (globalThis.WCGlobalBasePath) {
      this.basePath = globalThis.WCGlobalBasePath;
    } else {
      this.basePath =
        new URL("./hax-element-list-selector.js", import.meta.url).href +
        "/../../../../";
    }
    // allow global definition of wc-registry for custom ones
    if (globalThis.WCGlobalRegistryFileName) {
      this.__regFile = globalThis.WCGlobalRegistryFileName;
    } else {
      this.__regFile = "wc-registry.json";
    }
    setTimeout(() => {
      globalThis.addEventListener(
        "a11y-tabs-active-changed",
        this._activeTabChanged.bind(this),
      );
    }, 0);
    this.addEventListener("response", this._response);
    this.addEventListener("value-changed", this._valueChanged);
  }
  static get properties() {
    return {
      ...SimpleFieldsForm.properties,
      HaxSchematizer: {
        type: Object,
      },
      HaxElementizer: {
        type: Object,
      },
      /**
       * Show card list so that it SEEMS like its happenign when we click HAX elements
       */
      showCardList: {
        type: Boolean,
      },
      /**
       * JS imports
       */
      imports: {
        type: Object,
      },
      /**
       * HAXSchema array
       */
      haxData: {
        type: Array,
      },
      /**
       * Valid tags on the CDN but that don't have haxSchema.
       */
      noSchema: {
        type: Object,
      },
      /**
       * Data filtered by form changes
       */
      filteredHaxData: {
        type: Array,
      },
      /**
       * Columns to render
       */
      cols: {
        type: Number,
      },
      /**
       * End point to load this data
       */
      fieldsEndpoint: {
        type: String,
        attribute: "fields-endpoint",
      },
      /**
       * End point to load up a list of imports
       */
      wcRegistryEndpoint: {
        type: String,
        attribute: "wc-registry-endpoint",
      },
      /**
       * Request method
       */
      method: {
        type: String,
      },
      loading: {
        type: Boolean,
        reflect: true,
      },
    };
  }
  render() {
    return html`
      <simple-fields-form
        id="form"
        autoload
        load-endpoint="${this.fieldsEndpoint}"
        method="${this.method}"
        .schematizer="${this.HaxSchematizer}"
        .elementizer="${this.HaxElementizer}"
        @response="${this._response}"
        @haxcore.search.haxcore-search-columns-value-changed="${(e) =>
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
      "haxcore.providerdetails.haxcore-providerdetails-othertags",
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
          .then((response) => {
            this.loading = true;
            return response.json();
          })
          .then((data) => {
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
            await import(`${this.basePath}${file}`).then((module) => {
              if (
                module &&
                Object.keys(module) &&
                Object.keys(module)[0] &&
                module[Object.keys(module)[0]] &&
                module[Object.keys(module)[0]].haxProperties &&
                module[Object.keys(module)[0]].haxProperties.gizmo &&
                module[Object.keys(module)[0]].haxProperties.gizmo.title
              ) {
                let detail = {
                  tag: tag,
                  file: file,
                  showDemo: false,
                  schema: module[Object.keys(module)[0]].haxProperties,
                };
                list.push(detail);
                this.haxData = [...list];
              } else {
                noSchema[tag] = file;
                //console.log(`${tag} doesn't have haxSchema`);
              }
            });
          } catch (e) {
            console.warn(e);
          }
        }
        this.noSchema = {};
        this.noSchema = noSchema;
        this.loading = false;
      }
      // this is the local data we don't let change
      if (propName == "haxData") {
        this.filteredHaxData = [...this.haxData];
        if (this.haxData.length > 0) {
          let renderHaxData = {};
          for (var i in this.haxData) {
            renderHaxData[this.haxData[i].tag] = this.haxData[i].file;
          }
          if (this.cardList) {
            let search =
              this.form &&
              this.form.value &&
              this.form.value.haxcore &&
              this.form.value.haxcore.search
                ? this.form.value.haxcore.search
                : undefined;
            this.cardList.list = this.filteredHaxData;
            if (search) this.applyFilters(search);
            this.cardList.requestUpdate();
          }
          if (this.haxTags)
            this.haxTags.editorValue = JSON.stringify(renderHaxData, null, 2);
        }
      }
      if (
        propName == "noSchema" &&
        Object.keys(this.noSchema).length > 0 &&
        this.otherTags
      )
        this.otherTags.editorValue = JSON.stringify(this.noSchema, null, 2);
    });
  }
  applyFilters(filters) {
    if (this.cardList) {
      let data = [...this.haxData];
      Object.keys(filters || {}).forEach((key) => {
        if (filters[key] != "") {
          switch (key) {
            case "haxcore-search-search":
              data = data.filter((item) => {
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
              data = data.filter((item) => {
                if (item.schema.gizmo.tags.includes(filters[key])) {
                  return true;
                }
                return false;
              });
              break;
            case "haxcore-search-hasdemo":
              // only filter if box checked otherwise show all
              if (filters[key]) {
                data = data.filter((item) => {
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
      this.cardList.filteredTags = [...data].map((item) => item.tag);
      this.cardList.requestUpdate();
    }
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
      if (haxcore) {
        let cols =
          haxcore.search && haxcore.search["haxcore-search-columns"]
            ? haxcore.search["haxcore-search-columns"]
            : undefined;
        //set columns
        if (cols) this.cols = cols;
        // look for CDN provider
        if (haxcore.providers["haxcore-providers-cdn"] == "other") {
          this.wcRegistryEndpoint =
            haxcore.providers["haxcore-providers-other"] + this.__regFile;
        } else {
          this.wcRegistryEndpoint =
            haxcore.providers["haxcore-providers-cdn"] + this.__regFile;
        }
        // apply filters
        this.applyFilters(haxcore.search);
        if (this.cardList) {
          this.dispatchEvent(
            new CustomEvent("appstore-changed", {
              detail: {
                value: this.getAppstoreValues(),
              },
            }),
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
    value.haxcore = value.haxcore || {
      templates: {},
      providers: {},
    };
    let appstore = {
      providers: {
        cdn: value.haxcore.providers["haxcore-providers-cdn"],
        other: value.haxcore.providers["haxcore-providers-other"],
        pk: value.haxcore.providers["haxcore-providers-pk"],
      },
      apps: {},
      stax: value.haxcore.templates["haxcore-templates-layouts"],
      autoloader: value.haxcore.search["haxcore-search-autoloader"],
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

customElements.define(HaxElementListSelector.tag, HaxElementListSelector);
