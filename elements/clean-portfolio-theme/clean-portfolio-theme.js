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
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { DDDVariables } from "@haxtheweb/d-d-d/lib/DDDStyles.js";
import { DDDAllStyles } from "@haxtheweb/d-d-d/lib/DDDStyles.js";
import { licenseList } from "@haxtheweb/license-element/license-element.js";
import { UserScaffoldInstance } from "@haxtheweb/user-scaffold/user-scaffold.js";

/**
 * `Clean Portfolio Theme`
 * A theme for creating clean and modern portfolio websites.
 * @demo index.html
 * @element clean-portfolio-theme
 */

const PortfolioFonts = [
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap"
];

function getPostLogo(item) {
  // Check if item has a logo, otherwise use the image from metadata
  if (item.metadata.image) {
    return item.metadata.image;
  } else if (store.manifest.metadata.theme.variables.image) {
    return toJS(store.manifest.metadata.theme.variables.image);
  } else {
    // Fallback to the site's default image
    return toJS(store.manifest.metadata.site.logo);
  }
}

export class CleanPortfolioTheme extends DDDSuper(HAXCMSLitElementTheme) {

  static get tag() {
    return "clean-portfolio-theme";
  }

  constructor() {
    super();
    this.dataPalette = UserScaffoldInstance.readMemory("HAXCMSSitePalette") || "";

    this.selectedTag = "";
    this.activeLayout = "text"; // text, media, listing
    // mobile menu
    this.menuOpen = false;
    this.menuOverflow = [];
    // footer info
    this.lastUpdated = "";
    this.copyrightYear = 0;
    // support for custom rendering of route html
    this.HAXSiteCustomRenderRoutes = {
      "x/tags": {
        "items": this.HAXSiteRenderXTagsItems,
      }
    };
    this.HAXCMSThemeSettings.autoScroll = true;
    // MobX variables/listeners
    this.categoryTags = [];
    this.allTags = [];
    this.items = [];
    this.__disposer = this.__disposer || [];

    // gets site title and home link for site-title
    autorun((reaction) => {
      this.homeLink = toJS(store.homeLink);
      this.__disposer.push(reaction);
    });

    autorun((reaction) => {
      this.siteTitle = toJS(store.siteTitle);
      this.__disposer.push(reaction);
    });

    // gets active page's ancestor for menu-item:after
    autorun((reaction) => {
      this.ancestorItem = toJS(store.ancestorItem);
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
      const active = toJS(store.activeItem);
      if (active) {
        // find parent of activeItem
        let parent = store.manifest.items.find(
          (d) => active.parent === d.id,
        );

        if (parent) {
          const activeTags = active.metadata.tags && active.metadata.tags.split(",").map(tag => tag.trim());
          const category = (activeTags && activeTags[0]) || null;
          const siblings = store.manifest.items
            .filter((item) => {
              const itemTags = item.metadata && item.metadata.tags && item.metadata.tags.split(",").map(tag => tag.trim());
              const itemCategory = (itemTags && itemTags[0]) || null;
              return (
                item.parent === active.parent &&
                itemCategory === category
              );
            });

          const i = siblings.findIndex((item) => item.id === active.id);
          this.prevSibling = siblings[i - 1] || null;
          this.nextSibling = siblings[i + 1] || null;
        } else {
          parent = "";
        }

        if (this.menuOpen) {
          this.menuOpen = false;
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

            const categoryTags = [];
            const allTags = [];

            // get tags for all children of activeItem, push to arrays
            items.forEach(item => {
              let tags = toJS(item.metadata.tags);
              if (tags) {
                const tagArray = tags.split(',');
                if (tagArray[0] && !categoryTags.includes(tagArray[0])) {
                  categoryTags.push(tagArray[0]);
                }
                tagArray.forEach(tag => {
                  if (tag && !allTags.includes(tag)) {
                    allTags.push(tag);
                  }
                });
              }
            });

            if (globalThis.document && globalThis.document.startViewTransition) {
              globalThis.document.startViewTransition(() => {
                this.items = [...items];
                this.categoryTags = [...categoryTags];
                this.allTags = [...allTags];
              });
            }
            else {
              this.items = [...items];
              this.categoryTags = [...categoryTags];
              this.allTags = [...allTags];         
            }

            // reset tag select filter
            this.selectedTag = "";
            if (this.shadowRoot) {
              let select = this.shadowRoot.querySelector('#listing-filter');
              if (select) {
                select.value = ""
              }
            }
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
        const el = this.shadowRoot.querySelector("#slot") || globalThis.document.querySelector("#slot");
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      this.__disposer.push(reaction);
    });

    // gets licensing stuff
    autorun((reaction) => {
      this.manifest = toJS(store.manifest);
      let LList = new licenseList();
      if (this.manifest.license && LList[this.manifest.license]) {
        this.licenseName = LList[this.manifest.license].name;
        this.licenseLink = LList[this.manifest.license].link;
        this.licenseImage = LList[this.manifest.license].image;
      }
      this.__disposer.push(reaction);
    });

    // gets current and total page count
    autorun((reaction) => {
      const counter = toJS(store.pageCounter);
      this.pageCurrent = counter.current;
      this.pageTotal = counter.total;
      this.__disposer.push(reaction);
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
    requestAnimationFrame(() => this._checkOverflow());
  }

    updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has("dataPalette")) {
      UserScaffoldInstance.writeMemory(
        "HAXCMSSitePalette",
        this.dataPalette,
        "long",
      );
    }
  }

  // manages window resize observer
  disconnectedCallback() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }
    if (this.__disposer) {
      for (var i in this.__disposer) {
        this.__disposer[i].dispose();
      }
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
      dataPalette: { type: Number, reflect: true, attribute: "data-palette" },
      activeItem: { type: Object },
      activeParent: { type: Object },
      ancestorItem: { type: Object },
      prevSibling: { type: Object },
      nextSibling: { type: Object },
      topItems: { type: Array },
      items: { type: Array },
      activeTags: { type: Array },
      categoryTags: { type: Array },
      allTags: { type: Array },
      menuOverflow: { type: Array },
      menuOpen: { type: Boolean },
      copyrightYear: { type: Number },
      pageCurrent: { type: Number },
      pageTotal: { type: Number },
      siteTitle: { type: String },
      homeLink: { type: String },
      activeLayout: { type: String },
      selectedTag: { type: String },
      lastUpdated: { type: String },
      licenseName: { type: String },
      licenseLink: { type: String },
      licenseImage: { type: String },
    };
  }

  HAXCMSGlobalStyleSheetContent() {
      return [
        ...super.HAXCMSGlobalStyleSheetContent(),
        DDDAllStyles,
        css`
        :root, html, body {
          --ddd-palette-light: #FFFFFF;
          --ddd-palette-dark: #000000;

          --ddd-palette-1: var(--ddd-palette-color-1, default);
          --ddd-palette-2: var(--ddd-palette-color-2, default);
          --ddd-palette-3: var(--ddd-palette-color-3, default);
          --ddd-palette-4: var(--ddd-palette-color-4, default);
          --ddd-palette-5: var(--ddd-palette-color-5, default);
          --ddd-palette-6: var(--ddd-palette-color-6, default);
          --ddd-palette-7: var(--ddd-palette-color-7, default);

          --ddd-lightDark-background: light-dark(var(--ddd-palette-light), var(--ddd-palette-dark));
          --ddd-lightDark-text: light-dark(var(--ddd-palette-dark), var(--ddd-palette-light));
          --ddd-lightDark-1: light-dark(var(--ddd-palette-1), var(--ddd-palette-5));
          --ddd-lightDark-2: light-dark(var(--ddd-palette-2), var(--ddd-palette-2));
          --ddd-lightDark-3: light-dark(var(--ddd-palette-3), var(--ddd-palette-3));
          --ddd-lightDark-4: light-dark(var(--ddd-palette-4), var(--ddd-palette-2));
          --ddd-lightDark-5: light-dark(var(--ddd-palette-5), var(--ddd-palette-1));
          --ddd-lightDark-6: light-dark(var(--ddd-palette-6), var(--ddd-palette-6));
          --ddd-lightDark-7: light-dark(var(--ddd-palette-7), var(--ddd-palette-7));

            /* site font variables */
            --portfolio-font-body: "Source Code Pro", system-ui, Monaco, Consolas, "Lucida Console", monospace;
            --portfolio-font-header: "Work Sans", system-ui, -apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", "Helvetica Neue", "Lucida Grande", Arial, sans-serif;

            --portfolio-fontsize-responsive: clamp(16px, 2vw, 22px);

            font-family: var(--portfolio-font-body);
            font-size: var(--portfolio-fontsize-responsive);
            color-scheme: light dark;
            scroll-behavior: smooth;
        }
        

        clean-portfolio-theme a,
        clean-portfolio-theme a:any-link,
        clean-portfolio-theme a:webkit-any-link {
          color: red !important;
        } // currently not functional/is not overriding DDDstyles 
            
        site-tags-route::part(simple-tag) {
          border-color: var(--ddd-palette-light);
        }

        site-tags-route::part(simple-tag):hover,
        site-tags-route::part(simple-tag):focus {
          color: var(--ddd-lightDark-1);
          border-color: var(--ddd-palette-light);
          font-family: var(--portfolio-font-header);
        }

        site-tags-route::part(listing-grid) {
          display: grid;
          gap: 24px;
          width: 100%;
          view-transition-name: location;
          grid-template-columns: repeat(4, 1fr);
        }
        
        site-tags-route::part(listing-card) {
          width: 188px;
          margin-bottom: 48px;
          text-decoration: none;
          transition: .4s;
        }

        site-tags-route::part(listing-cardimg) {
          background-color: var(--ddd-palette-light);
          border-radius: 6px;
          margin-bottom: 12px;
          height: 120px;
          transition: all 0.2s ease-in-out;
          overflow: hidden;
          display: block;
        }

        site-tags-route::part(listing-cardimg-img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        site-tags-route::part(listing-cardtitle) {
          text-decoration: underline;
          text-decoration-thickness: 4px !important;
          text-underline-offset: 8px;
          font-family: var(--portfolio-font-header);
          font-weight: 400;
          line-height: 1.7;
          font-size: clamp(15px, 2vw, 21px);
          text-transform: uppercase;
          margin-bottom: 5.5px;
          transition: color, text-decoration-color .3s ease-in-out;
        }

        site-tags-route::part(listing-cardtag) {
          font-family: var(--portfolio-font-body); 
          font-size: clamp(10px, 2vw, 16px);
          font-weight: 400;
          transition: .3s;
        }

      site-tags-route::part(listing-cardtitle):hover,
      site-tags-route::part(listing-cardtitle):focus {
        text-decoration-color: var(--ddd-lightDark-1);
      }

      site-tags-route::part(listing-cardimg):hover,
      site-tags-route::part(listing-cardimg):focus {
        box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 10px 0px;
      }
`
    ];
  }

  // Lit scoped styles
  static get styles() {
    return [
      DDDAllStyles,
      super.styles,
    css`
      /* Semantic elements */

      :host {
         --ddd-palette-light: #FFFFFF;
        --ddd-palette-dark: var(--ddd-theme-default-coalyGray);

          --ddd-palette-1: var(--ddd-palette-color-1, default);
          --ddd-palette-2: var(--ddd-palette-color-2, default);
          --ddd-palette-3: var(--ddd-palette-color-3, default);
          --ddd-palette-4: var(--ddd-palette-color-4, default);
          --ddd-palette-5: var(--ddd-palette-color-5, default);
          --ddd-palette-6: var(--ddd-palette-color-6, default);
          --ddd-palette-7: var(--ddd-palette-color-7, default);

          --ddd-lightDark-background: light-dark(var(--ddd-palette-light), var(--ddd-palette-dark));
          --ddd-lightDark-text: light-dark(var(--ddd-palette-dark), var(--ddd-palette-light));
          --ddd-lightDark-1: light-dark(var(--ddd-palette-1), var(--ddd-palette-5));
          --ddd-lightDark-2: light-dark(var(--ddd-palette-2), var(--ddd-palette-4));
          --ddd-lightDark-3: light-dark(var(--ddd-palette-3), var(--ddd-palette-3));
          --ddd-lightDark-4: light-dark(var(--ddd-palette-4), var(--ddd-palette-2));
          --ddd-lightDark-5: light-dark(var(--ddd-palette-5), var(--ddd-palette-1));
          --ddd-lightDark-6: light-dark(var(--ddd-palette-6), var(--ddd-palette-6));
          --ddd-lightDark-7: light-dark(var(--ddd-palette-7), var(--ddd-palette-7));

        display: block;
        background-color: var(--ddd-lightDark-background);
        transition: background-color .3s ease-in-out;
      }

      /* Palette variables */

      :host([data-palette="6"]) header{
        background-color: var(--ddd-palette-4);
      }

      :host([data-palette="6"])  button,
      :host([data-palette="6"]) .pagination a{
        background-color: var(--ddd-palette-3); 
      }

      :host([data-palette="6"]) .listing-cardtitle{
        text-decoration-color: var(--ddd-palette-4);
        color: var(--ddd-lightDark-4);
      }

      :host([data-palette="6"]) .breadcrumb-parent {
        color: var(--ddd-lightDark-4);
      }

      :host([data-palette="6"]) #site-title:hover {
        color: var(--ddd-lightDark-3);
      }
/* 
      ::slotted(a) {
        color: var(--ddd-lightDark-7) !important;
      }
 */
      html, body {
        height: 100%;
        background-color: var(--ddd-lightDark-background);
      }

      header {
        background-color: var(--ddd-palette-2);
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

      a {
        color: var(--ddd-lightDark-5);
        transition: color .3s;
      }

      h1, h2, h3, h4, h5, h6 {
        color: var(--ddd-lightDark-text);
        line-height: 1.2;
        font-weight: 700;
        margin-bottom: 0.75rem;
        margin-top: 0;
      }
      
      p {
        color: var(--ddd-lightDark-text);
        font-size: var(--portfolio-fontsize-responsive);
        line-height: 1.5;
        margin-bottom: 1.3em;
      }

      ul {
        color: var(--ddd-lightDark-text);
        list-style-type: disc;
      }

      li {
        font-family: var(--portfolio-font-body);
      }

      li::marker {
        color: var(--ddd-lightDark-3) !important;
      }

      footer {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        background-color: var(--ddd-lightDark-1);
        color: var(--ddd-lightDark-5);
        font-family: var(--portfolio-font-body);
        font-size: clamp(11px, 2vw, 15px);
        padding: 40px 5vw;
        margin-top: 96px;
        transition: .3s;
      }

      .footer-link {
        color: var(--ddd-lightDark-1) !important;
        transition: color .3s;
      }

      .page-counter {
        font-family: var(--portfolio-font-body);
        font-size: 0.9rem;
        color: var(--ddd-lightDark-1);
        margin: 0 0 1rem;
      }

      :focus {
        outline-offset: 8px;
      }

      /* Site header elements */
      #site-title {
        padding: 0.5rem;
        color: var(--ddd-palette-light);
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
        color: var(--ddd-lightDark-5);
      }

      header a.menu-item {
        display: inline-block;
        position: relative;
        margin: 10px;
        padding: 0 5px;
        white-space: nowrap;
        color: var(--ddd-palette-light);
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
        height: clamp(0.1em, 5vw, 0.2em);
        background-color: var(--ddd-palette-5);
        transform: translateX(-50%);
        transition: all 0.2s ease-in-out;
      }

      .menu-item:hover,
      .menu-item:focus,
      .menu-item.active {
        color: var(--ddd-palette-5);
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
          background-color: var(--ddd-palette-1);
          border: 0;
          width: 4em;
          height: 4em;
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
        top: calc(100% + 12px);
        right: 0;
        padding: 5px;
        gap: 0;
        border-radius: 4px;
        box-shadow: 0 2px 4px 0 rgba(#000, 0.16), 0 2px 10px 0 rgba(#000, 0.12);
        background-color: var(--ddd-palette-4);
        z-index: 5;
        transition: .3s;
      }

      .hidden-links:before {
        content: "";
        position: absolute;
        top: -8px;
        right: 12px;
        border-style: solid;
        border-width: 0 10px 10px;
        border-color: var(--ddd-lightDark-4) transparent;
        transition: .3s;
      }

      .hidden-links li {
        display: block;
        border-bottom: 1px solid var(--ddd-lightDark-background);
        padding: 10px;
      }

      .hidden-links li:last-child {
        border-bottom: none;
      }

      .hidden-links a {
        color: var(--ddd-palette-1);
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
        color: var(--ddd-palette-light);
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
        padding: 8px;
        background-color: var(--ddd-lightDark-3);
        z-index: 4;
        color: var(--ddd-lightDark-1);
        transition: color .3s, border .3s;
      }

      header .theme-picker {
        position: absolute;
        top: 8px;
        right: 6px;
      }

      /* Tags */
      .tag-list {
        flex-direction: row;
        flex-wrap: wrap;
        list-style-type: none;
        margin: 0 0 20px 0;
        padding: 0;
        border-top: 3px solid var(--ddd-palette-light);
        border-bottom: 1px solid var(--ddd-palette-light);
      }

      .tag-list li {
        margin: 0 10px 0 0;
        padding-top: 5px;
        padding-bottom: 5px;
      }

      .tag-list li a {
        color: var(--ddd-palette-light);
        font-weight: 400;
        font-size: clamp(20px, 3vw, 27.5px);
        text-transform: uppercase;
      }

      /* Breadcrumb */
      .breadcrumb {
        display: flex;
        margin: 0 auto;
        margin-top: 4px;
        padding: 0 22px;
        height: clamp(40px, 5vw, 60px);
        max-width: 1236px;
        align-items: center;
        gap: 10px;
        color: var(--ddd-lightDark-3);
        font-family: var(--portfolio-font-header);
        font-size: clamp(14px, 2vw, 18px);
        view-transition-name: location;
      }

      .breadcrumb a {
        color: var(--ddd-lightDark-3);
        text-decoration: none;
        border-bottom: 2px solid var(--ddd-lightDark-4);
        font-weight: 450;
        transition: .3s ease-in-out;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding-bottom: 4px;
      }

      .breadcrumb-arrow {
        color: var(--ddd-lightDark-4);
        transition: color .3s ease-in-out;
        padding-bottom: 4px;
      }

      .breadcrumb-parent {
        color: var(--ddd-lightDark-1);
        transition: color .3s ease-in-out;
        padding-bottom: 4px;
      }

      .breadcrumb-split {
        color: var(--ddd-lightDark-3);
        transition: color .3s ease-in-out;
        padding-bottom: 4px;
      }

      .breadcrumb-title {
        font-weight: bold;
        transition: color .3s ease-in-out;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-bottom: 4px;
      }

      .breadcrumb a:hover,
      .breadcrumb a:focus {
        border-bottom: 2px solid var(--ddd-lightDark-1);
      }
      
      /* Layouts */
      .container {
        margin: 64px auto;
        width: 90%;
        max-width: 840px;
        text-align: left;
        view-transition-name: location;
      }

      #contentcontainer {
        min-height: 50vh;
      } 

      #slot {
        min-height: 0vh;
      }

      .listing-titlecontainer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 12px;
        margin-bottom: 20px;
        view-transition-name: location;
      }

      #listing-filter {
        font-size: 1rem;
        padding: 0.5em;
        max-width: 240px;
        width: 100%;
      }

      .list-filter-label {
        font-size: 14px;
        margin-right: 54px;
      }

      .listing-category {
        font-family: var(--portfolio-font-body);
        font-size: var(--portfolio-fontsize-responsive);
        text-transform: uppercase;
        border-top: 6px solid var(--ddd-lightDark-4);
        min-height: 36px;
        transition: color .3s;
      }

      .listing-category a {
        color: var(--ddd-lightDark-3);
      }

      .listing-grid {
        display: grid;
        gap: 24px;
        width: 100%;
        view-transition-name: location;
        grid-template-columns: repeat(4, 1fr);
      }

      div .listing-card {
        width: 188px;
        margin-bottom: 48px;
        text-decoration: none;
        transition: .4s;
      }

      .listing-cardimg {
        background-color: var(--ddd-lightDark-1);
        border-radius: 6px;
        margin-bottom: 12px;
        height: 120px;
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
        color: var(--ddd-lightDark-2);
        text-decoration: underline;
        text-decoration-color: var(--ddd-lightDark-5);
        text-decoration-thickness: 4px !important;
        text-underline-offset: 8px;
        font-family: var(--portfolio-font-header);
        font-weight: 400;
        line-height: 1.7;
        font-size: clamp(15px, 2vw, 21px);
        text-transform: uppercase;
        margin-bottom: 5.5px;
        transition: color, text-decoration-color .3s ease-in-out;
      }

      .listing-cardtag {
        color: var(--ddd-palette-light);
        font-family: var(--portfolio-font-body);
        font-size: clamp(10px, 2vw, 16px);
        font-weight: 400;
        transition: .3s;
      }

      .listing-card:hover .listing-cardtitle,
      .listing-card:focus .listing-cardtitle{
        text-decoration-color: var(--ddd-lightDark-3);
      }

      .listing-card:hover .listing-cardimg,
      .listing-card:focus .listing-cardimg {
        box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 10px 0px;
      }

      /* Pagination */
      .pagination {
        max-width: 840px;
        margin: 0 auto;
        padding: 0 22px;
        display: flex;
        gap: 24px;
        flex-direction: row;
        align-items: center;
        view-transition-name: location;
      }
      .pagination a {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        overflow: hidden;
        width: 400px;
        height: clamp(48px, 8vw, 96px);
        border-radius: 8px;
        background-color: var(--ddd-lightDark-2);
        text-decoration: underline;
        text-decoration-color: var(--ddd-lightDark-1);
        text-decoration-thickness: 4px;
        text-underline-offset: 8px;
        line-height: 1.8;
        font-family: var(--portfolio-font-header);
        font-weight: 400;
        transition: background-color .3s, text-decoration-color .3s, box-shadow .3s;
      }
      .pagination-text {
        display: -webkit-box;
        color: var(--ddd-palette-light);
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
      }
      .pagination a simple-icon-lite {
        color: var(--ddd-palette-light);
        --simple-icon-width: clamp(24px, 4vw, 40px);
        --simple-icon-height: clamp(24px, 4vw, 40px);
      }
      .pagination a:hover,
      .pagination a:focus {
        text-decoration-color: var(--ddd-lightDark-3);
        box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 10px 0px;
      }
      .pagination a.prev {
        margin-left: 24px;
        margin-right: auto;
        padding-right: 12px;
        justify-content: flex-start;
      }
      .pagination a.next {
        margin-right: 24px;
        margin-left: auto;
        padding-left: 12px;
        justify-content: flex-end;
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
        .pagination {
          flex-direction: column;
          gap: 16px;
        }
        .pagination-text {
          -webkit-line-clamp: 1;
          overflow: hidden;
          padding: 4px 0;
          line-height: 2;
        }
        .pagination a.prev,
        .pagination a.next {
          margin-left: 0;
          margin-right: 0;
          width: 100%;
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
          font-size: clamp(56px, 12vw, 64px);
        }
      }
    `];
  }

  // prevents page changes during edit mode (from site-active-tags.js)
  testEditMode(e) {
    if (this.editMode) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
    else {
      e.currentTarget.blur();
    }
  }

  _renderListing() {
    // Filter content based on selected tag, if there is one
    const filteredItems = this.selectedTag
      ? this.items.filter(item => {
          // Check if item has tags, and return it if it has the tag
          let tags = toJS(item.metadata.tags);
          if (tags) {
            return tags.includes(this.selectedTag);
          }
          return false;
        })
      : this.items;

    // Filter category tags based on selected tag
    const filteredTags = this.selectedTag
      ? this.categoryTags.filter(tag => 
          filteredItems.some(item => {
            // Will return true if at least one category has the selected tag
            let tags = toJS(item.metadata.tags);
            if (tags) {
              return tags.includes(tag);
            }
            return false;
          })
        )
      : this.categoryTags;

    return html`
      <!-- Render cards based on filtered tags -->
      ${filteredTags.length > 0
        ? filteredTags.map(
            (topTag) => html`
              <h2 class="listing-category"><a tabindex="${this.editMode ? '-1' : '0'}" ?disabled="${this.editMode}" @click="${this.testEditMode}" href="x/tags?tag=${topTag.trim()}">${topTag}</a></h2>
              <div class="listing-grid">
                ${filteredItems.filter(item => {
                  let tags = toJS(item.metadata.tags);
                  if (tags) {
                    // Return all items with the filtered tag
                    return tags.includes(topTag);
                  }
                  return false;
                }).map(item => {
                  // Get all tags from the item
                  let secondTag = toJS(item.metadata.tags).split(',')[1];

                  return html`
                    <a tabindex="${this.editMode ? '-1' : '0'}" ?disabled="${this.editMode}" class="listing-card" href="${item.slug}" @click="${this.testEditMode}">
                      <div class="listing-cardimg">
                        <img src="${getPostLogo(item)}" onerror="this.style.display='none'" alt="" loading="lazy"
                            decoding="async"
                            fetchpriority="low" />
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
        // Will return true if at least one item does not have tags
        return !toJS(item.metadata.tags);
      })) ? html`
        <div class="listing-category"></div>
        <div class="listing-grid">
          ${this.items.filter(item => {
            // Return all items with no tags
            return !toJS(item.metadata.tags);
          }).map(item => html`
            <a class="listing-card" href="${item.slug}" tabindex="${this.editMode ? '-1' : '0'}" ?disabled="${this.editMode}" @click="${this.testEditMode}">
              <div class="listing-cardimg">
                <img src="${getPostLogo(item)}" onerror="this.style.display='none'" alt="" loading="lazy"
                    decoding="async"
                    fetchpriority="low" />
              </div>
              <div class="listing-cardtitle">${item.title}</div>
            </a>
          `)}
        </div>
      ` : ''}
    `;
  }

  // custom rendering of the x/tags route
  // node is site-tags-route reference
  HAXSiteRenderXTagsItems(items) {
    return html`
    <div part="listing-grid">
      ${items.map(item => html`
        <a class="listing-card" href="${item.slug}" part="listing-card">
          <div class="listing-cardimg" part="listing-cardimg">
            <img src="${item.metadata.image}" onerror="this.style.display='none'" part="listing-cardimg-img">
          </div>
          <div class="listing-cardtitle" part="listing-cardtitle">${item.title}</div>
        </a>`
      )}
    </div>`;
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

  togglePalette(e) {
    this.dataPalette++;
    if (this.dataPalette > 6) this.dataPalette = 0;
    
  }


  // Lit render the HTML
  render() {
    return html`
      <header>
        <div class="header-inner">
          <a tabindex="${this.editMode ? '-1' : '0'}" ?disabled="${this.editMode}" id="site-title" @click="${this.testEditMode}" href="${this.homeLink}">${this.siteTitle}</a>
          <nav>
            ${this.topItems.map(
                (item) => html`
                  <a
                    tabindex="${this.editMode ? '-1' : '0'}"
                    ?disabled="${this.editMode}"
                    @click="${this.testEditMode}"
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
                <button type="button" class=${this.menuOpen ? 'close' : ''} @click="${() => this.menuOpen = !this.menuOpen}">
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
                        tabindex="${this.editMode ? '-1' : '0'}"
                        ?disabled="${this.editMode}"
                        @click="${this.testEditMode}"
                      >
                        ${item.title}
                      </a>
                    </li>`
                  )}
                </ul>
              </div>
            ` : ''}
        </div>
        ${this.menuOverflow.length == 0
            ? html`
              <simple-icon-button-lite title="Change theme" label="Change theme" icon="image:style" class="theme-picker" @click="${this.togglePalette}"></simple-icon-button-lite>
            ` : ''}
      </header>
      
      <div class="breadcrumb">
        ${this.activeParent
          ? html`
            <a tabindex="${this.editMode ? '-1' : '0'}" ?disabled="${this.editMode}" href=${this.activeParent.slug} @click="${this.testEditMode}">
              <span class="breadcrumb-arrow">←</span>
              <span class="breadcrumb-parent">${this.activeParent.title}</span>
            </a>
            <span class="breadcrumb-split">/</span>
            <span class="breadcrumb-title">${this.activeItem.title}</span>
          ` : ``}
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
                ${(this.categoryTags.length > 1 || (this.categoryTags.length > 0 && this.items.some(item => !item.metadata.tags)))
                  ? html`
                    <label class="list-filter-label" for="listing-filter">Tag filter:</label>
                    <select ?disabled="${this.editMode}" id="listing-filter" @change=${(e) => this.selectedTag = e.target.value}>
                      <option value="" ?selected="${this.selectedTag === ''}">All</option>
                      ${this.categoryTags.map(
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
                          (item) => html`<li><a tabindex="${this.editMode ? '-1' : '0'}" @click="${this.testEditMode}" ?disabled="${this.editMode}" href="x/tags?tag=${item.trim()}">${item}</a></li>`
                        )}
                      </ul>
                  ` : ''}
          `}

        ${this.activeLayout == "listing"
          ? this._renderListing()
          : ''}

        <div id="slot"><slot></slot></div>
      </div>

      <div class="pagination">
        ${this.activeParent
        ? html`
          ${this.prevSibling
          ? html`
            <a
              class="prev"
              tabindex="${this.editMode ? '-1' : '0'}"
              ?disabled="${this.editMode}"
              href="${this.prevSibling.slug}"
              @click="${this.testEditMode}"
            >
              <simple-icon-lite icon="icons:chevron-left"></simple-icon-lite>
              <span class="pagination-text">${this.prevSibling.title}</span>
            </a>
          ` : ""}
          ${this.nextSibling
          ? html`
            <a
              tabindex="${this.editMode ? '-1' : '0'}"
              ?disabled="${this.editMode}"
              class="next"
              href="${this.nextSibling.slug}"
              @click="${this.testEditMode}"
            >
              <span class="pagination-text">${this.nextSibling.title}</span>
              <simple-icon-lite icon="icons:chevron-right"></simple-icon-lite>
            </a>
          ` : ""}
        ` : ''}
      </div>

      <footer>
        <div> 
          <div>Page number: ${this.pageCurrent} of ${this.pageTotal}</div>
          <div>Site generated: ${this.lastUpdated}</div>
          <div>Copyright: ${this.copyrightYear} ${store.manifest.author}</div>
          <div><a class="footer-link" @click="${this.testEditMode}" tabindex="${this.editMode ? '-1' : '0'}" href="x/tags" ?disabled="${this.editMode}">View Content by Tag</a></div>
        </div>
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
        <simple-icon-button-lite icon="image:style" title="Change theme" label="Change theme" class="theme-picker" @click="${this.togglePalette}"></simple-icon-button-lite>
        <scroll-button @click="${(e) => e.currentTarget.blur()}"></scroll-button>
      </footer>
    `;
  }
  
}

globalThis.customElements.define(CleanPortfolioTheme.tag, CleanPortfolioTheme);