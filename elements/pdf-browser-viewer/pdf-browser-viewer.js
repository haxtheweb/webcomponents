import { html, css, LitElement } from "lit";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
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
        card elevation="3"
        download-label="Baixar">
    </pdf-browser-viewer>
```

* @demo demo/index.html
*/
class PdfBrowserViewer extends LitElement {
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
    `;
  }

  render() {
    return html`
      ${this.card
        ? html`
            <div heading="${this.heading}" elevation="${this.elevation}">
              <div class="card-content">
                <object
                  data="${this.file}"
                  type="application/pdf"
                  width="${this.width}"
                  height="${this.height}"
                >
                  <p>
                    ${this.notSupportedMessage}
                    <a href="${this.file}">${this.notSupportedLinkMessage}</a>
                  </p>
                </object>
              </div>
              <div class="card-actions">
                <button @click="${this._download}">
                  ${this.downloadLabel}
                </button>
              </div>
            </div>
          `
        : html`
            <object
              data="${this.file}"
              type="application/pdf"
              width="${this.width}"
              height="${this.height}"
            >
              <p>
                ${this.notSupportedMessage}
                <a href="${this.file}">${this.notSupportedLinkMessage}</a>
              </p>
            </object>
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
      },
      /**
       * The PDF link message when browser doesn't support pdf object
       */
      notSupportedLinkMessage: {
        type: String,
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
       * Download button label.
       */
      downloadLabel: {
        type: String,
      },
      /**
       * The z-depth of the card, from 0-5.
       */
      elevation: {
        type: String,
      },
    };
  }

  constructor() {
    super();
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
}
globalThis.customElements.define(PdfBrowserViewer.tag, PdfBrowserViewer);
export { PdfBrowserViewer };
