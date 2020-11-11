import { LitElement, html, css } from "lit-element/lit-element.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
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
class HAXCMSOutlineEditorDialog extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          height: 60vh;
          min-width: 50vw;
          overflow: auto;
        }
        .buttons {
          position: absolute;
          bottom: 0;
          z-index: 1000000;
          background-color: var(--simple-modal-titlebar-background, #000000);
          color: var(--simple-modal-titlebar-color, #ffffff);
          left: 0;
          right: 0;
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
        #savebtn {
          color: white;
          background-color: var(--haxcms-color, #2196f3);
        }
        editable-outline {
          margin-bottom: 32px;
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
        <button id="savebtn" @click="${this._saveTap}">
          <simple-icon icon="icons:save" dark></simple-icon>Save
        </button>
        <button @click="${this._cancelTap}">
          <simple-icon icon="icons:cancel"></simple-icon>Cancel
        </button>
      </div>
    `;
  }
  constructor() {
    super();
    this.__disposer = [];
    this.viewMode = false;
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
  firstUpdated() {
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
