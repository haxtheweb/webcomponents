import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
import "hax-body-behaviors/hax-body-behaviors.js";
import "schema-behaviors/schema-behaviors.js";
/**
`task-list`
Visual listing of tasks with different design components that is
OER Schema capable!

@demo demo/index.html

@microcopy - the mental model for this element
 - task - a singular thing to accomplish

*/
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
    </style>
    <link property="oer:forComponent" content\$="[[relatedResource]]">
    <h2><span property="oer:name">[[name]]</span></h2>
    <ol>
      <template is="dom-repeat" items="[[tasks]]" as="task">
        <li><span property="oer:task">[[task.name]]</span></li>
      </template>
    </ol>
`,

  is: "task-list",

  behaviors: [
    HAXBehaviors.PropertiesBehaviors,
    MaterializeCSSBehaviors.ColorBehaviors,
    SchemaBehaviors.Schema
  ],

  hostAttributes: {
    typeof: "oer:SupportingMaterial"
  },

  observers: ["_valueChanged(tasks.*)"],

  properties: {
    /**
     * Name of this task list
     */
    name: {
      type: String,
      value: "Steps to completion"
    },
    /**
     * Related Resource ID
     */
    relatedResource: {
      type: String
    },
    /**
     * Task list
     */
    tasks: {
      type: Array,
      value: [],
      notify: true
    }
  },

  /**
   * Ensure the values change.
   */
  _valueChanged: function(e) {
    for (var i in e.base) {
      for (var j in e.base[i]) {
        this.notifyPath("tasks." + i + "." + j);
      }
    }
  },

  /**
   * Attached to the DOM, now fire.
   */
  attached: function() {
    // Establish hax property binding
    let props = {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Task list",
        description: "A list of tasks which is an ordered list",
        icon: "icons:list",
        color: "orange",
        groups: ["Content", "Instructional"],
        handles: [],
        meta: {
          author: "LRNWebComponents"
        }
      },
      settings: {
        quick: [
          {
            property: "name",
            title: "Name",
            description: "Name of the list",
            inputMethod: "textfield",
            icon: "editor:title"
          },
          {
            property: "relatedResource",
            title: "Related resource",
            description: "A reference to the related Schema resource",
            inputMethod: "textfield",
            icon: "editor:title"
          }
        ],
        configure: [
          {
            property: "name",
            title: "Name",
            description: "Name of the list",
            inputMethod: "textfield",
            icon: "editor:title"
          },
          {
            property: "relatedResource",
            title: "Related resource",
            description: "A reference to the related Schema resource",
            inputMethod: "textfield",
            icon: "editor:title"
          },
          {
            property: "tasks",
            title: "Tasks",
            description: "The tasks to be completed",
            inputMethod: "array",
            properties: [
              {
                property: "name",
                title: "Name",
                description: "Name of the task",
                inputMethod: "textfield",
                required: true
              },
              {
                property: "link",
                title: "Link",
                description: "Optional link",
                inputMethod: "textfield"
              }
            ]
          }
        ],
        advanced: []
      }
    };
    this.setHaxProperties(props);
  }
});
