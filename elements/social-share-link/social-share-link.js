/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css, LitElement } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";

/**
 * `social-share-link`
 * `a link to share content on social`
 * @demo demo/index.html
 * @element social-share-link
 */
class SocialShareLink extends LitElement {
  //styles function
  static get styles() {
    return [
      css`
        :host {
          display: inline;
        }

        :host([hidden]) {
          display: none;
        }

        a {
          display: inline-flex;
          align-items: center;
          color: var(--social-share-link-color, inherit);
          transition: all 0.6s ease-in-out;
          margin: 5px;
          padding: var(--social-share-button-padding, 0px);
          border-radius: var(--social-share-button-border-radius, 0px);
        }

        a:visited {
          color: var(--social-share-visited-link-color, inherit);
        }

        a:focus,
        a:hover {
          color: var(--social-share-link-hover-color, inherit);
        }

        /* issues#3102 DDD: mechanical swaps of the hardcoded #ddd/#666/
           #0066ff/#0044ee and white keywords to DDD design tokens.
           The :host([disabled]) selectors are now reachable because
           disabled is reflected onto the host (issues#3102 #21). */
        :host([disabled]) a,
        :host([disabled]) a:focus,
        :host([disabled]) a:hover,
        :host([disabled]) a:visited {
          color: var(
            --social-share-disabled-link-color,
            var(--ddd-theme-default-limestoneGray)
          );
        }

        :host([button-style]) a {
          padding: var(--social-share-button-padding, 5px 10px);
          border-radius: var(--social-share-button-border-radius, 3px);
          color: var(
            --social-share-button-color,
            var(--ddd-theme-default-white)
          );
          background-color: var(
            --social-share-button-bg,
            var(--ddd-theme-default-link)
          );
          text-decoration: none;
          transition: all 0.6s ease-in-out;
        }

        :host([button-style]) a:visited {
          color: var(
            --social-share-visited-button-color,
            var(--ddd-theme-default-white)
          );
        }

        :host([button-style]) a:focus,
        :host([button-style]) a:hover {
          color: var(
            --social-share-button-hover-color,
            var(--ddd-theme-default-white)
          );
          background-color: var(
            --social-share-button-hover-bg,
            var(--ddd-theme-default-nittanyNavy)
          );
        }

        :host([button-style][disabled]) a,
        :host([button-style][disabled]) a:focus,
        :host([button-style][disabled]) a:hover,
        :host([button-style][disabled]) a:visited {
          color: var(
            --social-share-disabled-button-color,
            var(--ddd-theme-default-limestoneGray)
          );
          background-color: var(
            --social-share-disabled-button-bg,
            var(--ddd-theme-default-coalyGray)
          );
        }

        simple-icon-lite {
          margin-right: 5px;
        }

        a.text-only simple-icon-lite {
          display: none;
        }

        a.icon-only .linktext {
          position: absolute;
          left: -999999px;
          top: 0;
          height: 0;
          width: 0;
          overflow: hidden;
        }

        a.icon-only simple-icon-lite {
          margin-right: 0;
        }
      `,
    ];
  }

  // render function
  render() {
    return html` <a
      href="${this.__href}"
      aria-disabled="${this.disabled || !this.__href}"
      class="${this.mode}"
      rel="noopener noreferrer"
      target="_blank"
      @click="${this._clickShare}"
    >
      <simple-icon-lite
        ?dark="${this.dark}"
        contrast="4"
        aria-hidden="true"
        icon="${this.__icon}"
        ?hidden="${!this.__showIcon}"
      ></simple-icon-lite>
      <span class="linktext">${this.__linkText}</span>
    </a>`;
  }
  /**
   * issues#3102 #21: a disabled share link (nothing to share) must not
   * navigate; the disabled attribute itself lands on the host via the
   * reflected disabled property so :host([disabled]) styling applies.
   */
  _clickShare(e) {
    if (!this.__href) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      /**
       * display link as a button
       */
      buttonStyle: {
        type: Boolean,
        reflect: true,
        attribute: "button-style",
      },
      /**
       * render in dark mode; forwarded to the icon. issues#3102 DDD:
       * this was undeclared, which made the ?dark render binding dead
       * and left the element unable to respond to dark mode.
       */
      dark: {
        type: Boolean,
        reflect: true,
      },
      /**
       * true when there is nothing to share (no usable href). Reflected
       * onto the host so the :host([disabled]) styling is reachable
       * (issues#3102 #21).
       */
      disabled: {
        type: Boolean,
        reflect: true,
      },
      /**
       * optional image to attach to the share
       * (Pinterest only)
       */
      image: {
        type: String,
      },
      /**
       * the message to attach to the social share
       * (not used in Facebook)
       */
      message: {
        type: String,
      },
      /**
       * optional display mode for the link,"text-only" or "icon-only";
       * default is to dislay both an icon and text
       */
      mode: {
        type: String,
      },
      /**
       * the link text; if null, the text will be "Share on (type of social)"
       */
      text: {
        type: String,
      },
      /**
       * the type of social; currently supports
       * Facebook, LinkedIn, Pinterest, and Twitter (default)
       */
      type: {
        type: String,
      },
      /**
       * the url to share
       */
      url: {
        type: String,
      },
      /**
       * the href for the link
       */
      __href: {
        type: String,
      },
      /**
       * the icon name for the link
       */
      __icon: {
        type: String,
      },
      /**
       * the link text specified, or the default link text
       */
      __linkText: {
        type: String,
      },
      __showIcon: {
        type: Boolean,
      },
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "social-share-link";
  }
  constructor() {
    super();
    this.buttonStyle = false;
    this.dark = false;
    this.disabled = false;
    this.image = "";
    this.message = "";
    this.mode = null;
    this.text = null;
    this.type = "Twitter";
    this.url = null;
  }

  willUpdate(changedProperties) {
    if (super.willUpdate) {
      super.willUpdate(changedProperties);
    }
    // derive the internal __icon / __linkText / __href / __showIcon state in
    // willUpdate so the reactive sets batch into the current update cycle
    // instead of scheduling a second one (Lit change-in-update warning)
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "type") {
        this.__icon = this._getIcon(this.type);
      }
      if (["text", "type"].includes(propName)) {
        this.__linkText = this._getLinkText(this.text, this.type);
      }
      if (["image", "message", "type", "url"].includes(propName)) {
        this.__href = this._getHref(
          this.image,
          this.message,
          this.type,
          this.url,
        );
        // issues#3102 #21: reflect disabled onto the host so the
        // :host([disabled]) styling is actually reachable; the old
        // ?disabled binding landed on the inner <a>, which no CSS
        // selector targeted (and encodeURI(false) used to coerce __href
        // to the truthy string "false" so it could never be true anyway)
        this.disabled = !this.__href;
      }
      if (propName == "mode") {
        // issues#3102 #22: the documented default (no mode) displays BOTH
        // the icon and text; only text-only hides the icon (the CSS
        // already hides it via a.text-only as well)
        this.__showIcon = this.mode !== "text-only";
      }
    });
  }
  /**
   * returns the href
   *
   * @param {string} optional image url (Pinterest only)
   * @param {string} the message (not for Facebook)
   * @param {string} the type of link (Twitter by default)
   * @param {string} the url
   * @returns {string} the link
   */
  _getHref(image, message, type, url) {
    let link;
    switch (type) {
      case "Facebook":
        // issues#3102 #21: with no url there is nothing to share; return an
        // empty string (never false) so encodeURI cannot coerce to the
        // truthy string "false" and the link is properly disabled
        link = url ? "https://www.facebook.com/sharer/sharer.php?u=" + url : "";
        break;
      case "LinkedIn":
        // issues#3102 #54: url defaults to null; truthiness guards replace
        // the dead "link !== null" ternaries and never concatenate "null".
        // A missing url still degrades to the bare share endpoint.
        link =
          "https://www.linkedin.com/shareArticle?mini=true" +
          (url ? "&url=" + url : "");
        break;
      case "Pinterest": {
        // issues#3102 #23/#54: message and image default to "" (NOT null),
        // so the old !== null checks always appended empty &description= /
        // &media= params; only build params that actually have values
        const params = [];
        if (url) {
          params.push("url=" + url);
        }
        if (message) {
          params.push("description=" + message);
        }
        if (image) {
          params.push("media=" + image);
        }
        link =
          params.length > 0
            ? "http://pinterest.com/pin/create/button/?" + params.join("&")
            : "";
        break;
      }
      case "Twitter":
        // issues#3102 #23: truthiness guards keep a missing message/url
        // from concatenating the literal string "null" into the intent
        // query (the constructor defaults are "" and null, not strings)
        if (message && url) {
          link = "http://twitter.com/intent/tweet?text=" + message + " " + url;
        } else if (message) {
          link = "http://twitter.com/intent/tweet?text=" + message;
        } else if (url) {
          link = "http://twitter.com/intent/tweet?text=" + url;
        } else {
          link = "";
        }
        break;
      default:
        // issues#3102 #23: an unknown type used to leave link undefined,
        // and encodeURI(undefined) produced the navigable string
        // "undefined"; an unrecognized type now yields an empty, disabled
        // link
        link = "";
        break;
    }
    return encodeURI(link);
  }
  /**
   * gets the link text or a default
   *
   * @param {string} the link text
   * @param {string} the link type
   * @returns {string} the link text or a default "Share via (type)"
   */
  _getLinkText(text, type) {
    return text !== null ? text : "Share via " + type;
  }
  /**
   * returns the icon name
   *
   * @param {string} the link type
   * @returns {string} the icon name
   */
  _getIcon(type) {
    return "mdi-social:" + type.toLowerCase();
  }
}
globalThis.customElements.define(SocialShareLink.tag, SocialShareLink);
export { SocialShareLink };
