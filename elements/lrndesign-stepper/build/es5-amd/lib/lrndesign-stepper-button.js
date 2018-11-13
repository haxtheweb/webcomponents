define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/paper-button/paper-button.js",
  "../node_modules/@polymer/iron-icon/iron-icon.js",
  "../node_modules/@polymer/iron-icons/iron-icons.js",
  "../node_modules/@polymer/iron-icons/av-icons.js",
  "../node_modules/@polymer/iron-icons/social-icons.js",
  "../node_modules/@polymer/iron-collapse/iron-collapse.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_19543850e70611e8971d2f3ef5e8c859() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n       :host {\n        display: block;\n        --lrndesign-icon-button-color: #abacae;\n        --lrndesign-stepper-btn-title-color: #000;\n        --lrndesign-stepper-btn-active: #F6F7F7;\n        --lrndesign-border-color: #abacae;\n      }\n\n      .top-line,\n      .bottom-line {\n        background-color: transparent;\n      }\n\n      :host([location="start"]) .bottom-line {\n        background-color: var(--lrndesign-icon-button-color);\n      }\n\n      :host([location="middle"]) .top-line,\n      :host([location="middle"]) .bottom-line {\n        background-color: var(--lrndesign-icon-button-color);\n      }\n\n      :host([location="end"]) .top-line {\n        background-color: var(--lrndesign-icon-button-color);\n      }\n\n      .top-line {\n        width: 2px;\n        height: 24px;\n        margin: auto;\n      }\n\n      .bottom-line {\n        width: 2px;\n        height: 24px;\n        margin: auto;\n      }\n\n      .stepper-btn {\n        background-color: transparent;\n        display: flex;\n        width: 100%;\n        justify-content: center;\n      }\n\n      .node-title {\n        color: var(--lrndesign-stepper-btn-title-color);\n        text-transform: none;\n        line-height: 32px;\n        font-weight: bold;\n        font-size: 16px;\n      }\n\n      .btn-icon {\n        background-color: transparent;\n        color: var(--lrndesign-icon-button-color);\n        border-radius: 50%;\n        --iron-icon-height: 35px;\n        --iron-icon-width: 35px;\n      }\n\n      .url-style {\n        text-decoration: none;\n      }\n\n      .title-container {\n        padding: 10px;\n        width: 70%;\n        position: relative;\n        right: 19.2px;\n      }\n\n      .title-container:hover {\n        text-decoration: underline;\n      }\n\n      .box-container {\n        display: flex;\n        flex-direction: column;\n        justify-content: center;\n        align-items: flex-start;\n        position: relative;\n        width: 30%;\n      }\n\n      paper-button {\n        width: 100%;\n        position: relative;\n      }\n\n      paper-button:after {\n        content: \'\';\n        display: block;\n        position: absolute;\n        width: 100%;\n        height: 100%;\n        top: 0;\n        left: 0;\n        border-top: 1px solid transparent;\n        border-bottom: 1px solid transparent;\n      }\n\n      paper-button:active,\n      paper-button:focus {\n        background-color: var(--lrndesign-stepper-btn-active);\n      }\n      paper-button:focus iron-icon {\n        color: black;\n      }\n\n      paper-button:active:after,\n      paper-button:focus:after {\n        border-color: var(--lrndesign-border-color);\n      }\n\n      paper-button {\n        --paper-button: {\n          border-radius: 0;\n          padding: 0;\n        }\n      }\n    </style>\n\n    <template is="dom-if" if="{{hasCollapse(collapsible, 1)}}">\n      <paper-button noink="" on-click="collapseToggle">\n        <div class="box-container">\n          <div class="top-line"></div>\n          <div class="stepper-btn">\n            <iron-icon icon="[[icon]]" class="btn-icon"></iron-icon>\n          </div>\n          <div class="bottom-line"></div>\n        </div>\n        <div class="title-container">\n          <div class="node-title">[[title]]</div>\n        </div>\n      </paper-button>\n      <iron-collapse>\n      <div>\n        <slot></slot>\n      </div>\n      </iron-collapse>\n    </template>\n    <template is="dom-if" if="{{hasCollapse(collapsible, 0)}}">\n      <a tabindex="-1" href="[[url]]" class="url-style">\n      <paper-button class="btn" noink="">\n        <div class="box-container">\n          <div class="top-line"></div>\n          <div class="stepper-btn">\n            <iron-icon icon="[[icon]]" class="btn-icon"></iron-icon>\n          </div>\n          <div class="bottom-line"></div>\n        </div>\n        <div class="title-container">\n          <div class="node-title">[[title]]</div>\n        </div>\n      </paper-button>\n      </a>\n      <slot></slot>\n    </template>\n'
    ]);
    _templateObject_19543850e70611e8971d2f3ef5e8c859 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_19543850e70611e8971d2f3ef5e8c859()
    ),
    is: "lrndesign-stepper-button",
    properties: {
      title: { type: String, reflectToAttribute: !0, notify: !0 },
      icon: { type: String, reflectToAttribute: !0, notify: !0 },
      url: { type: String, reflectToAttribute: !0, notify: !0 },
      location: { type: String, reflectToAttribute: !0, notify: !0 },
      collapsible: {
        type: Boolean,
        reflectToAttribute: !0,
        notify: !0,
        value: !1
      },
      opened: { type: Boolean, value: !1 }
    },
    ready: function ready() {
      var root = this;
      setTimeout(function() {
        var target = root.shadowRoot.querySelector("iron-collapse");
        if (root.opened) {
          console.log("opening in stepper");
          target.show();
        }
      }, 0);
    },
    collapseToggle: function collapseToggle(e) {
      e.target.nextElementSibling.toggle();
    },
    hasCollapse: function hasCollapse(bool, test) {
      if (bool == test) {
        return !0;
      } else {
        return !1;
      }
    }
  });
});
