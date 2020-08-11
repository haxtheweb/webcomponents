/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";
import { LitElement } from "lit-element";
/**
 * `fullscreen-behaviors-demo`
 *
 * @demo demo/viewer.html
 * @element fullscreen-behaviors-demo
 *
 */
class FullscreenBehaviorsDemo extends LitElement {
  static get tag() {
    return "fullscreen-behaviors-demo";
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties
    };
  }

  render() {
    return html`
      <slot></slot><button>Toggle Fullscreen</button>
    `;
  }

  constructor() {
    super();
  }
}
export { FullscreenBehaviorsDemo };
