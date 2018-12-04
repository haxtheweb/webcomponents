import {
  html,
  Polymer
} from "../../node_modules/@polymer/polymer/polymer-legacy.js";
import "../../node_modules/@polymer/app-route/app-location.js";
import "../../node_modules/@polymer/app-route/app-route.js";
import "../../node_modules/@polymer/iron-icon/iron-icon.js";
import "../../node_modules/@polymer/iron-list/iron-list.js";
import "../../node_modules/@polymer/iron-ajax/iron-ajax.js";
import "../../node_modules/@polymer/paper-card/paper-card.js";
import "../../node_modules/@polymer/iron-selector/iron-selector.js";
import "../../node_modules/@polymer/iron-pages/iron-pages.js";
import "../../node_modules/@lrnwebcomponents/lrnsys-button/lrnsys-button.js";
import "../../node_modules/@lrnwebcomponents/elmsln-loading/elmsln-loading.js";
import "./lrnapp-studio-dashboard.js";
import "./lrnapp-studio-kanban.js";
import "./lrnapp-open-studio.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
    </style>

    <app-location
      route="{{route}}"
      query-params="{{queryParams}}"
    ></app-location>
    <app-route
      route="{{route}}"
      pattern="[[basePath]]/:page"
      data="{{data}}"
      tail="{{tail}}"
      query-params="{{queryParams}}"
    >
    </app-route>

    <iron-selector
      selected="{{data.page}}"
      attr-for-selected="name"
      role="navigation"
    >
      <a tabindex="-1" name="lrnapp-studio-dashboard" on-tap="_dashboardClicked"
        >A</a
      >
      <a tabindex="-1" name="lrnapp-studio-kanban" on-tap="_kanbanClicked">B</a>
      <a tabindex="-1" name="lrnapp-open-studio" on-tap="_openstudioClicked"
        >C</a
      >
    </iron-selector>

    <iron-pages
      selected="{{data.page}}"
      attr-for-selected="name"
      fallback-selection="lrnapp-studio-dashboard"
      role="main"
    >
      <lrnapp-studio-dashboard
        name="lrnapp-studio-dashboard"
        csrf-token="[[csrfToken]]"
        end-point="[[_endPoint('lrnapp-studio-dashboard')]]"
        base-path="[[basePath]]"
        elmsln-course="[[elmslnCourse]]"
        elmsln-section="[[elmslnSection]]"
        route="[[tail]]"
      >
      </lrnapp-studio-dashboard>
      <lrnapp-studio-kanban
        name="lrnapp-studio-kanban"
        csrf-token="[[csrfToken]]"
        end-point="[[_endPoint('lrnapp-studio-dashboard')]]"
        base-path="[[basePath]]"
        source-path="[[_sourcePath('lrnapp-studio-kanban/kanban-data')]]"
        elmsln-course="[[elmslnCourse]]"
        elmsln-section="[[elmslnSection]]"
        route="[[tail]]"
      ></lrnapp-studio-kanban>
      <lrnapp-open-studio
        name="lrnapp-open-studio"
        csrf-token="[[csrfToken]]"
        end-point="[[_endPoint('lrnapp-open-studio')]]"
        base-path="[[basePath]]"
        source-path="[[_sourcePath('lrnapp-open-studio/data')]]"
        elmsln-course="[[elmslnCourse]]"
        elmsln-section="[[elmslnSection]]"
        route="[[tail]]"
      >
      </lrnapp-open-studio>
    </iron-pages>
  `,
  is: "lrnapp-studio-root",
  properties: {
    sourcePath: { type: String, notify: !0, reflectToAttribute: !0 },
    elmslnSection: { type: String, notify: !0, reflectToAttribute: !0 },
    elmslnCourse: { type: String, notify: !0, reflectToAttribute: !0 },
    csrfToken: { type: String, notify: !0, reflectToAttribute: !0 },
    basePath: { type: String, notify: !0 },
    _endPoint: function(path) {
      return this.basePath + path;
    },
    _sourcePath: function(path) {
      return this.basePath + path + "?token=" + this.csrfToken;
    },
    listeners: { "route-change": "_routeChange" },
    observers: [
      "_routeChanged(route, basePath)",
      "_deleteToast(queryParams.deletetoast)"
    ],
    _routeChanged: function(route, basePath) {
      if ("string" === typeof route.path) {
        if ("string" === typeof basePath) {
          if (route.path.startsWith(basePath)) {
            return;
          }
        }
        window.location.reload();
      }
    },
    _routeChange: function(e) {
      var details = e.detail;
      if (typeof details.queryParams.assignment !== typeof void 0) {
        this.set("queryParams.assignment", details.queryParams.assignment);
        this.notifyPath("queryParams.assignment");
      }
      if (typeof details.queryParams.project !== typeof void 0) {
        this.set("queryParams.project", details.queryParams.project);
        this.notifyPath("queryParams.project");
      }
      if (typeof details.queryParams.author !== typeof void 0) {
        this.set("queryParams.author", details.queryParams.author);
        this.notifyPath("queryParams.author");
      }
      if (typeof details.data.page !== typeof void 0) {
        this.set("data.page", details.data.page);
        this.notifyPath("data.path");
      }
    },
    _deleteToast: function(deletetoast, old) {
      if (typeof deletetoast !== typeof void 0) {
        if ("error" == deletetoast) {
          this.$.toast.show("That submission on longer exists!");
        } else {
          this.$.toast.show("Submission deleted successfully!");
        }
        this.set("queryParams.deletetoast", void 0);
        this.notifyPath("queryParams.deletetoast");
      }
    },
    _dashboardClicked: function(e) {
      this.set("route.path", this.basePath + "/lrnapp-studio-dashboard");
      this.notifyPath("route.path");
    },
    _kanbanClicked: function(e) {
      this.set("route.path", this.basePath + "/lrnapp-studio-kanban");
      this.notifyPath("route.path");
    },
    _openstudioClicked: function(e) {
      this.set("route.path", this.basePath + "/lrnapp-open-studio");
      this.notifyPath("route.path");
    },
    _toArray: function(obj) {
      return Object.keys(obj).map(function(key) {
        return obj[key];
      });
    }
  }
});
