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
          font-size: var(--ddd-font-size-s);
          padding: var(--ddd-spacing-3) var(--ddd-spacing-5);
          margin: var(--ddd-spacing-2);
          color: white;
          background-color: var(--ddd-theme-default-skyBlue);
          border: 2px solid var(--ddd-theme-default-navy);
          border-radius: var(--ddd-radius-sm);
          font-family: var(--ddd-font-navigation);
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        button.hax-modal-btn:hover,
        button.hax-modal-btn:focus {
          outline: 2px solid var(--ddd-theme-default-keystoneYellow);
          background-color: var(--ddd-theme-default-nittanyNavy);
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
        @outline-designer-request-navigate="${this._outlineNavigateRequested}"
        .hidden="${this.viewMode}"
        .items="${this.manifestItems}"
      ></outline-designer>
      <div class="buttons">
        <button @click="${this._saveTap}" class="hax-modal-btn">
          ${this.t.save}
        </button>
      </div>
    `;
  }
  constructor() {
    super();
    this.__disposer = [];
    this.__windowAbortController = null;
    this.__allowNextModalClose = false;
    this.manifestItems = [];
    this.viewMode = false;
    this._handleSimpleModalWillClose = this._handleSimpleModalWillClose.bind(this);
    this._handleSimpleModalBreadcrumbClick =
      this._handleSimpleModalBreadcrumbClick.bind(this);
    this._outlineNavigateRequested = this._outlineNavigateRequested.bind(this);
    this.t = this.t || {};
    this.t = {
      ...this.t,
      save: "Save",
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
    if (this.__windowAbortController) {
      this.__windowAbortController.abort();
    }
    this.__windowAbortController = new AbortController();
    globalThis.addEventListener(
      "simple-modal-will-close",
      this._handleSimpleModalWillClose,
      { signal: this.__windowAbortController.signal },
    );
    globalThis.addEventListener(
      "simple-modal-breadcrumb-click",
      this._handleSimpleModalBreadcrumbClick,
      { capture: true, signal: this.__windowAbortController.signal },
    );
    this.__disposer.push(
      autorun(() => {
        this.manifestItems = [...toJS(store.manifest.items)];
        this.updateComplete.then(() => {
          // force UI sync after render completes so data and UI stay aligned
          if (this.shadowRoot) {
            const outline = this.shadowRoot.querySelector("#outline");
            if (outline && outline.__syncUIAndDataModel) {
              outline.__syncUIAndDataModel();
            }
          }
        });
      }),
    );
  }
  /**
   * detached life cycle
   */
  disconnectedCallback() {
    if (this.__windowAbortController) {
      this.__windowAbortController.abort();
      this.__windowAbortController = null;
    }
    for (var i in this.__disposer) {
      if (typeof this.__disposer[i] === "function") {
        this.__disposer[i]();
      } else if (
        this.__disposer[i] &&
        typeof this.__disposer[i].dispose === "function"
      ) {
        this.__disposer[i].dispose();
      }
    }
    this.__disposer = [];
    super.disconnectedCallback();
  }
  _getOutline() {
    if (this.shadowRoot) {
      return this.shadowRoot.querySelector("#outline");
    }
    return null;
  }
  _getItemChangeSummary(items = []) {
    let deleted = 0;
    let modified = 0;
    let added = 0;
    if (Array.isArray(items)) {
      items.forEach((item) => {
        if (!item) {
          return;
        }
        if (item.delete) {
          deleted++;
        } else if (item.new) {
          added++;
        } else if (item.modified) {
          modified++;
        }
      });
    }
    return {
      added: added,
      modified: modified,
      deleted: deleted,
    };
  }
  _formatItemChangeSummary(summary) {
    if (!summary) {
      return "";
    }
    const addedText =
      summary.added > 0
        ? `‣ ${summary.added} new page${summary.added === 1 ? "" : "s"} will be created\n`
        : "";
    const modifiedText =
      summary.modified > 0
        ? `‣ ${summary.modified} page${summary.modified === 1 ? "" : "s"} will be updated\n`
        : "";
    const deletedText =
      summary.deleted > 0
        ? `‣ ${summary.deleted} page${summary.deleted === 1 ? "" : "s"} will be deleted\n`
        : "";
    return `${addedText}${modifiedText}${deletedText}`;
  }
  _hasUnsavedOutlineChanges() {
    const outline = this._getOutline();
    if (!outline || !Array.isArray(outline.items)) {
      return false;
    }
    const summary = this._getItemChangeSummary(outline.items);
    return summary.added > 0 || summary.modified > 0 || summary.deleted > 0;
  }
  _confirmDiscardUnsavedOutlineChanges() {
    const outline = this._getOutline();
    if (!outline || !Array.isArray(outline.items)) {
      return true;
    }
    const summary = this._getItemChangeSummary(outline.items);
    const sumChanges = this._formatItemChangeSummary(summary);
    if (sumChanges == "") {
      return true;
    }
    return globalThis.confirm(
      `You have unsaved outline changes:\n${sumChanges}\nIf you continue, these changes will be lost. Continue?`,
    );
  }
  _ownsSimpleModalEvent(e) {
    if (!e || !e.target || !this.isConnected) {
      return false;
    }
    const modal = e.target;
    if (!modal.tagName || modal.tagName.toLowerCase() !== "simple-modal") {
      return false;
    }
    return this.parentNode === modal;
  }
  _consumeAllowNextModalClose() {
    if (this.__allowNextModalClose) {
      this.__allowNextModalClose = false;
      return true;
    }
    return false;
  }
  _handleSimpleModalWillClose(e) {
    if (!this._ownsSimpleModalEvent(e)) {
      return;
    }
    if (this._consumeAllowNextModalClose()) {
      return;
    }
    if (!this._confirmDiscardUnsavedOutlineChanges()) {
      e.preventDefault();
      if (e.stopImmediatePropagation) {
        e.stopImmediatePropagation();
      }
      store.playSound("error");
    }
  }
  _handleSimpleModalBreadcrumbClick(e) {
    if (!this._ownsSimpleModalEvent(e)) {
      return;
    }
    if (!e.detail || !e.detail.breadcrumb) {
      return;
    }
    if (e.detail.breadcrumb.action !== "site-settings-dashboard") {
      return;
    }
    if (!this._confirmDiscardUnsavedOutlineChanges()) {
      e.preventDefault();
      if (e.stopImmediatePropagation) {
        e.stopImmediatePropagation();
      }
      if (e.stopPropagation) {
        e.stopPropagation();
      }
      store.playSound("error");
    }
  }
  _outlineNavigateRequested(e) {
    if (!e || !e.detail || !e.detail.href) {
      return;
    }
    const hasUnsavedChanges = this._hasUnsavedOutlineChanges();
    if (hasUnsavedChanges && !this._confirmDiscardUnsavedOutlineChanges()) {
      e.preventDefault();
      if (e.stopImmediatePropagation) {
        e.stopImmediatePropagation();
      }
      store.playSound("error");
      return;
    }
    if (hasUnsavedChanges) {
      this.__allowNextModalClose = true;
    }
  }

  /**
   * Save hit, send the message to push up the outline changes.
   */
  async _saveTap(e) {
    store.playSound("click");
    const outline = this._getOutline();
    if (!outline) {
      return;
    }
    const data = await outline.getData();
    const summary = this._getItemChangeSummary(data.items);
    let sumChanges = this._formatItemChangeSummary(summary);
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
      this.__allowNextModalClose = true;
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
}
globalThis.customElements.define(
  HAXCMSOutlineEditorDialog.tag,
  HAXCMSOutlineEditorDialog,
);
export { HAXCMSOutlineEditorDialog };
