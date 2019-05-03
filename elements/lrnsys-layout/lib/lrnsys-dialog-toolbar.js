import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import "@polymer/app-layout/app-toolbar/app-toolbar.js";
import "./lrnsys-dialog-toolbar-button.js";
class LrnsysDialogToolbar extends PolymerElement {
  static get template() {
    return html`
      <style is="custom-style">
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
      </style>
      <app-toolbar id="primary">
        <slot name="primary"></slot>
        <div main-title=""></div>
        <lrnsys-dialog-toolbar-button
          icon="close"
          id="close"
          title="close dialog"
        ></lrnsys-dialog-toolbar-button>
      </app-toolbar>
      <app-toolbar id="secondary" hidden\$="[[!_secondaryHasChildren]]">
        <div class="secondary-buttons">
          <slot name="secondary" id="secondary-slot"></slot>
        </div>
      </app-toolbar>
    `;
  }

  static get tag() {
    return "lrnsys-dialog-toolbar";
  }

  static get properties() {
    return {
      /**
       * Internal state of secondary toolbar
       */
      _secondaryHasChildren: {
        type: Boolean,
        value: false
      }
    };
  }

  /**
   * Button tapped
   */
  _tapHandler(e) {
    this.dispatchEvent(
      new CustomEvent("button-clicked", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: e.detail
      })
    );
  }

  /**
   * Ready.
   */
  ready() {
    super.ready();
    afterNextRender(this, function() {
      // listen to see if buttons have been initialized in the secondary toolbar
      this.$.secondary.addEventListener("button-initialized", e => {
        this._secondaryHasChildren = true;
      });
      this.addEventListener(
        "dialog-toolbar-button-tapped",
        this._tapHandler.bind(this)
      );
    });
  }
  disconnectedCallback() {
    this.$.secondary.removeEventListener("button-initialized", e => {
      this._secondaryHasChildren = true;
    });
    this.removeEventListener(
      "dialog-toolbar-button-tapped",
      this._tapHandler.bind(this)
    );
    super.disconnectedCallback();
  }
}
window.customElements.define(LrnsysDialogToolbar.tag, LrnsysDialogToolbar);
export { LrnsysDialogToolbar };
