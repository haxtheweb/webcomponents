import { HaxcmsAdminSectionMixin } from "./admin/HaxcmsAdminSectionMixin.js";
import { LitElement, html, css } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { toJS } from "mobx";
import { HaxUiAdminControls } from "@haxtheweb/d-d-d/lib/HaxUiAdminControls.js";
import { HAXCMSI18NMixin } from "./utils/HAXCMSI18NMixin.js";
import "@haxtheweb/outline-designer/outline-designer.js";

/**
 * `haxcms-outline-import-dialog`
 * Structure's import step inside the one admin dialog: the pages an import
 * found, in an outline-designer to arrange before they are added. Save
 * sends the same haxcms-create-node event (with outline-designer getData())
 * the old stand-alone import dialog sent, so the backend call and what it
 * does afterwards are unchanged.
 *
 * Section contract (haxcms-site-admin): a form section that is dirty from
 * the start (nothing has been imported yet), so the shell shows Save and
 * asks before you leave with the import unsaved.
 *
 * @element haxcms-outline-import-dialog
 */
class HAXCMSOutlineImportDialog extends HaxcmsAdminSectionMixin(
  HAXCMSI18NMixin(LitElement),
) {
  static get tag() {
    return "haxcms-outline-import-dialog";
  }

  static get styles() {
    return [
      ...HaxUiAdminControls,
      css`
        :host {
          display: flex;
          flex-direction: column;
          min-height: 0;
          height: 100%;
          font-family: var(--ddd-font-navigation);
          color-scheme: var(--hax-ui-color-scheme, inherit);
        }
        outline-designer {
          flex: 1 1 auto;
          min-height: 0;
          overflow: auto;
          margin-bottom: 0;
          padding: 0 var(--ddd-spacing-5, 20px);
          overscroll-behavior: contain;
        }
        outline-designer:not(:defined) {
          display: none;
        }
        .empty {
          padding: var(--ddd-spacing-5, 20px);
        }
        @media (max-width: 768px) {
          outline-designer {
            padding: 0 var(--ddd-spacing-3, 12px);
          }
        }
      `,
    ];
  }

  static get properties() {
    return {
      /** the items the import returned, in JSON Outline Schema form */
      items: { type: Array },
      /** set by the shell before it connects */
      inShell: { type: Boolean, reflect: true, attribute: "in-shell" },
    };
  }

  constructor() {
    super();
    this.items = [];
    this.inShell = false;
    this.__saved = false;
    this.t = this.t || {};
    this.t = {
      ...this.t,
      importPageReady: "{count} page ready to import",
      importPagesReady: "{count} pages ready to import",
      nothingToImport: "There is nothing to import.",
    };
  }

  render() {
    if (!Array.isArray(this.items) || this.items.length === 0) {
      return html`<p class="hax-ui-note empty">${this.t.nothingToImport}</p>`;
    }
    return html`<outline-designer
      id="outline"
      store-tools
      hide-delete
      .storeTools="${true}"
      .hideDelete="${true}"
      .items="${this.items}"
      .eventData="${this._eventData()}"
    ></outline-designer>`;
  }

  _siteName() {
    const manifest = toJS(store.manifest);
    return manifest &&
      manifest.metadata &&
      manifest.metadata.site &&
      manifest.metadata.site.name
      ? manifest.metadata.site.name
      : "";
  }

  _eventData() {
    return {
      site: { name: this._siteName() },
      items: this.items,
    };
  }

  _count() {
    return Array.isArray(this.items) ? this.items.length : 0;
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (changedProperties.has("items") || changedProperties.has("inShell")) {
      this._emitState();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this._emitState();
  }

  _emitState() {
    if (!this.inShell || this.__saved) {
      return;
    }
    const count = this._count();
    const text = (
      count === 1 ? this.t.importPageReady : this.t.importPagesReady
    ).replace("{count}", () => String(count));
    this._dispatchSectionState({
      dirty: count > 0,
      canSave: count > 0,
      changes: count > 0 ? [text] : [],
      count: count,
    });
  }

  /**
   * Shell Save: add the arranged pages. Returns true right away; the pages
   * are read from outline-designer and sent on the next tick.
   */
  save() {
    const designer = this.shadowRoot
      ? this.shadowRoot.querySelector("outline-designer")
      : null;
    if (!designer || this._count() === 0) {
      return false;
    }
    this.__saved = true;
    Promise.resolve(designer.getData()).then((data) => {
      // the create request closes the dialog when it finishes; report the
      // save as sent so the shell lets that close through
      globalThis.dispatchEvent(
        new CustomEvent("haxcms-admin-save-result", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: { operation: "importOutline", ok: true },
        }),
      );
      globalThis.dispatchEvent(
        new CustomEvent("haxcms-create-node", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: {
            originalTarget: this,
            values: data,
          },
        }),
      );
    });
    return true;
  }

  /** Shell Discard: put the pages back the way the import returned them */
  discard() {
    const designer = this.shadowRoot
      ? this.shadowRoot.querySelector("outline-designer")
      : null;
    if (designer) {
      designer.items = [];
      this.updateComplete.then(() => {
        designer.items = JSON.parse(JSON.stringify(this.items || []));
        // still unsaved: nothing has been imported yet
        this._emitState();
      });
    }
  }
}

globalThis.customElements.define(
  HAXCMSOutlineImportDialog.tag,
  HAXCMSOutlineImportDialog,
);
export { HAXCMSOutlineImportDialog };
