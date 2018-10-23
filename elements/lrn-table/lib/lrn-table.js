import "@polymer/polymer/polymer.js";
import "csv-render/csv-render.js";
import "hax-body-behaviors/hax-body-behaviors.js";
import "schema-behaviors/schema-behaviors.js";
/**
`lrn-table`
Render an accessible HTML table from a CSV file

@demo demo/index.html
*/
Polymer({
  _template: `
    <style>
      :host {
        display: block;
      }
      .hidden-title {
        display: none;
      }
    </style>
    <div typeof="oer:SupportingMaterial">
      <div class="hidden-title" property="oer:name">[[title]]</div>
      <div property="oer:description">
        <slot></slot>
        <csv-render data-source="[[csvFile]]" caption="[[title]]" summary="[[description]]"></csv-render>
      </div>
    </div>
`,

  is: "lrn-table",

  behaviors: [HAXBehaviors.PropertiesBehaviors, SchemaBehaviors.Schema],

  properties: {
    /**
     * Title of this table. This is both for accessibility and presentation.
     */
    title: {
      type: String
    },
    /**
     * The file to load material from.
     */
    csvFile: {
      type: String
    },
    /**
     * An extended description of the material in the table for improved accessibility.
     */
    description: {
      type: String
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
        title: "CSV table",
        description:
          "This can generate a table from a CSV file no matter where it is located.",
        icon: "editor:border-all",
        color: "green",
        groups: ["Presentation", "Table", "Data"],
        handles: [
          {
            type: "csv",
            source: "csvFile"
          }
        ],
        meta: {
          author: "LRNWebComponents"
        }
      },
      settings: {
        quick: [
          {
            property: "csvFile",
            title: "Source",
            description: "The URL for this csv file.",
            inputMethod: "textfield",
            icon: "link",
            required: true
          },
          {
            property: "title",
            title: "Title",
            description: "Title for the table to be generated.",
            inputMethod: "textfield",
            icon: "editor:title"
          },
          {
            property: "description",
            title: "Description",
            description:
              "More detailed description for improved accessibility of the table data.",
            inputMethod: "textfield",
            icon: "editor:short-text"
          }
        ],
        configure: [
          {
            property: "csvFile",
            title: "Source",
            description: "The URL for this csv file.",
            inputMethod: "textfield",
            required: true
          },
          {
            property: "title",
            title: "Title",
            description: "Title for the table to be generated.",
            inputMethod: "textfield"
          },
          {
            property: "description",
            title: "Description",
            description:
              "More detailed description for improved accessibility of the table data.",
            inputMethod: "textfield"
          }
        ],
        advanced: []
      }
    };
    this.setHaxProperties(props);
  }
});
