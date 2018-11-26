define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/paper-button/paper-button.js"
], function(_polymerLegacy, _paperButton) {
  "use strict";
  function _templateObject_4748b4a0f1b211e8aa64fd4892676eca() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style is="custom-style">\n      :host {\n        display: block;\n        width: 100%;\n        position: relative;\n        overflow: hidden;\n      }\n      .background-closer-image {\n        position: absolute;\n        top: 0;\n        left: 0;\n        right: 0;\n        bottom: 0;\n        text-indent: -9999px;\n        background-size: cover;\n        background-repeat: no-repeat;\n        background-position: center;\n        opacity: .4;\n        transition: all .6s linear;\n      }\n      .background-closer-image-wrap {\n        position: absolute;\n        background-color: rgba(0, 0, 0, .9);\n        top: 0;\n        left: 0;\n        right: 0;\n        bottom: 0;\n        text-indent: -9999px;\n        transition: all .6s linear;\n        opacity: 1;\n      }\n      :host([active]) .background-closer-image {\n        opacity: .8;\n      }\n      :host([active]) .background-closer-image-wrap {\n        background-color: rgba(0, 0, 0, .2);\n      }\n      .inner {\n        width: 100%;\n        position: relative;\n        z-index: 99;\n        max-width: 640px;\n        padding: 120px 0 90px;\n        text-align: center;\n        margin: 0 auto;\n      }\n      .blog-title {\n        margin: 0;\n        padding: 0 0 10px;\n        font-size: 50px;\n        text-align: center;\n        font-weight: 700;\n        letter-spacing: -2px;\n        outline: 0;\n        line-height: 50px;\n        word-break: break-word;\n        color: white;\n        text-shadow: 0 1px 16px rgba(0,0,0,.5), 0 0 1px rgba(0,0,0,.5);\n      }\n      .blog-description {\n        margin: 0 0 50px;\n        padding: 0 32px;\n        font-size: 18px;\n        line-height: 1.5;\n        color: white;\n        text-align: center;\n        font-weight: 400;\n        text-shadow: 0 1px 16px rgba(0,0,0,.5), 0 0 1px rgba(0,0,0,.5);\n      }\n      .back {\n        display: inline-block;\n        text-align: center;\n        letter-spacing: -.32px;\n        font-size: 15px;\n        font-weight: 400;\n        font-style: normal;\n        text-decoration: none;\n        cursor: pointer;\n        height: 44px;\n        background: #57ad68;\n        color: white;\n        vertical-align: middle;\n        box-sizing: border-box;\n        border-radius: 50%;\n        line-height: 44px;\n        padding: 0 18px;\n      }\n    </style>\n    <div class="background-closer-image-wrap">\n      <div class="background-closer-image" style$="background-image: url([[manifest.metadata.image]])">\n      </div>\n    </div>\n    <div class="inner">\n      <h1 class="blog-title">[[manifest.title]]</h1>\n      <h2 class="blog-description">[[manifest.description]]</h2>\n      <paper-button id="backbutton" class="back" raised="[[active]]" on-tap="_backButtonTap">Back to main site</paper-button>\n    </div>\n'
      ],
      [
        '\n    <style is="custom-style">\n      :host {\n        display: block;\n        width: 100%;\n        position: relative;\n        overflow: hidden;\n      }\n      .background-closer-image {\n        position: absolute;\n        top: 0;\n        left: 0;\n        right: 0;\n        bottom: 0;\n        text-indent: -9999px;\n        background-size: cover;\n        background-repeat: no-repeat;\n        background-position: center;\n        opacity: .4;\n        transition: all .6s linear;\n      }\n      .background-closer-image-wrap {\n        position: absolute;\n        background-color: rgba(0, 0, 0, .9);\n        top: 0;\n        left: 0;\n        right: 0;\n        bottom: 0;\n        text-indent: -9999px;\n        transition: all .6s linear;\n        opacity: 1;\n      }\n      :host([active]) .background-closer-image {\n        opacity: .8;\n      }\n      :host([active]) .background-closer-image-wrap {\n        background-color: rgba(0, 0, 0, .2);\n      }\n      .inner {\n        width: 100%;\n        position: relative;\n        z-index: 99;\n        max-width: 640px;\n        padding: 120px 0 90px;\n        text-align: center;\n        margin: 0 auto;\n      }\n      .blog-title {\n        margin: 0;\n        padding: 0 0 10px;\n        font-size: 50px;\n        text-align: center;\n        font-weight: 700;\n        letter-spacing: -2px;\n        outline: 0;\n        line-height: 50px;\n        word-break: break-word;\n        color: white;\n        text-shadow: 0 1px 16px rgba(0,0,0,.5), 0 0 1px rgba(0,0,0,.5);\n      }\n      .blog-description {\n        margin: 0 0 50px;\n        padding: 0 32px;\n        font-size: 18px;\n        line-height: 1.5;\n        color: white;\n        text-align: center;\n        font-weight: 400;\n        text-shadow: 0 1px 16px rgba(0,0,0,.5), 0 0 1px rgba(0,0,0,.5);\n      }\n      .back {\n        display: inline-block;\n        text-align: center;\n        letter-spacing: -.32px;\n        font-size: 15px;\n        font-weight: 400;\n        font-style: normal;\n        text-decoration: none;\n        cursor: pointer;\n        height: 44px;\n        background: #57ad68;\n        color: white;\n        vertical-align: middle;\n        box-sizing: border-box;\n        border-radius: 50%;\n        line-height: 44px;\n        padding: 0 18px;\n      }\n    </style>\n    <div class="background-closer-image-wrap">\n      <div class="background-closer-image" style\\$="background-image: url([[manifest.metadata.image]])">\n      </div>\n    </div>\n    <div class="inner">\n      <h1 class="blog-title">[[manifest.title]]</h1>\n      <h2 class="blog-description">[[manifest.description]]</h2>\n      <paper-button id="backbutton" class="back" raised="[[active]]" on-tap="_backButtonTap">Back to main site</paper-button>\n    </div>\n'
      ]
    );
    _templateObject_4748b4a0f1b211e8aa64fd4892676eca = function _templateObject_4748b4a0f1b211e8aa64fd4892676eca() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_4748b4a0f1b211e8aa64fd4892676eca()
    ),
    is: "simple-blog-footer",
    listeners: {
      mousedown: "_activate",
      mouseover: "_activate",
      mouseout: "_deactivate",
      focusin: "_activate",
      focusout: "_deactivate"
    },
    properties: {
      manifest: { type: Object },
      active: { type: Boolean, value: !1, reflectToAttribute: !0 }
    },
    _backButtonTap: function _backButtonTap(e) {
      this.fire("active-item-reset", null);
    },
    _activate: function _activate(e) {
      this.active = !0;
    },
    _deactivate: function _deactivate(e) {
      this.active = !1;
    }
  });
});
