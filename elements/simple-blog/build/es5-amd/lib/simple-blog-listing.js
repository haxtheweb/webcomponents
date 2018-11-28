define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/iron-list/iron-list.js",
  "../node_modules/@polymer/paper-button/paper-button.js",
  "./simple-blog-overview.js"
], function(_polymerLegacy, _ironList, _paperButton, _simpleBlogOverview) {
  "use strict";
  function _templateObject_3388dca0f32f11e880147b5ac6e8ccac() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: block;\n      }\n      iron-list {\n        width: 100%;\n        max-width: 640px;\n        margin: 0 auto;\n        -webkit-box-sizing: border-box;\n        -moz-box-sizing: border-box;\n        box-sizing: border-box;\n      }\n      @media only screen and (max-width: 800px) {\n        iron-list {\n          padding: 0 32px;\n        }\n      }\n      simple-blog-overview {\n        width: 100%;\n        border: 1px solid #f2f2f0;\n      }\n    </style>\n    <iron-list items="[[items]]">\n      <template>\n        <simple-blog-overview item-id="[[item.id]]" title="[[item.title]]" description="[[item.description]]" link="[[item.location]]" changed="[[item.metadata.updated]]"></simple-blog-overview>\n      </template>\n    </iron-list>\n'
    ]);
    _templateObject_3388dca0f32f11e880147b5ac6e8ccac = function _templateObject_3388dca0f32f11e880147b5ac6e8ccac() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_3388dca0f32f11e880147b5ac6e8ccac()
    ),
    is: "simple-blog-listing",
    properties: { items: { type: Object } }
  });
});
