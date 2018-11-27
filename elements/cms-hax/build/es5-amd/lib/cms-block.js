define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js",
  "../node_modules/@polymer/polymer/lib/utils/async.js",
  "../node_modules/@polymer/iron-ajax/iron-ajax.js",
  "../node_modules/@polymer/paper-spinner/paper-spinner.js",
  "../node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(
  _polymerLegacy,
  _polymerDom,
  async,
  _ironAjax,
  _paperSpinner,
  _HAXWiring
) {
  "use strict";
  async = babelHelpers.interopRequireWildcard(async);
  var $_documentContainer = document.createElement("div");
  $_documentContainer.setAttribute("style", "display: none;");
  $_documentContainer.innerHTML =
    '<dom-module id="cms-block">\n  <template strip-whitespace="">\n    <style>\n      :host {\n        display: block;\n        min-width: 112px;\n        min-height: 112px;\n        transition: .6s all ease;\n        background-color: transparent;\n      }\n      paper-spinner {\n        visibility: hidden;\n        opacity: 0;\n        height: 80px;\n        width: 80px;\n        padding: 16px;\n      }\n      #replacementcontent {\n        visibility: visible;\n        opacity: 1;\n      }\n      :host([loading]) {\n        text-align: center;\n      }\n      :host([loading]) paper-spinner {\n        visibility: visible;\n        opacity: 1;\n      }\n      :host([loading]) #replacementcontent {\n        opacity: 0;\n        visibility: hidden;\n      }\n    </style>\n    <iron-ajax id="blockrequest" method="GET" params="[[bodyData]]" url="[[blockEndPoint]]" handle-as="json" last-response="{{blockData}}"></iron-ajax>\n    <paper-spinner active="[[loading]]"></paper-spinner>\n    <span id="replacementcontent"><slot></slot></span>\n  </template>\n\n  \n</dom-module>';
  document.head.appendChild($_documentContainer);
  (0, _polymerLegacy.Polymer)({
    is: "cms-block",
    behaviors: [HAXBehaviors.PropertiesBehaviors],
    properties: {
      loading: { type: Boolean, reflectToAttribute: !0, value: !1 },
      blockModule: { type: String, reflectToAttribute: !0 },
      blockDelta: { type: String, reflectToAttribute: !0 },
      blockEndPoint: { type: String },
      bodyData: {
        type: Object,
        computed: "_generateBodyData(blockModule, blockDelta)",
        observer: "_blockChanged"
      },
      blockData: { type: String, observer: "_handleblockResponse" },
      blockPrefix: { type: String, observer: "[" },
      blockSuffix: { type: String, observer: "]" }
    },
    _generateBodyData: function _generateBodyData(blockModule, blockDelta) {
      if (
        null !== blockModule &&
        "" !== blockModule &&
        null !== blockDelta &&
        "" !== blockDelta
      ) {
        return { module: "".concat(blockModule), delta: "".concat(blockDelta) };
      }
    },
    _handleblockResponse: function _handleblockResponse(newValue, oldValue) {
      var _this = this;
      if (
        null !== newValue &&
        babelHelpers.typeof(newValue.content) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0))
      ) {
        if (null != document.getElementById("cmstokenidtolockonto")) {
          document
            .getElementById("cmstokenidtolockonto")
            .setAttribute("href", newValue.editEndpoint);
          document.getElementById("cmstokenidtolockonto").innerHTML =
            newValue.editText;
        }
        this.wipeSlot((0, _polymerDom.dom)(this));
        async.microTask.run(function() {
          var frag = document.createElement("span");
          frag.innerHTML = newValue.content;
          var newNode = frag.cloneNode(!0);
          (0, _polymerDom.dom)(_this).appendChild(newNode);
          setTimeout(function() {
            _this.loading = !1;
          }, 600);
        });
      }
    },
    wipeSlot: function wipeSlot(element) {
      while (null !== element.firstChild) {
        element.removeChild(element.firstChild);
      }
    },
    _blockChanged: function _blockChanged(newValue, oldValue) {
      var _this2 = this;
      if (
        babelHelpers.typeof(newValue) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0)) &&
        "" !== newValue &&
        !this.loading
      ) {
        if (
          babelHelpers.typeof(this.blockEndPoint) ===
            ("undefined" === typeof void 0
              ? "undefined"
              : babelHelpers.typeof(void 0)) &&
          babelHelpers.typeof(window.cmsblockEndPoint) !==
            ("undefined" === typeof void 0
              ? "undefined"
              : babelHelpers.typeof(void 0))
        ) {
          this.blockEndPoint = window.cmsblockEndPoint;
        }
        if (this.blockEndPoint) {
          this.loading = !0;
          async.microTask.run(function() {
            _this2.$.blockrequest.generateRequest();
          });
        }
      }
    },
    attached: function attached() {
      var _this3 = this;
      if (
        babelHelpers.typeof(this.blockModule) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0)) &&
        null !== this.blockModule &&
        "" !== this.blockModule
      ) {
        var slot = (0, _polymerDom.dom)(this).getEffectiveChildNodes();
        if (0 === slot.length && !this.loading) {
          if (
            babelHelpers.typeof(this.blockEndPoint) ===
              ("undefined" === typeof void 0
                ? "undefined"
                : babelHelpers.typeof(void 0)) &&
            babelHelpers.typeof(window.cmsblockEndPoint) !==
              ("undefined" === typeof void 0
                ? "undefined"
                : babelHelpers.typeof(void 0))
          ) {
            this.blockEndPoint = window.cmsblockEndPoint;
          }
          if (this.blockEndPoint) {
            this.loading = !0;
            async.microTask.run(function() {
              _this3.$.blockrequest.generateRequest();
            });
          }
        }
      }
      var props = {
        canScale: !0,
        canPosition: !0,
        canEditSource: !1,
        gizmo: {
          title: "CMS Block",
          description: "CMS block rendered on the backend",
          icon: "image:crop-square",
          color: "light-blue",
          groups: ["CMS"],
          handles: [{ type: "cmsblock", block: "block" }],
          meta: { author: "LRNWebComponents" }
        },
        settings: {
          quick: [],
          configure: [
            {
              property: "blockModule",
              title: "Module",
              description: "Module to load from our CMS",
              inputMethod: "textfield",
              icon: "editor:title"
            },
            {
              property: "blockDelta",
              title: "Delta",
              description: "Delta of the block to load from our CMS",
              inputMethod: "textfield",
              icon: "editor:title"
            }
          ],
          advanced: []
        },
        saveOptions: {
          wipeSlot: !0,
          unsetAttributes: [
            "loading",
            "block-data",
            "body-data",
            "block-end-point"
          ]
        }
      };
      this.setHaxProperties(props);
    },
    postProcessgetHaxJSONSchema: function postProcessgetHaxJSONSchema(schema) {
      schema.properties.__editThis = {
        type: "string",
        component: {
          name: "a",
          properties: {
            id: "cmstokenidtolockonto",
            href: "",
            target: "_blank"
          },
          slot: "Edit this block"
        }
      };
      return schema;
    }
  });
});
