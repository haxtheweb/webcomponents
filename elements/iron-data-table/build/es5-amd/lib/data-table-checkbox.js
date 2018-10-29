define(["../node_modules/@polymer/polymer/polymer-legacy.js"], function(
  _polymerLegacy
) {
  "use strict";
  function _templateObject_874f77a0db3211e8b19ec1bb797f407e() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        height: 48px;\n        flex-basis: 48px;\n        flex-grow: 0;\n        flex-shrink: 0;\n        padding: 0 8px 0 12px;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        border-right: 1px solid #e3e3e3;\n      }\n\n      :host([header]) {\n        height: 56px;\n      }\n\n      :host([hidden]) {\n        display: none;\n      }\n\n      :host(:focus) {\n        outline: none;\n      }\n\n      #container {\n        position: relative;\n        box-sizing: border-box;\n        height: 18px;\n        width: 18px;\n        border: solid 2px;\n        border-color: var(--primary-text-color);\n        border-radius: 2px;\n        pointer-events: none;\n        -webkit-transition: background-color 140ms, border-color 140ms;\n        transition: background-color 140ms, border-color 140ms;\n      }\n\n      :host([checked]) #container {\n        border-color: var(--default-primary-color);\n        background-color: var(--default-primary-color);\n      }\n\n      :host([checked]) .checkmark {\n        border-bottom: 2px solid white;\n        border-right: 2px solid white;\n        width: 36%;\n        height: 70%;\n        -webkit-transform-origin: 97% 86%;\n        transform-origin: 97% 86%;\n        -webkit-animation: checkmark-expand 140ms ease-out forwards;\n        animation: checkmark-expand 140ms ease-out forwards;\n      }\n\n      @-webkit-keyframes checkmark-expand {\n        0% {\n          -webkit-transform: scale(0, 0) rotate(45deg);\n        }\n        100% {\n          -webkit-transform: scale(1, 1) rotate(45deg);\n        }\n      }\n\n      @keyframes checkmark-expand {\n        0% {\n          transform: scale(0, 0) rotate(45deg);\n        }\n        100% {\n          transform: scale(1, 1) rotate(45deg);\n        }\n      }\n\n      :host([indeterminate]) .checkmark {\n        border-bottom: 2px solid var(--primary-text-color);\n        width: 60%;\n        height: 45%;\n        margin-left: 3px;\n        -webkit-animation: indeterminate-expand 140ms ease-out forwards;\n        animation: indeterminate-expand 140ms ease-out forwards;\n      }\n\n      @-webkit-keyframes indeterminate-expand {\n        0% {\n          -webkit-transform: scale(0, 0);\n        }\n        100% {\n          -webkit-transform: scale(1, 1);\n        }\n      }\n\n      @keyframes indeterminate-expand {\n        0% {\n          transform: scale(0, 1);\n        }\n        100% {\n          transform: scale(1, 1);\n        }\n      }\n    </style>\n\n    <div id="container">\n      <div class="checkmark"></div>\n    </div>\n'
    ]);
    _templateObject_874f77a0db3211e8b19ec1bb797f407e = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_874f77a0db3211e8b19ec1bb797f407e()
    ),
    is: "data-table-checkbox",
    properties: {
      checked: {
        type: Boolean,
        observer: "_checkedChanged",
        reflectToAttribute: !0,
        value: !1
      },
      indeterminate: {
        type: Boolean,
        reflectToAttribute: !0,
        observer: "_indeterminateChanged",
        value: !1
      }
    },
    _checkedChanged: function _checkedChanged(checked) {
      if (checked) {
        this.indeterminate = !1;
      }
    },
    _indeterminateChanged: function _indeterminateChanged(indeterminate) {
      if (indeterminate) {
        this.checked = !1;
      }
    }
  });
});
