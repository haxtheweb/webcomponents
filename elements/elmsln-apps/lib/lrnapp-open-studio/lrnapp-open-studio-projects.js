import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@lrnwebcomponents/lrnsys-button/lrnsys-button.js";
import "@polymer/polymer/lib/elements/dom-if.js";
import "@polymer/polymer/lib/elements/dom-repeat.js";
import "@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
import "@lrnwebcomponents/elmsln-apps/lib/lrnapp-studio-submission/lrnapp-studio-submission-display.js";
class LrnappOpenStudioProjects extends PolymerElement {
  static get template() {
    return html`
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
        h1.project-title {
          font-size: 2em;
        }
        h2.assignment-title {
          font-size: 1.5em;
          font-weight: bold;
          width: 100%;
          border-bottom: solid 1px grey;
        }
        .project-steps {
          display: flex;
          align-items: center;
        }
        .project-step {
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
          word-wrap: break-word;
        }
      </style>
      <template is="dom-if" if="[[!showSubmissions]]">
        <h1 class="empty-title black-text">
          Please select an Author and Project in order to review their portfolio
        </h1>
      </template>
      <template is="dom-if" if="[[showSubmissions]]">
        <h1 class="project-title black-text">
          [[activeProject.attributes.title]]
        </h1>
        <div class="project-steps">
          <template
            is="dom-repeat"
            items="[[activeProject.attributes.steps]]"
            as="assignment"
          >
            <lrnsys-button
              icon\$="[[_getSubmissionIcon(assignment.id)]]"
              icon-class\$="[[_getSubmissionClass(assignment.id)]]"
              on-click="_scrollToTarget"
              label="[[assignment.title]]"
              data-assignment-id\$="[[assignment.id]]"
              class="project-step"
              hover-class="blue white-text"
              raised=""
              hidden\$="[[!assignment.title]]"
            ></lrnsys-button>
          </template>
        </div>
        <template is="dom-repeat" items="[[renderSubmissions]]" as="submission">
          <a
            name="[[submission.relationships.assignment.title]]"
            class\$="assignment-[[submission.relationships.assignment.id]]"
            ><h2 class="assignment-title">
              [[submission.relationships.assignment.title]]
            </h2></a
          >
          <lrnapp-studio-submission-display
            submission="[[submission]]"
            class="ferpa-protect"
          ></lrnapp-studio-submission-display>
        </template>
      </template>
    `;
  }

  static get tag() {
    return "lrnapp-open-studio-projects";
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
      /**
       * The projects that exist so we can make other calls for data
       */
      projects: {
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
      /**
       * The renderSubmissions we kick to the screen
       */
      renderSubmissions: {
        type: Array,
        notify: true,
        computed:
          "_renderSubmissionsCompute(submissions, activeProject, activeAuthorId)"
      },
      activeProjectId: {
        type: String,
        reflectToAttribute: true,
        value: null
      },
      activeProject: {
        type: Object,
        computed: "_activeProjectCompute(activeProjectId, projects)"
      },
      activeAuthorId: {
        type: String,
        reflectToAttribute: true,
        value: null
      },
      showSubmissions: {
        type: Boolean,
        computed: "_showSubmissions(activeProjectId, activeAuthorId)",
        value: false
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
    };
  }

  _renderSubmissionsCompute(submissions, activeProject, activeAuthorId) {
    // if we don't have all three variables then we need to bail and set to null
    if (!submissions || !activeProject || !activeAuthorId) {
      return null;
    }
    let renderSubmissions = [];
    // make an array of parent assignment ids
    const parentAssignments = activeProject.attributes.steps.map(
      step => step.id
    );
    // filter the submissions by if they are listed in the active projects steps
    renderSubmissions = submissions.filter(submission => {
      return parentAssignments.includes(submission.relationships.assignment.id);
    });
    // sort render submissions by how the assignment steps are listed in the active project
    renderSubmissions.sort(function(a, b) {
      for (
        var index = 0;
        index < activeProject.attributes.steps.length;
        index++
      ) {
        if (
          activeProject.attributes.steps[index].id ==
          a.relationships.assignment.id
        ) {
          return -1;
        }
        if (
          activeProject.attributes.steps[index].id ==
          b.relationships.assignment.id
        ) {
          return 1;
        }
      }
      return 0;
    });
    return renderSubmissions;
  }
  _activeProjectCompute(activeProjectId, projects) {
    let activeProject = null;
    if (projects) {
      activeProject = projects.find(project => {
        return project.id === activeProjectId;
      });
    }
    return activeProject;
  }
  _showSubmissions(activeProjectId, activeAuthorId) {
    if (activeProjectId && activeAuthorId) {
      return true;
    }
    return false;
  }
  _getSubmissionIcon(id) {
    for (var index = 0; index < this.renderSubmissions.length; index++) {
      if (this.renderSubmissions[index].relationships.assignment.id == id) {
        return "check";
      }
    }
    return "assignment";
  }
  _getSubmissionClass(id) {
    for (var index = 0; index < this.renderSubmissions.length; index++) {
      if (this.renderSubmissions[index].relationships.assignment.id == id) {
        return "green-text text-darken-2";
      }
    }
    return "grey-text";
  }
  _scrollToTarget(e) {
    var local = e.target;
    // this will have the id of the current submission
    var active = local.getAttribute("data-assignment-id");
    if (this.shadowRoot.querySelector(".assignment-" + active)) {
      this.shadowRoot.querySelector(".assignment-" + active).scrollIntoView({
        block: "end",
        behavior: "smooth"
      });
    }
  }
  /**
   * Handle response for the whole projects object.
   */
  _handleResponse(event) {
    this.shadowRoot.querySelector("#loading").hidden = true;
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
  LrnappOpenStudioProjects.tag,
  LrnappOpenStudioProjects
);
export { LrnappOpenStudioProjects };
