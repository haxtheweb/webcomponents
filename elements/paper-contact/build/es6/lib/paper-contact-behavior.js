import { dom } from "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
window.PaperContactBehavior = {
  openInSameTab: function(e) {
    const value = this._getContent();
    if (value) {
      window.location.assign(encodeURI(this._getTargetUrl(value)));
    }
  },
  openInBlankTab: function(e) {
    const value = this._getContent();
    if (value) {
      window.open(encodeURI(this._getTargetUrl(value), "_blank"));
    }
  },
  _getContent: function(e) {
    const items = dom(this).getEffectiveChildNodes();
    if (0 >= items.length) {
      return null;
    }
    return dom(items[0]).textContent;
  }
};
