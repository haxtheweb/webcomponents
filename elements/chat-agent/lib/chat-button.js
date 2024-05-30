/**
 * Copyright 2024 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import '@haxtheweb/simple-icon/simple-icon.js';

class ChatButton extends DDD {

  static get tag() {
    return "chat-button";
  }

  constructor() {
    super();
    this.icon = "hax:wizard-hat";
    this.label = "Chat";
  }

  static get styles() {
    return [
      super.styles,
      css`
        /* https://oer.hax.psu.edu/bto108/sites/haxcellence/documentation/ddd */
        
        :host {
          display: block;
        }

        .chat-button-wrapper {
          background-color: var(--data-theme-primary, var(--ddd-primary-1));
          display: flex;
          width: 96px;
          height: 96px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          cursor: pointer;
        }

        .icon-wrapper {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--ddd-theme-default-white);
          border-radius: 100%;
          margin-bottom: var(--ddd-spacing-1);
        }

        simple-icon-lite {
          color: var(--data-theme-primary, var(--ddd-primary-13));
          --simple-icon-height: 36px;
          --simple-icon-width: 36px;
        }

        .label-wrapper {
          padding: var(--ddd-spacing-1);
          background-color: var(--ddd-theme-default-white);
          color: var(--ddd-theme-default-potentialMidnight);
          border-radius: 4px;
          font-size: var(--ddd-font-size-4xs);
          font-weight: 500;
          text-align: center;
        }
      `
    ];
  }

  render() {
    return html`
      <div class="chat-button-wrapper">
        <div class="icon-wrapper">
          <simple-icon-lite icon="${this.icon}"></simple-icon-lite>
        </div>
        <div class="label-wrapper">
          <slot name="label">${this.label}</slot>
        </div>
      </div>
    `;
  }

  static get properties() {
    return {
      ...super.properties,
      label: {
        type: String,
      }
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