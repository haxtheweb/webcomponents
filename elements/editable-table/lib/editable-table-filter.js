/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { editableTableCellStyles } from "./editable-table-behaviors.js";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import { SimpleToolbarButtonBehaviors } from "@haxtheweb/simple-toolbar/lib/simple-toolbar-button.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `editable-table-editor-filter`
 * `Displays a cell in editable-table-display mode (editable-table-display.html) as a filter button.`
 *
 * @demo ./demo/display.html
 * @customElement
 * @extends LitElement
 */
class EditableTableFilter extends I18NMixin(SimpleToolbarButtonBehaviors(DDD)) {
  static get styles() {
    return [
      ...(super.styles || []),
      ...editableTableCellStyles,
      css`
        :host {
          display: block;
          font-family: inherit;
          font-size: inherit;
        }
        :host > div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }
        button {
          flex: 0 0 auto !important;
          width: auto !important;
        }
        #cell {
          flex: 1 1 auto !important;
          display: inline-block;
          padding: var(--ddd-spacing-1);
          text-align: inherit;
        }
        /* a subtle DDD icon button, like the sort buttons */
        *[part="button"] {
          color: var(--simple-toolbar-button-color, inherit);
          border-color: var(--simple-toolbar-button-border-color, transparent);
          border-radius: var(--ddd-radius-xs);
          margin-inline-start: var(--ddd-spacing-1);
        }
        *[part="button"]:hover {
          background-color: var(
            --simple-toolbar-button-hover-bg,
            light-dark(
              var(--ddd-theme-default-limestoneLight),
              var(--ddd-theme-default-slateGray)
            )
          );
          border-color: var(
            --simple-toolbar-button-hover-border-color,
            transparent
          );
        }
        *[part="button"]:focus-visible {
          outline: var(--ddd-focus-ring, 2px solid currentColor);
          outline-offset: var(--ddd-focus-offset, 2px);
        }
        :host(:not([toggled])) #icon {
          opacity: 0.6;
        }
      `,
    ];
  }
  render() {
    return html`<div><slot id="cell"></slot>${super.render()}</div> `;
  }
  static get properties() {
    return {
      ...super.properties,
      /**
       * Index of column
       */
      columnIndex: {
        type: Number,
        attribute: "column-index",
      },
      /**
       * Index of column
       */
      text: {
        type: String,
        attribute: "text",
      },
    };
  }

  static get tag() {
    return "editable-table-filter";
  }
  constructor() {
    super();
    this.columnIndex = null;
    this.filtered = false;
    this.text = "";
    this.toggles = true;
    this.icon = "editable-table:filter";
    this.t = this.t || {};
    this.t = {
      ...this.t,
      toggleFilter: "Toggle filter.",
      toggleFilterForColumn: "Toggle filter for column.",
      toggleColumnFilter: "Toggle Column {column} filter.",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../locales/", import.meta.url).href,
    });
    this.i18nDefault("label", "toggleFilter");
    this.i18nDefault("tooltip", "toggleFilterForColumn");
    this.describedby = "cell";
  }

  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "t") {
        this.label = this.t.toggleFilter;
      }
      if (propName == "columnIndex" || propName == "t") {
        this.tooltip = this.t.toggleColumnFilter.replace(
          "{column}",
          () => this.columnIndex,
        );
      }
    });
  }

  /**
   * Fires when filter button is clicked
   * @event toggle-filter
   */
  _handleClick(_e) {
    this.dispatchEvent(
      new CustomEvent("toggle-filter", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this,
      }),
    );
  }
}
globalThis.customElements.define(EditableTableFilter.tag, EditableTableFilter);
export { EditableTableFilter };
