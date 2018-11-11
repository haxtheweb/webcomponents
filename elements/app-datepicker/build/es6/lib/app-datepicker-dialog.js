import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import * as async from "../node_modules/@polymer/polymer/lib/utils/async.js";
import { PaperDialogBehavior } from "../node_modules/@polymer/paper-dialog-behavior/paper-dialog-behavior.js";
import { NeonAnimationRunnerBehavior } from "../node_modules/@polymer/neon-animation/neon-animation-runner-behavior.js";
import "../app-datepicker.js";
var $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");
$_documentContainer.innerHTML = `<dom-module id="app-datepicker-dialog">
  <template strip-whitespace="">
    <style>
      :host {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        box-sizing: border-box;
        -webkit-tap-highlight-color: rgba(0,0,0,0);

        display: block;
      }

      * {
        box-sizing: border-box;
      }
    </style>

    <app-datepicker id="datePicker" class="no-padding" first-day-of-week="[[firstDayOfWeek]]" disable-days="[[disableDays]]" disable-dates="[[disableDates]]" min-date="[[minDate]]" max-date="[[maxDate]]" format="[[format]]" date="{{_readOnlyDate}}" input-date="[[inputDate]]" show-long-date="[[showLongDate]]" no-animation="[[noAnimation]]" page-entry-animation="[[pageEntryAnimation]]" page-exit-animation="[[pageExitAnimation]]" invalid-date="{{_readOnlyInvalidDate}}" view="[[view]]" theme="[[theme]]" locale="[[locale]]" always-reset-selected-date-on-dialog-close="[[alwaysResetSelectedDateOnDialogClose]]">
        <paper-button slot="dismiss-button" noink="[[noAnimation]]" dialog-dismiss="">[[ dismissLabel ]]</paper-button>
        <paper-button slot="confirm-button" noink="[[noAnimation]]" dialog-confirm="">[[ confirmLabel ]]</paper-button>
    </app-datepicker>
  </template>
  
</dom-module>`;
document.head.appendChild($_documentContainer);
Polymer({
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
  behaviors: [PaperDialogBehavior, NeonAnimationRunnerBehavior],
  listeners: {
    "neon-animation-finish": "_onNeonAnimationFinish",
    "iron-overlay-closed": "_alwaysResetSelectedDate"
  },
  _alwaysResetSelectedDate: function() {
    if (this.alwaysResetSelectedDateOnDialogClose) {
      async.microTask.run(() => {
        this.$.datePicker.resetDate();
      });
    }
  },
  observers: [
    "_updateReadOnlyDate(_readOnlyDate)",
    "_updateReadOnlyInvalidDate(_readOnlyInvalidDate)",
    "_updateDatepickerView(view)"
  ],
  _renderOpened: function() {
    if (this.withBackdrop) {
      this.backdropElement.open();
    }
    this.playAnimation("entry");
  },
  _renderClosed: function() {
    if (this.withBackdrop) {
      this.backdropElement.close();
    }
    this.playAnimation("exit");
  },
  _onNeonAnimationFinish: function() {
    if (this.opened) {
      this._finishRenderOpened();
    } else {
      this._finishRenderClosed();
    }
  },
  _updateReadOnlyDate: function(_readOnlyDate) {
    this._setDate(_readOnlyDate);
  },
  _updateReadOnlyInvalidDate: function(_readOnlyInvalidDate) {
    this._setInvalidDate(_readOnlyInvalidDate);
  },
  _updateDatepickerView: function() {
    window.dispatchEvent(new Event("resize"));
  }
});
