/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css, LitElement } from "lit-element/lit-element.js";
import "@polymer/iron-icon/iron-icon.js";
import "@lrnwebcomponents/social-media-icons/social-media-icons.js";

/**
 * `social-share-link`
 * `a link to share content on social`
 * @demo demo/index.html
 * @customElement social-share-link
 */
class SocialShareLink extends LitElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

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
    this.image = '';
    this.message = '';
    this.mode = null;
    this.text = null;
    this.type = "Twitter"
    this.url = null;
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == 'type') {
        this.__icon = this._getIcon(this.type);
      }
      if (['text', 'type'].includes(propName)) {
        this.__linkText = this._getLinkText(this.text, this.type);
      }
      if (['image', 'message', 'type', 'url'].includes(propName)) {
        this.__href = this._getHref(this.image, this.message, this.type, this.url);
      }
      if (propName == 'mode') {
        this.__showIcon = (this.mode == 'icon-only' ? true : false);
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
        link =
          (url !== null ? "&url=" + url : "");
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
        link = link !== null ? "http://twitter.com/intent/tweet?" + link : false;
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
    return "social-media:" + type.toLowerCase();
  }
}
window.customElements.define(SocialShareLink.tag, SocialShareLink);
export { SocialShareLink };
