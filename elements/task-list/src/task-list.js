import { LitElement, html, css } from "lit-element/lit-element.js";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import { ReplaceWithPolyfill } from "@lrnwebcomponents/utils/utils.js";
if (!Element.prototype.replaceWith) {
  Element.prototype.replaceWith = ReplaceWithPolyfill;
}
if (!CharacterData.prototype.replaceWith) {
  CharacterData.prototype.replaceWith = ReplaceWithPolyfill;
}
if (!DocumentType.prototype.replaceWith) {
  DocumentType.prototype.replaceWith = ReplaceWithPolyfill;
}
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
      <div id="wrapper">
        <h3 id="name" property="oer:name" ?contenteditable="${this.editMode}">
          ${this.name}
        </h3>
        <ol ?contenteditable="${this.editMode}" id="tasks">
          ${this.tasks.map(
            (task) => html`
              <li>
                ${task.link
                  ? html`
                      <a href="${task.link}" property="oer:task"
                        >${task.name}</a
                      >
                    `
                  : html` <span property="oer:task">${task.name}</span> `}
              </li>
            `
          )}
        </ol>
      </div>
    `;
  }
  /**
   * Implements haxHooks to tie into life-cycle if hax exists.
   */
  haxHooks() {
    return {
      activeElementChanged: "haxactiveElementChanged",
      inlineContextMenu: "haxinlineContextMenu",
    };
  }
  /**
   * double-check that we are set to inactivate click handlers
   * this is for when activated in a duplicate / adding new content state
   */
  haxactiveElementChanged(el, val) {
    // flag for HAX to not trigger active on changes
    let ignoreAlign = false;
    if (this.__thereAreChanges) {
      this.alignState();
      ignoreAlign = true;
    }
    this.editMode = val;
    return ignoreAlign;
  }
  alignState() {
    // make a clone so we can completely clean up the state here
    const clone = this.cloneNode();
    // easy, name is flat
    clone.name = this.shadowRoot.querySelector("#name").innerText;
    const tasks = this.shadowRoot.querySelector("#tasks");
    // update tasks
    clone.tasks = this.getChildOutline(tasks);
    // there are no longer changes
    clone.__thereAreChanges = false;
    clone.editMode = false;
    this.replaceWith(clone);
    this.remove();
  }
  haxinlineContextMenu(ceMenu) {
    ceMenu.ceButtons = [
      {
        icon: "icons:add",
        callback: "haxClickInlineAdd",
        label: "Add task",
      },
      {
        icon: "icons:remove",
        callback: "haxClickInlineRemove",
        label: "Remove task",
      },
    ];
  }
  haxClickInlineAdd(e) {
    let d = this.tasks;
    d.push({ name: "Do this" });
    this.tasks = [...d];
    return true;
  }
  haxClickInlineRemove(e) {
    if (this.tasks.length > 0) {
      let d = this.tasks;
      d.pop();
      this.tasks = [...d];
      return true;
    }
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
        reflect: true,
      },
      editMode: {
        type: Boolean,
        reflect: true,
        attribute: "edit-mode",
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
  alignState() {
    // make a clone so we can completely clean up the state here
    const clone = this.cloneNode();
    // easy, name is flat
    clone.name = this.shadowRoot.querySelector("#name").innerText;
    const tasks = this.shadowRoot.querySelector("#tasks");
    // update tasks
    clone.tasks = this.getChildOutline(tasks);
    // there are no longer changes
    clone.__thereAreChanges = false;
    clone.editMode = false;
    this.replaceWith(clone);
    this.remove();
  }
  /**
   * get a list of items as an array
   */
  getChildOutline(taskList) {
    let items = [];
    while (taskList.firstElementChild !== null) {
      // only work on things if they are valid HTML nodes
      if (typeof taskList.firstElementChild.tagName !== typeof undefined) {
        const task = taskList.firstElementChild;
        items.push({
          name: task.innerText.trim(),
          link:
            task.firstElementChild &&
            task.firstElementChild.tagName &&
            task.firstElementChild.tagName === "A"
              ? task.firstElementChild.getAttribute("href")
              : null,
        });
      }
      taskList.firstElementChild.remove();
    }
    return items;
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "editMode" && this.shadowRoot) {
        if (!this[propName]) {
          if (this._observer) {
            this._observer.disconnect();
          }
        } else {
          this._observer = new MutationObserver((mutations) => {
            this.__thereAreChanges = true;
          });
          this._observer.observe(this.shadowRoot.querySelector("#wrapper"), {
            childList: true,
            subtree: true,
            characterData: true,
          });
        }
      }
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
    this.setAttribute("typeof", "oer:SupportingMaterial");
  }
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: true,
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
