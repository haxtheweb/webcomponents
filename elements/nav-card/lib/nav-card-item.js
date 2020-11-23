/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/lrndesign-avatar/lrndesign-avatar.js";
/**
 * `nav-card-item`
 * links fr the nav card
### Styling

`<nav-card-item>` provides the following custom properties
for styling:

Custom property | Description | Default
----------------|-------------|----------
`--nav-card-item-background-color` | item's default background-color | unset
`--nav-card-item-color` | item's default teext color | unset
`--nav-card-item-label-font-weight` | item's default font-weight | bold
`--nav-card-linklist-border-bottom` | item's border-bottom | 1px solid var(--simple-colors-default-theme-grey-4)
`--nav-card-item-label-font-size` | item's default font-size | inherit
`--nav-card-item-label-font-weight` | item's default font-weight | bold
`--nav-card-item-label-font-size` | item description's default font-weight | 11px
`--nav-card-item-label-font-weight` | item description's default font-wight | normal
`--nav-card-item-avatar-size` | default size for item's avatar | 36px
`--nav-card-item-avatar-width` | default width for item's avatar | --nav-card-item-avatar-size
`--nav-card-item-avatar-height` | default height for item's avatar | --nav-card-item-avatar-size
`--nav-card-item-icon-size` | default size for item's icon | 24px
`--nav-card-item-icon-width` | default width for item's icon | --nav-card-item-icon-size
`--nav-card-item-icon-height` | default height for item's icon | --nav-card-item-icon-size
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
       * optional accent-color for avatar
       */
      accentColor: {
        type: String,
        attribute: "accent-color",
      },
      /**
       * allow grey instead of accent color, default selects a color
       */
      allowGrey: {
        type: Boolean,
        attribute: "allow-grey",
      },
      /**
       * optional simple-icon or image URI as avatar on left of link
       */
      avatar: {
        type: String,
        attribute: "avatar",
      },
      /**
       * optional dark text for avatar icon
       */
      dark: {
        type: Boolean,
        attribute: "dark",
      },
      /**
       * simple-icon on right of link
       */
      icon: {
        type: String,
        attribute: "icon",
      },
      /**
       * optional use up to two initials if no avatar
       */
      initials: {
        type: String,
        attribute: "initials",
      },
      /**
       * invert icon coloring
       */
      invert: {
        type: Boolean,
        attribute: "invert",
      },
    };
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: true,
      gizmo: {
        title: "Nav card",
        description: "an accent card of link lists",
        icon: "av:playlist-play",
        color: "pink",
        groups: ["Card", "Nav", "List"],
        handles: [
          {
            type: "todo:read-the-docs-for-usage",
          },
        ],
        meta: {
          author: "nikkimk",
          owner: "The Pennsylvania State University",
        },
      },
      settings: {
        configure: [
          {
            property: "accentColor",
            title: "Accent Color",
            description: "Select an accent color.",
            inputMethod: "colorpicker",
            required: false,
          },
          {
            property: "dark",
            title: "Dark",
            description: "Display the card as dark theme?",
            inputMethod: "boolean",
            required: false,
          },
          {
            property: "icon",
            title: "Icon",
            description: "Select an icon.",
            inputMethod: "iconpicker",
            required: false,
          },
          {
            property: "initials",
            title: "Initials",
            description: "Initials to display if there is no icon.",
            inputMethod: "textfield",
            required: false,
          },
          {
            property: "avatar",
            title: "Avatar Image",
            description: "Select an image",
            inputMethod: "haxupload",
            required: false,
          },
          {
            slot: "label",
            title: "Button or Link",
            inputMethod: "code-editor",
            required: false,
          },
          {
            slot: "description",
            title: "Additional description",
            inputMethod: "code-editor",
            required: false,
          },
        ],
        advanced: [
          {
            property: "allowGrey",
            title: "Allow Grey",
            description:
              "Allows grey if set. Otherwise a color will be assigned.",
            inputMethod: "boolean",
          },
          {
            property: "avatar",
            title: "Avatar Icon",
            description: "Select an icon.",
            inputMethod: "iconpicker",
            required: false,
          },
          {
            property: "invert",
            title: "Invert",
            description: "Inverts icon coloring.",
            inputMethod: "boolean",
          },
        ],
      },
    };
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
          color: var(--nav-card-item-color, unset);
          background-color: var(--nav-card-item-background-color, unset);
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
          color: var(--nav-card-item-color, unset);
          background-color: var(--nav-card-item-background-color, unset);
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
          --lrndesign-avatar-width: var(
            --nav-card-item-avatar-width,
            var(--nav-card-item-avatar-size, 36px)
          );
          --lrndesign-avatar-height: var(
            --nav-card-item-avatar-height,
            var(--nav-card-item-avatar-size, 36px)
          );
          --lrndesign-avatar-border-radius: var(
            --nav-card-item-avatar-border-radius,
            50%
          );
        }
        simple-icon {
          margin-left: 10px;
          --simple-icon-width: var(
            --nav-card-item-icon-width,
            var(--nav-card-item-icon-size, 24px)
          );
          --simple-icon-height: var(
            --nav-card-item-icon-height,
            var(--nav-card-item-icon-size, 24px)
          );
          --simple-icon-color: var(--nav-card-item-icon-color, currentColor);
        }
      `,
    ];
  }

  render() {
    return html`
      ${!this.avatar && !this.initials
        ? ``
        : html`
            <lrndesign-avatar
              .accentColor="${this.accentColor || ""}"
              ?allow-grey="${this.allowGrey}"
              ?dark="${this.dark}"
              .icon="${this.ico}"
              ?invert="${this.invert}"
              .src="${this.src}"
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
        : html` <simple-icon icon="${this.icon}"></simple-icon> `}
    `;
  }

  // life cycle
  constructor() {
    super();
    this.tag = NavCardItem.tag;
    this.accentColor = "grey";
    this.allowGrey = false;
    this.dark = false;
    this.invert = false;
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
    return this.avatar && !this._validURL(this.avatar) ? this.avatar : "";
  }
  /**
   * gets the avatar src
   *
   * @readonly
   * @memberof NavCardItem
   */
  get src() {
    return this.avatar && this._validURL(this.avatar) ? this.avatar : "";
  }
  /**
   * determines if avatar is an image or an icon
   * See https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
   *
   * @param {string} str
   * @returns {boolean}
   * @memberof NavCardItem
   */
  _validURL(str) {
    console.log();
    let pattern = new RegExp(
      "^((https?:)?\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(data:image)?" + // base64 image
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(str);
  }
}
customElements.define("nav-card-item", NavCardItem);
export { NavCardItem };
