/**
 * Copyright 2025 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
//import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-media-banner.js";
//import { autorun, toJS } from "mobx";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";

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
//    - Breadcrumb
//    - Social media card
// - Other
//    - Site background color should be overriden with --portfolio-lightDark-bg
//    - Focus should only highlight a menu item and not its underline
//    - Header and footer should change color for media layout

export class CleanPortfolioTheme extends DDDSuper(LitElement) {

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
    this.title = "";
    this.activeLayout = "Text"; //Text, Media, Listing
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      activeLayout: { type: String },
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
        
        background-color: var(--portfolio-lightDark-bg);
      }

      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 30px 250px;
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
        margin-bottom: 1.3em;
      }

      ul {
        list-style-type: disc;
      }

      li {
        font-family: "Source Code Pro";
      }

      /* DDD overrides bullet point color */
      li::marker {
        color: var(--portfolio-lightDark-blackWhite) !important;
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
        text-decoration: none;
        transition: all 0.2s ease-in-out;

        text-transform: uppercase;
        border: 5px solid white;
        font-weight: 750;
        padding: 12px;
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

      header a.header-menu-item:hover {
        color: var(--portfolio-textHeaderHover);
      }

      .menu-item-underline {
        content: "";
        position: absolute;
        outline: none;
        bottom: -12px;
        left: 50%;
        width: 0;
        height: 4px;
        background-color: var(--portfolio-menuItemUnderline);
        transform: translateX(-50%);
        transition: all 0.2s ease-in-out;
      }

      header a.header-menu-item:hover .menu-item-underline {
        width: 100%;
        transform: translateX(-50%) scaleX(1);
      }

      header a.header-menu-item:focus .menu-item-underline {
        width: 100%;
        transform: translateX(-50%) scaleX(1);
      }
      
      .page-content-1 {
        margin: auto;
        margin-top: 50px;
        width: 40%;
        text-align: left;
      }

      .page-content-2 {
        margin: auto;
        width: 50%;
      }

      .page-title {
        font-family: "Playfair Display";
        font-size: 96px;
        font-weight: bold;
        margin-top: 100px;
      }

      .page-category {
        font-family: "Source Code Pro";
        text-transform: uppercase;
        border-top: 6px solid var(--portfolio-lightDark-blackWhite);
        margin-bottom: 25px;
      }

      .page-card-list {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 5px;
        width: 100%;
        transition: all 0.2s ease-in-out;
      }
      .page-card {
        width: 180px;
        max-width: 100%;
        margin: 10px;

        /* blue underline from DDD shows here, override is needed */
        text-decoration: none !important;
      }
      .page-card:hover .page-card-title {
        text-decoration: underline;
      }
      .page-card img {
        width: 100%;
        height: 125px;
        object-fit: cover;
        display: block;
        border-radius: 6px;
        margin-bottom: 12px;
      }
      .page-card-title {
        color: var(--portfolio-lightDark-blackWhite);
        font-family: "Work Sans";
        font-weight: 400;
        text-transform: uppercase;
      }
      .page-card-year {
        color: #6D4C41;
        font-family: "Source Code Pro";
        font-size: 14px;
        font-weight: 400;
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
      .breadcrumb-link {
        /* blue text color and weight for links from DDD show here, override is needed */
        color: var(--portfolio-white) !important;
        font-weight: 450 !important;
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
      <div class="page-content-1">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <h3>Chapter 1 - Genesis</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <h3>Shopping list</h3>
        <ul>
          <li>Milk</li>
          <li>Eggs</li>
          <li>Cheese</li>
        </ul>
      </div>
    `;
  }

  renderListing() {
    return html`
          <div class="page-content-2">
            <h1 class="page-title">Design</h1> 
            <h3 class="page-category">Art Installations</h3>

            <div class="page-card-list">
              <a class="page-card" href="">
                <img src="https://michaelcollins.xyz/assets/images/portfolio/privy-exhibition/privy-gallery-02.jpg">
                <div class="page-card-title">Privy</div>
                  <div class="page-card-year">2016</div>
              </a>

              <a class="page-card" href="">
                <img src="https://michaelcollins.xyz/assets/images/portfolio/the-real-estate/theRealEstate_02.jpg">
                <div class="page-card-title">The Real Estate</div>
                  <div class="page-card-year">2012</div>
              </a>

              <a class="page-card" href="">
                <img src="https://michaelcollins.xyz/assets/images/portfolio/subrosa/subRosa-000.jpg">
                <div class="page-card-title">Subrosa</div>
                  <div class="page-card-year">2012</div>
              </a>

              <a class="page-card" href="">
                <img src="https://michaelcollins.xyz/assets/images/portfolio/american-cheese/americancheese_z-corp_01.jpg">
                <div class="page-card-title">American Cheese</div>
                  <div class="page-card-year">2012</div>
              </a>

              <a class="page-card" href="">
                <img src="https://michaelcollins.xyz/assets/images/portfolio/interspatial/interspatial-front.jpg">
                <div class="page-card-title">Interspatial</div>
                  <div class="page-card-year">2011</div>
              </a>
            </div>
          </div>
    `;
  }

  renderMedia() {
    // TODO: recolor header and footer on this layout
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
    this.loadFonts();

    return html`
      <button id="layout-button" @click="${this.ChangeLayout}">Active layout: ${this.activeLayout}</button>
      
      <header>
        <a id="site-title" href="">Michael Collins</a>
        <div>
          <a class="header-menu-item" href="">About <div class="menu-item-underline"></div></a>
          <a class="header-menu-item" href="">Design <div class="menu-item-underline"></div></a>
          <a class="header-menu-item" href="">Publications <div class="menu-item-underline"></div></a>
          <a class="header-menu-item" href="">Curriculum <div class="menu-item-underline"></div></a>
        </div>
      </header>

      ${this.activeLayout === "Text"
      ? this.renderText()
      : this.activeLayout === "Media"
      ? this.renderMedia()
      : this.renderListing()}
      
      <footer>© 2025 Collin Micheals.</footer>
    `;
  }

}

globalThis.customElements.define(CleanPortfolioTheme.tag, CleanPortfolioTheme);