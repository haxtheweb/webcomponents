define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@polymer/app-route/app-route.js",
  "./node_modules/@polymer/app-route/app-location.js",
  "./node_modules/@polymer/iron-pages/iron-pages.js",
  "./node_modules/@lrnwebcomponents/paper-stepper/paper-stepper.js",
  "./lib/gene-crossover-1.js",
  "./lib/gene-crossover-2.js",
  "./lib/gene-crossover-3.js",
  "./lib/gene-crossover-4.js",
  "./lib/gene-crossover-5.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_e013cea0dbb811e897ece319e5303718() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style is="custom-style" include="animation-shared-styles">\n       :host {\n        display: block;\n      }\n      h1,\n      h2,\n      h3,\n      h4,\n      h5,\n      h6 {\n        font-family: \'Open Sans\', sans-serif;\n        text-transform: uppercase;\n        letter-spacing: 2px;\n        color: #6D6E71;\n        text-align: center;\n        font-size: 1.2em;\n      }\n\n      p {\n        font-family: \'Open Sans\', sans-serif;\n      }\n    </style>\n\n    <!--Pages-->\n    <iron-pages selected="[[activePage]]">\n      <gene-crossover-1 selected="[[_isActive(activePage, 0)]]"></gene-crossover-1>\n      <gene-crossover-2 selected="[[_isActive(activePage, 1)]]"></gene-crossover-2>\n      <gene-crossover-3 selected="[[_isActive(activePage, 2)]]"></gene-crossover-3>\n      <gene-crossover-4 selected="[[_isActive(activePage, 3)]]"></gene-crossover-4>\n      <!-- <gene-crossover-5 selected="[[_isActive(activePage, 4)]]"></gene-crossover-5> -->\n    </iron-pages>\n\n\n    <!--Counter-->\n    <template is="dom-if" if="[[count]]">\n      <paper-stepper selected="{{activePage}}" progress-bar="">\n        <template is="dom-repeat" items="[[_countToArray(count)]]">\n          <paper-step></paper-step>\n        </template>\n      </paper-stepper>\n    </template>\n'
    ]);
    _templateObject_e013cea0dbb811e897ece319e5303718 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_e013cea0dbb811e897ece319e5303718()
    ),
    is: "gene-crossover",
    properties: {
      activePage: { type: String, value: 0 },
      count: { type: Number, value: 0 }
    },
    _isActive: function _isActive(activePage, index) {
      return activePage === index;
    },
    _countToArray: function _countToArray(count) {
      var array = [];
      if (count) {
        for (i = 0; i < count; i++) {
          array.push(i);
        }
      }
      return array;
    },
    ready: function ready() {
      var root = this,
        ironPages = root.shadowRoot.querySelector("iron-pages");
      if (ironPages.children) {
        if (ironPages.children.length) {
          root.count = ironPages.children.length;
        }
      }
    }
  });
});
