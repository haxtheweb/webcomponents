import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/hexagon-loader/hexagon-loader.js";
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
import "@lrnwebcomponents/simple-fields/lib/simple-fields-form.js";
import "./hax-element-card-list.js";

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
    // default fields json blob, most implementations should provide their own though obviously
    this.fieldsEndpoint =
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
  }
  static get properties() {
    return {
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
        load-endpoint="${this.fieldsEndpoint}"
        method="${this.method}"
        @response="${this._response}"
        @value-changed="${this._valueChanged}"
      >
      </simple-fields-form>
      ${this.showCardList
        ? html`
            <hexagon-loader
              item-count="4"
              color="blue"
              ?loading="${this.loading}"
              size="large"
            ></hexagon-loader>
            <h2 ?hidden="${!this.loading}">Loading HAX elements..</h2>
            <hax-element-card-list
              id="productlist"
              @enabled-changed="${this._enabledChanged}"
              cols="${this.cols}"
              .list="${this.filteredHaxData}"
            ></hax-element-card-list>
          `
        : ``}
    `;
  }
  _enabledChanged(e) {
    this.haxData.forEach((el, i) => {
      if (el.tag == e.detail.tag) {
        this.haxData[i].status = e.detail.status;
      }
    });
    this.dispatchEvent(
      new CustomEvent("appstore-changed", {
        detail: {
          value: this.getAppstoreValues()
        }
      })
    );
  }
  _activeTabChanged(e) {
    if (e.detail.activeTab == "haxcore.search") {
      this.showCardList = true;
    } else {
      this.showCardList = false;
    }
  }
  updated(changedProperties) {
    changedProperties.forEach(async (oldValue, propName) => {
      if (propName == "wcRegistryEndpoint") {
        this.haxData = [];
        this.imports = [];
        fetch(this[propName])
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
        let list = this.haxData;
        let noSchema = this.noSchema;
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
                  status: true,
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
        this.filteredHaxData = [...this.haxData];
        if (this.haxData.length > 0) {
          let renderHaxData = {};
          for (var i in this.haxData) {
            renderHaxData[this.haxData[i].tag] = this.haxData[i].file;
          }
          this.shadowRoot
            .querySelector("#form")
            .shadowRoot.querySelector("#sf")
            .querySelector(
              '[name="haxcore.providerdetails.haxcore-providerdetails-haxtags"]'
            ).editorValue = JSON.stringify(renderHaxData, null, 2);
        }
      }
      if (propName == "noSchema") {
        if (Object.keys(this.noSchema).length > 0) {
          this.shadowRoot
            .querySelector("#form")
            .shadowRoot.querySelector("#sf")
            .querySelector(
              '[name="haxcore.providerdetails.haxcore-providerdetails-othertags"]'
            ).editorValue = JSON.stringify(this.noSchema, null, 2);
        }
      }
    });
  }
  applyFilters(filters) {
    let data = [...this.haxData];
    Object.keys(filters).forEach(key => {
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
    return data;
  }
  /**
   * Listen for response and then apply initial settings
   */
  _response(e) {
    // tee up defaults
    let value = this.shadowRoot.querySelector("#form").submit();
    value.haxcore.search["haxcore-search-columns"] = this.cols;
    this.shadowRoot.querySelector("#form").setValue(value);
  }
  /**
   * notice any value changing and then getting the form fresh
   */
  _valueChanged(e) {
    clearTimeout(this.__valueDebounce);
    this.__valueDebounce = setTimeout(() => {
      let value = this.shadowRoot.querySelector("#form").submit();
      if (value && value.haxcore) {
        // look for CDN provider
        if (value.haxcore.providers["haxcore-providers-cdn"] == "other") {
          this.wcRegistryEndpoint =
            value.haxcore.providers["haxcore-providers-other"] +
            "wc-registry.json";
        } else {
          this.wcRegistryEndpoint =
            value.haxcore.providers["haxcore-providers-cdn"] +
            "wc-registry.json";
        }
        // set columns
        this.cols = parseInt(value.haxcore.search["haxcore-search-columns"]);
        // apply filters
        this.filteredHaxData = [...this.applyFilters(value.haxcore.search)];
        if (this.shadowRoot.querySelector("#productlist")) {
          this.shadowRoot.querySelector("#productlist").requestUpdate();
        }
      }
      this.dispatchEvent(
        new CustomEvent("appstore-changed", {
          detail: {
            value: this.getAppstoreValues()
          }
        })
      );
    }, 50);
  }
  /**
   * Return the appstore values
   */
  getAppstoreValues() {
    // get form values
    let value = this.shadowRoot.querySelector("#form").submit();
    let appstore = {
      provider: {
        cdn: value.haxcore.providers["haxcore-providers-cdn"],
        other: value.haxcore.providers["haxcore-providers-other"],
        pk: value.haxcore.providers["haxcore-providers-pk"]
      },
      apps: {},
      blox: value.haxcore.templates["haxcore-templates-templates"],
      stax: value.haxcore.templates["haxcore-templates-layouts"],
      autoloader: {}
    };
    // find the API keys
    for (var key in value.haxcore.integrations) {
      appstore.apps[key.replace("haxcore-integrations-", "")] =
        value.haxcore.integrations[key];
    }
    // calculate based on what's currently enabled
    appstore.autoloader = this.getAutoloader(this.haxData);
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
