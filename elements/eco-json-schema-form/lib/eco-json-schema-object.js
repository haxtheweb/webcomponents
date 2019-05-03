import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import "@polymer/polymer/lib/elements/dom-if.js";
import { FlattenedNodesObserver } from "@polymer/polymer/lib/utils/flattened-nodes-observer.js";
import { AppLocalizeBehavior } from "@polymer/app-localize-behavior/app-localize-behavior.js";
import { mixinBehaviors } from "@polymer/polymer/lib/legacy/class.js";
import "@polymer/iron-flex-layout/iron-flex-layout-classes.js";
import "./eco-json-schema-array.js";
import "./eco-json-schema-boolean.js";
import "./eco-json-schema-enum.js";
import "./eco-json-schema-file.js";
import "./eco-json-schema-input.js";
/**
`eco-json-schema-object` takes in a JSON schema of type object and builds a form,
exposing a `value` property that represents an object described by the schema.

Given the element:

```
<eco-json-schema-object schema="[[schema]]" value="{{value}}"></eco-json-schema-object>
```

And a JSON schema:

```
> this.schema = {
  "$schema": "http://json-schema.org/schema#",
  "title": "Contact",
  "type": "object",
  "properties": {
    "name": {
      "title": "Name",
      "type": "string"
    }
  }
}
```

A form will be generated, with the elements `value` looking something like this:

```
> this.value
{
  "name": "Eric"
}
```

Deep / nested schemas are supported for type array and object:

```
> this.schema = {
  "$schema": "http://json-schema.org/schema#",
  "title": "Contact",
  "type": "object",
    "phoneNumbers": {
      "title": "Phone numbers",
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "type": {
            "title": "Type",
            "type": "string"
          },
          "phoneNumber": {
            "title": "Phone Number",
            "type": "string"
          }
        }
      }
    }
  }
}
```

Validation is handled for strings and number/integers by mapping JSON schema
validation keywords to `paper-input` attributes; form elements will automatically
try and validate themselves as users provide input:

```
> this.schema = {
  "$schema": "http://json-schema.org/schema#",
  "title": "Contact",
  "type": "object",
  "properties": {
    "name": {
      "title": "Name",
      "type": "string",
      "minLength": 2
    },
    "age": {
      "type": "integer",
      "minimum": 0,
      "exclusiveMinimum": true
    },
    "postalCode": {
      "title": "Postal/Zip Code",
      "type": "string",
      "pattern": "[a-zA-Z][0-9][a-zA-Z]\\s*[0-9][a-zA-Z][0-9]|[0-9]{5}(-[0-9]{4})?"
    },
    "email": {
      "title": "email",
      "type": "string",
      "format": "email"
    }
  }
}
```

Customizing components for schema properties is supported by extending your JSON
schema. For any schema sub-property (`properties` for `"type": "object"` and
`items` for `"type": "array"`) a `component` property may be specified, with
the following options:

- `component.name` - specifies the name of the custom component to use
- `component.valueProperty` - specifies which property of the custom element
  represents its value
- `component.properties` - properties that will be set on the element

Example schema using custom components (note that `"valueProperty": "value"` is
redundant in this case, `"valueProperty": "value"` will be the default if not specified):

```
> this.schema = {
  "$schema": "http://json-schema.org/schema#",
  "title": "Contact",
  "type": "object",
  "properties": {
    "phoneNumber": {
      "title": "Phone Number",
      "type": "string",
      "component": {
        "name": "gold-phone-input",
        "valueProperty": "value",
        "properties": {
          "countryCode": "1"
        }
      }
    }
  }
}
```

Items set in `component.properties` will override any attributes / properties set
by `eco-json-schema-form` elements, making it possible to override JSON schema
validation properties mapped to `paper-input` attributes:

```
> this.schema = {
  "$schema": "http://json-schema.org/schema#",
  "title": "Contact",
  "type": "object",
  "properties": {
    "postalCode": {
      "title": "Postal/Zip Code",
      "type": "string",
      "pattern": "[a-zA-Z][0-9][a-zA-Z]\\s*[0-9][a-zA-Z][0-9]|[0-9]{5}(-[0-9]{4})?",
      "component": {
        "properties": {
          "autoValidate": false
        }
      }
    }
  }
}
```

Putting it all together, this schema:

```
> this.schema = {
  "$schema": "http://json-schema.org/schema#",
  "title": "Contact",
  "type": "object",
  "properties": {
    "name": {
      "title": "Name",
      "type": "string",
      "minLength": 2
    },
    "age": {
      "type": "integer",
      "minimum": 0,
      "exclusiveMinimum": true
    },
    "postalCode": {
      "title": "Postal/Zip Code",
      "type": "string",
      "pattern": "[a-zA-Z][0-9][a-zA-Z]\\s*[0-9][a-zA-Z][0-9]|[0-9]{5}(-[0-9]{4})?",
      "component": {
        "properties": {
          "autoValidate": false
        }
      }
    },
    "phoneNumbers": {
      "title": "Phone numbers",
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "type": {
            "title": "Type",
            "type": "string"
          },
          "phoneNumber": {
            "title": "Phone Number",
            "type": "string",
            "component": {
              "name": "gold-phone-input",
              "valueProperty": "value",
              "properties": {
                "countryCode": "1"
              }
            }
          }
        }
      }
    },
    "emailAddresses": {
      "title": "Emails",
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "type": {
            "title": "Type",
            "type": "string"
          },
          "email": {
            "title": "email",
            "type": "string",
            "format": "email"
          }
        }
      }
    }
  }
}
```

Will build a form describing an object:

```
> this.value
{
  "name": "Eric",
  "age": 28,
  "postalCode": "H1W 2C5",
  "phoneNumbers": [
    {
      "type": "Mobile",
      "phoneNumber": "123-456-7890"
    }
  ]
  "emailAddresses": [
    {
      "type": "Personal",
      "email": "eric@wat.com"
    }
  ]
}
```

External validation is supported via the `error` property. By providing an
object tree with each leaf representing an error message for properties, the
message will be attached to the appropriate element.

Example, for the Contact schema:

```
el.error = {
  "name": "String is too short (0 chars) minimum 2",
  "phoneNumbers": [
    {
      "phoneNumber": "String does not match required format"
    }
  ]
}
```

@group eco Elements
@element eco-json-schema-object
* @demo demo/index.html
*/
class EcoJsonSchemaObject extends mixinBehaviors(
  [AppLocalizeBehavior],
  PolymerElement
) {
  static get tag() {
    return "eco-json-schema-object";
  }
  static get template() {
    return html`
      <custom-style>
        <style is="custom-style" include="iron-flex iron-flex-alignment">
          div.layout {
            height: auto;
          }
          #form {
            display: block;
            @apply --eco-json-schema-object-form;
            @apply --layout-vertical;
            @apply --layout-wrap;
          }
          #form ::slotted(paper-input) {
            --paper-input-container-shared-input-style: {
              border: none !important;
              width: 100% !important;
              background-color: transparent !important;
            }
          }
        </style>
      </custom-style>

      <template is="dom-if" if="{{!wizard}}">
        <div class="header" hidden\$="[[!label]]">[[label]]</div>
      </template>
      <div class="layout vertical flex start-justified">
        <div id="form" class="layout horizontal flex start-justified">
          <slot></slot>
        </div>
      </div>
    `;
  }
  static get properties() {
    return {
      language: {
        value: "en"
      },
      resources: {
        value() {
          return {};
        }
      },
      schema: {
        type: Object,
        notify: true,
        observer: "_schemaChanged"
      },
      label: {
        type: String
      },
      value: {
        type: Object,
        notify: true,
        value() {
          return {};
        }
      },
      error: {
        type: Object,
        observer: "_errorChanged"
      },
      wizard: {
        type: Boolean,
        notify: true
      }
    };
  }
  disconnectedCallback() {
    this._clearForm();
    super.disconnectedCallback();
  }
  _buildSchemaProperties() {
    var ctx = this;

    this._schemaProperties = Object.keys(this.schema.properties || []).map(
      key => {
        var schema = ctx.schema.properties[key];
        var property = {
          property: key,
          label: schema.title || key,
          schema: schema,
          component: schema.component || {}
        };

        if (!property.component.valueProperty) {
          property.component.valueProperty = "value";
        }
        if (!property.component.slot) {
          property.component.slot = "";
        }

        if (ctx._isSchemaEnum(schema)) {
          property.component.name =
            property.component.name || "eco-json-schema-enum";
          if (typeof schema.value === typeof undefined) {
            schema.value = "";
          }
          property.value = schema.value;
        } else if (ctx._isSchemaBoolean(schema.type)) {
          property.component.name =
            property.component.name || "eco-json-schema-boolean";
          if (typeof schema.value === typeof undefined) {
            schema.value = false;
          }
          property.value = schema.value;
        } else if (ctx._isSchemaFile(schema.type)) {
          property.component.name =
            property.component.name || "eco-json-schema-file";
          if (typeof schema.value === typeof undefined) {
            schema.value = {};
          }
          property.value = schema.value;
        } else if (ctx._isSchemaValue(schema.type)) {
          property.component.name =
            property.component.name || "eco-json-schema-input";
          if (typeof schema.value === typeof undefined) {
            schema.value = "";
          }
          property.value = schema.value;
        } else if (ctx._isSchemaObject(schema.type)) {
          property.component.name =
            property.component.name || "eco-json-schema-object";
          if (typeof schema.value === typeof undefined) {
            schema.value = {};
          }
          property.value = schema.value;
        } else if (ctx._isSchemaArray(schema.type)) {
          property.component.name =
            property.component.name || "eco-json-schema-array";
          if (typeof schema.value === typeof undefined) {
            schema.value = [];
          }
          property.value = schema.value;
        } else {
          return console.error("Unknown property type %s", schema.type);
        }

        return property;
      }
    );
  }
  _schemaPropertyChanged(event, detail) {
    if (detail.path && /\.length$/.test(detail.path)) {
      return;
    }
    var ctx = this;
    var property = event.target.schemaProperty;
    var path = ["value", property.property];

    if (detail.path && /\.splices$/.test(detail.path)) {
      var parts = detail.path.split(".").slice(1, -1);
      while (parts.length) {
        path.push(parts.shift());
        if (property.keyMap && property.keyMap[path.join(".")]) {
          path = property.keyMap[path.join(".")].split(".");
        }
      }

      if (detail.value.keySplices) {
        if (property.keyMap) {
          detail.value.keySplices.forEach(splice => {
            splice.removed.forEach(k => {
              delete property.keyMap[path.concat([k]).join(".")];
            });
          });
        }
      }

      if (detail.value) {
        detail.value.indexSplices.forEach(splice => {
          var args = [path.join("."), splice.index, splice.removed.length];
          if (splice.addedCount) {
            for (var i = 0, ii = splice.addedCount; i < ii; i++) {
              if (splice.addedKeys && splice.addedKeys[i]) {
                property.keyMap = property.keyMap || {};
                property.keyMap[
                  path.concat([splice.addedKeys[i]]).join(".")
                ] = path.concat([i + splice.index]).join(".");
              }
              args.push(ctx._deepClone(splice.object[i + splice.index]));
            }
          }
          ctx.splice.apply(ctx, args);
        });
      }
    } else if (detail.path) {
      var parts = detail.path.split(".").slice(1);
      var v = this.value;
      if (!v.hasOwnProperty(property.property)) {
        this.set("value." + property.property, {});
        this.notifyPath("value." + property.property);
      }
      while (parts.length) {
        var k = parts.shift();
        path.push(k);
        if (property.keyMap && property.keyMap[path.join(".")]) {
          path = property.keyMap[path.join(".")].split(".");
        }
      }
      this.set(path.join("."), this._deepClone(detail.value));
      this.notifyPath(path.join("."));
    } else {
      property.value = detail.value;
      this.set(path, this._deepClone(detail.value));
      this.notifyPath(path);
    }
  }
  _setValue() {
    var value = {};
    this._schemaProperties.forEach(property => {
      if (typeof property.value !== typeof undefined) {
        value[property.property] = this._deepClone(property.value);
      }
    });
    this.set("value", value);
    this.notifyPath("value.*");
  }
  _buildForm() {
    this._schemaProperties.forEach(property => {
      var el = this.create(property.component.name, {
        label: property.label,
        schema: property.schema,
        schemaProperty: property,
        language: this.language,
        resources: this.resources
      });
      if (property.component.name === "paper-input") {
        el.style["background-color"] = "transparent";
        el.style["width"] = "100%";
      }
      el.setAttribute("name", property.property);
      el.className = "flex start-justified";
      // set the element's default value to be what was passed into the schema
      el[property.component.valueProperty] = property.value;
      // support component attribute overrides
      for (var attr in property.component.attributes) {
        el.setAttribute(attr, property.component.attributes[attr]);
      }
      // support component property overrides
      for (var prop in property.component.properties) {
        el[prop] = property.component.properties[prop];
      }
      this.listen(
        el,
        property.component.valueProperty
          .replace(/([A-Z])/g, "-$1")
          .toLowerCase() + "-changed",
        "_schemaPropertyChanged"
      );
      if (typeof this.$ !== typeof undefined) {
        dom(this).appendChild(el);
      }
      // support for slot injection too!
      if (property.component.slot != "") {
        let temp = document.createElement("div");
        temp.innerHTML = property.component.slot;
        let cloneDiv = temp.cloneNode(true);
        while (dom(cloneDiv).firstChild !== null) {
          dom(el).appendChild(dom(cloneDiv).firstChild);
        }
      }
    });
  }
  _removePropertyEl(el) {
    if (typeof el.schemaProperty !== typeof undefined) {
      this.unlisten(
        el,
        el.schemaProperty.component.valueProperty
          .replace(/([A-Z])/g, "-$1")
          .toLowerCase() + "-changed",
        "_schemaPropertyChanged"
      );
    }
    el.schemaProperty = null;
    dom(this).removeChild(el);
  }
  _clearForm() {
    if (typeof this.$ !== typeof undefined) {
      var formEl = dom(this);
      while (formEl.firstChild) {
        this._removePropertyEl(formEl.firstChild);
      }
    }
  }
  _schemaChanged(newValue, oldValue) {
    if (newValue) {
      this._clearForm();
      this._buildSchemaProperties();
      this._buildForm();
      this._setValue();
    }
  }
  _errorChanged() {
    dom(this).childNodes.forEach(el => {
      var name = el.getAttribute("name");
      if (this.error && this.error[name]) {
        el.error = this.error[name];
      } else {
        el.error = null;
      }
    });
  }
  _deepClone(o) {
    return JSON.parse(JSON.stringify(o));
  }
  _isSchemaValue(type) {
    return (
      this._isSchemaBoolean(type) ||
      this._isSchemaNumber(type) ||
      this._isSchemaString(type) ||
      this._isSchemaFile(type)
    );
  }
  _isSchemaFile(type) {
    if (Array.isArray(type)) {
      return type.indexOf("file") !== -1;
    } else {
      return type === "file";
    }
  }
  _isSchemaBoolean(type) {
    if (Array.isArray(type)) {
      return type.indexOf("boolean") !== -1;
    } else {
      return type === "boolean";
    }
  }
  _isSchemaEnum(schema) {
    return !!schema.enum;
  }
  _isSchemaNumber(type) {
    if (Array.isArray(type)) {
      return type.indexOf("number") !== -1 || type.indexOf("integer") !== -1;
    } else {
      return type === "number" || type === "integer";
    }
  }
  _isSchemaString(type) {
    if (Array.isArray(type)) {
      return type.indexOf("string") !== -1;
    } else {
      return type === "string";
    }
  }
  _isSchemaObject(type) {
    return type === "object";
  }
  _isSchemaArray(type) {
    return type === "array";
  }
}
window.customElements.define(EcoJsonSchemaObject.tag, EcoJsonSchemaObject);
export { EcoJsonSchemaObject };
