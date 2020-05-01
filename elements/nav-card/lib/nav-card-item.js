/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-icons/iron-icons.js";
import "@lrnwebcomponents/lrndesign-avatar/lrndesign-avatar.js";
/**
 * `nav-card-item`
 * links fr the nav card
 *
 * @customElement nav-card-item
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */
class NavCardItem extends LitElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "nav-card-item";
  }
  static get properties() {
    return {
      /**
       * optional iron-icon or image URI as avatar on left of link
       */
      avatar: {
        type: String,
        attribute: "avatar"
      },
      /**
       * iron-icon on right of link
       */
      icon: {
        type: String,
        attribute: "icon"
      },
      /**
       * optional accent-color for avatar
       */
      accentColor: {
        type: String,
        attribute: "accent-color"
      },
      /**
       * optional dark text for avatar icon
       */
      dark: {
        type: Boolean,
        attribute: "dark"
      },
      /**
       * optional use up to two initials if no avatar
       */
      initials: {
        type: String,
        attribute: "initials"
      }
    };
  }

  // haxProperty definition
  static get haxProperties() {
    return {
  "canScale": true,
  "canPosition": true,
  "canEditSource": false,
  "gizmo": {
    "title": "Nav card",
    "description": "an accent card of link lists",
    "icon": "av:playlist-play",
    "color": "pink",
    "groups": ["Card", "Nav", "List"],
    "handles": [
      {
        "type": "todo:read-the-docs-for-usage"
      }
    ],
    "meta": {
      "author": "nikkimk",
      "owner": "The Pennsylvania State University"
    }
  },
  "settings": {
    "quick": [],
    "configure": [
      {
        "property": "accentColor",
        "title": "Accent Color",
        "description": "Select an accent color.",
        "inputMethod": "colorpicker",
        "required": false
      },
      {
        "property": "Dark",
        "title": "Dark",
        "description": "Display the card as dark theme?",
        "inputMethod": "boolean",
        "required": false
      },
      {
        "property": "avatar",
        "title": "Image",
        "description": "Upload an Image",
        "inputMethod": "haxupload",
        "required": false
      },
      {
        "property": "icon",
        "title": "Icon",
        "description": "Select an icon.",
        "inputMethod": "iconpicker",
        "required": false
      },
      {
        "slot": "label",
        "title": "Button or Link",
        "inputMethod": "code-editor",
        "required": false
      },
      {
        "slot": "description",
        "title": "Additional description",
        "inputMethod": "code-editor",
        "required": false
      }
    ],
    "advanced": [
      {
        "property": "avatar",
        "title": "Icon",
        "description": "Select an icon",
        "inputMethod": "iconpicker",
        "required": false
      }
    ]
  }
}
;
  }

  static get styles() {
    return [
      css`
        :host {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-decoration: none;
          padding: 5px 0;
          margin-bottom: 1px;
          border-bottom: var(
            --nav-card-linklist-border-bottom,
            1px solid var(--simple-colors-default-theme-grey-4, #666)
          );
        }
        :host(:last-of-type) {
          border-bottom: none;
        }
        :host([hidden]) {
          display: none;
        }
        :host div {
          flex: 1 1 auto;
        }
        ::slotted([slot="label"]:hover),
        ::slotted([slot="label"]:focus),
        :host(:hover) ::slotted([slot="label"]),
        :host(:focus-within) ::slotted([slot="label"]) {
          text-decoration: underline;
        }
        ::slotted(*) {
          display: block;
        }
        ::slotted([slot="label"]),
        ::slotted([slot="description"]) {
          color: inherit;
          font-family: inherit;
        }
        ::slotted([slot="label"]) {
          text-decoration: inherit;
          outline: none;
          border: none;
          padding: 0;
          text-align: left;
          font-size: var(--nav-card-item-label-font-size, inherit);
          font-weight: var(--nav-card-item-label-font-weight, bold);
        }
        ::slotted([slot="description"]) {
          font-size: var(--nav-card-item-label-font-size, 11px);
          font-weight: var(--nav-card-item-label-font-weight, normal);
        }
        ::slotted([slot="label"]):after {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
        }
        ::slotted([slot="label"]:focus):after {
          outline: 1px solid blue;
        }
        lrndesign-avatar {
          margin-right: 10px;
          width: var(
            --nav-card-item-avatar-width,
            var(--nav-card-item-avatar-size)
          );
          height: var(
            --nav-card-item-avatar-height,
            var(--nav-card-item-avatar-size)
          );
          --lrndesign-avatar-width: var(
            --nav-card-item-avatar-width,
            var(--nav-card-item-avatar-size)
          );
          --lrndesign-avatar-height: var(
            --nav-card-item-avatar-height,
            var(--nav-card-item-avatar-size)
          );
        }
        iron-icon {
          margin-left: 10px;
          width: var(
            --nav-card-item-icon-width,
            var(--nav-card-item-icon-size)
          );
          height: var(
            --nav-card-item-icon-height,
            var(--nav-card-item-icon-size)
          );
          --lrndesign-icon-width: var(
            --nav-card-item-icon-width,
            var(--nav-card-item-icon-size)
          );
          --lrndesign-icon-height: var(
            --nav-card-item-icon-height,
            var(--nav-card-item-icon-size)
          );
        }
      `
    ];
  }

  render() {
    return html`
      ${!this.avatar && !this.initials
        ? ``
        : html`
            <lrndesign-avatar
              .accentColor="${this.accentColor || ""}"
              ?dark="${this.dark}"
              .icon="${this.ico || ""}"
              .src="${this.src || ""}"
              .label="${this.label}"
              ?two-chars="${this.twoChars}"
            >
            </lrndesign-avatar>
          `}
      <div>
        <slot name="label"></slot>
        <slot name="description"></slot>
      </div>
      ${!this.icon
        ? ``
        : html`
            <iron-icon icon="${this.icon}"></iron-icon>
          `}
    `;
  }

  // life cycle
  constructor() {
    super();
    this.tag = NavCardItem.tag;
    this.accentColor = "grey";
    this.dark = false;
  }
  /**
   * gets the avatar icon
   *
   * @readonly
   * @memberof NavCardItem
   */
  get twoChars() {
    return this.label && this.label.split(/\s*/).length > 1;
  }
  /**
   * gets the avatar icon
   *
   * @readonly
   * @memberof NavCardItem
   */
  get label() {
    let parts = this.initials && this.initials.split(" ");
    return parts && parts[0]
      ? `${parts[0][0]} ${parts[1] ? parts[1][0] : parts[0][1] || ``}}`
      : this.initials;
  }
  /**
   * gets the avatar icon
   *
   * @readonly
   * @memberof NavCardItem
   */
  get ico() {
    return this.avatar && this.avatar.indexOf(".") < 0 ? this.avatar : "";
  }
  /**
   * gets the avatar src
   *
   * @readonly
   * @memberof NavCardItem
   */
  get src() {
    return this.avatar && this.avatar.indexOf(".") > -1 ? this.avatar : "";
  }
}
customElements.define("nav-card-item", NavCardItem);
export { NavCardItem };
