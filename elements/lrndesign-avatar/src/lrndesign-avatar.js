/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from 'lit-element';
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/paper-avatar/paper-avatar.js";

/**
 * `lrndesign-avatar`
 * `Visualize a user account either with an image, a label, or as abstract art.`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */
class LrndesignAvatar extends SimpleColors {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  tag() {
    return "lrndesign-avatar";
  }

  // life cycle
  constructor() {
    super();
    this.tag = LrndesignAvatar.tag;
    import("@lrnwebcomponents/paper-avatar/paper-avatar.js");
    this.label = "|";
    this.twoChars = false;
    this.color = "blue";
    this.jdenticon = false;
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    
  }

  _getAccentColor(color) {
    // legacy API bridge
    color = color.replace("-text", "");
    if (this.colors[color] && (!this.accentColor || this.accentColor === "grey")) {
      this.accentColor = this.color;
    }
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "color") {
        this._getAccentColor(this[propName]);
      }
    });
  }
  
}
customElements.define("lrndesign-avatar", LrndesignAvatar);
export { LrndesignAvatar };
