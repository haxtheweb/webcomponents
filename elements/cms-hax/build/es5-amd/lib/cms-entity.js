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
    '<dom-module id="cms-entity">\n  <template strip-whitespace="">\n    <style>\n      :host {\n        display: block;\n        min-width: 112px;\n        min-height: 112px;\n        transition: .6s all ease;\n        background-color: transparent;\n      }\n      paper-spinner {\n        visibility: hidden;\n        opacity: 0;\n        height: 80px;\n        width: 80px;\n        padding: 16px;\n      }\n      #replacementcontent {\n        visibility: visible;\n        opacity: 1;\n      }\n      :host([loading]) {\n        text-align: center;\n      }\n      :host([loading]) paper-spinner {\n        visibility: visible;\n        opacity: 1;\n      }\n      :host([loading]) #replacementcontent {\n        opacity: 0;\n        visibility: hidden;\n      }\n    </style>\n    <iron-ajax id="entityrequest" method="GET" params="[[bodyData]]" url="[[entityEndPoint]]" handle-as="json" last-response="{{entityData}}"></iron-ajax>\n    <paper-spinner active="[[loading]]"></paper-spinner>\n    <span id="replacementcontent"><slot></slot></span>\n  </template>\n\n  \n</dom-module>';
  document.head.appendChild($_documentContainer);
  (0, _polymerLegacy.Polymer)({
    is: "cms-entity",
    behaviors: [HAXBehaviors.PropertiesBehaviors],
    properties: {
      loading: { type: Boolean, reflectToAttribute: !0, value: !1 },
      entityType: { type: String, reflectToAttribute: !0 },
      entityId: { type: String, reflectToAttribute: !0 },
      entityDisplayMode: { type: String, reflectToAttribute: !0 },
      entityEndPoint: { type: String },
      bodyData: {
        type: Object,
        computed: "_generateBodyData(entityType, entityId, entityDisplayMode)",
        observer: "_entityChanged"
      },
      entityData: { type: String, observer: "_handleEntityResponse" },
      entityPrefix: { type: String, observer: "[" },
      entitySuffix: { type: String, observer: "]" }
    },
    _generateBodyData: function _generateBodyData(
      entityType,
      entityId,
      entityDisplayMode
    ) {
      if (
        null !== entityType &&
        "" !== entityType &&
        null !== entityId &&
        "" !== entityId
      ) {
        return {
          type: "".concat(entityType),
          id: "".concat(entityId),
          display_mode: "".concat(entityDisplayMode)
        };
      }
    },
    _handleEntityResponse: function _handleEntityResponse(newValue, oldValue) {
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
    _entityChanged: function _entityChanged(newValue, oldValue) {
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
          babelHelpers.typeof(this.entityEndPoint) ===
            ("undefined" === typeof void 0
              ? "undefined"
              : babelHelpers.typeof(void 0)) &&
          babelHelpers.typeof(window.cmsentityEndPoint) !==
            ("undefined" === typeof void 0
              ? "undefined"
              : babelHelpers.typeof(void 0))
        ) {
          this.entityEndPoint = window.cmsentityEndPoint;
        }
        if (this.entityEndPoint) {
          this.loading = !0;
          async.microTask.run(function() {
            _this2.$.entityrequest.generateRequest();
          });
        }
      }
    },
    attached: function attached() {
      var _this3 = this;
      if (
        babelHelpers.typeof(this.entity) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0)) &&
        null !== this.entity &&
        "" !== this.entity
      ) {
        var slot = (0, _polymerDom.dom)(this).getEffectiveChildNodes();
        if (0 === slot.length && !this.loading) {
          if (
            babelHelpers.typeof(this.entityEndPoint) ===
              ("undefined" === typeof void 0
                ? "undefined"
                : babelHelpers.typeof(void 0)) &&
            babelHelpers.typeof(window.cmsentityEndPoint) !==
              ("undefined" === typeof void 0
                ? "undefined"
                : babelHelpers.typeof(void 0))
          ) {
            this.entityEndPoint = window.cmsentityEndPoint;
          }
          if (this.entityEndPoint) {
            this.loading = !0;
            async.microTask.run(function() {
              _this3.$.entityrequest.generateRequest();
            });
          }
        }
      }
      var props = {
        canScale: !0,
        canPosition: !0,
        canEditSource: !1,
        gizmo: {
          title: "CMS Entity",
          description: "CMS entity rendered on the backend",
          icon: "places:spa",
          color: "light-blue",
          groups: ["CMS"],
          handles: [{ type: "cmsentity", entity: "entity" }],
          meta: { author: "LRNWebComponents" }
        },
        settings: {
          quick: [],
          configure: [
            {
              property: "entityType",
              title: "Type",
              description: "type from our CMS",
              inputMethod: "select",
              options: { node: "Node", user: "User", file: "File" },
              icon: "editor:title"
            },
            {
              property: "entityID",
              title: "ID",
              description: "id from our CMS",
              inputMethod: "textfield",
              icon: "editor:title"
            },
            {
              property: "entityDisplayMode",
              title: "Display mode",
              description: "display mode from our CMS",
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
            "entity-data",
            "body-data",
            "entity-end-point"
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
          slot: "Edit this content"
        }
      };
      return schema;
    }
  });
});
