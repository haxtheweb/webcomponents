define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js",
  "../node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js",
  "../node_modules/@polymer/paper-icon-button/paper-icon-button.js",
  "../node_modules/@polymer/iron-icons/iron-icons.js",
  "./a11y-collapse-button-styles.js",
  "../node_modules/@polymer/paper-tooltip/paper-tooltip.js"
], function(
  _polymerLegacy,
  _HAXWiring,
  _schemaBehaviors,
  _paperIconButton,
  _ironIcons,
  _a11yCollapseButtonStyles,
  _paperTooltip
) {
  "use strict";
  function _templateObject_a497ea10f32c11e8be2e771495816713() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style include="a11y-collapse-button-styles">\n      :host #expand:focus,\n      :host #expand:hover {\n        @apply --a11y-collapse-icon-focus;\n      }\n    </style>\n    <div id="heading">\n      <div id="text"><slot></slot></div>\n      <paper-icon-button id="expand" alt$="[[label]]" aria-controls="content" aria-expanded$="[[exanded]]" disabled$="[[disabled]]" label$="[[label]]" icon$="[[icon]]" rotated$="[[rotated]]">\n      </paper-icon-button>\n      <paper-tooltip for="expand">[[tooltip]]</paper-tooltip>\n    </div>\n'
      ],
      [
        '\n    <style include="a11y-collapse-button-styles">\n      :host #expand:focus,\n      :host #expand:hover {\n        @apply --a11y-collapse-icon-focus;\n      }\n    </style>\n    <div id="heading">\n      <div id="text"><slot></slot></div>\n      <paper-icon-button id="expand" alt\\$="[[label]]" aria-controls="content" aria-expanded\\$="[[exanded]]" disabled\\$="[[disabled]]" label\\$="[[label]]" icon\\$="[[icon]]" rotated\\$="[[rotated]]">\n      </paper-icon-button>\n      <paper-tooltip for="expand">[[tooltip]]</paper-tooltip>\n    </div>\n'
      ]
    );
    _templateObject_a497ea10f32c11e8be2e771495816713 = function _templateObject_a497ea10f32c11e8be2e771495816713() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_a497ea10f32c11e8be2e771495816713()
    ),
    is: "a11y-collapse-icon-button",
    behaviors: [HAXBehaviors.PropertiesBehaviors, SchemaBehaviors.Schema],
    properties: {
      disabled: { type: Boolean, value: !1, reflectToAttribute: !0 },
      expanded: { type: Boolean, value: !1, reflectToAttribute: !0 },
      icon: { type: String, value: "icons:expand-more" },
      label: { type: String, value: "expand/collapse" },
      tooltip: { type: String, value: "toggle expand/collapse" },
      rotated: { type: Boolean, value: !1 }
    },
    ready: function ready() {
      var root = this;
      this.$.expand.addEventListener("tap", function(e) {
        root._onTap(e);
      });
    },
    detached: function detached() {
      this.$.expand.removeEventListener("tap");
    },
    _onTap: function _onTap(e) {
      if (!this.disabled) {
        this.fire("a11y-collapse-tap", this);
      }
    }
  });
});
