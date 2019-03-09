import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
import "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import "@polymer/iron-image/iron-image.js";
import "@polymer/paper-slider/paper-slider.js";
/**
`image-compare-slider`
Layers images over each other with a slider interface to compare them

* @demo demo/index.html

@microcopy - the mental model for this element
 -
 -

*/
let ImageCompareSlider = Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
      :host #container {
        overflow: visible;
      }
      :host #container,
      :host #images,
      :host #bottom,
      :host #slider {
        width: 100%;
      }
      :host #container,
      :host #images {
        display: flex;
        flex-direction: column;
        align-items: stretch;
      }
      :host #images {
        position: relative;
      }
      :host #images > * {
        left: 0;
        position: absolute;
        width: 100%;
      }
      :host #images > div {
        top: 0;
        padding: 0;
      }
      :host #top {
        overflow-x: hidden;
      }
      :host #slider {
        width: calc(100% - 30px);
      }
    </style>
    <h2>[[title]]</h2>
    <div id="container">
      <div id="images" style$="padding-top: [[__imgAspect]]%;">
        <div id="bottom">
          <img id="bottomImg" src$="[[bottomSrc]]" />
        </div>
        <div id="top" style$="width: [[sliderPercent]]%;">
          <img id="topImg" src$="[[topSrc]]" />
        </div>
      </div>
      <paper-slider id="slider" value="50"></paper-slider>
    </div>
  `,

  is: "image-compare-slider",
  behaviors: [
    HAXBehaviors.PropertiesBehaviors,
    MaterializeCSSBehaviors.ColorBehaviors,
    SchemaBehaviors.Schema
  ],
  observers: ["_setStyles(width,height,sliderPercent)"],

  properties: {
    /**
     * Title
     */
    title: {
      type: String
    },
    /**
     * src for top image
     */
    topSrc: {
      type: String
    },
    /**
     * src for top image
     */
    bottomSrc: {
      type: String
    },
    /**
     * crop or contain
     */
    sizing: {
      type: String,
      value: "contain"
    },
    /**
     * percent position of slider
     */
    sliderPercent: {
      type: Number,
      value: 50
    },
    /**
     * aspect ratio of bottom image
     */
    __imgAspect: {
      type: Number,
      computed: "_getImageAspect(topSrc)"
    }
  },

  ready: function() {
    let root = this,
      slider = this.$.slider;
    slider.addEventListener("immediate-value-changed", function(e) {
      root.sliderPercent = slider.immediateValue;
    });
  },

  /**
   * Gets bottom image aspect ratio
   * @param {string} the source for the bottom image (needed only to detect changes)
   * @returns {number} aspect ratio, as percent
   */
  _getImageAspect: function(topSrc) {
    let img = this.$.bottomImg;
    return (img.height * 100) / img.width;
  },

  /**
   * Attached to the DOM, now fire.
   */
  attached: function() {
    // Establish hax property binding
    let props = {
      canScale: true,
      canPosition: true,
      canEditSource: false,
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
        meta: {
          author: "LRNWebComponents"
        }
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
export { ImageCompareSlider };
