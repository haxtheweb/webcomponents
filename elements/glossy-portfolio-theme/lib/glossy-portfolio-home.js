/**
 * Copyright 2025 NazmanRosman
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
/**
 * `glossy-portfolio-home`
 * 
 * @demo index.html
 * @element glossy-portfolio-home
 */
export class GlossyPortfolioHome extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "glossy-portfolio-home";
  }

  constructor() {
    super();
    this.title = "Title";
    this.__disposer = this.__disposer || [];

    // get csite description
    autorun((reaction) => {
      this.siteDescription = toJS(store.siteDescription) || "A portfolio showcasing my work and projects.";
      this.__disposer.push(reaction);
    });
    autorun((reaction) => {
      this.backgroundImage = toJS(store.themeData.variables.image);
      this.__disposer.push(reaction);
    });
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      siteDescription: { type: String },
      backgroundImage: { type: String },

    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        font-family: var(--ddd-font-navigation);
        height: auto;
      }

      *{
        box-sizing: border-box;
      }

      .wrapper {
        display: flex;
        flex-direction: column; 
        max-width: var(--max-width); 
        margin: 0 auto ;
        padding: var(--page-padding);
        overflow: visible;
      }

      .background{
        background-image: var(--background-image);
        background-attachment: fixed;
        background-size: cover;
        width: 100%;
      }
      .background-opacity{
        background-color:rgba(0, 0, 0, 0.7);
        width: 100%;
      }

      .title{
        font-family: "Inter", "Inter Placeholder", sans-serif;
        font-size: 50px;
        font-weight: 600;
        color: var(--text-color); 
        position: fixed;
        top: 50%;
        transform: translate(0, -50%);
        max-width: 1000px; 
        width: 70%;
        letter-spacing: -0.5px;
        padding-left: 10px;
        text-shadow: 0.1em 0.1em 0.2em rgba(0, 0, 0, 0.5); /* Shadow scales with font size */

      }

      .title em{
        font-weight: 100; 
        font-size: 55px;
        font-family: 'DM Serif Display';
      }

      .title-container{
        height: 100vh;
        position: relative;
        z-index: 0;

      }

     @media (max-width: 575.98px) {
      /* Styles for phones */
      .title{
        font-size: 35px;
        max-width: 1000px; 
        width: 90%;
        letter-spacing: -0.5px;
      }
      .title em{
        font-size: 40px;
      }
     }

    `];
  }

  // Lit render the HTML
  render() {
    return html`
<div class="background" style="--background-image: url(${this.backgroundImage})">
  <div class="background-opacity">
    <div class="wrapper"> <!-- page padding -->
      
      <div class="title-container"> <!-- centralize title vertically -->
        <div class="title">
        ${this.siteDescription}
        </div>  
      </div>  
    
    </div>  
  </div>
</div>

`;
  }



  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(GlossyPortfolioHome.tag, GlossyPortfolioHome);