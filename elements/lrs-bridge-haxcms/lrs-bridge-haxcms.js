/**
 * Copyright 2019 PSU
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { autorun } from "mobx";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/haxcms-site-store.js";
import { LrsBridge } from "@lrnwebcomponents/lrs-bridge/lrs-bridge.js";

export { LrsBridgeHaxcms };
/**
 * `lrs-bridge-haxcms`
 * `Adds HAXcms event listeners for our LRS.`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class LrsBridgeHaxcms extends LrsBridge {
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
      </style>
      <slot></slot>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {};
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "lrs-bridge-haxcms";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this._disposer = [];
    autorun(reaction => {
      this._locationChanged(store.location);
      this._disposer.push(reaction);
    });
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    this._disposer.forEach(d => {
      d.dispose();
    });
  }

  _locationChanged(location) {
    // trim slash from begining and end
    const trimSlash = string => string.replace(/(^\/|\/$)/, "");
    const url = `${trimSlash(location.baseUrl)}/${trimSlash(
      location.pathname
    )}`;
    this.recordStatement({
      verb: {
        id: "viewed"
      },
      object: {
        id: url
      }
    });
  }
}
window.customElements.define(LrsBridgeHaxcms.tag, LrsBridgeHaxcms);
