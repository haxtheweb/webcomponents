import { HaxcmsAdminSectionMixin } from "./admin/HaxcmsAdminSectionMixin.js";
import { LitElement, html, css, nothing } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import { HAXCMSI18NMixin } from "./utils/HAXCMSI18NMixin.js";
import "@haxtheweb/json-outline-schema/json-outline-schema.js";
import "@haxtheweb/outline-designer/outline-designer.js";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-toolbar/lib/simple-toolbar-button.js";
import { HaxUiAdminIcons } from "@haxtheweb/d-d-d/lib/HaxUiAdminIcons.js";
import { adminConfirm } from "./admin/haxcms-admin-confirm.js";
/**
 * `haxcms-outline-editor-dialog`
 * `Dialog for presenting an editable outline`
 *
 * @demo demo/index.html
 *
 * @microcopy - the mental model for this element
 */
class HAXCMSOutlineEditorDialog extends HaxcmsAdminSectionMixin(
  HAXCMSI18NMixin(LitElement),
) {
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
        outline-designer {
          flex: 1 1 auto;
          min-height: 0;
          overflow: auto;
          margin-bottom: 0;
          overscroll-behavior: contain;
        }
        /* on its own (outside the site admin dialog): the HAX UI action
           bar, Save Outline as its primary action at the bottom right */
        .buttons {
          flex: none;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          min-height: 56px;
          padding: var(--ddd-spacing-2, 8px) var(--ddd-spacing-5, 20px);
          border-top: 1px solid
            light-dark(
              var(--ddd-theme-default-limestoneLight, #e4e5e7),
              rgba(255, 255, 255, 0.18)
            );
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
          height: 32px;
          padding: 0 var(--ddd-spacing-4, 16px);
          margin: 0;
          white-space: nowrap;
          font-family: var(--ddd-font-navigation);
          font-size: 14px;
          font-weight: var(--ddd-font-weight-bold, 700);
          color: light-dark(
            var(--ddd-theme-default-white, #ffffff),
            var(--ddd-theme-default-potentialMidnight, #000321)
          );
          background-color: light-dark(
            var(--ddd-theme-default-nittanyNavy, #001e44),
            var(--ddd-theme-default-linkLight, #cce9ff)
          );
          border: 1px solid transparent;
          border-radius: var(--ddd-radius-xs, 4px);
          cursor: pointer;
          transition: background-color var(--ddd-duration-fast, 150ms) ease;
        }
        button.hax-modal-btn:hover {
          background-color: light-dark(
            var(--ddd-theme-default-beaverBlue, #1e407c),
            var(--ddd-theme-default-skyLight, #ccf0ff)
          );
        }
        button.hax-modal-btn:focus-visible {
          outline: 2px solid
            light-dark(
              var(--ddd-theme-default-link, #005fa9),
              var(--ddd-theme-default-keystoneYellow, #ffd100)
            );
          outline-offset: 2px;
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
        ?host-actions="${this.inShell}"
        @outline-designer-rendered="${this._emitState}"
        @outline-designer-request-navigate="${this._outlineNavigateRequested}"
        .hidden="${this.viewMode}"
        .items="${this.manifestItems}"
      ></outline-designer>
      ${
        this.inShell
          ? nothing
          : html`<div class="buttons">
              <button
                type="button"
                @click="${this._saveTap}"
                class="hax-modal-btn"
              >
                ${this.t.save}
              </button>
            </div>`
      }
    `;
  }
  constructor() {
    super();
    this.__disposer = [];
    this.__windowAbortController = null;
    this.__allowNextModalClose = false;
    // fingerprint of the items in flight from Save Outline, and of the items
    // a save confirmed; see _isSavedOutlineState
    this.__pendingSaveKey = null;
    this.__savedItemsKey = null;
    this._onAdminSaveResult = this._onAdminSaveResult.bind(this);
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
      addPage: "Add page",
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
      outlineUnsavedTitle: "Discard outline changes?",
      outlineSaveTitle: "Save outline changes?",
      discardChanges: "Discard changes",
      keepEditing: "Keep editing",
      cancel: "Cancel",
      deleteSelected: "Delete selected",
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
    globalThis.addEventListener(
      "haxcms-admin-save-result",
      this._onAdminSaveResult,
      { signal: this.__windowAbortController.signal },
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
            // fresh items from the manifest carry no change flags, so a
            // saved fingerprint has nothing left to stand in for
            this.__savedItemsKey = null;
            // the outline is replaced by what the server stored, so an
            // undo can no longer reach back past it (haxtheweb/issues#3253)
            this._clearOutlineUndo();
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
  _outlineItemsKey(items) {
    if (!Array.isArray(items)) {
      return null;
    }
    try {
      return JSON.stringify(items);
    } catch {
      return null;
    }
  }
  /**
   * After Save Outline succeeds the items keep their new/modified/delete
   * flags until the store manifest refresh replaces them, a few hundred ms
   * or more later. Leave checks in that window (e.g. the route re-sync the
   * editor runs when the active page's slug changed) would see changes that
   * are already saved and ask to discard them. While the outline still holds
   * exactly what the successful save sent, it has nothing unsaved.
   */
  _isSavedOutlineState(items) {
    if (!this.__savedItemsKey) {
      return false;
    }
    return this._outlineItemsKey(items) === this.__savedItemsKey;
  }
  _onAdminSaveResult(e) {
    const detail = e && e.detail ? e.detail : null;
    if (
      !detail ||
      detail.operation !== "@site/updateSiteOutline" ||
      this.__pendingSaveKey === null
    ) {
      return;
    }
    // only a confirmed save stands in for the manifest; a failed one leaves
    // every change unsaved and the shell's error state untouched
    if (detail.ok) {
      this.__savedItemsKey = this.__pendingSaveKey;
    }
    this.__pendingSaveKey = null;
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
    if (this._isSavedOutlineState(outline.items)) {
      return false;
    }
    const summary = this._getItemChangeSummary(outline.items);
    return summary.added > 0 || summary.modified > 0 || summary.deleted > 0;
  }
  /**
   * Ask before dropping unsaved outline changes, with the HAX UI confirm.
   * Resolves true right away when there is nothing to lose. While one ask is
   * open a second request answers false, so a double click cannot run the
   * leave twice.
   * @returns {Promise<boolean>}
   */
  _confirmDiscardUnsavedOutlineChanges() {
    const outline = this._getOutline();
    if (!outline || !Array.isArray(outline.items)) {
      return Promise.resolve(true);
    }
    if (this._isSavedOutlineState(outline.items)) {
      return Promise.resolve(true);
    }
    const summary = this._getItemChangeSummary(outline.items);
    const sumChanges = this._formatItemChangeSummary(summary);
    if (sumChanges == "") {
      return Promise.resolve(true);
    }
    if (this.__askingDiscard) {
      return Promise.resolve(false);
    }
    this.__askingDiscard = true;
    return adminConfirm({
      title: this.t.outlineUnsavedTitle,
      // the summary's last line break would add a blank line before the
      // question in the dialog
      message: this.t.outlineUnsavedChangesConfirm.replace("{changes}", () =>
        sumChanges.replace(/\n$/, ""),
      ),
      confirmLabel: this.t.discardChanges,
      cancelLabel: this.t.keepEditing,
      danger: true,
    }).then((ok) => {
      this.__askingDiscard = false;
      return ok;
    });
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
   * @returns {Promise<boolean>} true to leave
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
    if (!this._hasUnsavedOutlineChanges()) {
      return;
    }
    // hold the close, ask, then close again on a yes (the flag lets that
    // second close through)
    e.preventDefault();
    if (e.stopImmediatePropagation) {
      e.stopImmediatePropagation();
    }
    const modal = e.target;
    this._confirmDiscardUnsavedOutlineChanges().then((ok) => {
      if (!ok) {
        store.playSound("error");
        return;
      }
      this.__allowNextModalClose = true;
      if (modal && typeof modal.close === "function") {
        modal.close();
      }
    });
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
    if (this.__allowNextBreadcrumb) {
      this.__allowNextBreadcrumb = false;
      return;
    }
    if (!this._hasUnsavedOutlineChanges()) {
      return;
    }
    // hold the click, ask, then send the same click again on a yes
    e.preventDefault();
    if (e.stopImmediatePropagation) {
      e.stopImmediatePropagation();
    }
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    const modal = e.target;
    const detail = e.detail;
    this._confirmDiscardUnsavedOutlineChanges().then((ok) => {
      if (!ok) {
        store.playSound("error");
        return;
      }
      this.__allowNextBreadcrumb = true;
      (modal || globalThis).dispatchEvent(
        new CustomEvent("simple-modal-breadcrumb-click", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: detail,
        }),
      );
    });
  }
  _outlineNavigateRequested(e) {
    if (!e || !e.detail || !e.detail.href) {
      return;
    }
    if (this.__allowNextNavigate) {
      this.__allowNextNavigate = false;
      return;
    }
    if (!this._hasUnsavedOutlineChanges()) {
      return;
    }
    // hold the jump, ask, then let the same page link go on a yes
    e.preventDefault();
    if (e.stopImmediatePropagation) {
      e.stopImmediatePropagation();
    }
    const outline = e.target;
    const item = e.detail.item;
    const href = e.detail.href;
    this._confirmDiscardUnsavedOutlineChanges().then((ok) => {
      if (!ok) {
        store.playSound("error");
        return;
      }
      this.__allowNextModalClose = true;
      this._releaseShell();
      const index =
        outline && Array.isArray(outline.items) && item
          ? outline.items.indexOf(item)
          : -1;
      if (index !== -1 && typeof outline.itemOp === "function") {
        // outline-designer's own goto: hides the modal and follows the link
        this.__allowNextNavigate = true;
        outline.itemOp(index, "goto");
        return;
      }
      globalThis.dispatchEvent(
        new CustomEvent("simple-modal-hide", {
          bubbles: true,
          cancelable: true,
          detail: {},
        }),
      );
      globalThis.location.href = href;
    });
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
      confirmation = await adminConfirm({
        title: this.t.outlineSaveTitle,
        message: this.t.outlineSaveConfirm.replace("{changes}", () =>
          sumChanges.replace(/\n$/, ""),
        ),
        confirmLabel: this.t.save,
        cancelLabel: this.t.cancel,
      });
    }
    if (confirmation) {
      this.__savedItemsKey = null;
      this.__pendingSaveKey = this._outlineItemsKey(outline.items);
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
    const summary = this._isSavedOutlineState(outline.items)
      ? { added: 0, modified: 0, deleted: 0 }
      : this._getItemChangeSummary(outline.items);
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
      actions: [
        {
          // the outline's own toolbar Add page, here instead in the shell
          id: "add-page",
          label: this.t.addPage,
          icon: HaxUiAdminIcons.add,
          needsSelection: false,
        },
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
    this._dispatchSectionState(detail);
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
    this._dispatchSectionState({
      dirty: false,
      changes: [],
      canSave: false,
      selected: 0,
    });
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

  // drop the designer's pending undo; older bundles lack clearUndo()
  _clearOutlineUndo() {
    const outline = this._getOutline();
    if (!outline) {
      return;
    }
    if (typeof outline.clearUndo === "function") {
      outline.clearUndo();
    } else {
      outline._undo = null;
    }
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
      this._clearOutlineUndo();
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
   * Section contract: Add page and Delete selected run what the outline's
   * own toolbar buttons run
   */
  runAction(id) {
    const outline = this._getOutline();
    if (!outline) {
      return;
    }
    if (id === "add-page") {
      outline._addTop();
    } else if (id === "delete-selected") {
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
