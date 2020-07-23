import { LitElement, html, css } from "lit-element/lit-element.js";
import { winEventsElement } from "@lrnwebcomponents/utils/utils.js";
import "./hax-tray-button.js";

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
    this.hasActive = false;
    import("@lrnwebcomponents/hax-body/lib/hax-app-search.js");
  }
  render() {
    return html`
      <div class="item-wrapper">
        ${this.appList.map(
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
      appList: {
        type: Array
      }
    };
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
    if (this.shadowRoot && e.detail && e.detail.value && e.detail.property === "appList") {
      this.resetBrowser();
    }
    else if (e.detail && e.detail.value && e.detail.property === "activeApp") {
      this.activeApp = e.detail.value;
    }
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    // app list registers early and has no imports so on
    // fast environments it's alreayd loaded
    this.resetBrowser();
  }
  /**
   * Reset this browser.
   */
  resetBrowser() {
    this.searching = false;
    this.appList = [...window.HaxStore.instance.appList];
  }
}
window.customElements.define(HaxAppBrowser.tag, HaxAppBrowser);
export { HaxAppBrowser };
