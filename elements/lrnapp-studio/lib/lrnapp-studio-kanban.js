import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
Polymer({
  _template: html`
    <style include="materializecss-styles"></style>
    <style>
      :host {
        display: block;
      }
      .projects-container {
        display: block;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: start;
        -ms-flex-pack: start;
        justify-content: flex-start;
        -webkit-box-align: start;
        -ms-flex-align: start;
        align-items: flex-start;
        overflow-x: scroll;
        height: 100vh;
        width: 100%;
      }
      paper-button {
        padding: 0;
        margin: 0;
        min-width: 16px;
      }
      .project-card {
        width: 100%;
        height: 100%;
        min-height: 300px;
        max-height: 400px;
        min-width: 300px;
        max-width: 400px;
      }
      .project-operations {
        position: absolute;
        top: 0;
        right: 0;
        padding: 16px;
      }
      .project-operations .operation {
        display: inline-flex;
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
      }
      .assignment-row-button {
        width: 100%;
        justify-content: flex-start;
        height: 48px;
        text-transform: none;
      }
      .assignment-operations {
        position: absolute;
        top: 0;
        right: 0;
        padding: 0;
        display: none;
      }
      .assignment-operations.show {
        display: block;
        overflow: visible;
      }
      .assignment-operations .operation {
        display: inline-flex;
      }

    </style>
    <iron-ajax auto="" url="projects.json" last-response="{{projects}}" on-response="handleProjectResponse">
    </iron-ajax>
    <iron-ajax auto="" url="assignments.json" last-response="{{assignments}}" on-response="handleAssignmentResponse">
    </iron-ajax>
    <iron-list items="[[_toArray(projects)]]" as="project" class="projects-container" grid="">
      <template class="projects-container-items">
      <paper-card id\$="project-[[project.id]]" class="project-card grey lighten-4" heading="{{project.title}}" elevation="2">
        <div class="project-operations">
          <lrnsys-dialog body-append="" id\$="project-[[project.id]]-add" alt="Add assignment" class="circle operation" hover-class="amber lighten-2" header="Add assignment">
            <iron-icon slot="button" icon="add"></iron-icon>
            <div slot="content">
              Add another assignment
            </div>
          </lrnsys-dialog>
          <lrnsys-dialog body-append="" id\$="project-[[project.id]]-delete" alt="Delete project!" class="circle operation" hover-class="red darken-2 white-text" header="Delete project!">
            <iron-icon slot="button" icon="delete-forever"></iron-icon>
            <div slot="content">
              Delete form here
            </div>
          </lrnsys-dialog>
        </div>
        <div class="card-content">
          <iron-list items="[[_toArray(assignments)]]" as="assignment">
            <template>
            <div class="assignment-row">
              <lrnsys-dialog body-append="" on-focusin="assignmentFocusIn" class="assignment-row-button" id\$="assignment-[[project.id]]-[[assignment.id]]" header="[[assignment.title]]" hover-class="amber lighten-5">
                <span slot="button">
                  <iron-icon icon="[[assignment.icon]]"></iron-icon>
                  <span>[[assignment.title]]</span>
                </span>
                <div slot="content">
                  Body of the assignment would go here
                </div>
              </lrnsys-dialog>
              <span class="assignment-operations">
                <lrnsys-button id\$="assignment-[[project.id]]-[[assignment.id]]-add-critique" icon="editor:insert-comment" alt="Add critique" class="circle operation" hover-class="green lighten-2"></lrnsys-button>
                <lrnsys-button id\$="assignment-[[project.id]]-[[assignment.id]]-edit" icon="editor:mode-edit" alt="Edit" class="circle operation" hover-class="amber lighten-2"></lrnsys-button>
                <lrnsys-button id\$="assignment-[[project.id]]-[[assignment.id]]-delete" icon="delete" alt="Delete" class="circle operation" hover-class="red darken-2 white-text"></lrnsys-button>
              </span>
            </div>
            </template>
          </iron-list>
        </div>
      </paper-card>
      </template>
    </iron-list>
`,

  is: "lrnapp-studio-kanban",

  properties: {
    /**
     * Tracks the active assignment.
     */
    activeAssignment: {
      type: String,
      value: null
    }
  },

  handleProjectResponse: function(response) {
    let root = this;
  },

  handleAssignmentResponse: function(response) {
    let root = this;
  },

  /*
   * Simple way to convert from object to array.
   */
  _toArray: function(obj) {
    return Object.keys(obj).map(function(key) {
      return obj[key];
    });
  },

  /**
   * Handle toggle for mouse class and manage classList array for paper-button.
   */
  assignmentFocusIn: function(e) {
    let root = this;
    var normalizedEvent = dom(e);
    var local = normalizedEvent.localTarget;
    console.log(root.activeAssignment);
    console.log(local.id);
    if (root.activeAssignment != null && root.activeAssignment != local.id) {
      root.shadowRoot
        .querySelector("#" + root.activeAssignment)
        .nextElementSibling.classList.remove("show");
      root.shadowRoot
        .querySelector("#" + root.activeAssignment)
        .classList.remove("active");
    }
    root.activeAssignment = local.id;
    local.nextElementSibling.classList.add("show");
    local.classList.add("active");
  }
});
