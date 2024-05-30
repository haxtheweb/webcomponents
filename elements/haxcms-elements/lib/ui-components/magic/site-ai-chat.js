import { DDDSuper, DDDPulseEffectSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { html, css, LitElement } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { toJS } from "mobx";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import { enableServices } from "@haxtheweb/micro-frontend-registry/lib/microServices.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";

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
});

export class SiteAiChat extends DDDPulseEffectSuper(DDDSuper(LitElement)) {
  
  static get tag() {
    return "site-ai-chat";
  }

  constructor() {
    super();
    this.question = null;
    this.answers = [];
    this.loading = false;
    this.context = toJS(store.manifest.metadata.site.name);
    this.dataPulse = "1";
    
    // Interface variables
      this.isOpen = false;
      this._wasOpenedFirstTime = false;
      this._isFullView = false;
      this._isDeveloperModeEnabled = true;
    
    // Functional variables
      this.engine = "alfred";
      this._messageID = 0;
      this._merlinMessageIndex = 0;
      this._userMessageIndex = 0;
      this._chatLog = []; // TODO make this JSON instead of object array
  }

  askQuestion(e) {
    e.preventDefault();
    this.engine = e.target.getAttribute("name");
    this.context = this.shadowRoot.querySelector("#context").value;
    this.question = this.shadowRoot.querySelector("#question").value;
    this.requestAIFeedback();
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (changedProperties.has("isOpen")) {
      if (this.isOpen) {
        this.shadowRoot.querySelector("dialog").showModal();
      } else {
        this.shadowRoot.querySelector("dialog").close();
      }
    }
  }

  requestAIFeedback() {
    const site = toJS(store.manifest);
    var base = "";
    if (globalThis.document.querySelector("base")) {
      base = globalThis.document.querySelector("base").href;
    }
    const params = {
      site: {
        file: base + "site.json",
        metadata: site.metadata,
      },
      type: "site",
      question: this.question,
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

  static get styles() {
    return [
      super.styles,
      css`
        /* https://oer.hax.psu.edu/bto108/sites/haxcellence/documentation/ddd */
        
        /* Host */
        :host {
          display: block;
          position: fixed;
          bottom: 10px;
          right: 10px;
        }

        :host([isOpen]) {
          z-index: 100000;
        }

        :host([loading]) .loading {
          display: block;
        }

        /* Button */
        .button-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: var(--ddd-theme-primary, var(--ddd-primary-1));
          width: 72px;
          height: 72px;
          border-radius: 15%;
          padding: var(--ddd-spacing-2);
          cursor: pointer;
        }

        .button-text {
          background-color: white;
          padding: var(--ddd-spacing-0) var(--ddd-spacing-2);
          margin-top: var(--ddd-spacing-1);
        }

        /* Interface */
        .interface-wrapper {
          background-color: var(--ddd-theme-primary, var(--ddd-primary-1));
          border-radius: 25px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 95%;
          height: 95%;
        }

        .chat {
          background-color: var(--ddd-theme-default-white);
          padding: var(--ddd-spacing-2);
          border-radius: 25px;
          width: 90%;
          height: 80%;
        }

        #user-prompt {
          border-radius: 25px;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-5);
          background-color: var(--ddd-theme-default-white);
          color: #000;
          resize: none;
          scrollbar-width: none;
          width: 75%;
        }

        simple-icon-lite,
        simple-icon-button-lite {
          --simple-icon-height: 48px;
          --simple-icon-width: 48px;
          color: var(--ddd-primary-13);
        }

        .hat {
          margin: 0 var(--ddd-spacing-4);
        }
        
        .close {
          --simple-icon-height: 12px;
          --simple-icon-width: 12px;
        }

        dialog[open] {
          opacity: 1;
          position: fixed;
          left: 75.5%;
          top: 65%;
          
          /* transform: scaleY(1); */
        }

        dialog {
          opacity: 0;
          padding: var(--ddd-spacing-0);
          margin: var(--ddd-spacing-0);
          /* transform: scaleY(0); */
          transition:
            opacity 0.7s ease-out,
            transform 0.7s ease-out,
            overlay 0.7s ease-out allow-discrete,
            display 0.7s ease-out allow-discrete;
          width: 25%;
          height: 25%;
          background-color: transparent;
          border: none;
          overflow: hidden;
        }

        input,
        button {
          font-size: var(--ddd-font-size-ms);
        }

        @starting-style {
          dialog[open] {
            opacity: 0;
            /* transform: scaleY(0); */
          }
        }

        dialog::backdrop {
          background-color: rgb(0 0 0 / 0%);
          transition:
            display 0.7s allow-discrete,
            overlay 0.7s allow-discrete,
            background-color 0.7s;
        }

        dialog[open]::backdrop {
          background-color: rgb(0 0 0 / 25%);
        }

        @starting-style {
          dialog[open]::backdrop {
            background-color: rgb(0 0 0 / 0%);
          }
        }
      `,
    ];
  }

  render() {
    return html`
      <!-- Button -->
      <div class="button-wrapper">
        <simple-icon-button-lite icon="hax:wizard-hat" @click="${this.openChat}">
          <div class="button-text">
            Merlin-AI
          </div>
        </simple-icon-button-lite>
      </div>

      <!-- Interface -->
      <dialog>
        <div class="interface-wrapper">
          <div class="controls">
            <simple-icon-button-lite class="close" icon="close" @click="${this.closeChat}"></simple-icon-button-lite>
          </div>
          <div class="chat">
            <simple-icon-lite class="hat" icon="${this.loading ? "hax:loading" : "hax:wizard-hat"}" ></simple-icon-lite>
            <form action="#" @submit="${this.handleSendButton}" id="user-prompt-form">
              <!-- <input id="context" value="${this.context}" type="text" /> -->
              <textarea id="user-prompt" type="text" placeholder="Enter Prompt Here..."></textarea>
              <input id="send-prompt" type="submit" value="Send">

              <!-- <button
                id="submit"
                type="submit"
                name="alfred"
                @click="${this.askQuestion}"
              >
                Ask Alfred
              </button>
              <button
                id="submit2"
                type="submit"
                name="robin"
                @click="${this.askQuestion}"
              >
                Ask Robin
              </button> -->
            </form>
            ${this.question
              ? html` ${this.loading
                  ? ``
                  : html`
                      <div>
                        ${this.answers.map(
                          (answer, i) =>
                            html`<h3 data-primary="13" data-design-treatment="vert">
                                Answer ${i + 1}
                              </h3>
                              <p>${answer}</p>`,
                        )}
                      </div>
                    `}`
              : ``}
          </div>
        </div>
      </dialog>
    `;
  }

  closeChat() {
    this.isOpen = false;
  }

  openChat() {
    this.isOpen = true;
    setTimeout(() => {
      this.shadowRoot.querySelector("#question").focus();
      this.shadowRoot.querySelector("#question").select();
    }, 300);
  }

  // Interface Handlers
  
  /**
   * @description handles the pressing of the Merlin AI button.
   */
  handleAIButton() {
    if (!this.isOpen) { // if not open
      this.handleOpen();
    } else if (this.isOpen) { // if open
      this.handleMinimize();
    }
  }

  /**
   * @description handles the pressing of the minimize button or called by handleAIButton() when the interface is shown in standard mode.
   */
  handleMinimize() {
    this.isOpen = false;
  }

  /**
   * @description uses the variable `this._wasOpenedFirstTime` to determine if the interface should load for the first time, or if it can just open regularly without loading.
   */
  handleOpen() {
    this.isOpen = true;

    if (!this._wasOpenedFirstTime) {
      this._wasOpenedFirstTime = true;
      this.loadAI();
    } else {
      // TODO change CSS so interface is opened instead of closed
    }
  }

  /**
   * @description uses the variable `this._isFullView` to determine if interface should switch to full view or standard view.
   */
  handleResizeButton() {
    switch (this._isFullView) {
      case true:
        this._isFullView = false;
        break;
      case false:
        this._isFullView = true;
        break;
    }
  }

  /**
   * @description will prompt user to ask if they would like to download chat log, then resets AI
   */
  handleResetButton() {
    this.handleResetPromptButtons();
    this.resetAI();
  }

  /**
   * @description handles download chat buttons when the chat is about to be reset.
   */
  handleResetPromptButtons(e) {
    switch (e.target.value) {
      case "yes": {
        this.downloadChatLog();
        break;
      }
      case "no": {
        break;
      }
    }
  }

  /**
   * @description handles the pressing of a suggested prompt
   */
  handleSuggestedPrompt() {

  }

  /**
   * @description handles the pressing of the send prompt button / submission using enter key
   */
  handleSendButton(e) {    
    console.log('send button pressed');
    console.log('target id: ' + e.target.id);
    console.log('Prompt to send: ' + this.shadowRoot.querySelector("#user-prompt").value);
    this.sendPrompt(e, this.shadowRoot.querySelector("#user-prompt").value, e.target.id);
  }

  /**
   * @description handles download chat buttons.
   */
  handleChatDownloadButton() {
    this.downloadChatLog();
  }

    // ! Developer Mode Handlers

    /**
     * @description will output chat log of user, Merlin, or both to console.table()
     */
    handleConsoleTableButtons() {

    }

    /**
     * @description utilizes `this.engine` to other AI engine, either Alfred or Robin 
     */
    handleAISwitch() {
      switch (this.engine) {
        case "alfred": {
          this.engine = "robin";
          break;
        }
        case "robin": {
          this.engine = "alfred";
          break;
        }
      }
      
      console.log("Switched to: " + this.engine);
    }

  // Logic Functions

  /**
   * @description loads the AI
   */
  loadAI() {
    
  }

  /**
   * @description resets the AI
   */
  resetAI() {

  }

  /**
   * @description loads the suggested prompts
   */
  loadSuggestedPrompts() {
    
  }

  /**
   * @description loads merlin's response to submitted prompt
   */
  merlinResponse() {
    
  }

  /**
   * @description sends user inputted prompt or suggested prompt
   * TODO add parameters for content of prompt so it can be sent to AI and written to log
   */
  sendPrompt(e, prompt, targetID) {
    e.preventDefault();
    console.log('sendPrompt() called')
    console.log('target id: ' + targetID);
    console.log('Prompt to send: ' + prompt);

    switch (targetID) {
      case "user-prompt-form": {
        console.log('Prompt sent to AI: ' + prompt);
        this.writeToLog("user", prompt);
        // TODO will send prompt to AI, will also write to log
        break;
      }
      case "suggested-prompt-form": {
        console.log('suggested prompt');
        break;
      }
    }
  }

  /**
   * @description writes message by author to chat log
   * @param {string} author - "merlin" or "user"
   * @param {string} message - message outputted by author
   */
  writeToLog(author, message) {
    const DATE = this.createDate();
    let authorMessageIndex;

    switch (author) {
      case "user": {
        authorMessageIndex = this._userMessageIndex;
        break;
      }
      case "merlin": {
        authorMessageIndex = this._merlinMessageIndex;
        break;
      }
    }

    const logMessage = { // may need to remove quotes around object item names, but quotes are in place for json file
      "messageID": this._messageID,
      "author": author,
      "message": message,
      "authorMessageIndex": authorMessageIndex,
      "date": DATE
    };

    this._chatLog.push(logMessage);

    switch (author) {
      case "user": {
        this.incrementValues("user");
        break;
      }
      case "merlin": {
        this.incrementValues("merlin");
        break;
      }
    }

    this._messageID++;
    console.table(this._chatLog);
  }

  /**
   * @description increments values of author in chat log
   * @param {string} author - "merlin" or "user"
   */
  incrementValues(author) {
    switch (author) {
      case "merlin":
        this._merlinMessageIndex++;
        break;
      case "user":
        this._userMessageIndex++;
        break;
    }
  }

  /**
   * @description creates date for chat log
   * @param {boolean} isFileName - if true, will replace spaces with dashes for better file name
   * @returns {string} date - date in string format
   */
  createDate(isFileName) {
    let date = new Date();

    if (isFileName) {
      date = date.toString().replace(/\s/g, "-");
    }
    
    return date;
  }

  /**
   * @description downloads chat log as .json file
   */
  downloadChatLog() {
    const FILENAME = "Merlin-AI-chat-log-" + this.createDate(true) + ".json";
    const CHAT_LOG = JSON.stringify(this._chatLog); // changes chatlog array to JSON
  }

    // ! Developer Mode Functions

    loadDeveloperMode() {

    }

    /**
     * @description will output chat log of user, Merlin, or both to console.table()
     * @param {string} author - "merlin", "user", or "both"
     */
    consoleTableChatLog(author) {
      
    }

  static get properties() {
    return {
      ...super.properties,
      engine: { type: String },
      question: { type: String },
      context: { type: String },
      answers: { type: Array },
      isOpen: { type: Boolean, reflect: true },
      loading: { type: Boolean, reflect: true },
    };
  }
}

globalThis.customElements.define(SiteAiChat.tag, SiteAiChat);
