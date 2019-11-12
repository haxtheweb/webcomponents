import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import "@polymer/polymer/lib/elements/dom-repeat.js";
import "@polymer/polymer/lib/elements/dom-if.js";
/**
 * `task-list`
 * Visual listing of tasks with different design components that is
 * OER Schema capable!
 * @demo demo/index.html
 * @microcopy - the mental model for this element
 * - task - a singular thing to accomplish
 */
class TaskList extends SchemaBehaviors(PolymerElement) {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          border: var(--task-list-border, 1px solid #eeeeee);
          font-size: var(--task-list-font-size, 18px);
          padding: var(--task-list-padding, 16px);
        }
      </style>
      <h3><span property="oer:name">[[name]]</span></h3>
      <ol>
        <template is="dom-repeat" items="[[tasks]]" as="task">
          <li>
            <template is="dom-if" if="[[task.link]]">
              <a href="[[task.link]]" property="oer:task">[[task.name]]</a>
            </template>
            <template is="dom-if" if="[[!task.link]]">
              <span property="oer:task">[[task.name]]</span>
            </template>
          </li>
        </template>
      </ol>
    `;
  }

  static get tag() {
    return "task-list";
  }
  static get observers() {
    return ["_valueChanged(tasks.*)"];
  }
  static get properties() {
    return {
      ...super.properties,

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
      },
      _resourceLink: {
        type: Object,
        computed: "_generateResourceLink(relatedResource)"
      }
    };
  }
  _generateResourceLink(relatedResource) {
    if (this._resourceLink) {
      document.head.removeChild(this._resourceLink);
    }
    let link = document.createElement("link");
    link.setAttribute("property", "oer:forComponent");
    link.setAttribute("content", relatedResource);
    document.head.appendChild(link);
    return link;
  }
  /**
   * Ensure the values change.
   */
  _valueChanged(e) {
    for (var i in e.base) {
      for (var j in e.base[i]) {
        this.notifyPath("tasks." + i + "." + j);
      }
    }
  }
  /**
   * Attached to the DOM, now fire.
   */
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("typeof", "oer:SupportingMaterial");
  }
  static get haxProperties() {
    return {
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
            itemLabel: "label",
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
      },
      saveOptions: {
        unsetAttributes: ["_resource-link"]
      }
    };
  }
}
window.customElements.define(TaskList.tag, TaskList);
export { TaskList };
