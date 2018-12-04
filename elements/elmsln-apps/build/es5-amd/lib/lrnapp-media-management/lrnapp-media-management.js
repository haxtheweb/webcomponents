define([
  "../../node_modules/@polymer/polymer/polymer-legacy.js",
  "../../node_modules/@polymer/iron-ajax/iron-ajax.js",
  "../../node_modules/@polymer/iron-scroll-threshold/iron-scroll-threshold.js",
  "../../node_modules/@polymer/iron-image/iron-image.js",
  "../../node_modules/@polymer/iron-list/iron-list.js",
  "../../node_modules/@polymer/paper-button/paper-button.js",
  "../../node_modules/@lrnwebcomponents/elmsln-loading/elmsln-loading.js",
  "../../node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js"
], function(
  _polymerLegacy,
  _ironAjax,
  _ironScrollThreshold,
  _ironImage,
  _ironList,
  _paperButton,
  _elmslnLoading,
  _materializecssStyles
) {
  "use strict";
  function _templateObject_50a09fc0f76d11e89310d7f0fbc64afe() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style include="materializecss-styles">\n      :host {\n        display: block;\n      }\n      paper-button {\n        padding: 0;\n        margin: 0;\n        min-width: 16px;\n      }\n      #details {\n        opacity: 0.5;\n        position: absolute;\n        bottom: 0;\n        right: 0;\n        margin: 0 16px 0 0;\n        background-color: white;\n        padding: 8px;\n      }\n      #details:hover {\n        opacity: 1;\n      }\n      #details span {\n        font-size: 10px;\n        font-weight: normal;\n      }\n      #details .comment-on-work {\n        font-size: 12px;\n        background-color: white;\n      }\n    </style>\n    <iron-ajax\n      id="ajax"\n      url="[[source-path]]"\n      params=""\n      handle-as="json"\n      last-response="{{submissions}}"\n    ></iron-ajax>\n    <iron-scroll-threshold on-lower-threshold="_loadMoreData" id="threshold">\n      <iron-list grid items="[[_toArray(submissions.data)]]" as="item">\n        <template>\n          <paper-card\n            heading="{{item.title}}"\n            image=""\n            elevation="2"\n            animated-shadow="true"\n          >\n            <div class="card-content"></div>\n            <div class="card-actions">\n              <a href="{{item.url}}"\n                ><paper-button raised>View</paper-button></a\n              >\n              <a href="{{item.edit_url}}"\n                ><paper-button raised>Edit</paper-button></a\n              >\n            </div>\n          </paper-card>\n        </template>\n      </iron-list>\n    </iron-scroll-threshold>\n    <paper-dialog\n      id="dialog"\n      entry-animation="scale-up-animation"\n      exit-animation="fade-out-animation"\n    >\n      <paper-dialog-scrollable id="dialogResponse">\n        <iron-image src="{{activeImage}}"></iron-image>\n        <div id="details">\n          <div class="title">\n            <span>Title:</span> <span>{{activeTitle}}</span>\n          </div>\n          <div class="author">\n            <span>Author:</span> <span>{{activeAuthor}}</span>\n          </div>\n          <div class="comments">\n            <span>Comments:</span> <span>{{activeComments}}</span>\n          </div>\n          <div class="comment-on-work">\n            <a href="{{activeUrl}}">\n              <paper-button raised>Comment on this work</paper-button>\n            </a>\n          </div>\n        </div>\n      </paper-dialog-scrollable>\n    </paper-dialog>\n  '
    ]);
    _templateObject_50a09fc0f76d11e89310d7f0fbc64afe = function _templateObject_50a09fc0f76d11e89310d7f0fbc64afe() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_50a09fc0f76d11e89310d7f0fbc64afe()
    ),
    is: "lrnapp-media-management",
    listeners: { click: "_triggerDialog" },
    properties: {
      submissions: { type: Array, notify: !0 },
      activeImage: { type: String, reflectToAttribute: !0, notify: !0 },
      activeTitle: { type: String, reflectToAttribute: !0, notify: !0 },
      activeAuthor: { type: String, reflectToAttribute: !0, notify: !0 },
      activeComments: { type: String, reflectToAttribute: !0, notify: !0 },
      activeUrl: { type: String, reflectToAttribute: !0, notify: !0 }
    },
    _triggerDialog: function _triggerDialog(e) {
      var root = this;
      if ("IMG" == e.target.nextElementSibling.nodeName) {
        root.activeImage = e.target.nextElementSibling.src;
        root.activeTitle = e.target.parentElement.title;
        root.activeAuthor = e.target.parentElement.author;
        root.activeComments = e.target.parentElement.comments;
        root.activeUrl = e.target.parentElement.openUrl;
        this.shadowRoot.querySelector("#dialog").toggle();
      }
    },
    _loadMoreData: function _loadMoreData(e) {
      var root = this;
      root.shadowRoot.querySelector("#ajax").generateRequest();
      root.shadowRoot.querySelector("#threshold").clearTriggers();
    },
    _toArray: function _toArray(obj) {
      return Object.keys(obj).map(function(key) {
        return obj[key];
      });
    }
  });
});
