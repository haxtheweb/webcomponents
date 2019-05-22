import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import { microTask } from "@polymer/polymer/lib/utils/async.js";
import "@polymer/app-route/app-route.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/app-layout/app-toolbar/app-toolbar.js";
import "@polymer/marked-element/marked-element.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/paper-dialog/paper-dialog.js";
import "@polymer/polymer/lib/elements/dom-if.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-badge/paper-badge.js";
import "@polymer/paper-toast/paper-toast.js";
import "@vaadin/vaadin-split-layout/vaadin-split-layout.js";
import "@lrnwebcomponents/lrnsys-layout/lib/lrnsys-dialog.js";
import "@lrnwebcomponents/lrnsys-button/lrnsys-button.js";
import "@lrnwebcomponents/lrnsys-comment/lib/lrnsys-comment-list.js";
import "@lrnwebcomponents/elmsln-loading/elmsln-loading.js";
import "./lrnapp-studio-submission-object.js";
import "./lrnapp-studio-submission-comments.js";
import "./lrnapp-studio-submission-comment.js";

class LrnappStudioSubmissionPage extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          position: relative;
        }

        p {
          font-size: 14px;
          line-height: 18px;
        }

        h1 {
          margin: 0;
          text-align: left;
        }

        iron-selector {
          line-height: 1em;
        }

        iron-selector lrnsys-button {
          display: inline-flex;
        }

        iron-image {
          margin: 0 0.5em;
        }

        lrnsys-dialog {
          display: inline;
        }

        .contain {
          width: 10em;
          height: 10em;
          background: #ddd;
        }

        .center {
          margin: auto;
          width: 100%;
        }

        .title {
          color: #222;
          font-size: 2rem;
          font-weight: 600;
          line-height: 2.5rem;
          padding: 0.25rem 0;
          white-space: nowrap;
          overflow-x: hidden;
          text-overflow: ellipsis;
          margin-top: 1rem;
          text-transform: uppercase;
          text-align: left;
        }

        .author {
          color: #555;
          font-size: 1rem;
          font-weight: 500;
          font-style: normal;
          line-height: 1rem;
          padding: 0.25rem 0 0.5rem 0;
          margin: 0;
          text-transform: capitalize;
        }

        .comments {
          text-align: right;
          margin: 0;
          font-size: 1.5em;
        }

        .submission-page-wrapper {
          padding: 0;
          --vaadin-split-layout-splitter: {
            min-width: 0.4em;
            background: var(--paper-amber-200);
          }
        }

        .submission-page {
          width: 70vw;
        }

        .submission-page-card {
          width: 100%;
          margin: 0;
          padding: 0 0 2em 1em;
        }

        .submission-comments {
          overflow-y: hidden;
          padding: 0;
          margin: 0;
        }

        elmsln-loading {
          position: absolute;
          display: none;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.8);
          z-index: 10;
          align-items: flex-end;
          justify-content: center;
        }

        :host([saving]) elmsln-loading {
          display: block;
        }

        elmsln-loading {
          top: calc(50% - 5vmax);
          left: calc(50% - 5vmax);
          position: fixed;
          transform-origin: center center;
          width: 10vmax !important;
          height: 10vmax !important;
        }

        iron-pages {
          width: 100%;
        }

        paper-dialog {
          width: 50%;
          width: 50vmax;
          padding: 1em;
          z-index: 99999;
        }

        lrnapp-studio-submission-object {
          width: 100%;
        }

        .assignment-body {
          padding: 2em;
        }

        iron-icon {
          margin: 0.2em;
        }
      </style>

      <app-route
        route="{{route}}"
        pattern="/edit"
        tail="{{tail}}"
        active="{{editPage}}"
      >
      </app-route>

      <iron-ajax
        id="ajaxRequest"
        auto=""
        url="[[reqUrl]]"
        method="GET"
        params="[[reqParams]]"
        content-type="application/json"
        handle-as="json"
        on-response="_handleResponse"
      ></iron-ajax>
      <!-- Update Submission Node -->
      <iron-ajax
        id="ajaxUpdateRequest"
        url="[[reqUrl]]"
        method="PUT"
        body="[[submission]]"
        params="[[reqParams]]"
        content-type="application/json"
        handle-as="json"
        on-response="_handleUpdateResponse"
      ></iron-ajax>
      <!-- Delete Submission Node -->
      <iron-ajax
        id="ajaxDeleteRequest"
        url="[[reqUrl]]"
        method="DELETE"
        params="[[reqParams]]"
        content-type="application/json"
        handle-as="json"
        on-response="_handleDeleteResponse"
      ></iron-ajax>

      <app-toolbar class="amber lighten-3" hidden\$="[[hideMenuBar]]">
        <template is="dom-if" if="[[showComments]]">
          <lrnsys-button
            on-tap="_backToStudio"
            icon="arrow-back"
            label="See in studio"
            hover-class="amber darken-4 white-text"
          ></lrnsys-button>
        </template>
        <template is="dom-if" if="[[!showComments]]">
          <lrnsys-button
            on-tap="_backToKanban"
            icon="arrow-back"
            label="Back to project management"
            hover-class="amber darken-4 white-text"
          ></lrnsys-button>
        </template>
        <div spacer="" main-title="">[[submission.attributes.title]]</div>
        <div spacer="">
          <lrnsys-dialog
            raised
            header="[[submission.relationships.assignment.attributes.title]]"
          >
            <span slot="button"
              ><iron-icon icon="icons:assignment"></iron-icon>Assignment
              Details</span
            >
            <div class="assignment-body">
              <marked-element
                id="assignment-body"
                markdown="[[submission.relationships.assignment.attributes.body]]"
              ></marked-element>
            </div>
          </lrnsys-dialog>
        </div>
        <div>
          <paper-button
            id="comment-count"
            style="margin:0;padding:.25em;text-transform:none;"
          >
            <iron-icon icon="communication:forum"></iron-icon>
            [[submission.meta.comment_count]] Comments
          </paper-button>
          <paper-badge
            hidden\$="[[displayNewBadge(submission.meta.comment_new)]]"
            for="comment-count"
            label\$="[[submission.meta.comment_new]]"
          ></paper-badge>
        </div>
        <div hidden\$="[[editPage]]">
          <lrnsys-button
            on-tap="_setEditRoute"
            icon="create"
            label="Edit"
            hover-class="amber darken-4 white-text"
            hidden\$="[[!submission.meta.canUpdate]]"
          ></lrnsys-button>
        </div>
        <div hidden\$="[[!editPage]]">
          <lrnsys-button
            on-tap="_resetRoute"
            icon="cancel"
            label="Cancel"
            hover-class="amber darken-4 white-text"
            hidden\$="[[!submission.meta.canUpdate]]"
          ></lrnsys-button>
        </div>
      </app-toolbar>

      <vaadin-split-layout class="submission-page-wrapper">
        <div
          id="commentcolumn"
          class="submission-comments"
          style="min-width: 25%; max-width: 40%; width:30%;"
        >
          <template is="dom-if" if="[[showComments]]">
            <lrnsys-comment-list
              comment-ops-base="{{commentOpsBase}}"
              csrf-token="[[csrfToken]]"
              source-path="{{commentsUrl}}"
              create-stub-url="{{createStubUrl}}"
            ></lrnsys-comment-list>
          </template>
        </div>
        <div id="submissioncolumn" style="width:70%;">
          <lrnapp-studio-submission-object
            submission="{{submission}}"
            edit="[[editPage]]"
          ></lrnapp-studio-submission-object>
        </div>
        <iron-icon class="splitter-handle" icon="more-vert"></iron-icon>
      </vaadin-split-layout>

      <elmsln-loading></elmsln-loading>

      <paper-dialog id="deletedialog">
        <h2>Delete submission?</h2>
        <p>Are you sure you want to delete this submission?</p>
        <div class="buttons">
          <paper-button dialog-dismiss="">Cancel</paper-button>
          <paper-button dialog-confirm="" on-click="_submissionDeleteConfirmed"
            >Delete</paper-button
          >
        </div>
      </paper-dialog>
      <paper-dialog id="publishdialog">
        <h2>Ready to publish?</h2>
        <p>
          By publishing, the author of this submission will be able to view your
          feedback. Are you ready to publish?
        </p>
        <div class="buttons">
          <paper-button dialog-dismiss="">Cancel</paper-button>
          <paper-button dialog-confirm="" on-click="_submissionPublishConfirmed"
            >Yes Publish</paper-button
          >
        </div>
      </paper-dialog>

      <paper-toast id="toast"></paper-toast>
    `;
  }

  static get tag() {
    return "lrnapp-studio-submission-page";
  }

  static get properties() {
    return {
      id: {
        type: String
      },
      hideMenuBar: {
        type: Boolean,
        value: false
      },
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
      endPoint: {
        type: String
      },
      basePath: {
        type: String
      },
      csrfToken: {
        type: String
      },
      reqUrl: {
        type: String
      },
      reqParams: {
        type: Object
      },
      submission: {
        type: Object
      },
      commentsUrl: {
        type: String,
        computed: "_computeCommentsUrl(id, endPoint, csrfToken)"
      },
      createStubUrl: {
        type: String,
        computed: "_computeCommentsStubUrl(id, endPoint, csrfToken)"
      },
      commentOpsBase: {
        type: String,
        computed: "_computeCommentsOpsUrl(id, endPoint, csrfToken)"
      },
      editPage: {
        type: Boolean,
        reflectToAttribute: true
      },
      saving: {
        type: Boolean,
        value: false,
        notify: true,
        reflectToAttribute: true
      },
      showComments: {
        type: Boolean,
        computed: "_computeShowComments(submission)"
      }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    afterNextRender(this, function() {
      this.addEventListener(
        "submissionDeleteClicked",
        this._submissionDeleteClicked.bind(this)
      );
      this.addEventListener(
        "submissionPublishClicked",
        this._submissionPublishClicked.bind(this)
      );
      this.addEventListener(
        "submissionSaveDraftClicked",
        this._submissionSaveDraftClicked.bind(this)
      );
    });
  }
  disconnectedCallback() {
    this.removeEventListener(
      "submissionDeleteClicked",
      this._submissionDeleteClicked.bind(this)
    );
    this.removeEventListener(
      "submissionPublishClicked",
      this._submissionPublishClicked.bind(this)
    );
    this.removeEventListener(
      "submissionSaveDraftClicked",
      this._submissionSaveDraftClicked.bind(this)
    );
    super.disconnectedCallback();
  }

  static get observers() {
    return [
      "_urlVarsChanged(id, endPoint)",
      "_paramsChanged(csrfToken)",
      "_bodyChanged(title)"
    ];
  }

  /**
   * Go back to the studio relative to the app's path.
   */
  _backToStudio(e) {
    window.location.href = this.basePath + "lrnapp-open-studio";
  }

  /**
   * Go back to the studio relative to the app's path.
   */
  _backToKanban(e) {
    window.location.href = this.basePath + "lrnapp-studio-kanban";
  }

  /**
   * Trigger the page router to invoke edit state.
   */
  _setEditRoute(e) {
    this.set("route.path", "edit");
    this.notifyPath("route.path");
  }

  /**
   * Trigger the page router to invoke edit state.
   */
  _resetRoute(e) {
    this.set("route.path", "");
    this.notifyPath("route.path");
  }

  /**
   * if we should show new badge based on new comment count.
   */
  displayNewBadge(count) {
    if (count == 0) {
      return true;
    }
    return false;
  }

  _computeCommentsUrl(id, endPoint, csrfToken) {
    return endPoint + "/api/submissions/" + id + "/comments?token=" + csrfToken;
  }

  _computeCommentsOpsUrl(id, endPoint, csrfToken) {
    return endPoint + "/api/submissions/" + id + "/comments";
  }

  _computeCommentsStubUrl(id, endPoint, csrfToken) {
    return (
      endPoint +
      "/api/submissions/" +
      id +
      "/comments/create-stub?token=" +
      csrfToken
    );
  }

  _urlVarsChanged(id, endPoint) {
    this.reqUrl = endPoint + "/api/submissions/" + id;
  }

  _paramsChanged(csrfToken) {
    var params = this.reqParams || {};
    params.token = csrfToken;
    this.reqParams = params;
  }

  _handleResponse(data) {
    // empty response means no access or deleted item
    if (data.detail.response.data) {
      this.set("submission", []);
      this.set("submission", data.detail.response.data);
      microTask.run(() => {
        window.dispatchEvent(new Event("resize"));
      });
    }
  }

  _isReply(data) {
    this.thread = submission.relationships.comments.data.attributes.thread;
  }

  _submissionSaveDraftClicked(e) {
    this.saving = true;
    this.shadowRoot.querySelector("#ajaxUpdateRequest").generateRequest();
  }

  _submissionPublishClicked(e) {
    this.shadowRoot.querySelector("#publishdialog").open();
  }

  _submissionPublishConfirmed(e) {
    this.saving = true;
    this.shadowRoot.querySelector("#ajaxUpdateRequest").generateRequest();
  }

  _submissionDeleteClicked(e) {
    this.shadowRoot.querySelector("#deletedialog").open();
  }

  _submissionDeleteConfirmed(e) {
    this.saving = true;
    this.$.ajaxDeleteRequest.generateRequest();
  }

  _handleUpdateResponse(res) {
    var root = this;
    var status = res.detail.response.status;
    var submission = res.detail.response.data;
    root.saving = false;
    if (status === 200) {
      root.set("submission", {});
      root.set("submission", submission);
      root.set("route.path", "");
      // display a submission published notification
      if (submission.attributes.state === "submission_ready") {
        this.$.toast.show("Published!");
      }
      // @todo replace this with the page just being there once we fix the lazy load dilema
      window.location.href = this.endPoint + "/submissions/" + submission.id;
    }
  }

  _handleDeleteResponse(res) {
    var root = this;
    var status = res.detail.response.status;
    root.saving = false;
    if (status === 200) {
      window.location.href = this.basePath + "lrnapp-studio-kanban?deletetoast";
    }
  }

  _computeShowComments(submission) {
    try {
      var type = submission.meta.submissionType;
      if (
        type !== "critique" &&
        submission.attributes.state == "submission_ready"
      ) {
        return true;
      }
    } catch (error) {}
    return false;
  }

  /**
   * Simple way to convert from object to array.
   */
  _toArray(obj) {
    if (typeof obj === "object" && obj !== null) {
      return Object.keys(obj).map(function(key) {
        return obj[key];
      });
    }
    return [];
  }
}
window.customElements.define(
  LrnappStudioSubmissionPage.tag,
  LrnappStudioSubmissionPage
);
export { LrnappStudioSubmissionPage };
