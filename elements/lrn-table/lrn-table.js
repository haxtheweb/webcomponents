/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */

import { LitElement, html, css } from "lit";
import { SchemaBehaviors } from "@haxtheweb/schema-behaviors/schema-behaviors.js";

/**
 * `lrn-table`
 * `Accessibly render a HTML table from a csv file`
 *
 * @microcopy - language worth noting:
 *  - CSV - Comma separated values
 * @demo demo/index.html
 * @element lrn-table
 */
class LrnTable extends SchemaBehaviors(LitElement) {
  constructor() {
    super();
    setTimeout(() => {
      import("@haxtheweb/csv-render/csv-render.js");
    }, 0);
  }
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        .hidden-title {
          display: none;
        }
      `,
    ];
  }
  render() {
    return html`
      <div typeof="oer:SupportingMaterial">
        <div class="hidden-title" property="oer:name">${this.title}</div>
        <div property="oer:description">
          <slot></slot>
          <csv-render
            data-source="${this.csvFile}"
            caption="${this.title}"
            summary="${this.description}"
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
      ...super.properties,
      /**
       * Title of this table. This is both for accessibility and presentation.
       */
      title: {
        type: String,
      },
      /**
       * The file to load material from.
       */
      csvFile: {
        type: String,
        attribute: "csv-file",
      },
      /**
       * An extended description of the material in the table for improved accessibility.
       */
      description: {
        type: String,
      },
    };
  }
  /**
   * Hax properties
   */
  static get haxProperties() {
    return new URL("./lib/lrn-table.haxProperties.json", import.meta.url).href;
  }
}
globalThis.customElements.define(LrnTable.tag, LrnTable);
export { LrnTable };
