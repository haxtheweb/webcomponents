/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit-element";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/paper-avatar/paper-avatar.js";
/**
 * `lrndesign-avatar`
 * Visualize a user account either with an image, icon, initials, or as abstract art.
 *
### Styling
Custom property | Description | Default
----------------|-------------|----------
`--lrndesign-avatar-width` | Size (width and height) of the avatar image | 40px
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
  static get tag() {
    return "lrndesign-avatar";
  }

  // life cycle
  constructor() {
    super();
    this.dark = false;
    this.twoChars = false;
    this.jdenticon = false;
    this.label = "|";
  }

  _getAccentColor() {
    // legacy API bridge
    if (this.colors && (!this.accentColor || this.accentColor === "grey")) {
      let color = (this.color || "").replace("-text", "");
      if (color && this.colors[color]) {
        this.accentColor = color;
      } else {
        let str = this.label || this.icon,
          char =
            str && str.charCodeAt(0)
              ? str.charCodeAt(0)
              : Math.floor(Math.random() * 16),
          colors = Object.keys(this.colors);
        color = colors[(char % 16) + 1];
        this.accentColor =
          colors[(char % 16) + 1] ||
          colors[Math.floor(Math.random() * this.colors.length)];
      }
    }
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "color" || propName == "label" || propName == "icon") {
        this._getAccentColor();
      }
    });
  }
}

customElements.define(LrndesignAvatar.tag, LrndesignAvatar);
export { LrndesignAvatar };
