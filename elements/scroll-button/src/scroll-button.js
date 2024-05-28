/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
/**
 * `scroll-button`
 * `button to scroll to an area or back to top`
 * @demo demo/index.html
 * @element scroll-button
 */
class ScrollButton extends LitElement {
  constructor() {
    super();
    this.icon = "icons:expand-less";
    this.t = {
      backToTop: "Back to top",
    };
    globalThis.dispatchEvent(
      new CustomEvent("i18n-manager-register-element", {
        detail: {
          context: this,
          namespace: "scroll-button",
          localesPath:
            new URL("./locales/scroll-button.es.json", import.meta.url).href +
            "/../",
          updateCallback: "render",
          locales: ["es"],
        },
      }),
    );
    this._label = this.t.backToTop;
    this.label = "";
    this.position = "top";
    import("@haxtheweb/simple-tooltip/simple-tooltip.js");
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "scroll-button";
  }
  //styles function
  static get styles() {
    return [
      css`
        :host {
          display: block;
          --scroll-button-z-index: 99;
          z-index: var(--scroll-button-z-index);
        }

        :host([hidden]) {
          display: none;
        }

        simple-icon-button-lite {
          background-color: var(
            --scroll-button-background-color,
            rgba(0, 0, 0, 0.6)
          );
          color: var(--scroll-button-color, white);
        }

        simple-icon-button-lite:hover,
        simple-icon-button-lite:active,
        simple-icon-button-lite:focus {
          color: var(--scroll-button-background-color, rgba(0, 0, 0, 1));
          background-color: var(--scroll-button-color, white);
        }

        simple-tooltip {
          --simple-tooltip-background: var(
            --scroll-button-tooltip-background-color,
            #000000
          );
          --simple-tooltip-opacity: 1;
          --simple-tooltip-text-color: var(
            --scroll-button-tooltip-color,
            #ffffff
          );
          --simple-tooltip-delay-in: 0;
          --simple-tooltip-border-radius: 0;
        }
      `,
    ];
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldvalue, propName) => {
      // if other developer defined label, don't translate it
      if (propName === "t" && this.label === "") {
        this._label = this.t.backToTop;
      }
      if (propName === "label" && this.label !== "") {
        this._label = this.label;
      }
    });
  }
  // render function
  render() {
    return html` <simple-icon-button-lite
        @click="${this.scrollEvent}"
        id="btn"
        icon="${this.icon}"
        label="${this._label}"
      ></simple-icon-button-lite>
      <simple-tooltip for="btn" position="${this.position}" offset="14">
        ${this._label}
      </simple-tooltip>`;
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      target: {
        type: Object,
      },
      icon: {
        type: String,
      },
      label: {
        type: String,
      },
      _label: {
        type: String,
      },
      position: {
        type: String,
      },
      t: {
        type: Object,
      },
    };
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  scrollEvent(e) {
    if (this.target) {
      this.target.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    } else {
      globalThis.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }
}
customElements.define(ScrollButton.tag, ScrollButton);
export { ScrollButton };
