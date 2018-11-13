define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js",
  "./lib/fancy-carousel-behaviour.js",
  "./lib/fancy-carousel-shared-styles.js"
], function(_polymerLegacy, _polymerDom) {
  "use strict";
  function _templateObject_b8127ec0e70611e8a3fb833e5acba71d() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style include="fancy-carousel-shared-styles">\n      :host {\n        display: block;\n        position: relative;\n        overflow: hidden;\n        width: 100%;\n        contain: content;\n      }\n\n      :host(:after) {\n        display: block;\n        content: \'\';\n        padding-top: 75%; /* 4:3 = height is 75% of width */\n      }\n\n      #prevBtn {\n        left: 12px;\n        z-index: 1000;\n      }\n\n      #nextBtn {\n        right: 12px;\n        z-index: 1000;\n      }\n    </style>\n\n    <div id="content-wrapper">\n      <slot></slot>\n    </div>\n\n    <button id="prevBtn" on-click="previous">\u276E</button>\n    <button id="nextBtn" on-click="next">\u276F</button>\n'
    ]);
    _templateObject_b8127ec0e70611e8a3fb833e5acba71d = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_b8127ec0e70611e8a3fb833e5acba71d()
    ),
    is: "fancy-carousel",
    behaviors: [FancyCarouselBehaviour],
    properties: {
      selected: { observer: "_selectedChanged" },
      imageTopic: { type: String },
      searchEngineCx: { type: String },
      apiKey: { type: String },
      transitionType: { value: "default", type: String, notify: !0 },
      noControls: { type: Boolean, value: !1 },
      transitionTimer: { type: Number, value: 0, observer: "_timerChanged" }
    },
    attached: function attached() {
      this._resetZIndex((0, _polymerDom.dom)(this).children);
      this.selected = (0, _polymerDom.dom)(this).querySelectorAll("img")[0];
      if (this.selected) {
        this.selected.style.zIndex = "100";
      }
      if (this.noControls) {
        this.$.prevBtn.style.display = "none";
        this.$.nextBtn.style.display = "none";
      }
      if (this.imageTopic) {
        this._loadCustomImages(this.imageTopic);
      }
      this._preloadAnimationSprites();
    },
    previous: function previous() {
      var elem = this.selected.previousElementSibling;
      while (elem && "dummy" === elem.getAttribute("class")) {
        elem = elem.previousElementSibling;
      }
      if (elem && !this._touchDir) {
        this._startTransition(-1, this.selected, elem);
      }
    },
    next: function next() {
      var elem = this._getNextElement();
      if (elem && !this._touchDir) {
        this._startTransition(1, this.selected, elem);
      }
    }
  });
});
