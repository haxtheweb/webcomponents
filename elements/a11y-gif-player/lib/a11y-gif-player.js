import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/iron-a11y-keys/iron-a11y-keys.js";
import "@polymer/iron-image/iron-image.js";
import "hax-body-behaviors/hax-body-behaviors.js";
import "schema-behaviors/schema-behaviors.js";
/**
 `a11y-gif-player`
 Play gifs in an accessible way by having the user click to play their animation.

@demo demo/index.html

@microcopy - the mental model for this element
 -

*/
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
      :host #gifbutton > * {
        position: relative;
      }
      :host #svg {
        position: absolute;
        top: 35%;
        left: 35%;
      }
      :host #gifbutton:active,
      :host #gifbutton:focus,
      :host #gifbutton:hover {
        cursor: pointer;
        outline: 1px solid blue;
      }
      :host #preload {
        display: none;
      }
    </style>
    <div id="gifbutton" aria-role="button" aria-controls="gif" tabindex="0">
      <div>
        <img id="gif" alt\$="[[alt]]" src\$="[[srcWithoutAnimation]]" style="width:100%;height:100%;">
        <svg id="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="30%" height="30%">
          <g opacity=".5">
            <polygon points="30,20 30,180 170,100" fill="#000000" stroke="#ffffff" stroke-width="15px"></polygon>
            <text x="50" y="115" fill="#ffffff" font-size="40px">GIF</text>
          </g>
        </svg>
      </div>
    </div>
    <iron-image id="preload" src\$="[[src]]" hidden=""></iron-image>
    <iron-a11y-keys id="a11y" keys="enter space" on-keys-pressed="toggleAnimation"></iron-a11y-keys>
`,

  is: "a11y-gif-player",
  behaviors: [HAXBehaviors.PropertiesBehaviors, SchemaBehaviors.Schema],

  listeners: {
    "gifbutton.tap": "toggleAnimation"
  },

  properties: {
    /**
     * Source of the animated gif
     */
    src: {
      type: String,
      value: null
    },
    /**
     * Source of a version that is not animated
     */
    srcWithoutAnimation: {
      type: String,
      value: null
    },
    /**
     * Alt text of the gif
     */
    alt: {
      type: String,
      value: null
    }
  },

  /**
   * Ready life cycle
   */
  ready: function() {
    this.stop();
    this.$.a11y.target = this.$.gifbutton;
  },

  /**
   * plays the animation regarless of previous state
   */
  play: function() {
    this.__stopped = true;
    this.toggleAnimation();
  },

  /**
   * stops the animation regarless of previous state
   */
  stop: function() {
    this.__stopped = false;
    this.toggleAnimation();
  },

  /**
   * toggles the animation based on current state
   */
  toggleAnimation: function() {
    if (this.__stopped) {
      this.__stopped = false;
      this.$.svg.style.visibility = "hidden";
      if (this.src != null) {
        this.$.gif.src = this.src;
      }
      this.$.gif.alt = this.alt + " (Stop animation.)";
    } else {
      this.__stopped = true;
      this.$.svg.style.visibility = "visible";
      if (this.srcWithoutAnimation != null) {
        this.$.gif.src = this.srcWithoutAnimation;
      }
      this.$.gif.alt = this.alt + " (Play animation.)";
    }
  },

  /**
   * wire it for hax-body
   */
  attached: function() {
    // Establish hax properties if they exist
    let props = {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Accessible GIF",
        description: "Makes animated GIFs accessible.",
        icon: "gif",
        color: "grey",
        groups: ["Images", "Media"],
        handles: [
          {
            type: "image",
            source: "src",
            source2: "srcWithoutAnimation",
            alt: "alt"
          }
        ],
        meta: {
          author: "LRNWebComponents"
        }
      },
      settings: {
        quick: [
          {
            property: "src",
            title: "Animated GIF",
            description: "The URL to your animated GIF.",
            inputMethod: "textfield",
            icon: "link",
            validationType: "url",
            required: true
          },
          {
            property: "srcWithoutAnimation",
            title: "Still Image",
            description: "The URL to a still image version of your GIF.",
            inputMethod: "textfield",
            icon: "link",
            validationType: "url",
            required: true
          },
          {
            property: "alt",
            title: "Alt Text",
            description: "Alternative text for the image.",
            inputMethod: "textfield",
            icon: "accessibility",
            required: true
          }
        ],
        configure: [
          {
            property: "src",
            title: "Animated GIF",
            description: "The URL to your animated GIF.",
            inputMethod: "textfield",
            icon: "link",
            validationType: "url",
            required: true
          },
          {
            property: "srcWithoutAnimation",
            title: "Still Image",
            description: "The URL to a still image version of your GIF.",
            inputMethod: "textfield",
            icon: "link",
            validationType: "url",
            required: true
          },
          {
            property: "alt",
            title: "Alt Text",
            description: "Alternative text for the image.",
            inputMethod: "textfield",
            icon: "accessibility",
            required: true
          }
        ],
        advanced: []
      }
    };
    this.setHaxProperties(props);
  }
});
