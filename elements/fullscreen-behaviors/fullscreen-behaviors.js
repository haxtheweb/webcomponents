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
      globalThis.document.onfullscreenchange =
        this._handleFullscreenChange.bind(this);
      this.onfullscreenchange = this._handleFullscreenChange;
    }

    /**
     * life cycle, element is removed from the DOM
     */
    disconnectedCallback() {
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
      if (
        !mode ||
        (document.fullscreenElement && globalThis.document.exitFullscreen)
      )
        globalThis.document.exitFullscreen();
      if (mode) this.fullscreenTarget.requestFullscreen();
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
customElements.define(FullscreenBehaviorsEl.tag, FullscreenBehaviorsEl);
export { FullscreenBehaviorsEl, FullscreenBehaviors };
