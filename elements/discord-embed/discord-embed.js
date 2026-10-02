/**
 * Copyright 2023
 * @license , see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import "@haxtheweb/iframe-loader/iframe-loader.js";
/**
 * `discord-embed`
 * `widgetbot.io based embed widget for discord threads and channels`
 * @demo demo/index.html
 * @element discord-embed
 */
class DiscordEmbed extends LitElement {
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.source = "";
    this.height = "500";
    this.width = "100%";
    this.__io = null;
    this.__deferredPromoted = false;
  }
  static get styles() {
    return [
      css`
        :host {
          display: block;
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
    return html`${this.source &&
    (this.source.includes("discord.com") ||
      this.source.includes("e.widgetbot.io"))
      ? html`
          <iframe-loader>
            <iframe
              data-src="${this.source}"
              title="Discord chat embed"
              height="${this.height}"
              width="${this.width}"
            ></iframe>
          </iframe-loader>
        `
      : html`<div>Invalid Discord share link</div>`}`;
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
        if (this.source.includes("https://discord.com/channels")) {
          this.source = this.source.replace(
            "https://discord.com/channels/",
            "https://e.widgetbot.io/channels/",
          );
        } else if (this.source.includes("https://discordapp.com/channels")) {
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
