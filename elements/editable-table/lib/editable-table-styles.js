/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * `editable-table-styles`
 * `a shared set of styles common to editable-table and editable-table-display`
 *
 * @customElement
 * @polymer
 * @demo ./demo/index.html
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
const styleElement = document.createElement("dom-module");

const css = html`
  <style is="custom-style">
    :host {
      display: block;
      width: 100%;
      max-width: 100%;
      margin: 15px 0;
      --editable-table-font-size: unset;
      --editable-table-secondary-font-size: 12px;
      --editable-table-caption-font-size: var(--editable-table-font-size);
      --editable-table-font-family: inherit;
      --editable-table-secondary-font-family: "Roboto", "Noto", sans-serif;
      font-family: var(--editable-table-font-family);

      --editable-table-light-weight: 200;
      --editable-table-medium-weight: 300;
      --editable-table-heavy-weight: 600;
      --editable-table-color: #222;
      --editable-table-bg-color: #fff;
      --editable-table-caption-bg-color: #fff;
      --editable-table-heading-color: #000;
      --editable-table-heading-bg-color: #ddd;
      --editable-table-stripe-bg-color: #eee;

      --editable-table-row-horizontal-padding: 6px;
      --editable-table-row-vertical-padding: 10px;
      --editable-table-row-horizontal-padding-condensed: 4px;
      --editable-table-row-vertical-padding-condensed: 2px;
      --editable-table-row-padding: var(--editable-table-row-vertical-padding)
        var(--editable-table-row-horizontal-padding);
      --editable-table-row-padding-condensed: var(
          --editable-table-row-vertical-padding-condensed
        )
        var(--editable-table-row-horizontal-padding-condensed);
      --editable-table-cell-padding: var(--editable-table-row-padding);

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
      --editable-table-button-hover-color: var(--editable-table-button-color);
      --editable-table-button-toggled-hover-color: var(
        --editable-table-heading-color
      );
      --editable-table-button-hover-bg-color: var(
        --editable-table-heading-bg-color
      );
      --editable-table-button-toggled-hover-bg-color: var(
        --editable-table-heading-bg-color
      );
      --editable-table-button-disabled-color: var(
        --editable-table-heading-bg-color
      );
      --editable-table-button-disabled-bg-color: var(--editable-table-bg-color);
      --secondary-text-color: var(--editable-table-border-color);
      --editable-table-rowcol-color: var(--editable-table-heading-color);
      --editable-table-rowcol-bg-color: var(--editable-table-stripe-bg-color);
      --editable-table-rowcol-hover-bg-color: var(
        --editable-table-heading-bg-color
      );

      --simple-picker-font-family: var(--editable-table-secondary-font-family);
      --simple-picker-font-size: var(--editable-table-secondary-font-size);
      --simple-picker-color: var(--editable-table-color);
      --simple-picker-background-color: var(--editable-table-bg-color);

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
    :host([hidden]) {
      display: none;
    }
    :host([condensed]) {
      --editable-table-cell-padding: var(
        --editable-table-row-padding-condensed
      );
    }
    :host .sr-only {
      position: absolute;
      left: -9999px;
      font-size: 0;
      height: 0;
      width: 0;
      overflow: hidden;
    }
    :host table {
      width: calc(
        100% - var(--editable-table-border-width) -
          var(--editable-table-border-width)
      );
      display: table;
      border-collapse: collapse;
      border: var(--editable-table-border);
    }
    :host table,
    :host .th-or-td {
      font-weight: var(--editable-table-light-weight);
      color: var(--editable-table-color);
      background-color: var(--editable-table-bg-color);
    }
    :host caption {
      padding: 0 0 5px;
      font-size: var(--editable-table-caption-font-size);
      font-weight: var(--editable-table-heavy-weight);
      color: var(--editable-table-caption-color);
      background-color: var(--editable-table-caption-bg-color);
      width: 100%;
    }
    :host tr {
      display: table-row;
    }
    :host .th-or-td {
      display: table-cell;
    }
    :host([bordered]) .td {
      border: var(--editable-table-border);
    }
    :host caption,
    :host table .th-or-td {
      text-align: left;
    }
    :host table .th-or-td[numeric] {
      text-align: var(--editable-table-numeric-text-align, unset);
    }
    :host table .td[negative] .cell {
      color: var(--editable-table-negative-color, --editable-table-color);
    }
    :host editable-table-sort {
      width: 100%;
    }
    ::slotted(table) {
      display: none;
    }
    @media screen {
      :host {
        overflow-x: auto;
        width: 100%;
        max-width: 100%;
      }
      :host([responsive]) {
        overflow-x: visible;
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
