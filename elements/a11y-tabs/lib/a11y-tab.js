/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-a11y-keys/iron-a11y-keys.js";
/**
 * `a11y-tab`
 * `accessible and responsive tabbed interface`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class A11yTab extends PolymerElement {
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          height: var(--a11y-tabs-tab-height, --a11y-tabs-height);
          overflow: var(--a11y-tabs-tab-overflow, --a11y-tabs-overflow);
          @apply --a11y-tab-content;
        }
        :host([flag]) {
          @apply --a11y-tab-flagged-content;
        }
        :host([hidden]) {
          display: none;
        }
        :host .sr-only {
          position: absolute;
          left: -99999px;
          height: 0;
          overflow: hidden;
        }
      </style>
      <span class="sr-only">Tab [[__xOfY]]</span>
      <slot></slot>
      <span class="sr-only"
        >End of tab [[__xOfY]]. Back to <a href$="[[__toTop]]">tabs</a>.</span
      >
    `;
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * the unique identifier and anchor for the tab
       */
      id: {
        name: "id",
        type: String,
        value: null,
        observer: "_tabChanged"
      },
      /**
       * optional flag the tab, eg. `new`, `alert`, or `error`
       */
      flag: {
        name: "flag",
        type: String,
        value: null,
        observer: "_tabChanged",
        reflectToAttribute: true
      },
      /**
       * optional flag icon the tab, eg. `av:fiber-new`, `icons:warning`, or `icons:error`
       */
      flagIcon: {
        name: "flagIcon",
        type: String,
        value: null,
        observer: "_tabChanged"
      },
      /**
       * icon for this tab, eg. `maps:local-airport`, `maps:local-bar`, or `notification:wifi`
       */
      icon: {
        name: "id",
        type: String,
        value: null,
        observer: "_tabChanged"
      },
      /**
       * label for the tab
       */
      label: {
        name: "label",
        type: String,
        value: null,
        observer: "_tabChanged"
      },
      /**
       * whether the tab is hidden
       */
      hidden: {
        name: "hidden",
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * the anchor back to the top of the tab list (`a11y-tabs` id)
       */
      __toTop: {
        name: "__toTop",
        type: String,
        value: null
      },
      /**
       * tab x of y text, eg. `2 of 3`
       */
      __xOfY: {
        name: "__xOfY",
        type: String,
        value: null
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "a11y-tab";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.__target = this;
    this.addEventListener("a11y-tab-flag", e => {
      this.flag = e.detail.flag;
      this.flagIcon = e.detail.flagIcon;
    });
  }
  /**
   * handles any change in the tab attributes
   * @param {event} e the tab change event
   */
  _tabChanged(e) {
    let root = this;
    this.dispatchEvent(
      new CustomEvent("a11y-tab-changed", {
        bubbles: true,
        cancelable: true,
        composed: false,
        detail: this
      })
    );
  }
}
window.customElements.define(A11yTab.tag, A11yTab);
export { A11yTab };
