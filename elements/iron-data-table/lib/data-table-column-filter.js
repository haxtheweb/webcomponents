import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";

var $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");

$_documentContainer.innerHTML = `<dom-module id="data-table-column-filter">
  <style is="custom-style">
    :host([hidden]) {
      display: none;
    }

    paper-input {
      --paper-input-container: {
        margin-bottom: 20px;
      };
      --paper-input-container-label: {
        font-size: inherit;
      }
    }
  </style>

  <template>
    <paper-input label="[[label]]" value="[[value]]" on-value-changed="_valueChanged"></paper-input>
  </template>
  
</dom-module>`;

document.head.appendChild($_documentContainer);
Polymer({
  is: "data-table-column-filter",

  properties: {
    label: String,
    value: {
      type: String,
      notify: true
    },
    hidden: Boolean
  },

  _valueChanged: function(e) {
    // store value in a variable, referring to e.detail.value inside the debounce
    // function results in weird outcomes. event object might be reused by Polymer?
    var value = e.detail.value;
    this.debounce(
      "value",
      function() {
        this.value = value;
      }.bind(this),
      250
    );
  }
});
