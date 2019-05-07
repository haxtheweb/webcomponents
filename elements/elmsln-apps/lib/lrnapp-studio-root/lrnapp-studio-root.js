import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import "@polymer/app-route/app-location.js";
import "@polymer/app-route/app-route.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-list/iron-list.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/paper-card/paper-card.js";
import "@polymer/iron-selector/iron-selector.js";
import "@polymer/iron-pages/iron-pages.js";
import "@lrnwebcomponents/lrnsys-button/lrnsys-button.js";
import "@lrnwebcomponents/elmsln-loading/elmsln-loading.js";
import "@lrnwebcomponents/elmsln-apps/lib/lrnapp-studio-dashboard/lrnapp-studio-dashboard.js";
import "@lrnwebcomponents/elmsln-apps/lib/lrnapp-studio-kanban/lrnapp-studio-kanban.js";
import "@lrnwebcomponents/elmsln-apps/lib/lrnapp-open-studio/lrnapp-open-studio.js";
class LrnappStudioRoot extends PolymerElement {
  static get template() {
    return html`
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
        <a
          tabindex="-1"
          name="lrnapp-studio-dashboard"
          on-tap="_dashboardClicked"
          >A</a
        >
        <a tabindex="-1" name="lrnapp-studio-kanban" on-tap="_kanbanClicked"
          >B</a
        >
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
    `;
  }
  connectedCallback() {
    super.connectedCallback();
    afterNextRender(this, function() {
      this.addEventListener("route-change", this._routeChange.bind(this));
    });
  }
  disconnectedCallback() {
    this.removeEventListener("route-change", this._routeChange.bind(this));
    super.disconnectedCallback();
  }
  static get tag() {
    return "lrnapp-studio-root";
  }
  static get properties() {
    return {
      /**
       * sourcePath for submission data.
       */
      endPoint: {
        type: String
      },
      sourcePath: {
        type: String,
        notify: true,
        reflectToAttribute: true
      },
      elmslnSection: {
        type: String,
        notify: true,
        reflectToAttribute: true
      },
      elmslnCourse: {
        type: String,
        notify: true,
        reflectToAttribute: true
      },
      csrfToken: {
        type: String,
        notify: true,
        reflectToAttribute: true
      },
      /**
       * base path for the app
       */
      basePath: {
        type: String,
        notify: true
      }
    };
  }
  _endPoint(path) {
    return this.basePath + path;
  }
  _sourcePath(path) {
    return this.basePath + path + "?token=" + this.csrfToken;
  }
  static get observers() {
    return [
      "_routeChanged(route, basePath)",
      "_deleteToast(queryParams.deletetoast)"
    ];
  }
  // If the current route is outside the scope of our app
  // then allow the website to break out of the single page
  // application routing
  _routeChanged(route, basePath) {
    if (typeof route.path === "string") {
      if (typeof basePath === "string") {
        if (route.path.startsWith(basePath)) {
          return;
        }
      }
      // reload the page which since route changed will load that page
      window.location.reload();
    }
  }
  /**
   * Change route from deeper in the app.
   */
  _routeChange(e) {
    var details = e.detail;
    if (typeof details.queryParams.assignment !== typeof undefined) {
      this.set("queryParams.assignment", details.queryParams.assignment);
      this.notifyPath("queryParams.assignment");
    }
    if (typeof details.queryParams.project !== typeof undefined) {
      this.set("queryParams.project", details.queryParams.project);
      this.notifyPath("queryParams.project");
    }
    if (typeof details.queryParams.author !== typeof undefined) {
      this.set("queryParams.author", details.queryParams.author);
      this.notifyPath("queryParams.author");
    }
    if (typeof details.data.page !== typeof undefined) {
      this.set("data.page", details.data.page);
      this.notifyPath("data.path");
    }
  }
  /**
   * Support having a toast message because of delete or error elsewhere.
   */
  _deleteToast(deletetoast, old) {
    if (typeof deletetoast !== typeof undefined) {
      if (deletetoast == "error") {
        this.$.toast.show("That submission on longer exists!");
      } else {
        this.$.toast.show("Submission deleted successfully!");
      }
      this.set("queryParams.deletetoast", undefined);
      this.notifyPath("queryParams.deletetoast");
    }
  }
  _dashboardClicked(e) {
    this.set("route.path", this.basePath + "/lrnapp-studio-dashboard");
    this.notifyPath("route.path");
  }
  _kanbanClicked(e) {
    this.set("route.path", this.basePath + "/lrnapp-studio-kanban");
    this.notifyPath("route.path");
  }
  _openstudioClicked(e) {
    this.set("route.path", this.basePath + "/lrnapp-open-studio");
    this.notifyPath("route.path");
  }
  /**
   * Simple way to convert from object to array.
   */
  _toArray(obj) {
    if (obj == null) {
      return [];
    }
    return Object.keys(obj).map(function(key) {
      return obj[key];
    });
  }
}
window.customElements.define(LrnappStudioRoot.tag, LrnappStudioRoot);
export { LrnappStudioRoot };
