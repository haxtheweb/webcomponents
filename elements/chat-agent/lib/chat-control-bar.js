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
    this.developerModeEnabled = false;
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
          <button id="download-button" @click=${this.handleDownloadLogButton}>
            <simple-icon-lite icon="icons:file-download"></simple-icon-lite> 
          </button>
          <button id="reset-button" @click=${this.handleResetButton}>
            <simple-icon-lite icon="icons:refresh"></simple-icon-lite>
          </button>
        </div>
        <div class="right-side">
          <button id="view-button" @click=${this.handleViewButton}>
            <simple-icon-lite icon="${this._isFullView ? 'icons:fullscreen-exit' : 'icons:fullscreen'}"></simple-icon-lite>
          </button>
          <button id="hide-button" @click=${this.handleHideButton}>
            <simple-icon-lite icon="lrn:arrow-right"></simple-icon-lite> <!-- TODO might want to change to just be minimize button, since there shouldn't be a way to shut down AI without refreshing page -->
          </button>
        </div>
      </div>
    `;
  }

  /**
   * @description handles the functionality of the download button
   */
  handleDownloadLogButton() {
    if (this.developerModeEnabled) {
      console.info('HAX-DEV-MODE: Download log button pressed.');
    }

    this.downloadChatLog();
  }

  /**
   * @description handles the functionality of the reset button
   */
  handleResetButton() {
    if (this.developerModeEnabled) {
      console.info('HAX-DEV-MODE: Reset button pressed.');
    }

    //TODO prompts Merlin to pop up an alert asking if the user would like to download the chat log

    if (confirm('Would you like to download the chat log before you reset?')) {
      if(this.developerModeEnabled) {
        console.info('HAX-DEV-MODE: Download before reset confirmed.');
      }
      this.downloadChatLog();
    } else {
      if(this.developerModeEnabled) {
        console.info('HAX-DEV-MODE: Download before reset denied.');
      }
    }

    this.resetChat();
  }

  /**
   * @description Toggles the view of chat-interface to full or minimized
   */
  handleViewButton() {
    if (this.developerModeEnabled) {
      console.info('HAX-DEV-MODE: View switch button pressed.');
    }

    this._isFullView = !this._isFullView;

    if (this.developerModeEnabled) {
      console.info('HAX-DEV-MODE: View switched to: ' + (this._isFullView ? 'full' : 'minimized'));
    }
  }

  handleHideButton() {
    if (this.developerModeEnabled) {
      console.info('HAX-DEV-MODE: Hide button pressed.');
    }
  }

  /**
   * @description downloads the chat log
   */
  downloadChatLog() {
    if (this.developerModeEnabled) {
      console.info('HAX-DEV-MODE: downloadChatLog() called.');
    }
  }

  /**
   * @description resets the chat
   */
  resetChat() {
    if (this.developerModeEnabled) {
      console.info('HAX-DEV-MODE: resetChat() called.');
    }
  }

  static get properties() {
    return {
      ...super.properties,

      _isFullView: {
        type: Boolean,
        attribute: "full-view",
      },

      developerModeEnabled: {
        type: Boolean,
        attribute: "developer-mode",
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