import { LitElement, html, css, nothing } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import { HAXCMSI18NMixin } from "./utils/HAXCMSI18NMixin.js";
import "@haxtheweb/json-outline-schema/json-outline-schema.js";
import "@haxtheweb/outline-designer/outline-designer.js";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-toolbar/lib/simple-toolbar-button.js";
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
        /* fill the modal below its titlebar so the outline is the one
           thing that scrolls: the modal's height less its titlebar, its
           content padding and the margin around its empty buttons area */
        :host {
          display: flex;
          flex-direction: column;
          height: calc(
            var(--simple-modal-height, 80vh) - var(
                --simple-modal-titlebar-height,
                80px
              ) - var(--ddd-spacing-10)
          );
          overflow: hidden;
          font-family: var(--ddd-font-navigation);
        }
        /* inside the site admin dialog: fill its body, with the same
           padding as other sections and Save Outline in a bar at the foot */
        :host([in-shell]) {
          height: 100%;
          color-scheme: var(--hax-ui-color-scheme, inherit);
        }
        /* in the site admin dialog Save Outline sits in the toolbar, so the
           outline gets the whole height below the titlebar */
        :host([in-shell]) outline-designer {
          padding: 0 var(--ddd-spacing-5, 20px);
          margin-bottom: 0;
        }
        @media (max-width: 768px) {
          :host([in-shell]) outline-designer {
            padding: 0 var(--ddd-spacing-3, 12px);
          }
        }
        :host([in-shell]) button.hax-modal-btn {
          white-space: nowrap;
          flex: none;
        }
        :host([in-shell]) .buttons {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          min-height: 56px;
          padding: var(--ddd-spacing-2, 8px) var(--ddd-spacing-5, 20px);
          border-top: 1px solid
            var(
              --hax-ui-line,
              light-dark(
                var(--ddd-theme-default-limestoneLight, #e4e5e7),
                rgba(255, 255, 255, 0.12)
              )
            );
        }
        :host([in-shell]) button.hax-modal-btn {
          height: 32px;
          padding: 0 var(--ddd-spacing-4, 16px);
          font-size: 13px;
          font-weight: var(--ddd-font-weight-bold, 700);
          border-width: 1px;
          border-radius: var(--hax-ui-radius, 6px);
          color: light-dark(
            var(--ddd-theme-default-white, #ffffff),
            var(--ddd-theme-default-potentialMidnight, #000321)
          );
          background-color: light-dark(
            var(--ddd-theme-default-nittanyNavy, #001e44),
            var(--ddd-theme-default-linkLight, #cce9ff)
          );
          border-color: transparent;
        }
        :host([in-shell]) button.hax-modal-btn:hover,
        :host([in-shell]) button.hax-modal-btn:focus-visible {
          background-color: light-dark(
            var(--ddd-theme-default-beaverBlue, #1e407c),
            var(--ddd-theme-default-skyLight, #ccf0ff)
          );
          outline: var(--hax-ui-focus-width, 2px) solid
            var(--hax-ui-focus, var(--ddd-theme-default-keystoneYellow));
          outline-offset: 2px;
        }
        outline-designer {
          flex: 1 1 auto;
          min-height: 0;
          overflow: auto;
          margin-bottom: 0;
          overscroll-behavior: contain;
        }
        .buttons {
          flex: none;
          padding-top: var(--ddd-spacing-2);
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
          margin: 0;
          color: white;
          background-color: var(--ddd-theme-default-skyBlue);
          border: 2px solid
            light-dark(
              var(--ddd-theme-default-nittanyNavy),
              var(--ddd-theme-default-linkLight)
            );
          border-radius: var(--ddd-radius-sm);
          font-family: var(--ddd-font-navigation);
          cursor: pointer;
          transition: background-color var(--ddd-duration-normal, 0.3s) ease;
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
      >
        <simple-toolbar-button
          slot="controls"
          icon="file-upload"
          label="${this.t.import}"
          show-text-label
          @click="${this._importTap}"
        ></simple-toolbar-button>
        ${this.inShell
          ? html`<button
              slot="actions"
              @click="${this._saveTap}"
              class="hax-modal-btn"
            >
              ${this.t.save}
            </button>`
          : nothing}
      </outline-designer>
      ${this.inShell
        ? nothing
        : html`<div class="buttons">
            <button @click="${this._saveTap}" class="hax-modal-btn">
              ${this.t.save}
            </button>
          </div>`}
    `;
  }
  constructor() {
    super();
    this.__disposer = [];
    this.__windowAbortController = null;
    this.__allowNextModalClose = false;
    this.manifestItems = [];
    this.viewMode = false;
    this.inShell = false;
    this._handleSimpleModalWillClose =
      this._handleSimpleModalWillClose.bind(this);
    this._handleSimpleModalBreadcrumbClick =
      this._handleSimpleModalBreadcrumbClick.bind(this);
    this._outlineNavigateRequested = this._outlineNavigateRequested.bind(this);
    this.t = this.t || {};
    this.t = {
      ...this.t,
      save: "Save Outline",
      import: "Import from file",
      outlineNewPageCreated: "{count} new page will be created",
      outlineNewPagesCreated: "{count} new pages will be created",
      outlinePageUpdated: "{count} page will be updated",
      outlinePagesUpdated: "{count} pages will be updated",
      outlinePageDeleted: "{count} page will be deleted",
      outlinePagesDeleted: "{count} pages will be deleted",
      outlineUnsavedChangesConfirm:
        "You have unsaved changes in Site Outline:\n{changes}\nIf you continue, these changes will be lost. Continue?",
      outlineSaveConfirm:
        "Saving will apply these Site Outline changes:\n{changes}\nContinue?",
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
      /**
       * Set by the site admin dialog before it connects: Structure is one
       * of its sections. Save Outline and its confirm stay the same.
       */
      inShell: {
        type: Boolean,
        reflect: true,
        attribute: "in-shell",
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
        // guard: the manifest may not be loaded yet (null / no items), and
        // reading .items off it crashes the reaction before the first load
        const _mobx_val_0 =
          store.manifest && Array.isArray(store.manifest.items)
            ? toJS(store.manifest.items)
            : null;
        Promise.resolve().then(() => {
          if (_mobx_val_0) {
            this.manifestItems = [..._mobx_val_0];
          }
          this.updateComplete.then(() => {
            // force UI sync after render completes so data and UI stay aligned
            if (this.shadowRoot) {
              const outline = this.shadowRoot.querySelector("#outline");
              if (outline && outline.__syncUIAndDataModel) {
                outline.__syncUIAndDataModel();
              }
            }
          });
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
    for (let i in this.__disposer) {
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
        ? `‣ ${(summary.added === 1
            ? this.t.outlineNewPageCreated
            : this.t.outlineNewPagesCreated
          ).replace("{count}", () => summary.added)}\n`
        : "";
    const modifiedText =
      summary.modified > 0
        ? `‣ ${(summary.modified === 1
            ? this.t.outlinePageUpdated
            : this.t.outlinePagesUpdated
          ).replace("{count}", () => summary.modified)}\n`
        : "";
    const deletedText =
      summary.deleted > 0
        ? `‣ ${(summary.deleted === 1
            ? this.t.outlinePageDeleted
            : this.t.outlinePagesDeleted
          ).replace("{count}", () => summary.deleted)}\n`
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
      this.t.outlineUnsavedChangesConfirm.replace(
        "{changes}",
        () => sumChanges,
      ),
    );
  }
  /**
   * Whether the outline holds changes Save Outline has not sent. The site
   * admin dialog reads it before the person leaves Structure.
   */
  get hasUnsavedChanges() {
    return this._hasUnsavedOutlineChanges();
  }
  /**
   * The site admin dialog calls this before leaving Structure (rail,
   * breadcrumb, browser back) while there are unsaved changes; it asks with
   * the same confirm the close button uses.
   * @returns {boolean} true to leave
   */
  confirmLeave() {
    return this._confirmDiscardUnsavedOutlineChanges();
  }
  _ownsSimpleModalEvent(e) {
    if (!e || !e.target || !this.isConnected) {
      return false;
    }
    const modal = e.target;
    if (!modal.tagName || modal.tagName.toLowerCase() !== "simple-modal") {
      return false;
    }
    // on its own the dialog is the modal's child; inside the site admin
    // dialog it is that dialog's child, which is the modal's
    return (
      this.parentNode === modal ||
      (this.inShell &&
        !!this.parentNode &&
        this.parentNode.parentNode === modal)
    );
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
    // in the site admin dialog the breadcrumb goes through its leave check,
    // which calls confirmLeave(); asking here as well would ask twice
    if (this.inShell || !this._ownsSimpleModalEvent(e)) {
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
  _importTap(_e) {
    if (!this._confirmDiscardUnsavedOutlineChanges()) {
      return;
    }
    this.__allowNextModalClose = true;
    globalThis.dispatchEvent(
      new CustomEvent("simple-modal-hide", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: false,
      }),
    );
    setTimeout(() => {
      globalThis.dispatchEvent(
        new CustomEvent("haxcms-outline-import-request", {
          bubbles: true,
          composed: true,
          cancelable: true,
        }),
      );
    }, 0);
  }

  /**
   * Save hit, send the message to push up the outline changes.
   */
  async _saveTap(_e) {
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
        this.t.outlineSaveConfirm.replace("{changes}", () => sumChanges),
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
