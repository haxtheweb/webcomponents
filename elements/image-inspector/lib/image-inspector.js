import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/app-layout/app-layout.js";
import "img-pan-zoom/img-pan-zoom.js";
import "lrnsys-button/lrnsys-button.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/image-icons.js";
import "@lrnwebcomponents/materializecss-styles/colors.js";
/**
`image-inspector`
Zoom, Rotate, Mirror, Download, and View image

@demo demo/index.html
*/
Polymer({
  _template: html`
    <style include="materializecss-styles-colors">
       :host {
        display: block;
        --image-inspector-background: #dddddd;
      }

      app-toolbar {
        width: 90%;
        background: var(--image-inspector-background);
        margin: 2em auto;
        z-index: 1;
      }

      .top {
        top: 8em;
      }
    </style>
    <app-toolbar>
      <lrnsys-button alt="Zoom in" icon="zoom-in" on-tap="zoomIn" hover-class="[[hoverClass]]"></lrnsys-button>
      <lrnsys-button alt="Zoom out" icon="zoom-out" on-tap="zoomOut" hover-class="[[hoverClass]]"></lrnsys-button>
      <lrnsys-button alt="Rotate right" icon="image:rotate-right" on-tap="rotateRight" hover-class="[[hoverClass]]"></lrnsys-button>
      <lrnsys-button alt="Rotate left" icon="image:rotate-left" on-tap="rotateLeft" hover-class="[[hoverClass]]"></lrnsys-button>
      <lrnsys-button alt="Mirror image" icon="image:flip" on-tap="mirrorImage" hover-class="[[hoverClass]]"></lrnsys-button>
      <lrnsys-button alt="Open in new window" icon="launch" href="[[src]]" target="_blank" hover-class="[[hoverClass]]"></lrnsys-button>
      <slot name="toolbar"></slot>
    </app-toolbar>
    <img-pan-zoom id="img" src="[[src]]"></img-pan-zoom>
    <slot></slot>
`,

  is: "image-inspector",

  properties: {
    /**
     * Image rotation
     */
    degrees: {
      type: Number,
      value: 0,
      reflectToAttribute: true
    },
    /**
     * Image source.
     */
    src: {
      type: String,
      reflectToAttribute: true
    },
    /**
     * Hover class for button styling
     */
    hoverClass: {
      type: String,
      value: "blue white-text"
    }
  },

  /**
   * Rotate the image to the right.
   */
  rotateRight: function() {
    let img = this.$.img;
    // spin 90
    this.degrees += 90;
    img.style.transform = "rotate(" + this.degrees + "deg)";
    img.toggleClass("top");
  },

  /**
   * Rotate the image to the left.
   */
  rotateLeft: function() {
    let img = this.$.img;
    // go back 90
    this.degrees += -90;
    img.style.transform = "rotate(" + this.degrees + "deg)";
    img.toggleClass("top");
  },

  /**
   * Flip the image.
   */
  mirrorImage: function() {
    let img = this.$.img;
    if (img.style.transform === "scaleX(1)") {
      img.style.transform = "scaleX(-1)";
    } else {
      img.style.transform = "scaleX(1)";
    }
  },

  /**
   * Zoom in by calling  downstream function.
   */
  zoomIn: function() {
    this.$.img.zoomIn();
  },

  /**
   * Zoom out by calling downstream function.
   */
  zoomOut: function() {
    this.$.img.zoomOut();
  }
});
