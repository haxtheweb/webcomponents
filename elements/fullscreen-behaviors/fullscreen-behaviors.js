/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";

const FullscreenBehaviors = function (SuperClass) {
  return class extends SuperClass {
    // properties available to the custom element for data binding
    static get properties() {
      return {
        fullscreen: { type: Boolean, attribute: "fullscreen", reflect: true },
        fullscreenEnabled: {
          type: Boolean,
          attribute: "fullscreen-enabled",
          reflect: true,
        },
      };
    }

    render() {
      return html` <slot></slot> `;
    }

    constructor() {
      super();
      this.fullscreen = false;
      this.fullscreenEnabled = globalThis.document.fullscreenEnabled;
      this.__documentFullscreenChange = this._handleFullscreenChange.bind(
        this,
      );
      this.onfullscreenchange = this._handleFullscreenChange;
    }

    connectedCallback() {
      // addEventListener instead of overwriting the shared
      // document.onfullscreenchange handler slot so pre-existing
      // document-level handlers are never clobbered and multiple
      // instances can each track fullscreen state independently
      globalThis.document.addEventListener(
        "fullscreenchange",
        this.__documentFullscreenChange,
      );
      super.connectedCallback();
    }

    /**
     * life cycle, element is removed from the DOM
     */
    disconnectedCallback() {
      globalThis.document.removeEventListener(
        "fullscreenchange",
        this.__documentFullscreenChange,
      );
      super.disconnectedCallback();
    }

    static get tag() {
      return "fullscreen-behaviors";
    }
    /**
     * element to make fullscreen, can be overidden
     *
     * @readonly
     */
    get fullscreenTarget() {
      return this;
    }

    _handleFullscreenChange(e) {
      this.fullscreen =
        globalThis.document.fullscreenElement === this.fullscreenTarget;
    }

    toggleFullscreen(
      mode = globalThis.document.fullscreenElement !== this.fullscreenTarget,
    ) {
      if (!mode) {
        // exit; safe to request even when we are not the fullscreen element
        if (globalThis.document.exitFullscreen)
          globalThis.document.exitFullscreen();
      } else if (
        globalThis.document.fullscreenElement !== this.fullscreenTarget
      ) {
        // only request when we are not already the fullscreen element so
        // an already-fullscreen target does not race exit against request
        this.fullscreenTarget.requestFullscreen();
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
globalThis.customElements.define(
  FullscreenBehaviorsEl.tag,
  FullscreenBehaviorsEl,
);
export { FullscreenBehaviorsEl, FullscreenBehaviors };
