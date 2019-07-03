/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/hax-iconset/hax-iconset.js";
import "@lrnwebcomponents/a11y-collapse/a11y-collapse.js";
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
          --a11y-collapse-icon-rotated: {
            transform: rotate(0deg);
          }
        }

        :host([hidden]) {
          display: none;
        }
        :host #calendar {
          font-size: 12px;
          border-collapse: collapse;
        }
        :host #calendar caption div {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        :host #calendar caption paper-button {
          flex: 0 1 auto;
          padding: 5px;
          cursor: pointer;
        }
        :host #calendar caption div div {
          flex: 1 1 auto;
        }
        :host #calendar,
        :host #calendar th,
        :host #calendar td {
          border: 1px solid black;
        }
        :host #calendar th {
          padding: 2px;
        }
        :host #calendar td {
          padding: 0;
        }
        :host #calendar td paper-button {
          width: 100%;
          border: none;
          padding: 5px;
          border-radius: 0;
          cursor: pointer;
        }
      </style>
      <a11y-collapse
        accordion
        icon="hax:calendar"
        label="toggle datepicker"
        tooltip="toggle datepicker"
      >
        <paper-input
          id="dateinput"
          slot="heading"
          label$="[[label]]"
        ></paper-input>
        <div slot="content" role="application">
          <table id="calendar">
            <caption>
              <div>
                <paper-button
                  controls="calendar"
                  label="previous year"
                  ontap="prevYear"
                >
                  <iron-icon icon="av:fast-rewind"></iron-icon>
                </paper-button>
                <paper-button
                  controls="calendar"
                  label="previous month"
                  ontap="prevMonth"
                >
                  <iron-icon icon="hax:arrow-left"></iron-icon>
                </paper-button>
                <div id="calendarlabel">
                  [[currentMonthName]] [[currentYear]]
                </div>
                <paper-button
                  controls="calendar"
                  label="next month"
                  ontap="nextMonth"
                >
                  <iron-icon icon="hax:arrow-right"></iron-icon>
                </paper-button>
                <paper-button
                  controls="calendar"
                  label="next year"
                  ontap="nextYear"
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
              <template is="dom-repeat" items="[[currentDays]]" as="week">
                <tr>
                  <template is="dom-repeat" items="[[week]]" as="weekday">
                    <td scope="row">
                      <paper-button
                        class="day"
                        controls="dateinput"
                        date="[[weekday.date]]"
                        hidden="[[!weekday.date]]"
                      >
                        [[weekday.dd]]
                      </paper-button>
                    </td>
                  </template>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </a11y-collapse>
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
      weekdays: {
        name: "weekdays",
        type: "Array",
        value: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      },
      monthNames: {
        name: "monthNames",
        type: "Array",
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
      currentMonth: {
        name: "currentMonth",
        type: "Number",
        value: 1
      },
      currentMonthName: {
        name: "currentMonthName",
        type: "String",
        computed: "_getMonthName(currentMonth,monthNames)"
      },
      currentYear: {
        name: "currentYear",
        type: "Number",
        value: 2019
      },
      currentDays: {
        name: "currentDays",
        type: "Array",
        computed: "_getCurrentDays(currentMonth,currentYear,weekdays)"
      },
      dateFormat: {
        name: "dateFormat",
        type: "String",
        value: "mm-dd-yyyy"
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
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.HAXWiring = new HAXWiring();
    this.HAXWiring.setup(
      SimpleDatepicker.haxProperties,
      SimpleDatepicker.tag,
      this
    );
  }
  nextMonth() {
    if (this.currentMonth < 12) {
      this.currentMonth++;
    } else {
      this.currentMonth = 1;
      this.currentYear++;
    }
    this.updateCalendar();
  }
  prevMonth() {
    if (this.currentMonth > 1) {
      this.currentMonth--;
    } else {
      this.currentMonth = 12;
      this.currentYear--;
    }
    this.updateCalendar();
  }
  nextYear() {
    this.currentYear++;
    this.updateCalendar();
  }
  prevYear() {
    this.currentYear--;
    this.updateCalendar();
  }
  updateCalendar() {
    let label = this.shadowRoot.querySelector("#calendarlabel");
    console.log(`${this.currentMonthName} ${this.currentYear}`);
    if (label) label.innerHTML = `${this.currentMonthName} ${this.currentYear}`;
  }
  _getMonthName(currentMonth, monthNames) {
    console.log(
      "_getMonthName",
      monthNames,
      currentMonth,
      monthNames[currentMonth - 1]
    );
    return monthNames[currentMonth - 1];
  }
  _getCurrentDays(currentMonth, currentYear, weekdays) {
    let week = [],
      totalDays = [1, 3, 5, 7, 8, 10, 12].includes(currentMonth)
        ? 31
        : currentMonth !== 2
        ? 30
        : currentYear % 4 === 0 &&
          (currentYear % 100 !== 0 || currentYear % 400 === 0)
        ? 29
        : 28;

    for (let i = 1; i <= totalDays / 7; i++) {
      let days = [];
      for (let j = 1; j <= 7; j++) {
        console.log(i, j);
        days.push({
          date: `${currentMonth}/${j * i}/${currentYear}`,
          dd: j * i
        });
      }
      week.push(days);
    }
    return week;
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(SimpleDatepicker.tag, SimpleDatepicker);
export { SimpleDatepicker };
