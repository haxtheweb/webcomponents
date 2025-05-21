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
    
    
    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "Title",

      
    };

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
      <glossy-portfolio-header></glossy-portfolio-header>
<div class="wrapper">
  <div class="text">
    
    <h2 class="project-title">Rune Wars</h2>
    <h1 class="project-header">The future of games.</h1>
    <p>Gaming has long been defined by isolated screens.</p>
    <p>Augmented reality, however, is upending all of that. The future of gaming is physical, social, and immersed in the real world.</p>
    <p>Introducing Rune Wars, the first multi-player game built on Snap's Spectacles</p>
    <p><b>- Winner of Snap Inc.'s Prize @ Immerse The Bay 2024 Hackathon -</b></p>
  </div>

  <div class="text">

    <div class="details-table">

      <div class="detail-section">
        <div class="detail-header">Date</div>
        <div class="detail-text">November 2024</div>
      </div>
      <div class="detail-section">
        <div class="detail-header">Duration</div>
        <div class="detail-text">36 hours</div>
      </div>
      <div class="detail-section">
        <div class="detail-header">Type</div>
        <div class="detail-text">Design, prototyping, AR</div>
      </div>
      <div class="detail-section">
        <div class="detail-header">Achievement</div>
        <div class="detail-text">Winner of Snap Inc.'s Prize @ Immerse The Bay 2024 Hackathon</div>
      </div>

    </div>
  </div>

  <img src="lib/thumbnails/impactra.png" width="700px">
  <div class="text">
    <h3>A Vision of Spatial Play.</h3>
    <p>Rune Wars is a simple multiplayer combat system helping people connect and exercise in a more engaging way.</p>

    <p>Two people play as warriors battling for their honour.</p>

    <p>Players shoot rune-enforced stones from one hand using a pinch gesture, and use the other hand to raise temporary walls from the ground using a pinch + drag gesture. These walls are destroyed after 5 seconds.</p>

    <p>To win, a player reduce their opponent’s health to zero</p>
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