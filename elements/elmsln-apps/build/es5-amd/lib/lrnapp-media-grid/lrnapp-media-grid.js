define([
  "../../node_modules/@polymer/polymer/polymer-legacy.js",
  "../../node_modules/@polymer/iron-ajax/iron-ajax.js",
  "../../node_modules/@polymer/iron-scroll-threshold/iron-scroll-threshold.js",
  "../../node_modules/@polymer/iron-list/iron-list.js",
  "../../node_modules/@polymer/paper-button/paper-button.js",
  "../../node_modules/@polymer/iron-image/iron-image.js",
  "../../node_modules/@polymer/paper-dialog/paper-dialog.js",
  "../../node_modules/@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js",
  "../../node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js"
], function(
  _polymerLegacy,
  _ironAjax,
  _ironScrollThreshold,
  _ironList,
  _paperButton,
  _ironImage,
  _paperDialog,
  _paperDialogScrollable,
  _materializecssStyles
) {
  "use strict";
  function _templateObject_5093f590f76d11e89310d7f0fbc64afe() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style include="materializecss-styles">\n      :host {\n        display: block;\n      }\n      paper-button {\n        padding: 0;\n        margin: 0;\n        min-width: 1rem;\n      }\n      #details {\n        opacity: 0.5;\n        position: absolute;\n        bottom: 0;\n        right: 0;\n        margin: 0 1rem 0 0;\n        background-color: white;\n        padding: 0.5em;\n      }\n      #details:hover {\n        opacity: 1;\n      }\n      #details span {\n        font-size: 0.6em;\n        font-weight: normal;\n      }\n      #details .comment-on-work {\n        font-size: 0.8em;\n        background-color: white;\n      }\n    </style>\n    <iron-ajax\n      id="ajax"\n      url="[[sourcePath]]"\n      params=""\n      handle-as="json"\n      last-response="{{images}}"\n    ></iron-ajax>\n    <iron-scroll-threshold on-lower-threshold="_loadMoreData" id="threshold">\n      <iron-list grid items="[[_toArray(images.data)]]" as="image">\n        <template>\n          <paper-button>\n            <iron-image\n              preload=""\n              title="{{image.filename}}"\n              alt="{{image.alt}}"\n              src="{{image.src}}"\n              height="{{image.height}}"\n              width="{{image.width}}"\n            ></iron-image>\n          </paper-button>\n        </template>\n      </iron-list>\n    </iron-scroll-threshold>\n    <paper-dialog\n      id="dialog"\n      entry-animation="scale-up-animation"\n      exit-animation="fade-out-animation"\n    >\n      <paper-dialog-scrollable id="dialogResponse">\n        <iron-image src$="[[activeImage]]"></iron-image>\n        <div id="details">\n          <div class="title">\n            <span>Title:</span> <span>[[activeTitle]]</span>\n          </div>\n          <div class="comment-on-work">\n            <a href$="[[activeUrl]]">\n              <paper-button raised="">View media</paper-button>\n            </a>\n          </div>\n        </div>\n      </paper-dialog-scrollable>\n    </paper-dialog>\n  '
    ]);
    _templateObject_5093f590f76d11e89310d7f0fbc64afe = function _templateObject_5093f590f76d11e89310d7f0fbc64afe() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_5093f590f76d11e89310d7f0fbc64afe()
    ),
    is: "lrnapp-media-grid",
    listeners: { click: "_triggerDialog" },
    properties: {
      sourcePath: { type: String, notify: !0 },
      images: { type: Array, notify: !0 },
      activeImage: { type: String, reflectToAttribute: !0, notify: !0 },
      activeTitle: { type: String, reflectToAttribute: !0, notify: !0 },
      activeUrl: { type: String, reflectToAttribute: !0, notify: !0 }
    },
    _triggerDialog: function _triggerDialog(e) {
      if ("IMG" == e.target.nextElementSibling.nodeName) {
        this.activeImage = e.target.nextElementSibling.src;
        this.activeTitle = e.target.parentElement.title;
        this.activeUrl = e.target.parentElement.openUrl;
        this.shadowRoot.querySelector("#dialog").toggle();
      }
    },
    _loadMoreData: function _loadMoreData(e) {
      this.shadowRoot.querySelector("#ajax").generateRequest();
      this.shadowRoot.querySelector("#threshold").clearTriggers();
    },
    _toArray: function _toArray(obj) {
      return Object.keys(obj).map(function(key) {
        return obj[key];
      });
    }
  });
});
