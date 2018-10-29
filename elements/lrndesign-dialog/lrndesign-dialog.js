import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { PaperDialogBehavior } from "@polymer/paper-dialog-behavior/paper-dialog-behavior.js";
import "@polymer/paper-dialog-behavior/paper-dialog-shared-styles.js";

Polymer({
  _template: html`
    <style include="paper-dialog-shared-styles"></style>
    <slot></slot>
`,

  is: "lrndesign-dialog",

  behaviors: [PaperDialogBehavior]
});
