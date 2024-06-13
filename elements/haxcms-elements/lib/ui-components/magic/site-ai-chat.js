import { DDDSuper, DDDPulseEffectSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { html, css, LitElement } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { toJS } from "mobx";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import { enableServices } from "@haxtheweb/micro-frontend-registry/lib/microServices.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/chat-agent/chat-agent.js";


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

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }
      `,
    ];
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