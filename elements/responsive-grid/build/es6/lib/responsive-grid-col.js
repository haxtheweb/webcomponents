import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
Polymer({
  _template: html`
    <style>
      :host {
        position: relative;
        min-height: 1px;
        float: left;
      }
      :host:after {
        clear: both;
      }
      #col-inner {
        padding-left: 15px;
        padding-right: 15px;
        @apply --responsive-grid-col-inner;
      }
      /* Hide Print-Only on Screen */
      @media screen {
        :host[print-only] {
          display: none;
        }
      }
      /* Hide Screen-Only on Print */
      @media print {
        :host[screen-only] {
          display: none;
        }
      }
    </style>
    <div id="col-inner"><slot></slot></div>
`,
  is: "responsive-grid-col",
  properties: {
    xl: { type: Number, value: 1 },
    lg: { type: Number, value: 1 },
    md: { type: Number, value: 1 },
    sm: { type: Number, value: 1 },
    xs: { type: Number, value: 1 }
  }
});
