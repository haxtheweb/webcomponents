define([
  "../../node_modules/@polymer/polymer/polymer-legacy.js",
  "../../node_modules/@polymer/paper-card/paper-card.js",
  "../../node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js",
  "./lrnapp-block-recent-project.js",
  "./lrnapp-block-recent-submissions.js",
  "./lrnapp-block-recent-comments.js",
  "./lrnapp-block-need-feedback.js"
], function(
  _polymerLegacy,
  _paperCard,
  _materializecssStyles,
  _lrnappBlockRecentProject,
  _lrnappBlockRecentSubmissions,
  _lrnappBlockRecentComments,
  _lrnappBlockNeedFeedback
) {
  "use strict";
  function _templateObject_50cabd00f76d11e89310d7f0fbc64afe() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style include="materializecss-styles">\n      :host {\n        display: block;\n        padding: 0 2em;\n      }\n      h1.title {\n        font-size: 2em;\n        color: black;\n        margin: 0;\n        padding: 0.5em 0 0 0;\n        text-transform: none;\n        text-align: left;\n      }\n      p.para {\n        margin: 0;\n        padding: 0.25em 0.5em;\n      }\n      .dashboard-row {\n        width: 100%;\n        display: inline-flex;\n      }\n      .dashboard-item {\n        width: 30%;\n      }\n    </style>\n    <h1 class="title">Welcome back [[username]]!</h1>\n    <p class="para">Here\'s what\'s been going on in the studio</p>\n    <div class="dashboard-row">\n      <paper-card heading="Your active project" class="dashboard-item">\n        <div class="card-content">\n          <lrnapp-block-recent-project\n            csrf-token="[[csrfToken]]"\n            end-point="[[_getEndPoint(basePath)]]"\n            base-path="[[basePath]]"\n            source-path="[[_getDataSource(csrfToken, basePath,\'recent-project\')]]"\n          >\n          </lrnapp-block-recent-project>\n        </div>\n      </paper-card>\n      <paper-card heading="Classmates needing feedback" class="dashboard-item">\n        <div class="card-content">\n          <lrnapp-block-need-feedback\n            csrf-token="[[csrfToken]]"\n            end-point="[[_getEndPoint(basePath)]]"\n            base-path="[[basePath]]"\n            source-path="[[_getDataSource(csrfToken, basePath,\'need-feedback\')]]"\n          >\n          </lrnapp-block-need-feedback>\n        </div>\n      </paper-card>\n      <paper-card heading="Recent Studio submissions" class="dashboard-item">\n        <div class="card-content">\n          <lrnapp-block-recent-submissions\n            csrf-token="[[csrfToken]]"\n            end-point="[[_getEndPoint(basePath)]]"\n            base-path="[[basePath]]"\n            source-path="[[_getDataSource(csrfToken, basePath,\'recent-submissions\')]]"\n          >\n          </lrnapp-block-recent-submissions>\n        </div>\n      </paper-card>\n      <paper-card heading="Recent Studio comments" class="dashboard-item">\n        <div class="card-content">\n          <lrnapp-block-recent-comments\n            csrf-token="[[csrfToken]]"\n            end-point="[[_getEndPoint(basePath)]]"\n            base-path="[[basePath]]"\n            source-path="[[_getDataSource(csrfToken, basePath,\'recent-comments\')]]"\n          >\n          </lrnapp-block-recent-comments>\n        </div>\n      </paper-card>\n    </div>\n  '
    ]);
    _templateObject_50cabd00f76d11e89310d7f0fbc64afe = function _templateObject_50cabd00f76d11e89310d7f0fbc64afe() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_50cabd00f76d11e89310d7f0fbc64afe()
    ),
    is: "lrnapp-studio-dashboard",
    properties: {
      username: { type: String, reflectToAttribute: !0 },
      basePath: { type: String, notify: !0, reflectToAttribute: !0 },
      csrfToken: { type: String, notify: !0, reflectToAttribute: !0 },
      sourcePath: { type: String, notify: !0, reflectToAttribute: !0 }
    },
    _getEndPoint: function _getEndPoint(basePath) {
      return basePath + "lrnapp-studio-dashboard/blocks";
    },
    _getDataSource: function _getDataSource(csrfToken, basePath, dataPoint) {
      return (
        basePath +
        "lrnapp-studio-dashboard/blocks/" +
        dataPoint +
        "?token=" +
        csrfToken
      );
    },
    _toArray: function _toArray(obj) {
      return Object.keys(obj).map(function(key) {
        return obj[key];
      });
    }
  });
});
