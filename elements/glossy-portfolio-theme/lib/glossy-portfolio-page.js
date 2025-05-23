/**
 * Copyright 2025 NazmanRosman
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `glossy-portfolio-page`
 * 
 * @demo index.html
 * @element glossy-portfolio-page
 */
export class GlossyPortfolioPage extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "glossy-portfolio-page";
  }

  constructor() {
    super();
    this.title = "Title";
    

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
        /* line-height: 2rem; */
        margin: 0;
        --project-title-font-size: 28px;
        --project-header-font-size: 64px;
        --body-font-size: 20px;
        font-size: var(--body-font-size);
        background-color: var(--bg-color);
      }
      *{
        box-sizing: border-box;
      }

      h1, p, h2, h3{
        margin: 0;
      }
      h3{
        font-weight: 500;
        margin-top: 50px;
        padding: 0 0 20px 0;

      }
      p{
        line-height: 170%;
        margin: 0 0 20px 0;
      }


      .wrapper{
        display: flex;
        flex-direction: column;
        
        max-width: var(--max-width); 
        margin: 0 auto ;
        padding: var(--page-padding);
        padding-top: 130px;
        color: white;
        /* overflow: visible; */
      }

      .text{
        max-width: 840px;
      }
      
      h2.project-title{
        margin: 0;
        font-weight: 500;
        font-size: var(--project-title-font-size);
      }

      h1.project-header{
        margin: 40px 0;
        font-weight: 400;
        font-size: var(--project-header-font-size);

      }


      .details-table{
        margin: 40px 0 40px 0;
        display: grid;
        /* border: 1px solid red; */
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
        justify-content: center;
        max-width: var(--max-width);
        line-height: 170%; 
      }
      .detail-header{
        color:rgb(128, 128, 128);
      }
      @media (max-width: 575.98px) {
        img{
          width: 100%;
          height: auto;
        }
        .details-table{
          grid-template-columns: 1fr;
          font-size: 16px;
          gap: 7px;
          margin:0 0 20px 0;

        }
        h2.project-title{
          font-size: 20px;
        }
        h1.project-header{
          font-size: 36px;
          margin: 20px 0;
        }
        p{
          font-size: 16px;
        }
        .wrapper{
          padding: var(--mobile-page-padding);
          padding-top: 100px;
        }

      }
 

    `];
  }

  // Lit render the HTML
  render() {
    return html`
      <!-- <glossy-portfolio-header></glossy-portfolio-header> -->
<div class="wrapper">
  <div class="text">
    <!-- <site-active-title></site-active-title> -->
    
    
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

globalThis.customElements.define(GlossyPortfolioPage.tag, GlossyPortfolioPage);