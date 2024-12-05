/**
 * Copyright 2024 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { css, html } from "lit";
import { autorun, toJS } from "mobx";
import { ChatStore } from "./chat-agent-store.js";

class ChatButton extends DDD {
  static get tag() {
    return "chat-button";
  }

  constructor() {
    super();

    this.buttonIcon = null;
    this.darkMode = null;
    this.isFullView = null;
    this.isInterfaceHidden = null;

    autorun(() => {
      this.buttonIcon = toJS(ChatStore.buttonIcon);
    });

    autorun(() => {
      this.darkMode = toJS(ChatStore.darkMode);
    });

    autorun(() => {
      this.isFullView = toJS(ChatStore.isFullView);
    });

    autorun(() => {
      this.isInterfaceHidden = toJS(ChatStore.isInterfaceHidden);
    });
  }

  static get styles() {
    return [
      super.styles,
      css`
        /* https://haxtheweb.org/documentation/ddd */

        :host {
          display: block;
          z-index: 999998;
        }

        .chat-button-wrapper {
          align-items: center;
          background-color: var(--data-theme-primary, var(--ddd-primary-1));
          border-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          border-radius: var(--ddd-radius-lg);
          border-style: solid;
          border-width: 0.75px;
          box-shadow: 0 4px rgba(0, 3, 33, 0.4);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          height: 96px;
          justify-content: center;
          width: 96px;
        }

        .chat-button-wrapper:hover,
        .chat-button-wrapper:focus-visible {
          box-shadow: 0 6px rgba(0, 3, 33, 0.4);
          transform: translateY(-2px);
        }

        .chat-button-wrapper:active, .chat-button-wrapper.active-mimic /* :active does not work with keypress by default */ {
          box-shadow: 0 1px rgba(0, 3, 33, 0.4);
          transform: translateY(3px);
        }

        :host([is-full-view]:not([is-interface-hidden])) .chat-button-wrapper {
          display: none;
        }

        .chat-button-wrapper:hover .label-wrapper,
        .chat-button-wrapper:focus-visible .label-wrapper {
          text-decoration: underline;
        }

        .icon-wrapper {
          align-items: center;
          background-color: var(--ddd-theme-default-white);
          border-radius: var(--ddd-radius-circle);
          display: flex;
          height: 56px;
          justify-content: center;
          margin-bottom: var(--ddd-spacing-1);
          width: 56px;
        }

        simple-icon-lite {
          --simple-icon-height: var(--ddd-icon-md);
          --simple-icon-width: var(--ddd-icon-md);
          color: var(--data-theme-primary, var(--ddd-primary-13));
        }

        .label-wrapper {
          background-color: var(--ddd-theme-default-white);
          border-radius: var(--ddd-radius-xs);
          color: var(--ddd-theme-default-coalyGray);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-medium);
          max-width: var(--ddd-spacing-19);
          overflow: hidden;
          padding: var(--ddd-spacing-1);
          text-align: center;
          text-overflow: ellipsis;
          white-space: nowrap;

          /* Prevent text highlighting in button */
          -moz-user-select: none;
          -ms-user-select: none;
          -webkit-user-select: none;
          user-select: none;
        }

        :host([dark-mode]) .label-wrapper {
          background-color: var(--ddd-theme-default-coalyGray);
          color: var(--ddd-theme-default-white);
        }
      `,
    ];
  }

  render() {
    return html`
      <div
        class="chat-button-wrapper"
        @click=${this.handleChatButton}
        @keypress=${this.keyPress}
        tabindex="0"
        aria-label="${this.isInterfaceHidden
          ? "Open Interface"
          : "Close Interface"}"
      >
        <div class="icon-wrapper">
          <simple-icon-lite icon="${this.buttonIcon}"></simple-icon-lite>
        </div>
        <div class="label-wrapper" unselectable="on">
          <slot name="label">${ChatStore.buttonLabel}</slot>
        </div>
      </div>
    `;
  }

  /**
   * @description - handles enter key press
   * @param {event} e - enter key press
   */
  keyPress(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      ChatStore.devStatement("Chat button pressed using Enter key.", "log");

      // mimic :active since it only works on click
      const CHAT_BUTTON_WRAPPER = this.shadowRoot.querySelector(
        ".chat-button-wrapper",
      );

      if (CHAT_BUTTON_WRAPPER.classList.contains("active-mimic")) {
        CHAT_BUTTON_WRAPPER.classList.remove("active-mimic");
      } else {
        CHAT_BUTTON_WRAPPER.classList.add("active-mimic");
      }

      setTimeout(() => {
        CHAT_BUTTON_WRAPPER.classList.remove("active-mimic");
      }, 100);

      this.handleChatButton();
    }
  }

  /**
   * @description - handles button being clicked / pressed, will toggle the interface visibility
   */
  handleChatButton() {
    ChatStore.devStatement("Chat button pressed.", "log");

    ChatStore.isInterfaceHidden = !this.isInterfaceHidden;
  }

  static get properties() {
    return {
      ...super.properties,
      buttonIcon: {
        type: String,
        attribute: "button-icon",
      },
      darkMode: {
        type: Boolean,
        attribute: "dark-mode",
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

globalThis.customElements.define(ChatButton.tag, ChatButton);
export { ChatButton };
