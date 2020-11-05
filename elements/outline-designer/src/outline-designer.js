/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import * as async from "@polymer/polymer/lib/utils/async.js";
import "@polymer/iron-pages/iron-pages.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/iron-list/iron-list.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";
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
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

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
        "p,section": "rgba(0, 0, 0, 0.02)",
      },
      back: "rgba(0, 0, 0, 0.02)",
      view: "rgba(0, 0, 0, 0.05)",
      drag: "rgba(0, 0, 0, 0.10)",
      interval: null,
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
                detail: true,
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
                  detail: true,
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
