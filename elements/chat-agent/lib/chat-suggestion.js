/**
 * Copyright 2024 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */

import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";

class ChatSuggestion extends DDD {
  
  static get tag() {
    return "chat-suggestion";
  }

  constructor() {
    super();
    this.suggestion = '';
    this.active = true;
    this.developerModeEnabled = false;
  }

  static get styles() {
    return [
      super.styles,
      css`
        /* https://oer.hax.psu.edu/bto108/sites/haxcellence/documentation/ddd */

        :host {
          display: block;
        }

        .chat-suggestion-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: var(--ddd-theme-default-successLight);
          border: var(--ddd-border-sm);
          border-radius: var(--ddd-radius-rounded);
          border-color: var(--ddd-theme-default-potentialMidnight);
          opacity: 1.0;
          cursor: pointer;
        }

        /* :host([active]) .chat-suggestion-wrapper {
          cursor: pointer;
          opacity: 1.0;
        } */

        /* TODO: Set the opacity to 0.4 and cursor to normal when not active. Also set the background color to a yellower shade. NOT CURRENTLY WORKING */

        p {
          color: var(--ddd-theme-default-potentialMidnight);
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-4xs);
        }
      `
    ];
  }

  render() {
    return html`
      <div class="chat-suggestion-wrapper">
        <p class="chat-suggestion">
          <slot name="suggestion">${this.suggestion}</slot>
        </p>  
      </div>
    `;
  }

  static get properties() {
    return {
      ...super.properties,
      suggestion: { type: String },
      active: { type: Boolean },
      developerModeEnabled: { 
        type: Boolean, 
        attribute: "developer-mode"
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

globalThis.customElements.define(ChatSuggestion.tag, ChatSuggestion);
export { ChatSuggestion };