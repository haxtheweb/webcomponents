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

    this.isFullView = false;
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
            <simple-icon-lite icon="${this.isFullView ? 'icons:fullscreen-exit' : 'icons:fullscreen'}"></simple-icon-lite>
          </button>
          <button id="hide-button" @click=${this.handleHideButton}>
            <simple-icon-lite icon="lrn:arrow-right"></simple-icon-lite> <!-- TODO might want to change to just be minimize button, since there shouldn't be a way to shut down AI without refreshing page -->
          </button>
        </div>
      </div>
    `;
  }

  // TODO try to make sure that most things that change go through chat-agent.js, which will pass information down to lower components.

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

    if (confirm('Download the chat log before you reset?')) {
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

    // this.isFullView = !this.isFullView; // TODO may need to remove this part since it will be handled via attribute in chat-agent.js

    if (this.developerModeEnabled) {
      console.info('HAX-DEV-MODE: View switched to: ' + (this.isFullView ? 'full' : 'standard'));
    }

    // TODO change the view in chat-agent.js (this.isFullView)
    if (this.isFullView) {
      document.querySelector('chat-agent').removeAttribute('full-view');
    } else {
      document.querySelector('chat-agent').setAttribute('full-view', "");
    }
    
  }

  /**
   * @description changes the interface window to be hidden off screen and unfocusable
   */
  handleHideButton() {
    if (this.developerModeEnabled) {
      console.info('HAX-DEV-MODE: Hide button pressed.');
    }

    document.querySelector("chat-agent").shadowRoot().querySelector("chat-interface").isHidden = true; // TODO doesn't work right now, will fix

    // TODO write code that will hide the interface using CSS.
    // * is user is in full size mode, the chat-button needs to become unhidden
  }

  /**
   * @description downloads the chat log as a .json file
   */
  downloadChatLog() {
    if (this.developerModeEnabled) {
      console.info('HAX-DEV-MODE: downloadChatLog() called.');
    }

    // TODO write code to download the chat log. May need to convert an array to .json
  }

  /**
   * @description resets the chat to initial state
   */
  resetChat() {
    if (this.developerModeEnabled) {
      console.info('HAX-DEV-MODE: resetChat() called.');
    }

    // TODO write code to reset the chat to it's initial state
  }

  static get properties() {
    return {
      ...super.properties,

      isFullView: {
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