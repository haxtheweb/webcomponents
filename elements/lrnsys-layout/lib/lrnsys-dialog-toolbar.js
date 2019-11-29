import { LitElement, html, css } from "lit-element/lit-element.js";
class LrnsysDialogToolbar extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          --app-toolbar-primary-height: 40px;
          --app-toolbar-secondary-height: 50px;
          --app-toolbar-secondary-color: var(
            --lrnsys-dialog-secondary-background-color
          );
          --app-toolbar-primary-color: var(
            --lrnsys-dialog-toolbar-background-color
          );
          position: relative;
          margin: 0;
          padding: 0;
        }
        app-toolbar#primary {
          color: var(--lrnsys-dialog-color, #000);
          background-color: var(--app-toolbar-primary-color);
          z-index: 10;
          position: relative;
          height: var(--app-toolbar-primary-height);
        }
        app-toolbar#secondary {
          color: var(--lrnsys-dialog-color, #000);
          background-color: var(--app-toolbar-secondary-color);
          z-index: 5;
          position: absolute;
          width: 100%;
          transform: translateY(-100%);
          transition: all 0.3s ease-in;
          height: var(--app-toolbar-primary-height);
          display: flex;
          justify-content: center;
          padding: 0;
        }
        :host([secondary-visible]) #secondary {
          transform: translateY(0);
          height: var(--app-toolbar-secondary-height);
        }
        .secondary-buttons {
          display: flex;
        }
        .secondary-buttons ::slotted(*) {
          display: inline-flex;
        }
      `
    ];
  }
  /**
   * LitElement render
   */
  render() {
    return html`
      <app-toolbar id="primary">
        <slot name="primary"></slot>
        <div main-title=""></div>
        <lrnsys-dialog-toolbar-button
          icon="close"
          id="close"
          title="close dialog"
        ></lrnsys-dialog-toolbar-button>
      </app-toolbar>
      <app-toolbar id="secondary" .hidden="${!this._secondaryHasChildren}">
        <div class="secondary-buttons">
          <slot name="secondary" id="secondary-slot"></slot>
        </div>
      </app-toolbar>
    `;
  }

  static get tag() {
    return "lrnsys-dialog-toolbar";
  }
  /**
   * LitElement properties / popular convention
   */
  static get properties() {
    return {
      /**
       * Internal state of secondary toolbar
       */
      _secondaryHasChildren: {
        type: Boolean
      }
    };
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this._secondaryHasChildren = false;
    import("@polymer/app-layout/app-toolbar/app-toolbar.js");
    import("./lrnsys-dialog-toolbar-button.js");
    setTimeout(() => {
      this.addEventListener(
        "dialog-toolbar-button-tapped",
        this._tapHandler.bind(this)
      );
    }, 0);
  }
  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {
    // listen to see if buttons have been initialized in the secondary toolbar
    this.shadowRoot
      .querySelector("#secondary")
      .addEventListener("button-initialized", e => {
        this._secondaryHasChildren = true;
      });
  }
}
window.customElements.define(LrnsysDialogToolbar.tag, LrnsysDialogToolbar);
export { LrnsysDialogToolbar };
