import { LitElement, html, css } from "lit-element/lit-element.js";
import { SecureRequestXhr } from "@lrnwebcomponents/secure-request/secure-request.js";
import "@polymer/app-route/app-location.js";
import "@polymer/app-route/app-route.js";
import "@polymer/paper-toast/paper-toast.js";
import "./lrnapp-studio-submission-page.js";
import "./lrnapp-studio-submission-button.js";
class LrnappStudioSubmission extends SecureRequestXhr(LitElement) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        paper-button {
          padding: 0;
          margin: 0;
          min-width: 1rem;
        }
      `
    ];
  }
  render() {
    return html`
      <app-location
        .route="${this.route}"
        @route-changed="${this.routeChangedEvent}"
      ></app-location>
      <app-route
        .route="${this.route}"
        @route-changed="${this.routeChangedEvent}"
        pattern="${this.endPoint}/submissions/:submission"
        .data="${this.data}"
        @data-changed="${this.dataChangedEvent}"
        .tail="${this.tail}"
        @tail-changed="${this.tailChangedEvent}"
      >
      </app-route>
      ${this.data.submission
        ? html`
            <lrnapp-studio-submission-page
              base-path="{${this.basePath}"
              @base-path-changed="${this.basePathChangedEvent}"
              .route="${this.tail}"
              @route-changed="${this.tailChangedEvent}"
              .data="${this.data}"
              @data-changed="${this.dataChangedEvent}"
              id="${this.data.submission}"
              end-point="${this.endPoint}"
              csrf-token="${this.csrfToken}"
            ></lrnapp-studio-submission-page>
          `
        : html`
            This is the lrnapp-studio-submission page.
          `}
      <paper-toast id="toast"></paper-toast>
    `;
  }
  basePathChangedEvent(e) {
    this.basePath = e.detail.value;
  }
  tailChangedEvent(e) {
    this.tail = e.detail.value;
  }
  routeChangedEvent(e) {
    this.route = e.detail.value;
  }
  dataChangedEvent(e) {
    this.data = e.detail.value;
  }
  static get tag() {
    return "lrnapp-studio-submission";
  }

  static get properties() {
    return {
      elmslnCourse: {
        type: String,
        attribute: "elmsln-course"
      },
      elmslnSection: {
        type: String,
        attribute: "elmsln-section"
      },
      basePath: {
        type: String,
        attribute: "base-path"
      },
      csrfToken: {
        type: String,
        attribute: "csrf-token"
      },
      endPoint: {
        type: String,
        attribute: "end-point"
      },
      activePage: {
        type: String,
        attribute: "active-page"
      }
    };
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (["route", "endPoint"].includes(propName)) {
        this._routeChanged(this.route, this.endPoint);
      }
      if (["endPoint", "csrfToken"].includes(propName)) {
        this._updateCookies(this.endPoint, this.csrfToken);
      }
    });
  }
  constructor() {
    super();
    setTimeout(() => {
      this.addEventListener(
        "submissionDeleted",
        this._handleSubmissionDeletion.bind(this)
      );
      this.addEventListener(
        "displaymessage",
        this._handleDisplayMessage.bind(this)
      );
    }, 0);
  }
  _handleRouteChange(event) {
    var path = event.detail.path;
    if (path) {
      let attr = this.route;
      attr.path = path;
      this.route = { ...attr };
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
      let attr = this.route;
      attr.path = this.endPoint;
      this.route = { ...attr };
      this.shadowRoot
        .querySelector("#toast")
        .show("Submission has been deleted.");
    }
  }

  _updateCookies(endPoint, csrfToken) {
    if (endPoint && csrfToken) {
      this.setCookies(endPoint, csrfToken);
    }
  }

  _handleDisplayMessage(e, detail) {
    if (typeof e.detail.messsage !== "undefined") {
      this.shadowRoot.querySelector("#toast").show(e.detail.message);
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
