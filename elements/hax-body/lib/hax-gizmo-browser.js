import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import * as async from "@polymer/polymer/lib/utils/async.js";
import "@polymer/iron-list/iron-list.js";
import "@polymer/paper-input/paper-input.js";
import "@lrnwebcomponents/grafitto-filter/grafitto-filter.js";
import "@lrnwebcomponents/dropdown-select/dropdown-select.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "./hax-gizmo-browser-item.js";
import "./hax-shared-styles.js";
/**
`hax-gizmo-browser`
Browse a list of gizmos. This provides a listing of custom elements for people to search and select based on what have been defined as gizmos for users to select.

* @demo demo/index.html

@microcopy - the mental model for this element
 - gizmo - silly name for the general public when talking about custom elements and what it provides in the end.
*/
Polymer({
  _template: html`
    <style is="custom-style" include="simple-colors hax-shared-styles">
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
                tag="[[gizmo.tag]]"
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
  `,

  is: "hax-gizmo-browser",

  properties: {
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
  },

  /**
   * Attached
   */
  attached: function() {
    this.resetBrowser();
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
  },

  /**
   * Detached life cycle
   */
  detached: function() {
    document.body.removeEventListener(
      "hax-store-property-updated",
      this._haxStorePropertyUpdated.bind(this)
    );
  },

  /**
   * Store updated, sync.
   */
  _haxStorePropertyUpdated: function(e) {
    if (
      e.detail &&
      typeof e.detail.value !== typeof undefined &&
      e.detail.property
    ) {
      this.set(e.detail.property, e.detail.value);
    }
  },

  /**
   * Reset this browser.
   */
  resetBrowser: function() {
    if (typeof this.$.filter !== typeof undefined) {
      async.microTask.run(() => {
        this.set("__gizmoList", window.HaxStore.instance.gizmoList);
        if (this.$.filter.shadowRoot.querySelector("#ironlist")) {
          this.$.filter.shadowRoot.querySelector(
            "#ironlist"
          ).filtered = this.__gizmoList;
        }
        this.$.inputfilter.value = "";
        this.$.filtertype.value = "title";
        this.$.filter.value = "";
        this.$.filter.filter();
        this.$.filter.where = "title";
        this.$.filter.like = "";
        setTimeout(() => {
          if (this.$.filter.shadowRoot.querySelector("#ironlist")) {
            this.$.filter.shadowRoot
              .querySelector("#ironlist")
              .fire("iron-resize");
            window.dispatchEvent(new Event("resize"));
          }
        }, 100);
      });
    }
  }
});
