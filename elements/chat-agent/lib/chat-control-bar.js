/**
 * Copyright 2024 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { ChatStore } from "./chat-agent-store.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { autorun, toJS, } from "mobx";
import { html, css } from "lit";

class ChatControlBar extends DDD {

  static get tag() {
    return "chat-control-bar";
  }

  constructor() {
    super();

    this.dataCollectionEnabled = null;
    this.isFullView = null;
    this.isInterfaceHidden = null;

    autorun(() => {
      this.dataCollectionEnabled = toJS(ChatStore.dataCollectionEnabled);
      this.isFullView = toJS(ChatStore.isFullView);
      this.isInterfaceHidden = toJS(ChatStore.isInterfaceHidden);
    })
  }

  static get styles() {
    return [
      super.styles,
      css`
        /* https://oer.hax.psu.edu/bto108/sites/haxcellence/documentation/ddd */
        
        :host {
          container-type: inline-size;
          display: block;
        }

        .chat-control-bar-wrapper {
          align-items: center;
          display: flex;
          justify-content: space-between;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-0);
        }

        button {
          background-color: #2b2a33;
          border-radius: var(--ddd-radius-sm);
          color: var(--ddd-theme-default-white);
        }
        
        button:hover, button:focus-visible {
          background-color: #52525e;
        }

        button > simple-icon-lite {
          --simple-icon-color: var(--ddd-theme-default-white);
        }

        simple-tooltip {
          --simple-tooltip-delay-in: 1000ms;
        }

        .data-collection-icon {
          --simple-icon-color: var(--ddd-theme-default-original87Pink);
        }

        .data-collection-label {
          font: var(--ddd-font-primary); 
          font-size: 12px;
        }

        :host([data-collection-enabled]) .data-collection-icon {
          --simple-icon-color: var(--ddd-theme-default-futureLime);
        }

        /* Phones */
        @media only screen and (max-width: 425px), only screen and (max-height: 616px) {
          #view-button {
            display: none;
          }
        }

        @container (max-width: 330px) {
          .data-collection-label {
            display: none;
          }
        }
      `
    ];
  }

  render() {
    return html`
      <!-- https://open-apis.hax.cloud/?path=/story/media-icons--hax-iconset-story -->
      
      <div class="chat-control-bar-wrapper">
        <div class="left-side">

          <button id="download-button" @click=${this.handleDownloadLogButton} aria-label="Download Log as txt">
            <simple-icon-lite icon="icons:file-download"></simple-icon-lite>
          </button>
          <simple-tooltip for="download-button" position="${this.isFullView ? "right" : "top"}">Download Chat Log</simple-tooltip>
          
          <button id="reset-button" @click=${this.handleResetButton} aria-label="Reset Chat">
            <simple-icon-lite icon="icons:refresh"></simple-icon-lite>
          </button>
          <simple-tooltip for="reset-button" position="${this.isFullView ? "right" : "top"}">Reset Chat</simple-tooltip>

          <button id="data-collection-button" @click=${this.handleDataCollectionButton} aria-label="Toggle Data Collection">
            <simple-icon-lite icon="lrn:data_usage" class="data-collection-icon"></simple-icon-lite>
            <span class="data-collection-label">Data Collection</span>
          </button>
          <simple-tooltip for="data-collection-button" position="${this.isFullView ? "right" : "top"}">Toggle Data Collection</simple-tooltip>

          <button id="dev-mode-button" @click=${this.handleDevModeButton} aria-label="Toggle Developer Mode">
            <simple-icon-lite icon="hax:console-line"></simple-icon-lite>
          </button>
          <simple-tooltip for="dev-mode-button" position="${this.isFullView ? "right" : "top"}">Toggle Developer Mode</simple-tooltip>

        </div>
        <div class="right-side">
          <button id="view-button" @click=${this.handleViewButton} aria-label="${this.isFullView ? 'Exit Full View' : 'Enter Full View'}">
            <simple-icon-lite icon="${this.isFullView ? 'icons:fullscreen-exit' : 'icons:fullscreen'}"></simple-icon-lite>
          </button>
          <simple-tooltip for="view-button" position="${this.isFullView ? "left" : "top"}">${this.isFullView ? 'Exit Full View' : 'Enter Full View'}</simple-tooltip>

          ${this.isFullView ? html`
            <button id="hide-button" @click=${this.handleHideButton} aria-label="Hide Interface">
              <simple-icon-lite icon="remove"></simple-icon-lite>
            </button>
            <simple-tooltip for="hide-button" position="${this.isFullView ? "left" : "top"}">Hide Interface</simple-tooltip>
          ` : ''}
        </div>
      </div>
    `;
  }

  /**
   * @description handles the functionality of the download button
   */
  handleDownloadLogButton() {
    ChatStore.devStatement("Download log button pressed.", "log");

    this.downloadChatLog();
  }

  /**
   * @description handles the functionality of the reset button
   */
  handleResetButton() {
    ChatStore.devStatement("Reset button pressed.", "log");

    if (confirm('Reset the chat?')) {
      if (confirm('Download the chat log before you reset?')) {
        ChatStore.devStatement("Download chat log before reset confirmed.", "info")
        this.downloadChatLog();
      } else {
        ChatStore.devStatement("Download chat log before reset denied.", "warning");
      }
      this.resetChat();
    }
  }

  /**
   * @description - handles the functionality of the data collection button
   */
  handleDataCollectionButton() {
    ChatStore.dataCollectionEnabled = !ChatStore.dataCollectionEnabled;

    this.dataCollectionEnabled ? alert('Your conversations will be used to train our AI models') : alert('Your conversations will not be used to train our AI models');
  }

  /**
   * @description - handles the functionality of the dev mode button
   */
  handleDevModeButton() {
    ChatStore.developerModeEnabled = !ChatStore.developerModeEnabled;
  }

  /**
   * @description Toggles the view of chat-interface to full or minimized
   */
  handleViewButton() {    
    ChatStore.devStatement("View switch button pressed.", "log");

    ChatStore.isFullView = !this.isFullView;

    this.requestUpdate(); // changes button icon

    ChatStore.devStatement("View switched to: " + (ChatStore.isFullView ? 'full' : 'standard'), "info");
  }

  /**
   * @description changes the interface window to be hidden off screen and unfocusable
   */
  handleHideButton() {
    ChatStore.devStatement("Hide button pressed.", "log");

    if (!this.isInterfaceHidden) {
      ChatStore.isInterfaceHidden = true;
    }
  }

  /**
   * @description downloads the chat log as a .txt file
   */
  downloadChatLog() {
    ChatStore.devStatement("Calling download function...", "info");

    ChatStore.handleDownload('txt');
  }

  /**
   * @description resets the chat to initial state
   */
  resetChat() {
    ChatStore.devStatement("Resetting chat...", "info");

    ChatStore.chatLog = [];
    ChatStore.merlinIndex = 0;
    ChatStore.messageIndex = 0;
    ChatStore.userIndex = 0;

    ChatStore.startAI();
  }

  static get properties() {
    return {
      ...super.properties,
      dataCollectionEnabled: {
        type: Boolean,
        attribute: 'data-collection-enabled',
        reflect: true,
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