import { LitElement, html } from "lit-element/lit-element.js";
import "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";
/**
 * @license
 * Copyright (c) 2016 Abdón Rodríguez Davila (@abdonrd). All rights reserved.
 * This code may only be used under the MIT style license found at https://abdonrd.github.io/LICENSE.txt
 */
/**
Polymer element wrapper for the [moment](https://github.com/moment/moment) library.

Examples:

    <moment-element></moment-element>
    <moment-element datetime="1991-12-31" output-format="MMM DD[,] YYYY"></moment-element>

* @demo demo/index.html
*/
class MomentElement extends LitElement {
  render() {
    return html`
      ${this.output}
    `;
  }
  static get tag() {
    return "moment-element";
  }
  static get properties() {
    return {
      datetime: {
        type: String
      },
      inputFormat: {
        type: String,
        attribute: "input-format"
      },
      outputFormat: {
        type: String,
        attribute: "output-format"
      },
      from: {
        type: String
      },
      to: {
        type: String
      },
      output: {
        type: String
      },
      libraryLoaded: {
        type: Boolean
      }
    };
  }
  // simple path from a url modifier
  pathFromUrl(url) {
    return url.substring(0, url.lastIndexOf("/") + 1);
  }
  constructor() {
    super();
    this.datetime = new Date();
    this.inputFormat = "";
    this.outputFormat = "";
    this.from = "";
    this.to = "";
    const basePath = this.pathFromUrl(decodeURIComponent(import.meta.url));
    const location = `${basePath}lib/moment/moment.js`;
    window.addEventListener(
      "es-bridge-moment-loaded",
      this._momentLoaded.bind(this)
    );
    window.ESGlobalBridge.requestAvailability();
    window.ESGlobalBridge.instance.load("moment", location);
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      let notifiedProps = ["output"];
      if (notifiedProps.includes(propName)) {
        // notify
        let eventName = `${propName
          .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2")
          .toLowerCase()}-changed`;
        this.dispatchEvent(
          new CustomEvent(eventName, {
            detail: {
              value: this[propName]
            }
          })
        );
      }
      if (
        [
          "datetime",
          "inputFormat",
          "outputFormat",
          "from",
          "to",
          "libraryLoaded"
        ].includes(propName)
      ) {
        this.output = this._computeOutput(
          this.datetime,
          this.inputFormat,
          this.outputFormat,
          this.from,
          this.to,
          this.libraryLoaded
        );
      }
    });
  }
  disconnectedCallback() {
    window.removeEventListener(
      "es-bridge-moment-loaded",
      this._momentLoaded.bind(this)
    );
    super.disconnectedCallback();
  }
  _momentLoaded() {
    this.libraryLoaded = true;
  }

  _computeOutput(datetime, inputFormat, outputFormat, from, to, libraryLoaded) {
    if (libraryLoaded) {
      var output = inputFormat
        ? moment(datetime, inputFormat)
        : moment(datetime);
      if (outputFormat) {
        output = output.format(outputFormat);
      } else if (from) {
        output = from === "now" ? output.fromNow() : output.from(moment(from));
      } else if (to) {
        output = to === "now" ? output.toNow() : output.to(moment(to));
      }
      return output;
    }
  }
}
window.customElements.define(MomentElement.tag, MomentElement);
export { MomentElement };
