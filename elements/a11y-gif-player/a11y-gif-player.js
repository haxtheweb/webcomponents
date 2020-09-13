/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import { A11yDetails } from "@lrnwebcomponents/a11y-details/a11y-details.js";

/**
 * `a11y-gif-player`
 * plays gifs in an accessible way by having the user click to play their animation
### Styling

`<a11y-gif-player>` provides the following custom properties
for styling:

Custom property | Description | Default
----------------|-------------|----------
`--a11y-gif-player-border` | border around player/button | none
`--a11y-gif-player-border-radius` | border-radius for player/button | 0
`--a11y-gif-player-focus-border` | border-radius for player/button when hovered or focused | none
`--a11y-gif-player-cursor` | cursor for player/button when hovered or focused | pointer
`--a11y-gif-player-outline` | outline for player/button when hovered or focused | 
`--a11y-gif-player-disabled-cursor` | cursor for player/button when disabled | not-allowed
`--a11y-gif-player-arrow-size` | arrow icon size | 30%
`--a11y-gif-player-arrow-opacity` | default arrow icon opacity | 0.5
`--a11y-gif-player-button-focus-opacity` | arrow icon opacity when hovered or focused | 0.7
`--a11y-gif-player-button-color` | arrow icon color | #000000
`--a11y-gif-player-arrow-border-color` | arrow icon border color | #ffffff
`--a11y-gif-player-arrow-border-width` | arrow icon border width | 15px
`--a11y-gif-player-button-text-color` | arrow icon text color | #ffffff
`--a11y-gif-player-button-bg` | button background color when no static image | #cccccc
 *
 * @demo ./demo/index.html
 * @element a11y-gif-player
 */
class A11yGifPlayer extends SchemaBehaviors(LitElement) {
  constructor() {
    super();
    this.alt = null;
    this.disabled = false;
    this.src = null;
    this.tooltip = "Toggle animation";
    this.tooltipPlaying = null;
    this.srcWithoutAnimation = null;
    this.__playing = false;
    import("@lrnwebcomponents/simple-tooltip/simple-tooltip.js");
    import("@polymer/iron-image/iron-image.js");
  }
  /**
   * LitElement render styles
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        :host([hidden]) {
          display: none;
        }
        .sr-only {
          position: absolute;
          left: -9999999px;
          top: 0;
          width: 0;
          overflow: hidden;
        }
        #container {
          padding: 0;
          margin: 0;
          position: relative;
          width: min-content;
          border: var(--a11y-gif-player-border, none);
          border-radius: var(--a11y-gif-player-border-radius, 0);
        }
        button {
          position: absolute;
          width: 100%;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background-size: contain;
          background-color: var(--a11y-gif-player-button-bg, #cccccc);
        }
        button:active,
        button:focus,
        button:hover {
          border: var(--a11y-gif-player-focus-border, none);
          outline: var(--a11y-gif-player-outline, 3px solid);
        }
        button[disabled] {
          cursor: var(--a11y-gif-player-disabled-cursor, not-allowed);
        }
        button[aria-pressed="true"] {
          opacity: 0;
        }
        svg {
          position: absolute;
          top: 35%;
          left: 35%;
          width: var(--a11y-gif-player-arrow-size, 30%);
          height: var(--a11y-gif-player-arrow-size, 30%);
        }
        g {
          opacity: var(--a11y-gif-player-arrow-opacity, 0.5);
        }
        button:not([disabled]):active g,
        button:not([disabled]):hover g,
        button:not([disabled]):focus g {
          opacity: var(--a11y-gif-player-button-focus-opacity, 0.7);
        }
        polygon {
          fill: var(--a11y-gif-player-button-color, #000000);
          stroke: var(--a11y-gif-player-arrow-border-color, #ffffff);
          stroke-width: var(--a11y-gif-player-arrow-border-width, 15px);
        }
        text {
          fill: var(--a11y-gif-player-button-text-color, #ffffff);
        }
        #longdesc {
          position: absolute;
          left: 2px;
          bottom: 2px;
          width: calc(100% - 2px);
          font-size: 80%;
        }
        simple-tooltip {
          --simple-tooltip-background: #000000;
          --simple-tooltip-opacity: 1;
          --simple-tooltip-text-color: #ffffff;
          --simple-tooltip-delay-in: 0;
        }
      `,
    ];
  }
  render() {
    return html`
      <div id="container">
        <iron-image
          id="gif"
          src="${this.src}"
          alt="${this.alt}"
          aria-describedby="${this.longdesc ? "longdesc" : ""} ${(
            this.describedBy || ""
          ).trim()}"
          ?hidden="${!this.src}"
          slot="summary"
        >
        </iron-image>
        <button
          id="button"
          aria-controls="gif"
          aria-pressed="${this.__playing ? "true" : "false"}"
          @click="${this.toggle}"
          ?disabled="${this.disabled || !this.src}"
          style="background-image: url('${this.srcWithoutAnimation}')"
        >
          <svg
            id="svg"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 200"
          >
            <g>
              <polygon points="30,20 30,180 170,100"></polygon>
              <text x="50" y="115" font-size="40px">GIF</text>
            </g>
          </svg>
          <span class="sr-only">
            ${this.__playing && this.tooltipPlaying
              ? this.tooltipPlaying
              : this.tooltip}
          </span>
        </button>
        <a11y-details
          id="longdesc"
          ?hidden="${!this.src || !this.longdesc}"
          style="opacity:${this.__playing ? 0 : 1}"
        >
          <div slot="summary">info</div>
          <div slot="details">${this.longdesc}</div>
        </a11y-details>
      </div>
      <simple-tooltip for="button" offset="30" animation-delay="0">
        ${this.__playing && this.tooltipPlaying
          ? this.tooltipPlaying
          : this.tooltip}
      </simple-tooltip>
    `;
  }
  /**
   * Convention
   */
  static get tag() {
    return "a11y-gif-player";
  }
  /**
   * LitElement / popular convention
   */
  static get properties() {
    return {
      ...super.properties,
      /**
       * Alt text of gif
       */
      alt: {
        type: String,
      },
      /**
       * Whether button is disabled
       */
      disabled: {
        type: Boolean,
      },
      /*
       * other id's to add to aria-describedby
       */
      describedBy: {
        attribute: "described-by",
        type: String,
      },
      /**
       * longer image description for accesibility
       */
      longdesc: {
        type: String,
        attribute: "longdesc",
      },
      /**
       * Source of animated gif
       */
      src: {
        type: String,
      },
      /**
       * Source of static version of image
       */
      srcWithoutAnimation: {
        type: String,
        attribute: "src-without-animation",
      },
      /**
       * default tooltip
       */
      tooltip: {
        type: String,
      },
      /**
       * tooltip when playing
       */
      tooltipPlaying: {
        type: String,
        attribute: "tooltip-playing",
      },
      /**
       * whether GIF is playing
       */
      __playing: {
        type: Boolean,
      },
    };
  }
  /**
   * plays the animation regarless of previous state
   */
  play() {
    this.__playing = true;
  }
  /**
   * stops the animation regarless of previous state
   */
  stop() {
    this.__playing = false;
  }
  /**
   * toggles the animation based on current state
   */
  toggle() {
    if (this.__playing) {
      this.stop();
    } else {
      this.play();
    }
  }
  /**
   * deprecated. toggles the animation based on current state
   */
  toggleAnimation() {
    if (this.__playing) {
      this.stop();
    } else {
      this.play();
    }
  }
  /**
   * HAX
   */
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
            alt: "alt",
            ariaDescribedby: "describedBy",
          },
        ],
        meta: {
          author: "ELMS:LN",
        },
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
            required: true,
          },
          {
            property: "srcWithoutAnimation",
            title: "Still Image",
            description: "The URL to a still image version of your GIF.",
            inputMethod: "textfield",
            icon: "link",
            validationType: "url",
            required: true,
          },
          {
            property: "alt",
            title: "Alt Text",
            description: "Alternative text for the image.",
            inputMethod: "textfield",
            icon: "accessibility",
            required: true,
          },
        ],
        configure: [
          {
            property: "src",
            title: "Animated GIF",
            description: "The URL to your animated GIF.",
            inputMethod: "haxupload",
            icon: "link",
            validationType: "url",
            required: true,
          },
          {
            property: "srcWithoutAnimation",
            title: "Still Image",
            description: "The URL to a still image version of your GIF.",
            inputMethod: "haxupload",
            icon: "link",
            validationType: "url",
            required: true,
          },
          {
            property: "alt",
            title: "Alt Text",
            description: "Alternative text for the image.",
            inputMethod: "alt",
            icon: "accessibility",
            required: true,
          },
          {
            property: "longdesc",
            title: "Long Description",
            description: "Long descriptions of the GOF for accessibiility",
            inputMethod: "textarea",
          },
        ],
        advanced: [
          {
            property: "describedBy",
            title: "aria-decsribedby",
            description:
              "Space-separated id list for long descriptions that appear elsewhere",
            inputMethod: "textfield",
          },
        ],
      },
      demoSchema: [
        {
          tag: "a11y-gif-player",
          properties: {
            alt: "It's Always Sunny in Philadelphia Pepe Silvia Meme with GIFs",
            src: "https://media0.giphy.com/media/zHaPZZvl6cVHi/giphy.gif",
            srcWithoutAnimation:
              "https://media0.giphy.com/media/zHaPZZvl6cVHi/480w_s.jpg",
            longdesc:
              "Pepe Silvia scene from It's Always Sunny in Philadelphia. Jesus, dude, you're still making GIFs. The GIF's don't stop.",
            style: "max-width:400px",
          },
        },
      ],
    };
  }
}
window.customElements.define(A11yGifPlayer.tag, A11yGifPlayer);
export { A11yGifPlayer };
