/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";

/**
 * `linkedin-embed`
 * `Link to a LinkedIn profile`
 *
 * LinkedIn no longer serves profile badges for embedding, so this element
 * renders a plain link to the profile and loads nothing from LinkedIn.
 * It stays defined so content that already uses it keeps working, and it is
 * hidden from the HAX tray so no new content picks it up.
 * @demo demo/index.html
 * @element linkedin-embed
 */
class LinkedinEmbed extends I18NMixin(DDD) {
  static get tag() {
    return "linkedin-embed";
  }

  static get properties() {
    return {
      /**
       * LinkedIn profile name from the profile address
       * (linkedin.com/in/<name>).
       */
      vanityname: { type: String, reflect: true },
      /**
       * Kept so existing content stays valid; the link does not use it.
       */
      locale: { type: String },
      _haxstate: { type: Boolean },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          max-inline-size: 100%;
        }
        a {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          max-inline-size: 100%;
          box-sizing: border-box;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-4);
          border: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          border-radius: var(--ddd-radius-sm);
          color: light-dark(
            var(--ddd-theme-default-link),
            var(--ddd-theme-default-linkLight)
          );
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-xs);
          font-weight: var(--ddd-font-weight-medium);
          text-decoration: none;
          overflow-wrap: anywhere;
        }
        a:hover,
        a:focus-visible {
          text-decoration: underline;
        }
        a:focus-visible {
          outline: var(--ddd-border-md);
          outline-color: currentColor;
          outline-offset: var(--ddd-spacing-1);
        }
        simple-icon-lite {
          flex: 0 0 auto;
          --simple-icon-width: var(--ddd-icon-xs);
          --simple-icon-height: var(--ddd-icon-xs);
        }
        a.is-editing {
          pointer-events: none;
        }
      `,
    ];
  }

  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      viewOnLinkedin: "View {name} on LinkedIn",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../locales/", import.meta.url).href,
    });
    this.vanityname = "btopro";
    this.locale = "en_US";
    this._haxstate = false;
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (changedProperties.has("vanityname")) {
      const normalized = this.__normalizeVanityname(this.vanityname);
      if (normalized !== this.vanityname) {
        this.vanityname = normalized;
      }
    }
  }

  haxHooks() {
    return {
      editModeChanged: "haxeditModeChanged",
      activeElementChanged: "haxactiveElementChanged",
    };
  }

  haxactiveElementChanged(el, value) {
    if (value) {
      this._haxstate = value;
    }
    return el;
  }

  haxeditModeChanged(value) {
    this._haxstate = value;
  }

  __normalizeVanityname(value) {
    if (!value || typeof value !== "string") {
      return "btopro";
    }
    return value
      .replace("https://www.linkedin.com/in/", "")
      .replaceAll("/", "")
      .trim();
  }

  get _profileHref() {
    return `https://www.linkedin.com/in/${encodeURIComponent(this.vanityname)}`;
  }

  render() {
    return html`
      <a
        class="${this._haxstate ? "is-editing" : ""}"
        href="${this._profileHref}"
        target="_blank"
        rel="noopener noreferrer"
        part="link"
      >
        <simple-icon-lite
          icon="mdi-social:linkedin"
          aria-hidden="true"
        ></simple-icon-lite>
        <span
          >${this.t.viewOnLinkedin.replace("{name}", () => this.vanityname)}</span
        >
      </a>
    `;
  }

  static get haxProperties() {
    return new URL(`./${this.tag}.haxProperties.json`, import.meta.url).href;
  }
}

globalThis.customElements.define(LinkedinEmbed.tag, LinkedinEmbed);
export { LinkedinEmbed };
