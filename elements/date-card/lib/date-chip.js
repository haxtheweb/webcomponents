import { html, css } from "lit";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";

class DateChip extends SimpleColors {
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
      css`
        :host {
          display: block;
        }

        .date-container {
          text-align: center;
        }

        .date-month {
          display: block;
          border-radius: 4px 4px 0 0;
          background: var(--simple-colors-default-theme-accent-12, #1e407c);
          color: var(--simple-colors-default-theme-grey-1, #f7f7f7);
          font-size: var(
            --date-chip-month-font-size,
            var(--date-chip-font-size, 18px)
          );
          font-weight: bold;
          line-height: 1.8;
          padding: 0px 8px;
          text-transform: uppercase;
        }

        .date-container .date-day {
          background: var(--simple-colors-default-theme-accent-2, #f7f7f7);
          border-radius: 0 0 4px 4px;
          border-style: solid;
          border-color: var(--simple-colors-default-theme-accent-12, #f7f7f7);
          color: var(--simple-colors-default-theme-grey-12, #444);
          display: block;
          font-size: var(--date-chip-font-size, 18px);
          font-weight: 900;
          padding: 8px 16px;
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
