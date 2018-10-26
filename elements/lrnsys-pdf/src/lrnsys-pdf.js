import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "pdf-browser-viewer/pdf-browser-viewer.js";
import "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
/**
`lrnsys-pdf`
A LRN element

@demo demo/index.html
*/
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
    </style>
    <h2>[[title]]</h2>
    <pdf-browser-viewer id="pdfViewer" file="[[file]]#page=[[page]]" width="100%" card="[[card]]" elevation="2" download-label="[[downloadLabel]]"></pdf-browser-viewer>
`,

  is: "lrnsys-pdf",
  behaviors: [HAXBehaviors.PropertiesBehaviors, SchemaBehaviors.Schema],

  properties: {
    /**
     * Title prior to the PDF
     */
    title: {
      type: String,
      value: "lrnsys-pdf"
    },
    /**
     * Whether or not to present this as a card.
     */
    card: {
      type: Boolean,
      value: false
    },
    /**
     * Download Label.
     */
    downloadLabel: {
      type: String,
      computed: "_computeDownloadLabel(download)"
    },
    /**
     * Active Page
     */
    page: {
      type: String
    },
    /**
     * File to present
     */
    file: {
      type: String
    },
    /**
     * Whether or not to present a download button.
     */
    download: {
      type: Boolean,
      value: true
    }
  },

  /**
   * attached.
   */
  attached: function() {
    // Establish hax properties if they exist
    let props = {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "PDF viewer",
        descrption: "Nicely present PDFs in a cross browser compatible manner.",
        icon: "editor:border-all",
        color: "green",
        groups: ["Presentation", "Table", "Data"],
        handles: [
          {
            type: "pdf",
            url: "file"
          }
        ],
        meta: {
          author: "LRNWebComponents"
        }
      },
      settings: {
        quick: [
          {
            property: "file",
            title: "File",
            description: "The URL for the pdf.",
            inputMethod: "textfield",
            icon: "link",
            required: true
          }
        ],
        configure: [
          {
            property: "file",
            title: "File",
            description: "The URL for this pdf.",
            inputMethod: "textfield",
            icon: "link",
            required: true
          },
          {
            property: "title",
            title: "Title",
            description: "Title to present",
            inputMethod: "textfield",
            icon: "editor:title"
          },
          {
            property: "download",
            title: "Download",
            description: "Can the user see a download link?",
            inputMethod: "boolean",
            icon: "file"
          }
        ],
        advanced: []
      }
    };
    this.setHaxProperties(props);
  },

  /**
   * See if we should supply a label.
   */
  _computeDownloadLabel: function(download) {
    if (download) {
      return "Download";
    } else {
      return null;
    }
  }
});
