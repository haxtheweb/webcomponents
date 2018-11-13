define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js",
  "../node_modules/@polymer/iron-flex-layout/iron-flex-layout.js",
  "../node_modules/@polymer/iron-dropdown/iron-dropdown.js",
  "../node_modules/@polymer/neon-animation/neon-animations.js",
  "./paper-square-grow-animation.js"
], function(_polymerLegacy, _polymerDom) {
  "use strict";
  function _templateObject_35cce2c0e70611e8b59b3d106a92985a() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <custom-style>\n    <style>\n      :host .vertical ::content .dropdown-content {\n        @apply --layout-vertical;\n      }\n      :host .horizontal ::content .dropdown-content {\n        @apply --layout-horizontal;\n      }\n      :host ::content .dropdown-content > * {\n        margin: 8px;\n        @apply --paper-fab-speed-dial-option;\n      }\n    </style>\n    </custom-style>\n    <slot id="fabContainer" name="dropdown-trigger"></slot>\n    <iron-dropdown id="dropdown" open-animation-config="[[openAnimationConfig]]" close-animation-config="[[closeAnimationConfig]]">\n      <slot id="contentContainer" name="dropdown-content"></slot>\n    </iron-dropdown>\n'
    ]);
    _templateObject_35cce2c0e70611e8b59b3d106a92985a = function() {
      return data;
    };
    return data;
  }
  (function(Polymer) {
    Polymer({
      _template: (0, _polymerLegacy.html)(
        _templateObject_35cce2c0e70611e8b59b3d106a92985a()
      ),
      is: "paper-fab-speed-dial",
      properties: {
        direction: { type: String, value: "bottom" },
        offset: { type: Number, value: 66 },
        openAnimationConfig: {
          type: Array,
          value: function value() {
            return [
              {
                name: "fade-in-animation",
                timing: { delay: 150, duration: 50 }
              },
              {
                name: "paper-square-grow-animation",
                startSize: 56,
                timing: { delay: 150, duration: 200 }
              }
            ];
          }
        },
        closeAnimationConfig: {
          type: Array,
          value: function value() {
            return [{ name: "fade-out-animation", timing: { duration: 200 } }];
          }
        }
      },
      observers: ["_updateDropdown(direction, offset)"],
      ready: function ready() {
        var fab = (0, _polymerDom.dom)(
          this.$.fabContainer
        ).getDistributedNodes()[0];
        fab.addEventListener(
          "tap",
          function() {
            this.$.dropdown.open();
          }.bind(this)
        );
        var content = (0, _polymerDom.dom)(
          this.$.contentContainer
        ).getDistributedNodes()[0];
        content.addEventListener(
          "tap",
          function() {
            this.$.dropdown.close();
          }.bind(this)
        );
      },
      open: function open() {
        this.$.dropdown.open();
      },
      close: function close() {
        this.$.dropdown.close();
      },
      _updateDropdown: function _updateDropdown(direction, offset) {
        var d = this.$.dropdown;
        switch (direction) {
          case "bottom":
            d.verticalAlign = "top";
            d.horizontalOffset = 0;
            d.verticalOffset = offset;
            d.classList.add("vertical");
            d.classList.remove("horizontal");
            break;
          case "top":
            d.verticalAlign = "bottom";
            d.horizontalOffset = 0;
            d.verticalOffset = offset;
            d.classList.add("vertical");
            d.classList.remove("horizontal");
            break;
          case "right":
            d.horizontalAlign = "left";
            d.horizontalOffset = offset;
            d.verticalOffset = 0;
            d.classList.add("horizontal");
            d.classList.remove("vertical");
            break;
          case "left":
            d.horizontalAlign = "right";
            d.horizontalOffset = offset;
            d.verticalOffset = 0;
            d.classList.add("horizontal");
            d.classList.remove("vertical");
            break;
          default:
            throw "Invalid direction. Must be one of [top, bottom, left, right].";
        }
      }
    });
  })(_polymerLegacy.Polymer);
});
