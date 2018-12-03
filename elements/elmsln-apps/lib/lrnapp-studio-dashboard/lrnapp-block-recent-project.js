Polymer({
  _template: `
    <style include="materializecss-styles"></style>
    <style include="paper-item-styles">
      :host {
        display: block;
      }
      #loading {
        width: 100%;
        z-index: 1000;
        opacity: .8;
        text-align: center;
        align-content: center;
        justify-content: center;
        background-color: white;
      }
      paper-button {
        padding: 0;
        margin: 0;
        min-width: 1rem;
        text-transform: unset;
      }
      .project-card {
        width: 100%;
        min-width: 15em;
        max-width: 20em;
        margin: 0 1em;
      }
      .button-contents {
        display: flex;
        align-content: center;
      }
      .assignment-row {
        border: 1px solid #000000;
        background-color: #FFFFFF;
      }
      .assignment-row .assignment-row-button.active {
        background-color: var(--paper-amber-50);
        font-weight: bold;
      }
      .assignment-row:hover .assignment-operations {
        display: block;
        overflow: visible;
        margin: .2em;
      }
      .assignment-row-button {
        width: 100%;
        justify-content: flex-start;
        height: 3em;
        text-transform: none;
      }
      .assignment-title {
        display: inline-flex;
        align-items: center;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1em;
      }
      .status-indicator {
        border-right: 1px solid grey;
        padding: .5em;
        margin: 0 .5em 0 0;
        display: inline-flex;
        line-height: 3em;
        height: 3em;
        justify-content: center;
        align-items: center;
      }
      .whole-project {
        width: 100%;
        margin: 0;
        padding: 0;
      }
    </style>
    <iron-ajax auto="" url="{{sourcePath}}" handle-as="json" last-response="{{response}}" on-response="handleResponse"></iron-ajax>
    <div id="loading">
      <h3>Loading..</h3>
      <elmsln-loading color="grey-text" size="large"></elmsln-loading>
    </div>
    <template is="dom-if" if="[[hasProject]]">
    <a tabindex="-1" href\$="[[basePath]]lrnapp-studio-kanban">
      <paper-button class="whole-project ferpa-protect">
        <paper-card id\$="project-[[project.id]]" class="project-card grey lighten-3" heading="{{project.attributes.title}}" elevation="2">
          <div class="card-content">
            <iron-list items="[[_toArray(project.relationships.assignments)]]" as="assignment">
              <template>
              <div class="assignment-row" id="assignment">
                <lrnsys-button inner-class="no-left-padding" class="assignment-row-button" button-class="assignment-row-button" id\$="assignment-[[project.id]]-[[assignment.id]]" hover-class="amber lighten-5" href\$="[[basePath]]lrnapp-studio-kanban">
                  <span slot="button" class="button-contents">
                    <div class\$="status-indicator [[assignment.metadata.relatedSubmissions.complete.color]]">
                      <iron-icon icon="[[assignment.metadata.relatedSubmissions.complete.icon]]"></iron-icon>
                    </div>
                    <div class="assignment-title">[[assignment.title]]</div>
                  </span>
                </lrnsys-button>
              </div>
              </template>
            </iron-list>
          </div>
        </paper-card>
      </paper-button>
    </a>
    </template>
    <template is="dom-if" if="[[!hasProject]]">
    <lrnsys-button inner-class="no-left-padding" button-class="assignment-row-button" class="assignment-row-button" href\$="[[basePath]]lrnapp-studio-kanban" hover-class="amber lighten-5">
      <span slot="button" class="button-contents">
        <div class="status-indicator">
          <iron-icon icon="assignment"></iron-icon>
        </div>
        <div class="assignment-title">Tap to start your first project!</div>
      </span>
    </lrnsys-button>
    </template>
`,

  is: 'lrnapp-block-recent-project',

  properties: {
    sourcePath: {
      type: String,
      notify: true,
    },
    response: {
      type: Object,
      notify: true,
    },
    project: {
      type: Object,
      notify: true,
    },
    hasProject: {
      type: Boolean,
      notify: true,
      reflectToAttribute: true,
      computed: '_getHasProject(project)',
    },
  },

  /**
   * Generate the correct boolean for having a project.
   */
  _getHasProject: function(project) {
    if (typeof project.id !== typeof undefined) {
      return true;
    }
    return false;
  },

  /**
   * Swap off the loading with project data.
   */
  handleResponse: function(e) {
    this.$.loading.hidden = true;
    this.project = this.response.data;
  },

  /**
   * Generate an array.
   */
  _toArray: function(obj) {
    return Object.keys(obj).map(function(key) {
      return obj[key];
    });
  }
});
