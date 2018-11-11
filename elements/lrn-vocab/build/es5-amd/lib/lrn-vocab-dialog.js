define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/paper-dialog/paper-dialog.js",
  "../node_modules/@polymer/iron-icons/iron-icons.js",
  "../node_modules/@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js",
  "../node_modules/@polymer/paper-icon-button/paper-icon-button.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_04415cd0e5f911e89b531df1ff6ecd3d() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n        <style>\n          :host {\n            display: block;\n            position: relative;\n          }\n          paper-dialog {\n            display: block;\n            margin: auto;\n            width: 80%;\n            height: auto;\n            z-index: 1000;\n          }\n          .close_button {\n            display: flex;\n            flex-direction: row-reverse;\n            margin-top: 0;\n            background-color: #20427b;\n            color: #fff;\n            padding: 8px;\n          }\n        </style>\n        <paper-dialog id="dialog" with-backdrop="" opened="{{opened}}">\n          <div class="close_button">\n            <paper-icon-button icon="cancel" dialog-dismiss=""></paper-icon-button>\n          </div>\n          <paper-dialog-scrollable>\n            <slot></slot>\n          </paper-dialog-scrollable>\n        </paper-dialog>\n'
    ]);
    _templateObject_04415cd0e5f911e89b531df1ff6ecd3d = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_04415cd0e5f911e89b531df1ff6ecd3d()
    ),
    is: "lrn-vocab-dialog",
    listeners: {
      "iron-overlay-closed": "_modalClosed",
      "iron-overlay-opened": "_resizeContent",
      "iron-overlay-canceled": "_changeOpen"
    },
    properties: { opened: { type: Boolean, value: !1, notify: !0 } },
    attached: function attached() {
      if (this.bodyAppend && !this._bodyAppended) {
        this._bodyAppended = !0;
        document.body.appendChild(this);
      }
    },
    _modalClosed: function _modalClosed(e) {
      this._changeOpen(e);
      this.fire("lrn-vocab-dialog-closed", this);
    },
    _resizeContent: function _resizeContent(e) {
      var evt = document.createEvent("UIEvents");
      evt.initUIEvent("resize", !0, !1, window, 0);
      window.dispatchEvent(evt);
      this._changeOpen(e);
    },
    _changeOpen: function _changeOpen(e) {
      e.stopPropagation();
      if (e.srcElement === this.$.dialog) {
        this.opened = "iron-overlay-opened" === e.type;
        this.fire("lrn-vocab-dialog-changed", this);
      }
    }
  });
});
