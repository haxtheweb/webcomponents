define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@polymer/polymer/lib/elements/dom-if.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_4338b7f0dea911e880464f346128291f() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n\t\t\t:host {\n\t\t\t\t--paper-avatar-width: 40px;\n\t\t\t}\n\t\t\t:host {\n\t\t\t\tdisplay: inline-block;\n\t\t\t\tbox-sizing: border-box;\n\t\t\t\tposition: relative;\n\t\t\t\twidth: var(--paper-avatar-width);\n\t\t\t\theight:  var(--paper-avatar-width);\n\t\t\t\tborder-radius: 50%;\n\t\t\t\tcursor: default;\n\t\t\t\tbackground-color: var(--paper-avatar-color, var(--paper-avatar-bgcolor));\n\t\t\t\t-webkit-user-select: none;\n\t\t\t\t   -moz-user-select: none;\n\t\t\t\t    -ms-user-select: none;\n\t\t\t\t\t\tuser-select: none;\n\t\t\t}\n\t\t\t\n\t\t\t:host > * {\n\t\t\t\tpointer-events: none;\n\t\t\t}\n\t\t\t\n\t\t\t#label, #img, #jdenticon {\n\t\t\t\tposition: absolute;\n\t\t\t\ttop: 0;\n\t\t\t\tleft: 0;\n\t\t\t\tright: 0;\n\t\t\t\tbottom: 0;\n\t\t\t\twidth: 100%;\n\t\t\t\theight: 100%;\n\t\t\t\tborder-radius: 50%;\n\t\t\t}\n\t\t\t#label {\n\t\t\t\toverflow: hidden;\n\t\t\t\tdisplay: -ms-flexbox;\n\t\t\t\tdisplay: -webkit-flex;\n\t\t\t\tdisplay: flex;\n\t\t\t\t-webkit-flex-direction: row;\n\t\t\t\t\t-ms-flex-direction: row;\n\t\t\t\t\t\tflex-direction: row;\n\t\t\t\t-webkit-align-items: center;\n\t\t\t\t\t -ms-flex-align: center;\n\t\t\t\t\t \talign-items: center;\n\t\t\t}\n\t\t\t#label span {\n\t\t\t\tdisplay: block;\n\t\t\t\twidth: 100%;\n\t\t\t\tfont-weight: 400;\n\t\t\t\tcolor: rgba(255, 255, 255, .8);\n\t\t\t\ttext-transform: capitalize;\n\t\t\t\tfont-family: \'Roboto\', \'Noto\', sans-serif;\n\t\t\t\t-webkit-font-smoothing: antialiased;\n\t\t\t\ttext-align: center;\n\t\t\t\tfont-size: calc(var(--paper-avatar-width) / 1.65);\n\t\t\t}\n\t\t\t#jdenticon {\n\t\t\t\twidth: var(--paper-avatar-width);\n\t\t\t\theight: var(--paper-avatar-width);\n\t\t\t}\n\t\t\t\n\t\t\t*[hidden] {\n\t\t\t\tdisplay: none !important;\n\t\t\t}\n\t\t</style>\n\n\t\t<div id="label" title="[[label]]"><span>[[_label(label)]]</span></div>\n\n\t\t<svg id="jdenticon" width="40" height="40">\n      <slot></slot>\n    </svg>\n\n\t\t<template is="dom-if" if="[[src]]">\n\t\t\t<img id="img" src="[[src]]" title="[[label]]" on-load="_onImgLoad" on-error="_onImgError" title="[[color]]">\n\t\t</template>\n  '
    ]);
    _templateObject_4338b7f0dea911e880464f346128291f = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    is: "paper-avatar",
    _template: (0, _polymerLegacy.html)(
      _templateObject_4338b7f0dea911e880464f346128291f()
    ),
    properties: {
      src: { type: String },
      label: { type: String, observer: "_observerLabel" },
      twoChars: { type: Boolean, value: !1 },
      colors: { type: Array },
      jdenticon: { type: Boolean, value: !1 }
    },
    _observerLabel: function _observerLabel(label) {
      if (label) {
        if (this.jdenticon) {
          this.$.label.hidden = !0;
          jdenticon.config = {
            lightness: { color: [1, 1], grayscale: [1, 1] },
            saturation: 1
          };
        }
        this.updateStyles({
          "--paper-avatar-bgcolor": this._parseColor(label)
        });
      }
    },
    _label: function _label(label) {
      if (!label) return "";
      if (this.twoChars) {
        if (-1 < this.label.indexOf(" ")) {
          var matches = this.label.match(/\b(\w)/g);
          return matches[0] + matches[1];
        } else {
          return label.substring(0, 2);
        }
      }
      return label.charAt(0);
    },
    _onImgLoad: function _onImgLoad(e) {
      e.currentTarget.hidden = !1;
    },
    _onImgError: function _onImgError(e) {
      e.currentTarget.hidden = !0;
    },
    _parseColor: function _parseColor(label) {
      for (
        var colors = this.colors
            ? this.colors
            : [
                "#F44336",
                "#E91E63",
                "#9C27B0",
                "#673AB7",
                "#3F51B5",
                "#2196F3",
                "#03A9F4",
                "#00BCD4",
                "#795548",
                "#009688",
                "#4CAF50",
                "#8BC34A",
                "#CDDC39",
                "#FFEB3B",
                "#FFC107",
                "#FF9800",
                "#FF5722",
                "#9E9E9E",
                "#607D8B"
              ],
          hash = 0,
          a = 0;
        a < label.length;
        a++
      ) {
        hash += label.charCodeAt(a) << 5;
      }
      if (hash >= colors.length) return colors[hash % colors.length];
      return colors[hash];
    }
  });
});
