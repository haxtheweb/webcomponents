import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
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
        simple-icon {
          display: inline-block;
          --simple-icon-height: 16px;
          --simple-icon-width: 16px;
        }
        button {
          border: none;
          background: transparent;
        }
      `,
    ];
  }
  /**
   * LitElement render
   */
  render() {
    return html`
      <button
        raised
        @click="${this._onTap}"
        id="${this.id}"
        aria-label="${this.title}"
      >
        <simple-icon
          icon="${this.icon}"
          accent-color="grey"
          contrast="4"
          dark
        ></simple-icon>
        ${this.title}
      </button>
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
