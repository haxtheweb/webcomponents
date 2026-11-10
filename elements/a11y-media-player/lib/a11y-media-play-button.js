/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
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
          transition: opacity var(--ddd-duration-slow, 0.6s);
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
          transition: opacity var(--ddd-duration-slow, 0.6s);
        }
        /* the whole picture stays the click target; the visible control is
           a round button in the middle, with nothing drawn over it */
        #button {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 0;
          cursor: pointer;
          background: var(--a11y-play-button-bg-color, transparent);
        }
        #button:focus,
        #button:hover {
          background: var(--a11y-play-button-focus-bg-color, transparent);
        }
        #svg {
          width: var(--a11y-play-button-size, var(--ddd-icon-lg, 56px));
          height: var(--a11y-play-button-size, var(--ddd-icon-lg, 56px));
          opacity: 0.85;
          transition: opacity 0.25s;
        }
        #button:focus #svg,
        #button:hover #svg {
          opacity: 1;
        }
        #circle {
          fill: light-dark(
            var(--ddd-theme-default-nittanyNavy, #001e44),
            var(--ddd-theme-default-potentialMidnight, #000321)
          );
          stroke: var(--ddd-theme-default-white, #ffffff);
        }
        #arrow {
          fill: var(--ddd-theme-default-white, #ffffff);
          stroke: none;
        }
        @media (prefers-reduced-motion: reduce) {
          :host,
          #button,
          #svg {
            transition: none;
          }
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
        tabindex="-1"
        @click="${this._buttonClick}"
        ?disabled="${this.disabled}"
      >
        ${
          this.youtubeId != "undefined" && this.youtubeId
            ? html`
                <svg
                  id="svg"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 70 60"
                  preserveAspectRatio="xMidYMid meet"
                  focusable="false"
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
                  focusable="false"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 100 100"
                >
                  <circle id="circle" cx="50" cy="50" r="46" stroke-width="4" />
                  <polygon id="arrow" points="40,30 40,70 72,50"></polygon>
                </svg>
              `
        }
      </button>
    `;
  }
}
globalThis.customElements.define(A11yMediaPlayButton.tag, A11yMediaPlayButton);
export { A11yMediaPlayButton };
