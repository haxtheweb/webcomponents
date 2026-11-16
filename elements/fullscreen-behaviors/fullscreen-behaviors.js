/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html } from "lit";

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
      this.__documentFullscreenChange = this._handleFullscreenChange.bind(this);
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

    /**
     * whether fullscreenTarget is the full screen element. Asks the
     * target's own root (document or shadow root): document.fullscreenElement
     * is retargeted to the outermost shadow host, so it never equals a
     * target that lives inside a shadow root.
     *
     * @returns {boolean}
     */
    _isFullscreenTarget() {
      const target = this.fullscreenTarget;
      if (!target) return false;
      const root = target.getRootNode ? target.getRootNode() : null;
      const current =
        root && root.fullscreenElement !== undefined
          ? root.fullscreenElement
          : globalThis.document.fullscreenElement;
      return !!current && current === target;
    }

    _handleFullscreenChange(_e) {
      this.fullscreen = this._isFullscreenTarget();
    }

    toggleFullscreen(mode = !this._isFullscreenTarget()) {
      const doc = globalThis.document;
      if (!mode) {
        // safe to request even when nothing is full screen; exitFullscreen
        // then rejects asynchronously, so quiet that promise
        if (doc.exitFullscreen) {
          const r = doc.exitFullscreen();
          if (r && r.catch) r.catch(() => {});
        }
      } else if (!this._isFullscreenTarget()) {
        // only request when we are not already the fullscreen element so
        // an already-fullscreen target does not race exit against request
        const target = this.fullscreenTarget;
        if (target && target.requestFullscreen) {
          const r = target.requestFullscreen();
          if (r && r.catch) r.catch(() => {});
        }
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
