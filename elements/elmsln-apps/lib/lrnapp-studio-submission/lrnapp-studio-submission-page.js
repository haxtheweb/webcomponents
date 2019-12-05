import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/app-route/app-route.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/app-layout/app-toolbar/app-toolbar.js";
import "@polymer/marked-element/marked-element.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/paper-dialog/paper-dialog.js";
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
/**
 * @deprecatedApply - required for @apply / invoking @apply css var convention
 */
import "@polymer/polymer/lib/elements/custom-style.js";

class LrnappStudioSubmissionPage extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
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
      `
    ];
  }
  render() {
    return html`
      <custom-style>
        <style>
          .submission-page-wrapper {
            --vaadin-split-layout-splitter: {
              min-width: 0.4em;
              background: var(--paper-amber-200);
            }
          }
        </style>
      </custom-style>
      <app-route
        .route="${this.route}"
        @route-changed="${this.routeChangedEvent}"
        .tail="${this.tail}"
        @tail-changed="${this.tailChangedEvent}"
        pattern="/edit"
        .active="${this.editPage}"
        @active-changed="${this.editPageChangedEvent}"
      >
      </app-route>

      <iron-ajax
        id="ajaxRequest"
        auto=""
        url="${this.reqUrl}"
        method="GET"
        params="${this.reqParams}"
        content-type="application/json"
        handle-as="json"
        @response="${this._handleResponse}"
      ></iron-ajax>
      <!-- Update Submission Node -->
      <iron-ajax
        id="ajaxUpdateRequest"
        url="${this.reqUrl}"
        method="PUT"
        .body="${this.submission}"
        params="${this.reqParams}"
        content-type="application/json"
        handle-as="json"
        @response="${this._handleUpdateResponse}"
      ></iron-ajax>
      <!-- Delete Submission Node -->
      <iron-ajax
        id="ajaxDeleteRequest"
        url="${this.reqUrl}"
        method="DELETE"
        params="${this.reqParams}"
        content-type="application/json"
        handle-as="json"
        @response="${this._handleDeleteResponse}"
      ></iron-ajax>

      <app-toolbar class="amber lighten-3" ?hidden="${this.hideMenuBar}">
        ${this.showComments
          ? html`
              <lrnsys-button
                @click="${this._backToStudio}"
                icon="arrow-back"
                label="See in studio"
                hover-class="amber darken-4 white-text"
              ></lrnsys-button>
            `
          : html`
              <lrnsys-button
                @click="${this._backToKanban}"
                icon="arrow-back"
                label="Back to project management"
                hover-class="amber darken-4 white-text"
              ></lrnsys-button>
            `}
        <div spacer="" main-title="">${this.submission.attributes.title}</div>
        <div spacer="">
          <lrnsys-dialog
            raised
            header="${this.submission.relationships.assignment.attributes
              .title}"
          >
            <span slot="button"
              ><iron-icon icon="icons:assignment"></iron-icon>Assignment
              Details</span
            >
            <div class="assignment-body">
              <marked-element
                id="assignment-body"
                markdown="${this.submission.relationships.assignment.attributes
                  .body}"
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
            ${this.submission.meta.comment_count} Comments
          </paper-button>
          <paper-badge
            ?hidden="${this.displayNewBadge(this.submission.meta.comment_new)}"
            for="comment-count"
            label="${this.submission.meta.comment_new}"
          ></paper-badge>
        </div>
        <div ?hidden="${this.editPage}">
          <lrnsys-button
            @click="${this._setEditRoute}"
            icon="create"
            label="Edit"
            hover-class="amber darken-4 white-text"
            ?hidden="${!this.submission.meta.canUpdate}"
          ></lrnsys-button>
        </div>
        <div ?hidden="${!this.editPage}">
          <lrnsys-button
            @click="${this._resetRoute}"
            icon="cancel"
            label="Cancel"
            hover-class="amber darken-4 white-text"
            ?hidden="${!this.submission.meta.canUpdate}"
          ></lrnsys-button>
        </div>
      </app-toolbar>

      <vaadin-split-layout class="submission-page-wrapper">
        <div
          id="commentcolumn"
          class="submission-comments"
          style="min-width: 25%; max-width: 40%; width:30%;"
        >
          ${this.showComments
            ? html`
                <lrnsys-comment-list
                  comment-ops-base="${this.commentOpsBase}"
                  csrf-token="${this.csrfToken}"
                  source-path="${this.commentsUrl}"
                  create-stub-url="${this.createStubUrl}"
                ></lrnsys-comment-list>
              `
            : ``}
        </div>
        <div id="submissioncolumn" style="width:70%;">
          <lrnapp-studio-submission-object
            .submission="${this.submission}"
            edit="${this.editPage}"
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
          <paper-button
            dialog-confirm=""
            @click="${this._submissionDeleteConfirmed}"
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
          <paper-button
            dialog-confirm=""
            @click="${this._submissionPublishConfirmed}"
            >Yes Publish</paper-button
          >
        </div>
      </paper-dialog>

      <paper-toast id="toast"></paper-toast>
    `;
  }
  constructor() {
    super();
    this.hideMenuBar = false;
    this.saving = false;
    setTimeout(() => {
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
    }, 0);
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
        type: Boolean
      },
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
        type: String
      },
      createStubUrl: {
        type: String
      },
      commentOpsBase: {
        type: String
      },
      editPage: {
        type: Boolean,
        reflect: true
      },
      saving: {
        type: Boolean,
        reflect: true
      },
      showComments: {
        type: Boolean
      }
    };
  }
  editPageChangedEvent(e) {
    this.editPage = e.detail.value;
  }
  routeChangedEvent(e) {
    this.route = { ...e.detail.value };
  }
  tailChangedEvent(e) {
    this.tail = e.detail.value;
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (["id", "endPoint"].includes(propName)) {
        this._urlVarsChanged(this.id, this.endPoint);
      }
      if (propName == "csrfToken") {
        this._paramsChanged(this[propName]);
      }
      if (propName == "title") {
        this._bodyChanged(this[propName]);
      }
      if (propName == "submission") {
        this.showComments = this._computeShowComments(this[propName]);
      }
      if (["id", "endPoint", "csrfToken"].includes(propName)) {
        this.commentsUrl = this._computeCommentsUrl(
          this.id,
          this.endPoint,
          this.csrfToken
        );
        this.createStubUrl = this._computeCommentsStubUrl(
          this.id,
          this.endPoint,
          this.csrfToken
        );
        this.commentOpsBase = this._computeCommentsOpsUrl(
          this.id,
          this.endPoint,
          this.csrfToken
        );
      }
      let notifiedProps = ["saving"];
      if (notifiedProps.includes(propName)) {
        // notify
        let eventName = `${propName
          .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2")
          .toLowerCase()}-changed`;
        this.dispatchEvent(
          new CustomEvent(eventName, {
            detail: {
              value: this[propName]
            }
          })
        );
      }
    });
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
    this.route.path = "edit";
    this.route = { ...this.route };
  }

  /**
   * Trigger the page router to invoke edit state.
   */
  _resetRoute(e) {
    this.route.path = "";
    this.route = { ...this.route };
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
      this.submission = { ...data.detail.response.data };
      window.dispatchEvent(new Event("resize"));
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
    this.shadowRoot.querySelector("#ajaxDeleteRequest").generateRequest();
  }

  _handleUpdateResponse(res) {
    var status = res.detail.response.status;
    var submission = res.detail.response.data;
    this.saving = false;
    if (status === 200) {
      this.submission = { ...submission };
      let attr = this.route;
      attr.path = "";
      this.route = { ...attr };
      // display a submission published notification
      if (submission.attributes.state === "submission_ready") {
        this.shadowRoot.querySelector("#toast").show("Published!");
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
