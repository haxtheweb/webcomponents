import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import "@polymer/paper-button/paper-button.js";
import "@lrnwebcomponents/lrnsys-button/lrnsys-button.js";
import "@lrnwebcomponents/lrndesign-avatar/lrndesign-avatar.js";
import "@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
import "@lrnwebcomponents/elmsln-apps/lib/lrnapp-studio-submission/lrnapp-studio-submission-display.js";
Polymer({
  _template: html`
    <style include="materializecss-styles"></style>
    <style>
      :host {
        display: block;
        align-content: center;
      }
      #loading {
        width: 100%;
        z-index: 1000;
        opacity: 0.8;
        text-align: center;
        align-content: center;
        justify-content: center;
        height: 100vh;
        position: absolute;
        background-color: white;
      }
      h1.empty-title,
      h1.assignment-title {
        font-size: 2em;
      }
      .submission-title {
        font-size: 1em;
        font-weight: bold;
        width: 100%;
        margin-bottom: 2rem;
        text-transform: none;
      }
      .submission-list {
        display: flex;
        align-items: center;
      }
      .submission-list-item {
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        word-wrap: break-word;
      }
    </style>
    <template is="dom-if" if="[[!showSubmissions]]">
      <h1 class="empty-title black-text">
        Please select an Assignment in order to view all submissions
      </h1>
    </template>
    <template is="dom-if" if="[[showSubmissions]]">
      <h1 class="assignment-title black-text">
        [[activeAssignment.attributes.title]]
      </h1>
      <div class="submission-list">
        <template is="dom-repeat" items="[[submissions]]" as="submission">
          <lrnsys-button
            on-tap="_scrollToTarget"
            raised=""
            class="submission-list-item"
            button-class="submission-list-item"
            hover-class="blue white-text"
            data-submission-id\$="[[submission.id]]"
          >
            <span slot="button">
              <lrndesign-avatar
                src="[[submission.relationships.author.data.avatar]]"
                label="[[submission.relationships.author.data.name]]"
                style="display:inline-block;"
                data-submission-id\$="[[submission.id]]"
              ></lrndesign-avatar>
            </span>
            <span slot="label"
              >[[submission.relationships.author.data.display_name]]</span
            >
          </lrnsys-button>
        </template>
      </div>
      <template is="dom-repeat" items="[[submissions]]" as="submission">
        <lrnapp-studio-submission-display
          id\$="submission-[[submission.id]]"
          submission="[[submission]]"
          class="ferpa-protect"
        ></lrnapp-studio-submission-display>
        <a tabindex="-1"
          ><paper-button
            class="submission-title ferpa-protect"
            on-tap="_loadSubmissionUrl"
            data-submission-id\$="[[submission.id]]"
            >Tap to comment on[[submission.attributes.title]] by
            [[submission.relationships.author.data.display_name]]</paper-button
          ></a
        >
      </template>
    </template>
  `,
  is: "lrnapp-open-studio-assignments",
  properties: {
    /**
     * The assignments that exist so we can make other calls for data
     */
    assignments: {
      type: Array,
      notify: true
    },
    /**
     * The submissions that exist so we can make other calls for data
     */
    submissions: {
      type: Array,
      notify: true
    },
    activeAssignmentId: {
      type: String,
      reflectToAttribute: true,
      value: null,
      notify: true
    },
    activeAssignment: {
      type: Object,
      notify: true,
      computed: "_activeAssignmentCompute(activeAssignmentId, assignments)"
    },
    activeAuthorId: {
      type: String,
      reflectToAttribute: true,
      value: null,
      notify: true
    },
    showSubmissions: {
      type: Boolean,
      computed: "_showSubmissions(activeAssignmentId)",
      value: false,
      notify: true
    },
    /**
     * Endpoint for submission data.
     */
    sourcePath: {
      type: String,
      notify: true
    },
    /**
     * base path for the app
     */
    basePath: {
      type: String,
      notify: true
    }
  },
  /**
   * Handle tap on paper-button above to redirect to the correct submission url.
   */
  _loadSubmissionUrl: function(e) {
    let root = this;
    var normalizedEvent = dom(e);
    var local = normalizedEvent.localTarget;
    // this will have the id of the current submission
    var active = local.getAttribute("data-submission-id");
    // @todo need a cleaner integration but this at least goes the right place for now
    window.location.href =
      this.basePath + "lrnapp-studio-submission/submissions/" + active;
  },
  _activeAssignmentCompute: function(activeAssignmentId, assignments) {
    let activeAssignment = null;
    if (assignments) {
      activeAssignment = assignments.find(assignment => {
        return assignment.id == activeAssignmentId;
      });
    }
    return activeAssignment;
  },
  _showSubmissions: function(activeAssignmentId) {
    if (activeAssignmentId) {
      return true;
    }
    return false;
  },
  _scrollToTarget: function(e) {
    var normalizedEvent = dom(e);
    var local = normalizedEvent.localTarget;
    // this will have the id of the current submission
    var active = local.getAttribute("data-submission-id");
    this.shadowRoot
      .querySelector("#submission-" + active)
      .scrollIntoView({ block: "start", behavior: "smooth" });
  },
  /**
   * Handle response for the whole assignments object.
   */
  _handleResponse: function(event) {
    this.$.loading.hidden = true;
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
