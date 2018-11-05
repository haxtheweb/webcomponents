define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@polymer/iron-image/iron-image.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_b9fed330e11811e8b092cd2495fcb2ce() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: block;\n      }\n      .is-circle{\n        border: 1px solid grey;\nborder-radius: 50%;\nbox-shadow: 0px 5px 10px #CCC;\n      }\n    </style>\n    <iron-image style="width:200px; height:200px;" class$="[[mode]]" sizing="contain" src$="[[imgSrc]]" title$="[[imgTitle]]"></iron-image>\n'
    ]);
    _templateObject_b9fed330e11811e8b092cd2495fcb2ce = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_b9fed330e11811e8b092cd2495fcb2ce()
    ),
    is: "random-image",
    properties: {
      mode: { type: String, notify: !0, value: "" },
      imgSrc: { type: String },
      imgTitle: { type: String },
      imagesList: {
        type: Object,
        notify: !0,
        value: function value() {
          return [];
        }
      }
    },
    _pickRandomProperty: function _pickRandomProperty(obj) {
      var result,
        count = 0;
      for (var prop in obj) {
        if (Math.random() < 1 / ++count) result = prop;
      }
      return result;
    },
    ready: function ready() {
      var randomPos = this._pickRandomProperty(this.imagesList);
      this.imgSrc = this.imagesList[randomPos].path;
      this.imgTitle = this.imagesList[randomPos].title;
    }
  });
});
