import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
/**
 * Contact elements can use this behavior to open a detail view on tap. The user needs to implement
 * a method _getTargetUrl() which returns the URL that is opened.
 *
 * @polymerBehavior window.PaperContactBehavior
 */
window.PaperContactBehavior = {
  /**
   * Opens the target URL in the same tab
   */
  openInSameTab: function(e) {
    const value = this._getContent();
    if (value) {
      window.location.assign(encodeURI(this._getTargetUrl(value)));
    }
  },

  /**
   * Opens the target URL in a new tab
   */
  openInBlankTab: function(e) {
    const value = this._getContent();
    if (value) {
      window.open(encodeURI(this._getTargetUrl(value), "_blank"));
    }
  },

  // Private methods
  _getContent: function(e) {
    // Content is stored as the text content of the element, e.g. <paper-contact-email>XXX</paper-contact-email>
    const items = dom(this).getEffectiveChildNodes();
    if (items.length <= 0) {
      return null;
    }
    return dom(items[0]).textContent;
  }
};
