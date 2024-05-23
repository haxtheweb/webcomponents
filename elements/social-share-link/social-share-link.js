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
          transition: all 0.5s;
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

        :host([disabled]) a,
        :host([disabled]) a:focus,
        :host([disabled]) a:hover,
        :host([disabled]) a:visited {
          color: var(--social-share-disabled-link-color, #ddd);
        }

        :host([button-style]) a {
          padding: var(--social-share-button-padding, 5px 10px);
          border-radius: var(--social-share-button-border-radius, 3px);
          color: var(--social-share-button-color, white);
          background-color: var(--social-share-button-bg, #0066ff);
          text-decoration: none;
          transition: all 0.5s;
        }

        :host([button-style]) a:visited {
          color: var(--social-share-visited-button-color, white);
        }

        :host([button-style]) a:focus,
        :host([button-style]) a:hover {
          color: var(--social-share-button-hover-color, white);
          background-color: var(--social-share-button-hover-bg, #0044ee);
        }

        :host([button-style][disabled]) a,
        :host([button-style][disabled]) a:focus,
        :host([button-style][disabled]) a:hover,
        :host([button-style][disabled]) a:visited {
          color: var(--social-share-disabled-button-color, #ddd);
          background-color: var(--social-share-disabled-button-bg, #666);
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
      ?disabled="${!this.__href}"
      class="${this.mode}"
      rel="noopener noreferrer"
      target="_blank"
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
    this.image = "";
    this.message = "";
    this.mode = null;
    this.text = null;
    this.type = "Twitter";
    this.url = null;
  }

  updated(changedProperties) {
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
      }
      if (propName == "mode") {
        this.__showIcon = this.mode == "icon-only" ? true : false;
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
        link =
          url !== null
            ? "https://www.facebook.com/sharer/sharer.php?u=" + url
            : false;
        break;
      case "LinkedIn":
        link = url !== null ? "&url=" + url : "";
        link =
          link !== null
            ? "https://www.linkedin.com/shareArticle?mini=true" + link
            : false;
        break;
      case "Pinterest":
        link =
          (url !== null ? "&url=" + url : "") +
          (message !== null ? "&description=" + message : "") +
          (image !== null ? "&media=" + image : "");
        link =
          link !== null
            ? "http://pinterest.com/pin/create/button/?" + link.substring(1)
            : false;
        break;
      case "Twitter":
        link = message !== null ? "text=" + message + " " + url : url;
        link =
          link !== null ? "http://twitter.com/intent/tweet?" + link : false;
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
customElements.define(SocialShareLink.tag, SocialShareLink);
export { SocialShareLink };
