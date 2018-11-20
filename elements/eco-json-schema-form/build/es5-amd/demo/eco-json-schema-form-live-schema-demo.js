define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/iron-flex-layout/iron-flex-layout-classes.js",
  "../node_modules/@polymer/paper-material/paper-material.js",
  "../lib/eco-json-schema-wizard.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_d3570890ecf111e88a0b4725ebfbecff() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n  <style is="custom-style" include="iron-flex iron-flex-alignment">\n    paper-material {\n      background: #ffffff;\n      height: 100%;\n    }\n\n    paper-material,\n    paper-material > * {\n      margin: 10px;\n    }\n\n    .editor-container {\n      height: 600px;\n    }\n\n    #jsoneditor {\n      width: 400px;\n      height: 400px;\n    }\n    eco-json-schema-wizard {\n      width: 400px;\n      height: 400px;\n    }\n  </style>\n    <div class="horizontal layout main-container">\n      <paper-material class="flex-2 editor-container">\n        <h3>Schema Editor</h3>\n        <div id="jsoneditor" style="width: 400px; height: 400px;"></div>\n      </paper-material>\n\n      <paper-material class="flex-2">\n        <h3>Generated Form</h3>\n        <eco-json-schema-wizard language="[[language]]" resources="[[resources]]" id="schemaObj" on-submit="submit" page="{{page}}" pages="{{pages}}" schema="[[schema]]" value="{{value}}"></eco-json-schema-wizard>\n      </paper-material>\n\n      <paper-material class="flex">\n        <h3>Value</h3>\n        <pre id="valueText"></pre>\n      </paper-material>\n    </div>\n'
    ]);
    _templateObject_d3570890ecf111e88a0b4725ebfbecff = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    is: "eco-json-schema-form-live-schema-demo",
    _template: (0, _polymerLegacy.html)(
      _templateObject_d3570890ecf111e88a0b4725ebfbecff()
    ),
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
      schema: {
        type: Object,
        notify: !0,
        value: { schema: {} },
        observer: "_valueChanged"
      },
      value: { type: Object, notify: !0, value: {} },
      page: { type: Object, notify: !0 },
      pages: { type: Object, notify: !0 }
    },
    attached: function attached() {
      this._schema = demoSchema;
      this.schema = JSON.parse(JSON.stringify(this._schema));
      var editorOpts = {
        mode: "tree",
        onChange: this._schemaChanged.bind(this)
      };
      this.editor = new JSONEditor(this.$.jsoneditor, editorOpts, this._schema);
    },
    _schemaChanged: function _schemaChanged() {
      if (!this.editor) {
        console.log("Editor is false");
      } else {
        try {
          var json = this.editor.get();
          this.set("schema", json);
        } catch (e) {}
      }
    },
    _valueChanged: function _valueChanged(newValue) {
      if (babelHelpers.typeof(this.$.valueText) !== "undefined") {
        var json = JSON.stringify(newValue, null, " ");
        this.$.valueText.innerHTML = json;
      }
    }
  });
});
