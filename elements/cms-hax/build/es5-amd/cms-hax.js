define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js",
  "./node_modules/@polymer/polymer/lib/utils/flattened-nodes-observer.js",
  "./node_modules/@polymer/iron-ajax/iron-ajax.js",
  "./node_modules/@polymer/paper-toast/paper-toast.js",
  "./node_modules/@lrnwebcomponents/hax-body/lib/hax-store.js",
  "./node_modules/@lrnwebcomponents/hax-body/hax-body.js",
  "./node_modules/@lrnwebcomponents/hax-body/lib/hax-autoloader.js",
  "./node_modules/@lrnwebcomponents/hax-body/lib/hax-manager.js",
  "./node_modules/@lrnwebcomponents/hax-body/lib/hax-panel.js",
  "./node_modules/@lrnwebcomponents/hax-body/lib/hax-app-picker.js",
  "./node_modules/@lrnwebcomponents/hax-body/lib/hax-export-dialog.js",
  "./lib/cms-token.js",
  "./lib/cms-block.js",
  "./lib/cms-views.js",
  "./lib/cms-entity.js"
], function(_polymerLegacy, _polymerDom, _flattenedNodesObserver) {
  "use strict";
  function _templateObject_6ef65460ecf511e88fb621c4c50d4891() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: block;\n        font-size: 16px;\n        box-sizing: content-box;\n      }\n    </style>\n    <iron-ajax id="pageupdateajax" url="[[endPoint]]" method="[[method]]" body="[[updatePageData]]" content-type="application/json" handle-as="json" on-response="_handleUpdateResponse"></iron-ajax>\n    <paper-toast id="toast" horizontal-align="left"></paper-toast>\n    <hax-store hidden="" app-store="[[appStoreConnection]]" valid-tag-list="[[allowedTags]]"></hax-store>\n    <hax-autoloader id="loader" hidden=""></hax-autoloader>\n    <hax-panel id="panel" hide-export-button="{{hideExportButton}}" hide-panel-ops="[[hidePanelOps]]" hide-preferences-button="[[hidePreferencesButton]]" align="[[align]]"></hax-panel>\n    <hax-body id="body" context-offset-left="[[bodyOffsetLeft]]"></hax-body>\n    <hax-manager></hax-manager>\n    <hax-app-picker></hax-app-picker>\n    <hax-export-dialog></hax-export-dialog>\n    <cms-token></cms-token>\n    <cms-views></cms-views>\n    <cms-block></cms-block>\n    <cms-entity></cms-entity>\n'
    ]);
    _templateObject_6ef65460ecf511e88fb621c4c50d4891 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_6ef65460ecf511e88fb621c4c50d4891()
    ),
    is: "cms-hax",
    properties: {
      openDefault: { type: Boolean, value: !1 },
      hideExportButton: { type: Boolean, value: !0 },
      hidePanelOps: { type: Boolean, value: !1 },
      hidePreferencesButton: { type: Boolean, value: !1 },
      align: { type: String, value: "right" },
      allowedTags: { type: Array },
      endPoint: { type: String },
      method: { type: String, value: "PUT" },
      updatePageData: { type: String },
      appStoreConnection: { type: Object },
      bodyOffsetLeft: { type: Number, value: -164 },
      editMode: { type: Boolean, reflectToAttribute: !0 },
      syncBody: { type: Boolean, value: !1 },
      bodyValue: { type: String, value: "" },
      hideMessage: { type: Boolean, value: !1 },
      redirectLocation: { type: String },
      redirectOnSave: {
        type: Boolean,
        computed: "_computeRedirectOnSave(redirectLocation)"
      },
      activeHaxBody: { type: Object, observer: "_activeHaxBodyUpdated" },
      __imported: { type: Boolean, value: !1 }
    },
    _activeHaxBodyUpdated: function _activeHaxBodyUpdated(newValue) {
      if (null != newValue && !this.__imported) {
        this.__imported = !0;
        var children = this.queryEffectiveChildren("template");
        if (babelHelpers.typeof(children) !== "undefined") {
          newValue.importContent(children.innerHTML);
        }
      }
    },
    _computeRedirectOnSave: function _computeRedirectOnSave(redirectLocation) {
      if (babelHelpers.typeof(redirectLocation) !== "undefined") {
        return !0;
      }
      return !1;
    },
    created: function created() {
      document.body.addEventListener(
        "hax-store-property-updated",
        this._haxStorePropertyUpdated.bind(this)
      );
    },
    attached: function attached() {
      var _this = this;
      this.__lock = !1;
      document.body.addEventListener("hax-save", this._saveFired.bind(this));
      if (this.openDefault) {
        window.HaxStore.write("editMode", !0, this);
      }
      if (this.syncBody) {
        (0, _flattenedNodesObserver.FlattenedNodesObserver)(
          this.$.body,
          function() {
            if (!_this.__lock) {
              _this.__lock = !0;
              _this.fire(
                "hax-body-content-changed",
                window.HaxStore.instance.activeHaxBody.haxToContent()
              );
              setTimeout(function() {
                _this.__lock = !1;
              }, 100);
            }
          }
        );
      }
    },
    _haxStorePropertyUpdated: function _haxStorePropertyUpdated(e) {
      if (
        e.detail &&
        babelHelpers.typeof(e.detail.value) !== "undefined" &&
        e.detail.property
      ) {
        if ("object" === babelHelpers.typeof(e.detail.value)) {
          this.set(e.detail.property, null);
        }
        this.set(e.detail.property, e.detail.value);
      }
    },
    _saveFired: function _saveFired() {
      this.updatePageData = window.HaxStore.instance.activeHaxBody.haxToContent();
      this.$.pageupdateajax.generateRequest();
    },
    _handleUpdateResponse: function _handleUpdateResponse() {
      var _this2 = this;
      if (!this.hideMessage) {
        this.$.toast.show("Saved!");
        if (this.redirectOnSave) {
          setTimeout(function() {
            _this2.$.panel.toggle();
            window.location = _this2.redirectLocation;
          }, 1e3);
        }
      }
    }
  });
});
