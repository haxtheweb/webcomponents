/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icon/iron-icon.js";
import "@lrnwebcomponents/materializecss-styles/materializecss-styles.js";

/**
 * `lrn-button`
 * @customElement lrn-button
 * `Simple button wrapper with a few options`
 *
 * @microcopy - language worth noting:
 *  -
 *

 * @polymer
 * @demo demo/index.html
 */
class LrnButton extends PolymerElement {
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
    import("@polymer/paper-button/paper-button.js");
    import("@polymer/paper-tooltip/paper-tooltip.js");
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    afterNextRender(this, function() {
      this.addEventListener("mousedown", this.tapEventOn);
      this.addEventListener("mouseover", this.tapEventOn);
      this.addEventListener("mouseout", this.tapEventOff);
      this.shadowRoot
        .querySelector("#button")
        .addEventListener("focused-changed", this.focusToggle);
    });
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    this.removeEventListener("mousedown", this.tapEventOn);
    this.removeEventListener("mouseover", this.tapEventOn);
    this.removeEventListener("mouseout", this.tapEventOff);
    this.shadowRoot
      .querySelector("#button")
      .removeEventListener("focused-changed", this.focusToggle);
    super.disconnectedCallback();
  }
  /**
   * Go to the href if the button isn't disabled
   */
  ready() {
    super.ready();
    if (!this.disabled) {
      this.showHref = this.href;
    }
  }

  /**
   * Class processing on un-tap / hover
   */
  tapEventOn(e) {
    let root = this;
    if (typeof root.hoverClass !== typeof undefined && !root.disabled) {
      // break class into array
      var classes = root.hoverClass.split(" ");
      // run through each and add or remove classes
      classes.forEach(function(item, index) {
        if (item != "") {
          root.shadowRoot.querySelector("#button").classList.add(item);
          if (item.indexOf("-") != -1) {
            root.shadowRoot.querySelector("#icon").classList.add(item);
          }
        }
      });
    }
  }

  /**
   * Undo class processing on un-tap / hover
   */
  tapEventOff(e) {
    let root = this;
    if (typeof root.hoverClass !== typeof undefined && !root.disabled) {
      // break class into array
      var classes = root.hoverClass.split(" ");
      // run through each and add or remove classes
      classes.forEach(function(item, index) {
        if (item != "") {
          root.shadowRoot.querySelector("#button").classList.remove(item);
          if (item.indexOf("-") != -1) {
            root.shadowRoot.querySelector("#icon").classList.remove(item);
          }
        }
      });
    }
  }

  /**
   * Handle toggle for mouse class and manage classList array for paper-button.
   */
  focusToggle(e) {
    let root = this;
    this.dispatchEvent(
      new CustomEvent("focus-changed", {
        bubbles: true,
        composed: true,
        detail: { focus: root.focusState }
      })
    );
    // see if it has hover classes
    if (typeof root.hoverClass !== typeof undefined && !root.disabled) {
      // break class into array
      var classes = root.hoverClass.split(" ");
      // run through each and add or remove classes
      classes.forEach(function(item, index) {
        if (item != "") {
          if (root.focusState) {
            root.shadowRoot.querySelector("#button").classList.add(item);
            if (item.indexOf("-") != -1) {
              root.shadowRoot.querySelector("#icon").classList.add(item);
            }
          } else {
            root.shadowRoot.querySelector("#button").classList.remove(item);
            if (item.indexOf("-") != -1) {
              root.shadowRoot.querySelector("#icon").classList.remove(item);
            }
          }
        }
      });
    }
    root.focusState = !root.focusState;
  }
}
window.customElements.define(LrnButton.tag, LrnButton);
export { LrnButton };
