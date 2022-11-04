/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css, svg } from "lit";
import { A11yMediaButton } from "./a11y-media-button.js";

/**
 * `a11y-media-play-button`
 * a giant play button that overlays the media in a11y-media-player.
```
Custom styles:
--a11y-play-button-bg-color: overlay background color, default is #000000
--a11y-play-button-focus-bg-color: overlay background color, default is --a11y-play-button-bg-color```
 *
 * @extends A11yMediaBehaviors
 * @element a11y-media-play-button
 */
class A11yMediaPlayButton extends A11yMediaButton {
  // properties available to the custom element for data binding
  constructor() {
    super();
    this.youtubeId = null;
  }
  /**
   * Store the tag name to make it easier to obtain directly.

   */
  static get tag() {
    return "a11y-media-play-button";
  }

  static get styles() {
    return [
      ...super.buttonStyles,
      css`
        :host {
          display: block;
          opacity: 1;
          transition: opacity 0.5s;
        }
        :host([action="pause"]) {
          opacity: 0;
        }
        :host,
        #button {
          width: 100%;
          top: 0;
          left: 0;
          opacity: 1;
          transition: opacity 0.5s;
        }
        #button {
          position: absolute;
          height: 100%;
          padding: 0;
          background: var(--a11y-play-button-bg-color);
        }
        #button:focus,
        #button:hover {
          background: var(--a11y-play-button-focus-bg-color);
          opacity: 0.2;
        }
        #arrow {
          stroke: #ffffff;
          fill: #000000;
        }
        #text {
          fill: #ffffff;
        }
        @media print {
          :host,
          #background,
          #svg {
            display: none;
          }
        }
      `,
    ];
  }
  static get properties() {
    return {
      ...super.properties,
      youtubeId: {
        attribute: "youtube-id",
        type: String,
      },
    };
  }

  //render function
  render() {
    return html`
      <button
        id="button"
        aria-hidden="${this.disabled ? "true" : "false"}"
        controls="video"
        aria-label="${this.label}"
        tabindex="0"
        @click="${this._buttonClick}"
        ?disabled="${this.disabled}"
      >
        ${this.youtubeId != "undefined" && this.youtubeId
          ? html`
              <svg
                id="svg"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 70 60"
                preserveAspectRatio="xMidYMid meet"
                focusable="false"
                width="30%"
                height="30%"
                opacity="0.5"
              >
                <g
                  viewBox="0 0 70 60"
                  preserveAspectRatio="xMidYMid meet"
                  class="style-scope ytd-topbar-logo-renderer"
                >
                  <g class="style-scope ytd-topbar-logo-renderer">
                    <path
                      fill="#FF0000"
                      d="M63,14.87c-0.72-2.7-2.85-4.83-5.56-5.56C52.54,8,32.88,8,32.88,8S13.23,8,8.32,9.31
            c-2.7,0.72-4.83,2.85-5.56,5.56C1.45,19.77,1.45,30,1.45,30s0,10.23,1.31,15.13c0.72,2.7,2.85,4.83,5.56,5.56
            C13.23,52,32.88,52,32.88,52s19.66,0,24.56-1.31c2.7-0.72,4.83-2.85,5.56-5.56C64.31,40.23,64.31,30,64.31,30
            S64.31,19.77,63,14.87z"
                      class="style-scope ytd-topbar-logo-renderer"
                    ></path>
                    <polygon
                      fill="#FFFFFF"
                      points="26.6,39.43 42.93,30 26.6,20.57"
                      class="style-scope ytd-topbar-logo-renderer"
                    ></polygon>
                  </g>
                </g>
              </svg>
            `
          : html`
              <svg
                id="svg"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 200 200"
                width="30%"
                height="30%"
                opacity="0.5"
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
                    ${this.label}
                  </text>
                </g>
              </svg>
            `}
      </button>
    `;
  }
}
customElements.define(A11yMediaPlayButton.tag, A11yMediaPlayButton);
export { A11yMediaPlayButton };
