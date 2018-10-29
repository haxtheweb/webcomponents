import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import { IronOverlayBehavior } from "../node_modules/@polymer/iron-overlay-behavior/iron-overlay-behavior.js";
Polymer({
  _template: html`
		<slot></slot>
`,
  is: "paper-fab-speed-dial-overlay",
  behaviors: [IronOverlayBehavior]
});
