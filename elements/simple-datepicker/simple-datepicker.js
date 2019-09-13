/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@lrnwebcomponents/hax-iconset/hax-iconset.js";
import "@polymer/paper-input/paper-input.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-icons/av-icons.js";
/**
 * `simple-datepicker`
 * `a simple datepicker field`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SimpleDatepicker extends PolymerElement {
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        :host([hidden]) {
          display: none;
        }
        :host paper-button {
          padding: 5px;
          margin: 0;
          cursor: pointer;
          border-radius: 0;
          min-width: 30px;
        }
        :host #calendar {
          font-size: 12px;
          border-collapse: collapse;
        }
        :host #calendar caption {
          padding: 0;
        }
        :host #calendar caption div {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        :host #calendar caption paper-button {
          flex: 0 1 auto;
          --iron-icon-width: 16px;
          --iron-icon-height: 16px;
        }
        :host #calendarlabel {
          flex: 1 1 auto;
          text-align: center;
          margin: 0 5px;
        }
        :host #calendarlabel p {
          width: 100%;
          margin: 0;
        }
        :host #calendar {
          border: var(--simple-datepicker-calendar-border, 1px solid black);
        }
        :host #calendar,
        :host #calendar th,
        :host #calendar td {
          border: var(--simple-datepicker-calendar-days-border, none);
        }
        :host #calendar th {
          padding: 2px;
        }
        :host #calendar td {
          padding: 0;
        }
        :host #calendar td paper-button {
          width: 100%;
          height: 30px;
          cursor: pointer;
        }
      </style>
      <paper-input
        id="dateinput"
        label$="[[label]]"
        slot="heading"
        value$="{{value}}"
        type="date"
      >
        <paper-button
          id="expand"
          controls="content"
          label="toggle datepicker"
          tooltip="toggle datepicker"
          slot="suffix"
        >
          <iron-icon icon="hax:calendar"></iron-icon>
        </paper-button>
      </paper-input>
      <div id="content" role="application">
        <table id="calendar">
          <caption>
            <div>
              <paper-button
                controls="calendar"
                label="previous year"
                on-tap="prevYear"
              >
                <iron-icon icon="av:fast-rewind"></iron-icon>
              </paper-button>
              <paper-button
                controls="calendar"
                label="previous month"
                on-tap="prevMonth"
              >
                <iron-icon icon="hax:arrow-left"></iron-icon>
              </paper-button>
              <div id="calendarlabel"><p>[[__calendarLabel]]</p></div>
              <paper-button
                controls="calendar"
                label="next month"
                on-tap="nextMonth"
              >
                <iron-icon icon="hax:arrow-right"></iron-icon>
              </paper-button>
              <paper-button
                controls="calendar"
                label="next year"
                on-tap="nextYear"
              >
                <iron-icon
                  icon="av:fast-forward"
                  controls="calendar"
                ></iron-icon>
              </paper-button>
            </div>
          </caption>
          <thead>
            <tr>
              <template is="dom-repeat" items="[[weekdays]]" as="weekday">
                <th scope="col">[[weekday]]</th>
              </template>
            </tr>
          </thead>
          <tbody>
            <template is="dom-repeat" items="[[__calendar]]" as="week" restamp>
              <tr>
                <template is="dom-repeat" items="[[week]]" as="day" restamp>
                  <td scope="row">
                    <paper-button
                      class="day"
                      controls="dateinput"
                      day$="[[day]]"
                      disabled$="[[!disabled]]"
                      hidden$="[[!day]]"
                    >
                      [[day]]
                    </paper-button>
                  </td>
                </template>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    `;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Simple datepicker",
        description: "a simple datepicker field",
        icon: "hax:calendar",
        color: "green",
        groups: ["Datepicker"],
        handles: [
          {
            type: "todo:read-the-docs-for-usage"
          }
        ],
        meta: {
          author: "nikkimk",
          owner: "The Pennsylvania State University"
        }
      },
      settings: {
        quick: [],
        configure: [],
        advanced: []
      }
    };
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      dateFormat: {
        name: "dateFormat",
        type: String,
        value: "mm-dd-yyyy"
      },
      monthNames: {
        name: "monthNames",
        type: Array,
        value: [
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
        ]
      },
      value: {
        name: "value",
        type: String,
        value: null
      },
      weekStart: {
        name: "weekStart",
        type: Number,
        value: 0
      },
      weekdays: {
        name: "weekdays",
        type: Array,
        value: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      },
      __calendar: {
        name: "__calendar",
        type: Array,
        computed: "_getCalendar(__calendarDate)"
      },
      __calendarDate: {
        name: "__calendarDate",
        type: String,
        computed: "_getCalendarDate(value)"
      },
      __calendarLabel: {
        name: "__calendarLabel",
        type: String,
        computed: "updateCalendar(__calendarDate)"
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "simple-datepicker";
  }
  nextMonth() {
    let date = new Date(this.__calendarDate),
      month = date.getMonth(),
      year = date.getFullYear();
    if (month < 11) {
      date.setMonth(month + 1);
    } else {
      date.setMonth(0);
      date.setYear(year + 1);
    }
    this.__calendarDate = date.toString();
  }
  prevMonth() {
    let date = new Date(this.__calendarDate),
      month = date.getMonth(),
      year = date.getFullYear();
    if (month > 0) {
      date.setMonth(month - 1);
    } else {
      date.setMonth(11);
      date.setYear(year - 1);
    }
    this.__calendarDate = date.toString();
  }
  nextYear() {
    let date = new Date(this.__calendarDate),
      year = date.getFullYear();
    date.setYear(year + 1);
    this.__calendarDate = date.toString();
  }
  prevYear() {
    let date = new Date(this.__calendarDate),
      year = date.getFullYear();
    date.setYear(year - 1);
    this.__calendarDate = date.toString();
  }
  updateCalendar(__calendarDate) {
    let label = this.shadowRoot
        ? this.shadowRoot.querySelector("#calendarlabel > p")
        : null,
      date = new Date(__calendarDate),
      month = this.monthNames[date.getMonth()],
      year = date.getFullYear();
    if (label) label.innerHTML = `${month} ${year}`;
    return `${month} ${year}`;
  }
  _getCalendarDate(value) {
    let date = value ? new Date(value) : new Date();
    this.updateCalendar(date);
    return date.toString();
  }
  _getCalendar(__calendarDate) {
    let first = new Date(__calendarDate),
      last = new Date(__calendarDate),
      weeks = [],
      start,
      end,
      cells,
      rows;
    first.setDate(1);
    last.setDate(0);
    start = first.getDay();
    end = 6 - last.getDay();
    cells = start + end + last.getDate();
    rows = cells / 7;
    for (let i = 0; i < rows - 1; i++) {
      weeks[i] = [];
      for (let j = 0; j < 7; j++) {
        let cell = j + i * 7,
          day = 1 + cell - start;
        weeks[i][j] = day < 0 || day > last.getDate() ? false : day;
      }
    }
    return weeks;
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(SimpleDatepicker.tag, SimpleDatepicker);
export { SimpleDatepicker };
