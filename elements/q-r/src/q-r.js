import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "webcomponent-qr-code/qr-code.js";
/**
`q-r`
Polymer wrapper for a qr code.

@demo demo/index.html

*/
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
      #link {
        visibility: hidden;
        opacity: 0;
      }
    </style>
    <qr-code id="qr" data\$="[[data]]" modulesize\$="[[modulesize]]" margin\$="[[margin]]" format\$="[[format]]"></qr-code>
    <a href\$="[[data]]" id="link">[[title]]</a>
`,

  is: "q-r",
  behaviors: [HAXBehaviors.PropertiesBehaviors],

  properties: {
    /**
     * Data to code via QR code
     */
    data: {
      type: String
    },
    /**
     * Alternate title for the data
     */
    title: {
      type: String
    },
    /**
     * module size of the square
     */
    modulesize: {
      type: Number,
      value: 4
    },
    /**
     * Margin on the square
     */
    margin: {
      type: Number,
      value: 2
    },
    /**
     * format to output
     */
    format: {
      type: String,
      value: "png"
    }
  },

  /**
   * Attached to the DOM, now fire.
   */
  attached: function() {
    // Establish hax property binding
    let props = {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "QR Code",
        description: "A code to scan from a smartphone.",
        icon: "hardware:developer-board",
        color: "grey",
        groups: ["QR"],
        handles: [
          {
            type: "video",
            source: "data",
            title: "title"
          },
          {
            type: "image",
            source: "data",
            title: "title"
          },
          {
            type: "link",
            source: "data",
            title: "title"
          }
        ],
        meta: {
          author: "LRNWebComponents"
        }
      },
      settings: {
        quick: [
          {
            property: "data",
            title: "QR data",
            description: "Source of the data for the QR code.",
            inputMethod: "textfield",
            icon: "hardware:developer-board"
          },
          {
            property: "title",
            title: "Alternate title",
            description:
              "An alternate title to go to the source of the QR code.",
            inputMethod: "textfield",
            icon: "editor:title"
          },
          {
            property: "modulesize",
            title: "Size",
            description: "Size of the QR code",
            inputMethod: "textfield",
            icon: "image:photo-size-select-small"
          },
          {
            property: "margin",
            title: "Margin",
            description: "Wrapper to the code.",
            inputMethod: "textfield",
            icon: "icons:settings-overscan"
          },
          {
            property: "format",
            title: "Output format",
            description: "Format to put it out.",
            inputMethod: "select",
            options: {
              png: "PNG",
              html: "HTML",
              svg: "SVG"
            },
            icon: "editor:bubble-chart"
          }
        ],
        configure: [
          {
            property: "data",
            title: "QR data",
            description: "Source of the data for the QR code.",
            inputMethod: "textfield",
            icon: "hardware:developer-board"
          },
          {
            property: "title",
            title: "Alternate title",
            description:
              "An alternate title to go to the source of the QR code.",
            inputMethod: "textfield",
            icon: "editor:title"
          },
          {
            property: "modulesize",
            title: "Size",
            description: "Size of the QR code",
            inputMethod: "number",
            icon: "image:photo-size-select-small"
          },
          {
            property: "margin",
            title: "Margin",
            description: "Wrapper to the code.",
            inputMethod: "number",
            icon: "icons:settings-overscan"
          },
          {
            property: "format",
            title: "Output format",
            description: "Format to put it out.",
            inputMethod: "select",
            options: {
              png: "PNG",
              html: "HTML",
              svg: "SVG"
            },
            icon: "editor:bubble-chart"
          }
        ],
        advanced: []
      }
    };
    this.setHaxProperties(props);
  }
});
