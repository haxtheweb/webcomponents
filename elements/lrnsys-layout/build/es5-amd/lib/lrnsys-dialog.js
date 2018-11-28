define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js",
  "../node_modules/@lrnwebcomponents/paper-avatar/paper-avatar.js",
  "../node_modules/@lrnwebcomponents/lrn-icons/lrn-icons.js",
  "../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js",
  "../node_modules/@lrnwebcomponents/simple-modal/simple-modal.js",
  "../node_modules/@polymer/paper-tooltip/paper-tooltip.js",
  "../node_modules/@polymer/paper-button/paper-button.js",
  "../node_modules/@polymer/neon-animation/neon-animation.js",
  "../node_modules/@polymer/neon-animation/neon-animations.js",
  "../node_modules/@polymer/iron-icons/iron-icons.js",
  "./lrnsys-dialog-modal.js",
  "./lrnsys-button-inner.js"
], function(
  _polymerLegacy,
  _polymerDom,
  _paperAvatar,
  _lrnIcons,
  _simpleColors,
  _simpleModal,
  _paperTooltip,
  _paperButton,
  _neonAnimation,
  _neonAnimations,
  _ironIcons,
  _lrnsysDialogModal,
  _lrnsysButtonInner
) {
  "use strict";
  function _templateObject_7890a270f32e11e8a99157a68f28c36b() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <custom-style>\n    <style is="custom-style" include="simple-colors">\n      :host {\n        display: inline-block;\n        --lrnsys-dialog-color: var(--simple-colors-foreground1,#000);\n        --lrnsys-dialog-background-color: var(--simple-colors-background1);\n        --lrnsys-dialog-toolbar-background-color: var(--simple-colors-background3);\n        --lrnsys-dialog-secondary-background-color: rgba(255,255,255, 0.7);\n      }\n      :host([dark]) {\n        --lrnsys-dialog-toolbar-background-color: var(--simple-colors-background1);\n        --lrnsys-dialog-background-color: var(--simple-colors-background3);\n        --lrnsys-dialog-secondary-background-color: rgba(0, 0, 0, 0.7);\n      }\n      #dialogtrigger {\n        display:inline-block;\n      }\n    </style>\n    </custom-style>\n    <paper-button class$="[[class]]" id="dialogtrigger" on-tap="openDialog" raised="[[raised]]" disabled$="[[disabled]]" title="[[alt]]" aria-label$="[[alt]]">\n      <lrnsys-button-inner avatar$="[[avatar]]" icon$="[[icon]]" text$="[[text]]">\n        <slot name="button" slot="button"></slot>\n      </lrnsys-button-inner>\n    </paper-button>\n    <paper-tooltip for="dialogtrigger" animation-delay="0" hidden$="[[!alt]]">[[alt]]</paper-tooltip>\n'
    ]);
    _templateObject_7890a270f32e11e8a99157a68f28c36b = function _templateObject_7890a270f32e11e8a99157a68f28c36b() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_7890a270f32e11e8a99157a68f28c36b()
    ),
    is: "lrnsys-dialog",
    listeners: {
      mousedown: "tapEventOn",
      mouseover: "tapEventOn",
      mouseout: "tapEventOff"
    },
    behaviors: [simpleColorsBehaviors],
    properties: {
      icon: { type: String },
      raised: { type: Boolean },
      avatar: { type: String },
      text: { type: String },
      alt: { type: String, reflectToAttribute: !0 },
      header: { type: String },
      disabled: { type: Boolean, value: !1 },
      hoverClass: { type: String },
      headingClass: { type: String, value: "white-text black" },
      dynamicImages: { type: Boolean, value: !1 },
      focusState: { type: Boolean, value: !1 }
    },
    tapEventOn: function tapEventOn(e) {
      var root = this;
      if (
        babelHelpers.typeof(root.hoverClass) !==
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        var classes = root.hoverClass.split(" ");
        classes.forEach(function(item, index) {
          if ("" != item) {
            root.$.dialogtrigger.classList.add(item);
          }
        });
      }
    },
    tapEventOff: function tapEventOff(e) {
      var root = this;
      if (
        babelHelpers.typeof(root.hoverClass) !==
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        var classes = root.hoverClass.split(" ");
        classes.forEach(function(item, index) {
          if ("" != item) {
            root.$.dialogtrigger.classList.remove(item);
          }
        });
      }
    },
    openDialog: function openDialog() {
      var nodes = (0, _polymerDom.dom)(this).getEffectiveChildNodes(),
        h = document.createElement("span"),
        c = document.createElement("span"),
        node = {};
      for (var i in nodes) {
        if (
          babelHelpers.typeof(nodes[i].tagName) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0))
        ) {
          switch (nodes[i].getAttribute("slot")) {
            case "toolbar-primary":
            case "toolbar-secondary":
            case "toolbar":
            case "header":
              node = nodes[i].cloneNode(!0);
              h.appendChild(node);
              break;
            case "button":
              break;
            default:
              node = nodes[i].cloneNode(!0);
              if (this.dynamicImages && "IRON-IMAGE" === node.tagName) {
                node.preventLoad = !1;
                node.removeAttribute("prevent-load");
              }
              c.appendChild(node);
              break;
          }
        }
      }
      var evt = new CustomEvent("simple-modal-show", {
        bubbles: !0,
        cancelable: !0,
        detail: {
          title: this.header,
          elements: { header: h, content: c },
          invokedBy: this.$.dialogtrigger
        }
      });
      this.dispatchEvent(evt);
    },
    focusToggle: function focusToggle(e) {
      var root = this;
      root.fire("focus-changed", { focus: root.focusState });
      if (
        babelHelpers.typeof(root.hoverClass) !==
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        var classes = root.hoverClass.split(" ");
        classes.forEach(function(item, index) {
          if ("" != item) {
            if (root.focusState) {
              root.$.dialogtrigger.classList.add(item);
            } else {
              root.$.dialogtrigger.classList.remove(item);
            }
          }
        });
      }
      root.focusState = !root.focusState;
    },
    ready: function ready() {
      this.__modal = window.simpleModal.requestAvailability();
    },
    attached: function attached() {
      this.$.dialogtrigger.addEventListener(
        "focused-changed",
        this.focusToggle.bind(this)
      );
    },
    detached: function detached() {
      this.$.dialogtrigger.removeEventListener(
        "focused-changed",
        this.focusToggle.bind(this)
      );
    }
  });
});
