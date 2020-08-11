/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";
import { LitElement } from "lit-element";
/**
 * `fullscreen-behaviors`
 *
 * @demo demo/viewer.html
 * @element fullscreen-behaviors
 *
 */
class FullscreenBehaviors extends LitElement {
  static get tag() {
    return "fullscreen-behaviors";
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      __fullscreenBehaviorsLoaded: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.__fullscreenBehaviorsLoaded = false;
    if (typeof screenfull === "object") {
      this._onFullscreenBehaviorsLoaded();
    } else {
      const basePath = this.pathFromUrl(decodeURIComponent(import.meta.url));
      const location = `${basePath}screenfull/dist/screenfull.js`;
      window.ESGlobalBridge.requestAvailability();
      window.ESGlobalBridge.instance.load("screenfullLib", location);
      window.addEventListener(
        "es-bridge-screenfullLib-loaded",
        this._onFullscreenBehaviorsLoaded
      );
    }
  }

  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    window.removeEventListener(
      "es-bridge-screenfullLib-loaded",
      this._onFullscreenBehaviorsLoaded
    );
    super.disconnectedCallback();
  }

  /**
   * whether or not the fullscreen mode is be disabled
   * @returns {boolean}
   */
  get fullscreenEnabled() {
    let mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    return typeof screenfull === "object" && !mobile;
  }

  /**
   * sets the element's __screenfullLoaded variable to true once screenfull is loaded
   * and adds an event listener for screenfull
   * @param {event} e screenfull load
   */
  _onFullscreenBehaviorsLoaded() {
    this.__fullscreenBehaviorsLoaded = true;
  }
}
window.customElements.define(FullscreenBehaviors.tag, FullscreenBehaviors);
export { FullscreenBehaviors };

// register globally so we can make sure there is only one
window.FullscreenBehaviors = window.FullscreenBehaviors || {};
// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same modal
window.FullscreenBehaviors.requestAvailability = () => {
  if (!window.FullscreenBehaviors.instance) {
    window.FullscreenBehaviors.instance = document.createElement(
      "fullscreen-behaviors"
    );
    document.body.appendChild(window.FullscreenBehaviors.instance);
  }
  return window.FullscreenBehaviors.instance;
};
