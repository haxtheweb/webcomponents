import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { pathFromUrl } from "@polymer/polymer/lib/utils/resolve-url.js";
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
class MomentElement extends PolymerElement {
  static get template() {
    return html`
      [[output]]
    `;
  }
  static get tag() {
    return "moment-element";
  }
  static get properties() {
    return {
      /**
       * The input datetime. If don't set the datetime, the datetime will be now.
       * For consistent results, parsing anything other than ISO 8601 strings
       * with the `inputFormat` property. More information in [moment String](http://momentjs.com/docs/#/parsing/string/).
       */
      datetime: {
        type: String,
        value() {
          return new Date();
        }
      },

      /**
       * The datetime input format. An string using the
       * [moment String + Format](http://momentjs.com/docs/#/parsing/string-format/).
       */
      inputFormat: {
        type: String,
        value: ""
      },

      /**
       * The datetime output format. Options are 'now' or datetime using the
       * [moment Format](http://momentjs.com/docs/#/displaying/format/).
       */
      outputFormat: {
        type: String,
        value: ""
      },

      /**
       * Relative time using [momen time from now](http://momentjs.com/docs/#/displaying/fromnow/)
       * or [momen Time from datetime](http://momentjs.com/docs/#/displaying/from/).
       */
      from: {
        type: String,
        value: ""
      },

      /**
       * Relative time using [momen Time to now](http://momentjs.com/docs/#/displaying/tonow/)
       * or [momen Time to datetime](http://momentjs.com/docs/#/displaying/to/).
       */
      to: {
        type: String,
        value: ""
      },

      /**
       * The output datetime.
       */
      output: {
        type: String,
        notify: true
      },
      /**
       * library loaded
       */
      libraryLoaded: {
        type: Boolean
      }
    };
  }
  static get observers() {
    return [
      "_computeOutput(datetime, inputFormat, outputFormat, from, to, libraryLoaded)"
    ];
  }
  constructor() {
    super();
    const basePath = pathFromUrl(decodeURIComponent(import.meta.url));
    const location = `${basePath}lib/moment/moment.js`;
    window.addEventListener(
      "es-bridge-moment-loaded",
      this._momentLoaded.bind(this)
    );
    window.ESGlobalBridge.requestAvailability();
    window.ESGlobalBridge.instance.load("moment", location);
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
  /**
   * Recomputes the output
   */
  update() {
    this._computeOutput(
      this.datetime,
      this.inputFormat,
      this.outputFormat,
      this.from,
      this.to,
      this.libraryLoaded
    );
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
      this.set("output", output);
    }
  }
}
window.customElements.define(MomentElement.tag, MomentElement);
export { MomentElement };
