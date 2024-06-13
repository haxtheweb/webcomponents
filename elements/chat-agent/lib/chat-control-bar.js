/**
 * Copyright 2024 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { ChatAgentModalStore } from "../chat-agent";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { html, css } from "lit";

class ChatControlBar extends DDD {

  static get tag() {
    return "chat-control-bar";
  }

  constructor() {
    super();

    this.developerModeEnabled = false; // set by chat-agent.js
    this.isFullView = false; // set by chat-agent.js
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
          <!-- https://stackoverflow.com/questions/72654466/how-do-i-make-a-button-that-will-download-a-file -->
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
            <simple-icon-lite icon="lrn:arrow-right"></simple-icon-lite>
          </button>
        </div>
      </div>
    `;
  }

  /**
   * @description handles the functionality of the download button
   */
  handleDownloadLogButton() {
    this.developerModeEnabled ? console.info('HAX-DEV-MODE: Download log button pressed.') : null;

    this.downloadChatLog();
  }

  /**
   * @description handles the functionality of the reset button
   */
  handleResetButton() {
    this.developerModeEnabled ? console.info('HAX-DEV-MODE: Reset button pressed.') : null;

    if (confirm('Download the chat log before you reset?')) {
      this.developerModeEnabled ? console.info('HAX-DEV-MODE: Download chat log before reset confirmed.') : null;
      this.downloadChatLog();
    } else {
      if(this.developerModeEnabled) {
        console.info('HAX-DEV-MODE: Download before reset denied.');
      }
      this.developerModeEnabled ? console.info('HAX-DEV-MODE: Download chat log before reset denied.') : null;
    }

    this.resetChat();
  }

  /**
   * @description Toggles the view of chat-interface to full or minimized
   */
  handleViewButton() {    
    this.developerModeEnabled ? console.info('HAX-DEV-MODE: View switch button pressed.') : null;

    ChatAgentModalStore.isFullView = !ChatAgentModalStore.isFullView;

    this.developerModeEnabled ? console.info('HAX-DEV-MODE: View switched to: ' + (!this.isFullView ? 'full' : 'standard')) : null;
  }

  /**
   * @description changes the interface window to be hidden off screen and unfocusable
   */
  handleHideButton() {
    this.developerModeEnabled ? console.info('HAX-DEV-MODE: Hide button pressed.') : null;

    ChatAgentModalStore.isInterfaceHidden = true;
  }

  /**
   * @description downloads the chat log as a .txt file
   */
  downloadChatLog() {
    this.developerModeEnabled ? console.info('HAX-DEV-MODE: Downloading chat log...') : null;

    if (ChatAgentModalStore.chatLog.length !== 0) {
      const log = JSON.stringify(ChatAgentModalStore.chatLog, undefined, 2);
      const fileName = 'chat-log-' + new Date().toISOString() + '.txt'; // TODO need to properly format date string
      
      let download = document.createElement('a');
      download.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(log));
      download.setAttribute('download', fileName);
      download.click();
      download.remove();
    }
  }

  /**
   * @description resets the chat to initial state
   */
  resetChat() {
    this.developerModeEnabled ? console.info('HAX-DEV-MODE: Resetting chat...') : null;

    // TODO write code to reset the chat to it's initial state. Could maybe just be done through array map by resetting the chat log to initial state
  }

  static get properties() {
    return {
      ...super.properties,
      developerModeEnabled: {
        type: Boolean,
        attribute: "developer-mode",
      },
      isFullView: {
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