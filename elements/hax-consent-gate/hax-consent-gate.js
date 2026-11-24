/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { HaxConsent } from "@haxtheweb/utils/lib/hax-consent.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";

/**
 * Every third-party service a HAX page can reach, by HaxConsent service name.
 * The words for each live in this.t (serviceLabel_<id>, serviceSends_<id>,
 * serviceNotice_<id>) so privacy-choices and every gate read one list.
 */
export const HAX_CONSENT_SERVICES = [
  { id: "google-analytics", icon: "editor:insert-chart" },
  { id: "youtube", icon: "av:video-library" },
  { id: "vimeo", icon: "av:video-library" },
  { id: "google-maps", icon: "maps:map" },
  { id: "speech", icon: "av:mic" },
];

/**
 * `hax-consent-gate`
 * Asks a visitor before a third-party service is contacted, and stores the
 * answer in HaxConsent (one store for every service).
 * - variant="bar": a bar fixed to the bottom of the page for site-wide
 *   services (Google Analytics). It stays until the visitor chooses; Allow
 *   and Don't allow carry the same weight. There is no close button.
 * - variant="panel": drawn by an embedding element (iframe-loader,
 *   video-player, a map) in place of its content, with one
 *   "Always allow <service>" choice. The embedding element renders its own
 *   content once HaxConsent says "allow"; the panel only asks.
 * @demo demo/index.html
 * @element hax-consent-gate
 */
export class HaxConsentGate extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "hax-consent-gate";
  }
  constructor() {
    super();
    this.service = "google-analytics";
    this.variant = "bar";
    this.host = null;
    this._saved = null;
    this._allowed = false;
    this.t = {
      barLabel: "Privacy choice",
      allow: "Allow",
      dontAllow: "Don't allow",
      alwaysAllow: "Always allow",
      choicesLabel: "Privacy choices",
      changeLater: "Change it any time in",
      changeLaterNoPage:
        "You can change this any time by clearing this site's data in your browser.",
      savedAllow: "Saved: Google Analytics is allowed.",
      savedDeny: "Saved: Google Analytics stays off.",
      analyticsTitle: "Allow Google Analytics?",
      analyticsBody:
        "This site uses it to count visits and pages read. If you allow it, Google receives your IP address and may set cookies. Saying no is fine: the site works the same.",
      genericNotice:
        "This content comes from {host}. {host} will receive your IP address and may set cookies.",
      serviceLabel_google_analytics: "Google Analytics",
      serviceLabel_youtube: "YouTube",
      serviceLabel_vimeo: "Vimeo",
      serviceLabel_google_maps: "Google Maps",
      serviceLabel_speech: "Voice input",
      serviceNotice_youtube:
        "This video plays from YouTube. Google will receive your IP address and may set cookies.",
      serviceNotice_vimeo:
        "This video plays from Vimeo. Vimeo will receive your IP address.",
      serviceNotice_google_maps:
        "This map is from Google Maps. Google will receive your IP address and may set cookies.",
      serviceNotice_speech:
        "Your browser would send your voice to its speech service (Google, Apple or Microsoft) to turn it into text.",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/hax-consent-gate.ar.json", import.meta.url).href +
        "/../",
    });
    this._onConsent = (e) => {
      if (e.detail && e.detail.service === this.service) {
        this._allowed = HaxConsent.allowed(this.service);
        this.requestUpdate();
      }
    };
  }
  static get properties() {
    return {
      ...super.properties,
      /** HaxConsent service name, e.g. google-analytics, google-maps */
      service: { type: String, reflect: true },
      /** bar (fixed to the bottom of the page) or panel (in place of an embed) */
      variant: { type: String, reflect: true },
      /** for a service with no entry of its own: the host it comes from */
      host: { type: String },
      _saved: { type: String },
      _allowed: { type: Boolean },
    };
  }
  connectedCallback() {
    super.connectedCallback();
    this._allowed = HaxConsent.allowed(this.service);
    if (this.variant === "bar" && globalThis.ResizeObserver) {
      this._resize = new ResizeObserver(() =>
        this._setRoom(this.getBoundingClientRect().height),
      );
      this._resize.observe(this);
    }
    globalThis.addEventListener("hax-consent-changed", this._onConsent);
  }
  disconnectedCallback() {
    globalThis.removeEventListener("hax-consent-changed", this._onConsent);
    if (this._closeTimer) {
      globalThis.clearTimeout(this._closeTimer);
    }
    if (this._resize) {
      this._resize.disconnect();
    }
    this._setRoom(0);
    super.disconnectedCallback();
  }
  _key(prefix) {
    return prefix + this.service.replace(/-/g, "_");
  }
  get serviceLabel() {
    return this.t[this._key("serviceLabel_")] || this.host || this.service;
  }
  get notice() {
    return (
      this.t[this._key("serviceNotice_")] ||
      this.t.genericNotice.replace(/\{host\}/g, this.host || this.service)
    );
  }
  get icon() {
    const found = HAX_CONSENT_SERVICES.find((s) => s.id === this.service);
    return found ? found.icon : "social:public";
  }
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          font-family: var(--ddd-font-navigation);
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
        }
        :host([hidden]) {
          display: none;
        }
        /* a panel fits whatever it stands in for, down to a 320px screen */
        :host([variant="panel"]) {
          max-width: 100%;
          min-width: 0;
        }
        /* bar: above page content and theme chrome, just below dialogs */
        :host([variant="bar"]) {
          position: fixed;
          left: var(--ddd-spacing-0);
          right: var(--ddd-spacing-0);
          bottom: var(--ddd-spacing-0);
          z-index: calc(var(--ddd-z-modal) - 1);
          max-height: 60dvh;
          overflow-y: auto;
          overscroll-behavior: contain;
          background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          border-top: var(--ddd-border-md);
          border-top-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          box-shadow: var(--ddd-boxShadow-lg);
        }
        .bar {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-4) var(--ddd-spacing-6);
          max-width: 72rem;
          margin: var(--ddd-spacing-0) auto;
          padding: var(--ddd-spacing-4) var(--ddd-spacing-6);
          box-sizing: border-box;
        }
        .bar simple-icon-lite {
          flex: 0 0 auto;
          --simple-icon-width: var(--ddd-icon-sm);
          --simple-icon-height: var(--ddd-icon-sm);
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
        }
        .words {
          flex: 1 1 auto;
          min-width: 0;
        }
        .title {
          margin: var(--ddd-spacing-0) var(--ddd-spacing-0) var(--ddd-spacing-1)
            var(--ddd-spacing-0);
          font-size: var(--ddd-font-size-xs);
          font-weight: var(--ddd-font-weight-bold);
          line-height: var(--ddd-lh-120);
        }
        .body,
        .later,
        .notice,
        .saved {
          margin: var(--ddd-spacing-0);
          font-size: var(--ddd-font-size-3xs);
          line-height: var(--ddd-lh-150);
        }
        .later {
          margin-top: var(--ddd-spacing-1);
        }
        a {
          display: inline-block;
          min-height: var(--ddd-spacing-6);
          line-height: var(--ddd-spacing-6);
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .actions {
          flex: 0 0 auto;
          display: flex;
          gap: var(--ddd-spacing-3);
        }
        /* Allow and Don't allow carry the same weight: same size, border,
           fill and type. Only the words differ. */
        button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--ddd-spacing-2);
          min-height: var(--ddd-spacing-11);
          min-width: 9rem;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-4);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-3xs);
          font-weight: var(--ddd-font-weight-bold);
          border-radius: var(--ddd-radius-sm);
          border: var(--ddd-border-md);
          border-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          cursor: pointer;
          transition:
            background-color 0.2s ease-in-out,
            color 0.2s ease-in-out;
        }
        button:hover {
          background-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
        }
        button:active {
          transform: translateY(1px);
        }
        button:focus-visible,
        a:focus-visible {
          outline: var(--ddd-border-md);
          outline-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          outline-offset: 2px;
        }
        button simple-icon-lite {
          --simple-icon-width: var(--ddd-icon-3xs);
          --simple-icon-height: var(--ddd-icon-3xs);
        }
        @media (max-width: 720px) {
          .bar {
            flex-wrap: wrap;
            gap: var(--ddd-spacing-2);
            padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
          }
          .title {
            font-size: var(--ddd-font-size-3xs);
          }
          .body,
          .later {
            font-size: var(--ddd-font-size-4xs);
            line-height: var(--ddd-lh-140);
          }
          .bar > simple-icon-lite {
            display: none;
          }
          .actions {
            flex: 1 1 100%;
          }
          .actions button {
            flex: 1 1 0;
            min-width: 0;
          }
        }
        /* panel: in place of the embed, same look as the YouTube gate */
        .panel {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          aspect-ratio: var(--hax-consent-gate-aspect, 16 / 9);
          padding: var(--ddd-spacing-4);
          box-sizing: border-box;
          border-radius: var(--ddd-radius-sm);
          background-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-potentialMidnight)
          );
        }
        .panel-inner {
          max-width: min(28rem, 100%);
          box-sizing: border-box;
          overflow-wrap: anywhere;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--ddd-spacing-3);
          padding: var(--ddd-spacing-4) var(--ddd-spacing-5);
          border-radius: var(--ddd-radius-sm);
          text-align: center;
          background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
        }
        .panel-inner > simple-icon-lite {
          --simple-icon-width: var(--ddd-icon-sm);
          --simple-icon-height: var(--ddd-icon-sm);
        }
        .panel button {
          min-width: 0;
          border-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          background-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
        }
        .panel button:hover {
          background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
        }
        @media (max-width: 400px) {
          .panel {
            aspect-ratio: auto;
            min-height: 14rem;
          }
        }
      `,
    ];
  }
  render() {
    return this.variant === "panel" ? this._renderPanel() : this._renderBar();
  }
  _choicesLink() {
    return HaxConsent.choicesUrl
      ? html`<a href="${HaxConsent.choicesUrl}">${this.t.choicesLabel}</a>`
      : ``;
  }
  _renderBar() {
    if (this._saved) {
      return html`<div
        class="bar"
        role="region"
        aria-label="${this.t.barLabel}"
      >
        <p class="saved words" role="status">
          ${this._saved === "allow" ? this.t.savedAllow : this.t.savedDeny}
          ${
            HaxConsent.choicesUrl
              ? html`${this.t.changeLater} ${this._choicesLink()}.`
              : ``
          }
        </p>
      </div>`;
    }
    return html`<div class="bar" role="region" aria-label="${this.t.barLabel}">
      <simple-icon-lite
        icon="${this.icon}"
        aria-hidden="true"
      ></simple-icon-lite>
      <div class="words">
        <p class="title">${this.t.analyticsTitle}</p>
        <p class="body">${this.t.analyticsBody}</p>
        <p class="later">
          ${
            HaxConsent.choicesUrl
              ? html`${this.t.changeLater} ${this._choicesLink()}.`
              : this.t.changeLaterNoPage
          }
        </p>
      </div>
      <div class="actions">
        <button id="allow" @click="${() => this._choose("allow")}">
          ${this.t.allow}
        </button>
        <button id="deny" @click="${() => this._choose("deny")}">
          ${this.t.dontAllow}
        </button>
      </div>
    </div>`;
  }
  _renderPanel() {
    if (this._allowed) {
      return ``;
    }
    return html`<div class="panel" role="group" aria-labelledby="notice">
      <div class="panel-inner">
        <simple-icon-lite
          icon="${this.icon}"
          aria-hidden="true"
        ></simple-icon-lite>
        <p class="notice" id="notice">${this.notice}</p>
        <button id="allow" @click="${() => this._choose("allow")}">
          <simple-icon-lite
            icon="${this.icon}"
            aria-hidden="true"
          ></simple-icon-lite>
          ${this.t.alwaysAllow} ${this.serviceLabel}
        </button>
        ${this._choicesLink()}
      </div>
    </div>`;
  }
  _choose(value) {
    // marked saved first: the store's change event must find a bar that is
    // showing its confirmation, not a bar still waiting for an answer
    if (this.variant === "bar") {
      this._saved = value;
    }
    HaxConsent.set(this.service, value);
    if (this.variant === "bar") {
      // the confirmation stays long enough to be read, then the bar goes
      this._closeTimer = globalThis.setTimeout(() => {
        this.dispatchEvent(
          new CustomEvent("hax-consent-gate-closed", {
            bubbles: true,
            composed: true,
            detail: { service: this.service, value: value },
          }),
        );
        this.remove();
      }, 4000);
    }
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    // a fixed bar must not hide the end of the page it sits over
    if (this.variant === "bar") {
      this._setRoom(this.getBoundingClientRect().height);
    }
  }
  _setRoom(px) {
    if (this.variant === "bar" && globalThis.document && document.body) {
      // room to scroll the page end above the bar, and scroll padding so
      // focus and scrolled-to targets stop above it (WCAG 2.4.11). What the
      // page had set before is put back when the bar goes.
      if (this._roomBefore === undefined) {
        this._roomBefore = [
          document.body.style.paddingBottom,
          document.documentElement.style.scrollPaddingBottom,
        ];
      }
      document.body.style.paddingBottom = px ? px + "px" : this._roomBefore[0];
      document.documentElement.style.scrollPaddingBottom = px
        ? px + "px"
        : this._roomBefore[1];
    }
  }
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}
globalThis.customElements.define(HaxConsentGate.tag, HaxConsentGate);
