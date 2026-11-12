/**
 * Copyright 2023 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { DDDAccentStyles } from "@haxtheweb/d-d-d/lib/DDDAccent.js";

class DateChip extends DDD {
  static get tag() {
    return "date-chip";
  }
  /**
   * Lit convention
   */
  static get properties() {
    return {
      ...super.properties,
      timestamp: { type: Number },
      unix: { type: Boolean },
      month: { type: String },
      day: { type: Number },
    };
  }
  /**
   * Lit Convention
   */
  static get styles() {
    return [
      super.styles,
      DDDAccentStyles,
      css`
        :host {
          display: block;
          font-family: var(--ddd-font-navigation, sans-serif);
        }
        :host([dark]) {
          color-scheme: dark;
        }

        .date-container {
          display: inline-flex;
          flex-direction: column;
          min-width: 100%;
          text-align: center;
        }

        .date-month {
          display: block;
          border-radius: var(--ddd-radius-sm, 4px) var(--ddd-radius-sm, 4px) 0 0;
          background-color: var(
            --ddd-accent-color,
            var(--ddd-theme-default-beaverBlue, #1e407c)
          );
          color: var(
            --ddd-accent-color-ink,
            var(--ddd-theme-default-white, #ffffff)
          );
          font-size: var(
            --date-chip-month-font-size,
            var(--date-chip-font-size, 18px)
          );
          font-weight: var(--ddd-font-weight-bold, bold);
          line-height: 1.8;
          padding: 0 var(--ddd-spacing-2, 8px);
          text-transform: uppercase;
        }

        .date-container .date-day {
          background-color: light-dark(
            var(--ddd-theme-default-white, #ffffff),
            var(--ddd-theme-default-potentialMidnight, #000321)
          );
          border-radius: 0 0 var(--ddd-radius-sm, 4px) var(--ddd-radius-sm, 4px);
          border: var(--ddd-border-xs, 1px solid);
          border-top: 0;
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight, #e4e5e7),
            var(--ddd-theme-default-slateGray, #314d64)
          );
          color: light-dark(
            var(--ddd-theme-default-nittanyNavy, #001e44),
            var(--ddd-theme-default-white, #ffffff)
          );
          display: block;
          font-size: var(--date-chip-font-size, 18px);
          font-weight: var(--ddd-font-weight-black, 900);
          padding: var(--ddd-spacing-2, 8px) var(--ddd-spacing-4, 16px);
        }
      `,
    ];
  }

  constructor() {
    super();
    this.timestamp = null;
    this.unix = null;
    this.month = null;
    this.day = null;
  }
  /**
   * LitElement life cycle - property changed callback
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (
        ["timestamp", "format", "unix"].includes(propName) &&
        this.timestamp
      ) {
        let stamp = this.timestamp;
        if (this.unix) {
          stamp = stamp * 1000;
        }
        this.month = new Date(stamp)
          .toLocaleString("default", { month: "long" })
          .substring(0, 3);
        this.day = new Date(stamp).getDate();
      }
    });
  }

  render() {
    return html`
      <div class="date-container">
        <span class="date-month">${this.month}</span>
        <span class="date-day">${this.day}</span>
      </div>
    `;
  }
}

globalThis.customElements.define(DateChip.tag, DateChip);
