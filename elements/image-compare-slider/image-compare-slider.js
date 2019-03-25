import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
import "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import "@polymer/iron-image/iron-image.js";
import "@polymer/paper-slider/paper-slider.js";
/**
 * `image-compare-slider`
 * Layers images over each other with a slider interface to compare them
 * @microcopy - the mental model for this element
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
let ImageCompareSlider = Polymer({
  _template: html`
    <style>
      :host {
        display: inline-flex;
        width: 100%;
        @apply --image-compare-slider;
      }
      :host > div,
      :host #container,
      :host #top {
        width: 100%;
      }
      :host #container {
        background-size: cover;
        overflow: visible;
        @apply --image-compare-slider-container;
      }
      :host #top {
        background-size: auto 100%;
        overflow: hidden;
      }
      :host #slider {
        width: calc(100% + 30px);
        margin-left: -15px;
        @apply --image-compare-slider-control;
      }
    </style>
    <div>
      <h2>[[title]]</h2>
      <div id="container" style$="background-image: url([[bottomSrc]]);">
        <div id="top" style$="background-image: url([[topSrc]]);"></div>
      </div>
      <paper-slider id="slider" value="50"></paper-slider>
      <div></div>
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
      type: String,
      observer: "_updateAspect"
    },
    /**
     * mode for the slider: wipe
     */
    opacity: {
      type: Boolean,
      value: false
    },
    /**
     * src for top image
     */
    bottomSrc: {
      type: String
    }
  },

  ready: function() {
    let root = this,
      slider = root.$.slider;
    root._updateAspect();
    root._slide();
    slider.addEventListener("immediate-value-changed", function(e) {
      root._slide();
    });
  },
  /**
   * updates the slider
   */
  _slide: function() {
    let root = this,
      slider = root.$.slider,
      top = root.$.top;
    if (this.opacity === false) {
      top.style.width = slider.immediateValue + "%";
    } else {
      top.style.opacity = slider.immediateValue / 100;
    }
  },
  /**
   * updates the aspect ratio
   */
  _updateAspect: function() {
    let root = this,
      img = document.createElement("img"),
      el = root.$.top,
      getAspect = img => {
        el.style.paddingTop = (img.height * 100) / img.width + "%";
      };
    root.__aspect = "75";
    img.setAttribute("src", root.topSrc);
    if (img.height !== undefined && img.height > 0) {
      getAspect(img);
    } else {
      img.addEventListener("load", function() {
        getAspect(img);
      });
    }
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
          },
          {
            property: "opacity",
            title: "Slider Behavior",
            description:
              "Do you want the slider to wipe the top image across the bottom one (default), or to adjust the opacity of the top image?",
            inputMethod: "select",
            options: {
              false: "wipe across",
              true: "adjust opacity"
            },
            icon: "image:compare"
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
