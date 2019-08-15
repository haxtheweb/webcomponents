import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
/**
 * `lrndesign-avatar`
 * `Visualize a user account eitehr with an image, a label, or as abstract art.`
 * @demo demo/index.html
 */
class LrndesignAvatar extends SimpleColors {
  constructor() {
    super();
    import("@lrnwebcomponents/paper-avatar/paper-avatar.js");
  }
  static get template() {
    return html`
      <style include="simple-colors-shared-styles">
        :host {
          display: block;
        }
        paper-avatar {
          color: var(--simple-colors-default-theme-grey-1);
          background-color: var(--simple-colors-default-theme-accent-8);
          --paper-avatar-width: var(--lrndesign-avatar-width, 40px);
          --paper-avatar-height: var(--lrndesign-avatar-height, 40px);
          --paper-avatar-text-color: var(--simple-colors-default-theme-grey-1);
        }
      </style>
      <paper-avatar
        label="[[label]]"
        src="[[src]]"
        two-chars="[[twoChars]]"
        style$="background-color:[[hexColor]];"
        jdenticon="[[jdenticon]]"
      ></paper-avatar>
    `;
  }

  static get tag() {
    return "lrndesign-avatar";
  }

  _getAccentColor(color) {
    color = color.replace("-text", "");
    if (
      (!this.accentColor || this.accentColor === "grey") &&
      this.colors[color]
    ) {
      this.accentColor = color;
    }
  }

  static get properties() {
    return {
      /**
       * text to use for avatar
       */
      label: {
        type: String,
        value: "lrndesign-avatar"
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
        value: false
      },
      /**
       * Color class work to apply
       */
      color: {
        type: String,
        value: "blue",
        reflectToAttribute: true,
        observer: "_getAccentColor"
      },
      /**
       * Form abstract art from hash of label
       */
      jdenticon: {
        type: Boolean,
        value: false
      }
    };
  }
}
window.customElements.define(LrndesignAvatar.tag, LrndesignAvatar);
export { LrndesignAvatar };
