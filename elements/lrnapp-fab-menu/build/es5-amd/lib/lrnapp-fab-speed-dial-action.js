define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/paper-fab/paper-fab.js",
  "../node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js",
  "../node_modules/@polymer/iron-flex-layout/iron-flex-layout-classes.js"
], function(
  _polymerLegacy,
  _paperFab,
  _materializecssStyles,
  _ironFlexLayoutClasses
) {
  "use strict";
  function _templateObject_1f6e8930f1e611e8b524ab5930811806() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style is="custom-style" include="iron-flex iron-flex-alignment materializecss-styles-colors"></style>\n    <style>\n      :host {\n        @apply --layout-horizontal;\n        @apply --layout-center;\n        @apply --layout-end-justified;\n        margin-top: 15px;\n        margin-right: 8px;\n        /** For IE11: otherwise the label overlays the FAB */\n        min-width: 270px;\n      }\n\n      .label {\n        color: black;\n        background: white;\n        padding: 0 16px;\n        border-radius: 4px;\n        margin-right: 24px;\n      }\n\n      .fab {\n        --lrnapp-fab-background: var(--lrnapp-fab-speed-dial-action-background);\n        --lrnapp-fab-keyboard-focus-background: var(--lrnapp-fab-speed-dial-action-keyboard-focus-background);\n      }\n\n      .label,.fab {\n        display: inline-block;\n      }\n    </style>\n\n    <div class="flex"><span class="label"><slot></slot></span></div>\n    <paper-fab class$="fab [[color]]" icon="[[icon]]" mini></paper-fab>\n'
    ]);
    _templateObject_1f6e8930f1e611e8b524ab5930811806 = function _templateObject_1f6e8930f1e611e8b524ab5930811806() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_1f6e8930f1e611e8b524ab5930811806()
    ),
    is: "lrnapp-fab-speed-dial-action",
    properties: {
      icon: { type: String, reflectToAttribute: !0 },
      color: { type: String, value: "blue", reflectToAttribute: !0 }
    }
  });
});
