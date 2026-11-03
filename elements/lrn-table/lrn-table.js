/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */

import { LitElement, html, css } from "lit";
import { SchemaBehaviors } from "@haxtheweb/schema-behaviors/schema-behaviors.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import {
  DDDBlockStyles,
  renderDDDBlockHeader,
} from "@haxtheweb/d-d-d/lib/DDDBlock.js";

/**
 * `lrn-table`
 * `Accessibly render a HTML table from a csv file`
 *
 * @microcopy - language worth noting:
 *  - CSV - Comma separated values
 * @demo demo/index.html
 * @element lrn-table
 */
class LrnTable extends I18NMixin(SchemaBehaviors(LitElement)) {
  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      table: "Table",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("./locales/", import.meta.url).href,
    });
    setTimeout(() => {
      import("@haxtheweb/csv-render/csv-render.js");
    }, 0);
  }
  static get styles() {
    return [
      DDDBlockStyles,
      css`
        :host {
          display: block;
        }
        .hidden-title {
          display: none;
        }
        csv-render::part(caption) {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        .ddd-block-body {
          padding: var(--ddd-spacing-3);
          overflow-x: auto;
        }
      `,
    ];
  }
  render() {
    // the title shows in the header; the table keeps its caption for
    // assistive technology but it is visually hidden to avoid a duplicate
    return html`
      <div
        class="ddd-block"
        role="group"
        aria-label="${this.title
          ? this.t.table + " · " + this.title
          : this.t.table}"
      >
        ${renderDDDBlockHeader({
          icon: "editor:border-all",
          label: this.t.table,
          title: this.title
            ? html`<span aria-hidden="true">${this.title}</span>`
            : "",
        })}
        <div class="ddd-block-body">
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
