import { html, css, LitElement, nothing } from "lit";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import {
  DDDBlockStyles,
  renderDDDBlockHeader,
  canDDDBlockFullscreen,
  isDDDBlockFullscreen,
  toggleDDDBlockFullscreen,
  listenDDDBlockFullscreen,
} from "@haxtheweb/d-d-d/lib/DDDBlock.js";
/**
@license
Copyright (c) 2016 The Ingresso Rápido Web Components Authors. All rights reserved.
This code may only be used under the BSD style license found at http://ingressorapidowebcomponents.github.io/LICENSE.txt
The complete set of authors may be found at http://ingressorapidowebcomponents.github.io/AUTHORS.txt
The complete set of contributors may be found at http://ingressorapidowebcomponents.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
/**


Example:
```html
    <pdf-browser-viewer id="pdfViewer" file="[[pdfUrl]]" width="100%"></pdf-browser-viewer>
```

Data Bind with Blob example:
```js
    this.pdfUrl = URL.createObjectURL(blob);
```

Clear PDF container example:
```js
    this.shadowRoot.querySelector('#pdfViewer').clear();
```

Message example:
```html
    <pdf-browser-viewer
        file="[[pdfUrl]]"
        not-supported-message="Not supported by your browser"
        not-supported-link-message="see the file here!">
    </pdf-browser-viewer>
```

Card example:
```html
    <pdf-browser-viewer
        file="[[pdfUrl]]"
        card
        heading="Quarterly Report"
        elevation="3"
        download-label="Baixar">
    </pdf-browser-viewer>
```

* @demo demo/index.html
*/
class PdfBrowserViewer extends I18NMixin(LitElement) {
  static get styles() {
    return [
      DDDBlockStyles,
      css`
        :host {
          display: none;
        }
        :host([file]) {
          display: inherit;
        }
        div.card {
          box-shadow: 0 5px 5px rgba(0, 0, 0, 0.7);
        }
        /* labelled frame shared with the other DDD learning blocks */
        .ddd-block {
          width: 100%;
          max-width: 100%;
        }
        .ddd-block-header {
          flex-wrap: wrap;
          row-gap: var(--ddd-spacing-2);
        }
        .ddd-block-actions {
          margin-inline-start: auto;
        }
        .ddd-block-body object {
          display: block;
          max-width: 100%;
        }
        .ddd-block-body:fullscreen {
          background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
        }
        .ddd-block-body:fullscreen object {
          width: 100%;
          height: 100%;
        }
        /* the card download is the block primary action, in an action bar */
        .ddd-block .card-actions {
          display: flex;
          justify-content: flex-end;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-4);
          border-top: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
        }
        .ddd-block .card-actions button {
          min-height: var(--ddd-control-height-sm);
          padding: var(--ddd-spacing-0) var(--ddd-spacing-4);
          border: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-linkLight)
          );
          border-radius: var(--ddd-radius-rounded);
          background-color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-linkLight)
          );
          color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-medium);
          cursor: pointer;
        }
        .ddd-block .card-actions button:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
      `,
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    listenDDDBlockFullscreen(this._fullscreenChanged, true);
  }

  disconnectedCallback() {
    listenDDDBlockFullscreen(this._fullscreenChanged, false);
    super.disconnectedCallback();
  }

  /**
   * File name shown as the title when there is no heading; blob and data
   * urls have no meaningful name so they get none
   */
  get _fileName() {
    if (!this.file || typeof this.file !== "string") {
      return "";
    }
    if (/^(blob|data):/i.test(this.file)) {
      return "";
    }
    const name = this.file.split(/[?#]/)[0].split("/").pop() || "";
    try {
      return decodeURIComponent(name);
    } catch {
      return name;
    }
  }

  /**
   * Full screen is offered only where the browser supports it
   */
  get _canFullscreen() {
    return canDDDBlockFullscreen();
  }

  _fullscreenChanged() {
    const body = this.shadowRoot
      ? this.shadowRoot.querySelector(".ddd-block-body")
      : null;
    this._fullscreen = isDDDBlockFullscreen(this.shadowRoot, body);
  }

  /**
   * Toggle the viewer in and out of full screen
   */
  _toggleFullscreen() {
    const body = this.shadowRoot.querySelector(".ddd-block-body");
    toggleDDDBlockFullscreen(body, this._fullscreen);
  }

  /**
   * The frame takes the authored width (a bare number means pixels) and
   * the viewer fills the frame, so a fixed width no longer leaves an empty
   * band beside the viewer.
   */
  _frameWidth() {
    const w = String(this.width || "100%").trim();
    return /^\d+(\.\d+)?$/.test(w) ? `${w}px` : w;
  }

  renderObject() {
    return html`<object
      aria-label="${this.heading || "PDF document"}"
      data="${this.file}"
      type="application/pdf"
      width="100%"
      height="${this.height}"
    >
      <p>
        ${this.notSupportedMessage}
        <a href="${this.file}">${this.notSupportedLinkMessage}</a>
      </p>
    </object>`;
  }

  renderHeader() {
    const title = this.heading || this._fileName;
    const fsLabel = this._fullscreen
      ? this.t.exitFullScreen
      : this.t.fullScreen;
    return renderDDDBlockHeader({
      icon: "image:picture-as-pdf",
      label: html`<span id="label">${this.t.document} · PDF</span>`,
      after:
        this.card && this.heading
          ? html`<h2
              class="ddd-block-title card-heading"
              id="title"
              .textContent="${this.heading}"
            ></h2>`
          : title
            ? html`<span class="ddd-block-title" id="title">${title}</span>`
            : nothing,
      actions: this.file
        ? html`<a
              class="ddd-block-action"
              href="${this.file}"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="${this.t.openInNewTab}"
              title="${this.t.openInNewTab}"
              ><simple-icon-lite
                icon="icons:open-in-new"
                aria-hidden="true"
              ></simple-icon-lite
            ></a>
            ${
              !this.card
                ? html`<a
                    class="ddd-block-action"
                    href="${this.file}"
                    download="${this._fileName || nothing}"
                    aria-label="${this.t.downloadPdf}"
                    title="${this.t.downloadPdf}"
                    ><simple-icon-lite
                      icon="icons:file-download"
                      aria-hidden="true"
                    ></simple-icon-lite
                  ></a>`
                : nothing
            }
            ${
              this._canFullscreen
                ? html`<button
                    class="ddd-block-action"
                    type="button"
                    aria-label="${fsLabel}"
                    title="${fsLabel}"
                    aria-pressed="${this._fullscreen ? "true" : "false"}"
                    @click="${this._toggleFullscreen}"
                  >
                    <simple-icon-lite
                      icon="${
                        this._fullscreen
                          ? "icons:fullscreen-exit"
                          : "icons:fullscreen"
                      }"
                      aria-hidden="true"
                    ></simple-icon-lite>
                  </button>`
                : nothing
            }`
        : null,
    });
  }

  render() {
    const labelledby = this.heading || this._fileName ? "label title" : "label";
    return html`
      ${
        this.card
          ? html`
              <div
                class="card ddd-block"
                elevation="${this.elevation}"
                role="group"
                aria-labelledby="${labelledby}"
              >
                ${this.renderHeader()}
                <div class="card-content ddd-block-body">
                  ${this.renderObject()}
                </div>
                <div class="card-actions">
                  <button @click="${this._download}">
                    ${this.downloadLabel}
                  </button>
                </div>
              </div>
            `
          : html`
              <div
                class="ddd-block"
                role="group"
                aria-labelledby="${labelledby}"
                style="width: ${this._frameWidth()}"
              >
                ${this.renderHeader()}
                <div class="ddd-block-body">${this.renderObject()}</div>
              </div>
            `
      }
    `;
  }

  static get tag() {
    return "pdf-browser-viewer";
  }

  static get properties() {
    return {
      /**
       * The location of the PDF file.
       */
      file: {
        type: String,
        reflect: true,
      },
      /**
       * The message when browser doesn't support pdf object
       */
      notSupportedMessage: {
        type: String,
        attribute: "not-supported-message",
      },
      /**
       * The PDF link message when browser doesn't support pdf object
       */
      notSupportedLinkMessage: {
        type: String,
        attribute: "not-supported-link-message",
      },
      /**
       * The height of the PDF viewer.
       */
      height: {
        type: String,
      },
      /**
       * The width of the PDF viewer.
       */
      width: {
        type: String,
      },
      /**
       * PDF viewer as a card with download button.
       */
      card: {
        type: Boolean,
      },
      /**
       * The heading for the card variant.
       */
      heading: {
        type: String,
      },
      /**
       * Download button label.
       */
      downloadLabel: {
        type: String,
        attribute: "download-label",
      },
      /**
       * The z-depth of the card, from 0-5.
       */
      elevation: {
        type: String,
      },
      _fullscreen: { type: Boolean, state: true },
    };
  }

  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      document: "Document",
      openInNewTab: "Open the PDF in a new tab",
      downloadPdf: "Download the PDF",
      fullScreen: "Full screen",
      exitFullScreen: "Exit full screen",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("./locales/", import.meta.url).href,
    });
    this._fullscreen = false;
    this._fullscreenChanged = this._fullscreenChanged.bind(this);
    this.file = undefined;
    this.notSupportedMessage =
      "It appears your Web browser is not configured to display PDF files. No worries, just";
    this.notSupportedLinkMessage = "click here to download the PDF file.";
    this.height = "400px";
    this.width = "100%";
    this.card = false;
    this.downloadLabel = "Download";
    this.elevation = "1";
  }
  /**
   * Clear PDF container
   */
  clear() {
    this.file = undefined;
  }
  /**
   * Downloads the pdf file
   */
  _download() {
    globalThis.location = this.file;
  }
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}
globalThis.customElements.define(PdfBrowserViewer.tag, PdfBrowserViewer);
export { PdfBrowserViewer };
