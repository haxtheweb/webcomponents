/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { HAXCMSThemeParts } from "../../core/utils/HAXCMSThemeParts.js";
import { HAXCMSI18NMixin } from "../../core/utils/HAXCMSI18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
/**
 * `site-rss-button`
 * `A button that references RSS feeds in a standards based way`
 *

 */
class SiteRSSButton extends HAXCMSI18NMixin(HAXCMSThemeParts(LitElement)) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: inline-flex;
          color: var(--site-rss-button-color, inherit);
        }
        /* the link is the control (no button nested inside it): the same
           24px round icon at rest, plus hover, a focus ring and a
           held-down overlay */
        a {
          display: inline-grid;
          place-items: center;
          width: var(--simple-icon-width, 24px);
          height: var(--simple-icon-height, 24px);
          border-radius: var(--simple-icon-button-border-radius, 50%);
          text-decoration: var(--site-rss-text-decoration);
          color: var(--site-rss-button-color, inherit);
        }
        a:hover {
          background-color: color-mix(
            in srgb,
            currentColor calc(var(--ddd-state-hover-opacity, 0.08) * 100%),
            transparent
          );
        }
        a:focus-visible {
          outline: var(--ddd-focus-ring, 2px solid currentColor);
          outline-offset: var(--ddd-focus-offset, 2px);
        }
        a:active:not([aria-disabled="true"]) {
          box-shadow: inset 0 0 0 999px
            color-mix(
              in srgb,
              currentColor calc(var(--ddd-state-pressed-opacity, 0.12) * 100%),
              transparent
            );
        }
        a[aria-disabled="true"] {
          opacity: var(--ddd-state-disabled-opacity, 0.5);
          pointer-events: none;
        }
        simple-icon-lite {
          color: inherit;
        }
      `,
    ];
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "site-rss-button";
  }
  constructor() {
    super();
    this.HAXCMSI18NMixinBase = "../../../";
    this.t = {
      rssFeed: "RSS Feed",
      atomFeed: "Atom Feed",
    };
    this._link = {
      title: this.t.rssFeed,
    };
    this.href = "rss.xml";
    this.icon = "communication:rss-feed";
    this.type = "rss";
    this.raised = false;
    this.position = "auto";
  }
  // render function
  render() {
    return html`
      <a
        aria-disabled="${this.disabled ? "true" : "false"}"
        href="${this.href}"
        .id="btn${this.type}"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="${this._link.title}"
        .part="${this.editMode ? `edit-mode-active` : ``}"
      >
        <simple-icon-lite
          icon="${this.icon}"
          aria-hidden="true"
        ></simple-icon-lite>
      </a>
      <simple-tooltip
        .for="btn${this.type}"
        position="${this.position}"
        offset="14"
      >
        ${this._link.title}
      </simple-tooltip>
    `;
  }
  /**
   * Mix in an opened status
   */
  static get properties() {
    return {
      ...super.properties,
      disabled: {
        type: Boolean,
        reflect: true,
      },
      _link: {
        type: Object,
      },
      href: {
        type: String,
      },
      icon: {
        type: String,
      },
      type: {
        type: String,
      },
      position: {
        type: String,
      },
    };
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    let needsGenerate = false;
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "type" || propName == "t") {
        needsGenerate = true;
      }
    });
    if (needsGenerate) {
      Promise.resolve().then(() => {
        this._generateLink(this.type);
      });
    }
  }
  /**
   * Generate a link when we get a new type.
   */
  _generateLink(newValue) {
    // remove existing if this is moving around
    if (this._link && this._link.href) {
      globalThis.document.head.removeChild(this._link);
    }
    if (newValue) {
      let link = globalThis.document.createElement("link");
      link.rel = "alternate";
      if (newValue === "rss") {
        link.href = "rss.xml";
        link.title = this.t.rssFeed;
        link.type = "application/rss+xml";
        this.icon = "communication:rss-feed";
      } else if (newValue === "atom") {
        link.href = "atom.xml";
        link.title = this.t.atomFeed;
        link.type = "application/atom+xml";
        this.icon = "communication:rss-feed";
      }
      this.href = link.href;
      globalThis.document.head.appendChild(link);
      this._link = link;
    }
  }
}
globalThis.customElements.define(SiteRSSButton.tag, SiteRSSButton);
export { SiteRSSButton };
