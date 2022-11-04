/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { FullscreenBehaviors } from "../fullscreen-behaviors.js";
import { LitElement, html, css } from "lit";
/**
 * `fullscreen-behaviors-demo`
 *
 * @demo demo/index.html
 * @element fullscreen-behaviors-demo
 *
 */
class FullscreenBehaviorsDemo extends FullscreenBehaviors(LitElement) {
  static get tag() {
    return "fullscreen-behaviors-demo";
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
    };
  }
  static get styles() {
    return [
      css`
        :host {
          display: block;
          max-height: 90vh;
          overflow: scroll;
          padding: 0;
          margin: 0 15px;
          background-color: white;
        }
        :host([hdden]) {
          display: none !important;
        }
        button {
          margin: 0 auto;
          display: block;
        }
        button[aria-pressed="true"] {
          color: blue;
        }
        ::slotted(*) {
          display: block;
          margin: 0 auto;
          width: 100%;
          padding: 0;
        }
      `,
    ];
  }

  render() {
    return html`
      <slot></slot>
      <button
        aria-pressed="${this.__fullscreen ? "true" : "false"}"
        ?disabled="${!this.fullscreenEnabled}"
        @click="${(e) => this.toggleFullscreen()}"
      >
        Toggle Fullscreen
      </button>
    `;
  }

  constructor() {
    super();
  }
}
customElements.define(FullscreenBehaviorsDemo.tag, FullscreenBehaviorsDemo);
export { FullscreenBehaviorsDemo };
