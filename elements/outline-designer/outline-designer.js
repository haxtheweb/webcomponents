/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-card/paper-card.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/iron-list/iron-list.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/paper-progress/paper-progress.js";
import "@polymer/app-layout/app-toolbar/app-toolbar.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/simple-modal/simple-modal.js";
/**
 * `outline-designer`
 * `tools to modify and visualize JSON Outline Schema for editing`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
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
          background-color: #4285f4;
          color: #fff;
          margin: 20px 0;
        }

        paper-progress {
          display: block;
          width: 100%;
          --paper-progress-active-color: rgba(255, 255, 255, 0.5);
          --paper-progress-container-color: transparent;
        }
      </style>
      <iron-ajax
        auto
        url="[[outlineSchemaUrl]]"
        handle-as="json"
        on-response="handleResponse"
        last-response="{{manifest}}"
      >
      </iron-ajax>
      <app-header reveals>
        <app-toolbar>
          <paper-icon-button
            id="module"
            icon="icons:view-module"
          ></paper-icon-button>
          <paper-tooltip for="module">Card view</paper-tooltip>
          <paper-icon-button
            id="list"
            icon="icons:view-list"
          ></paper-icon-button>
          <paper-tooltip for="list">Outline view</paper-tooltip>
          <div main-title="">[[manifest.title]]</div>
          <paper-progress value="10" indeterminate bottom-item></paper-progress>
        </app-toolbar>
      </app-header>

      <app-drawer id="drawer" swipe-open></app-drawer>
      <sample-content size="10"></sample-content>
      <slot></slot>
      <iron-list items="[[manifest.items]]" as="item">
        <template>
          <paper-card
            heading="[[item.title]]"
            image=""
            elevation="1"
            animated-shadow="false"
          >
            <div class="card-content"></div>
            <div class="card-actions"></div>
          </paper-card>
        </template>
      </iron-list>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * Which layout to display
       */
      layoutMode: {
        name: "layoutMode",
        type: "String",
        value: "outline",
        reflectToAttribute: false,
        observer: "_layoutModeChanged"
      },
      /**
       * Whether or not we are in an editing state
       */
      editMode: {
        name: "editMode",
        type: "String",
        value: false,
        reflectToAttribute: true,
        observer: "_editModeChanged"
      },
      /**
       * end point / JSON to load
       */
      outlineSchemaUrl: {
        name: "outlineSchemaUrl",
        type: "String"
      },
      /**
       * JSON outline schema manifest
       */
      manifest: {
        name: "manifest",
        type: "Object",
        notify: true
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "outline-designer";
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
  // Observer layoutMode for changes
  _layoutModeChanged(newValue, oldValue) {
    if (typeof newValue !== typeof undefined) {
      console.log(newValue);
    }
  }

  // Observer editMode for changes
  _editModeChanged(newValue, oldValue) {
    if (typeof newValue !== typeof undefined) {
      console.log(newValue);
    }
  }
}
window.customElements.define(OutlineDesigner.tag, OutlineDesigner);
export { OutlineDesigner };
