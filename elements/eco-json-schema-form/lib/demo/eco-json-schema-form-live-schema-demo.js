import "@polymer/polymer/polymer.js";
import "@polymer/iron-flex-layout/iron-flex-layout-classes.js";
import "@polymer/paper-material/paper-material.js";
import "../eco-json-schema-wizard.js";
import "ace-builds/src/ace.js";
import "jsoneditor/dist/jsoneditor.min.js";
import "./schema.js";
const $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");

$_documentContainer.innerHTML = `<dom-module id="eco-json-schema-form-live-schema-demo">

  

  

  <style is="custom-style" include="iron-flex iron-flex-alignment">
    paper-material {
      background: #ffffff;
      height: 100%;
    }

    paper-material,
    paper-material&gt;* {
      margin: 10px;
    }

    .editor-container {
      height: 600px;
    }

    #jsoneditor {
      width: 400px;
      height: 93%;
    }
    eco-json-schema-wizard {
      width: 400px;
      height: 93%;
    }
  </style>
  <template>
    <div class="horizontal layout main-container">
      <paper-material class="flex-2 editor-container">
        <h3>Schema Editor</h3>
        <div id="jsoneditor"></div>
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

  </template>
  
</dom-module>`;

document.head.appendChild($_documentContainer);
Polymer({
  is: "eco-json-schema-form-live-schema-demo",
  observers: ["_valueChanged(value.*)"],
  properties: {
    language: {
      value: "en",
      notify: true
    },
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
      notify: true,
      value: {
        schema: {}
      }
    },
    value: {
      type: Object,
      notify: true,
      value: {}
    },
    page: {
      type: Object,
      notify: true
    },
    pages: {
      type: Object,
      notify: true
    }
  },
  ready: function() {
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
      mode: "code",
      change: this._schemaChanged.bind(this)
    };

    this.editor = new JSONEditor(this.$.jsoneditor, editorOpts, this._schema);
  },
  _schemaChanged: function() {
    if (!this.editor) {
      console.log("Editor is false");
    } else {
      try {
        var json = JSON.parse(this.editor.getText());
        this.schema = json;
      } catch (e) {
        // bad, bad json
      }
    }
  },
  _valueChanged: function() {
    var json = JSON.stringify(this.value, null, " ");
    this.$.valueText.innerHTML = json;
  }
});
