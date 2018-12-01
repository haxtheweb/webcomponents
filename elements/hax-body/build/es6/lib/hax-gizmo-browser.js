import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import * as async from "../node_modules/@polymer/polymer/lib/utils/async.js";
import "../node_modules/@polymer/iron-list/iron-list.js";
import "../node_modules/@polymer/paper-input/paper-input.js";
import "../node_modules/@lrnwebcomponents/grafitto-filter/grafitto-filter.js";
import "../node_modules/@lrnwebcomponents/dropdown-select/dropdown-select.js";
import "../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";
import "./hax-gizmo-browser-item.js";
Polymer({
  _template: html`
    <style is="custom-style" include="simple-colors">
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
    </app-toolbar>
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
    search: { type: String },
    title: { type: String, value: "Make" }
  },
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
  detached: function() {
    document.body.removeEventListener(
      "hax-store-property-updated",
      this._haxStorePropertyUpdated.bind(this)
    );
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
    if (typeof this.$.filter !== typeof void 0) {
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
