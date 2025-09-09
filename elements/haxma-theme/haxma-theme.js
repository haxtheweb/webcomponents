/**
 * Copyright 2025 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { HAXCMSLitElementTheme } from "@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import "@haxtheweb/haxcms-elements/lib/ui-components/site/site-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu-button.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-breadcrumb.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/site/site-search.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/layout/site-modal.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-top-menu.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu-content.js";
import { HAXCMSThemeParts } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSThemeParts.js";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";

/**
 * `HAXma doc theme`
 * `Inspired by Figma documentation for HAXcms`
 * 
 * @demo index.html
 * @element haxma-theme
 */
export class HaxmaTheme extends HAXCMSThemeParts(DDDSuper(HAXCMSLitElementTheme)) {

  static get tag() {
    return "haxma-theme";
  }

  constructor() {
    super();
    this._items = [];
    this.activeItem = {};
    this.manifest = {};
    this.mobileNavOpen = false;
    this.searchOpen = false;
    this.nextPage = '';
    this.prevPage = '';
    this.__disposer = this.__disposer || [];
    // Set up reactivity to HAXcms store
    autorun((reaction) => {
      this.manifest = toJS(store.manifest);
      this.__disposer.push(reaction);
    });
    
    autorun((reaction) => {
      this.activeItem = toJS(store.activeItem);
      this.__disposer.push(reaction);
    });
    
    autorun((reaction) => {
      this._items = toJS(store.manifest && store.manifest.items ? store.manifest.items : []);
      this.__disposer.push(reaction);
    });
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      _items: { type: Array },
      activeItem: { type: Object },
      manifest: { type: Object },
      mobileNavOpen: { type: Boolean, reflect: true, attribute: 'mobile-nav-open' },
      searchOpen: { type: Boolean, reflect: true, attribute: 'search-open' },
      nextPage: { type: String },
      prevPage: { type: String },
    };
  }

  // Global styles that affect the entire document
  HAXCMSGlobalStyleSheetContent() {
    return [
      ...super.HAXCMSGlobalStyleSheetContent(),
      css`
        :root {
          --haxma-primary: #5551FF;
          --haxma-primary-hover: #4942E6;
          --haxma-text: #545454;
          --haxma-text-dark: #000000;
          --haxma-bg: #FFFFFF;
          --haxma-border: #E5E7EB;
          --haxma-border-light: #F3F4F6;
          --haxma-nav-height: 72px;
        }
        
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
          background-color: var(--haxma-bg);
          color: var(--haxma-text);
          line-height: 1.6;
        }
        
        body.dark-mode {
          background-color: #1a1a1a;
          color: #e5e5e5;
          --haxma-bg: #1a1a1a;
          --haxma-text: #e5e5e5;
          --haxma-text-dark: #ffffff;
          --haxma-border: #404040;
          --haxma-border-light: #2a2a2a;
        }
        
        @media (prefers-color-scheme: dark) {
          body:not(.light-mode) {
            background-color: #1a1a1a;
            color: #e5e5e5;
          }
        }
      `,
    ];
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        min-height: 100vh;
        background-color: var(--haxma-bg);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
        line-height: 1.6;
      }
      
      :host([dark-mode]) {
        background-color: #1a1a1a;
      }
      
      .app-container {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        overflow-x: hidden;
      }
      
      /* Header styles */
      .site-header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 50;
        background-color: var(--haxma-bg);
        border-bottom: 1px solid var(--haxma-border);
        height: var(--haxma-nav-height);
        transition: all 0.2s;
      }
      
      /* Adjust header position when user is logged in */
      :host([is-logged-in]) .site-header {
        top: 56px;
      }
      
      .header-nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 100%;
        padding: 0 1rem;
        max-width: 1400px;
        margin: 0 auto;
        min-width: 0;
      }
      
      @media (min-width: 768px) {
        .header-nav {
          padding: 0 2rem;
        }
      }
      
      .nav-brand {
        display: flex;
        align-items: center;
        text-decoration: none;
        color: var(--haxma-text-dark);
        font-weight: 700;
        font-size: 1.2rem;
        min-width: 0;
        flex-shrink: 1;
        overflow: hidden;
      }
      
      .nav-brand span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      @media (min-width: 768px) {
        .nav-brand {
          font-size: 1.5rem;
        }
      }
      
      .nav-brand:hover {
        color: var(--haxma-primary);
      }
      
      /* Top navigation menu */
      .nav-menu {
        display: none;
        align-items: center;
        gap: 2rem;
      }
      
      @media (min-width: 768px) {
        .nav-menu {
          display: flex;
        }
      }
      
      .nav-menu site-top-menu {
        --site-top-menu-bg: transparent;
        --site-top-menu-link-color: var(--haxma-text);
        --site-top-menu-link-active-color: var(--haxma-primary);
        --site-top-menu-item-active-background-color: transparent;
        --site-top-menu-border-color: transparent;
        --site-top-menu-container-padding: 0;
      }
      
      /* Header controls */
      .header-controls {
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      
      .search-button {
        --site-modal-button-background-color: var(--haxma-border-light);
        --site-modal-button-border: 1px solid var(--haxma-border);
        --site-modal-button-border-radius: 0.5rem;
        --site-modal-button-padding: 0.5rem 1rem;
        --site-modal-button-font-size: 0.875rem;
        --site-modal-button-color: var(--haxma-text);
      }
      
      .search-button:hover {
        --site-modal-button-background-color: var(--haxma-border);
      }
      
      .mobile-menu-btn {
        display: block;
        padding: 0.5rem;
        background: transparent;
        border: none;
        cursor: pointer;
        color: var(--haxma-text);
      }
      
      @media (min-width: 768px) {
        .mobile-menu-btn {
          display: none;
        }
      }
      
      .mobile-menu-btn:hover {
        color: var(--haxma-primary);
      }
      
      /* Mobile overlay */
      .mobile-nav-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 40;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
      }
      
      :host([mobile-nav-open]) .mobile-nav-overlay {
        opacity: 1;
        visibility: visible;
      }
      
      @media (min-width: 768px) {
        .mobile-nav-overlay {
          display: none;
        }
      }
      
      /* Mobile navigation */
      .mobile-nav {
        position: fixed;
        top: var(--haxma-nav-height);
        left: -100%;
        width: 80%;
        max-width: 300px;
        height: calc(100vh - var(--haxma-nav-height));
        background-color: var(--haxma-bg);
        border-right: 1px solid var(--haxma-border);
        transition: left 0.3s ease;
        overflow-y: auto;
        z-index: 45;
        padding: 1rem;
      }
      
      :host([is-logged-in]) .mobile-nav {
        top: calc(var(--haxma-nav-height) + 56px);
        height: calc(100vh - var(--haxma-nav-height) - 56px);
      }
      
      :host([mobile-nav-open]) .mobile-nav {
        left: 0;
      }
      
      @media (min-width: 768px) {
        .mobile-nav {
          display: none;
        }
      }
      
      .mobile-close-btn {
        display: block;
        margin-left: auto;
        padding: 0.5rem;
        background: transparent;
        border: none;
        cursor: pointer;
        color: var(--haxma-text);
        margin-bottom: 1rem;
      }
      
      /* Main content layout */
      .main-content {
        flex: 1;
        display: flex;
        margin-top: var(--haxma-nav-height);
        min-height: calc(100vh - var(--haxma-nav-height));
        min-width: 0;
      }
      
      :host([is-logged-in]) .main-content {
        margin-top: calc(var(--haxma-nav-height) + 56px);
        min-height: calc(100vh - var(--haxma-nav-height) - 56px);
      }
      
      .content-area {
        flex: 1;
        max-width: 1000px;
        padding: 1rem;
        overflow-x: hidden;
        min-width: 400px;
      }
      
      @media (min-width: 768px) {
        .content-area {
          padding: 2rem;
        }
      }
      
      .sidebar-toc {
        width: 280px;
        padding: 2rem 1rem;
        border-left: 1px solid var(--haxma-border);
        background-color: var(--haxma-bg);
        display: none;
        position: relative;
        align-self: flex-start;
      }
      
      @media (min-width: 768px) {
        .sidebar-toc {
          display: block;
        }
      }
      
      .toc-title {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--haxma-text);
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      site-menu {
        display: flex;
      }
      
      site-menu-content {
        --site-menu-content-background-color: transparent;
        --site-menu-content-link-color: var(--haxma-text);
        --site-menu-content-link-active-color: var(--haxma-primary);
        --site-menu-content-border-color: var(--haxma-border);
        font-size: 0.875rem;
        position: sticky;
        max-height: calc(100vh - var(--haxma-nav-height) - 4rem);
        overflow-y: auto;
        background-color: var(--haxma-bg);
        position: fixed;
        top: 20vh;
      }
      
      :host([is-logged-in]) site-menu-content {
        top: calc(20vh + 56px);
        max-height: calc(100vh - var(--haxma-nav-height) - 56px - 4rem);
      }
      
      /* Breadcrumbs */
      .breadcrumb-area {
        margin-bottom: 1rem;
      }
      
      site-breadcrumb {
        --site-breadcrumb-color: var(--haxma-text);
        --site-breadcrumb-active-color: var(--haxma-primary);
        --site-breadcrumb-separator-color: var(--haxma-border);
        font-size: 0.875rem;
      }
      
      /* Article header */
      .article-header {
        margin-bottom: 2rem;
      }
      
      .article-header h1 {
        color: var(--haxma-text-dark);
        font-size: 2.5rem;
        font-weight: 700;
        margin: 1rem 0;
        line-height: 1.2;
      }
      
      @media (max-width: 768px) {
        .article-header h1 {
          font-size: 2rem;
          margin: 0.5rem 0;
        }
      }
      
      /* Article content */
      .article-content {
        color: var(--haxma-text);
        font-size: 1rem;
        line-height: 1.7;
      }
      
      .article-content h2,
      .article-content h3,
      .article-content h4 {
        color: var(--haxma-text-dark);
        margin: 2rem 0 1rem 0;
      }
      
      /* Page navigation */
      .page-navigation {
        display: flex;
        justify-content: space-between;
        margin-top: 3rem;
        padding-top: 2rem;
        border-top: 1px solid var(--haxma-border);
        gap: 1rem;
      }
      
      .nav-item {
        flex: 1;
        max-width: 300px;
      }
      
      .nav-link {
        display: block;
        padding: 1rem;
        text-decoration: none;
        color: var(--haxma-text);
        border: 1px solid var(--haxma-border);
        border-radius: 0.5rem;
        transition: all 0.2s;
      }
      
      .nav-link:hover {
        border-color: var(--haxma-primary);
        background-color: var(--haxma-border-light);
      }
      
      .nav-direction {
        font-size: 0.875rem;
        color: var(--haxma-primary);
        font-weight: 600;
        margin-bottom: 0.25rem;
      }
      
      .nav-title {
        font-weight: 500;
        color: var(--haxma-text-dark);
      }
      
      /* Footer */
      .site-footer {
        background-color: var(--haxma-bg);
        border-top: 1px solid var(--haxma-border);
        padding: 2rem 1rem;
        margin-top: auto;
        overflow-x: hidden;
        z-index: 10;
      }
      
      @media (min-width: 768px) {
        .site-footer {
          padding: 3rem 2rem;
        }
      }
      
      .footer-content {
        max-width: 1400px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr;
        gap: 2rem;
        padding: 0 1rem;
      }
      
      @media (min-width: 768px) {
        .footer-content {
          grid-template-columns: 1fr 3fr;
          padding: 0 2rem;
        }
      }
      
      .footer-brand {
        margin-bottom: 2rem;
      }
      
      @media (min-width: 768px) {
        .footer-brand {
          margin-bottom: 0;
        }
      }
      
      .brand-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--haxma-text-dark);
        margin-bottom: 0.5rem;
      }
      
      .brand-description {
        color: var(--haxma-text);
        font-size: 0.875rem;
      }
      
      .footer-section h4 {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--haxma-text-dark);
        margin-bottom: 1rem;
      }
      
      .footer-links {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      
      .footer-links li {
        margin-bottom: 0.5rem;
      }
      
      .footer-links a {
        color: var(--haxma-text);
        text-decoration: none;
        font-size: 0.875rem;
        transition: color 0.2s;
      }
      
      .footer-links a:hover {
        color: var(--haxma-primary);
      }
      
      .footer-page-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.5rem;
        word-break: break-word;
      }
      
      @media (min-width: 480px) {
        .footer-page-grid {
          grid-template-columns: repeat(3, 1fr);
        }
      }
      
      @media (min-width: 768px) {
        .footer-page-grid {
          grid-template-columns: repeat(4, 1fr);
        }
      }
      
      @media (min-width: 1024px) {
        .footer-page-grid {
          grid-template-columns: repeat(5, 1fr);
        }
      }
      
      .footer-page-link {
        color: var(--haxma-text);
        text-decoration: none;
        font-size: 0.875rem;
        transition: color 0.2s;
        padding: 0.25rem 0;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .footer-page-link:hover {
        color: var(--haxma-primary);
      }
      
      /* HAX button styling for better visibility when logged in */
      :host([is-logged-in]) haxcms-button-add,
      :host([is-logged-in]) simple-icon-button[part="edit-mode-active"] {
        --simple-icon-button-color: var(--haxma-primary);
        --simple-icon-button-background-color: var(--haxma-border-light);
        --simple-icon-button-border-color: var(--haxma-border);
      }
      
      :host([is-logged-in]) haxcms-button-add:hover,
      :host([is-logged-in]) simple-icon-button[part="edit-mode-active"]:hover {
        --simple-icon-button-color: var(--haxma-bg);
        --simple-icon-button-background-color: var(--haxma-primary);
      }
    `];
  }

  // Helper methods for navigation and search
  toggleMobileNav() {
    this.mobileNavOpen = !this.mobileNavOpen;
  }
  
  closeMobileNav() {
    this.mobileNavOpen = false;
  }
  
  toggleSearch() {
    this.searchOpen = !this.searchOpen;
  }
  
  toggleDarkMode() {
    store.darkMode = !store.darkMode;
  }
  
  __prevPageLabelChanged(e) {
    this.prevPage = e.detail.value;
  }
  
  __nextPageLabelChanged(e) {
    this.nextPage = e.detail.value;
  }

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this.HAXCMSThemeSettings.themeTop =
    this.shadowRoot.querySelector(".main-content");
    this.HAXCMSThemeSettings.scrollTarget =
    this.shadowRoot.querySelector(".main-content");
  }
  // Lit render the HTML
  render() {
    const manifest = this.manifest || {};
    const metadata = manifest.metadata || {};
    const site = metadata.site || {};
    const activeItem = this.activeItem || {};
    
    return html`
      <div class="app-container">
        <!-- Mobile nav overlay -->
        <div class="mobile-nav-overlay" @click="${this.closeMobileNav}"></div>
        
        <!-- Fixed Header -->
        <header class="site-header">
          <nav class="header-nav">
            <!-- Brand/Logo -->
            <a href="" class="nav-brand">
              <span>${site.name || 'HAXma'}</span>
            </a>
            
            <!-- Desktop Navigation Menu -->
            <div class="nav-menu">
              <site-top-menu></site-top-menu>
            </div>
            
            <!-- Header Controls -->
            <div class="header-controls">
              <!-- Search -->
              <site-modal 
                title="Search" 
                @click="${this.toggleSearch}" 
                button-label="Search"
                icon="search"
                position="bottom"
                class="search-button">
                <site-search></site-search>
              </site-modal>
              
              <!-- Mobile Menu Button -->
              <button 
                class="mobile-menu-btn" 
                @click="${this.toggleMobileNav}"
                aria-label="Toggle navigation">
                <svg fill="none" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </nav>
        </header>
        
        <!-- Mobile Navigation -->
        <nav class="mobile-nav">
          <button 
            class="mobile-close-btn" 
            @click="${this.closeMobileNav}"
            aria-label="Close navigation">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <site-menu></site-menu>
        </nav>
        
        <!-- Main Content -->
        <div class="main-content">
          <main class="content-area">
            <!-- Breadcrumbs -->
            <div class="breadcrumb-area">
              <site-breadcrumb></site-breadcrumb>
            </div>
            
            <!-- Article Header -->
            <div class="article-header">
              <site-active-title></site-active-title>
            </div>
            
            <!-- Article Content -->
            <div class="article-content">
              <!-- Required HAXcms content container -->
              <div id="contentcontainer">
                <div id="slot">
                  <slot></slot>
                </div>
              </div>
            </div>
            
            <!-- Page Navigation -->
            <nav class="page-navigation">
              <div class="nav-item">
                <site-menu-button 
                  type="prev" 
                  position="top" 
                  class="nav-link"
                  @label-changed="${this.__prevPageLabelChanged}">
                  ${this.prevPage ? html`
                    <div class="nav-direction">← Previous</div>
                    <div class="nav-title">${this.prevPage}</div>
                  ` : ''}
                </site-menu-button>
              </div>
              
              <div class="nav-item">
                <site-menu-button 
                  type="next" 
                  position="top" 
                  class="nav-link"
                  @label-changed="${this.__nextPageLabelChanged}">
                  ${this.nextPage ? html`
                    <div class="nav-direction">Next →</div>
                    <div class="nav-title">${this.nextPage}</div>
                  ` : ''}
                </site-menu-button>
              </div>
            </nav>
          </main>
          
          <!-- Table of Contents Sidebar -->
          <aside class="sidebar-toc">
            <div class="toc-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
              In this article
            </div>
            <site-menu-content></site-menu-content>
          </aside>
        </div>
        
        <!-- Footer -->
        <footer class="site-footer">
          <div class="footer-content">
            <!-- Brand Section -->
            <div class="footer-brand">
              <div class="brand-title">${site.name || 'HAXma'}</div>
              <div class="brand-description">
                ${manifest.description || 'Empowering web creation through HAX'}
              </div>
            </div>
            
            <!-- Generated Site Links -->
            <div class="footer-section">
              <h4>Site Navigation</h4>
              <div class="footer-page-grid">
                ${this._items.map((item) => html`
                  <a href="${item.slug}" class="footer-page-link">
                    ${item.title}
                  </a>
                `)}
              </div>
            </div>
          </div>
        </footer>
      </div>
    `;
  }

  // Cleanup method to dispose of MobX reactions
  disconnectedCallback() {
    if (this.__disposer) {
      this.__disposer.forEach((disposer) => {
        if (typeof disposer === 'function') {
          disposer();
        }
      });
      this.__disposer = [];
    }
    super.disconnectedCallback();
  }
}

globalThis.customElements.define(HaxmaTheme.tag, HaxmaTheme);
