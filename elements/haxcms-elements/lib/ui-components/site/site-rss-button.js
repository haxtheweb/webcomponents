/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 * `site-rss-button`
 * `A button that references RSS feeds in a standards based way`
 *

 */
class SiteRSSButton extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          color: inherit;
        }
        a {
          text-decoration: var(--site-rss-text-decoration);
          outline: none;
        }
        paper-icon-button {
          color: grey;
        }
      `
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
    this.type = "rss";
    this.raised = false;
    this.position = "bottom";
    import("@polymer/paper-icon-button/paper-icon-button.js");
    import("@polymer/iron-icon/iron-icon.js");
    import("@polymer/iron-icons/communication-icons.js");
    import("@lrnwebcomponents/simple-tooltip/simple-tooltip.js");
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
        .aria-title="${this.label}"
      >
        <paper-icon-button
          icon="${this.icon}"
          @click="${this.print}"
          .aria-title="${this.label}"
          ?disabled="${this.disabled}"
        ></paper-icon-button>
      </a>
      <simple-tooltip
        .for="btn${this.type}"
        position="${this.position}"
        offset="14"
      >
        ${this.label}
      </simple-tooltip>
    `;
  }
  createRenderRoot() {
    return this;
  }
  /**
   * Mix in an opened status
   */
  static get properties() {
    return {
      disabled: {
        type: Boolean,
        reflect: true
      },
      label: {
        type: String
      },
      href: {
        type: String
      },
      icon: {
        type: String
      },
      type: {
        type: String
      },
      position: {
        type: String
      }
    };
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "type") {
        this._generateLink(this[propName], oldValue);
      }
    });
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
