/**
 * Copyright 2024 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */

import { ChatAgentModalStore } from "../chat-agent";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { html, css } from "lit";

class ChatDeveloperPanel extends DDD {

  static get tag() {
    return "chat-developer-panel";
  }

  constructor() {
    super();
  }

  static get styles() {
    return[
      super.styles,
      css`
        /* https://oer.hax.psu.edu/bto108/sites/haxcellence/documentation/ddd */

        :host {
          display: block;
        }

        .chat-developer-panel-wrapper {
          background-color: var(--ddd-theme-default-keystoneYellow);
          padding: var(--ddd-spacing-1) var(--ddd-spacing-1);
          border-radius: var(--ddd-radius-sm);
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-2);
        }

        .console-table {
          display: flex;
          gap: var(--ddd-spacing-1);
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
        }

        .switch-engine-controls {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        button {
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          gap: var(--ddd-spacing-1);
        }
      `
    ];
  }

  render() {
    return html`
      <div class="chat-developer-panel-wrapper">

        <div class="console-table">
          <!-- Maybe convert buttons to simple-cta -->
          <button id="console-table-user" @click=${this.handleConsoleTableButton}>
            <div class="button-icon">
              <simple-icon-lite icon="hax:console-line"></simple-icon-lite>
            </div>
            <div class="button-text">
              console.table() user chat log
            </div> 
          </button>

          <button id="console-table-merlin" @click=${this.handleConsoleTableButton}>
            <div class="button-icon">
              <simple-icon-lite icon="hax:console-line"></simple-icon-lite> 
            </div>
            <div class="button-text">
              console.table() merlin chat log
            </div>
          </button>

          <button id="console-table-all" @click=${this.handleConsoleTableButton}>
            <div class="button-icon">
              <simple-icon-lite icon="hax:console-line"></simple-icon-lite>
            </div>
            <div class="button-text">
              console.table() entire chat log
            </div>
          </button>

          <button id="download-as-json" @click=${this.handleDownloadAsJsonButton}>
            <div class="button-icon">
              <simple-icon-lite icon="icons:file-download"></simple-icon-lite>
            </div>
            <div class="button-text">
              Download chat log as .json
            </div>
          </button>
        </div>

        <div class="switch-engine-controls">
          <button id="switch-engine-btn">
          <div class="button-icon">
              <simple-icon-lite icon="hardware:memory"></simple-icon-lite>
            </div>
            <div class="button-text" @click=${this.handleSwitchEngineButton}>
              Switch LLM Engine (Current Engine = <em>${ChatAgentModalStore.engine}</em>)
            </div>
          </button>
        </div>
      </div>
    `;
  }

  /**
   * @description handles all console table buttons utilizing button id
   */
  handleConsoleTableButton(e) {
    const TARGET = e.currentTarget.id;
    
    console.info(`HAX-DEV-MODE: ${TARGET} button pressed.`);

    switch (TARGET) {
      case "console-table-user":
        console.table(this.compileChatLog(ChatAgentModalStore.userName));
        break;
      case "console-table-merlin":
        console.table(this.compileChatLog("merlin"))
        break;
      case "console-table-all":
        console.table(ChatAgentModalStore.chatLog)
        break;
    }
  }
  
  /**
   * @description compiles a smaller chat log for the given author of messages
   * @param {string} author - the name of the author of the messages. Either the user's name or "merlin".
   */
  compileChatLog(author) {
    console.info(`HAX-DEV-MODE: Compiling "${author}" chat log`)
    
    let newChatLog = [];

    ChatAgentModalStore.chatLog.forEach(element => {
      if (element.author === author) {
        newChatLog.push(element);
      }
    });

    return newChatLog;
  }

  /**
   * @description downloads the chat log as a .json file
   */
  handleDownloadAsJsonButton() {
    console.info(`HAX-DEV-MODE: Downloading chat log as .json...`)

    if (ChatAgentModalStore.chatLog.length !== 0) {
      const log = JSON.stringify(ChatAgentModalStore.chatLog, undefined, 2);
      let date = new Date();
      let dateString = date.toString().replace(/\s/g, '-');;
      const fileName = ChatAgentModalStore.userName + '-chat-log-' + dateString + '.json';
      
      let download = document.createElement('a');
      download.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(log));
      download.setAttribute('download', fileName);
      download.click();
      download.remove();
    }
  }

  /**
   * @description handles the functionality of the switch engine button
   */
  handleSwitchEngineButton(e) {
    switch (ChatAgentModalStore.engine) {
      case "alfred":
        ChatAgentModalStore.engine = "robin";
        break;
      case "robin":
        ChatAgentModalStore.engine = "alfred";
        break;
    }

    console.info(`HAX-DEV-MODE: Engine switched to ${ChatAgentModalStore.engine}`);

    e.currentTarget.innerHTML = `Switch LLM Engine (Current Engine = <em>${ChatAgentModalStore.engine}</em>)`;
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

globalThis.customElements.define(ChatDeveloperPanel.tag, ChatDeveloperPanel);
export { ChatDeveloperPanel };