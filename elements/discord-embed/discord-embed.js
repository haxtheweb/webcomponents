/**
 * Copyright 2023 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { LitElement, html, css } from "lit";
import "@haxtheweb/iframe-loader/iframe-loader.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import {
  DDDBlockStyles,
  renderDDDBlockHeader,
} from "@haxtheweb/d-d-d/lib/DDDBlock.js";

// hosts allowed to be framed; matched against the parsed hostname so values
// like https://evil.test/?discord.com cannot pass (CodeQL
// js/incomplete-url-substring-sanitization)
const DISCORD_EMBED_HOSTS = ["discord.com", "e.widgetbot.io"];

function isDiscordEmbedSource(source) {
  if (typeof source !== "string" || source === "") {
    return false;
  }
  let host = "";
  try {
    const parsed = new URL(source);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return false;
    }
    host = parsed.hostname.toLowerCase();
  } catch {
    return false;
  }
  return DISCORD_EMBED_HOSTS.some(
    (domain) => host === domain || host.endsWith("." + domain),
  );
}
/**
 * `discord-embed`
 * `widgetbot.io based embed widget for discord threads and channels`
 * @demo demo/index.html
 * @element discord-embed
 */
class DiscordEmbed extends I18NMixin(LitElement) {
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      discordChatEmbed: "Discord chat embed",
      invalidShareLink: "Invalid Discord share link",
      chat: "Chat",
      openOnDiscord: "Open on Discord in a new tab",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("./locales/", import.meta.url).href,
    });
    this.source = "";
    this.height = "500";
    this.width = "100%";
    this.__io = null;
    this.__deferredPromoted = false;
  }
  static get styles() {
    return [
      DDDBlockStyles,
      css`
        :host {
          display: block;
        }
        .ddd-block-body iframe {
          display: block;
          max-width: 100%;
          border: 0;
        }
      `,
    ];
  }
  static get properties() {
    return {
      height: { type: String },
      width: { type: String },
      source: {
        type: String,
        reflect: true,
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
  /**
   * Convention we use
   */
  static get tag() {
    return "discord-embed";
  }

  render() {
    return html`${
      this.source && isDiscordEmbedSource(this.source)
        ? html`
            <div class="ddd-block">
              ${renderDDDBlockHeader({
                icon: "communication:forum",
                label: html`${this.t.chat} · Discord`,
                actions: html`<a
                  class="ddd-block-action"
                  href="${this._openUrl}"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="${this.t.openOnDiscord}"
                  title="${this.t.openOnDiscord}"
                  ><simple-icon-lite
                    icon="icons:open-in-new"
                    aria-hidden="true"
                  ></simple-icon-lite
                ></a>`,
              })}
              <div class="ddd-block-body">
                <iframe-loader>
                  <iframe
                    data-src="${this.source}"
                    title="${this.t.discordChatEmbed}"
                    height="${this.height}"
                    width="${this.width}"
                  ></iframe>
                </iframe-loader>
              </div>
            </div>
          `
        : html`<div>${this.t.invalidShareLink}</div>`
    }`;
  }

  /**
   * Link for the open in a new tab header action: the Discord channel itself
   * when the source is a widgetbot channel embed, otherwise the source
   */
  get _openUrl() {
    const widget = "https://e.widgetbot.io/channels/";
    if (this.source && this.source.startsWith(widget)) {
      return "https://discord.com/channels/" + this.source.slice(widget.length);
    }
    return this.source;
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    // re-arm deferred loading after a DOM move (a move fires disconnect then
    // connect) so an unpromoted embed still promotes on intersection
    this.__observeDeferredSource();
  }

  disconnectedCallback() {
    // drop the observer so a removed or moved embed never leaks it
    if (this.__io) {
      this.__io.disconnect();
      this.__io = null;
    }
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
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
      if (propName === "source" && this.source) {
        if (this.source.startsWith("https://discord.com/channels/")) {
          this.source = this.source.replace(
            "https://discord.com/channels/",
            "https://e.widgetbot.io/channels/",
          );
        } else if (this.source.startsWith("https://discordapp.com/channels/")) {
          this.source = this.source.replace(
            "https://discordapp.com/channels/",
            "https://e.widgetbot.io/channels/",
          );
        }
      }
    });
    // arm deferred loading whenever a valid embed is on screen
    this.__observeDeferredSource();
  }

  /**
   * Arm deferred loading of the embed: the iframe renders with data-src only
   * so nothing loads until the host first intersects the viewport.
   * Promotes right away when IntersectionObserver is unsupported.
   */
  __observeDeferredSource() {
    if (this.__deferredPromoted || this.__io) {
      return;
    }
    const iframe = this.shadowRoot.querySelector("iframe");
    if (!iframe) {
      return;
    }
    if (typeof globalThis.IntersectionObserver === "undefined") {
      // unsupported: promote on the next tick so any pending source
      // transformation has re-rendered data-src before the copy
      setTimeout(() => {
        this.__promoteDeferredSource();
      }, 0);
      return;
    }
    this.__io = new globalThis.IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        this.__promoteDeferredSource();
      }
    });
    this.__io.observe(this);
  }

  /**
   * Promote the deferred iframe source: copy data-src to src once, which
   * triggers the real embed load and exits the iframe-loader loading state.
   * Idempotent: a promoted embed never re-sets src.
   */
  __promoteDeferredSource() {
    if (this.__deferredPromoted) {
      return;
    }
    const iframe = this.shadowRoot.querySelector("iframe");
    if (iframe) {
      const dataSrc = iframe.getAttribute("data-src");
      // only promote when src has not already been set
      if (dataSrc && !iframe.getAttribute("src")) {
        iframe.setAttribute("src", dataSrc);
      }
    }
    this.__deferredPromoted = true;
    if (this.__io) {
      this.__io.disconnect();
      this.__io = null;
    }
  }
}
globalThis.customElements.define(DiscordEmbed.tag, DiscordEmbed);
export { DiscordEmbed };
