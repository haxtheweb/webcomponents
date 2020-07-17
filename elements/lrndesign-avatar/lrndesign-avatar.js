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
  //styles function
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
          margin: 0;
          padding: 0;
        }

        :host([hidden]) {
          display: none;
        }

        paper-avatar {
          border-radius: 50%;
          --paper-avatar-width: var(--lrndesign-avatar-width, 40px);
          --paper-avatar-color: var(
            --simple-colors-default-theme-accent-8,
            #444
          );
          --paper-avatar-text-color: var(
            --simple-colors-default-theme-grey-1,
            #fff
          );
          max-height: var(--lrndesign-avatar-width, 40px);
        }
      `
    ];
  }

  // render function
  render() {
    return html`
      <paper-avatar
        .label="${this.label || ""}"
        .icon="${this.icon || ""}"
        .src="${this.src || ""}"
        ?two-chars="${this.twoChars}"
        ?jdenticon="${this.jdenticon}"
      ></paper-avatar>
    `;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: false,
      canPosition: false,
      canEditSource: false,
      gizmo: {
        title: "Avatar",
        description:
          "Visualize a user account either with an image, icon, initials, or as abstract art.",
        icon: "image:collections",
        color: "yellow",
        groups: ["Media", "Image"],
        handles: [
          {
            type: "image",
            source: "image"
          }
        ],
        meta: {
          author: "ELMS:LN"
        }
      },
      settings: {
        quick: [
          {
            property: "accentColor",
            title: "Accent Color",
            description: "Pick an accent color.",
            inputMethod: "colorpicker"
          },
          {
            property: "dark",
            title: "Dark",
            description: "Use dark text (and light background) for avatar.",
            inputMethod: "boolean"
          },
          {
            property: "icon",
            title: "Icon",
            description: "Optional: Pick an icon for avatar.",
            inputMethod: "iconpicker"
          },
          {
            property: "src",
            title: "Image Source",
            description: "Optional: Upload an image for avatar.",
            inputMethod: "haxupload"
          }
        ],
        configure: [
          {
            property: "accentColor",
            title: "Accent Color",
            description: "Pick an accent color.",
            inputMethod: "colorpicker"
          },
          {
            property: "dark",
            title: "Dark",
            description: "Use dark text (and light background) for avatar.",
            inputMethod: "boolean"
          },
          {
            property: "icon",
            title: "Icon",
            description: "Optional: Pick an icon for avatar.",
            inputMethod: "iconpicker"
          },
          {
            property: "src",
            title: "Image Source",
            description: "Optional: Upload an image for avatar.",
            inputMethod: "haxupload"
          },
          {
            property: "label",
            title: "Two-character initials",
            description: "Label used to create initials or unique Jdenticon.",
            inputMethod: "textfield"
          },
          {
            property: "twoChars",
            title: "Two-character initials",
            description:
              "When no Jdenticon, image, or icon, use two-character for initials.",
            inputMethod: "boolean"
          },
          {
            property: "jdenticon",
            title: "Jdenticon",
            description: "Optional: Unique icon design based on label.",
            inputMethod: "boolean"
          }
        ],
        advanced: []
      }
    };
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      /**
       * optional iron-icon
       */
      icon: {
        type: String
      },
      /**
       * text to use for avatar
       */
      label: {
        type: String
      },
      /**
       * link to an image, optional
       */
      src: {
        type: String
      },
      /**
       * Mode for presenting 1st two letters
       */
      twoChars: {
        type: Boolean,
        attribute: "two-chars"
      },
      /**
       * "Deprecated": Color class work to apply
       */
      color: {
        type: String
      },
      /**
       * Form abstract art from hash of label
       */
      jdenticon: {
        type: Boolean
      }
    };
  }

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
