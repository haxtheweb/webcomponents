/**
 * Copyright 2023
 * @license , see License.md for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import "@shoelace-style/shoelace/dist/components/carousel/carousel.js";
import "@shoelace-style/shoelace/dist/components/carousel-item/carousel-item.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import { generateStyleLinkEls } from "./lib/SLStyleManager.js";
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
class PlayList extends LitElement {
  /**
   * HTMLElement
   */
  constructor() {
    super();
    // handles SL styles link elements
    generateStyleLinkEls();
    this.items = [];
    this.loop = false;
    this.edit = false;
    this.navigation = false;
    this.pagination = false;
    this.aspectRatio = "16:9";
    this.slide = 0;
    this.orientation = "horizontal";
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
    if (item.properties.innerHTML) {
      delete item.properties.innerHTML;
    }
    return html`${unsafeHTML(haxElementToNode(item).outerHTML)}`;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }

  disconnectedCallback() {
    if (this._linkEls) {
      globalThis.document.head.removeChild(this._linkEls[0]);
      globalThis.document.head.removeChild(this._linkEls[1]);
    }
    super.disconnectedCallback();
  }

  static get properties() {
    return {
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
        :host([orientation="vertical"]),
        :host([orientation="vertical"]) .carousel,
        :host([orientation="vertical"]) .carousel .item {
          max-height: 400px;
        }
        :host([orientation="vertical"]) .carousel .item video-player {
          max-height: 400px;
          width: 500px;
        }

        :host .carousel .item .play-list-item {
          width: 100%;
          min-height: 400px;
        }
        :host([orientation="vertical"]) .carousel::part(base) {
          grid-template-areas: "slides slides pagination";
        }
        :host([orientation="vertical"]) .carousel::part(pagination) {
          flex-direction: column;
        }
        :host([orientation="vertical"]) .carousel::part(navigation) {
          transform: rotate(90deg);
          display: flex;
        }
        sl-carousel-item {
          max-height: 400px;
          padding: 8px;
          overflow-y: auto;
          justify-content: unset;
        }
        simple-icon-button-lite {
          color: var(--play-list-icon-color, #999999);
          --simple-icon-width: 72px;
          --simple-icon-height: 72px;
          height: 72px;
          width: 72px;
        }

        /** edit mode, hax, etc */
        :host([edit]) .edit-wrapper {
          border: 2px dashed #999999;
          box-sizing: border-box;
          padding: 16px;
          background-color: #f5f5f5;
        }
        :host([edit]) .edit-wrapper::before {
          content: "Play list edit mode";
          display: block;
          font-size: 16px;
        }
        :host([edit]) .edit-wrapper ::slotted(*) {
          display: block;
          width: 100%;
          padding: 16px;
        }
      `,
    ];
  }
  /**
   * LitElement render callback
   */
  render() {
    return html`
      ${this.items.length > 0 && !this.edit
        ? html`
            <sl-carousel
              ?navigation="${this.navigation &&
              this.orientation === "horizontal"}"
              ?pagination="${this.pagination}"
              ?loop="${this.loop}"
              orientation="${this.orientation}"
              @sl-slide-change="${this.slideIndexChanged}"
              class="carousel"
              style="--aspect-ratio: ${this.aspectRatio};"
            >
              <simple-icon-button-lite
                icon="hardware:keyboard-arrow-left"
                slot="previous-icon"
              ></simple-icon-button-lite>
              <simple-icon-button-lite
                icon="hardware:keyboard-arrow-right"
                slot="next-icon"
              ></simple-icon-button-lite>
              ${this.items.map(
                (item, index) => html`
                  <sl-carousel-item class="item">
                    ${this.renderHAXItem(item)}
                  </sl-carousel-item>
                `,
              )}
            </sl-carousel>
          `
        : html`<div class="edit-wrapper"><slot></slot></div>`}
    `;
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
        if (
          this.shadowRoot.querySelector(".carousel") &&
          this.shadowRoot.querySelector(".carousel").activeSlide !==
            this[propName]
        ) {
          // this.shadowRoot.querySelector('.carousel').goToSlide(parseInt(this[propName]));
        }
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
}
customElements.define(PlayList.tag, PlayList);
export { PlayList };
