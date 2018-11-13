define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@polymer/app-layout/app-layout.js",
  "./node_modules/@lrnwebcomponents/img-pan-zoom/img-pan-zoom.js",
  "./node_modules/@lrnwebcomponents/lrnsys-button/lrnsys-button.js",
  "./node_modules/@polymer/iron-icons/iron-icons.js",
  "./node_modules/@polymer/iron-icons/image-icons.js",
  "./node_modules/@lrnwebcomponents/materializecss-styles/lib/colors.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_cfb2a9a0e70711e89b7e3d36cbeb5c9b() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style include="materializecss-styles-colors">\n       :host {\n        display: block;\n        --image-inspector-background: #dddddd;\n      }\n\n      app-toolbar {\n        width: 90%;\n        background: var(--image-inspector-background);\n        margin: 32px auto;\n        z-index: 1;\n      }\n\n      .top {\n        top: 128px;\n      }\n    </style>\n    <app-toolbar>\n      <lrnsys-button alt="Zoom in" icon="zoom-in" on-tap="zoomIn" hover-class="[[hoverClass]]"></lrnsys-button>\n      <lrnsys-button alt="Zoom out" icon="zoom-out" on-tap="zoomOut" hover-class="[[hoverClass]]"></lrnsys-button>\n      <lrnsys-button alt="Rotate right" icon="image:rotate-right" on-tap="rotateRight" hover-class="[[hoverClass]]"></lrnsys-button>\n      <lrnsys-button alt="Rotate left" icon="image:rotate-left" on-tap="rotateLeft" hover-class="[[hoverClass]]"></lrnsys-button>\n      <lrnsys-button alt="Mirror image" icon="image:flip" on-tap="mirrorImage" hover-class="[[hoverClass]]"></lrnsys-button>\n      <lrnsys-button alt="Open in new window" icon="launch" href="[[src]]" target="_blank" hover-class="[[hoverClass]]"></lrnsys-button>\n      <slot name="toolbar"></slot>\n    </app-toolbar>\n    <img-pan-zoom id="img" src="[[src]]"></img-pan-zoom>\n    <slot></slot>\n'
    ]);
    _templateObject_cfb2a9a0e70711e89b7e3d36cbeb5c9b = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_cfb2a9a0e70711e89b7e3d36cbeb5c9b()
    ),
    is: "image-inspector",
    properties: {
      degrees: { type: Number, value: 0, reflectToAttribute: !0 },
      src: { type: String, reflectToAttribute: !0 },
      hoverClass: { type: String, value: "blue white-text" }
    },
    rotateRight: function rotateRight() {
      var img = this.$.img;
      this.degrees += 90;
      img.style.transform = "rotate(" + this.degrees + "deg)";
      img.toggleClass("top");
    },
    rotateLeft: function rotateLeft() {
      var img = this.$.img;
      this.degrees += -90;
      img.style.transform = "rotate(" + this.degrees + "deg)";
      img.toggleClass("top");
    },
    mirrorImage: function mirrorImage() {
      var img = this.$.img;
      if ("scaleX(1)" === img.style.transform) {
        img.style.transform = "scaleX(-1)";
      } else {
        img.style.transform = "scaleX(1)";
      }
    },
    zoomIn: function zoomIn() {
      this.$.img.zoomIn();
    },
    zoomOut: function zoomOut() {
      this.$.img.zoomOut();
    }
  });
});
