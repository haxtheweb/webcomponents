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
import { HAXCMSThemeParts } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSThemeParts.js";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";

/**
 * `spacebook-theme`
 * `SpaceBook theme inspired by 11ty SpaceBook theme for HAXcms`
 * 
 * @demo index.html
 * @element spacebook-theme
 */
export class SpacebookTheme extends HAXCMSThemeParts(DDDSuper(HAXCMSLitElementTheme)) {

  static get tag() {
    return "spacebook-theme";
  }

  constructor() {
    super();
    this._items = [];
    this.activeItem = {};
    this.manifest = {};
    this.mobileNavOpen = false;
    this.searchOpen = false;
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
      this._items = toJS(store.manifest?.items || []);
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
    };
  }

  // Global styles that affect the entire document
  HAXCMSGlobalStyleSheetContent() {
    return [
      ...super.HAXCMSGlobalStyleSheetContent(),
      css`
        :root {
          --spacebook-theme-bg-white: #ffffff;
          --spacebook-theme-bg-gray-50: #f9fafb;
          --spacebook-theme-bg-gray-100: #f3f4f6;
          --spacebook-theme-bg-gray-200: #e5e7eb;
          --spacebook-theme-bg-gray-800: #1f2937;
          --spacebook-theme-bg-gray-900: #111827;
          --spacebook-theme-text-gray-400: #9ca3af;
          --spacebook-theme-text-gray-500: #6b7280;
          --spacebook-theme-text-gray-600: #4b5563;
          --spacebook-theme-text-gray-700: #374151;
          --spacebook-theme-text-gray-800: #1f2937;
          --spacebook-theme-text-gray-900: #111827;
          --spacebook-theme-text-gray-300: #d1d5db;
          --spacebook-theme-border-gray-100: #f3f4f6;
          --spacebook-theme-border-gray-200: #e5e7eb;
          --spacebook-theme-border-gray-700: #4b5563;
          --spacebook-theme-border-gray-800: #1f2937;
        }
        
        body {
          margin: 0;
          padding: 0;
          font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: var(--spacebook-theme-bg-white);
          color: var(--spacebook-theme-text-gray-900);
        }
        
        body.dark-mode {
          background-color: var(--spacebook-theme-bg-gray-900);
          color: var(--spacebook-theme-text-gray-400);
        }
        
        @media (prefers-color-scheme: dark) {
          body:not(.light-mode) {
            background-color: var(--spacebook-theme-bg-gray-900);
            color: var(--spacebook-theme-text-gray-400);
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
        background-color: var(--spacebook-theme-bg-white);
        font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        line-height: 1.5;
      }
      
      :host([dark-mode]) {
        background-color: var(--spacebook-theme-bg-gray-900);
      }
      
      .app-container {
        min-height: 100vh;
        background-color: var(--spacebook-theme-bg-white);
      }
      
      :host([dark-mode]) .app-container {
        background-color: var(--spacebook-theme-bg-gray-900);
      }
      
      /* Header styles */
      .site-header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 10;
        background-color: var(--spacebook-theme-bg-white);
        border-bottom: 1px solid var(--spacebook-theme-border-gray-100);
        transition: all 0.2s;
      }
      
      :host([dark-mode]) .site-header {
        background-color: var(--spacebook-theme-bg-gray-900);
        border-bottom-color: var(--spacebook-theme-border-gray-800);
      }
      
      .header-nav {
        display: flex;
        align-items: center;
        height: 4rem;
        padding: 0.5rem 1rem;
      }
      
      @media (min-width: 768px) {
        .header-nav {
          height: 5rem;
        }
      }
      
      .header-content {
        display: none;
        width: 100%;
        padding: 1rem;
      }
      
      @media (min-width: 768px) {
        .header-content {
          display: block;
        }
      }
      
      .site-title-link {
        display: flex;
        align-items: center;
        text-decoration: none;
        color: var(--spacebook-theme-text-gray-600);
        font-weight: 700;
      }
      
      .site-title-link:hover {
        color: var(--spacebook-theme-text-gray-800);
      }
      
      :host([dark-mode]) .site-title-link {
        color: var(--spacebook-theme-text-gray-500);
      }
      
      .site-title {
        font-size: 1.25rem;
        line-height: 1.75rem;
      }
      
      .site-subtitle {
        display: block;
        margin-top: 0.25rem;
        font-size: 0.875rem;
        color: var(--spacebook-theme-text-gray-500);
        font-weight: 400;
      }
      
      :host([dark-mode]) .site-subtitle {
        color: var(--spacebook-theme-text-gray-600);
      }
      
      /* Search styles */
      .search-container {
        position: relative;
        width: 100%;
        margin-right: 0.5rem;
      }
      
      @media (min-width: 768px) {
        .search-container {
          width: 16rem;
        }
      }
      
      .search-input {
        margin-left: 0.5rem;
        width: 15rem;
        background-color: var(--spacebook-theme-bg-gray-50);
        border: 1px solid var(--spacebook-theme-border-gray-200);
        border-radius: 0.375rem;
        padding: 0.5rem;
        font-size: 0.875rem;
        color: var(--spacebook-theme-text-gray-900);
      }
      
      :host([dark-mode]) .search-input {
        background-color: var(--spacebook-theme-bg-gray-800);
        border-color: var(--spacebook-theme-border-gray-700);
        color: var(--spacebook-theme-text-gray-300);
      }
      
      .search-input:focus {
        outline: none;
        ring: 4px;
        ring-color: rgb(59 130 246 / 0.5);
      }
      
      /* Mobile menu button */
      .mobile-menu-btn {
        display: block;
        margin-right: 0.75rem;
        padding: 0.5rem;
        background: transparent;
        border: none;
        cursor: pointer;
        color: var(--spacebook-theme-text-gray-400);
      }
      
      @media (min-width: 768px) {
        .mobile-menu-btn {
          display: none;
        }
      }
      
      .mobile-menu-btn:hover {
        color: var(--spacebook-theme-text-gray-600);
      }
      
      /* Dark mode toggle */
      .dark-mode-toggle {
        margin-right: 0.75rem;
        padding: 0.5rem;
        background: transparent;
        border: none;
        cursor: pointer;
        color: var(--spacebook-theme-text-gray-400);
      }
      
      .dark-mode-toggle:hover {
        color: var(--spacebook-theme-text-gray-600);
      }
      
      :host([dark-mode]) .dark-mode-toggle {
        color: var(--spacebook-theme-text-gray-400);
      }
      
      :host([dark-mode]) .dark-mode-toggle:hover {
        color: #fbbf24;
      }
      
      /* Sidebar Navigation */
      .sidebar-nav {
        position: fixed;
        top: 5rem;
        left: -16rem;
        bottom: 0;
        width: 16rem;
        background-color: var(--spacebook-theme-bg-white);
        border-right: 1px solid var(--spacebook-theme-border-gray-100);
        transition: left 0.3s ease;
        overflow-x: hidden;
        overflow-y: auto;
        padding: 1rem;
        z-index: 1;
      }
      
      @media (min-width: 1024px) {
        .sidebar-nav {
          width: 18rem;
          left: -18rem;
        }
      }
      
      :host([mobile-nav-open]) .sidebar-nav {
        left: 0;
      }
      
      @media (min-width: 768px) {
        .sidebar-nav {
          top: 4rem;
          display: block;
          left: 0;
        }
      }
      
      :host([dark-mode]) .sidebar-nav {
        background-color: var(--spacebook-theme-bg-gray-900);
        border-right-color: var(--spacebook-theme-border-gray-800);
      }
      
      .sidebar-close-btn {
        float: right;
        display: block;
        padding: 1.5rem;
        margin-right: -1rem;
        background: transparent;
        border: none;
        cursor: pointer;
        color: var(--spacebook-theme-text-gray-500);
      }
      
      @media (min-width: 768px) {
        .sidebar-close-btn {
          display: none;
        }
      }
      
      /* Main content area */
      .main-content {
        padding-top: 4rem;
        min-height: 100vh;
      }
      
      @media (min-width: 640px) {
        .main-content {
          padding-top: 4.5rem;
        }
      }
      
      @media (min-width: 768px) {
        .main-content {
          padding-top: 5rem;
          padding-left: 16rem;
        }
      }
      
      @media (min-width: 1024px) {
        .main-content {
          padding-left: 18rem;
        }
      }
      
      .content-wrapper {
        display: flex;
        width: 100%;
        justify-content: center;
      }
      
      .content-container {
        margin-top: 1rem;
        padding: 0 1.5rem;
        width: 100%;
        max-width: 80rem;
      }
      
      @media (min-width: 768px) {
        .content-container {
          padding: 0 1.5rem;
        }
      }
      
      @media (min-width: 1024px) {
        .content-container {
          padding: 0 2rem;
        }
      }
      
      @media (min-width: 1280px) {
        .content-container {
          padding: 0 3rem;
        }
      }
      
      .content-inner {
        display: flex;
        justify-content: space-between;
      }
      
      .main-article {
        display: flex;
        flex-direction: column;
        padding-right: 0;
        max-width: none;
        font-size: 1rem;
        line-height: 1.75;
      }
      
      @media (min-width: 1280px) {
        .main-article {
          padding-right: 16rem;
          font-size: 1.125rem;
        }
      }
      
      .article-header h1 {
        color: var(--spacebook-theme-text-gray-500);
        font-size: 2.25rem;
        font-weight: 700;
        margin: 1.5rem 0;
      }
      
      :host([dark-mode]) .article-header h1 {
        color: var(--spacebook-theme-text-gray-500);
      }
      
      .article-content {
        align-self: center;
        color: var(--spacebook-theme-text-gray-800);
      }
      
      :host([dark-mode]) .article-content {
        color: var(--spacebook-theme-text-gray-400);
      }
      
      /* Edit button and metadata */
      .page-meta {
        display: flex;
        margin-top: 1rem;
        justify-content: flex-end;
        margin-right: 0.25rem;
      }
      
      .page-meta-item {
        display: inline-block;
        width: auto;
        font-size: 0.75rem;
        color: var(--spacebook-theme-text-gray-500);
        padding: 0.25rem 0.75rem;
        margin-right: 0.5rem;
        border-radius: 0.25rem;
      }
      
      .page-meta-item:hover {
        background-color: var(--spacebook-theme-bg-gray-200);
      }
      
      .page-meta-item a {
        color: inherit;
        text-decoration: none;
        font-weight: normal;
      }
      
      /* Table of contents sidebar */
      .toc-sidebar {
        display: none;
        position: sticky;
        right: 0;
        margin-top: 3rem;
        margin-left: -14rem;
        width: 14rem;
        height: fit-content;
        top: 12rem;
        color: var(--spacebook-theme-text-gray-500);
        font-weight: 600;
      }
      
      @media (min-width: 1280px) {
        .toc-sidebar {
          display: block;
        }
      }
      
      .toc-content {
        font-weight: normal;
      }
      
      /* Navigation arrows */
      .page-navigation {
        display: flex;
        flex-wrap: wrap;
        flex-direction: row-reverse;
        justify-content: space-between;
        margin-top: 2rem;
        margin-bottom: 2rem;
        padding-top: 1rem;
        margin-left: 0;
        padding-left: 0;
        list-style: none;
      }
      
      .nav-item {
        margin-left: 0;
        padding-left: 0;
      }
      
      .nav-link {
        font-weight: 600;
        color: var(--spacebook-theme-text-gray-500);
        text-decoration: none;
      }
      
      .nav-link:hover {
        color: var(--spacebook-theme-text-gray-900);
      }
      
      :host([dark-mode]) .nav-link {
        color: var(--spacebook-theme-text-gray-400);
      }
      
      :host([dark-mode]) .nav-link:hover {
        color: var(--spacebook-theme-text-gray-300);
      }
      
      .nav-icon {
        display: inline;
        margin-left: 0.25rem;
        flex-shrink: 0;
        height: 1.5rem;
        fill: none;
        stroke: currentColor;
        stroke-width: 2;
      }
      
      .nav-icon.prev {
        transform: rotate(180deg);
        margin-right: 0.25rem;
        margin-left: 0;
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
    // Toggle the HAXcms store dark mode state
    // The HAXCMSThemeParts mixin will automatically sync this with the theme
    store.darkMode = !store.darkMode;
  }
  
  // Lit render the HTML
  render() {
    const manifest = this.manifest || {};
    const metadata = manifest.metadata || {};
    const site = metadata.site || {};
    const activeItem = this.activeItem || {};
    
    return html`
      <div class="app-container">
        <!-- Fixed Header -->
        <div class="site-header">
          <nav class="header-nav">
            <!-- Mobile site info (hidden on desktop) -->
            <div class="header-content">
              <a href="/" class="site-title-link">
                <div>
                  <span class="site-title">${site.name || 'Site Title'}</span>
                  ${site.description ? html`<span class="site-subtitle">${site.description}</span>` : ''}
                </div>
              </a>
            </div>
            
            <!-- Search Bar -->
            <div class="search-container">
              <site-modal 
                .title="Search" 
                @click="${this.toggleSearch}" 
                button-label="Search..."
                icon="search"
                class="search-input">
                <site-search slot="content"></site-search>
              </site-modal>
            </div>
            
            <!-- Mobile Navigation Button -->
            <button 
              class="mobile-menu-btn" 
              @click="${this.toggleMobileNav}"
              aria-label="Show navigation">
              <svg fill="none" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            
            <!-- Dark Mode Toggle -->
            <button 
              class="dark-mode-toggle" 
              @click="${this.toggleDarkMode}"
              aria-label="Toggle dark mode">
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="24" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.67 8.658a3.661 3.661 0 0 0-.781 1.114 3.28 3.28 0 0 0-.268 1.329v1.6a1.304 1.304 0 0 1-.794 1.197 1.282 1.282 0 0 1-.509.102H7.712a1.285 1.285 0 0 1-.922-.379 1.303 1.303 0 0 1-.38-.92v-1.6c0-.479-.092-.921-.274-1.329a3.556 3.556 0 0 0-.776-1.114 4.689 4.689 0 0 1-1.006-1.437A4.187 4.187 0 0 1 4 5.5a4.432 4.432 0 0 1 .616-2.27c.197-.336.432-.64.705-.914a4.6 4.6 0 0 1 .911-.702c.338-.196.7-.348 1.084-.454a4.45 4.45 0 0 1 1.2-.16 4.476 4.476 0 0 1 2.276.614 4.475 4.475 0 0 1 1.622 1.616 4.438 4.438 0 0 1 .616 2.27c0 .617-.117 1.191-.353 1.721a4.69 4.69 0 0 1-1.006 1.437zM9.623 10.5H7.409v2.201c0 .081.028.15.09.212a.29.29 0 0 0 .213.09h1.606a.289.289 0 0 0 .213-.09.286.286 0 0 0 .09-.212V10.5z"></path>
              </svg>
            </button>
          </nav>
        </div>
        
        <!-- Sidebar Navigation -->
        <nav class="sidebar-nav">
          <button 
            class="sidebar-close-btn" 
            @click="${this.closeMobileNav}"
            aria-label="Close navigation">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
              <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"/>
            </svg>
          </button>
          
          <div class="sidebar-content">
            <!-- Mobile site title in sidebar -->
            <a href="/" @click="${this.closeMobileNav}">
              <div class="mobile-site-title">
                <div class="site-title">${site.name || 'Site Title'}</div>
                <div class="site-subtitle">${site.description || ''}</div>
              </div>
            </a>
            
            <!-- Navigation Menu -->
            <slot name="site-menu"></slot>
          </div>
        </nav>
        
        <!-- Main Content -->
        <main class="main-content">
          <div class="content-wrapper">
            <div class="content-container">
              <div class="content-inner">
                <!-- Main Article Content -->
                <div class="main-article">
                  <!-- Page metadata (edit button, timestamp) -->
                  <div class="page-meta">
                    ${activeItem?.metadata?.updated ? html`
                      <div class="page-meta-item">
                        Updated <time datetime="${new Date(activeItem.metadata.updated * 1000).toISOString()}">
                          ${new Date(activeItem.metadata.updated * 1000).toLocaleDateString()}
                        </time>
                      </div>
                    ` : ''}
                    ${manifest?.metadata?.repository ? html`
                      <div class="page-meta-item">
                        <a target="_blank" rel="noopener noreferrer" 
                           href="${manifest.metadata.repository}/edit/main/${activeItem?.location || ''}">Edit</a>
                      </div>
                    ` : ''}
                  </div>
                  
                  <article>
                    <!-- Page Title -->
                    <div class="article-header">
                      <site-active-title></site-active-title>
                    </div>
                    
                    <!-- Page Content -->
                    <div class="article-content">
                      <!-- Required HAXcms content container -->
                      <div id="contentcontainer">
                        <div id="slot">
                          <slot></slot>
                        </div>
                      </div>
                      
                      <!-- Page Navigation (prev/next) -->
                      <ul class="page-navigation">
                        <li class="nav-item">
                          <site-menu-button type="next" position="top" class="nav-link">
                            <svg class="nav-icon" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                          </site-menu-button>
                        </li>
                        <li class="nav-item">
                          <site-menu-button type="prev" position="top" class="nav-link">
                            <svg class="nav-icon prev" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                          </site-menu-button>
                        </li>
                      </ul>
                    </div>
                  </article>
                </div>
                
                <!-- Table of Contents Sidebar (desktop only) -->
                <div class="toc-sidebar">
                  <small>ON THIS PAGE</small><br>
                  <aside class="toc-content">
                    <slot name="toc"></slot>
                  </aside>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Footer -->
          <footer>
            <slot name="footer"></slot>
          </footer>
        </main>
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

globalThis.customElements.define(SpacebookTheme.tag, SpacebookTheme);