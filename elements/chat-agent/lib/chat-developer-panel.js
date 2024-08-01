/**
 * Copyright 2024 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */

import { ChatStore } from "./chat-agent-store.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { autorun, toJS, } from "mobx";
import { html, css } from "lit";

class ChatDeveloperPanel extends DDD {

  static get tag() {
    return "chat-developer-panel";
  }

  constructor() {
    super();
    this.chatLog = [];
    this.context = null;
    this.engine = null;
    this.isFullView = null;
    
    autorun(() => {
      this.chatLog = toJS(ChatStore.chatLog);
      this.context = toJS(ChatStore.context);
      this.engine = toJS(ChatStore.engine);
      this.isFullView = toJS(ChatStore.isFullView);
    });
  }

  static get styles() {
    return[
      super.styles,
      css`
        /* https://oer.hax.psu.edu/bto108/sites/haxcellence/documentation/ddd */

        :host {
          container-type: inline-size;
          display: block;
        }

        .chat-developer-panel-wrapper {
          background-color: var(--ddd-theme-default-keystoneYellow);
          border-radius: var(--ddd-radius-sm);
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-1) var(--ddd-spacing-1);
        }

        .console-table {
          align-items: center;
          display: flex;
          gap: var(--ddd-spacing-1);
          justify-content: space-between;
        }

        .switches {
          align-items: center;
          display: flex;
          justify-content: center;
          gap: var(--ddd-spacing-1);
        }

        button, select {
          align-items: center;
          background-color: #2b2a33;
          border-radius: var(--ddd-radius-sm);
          color: var(--ddd-theme-default-white);
          cursor: pointer;
          display: flex;
          gap: var(--ddd-spacing-1);
          justify-content: center;
          font: var(--ddd-font-primary);
          font-size: 12px;
        }

        label {
          background-color: var(--ddd-theme-default-coalyGray);
          color: var(--ddd-theme-default-white);
          font-size: 14px;
          padding: var(--ddd-spacing-2);
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

        @container (max-width: 500px) {
          .btn-txt {
            display: none;
          }
        }

        @container (max-width: 180px) {
          .console-table {
            flex-wrap: wrap;
            justify-content: center;
          }
        }

        @media only screen and (max-height: 575px) {
          :host {
            display: none;
          }
        }
      `
    ];
  }

  render() {
    return html`
      <div class="chat-developer-panel-wrapper">

        <div class="console-table">
          <!-- Maybe convert buttons to simple-cta -->
          <button id="console-table-user" @click=${this.handleConsoleTableButton} aria-label="Console table user chat log">
            <div class="button-icon">
              <simple-icon-lite icon="hax:console-line"></simple-icon-lite> 
              <simple-icon-lite icon="lrn:user"></simple-icon-lite>
            </div>
            <div class="button-text">
              <span class="btn-txt">console.table() user chat log</span>
            </div> 
          </button>
          <simple-tooltip for="console-table-user" position="${this.isFullView ? "right" : "top"}">Print User Chat Log as Table to Console</simple-tooltip>

          <button id="console-table-merlin" @click=${this.handleConsoleTableButton} aria-label="Console table merlin chat log">
            <div class="button-icon">
              <simple-icon-lite icon="hax:console-line"></simple-icon-lite>
              <simple-icon-lite icon="hax:wizard-hat"></simple-icon-lite> 
            </div>
            <div class="button-text">
              <span class="btn-txt">console.table() merlin chat log</span>
            </div>
          </button>
          <simple-tooltip for="console-table-merlin" position="${this.isFullView ? "right" : "top"}">Print Merlin Chat Log as Table to Console</simple-tooltip>

          <button id="console-table-all" @click=${this.handleConsoleTableButton} aria-label="Console table entire chat log">
            <div class="button-icon">
              <simple-icon-lite icon="hax:console-line"></simple-icon-lite>
              <simple-icon-lite icon="book"></simple-icon-lite>
            </div>
            <div class="button-text">
              <span class="btn-txt">console.table() entire chat log</span>  
            </div>
          </button>
          <simple-tooltip for="console-table-all" position="${this.isFullView ? "left" : "top"}">Print Entire Chat Log as Table to Console</simple-tooltip>

          <button id="download-as-json" @click=${this.handleDownloadAsJsonButton} aria-label="Download chat log as .json">
            <div class="button-icon">
              <simple-icon-lite icon="icons:file-download"></simple-icon-lite>
              <simple-icon-lite icon="hax:code-json"></simple-icon-lite>
            </div>
            <div class="button-text">
              <span class="btn-txt">Download chat log as .json</span>
            </div>
          </button>
          <simple-tooltip for="download-as-json" position="${this.isFullView ? "left" : "top"}">Download Chat Log as .json</simple-tooltip>
        </div>

        <div class="switches" >
      
          <select name="select-engine" id="engine-selection" @change=${this.handleSwitchEngine}>
            <option value="alfred">Alfred (OpenAI)</option>
            <option value="robin">Robin (Anthropic)</option>
            <option value="Catwoman">Catwoman (ChatGPT)</option>
          </select>

          <select name="select-context" id="context-selection" @change=${this.handleContextChange}>
            <option value="phys211">Phys 211</option>
            <option value="haxcellence">HAX Docs</option>
            <option value="astro130">Astro 130</option>
            <option value="staxpython">Intro to Python</option>
            <option value="janetlaw">Janet Law</option>
            <option value="udni">UDNI</option>
            <option value="epubcyber440">Cyber 440</option>
            <option value="ciscopdfs">ciscopdfs</option>
          </select>
          
        </div>
      </div>
    `;
  }

  /**
   * @description LitElement firstUpdated / Sets selected properties of engine and context selection
   * @param {object} changedProperties - changed properties
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) super.firstUpdated(changedProperties);

    const ENGINE_OPTIONS = this.shadowRoot.querySelectorAll("#engine-selection option");
    const CONTEXT_OPTIONS = this.shadowRoot.querySelectorAll("#context-selection option");

    ENGINE_OPTIONS.forEach(option => {
      if (option.value === this.engine) {
        option.selected = true;
      }
    })

    CONTEXT_OPTIONS.forEach(option => {
      if (option.value === ChatStore.context) {
        option.selected = true;
      }
    })
  }

  /**
   * @description handles all console table buttons utilizing button id
   * @param {object} e - event
   */
  handleConsoleTableButton(e) {
    const TARGET = e.currentTarget.id;
    
    console.info(`HAX-DEV-MODE: ${TARGET} button pressed.`);

    switch (TARGET) {
      case "console-table-user":
        console.table(this.compileChatLog(ChatStore.userName));
        break;
      case "console-table-merlin":
        console.table(this.compileChatLog("merlin"))
        break;
      case "console-table-all":
        console.table(this.chatLog)
        break;
    }
  }
  
  /**
   * @description compiles a smaller chat log for the given author of messages
   * @param {string} author - the name of the author of the messages. Either the user's name or "merlin".
   */
  compileChatLog(author) {
    ChatStore.devStatement(`Compiling "${author}" chat log...`, 'info');
    
    let newChatLog = [];

    this.chatLog.forEach(object => {
      if (object.author === author) {
        newChatLog.push(object);
      }
    });

    return newChatLog;
  }

  /**
   * @description downloads the chat log as a .json file
   */
  handleDownloadAsJsonButton() {
    ChatStore.devStatement(`Calling download funtion...`, 'info');

    ChatStore.handleDownload('json');
  }

  /**
   * @description handles the functionality of the switch engine dropdown
   */
  handleSwitchEngine() {
    ChatStore.engine = this.shadowRoot.querySelector("#engine-selection").value;
    ChatStore.devStatement(`Engine switched to ${ChatStore.engine}`, 'info');
  }

  /**
   * @description handles the functionality of the switch context dropdown
   */
  handleContextChange() {
    ChatStore.context = this.shadowRoot.querySelector("#context-select").value;
    ChatStore.devStatement(`Context switched to ${ChatStore.context}`, 'info');
  }

  static get properties() {
    return {
      ...super.properties,

      isFullView: {
        type: Boolean,
        attribute: "is-full-view",
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

globalThis.customElements.define(ChatDeveloperPanel.tag, ChatDeveloperPanel);
export { ChatDeveloperPanel };