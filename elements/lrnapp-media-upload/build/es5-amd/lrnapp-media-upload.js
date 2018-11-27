define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@vaadin/vaadin-upload/vaadin-upload.js"
], function(_polymerLegacy, _vaadinUpload) {
  "use strict";
  function _templateObject_a14fd000f1e411e8854029eddbaa22b9() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style>\n      :host {\n        display: block;\n      }\n      paper-button {\n        padding: 0;\n        margin: 0;\n        min-width: 16px;\n      }\n      vaadin-upload.thick-border {\n        --primary-color: #396;\n        --dark-primary-color: #063;\n        --light-primary-color: #6c9;\n        --error-color: darkred;\n\n        border: 2px solid #ccc;\n        padding: 14px;\n        background: #eee;\n        border-radius: 0;\n      }\n      vaadin-upload.thick-border[dragover] {\n        border-color: #396;\n      }\n    </style>\n    <vaadin-upload target$="{{uploadPath}}" method="POST" form-data-name="file-upload"></vaadin-upload>\n'
      ],
      [
        '\n    <style>\n      :host {\n        display: block;\n      }\n      paper-button {\n        padding: 0;\n        margin: 0;\n        min-width: 16px;\n      }\n      vaadin-upload.thick-border {\n        --primary-color: #396;\n        --dark-primary-color: #063;\n        --light-primary-color: #6c9;\n        --error-color: darkred;\n\n        border: 2px solid #ccc;\n        padding: 14px;\n        background: #eee;\n        border-radius: 0;\n      }\n      vaadin-upload.thick-border[dragover] {\n        border-color: #396;\n      }\n    </style>\n    <vaadin-upload target\\$="{{uploadPath}}" method="POST" form-data-name="file-upload"></vaadin-upload>\n'
      ]
    );
    _templateObject_a14fd000f1e411e8854029eddbaa22b9 = function _templateObject_a14fd000f1e411e8854029eddbaa22b9() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_a14fd000f1e411e8854029eddbaa22b9()
    ),
    is: "lrnapp-media-upload",
    properties: {
      uploadPath: { type: String, notify: !0, reflectToAttribute: !0 }
    }
  });
});
