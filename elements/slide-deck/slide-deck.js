/**
 * Copyright 2026 The Pennsylvania State University
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { DDDBlockStyles } from "@haxtheweb/d-d-d/lib/DDDBlock.js";
import { DDDReadingListStyles } from "@haxtheweb/d-d-d/lib/DDDStyles.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { sanitizeHTMLString } from "@haxtheweb/utils/utils.js";
import {
  activityId,
  buildStatement,
  XAPI_ACTIVITY_TYPES,
  XAPI_EXTENSIONS,
} from "@haxtheweb/user-action/lib/xapi.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";

// learner data milestones: the deck is split in four quarters by slide; a
// quarter is gone through once every slide in it was shown. progressed is
// sent once for each quarter gone through in order, completed once every
// slide was shown. Decks under four slides send attempted and completed
// only. Each is sent once per learner, ever (the learner profile remembers
// them).
export const SLIDE_DECK_MILESTONES = [0.25, 0.5, 0.75];

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
  /**
   * xAPI statements this element sends (see scripts/generate-xapi-vocabulary.mjs).
   * Five at most per learner however long the deck is.
   */
  static get xapiVocabulary() {
    return {
      tag: "slide-deck",
      event: "user-engagement",
      verbs: ["attempted", "progressed", "completed"],
      objectType: "http://adlnet.gov/expapi/activities/interaction",
      result: [
        "completion",
        "score",
        "extensions.https://haxtheweb.org/xapi/extensions/progress",
      ],
      countsTowardCompletion: false,
      done: "never required; progressed as each quarter of the slides is shown, completed once every slide has been shown; each once per learner",
    };
  }

  constructor() {
    super();
    this._haxstate = false;
    this._resetSeen();
    // learner profile: save where the learner is when they leave; forget it
    // when they clear their progress
    this._learnerLeaveHandler = () => this._saveLearnerState();
    this._learnerClearedHandler = () => {
      this._resetSeen();
      this._learnerChecked = true;
    };
    this.source = null;
    this.deckId = null;
    this.slide = 1;
    this.mode = "slide";
    this.presenting = false;
    this.deck = null;
    this.status = "idle";
    this.rendered = false;
    this.downloadable = true;
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
      downloadPresentation: "Download presentation",
      slides: "Slides",
      position: "{number} of {total}",
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
      /** URL of the deck.json manifest, relative to the site or absolute. */
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
      rendered: { type: Boolean, reflect: true },
      /** Show a download button for the original .pptx in the player controls. */
      downloadable: { type: Boolean, reflect: true },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    globalThis.addEventListener("hashchange", this._onHashChange);
    this.addEventListener("fullscreenchange", this._onFullscreenChange);
    globalThis.addEventListener("pagehide", this._learnerLeaveHandler);
    globalThis.addEventListener(
      "learner-progress-cleared",
      this._learnerClearedHandler,
    );
  }

  disconnectedCallback() {
    // the learner moved on (another page of the site): keep where they were
    this._saveLearnerState();
    globalThis.removeEventListener("pagehide", this._learnerLeaveHandler);
    globalThis.removeEventListener(
      "learner-progress-cleared",
      this._learnerClearedHandler,
    );
    globalThis.removeEventListener("hashchange", this._onHashChange);
    this.removeEventListener("fullscreenchange", this._onFullscreenChange);
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
    this._releaseRenderer();
    super.disconnectedCallback();
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (changedProperties.has("source") && this.source) {
      this.loadDeck();
    }
    if (changedProperties.has("deck")) {
      // a new deck is a new activity; what this learner did with it before
      // (and where they stopped) comes back from the learner profile
      this._resetSeen();
      this._readLearnerRecord();
    }
    if (changedProperties.has("slide") && this.deck) {
      this._message = null;
      this._syncHash();
      this.paintCurrentSlide();
    }
    if (
      this.deck &&
      this.mode === "slide" &&
      (changedProperties.has("slide") ||
        changedProperties.has("deck") ||
        changedProperties.has("mode"))
    ) {
      this._trackSeen();
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
    return encodeURIComponent(
      this.deckId || (this.deck && this.deck.title) || "slide",
    );
  }

  /** Fetch the manifest, then honour any slide named in the URL. */
  async loadDeck() {
    const load = {};
    this._load = load;
    this._releaseRenderer();
    this.deck = null;
    this.status = "loading";
    this.rendered = false;
    try {
      // import paths are site relative, so resolve against the HAX <base>
      const response = await fetch(
        new URL(this.source, globalThis.document.baseURI).href,
      );
      if (!response.ok) {
        throw new Error(`deck manifest ${response.status}`);
      }
      const deck = await response.json();
      // a newer source was set while this one was loading
      if (load !== this._load) {
        return;
      }
      this.deck = deck;
      this.status = "ready";
      // the previous deck's slide may be past the end of this one
      this.goTo(this.slide);
      this._readHash();
      this._watchForViewport();
    } catch (error) {
      if (load === this._load) {
        this.status = "error";
        console.error(`slide-deck: ${error.message}`);
      }
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

  /** Drop the renderer, disposing it once any load in flight settles. */
  _releaseRenderer() {
    if (this._renderer) {
      this._renderer.then(
        (renderer) => renderer.dispose(),
        () => {},
      );
      this._renderer = null;
    }
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
    const { slide } = this;
    try {
      if (!this._renderer) {
        const pptx = new URL(this.deck.pptx, globalThis.document.baseURI).href;
        // shared by every paint until it settles, so the deck loads once
        this._renderer = import("./lib/slide-deck-renderer.js").then(
          ({ DeckRenderer }) => DeckRenderer.load(pptx),
        );
      }
      const pending = this._renderer;
      const renderer = await pending;
      // newer navigation, a mode change or a new source has taken over
      if (
        pending !== this._renderer ||
        slide !== this.slide ||
        !stage.isConnected
      ) {
        return;
      }
      this.style.setProperty(
        "--slide-deck-aspect-ratio",
        `${renderer.aspectRatio}`,
      );
      await renderer.render(stage, slide - 1);
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

  /**
   * Whether presenting is possible at all. The Fullscreen API can be
   * missing or blocked (e.g. a sandboxed iframe), and a present button
   * that silently no-ops is a trap for keyboard users, so the control
   * renders disabled instead.
   */
  get fullscreenAvailable() {
    return Boolean(
      this.requestFullscreen && globalThis.document.fullscreenEnabled,
    );
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

  /**
   * Download the original .pptx referenced by the manifest. Resolves the
   * manifest's `pptx` path against the document base URI and triggers a
   * download via a temporary anchor with a `download` attribute.
   */
  downloadPptx() {
    if (!this.deck || !this.deck.pptx) return;
    let href;
    try {
      href = new URL(this.deck.pptx, globalThis.document.baseURI).href;
    } catch (error) {
      console.error(`slide-deck: ${error.message}`);
      return;
    }
    // derive a filename from the deck source or title, falling back to
    // original.pptx so the download attribute always has a value
    let filename = "original.pptx";
    const base =
      (this.deck.source && String(this.deck.source)) ||
      (this.deck.title && String(this.deck.title)) ||
      "";
    if (base) {
      const withoutExt = base.replace(/\.pptx$/i, "").replace(/\.json$/i, "");
      const tail = withoutExt.split("/").pop();
      if (tail) {
        filename = tail + ".pptx";
      }
    }
    const a = globalThis.document.createElement("a");
    a.href = href;
    a.download = filename;
    a.style.display = "none";
    globalThis.document.body.appendChild(a);
    a.click();
    globalThis.document.body.removeChild(a);
  }

  _onFullscreenChange() {
    this.presenting = globalThis.document.fullscreenElement === this;
  }

  _onHashChange() {
    this._readHash();
  }

  _readHash() {
    const prefix = `#${this.hashPrefix}-slide-`;
    const { hash } = globalThis.location;
    const number = hash.slice(prefix.length);
    if (hash.startsWith(prefix) && /^\d+$/.test(number)) {
      this.goTo(Number(number));
    }
  }

  _syncHash() {
    const url = new URL(globalThis.location.href);
    url.hash = `${this.hashPrefix}-slide-${this.slide}`;
    if (url.href === globalThis.location.href) {
      return;
    }
    // a bare "#hash" would resolve against the HAX <base>, not this page
    globalThis.history.replaceState(null, "", url.href);
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

  static get styles() {
    return [
      super.styles,
      DDDReadingListStyles,
      DDDBlockStyles,
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
          padding: var(--ddd-spacing-0);
        }
        /* full screen sits on a dark backdrop, so the header uses its dark
           colours there whatever the page scheme is */
        :host([presenting]) .ddd-block {
          color-scheme: dark;
          border: none;
          border-radius: var(--ddd-radius-0);
        }
        .ddd-block:focus {
          outline: none;
        }
        .ddd-block:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        .ddd-block-header {
          flex-wrap: wrap;
          gap: var(--ddd-spacing-2) var(--ddd-spacing-3);
        }
        .ddd-block-actions {
          gap: var(--ddd-spacing-2);
          margin-inline-start: auto;
        }
        /* the actions are simple-icon-button-lite: the shared action ring
           plus the toggle and focus states it signals by attribute */
        .ddd-block-action {
          --simple-icon-button-border-radius: var(--ddd-radius-rounded);
          --simple-icon-button-focus-background-color: transparent;
          --simple-icon-button-toggled-background-color: transparent;
          --simple-icon-button-focus-opacity: 1;
        }
        .ddd-block-action:focus-within {
          border-color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-linkLight)
          );
          outline: none;
        }
        /* the inner button already dims itself when disabled */
        .ddd-block-action[disabled] {
          opacity: 1;
        }
        /* a toggle that is on is filled */
        .ddd-block-action[toggled] {
          border-color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-linkLight)
          );
          background-color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-linkLight)
          );
          color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
        }
        .ddd-block #stage {
          border: none;
        }
        .ddd-block .text {
          border: none;
        }
        .grid {
          display: grid;
          gap: var(--ddd-spacing-3);
        }
        .ddd-block .grid {
          padding: var(--ddd-spacing-3);
        }
        .card {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--ddd-spacing-3);
          padding: var(--ddd-spacing-2);
          border: var(--ddd-border-xs);
          text-align: start;
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
        .notes p {
          white-space: pre-line;
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
    return html`<div class="bar ddd-block-header">
      <span class="ddd-block-chip" aria-hidden="true"
        ><simple-icon-lite icon="image:slideshow"></simple-icon-lite
      ></span>
      <span class="ddd-block-text">
        <span class="ddd-block-label count"
          >${this.t.slides} ·
          ${this.t.position
            .replace("{number}", () => this.slide)
            .replace("{total}", () => last)}</span
        >
        ${
          this.deck && this.deck.title
            ? html`<span class="ddd-block-title">${this.deck.title}</span>`
            : nothing
        }
      </span>
      <span class="ddd-block-actions">
        <simple-icon-button-lite
          class="ddd-block-action"
          icon="icons:chevron-left"
          label="${this.t.previousSlide}"
          title="${this.t.previousSlide}"
          ?disabled="${this.slide <= 1 || this.mode === "grid"}"
          @click="${() => this.goTo(this.slide - 1)}"
        ></simple-icon-button-lite>
        <simple-icon-button-lite
          class="ddd-block-action"
          icon="icons:chevron-right"
          label="${this.t.nextSlide}"
          title="${this.t.nextSlide}"
          ?disabled="${this.slide >= last || this.mode === "grid"}"
          @click="${() => this.goTo(this.slide + 1)}"
        ></simple-icon-button-lite>
        <simple-icon-button-lite
          class="ddd-block-action"
          icon="icons:link"
          label="${this.t.copyLinkToSlide}"
          title="${this.t.copyLinkToSlide}"
          @click="${this.copyLink}"
        ></simple-icon-button-lite>
        <simple-icon-button-lite
          class="ddd-block-action"
          icon="${this.mode === "grid" ? "icons:view-carousel" : "icons:apps"}"
          label="${
            this.mode === "grid" ? this.t.viewOneSlide : this.t.viewAllSlides
          }"
          title="${
            this.mode === "grid" ? this.t.viewOneSlide : this.t.viewAllSlides
          }"
          toggles
          ?toggled="${this.mode === "grid"}"
          @click="${this.toggleMode}"
        ></simple-icon-button-lite>
        <simple-icon-button-lite
          class="ddd-block-action"
          icon="${
            this.presenting ? "icons:fullscreen-exit" : "icons:fullscreen"
          }"
          label="${
            this.presenting ? this.t.exitFullScreen : this.t.presentFullScreen
          }"
          title="${
            this.presenting ? this.t.exitFullScreen : this.t.presentFullScreen
          }"
          toggles
          ?toggled="${this.presenting}"
          ?disabled="${!this.fullscreenAvailable}"
          @click="${this.togglePresenting}"
        ></simple-icon-button-lite>
        ${
          this.downloadable && this.deck && this.deck.pptx
            ? html`<simple-icon-button-lite
                class="ddd-block-action"
                icon="icons:file-download"
                label="${this.t.downloadPresentation}"
                title="${this.t.downloadPresentation}"
                @click="${this.downloadPptx}"
              ></simple-icon-button-lite>`
            : nothing
        }
      </span>
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
              ${unsafeHTML(sanitizeHTMLString(slide.html))}
            </div>
            ${this.renderNotes(slide)}
          </button>`,
      )}
    </div>`;
  }

  /** Manifest notes are plain text; render them as text, never as HTML. */
  renderNotes(slide) {
    return slide.notes
      ? html`<div class="notes">
          <strong>${this.t.speakerNotes}</strong>
          <p>${slide.notes}</p>
        </div>`
      : nothing;
  }

  render() {
    if (this.status === "loading") {
      return html`<p class="message">${this.t.loadingPresentation}</p>`;
    }
    if (this.status === "error" || !this.slides.length) {
      return html`<p class="message">${this.t.presentationUnavailable}</p>`;
    }
    const current = this.currentSlide;
    // the region is a tab stop only in slide mode; in grid mode the cards
    // are the focus targets and a focusable region would double-stop Tab
    return html`<div
      class="ddd-block"
      role="region"
      aria-label="${this.deck.title || this.t.slide}"
      tabindex="${this.mode === "slide" ? "0" : nothing}"
      @keydown="${this._onKeyDown}"
    >
      ${this.renderToolbar()}
      ${
        this.mode === "grid"
          ? this.renderGrid()
          : html`<div id="stage" aria-hidden="true"></div>
              <div class="text">
                <h3>${current.title}</h3>
                ${unsafeHTML(sanitizeHTMLString(current.html))}
                ${this.renderNotes(current)}
              </div>`
      }
      <div aria-live="polite" class="message">
        ${this._message || `${this.t.slide} ${this.slide}: ${current.title}`}
      </div>
    </div>`;
  }

  haxHooks() {
    return {
      gizmoRegistration: "haxgizmoRegistration",
      processFileUpload: "haxprocessFileUpload",
      editModeChanged: "haxeditModeChanged",
      activeElementChanged: "haxactiveElementChanged",
    };
  }
  /**
   * @see haxHooks: authors paging through a deck while editing are not
   * learners
   */
  haxactiveElementChanged(el, val) {
    if (val) {
      this._haxstate = val;
    }
  }
  haxeditModeChanged(val) {
    this._haxstate = val;
  }

  /**
   * Learner data: forget which slides were shown (new deck)
   */
  _resetSeen() {
    this._seen = new Set();
    this._seenSent = {};
    // learner profile: whether it was asked yet for this deck, and whether
    // the deck was finished on an earlier visit (nothing is sent again)
    this._learnerChecked = false;
    this._alreadyDone = false;
  }

  /**
   * Learner data: the activity id statements about this deck use
   */
  _deckActivityId() {
    return activityId(
      this,
      `slide-deck\u0001${this.source || ""}\u0001${this.deckId || ""}`,
    );
  }

  /**
   * Learner data: what this learner did with this deck before, from the
   * learner profile (the HAXcms learner progress bridge answers
   * `learner-progress-request`; with nothing listening only this visit
   * counts). Puts back the slides shown and the milestones already sent,
   * and opens the slide they stopped on unless the address names a slide.
   */
  _readLearnerRecord() {
    if (this._learnerChecked || this._haxstate || !this.slides.length) {
      return;
    }
    this._learnerChecked = true;
    const detail = {
      activityId: this._deckActivityId(),
      tag: SlideDeck.tag,
      record: null,
    };
    globalThis.dispatchEvent(
      new CustomEvent("learner-progress-request", { detail }),
    );
    const record =
      detail.record && typeof detail.record === "object" ? detail.record : null;
    if (!record) {
      return;
    }
    if (record.done) {
      // finished before: paging through again sends and saves nothing
      this._alreadyDone = true;
      return;
    }
    const sent = this._seenSent;
    (Array.isArray(record.milestones) ? record.milestones : []).forEach(
      (key) => {
        sent[key] = true;
      },
    );
    if (record.verbs && record.verbs.attempted) {
      sent.attempted = true;
    }
    const total = this.slides.length;
    const state = record.state || {};
    (Array.isArray(state.covered) ? state.covered : []).forEach((r) => {
      const from = Math.max(1, Math.floor(Number(r[0])));
      const to = Math.min(total, Math.floor(Number(r[1])));
      for (let n = from; n <= to; n++) {
        this._seen.add(n);
      }
    });
    const resume = Math.floor(Number(state.resume));
    if (this.slide === 1 && isFinite(resume) && resume > 1) {
      this.goTo(resume);
    }
  }

  /**
   * Learner data: save the slides shown and the one on screen to the
   * learner profile, without a statement (`learner-progress-update`,
   * written by the HAXcms learner progress bridge). Nothing when finished
   * on an earlier visit or while editing.
   */
  _saveLearnerState() {
    const total = this.slides.length;
    if (this._alreadyDone || this._haxstate || !total || this._seen.size < 2) {
      return;
    }
    const covered = [];
    Array.from(this._seen)
      .sort((a, b) => a - b)
      .forEach((n) => {
        const prev = covered[covered.length - 1];
        if (prev && n === prev[1] + 1) {
          prev[1] = n;
        } else {
          covered.push([n, n]);
        }
      });
    globalThis.dispatchEvent(
      new CustomEvent("learner-progress-update", {
        detail: {
          activityId: this._deckActivityId(),
          tag: SlideDeck.tag,
          name: this._deckName(),
          state: {
            covered,
            resume: this.slide,
            progress: Math.round((this._seen.size / total) * 100) / 100,
          },
        },
      }),
    );
  }

  /**
   * Learner data: which quarters of the deck were gone through (every slide
   * in them shown); null for decks under four slides, which have no
   * quarters
   * @returns {boolean[]|null}
   */
  get seenQuarters() {
    const total = this.slides.length;
    if (total < 4) {
      return null;
    }
    return [0, 1, 2, 3].map((q) => {
      const from = Math.floor((q * total) / 4) + 1;
      const to = Math.floor(((q + 1) * total) / 4);
      for (let n = from; n <= to; n++) {
        if (!this._seen.has(n)) {
          return false;
        }
      }
      return true;
    });
  }

  /**
   * Learner data: the slide on screen in slide mode counts as shown (the
   * grid shows thumbnails, which is not going through the deck). Sends each
   * milestone once per learner however long the deck is: attempted once a
   * learner moves on to a second slide, progressed as each quarter of the
   * slides is gone through in order, completed once every slide was shown.
   * Decks of one slide have nothing to go through and send nothing. Saves
   * where the learner is each time a new slide is shown.
   */
  _trackSeen() {
    const total = this.slides.length;
    if (this._haxstate || this._alreadyDone || total < 2 || !this.slide) {
      return;
    }
    const isNew = !this._seen.has(this.slide);
    this._seen.add(this.slide);
    const seen = this._seen.size;
    const sent = this._seenSent;
    if (seen < 2) {
      return;
    }
    if (!sent.attempted) {
      sent.attempted = true;
      this._announceSlides("attempted", seen, total);
    }
    const quarters = this.seenQuarters;
    if (quarters) {
      let inOrder = 0;
      while (inOrder < SLIDE_DECK_MILESTONES.length && quarters[inOrder]) {
        inOrder++;
      }
      for (let i = 0; i < inOrder; i++) {
        const share = SLIDE_DECK_MILESTONES[i];
        const key = `progressed@${share}`;
        if (!sent[key]) {
          sent[key] = true;
          this._announceSlides("progressed", seen, total, share);
        }
      }
    }
    if (!sent.completed && seen >= total) {
      sent.completed = true;
      this._announceSlides("completed", seen, total, 1);
    }
    if (isNew) {
      this._saveLearnerState();
    }
  }

  _deckName() {
    return (
      String(
        (this.deck && this.deck.title) || this.getAttribute("title") || "",
      ).trim() || "Slide deck"
    ).slice(0, 120);
  }

  /**
   * Learner data: one user-engagement event with an xAPI statement about
   * this deck
   * @param {string} verb attempted, progressed or completed
   * @param {number} seen slides shown
   * @param {number} total slides in the deck
   * @param {number} [share] progress milestone, 0 to 1
   */
  _announceSlides(verb, seen, total, share) {
    const name = this._deckName();
    let result;
    if (verb !== "attempted") {
      result = {
        completion: verb === "completed",
        score: { raw: seen, min: 0, max: total },
      };
      if (typeof share === "number") {
        result.extensions = { [XAPI_EXTENSIONS.progress]: share };
      }
    }
    const detail = {
      activityDisplay: verb,
      objectName: name,
      statement: buildStatement({
        verb,
        object: {
          id: this._deckActivityId(),
          name,
          type: XAPI_ACTIVITY_TYPES.interactionGeneric,
        },
        result,
        context: {
          extensions: { [XAPI_EXTENSIONS.element]: SlideDeck.tag },
        },
      }),
    };
    if (result) {
      detail.resultCompletion = result.completion;
      detail.resultScore = seen / total;
    }
    this.dispatchEvent(
      new CustomEvent("user-engagement", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail,
      }),
    );
  }

  /**
   * @see haxHooks: gizmoRegistration
   * Register haxProperties locales so the HAX editor UI can be translated
   */
  haxgizmoRegistration(_store) {
    globalThis.dispatchEvent(
      new CustomEvent("i18n-manager-register-element", {
        detail: {
          namespace: `slide-deck.haxProperties`,
          localesPath: new URL(`./locales`, import.meta.url).href,
        },
      }),
    );
  }
  /**
   * @see haxHook: processFileUpload — invoked by HAXStore.applyFileUploadTransform
   * from the generic tray upload / drag-drop path (Merlin "Embed slide deck" or
   * dragging a .pptx onto the page). slide-deck declares the convert-pptx-deck
   * transform here so the platform never hard-codes pptx support. Returns false
   * for non-.pptx sources (the platform inserts them normally). Mirrors the
   * per-field uploadTransform in slide-deck.haxProperties.json so a deck
   * behaves identically whether created via slide-deck's own source field or
   * via Merlin / drag-drop. On transform failure the store falls back to
   * fallbackType "link" so the user gets a working file link instead of a
   * broken deck pointing at the raw .pptx.
   * @param {object} values {source, title} (source is the raw uploaded path)
   * @param {object} response parsed upload response (response.data.file.uuid)
   * @returns {object|false} { fileUuid, operation, valueMapping, fallbackType }
   */
  haxprocessFileUpload(values, response) {
    if (!values || typeof values.source !== "string") return false;
    if (!/\.pptx$/i.test(values.source)) return false;
    const fileUuid =
      response && response.data && response.data.file && response.data.file.uuid
        ? response.data.file.uuid
        : "";
    if (!fileUuid) return false;
    return {
      fileUuid: fileUuid,
      operation: "convert-pptx-deck",
      valueMapping: "data.deckPath",
      fallbackType: "link",
    };
  }
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(SlideDeck.tag, SlideDeck);
