define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@polymer/polymer/lib/utils/async.js"
], function(_exports, _polymerLegacy, async) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.IronA11yAnnouncer = void 0;
  async = babelHelpers.interopRequireWildcard(async);
  function _templateObject_a015dee0dea811e8ad2a17c8d2809574() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style>\n      :host {\n        display: inline-block;\n        position: fixed;\n        clip: rect(0px,0px,0px,0px);\n      }\n    </style>\n    <div aria-live$="[[mode]]">[[_text]]</div>\n'
      ],
      [
        '\n    <style>\n      :host {\n        display: inline-block;\n        position: fixed;\n        clip: rect(0px,0px,0px,0px);\n      }\n    </style>\n    <div aria-live\\$="[[mode]]">[[_text]]</div>\n'
      ]
    );
    _templateObject_a015dee0dea811e8ad2a17c8d2809574 = function() {
      return data;
    };
    return data;
  }
  var IronA11yAnnouncer = (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_a015dee0dea811e8ad2a17c8d2809574()
    ),
    is: "iron-a11y-announcer",
    properties: {
      mode: { type: String, value: "polite" },
      _text: { type: String, value: "" }
    },
    created: function created() {
      if (!IronA11yAnnouncer.instance) {
        IronA11yAnnouncer.instance = this;
      }
      document.body.addEventListener(
        "iron-announce",
        this._onIronAnnounce.bind(this)
      );
    },
    announce: function announce(text) {
      var _this = this;
      this._text = "";
      async.microTask.run(function() {
        _this._text = text;
      });
    },
    _onIronAnnounce: function _onIronAnnounce(event) {
      if (event.detail && event.detail.text) {
        this.announce(event.detail.text);
      }
    }
  });
  _exports.IronA11yAnnouncer = IronA11yAnnouncer;
  IronA11yAnnouncer.instance = null;
  IronA11yAnnouncer.requestAvailability = function() {
    document.addEventListener("DOMContentLoaded", function() {
      if (!IronA11yAnnouncer.instance) {
        IronA11yAnnouncer.instance = document.createElement(
          "iron-a11y-announcer"
        );
      }
      document.body.appendChild(IronA11yAnnouncer.instance);
    });
  };
});
