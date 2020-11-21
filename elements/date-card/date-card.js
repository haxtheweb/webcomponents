/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
/**
 * `date-card`
 * `simple presentation of a date`
 * @litElement
 * @demo demo/index.html
 * @element date-card
 */
class DateCard extends SimpleColors {
  static get tag() {
    return "date-card";
  }
  static get properties() {
    return {
      ...super.properties,
      month: { type: String },
      date: { type: String },
      day: { type: String },
      title: { type: String },
      startTime: { type: String, attribute: "start-time" },
      endTime: { type: String, attribute: "end-time" },
      location: { type: String },
      borderSpacing: { type: Number, attribute: "border-spacing" },
    };
  }

  static get haxProperties() {
    return {
      canScale: false,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Date card",
        description: "Displays a calendar date with details",
        icon: "hax:calendar",
        color: "green",
        groups: ["Date"],
        handles: [],
        meta: {
          author: "McGarvelcuddy",
          owner: "elmsln",
        },
      },
      settings: {
        configure: [
          {
            property: "month",
            title: "Month",
            description: "Month to display on card",
            inputMethod: "textfield",
          },
          {
            property: "date",
            title: "Day of month",
            description: "Numeric date of the month",
            inputMethod: "number",
          },
          {
            property: "day",
            title: "Day of week",
            description: "Textual day of the week",
            inputMethod: "textfield",
          },
          {
            property: "title",
            title: "Title",
            description: "Name of the event",
            inputMethod: "textfield",
          },
          {
            property: "location",
            title: "Location",
            description: "Where it is taking place",
            inputMethod: "textfield",
          },
          {
            property: "startTime",
            title: "Start",
            description: "Start time",
            inputMethod: "textfield",
          },
          {
            property: "endTime",
            title: "End",
            description: "Start time",
            inputMethod: "textfield",
          },
          {
            property: "accentColor",
            title: "Accent Color",
            description: "An optional accent color.",
            inputMethod: "colorpicker",
          },
          {
            property: "dark",
            title: "Dark Theme",
            description: "Enable Dark Theme",
            inputMethod: "boolean",
          },
        ],
        advanced: [],
      },
      saveOptions: {
        unsetAttributes: ["colors"],
      },
    };
  }
  constructor() {
    super();
    this.borderSpacing = 5;
    this.accentColor = "light-blue";
  }

  nth(d) {
    if (!d) {
      return "";
    }
    if (d > 3 && d < 21) return "th";
    switch (d % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: inline-flex;
        }
        .card {
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
          width: var(--date-card-card-width, 100px);
          border-radius: 10px;
        }
        .card:hover {
          box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        .month,
        .dateNumber,
        .dayName {
          text-align: center;
          vertical-align: middle;
          font-family: roboto;
          line-height: 16px;
          margin-bottom: 8px;
          margin-top: 15px;
          margin-bottom: 15px;
        }
        .month {
          color: var(--simple-colors-default-theme-accent-12);
          font-weight: 400;
          font-size: 1em;
          text-transform: uppercase;
        }
        .dateNumber {
          font-size: 20px;
        }
        .dayName {
          text-transform: uppercase;
        }
        .monthSection {
          background-color: var(--simple-colors-default-theme-accent-5);
          border: 1px solid var(--simple-colors-default-theme-accent-1);
          border-radius: 10px 10px 0px 0px;
        }
        .details {
          border: 2px solid var(--simple-colors-default-theme-accent-5);
          padding: 4px 16px;
          background-color: var(--simple-colors-default-theme-accent-1);
        }
        .title,
        .time,
        .location {
          vertical-align: middle;
          font-family: roboto;
          line-height: 16px;
          margin-bottom: 8px;
        }
        .title {
          font-size: 20px;
          color: var(--simple-colors-default-theme-accent-11);
        }
        .time {
          font-size: 16px;
          color: var(--simple-colors-default-theme-accent-10);
        }
        .location {
          font-size: 16px;
          color: var(--simple-colors-default-theme-accent-10);
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="card" style="margin:${this.borderSpacing}px;">
        <div class="monthSection">
          <p class="month"><b>${this.month}</b></p>
        </div>
        <div class="dateSection">
          <p class="dateNumber">
            ${this.date}<sup>${this.nth(this.date)}</sup>
          </p>
          ${this.day ? html` <p class="dayName">${this.day}</p> ` : html``}
        </div>
      </div>
      ${this.title
        ? html`
            <span class="details" .style="margin:${this.borderSpacing}px;">
              <p class="title">${this.title}</p>
              <p class="time">
                ${this.day ? html` ${this.day}, ` : html``}${this.month}
                ${this.date}${this.nth(this.date)}
                ${this.startTime
                  ? html`
                      ${this.endTime
                        ? html` from ${this.startTime} - ${this.endTime} `
                        : html` at ${this.startTime} `}
                    `
                  : html``}
              </p>
              ${this.location
                ? html` <p class="location">${this.location}</p> `
                : html``}
            </span>
          `
        : html``}
    `;
  }
}
customElements.define(DateCard.tag, DateCard);
export { DateCard };
