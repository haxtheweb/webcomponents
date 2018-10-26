import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/iron-a11y-keys/iron-a11y-keys.js";
import "@lrnwebcomponents/relative-heading/relative-heading.js";
/**
 * `lrndesign-imagemap-hotspot`
 * creates an accessible image map
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
Polymer({
  _template: html`
    <style>
      :host {
        display: none;
      }
      :host #desc {
        margin: 0 0 15px;
      }
      @media print {
        :host {
          display: block;
        }
      }
    </style>
    <relative-heading hidden\$="[[!label]]" id="heading" text\$="[[label]]">
    </relative-heading>
    <div id="desc"><slot></slot></div>
`,

  is: "lrndesign-imagemap-hotspot",

  properties: {
    /**
     * Label for the hotspot
     */
    label: {
      type: String,
      value: null
    },
    /**
     * Id of hotspot element inside the SVG
     */
    hotspotId: {
      type: String,
      value: null
    }
  },

  setParentHeading: function(parent) {
    this.$.heading._setParent(parent);
  }
});
