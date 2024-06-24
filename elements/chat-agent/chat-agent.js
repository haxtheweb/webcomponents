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
    this.engine = "alfred"; // TODO setup mobx for engine, remember to remove from properties
    this.userName = "guest";
    this.userPicture = "";
    
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
    this.isFullView = false; // TODO setup mobx for isFullView, remember to remove from properties
    this.isInterfaceHidden = false; // TODO setup mobx for isInterfaceHidden, remember to remove from properties

    // message
    this.merlinIndex = 0; // index of merlin messages
    this.messageIndex = 0; // index of all messages
    this.userIndex = 0; // index of user messages
    
    this.userTypeWriterSpeed = 1;
    this.merlinTypeWriterSpeed = 30;
    
    // suggestion


    // external
    this.isSiteEditorOpen = HAXCMSSiteEditorUI.userMenuOpen; // TODO the idea is here, but I do not think it works (checks for editor bar, will be used for CSS)
    console.log(this.isSiteEditorOpen);

    // ! mobx
    makeObservable(this, {
      chatLog: observable,
      engine: observable,
      isFullView: observable,
      isInterfaceHidden: observable,
      merlinIndex: observable,
      merlinTypeWriterSpeed: observable,
      messageIndex: observable,
      userIndex: observable,
      userName: observable,
      userTypeWriterSpeed: observable,
    });
    autorun(() => {
      // magic

      const chatLog = toJS(this.chatLog);
      const engine = toJS(this.engine);
      const isFullView = toJS(this.isFullView);
      const isInterfaceHidden = toJS(this.isInterfaceHidden);
      const merlinIndex = toJS(this.merlinIndex);
      const merlinTypeWriterSpeed = toJS(this.merlinTypeWriterSpeed);
      const messageIndex = toJS(this.messageIndex);
      const userIndex = toJS(this.userIndex);
      const userName = toJS(this.userName);
      const userTypeWriterSpeed = toJS(this.userTypeWriterSpeed);

      // ! work around to not being able to put this in properties
      isFullView ? this.setAttribute("is-full-view", "") : this.removeAttribute("is-full-view");
      isInterfaceHidden ? this.setAttribute("is-interface-hidden", "") : this.removeAttribute("is-interface-hidden");
    });
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

        /* TODO may not need, may just need in lower components */
        @container (max-width: 600px) {
          .chat-agent-wrapper {
            width: 30%;
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

    this.loadAI();
  }

  loadAI() {
    ChatAgentModalStore.messageIndex++;
    ChatAgentModalStore.merlinIndex++;

    let date = new Date();

    const chatLogObject = {
      messageID: ChatAgentModalStore.messageIndex,
      author: "merlin",
      message: "Hello! My name is Merlin. How can I assist you today?",
      authorMessageIndex: ChatAgentModalStore.merlinIndex,
      timestamp: date.toString().replace(/\s/g, '-'),
    }

    this.chatLog.push(chatLogObject);
  }

  // TODO get commented code working
  // handleMessages(author, message) {
  //   let authorIndex;

  //   ChatAgentModalStore.messageIndex++;
  //   switch(author) {
  //     case "merlin":
  //       ChatAgentModalStore.merlinIndex++;
  //       authorIndex = ChatAgentModalStore.merlinIndex;
  //       break;
  //     case ChatAgentModalStore.userName:
  //       ChatAgentModalStore.userIndex++;
  //       authorIndex = ChatAgentModalStore.userIndex;
  //       break;
  //   }

  //   let date = new Date();
  //   let dateString = date.toString().replace(/\s/g, '-');
    
  //   const chatLogObject = {
  //     messageID: ChatAgentModalStore.messageIndex,
  //     author: author,
  //     message: message,
  //     authorMessageIndex: authorIndex,
  //     timestamp: dateString,
  //   }

  //   this.chatLog.push(chatLogObject);
  // }

  /**
   * @description sends prompt to AI engine specified
   */
  handleInteraction(prompt) {
    this.developerModeEnabled ? console.info(`HAX-DEV-MODE: Prompt sent to: ${this.engine}. Prompt sent: ${prompt}`) : null;
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
    MicroFrontendRegistry.call("@haxcms/aiChat", params)
      .then((d) => {
        if (d.status == 200) {
          this.answers = [...d.data.answers];
          this.question = d.data.question;
        }
        this.loading = false;
      })
      .catch((error) => {
        this.loading = false;
        console.error(error);
      });
  }

  static get properties() {
    return {
      ...super.properties,
      // everything
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