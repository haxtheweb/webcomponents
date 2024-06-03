/**
 * Copyright 2024 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";

class ChatControlBar extends DDD {

  static get tag() {
    return "chat-control-bar";
  }

  constructor() {
    super();

    this._isFullView = false;
  }

  static get styles() {
    return [
      super.styles,
      css`
        /* https://oer.hax.psu.edu/bto108/sites/haxcellence/documentation/ddd */
        
        :host {
          display: block;
        }

        .chat-control-bar-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-0);
        }

      `
    ];
  }

  render() {
    return html`
      <!-- https://haxapi.vercel.app/?path=/story/media-icons--hax-iconset-story -->
      
      <div class="chat-control-bar-wrapper">
        <div class="left-side">
          <button id="download-button">
            <simple-icon-lite icon="icons:file-download"></simple-icon-lite> 
          </button>
          <button id="reset-button">
            <simple-icon-lite icon="icons:refresh"></simple-icon-lite>
          </button>
        </div>
        <div class="right-side">
          ${this._isFullView ? html`
            <button id="minimize-button">
              <simple-icon-lite icon="lrn:arrow-right"></simple-icon-lite>
            </button>
          ` : ''}
          <button id="view-button" @click=${this.handleViewButton}>
            <simple-icon-lite icon="${this._isFullView ? 'icons:fullscreen-exit' : 'icons:fullscreen'}"></simple-icon-lite>
          </button>
          <button id="close-button">
            <simple-icon-lite icon="icons:close"></simple-icon-lite> <!-- TODO might want to change to just be minimize button, since there shouldn't be a way to shut down AI without refreshing page -->
          </button>
        </div>
      </div>
    `;
  }

  handleViewButton() {
    this._isFullView = !this._isFullView;
  }

  static get properties() {
    return {
      ...super.properties,

      _isFullView: {
        type: Boolean,
        attribute: "full-view",
      },
    };
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(ChatControlBar.tag, ChatControlBar);
export { ChatControlBar };