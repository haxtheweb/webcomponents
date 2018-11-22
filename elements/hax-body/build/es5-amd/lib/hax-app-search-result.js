define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/iron-image/iron-image.js",
  "../node_modules/@polymer/paper-button/paper-button.js",
  "../node_modules/@polymer/paper-styles/paper-styles.js",
  "../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_b0471080ee0311e8bb61cd2eef6a9bf2() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: inline-flex;\n        width: 50%;\n        background-color: transparent;\n        color: #ffffff;\n      }\n      paper-button.button {\n        margin: 0;\n        padding: 7px;\n        height: 168px;\n        border-radius: 0;\n        width: 100%;\n        border: 2px solid #CCCCCC;\n        justify-content: flex-start;\n        background-color: transparent;\n        background-image: none;\n        color: #ffffff;\n        text-align: unset;\n        display: flex;\n      }\n      paper-button:hover,\n      paper-button:focus,\n      paper-button:active {\n        border: 2px solid var(--simple-colors-light-green-background1);\n        background-color:rgba(0, 0, 0, .7);\n      }\n      .detail-wrapper {\n        padding: 0 8px;\n        display: inline-block;\n        height: 100%;\n        width: calc(80% - 16px);\n        overflow: hidden;\n        font-family: Verdana, Geneva, Tahoma, sans-serif;\n      }\n      .title {\n        font-size: 16px;\n        font-weight: bold;\n        text-transform: none;\n        padding-bottom: 4px;\n      }\n      .details {\n        height: 100px;\n        overflow: hidden;\n        font-size: 12px;\n        line-height: 16px;\n        padding: 0;\n        margin: 0;\n        text-transform: none;\n      }\n      .image {\n        display: inline-flex;\n        height: 152px;\n        width: 20%;\n        background-color: lightgray;\n      }\n      @media screen and (max-width: 1000px) {\n        :host {\n          width: 100%;\n        }\n        .title {\n          font-size: 12px;\n        }\n        .image {\n          min-width: 160px;\n          width: 160px;\n        }\n        .details {\n          font-size: 10px;\n        }\n      }\n      @media screen and (max-width: 600px) {\n        .details {\n          font-size: 8px;\n        }\n      }\n    </style>\n\n    <paper-button on-tap="_itemSelected" class="button">\n      <iron-image alt="" class="image" src="[[resultData.image]]" preload="" fade="" sizing="cover"></iron-image>\n      <div class="detail-wrapper">\n        <div class="title">[[resultData.title]]</div>\n        <div class="details">[[resultData.details]]</div>\n      </div>\n    </paper-button>\n'
    ]);
    _templateObject_b0471080ee0311e8bb61cd2eef6a9bf2 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_b0471080ee0311e8bb61cd2eef6a9bf2()
    ),
    is: "hax-app-search-result",
    behaviors: [simpleColorsBehaviors],
    properties: { resultData: { type: Object } },
    _itemSelected: function _itemSelected() {
      var map = this.resultData.map,
        gizmoType = this.resultData.type;
      if (
        (null === gizmoType || "" === gizmoType) &&
        babelHelpers.typeof(map.source) !== "undefined"
      ) {
        gizmoType = window.HaxStore.guessGizmoType(map.source);
      }
      var haxElements = window.HaxStore.guessGizmo(gizmoType, map);
      if (0 < haxElements.length) {
        if (1 === haxElements.length) {
          if (babelHelpers.typeof(haxElements[0].tag) !== "undefined") {
            window.HaxStore.write("activeHaxElement", haxElements[0], this);
          }
        } else {
          window.HaxStore.instance.haxAppPicker.presentOptions(
            haxElements,
            gizmoType,
            "How would you like to display this " + gizmoType + "?",
            "gizmo"
          );
        }
      } else {
        window.HaxStore.toast(
          "Sorry, I don't know how to handle that link yet."
        );
      }
    }
  });
});
