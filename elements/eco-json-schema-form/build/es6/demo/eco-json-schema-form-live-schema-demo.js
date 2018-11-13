import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/iron-flex-layout/iron-flex-layout-classes.js";
import "../node_modules/@polymer/paper-material/paper-material.js";
import "../lib/eco-json-schema-wizard.js";
Polymer({
  is: "eco-json-schema-form-live-schema-demo",
  _template: html`
  <style is="custom-style" include="iron-flex iron-flex-alignment">
    paper-material {
      background: #ffffff;
      height: 100%;
    }

    paper-material,
    paper-material > * {
      margin: 10px;
    }

    .editor-container {
      height: 600px;
    }

    #jsoneditor {
      width: 400px;
      height: 400px;
    }
    eco-json-schema-wizard {
      width: 400px;
      height: 400px;
    }
  </style>
    <div class="horizontal layout main-container">
      <paper-material class="flex-2 editor-container">
        <h3>Schema Editor</h3>
        <div id="jsoneditor" style="width: 400px; height: 400px;"></div>
      </paper-material>

      <paper-material class="flex-2">
        <h3>Generated Form</h3>
        <eco-json-schema-wizard language="[[language]]" resources="[[resources]]" id="schemaObj" on-submit="submit" page="{{page}}" pages="{{pages}}" schema="[[schema]]" value="{{value}}"></eco-json-schema-wizard>
      </paper-material>

      <paper-material class="flex">
        <h3>Value</h3>
        <pre id="valueText"></pre>
      </paper-material>
    </div>
`,
  properties: {
    language: { value: "en", notify: !0 },
    resources: {
      value: function() {
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
  attached: function() {
    this._schema = demoSchema;
    this.schema = JSON.parse(JSON.stringify(this._schema));
    var editorOpts = { mode: "tree", onChange: this._schemaChanged.bind(this) };
    this.editor = new JSONEditor(this.$.jsoneditor, editorOpts, this._schema);
  },
  _schemaChanged: function() {
    if (!this.editor) {
      console.log("Editor is false");
    } else {
      try {
        var json = this.editor.get();
        this.set("schema", json);
      } catch (e) {}
    }
  },
  _valueChanged: function(newValue) {
    if (typeof this.$.valueText !== typeof void 0) {
      let json = JSON.stringify(newValue, null, " ");
      this.$.valueText.innerHTML = json;
    }
  }
});
