define(["../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js"], function(
  _polymerDom
) {
  "use strict";
  window.PaperContactBehavior = {
    openInSameTab: function openInSameTab() {
      var value = this._getContent();
      if (value) {
        window.location.assign(encodeURI(this._getTargetUrl(value)));
      }
    },
    openInBlankTab: function openInBlankTab() {
      var value = this._getContent();
      if (value) {
        window.open(encodeURI(this._getTargetUrl(value), "_blank"));
      }
    },
    _getContent: function _getContent() {
      var items = (0, _polymerDom.dom)(this).getEffectiveChildNodes();
      if (0 >= items.length) {
        return null;
      }
      return (0, _polymerDom.dom)(items[0]).textContent;
    }
  };
});
