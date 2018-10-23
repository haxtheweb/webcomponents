import "@polymer/polymer/polymer.js";
import "@polymer/iron-flex-layout/iron-flex-layout-classes.js";
import "@polymer/iron-icons/image-icons.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/editor-icons.js";
import "@polymer/iron-pages/iron-pages.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/paper-toolbar/paper-toolbar.js";
import "@polymer/paper-menu-button/paper-menu-button.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/paper-ripple/paper-ripple.js";
import "@polymer/paper-toolbar/paper-toolbar.js";
import "@polymer/app-localize-behavior/app-localize-behavior.js";
import "./eco-json-schema-object.js";
import "./eco-json-schema-array.js";
import "./eco-json-schema-boolean.js";
import "./eco-json-schema-enum.js";
import "./eco-json-schema-file.js";
import "./eco-json-schema-geolocation.js";
import "./eco-json-schema-input.js";
const $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");

$_documentContainer.innerHTML = `<dom-module id="eco-json-schema-wizard">
  
  
  
  
  
  
  
  <template>
    <style is="custom-style" include="iron-flex iron-flex-alignment">
       :host {
        display: block;
        @apply(--layout-vertical);
      }

      paper-input {
        padding: 2px;
        --paper-input-container-label: {
          white-space: normal;
          position: static;
          font-size: 22px;
          color: #fff;
        }
      }

      .box,
      #form {
        display: -webkit-box;
        display: -webkit-flex;
        display: -moz-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-align: center;
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;
      }

      .fullbleed {
        z-index: 1;
      }

      paper-toolbar.bottom {
        --paper-toolbar-color: var(--app-primary-color);
        --paper-toolbar-background: var(--dark-theme-text-color);
      }

      paper-toolbar.bottom paper-icon-button {
        --paper-toolbar-color: var(--dark-theme-text-color);
        --paper-toolbar-background: var(--app-primary-color);
      }

    </style>
    <div class="vertical flex layout fullbleed">
      <!--paper-icon-button id="camButton" icon="editor:insert-photo" raised>add photo</paper-icon-button-->
      <paper-toolbar>
        <paper-icon-button id="prevButton" icon="arrow-back" hidden\$="{{!hasPrev}}" on-tap="prev" raised="">{{localize('prev')}}</paper-icon-button><span class="title layout horizontal flex" style="white-space: normal">[[title]]</span>
        <paper-icon-button id="nextButton" icon="arrow-forward" hidden\$="{{!hasNext}}" on-tap="next" raised="">{{localize('next')}}</paper-icon-button>
        <paper-icon-button id="submitButton" icon="cloud-upload" on-tap="submit" raised="">{{localize('submit')}}</paper-icon-button>
      </paper-toolbar>
      <iron-pages id="form" class="layout horizontal flex start-justified" role="main" selected="[[page]]" attr-for-selected="name"></iron-pages>
      <paper-toolbar class="bottom">
        <div hidden\$="{{!hasPrev}}" on-tap="prev">
          <paper-icon-button id="prevButton" icon="arrow-back" raised="">{{localize('prev')}}</paper-icon-button>
          <span class="title layout" style="white-space: normal">{{localize('prev')}}</span>
        </div>
        <span class="title layout horizontal flex" style="white-space: normal"></span>
        <div hidden\$="{{!hasNext}}" on-tap="next">
          <span class="title layout" style="white-space: normal">{{localize('next')}}</span>
          <paper-icon-button id="nextButton" icon="arrow-forward" raised="">{{localize('next')}}</paper-icon-button>
        </div>
      </paper-toolbar>
    </div>
  </template>
  
</dom-module>`;

document.head.appendChild($_documentContainer);
/**
`eco-json-schema-wizard` takes in a JSON schema of type object and builds a form,
exposing a `value` property that represents an object described by the schema.

Given the element:

```
<eco-json-schema-wizard schema="[[schema]]" value="{{value}}"></eco-json-schema-wizard>
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
@element eco-json-schema-wizard
@demo demo/index.html
*/
Polymer({
  is: "eco-json-schema-wizard",
  behaviors: [Polymer.AppLocalizeBehavior],

  properties: {
    language: {
      type: String,
      notify: true
    },
    resources: {
      type: Object,
      notify: true
    },
    schema: {
      type: Object,
      observer: "_schemaChanged"
    },
    label: {
      type: String
    },
    value: {
      type: Object,
      notify: true,
      value: function() {
        return {};
      }
    },
    page: {
      type: String,
      notify: true,
      observer: "_pageChanged"
    },
    pages: {
      type: Array,
      notify: true,
      value: []
    },
    error: {
      type: Object,
      observer: "_errorChanged"
    },
    isReview: {
      type: Boolean,
      value: false,
      notify: true
    },
    canSubmit: {
      type: Boolean,
      notify: true
    },
    hasNext: {
      type: Boolean,
      notify: true
    },
    hasPrev: {
      type: Boolean,
      notify: true
    },
    titles: {
      type: Array,
      notify: true,
      value: []
    },
    title: {
      type: String,
      value: "",
      notify: true
    }
  },
  detached: function() {
    this._clearForm();
  },
  _buildSchemaProperties: function() {
    var ctx = this;

    this._schemaProperties = Object.keys(this.schema.properties || []).map(
      function(key) {
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

        if (ctx._isSchemaEnum(schema)) {
          property.component.name =
            property.component.name || "eco-json-schema-enum";
          property.value = "";
        } else if (ctx._isSchemaBoolean(schema.type)) {
          property.component.name =
            property.component.name || "eco-json-schema-boolean";
          property.value = false;
        } else if (ctx._isSchemaFile(schema.type)) {
          property.component.name =
            property.component.name || "eco-json-schema-file";
          property.value = "";
        } else if (ctx._isSchemaValue(schema.type)) {
          property.component.name =
            property.component.name || "eco-json-schema-input";
          property.value = "";
        } else if (ctx._isSchemaObject(schema.type)) {
          property.component.name =
            property.component.name || "eco-json-schema-object";
          property.component.wizard = true;
          property.value = {};
        } else if (ctx._isSchemaArray(schema.type)) {
          property.component.name =
            property.component.name || "eco-json-schema-array";
          property.value = [];
        } else {
          return console.error("Unknown property type %s", schema.type);
        }
        ctx.push("pages", key);
        ctx.push("titles", schema.title);

        return property;
      }
    );
  },
  _schemaPropertyChanged: function(event, detail) {
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
          detail.value.keySplices.forEach(function(splice) {
            splice.removed.forEach(function(k) {
              delete property.keyMap[path.concat([k]).join(".")];
            });
          });
        }
      }

      detail.value.indexSplices.forEach(function(splice) {
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
    } else if (detail.path) {
      var parts = detail.path.split(".").slice(1);
      var v = this.value;
      if (!v.hasOwnProperty(property.property)) {
        this.set("value." + property.property, {});
      }
      while (parts.length) {
        var k = parts.shift();
        path.push(k);
        if (property.keyMap && property.keyMap[path.join(".")]) {
          path = property.keyMap[path.join(".")].split(".");
        }
      }
      this.set(path.join("."), this._deepClone(detail.value));

      console.log("value: " + JSON.stringify(this.value));
    }
  },
  _setValue: function() {
    var ctx = this;
    var value = {};
    this._schemaProperties.forEach(function(property) {
      value[property.property] = ctx._deepClone(property.value);
    });
    this.value = value;
  },
  _buildForm: function() {
    var ctx = this;
    this._schemaProperties.forEach(function(property) {
      var el = ctx.create(property.component.name, {
        label: property.label,
        schema: property.schema,
        schemaProperty: property,
        language: this.language,
        resources: this.resources
      });

      el.setAttribute("name", property.property);
      el.className = "flex start-justified";

      property.value = el[property.component.valueProperty];
      ctx.listen(
        el,
        property.component.valueProperty
          .replace(/([A-Z])/g, "-$1")
          .toLowerCase() + "-changed",
        "_schemaPropertyChanged"
      );
      Polymer.dom(ctx.$.form).appendChild(el);
    });
  },
  _removePropertyEl: function(el) {
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
    Polymer.dom(this.$.form).removeChild(el);
  },
  _clearForm: function() {
    var formEl = Polymer.dom(this.$.form);
    while (formEl.firstChild) {
      this._removePropertyEl(formEl.firstChild);
    }
  },
  _schemaChanged: function() {
    this._clearForm();
    this._buildSchemaProperties();
    this._buildForm();
    this._setValue();
    if (this.pages.length > 0) {
      this.set("page", this.pages[0]);
    }
    this.set("title", this.titles[0]);
  },
  next: function() {
    var current = this.pages.indexOf(this.page);
    var next = current;
    if (current !== -1) {
      if (current < this.pages.length - 1) {
        next = current + 1;
      }
      this.set("page", this.pages[next]);
      this.set("title", this.titles[next]);
    } else {
      console.log("Invalid current page in wizard");
    }
  },
  prev: function() {
    var current = this.pages.indexOf(this.page);
    var prev = current;
    if (current !== -1) {
      if (current > 0) {
        prev = current - 1;
      }
      this.set("page", this.pages[prev]);
      this.set("title", this.titles[prev]);
    } else {
      console.log("Invalid current page in wizard");
    }
  },
  submit: function() {
    this.fire("submit");
  },
  _pageChanged: function() {
    var current = this.pages.indexOf(this.page);
    if (current === 0) {
      this.set("hasPrev", false);
    } else {
      this.set("hasPrev", true);
    }
    if (current === this.pages.length - 1) {
      this.set("hasNext", false);
    } else {
      this.set("hasNext", true);
    }
  },
  _errorChanged: function() {
    var ctx = this;
    Polymer.dom(this.$.form).childNodes.forEach(function(el) {
      var name = el.getAttribute("name");
      if (ctx.error && ctx.error[name]) {
        el.error = ctx.error[name];
      } else {
        el.error = null;
      }
    });
  },
  _deepClone: function(o) {
    return JSON.parse(JSON.stringify(o));
  },
  _isSchemaValue: function(type) {
    return (
      this._isSchemaBoolean(type) ||
      this._isSchemaNumber(type) ||
      this._isSchemaString(type) ||
      this._isSchemaFile(type)
    );
  },
  _isSchemaFile: function(type) {
    if (Array.isArray(type)) {
      return type.indexOf("file") !== -1;
    } else {
      return type === "file";
    }
  },
  _isSchemaBoolean: function(type) {
    if (Array.isArray(type)) {
      return type.indexOf("boolean") !== -1;
    } else {
      return type === "boolean";
    }
  },
  _isSchemaEnum: function(schema) {
    return !!schema.enum;
  },
  _isSchemaNumber: function(type) {
    if (Array.isArray(type)) {
      return type.indexOf("number") !== -1 || type.indexOf("integer") !== -1;
    } else {
      return type === "number" || type === "integer";
    }
  },
  _isSchemaString: function(type) {
    if (Array.isArray(type)) {
      return type.indexOf("string") !== -1;
    } else {
      return type === "string";
    }
  },
  _isSchemaObject: function(type) {
    return type === "object";
  },
  _isSchemaArray: function(type) {
    return type === "array";
  }
});
