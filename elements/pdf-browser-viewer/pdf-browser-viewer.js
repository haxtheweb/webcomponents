import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import "@polymer/polymer/lib/elements/dom-if.js";
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
    this.$.pdfViewer.clear();
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
class PdfBrowserViewer extends PolymerElement {
  constructor() {
    super();
    import("@polymer/paper-card/paper-card.js");
    import("@polymer/paper-button/paper-button.js");
  }
  static get template() {
    return html`
      <style>
        :host {
          display: none;
        }
        :host([file]) {
          display: inherit;
        }
      </style>

      <template is="dom-if" if="[[card]]">
        <paper-card heading="[[heading]]" elevation="[[elevation]]">
          <div class="card-content">
            <object
              data="[[file]]"
              type="application/pdf"
              width="[[width]]"
              height="[[height]]"
            >
              <p>
                {{notSupportedMessage}}
                <a href="[[file]]">{{notSupportedLinkMessage}}</a>
              </p>
            </object>
          </div>
          <div class="card-actions">
            <paper-button on-click="_download">[[downloadLabel]]</paper-button>
          </div>
        </paper-card>
      </template>

      <template is="dom-if" if="[[!card]]">
        <object
          data="[[file]]"
          type="application/pdf"
          width="[[width]]"
          height="[[height]]"
        >
          <p>
            {{notSupportedMessage}}
            <a href="[[file]]">{{notSupportedLinkMessage}}</a>
          </p>
        </object>
      </template>
    `;
  }

  static get tag() {
    return "pdf-browser-viewer";
  }

  static get properties() {
    return {
      /**
       * The location of the PDF file.
       *
       * @type String
       */
      file: {
        type: String,
        value: undefined,
        reflectToAttribute: true
      },
      /**
       * The message when browser doesn't support pdf object
       *
       * @type String
       */
      notSupportedMessage: {
        type: String,
        value:
          "It appears your Web browser is not configured to display PDF files. No worries, just"
      },
      /**
       * The PDF link message when browser doesn't support pdf object
       *
       * @type String
       */
      notSupportedLinkMessage: {
        type: String,
        value: "click here to download the PDF file."
      },
      /**
       * The height of the PDF viewer.
       *
       * @type String
       */
      height: {
        type: String,
        value: "400px"
      },
      /**
       * The width of the PDF viewer.
       *
       * @type String
       */
      width: {
        type: String,
        value: "100%"
      },
      /**
       * PDF viewer as a card with download button.
       *
       * @type Boolean
       */
      card: {
        type: Boolean,
        value: false
      },
      /**
       * Download button label.
       *
       * @type String
       */
      downloadLabel: {
        type: String,
        value: "Download"
      },
      /**
       * The z-depth of the card, from 0-5.
       *
       * @type String
       */
      elevation: {
        type: String,
        value: "1"
      }
    };
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
    window.location = this.file;
  }
}
window.customElements.define(PdfBrowserViewer.tag, PdfBrowserViewer);
export { PdfBrowserViewer };
