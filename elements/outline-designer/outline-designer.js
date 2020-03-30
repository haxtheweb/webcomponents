/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import * as async from "@polymer/polymer/lib/utils/async.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/social-icons.js";
import "@polymer/iron-icons/device-icons.js";
import "@polymer/iron-pages/iron-pages.js";
import "@polymer/iron-image/iron-image.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-card/paper-card.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/iron-list/iron-list.js";
import "@polymer/iron-swipeable-container/iron-swipeable-container.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
import "@polymer/paper-progress/paper-progress.js";
import "@polymer/app-layout/app-toolbar/app-toolbar.js";
import "@polymer/app-layout/app-header/app-header.js";
import "@lrnwebcomponents/item-overlay-ops/item-overlay-ops.js";
import "@lrnwebcomponents/lrnsys-outline/lrnsys-outline.js";
import "@lrnwebcomponents/simple-colors/lib/simple-colors-polymer.js";
import "@lrnwebcomponents/simple-modal/simple-modal.js";
import "@lrnwebcomponents/editable-list/editable-list.js";
import "./lib/sortable-list.js";
import { pagemap } from "./lib/pagemap.js";
/**
 * `outline-designer`
 * @element outline-designer
 * `tools to modify and visualize JSON Outline Schema for editing`
 *
 * @microcopy - language worth noting:
 *  -
 * Feedback
 * color code lessons
step down the hierarchy

mode vs resolution (3 levels)

 *

 * @polymer
 * @demo demo/index.html
 */
class OutlineDesigner extends PolymerElement {
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none;
        }

        app-toolbar {
          background-color: var(
            --simple-colors-default-theme-light-blue-1,
            #4285f4
          );
          color: var(--simple-colors-default-theme-grey-12, #222222);
          margin: 20px 0;
        }

        #viewmode,
        #detailsmode {
          transition: 0.3s all ease;
          -webkit-transition: 0.3s all ease;
          -moz-transition: 0.3s all ease;
          -ms-transition: 0.3s all ease;
          -o-transition: 0.3s all ease;
        }
        .rotate-90 {
          transform: rotate(90deg);
          -webkit-transform: rotate(90deg);
          -moz-transform: rotate(90deg);
          -ms-transform: rotate(90deg);
          -o-transform: rotate(90deg);
        }

        .breadcrumb-arrow:first-child {
          display: none;
        }
        .breadcrumb-arrow {
          color: var(
            --breadcrumb-color1,
            var(--simple-colors-default-theme-light-blue-9, rgb(67, 110, 144))
          );
          margin: -2px 6px 0 6px;
        }
        .breadcrumb {
          text-decoration: none;
          -webkit-tap-highlight-color: transparent;
          background-color: transparent;
          line-height: 34px;
          font-size: 18px;
          color: var(
            --breadcrumb-color1,
            var(--simple-colors-default-theme-light-blue-9, rgb(67, 110, 144))
          );
          opacity: 0.8;
        }

        paper-progress {
          display: block;
          width: 100%;
          --paper-progress-active-color: rgba(255, 255, 255, 0.5);
          --paper-progress-container-color: transparent;
        }
        .card-wrapper {
          padding: 16px;
        }

        #sort .card-wrapper {
          background: var(--simple-colors-default-theme-grey-3, #ddd);
          display: inline-block;
          float: left;
          margin: 16px;
          vertical-align: top;
        }

        paper-card {
          width: 250px;
          height: 300px;
          display: block;
          visibility: visible;
          opacity: 1;
        }

        #addbutton {
          opacity: 0.6;
          background-color: var(--simple-colors-default-theme-grey-3, #ddd);
        }
        .add-button {
          width: 200px;
          height: 200px;
          margin: auto;
          display: flex;
        }

        paper-card.expanded {
          min-height: 300px;
        }

        iron-list {
          flex: 1 1 auto;
        }

        .low-detail,
        .mid-detail,
        .high-detail {
          visibility: visible;
          opacity: 1;
          transition: 0.6s all ease;
          -webkit-transition: 0.6s all ease;
          -moz-transition: 0.6s all ease;
          -ms-transition: 0.6s all ease;
          -o-transition: 0.6s all ease;
        }

        :host([details-mode="low"]) .mid-detail,
        :host([details-mode="low"]) .high-detail {
          visibility: hidden;
          opacity: 0;
        }

        :host([details-mode="mid"]) .high-detail {
          visibility: hidden;
          opacity: 0;
        }
        :host([details-mode="mid"]) .mid-detail {
          visibility: visible;
          opacity: 1;
        }

        paper-card.card-low-detail {
          width: 150px;
          height: 150px;
        }
        paper-card.card-mid-detail {
          width: 250px;
          height: 250px;
        }
        paper-card.card-high-detail {
          width: 250px;
          height: 300px;
        }

        #minimaparea {
          position: fixed;
          top: 125px;
          right: 0;
          width: 100px;
          height: 100%;
          z-index: 100;
          visibility: hidden;
          opacity: 0;
          transition: 0.3s all linear;
          background-color: transparent;
          -webkit-transition: 0.3s all linear;
          -moz-transition: 0.3s all linear;
          -ms-transition: 0.3s all linear;
          -o-transition: 0.3s all linear;
        }
        #minimaparea.show-minimap {
          background-color: white;
          opacity: 0.5;
          visibility: visible;
        }
        #minimaparea.show-minimap:hover {
          opacity: 0.9;
        }

        .tf-tree {
          transition: 0.3s all ease;
          font-size: 16px;
          overflow: auto;
        }
        .tf-tree * {
          transition: 0.3s all ease;
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        .tf-tree ul {
          display: inline-flex;
        }
        .tf-tree li {
          align-items: center;
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;
          padding: 0 1em;
          position: relative;
        }
        .tf-tree li ul {
          margin: 2em 0;
        }
        .tf-tree li li:before {
          border-top: 0.0625em solid #000;
          content: "";
          display: block;
          height: 0.0625em;
          left: -0.03125em;
          position: absolute;
          top: -1.03125em;
          width: 100%;
        }
        .tf-tree li li:first-child:before {
          left: calc(50% - 0.03125em);
          max-width: calc(50% + 0.0625em);
        }
        .tf-tree li li:last-child:before {
          left: auto;
          max-width: calc(50% + 0.0625em);
          right: calc(50% - 0.03125em);
        }
        .tf-tree li li:only-child:before {
          display: none;
        }
        .tf-tree li li:only-child > .tf-nc:before,
        .tf-tree li li:only-child > .tf-node-content:before {
          height: 1.0625em;
          top: -1.0625em;
        }
        .tf-tree .tf-nc,
        .tf-tree .tf-node-content {
          border: 0.0625em solid #000;
          display: inline-block;
          padding: 0.5em 1em;
          position: relative;
        }
        .tf-tree .tf-nc:before,
        .tf-tree .tf-node-content:before {
          top: -1.03125em;
        }
        .tf-tree .tf-nc:after,
        .tf-tree .tf-nc:before,
        .tf-tree .tf-node-content:after,
        .tf-tree .tf-node-content:before {
          border-left: 0.0625em solid #000;
          content: "";
          display: block;
          height: 1em;
          left: calc(50% - 0.03125em);
          position: absolute;
          width: 0.0625em;
        }
        .tf-tree .tf-nc:after,
        .tf-tree .tf-node-content:after {
          top: calc(100% + 0.03125em);
        }
        .tf-tree .tf-nc:only-child:after,
        .tf-tree .tf-node-content:only-child:after,
        .tf-tree > ul > li > .tf-nc:before,
        .tf-tree > ul > li > .tf-node-content:before {
          display: none;
        }
        .tf-tree.tf-gap-sm li {
          padding: 0 0.6em;
        }
        .tf-tree.tf-gap-sm li > .tf-nc:before,
        .tf-tree.tf-gap-sm li > .tf-node-content:before {
          height: 0.6em;
          top: -0.6em;
        }
        .tf-tree.tf-gap-sm li > .tf-nc:after,
        .tf-tree.tf-gap-sm li > .tf-node-content:after {
          height: 0.6em;
        }
        .tf-tree.tf-gap-sm li ul {
          margin: 1.2em 0;
        }
        .tf-tree.tf-gap-sm li li:before {
          top: -0.63125em;
        }
        .tf-tree.tf-gap-sm li li:only-child > .tf-nc:before,
        .tf-tree.tf-gap-sm li li:only-child > .tf-node-content:before {
          height: 0.6625em;
          top: -0.6625em;
        }
        .tf-tree.tf-gap-lg li {
          padding: 0 1.5em;
        }
        .tf-tree.tf-gap-lg li > .tf-nc:before,
        .tf-tree.tf-gap-lg li > .tf-node-content:before {
          height: 1.5em;
          top: -1.5em;
        }
        .tf-tree.tf-gap-lg li > .tf-nc:after,
        .tf-tree.tf-gap-lg li > .tf-node-content:after {
          height: 1.5em;
        }
        .tf-tree.tf-gap-lg li ul {
          margin: 3em 0;
        }
        .tf-tree.tf-gap-lg li li:before {
          top: -1.53125em;
        }
        .tf-tree.tf-gap-lg li li:only-child > .tf-nc:before,
        .tf-tree.tf-gap-lg li li:only-child > .tf-node-content:before {
          height: 1.5625em;
          top: -1.5625em;
        }
        .tf-tree li.tf-dotted-children .tf-nc:after,
        .tf-tree li.tf-dotted-children .tf-nc:before,
        .tf-tree li.tf-dotted-children .tf-node-content:after,
        .tf-tree li.tf-dotted-children .tf-node-content:before {
          border-left-style: dotted;
        }
        .tf-tree li.tf-dotted-children li:before {
          border-top-style: dotted;
        }
        .tf-tree li.tf-dotted-children > .tf-nc:before,
        .tf-tree li.tf-dotted-children > .tf-node-content:before {
          border-left-style: solid;
        }
        .tf-tree li.tf-dashed-children .tf-nc:after,
        .tf-tree li.tf-dashed-children .tf-nc:before,
        .tf-tree li.tf-dashed-children .tf-node-content:after,
        .tf-tree li.tf-dashed-children .tf-node-content:before {
          border-left-style: dashed;
        }
        .tf-tree li.tf-dashed-children li:before {
          border-top-style: dashed;
        }
        .tf-tree li.tf-dashed-children > .tf-nc:before,
        .tf-tree li.tf-dashed-children > .tf-node-content:before {
          border-left-style: solid;
        }
        .tf-label {
          transition: 0.3s all ease;
          cursor: pointer;
        }

        .node-high-detail li iron-image {
          height: 50px;
          position: static;
        }
        .node-high-detail li .tf-label {
          z-index: 1;
          position: relative;
          font-size: 1.75em;
          padding: 8px;
          background-color: rgba(250, 250, 250, 0.8);
        }

        .node-low-detail .tf-nc {
          height: 32px;
          width: 32px;
          background-color: var(
            --simple-colors-default-theme-light-blue-7,
            dodgerblue
          );
          border-color: var(
            --simple-colors-default-theme-light-blue-7,
            dodgerblue
          );
          padding: 0;
          border-radius: 50%;
          overflow: hidden;
          -webkit-border-radius: 50%;
          -moz-border-radius: 50%;
          -ms-border-radius: 50%;
          -o-border-radius: 50%;
        }

        .node-low-detail .tf-nc:before,
        .node-low-detail .tf-nc:after {
          border-left-color: var(
            --simple-colors-default-theme-light-blue-7,
            dodgerblue
          );
          border-left-width: 2px;
        }
        .node-low-detail li li:before {
          border-top-color: var(
            --simple-colors-default-theme-light-blue-7,
            dodgerblue
          );
          border-top-width: 2px;
        }
      </style>
      <style include="simple-colors-shared-styles-polymer"></style>
      <iron-ajax
        auto="[[outlineSchemaUrl]]"
        url="[[outlineSchemaUrl]]"
        handle-as="json"
        last-response="{{manifest}}"
        loading="{{__loading}}"
      >
      </iron-ajax>
      <app-header reveals>
        <app-toolbar>
          View: [[viewModeLabel]]
          <paper-icon-button
            on-click="_toggleViewMode"
            id="viewmode"
            icon="[[viewModeIcon]]"
          ></paper-icon-button>
          <simple-tooltip for="viewmode">[[viewModeLabel]]</simple-tooltip>
          Detail: [[detailsModeLabel]]
          <paper-icon-button
            on-click="_toggleDetailsMode"
            id="detailsmode"
            icon="[[detailsModeIcon]]"
          ></paper-icon-button>
          <simple-tooltip for="detailsmode"
            >[[detailsModeLabel]]</simple-tooltip
          >
          <div main-title class="flex layout breadcrumb_layout">
            <iron-icon
              class="breadcrumb-arrow"
              icon="icons:chevron-right"
            ></iron-icon>
            <a class="breadcrumb" id="main">[[manifest.title]]</a>

            <iron-icon
              class="breadcrumb-arrow"
              icon="icons:chevron-right"
            ></iron-icon>
            <a class="breadcrumb" id="second">Lesson 2</a>

            <iron-icon
              class="breadcrumb-arrow"
              icon="icons:chevron-right"
            ></iron-icon>
            <a class="breadcrumb" id="third">Math Basics</a>
          </div>
          <div>
            <paper-icon-button
              on-click="_toggleMiniMap"
              id="minimap"
              icon="device:gps-fixed"
              title="Toggle outline mini map"
            ></paper-icon-button>
            <simple-tooltip for="helpbutton">Toggle mini-map</simple-tooltip>
            <paper-icon-button
              id="helpbutton"
              icon="icons:help"
              title="help"
            ></paper-icon-button>
            <simple-tooltip for="helpbutton">Help</simple-tooltip>
          </div>
          <paper-progress
            value="10"
            indeterminate
            bottom-item
            hidden$="[[!__loading]]"
          ></paper-progress>
        </app-toolbar>
      </app-header>
      <iron-pages selected="[[selectedView]]">
        <section id="listpage">
          <iron-list id="ironlist" items="[[manifest.items]]" as="item" grid>
            <template>
              <div class="card-wrapper">
                <item-overlay-ops
                  fixed-height="140"
                  data-item-id$="[[item.id]]"
                  add=""
                  edit=""
                  remove=""
                  duplicate=""
                  move=""
                  edit-mode=""
                >
                  <paper-card
                    class$="card-[[detailsMode]]-detail"
                    heading="[[item.title]]"
                    image="[[item.metadata.image]]"
                    elevation="2"
                    animated-shadow="false"
                  >
                    <div class="card-content mid-detail">
                      [[item.description]]
                    </div>
                    <div class="card-actions high-detail">
                      <editable-list
                        edit-mode="[[editMode]]"
                        items="[[manifest.items]]"
                      >
                        <editable-list-item>[[item.title]]</editable-list-item>
                      </editable-list>
                      <ul>
                        <li>Page 1</li>
                        <iron-swipeable-container
                          ><li>Page 2</li></iron-swipeable-container
                        >
                        <iron-swipeable-container
                          ><li>Page 3</li></iron-swipeable-container
                        >
                      </ul>
                    </div>
                  </paper-card>
                </item-overlay-ops>
              </div>
            </template>
          </iron-list>
        </section>
        <section id="outlinepage">
          <lrnsys-outline
            id="outline"
            items="[[manifest.items]]"
            title="[[manifest.title]]"
          ></lrnsys-outline>
        </section>
        <section id="treepage">
          <div class$="node-[[detailsMode]]-detail tf-tree">
            <ul>
              <template
                is="dom-repeat"
                items="[[manifest.items]]"
                as="item"
                mutable-data
              >
                <li>
                  <span class="tf-nc">
                    <div class="tf-label" id$="item-tip-[[item.id]]">
                      [[item.title]]
                    </div>
                    <simple-tooltip for$="item-tip-[[item.id]]"
                      >[[item.title]]</simple-tooltip
                    >
                    <iron-image
                      src="[[item.metadata.image]]"
                      preload
                      sizing="cover"
                      class="high-detail"
                    ></iron-image>
                  </span>
                </li>
              </template>
            </ul>
          </div>
        </section>
        <section id="sortpage">
          <sortable-list
            id="sort"
            sortable=".card-wrapper"
            on-sort-finish="_onSortFinish"
            dragging="{{dragging}}"
          >
            <template
              is="dom-repeat"
              items="[[manifest.items]]"
              as="item"
              mutable-data
            >
              <div class="card-wrapper">
                <paper-card
                  class$="card-[[detailsMode]]-detail"
                  data-item-id$="[[item.id]]"
                  heading="[[item.title]]"
                  image="[[item.metadata.image]]"
                  elevation="2"
                  animated-shadow="false"
                >
                  <div class="card-content mid-detail">
                    [[item.description]]
                  </div>
                  <div class="card-actions high-detail"></div>
                </paper-card>
              </div>
            </template>
          </sortable-list>
        </section>
      </iron-pages>
      <canvas id="minimaparea"></canvas>
      <slot></slot>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      /**
       * Which layout to the outline to display
       */
      viewMode: {
        name: "viewMode",
        type: String,
        value: "cards",
        observer: "_viewModeChanged"
      },
      /**
       * Icon for the selected view mode
       */
      viewModeIcon: {
        name: "viewModeIcon",
        type: String
      },
      /**
       * Label for the selected view mode
       */
      viewModeLabel: {
        name: "viewModeLabel",
        type: String
      },
      /**
       * Which layout to the outline to display
       */
      detailsMode: {
        name: "detailsMode",
        type: String,
        value: "mid",
        reflectToAttribute: true,
        observer: "_detailsModeChanged"
      },
      /**
       * Icon for the selected view mode
       */
      detailsModeIcon: {
        name: "detailsModeIcon",
        type: String
      },
      /**
       * Label for the selected view mode
       */
      detailsModeLabel: {
        name: "detailsModeLabel",
        type: String
      },
      /**
       * Data binding to show the selected view
       */
      selectedView: {
        name: "selectedView",
        type: Number
      },
      /**
       * Whether or not we are in an editing state
       */
      editMode: {
        name: "editMode",
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        observer: "_editModeChanged"
      },
      /**
       * Whether or to show the mini map
       */
      miniMap: {
        name: "miniMap",
        type: Boolean,
        value: true,
        reflectToAttribute: true,
        observer: "_miniMapChanged"
      },
      /**
       * end point / JSON to load
       */
      outlineSchemaUrl: {
        name: "outlineSchemaUrl",
        type: String,
        value: false
      },
      /**
       * JSON outline schema manifest
       */
      manifest: {
        name: "manifest",
        type: Object,
        notify: true
      },
      /**
       * Data in outline format
       */
      outlineData: {
        name: "outlineData",
        type: Object,
        notify: true
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "outline-designer";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot
      .querySelector("#ironlist")
      .addEventListener(
        "item-overlay-op-changed",
        this._overlayOpChanged.bind(this)
      );
    this.shadowRoot
      .querySelector("#ironlist")
      .addEventListener(
        "item-overlay-option-selected",
        this._overlayOpSelected.bind(this)
      );
    pagemap(this.shadowRoot.querySelector("#minimaparea"), {
      viewport: null,
      styles: {
        "ul,ol,li": "rgba(0, 0, 0, 0.08)",
        "h1,h2,h3,h4,h5,h6,a": "rgba(0, 0, 0, 0.10)",
        "lrnsys-outline-item": "rgba(0, 0, 0, 0.08)",
        "p,section": "rgba(0, 0, 0, 0.02)"
      },
      back: "rgba(0, 0, 0, 0.02)",
      view: "rgba(0, 0, 0, 0.05)",
      drag: "rgba(0, 0, 0, 0.10)",
      interval: null
    });
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.shadowRoot
      .querySelector("#ironlist")
      .removeEventListener(
        "item-overlay-op-changed",
        this._overlayOpChanged.bind(this)
      );
    this.shadowRoot
      .querySelector("#ironlist")
      .removeEventListener(
        "item-overlay-option-selected",
        this._overlayOpSelected.bind(this)
      );
  }
  _toggleMiniMap(e) {
    this.miniMap = !this.miniMap;
  }

  _miniMapChanged(newValue, oldValue) {
    if (typeof newValue !== typeof undefined) {
      if (newValue) {
        this.shadowRoot.querySelector("#minimap").icon = "device:gps-fixed";
        this.shadowRoot
          .querySelector("#minimaparea")
          .classList.add("show-minimap");
      } else {
        this.shadowRoot.querySelector("#minimap").icon = "device:gps-off";
        this.shadowRoot
          .querySelector("#minimaparea")
          .classList.remove("show-minimap");
      }
    }
  }
  /**
   * toggle between view modes
   */
  _toggleViewMode(e) {
    switch (this.viewMode) {
      case "cards":
        this.viewMode = "outline";
        break;
      case "outline":
        this.outlineData = this.shadowRoot.querySelector("#outline").getData();
        this.viewMode = "tree";
        break;
      case "tree":
        this.viewMode = "drag";
        break;
      case "drag":
        this.viewMode = "cards";
        break;
    }
  }
  /**
   * toggle between details mode
   */
  _toggleDetailsMode(e) {
    switch (this.detailsMode) {
      case "low":
        this.detailsMode = "mid";
        break;
      case "mid":
        this.detailsMode = "high";
        break;
      case "high":
        this.detailsMode = "low";
        break;
    }
  }
  // Observer details mode for changes
  _detailsModeChanged(newValue, oldValue) {
    if (typeof newValue !== typeof undefined) {
      switch (newValue) {
        case "low":
          this.detailsModeIcon = "icons:apps";
          this.detailsModeLabel = "Low";
          break;
        case "mid":
          this.detailsModeIcon = "icons:view-module";
          this.detailsModeLabel = "Medium";
          break;
        case "high":
          this.detailsModeIcon = "icons:view-carousel";
          this.detailsModeLabel = "High";
          break;
      }
      // fire resize event if iron-list is visible
      if (this.selectedView === 0) {
        async.microTask.run(() => {
          setTimeout(() => {
            this.shadowRoot.querySelector("#ironlist").dispatchEvent(
              new CustomEvent("iron-resize", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: true
              })
            );
            window.dispatchEvent(new Event("resize"));
          }, 50);
        });
      }
    }
  }
  /**
   * Sorting of items has finished, meaning drag drop complete
   */
  _onSortFinish(e) {
    // @todo ensure items align with what's been drag and drop reordered
    console.log(e.detail);
  }
  /**
   * overlay operation changed
   */
  _overlayOpChanged(e) {
    console.log(e.detail);
    switch (e.detail.operation) {
      case "add":
        // @todo execute adding an item after here
        console.log("add item");
        console.log(e.detail.element.getAttribute("data-item-id"));
        break;
      case "edit":
        // @todo execute edit item here
        console.log("edit item");
        console.log(e.detail.element.getAttribute("data-item-id"));
        break;
    }
  }
  /**
   * Option selected in overlay by the user
   */
  _overlayOpSelected(e) {
    console.log(e.detail);
    switch (e.detail.operation) {
      case "move":
        if (e.detail.option === "option1") {
          // @todo execute move left
          console.log("move left");
        } else if (e.detail.option === "option2") {
          // @todo execute move right
          console.log("move right");
        }
        console.log(e.detail.element.getAttribute("data-item-id"));
        break;
      case "duplicate":
        if (e.detail.option === "option1") {
          // @todo execute duplicate
          console.log("duplicate");
          console.log(e.detail.element.getAttribute("data-item-id"));
        }
        break;
      case "remove":
        if (e.detail.option === "option1") {
          // @todo execute delete
          console.log("remove");
          console.log(e.detail.element.getAttribute("data-item-id"));
        }
        break;
    }
  }
  // Observer layoutMode for changes
  _viewModeChanged(newValue, oldValue) {
    if (typeof newValue !== typeof undefined) {
      switch (newValue) {
        case "cards":
          this.shadowRoot.querySelector("#viewmode").classList.add("rotate-90");
          this.selectedView = 0;
          this.viewModeIcon = "icons:view-module";
          this.viewModeLabel = "Card view";
          async.microTask.run(() => {
            setTimeout(() => {
              this.shadowRoot.querySelector("#ironlist").dispatchEvent(
                new CustomEvent("iron-resize", {
                  bubbles: true,
                  cancelable: true,
                  composed: true,
                  detail: true
                })
              );
              window.dispatchEvent(new Event("resize"));
            }, 100);
          });
          break;
        case "outline":
          this.shadowRoot
            .querySelector("#viewmode")
            .classList.remove("rotate-90");
          this.selectedView = 1;
          this.viewModeIcon = "icons:view-list";
          this.viewModeLabel = "Outline view";
          break;
        case "tree":
          this.shadowRoot.querySelector("#viewmode").classList.add("rotate-90");
          this.selectedView = 2;
          this.viewModeIcon = "social:share";
          this.viewModeLabel = "Tree view";
          break;
        case "drag":
          this.shadowRoot
            .querySelector("#viewmode")
            .classList.remove("rotate-90");
          this.selectedView = 3;
          this.viewModeIcon = "icons:touch-app";
          this.viewModeLabel = "Draggable cards";
          break;
      }
    }
  }
}
window.customElements.define("outline-designer", OutlineDesigner);

export { OutlineDesigner };
