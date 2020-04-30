import { html, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
/**
 * `lrndesign-avatar`
 * `Visualize a user account either with an image, a label, or as abstract art.`
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
          --paper-avatar-width: var(--lrndesign-avatar-width, 40px);
          --paper-avatar-height: var(--lrndesign-avatar-height, 40px);
          --paper-avatar-bgcolor: var(--lrndesign-avatar-bg, var(--simple-colors-default-theme-accent-1, #000));
          --paper-avatar-text-color: var(--lrndesign-avatar-color, var(--simple-colors-default-theme-grey-12, #fff));
        }
        paper-avatar {
          color: var(--lrndesign-avatar-color, var(--simple-colors-default-theme-grey-1, #fff));
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
        ?jdenticon="${this.jdenticon}"
      ></paper-avatar>
    `;
  }

  static get tag() {
    return "lrndesign-avatar";
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * Deprecated: Approximated hex color work to apply
       */
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
       * Deprecated: Color class work to apply
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

  _getAccentColor(color) {
    // legacy API bridge
    color = color.replace("-text", "");
    if (this.colors[color]) {
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
      if (propName == "hexColor") {
        console.log(parseInt(this.hexColor.replace('#','')),this.colors);
      }
    });
  }
}
window.customElements.define(LrndesignAvatar.tag, LrndesignAvatar);
export { LrndesignAvatar };
