/**
 * Copyright 2025 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { store } from "../haxcms-site-store.js";
import { toJS, autorun } from "mobx";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/simple-toolbar/lib/simple-toolbar-button.js";
import { contextMenuShortcut } from "@haxtheweb/simple-fields/lib/simple-context-menu.js";
import { KeyboardShortcutManagerInstance } from "@haxtheweb/utils/utils.js";
import { HaxUiAdminIcons } from "@haxtheweb/d-d-d/lib/HaxUiAdminIcons.js";

export class HAXCMSPageOperations extends I18NMixin(DDD) {
  static get tag() {
    return "haxcms-page-operations";
  }
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: inline-block;
          position: relative;
        }
        simple-icon-button-lite.ops {
          --simple-icon-button-border-width: 1px;
          --simple-icon-button-border-color: var(
            --ddd-theme-default-limestoneLight,
            #e4e5e7
          );
          --simple-icon-height: var(
            --haxcms-page-operations-ops-icon-size,
            var(--ddd-icon-4xs, 14px)
          );
          --simple-icon-width: var(
            --haxcms-page-operations-ops-icon-size,
            var(--ddd-icon-4xs, 14px)
          );
          padding: var(--ddd-spacing-1) var(--ddd-spacing-1);
          color: var(--ddd-theme-default-white);
          background-color: var(--ddd-theme-default-skyBlue);
          border: var(--ddd-border-xs);
          box-shadow: var(--ddd-boxShadow-sm);
          position: relative;
          height: var(--haxcms-page-operations-ops-height, 24px);
          width: var(--haxcms-page-operations-ops-width, 24px);
        }
        @media (max-width: 600px) {
          #outlineactionsbtn {
            display: none;
          }
        }
      `,
    ];
  }
  static get properties() {
    return {
      ...super.properties,
      actionId: { type: String, attribute: "action-id" },
      isLocked: { type: Boolean },
      // Track global edit mode so we can disable page creation while editing
      editMode: { type: Boolean },
    };
  }
  constructor() {
    super();
    this.actionId = null;
    this.isLocked = false;
    this.editMode = false;
    this.t = {
      ...super.t,
      outlineActions: "Outline Actions",
      editPage: "Edit Page",
      addPage: "Add child page",
      moveUp: "Move Up",
      moveDown: "Move Down",
      indent: "Indent",
      outdent: "Outdent",
      moveTo: "Move to...",
      siteOutline: "Open Site Outline",
      delete: "Delete Page",
      unlock: "Unlock",
      lock: "Lock",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../../../locales/", import.meta.url).href,
    });

    // store subscriptions live only while connected (see connectedCallback)
    this.__disposer = [];
  }

  connectedCallback() {
    // These autoruns used to be created in the constructor and never stored,
    // so they could not be disposed: every instance ever made kept reacting
    // (and cloning store.activeItem) on each navigation for the life of the
    // tab. Created before super so the first render has the values.
    if (this.__disposer.length === 0) {
      // Watch for active item lock state; reads only the flag it needs
      this.__disposer.push(
        autorun(() => {
          const activeItem = store.activeItem;
          const locked =
            activeItem && activeItem.metadata && activeItem.metadata.locked
              ? true
              : false;
          Promise.resolve().then(() => {
            this.isLocked = locked;
          });
        }),
      );
      // Keep local editMode in sync with global store state so we can
      // hide page creation controls while actively editing content
      this.__disposer.push(
        autorun(() => {
          const _mobx_val_0 = toJS(store.editMode);
          Promise.resolve().then(() => {
            this.editMode = _mobx_val_0;
          });
        }),
      );
    }
    super.connectedCallback();
    store.pageOperationsElement = this;
  }

  disconnectedCallback() {
    this.__disposer.forEach((dispose) => dispose());
    this.__disposer = [];
    if (store.pageOperationsElement === this) {
      store.pageOperationsElement = null;
    }
    super.disconnectedCallback();
  }

  _toggleDialog() {
    const menu = this.shadowRoot.querySelector("simple-context-menu");
    const button = this.shadowRoot.querySelector(".ops");
    if (menu && button) {
      menu.toggle(button);
    }
  }

  render() {
    // Hide entire menu if outline designer is disabled
    if (!store.platformAllows("outlineDesigner")) {
      return html``;
    }

    return html`
      <simple-icon-button-lite
        class="ops"
        id="outlineactionsbtn"
        icon="${HaxUiAdminIcons.edit}"
        label="${this.t.outlineActions}"
        title="${this.t.outlineActions}"
        @click="${this._toggleDialog}"
      ></simple-icon-button-lite>
      <simple-context-menu title="${this.t.outlineActions}">
        ${
          store.platformAllows("addPage") && !this.editMode
            ? html`
                <haxcms-button-add
                  id="addpagebutton"
                  class="top-bar-button"
                  icon="hax:add-page"
                  icon-position="left"
                  label="${this.t.addPage}"
                  type="child"
                  action-id="${this.actionId}"
                  shortcut-label="${this._shortcut("cms-add-page").label}"
                  key-shortcuts="${this._shortcut("cms-add-page").aria}"
                  merlin
                  @click="${this._closeDialog}"
                  show-text-label
                  autofocus
                ></haxcms-button-add>
              `
            : ""
        }
        <simple-toolbar-button
          icon="${HaxUiAdminIcons.moveUp}"
          icon-position="left"
          align-horizontal="left"
          show-text-label
          label="${this.t.moveUp}"
          ?disabled="${this.isLocked}"
          @click=${() => this._op("moveUp")}
        ></simple-toolbar-button>
        <simple-toolbar-button
          icon="${HaxUiAdminIcons.moveDown}"
          icon-position="left"
          align-horizontal="left"
          show-text-label
          label="${this.t.moveDown}"
          ?disabled="${this.isLocked}"
          @click=${() => this._op("moveDown")}
        ></simple-toolbar-button>
        <simple-toolbar-button
          icon="hax:outline-designer-indent"
          icon-position="left"
          align-horizontal="left"
          show-text-label
          label="${this.t.indent}"
          ?disabled="${this.isLocked}"
          @click=${() => this._op("indent")}
        ></simple-toolbar-button>
        <simple-toolbar-button
          icon="hax:outline-designer-outdent"
          icon-position="left"
          align-horizontal="left"
          show-text-label
          label="${this.t.outdent}"
          ?disabled="${this.isLocked}"
          @click=${() => this._op("outdent")}
        ></simple-toolbar-button>
        <simple-toolbar-button
          icon="icons:open-with"
          icon-position="left"
          align-horizontal="left"
          show-text-label
          label="${this.t.moveTo}"
          ?disabled="${this.isLocked}"
          @click=${this._movePageProgram}
        ></simple-toolbar-button>
        <simple-toolbar-button
          icon="hax:site-map"
          icon-position="left"
          align-horizontal="left"
          show-text-label
          label="${this.t.siteOutline}"
          @click=${this._openSiteOutline}
        ></simple-toolbar-button>
        ${
          this.isLocked
            ? html`
                <simple-toolbar-button
                  icon="icons:lock"
                  icon-position="left"
                  align-horizontal="left"
                  show-text-label
                  label="${this.t.unlock}"
                  @click=${this._toggleLock}
                ></simple-toolbar-button>
              `
            : html``
        }
        ${
          store.platformAllows("deletePage")
            ? html`
                <hr />
                <simple-toolbar-button
                  class="delete-button danger"
                  icon="${HaxUiAdminIcons.delete}"
                  icon-position="left"
                  align-horizontal="left"
                  show-text-label
                  label="${this.t.delete}"
                  ?disabled="${this.isLocked}"
                  @click=${this._deletePage}
                ></simple-toolbar-button>
              `
            : ""
        }
      </simple-context-menu>
    `;
  }
  _contextItem() {
    return (async () => {
      let item = {};
      if (this.actionId && this.actionId != "null") {
        item = await store.findItemAsObject(this.actionId);
      } else if (this.actionId == "null") {
        item = toJS(await store.getLastChildItem(null));
      } else {
        item = toJS(store.activeItem);
      }
      return item;
    })();
  }
  async _op(operation) {
    const item = await this._contextItem();
    if (!item || !item.id) {
      this._closeDialog();
      return;
    }
    store.playSound("click");
    const detail = { id: item.id, idOrSlug: item.id, operation };
    this.dispatchEvent(
      new CustomEvent("haxcms-save-node-details", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail,
      }),
    );
    this._closeDialog();
  }
  _editPage() {
    this._closeDialog();
    store.cmsSiteEditor.haxCmsSiteEditorUIElement._editButtonTap();
  }

  _deletePage() {
    this._closeDialog();
    store.cmsSiteEditor.haxCmsSiteEditorUIElement._deleteButtonTap();
  }

  async _movePageProgram() {
    this._closeDialog();
    const item = await this._contextItem();
    if (!item || !item.id) {
      return;
    }
    const SuperDaemonInstance =
      globalThis.SuperDaemonManager.requestAvailability();
    store.playSound("click");
    // Use waveWand for proper mini-Merlin invocation
    SuperDaemonInstance.waveWand([
      "", // no initial search term
      "/", // program context
      { pageId: item.id }, // pass the page ID to move
      "move-page", // program machine name
      "Move Page", // program display name
      "", // no initial search
    ]);
  }

  _closeDialog() {
    const menu =
      this.shadowRoot && this.shadowRoot.querySelector("simple-context-menu");
    if (menu) {
      menu.close();
    }
  }

  async _toggleLock() {
    this._closeDialog();
    const item = await this._contextItem();
    if (!item || !item.id) {
      return;
    }
    store.playSound("click");
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-save-node-details", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          id: item.id,
          idOrSlug: item.id,
          operation: "setLocked",
          locked: !this.isLocked,
        },
      }),
    );
  }

  /**
   * The global shortcut registered for an action (the same one Merlin
   * lists), shown at the end of its menu row; empty when none is
   * registered
   */
  _shortcut(id) {
    const descriptor = KeyboardShortcutManagerInstance.getById(id);
    return contextMenuShortcut(
      descriptor && descriptor.type !== "markdown" ? descriptor : null,
    );
  }

  _openSiteOutline() {
    this._closeDialog();
    store.cmsSiteEditor.haxCmsSiteEditorUIElement._outlineButtonTap();
  }
}

customElements.define(HAXCMSPageOperations.tag, HAXCMSPageOperations);
