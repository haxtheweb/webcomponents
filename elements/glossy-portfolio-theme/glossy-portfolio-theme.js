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
import "./lib/glossy-portfolio-card.js";
import "./lib/glossy-portfolio-header.js";
import "./lib/glossy-portfolio-page.js";
import "./lib/glossy-portfolio-home.js";
import "./lib/glossy-portfolio-grid.js";
import "./lib/glossy-portfolio-about.js";
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

    this.activeLayout = "grid"; // text, media, listing
    this.activeParent = ""; // set with activeItem, used for parentSlug and parentTitle
    this.__disposer = this.__disposer || [];


    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "Title",
    };

    // determines active layout based on following conditions:
    // - if the current page has no child, it's Text
    // - if the current page has a child, it's Listing
    // - if the current page has a parent, it's Media
    autorun((reaction) => {
      const activeItem = toJS(store.activeItem);
      if (activeItem) {
        this.activeItem = activeItem;
        // find parent of activeItem
        this.activeParent = store.manifest.items.find((d) => activeItem.parent === d.id)||"";
    
 
        
        const items = store.getItemChildren(store.activeId);
        if (items) {
          if (items.length > 0) {
            this.setLayout("grid");

            const categoryTags = []; 

            // get tags for all children of activeItem, push to arrays

            this.items = [...items];
            // this.categoryTags = [...categoryTags];

          } else if (activeItem.parent) {
            this.setLayout("media");
          } else {
            this.setLayout("text");
          }
        }
      }
      this.__disposer.push(reaction);
    });
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      activeLayout: { type: String },
      activeItem: { type: Object },
      activeParent: { type: Object },
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
    if(this.activeLayout==="grid"){
      return html`

    <!-- <glossy-portfolio-home></glossy-portfolio-home> -->
      <!-- <div id="contentcontainer">
        <div id="slot"><slot></slot></div>
      </div>  -->
      <!-- <glossy-portfolio-about></glossy-portfolio-about> -->
      <!-- <glossy-portfolio-page></glossy-portfolio-page> -->
      <glossy-portfolio-header></glossy-portfolio-header>
      <glossy-portfolio-grid title=${this.activeItem.title} .data=${this.items} style="margin-top: 50px"></glossy-portfolio-grid>

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