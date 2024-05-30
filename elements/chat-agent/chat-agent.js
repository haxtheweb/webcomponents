/**
 * Copyright 2024 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import "./lib/chat-button.js";
import "./lib/chat-control-bar.js";
import "./lib/chat-input.js";
import "./lib/chat-interface.js";
import "./lib/chat-message.js";
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

    // button
    this.buttonLabel = "Chat";

    // control bar


    // input
    this.promptPlaceholder = "Enter your prompt here...";

    // message
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
        :host {
          display: block;
        }
      `,
    ];
  }
  /**
   * LitElement render callback
   */
  render() {
    return html`
      <div>
        <chat-interface placeholder="${this.promptPlaceholder}"></chat-interface>
        <chat-button>
          <span slot="label"><slot name="label">${this.buttonLabel}</slot></span>
        </chat-button>
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
    }
  }
}
customElements.define(ChatAgent.tag, ChatAgent);
export { ChatAgent };
