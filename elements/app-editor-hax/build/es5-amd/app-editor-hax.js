define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "hax-body/hax-store.js",
  "hax-body/hax-body.js",
  "hax-body/hax-autoloader.js",
  "hax-body/hax-manager.js",
  "hax-body/hax-panel.js",
  "hax-body/hax-app-picker.js",
  "hax-body/hax-export-dialog.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_30d6b3a0e5f711e8ab221b9521378f9f() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style>\n      :host {\n        display: block;\n        font-size: 16px;\n        box-sizing: content-box;\n      }\n    </style>\n    <hax-store skip-exit-trap="" hidden="" app-store="[[appStoreConnection]]"></hax-store>\n    <hax-autoloader hidden=""></hax-autoloader>\n    <hax-panel id="panel" hide-panel-ops="" hide-export-button="" hide-preferences-button$="[[hidePreferencesButton]]" align="right"></hax-panel>\n    <hax-body id="body"></hax-body>\n    <hax-manager></hax-manager>\n    <hax-export-dialog></hax-export-dialog>\n    <hax-app-picker></hax-app-picker>\n'
      ],
      [
        '\n    <style>\n      :host {\n        display: block;\n        font-size: 16px;\n        box-sizing: content-box;\n      }\n    </style>\n    <hax-store skip-exit-trap="" hidden="" app-store="[[appStoreConnection]]"></hax-store>\n    <hax-autoloader hidden=""></hax-autoloader>\n    <hax-panel id="panel" hide-panel-ops="" hide-export-button="" hide-preferences-button\\$="[[hidePreferencesButton]]" align="right"></hax-panel>\n    <hax-body id="body"></hax-body>\n    <hax-manager></hax-manager>\n    <hax-export-dialog></hax-export-dialog>\n    <hax-app-picker></hax-app-picker>\n'
      ]
    );
    _templateObject_30d6b3a0e5f711e8ab221b9521378f9f = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_30d6b3a0e5f711e8ab221b9521378f9f()
    ),
    is: "app-editor-hax",
    properties: {
      appStoreConnection: { type: Object },
      hidePreferencesButton: { value: !1, type: Boolean }
    },
    save: function save() {
      var content = window.HaxStore.instance.activeHaxBody.haxToContent();
      this.fire("app-editor-hax-save", content);
    },
    import: function _import(html) {
      window.HaxStore.instance.activeHaxBody.importContent(html);
      this.fire("app-editor-hax-import", !0);
    }
  });
});
