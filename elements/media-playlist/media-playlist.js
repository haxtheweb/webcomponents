/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { copyToClipboard } from "@haxtheweb/utils/utils.js";

/**
 * `media-playlist`
 * `A playlist that accepts video-player and audio-player in light DOM and presents them in a player + sidebar layout.`
 * @demo index.html
 * @element media-playlist
 */
export class MediaPlaylist extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "media-playlist";
  }

  constructor() {
    super();
    this.edit = false;
    this.activeIndex = 0;
    this.aspectRatio = "16:9";
    this.mediaItems = [];
    this.t = this.t || {};
    this.t = {
      ...this.t,
      playlist: "Playlist",
      play: "Play",
      item: "Item",
      editModeLabel: "Media playlist edit mode",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/media-playlist.ar.json", import.meta.url).href +
        "/../",
    });
    this._observer = new MutationObserver(() => {
      clearTimeout(this._debounceMutations);
      this._debounceMutations = setTimeout(() => {
        this._updateMediaItems();
      }, 100);
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this._observer.observe(this, {
      childList: true,
      subtree: false,
    });
    this.addEventListener("keydown", this._handleKeydown);
    this._darkModeQuery = globalThis.matchMedia(
      "(prefers-color-scheme: dark)",
    );
    this._darkModeHandler = (e) => {
      this._setDarkMode(e.matches);
    };
    this._darkModeQuery.addEventListener("change", this._darkModeHandler);
    this._setDarkMode(this._darkModeQuery.matches);
  }

  disconnectedCallback() {
    this._observer.disconnect();
    this.removeEventListener("keydown", this._handleKeydown);
    if (this._darkModeQuery && this._darkModeHandler) {
      this._darkModeQuery.removeEventListener(
        "change",
        this._darkModeHandler,
      );
    }
    super.disconnectedCallback();
  }

  _setDarkMode(isDark) {
    this.mediaItems.forEach((item) => {
      item.element.toggleAttribute("dark", isDark);
    });
  }

  static get properties() {
    return {
      ...super.properties,
      edit: { type: Boolean, reflect: true },
      activeIndex: { type: Number, reflect: true, attribute: "active-index" },
      aspectRatio: { type: String, reflect: true, attribute: "aspect-ratio" },
      mediaItems: { type: Array },
    };
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

        /* Runtime layout */
        .layout {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: var(--ddd-spacing-2);
          background: var(--ddd-theme-default-black);
          border-radius: var(--ddd-radius-sm);
          overflow: hidden;
        }

        .player-area {
          position: relative;
          background: var(--ddd-theme-default-black);
          width: 100%;
          aspect-ratio: var(--media-playlist-aspect-ratio, 16 / 9);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .player-area ::slotted(*) {
          width: 100%;
          height: 100%;
          display: block;
        }

        /* Hide the default slot that catches non-active children */
        .slot-hidden {
          display: none;
        }

        .playlist {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-1);
          overflow-y: auto;
          max-height: 100%;
          padding: var(--ddd-spacing-2);
          background: var(--ddd-theme-default-coalyGray);
        }

        .playlist-header {
          font-size: var(--ddd-font-size-s);
          font-weight: var(--ddd-font-weight-bold);
          color: var(--ddd-theme-default-white);
          padding: var(--ddd-spacing-2);
          margin: var(--ddd-spacing-0);
        }

        .playlist-item {
          display: grid;
          grid-template-columns: var(--ddd-spacing-4) 80px 1fr;
          gap: var(--ddd-spacing-2);
          align-items: center;
          padding: var(--ddd-spacing-2);
          background: var(--ddd-theme-default-white);
          border-radius: var(--ddd-radius-sm);
          cursor: pointer;
          text-align: left;
          transition: background-color 0.1s ease;
        }

        .playlist-item:hover {
          background: var(--ddd-theme-default-limestoneLight);
        }

        .playlist-item.active {
          background: var(--ddd-theme-default-limestoneMaxLight);
          border-left: var(--ddd-spacing-1) solid var(--ddd-theme-default-link);
        }

        .playlist-number {
          font-size: var(--ddd-font-size-xs);
          color: var(--ddd-theme-default-coalyGray);
          text-align: center;
        }

        .playlist-thumbnail {
          width: 80px;
          height: 45px;
          object-fit: cover;
          border-radius: var(--ddd-radius-xs);
          background: var(--ddd-theme-default-shade);
        }

        .playlist-info {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-0);
          overflow: hidden;
        }

        .playlist-title {
          font-size: var(--ddd-font-size-xs);
          font-weight: var(--ddd-font-weight-bold);
          color: var(--ddd-theme-default-coalyGray);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .playlist-duration {
          font-size: var(--ddd-font-size-4xs);
          color: var(--ddd-theme-default-shade);
        }

        /* Dark mode */
        @media (prefers-color-scheme: dark) {
          .playlist {
            background: var(--ddd-theme-default-black);
          }

          .playlist-header {
            color: var(--ddd-theme-default-white);
          }

          .playlist-item {
            background: var(--ddd-theme-default-coalyGray);
          }

          .playlist-item:hover {
            background: var(--ddd-theme-default-shade);
          }

          .playlist-item.active {
            background: var(--ddd-theme-default-limestoneGray);
          }

          .playlist-title {
            color: var(--ddd-theme-default-white);
          }

          .playlist-number {
            color: var(--ddd-theme-default-limestoneLight);
          }
        }

        /* Mobile */
        @media (max-width: 768px) {
          .layout {
            grid-template-columns: 1fr;
            grid-template-rows: auto 300px;
          }
          .playlist {
            max-height: 300px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .playlist-item {
            transition: none;
          }
        }
      `,
    ];
  }

  render() {
    if (this.edit) {
      return html`
        <div class="edit-wrapper">
          <slot></slot>
        </div>
      `;
    }
    return html`
      <div class="layout" style="--media-playlist-aspect-ratio: ${this.aspectRatio.replace(':', ' / ')}">
        <div class="player-area">
          <slot name="active"></slot>
        </div>
        <div
          class="playlist"
          role="list"
          aria-label="${this.t.playlist}"
        >
          <h3 class="playlist-header">${this.t.playlist}</h3>
          ${this.mediaItems.map(
            (item, index) => html`
              <button
                class="playlist-item ${index === this.activeIndex
                  ? "active"
                  : ""}"
                role="listitem"
                @click="${() => this._setActiveIndex(index)}"
                aria-current="${index === this.activeIndex ? "true" : "false"}"
                aria-label="${this.t.play} ${item.title}, ${item.duration}"
                data-index="${index}"
              >
                <span class="playlist-number">${index + 1}</span>
                ${item.thumbnailSrc
                  ? html`
                      <img
                        class="playlist-thumbnail"
                        src="${item.thumbnailSrc}"
                        alt=""
                        loading="lazy"
                      />
                    `
                  : html` <div class="playlist-thumbnail"></div> `}
                <div class="playlist-info">
                  <span class="playlist-title">${item.title}</span>
                  <span class="playlist-duration">${item.duration}</span>
                </div>
              </button>
            `,
          )}
        </div>
      </div>
      <div class="slot-hidden"><slot></slot></div>
    `;
  }

  _updateMediaItems() {
    const items = Array.from(this.children).filter(
      (el) => el.tagName === "VIDEO-PLAYER" || el.tagName === "AUDIO-PLAYER",
    );
    if (this.activeIndex >= items.length) {
      this.activeIndex = 0;
    }
    this.mediaItems = items.map((el, index) => ({
      element: el,
      title: el.getAttribute("media-title") || `${this.t.item} ${index + 1}`,
      thumbnailSrc: el.getAttribute("thumbnail-src") || "",
      duration: el.getAttribute("duration") || "",
      tagName: el.tagName,
    }));
    const isDark =
      this._darkModeQuery &&
      this._darkModeQuery.matches;
    this.mediaItems.forEach((item) => {
      item.element.toggleAttribute("dark", isDark);
    });
    this._syncActiveSlot();
  }

  _syncActiveSlot() {
    if (this.edit) return;
    this.mediaItems.forEach((item, index) => {
      if (index === this.activeIndex) {
        item.element.setAttribute("slot", "active");
      } else {
        item.element.removeAttribute("slot");
      }
    });
  }

  _setActiveIndex(index) {
    if (
      index === this.activeIndex ||
      index < 0 ||
      index >= this.mediaItems.length
    ) {
      return;
    }
    const oldIndex = this.activeIndex;
    if (
      this.mediaItems[oldIndex] &&
      this.mediaItems[oldIndex].element
    ) {
      const oldPlayer = this.mediaItems[oldIndex].element;
      if (oldPlayer.pause && typeof oldPlayer.pause === "function") {
        oldPlayer.pause();
      }
    }
    this.activeIndex = index;
    this._syncActiveSlot();
  }

  _handleKeydown(e) {
    const playlist = this.shadowRoot.querySelector(".playlist");
    if (!playlist || !playlist.contains(e.target)) {
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.min(
        this.activeIndex + 1,
        this.mediaItems.length - 1,
      );
      this._setActiveIndex(next);
      this._focusPlaylistItem(next);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = Math.max(this.activeIndex - 1, 0);
      this._setActiveIndex(prev);
      this._focusPlaylistItem(prev);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const target = e.composedPath().find(
        (el) => el.classList && el.classList.contains("playlist-item"),
      );
      if (target) {
        const index = parseInt(target.getAttribute("data-index"));
        this._setActiveIndex(index);
      }
    }
  }

  _focusPlaylistItem(index) {
    const item = this.shadowRoot.querySelector(
      `.playlist-item[data-index="${index}"]`,
    );
    if (item) {
      item.focus();
    }
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
    if (propName === "edit") {
        if (this.edit) {
          this.mediaItems.forEach((item) => {
            item.element.removeAttribute("slot");
          });
        } else {
          this._syncActiveSlot();
        }
      }
      if (
        propName === "activeIndex" &&
        typeof oldValue !== "undefined" &&
        this.mediaItems[this.activeIndex]
      ) {
        const newPlayer = this.mediaItems[this.activeIndex].element;
        if (newPlayer.play && typeof newPlayer.play === "function") {
          setTimeout(() => {
            newPlayer.play();
          }, 0);
        }
      }
    });
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this._updateMediaItems();
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
    };
  }

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
        icon: "av:video-call",
        callback: "haxAddVideo",
        label: "Add video",
      },
      {
        icon: "av:audiotrack",
        callback: "haxAddAudio",
        label: "Add audio",
      },
      {
        icon: "hax:anchor",
        callback: "haxCopyActiveIndex",
        label: "Copy active index",
      },
    ];
  }

  haxToggleEdit(e) {
    this.edit = !this.edit;
    return true;
  }

  haxAddVideo(e) {
    const video = globalThis.document.createElement("video-player");
    video.setAttribute("source", "");
    video.setAttribute("media-title", "New video");
    this.appendChild(video);
    return true;
  }

  haxAddAudio(e) {
    const audio = globalThis.document.createElement("audio-player");
    audio.setAttribute("source", "");
    audio.setAttribute("media-title", "New audio");
    this.appendChild(audio);
    return true;
  }

  haxBreakOutPlaylist(e) {
    if (!this.parentNode) {
      return false;
    }
    const items = Array.from(this.children).filter(
      (el) =>
        el.tagName === "VIDEO-PLAYER" || el.tagName === "AUDIO-PLAYER",
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

  haxCopyActiveIndex(e) {
    copyToClipboard(this.activeIndex);
    return true;
  }
}

globalThis.customElements.define(MediaPlaylist.tag, MediaPlaylist);
