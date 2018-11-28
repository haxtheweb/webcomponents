define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "./a11y-collapse-button-styles.js",
  "../node_modules/@polymer/paper-tooltip/paper-tooltip.js"
], function(_polymerLegacy, _a11yCollapseButtonStyles, _paperTooltip) {
  "use strict";
  function _templateObject_a489e050f32c11e8be2e771495816713() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style include="a11y-collapse-button-styles">\n      :host #heading:focus, \n      :host #heading:hover {\n        @apply --a11y-collapse-heading-focus;\n      }\n      :host #heading:focus #text, \n      :host #heading:hover #text {\n        @apply --a11y-collapse-heading-text-focus;\n      }\n      :host #heading:focus #expand, \n      :host #heading:hover #expand {\n        @apply --a11y-collapse-icon-focus;\n      } \n    </style>\n    <div id="heading" aria-controls="content" aria-expanded$="[[expanded]]" disabled$="[[disabled]]" label$="[[label]]" role="button">\n      <div id="text"><slot></slot></div>\n      <iron-icon id="expand" aria-hidden="true" icon$="[[icon]]" rotated$="[[rotated]]">\n      </iron-icon>\n    </div>\n    <paper-tooltip for="heading">[[tooltip]]</paper-tooltip>\n'
      ],
      [
        '\n    <style include="a11y-collapse-button-styles">\n      :host #heading:focus, \n      :host #heading:hover {\n        @apply --a11y-collapse-heading-focus;\n      }\n      :host #heading:focus #text, \n      :host #heading:hover #text {\n        @apply --a11y-collapse-heading-text-focus;\n      }\n      :host #heading:focus #expand, \n      :host #heading:hover #expand {\n        @apply --a11y-collapse-icon-focus;\n      } \n    </style>\n    <div id="heading" aria-controls="content" aria-expanded\\$="[[expanded]]" disabled\\$="[[disabled]]" label\\$="[[label]]" role="button">\n      <div id="text"><slot></slot></div>\n      <iron-icon id="expand" aria-hidden="true" icon\\$="[[icon]]" rotated\\$="[[rotated]]">\n      </iron-icon>\n    </div>\n    <paper-tooltip for="heading">[[tooltip]]</paper-tooltip>\n'
      ]
    );
    _templateObject_a489e050f32c11e8be2e771495816713 = function _templateObject_a489e050f32c11e8be2e771495816713() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_a489e050f32c11e8be2e771495816713()
    ),
    is: "a11y-collapse-accordion-button",
    listeners: { tap: "_onTap" },
    properties: {
      disabled: { type: Boolean, value: !1, reflectToAttribute: !0 },
      expanded: { type: Boolean, value: !1, reflectToAttribute: !0 },
      icon: { type: String, value: "icons:expand-more" },
      label: { type: String, value: "expand/collapse" },
      tooltip: { type: String, value: "toggle expand/collapse" },
      rotated: { type: Boolean, value: !1 }
    },
    _onTap: function _onTap(e) {
      if (!this.disabled) {
        console.log(this);
        this.fire("a11y-collapse-tap", this);
      }
    }
  });
});
