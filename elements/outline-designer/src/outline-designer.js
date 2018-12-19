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
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/paper-progress/paper-progress.js";
import "@polymer/app-layout/app-toolbar/app-toolbar.js";
import "@polymer/app-layout/app-header/app-header.js";
import "@lrnwebcomponents/item-overlay-ops/item-overlay-ops.js";
import "@lrnwebcomponents/lrnsys-outline/lrnsys-outline.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/simple-modal/simple-modal.js";
import "@lrnwebcomponents/editable-list/editable-list.js";
import "./lib/sortable-list.js";
import { pagemap } from "./lib/pagemap.js";
/**
 * `outline-designer`
 * `tools to modify and visualize JSON Outline Schema for editing`
 *
 * @microcopy - language worth noting:
 *  -
 * Feedback
 * color code lessons
step down the hierarchy

mode vs resolution (3 levels)

 *
 * @customElement
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
    this.$.ironlist.addEventListener(
      "item-overlay-op-changed",
      this._overlayOpChanged.bind(this)
    );
    this.$.ironlist.addEventListener(
      "item-overlay-option-selected",
      this._overlayOpSelected.bind(this)
    );
    pagemap(this.$.minimaparea, {
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
    this.$.ironlist.removeEventListener(
      "item-overlay-op-changed",
      this._overlayOpChanged.bind(this)
    );
    this.$.ironlist.removeEventListener(
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
        this.$.minimap.icon = "device:gps-fixed";
        this.$.minimaparea.classList.add("show-minimap");
      } else {
        this.$.minimap.icon = "device:gps-off";
        this.$.minimaparea.classList.remove("show-minimap");
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
        this.outlineData = this.$.outline.getData();
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
            this.$.ironlist.fire("iron-resize");
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
          this.$.viewmode.classList.add("rotate-90");
          this.selectedView = 0;
          this.viewModeIcon = "icons:view-module";
          this.viewModeLabel = "Card view";
          async.microTask.run(() => {
            setTimeout(() => {
              this.$.ironlist.fire("iron-resize");
              window.dispatchEvent(new Event("resize"));
            }, 100);
          });
          break;
        case "outline":
          this.$.viewmode.classList.remove("rotate-90");
          this.selectedView = 1;
          this.viewModeIcon = "icons:view-list";
          this.viewModeLabel = "Outline view";
          break;
        case "tree":
          this.$.viewmode.classList.add("rotate-90");
          this.selectedView = 2;
          this.viewModeIcon = "social:share";
          this.viewModeLabel = "Tree view";
          break;
        case "drag":
          this.$.viewmode.classList.remove("rotate-90");
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
