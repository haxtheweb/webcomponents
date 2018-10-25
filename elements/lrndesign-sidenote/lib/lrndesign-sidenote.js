import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@lrnwebcomponents/a11y-behaviors/a11y-behaviors.js";
import "@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
/**
`lrndesign-sidenote`
A basic side note

@demo demo/index.html
*/
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        --container-bg-color: lightgray;
        --container-text-color: black;
        --container-padding: 1em;
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
        margin-right: .5em;
        @apply --icon-styles;
      }

      #label {
        font-size: 1.3em;
        margin: .8em 0;
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
    /**
     * The display label
     */
    label: {
      type: String,
      value: ""
    },
    /**
     * The display icon for the element
     */
    icon: {
      type: String,
      value: ""
    },
    /**
     * Background Color
     */
    bgColor: {
      type: String,
      value: "#f7f7f7"
    },
    /**
     * Outset will move the entire element left to make it
     * stand out from the content.
     */
    outset: {
      type: Number,
      value: 0
    },
    /**
     * Define the unit of measure for the outset variable
     * Examples: 'em', 'px', '%', 'vw'
     */
    outsetMeasurementType: {
      type: String,
      value: "em"
    }
  },

  /**
   * Create global overrides for each property defined in a component
   *
   * Example: this will override the default value for bgColor for all
   *          lrndesign-sidenote elements on the page.
   *
   *  _.set(window, 'lrndesignSidenote.bgColor', 'blue');
   */
  created: function() {
    for (prop in this.properties) {
      let prefix = this.is;
      // convert prefix to camel case
      prefix = prefix
        .replace("-", " ")
        .replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
          return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
        })
        .replace(/\s+/g, "");

      // find out if a property override is set on the window object
      if (typeof window[prefix] !== "undefined") {
        if (typeof window[prefix][prop] !== "undefined") {
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
      "--container-outset": `${Number(outset)}${outsetMeasurementType}`
    });
  }
});
