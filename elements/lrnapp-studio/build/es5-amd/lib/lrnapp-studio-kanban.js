define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js",
  "../node_modules/@polymer/iron-ajax/iron-ajax.js",
  "../node_modules/@polymer/iron-list/iron-list.js",
  "../node_modules/@polymer/paper-card/paper-card.js",
  "../node_modules/@polymer/iron-icon/iron-icon.js",
  "../node_modules/@lrnwebcomponents/lrnsys-layout/lib/lrnsys-dialog.js",
  "../node_modules/@lrnwebcomponents/lrnsys-button/lrnsys-button.js"
], function(
  _polymerLegacy,
  _polymerDom,
  _ironAjax,
  _ironList,
  _paperCard,
  _ironIcon,
  _lrnsysDialog,
  _lrnsysButton
) {
  "use strict";
  function _templateObject_24342970f35811e88579db6f346321bd() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style include="materializecss-styles"></style>\n    <style>\n      :host {\n        display: block;\n      }\n      .projects-container {\n        display: block;\n        -webkit-box-align: center;\n        -ms-flex-align: center;\n        align-items: center;\n        -webkit-box-pack: start;\n        -ms-flex-pack: start;\n        justify-content: flex-start;\n        -webkit-box-align: start;\n        -ms-flex-align: start;\n        align-items: flex-start;\n        overflow-x: scroll;\n        height: 100vh;\n        width: 100%;\n      }\n      paper-button {\n        padding: 0;\n        margin: 0;\n        min-width: 16px;\n      }\n      .project-card {\n        width: 100%;\n        height: 100%;\n        min-height: 300px;\n        max-height: 400px;\n        min-width: 300px;\n        max-width: 400px;\n      }\n      .project-operations {\n        position: absolute;\n        top: 0;\n        right: 0;\n        padding: 16px;\n      }\n      .project-operations .operation {\n        display: inline-flex;\n      }\n      .assignment-row {\n        border: 1px solid #000000;\n        background-color: #FFFFFF;\n      }\n      .assignment-row .assignment-row-button.active {\n        background-color: var(--paper-amber-50);\n        font-weight: bold;\n      }\n      .assignment-row:hover .assignment-operations {\n        display: block;\n        overflow: visible;\n      }\n      .assignment-row-button {\n        width: 100%;\n        justify-content: flex-start;\n        height: 48px;\n        text-transform: none;\n      }\n      .assignment-operations {\n        position: absolute;\n        top: 0;\n        right: 0;\n        padding: 0;\n        display: none;\n      }\n      .assignment-operations.show {\n        display: block;\n        overflow: visible;\n      }\n      .assignment-operations .operation {\n        display: inline-flex;\n      }\n\n    </style>\n    <iron-ajax auto="" url="projects.json" last-response="{{projects}}" on-response="handleProjectResponse">\n    </iron-ajax>\n    <iron-ajax auto="" url="assignments.json" last-response="{{assignments}}" on-response="handleAssignmentResponse">\n    </iron-ajax>\n    <iron-list items="[[_toArray(projects)]]" as="project" class="projects-container" grid="">\n      <template class="projects-container-items">\n      <paper-card id$="project-[[project.id]]" class="project-card grey lighten-4" heading="{{project.title}}" elevation="2">\n        <div class="project-operations">\n          <lrnsys-dialog body-append="" id$="project-[[project.id]]-add" alt="Add assignment" class="circle operation" hover-class="amber lighten-2" header="Add assignment">\n            <iron-icon slot="button" icon="add"></iron-icon>\n            <div slot="content">\n              Add another assignment\n            </div>\n          </lrnsys-dialog>\n          <lrnsys-dialog body-append="" id$="project-[[project.id]]-delete" alt="Delete project!" class="circle operation" hover-class="red darken-2 white-text" header="Delete project!">\n            <iron-icon slot="button" icon="delete-forever"></iron-icon>\n            <div slot="content">\n              Delete form here\n            </div>\n          </lrnsys-dialog>\n        </div>\n        <div class="card-content">\n          <iron-list items="[[_toArray(assignments)]]" as="assignment">\n            <template>\n            <div class="assignment-row">\n              <lrnsys-dialog body-append="" on-focusin="assignmentFocusIn" class="assignment-row-button" id$="assignment-[[project.id]]-[[assignment.id]]" header="[[assignment.title]]" hover-class="amber lighten-5">\n                <span slot="button">\n                  <iron-icon icon="[[assignment.icon]]"></iron-icon>\n                  <span>[[assignment.title]]</span>\n                </span>\n                <div slot="content">\n                  Body of the assignment would go here\n                </div>\n              </lrnsys-dialog>\n              <span class="assignment-operations">\n                <lrnsys-button id$="assignment-[[project.id]]-[[assignment.id]]-add-critique" icon="editor:insert-comment" alt="Add critique" class="circle operation" hover-class="green lighten-2"></lrnsys-button>\n                <lrnsys-button id$="assignment-[[project.id]]-[[assignment.id]]-edit" icon="editor:mode-edit" alt="Edit" class="circle operation" hover-class="amber lighten-2"></lrnsys-button>\n                <lrnsys-button id$="assignment-[[project.id]]-[[assignment.id]]-delete" icon="delete" alt="Delete" class="circle operation" hover-class="red darken-2 white-text"></lrnsys-button>\n              </span>\n            </div>\n            </template>\n          </iron-list>\n        </div>\n      </paper-card>\n      </template>\n    </iron-list>\n'
      ],
      [
        '\n    <style include="materializecss-styles"></style>\n    <style>\n      :host {\n        display: block;\n      }\n      .projects-container {\n        display: block;\n        -webkit-box-align: center;\n        -ms-flex-align: center;\n        align-items: center;\n        -webkit-box-pack: start;\n        -ms-flex-pack: start;\n        justify-content: flex-start;\n        -webkit-box-align: start;\n        -ms-flex-align: start;\n        align-items: flex-start;\n        overflow-x: scroll;\n        height: 100vh;\n        width: 100%;\n      }\n      paper-button {\n        padding: 0;\n        margin: 0;\n        min-width: 16px;\n      }\n      .project-card {\n        width: 100%;\n        height: 100%;\n        min-height: 300px;\n        max-height: 400px;\n        min-width: 300px;\n        max-width: 400px;\n      }\n      .project-operations {\n        position: absolute;\n        top: 0;\n        right: 0;\n        padding: 16px;\n      }\n      .project-operations .operation {\n        display: inline-flex;\n      }\n      .assignment-row {\n        border: 1px solid #000000;\n        background-color: #FFFFFF;\n      }\n      .assignment-row .assignment-row-button.active {\n        background-color: var(--paper-amber-50);\n        font-weight: bold;\n      }\n      .assignment-row:hover .assignment-operations {\n        display: block;\n        overflow: visible;\n      }\n      .assignment-row-button {\n        width: 100%;\n        justify-content: flex-start;\n        height: 48px;\n        text-transform: none;\n      }\n      .assignment-operations {\n        position: absolute;\n        top: 0;\n        right: 0;\n        padding: 0;\n        display: none;\n      }\n      .assignment-operations.show {\n        display: block;\n        overflow: visible;\n      }\n      .assignment-operations .operation {\n        display: inline-flex;\n      }\n\n    </style>\n    <iron-ajax auto="" url="projects.json" last-response="{{projects}}" on-response="handleProjectResponse">\n    </iron-ajax>\n    <iron-ajax auto="" url="assignments.json" last-response="{{assignments}}" on-response="handleAssignmentResponse">\n    </iron-ajax>\n    <iron-list items="[[_toArray(projects)]]" as="project" class="projects-container" grid="">\n      <template class="projects-container-items">\n      <paper-card id\\$="project-[[project.id]]" class="project-card grey lighten-4" heading="{{project.title}}" elevation="2">\n        <div class="project-operations">\n          <lrnsys-dialog body-append="" id\\$="project-[[project.id]]-add" alt="Add assignment" class="circle operation" hover-class="amber lighten-2" header="Add assignment">\n            <iron-icon slot="button" icon="add"></iron-icon>\n            <div slot="content">\n              Add another assignment\n            </div>\n          </lrnsys-dialog>\n          <lrnsys-dialog body-append="" id\\$="project-[[project.id]]-delete" alt="Delete project!" class="circle operation" hover-class="red darken-2 white-text" header="Delete project!">\n            <iron-icon slot="button" icon="delete-forever"></iron-icon>\n            <div slot="content">\n              Delete form here\n            </div>\n          </lrnsys-dialog>\n        </div>\n        <div class="card-content">\n          <iron-list items="[[_toArray(assignments)]]" as="assignment">\n            <template>\n            <div class="assignment-row">\n              <lrnsys-dialog body-append="" on-focusin="assignmentFocusIn" class="assignment-row-button" id\\$="assignment-[[project.id]]-[[assignment.id]]" header="[[assignment.title]]" hover-class="amber lighten-5">\n                <span slot="button">\n                  <iron-icon icon="[[assignment.icon]]"></iron-icon>\n                  <span>[[assignment.title]]</span>\n                </span>\n                <div slot="content">\n                  Body of the assignment would go here\n                </div>\n              </lrnsys-dialog>\n              <span class="assignment-operations">\n                <lrnsys-button id\\$="assignment-[[project.id]]-[[assignment.id]]-add-critique" icon="editor:insert-comment" alt="Add critique" class="circle operation" hover-class="green lighten-2"></lrnsys-button>\n                <lrnsys-button id\\$="assignment-[[project.id]]-[[assignment.id]]-edit" icon="editor:mode-edit" alt="Edit" class="circle operation" hover-class="amber lighten-2"></lrnsys-button>\n                <lrnsys-button id\\$="assignment-[[project.id]]-[[assignment.id]]-delete" icon="delete" alt="Delete" class="circle operation" hover-class="red darken-2 white-text"></lrnsys-button>\n              </span>\n            </div>\n            </template>\n          </iron-list>\n        </div>\n      </paper-card>\n      </template>\n    </iron-list>\n'
      ]
    );
    _templateObject_24342970f35811e88579db6f346321bd = function _templateObject_24342970f35811e88579db6f346321bd() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_24342970f35811e88579db6f346321bd()
    ),
    is: "lrnapp-studio-kanban",
    properties: { activeAssignment: { type: String, value: null } },
    handleProjectResponse: function handleProjectResponse(response) {
      var root = this;
    },
    handleAssignmentResponse: function handleAssignmentResponse(response) {
      var root = this;
    },
    _toArray: function _toArray(obj) {
      return Object.keys(obj).map(function(key) {
        return obj[key];
      });
    },
    assignmentFocusIn: function assignmentFocusIn(e) {
      var root = this,
        normalizedEvent = (0, _polymerDom.dom)(e),
        local = normalizedEvent.localTarget;
      console.log(root.activeAssignment);
      console.log(local.id);
      if (null != root.activeAssignment && root.activeAssignment != local.id) {
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
});
