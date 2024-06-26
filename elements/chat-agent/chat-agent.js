/**
 * Copyright 2024 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import "./lib/chat-button.js";
import "./lib/chat-control-bar.js";
import "./lib/chat-developer-panel.js";
import "./lib/chat-input.js";
import "./lib/chat-interface.js";
import "./lib/chat-message.js";
import "./lib/chat-suggestion.js";
import '@haxtheweb/rpg-character/rpg-character.js';
import '@haxtheweb/simple-icon/simple-icon.js';
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { html, css } from "lit";
import { HAXCMSSiteEditorUI } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-editor-ui.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import {
  observable,
  makeObservable,
  computed,
  configure,
  autorun,
  toJS,
} from "mobx";
configure({ enforceActions: false });
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import { enableServices } from "@haxtheweb/micro-frontend-registry/lib/microServices.js";
// enable services for glossary enhancement
enableServices(["haxcms"]);
MicroFrontendRegistry.add({
  endpoint: "/api/apps/haxcms/aiChat",
  name: "@haxcms/aiChat",
  title: "AI Chat",
  description: "AI based chat agent that can answer questions about a site",
  params: {
    site: "location of the HAXcms site OR site.json data",
    type: "site for site.json or link for remote loading",
    question: "Question to ask of the AI",
    engine: "which engine to use as we test multiple",
    context: "context to query based on. Course typical",
  },
}); // strict mode off

/**
 * `chat-agent`
 * `chatbot agent style chat widget`
 * @demo demo/index.html
 * @element chat-agent
 */
class ChatAgent extends DDD {
  
  /**
   * Convention we use
   */
  static get tag() {
    return "chat-agent";
  }
  
  /**
   * HTMLElement
   */
  constructor() {
    super();

    // everything
    this.chatLog = [];
    this.engine = "alfred";
    store.userData.userName !== undefined ? this.userName = store.userData.userName : this.userName = "guest";
    store.userData.userPicture !== undefined ? this.userPicture = store.userData.userPicture : null; // TODO may not utilize, remove if not utilized
    this.context = "phys211";
    this.loading = null;
    
    // button    
    this.buttonIcon = "hax:wizard-hat";
    this.buttonLabel = "Merlin-AI";
    
    // control bar


    // developer mode
    this.developerModeEnabled = true; // ! this will enable developer mode for the entire chat system

    // input
    this.promptCharacterLimit;
    this.promptPlaceholder = "Enter your prompt here...";

    // interface
    this.isFullView = false;
    this.isInterfaceHidden = false;

    // message
    this.merlinIndex = 0; // index of merlin messages
    this.messageIndex = 0; // index of all messages
    this.userIndex = 0; // index of user messages
    
    this.userTypeWriterSpeed = 1;
    this.merlinTypeWriterSpeed = 20;
    
    // suggestion
    this.currentSuggestions = [];

    // external
    this.isSiteEditorOpen = HAXCMSSiteEditorUI.userMenuOpen; // TODO the idea is here, but I do not think it works (checks for editor bar, will be used for CSS full-view)
    console.log(this.isSiteEditorOpen);

    // ! mobx
    makeObservable(this, {
      buttonIcon: observable,
      chatLog: observable,
      engine: observable,
      isFullView: observable,
      isInterfaceHidden: observable,
      loading: observable,
      merlinIndex: observable,
      messageIndex: observable,
      userIndex: observable,
    });

    autorun(() => {
      // magic

      const buttonIcon = toJS(this.buttonIcon);
      const chatLog = toJS(this.chatLog);
      const engine = toJS(this.engine);
      const isFullView = toJS(this.isFullView);
      const isInterfaceHidden = toJS(this.isInterfaceHidden);
      const loading = toJS(this.loading);
      const merlinIndex = toJS(this.merlinIndex);
      const messageIndex = toJS(this.messageIndex);
      const userIndex = toJS(this.userIndex);

      // ! work around to not being able to put this in properties
      isFullView ? this.setAttribute("is-full-view", "") : this.removeAttribute("is-full-view");
      isInterfaceHidden ? this.setAttribute("is-interface-hidden", "") : this.removeAttribute("is-interface-hidden");

      if (loading) {
        this.buttonIcon = "hax:loading";
      } else {
        this.buttonIcon = "hax:wizard-hat";
      }
    });

    // TODO would like to add JS for when the user goes to refresh the page, it asks if they would like to do that. Could be used at restart as well
  }

  /**
   * LitElement style callback
   */
  static get styles() {
    return [
      super.styles,
      css`
        /* https://oer.hax.psu.edu/bto108/sites/haxcellence/documentation/ddd */

        :host {
          display: block;
          container-type: normal;
        }

        .chat-agent-wrapper {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-2);
          position: fixed;
          bottom: var(--ddd-spacing-2);
          right: var(--ddd-spacing-2);
          width: 40%; /* Switch to 30% when working with hax environment */
        }

        :host([is-full-view]) .chat-agent-wrapper {
          bottom: var(--ddd-spacing-0);
          right: var(--ddd-spacing-0);
          gap: var(--ddd-spacing-0);
          width: 25%;
        }

        :host([is-full-view]:host([is-interface-hidden])) .chat-agent-wrapper {
          bottom: var(--ddd-spacing-2);
          right: var(--ddd-spacing-2);
          gap: var(--ddd-spacing-2);
        }

        .agent-interface-wrapper {
          display: flex;
          justify-content: right;
        }

        .agent-button-wrapper {
          display: flex;
          justify-content: right;
        }

        @container (max-width: 600px) {
          .chat-agent-wrapper {
            width: 30%;
          }
        }

        /* TODO adjust all media queries for HAX environment, not demo environment */
        @media only screen and (max-width: 425px) {
          .chat-agent-wrapper {
            width: 90%;
          }
        }
      `,
    ];
  }

  /**
   * LitElement render callback
   */
  render() {
    return html`
      <div class="chat-agent-wrapper">
        <div class="agent-interface-wrapper">
          <chat-interface></chat-interface>
        </div>
        <div class="agent-button-wrapper">
          <chat-button>
            <span slot="label">${this.buttonLabel}</span>
          </chat-button>
        </div>
      </div>
    `;
  }
  
  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }

    this.startAI();
  }

  /**
   * @description start sequence for Merlin
   */
  startAI() {
    this.handleMessage("merlin", "Hello! My name is Merlin. How can I assist you today?");
    this.currentSuggestions = ["Who are you?", "What can you do for me?", "How do I use you?"];

    this.shadowRoot.querySelector("chat-interface").shadowRoot.querySelector("chat-message").shadowRoot.querySelectorAll("chat-suggestion").forEach((suggestion) => {
      if (suggestion.hasAttribute("disabled")) {
        suggestion.removeAttribute("disabled");
      }

      if(suggestion.hasAttribute("chosen-prompt")) {
        suggestion.removeAttribute("chosen-prompt");
      }
    });
  }

  /**
   * @description writes message to chatLog
   * @param {string} author - the author of the message
   * @param {string} message - the written or suggested prompt
   */
  handleMessage(author, message) {
    this.developerModeEnabled ? console.info(`HAX-DEV-MODE: Writing message "${message}" by ${author} to chatLog.`) : null;

    let authorIndex;

    this.messageIndex++;

    switch(author) {
      case "merlin":
        this.merlinIndex++;
        authorIndex = this.merlinIndex;
        break;
      case this.userName:
        this.userIndex++;
        authorIndex = this.userIndex;
        break;
    }

    let date = new Date();
    
    const chatLogObject = {
      messageID: this.messageIndex,
      author: author,
      message: message,
      authorMessageIndex: authorIndex,
      timestamp: date.toString().replace(/\s/g, '-'),
    }

    this.chatLog.push(chatLogObject);

    if (author === this.userName) {
      this.handleInteraction(message);
    }
  }

  /**
   * @description sends prompt to AI engine specified
   * @param {string} prompt - the written or suggested prompt
   */
  handleInteraction(prompt) {
    this.developerModeEnabled ? console.info(`HAX-DEV-MODE: Prompt sent to: ${this.engine}. Prompt sent: ${prompt}`) : null;
    this.currentSuggestions = [];

    switch(prompt) {
      // Offline messages, do not request response from backend AI

      // Tutorial messages
      case "Who are you?":
        this.currentSuggestions = ["What can you do for me?", "How do I use you?"];
        this.handleMessage("merlin", "I am Merlin. I was created for use within HAX websites as an assistant to help you with your questions. How may I help you today?");
        break;
      case "What can you do for me?":
        this.currentSuggestions = ["Who are you?", "How do I use you?"];
        this.handleMessage("merlin", "I can answer questions and chat with you about information relevant to the website you are navigating. How can I help you?");
        break;
      case "How do I use you?":
        this.currentSuggestions = ["Who are you?", "What can you do for me?"];
        this.handleMessage("merlin", "I support numerous functions. You can ask me questions, as well as download our chat log and reset our chat. You can start asking me questions by clicking on one of the suggested prompts, or by typing a prompt in the input box below and pressing the send button or pressing the enter key on your keyboard. Here are some of the keyboard controls you can utilize: \n 1. Tab Key - Navigates you through the numerous usable buttons. \n 2. Enter Key (in text area) - Will submit the prompt you wrote. \n 3. Enter key (When focusing on a button) - Will act in the same way as clicking the button. \n 4. Up & Down Arrow Keys (in text area) - will navigate you through previously sent prompts so you can send them again.");
        break;

      // Network error messages
      case "Why can't you connect?":
        this.currentSuggestions = ["How do I fix this connection issue?"];
        this.handleMessage("merlin", "I am either unable to connect to the internet, or a service I connect to is not available, meaning I cannot research how to respond to your prompt.");
        break;
      case "How do I fix this connection issue?":
        this.currentSuggestions = ["Why can't you connect?"];
        this.handleMessage("merlin", "Please ensure you are connected to the internet. I cannot respond to (most of) your questions if you are not connected to the internet. If you are connected, it is likely one of my connected services is having an issue, I will try to fix that and be back to help you soon.");
        break;

      // Online messages, do request response from backend AI
      default:
        var base = "";
        
        if (globalThis.document.querySelector("base")) {
          base = globalThis.document.querySelector("base").href;
        }

        const params = {
          site: {
            file: "https://haxtheweb.org/site.json",
          },
          type: "site",
          question: prompt,
          engine: this.engine,
          context: this.context,
        };

        this.loading = true;

        MicroFrontendRegistry.call("@haxcms/aiChat", params).then((d) => {
          if (d.status == 200) {
            this.answers = [d.data.answers];
            console.log(this.answers);
            this.question = d.data.question;
          }
          this.loading = false;

          this.currentSuggestions = ["What is gravity?", "What is the earth?", "Who created the physics field of study?", "How does gravity vary on different planets?"];
          this.handleMessage("merlin", d.data.answers);
        }).catch((error) => {
          this.loading = false;
          this.currentSuggestions = ["Why can't you connect?", "How do I fix this connection issue?"];
          this.handleMessage("merlin", "I'm sorry, I'm having trouble connecting right now. Please try again soon.")
          console.error(error);
        });
    }
  }

  /**
   * @description downloads the chat log as the specified file type
   * @param {string} fileType - the file type to download
   */
  handleDownload(fileType) {
    this.developerModeEnabled ? console.info(`HAX-DEV-MODE: Downloading chatlog as ${fileType}.`) : null;

    if (this.chatLog.length !== 0) {
      const LOG = JSON.stringify(this.chatLog, undefined, 2);
      let date = new Date();
      const FILE_NAME = `${this.userName}-chat-log-${date.toString().replace(/\s/g, '-')}.${fileType}`;
      
      let download = document.createElement('a');
      download.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(LOG));
      download.setAttribute('download', FILE_NAME);
      download.click();
      download.remove();
    }
  }

  static get properties() {
    return {
      ...super.properties,
      // everything
      userName: {
        type: String,
        attribute: "user-name",
      },
      userPicture: {
        type: String,
        attribute: "user-picture",
      },

      // control bar


      // developer mode
      developerModeEnabled: { // ! this will enable developer mode for the entire chat system
        type: Boolean,
        attribute: "developer-mode",
      }, 

      // input
      promptCharacterLimit: {
        type: Number,
        attribute: "maxlength",
      },
      promptPlaceholder: {
        type: String,
        attribute: "placeholder",
      },

      // interface


      // message
      merlinTypeWriterSpeed: {
        type: Number,
        attribute: "merlin-type-writer-speed",
      },
      userTypeWriterSpeed: {
        type: Number,
        attribute: "user-type-writer-speed",
      },


      // suggestion
      

    }
  }
}

customElements.define(ChatAgent.tag, ChatAgent);
export { ChatAgent };

// register globally so we can make sure there is only one
globalThis.ChatAgentModal = globalThis.ChatAgentModal || {};
// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same modal
globalThis.ChatAgentModal.requestAvailability = () => {
  if (!globalThis.ChatAgentModal.instance) {
    globalThis.ChatAgentModal.instance = document.createElement("chat-agent");
    document.body.appendChild(globalThis.ChatAgentModal.instance);
  }
  return globalThis.ChatAgentModal.instance;
};

export const ChatAgentModalStore = globalThis.ChatAgentModal.requestAvailability();