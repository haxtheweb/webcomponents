/**
 * Copyright 2024
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { ESGlobalBridgeStore } from "@haxtheweb/es-global-bridge/es-global-bridge.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";

/**
 * `runkit-embed`
 * ``
 * @demo demo/index.html
 * @element runkit-embed
 */
class RunkitEmbed extends DDD {
  /**
   * Convention we use
   */
  static get tag() {
    return "runkit-embed";
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          min-height: 100px;
        }
      `,
    ];
  }

  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.__runkitloaded = false;
    this.loading = false;
    ESGlobalBridgeStore.load("runkit", "https://embed.runkit.com").then(() => {
      if (globalThis.RunKit) {
        this.__runkitloaded = true;
        this.buildRunKit();
      }
    });
    if (this.querySelector("template")) {
      this.source = this.querySelector("template").content.textContent;
    } else {
      this.source = "";
    }
    this.mode = "endpoint";
    this.nodeVersion = "18.x.x";
    this.__observer = new MutationObserver((mutations) => {
      if (this.querySelector("template") && !this.loading) {
        this.source = this.querySelector("template").content.textContent;
      }
    });
    this.__observer.observe(this, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: false,
    });
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    // ensure we DO NOT update when in hax mode or we're in trouble
    if (
      !this._haxstate &&
      !this.dataHaxActive &&
      this.__runkitloaded &&
      (changedProperties.has("source") ||
        changedProperties.has("nodeVersion") ||
        changedProperties.has("mode")) &&
      this.nodeVersion &&
      this.mode &&
      this.source
    ) {
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
          this.__rkContainer = this.querySelector(
            `[name="${item.name}"]`,
          ).parentNode;
          this.loading = false;
        },
      });
    }
  }

  render() {
    return html`<slot></slot>`;
  }

  static get properties() {
    return {
      nodeVersion: { type: String, attribute: "node-version" },
      mode: { type: String },
      loading: { type: Boolean },
      source: { type: String },
      dataHaxActive: {
        type: String,
        reflect: true,
        attribute: "data-hax-active",
      },
    };
  }

  /**
   * Implements haxHooks to tie into life-cycle if hax exists.
   */
  haxHooks() {
    return {
      preProcessNodeToContent: "haxpreProcessNodeToContent",
      editModeChanged: "haxeditModeChanged",
    };
  }

  haxeditModeChanged(value) {
    this._haxstate = value;
    if (this._haxstate && this.querySelector("div")) {
      this.querySelector("div").remove();
    }
  }

  // about to convert to content, ensure we are no longer the editable-table
  async haxpreProcessNodeToContent(node) {
    this.__runkitloaded = false;
    this.loading = false;
    if (this.__rkContainer) {
      this.__rkContainer.remove();
    }
    if (this._haxstate && this.querySelector("div")) {
      this.querySelector("div").remove();
    }
    return node;
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
