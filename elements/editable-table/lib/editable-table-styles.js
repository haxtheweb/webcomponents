/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * `editanle-table-styles`
 * `a shared set of styles for editable-table`
### Styling

Custom property | Description | Default
----------------|-------------|----------
`--editable-table-light-weight` | The lightest font weight applied to the table | 200
`--editable-table-medium-weight` | The average font weight applied to the table | 400
`--editable-table-heavy-weight` | The heaviest font weight applied to the table | 500
`--editable-table-color` | The default text color | #222
`--editable-table-bg-color` | The default background color | #fff
`--editable-table-border-color` | The default border color | #999
`--editable-table-caption-color` | The caption text color | #222
`--editable-table-caption-bg-color` | The caption background color | #fff
`--editable-table-heading-color` | The heading text color | #000
`--editable-table-heading-bg-color` | The heading background color | #ddd
`--editable-table-stripe-bg-color` | The striping background color | #eee
`--editable-table-style-stripe` | Applies a style to the striping | `background-color: var(--editable-table-stripe-bg-color);`
`--editable-table-style-column-header` | Applies a style to the column headers | ```font-weight: var(--editable-table-heavy-weight);
color: var(--editable-table-heading-color);
background-color: var(--editable-table-heading-bg-color);```
`--editable-table-style-row-header` | Applies a style to the row headers | ```font-weight:  var(--editable-table-heavy-weight);
        color: var(--editable-table-heading-color);```
`--editable-table-style-footer` | Applies a style to the footer | ```font-weight: var(--editable-table-heavy-weight);
        color: var(--editable-table-heading-color);
        border-top: 3px solid var(--editable-table-color);```
 *
 * @pseudoElement
 * @polymer
 * @demo demo/index.html
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
const styleElement = document.createElement("dom-module");

const css = html`
  <style is="custom-style">
    :host {
      display: block;
      width: 100%;
      max-width: 100%;
      overflow-x: scroll;
      margin: 15px 0;
      --editable-table-font-family: inherit;
      --editable-table-secondary-font-family: "Roboto", "Noto", sans-serif;
      font-family: var(--editable-table-font-family);

      --editable-table-light-weight: 200;
      --editable-table-medium-weight: 400;
      --editable-table-heavy-weight: 500;
      --editable-table-color: #222;
      --editable-table-bg-color: #fff;
      --editable-table-caption-bg-color: #fff;
      --editable-table-heading-color: #000;
      --editable-table-heading-bg-color: #ddd;
      --editable-table-stripe-bg-color: #eee;

      --editable-table-row-horizontal-padding: 4px;
      --editable-table-row-vertical-padding: 5px;
      --editable-table-row-vertical-padding-condensed: 2px;
      --editable-table-row-padding: var(--editable-table-row-vertical-padding)
        var(--editable-table-row-horizontal-padding);
      --editable-table-row-padding-condensed: var(
          --editable-table-row-vertical-padding-condensed
        )
        var(--editable-table-row-horizontal-padding);

      --editable-table-border-width: 1px;
      --editable-table-border-style: solid;
      --editable-table-border-color: #999;
      --editable-table-border: var(--editable-table-border-width)
        var(--editable-table-border-style) var(--editable-table-border-color);

      --editable-table-caption-color: var(--editable-table-color);
      --editable-table-button-color: var(--editable-table-border-color);
      --editable-table-button-bg-color: var(--editable-table-bg-color);
      --editable-table-button-toggled-color: var(--editable-table-color);
      --editable-table-button-toggled-bg-color: var(--editable-table-bg-color);
      --editable-table-button-hover-color: unset;
      --editable-table-button-hover-bg-color: var(
        --editable-table-heading-bg-color
      );
      --editable-table-button-disabled-color: var(
        --editable-table-border-color
      );
      --editable-table-button-disabled-bg-color: var(
        --editable-table-heading-bg-color
      );
      --secondary-text-color: var(--editable-table-border-color);

      --editable-table-style-stripe: {
        background-color: var(--editable-table-stripe-bg-color);
      }
      --editable-table-style-column-header: {
        font-weight: var(--editable-table-heavy-weight);
        color: var(--editable-table-heading-color);
        background-color: var(--editable-table-heading-bg-color);
      }
      --editable-table-style-row-header: {
        font-weight: var(--editable-table-heavy-weight);
        color: var(--editable-table-heading-color);
      }
      --editable-table-style-footer: {
        font-weight: var(--editable-table-heavy-weight);
        color: var(--editable-table-heading-color);
        border-top: 3px solid var(--editable-table-color);
      }
      --paper-font-caption: {
        font-family: var(--editable-table-secondary-font-family);
      }
    }
    :host .sr-only {
      position: absolute;
      left: -9999px;
      font-size: 0;
      height: 0;
      width: 0;
      overflow: hidden;
    }
    :host .table {
      width: calc(
        100% - var(--editable-table-border-width) -
          var(--editable-table-border-width)
      );
      display: table;
    }
    :host .table,
    :host .caption,
    :host .th,
    :host .td {
      font-weight: var(--editable-table-medium-weight);
      border-collapse: collapse;
      background-color: var(--editable-table-bg-color);
    }
    :host .caption {
      display: table-caption;
      font-size: 120%;
      font-weight: var(--editable-table-heavy-weight);
      color: var(--editable-table-caption-color);
      background-color: var(--editable-table-caption-bg-color);
      width: 100%;
    }
    :host .thead {
      display: table-header-group;
    }
    :host .body {
      display: table-row-group;
    }
    :host .body {
      display: table-footer-group;
    }
    :host .table .tr {
      display: table-row;
    }
    :host .table,
    :host .table .th,
    :host .table .td {
      font-weight: var(--editable-table-light-weight);
      color: var(--editable-table-color);
    }
    :host .table .th,
    :host .table .td {
      display: table-cell;
      height: 24px;
    }
    :host .table .cell {
      padding: var(--editable-table-row-padding);
    }
    :host([condensed]) .table .th,
    :host([condensed]) .table .cell {
      padding: var(--editable-table-row-padding-condensed);
    }
    :host .caption,
    :host .table .th,
    :host .table .td {
      text-align: left;
    }
    :host .table .th[numeric],
    :host .table .td[numeric] {
      text-align: var(--editable-table-numeric-text-align, unset);
    }
    :host .table .td[negative] .cell {
      color: var(--editable-table-negative-color, --editable-table-color);
    }
    :host editable-table-sort {
      width: 100%;
    }
    @media screen {
      :host([responsive-size="xs"]:not([scroll])) .table[transition] {
        opacity: 0;
        transition: opacity 5s;
      }
      :host([scroll]) #column,
      :host(:not([responsive-size="xs"])) #column,
      :host([responsive-size="xs"]:not([scroll])) .table .th[xs-hidden],
      :host([responsive-size="xs"]:not([scroll])) .table .td[xs-hidden],
      :host([responsive-size="xs"]:not([scroll]))
        .table[default-xs-display]
        .th:nth-of-type(n + 3),
      :host([responsive-size="xs"]:not([scroll]))
        .table[default-xs-display][row-header]
        .td:nth-of-type(n + 3),
      :host([responsive-size="xs"]:not([scroll]))
        .table[default-xs-display]:not([row-header])
        .td:nth-of-type(n + 2) {
        display: none;
      }
    }
    @media print {
      :host .table {
        width: 100%;
        max-width: 100%;
      }
      :host #column {
        display: none;
      }
      @page {
        size: landscape;
      }
    }
  </style>
`;
styleElement.appendChild(css);

styleElement.register("editable-table-styles");

window.EditableTableStyleManager = {};
window.EditableTableStyleManager.instance = null;
/**
 * Checks to see if there is an instance available, and if not appends one
 */
window.EditableTableStyleManager.requestAvailability = function() {
  if (window.EditableTableStyleManager.instance == null) {
    window.EditableTableStyleManager.instance = document.createElement("style");
    window.EditableTableStyleManager.instance.setAttribute(
      "is",
      "custom-style"
    );
    window.EditableTableStyleManager.instance.setAttribute(
      "include",
      "editable-table-styles"
    );
    document.head.append(window.EditableTableStyleManager.instance);
  }
  return window.EditableTableStyleManager.instance;
};
