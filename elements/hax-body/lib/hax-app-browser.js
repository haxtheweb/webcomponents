import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import { microTask } from "@polymer/polymer/lib/utils/async.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/grafitto-filter/grafitto-filter.js";
import "@polymer/iron-list/iron-list.js";
import "@polymer/iron-pages/iron-pages.js";
import "./hax-shared-styles.js";
/**
 * `hax-app-browser`
 * `Browse a list of apps. This provides a listing of our gizmos that we've integrated with.`
 * @microcopy - the mental model for this element
 * - hax-app - expression of how to communicate and visualize a data source
 * - gizmo - silly name for the general public when talking about hax-app and what it provides in the end
 */
class HaxAppBrowser extends PolymerElement {
  constructor() {
    super();
    import("@polymer/paper-input/paper-input.js");
    import("@polymer/paper-item/paper-item.js");
    import("@lrnwebcomponents/dropdown-select/dropdown-select.js");
    import("@lrnwebcomponents/hax-body/lib/hax-app-browser-item.js");
    import("@lrnwebcomponents/hax-body/lib/hax-app-search.js");
  }
  static get template() {
    return html`
      <style include="hax-shared-styles">
        :host {
          display: block;
        }
        :host *[hidden] {
          display: none;
        }
        #ironlist {
          min-height: 132px;
          margin: 0;
          padding: 10px;
        }
        hax-app-browser-item {
          margin: 10px;
          -webkit-transition: 0.3s all linear;
          transition: 0.3s all linear;
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
          color: var(--hax-color-text);
        }
        grafitto-filter {
          color: var(--hax-color-text);
        }
        .toolbar-inner {
          display: inline-flex;
          padding: 0 16px;
        }
      </style>
      <h3 class="title">[[title]]</h3>
      <div class="toolbar-inner">
        <dropdown-select
          id="filtertype"
          label="Filter by"
          value="details.title"
        >
          <paper-item value="details.title">Title</paper-item>
        </dropdown-select>
        <paper-input
          label="Filter"
          id="inputfilter"
          aria-controls="filter"
          value=""
          always-float-label=""
        ></paper-input>
      </div>
      <grafitto-filter
        id="filter"
        items="[[__appList]]"
        like=""
        where="details.title"
        as="filtered"
      >
        <template>
          <iron-list id="ironlist" items="[[filtered]]" as="app" grid="">
            <template>
              <div class="app-container">
                <hax-app-browser-item
                  index="[[app.index]]"
                  title="[[app.details.title]]"
                  icon="[[app.details.icon]]"
                  image="[[app.details.tag]]"
                  color="[[app.details.color]]"
                  meta="[[app.details.meta]]"
                  groups="[[app.details.groups]]"
                  handles="[[app.details.handles]]"
                  description="[[app.details.description]]"
                  rating="[[app.details.rating]]"
                  tags="[[app.details.tags]]"
                ></hax-app-browser-item>
              </div>
            </template>
          </iron-list>
        </template>
      </grafitto-filter>
      <hax-app-search
        id="haxappsearch"
        hidden$="[[!searching]]"
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
        type: String,
        value: "Find"
      },
      /**
       * Searching mode
       */
      searching: {
        type: Boolean,
        reflectToAttribute: true,
        value: false
      },
      /**
       * Global activeApp object.
       */
      activeApp: {
        type: Object,
        value: null,
        observer: "_activeAppChanged"
      },
      /**
       * If we have an active, scale everything
       */
      hasActive: {
        reflectToAttribute: true,
        value: false,
        type: Boolean
      }
    };
  }
  /**
   * life cycle
   */
  connectedCallback() {
    super.connectedCallback();
    this.resetBrowser();
  }
  ready() {
    super.ready();
    afterNextRender(this, function() {
      this.shadowRoot
        .querySelector("#inputfilter")
        .addEventListener("value-changed", e => {
          this.shadowRoot.querySelector("#filter").like = e.target.value;
        });
      this.shadowRoot
        .querySelector("#filtertype")
        .addEventListener("change", e => {
          this.shadowRoot.querySelector("#inputfilter").value = "";
          this.shadowRoot.querySelector("#filter").where = e.detail.value;
          this.shadowRoot.querySelector("#filter").like = "";
        });
      document.body.addEventListener(
        "hax-app-selected",
        this._appSelected.bind(this)
      );
      document.body.addEventListener(
        "hax-store-property-updated",
        this._haxStorePropertyUpdated.bind(this)
      );
    });
  }

  /**
   * App has been selected.
   */
  _appSelected(e) {
    // item bubbled up
    if (typeof e.detail !== typeof undefined) {
      this.set("__activeApp", e.detail);
      this.searching = true;
      window.HaxStore.write("activeApp", this.__appList[e.detail], this);
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
      this.set(e.detail.property, e.detail.value);
    }
  }
  /**
   * Reset this browser.
   */
  resetBrowser() {
    microTask.run(() => {
      this.searching = false;
      this.set("__appList", window.HaxStore.instance.appList);
      if (
        this.shadowRoot
          .querySelector("#filter")
          .shadowRoot.querySelector("#ironlist")
      ) {
        this.shadowRoot
          .querySelector("#filter")
          .shadowRoot.querySelector("#ironlist").filtered = this.__appList;
      }
      this.shadowRoot.querySelector("#inputfilter").value = "";
      this.shadowRoot.querySelector("#filtertype").value = "details.title";
      this.shadowRoot.querySelector("#filter").value = "";
      this.shadowRoot.querySelector("#filter").filter();
      this.shadowRoot.querySelector("#filter").where = "details.title";
      this.shadowRoot.querySelector("#filter").like = "";
      setTimeout(() => {
        if (
          this.shadowRoot
            .querySelector("#filter")
            .shadowRoot.querySelector("#ironlist")
        ) {
          this.shadowRoot
            .querySelector("#filter")
            .shadowRoot.querySelector("#ironlist")
            .dispatchEvent(
              new CustomEvent("iron-resize", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: true
              })
            );
          window.dispatchEvent(new Event("resize"));
        }
      }, 100);
    });
  }
}
window.customElements.define(HaxAppBrowser.tag, HaxAppBrowser);
export { HaxAppBrowser };
