import { DDDSuper, DDDPulseEffectSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { html, css, LitElement } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { toJS } from "mobx";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import { enableServices } from "@haxtheweb/micro-frontend-registry/lib/microServices.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";

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
});

export class SiteAiChat extends DDDPulseEffectSuper(DDDSuper(LitElement)) {
  static get tag() {
    return "site-ai-chat";
  }
  constructor() {
    super();
    this.opened = false;
    this.question = null;
    this.answers = [];
    this.loading = false;
    this.context = toJS(store.manifest.metadata.site.name);
    this.engine = "alfred";
    this.dataPulse = "1";
  }

  askQuestion(e) {
    e.preventDefault();
    this.engine = e.target.getAttribute("name");
    this.context = this.shadowRoot.querySelector("#context").value;
    this.question = this.shadowRoot.querySelector("#question").value;
    this.requestAIFeedback();
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (changedProperties.has("opened")) {
      if (this.opened) {
        this.shadowRoot.querySelector("dialog").showModal();
      } else {
        this.shadowRoot.querySelector("dialog").close();
      }
    }
  }

  requestAIFeedback() {
    const site = toJS(store.manifest);
    var base = "";
    if (globalThis.document.querySelector("base")) {
      base = globalThis.document.querySelector("base").href;
    }
    const params = {
      site: {
        file: base + "site.json",
        metadata: site.metadata,
      },
      type: "site",
      question: this.question,
      engine: this.engine,
      context: this.context,
    };
    this.loading = true;
    MicroFrontendRegistry.call("@haxcms/aiChat", params)
      .then((d) => {
        if (d.status == 200) {
          this.answers = [...d.data.answers];
          this.question = d.data.question;
        }
        this.loading = false;
      })
      .catch((error) => {
        this.loading = false;
        console.error(error);
      });
  }

  render() {
    return html`
      <simple-icon-button-lite icon="hax:wizard-hat" @click="${this.openChat}"
        >Ask a question</simple-icon-button-lite
      >
      <dialog class="chat">
        <simple-icon-button-lite
          class="close"
          icon="close"
          @click="${this.closeChat}"
          >Close</simple-icon-button-lite
        >
        <form action="#">
          <simple-icon-lite
            class="hat"
            icon="${this.loading ? "hax:loading" : "hax:wizard-hat"}"
          ></simple-icon-lite>
          <input id="context" value="${this.context}" type="text" />
          <input id="question" type="text" placeholder="Ask your question.." />

          <button
            id="submit"
            type="submit"
            name="alfred"
            @click="${this.askQuestion}"
          >
            Ask Alfred
          </button>
          <button
            id="submit2"
            type="submit"
            name="robin"
            @click="${this.askQuestion}"
          >
            Ask Robin
          </button>
        </form>
        ${this.question
          ? html` ${this.loading
              ? ``
              : html`
                  <div>
                    ${this.answers.map(
                      (answer, i) =>
                        html`<h3 data-primary="13" data-design-treatment="vert">
                            Answer ${i + 1}
                          </h3>
                          <p>${answer}</p>`,
                    )}
                  </div>
                `}`
          : ``}
      </dialog>
    `;
  }

  closeChat() {
    this.opened = false;
  }
  openChat() {
    this.opened = true;
    setTimeout(() => {
      this.shadowRoot.querySelector("#question").focus();
      this.shadowRoot.querySelector("#question").select();
    }, 300);
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
          z-index: 100000;
        }
        :host([loading]) .loading {
          display: block;
        }
        simple-icon-lite,
        simple-icon-button-lite {
          --simple-icon-height: 48px;
          --simple-icon-width: 48px;
          color: var(--ddd-primary-13);
        }
        .hat {
          margin: 0 var(--ddd-spacing-4);
        }
        .close {
          position: absolute;
          top: 0;
          right: 0;
          --simple-icon-height: 24px;
          --simple-icon-width: 24px;
        }
        dialog[open] {
          opacity: 1;
          position: fixed;
          left: 25%;
          right: 25%;
          top: 25%;
          bottom: 25%;
          transform: scaleY(1);
        }
        dialog {
          opacity: 0;
          padding: var(--ddd-spacing-10);
          transform: scaleY(0);
          transition:
            opacity 0.7s ease-out,
            transform 0.7s ease-out,
            overlay 0.7s ease-out allow-discrete,
            display 0.7s ease-out allow-discrete;
        }
        input,
        button {
          font-size: var(--ddd-font-size-ms);
        }
        @starting-style {
          dialog[open] {
            opacity: 0;
            transform: scaleY(0);
          }
        }

        dialog::backdrop {
          background-color: rgb(0 0 0 / 0%);
          transition:
            display 0.7s allow-discrete,
            overlay 0.7s allow-discrete,
            background-color 0.7s;
        }

        dialog[open]::backdrop {
          background-color: rgb(0 0 0 / 25%);
        }
        @starting-style {
          dialog[open]::backdrop {
            background-color: rgb(0 0 0 / 0%);
          }
        }
      `,
    ];
  }

  static get properties() {
    return {
      ...super.properties,
      engine: { type: String },
      question: { type: String },
      context: { type: String },
      answers: { type: Array },
      opened: { type: Boolean, reflect: true },
      loading: { type: Boolean, reflect: true },
    };
  }
}

globalThis.customElements.define(SiteAiChat.tag, SiteAiChat);
