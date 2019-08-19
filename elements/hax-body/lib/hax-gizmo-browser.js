import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import { microTask } from "@polymer/polymer/lib/utils/async.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/grafitto-filter/grafitto-filter.js";
import "@polymer/iron-list/iron-list.js";
import "./hax-shared-styles.js";
/**
 * `hax-gizmo-browser`
 * `Browse a list of gizmos. This provides a listing of custom elements for people to search and select based on what have been defined as gizmos for users to select.`
 * @microcopy - the mental model for this element
 * - gizmo - silly name for the general public when talking about custom elements and what it provides in the end.
 */
class HaxGizmoBrowser extends PolymerElement {
  constructor() {
    super();
    import("@polymer/paper-input/paper-input.js");
    import("@lrnwebcomponents/dropdown-select/dropdown-select.js");
    import("@lrnwebcomponents/hax-body/lib/hax-gizmo-browser-item.js");
  }
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        hax-gizmo-browser-item {
          margin: 10px;
          -webkit-transition: 0.3s all linear;
          transition: 0.3s all linear;
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
          background-color: var(--hax-color-menu-heading-bg);
          font-size: 18px;
          line-height: 18px;
          font-family: "Noto Serif", serif;
          color: var(--hax-color-text);
        }
        .toolbar-inner {
          display: inline-flex;
          padding: 10px;
        }
      </style>
      <h3 class="title">[[title]]</h3>
      <div class="toolbar-inner">
        <dropdown-select id="filtertype" label="Filter by" value="title">
          <paper-item value="title">Title</paper-item>
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
        items="[[__gizmoList]]"
        like=""
        where="title"
        as="filtered"
      >
        <template>
          <iron-list id="ironlist" items="[[filtered]]" as="gizmo" grid>
            <template>
              <div class="gizmo-container">
                <hax-gizmo-browser-item
                  index="[[gizmo.index]]"
                  title="[[gizmo.title]]"
                  tag-to-insert="[[gizmo.tag]]"
                  icon="[[gizmo.icon]]"
                  image="[[gizmo.image]]"
                  color="[[gizmo.color]]"
                  author="[[gizmo.author]]"
                  teaser="[[gizmo.teaser]]"
                  description="[[gizmo.description]]"
                  examples="[[gizmo.examples]]"
                  status="[[gizmo.status]]"
                ></hax-gizmo-browser-item>
              </div>
            </template>
          </iron-list>
        </template>
      </grafitto-filter>
    `;
  }
  static get tag() {
    return "hax-gizmo-browser";
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
        value: "Make"
      }
    };
  }
  /**
   * life cycle
   */
  ready() {
    super.ready();
    this.resetBrowser();
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
        "hax-store-property-updated",
        this._haxStorePropertyUpdated.bind(this)
      );
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
      this.set(e.detail.property, e.detail.value);
    }
  }

  /**
   * Reset this browser.
   */
  resetBrowser() {
    if (typeof this.shadowRoot.querySelector("#filter") !== typeof undefined) {
      microTask.run(() => {
        this.set("__gizmoList", window.HaxStore.instance.gizmoList);
        if (
          this.shadowRoot
            .querySelector("#filter")
            .shadowRoot.querySelector("#ironlist")
        ) {
          this.shadowRoot
            .querySelector("#filter")
            .shadowRoot.querySelector("#ironlist").filtered = this.__gizmoList;
        }
        this.shadowRoot.querySelector("#inputfilter").value = "";
        this.shadowRoot.querySelector("#filtertype").value = "title";
        this.shadowRoot.querySelector("#filter").value = "";
        this.shadowRoot.querySelector("#filter").filter();
        this.shadowRoot.querySelector("#filter").where = "title";
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
}
window.customElements.define(HaxGizmoBrowser.tag, HaxGizmoBrowser);
export { HaxGizmoBrowser };
