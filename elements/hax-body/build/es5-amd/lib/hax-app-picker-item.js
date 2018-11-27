define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/iron-icons/iron-icons.js",
  "../node_modules/@polymer/iron-icons/av-icons.js",
  "../node_modules/@polymer/iron-icons/communication-icons.js",
  "../node_modules/@polymer/iron-icons/device-icons.js",
  "../node_modules/@polymer/iron-icons/editor-icons.js",
  "../node_modules/@polymer/iron-icons/hardware-icons.js",
  "../node_modules/@polymer/iron-icons/image-icons.js",
  "../node_modules/@polymer/iron-icons/maps-icons.js",
  "../node_modules/@polymer/iron-icons/notification-icons.js",
  "../node_modules/@polymer/iron-icons/social-icons.js",
  "../node_modules/@polymer/iron-icons/places-icons.js",
  "../node_modules/@lrnwebcomponents/lrn-icons/lrn-icons.js",
  "../node_modules/@polymer/paper-dialog/paper-dialog.js",
  "../node_modules/@polymer/paper-ripple/paper-ripple.js",
  "../node_modules/@polymer/paper-toast/paper-toast.js",
  "../node_modules/@polymer/paper-button/paper-button.js",
  "../node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js",
  "../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js"
], function(
  _polymerLegacy,
  _ironIcons,
  _avIcons,
  _communicationIcons,
  _deviceIcons,
  _editorIcons,
  _hardwareIcons,
  _imageIcons,
  _mapsIcons,
  _notificationIcons,
  _socialIcons,
  _placesIcons,
  _lrnIcons,
  _paperDialog,
  _paperRipple,
  _paperToast,
  _paperButton,
  _materializecssStyles,
  _simpleColors
) {
  "use strict";
  function _templateObject_9b3eb3f0f1e611e8b3a2e3a031c18fd0() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n  <custom-style>\n    <style is="custom-style" include="materializecss-styles">\n      :host {\n        display: inline-block;\n        color: var(--hax-app-picker-dialog-text-color, #FFFFFF);\n      }\n      :host([elevation="1"]) {\n        -webkit-transform: scale(1, 1);\n        transform: scale(1, 1);\n      }\n      :host([elevation="2"]) {\n        -webkit-transform: scale(1.4, 1.4);\n        transform: scale(1.4, 1.4);\n      }\n      :host > div {\n        @apply --paper-font-caption;\n        margin-top: 8px;\n        color: #FFFFFF;\n        width: 100%;\n        white-space: nowrap;\n        overflow: hidden;\n        text-overflow: ellipsis;\n        @apply --hax-app-picker-hax-element-text;\n      }\n      .icon {\n        cursor: pointer;\n        width: 50px;\n        height: 50px;\n        padding: 4px;\n        margin: 0;\n        color: white;\n        border-radius: 50%;\n        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);\n        -webkit-transition: box-shadow .2s;\n        -moz-transition: box-shadow .2s;\n        -ms-transition: box-shadow .2s;\n        -o-transition: box-shadow .2s;\n        transition: box-shadow .2s;\n        @apply --hax-app-picker-hax-element--icon;\n      }\n      .icon:hover, .icon:focus {\n        box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.14), 0 2px 10px 0 rgba(0, 0, 0, 0.12), 0 6px 2px -4px rgba(0, 0, 0, 0.2);\n      }\n      .icon:active {\n        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);\n      }\n      paper-button {\n        display: block;\n        min-width: unset;\n      }\n      iron-icon {\n        display: block;\n        padding: 0;\n        margin: 0;\n        width: 40px;\n        height: 40px;\n      }\n      @media screen and (max-width: 550px) {\n        .icon {\n          width: 32px;\n          height: 32px;\n          padding: 4px;\n        }\n      }\n    </style>\n  </custom-style>\n  <paper-button id="button" class$="icon [[color]]" title="[[label]]">\n    <iron-icon icon="[[icon]]"></iron-icon>\n  </paper-button>\n  <div aria-hidden="true">[[label]]</div>\n'
    ]);
    _templateObject_9b3eb3f0f1e611e8b3a2e3a031c18fd0 = function _templateObject_9b3eb3f0f1e611e8b3a2e3a031c18fd0() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_9b3eb3f0f1e611e8b3a2e3a031c18fd0()
    ),
    is: "hax-app-picker-item",
    listeners: {
      mousedown: "tapEventOn",
      mouseover: "tapEventOn",
      mouseout: "tapEventOff",
      focusin: "tapEventOn",
      focusout: "tapEventOff"
    },
    behaviors: [simpleColorsBehaviors],
    properties: {
      color: { type: String },
      icon: { type: String },
      label: { type: String },
      elevation: { type: Number, value: 1, reflectToAttribute: !0 }
    },
    tapEventOn: function tapEventOn(e) {
      this.elevation = 2;
    },
    tapEventOff: function tapEventOff(e) {
      this.elevation = 1;
    }
  });
});
