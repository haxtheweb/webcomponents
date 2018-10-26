import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { IronOverlayBehavior } from "@polymer/iron-overlay-behavior/iron-overlay-behavior.js";
Polymer({
  _template: html`
		<slot></slot>
`,
  is: "paper-fab-speed-dial-overlay",
  behaviors: [IronOverlayBehavior]
});
