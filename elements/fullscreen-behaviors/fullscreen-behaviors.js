/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import "./lib/fullscreen-behaviors-manager.js";

const FullscreenBehaviors = function (SuperClass) {
  return class extends SuperClass {
    // properties available to the custom element for data binding
    static get properties() {
      return {
        __fullscreen: { type: Boolean, attribute: "fullscreen" },
        __fullscreenEnabled: { type: Boolean, attribute: "fullscreen-enabled" },
      };
    }

    render() {
      return html` <slot></slot> `;
    }

    constructor() {
      super();
      this.__fullscreen = false;
      this.__fullscreenEnabled = false;
      if (!this.fullscreenManager.__loaded) {
        let callback = () => {
          this._updateEnabled();
          window.removeEventListener(
            "es-bridge-screenfullLib-loaded",
            callback.bind(this)
          );
        };
        window.addEventListener(
          "es-bridge-screenfullLib-loaded",
          callback.bind(this)
        );
      } else {
        this._updateEnabled();
      }
    }

    /**
     * life cycle, element is removed from the DOM
     */
    disconnectedCallback() {
      screenfull.off("change", this._updateFullscreen.bind(this));
      super.disconnectedCallback();
    }

    static get tag() {
      return "fullscreen-behaviors";
    }
    /**
     * gets the fullscreen fullscreenManager singleton
     *
     * @readonly
     * @returns {object}
     */
    get fullscreenManager() {
      return window.FullscreenBehaviorsManager.requestAvailability();
    }
    /**
     * element to make fullscreen, can be overidden
     *
     * @readonly
     */
    get fullscreenTarget() {
      return this;
    }
    /**
     * whether device is ready and capable for fullscreen
     *
     * @readonly
     */
    get fullscreenEnabled() {
      return this.__fullscreenEnabled;
    }
    _updateFullscreen(fullscreen = screenfull && screenfull.isFullscreen) {
      let delayedUpdate = (e) => {
        setTimeout(this._updateFullscreen(), 500);
      };
      this.__fullscreen = fullscreen;
      if (this.__fullscreen) {
        console.log("liusten");
        document.addEventListener("fullscreenchange", delayedUpdate.bind(this));
      } else {
        document.removeEventListener(
          "fullscreenchange",
          delayedUpdate.bind(this)
        );
      }
    }
    _updateEnabled() {
      this.__fullscreenEnabled =
        this.fullscreenManager && this.fullscreenManager.enabled;
      if (screenfull && screenfull.isEnabled) {
        screenfull.on("change", (e) => this._updateFullscreen.bind(this));
      }
    }

    toggleFullscreen(mode = !screenfull.isFullscreen) {
      if (this.fullscreenEnabled && screenfull) {
        if (mode) {
          screenfull.request(this.fullscreenTarget);
        } else {
          screenfull.exit(this.fullscreenTarget);
        }
        this._updateFullscreen(mode);
      }
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
