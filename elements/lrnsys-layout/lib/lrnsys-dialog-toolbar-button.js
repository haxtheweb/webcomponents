import { LitElement, html, css } from "lit-element/lit-element.js";
class LrnsysDialogToolbarButton extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: inline-block;
        }
        iron-icon {
          display: inline-block;
          height: 16px;
          width: 16px;
        }
      `,
    ];
  }
  /**
   * LitElement render
   */
  render() {
    return html`
      <paper-button
        raised
        @click="${this._onTap}"
        id="${this.id}"
        aria-label="${this.title}"
      >
        <iron-icon icon="${this.icon}"></iron-icon> ${this.title}
      </paper-button>
      <simple-tooltip for="${this.id}" animation-delay="0"
        >${this.title}</simple-tooltip
      >
    `;
  }
  static get tag() {
    return "lrnsys-dialog-toolbar-button";
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    import("@polymer/paper-button/paper-button.js");
    import("@polymer/iron-icon/iron-icon.js");
    import("@polymer/iron-icons/iron-icons.js");
    import("@lrnwebcomponents/simple-tooltip/simple-tooltip.js");
  }
  /**
   * LitElement / popular convention
   */
  static get properties() {
    return {
      /**
       * The title of the button.
       */
      title: {
        type: String,
      },
      /**
       * The button icon.
       */
      icon: {
        type: String,
      },
      /**
       * The button ID.
       */
      id: {
        type: String,
      },
    };
  }

  /**
   * Ready lifecycle
   */
  firstUpdated(changedProperties) {
    this.dispatchEvent(
      new CustomEvent("button-initialized", {
        detail: { id: this.id },
      })
    );
  }

  /**
   * Button has been tapped.
   */
  _onTap(e) {
    this.dispatchEvent(
      new CustomEvent("dialog-toolbar-button-tapped", {
        detail: { id: e.target.getAttribute("id") },
      })
    );
  }
}
window.customElements.define(
  LrnsysDialogToolbarButton.tag,
  LrnsysDialogToolbarButton
);
export { LrnsysDialogToolbarButton };
