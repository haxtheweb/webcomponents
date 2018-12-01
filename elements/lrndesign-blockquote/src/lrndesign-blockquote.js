import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { pathFromUrl } from "@polymer/polymer/lib/utils/resolve-url.js";
import "@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
import "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import "@lrnwebcomponents/a11y-behaviors/a11y-behaviors.js";
import "@polymer/paper-styles/shadow.js";
/**
`lrndesign-blockquote`
A structured blockquote element

@demo demo/index.html
*/
let LrndesignBlockquote = Polymer({
  _template: html`
    <style include="materializecss-styles"></style>
    <style>
      :host {
        display: inline-block;
        position: relative;
        box-sizing: border-box;
        --lrndesign-blockquote-color: #585858;
        --lrndesign-blockquote-cite: #3a3a3a;
        @apply --lrndesign-blockquote;
      }
      blockquote {
        font-size: 19.2px;
        font-style: italic;
        margin: 4px 0;
        padding: 24px 24px 24px 40px;
        line-height: 1.5;
        position: relative;
        color: var(--lrndesign-blockquote-color);
      }
      blockquote.decorate:before {
        display: block;
        font-family: Georgia, serif;
        content: "\\201C";
        font-size: 80px;
        position: absolute;
        left: -20px;
        top: -20px;
      }
      blockquote.outset {
        margin: 4px -128px 4px -128px;
      }
      cite {
        color: var(--lrndesign-blockquote-cite);
        font-size: 12.8px;
        display: block;
        margin-top: 4px;
        text-align: right;
      }
      :host([depth="1"]) blockquote {
        @apply --shadow-elevation-2dp;
      }
      :host([depth="2"]) blockquote {
        @apply --shadow-elevation-3dp;
      }
      :host([depth="3"]) blockquote {
        @apply --shadow-elevation-4dp;
      }
      :host([depth="4"]) blockquote {
        @apply --shadow-elevation-6dp;
      }
      :host([depth="5"]) blockquote {
        @apply --shadow-elevation-8dp;
      }

      /* BEGIN HYPERCARDIFY, thanks @realdlnorman */
      :host([hypercard]) ::slotted(*) {
        -webkit-filter: grayscale(1) contrast(300%);
        filter: grayscale(1) contrast(300%);
        font-family: Chikarego, Helvetica, sans-serif;
        transition: all 0.6s ease;
      }
      /* Disable grayscale on hover */
      :host([hypercard]:hover) ::slotted(*) {
        -webkit-filter: grayscale(0);
        filter: none;
      }
    </style>
    <blockquote class\$="[[generateClass(decorate, outset, color, textColor)]]">
      <slot></slot> <cite class\$="[[textColor]]"> [[citation]] </cite>
    </blockquote>
  `,

  is: "lrndesign-blockquote",

  behaviors: [
    HAXBehaviors.PropertiesBehaviors,
    MaterializeCSSBehaviors.ColorBehaviors,
    SchemaBehaviors.Schema,
    A11yBehaviors.A11y
  ],

  properties: {
    /**
     * Source being cited
     */
    citation: {
      type: String
    },
    /**
     * Depth styling
     */
    depth: {
      type: String,
      value: "0",
      reflectToAttribute: true
    },
    /**
     * Place " glyph decorator
     */
    decorate: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    },
    /**
     * Explode out of boundary container intentionally
     */
    outset: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    },
    /**
     * Color code
     */
    colorCode: {
      type: String,
      value: "#fff9c4",
      observer: "_bgColorChanged"
    },
    /**
     * Color class
     */
    color: {
      type: String,
      computed: "_computeColorClass(colorCode)"
    },
    /**
     * Text color code
     */
    textColorCode: {
      type: String,
      value: "#000000"
    },
    /**
     * Text color class
     */
    textColor: {
      type: String,
      computed: "_computeColorClass(textColorCode)"
    },
    /**
     * Funny 1900s vision.
     */
    hypercard: {
      type: Boolean,
      reflectToAttribute: true,
      value: false,
      observer: "_applyChikarego"
    }
  },

  /**
   * Notice hypercard activated so load the font
   */
  _applyChikarego: function(newValue, oldValue) {
    if (newValue === true) {
      let style = document.createElement("style");
      let basePath = pathFromUrl(import.meta.url);
      style.innerHTML = `@font-face {
        font-family: 'Chikarego';
        src: url('${basePath}lib/chikarego2-webfont.woff2') format('woff2'),
             url('${basePath}lib/chikarego2-webfont.woff') format('woff');
        font-weight: normal;
        font-style: normal;
      }`;
      document.head.appendChild(style);
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
      canEditSource: true,
      gizmo: {
        title: "Fancy quote",
        description: "Presents a famous quote with additional design options.",
        icon: "editor:format-quote",
        color: "grey",
        groups: ["Content", "Presentation"],
        handles: [
          {
            type: "content",
            caption: "quote",
            title: "citation",
            description: "quote",
            citation: "citation",
            color: "colorCode"
          }
        ],
        meta: {
          author: "LRNWebComponents"
        }
      },
      settings: {
        quick: [
          {
            property: "colorCode",
            title: "Background color",
            description: "Select the background color for the quote.",
            inputMethod: "colorpicker",
            icon: "editor:format-color-fill"
          },
          {
            property: "outset",
            title: "Outset",
            description: "Should this expand beyond it's container by design?",
            inputMethod: "boolean",
            icon: "editor:border-outer"
          },
          {
            property: "decorate",
            title: "Glyph decoration",
            description: 'Add a fancy " quotation mark off the left side.',
            inputMethod: "boolean",
            icon: "editor:format-quote"
          }
        ],
        configure: [
          {
            slot: "",
            title: "Quote",
            description: "Quoted text",
            inputMethod: "textfield",
            icon: "editor:format-quote",
            required: true,
            validationType: "text"
          },
          {
            property: "citation",
            title: "Citation",
            description: "",
            inputMethod: "textfield",
            icon: "editor:short-text",
            required: false,
            validationType: "text"
          },
          {
            property: "outset",
            title: "Outset",
            description: "Should this expand beyond it's container by design?",
            inputMethod: "boolean",
            icon: "editor:border-outer"
          },
          {
            property: "decorate",
            title: "Glyph decoration",
            description: 'Add a fancy " quotation mark off the left side.',
            inputMethod: "boolean",
            icon: "editor:format-quote"
          },
          {
            property: "colorCode",
            title: "Background color",
            description: "Select the background color for the quote.",
            inputMethod: "colorpicker",
            icon: "editor:format-color-fill"
          },
          {
            property: "depth",
            title: "Shadow depth",
            description: "Select the background color for the quote.",
            inputMethod: "select",
            icon: "maps:layers",
            options: {
              "0": "none",
              "1": "Level 1",
              "2": "Level 2",
              "3": "Level 3",
              "4": "Level 4",
              "5": "Level 5"
            }
          }
        ],
        advanced: []
      }
    };
    this.setHaxProperties(props);
  },

  /**
   * Notice background color has changed.
   */
  _bgColorChanged: function(newValue, oldValue) {
    if (typeof newValue !== typeof undefined && newValue != null) {
      // sees if there's enough contrast and adjusts them accordingly
      this.computeTextPropContrast("textColorCode", "colorCode");
    }
  },

  /**
   * Make class from color value
   */
  _computeColorClass: function(color) {
    if (color != null && color.toLowerCase() == "#ffffff") {
      return "white-text";
    } else if (color != null && color == "#000000") {
      return "black-text";
    } else if (color != null && color.substring(0, 1) == "#") {
      return this._colorTransform(color.toLowerCase(), "", "");
    }
  },

  /**
   * Generate a class based on the options provided
   */
  generateClass: function(decorate, outset, color, textColor) {
    var returnClass = "";
    if (decorate) {
      returnClass += " decorate";
    }
    if (outset) {
      returnClass += " outset";
    }
    // let's support mixing in our colors
    returnClass += " " + textColor + " " + color;
    return returnClass;
  }
});
export { LrndesignBlockquote };
