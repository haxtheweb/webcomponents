/**
 * Copyright 2025 NazmanRosman
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { HAXCMSLitElementTheme } from "@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { DDDVariables } from "@haxtheweb/d-d-d/lib/DDDStyles.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-title.js";
import "@haxtheweb/bootstrap-theme/lib/BootstrapBreadcrumb.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-breadcrumb.js";

import "./lib/glossy-portfolio-card.js";
import "./lib/glossy-portfolio-header.js";
import "./lib/glossy-portfolio-footer.js";
import "./lib/glossy-portfolio-home.js";
import "./lib/glossy-portfolio-grid.js";
import "./lib/glossy-portfolio-about.js";
import "./lib/glossy-portfolio-breadcrumb.js";
/**
 * `glossy-portfolio-theme`
 * 
 * @demo index.html
 * @element glossy-portfolio-theme
 */
export class GlossyPortfolioTheme extends DDDSuper(I18NMixin(HAXCMSLitElementTheme)) {

  static get tag() {
    return "glossy-portfolio-theme";
  }

  constructor() {
    super();
    this.title = "";
    this.HAXCMSThemeSettings.autoScroll = true;
    this.activeParent = ""; // set with activeItem, used for parentSlug and parentTitle
    this.__disposer = this.__disposer || [];

   autorun((reaction) => {
    this.isHome = false; // default to false
      const active = toJS(store.activeItem);
      if (active) {
        if(active.order === 0 && store.ancestorItem === null) {
          this.isHome = true; 
        }
      }
    });

  }


  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      siteDescription: { type: String },
      relatedItem: { type: Object },
      isHome: { type: Boolean },
      items: { type: Object },
    };
  }

  disconnectedCallback() {
    if (this.__disposer) {
      for (var i in this.__disposer) {
        this.__disposer[i].dispose();
      }
    }
    super.disconnectedCallback();
  }



  
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    const PortfolioFonts = [
      "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap"
      ,"https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap" 
    ,"https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
    ];
    let DesignSystemManager = globalThis.DesignSystemManager.requestAvailability();
    DesignSystemManager.addDesignSystem({
      name: "glossy-portfolio-theme",
      styles: [...GlossyPortfolioTheme.styles, DDDVariables],
      fonts: PortfolioFonts,
      hax: true,
    });
    DesignSystemManager.active = 'glossy-portfolio-theme';

  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
    :host{
        box-sizing: border-box; 
        --bg-color: #111111;
        --main-font: "Manrope", "Manrope Placeholder", sans-serif;
        --max-width: 1200px;
        --page-padding: 0 25px;
        --link-color: #6cddff;
        --link-color-hover: #9ae7ff;
        --main-font-size: 18px;
        --mobile-page-padding: 0 15px;
        --text-color: #ffffff; /* Default text color */
        --footer-height: 76px;   
        --max-width-text: 840px; /* Max width for text content */ 
      }

      *{
        box-sizing: border-box;

      }
      :root, html, body{
        /* font-size: 124px; */
        font-family: var(--main-font);
        color: white;
        background-color: var(--bg-color);
        font-size: var(--main-font-size);
      }

      :host {
        display: block;
        color: var(--text-color);
        font-family: var(--main-font);
        margin: auto;
        box-sizing: border-box;
        overflow: visible;
        min-height: 100vh;
        background-color: var(--bg-color);

      }

      :host([edit-mode]) {
          /* react to the screen shifting left to right on edit mode w/ tray direction */
          margin: var(
            --hax-tray-element-align-margin,
            0 0 0
              calc(var(--hax-tray-width) - var(--hax-tray-menubar-min-width))
          );
          transition: margin 0.15s ease-in-out;
      }

      :host([is-logged-in]) {
        glossy-portfolio-header {
          padding-top: 52px;

        }
      }

      glossy-portfolio-header {
        position: fixed;
        top: 0;
        z-index: 1000; /* Ensure header is above other content */
      }

      /* text style */
      p, a, blockquote, pre, code, span, strong, em {
        margin: 1em 0; /* Top and bottom margins equal to the font size, no left/right margin */
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.8;
        font-family: inherit;

      }
      
      li{
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.8;
        font-family: inherit;
      }

      ol, ul{
        margin-bottom: 1em;
        display: block;
        list-style-type: disc;
        margin-block-start: 1em;
        margin-block-end: 1em;
        padding-inline-start: 40px;
        unicode-bidi: isolate;

      }
      img{
        margin: 1em 0;
      }
      h1, h2, h3, h4, h5, h6 {
        margin: 0.5em 0; /* Slightly smaller margins for headings */
      }
      h1 {
        font-size: 3rem;
        font-weight: 700;
        line-height: 1.2;
        font-family: inherit;

      }

      h2 {
        font-size: 2rem;
        font-weight: 700;
        line-height: 1.3;
        font-family: inherit;

      }
      h3{
        font-size: 1.75rem; /* 28px if root font size is 16px */
        font-weight: 700;
        line-height: 1.4; 
        font-family: inherit;
      }

      a {
 
        text-decoration: none;
        color: var(--link-color); /* Sky Blue */
        font-family: inherit;

      }
      
      a:hover {
        color: var(--link-color-hover); /* Bright Cyan for hover effect */
        text-decoration: underline;
      }
      
      site-active-title h1{
        margin-bottom: 0;
      }

      #contentcontainer, #slot {
        z-index: 2;
        background-color: var(--bg-color);
        width: 100%;
        
      }

      #slot {
        min-height: 0;
      }

      .max-body-width {
        width: 100%;
        max-width: var(--max-width);
        margin: auto;
        z-index: 2; /* Ensure content is above the background */
        background-color: var(--bg-color); /* Match background color */
      }
      #contentcontainer {
        max-width: var(--max-width-text);
        margin: 0;
        padding: var(--page-padding);
        padding-top: 80px;
      }

      glossy-portfolio-breadcrumb {
        margin-top: 40px;
      }

      glossy-portfolio-footer{
        position: relative;
        bottom: 0;
        width: 100%;
      }
      .body-wrapper { 
        display: flex;
        flex-direction: column;
        min-height: calc(100vh + var(--footer-height));        ;
        width: 100%;
        z-index: 2;
      }

      /* .grow and .not-grow makes sure the footer is at the bottom of page */
      .grow {
        flex: 1 0 auto; /* Allow this element to grow and fill available space */
      }
      .not-grow {
        flex: 0 0 auto; /* Prevent this element from growing */
      }

      body.no-scroll {
        overflow: hidden; /* Prevents scrolling when open mobile nav link*/
      }
      
      /* Extra small devices (phones) */
      @media (max-width: 575.98px) {
        :host *, :root *{
          --page-padding: 0 15px;
        }
        :root, html, body{
          font-size: 14px;
         
        }
       #contentcontainer {
        padding-top: 60px;
        }
        glossy-portfolio-breadcrumb {
          margin-top: 20px;
        }
      }
    `];
  }

  // Lit render the HTML
  
  render() {
    
    const activeTitle = this.activeItem?.title || "Default Title"; // Use optional chaining and a fallback value
    return html`
    <!-- temporary margin-top  -->
    <glossy-portfolio-header></glossy-portfolio-header>

    <div class="body-wrapper"> 
      ${this.isHome ? html`<glossy-portfolio-home></glossy-portfolio-home>` : html``}
      <div class="max-body-width">
      
        <article id="contentcontainer" class="grow contentcontainer">
      
            <glossy-portfolio-breadcrumb></glossy-portfolio-breadcrumb>
            <site-active-title></site-active-title>          
            <div id="slot"><slot></slot></div>
        </article>
      </div>
      <glossy-portfolio-grid class="grow"></glossy-portfolio-grid>
      <glossy-portfolio-footer class="not-grow"></glossy-portfolio-footer>

    </div>  
`;
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