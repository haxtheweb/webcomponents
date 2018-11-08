import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-button/paper-button.js";
import "../lib/app-datepicker-dialog.js";

Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        box-sizing: border-box;
      }

      * {
        box-sizing: border-box;
      }

      .container {
        position: relative;
      }

      paper-button {
        background-color: #4285f4;
        color: #fff;
        margin: 24px;
      }
    </style>

    <div class="container">
      <paper-button raised="" on-tap="openStartDate">[[planDate.startDate]]</paper-button>
      <div>Selected date: [[planDate.startDate]]</div>

      <app-datepicker-dialog id="startDatePicker" date="{{planDate.startDate}}" input-date="[[planDate.startDate]]" with-backdrop=""></app-datepicker-dialog>
    </div>
`,
  is: "bind-date-to-input-date",
  properties: {
    planDate: {
      type: Object,
      value: function() {
        return {
          startDate: "2016/12/01",
          endDate: "2016/12/31"
        };
      },
      observer: "_planDateChanged"
    }
  },

  openStartDate: function() {
    this.$.startDatePicker.open();
  },

  _planDateChanged: function(_newv, _oldv) {
    console.log("plan-date-changed:", _newv, _oldv);
  }
});
