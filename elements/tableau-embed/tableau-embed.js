/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";

/**
 * `tableau-embed`
 * `Wrapper for embedding Tableau visualizations via the Embedding API v3.`
 *
 * @demo index.html
 * @element tableau-embed
 */
export class TableauEmbed extends LitElement {
  static get tag() {
    return "tableau-embed";
  }

  constructor() {
    super();
    this.src = "";
    this.width = "100%";
    this.height = "800px";
    this.toolbar = "hidden";
    this.hideTabs = true;
    this.device = "desktop";
    this.loaded = false;
    this.loading = false;
    this._haxstate = false;
  }

  static get properties() {
    return {
      src: { type: String },
      width: { type: String },
      height: { type: String },
      toolbar: { type: String },
      hideTabs: { type: Boolean, reflect: true, attribute: "hide-tabs" },
      device: { type: String },
      loaded: { type: Boolean, reflect: true },
      loading: { type: Boolean, reflect: true },
      _haxstate: { type: Boolean, reflect: true, attribute: "_haxstate" },
    };
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        .loading-msg {
          text-align: center;
        }
        :host([_haxstate]) tableau-viz {
          pointer-events: none;
        }
      `,
    ];
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }

  /**
   * Implements haxHooks to tie into life-cycle if hax exists.
   */
  haxHooks() {
    return {
      editModeChanged: "haxeditModeChanged",
      activeElementChanged: "haxactiveElementChanged",
    };
  }

  /**
   * Set a flag to test if we should block interactivity on the entire viz
   * otherwise when editing in hax you can't actually select it.
   */
  haxeditModeChanged(val) {
    this._haxstate = val;
  }

  /**
   * double-check that we are set to inactivate click handlers
   * this is for when activated in a duplicate / adding new content state
   */
  haxactiveElementChanged(el, val) {
    if (val) {
      this._haxstate = val;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.loaded && !this.loading) {
      this.loading = true;
      this.loadTableau();
    }
  }

  async loadTableau() {
    try {
      if (!globalThis.customElements.get("tableau-viz")) {
        await import(
          "https://public.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js"
        );
      }
      this.loaded = true;
      this.loading = false;
    } catch (e) {
      console.warn("Failed to load Tableau Embedding API:", e);
      this.loading = false;
    }
  }

  render() {
    if (!this.loaded) {
      return html`
        <div class="loading-msg">
          ${this.loading ? "Loading Tableau..." : "Unable to load Tableau."}
        </div>
      `;
    }
    return html`
      <tableau-viz
        src="${this.src}"
        width="${this.width}"
        height="${this.height}"
        toolbar="${this.toolbar}"
        ?hide-tabs="${this.hideTabs}"
        device="${this.device}"
      ></tableau-viz>
    `;
  }
}

globalThis.customElements.define(TableauEmbed.tag, TableauEmbed);
