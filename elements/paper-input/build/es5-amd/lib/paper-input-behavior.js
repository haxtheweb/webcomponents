define([
  "exports",
  "../node_modules/@polymer/iron-a11y-keys-behavior/iron-a11y-keys-behavior.js",
  "../node_modules/@polymer/iron-behaviors/iron-control-state.js",
  "../node_modules/@polymer/polymer/polymer-element.js",
  "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js",
  "../node_modules/@polymer/polymer/lib/utils/async.js"
], function(
  _exports,
  _ironA11yKeysBehavior,
  _ironControlState,
  _polymerElement,
  _polymerDom,
  async
) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.PaperInputBehavior = _exports.PaperInputBehaviorImpl = _exports.PaperInputHelper = void 0;
  async = babelHelpers.interopRequireWildcard(async);
  var PaperInputHelper = {};
  _exports.PaperInputHelper = PaperInputHelper;
  PaperInputHelper.NextLabelID = 1;
  PaperInputHelper.NextAddonID = 1;
  var PaperInputBehaviorImpl = {
    properties: {
      label: { type: String },
      value: { notify: !0, type: String },
      disabled: { type: Boolean, value: !1 },
      invalid: { type: Boolean, value: !1, notify: !0 },
      allowedPattern: { type: String },
      type: { type: String },
      list: { type: String },
      pattern: { type: String },
      required: { type: Boolean, value: !1 },
      errorMessage: { type: String },
      charCounter: { type: Boolean, value: !1 },
      noLabelFloat: { type: Boolean, value: !1 },
      alwaysFloatLabel: { type: Boolean, value: !1 },
      autoValidate: { type: Boolean, value: !1 },
      validator: { type: String },
      autocomplete: { type: String, value: "off" },
      autofocus: { type: Boolean, observer: "_autofocusChanged" },
      inputmode: { type: String },
      minlength: { type: Number },
      maxlength: { type: Number },
      min: { type: String },
      max: { type: String },
      step: { type: String },
      name: { type: String },
      placeholder: { type: String, value: "" },
      readonly: { type: Boolean, value: !1 },
      size: { type: Number },
      autocapitalize: { type: String, value: "none" },
      autocorrect: { type: String, value: "off" },
      autosave: { type: String },
      results: { type: Number },
      accept: { type: String },
      multiple: { type: Boolean },
      _ariaDescribedBy: { type: String, value: "" },
      _ariaLabelledBy: { type: String, value: "" }
    },
    listeners: { "addon-attached": "_onAddonAttached" },
    keyBindings: { "shift+tab:keydown": "_onShiftTabDown" },
    hostAttributes: { tabindex: 0 },
    get inputElement() {
      return this.$.input;
    },
    get _focusableElement() {
      return this.inputElement;
    },
    created: function created() {
      this._typesThatHaveText = [
        "date",
        "datetime",
        "datetime-local",
        "month",
        "time",
        "week",
        "file"
      ];
    },
    attached: function attached() {
      this._updateAriaLabelledBy();
      if (
        !_polymerElement.Element &&
        this.inputElement &&
        -1 !== this._typesThatHaveText.indexOf(this.inputElement.type)
      ) {
        this.alwaysFloatLabel = !0;
      }
    },
    _appendStringWithSpace: function _appendStringWithSpace(str, more) {
      if (str) {
        str = str + " " + more;
      } else {
        str = more;
      }
      return str;
    },
    _onAddonAttached: function _onAddonAttached(event) {
      var target = (0, _polymerDom.dom)(event).rootTarget;
      if (target.id) {
        this._ariaDescribedBy = this._appendStringWithSpace(
          this._ariaDescribedBy,
          target.id
        );
      } else {
        var id = "paper-input-add-on-" + PaperInputHelper.NextAddonID++;
        target.id = id;
        this._ariaDescribedBy = this._appendStringWithSpace(
          this._ariaDescribedBy,
          id
        );
      }
    },
    validate: function validate() {
      return this.inputElement.validate();
    },
    _focusBlurHandler: function _focusBlurHandler(event) {
      _ironControlState.IronControlState._focusBlurHandler.call(this, event);
      if (this.focused && !this._shiftTabPressed && this._focusableElement) {
        this._focusableElement.focus();
      }
    },
    _onShiftTabDown: function _onShiftTabDown() {
      var _this = this,
        oldTabIndex = this.getAttribute("tabindex");
      this._shiftTabPressed = !0;
      this.setAttribute("tabindex", "-1");
      async.microTask.run(function() {
        _this.setAttribute("tabindex", oldTabIndex);
        _this._shiftTabPressed = !1;
      });
    },
    _handleAutoValidate: function _handleAutoValidate() {
      if (this.autoValidate) this.validate();
    },
    updateValueAndPreserveCaret: function updateValueAndPreserveCaret(
      newValue
    ) {
      try {
        var start = this.inputElement.selectionStart;
        this.value = newValue;
        this.inputElement.selectionStart = start;
        this.inputElement.selectionEnd = start;
      } catch (e) {
        this.value = newValue;
      }
    },
    _computeAlwaysFloatLabel: function _computeAlwaysFloatLabel(
      alwaysFloatLabel,
      placeholder
    ) {
      return placeholder || alwaysFloatLabel;
    },
    _updateAriaLabelledBy: function _updateAriaLabelledBy() {
      var label = (0, _polymerDom.dom)(this.root).querySelector("label");
      if (!label) {
        this._ariaLabelledBy = "";
        return;
      }
      var labelledBy;
      if (label.id) {
        labelledBy = label.id;
      } else {
        labelledBy = "paper-input-label-" + PaperInputHelper.NextLabelID++;
        label.id = labelledBy;
      }
      this._ariaLabelledBy = labelledBy;
    },
    _onChange: function _onChange(event) {
      if (this.shadowRoot) {
        this.fire(
          event.type,
          { sourceEvent: event },
          { node: this, bubbles: event.bubbles, cancelable: event.cancelable }
        );
      }
    },
    _autofocusChanged: function _autofocusChanged() {
      if (this.autofocus && this._focusableElement) {
        var activeElement = document.activeElement,
          isActiveElementValid = babelHelpers.instanceof(
            activeElement,
            HTMLElement
          ),
          isSomeElementActive =
            isActiveElementValid &&
            activeElement !== document.body &&
            activeElement !== document.documentElement;
        if (!isSomeElementActive) {
          this._focusableElement.focus();
        }
      }
    }
  };
  _exports.PaperInputBehaviorImpl = PaperInputBehaviorImpl;
  var PaperInputBehavior = [
    _ironControlState.IronControlState,
    _ironA11yKeysBehavior.IronA11yKeysBehavior,
    PaperInputBehaviorImpl
  ];
  _exports.PaperInputBehavior = PaperInputBehavior;
});
