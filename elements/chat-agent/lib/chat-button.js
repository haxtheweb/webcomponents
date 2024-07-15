/**
 * Copyright 2024 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { ChatAgentModalStore } from "../chat-agent.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { autorun, toJS, } from "mobx";
import { html, css } from "lit";

class ChatButton extends DDD {

  static get tag() {
    return "chat-button";
  }

  constructor() {
    super();

    this.buttonIcon = null;
    this.isFullView = null;
    this.isInterfaceHidden = null;

    autorun(() => {
      this.buttonIcon = toJS(ChatAgentModalStore.buttonIcon);
      this.isFullView = toJS(ChatAgentModalStore.isFullView);
      this.isInterfaceHidden = toJS(ChatAgentModalStore.isInterfaceHidden);
    })
  }

  static get styles() {
    return [
      super.styles,
      css`
        /* https://oer.hax.psu.edu/bto108/sites/haxcellence/documentation/ddd */
        
        :host {
          display: block;
          z-index: 999998;
        }

        .chat-button-wrapper {
          background-color: var(--data-theme-primary, var(--ddd-primary-1));
          display: flex;
          width: 96px;
          height: 96px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: var(--ddd-radius-lg);
          cursor: pointer;
          box-shadow: var(--ddd-boxShadow-xl);
        }

        :host([is-full-view]:not([is-interface-hidden])) .chat-button-wrapper {
          display: none;
        }

        /* TODO modfiy focus to lose focus when no longer hovering or after click https://stackoverflow.com/questions/19053181/how-to-remove-focus-around-buttons-on-click */
        .chat-button-wrapper:hover .label-wrapper, .chat-button-wrapper:focus .label-wrapper {
          text-decoration: underline;
        }

        .icon-wrapper {
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--ddd-theme-default-white);
          border-radius: var(--ddd-radius-circle);
          margin-bottom: var(--ddd-spacing-1);
        }

        simple-icon-lite {
          color: var(--data-theme-primary, var(--ddd-primary-13));
          --simple-icon-height: var(--ddd-icon-md);
          --simple-icon-width: var(--ddd-icon-md);
        }

        .label-wrapper {
          padding: var(--ddd-spacing-1);
          background-color: var(--ddd-theme-default-white);
          color: var(--ddd-theme-default-potentialMidnight);
          border-radius: var(--ddd-radius-xs);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-medium);
          max-width: var(--ddd-spacing-19);
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `
    ];
  }

  render() {
    return html`
      <div class="chat-button-wrapper" @click=${this.handleChatButton} @keypress=${this.keyPress} tabindex="0">
        <div class="icon-wrapper">
          <simple-icon-lite icon="${ChatAgentModalStore.buttonIcon}"></simple-icon-lite>
        </div>
        <div class="label-wrapper">
          <slot name="label">${ChatAgentModalStore.buttonLabel}</slot>
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
      ChatAgentModalStore.developerModeEnabled ? console.info('HAX-DEV-MODE: Chat button pressed using Enter key.') : null;
      this.handleChatButton();
    }
  }

  /**
   * @description - handles button being clicked / pressed, will toggle the interface visibility
   */
  handleChatButton() {
    ChatAgentModalStore.developerModeEnabled ? console.info('HAX-DEV-MODE: Chat button pressed.') : null;

    ChatAgentModalStore.isInterfaceHidden = !this.isInterfaceHidden;
  }

  static get properties() {
    return {
      ...super.properties,
      buttonIcon: {
        type: String,
        attribute: "button-icon",
      },
      buttonLabel: {
        type: String,
        attribute: "button-label",
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

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(ChatButton.tag, ChatButton);
export { ChatButton };