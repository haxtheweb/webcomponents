import { DDDSuper, DDDPulseEffectSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { html, css, LitElement } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { toJS } from "mobx";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import { enableServices } from "@haxtheweb/micro-frontend-registry/lib/microServices.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/chat-agent/chat-agent.js";

export class SiteAiChat extends DDDPulseEffectSuper(DDDSuper(LitElement)) {
  static get tag() {
    return "site-ai-chat";
  }

  constructor() {
    super();
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
