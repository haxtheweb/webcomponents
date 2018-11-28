define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/iron-icons/iron-icons.js",
  "../node_modules/@polymer/iron-icon/iron-icon.js",
  "../node_modules/@polymer/paper-button/paper-button.js",
  "../node_modules/@polymer/app-layout/app-drawer/app-drawer.js",
  "./hax-stax-browser.js"
], function(
  _polymerLegacy,
  _ironIcons,
  _ironIcon,
  _paperButton,
  _appDrawer,
  _haxStaxBrowser
) {
  "use strict";
  function _templateObject_f6aedbe0f32e11e8a4700dcc21fbc61a() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: block;\n      }\n      #dialog {\n        --app-drawer-width: 320px;\n        z-index: 1000;\n        margin-top: 64px;\n        @apply --hax-stax-picker-dialog;\n      }\n      #closedialog {\n        float: right;\n        top: 135px;\n        right: 0;\n        position: absolute;\n        padding: 4px;\n        margin: 0;\n        color: var(--simple-colors-light-green-background1, green);\n        background-color: transparent;\n        width: 40px;\n        height: 40px;\n        min-width: unset;\n      }\n      .title {\n        margin-top: 32px;\n        text-align: center;\n        padding: 16px;\n        margin: 0;\n        background-color: rgba(0, 0, 0, 0.5);\n        font-size: 32px;\n        font-weight: bold;\n        font-family: sans-serif;\n        text-transform: uppercase;\n        color: var(--simple-colors-light-green-background1);\n      }\n      app-drawer {\n        --app-drawer-content-container: {\n          background-color: rgba(0, 0, 0, 0.7);\n        };\n        --app-drawer-width: 320px;\n      }\n      .pref-container {\n        text-align: left;\n        padding: 16px;\n      }\n    </style>\n    <app-drawer id="dialog" align="left">\n      <h3 class="title">[[title]]</h3>\n      <div style="height: 100%; overflow: auto;" class="pref-container">\n        <hax-stax-browser id="staxbrowser"></hax-stax-browser>\n      </div>\n      <paper-button id="closedialog" on-tap="close">\n        <iron-icon icon="icons:cancel" title="Close dialog"></iron-icon>\n      </paper-button>\n    </app-drawer>\n'
    ]);
    _templateObject_f6aedbe0f32e11e8a4700dcc21fbc61a = function _templateObject_f6aedbe0f32e11e8a4700dcc21fbc61a() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_f6aedbe0f32e11e8a4700dcc21fbc61a()
    ),
    is: "hax-stax-picker",
    behaviors: [simpleColorsBehaviors],
    properties: { title: { type: String, value: "Templates" } },
    ready: function ready() {
      document.body.appendChild(this);
    },
    attached: function attached() {
      this.fire("hax-register-stax-picker", this);
    },
    open: function open() {
      this.$.staxbrowser.resetBrowser();
      this.$.dialog.open();
    },
    close: function close() {
      this.$.dialog.close();
    },
    toggleDialog: function toggleDialog() {
      if (this.$.dialog.opened) {
        this.close();
      } else {
        window.HaxStore.instance.closeAllDrawers(this);
      }
    }
  });
});
