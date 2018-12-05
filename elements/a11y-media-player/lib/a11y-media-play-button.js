/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { A11yMediaPlayerProperties } from "./a11y-media-player-properties.js";
import "@polymer/paper-tooltip/paper-tooltip.js";

export { A11yMediaPlayButton };
/**
 * `a11y-media-play-button`
 * `A giant play button that overlays the media in a11y-media-player.`
 *
 * @microcopy - language worth noting:
```<a11y-media-play-button
  playing$="[[__playing]]"            // Is the media currently playing?
  thumbnail-css$="[[thumbnailCSS]]"   // Optional source for a thumbnail image
</a11y-media-play-button>

Custom styles:
--a11y-play-button-bg-color: overlay background color, default is #000000
--a11y-play-button-focus-bg-color: overlay background color, default is --a11y-play-button-bg-color```
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class A11yMediaPlayButton extends A11yMediaPlayerProperties {
  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * label for play button on player controls
       */
      label: {
        type: String,
        computed: "_getPlaying(playing,pauseLabel,playLabel)"
      },
      /**
       * label when playing
       */
      pauseLabel: {
        type: String,
        value: "play"
      },
      /**
       * label when paused
       */
      playLabel: {
        type: String,
        value: "play"
      },
      /**
       * is button disabled
       */
      disabled: {
        type: Boolean,
        value: false
      },
      /**
       * is media playing
       */
      playing: {
        type: Boolean,
        value: false
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "a11y-media-play-button";
  }

  //get player-specifc properties
  static get behaviors() {
    return [A11yMediaPlayerProperties];
  }

  //render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          z-index: 2;
          opacity: 1;
          transition: opacity 0.5s;
          position: absolute;
          height: 100%;
        }
        :host([disabled]:not([audio-only])),
        :host([playing]:not([audio-only])) {
          opacity: 0;
        }
        :host,
        :host #thumbnail,
        :host #background,
        :host #button {
          width: 100%;
          max-height: 80vh;
          top: 0;
          left: 0;
          opacity: 1;
          transition: opacity 0.5s;
        }
        :host #thumbnail,
        :host #background,
        :host #button {
          position: absolute;
          height: 100%;
          padding: 0;
          margin: 0;
          border: none;
        }
        :host([audio-only][thumbnail-src][playing]) #button > *:not(#thumbnail),
        :host([audio-only][thumbnail-src][disabled])
          #button
          > *:not(#thumbnail) {
          opacity: 0;
        }
        :host #thumbnail {
          height: auto;
          overflow: hidden;
        }
        :host #button {
          overflow: hidden;
          background: transparent;
        }
        :host #button:hover {
          cursor: pointer;
        }
        :host #background {
          opacity: 0.3;
          background: var(--a11y-play-button-bg-color);
        }
        :host #button:focus #background,
        :host #button:hover #background {
          background: var(--a11y-play-button-focus-bg-color);
          opacity: 0.1;
        }
        :host #arrow {
          stroke: #ffffff;
          fill: #000000;
        }
        :host #text {
          fill: #ffffff;
        }
        :host .sr-only {
          font-size: 0;
        }
        @media print {
          :host(:not([thumbnail-src])),
          :host #background,
          :host #svg {
            display: none;
          }
        }
      </style>
      <button
        id="button"
        aria-pressed$="[[playing]]"
        aria-hidden$="[[disabled]]"
        tabindex="0"
        disabled$="[[disabled]]"
        controls="video"
        on-tap="_buttonTap"
        title$="[[label]]"
      >
        <div id="background"></div>
        <svg
          id="svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 200"
          width="30%"
          height="30%"
          opacity="0.7"
        >
          <g>
            <polygon
              id="arrow"
              points="30,20 30,180 170,100"
              fill="#000000"
              stroke="#ffffff"
              stroke-width="15px"
            ></polygon>
            <text
              id="text"
              class="sr-only"
              x="50"
              y="115"
              fill="#ffffff"
              font-size="30px"
            >
              [[label]]
            </text>
          </g>
        </svg>
      </button>
    `;
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.$.text.innerText = this.playLabel;
    if (this.audioOnly) {
      let root = this,
        img = this.$.thumbnail,
        check = setInterval(function() {
          if (img.naturalWidth) {
            clearInterval(check);
            let aspect = (img.naturalHeight / img.naturalWidth) * 100;
            root.style.height = aspect + "%";
            root.dispatchEvent(
              new CustomEvent("thumbnail-aspect", { detail: aspect })
            );
          }
        }, 10);
    }
  }

  /**
   * sets target for a11y keys
   */
  ready() {
    super.ready();
    this.__target = this.$.button;
  }

  /**
   * get label based on whether or not the video is playing
   */
  _getPlaying(playing, pauseLabel, playLabel) {
    return playing ? pauseLabel : playLabel;
  }

  /**
   * handle button tap
   */
  _buttonTap() {
    let root = this;
    root.dispatchEvent(new CustomEvent("controls-change", { detail: this }));
  }
}
window.customElements.define(A11yMediaPlayButton.tag, A11yMediaPlayButton);
