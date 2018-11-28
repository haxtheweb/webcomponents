define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/paper-button/paper-button.js",
  "../lib/app-datepicker-dialog.js"
], function(_polymerLegacy, _paperButton, _appDatepickerDialog) {
  "use strict";
  function _templateObject_d7627f60f32b11e8b565bdb3ac9371a8() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: block;\n        box-sizing: border-box;\n      }\n\n      * {\n        box-sizing: border-box;\n      }\n\n      .container {\n        position: relative;\n      }\n\n      paper-button {\n        background-color: #4285f4;\n        color: #fff;\n        margin: 24px;\n      }\n    </style>\n\n    <div class="container">\n      <paper-button raised="" on-tap="openStartDate">[[planDate.startDate]]</paper-button>\n      <div>Selected date: [[planDate.startDate]]</div>\n\n      <app-datepicker-dialog id="startDatePicker" date="{{planDate.startDate}}" input-date="[[planDate.startDate]]" with-backdrop=""></app-datepicker-dialog>\n    </div>\n'
    ]);
    _templateObject_d7627f60f32b11e8b565bdb3ac9371a8 = function _templateObject_d7627f60f32b11e8b565bdb3ac9371a8() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_d7627f60f32b11e8b565bdb3ac9371a8()
    ),
    is: "bind-date-to-input-date",
    properties: {
      planDate: {
        type: Object,
        value: function value() {
          return { startDate: "2016/12/01", endDate: "2016/12/31" };
        },
        observer: "_planDateChanged"
      }
    },
    openStartDate: function openStartDate() {
      this.$.startDatePicker.open();
    },
    _planDateChanged: function _planDateChanged(_newv, _oldv) {
      console.log("plan-date-changed:", _newv, _oldv);
    }
  });
});
