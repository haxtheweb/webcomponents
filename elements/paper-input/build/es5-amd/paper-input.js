define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@polymer/iron-form-element-behavior/iron-form-element-behavior.js",
  "@polymer/iron-input/iron-input.js",
  "./lib/paper-input-behavior.js",
  "./lib/paper-input-char-counter.js",
  "./lib/paper-input-container.js",
  "./lib/paper-input-error.js",
  "./node_modules/@polymer/polymer/lib/elements/dom-module.js",
  "./node_modules/@polymer/polymer/polymer-element.js"
], function(
  _polymerLegacy,
  _ironFormElementBehavior,
  _ironInput,
  _paperInputBehavior,
  _paperInputCharCounter,
  _paperInputContainer,
  _paperInputError,
  _domModule,
  _polymerElement
) {
  "use strict";
  var $_documentContainer = document.createElement("div");
  $_documentContainer.setAttribute("style", "display: none;");
  $_documentContainer.innerHTML =
    '<dom-module id="paper-input">\n  <template>\n    <style>\n      :host {\n        display: block;\n      }\n\n      :host([focused]) {\n        outline: none;\n      }\n\n      :host([hidden]) {\n        display: none !important;\n      }\n\n      input {\n        position: relative; /* to make a stacking context */\n        outline: none;\n        box-shadow: none;\n        padding: 0;\n        width: 100%;\n        max-width: 100%;\n        background: transparent;\n        border: none;\n        color: var(--paper-input-container-input-color, var(--primary-text-color));\n        -webkit-appearance: none;\n        text-align: inherit;\n        vertical-align: bottom;\n\n        /* Firefox sets a min-width on the input, which can cause layout issues */\n        min-width: 0;\n\n        @apply --paper-font-subhead;\n        @apply --paper-input-container-input;\n      }\n\n      input::-webkit-outer-spin-button,\n      input::-webkit-inner-spin-button {\n        @apply --paper-input-container-input-webkit-spinner;\n      }\n\n      input::-webkit-clear-button {\n        @apply --paper-input-container-input-webkit-clear;\n      }\n\n      input::-webkit-input-placeholder {\n        color: var(--paper-input-container-color, var(--secondary-text-color));\n      }\n\n      input:-moz-placeholder {\n        color: var(--paper-input-container-color, var(--secondary-text-color));\n      }\n\n      input::-moz-placeholder {\n        color: var(--paper-input-container-color, var(--secondary-text-color));\n      }\n\n      input::-ms-clear {\n        @apply --paper-input-container-ms-clear;\n      }\n\n      input:-ms-input-placeholder {\n        color: var(--paper-input-container-color, var(--secondary-text-color));\n      }\n\n      label {\n        pointer-events: none;\n      }\n    </style>\n\n    <paper-input-container id="container" no-label-float="[[noLabelFloat]]" always-float-label="[[_computeAlwaysFloatLabel(alwaysFloatLabel,placeholder)]]" auto-validate$="[[autoValidate]]" disabled$="[[disabled]]" invalid="[[invalid]]">\n\n      <slot name="prefix" slot="prefix"></slot>\n\n      <label hidden$="[[!label]]" aria-hidden="true" for="input" slot="label">[[label]]</label>\n\n      <span id="template-placeholder"></span>\n\n      <slot name="suffix" slot="suffix"></slot>\n\n      <template is="dom-if" if="[[errorMessage]]">\n        <paper-input-error aria-live="assertive" slot="add-on">[[errorMessage]]</paper-input-error>\n      </template>\n\n      <template is="dom-if" if="[[charCounter]]">\n        <paper-input-char-counter slot="add-on"></paper-input-char-counter>\n      </template>\n\n    </paper-input-container>\n  </template>\n\n  <!-- This is a fresh new hell to make this element hybrid. Basically, in 2.0\n    we lost is=, so the example same template can\'t be used with iron-input 1.0 and 2.0.\n    Expect some conditional code (especially in the tests).\n   -->\n  <template id="v0">\n    <input is="iron-input" id="input" slot="input" aria-labelledby$="[[_ariaLabelledBy]]" aria-describedby$="[[_ariaDescribedBy]]" disabled$="[[disabled]]" title$="[[title]]" bind-value="{{value}}" invalid="{{invalid}}" prevent-invalid-input="[[preventInvalidInput]]" allowed-pattern="[[allowedPattern]]" validator="[[validator]]" type$="[[type]]" pattern$="[[pattern]]" required$="[[required]]" autocomplete$="[[autocomplete]]" autofocus$="[[autofocus]]" inputmode$="[[inputmode]]" minlength$="[[minlength]]" maxlength$="[[maxlength]]" min$="[[min]]" max$="[[max]]" step$="[[step]]" name$="[[name]]" placeholder$="[[placeholder]]" readonly$="[[readonly]]" list$="[[list]]" size$="[[size]]" autocapitalize$="[[autocapitalize]]" autocorrect$="[[autocorrect]]" on-change="_onChange" tabindex$="[[tabIndex]]" autosave$="[[autosave]]" results$="[[results]]" accept$="[[accept]]" multiple$="[[multiple]]">\n  </template>\n\n  <template id="v1">\n    <!-- Need to bind maxlength so that the paper-input-char-counter works correctly -->\n    <iron-input bind-value="{{value}}" id="input" slot="input" maxlength$="[[maxlength]]" allowed-pattern="[[allowedPattern]]" invalid="{{invalid}}" validator="[[validator]]">\n      <input id="nativeInput" aria-labelledby$="[[_ariaLabelledBy]]" aria-describedby$="[[_ariaDescribedBy]]" disabled$="[[disabled]]" title$="[[title]]" type$="[[type]]" pattern$="[[pattern]]" required$="[[required]]" autocomplete$="[[autocomplete]]" autofocus$="[[autofocus]]" inputmode$="[[inputmode]]" minlength$="[[minlength]]" maxlength$="[[maxlength]]" min$="[[min]]" max$="[[max]]" step$="[[step]]" name$="[[name]]" placeholder$="[[placeholder]]" readonly$="[[readonly]]" list$="[[list]]" size$="[[size]]" autocapitalize$="[[autocapitalize]]" autocorrect$="[[autocorrect]]" on-change="_onChange" tabindex$="[[tabIndex]]" autosave$="[[autosave]]" results$="[[results]]" accept$="[[accept]]" multiple$="[[multiple]]">\n    </iron-input>\n  </template>\n\n</dom-module>';
  document.head.appendChild($_documentContainer);
  (0, _polymerLegacy.Polymer)({
    is: "paper-input",
    behaviors: [
      _paperInputBehavior.PaperInputBehavior,
      _ironFormElementBehavior.IronFormElementBehavior
    ],
    beforeRegister: function beforeRegister() {
      var ironInput = document.createElement("iron-input"),
        version =
          "function" == typeof ironInput._initSlottedInput ? "v1" : "v0",
        template = _domModule.DomModule.import("paper-input", "template"),
        inputTemplate = _domModule.DomModule.import(
          "paper-input",
          "template#" + version
        ),
        inputPlaceholder = template.content.querySelector(
          "#template-placeholder"
        );
      if (inputPlaceholder) {
        inputPlaceholder.parentNode.replaceChild(
          inputTemplate.content,
          inputPlaceholder
        );
      }
    },
    get _focusableElement() {
      return _polymerElement.Element
        ? this.inputElement._inputElement
        : this.inputElement;
    },
    listeners: { "iron-input-ready": "_onIronInputReady" },
    _onIronInputReady: function _onIronInputReady() {
      if (
        this.inputElement &&
        -1 !== this._typesThatHaveText.indexOf(this.$.nativeInput.type)
      ) {
        this.alwaysFloatLabel = !0;
      }
      if (!!this.inputElement.bindValue) {
        this.$.container._handleValueAndAutoValidate(this.inputElement);
      }
    }
  });
});
