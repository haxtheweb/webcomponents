define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/iron-autogrow-textarea/iron-autogrow-textarea.js",
  "../node_modules/@polymer/iron-icons/iron-icons.js",
  "../node_modules/@polymer/paper-tooltip/paper-tooltip.js",
  "../node_modules/@lrnwebcomponents/dropdown-select/dropdown-select.js",
  "../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js",
  "../node_modules/@lrnwebcomponents/responsive-utility/lib/responsive-utility-behaviors.js",
  "../node_modules/@lrnwebcomponents/a11y-collapse/a11y-collapse.js",
  "./editable-table-behaviors.js",
  "./editable-table-editor-rowcol.js",
  "./editable-table-editor-toggle.js",
  "./editable-table-editor-cell.js",
  "./editable-table-iconset.js",
  "./editable-table-styles.js"
], function(
  _polymerLegacy,
  _ironAutogrowTextarea,
  _ironIcons,
  _paperTooltip,
  _dropdownSelect,
  _simpleColors,
  _responsiveUtilityBehaviors,
  _a11yCollapse,
  _editableTableBehaviors,
  _editableTableEditorRowcol,
  _editableTableEditorToggle,
  _editableTableEditorCell,
  _editableTableIconset,
  _editableTableStyles
) {
  "use strict";
  function _templateObject_34730b00f32e11e8a76ee1850d2d1763() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style is="custom-style" include="editable-table-styles">\n      :host {\n        --a11y-collapse-border: 1px solid #ddd;\n        --a11y-collapse-horizontal-padding: 0;\n        --a11y-collapse: {\n          margin: 0;\n        };\n        --a11y-collapse-heading-focus: {\n          background-color: #f0f0f0;\n        };\n      }\n      :host, \n      :host paper-item {\n        font-size: 12pt;\n      }\n      :host dropdown-select {\n        padding: 0;\n      }\n      :host #accent {\n        --paper-input-container: { \n          padding-top: 0; \n        };\n      }\n      :host([responsive-size="xs"]) editable-table-editor-settings {\n        padding: 3px 0;\n      }\n      :host .filter-icon,\n      :host .sortable-icon {\n        display: none;\n        opacity: 0.4;\n        width: 24px;\n        height: 24px;\n      }\n      :host([sort]) .tbody .tr:first-child .sortable-icon {\n        display: inline-block;\n        opacity: 0.25;\n      }\n      :host([filter]:not([sort])) .filter-icon,\n      :host([filter][sort]) .tbody .tr:not(:first-child) .filter-icon {\n        display: inline-block;\n        opacity: 0.25;\n      }\n      :host .field-group {\n        width: 100%;\n        margin: 0 0 10px;\n        padding: 0;\n      }\n      :host .field-group {\n        display: flex;\n        justify-content: space-between;\n        align-items: baseline;\n        transition: all 2s;\n        flex-wrap: wrap;\n      }\n      :host .field-group.field-group-stretch {\n        align-items: stretch;\n      }\n      :host .field-group-border {\n        border: 1px solid #ddd;\n        border-radius: 4px;\n        padding: 15px;\n        margin: 15px;\n      }\n      :host .field-group-grow {\n        flex-grow: 1;\n        transition: width 2s;\n      }\n      :host .field-group-shrink {\n        flex-shrink: 1;\n        transition: width 2s;\n      }\n      :host .field-group-label {\n       padding-right: 8px;\n       font-weight: bold;\n      }\n      :host .field-group label {\n        line-height: 30px;\n      }\n      :host #caption {\n        padding: 0;\n        display: inline-block;\n        width: unset;\n      }\n      :host .caption.field-group {\n        margin-bottom: 0;\n      }\n      :host .table .th,\n      :host .table .td {\n        border: 1px solid #ddd;\n      }\n      :host .table .th {\n        padding: 0;\n        vertical-align: center;\n        color: black;\n        background-color: #f0f0f0;\n      }\n      :host .table .td {\n        vertical-align: top;\n        padding: 8px 4px;\n      }\n      :host .table .th:first-child {\n        width: 96px;\n      }\n      :host([condensed]) .table .th {\n        padding: 0;\n      }\n      :host([condensed]) .table .td {\n        padding: 0 4px;\n      }\n      :host .table[bordered] .td {\n        border: 1px solid var(--editable-table-border-color);\n      }\n      :host([dark]) table .tbody .th {\n        border-right: 1px solid var(--editable-table-bg-color);\n      }\n      :host([dark]) .table .thead .th:not(:first-child) {\n        border-bottom: 1px solid var(--editable-table-bg-color);\n      }\n      :host .table([bordered]) .thead .th:not(:first-child) {\n        border-bottom: 1px solid var(--editable-table-border-color);\n      }\n      :host([striped]) .table .tr:nth-child(2n+1) .td {\n        @apply --editable-table-style-stripe;\n      }\n      :host([column-header]) .table .tbody .tr:first-child .td {\n        @apply --editable-table-style-column-header;\n      }\n      :host([row-header]) .table .tbody .tr .td:first-of-type {\n        @apply --editable-table-style-row-header;\n      }\n      :host([footer]) .table .tbody .tr:last-of-type .td {\n        @apply --editable-table-style-footer;\n      }\n    </style>\n    <p class="sr-only">Table Editor</p>\n    <p class="field-group">\n      <label aria-hidden="true" class="field-group-label">Table Caption </label>\n      <iron-autogrow-textarea id="caption" class="field-group-grow caption" label="Table Caption" placeholder="A title for the table." value$="{{caption}}">\n      </iron-autogrow-textarea>\n    </p>\n    <p class="field-group">\n      <label aria-hidden="true" class="field-group-label">Table Summary (for accessibility) </label>\n      <iron-autogrow-textarea id="summary" class="field-group-grow" label="Table Summary (for accessibility)" placeholder="Describe what the table contains. What does each row represent? What does each column represent?" value$="{{summary}}">\n      </iron-autogrow-textarea>\n    </p>\n    <div id="table-outer">\n        <a11y-collapse accordion="" icon="settings" label="show settings" label-expanded="hide settings" tooltip="Show/hide table settings.">\n          <div slot="heading" class="field-group-label">Table Settings </div>\n          <div class="field-group field-group-stretch">\n            <div class="field-group-border field-group-grow">\n              <label class="">Headers and Footers: </label>\n              <editable-table-editor-toggle label="First Column" prop="rowHeader" tooltip="The first column is a row header." value$="{{rowHeader}}">\n              </editable-table-editor-toggle>\n              <editable-table-editor-toggle label="First Row" prop="columnHeader" tooltip="The first row is a column header." value$="{{columnHeader}}">\n              </editable-table-editor-toggle>\n              <editable-table-editor-toggle hidden$="[[hideFooter]]" label="Last Row" prop="footer" tooltip="The last row is a table footer." value$="{{footer}}">\n              </editable-table-editor-toggle>\n            </div>\n            <div class="field-group-border field-group-grow" hidden$="[[hideTableTheme]]">\n              <label>Theme: </label>\n              <div class="field-group-grow">\n                <dropdown-select id="accent" label="Accent Color" value$="{{accentColor}}">\n                  <paper-item value="none">None</paper-item>\n                  <paper-item value="red">Red</paper-item>\n                  <paper-item value="pink">Pink</paper-item>\n                  <paper-item value="purple">Purple</paper-item>\n                  <paper-item value="deep-purple">Deep Purple</paper-item>\n                  <paper-item value="indigo">Indigo</paper-item>\n                  <paper-item value="blue">Blue</paper-item>\n                  <paper-item value="light-blue">Light Blue</paper-item>\n                  <paper-item value="cyan">Cyan</paper-item>\n                  <paper-item value="teal">Teal</paper-item>\n                  <paper-item value="green">Green</paper-item>\n                  <paper-item value="light-green">Light Green</paper-item>\n                  <paper-item value="lime">Lime</paper-item>\n                  <paper-item value="yellow">Yellow</paper-item>\n                  <paper-item value="amber">Amber</paper-item>\n                  <paper-item value="orange">Orange</paper-item>\n                  <paper-item value="deep-orange">Deep Orange</paper-item>\n                  <paper-item value="brown">Deep Orange</paper-item>\n                  <paper-item value="blue-grey">Blue-Grey</paper-item>\n                </dropdown-select>\n              </div>\n              <paper-tooltip for="accent">Set an accent color for the table.</paper-tooltip>\n              <editable-table-editor-toggle hidden$="[[hideDarkTheme]]" label="Dark" prop="dark" tooltip="Use the dark theme." value$="{{dark}}">\n              </editable-table-editor-toggle>\n            </div>\n            <div class="field-group-border field-group-grow" hidden$="[[hideTableStyles]]">\n              <label>Styles: </label>\n              <editable-table-editor-toggle hidden$="[[hideBordered]]" label="Bordered" prop="bordered" tooltip="Add borders to cells." value$="{{bordered}}">\n              </editable-table-editor-toggle>\n              <editable-table-editor-toggle hidden$="[[hideStriped]]" label="Striped" prop="striped" tooltip="Add shading to alternating rows." value$="{{striped}}">\n              </editable-table-editor-toggle>\n              <editable-table-editor-toggle hidden$="[[hideCondensed]]" label="Condensed" prop="condensed" tooltip="Condense cell height." value$="{{condensed}}">\n              </editable-table-editor-toggle>\n              <editable-table-editor-toggle hidden$="[[hideScroll]]" label="Disable Responsive" prop="scroll" tooltip="Disables the default responsive feature." value$="{{scroll}}">\n              </editable-table-editor-toggle>\n            </div>\n            <div class="field-group-border field-group-grow" hidden$="[[hideTableSort]]">\n              <label>Sorting and Filtering: </label>\n              <editable-table-editor-toggle disabled$="[[!columnHeader]]" hidden$="[[hideSort]]" label="Enable Sorting" prop="sort" tooltip="When first row is a column header, make the column sortable." value$="{{sort}}">\n              </editable-table-editor-toggle>\n              <editable-table-editor-toggle hidden$="[[hideFilter]]" label="Enable Filters" prop="filter" tooltip="When a cell is clicked toggle a filter based on that cell\'s value." value$="{{filter}}">\n              </editable-table-editor-toggle> \n            </div>\n          </div>\n        </a11y-collapse>\n      <table id="table" class="table" bordered$="{{bordered}}" condensed$="{{condensed}}" striped$="{{striped}}" summary="Editable table in edit mode. The table body contains fields to edit table data. Each column header contains buttons for editing the column. Each row header contains buttons for editing the row.">\n        <caption class="sr-only">Editable Table Data</caption>\n        <thead class="thead"> \n          <tr class="tr">\n            <th class="th" scope="col"><span class="sr-only">Row Functions</span></th>\n            <template id="headers" is="dom-repeat" items="[[data]]" as="row" index-as="tr" restamp="true">\n              <template is="dom-if" if="[[_isFirstRow(tr)]]" restamp="true">\n                <template id="headercols" is="dom-repeat" items="[[row]]" as="cell" index-as="th" restamp="true">\n                  <th class="th" scope="col"><editable-table-editor-rowcol condensed$="{{condensed}}" index$="[[th]]" type="Column"></editable-table-editor-rowcol></th> \n                </template>   \n              </template>\n            </template>\n          </tr> \n        </thead>\n        <tbody id="tbody" class="tbody"> \n          <template id="rows" is="dom-repeat" items="[[data]]" as="row" index-as="tr" restamp="true">\n            <tr class="tr">\n              <th class="th" scope="row"><editable-table-editor-rowcol condensed$="{{condensed}}" index$="[[tr]]" type="Row"></editable-table-editor-rowcol></th>\n              <template id="columns" is="dom-repeat" items="[[row]]" as="cell" restamp="true">\n                <td class="td">\n                  <editable-table-editor-cell row="[[tr]]" column="[[index]]" value$="{{cell}}">\n                    <iron-icon class="sortable-icon" icon="editable-table:sortable" aria-hidden="true"></iron-icon>\n                    <iron-icon class="filter-icon" icon="editable-table:filter-off"></iron-icon>\n                  </editable-table-editor-cell>\n                </td>\n              </template>\n            </tr> \n          </template>\n        </tbody>\n      </table>\n    </div>\n'
      ],
      [
        '\n    <style is="custom-style" include="editable-table-styles">\n      :host {\n        --a11y-collapse-border: 1px solid #ddd;\n        --a11y-collapse-horizontal-padding: 0;\n        --a11y-collapse: {\n          margin: 0;\n        };\n        --a11y-collapse-heading-focus: {\n          background-color: #f0f0f0;\n        };\n      }\n      :host, \n      :host paper-item {\n        font-size: 12pt;\n      }\n      :host dropdown-select {\n        padding: 0;\n      }\n      :host #accent {\n        --paper-input-container: { \n          padding-top: 0; \n        };\n      }\n      :host([responsive-size="xs"]) editable-table-editor-settings {\n        padding: 3px 0;\n      }\n      :host .filter-icon,\n      :host .sortable-icon {\n        display: none;\n        opacity: 0.4;\n        width: 24px;\n        height: 24px;\n      }\n      :host([sort]) .tbody .tr:first-child .sortable-icon {\n        display: inline-block;\n        opacity: 0.25;\n      }\n      :host([filter]:not([sort])) .filter-icon,\n      :host([filter][sort]) .tbody .tr:not(:first-child) .filter-icon {\n        display: inline-block;\n        opacity: 0.25;\n      }\n      :host .field-group {\n        width: 100%;\n        margin: 0 0 10px;\n        padding: 0;\n      }\n      :host .field-group {\n        display: flex;\n        justify-content: space-between;\n        align-items: baseline;\n        transition: all 2s;\n        flex-wrap: wrap;\n      }\n      :host .field-group.field-group-stretch {\n        align-items: stretch;\n      }\n      :host .field-group-border {\n        border: 1px solid #ddd;\n        border-radius: 4px;\n        padding: 15px;\n        margin: 15px;\n      }\n      :host .field-group-grow {\n        flex-grow: 1;\n        transition: width 2s;\n      }\n      :host .field-group-shrink {\n        flex-shrink: 1;\n        transition: width 2s;\n      }\n      :host .field-group-label {\n       padding-right: 8px;\n       font-weight: bold;\n      }\n      :host .field-group label {\n        line-height: 30px;\n      }\n      :host #caption {\n        padding: 0;\n        display: inline-block;\n        width: unset;\n      }\n      :host .caption.field-group {\n        margin-bottom: 0;\n      }\n      :host .table .th,\n      :host .table .td {\n        border: 1px solid #ddd;\n      }\n      :host .table .th {\n        padding: 0;\n        vertical-align: center;\n        color: black;\n        background-color: #f0f0f0;\n      }\n      :host .table .td {\n        vertical-align: top;\n        padding: 8px 4px;\n      }\n      :host .table .th:first-child {\n        width: 96px;\n      }\n      :host([condensed]) .table .th {\n        padding: 0;\n      }\n      :host([condensed]) .table .td {\n        padding: 0 4px;\n      }\n      :host .table[bordered] .td {\n        border: 1px solid var(--editable-table-border-color);\n      }\n      :host([dark]) table .tbody .th {\n        border-right: 1px solid var(--editable-table-bg-color);\n      }\n      :host([dark]) .table .thead .th:not(:first-child) {\n        border-bottom: 1px solid var(--editable-table-bg-color);\n      }\n      :host .table([bordered]) .thead .th:not(:first-child) {\n        border-bottom: 1px solid var(--editable-table-border-color);\n      }\n      :host([striped]) .table .tr:nth-child(2n+1) .td {\n        @apply --editable-table-style-stripe;\n      }\n      :host([column-header]) .table .tbody .tr:first-child .td {\n        @apply --editable-table-style-column-header;\n      }\n      :host([row-header]) .table .tbody .tr .td:first-of-type {\n        @apply --editable-table-style-row-header;\n      }\n      :host([footer]) .table .tbody .tr:last-of-type .td {\n        @apply --editable-table-style-footer;\n      }\n    </style>\n    <p class="sr-only">Table Editor</p>\n    <p class="field-group">\n      <label aria-hidden="true" class="field-group-label">Table Caption </label>\n      <iron-autogrow-textarea id="caption" class="field-group-grow caption" label="Table Caption" placeholder="A title for the table." value\\$="{{caption}}">\n      </iron-autogrow-textarea>\n    </p>\n    <p class="field-group">\n      <label aria-hidden="true" class="field-group-label">Table Summary (for accessibility) </label>\n      <iron-autogrow-textarea id="summary" class="field-group-grow" label="Table Summary (for accessibility)" placeholder="Describe what the table contains. What does each row represent? What does each column represent?" value\\$="{{summary}}">\n      </iron-autogrow-textarea>\n    </p>\n    <div id="table-outer">\n        <a11y-collapse accordion="" icon="settings" label="show settings" label-expanded="hide settings" tooltip="Show/hide table settings.">\n          <div slot="heading" class="field-group-label">Table Settings </div>\n          <div class="field-group field-group-stretch">\n            <div class="field-group-border field-group-grow">\n              <label class="">Headers and Footers: </label>\n              <editable-table-editor-toggle label="First Column" prop="rowHeader" tooltip="The first column is a row header." value\\$="{{rowHeader}}">\n              </editable-table-editor-toggle>\n              <editable-table-editor-toggle label="First Row" prop="columnHeader" tooltip="The first row is a column header." value\\$="{{columnHeader}}">\n              </editable-table-editor-toggle>\n              <editable-table-editor-toggle hidden\\$="[[hideFooter]]" label="Last Row" prop="footer" tooltip="The last row is a table footer." value\\$="{{footer}}">\n              </editable-table-editor-toggle>\n            </div>\n            <div class="field-group-border field-group-grow" hidden\\$="[[hideTableTheme]]">\n              <label>Theme: </label>\n              <div class="field-group-grow">\n                <dropdown-select id="accent" label="Accent Color" value\\$="{{accentColor}}">\n                  <paper-item value="none">None</paper-item>\n                  <paper-item value="red">Red</paper-item>\n                  <paper-item value="pink">Pink</paper-item>\n                  <paper-item value="purple">Purple</paper-item>\n                  <paper-item value="deep-purple">Deep Purple</paper-item>\n                  <paper-item value="indigo">Indigo</paper-item>\n                  <paper-item value="blue">Blue</paper-item>\n                  <paper-item value="light-blue">Light Blue</paper-item>\n                  <paper-item value="cyan">Cyan</paper-item>\n                  <paper-item value="teal">Teal</paper-item>\n                  <paper-item value="green">Green</paper-item>\n                  <paper-item value="light-green">Light Green</paper-item>\n                  <paper-item value="lime">Lime</paper-item>\n                  <paper-item value="yellow">Yellow</paper-item>\n                  <paper-item value="amber">Amber</paper-item>\n                  <paper-item value="orange">Orange</paper-item>\n                  <paper-item value="deep-orange">Deep Orange</paper-item>\n                  <paper-item value="brown">Deep Orange</paper-item>\n                  <paper-item value="blue-grey">Blue-Grey</paper-item>\n                </dropdown-select>\n              </div>\n              <paper-tooltip for="accent">Set an accent color for the table.</paper-tooltip>\n              <editable-table-editor-toggle hidden\\$="[[hideDarkTheme]]" label="Dark" prop="dark" tooltip="Use the dark theme." value\\$="{{dark}}">\n              </editable-table-editor-toggle>\n            </div>\n            <div class="field-group-border field-group-grow" hidden\\$="[[hideTableStyles]]">\n              <label>Styles: </label>\n              <editable-table-editor-toggle hidden\\$="[[hideBordered]]" label="Bordered" prop="bordered" tooltip="Add borders to cells." value\\$="{{bordered}}">\n              </editable-table-editor-toggle>\n              <editable-table-editor-toggle hidden\\$="[[hideStriped]]" label="Striped" prop="striped" tooltip="Add shading to alternating rows." value\\$="{{striped}}">\n              </editable-table-editor-toggle>\n              <editable-table-editor-toggle hidden\\$="[[hideCondensed]]" label="Condensed" prop="condensed" tooltip="Condense cell height." value\\$="{{condensed}}">\n              </editable-table-editor-toggle>\n              <editable-table-editor-toggle hidden\\$="[[hideScroll]]" label="Disable Responsive" prop="scroll" tooltip="Disables the default responsive feature." value\\$="{{scroll}}">\n              </editable-table-editor-toggle>\n            </div>\n            <div class="field-group-border field-group-grow" hidden\\$="[[hideTableSort]]">\n              <label>Sorting and Filtering: </label>\n              <editable-table-editor-toggle disabled\\$="[[!columnHeader]]" hidden\\$="[[hideSort]]" label="Enable Sorting" prop="sort" tooltip="When first row is a column header, make the column sortable." value\\$="{{sort}}">\n              </editable-table-editor-toggle>\n              <editable-table-editor-toggle hidden\\$="[[hideFilter]]" label="Enable Filters" prop="filter" tooltip="When a cell is clicked toggle a filter based on that cell\'s value." value\\$="{{filter}}">\n              </editable-table-editor-toggle> \n            </div>\n          </div>\n        </a11y-collapse>\n      <table id="table" class="table" bordered\\$="{{bordered}}" condensed\\$="{{condensed}}" striped\\$="{{striped}}" summary="Editable table in edit mode. The table body contains fields to edit table data. Each column header contains buttons for editing the column. Each row header contains buttons for editing the row.">\n        <caption class="sr-only">Editable Table Data</caption>\n        <thead class="thead"> \n          <tr class="tr">\n            <th class="th" scope="col"><span class="sr-only">Row Functions</span></th>\n            <template id="headers" is="dom-repeat" items="[[data]]" as="row" index-as="tr" restamp="true">\n              <template is="dom-if" if="[[_isFirstRow(tr)]]" restamp="true">\n                <template id="headercols" is="dom-repeat" items="[[row]]" as="cell" index-as="th" restamp="true">\n                  <th class="th" scope="col"><editable-table-editor-rowcol condensed\\$="{{condensed}}" index\\$="[[th]]" type="Column"></editable-table-editor-rowcol></th> \n                </template>   \n              </template>\n            </template>\n          </tr> \n        </thead>\n        <tbody id="tbody" class="tbody"> \n          <template id="rows" is="dom-repeat" items="[[data]]" as="row" index-as="tr" restamp="true">\n            <tr class="tr">\n              <th class="th" scope="row"><editable-table-editor-rowcol condensed\\$="{{condensed}}" index\\$="[[tr]]" type="Row"></editable-table-editor-rowcol></th>\n              <template id="columns" is="dom-repeat" items="[[row]]" as="cell" restamp="true">\n                <td class="td">\n                  <editable-table-editor-cell row="[[tr]]" column="[[index]]" value\\$="{{cell}}">\n                    <iron-icon class="sortable-icon" icon="editable-table:sortable" aria-hidden="true"></iron-icon>\n                    <iron-icon class="filter-icon" icon="editable-table:filter-off"></iron-icon>\n                  </editable-table-editor-cell>\n                </td>\n              </template>\n            </tr> \n          </template>\n        </tbody>\n      </table>\n    </div>\n'
      ]
    );
    _templateObject_34730b00f32e11e8a76ee1850d2d1763 = function _templateObject_34730b00f32e11e8a76ee1850d2d1763() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_34730b00f32e11e8a76ee1850d2d1763()
    ),
    is: "editable-table-editor",
    listeners: {
      "cell-move": "_onCellMove",
      "cell-value-changed": "_onCellValueChange",
      "insert-row": "_handleInsertRow",
      "insert-column": "_handleInsertColumn",
      "delete-row": "_handleDeleteRow",
      "delete-column": "_handleDeleteColumn",
      "editable-table-setting-changed": "_onTableSettingChange",
      "dropdown-select-changed": "_onAccentChange"
    },
    behaviors: [
      ResponsiveUtilityBehaviors,
      simpleColorsBehaviors,
      editableTableBehaviors.displayBehaviors,
      editableTableBehaviors.editBehaviors
    ],
    observers: ["_setMinimumData(data)"],
    properties: {
      accentSelected: {
        type: String,
        computed: "_getAccentSelected(accentColor)"
      },
      hideTableStyles: {
        type: Boolean,
        computed:
          "_tableStylesHidden(hideBordered,hideCondensed,hideStriped,hideScroll)"
      },
      hideTableTheme: {
        type: Boolean,
        computed: "_tableThemeHidden(hideAccentColor,hideDarkTheme)"
      },
      hideTableSort: {
        type: Boolean,
        computed: "_tableSortHidden(hideSort,hideFilter)"
      }
    },
    ready: function ready() {
      this.onclick = function(e) {
        var el =
          null !== e.srcElement &&
          null !== e.srcElement.tagName &&
          "td" === e.srcElement.tagName.toLowerCase()
            ? e.srcElement
            : !1;
        if (el && null !== el.getElementsByTagName("editable-table-cell")) {
          console.log(el.children[0]);
          el.children[0].focus();
        }
      };
    },
    _getAccentSelected: function _getAccentSelected(accentColor) {
      return null !== accentColor ? accentColor : "none";
    },
    _getCurrentRow: function _getCurrentRow(index, data) {
      var row = null;
      if (
        data !== void 0 &&
        null !== data &&
        data[index] !== void 0 &&
        null !== data[index]
      ) {
        row = data[index];
      }
      return row;
    },
    _handleDeleteColumn: function _handleDeleteColumn(e) {
      this.deleteColumn(e.detail);
    },
    _handleDeleteRow: function _handleDeleteRow(e) {
      this.deleteRow(e.detail);
    },
    _handleInsertColumn: function _handleInsertColumn(e) {
      this.insertColumn(e.detail);
    },
    _handleInsertRow: function _handleInsertRow(e) {
      this.insertRow(e.detail);
    },
    _isFirstRow: function _isFirstRow(index) {
      return 0 === index;
    },
    _onAccentChange: function _onAccentChange(e) {
      this.accentColor = "none" !== e.detail.value ? e.detail.value : null;
    },
    _onCellMove: function _onCellMove(e) {
      var dir = e.detail.direction,
        cell = e.detail.cell,
        row = cell.parentNode,
        body = this.$.tbody,
        x = Array.prototype.indexOf.call(row.children, cell),
        y = Array.prototype.indexOf.call(body.children, row);
      if ("down" === dir) {
        if (y + 1 < body.children.length - 1) {
          body.children[y + 1].children[x].children[0].setFocus();
        } else {
          this.insertRow(y);
        }
      } else if ("up" === dir) {
        if (0 < y) {
          body.children[y - 1].children[x].children[0].setFocus();
        }
      } else if ("right" === dir) {
        if (x + 1 < row.children.length - 1) {
          row.children[x + 1].children[0].setFocus();
        } else if (y + 1 < body.children.length - 1) {
          body.children[y + 1].children[1].children[0].setFocus();
        }
      } else if ("left" === dir) {
        if (1 < x) {
          row.children[x - 1].children[0].setFocus();
        } else if (0 < y) {
          body.children[y - 2].children[
            body.children[y - 2].children.length - 2
          ].children[0].setFocus();
        }
      }
    },
    _onCellValueChange: function _onCellValueChange(e) {
      this.set("data." + e.detail.row + "." + e.detail.column, e.detail.value);
    },
    _onTableSettingChange: function _onTableSettingChange(e) {
      this[e.detail.prop] = e.detail.value;
    },
    _setMinimumData: function _setMinimumData(data) {
      if (1 > data.length || 1 > data[0].length) {
        this.set("data", [["", "", ""], ["", "", ""], ["", "", ""]]);
      }
    },
    _tableStylesHidden: function _tableStylesHidden(
      hideBordered,
      hideCondensed,
      hideStriped,
      hideScroll
    ) {
      return hideBordered && hideCondensed && hideStriped && hideScroll;
    },
    _tableThemeHidden: function _tableThemeHidden(
      hideAccentColor,
      hideDarkTheme
    ) {
      return hideAccentColor && hideDarkTheme;
    },
    _tableSortHidden: function _tableSortHidden(hideSort, hideFilter) {
      return hideSort && hideFilter;
    },
    deleteColumn: function deleteColumn(index) {
      if (confirm("Delete entire column?")) {
        for (var i = 0; i < this.data.length; i++) {
          this.splice("data." + i, index, 1);
        }
      }
    },
    deleteRow: function deleteRow(index) {
      if (confirm("Delete entire row?")) {
        this.splice("data", index, 1);
      }
    },
    insertColumn: function insertColumn(index) {
      for (var temp = [], first = null, i = 0; i < this.data.length; i++) {
        this.splice("data." + i, index, 0, "");
      }
    },
    insertRow: function insertRow(index) {
      for (var temp = [], i = 0; i < this.data[0].length; i++) {
        temp.push("");
      }
      this.splice("data", index + 1, 0, temp);
    }
  });
});
