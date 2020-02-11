import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/grafitto-filter/grafitto-filter.js";
import { winEventsElement } from "@lrnwebcomponents/utils/utils.js";

/**
 * `hax-gizmo-browser`
 * @customElement hax-gizmo-browser
 * `Browse a list of gizmos. This provides a listing of custom elements for people to search and select based on what have been defined as gizmos for users to select.`
 * @microcopy - the mental model for this element
 * - gizmo - silly name for the general public when talking about custom elements and what it provides in the end.
 */
class HaxGizmoBrowser extends winEventsElement(LitElement) {
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        hax-gizmo-browser-item {
          margin: 5px;
          transition: 0.2s all linear;
          display: inline-flex;
        }
        #ironlist {
          min-height: 50vh;
          margin: 0;
          padding: 16px;
        }
        .title {
          position: relative;
          padding: 16px;
          outline: 0;
          font-weight: 600;
          text-align: left;
          margin: 0;
          font-size: 18px;
          line-height: 18px;
          font-family: "Noto Serif", serif;
          background-color: var(--hax-color-menu-heading-bg, #eeeeee);
          color: var(--hax-color-menu-heading-color, black);
        }
        .toolbar-inner {
          display: inline-flex;
          padding: 10px 0;
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
      "hax-store-property-updated": "_haxStorePropertyUpdated"
    };
    this.__gizmoList = [];
    this.filtered = [];
    import("@polymer/paper-input/paper-input.js");
    import("@lrnwebcomponents/hax-body/lib/hax-gizmo-browser-item.js");
  }
  render() {
    return html`
      <div class="toolbar-inner">
        <paper-input
          label="Filter"
          id="inputfilter"
          aria-controls="filter"
          @value-changed="${this.inputfilterChanged}"
          value=""
        ></paper-input>
      </div>
      <grafitto-filter
        id="filter"
        .items="${this.__gizmoList}"
        like=""
        where="title"
        like=""
        @filtered-changed="${this.filteredChanged}"
        ><template></template
      ></grafitto-filter>
      <div class="item-wrapper">
        ${this.filtered.map(
          gizmo => html`
            <hax-tray-button
              index="${gizmo.index}"
              label="${gizmo.title}"
              event-name="insert-tag"
              event-data="${gizmo.tag}"
              icon="${gizmo.icon}"
              color="${gizmo.color}"
            ></hax-tray-button>
          `
        )}
      </div>
    `;
  }
  static get tag() {
    return "hax-gizmo-browser";
  }
  static get properties() {
    return {
      /**
       * Title of the browser, for translation.
       */
      title: {
        type: String
      },
      filtered: {
        type: Array
      },
      __gizmoList: {
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
    this.__gizmoList = window.HaxStore.instance.gizmoList;
    this.filtered = this.__gizmoList;
    this.shadowRoot.querySelector("#inputfilter").value = "";
    this.shadowRoot.querySelector("#filter").value = "";
    this.shadowRoot.querySelector("#filter").filter();
    this.shadowRoot.querySelector("#filter").where = "title";
    this.shadowRoot.querySelector("#filter").like = "";
  }
}
window.customElements.define(HaxGizmoBrowser.tag, HaxGizmoBrowser);
export { HaxGizmoBrowser };
