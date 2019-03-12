/**
 * Copyright 2019 PSU
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
export { LrsEmitter };
/**
 * `lrs-emitter`
 * `Emit learning statements occuring in your app.`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class LrsEmitter extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "lrs-emitter";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.HAXWiring = new HAXWiring();
    this.HAXWiring.setup(LrsEmitter.haxProperties, LrsEmitter.tag, this);

    // look at the event type and bind js listeners
    if (typeof this.event !== "undefined" || this.event !== "") {
      /**
       * add click event listener
       */
      if (this.event === "click") {
        this.addEventListener("click", this._clickEventHandler.bind(this));
      }
      /**
       * add intersection observer for the view option
       */
      if (this.event === "view") {
        const options = {
          root: null,
          rootMargin: "0px",
          threshold: 1.0
        };
        this._observer = new IntersectionObserver(
          this._viewEventHandler.bind(this),
          options
        );
        this._observer.observe(this);
      }
    }
  }

  /**
   * Remove and disconnect any listeners
   */
  disconnectedCallback() {
    this.removeEventListener("click", this._clickEventHandler.bind(this));
    this._observer.disconnect();
  }

  _clickEventHandler(e) {
    this.dispatchEvent(
      new CustomEvent("lrs-emitter", {
        bubbles: true,
        cancelable: true,
        detail: {
          verb: this.verb,
          object: this.object
        }
      })
    );
  }

  _viewEventHandler(e) {
    this.dispatchEvent(
      new CustomEvent("lrs-emitter", {
        bubbles: true,
        cancelable: true,
        detail: {
          verb: this.verb,
          object: this.object
        }
      })
    );
  }

  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(LrsEmitter.tag, LrsEmitter);
