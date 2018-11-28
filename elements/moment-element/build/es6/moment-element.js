import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import { pathFromUrl } from "./node_modules/@polymer/polymer/lib/utils/resolve-url.js";
import "./node_modules/@lrnwebcomponents/es-global-bridge/es-global-bridge.js";
let MomentElement = Polymer({
  _template: html`
    [[output]]
`,
  is: "moment-element",
  properties: {
    datetime: {
      type: String,
      value: function() {
        return new Date();
      }
    },
    inputFormat: { type: String, value: "" },
    outputFormat: { type: String, value: "" },
    from: { type: String, value: "" },
    to: { type: String, value: "" },
    output: { type: String, notify: !0 },
    libraryLoaded: { type: Boolean }
  },
  observers: [
    "_computeOutput(datetime, inputFormat, outputFormat, from, to, libraryLoaded)"
  ],
  created: function() {
    const name = "moment",
      basePath = pathFromUrl(import.meta.url),
      location = `${basePath}lib/moment/moment.js`;
    window.addEventListener(
      `es-bridge-${name}-loaded`,
      this._momentLoaded.bind(this)
    );
    window.ESGlobalBridge.requestAvailability();
    window.ESGlobalBridge.instance.load(name, location);
  },
  _momentLoaded: function() {
    this.libraryLoaded = !0;
  },
  update: function() {
    this._computeOutput(
      this.datetime,
      this.inputFormat,
      this.outputFormat,
      this.from,
      this.to,
      this.libraryLoaded
    );
  },
  _computeOutput: function(
    datetime,
    inputFormat,
    outputFormat,
    from,
    to,
    libraryLoaded
  ) {
    if (libraryLoaded) {
      var output = inputFormat
        ? moment(datetime, inputFormat)
        : moment(datetime);
      if (outputFormat) {
        output = output.format(outputFormat);
      } else if (from) {
        output = "now" === from ? output.fromNow() : output.from(moment(from));
      } else if (to) {
        output = "now" === to ? output.toNow() : output.to(moment(to));
      }
      this.set("output", output);
    }
  }
});
export { MomentElement };
