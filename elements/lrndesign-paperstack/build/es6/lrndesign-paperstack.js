import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import "./node_modules/@polymer/iron-icon/iron-icon.js";
import "./node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
import "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "./node_modules/@lrnwebcomponents/a11y-behaviors/a11y-behaviors.js";
import "./node_modules/@lrnwebcomponents/lrn-icons/lrn-icons.js";
Polymer({
  _template: html`
    <style include="materializecss-styles"></style>
    <style>
      :host {
        display: block;
      }

      h1, h2, h3, h4, h5, h6 {
        margin: 0;
      }
      /* Example card */

      .egletter p {
        position: relative;
        z-index: 3;
        line-height: 1.5rem;
      }

      .egletter ul {
        position: relative;
        z-index: 3;
        line-height: 1.5rem;
      }

      .egletter h2,
      .egletter h3,
      .egletter h4,
      .egletter h5,
      .egletter h6 {
        font-family: cursive;
        margin: 0 auto;
        position: relative;
        z-index: 3;
        line-height: 4em;
      }

      iron-icon {
        font-size: 1em;
        height: 2em;
        width: 2em;
        margin: -1.1em 0 0 .5em;
      }

      .icon-container {
        float: left;
        width: 3em;
        height: 3em;
        margin-right: .5em;
      }

      .egletter h2 span,
      .egletter h3 span,
      .egletter h4 span,
      .egletter h5 span,
      .egletter h6 span {
        line-height: 3em;
      }

      .egletter {
        min-height: 10rem;
        padding: .75rem 1.5rem;
        position: relative;
        width: 80%;
        z-index: 4;
        margin-bottom: 3rem;
      }

      .egletter:before,
      .egletter:after {
        content: "";
        height: 98%;
        position: absolute;
        width: 100%;
        z-index: 2;
      }

      .egletter:before {
        background: #fafafa;
        box-shadow: 0 0 .5rem rgba(0, 0, 0, 0.2);
        left: -.2rem;
        top: .2rem;
        transform: rotate(-2.5deg);
      }

      .egletter:after {
        background: #ffffff;
        box-shadow: 0 0 .2rem rgba(0, 0, 0, 0.2);
        right: -.2rem;
        top: .1rem;
        transform: rotate(1.4deg);
      }
    </style>
    <div class="egletter">
      <h4>
        <div class\$="icon-container circle [[color]]">
          <iron-icon icon="[[icon]]" class\$="[[textColor]]"></iron-icon>
        </div>
        <span>[[title]]</span>
      </h4>
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
    title: { type: String, value: "Title" },
    icon: { type: String, value: "lrn:assignment" },
    colorCode: { type: String, value: "#000000", observer: "_colorCodeChange" },
    color: { type: String, computed: '_computeColorClass(colorCode, "bg")' },
    textCodeColor: { type: String, value: "#ffffff" },
    textColor: { type: String, computed: "_computeColorClass(textCodeColor)" }
  },
  attached: function() {
    this.setHaxProperties({
      canScale: !0,
      canPosition: !0,
      canEditSource: !1,
      gizmo: {
        title: "Paper stack",
        description: "A stack of papers",
        icon: "icons:content-copy",
        color: "grey",
        groups: ["Video", "Media"],
        handles: [],
        meta: { author: "LRNWebComponents" }
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
    });
  },
  _computeColorClass: function(color, bg) {
    if (null != color && "#ffffff" == color.toLowerCase()) {
      if ("bg" == bg) {
        return "white";
      }
      return "white-text";
    } else if (null != color && "#000000" == color) {
      if ("bg" == bg) {
        return "black";
      }
      return "black-text";
    } else if (null != color && "#" == color.substring(0, 1)) {
      return this._colorTransform(color.toLowerCase(), "", "");
    }
  },
  _colorCodeChange: function(newValue) {
    if (typeof newValue !== typeof void 0 && null != newValue) {
      this.computeTextPropContrast("textCodeColor", "colorCode");
    }
  }
});
