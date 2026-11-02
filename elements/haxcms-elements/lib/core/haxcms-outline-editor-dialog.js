import { LitElement, html, css, nothing } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import { HAXCMSI18NMixin } from "./utils/HAXCMSI18NMixin.js";
import "@haxtheweb/json-outline-schema/json-outline-schema.js";
import "@haxtheweb/outline-designer/outline-designer.js";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-toolbar/lib/simple-toolbar-button.js";
import {
  HaxUiAdminIcons,
  HaxUiAdminControls,
} from "@haxtheweb/d-d-d/lib/HaxUiAdminStyles.js";
import "./admin/haxcms-admin-add-area.js";
import {
  splitAdminAddFiles,
  adminFileType,
  ADMIN_DOCUMENT_TYPES,
  ADMIN_OUTLINE_TYPES,
} from "./admin/haxcms-admin-add-area.js";
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
      ...HaxUiAdminControls,
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
           padding as other sections; Save is in the shell's action bar */
        :host([in-shell]) {
          height: 100%;
          color-scheme: var(--hax-ui-color-scheme, inherit);
        }
        /* in the site admin dialog the outline gets the whole body */
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
        /* the add area outside the site admin shell, and the chooser a
           dropped document opens: one page, or an outline of pages */
        .local-add {
          display: flex;
          justify-content: flex-end;
          margin-bottom: var(--ddd-spacing-2, 8px);
        }
        .add-choice {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--hax-ui-gap-md, 8px);
          margin: var(--ddd-spacing-2, 8px) var(--ddd-spacing-5, 20px);
          padding: var(--hax-ui-gap-md, 8px) var(--hax-ui-gap-lg, 12px);
          border: 1px solid var(--hax-ui-line-strong, currentColor);
          border-radius: var(--hax-ui-radius-lg, 8px);
          background-color: var(--hax-ui-surface, transparent);
          box-shadow: var(--hax-ui-shadow-popover, none);
          font-family: var(--hax-ui-admin-font-family, inherit);
          font-size: var(--hax-ui-admin-font-size, 14px);
          color: var(--hax-ui-text, inherit);
        }
        .add-choice .q {
          flex: 1 1 240px;
          margin: 0;
          font-weight: var(--ddd-font-weight-bold, 700);
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
      ${this.inShell
        ? nothing
        : html`<div class="local-add">
            <haxcms-admin-add-area
              accept="${this.addArea.accept}"
              label="${this.addArea.label}"
              browse-label="${this.addArea.browseLabel}"
              hint="${this.addArea.hint}"
              message="${this.addArea.message}"
              tone="${this.addArea.tone}"
              ?disabled="${this.addArea.disabled}"
              ?busy="${this.addArea.busy}"
              @admin-add-files="${(e) => this.addFiles(e.detail)}"
            ></haxcms-admin-add-area>
          </div>`}
      ${this._addChoice ? this._renderAddChoice() : nothing}
      <outline-designer
        id="outline"
        edit-mode
        ?host-actions="${this.inShell}"
        @outline-designer-rendered="${this._emitState}"
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
    this._addChoice = null;
    this._addMessage = "";
    this._addTone = "";
    this._addBusy = false;
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
      deleteSelected: "Delete selected",
      dropDocuments: "Drop documents here or",
      browseDocuments: "browse",
      dropDocumentsHint:
        "Drop Word, PDF, PowerPoint, Markdown, text or HTML files to add pages to the outline",
      addUnder: "Add {name} under {target} as:",
      addManyUnder: "Add {count} documents under {target} as:",
      theTopLevel: "the top level",
      onePage: "One page",
      onePageEach: "One page each",
      outlineOfPages: "Outline of pages",
      cancel: "Cancel",
      makingPage: "Making page {done} of {count}: {name}…",
      readingOutline: "Reading the outline in {name}…",
      madePages: "Added {count} pages under {target}.",
      madePage: "Added 1 page under {target}.",
      makingStopped: "Stopped at {name}: the page was not made.",
      onlyDocuments:
        "Only documents become pages here; images and other files go in Files.",
      turnedAway: "Not added: {list}.",
      outlineNewPages: "{count} new",
      outlineChangedPages: "{count} changed",
      outlineDeletedPages: "{count} to delete",
    };
    this.__stateKey = "";
    this.__shellReleased = false;
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
      /** a dropped document waiting for one page or an outline of pages */
      _addChoice: { state: true },
      _addMessage: { state: true },
      _addTone: { state: true },
      _addBusy: { state: true },
    };
  }
  /**
   * LitElement property change life cycle
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (
      changedProperties.has("_addMessage") ||
      changedProperties.has("_addBusy") ||
      changedProperties.has("_addTone")
    ) {
      this._emitState();
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
    // in the site admin dialog the shell's leave prompt asks (it knows the
    // outline is unsaved from the section state), so asking here as well
    // would ask twice
    if (this.inShell || !this._ownsSimpleModalEvent(e)) {
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
      this._releaseShell();
    }
  }
  _importTap(_e) {
    if (!this._confirmDiscardUnsavedOutlineChanges()) {
      return;
    }
    this.__allowNextModalClose = true;
    this._releaseShell();
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
      // in the site admin dialog the panel stays open like the others:
      // the shell shows Saving, then Saved from the editor's save result,
      // and the outline reloads from the updated manifest
      if (this.inShell) {
        return confirmation;
      }
      this.__allowNextModalClose = true;
      this._releaseShell();
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
    return confirmation;
  }

  /* ---------- site admin section contract ---------- */

  /**
   * Tell the shell what the outline holds: its unsaved changes (a form
   * section) and its checked pages with Delete selected (a selection).
   * Sent after every outline render, only when something changed.
   */
  _emitState() {
    if (!this.inShell || this.__shellReleased) {
      return;
    }
    const outline = this._getOutline();
    if (!outline) {
      return;
    }
    const summary = this._getItemChangeSummary(outline.items);
    const changes = [];
    if (summary.added) {
      changes.push(
        this.t.outlineNewPages.replace("{count}", () => summary.added),
      );
    }
    if (summary.modified) {
      changes.push(
        this.t.outlineChangedPages.replace("{count}", () => summary.modified),
      );
    }
    if (summary.deleted) {
      changes.push(
        this.t.outlineDeletedPages.replace("{count}", () => summary.deleted),
      );
    }
    const dirty = changes.length > 0;
    const selected = Array.isArray(outline.selectedPages)
      ? outline.selectedPages.length
      : 0;
    const detail = {
      dirty: dirty,
      changes: changes,
      count: summary.added + summary.modified + summary.deleted,
      canSave: dirty,
      selected: selected,
      addArea: this.addArea,
      actions: [
        {
          id: "delete-selected",
          label: this.t.deleteSelected,
          icon: HaxUiAdminIcons.delete,
          danger: true,
        },
      ],
    };
    const key = JSON.stringify(detail);
    if (key === this.__stateKey) {
      return;
    }
    this.__stateKey = key;
    this.dispatchEvent(
      new CustomEvent("haxcms-admin-section-state", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: detail,
      }),
    );
  }

  /**
   * The outline's changes were sent or let go (Save, a confirmed page link
   * or import): the shell lets the modal close without its leave prompt.
   */
  _releaseShell() {
    if (!this.inShell) {
      return;
    }
    this.__shellReleased = true;
    this.__stateKey = "";
    this.dispatchEvent(
      new CustomEvent("haxcms-admin-section-state", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: { dirty: false, changes: [], canSave: false, selected: 0 },
      }),
    );
  }

  /**
   * Section contract: the shell's Save runs Save Outline as it was (same
   * confirm, same haxcms-save-outline detail). It returns the confirm's
   * answer as a promise: the shell shows Saving only when the save was
   * sent, and a cancelled confirm leaves the bar as it was.
   */
  save() {
    return this._saveTap();
  }

  /**
   * Section contract: put the outline back as it was loaded, the same way
   * the first load fills it from the site's manifest; nothing is sent.
   */
  discard() {
    const outline = this._getOutline();
    const items =
      store.manifest && Array.isArray(store.manifest.items)
        ? toJS(store.manifest.items)
        : [];
    this.__shellReleased = false;
    this.__stateKey = "";
    if (outline) {
      outline.selectedPages = [];
      outline._undo = null;
      if (typeof outline._hideNudge === "function") {
        outline._hideNudge();
      }
    }
    this.manifestItems = [...items];
    this.updateComplete.then(() => {
      if (outline && outline.__syncUIAndDataModel) {
        outline.__syncUIAndDataModel();
      }
    });
  }

  /**
   * The add area (area 9): documents become pages in the outline. A
   * chooser asks for one page or an outline of pages from the headings.
   */
  get addArea() {
    return {
      accept: ADMIN_DOCUMENT_TYPES.map((type) => `.${type}`).join(","),
      label: this.t.dropDocuments,
      browseLabel: this.t.browseDocuments,
      hint: this.t.dropDocumentsHint,
      message: this._addMessage,
      tone: this._addTone,
      disabled: this._addBusy,
      busy: this._addBusy,
    };
  }

  /** the row in focus, if it is a page still in the outline */
  _addTarget() {
    const outline = this._getOutline();
    const id = outline && outline._focusId ? String(outline._focusId) : "";
    const item =
      id && outline && Array.isArray(outline.items)
        ? outline.items.find((i) => String(i.id) === id && !i.delete)
        : null;
    return item ? { id: String(item.id), title: item.title || "" } : null;
  }

  /**
   * Section contract: files from the add area. Documents open the chooser
   * (one page, or an outline of pages for a single Word, PDF, PowerPoint
   * or HTML file); anything else is turned away to Files.
   * @param {{ files: File[] }} detail
   */
  addFiles(detail) {
    if (this._addBusy || !detail) {
      return;
    }
    const { taken, refused } = splitAdminAddFiles(
      detail.files,
      ADMIN_DOCUMENT_TYPES,
    );
    const turned = refused.length
      ? this.t.turnedAway.replace("{list}", () =>
          refused.map((file) => file.name).join(", "),
        )
      : "";
    if (taken.length === 0) {
      this._addMessage = `${this.t.onlyDocuments} ${turned}`.trim();
      this._addTone = "error";
      return;
    }
    this._addMessage = turned ? `${this.t.onlyDocuments} ${turned}` : "";
    this._addTone = "";
    this._addChoice = {
      files: taken,
      canOutline:
        taken.length === 1 &&
        ADMIN_OUTLINE_TYPES.includes(adminFileType(taken[0])),
      target: this._addTarget(),
    };
  }

  _renderAddChoice() {
    const choice = this._addChoice;
    const target = choice.target ? choice.target.title : this.t.theTopLevel;
    const question =
      choice.files.length === 1
        ? this.t.addUnder
            .replace("{name}", () => choice.files[0].name)
            .replace("{target}", () => target)
        : this.t.addManyUnder
            .replace("{count}", () => choice.files.length)
            .replace("{target}", () => target);
    return html`<div
      class="add-choice"
      role="group"
      aria-label="${question}"
      @keydown="${(e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          this._addChoice = null;
        }
      }}"
    >
      <p class="q">${question}</p>
      <button
        type="button"
        class="hax-ui-btn primary"
        data-choice="page"
        @click="${() => this._runAddChoice("page")}"
      >
        ${choice.files.length === 1 ? this.t.onePage : this.t.onePageEach}
      </button>
      ${choice.canOutline
        ? html`<button
            type="button"
            class="hax-ui-btn"
            data-choice="outline"
            @click="${() => this._runAddChoice("outline")}"
          >
            ${this.t.outlineOfPages}
          </button>`
        : nothing}
      <button
        type="button"
        class="hax-ui-btn ghost"
        data-choice="cancel"
        @click="${() => {
          this._addChoice = null;
        }}"
      >
        ${this.t.cancel}
      </button>
    </div>`;
  }

  /** the editor UI that runs Merlin's upload program */
  _editorUI() {
    return store &&
      store.cmsSiteEditor &&
      store.cmsSiteEditor.haxCmsSiteEditorUIElement
      ? store.cmsSiteEditor.haxCmsSiteEditorUIElement
      : null;
  }

  /** the values Merlin's upload builds once a file is chosen */
  async _addValues(file) {
    const type = adminFileType(file);
    return {
      operation: "file-selected",
      contents: ["md", "txt", "html", "htm"].includes(type)
        ? await file.text()
        : "",
      data: file,
      type: type,
    };
  }

  _waitForItem(id, timeout = 60000) {
    return new Promise((resolve) => {
      const started = Date.now();
      const check = () => {
        if (store.findItem(id)) {
          resolve(true);
        } else if (Date.now() - started > timeout) {
          resolve(false);
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  }

  _nextCreated(timeout = 60000) {
    return new Promise((resolve) => {
      let timer = null;
      const done = (e) => {
        globalThis.removeEventListener("haxcms-create-node-success", done);
        clearTimeout(timer);
        resolve(e && e.detail && e.detail.item ? e.detail.item : null);
      };
      globalThis.addEventListener("haxcms-create-node-success", done);
      timer = setTimeout(() => done(null), timeout);
    });
  }

  /**
   * Run the chooser's answer through Merlin's upload program. The outline
   * reloads from the site once pages are made, so unsaved outline changes
   * are confirmed away first, as Import from file does.
   * - one page: "new child page" under the focused row (or a top-level
   *   page), made at once (processFileContentsBasedOnUserDesire,
   *   create-child), keeping this dialog open
   * - outline of pages: Merlin's "outline from file" (create-branch) with
   *   the outline's parent left to the import step, which starts under
   *   the focused row; Save there adds the pages as Import from file does
   */
  async _runAddChoice(kind) {
    const choice = this._addChoice;
    this._addChoice = null;
    const ui = this._editorUI();
    if (!choice || !ui) {
      return;
    }
    if (!this._confirmDiscardUnsavedOutlineChanges()) {
      return;
    }
    if (this._hasUnsavedOutlineChanges()) {
      this.discard();
    }
    const target = choice.target;
    const targetTitle = target ? target.title : this.t.theTopLevel;
    this._addBusy = true;
    if (kind === "outline") {
      const file = choice.files[0];
      this._addMessage = this.t.readingOutline.replace(
        "{name}",
        () => file.name,
      );
      const values = await this._addValues(file);
      values.parentId = null;
      values.importTarget = target ? target.id : null;
      // the same import type Structure's Import from file sends
      values.importType = "structure";
      try {
        await ui.processFileContentsBasedOnUserDesire(values, "create-branch");
      } finally {
        this._addBusy = false;
        this._addMessage = "";
      }
      return;
    }
    let made = 0;
    let stoppedAt = null;
    for (let i = 0; i < choice.files.length; i++) {
      const file = choice.files[i];
      this._addMessage = this.t.makingPage
        .replace("{done}", () => i + 1)
        .replace("{count}", () => choice.files.length)
        .replace("{name}", () => file.name);
      const values = await this._addValues(file);
      values.keepOpen = true;
      if (target) {
        values.contextItemId = target.id;
      } else {
        values.createType = "branch";
      }
      const created = this._nextCreated();
      ui.processFileContentsBasedOnUserDesire(values, "create-child");
      const item = await created;
      const landed =
        item && item.id ? await this._waitForItem(String(item.id)) : false;
      if (!landed) {
        stoppedAt = file;
        break;
      }
      made++;
    }
    this._addBusy = false;
    const parts = [];
    if (made) {
      parts.push(
        (made === 1 ? this.t.madePage : this.t.madePages)
          .replace("{count}", () => made)
          .replace("{target}", () => targetTitle),
      );
    }
    if (stoppedAt) {
      parts.push(this.t.makingStopped.replace("{name}", () => stoppedAt.name));
    }
    this._addMessage = parts.join(" ");
    this._addTone = stoppedAt ? "error" : "";
  }

  /** Section contract: Delete selected, the outline's own toolbar delete */
  runAction(id) {
    const outline = this._getOutline();
    if (id === "delete-selected" && outline) {
      outline._deleteSelectedShown();
    }
  }

  /** Section contract: uncheck every page */
  clearSelection() {
    const outline = this._getOutline();
    if (outline) {
      outline.selectedPages = [];
      outline.requestUpdate();
    }
  }
}
globalThis.customElements.define(
  HAXCMSOutlineEditorDialog.tag,
  HAXCMSOutlineEditorDialog,
);
export { HAXCMSOutlineEditorDialog };
