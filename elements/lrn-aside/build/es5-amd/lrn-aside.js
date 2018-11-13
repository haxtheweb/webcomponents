define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@lrnwebcomponents/lrndesign-panelcard/lrndesign-panelcard.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_cf668570e70711e88a544d7cb0752fab() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n    <style>\n      :host {\n        display: flex;\n\t\t    padding: 8px;\n      }\n      :host([sticky]) {\n        top:0;\n        position: sticky;\n      }\n      :host([direction='left']) {\n        float: left;\n        max-width: 480px;\n      }\n      :host([direction='right']) {\n        float: right;\n        max-width: 480px;\n      }\n    </style>\n    <aside>\n      <lrndesign-panelcard title=\"[[title]]\">\n        <slot></slot>\n      </lrndesign-panelcard>\n    </aside>\n"
    ]);
    _templateObject_cf668570e70711e88a544d7cb0752fab = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_cf668570e70711e88a544d7cb0752fab()
    ),
    is: "lrn-aside",
    behaviors: [HAXBehaviors.PropertiesBehaviors],
    properties: {
      title: { type: String, value: "Related content" },
      sticky: { type: Boolean, value: !1, reflectToAttribute: !0 },
      direction: { type: String, value: "", reflectToAttribute: !0 }
    },
    attached: function attached() {
      this.setHaxProperties({
        canScale: !0,
        canPosition: !0,
        canEditSource: !1,
        gizmo: {
          title: "Sticky note",
          description:
            "A sticky note to present some basic info offset on the page.",
          icon: "av:note",
          color: "yellow",
          groups: ["Content"],
          handles: [{ type: "text", title: "title" }],
          meta: { author: "LRNWebComponents" }
        },
        settings: {
          quick: [
            {
              property: "title",
              title: "Title",
              description: "Enter title for sticky note",
              inputMethod: "textfield",
              required: !0
            }
          ],
          configure: [
            {
              property: "title",
              title: "Title",
              description: "Enter title for sticky note.",
              inputMethod: "textfield",
              required: !0
            },
            {
              slot: "",
              title: "Content",
              description: "Content of the sticky note",
              inputMethod: "code-editor",
              required: !0
            },
            {
              property: "sticky",
              title: "Stick to page on scroll",
              description: "Appear sticky when the user scrolls past it",
              inputMethod: "boolean"
            },
            {
              property: "direction",
              title: "Direction to hang",
              description: "Location of the sticky note to hang",
              inputMethod: "select",
              options: { "": "none", right: "Right", left: "Left" }
            }
          ],
          advanced: []
        }
      });
    }
  });
});
