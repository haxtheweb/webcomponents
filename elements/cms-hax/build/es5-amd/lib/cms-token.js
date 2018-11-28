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
    '<dom-module id="cms-token">\n    <template strip-whitespace="">\n        <style>\n            :host {\n                display: inline;\n                min-width: 112px;\n                min-height: 112px;\n                transition: .6s all ease;\n                background-color: transparent;\n            }\n\n            paper-spinner {\n                transition: .6s all ease;\n                position: absolute;\n                visibility: hidden;\n                display: none;\n                opacity: 0;\n                height: 0;\n                width: 0;\n            }\n\n            #replacementcontent {\n                transition: .6s all ease;\n                visibility: visible;\n                opacity: 1;\n                height: auto;\n                width: auto;\n            }\n\n            :host([loading]) {\n                text-align: center;\n            }\n\n            :host([loading]) paper-spinner {\n                visibility: visible;\n                opacity: 1;\n                position: relative;\n                height: 80px;\n                width: 80px;\n                padding: 16px;\n                display: flex;\n            }\n\n            :host([loading]) #replacementcontent {\n                opacity: 0;\n                visibility: hidden;\n                height: 0;\n                width: 0;\n            }\n        </style>\n        <iron-ajax id="tokenrequest" method="GET" params="[[bodyData]]" url="[[tokenEndPoint]]" handle-as="json" last-response="{{tokenData}}"></iron-ajax>\n        <paper-spinner active="[[loading]]"></paper-spinner>\n        <span id="replacementcontent">\n            <slot></slot>\n        </span>\n    </template>\n\n    \n</dom-module>';
  document.head.appendChild($_documentContainer);
  (0, _polymerLegacy.Polymer)({
    is: "cms-token",
    behaviors: [HAXBehaviors.PropertiesBehaviors],
    properties: {
      loading: { type: Boolean, reflectToAttribute: !0, value: !1 },
      token: { type: String, reflectToAttribute: !0 },
      tokenEndPoint: { type: String },
      bodyData: {
        type: Object,
        computed: "_generateBodyData(token, _clickInvoked)",
        observer: "_tokenChanged"
      },
      _clickInvoked: { type: String, value: !1 },
      tokenData: { type: String, observer: "_handleTokenResponse" },
      tokenPrefix: { type: String, value: "[" },
      tokenSuffix: { type: String, value: "]" },
      _displayMode: {
        type: String,
        value: "full",
        observer: "_displayModeChanged"
      }
    },
    _displayModeChanged: function _displayModeChanged(newValue, oldValue) {
      if (
        babelHelpers.typeof(newValue) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0)) &&
        "" != newValue &&
        babelHelpers.typeof(this.token) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0))
      ) {
        this.token = this.token.replace(oldValue, newValue);
      }
    },
    _generateBodyData: function _generateBodyData(token, $editingState) {
      if (null !== token && "" !== token) {
        var tokenPrefix = this.tokenPrefix,
          tokenSuffix = this.tokenSuffix;
        return {
          token: ""
            .concat(tokenPrefix)
            .concat(token)
            .concat(tokenSuffix),
          cachedResponse: $editingState
        };
      }
    },
    _handleTokenResponse: function _handleTokenResponse(newValue, oldValue) {
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
          document
            .getElementById("cmstokenidtolockonto")
            .addEventListener("click", this.__tokenClicked.bind(this));
        }
        this.wipeSlot((0, _polymerDom.dom)(this));
        async.microTask.run(function() {
          var template = document.createElement("template");
          template.innerHTML = newValue.content;
          (0, _polymerDom.dom)(_this).appendChild(
            document.importNode(template.content, !0)
          );
          _this.loading = !1;
        });
      }
    },
    wipeSlot: function wipeSlot(element) {
      while (null !== element.firstChild) {
        element.removeChild(element.firstChild);
      }
    },
    _tokenChanged: function _tokenChanged(newValue, oldValue) {
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
          babelHelpers.typeof(this.tokenEndPoint) ===
            ("undefined" === typeof void 0
              ? "undefined"
              : babelHelpers.typeof(void 0)) &&
          babelHelpers.typeof(window.cmstokenEndPoint) !==
            ("undefined" === typeof void 0
              ? "undefined"
              : babelHelpers.typeof(void 0))
        ) {
          this.tokenEndPoint = window.cmstokenEndPoint;
        }
        if (this.tokenEndPoint) {
          this.loading = !0;
          async.microTask.run(function() {
            _this2.$.tokenrequest.generateRequest();
          });
        }
      }
    },
    _windowVisibilityChanged: function _windowVisibilityChanged(e) {
      if (!this.loading && this._clickInvoked) {
        this.$.tokenrequest.generateRequest();
        this._clickInvoked = !1;
      }
    },
    __tokenClicked: function __tokenClicked(e) {
      this._clickInvoked = !0;
    },
    detached: function detached() {
      document.removeEventListener(
        "visibilitychange",
        this._windowVisibilityChanged.bind(this)
      );
    },
    attached: function attached() {
      var _this3 = this;
      document.addEventListener(
        "visibilitychange",
        this._windowVisibilityChanged.bind(this)
      );
      if (
        babelHelpers.typeof(this.token) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0)) &&
        null !== this.token &&
        "" !== this.token
      ) {
        var slot = (0, _polymerDom.dom)(this).getEffectiveChildNodes();
        if (0 === slot.length && !this.loading) {
          if (
            babelHelpers.typeof(this.tokenEndPoint) ===
              ("undefined" === typeof void 0
                ? "undefined"
                : babelHelpers.typeof(void 0)) &&
            babelHelpers.typeof(window.cmstokenEndPoint) !==
              ("undefined" === typeof void 0
                ? "undefined"
                : babelHelpers.typeof(void 0))
          ) {
            this.tokenEndPoint = window.cmstokenEndPoint;
          }
          if (this.tokenEndPoint) {
            this.loading = !0;
            async.microTask.run(function() {
              _this3.$.tokenrequest.generateRequest();
            });
          }
        }
      }
      var props = {
        canScale: !0,
        canPosition: !0,
        canEditSource: !1,
        gizmo: {
          title: "CMS Token",
          description: "CMS token rendered on the backend",
          icon: "icons:code",
          color: "light-blue",
          groups: ["CMS"],
          handles: [{ type: "cmstoken", token: "token" }],
          meta: { author: "LRNWebComponents" }
        },
        settings: {
          quick: [],
          configure: [
            {
              property: "token",
              title: "Token",
              description: "Token from our CMS",
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
            "token-data",
            "body-data",
            "token-end-point"
          ]
        }
      };
      this.setHaxProperties(props);
    },
    postProcessgetHaxJSONSchema: function postProcessgetHaxJSONSchema(schema) {
      var href = "",
        slot = "Edit";
      if (
        babelHelpers.typeof(this.tokenData) !==
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        href = this.tokenData.editEndpoint;
        slot = this.tokenData.editText;
        for (var i in this.tokenData.schema) {
          schema.properties[i] = this.tokenData.schema[i];
        }
      }
      schema.properties.__editThis = {
        type: "string",
        component: {
          name: "a",
          properties: {
            id: "cmstokenidtolockonto",
            href: href,
            target: "_blank"
          },
          slot: slot
        }
      };
      return schema;
    }
  });
});
