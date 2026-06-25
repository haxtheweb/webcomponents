/**
 * Copyright 2024
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";

/**
 * `play-list-slide`
 * `lightweight wrapper for individual slides in a play-list carousel`
 * @element play-list-slide
 */
class PlayListSlide extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 0 0 100%;
          box-sizing: border-box;
          min-height: 0;
          overflow: hidden;
        }
        .slide-wrapper {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        ::slotted(img) {
          max-height: 100%;
          max-width: 100%;
          object-fit: contain;
        }
        ::slotted(video-player) {
          max-height: 100%;
          max-width: 100%;
        }
      `,
    ];
  }

  render() {
    return html` <div class="slide-wrapper"><slot></slot></div> `;
  }

  static get tag() {
    return "play-list-slide";
  }
}

globalThis.customElements.define(PlayListSlide.tag, PlayListSlide);
export { PlayListSlide };
