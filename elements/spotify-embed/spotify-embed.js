/**
 * Copyright 2023 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
/**
 * `spotify-embed`
 * `embed spotify playlists`
 * @demo demo/index.html
 * @element spotify-embed
 */
class SpotifyEmbed extends LitElement {
  /**
   * HTMLElement
   */
  constructor() {
    super();
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
      <div class="container">
        <iframe
          src="https://open.spotify.com/embed/${this.type}/${this
            .playlistid}?utm_source=generator${this.theme
            ? `&theme=${this.theme}`
            : ""}"
          title="Spotify Embed"
          height="${this.size == "normal" ? "352" : "152"}"
          style="border-radius:12px"
          width="100%"
          part="iframe"
          frameborder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          decoding="async"
          fetchpriority="low"
        ></iframe>
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
  haxactiveElementChanged(el, val) {
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
customElements.define(SpotifyEmbed.tag, SpotifyEmbed);
export { SpotifyEmbed };
