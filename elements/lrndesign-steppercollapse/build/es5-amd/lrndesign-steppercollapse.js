define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@polymer/iron-collapse/iron-collapse.js",
  "./node_modules/@lrnwebcomponents/lrndesign-stepper/lrndesign-stepper.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_433f08b0dbb811e89f33ed73d9127f43() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <h2>[[title]]</h2>\n\n<lrn-objective title="Text" task="assignment">\ndokokadskoadsokds\nads\nad\ns\nads\nasd\n</lrn-objective>\n<lrndesign-stepper>\n  <lrndesign-stepper-button title="Step 1: Text" icon="book" url="#">\n  </lrndesign-stepper-button>\n  <lrndesign-stepper-button title="Step 2: Video" icon="av:play-circle-filled" collapsible="">\n    Things and stuff\n  </lrndesign-stepper-button>\n  <lrndesign-stepper-button title="Step 3: Quiz" icon="assignment-turned-in" url="#"></lrndesign-stepper-button>\n  <lrndesign-stepper-button title="Step 4: Discuss" icon="social:people" collapsible="">\n    Fourth step content goes here...\n  </lrndesign-stepper-button>\n</lrndesign-stepper>\n'
    ]);
    _templateObject_433f08b0dbb811e89f33ed73d9127f43 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_433f08b0dbb811e89f33ed73d9127f43()
    ),
    is: "lrndesign-steppercollapse",
    properties: { title: { type: String, value: "lrndesign-steppercollapse" } }
  });
});
