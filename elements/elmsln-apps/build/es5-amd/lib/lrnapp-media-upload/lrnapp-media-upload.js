define([
  "exports",
  "../../node_modules/@polymer/polymer/polymer-legacy.js",
  "../../node_modules/@vaadin/vaadin-upload/vaadin-upload.js"
], function(_exports, _polymerLegacy, _vaadinUpload) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrnappMediaUpload = void 0;
  function _templateObject_5f36e0f0f77011e8b89b0519890f95da() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style>\n      :host {\n        display: block;\n      }\n      paper-button {\n        padding: 0;\n        margin: 0;\n        min-width: 16px;\n      }\n      vaadin-upload.thick-border {\n        --primary-color: #396;\n        --dark-primary-color: #063;\n        --light-primary-color: #6c9;\n        --error-color: darkred;\n\n        border: 2px solid #ccc;\n        padding: 14px;\n        background: #eee;\n        border-radius: 0;\n      }\n      vaadin-upload.thick-border[dragover] {\n        border-color: #396;\n      }\n    </style>\n    <vaadin-upload\n      target$="{{uploadPath}}"\n      method="POST"\n      form-data-name="file-upload"\n    ></vaadin-upload>\n  '
      ],
      [
        '\n    <style>\n      :host {\n        display: block;\n      }\n      paper-button {\n        padding: 0;\n        margin: 0;\n        min-width: 16px;\n      }\n      vaadin-upload.thick-border {\n        --primary-color: #396;\n        --dark-primary-color: #063;\n        --light-primary-color: #6c9;\n        --error-color: darkred;\n\n        border: 2px solid #ccc;\n        padding: 14px;\n        background: #eee;\n        border-radius: 0;\n      }\n      vaadin-upload.thick-border[dragover] {\n        border-color: #396;\n      }\n    </style>\n    <vaadin-upload\n      target\\$="{{uploadPath}}"\n      method="POST"\n      form-data-name="file-upload"\n    ></vaadin-upload>\n  '
      ]
    );
    _templateObject_5f36e0f0f77011e8b89b0519890f95da = function _templateObject_5f36e0f0f77011e8b89b0519890f95da() {
      return data;
    };
    return data;
  }
  var LrnappMediaUpload = (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_5f36e0f0f77011e8b89b0519890f95da()
    ),
    is: "lrnapp-media-upload",
    properties: {
      uploadPath: { type: String, notify: !0, reflectToAttribute: !0 }
    }
  });
  _exports.LrnappMediaUpload = LrnappMediaUpload;
});
