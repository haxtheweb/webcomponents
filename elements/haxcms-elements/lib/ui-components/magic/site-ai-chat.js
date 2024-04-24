/*
curl -X POST http://ec2-44-205-57-53.compute-1.amazonaws.com/handle-query \
     -H "Content-Type: application/json" \
     -d '{"question":"what are forms of energy?", "course":"phys211"}'

*/
import { DDD, DDDPulseEffectSuper } from "@lrnwebcomponents/d-d-d/d-d-d.js";
import { html, css } from "lit";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js";

export class SiteAiChat extends DDDPulseEffectSuper(DDD) {
  static get tag() {
    return "site-ai-chat";
  }
  constructor() {
    super();
    this.opened = false;
    this.question = null;
    this.answer = null;
    this.context = "phys211";
    this.aiChatSource =
      "http://ec2-44-205-57-53.compute-1.amazonaws.com/handle-query";
    this.dataPulse = "1";
  }

  askQuestion() {
    this.question = this.shadowRoot.querySelector("#question").value;
    this.shadowRoot.querySelector("#question").value = "...";
  }

  updated(changedProperties) {
    if (changedProperties.has("question") && this.question) {
      fetch(this.aiChatSource, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-cache",
        mode: "no-cors",
        redirect: "follow",
        body: JSON.stringify({
          "question": this.question,
          "course": this.context,
        }),
      })
        .then((d) => (d.ok ? d.json() : null))
        .then((response) => {
          console.log(response);
          this.answer = response;
        });
    }
  }

  render() {
    return html`
      <simple-icon-button-lite icon="hax:wizard-hat" @click="${this.openChat}"
        >Ask a question</simple-icon-button-lite
      >
      <div class="chat">
        <input id="question" type="text" /><button
          id="submit"
          @click="${this.askQuestion}"
        >
          Ask question
        </button>
        <div>${this.answer}</div>
      </div>
    `;
  }

  openChat() {
    this.opened = !this.opened;
  }
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          position: absolute;
          bottom: 10px;
          right: 10px;
        }
        :host([opened]) {
          background-color: orange;
          color: black;
          top: 100px;
          left: 100px;
          right: 100px;
          bottom: 100px;
          z-index: 10000000;
        }
        .chat {
          display: none;
        }
        :host([opened]) .chat {
          display: block;
        }

        simple-icon-button-lite {
          --simple-icon-height: 48px;
          --simple-icon-width: 48px;
          color: var(--ddd-primary-13);
        }
      `,
    ];
  }

  static get properties() {
    return {
      question: { type: String },
      aiChatSource: { type: String },
      context: { type: String },
      opened: { type: Boolean, reflect: true },
    };
  }
}

globalThis.customElements.define(SiteAiChat.tag, SiteAiChat);
