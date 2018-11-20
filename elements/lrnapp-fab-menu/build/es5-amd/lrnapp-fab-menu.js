define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@polymer/paper-fab/paper-fab.js",
  "./node_modules/@lrnwebcomponents/paper-fab-speed-dial/paper-fab-speed-dial.js",
  "./node_modules/@lrnwebcomponents/paper-fab-speed-dial/lib/paper-fab-speed-dial-overlay.js",
  "./node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_c86f1010ecf311e89d667bcb57897322() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n  <custom-style>\n    <style include="materializecss-styles-colors"></style>\n    <style>\n      .open,.overlay {\n        position: fixed;\n        bottom: var(--paper-fab-speed-dial-bottom, 16px);\n        right: var(--paper-fab-speed-dial-right, 16px);\n      }\n      .open {\n        --paper-fab-background: var(--paper-fab-speed-dial-background);\n        --paper-fab-keyboard-focus-background: var(--paper-fab-speed-dial-keyboard-focus-background);\n      }\n      .close {\n        --paper-fab-background: var(--paper-grey-500);\n        --paper-fab-keyboard-focus-background: var(--paper-grey-500);\n        margin-top: 20px;\n        display: inline-block;\n      }\n      .overlay {\n        text-align: right;\n      }\n    </style>\n  </custom-style>\n    <paper-fab icon="[[icon]]" class="open blue" on-tap="open" hidden$="[[opened]]" disabled$="[[disabled]]"></paper-fab>\n\n    <paper-fab-speed-dial-overlay class="overlay" opened="{{opened}}" with-backdrop>\n      <slot></slot>\n      <paper-fab icon="close" class="close" on-tap="close"></paper-fab>\n    </paper-fab-speed-dial-overlay>\n'
    ]);
    _templateObject_c86f1010ecf311e89d667bcb57897322 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_c86f1010ecf311e89d667bcb57897322()
    ),
    is: "lrnapp-fab-menu",
    properties: {
      icon: { type: String, value: "add" },
      opened: { type: Boolean, notify: !0 },
      disabled: { type: Boolean, value: !1 }
    },
    open: function open(e) {
      if (e) {
        e.preventDefault();
      }
      this.opened = !0;
    },
    close: function close(e) {
      if (e) {
        e.preventDefault();
      }
      this.opened = !1;
    }
  });
});
