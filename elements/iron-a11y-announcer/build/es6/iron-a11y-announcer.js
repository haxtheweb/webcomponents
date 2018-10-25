import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { Polymer as Polymer$0 } from "./node_modules/@polymer/polymer/lib/legacy/polymer-fn.js";
export const IronA11yAnnouncer = Polymer$0({
  _template: html`
    <style>
      :host {
        display: inline-block;
        position: fixed;
        clip: rect(0px,0px,0px,0px);
      }
    </style>
    <div aria-live\$="[[mode]]">[[_text]]</div>
`,
  is: "iron-a11y-announcer",
  properties: {
    mode: { type: String, value: "polite" },
    _text: { type: String, value: "" }
  },
  created: function() {
    if (!IronA11yAnnouncer.instance) {
      IronA11yAnnouncer.instance = this;
    }
    document.body.addEventListener(
      "iron-announce",
      this._onIronAnnounce.bind(this)
    );
  },
  announce: function(text) {
    this._text = "";
    async.microTask.run(() => {
      this._text = text;
    }, 100);
  },
  _onIronAnnounce: function(event) {
    if (event.detail && event.detail.text) {
      this.announce(event.detail.text);
    }
  }
});
IronA11yAnnouncer.instance = null;
IronA11yAnnouncer.requestAvailability = function() {
  document.addEventListener("DOMContentLoaded", function() {
    if (!IronA11yAnnouncer.instance) {
      IronA11yAnnouncer.instance = document.createElement(
        "iron-a11y-announcer"
      );
    }
    document.body.appendChild(IronA11yAnnouncer.instance);
  });
};
