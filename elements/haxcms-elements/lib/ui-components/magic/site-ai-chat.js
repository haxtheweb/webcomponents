import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { css, LitElement } from "lit";

export class SiteAiChat extends (DDDSuper(LitElement)) {
  static get tag() {
    return "site-ai-chat";
  }

  constructor() {
    super();
    import("@haxtheweb/chat-agent/chat-agent.js");
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

  static get properties() {
    return {
      ...super.properties,
    };
  }
}

globalThis.customElements.define(SiteAiChat.tag, SiteAiChat);
