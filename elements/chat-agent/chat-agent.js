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
/**
 * `chat-agent`
 * `chatbot agent style chat widget`
 * @demo demo/index.html
 * @element chat-agent
 */
class ChatAgent extends DDD {
  /**
   * HTMLElement
   */
  constructor() {
    super();

    // everything
    this.engine = "alfred";

    // button
    this.buttonLabel = "Chat";

    // control bar


    // input
    this.promptPlaceholder = "Enter your prompt here...";

    // message


    // developer panel
    this.enableDeveloperPanel = false;
  }
  /**
   * LitElement style callback
   */
  static get styles() {
    // support for using in other classes
    let styles = [];
    if (super.styles) {
      styles = super.styles;
    }
    return [
      ...styles,
      css`
        /* https://oer.hax.psu.edu/bto108/sites/haxcellence/documentation/ddd */

        :host {
          display: block;
        }

        .chat-agent-wrapper {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-2);
          position: fixed;
          bottom: var(--ddd-spacing-2);
          right: var(--ddd-spacing-2);
          width: 40%;
        }

        /* :host([enableDeveloperPanel]), .chat-agent-wrapper {
          width: 50%;
        } */

        .agent-interface-wrapper {
          display: flex;
          justify-content: right;
        }

        .agent-button-wrapper {
          display: flex;
          justify-content: right;
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
          ${this.enableDeveloperPanel ? html`
            <chat-interface placeholder="${this.promptPlaceholder}" developer-panel></chat-interface>
          ` : html`
            <chat-interface placeholder="${this.promptPlaceholder}"></chat-interface>
          `}
        </div>
        <div class="agent-button-wrapper">
          <chat-button>
            <span slot="label"><slot name="label">${this.buttonLabel}</slot></span>
          </chat-button>
        </div>
      </div>
    `;
  }
  /**
   * Convention we use
   */
  static get tag() {
    return "chat-agent";
  }
  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }

    if (this.enableDeveloperPanel) {
      console.info("HAX-DEV-MODE: Developer panel is enabled");
    }
  }
  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      /* notify example
      // notify
      if (propName == 'format') {
        this.dispatchEvent(
          new CustomEvent(`${propName}-changed`, {
            detail: {
              value: this[propName],
            }
          })
        );
      }
      */
      /* observer example
      if (propName == 'activeNode') {
        this._activeNodeChanged(this[propName], oldValue);
      }
      */
      /* computed example
      if (['id', 'selected'].includes(propName)) {
        this.__selectedChanged(this.selected, this.id);
      }
      */
    });
  }

  static get properties() {
    return {
      ...super.properties,
      buttonLabel: {
        type: String,
        attribute: "button-label",
      },
      promptPlaceholder: {
        type: String,
        attribute: "placeholder",
      },
      enableDeveloperPanel: {
        type: Boolean,
        attribute: "developer-panel",
      },
    }
  }
}
customElements.define(ChatAgent.tag, ChatAgent);
export { ChatAgent };
