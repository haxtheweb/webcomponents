define([
  "../../node_modules/@polymer/polymer/polymer-legacy.js",
  "../../node_modules/@polymer/app-route/app-location.js",
  "../../node_modules/@polymer/app-route/app-route.js",
  "../../node_modules/@polymer/iron-icon/iron-icon.js",
  "../../node_modules/@polymer/iron-list/iron-list.js",
  "../../node_modules/@polymer/iron-ajax/iron-ajax.js",
  "../../node_modules/@polymer/paper-card/paper-card.js",
  "../../node_modules/@polymer/iron-selector/iron-selector.js",
  "../../node_modules/@polymer/iron-pages/iron-pages.js",
  "../../node_modules/@lrnwebcomponents/lrnsys-button/lrnsys-button.js",
  "../../node_modules/@lrnwebcomponents/elmsln-loading/elmsln-loading.js",
  "./lrnapp-studio-dashboard.js",
  "./lrnapp-studio-kanban.js",
  "./lrnapp-open-studio.js"
], function(
  _polymerLegacy,
  _appLocation,
  _appRoute,
  _ironIcon,
  _ironList,
  _ironAjax,
  _paperCard,
  _ironSelector,
  _ironPages,
  _lrnsysButton,
  _elmslnLoading,
  _lrnappStudioDashboard,
  _lrnappStudioKanban,
  _lrnappOpenStudio
) {
  "use strict";
  function _templateObject_51432150f76d11e89310d7f0fbc64afe() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n\n    <app-location\n      route="{{route}}"\n      query-params="{{queryParams}}"\n    ></app-location>\n    <app-route\n      route="{{route}}"\n      pattern="[[basePath]]/:page"\n      data="{{data}}"\n      tail="{{tail}}"\n      query-params="{{queryParams}}"\n    >\n    </app-route>\n\n    <iron-selector\n      selected="{{data.page}}"\n      attr-for-selected="name"\n      role="navigation"\n    >\n      <a tabindex="-1" name="lrnapp-studio-dashboard" on-tap="_dashboardClicked"\n        >A</a\n      >\n      <a tabindex="-1" name="lrnapp-studio-kanban" on-tap="_kanbanClicked">B</a>\n      <a tabindex="-1" name="lrnapp-open-studio" on-tap="_openstudioClicked"\n        >C</a\n      >\n    </iron-selector>\n\n    <iron-pages\n      selected="{{data.page}}"\n      attr-for-selected="name"\n      fallback-selection="lrnapp-studio-dashboard"\n      role="main"\n    >\n      <lrnapp-studio-dashboard\n        name="lrnapp-studio-dashboard"\n        csrf-token="[[csrfToken]]"\n        end-point="[[_endPoint(\'lrnapp-studio-dashboard\')]]"\n        base-path="[[basePath]]"\n        elmsln-course="[[elmslnCourse]]"\n        elmsln-section="[[elmslnSection]]"\n        route="[[tail]]"\n      >\n      </lrnapp-studio-dashboard>\n      <lrnapp-studio-kanban\n        name="lrnapp-studio-kanban"\n        csrf-token="[[csrfToken]]"\n        end-point="[[_endPoint(\'lrnapp-studio-dashboard\')]]"\n        base-path="[[basePath]]"\n        source-path="[[_sourcePath(\'lrnapp-studio-kanban/kanban-data\')]]"\n        elmsln-course="[[elmslnCourse]]"\n        elmsln-section="[[elmslnSection]]"\n        route="[[tail]]"\n      ></lrnapp-studio-kanban>\n      <lrnapp-open-studio\n        name="lrnapp-open-studio"\n        csrf-token="[[csrfToken]]"\n        end-point="[[_endPoint(\'lrnapp-open-studio\')]]"\n        base-path="[[basePath]]"\n        source-path="[[_sourcePath(\'lrnapp-open-studio/data\')]]"\n        elmsln-course="[[elmslnCourse]]"\n        elmsln-section="[[elmslnSection]]"\n        route="[[tail]]"\n      >\n      </lrnapp-open-studio>\n    </iron-pages>\n  '
    ]);
    _templateObject_51432150f76d11e89310d7f0fbc64afe = function _templateObject_51432150f76d11e89310d7f0fbc64afe() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_51432150f76d11e89310d7f0fbc64afe()
    ),
    is: "lrnapp-studio-root",
    properties: {
      sourcePath: { type: String, notify: !0, reflectToAttribute: !0 },
      elmslnSection: { type: String, notify: !0, reflectToAttribute: !0 },
      elmslnCourse: { type: String, notify: !0, reflectToAttribute: !0 },
      csrfToken: { type: String, notify: !0, reflectToAttribute: !0 },
      basePath: { type: String, notify: !0 },
      _endPoint: function _endPoint(path) {
        return this.basePath + path;
      },
      _sourcePath: function _sourcePath(path) {
        return this.basePath + path + "?token=" + this.csrfToken;
      },
      listeners: { "route-change": "_routeChange" },
      observers: [
        "_routeChanged(route, basePath)",
        "_deleteToast(queryParams.deletetoast)"
      ],
      _routeChanged: function _routeChanged(route, basePath) {
        if ("string" === typeof route.path) {
          if ("string" === typeof basePath) {
            if (route.path.startsWith(basePath)) {
              return;
            }
          }
          window.location.reload();
        }
      },
      _routeChange: function _routeChange(e) {
        var details = e.detail;
        if (
          babelHelpers.typeof(details.queryParams.assignment) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0))
        ) {
          this.set("queryParams.assignment", details.queryParams.assignment);
          this.notifyPath("queryParams.assignment");
        }
        if (
          babelHelpers.typeof(details.queryParams.project) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0))
        ) {
          this.set("queryParams.project", details.queryParams.project);
          this.notifyPath("queryParams.project");
        }
        if (
          babelHelpers.typeof(details.queryParams.author) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0))
        ) {
          this.set("queryParams.author", details.queryParams.author);
          this.notifyPath("queryParams.author");
        }
        if (
          babelHelpers.typeof(details.data.page) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0))
        ) {
          this.set("data.page", details.data.page);
          this.notifyPath("data.path");
        }
      },
      _deleteToast: function _deleteToast(deletetoast, old) {
        if (
          babelHelpers.typeof(deletetoast) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0))
        ) {
          if ("error" == deletetoast) {
            this.$.toast.show("That submission on longer exists!");
          } else {
            this.$.toast.show("Submission deleted successfully!");
          }
          this.set("queryParams.deletetoast", void 0);
          this.notifyPath("queryParams.deletetoast");
        }
      },
      _dashboardClicked: function _dashboardClicked(e) {
        this.set("route.path", this.basePath + "/lrnapp-studio-dashboard");
        this.notifyPath("route.path");
      },
      _kanbanClicked: function _kanbanClicked(e) {
        this.set("route.path", this.basePath + "/lrnapp-studio-kanban");
        this.notifyPath("route.path");
      },
      _openstudioClicked: function _openstudioClicked(e) {
        this.set("route.path", this.basePath + "/lrnapp-open-studio");
        this.notifyPath("route.path");
      },
      _toArray: function _toArray(obj) {
        return Object.keys(obj).map(function(key) {
          return obj[key];
        });
      }
    }
  });
});
