import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import "./node_modules/@lrnwebcomponents/a11y-behaviors/a11y-behaviors.js";
import "./node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
let LrndesignSidenote = Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        --container-bg-color: lightgray;
        --container-text-color: black;
        --container-padding: 16px;
        --container-outset: 0;
        @apply --host-styles;
      }

      #container {
        display: block;
        background: var(--container-bg-color);
        color: var(--container-text-color);
        padding: var(--container-padding);
        margin-left: -var(--container-outset);
        @apply --container-styles;
      }

      #header {
        display: flex;
        align-items: center;
        @apply --container-header;
      }

      #icon {
        margin-right: 8px;
        @apply --icon-styles;
      }

      #label {
        font-size: 20.8px;
        margin: 12.8px 0;
        flex: 1 1 auto;
        @apply --label-styles;
      }
    </style>
    <div id="container">
      <div id="header">
        <iron-icon id="icon" icon="[[icon]]" hidden\$="[[!icon]]"></iron-icon>
        <div id="label" hidden\$="[[!label]]">[[label]]</div>
      </div>
      <slot></slot>
    </div>
`,
  is: "lrndesign-sidenote",
  behaviors: [A11yBehaviors.A11y, MaterializeCSSBehaviors.ColorBehaviors],
  properties: {
    label: { type: String, value: "" },
    icon: { type: String, value: "" },
    bgColor: { type: String, value: "#f7f7f7" },
    outset: { type: Number, value: 0 },
    outsetMeasurementType: { type: String, value: "em" }
  },
  created: function() {
    for (var prop in this.properties) {
      let prefix = this.is;
      prefix = prefix
        .replace("-", " ")
        .replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
          return 0 == index ? letter.toLowerCase() : letter.toUpperCase();
        })
        .replace(/\s+/g, "");
      if ("undefined" !== typeof window[prefix]) {
        if ("undefined" !== typeof window[prefix][prop]) {
          this.properties[prop].value = window[prefix][prop];
        }
      }
    }
  },
  observers: ["__updateStyles(bgColor, outset, outsetMeasurementType)"],
  __updateStyles: function(bgColor, outset, outsetMeasurementType) {
    const bgColorHex = this._colorTransformFromClass(bgColor) || bgColor;
    this.updateStyles({
      "--container-text-color": this.getTextContrastColor(bgColorHex),
      "--container-bg-color": bgColorHex,
      "--container-outset": `${+outset}${outsetMeasurementType}`
    });
  }
});
export { LrndesignSidenote };
