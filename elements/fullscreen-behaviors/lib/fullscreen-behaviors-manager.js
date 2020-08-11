/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";
/**
 * `fullscreen-behaviors-manager`
 *
 * @demo demo/viewer.html
 * @element fullscreen-behaviors-manager
 *
 */
class FullscreenBehaviorsManager extends LitElement {
  static get tag() {
    return "fullscreen-behaviors-manager";
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      __loaded: { type: Boolean },
      __callbacks: { type: Array },
      __fullscreen: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.__callbacks = [];
    this.__loaded = false;
    this.__fullscreen = false;
    if (typeof screenfull === "object") {
      this._setLoaded();
    } else {
      const basePath = this.pathFromUrl(decodeURIComponent(import.meta.url));
      const location = `${basePath}screenfull/dist/screenfull.js`;
      window.ESGlobalBridge.requestAvailability();
      window.ESGlobalBridge.instance.load("screenfullLib", location);
      window.addEventListener(
        "es-bridge-screenfullLib-loaded",
        this._setLoaded.bind(this)
      );
    }
  }

  // simple path from a url modifier
  pathFromUrl(url) {
    return url.substring(0, url.lastIndexOf("/") + 1);
  }

  /**
   * whether or not the fullscreen mode is be disabled
   * @returns {boolean}
   */
  get enabled() {
    let mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    return typeof screenfull === "object" && screenfull.isEnabled && !mobile;
  }

  get fullscreen(){
    return this.__fullscreen;
  }

  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    window.removeEventListener(
      "es-bridge-screenfullLib-loaded",
      this._setLoaded.bind(this)
    );
    super.disconnectedCallback();
  }

  /**
   * once screenfull is loaded, sets the element's __loaded property to true and runs array callbacks
   * @param {event} e screenfull load
   */
  _setLoaded(e) {
    this.__loaded = true;
    (this.__callbacks || []).forEach(callback => callback());
  }
}
window.customElements.define(
  FullscreenBehaviorsManager.tag,
  FullscreenBehaviorsManager
);
export { FullscreenBehaviorsManager };

// register globally so we can make sure there is only one
window.FullscreenBehaviorsManager = window.FullscreenBehaviorsManager || {};
// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same modal
window.FullscreenBehaviorsManager.requestAvailability = () => {
  if (!window.FullscreenBehaviorsManager.instance) {
    window.FullscreenBehaviorsManager.instance = document.createElement(
      "fullscreen-behaviors-manager"
    );
    document.body.appendChild(window.FullscreenBehaviorsManager.instance);
  }
  return window.FullscreenBehaviorsManager.instance;
};
