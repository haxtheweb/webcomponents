import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import { dom } from "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
import "../node_modules/@polymer/iron-flex-layout/iron-flex-layout-classes.js";
import "../node_modules/@polymer/iron-icons/image-icons.js";
import "../node_modules/@polymer/iron-icons/iron-icons.js";
import "../node_modules/@polymer/iron-icons/editor-icons.js";
import "../node_modules/@polymer/iron-pages/iron-pages.js";
import "../node_modules/@polymer/app-layout/app-toolbar/app-toolbar.js";
import "../node_modules/@polymer/paper-menu-button/paper-menu-button.js";
import "../node_modules/@polymer/paper-icon-button/paper-icon-button.js";
import "../node_modules/@polymer/paper-ripple/paper-ripple.js";
import { AppLocalizeBehavior } from "../node_modules/@polymer/app-localize-behavior/app-localize-behavior.js";
import "./eco-json-schema-object.js";
import "./eco-json-schema-array.js";
import "./eco-json-schema-boolean.js";
import "./eco-json-schema-enum.js";
import "./eco-json-schema-file.js";
import "./eco-json-schema-input.js";
Polymer({
  is: "eco-json-schema-wizard",
  behaviors: [AppLocalizeBehavior],
  _template: html`
  <style is="custom-style" include="iron-flex iron-flex-alignment">
       :host {
        display: block;
        @apply --layout-vertical;
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

      app-toolbar.bottom {
        --app-toolbar-color: var(--app-primary-color);
        --app-toolbar-background: var(--dark-theme-text-color);
      }

      app-toolbar.bottom paper-icon-button {
        --app-toolbar-color: var(--dark-theme-text-color);
        --app-toolbar-background: var(--app-primary-color);
      }

    </style>
    <div class="vertical flex layout fullbleed">
      <!--paper-icon-button id="camButton" icon="editor:insert-photo" raised>add photo</paper-icon-button-->
      <app-toolbar>
        <paper-icon-button id="prevButton" icon="arrow-back" hidden\$="{{!hasPrev}}" on-tap="prev" raised="">{{localize('prev')}}</paper-icon-button><span class="title layout horizontal flex" style="white-space: normal">[[title]]</span>
        <paper-icon-button id="nextButton" icon="arrow-forward" hidden\$="{{!hasNext}}" on-tap="next" raised="">{{localize('next')}}</paper-icon-button>
        <paper-icon-button id="submitButton" icon="cloud-upload" on-tap="submit" raised="">{{localize('submit')}}</paper-icon-button>
      </app-toolbar>
      <iron-pages id="form" class="layout horizontal flex start-justified" role="main" selected="[[page]]" attr-for-selected="name"></iron-pages>
      <app-toolbar class="bottom">
        <div hidden\$="{{!hasPrev}}" on-tap="prev">
          <paper-icon-button id="prevButton" icon="arrow-back" raised="">{{localize('prev')}}</paper-icon-button>
          <span class="title layout" style="white-space: normal">{{localize('prev')}}</span>
        </div>
        <span class="title layout horizontal flex" style="white-space: normal"></span>
        <div hidden\$="{{!hasNext}}" on-tap="next">
          <span class="title layout" style="white-space: normal">{{localize('next')}}</span>
          <paper-icon-button id="nextButton" icon="arrow-forward" raised="">{{localize('next')}}</paper-icon-button>
        </div>
      </app-toolbar>
    </div>
`,
  properties: {
    language: { type: String, notify: !0 },
    resources: { type: Object, notify: !0 },
    schema: { type: Object, notify: !0, observer: "_schemaChanged" },
    label: { type: String },
    value: {
      type: Object,
      notify: !0,
      value: function() {
        return {};
      }
    },
    page: { type: String, notify: !0, observer: "_pageChanged" },
    pages: { type: Array, notify: !0, value: [] },
    error: { type: Object, observer: "_errorChanged" },
    isReview: { type: Boolean, value: !1, notify: !0 },
    canSubmit: { type: Boolean, notify: !0 },
    hasNext: { type: Boolean, notify: !0 },
    hasPrev: { type: Boolean, notify: !0 },
    titles: { type: Array, notify: !0, value: [] },
    title: { type: String, value: "", notify: !0 }
  },
  detached: function() {
    this._clearForm();
  },
  _buildSchemaProperties: function() {
    var ctx = this;
    this._schemaProperties = Object.keys(this.schema.properties || []).map(
      function(key) {
        var schema = ctx.schema.properties[key],
          property = {
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
          property.value = !1;
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
          property.component.wizard = !0;
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
    var ctx = this,
      property = event.target.schemaProperty,
      path = ["value", property.property];
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
      var parts = detail.path.split(".").slice(1),
        v = this.value;
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
    var ctx = this,
      value = {};
    this._schemaProperties.forEach(function(property) {
      value[property.property] = ctx._deepClone(property.value);
    });
    this.value = value;
  },
  _buildForm: function() {
    var ctx = this;
    this._schemaProperties.forEach(property => {
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
      dom(ctx.$.form).appendChild(el);
    });
  },
  _removePropertyEl: function(el) {
    if (typeof el.schemaProperty !== typeof void 0) {
      this.unlisten(
        el,
        el.schemaProperty.component.valueProperty
          .replace(/([A-Z])/g, "-$1")
          .toLowerCase() + "-changed",
        "_schemaPropertyChanged"
      );
    }
    el.schemaProperty = null;
    dom(this.$.form).removeChild(el);
  },
  _clearForm: function() {
    var formEl = dom(this.$.form);
    while (formEl.firstChild) {
      this._removePropertyEl(formEl.firstChild);
    }
  },
  _schemaChanged: function() {
    this._clearForm();
    this._buildSchemaProperties();
    this._buildForm();
    this._setValue();
    if (0 < this.pages.length) {
      this.set("page", this.pages[0]);
    }
    this.set("title", this.titles[0]);
  },
  next: function() {
    var current = this.pages.indexOf(this.page),
      next = current;
    if (-1 !== current) {
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
    var current = this.pages.indexOf(this.page),
      prev = current;
    if (-1 !== current) {
      if (0 < current) {
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
    if (0 === current) {
      this.set("hasPrev", !1);
    } else {
      this.set("hasPrev", !0);
    }
    if (current === this.pages.length - 1) {
      this.set("hasNext", !1);
    } else {
      this.set("hasNext", !0);
    }
  },
  _errorChanged: function() {
    var ctx = this;
    dom(this.$.form).childNodes.forEach(function(el) {
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
      return -1 !== type.indexOf("file");
    } else {
      return "file" === type;
    }
  },
  _isSchemaBoolean: function(type) {
    if (Array.isArray(type)) {
      return -1 !== type.indexOf("boolean");
    } else {
      return "boolean" === type;
    }
  },
  _isSchemaEnum: function(schema) {
    return !!schema.enum;
  },
  _isSchemaNumber: function(type) {
    if (Array.isArray(type)) {
      return -1 !== type.indexOf("number") || -1 !== type.indexOf("integer");
    } else {
      return "number" === type || "integer" === type;
    }
  },
  _isSchemaString: function(type) {
    if (Array.isArray(type)) {
      return -1 !== type.indexOf("string");
    } else {
      return "string" === type;
    }
  },
  _isSchemaObject: function(type) {
    return "object" === type;
  },
  _isSchemaArray: function(type) {
    return "array" === type;
  }
});
