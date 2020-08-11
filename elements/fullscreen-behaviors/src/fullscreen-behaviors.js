/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "./lib/fullscreen-behaviors-manager.js";

const FullscreenBehaviors = function(SuperClass) {
  return class extends SuperClass {
    // properties available to the custom element for data binding
    static get properties() {
      return {
        __fullscreenBehaviorsLoaded: { type: Boolean }
      };
    }

    constructor() {
      super();
      this.__fullscreenMgr = window.FullscreenBehaviorsManager.requestAvailability();
    }

    static get tag() {
      return "fullscreen-behaviors";
    }

    toggleFullscreen(mode,target = this){
      if (this.fullscreenEnabled && screenfull) {
        if (mode) {
          screenfull.request(this);
        } else {
          screenfull.exit(this);
        }
      }
    }

    /**
     * callback for when fullscreen manager is ready
     *
     * @param {function} callback
     */
    _onFullscreenReady(callback){
      if(this.manager) this.manager.onReady(callback);
    }
    /**
     * gets the fullscreen manager singleton
     *
     * @readonly
     * @returns {object}
     */
    get manager(){
      return this.__fullscreenMgr;
    }

    /**
     * whether or not the fullscreen mode is be disabled
     *
     * @readonly
     * @returns {boolean}
     */
    get fullscreenEnabled() {
      return this.manager && this.manager.enabled;
    }
  };
};
/**
 * `fullscreen-behaviors`
 * abstracted fullscreen behaviors 
 *
 * @element fullscreen-behaviors
 */
class FullscreenBehaviorsEl extends FullscreenBehaviors(LitElement) {}
window.customElements.define(FullscreenBehaviorsEl.tag, FullscreenBehaviorsEl);
export { FullscreenBehaviorsEl, FullscreenBehaviors };
