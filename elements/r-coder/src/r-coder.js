/**
 * Copyright 2019 PSU
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-button/paper-button.js";
import "@lrnwebcomponents/code-editor/code-editor.js";

/**
 * `r-coder`
 * `R coder interface for the r-service backend.`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class RCoder extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "r-coder";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.ping();
    this.shadowRoot.getElementById(
      "editor"
    ).editorValue = this.textContent.trim();
  }

  async ping() {
    const status = await fetch(this.endpoint, {
      method: "GET"
    }).then(res => res.status);
    this.__connected = status === 200;
  }

  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}

  async process() {
    const code = this.shadowRoot.getElementById("editor").value;
    const data = await fetch(this.endpoint, {
      method: "POST",
      body: code
    }).then(res => res.text());
    this.shadowRoot.getElementById("output").innerText = data;
  }
}
window.customElements.define(RCoder.tag, RCoder);

export { RCoder };
