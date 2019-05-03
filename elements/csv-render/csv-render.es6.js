/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import"./node_modules/@polymer/iron-ajax/iron-ajax.js";import"./node_modules/@polymer/paper-button/paper-button.js";import"./node_modules/@polymer/paper-spinner/paper-spinner.js";import"./node_modules/@polymer/iron-icons/iron-icons.js";import"./node_modules/@polymer/iron-icon/iron-icon.js";import"./node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";import"./node_modules/@polymer/paper-tooltip/paper-tooltip.js";/**
 * `csv-render`
 * `Remote render a CSV file in place as an accessible table.`
 *
 * @microcopy - language worth noting:
 *  - CSV is comma separated values
 *
 * @customElement
 * @polymer
 * @polymerLegacy
 * @demo demo/index.html
 */let CsvRender=Polymer({_template:html`
    <style include="simple-colors">
      :host {
        display: block;
      }
      .mdl-data-table {
        width: 100%;
        /*position: relative;*/
        border: 1px solid rgba(0, 0, 0, 0.12);
        border-collapse: collapse;
        white-space: nowrap;
        font-size: 16px;
        background-color: rgb(255, 255, 255);
      }
      .mdl-data-table thead {
        padding-bottom: 0.16px;
        position: sticky;
      }
      .mdl-data-table caption {
        background-color: #eee;
        font-weight: bold;
        padding: 8px;
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
        height: 48px;
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
        padding-left: 24px;
      }
      .mdl-data-table td:last-of-type,
      .mdl-data-table th:last-of-type {
        padding-right: 24px;
      }
      .mdl-data-table td {
        border-top: 1px solid rgba(0, 0, 0, 0.12);
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
      }
      .mdl-data-table td .mdl-data-table__select {
        vertical-align: top;
        position: absolute;
        left: 24px;
      }
      .mdl-data-table th.mdl-data-table__sort {
        color: rgba(0, 0, 0, 0.87);
      }
      .mdl-data-table th {
        position: relative;
        vertical-align: bottom;
        text-overflow: ellipsis;
        font-size: 16px;
        font-weight: bold;
        line-height: 24px;
        letter-spacing: 0;
        color: rgba(0, 0, 0, 0.54);
        height: 48px;
        padding-bottom: 8px;
        box-sizing: border-box;
      }
      .mdl-data-table th .mdl-data-table__select {
        position: relative;
      }
      .mdl-data-table__select {
        width: 16px;
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
      #download paper-button {
        border-radius: 36px;
        width: 36px;
        height: 36px;
        min-width: unset;
        padding: 0;
        margin: 0;
        display: inline-flex;
      }
      iron-icon {
        display: inline-flex;
        margin: 0;
        padding: 0;
      }
      #download paper-button:focus,
      #download paper-button:active {
        outline: 2px solid grey;
      }
    </style>
    <iron-ajax
      auto=""
      url="[[dataSource]]"
      handle-as="text"
      last-response="{{tableData}}"
      on-response="handleResponse"
    ></iron-ajax>
    <paper-spinner id="loading" active=""></paper-spinner>
    <a href="[[dataSource]]" id="download" tabindex="-1">
      <paper-button class="simple-colors-default-theme-grey-11-text"
        ><iron-icon icon="file-download"></iron-icon
      ></paper-button> </a
    ><paper-tooltip for="download" animation-delay="200" offset="14"
      >Download table data</paper-tooltip
    >
    <table class="mdl-data-table" summary="[[summary]]">
      <template is="dom-if" if="[[caption]]">
        <caption>
          [[caption]]
        </caption>
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
  `,is:"csv-render",properties:{/**
     * Location of the CSV file.
     */dataSource:{type:String},/**
     * Caption for the table to improve accessibility and readability.
     */caption:{type:String,reflectToAttribute:!0},/**
     * Summary to improve accessibility for screen readers.
     */summary:{type:String,reflectToAttribute:!0},/**
     * Table busted out as an array.
     */table:{type:Array,value:[]},/**
     * Headings from the first row of the csv
     */tableHeadings:{type:Array,value:[]},/**
     * Raw data pulled in from the csv file.
     */tableData:{type:String,value:""}},/**
   * Convert from csv text to an array in the table function
   */handleResponse:function(e){this.table=this.CSVtoArray(this.tableData);this.tableHeadings=this.table.shift();this.$.loading.active=!1},/**
   * Mix of solutions from https://stackoverflow.com/questions/8493195/how-can-i-parse-a-csv-string-with-javascript-which-contains-comma-in-data
   */CSVtoArray:function(text){let p="",row=[""],ret=[row],i=0,r=0,s=!0,l;for(l in text){l=text[l];if("\""===l){if(s&&l===p)row[i]+=l;s=!s}else if(","===l&&s)l=row[++i]="";else if("\n"===l&&s){if("\r"===p)row[i]=row[i].slice(0,-1);row=ret[++r]=[l=""];i=0}else row[i]+=l;p=l}return ret}});export{CsvRender};