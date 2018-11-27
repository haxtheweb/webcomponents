define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@lrnwebcomponents/hax-body/lib/hax-store.js",
  "./node_modules/@lrnwebcomponents/hax-body/hax-body.js",
  "./node_modules/@lrnwebcomponents/hax-body/lib/hax-autoloader.js",
  "./node_modules/@lrnwebcomponents/hax-body/lib/hax-manager.js",
  "./node_modules/@lrnwebcomponents/hax-body/lib/hax-panel.js",
  "./node_modules/@lrnwebcomponents/hax-body/lib/hax-app-picker.js",
  "./node_modules/@lrnwebcomponents/hax-body/lib/hax-export-dialog.js"
], function(
  _polymerLegacy,
  _haxStore,
  _haxBody,
  _haxAutoloader,
  _haxManager,
  _haxPanel,
  _haxAppPicker,
  _haxExportDialog
) {
  "use strict";
  function _templateObject_0030c0c0f1e511e8bbb53d074af53dd1() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style>\n      :host {\n        display: block;\n        font-size: 16px;\n        box-sizing: content-box;\n      }\n    </style>\n    <hax-store skip-exit-trap="" hidden="" app-store="[[appStoreConnection]]"></hax-store>\n    <hax-autoloader hidden=""></hax-autoloader>\n    <hax-panel id="panel" hide-panel-ops="" hide-export-button="" hide-preferences-button$="[[hidePreferencesButton]]" align="right"></hax-panel>\n    <hax-body id="body"></hax-body>\n    <hax-manager></hax-manager>\n    <hax-export-dialog></hax-export-dialog>\n    <hax-app-picker></hax-app-picker>\n'
      ],
      [
        '\n    <style>\n      :host {\n        display: block;\n        font-size: 16px;\n        box-sizing: content-box;\n      }\n    </style>\n    <hax-store skip-exit-trap="" hidden="" app-store="[[appStoreConnection]]"></hax-store>\n    <hax-autoloader hidden=""></hax-autoloader>\n    <hax-panel id="panel" hide-panel-ops="" hide-export-button="" hide-preferences-button\\$="[[hidePreferencesButton]]" align="right"></hax-panel>\n    <hax-body id="body"></hax-body>\n    <hax-manager></hax-manager>\n    <hax-export-dialog></hax-export-dialog>\n    <hax-app-picker></hax-app-picker>\n'
      ]
    );
    _templateObject_0030c0c0f1e511e8bbb53d074af53dd1 = function _templateObject_0030c0c0f1e511e8bbb53d074af53dd1() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_0030c0c0f1e511e8bbb53d074af53dd1()
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
