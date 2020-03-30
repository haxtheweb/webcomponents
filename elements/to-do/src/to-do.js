import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
/**
 * `to-do`
 * @element to-do
 * @demo demo/index.html
 */
class ToDo extends SchemaBehaviors(PolymerElement) {
  constructor() {
    super();
    import("@polymer/paper-checkbox/paper-checkbox.js");
    import("@polymer/paper-button/paper-button.js");
    import("@polymer/paper-card/paper-card.js");
    import("@polymer/paper-input/paper-input.js");
  }
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        :host([hide-form]) ul {
          border: 1px solid black;
        }
        paper-card {
          width: 100%;
          padding: 8px;
        }
        .task-list-wrapper {
          width: 100%;
          height: 100%;
          border: 2px solid black;
          list-style: none;
          padding: 0;
        }
        .task-list-wrapper li {
          padding: 8px;
        }
        .task-list-wrapper li:nth-child(even) {
          background-color: #f5f5f5;
        }
        .task-list-wrapper li:nth-child(odd) {
          background-color: #e5e5e5;
        }
        .task-list-wrapper li:hover {
          background-color: #ffffff;
        }
        .task-list-wrapper li:active {
          background-color: #ffffff;
        }
        .task-list-wrapper li:focus {
          background-color: #ffffff;
        }
        h3 {
          margin: 4px;
          padding: 0;
          font-size: 20px;
        }
      </style>
      <paper-card heading="[[name]]" elevation="2">
        <div class="card-content">
          <div hidden\$="[[hideForm]]">
            <paper-input label="Task to accomplish" id="itemtext"></paper-input>
            <paper-button raised="" id="itembutton" on-click="_addItemToList"
              >Add item</paper-button
            >
          </div>
          <ul class="task-list-wrapper">
            <template is="dom-repeat" items="[[items]]" as="item">
              <li data-item-id\$="[[item.id]]">
                <paper-checkbox
                  checked="{{item.value}}"
                  disabled="[[item.disabled]]"
                  >[[item.label]]</paper-checkbox
                >
              </li>
            </template>
          </ul>
        </div>
      </paper-card>
    `;
  }
  static get tag() {
    return "to-do";
  }
  static get observers() {
    return ["_valueChanged(items.*)"];
  }
  static get properties() {
    return {
      ...super.properties,

      /**
       * Allow for hiding the input form for new data.
       */
      hideForm: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * Whether or not the list of items is disabled
       * checkboxes.
       */
      disabledList: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * Name of this to do list
       */
      name: {
        type: String,
        value: "To do list"
      },
      /**
       * Items
       */
      items: {
        type: Array,
        value: [],
        notify: true
      }
    };
  }
  /**
   * Ensure the values change.
   */
  _valueChanged(e) {
    for (var i in e.base) {
      for (var j in e.base[i]) {
        this.notifyPath("items." + i + "." + j);
      }
    }
  }
  /**
   * Add a new item to the list.
   */
  _addItemToList(e) {
    if (
      this.shadowRoot.querySelector("#itemtext").value != "" &&
      typeof this.shadowRoot.querySelector("#itemtext").value !==
        typeof undefined
    ) {
      this.push("items", {
        label: this.shadowRoot.querySelector("#itemtext").value,
        value: false,
        disabled: this.disabledList,
        id: "item-id-" + this.items.length
      });
      this.shadowRoot.querySelector("#itemtext").value = "";
    }
  }
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "To do list",
        description: "A list of things to do so people can keep calm.",
        icon: "icons:list",
        color: "grey",
        groups: ["List"],
        handles: [],
        meta: {
          author: "ELMS:LN"
        }
      },
      settings: {
        quick: [
          {
            property: "name",
            title: "Name",
            description: "The name of this to do list",
            inputMethod: "textfield",
            icon: "editor:title"
          }
        ],
        configure: [
          {
            property: "name",
            title: "Name",
            description: "The name of this to do list",
            inputMethod: "textfield",
            icon: "editor:title"
          },
          {
            property: "items",
            title: "List of items",
            description: "List of items to display in our list.",
            inputMethod: "array",
            itemLabel: "label",
            properties: [
              {
                property: "label",
                title: "Task",
                description: "Name of the task",
                inputMethod: "textfield",
                required: true
              },
              {
                property: "value",
                title: "Done",
                description: "Completion state",
                inputMethod: "boolean"
              }
            ]
          }
        ],
        advanced: []
      }
    };
  }
}
window.customElements.define(ToDo.tag, ToDo);
export { ToDo };
