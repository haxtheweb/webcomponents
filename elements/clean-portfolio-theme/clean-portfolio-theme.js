/**
 * Copyright 2025 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-media-banner.js";
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
//    - Breadcrumb
//    - Social media card
// - Other
//    - Site background color should be overriden with --portfolio-lightDark-bg
//    - Focus should only highlight a menu item and not its underline
//    - Header and footer should change color for media layout

const PortfolioFonts = [
  "https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap",
  "https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap",
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap",
];

export class CleanPortfolioTheme extends DDDSuper(HAXCMSLitElementTheme) {

  static get tag() {
    return "clean-portfolio-theme";
  }

  constructor() {
    super();
    this.siteTitle = "";
    this.activeLayout = "Text"; //Text, Media, Listing
    autorun((reaction) => {
      this.siteTitle = toJS(store.siteTitle);
      this.__disposer.push(reaction);
    });
    autorun((reaction) => {
      const manifest = store.manifest;
      let items = store.getItemChildren(null);
      if (items && items.length > 0) {
        this.topItems = [...items];
      }
      this.__disposer.push(reaction);
    });
  }

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    let DesignSystemManager = globalThis.DesignSystemManager.requestAvailability();
    DesignSystemManager.addDesignSystem({
      name: "clean-portfolio-theme",
      styles: CleanPortfolioTheme.styles,
      fonts: PortfolioFonts,
      hax: true,
    });
    DesignSystemManager.active = 'clean-portfolio-theme';
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      activeLayout: { type: String },
      topItems: { type: Array },
    };
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
        --portfolio-lightDark-bg: light-dark(var(--portfolio-backgroundWhite), var(--portfolio-black));
        --portfolio-lightDark-footer: light-dark(var(--portfolio-black), var(--portfolio-darkGrey));
        
        background-color: red;
      }

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
      #site-title:hover {
        color: var(--portfolio-textHeaderHover);
      }

      header a.header-menu-item {
        display: inline-block;
        text-align: center;
        color: var(--portfolio-textHeader);
        font-family: "Work Sans";
        text-decoration: none;
        transition: all 0.3s ease-in-out;

        font-weight: 450;
        margin: 10px;
        position: relative;
      }
      .title {
        text-align: center;
        color: var(--portfolio-textHeader);
        font-family: "Work Sans";
        font-weight: 450;
        text-decoration: none;
        transition: all 0.3s ease-in-out;
        margin: 10px;
      }
      .menu-item-underline {
        content: "";
        position: absolute;
        bottom: -12px;
        left: 50%;
        width: 0;
        height: 4px;
        background-color: var(--portfolio-menuItemUnderline);
        transform: translateX(-50%);
        transition: all 0.2s ease-in-out;
      }

      .header-menu-item:hover,
      .header-menu-item:focus {
        color: var(--portfolio-textHeaderHover);
      }
      .header-menu-item:hover .menu-item-underline,
      .header-menu-item:focus .menu-item-underline {
        width: 100%;
        transform: translateX(-50%) scaleX(1);
      }

      .breadcrumb-container {
        background-color: var(--portfolio-grey);
        width: 100%;
        height: 60px;
        display: flex;
        justify-content: center;
      }
      .breadcrumb-border {
        border-top: 1px solid var(--portfolio-lighterGrey);
        background-color: var(--portfolio-grey);
        width: 75%;
        display: flex;
        justify-content: center;
      }
      .breadcrumb {
        background-color: var(--portfolio-grey);
        font-family: "Work Sans";
        font-weight: 450;
        width: 95%;
        height: 100%;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .breadcrumb-separator {
        color: var(--portfolio-white);
      }
      .breadcrumb-item {
        color: var(--portfolio-white);
        font-weight: bold;
      }
      div .breadcrumb-link {
        color: var(--portfolio-white);
        font-weight: 450;
      }

      .text-layout-container {
        margin: auto;
        margin-top: 50px;
        width: 40%;
        text-align: left;
      }

      .listing-layout-container {
        margin: auto;
        width: 50%;
      }
      .listing-layout-title {
        font-family: "Playfair Display";
        font-size: 96px;
        font-weight: bold;
        margin-top: 100px;
      }
      .listing-layout-category {
        font-family: "Source Code Pro";
        text-transform: uppercase;
        border-top: 6px solid var(--portfolio-lightDark-blackWhite);
        margin-bottom: 25px;
      }
      .listing-layout-list {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 5px;
        width: 100%;
        transition: all 0.2s ease-in-out;
      }
      div .listing-layout-card {
        width: 180px;
        max-width: 100%;
        margin: 10px;
        text-decoration: none;
      }
      .listing-layout-card:hover .listing-layout-cardtitle {
        text-decoration: underline;
      }
      .listing-layout-card img {
        width: 100%;
        height: 125px;
        object-fit: cover;
        display: block;
        border-radius: 6px;
        margin-bottom: 12px;
      }
      .listing-layout-cardtitle {
        color: var(--portfolio-lightDark-blackWhite);
        font-family: "Work Sans";
        font-weight: 400;
        text-transform: uppercase;
      }
      .listing-layout-cardyear {
        color: #6D4C41;
        font-family: "Source Code Pro";
        font-size: 14px;
        font-weight: 400;
      }

      .media-layout-container {
        background-color: var(--portfolio-grey);
      }
      .media-layout-content {
        margin: auto;
        margin-top: 100px;
        width: 38%;
        padding-bottom: 50px;
      }
      .media-layout-banner {
        width: 100%;
        height: auto;
        transition: width 0.75s ease-in-out;
      }
      .media-layout-title {
        color: var(--portfolio-white);
        font-family: "Playfair Display";
        font-size: 72px;
        font-weight: bold;
        margin-top: 100px;
        margin-bottom: 25px;
      }
      .media-layout-year {
        color: var(--portfolio-white);
        font-family: "Source Code Pro";
        font-size: 28px;
        font-weight: 400;
        padding-top: 5px;
        padding-bottom: 5px;
        border-top: 3px solid var(--portfolio-white);
        border-bottom: 1px solid var(--portfolio-white);
        margin-bottom: 25px;
      }
      .media-layout-text {
        color: var(--portfolio-lightGrey);
        font-family: "Source Code Pro";
      }
      .media-layout-image {
        width: 100%;
        height: auto;
        margin-bottom: 18px;
      }

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
      <div class="text-layout-container" id="contentcontainer">
        <div id="slot"><slot></slot></div>
        
      </div>
    `;
  }

  renderListing() {
    return html`
          <div class="listing-layout-container">
            <h1 class="listing-layout-title">Design</h1> 
            <h3 class="listing-layout-category">Art Installations</h3>

            <div class="listing-layout-list">
              <a class="listing-layout-card" href="">
                <img src="https://michaelcollins.xyz/assets/images/portfolio/privy-exhibition/privy-gallery-02.jpg">
                <div class="listing-layout-cardtitle">Privy</div>
                  <div class="listing-layout-cardyear">2016</div>
              </a>

              <a class="listing-layout-card" href="">
                <img src="https://michaelcollins.xyz/assets/images/portfolio/the-real-estate/theRealEstate_02.jpg">
                <div class="listing-layout-cardtitle">The Real Estate</div>
                  <div class="listing-layout-cardyear">2012</div>
              </a>

              <a class="listing-layout-card" href="">
                <img src="https://michaelcollins.xyz/assets/images/portfolio/subrosa/subRosa-000.jpg">
                <div class="listing-layout-cardtitle">Subrosa</div>
                  <div class="listing-layout-cardyear">2012</div>
              </a>

              <a class="listing-layout-card" href="">
                <img src="https://michaelcollins.xyz/assets/images/portfolio/american-cheese/americancheese_z-corp_01.jpg">
                <div class="listing-layout-cardtitle">American Cheese</div>
                  <div class="listing-layout-cardyear">2012</div>
              </a>

              <a class="listing-layout-card" href="">
                <img src="https://michaelcollins.xyz/assets/images/portfolio/interspatial/interspatial-front.jpg">
                <div class="listing-layout-cardtitle">Interspatial</div>
                  <div class="listing-layout-cardyear">2011</div>
              </a>
            </div>
          </div>
    `;
  }

  renderMedia() {
    // TODO: recolor header and footer on this layout
    console.log(document.querySelector("header"));
    // document.querySelector("header").style.color = "#ffffff";

    return html`
    <div class="breadcrumb-container">
      <div class="breadcrumb-border">
        <div class="breadcrumb">
          <a class="breadcrumb-link" href="">← Design</a>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-item">Interspatial</span>
        </div>
      </div>
    </div>

    <div class="media-layout-container">
      <img class="media-layout-banner" src="https://michaelcollins.xyz/assets/images/portfolio/interspatial/interspatial-front.jpg">

      <div class="media-layout-content">
        <h1 class="media-layout-title">Interspatial</h1>
        <h3 class="media-layout-year">2011</h3>

        <p class="media-layout-text">Hey there, it's me, the one and only:</p>
        <p class="media-layout-text">Collin Michaels.</p>
        <p class="media-layout-text">This is a portfolio website so I imagine you're here to look at projects. You should see this really awesome project I worked on (the one in the image above, AND it's in the images below too - how freakin' cool is that?) I spent a lot of time on it, so I think you should check it out. I made it in 2011, as you can see... wow, that was 14 years ago! Crazy how time flies like that, huh? Anyhow, did you look at the project yet? You should do that, I promise you won't be disappointed. Look at it! Do it!</p>

        <img class="media-layout-image" src="https://michaelcollins.xyz/assets/images/portfolio/interspatial/breakdown.jpg">
        <img class="media-layout-image" src="https://michaelcollins.xyz/assets/images/portfolio/interspatial/07_student_polymer_full_production.559.png">
        <img class="media-layout-image" src="https://michaelcollins.xyz/assets/images/portfolio/interspatial/interspatial-front.jpg">
      </div>
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

  // Lit render the HTML
  render() {

    return html`
      <button id="layout-button" @click="${this.ChangeLayout}">Active layout: ${this.activeLayout}</button>
      
      <header>
        <!-- <a id="site-title" href="">Michael Collins</a> -->
        <a id="site-title" href="">${this.siteTitle}</a>
        <div>
          <a class="header-menu-item" href="">About<div class="menu-item-underline"></div></a>
          <a class="header-menu-item" href="">Design<div class="menu-item-underline"></div></a>
          <a class="header-menu-item" href="">Publications<div class="menu-item-underline"></div></a>
          <a class="header-menu-item" href="">Curriculum<div class="menu-item-underline"></div></a>
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