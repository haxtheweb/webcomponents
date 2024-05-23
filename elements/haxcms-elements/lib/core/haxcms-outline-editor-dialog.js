import { LitElement, html, css } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import { HAXCMSI18NMixin } from "./utils/HAXCMSI18NMixin.js";
import "@haxtheweb/json-outline-schema/json-outline-schema.js";
import "@haxtheweb/outline-designer/outline-designer.js";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
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
          height: 70vh;
          overflow: auto;
          padding-bottom: 40px;
          padding-top: 16px;
          min-width: 70vw;
          font-family: var(--ddd-font-navigation);
        }
        .buttons {
          position: absolute;
          bottom: 0;
          z-index: 1000000;
          background-color: var(--simple-modal-titlebar-background, #000000);
          left: 0;
          right: 0px;
          padding-left: 8px;
        }
        .buttons button {
          color: black;
          background-color: white;
        }
        simple-icon {
          margin-right: 4px;
        }
        outline-designer:not(:defined) {
          display: none;
        }
        #toggle {
          float: right;
          text-transform: unset;
        }
        button.hax-modal-btn {
          font-size: 30px;
          padding: 8px;
          margin: 4px 8px;
          color: white;
          background-color: green;
          border: 4px solid black;
          border-radius: 8px;
          font-family: sans-serif;
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
      <outline-designer
        id="outline"
        edit-mode
        .hidden="${this.viewMode}"
        .items="${this.manifestItems}"
      ></outline-designer>
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
    this.manifestItems = [];
    this.viewMode = false;
    this.t = this.t || {};
    this.t = {
      ...this.t,
      save: "Save",
      cancel: "cancel",
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
          }),
        );
      }
      if (propName == "manifestItems") {
        // observer
        this._manifestItemsChanged(this[propName], oldValue);
        // notify
        this.dispatchEvent(
          new CustomEvent("manifest-edit-mode-changed", {
            detail: this[propName],
          }),
        );
      }
    });
  }
  _manifestItemsChanged(newValue) {
    if (newValue) {
      globalThis.JSONOutlineSchema.requestAvailability().items = newValue;
      this.manifestItemsStatic = JSON.stringify(newValue, null, 2);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    autorun((reaction) => {
      this.manifestItems = [...toJS(store.manifest.items)];
      setTimeout(() => {
        // hack, force UI to update as manifest might be loading at an off time
        if (this.shadowRoot) {
          this.shadowRoot.querySelector("#outline").__syncUIAndDataModel();
        }
      }, 500);
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
  async _saveTap(e) {
    store.playSound("click");
    const data = await this.shadowRoot.querySelector("#outline").getData();
    let deleted = 0;
    let modified = 0;
    let added = 0;
    data.items.map((item) => {
      if (item.delete) {
        deleted++;
      } else if (item.new) {
        added++;
      } else if (item.modified) {
        modified++;
      }
    });
    let sumChanges = `${
      added > 0 ? `‣ ${added} new pages will be created\n` : ""
    }${modified > 0 ? `‣ ${modified} pages will be updated\n` : ""}${
      deleted > 0 ? `‣ ${deleted} pages will be deleted\n` : ""
    }`;
    let confirmation = false;
    // no confirmation required if there are no tracked changes
    if (sumChanges == "") {
      confirmation = true;
    } else {
      confirmation = globalThis.confirm(
        `Saving will commit the following actions:\n${sumChanges}\nAre you sure?`,
      );
    }
    if (confirmation) {
      globalThis.dispatchEvent(
        new CustomEvent("haxcms-save-outline", {
          bubbles: true,
          composed: true,
          detail: data.items,
        }),
      );
      setTimeout(() => {
        // ensure things don't conflict w/ the modal if its around
        this.dispatchEvent(
          new CustomEvent("simple-modal-hide", {
            bubbles: true,
            composed: true,
            cancelable: false,
            detail: false,
          }),
        );
      }, 0);
    }
  }
  _cancelTap(e) {
    store.playSound("error");
    this.dispatchEvent(
      new CustomEvent("simple-modal-hide", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: false,
      }),
    );
  }
}
customElements.define(HAXCMSOutlineEditorDialog.tag, HAXCMSOutlineEditorDialog);
export { HAXCMSOutlineEditorDialog };
