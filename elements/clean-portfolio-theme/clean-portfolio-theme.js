/**
 * Copyright 2025 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { toJS, autorun } from "mobx";

/**
 * `clean-portfolio-theme`
 * 
 * @demo index.html
 * @element clean-portfolio-theme
 */
export class CleanPortfolioTheme extends DDDSuper(LitElement) {

  static get tag() {
    return "clean-portfolio-theme";
  }

  constructor() {
    super();
    this.title = "";
    autorun(() => {
      let items = store.getItemChildren(toJS(store.activeId));
      if (items && items.length > 0) {
        this.topItems = [...items];
      }
    });
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      topItems: { type: Array },
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
    `];
  }

  // Lit render the HTML
  render() {
    return html`
  <h1>UPDATE ME TO BE THE REAL THING</h1>
    `;
  }

}

globalThis.customElements.define(CleanPortfolioTheme.tag, CleanPortfolioTheme);