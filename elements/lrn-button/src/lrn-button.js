/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { materialCssStyles } from "@lrnwebcomponents/materializecss-styles/lib/colors.js";

/**
 * `lrn-button`
 * `Simple button wrapper with a few options`
 * @demo demo/index.html
 * @customElement lrn-button
 */
class LrnButton extends LitElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "lrn-button";
  }
  constructor() {
    super();
    this.href = "#";
    this.label = "";
    this.target = "";
    this.disabled = false;
    this.focusState = false;
    setTimeout(() => {
      this.addEventListener("mousedown", this.tapEventOn);
      this.addEventListener("mouseover", this.tapEventOn);
      this.addEventListener("mouseout", this.tapEventOff);
      this.addEventListener("focusin", this.tapEventOn);
      this.addEventListener("focusout", this.tapEventOff);
      import("@polymer/paper-button/paper-button.js");
      import("@polymer/paper-tooltip/paper-tooltip.js");
      import("@polymer/iron-icons/iron-icons.js");
      import("@polymer/iron-icon/iron-icon.js");
    }, 0);
  }
  firstUpdated() {
    this.shadowRoot
      .querySelector("#button")
      .addEventListener("focused-changed", this.focusToggle);
    if (!this.disabled) {
      this.showHref = this.href;
    }
  }

  /**
   * Class processing on un-tap / hover
   */
  tapEventOn(e) {
    if (typeof this.hoverClass !== typeof undefined && !this.disabled) {
      // break class into array
      var classes = this.hoverClass.split(" ");
      // run through each and add or remove classes
      classes.forEach((item, index) => {
        if (item != "") {
          this.shadowRoot.querySelector("#button").classList.add(item);
          if (item.indexOf("-") != -1) {
            this.shadowRoot.querySelector("#icon").classList.add(item);
          }
        }
      });
    }
  }

  /**
   * Undo class processing on un-tap / hover
   */
  tapEventOff(e) {
    if (typeof this.hoverClass !== typeof undefined && !this.disabled) {
      // break class into array
      var classes = this.hoverClass.split(" ");
      // run through each and add or remove classes
      classes.forEach((item, index) => {
        if (item != "") {
          this.shadowRoot.querySelector("#button").classList.remove(item);
          if (item.indexOf("-") != -1) {
            this.shadowRoot.querySelector("#icon").classList.remove(item);
          }
        }
      });
    }
  }

  /**
   * Handle toggle for mouse class and manage classList array for paper-button.
   */
  focusToggle(e) {
    this.dispatchEvent(
      new CustomEvent("focus-changed", {
        bubbles: true,
        composed: true,
        detail: { focus: this.focusState }
      })
    );
    // see if it has hover classes
    if (typeof this.hoverClass !== typeof undefined && !this.disabled) {
      // break class into array
      var classes = this.hoverClass.split(" ");
      // run through each and add or remove classes
      classes.forEach((item, index) => {
        if (item != "") {
          if (this.focusState) {
            this.shadowRoot.querySelector("#button").classList.add(item);
            if (item.indexOf("-") != -1) {
              this.shadowRoot.querySelector("#icon").classList.add(item);
            }
          } else {
            this.shadowRoot.querySelector("#button").classList.remove(item);
            if (item.indexOf("-") != -1) {
              this.shadowRoot.querySelector("#icon").classList.remove(item);
            }
          }
        }
      });
    }
    this.focusState = !this.focusState;
  }
}
window.customElements.define(LrnButton.tag, LrnButton);
export { LrnButton };
