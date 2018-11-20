import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import { dom } from "./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
import { FlattenedNodesObserver } from "./node_modules/@polymer/polymer/lib/utils/flattened-nodes-observer.js";
import * as async from "./node_modules/@polymer/polymer/lib/utils/async.js";
import "./node_modules/@polymer/iron-selector/iron-selector.js";
import "./node_modules/@polymer/iron-list/iron-list.js";
import "./node_modules/@polymer/paper-icon-button/paper-icon-button.js";
import { NeonAnimationRunnerBehavior } from "./node_modules/@polymer/neon-animation/neon-animation-runner-behavior.js";
import "./node_modules/@polymer/neon-animation/neon-animated-pages.js";
import "./lib/app-datepicker-icons.js";
import "./lib/app-datepicker-animations.js";
Polymer({
  _template: html`<style>
      :host {
        display: block;
        position: relative;
        box-sizing: border-box;

        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        background: var(--app-datepicker-bg, #fafafa);

        @apply --app-datepicker;
      }

      * {
        box-sizing: border-box;
      }

      .datepicker {
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -ms-flex-direction: column;
        -webkit-flex-direction: column;
        flex-direction: column;

        position: relative;
        width: 300px;
        height: 384px;
        max-height: 384px;
      }
      .datepicker.with-buttons {
        height: 431px;
        max-height: 431px;
      }

      iron-selector.selected-fulldate {
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -ms-flex-direction: column;
        -webkit-flex-direction: column;
        flex-direction: column;

        min-height: 84px;
        padding: 8px 16px;
        color: var(--app-datepicker-selection-color, #b2dfdb);
        background-color: var(--app-datepicker-selection-bg, #009688);
      }
      .selected-year.iron-selected,
      .selected-date.iron-selected {
        color: var(--app-datepicker-iron-selected, #fefefe);
      }
      .selected-year {
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -ms-flex-direction: row;
        -webkit-flex-direction: row;
        flex-direction: row;
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;

        font-size: 14px;
        font-weight: 800;
        height: 34px;

        @apply --app-datepicker-selected-year;
      }
      .selected-date {
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -ms-flex-direction: row;
        -webkit-flex-direction: row;
        flex-direction: row;
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;
        -ms-flex: 1 1 auto;
        -webkit-flex: 1 1 auto;
        flex: 1 1 auto;

        font-size: 32px;
        font-weight: 800;

        @apply --app-datepicker-selected-date;
      }
      .selected-year:hover,
      .selected-date > div:hover {
        cursor: pointer;
      }

      neon-animated-pages.fullcalendar {
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -ms-flex-direction: column;
        -webkit-flex-direction: column;
        flex-direction: column;

        width: 100%;
        height: 100%;
        overflow: hidden;
        color: var(--app-datepicker-calendar-color, #000);
        background-color: var(--app-datepicker-calendar-bg, #fafafa);
      }
      .navigator {
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -ms-flex-direction: row;
        -webkit-flex-direction: row;
        flex-direction: row;
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;
        -ms-flex-pack: center;
        -webkit-justify-content: center;
        justify-content: center;

        max-height: 46px;
        padding: 3px 10px;
        position: relative;
        margin-top: 8px;
      }
      .nav-month-year {
        -ms-flex: 1 1 auto;
        -webkit-flex: 1 1 auto;
        flex: 1 1 auto;

        font-size: 14px;
        font-weight: 500;
        text-align: center;

        @apply --app-datepicker-nav-month-year;
      }
      .days-of-week {
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -ms-flex-direction: row;
        -webkit-flex-direction: row;
        flex-direction: row;
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;
        -ms-flex-pack: center;
        -webkit-justify-content: center;
        justify-content: center;

        color: var(--app-datepicker-weekdays-color, #848484);
        font-size: 12px;

        @apply --app-datepicker-days-of-week;
      }
      .each-days-of-week {
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -ms-flex-direction: row;
        -webkit-flex-direction: row;
        flex-direction: row;
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;
        -ms-flex-pack: center;
        -webkit-justify-content: center;
        justify-content: center;

        padding: 13px;
        max-height: 32px;
        width: 41px;
      }
      .days-of-month {
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -ms-flex-direction: row;
        -webkit-flex-direction: row;
        flex-direction: row;
        -ms-flex-wrap: wrap;
        -webkit-flex-wrap: wrap;
        flex-wrap: wrap;
        -ms-flex-pack: center;
        -webkit-justify-content: center;
        justify-content: center;

        font-size: 13px;

        @apply --app-datepicker-days-of-month;
      }
      .each-days-of-month {
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -ms-flex-direction: row;
        -webkit-flex-direction: row;
        flex-direction: row;
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;
        -ms-flex-pack: center;
        -webkit-justify-content: center;
        justify-content: center;

        position: relative;
        height: 35px;
        width: 35px;
        margin-left: 3px;
        margin-right: 3px;
      }
      div > .days-of-month > .each-days-of-month.chosen-days-of-month {
        border-radius: 50%;
        background-color: var(--app-datepicker-selected-day-bg, #009688);
        color: var(--app-datepicker-selected-day-color, #fff);
      }
      .days-of-month > .each-days-of-month.is-today {
        color: var(--app-datepicker-today-color, #009688);
      }
      .days-of-month > .each-days-of-month.is-disabled-day {
        color: var(--app-datepicker-disabled-color, #9e9e9e);
      }


      /* outline: none for non-selectable and disabled days */
      .days-of-month > .each-days-of-month.is-disabled-day,
      .days-of-month > .each-days-of-month.is-non-selectable {
        outline: none;
      }
      /* Date hover styling */
      .days-of-month > .each-days-of-month:hover:not(.is-disabled-day):not(.is-non-selectable):not(.chosen-days-of-month),
      .days-of-month > .each-days-of-month:focus:not(.is-disabled-day):not(.is-non-selectable):not(.chosen-days-of-month) {
        color: var(--app-datepicker-date-hover-color, #f5f5f5);
        background-color: var(--app-datepicker-date-hover-background-color, #80cbc4);
        border-radius: 50%;
        cursor: pointer;
      }
      :host(.dark-theme) .days-of-month >  .each-days-of-month:hover:not(.is-disabled-day):not(.is-non-selectable):not(.chosen-days-of-month),
      :host(.dark-theme) .days-of-month >  .each-days-of-month:focus:not(.is-disabled-day):not(.is-non-selectable):not(.chosen-days-of-month) {
        color: var(--app-datepicker-date-hover-color, #777);
        background-color: var(--app-datepicker-date-hover-background-color, #b2dfdb);
      }
      :host(.goog-theme) .days-of-month > .each-days-of-month:hover:not(.is-disabled-day):not(.is-non-selectable):not(.chosen-days-of-month),
      :host(.goog-theme) .days-of-month > .each-days-of-month:focus:not(.is-disabled-day):not(.is-non-selectable):not(.chosen-days-of-month) {
        color: var(--app-datepicker-date-hover-color, #f5f5f5);
        background-color: var(--app-datepicker-date-hover-background-color, #e57373);
      }

      /* Focus ring styling - replace outline with background-color */
      .each-list-of-years:focus,
      .each-days-of-month:focus {
        outline: 0;
      }
      .each-list-of-years:focus,
      .each-list-of-years:hover,
      .each-list-of-years.is-selected:focus,
      .each-list-of-years.is-selected:hover {
        font-weight: 700;
        background-color: var(--app-datepicker-year-hover-background-color, #e0e0e0);

        @apply --app-datepicker-year-hover;
      }
      :host(.dark-theme) .each-list-of-years:focus,
      :host(.dark-theme) .each-list-of-years:hover,
      :host(.dark-theme) .each-list-of-years.is-selected:focus,
      :host(.dark-theme) .each-list-of-years.is-selected:hover {
        font-weight: 700;
        background-color: var(--app-datepicker-year-hover-background-color, #616161);

        @apply --app-datepicker-year-hover;
      }
      :host(.goog-theme) .each-list-of-years:focus,
      :host(.goog-theme) .each-list-of-years:hover,
      :host(.goog-theme) .each-list-of-years.is-selected:focus,
      :host(.goog-theme) .each-list-of-years.is-selected:hover {
        font-weight: 700;
        background-color: var(--app-datepicker-year-hover-background-color, #424242);

        @apply --app-datepicker-year-hover;
      }

      .each-list-of-years {
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -ms-flex-direction: row;
        -webkit-flex-direction: row;
        flex-direction: row;
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;
        -ms-flex-pack: center;
        -webkit-justify-content: center;
        justify-content: center;

        height: 64px;
        font-size: 16px;

        @apply --app-datepicker-each-list-of-years;
      }
      .each-list-of-years:hover {
        cursor: pointer;
      }
      .each-list-of-years.is-selected {
        font-size: 24px;
        font-weight: 700;
        color: var(--app-datepicker-selected-year-color, #009688);
        background-color: var(--app-datepicker-selected-year-bg);

        @apply --app-datepicker-selected-each-list-of-years;
      }

      /* paper-icon-button */
      paper-icon-button {
        color: var(--app-datepicker-icon-button-color, #737373);
        --paper-icon-button-ink-color: var(--app-datepicker-icon-button-ink-color, #737373);
      }

      /* content tag selector */
      .buttons {
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -ms-flex-direction: row;
        -webkit-flex-direction: row;
        flex-direction: row;
        -ms-flex-pack: end;
        -webkit-justify-content: flex-end;
        justify-content: flex-end;

        color: var(--app-datepicker-button-color, #009688);
        position: relative;
        padding: 8px 8px 8px 24px;
        margin: 0;
        font-size: 12px;
        font-weight: 500;

        --paper-button-ink-color: var(--app-datepicker-button-ink-color, #737373);

        @apply --app-datepicker-buttons;
      }

      /* will-change: transform, however lag on the first time */
      .nav-month-year,
      .days-of-week,
      .days-of-month {
        will-change: transform;
        -webkit-transform: translate3d(0px, 0px, 0px);
                transform: translate3d(0px, 0px, 0px);
        -webkit-backface-visibility: hidden;
                backface-visibility: hidden;
      }

      iron-list {
        --iron-list-items-container: {
          -webkit-transform: translate3d(0px, 0px, 0px);
          transform: translate3d(0px, 0px, 0px);
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        };
      }

      /* landscape */
      @media all and (orientation: landscape) {
        :host(.horizontal-view) #dp.datepicker,
        :host(:not(.vertical-view)) #dp.datepicker {
          display: -ms-flexbox;
          display: -webkit-flex;
          display: flex;
          -ms-flex-direction: row;
          -webkit-flex-direction: row;
          flex-direction: row;

          width: 512px;
          height: 241px;
        }
        :host(.horizontal-view) #dp.datepicker.with-buttons,
        :host(:not(.vertical-view)) #dp.datepicker.with-buttons {
          height: 288px;
        }
        :host(.horizontal-view) iron-selector.selected-fulldate,
        :host(:not(.vertical-view)) iron-selector.selected-fulldate {
          /* Fixed for IE11, Edge */
          min-width: 164px;
          width: calc(100% / 3 + 48px);
          max-width: 164px;
          height: 100%;
        }
        :host(:not(.vertical-view)) .selected-date {
          display: -ms-flexbox;
          display: -webkit-flex;
          display: flex;
          -ms-flex-direction: column;
          -webkit-flex-direction: column;
          flex-direction: column;
          -ms-flex-align: start;
          -webkit-align-items: flex-start;
          align-items: flex-start;
          -ms-flex-pack: start;
          -webkit-justify-content: flex-start;
          justify-content: flex-start;
        }
        /* Fix for IE11 */
        :host(:not(.vertical-view)) .selected-date > div {
          width: 100%;
          word-wrap: break-word;
        }
        /* Hack for Edge 12+ */
        @supports (-ms-accelerator:true) {
          :host(:not(.vertical-view)) .selected-date > div {
            white-space: pre-wrap;
          }
        }

        :host(.horizontal-view) neon-animated-pages.fullcalendar,
        :host(:not(.vertical-view)) neon-animated-pages.fullcalendar {
          height: 100%;
        }
        :host(.horizontal-view) .calendar-view,
        :host(:not(.vertical-view)) .calendar-view {
          padding-bottom: 0;
        }
        :host(.horizontal-view) .navigator,
        :host(:not(.vertical-view)) .navigator {
          padding: 2px 10px;
          margin-top: 0;
        }
        :host(.horizontal-view) .each-days-of-week,
        :host(:not(.vertical-view)) .each-days-of-week {
          width: calc(100% / 7 - 20px);
          padding: 0;
          margin-left: 10px;
          margin-right: 10px;
        }
        :host(:not(.vertical-view)) .days-of-month {
          margin-top: 8px;
        }
        :host(.horizontal-view) .each-days-of-month,
        :host(:not(.vertical-view)) .each-days-of-month {
          height: 29px;
          margin-left: 10px;
          margin-right: 10px;
          width: calc(100% / 7 - 20px);
        }
      }
      /* End of landscape @media */

      /* dark-theme */
      :host(.dark-theme) {
        background-color: var(--app-datepicker-bg, #424242);
      }
      :host(.dark-theme) iron-selector.selected-fulldate {
        color: var(--app-datepicker-selection-color, #9e9e9e);
        background-color: var(--app-datepicker-selection-bg, #555);
      }
      :host(.dark-theme) .selected-year.iron-selected,
      :host(.dark-theme) .selected-date.iron-selected {
        color: var(--app-datepicker-iron-selected, #f5f5f5);
      }
      :host(.dark-theme) neon-animated-pages.fullcalendar {
        color: var(--app-datepicker-calendar-color, #f5f5f5);
        background-color: var(--app-datepicker-calendar-bg, #424242);
      }
      :host(.dark-theme) .days-of-week {
        color: var(--app-datepicker-weekdays-color, #7c7c7c);
      }
      :host(.dark-theme) div > .days-of-month > .each-days-of-month.chosen-days-of-month {
        color: var(--app-datepicker-selected-day-color, #555);
        background-color: var(--app-datepicker-selected-day-bg, #80cbc4);
      }
      :host(.dark-theme) .days-of-month > .each-days-of-month.is-today {
        color: var(--app-datepicker-today-color, #80cbc4);
      }
      :host(.dark-theme) .days-of-month > .each-days-of-month.is-disabled-day {
        color: var(--app-datepicker-disabled-color, #ffff00);
      }
      :host(.dark-theme) .each-list-of-years.is-selected {
        background-color: var(--app-datepicker-selected-year-bg, rgba(0, 0, 0, 0));
        color: var(--app-datepicker-selected-year-color, #80cbc4);
        font-size: 26px;
        font-weight: 500;
      }
      :host(.dark-theme) paper-icon-button {
        color: var(--app-datepicker-icon-button-color, #ffff00);
        --paper-icon-button-ink-color: var(--app-datepicker-icon-button-ink-color, #212121);
      }
      :host(.dark-theme) ::slotted(paper-button) {
        color: var(--app-datepicker-button-color, #80cbc4);
        --paper-button-ink-color: var(--app-datepicker-button-ink-color, #bcbcbc);
      }

      /* goog theme */
      :host(.goog-theme) {
        background-color: var(--app-datepicker-bg, #212121);
      }

      :host(.goog-theme) iron-selector.selected-fulldate {
        color: var(--app-datepicker-selection-color, #fff);
        background-color: var(--app-datepicker-selection-bg, #212121);
      }
      :host(.goog-theme) .selected-year.iron-selected,
      :host(.goog-theme) .selected-date.iron-selected {
        color: var(--app-datepicker-iron-selected, #DA4336);
      }
      :host(.goog-theme) neon-animated-pages.fullcalendar {
        color: var(--app-datepicker-calendar-color, #fff);
        background-color: var(--app-datepicker-calendar-bg, #212121);
      }
      :host(.goog-theme) .days-of-week {
        color: var(--app-datepicker-weekdays-color, #9e9e9e);
      }
      :host(.goog-theme) div > .days-of-month > .each-days-of-month.chosen-days-of-month {
        color: var(--app-datepicker-selected-day-color, #fff);
        background-color: var(--app-datepicker-selected-day-bg, #DA4336);
      }
      :host(.goog-theme) .days-of-month > .each-days-of-month.is-today {
        color: var(--app-datepicker-today-color, #DA4336);
      }
      :host(.goog-theme) .days-of-month > .each-days-of-month.is-disabled-day {
        color: var(--app-datepicker-disabled-color, #646464);
      }
      :host(.goog-theme) .each-list-of-years.is-selected {
        background-color: var(--app-datepicker-selected-year-bg, rgba(0, 0, 0, 0));
        color: var(--app-datepicker-selected-year-color, #DA4336);
        font-size: 26px;
        font-weight: 500;
      }
      :host(.goog-theme) paper-icon-button {
        color: var(--app-datepicker-icon-button-color, #DA4336);
        --paper-icon-button-ink-color: var(--app-datepicker-icon-button-ink-color, #616161);
      }
      :host(.goog-theme) ::slotted(paper-button) {
        color: var(--app-datepicker-button-color, #DA4336);
        --paper-button-ink-color: var(--app-datepicker-button-ink-color, #616161);
      }
    </style>

    <div id="dp" class="datepicker">
      <iron-selector class="selected-fulldate" selected="{{_activeView}}" attr-for-selected="view" on-selected-changed="_onIronSelectorSelectedChanged" fallback-selection="calendar">
        <div id="showSelectedYear" class="selected-year" tabindex="0" view="year" aria-label="year view">
          [[_showSelectedYear]]
        </div>
        <div class="selected-date" view="calendar" tabindex="0">
          <div aria-label="calendar view">[[_shortSelectedDate]]</div>
        </div>
      </iron-selector>

      <neon-animated-pages class="fullcalendar" selected="[[_activeView]]" attr-for-selected="view" entry-animation="[[pageEntryAnimation]]" exit-animation="[[pageExitAnimation]]" on-neon-animation-finish="_onAnimationFinish">
        <div class="calendar-view" view="calendar">
          <div class="navigator">
            <paper-icon-button icon="datepicker:chevron-left" on-tap="_decrementMonth" noink="[[noAnimation]]"></paper-icon-button>
            <div id="navMonthYear" class="nav-month-year">
              [[_activeMonthYear]]
            </div>
            <paper-icon-button icon="datepicker:chevron-right" on-tap="_incrementMonth" noink="[[noAnimation]]"></paper-icon-button>
          </div>

          <div id="daysOfWeek" class="days-of-week">
            <template is="dom-repeat" items="[[_daysOfWeek]]" index-as="index" strip-whitespace="">
              <div class="each-days-of-week">
                [[item]]
              </div>
            </template>
          </div>

          <div id="daysOfMonth" class="days-of-month" on-tap="_chooseDaysOfMonth">
            <template is="dom-repeat" items="[[_daysOfMonth]]" index-as="index" strip-whitespace="">
              <div class\$="each-days-of-month[[_isToday(item.index, _activeYear, _activeMonth)]][[_isEmptyDate(item.index)]][[_isChosenDaysOfMonth(item.index, _selectedYear, _selectedMonth, _selectedDate)]][[_isDisableDays(index, firstDayOfWeek, minDate, maxDate, item.index, _shiftedDisableDays.*, disableDates.*)]]" index="[[index]]" date="[[item.index]]" tabindex\$="[[_shouldTabIndex(index, firstDayOfWeek, minDate, maxDate, item.index, _shiftedDisableDays.*, disableDates.*)]]" aria-disabled\$="[[_shouldAriaDisabled(index, firstDayOfWeek, minDate, maxDate, item.index, _shiftedDisableDays.*, disableDates.*)]]" aria-label\$="[[item.index]]">
                [[item.date]]
              </div>
            </template>
          </div>

          <div class="buttons">
            <slot name="dismiss-button"></slot>
            <slot name="confirm-button"></slot>
          </div>
        </div>

        <template is="dom-if" if="[[_isListRendered]]" restamp="true" on-dom-change="_onListRendered" strip-whitespace="">
          <iron-list id="listOfYears" items="[[_listOfYears]]" view="year" on-neon-animation-finish="_onAnimationFinish" selection-enabled="">
            <template strip-whitespace="">
              <div class\$="each-list-of-years[[_isListOfYearsSelected(_selectedYear, item.year)]]" tabindex\$="[[tabIndex]]" aria-label\$="[[item.year]]" label\$="[[item.year]]" on-tap="_goCalendar" on-keydown="_goCalendar">
                [[item.year]]
              </div>
            </template>
          </iron-list>
        </template>
      </neon-animated-pages>

    </div>`,
  is: "app-datepicker",
  behaviors: [NeonAnimationRunnerBehavior],
  properties: {
    locale: {
      type: String,
      value: function() {
        if (window.Intl) {
          return (
            (window.Intl &&
              window.Intl.DateTimeFormat &&
              window.Intl.DateTimeFormat().resolvedOptions &&
              window.Intl.DateTimeFormat().resolvedOptions().locale) ||
            "en-US"
          );
        }
        return "en-US";
      }
    },
    view: String,
    theme: String,
    firstDayOfWeek: { type: Number, value: 0 },
    disableDays: {
      type: Array,
      value: function() {
        return [6, 0];
      }
    },
    disableDates: {
      type: Array,
      value: function() {
        return [];
      }
    },
    minDate: { type: String, value: "1000/00/01" },
    maxDate: { type: String, value: "9999/99/99" },
    format: { type: String, value: "yyyy/mm/dd" },
    date: { type: String, notify: !0, readOnly: !0 },
    inputDate: String,
    noAnimation: Boolean,
    pageEntryAnimation: String,
    pageExitAnimation: String,
    showLongDate: { type: Boolean, value: !1 },
    invalidDate: { type: Boolean, notify: !0, readOnly: !0 },
    autoUpdateDate: { type: Boolean, value: !1 },
    alwaysResetSelectedDateOnDialogClose: Boolean,
    _monthNames: {
      type: Array,
      value: function() {
        return [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December"
        ];
      }
    },
    _shiftedDisableDays: { type: Array, value: [6, 0] },
    _activeMonthYear: String,
    _shortSelectedDate: String,
    _showSelectedYear: String,
    _daysOfWeek: Array,
    _daysOfMonth: Array,
    _listOfYears: Array,
    _activeView: { type: String, value: "calendar" },
    _activeYear: {
      type: Number,
      value: function() {
        return new Date().getFullYear();
      }
    },
    _activeMonth: {
      type: Number,
      value: function() {
        return new Date().getMonth();
      }
    },
    _isIncrementMonth: Boolean,
    _isDecrementMonth: Boolean,
    _selectedYear: {
      type: Number,
      value: function() {
        return new Date().getFullYear();
      }
    },
    _selectedMonth: {
      type: Number,
      value: function() {
        return new Date().getMonth();
      }
    },
    _selectedDate: {
      type: Number,
      value: function() {
        return new Date().getDate();
      }
    },
    _chosenDaysOfMonth: {
      type: Number,
      value: function() {
        return new Date().getDate();
      }
    },
    _isListRendered: { type: Boolean, value: !1 },
    _isSelectedDateConfirmed: Boolean,
    _format: {
      type: Object,
      value: function() {
        return { y: "yyyy", m: "mm", d: "dd", s1: "/", s2: "/" };
      }
    }
  },
  observers: [
    "_computeDaysOfMonth(_activeYear, _activeMonth, firstDayOfWeek, locale)",
    "_computeSeparateFormat(format)",
    "_computeShowLongDate(showLongDate, locale)",
    "_updateToReflectExternalChange(inputDate)",
    "_updateThemeColor(theme)",
    "_updateDatepickerView(view)",
    "_computeDaysOfWeek(firstDayOfWeek, locale)",
    "_computeActiveMonthYear(_activeYear, _activeMonth, locale)",
    "_computeShortSelectedDate(_selectedYear, _selectedMonth, _selectedDate, locale)",
    "_computeShowSelectedYear(_selectedYear, locale)",
    "_computeShiftedDisableDays(firstDayOfWeek, disableDays.*)"
  ],
  attached: function() {
    if (!this.noAnimation) {
      this.set("animationConfig", {
        incrementEntry: [
          { name: "slide-from-right-animation", node: this.$.daysOfWeek },
          { name: "slide-from-right-animation", node: this.$.daysOfMonth },
          {
            name: "datepicker-slide-from-right-animation",
            node: this.$.navMonthYear
          }
        ],
        decrementEntry: [
          { name: "slide-from-left-animation", node: this.$.daysOfWeek },
          { name: "slide-from-left-animation", node: this.$.daysOfMonth },
          {
            name: "datepicker-slide-from-left-animation",
            node: this.$.navMonthYear
          }
        ]
      });
      this.set("pageEntryAnimation", "fade-in-animation");
      this.set("pageExitAnimation", "fade-out-animation");
    }
    let effectiveChildren = new FlattenedNodesObserver.getFlattenedNodes(
      this
    ).filter(n => n.nodeType === Node.ELEMENT_NODE);
    if (effectiveChildren && 0 < effectiveChildren.length) {
      for (var i = 0; i < effectiveChildren.length; i++) {
        if (effectiveChildren[i].hasAttribute("dialog-confirm")) {
          effectiveChildren[i].addEventListener(
            "tap",
            this._updateBindDate.bind(this)
          );
          effectiveChildren[i].addEventListener(
            "transitionend",
            this._updateBindDate.bind(this)
          );
        }
        this._updateDistributedButtonInkColorCustomProp(
          effectiveChildren[i],
          "#737373"
        );
      }
      this.$.dp.classList.add("with-buttons");
    } else {
      this.$.dp.classList.remove("with-buttons");
    }
    this.fire("app-datepicker-attached");
  },
  _computeDaysOfMonth: function(
    _activeYear,
    _activeMonth,
    _firstDayOfWeek,
    _locale
  ) {
    if (!window.Intl) {
      return;
    }
    var _start = new Date(_activeYear, _activeMonth, 1).getDay(),
      _daysOfMonth = [],
      _totalDays = (function(_year, _month) {
        var _totalDaysOfMonth = new Date(_year, _month + 1, 0).getDate();
        return _totalDaysOfMonth;
      })(_activeYear, _activeMonth);
    if (0 < _firstDayOfWeek && 7 > _firstDayOfWeek) {
      _start = _start - _firstDayOfWeek;
      _start = 0 > _start ? 7 + _start : _start;
    }
    _locale =
      _locale ||
      (window.Intl &&
        window.Intl.DateTimeFormat &&
        window.Intl.DateTimeFormat().resolvedOptions &&
        window.Intl.DateTimeFormat().resolvedOptions().locale) ||
      "en-US";
    for (
      var _formatter =
          window.Intl && window.Intl.DateTimeFormat
            ? new window.Intl.DateTimeFormat(_locale, {
                timeZone: "UTC",
                day: "numeric"
              }).format
            : function(date) {
                return date.getDate();
              },
        i = 0,
        j = 1 - _start;
      42 > i;
      i++, j++
    ) {
      var _formatted = _formatter(Date.UTC(_activeYear, _activeMonth, j)),
        _dateObj = { date: "", index: "" };
      if ((i >= _start) & (i < _start + _totalDays)) {
        _dateObj.date = _formatted;
        _dateObj.index = j;
      }
      _daysOfMonth.push(_dateObj);
    }
    this.set(
      "_chosenDaysOfMonth",
      this._computeChosenDaysOfMonth(_daysOfMonth, this._selectedDate)
    );
    this.set("_daysOfMonth", _daysOfMonth);
  },
  _computeShiftedDisableDays: function(_firstDayOfWeek) {
    _firstDayOfWeek =
      0 < _firstDayOfWeek && 7 > _firstDayOfWeek ? _firstDayOfWeek : 0;
    var _sdd = this.disableDays.map(function(_day) {
      _day = _day - _firstDayOfWeek;
      return 0 > _day ? 7 + _day : _day;
    });
    this.set("_shiftedDisableDays", _sdd);
  },
  _incrementMonth: function() {
    this.debounce(
      "_incrementMonth",
      function() {
        this.set("_isIncrementMonth", !0);
        window.requestAnimationFrame(
          function() {
            var _month = this._activeMonth;
            if (0 === ++_month % 12) {
              this._activeYear++;
            }
            this.set("_activeMonth", _month % 12);
            if (!this.noAnimation) {
              this.cancelAnimation();
              this.playAnimation("incrementEntry");
            }
            this.set("_isIncrementMonth", !1);
          }.bind(this)
        );
      },
      100
    );
  },
  _decrementMonth: function() {
    this.debounce(
      "_decrementMonth",
      function() {
        this.set("_isDecrementMonth", !0);
        window.requestAnimationFrame(
          function() {
            var _month = this._activeMonth;
            if (0 > --_month) {
              this._activeYear--;
              _month = 11;
            }
            this.set("_activeMonth", _month);
            if (!this.noAnimation) {
              this.cancelAnimation();
              this.playAnimation("decrementEntry");
            }
            this.set("_isDecrementMonth", !1);
          }.bind(this)
        );
      },
      100
    );
  },
  _computeActiveMonthYear: function(_activeYear, _activeMonth, _locale) {
    if (window.Intl) {
      _locale =
        _locale ||
        (window.Intl &&
          window.Intl.DateTimeFormat &&
          window.Intl.DateTimeFormat().resolvedOptions &&
          window.Intl.DateTimeFormat().resolvedOptions().locale) ||
        "en-US";
      var _amy = new window.Intl.DateTimeFormat(_locale, {
        timeZone: "UTC",
        month: "short",
        year: "numeric"
      }).format(Date.UTC(_activeYear, _activeMonth, 1));
      this.set("_activeMonthYear", _amy);
    }
  },
  _computeShortSelectedDate: function(
    _selectedYear,
    _selectedMonth,
    _selectedDate,
    _locale
  ) {
    if (window.Intl) {
      _locale =
        _locale ||
        (window.Intl &&
          window.Intl.DateTimeFormat &&
          window.Intl.DateTimeFormat().resolvedOptions &&
          window.Intl.DateTimeFormat().resolvedOptions().locale) ||
        "en-US";
      var _ssd = new window.Intl.DateTimeFormat(_locale, {
        timeZone: "UTC",
        weekday: "short",
        month: "short",
        day: "numeric"
      }).format(Date.UTC(_selectedYear, _selectedMonth, _selectedDate));
      this.set("_shortSelectedDate", _ssd);
      if (this.autoUpdateDate) {
        this.enforceDateChange();
      }
    }
  },
  _computeShowSelectedYear: function(_selectedYear, _locale) {
    if (window.Intl) {
      _locale =
        _locale ||
        (window.Intl &&
          window.Intl.DateTimeFormat &&
          window.Intl.DateTimeFormat().resolvedOptions &&
          window.Intl.DateTimeFormat().resolvedOptions().locale) ||
        "en-US";
      var _ssy = new window.Intl.DateTimeFormat(_locale, {
        timeZone: "UTC",
        year: "numeric"
      }).format(Date.UTC(_selectedYear, 0, 1));
      this.set("_showSelectedYear", _ssy);
    }
  },
  _chooseDaysOfMonth: function(ev) {
    var _target = ev.target;
    if (
      _target &&
      this._isNumber(_target.date) &&
      !_target.classList.contains("is-disabled-day")
    ) {
      this.set("_chosenDaysOfMonth", _target.index);
      this.set("_selectedYear", this._activeYear);
      this.set("_selectedDate", _target.date);
      this.set("_selectedMonth", this._activeMonth);
    }
  },
  _isToday: function(_item, _activeYear, _activeMonth) {
    var _now = new Date(),
      _isToday =
        _item === _now.getDate() &&
        _activeYear === _now.getFullYear() &&
        _activeMonth === _now.getMonth();
    return _isToday ? " is-today" : "";
  },
  _isEmptyDate: function(_item) {
    return this._isNumber(_item) ? "" : " is-non-selectable";
  },
  _isChosenDaysOfMonth: function(
    _item,
    _selectedYear,
    _selectedMonth,
    _selectedDate
  ) {
    var _isChosenDaysOfMonth =
      0 <= this._chosenDaysOfMonth &&
      this._activeYear === _selectedYear &&
      this._activeMonth === _selectedMonth &&
      _item === _selectedDate;
    return _isChosenDaysOfMonth ? " chosen-days-of-month" : "";
  },
  _isDisableDays: function(_index, _firstDayOfWeek, _minDate, _maxDate, _item) {
    var _isLessThanMinDate = !1,
      _isMoreThanMaxDate = !1,
      _isDisableDay = !1,
      _isDisableDates = !1,
      _isDisableDays = this._shiftedDisableDays.some(function(_n) {
        return _n === _index % 7;
      });
    if (this._isNumber(_item)) {
      var _minDateObj = this._convertDateStringToDateObject(_minDate),
        _maxDateObj = this._convertDateStringToDateObject(_maxDate),
        _currentDate = new Date(this._activeYear, this._activeMonth, _item);
      if (_minDateObj) {
        _isLessThanMinDate = _currentDate.getTime() < _minDateObj.getTime();
      }
      if (_maxDateObj) {
        _isMoreThanMaxDate = _currentDate.getTime() > _maxDateObj.getTime();
      }
      _isDisableDates =
        this.disableDates &&
        this.disableDates.length &&
        this.disableDates.some(
          function(date) {
            var _dateObj = this._convertDateStringToDateObject(date);
            return _dateObj && _currentDate.getTime() === _dateObj.getTime();
          }.bind(this)
        );
    }
    _isDisableDay =
      _isDisableDays ||
      _isDisableDates ||
      _isLessThanMinDate ||
      _isMoreThanMaxDate;
    return _isDisableDay ? " is-disabled-day is-non-selectable" : "";
  },
  _isListOfYearsSelected: function(selectedYear, year) {
    return +selectedYear === +year ? " is-selected" : "";
  },
  _computeDaysOfWeek: function(_firstDayOfWeek, _locale) {
    var _dow = ["S", "M", "T", "W", "T", "F", "S"],
      _firstDayOfWeek =
        0 < _firstDayOfWeek && 7 > _firstDayOfWeek ? _firstDayOfWeek : 0;
    if (_locale && window.Intl) {
      _dow = [];
      for (
        var _today = new Date(),
          _offsetDate = _today.getDate() - _today.getDay(),
          _formatter = new window.Intl.DateTimeFormat(_locale, {
            timeZone: "UTC",
            weekday: "narrow"
          }).format,
          newDate = null,
          i = 0;
        7 > i;
        i++
      ) {
        newDate = Date.UTC(
          _today.getFullYear(),
          _today.getMonth(),
          _offsetDate + i
        );
        _dow.push(_formatter(newDate));
      }
    }
    var _sliced = _dow.slice(_firstDayOfWeek),
      _rest = _dow.slice(0, _firstDayOfWeek),
      _concatted = Array.prototype.concat(_sliced, _rest);
    this.set("_daysOfWeek", _concatted);
  },
  _computeChosenDaysOfMonth: function(_daysOfMonth, _selectedDate) {
    for (var _len = _daysOfMonth.length, i = 0; i < _len; i++) {
      if (0 <= i && _daysOfMonth[i].index === _selectedDate) {
        return i;
      }
    }
  },
  _convertDateStringToDateObject: function(_date) {
    var _checkDate =
        _date instanceof Date || "string" !== typeof _date
          ? _date
          : new Date(_date),
      _isValidDate = "Invalid Date" !== _checkDate.toDateString();
    return _isValidDate ? _checkDate : null;
  },
  _updateList: function() {
    for (var _newList = [], i = 1900; 2100 >= i; i++) {
      _newList.push({ year: i });
    }
    this.set("_listOfYears", _newList);
  },
  _onAnimationFinish: function(ev) {
    var _target = ev.detail;
    if (_target && "IRON-LIST" === _target.toPage.tagName) {
      var _focusableItem = this._updateListScroller(_target.toPage);
      async.microTask.run(() => {
        _target.toPage._focusPhysicalItem(_focusableItem);
      });
    } else {
      async.microTask.run(() => {
        this.$.showSelectedYear.focus();
      });
    }
  },
  _updateListScroller: function(_list) {
    var _Mathfloor = Math.floor,
      _sl = dom(_list.root).querySelector("#items"),
      _slh = _sl.getBoundingClientRect().height || 12863.994140625,
      _sli =
        _Mathfloor((_slh / (2100 - 1900 + 1)) * (this._activeYear - 1900 - 2)) +
        1;
    if (
      !this.$.dp.classList.contains("with-buttons") &&
      window.matchMedia("(orientation: landscape)").matches
    ) {
      _sli =
        _Mathfloor((_slh / (2100 - 1900 + 1)) * (this._activeYear - 1900 - 1)) +
        1;
    }
    async.microTask.run(() => {
      _list.scroll(0, _sli);
      _list.selectItem(this._activeYear - 1900);
    });
    return this._activeYear - 1900;
  },
  _onIronSelectorSelectedChanged: function(ev) {
    if ("year" === ev.detail.value) {
      if (!this._isListRendered) {
        this._updateList();
        this.set("_isListRendered", !0);
      } else {
        if (this.noAnimation) {
          this._updateListScroller(
            this.shadowRoot.querySelector("#listOfYears")
          );
        }
      }
    }
  },
  _onListRendered: function(ev) {
    if (ev.target.if && this.noAnimation) {
      async.microTask.run(() => {
        this._updateListScroller(this.shadowRoot.querySelector("#listOfYears"));
      });
    }
  },
  _goCalendar: function(ev) {
    if ("keydown" === ev.type && 13 !== ev.keyCode) {
      return;
    }
    var _selectedYear = ev.model.item.year;
    this.set("_activeYear", _selectedYear);
    this.set("_selectedYear", _selectedYear);
    this.shadowRoot
      .querySelector("#listOfYears")
      .selectItem(_selectedYear - 1900);
    this.set("_activeView", "calendar");
  },
  _computeSeparateFormat: function(_format) {
    var re = /^(yyyy|yy|m{1,4}|d{1,2}|do)\W+(yyyy|yy|m{1,4}|d{1,2}|do)\W+(yyyy|yy|m{1,4}|d{1,2}|do)$/g,
      m = re.exec(_format),
      _temp = {},
      _tempArr = [];
    if (null !== m) {
      _tempArr.push(m[1]);
      _tempArr.push(m[2]);
      _tempArr.push(m[3]);
      for (var i = 0, matched; 3 > i; i++) {
        matched = _tempArr[i];
        if (0 <= matched.indexOf("y")) {
          _temp.y = matched;
        } else if (0 <= matched.indexOf("m")) {
          _temp.m = matched;
        } else if (0 <= matched.indexOf("d")) {
          _temp.d = matched;
        }
      }
    }
    if ("d" in _temp && "m" in _temp && "y" in _temp) {
      this.set("_format", _temp);
    }
    _temp = null;
  },
  _bindSelectedFulldate: function(
    _selectedYear,
    _selectedMonth,
    _selectedDate,
    _format
  ) {
    if (this.showLongDate) {
      return this._computeShowLongDate(this.showLongDate, this.locale, !0);
    }
    var _formattedYear = _selectedYear,
      _formattedMonth = this._monthNames[_selectedMonth],
      _formattedDate = _selectedDate,
      _finalFormatted = this.format;
    if ("yy" === _format.y) {
      _formattedYear = _selectedYear % 100;
    }
    if ("mmm" === _format.m) {
      _formattedMonth = _formattedMonth.slice(0, 3);
    } else if ("mm" === _format.m) {
      _formattedMonth = this._padStart(_selectedMonth + 1, 2, "0");
    } else if ("m" === _format.m) {
      _formattedMonth = _selectedMonth + 1;
    }
    if ("do" === _format.d) {
      var _cardinalNumber = _formattedDate % 10,
        _suffixOrdinal =
          3 < _cardinalNumber
            ? "th"
            : ["th", "st", "nd", "rd"][_cardinalNumber];
      if (
        11 === _formattedDate ||
        12 == _formattedDate ||
        13 === _formattedDate
      ) {
        _suffixOrdinal = "th";
      }
      _formattedDate = _formattedDate + _suffixOrdinal;
    } else if ("dd" === _format.d) {
      _formattedDate = this._padStart(_formattedDate, 2, "0");
    }
    _finalFormatted = _finalFormatted.replace(_format.y, _formattedYear);
    _finalFormatted = _finalFormatted.replace(_format.m, _formattedMonth);
    _finalFormatted = _finalFormatted.replace(_format.d, _formattedDate);
    return _finalFormatted;
  },
  _updateBindDate: function(ev) {
    this.debounce(
      "_updateBindDate",
      function() {
        var _type = ev.type;
        if ("tap" === _type) {
          this.set("_isSelectedDateConfirmed", !0);
        }
        if ("transitionend" === _type || this.noAnimation) {
          if (this._isSelectedDateConfirmed) {
            var _sy = this._selectedYear,
              _sm = this._selectedMonth,
              _sd = this._selectedDate,
              _f = this._format,
              _confirmDate = this._bindSelectedFulldate(_sy, _sm, _sd, _f);
            this._setDate(_confirmDate);
            this.set("_isSelectedDateConfirmed", !1);
            if (this.alwaysResetSelectedDateOnDialogClose) {
              this.resetDate();
            }
          }
        }
      },
      1
    );
  },
  _computeShowLongDate: function(_showLongDate, _locale, _returnResult) {
    if (
      !window.Intl ||
      !this._selectedDate ||
      "undefined" === typeof this._selectedDate
    ) {
      return;
    }
    var _selectedDate = this._selectedDate,
      _longDate = Date.UTC(
        this._selectedYear,
        this._selectedMonth,
        _selectedDate
      );
    if (_showLongDate) {
      _locale =
        _locale ||
        (window.Intl &&
          window.Intl.DateTimeFormat &&
          window.Intl.DateTimeFormat().resolvedOptions &&
          window.Intl.DateTimeFormat().resolvedOptions().locale) ||
        "en-US";
      var _options = {
        timeZone: "UTC",
        weekday: this.showLongDate ? "short" : void 0,
        year: "numeric",
        month: this.showLongDate ? "short" : "2-digit",
        day: "2-digit"
      };
      _longDate = new window.Intl.DateTimeFormat(_locale, _options).format(
        _longDate
      );
      if (_returnResult) {
        return _longDate;
      }
      if (window.navigator.msManipulationViewsEnabled) {
        if (_locale || "" === _locale) {
          _longDate = decodeURIComponent(
            encodeURIComponent(_longDate).replace(/\%E2\%80\%8[0-9A-F]/gi, "")
          );
        }
      }
      this._setDate(_longDate);
    } else {
      _longDate = this._bindSelectedFulldate(
        this._selectedYear,
        this._selectedMonth,
        _selectedDate,
        this._format
      );
      if (_returnResult) {
        return _longDate;
      }
      this._setDate(_longDate);
    }
  },
  _updateToReflectExternalChange: function(_inputDate) {
    if (this.showLongDate && 0 > this.locale.indexOf("en")) {
      this._setInvalidDate(!0);
      return;
    }
    var _showLongDate = this.showLongDate,
      _yy = 0,
      _mm = 0,
      _isValidDate = (function(_id, _showLongDate) {
        var _res = { valid: !1, result: "" };
        if (_showLongDate) {
          var _ds = _id.split(", ");
          if (2 < _ds.length) {
            _ds = _ds[1].split(" ").join("/") + ", " + _ds[2];
            var _newDate = new Date(_ds);
            if ("Invalid Date" === _newDate.toString()) {
              return _res;
            } else {
              return { valid: !0, result: _newDate };
            }
          }
          return _res;
        }
        var _re1 = /^(\d{4})\W+(\d{1,2})\W+(\d{1,2})$/i,
          _re2 = /^(\d{4})[ ](\w+)[ ](\d{1,2})$/i,
          _validWithRe1 = _re1.exec(_id),
          _validWithRe2 = _re2.exec(_id);
        if (null === _validWithRe1 && null === _validWithRe2) {
          return _res;
        } else {
          var _resultToDate = null;
          if (null === _validWithRe1) {
            _resultToDate = new Date(
              _validWithRe2[1] + " " + _validWithRe2[2] + " " + _validWithRe2[3]
            );
          } else if (null === _validWithRe2) {
            _resultToDate = new Date(
              +_validWithRe1[1],
              +_validWithRe1[2] - 1,
              +_validWithRe1[3]
            );
          }
          return { valid: !0, result: _resultToDate };
        }
      })(_inputDate, _showLongDate);
    if (_isValidDate.valid) {
      if (this.alwaysResetSelectedDateOnDialogClose) {
        return;
      }
      var _vd = new Date(_isValidDate.result),
        _yy = _vd.getFullYear(),
        _mm = _vd.getMonth();
      this._setInvalidDate(!1);
      this.set("_activeYear", _yy);
      this.set("_activeMonth", _mm);
      this.set("_selectedYear", _yy);
      this.set("_selectedMonth", _mm);
      this.set("_selectedDate", _vd.getDate());
    } else {
      this.set("_selectedDate", this._selectedDate || new Date().getDate());
      this._computeShowLongDate(_showLongDate, this.locale);
      this._setInvalidDate(!0);
    }
  },
  enforceDateChange: function() {
    this._setInvalidDate(!1);
    this._computeShowLongDate(this.showLongDate, this.locale);
  },
  resetDate: function() {
    if (this._isSelectedDateConfirmed) {
      return;
    }
    var now = new Date(),
      nowFy = now.getFullYear(),
      nowM = now.getMonth(),
      nowD = now.getDate();
    this.set("_activeYear", nowFy);
    this.set("_activeMonth", nowM);
    this.set("_selectedYear", nowFy);
    this.set("_selectedMonth", nowM);
    this.set("_selectedDate", nowD);
    this._setInvalidDate(!1);
  },
  _shouldTabIndex: function(
    _index,
    _firstDayOfWeek,
    _minDate,
    _maxDate,
    _item
  ) {
    var _isDisableDays = this._isDisableDays(
      _index,
      _firstDayOfWeek,
      _minDate,
      _maxDate,
      _item
    );
    return _item && 0 <= _item && !_isDisableDays ? 0 : -1;
  },
  _shouldAriaDisabled: function(
    _index,
    _firstDayOfWeek,
    _minDate,
    _maxDate,
    _item
  ) {
    var _isDisableDays = this._isDisableDays(
      _index,
      _firstDayOfWeek,
      _minDate,
      _maxDate,
      _item
    );
    return !(_item && 0 <= _item && !_isDisableDays);
  },
  _padStart: function(_string, _length, _chars) {
    var _str = (_chars + _string).slice(-_length);
    return _str;
  },
  _isNumber: function(_value) {
    return (
      "number" == typeof _value ||
      (!isNaN(parseFloat(_value)) && isFinite(_value))
    );
  },
  _updateThemeColor: function(_theme) {
    var _themes = ["dark-theme", "light-theme", "goog-theme"],
      _themeIdx = _themes.indexOf(_theme),
      _distributedButtons = dom(this).querySelectorAll("paper-button"),
      _distributedButtonsLen = _distributedButtons.length,
      _colorCode = ["#bcbcbc", "#737373", "#616161"][_themeIdx];
    if (0 <= _themeIdx) {
      _themes.splice(_themeIdx, 1);
      this.toggleClass(_themes[0], !1, this);
      this.toggleClass(_themes[1], !1, this);
      this.toggleClass(_theme, !0, this);
    } else {
      this.toggleClass("dark-theme", !1, this);
      this.toggleClass("light-theme", !1, this);
      this.toggleClass("goog-theme", !1, this);
    }
    for (var i = 0; i < _distributedButtonsLen; i++) {
      this._updateDistributedButtonInkColorCustomProp(
        _distributedButtons[i],
        _colorCode || "#737373"
      );
    }
    this.updateStyles();
  },
  _updateDatepickerView: function(_view) {
    this.toggleClass("horizontal-view", "horizontal" === _view, this);
    this.toggleClass("vertical-view", "vertical" === _view, this);
  },
  _updateDistributedButtonInkColorCustomProp: function(_node, _colorCode) {
    this.updateStyles({ "--paper-button-ink-color": _colorCode });
  }
});
