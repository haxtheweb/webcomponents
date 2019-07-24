import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import { AppLocalizeBehavior } from "@polymer/app-localize-behavior/app-localize-behavior.js";
import { mixinBehaviors } from "@polymer/polymer/lib/legacy/class.js";
import "@lrnwebcomponents/a11y-tabs/a11y-tabs.js";
/**
`eco-json-schema-tabs` takes in a JSON schema of type array and builds a form,
exposing a `value` property that represents an array described by the schema.

Please see the `eco-json-schema-object` documentation for further information.

@group eco Elements
@element eco-json-schema-tabs
* @demo demo/index.html
*/
class EcoJsonSchemaTabs extends mixinBehaviors(
  [AppLocalizeBehavior],
  PolymerElement
) {
  static get tag() {
    return "eco-json-schema-tabs";
  }
  static get template() {
    return html`
      <custom-style>
        <style is="custom-style" include="iron-flex iron-flex-alignment">
          :host{
            color: var(--eco-json-form-color);
            background-color: var(--eco-json-form-bg);
            font-family: var(--eco-json-form-font-family);
          }
          :host ([hidden]) {
            display: none;
          }
          :host #form {
            --a11y-tabs-color: var(--eco-json-form-faded-color);
            --a11y-tabs-focus-color: var(--eco-json-form-color);
            --a11y-tabs-border-color: var(--eco-json-form-faded-color);
            --a11y-tabs-border-radius: var(--eco-json-form-border-radius);
            --a11y-tabs-background: var(--eco-json-form-bg);
            --a11y-tabs-faded-background: var(--eco-json-form-faded-bg);
            --a11y-tabs-justify-tabs: flex-start;
            --ally-tabs-wrap: unset;
            --a11y-tabs-content-padding: 8px 16px 16px;
            --a11y-tabs-button-padding: 8px;
            --a11y-tabs-vertical-button-padding: unset;
            --a11y-tabs-horizontal-border-radius: unset;
            --a11y-tabs-vertical-border-radius: unset;
            --a11y-tabs-horizontal-button-padding: 2px 5px;
          }
          :host #form:focus,
          :host #form:focus-within {
            --a11y-tabs-border-color: : var(--eco-json-form-focus-color);
          }
          :host .tab-title {
            position: absolute;
            left: -99999px;
            height: 0;
            overflow: hidden;
          }
        </style>
      </custom-style>
      <a11y-tabs id="form">
        <template
          is="dom-repeat"
          items="[[__validatedSchema]]"
          as="item"
          restamp
        >
          <a11y-tab
            id$="item-[[index]]"
            icon$="[[item.icon]]"
            label$="[[item.title]]"
          >
            <eco-json-schema-object
              id="schemaobject"
              controls$="item-[[index]]"
              item="[[index]]"
              autofocus$="[[autofocus]]"
              on-value-changed="_valueChanged"
              hide-line-numbers$="[[hideLineNumbers]]"
              schema="[[item]]"
              value="{{item.value}}"
            >
            </eco-json-schema-object>
          </a11y-tab>
        </template>
      </a11y-tabs>
    `;
  }
  static get properties() {
    return {
      /**
       * automatically set focus on the first field if that field has autofocus
       */
      autofocus: {
        type: "Boolean",
        value: false
      },
      /**
       * hide code-editor line numbers
       */
      hideLineNumbers: {
        type: Boolean,
        value: false
      },
      schema: {
        type: Object,
        notify: true,
        observer: "_schemaChanged"
      },
      value: {
        type: Array,
        notify: true,
        value: {}
      },
      /**
       * Fields to conver to JSON Schema.
       */
      __validatedSchema: {
        type: Array,
        value: [],
        notify: true
      }
    };
  }
  /**
   * Handles data changes
   * @param {event} e the change event
   */
  _valueChanged(e) {
    let root = this,
      val = this.__validatedSchema.map(item => {
        return item.value;
      });
    this.notifyPath("value.*");
    this.set("value", val);
    this.dispatchEvent(
      new CustomEvent("value-changed", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: root
      })
    );
  }

  /**
   * fires when the fields array changes
   * @param {object} oldValue the old value
   * @param {object} newValue the new value
   */
  _schemaChanged(oldValue, newValue) {
    let root = this;
    //prevent a potential feedback loop
    if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
      this._setValues();
    }
    this.dispatchEvent(
      new CustomEvent("schema-changed", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: root
      })
    );
  }
  /**
   * when either the fields or the value changes, updates the schema and form to match
   */
  _setValues() {
    let schema = [];
    for (let prop in this.schema.items.properties) {
      let tab = {
        title: this.schema.items.properties[prop].title,
        icon: this.schema.items.properties[prop].icon,
        properties: this.schema.items.properties[prop].items
          ? this.schema.items.properties[prop].items.properties
          : {},
        value:
          this.value && this.value[prop]
            ? JSON.parse(JSON.stringify(this.value[prop]))
            : {}
      };
      for (let subprop in tab.properties) {
        if (tab.properties.value) delete tab.properties.value;
        if (this.value && this.value[prop])
          tab.properties[subprop].value = this.value[prop][subprop];
      }
      schema.push(tab);
    }
    this.notifyPath("__validatedSchema.*");
    this.__validatedSchema = [];
    this.__validatedSchema = schema;
  }
}
window.customElements.define(EcoJsonSchemaTabs.tag, EcoJsonSchemaTabs);
export { EcoJsonSchemaTabs };
