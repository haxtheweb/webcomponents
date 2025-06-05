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
    this.activeLayout = "grid"; // text, media, listing
    this.activeParent = ""; // set with activeItem, used for parentSlug and parentTitle
    this.relatedItems = []; 
    this.childrenArray = []; // used for grid layout, holds children of activeItem
    this.__disposer = this.__disposer || [];

    //get top level items (items shown on header -- they have no parent)

    // determines active layout based on following conditions:
    // - if current page has a child, it is grid
    // - if no child, and has a parent: it is media
    // - if no child, and no parent: it is text
    autorun((reaction) => {
      const activeItem = toJS(store.activeItem);
      
      // console.log(activeItem);
      if (activeItem) {
        this.activeItem = activeItem;
        // find parent of activeItem
        this.activeParent = store.manifest.items.find((d) => activeItem.parent === d.id)||"";
        const children = store.getItemChildren(store.activeId);

        if (children) {
          if (children.length > 0) {
            this.setLayout("grid");

            this.childrenArray = [...children];
          } else if (activeItem.parent) {
            this.childrenArray = [];
            this.setLayout("media"); //currently unused
          } else {
            this.childrenArray = [];

            this.setLayout("text");//currently unused
          }
        }
      }
      this.__disposer.push(reaction);
    });
    
    //get related items of activeItem
    autorun((reaction) => {
      const activeItem = toJS(store.activeItem);
      if (activeItem) {
        this.activeItem = activeItem;
        
        if(this. activeItem.metadata.relatedItems){
          let relatedItem = store.findItem(activeItem.metadata.relatedItems);
          if (!this.relatedItems.some((item) => item.id === relatedItem.id)) { //check for duplicates
            this.relatedItems.push(relatedItem);
          }
        }

        // console.log(this.relatedItems);
        this.__disposer.push(reaction);
      }
    });


  
  }


  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      activeLayout: { type: String },
      activeItems: { type: Array },
      activeParent: { type: Object },
      relatedItem: { type: Object },
      childrenArray: { type: Array },
      categoryTags: { type: Array },
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


  setLayout(layout) {
    if (globalThis.document && globalThis.document.startViewTransition) {
      globalThis.document.startViewTransition(() => {
        this.activeLayout = layout;
      });
    }
    else {
      this.activeLayout = layout;
    }
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
      * {
        box-sizing: border-box;
    
        --bg-color: #111111;
        --main-font: "Manrope", "Manrope Placeholder", sans-serif;
        --max-width: 1200px;
        --page-padding: 0 25px;
        --link-color: #6cddff;
        --link-color-hover: #9ae7ff;
        --main-font-size: 18px;
        
        --mobile-page-padding: 0 15px;

        
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
        color: var(--ddd-theme-primary);
        font-family: var(--main-font);
        margin: auto;
        box-sizing: border-box;
        overflow: visible;
        min-height: 100vh;
        background-color: var(--bg-color);

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
      }
      
      p, h1, h2, h3, h4, h5, h6, li, a, blockquote, pre, code, span, strong, em {
        max-width: 840px;
        /* letter-spacing: .01em; */
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
      
      /* wrapper style */
      site-active-title h1{
        margin-bottom: 0;
        /* margin-top: 0.25em; */
      }
      .wrapper {
        /* min-width: 100%; */
        max-width: var(--max-width);
        padding: var(--page-padding);
        /* background-color: red; */
        margin: 0 auto;

      }

      #contentcontainer {
        min-width: 100%;
      }

      site-breadcrumb {
        color: white;
      }

      glossy-portfolio-footer{
        position: relative;
        bottom: 0;
        width: 100%;
      }
      .body-wrapper { 
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }

      .grow {
        flex: 1 0 auto; /* Allow this element to grow and fill available space */
      }
      .not-grow {
        flex: 0 0 auto; /* Prevent this element from growing */
      }

  
      /* Extra small devices (phones) */
      @media (max-width: 575.98px) {
        :root, html, body{
          /* font-size: 124px; */
          font-family: var(--main-font);
          color: white;
          background-color: var(--bg-color);
          font-size: 14px;

       }
      }
    `];
  }

  // Lit render the HTML
  
  render() {
    // console.log("activeLayout", this.activeLayout);
    
    const activeTitle = this.activeItem?.title || "Default Title"; // Use optional chaining and a fallback value
    return html`
    <!-- temporary margin-top  -->
<div class="body-wrapper" style="margin-top: 150px"> 
  <div id="contentcontainer" class="grow">
    <div class="wrapper">
      <glossy-portfolio-breadcrumb></glossy-portfolio-breadcrumb>

      <site-active-title></site-active-title>          
      <div id="slot"><slot></slot></div>
    </div>

  </div> 

  <glossy-portfolio-header></glossy-portfolio-header>

  <!-- display grid of children items -->
  ${ this.childrenArray && this.childrenArray.length > 0
  ? html` <glossy-portfolio-grid class="grow" title=${activeTitle} .data=${this.childrenArray} style=""></glossy-portfolio-grid>`
  : ``}

  <!-- display grid of related items -->
  ${ this.relatedItems&&this.relatedItems.length > 0
  ? html` <glossy-portfolio-grid class="grow" title="RELATED CONTENT" .data=${this.relatedItems} style=""></glossy-portfolio-grid>`
  : ``}
  <footer><glossy-portfolio-footer class="not-grow"></glossy-portfolio-footer></footer>
  <!-- <glossy-portfolio-footer></glossy-portfolio-footer> -->



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