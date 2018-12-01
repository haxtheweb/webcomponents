import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import * as async from "../node_modules/@polymer/polymer/lib/utils/async.js";
import "../node_modules/@polymer/iron-list/iron-list.js";
import "../node_modules/@polymer/app-layout/app-toolbar/app-toolbar.js";
import "../node_modules/@polymer/paper-input/paper-input.js";
import "../node_modules/@polymer/paper-item/paper-item.js";
import "../node_modules/@polymer/iron-pages/iron-pages.js";
import "../node_modules/@lrnwebcomponents/grafitto-filter/grafitto-filter.js";
import "../node_modules/@lrnwebcomponents/dropdown-select/dropdown-select.js";
import "../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";
import "./hax-app-browser-item.js";
import "./hax-app-search.js";
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
    search: { type: String },
    title: { type: String, value: "Find" },
    searching: { type: Boolean, reflectToAttribute: !0, value: !1 },
    activeApp: { type: Object, value: null, observer: "_activeAppChanged" }
  },
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
  _appSelected: function(e) {
    if (typeof e.detail !== typeof void 0) {
      this.set("__activeApp", e.detail);
      this.searching = !0;
      window.HaxStore.write("activeApp", this.__appList[e.detail], this);
    }
  },
  _activeAppChanged: function(newValue, oldValue) {
    if (typeof oldValue !== typeof void 0 && null != newValue) {
      window.HaxStore.instance.haxManager.searching = !0;
      setTimeout(() => {
        window.HaxStore.instance.haxManager.updateStyles();
        window.dispatchEvent(new Event("resize"));
      }, 100);
    }
  },
  _haxStorePropertyUpdated: function(e) {
    if (
      e.detail &&
      typeof e.detail.value !== typeof void 0 &&
      e.detail.property
    ) {
      this.set(e.detail.property, e.detail.value);
    }
  },
  resetBrowser: function() {
    async.microTask.run(() => {
      this.searching = !1;
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
