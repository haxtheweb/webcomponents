import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";

/**
`lrndesign-gallery-print`
A LRN element that renders the print view of a gallery item.

@demo demo/index.html

@microcopy - the mental model for this element
  <lrndesign-gallery-print 
    item="[]"          //required, an array of item data
  </lrndesign-gallery-print>
  
*/
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
    /**
     * image's alt text
     */
    alt: {
      type: String,
      value: "default"
    },
    /**
     * image's details
     */
    details: {
      type: String,
      value: null
    },
    /**
     * does it have a title
     */
    hasTitle: {
      type: Boolean,
      computed: "_isAttrSet(title)"
    },
    /**
     * image source
     */
    src: {
      type: String,
      value: null
    },
    /**
     * image's title
     */
    title: {
      type: String,
      value: null
    }
  },

  attached: function() {
    this.$.details.innerHTML = this.details;
  },

  /**
   * returns true if the given attribute is not null
   */
  _isAttrSet: function(attr) {
    return attr !== null;
  }
});
