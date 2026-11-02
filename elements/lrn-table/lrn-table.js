/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */

import { LitElement, html, css } from "lit";
import { SchemaBehaviors } from "@haxtheweb/schema-behaviors/schema-behaviors.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";

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
      css`
        :host {
          display: block;
        }
        .hidden-title {
          display: none;
        }
        /* block header shared with the other DDD learning blocks */
        .frame {
          box-sizing: border-box;
          border: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          border-radius: var(--ddd-radius-md);
          overflow: hidden;
        }
        .frame-header {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-3);
          padding-block: var(--ddd-spacing-2);
          padding-inline: var(--ddd-spacing-4) var(--ddd-spacing-2);
          border-bottom: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          min-height: var(--ddd-control-height-sm);
          font-family: var(--ddd-font-primary);
        }
        .frame-chip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: none;
          width: var(--ddd-icon-xs);
          height: var(--ddd-icon-xs);
          border-radius: var(--ddd-radius-circle);
          background-color: light-dark(
            var(--ddd-theme-default-beaverBlue),
            var(--ddd-theme-default-skyBlue)
          );
          color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          --simple-icon-width: var(--ddd-icon-3xs);
          --simple-icon-height: var(--ddd-icon-3xs);
        }
        .frame-label {
          flex: 1 1 auto;
          min-width: 0;
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-medium);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        :host(:lang(ar)) .frame-label,
        :host(:lang(fa)) .frame-label,
        :host(:lang(he)) .frame-label,
        :host(:lang(ur)) .frame-label {
          letter-spacing: 0;
        }
        .frame-body {
          display: block;
          padding: var(--ddd-spacing-3);
          overflow-x: auto;
        }
      `,
    ];
  }
  render() {
    // the title is shown once, as the table caption, so the header carries
    // only the type label; the group is named by both
    return html`
      <div
        class="frame"
        role="group"
        aria-label="${this.title
          ? this.t.table + " · " + this.title
          : this.t.table}"
      >
        <div class="frame-header">
          <span class="frame-chip" aria-hidden="true"
            ><simple-icon-lite icon="editor:border-all"></simple-icon-lite
          ></span>
          <span class="frame-label">${this.t.table}</span>
        </div>
        <div class="frame-body">
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
