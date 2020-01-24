import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import { SecureRequestXhr } from "@lrnwebcomponents/secure-request/secure-request.js";
import "@polymer/app-route/app-location.js";
import "@polymer/app-route/app-route.js";
import "@polymer/polymer/lib/elements/dom-if.js";
import "@polymer/paper-toast/paper-toast.js";
import "./lrnapp-studio-submission-page.js";
import "./lrnapp-studio-submission-button.js";
class LrnappStudioSubmission extends SecureRequestXhr(PolymerElement) {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        paper-button {
          padding: 0;
          margin: 0;
          min-width: 1rem;
        }
      </style>
      <app-location route="{{route}}"></app-location>
      <app-route
        route="{{route}}"
        pattern="[[endPoint]]/submissions/:submission"
        data="{{data}}"
        tail="{{tail}}"
      >
      </app-route>

      <template is="dom-if" if="[[data.submission]]">
        <lrnapp-studio-submission-page
          base-path="{{basePath}}"
          route="{{tail}}"
          id="[[data.submission]]"
          end-point="[[endPoint]]"
          csrf-token="[[csrfToken]]"
          data="{{data}}"
        ></lrnapp-studio-submission-page>
      </template>
      <template is="dom-if" if="[[!data.submission]]">
        This is the lrnapp-studio-submission page.
      </template>

      <paper-toast id="toast"></paper-toast>
    `;
  }

  static get tag() {
    return "lrnapp-studio-submission";
  }

  static get properties() {
    return {
      elmslnCourse: {
        type: String
      },
      elmslnSection: {
        type: String
      },
      basePath: {
        type: String
      },
      csrfToken: {
        type: String
      },
      endPoint: {
        type: String
      },
      activePage: {
        type: String
      },
      basePath: {
        type: String
      },
      endPoint: {
        type: String
      },
      csrfToken: {
        type: String
      }
    };
  }

  static get observers() {
    return [
      "_routeChanged(route, endPoint)",
      "_updateCookies(endPoint, csrfToken)"
    ];
  }
  connectedCallback() {
    super.connectedCallback();
    afterNextRender(this, function() {
      this.addEventListener(
        "submissionDeleted",
        this._handleSubmissionDeletion.bind(this)
      );
      this.addEventListener(
        "displaymessage",
        this._handleDisplayMessage.bind(this)
      );
    });
  }
  disconnectedCallback() {
    this.removeEventListener(
      "submissionDeleted",
      this._handleSubmissionDeletion.bind(this)
    );
    this.removeEventListener(
      "displaymessage",
      this._handleDisplayMessage.bind(this)
    );
    super.disconnectedCallback();
  }
  _handleRouteChange(event) {
    var path = event.detail.path;
    if (path) {
      this.set("route.path", path);
      this.notifyPath("route.path");
    }
  }

  // If the current route is outside the scope of our app
  // then allow the website to break out of the single page
  // application routing
  _routeChanged(route, endPoint) {
    if (typeof route.path === "string") {
      if (typeof endPoint === "string") {
        if (route.path.startsWith(endPoint)) {
          return;
        }
      }
      // reload the page which since route changed will load that page
      window.location.reload();
    }
  }

  _handleSubmissionDeletion(e) {
    var submission = e.detail.submission;
    if (submission) {
      this.set("route.path", this.endPoint);
      this.notifyPath("route.path");
      this.$.toast.show("Submission has been deleted.");
    }
  }

  _updateCookies(endPoint, csrfToken) {
    if (endPoint && csrfToken) {
      this.setCookies(endPoint, csrfToken);
    }
  }

  _handleDisplayMessage(e, detail) {
    if (typeof e.detail.messsage !== "undefined") {
      this.$.toast.show(e.detail.message);
    }
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
window.customElements.define(
  LrnappStudioSubmission.tag,
  LrnappStudioSubmission
);
export { LrnappStudioSubmission };
