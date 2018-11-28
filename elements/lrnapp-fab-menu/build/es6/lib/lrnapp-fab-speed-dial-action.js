import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/paper-fab/paper-fab.js";
import "../node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
import "../node_modules/@polymer/iron-flex-layout/iron-flex-layout-classes.js";
Polymer({
  _template: html`
    <style is="custom-style" include="iron-flex iron-flex-alignment materializecss-styles-colors"></style>
    <style>
      :host {
        @apply --layout-horizontal;
        @apply --layout-center;
        @apply --layout-end-justified;
        margin-top: 15px;
        margin-right: 8px;
        /** For IE11: otherwise the label overlays the FAB */
        min-width: 270px;
      }

      .label {
        color: black;
        background: white;
        padding: 0 16px;
        border-radius: 4px;
        margin-right: 24px;
      }

      .fab {
        --lrnapp-fab-background: var(--lrnapp-fab-speed-dial-action-background);
        --lrnapp-fab-keyboard-focus-background: var(--lrnapp-fab-speed-dial-action-keyboard-focus-background);
      }

      .label,.fab {
        display: inline-block;
      }
    </style>

    <div class="flex"><span class="label"><slot></slot></span></div>
    <paper-fab class$="fab [[color]]" icon="[[icon]]" mini></paper-fab>
`,
  is: "lrnapp-fab-speed-dial-action",
  properties: {
    icon: { type: String, reflectToAttribute: !0 },
    color: { type: String, value: "blue", reflectToAttribute: !0 }
  }
});
