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
        }

        :host([hidden]) {
          display: none;
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
              <paper-button label="previous year" controls="calendar">
                <iron-icon icon="av:fast-rewind"></iron-icon>
              </paper-button>
              <paper-button label="previous month" controls="calendar">
                <iron-icon icon="hax:arrow-left"></iron-icon>
              </paper-button>
              <div>[[currentMonth]] [[currentYear]]</div>
              <paper-button label="next month" controls="calendar">
                <iron-icon icon="hax:arrow-right"></iron-icon>
              </paper-button>
              <paper-button label="next year">
                <iron-icon
                  icon="av:fast-forward"
                  controls="calendar"
                ></iron-icon>
              </paper-button>
            </caption>
            <thead>
              <tr>
                <template is="dom-repeat" items="[[weekdays]]" as="weekday">
                  <th scope="col">[[weekday]]</th>
                </template>
              </tr>
            </thead>
            <tbody>
              <tr>
                <template is="dom-repeat" items="[[currentDays]]" as="day">
                  <td scope="row">
                    <button
                      class="day"
                      controls="dateinput"
                      date="[[day.date]]"
                      hidden="[[!day.date]]"
                    >
                      [[day.dd]]
                    </button>
                  </td>
                </template>
              </tr>
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
        value: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ]
      },
      currentMonth: {
        name: "currentMonth",
        type: "Number",
        value: 1
      },
      currentYear: {
        name: "currentYear",
        type: "Number",
        value: 1
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
  _getCurrentDays(currentMonth, currentYear, weekdays) {
    let days = [],
      totalDays = [1, 3, 5, 7, 8, 10, 12].includes(currentMonth)
        ? 31
        : currentMonth !== 2
        ? 30
        : currentYear % 4 === 0 &&
          (currentYear % 100 !== 0 || currentYear % 400 === 0)
        ? 29
        : 28;
    for (i = 1; i > totalDays; i++) {
      days.push({
        date: `${currentMonth}/${i}/${currentYear}`,
        dd: i
      });
    }
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(SimpleDatepicker.tag, SimpleDatepicker);
export { SimpleDatepicker };
