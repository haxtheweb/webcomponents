/**
 * Copyright 2025 NazmanRosman
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `glossy-portfolio-about`
 * 
 * @demo index.html
 * @element glossy-portfolio-about
 */
export class GlossyPortfolioAbout extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "glossy-portfolio-about";
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
      *{
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      h1, p{
        margin: 0;
        padding: 0;
      }

      .hero {
        padding: var(--page-padding);
        max-width: 1000px; 
        margin: 0 auto ;
        position: relative;
        top: 50vh;
        transform: translateY(-50%);
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        background-color: var(--bg-color);
        
        gap: 50px;
        
      }
      .text{
        display: flex;
        flex-direction: column;
        color: white;
      }

      img{
        height: 300px;
        width: 300px;
        border-radius: 50%;
        object-fit: cover;
      }
      h1{
        font-size: 40px;
        margin-bottom: 15px;
      }
      p{
        font-size: 20px;
        letter-spacing: 0.6px;
        color: #FFFFFF;
        opacity: 0.8;
        line-height: 150%;
      }

      a.social-link{
        color: white;
        opacity: 0.9;
        font-weight: 700;
        font-size: 20px;
      }


      .socials{
        margin-top: 20px;
        display: flex;
        flex-wrap: wrap;
        column-gap: 35px;
        row-gap: 15px;

      }

      @media (max-width: 999.98px) {
        .hero {
          flex-direction: column;
          gap: 20px;
          padding: 0;
          top: 110px;
          transform: translateY(0);
        }
        .text{
          font-size: 16px;
          max-width: 90%;
        }
        img{
          height: 200px;
          width: 200px;
        }
        h1{
        font-size: 30px;
        margin-bottom: 15px;
        }
        p{
          font-size: 16px;
          letter-spacing: 0.6px;
          color: #FFFFFF;
          opacity: 0.8;
          line-height: 150%;
        }
      


      .socials{
        margin-bottom: 5px;
        flex-direction: column;
        gap: 10px;
      }

      a.social-link{
        font-size: 16px;

      }
      
    }




    `];
  }

  // Lit render the HTML
  render() {
    return html`
<glossy-portfolio-header></glossy-portfolio-header>

<div class="hero">
  <div class="image">
    <img src="../lib/components/headshot.webp">
  </div>
  <div class="text">  
    <div class="header">
      <h1>Hi, I'm Mortiz</h1>
    </div>
    <div class="description">
      <p>I‘m a UX/UI Designer with over six years experience conceptualizing and crafting digital products, helping businesses and non-profits expand their capacity for impact 🚀 As a tutor at CareerFoundry*, I help aspiring UX design students build a career they love by giving feedback and sharing my knowledge and passion for design, technology, and the field of education 🎓</p>
    </div>
    <div class="links">
      <div class="socials">
        <a href="https://google.com" class="social-link" target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>        
        <a href="https://google.com" class="social-link" target="_blank" rel="noopener noreferrer">
          Github
        </a>        
        <a href="https://google.com" class="social-link" target="_blank" rel="noopener noreferrer">
         Instagram
        </a>        
        <a href="https://google.com" class="social-link" target="_blank" rel="noopener noreferrer">
         Facebook
        </a>        
        <a href="https://google.com" class="social-link" target="_blank" rel="noopener noreferrer">
          mortiz.doe@gmail.com
        </a>        

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

globalThis.customElements.define(GlossyPortfolioAbout.tag, GlossyPortfolioAbout);