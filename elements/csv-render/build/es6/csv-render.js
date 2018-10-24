import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import "./node_modules/@polymer/iron-ajax/iron-ajax.js";
import "./node_modules/@polymer/paper-icon-button/paper-icon-button.js";
import "./node_modules/@polymer/paper-spinner/paper-spinner.js";
import "./node_modules/@polymer/iron-icons/iron-icons.js";
import "./node_modules/@polymer/paper-tooltip/paper-tooltip.js";
import "./node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
Polymer({
  _template: html`
    <style include="materializecss-styles-colors"></style>
    <style>
      :host {
        display: block;
      }
      .mdl-data-table {
        width: 100%;
        /*position: relative;*/
        border: 1px solid rgba(0, 0, 0, 0.12);
        border-collapse: collapse;
        white-space: nowrap;
        font-size: 1em;
        background-color: rgb(255, 255, 255);
      }
      .mdl-data-table thead {
        padding-bottom: .1em;
        position: sticky;
      }
      .mdl-data-table caption {
        background-color: #eee;
        font-weight: bold;
        padding: 0.5em;
        border: 1px solid rgba(0, 0, 0, 0.12);
        border-bottom: none;
      }
      .mdl-data-table thead th {
        text-align: center;
      }
      .mdl-data-table thead .mdl-data-table__select {
        margin-top: 0;
      }
      .mdl-data-table tbody tr {
        position: relative;
        height: 3em;
        -webkit-transition-duration: 0.28s;
        transition-duration: 0.28s;
        -webkit-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        -webkit-transition-property: background-color;
        transition-property: background-color;
      }
      .mdl-data-table tbody tr.is-selected {
        background-color: #e0e0e0;
      }
      .mdl-data-table tbody tr:hover {
        background-color: #eeeeee;
      }
      .mdl-data-table td,
      .mdl-data-table th {
        padding: 0 1.125em;
        text-align: right;
      }
      .mdl-data-table td:first-of-type,
      .mdl-data-table th:first-of-type {
        padding-left: 1.5em;
      }
      .mdl-data-table td:last-of-type,
      .mdl-data-table th:last-of-type {
        padding-right: 1.5em;
      }
      .mdl-data-table td {
        border-top: 1px solid rgba(0, 0, 0, 0.12);
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
      }
      .mdl-data-table td .mdl-data-table__select {
        vertical-align: top;
        position: absolute;
        left: 1.5em;
      }
      .mdl-data-table th.mdl-data-table__sort {
        color: rgba(0, 0, 0, 0.87);
      }
      .mdl-data-table th {
        position: relative;
        vertical-align: bottom;
        text-overflow: ellipsis;
        font-size: 1em;
        font-weight: bold;
        line-height: 1.5em;
        letter-spacing: 0;
        color: rgba(0, 0, 0, 0.54);
        height: 3em;
        padding-bottom: .5em;
        box-sizing: border-box;
      }
      .mdl-data-table th .mdl-data-table__select {
        position: relative;
      }
      .mdl-data-table__select {
        width: 1em;
      }
      .mdl-data-table td.mdl-data-table__cell--non-numeric {
        text-align: left;
      }
      .mdl-data-table th.mdl-data-table__cell--non-numeric {
        text-align: left;
      }
      #loading {
        position: absolute;
        width: 100px;
        height: 100px;
        transition: 1.2s all linear;
        opacity: 0;
      }
      #loading[active] {
        visibility: visible;
        opacity: 1;
      }
    </style>
    <iron-ajax auto="" url="[[dataSource]]" handle-as="text" last-response="{{tableData}}" on-response="handleResponse"></iron-ajax>
    <paper-spinner id="loading" active=""></paper-spinner>
    <a href="[[dataSource]]" id="download" tabindex="-1">
        <paper-icon-button icon="file-download" class="grey-text"></paper-icon-button>
      </a><paper-tooltip for="download" animation-delay="0">Download table data</paper-tooltip><table class="mdl-data-table" summary="[[summary]]">
    <template is="dom-if" if="[[caption]]">
      <caption>[[caption]]</caption>
    </template>
    <thead>
      
      
      <tr>
      <template is="dom-repeat" items="[[tableHeadings]]" as="heading">
        <th scope="col">[[heading]]</th>
      </template>
      </tr>
    </thead>
    <tbody>
      <template is="dom-repeat" items="[[table]]" as="row">
      <tr>
        <template is="dom-repeat" items="[[row]]" as="col">
        <td>[[col]]</td>
        </template>
      </tr>
      </template>
    </tbody>
    </table>
`,
  is: "csv-render",
  properties: {
    dataSource: { type: String },
    caption: { type: String, reflectToAttribute: !0 },
    summary: { type: String, reflectToAttribute: !0 },
    table: { type: Array, value: [] },
    tableHeadings: { type: Array, value: [] },
    tableData: { type: String, value: "" }
  },
  handleResponse: function() {
    this.table = this.CSVtoArray(this.tableData);
    this.tableHeadings = this.table.shift();
    this.$.loading.active = !1;
  },
  CSVtoArray: function(text) {
    let p = "",
      row = [""],
      ret = [row],
      i = 0,
      r = 0,
      s = !0,
      l;
    for (l in text) {
      l = text[l];
      if ('"' === l) {
        if (s && l === p) row[i] += l;
        s = !s;
      } else if ("," === l && s) l = row[++i] = "";
      else if ("\n" === l && s) {
        if ("\r" === p) row[i] = row[i].slice(0, -1);
        row = ret[++r] = [(l = "")];
        i = 0;
      } else row[i] += l;
      p = l;
    }
    return ret;
  }
});
