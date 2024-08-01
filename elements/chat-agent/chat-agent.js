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
import "@haxtheweb/rpg-character/rpg-character.js";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-cta/simple-cta.js";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { html, css } from "lit";
import { HAXCMSSiteEditorUI } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-editor-ui.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import {
  observable,
  makeObservable,
  computed,
  configure,
  autorun,
  toJS,
} from "mobx";
configure({ enforceActions: false });
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import { enableServices } from "@haxtheweb/micro-frontend-registry/lib/microServices.js";
import { ChatStore } from "./lib/chat-agent-store.js";
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
 * `chat-agent`
 * `chatbot agent style chat widget`
 * @demo demo/index.html
 * @element chat-agent
 */
class ChatAgent extends DDD {
  /**
   * Convention we use
   */
  static get tag() {
    return "chat-agent";
  }

  /**
   * HTMLElement
   */
  constructor() {
    super();

    this.isFullView = null;
    this.isInterfaceHidden = null;

    autorun(() => {
      this.isFullView = toJS(ChatStore.isFullView);
      this.isInterfaceHidden = toJS(ChatStore.isInterfaceHidden);
    });
  }

  /**
   * LitElement style callback
   */
  static get styles() {
    return [
      super.styles,
      css`
        /* https://oer.hax.psu.edu/bto108/sites/haxcellence/documentation/ddd */

        :host {
          container-type: normal;
          display: block;
        }

        .chat-agent-wrapper {
          bottom: var(--ddd-spacing-2);
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-2);
          position: fixed;
          right: var(--ddd-spacing-2);
          width: 35%;        
        }

        :host([is-full-view]) .chat-agent-wrapper {
          bottom: var(--ddd-spacing-0);
          gap: var(--ddd-spacing-0);
          right: var(--ddd-spacing-0);
          width: 25%;
          @media only screen and (min-height: 1000px) {
            width: 35%;
          }
        }

        :host([is-full-view]:host([is-interface-hidden])) .chat-agent-wrapper {
          bottom: var(--ddd-spacing-2);
          gap: var(--ddd-spacing-2);
          right: var(--ddd-spacing-2);
        }

        .agent-interface-wrapper {
          display: flex;
          justify-content: right;
        }

        .agent-button-wrapper {
          display: flex;
          justify-content: right;
        }

        @container (max-width: 600px) {
          .chat-agent-wrapper {
            width: 30%;
          }
        }

        @media only screen and (max-width: 425px) {
          .chat-agent-wrapper {
            width: 90%;
          }
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
          <chat-interface></chat-interface>
        </div>
        <div class="agent-button-wrapper">
          <chat-button>
            <span slot="label">${ChatStore.buttonLabel}</span>
          </chat-button>
        </div>
      </div>
    `;
  }

  /**
   * @descrition LitElement ready / starts AI
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }

    ChatStore.startAI();
  }

  static get properties() {
    return {
      ...super.properties,
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

customElements.define(ChatAgent.tag, ChatAgent);
export { ChatAgent };

// TODO causing inefficiency, abstract to it's own class
// register globally so we can make sure there is only one
globalThis.ChatAgentStore = globalThis.ChatAgentStore || {};
// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same modal
globalThis.ChatAgentStore.requestAvailability = () => {
  if (!globalThis.ChatAgentStore.instance) {
    globalThis.ChatAgentStore.instance = document.createElement("chat-agent");
    document.body.appendChild(globalThis.ChatAgentStore.instance);
  }
  return globalThis.ChatAgentStore.instance;
};


// ! Chat Agent Store
export const ChatAgentModalStore =
  globalThis.ChatAgentStore.requestAvailability();