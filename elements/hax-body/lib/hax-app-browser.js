import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import * as async from "@polymer/polymer/lib/utils/async.js";
import "@polymer/iron-list/iron-list.js";
import "@polymer/app-layout/app-toolbar/app-toolbar.js";
import "@polymer/paper-input/paper-input.js";
import "@polymer/paper-item/paper-item.js";
import "@polymer/iron-pages/iron-pages.js";
import "@lrnwebcomponents/grafitto-filter/grafitto-filter.js";
import "@lrnwebcomponents/dropdown-select/dropdown-select.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "./hax-app-browser-item.js";
import "./hax-app-search.js";
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
    <style is="custom-style" include="simple-colors">
      :host {
        display: block;
        --hax-accent: #34e79a;
      }
      #ironlist {
        min-height: 72px;
        margin: 0;
      }
      hax-app-browser-item {
        margin: 10px;
        -webkit-transition: 0.3s all linear;
        transition: 0.3s all linear;
      }
      .title {
        text-align: center;
        padding: 16px 0;
        margin: 0 64px 0 0;
        font-size: 32px;
        font-weight: bold;
        color: var(--simple-colors-default-theme-light-green-1);
        font-family: sans-serif;
        text-transform: uppercase;
        display: inline-flex;
      }
      dropdown-select {
        color: #ffffff;
        --paper-input-container-invalid-color: var(
          --simple-colors-red-foreground3
        );
        --paper-input-container-input-color: #ffffff;
        --paper-input-container-color: #ffffff;
        --paper-input-container-focus-color: var(
          --simple-colors-default-theme-light-green-1
        );
        --paper-listbox-color: #000000;
      }
      paper-item {
        --secondary-text-color: #000000;
        --primary-text-color: #000000;
      }
      paper-input {
        color: #ffffff;
        --paper-input-container-invalid-color: var(
          --simple-colors-red-foreground3
        );
        --secondary-text-color: #ffffff;
        --primary-text-color: #ffffff;
        --paper-input-container-input-color: #ffffff;
        --paper-input-container-color: #ffffff;
        --paper-input-container-focus-color: var(
          --simple-colors-default-theme-light-green-1
        );
      }
      app-toolbar {
        background-color: rgba(0, 0, 0, 0.5);
      }
      .toolbar-inner {
        width: 100%;
        display: inline-flex;
      }
    </style>
    <app-toolbar>
      <div class="toolbar-inner">
        <h3 class="title">[[title]]</h3>
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
    </app-toolbar>
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
      setTimeout(() => {
        window.HaxStore.instance.haxManager.updateStyles();
        window.dispatchEvent(new Event("resize"));
      }, 100);
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
