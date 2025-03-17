/**
 * Copyright 2025 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-media-banner.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-breadcrumb.js";
import { HAXCMSLitElementTheme } from "@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { toJS, autorun } from "mobx";

/**
 * `clean-portfolio-theme`
 * 
 * @demo index.html
 * @element clean-portfolio-theme
 */

// TODO
// - Layouts
//    - Text✔️
//    - Listing✔️
//    - Media✔️
// - Responsiveness
//    - Condensed menu
// - Light-dark support
// - Abstraction
//    - Active media banner
//    - Breadcrumb (use site-breadcrumb.js?)
//    - Social media card
// - Other
//    - Site background color should be overriden with --portfolio-lightDark-bg
//    - Focus should only highlight a menu item and not its underline
//    - Header and footer should change color for media layout(?)
//      - document.querySelector("header").style.color = "#ffffff";
//    - Footer should stay at the bottom of the page
//    - Switching pages breaks edit button

export class CleanPortfolioTheme extends DDDSuper(HAXCMSLitElementTheme) {

  static PortfolioFonts = [
    "https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap",
    "https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap",
    "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap",
  ];

  loadFonts() {
    if (
      globalThis &&
      globalThis.document //&&
      //!globalThis.document.querySelector('[data-ddd="font"]')
    ) {
      CleanPortfolioTheme.PortfolioFonts.forEach((font) => {
        const link = globalThis.document.createElement("link");
        link.setAttribute("href", font);
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("fetchpriority", "low");
        //link.setAttribute("display", "swap");
        //link.setAttribute("data-ddd", "font");
        globalThis.document.head.appendChild(link);
      });
    }
  }

  static get tag() {
    return "clean-portfolio-theme";
  }

  constructor() {
    super();

    // gets site title for site-title
    autorun((reaction) => {
      this.siteTitle = toJS(store.siteTitle);
      this.__disposer.push(reaction);
    });

    // gets home link for site-title
    autorun((reaction) => {
      this.homeLink = toJS(store.homeLink);
      this.__disposer.push(reaction);
    });

    // gets current page title for listing-title, media-title, and breadcrumb-title
    autorun((reaction) => {
      this.activeTitle = toJS(store.activeTitle);
      this.__disposer.push(reaction);
    });

    // gets current page's parent title for breadcrumb-back
    autorun((reaction) => {
      this.parentTitle = toJS(store.parentTitle);
      this.__disposer.push(reaction);
    });

    // gets current page's parent slug for breadcrumb-back
    // autorun((reaction) => {
    //   this.parentSlug = toJS(store.parentSlug);
    //   this.__disposer.push(reaction);
    // });

    // gets current page's tags and inserts them into an array for media-tag
    autorun((reaction) => {
      let tags = toJS(store.activeTags);
      if (tags && tags.length > 0) {
        this.activeTags = tags.split(',');
      } else {
        this.activeTags = [];
      }
      this.__disposer.push(reaction);
    });

    // gets top level items for menu-item
    autorun((reaction) => {
      // const manifest = store.manifest;
      let items = store.getItemChildren(null); 
      if (items && items.length > 0) {
        this.topItems = [...items];
      }
      this.__disposer.push(reaction);
    });
    
    // determines active layout based on following conditions:
    // - if the current page has no child, it's Text
    // - if the current page has a child, it's Listing
    // - if the current page has a parent, it's Media
    autorun((reaction) => {
      // const manifest = store.manifest;
      let active = toJS(store.activeItem);
      if (active) {
        if (active.parent) {
          this.activeLayout = "Media";
        } else {
          let items = store.getItemChildren(store.activeId);
          if (items) {
            if (items.length > 0) {
              this.activeLayout = "Listing";
              this.items = [...items];
            } else {
              this.activeLayout = "Text";
            }
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
      siteTitle: { type: String },
      homeLink: { type: String },
      activeTitle: { type: String },
      activeLayout: { type: String },
      activeTags: { type: Array },
      parentTitle: { type: String },
      // parentSlug: { type: String },
      topItems: { type: Array },
      items: { type: Array }
    };
  }

  HAXCMSGlobalStyleSheetContent() {
      return [
        ...super.HAXCMSGlobalStyleSheetContent(),
        css`
        :root, html, body {
            --ddd-font-primary: "Source Code Pro" !important;
            font-family: var(--ddd-font-primary);
            font-size: var(--ddd-theme-body-font-size);
            font-weight: var(--ddd-font-weight-regular);
        }
        `
    ];
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        color: var(--ddd-theme-primary);

        /* site color variables */
        --portfolio-black: #000000;
        --portfolio-white: #ffffff;
        --portfolio-lighterGrey: #bfbfbf;
        --portfolio-lightGrey: #8a8a8a;
        --portfolio-grey: #424242;
        --portfolio-darkGrey: #333;
        --portfolio-textHeader: #efefef;
        --portfolio-textHeaderHover: #b7b7b7;
        --portfolio-backgroundWhite: #f7f7f7;
        --portfolio-menuItemUnderline: #ff0000; 

        --portfolio-lightDark-blackWhite: light-dark(var(--portfolio-black), var(--portfolio-white));
        --portfolio-lightDark-whiteBlack: light-dark(var(--portfolio-white), var(--portfolio-black));
        --portfolio-lightDark-bg: light-dark(var(--portfolio-backgroundWhite), var(--portfolio-grey));
        --portfolio-lightDark-footer: light-dark(var(--portfolio-black), var(--portfolio-darkGrey));
        
        background-color: var(--portfolio-lightDark-bg);
      }

      /* Semantic elements */

      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 26px 250px;
        background-color: var(--portfolio-darkGrey);
        border-bottom: 1px;
      }

      h1, h2, h3, h4, h5, h6 {
        color: var(--portfolio-lightDark-blackWhite);
        line-height: 1.2;
        font-family: "Source Code Pro";
        font-weight: 700;
        margin-bottom: 0.75rem;
        margin-top: 0;
      }

      /* h1 {
          font-size: 2.5rem;
      }
      
      h2 {
          font-size: 2rem;
      } */
      
      h3 {
          font-size: 24px;
          text-transform: uppercase;
      }

      /* h4 {
          font-size: 1.5rem;
      }
      
      h5 {
          font-size: 1.25rem;
      }
      
      h6 {
          font-size: 1rem;
      } */

      /* font-family: "Source Code Pro", Monaco, Consolas, "Lucida Console", monospace; */
      p {
        font-family: "Source Code Pro";
        font-size: 24px;
        line-height: 1.5;
        margin-bottom: 1.3em;
      }

      ul {
        list-style-type: disc;
      }

      li {
        font-family: "Source Code Pro";
      }

      li::marker {
        color: var(--portfolio-lightDark-blackWhite) !important;
      }

      ul li, ol li {
          margin-bottom: 0.5em
      }

      li ul,li ol {
          margin-top: 0.5em
      }

      footer {
        background-color: var(--portfolio-lightDark-footer);
        color: var(--portfolio-white);
        font-family: "Source Code Pro";
        font-size: .6875em;
        padding: 40px;
        padding-left: 200px;
      }

      /* Site header elements */

      /* font-family: "Work Sans", -apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", "Helvetica Neue", "Lucida Grande", Arial, sans-serif; */
      #site-title {
        color: var(--portfolio-textHeader);
        font-family: "Work Sans";
        font-weight: bold;
        font-size: 20px;
        text-transform: uppercase;
        text-decoration: none;
        border: 5px solid white;
        padding: 0.5rem 0.5rem;
        transition: all 0.2s ease-in-out;
      }

      #site-title:hover,
      #site-title:focus {
        color: var(--portfolio-textHeaderHover);
      }

      header a.menu-item {
        display: inline-block;
        color: var(--portfolio-textHeader);
        font-family: "Work Sans";
        font-weight: 450;
        text-align: center;
        text-decoration: none;
        transition: all 0.3s ease-in-out;
        margin: 10px;
        position: relative;
      }

      header a.menu-item:after {
        content: "";
        position: absolute;
        bottom: -8px;
        left: 50%;
        width: 0;
        height: 4px;
        background-color: var(--portfolio-menuItemUnderline);
        transform: translateX(-50%);
        transition: all 0.2s ease-in-out;
      }

      .menu-item:hover,
      .menu-item:focus {
        color: var(--portfolio-textHeaderHover);
      }

      .menu-item:hover:after,
      .menu-item:focus:after {
        width: 100%;
        transform: translateX(-50%) scaleX(1);
      }

      /* Text layout */

      .text-container {
        margin: auto;
        margin-top: 50px;
        width: 40%;
        text-align: left;
      }

      /* Listing layout */

      .listing-container {
        margin: auto;
        width: 50%;
      }

      .listing-title {
        font-family: "Playfair Display";
        font-size: 96px;
        font-weight: bold;
        margin-top: 100px;
      }

      .listing-category {
        font-family: "Source Code Pro";
        text-transform: uppercase;
        border-top: 6px solid var(--portfolio-lightDark-blackWhite);
        margin-bottom: 25px;
      }

      .listing-list {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 5px;
        width: 100%;
        transition: all 0.2s ease-in-out;
      }

      div .listing-card {
        width: 180px;
        max-width: 100%;
        margin: 10px;
        text-decoration: none;
      }

      .listing-card:hover .listing-cardtitle {
        text-decoration: underline;
      }

      .listing-card img {
        width: 100%;
        height: 125px;
        object-fit: cover;
        display: block;
        border-radius: 6px;
        margin-bottom: 12px;
      }

      .listing-cardtitle {
        color: var(--portfolio-lightDark-blackWhite);
        font-family: "Work Sans";
        font-weight: 400;
        text-transform: uppercase;
      }

      .listing-cardyear {
        color: #6D4C41;
        font-family: "Source Code Pro";
        font-size: 14px;
        font-weight: 400;
      }
      
      /* Media layout */

      /* site-breadcrumb {
        display: flex;
        align-items: center;
        width: 100%;
        height: 60px;
        gap: 10px;
        margin-left: 250px;
        font-family: "Work Sans";
        font-weight: 450;
      } */
      
      .breadcrumb {
        display: flex;
        align-items: center;
        width: 100%;
        height: 60px;
        gap: 10px;
        margin-left: 250px;
        font-family: "Work Sans";
        font-weight: 450;
      }

      div .breadcrumb-back {
        color: var(--portfolio-lightDark-blackWhite);
        font-weight: 450;
      }

      .breadcrumb-split {
        color: var(--portfolio-lightDark-blackWhite);
      }

      .breadcrumb-title {
        color: var(--portfolio-lightDark-blackWhite);
        font-weight: bold;
      }

      .media-content {
        margin: auto;
        margin-top: 100px;
        width: 38%;
        padding-bottom: 50px;
      }

      .media-banner {
        width: 100%;
        height: auto;
        transition: width 0.75s ease-in-out;
      }

      .media-title {
        color: var(--portfolio-lightDark-blackWhite);
        font-family: "Playfair Display";
        font-size: 72px;
        font-weight: bold;
        margin-top: 100px;
        margin-bottom: 25px;
      }

      .media-tag-list {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
      }

      .media-tag {
        color: var(--portfolio-lightDark-blackWhite);
        font-family: "Source Code Pro";
        font-size: 1.25em;
        font-weight: 400;
        padding-top: 5px;
        padding-bottom: 5px;
        margin-bottom: 25px;
      }

      .media-text {
        color: var(--portfolio-lightDark-blackWhite);
        font-family: "Source Code Pro";
      }

      .media-image {
        width: 100%;
        height: auto;
        margin-bottom: 18px;
      }

      /* Media queries */

      @media (max-width: 1200px) {
        .page-card-list {
          grid-template-columns: repeat(3, 1fr);
        }
      }
      
      @media (max-width: 800px) {
        .page-card-list {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media (max-width: 600px) {
        .page-card-list {
          grid-template-columns: 1fr;
        }
      }

      #layout-button {
        position: absolute;
      }
    `];
  }

  renderText() {
    return html`
      <div class="text-container" id="contentcontainer">
        <div id="slot"><slot></slot></div>
      </div>
    `;
  }

  renderListing() {
    return html`
          <div class="listing-container" id="contentcontainer">
            <h1 class="listing-title">${this.activeTitle}</h1> 
            <h3 class="listing-category">Art Installations</h3>

            <div class="listing-list">
              ${this.items && this.items.length > 0
                ? this.items.map(
                    (item) => html`
                      <a class="listing-card" href="${item.slug}">
                        <img src="https://michaelcollins.xyz/assets/images/portfolio/privy-exhibition/privy-gallery-02.jpg">
                        <div class="listing-cardtitle">${item.title}</div>
                          <div class="listing-cardyear">2025</div>
                      </a>
                    `
                  )
                : ''}
            </div>

            <div id="slot"><slot></slot></div>
          </div>
    `;
  }

  renderMedia() {
    return html`
    <div class="breadcrumb-container">
      <div class="breadcrumb">
        <a class="breadcrumb-back" href=${this.parentSlug}>← ${this.parentTitle}</a>
        <span class="breadcrumb-split">/</span>
        <span class="breadcrumb-title">${this.activeTitle}</span>
      </div>
      <!-- <site-breadcrumb></site-breadcrumb> -->
    </div>

    <img class="media-banner" src="https://michaelcollins.xyz/assets/images/portfolio/interspatial/interspatial-front.jpg">

    <div class="media-content" id="contentcontainer">
      <h1 class="media-title">${this.activeTitle}</h1>
      <div class="media-tag-list" >
       ${this.activeTags && this.activeTags.length > 0
        ? this.activeTags.map(
            (item, index) => html`
              <h3 class="media-tag">
                ${item}${index < this.activeTags.length - 1 ? ',' : ''}
              </h3>
            `
          )
        : ''}
      </div>
      
      <div id="slot"><slot></slot></div>
    </div>
    `;
  }

  ChangeLayout() {
    if (this.activeLayout == "Text") {
      this.activeLayout = "Listing";
    } else if (this.activeLayout == "Listing") {
      this.activeLayout = "Media";
    } else {
      this.activeLayout = "Text";
    }
  }

  breadCrumbDecoration(){
    return html``
  }

  // Lit render the HTML
  render() {
    this.loadFonts();

    return html`
      <button id="layout-button" @click="${this.ChangeLayout}">Active layout: ${this.activeLayout}</button>
      
      <header>
        <a id="site-title" href="${this.homeLink}">${this.siteTitle}</a>
        <div>
          ${this.topItems.map(
              (item) => html`
                <a class="menu-item" href="${item.slug}"> ${item.title} </a>
              `,
          )}
        </div>
      </header>

      ${this.activeLayout == "Text"
      ? this.renderText()
      : this.activeLayout == "Media"
      ? this.renderMedia()
      : this.renderListing()}
      
      <footer>© 2025 Collin Micheals.</footer>
    `;
  }

}

globalThis.customElements.define(CleanPortfolioTheme.tag, CleanPortfolioTheme);