/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import "@polymer/iron-a11y-keys/iron-a11y-keys.js";
/**
 * `a11y-gif-player`
 * `Play gifs in an accessible way by having the user click to play their animation`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class A11yGifPlayer extends SchemaBehaviors(PolymerElement) {
  constructor() {
    super();
    import("@polymer/iron-image/iron-image.js");
  }
  static get template() {
    return html`
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
          <img
            id="gif"
            alt\$="[[alt]]"
            src\$="[[srcWithoutAnimation]]"
            style="width:100%;height:100%;"
          />
          <svg
            id="svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 200"
            width="30%"
            height="30%"
          >
            <g opacity=".5">
              <polygon
                points="30,20 30,180 170,100"
                fill="#000000"
                stroke="#ffffff"
                stroke-width="15px"
              ></polygon>
              <text x="50" y="115" fill="#ffffff" font-size="40px">GIF</text>
            </g>
          </svg>
        </div>
      </div>
      <iron-image id="preload" src\$="[[src]]" hidden=""></iron-image>
      <iron-a11y-keys
        id="a11y"
        keys="enter space"
        on-keys-pressed="toggleAnimation"
      ></iron-a11y-keys>
    `;
  }
  static get tag() {
    return "a11y-gif-player";
  }
  static get properties() {
    let props = {
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
    };
    if (super.properties) {
      props = Object.assign(props, super.properties);
    }
    return props;
  }
  connectedCallback() {
    super.connectedCallback();
    afterNextRender(this, function() {
      this.addEventListener("click", this.toggleAnimation.bind(this));
    });
  }
  disconnectedCallback() {
    this.removeEventListener("click", this.toggleAnimation.bind(this));
    super.disconnectedCallback();
  }
  /**
   * Ready life cycle
   */
  ready() {
    super.ready();
    this.stop();
    this.shadowRoot.querySelector(
      "#a11y"
    ).target = this.shadowRoot.querySelector("#gifbutton");
  }
  /**
   * plays the animation regarless of previous state
   */
  play() {
    this.__stopped = true;
    this.toggleAnimation();
  }
  /**
   * stops the animation regarless of previous state
   */
  stop() {
    this.__stopped = false;
    this.toggleAnimation();
  }
  /**
   * toggles the animation based on current state
   */
  toggleAnimation() {
    if (this.__stopped) {
      this.__stopped = false;
      this.shadowRoot.querySelector("#svg").style.visibility = "hidden";
      if (this.src != null) {
        this.shadowRoot.querySelector("#gif").src = this.src;
      }
      this.shadowRoot.querySelector("#gif").alt =
        this.alt + " (Stop animation.)";
    } else {
      this.__stopped = true;
      this.shadowRoot.querySelector("#svg").style.visibility = "visible";
      if (this.srcWithoutAnimation != null) {
        this.shadowRoot.querySelector("#gif").src = this.srcWithoutAnimation;
      }
      this.shadowRoot.querySelector("#gif").alt =
        this.alt + " (Play animation.)";
    }
  }

  static get haxProperties() {
    return {
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
            inputMethod: "haxupload",
            icon: "link",
            validationType: "url",
            required: true
          },
          {
            property: "srcWithoutAnimation",
            title: "Still Image",
            description: "The URL to a still image version of your GIF.",
            inputMethod: "haxupload",
            icon: "link",
            validationType: "url",
            required: true
          },
          {
            property: "alt",
            title: "Alt Text",
            description: "Alternative text for the image.",
            inputMethod: "alt",
            icon: "accessibility",
            required: true
          }
        ],
        advanced: []
      }
    };
  }
}
window.customElements.define(A11yGifPlayer.tag, A11yGifPlayer);
export { A11yGifPlayer };
