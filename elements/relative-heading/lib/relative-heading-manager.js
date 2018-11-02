import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";

window.RelativeHeadingManager = {};
window.RelativeHeadingManager.instance = null;

Polymer({
  _template: html`
    <style>
      :host {
        display: none;
      }
    </style>
`,

  is: "relative-heading-manager",
  properties: {},

  /*
   * listen for headings and set their parent elements
   */
  created: function() {
    let root = this;
    if (!window.RelativeHeadingManager.instance) {
      window.RelativeHeadingManager.instance = root;
    }
    document.body.addEventListener("heading-created", function(e) {
      let el = e.detail,
        pid = el.getAttribute("subtopic-of"),
        parent = document.getElementById(pid);
      if (parent !== el.parentHeading) {
        el._setParent(parent);
      }
    });
  }
});

/*
 * checks to see if there is an instance available, and if not appends one
 */
window.RelativeHeadingManager.requestAvailability = function() {
  if (!window.RelativeHeadingManager.instance) {
    window.RelativeHeadingManager.instance = document.createElement(
      "relative-heading-manager"
    );
  }

  document.body.appendChild(window.RelativeHeadingManager.instance);
};
