import { LitElement, html, css } from "lit";
import "./lib/date.format.js";
/**
 * `simple-datetime`
 * @element simple-datetime
 * A simple datetime element that takes in unix timestamp and outputs a date.
 * @demo demo/index.html
 * @microcopy - the mental model for this element
 * - passing in a timestamp from unix and having it be php based date formatting to render is super helpful
 */
class SimpleDatetime extends LitElement {
  /**
   * HTMLElement life cycle
   */
  constructor() {
    super();
    this.format = "M jS, Y";
    this.unix = false;
  }
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
      `,
    ];
  }
  /**
   * LitElement life cycle - render callback
   */
  render() {
    return html` <time datetime="${this.date}">${this.date}</time> `;
  }
  static get tag() {
    return "simple-datetime";
  }
  /**
   * LitElement life cycle -  properties definitions
   */
  static get properties() {
    return {
      /**
       * Javascript timestamp
       */
      timestamp: {
        type: Number,
      },
      /**
       * Format to output, see https://github.com/jacwright/date.format#supported-identifiers
       */
      format: {
        type: String,
      },
      /**
       * Date, generated from timestamp + format
       */
      date: {
        type: String,
      },
      /**
       * Support for UNIX timestamp conversion on the fly
       */
      unix: {
        type: Boolean,
      },
    };
  }
  /**
   * LitElement life cycle - property changed callback
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (["timestamp", "format", "unix"].includes(propName)) {
        this.date = this.formatDate(this.timestamp, this.format, this.unix);
      }
    });
  }
  /**
   * Figure out the date
   */
  formatDate(timestamp, format, unix) {
    // unix timestamp is seconds, JS is milliseconds
    if (unix) {
      timestamp = timestamp * 1000;
    }
    return new Date(timestamp).format(format);
  }
}
customElements.define(SimpleDatetime.tag, SimpleDatetime);
export { SimpleDatetime };
