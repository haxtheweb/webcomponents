/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/iron-icon/iron-icon.js";
import "@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
import "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/a11y-behaviors/a11y-behaviors.js";
import "@lrnwebcomponents/lrn-icons/lrn-icons.js";
/**
 * `lrndesign-paperstack`
 * `Stack of papers visually`
 *
 * @demo demo/index.html
 */
let LrndesignPaperstack = Polymer({
  _template: html`
    <style include="materializecss-styles">
      :host {
        display: block;
      }
      /* Example card */
      .egletter p {
        position: relative;
        z-index: 3;
        line-height: 24px;
      }

      .egletter ul {
        position: relative;
        z-index: 3;
        line-height: 24px;
      }

      .egletter span {
        font-family: cursive;
        margin: 0 auto;
        position: relative;
        z-index: 3;
        line-height: 64px;
      }

      iron-icon {
        display: block;
        font-size: 12px;
        height: 40px;
        width: 40px;
        padding: 4px;
      }

      .icon-container {
        float: left;
        width: 48px;
        height: 48px;
        margin-right: 8px;
      }

      .egletter span {
        line-height: 48px;
      }

      .egletter {
        min-height: 160px;
        padding: 12px 24px;
        position: relative;
        width: 80%;
        z-index: 4;
        margin-bottom: 48px;
      }

      .egletter:before,
      .egletter:after {
        content: "";
        height: 98%;
        position: absolute;
        width: 100%;
        z-index: -1;
      }

      .egletter:before {
        background: #fafafa;
        box-shadow: 0 0 .5rem rgba(0, 0, 0, 0.2);
        left: -.32px;
        top: .32px;
        transform: rotate(-2.5deg);
      }

      .egletter:after {
        background: #ffffff;
        box-shadow: 0 0 .32px rgba(0, 0, 0, 0.2);
        right: -.32px;
        top: 1.6px;
        transform: rotate(1.4deg);
      }
    </style>
    <div class="egletter">
      <div class$="icon-container circle [[color]]">
        <iron-icon icon="[[icon]]" class$="[[textColor]]"></iron-icon>
      </div>
      <span>[[title]]</span>
      <p><slot></slot></p>
    </div>
`,

  is: "lrndesign-paperstack",

  behaviors: [
    HAXBehaviors.PropertiesBehaviors,
    A11yBehaviors.A11y,
    MaterializeCSSBehaviors.ColorBehaviors
  ],

  properties: {
    /**
     * Title
     */
    title: {
      type: String,
      value: "Title"
    },
    /**
     * icon
     */
    icon: {
      type: String,
      value: "lrn:assignment"
    },
    /**
     * Color code
     */
    colorCode: {
      type: String,
      value: "#000000",
      observer: "_colorCodeChange"
    },
    /**
     * Color class
     */
    color: {
      type: String,
      computed: '_computeColorClass(colorCode, "bg")'
    },
    /**
     * Text color
     */
    textCodeColor: {
      type: String,
      value: "#ffffff"
    },
    /**
     * Text color class
     */
    textColor: {
      type: String,
      computed: "_computeColorClass(textCodeColor)"
    }
  },

  /**
   * Attached.
   */
  attached: function() {
    // Establish hax properties if they exist
    let props = {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Paper stack",
        description: "A stack of papers",
        icon: "icons:content-copy",
        color: "grey",
        groups: ["Video", "Media"],
        handles: [],
        meta: {
          author: "LRNWebComponents"
        }
      },
      settings: {
        quick: [
          {
            property: "title",
            title: "Title",
            description: "Title of the cards",
            inputMethod: "textfield",
            icon: "editor:title"
          }
        ],
        configure: [
          {
            property: "title",
            title: "Title",
            description: "Title of the cards",
            inputMethod: "boolean"
          },
          {
            property: "colorCode",
            title: "Color",
            description: "Color of the card",
            inputMethod: "colorpicker"
          },
          {
            property: "icon",
            title: "Icon",
            description: "Icon for the card",
            inputMethod: "iconpicker"
          },
          {
            slot: "",
            title: "Contents",
            description: "card contents",
            inputMethod: "code-editor"
          }
        ],
        advanced: []
      }
    };
    this.setHaxProperties(props);
  },

  /**
   * Notice the color change and shift it over to the class name.
   */
  _computeColorClass: function(color, bg) {
    if (color != null && color.toLowerCase() == "#ffffff") {
      if (bg == "bg") {
        return "white";
      }
      return "white-text";
    } else if (color != null && color == "#000000") {
      if (bg == "bg") {
        return "black";
      }
      return "black-text";
    } else if (color != null && color.substring(0, 1) == "#") {
      return this._colorTransform(color.toLowerCase(), "", "");
    }
  },

  /**
   * Text color change and shift it over to the class name.
   */
  _colorCodeChange: function(newValue, oldValue) {
    if (typeof newValue !== typeof undefined && newValue != null) {
      // sees if there's enough contrast and adjusts them accordingly
      this.computeTextPropContrast("textCodeColor", "colorCode");
    }
  }
});
export { LrndesignPaperstack };
