define([
  "../../node_modules/@polymer/polymer/polymer-legacy.js",
  "../../node_modules/@polymer/app-route/app-location.js",
  "../../node_modules/@polymer/app-route/app-route.js",
  "../../node_modules/@polymer/paper-toast/paper-toast.js",
  "./lrnapp-studio-submission-page.js",
  "./lrnapp-studio-submission-button.js"
], function(
  _polymerLegacy,
  _appLocation,
  _appRoute,
  _paperToast,
  _lrnappStudioSubmissionPage,
  _lrnappStudioSubmissionButton
) {
  "use strict";
  function _templateObject_606f39e0f77011e8b89b0519890f95da() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style include="materializecss-styles">\n      :host {\n        display: block;\n      }\n      paper-button {\n        padding: 0;\n        margin: 0;\n        min-width: 1rem;\n      }\n    </style>\n    <app-location route="{{route}}"></app-location>\n    <app-route\n      route="{{route}}"\n      pattern="[[endPoint]]/submissions/:submission"\n      data="{{data}}"\n      tail="{{tail}}"\n    >\n    </app-route>\n\n    <template is="dom-if" if="[[data.submission]]">\n      <lrnapp-studio-submission-page\n        base-path="{{basePath}}"\n        route="{{tail}}"\n        id="[[data.submission]]"\n        end-point="[[endPoint]]"\n        csrf-token="[[csrfToken]]"\n        data="{{data}}"\n      ></lrnapp-studio-submission-page>\n    </template>\n    <template is="dom-if" if="[[!data.submission]]">\n      This is the lrnapp-studio-submission page.\n    </template>\n\n    <paper-toast id="toast"></paper-toast>\n  '
    ]);
    _templateObject_606f39e0f77011e8b89b0519890f95da = function _templateObject_606f39e0f77011e8b89b0519890f95da() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_606f39e0f77011e8b89b0519890f95da()
    ),
    is: "lrnapp-studio-submission",
    behaviors: [SecureRequest.xhr],
    properties: {
      activePage: { type: String },
      basePath: { type: String },
      endPoint: { type: String },
      csrfToken: { type: String }
    },
    observers: [
      "_routeChanged(route, endPoint)",
      "_updateCookies(endPoint, csrfToken)"
    ],
    listeners: {
      submissionDeleted: "_handleSubmissionDeletion",
      displaymessage: "_handleDisplayMessage"
    },
    _handleRouteChange: function _handleRouteChange(event) {
      var path = event.detail.path;
      if (path) {
        this.set("route.path", path);
        this.notifyPath("route.path");
      }
    },
    _routeChanged: function _routeChanged(route, endPoint) {
      if ("string" === typeof route.path) {
        if ("string" === typeof endPoint) {
          if (route.path.startsWith(endPoint)) {
            return;
          }
        }
        window.location.reload();
      }
    },
    _handleSubmissionDeletion: function _handleSubmissionDeletion(e) {
      var submission = e.detail.submission;
      if (submission) {
        this.set("route.path", this.endPoint);
        this.notifyPath("route.path");
        this.$.toast.show("Submission has been deleted.");
      }
    },
    _updateCookies: function _updateCookies(endPoint, csrfToken) {
      if (endPoint && csrfToken) {
        this.setCookies(endPoint, csrfToken);
      }
    },
    _handleDisplayMessage: function _handleDisplayMessage(e, detail) {
      if ("undefined" !== typeof e.detail.messsage) {
        this.$.toast.show(e.detail.message);
      }
    },
    _toArray: function _toArray(obj) {
      return Object.keys(obj).map(function(key) {
        return obj[key];
      });
    }
  });
});
