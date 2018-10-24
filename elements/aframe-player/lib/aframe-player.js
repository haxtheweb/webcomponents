import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import "./aframe-aframe.js";
/*<link rel="import" href="aframe-arjs.html">*/
/**
`aframe-player`
A LRN element

@demo demo/index.html
*/
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        position: relative;
      }
    </style>
    <a-scene id="scene" class="embedded" embedded="" arjs\$="[[ar]]" style\$="height:[[height]];width:[[width]];">
      <a-sky color\$="[[skyColor]]"></a-sky>
      <a-marker-camera preset="hiro"></a-marker-camera>
      <a-entity id="entity" gltf-model\$="[[source]]" position="0 0 0"></a-entity>
    </a-scene>
`,

  is: "aframe-player",
  behaviors: [HAXBehaviors.PropertiesBehaviors, SchemaBehaviors.Schema],

  properties: {
    /**
     * Source to reference for the 3D object
     */
    source: {
      type: String,
      value: ""
    },
    /**
     * height of the element
     */
    height: {
      type: String,
      value: "480px"
    },
    /**
     * width of the element
     */
    width: {
      type: String,
      value: "640px"
    },
    /**
     * Color of the sky / background.
     */
    skyColor: {
      type: String,
      value: "#DCDCDC"
    },
    /**
     * If this is for augmented reality or not.
     */
    ar: {
      type: Boolean,
      value: false
    },
    /**
     * x position for the AR element.
     */
    x: {
      type: String,
      value: "0"
    },
    /**
     * y position for the AR element.
     */
    y: {
      type: String,
      value: "0"
    },
    /**
     * z position for the AR element.
     */
    z: {
      type: String,
      value: "0"
    },
    /**
     * Generate a position object when coordinates change.
     */
    position: {
      type: Object,
      computed: "_computePosition(x, y, z, width, height)",
      observer: "_positionChanged"
    }
  },

  /**
   * Attached.
   */
  attached: function() {
    // ensure that this doesn't put full screen styles on the page!
    this.$.scene.removeFullScreenStyles();
    let props = {
      canScale: false,
      canPosition: false,
      canEditSource: false,
      gizmo: {
        title: "3D player",
        description: "A 3D file / augmented reality player.",
        icon: "av:play-circle-filled",
        color: "amber",
        groups: ["3D", "Augmented reality"],
        handles: [
          {
            type: "3d",
            source: "source"
          }
        ],
        meta: {
          author: "LRNWebComponents"
        }
      },
      settings: {
        quick: [
          {
            property: "height",
            title: "height",
            description: "height of the object",
            inputMethod: "textfield",
            type: "bar",
            icon: "image:photo-size-select-small",
            required: true
          },
          {
            property: "width",
            title: "Width",
            description: "Width of the object",
            inputMethod: "textfield",
            type: "bar",
            icon: "image:straighten",
            required: true
          }
        ],
        configure: [
          {
            property: "source",
            title: "Source",
            description: "The URL for this AR file.",
            inputMethod: "textfield",
            type: "bar",
            icon: "link",
            required: true
          },
          {
            property: "x",
            title: "X",
            description: "X position of the element in AR.",
            inputMethod: "textfield",
            type: "bar",
            icon: "communication:location-on",
            required: true
          },
          {
            property: "y",
            title: "Y",
            description: "Y position of the element in AR.",
            inputMethod: "textfield",
            type: "bar",
            icon: "communication:location-on",
            required: true
          },
          {
            property: "z",
            title: "Z",
            description: "Z position of the element in AR.",
            inputMethod: "textfield",
            type: "bar",
            icon: "communication:location-on",
            required: true
          },
          {
            property: "skyColor",
            title: "Sky color",
            description: "Select the color of the sky in the scene.",
            inputMethod: "colorpicker",
            type: "bar",
            icon: "editor:format-color-fill"
          }
        ],
        advanced: []
      }
    };
    this.setHaxProperties(props);
  },

  /**
   * Generate position object based on format a-frame expects.
   */
  _computePosition: function(x, y, z, width, height) {
    return {
      x: x,
      y: y,
      z: z
    };
  },

  /**
   * When position is updated, inject this into a-frame tag.
   */
  _positionChanged: function(position) {
    this.$.entity.setAttribute("position", position);
  }
});
