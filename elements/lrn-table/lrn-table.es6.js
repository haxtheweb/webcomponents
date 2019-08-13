/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";

/**
 * `lrn-table`
 * `Accessibly render a HTML table from a csv file`
 *
 * @microcopy - language worth noting:
 *  - CSV - Comma separated values
 *
 * @customElement
 * @polymer
 * @polymerLegacy
 * @demo demo/index.html
 */
class LrnTable extends SchemaBehaviors(PolymerElement) {
  constructor() {
    super();
    import("@lrnwebcomponents/csv-render/csv-render.js");
  }
  static get template() {
    return html`
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
          <csv-render
            data-source="[[csvFile]]"
            caption="[[title]]"
            summary="[[description]]"
          ></csv-render>
        </div>
      </div>
    `;
  }
  static get tag() {
    return "lrn-table";
  }
  static get properties() {
    return {
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
    };
  }
  /**
   * attached.
   */
  connectedCallback() {
    super.connectedCallback();
    afterNextRender(this, function() {
      this.HAXWiring = new HAXWiring();
      this.HAXWiring.setup(LrnTable.haxProperties, LrnTable.tag, this);
    });
  }
  static get haxProperties() {
    return {
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
            inputMethod: "haxupload",
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
  }
}
window.customElements.define(LrnTable.tag, LrnTable);
export { LrnTable };
