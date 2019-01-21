import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import * as async from "@polymer/polymer/lib/utils/async.js";
import "@polymer/iron-list/iron-list.js";
import "@polymer/paper-input/paper-input.js";
import "@polymer/paper-item/paper-item.js";
import "@polymer/iron-pages/iron-pages.js";
import "@lrnwebcomponents/grafitto-filter/grafitto-filter.js";
import "@lrnwebcomponents/dropdown-select/dropdown-select.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "./hax-app-browser-item.js";
import "./hax-app-search.js";
import "./hax-shared-styles.js";
/**
`hax-app-browser`
Browse a list of apps. This provides a listing of our gizmos that we've integrated with.

* @demo demo/index.html

@microcopy - the mental model for this element
 - hax-app - expression of how to communicate and visualize a data source
 - gizmo - silly name for the general public when talking about hax-app and what it provides in the end
*/
Polymer({
  _template: html`
    <style is="custom-style" include="simple-colors hax-shared-styles">
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
      <dropdown-select id="filtertype" label="Filter by" value="details.title">
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
    <hax-app-search id="haxappsearch" hidden$="[[!searching]]"></hax-app-search>
    <slot></slot>
  `,

  is: "hax-app-browser",

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
  },

  /**
   * Attached
   */
  attached: function() {
    this.resetBrowser();
    this.$.inputfilter.addEventListener("value-changed", e => {
      this.$.filter.like = e.target.value;
    });
    this.$.filtertype.addEventListener("change", e => {
      this.$.inputfilter.value = "";
      this.$.filter.where = e.detail.value;
      this.$.filter.like = "";
    });
    document.body.addEventListener(
      "hax-app-selected",
      this._appSelected.bind(this)
    );
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
      "hax-app-selected",
      this._appSelected.bind(this)
    );
    document.body.removeEventListener(
      "hax-store-property-updated",
      this._haxStorePropertyUpdated.bind(this)
    );
  },

  /**
   * App has been selected.
   */
  _appSelected: function(e) {
    // item bubbled up
    if (typeof e.detail !== typeof undefined) {
      this.set("__activeApp", e.detail);
      this.searching = true;
      window.HaxStore.write("activeApp", this.__appList[e.detail], this);
    }
  },

  /**
   * Active app updated, so scroll it into view
   */
  _activeAppChanged: function(newValue, oldValue) {
    if (typeof oldValue !== typeof undefined && newValue != null) {
      window.HaxStore.instance.haxManager.searching = true;
      this.hasActive = true;
    } else {
      this.hasActive = false;
    }
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
    async.microTask.run(() => {
      this.searching = false;
      this.set("__appList", window.HaxStore.instance.appList);
      if (this.$.filter.shadowRoot.querySelector("#ironlist")) {
        this.$.filter.shadowRoot.querySelector(
          "#ironlist"
        ).filtered = this.__appList;
      }
      this.$.inputfilter.value = "";
      this.$.filtertype.value = "details.title";
      this.$.filter.value = "";
      this.$.filter.filter();
      this.$.filter.where = "details.title";
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
});
