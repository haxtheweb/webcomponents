define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_dd67cc00dbb911e8a20e476acf0e8725() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style include="materializecss-styles">\n      :host {\n        display: block;\n        position: relative;\n        font-family: libre baskerville;\n        width: 3em;\n        --app-drawer-width: 300px;\n        --outline-player-dark: #222222;\n        --outline-player-light: #F8F8F8;\n      }\n\n      paper-icon-button {\n        --paper-icon-button-ink-color: var(--outline-player-dark);\n      }\n    </style>\n\n    <div id="container">\n      <paper-icon-button id="button" disabled="[[disabled]]" icon="[[icon]]"></paper-icon-button>\n      <paper-tooltip for="button" position="bottom" offset="14">\n        <slot></slot>\n      </paper-tooltip>\n    </div>\n'
    ]);
    _templateObject_dd67cc00dbb911e8a20e476acf0e8725 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_dd67cc00dbb911e8a20e476acf0e8725()
    ),
    is: "outline-player-arrow",
    behaviors: [MaterializeCSSBehaviors.ColorBehaviors],
    properties: {
      icon: { type: String, value: "icons:arrow-back" },
      disabled: { type: Boolean, value: !0, reflectToAttribute: !0 },
      sticky: { type: Boolean, value: !1, reflectToAttribute: !0 },
      __isNavSticky: {
        type: Boolean,
        value: !1,
        observer: "__isNavStickyChanged"
      },
      __originalPosition: { type: Number, value: 0 }
    },
    attached: function attached() {
      var _this = this;
      this.__originalPosition = this.__getElementOffset(this);
      var container = this.$.container;
      window.addEventListener("scroll", function() {
        if (_this.sticky) {
          _this.__calculateIsNavSticky();
          if (_this.__isNavSticky) {
            container.style.position = "absolute";
            container.style.top =
              window.pageYOffset - _this.__originalPosition.top + "px";
            container.style.left = _this.__originalPosition.left;
          }
        }
      });
    },
    resetPosition: function resetPosition() {
      var container = this.$.container;
      container.style.top = 0;
    },
    __isNavStickyChanged: function __isNavStickyChanged(isNavSticky) {
      console.log("is sticky", isNavSticky);
    },
    __calculateIsNavSticky: function __calculateIsNavSticky() {
      var position = window.pageYOffset;
      if (this.__originalPosition.top < position) {
        if (!this.__isNavSticky) {
          this.__isNavSticky = !0;
        }
      } else {
        if (this.__isNavSticky) {
          this.__isNavSticky = !1;
        }
      }
    },
    __getElementOffset: function __getElementOffset(element) {
      var de = document.documentElement,
        box = element.getBoundingClientRect(),
        top = box.top + window.pageYOffset - de.clientTop,
        left = box.left + window.pageXOffset - de.clientLeft;
      return { top: top, left: left };
    }
  });
});
