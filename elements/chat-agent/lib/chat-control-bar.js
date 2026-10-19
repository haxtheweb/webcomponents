/**
 * Copyright 2024 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { css, html } from "lit";
import { autorun, toJS } from "mobx";
import { ChatStore } from "./chat-agent-store.js";

class ChatControlBar extends I18NMixin(DDD) {
  static get tag() {
    return "chat-control-bar";
  }

  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      downloadLogAsTxt: "Download Log as txt",
      downloadChatLog: "Download Chat Log",
      resetChat: "Reset Chat",
      toggleDataCollection: "Toggle Data Collection",
      dataCollection: "Data Collection",
      toggleDeveloperMode: "Toggle Developer Mode",
      exitFullView: "Exit Full View",
      enterFullView: "Enter Full View",
      hideInterface: "Hide Interface",
      resetChatConfirm: "Reset the chat?",
      downloadBeforeResetConfirm: "Download the chat log before you reset?",
      dataCollectionOn:
        "Your conversations will be used to train our AI models",
      dataCollectionOff:
        "Your conversations will not be used to train our AI models",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../locales/", import.meta.url).href,
    });

    this.dataCollectionEnabled = null;
    this.isFullView = null;
    this.isInterfaceHidden = null;
    this.__disposer = [];

    this.__disposer.push(
      autorun(() => {
        const _mobx_val_0 = toJS(ChatStore.dataCollectionEnabled);
        Promise.resolve().then(() => {
          this.dataCollectionEnabled = _mobx_val_0;
        });
      }),
    );

    this.__disposer.push(
      autorun(() => {
        const _mobx_val_0 = toJS(ChatStore.isFullView);
        Promise.resolve().then(() => {
          this.isFullView = _mobx_val_0;
        });
      }),
    );

    this.__disposer.push(
      autorun(() => {
        const _mobx_val_0 = toJS(ChatStore.isInterfaceHidden);
        Promise.resolve().then(() => {
          this.isInterfaceHidden = _mobx_val_0;
        });
      }),
    );
  }

  static get styles() {
    return [
      super.styles,
      css`
        /* https://haxtheweb.org/documentation/ddd */

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
          background-color: var(--ddd-primary-4);
          border-radius: var(--ddd-radius-sm);
          color: var(--ddd-theme-default-white);
        }

        button:hover,
        button:focus-visible {
          background-color: var(--ddd-primary-6);
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
        @media only screen and (max-width: 425px),
          only screen and (max-height: 616px) {
          #view-button {
            display: none;
          }
        }

        @container (max-width: 330px) {
          .data-collection-label {
            display: none;
          }
        }
      `,
    ];
  }

  render() {
    return html`
      <!-- https://open-apis.hax.cloud/?path=/story/media-icons--hax-iconset-story -->

      <div class="chat-control-bar-wrapper">
        <div class="left-side">
          <button
            id="download-button"
            @click=${this.handleDownloadLogButton}
            aria-label="${this.t.downloadLogAsTxt}"
          >
            <simple-icon-lite icon="icons:file-download"></simple-icon-lite>
          </button>
          <simple-tooltip
            for="download-button"
            position="${this.isFullView ? "right" : "top"}"
            >${this.t.downloadChatLog}</simple-tooltip
          >

          <button
            id="reset-button"
            @click=${this.handleResetButton}
            aria-label="${this.t.resetChat}"
          >
            <simple-icon-lite icon="icons:refresh"></simple-icon-lite>
          </button>
          <simple-tooltip
            for="reset-button"
            position="${this.isFullView ? "right" : "top"}"
            >${this.t.resetChat}</simple-tooltip
          >

          <button
            id="data-collection-button"
            @click=${this.handleDataCollectionButton}
            aria-label="${this.t.toggleDataCollection}"
          >
            <simple-icon-lite
              icon="lrn:data_usage"
              class="data-collection-icon"
            ></simple-icon-lite>
            <span class="data-collection-label"
              >${this.t.dataCollection}</span
            >
          </button>
          <simple-tooltip
            for="data-collection-button"
            position="${this.isFullView ? "right" : "top"}"
            >${this.t.toggleDataCollection}</simple-tooltip
          >

          <button
            id="dev-mode-button"
            @click=${this.handleDevModeButton}
            aria-label="${this.t.toggleDeveloperMode}"
          >
            <simple-icon-lite icon="hax:console-line"></simple-icon-lite>
          </button>
          <simple-tooltip
            for="dev-mode-button"
            position="${this.isFullView ? "right" : "top"}"
            >${this.t.toggleDeveloperMode}</simple-tooltip
          >
        </div>
        <div class="right-side">
          <button
            id="view-button"
            @click=${this.handleViewButton}
            aria-label="${this.isFullView
              ? this.t.exitFullView
              : this.t.enterFullView}"
          >
            <simple-icon-lite
              icon="${this.isFullView
                ? "icons:fullscreen-exit"
                : "icons:fullscreen"}"
            ></simple-icon-lite>
          </button>
          <simple-tooltip
            for="view-button"
            position="${this.isFullView ? "left" : "top"}"
            >${this.isFullView
              ? this.t.exitFullView
              : this.t.enterFullView}</simple-tooltip
          >

          ${this.isFullView
            ? html`
                <button
                  id="hide-button"
                  @click=${this.handleHideButton}
                  aria-label="${this.t.hideInterface}"
                >
                  <simple-icon-lite icon="remove"></simple-icon-lite>
                </button>
                <simple-tooltip
                  for="hide-button"
                  position="${this.isFullView ? "left" : "top"}"
                  >${this.t.hideInterface}</simple-tooltip
                >
              `
            : ""}
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

    if (confirm(this.t.resetChatConfirm)) {
      if (confirm(this.t.downloadBeforeResetConfirm)) {
        ChatStore.devStatement(
          "Download chat log before reset confirmed.",
          "info",
        );
        this.downloadChatLog();
      } else {
        ChatStore.devStatement(
          "Download chat log before reset denied.",
          "warning",
        );
      }
      this.resetChat();
    }
  }

  /**
   * @description - handles the functionality of the data collection button
   */
  handleDataCollectionButton() {
    ChatStore.dataCollectionEnabled = !ChatStore.dataCollectionEnabled;

    this.dataCollectionEnabled
      ? alert(this.t.dataCollectionOn)
      : alert(this.t.dataCollectionOff);
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

    ChatStore.devStatement(
      "View switched to: " + (ChatStore.isFullView ? "full" : "standard"),
      "info",
    );
  }

  /**
   * @description changes the interface window to be hidden and unfocusable
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

    ChatStore.handleDownload("txt");
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

  disconnectedCallback() {
    while (this.__disposer.length) {
      const dispose = this.__disposer.pop();
      if (dispose && typeof dispose === "function") {
        dispose();
      }
    }
    super.disconnectedCallback();
  }

  static get properties() {
    return {
      ...super.properties,
      dataCollectionEnabled: {
        type: Boolean,
        attribute: "data-collection-enabled",
        reflect: true,
      },
      isFullView: {
        type: Boolean,
        attribute: "is-full-view",
        reflect: true,
      },
      isInterfaceHidden: {
        type: Boolean,
        attribute: "is-interface-hidden",
        reflect: true,
      },
    };
  }
}

globalThis.customElements.define(ChatControlBar.tag, ChatControlBar);
export { ChatControlBar };
