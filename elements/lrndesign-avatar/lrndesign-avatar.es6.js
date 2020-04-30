import { html, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
/**
 * `lrndesign-avatar`
 * `Visualize a user account eitehr with an image, a label, or as abstract art.`
 * @demo demo/index.html
 * @element lrndesign-avatar
 */
class LrndesignAvatar extends SimpleColors {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
        }
        paper-avatar {
          color: var(--simple-colors-default-theme-grey-1);
          --paper-avatar-width: var(--lrndesign-avatar-width, 40px);
          --paper-avatar-height: var(--lrndesign-avatar-height, 40px);
          --paper-avatar-text-color: var(--simple-colors-default-theme-grey-1);
        }
      `
    ];
  }
  constructor() {
    super();
    import("@lrnwebcomponents/paper-avatar/paper-avatar.js");
    this.label = "avatar";
    this.twoChars = false;
    this.color = "blue";
    this.jdenticon = false;
  }
  render() {
    return html`
      <paper-avatar
        label="${this.label}"
        src="${this.src}"
        ?two-chars="${this.twoChars}"
        style="background-color:${this.hexColor} !important;"
        ?jdenticon="${this.jdenticon}"
      ></paper-avatar>
    `;
  }

  static get tag() {
    return "lrndesign-avatar";
  }

  _getAccentColor(color) {
    // legacy API bridge
    color = color.replace("-text", "");
    if (
      (!this.accentColor || this.accentColor === "grey") &&
      this.colors[color]
    ) {
      this.accentColor = color;
    }
  }
  _getHexColor(color) {
    let name = color.replace("-text", "");
    let tmp = new SimpleColors();
    if (tmp.colors[name]) {
      return tmp.colors[name][6];
    }
    return "#000000";
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "color") {
        this._getAccentColor(this[propName]);
      }
      if (propName == "accentColor") {
        this.hexColor = this._getHexColor(this[propName]);
      }
    });
  }
  static get properties() {
    return {
      ...super.properties,
      hexColor: {
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
       * Color class work to apply
       */
      color: {
        type: String,
        reflect: true
      },
      /**
       * Form abstract art from hash of label
       */
      jdenticon: {
        type: Boolean
      }
    };
  }
}
window.customElements.define(LrndesignAvatar.tag, LrndesignAvatar);
export { LrndesignAvatar };
