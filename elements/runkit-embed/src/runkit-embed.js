/**
 * Copyright 2024
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html } from "lit";
import { ESGlobalBridgeStore } from "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";

/**
 * `runkit-embed`
 * ``
 * @demo demo/index.html
 * @element runkit-embed
 */
class RunkitEmbed extends LitElement {
  /**
   * Convention we use
   */
  static get tag() {
    return "runkit-embed";
  }

  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.__runkitloaded = false;
    ESGlobalBridgeStore.load(
      "runkit",
      "https://embed.runkit.com"
    ).then(() => {
      if (globalThis.RunKit) {
        this.__runkitloaded = true;
        this.buildRunKit();
      }
    });
    this.mode = "endpoint";
    this.nodeVersion = "18.x.x";
    this.source = this.querySelector('template').content.textContent;
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if ((changedProperties.has('nodeVersion') || changedProperties.has('mode') && this.nodeVersion && this.mode)) {
      this.buildRunKit();
    }
  }

  buildRunKit() {
    if (this.__runkitloaded) {
      if (this.__rkContainer) {
        this.__rkContainer.remove();
      }
      this.loading = true;
      globalThis.RunKit.createNotebook({
        mode: this.mode,
        nodeVersion: this.nodeVersion,
        element: this,
        source: this.source,
        onLoad: (item) => {
          this.__rkContainer = this.querySelector(`[name="${item.name}"]`).parentNode;
          this.loading = false;
        }
      });
    }
  }

  render() {
    return html`<slot></slot>`;
  }

  static get properties() {
    return {
      nodeVersion: { type: String, attribute: 'node-version'},
      mode: { type: String, },
      loading: { type: Boolean },
      source: { type: String },
    }
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}
globalThis.customElements.define(RunkitEmbed.tag, RunkitEmbed);
export { RunkitEmbed };
