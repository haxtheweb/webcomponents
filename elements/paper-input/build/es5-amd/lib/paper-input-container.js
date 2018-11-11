define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js",
  "../node_modules/@polymer/iron-flex-layout/iron-flex-layout.js",
  "../node_modules/@polymer/paper-styles/default-theme.js",
  "../node_modules/@polymer/paper-styles/typography.js"
], function(_polymerLegacy, _polymerDom) {
  "use strict";
  function _templateObject_087a8f20e5f811e8b91beffadbea2ff4() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style>\n      :host {\n        display: block;\n        padding: 8px 0;\n\n        --paper-input-container-shared-input-style: {\n          position: relative; /* to make a stacking context */\n          outline: none;\n          box-shadow: none;\n          padding: 0;\n          width: 100%;\n          max-width: 100%;\n          background: transparent;\n          border: none;\n          color: var(--paper-input-container-input-color, var(--primary-text-color));\n          -webkit-appearance: none;\n          text-align: inherit;\n          vertical-align: bottom;\n\n          @apply --paper-font-subhead;\n        };\n\n        @apply --paper-input-container;\n      }\n\n      :host([inline]) {\n        display: inline-block;\n      }\n\n      :host([disabled]) {\n        pointer-events: none;\n        opacity: 0.33;\n\n        @apply --paper-input-container-disabled;\n      }\n\n      :host([hidden]) {\n        display: none !important;\n      }\n\n      [hidden] {\n        display: none !important;\n      }\n\n      .floated-label-placeholder {\n        @apply --paper-font-caption;\n      }\n\n      .underline {\n        height: 2px;\n        position: relative;\n      }\n\n      .focused-line {\n        @apply --layout-fit;\n        border-bottom: 2px solid var(--paper-input-container-focus-color, var(--primary-color));\n\n        -webkit-transform-origin: center center;\n        transform-origin: center center;\n        -webkit-transform: scale3d(0,1,1);\n        transform: scale3d(0,1,1);\n\n        @apply --paper-input-container-underline-focus;\n      }\n\n      .underline.is-highlighted .focused-line {\n        -webkit-transform: none;\n        transform: none;\n        -webkit-transition: -webkit-transform 0.25s;\n        transition: transform 0.25s;\n\n        @apply --paper-transition-easing;\n      }\n\n      .underline.is-invalid .focused-line {\n        border-color: var(--paper-input-container-invalid-color, var(--error-color));\n        -webkit-transform: none;\n        transform: none;\n        -webkit-transition: -webkit-transform 0.25s;\n        transition: transform 0.25s;\n\n        @apply --paper-transition-easing;\n      }\n\n      .unfocused-line {\n        @apply --layout-fit;\n        border-bottom: 1px solid var(--paper-input-container-color, var(--secondary-text-color));\n        @apply --paper-input-container-underline;\n      }\n\n      :host([disabled]) .unfocused-line {\n        border-bottom: 1px dashed;\n        border-color: var(--paper-input-container-color, var(--secondary-text-color));\n        @apply --paper-input-container-underline-disabled;\n      }\n\n      .input-wrapper {\n        @apply --layout-horizontal;\n        @apply --layout-center;\n        position: relative;\n      }\n\n      .input-content {\n        @apply --layout-flex-auto;\n        @apply --layout-relative;\n        max-width: 100%;\n      }\n\n      .input-content ::slotted(label),\n      .input-content ::slotted(.paper-input-label) {\n        position: absolute;\n        top: 0;\n        right: 0;\n        left: 0;\n        width: 100%;\n        font: inherit;\n        color: var(--paper-input-container-color, var(--secondary-text-color));\n        -webkit-transition: -webkit-transform 0.25s, width 0.25s;\n        transition: transform 0.25s, width 0.25s;\n        -webkit-transform-origin: left top;\n        transform-origin: left top;\n\n        @apply --paper-font-common-nowrap;\n        @apply --paper-font-subhead;\n        @apply --paper-input-container-label;\n        @apply --paper-transition-easing;\n      }\n\n      .input-content.label-is-floating ::slotted(label),\n      .input-content.label-is-floating ::slotted(.paper-input-label) {\n        -webkit-transform: translateY(-75%) scale(0.75);\n        transform: translateY(-75%) scale(0.75);\n\n        /* Since we scale to 75/100 of the size, we actually have 100/75 of the\n        original space now available */\n        width: 133%;\n\n        @apply --paper-input-container-label-floating;\n      }\n\n      :host-context([dir="rtl"]) .input-content.label-is-floating ::slotted(label),\n      :host-context([dir="rtl"]) .input-content.label-is-floating ::slotted(.paper-input-label) {\n        /* TODO(noms): Figure out why leaving the width at 133% before the animation\n         * actually makes\n         * it wider on the right side, not left side, as you would expect in RTL */\n        width: 100%;\n        -webkit-transform-origin: right top;\n        transform-origin: right top;\n      }\n\n      .input-content.label-is-highlighted ::slotted(label),\n      .input-content.label-is-highlighted ::slotted(.paper-input-label) {\n        color: var(--paper-input-container-focus-color, var(--primary-color));\n\n        @apply --paper-input-container-label-focus;\n      }\n\n      .input-content.is-invalid ::slotted(label),\n      .input-content.is-invalid ::slotted(.paper-input-label) {\n        color: var(--paper-input-container-invalid-color, var(--error-color));\n      }\n\n      .input-content.label-is-hidden ::slotted(label),\n      .input-content.label-is-hidden ::slotted(.paper-input-label) {\n        visibility: hidden;\n      }\n\n      .input-content ::slotted(iron-input) {\n        @apply --paper-input-container-shared-input-style;\n      }\n      \n      .input-content ::slotted(input),\n      .input-content ::slotted(textarea),\n      .input-content ::slotted(iron-autogrow-textarea),\n      .input-content ::slotted(.paper-input-input) {\n        @apply --paper-input-container-shared-input-style;\n        @apply --paper-input-container-input;\n      }\n\n      .input-content ::slotted(input)::-webkit-outer-spin-button,\n      .input-content ::slotted(input)::-webkit-inner-spin-button {\n        @apply --paper-input-container-input-webkit-spinner;\n      }\n      \n      .input-content.focused ::slotted(input),\n      .input-content.focused ::slotted(textarea),\n      .input-content.focused ::slotted(iron-autogrow-textarea),\n      .input-content.focused ::slotted(.paper-input-input) {\n        @apply --paper-input-container-input-focus;\n      }\n\n      .input-content.is-invalid ::slotted(input),\n      .input-content.is-invalid ::slotted(textarea),\n      .input-content.is-invalid ::slotted(iron-autogrow-textarea),\n      .input-content.is-invalid ::slotted(.paper-input-input) {\n        @apply --paper-input-container-input-invalid;\n      }\n      \n      .prefix ::slotted(*) {\n        display: inline-block;\n        @apply --paper-font-subhead;\n        @apply --layout-flex-none;\n        @apply --paper-input-prefix;\n      }\n\n      .suffix ::slotted(*) {\n        display: inline-block;\n        @apply --paper-font-subhead;\n        @apply --layout-flex-none;\n\n        @apply --paper-input-suffix;\n      }\n\n      /* Firefox sets a min-width on the input, which can cause layout issues */\n      .input-content ::slotted(input) {\n        min-width: 0;\n      }\n\n      .input-content ::slotted(textarea) {\n        resize: none;\n      }\n\n      .add-on-content {\n        position: relative;\n      }\n\n      .add-on-content.is-invalid ::slotted(*) {\n        color: var(--paper-input-container-invalid-color, var(--error-color));\n      }\n\n      .add-on-content.is-highlighted ::slotted(*) {\n        color: var(--paper-input-container-focus-color, var(--primary-color));\n      }\n    </style>\n\n    <div class="floated-label-placeholder" aria-hidden="true" hidden="[[noLabelFloat]]">&nbsp;</div>\n\n    <div class="input-wrapper">\n      <span class="prefix"><slot name="prefix"></slot></span>\n\n      <div class$="[[_computeInputContentClass(noLabelFloat,alwaysFloatLabel,focused,invalid,_inputHasContent)]]" id="labelAndInputContainer">\n        <slot name="label"></slot>\n        <slot name="input"></slot>\n      </div>\n\n      <span class="suffix"><slot name="suffix"></slot></span>\n    </div>\n\n    <div class$="[[_computeUnderlineClass(focused,invalid)]]">\n      <div class="unfocused-line"></div>\n      <div class="focused-line"></div>\n    </div>\n\n    <div class$="[[_computeAddOnContentClass(focused,invalid)]]">\n      <slot name="add-on"></slot>\n    </div>\n'
      ],
      [
        '\n    <style>\n      :host {\n        display: block;\n        padding: 8px 0;\n\n        --paper-input-container-shared-input-style: {\n          position: relative; /* to make a stacking context */\n          outline: none;\n          box-shadow: none;\n          padding: 0;\n          width: 100%;\n          max-width: 100%;\n          background: transparent;\n          border: none;\n          color: var(--paper-input-container-input-color, var(--primary-text-color));\n          -webkit-appearance: none;\n          text-align: inherit;\n          vertical-align: bottom;\n\n          @apply --paper-font-subhead;\n        };\n\n        @apply --paper-input-container;\n      }\n\n      :host([inline]) {\n        display: inline-block;\n      }\n\n      :host([disabled]) {\n        pointer-events: none;\n        opacity: 0.33;\n\n        @apply --paper-input-container-disabled;\n      }\n\n      :host([hidden]) {\n        display: none !important;\n      }\n\n      [hidden] {\n        display: none !important;\n      }\n\n      .floated-label-placeholder {\n        @apply --paper-font-caption;\n      }\n\n      .underline {\n        height: 2px;\n        position: relative;\n      }\n\n      .focused-line {\n        @apply --layout-fit;\n        border-bottom: 2px solid var(--paper-input-container-focus-color, var(--primary-color));\n\n        -webkit-transform-origin: center center;\n        transform-origin: center center;\n        -webkit-transform: scale3d(0,1,1);\n        transform: scale3d(0,1,1);\n\n        @apply --paper-input-container-underline-focus;\n      }\n\n      .underline.is-highlighted .focused-line {\n        -webkit-transform: none;\n        transform: none;\n        -webkit-transition: -webkit-transform 0.25s;\n        transition: transform 0.25s;\n\n        @apply --paper-transition-easing;\n      }\n\n      .underline.is-invalid .focused-line {\n        border-color: var(--paper-input-container-invalid-color, var(--error-color));\n        -webkit-transform: none;\n        transform: none;\n        -webkit-transition: -webkit-transform 0.25s;\n        transition: transform 0.25s;\n\n        @apply --paper-transition-easing;\n      }\n\n      .unfocused-line {\n        @apply --layout-fit;\n        border-bottom: 1px solid var(--paper-input-container-color, var(--secondary-text-color));\n        @apply --paper-input-container-underline;\n      }\n\n      :host([disabled]) .unfocused-line {\n        border-bottom: 1px dashed;\n        border-color: var(--paper-input-container-color, var(--secondary-text-color));\n        @apply --paper-input-container-underline-disabled;\n      }\n\n      .input-wrapper {\n        @apply --layout-horizontal;\n        @apply --layout-center;\n        position: relative;\n      }\n\n      .input-content {\n        @apply --layout-flex-auto;\n        @apply --layout-relative;\n        max-width: 100%;\n      }\n\n      .input-content ::slotted(label),\n      .input-content ::slotted(.paper-input-label) {\n        position: absolute;\n        top: 0;\n        right: 0;\n        left: 0;\n        width: 100%;\n        font: inherit;\n        color: var(--paper-input-container-color, var(--secondary-text-color));\n        -webkit-transition: -webkit-transform 0.25s, width 0.25s;\n        transition: transform 0.25s, width 0.25s;\n        -webkit-transform-origin: left top;\n        transform-origin: left top;\n\n        @apply --paper-font-common-nowrap;\n        @apply --paper-font-subhead;\n        @apply --paper-input-container-label;\n        @apply --paper-transition-easing;\n      }\n\n      .input-content.label-is-floating ::slotted(label),\n      .input-content.label-is-floating ::slotted(.paper-input-label) {\n        -webkit-transform: translateY(-75%) scale(0.75);\n        transform: translateY(-75%) scale(0.75);\n\n        /* Since we scale to 75/100 of the size, we actually have 100/75 of the\n        original space now available */\n        width: 133%;\n\n        @apply --paper-input-container-label-floating;\n      }\n\n      :host-context([dir="rtl"]) .input-content.label-is-floating ::slotted(label),\n      :host-context([dir="rtl"]) .input-content.label-is-floating ::slotted(.paper-input-label) {\n        /* TODO(noms): Figure out why leaving the width at 133% before the animation\n         * actually makes\n         * it wider on the right side, not left side, as you would expect in RTL */\n        width: 100%;\n        -webkit-transform-origin: right top;\n        transform-origin: right top;\n      }\n\n      .input-content.label-is-highlighted ::slotted(label),\n      .input-content.label-is-highlighted ::slotted(.paper-input-label) {\n        color: var(--paper-input-container-focus-color, var(--primary-color));\n\n        @apply --paper-input-container-label-focus;\n      }\n\n      .input-content.is-invalid ::slotted(label),\n      .input-content.is-invalid ::slotted(.paper-input-label) {\n        color: var(--paper-input-container-invalid-color, var(--error-color));\n      }\n\n      .input-content.label-is-hidden ::slotted(label),\n      .input-content.label-is-hidden ::slotted(.paper-input-label) {\n        visibility: hidden;\n      }\n\n      .input-content ::slotted(iron-input) {\n        @apply --paper-input-container-shared-input-style;\n      }\n      \n      .input-content ::slotted(input),\n      .input-content ::slotted(textarea),\n      .input-content ::slotted(iron-autogrow-textarea),\n      .input-content ::slotted(.paper-input-input) {\n        @apply --paper-input-container-shared-input-style;\n        @apply --paper-input-container-input;\n      }\n\n      .input-content ::slotted(input)::-webkit-outer-spin-button,\n      .input-content ::slotted(input)::-webkit-inner-spin-button {\n        @apply --paper-input-container-input-webkit-spinner;\n      }\n      \n      .input-content.focused ::slotted(input),\n      .input-content.focused ::slotted(textarea),\n      .input-content.focused ::slotted(iron-autogrow-textarea),\n      .input-content.focused ::slotted(.paper-input-input) {\n        @apply --paper-input-container-input-focus;\n      }\n\n      .input-content.is-invalid ::slotted(input),\n      .input-content.is-invalid ::slotted(textarea),\n      .input-content.is-invalid ::slotted(iron-autogrow-textarea),\n      .input-content.is-invalid ::slotted(.paper-input-input) {\n        @apply --paper-input-container-input-invalid;\n      }\n      \n      .prefix ::slotted(*) {\n        display: inline-block;\n        @apply --paper-font-subhead;\n        @apply --layout-flex-none;\n        @apply --paper-input-prefix;\n      }\n\n      .suffix ::slotted(*) {\n        display: inline-block;\n        @apply --paper-font-subhead;\n        @apply --layout-flex-none;\n\n        @apply --paper-input-suffix;\n      }\n\n      /* Firefox sets a min-width on the input, which can cause layout issues */\n      .input-content ::slotted(input) {\n        min-width: 0;\n      }\n\n      .input-content ::slotted(textarea) {\n        resize: none;\n      }\n\n      .add-on-content {\n        position: relative;\n      }\n\n      .add-on-content.is-invalid ::slotted(*) {\n        color: var(--paper-input-container-invalid-color, var(--error-color));\n      }\n\n      .add-on-content.is-highlighted ::slotted(*) {\n        color: var(--paper-input-container-focus-color, var(--primary-color));\n      }\n    </style>\n\n    <div class="floated-label-placeholder" aria-hidden="true" hidden="[[noLabelFloat]]">&nbsp;</div>\n\n    <div class="input-wrapper">\n      <span class="prefix"><slot name="prefix"></slot></span>\n\n      <div class\\$="[[_computeInputContentClass(noLabelFloat,alwaysFloatLabel,focused,invalid,_inputHasContent)]]" id="labelAndInputContainer">\n        <slot name="label"></slot>\n        <slot name="input"></slot>\n      </div>\n\n      <span class="suffix"><slot name="suffix"></slot></span>\n    </div>\n\n    <div class\\$="[[_computeUnderlineClass(focused,invalid)]]">\n      <div class="unfocused-line"></div>\n      <div class="focused-line"></div>\n    </div>\n\n    <div class\\$="[[_computeAddOnContentClass(focused,invalid)]]">\n      <slot name="add-on"></slot>\n    </div>\n'
      ]
    );
    _templateObject_087a8f20e5f811e8b91beffadbea2ff4 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_087a8f20e5f811e8b91beffadbea2ff4()
    ),
    is: "paper-input-container",
    properties: {
      noLabelFloat: { type: Boolean, value: !1 },
      alwaysFloatLabel: { type: Boolean, value: !1 },
      attrForValue: { type: String, value: "bind-value" },
      autoValidate: { type: Boolean, value: !1 },
      invalid: { observer: "_invalidChanged", type: Boolean, value: !1 },
      focused: { readOnly: !0, type: Boolean, value: !1, notify: !0 },
      _addons: { type: Array },
      _inputHasContent: { type: Boolean, value: !1 },
      _inputSelector: {
        type: String,
        value: "input,iron-input,textarea,.paper-input-input"
      },
      _boundOnFocus: {
        type: Function,
        value: function value() {
          return this._onFocus.bind(this);
        }
      },
      _boundOnBlur: {
        type: Function,
        value: function value() {
          return this._onBlur.bind(this);
        }
      },
      _boundOnInput: {
        type: Function,
        value: function value() {
          return this._onInput.bind(this);
        }
      },
      _boundValueChanged: {
        type: Function,
        value: function value() {
          return this._onValueChanged.bind(this);
        }
      }
    },
    listeners: {
      "addon-attached": "_onAddonAttached",
      "iron-input-validate": "_onIronInputValidate"
    },
    get _valueChangedEvent() {
      return this.attrForValue + "-changed";
    },
    get _propertyForValue() {
      return dashToCamelCase(this.attrForValue);
    },
    get _inputElement() {
      return (0, _polymerDom.dom)(this).querySelector(this._inputSelector);
    },
    get _inputElementValue() {
      return (
        this._inputElement[this._propertyForValue] || this._inputElement.value
      );
    },
    ready: function ready() {
      if (!this._addons) {
        this._addons = [];
      }
      this.addEventListener("focus", this._boundOnFocus, !0);
      this.addEventListener("blur", this._boundOnBlur, !0);
    },
    attached: function attached() {
      if (this.attrForValue) {
        this._inputElement.addEventListener(
          this._valueChangedEvent,
          this._boundValueChanged
        );
      } else {
        this.addEventListener("input", this._onInput);
      }
      if (this._inputElementValue && "" != this._inputElementValue) {
        this._handleValueAndAutoValidate(this._inputElement);
      } else {
        this._handleValue(this._inputElement);
      }
    },
    _onAddonAttached: function _onAddonAttached(event) {
      if (!this._addons) {
        this._addons = [];
      }
      var target = event.target;
      if (-1 === this._addons.indexOf(target)) {
        this._addons.push(target);
        if (this.isAttached) {
          this._handleValue(this._inputElement);
        }
      }
    },
    _onFocus: function _onFocus() {
      this._setFocused(!0);
    },
    _onBlur: function _onBlur() {
      this._setFocused(!1);
      this._handleValueAndAutoValidate(this._inputElement);
    },
    _onInput: function _onInput(event) {
      this._handleValueAndAutoValidate(event.target);
    },
    _onValueChanged: function _onValueChanged(event) {
      var input = event.target;
      if (input.value === void 0) {
        return;
      }
      this._handleValueAndAutoValidate(event.target);
    },
    _handleValue: function _handleValue(inputElement) {
      var value = this._inputElementValue;
      if (
        value ||
        0 === value ||
        ("number" === inputElement.type && !inputElement.checkValidity())
      ) {
        this._inputHasContent = !0;
      } else {
        this._inputHasContent = !1;
      }
      this.updateAddons({
        inputElement: inputElement,
        value: value,
        invalid: this.invalid
      });
    },
    _handleValueAndAutoValidate: function _handleValueAndAutoValidate(
      inputElement
    ) {
      if (this.autoValidate && inputElement) {
        var valid;
        if (inputElement.validate) {
          valid = inputElement.validate(this._inputElementValue);
        } else {
          valid = inputElement.checkValidity();
        }
        this.invalid = !valid;
      }
      this._handleValue(inputElement);
    },
    _onIronInputValidate: function _onIronInputValidate() {
      this.invalid = this._inputElement.invalid;
    },
    _invalidChanged: function _invalidChanged() {
      if (this._addons) {
        this.updateAddons({ invalid: this.invalid });
      }
    },
    updateAddons: function updateAddons(state) {
      for (var addon, index = 0; (addon = this._addons[index]); index++) {
        addon.update(state);
      }
    },
    _computeInputContentClass: function _computeInputContentClass(
      noLabelFloat,
      alwaysFloatLabel,
      focused,
      invalid,
      _inputHasContent
    ) {
      var cls = "input-content";
      if (!noLabelFloat) {
        var label = this.querySelector("label");
        if (alwaysFloatLabel || _inputHasContent) {
          cls += " label-is-floating";
          this.$.labelAndInputContainer.style.position = "static";
          if (invalid) {
            cls += " is-invalid";
          } else if (focused) {
            cls += " label-is-highlighted";
          }
        } else {
          if (label) {
            this.$.labelAndInputContainer.style.position = "relative";
          }
          if (invalid) {
            cls += " is-invalid";
          }
        }
      } else {
        if (_inputHasContent) {
          cls += " label-is-hidden";
        }
        if (invalid) {
          cls += " is-invalid";
        }
      }
      if (focused) {
        cls += " focused";
      }
      return cls;
    },
    _computeUnderlineClass: function _computeUnderlineClass(focused, invalid) {
      var cls = "underline";
      if (invalid) {
        cls += " is-invalid";
      } else if (focused) {
        cls += " is-highlighted";
      }
      return cls;
    },
    _computeAddOnContentClass: function _computeAddOnContentClass(
      focused,
      invalid
    ) {
      var cls = "add-on-content";
      if (invalid) {
        cls += " is-invalid";
      } else if (focused) {
        cls += " is-highlighted";
      }
      return cls;
    }
  });
});
