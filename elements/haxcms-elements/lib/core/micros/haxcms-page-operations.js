import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { store } from "../haxcms-site-store.js";
import { toJS, autorun } from "mobx";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/simple-toolbar/lib/simple-toolbar-button.js";
import "@haxtheweb/simple-fields/lib/simple-context-menu.js";

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
          --simple-icon-button-border-color: var(--ddd-border-1, #e0e0e0);
          --simple-icon-height: var(--haxcms-page-operations-ops-icon-size, var(--ddd-icon-4xs, 14px));
          --simple-icon-width: var(--haxcms-page-operations-ops-icon-size, var(--ddd-icon-4xs, 14px));
          padding: var(--ddd-spacing-1) var(--ddd-spacing-1);
          color: var(--ddd-theme-default-white);
          background-color: var(--ddd-theme-default-skyBlue);
          border: var(--ddd-border-xs);
          box-shadow: var(--ddd-boxShadow-sm);
          position: relative;
          height: var(--haxcms-page-operations-ops-height, 24px);
          width: var(--haxcms-page-operations-ops-width, 24px);
        }
        simple-context-menu {
          --simple-context-menu-background: var(
            --simple-toolbar-button-bg,
            white
          );
          --simple-context-menu-background-dark: var(
            --simple-toolbar-button-bg,
            #000000
          );
          --simple-context-menu-border-color: var(
            --simple-toolbar-button-border-color,
            var(--simple-toolbar-border-color, #e0e0e0)
          );
          --simple-context-menu-border-color-dark: var(
            --simple-toolbar-button-border-color,
            var(--simple-toolbar-border-color, #444)
          );
          --simple-context-menu-shadow: var(
            --simple-toolbar-menu-list-box-shadow,
            0 2px 8px rgba(0, 0, 0, 0.15)
          );
          --simple-context-menu-min-width: 180px;
        }
        simple-toolbar-button {
          --simple-toolbar-button-border-radius: 0;
          --simple-toolbar-button-hover-border-color: transparent;
          cursor: pointer;
        }
        simple-toolbar-button.delete-button {
          border-top: var(--ddd-border-sm) solid
            var(--ddd-theme-default-limestoneGray);
          margin-top: var(--ddd-spacing-2);
          padding-top: var(--ddd-spacing-2);
        }
        simple-toolbar-button.delete-button:hover {
          color: var(--ddd-theme-default-error);
          background-color: var(--ddd-theme-default-errorLight);
        }
      `,
    ];
  }
  static get properties() {
    return {
      ...super.properties,
      actionId: { type: String, attribute: "action-id" },
      platformAllowsOutline: { type: Boolean },
      platformAllowsDelete: { type: Boolean },
      platformAllowsAddPage: { type: Boolean },
      isLocked: { type: Boolean },
    };
  }
  constructor() {
    super();
    this.actionId = null;
    this.platformAllowsOutline = true;
    this.platformAllowsDelete = true;
    this.platformAllowsAddPage = true;
    this.isLocked = false;
    this.t = {...super.t,
      outlineActions: "Outline actions",
      editPage: "Edit page",
      addPage: "Add child page",
      moveUp: "Move up",
      moveDown: "Move down",
      indent: "Indent",
      outdent: "Outdent",
      moveTo: "Move to..",
      siteOutline: "Site Outline",
      delete: "Delete",
      unlock: "Unlock",
      lock: "Lock",
    };
    this.registerLocalization({
      context: this,
      basePath: import.meta.url,
    });

    // Watch for platform configuration changes
    autorun(() => {
      const manifest = toJS(store.manifest);
      const platformConfig =
        manifest && manifest.metadata && manifest.metadata.platform;

      // Check each capability - defaults to true if not specified
      this.platformAllowsOutline =
        !platformConfig || platformConfig.outlineDesigner !== false;
      this.platformAllowsDelete =
        !platformConfig || platformConfig.delete !== false;
      this.platformAllowsAddPage =
        !platformConfig || platformConfig.addPage !== false;
    });

    // Watch for active item lock state
    autorun(() => {
      const activeItem = toJS(store.activeItem);
      this.isLocked =
        activeItem && activeItem.metadata && activeItem.metadata.locked
          ? true
          : false;
    });
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
    if (!this.platformAllowsOutline) {
      return html``;
    }

    return html`
      <simple-icon-button-lite
        class="ops"
        icon="icons:create"
        label="${this.t.outlineActions}"
        title="${this.t.outlineActions}"
        @click="${this._toggleDialog}"
      ></simple-icon-button-lite>
      <simple-context-menu title="${this.t.outlineActions}">
        ${this.platformAllowsAddPage
          ? html`
              <haxcms-button-add
                id="addpagebutton"
                class="top-bar-button"
                icon="hax:add-page"
                icon-position="left"
                label="${this.t.addPage}"
                merlin
                @click="${this._closeDialog}"
                show-text-label
                autofocus
              ></haxcms-button-add>
            `
          : ""}
        <simple-toolbar-button
          icon="icons:arrow-upward"
          icon-position="left"
          align-horizontal="left"
          show-text-label
          label="${this.t.moveUp}"
          ?disabled="${this.isLocked}"
          @click=${() => this._op("moveUp")}
        ></simple-toolbar-button>
        <simple-toolbar-button
          icon="icons:arrow-downward"
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
        ${this.isLocked
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
          : html``}
        ${this.platformAllowsDelete
          ? html`
              <simple-toolbar-button
                class="delete-button"
                icon="icons:delete"
                icon-position="left"
                align-horizontal="left"
                show-text-label
                label="${this.t.delete}"
                ?disabled="${this.isLocked}"
                @click=${this._deletePage}
              ></simple-toolbar-button>
            `
          : ""}
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
    const detail = { id: item.id, operation };
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
          operation: "setLocked",
          locked: !this.isLocked,
        },
      }),
    );
  }

  _openSiteOutline() {
    this._closeDialog();
    store.cmsSiteEditor.haxCmsSiteEditorUIElement._outlineButtonTap();
  }
}

customElements.define(HAXCMSPageOperations.tag, HAXCMSPageOperations);
