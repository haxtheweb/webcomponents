/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { DDDAccentStyles } from "@haxtheweb/d-d-d/lib/DDDAccent.js";
/**
 * `date-card`
 * `simple presentation of a date`
 * @litElement
 * @demo demo/index.html
 * @element date-card
 */
class DateCard extends DDD {
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
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
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
      super.styles,
      DDDAccentStyles,
      css`
        :host {
          display: inline-flex;
          align-items: stretch;
          max-width: 100%;
          font-family: var(--ddd-font-navigation, sans-serif);
          --date-card-accent: var(
            --ddd-accent-color,
            var(--ddd-theme-default-skyBlue, #009cde)
          );
          --date-card-ink: var(
            --ddd-accent-color-ink,
            var(--ddd-theme-default-nittanyNavy, #001e44)
          );
          --date-card-surface: light-dark(
            var(--ddd-theme-default-white, #ffffff),
            var(--ddd-theme-default-potentialMidnight, #000321)
          );
          --date-card-line: light-dark(
            var(--ddd-theme-default-limestoneLight, #e4e5e7),
            var(--ddd-theme-default-slateGray, #314d64)
          );
          --date-card-heading: light-dark(
            var(--ddd-theme-default-nittanyNavy, #001e44),
            var(--ddd-theme-default-white, #ffffff)
          );
          --date-card-muted: light-dark(
            var(--ddd-theme-default-slateGray, #314d64),
            var(--ddd-theme-default-limestoneLight, #e4e5e7)
          );
        }
        :host([dark]) {
          color-scheme: dark;
        }
        p {
          margin: 0;
        }
        .card {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          flex: none;
          width: max-content;
          min-width: var(--date-card-card-width, 100px);
          border: var(--ddd-border-xs, 1px solid);
          border-color: var(--date-card-line);
          border-radius: var(--ddd-radius-md, 8px);
          background-color: var(--date-card-surface);
          box-shadow: var(--ddd-boxShadow-sm);
          overflow: hidden;
          text-align: center;
        }
        .card:hover {
          box-shadow: var(--ddd-boxShadow-md);
        }
        .monthSection {
          background-color: var(--date-card-accent);
          color: var(--date-card-ink);
          padding: var(--ddd-spacing-2, 8px) var(--ddd-spacing-3, 12px);
        }
        .month {
          display: block;
          font-weight: var(--ddd-font-weight-bold, bold);
          font-size: var(--ddd-font-size-5xs, 14px);
          line-height: 1.2;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .dateSection {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--ddd-spacing-1, 4px);
          padding: var(--ddd-spacing-2, 8px) var(--ddd-spacing-3, 12px)
            var(--ddd-spacing-3, 12px);
        }
        .dateNumber {
          display: block;
          font-size: var(--ddd-font-size-m, 32px);
          font-weight: var(--ddd-font-weight-bold, bold);
          line-height: 1.1;
          color: var(--date-card-heading);
        }
        .dateNumber sup {
          font-size: 0.45em;
          font-weight: var(--ddd-font-weight-regular, normal);
          vertical-align: super;
        }
        .dayName {
          display: block;
          font-size: var(--ddd-font-size-5xs, 14px);
          line-height: 1.2;
          text-transform: uppercase;
          color: var(--date-card-muted);
        }
        .details {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: var(--ddd-spacing-1, 4px);
          min-width: 0;
          padding: var(--ddd-spacing-3, 12px) var(--ddd-spacing-4, 16px);
          border: var(--ddd-border-xs, 1px solid);
          border-color: var(--date-card-line);
          border-inline-start: 4px solid var(--date-card-accent);
          border-radius: var(--ddd-radius-sm, 4px);
          background-color: var(--date-card-surface);
        }
        .title {
          font-size: var(--ddd-font-size-xxs, 20px);
          font-weight: var(--ddd-font-weight-bold, bold);
          line-height: 1.3;
          color: var(--date-card-heading);
        }
        .time,
        .location {
          font-size: var(--ddd-font-size-4xs, 16px);
          line-height: 1.4;
          color: var(--date-card-muted);
        }
      `,
    ];
  }

  render() {
    // title="" on the shadow wrappers keeps the host title attribute (the
    // event name, rendered visibly below) from showing as a native tooltip
    // over the whole element
    return html`
      <div class="card" title="" style="margin:${this.borderSpacing}px;">
        <div class="monthSection">
          <span class="month">${this.month}</span>
        </div>
        <div class="dateSection">
          <span class="dateNumber"
            >${this.date}<sup>${this.nth(this.date)}</sup></span
          >
          ${this.day ? html`<span class="dayName">${this.day}</span>` : html``}
        </div>
      </div>
      ${this.title
        ? html`
            <div
              class="details"
              title=""
              style="margin:${this.borderSpacing}px;"
            >
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
            </div>
          `
        : html``}
    `;
  }
}
globalThis.customElements.define(DateCard.tag, DateCard);
export { DateCard };
