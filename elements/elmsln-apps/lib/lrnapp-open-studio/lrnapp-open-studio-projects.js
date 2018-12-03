Polymer({
  _template: `
    <style include="materializecss-styles"></style>
    <style>
      :host {
        display: block;
        align-content: center;
      }
      #loading {
        width: 100%;
        z-index: 1000;
        opacity: .8;
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
      <h1 class="empty-title black-text">Please select an Author and Project in order to review their portfolio</h1>
    </template>
    <template is="dom-if" if="[[showSubmissions]]">
      <h1 class="project-title black-text">[[activeProject.attributes.title]]</h1>
      <div class="project-steps">
        <template is="dom-repeat" items="[[activeProject.attributes.steps]]" as="assignment">
          <lrnsys-button icon\$="[[_getSubmissionIcon(assignment.id)]]" icon-class\$="[[_getSubmissionClass(assignment.id)]]" on-tap="_scrollToTarget" label="[[assignment.title]]" data-assignment-id\$="[[assignment.id]]" class="project-step" hover-class="blue white-text" raised="" hidden\$="[[!assignment.title]]"></lrnsys-button>
        </template>
      </div>
      <template is="dom-repeat" items="[[renderSubmissions]]" as="submission">
        <a name="[[submission.relationships.assignment.title]]" class\$="assignment-[[submission.relationships.assignment.id]]"><h2 class="assignment-title">[[submission.relationships.assignment.title]]</h2></a>
        <lrnapp-studio-submission-display submission="[[submission]]" class="ferpa-protect"></lrnapp-studio-submission-display>
      </template>
    </template>
`,

  is: 'lrnapp-open-studio-projects',

  properties: {
    /**
     * The projects that exist so we can make other calls for data
     */
    projects: {
      type: Array,
      notify: true,
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
      computed: '_renderSubmissionsCompute(submissions, activeProject, activeAuthorId)'
    },
    activeProjectId: {
      type: String,
      reflectToAttribute: true,
      value: null,
    },
    activeProject: {
      type: Object,
      computed: '_activeProjectCompute(activeProjectId, projects)'
    },
    activeAuthorId: {
      type: String,
      reflectToAttribute: true,
      value: null,
    },
    showSubmissions: {
      type: Boolean,
      computed: '_showSubmissions(activeProjectId, activeAuthorId)',
      value: false
    },
    /**
     * Endpoint for submission data.
     */
    sourcePath: {
      type: String,
      notify: true,
    },
    /**
     * base path for the app
     */
    basePath: {
      type: String,
      notify: true,
    }
  },

  _renderSubmissionsCompute: function (submissions, activeProject, activeAuthorId) {
    // if we don't have all three variables then we need to bail and set to null
    if (!submissions || !activeProject || !activeAuthorId) {
      return null;
    }
    let renderSubmissions = [];
    // make an array of parent assignment ids
    const parentAssignments = activeProject.attributes.steps.map(step => step.id);
    // filter the submissions by if they are listed in the active projects steps
    renderSubmissions = submissions.filter(submission => {
      return parentAssignments.includes(submission.relationships.assignment.id);
    });
    // sort render submissions by how the assignment steps are listed in the active project
    renderSubmissions.sort(
      function(a, b)
      {
        for (index = 0; index < activeProject.attributes.steps.length; index++) {
          if (activeProject.attributes.steps[index].id == a.relationships.assignment.id) {
            return -1;
          }
          if (activeProject.attributes.steps[index].id == b.relationships.assignment.id) {
            return 1;
          }
        }
        return 0;
      }
    );
    return renderSubmissions;
  },

  _activeProjectCompute: function (activeProjectId, projects) {
    let activeProject = null;
    if (projects) {
      activeProject = projects.find(project => {
        return project.id === activeProjectId;
      });
    }
    return activeProject;
  },

  _showSubmissions: function (activeProjectId, activeAuthorId) {
    if (activeProjectId && activeAuthorId) {
      return true;
    }
    return false;
  },

  _getSubmissionIcon: function(id) {
    for (var index = 0; index < this.renderSubmissions.length; index++) {
      if (this.renderSubmissions[index].relationships.assignment.id == id) {
        return 'check';
      }
    }
    return 'assignment';
  },

  _getSubmissionClass: function(id) {
    for (var index = 0; index < this.renderSubmissions.length; index++) {
      if (this.renderSubmissions[index].relationships.assignment.id == id) {
        return 'green-text text-darken-2';
      }
    }
    return 'grey-text';
  },

  _scrollToTarget: function(e) {
    var normalizedEvent = dom(e);
    var local = normalizedEvent.localTarget;
    // this will have the id of the current submission
    var active = local.getAttribute('data-assignment-id');
    this.shadowRoot.querySelector('.assignment-' + active).scrollIntoView({block: "end", behavior: "smooth"});
  },

  /**
   * Handle response for the whole projects object.
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
