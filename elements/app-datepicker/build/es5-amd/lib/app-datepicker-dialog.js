define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/polymer/lib/utils/async.js",
  "../node_modules/@polymer/paper-dialog-behavior/paper-dialog-behavior.js",
  "../node_modules/@polymer/neon-animation/neon-animation-runner-behavior.js",
  "../app-datepicker.js"
], function(
  _polymerLegacy,
  async,
  _paperDialogBehavior,
  _neonAnimationRunnerBehavior,
  _appDatepicker
) {
  "use strict";
  async = babelHelpers.interopRequireWildcard(async);
  var $_documentContainer = document.createElement("div");
  $_documentContainer.setAttribute("style", "display: none;");
  $_documentContainer.innerHTML =
    '<dom-module id="app-datepicker-dialog">\n  <template strip-whitespace="">\n    <style>\n      :host {\n        -webkit-user-select: none;\n        -moz-user-select: none;\n        -ms-user-select: none;\n        user-select: none;\n        box-sizing: border-box;\n        -webkit-tap-highlight-color: rgba(0,0,0,0);\n\n        display: block;\n      }\n\n      * {\n        box-sizing: border-box;\n      }\n    </style>\n\n    <app-datepicker id="datePicker" class="no-padding" first-day-of-week="[[firstDayOfWeek]]" disable-days="[[disableDays]]" disable-dates="[[disableDates]]" min-date="[[minDate]]" max-date="[[maxDate]]" format="[[format]]" date="{{_readOnlyDate}}" input-date="[[inputDate]]" show-long-date="[[showLongDate]]" no-animation="[[noAnimation]]" page-entry-animation="[[pageEntryAnimation]]" page-exit-animation="[[pageExitAnimation]]" invalid-date="{{_readOnlyInvalidDate}}" view="[[view]]" theme="[[theme]]" locale="[[locale]]" always-reset-selected-date-on-dialog-close="[[alwaysResetSelectedDateOnDialogClose]]">\n        <paper-button slot="dismiss-button" noink="[[noAnimation]]" dialog-dismiss="">[[ dismissLabel ]]</paper-button>\n        <paper-button slot="confirm-button" noink="[[noAnimation]]" dialog-confirm="">[[ confirmLabel ]]</paper-button>\n    </app-datepicker>\n  </template>\n  \n</dom-module>';
  document.head.appendChild($_documentContainer);
  (0, _polymerLegacy.Polymer)({
    is: "app-datepicker-dialog",
    properties: {
      view: String,
      theme: String,
      firstDayOfWeek: Number,
      disableDays: Array,
      disableDates: Array,
      minDate: String,
      maxDate: String,
      format: String,
      date: { type: String, notify: !0, readOnly: !0 },
      invalidDate: { type: Boolean, notify: !0, readOnly: !0 },
      inputDate: String,
      showLongDate: Boolean,
      noAnimation: Boolean,
      pageEntryAnimation: String,
      pageExitAnimation: String,
      locale: String,
      confirmLabel: { type: String, value: "ok" },
      dismissLabel: { type: String, value: "cancel" },
      alwaysResetSelectedDateOnDialogClose: Boolean,
      _readOnlyDate: String,
      _readOnlyInvalidDate: String
    },
    behaviors: [
      _paperDialogBehavior.PaperDialogBehavior,
      _neonAnimationRunnerBehavior.NeonAnimationRunnerBehavior
    ],
    listeners: {
      "neon-animation-finish": "_onNeonAnimationFinish",
      "iron-overlay-closed": "_alwaysResetSelectedDate"
    },
    _alwaysResetSelectedDate: function _alwaysResetSelectedDate() {
      var _this = this;
      if (this.alwaysResetSelectedDateOnDialogClose) {
        async.microTask.run(function() {
          _this.$.datePicker.resetDate();
        });
      }
    },
    observers: [
      "_updateReadOnlyDate(_readOnlyDate)",
      "_updateReadOnlyInvalidDate(_readOnlyInvalidDate)",
      "_updateDatepickerView(view)"
    ],
    _renderOpened: function _renderOpened() {
      if (this.withBackdrop) {
        this.backdropElement.open();
      }
      this.playAnimation("entry");
    },
    _renderClosed: function _renderClosed() {
      if (this.withBackdrop) {
        this.backdropElement.close();
      }
      this.playAnimation("exit");
    },
    _onNeonAnimationFinish: function _onNeonAnimationFinish() {
      if (this.opened) {
        this._finishRenderOpened();
      } else {
        this._finishRenderClosed();
      }
    },
    _updateReadOnlyDate: function _updateReadOnlyDate(_readOnlyDate) {
      this._setDate(_readOnlyDate);
    },
    _updateReadOnlyInvalidDate: function _updateReadOnlyInvalidDate(
      _readOnlyInvalidDate
    ) {
      this._setInvalidDate(_readOnlyInvalidDate);
    },
    _updateDatepickerView: function _updateDatepickerView() {
      window.dispatchEvent(new Event("resize"));
    }
  });
});
