/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { css } from "lit";
/**
 * `editable-table-styles`
 * The editable-table styles on their own, so a page that only needs the
 * display styles (every HAXcms theme does) does not load the behaviors.
 * editable-table-behaviors.js re-exports these unchanged.
 */

/**
 * styling for table cells
 * @const
 * @default
 * @type {array}
 *
 */
export const editableTableCellStyles = [css``];

/**
 * styling for table
 * @const
 * @default
 * @type {array}
 */
export const editableTableStyles = [
  css`
    :host {
      display: block;
      width: 100%;
      max-width: 100%;
      margin: var(--ddd-spacing-4) 0;
      font-size: var(--editable-table-font-size, unset);
      font-family: var(--editable-table-font-family, inherit);
      font-weight: var(--editable-table-medium-weight, 300);
      color: var(
        --editable-table-color,
        light-dark(
          var(--ddd-theme-default-coalyGray, #222),
          var(--ddd-theme-default-limestoneLight, #e4e5e7)
        )
      );
      background-color: var(
        --editable-table-bg-color,
        light-dark(
          var(--ddd-theme-default-white, #fff),
          var(--ddd-theme-default-coalyGray, #262626)
        )
      );
    }
    :host([hidden]) {
      display: none;
    }
    .offscreen {
      position: absolute;
      inset-inline-start: -9999px;
      font-size: 0;
      height: 0;
      width: 0;
      overflow: hidden;
      margin: 0;
      padding: 0;
    }
    table {
      width: calc(100% - 2 * var(--editable-table-border-width, 1px));
      display: table;
      border-collapse: collapse;
      border-width: var(--editable-table-border-width, 1px);
      border-style: var(--editable-table-border-style, solid);
      border-color: var(
        --editable-table-border-color,
        light-dark(
          var(--ddd-theme-default-coalyGray, #999),
          var(--ddd-theme-default-limestoneGray, #a2aaad)
        )
      );
      font-weight: var(--editable-table-light-weight, 200);
      color: var(
        --editable-table-color,
        light-dark(
          var(--ddd-theme-default-coalyGray, #222),
          var(--ddd-theme-default-limestoneLight, #e4e5e7)
        )
      );
      background-color: var(
        --editable-table-bg-color,
        light-dark(
          var(--ddd-theme-default-white, #fff),
          var(--ddd-theme-default-coalyGray, #262626)
        )
      );
    }
    .th,
    .td,
    .th-or-td .icon-container {
      font-weight: var(--editable-table-light-weight, 200);
      color: var(
        --editable-table-color,
        light-dark(
          var(--ddd-theme-default-coalyGray, #222),
          var(--ddd-theme-default-limestoneLight, #e4e5e7)
        )
      );
      background-color: var(
        --editable-table-bg-color,
        light-dark(
          var(--ddd-theme-default-white, #fff),
          var(--ddd-theme-default-coalyGray, #262626)
        )
      );
    }
    caption {
      font-size: var(
        --editable-table-caption-font-size,
        var(--editable-table-font-size, unset)
      );
      font-weight: var(--editable-table-heavy-weight, 600);
      color: var(
        --editable-table-caption-color,
        var(
          --editable-table-color,
          light-dark(
            var(--ddd-theme-default-coalyGray, #222),
            var(--ddd-theme-default-limestoneLight, #e4e5e7)
          )
        )
      );
      background-color: var(
        --editable-table-caption-bg-color,
        var(
          --editable-table-bg-color,
          light-dark(
            var(--ddd-theme-default-white, #fff),
            var(--ddd-theme-default-coalyGray, #262626)
          )
        )
      );
      width: 100%;
    }
    .tr {
      display: table-row;
    }
    .th-or-td {
      display: table-cell;
    }
    .thead-tr .th,
    .thead-tr .th .icon-container {
      background-color: var(
        --editable-table-heading-bg-color,
        light-dark(
          var(--ddd-theme-default-limestoneLight, #e0e0e0),
          var(--ddd-theme-default-slateGray, #314d64)
        )
      );
      font-weight: var(--editable-table-heavy-weight, 600);
      color: var(
        --editable-table-heading-color,
        light-dark(
          var(--ddd-theme-default-coalyGray, #000),
          var(--ddd-theme-default-white, #fff)
        )
      );
    }
    .tbody-tr .th,
    .tbody-tr .th .icon-container {
      font-weight: var(--editable-table-heavy-weight, 600);
      color: var(
        --editable-table-heading-color,
        light-dark(
          var(--ddd-theme-default-coalyGray, #000),
          var(--ddd-theme-default-white, #fff)
        )
      );
      background-color: var(
        --editable-table-bg-color,
        light-dark(
          var(--ddd-theme-default-white, #fff),
          var(--ddd-theme-default-coalyGray, #262626)
        )
      );
      text-align: start;
    }
    *[bordered] .th,
    *[bordered] .td {
      border-width: var(--editable-table-border-width, 1px);
      border-style: var(--editable-table-border-style, solid);
      border-color: var(
        --editable-table-border-color,
        light-dark(
          var(--ddd-theme-default-coalyGray, #999),
          var(--ddd-theme-default-limestoneGray, #a2aaad)
        )
      );
    }
    *[condensed] {
      --editable-table-cell-vertical-padding: var(
        --editable-table-cell-vertical-padding-condensed,
        2px
      );
      --editable-table-cell-horizontal-padding: var(
        --editable-table-cell-horizontal-padding-condensed,
        4px
      );
    }
    *[striped] .tbody-tr:nth-child(2n + 1) .th-or-td,
    *[striped] .tbody-tr:nth-child(2n + 1) .th-or-td .icon-container {
      background-color: var(
        --editable-table-stripe-bg-color,
        light-dark(
          var(--ddd-theme-default-limestoneMaxLight, #f0f0f0),
          var(--ddd-theme-default-black, #000)
        )
      );
    }
    *[column-striped] .tbody-tr .th-or-td:nth-child(2n),
    *[column-striped] .tbody-tr .th-or-td:nth-child(2n) .icon-container,
    *[column-striped] .tfoot-tr .th-or-td:nth-child(2n),
    *[column-striped] .tfoot-tr .th-or-td:nth-child(2n) .icon-container {
      background-color: var(
        --editable-table-stripe-bg-color,
        light-dark(
          var(--ddd-theme-default-limestoneMaxLight, #f0f0f0),
          var(--ddd-theme-default-black, #000)
        )
      );
    }
    .tfoot-tr .th,
    .tfoot-tr .td {
      border-top: 2px solid
        var(
          --editable-table-color,
          light-dark(
            var(--ddd-theme-default-coalyGray, #222),
            var(--ddd-theme-default-limestoneLight, #e4e5e7)
          )
        );
      font-weight: var(--editable-table-heavy-weight, 600);
      color: var(
        --editable-table-heading-color,
        light-dark(
          var(--ddd-theme-default-coalyGray, #000),
          var(--ddd-theme-default-white, #fff)
        )
      );
    }
    caption,
    .th-or-td {
      text-align: start;
    }
    *[numeric-styles] .thead-tr .th-or-td[numeric],
    *[numeric-styles] .tfoot-tr .th-or-td[numeric],
    *[numeric-styles] .th-or-td[numeric] .cell {
      text-align: end;
      --editable-table-cell-justify: flex-end;
    }
    *[numeric-styles] .tfoot-tr .th-or-td[negative],
    *[numeric-styles] .td[negative] .cell {
      color: var(
        --editable-table-negative-color,
        var(--simple-colors-default-theme-red-10, red)
      );
      --editable-table-cell-color: var(
        --editable-table-negative-color,
        var(--simple-colors-default-theme-red-10, red)
      );
    }
    editable-table-display ::slotted(table) {
      display: none;
    }
    @media screen {
      :host {
        width: 100%;
        max-width: 100%;
      }
      :host([responsive]) {
        overflow-x: visible;
      }
    }
  `,
];

/**
 * styling for table in display mode
 * @const
 * @default
 * @type {array}
 */
export const editableTableDisplayStyles = [
  ...editableTableStyles,
  css`
    caption {
      padding-top: var(--editable-table-cell-vertical-padding, 10px);
      padding-bottom: var(--editable-table-cell-vertical-padding, 10px);
      padding: 0;
    }
    caption > div {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
    }
    caption > div > div {
      flex: 1 1 auto;
    }
    caption > div > div:last-child {
      flex: 0 0 auto;
    }
    caption button {
      padding: 2px;
      margin: 0;
    }
    .column {
      width: calc(var(--simple-picker-option-size) + 6px);
      overflow: visible;
      display: none;
      margin-inline-end: 0px;
      --simple-picker-border-width: 1px;
      --simple-picker-focus-border-width: 1px;
      --simple-picker-border-color: var(
        --editable-table-border-color,
        light-dark(
          var(--ddd-theme-default-coalyGray, #999),
          var(--ddd-theme-default-limestoneGray, #a2aaad)
        )
      );
    }
    .th,
    .td {
      padding: var(
          --editable-table-cell-vertical-padding,
          var(--ddd-spacing-3, 10px)
        )
        var(--editable-table-cell-horizontal-padding, var(--ddd-spacing-2, 6px));
    }
    span.cell {
      display: block;
    }
    @media screen {
      :host([responsive][responsive-size="xs"]) .column {
        display: inline-flex;
        width: 30px;
        overflow: visible;
      }
      :host([responsive][responsive-size="xs"]) .th[xs-hidden],
      :host([responsive][responsive-size="xs"]) .td[xs-hidden] {
        display: none;
      }
    }
  `,
];
