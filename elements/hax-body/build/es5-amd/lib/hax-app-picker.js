define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js",
  "../node_modules/@polymer/iron-list/iron-list.js",
  "../node_modules/@polymer/iron-icon/iron-icon.js",
  "../node_modules/@polymer/iron-icons/iron-icons.js",
  "../node_modules/@polymer/paper-button/paper-button.js",
  "../node_modules/@polymer/paper-dialog/paper-dialog.js",
  "../node_modules/@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js",
  "../node_modules/@polymer/paper-ripple/paper-ripple.js",
  "../node_modules/@polymer/paper-toast/paper-toast.js",
  "../node_modules/@polymer/paper-icon-button/paper-icon-button.js",
  "../node_modules/@polymer/neon-animation/neon-animation.js",
  "../node_modules/@polymer/neon-animation/animations/scale-up-animation.js",
  "../node_modules/@polymer/neon-animation/animations/scale-down-animation.js",
  "../node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js",
  "../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js",
  "./hax-app-picker-item.js"
], function(_polymerLegacy, _polymerDom) {
  "use strict";
  function _templateObject_71be82c0edbe11e883a5d91bd26efb3f() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style is="custom-style" include="materializecss-styles">\n      :host {\n        display: block;\n        --hax-app-picker-dialog-background-color: var(--simple-colors-light-green-background1);\n      };\n      hax-app-picker-item {\n        -webkit-transition: .3s all linear;\n        transition: .3s all linear;\n        display: inline-flex;\n      }\n      #closedialog {\n        float: right;\n        top: 15px;\n        right: 0;\n        position: absolute;\n        padding: 4px;\n        margin: 0;\n        color: var(--simple-colors-light-green-background1, green);\n        background-color: transparent;\n        width: 40px;\n        height: 40px;\n        min-width: unset;\n      }\n      #ironlist {\n        width: 100%;\n        height: 30vh;\n      }\n      #dialog {\n        min-width: 30vw;\n        min-height: 30vh;\n        height: 30vw;\n        width: 30vh;\n        padding: 8px;\n        overflow: hidden;\n        background-color: rgba(0,0,0,.9);\n        border-radius: 16px;\n        z-index: 1000000;\n        border: 2px solid var(--simple-colors-light-green-background1);\n        @apply --hax-app-picker-dialog;\n      }\n      #title, .element-button > div {\n        color: var(--hax-app-picker-dialog-text-color, #FFFFFF);\n      }\n      #title {\n        padding: 16px;\n        border-bottom: 2px solid var(--simple-colors-light-green-background1);\n        margin: 0;\n        width: calc(100% - 32px);\n        color: var(--hax-app-picker-dialog-text-color, #FFFFFF);\n        @apply --paper-font-title;\n        @apply --hax-app-picker-dialog-title;\n      }\n      #buttonlist {\n        display: block;\n        text-align: left;\n        margin: -32px;\n        padding: 32px;\n        overflow-x: hidden;\n        overflow-y: auto;\n        --paper-dialog-scrollable: {\n          padding: 0 0 78px 0;\n        }\n      }\n      @media (orientation: landscape) {\n        #buttonlist,\n        #ironlist,\n        #dialog {\n          width: 40vw;\n          height: 50vh;\n        }\n      }\n      @media (orientation: portrait) {\n        #buttonlist,\n        #ironlist,\n        #dialog {\n          width: 50vw;\n          height: 60vh;\n        }\n      }\n      .element-button {\n        display: inline-block;\n        width: 72px;\n        margin: 8px 4px;\n        text-align: center;\n      }\n      @media screen and (max-width: 550px) {\n        #buttonlist,\n        #ironlist,\n        #dialog {\n          max-width: 80%;\n          overflow: auto;\n        }\n        .element-button {\n          width: 54px;\n          margin: 0px;\n        }\n      }\n    </style>\n    <paper-dialog id="dialog" with-backdrop always-on-top>\n      <h3 id="title">[[title]]</h3>\n      <paper-dialog-scrollable id="buttonlist">\n        <iron-list id="ironlist" items="[[selectionList]]" as="element" grid>\n          <template>\n            <div>\n              <hax-app-picker-item id$="picker-item-[[index]]" class="element-button" on-tap="_selected" data-selected$="[[index]]" label="[[element.title]]" icon="[[element.icon]]" color="[[element.color]]"></hax-app-picker-item>\n            </div>\n          </template>\n        </iron-list>\n      </paper-dialog-scrollable>\n      <paper-button id="closedialog" on-tap="close">\n        <iron-icon icon="icons:cancel" title="Close dialog"></iron-icon>\n      </paper-button>\n    </paper-dialog>\n'
      ],
      [
        '\n    <style is="custom-style" include="materializecss-styles">\n      :host {\n        display: block;\n        --hax-app-picker-dialog-background-color: var(--simple-colors-light-green-background1);\n      };\n      hax-app-picker-item {\n        -webkit-transition: .3s all linear;\n        transition: .3s all linear;\n        display: inline-flex;\n      }\n      #closedialog {\n        float: right;\n        top: 15px;\n        right: 0;\n        position: absolute;\n        padding: 4px;\n        margin: 0;\n        color: var(--simple-colors-light-green-background1, green);\n        background-color: transparent;\n        width: 40px;\n        height: 40px;\n        min-width: unset;\n      }\n      #ironlist {\n        width: 100%;\n        height: 30vh;\n      }\n      #dialog {\n        min-width: 30vw;\n        min-height: 30vh;\n        height: 30vw;\n        width: 30vh;\n        padding: 8px;\n        overflow: hidden;\n        background-color: rgba(0,0,0,.9);\n        border-radius: 16px;\n        z-index: 1000000;\n        border: 2px solid var(--simple-colors-light-green-background1);\n        @apply --hax-app-picker-dialog;\n      }\n      #title, .element-button > div {\n        color: var(--hax-app-picker-dialog-text-color, #FFFFFF);\n      }\n      #title {\n        padding: 16px;\n        border-bottom: 2px solid var(--simple-colors-light-green-background1);\n        margin: 0;\n        width: calc(100% - 32px);\n        color: var(--hax-app-picker-dialog-text-color, #FFFFFF);\n        @apply --paper-font-title;\n        @apply --hax-app-picker-dialog-title;\n      }\n      #buttonlist {\n        display: block;\n        text-align: left;\n        margin: -32px;\n        padding: 32px;\n        overflow-x: hidden;\n        overflow-y: auto;\n        --paper-dialog-scrollable: {\n          padding: 0 0 78px 0;\n        }\n      }\n      @media (orientation: landscape) {\n        #buttonlist,\n        #ironlist,\n        #dialog {\n          width: 40vw;\n          height: 50vh;\n        }\n      }\n      @media (orientation: portrait) {\n        #buttonlist,\n        #ironlist,\n        #dialog {\n          width: 50vw;\n          height: 60vh;\n        }\n      }\n      .element-button {\n        display: inline-block;\n        width: 72px;\n        margin: 8px 4px;\n        text-align: center;\n      }\n      @media screen and (max-width: 550px) {\n        #buttonlist,\n        #ironlist,\n        #dialog {\n          max-width: 80%;\n          overflow: auto;\n        }\n        .element-button {\n          width: 54px;\n          margin: 0px;\n        }\n      }\n    </style>\n    <paper-dialog id="dialog" with-backdrop always-on-top>\n      <h3 id="title">[[title]]</h3>\n      <paper-dialog-scrollable id="buttonlist">\n        <iron-list id="ironlist" items="[[selectionList]]" as="element" grid>\n          <template>\n            <div>\n              <hax-app-picker-item id$="picker-item-[[index]]" class="element-button" on-tap="_selected" data-selected\\$="[[index]]" label="[[element.title]]" icon="[[element.icon]]" color="[[element.color]]"></hax-app-picker-item>\n            </div>\n          </template>\n        </iron-list>\n      </paper-dialog-scrollable>\n      <paper-button id="closedialog" on-tap="close">\n        <iron-icon icon="icons:cancel" title="Close dialog"></iron-icon>\n      </paper-button>\n    </paper-dialog>\n'
      ]
    );
    _templateObject_71be82c0edbe11e883a5d91bd26efb3f = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_71be82c0edbe11e883a5d91bd26efb3f()
    ),
    is: "hax-app-picker",
    listeners: {
      "iron-overlay-canceled": "close",
      "iron-overlay-closed": "close"
    },
    behaviors: [simpleColorsBehaviors],
    properties: {
      _elements: { type: Array, value: [] },
      selectionList: { type: Array, value: [] },
      title: { type: String, value: "Pick an options" },
      pickerType: { type: String, value: "gizmo" },
      opened: { type: Boolean, value: !1, observer: "_openedChanged" }
    },
    attached: function attached() {
      this.fire("hax-register-app-picker", this);
    },
    ready: function ready() {
      document.body.appendChild(this);
    },
    close: function close() {
      this.opened = !1;
    },
    _openedChanged: function _openedChanged(newValue) {
      var _this = this;
      if (babelHelpers.typeof(newValue) !== "undefined") {
        if (newValue) {
          this.$.dialog.open();
          setTimeout(function() {
            _this.$.ironlist.fire("iron-resize");
            window.dispatchEvent(new Event("resize"));
          }, 100);
          document.body.style.overflow = "hidden";
        } else {
          this.$.dialog.close();
          document.body.style.overflow = null;
        }
      }
    },
    presentOptions: function presentOptions(elements, type) {
      var _this2 = this,
        title =
          2 < arguments.length && arguments[2] !== void 0
            ? arguments[2]
            : "Select an option",
        pickerType =
          3 < arguments.length && arguments[3] !== void 0
            ? arguments[3]
            : "gizmo";
      this.title = title;
      this.pickerType = pickerType;
      var tmp = [];
      switch (pickerType) {
        case "gizmo":
          for (var i in elements) {
            elements[i].__type = type;
            tmp[i] = {
              icon: elements[i].gizmo.icon,
              title: elements[i].gizmo.title,
              color: elements[i].gizmo.color
            };
          }
          break;
        case "app":
          for (var i in elements) {
            tmp[i] = {
              icon: elements[i].details.icon,
              title: elements[i].details.title,
              color: elements[i].details.color
            };
          }
          break;
        default:
          tmp = elements;
          break;
      }
      this._elements = elements;
      this.set("selectionList", []);
      this.set("selectionList", tmp);
      this.opened = !0;
      setTimeout(function() {
        _this2.shadowRoot.querySelector("#picker-item-0").focus();
      }, 100);
    },
    _selected: function _selected(e) {
      var normalizedEvent = (0, _polymerDom.dom)(e),
        key = normalizedEvent.localTarget.getAttribute("data-selected");
      e.preventDefault();
      e.stopPropagation();
      if (babelHelpers.typeof(this._elements[key]) !== "undefined") {
        if ("gizmo" == this.pickerType) {
          window.HaxStore.write("activeHaxElement", this._elements[key], this);
          if ("__convert" === this._elements[key].__type) {
            window.HaxStore.instance.haxManager.editExistingNode = !0;
          }
          window.HaxStore.instance.haxManager.selectStep("configure");
          window.HaxStore.instance.haxManager.open();
        } else if ("delete" == this.pickerType) {
          if ("Yes" === this._elements[key].title) {
            if (
              window.HaxStore.instance.activeHaxBody.activeNode !==
              window.HaxStore.instance.activeHaxBody.activeContainerNode
            ) {
              window.HaxStore.instance.activeHaxBody.haxDeleteNode(
                window.HaxStore.instance.activeHaxBody.activeNode,
                window.HaxStore.instance.activeHaxBody.activeContainerNode
              );
            } else {
              window.HaxStore.instance.activeHaxBody.haxDeleteNode(
                window.HaxStore.instance.activeHaxBody.activeNode
              );
            }
            window.HaxStore.toast("Element deleted", 2e3);
          }
        } else {
          this.fire("hax-app-picker-selection", this._elements[key]);
        }
      }
      this.opened = !1;
    }
  });
});
