/**
 * Copyright 2025 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css, nothing } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { HAXCMSI18NMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSI18NMixin.js";
import { HAXCMSLitElementTheme } from "@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { autorun, toJS } from "mobx";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";

/**
 * `site-random-content`
 * `Display random content from pages within the HAXcms site`
 * 
 * @demo demo/index.html
 * @element site-random-content
 */
export class SiteRandomContent extends HAXCMSI18NMixin(DDD) {
  static get tag() {
    return "site-random-content";
  }

  constructor() {
    super();
    this.windowControllers = new AbortController();
    this.HAXCMSI18NMixinBase = "../../../";
    
    // Set default values
    this.pages = 1;
    this.parent = null;
    this.randomContent = [];
    this.loading = false;
    this.editMode = false;
    
    // Initialize translations
    this.t.noContent = "No content available to display";
    this.t.refresh = "Refresh content";
    this.t.loading = "Loading content...";
    
    this.__disposer = this.__disposer ? this.__disposer : [];
    
    // React to manifest changes
    autorun((reaction) => {
      if (store.manifest) {
        this.selectRandomPageContent();
      }
      this.__disposer.push(reaction);
    });

    // React to edit mode changes
    autorun((reaction) => {
      this.editMode = toJS(store.editMode);
      this.__disposer.push(reaction);
    });
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          margin: var(--ddd-spacing-4) 0;
        }
        
        .random-content-container {
          border: var(--ddd-border-xs) var(--ddd-theme-default-limestoneGray);
          border-radius: var(--ddd-radius-sm);
          padding: var(--ddd-spacing-4);
          background: var(--ddd-theme-default-white);
          position: relative;
        }
        
        /* Edit mode overlay */
        :host([edit-mode]) .random-content-container::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(128, 128, 128, 0.3);
          border-radius: var(--ddd-radius-sm);
          pointer-events: none;
          z-index: 1;
        }
        
        :host([edit-mode]) .random-content-container {
          opacity: 0.7;
          pointer-events: none;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--ddd-spacing-3);
          padding-bottom: var(--ddd-spacing-2);
          border-bottom: var(--ddd-border-xs) var(--ddd-theme-default-limestoneLight);
        }
        
        .title {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-s);
          font-weight: var(--ddd-font-weight-bold);
          color: var(--ddd-theme-default-coalyGray);
          margin: 0;
        }
        
        .refresh-btn {
          --simple-icon-button-border-radius: var(--ddd-radius-xs);
        }
        
        .content-item {
          margin-bottom: var(--ddd-spacing-4);
          padding-bottom: var(--ddd-spacing-4);
          border-bottom: var(--ddd-border-xs) var(--ddd-theme-default-limestoneLight);
        }
        
        .content-item:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }
        
        .item-title {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-ms);
          font-weight: var(--ddd-font-weight-medium);
          margin: 0 0 var(--ddd-spacing-2) 0;
          color: var(--ddd-theme-default-coalyGray);
        }
        
        .item-title a {
          color: var(--ddd-theme-default-link);
          text-decoration: none;
        }
        
        .item-title a:hover {
          text-decoration: underline;
        }
        
        .item-content {
          color: var(--ddd-theme-default-coalyGray);
          line-height: var(--ddd-lh-150);
          font-size: var(--ddd-font-size-s);
        }
        
        .no-content {
          text-align: center;
          color: var(--ddd-theme-default-coalyGray);
          font-style: italic;
          padding: var(--ddd-spacing-6);
        }
        
        .loading {
          text-align: center;
          color: var(--ddd-theme-default-coalyGray);
          padding: var(--ddd-spacing-4);
        }
        
        :host([hidden]) {
          display: none;
        }
      `,
    ];
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * Number of random pages to display
       */
      pages: {
        type: Number,
        reflect: true,
      },
      /**
       * Parent page ID to filter descendants from
       */
      parent: {
        type: String,
        reflect: true,
      },
      /**
       * Array of random content to display
       */
      randomContent: {
        type: Array,
      },
      /**
       * Loading state
       */
      loading: {
        type: Boolean,
        reflect: true,
      },
      /**
       * Edit mode state
       */
      editMode: {
        type: Boolean,
        reflect: true,
        attribute: "edit-mode",
      },
    };
  }

  /**
   * Get all descendant pages of a given parent
   */
  getDescendants(parentId, items = null) {
    if (!items) {
      items = store.routerManifest?.items || [];
    }
    
    const descendants = [];
    const directChildren = items.filter(item => item.parent === parentId);
    
    directChildren.forEach(child => {
      descendants.push(child);
      // Recursively get descendants of this child
      descendants.push(...this.getDescendants(child.id, items));
    });
    
    return descendants;
  }

  /**
   * Get eligible pages for random selection
   */
  getEligiblePages() {
    if (!store.routerManifest || !store.routerManifest.items) {
      return [];
    }

    let eligiblePages = [];
    const currentPageId = store.activeId;

    if (this.parent) {
      // Get descendants of the specified parent
      eligiblePages = this.getDescendants(this.parent);
    } else {
      // Get all pages from the site
      eligiblePages = [...store.routerManifest.items];
    }

    // Filter out the current page to avoid infinite loops
    eligiblePages = eligiblePages.filter(item => {
      // Exclude current page
      if (item.id === currentPageId) {
        return false;
      }
      
      // Exclude unpublished pages
      if (item.metadata && item.metadata.published === false) {
        return false;
      }
      
      // Exclude internal routes
      if (!item.slug || item._internalRoute || item.slug.startsWith('x/')) {
        return false;
      }
      
      return true;
    });

    return eligiblePages;
  }

  /**
   * Clean HTML content by removing scripts, styles, and page-break elements
   */
  cleanHtmlContent(htmlContent) {
    if (!htmlContent) {
      return '';
    }
    
    // Create a temporary div to parse HTML
    const tempDiv = globalThis.document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    // Remove page-break elements
    const pageBreaks = tempDiv.querySelectorAll('page-break');
    pageBreaks.forEach(el => el.remove());
    
    // Remove script and style elements
    const scripts = tempDiv.querySelectorAll('script, style');
    scripts.forEach(el => el.remove());
    
    // Return cleaned HTML
    return tempDiv.innerHTML;
  }

  /**
   * Select random page content and display it
   */
  async selectRandomPageContent() {
    if (!store.routerManifest) {
      return;
    }

    this.loading = true;
    const eligiblePages = this.getEligiblePages();
    
    if (eligiblePages.length === 0) {
      this.randomContent = [];
      this.loading = false;
      return;
    }

    // Select random pages
    const selectedPages = [];
    const pagesToSelect = Math.min(this.pages, eligiblePages.length);
    const shuffled = [...eligiblePages].sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < pagesToSelect; i++) {
      const page = shuffled[i];
      
      try {
        // Load content using the store's loadItemContent method
        const htmlContent = await store.loadItemContent(page.id);
        const cleanContent = this.cleanHtmlContent(htmlContent);
        
        selectedPages.push({
          ...page,
          content: cleanContent || page.description || '',
        });
      } catch (error) {
        console.warn('Failed to load content for page:', page.id, error);
        // Fallback to description
        selectedPages.push({
          ...page,
          content: page.description || '',
        });
      }
    }
    
    this.randomContent = selectedPages;
    this.loading = false;
  }

  /**
   * Handle refresh button click
   */
  refreshContent() {
    this.selectRandomPageContent();
  }

  /**
   * Lifecycle - property changed
   */
  updated(changedProperties) {
    super.updated(changedProperties);
    
    if (changedProperties.has('pages') || changedProperties.has('parent')) {
      this.selectRandomPageContent();
    }
  }

  /**
   * Lifecycle - first update
   */
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this.selectRandomPageContent();
  }

  /**
   * Lifecycle - disconnected
   */
  disconnectedCallback() {
    this.__disposer.forEach((reaction) => {
      reaction();
    });
    this.windowControllers.abort();
    super.disconnectedCallback();
  }

  /**
   * HAX hooks - disable interactions in edit mode
   */
  haxHooks() {
    return {
      editModeChanged: (editMode) => {
        this.editMode = editMode;
      },
      activeElementChanged: () => {
        // Prevent interactions when in edit mode
        if (this.editMode) {
          return false;
        }
      },
      setupActiveElementForm: "haxsetupActiveElementForm",
    };
  }

    /**
   * Allow for dynamic setting of the parent field if we have the store around
   * with values to do so
   */
  haxsetupActiveElementForm(props) {
    if (globalThis.HAXCMS) {
      const itemManifest =
        globalThis.HAXCMS.requestAvailability().store.getManifestItems(true);
      // default to null parent as the whole site
      var items = [
        {
          text: `-- ${this.t.noParent} --`,
          value: null,
        },
      ];
      itemManifest.forEach((el) => {
        if (el.id != this.itemId) {
          // calculate -- depth so it looks like a tree
          let itemBuilder = el;
          // walk back through parent tree
          let distance = "- ";
          while (itemBuilder && itemBuilder.parent != null) {
            itemBuilder = itemManifest.find((i) => i.id == itemBuilder.parent);
            // double check structure is sound
            if (itemBuilder) {
              distance = "--" + distance;
            }
          }
          items.push({
            text: distance + el.title,
            value: el.id,
          });
        }
      });
      // apply same logic of the items in the active site to
      // parent and related items
      props.settings.configure.forEach((attr, index) => {
        if (attr.property === "parent") {
          props.settings.configure[index].inputMethod = "select";
          props.settings.configure[index].itemsList = items;
        }
      });
    }
  }
  

  render() {
    return html`
      <div class="random-content-container">
        <div class="header">
          <simple-icon-button-lite
            icon="icons:refresh"
            @click="${this.refreshContent}"
            title="${this.t.refresh}"
            class="refresh-btn"
            ?disabled="${this.editMode}"
          >Refresh content</simple-icon-button-lite>
        </div>
        
        ${this.loading ? html`
          <div class="loading">${this.t.loading}</div>
        ` : nothing}
        
        ${!this.loading && this.randomContent.length === 0 ? html`
          <div class="no-content">${this.t.noContent}</div>
        ` : nothing}
        
        ${!this.loading && this.randomContent.length > 0 ? html`
          <div class="content-list">
            ${this.randomContent.map(item => html`
              <div class="content-item">
                <h4 class="item-title">
                  <a href="${item.slug}" title="${item.title}" ?disabled="${this.editMode}">${item.title}</a>
                </h4>
                ${item.content ? html`
                  <div class="item-content">${unsafeHTML(item.content)}</div>
                ` : nothing}
              </div>
            `)}
          </div>
        ` : nothing}
      </div>
    `;
  }
  

  /**
   * HAX properties integration
   */
  static get haxProperties() {
    return {
      canScale: false,
      canPosition: false,
      canEditSource: false,
      gizmo: {
        title: "Random Content",
        description: "Display random content from other pages in the site",
        icon: "icons:shuffle",
        color: "purple",
        tags: ["Site", "Content", "Random"],
        handles: [],
        meta: {
          author: "HAXcms"
        }
      },
      settings: {
        configure: [
          {
            property: "pages",
            title: "Number of pages",
            description: "How many random pages to display",
            inputMethod: "number",
            min: 1,
            max: 5,
            step: 1,
            required: false,
          },
          {
            property: "parent", 
            title: "Parent page",
            description: "Limit random content to descendants of this page (leave blank for site-wide)",
            inputMethod: "textfield",
            required: false,
          }
        ],
        advanced: []
      },
      demoSchema: [
        {
          tag: this.tag,
          properties: {
            pages: 2,
            parent: null
          },
          content: ""
        }
      ]
    };
  }
}

globalThis.customElements.define(SiteRandomContent.tag, SiteRandomContent);
