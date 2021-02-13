import { LitElement, html, css } from "lit-element/lit-element.js";
import "./hax-tray-button.js";
import { HAXStore } from "./hax-store.js";
import { autorun, toJS } from "mobx";

/**
 * `hax-app-browser`
 * @element hax-app-browser
 *
 * `Browse a list of apps. This provides a listing of our gizmos that we've integrated with.`
 * @microcopy - the mental model for this element
 * - hax-app - expression of how to communicate and visualize a data source
 * - gizmo - silly name for the general public when talking about hax-app and what it provides in the end
 */
class HaxAppBrowser extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          overflow-y: auto;
          position: relative;
        }
        simple-button-grid {
          overflow: auto;
        }
        simple-button-grid.collapse-hide {
          max-height: 0 !important;
          transition: all 0.5s;
        }
        .visibility-hidden {
          z-index: -1;
          visibility: hidden;
          opacity: 0;
          height: 0;
          transition: all 0.5s;
        }
        hax-tray-button {
          font-size: 11px !important;
          --simple-toolbar-button-bg: var(--hax-toolbar-button-bg, #fff);
          --simple-toolbar-button-border-color: var(
            --hax-toolbar-border-color,
            #ddd
          );
          --simple-toolbar-button-hover-color: var(
            --tray-detail-accent-color,
            #000
          );
          --simple-toolbar-button-hover-border-color: var(
            --tray-detail-accent-color,
            #000
          );
          --simple-toolbar-button-hover-border-color: var(
            --tray-detail-accent-color,
            #000
          );
        }
      `,
    ];
  }
  constructor() {
    super();
    this.addEventListener("hax-tray-button-click", (e) => {
      if (e.detail.eventName === "search-selected") {
        this.searching = true;
        HAXStore.activeApp = toJS(this.appList[e.detail.index]);
      } else if (e.detail.eventName === "cancel-search") {
        this.searching = false;
      }
    });
    this.searching = false;
    this.appList = [];
    this.activeApp = null;
    this.hasActive = false;
    import("@lrnwebcomponents/hax-body/lib/hax-app-search.js");
    import("@lrnwebcomponents/simple-toolbar/lib/simple-button-grid.js");
    autorun(() => {
      this.appList = toJS(HAXStore.appList);
    });
    autorun(() => {
      this.activeApp = toJS(HAXStore.activeApp);
    });
  }
  render() {
    return html`
      <simple-button-grid
        class="${this.searching ? "collapse-hide" : ""}"
        always-expanded
        columns="3"
      >
        ${this.appList.map(
          (app) => html`
            <hax-tray-button
              class="${this.searching ? "visibility-hidden" : ""}"
              show-text-label
              icon-position="top"
              index="${app.index}"
              label="${app.details.title}"
              icon="${app.details.icon}"
              color="${app.details.color}"
              event-name="search-selected"
              event-data="${app.index}"
            >
            </hax-tray-button>
          `
        )}
      </simple-button-grid>
      <hax-app-search
        id="haxappsearch"
        class="${!this.searching ? "visibility-hidden" : ""}"
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
        type: String,
      },
      /**
       * Searching mode
       */
      searching: {
        type: Boolean,
        reflect: true,
      },
      /**
       * Global activeApp object.
       */
      activeApp: {
        type: Object,
      },
      /**
       * If we have an active, scale everything
       */
      hasActive: {
        reflect: true,
        type: Boolean,
        attribute: "has-active",
      },
      appList: {
        type: Array,
      },
    };
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "activeApp" && this[propName]) {
        this._activeAppChanged(this[propName], oldValue);
      }
      if (propName == "appList" && this[propName] && this.shadowRoot) {
        this.searching = false;
      }
    });
  }

  /**
   * Active app updated, so scroll it into view
   */
  _activeAppChanged(newValue, oldValue) {
    console.log(newValue, oldValue);
    if (typeof oldValue !== typeof undefined && newValue != null) {
      this.hasActive = true;
    } else {
      this.hasActive = false;
    }
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    // app list registers early and has no imports so on
    // fast environments it's alreayd loaded
    this.searching = false;
  }
}
window.customElements.define(HaxAppBrowser.tag, HaxAppBrowser);
export { HaxAppBrowser };
