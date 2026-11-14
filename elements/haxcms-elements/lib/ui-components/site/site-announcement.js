/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { autorun, toJS } from "mobx";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { store } from "../../core/haxcms-site-store.js";
import { HAXCMSI18NMixin } from "../../core/utils/HAXCMSI18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";

const VARIANTS = ["brand", "neutral", "success", "warning", "danger"];

/**
 * `site-announcement`
 * The site-wide announcement: one line of news at the top of every page,
 * above the theme ("Spring sections open Monday. Registration closes
 * January 9. See dates").
 *
 * It belongs to the site, not a page. Authors set it in Appearance
 * (metadata.theme.announcement: title, text, link, linkText, variant, ends)
 * and the site builder places it above whatever theme is active, so no
 * theme has to change. It is not a block and never appears in the block
 * picker.
 *
 * A visitor's dismissal is remembered in their browser for that exact
 * announcement, and it stops showing after its end date.
 *
 * Themes with fixed chrome from the top of the window (a full-height side
 * drawer) can move it down by --haxcms-site-announcement-height on the
 * page root: the part of the bar still in view, 0 once it has scrolled away
 * or when there is no announcement.
 *
 * @element site-announcement
 */
class SiteAnnouncement extends HAXCMSI18NMixin(DDDSuper(LitElement)) {
  static get tag() {
    return "site-announcement";
  }

  static get properties() {
    return {
      ...super.properties,
      /** title, text, link, linkText, variant, ends */
      announcement: { type: Object },
      /** the visitor dismissed this announcement */
      dismissed: { type: Boolean, reflect: true },
      /** the announcement's variant, for styling */
      variant: { type: String, reflect: true },
    };
  }

  constructor() {
    super();
    this.HAXCMSI18NMixinBase = "../../../";
    this.announcement = null;
    this.dismissed = false;
    this.variant = "brand";
    this.t = {
      announcement: "Announcement",
      dismissAnnouncement: "Dismiss announcement",
    };
    this.__disposer = [];
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          --site-announcement-accent: light-dark(
            var(--ddd-theme-default-info),
            var(--ddd-theme-default-skyBlue)
          );
          --site-announcement-background: light-dark(
            var(--ddd-theme-default-infoLight),
            color-mix(
              in srgb,
              var(--ddd-theme-default-info) 30%,
              var(--ddd-theme-default-coalyGray)
            )
          );
        }
        :host([hidden]),
        :host([dismissed]) {
          display: none;
        }
        :host([variant="neutral"]) {
          --site-announcement-accent: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-theme-default-slateGray)
          );
          --site-announcement-background: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-coalyGray)
          );
        }
        :host([variant="success"]) {
          --site-announcement-accent: light-dark(
            var(--ddd-theme-default-success),
            var(--ddd-theme-default-opportunityGreen)
          );
          --site-announcement-background: light-dark(
            var(--ddd-theme-default-successLight),
            color-mix(
              in srgb,
              var(--ddd-theme-default-success) 30%,
              var(--ddd-theme-default-coalyGray)
            )
          );
        }
        :host([variant="warning"]) {
          --site-announcement-accent: var(--ddd-theme-default-keystoneYellow);
          --site-announcement-background: light-dark(
            var(--ddd-theme-default-warningLight),
            color-mix(
              in srgb,
              var(--ddd-theme-default-warning) 30%,
              var(--ddd-theme-default-coalyGray)
            )
          );
        }
        :host([variant="danger"]) {
          --site-announcement-accent: light-dark(
            var(--ddd-theme-default-error),
            var(--ddd-theme-default-original87Pink)
          );
          --site-announcement-background: light-dark(
            var(--ddd-theme-default-errorLight),
            color-mix(
              in srgb,
              var(--ddd-theme-default-error) 30%,
              var(--ddd-theme-default-coalyGray)
            )
          );
        }
        .bar {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-1) var(--ddd-spacing-3);
          align-items: center;
          justify-content: center;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-4);
          padding-inline-end: var(--ddd-spacing-10);
          position: relative;
          background-color: var(--site-announcement-background);
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          border-bottom: var(--ddd-border-xs);
          border-bottom-color: var(--site-announcement-accent);
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-140);
          text-align: center;
        }
        p {
          margin: 0;
        }
        strong {
          font-weight: var(--ddd-font-weight-bold);
        }
        a {
          color: light-dark(
            var(--ddd-theme-default-link),
            var(--ddd-theme-default-linkLight)
          );
          font-weight: var(--ddd-font-weight-medium);
          text-decoration: underline;
        }
        a:focus-visible,
        button:focus-visible {
          outline: var(--ddd-border-md);
          outline-color: light-dark(
            var(--ddd-theme-default-link),
            var(--ddd-theme-default-linkLight)
          );
          outline-offset: 2px;
        }
        button {
          position: absolute;
          inset-inline-end: var(--ddd-spacing-2);
          top: 50%;
          transform: translateY(-50%);
          display: inline-grid;
          place-items: center;
          /* 32px: above the 24px minimum target size */
          width: var(--ddd-spacing-8);
          height: var(--ddd-spacing-8);
          padding: var(--ddd-spacing-0);
          border: none;
          border-radius: var(--ddd-radius-sm);
          background: transparent;
          color: inherit;
          cursor: pointer;
          --simple-icon-width: var(--ddd-icon-3xs);
          --simple-icon-height: var(--ddd-icon-3xs);
        }
        button:hover {
          background-color: color-mix(in srgb, currentColor 12%, transparent);
        }
        @media (forced-colors: active) {
          .bar {
            border-bottom-color: CanvasText;
          }
        }
        @media print {
          :host {
            display: none;
          }
        }
      `,
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.__disposer.push(
      autorun(() => {
        const manifest = toJS(store.manifest);
        const theme =
          manifest && manifest.metadata && manifest.metadata.theme
            ? manifest.metadata.theme
            : null;
        this.announcement =
          theme && theme.announcement && typeof theme.announcement === "object"
            ? theme.announcement
            : null;
      }),
    );
  }

  disconnectedCallback() {
    this.__disposer.forEach((dispose) => dispose());
    this.__disposer = [];
    this._trackHeight(false);
    super.disconnectedCallback();
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    this._trackHeight(!this.hidden && !this.dismissed && !!this.announcement);
  }

  /**
   * Publish how much of the bar is in view as
   * --haxcms-site-announcement-height on the page root, for themes with
   * fixed chrome; removed when nothing shows.
   */
  _trackHeight(on) {
    const root = globalThis.document.documentElement;
    if (!on) {
      if (this.__heightTracking) {
        globalThis.removeEventListener("scroll", this.__onScroll);
        if (this.__resize) {
          this.__resize.disconnect();
        }
        this.__heightTracking = false;
      }
      root.style.removeProperty("--haxcms-site-announcement-height");
      return;
    }
    if (!this.__heightTracking) {
      this.__heightTracking = true;
      this.__onScroll = () => {
        if (!this.__frame) {
          this.__frame = globalThis.requestAnimationFrame(() => {
            this.__frame = null;
            this._publishHeight();
          });
        }
      };
      globalThis.addEventListener("scroll", this.__onScroll, {
        passive: true,
      });
      this.__resize = new ResizeObserver(() => this._publishHeight());
      this.__resize.observe(this);
    }
    this._publishHeight();
  }

  _publishHeight() {
    const visible = Math.max(
      0,
      Math.round(this.offsetHeight - (globalThis.scrollY || 0)),
    );
    globalThis.document.documentElement.style.setProperty(
      "--haxcms-site-announcement-height",
      `${visible}px`,
    );
  }

  willUpdate(changedProperties) {
    if (super.willUpdate) {
      super.willUpdate(changedProperties);
    }
    if (changedProperties.has("announcement")) {
      const a = this.announcement;
      this.variant =
        a && VARIANTS.includes(a.variant) ? a.variant : VARIANTS[0];
      this.dismissed = this._storedDismissal() === this._signature();
      this.hidden = !this._showing();
    }
  }

  /** what makes this announcement this one, so a new one shows again */
  _signature() {
    const a = this.announcement || {};
    return JSON.stringify([a.title, a.text, a.link, a.linkText, a.ends]);
  }

  _storageKey() {
    const manifest = store.manifest;
    const name =
      manifest && manifest.metadata && manifest.metadata.site
        ? manifest.metadata.site.name
        : "";
    return `haxcms-announcement-dismissed:${name || ""}`;
  }

  _storedDismissal() {
    try {
      return globalThis.localStorage.getItem(this._storageKey());
    } catch {
      return null;
    }
  }

  /** set, not past its end date (the whole end day still shows) */
  _showing() {
    const a = this.announcement;
    if (!a || (!a.title && !a.text)) {
      return false;
    }
    if (typeof a.ends === "string" && /^\d{4}-\d{2}-\d{2}$/.test(a.ends)) {
      const parts = a.ends.split("-").map((n) => parseInt(n, 10));
      const after = new Date(parts[0], parts[1] - 1, parts[2] + 1);
      if (Date.now() >= after.getTime()) {
        return false;
      }
    }
    return true;
  }

  _dismiss() {
    this.dismissed = true;
    try {
      globalThis.localStorage.setItem(this._storageKey(), this._signature());
    } catch {
      // private windows keep it dismissed for this page view only
    }
    // the button is gone: let focus fall back to the page, so the next
    // Tab starts at the top (the theme's skip link)
    if (this.shadowRoot && this.shadowRoot.activeElement) {
      this.shadowRoot.activeElement.blur();
    }
  }

  /**
   * The link, when it is one a visitor can safely follow. The backends
   * already drop unsafe links; this is a second check, so a hand-edited
   * site.json can never put script in the bar.
   */
  _safeLink(link) {
    if (typeof link !== "string" || link.trim() === "") {
      return "";
    }
    const value = link.trim();
    if (/^[a-z][a-z0-9+.-]*:/i.test(value)) {
      return /^(https?|mailto):/i.test(value) ? value : "";
    }
    return value;
  }

  render() {
    if (this.hidden || this.dismissed || !this.announcement) {
      return nothing;
    }
    const a = this.announcement;
    const link = this._safeLink(a.link);
    return html`<div
      class="bar"
      role="region"
      aria-label="${this.t.announcement}"
    >
      <p>
        ${a.title ? html`<strong>${a.title}</strong>` : nothing}
        ${a.text ? html`${a.title ? " " : ""}${a.text}` : nothing}
      </p>
      ${link ? html`<a href="${link}">${a.linkText || link}</a>` : nothing}
      <button
        type="button"
        aria-label="${this.t.dismissAnnouncement}"
        @click="${this._dismiss}"
      >
        <simple-icon-lite icon="close" aria-hidden="true"></simple-icon-lite>
      </button>
    </div>`;
  }
}
globalThis.customElements.define(SiteAnnouncement.tag, SiteAnnouncement);
export { SiteAnnouncement };
