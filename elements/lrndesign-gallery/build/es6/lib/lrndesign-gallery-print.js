import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: none;
      }
      @media print {
        :host {
          margin-top: 15px;
          margin-bottom: 15px;
          display: block;
        }
        :host iron-image {
          display: block;
          margin-top: 15px;
          width: 100%;
          height: 400px;
        }
        :host .print-image {
          max-width: 400px;
          max-height: 400px;
          display:block;
          border: 1px solid #ddd;
          page-break-inside: avoid;
        }
      }
    </style>
    <section class="print">
      <template is="dom-if" if="[[hasTitle]]">
        <h2>[[title]]</h2>
      </template>
      <div><span id="details"></span></div>
      <img class="print-image" alt\$="[[alt]]" src\$="[[src]]">
    </section>
`,
  is: "lrndesign-gallery-print",
  properties: {
    alt: { type: String, value: "default" },
    details: { type: String, value: null },
    hasTitle: { type: Boolean, computed: "_isAttrSet(title)" },
    src: { type: String, value: null },
    title: { type: String, value: null }
  },
  attached: function() {
    this.$.details.innerHTML = this.details;
  },
  _isAttrSet: function(attr) {
    return null !== attr;
  }
});
