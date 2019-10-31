/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
/**
 * `site-rss-button`
 * `A button that references RSS feeds in a standards based way`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SiteRSSButton extends PolymerElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "site-rss-button";
  }
  constructor() {
    super();
    import("@polymer/paper-button/paper-button.js");
    import("@polymer/iron-icon/iron-icon.js");
    import("@polymer/iron-icons/communication-icons.js");
  }
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          font-size: 16px;
          color: var(--site-rss-color, #383f45);
        }
        a {
          text-decoration: var(--site-rss-text-decoration, none);
        }
        paper-button {
          text-transform: unset;
          color: white;
          background-color: var(--site-rss-bg-color, #383f45);
          font-size: var(--site-rss-font-size, 13px);
          margin: var(--site-rss-paper-button-margin, 0);
          border-radius: var(--site-rss-border-radius, 3px);
          padding: var(--site-rss-paper-button-padding, 0);
          @apply --site-rss-paper-button;
        }
        paper-button:hover,
        paper-button:focus,
        paper-button:active {
          background-color: var(--site-rss-bg-active, #2d3237);
        }
      </style>
      <a
        disabled$="[[disabled]]"
        tabindex="-1"
        href$="[[href]]"
        target="_blank"
        rel="noopener noreferrer"
      >
        <paper-button raised="[[raised]]">
          <iron-icon icon="[[icon]]"></iron-icon> [[label]]
        </paper-button>
      </a>
    `;
  }
  connectedCallback() {
    super.connectedCallback();
    if (window.ShadyCSS) {
      window.ShadyCSS.styleElement(this);
      window.ShadyCSS.styleDocument();
    }
  }
  /**
   * Mix in an opened status
   */
  static get properties() {
    return {
      disabled: {
        type: Boolean,
        reflectToAttribute: true
      },
      type: {
        type: String,
        value: "rss",
        observer: "_generateLink"
      },
      raised: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      }
    };
  }
  /**
   * Generate a link when we get a new type.
   */
  _generateLink(newValue, oldValue) {
    // remove existing if this is moving around
    if (this._link) {
      document.head.removeChild(this._link);
    }
    if (newValue) {
      let link = document.createElement("link");
      link.rel = "alternate";
      if (newValue === "rss") {
        link.href = "rss.xml";
        link.title = "RSS feed";
        link.type = "application/rss+xml";
        this.icon = "communication:rss-feed";
      } else if (newValue === "atom") {
        link.href = "atom.xml";
        link.title = "Atom feed";
        link.type = "application/atom+xml";
        this.icon = "communication:rss-feed";
      }
      this.label = link.title;
      this.href = link.href;
      document.head.appendChild(link);
      this._link = link;
    }
  }
}
window.customElements.define(SiteRSSButton.tag, SiteRSSButton);
export { SiteRSSButton };
