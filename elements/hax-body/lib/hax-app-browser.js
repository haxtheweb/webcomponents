import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/grafitto-filter/grafitto-filter.js";
import { winEventsElement } from "@lrnwebcomponents/utils/utils.js";

/**
 * `hax-app-browser`
 * @customElement hax-app-browser
 *
 * `Browse a list of apps. This provides a listing of our gizmos that we've integrated with.`
 * @microcopy - the mental model for this element
 * - hax-app - expression of how to communicate and visualize a data source
 * - gizmo - silly name for the general public when talking about hax-app and what it provides in the end
 */
class HaxAppBrowser extends winEventsElement(LitElement) {
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        :host *[hidden] {
          display: none;
        }
        hax-app-browser-item {
          margin: 8px;
          -webkit-transition: 0.3s all linear;
          transition: 0.3s all linear;
          display: inline-flex;
        }
        .title {
          position: relative;
          padding: 16px;
          outline: 0;
          font-weight: 600;
          text-align: left;
          margin: 0;
          background-color: var(--hax-color-menu-heading-bg);
          font-size: 18px;
          line-height: 18px;
          font-family: "Noto Serif", serif;
          color: var(--hax-color-menu-heading-color);
        }
        grafitto-filter {
          color: black;
        }
        .toolbar-inner {
          display: inline-flex;
          padding: 0 16px;
        }
      `
    ];
  }
  constructor() {
    super();
    this.__winEvents = {
      "hax-app-selected": "_appSelected",
      "hax-store-property-updated": "_haxStorePropertyUpdated"
    };
    this.title = "Search for media";
    this.searching = false;
    this.activeApp = null;
    this.appList = [];
    this.filtered = [];
    this.hasActive = false;
    import("@polymer/paper-input/paper-input.js");
    import("@polymer/paper-item/paper-item.js");
    import("@lrnwebcomponents/dropdown-select/dropdown-select.js");
    import("@lrnwebcomponents/hax-body/lib/hax-app-browser-item.js");
    import("@lrnwebcomponents/hax-body/lib/hax-app-search.js");
  }
  render() {
    return html`
      <h3 class="title"><iron-icon icon="search"></iron-icon> ${this.title}</h3>
      <div class="toolbar-inner">
        <dropdown-select
          id="filtertype"
          label="Filter by"
          value="details.title"
          @change="${this.filtertypeChange}"
        >
          <paper-item value="details.title">Title</paper-item>
        </dropdown-select>
        <paper-input
          label="Filter"
          id="inputfilter"
          @value-changed="${this.inputfilterChanged}"
          aria-controls="filter"
          value=""
          always-float-label=""
        ></paper-input>
      </div>
      <grafitto-filter
        id="filter"
        .items="${this.appList}"
        like=""
        @filtered-changed="${this.filteredChanged}"
        where="details.title"
        ><template></template
      ></grafitto-filter>
      ${this.filtered.map(
        app => html`
          <hax-app-browser-item
            index="${app.index}"
            title="${app.details.title}"
            icon="${app.details.icon}"
            image="${app.details.tag}"
            color="${app.details.color}"
            meta="${app.details.meta}"
            groups="${app.details.groups}"
            handles="${app.details.handles}"
            description="${app.details.description}"
            rating="${app.details.rating}"
            tags="${app.details.tags}"
          ></hax-app-browser-item>
        `
      )}
      <hax-app-search
        id="haxappsearch"
        .hidden="${!this.searching}"
      ></hax-app-search>
      <slot></slot>
    `;
  }
  static get tag() {
    return "hax-app-browser";
  }
  static get properties() {
    return {
      /**
       * Search term
       */
      search: {
        type: String
      },
      /**
       * Title of the browser, for translation.
       */
      title: {
        type: String
      },
      /**
       * Searching mode
       */
      searching: {
        type: Boolean,
        reflect: true
      },
      /**
       * Global activeApp object.
       */
      activeApp: {
        type: Object
      },
      /**
       * If we have an active, scale everything
       */
      hasActive: {
        reflect: true,
        type: Boolean,
        attribute: "has-active"
      },
      filtered: {
        type: Array
      },
      appList: {
        type: Array
      }
    };
  }
  filteredChanged(e) {
    this.filtered = [...e.detail.value];
  }
  inputfilterChanged(e) {
    this.shadowRoot.querySelector("#filter").like = e.target.value;
  }
  filtertypeChange(e) {
    this.shadowRoot.querySelector("#inputfilter").value = "";
    this.shadowRoot.querySelector("#filter").where = e.detail.value;
    this.shadowRoot.querySelector("#filter").like = "";
  }
  firstUpdated(changedProperties) {
    this.resetBrowser();
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "activeApp") {
        this._activeAppChanged(this[propName], oldValue);
      }
    });
  }
  /**
   * App has been selected.
   */
  _appSelected(e) {
    // item bubbled up
    if (typeof e.detail !== typeof undefined) {
      this.__activeApp = e.detail;
      this.searching = true;
      window.HaxStore.write("activeApp", this.appList[e.detail], this);
    }
  }

  /**
   * Active app updated, so scroll it into view
   */
  _activeAppChanged(newValue, oldValue) {
    if (typeof oldValue !== typeof undefined && newValue != null) {
      window.HaxStore.instance.haxManager.searching = true;
      this.hasActive = true;
    } else {
      this.hasActive = false;
    }
  }
  /**
   * Store updated, sync.
   */
  _haxStorePropertyUpdated(e) {
    if (
      e.detail &&
      typeof e.detail.value !== typeof undefined &&
      e.detail.property
    ) {
      this[e.detail.property] = e.detail.value;
    }
  }
  /**
   * Reset this browser.
   */
  resetBrowser() {
    this.searching = false;
    this.appList = [...window.HaxStore.instance.appList];
    this.filtered = this.appList;
    this.shadowRoot.querySelector("#inputfilter").value = "";
    this.shadowRoot.querySelector("#filtertype").value = "details.title";
    this.shadowRoot.querySelector("#filter").value = "";
    this.shadowRoot.querySelector("#filter").filter();
    this.shadowRoot.querySelector("#filter").where = "details.title";
    this.shadowRoot.querySelector("#filter").like = "";
  }
}
window.customElements.define(HaxAppBrowser.tag, HaxAppBrowser);
export { HaxAppBrowser };
