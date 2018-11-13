define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@polymer/paper-checkbox/paper-checkbox.js",
  "./node_modules/@polymer/paper-button/paper-button.js",
  "./node_modules/@polymer/paper-card/paper-card.js",
  "./node_modules/@polymer/paper-input/paper-input.js",
  "./node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js",
  "./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_9d2bc980e70711e882e0f1cb97179358() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style>\n      :host {\n        display: block;\n      }\n      :host([hide-form]) ul {\n        border: 1px solid black;\n      }\n      paper-card {\n        width: 100%;\n        padding: 8px;\n      }\n      .task-list-wrapper {\n        width: 100%;\n        height: 100%;\n        border: 2px solid black;\n        list-style: none;\n        padding: 0;\n      }\n      .task-list-wrapper li {\n        padding: 8px;\n      }\n      .task-list-wrapper li:nth-child(even) {\n        background-color: #F5F5F5;\n      }\n      .task-list-wrapper li:nth-child(odd) {\n        background-color: #E5E5E5;\n      }\n      .task-list-wrapper li:hover {\n        background-color: #FFFFFF;\n      }\n      .task-list-wrapper li:active {\n        background-color: #FFFFFF;\n      }\n      .task-list-wrapper li:focus {\n        background-color: #FFFFFF;\n      }\n      h3 {\n        margin: 4px;\n        padding: 0;\n        font-size: 20px;\n      }\n    </style>\n    <paper-card heading="[[name]]" elevation="2">\n      <div class="card-content">\n        <div hidden$="[[hideForm]]">\n          <paper-input label="Task to accomplish" id="itemtext"></paper-input>\n          <paper-button raised="" id="itembutton" on-tap="_addItemToList">Add item</paper-button>\n        </div>\n        <ul class="task-list-wrapper">\n          <template is="dom-repeat" items="[[items]]" as="item">\n            <li data-item-id$="[[item.id]]"><paper-checkbox checked="{{item.value}}" disabled="[[item.disabled]]">[[item.label]]</paper-checkbox></li>\n          </template>\n        </ul>\n      </div>\n    </paper-card>\n'
      ],
      [
        '\n    <style>\n      :host {\n        display: block;\n      }\n      :host([hide-form]) ul {\n        border: 1px solid black;\n      }\n      paper-card {\n        width: 100%;\n        padding: 8px;\n      }\n      .task-list-wrapper {\n        width: 100%;\n        height: 100%;\n        border: 2px solid black;\n        list-style: none;\n        padding: 0;\n      }\n      .task-list-wrapper li {\n        padding: 8px;\n      }\n      .task-list-wrapper li:nth-child(even) {\n        background-color: #F5F5F5;\n      }\n      .task-list-wrapper li:nth-child(odd) {\n        background-color: #E5E5E5;\n      }\n      .task-list-wrapper li:hover {\n        background-color: #FFFFFF;\n      }\n      .task-list-wrapper li:active {\n        background-color: #FFFFFF;\n      }\n      .task-list-wrapper li:focus {\n        background-color: #FFFFFF;\n      }\n      h3 {\n        margin: 4px;\n        padding: 0;\n        font-size: 20px;\n      }\n    </style>\n    <paper-card heading="[[name]]" elevation="2">\n      <div class="card-content">\n        <div hidden\\$="[[hideForm]]">\n          <paper-input label="Task to accomplish" id="itemtext"></paper-input>\n          <paper-button raised="" id="itembutton" on-tap="_addItemToList">Add item</paper-button>\n        </div>\n        <ul class="task-list-wrapper">\n          <template is="dom-repeat" items="[[items]]" as="item">\n            <li data-item-id\\$="[[item.id]]"><paper-checkbox checked="{{item.value}}" disabled="[[item.disabled]]">[[item.label]]</paper-checkbox></li>\n          </template>\n        </ul>\n      </div>\n    </paper-card>\n'
      ]
    );
    _templateObject_9d2bc980e70711e882e0f1cb97179358 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_9d2bc980e70711e882e0f1cb97179358()
    ),
    is: "to-do",
    behaviors: [HAXBehaviors.PropertiesBehaviors],
    observers: ["_valueChanged(items.*)"],
    properties: {
      hideForm: { type: Boolean, value: !1, reflectToAttribute: !0 },
      disabledList: { type: Boolean, value: !1, reflectToAttribute: !0 },
      name: { type: String, value: "To do list" },
      items: { type: Array, value: [], notify: !0 }
    },
    _valueChanged: function _valueChanged(e) {
      for (var i in e.base) {
        for (var j in e.base[i]) {
          this.notifyPath("items." + i + "." + j);
        }
      }
    },
    _addItemToList: function _addItemToList() {
      if (
        "" != this.$.itemtext.value &&
        babelHelpers.typeof(this.$.itemtext.value) !== "undefined"
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
    attached: function attached() {
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
});
