define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@lrnwebcomponents/lrndesign-avatar/lrndesign-avatar.js",
  "../node_modules/@polymer/iron-collapse/iron-collapse.js",
  "../node_modules/@polymer/iron-icon/iron-icon.js",
  "../node_modules/@polymer/iron-behaviors/iron-button-state.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_3d5d4420e5f911e88f58a900e4d6e8ab() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style>\n      :host {\n        display: block;\n      }\n\n      :host([active]) {\n        background: var(--map-menu-active-color);\n      }\n\n      #container {\n        display: flex;\n        align-items: center;\n      }\n\n      #avatarLabel {\n        margin-right: 10px;\n      }\n\n      #center {\n        flex: 1 1 auto;\n      }\n\n      lrndesign-avatar {\n        display: inline-block;\n        background: #fff;\n        border-radius: 50%;\n        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);\n        padding: 2px;\n        position: relative;\n        margin-top: -2px;\n      }\n\n      lrndesign-avatar ::shadow>* {\n        transform: translateY(2px);\n      }\n\n      #link {\n        display: flex;\n        justify-content: flex-start;\n        align-items: flex-start;\n        flex-direction: column;\n      }\n\n      #title {\n        font-size: 16px;\n      }\n\n      #right iron-icon {\n        color: gray;\n      }\n\n      /* @todo this is a hack */\n      #icon iron-icon {\n        --iron-icon-height: 16px;\n        transform: translateX(10px);\n      }\n    </style>\n    <div id="container">\n      <template is="dom-if" if="[[avatarLabel]]">\n        <div id="avatarLabel">\n          <lrndesign-avatar label="[[avatarLabel]]"></lrndesign-avatar>\n        </div>\n      </template>\n      <template is="dom-if" if="[[icon]]">\n        <div id="icon">\n          <iron-icon icon="[[icon]]"></iron-icon>\n        </div>\n      </template>\n      <div id="center">\n        <paper-button id="title" noink="" role$="[[__titleRole()]]" on-tap="__linkClickHandler">\n          <div id="label">[[label]]</div>\n          <div id="title">[[title]]</div>\n        </paper-button>\n      </div>\n      <div id="right">\n        <template is="dom-if" if="[[!opened]]">\n          <iron-icon id="toggle" icon="arrow-drop-down" aria-role="button" aria-label="expand menu" tabindex="0"></iron-icon>\n        </template>\n        <template is="dom-if" if="[[opened]]">\n          <iron-icon id="toggle" icon="arrow-drop-up" aria-role="button" aria-label="collapse menu" tabindex="0"></iron-icon>\n        </template>\n      </div>\n    </div>\n'
      ],
      [
        '\n    <style>\n      :host {\n        display: block;\n      }\n\n      :host([active]) {\n        background: var(--map-menu-active-color);\n      }\n\n      #container {\n        display: flex;\n        align-items: center;\n      }\n\n      #avatarLabel {\n        margin-right: 10px;\n      }\n\n      #center {\n        flex: 1 1 auto;\n      }\n\n      lrndesign-avatar {\n        display: inline-block;\n        background: #fff;\n        border-radius: 50%;\n        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);\n        padding: 2px;\n        position: relative;\n        margin-top: -2px;\n      }\n\n      lrndesign-avatar ::shadow>* {\n        transform: translateY(2px);\n      }\n\n      #link {\n        display: flex;\n        justify-content: flex-start;\n        align-items: flex-start;\n        flex-direction: column;\n      }\n\n      #title {\n        font-size: 16px;\n      }\n\n      #right iron-icon {\n        color: gray;\n      }\n\n      /* @todo this is a hack */\n      #icon iron-icon {\n        --iron-icon-height: 16px;\n        transform: translateX(10px);\n      }\n    </style>\n    <div id="container">\n      <template is="dom-if" if="[[avatarLabel]]">\n        <div id="avatarLabel">\n          <lrndesign-avatar label="[[avatarLabel]]"></lrndesign-avatar>\n        </div>\n      </template>\n      <template is="dom-if" if="[[icon]]">\n        <div id="icon">\n          <iron-icon icon="[[icon]]"></iron-icon>\n        </div>\n      </template>\n      <div id="center">\n        <paper-button id="title" noink="" role\\$="[[__titleRole()]]" on-tap="__linkClickHandler">\n          <div id="label">[[label]]</div>\n          <div id="title">[[title]]</div>\n        </paper-button>\n      </div>\n      <div id="right">\n        <template is="dom-if" if="[[!opened]]">\n          <iron-icon id="toggle" icon="arrow-drop-down" aria-role="button" aria-label="expand menu" tabindex="0"></iron-icon>\n        </template>\n        <template is="dom-if" if="[[opened]]">\n          <iron-icon id="toggle" icon="arrow-drop-up" aria-role="button" aria-label="collapse menu" tabindex="0"></iron-icon>\n        </template>\n      </div>\n    </div>\n'
      ]
    );
    _templateObject_3d5d4420e5f911e88f58a900e4d6e8ab = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_3d5d4420e5f911e88f58a900e4d6e8ab()
    ),
    is: "map-menu-header",
    properties: {
      title: { type: String },
      label: { type: String },
      avatarLabel: { type: String, value: "" },
      opened: { type: Boolean },
      url: { type: String, value: "" },
      id: { type: String, reflectToAttribute: !0 },
      icon: { type: String },
      active: { type: Boolean, value: !1, observer: "__activeChanged" }
    },
    listeners: { tap: "__tap", keypress: "__keypress" },
    __titleRole: function __titleRole() {
      if (this.url) {
        return "link";
      } else {
        return !1;
      }
    },
    __linkClickHandler: function __linkClickHandler() {
      if (this.id) {
        this.fire("link-clicked", { id: this.id });
      }
    },
    attached: function attached() {
      this.fire("child-attached", { id: this.id });
    },
    __activeChanged: function __activeChanged(active, oldActive) {
      if (active === oldActive) return;
      if (!0 === active) {
        this.fire("active-item", { id: this.id });
      }
    },
    __tap: function __tap(e) {
      this.__toggleEventHandler(e);
    },
    __keypress: function __keypress(e) {
      if ("Enter" === e.code) {
        this.__toggleEventHandler(e);
      }
    },
    __toggleEventHandler: function __toggleEventHandler(e) {
      if ("undefined" !== typeof e.target) {
        if ("undefined" !== typeof e.target.id) {
          if ("toggle" === e.target.id) {
            this.fire("toggle-header");
          }
        }
      }
    }
  });
});
