import { IronA11yKeysBehavior } from "../node_modules/@polymer/iron-a11y-keys-behavior/iron-a11y-keys-behavior.js";
import { IronControlState } from "../node_modules/@polymer/iron-behaviors/iron-control-state.js";
import { Element } from "../node_modules/@polymer/polymer/polymer-element.js";
import { dom } from "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
import * as async from "../node_modules/@polymer/polymer/lib/utils/async.js";
export const PaperInputHelper = {};
PaperInputHelper.NextLabelID = 1;
PaperInputHelper.NextAddonID = 1;
export const PaperInputBehaviorImpl = {
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
  created: function() {
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
  attached: function() {
    this._updateAriaLabelledBy();
    if (
      !Element &&
      this.inputElement &&
      -1 !== this._typesThatHaveText.indexOf(this.inputElement.type)
    ) {
      this.alwaysFloatLabel = !0;
    }
  },
  _appendStringWithSpace: function(str, more) {
    if (str) {
      str = str + " " + more;
    } else {
      str = more;
    }
    return str;
  },
  _onAddonAttached: function(event) {
    var target = dom(event).rootTarget;
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
  validate: function() {
    return this.inputElement.validate();
  },
  _focusBlurHandler: function(event) {
    IronControlState._focusBlurHandler.call(this, event);
    if (this.focused && !this._shiftTabPressed && this._focusableElement) {
      this._focusableElement.focus();
    }
  },
  _onShiftTabDown: function() {
    var oldTabIndex = this.getAttribute("tabindex");
    this._shiftTabPressed = !0;
    this.setAttribute("tabindex", "-1");
    async.microTask.run(() => {
      this.setAttribute("tabindex", oldTabIndex);
      this._shiftTabPressed = !1;
    });
  },
  _handleAutoValidate: function() {
    if (this.autoValidate) this.validate();
  },
  updateValueAndPreserveCaret: function(newValue) {
    try {
      var start = this.inputElement.selectionStart;
      this.value = newValue;
      this.inputElement.selectionStart = start;
      this.inputElement.selectionEnd = start;
    } catch (e) {
      this.value = newValue;
    }
  },
  _computeAlwaysFloatLabel: function(alwaysFloatLabel, placeholder) {
    return placeholder || alwaysFloatLabel;
  },
  _updateAriaLabelledBy: function() {
    var label = dom(this.root).querySelector("label");
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
  _onChange: function(event) {
    if (this.shadowRoot) {
      this.fire(
        event.type,
        { sourceEvent: event },
        { node: this, bubbles: event.bubbles, cancelable: event.cancelable }
      );
    }
  },
  _autofocusChanged: function() {
    if (this.autofocus && this._focusableElement) {
      var activeElement = document.activeElement,
        isActiveElementValid = activeElement instanceof HTMLElement,
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
export const PaperInputBehavior = [
  IronControlState,
  IronA11yKeysBehavior,
  PaperInputBehaviorImpl
];
