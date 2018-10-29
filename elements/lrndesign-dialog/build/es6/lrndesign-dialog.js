import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import { PaperDialogBehavior } from "./node_modules/@polymer/paper-dialog-behavior/paper-dialog-behavior.js";
import "./node_modules/@polymer/paper-dialog-behavior/paper-dialog-shared-styles.js";
Polymer({
  _template: html`
    <style include="paper-dialog-shared-styles"></style>
    <slot></slot>
`,
  is: "lrndesign-dialog",
  behaviors: [PaperDialogBehavior]
});
