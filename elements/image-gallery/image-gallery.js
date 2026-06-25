/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";

/**
 * `image-gallery`
 * `An image gallery that accepts media-image and img tags in light DOM and presents them in grid, masonry, or gallery layouts.`
 * @demo index.html
 * @element image-gallery
 */
export class ImageGallery extends I18NMixin(DDD) {
  static get tag() {
    return "image-gallery";
  }

  constructor() {
    super();
    this.edit = false;
    this.activeIndex = 0;
    this.mode = "masonry";
    this.images = [];
    this._haxState = false;
    this._newImageElement = null;
    this._newImageTransitionName = null;
    this.t = this.t || {};
    this.t = {
      ...this.t,
      gallery: "Gallery",
      previous: "Previous",
      next: "Next",
      editModeLabel: "Image gallery edit mode",
      openImage: "Open image",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/image-gallery.ar.json", import.meta.url).href +
        "/../",
    });
    this._observer = new MutationObserver(() => {
      clearTimeout(this._debounceMutations);
      this._debounceMutations = setTimeout(() => {
        this._updateImages();
      }, 100);
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this._observer.observe(this, {
      childList: true,
      attributes: true,
      subtree: true,
      attributeFilter: ["src", "alt", "source"],
    });
    this.addEventListener("keydown", this._handleKeydown);
    this.addEventListener("drop", this._onDrop, true);
  }

  disconnectedCallback() {
    this._observer.disconnect();
    this.removeEventListener("keydown", this._handleKeydown);
    this.removeEventListener("drop", this._onDrop, true);
    super.disconnectedCallback();
  }

  static get properties() {
    return {
      ...super.properties,
      edit: { type: Boolean, reflect: true },
      mode: { type: String, reflect: true },
      activeIndex: { type: Number, reflect: true, attribute: "active-index" },
      images: { type: Array },
      _haxState: { type: Boolean },
    };
  }

  setActiveIndex(index) {
    this._setActiveIndex(index);
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          font-family: var(--ddd-font-navigation);
        }

        /* Edit mode */
        .edit-wrapper {
          border: var(--ddd-border-md);
          border-style: dashed;
          padding: var(--ddd-spacing-4);
          background-color: var(--ddd-theme-default-limestoneLight);
          box-sizing: border-box;
        }
        .edit-wrapper ::slotted(*) {
          display: block;
          width: 100%;
          margin-bottom: var(--ddd-spacing-2);
        }

        /* Grid mode */
        .grid-layout {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: var(--ddd-spacing-2);
        }

        .grid-item {
          position: relative;
          cursor: pointer;
          overflow: hidden;
          border-radius: var(--ddd-radius-sm);
          background-color: var(--ddd-theme-default-limestoneLight);
          aspect-ratio: 1;
          border: none;
          padding: 0;
        }

        .grid-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--ddd-duration-normal)
            var(--ddd-timing-ease);
        }

        .grid-item:hover img,
        .grid-item:focus img {
          transform: scale(1.05);
        }

        .grid-item:focus {
          outline: var(--ddd-border-lg);
          outline-color: var(--ddd-theme-primary);
          outline-offset: var(--ddd-spacing-1);
        }

        /* Masonry mode */
        .masonry-layout {
          column-count: 3;
          column-gap: var(--ddd-spacing-2);
        }

        @media (max-width: 900px) {
          .masonry-layout {
            column-count: 2;
          }
        }

        @media (max-width: 600px) {
          .masonry-layout {
            column-count: 1;
          }
        }

        .masonry-item {
          break-inside: avoid;
          margin-bottom: var(--ddd-spacing-2);
          border-radius: var(--ddd-radius-sm);
          overflow: hidden;
          background-color: var(--ddd-theme-default-limestoneLight);
          cursor: pointer;
          border: none;
          padding: 0;
          display: block;
          width: 100%;
        }

        .masonry-item img {
          width: 100%;
          display: block;
          transition: transform var(--ddd-duration-normal)
            var(--ddd-timing-ease);
        }

        .masonry-item:hover img,
        .masonry-item:focus img {
          transform: scale(1.05);
        }

        .masonry-item:focus {
          outline: var(--ddd-border-lg);
          outline-color: var(--ddd-theme-primary);
          outline-offset: var(--ddd-spacing-1);
        }

        /* Gallery mode */
        .gallery-layout {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-2);
          background: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          border-radius: var(--ddd-radius-sm);
          overflow: hidden;
          padding: var(--ddd-spacing-2);
        }

        .gallery-main {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-black)
          );
          min-height: 300px;
          border-radius: var(--ddd-radius-sm);
          overflow: hidden;
        }

        .gallery-main img {
          max-width: 100%;
          max-height: 60vh;
          object-fit: contain;
          display: block;
        }

        .gallery-caption {
          color: light-dark(
            var(--ddd-theme-default-black),
            var(--ddd-theme-default-white)
          );
          font-size: var(--ddd-font-size-s);
          font-family: var(--ddd-font-primary);
          text-align: center;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-4);
          min-height: var(--ddd-spacing-6);
        }

        .gallery-nav-wrap {
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
          padding: 0 var(--ddd-spacing-2);
        }

        .gallery-nav-wrap simple-icon-button-lite {
          pointer-events: all;
          color: var(--ddd-theme-primary);
          --simple-icon-width: var(--ddd-icon-2xl);
          --simple-icon-height: var(--ddd-icon-2xl);
          height: var(--ddd-icon-2xl);
          width: var(--ddd-icon-2xl);
        }

        .gallery-thumbnails {
          display: flex;
          gap: var(--ddd-spacing-1);
          overflow-x: auto;
          padding: var(--ddd-spacing-1) 0;
          scrollbar-width: thin;
        }

        .gallery-thumbnail {
          flex: 0 0 auto;
          width: var(--ddd-icon-xl);
          height: var(--ddd-icon-xl);
          border: var(--ddd-border-sm);
          border-color: transparent;
          border-radius: var(--ddd-radius-sm);
          overflow: hidden;
          cursor: pointer;
          background: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-coalyGray)
          );
          transition: border-color var(--ddd-duration-fast)
            var(--ddd-timing-ease);
          padding: 0;
        }

        .gallery-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          pointer-events: none;
        }

        .gallery-thumbnail:hover,
        .gallery-thumbnail:focus {
          border-color: var(--ddd-theme-primary);
        }

        .gallery-thumbnail.active {
          border-color: var(--ddd-theme-primary);
        }

        .gallery-thumbnail:focus {
          outline: var(--ddd-border-lg);
          outline-color: var(--ddd-theme-primary);
          outline-offset: var(--ddd-spacing-1);
        }

        .slot-hidden {
          display: none;
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .grid-item img,
          .masonry-item img {
            transition: none;
          }
          .gallery-nav-wrap,
          .gallery-thumbnail {
            transition: none;
          }
        }

        /* Dark mode */
        @media (prefers-color-scheme: dark) {
          .edit-wrapper {
            background-color: var(--ddd-theme-default-coalyGray);
          }
          .grid-item {
            background-color: var(--ddd-theme-default-coalyGray);
          }
          .masonry-item {
            background-color: var(--ddd-theme-default-coalyGray);
          }
        }
      `,
    ];
  }

  render() {
    if (this.edit) {
      return html`
        <div class="edit-wrapper" aria-label="${this.t.editModeLabel}">
          <slot></slot>
        </div>
      `;
    }
    switch (this.mode) {
      case "masonry":
        return this._renderMasonry();
      case "gallery":
        return this._renderGallery();
      case "grid":
      default:
        return this._renderGrid();
    }
  }
  _renderGrid() {
    return html`
      <div class="grid-layout">
        ${this.images.map(
          (image, index) => html`
            <button
              class="grid-item"
              style="${image.element === this._newImageElement ? `view-transition-name: ${this._newImageTransitionName};` : ""}"
              aria-label="${this.t.openImage}: ${image.alt || ""}"
              title="${this.t.openImage}: ${image.alt || ""}"
              @click="${(e) => this._handleImageClick(e, image, index)}"
              @dblclick="${() => this._handleDblClick(index)}"
              @keydown="${(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  this._handleImageClick(e, image, index);
                }
              }}"
            >
              <img src="${image.src}" alt="${image.alt}" loading="lazy" />
            </button>
          `,
        )}
      </div>
      <div class="slot-hidden"><slot></slot></div>
    `;
  }
  _renderMasonry() {
    return html`
      <div class="masonry-layout">
        ${this.images.map(
          (image, index) => html`
            <button
              class="masonry-item"
              style="${image.element === this._newImageElement ? `view-transition-name: ${this._newImageTransitionName};` : ""}"
              aria-label="${this.t.openImage}: ${image.alt || ""}"
              title="${this.t.openImage}: ${image.alt || ""}"
              @click="${(e) => this._handleImageClick(e, image, index)}"
              @dblclick="${() => this._handleDblClick(index)}"
            >
              <img src="${image.src}" alt="${image.alt}" loading="lazy" />
            </button>
          `,
        )}
      </div>
      <div class="slot-hidden"><slot></slot></div>
    `;
  }

  _renderGallery() {
    const activeImage = this.images[this.activeIndex];
    return html`
      <div class="gallery-layout">
        <div class="gallery-main">
          ${activeImage
            ? html`
                <div class="gallery-nav-wrap">
                  <simple-icon-button-lite
                    id="prev-btn"
                    icon="hardware:keyboard-arrow-left"
                    label="${this.t.previous}"
                    title="${this.t.previous}"
                    ?disabled="${this.activeIndex === 0}"
                    @click="${() => this._setActiveIndex(this.activeIndex - 1)}"
                  ></simple-icon-button-lite>
                  <simple-icon-button-lite
                    id="next-btn"
                    icon="hardware:keyboard-arrow-right"
                    label="${this.t.next}"
                    title="${this.t.next}"
                    ?disabled="${this.activeIndex === this.images.length - 1}"
                    @click="${() => this._setActiveIndex(this.activeIndex + 1)}"
                  ></simple-icon-button-lite>
                </div>
                <img
                  src="${activeImage.src}"
                  alt="${activeImage.alt}"
                  @dblclick="${() => this._handleDblClick(this.activeIndex)}"
                />
              `
            : html``}
        </div>
        ${activeImage && activeImage.alt
          ? html` <div class="gallery-caption">${activeImage.alt}</div> `
          : html``}
        <div
          class="gallery-thumbnails"
          role="tablist"
          aria-label="${this.t.gallery}"
        >
          ${this.images.map(
            (image, index) => html`
              <button
                class="gallery-thumbnail ${index === this.activeIndex
                  ? "active"
                  : ""}"
                style="${image.element === this._newImageElement ? `view-transition-name: ${this._newImageTransitionName};` : ""}"
                role="tab"
                aria-selected="${index === this.activeIndex ? "true" : "false"}"
                aria-label="${image.alt || ""}"
                title="${image.alt || ""}"
                @click="${(e) => this._handleThumbnailClick(e, index)}"
                @dblclick="${() => this._handleDblClick(index)}"
              >
                <img src="${image.src}" alt="" loading="lazy" />
              </button>
            `,
          )}
        </div>
      </div>
      <div class="slot-hidden"><slot></slot></div>
    `;
  }

  _updateImages() {
    const items = Array.from(this.children).filter(
      (el) => el.tagName === "MEDIA-IMAGE" || el.tagName === "IMG",
    );
    if (this.activeIndex >= items.length) {
      this.activeIndex = 0;
    }
    this.images = items.map((el) => {
      let src = "";
      let alt = "";
      if (el.tagName === "MEDIA-IMAGE") {
        src = el.source || el.getAttribute("source") || "";
        alt = el.alt || el.getAttribute("alt") || "";
      } else if (el.tagName === "IMG") {
        src = el.getAttribute("src") || el.src || "";
        alt = el.getAttribute("alt") || el.alt || "";
      }
      return {
        element: el,
        tagName: el.tagName,
        src: src,
        alt: alt,
      };
    });
  }

  _setActiveIndex(index) {
    if (this.images.length === 0) {
      this.activeIndex = 0;
      return;
    }
    const clamped = Math.max(0, Math.min(index, this.images.length - 1));
    this.activeIndex = clamped;
  }

  _openModal(image) {
    const wrapper = globalThis.document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.justifyContent = "center";
    wrapper.style.width = "100%";
    wrapper.style.height = "100%";
    wrapper.style.overflow = "hidden";

    const img = globalThis.document.createElement("img");
    img.src = image.src;
    img.alt = image.alt || "";
    img.style.maxWidth = "100%";
    img.style.maxHeight = "100%";
    img.style.objectFit = "contain";
    img.style.display = "block";

    wrapper.appendChild(img);
    const evt = new CustomEvent("simple-modal-show", {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {
        title: image.alt || "",
        elements: {
          content: wrapper,
        },
        styles: {
          "--simple-modal-width": "80vw",
          "--simple-modal-height": "80vh",
          "--simple-modal-min-width": "50vw",
          "--simple-modal-min-height": "50vh",
          "--simple-modal-content-padding": "0px",
        },
        invokedBy: this,
        clone: false,
      },
    });
    this.dispatchEvent(evt);
  }

  _handleImageClick(e, image, index) {
    this._setActiveIndex(index);
    if (!this._haxState) {
      this._openModal(image);
    }
  }

  _handleThumbnailClick(e, index) {
    this._setActiveIndex(index);
  }

  _handleKeydown(e) {
    if (this.mode !== "gallery" || this.edit) {
      return;
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      this._setActiveIndex(this.activeIndex - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      this._setActiveIndex(this.activeIndex + 1);
    }
  }

  _getHaxStore() {
    if (globalThis.HaxStore && globalThis.HaxStore.requestAvailability) {
      try {
        return globalThis.HaxStore.requestAvailability();
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  _onDrop(e) {
    if (!this._haxState) return;
    const store = this._getHaxStore();
    if (!store || !store.__dragTarget) return;
    const target = store.__dragTarget;
    const tag = target.tagName;
    if (tag !== "MEDIA-IMAGE" && tag !== "IMG") {
      e.stopPropagation();
      e.stopImmediatePropagation();
      e.preventDefault();
      store.__dragTarget = null;
      return;
    }
    if (!this.contains(target)) {
      this._newImageElement = target;
      this._newImageTransitionName = `gallery-drop-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const doAppend = () => {
        this.appendChild(target);
        this._updateImages();
      };
      const prefersReducedMotion =
        globalThis.matchMedia &&
        globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (
        !prefersReducedMotion &&
        globalThis.document &&
        globalThis.document.startViewTransition
      ) {
        const transition = globalThis.document.startViewTransition(() => {
          doAppend();
        });
        transition.finished
          .then(() => {
            this._newImageElement = null;
            this._newImageTransitionName = null;
            this.requestUpdate();
          })
          .catch(() => {
            this._newImageElement = null;
            this._newImageTransitionName = null;
            this.requestUpdate();
          });
      } else {
        doAppend();
        this._newImageElement = null;
        this._newImageTransitionName = null;
      }
    }
    e.stopPropagation();
    e.stopImmediatePropagation();
    e.preventDefault();
    store.__dragTarget = null;
  }

  async _handleDblClick(index) {
    this._setActiveIndex(index);
    const store = this._getHaxStore();
    if (
      this._haxState &&
      store &&
      this.images[index] &&
      this.images[index].element
    ) {
      store.activeNode = this.images[index].element;
    }
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "edit") {
        if (!this.edit && oldValue === true) {
          this._updateImages();
        }
      }
    });
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this._updateImages();
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }

  /**
   * Implements haxHooks to tie into life-cycle if hax exists.
   */
  haxHooks() {
    return {
      inlineContextMenu: "haxinlineContextMenu",
      editModeChanged: "haxeditModeChanged",
      activeElementChanged: "haxactiveElementChanged",
      preProcessNodeToContent: "haxpreProcessNodeToContent",
    };
  }

  haxeditModeChanged(value) {
    this._haxState = value;
    const children = Array.from(this.children).filter(
      (el) => el.tagName === "MEDIA-IMAGE" || el.tagName === "IMG",
    );
    children.forEach((child) => {
      if (
        child.haxeditModeChanged &&
        typeof child.haxeditModeChanged === "function"
      ) {
        child.haxeditModeChanged(value);
      }
    });
  }

  haxactiveElementChanged(element, value) {
    if (value) {
      this._haxState = value;
    }
  }

  haxpreProcessNodeToContent(node) {
    if (
      node &&
      node.tagName &&
      node.tagName.toLowerCase() === "image-gallery"
    ) {
      const clone = node.cloneNode(true);
      clone.removeAttribute("edit");
      return clone;
    }
    return node;
  }

  haxinlineContextMenu(ceMenu) {
    ceMenu.ceButtons = [
      {
        icon: "icons:open-in-new",
        callback: "haxBreakOutGallery",
        label: "Break items out of gallery",
      },
      {
        icon: "lrn:edit",
        callback: "haxToggleEdit",
        label: "Toggle edit mode",
      },
      {
        icon: "image:photo-camera",
        callback: "haxAddImage",
        label: "Add image",
      },
      {
        icon: "icons:delete",
        callback: "haxRemoveLastImage",
        label: "Remove last image",
      },
    ];
  }

  haxToggleEdit(e) {
    this.edit = !this.edit;
    return true;
  }

  haxAddImage(e) {
    const img = globalThis.document.createElement("media-image");
    img.setAttribute("source", "https://dummyimage.com/300x200/000/fff");
    img.setAttribute("alt", "New image");
    this.appendChild(img);
    return true;
  }

  haxRemoveLastImage(e) {
    const items = Array.from(this.children).filter(
      (el) => el.tagName === "MEDIA-IMAGE" || el.tagName === "IMG",
    );
    if (items.length > 0) {
      items[items.length - 1].remove();
    }
    return true;
  }

  haxBreakOutGallery(e) {
    if (!this.parentNode) {
      return false;
    }
    const items = Array.from(this.children).filter(
      (el) => el.tagName === "MEDIA-IMAGE" || el.tagName === "IMG",
    );
    let cloneEl;
    items.forEach((item) => {
      cloneEl = item.cloneNode(true);
      if (this.getAttribute("slot")) {
        cloneEl.setAttribute("slot", this.getAttribute("slot"));
      } else {
        cloneEl.removeAttribute("slot");
      }
      this.parentNode.insertBefore(cloneEl, this);
    });
    if (cloneEl) {
      this.remove();
      return true;
    }
    return false;
  }
}

globalThis.customElements.define(ImageGallery.tag, ImageGallery);
