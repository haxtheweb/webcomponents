import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
var $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");
$_documentContainer.innerHTML = `<dom-module id="editable-table-styles">
  <template>
    <custom-style>
      <style is="custom-style">
        :host, :host[accent-color="none"] {
          display: block;
          width: 100%;
          max-width: 100%;
          overflow-x: scroll;
          margin: 15px 0;
          --editable-table-light-weight: 200;
          --editable-table-medium-weight: 400;
          --editable-table-heavy-weight: 500;
          --editable-table-color: var(--simple-colors-foreground3, #222);
          --editable-table-bg-color: var(--simple-colors-background1, #fff);
          --editable-table-border-color: var(--simple-colors-background5, #999);
          --editable-table-caption-color:  var(--simple-colors-foreground3, #222);
          --editable-table-caption-bg-color: var(--simple-colors-background1, #fff);
          --editable-table-heading-color: var(--simple-colors-foreground1, #000);
          --editable-table-heading-bg-color: var(--simple-colors-background3, #ddd);
          --editable-table-stripe-bg-color: var(--simple-colors-background2, #eee);
          --editable-table-style-stripe: {
            background-color: var(--editable-table-stripe-bg-color);
          };
          --editable-table-style-column-header: {
            font-weight: var(--editable-table-heavy-weight);
            color: var(--editable-table-heading-color);
            background-color: var(--editable-table-heading-bg-color);
          };
          --editable-table-style-row-header: {
            font-weight:  var(--editable-table-heavy-weight);
            color: var(--editable-table-heading-color);
          };
          --editable-table-style-footer: {
            font-weight: var(--editable-table-heavy-weight);
            color: var(--editable-table-heading-color);
            border-top: 3px solid var(--editable-table-color);
          };
        }
        :host .sr-only {
          position: absolute;
          left: -9999px;
          font-size: 0;
          height: 0;
          width: 0;
          overflow: hidden;
        }
        :host[accent-color]{
          --editable-table-caption-color:  var(--simple-colors-accent-foreground3, #222);
          --editable-table-heading-bg-color: var(--simple-colors-accent-background2, #ddd);
          --editable-table-border-color: var(--simple-colors-accent-foreground5, #999);
        }
        :host[dark], :host[dark][accent-color="none"]{
          --editable-table-light-weight: 100;
          --editable-table-medium-weight: 300;
          --editable-table-heavy-weight: 400;
          --editable-table-color: var(--simple-colors-foreground1, #fff);
          --editable-table-bg-color:  var(--simple-colors-background3, #222);
          --editable-table-border-color: var(--simple-colors-background1, #000);
          --editable-table-caption-color: var(--simple-colors-foreground1, #fff);
          --editable-table-caption-bg-color: var(--simple-colors-background1, #000);
          --editable-table-heading-bg-color: var(--simple-colors-background1, #000);
          --editable-table-heading-color: var(--simple-colors-foreground1, #fff);
          --editable-table-stripe-bg-color: var(--simple-colors-background2, #111);
        }
        :host[dark][accent-color]{
          --editable-table-caption-bg-color: var(--simple-colors-accent-background2, #000);
          --editable-table-heading-bg-color: var(--simple-colors-accent-background3, #000);
          --editable-table-border-color: var(--simple-colors-accent-foreground5, #000);
        }
        :host .table {
          width: 100%;
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
          padding: 0.5em 0 0;
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
        :host[dark][bordered] .caption {
          /*padding: 0.5em 0 0 0.25em;*/
          border: 1px solid var(--editable-table-border-color);
          border-bottom: none;
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
          padding: 0.75em 0.25em;
        }
        :host[condensed] .table .th,
        :host[condensed] .table .td {
          padding: 0em 0.25em;
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
        :host .caption > div {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        :host .caption > div > div {
          padding-bottom: 8px;
          flex-grow: 1;
          width: auto;
        }
        :host editable-table-sort {
          width: 100%;
        }
        @media screen {
          :host[responsive-size="xs"]:not([scroll]) .table[transition] {
            opacity: 0;
            transition: opacity 5s;
          }
          :host[scroll] #column, 
          :host:not([responsive-size="xs"]) #column, 
          :host[responsive-size="xs"]:not([scroll]) .table .th[xs-hidden],
          :host[responsive-size="xs"]:not([scroll]) .table .td[xs-hidden],
          :host[responsive-size="xs"]:not([scroll]) .table[default-xs-display] .th:nth-of-type(n+3), 
          :host[responsive-size="xs"]:not([scroll]) .table[default-xs-display][row-header] .td:nth-of-type(n+3), 
          :host[responsive-size="xs"]:not([scroll]) .table[default-xs-display]:not([row-header]) .td:nth-of-type(n+2) {
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
    </custom-style>
  </template>
</dom-module>`;
document.head.appendChild($_documentContainer);
