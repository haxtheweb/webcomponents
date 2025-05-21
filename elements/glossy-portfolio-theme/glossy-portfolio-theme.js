/**
 * Copyright 2025 NazmanRosman
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "./lib/glossy-portfolio-card.js";
import "./lib/glossy-portfolio-header.js";
import "./lib/glossy-portfolio-page.js";
import "./lib/glossy-portfolio-home.js";
import "./lib/glossy-portfolio-grid.js";
import "./lib/glossy-portfolio-about.js";
/**
 * `glossy-portfolio`
 * 
 * @demo index.html
 * @element glossy-portfolio-theme
 */
export class GlossyPortfolioTheme extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "glossy-portfolio-theme";
  }

  constructor() {
    super();
    this.title = "";
    this.currentView = "home";


    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "Title",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/glossy-portfolio.ar.json", import.meta.url).href +
        "/../",
      locales: ["ar", "es", "hi", "zh"],
    });
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      currentView: { type: String },
    };
  }



  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host{
        --bg-color: #111111;
        --main-font: "Manrope", "Manrope Placeholder", sans-serif;
        --max-width: 1200px;
        --page-padding: 0 25px;
        --mobile-page-padding: 0 15px;
        
    
      }
 
      
      :host {
        display: block;
        color: var(--ddd-theme-primary);
        background-color: var(--bg-color);
        font-family: var(--main-font);
        margin: auto;
        box-sizing: border-box;
        overflow: visible;
        min-height: 100vh;
      }
    `];
  }

  // Lit render the HTML
  
  render() {
    if(this.currentView==="home"){
      return html`
      <glossy-portfolio-home></glossy-portfolio-home>
      <!-- <glossy-portfolio-about></glossy-portfolio-about> -->
      <!-- <glossy-portfolio-page></glossy-portfolio-page> -->
      <!-- <glossy-portfolio-grid class="projects"></glossy-portfolio-grid> -->

      `;
    } 

  } 

  //changes currentview to project page when card is clicked


  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(GlossyPortfolioTheme.tag, GlossyPortfolioTheme);