/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { A11yFootnotesManager } from "./lib/a11y-footnotes.js";

/**
 * `a11y-footnote`
 * An accessible footnote written inline, where the note belongs. The note is
 * the element's own content, so it stays in the saved HTML and still reads
 * in place where the element never loads. Once loaded, the note becomes a
 * numbered reference, and the numbered list of every note on the page
 * assembles itself at the bottom of the content (`a11y-footnotes`); authors
 * never place the list (haxtheweb/issues#280).
 *
 * @demo demo/index.html
 * @element a11y-footnote
 */
export class A11yFootnote extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "a11y-footnote";
  }

  constructor() {
    super();
    this.number = 0;
    this.noPreview = false;
    this._previewOpen = false;
    this.t = this.t || {};
    this.t = {
      ...this.t,
      footnote: "Footnote",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("./locales/", import.meta.url).href,
    });
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * Reading-order number, set by the footnotes manager
       */
      number: { type: Number, reflect: true },
      /**
       * Turn off the note preview shown on hover and focus
       */
      noPreview: { type: Boolean, reflect: true, attribute: "no-preview" },
      _previewOpen: { type: Boolean, state: true },
      _previewFlip: { type: Boolean, state: true },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: inline;
          position: relative;
        }
        :host([hidden]) {
          display: none;
        }
        .inline-note {
          font-size: 0.85em;
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-limestoneGray)
          );
        }
        sup {
          font-size: 0.75em;
          line-height: 0;
          vertical-align: super;
        }
        a {
          color: var(--ddd-theme-primary, var(--ddd-theme-default-link));
          font-weight: var(--ddd-font-weight-bold);
          text-decoration: none;
          padding: 0 var(--ddd-spacing-1);
          border-radius: var(--ddd-radius-xs);
        }
        a:hover,
        a:focus-visible {
          text-decoration: underline;
        }
        a:focus-visible {
          outline: var(--ddd-border-size-md) solid
            var(--ddd-theme-default-keystoneYellow);
          outline-offset: 1px;
        }
        .preview {
          position: absolute;
          z-index: 3;
          inset-inline-start: var(--ddd-spacing-0);
          top: 1.6em;
          width: max-content;
          max-width: min(320px, 80vw);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-regular);
          line-height: var(--ddd-lh-140);
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          border: var(--ddd-border-xs);
          border-inline-start: var(--ddd-border-lg);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-theme-default-slateGray)
          );
          border-inline-start-color: var(
            --ddd-theme-primary,
            var(--ddd-theme-default-link)
          );
          border-radius: var(--ddd-radius-sm);
          box-shadow: var(--ddd-boxShadow-md);
        }
        .preview.flip {
          inset-inline-start: auto;
          inset-inline-end: var(--ddd-spacing-0);
        }
        .preview[hidden] {
          display: none;
        }
        @media print {
          .preview {
            display: none;
          }
        }
      `,
    ];
  }

  render() {
    // before the manager numbers it, the note shows where it was written
    if (!this.number) {
      return html`<span class="inline-note" part="inline-note"
        >[<slot></slot>]</span
      >`;
    }
    return html`<sup
        ><a
          part="reference"
          href="#a11y-footnote-${this.number}"
          aria-label="${this.t.footnote} ${this.number}"
          aria-describedby="preview"
          @mouseenter="${this._showPreview}"
          @mouseleave="${this._hidePreview}"
          @focus="${this._showPreview}"
          @blur="${this._hidePreview}"
          @keydown="${this._keydown}"
          >${this.number}</a
        ></sup
      ><span
        id="preview"
        class="preview ${this._previewFlip ? "flip" : ""}"
        part="preview"
        role="tooltip"
        ?hidden="${!this._previewOpen}"
        >${this.noteText()}</span
      >`;
  }

  /**
   * The note as plain text, for the preview
   */
  noteText() {
    return (this.textContent || "").replace(/\s+/g, " ").trim();
  }

  /**
   * Focus the reference link, used by the list's "back to reference" link
   */
  focusReference() {
    const link = this.shadowRoot && this.shadowRoot.querySelector("a");
    if (link) {
      link.focus();
    }
  }

  _showPreview() {
    // touch screens go straight to the list; a preview covering text is
    // hard to dismiss on a phone
    if (
      this.noPreview ||
      (globalThis.matchMedia && globalThis.matchMedia("(hover: none)").matches)
    ) {
      return;
    }
    // a reference near the end of a line opens its preview toward the start
    const rect = this.getBoundingClientRect();
    const width = globalThis.innerWidth || 0;
    this._previewFlip = width > 0 && rect.left > width / 2;
    this._previewOpen = true;
  }

  _hidePreview() {
    this._previewOpen = false;
  }

  _keydown(e) {
    if (e.key === "Escape") {
      this._hidePreview();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    A11yFootnotesManager.register(this);
  }

  disconnectedCallback() {
    A11yFootnotesManager.unregister(this);
    super.disconnectedCallback();
  }

  /**
   * HAX hooks this element implements
   */
  haxHooks() {
    return {
      gizmoRegistration: "haxgizmoRegistration",
      editModeChanged: "haxeditModeChanged",
    };
  }

  /**
   * While editing, the note text is what the author edits in place
   */
  haxeditModeChanged(value) {
    this.editing = value;
    A11yFootnotesManager.schedule();
  }

  /**
   * Register the haxProperties locales so HAX can translate the editor UI.
   * Files live at locales/a11y-footnote.haxProperties.<lang>.json
   */
  haxgizmoRegistration(_store) {
    globalThis.dispatchEvent(
      new CustomEvent("i18n-manager-register-element", {
        detail: {
          namespace: `a11y-footnote.haxProperties`,
          localesPath: new URL(`./locales`, import.meta.url).href,
        },
      }),
    );
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(A11yFootnote.tag, A11yFootnote);
