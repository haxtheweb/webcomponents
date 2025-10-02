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
          min-width: calc(
            3 * 264px + 2 * var(--ddd-spacing-6, 24px) + 2 *
              var(--ddd-spacing-12, 56px)
          );
        }

        .carousel-container {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: var(--ddd-spacing-2, 8px);
          width: 100%;
          max-height: 280px;
          position: relative;
          background: var(--ddd-theme-default-white, white);
          border-radius: var(--ddd-radius-md, 8px);
          border: var(--ddd-border-xs, 1px solid)
            var(--ddd-theme-default-limestoneLight, #e4e5e7);
          box-shadow: var(--ddd-boxShadow-sm);
          padding: var(--ddd-spacing-2, 8px);
          transition: box-shadow 0.2s ease;
        }
        :host([dark]) .carousel-container,
        body.dark-mode .carousel-container {
          background: var(--ddd-theme-default-coalyGray, #222);
          border-color: var(--ddd-theme-default-slateGray, #666);
          color: var(--ddd-theme-default-white, white);
        }
        .carousel-container:hover {
          box-shadow: var(--ddd-boxShadow-md);
        }
        .pager-container {
          display: block;
          justify-content: center;
          align-items: center;
          gap: var(--ddd-spacing-2, 8px);
          margin-top: var(--ddd-spacing-2, 8px);
          padding: var(--ddd-spacing-1, 4px);
          width: 100%;
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
          font-size: var(--ddd-font-size-l, 20px);
          transition: all 0.2s ease;
          flex-shrink: 0;
          z-index: 10;
          position: relative;
        }
        .scroll-right {
          margin-right: 56px;
        }

        :host([dark]) .scroll-left,
        :host([dark]) .scroll-right,
        body.dark-mode .scroll-left,
        body.dark-mode .scroll-right {
          background: var(--ddd-theme-default-keystoneYellow, #ffd100);
          color: var(--ddd-theme-default-nittanyNavy, #001e44);
          border-color: var(--ddd-theme-default-white, white);
        }

        .scroll-left:hover,
        .scroll-right:hover {
          background: var(--ddd-theme-default-keystoneYellow, #ffd100);
          color: var(--ddd-theme-default-nittanyNavy, #001e44);
          transform: translateY(-2px);
          box-shadow: var(--ddd-boxShadow-md);
        }

        :host([dark]) .scroll-left:hover,
        :host([dark]) .scroll-right:hover,
        body.dark-mode .scroll-left:hover,
        body.dark-mode .scroll-right:hover {
          background: var(--ddd-theme-default-nittanyNavy, #001e44);
          color: var(--ddd-theme-default-white, white);
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
          width: 264px;
          min-width: 264px;
          height: 260px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        /* Ensure minimum 3 items are always displayed with empty space if needed */
        #results::after {
          content: "";
          flex: 1 0 auto;
          min-width: 264px;
          height: 260px;
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
      `,
    ];
  }
  render() {
    // Update total items count
    this.totalItems = this.displayItems.length;

    return html`
      ${this.totalItems > 1
        ? html`
            <div class="pager-container">
              ${Array.from(
                { length: this.totalItems },
                (_, index) => html`
                  <button
                    class="pager-dot ${this.currentIndex === index + 1
                      ? "active"
                      : ""}"
                    @click="${() => this.goToPage(index + 1)}"
                    aria-label="Go to page ${index + 1}"
                    tabindex="0"
                  ></button>
                `,
              )}
            </div>
          `
        : ""}
      <div class="carousel-container">
        <simple-tooltip for="scroll-left-btn" position="top"
          >Previous</simple-tooltip
        >
        <button
          id="scroll-left-btn"
          class="scroll-left"
          @click="${this.scrollLeft}"
        >
          ◀
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
                No results for
                ${this.searchTerm !== ""
                  ? html`<strong>"${this.searchTerm}"</strong>`
                  : "your account, try starting a new journey!"}.
              </div>`}
        </ul>
        <simple-tooltip for="scroll-right-btn" position="top"
          >Next</simple-tooltip
        >
        <button
          id="scroll-right-btn"
          class="scroll-right"
          @click="${this.scrollRight}"
        >
          ▶
        </button>
      </div>
    `;
  }

  scrollLeft() {
    this.shadowRoot
      .querySelector("#results")
      .scrollBy({ left: -800, behavior: "smooth" });
  }

  scrollRight() {
    this.shadowRoot
      .querySelector("#results")
      .scrollBy({ left: 800, behavior: "smooth" });
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
    const itemWidth = 264 + 24; // item width + gap

    // Calculate current index based on scroll position
    this.currentIndex = Math.min(
      Math.max(1, Math.round(scrollLeft / itemWidth) + 1),
      this.totalItems,
    );
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
