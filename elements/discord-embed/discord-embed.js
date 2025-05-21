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
    this.height = 500;
    this.width = "100%";
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
              src="${this.source}"
              height="${this.height}"
              width="${this.width}"
            ></iframe>
          </iframe-loader>
        `
      : html`<div>Invalid Discord share link</div>`}`;
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
  }
}
globalThis.customElements.define(DiscordEmbed.tag, DiscordEmbed);
export { DiscordEmbed };
