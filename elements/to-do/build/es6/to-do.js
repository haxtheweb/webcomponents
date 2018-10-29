import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import "./node_modules/@polymer/paper-checkbox/paper-checkbox.js";
import "./node_modules/@polymer/paper-button/paper-button.js";
import "./node_modules/@polymer/paper-card/paper-card.js";
import "./node_modules/@polymer/paper-input/paper-input.js";
import "./node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
import "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
      :host[hide-form] ul {
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
        background-color: #F5F5F5;
      }
      .task-list-wrapper li:nth-child(odd) {
        background-color: #E5E5E5;
      }
      .task-list-wrapper li:hover {
        background-color: #FFFFFF;
      }
      .task-list-wrapper li:active {
        background-color: #FFFFFF;
      }
      .task-list-wrapper li:focus {
        background-color: #FFFFFF;
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
          <paper-button raised="" id="itembutton">Add item</paper-button>
        </div>
        <ul class="task-list-wrapper">
          <template is="dom-repeat" items="[[items]]" as="item">
            <li data-item-id\$="[[item.id]]"><paper-checkbox checked="{{item.value}}" disabled="[[item.disabled]]">[[item.label]]</paper-checkbox></li>
          </template>
        </ul>
      </div>
    </paper-card>
`,
  is: "to-do",
  behaviors: [HAXBehaviors.PropertiesBehaviors],
  observers: ["_valueChanged(items.*)"],
  listeners: { "itembutton.tap": "_addItemToList" },
  properties: {
    hideForm: { type: Boolean, value: !1, reflectToAttribute: !0 },
    disabledList: { type: Boolean, value: !1, reflectToAttribute: !0 },
    name: { type: String, value: "To do list" },
    items: { type: Array, value: [], notify: !0 }
  },
  _valueChanged: function(e) {
    for (var i in e.base) {
      for (var j in e.base[i]) {
        this.notifyPath("items." + i + "." + j);
      }
    }
  },
  _addItemToList: function() {
    if (
      "" != this.$.itemtext.value &&
      typeof this.$.itemtext.value !== typeof void 0
    ) {
      this.push("items", {
        label: this.$.itemtext.value,
        value: !1,
        disabled: this.disabledList,
        id: "item-id-" + this.items.length
      });
      this.$.itemtext.value = "";
    }
  },
  attached: function() {
    this.setHaxProperties({
      canScale: !0,
      canPosition: !0,
      canEditSource: !1,
      gizmo: {
        title: "To do list",
        description: "A list of things to do so people can keep calm.",
        icon: "icons:list",
        color: "grey",
        groups: ["List"],
        handles: [],
        meta: { author: "LRNWebComponents" }
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
            properties: [
              {
                property: "label",
                title: "Task",
                description: "Name of the task",
                inputMethod: "textfield",
                required: !0
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
    });
  }
});
