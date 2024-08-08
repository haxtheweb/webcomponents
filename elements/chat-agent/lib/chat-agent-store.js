/**
 * Copyright 2024 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { enableServices } from "@haxtheweb/micro-frontend-registry/lib/microServices.js";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import {
  autorun,
  configure,
  makeObservable,
  observable,
  toJS,
} from "mobx";
configure({ enforceActions: false });
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
 * @description store for the chat agent and it's subcomponents
 */
class ChatAgentStore {

  constructor() {
    this.buttonIcon = "hax:wizard-hat";
    this.buttonLabel = "Merlin-AI";
    this.chatLog = [];
    this.context = "phys211";
    this.currentSuggestions = [];
    this.darkMode = null;
    store.darkMode !== undefined
      ? (this.darkMode = store.darkMode)
      : (this.darkMode = false);
    this.dataCollectionEnabled = true;
    this.developerModeEnabled = false; // ! this will enable developer mode for the entire chat system
    store.editMode !== undefined
      ? (this.editMode = store.editMode)
      : (this.editMode = false);
    this.engine = "alfred";
    this.isFullView = false;
    this.isInterfaceHidden = true; 
    this.isLoading = null;
    this.merlinIndex = 0;
    this.merlinTypeWriterSpeed = 2;
    this.messageIndex = 0;
    this.promptCharacterLimit;
    this.promptPlaceholder = "Enter your prompt here...";
    this.userIndex = 0;
    this.userTypeWriterSpeed = 0;
    store.userData.userName !== undefined
      ? (this.userName = store.userData.userName)
      : (this.userName = "guest");

    this.date = new Date();
    this.month = this.date.getMonth() + 1; // months are zero indexed
    this.day = this.date.getDate();

    makeObservable(this, {
      buttonIcon: observable,
      chatLog: observable,
      context: observable,
      darkMode: observable,
      dataCollectionEnabled: observable,
      developerModeEnabled: observable,
      editMode: observable,
      engine: observable,
      isFullView: observable,
      isInterfaceHidden: observable,
      isLoading: observable,
      merlinIndex: observable,
      messageIndex: observable,
      userIndex: observable,
    });
  
    autorun(() => {
      const buttonIcon = toJS(this.buttonIcon);
      const chatLog = toJS(this.chatLog);
      const context = toJS(this.context);
      const darkMode = toJS(store.darkMode);
      const dataCollectionEnabled = toJS(this.dataCollectionEnabled);
      const developerModeEnabled = toJS(this.developerModeEnabled);
      const editMode = toJS(store.editMode);
      const engine = toJS(this.engine);
      const isFullView = toJS(this.isFullView);
      const isInterfaceHidden = toJS(this.isInterfaceHidden);
      const isLoading = toJS(this.isLoading);
      const merlinIndex = toJS(this.merlinIndex);
      const messageIndex = toJS(this.messageIndex);
      const userIndex = toJS(this.userIndex);
      
      // these are here because these updates weren't working without them
      if (isLoading) {
        this.buttonIcon = "hax:loading";
      } else {
        this.buttonIcon = "hax:wizard-hat";
      }

      if (darkMode) {
        this.darkMode = true;
      } else {
        this.darkMode = false;
      }

      if (editMode) {
        this.editMode = true;
      } else {
        this.editMode = false;
      }
    });
  }

 /**
   * @description starts Merlin
   */
  startAI() {
    this.handleMessage(
      "merlin",
      `Hello! My name is Merlin. I am currently in beta, and may not yet be feature complete, so you may encounter some bugs. By default I can answer questions about ${this.context}. How can I assist you today?`,
    );
    
    if (
      this.month === 2 && this.day === 12 || 
      this.month === 6 && this.day === 6 ||
      this.month === 7 && this.day === 27 ||
      this.month === 8 && this.day === 15 ||
      this.month === 9 && this.day === 19 ||
      this.month === 10 && this.day === 1 ||
      this.month === 10 && this.day === 5 ||
      this.month === 12 && this.day === 5 ||
      this.month === 12 && this.day === 18
    ) {
      this.currentSuggestions = [
        {
          suggestion: "Who are you?",
          type: "hax",
        },
        {
          suggestion: "What can you do for me?",
          type: "help",
        },
        {
          suggestion: "How do I use you?",
          type: "help",
        },
        {
          suggestion: "Why is my character wearing a hat?",
          type: "hax",
        }
      ];
    } else {
      this.currentSuggestions = [
        {
          suggestion: "Who are you?",
          type: "hax",
        },
        {
          suggestion: "What can you do for me?",
          type: "help",
        },
        {
          suggestion: "How do I use you?",
          type: "help",
        },
      ];
    }

    try {
      document.
        querySelector("chat-agent")
        .shadowRoot.querySelector("chat-interface")
        .shadowRoot.querySelector("chat-message")
        .shadowRoot.querySelectorAll("chat-suggestion")
        .forEach((suggestion) => {
          if (suggestion.hasAttribute("disabled")) {
            suggestion.removeAttribute("disabled");
          }
    
          if (suggestion.hasAttribute("chosen-prompt")) {
            suggestion.removeAttribute("chosen-prompt");
          }
        });
    } catch (error) {
      this.devStatement(error, "error");
    }
  }

  /**
   * @description writes message to chatLog
   * @param {string} author - the author of the message (merlin or user's name / guest)
   * @param {string} message - the written or suggested prompt or response from Merlin
   */
  handleMessage(author, message) {
    this.devStatement(`Writing message "${message}" by ${author} to chatLog.`, `info`);

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
    this.devStatement(`Prompt sent to: ${this.engine}. Prompt sent: ${prompt}`, `info`);
    this.currentSuggestions = [];

    switch (prompt) {
      // Offline messages, do not request response from backend AI

      // Tutorial messages
      case "Who are you?":
        this.currentSuggestions = [
          {
            suggestion: "What can you do for me?",
            type: "help",
          },
          {
            suggestion: "How do I use you?",
            type: "help",
          },
        ];
        this.handleMessage(
          "merlin",
          "I am Merlin. I was created for use within HAX websites as an assistant to help you with your questions. How may I help you today?",
        );
        break;
      case "What can you do for me?":
        this.currentSuggestions = [
          {
            suggestion: "Who are you?",
            type: "hax",
          },
          {
            suggestion: "How do I use you?",
            type: "help",
          },
        ];
        this.handleMessage(
          "merlin",
          "I can answer questions and chat with you about information relevant to the website you are navigating. How can I help you?",
        );
        break;
      case "How do I use you?":
        this.currentSuggestions = [
          {
            suggestion: "Who are you?",
            type: "hax",
          },
          {
            suggestion: "What can you do for me?",
            type: "help",
          },
        ];
        this.handleMessage(
          "merlin",
          "I support numerous functions. You can ask me questions, as well as download our chat log and reset our chat. You can start asking me questions by clicking on one of the suggested prompts, or by typing a prompt in the input box below and pressing the send button or pressing the enter key on your keyboard. Here are some of the keyboard controls you can utilize: \n 1. Tab Key - Navigates you through the numerous usable buttons. \n 2. Enter Key (in text area) - Will submit the prompt you wrote. \n 3. Enter key (When focusing on a button) - Will act in the same way as clicking the button. \n 4. Up & Down Arrow Keys (in text area) - will navigate you through previously sent prompts so you can send them again.",
        );
        break;

      case "Why is my character wearing a hat?":
        this.currentSuggestions = [
          {
            suggestion: "Who are you?",
            type: "hax",
          },
          {
            suggestion: "What can you do for me?",
            type: "help",
          },
          {
            suggestion: "How do I use you?",
            type: "help",
          },
        ];
        this.handleMessage(
          "merlin",
          "Your character is wearing a hat because today is either a special (hat related) holiday, or another special occassion!"
        )
        break;

      // Network error messages
      case "Why can't you connect?":
        this.currentSuggestions = [
          {
            suggestion: "How do I fix this connection issue?",
            type: "network",
          },
        ];
        this.handleMessage(
          "merlin",
          "I am either unable to connect to the internet, or a service I connect to is not available, meaning I cannot research how to respond to your prompt.",
        );
        break;
      case "How do I fix this connection issue?":
        this.currentSuggestions = [
          {
            suggestion: "Why can't you connect?",
            type: "network",
          },
        ];
        this.handleMessage(
          "merlin",
          "Please ensure you are connected to the internet. I cannot respond to (most of) your questions if you are not connected to the internet. If you are connected, it is likely one of my connected services is having an issue, I will try to fix that and be back to help you soon.",
        );
        break;

      // Online messages, do request response from backend AI
      default:
        var base = "";

        if (globalThis.document.querySelector("base")) {
          base = globalThis.document.querySelector("base").href;
        }

        // TODO: Add support for data collection toggle (this.dataCollectionEnabled)
        const params = {
          site: {
            file: "https://haxtheweb.org/site.json",
          },
          type: "site",
          question: prompt,
          engine: this.engine,
          context: this.context,
        };

        this.isLoading = true;

        MicroFrontendRegistry.call("@haxcms/aiChat", params)
          .then((d) => {
            if (d.status == 200) {
              this.answers = [d.data.answers];
              this.question = d.data.question;
              this.currentSuggestions = []; // TODO add support for AI based suggestions
            }

            this.isLoading = false;
            this.handleMessage("merlin", d.data.answers);
          })
          .catch((error) => {
            this.isLoading = false;
            this.currentSuggestions = [
              {
                suggestion: "Why can't you connect?",
                type: "network",
              },
              {
                suggestion: "How do I fix this connection issue?",
                type: "network",
              },
            ];
            this.handleMessage(
              "merlin",
              "I'm sorry, I'm having trouble connecting right now. Please try again soon. If you'd like to learn more, please click on one of the suggested prompts.",
            );
            this.devStatement(error, 'error');
          });
    }
  }

  /**
   * @description downloads the chat log as the specified file type
   * @param {string} fileType - the file type to download
   */
  handleDownload(fileType) {
    this.devStatement(`Downloading chatlog as ${fileType}.`, 'info');

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

  /**
   * @description handles the functionality of the dev mode console writing
   * @param {string} statement - the statement to write
   * @param {string} type - the type of statement (log, info, warn, error)
   */
  devStatement(statement, type) {
    if (this.developerModeEnabled) {
      switch (type) {
        case "log":
          console.log(`CHAT-AGENT-DEV-MODE: ${statement}`);
          break;
        case "info":
          console.info(`CHAT-AGENT-DEV-MODE: ${statement}`);
          break;
        case "warn":
          console.warn(`CHAT-AGENT-DEV-MODE: ${statement}`);
          break;
        case "error":
          console.error(`CHAT-AGENT-DEV-MODE: ${statement}`);
          break;

        default:
          console.error("No devStatement type specified");
      }
    }
  }
}

// register globally so we can make sure there is only one
globalThis.ChatAgentStore = globalThis.ChatAgentStore || {};
// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same modal
globalThis.ChatAgentStore.requestAvailability = () => {
  if (!globalThis.ChatAgentStore.instance) {
    globalThis.ChatAgentStore.instance = document.createElement("chat-agent-store");
    document.body.appendChild(globalThis.ChatAgentStore.instance);
  }
  return globalThis.ChatAgentStore.instance;
};

export const ChatStore = new ChatAgentStore();