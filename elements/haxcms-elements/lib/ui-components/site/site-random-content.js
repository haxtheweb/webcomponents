/**
 * Copyright 2025 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css, nothing } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { HAXCMSI18NMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSI18NMixin.js";
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
    this.page = null;
    this.randomElement = null;
    this.allElements = [];
    this.currentElementIndex = 0;
    this.loading = false;
    this.editMode = false;

    // Initialize translations
    this.t.noContent = "No content available to display";
    this.t.noPage = "No page selected";
    this.t.shuffle = "Shuffle content";
    this.t.loading = "Loading content...";

    this.__disposer = this.__disposer ? this.__disposer : [];

    // React to manifest changes
    autorun((reaction) => {
      if (store.manifest && this.page) {
        this.loadPageElements();
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
          content: "";
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
          border-bottom: var(--ddd-border-xs)
            var(--ddd-theme-default-limestoneLight);
        }

        .title {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-s);
          font-weight: var(--ddd-font-weight-bold);
          color: var(--ddd-theme-default-coalyGray);
          margin: 0;
        }

        .shuffle-btn {
          --simple-icon-button-border-radius: var(--ddd-radius-xs);
        }

        .random-element {
          color: var(--ddd-theme-default-coalyGray);
          line-height: var(--ddd-lh-150);
          font-size: var(--ddd-font-size-s);
        }

        /* Style common elements within the random content */
        .random-element h1,
        .random-element h2,
        .random-element h3,
        .random-element h4,
        .random-element h5,
        .random-element h6 {
          margin: 0 0 var(--ddd-spacing-3) 0;
          color: var(--ddd-theme-default-coalyGray);
        }

        .random-element p {
          margin: 0 0 var(--ddd-spacing-3) 0;
        }

        .random-element blockquote {
          margin: var(--ddd-spacing-3) 0;
          padding: var(--ddd-spacing-3);
          border-left: var(--ddd-border-sm)
            var(--ddd-theme-default-potentialMidnight);
          background-color: var(--ddd-theme-default-limestoneMaxLight);
          font-style: italic;
        }

        .random-element ul,
        .random-element ol {
          margin: 0 0 var(--ddd-spacing-3) 0;
          padding-left: var(--ddd-spacing-5);
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
       * Page ID to load content from
       */
      page: {
        type: String,
        reflect: true,
      },
      /**
       * Current random element to display
       */
      randomElement: {
        type: Object,
      },
      /**
       * All available elements from the page
       */
      allElements: {
        type: Array,
      },
      /**
       * Current element index
       */
      currentElementIndex: {
        type: Number,
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
   * Get the specified page from the manifest
   */
  getPageById(pageId) {
    if (!store.routerManifest || !store.routerManifest.items || !pageId) {
      return null;
    }

    return store.routerManifest.items.find((item) => item.id === pageId);
  }

  /**
   * Extract top-level HTML elements from content
   */
  extractTopLevelElements(htmlContent) {
    if (!htmlContent) {
      return [];
    }

    // Create a temporary div to parse HTML
    const tempDiv = globalThis.document.createElement("div");
    tempDiv.innerHTML = htmlContent;

    // Get all direct children that are meaningful content elements
    const topLevelElements = [];
    const allowedTags = [
      "p",
      "div",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "blockquote",
      "ul",
      "ol",
      "pre",
      "section",
      "article",
      "aside",
      "header",
      "main",
      "figure",
    ];

    Array.from(tempDiv.children).forEach((element) => {
      // Skip empty elements or elements with only whitespace
      if (element.textContent.trim().length === 0) {
        return;
      }

      // Skip script, style, and other non-content elements
      if (
        ["script", "style", "meta", "link", "page-break"].includes(
          element.tagName.toLowerCase(),
        )
      ) {
        return;
      }

      // Include allowed content elements or any element with substantial text content
      if (
        allowedTags.includes(element.tagName.toLowerCase()) ||
        element.textContent.trim().length > 10
      ) {
        topLevelElements.push({
          html: element.outerHTML,
          text: element.textContent.trim(),
          tag: element.tagName.toLowerCase(),
        });
      }
    });

    return topLevelElements;
  }

  /**
   * Load elements from the specified page
   */
  async loadPageElements() {
    if (!this.page || !store.routerManifest) {
      this.allElements = [];
      this.randomElement = null;
      return;
    }

    this.loading = true;
    const pageData = this.getPageById(this.page);

    if (!pageData) {
      console.warn("Page not found:", this.page);
      this.allElements = [];
      this.randomElement = null;
      this.loading = false;
      return;
    }

    try {
      // Load content using the store's loadItemContent method
      const htmlContent = await store.loadItemContent(this.page);
      const elements = this.extractTopLevelElements(htmlContent);

      this.allElements = elements;

      if (elements.length > 0) {
        // Select a random element
        this.selectRandomElement();
      } else {
        this.randomElement = null;
      }
    } catch (error) {
      console.warn("Failed to load content for page:", this.page, error);
      this.allElements = [];
      this.randomElement = null;
    }

    this.loading = false;
  }

  /**
   * Select a random element from available elements
   */
  selectRandomElement() {
    if (this.allElements.length === 0) {
      this.randomElement = null;
      this.currentElementIndex = 0;
      return;
    }

    // Get a random index
    this.currentElementIndex = Math.floor(
      Math.random() * this.allElements.length,
    );
    this.randomElement = this.allElements[this.currentElementIndex];
  }

  /**
   * Handle shuffle button click to get a different random element
   */
  shuffleContent() {
    if (this.allElements.length <= 1) {
      // No point shuffling if there's 0 or 1 elements
      return;
    }

    // Get a different random element (not the current one)
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.allElements.length);
    } while (
      newIndex === this.currentElementIndex &&
      this.allElements.length > 1
    );

    this.currentElementIndex = newIndex;
    this.randomElement = this.allElements[this.currentElementIndex];
  }

  /**
   * Lifecycle - property changed
   */
  updated(changedProperties) {
    super.updated(changedProperties);

    if (changedProperties.has("page")) {
      this.loadPageElements();
    }
  }

  /**
   * Lifecycle - first update
   */
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    if (this.page) {
      this.loadPageElements();
    }
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
   * Allow for dynamic setting of the page field if we have the store around
   * with values to do so
   */
  haxsetupActiveElementForm(props) {
    if (globalThis.HAXCMS) {
      const itemManifest =
        globalThis.HAXCMS.requestAvailability().store.getManifestItems(true);
      // default option for no page selected
      var items = [
        {
          text: `-- ${this.t.noPage} --`,
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
      // apply same logic of the items in the active site to page selection
      props.settings.configure.forEach((attr, index) => {
        if (attr.property === "page") {
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
            icon="icons:shuffle"
            @click="${this.shuffleContent}"
            title="${this.t.shuffle}"
            class="shuffle-btn"
            ?disabled="${this.editMode || this.allElements.length <= 1}"
            >${this.t.shuffle}</simple-icon-button-lite
          >
        </div>

        ${this.loading
          ? html` <div class="loading">${this.t.loading}</div> `
          : nothing}
        ${!this.loading && !this.page
          ? html` <div class="no-content">${this.t.noPage}</div> `
          : nothing}
        ${!this.loading &&
        this.page &&
        (!this.randomElement || this.allElements.length === 0)
          ? html` <div class="no-content">${this.t.noContent}</div> `
          : nothing}
        ${!this.loading && this.randomElement
          ? html`
              <div class="random-element">
                ${unsafeHTML(this.randomElement.html)}
              </div>
            `
          : nothing}
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
        title: "Random Page Content",
        description: "Display a random top-level element from a selected page",
        icon: "icons:shuffle",
        color: "purple",
        tags: ["Other"],
        handles: [],
        meta: {
          author: "HAXcms",
        },
      },
      settings: {
        configure: [
          {
            property: "page",
            title: "Page",
            description:
              "Select the page to draw random content from. The element will randomly display one of the top-level HTML elements from this page.",
            inputMethod: "select",
            required: true,
          },
        ],
        advanced: [],
      },
      demoSchema: [
        {
          tag: this.tag,
          properties: {
            page: null,
          },
          content: "",
        },
      ],
    };
  }
}

globalThis.customElements.define(SiteRandomContent.tag, SiteRandomContent);
