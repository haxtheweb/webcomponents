define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@polymer/paper-tabs/paper-tabs.js",
  "./node_modules/@polymer/marked-element/marked-element.js",
  "./node_modules/@polymer/iron-pages/iron-pages.js",
  "./lib/lrn-markdown-editor-editor.js"
], function(
  _polymerLegacy,
  _paperTabs,
  _markedElement,
  _ironPages,
  _lrnMarkdownEditorEditor
) {
  "use strict";
  function _templateObject_463c1e70f1e511e8939d293ee860b22b() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n       :host {\n        display: block;\n      }\n\n      #split-pane {\n        display: flex;\n      }\n\n      .split-pane>* {\n        flex: 1 1 auto;\n        min-height: 160px;\n      }\n\n      .preview-pane {\n        background: lightblue;\n      }\n\n      paper-card {\n        padding: 16px;\n        width: calc(100% - 32px);\n      }\n\n      paper-tabs {\n        background: #F5F5F5;\n        border-style: solid;\n        border-color: #DCDCDC;\n        border-width: 1px;\n        min-width: 500px;\n      }\n\n      marked-element.lrn-markdown-editor {\n        width: 100%;\n        word-wrap: break-word;\n      }\n\n      .container-flex {\n        display: flex;\n        flex-wrap: nowrap;\n      }\n\n      .split-pane .container-flex>* {\n        width: 50%;\n      }\n\n      .split-pane marked-element {\n        width: calc(100% - 32px);\n        min-width: 150px;\n        margin: 0 16px;\n        padding: 0 16px;\n        background: #FFF;\n        border-left: solid #DCDCDC 1px;\n      }\n    </style>\n\n    <div class="mtz-toolbar">\n      <paper-tabs selected="{{selected}}">\n        <paper-tab>Write</paper-tab>\n        <paper-tab>Preview</paper-tab>\n        <paper-tab>Split View</paper-tab>\n      </paper-tabs>\n    </div>\n\n    <iron-pages selected="{{selected}}">\n\n      <section>\n        <paper-card>\n          <lrn-markdown-editor-editor content="{{content}}"></lrn-markdown-editor-editor>\n        </paper-card>\n      </section>\n\n      <section>\n        <paper-card>\n          <marked-element markdown="{{content}}"></marked-element>\n        </paper-card>\n      </section>\n\n      <section class="split-pane">\n        <paper-card>\n          <div class="container-flex">\n            <lrn-markdown-editor-editor content="{{content}}"></lrn-markdown-editor-editor>\n            <marked-element class="preview-pane" markdown="{{content}}"></marked-element>\n          </div>\n        </paper-card>\n      </section>\n\n    </iron-pages>\n'
    ]);
    _templateObject_463c1e70f1e511e8939d293ee860b22b = function _templateObject_463c1e70f1e511e8939d293ee860b22b() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_463c1e70f1e511e8939d293ee860b22b()
    ),
    is: "lrn-markdown-editor",
    properties: {
      content: { type: String, notify: !0 },
      selected: { type: String, value: "0", reflectToAttribute: !0 },
      layout: { type: String, value: 0 },
      cookies: { type: Boolean, value: !0 },
      elReady: { type: Boolean, value: !1 }
    },
    observers: ["_selectedChanged(selected)"],
    _selectedChanged: function _selectedChanged(selected) {
      var root = this,
        cookieName = root._getCookieName();
      if (2 === selected) {
        root._createCookie(cookieName, "true", "30");
      } else if (2 !== selected && !0 === root.elReady) {
        root._eraseCookie(cookieName);
      }
    },
    _createCookie: function _createCookie(name, value, days) {
      var expires = "";
      if (days) {
        var date = new Date();
        date.setTime(date.getTime() + 1e3 * (60 * (60 * (24 * days))));
        expires = "; expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + value + expires + "; path=/";
    },
    _readCookie: function _readCookie(name) {
      for (
        var nameEQ = name + "=", ca = document.cookie.split(";"), i = 0, c;
        i < ca.length;
        i++
      ) {
        c = ca[i];
        while (" " == c.charAt(0)) {
          c = c.substring(1, c.length);
        }
        if (0 == c.indexOf(nameEQ)) return c.substring(nameEQ.length, c.length);
      }
      return null;
    },
    _eraseCookie: function _eraseCookie(name) {
      this._createCookie(name, "", -1);
    },
    _getCookieName: function _getCookieName() {
      return "lrnmarkdowneditorsplitview";
    },
    ready: function ready() {
      var root = this;
      root.elReady = !0;
      var cookieName = root._getCookieName(),
        cookie = root._readCookie(cookieName);
      if (cookie && "true" === cookie) {
        root.selected = 2;
      }
    }
  });
});
