define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/iron-flex-layout/iron-flex-layout-classes.js",
  "../node_modules/@polymer/paper-material/paper-material.js",
  "../lib/eco-json-schema-wizard.js",
  "../node_modules/ace-builds/src/ace.js",
  "../node_modules/jsoneditor/dist/jsoneditor.min.js",
  "./schema.js"
], function(_polymerLegacy) {
  "use strict";
  var $_documentContainer = document.createElement("div");
  $_documentContainer.setAttribute("style", "display: none;");
  $_documentContainer.innerHTML =
    '<dom-module id="eco-json-schema-form-live-schema-demo">\n\n  \n\n  \n\n  <style is="custom-style" include="iron-flex iron-flex-alignment">\n    paper-material {\n      background: #ffffff;\n      height: 100%;\n    }\n\n    paper-material,\n    paper-material&gt;* {\n      margin: 10px;\n    }\n\n    .editor-container {\n      height: 600px;\n    }\n\n    #jsoneditor {\n      width: 400px;\n      height: 93%;\n    }\n    eco-json-schema-wizard {\n      width: 400px;\n      height: 93%;\n    }\n  </style>\n  <template>\n    <div class="horizontal layout main-container">\n      <paper-material class="flex-2 editor-container">\n        <h3>Schema Editor</h3>\n        <div id="jsoneditor"></div>\n      </paper-material>\n\n      <paper-material class="flex-2">\n        <h3>Generated Form</h3>\n        <eco-json-schema-wizard language="[[language]]" resources="[[resources]]" id="schemaObj" on-submit="submit" page="{{page}}" pages="{{pages}}" schema="[[schema]]" value="{{value}}"></eco-json-schema-wizard>\n      </paper-material>\n\n      <paper-material class="flex">\n        <h3>Value</h3>\n        <pre id="valueText"></pre>\n      </paper-material>\n    </div>\n\n  </template>\n  \n</dom-module>';
  document.head.appendChild($_documentContainer);
  (0, _polymerLegacy.Polymer)({
    is: "eco-json-schema-form-live-schema-demo",
    observers: ["_valueChanged(value.*)"],
    properties: {
      language: { value: "en", notify: !0 },
      resources: {
        value: function value() {
          return {
            en: {
              prev: "Previous",
              next: "Next",
              submit: "Submit",
              "add-image": "Click to select an image"
            },
            es: {
              prev: "Anterior",
              next: "Siguiente",
              submit: "Enviar",
              "add-image": "Click para adicionar una imagen"
            }
          };
        }
      },
      schema: { type: Object, notify: !0, value: { schema: {} } },
      value: { type: Object, notify: !0, value: {} },
      page: { type: Object, notify: !0 },
      pages: { type: Object, notify: !0 }
    },
    ready: function ready() {
      this._schema = demoSchema;
      this.schema = JSON.parse(JSON.stringify(this._schema));
      var editorOpts = { mode: "code", change: this._schemaChanged.bind(this) };
      this.editor = new JSONEditor(this.$.jsoneditor, editorOpts, this._schema);
    },
    _schemaChanged: function _schemaChanged() {
      if (!this.editor) {
        console.log("Editor is false");
      } else {
        try {
          var json = JSON.parse(this.editor.getText());
          this.schema = json;
        } catch (e) {}
      }
    },
    _valueChanged: function _valueChanged() {
      var json = JSON.stringify(this.value, null, " ");
      this.$.valueText.innerHTML = json;
    }
  });
});
