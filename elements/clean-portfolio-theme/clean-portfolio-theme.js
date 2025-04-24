/**
 * Copyright 2025 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-media-banner.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-breadcrumb.js";
import { HAXCMSLitElementTheme } from "@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { DDDVariables } from "@haxtheweb/d-d-d/lib/DDDStyles.js";
import { toJS, autorun, reaction } from "mobx";

/**
 * `clean-portfolio-theme`
 * 
 * @demo index.html
 * @element clean-portfolio-theme
 */

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
    this.location = null;
    this.activeLayout = "text"; // text, media, listing
    this.isActiveLayoutButtonVisible = false; // flag for change layout debug button
    this.selectedTag = ""; // for filtering listing items
    this.menuOpen = false; // for mobile menu button
    this.menuOverflow = []; // items under the mobile menu
    this.childrenTopTags = [];
    this.childrenAllTags = [];
    this.items = [];
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

    // gets active page's title for breadcrumb-title
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

    autorun(() => {
      let location = toJS(store.location);
      if (globalThis.document && globalThis.document.startViewTransition) {
        globalThis.document.startViewTransition(() => {
          this.location = location;
        });
      }
      else {
        this.location = location;
      }
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

        // use site-store's parentTitle method to find parentSlug
        let tmpItem = store.manifest.items.find(
          (d) => store.activeItem.parent === d.id,
        );
        // shift up 1 if we found something
        if (tmpItem) {
          this.parentSlug = tmpItem.slug;
        } else {
          this.parentSlug = "";
        }
        
        let items = store.getItemChildren(store.activeId);
        if (items) {
          if (items.length > 0) {
            this.setLayout("listing");
            if (globalThis.document && globalThis.document.startViewTransition) {
              globalThis.document.startViewTransition(() => {
                this.items = [...items];
              });
            }
            else {
              this.items = [...items];              
            }
            this.selectedTag = "";

            // get tags for all children of activeItem, push to arrays
            let childrenTopTags = [];
            
            let childrenAllTags = [];
            this.items.forEach(item => {
              let tags = toJS(item.metadata.tags);
              if (tags) {
                tags = tags.split(',');
                if (!this.childrenTopTags.includes(tags[0])) {
                  childrenTopTags.push(tags[0]);
                }
                tags.forEach(tag => {
                  if (!this.childrenAllTags.includes(tag)) {
                    childrenAllTags.push(tag);
                  }
                });
              }
            });
            this.childrenTopTags = [...childrenTopTags];
            this.childrenAllTags = [...childrenAllTags];
          } else if (this.parentSlug) {
            this.setLayout("media");
          } else {
            this.setLayout("text");
          }
        }
      }
      this.__disposer.push(reaction);
    });

    // determines if hax editor is enabled
    autorun((reaction) => {
      this.editMode = toJS(store.editMode);
      this.__disposer.push(reaction);

      if (this.editMode) {
        const el = this.shadowRoot.querySelector("#contentcontainer") || document.querySelector("#contentcontainer");
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('activeLayout')) {

    }
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
    this._checkOverflow();
    window.addEventListener('resize', () => {this._checkOverflow()});
  }

  _checkOverflow() {
    const container = this.renderRoot.querySelector('nav');
    const items = Array.from(container.children);
    const availableWidth = container.clientWidth - 100;
    let usedWidth = 0;
    const overflow = [];

    for (const item of items) {
      item.style.display = 'inline-block'; // Ensure all are visible before measuring
    }

    for (const item of items) {
      usedWidth += item.offsetWidth + 25;
      if (usedWidth > availableWidth) {
        const itemSlug = item.getAttribute('href');
        const itemData = this.topItems.find(i => i.slug === itemSlug);
        if (itemData) overflow.push(itemData);
        item.style.display = 'none';
      } else {
        item.style.display = 'inline-block';
      }
    }

    this.menuOverflow = overflow;
    this.requestUpdate();
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      location: { type: String },
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
      selectedTag: { type: String },
      editMode: { type: Boolean },
      menuOpen: { type: Boolean },
      menuOverflow: { type: Array },
      isActiveLayoutButtonVisible: {type: Boolean}
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

            /* site font variables */
            --portfolio-font-body: "Source Code Pro", Monaco, Consolas, "Lucida Console", monospace;
            --portfolio-font-header: "Work Sans", -apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", "Helvetica Neue", "Lucida Grande", Arial, sans-serif;

            background-color: var(--portfolio-lightDark-bg);
            font-family: var(--portfolio-font-body);
            font-size: 16px;
        }

        @media (min-width: 80em) {
          :root, html, body {
            font-size: 22px;
          }
        }

        @media (min-width: 64em) {
          :root, html, body {
            font-size: 20px;
          }
        }

        @media (min-width: 48em) {
          :root, html, body {
            font-size: 18px;
          }
        }
        `
    ];
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      /* Semantic elements */

      :host {
        display: block;
      }

      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        white-space: nowrap;
        position: relative;
        padding: 26px 5vw;
        background-color: var(--portfolio-darkGrey);
        border-bottom: 1px;
      }

      nav {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        flex: 1;
        padding-right: 2rem;
        overflow: hidden;
      }

      h1, h2, h3, h4, h5, h6 {
        color: var(--portfolio-lightDark-blackWhite);
        line-height: 1.2;
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
      
      p {
        font-size: 24px;
        line-height: 1.5;
        margin-bottom: 1.3em;
      }

      ul {
        list-style-type: disc;
      }

      li {
        font-family: var(--portfolio-font-body);
      }

      li::marker {
        color: var(--portfolio-lightDark-blackWhite) !important;
      }

      footer {
        background-color: var(--portfolio-lightDark-footer);
        color: var(--portfolio-white);
        font-family: var(--portfolio-font-body);
        font-size: .6875em;
        padding: 40px 5vw;
        margin-top: 150px;
      }

      :focus {
        outline-offset: 8px;
      }

      /* Site header elements */

      #site-title {
        color: var(--portfolio-textHeader);
        font-family: var(--portfolio-font-header);
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
        color: var(--portfolio-textHeader);
        font-family: var(--portfolio-font-header);
        font-weight: 450;
        text-align: center;
        text-decoration: none;
        transition: all 0.3s ease-in-out;
        margin: 10px;
        display: inline-block;
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
      .menu-item:focus,
      .menu-item.active {
        color: var(--portfolio-textHeaderHover);
      }

      .menu-item:hover:after,
      .menu-item:focus:after,
      .menu-item.active:after {
        width: 100%;
        transform: translateX(-50%) scaleX(1);
      }

      /* Mobile menu */

      /* Button */
      header button {
          display: inline-block;
          color: #fff;
          background-color: var(--portfolio-lightGrey);
          align-self: stretch;
          border: 0;
          width: 45px;
          height: 50px;
          cursor: pointer;
      }

      .navicon {
          position: relative;
          width: 1.5rem;
          height: .25rem;
          background: #fff;
          margin: auto;
          transition: .3s;
      }

      .navicon:before,
      .navicon:after {
          content: "";
          position: absolute;
          left: 0;
          width: 1.5rem;
          height: .25rem;
          background: #fff;
          transition: .3s;
      }

      .navicon:before {
          top: -0.5rem;
      }

      .navicon:after {
          bottom: -0.5rem;
      }

      .close .navicon {
          background: rgba(0,0,0,0);
      }

      .close .navicon:before,
      .close .navicon:after {
          -ms-transform-origin: 50% 50%;
          transform-origin: 50% 50%;
          top: 0;
          width: 1.5rem;
      }

      .close .navicon:before {
          transform: rotate3d(0, 0, 1, 45deg);
      }

      .close .navicon:after {
          transform: rotate3d(0, 0, 1, -45deg);
      }

      .visually-hidden,
      .screen-reader-text,
      .screen-reader-text span,
      .screen-reader-shortcut {
        position: absolute !important;
        clip: rect(1px, 1px, 1px, 1px);
        height: 1px !important;
        width: 1px !important;
        border: 0 !important;
        overflow: hidden;
      }

      /* Dropdown */
      .hidden-links {
        position: absolute;
        top: 90%;
        right: 5.5%;
        padding: 5px;
        gap: 0;
        border-radius: 4px;
        box-shadow: 0 2px 4px 0 rgba(#000, 0.16), 0 2px 10px 0 rgba(#000, 0.12);
        background-color: var(--portfolio-lightGrey);
      }

      .hidden-links li {
        display: block;
        border-bottom: 1px solid var(--portfolio-lighterGrey);
        padding: 10px;
      }

      .hidden-links li:last-child {
        border-bottom: none;
      }

      .hidden-links a {
        color: var(--portfolio-white);
        font-size: 16px;
        font-weight: 400;
        font-family: var(--portfolio-font-header);
        text-decoration: none;
        display: block;
      }

      .hidden-links a:hover,
      .hidden-links a:focus {
        color: var(--portfolio-lighterGrey);
        transition: .3s;
      }

      .hidden-links a.active {
        color: var(--portfolio-lighterGrey);
        transition: none;
      }

      .hidden {
        display: none;
      }

      /* Pointy arrow thing for dropdown */
      .hidden-links:before {
        content: "";
        position: absolute;
        top: -10px;
        right: 10px;
        border-style: solid;
        border-width: 0 10px 10px;
        border-color: var(--portfolio-lightGrey) transparent;
      }

      /* Imported elements */

      site-active-title h1 {
        font-family: "Playfair Display";
        font-size: 72px;
        font-weight: bold;
        margin-top: 80px;
        margin-bottom: 24px;
        view-transition-name: location;
      }

      .listing-titlecontainer site-active-title h1 {
        font-size: 88px;
        margin-bottom: 50px;
      }

      /* Tags */

      .tag-list {
        flex-direction: row;
        flex-wrap: wrap;
        list-style-type: none;
        margin: 0 0 20px 0;
        padding: 0;
        border-top: 3px solid var(--portfolio-lightDark-blackWhite);
        border-bottom: 1px solid var(--portfolio-lightDark-blackWhite);
      }

      .tag-list li {
        margin: 0 10px 0 0;
        padding-top: 5px;
        padding-bottom: 5px;
      }

      .tag-list li a {
        color: var(--portfolio-lightDark-blackWhite);
        font-weight: 400;
        font-size: 1.25em;
        text-transform: uppercase;
      }

      /* Layouts */

      .text-container,
      .listing-container,
      .media-container {
        margin: 50px auto;
        width: 90%;
        max-width: 800px;
        text-align: left;
        view-transition-name: location;
      }

      /* Listing layout */

      .listing-titlecontainer {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .listing-select {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 200px;
      }

      .listing-category {
        font-family: var(--portfolio-font-body);
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
        font-family: var(--portfolio-font-header);
        font-weight: 400;
        font-size: 21px;
        text-transform: uppercase;
      }

      .listing-cardtag {
        color: var(--portfolio-lightDark-cardTag);
        font-family: var(--portfolio-font-body);
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
        margin-left: 5%;
        font-family: var(--portfolio-font-header);
        font-weight: 450;
        transition: .3s;
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

      .media-banner {
        width: 100%;
        height: auto;
        transition: width 0.75s ease-in-out;
      }

      .media-text {
        color: var(--portfolio-lightDark-blackWhite);
        font-family: var(--portfolio-font-body);
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
              <site-active-title></site-active-title>
              <!-- Render select for filtering tags (only appears if >1 tag OR 1 tag and items with no tag) -->
              ${(this.childrenTopTags.length > 1 || (this.childrenTopTags.length > 0 && this.items.some(item => !item.metadata.tags)))
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

  // for debugging
  ChangeLayout() {
    if (this.activeLayout == "text") {
      this.setLayout("listing");
    } else if (this.activeLayout == "listing") {
      this.setLayout("media");
    } else {
      this.setLayout("text");
    }
  }

  // TODO: add support for back arrow svg
  breadCrumbDecoration(){
    return html``
  }

  // disable tags in edit mode
  testEditMode(e) {
    if (this.editMode) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }

  // removes focus from title and dropdown links after clicking them
  handleLinkClick(e) {
    e.currentTarget.blur();
  }

  // mobile menu click
  _toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  // Lit render the HTML
  render() {
    return html`
      ${this.isActiveLayoutButtonVisible
      ? html`<button @click="${this.ChangeLayout}">Active layout: ${this.activeLayout}</button>`
      : ``}
      
      <header>
        <a id="site-title" @click="${this.handleLinkClick}" href="${this.homeLink}">${this.siteTitle}</a>
        <nav>
          ${this.topItems.map(
              (item) => html`
                <a class="menu-item ${this.activeItem && this.activeItem.slug === item.slug ? 'active' : ''}" href="${item.slug}">${item.title}</a>
              `,
          )}
        </nav>
        ${this.menuOverflow.length > 0
          ? html`
            <button type="button" class=${this.menuOpen ? 'close' : ''} @click="${this._toggleMenu}">
              <span class="visually-hidden">Toggle Menu</span>
              <div class="navicon"></div>
            </button>
            <ul class="hidden-links ${!this.menuOpen ? 'hidden' : ''}">
              ${this.menuOverflow.map(
                (item) => html`<li><a class="${this.activeItem && this.activeItem.slug === item.slug ? 'active' : ''}" href="${item.slug}" @click="${this.handleLinkClick}">${item.title}</a></li>`
              )}
            </ul>
          `
        : ''}
      </header>

      <!-- single-level breadcrumb appears on any page with a parent -->
      ${this.parentSlug
      ? html`
        <div class="breadcrumb-container">
          <div class="breadcrumb">
            <a class="breadcrumb-back" href=${this.parentSlug}>← ${this.parentTitle}</a>
            <span class="breadcrumb-split">/</span>
            <span class="breadcrumb-title">${this.activeItem.title}</span>
          </div>
        </div>
      `
      : ``}

      ${this.activeLayout == "text"
      ? ``
      : this.activeLayout == "media"
      ? html`
        <img class="media-banner" src="${this.activeItem.metadata.image}">
      `
      : this.renderListing()}

      <div class="${this.activeLayout}-container" id="contentcontainer">
        ${this.activeLayout == "text" || this.activeLayout == "media"
        ? html`
          <site-active-title></site-active-title>
          <ul class="tag-list">
            ${this.activeTags && this.activeTags.length > 0
            ? this.activeTags.slice(1).map(
                (item) => html`
                  <li><a @click="${this.testEditMode}" href="x/views?tags=${item.trim()}">${item}</a></li>
                `
              )
            : ''}
          </ul>
        `
        : ``}
        <div id="slot"><slot></slot></div>
      </div>

      <footer>© 2025 Collin Micheals.</footer>
    `;
  }
}

globalThis.customElements.define(CleanPortfolioTheme.tag, CleanPortfolioTheme);