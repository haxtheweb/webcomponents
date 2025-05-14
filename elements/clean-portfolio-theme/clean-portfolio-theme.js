/**
 * Copyright 2025 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { HAXCMSLitElementTheme } from "@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-media-banner.js";
import "@haxtheweb/scroll-button/scroll-button.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { DDDVariables } from "@haxtheweb/d-d-d/lib/DDDStyles.js";
import { licenseList } from "@haxtheweb/license-element/license-element.js";

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
    this.siteTheme = ""; // theme name
    this.dataPrimary = 2; // theme ID
    this.activeLayout = "text"; // text, media, listing
    this.activeParent = ""; // set with activeItem, used for parentSlug and parentTitle
    this.selectedTag = ""; // for filtering listing items
    this.menuOpen = false; // for mobile menu button
    this.menuOverflow = []; // items under the mobile menu
    this.lastUpdated = ""; // for footer timestamp
    this.copyrightYear = 0; // for footer copyright year

    // MobX variables/listeners
    this.location = null;
    this.childrenTopTags = [];
    this.childrenAllTags = [];
    this.items = [];

    // gets site title and home link for site-title
    autorun((reaction) => {
      this.siteTitle = toJS(store.siteTitle);
      this.homeLink = toJS(store.homeLink);
      this.__disposer.push(reaction);
    });

    // gets active page's ancestor for menu-item:after
    autorun(() => {
      this.ancestorItem = toJS(store.ancestorItem);
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
      let items = store.getItemChildren(null); 
      if (items && items.length > 0) {
        this.topItems = [...items];
      }
      this.__disposer.push(reaction);
    });

    autorun(() => {
      let location = toJS(store.location);
      console.log(location);
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
      const active = toJS(store.activeItem);
      if (active) {
        // find parent of activeItem
        let parent = store.manifest.items.find(
          (d) => active.parent === d.id,
        );
        if (!parent) {
          parent = "";
        }
        
        if (globalThis.document && globalThis.document.startViewTransition) {
          globalThis.document.startViewTransition(() => {
            this.activeItem = active;
            this.activeParent = parent;
          });
        }
        else {
          this.activeItem = active;
          this.activeParent = parent;  
        }
        
        const items = store.getItemChildren(store.activeId);
        if (items) {
          if (items.length > 0) {
            this.setLayout("listing");

            const childrenTopTags = [];
            const childrenAllTags = [];

            // get tags for all children of activeItem, push to arrays
            items.forEach(item => {
              let tags = toJS(item.metadata.tags);
              if (tags) {
                const tagArray = tags.split(',');
                if (tagArray[0] && !childrenTopTags.includes(tagArray[0])) {
                  childrenTopTags.push(tagArray[0]);
                }
                tagArray.forEach(tag => {
                  if (tag && !childrenAllTags.includes(tag)) {
                    childrenAllTags.push(tag);
                  }
                });
              }
            });

            if (globalThis.document && globalThis.document.startViewTransition) {
              globalThis.document.startViewTransition(() => {
                this.items = [...items];
                this.childrenTopTags = [...childrenTopTags];
                this.childrenAllTags = [...childrenAllTags];
              });
            }
            else {
              this.items = [...items];
              this.childrenTopTags = [...childrenTopTags];
              this.childrenAllTags = [...childrenAllTags];         
            }

            // reset tag select filter
            this.selectedTag = "";
            const select = this.shadowRoot?.querySelector('#listing-select');
            if (select) {
              select.value = ""
            };
          } else if (active.parent) {
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
      const editMode = toJS(store.editMode);
      if (editMode) {
        const el = this.shadowRoot.querySelector("#contentcontainer") || document.querySelector("#contentcontainer");
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      this.__disposer.push(reaction);
    });

    // gets licensing stuff
    autorun(() => {
      this.manifest = toJS(store.manifest);
      let LList = new licenseList();
      if (this.manifest.license && LList[this.manifest.license]) {
        this.licenseName = LList[this.manifest.license].name;
        this.licenseLink = LList[this.manifest.license].link;
        this.licenseImage = LList[this.manifest.license].image;
      }
    });
  }

  firstUpdated(changedProperties) {
    // design system override
    super.firstUpdated(changedProperties);
    let DesignSystemManager = globalThis.DesignSystemManager.requestAvailability();
    DesignSystemManager.addDesignSystem({
      name: "clean-portfolio-theme",
      styles: [...CleanPortfolioTheme.styles, DDDVariables],
      fonts: PortfolioFonts,
      hax: true,
    });
    DesignSystemManager.active = 'clean-portfolio-theme';

    // get timestamps for footer
    this.lastUpdated = new Date(store.manifest.metadata.site.updated * 1000).toDateString();
    this.copyrightYear = new Date(store.manifest.metadata.site.created * 1000).getFullYear();

    // window resize observer for mobile menu
    // NOTE: an event listener works for this too, but only for manual resizing and not in
    //       certain cases when the window is popped out via minimize or dragging
    const nav = this.renderRoot.querySelector('nav');
    if (nav) {
      this._resizeObserver = new ResizeObserver(() => {
        this._checkOverflow();
      });
      this._resizeObserver.observe(nav);
    }
    setTimeout(() => this._checkOverflow(), 100);
  }

  // manages window resize observer
  disconnectedCallback() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }
    super.disconnectedCallback();
  }

  // checks children of nav on resize for mobile menu
  _checkOverflow() {
    const nav = this.renderRoot.querySelector('nav');
    if (nav) {
      const items = Array.from(nav.children);
      const availableWidth = nav.clientWidth - 100;

      let usedWidth = 0;
      const overflow = [];

      for (const item of items) {
        item.style.display = 'inline-block';
        usedWidth += item.offsetWidth + 25;
        if (usedWidth > availableWidth) {
          item.style.display = 'none';
          overflow.push(this.topItems.find(i => i.slug === item.getAttribute('href')));
        }
      }

      this.menuOverflow = overflow;
      this.requestUpdate();
    }
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      activeItem: { type: Object },
      activeParent: { type: Object },
      ancestorItem: { type: Object },
      location: { type: Object },
      topItems: { type: Array },
      items: { type: Array },
      activeTags: { type: Array },
      childrenTopTags: { type: Array },
      childrenAllTags: { type: Array },
      menuOverflow: { type: Array },
      menuOpen: { type: Boolean },
      copyrightYear: { type: Number },
      siteTitle: { type: String },
      homeLink: { type: String },
      activeLayout: { type: String },
      selectedTag: { type: String },
      lastUpdated: { type: String },
      licenseName: { type: String },
      licenseLink: { type: String },
      licenseImage: { type: String },
      dataPrimary: { type: String, attribute: "data-primary", reflect: true },
      siteTheme: { type: String, reflect: true, attribute: 'site-theme' }
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

            --portfolio-fontsize-responsive: clamp(16px, 2vw, 22px);

            background-color: var(--portfolio-lightDark-bg);
            font-family: var(--portfolio-font-body);
            font-size: var(--portfolio-fontsize-responsive);
        }
        `
    ];
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      /* Theme colors */
      :host([site-theme="earth"]) {
        --portfolio-menuItemUnderline:var(--ddd-primary-18);
        --portfolio-lightGrey: var(--ddd-primary-18);
        --portfolio-darkGrey: var(--ddd-primary-17);
      }

      :host([site-theme="water"]) {
        --portfolio-menuItemUnderline: var(--ddd-primary-7);
        --portfolio-lightGrey: var(--ddd-primary-7);
        --portfolio-darkGrey: var(--ddd-primary-1);
      }

      :host([site-theme="fire"]) {
        --portfolio-menuItemUnderline: var(--ddd-primary-12);
        --portfolio-lightGrey: var(--ddd-primary-12);
        --portfolio-darkGrey: var(--ddd-primary-11);
      }

      :host([site-theme="sand"]) {
        --portfolio-menuItemUnderline: var(--ddd-primary-15);
        --portfolio-lightGrey: var(--ddd-primary-15);
        --portfolio-darkGrey: var(--ddd-primary-23);
      }

      /* Semantic elements */
      :host {
        display: block;
      }

      header {
        background-color: var(--portfolio-darkGrey);
        transition: all 0.2s ease-in-out;
        padding: 22px;
      }

      .header-inner {
        display: flex;
        align-items: center;
        width: 100%;
        max-width: 1236px;
        margin: 0 auto;
        line-height: 1.7;
        position: relative;
      }

      nav {
        display: flex;
        gap: .5rem;
        justify-content: flex-end;
        flex: 1 1 auto;
        min-width: 0;
      }

      h1, h2, h3, h4, h5, h6 {
        color: var(--portfolio-lightDark-blackWhite);
        line-height: 1.2;
        font-weight: 700;
        margin-bottom: 0.75rem;
        margin-top: 0;
      }
      
      p {
        font-size: var(--portfolio-fontsize-responsive);
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
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        background-color: var(--portfolio-black);
        color: var(--portfolio-white);
        font-family: var(--portfolio-font-body);
        font-size: clamp(11px, 2vw, 15px);
        padding: 40px 5vw;
        margin-top: 150px;
      }

      :focus {
        outline-offset: 8px;
      }

      /* Site header elements */
      #site-title {
        padding: 0.5rem;
        color: var(--portfolio-textHeader);
        font-family: var(--portfolio-font-header);
        font-weight: bold;
        font-size: var(--portfolio-fontsize-responsive);
        text-transform: uppercase;
        text-decoration: none;
        border: 5px solid white;
        transition: all 0.2s ease-in-out;
      }

      #site-title:hover,
      #site-title:focus {
        color: var(--portfolio-textHeaderHover);
      }

      header a.menu-item {
        display: inline-block;
        position: relative;
        margin: 10px;
        padding: 0 5px;
        white-space: nowrap;
        color: var(--portfolio-textHeader);
        font-family: var(--portfolio-font-header);
        font-size: var(--portfolio-fontsize-responsive);
        font-weight: 450;
        text-align: center;
        text-decoration: none;
        transition: all 0.3s ease-in-out;
      }

      header a.menu-item:after {
        content: "";
        position: absolute;
        bottom: -10px;
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
      .mobile-menu-wrapper {
        position: relative;
        display: flex;
        justify-content: center;
      }

      header button {
          display: inline-block;
          color: #fff;
          background-color: var(--portfolio-lightGrey);
          border: 0;
          width: 45px;
          height: 50px;
          cursor: pointer;
          margin-left: 10px;
          transition: all 0.2s ease-in-out;
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

      .hidden-links {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        padding: 5px;
        gap: 0;
        border-radius: 4px;
        box-shadow: 0 2px 4px 0 rgba(#000, 0.16), 0 2px 10px 0 rgba(#000, 0.12);
        background-color: var(--portfolio-lightGrey);
        z-index: 5;
      }

      .hidden-links:before {
        content: "";
        position: absolute;
        top: -8px;
        right: 12px;
        border-style: solid;
        border-width: 0 10px 10px;
        border-color: var(--portfolio-lightGrey) transparent;
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
        transition: .3s;
      }

      .hidden-links a:hover,
      .hidden-links a:focus,
      .hidden-links a.active {
        color: var(--portfolio-lighterGrey);
      }

      .hidden {
        display: none;
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

      /* Imported elements */
      site-active-title h1 {
        font-family: "Playfair Display";
        font-size: 88px;
        font-weight: bold;
        transition: .3s;
        view-transition-name: location;
      }

      site-active-media-banner {
        --media-banner-background-color: none;
        --media-banner-height: clamp(320px, 80vw, 640px);
        margin: 0;
      }

      .theme-picker {
        --simple-icon-width: 24px;
        --simple-icon-height: 24px;
        padding: 0;
        border-radius: 50%;
      }

      header .theme-picker {
        position: absolute;
        top: 0;
        right: 0;
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

      /* Breadcrumb */
      .breadcrumb-wrapper {
        max-width: 1236px;
        margin: 0 auto;
        padding: 0 22px;
        view-transition-name: location;
      }

      .breadcrumb {
        display: flex;
        align-items: center;
        gap: 10px;
        height: clamp(56px, 2vw, 60px);
        font-family: var(--portfolio-font-header);
        font-size: clamp(14px, 2vw, 18px);
        transition: 0.3s;
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
      
      /* Layouts */
      .container {
        margin: 64px auto;
        width: 90%;
        max-width: 840px;
        text-align: left;
        view-transition-name: location;
      }

      .listing-titlecontainer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 12px;
        margin-bottom: 24px;
      }

      #listing-select {
        font-size: 1rem;
        padding: 0.5em;
        max-width: 240px;
        width: 100%;
      }

      .listing-category {
        font-family: var(--portfolio-font-body);
        font-size: var(--portfolio-fontsize-responsive);
        text-transform: uppercase;
        border-top: 6px solid var(--portfolio-lightDark-blackWhite);
        min-height: 36px;
      }

      .listing-category a {
        color: var(--portfolio-lightDark-blackWhite);
      }

      .listing-grid {
        display: grid;
        gap: 24px;
        width: 100%;
        grid-template-columns: repeat(4, 1fr);
      }

      div .listing-card {
        width: 188px;
        margin-bottom: 48px;
        text-decoration: none;
        transition: .4s;
      }

      .listing-cardimg {
        background-color: var(--portfolio-lightDark-cardImg);
        border-radius: 6px;
        margin-bottom: 12px;
        height: 120px;
        transition: all 0.2s ease-in-out;
        overflow: hidden;
        display: block;
      }

      .listing-card:hover .listing-cardtitle,
      .listing-card:focus .listing-cardtitle{
        text-decoration: underline;
      }

      .listing-card:hover .listing-cardimg,
      .listing-card:focus .listing-cardimg {
        box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 10px 0px;
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
        font-size: clamp(15px, 2vw, 21px);
        text-transform: uppercase;
      }

      .listing-cardtag {
        color: var(--portfolio-lightDark-cardTag);
        font-family: var(--portfolio-font-body);
        font-size: clamp(8px, 2vw, 14px);
        font-weight: 400;
      }

      /* Media queries */
      @media (max-width: 60em) {
        .listing-grid {
          grid-template-columns: repeat(2, 1fr);
        }
        div .listing-card {
          width: 100%;
          margin-bottom: 36px;
        }
        .listing-cardimg {
          height: 210px;
        }
        site-active-title h1 {
          font-size: 72px;
        }
        .breadcrumb {
          height: 40px;
        }
      }

      @media (max-width: 37.5em) {
        .listing-grid {
          grid-template-columns: repeat(1, 1fr);
        }
        div .listing-card {
          margin-bottom: 24px;
        }
        .listing-cardimg {
          height: 240px;
        }
        site-active-title h1 {
          font-size: 64px;
        }
      }
    `];
  }

  _filterItems(e) {
    this.selectedTag = e.target.value;
    this.requestUpdate();
  }  

  _renderListing() {
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
      <!-- Render cards based on filtered tags -->
      ${filteredTags.length > 0
        ? filteredTags.map(
            (topTag) => html`
              <h3 class="listing-category"><a @click="${this.testEditMode}" href="x/tags?display=card&tag=${topTag.trim()}">${topTag}</a></h3>
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

  // removes focus from title, scroll-button, theme-picker, and mobile menu items after clicking
  removeFocus(e) {
    e.currentTarget.blur();
  }

  // mobile menu click
  _toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  // site theme footer button
  toggleSiteTheme(e) {
    e.currentTarget.blur();
    switch (this.siteTheme) {
      case "earth":
        this.siteTheme = "water";
        this.dataPrimary = 1;
      break;
      case "water":
        this.siteTheme = "fire";
        this.dataPrimary = 11;
      break;
      case "fire":
        this.siteTheme = "sand";
        this.dataPrimary = 23;
      break;
      case "sand":
        this.siteTheme = "";
        this.dataPrimary = 2;
      break;
      default:
        this.siteTheme = "earth";
        this.dataPrimary = 1;
      break;
    }
  }

  // Lit render the HTML
  render() {
    return html`
      <header>
        <div class="header-inner">
          <a id="site-title" @click="${this.removeFocus}" href="${this.homeLink}">${this.siteTitle}</a>
          <nav>
            ${this.topItems.map(
                (item) => html`
                  <a
                    class="menu-item ${this.activeItem && (item.id === this.activeItem.id || (this.ancestorItem && item.id === this.ancestorItem.id)) ? 'active' : ''}"
                    href="${item.slug}"
                  >
                    ${item.title}
                  </a>
                `,
            )}
          </nav>
          ${this.menuOverflow.length > 0
            ? html`
              <div class="mobile-menu-wrapper">
                <button type="button" class=${this.menuOpen ? 'close' : ''} @click="${this._toggleMenu}">
                  <span class="visually-hidden">Toggle Menu</span>
                  <div class="navicon"></div>
                </button>
                <ul class="hidden-links ${!this.menuOpen ? 'hidden' : ''}">
                  ${this.menuOverflow.map(
                    (item) => html`
                    <li>
                      <a
                        class="${this.activeItem && (item.id === this.activeItem.id || (this.ancestorItem && item.id === this.ancestorItem.id)) ? 'active' : ''}"
                        href="${item.slug}"
                        @click="${this.removeFocus}"
                      >
                        ${item.title}
                      </a>
                    </li>`
                  )}
                </ul>
              </div>
            ` : ''}
        </div>
        <simple-icon-button-lite icon="image:style" class="theme-picker" @click="${this.toggleSiteTheme}"></simple-icon-button-lite>
      </header>
      
      <div class="breadcrumb-wrapper">
        <div class="breadcrumb">
          ${this.activeParent
            ? html`
              <a class="breadcrumb-back" href=${this.activeParent.slug}>← ${this.activeParent.title}</a>
              <span class="breadcrumb-split">/</span>
              <span class="breadcrumb-title">${this.activeItem.title}</span>
            ` : ``}
        </div>
      </div>

      ${this.activeLayout == "media"
        ? html`<site-active-media-banner></site-active-media-banner>`
        : ''}

      <div id="contentcontainer" class="container">
        ${this.activeLayout == "listing"
          ? html`
              <div class="listing-titlecontainer">
                <site-active-title></site-active-title>
                <!-- Render select for filtering tags (only appears if >1 tag OR 1 tag and items with no tag) -->
                ${(this.childrenTopTags.length > 1 || (this.childrenTopTags.length > 0 && this.items.some(item => !item.metadata.tags)))
                  ? html`
                    <select id="listing-select" @change="${this._filterItems}">
                      <option value="" ?selected="${this.selectedTag === ''}">All</option>
                      ${this.childrenTopTags.map(
                        (tag) => html`
                          <option value="${tag}" ?selected="${this.selectedTag === tag}">
                            ${tag}
                          </option>`
                      )}
                    </select>`
                    : ''}
              </div>
          ` : html`
                <site-active-title></site-active-title>
                ${this.activeTags && this.activeTags.length > 0
                  ? html`
                      <ul class="tag-list">
                        ${(this.activeLayout === "listing"
                          ? this.activeTags
                          : this.activeTags.slice(1)
                        ).map(
                          (item) => html`<li><a @click="${this.testEditMode}" href="x/tags?display=card&tag=${item.trim()}">${item}</a></li>`
                        )}
                      </ul>
                  ` : ''}
          `}

        ${this.activeLayout == "listing"
          ? this._renderListing()
          : ''}

        <div id="slot"><slot></slot></div>
      </div>

      <footer>
        Generated: ${this.lastUpdated}<br><br>
        © ${this.copyrightYear} ${store.manifest.author}.
        <div
          class="license-body"
          xmlns:cc="${this.licenseLink}"
          xmlns:dc="http://purl.org/dc/elements/1.1/"
        >
          ${this.licenseImage
            ? html`
                <a
                  class="big-license-link"
                  target="_blank"
                  href="${this.licenseLink}"
                  rel="noopener noreferrer"
                >
                  <img
                    loading="lazy"
                    decoding="async"
                    fetchpriority="low"
                    alt="${this.licenseName} graphic"
                    src="${this.licenseImage}"
                  />
                </a>
              ` : ``}
        </div>
        <simple-icon-button-lite icon="image:style" class="theme-picker" @click="${this.toggleSiteTheme}"></simple-icon-button-lite>
        <scroll-button @click="${this.removeFocus}"></scroll-button>
      </footer>
    `;
  }
}

globalThis.customElements.define(CleanPortfolioTheme.tag, CleanPortfolioTheme);