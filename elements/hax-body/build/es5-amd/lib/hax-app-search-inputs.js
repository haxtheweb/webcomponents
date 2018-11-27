define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/paper-input/paper-input.js",
  "../node_modules/@polymer/paper-item/paper-item.js",
  "../node_modules/@lrnwebcomponents/eco-json-schema-form/lib/eco-json-schema-object.js",
  "../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js"
], function(
  _polymerLegacy,
  _paperInput,
  _paperItem,
  _ecoJsonSchemaObject,
  _simpleColors
) {
  "use strict";
  function _templateObject_a29cd780f1e611e8b3a2e3a031c18fd0() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n  <custom-style>\n    <style is="custom-style">\n      :host {\n        display: block;\n      }\n      eco-json-schema-object {\n        --eco-json-schema-object-form : {\n          -ms-flex: unset;\n          -webkit-flex: unset;\n          flex: unset;\n          -webkit-flex-basis: unset;\n          flex-basis: unset;\n        };\n        --paper-checkbox-size: 22px;\n        --paper-checkbox-unchecked-color: var(--simple-colors-blue-grey-background1, grey);\n        --paper-checkbox-checked-color: var(--simple-colors-light-green-foreground3, green);\n        --paper-checkbox-checked-ink-color: #FFFFFF;\n        --paper-checkbox-unchecked-ink-color: #FFFFFF;\n        --paper-checkbox-label-color: var(--simple-colors-blue-grey-background1, blue);\n        --paper-checkbox-label-checked-color: var(--simple-colors-accent-background1, green);\n        --paper-checkbox-label: {\n          font-size: 22px;\n          line-height: 32px;\n        };\n        --paper-input-container-invalid-color: var(--simple-colors-red-foreground3, red);\n        --secondary-text-color: #FFFFFF;\n        --primary-text-color: #FFFFFF;\n        --primary-color: #FFFFFF;\n        --paper-input-container-input-color: #FFFFFF;\n        --paper-input-container-color: #FFFFFF !important;\n        --paper-input-container-focus-color: var(--simple-colors-light-green-background1, green) !important;\n        --paper-listbox-color: #000000;\n        color: white;\n      }\n      .search-label {\n        font-size: 24px;\n        color: var(--simple-colors-light-green-background1, green);\n        font-weight: bold;\n        margin: 0;\n        padding: 0;\n      }\n    </style>\n  </custom-style>\n  <div class="search-label">Search [[label]]</div>\n  <eco-json-schema-object id="form" schema="[[schema]]" value="{{values}}"></eco-json-schema-object>\n'
    ]);
    _templateObject_a29cd780f1e611e8b3a2e3a031c18fd0 = function _templateObject_a29cd780f1e611e8b3a2e3a031c18fd0() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_a29cd780f1e611e8b3a2e3a031c18fd0()
    ),
    is: "hax-app-search-inputs",
    observers: ["_valueChanged(values.*)"],
    properties: {
      label: { type: String, value: "app" },
      values: { type: Object },
      schema: { type: Object }
    },
    _valueChanged: function _valueChanged(change) {
      this.fire("hax-app-search-values-changed", change.base);
    }
  });
});
