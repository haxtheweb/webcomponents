import { LitElement, html, css } from "lit";
import { HAXStore } from "./hax-store.js";
import { autorun, toJS } from "mobx";
import "@lrnwebcomponents/simple-toolbar/lib/simple-button-grid.js";
import "@lrnwebcomponents/a11y-collapse/a11y-collapse.js";
import "./hax-app-search.js";
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
class HaxAppBrowser extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          position: relative;
        }
        simple-button-grid::part(buttons) {
          overflow: auto;
        }
        simple-button-grid.collapse-hide {
          max-height: 0 !important;
          transition: all 0.5s;
        }
        hax-tray-button {
          font-size: 11px;
          --hax-ui-font-size-sm: 11px;
        }
        .visibility-hidden {
          z-index: -1;
          visibility: hidden;
          opacity: 0;
          height: 0;
          transition: all 0.5s;
        }
        a11y-collapse {
          margin: 0;
          --a11y-collapse-margin: 0;
        }
        a11y-collapse::part(heading) {
          margin: 4px;
        }
      `,
    ];
  }
  
  constructor() {
    super();
    this.searching = false;
    this.categories = [];
    this.appList = [];
    this.activeApp = null;
    this.hasActive = false;
    autorun(() => {
      if (HAXStore.editMode) {
        this.appList = toJS(HAXStore.appList);        
      }
    });
    autorun(() => {
      if (HAXStore.editMode) {
        this.activeApp = toJS(HAXStore.activeApp);
      }
    });
    this.addEventListener("hax-tray-button-click", (e) => {
      if (e.detail.eventName === "search-selected") {
        this.searching = true;
        HAXStore.activeApp = toJS(this.appList[e.detail.index]);
      } else if (e.detail.eventName === "cancel-search") {
        this.searching = false;
      }
    });
  }
  ucfirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  render() {
    return html`${this.categories.map(
        (tag) => html`
          <a11y-collapse heading="${this.ucfirst(tag)}" heading-button>
            <simple-button-grid
              class="${this.searching ? "collapse-hide" : ""}"
              always-expanded
              columns="2"
            >
              ${this.appList.map(
                (app) =>
                  html` ${app.details.tags.includes(tag)
                    ? html` <hax-tray-button
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
                      </hax-tray-button>`
                    : ``}`
              )}
            </simple-button-grid>
          </a11y-collapse>
        `
      )}
      <hax-app-search
        id="haxappsearch"
        class="${!this.searching ? "visibility-hidden" : ""}"
      ></hax-app-search>
      <slot></slot> `;
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
      categories: {
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
        this.categories = [...this.updateCategories(this.appList)];
      }
    });
  }

  updateCategories(list) {
    let tags = [];
    list.forEach((app) => {
      if (app.details.tags) {
        app.details.tags.forEach((tag) => {
          if (!tags.includes(tag)) {
            tags.push(tag);
          }
        });
      }
    });
    tags.sort();
    return tags;
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
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    // app list registers early and has no imports so on
    // fast environments it's alreayd loaded
    this.searching = false;
  }
}
customElements.define(HaxAppBrowser.tag, HaxAppBrowser);
export { HaxAppBrowser };
