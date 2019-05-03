define(["exports","./node_modules/@polymer/polymer/polymer-legacy.js","./node_modules/@polymer/paper-card/paper-card.js","./node_modules/@polymer/paper-button/paper-button.js"],function(_exports,_polymerLegacy,_paperCard,_paperButton){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.PdfBrowserViewer=void 0;function _templateObject_28eea7e06a8311e9b44ce59a633934a6(){var data=babelHelpers.taggedTemplateLiteral(["\n    <style>\n      :host {\n        display: none;\n      }\n      :host([file]) {\n        display: inherit;\n      }\n    </style>\n\n    <template is=\"dom-if\" if=\"[[card]]\">\n      <paper-card heading=\"[[heading]]\" elevation=\"[[elevation]]\">\n        <div class=\"card-content\">\n          <object\n            data=\"[[file]]\"\n            type=\"application/pdf\"\n            width=\"[[width]]\"\n            height=\"[[height]]\"\n          >\n            <p>\n              {{notSupportedMessage}}\n              <a href=\"[[file]]\">{{notSupportedLinkMessage}}</a>\n            </p>\n          </object>\n        </div>\n        <div class=\"card-actions\">\n          <paper-button on-click=\"_download\">[[downloadLabel]]</paper-button>\n        </div>\n      </paper-card>\n    </template>\n\n    <template is=\"dom-if\" if=\"[[!card]]\">\n      <object\n        data=\"[[file]]\"\n        type=\"application/pdf\"\n        width=\"[[width]]\"\n        height=\"[[height]]\"\n      >\n        <p>\n          {{notSupportedMessage}}\n          <a href=\"[[file]]\">{{notSupportedLinkMessage}}</a>\n        </p>\n      </object>\n    </template>\n  "]);_templateObject_28eea7e06a8311e9b44ce59a633934a6=function _templateObject_28eea7e06a8311e9b44ce59a633934a6(){return data};return data}/**
@license
Copyright (c) 2016 The Ingresso Rápido Web Components Authors. All rights reserved.
This code may only be used under the BSD style license found at http://ingressorapidowebcomponents.github.io/LICENSE.txt
The complete set of authors may be found at http://ingressorapidowebcomponents.github.io/AUTHORS.txt
The complete set of contributors may be found at http://ingressorapidowebcomponents.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/ /**


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
*/var PdfBrowserViewer=(0,_polymerLegacy.Polymer)({_template:(0,_polymerLegacy.html)(_templateObject_28eea7e06a8311e9b44ce59a633934a6()),is:"pdf-browser-viewer",properties:{/**
     * The location of the PDF file.
     *
     * @type String
     */file:{type:String,value:void 0,reflectToAttribute:!0},/**
     * The message when browser doesn't support pdf object
     *
     * @type String
     */notSupportedMessage:{type:String,value:"It appears your Web browser is not configured to display PDF files. No worries, just"},/**
     * The PDF link message when browser doesn't support pdf object
     *
     * @type String
     */notSupportedLinkMessage:{type:String,value:"click here to download the PDF file."},/**
     * The height of the PDF viewer.
     *
     * @type String
     */height:{type:String,value:"400px"},/**
     * The width of the PDF viewer.
     *
     * @type String
     */width:{type:String,value:"100%"},/**
     * PDF viewer as a card with download button.
     *
     * @type Boolean
     */card:{type:Boolean,value:!1},/**
     * Download button label.
     *
     * @type String
     */downloadLabel:{type:String,value:"Download"},/**
     * The z-depth of the card, from 0-5.
     *
     * @type String
     */elevation:{type:String,value:"1"}},/**
   * Clear PDF container
   */clear:function clear(){this.file=void 0},/**
   * Downloads the pdf file
   */_download:function _download(){window.location=this.file}});_exports.PdfBrowserViewer=PdfBrowserViewer});