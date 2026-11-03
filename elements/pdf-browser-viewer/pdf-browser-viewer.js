import { html, css, LitElement, nothing } from "lit";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
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
    return css`
      :host {
        display: none;
      }
      :host([file]) {
        display: inherit;
      }
      div.card {
        box-shadow: 0 5px 5px rgba(0, 0, 0, 0.7);
      }
      .card-heading {
        margin: 0 0 8px;
        font-size: 1.2em;
      }
      /* labelled frame shared with the other DDD learning blocks */
      .frame {
        box-sizing: border-box;
        width: 100%;
        max-width: 100%;
        border: var(--ddd-border-xs);
        border-color: light-dark(
          var(--ddd-theme-default-limestoneLight),
          var(--ddd-theme-default-slateGray)
        );
        border-radius: var(--ddd-radius-md);
        overflow: hidden;
        font-family: var(--ddd-font-primary);
      }
      .frame-header {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: var(--ddd-spacing-2) var(--ddd-spacing-3);
        padding-block: var(--ddd-spacing-2);
        padding-inline: var(--ddd-spacing-4) var(--ddd-spacing-2);
        border-bottom: var(--ddd-border-xs);
        border-color: light-dark(
          var(--ddd-theme-default-limestoneLight),
          var(--ddd-theme-default-slateGray)
        );
        min-height: var(--ddd-control-height-sm);
      }
      .frame-chip {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: none;
        width: var(--ddd-icon-xs);
        height: var(--ddd-icon-xs);
        border-radius: var(--ddd-radius-circle);
        background-color: light-dark(
          var(--ddd-theme-default-beaverBlue),
          var(--ddd-theme-default-skyBlue)
        );
        color: light-dark(
          var(--ddd-theme-default-white),
          var(--ddd-theme-default-potentialMidnight)
        );
        --simple-icon-width: var(--ddd-icon-3xs);
        --simple-icon-height: var(--ddd-icon-3xs);
      }
      .frame-text {
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
        min-width: 0;
      }
      .frame-label {
        font-family: var(--ddd-font-navigation);
        font-size: var(--ddd-font-size-4xs);
        font-weight: var(--ddd-font-weight-medium);
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: light-dark(
          var(--ddd-theme-default-slateGray),
          var(--ddd-theme-default-limestoneLight)
        );
      }
      :host(:lang(ar)) .frame-label,
      :host(:lang(fa)) .frame-label,
      :host(:lang(he)) .frame-label,
      :host(:lang(ur)) .frame-label {
        letter-spacing: 0;
      }
      .frame-title,
      .frame-text .card-heading {
        margin: var(--ddd-spacing-0);
        font-family: var(--ddd-font-primary);
        font-size: var(--ddd-font-size-xs);
        font-weight: var(--ddd-font-weight-bold);
        line-height: var(--ddd-lh-120);
        overflow-wrap: anywhere;
        color: light-dark(
          var(--ddd-theme-default-nittanyNavy),
          var(--ddd-theme-default-white)
        );
      }
      .frame-actions {
        display: inline-flex;
        align-items: center;
        gap: var(--ddd-spacing-2);
        margin-inline-start: auto;
      }
      .frame-open {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: none;
        box-sizing: border-box;
        width: var(--ddd-control-height-sm);
        height: var(--ddd-control-height-sm);
        padding: var(--ddd-spacing-0);
        border: var(--ddd-border-xs);
        border-color: light-dark(
          var(--ddd-theme-default-limestoneLight),
          var(--ddd-theme-default-slateGray)
        );
        border-radius: var(--ddd-radius-rounded);
        background-color: transparent;
        color: light-dark(
          var(--ddd-theme-default-nittanyNavy),
          var(--ddd-theme-default-linkLight)
        );
        cursor: pointer;
        --simple-icon-width: var(--ddd-icon-3xs);
        --simple-icon-height: var(--ddd-icon-3xs);
      }
      .frame-open:hover {
        border-color: light-dark(
          var(--ddd-theme-default-nittanyNavy),
          var(--ddd-theme-default-linkLight)
        );
      }
      .frame-open:focus-visible {
        outline: var(--ddd-focus-ring);
        outline-offset: var(--ddd-focus-offset);
      }
      .frame-body {
        display: block;
      }
      .frame-body object {
        display: block;
        max-width: 100%;
      }
      .frame-body:fullscreen {
        background-color: light-dark(
          var(--ddd-theme-default-white),
          var(--ddd-theme-default-potentialMidnight)
        );
      }
      .frame-body:fullscreen object {
        width: 100%;
        height: 100%;
      }
      /* the card download is the block primary action, in an action bar */
      .frame .card-actions {
        display: flex;
        justify-content: flex-end;
        padding: var(--ddd-spacing-2) var(--ddd-spacing-4);
        border-top: var(--ddd-border-xs);
        border-color: light-dark(
          var(--ddd-theme-default-limestoneLight),
          var(--ddd-theme-default-slateGray)
        );
      }
      .frame .card-actions button {
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
      .frame .card-actions button:focus-visible {
        outline: var(--ddd-focus-ring);
        outline-offset: var(--ddd-focus-offset);
      }
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    if (globalThis.document) {
      globalThis.document.addEventListener(
        "fullscreenchange",
        this._fullscreenChanged,
      );
    }
  }

  disconnectedCallback() {
    if (globalThis.document) {
      globalThis.document.removeEventListener(
        "fullscreenchange",
        this._fullscreenChanged,
      );
    }
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
    return !!(
      globalThis.document &&
      globalThis.document.fullscreenEnabled &&
      globalThis.HTMLElement &&
      globalThis.HTMLElement.prototype.requestFullscreen
    );
  }

  _fullscreenChanged() {
    const body = this.shadowRoot
      ? this.shadowRoot.querySelector(".frame-body")
      : null;
    this._fullscreen = !!(
      body &&
      this.shadowRoot.fullscreenElement &&
      this.shadowRoot.fullscreenElement === body
    );
  }

  /**
   * Toggle the viewer in and out of full screen
   */
  _toggleFullscreen() {
    const body = this.shadowRoot.querySelector(".frame-body");
    if (this._fullscreen && globalThis.document.exitFullscreen) {
      globalThis.document.exitFullscreen();
    } else if (body && body.requestFullscreen) {
      const request = body.requestFullscreen();
      if (request && request.catch) {
        request.catch(() => {});
      }
    }
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
    return html`<div class="frame-header">
      <span class="frame-chip" aria-hidden="true"
        ><simple-icon-lite icon="image:picture-as-pdf"></simple-icon-lite
      ></span>
      <span class="frame-text">
        <span class="frame-label" id="label">${this.t.document} · PDF</span>
        ${this.card && this.heading
          ? html`<h2 class="card-heading" id="title">${this.heading}</h2>`
          : title
            ? html`<span class="frame-title" id="title">${title}</span>`
            : nothing}
      </span>
      ${this.file
        ? html`<span class="frame-actions">
            <a
              class="frame-open"
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
            ${!this.card
              ? html`<a
                  class="frame-open"
                  href="${this.file}"
                  download="${this._fileName || nothing}"
                  aria-label="${this.t.downloadPdf}"
                  title="${this.t.downloadPdf}"
                  ><simple-icon-lite
                    icon="icons:file-download"
                    aria-hidden="true"
                  ></simple-icon-lite
                ></a>`
              : nothing}
            ${this._canFullscreen
              ? html`<button
                  class="frame-open"
                  type="button"
                  aria-label="${fsLabel}"
                  title="${fsLabel}"
                  aria-pressed="${this._fullscreen ? "true" : "false"}"
                  @click="${this._toggleFullscreen}"
                >
                  <simple-icon-lite
                    icon="${this._fullscreen
                      ? "icons:fullscreen-exit"
                      : "icons:fullscreen"}"
                    aria-hidden="true"
                  ></simple-icon-lite>
                </button>`
              : nothing}
          </span>`
        : nothing}
    </div>`;
  }

  render() {
    const labelledby = this.heading || this._fileName ? "label title" : "label";
    return html`
      ${this.card
        ? html`
            <div
              class="card frame"
              elevation="${this.elevation}"
              role="group"
              aria-labelledby="${labelledby}"
            >
              ${this.renderHeader()}
              <div class="card-content frame-body">${this.renderObject()}</div>
              <div class="card-actions">
                <button @click="${this._download}">
                  ${this.downloadLabel}
                </button>
              </div>
            </div>
          `
        : html`
            <div
              class="frame"
              role="group"
              aria-labelledby="${labelledby}"
              style="width: ${this._frameWidth()}"
            >
              ${this.renderHeader()}
              <div class="frame-body">${this.renderObject()}</div>
            </div>
          `}
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
