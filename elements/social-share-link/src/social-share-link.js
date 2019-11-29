/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-icons/iron-icons.js";
import "@lrnwebcomponents/social-media-icons/social-media-icons.js";

/**
 * `social-share-link`
 * @customElement social-share-link
 * `a link to share content on social`
 *
 * @microcopy - language worth noting:
 *  -
 *

 * @polymer
 * @demo demo/index.html
 */
class SocialShareLink extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "social-share-link";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
  // Observer title for changes

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
          (url !== null ? "&url=" + url : "") +
          (message !== null ? "&summary=" + message : "");
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
        link = message !== null ? "status=" + message + " " + url : url;
        link = link !== null ? "https://twitter.com/home?" + link : false;
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
