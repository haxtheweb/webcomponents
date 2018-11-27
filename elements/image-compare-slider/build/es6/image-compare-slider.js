import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import "./node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
import "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import "./node_modules/@polymer/iron-image/iron-image.js";
import "./node_modules/@polymer/paper-slider/paper-slider.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
      :host .container {
        position: relative;
      }
      :host .container > * {
        left: 0;
        position: absolute;
      }
      :host .container > div {
        top: 0;
        padding: 0;
      }
      :host #top {
        overflow-x: hidden;
      }
    </style>
    <h2>[[title]]</h2>
    <div class="container" style\$="[[styles.container]]">
      <div id="bottom"><iron-image src\$="[[bottomSrc]]" sizing\$="[[sizing]]" style\$="[[styles.image]]"></iron-image></div>
      <div id="top" style\$="[[styles.top]]"><iron-image src\$="[[topSrc]]" sizing\$="[[sizing]]" style\$="[[styles.image]]"></iron-image></div>
    </div>
    <paper-slider id="slider" value="50" class="max-width-no-padding" style\$="[[styles.slider]]"></paper-slider>
`,
  is: "image-compare-slider",
  behaviors: [
    HAXBehaviors.PropertiesBehaviors,
    MaterializeCSSBehaviors.ColorBehaviors,
    SchemaBehaviors.Schema
  ],
  observers: ["_setStyles(width,height,sliderPercent)"],
  properties: {
    title: { type: String },
    topSrc: { type: String },
    bottomSrc: { type: String },
    sizing: { type: String, value: "contain" },
    width: { type: Number, value: 400 },
    height: { type: Number, value: 300 },
    height: { type: Number, value: 300 },
    sliderPercent: { type: Number, value: 50 },
    styles: {
      type: Object,
      value: {
        image: "width: 400px; height: 300px;",
        slider: "width: 430px; margin: 0 -15px;",
        container: "width: 400px; margin-bottom: 315px;",
        top: "width: 50%;"
      }
    }
  },
  ready: function() {
    let root = this,
      slider = this.$.slider;
    slider.addEventListener("immediate-value-changed", function(e) {
      root.sliderPercent = slider.immediateValue;
    });
  },
  _setStyles: function(width, height, sliderPercent) {
    let w = this.width,
      h = this.height,
      sw = w + 30,
      cmb = h + 15;
    this.styles = {
      image: "width: " + w + "px; height: " + h + "px;",
      slider: "width: " + sw + "px; margin: 0 -15px;",
      container: "width: " + w + "px; margin-bottom: " + cmb + "px;",
      top: "width: " + this.sliderPercent + "%;"
    };
  },
  attached: function() {
    let props = {
      canScale: !0,
      canPosition: !0,
      canEditSource: !1,
      gizmo: {
        title: "Image comparison",
        description:
          "Simple element to allow one image to swipe over top of the other.",
        icon: "image:compare",
        color: "orange",
        groups: ["Image", "Media"],
        handles: [
          {
            type: "image",
            source: "bottomSrc",
            source2: "topSrc",
            title: "title"
          }
        ],
        meta: { author: "LRNWebComponents" }
      },
      settings: {
        quick: [
          {
            property: "title",
            title: "Title",
            description: "The title of the element",
            inputMethod: "textfield",
            icon: "editor:title"
          }
        ],
        configure: [
          {
            property: "title",
            title: "Title",
            description: "The title of the element",
            inputMethod: "textfield"
          },
          {
            property: "bottomSrc",
            title: "Bottom image",
            description: "The base image to swipe over",
            inputMethod: "textfield",
            validationType: "url"
          },
          {
            property: "topSrc",
            title: "Top image",
            description: "The top image that swipes over",
            inputMethod: "textfield",
            validationType: "url"
          }
        ],
        advanced: []
      }
    };
    this.setHaxProperties(props);
  }
});
