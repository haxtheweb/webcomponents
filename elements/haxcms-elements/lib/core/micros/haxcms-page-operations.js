import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { store } from "../haxcms-site-store.js";
import { toJS, autorun } from "mobx";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/simple-toolbar/lib/simple-toolbar-menu-item.js";
import "@haxtheweb/simple-toolbar/lib/simple-toolbar-button.js";

export class HAXCMSPageOperations extends DDD {
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
          --simple-icon-height: var(--ddd-icon-xxs, 14px);
          --simple-icon-width: var(--ddd-icon-xxs, 14px);
          padding: var(--ddd-spacing-1) var(--ddd-spacing-1);
          background-color: var(--ddd-theme-background, #ffffff);
          color: var(--ddd-theme-text, #222);
          position: relative;
          top: -2px;
        }
        dialog {
          position: fixed;
          background: light-dark(
            var(--simple-toolbar-button-bg, white),
            var(--simple-toolbar-button-bg, #222)
          );
          border: var(--ddd-border-sm);
          border-color: light-dark(
            var(--simple-toolbar-button-border-color, var(--simple-toolbar-border-color, #e0e0e0)),
            var(--simple-toolbar-button-border-color, var(--simple-toolbar-border-color, #444))
          );
          color: light-dark(
            var(--simple-toolbar-button-color, #222),
            var(--simple-toolbar-button-color, #e0e0e0)
          );
          min-width: 180px;
          padding: 0;
          margin: 0;
          max-height: 80vh;
          overflow: auto;
          box-shadow: var(--simple-toolbar-menu-list-box-shadow, light-dark(
            0 2px 8px rgba(0,0,0,0.15),
            0 2px 8px rgba(0,0,0,0.5)
          ));
        }
        dialog::backdrop {
          background: transparent;
        }
        simple-toolbar-menu-item {
          display: block;
        }
        .menu-header {
          padding: var(--ddd-spacing-3) var(--ddd-spacing-3) var(--ddd-spacing-2);
          font-weight: var(--ddd-font-weight-bold);
          font-size: var(--ddd-font-size-xs);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: var(--ddd-border-sm);
          margin-bottom: var(--ddd-spacing-1);
        }
      `,
    ];
  }
  static get properties() {
    return {
      actionId: { type: String, attribute: "action-id" },
      platformAllowsOutline: { type: Boolean },
      platformAllowsDelete: { type: Boolean },
      platformAllowsAddPage: { type: Boolean },
    };
  }
  constructor() {
    super();
    this.actionId = null;
    this.platformAllowsOutline = true;
    this.platformAllowsDelete = true;
    this.platformAllowsAddPage = true;
    
    // Watch for platform configuration changes
    autorun(() => {
      const manifest = toJS(store.manifest);
      const platformConfig = manifest && manifest.metadata && manifest.metadata.platform;
      
      // Check each capability - defaults to true if not specified
      this.platformAllowsOutline = !platformConfig || platformConfig.outlineDesigner !== false;
      this.platformAllowsDelete = !platformConfig || platformConfig.delete !== false;
      this.platformAllowsAddPage = !platformConfig || platformConfig.addPage !== false;
    });
  }

  _toggleDialog() {
    const dialog = this.shadowRoot.querySelector("#menu");
    if (!dialog) return;
    
    if (dialog.open) {
      dialog.close();
    } else {
      const button = this.shadowRoot.querySelector('.ops');
      dialog.showModal();
      // Position dialog near the button
      if (button) {
        const rect = button.getBoundingClientRect();
        dialog.style.top = `${rect.bottom + 4}px`;
        dialog.style.left = `${rect.left}px`;
      }
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
        icon="icons:more-vert"
        label="Page actions"
        title="Page actions"
        @click="${this._toggleDialog}"
      ></simple-icon-button-lite>
      <dialog id="menu" role="menu" @click=${this._handleBackdropClick}>
        <div class="menu-header">Page Actions</div>
        <simple-toolbar-menu-item>
          <simple-toolbar-button
            icon="icons:create"
            icon-position="left"
            align-horizontal="left"
            show-text-label
            label="Edit"
            @click=${this._editPage}
            autofocus
          ></simple-toolbar-button>
        </simple-toolbar-menu-item>
        ${this.platformAllowsAddPage ? html`
          <simple-toolbar-menu-item>
            <haxcms-button-add
              id="addpagebutton"
              class="top-bar-button"
              icon="hax:add-page"
              icon-position="left"
              label="Add page"
              merlin
              @click="${this._closeDialog}"
              show-text-label
            ></haxcms-button-add>
          </simple-toolbar-menu-item>
        ` : ''}
        <simple-toolbar-menu-item>
          <simple-toolbar-button
            icon="icons:arrow-upward"
            icon-position="left"
            align-horizontal="left"
            show-text-label
            label="Move up"
            @click=${() => this._op("moveUp")}
          ></simple-toolbar-button>
        </simple-toolbar-menu-item>
        <simple-toolbar-menu-item>
          <simple-toolbar-button
            icon="icons:arrow-downward"
            icon-position="left"
            align-horizontal="left"
            show-text-label
            label="Move down"
            @click=${() => this._op("moveDown")}
          ></simple-toolbar-button>
        </simple-toolbar-menu-item>
        <simple-toolbar-menu-item>
          <simple-toolbar-button
            icon="editor:format-indent-increase"
            icon-position="left"
            align-horizontal="left"
            show-text-label
            label="Indent"
            @click=${() => this._op("indent")}
          ></simple-toolbar-button>
        </simple-toolbar-menu-item>
        <simple-toolbar-menu-item>
          <simple-toolbar-button
            icon="editor:format-indent-decrease"
            icon-position="left"
            align-horizontal="left"
            show-text-label
            label="Outdent"
            @click=${() => this._op("outdent")}
          ></simple-toolbar-button>
        </simple-toolbar-menu-item>
        <simple-toolbar-menu-item>
          <simple-toolbar-button
            icon="icons:open-with"
            icon-position="left"
            align-horizontal="left"
            show-text-label
            label="Move to.."
            @click=${this._movePageProgram}
          ></simple-toolbar-button>
        </simple-toolbar-menu-item>
        ${this.platformAllowsDelete ? html`
          <simple-toolbar-menu-item>
            <simple-toolbar-button
              icon="icons:delete"
              icon-position="left"
              align-horizontal="left"
              show-text-label
              label="Delete"
              @click=${this._deletePage}
            ></simple-toolbar-button>
          </simple-toolbar-menu-item>
        ` : ''}
      </dialog>
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
    const editButton = globalThis.document.querySelector('haxcms-site-editor-ui')._editButtonTap();
  }

  _deletePage() {
    this._closeDialog();
    const deleteButton = globalThis.document.querySelector('haxcms-site-editor-ui')._deleteButtonTap();
  }

  async _movePageProgram() {
    this._closeDialog();
    const item = await this._contextItem();
    if (!item || !item.id) {
      return;
    }
    const SuperDaemonInstance = globalThis.SuperDaemonManager.requestAvailability();
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
    const dialog = this.shadowRoot && this.shadowRoot.querySelector("#menu");
    if (dialog && dialog.open) {
      dialog.close();
    }
  }
  
  _handleBackdropClick(e) {
    const dialog = e.target;
    if (e.target.nodeName === 'DIALOG') {
      const rect = dialog.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        dialog.close();
      }
    }
  }
}

customElements.define(HAXCMSPageOperations.tag, HAXCMSPageOperations);
