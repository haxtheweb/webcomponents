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
    this.suggestion;
  }

  static get styles() {
    return [
      super.styles,
      css`
        /* https://oer.hax.psu.edu/bto108/sites/haxcellence/documentation/ddd */

        :host {
          display: block;
        }
      `
    ];
  }

  render() {
    return html`
      <div class="chat-suggestion-wrapper">
        <slot name="suggestion">${this.suggestion}</slot>
      </div>
    `;
  }

  static get properties() {
    return {
      ...super.properties,
      suggestion: { type: String },
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