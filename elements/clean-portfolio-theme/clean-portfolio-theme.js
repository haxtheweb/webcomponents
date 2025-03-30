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
import { DDDVariables } from "@haxtheweb/d-d-d/lib/DDDStyles.js";
import { toJS, autorun } from "mobx";

/**
 * `clean-portfolio-theme`
 * 
 * @demo index.html
 * @element clean-portfolio-theme
 */

// TODO
// - Layouts✔️
//    - Text✔️
//    - Listing✔️
//    - Media✔️
// - Light-dark support✔️
// - Responsiveness
//    - Condensed menu
// - Abstraction
//    - Active media banner (use active-media-banner.js)
//    - Breadcrumb (use site-breadcrumb.js?)
//    - Social media card(?)
// - Other
//    - Site background color should be overriden with --portfolio-lightDark-bg✔️
//    - Focus should only highlight a menu item and not its underline
//    - Footer should stay at the bottom of the page

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
    this.activeLayout = "text"; // text, media, listing
    this.isActiveLayoutButtonVisible = false; // flag for change layout debug button
    this.selectedTag = ""; // for filtering listing items

    // MobX listeners

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

    // gets active page's title for listing-title, media-title, and breadcrumb-title
    autorun((reaction) => {
      this.activeTitle = toJS(store.activeTitle);
      this.__disposer.push(reaction);
    });

    // gets active page's parent title for breadcrumb-back
    autorun((reaction) => {
      this.parentTitle = toJS(store.parentTitle);
      this.__disposer.push(reaction);
    });

    // gets active page's tags and inserts them into an array for media-tag
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
        this.activeItem = active;
        let items = store.getItemChildren(store.activeId);
        if (items) {
          if (items.length > 0) {
            this.activeLayout = "listing";
            this.items = [...items];
            this.selectedTag = "";

            // get tags for all children of activeItem, push to arrays
            this.childrenTopTags = [];
            this.childrenAllTags = [];
            this.items.forEach(item => {
              let tags = toJS(item.metadata.tags);
              if (tags) {
                tags = tags.split(',');
                if (!this.childrenTopTags.includes(tags[0])) {
                  this.childrenTopTags.push(tags[0]);
                }
                tags.forEach(tag => {
                  if (!this.childrenAllTags.includes(tag)) {
                    this.childrenAllTags.push(tag);
                  }
                });
              }
            });

            console.log(this.childrenAllTags);
          } else if (active.parent) {
            this.activeLayout = "media";
          } else {
            this.activeLayout = "text";
          }
        }
      }
      this.__disposer.push(reaction);
    });

    
  }

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    let DesignSystemManager = globalThis.DesignSystemManager.requestAvailability();
    DesignSystemManager.addDesignSystem({
      name: "clean-portfolio-theme",
      styles: [...CleanPortfolioTheme.styles, DDDVariables],
      fonts: PortfolioFonts,
      hax: true,
    });
    DesignSystemManager.active = 'clean-portfolio-theme';
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      siteTitle: { type: String },
      homeLink: { type: String },
      activeItem: { type: String },
      activeTitle: { type: String },
      activeLayout: { type: String },
      activeTags: { type: Array },
      parentTitle: { type: String },
      topItems: { type: Array },
      items: { type: Array },
      childrenTopTags: { type: Array },
      childrenAllTags: { type: Array },
      selectedTag: { type: String }
    };
  }

  HAXCMSGlobalStyleSheetContent() {
      return [
        ...super.HAXCMSGlobalStyleSheetContent(),
        css`
        :root, html, body {
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
            --portfolio-cardTag: #6D4C41;
            --portfolio-cardTagLight: #c2a399;

            --portfolio-lightDark-blackWhite: light-dark(var(--portfolio-black), var(--portfolio-white));
            --portfolio-lightDark-whiteBlack: light-dark(var(--portfolio-white), var(--portfolio-black));
            --portfolio-lightDark-bg: light-dark(var(--portfolio-backgroundWhite), var(--portfolio-grey));
            --portfolio-lightDark-footer: light-dark(var(--portfolio-black), var(--portfolio-darkGrey));
            --portfolio-lightDark-cardTag: light-dark(var(--portfolio-cardTag), var(--portfolio-cardTagLight));
            --portfolio-lightDark-cardImg: light-dark(var(--portfolio-lighterGrey), var(--portfolio-darkGrey));

            --ddd-font-primary: "Source Code Pro" !important;
            font-family: var(--ddd-font-primary);
            font-size: var(--ddd-theme-body-font-size);
            font-weight: var(--ddd-font-weight-regular);
            background-color: var(--portfolio-lightDark-bg);
        }
        `
    ];
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
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
        margin-top: 150px;
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

      .listing-titlecontainer {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .listing-title {
        font-family: "Playfair Display" !important;
        font-size: 88px;
        font-weight: bold;
        margin-top: 100px;
        margin-bottom: 50px;
      }

      .listing-select {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .listing-category {
        font-family: "Source Code Pro";
        text-transform: uppercase;
        border-top: 6px solid var(--portfolio-lightDark-blackWhite);
        min-height: 36px;
      }

      .listing-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 15px;
        width: 100%;
        transition: all 0.2s ease-in-out;
      }

      div .listing-card {
        width: 180px;
        max-width: 100%;
        margin-bottom: 48px;
        text-decoration: none;
      }

      .listing-card:hover .listing-cardtitle,
      .listing-card:focus .listing-cardtitle{
        text-decoration: underline;
      }

      .listing-card:hover .listing-cardimg,
      .listing-card:focus .listing-cardimg {
        box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 10px 0px;
      }

      .listing-cardimg {
        background-color: var(--portfolio-lightDark-cardImg);
        width: 100%;
        height: 125px;
        border-radius: 6px;
        margin-bottom: 12px;
        transition: all 0.2s ease-in-out;
        overflow: hidden;
        display: block;
      }

      .listing-cardimg img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .listing-cardtitle {
        color: var(--portfolio-lightDark-blackWhite);
        font-family: "Work Sans";
        font-weight: 400;
        text-transform: uppercase;
      }

      .listing-cardtag {
        color: var(--portfolio-lightDark-cardTag);
        font-family: "Source Code Pro";
        font-size: 14px;
        font-weight: 400;
      }
      
      /* Media layout */
      
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

      .media-container {
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
        list-style-type: none;
        margin: 0;
        padding: 0;
      }

      .media-tag-list li {
        display: inline-block;
      }

      .media-tag {
        color: var(--portfolio-lightDark-blackWhite) !important;
        font-weight: 300 !important;
        font-size: 1.25em;
        text-transform: uppercase;
        padding-top: 5px;
        padding-bottom: 5px;
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
        .listing-grid {
          grid-template-columns: repeat(3, 1fr);
        }
      }
      
      @media (max-width: 800px) {
        .listing-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media (max-width: 600px) {
        .listing-grid {
          grid-template-columns: 1fr;
        }
      }
    `];
  }

  filterItems(e) {
    this.selectedTag = e.target.value;
    this.requestUpdate();
  }  

  renderListing() {
    // Filter items based on selected tag
    const filteredItems = this.selectedTag
    ? this.items.filter(item => {
        let tags = toJS(item.metadata.tags);
        if (tags) {
          // Only include items with selected tag
          tags = tags.split(',');
          return tags.includes(this.selectedTag);
        }
        return false;
      })
    : this.items;

    // Filter top tags based on selected tag
    const filteredTags = this.selectedTag
      ? this.childrenTopTags.filter(tag => 
          filteredItems.some(item => {
            let tags = toJS(item.metadata.tags);
            if (tags) {
              tags = tags.split(',');
              return tags.includes(tag);
            }
            return false;
          })
        )
    : this.childrenTopTags;

    return html`
          <div class="listing-container">
            <div class="listing-titlecontainer">
              <h1 class="listing-title">${this.activeTitle}</h1>
              
              <!-- Render select for filtering tags -->
              ${this.childrenTopTags.length > 0 
                ? html`
                  <select class="listing-select" @change="${this.filterItems}" value="${this.selectedTag}">
                    <option value="">All</option>
                    ${this.childrenTopTags.map(
                      (tag) => html`<option value="${tag}">${tag}</option>`
                    )}
                  </select>`
                : ''
              }
            </div>

            <!-- Render cards based on filtered tags -->
            ${filteredTags.length > 0
              ? filteredTags.map(
                  (topTag) => html`
                    <h3 class="listing-category">${topTag}</h3>
                    <div class="listing-grid">
                      ${filteredItems.filter(item => {
                        // Check if current item has the top-level tag
                        let tags = toJS(item.metadata.tags);
                        if (tags) {
                          return tags.includes(topTag);
                        }
                        return false;
                      }).map(item => {
                        // Get all tags from the item
                        let secondTag = toJS(item.metadata.tags).split(',')[1];

                        return html`
                          <a class="listing-card" href="${item.slug}">
                            <div class="listing-cardimg">
                              <img src="${item.metadata.image}" onerror="this.style.display='none'">
                            </div>
                            <div class="listing-cardtitle">${item.title}</div>
                            <div class="listing-cardtag">${secondTag}</div>
                          </a>
                        `;
                      })}
                    </div>
                  `)
              : html``
            }

            <!-- Render cards with no tags -->
            ${(!this.selectedTag && this.items.some(item => {
              return !toJS(item.metadata.tags);
            })) ? html`
              <h3 class="listing-category"></h3>
              <div class="listing-grid">
                ${this.items.filter(item => {
                  return !toJS(item.metadata.tags);
                }).map(item => html`
                  <a class="listing-card" href="${item.slug}">
                    <div class="listing-cardimg">
                      <img src="${item.metadata.image}" onerror="this.style.display='none'">
                    </div>
                    <div class="listing-cardtitle">${item.title}</div>
                  </a>
                `)}
              </div>
            ` : ''}
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
    </div>

    <img class="media-banner" src="${this.activeItem.metadata.image}">

    <div class="media-container">
      <h1 class="media-title">${this.activeTitle}</h1>
      <ul class="media-tag-list">
       ${this.activeTags && this.activeTags.length > 0
        ? this.activeTags.map(
            (item) => html`
              <li><a class="media-tag" href="http://localhost:8000/elements/haxcms-elements/demo/x/views?tags=${item}">${item}</a></li>
            `
          )
        : ''}
      </ul>
    </div>
    `;
  }

  // for debugging
  ChangeLayout() {
    if (this.activeLayout == "text") {
      this.activeLayout = "listing";
    } else if (this.activeLayout == "listing") {
      this.activeLayout = "media";
    } else {
      this.activeLayout = "text";
    }
  }

  // TODO: add support for back arrow svg
  breadCrumbDecoration(){
    return html``
  }

  // Lit render the HTML
  render() {
    return html`
      ${this.isActiveLayoutButtonVisible
      ? html`<button @click="${this.ChangeLayout}">Active layout: ${this.activeLayout}</button>`
      : ``}
      
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

      ${this.activeLayout == "text"
      ? ``
      : this.activeLayout == "media"
      ? this.renderMedia()
      : this.renderListing()}

      <div class="${this.activeLayout}-container" id="contentcontainer">
        <div id="slot"><slot></slot></div>
      </div>

      <footer>© 2025 Collin Micheals.</footer>
    `;
  }
}

globalThis.customElements.define(CleanPortfolioTheme.tag, CleanPortfolioTheme);