/**
 * Copyright 2023
 * @license , see License.md for full text.
 */
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { html, css, nothing } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import "./lib/play-list-slide.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import {
  haxElementToNode,
  nodeToHaxElement,
  copyToClipboard,
} from "@haxtheweb/utils/utils.js";

/**
 * `play-list`
 * `scrollable component that accepts lightDom or data driven lists and generates a content player`
 * @demo demo/index.html
 * @element play-list
 */
class PlayList extends DDD {
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.items = [];
    this.loop = false;
    this.edit = false;
    this.navigation = false;
    this.pagination = false;
    this.aspectRatio = "16:9";
    this.slide = 0;
    this.orientation = "horizontal";
    this._touchStartX = 0;
    this._touchStartY = 0;
    this._touchCurrentX = 0;
    this._touchCurrentY = 0;
    this._isDragging = false;
    // mutation observer for light dom changes
    this._observer = new MutationObserver((mutations) => {
      clearTimeout(this._debounceMutations);
      this._debounceMutations = setTimeout(() => {
        this.mirrorLightDomToItems();
      }, 100);
    });
    this._observer.observe(this, {
      childList: true,
      subtree: true,
    });
  }

  async mirrorLightDomToItems() {
    let items = Array.from(this.children);
    if (items.length === 1 && items[0].tagName === "TEMPLATE") {
      items = Array.from(items[0].children);
    }
    if (items.length !== 0) {
      await Promise.all(
        items.map(async (item) => {
          return await nodeToHaxElement(item);
        }),
      ).then((items) => {
        this.items = items;
      });
    } else {
      this.items = [];
    }
  }
  // takes a hax element, converts it to a node, turns it into html, then renders it
  // this has gone through filtering and is safe as a result as it's just rendering
  // whatever has been put into the light dom
  renderHAXItem(item) {
    if (item.properties && item.properties.innerHTML) {
      delete item.properties.innerHTML;
    }
    return html`${unsafeHTML(haxElementToNode(item).outerHTML)}`;
  }

  _getSlideTitle(item, index) {
    if (!item) {
      return `Slide ${index + 1}`;
    }
    if (item.properties) {
      if (item.properties.alt) {
        return item.properties.alt;
      }
      if (item.properties.title) {
        return item.properties.title;
      }
      if (item.properties["media-title"]) {
        return item.properties["media-title"];
      }
    }
    if (item.content) {
      const text = item.content.replace(/<[^>]*>/g, "").trim();
      if (text) {
        return text.length > 60 ? text.substring(0, 60) + "..." : text;
      }
    }
    return `Slide ${index + 1}`;
  }

  disconnectedCallback() {
    if (this._observer) {
      this._observer.disconnect();
    }
    super.disconnectedCallback();
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }

  static get properties() {
    return {
      ...super.properties,
      items: { type: Array },
      loop: { type: Boolean, reflect: true },
      edit: { type: Boolean, reflect: true },
      navigation: { type: Boolean, reflect: true },
      pagination: { type: Boolean, reflect: true },
      aspectRatio: { type: String, reflect: true, attribute: "aspect-ratio" },
      orientation: { type: String, reflect: true },
      slide: { type: Number, reflect: true },
    };
  }

  /**
   * LitElement style callback
   */
  static get styles() {
    // support for using in other classes
    let styles = [];
    if (super.styles) {
      styles = super.styles;
    }
    return [
      styles,
      css`
        :host {
          display: block;
        }
        :host([orientation="vertical"]) .carousel,
        :host([orientation="vertical"]) .carousel-viewport,
        :host([orientation="vertical"]) .carousel-track,
        :host([orientation="vertical"]) .carousel-item {
          max-height: 400px;
        }
        :host([orientation="vertical"]) .carousel-item video-player {
          max-height: 100%;
          width: 100%;
        }
        :host([orientation="vertical"]) .carousel-track {
          flex-direction: column;
        }
        :host([orientation="vertical"]) .carousel-item {
          min-height: 400px;
        }
        :host([orientation="vertical"]) .carousel-pagination {
          flex-direction: column;
          position: absolute;
          right: var(--ddd-spacing-1, 8px);
          top: 50%;
          transform: translateY(-50%);
          padding: 0;
        }
        :host([orientation="vertical"]) .carousel-nav {
          top: 0;
          bottom: 0;
          left: 50%;
          right: auto;
          transform: translateX(-50%);
          flex-direction: column;
        }
        .carousel {
          position: relative;
          display: block;
        }
        .carousel:focus {
          outline: none;
        }
        .carousel:focus-visible {
          outline: 2px solid var(--ddd-theme-primary, currentColor);
          outline-offset: 2px;
        }
        .carousel-viewport {
          overflow: hidden;
          position: relative;
          height: auto;
          display: block;
        }
        .carousel-track {
          display: flex;
          flex-direction: row;
          transition: transform 0.5s ease-in-out;
          height: 100%;
          align-items: stretch;
        }
        @media (prefers-reduced-motion: reduce) {
          .carousel-track {
            transition: none;
          }
        }
        .carousel-item {
          flex: 0 0 100%;
          min-width: 100%;
          box-sizing: border-box;
          padding: var(--ddd-spacing-1, 8px);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 0;
        }
        .carousel-item .play-list-item {
          width: 100%;
          max-height: 100%;
        }
        .carousel-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          transform: translateY(-50%);
          pointer-events: none;
          z-index: 1;
        }
        .carousel-nav button,
        .carousel-nav simple-icon-button-lite {
          pointer-events: all;
        }
        .carousel-pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: var(--ddd-icon-4xs);
          padding: var(--ddd-spacing-1, 8px) 0;
          position: relative;
          z-index: 1;
        }
        .pagination-dot {
          width: var(--ddd-icon-xxs);
          height: var(--ddd-icon-xxs);
          border-radius: 50%;
          border: var(--ddd-border-sm, 1px solid transparent);
          background-color: light-dark(
            var(--ddd-theme-default-slateMaxLight, #cccccc),
            var(--ddd-theme-default-limestoneGray, #666666)
          );
          cursor: pointer;
          padding: 0;
          transition:
            background-color 0.25s ease-in-out,
            transform 0.25s ease-in-out;
        }
        .pagination-dot:hover,
        .pagination-dot:focus {
          background-color: var(--ddd-theme-primary, currentColor);
          transform: scale(1.2);
          outline: none;
        }
        .pagination-dot:focus-visible {
          outline: 2px solid var(--ddd-theme-primary, currentColor);
          outline-offset: 2px;
        }
        .pagination-dot[aria-selected="true"] {
          background-color: var(--ddd-theme-primary, currentColor);
          transform: scale(1.2);
        }
        .carousel-nav simple-icon-button-lite {
          color: light-dark(
            var(--ddd-theme-default-slateGray, #999999),
            var(--ddd-theme-default-limestoneGray, #666666)
          );
          --simple-icon-width: var(--ddd-icon-2xl);
          --simple-icon-height: var(--ddd-icon-2xl);
          height: var(--ddd-icon-2xl);
          width: var(--ddd-icon-2xl);
          transition: color 0.25s ease-in-out;
          --simple-icon-button-focus-background-color: transparent;
          --simple-icon-button-toggled-background-color: transparent;
          background-color: transparent;
        }
        .carousel-nav simple-icon-button-lite:hover,
        .carousel-nav simple-icon-button-lite:focus {
          color: var(--ddd-theme-primary, currentColor);
          outline: none;
          background-color: transparent;
        }

        /** edit mode, hax, etc */
        :host([edit]) .edit-wrapper {
          border: 2px dashed
            light-dark(
              var(--ddd-theme-default-slateGray, #999999),
              var(--ddd-theme-default-limestoneGray, #666666)
            );
          box-sizing: border-box;
          padding: var(--ddd-spacing-2, 16px);
          background-color: light-dark(
            var(--ddd-theme-default-slateMaxLight, #f5f5f5),
            var(--ddd-theme-default-navy, #1a1a1a)
          );
        }
        :host([edit]) .edit-wrapper::before {
          content: "Play list edit mode";
          display: block;
          font-size: var(--ddd-font-size-xs, 16px);
          color: light-dark(
            var(--ddd-theme-default-navy, #333333),
            var(--ddd-theme-default-slateMaxLight, #f5f5f5)
          );
        }
        :host([edit]) .edit-wrapper ::slotted(*) {
          display: block;
          width: 100%;
          padding: var(--ddd-spacing-2, 16px);
        }
      `,
    ];
  }
  /**
   * LitElement render callback
   */
  render() {
    return html`
      ${this.items && this.items.length > 0 && !this.edit
        ? html`
            <div
              class="carousel"
              role="region"
              aria-roledescription="carousel"
              aria-label="Playlist"
              tabindex="0"
              @keydown="${this._handleKeydown}"
              @touchstart="${this._handleTouchStart}"
              @touchmove="${this._handleTouchMove}"
              @touchend="${this._handleTouchEnd}"
            >
              <div
                class="carousel-viewport"
                style="--aspect-ratio: ${this.aspectRatio};"
              >
                <div
                  class="carousel-track ${this.orientation === "vertical"
                    ? "vertical"
                    : ""}"
                  style="transform: ${this._getTransform()};"
                >
                  ${this.items.map(
                    (item, index) => html`
                      <play-list-slide
                        class="carousel-item"
                        role="group"
                        aria-roledescription="slide"
                        aria-label="Slide ${index + 1} of ${this.items.length}"
                        ?active="${index === this.slide}"
                      >
                        ${this.renderHAXItem(item)}
                      </play-list-slide>
                    `,
                  )}
                </div>
              </div>
              ${this.navigation && this.orientation === "horizontal"
                ? html`
                    <div class="carousel-nav">
                      <simple-icon-button-lite
                        icon="hardware:keyboard-arrow-left"
                        label="Previous slide"
                        title="Previous slide"
                        @click="${this._goToPrevious}"
                      ></simple-icon-button-lite>
                      <simple-icon-button-lite
                        icon="hardware:keyboard-arrow-right"
                        label="Next slide"
                        title="Next slide"
                        @click="${this._goToNext}"
                      ></simple-icon-button-lite>
                    </div>
                  `
                : nothing}
              ${this.pagination
                ? html`
                    <div
                      class="carousel-pagination"
                      role="tablist"
                      aria-label="Slide pages"
                    >
                      ${this.items.map(
                        (item, index) => html`
                          <button
                            class="pagination-dot"
                            role="tab"
                            aria-label="Go to slide ${index + 1}"
                            title="${this._getSlideTitle(item, index)}"
                            aria-selected="${index === this.slide}"
                            tabindex="0"
                            @click="${() => this._goToSlide(index)}"
                          ></button>
                        `,
                      )}
                    </div>
                  `
                : nothing}
            </div>
          `
        : html`<div class="edit-wrapper"><slot></slot></div>`}
    `;
  }

  _getTransform() {
    if (this.orientation === "vertical") {
      return `translateY(-${this.slide * 100}%)`;
    }
    return `translateX(-${this.slide * 100}%)`;
  }

  _goToSlide(index) {
    if (index < 0) {
      index = this.loop ? this.items.length - 1 : 0;
    } else if (index >= this.items.length) {
      index = this.loop ? 0 : this.items.length - 1;
    }
    if (index !== this.slide) {
      this.slide = index;
    }
  }

  _goToPrevious() {
    this._goToSlide(this.slide - 1);
  }

  _goToNext() {
    this._goToSlide(this.slide + 1);
  }

  _handleKeydown(e) {
    if (this.orientation === "horizontal") {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        this._goToPrevious();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        this._goToNext();
      }
    } else {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        this._goToPrevious();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        this._goToNext();
      }
    }
  }

  _handleTouchStart(e) {
    this._isDragging = true;
    const touch = e.touches[0];
    this._touchStartX = touch.clientX;
    this._touchStartY = touch.clientY;
    this._touchCurrentX = touch.clientX;
    this._touchCurrentY = touch.clientY;
  }

  _handleTouchMove(e) {
    if (!this._isDragging) return;
    const touch = e.touches[0];
    this._touchCurrentX = touch.clientX;
    this._touchCurrentY = touch.clientY;
  }

  _handleTouchEnd(e) {
    if (!this._isDragging) return;
    this._isDragging = false;
    const deltaX = this._touchStartX - this._touchCurrentX;
    const deltaY = this._touchStartY - this._touchCurrentY;
    const threshold = 50;
    if (this.orientation === "horizontal") {
      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          this._goToNext();
        } else {
          this._goToPrevious();
        }
      }
    } else {
      if (Math.abs(deltaY) > threshold) {
        if (deltaY > 0) {
          this._goToNext();
        } else {
          this._goToPrevious();
        }
      }
    }
  }

  slideIndexChanged(e) {
    this.slide = e.detail.index;
  }
  /**
   * Convention we use
   */
  static get tag() {
    return "play-list";
  }
  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.mirrorLightDomToItems();
  }
  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      // implies we WERE in edit mode and now we are not
      if (propName === "edit" && !this[propName] && oldValue) {
        //this.mirrorLightDomToItems();
      }
      // sync slide index with changes in the carousel
      if (
        propName == "slide" &&
        this.shadowRoot &&
        typeof oldValue !== typeof undefined
      ) {
        this.dispatchEvent(
          new CustomEvent(`${propName}-changed`, {
            detail: {
              value: this[propName],
            },
          }),
        );
      }
    });
  }

  /**
   * Implements haxHooks to tie into life-cycle if hax exists.
   */
  haxHooks() {
    return {
      inlineContextMenu: "haxinlineContextMenu",
    };
  }

  haxClickSlideIndex(e) {
    copyToClipboard(this.slide);
    return true;
  }

  /**
   * add buttons when it is in context
   */
  haxinlineContextMenu(ceMenu) {
    ceMenu.ceButtons = [
      {
        icon: "icons:open-in-new",
        callback: "haxBreakOutPlaylist",
        label: "Break items out of playlist",
      },
      {
        icon: "lrn:edit",
        callback: "haxToggleEdit",
        label: "Toggle edit mode",
      },
      {
        icon: "hax:anchor",
        callback: "haxClickSlideIndex",
        label: "Copy slide index",
      },
    ];
  }
  haxToggleEdit(e) {
    this.edit = !this.edit;
    return true;
  }
  haxBreakOutPlaylist(e) {
    if (!this.parentNode) {
      return false;
    }
    let items = Array.from(this.children);
    if (items.length === 1 && items[0].tagName === "TEMPLATE") {
      items = Array.from(items[0].children);
    }
    if (items.length === 0 && this.items.length > 0) {
      items = this.items.map((item) => haxElementToNode(item));
    }
    let cloneEl;
    items.forEach((item) => {
      if (item && item.tagName) {
        cloneEl = item.cloneNode(true);
        if (this.getAttribute("slot")) {
          cloneEl.setAttribute("slot", this.getAttribute("slot"));
        } else {
          cloneEl.removeAttribute("slot");
        }
        this.parentNode.insertBefore(cloneEl, this);
      }
    });
    if (cloneEl) {
      this.remove();
      return true;
    }
    return false;
  }
}
globalThis.customElements.define(PlayList.tag, PlayList);
export { PlayList };
