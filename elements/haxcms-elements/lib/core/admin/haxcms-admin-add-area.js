/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import {
  HaxUiAdminStyles,
  HaxUiAdminIcons,
} from "@haxtheweb/d-d-d/lib/HaxUiAdminStyles.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";

/**
 * `haxcms-admin-add-area`
 * Area 9 of the admin layout, the add area of the record panels that take
 * new records (Content, Files; Structure only arranges pages): a dashed
 * drop zone at the top right of the page
 * header. Dropping files on it, or choosing them with Browse, fires
 * `admin-add-files` with `{ files, event }`; the panel turns them into its
 * own kind of record and answers in place. A short message (a live region)
 * says what happened.
 *
 * The site admin shell draws it from the `addArea` a section reports and
 * calls the section's `addFiles(detail)`; a section outside the shell draws
 * it in its own header.
 *
 * @fires admin-add-files - detail `{ files: File[], event }`
 * @fires admin-add-browse - when `browse-handled` is set, Browse asks the
 *   panel to open its own picker instead of this one's
 * @element haxcms-admin-add-area
 */
export class HAXCMSAdminAddArea extends LitElement {
  static get tag() {
    return "haxcms-admin-add-area";
  }

  static get properties() {
    return {
      /** the file input's accept list, e.g. ".docx,.pdf" */
      accept: { type: String },
      /** words before Browse */
      label: { type: String },
      /** the Browse word */
      browseLabel: { type: String, attribute: "browse-label" },
      /** read out on the button: what dropping here does */
      hint: { type: String },
      /** what just happened, read out politely */
      message: { type: String },
      /** "error" or "" for the message's tone */
      tone: { type: String },
      disabled: { type: Boolean, reflect: true },
      /** working on the last drop: shows progress, takes no more */
      busy: { type: Boolean, reflect: true },
      /** the panel opens its own picker for Browse (Files' upload field) */
      browseHandled: { type: Boolean, attribute: "browse-handled" },
      _over: { state: true },
    };
  }

  constructor() {
    super();
    this.accept = "";
    this.label = "Drop documents here or";
    this.browseLabel = "browse";
    this.hint = "";
    this.message = "";
    this.tone = "";
    this.disabled = false;
    this.busy = false;
    this.browseHandled = false;
    this._over = false;
  }

  static get styles() {
    return [
      ...HaxUiAdminStyles,
      css`
        :host {
          display: block;
          flex: none;
          width: min(360px, 45%);
          min-width: 220px;
          font-family: var(--hax-ui-admin-font-family);
        }
        :host([hidden]) {
          display: none;
        }
        /* one button: click (or Enter / Space) to browse, or drop on it */
        .drop {
          all: unset;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          width: 100%;
          min-height: 44px;
          padding: 0 var(--hax-ui-gap-lg);
          cursor: pointer;
          border: 1px dashed var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius-lg);
          font-size: 13px;
          color: var(--hax-ui-text-muted);
          background-color: var(--hax-ui-hover);
          transition:
            border-color var(--hax-ui-duration) var(--hax-ui-easing),
            background-color var(--hax-ui-duration) var(--hax-ui-easing);
        }
        .drop:hover {
          border-color: var(--hax-ui-accent-strong);
          color: var(--hax-ui-text);
        }
        .drop:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }
        .drop.over {
          border-style: solid;
          border-color: var(--hax-ui-accent-strong);
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-accent-soft);
        }
        .drop[disabled] {
          cursor: default;
          opacity: 0.6;
        }
        .icon {
          --simple-icon-width: 18px;
          --simple-icon-height: 18px;
          flex: none;
          color: var(--hax-ui-text);
        }
        .text {
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .text b {
          font-weight: var(--ddd-font-weight-bold, 700);
          color: var(--hax-ui-text);
        }
        /* the shared muted note, red when it is an error */
        .msg {
          margin: var(--hax-ui-gap) 0 0;
        }
        .msg[data-tone="error"] {
          color: var(--hax-ui-danger);
        }
        .msg:empty {
          display: none;
        }
        input[type="file"] {
          display: none;
        }
      `,
    ];
  }

  render() {
    const off = this.disabled || this.busy;
    return html`
      <button
        type="button"
        class="drop ${this._over ? "over" : ""}"
        part="drop"
        aria-label="${`${this.label} ${this.browseLabel}`.trim()}"
        aria-describedby="hint msg"
        ?disabled="${off}"
        @click="${this._browse}"
        @dragenter="${this._onDrag}"
        @dragover="${this._onDrag}"
        @dragleave="${this._onLeave}"
        @drop="${this._onDrop}"
      >
        <simple-icon-lite
          class="icon"
          icon="${this.busy ? "hax:loading" : HaxUiAdminIcons.upload}"
          aria-hidden="true"
        ></simple-icon-lite>
        <span class="text" aria-hidden="true"
          >${this.label} <b>${this.browseLabel}</b></span
        >
      </button>
      <span class="hax-ui-sr-only" id="hint">${this.hint || ""}</span>
      <p
        class="hax-ui-note msg"
        id="msg"
        role="status"
        aria-live="polite"
        data-tone="${this.tone || nothing}"
      >
        ${this.message || ""}
      </p>
      <input
        type="file"
        multiple
        tabindex="-1"
        aria-hidden="true"
        accept="${this.accept || nothing}"
        @change="${this._onPicked}"
      />
    `;
  }

  /** Browse: this area's picker, or the panel's own when it has one */
  _browse() {
    if (this.disabled || this.busy) {
      return;
    }
    if (this.browseHandled) {
      this.dispatchEvent(
        new CustomEvent("admin-add-browse", {
          bubbles: true,
          composed: true,
        }),
      );
      return;
    }
    const input = this.shadowRoot.querySelector("input[type=file]");
    if (input) {
      input.value = "";
      input.click();
    }
  }

  _onPicked(e) {
    const files = Array.from(e.target.files || []);
    if (files.length) {
      this._send(files, null);
    }
  }

  _onDrag(e) {
    if (this.disabled || this.busy) {
      return;
    }
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "copy";
    }
    this._over = true;
  }

  _onLeave(e) {
    const to = e.relatedTarget;
    if (to && e.currentTarget.contains(to)) {
      return;
    }
    this._over = false;
  }

  _onDrop(e) {
    e.preventDefault();
    this._over = false;
    if (this.disabled || this.busy) {
      return;
    }
    const files = Array.from(
      e.dataTransfer && e.dataTransfer.files ? e.dataTransfer.files : [],
    );
    if (files.length) {
      this._send(files, e);
    }
  }

  _send(files, event) {
    this.dispatchEvent(
      new CustomEvent("admin-add-files", {
        bubbles: true,
        composed: true,
        detail: { files: files, event: event },
      }),
    );
  }
}

/**
 * Split files into the ones a panel takes and the ones it turns away, by
 * extension.
 * @param {File[]} files
 * @param {string[]} types lower-case extensions without the dot
 */
export function splitAdminAddFiles(files, types) {
  const taken = [];
  const refused = [];
  (files || []).forEach((file) => {
    const type = adminFileType(file);
    if (types.includes(type)) {
      taken.push(file);
    } else {
      refused.push(file);
    }
  });
  return { taken, refused };
}

/** a file's lower-case extension, as Merlin's upload reads it */
export function adminFileType(file) {
  const parts = String(file && file.name ? file.name : "").split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "";
}

/** the documents Content turns into pages */
export const ADMIN_DOCUMENT_TYPES = Object.freeze([
  "docx",
  "doc",
  "pdf",
  "pptx",
  "md",
  "txt",
  "html",
  "htm",
]);
if (!globalThis.customElements.get(HAXCMSAdminAddArea.tag)) {
  globalThis.customElements.define(HAXCMSAdminAddArea.tag, HAXCMSAdminAddArea);
}
