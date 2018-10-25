import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "./lib/app-datepicker-icons.js";
import "./lib/app-datepicker-animations.js";
var $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");

$_documentContainer.innerHTML = `<dom-module id="app-datepicker">
  <template strip-whitespace="">
    <style>
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

    </div>
  </template>

  
</dom-module>`;

document.head.appendChild($_documentContainer);
/**
Material Design: [Pickers](https://www.google.com/design/spec/components/pickers.html#pickers-date-pickers)

An custom Polymer element created to provide a datepicker element that is more compelling and rich with features.

Example:

    <app-datepicker></app-datepicker>
    <app-datepicker-dialog></app-datepicker-dialog>
    <app-datepicker-dialog modal></app-datepicker-dialog>
    <app-datepicker-dialog with-backdrop></app-datepicker-dialog>
    <app-datepicker view="horizontal"></app-datepicker>
    <app-datepicker theme="dark-theme"></app-datepicker>
    <app-datepicker confirm-label="confirm date" dismiss-label="cancel"></app-datepicker>

`app-datepicker` provides a regular datepicker element.
While `app-datepicker-dialog` has a `app-datepicker` being wrapped inside a dialog.

~~### ( Coming soon!) Generating your own boilerplate code of the element `app-datepicker` or `app-datepicker-dialog`~~

~~At the end of the demo, there is a section where user can play around with to generate your own boilerplate code with the attributes provided. Let's go and check out the demo!~~

### Styling

By default, the datepicker is in `light-theme` and now you are able to style almost all possible sections of the datepicker with your own choices of color.

**__ ** Note: As of release v2.4.0 the datepicker includes some basic themes that can be set via `theme` property: `dark-theme`, `light-theme`, or `goog-theme`.__*

Style the datepicker with CSS as you would a normal DOM element.

    app-datepicker-dialog#darkThemedDialog {
      background: #424242;
      --app-datepicker-bg: #424242;
      --app-datepicker-selection-bg: #555555;
      --app-datepicker-selection-color: #cccccc;
      --app-datepicker-iron-selected: #FFFFFF;
      --app-datepicker-calendar-bg: #424242;
      --app-datepicker-calendar-color: #ffffff;
      --app-datepicker-weekdays-color: #c6c6c6;
      --app-datepicker-selected-day-bg: #80CBC4;
      --app-datepicker-selected-day-color: #555555;
      --app-datepicker-selected-year-bg: #f5f5f5;
      --app-datepicker-selected-year-color: #80CBC4;
      --app-datepicker-today-color: #80CBC4;
      --app-datepicker-disabled-color: #ffff00;
      --app-datepicker-icon-button-color: #ffff00;
      --app-datepicker-icon-button-ink-color: #ffff00;
      --app-datepicker-button-color: #80CBC4;
      --app-datepicker-button-ink-color: #bcbcbc;
    }

The following custom properties and mixin are also available for styling:

Custom property | Description | Default
----------------|-------------|----------
`--app-datepicker-bg` | Background color of the datepicker | #fafafa
`--app-datepicker-selection-bg` | Background color of the display section (selectionView) | #009688
`--app-datepicker-selection-color` | Text color of the display section (selectionView) | #b2dfdb
`--app-datepicker-iron-selected` | Text color of the view selector | #fefefe
`--app-datepicker-calendar-bg` | Background color of calendar section | #fafafa
`--app-datepicker-calendar-color` | Text color of calendar section | #000
`--app-datepicker-weekdays-color` | Text color of weekdays | #9b9b9b
`--app-datepicker-selected-day-bg` | Background color of selected day | #009688
`--app-datepicker-selected-day-color` | Text color of selected day | #fff
`--app-datepicker-selected-year-bg` | Background color of selected year in year list | #f5f5f5
`--app-datepicker-selected-year-color` | Text color of selected year in year list | #009688
`--app-datepicker-today-color` | Text color of today's day | #009688
`--app-datepicker-disabled-color` | Text color of disabled days | #9e9e9e
`--app-datepicker-icon-buttons-color` | Text color of `paper-icon-button` | #737373
`--app-datepicker-icon-button-ink-color` | Ink color of `paper-icon-button` | #737373
`--app-datepicker-button-color` | Color of `paper-button` | #009688
`--app-datepicker-button-ink-color` | Ink color of `paper-button` | #737373
`--app-datepicker-date-hover-color` | Color of hovered date | #737373
`--app-datepicker-date-hover-background-color` | Background color of hovered date | #737373
`--app-datepicker-year-hover-background-color` | Background color of hovered year at year list view | {}
`--app-datepicker` | Mixin applied to the datepicker | {}
`--app-datepicker-buttons` | Mixin applied to the datepicker's buttons | {}
`--app-datepicker-selected-year` | Mixin applied to the datepicker's selected year at calendar view | {}
`--app-datepicker-selected-date` | Mixin applied to the datepicker's selected date at calendar view | {}
`--app-datepicker-nav-month-year` | Mixin applied to the datepicker's nav-month-year | {}
`--app-datepicker-days-of-week` | Mixin applied to the datepicker's days-of-week | {}
`--app-datepicker-days-of-month` | Mixin applied to the datepicker's days-of-month | {}
`--app-datepicker-each-list-of-years` | Mixin applied to the datepicker's each-list-of-years | {}
`--app-datepicker-selected-each-list-of-years` | Mixin applied to the datepicker's selected year at year list view | {}
`--app-datepicker-year-hover` | Mixin applied to the datepicker's hovered year at year list view | {}


@author motss
@element app-datepicker, app-datepicker-dialog
@demo demo/index.html
*/
Polymer({
  is: "app-datepicker",

  behaviors: [Polymer.NeonAnimationRunnerBehavior],

  properties: {
    /**
     * Set locale for the datepicker.
     */
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
    /**
     * This forcefully sets the view of the datepicker without respecting the orientation of the device.
     * Available options: `vertical`, `horizontal`.
     */
    view: String,
    /**
     * This is used to set a theme for the datepicker. By default, the `light-theme` is applied.
     * Other options are `dark-theme`, `goog-theme`.
     */
    theme: String,
    /**
     * First Day of the week. Numbered days: `0 (Sun)` to `6 (Sat)`.
     */
    firstDayOfWeek: {
      type: Number,
      value: 0
    },
    /**
     * Arrays of days need to be disabled for selection, numbered from
     * `0 (Sun)` to `6 (Sat)`. Eg. weekends, `disable-days="[0, 6]"`.
     */
    disableDays: {
      type: Array,
      value: function() {
        return [6, 0];
      }
    },
    /**
     * Array of dates need to be disabled for selection.
     */
    disableDates: {
      type: Array,
      value: function() {
        return [];
      }
    },
    /**
     * Minimum date for selection. Dates that are smaller than the minimum
     * date will be disabled for selection.
     */
    minDate: {
      type: String,
      value: "1000/00/01"
    },
    /**
     * Maximum date for selection. Dates that are larger than the maximum
     * date will be disabled for selection.
     */
    maxDate: {
      type: String,
      value: "9999/99/99"
    },
    /**
     * Format for the selected date. Default to `yyyy/mm/dd`. Eg. `2017/05/17`.
     */
    format: {
      type: String,
      value: "yyyy/mm/dd"
    },
    /**
     * Selected date in the default format of `yyyy/mm/dd`. Eg. `2017/05/17`.
     */
    date: {
      type: String,
      notify: true,
      readOnly: true
    },
    /**
     * inputDate accepts a standard date string. It will reflect the change to update the internal.
     */
    inputDate: String,
    /**
     * If true, no animation and transition on all elements.
     */
    noAnimation: Boolean,
    /**
     * Custom animation effect property when the page enters.
     */
    pageEntryAnimation: String,
    /**
     * Custom animation effect when the page exits.
     */
    pageExitAnimation: String,
    /**
     * Selected date will be formatted into long date. Eg. `Fri, May 12 2017`.
     */
    showLongDate: {
      type: Boolean,
      value: !1
    },
    /**
     * To indicate the input date is in an invalid format hence no date change is applied. Only use this with inputDate property.
     */
    invalidDate: {
      type: Boolean,
      notify: true,
      readOnly: true
    },
    /**
     * Auto update the `date` property when changed.
     */
    autoUpdateDate: {
      type: Boolean,
      value: !1
    },

    // Always reset selected date on dialog close. See https://github.com/motss/app-datepicker/issues/74.
    alwaysResetSelectedDateOnDialogClose: Boolean,

    // month names, literally.
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

    _shiftedDisableDays: {
      type: Array,
      value: [6, 0]
    },

    _activeMonthYear: String,
    _shortSelectedDate: String,
    _showSelectedYear: String,

    _daysOfWeek: Array,
    _daysOfMonth: Array,
    _listOfYears: Array,

    _activeView: {
      type: String,
      value: "calendar"
    },
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

    _isListRendered: {
      type: Boolean,
      value: !1
    },

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
          {
            name: "slide-from-right-animation",
            node: this.$.daysOfWeek
          },
          {
            name: "slide-from-right-animation",
            node: this.$.daysOfMonth
          },
          {
            name: "datepicker-slide-from-right-animation",
            node: this.$.navMonthYear
          }
        ],
        decrementEntry: [
          {
            name: "slide-from-left-animation",
            node: this.$.daysOfWeek
          },
          {
            name: "slide-from-left-animation",
            node: this.$.daysOfMonth
          },
          {
            name: "datepicker-slide-from-left-animation",
            node: this.$.navMonthYear
          }
        ]
      });
      this.set("pageEntryAnimation", "fade-in-animation");
      this.set("pageExitAnimation", "fade-out-animation");
    }

    // NOTE: workaround to check for effectiveChildren[0] as paper-button outside of
    // this element will be queried as well even though outside of content tag.
    // Setup distributed children.
    var effectiveChildren = this.getEffectiveChildren();
    if (effectiveChildren && effectiveChildren.length > 0) {
      for (var i = 0; i < effectiveChildren.length; i++) {
        // addEventListener to paper-button with dialog-confirm.
        if (effectiveChildren[i].hasAttribute("dialog-confirm")) {
          // attach event handler which first binded to this scope.
          effectiveChildren[i].addEventListener(
            "tap",
            this._updateBindDate.bind(this)
          );
          effectiveChildren[i].addEventListener(
            "transitionend",
            this._updateBindDate.bind(this)
          );
        }
        // Polymer's polyfill for custom properties does not apply to distributed children.
        // https://www.polymer-project.org/1.0/docs/devguide/styling.html
        this._updateDistributedButtonInkColorCustomProp(
          effectiveChildren[i],
          "#737373"
        );
      }
      // update to a new height for datepicker if paper-buttons present.
      this.$.dp.classList.add("with-buttons");
    } else {
      this.$.dp.classList.remove("with-buttons");
    }

    this.fire("app-datepicker-attached");
  },

  //  Month Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec
  //  Days   31  28  31  30  31  30  31  31  30  31  30  31
  //   31?    0       2       4       6   7       9      11
  //   30?                3       5           8      10
  //  Feb?        1
  //  Su Mo Tu We Th Fr Sa    startDay - _firstDayOfWeek
  //                  1  2        5 - 0 < 0 ? 6 : 5 - 0;
  //  Mo Tu We Th Fr Sa Su
  //               1  2  3        5 - 1 < 0 ? 6 : 5 - 1;
  //  Tu We Th Fr Sa Su Mo
  //            1  2  3  4        5 - 2 < 0 ? 6 : 5 - 2;
  //  We Th Fr Sa Su Mo Tu
  //         1  2  3  4  5        5 - 3 < 0 ? 6 : 5 - 3;
  //  Th Fr Sa Su Mo Tu We
  //      1  2  3  4  5  6        5 - 4 < 0 ? 6 : 5 - 4;
  //  Fr Sa Su Mo Tu We Th
  //   1  2  3  4  5  6  7        5 - 5 < 0 ? 6 : 5 - 5;
  //  Sa Su Mo Tu We Th Fr
  //                     1        5 - 6 < 0 ? 6 : 5 - 6;
  // Compute the days for a month.
  _computeDaysOfMonth: function(
    _activeYear,
    _activeMonth,
    _firstDayOfWeek,
    _locale
  ) {
    // No op for Intl is undefined (for Safari below v10.x.x).
    if (!window.Intl) {
      return;
    }

    // Compute total number of days for a month.
    function _computeTotalDaysOfMonth(_year, _month) {
      var _totalDaysOfMonth = new Date(_year, _month + 1, 0).getDate();
      return _totalDaysOfMonth;
    }

    var _start = new Date(_activeYear, _activeMonth, 1).getDay();
    var _daysOfMonth = [];
    var _totalDays = _computeTotalDaysOfMonth(_activeYear, _activeMonth);

    //  if _firstDayOfWeek is greater than 0 but less than 7.
    if (_firstDayOfWeek > 0 && _firstDayOfWeek < 7) {
      _start = _start - _firstDayOfWeek;
      _start = _start < 0 ? 7 + _start : _start;
    }

    // Set up Intl.
    _locale =
      _locale ||
      ((window.Intl &&
        window.Intl.DateTimeFormat &&
        window.Intl.DateTimeFormat().resolvedOptions &&
        window.Intl.DateTimeFormat().resolvedOptions().locale) ||
        "en-US");
    var _formatter =
      window.Intl && window.Intl.DateTimeFormat
        ? new window.Intl.DateTimeFormat(_locale, {
            timeZone: "UTC",
            day: "numeric"
          }).format
        : function dateTimeFormatShim(date) {
            return date.getDate();
          };
    for (var i = 0, j = 1 - _start; i < 42; i++, j++) {
      var _formatted = _formatter(Date.UTC(_activeYear, _activeMonth, j));
      var _dateObj = { date: "", index: "" };
      if ((i >= _start) & (i < _start + _totalDays)) {
        /**
         * NOTE: Coercing '_formatted' to a number will cause
         * dates in other languages that contain other character
         * to become a NaN.
         */
        _dateObj.date = _formatted;
        _dateObj.index = j;
      }
      _daysOfMonth.push(_dateObj);
    }

    // Update _chosenDaysOfMonth for every new calendar being rendered.
    this.set(
      "_chosenDaysOfMonth",
      this._computeChosenDaysOfMonth(_daysOfMonth, this._selectedDate)
    );

    // Update the old _daysOfMonth.
    this.set("_daysOfMonth", _daysOfMonth);
  },
  /// Re-compute disable days with firstDayOfWeek.
  _computeShiftedDisableDays: function(_firstDayOfWeek, _isDisableDays) {
    _firstDayOfWeek =
      _firstDayOfWeek > 0 && _firstDayOfWeek < 7 ? _firstDayOfWeek : 0;
    var _sdd = this.disableDays.map(function(_day) {
      _day = _day - _firstDayOfWeek;
      return _day < 0 ? 7 + _day : _day;
    });
    this.set("_shiftedDisableDays", _sdd);
  },

  // Increment the month via user interaction.
  _incrementMonth: function(ev) {
    this.debounce(
      "_incrementMonth",
      function() {
        this.set("_isIncrementMonth", !0);
        window.requestAnimationFrame(
          function() {
            var _month = this._activeMonth;

            if (++_month % 12 === 0) {
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
  // Decrement the month via user interaction.
  _decrementMonth: function(ev) {
    this.debounce(
      "_decrementMonth",
      function() {
        this.set("_isDecrementMonth", !0);
        window.requestAnimationFrame(
          function() {
            var _month = this._activeMonth;

            if (--_month < 0) {
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

  // Re-compute active month year if new date is selected.
  _computeActiveMonthYear: function(_activeYear, _activeMonth, _locale) {
    if (window.Intl) {
      _locale =
        _locale ||
        ((window.Intl &&
          window.Intl.DateTimeFormat &&
          window.Intl.DateTimeFormat().resolvedOptions &&
          window.Intl.DateTimeFormat().resolvedOptions().locale) ||
          "en-US");
      var _amy = new window.Intl.DateTimeFormat(_locale, {
        timeZone: "UTC",
        month: "short",
        year: "numeric"
      }).format(Date.UTC(_activeYear, _activeMonth, 1));
      this.set("_activeMonthYear", _amy);
    }
  },
  // Re-compute short version of full date to show on the picker.
  _computeShortSelectedDate: function(
    _selectedYear,
    _selectedMonth,
    _selectedDate,
    _locale
  ) {
    if (window.Intl) {
      _locale =
        _locale ||
        ((window.Intl &&
          window.Intl.DateTimeFormat &&
          window.Intl.DateTimeFormat().resolvedOptions &&
          window.Intl.DateTimeFormat().resolvedOptions().locale) ||
          "en-US");
      var _ssd = new window.Intl.DateTimeFormat(_locale, {
        timeZone: "UTC",
        weekday: "short",
        month: "short",
        day: "numeric"
      }).format(Date.UTC(_selectedYear, _selectedMonth, _selectedDate));
      this.set("_shortSelectedDate", _ssd);

      // When datepicker has no button for date confirmation,
      // by asserting `autoUpdateDate` will trigger auto update on
      // date change.
      if (this.autoUpdateDate) {
        this.enforceDateChange();
      }
    }
  },
  _computeShowSelectedYear: function(_selectedYear, _locale) {
    if (window.Intl) {
      _locale =
        _locale ||
        ((window.Intl &&
          window.Intl.DateTimeFormat &&
          window.Intl.DateTimeFormat().resolvedOptions &&
          window.Intl.DateTimeFormat().resolvedOptions().locale) ||
          "en-US");
      var _ssy = new window.Intl.DateTimeFormat(_locale, {
        timeZone: "UTC",
        year: "numeric"
      }).format(Date.UTC(_selectedYear, 0, 1));
      this.set("_showSelectedYear", _ssy);
    }
  },

  // When a day of month is selected, a lot of tasks need to be carried out.
  _chooseDaysOfMonth: function(ev) {
    var _target = ev.target;
    // daysOfMonth is chooseable when:
    // a) _target.date is of type Number,
    // b) _target.classList.contains('is-disabled-day').
    if (
      _target &&
      this._isNumber(_target.date) &&
      !_target.classList.contains("is-disabled-day")
    ) {
      // This will trigger _isChosenDaysOfMonth to recompute style.
      this.set("_chosenDaysOfMonth", _target.index);

      this.set("_selectedYear", this._activeYear);
      this.set("_selectedDate", _target.date);
      this.set("_selectedMonth", this._activeMonth);
    }
  },

  // Re-compute class when the item (day of month) is today's date.
  _isToday: function(_item, _activeYear, _activeMonth) {
    var _now = new Date();
    var _isToday =
      _item === _now.getDate() &&
      _activeYear === _now.getFullYear() &&
      _activeMonth === _now.getMonth();
    return _isToday ? " is-today" : "";
  },
  // Re-compute class when the item (day of month) is empty date & non-selectable.
  _isEmptyDate: function(_item) {
    return this._isNumber(_item) ? "" : " is-non-selectable";
  },
  // Re-compute class if the item (day of month) is the selected date.
  _isChosenDaysOfMonth: function(
    _item,
    _selectedYear,
    _selectedMonth,
    _selectedDate
  ) {
    // able to retain selected daysOfMonth even after navigating to other months.
    var _isChosenDaysOfMonth =
      this._chosenDaysOfMonth >= 0 &&
      this._activeYear === _selectedYear &&
      this._activeMonth === _selectedMonth &&
      _item === _selectedDate;
    return _isChosenDaysOfMonth ? " chosen-days-of-month" : "";
  },
  // Re-compute class if the item (day of month) is a disable day.
  _isDisableDays: function(_index, _firstDayOfWeek, _minDate, _maxDate, _item) {
    var _isLessThanMinDate = !1;
    var _isMoreThanMaxDate = !1;
    var _isDisableDay = !1;
    var _isDisableDates = false;
    // _index % 7 gives values from 0 to 6.
    // and if _index matches some of these disableDays values return true.
    var _isDisableDays = this._shiftedDisableDays.some(function(_n) {
      return _n === _index % 7;
    });
    // ------ < _minDate ---------------- _maxDate > ------
    // if _item is of type Number.
    // if converted _item into new Date() < minDate or > maxDate.
    if (this._isNumber(_item)) {
      var _minDateObj = this._convertDateStringToDateObject(_minDate);
      var _maxDateObj = this._convertDateStringToDateObject(_maxDate);
      var _currentDate = new Date(this._activeYear, this._activeMonth, _item);
      // run two different obj differently just in case only one of them
      // is defined and still be able to update disabled days.
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
    // To disable a date, it must be either one of the followings:
    // a) _isDisabledDays (set by property disableDays),
    // b) _isDisableDates (set by property disableDates),
    // c) _isLessThanMinDate (set by property minDate), and
    // d) _isMoreThanMaxDate (set by propery moreDate).
    _isDisableDay =
      _isDisableDays ||
      _isDisableDates ||
      _isLessThanMinDate ||
      _isMoreThanMaxDate;
    return _isDisableDay ? " is-disabled-day is-non-selectable" : "";
  },

  // Re-compute class when a year is selected at year page.
  _isListOfYearsSelected: function(selectedYear, year) {
    return +selectedYear === +year ? " is-selected" : "";
  },

  _computeDaysOfWeek: function(_firstDayOfWeek, _locale) {
    // _daysOfWeek needs to be changed as well with firstDayOfWeek and locale.
    var _dow = ["S", "M", "T", "W", "T", "F", "S"];
    var _firstDayOfWeek =
      _firstDayOfWeek > 0 && _firstDayOfWeek < 7 ? _firstDayOfWeek : 0;

    // if locale is set and window.Intl is supported...
    if (_locale && window.Intl) {
      _dow = [];
      var _today = new Date();
      var _offsetDate = _today.getDate() - _today.getDay();
      var _formatter = new window.Intl.DateTimeFormat(_locale, {
        timeZone: "UTC",
        weekday: "narrow"
      }).format;
      var newDate = null;

      for (var i = 0; i < 7; i++) {
        newDate = Date.UTC(
          _today.getFullYear(),
          _today.getMonth(),
          _offsetDate + i
        );
        _dow.push(_formatter(newDate));
      }
    }

    var _sliced = _dow.slice(_firstDayOfWeek);
    var _rest = _dow.slice(0, _firstDayOfWeek);
    var _concatted = Array.prototype.concat(_sliced, _rest);

    this.set("_daysOfWeek", _concatted);
  },
  // Re-compute the index of the selected date when a new date is selected
  // via user interaction.
  _computeChosenDaysOfMonth: function(_daysOfMonth, _selectedDate) {
    // depends on _daysOfMonth and recalculate the index of _chosenDaysOfMonth.
    var _len = _daysOfMonth.length;
    for (var i = 0; i < _len; i++) {
      if (i >= 0 && _daysOfMonth[i].index === _selectedDate) {
        return i;
      }
    }
  },

  // Convert date string into date object.
  _convertDateStringToDateObject: function(_date) {
    var _checkDate =
      _date instanceof Date || typeof _date !== "string"
        ? _date
        : new Date(_date);
    var _isValidDate = _checkDate.toDateString() !== "Invalid Date";
    return _isValidDate ? _checkDate : null;
  },

  // Dynamically load items into the iron-list when switching page to year view.
  _updateList: function(_activeView) {
    for (var _newList = [], y = 1900, i = y; i <= 2100; i++) {
      _newList.push({ year: i });
    }
    this.set("_listOfYears", _newList);
  },
  // On neon-animaition-finish, udpate scroller position of the iron-list.
  // It is to fix the iron-list so that the selected year will always be centered by
  // hardcoded with fixed length of #items.
  _onAnimationFinish: function(ev) {
    var _target = ev.detail;
    // TO fix the scrolling of iron-list, hard coded with fixed length of #items.
    if (_target && _target.toPage.tagName === "IRON-LIST") {
      var _focusableItem = this._updateListScroller(_target.toPage);
      // Automatically focus selected list of year at year view.
      this.async(function() {
        _target.toPage._focusPhysicalItem(_focusableItem);
      }, 1);
    } else {
      // When user navigate to calendar view from list view,
      // re-focus showSelectedYear.
      this.async(function() {
        this.$.showSelectedYear.focus();
      }, 1);
    }
  },
  _updateListScroller: function(_list) {
    var _sl = Polymer.dom(_list.root).querySelector("#items");
    var _slh = _sl.getBoundingClientRect().height || 12863.994140625;
    var _sli =
      Math.floor((_slh / (2100 - 1900 + 1)) * (this._activeYear - 1900 - 2)) +
      1;

    // Adjust center position when datepickers has no buttons and in landscape mode.
    if (
      !this.$.dp.classList.contains("with-buttons") &&
      window.matchMedia("(orientation: landscape)").matches
    ) {
      _sli =
        Math.floor((_slh / (2100 - 1900 + 1)) * (this._activeYear - 1900 - 1)) +
        1;
    }

    // Scroll to selected year.
    this.async(function() {
      _list.scroll(0, _sli);
      // Select initial item for the list.
      _list.selectItem(this._activeYear - 1900);
    }, 17); // wait for at least 17ms to update the scroller position.

    // Return index of item that should be focused on the list.
    return this._activeYear - 1900;
  },
  // When first time switching page to year view, dynamically render iron-list.
  _onIronSelectorSelectedChanged: function(ev) {
    if (ev.detail.value === "year") {
      if (!this._isListRendered) {
        this._updateList();
        this.set("_isListRendered", !0);
      } else {
        // When noAnimation is truthy, this will update the list scroller.
        if (this.noAnimation) {
          this._updateListScroller(this.$$("#listOfYears"));
        }
      }
    }
  },
  _onListRendered: function(ev) {
    // When noAnimation is truthy, this will update the list scroller.
    if (ev.target.if && this.noAnimation) {
      this.async(function() {
        this._updateListScroller(this.$$("#listOfYears"));
      }, 1);
    }
  },
  _goCalendar: function(ev) {
    // Listen for enter key from keyboard.
    if (ev.type === "keydown" && ev.keyCode !== 13) {
      return;
    }

    var _selectedYear = ev.model.item.year;
    // Set _activeYear and _selectedYear to the selected year.
    this.set("_activeYear", _selectedYear);
    this.set("_selectedYear", _selectedYear);
    // Update selected item in iron-list.
    this.$$("#listOfYears").selectItem(_selectedYear - 1900);

    // Go back to calendar page.
    this.set("_activeView", "calendar");
  },

  // split capturing group of format into year, month and date.
  _computeSeparateFormat: function(_format) {
    var re = /^(yyyy|yy|m{1,4}|d{1,2}|do)\W+(yyyy|yy|m{1,4}|d{1,2}|do)\W+(yyyy|yy|m{1,4}|d{1,2}|do)$/g;
    var m = re.exec(_format);
    var _temp = {};
    var _tempArr = [];
    if (m !== null) {
      _tempArr.push(m[1]);
      _tempArr.push(m[2]);
      _tempArr.push(m[3]);

      for (var i = 0, matched; i < 3; i++) {
        matched = _tempArr[i];

        if (matched.indexOf("y") >= 0) {
          _temp.y = matched;
        } else if (matched.indexOf("m") >= 0) {
          _temp.m = matched;
        } else if (matched.indexOf("d") >= 0) {
          _temp.d = matched;
        }
      }
    }

    // Only set _format if the new format is valid.
    if ("d" in _temp && "m" in _temp && "y" in _temp) {
      this.set("_format", _temp);
    }

    _temp = null;
  },

  // bind the selected date so that it's ready to be read from the outside world.
  _bindSelectedFulldate: function(
    _selectedYear,
    _selectedMonth,
    _selectedDate,
    _format
  ) {
    // show long date (eg. Fri, May 12 2017 instead.
    if (this.showLongDate) {
      return this._computeShowLongDate(this.showLongDate, this.locale, !0);
    }

    var _formattedYear = _selectedYear;
    var _formattedMonth = this._monthNames[_selectedMonth];
    var _formattedDate = _selectedDate;
    var _finalFormatted = this.format;
    // compute new formatted year.
    if (_format.y === "yy") {
      _formattedYear = _selectedYear % 100;
    }
    // compute new formatted month.
    if (_format.m === "mmm") {
      _formattedMonth = _formattedMonth.slice(0, 3);
    } else if (_format.m === "mm") {
      _formattedMonth = this._padStart(_selectedMonth + 1, 2, "0");
    } else if (_format.m === "m") {
      _formattedMonth = _selectedMonth + 1;
    }
    // compute new formatted date.
    if (_format.d === "do") {
      var _cardinalNumber = _formattedDate % 10;
      var _suffixOrdinal =
        _cardinalNumber > 3 ? "th" : ["th", "st", "nd", "rd"][_cardinalNumber];
      if (
        _formattedDate === 11 ||
        _formattedDate == 12 ||
        _formattedDate === 13
      ) {
        _suffixOrdinal = "th";
      }
      _formattedDate = _formattedDate + _suffixOrdinal;
    } else if (_format.d === "dd") {
      _formattedDate = this._padStart(_formattedDate, 2, "0");
    }
    // set formatted value with user defined symbols.
    _finalFormatted = _finalFormatted.replace(_format.y, _formattedYear);
    _finalFormatted = _finalFormatted.replace(_format.m, _formattedMonth);
    _finalFormatted = _finalFormatted.replace(_format.d, _formattedDate);

    return _finalFormatted;
  },
  // method for content tag (eg. buttons).
  _updateBindDate: function(ev) {
    this.debounce(
      "_updateBindDate",
      function() {
        var _type = ev.type;
        if (_type === "tap") {
          this.set("_isSelectedDateConfirmed", !0);
        }

        if (_type === "transitionend" || this.noAnimation) {
          if (this._isSelectedDateConfirmed) {
            var _sy = this._selectedYear;
            var _sm = this._selectedMonth;
            var _sd = this._selectedDate;
            var _f = this._format;
            var _confirmDate = this._bindSelectedFulldate(_sy, _sm, _sd, _f);
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
  // Update date to show long date or short date.
  _computeShowLongDate: function(_showLongDate, _locale, _returnResult) {
    if (
      !window.Intl ||
      !this._selectedDate ||
      typeof this._selectedDate === "undefined"
    ) {
      return;
    }

    var _selectedDate = this._selectedDate;
    var _longDate = Date.UTC(
      this._selectedYear,
      this._selectedMonth,
      _selectedDate
    );

    if (_showLongDate) {
      _locale =
        _locale ||
        ((window.Intl &&
          window.Intl.DateTimeFormat &&
          window.Intl.DateTimeFormat().resolvedOptions &&
          window.Intl.DateTimeFormat().resolvedOptions().locale) ||
          "en-US");
      var _options = {
        timeZone: "UTC",
        weekday: this.showLongDate ? "short" : undefined,
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

      // Fix for notorious IE - add unknown spaces (%E2%80%8E) when formatting date with Intl.
      // http://utf8-chartable.de/unicode-utf8-table.pl?start=8192&number=128
      if (window.navigator.msManipulationViewsEnabled) {
        if (_locale || _locale === "") {
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

  // TO make things simple and works across different browsers, the input date string
  // has to be standardized - YYYY/MM/DD.
  // http://dygraphs.com/date-formats.html
  _updateToReflectExternalChange: function(_inputDate) {
    // Due to limitation of input date received by platform's Date,
    // inputDate was designed to only be able to accept inputs for the followings:
    // short date for all locales in the format of yyyy/mm/dd or yyyy/d/m eg. 2016/06/06.
    // long formatted date for en and en-* locale **ONLY** eg. Tue, Jul 5, 2016.
    if (this.showLongDate && this.locale.indexOf("en") < 0) {
      this._setInvalidDate(!0);
      return;
    }
    // accepted input date string:
    // 1. 2016 January 31
    // 2. 2016 January 3
    // 3. 2016 Jan 31
    // 4. 2016 Jan 3
    // 5. 2016/13/13
    function validateDate(_id, _showLongDate) {
      var _res = {
        valid: !1,
        result: ""
      };
      // Check if long input date is a valid date.
      if (_showLongDate) {
        var _ds = _id.split(", ");
        if (_ds.length > 2) {
          _ds = _ds[1].split(" ").join("/") + ", " + _ds[2];
          var _newDate = new Date(_ds);
          if (_newDate.toString() === "Invalid Date") {
            return _res;
          } else {
            return {
              valid: !0,
              result: _newDate
            };
          }
        }

        return _res;
      }

      // From here onwards, to check for short input date.
      var _re1 = /^(\d{4})\W+(\d{1,2})\W+(\d{1,2})$/i;
      var _re2 = /^(\d{4})[ ](\w+)[ ](\d{1,2})$/i;

      var _validWithRe1 = _re1.exec(_id);
      var _validWithRe2 = _re2.exec(_id);

      if (_validWithRe1 === null && _validWithRe2 === null) {
        return _res;
      } else {
        var _resultToDate = null;
        if (_validWithRe1 === null) {
          _resultToDate = new Date(
            _validWithRe2[1] + " " + _validWithRe2[2] + " " + _validWithRe2[3]
          );
        } else if (_validWithRe2 === null) {
          _resultToDate = new Date(
            +_validWithRe1[1],
            +_validWithRe1[2] - 1,
            +_validWithRe1[3]
          );
        }

        return {
          valid: !0,
          result: _resultToDate
        };
      }
    }

    var _showLongDate = this.showLongDate;
    var _yy = 0;
    var _mm = 0;
    var _dd = 0;
    var _isValidDate = validateDate(_inputDate, _showLongDate);

    if (_isValidDate.valid) {
      if (this.alwaysResetSelectedDateOnDialogClose) {
        return;
      }

      var _vd = new Date(_isValidDate.result);
      var _yy = _vd.getFullYear();
      var _mm = _vd.getMonth();
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
  /**
   * By default, buttons are required so that they are to confirm the date change.
   * This method allows force update the datepicker when there are no buttons inside the datepicker to confirm date change.
   */
  enforceDateChange: function() {
    this._setInvalidDate(!1);
    this._computeShowLongDate(this.showLongDate, this.locale);
  },

  // reset date to today's date if alwaysResetSelectedDateOnDialogClose is set.
  resetDate: function() {
    if (this._isSelectedDateConfirmed) {
      return;
    }

    var now = new Date();
    var nowFy = now.getFullYear();
    var nowM = now.getMonth();
    var nowD = now.getDate();

    this.set("_activeYear", nowFy);
    this.set("_activeMonth", nowM);
    this.set("_selectedYear", nowFy);
    this.set("_selectedMonth", nowM);
    this.set("_selectedDate", nowD);
    this._setInvalidDate(false);
  },

  // Accessibility enhancment.
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
    return _item && _item >= 0 && !_isDisableDays ? 0 : -1;
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
    return !(_item && _item >= 0 && !_isDisableDays);
  },

  // Lodash's replacements.
  _padStart: function(_string, _length, _chars) {
    var _len = -_length;
    var _str = (_chars + _string).slice(_len);
    return _str;
  },
  _isNumber: function(_value) {
    // return typeof _value == 'number' || (!Number.isNaN(parseFloat(_value)) && Number.isFinite(_value));
    // Fallback: caused by IE11 as those methods are not supported in IE11.
    return (
      typeof _value == "number" ||
      (!isNaN(parseFloat(_value)) && isFinite(_value))
    );
  },

  // Update theme color.
  _updateThemeColor: function(_theme) {
    var _themes = ["dark-theme", "light-theme", "goog-theme"];
    var _themeIdx = _themes.indexOf(_theme);
    var _distributedButtons = Polymer.dom(this).querySelectorAll(
      "paper-button"
    );
    var _distributedButtonsLen = _distributedButtons.length;
    var _colorCode = ["#bcbcbc", "#737373", "#616161"][_themeIdx];

    if (_themeIdx >= 0) {
      _themes.splice(_themeIdx, 1);

      this.toggleClass(_themes[0], !1, this);
      this.toggleClass(_themes[1], !1, this);
      this.toggleClass(_theme, !0, this);
    } else {
      this.toggleClass("dark-theme", !1, this);
      this.toggleClass("light-theme", !1, this);
      this.toggleClass("goog-theme", !1, this);
    }

    // workaround to update custom property of distributed buttons.
    for (var i = 0; i < _distributedButtonsLen; i++) {
      this._updateDistributedButtonInkColorCustomProp(
        _distributedButtons[i],
        _colorCode || "#737373"
      );
    }
    // Update styles of the whole datepicker.
    this.updateStyles();
  },
  // Forcefully update the view of the datepicker.
  _updateDatepickerView: function(_view) {
    this.toggleClass("horizontal-view", _view === "horizontal", this);
    this.toggleClass("vertical-view", _view === "vertical", this);
  },

  // workaround to update custom property of distributed children until Polymer supports Native custom properties.
  _updateDistributedButtonInkColorCustomProp: function(_node, _colorCode) {
    _node.updateStyles({
      "--paper-button-ink-color": _colorCode
    });
  }

  // TODO: To add GIF to README.md.
  // TODO: To migrate 2nd datepicker to the same month when minDate is set on the 1st datepicker.
});
