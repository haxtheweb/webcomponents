import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/grafitto-filter/grafitto-filter.js";
import { winEventsElement } from "@lrnwebcomponents/utils/utils.js";
import "./hax-tray-button";
import "@lrnwebcomponents/simple-fields/lib/simple-fields-field.js";

/**
 * `hax-app-browser`
 * @element hax-app-browser
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
        grafitto-filter {
          color: black;
        }
        .toolbar-inner {
          display: block;
          padding: 0;
          width: 100%;
        }
        .item-wrapper {
          text-align: center;
        }
      `
    ];
  }
  constructor() {
    super();
    this.__winEvents = {
      "hax-store-property-updated": "_haxStorePropertyUpdated",
      "hax-search-source-updated": "_searchSelected"
    };
    this.searching = false;
    this.activeApp = null;
    this.appList = [];
    this.filtered = [];
    this.hasActive = false;
    import("@lrnwebcomponents/hax-body/lib/hax-app-search.js");
  }
  render() {
    return html`
      <div class="toolbar-inner">
        <simple-fields-field
          id="inputfilter"
          @value-changed="${this.inputfilterChanged}"
          aria-controls="filter"
          label="Filter"
          type="text"
          auto-validate=""
        ></simple-fields-field>
      </div>
      <grafitto-filter
        id="filter"
        .items="${this.appList}"
        like=""
        @filtered-changed="${this.filteredChanged}"
        where="details.title"
        ><template></template
      ></grafitto-filter>
      <div class="item-wrapper">
        ${this.filtered.map(
          app => html`
            <hax-tray-button
              index="${app.index}"
              label="${app.details.title}"
              icon="${app.details.icon}"
              color="${app.details.color}"
              event-name="search-selected"
              event-data="${app.index}"
            ></hax-tray-button>
          `
        )}
      </div>
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
  _searchSelected(e) {
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
    this.shadowRoot.querySelector("#filter").value = "";
    this.shadowRoot.querySelector("#filter").filter();
    this.shadowRoot.querySelector("#filter").where = "details.title";
    this.shadowRoot.querySelector("#filter").like = "";
  }
}
window.customElements.define(HaxAppBrowser.tag, HaxAppBrowser);
export { HaxAppBrowser };
