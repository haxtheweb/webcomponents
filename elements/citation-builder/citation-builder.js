/**
 * Copyright 2026 winstonwumbo
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

import "./lib/citation-item.js"

/**
 * `citation-builder`
 * 
 * @demo index.html
 * @element citation-builder
 */
export class CitationBuilder extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "citation-builder";
  }

  constructor() {
    super();
    this.title = "";
    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "References",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/citation-builder.ar.json", import.meta.url).href +
        "/../",
    });
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        color: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
      }
      .wrapper {
        padding: var(--ddd-spacing-4);
        margin: var(--ddd-spacing-2);
        border: var(--ddd-border-md);
      }
      h3 span {
        font-size: var(--citation-builder-label-font-size, var(--ddd-font-size-s));
      }
      .title-card {
        display: flex;
        justify-content: space-between;
      }

      #export-dropdown {
        align-self: center; 
      }
    `];
  }

  // Lit render the HTML
  render() {
    return html`
    <div class="wrapper">
      <div class="title-card">
        <h3><span>${this.t.title}:</span> ${this.title}</h3>
        <select id="export-dropdown">
          <option value="">Export</option>
          <option value="APA">APA</option>
          <option value="BibTex">BibTex</option>
          <!-- Alert and Copy (Or some Modal like on ResearchGate) -->
        </select>
      </div>
      <citation-item></citation-item>
      <citation-item></citation-item>

      <slot></slot>
    </div>`;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(CitationBuilder.tag, CitationBuilder);