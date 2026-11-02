/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";

/**
 * `tableau-embed`
 * `Wrapper for embedding Tableau visualizations via the Embedding API v3.`
 *
 * @demo index.html
 * @element tableau-embed
 */
export class TableauEmbed extends I18NMixin(LitElement) {
  static get tag() {
    return "tableau-embed";
  }

  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      loadingTableau: "Loading Tableau...",
      unableToLoadTableau: "Unable to load Tableau.",
      tableauVisualization: "Tableau visualization",
      dataVisualization: "Data visualization",
      openOnTableau: "Open on Tableau in a new tab",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("./locales/", import.meta.url).href,
    });
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
        /* labelled embed frame shared with the other DDD learning blocks */
        .frame {
          box-sizing: border-box;
          border: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          border-radius: var(--ddd-radius-md);
          overflow: hidden;
          font-family: var(--ddd-font-primary);
        }
        .frame-header {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-3);
          padding-block: var(--ddd-spacing-2);
          padding-inline: var(--ddd-spacing-4) var(--ddd-spacing-2);
          border-bottom: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
        }
        .frame-chip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: none;
          width: var(--ddd-icon-xs);
          height: var(--ddd-icon-xs);
          border-radius: var(--ddd-radius-circle);
          background-color: light-dark(
            var(--ddd-theme-default-beaverBlue),
            var(--ddd-theme-default-skyBlue)
          );
          color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          --simple-icon-width: var(--ddd-icon-3xs);
          --simple-icon-height: var(--ddd-icon-3xs);
        }
        .frame-label {
          flex: 1 1 auto;
          min-width: 0;
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-medium);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        :host(:lang(ar)) .frame-label,
        :host(:lang(fa)) .frame-label,
        :host(:lang(he)) .frame-label,
        :host(:lang(ur)) .frame-label {
          letter-spacing: 0;
        }
        .frame-open {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: none;
          width: var(--ddd-control-height-sm);
          height: var(--ddd-control-height-sm);
          border: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          border-radius: var(--ddd-radius-rounded);
          color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-linkLight)
          );
          --simple-icon-width: var(--ddd-icon-3xs);
          --simple-icon-height: var(--ddd-icon-3xs);
        }
        .frame-open:hover {
          border-color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-linkLight)
          );
        }
        .frame-open:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        .frame-body {
          display: block;
        }
        .loading-msg {
          padding: var(--ddd-spacing-6) var(--ddd-spacing-4);
          text-align: center;
          font-size: var(--ddd-font-size-4xs);
        }
        tableau-viz {
          display: block;
          max-width: 100%;
          overflow: auto;
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
      gizmoRegistration: "haxgizmoRegistration",
      editModeChanged: "haxeditModeChanged",
      activeElementChanged: "haxactiveElementChanged",
    };
  }

  /**
   * @see haxHooks: gizmoRegistration
   * Register haxProperties locales so the HAX editor UI can be translated
   */
  haxgizmoRegistration(_store) {
    globalThis.dispatchEvent(
      new CustomEvent("i18n-manager-register-element", {
        detail: {
          namespace: `tableau-embed.haxProperties`,
          localesPath: new URL(`./locales`, import.meta.url).href,
        },
      }),
    );
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
    return html`<div class="frame">
      <div class="frame-header">
        <span class="frame-chip" aria-hidden="true"
          ><simple-icon-lite icon="editor:insert-chart"></simple-icon-lite
        ></span>
        <span class="frame-label">${this.t.dataVisualization} · Tableau</span>
        ${this.src
          ? html`<a
              class="frame-open"
              href="${this.src}"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="${this.t.openOnTableau}"
              title="${this.t.openOnTableau}"
              ><simple-icon-lite
                icon="icons:open-in-new"
                aria-hidden="true"
              ></simple-icon-lite
            ></a>`
          : ""}
      </div>
      <div class="frame-body">
        ${!this.loaded
          ? html`<div class="loading-msg" role="status" aria-live="polite">
              ${this.loading
                ? this.t.loadingTableau
                : this.t.unableToLoadTableau}
            </div>`
          : html`<tableau-viz
              src="${this.src}"
              width="${this.width}"
              height="${this.height}"
              toolbar="${this.toolbar}"
              ?hide-tabs="${this.hideTabs}"
              device="${this.device}"
              aria-label="${this.t.tableauVisualization}"
            ></tableau-viz>`}
      </div>
    </div>`;
  }
}

globalThis.customElements.define(TableauEmbed.tag, TableauEmbed);
