import { LitElement, html, css } from "lit";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import { HAXCMSI18NMixin } from "./utils/HAXCMSI18NMixin.js";
import "@lrnwebcomponents/json-outline-schema/json-outline-schema.js";
import "@lrnwebcomponents/editable-outline/editable-outline.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
/**
 * `haxcms-outline-editor-dialog`
 * `Dialog for presenting an editable outline`
 *
 * @demo demo/index.html
 *
 * @microcopy - the mental model for this element
 */
class HAXCMSOutlineEditorDialog extends HAXCMSI18NMixin(LitElement) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          height: 60vh;
          min-width: 40vw;
          overflow: auto;
          padding-bottom: 40px;
        }
        .buttons {
          position: absolute;
          bottom: 0;
          z-index: 1000000;
          background-color: var(--simple-modal-titlebar-background, #000000);
          left: 0;
          right: 32px;
        }
        .buttons button {
          color: black;
          background-color: white;
        }
        simple-icon {
          margin-right: 4px;
        }
        editable-outline:not(:defined) {
          display: none;
        }
        #toggle {
          float: right;
          text-transform: unset;
        }
        button.hax-modal-btn {
          font-size: 30px;
          padding: 8px;
          margin: 4px;
          color: white;
          background-color: green;
          border: 4px solid black;
          border-radius: 8px;
          font-family: 'Press Start 2P', sans-serif;
        }
        button.hax-modal-btn.cancel {
          background-color: red;
        }
        button.hax-modal-btn:hover,
        button.hax-modal-btn:focus {
          outline: 2px solid black;
          cursor: pointer;
          background-color: darkgreen;
        }
        button.hax-modal-btn.cancel:hover,
        button.hax-modal-btn.cancel:focus {
          background-color: darkred;
        }
      `,
    ];
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "haxcms-outline-editor-dialog";
  }
  // render function
  render() {
    return html`
      <editable-outline
        id="outline"
        edit-mode
        .hidden="${this.viewMode}"
        .items="${this.manifestItems}"
      ></editable-outline>
      <div class="buttons">
        <button @click="${this._saveTap}" class="hax-modal-btn">
          ${this.t.save}
        </button>
        <button @click="${this._cancelTap}" class="cancel hax-modal-btn">
          ${this.t.cancel}
        </button>
      </div>
    `;
  }
  constructor() {
    super();
    this.__disposer = [];
    this.viewMode = false;
    this.t = this.t || {};
    this.t = {
      ...this.t,
      save: "Save",
      cancel: "cancel"
    };
  }
  static get properties() {
    return {
      /**
       * opened state of the dialog inside here
       */
      opened: {
        type: Boolean,
      },
      /**
       * Outline of items in json outline schema format
       */
      manifestItems: {
        type: Array,
      },
      /**
       * Stringify'ed representation of items
       */
      manifestItemsStatic: {
        type: String,
        attribute: "manifest-items-static",
      },
      /**
       * Display label, switch when hitting the toggle button
       */
      viewLabel: {
        type: String,
        attribute: "view-label",
      },
      /**
       * Which edit mode to display
       */
      viewMode: {
        type: Boolean,
        attribute: "view-mode",
      },
    };
  }
  /**
   * LitElement property change life cycle
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "opened") {
        // notify
        this.dispatchEvent(
          new CustomEvent("opened-changed", {
            detail: this[propName],
          })
        );
      }
      if (propName == "manifestItems") {
        // observer
        this._manifestItemsChanged(this[propName], oldValue);
        // notify
        this.dispatchEvent(
          new CustomEvent("manifest-edit-mode-changed", {
            detail: this[propName],
          })
        );
      }
    });
  }
  _manifestItemsChanged(newValue) {
    if (newValue) {
      window.JSONOutlineSchema.requestAvailability().items = newValue;
      this.manifestItemsStatic = JSON.stringify(newValue, null, 2);
    }
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.shadowRoot.querySelector("#outline").importJsonOutlineSchemaItems();
  }
  connectedCallback() {
    super.connectedCallback();
    autorun((reaction) => {
      this.manifestItems = [...toJS(store.manifest.items)];
      this.__disposer.push(reaction);
    });
  }
  /**
   * detached life cycle
   */
  disconnectedCallback() {
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
    super.disconnectedCallback();
  }

  /**
   * Save hit, send the message to push up the outline changes.
   */
  _saveTap(e) {
    store.playSound("click");
    window.dispatchEvent(
      new CustomEvent("haxcms-save-outline", {
        bubbles: true,
        composed: true,
        detail: this.shadowRoot
          .querySelector("#outline")
          .exportJsonOutlineSchemaItems(true),
      })
    );
    setTimeout(() => {
      // ensure things don't conflict w/ the modal if its around
      this.dispatchEvent(
        new CustomEvent("simple-modal-hide", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: false,
        })
      );
    }, 0);
  }
  _cancelTap(e) {
    store.playSound("error");
    this.dispatchEvent(
      new CustomEvent("simple-modal-hide", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: false,
      })
    );
  }
}
window.customElements.define(
  HAXCMSOutlineEditorDialog.tag,
  HAXCMSOutlineEditorDialog
);
export { HAXCMSOutlineEditorDialog };
