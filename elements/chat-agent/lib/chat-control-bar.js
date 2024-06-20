/**
 * Copyright 2024 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { ChatAgentModalStore } from "../chat-agent.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { html, css } from "lit";
import { autorun, toJS, } from "mobx";

class ChatControlBar extends DDD {

  static get tag() {
    return "chat-control-bar";
  }

  constructor() {
    super();
    this.chatLog = [];
    this.isInterfaceHidden;
    autorun(() => {
      this.chatLog = toJS(ChatAgentModalStore.chatLog);
      this.isInterfaceHidden = toJS(ChatAgentModalStore.isInterfaceHidden);
    })
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
            <simple-icon-lite icon="${ChatAgentModalStore.isFullView ? 'icons:fullscreen-exit' : 'icons:fullscreen'}"></simple-icon-lite>
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
    ChatAgentModalStore.developerModeEnabled ? console.info('HAX-DEV-MODE: Download log button pressed.') : null;

    this.downloadChatLog();
  }

  /**
   * @description handles the functionality of the reset button
   */
  handleResetButton() {
    ChatAgentModalStore.developerModeEnabled ? console.info('HAX-DEV-MODE: Reset button pressed.') : null;

    if (confirm('Download the chat log before you reset?')) {
      ChatAgentModalStore.developerModeEnabled ? console.info('HAX-DEV-MODE: Download chat log before reset confirmed.') : null;
      this.downloadChatLog();
    } else {
      ChatAgentModalStore.developerModeEnabled ? console.info('HAX-DEV-MODE: Download chat log before reset denied.') : null;
    }

    this.resetChat();
  }

  // TODO rework logic using mobx
  /**
   * @description Toggles the view of chat-interface to full or minimized
   */
  handleViewButton() {    
    ChatAgentModalStore.developerModeEnabled ? console.info('HAX-DEV-MODE: View switch button pressed.') : null;

    ChatAgentModalStore.isFullView = !ChatAgentModalStore.isFullView;

    this.requestUpdate(); // allows icon to change

    ChatAgentModalStore.developerModeEnabled ? console.info('HAX-DEV-MODE: View switched to: ' + (ChatAgentModalStore.isFullView ? 'full' : 'standard')) : null;
  }

  /**
   * @description changes the interface window to be hidden off screen and unfocusable
   */
  handleHideButton() {
    ChatAgentModalStore.developerModeEnabled ? console.info('HAX-DEV-MODE: Hide button pressed.') : null;

    if (!this.isInterfaceHidden) {
      ChatAgentModalStore.isInterfaceHidden = true;
    }
  }

  /**
   * @description downloads the chat log as a .txt file
   */
  downloadChatLog() {
    ChatAgentModalStore.developerModeEnabled ? console.info('HAX-DEV-MODE: Downloading chat log...') : null;

    if (this.chatLog.length !== 0) {
      const log = JSON.stringify(this.chatLog, undefined, 2);
      let date = new Date();
      const fileName = ChatAgentModalStore.userName + '-chat-log-' + date.toString().replace(/\s/g, '-') + '.txt';
      
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
    ChatAgentModalStore.developerModeEnabled ? console.info('HAX-DEV-MODE: Resetting chat...') : null;

    ChatAgentModalStore.chatLog = [];
    ChatAgentModalStore.merlinIndex = 0;
    ChatAgentModalStore.messageIndex = 0;
    ChatAgentModalStore.userIndex = 0;

    ChatAgentModalStore.loadAI();
  }

  static get properties() {
    return {
      ...super.properties,
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