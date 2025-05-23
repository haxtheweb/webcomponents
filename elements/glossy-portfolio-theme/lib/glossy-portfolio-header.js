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
 * `glossy-portfolio-header`
 * 
 * @demo index.html
 * @element glossy-portfolio-header
 */
export class GlossyPortfolioHeader extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "glossy-portfolio-header";
  }

  constructor() {
    super();
    this.title = "Title";
    this.thumbnail = "impactra.png",
    this.link = "https://google.com",
    this.topItems = [];
    this.activeTitle = "";
  }

  updated(changedProperties) {
    if(changedProperties.has('activeTitle')){
      let items = this.renderRoot.querySelectorAll(`.header-link`);
      let title = this.renderRoot.querySelector(`.header-link.${this.toKebabCase(this.activeTitle)}`);
      if(title){
        items.forEach(el => el.classList.remove('active-title'));
        title.classList.toggle('active-title');
      }
      
    }
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      thumbnail: {type: String},
      link: {type: String},
      topItems: {type: Array},
      activeTitle: {type: String},
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        
        /* min-width: 400px; */
        height: auto;
        background-color: #1d1d1d;
      }

      *{
        box-sizing: border-box;
      }

      ul{
        margin: 0;
        padding: 0;
      }

      .container{
        background-color: var(--bg-color);

        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 10;
        position: fixed;
        top: 0px;
        width: 100vw;
        display: flex;
        position: fixed;
        left: 0;
        right: 0;
        padding: 90px 50px 40px 50px;
        border-bottom: 2px solid #ffffff;
        height: 80px;
        /* background-color: #11111150; */
        font-family: var(--main-font);  
        /* position: relative; */
      }
      

      .nav-links li{
        font-size: 18px;
        font-weight: 500;
        font-family: var(--main-font);

      }
    
      .hamburger{
        width: 40px;
        height: 40px;
        display: none;
      }

      .logo{
        /* background-color: blue; */
        width: 70px;
        position: relative;
        z-index: 10;
      }

      ul{
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 50px;
        font-size: 18px;
        list-style: none;
      }
      .nav-links{
        transition: all 0.3s ease-in-out;

      }
      a, div.header-link{
        all: unset;
        color: white;
        text-decoration: none;
        font-weight: 100;

      }
      a .active-title, div.header-link .active-title {
        font-weight: 600;
      }
      a:hover, div.header-lik:hover{
        /* all: unset; */
        color: white;
        text-decoration: none;
        /* font-weight: 500; */

      }
      button{
        all: unset;
        cursor: pointer;
      }


      /* Extra small devices (phones) */
      @media (max-width: 575.98px) {
        /* Styles for phones */
        .container{
          font-size: 9px;
          padding: 15px 0px;

          background: var(--bg-color);

        } 
        .container{
          flex-wrap: wrap;
          height: auto;
        }
        .container.active{
          padding: 15px 0 0 0;
        }
        .nav-links.active{
          display: flex;
        }
        .nav-links{
          display: none;
          flex-direction: column;

          gap: 0px;
          width: 100vw;
          padding: 20px 0 0 0;
          border-radius: 10px;
        }
        
        .nav-links li{
          font-size: 16px;

        }
        .hamburger{
          display: block;
          padding-right: 15px;

        }
        .logo{
          width: 60px;
          padding-left: 15px;
      /* flex: 1 0 0;  */
        }
   
        li, a.right-side-item{
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 100vw;
          /* background-color:blue; */
          text-align: center; /* Centers the text horizontally */
          height: 80px;
          
        }

        a.right-side-item:active, a.right-side-item:hover{
          background-color: #1d1d1d;
          text-decoration: none; /* Ensures underline is removed on hover */

        }
        
        
      }

      /* Small devices (landscape phones, large phones) */
      @media (min-width: 576px) and (max-width: 767.98px) {
        /* Styles for small devices */
      }

      /* Medium devices (tablets) */
      @media (min-width: 768px) and (max-width: 991.98px) {
        /* Styles for tablets */
      }
      


    `];
  }

openHamburger(){
  const navLinks = this.renderRoot.querySelector('.nav-links');
  const container = this.renderRoot.querySelector('.container');
  navLinks.classList.toggle('active');
  container.classList.toggle('active');
}

  // Lit render the HTML
  render() {
    return html`
<div class="container">
  <!-- <img class="logo" src="lib/components/logo.svg" > -->
  <svg class="logo" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="50px" height="50px"><path d="M36,3.99H14c-5.51,0-10,4.49-10,10v22c0,5.51,4.49,10,10,10h22c5.51,0,10-4.49,10-10v-22C46,8.48,41.51,3.99,36,3.99z M27,35c-0.55,0-1-0.45-1-1v-4c0-0.55,0.45-1,1-1c3.86,0,7-3.14,7-7c0-3.52-2.61-6.44-6-6.93v2.03c2.28,0.46,4,2.49,4,4.9	c0,2.76-2.24,5-5,5c-0.55,0-1-0.45-1-1s0.45-1,1-1c1.65,0,3-1.35,3-3c0-1.65-1.35-3-3-3c-0.55,0-1-0.45-1-1v-4c0-0.55,0.45-1,1-1	c4.96,0,9,4.04,9,9c0,4.62-3.51,8.45-8,8.94v2.02c5.6-0.51,10-5.23,10-10.96c0-6.07-4.93-11-11-11h-3v29c0,0.55-0.45,1-1,1h-4	c-0.55,0-1-0.45-1-1V11h-2v29c0,0.55-0.45,1-1,1s-1-0.45-1-1V10c0-0.55,0.45-1,1-1h4c0.55,0,1,0.45,1,1v29h2V10c0-0.55,0.45-1,1-1h4	c7.17,0,13,5.83,13,13C40,29.17,34.17,35,27,35z"/></svg>
  <button>
    <!-- <img @click="" class="hamburger" src="../lib/components/hamburger.svg" width="70px"> -->
    <svg class="hamburger" @click="${this.openHamburger}"  width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="SVGRepo_bgCarrier" stroke-width="0"/>
      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
      <g id="SVGRepo_iconCarrier"> <path d="M4 18L20 18" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/> <path d="M4 12L20 12" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/> <path d="M4 6L20 6" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/> </g>
    </svg>
  </button>
  <ul class="nav-links">
    ${Array.from(this.topItems).map((item) => html`
        <li><a class="right-side-item" href="${item.slug}"><div class="header-link ${this.toKebabCase(item.title)}">${item.title}</div></a></li>
      `)}
  </ul>
  
    
</div>
`;
  }

  toKebabCase(str) {
    return str.replace(/\s+/g, '-');
  }
  

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(GlossyPortfolioHeader.tag, GlossyPortfolioHeader);