/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import {
  displayBehaviors,
  editableTableStyles,
} from "./lib/editable-table-behaviors.js";
import "@lrnwebcomponents/rich-text-editor/rich-text-editor.js";
import { RichTextEditorToolbarMini } from "@lrnwebcomponents/rich-text-editor/lib/toolbars/rich-text-editor-toolbar-mini.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";
import "./lib/editable-table-editor-rowcol.js";
import "./lib/editable-table-editor-toggle.js";
import "./lib/editable-table-display.js";
import { ReplaceWithPolyfill } from "@lrnwebcomponents/utils/utils.js";
if (!Element.prototype.replaceWith) {
  Element.prototype.replaceWith = ReplaceWithPolyfill;
}
if (!CharacterData.prototype.replaceWith) {
  CharacterData.prototype.replaceWith = ReplaceWithPolyfill;
}
if (!DocumentType.prototype.replaceWith) {
  DocumentType.prototype.replaceWith = ReplaceWithPolyfill;
}

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
 * @demo ./demo/exporting.html Exporting Data
 * @demo ./demo/advanced.html Advanced Features
 * 
 * @polymer
 * @element editable-table
 * @appliesMixin displayBehaviors
 * @appliesMixin EditBehaviors
 */
class EditableTable extends displayBehaviors(LitElement) {
  static get styles() {
    return [
      ...(super.styles || []),
      ...editableTableStyles,
      css`
        :host {
          --paper-listbox-background-color: var(
            --editable-table-rowcol-bg-color
          );
        }
        .filter-icon,
        .sortable-icon {
          display: none;
          opacity: 0.4;
          width: 24px;
          height: 24px;
        }
        :host([sort]) tbody .tr:first-child .sortable-icon,
        :host([filter]) tbody .tr:not(:first-of-type) .filter-icon {
          display: inline-block;
          opacity: 0.25;
        }
        table {
          min-width: calc(100% - 2.3px);
          width: unset;
        }
        caption {
          width: 100%;
          padding: 0;
          margin: 0;
          color: var(
            --editable-table-caption-color,
            var(--editable-table-color, #222)
          );
        }
        caption,
        .th-or-td {
          border: 1px solid #ddd;
        }
        label,
        .label {
          color: var(--editable-table-secondary-text-color, #444);
          font-size: var(--editable-table-secondary-font-size, 12px);
          font-family: var(
            --editable-table-secondary-font-family,
            "Roboto",
            "Noto",
            sans-serif
          );
        }
        .field-group {
          width: 100%;
          padding: 0;
          margin: 0;
          transition: all 2s;
          color: var(
            --editable-table-caption-color,
            var(--editable-table-color, #222)
          );
        }
        .field-group:not([hidden]) {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
        }
        caption > *,
        .field-group > * {
          margin: 0 2.5px;
        }
        caption {
          position: relative;
        }
        .field-group .field-group {
          width: unset;
        }
        th {
          padding: 0;
          border-width: var(--editable-table-border-width, 1px);
          border-style: var(--editable-table-border-style, solid);
          border-color: var(--editable-table-border-color, #999);
        }
        td {
          margin: 0;
          padding: 0;
          position: relative;
        }
        rich-text-editor-toolbar-mini {
          width: max-content;
          position: relative;
          margin: 0;
        }
        rich-text-editor {
          margin-bottom: 1px;
          min-height: 12px;
          padding: var(
            --editable-table-row-padding,
            var(--editable-table-row-vertical-padding, 10px)
              var(--editable-table-row-horizontal-padding, 6px)
          );
          border: none !important;
        }
        td #icons {
          position: absolute;
          right: 0;
          top: calc(50% - 12px);
          width: 24px;
        }
        td simple-icon-lite {
          width: 24px;
        }
        th:hover,
        th:focus-within {
          background-color: var(
            --editable-table-rowcol-hover-bg-color,
            var(--editable-table-heading-bg-color, #e8e8e8)
          );
        }
        .th:first-child {
          width: 96px;
        }
        :host([responsive]) thead th:nth-of-type(3),
        :host([responsive]) .tr td:nth-of-type(2) {
          border-right-width: calc(var(--editable-table-border-width) + 5px);
          border-right-style: double;
        }
      `,
    ];
  }
  render() {
    return html`
      <rich-text-editor-toolbar-mini
        id="mini"
        .config="${this.config}"
        show="selection"
      ></rich-text-editor-toolbar-mini>
      <editable-table-display
        aria-hidden="${this.editMode ? "true" : "false"}"
        ?bordered="${this.bordered}"
        caption="${this.caption}"
        ?column-header="${this.columnHeader}"
        ?column-striped="${this.columnStriped}"
        ?condensed="${this.condensed}"
        ?downloadable="${this.downloadable}"
        .data="${this.data}"
        ?filter="${this.filter}"
        ?footer="${this.footer}"
        ?hidden="${this.editMode}"
        ?numeric-styles="${this.numericStyles}"
        ?printable="${this.printable}"
        ?responsive="${this.responsive}"
        ?row-header="${this.rowHeader}"
        ?sort="${this.sort}"
        ?striped="${this.striped}"
      >
      </editable-table-display>
      <div
        ?hidden="${!this.editMode}"
        aria-hidden="${!this.editMode ? "true" : "false"}"
        id="outer"
      >
        <div id="inner">
          <p class="sr-only">Table Editor</p>
          <table
            id="table-editmode"
            ?bordered="${this.bordered}"
            ?column-header="${this.columnHeader}"
            ?column-striped="${this.columnStriped}"
            ?condensed="${this.condensed}"
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
            <caption>
              <p class="sr-only">Edit Mode for</p>
              <rich-text-editor
                autofocus
                @editing-disabled="${this._captionChanged}"
                toolbar="mini"
                id="caption"
                label="Caption"
                placeholder="Name your table by adding a caption here."
                rawhtml="${this.caption}"
                type="rich-text-editor-toolbar-mini"
              >
              </rich-text-editor>
            </caption>
            <thead>
              <tr class="tr">
                <th scope="col">
                  <span class="sr-only">Row Operations</span>
                </th>
                ${(this.data[0] || []).map(
                  (cell, th) => html`
                    <th
                      class="col-${th}"
                      scope="col"
                      ?numeric="${this._isNumericColumn(th)}"
                    >
                      <editable-table-editor-rowcol
                        ?condensed="${this.condensed}"
                        index="${th}"
                        @rowcol-action="${this._handleRowColumnMenu}"
                      >
                      </editable-table-editor-rowcol>
                    </th>
                  `
                )}
              </tr>
            </thead>
            <tbody id="tbody" class="tbody">
              ${this.data.map(
                (row, tr) => html`
                  <tr
                    class="tr ${tr == 0 && this.columnHeader
                      ? "thead-tr"
                      : tr == this.data.length - 1 && this.footer
                      ? "tfoot-tr"
                      : "tbody-tr"}"
                  >
                    <th scope="row">
                      <editable-table-editor-rowcol
                        class="cell"
                        ?condensed="${this.condensed}"
                        index="${tr}"
                        row
                        @rowcol-action="${this._handleRowColumnMenu}"
                      >
                      </editable-table-editor-rowcol>
                    </th>
                    ${(row || []).map(
                      (cell, td) => html`
                        <td
                          class="${(td === 0 && this.rowHeader) ||
                          (tr == 0 && this.columnHeader)
                            ? "th"
                            : "td"} th-or-td"
                          ?negative="${this._isNegative(cell)}"
                          ?numeric="${this._isNumericColumn(td)}"
                          @click="${this._onCellClick}"
                        >
                          <rich-text-editor
                            autofocus
                            @editing-disabled="${(e) =>
                              this._onCellValueChange(e, tr, td)}"
                            class="cell"
                            disable-mouseover
                            toolbar="mini"
                            id="cell-${tr}-${td}"
                            label="${`Cell ${this._getLabel(td, false)}${tr}`}"
                            rawhtml="${cell}"
                            type="rich-text-editor-toolbar-mini"
                          >
                          </rich-text-editor>
                          <div id="icons">
                            <simple-icon-lite
                              class="sortable-icon"
                              icon="editable-table:sortable"
                              aria-hidden="true"
                            ></simple-icon-lite>
                            <simple-icon-lite
                              class="filter-icon"
                              icon="editable-table:filter-off"
                            ></simple-icon-lite>
                          </div>
                        </td>
                      `
                    )}
                  </tr>
                `
              )}
            </tbody>
          </table>
        </div>
        <div class="field-group">
          <div class="field-group">
            <div class="label">Headers and footers</div>
            <editable-table-editor-toggle
              id="columnHeader"
              icon="editable-table:column-headers"
              label="First row has column headers."
              @change="${this._onTableSettingChange}"
              ?toggled="${this.columnHeader}"
            >
            </editable-table-editor-toggle>
            <editable-table-editor-toggle
              id="rowHeader"
              icon="editable-table:row-headers"
              @change="${this._onTableSettingChange}"
              label="First column has row headers."
              ?toggled="${this.rowHeader}"
            >
            </editable-table-editor-toggle>
            <editable-table-editor-toggle
              id="footer"
              icon="editable-table:footer"
              label="Last row is a footer."
              @change="${this._onTableSettingChange}"
              ?toggled="${this.footer}"
            >
            </editable-table-editor-toggle>
          </div>
          <div class="field-group" ?hidden="${this.hideDisplay}">
            <div class="label">Display</div>
            <editable-table-editor-toggle
              id="bordered"
              ?disabled="${this.hideBordered}"
              ?hidden="${this.hideBordered}"
              icon="image:grid-on"
              label="Borders."
              @change="${this._onTableSettingChange}"
              ?toggled="${this.bordered}"
            >
            </editable-table-editor-toggle>
            <editable-table-editor-toggle
              id="striped"
              ?disabled="${this.hideStriped}"
              ?hidden="${this.hideStriped}"
              icon="editable-table:row-striped"
              label="Alternating rows."
              @change="${this._onTableSettingChange}"
              ?toggled="${this.striped}"
            >
            </editable-table-editor-toggle>
            <editable-table-editor-toggle
              id="columnStriped"
              ?disabled="${this.hideStriped}"
              ?hidden="${this.hideStriped}"
              icon="editable-table:col-striped"
              label="Alternating columns."
              @change="${this._onTableSettingChange}"
              ?toggled="${this.columnStriped}"
            >
            </editable-table-editor-toggle>
            <editable-table-editor-toggle
              id="condensed"
              ?disabled="${this.hideCondensed}"
              ?hidden="${this.hideCondensed}"
              icon="editable-table:row-condensed"
              label="Condensed rows."
              @change="${this._onTableSettingChange}"
              ?toggled="${this.condensed}"
            >
            </editable-table-editor-toggle>
            <editable-table-editor-toggle
              id="numericStyles"
              ?disabled="${this.hideNumericStyles}"
              ?hidden="${this.hideNumericStyles}"
              icon="editable-table:numbers"
              label="Style numeric cells."
              @change="${this._onTableSettingChange}"
              ?toggled="${this.numericStyles}"
            >
            </editable-table-editor-toggle>
            <editable-table-editor-toggle
              id="responsive"
              ?disabled="${this.hideResponsive}"
              ?hidden="${this.hideResponsive}"
              icon="device:devices"
              label="Adjust width to screen size."
              @change="${this._onTableSettingChange}"
              ?toggled="${this.responsive}"
            >
            </editable-table-editor-toggle>
          </div>
          <div class="field-group" ?hidden="${this.hideSortFilter}">
            <div class="label">Data</div>
            <editable-table-editor-toggle
              id="sort"
              ?disabled="${this._isSortDisabled(
                this.hideSort,
                this.columnHeader
              )}"
              ?hidden="${this._isSortDisabled(
                this.hideSort,
                this.columnHeader
              )}"
              label="Column sorting (for tables with column headers)."
              icon="editable-table:sortable"
              @change="${this._onTableSettingChange}"
              ?toggled="${this.sort}"
            >
            </editable-table-editor-toggle>
            <editable-table-editor-toggle
              id="filter"
              ?disabled="${this.hideFilter}"
              ?hidden="${this.hideFilter}"
              icon="editable-table:filter"
              label="Column filtering."
              @change="${this._onTableSettingChange}"
              ?toggled="${this.filter}"
            >
            </editable-table-editor-toggle>
            <editable-table-editor-toggle
              id="downloadable"
              ?disabled="${this.hideDownloadable}"
              ?hidden="${this.hideDownloadable}"
              icon="file-download"
              label="Allow downloading as CSV."
              @change="${this._onTableSettingChange}"
              ?toggled="${this.downloadable}"
            >
            </editable-table-editor-toggle>
            <editable-table-editor-toggle
              id="printable"
              ?disabled="${this.hidePrintable}"
              ?hidden="${this.hidePrintable}"
              icon="print"
              label="Allow printing."
              @change="${this._onTableSettingChange}"
              ?toggled="${this.printable}"
            >
            </editable-table-editor-toggle>
          </div>
        </div>
      </div>
      <div id="htmlImport" hidden><slot></slot></div>
    `;
  }

  static get tag() {
    return "editable-table";
  }
  /**
   * Support being an editing interface element for HAX
   */
  haxHooks() {
    return {
      activeElementChanged: "haxactiveElementChanged",
    };
  }
  /**
   * allow HAX to toggle edit state when activated
   */
  haxactiveElementChanged(el, val) {
    // overwrite HAX dom w/ what our editor is supplying
    if (!val) {
      let replacement = this.getTableHTMLNode();
      if (el) {
        el.replaceWith(replacement);
      }
      el = replacement;
    }
    // aligns state of element w/ HAX if its available
    this.toggleEditMode(val);
    return el;
  }
  constructor() {
    super();
    this.haxUIElement = true;
    this.editMode = false;
    this.hideBordered = false;
    this.hideCondensed = false;
    this.hideDownloadable = false;
    this.hideFilter = false;
    this.hideResponsive = false;
    this.hidePrintable = false;
    this.hideSort = false;
    this.hideStriped = false;
    this.config = [
      {
        command: "close",
        icon: "close",
        label: "Close toolbar",
        toggles: false,
        type: "rich-text-editor-button",
      },
      {
        label: "Basic Inline Operations",
        type: "button-group",
        buttons: [
          {
            command: "bold",
            icon: "editor:format-bold",
            label: "Bold",
            toggles: true,
            type: "rich-text-editor-button",
          },
          {
            command: "italic",
            icon: "editor:format-italic",
            label: "Italics",
            toggles: true,
            type: "rich-text-editor-button",
          },
          {
            collapsedUntil: "md",
            command: "removeFormat",
            icon: "editor:format-clear",
            label: "Erase Format",
            type: "rich-text-editor-button",
          },
        ],
      },
      {
        label: "Links",
        type: "button-group",
        buttons: [
          {
            command: "link",
            icon: "link",
            label: "Link",
            toggledCommand: "unlink",
            toggledIcon: "mdextra:unlink",
            toggledLabel: "Unink",
            toggles: true,
            type: "rich-text-editor-link",
          },
        ],
      },
      {
        collapsedUntil: "md",
        label: "Subscript and Superscript",
        type: "button-group",
        buttons: [
          {
            command: "subscript",
            icon: "mdextra:subscript",
            label: "Subscript",
            toggles: true,
            type: "rich-text-editor-button",
          },
          {
            command: "superscript",
            icon: "mdextra:superscript",
            label: "Superscript",
            toggles: true,
            type: "rich-text-editor-button",
          },
        ],
      },
      {
        collapsedUntil: "sm",
        label: "Lists and Indents",
        type: "button-group",
        buttons: [
          {
            command: "insertOrderedList",
            icon: "editor:format-list-numbered",
            label: "Ordered List",
            toggles: true,
            type: "rich-text-editor-button",
          },
          {
            command: "insertUnorderedList",
            icon: "editor:format-list-bulleted",
            label: "Unordered List",
            toggles: true,
            type: "rich-text-editor-button",
          },
        ],
      },
    ];
  }
  static get properties() {
    return {
      ...displayBehaviors.properties,
      /**
       * text editor config
       */
      config: {
        type: Array,
      },
      /**
       * Is table in edit-mode? Default is false (display mode).
       */
      editMode: {
        type: Boolean,
        attribute: "edit-mode",
      },
      /**
       * Hide borders table styles menu option
       */
      hideBordered: {
        type: Boolean,
        attribute: "hide-bordered",
      },
      /**
       * Hide condensed table styles menu option
       */
      hideCondensed: {
        type: Boolean,
        attribute: "hide-condensed",
      },
      /**
       * Hide downloadable menu option
       */
      hideDownloadable: {
        type: Boolean,
        attribute: "hide-downloadable",
      },
      /**
       * Hide filtering option.
       */
      hideFilter: {
        type: Boolean,
        attribute: "hide-filter",
      },
      /**
       * Hide numeric styling option.
       */
      hideNumericStyles: {
        type: Boolean,
        attribute: "hide-numeric-styles",
      },
      /**
       * Hide printable menu option
       */
      hidePrintable: {
        type: Boolean,
        attribute: "hide-printable",
      },
      /**
       * Hide responsive table styles menu option
       */
      hideResponsive: {
        type: Boolean,
        attribute: "hide-responsive",
      },
      /**
       * Hide sorting option.
       */
      hideSort: {
        type: Boolean,
        attribute: "hide-sort",
      },
      /**
       * Hide striped table styles menu option
       */
      hideStriped: {
        type: Boolean,
        attribute: "hide-striped",
      },
    };
  }

  /**
   * hides data sorting and filtering feature set
   *
   * @readonly
   * @memberof EditableTable
   */
  get hideSortFilter() {
    return this.hideSort && this.hideFilter;
  }
  /**
   * hides display feature set
   *
   * @readonly
   * @memberof EditableTable
   */
  get hideDisplay() {
    return (
      this.hideBordered &&
      this.hideCondensed &&
      this.hideStriped &&
      this.hideNumericStyles &&
      this.hideResponsive
    );
  }

  /**
   * Delete a column at given index
   * @param {number} index index of column
   */
  deleteColumn(index) {
    let temp = [...this.data];
    for (let i = 0; i < temp.length; i++) {
      temp[i].splice(index, 1);
    }
    this.data = temp;
  }

  /**
   * Delete a row at given index
   * @param {number} index index of row
   */
  deleteRow(index) {
    let temp = [...this.data];
    temp.splice(index, 1);
    this.data = temp;
  }
  /**
   * Insert a column at given index
   * @param {number} index index of column
   */
  insertColumn(index) {
    let temp = [...this.data];
    for (let i = 0; i < temp.length; i++) {
      temp[i].splice(index, 0, " ");
    }
    this.data = temp;
  }

  /**
   * Insert a row at given index
   * @param {number} index index of row
   */
  insertRow(index) {
    let temp = [...this.data],
      temp2 = new Array();
    for (let i = 0; i < temp[0].length; i++) {
      temp2.push(" ");
    }
    temp.splice(index + 1, 0, temp2);
    this.data = temp;
  }

  /**
   * Toggles between edit-mode and display mode.
   * @event toggle-edit-mode
   * @param {boolean} edit Toggle edit mode on? Default is toggle from current mode.
   */
  toggleEditMode(edit) {
    edit = edit !== undefined ? edit : !this.editMode;
    this.dispatchEvent(
      new CustomEvent("toggle-edit-mode", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this,
      })
    );
    if (edit && this.shadowRoot) {
      this.shadowRoot.querySelector("editable-table-display").toggleFilter();
      this.shadowRoot
        .querySelector("editable-table-display")
        .sortData("none", -1);
      this.shadowRoot.querySelector("#inner").focus();
    } else {
      this.shadowRoot.querySelectorAll("rich-text-editor").forEach((editor) => {
        editor.disableEditing();
      });
    }
    this.editMode = edit;
  }
  /**
   * Handles when caption paper-input changed
   */
  _captionChanged(e) {
    this.caption = e.detail;
  }

  /**
   * Gets row data for a given row index
   * @param {number} index index of row
   * @param {array} data table data
   * @returns {array} row data
   */
  _getCurrentRow(index, data) {
    let row = null;
    if (
      data !== undefined &&
      data !== null &&
      data[index] !== undefined &&
      data[index] !== null
    ) {
      row = data[index];
    }
    return row;
  }

  /**
   * Handles row/column menu actions
   * @param {event} e event
   */
  _handleRowColumnMenu(e) {
    if (e.detail.insert && e.detail.row) {
      this.insertRow(e.detail.index);
    } else if (e.detail.insert && !e.detail.row) {
      this.insertColumn(e.detail.index);
    } else if (!e.detail.insert && e.detail.row) {
      this.deleteRow(e.detail.index);
    } else {
      this.deleteColumn(e.detail.index);
    }
  }

  /**
   * Tests for first row of data. Workaround to restamp column headers.
   * @param {number} index index of row
   */
  _isFirstRow(index) {
    return index === 0;
  }

  /**
   * Tests for whether or not to disable sort feature.
   * @param {boolean} hideSort if sort feature be hidden
   * @param {boolean} columnHeader if table has column headers
   */
  _isSortDisabled(hideSort, columnHeader) {
    return hideSort || !columnHeader;
  }

  /**
   * Sets focus on cell's textarea if cell is clicked
   * @param {event} e event
   */
  _onCellClick(e) {
    if (e.model && e.model.root && e.model.root.nodeList[0]) {
      e.model.root.nodeList[0].focus();
    }
  }

  /**
   * Updates data when cell value changes
   * @param {event} e event
   */
  _onCellValueChange(e, row, col) {
    let temp = this.data.slice();
    temp[row][col] = e.detail;
    this.data = [];
    this.data = temp;
  }

  /**
   * Updates table properties when setting changes
   * @param {event} e event
   */
  _onTableSettingChange(e) {
    this[e.detail.id] = e.detail.toggled;
  }

  /**
   * Makes sure there is always on cell to work from
   */
  _dataChanged(data, oldData) {
    if ((data && data.length < 1) || data[0].length < 1) {
      this.data = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
      ];
    }
  }
  /**
   * Get row or column label
   * @param {number} index of row or column
   * @param  {boolean} whenther it's a row
   * @returns {string} a row number or a column letter
   */
  _getLabel(index) {
    let numerals = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
      results = this._getLetter(index).split("-").reverse(),
      label = "";
    for (let i = 0; i < results.length; i++) {
      if (results[i] !== "") label += numerals[results[i]];
    }
    return label;
  }

  /**
   * Converts index to a letter.
   * @param {number} index of row or column
   * @returns {string} a column letter
   */
  _getLetter(index) {
    let place = Math.floor(index / 26),
      multiplier = 26 * place,
      remainder = index - multiplier,
      letters = "";
    letters += remainder + "-";
    if (place > 0 && place < 26) {
      letters += place - 1 + "-";
    } else if (place >= 26) {
      letters += this._getLetter(place - 1);
    }
    return letters;
  }
}
window.customElements.define(EditableTable.tag, EditableTable);
export { EditableTable };
