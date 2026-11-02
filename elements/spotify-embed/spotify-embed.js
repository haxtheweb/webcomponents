/**
 * Copyright 2023 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
/**
 * `spotify-embed`
 * `embed spotify playlists`
 * @demo demo/index.html
 * @element spotify-embed
 */
class SpotifyEmbed extends I18NMixin(LitElement) {
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.t = {
      audio: "Audio",
      openOnSpotify: "Open on Spotify in a new tab",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("./locales/", import.meta.url).href,
    });
    this.source = null;
    this.theme = null;
    this.size = "normal";
    this.playlistid = null;
    this.type = null;
    this.editing = false;
  }
  /**
   * LitElement properties
   */
  static get properties() {
    return {
      source: { type: String },
      theme: { type: String },
      size: { type: String },
      playlistid: { type: String, attribute: false },
      type: { type: String, attribute: false },
      editing: {
        type: Boolean,
        reflect: true,
      },
    };
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        /* labelled embed frame shared with the other DDD learning blocks */
        .frame {
          box-sizing: border-box;
          border: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          border-radius: var(--ddd-radius-md);
          overflow: hidden;
          font-family: var(--ddd-font-primary);
        }
        .frame-header {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-3);
          padding-block: var(--ddd-spacing-2);
          padding-inline: var(--ddd-spacing-4) var(--ddd-spacing-2);
          border-bottom: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
        }
        .frame-chip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: none;
          width: var(--ddd-icon-xs);
          height: var(--ddd-icon-xs);
          border-radius: var(--ddd-radius-circle);
          background-color: light-dark(
            var(--ddd-theme-default-beaverBlue),
            var(--ddd-theme-default-skyBlue)
          );
          color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          --simple-icon-width: var(--ddd-icon-3xs);
          --simple-icon-height: var(--ddd-icon-3xs);
        }
        .frame-label {
          flex: 1 1 auto;
          min-width: 0;
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-medium);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        :host(:lang(ar)) .frame-label,
        :host(:lang(fa)) .frame-label,
        :host(:lang(he)) .frame-label,
        :host(:lang(ur)) .frame-label {
          letter-spacing: 0;
        }
        .frame-open {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: none;
          width: var(--ddd-control-height-sm);
          height: var(--ddd-control-height-sm);
          border: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          border-radius: var(--ddd-radius-rounded);
          color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-linkLight)
          );
          --simple-icon-width: var(--ddd-icon-3xs);
          --simple-icon-height: var(--ddd-icon-3xs);
        }
        .frame-open:hover {
          border-color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-linkLight)
          );
        }
        .frame-open:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        .frame-body {
          display: block;
        }
        .frame-body {
          padding: var(--ddd-spacing-2);
        }
        .frame-body iframe {
          display: block;
          max-width: 100%;
        }
        :host([editing]) .container {
          z-index: 1;
        }
        :host([editing]) iframe {
          z-index: -1;
          pointer-events: none;
        }
      `,
    ];
  }
  /**
   * LitElement render callback
   */
  render() {
    return html`
      <div class="container frame">
        <div class="frame-header">
          <span class="frame-chip" aria-hidden="true"
            ><simple-icon-lite icon="av:library-music"></simple-icon-lite
          ></span>
          <span class="frame-label"
            >${this.t.audio} · ${this._embedTitle.replace(/ Embed$/, "")}</span
          >
          ${this.source
            ? html`<a
                class="frame-open"
                href="${this.source}"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="${this.t.openOnSpotify}"
                title="${this.t.openOnSpotify}"
                ><simple-icon-lite
                  icon="icons:open-in-new"
                  aria-hidden="true"
                ></simple-icon-lite
              ></a>`
            : ""}
        </div>
        <div class="frame-body">
          <iframe
            src="https://open.spotify.com/embed/${this.type}/${this
              .playlistid}?utm_source=generator${this.theme
              ? `&theme=${this.theme}`
              : ""}"
            title="${this._embedTitle}"
            height="${this.size == "normal" ? "352" : "152"}"
            style="border-radius:12px"
            width="100%"
            part="iframe"
            frameborder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            referrerpolicy="strict-origin-when-cross-origin"
            ?credentialless="${globalThis.crossOriginIsolated === true}"
            loading="lazy"
            decoding="async"
            fetchpriority="low"
          ></iframe>
        </div>
      </div>
    `;
  }
  /**
   * Convention we use
   */
  static get tag() {
    return "spotify-embed";
  }
  /**
   * Describes the embedded item so the iframe title matches its type
   */
  get _embedTitle() {
    const labels = {
      track: "Track",
      album: "Album",
      playlist: "Playlist",
      artist: "Artist",
    };
    const label = labels[this.type];
    return label ? `Spotify ${label} Embed` : "Spotify Embed";
  }
  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "source" && this[propName]) {
        let tmp = this[propName].split("/").pop().split("?")[0];
        this.playlistid = tmp;
        if (this[propName].includes("/album/")) {
          this.type = "album";
        } else if (this[propName].includes("/track/")) {
          this.type = "track";
        } else if (this[propName].includes("/playlist/")) {
          this.type = "playlist";
        } else if (this[propName].includes("/artist/")) {
          this.type = "artist";
        }
      }
    });
  }

  // Support being an editing interface element for HAX
  haxHooks() {
    return {
      preProcessNodeToContent: "haxpreProcessNodeToContent",
      editModeChanged: "haxeditModeChanged",
      activeElementChanged: "haxactiveElementChanged",
    };
  }
  // about to convert to content, ensure we are no longer the editable-table
  async haxpreProcessNodeToContent(node) {
    node.editing = false;
    return node;
  }
  // ALWAYS enable edit mode if HAX is around
  haxactiveElementChanged(el, _val) {
    this.editing = true;
    el.editing = true;
    return el;
  }
  // allow HAX to toggle edit state when activated
  haxeditModeChanged(val) {
    this.editing = val;
  }
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}
globalThis.customElements.define(SpotifyEmbed.tag, SpotifyEmbed);
export { SpotifyEmbed };
