import { LitElement, html, css } from "lit-element/lit-element.js";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
/**
 * `task-list`
 * Visual listing of tasks with different design components that is
 * OER Schema capable!
 * @demo demo/index.html
 * @microcopy - the mental model for this element
 * - task - a singular thing to accomplish
 * @element task-list
 */
class TaskList extends SchemaBehaviors(LitElement) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          border: var(--task-list-border, 1px solid #eeeeee);
          font-size: var(--task-list-font-size, 18px);
          padding: var(--task-list-padding, 16px);
        }
      `,
    ];
  }
  render() {
    return html`
      <h3><span property="oer:name">${this.name}</span></h3>
      <ol>
        ${this.tasks.map(
          (task) => html`
            <li>
              ${task.link
                ? html`
                    <a href="${task.link}" property="oer:task">${task.name}</a>
                  `
                : html` <span property="oer:task">${task.name}</span> `}
            </li>
          `
        )}
      </ol>
    `;
  }

  static get tag() {
    return "task-list";
  }
  static get properties() {
    return {
      ...super.properties,
      /**
       * Name of this task list
       */
      name: {
        type: String,
      },
      /**
       * Related Resource ID
       */
      relatedResource: {
        type: String,
        attribute: "related-resource",
      },
      /**
       * Task list
       */
      tasks: {
        type: Array,
      },
      _resourceLink: {
        type: Object,
      },
    };
  }
  constructor() {
    super();
    this.tasks = [];
    this.name = "Steps to completion";
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      let notifiedProps = ["tasks"];
      if (notifiedProps.includes(propName)) {
        // notify
        let eventName = `${propName
          .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2")
          .toLowerCase()}-changed`;
        this.dispatchEvent(
          new CustomEvent(eventName, {
            detail: {
              value: this[propName],
            },
          })
        );
      }
      if (propName == "relatedResource") {
        this._resourceLink = this._generateResourceLink(this[propName]);
      }
    });
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
  firstUpdated() {
    setTimeout(() => {
      this.setAttribute("typeof", "oer:SupportingMaterial");
    }, 0);
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
          author: "ELMS:LN",
        },
      },
      settings: {
        quick: [
          {
            property: "name",
            title: "Name",
            description: "Name of the list",
            inputMethod: "textfield",
            icon: "editor:title",
          },
          {
            property: "relatedResource",
            title: "Related resource",
            description: "A reference to the related Schema resource",
            inputMethod: "textfield",
            icon: "editor:title",
          },
        ],
        configure: [
          {
            property: "name",
            title: "Name",
            description: "Name of the list",
            inputMethod: "textfield",
            icon: "editor:title",
          },
          {
            property: "relatedResource",
            title: "Related resource",
            description: "A reference to the related Schema resource",
            inputMethod: "textfield",
            icon: "editor:title",
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
                required: true,
              },
              {
                property: "link",
                title: "Link",
                description: "Optional link",
                inputMethod: "textfield",
              },
            ],
          },
        ],
        advanced: [],
      },
      saveOptions: {
        unsetAttributes: ["_resource-link"],
      },
    };
  }
}
window.customElements.define(TaskList.tag, TaskList);
export { TaskList };
