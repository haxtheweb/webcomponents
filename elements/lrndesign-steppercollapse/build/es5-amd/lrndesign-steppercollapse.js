define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@polymer/iron-collapse/iron-collapse.js",
  "./node_modules/@lrnwebcomponents/lrndesign-stepper/lrndesign-stepper.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_b7582490e5f711e89c5789fd7f8c8446() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <h2>[[title]]</h2>\n\n<lrn-objective title="Text" task="assignment">\ndokokadskoadsokds\nads\nad\ns\nads\nasd\n</lrn-objective>\n<lrndesign-stepper>\n  <lrndesign-stepper-button title="Step 1: Text" icon="book" url="#">\n  </lrndesign-stepper-button>\n  <lrndesign-stepper-button title="Step 2: Video" icon="av:play-circle-filled" collapsible="">\n    Things and stuff\n  </lrndesign-stepper-button>\n  <lrndesign-stepper-button title="Step 3: Quiz" icon="assignment-turned-in" url="#"></lrndesign-stepper-button>\n  <lrndesign-stepper-button title="Step 4: Discuss" icon="social:people" collapsible="">\n    Fourth step content goes here...\n  </lrndesign-stepper-button>\n</lrndesign-stepper>\n'
    ]);
    _templateObject_b7582490e5f711e89c5789fd7f8c8446 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_b7582490e5f711e89c5789fd7f8c8446()
    ),
    is: "lrndesign-steppercollapse",
    properties: { title: { type: String, value: "lrndesign-steppercollapse" } }
  });
});
