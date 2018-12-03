import "./lrnapp-studio-submission-page.js";
import "./lrnapp-studio-submission-button.js";
/*<link rel="import" href="../../bower_components/build/build/default/build.html">*/
Polymer({
  _template: `
    <style include="materializecss-styles"></style>
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
    <app-route route="{{route}}" pattern="[[endPoint]]/submissions/:submission" data="{{data}}" tail="{{tail}}">
    </app-route>

    <template is="dom-if" if="[[data.submission]]">
      <lrnapp-studio-submission-page base-path="{{basePath}}" route="{{tail}}" id="[[data.submission]]" end-point="[[endPoint]]" csrf-token="[[csrfToken]]" data="{{data}}"></lrnapp-studio-submission-page>
    </template>
    <template is="dom-if" if="[[!data.submission]]">
      This is the lrnapp-studio-submission page.
    </template>

    <paper-toast id="toast"></paper-toast>
`,

  is: "lrnapp-studio-submission",
  behaviors: [SecureRequest.xhr],

  properties: {
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
  },

  observers: [
    "_routeChanged(route, endPoint)",
    "_updateCookies(endPoint, csrfToken)"
  ],

  listeners: {
    submissionDeleted: "_handleSubmissionDeletion",
    displaymessage: "_handleDisplayMessage"
  },

  _handleRouteChange: function(event) {
    var path = event.detail.path;
    if (path) {
      this.set("route.path", path);
    }
  },

  // If the current route is outside the scope of our app
  // then allow the website to break out of the single page
  // application routing
  _routeChanged: function(route, endPoint) {
    if (typeof route.path === "string") {
      if (typeof endPoint === "string") {
        if (route.path.startsWith(endPoint)) {
          return;
        }
      }
      // reload the page which since route changed will load that page
      window.location.reload();
    }
  },

  _handleSubmissionDeletion: function(e) {
    var submission = e.detail.submission;
    if (submission) {
      this.set("route.path", this.endPoint);
      this.$.toast.show("Submission has been deleted.");
    }
  },

  _updateCookies: function(endPoint, csrfToken) {
    if (endPoint && csrfToken) {
      this.setCookies(endPoint, csrfToken);
    }
  },

  _handleDisplayMessage: function(e, detail) {
    if (typeof e.detail.messsage !== "undefined") {
      this.$.toast.show(e.detail.message);
    }
  },

  /**
   * Simple way to convert from object to array.
   */
  _toArray: function(obj) {
    return Object.keys(obj).map(function(key) {
      return obj[key];
    });
  }
});
