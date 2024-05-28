/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { HAXCMSThemeParts } from "../../core/utils/HAXCMSThemeParts.js";
import { HAXCMSI18NMixin } from "../../core/utils/HAXCMSI18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button.js";
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
        a {
          text-decoration: var(--site-rss-text-decoration);
          outline: none;
          color: var(--site-rss-button-color, inherit);
        }
        simple-icon-button-lite {
          color: var(--site-rss-button-color, inherit);
        }
        simple-tooltip {
          --simple-tooltip-background: var(
            --haxcms-tooltip-background-color,
            #000000
          );
          --simple-tooltip-opacity: 1;
          --simple-tooltip-text-color: var(--haxcms-tooltip-color, #ffffff);
          --simple-tooltip-delay-in: 0;
          --simple-tooltip-border-radius: 0;
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
      atomFeed: "ATOM Feed",
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
        ?disabled="${this.disabled}"
        tabindex="-1"
        href="${this.href}"
        .id="btn${this.type}"
        target="_blank"
        rel="noopener noreferrer"
        .part="${this.editMode ? `edit-mode-active` : ``}"
      >
        <simple-icon-button-lite
          icon="${this.icon}"
          label="${this._link.title}"
          @click="${this.print}"
          ?disabled="${this.disabled}"
          .part="${this.editMode ? `edit-mode-active` : ``}"
        ></simple-icon-button-lite>
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
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "type") {
        this._generateLink(this[propName]);
      }
      if (propName == "t") {
        this._generateLink(this.type);
      }
    });
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
customElements.define(SiteRSSButton.tag, SiteRSSButton);
export { SiteRSSButton };
