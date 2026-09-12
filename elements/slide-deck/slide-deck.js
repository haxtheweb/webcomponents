/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";

/**
 * `slide-deck`
 * Presents a PPTX deck imported by HAXcms, from the deck.json manifest written
 * to `files/decks/<name>/`.
 *
 * Content is layered. The manifest's per slide text and speaker notes always
 * render and are what assistive technology and site search read. The original
 * .pptx is painted over that by a renderer which is only fetched once a deck is
 * on screen, so a deck costs nothing until it is looked at and still works when
 * the renderer cannot run.
 *
 * @demo demo/index.html
 * @element slide-deck
 */
export class SlideDeck extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "slide-deck";
  }

  constructor() {
    super();
    this.source = null;
    this.deckId = null;
    this.slide = 1;
    this.mode = "slide";
    this.presenting = false;
    this.deck = null;
    this.status = "idle";
    this.rendered = false;
    this.t = this.t || {};
    this.t = {
      ...this.t,
      previousSlide: "Previous slide",
      nextSlide: "Next slide",
      viewAllSlides: "View all slides",
      viewOneSlide: "View one slide at a time",
      presentFullScreen: "Present full screen",
      exitFullScreen: "Exit full screen",
      copyLinkToSlide: "Copy link to this slide",
      linkCopied: "Link copied",
      speakerNotes: "Speaker notes",
      loadingPresentation: "Loading presentation",
      presentationUnavailable: "Presentation unavailable",
      slide: "Slide",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/slide-deck.ar.json", import.meta.url).href + "/../",
    });
    this._onHashChange = this._onHashChange.bind(this);
    this._onFullscreenChange = this._onFullscreenChange.bind(this);
  }

  static get properties() {
    return {
      ...super.properties,
      /** URL of the deck.json manifest, relative to the page or absolute. */
      source: { type: String },
      /** Disambiguates deep links when a page holds more than one deck. */
      deckId: { type: String, attribute: "deck-id" },
      /** Currently displayed slide, 1 based. */
      slide: { type: Number, reflect: true },
      /** "slide" for one at a time, "grid" for every slide plus notes. */
      mode: { type: String, reflect: true },
      presenting: { type: Boolean, reflect: true },
      deck: { type: Object },
      status: { type: String, reflect: true },
      rendered: { type: Boolean },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    globalThis.addEventListener("hashchange", this._onHashChange);
    this.addEventListener("fullscreenchange", this._onFullscreenChange);
  }

  disconnectedCallback() {
    globalThis.removeEventListener("hashchange", this._onHashChange);
    this.removeEventListener("fullscreenchange", this._onFullscreenChange);
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
    if (this._renderer) {
      this._renderer.dispose();
      this._renderer = null;
    }
    super.disconnectedCallback();
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (changedProperties.has("source") && this.source) {
      this.loadDeck();
    }
    if (changedProperties.has("slide") && this.deck) {
      this._message = null;
      this._syncHash();
      this.paintCurrentSlide();
    }
    if (changedProperties.has("mode") && this.mode === "slide") {
      this.paintCurrentSlide();
    }
  }

  get slides() {
    return (this.deck && this.deck.slides) || [];
  }

  get currentSlide() {
    return this.slides[this.slide - 1] || null;
  }

  /** Prefix for the location hash, so two decks on a page cannot collide. */
  get hashPrefix() {
    return this.deckId || (this.deck && this.deck.title) || "slide";
  }

  /** Fetch the manifest, then honour any slide named in the URL. */
  async loadDeck() {
    this.status = "loading";
    this.rendered = false;
    try {
      const manifestUrl = new URL(this.source, globalThis.location.href);
      const response = await fetch(manifestUrl.href);
      if (!response.ok) {
        throw new Error(`deck manifest ${response.status}`);
      }
      this.deck = await response.json();
      // media inside the manifest is stored beside it, not beside the page
      this._base = manifestUrl;
      this.status = "ready";
      this._readHash();
      this._watchForViewport();
    } catch (error) {
      this.deck = null;
      this.status = "error";
      console.error(`slide-deck: ${error.message}`);
    }
  }

  /** Only pay for the renderer once the deck is actually looked at. */
  _watchForViewport() {
    if (this._observer || !globalThis.IntersectionObserver) {
      return;
    }
    this._observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        this._observer.disconnect();
        this._observer = null;
        this.paintCurrentSlide();
      }
    });
    this._observer.observe(this);
  }

  /**
   * Paint the current slide with the real presentation. Any failure leaves the
   * manifest text on screen, which is a usable deck in its own right.
   */
  async paintCurrentSlide() {
    if (
      this._observer ||
      !this.deck ||
      !this.deck.pptx ||
      this.mode !== "slide"
    ) {
      return;
    }
    const stage = this.shadowRoot && this.shadowRoot.querySelector("#stage");
    if (!stage) {
      return;
    }
    try {
      if (!this._renderer) {
        const { DeckRenderer } = await import("./lib/slide-deck-renderer.js");
        this._renderer = await DeckRenderer.load(
          new URL(this.deck.pptx, this._base).href,
        );
        this.style.setProperty(
          "--slide-deck-aspect-ratio",
          `${this._renderer.aspectRatio}`,
        );
      }
      await this._renderer.render(stage, this.slide - 1);
      this.rendered = true;
    } catch (error) {
      this.rendered = false;
      console.error(`slide-deck: ${error.message}`);
    }
  }

  goTo(number) {
    const total = this.slides.length;
    if (total) {
      this.slide = Math.min(Math.max(number, 1), total);
    }
  }

  showSlide(number) {
    this.mode = "slide";
    this.goTo(number);
  }

  toggleMode() {
    this.mode = this.mode === "grid" ? "slide" : "grid";
  }

  async togglePresenting() {
    if (globalThis.document.fullscreenElement === this) {
      await globalThis.document.exitFullscreen();
    } else if (this.requestFullscreen) {
      this.mode = "slide";
      await this.requestFullscreen();
    }
  }

  async copyLink() {
    const url = new URL(globalThis.location.href);
    url.hash = `${this.hashPrefix}-slide-${this.slide}`;
    try {
      await globalThis.navigator.clipboard.writeText(url.href);
      this._announce(this.t.linkCopied);
    } catch (error) {
      console.error(`slide-deck: ${error.message}`);
    }
  }

  _onFullscreenChange() {
    this.presenting = globalThis.document.fullscreenElement === this;
  }

  _onHashChange() {
    this._readHash();
  }

  _readHash() {
    const match = new RegExp(`^#${this.hashPrefix}-slide-(\\d+)$`).exec(
      globalThis.location.hash,
    );
    if (match) {
      this.goTo(Number(match[1]));
    }
  }

  _syncHash() {
    const hash = `#${this.hashPrefix}-slide-${this.slide}`;
    if (globalThis.location.hash === hash) {
      return;
    }
    globalThis.history.replaceState(null, "", hash);
  }

  _announce(message) {
    this._message = message;
    this.requestUpdate();
  }

  _onKeyDown(event) {
    const keys = {
      ArrowLeft: () => this.goTo(this.slide - 1),
      ArrowRight: () => this.goTo(this.slide + 1),
      Home: () => this.goTo(1),
      End: () => this.goTo(this.slides.length),
    };
    if (keys[event.key]) {
      event.preventDefault();
      keys[event.key]();
    }
  }

  /** Rewrite manifest relative media paths so they resolve beside deck.json. */
  _resolveMedia(markup) {
    if (!markup || !this._base) {
      return markup;
    }
    return markup.replace(
      /(src|href)="(?!https?:|data:|\/)([^"]+)"/g,
      (whole, attribute, value) =>
        `${attribute}="${new URL(value, this._base).href}"`,
    );
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          font-family: var(--ddd-font-navigation);
          color: var(--ddd-theme-primary);
        }
        :host([presenting]) {
          background-color: var(--ddd-theme-default-coalyGray, #000);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        :host([status="error"]) #stage {
          display: none;
        }
        #stage {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / var(--slide-deck-aspect-ratio, 0.5625);
          overflow: hidden;
          background-color: var(--ddd-theme-default-white, #fff);
          border: var(--ddd-border-xs);
        }
        /* the painted slide is decorative; the manifest text below is what
           assistive technology reads */
        #stage > * {
          pointer-events: none;
        }
        .text {
          padding: var(--ddd-spacing-3);
          border: var(--ddd-border-xs);
          border-top: none;
        }
        :host([rendered]) .text {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip-path: inset(50%);
          white-space: nowrap;
          border: none;
          padding: 0;
        }
        .bar {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
          padding: var(--ddd-spacing-1) 0;
        }
        .count {
          font-size: var(--ddd-font-size-4xs);
          min-width: 4em;
          text-align: center;
        }
        .spacer {
          flex: 1;
        }
        .grid {
          display: grid;
          gap: var(--ddd-spacing-3);
        }
        .card {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--ddd-spacing-3);
          padding: var(--ddd-spacing-2);
          border: var(--ddd-border-xs);
          text-align: left;
          background: none;
          font: inherit;
          color: inherit;
          cursor: pointer;
        }
        .card:focus-visible {
          outline: var(--ddd-border-sm);
        }
        .notes {
          font-size: var(--ddd-font-size-4xs);
        }
        .message {
          padding: var(--ddd-spacing-3);
        }
        @media (max-width: 640px) {
          .card {
            grid-template-columns: 1fr;
          }
        }
      `,
    ];
  }

  renderToolbar() {
    const last = this.slides.length;
    return html`<div class="bar">
      <simple-icon-button-lite
        icon="icons:chevron-left"
        label="${this.t.previousSlide}"
        ?disabled="${this.slide <= 1 || this.mode === "grid"}"
        @click="${() => this.goTo(this.slide - 1)}"
      ></simple-icon-button-lite>
      <span class="count">${this.slide} / ${last}</span>
      <simple-icon-button-lite
        icon="icons:chevron-right"
        label="${this.t.nextSlide}"
        ?disabled="${this.slide >= last || this.mode === "grid"}"
        @click="${() => this.goTo(this.slide + 1)}"
      ></simple-icon-button-lite>
      <span class="spacer"></span>
      <simple-icon-button-lite
        icon="icons:link"
        label="${this.t.copyLinkToSlide}"
        @click="${this.copyLink}"
      ></simple-icon-button-lite>
      <simple-icon-button-lite
        icon="${this.mode === "grid" ? "icons:view-carousel" : "icons:apps"}"
        label="${this.mode === "grid"
          ? this.t.viewOneSlide
          : this.t.viewAllSlides}"
        @click="${this.toggleMode}"
      ></simple-icon-button-lite>
      <simple-icon-button-lite
        icon="${this.presenting ? "icons:fullscreen-exit" : "icons:fullscreen"}"
        label="${this.presenting
          ? this.t.exitFullScreen
          : this.t.presentFullScreen}"
        @click="${this.togglePresenting}"
      ></simple-icon-button-lite>
    </div>`;
  }

  renderGrid() {
    return html`<div class="grid">
      ${this.slides.map(
        (slide) =>
          html`<button
            class="card"
            @click="${() => this.showSlide(slide.number)}"
          >
            <div>
              <strong>${this.t.slide} ${slide.number}</strong>
              ${unsafeHTML(this._resolveMedia(slide.html))}
            </div>
            ${slide.notes
              ? html`<div class="notes">
                  <strong>${this.t.speakerNotes}</strong>
                  ${unsafeHTML(slide.notes)}
                </div>`
              : nothing}
          </button>`,
      )}
    </div>`;
  }

  render() {
    if (this.status === "loading") {
      return html`<p class="message">${this.t.loadingPresentation}</p>`;
    }
    if (this.status === "error" || !this.slides.length) {
      return html`<p class="message">${this.t.presentationUnavailable}</p>`;
    }
    const current = this.currentSlide;
    return html`<div
      role="region"
      aria-label="${this.deck.title || this.t.slide}"
      tabindex="0"
      @keydown="${this._onKeyDown}"
    >
      ${this.renderToolbar()}
      ${this.mode === "grid"
        ? this.renderGrid()
        : html`<div id="stage" aria-hidden="true"></div>
            <div class="text">
              <h3>${current.title}</h3>
              ${unsafeHTML(this._resolveMedia(current.html))}
            </div>`}
      <div aria-live="polite" class="message">
        ${this._message || `${this.t.slide} ${this.slide}: ${current.title}`}
      </div>
    </div>`;
  }

  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(SlideDeck.tag, SlideDeck);
