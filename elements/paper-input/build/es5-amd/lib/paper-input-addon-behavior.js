define([
  "exports",
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js"
], function(_exports, _polymerLegacy, _polymerDom) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.PaperInputAddonBehavior = void 0;
  _exports.PaperInputAddonBehavior = {
    attached: function attached() {
      (0, _polymerDom.flush)();
      this.fire("addon-attached");
    },
    update: function update() {}
  };
});
