import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/iron-flex-layout/iron-flex-layout-classes.js";
import "@polymer/paper-material/paper-material.js";
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
        <eco-json-schema-wizard
          language="[[language]]"
          resources="[[resources]]"
          id="schemaObj"
          on-submit="submit"
          page="{{page}}"
          pages="{{pages}}"
          schema="[[schema]]"
          value="{{value}}"
        ></eco-json-schema-wizard>
      </paper-material>

      <paper-material class="flex">
        <h3>Value</h3>
        <pre id="valueText"></pre>
      </paper-material>
    </div>
  `,
  properties: {
    language: {
      value: "en",
      notify: true,
    },
    resources: {
      value: function () {
        return {
          en: {
            prev: "Previous",
            next: "Next",
            submit: "Submit",
            "add-image": "Click to select an image",
          },
          es: {
            prev: "Anterior",
            next: "Siguiente",
            submit: "Enviar",
            "add-image": "Click para adicionar una imagen",
          },
        };
      },
    },
    schema: {
      type: Object,
      notify: true,
      value: {
        schema: {},
      },
      observer: "_valueChanged",
    },
    value: {
      type: Object,
      notify: true,
      value: {},
    },
    page: {
      type: Object,
      notify: true,
    },
    pages: {
      type: Object,
      notify: true,
    },
  },
  attached: function () {
    this._schema = demoSchema;

    //        this.value =          {
    //          names : ['Schwartz\'s'],
    //          address : '3895 Saint Laurent Boulevard',
    //          city : 'Montreal',
    //          province : 'QC',
    //          country : 'Canada',
    //          postalCode : 'H2W1X9',
    //          phoneNumbers : [
    //            {
    //              type: 'Main',
    //              phoneNumber: '(514) 842-4813'
    //            },
    //            {
    //              type: 'Office',
    //              phoneNumber: '(514) 842-4813'
    //            }
    //          ],
    //          websites : ['http://www.schwartzsdeli.com/'],
    //          geo : [
    //            -73.577675,
    //            45.516201
    //          ],
    //          establishedDate : new Date('2015-09-14T17:50:32.493Z')
    //        };

    this.schema = JSON.parse(JSON.stringify(this._schema));

    var editorOpts = {
      mode: "tree",
      onChange: this._schemaChanged.bind(this),
    };
    this.editor = new JSONEditor(this.$.jsoneditor, editorOpts, this._schema);
  },
  _schemaChanged: function () {
    if (!this.editor) {
      console.log("Editor is false");
    } else {
      try {
        var json = this.editor.get();
        this.set("schema", json);
      } catch (e) {
        // bad, bad json
      }
    }
  },
  _valueChanged: function (newValue, oldValue) {
    if (typeof this.$.valueText !== typeof undefined) {
      let json = JSON.stringify(newValue, null, " ");
      this.$.valueText.innerHTML = json;
    }
  },
});
