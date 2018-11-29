/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import * as async from "@polymer/polymer/lib/utils/async.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@polymer/app-layout/app-drawer/app-drawer.js";
import "@polymer/neon-animation/neon-animation.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icon/iron-icon.js";
/**
 * `simple-drawer`
 * `a singleton drawer element`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SimpleDrawer extends PolymerElement {
  // render function
  static get template() {
    return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
:host {
    display: block;
    z-index: 1000;
  }

app-drawer {
  --app-drawer-width: var(--lrnsys-drawer-width);

  --app-drawer-content-container: {
    padding: 0;
    overflow-y: scroll;
    position: fixed;
    color: var(--lrnsys-drawer-color);
    background-color: var(--lrnsys-drawer-background-color);
  }
}

.drawer-header {
  width: 100%;
  padding: 0;
  margin: 0 0 8px 0;
  text-align: left;
  @apply --lrnsys-drawer-header;
}

.drawer-heading {
  font-size: 24px;
  margin: 0;
  padding: 0 15px;
  height: 40px;
  line-height: 48px;
}

.drawer-content {
  padding: 0 15px;
  text-align: left;
}

.drawer-header-slot ::slotted(*) {
  font-size: 24px;
  margin: 0;
  padding: 0 15px;
  height: 40px;
  line-height: 48px;
}

#close {
  position: absolute;
  right: 8px;
  top: 8px;
  padding: 4px;
  margin: 0;
  text-transform: none;
  float: right;
  font-size: 12px;
  color: var(--simple-modal-color, black);
  background-color: transparent;
  min-width: unset;
}

#close iron-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 2px;
}</style>
<style is="custom-style" include="simple-colors"></style>
<app-drawer tabindex="0" id="flyoutcontent" opened="[[opened]]" align="[[align]]" role="dialog">
  <div class="drawer-contents">
    <div class="drawer-header">
      <div class\$="[[headingClass]] drawer-header-slot">
        <slot name="header"></slot>
      </div>
      <h3 class\$="[[headingClass]] drawer-heading" hidden\$="[[!header]]">[[header]]</h3>
    </div>
    <div class="drawer-content">
      <slot></slot>
    </div>
    <paper-button id="close" on-tap="closeDrawer">
      <iron-icon icon="[[closeIcon]]"></iron-icon> [[closeLabel]]
    </paper-button>
  </div>
</app-drawer>`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * open state
       */
      opened: {
        name: "opened",
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        observer: "_openedChanged"
      },
      /**
       * Close label
       */
      closeLabel: {
        name: "closeLabel",
        type: String,
        value: "Close"
      },
      /**
       * Close icon
       */
      closeIcon: {
        name: "closeIcon",
        type: String,
        value: "cancel"
      },
      /**
       * The element that invoked this. This way we can track our way back accessibly
       */
      invokedBy: {
        name: "invokedBy",
        type: Object
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "simple-drawer";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(SimpleDrawer.tag, SimpleDrawer);
export { SimpleDrawer };
