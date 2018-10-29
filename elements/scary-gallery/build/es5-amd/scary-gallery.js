define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js",
  "./lib/scary-image.js"
], function(_polymerLegacy, _polymerDom) {
  "use strict";
  function _templateObject_b3515f40dbb811e896a34f030672dfa0() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n    <style>\n      :host {\n        width: 100%;\n        display: flex;\n        flex-wrap: wrap;\n      }\n    </style>\n    <slot></slot>\n"
    ]);
    _templateObject_b3515f40dbb811e896a34f030672dfa0 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_b3515f40dbb811e896a34f030672dfa0()
    ),
    is: "scary-gallery",
    properties: {
      minHeight: { type: Number, value: 200 },
      gap: { type: Number, value: 4 }
    },
    observers: ["_init(minHeight, gap)"],
    attached: function attached() {
      this._observer = (0, _polymerDom.dom)(this).observeNodes(this._init);
      this._boundResize = this._resize.bind(this);
      window.addEventListener("resize", this._boundResize);
    },
    detached: function detached() {
      (0, _polymerDom.dom)(this).unobserveNodes(this._observer);
      window.removeEventListener("resize", this._boundResize);
    },
    _init: function _init() {
      this.debounce(
        "init",
        function() {
          this._firstResize = !0;
          this._children = Array.prototype.slice.call(
            (0, _polymerDom.dom)(this).querySelectorAll("scary-image")
          );
          this._resize();
        },
        50
      );
    },
    _resize: function _resize() {
      this.debounce(
        "resize",
        function() {
          var loaded = !0,
            rows = [],
            row = [],
            rowWidth = 0;
          this._maxWidth = this.offsetWidth;
          this._children.forEach(
            function(img) {
              img.style.margin = (this.gap / 2).toString(10) + "px";
              if (img.loaded) {
                var width =
                  (this.minHeight / img.naturalHeight) * img.naturalWidth +
                  this.gap;
                if (rowWidth + width > this._maxWidth) {
                  if (0 < row.length) {
                    rows.push({ images: row, width: rowWidth });
                    row = [];
                  }
                  rowWidth = 0;
                }
                rowWidth += width;
                img.tmpWidth = width;
                row.push(img);
              } else {
                loaded = !1;
              }
            }.bind(this)
          );
          if (0 < row.length) {
            rows.push({ images: row, width: rowWidth });
          }
          rows.forEach(
            function(row) {
              var totalGap = row.images.length * this.gap,
                targetWidth = this._maxWidth - totalGap,
                rowWidth = row.width - totalGap,
                targetHeight = (this.minHeight * targetWidth) / rowWidth;
              row.images.forEach(
                function(img) {
                  img.height = targetHeight;
                  img.width =
                    (targetHeight / img.naturalHeight) * img.naturalWidth;
                }.bind(this)
              );
            }.bind(this)
          );
          if (!loaded) {
            this._resize();
          }
          if (loaded && this._firstResize) {
            this._firstResize = !1;
            this._resize();
          }
        },
        50
      );
    }
  });
});
