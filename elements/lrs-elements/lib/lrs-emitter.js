/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement } from "lit-element/lit-element.js";
import { IntersectionObserver } from "@lrnwebcomponents/intersection-element/lib/IntersectionObserverMixin.js";
/**
 * `lrs-emitter`
 * `Emit learning statements occuring in your app.`
 * @demo demo/index.html
 */
class LrsEmitter extends IntersectionObserver(LitElement) {
  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Lrs emitter",
        description: "Emit learning statements occuring in your app.",
        icon: "icons:android",
        color: "green",
        groups: ["Emitter"],
        handles: [
          {
            type: "todo:read-the-docs-for-usage",
          },
        ],
        meta: {
          author: "elmsln",
          owner: "Penn State",
        },
      },
      settings: {
        quick: [],
        configure: [
          {
            property: "verb",
            description: "",
            inputMethod: "textfield",
            required: false,
            icon: "icons:android",
          },
        ],
        advanced: [],
      },
    };
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      verb: {
        type: String,
      },
      object: {
        type: String,
      },
      event: {
        type: String,
      },
    };
  }

  constructor() {
    super();
    this.verb = "";
    this.event = "click";
    this.object = "";
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (
        propName == "elementVisible" &&
        this.elementVisible &&
        this.event == "view"
      ) {
        this._viewEventHandler();
      }
      if (this.event == "click") {
        this.addEventListener("click", this._clickEventHandler.bind(this));
      }
    });
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "lrs-emitter";
  }

  _clickEventHandler(e) {
    this.dispatchEvent(
      new CustomEvent("lrs-emitter", {
        bubbles: true,
        cancelable: true,
        detail: {
          verb: this.verb,
          object: this.object,
        },
      })
    );
  }

  _viewEventHandler() {
    this.dispatchEvent(
      new CustomEvent("lrs-emitter", {
        bubbles: true,
        cancelable: true,
        detail: {
          verb: this.verb,
          object: this.object,
        },
      })
    );
  }

  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(LrsEmitter.tag, LrsEmitter);
export { LrsEmitter };
