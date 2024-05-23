/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import {
  editBehaviors,
  editableTableStyles,
  tableHtmlProperties,
  displayProperties,
  dataProperties,
} from "./lib/editable-table-behaviors.js";
import "./lib/editable-table-display.js";
import "./lib/editable-table-edit.js";

/**
 * `editable-table`
 * An editor interface for tables that toggles between view mode.
 *
### Styling

`<editable-table>` provides following custom properties and mixins
for styling:

Custom property | Description | Default
----------------|-------------|----------
`--editable-table-font-size` | Main size for  table. | unset;
`--editable-table-secondary-font-size` | Smaller font size for table for minor UI elements. | 12px;
`--editable-table-caption-font-size` | Font size for table caption. | var(--editable-table-font-size);
`--editable-table-font-family` | Main font-family for table. | inherit;
`--editable-table-secondary-font-family` | Secondary font-familt for table's minor UI elements | "Roboto", "Noto", sans-serif;
`--editable-table-light-weight` | lightest table font-weight, for minor UI elements. | 200;
`--editable-table-medium-weight` | default table font-weight. | 300;
`--editable-table-heavy-weight` | heaviest table font-weight, for emphasis and table  caption. | 600;
`--editable-table-color` | table text color. | #222;
`--editable-table-bg-color` | table background color. | #fff;
`--editable-table-caption-color` | caption text color. | var(--editable-table-color);
`--editable-table-caption-bg-color` | caption background color. | #fff;
`--editable-table-heading-color` | row/column heading text color. | #000;
`--editable-table-heading-bg-color` | row/column heading background color. | #e8e8e8;
`--editable-table-stripe-bg-color` | background color for alternating row striping. | #f0f0f0;
`--editable-table-border-width` | border width for table. | 1px;
`--editable-table-border-style` | border style for table. | solid;
`--editable-table-border-color` | border color for table. | #999;
`--editable-table-border` | table border. | var(--editable-table-border-width) var(--editable-table-border-style) var(--editable-table-border-color);
`--editable-table-button-color` | default text color of toggle buttons. | var(--editable-table-border-color);
`--editable-table-button-bg-color` | default background color of toggle buttons. | var(--editable-table-bg-color);
`--editable-table-button-toggled-color` | text color of toggle buttons when toggled. | var(--editable-table-color);
`--editable-table-button-toggled-bg-color` | background color of toggle buttons when toggled. | var(--editable-table-bg-color);
`--editable-table-button-hover-color` | text color of toggle buttons when hovered or focused. | var(--editable-table-button-color);
`--editable-table-button-hover-bg-color` | background color of toggle buttons when hovered or focused. | var(--editable-table-heading-bg-color);
`--editable-table-button-toggled-hover-color` | text color of toggle buttons when toggled and hovered/focused. | var(--editable-table-heading-color);
`--editable-table-button-toggled-hover-bg-color` | background color of toggle buttons when toggled and hovered/focused. | var(--editable-table-heading-bg-color);
`--editable-table-button-disabled-color` | text color of toggle buttons when disabled. | var(--editable-table-border-color);
`--editable-table-button-disabled-bg-color` | background color of toggle buttons when disabled. | var(--editable-table-heading-bg-color);
`--editable-table-row-horizontal-padding` | Default horizontal padding for cells. | 6px;
`--editable-table-row-horizontal-padding-condensed` | Smaller horizontal padding for cells. | 4px;
`--editable-table-row-vertical-padding` | Default vertical padding for cells (determines row hight and whitespace). | 10px;
`--editable-table-row-vertical-padding-condensed` | Smaller vertical padding for cells (determines condensed row hight and whitespace). | 2px;
`--editable-table-style-stripe` | Styles applied to striped rows. | { background-color: var(--editable-table-stripe-bg-color); }
`--editable-table-style-column-header` | Styles applied to column headers. | { font-weight: var(--editable-table-heavy-weight); color: var(--editable-table-heading-color); background-color: var(--editable-table-heading-bg-color); }
`--editable-table-style-row-header` | Styles applied to row headers. | { font-weight: var(--editable-table-heavy-weight); color: var(--editable-table-heading-color); }
`--editable-table-style-footer` | Styles applied to table footer. | { font-weight: var(--editable-table-heavy-weight); color: var(--editable-table-heading-color); border-top: 3px solid var(--editable-table-color); }
 *
 * @demo ./demo/index.html
 * @demo ./demo/editmode.html Edit Mode
 * @demo ./demo/numeric.html Numeric Styles
 * @demo ./demo/display.html Display Only
 * @demo ./demo/importing.html Importing Data
 * @demo ./demo/local-import.html Local file import Data
 * @demo ./demo/exporting.html Exporting Data
 * @demo ./demo/advanced.html Advanced Features
 * 
 * @customElement
 * @element editable-table
 * @extends editBehaviors
 * @extends ResponsiveUtilityBehaviors
 * @extends editableTableStyles
 */
class EditableTable extends editBehaviors(DDD) {
  static get styles() {
    return [
      css`
        :host([hidden]) {
          display: none !important;
          margin: var(--ddd-spacing-4) 0;
        }

        :host > * {
          margin: 0px;
        }
      `,
    ];
  }
  render() {
    return html`
      <editable-table-display
        ?bordered="${this.bordered}"
        caption="${this.caption}"
        ?column-header="${this.columnHeader}"
        ?column-striped="${this.columnStriped}"
        ?condensed="${this.condensed}"
        .data="${this.data}"
        ?disabled="${this.disabled}"
        ?hidden="${this.editMode}"
        ?downloadable="${this.downloadable}"
        ?filter="${this.filter}"
        ?footer="${this.footer}"
        ?numeric-styles="${this.numericStyles}"
        ?printable="${this.printable}"
        ?responsive="${this.responsive}"
        ?row-header="${this.rowHeader}"
        ?sort="${this.sort}"
        ?striped="${this.striped}"
      >
        <slot></slot>
      </editable-table-display>
      <editable-table-edit
        ?bordered="${this.bordered}"
        caption="${this.caption}"
        @change="${this._handleSync}"
        .config="${this.config}"
        ?column-header="${this.columnHeader}"
        ?column-striped="${this.columnStriped}"
        ?condensed="${this.condensed}"
        .data="${this.data}"
        ?disabled="${this.disabled}"
        ?hidden="${!this.editMode || this.hidden}"
        ?downloadable="${this.downloadable}"
        ?filter="${this.filter}"
        ?footer="${this.footer}"
        ?hide-bordered="${this.hideBordered}"
        ?hide-condensed="${this.hideCondensed}"
        ?hide-downloadable="${this.hideDownloadable}"
        ?hide-filter="${this.hideFilter}"
        ?hide-responsive="${this.hideResponsive}"
        ?hide-printable="${this.hidePrintable}"
        ?hide-sort="${this.hideSort}"
        ?hide-striped="${this.hideStriped}"
        ?numeric-styles="${this.numericStyles}"
        ?printable="${this.printable}"
        ?responsive="${this.responsive}"
        ?row-header="${this.rowHeader}"
        ?sort="${this.sort}"
        ?striped="${this.striped}"
      >
      </editable-table-edit>
    `;
  }

  static get tag() {
    return "editable-table";
  }
  // Support being an editing interface element for HAX
  haxHooks() {
    return {
      preProcessNodeToContent: "haxpreProcessNodeToContent",
      activeElementChanged: "haxactiveElementChanged",
    };
  }
  // about to convert to content, ensure we are no longer the editable-table
  async haxpreProcessNodeToContent(node) {
    node.editMode = false;
    node.innerHTML = "";
    await node.appendChild(this.getTableHTML(true, true));
    //node.data = null;/
    node.config = null;
    return node;
  }
  // allow HAX to toggle edit state when activated
  haxactiveElementChanged(el, val) {
    this.editMode = val;
    if (val) {
      this.focus();
    }
    return this;
  }
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
  constructor() {
    super();
    //this.haxUIElement = true;
    this.editMode = false;
  }
  static get properties() {
    return {
      ...super.properties,
      /**
       * Is table in edit-mode? Default is false (display mode).
       */
      editMode: {
        type: Boolean,
        attribute: "edit-mode",
        reflect: true,
      },
    };
  }

  get display() {
    return (
      this.shadowRoot && this.shadowRoot.querySelector("editable-table-display")
    );
  }

  get editor() {
    return (
      this.shadowRoot && this.shadowRoot.querySelector("editable-table-edit")
    );
  }

  _handleSync(e) {
    this.sync(e.detail);
  }

  sync(property) {
    if (this.editor && property) this[property] = this.editor[property];
  }

  /**
   * makes toggle focusable
   */
  focus() {
    let query = this.editMode
        ? "editable-table-edit"
        : "editable-table-display",
      target =
        this.shadowRoot && this.shadowRoot.querySelector(query)
          ? this.shadowRoot.querySelector(query)
          : undefined;
    if (target)
      setTimeout(function () {
        target.focus();
      }, 1);
  }
  /**
   * Toggles between edit-mode and display mode.
   * @event toggle-edit-mode
   * @param {boolean} edit Toggle edit mode on? Default is toggle from current mode.
   */
  toggleEditMode(edit) {
    this.editMode = edit !== undefined ? edit : !this.editMode;
    this.focus();

    this.dispatchEvent(
      new CustomEvent("toggle-edit-mode", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this,
      }),
    );
  }
}
customElements.define(EditableTable.tag, EditableTable);
export { EditableTable };
