import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/polymer/lib/elements/dom-if.js";
import { AppLocalizeBehavior } from "@polymer/app-localize-behavior/app-localize-behavior.js";
import { mixinBehaviors } from "@polymer/polymer/lib/legacy/class.js";
import "@polymer/iron-flex-layout/iron-flex-layout-classes.js";
import "./eco-json-schema-array.js";
import "./eco-json-schema-fieldset.js";
import "./eco-json-schema-markup.js";
import "./eco-json-schema-tabs.js";
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
          :host {
            --eco-json-field-margin: 0 0 15px;
            --eco-json-form-border-radius: 2px;
            --eco-json-form-font-family: var(
              --paper-font-caption_-_font-family,
              unset
            );
            --eco-json-form-bg: var(--primary-background-color, #fff);
            --eco-json-form-color: var(--primary-text-color, #222);
            --eco-json-form-faded-color: #888;
            --eco-json-form-active-color: var(--primary-color, #000);
            --eco-json-form-faded-bg: #f0f0f0;
            --eco-json-form-add-color: #008811;
            --eco-json-form-add-focus: #007700;
            --eco-json-form-remove-focus: #cc0000;
            --eco-json-form-remove-color: #dd0000;
            --simple-picker-float-label-color: var(--eco-json-form-faded-color);
            --simple-picker-float-label-active-color: var(
              --eco-json-form-active-color
            );
            --simple-picker-background-color: var(--eco-json-form-bg);
            --simple-picker-border-color: var(--eco-json-form-faded-color);
            --simple-picker-focus-border-color: var(
              --eco-json-form-active-color
            );
            --simple-picker-focus-border-width: 2px;
            --paper-input-container: {
              padding-top: 0;
            }
          }
          div.layout {
            height: auto;
          }
          #form {
            display: block;
            font-family: var(--eco-json-form-font-family);
            background-color: var(--eco-json-form-bg);
            color: var(--eco-json-form-color);
            --simple-tooltip-background: var(--eco-json-form-active-color);
            --simple-tooltip-text-color: var(--eco-json-form-bg);
            @apply --eco-json-schema-object-form;
            @apply --layout-vertical;
            @apply --layout-wrap;
          }
          #form ::slotted(paper-input) {
            margin-bottom: 15px;
          }
          #form ::slotted(*.has-tooltip-desc) {
            margin-bottom: 0;
            padding-bottom: 0;
            --paper-input-container: {
              margin-bottom: 0;
              padding-bottom: 0;
            }
          }
          #form ::slotted(div.tooltip-desc) {
            font-size: 12px;
            margin: var(--eco-json-field-margin);
            color: var(--eco-json-form-faded-color);
          }
          #form ::slotted(paper-input),
          #form ::slotted(div.tooltip-desc) {
            font-family: var(--eco-json-form-font-family);
          }
          #form ::slotted(div.desc-for-paper-textarea) {
            margin-top: -18px;
            margin-right: 35px;
          }
          #form ::slotted(code-editor) {
            margin: 8px 0;
            padding: 0;
            --code-editor-float-label-color: var(--eco-json-form-faded-color);
            --code-editor-float-label-active-color: var(
              --eco-json-form-active-color
            );
            --code-pen-button-color: var(--eco-json-form-faded-color);
            --code-editor-code-border: 1px solid
              var(--eco-json-form-faded-color);
            --code-editor-code-border-radius: 2px;
            --code-editor-focus-code-border: 2px solid
              var(--eco-json-form-active-color);
          }
        </style>
      </custom-style>

      <template is="dom-if" if="{{!wizard}}">
        <div class="header" hidden$="[[!label]]">[[label]]</div>
      </template>
      <div class="layout vertical flex start-justified">
        <div
          id="form"
          class="layout horizontal flex start-justified"
          aria-live="polite"
        >
          <slot></slot>
        </div>
      </div>
    `;
  }
  static get properties() {
    return {
      language: {
        value: "en",
      },
      resources: {
        value() {
          return {};
        },
      },
      schema: {
        type: Object,
        notify: true,
        observer: "_schemaChanged",
      },
      label: {
        type: String,
      },
      value: {
        type: Object,
        notify: true,
        value() {
          return {};
        },
      },
      error: {
        type: Object,
        observer: "_errorChanged",
      },
      wizard: {
        type: Boolean,
        notify: true,
      },
      /**
       * the name of the code-editor theme
       */
      codeTheme: {
        type: String,
        value: "vs-light-2",
      },
      /**
       * automatically set focus on the first field if that field has autofocus
       */
      autofocus: {
        type: Boolean,
        value: false,
      },
    };
  }
  disconnectedCallback() {
    this._clearForm();
    super.disconnectedCallback();
  }
  /**
   * returns an array of properties for a given schema object
   * @param {object} thisSchema the source schema
   * @returns {array} an array
   */
  _buildSchemaProperties(thisSchema = this.schema) {
    var ctx = this;
    return Object.keys(thisSchema.properties || []).map((key) => {
      var schema = thisSchema.properties[key];
      var property = {
        name: key,
        schema: schema,
        label: schema.title || key,
        description: schema.description,
        component: schema.component || {},
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
        this._buildNestedSchemaProperties(property, schema);
      } else if (ctx._isSchemaFieldset(schema.type)) {
        property.component.name =
          property.component.name || "eco-json-schema-fieldset";
        this._buildNestedSchemaProperties(property, schema);
      } else if (ctx._isSchemaTabs(schema.type)) {
        property.component.name =
          property.component.name || "eco-json-schema-tabs";
        this._buildNestedSchemaProperties(property, schema);
      } else if (ctx._isSchemaMarkup(schema.type)) {
        property.component.name =
          property.component.name || "eco-json-schema-markup";
        if (typeof schema.value === typeof undefined) {
          schema.value = "";
        }
        property.value = schema.value;
      } else {
        return console.error("Unknown property type %s", schema.type);
      }
      return property;
    });
  }
  /**
   * adds array of nested sub-properties to a given property based on a given schema
   * @param {object} property the property that will have nested subproperties
   * @param {object} schema the schema that has nested subschemas
   */
  _buildNestedSchemaProperties(property, schema) {
    if (typeof schema.value === typeof undefined)
      schema.value = schema.type !== "array" ? {} : [];
    property.value = schema.value;
    for (let key in schema.items.properties) {
      schema.items.properties[key].value = schema.value[key];
    }
    property.schema.properties = this._buildSchemaProperties(
      schema.items,
      property.property + "."
    );
  }
  /**
   * updates the value when a schema property (or subproperty) changes
   * @param {event} event the
   * @param {object} detail the event details
   */
  _schemaPropertyChanged(event, detail) {
    if (detail) {
      if (detail.path && /\.length$/.test(detail.path)) {
        return;
      }
      var ctx = this;
      var property = event.target.schemaProperty;

      var path = ["value"].concat(
        `${event.target.propertyPrefix}${event.target.propertyName}`.split(".")
      );
      var prop = property.property || event.target.propertyName;
      var val = detail && detail.value ? this._deepClone(detail.value) : null;
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
            detail.value.keySplices.forEach((splice) => {
              splice.removed.forEach((k) => {
                delete property.keyMap[path.concat([k]).join(".")];
              });
            });
          }
        }

        if (detail.value) {
          detail.value.indexSplices.forEach((splice) => {
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
        //most of our fields will just set the value this way
        this.set(path.join("."), this._deepClone(detail.value));
        this.notifyPath("value");
      }
      //fire an event to let array listeners handle changed fields
      event.target.dispatchEvent(
        new CustomEvent("form-field-changed", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: event.target,
        })
      );
      this.dispatchEvent(
        new CustomEvent("value-changed", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this,
        })
      );
    }
  }
  /**
   * sets the value based on a the schema properties (or a subproperties and a path)
   * @param {array} props the schema properties (default) or subproperties
   * @param {string} path the string that indicates the path for subproperties
   */
  _setValue(props = this._schemaProperties, path = "") {
    let setter = path.replace(/\[(\d+)\]/g, ".$1");
    if (setter != "") setter = `.${setter}`;
    if (props.length > 0) {
      props.forEach((property) => {
        if (typeof property.value !== typeof undefined) {
          this.set(
            `value${setter}.${property.property}`,
            this._deepClone(property.value),
            JSON.stringify(property.value)
          );
        }
      });
      this.notifyPath("value.*");
    }
  }
  /**
   * builds form fields and appends them to an element
   * @param {array} props the schema properties (default) or subproperties
   * @param {object} container optional container element the for the form fields (for subproperties)
   * @param {string} prefix optional field name prefix (for subproperties)
   */
  _buildForm(props = this._schemaProperties, container = this, prefix = "") {
    let autofocus = this.autofocus;
    props.forEach((property) => {
      if (property.component.name === "code-editor") {
        // special case, can't come up with a better way to do this but monoco is very special case
        property.schema.component.properties.editorValue =
          property.schema.value;
        property.schema.component.properties.theme = this.codeTheme;
      }
      let propertyPrefix = prefix !== "" ? `${prefix}.` : ``,
        propertyName = property.property || property.name;
      var el = this.create(property.component.name, {
        label: property.label,
        schema: property.schema,
        schemaProperty: property,
        propertyPrefix: propertyPrefix,
        propertyName: propertyName,
        language: this.language,
        resources: this.resources,
      });
      if (property.component.name === "paper-input") {
        el.style["background-color"] = "transparent";
        el.style["width"] = "100%";
      }
      el.setAttribute("name", `${propertyPrefix}${propertyName}`);
      if (property.schema.hidden && property.schema.hidden !== undefined) {
        el.setAttribute("hidden", property.schema.hidden);
      }

      //allows the first form fields to be focused on autopmatically
      if (autofocus) el.setAttribute("autofocus", autofocus);
      //turns of focus on subsequent form fields
      autofocus = false;
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
      this.listen(el, "build-fieldset", "_onBuildFieldset");

      if (typeof this.$ !== typeof undefined) {
        container.appendChild(el);
        if (property.description) {
          var id = "tip-" + property.property,
            tip = document.createElement("div");
          el.setAttribute("aria-describedby", id);
          el.setAttribute("class", "has-tooltip-desc");
          tip.setAttribute("id", id);
          tip.setAttribute(
            "class",
            "tooltip-desc desc-for-" + property.component.name
          );
          if (property.schema.hidden === true)
            tip.setAttribute("hidden", "hidden");
          tip.setAttribute("role", "tooltip");
          tip.innerHTML = property.description;
          container.appendChild(tip);
        }
      }
      // support for slot injection too!
      if (property.component.slot != "") {
        let temp = document.createElement("div");
        temp.innerHTML = property.component.slot;
        let cloneDiv = temp.cloneNode(true);
        while (cloneDiv.firstChild !== null) {
          el.appendChild(cloneDiv.firstChild);
        }
      }
      this.dispatchEvent(
        new CustomEvent("form-changed", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this,
        })
      );
    });
  }
  /**
   * handles fieldset requests from containers like fieldsets, tabs, or arrays
   * @param {event} event the "build-fieldset" event
   * @param {object} detail the details of the event, as in:```
{
  prefix: the prefix for the fields 
  properties: []     //an array of schema properties,
  container: <div/>  //the container element,
}
  ```
   */
  _onBuildFieldset(event, detail) {
    if (typeof this.get(`value.${detail.prefix}`) === typeof undefined)
      this.set(`value.${detail.path}`, this._deepClone(detail.value));
    this._clearForm(detail.container);
    this._buildForm(detail.properties, detail.container, detail.prefix);
  }
  /**
   * removes a field element
   * @param {object} el the element to remove
   * @param {*} parent the container where the field element exists
   */
  _removePropertyEl(el, parent = this) {
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
    parent.removeChild(el);
  }
  /**
   * clears a form or a fieldset container within a form
   * @param {object} el the element to remove
   * @param {*} parent the container where the field element exists
   */
  _clearForm(container = this) {
    if (typeof this.$ !== typeof undefined) {
      var formEl = container;
      while (formEl.firstChild) {
        this._removePropertyEl(formEl.firstChild, container);
      }
    }
  }
  /**
   * updates the form when the schema changes
   * @param {object} newValue the new value for the schema
   * @param {object} oldValue the old value for the schema
   */
  _schemaChanged(newValue, oldValue) {
    if (newValue && newValue !== oldValue) {
      this._clearForm();
      this._schemaProperties = this._buildSchemaProperties();
      this._buildForm();
      this._setValue();
    }
  }
  /**
   * handles errors
   * @todo how do we want to handle errors for nested fields?
   */
  _errorChanged() {
    /*
    console.log(
      "_errorChanged",
      this,
      this.querySelectorAll("[name]"),
      this.error
    );*/
    this.childNodes.forEach((el) => {
      var name = el.getAttribute("name");
      if (this.error && this.error[name]) {
        el.error = this.error[name];
      } else {
        el.error = null;
      }
    });
  }
  /**
   * clones an object and all its subproperties
   * @param {object} o the object to clone
   * @returns {object} the cloned object
   */
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
  _isSchemaFieldset(type) {
    return type === "fieldset";
  }
  _isSchemaTabs(type) {
    return type === "tabs";
  }
  _isSchemaMarkup(type) {
    return type === "markup";
  }
  focus() {
    //console.log(this);
  }
}
window.customElements.define(EcoJsonSchemaObject.tag, EcoJsonSchemaObject);
export { EcoJsonSchemaObject };
