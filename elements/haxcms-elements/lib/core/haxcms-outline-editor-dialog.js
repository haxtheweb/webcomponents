import { LitElement, html, css } from "lit-element/lit-element.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx/lib/mobx.module.js";
import "@lrnwebcomponents/json-outline-schema/json-outline-schema.js";
import "@lrnwebcomponents/json-editor/json-editor.js";
import "@lrnwebcomponents/editable-outline/editable-outline.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-icons/iron-icons.js";
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
        .buttons paper-button {
          color: #ffffff;
          background-color: var(--simple-modal-button-background, #000000);
        }
        editable-outline:not(:defined),
        json-editor:not(:defined),
        paper-button:not(:defined) {
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
        editable-outline,
        json-editor {
          margin-bottom: 32px;
        }
      `
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
      <json-editor
        id="editor"
        @current-data-changed="${this.currentDataChangedEvent}"
        label="JSON Outline Schema items"
        value="${this.manifestItemsStatic}"
        .hidden="${!this.viewMode}"
      ></json-editor>
      <div class="buttons">
        <paper-button id="savebtn" dialog-confirm @click="${this._saveTap}"
          ><iron-icon icon="icons:save"></iron-icon>Save</paper-button
        >
        <paper-button dialog-dismiss
          ><iron-icon icon="icons:cancel"></iron-icon>Cancel</paper-button
        >
        <paper-button id="toggle" @click="${this.toggleView}"
          ><iron-icon icon="${this._viewIcon}"></iron-icon>${this
            .viewLabel}</paper-button
        >
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
        type: Boolean
      },
      /**
       * Outline of items in json outline schema format
       */
      manifestItems: {
        type: Array
      },
      /**
       * Stringify'ed representation of items
       */
      manifestItemsStatic: {
        type: String,
        attribute: "manifest-items-static"
      },
      /**
       * Display label, switch when hitting the toggle button
       */
      viewLabel: {
        type: String,
        attribute: "view-label"
      },
      /**
       * Which edit mode to display
       */
      viewMode: {
        type: Boolean,
        attribute: "view-mode"
      }
    };
  }
  currentDataChangedEvent(e) {
    if (e.detail.value) {
      this.manifestItems = [...e.detail.value];
      this.shadowRoot.querySelector("#outline").importJsonOutlineSchemaItems();
    }
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
            detail: this[propName]
          })
        );
      }
      if (propName == "manifestItems") {
        // observer
        this._manifestItemsChanged(this[propName], oldValue);
        // notify
        this.dispatchEvent(
          new CustomEvent("manifest-edit-mode-changed", {
            detail: this[propName]
          })
        );
      }
      if (propName == "viewMode") {
        // computed
        this.viewLabel = this._getViewLabel(this[propName]);
        // observer
        this._viewModeChanged(this[propName], oldValue);
      }
    });
  }
  _manifestItemsChanged(newValue) {
    if (newValue) {
      window.JSONOutlineSchema.requestAvailability().items = newValue;
      this.manifestItemsStatic = JSON.stringify(newValue, null, 2);
    }
  }
  connectedCallback() {
    super.connectedCallback();
    autorun(reaction => {
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
   * Switch view
   */
  toggleView(e) {
    this.viewMode = !this.viewMode;
  }
  /**
   * Get the active label
   */
  _getViewLabel(mode) {
    if (mode) {
      this._viewIcon = "icons:view-list";
      return "Outline mode";
    } else {
      this._viewIcon = "icons:code";
      return "Developer mode";
    }
  }
  /**
   * Ensure that data is correct between the outline and advanced view
   */
  _viewModeChanged(newValue, oldValue) {
    // odd I know, but this is the default outline view
    if (!newValue) {
      this.shadowRoot.querySelector("#outline").importJsonOutlineSchemaItems();
    } else {
      const items = this.shadowRoot
        .querySelector("#outline")
        .exportJsonOutlineSchemaItems(true);
      this.manifestItems = items;
    }
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
          .exportJsonOutlineSchemaItems(true)
      })
    );
  }
}
window.customElements.define(
  HAXCMSOutlineEditorDialog.tag,
  HAXCMSOutlineEditorDialog
);
export { HAXCMSOutlineEditorDialog };
