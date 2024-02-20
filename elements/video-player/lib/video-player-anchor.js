import { html, css } from "lit";
import { DDD } from "@lrnwebcomponents/d-d-d/d-d-d.js";

export class VideoPlayerAnchor extends DDD {
  constructor() {
    super();
    this.timestamp = null;
    this.videoid = null;
  }

  static get properties() {
    return {
      timestamp: { type: String },
      videoid: { type: String },
    }
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: inline-block;
        }
      `
    ]
  }

  clickHandler() {
    // verify video exists in global document light dom. big assumption
    if (globalThis.document.querySelector(`#${this.videoid}`)) {
      const video = globalThis.document.querySelector(`#${this.videoid}`);
      video.scrollIntoView();
      setTimeout(() => {
        video.shadowRoot.querySelector('a11y-media-player').play();
        setTimeout(() => {
          video.querySelector('a11y-media-player').seek(this.timestamp);        
        }, 300);
      }, 300);
    }
  }

  render() {
    return html`<mark @click="${this.clickHandler}"><simple-icon-lite icon="av:video-library"></simple-icon-lite><slot></slot></mark>`
  }
  static get tag() {
    return "video-player-anchor";
  }

  static get haxProperties() {
    return new URL(`./${this.tag}.haxProperties.json`, import.meta.url).href;
  }
}

globalThis.customElements.define(VideoPlayerAnchor.tag, VideoPlayerAnchor);