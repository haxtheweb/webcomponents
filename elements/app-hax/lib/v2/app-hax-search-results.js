/* eslint-disable no-return-assign */
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
import { html, css } from "lit";
import { autorun, toJS } from "mobx";
import { varGet } from "@haxtheweb/utils/utils.js";
import { store } from "./AppHaxStore.js";
import "./app-hax-site-bar.js";
import "./app-hax-site-details.js";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";

export class AppHaxSearchResults extends SimpleColors {
  // a convention I enjoy so you can change the tag name in 1 place
  static get tag() {
    return "app-hax-search-results";
  }

  constructor() {
    super();
    this.searchItems = [];
    this.displayItems = [];
    this.searchTerm = "";
    this.dark = false;
    this.isPointerDown = false;
    this.startX = 0;
    this.scrollLeftVal = 0;
    this.isDragging = false;
    this.currentIndex = 1;
    this.totalItems = 0;
    autorun(() => {
      this.searchTerm = toJS(store.searchTerm);
    });
    autorun(() => {
      this.dark = toJS(store.darkMode);
    });
    autorun(() => {
      const manifest = toJS(store.manifest);
      if (manifest && manifest.items) {
        this.searchItems = manifest.items;
        this.displayItems = [...this.searchItems];
        // Ensure themes data is loaded for thumbnails
        store.loadThemesData();
      }
    });
  }

  // Site.json is coming from

  static get properties() {
    return {
      ...super.properties,
      searchTerm: { type: String, reflect: true },
      searchItems: { type: Array },
      displayItems: { type: Array },
      siteUrl: { type: String, attribute: "site-url" },
      isPointerDown: { type: Boolean },
      startX: { type: Number },
      scrollLeftVal: { type: Number },
      isDragging: { type: Boolean },
      currentIndex: { type: Number },
      totalItems: { type: Number },
    };
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "searchTerm") {
        this.displayItems = this.searchItems.filter((word) => {
          if (
            word.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            word.description
              .toLowerCase()
              .includes(this.searchTerm.toLowerCase()) ||
            word.author.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            word.slug.toLowerCase().includes(this.searchTerm.toLowerCase())
          ) {
            return true;
          }
          return false;
        });
      }
    });
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          width: 100%;
          overflow: visible;
        }

        .carousel-container {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: var(--ddd-spacing-2, 8px);
          width: 65vw;
          max-height: 280px;
          position: relative;
          border-radius: var(--ddd-radius-md, 8px);
          border: var(--ddd-border-xs, 1px solid)
            var(--ddd-theme-default-limestoneLight, #e4e5e7);
          box-shadow: var(--ddd-boxShadow-sm);
          padding: var(--ddd-spacing-2, 8px);
          transition: box-shadow 0.2s ease;
          overflow: visible;
        }
        :host([dark]) .carousel-container,
        body.dark-mode .carousel-container {
          border-color: var(--ddd-theme-default-slateGray, #666);
          color: var(--ddd-theme-default-white, white);
        }
        .carousel-container:hover {
          box-shadow: var(--ddd-boxShadow-md);
        }
        .pager-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: var(--ddd-spacing-2, 8px);
          margin-right: var(--ddd-spacing-4, 16px);
          padding: var(--ddd-spacing-1, 4px);
          flex-shrink: 0;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .pager-container::-webkit-scrollbar {
          display: none;
        }
        .pager-dot {
          width: var(--ddd-spacing-3, 12px);
          height: var(--ddd-spacing-3, 12px);
          border-radius: var(--ddd-radius-circle, 50%);
          background: var(--ddd-theme-default-limestoneGray, #a2aaad);
          border: var(--ddd-border-xs, 1px solid) transparent;
          cursor: pointer;
          transition: all 0.2s ease;
          outline: none;
        }
        .pager-dot:hover,
        .pager-dot:focus {
          transform: scale(1.2);
          outline: var(--ddd-border-xs, 1px solid)
            var(--ddd-theme-default-keystoneYellow, #ffd100);
        }
        .pager-dot.active {
          background: var(--ddd-theme-default-nittanyNavy, #001e44);
          border-color: var(--ddd-theme-default-keystoneYellow, #ffd100);
          transform: scale(1.1);
        }
        :host([dark]) .pager-dot,
        body.dark-mode .pager-dot {
          background: var(--ddd-theme-default-slateGray, #666);
        }
        :host([dark]) .pager-dot.active,
        body.dark-mode .pager-dot.active {
          background: var(--ddd-theme-default-keystoneYellow, #ffd100);
          border-color: var(--ddd-theme-default-white, white);
        }
        .scroll-left,
        .scroll-right {
          background: var(--ddd-theme-default-nittanyNavy, #001e44);
          color: var(--ddd-theme-default-white, white);
          border: var(--ddd-border-sm, 2px solid)
            var(--ddd-theme-default-keystoneYellow, #ffd100);
          border-radius: var(--ddd-radius-sm, 4px);
          padding: var(--ddd-spacing-4, 16px);
          cursor: pointer;
          height: 240px;
          min-width: var(--ddd-spacing-12, 56px);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--ddd-font-size-s, 20px);
          transition: all 0.2s ease;
          flex-shrink: 0;
          z-index: 10;
          position: relative;
        }
        .scroll-right {
          margin-right: 0;
        }

        :host([dark]) .scroll-left,
        :host([dark]) .scroll-right,
        body.dark-mode .scroll-left,
        body.dark-mode .scroll-right {
          background: var(--ddd-theme-default-keystoneYellow, #ffd100);
          color: var(--ddd-theme-default-nittanyNavy, #001e44);
          border-color: var(--ddd-theme-default-white, white);
        }

        .scroll-left:hover:not(:disabled),
        .scroll-right:hover:not(:disabled) {
          background: var(--ddd-theme-default-keystoneYellow, #ffd100);
          color: var(--ddd-theme-default-nittanyNavy, #001e44);
          transform: translateY(-2px);
          box-shadow: var(--ddd-boxShadow-md);
        }

        .scroll-left:disabled,
        .scroll-right:disabled {
          opacity: 0.3;
          cursor: not-allowed;
          background: var(--ddd-theme-default-limestoneGray, #a2aaad);
          color: var(--ddd-theme-default-slateGray, #666);
          border-color: var(--ddd-theme-default-limestoneGray, #a2aaad);
          transform: none;
          box-shadow: none;
        }

        :host([dark]) .scroll-left:hover:not(:disabled),
        :host([dark]) .scroll-right:hover:not(:disabled),
        body.dark-mode .scroll-left:hover:not(:disabled),
        body.dark-mode .scroll-right:hover:not(:disabled) {
          background: var(--ddd-theme-default-nittanyNavy, #001e44);
          color: var(--ddd-theme-default-white, white);
        }

        :host([dark]) .scroll-left:disabled,
        :host([dark]) .scroll-right:disabled,
        body.dark-mode .scroll-left:disabled,
        body.dark-mode .scroll-right:disabled {
          opacity: 0.3;
          cursor: not-allowed;
          background: var(--ddd-theme-default-coalyGray, #444);
          color: var(--ddd-theme-default-slateGray, #666);
          border-color: var(--ddd-theme-default-coalyGray, #444);
        }

        #results {
          display: flex;
          flex-wrap: nowrap;
          overflow-x: auto;
          overflow-y: hidden;
          scroll-snap-type: x mandatory;
          gap: var(--ddd-spacing-6, 24px);
          padding: var(--ddd-spacing-1, 4px) var(--ddd-spacing-2, 8px);
          flex: 1;
          min-width: 0;
          cursor: grab;
          user-select: none;
          /* Keep scrollbar visible for multiple interaction methods */
          scrollbar-width: thin;
          scrollbar-color: var(--ddd-theme-default-slateGray, #666)
            var(--ddd-theme-default-limestoneLight, #e4e5e7);
        }

        :host([dark]) #results,
        body.dark-mode #results {
          scrollbar-color: var(--ddd-theme-default-limestoneGray, #a2aaad)
            var(--ddd-theme-default-coalyGray, #444);
        }

        #results.dragging {
          cursor: grabbing;
          scroll-behavior: auto;
        }

        #results::-webkit-scrollbar {
          height: 8px;
        }

        #results::-webkit-scrollbar-track {
          background: var(--ddd-theme-default-limestoneLight, #e4e5e7);
          border-radius: var(--ddd-radius-xs, 2px);
        }

        #results::-webkit-scrollbar-thumb {
          background: var(--ddd-theme-default-slateGray, #666);
          border-radius: var(--ddd-radius-xs, 2px);
          transition: background 0.2s ease;
        }

        #results::-webkit-scrollbar-thumb:hover {
          background: var(--ddd-theme-default-nittanyNavy, #001e44);
        }

        :host([dark]) #results::-webkit-scrollbar-track,
        body.dark-mode #results::-webkit-scrollbar-track {
          background: var(--ddd-theme-default-coalyGray, #444);
        }

        :host([dark]) #results::-webkit-scrollbar-thumb,
        body.dark-mode #results::-webkit-scrollbar-thumb {
          background: var(--ddd-theme-default-limestoneGray, #a2aaad);
        }

        :host([dark]) #results::-webkit-scrollbar-thumb:hover,
        body.dark-mode #results::-webkit-scrollbar-thumb:hover {
          background: var(--ddd-theme-default-keystoneYellow, #ffd100);
        }

        li {
          flex: 0 0 auto;
          scroll-snap-align: center;
          width: 220px;
          min-width: 220px;
          height: 260px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        app-hax-site-bar {
          margin: 0 var(--ddd-spacing-3, 12px);
          width: 100%;
        }
        .description {
          max-height: 64px;
          overflow: hidden;
          max-width: 80%;
          text-overflow: ellipsis;
          word-break: break-word;
          font-family: var(--ddd-font-primary, sans-serif);
          font-size: var(--ddd-font-size-xs, 14px);
          line-height: var(--ddd-lh-150, 1.5);
        }

        @media (max-width: 1200px) {
          :host {
            min-width: calc(
              2 * 264px + var(--ddd-spacing-6, 24px) + 2 *
                var(--ddd-spacing-12, 56px)
            );
          }
        }

        @media (max-width: 800px) {
          :host {
            min-width: calc(264px + 2 * var(--ddd-spacing-12, 56px));
          }

          app-hax-site-bar {
            --main-banner-width: 60vw;
          }

          .description {
            max-height: 24px;
            font-size: var(--ddd-font-size-3xs, 8px);
            font-family: var(--ddd-font-primary, sans-serif);
          }

          .scroll-left,
          .scroll-right {
            min-width: var(--ddd-spacing-10, 40px);
            padding: var(--ddd-spacing-2, 8px);
            font-size: var(--ddd-font-size-s, 16px);
          }
        }
        @media (max-width: 640px) {
          app-hax-site-bar a {
            font-size: var(--ddd-font-size-xs, 14px);
          }
          app-hax-site-bar {
            --main-banner-width: 70vw;
          }

          li {
            width: 240px;
            min-width: 240px;
          }

          #results::after {
            min-width: 240px;
          }
          /* Mobile: Show only 1 item, hide arrows */
          .scroll-left,
          .scroll-right {
            display: none;
          }

          .carousel-container {
            padding: var(--ddd-spacing-2, 8px) var(--ddd-spacing-4, 16px);
            justify-content: center;
          }

          #results {
            /* Single item takes full width on mobile */
            gap: 0;
            scroll-snap-type: x mandatory;
            overflow-x: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
        }
        span[slot="band"] {
          height: var(--ddd-spacing-12, 48px);
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: var(--ddd-spacing-2, 8px);
        }
        :host([dark]) #noResult,
        body.dark-mode #noResult {
          color: var(--ddd-theme-default-limestoneGray, #f5f5f5);
        }

        #noResult {
          font-family: var(--ddd-font-primary, sans-serif);
          font-size: var(--ddd-font-size-s, 16px);
          color: var(--ddd-theme-default-coalyGray, #444);
          text-align: center;
          padding: var(--ddd-spacing-6, 24px);
          margin: var(--ddd-spacing-4, 16px);
        }

        /* Screen reader only text */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `,
    ];
  }
  // Calculate which dot indicators to display (max 10)
  getVisibleDotRange() {
    const maxDots = 10;
    if (this.totalItems <= maxDots) {
      // Show all dots if we have 10 or fewer items
      return { start: 1, end: this.totalItems };
    }

    // Calculate the range to keep current index centered when possible
    const halfRange = Math.floor(maxDots / 2);
    let start = Math.max(1, this.currentIndex - halfRange);
    let end = Math.min(this.totalItems, start + maxDots - 1);

    // Adjust start if we're near the end
    if (end === this.totalItems) {
      start = Math.max(1, end - maxDots + 1);
    }

    return { start, end };
  }

  render() {
    // Update total items count
    this.totalItems = this.displayItems.length;
    const dotRange = this.getVisibleDotRange();

    return html`
      <div
        class="carousel-container"
        role="region"
        aria-label="Site results carousel"
        aria-live="polite"
      >
        <simple-tooltip for="scroll-left-btn" position="top"
          >Previous</simple-tooltip
        >
        <button
          id="scroll-left-btn"
          class="scroll-left"
          @click="${this.scrollLeft}"
          ?disabled="${this.currentIndex <= 1 || this.totalItems <= 1}"
          aria-label="Previous sites"
          aria-describedby="scroll-left-desc"
        >
          ◀
          <span id="scroll-left-desc" class="sr-only"
            >View previous sites in the carousel</span
          >
        </button>
        <ul
          id="results"
          class="${this.isDragging ? "dragging" : ""}"
          @mousedown="${this.handlePointerStart}"
          @touchstart="${this.handlePointerStart}"
          @mousemove="${this.handlePointerMove}"
          @touchmove="${this.handlePointerMove}"
          @mouseup="${this.handlePointerEnd}"
          @touchend="${this.handlePointerEnd}"
          @mouseleave="${this.handlePointerEnd}"
          @scroll="${this.handleScroll}"
        >
          ${this.displayItems.length > 0
            ? this.displayItems.map(
                (item) =>
                  html` <li>
                    <app-hax-site-bar
                      ?dark="${this.dark}"
                      site-id="${item.id}"
                      .siteUrl="${item.slug}"
                      .slug="${item.slug}"
                      .image="${this.getThemeImage(item)}"
                      accent-color="${varGet(
                        item,
                        "metadata.theme.variables.cssVariable",
                        "",
                      )
                        .replace("--simple-colors-default-theme-", "")
                        .replace("-7", "")}"
                    >
                      <span slot="heading">${item.title}</span>
                      <span slot="subHeading">${item.author}</span>
                      <app-hax-site-details
                        slot="band"
                        .details="${this.getItemDetails(item)}"
                        site-id="${item.id}"
                      >
                        <div class="description" slot="pre">
                          ${item.description}
                        </div>
                      </app-hax-site-details>
                    </app-hax-site-bar>
                  </li>`,
              )
            : html`<div id="noResult">
                No
                results${this.searchTerm !== ""
                  ? html`<strong>"${this.searchTerm}"</strong>`
                  : ", Create a new site!"}
              </div>`}
        </ul>
        <simple-tooltip for="scroll-right-btn" position="top"
          >Next</simple-tooltip
        >
        <button
          id="scroll-right-btn"
          class="scroll-right"
          @click="${this.scrollRight}"
          ?disabled="${this.currentIndex >= this.totalItems ||
          this.totalItems <= 1}"
          aria-label="Next sites"
          aria-describedby="scroll-right-desc"
        >
          ▶
          <span id="scroll-right-desc" class="sr-only"
            >View next sites in the carousel</span
          >
        </button>
        ${this.totalItems > 1
          ? html`
              <div class="pager-container">
                ${Array.from(
                  { length: dotRange.end - dotRange.start + 1 },
                  (_, index) => {
                    const pageNumber = dotRange.start + index;
                    return html`
                      <button
                        class="pager-dot ${this.currentIndex === pageNumber
                          ? "active"
                          : ""}"
                        @click="${() => this.goToPage(pageNumber)}"
                        aria-label="Go to page ${pageNumber} of ${this
                          .totalItems}"
                        aria-current="${this.currentIndex === pageNumber
                          ? "page"
                          : "false"}"
                        tabindex="0"
                      ></button>
                    `;
                  },
                )}
              </div>
            `
          : ""}
      </div>
    `;
  }

  scrollLeft() {
    // Don't scroll if at the beginning or only one item
    if (this.currentIndex <= 1 || this.totalItems <= 1) return;

    const itemWidth = 264 + 24; // item width + gap
    this.shadowRoot
      .querySelector("#results")
      .scrollBy({ left: -itemWidth, behavior: "smooth" });
  }

  scrollRight() {
    // Don't scroll if at the end or only one item
    if (this.currentIndex >= this.totalItems || this.totalItems <= 1) return;

    const itemWidth = 264 + 24; // item width + gap
    this.shadowRoot
      .querySelector("#results")
      .scrollBy({ left: itemWidth, behavior: "smooth" });
  }

  handlePointerStart(e) {
    const resultsEl = this.shadowRoot.querySelector("#results");
    this.isPointerDown = true;
    this.isDragging = false;
    this.startX =
      (e.type === "mousedown" ? e.clientX : e.touches[0].clientX) -
      resultsEl.offsetLeft;
    this.scrollLeftVal = resultsEl.scrollLeft;
    e.preventDefault();
  }

  handlePointerMove(e) {
    if (!this.isPointerDown) return;

    const resultsEl = this.shadowRoot.querySelector("#results");
    const x =
      (e.type === "mousemove" ? e.clientX : e.touches[0].clientX) -
      resultsEl.offsetLeft;
    const walk = (x - this.startX) * 2; // Multiply for faster scrolling

    // Only start dragging if we've moved a significant distance
    if (Math.abs(walk) > 5) {
      this.isDragging = true;
      // Disable smooth scrolling during drag for immediate feedback
      resultsEl.style.scrollBehavior = "auto";
    }

    if (this.isDragging) {
      resultsEl.scrollLeft = this.scrollLeftVal - walk;
      e.preventDefault();
    }
  }

  handlePointerEnd(e) {
    this.isPointerDown = false;

    // Restore smooth scrolling behavior
    const resultsEl = this.shadowRoot.querySelector("#results");
    if (resultsEl) {
      resultsEl.style.scrollBehavior = "smooth";
    }

    // Use timeout to allow for click events to fire before resetting drag state
    setTimeout(() => {
      this.isDragging = false;
    }, 100);
  }

  handleScroll(e) {
    if (this.totalItems <= 1) return;

    const resultsEl = e.target;
    const scrollLeft = resultsEl.scrollLeft;
    const scrollWidth = resultsEl.scrollWidth;
    const clientWidth = resultsEl.clientWidth;
    const itemWidth = 264 + 24; // item width + gap

    // Check if we're near the end (within 50px of the end)
    const isNearEnd = scrollLeft + clientWidth >= scrollWidth - 50;

    if (isNearEnd) {
      // If we're near the end, set to last item
      this.currentIndex = this.totalItems;
    } else {
      // Calculate current index based on scroll position
      // Use a threshold-based approach: if more than half of an item is visible, consider it active
      const rawIndex = scrollLeft / itemWidth;
      this.currentIndex = Math.min(
        Math.max(1, Math.floor(rawIndex) + 1),
        this.totalItems,
      );
    }
  }

  goToPage(pageNumber) {
    const resultsEl = this.shadowRoot.querySelector("#results");
    const itemWidth = 264 + 24; // item width + gap
    const targetScrollLeft = (pageNumber - 1) * itemWidth;

    resultsEl.scrollTo({
      left: targetScrollLeft,
      behavior: "smooth",
    });

    this.currentIndex = pageNumber;
  }

  getThemeImage(item) {
    const themeElement = varGet(item, "metadata.theme.element", "");
    if (themeElement && store.themesData && store.themesData[themeElement]) {
      let thumbnailPath = store.themesData[themeElement].thumbnail || "";
      if (thumbnailPath && thumbnailPath.startsWith("@haxtheweb/")) {
        // Navigate from current file to simulate node_modules structure and resolve path
        // Current file: elements/app-hax/lib/v2/app-hax-search-results.js
        // Need to go up to webcomponents root, then navigate to the package
        // In node_modules: @haxtheweb/package-name becomes ../../../../@haxtheweb/package-name
        const packagePath = "../../../../" + thumbnailPath;
        thumbnailPath = new URL(packagePath, import.meta.url).href;
      }
      return thumbnailPath;
    }
    return "";
  }

  getItemDetails(item) {
    const details = {
      created: varGet(item, "metadata.site.created", new Date() / 1000),
      updated: varGet(item, "metadata.site.updated", new Date() / 1000),
      pages: varGet(item, "metadata.pageCount", 0),
      url: item.slug,
    };
    return details;
  }

  openedChanged(e) {
    store.appEl.playSound("click");
    if (!e.detail.value) {
      this.shadowRoot
        .querySelector("app-hax-site-details")
        .setAttribute("tabindex", "-1");
    } else {
      this.shadowRoot
        .querySelector("app-hax-site-details")
        .removeAttribute("tabindex");
    }
  }
}
customElements.define(AppHaxSearchResults.tag, AppHaxSearchResults);
