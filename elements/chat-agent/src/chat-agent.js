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
import "@haxtheweb/rpg-character/rpg-character.js";
import "@haxtheweb/simple-icon/simple-icon.js";
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
    store.userData.userName !== undefined
      ? (this.userName = store.userData.userName)
      : (this.userName = "guest");
    store.userData.userPicture !== undefined
      ? (this.userPicture = store.userData.userPicture)
      : null; // TODO may not utilize, remove if not utilized

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
      messageIndex: observable,
      userIndex: observable,
    });

    autorun(() => {
      // magic

      const chatLog = toJS(this.chatLog);
      const engine = toJS(this.engine);
      const isFullView = toJS(this.isFullView);
      const isInterfaceHidden = toJS(this.isInterfaceHidden);
      const merlinIndex = toJS(this.merlinIndex);
      const messageIndex = toJS(this.messageIndex);
      const userIndex = toJS(this.userIndex);

      // ! work around to not being able to put this in properties
      isFullView
        ? this.setAttribute("is-full-view", "")
        : this.removeAttribute("is-full-view");
      isInterfaceHidden
        ? this.setAttribute("is-interface-hidden", "")
        : this.removeAttribute("is-interface-hidden");
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

    this.handleMessage(
      "merlin",
      "Hello! My name is Merlin. How can I assist you today?",
    );
  }

  /**
   * @description writes message to chatLog
   * @param {string} author - the author of the message
   * @param {string} message - the written or suggested prompt
   */
  handleMessage(author, message) {
    this.developerModeEnabled
      ? console.info(
          `HAX-DEV-MODE: Writing message ${message} by ${author} to chatLog.`,
        )
      : null;

    let authorIndex;

    this.messageIndex++;

    switch (author) {
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
      timestamp: date.toString().replace(/\s/g, "-"),
    };

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
    this.developerModeEnabled
      ? console.info(
          `HAX-DEV-MODE: Prompt sent to: ${this.engine}. Prompt sent: ${prompt}`,
        )
      : null;
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
          this.answers = [d.data.answer];
          console.log(this.answers);
          this.question = d.data.question;
        }
        this.loading = false;

        this.handleMessage("merlin", d.data.answer);
      })
      .catch((error) => {
        this.loading = false;
        console.error(error);
      });
  }

  /**
   * @description downloads the chat log as the specified file type
   * @param {string} fileType - the file type to download
   */
  handleDownload(fileType) {
    this.developerModeEnabled
      ? console.info(`HAX-DEV-MODE: Downloading chatlog as ${fileType}.`)
      : null;

    if (this.chatLog.length !== 0) {
      const LOG = JSON.stringify(this.chatLog, undefined, 2);
      let date = new Date();
      const FILE_NAME = `${this.userName}-chat-log-${date.toString().replace(/\s/g, "-")}.${fileType}`;

      let download = document.createElement("a");
      download.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(LOG),
      );
      download.setAttribute("download", FILE_NAME);
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
      developerModeEnabled: {
        // ! this will enable developer mode for the entire chat system
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
    };
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

export const ChatAgentModalStore =
  globalThis.ChatAgentModal.requestAvailability();
