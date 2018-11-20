define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/paper-menu-button/paper-menu-button.js",
  "../node_modules/@polymer/paper-button/paper-button.js",
  "../node_modules/@polymer/paper-listbox/paper-listbox.js",
  "../node_modules/@polymer/paper-tooltip/paper-tooltip.js",
  "./editable-table-editor-insdel.js",
  "./editable-table-behaviors.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_94c0c6f0ecf311e89cb22b61cebc916e() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style>\n      :host {\n        display: block;\n      }\n      :host #label {\n        margin: 0;\n        padding: 0;\n      }\n      :host paper-menu-button {\n        margin: 0;\n        padding: 0;\n        width: 100%;\n      }\n      :host paper-button {\n        margin: 0;\n        display: block;\n        background-color: transparent;\n      }\n      :host([condensed]) paper-button {\n        padding-top: 0;\n        padding-bottom: 0;\n      }\n    </style>\n    <paper-menu-button id="menu">\n      <paper-button slot="dropdown-trigger">\n        <span id="label">[[label]]</span> <iron-icon icon="arrow-drop-down"></iron-icon>\n      </paper-button>\n      <paper-listbox slot="dropdown-content" label$="[[label]]">\n        <editable-table-editor-insdel action="insert" index$="[[index]]" type$="[[type]]" before="true">Insert [[type]] Before</editable-table-editor-insdel>\n        <editable-table-editor-insdel action="insert" index$="[[index]]" type$="[[type]]">Insert [[type]] After</editable-table-editor-insdel>\n        <editable-table-editor-insdel action="delete" index$="[[index]]" type$="[[type]]">Delete [[type]]</editable-table-editor-insdel>\n      </paper-listbox>\n    </paper-menu-button>\n'
      ],
      [
        '\n    <style>\n      :host {\n        display: block;\n      }\n      :host #label {\n        margin: 0;\n        padding: 0;\n      }\n      :host paper-menu-button {\n        margin: 0;\n        padding: 0;\n        width: 100%;\n      }\n      :host paper-button {\n        margin: 0;\n        display: block;\n        background-color: transparent;\n      }\n      :host([condensed]) paper-button {\n        padding-top: 0;\n        padding-bottom: 0;\n      }\n    </style>\n    <paper-menu-button id="menu">\n      <paper-button slot="dropdown-trigger">\n        <span id="label">[[label]]</span> <iron-icon icon="arrow-drop-down"></iron-icon>\n      </paper-button>\n      <paper-listbox slot="dropdown-content" label\\$="[[label]]">\n        <editable-table-editor-insdel action="insert" index\\$="[[index]]" type\\$="[[type]]" before="true">Insert [[type]] Before</editable-table-editor-insdel>\n        <editable-table-editor-insdel action="insert" index\\$="[[index]]" type\\$="[[type]]">Insert [[type]] After</editable-table-editor-insdel>\n        <editable-table-editor-insdel action="delete" index\\$="[[index]]" type\\$="[[type]]">Delete [[type]]</editable-table-editor-insdel>\n      </paper-listbox>\n    </paper-menu-button>\n'
      ]
    );
    _templateObject_94c0c6f0ecf311e89cb22b61cebc916e = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_94c0c6f0ecf311e89cb22b61cebc916e()
    ),
    is: "editable-table-editor-rowcol",
    listeners: { "insdel-tapped": "_onTap" },
    behaviors: [editableTableBehaviors.cellBehaviors],
    properties: {
      index: { type: Number, value: null },
      label: { type: String, computed: "_getLabel(index,type)" },
      type: { type: String, value: null }
    }
  });
});
