define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js",
  "./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js",
  "./node_modules/@polymer/paper-tooltip/paper-tooltip.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_ca3764a0dea811e89763014a376eb367() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <abbr title$="[[phrase]]" id="abbr">[[abbr]]</abbr>\n    <paper-tooltip for="abbr">[[phrase]]</paper-tooltip>\n'
    ]);
    _templateObject_ca3764a0dea811e89763014a376eb367 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_ca3764a0dea811e89763014a376eb367()
    ),
    is: "lrndesign-abbreviation",
    behaviors: [HAXBehaviors.PropertiesBehaviors, SchemaBehaviors.Schema],
    properties: {
      abbr: { type: String, reflectToAttribute: !0, notify: !0 },
      phrase: { type: String, reflectToAttribute: !0, notify: !0 }
    },
    attached: function attached() {
      this.setHaxProperties({
        canScale: !1,
        canPosition: !1,
        canEditSource: !1,
        gizmo: {
          title: "Abbreviation",
          description: "Simple abbreviation with tooltip of full word",
          icon: "editor:title",
          color: "grey",
          groups: ["Instructional", "Term"],
          handles: [{ type: "inline", text: "text" }],
          meta: { author: "LRNWebComponents" }
        },
        settings: {
          quick: [
            {
              property: "abbr",
              title: "Abbreviation",
              description: "Abbreviation word",
              inputMethod: "textfield",
              icon: "editor:title"
            },
            {
              property: "phrase",
              title: "Phrase",
              description: "The phrase / original words",
              inputMethod: "textfield",
              icon: "editor:title"
            }
          ],
          configure: [
            {
              property: "abbr",
              title: "Abbreviation",
              description: "Abbreviation word",
              inputMethod: "textfield",
              icon: "editor:title"
            },
            {
              property: "phrase",
              title: "Phrase",
              description: "The phrase / original words",
              inputMethod: "textfield",
              icon: "editor:title"
            }
          ],
          advanced: []
        }
      });
    }
  });
});
