import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import { dom } from "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
import "../node_modules/@polymer/iron-flex-layout/iron-flex-layout.js";
import "../node_modules/@polymer/paper-styles/default-theme.js";
import "../node_modules/@polymer/paper-styles/typography.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        padding: 8px 0;

        --paper-input-container-shared-input-style: {
          position: relative; /* to make a stacking context */
          outline: none;
          box-shadow: none;
          padding: 0;
          width: 100%;
          max-width: 100%;
          background: transparent;
          border: none;
          color: var(--paper-input-container-input-color, var(--primary-text-color));
          -webkit-appearance: none;
          text-align: inherit;
          vertical-align: bottom;

          @apply --paper-font-subhead;
        };

        @apply --paper-input-container;
      }

      :host([inline]) {
        display: inline-block;
      }

      :host([disabled]) {
        pointer-events: none;
        opacity: 0.33;

        @apply --paper-input-container-disabled;
      }

      :host([hidden]) {
        display: none !important;
      }

      [hidden] {
        display: none !important;
      }

      .floated-label-placeholder {
        @apply --paper-font-caption;
      }

      .underline {
        height: 2px;
        position: relative;
      }

      .focused-line {
        @apply --layout-fit;
        border-bottom: 2px solid var(--paper-input-container-focus-color, var(--primary-color));

        -webkit-transform-origin: center center;
        transform-origin: center center;
        -webkit-transform: scale3d(0,1,1);
        transform: scale3d(0,1,1);

        @apply --paper-input-container-underline-focus;
      }

      .underline.is-highlighted .focused-line {
        -webkit-transform: none;
        transform: none;
        -webkit-transition: -webkit-transform 0.25s;
        transition: transform 0.25s;

        @apply --paper-transition-easing;
      }

      .underline.is-invalid .focused-line {
        border-color: var(--paper-input-container-invalid-color, var(--error-color));
        -webkit-transform: none;
        transform: none;
        -webkit-transition: -webkit-transform 0.25s;
        transition: transform 0.25s;

        @apply --paper-transition-easing;
      }

      .unfocused-line {
        @apply --layout-fit;
        border-bottom: 1px solid var(--paper-input-container-color, var(--secondary-text-color));
        @apply --paper-input-container-underline;
      }

      :host([disabled]) .unfocused-line {
        border-bottom: 1px dashed;
        border-color: var(--paper-input-container-color, var(--secondary-text-color));
        @apply --paper-input-container-underline-disabled;
      }

      .input-wrapper {
        @apply --layout-horizontal;
        @apply --layout-center;
        position: relative;
      }

      .input-content {
        @apply --layout-flex-auto;
        @apply --layout-relative;
        max-width: 100%;
      }

      .input-content ::slotted(label),
      .input-content ::slotted(.paper-input-label) {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        width: 100%;
        font: inherit;
        color: var(--paper-input-container-color, var(--secondary-text-color));
        -webkit-transition: -webkit-transform 0.25s, width 0.25s;
        transition: transform 0.25s, width 0.25s;
        -webkit-transform-origin: left top;
        transform-origin: left top;

        @apply --paper-font-common-nowrap;
        @apply --paper-font-subhead;
        @apply --paper-input-container-label;
        @apply --paper-transition-easing;
      }

      .input-content.label-is-floating ::slotted(label),
      .input-content.label-is-floating ::slotted(.paper-input-label) {
        -webkit-transform: translateY(-75%) scale(0.75);
        transform: translateY(-75%) scale(0.75);

        /* Since we scale to 75/100 of the size, we actually have 100/75 of the
        original space now available */
        width: 133%;

        @apply --paper-input-container-label-floating;
      }

      :host-context([dir="rtl"]) .input-content.label-is-floating ::slotted(label),
      :host-context([dir="rtl"]) .input-content.label-is-floating ::slotted(.paper-input-label) {
        /* TODO(noms): Figure out why leaving the width at 133% before the animation
         * actually makes
         * it wider on the right side, not left side, as you would expect in RTL */
        width: 100%;
        -webkit-transform-origin: right top;
        transform-origin: right top;
      }

      .input-content.label-is-highlighted ::slotted(label),
      .input-content.label-is-highlighted ::slotted(.paper-input-label) {
        color: var(--paper-input-container-focus-color, var(--primary-color));

        @apply --paper-input-container-label-focus;
      }

      .input-content.is-invalid ::slotted(label),
      .input-content.is-invalid ::slotted(.paper-input-label) {
        color: var(--paper-input-container-invalid-color, var(--error-color));
      }

      .input-content.label-is-hidden ::slotted(label),
      .input-content.label-is-hidden ::slotted(.paper-input-label) {
        visibility: hidden;
      }

      .input-content ::slotted(iron-input) {
        @apply --paper-input-container-shared-input-style;
      }
      
      .input-content ::slotted(input),
      .input-content ::slotted(textarea),
      .input-content ::slotted(iron-autogrow-textarea),
      .input-content ::slotted(.paper-input-input) {
        @apply --paper-input-container-shared-input-style;
        @apply --paper-input-container-input;
      }

      .input-content ::slotted(input)::-webkit-outer-spin-button,
      .input-content ::slotted(input)::-webkit-inner-spin-button {
        @apply --paper-input-container-input-webkit-spinner;
      }
      
      .input-content.focused ::slotted(input),
      .input-content.focused ::slotted(textarea),
      .input-content.focused ::slotted(iron-autogrow-textarea),
      .input-content.focused ::slotted(.paper-input-input) {
        @apply --paper-input-container-input-focus;
      }

      .input-content.is-invalid ::slotted(input),
      .input-content.is-invalid ::slotted(textarea),
      .input-content.is-invalid ::slotted(iron-autogrow-textarea),
      .input-content.is-invalid ::slotted(.paper-input-input) {
        @apply --paper-input-container-input-invalid;
      }
      
      .prefix ::slotted(*) {
        display: inline-block;
        @apply --paper-font-subhead;
        @apply --layout-flex-none;
        @apply --paper-input-prefix;
      }

      .suffix ::slotted(*) {
        display: inline-block;
        @apply --paper-font-subhead;
        @apply --layout-flex-none;

        @apply --paper-input-suffix;
      }

      /* Firefox sets a min-width on the input, which can cause layout issues */
      .input-content ::slotted(input) {
        min-width: 0;
      }

      .input-content ::slotted(textarea) {
        resize: none;
      }

      .add-on-content {
        position: relative;
      }

      .add-on-content.is-invalid ::slotted(*) {
        color: var(--paper-input-container-invalid-color, var(--error-color));
      }

      .add-on-content.is-highlighted ::slotted(*) {
        color: var(--paper-input-container-focus-color, var(--primary-color));
      }
    </style>

    <div class="floated-label-placeholder" aria-hidden="true" hidden="[[noLabelFloat]]">&nbsp;</div>

    <div class="input-wrapper">
      <span class="prefix"><slot name="prefix"></slot></span>

      <div class\$="[[_computeInputContentClass(noLabelFloat,alwaysFloatLabel,focused,invalid,_inputHasContent)]]" id="labelAndInputContainer">
        <slot name="label"></slot>
        <slot name="input"></slot>
      </div>

      <span class="suffix"><slot name="suffix"></slot></span>
    </div>

    <div class\$="[[_computeUnderlineClass(focused,invalid)]]">
      <div class="unfocused-line"></div>
      <div class="focused-line"></div>
    </div>

    <div class\$="[[_computeAddOnContentClass(focused,invalid)]]">
      <slot name="add-on"></slot>
    </div>
`,
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
      value: function() {
        return this._onFocus.bind(this);
      }
    },
    _boundOnBlur: {
      type: Function,
      value: function() {
        return this._onBlur.bind(this);
      }
    },
    _boundOnInput: {
      type: Function,
      value: function() {
        return this._onInput.bind(this);
      }
    },
    _boundValueChanged: {
      type: Function,
      value: function() {
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
    return dom(this).querySelector(this._inputSelector);
  },
  get _inputElementValue() {
    return (
      this._inputElement[this._propertyForValue] || this._inputElement.value
    );
  },
  ready: function() {
    if (!this._addons) {
      this._addons = [];
    }
    this.addEventListener("focus", this._boundOnFocus, !0);
    this.addEventListener("blur", this._boundOnBlur, !0);
  },
  attached: function() {
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
  _onAddonAttached: function(event) {
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
  _onFocus: function() {
    this._setFocused(!0);
  },
  _onBlur: function() {
    this._setFocused(!1);
    this._handleValueAndAutoValidate(this._inputElement);
  },
  _onInput: function(event) {
    this._handleValueAndAutoValidate(event.target);
  },
  _onValueChanged: function(event) {
    var input = event.target;
    if (input.value === void 0) {
      return;
    }
    this._handleValueAndAutoValidate(event.target);
  },
  _handleValue: function(inputElement) {
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
  _handleValueAndAutoValidate: function(inputElement) {
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
  _onIronInputValidate: function() {
    this.invalid = this._inputElement.invalid;
  },
  _invalidChanged: function() {
    if (this._addons) {
      this.updateAddons({ invalid: this.invalid });
    }
  },
  updateAddons: function(state) {
    for (var addon, index = 0; (addon = this._addons[index]); index++) {
      addon.update(state);
    }
  },
  _computeInputContentClass: function(
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
  _computeUnderlineClass: function(focused, invalid) {
    var cls = "underline";
    if (invalid) {
      cls += " is-invalid";
    } else if (focused) {
      cls += " is-highlighted";
    }
    return cls;
  },
  _computeAddOnContentClass: function(focused, invalid) {
    var cls = "add-on-content";
    if (invalid) {
      cls += " is-invalid";
    } else if (focused) {
      cls += " is-highlighted";
    }
    return cls;
  }
});
