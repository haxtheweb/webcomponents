import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { AppLocalizeBehavior } from "@polymer/app-localize-behavior/app-localize-behavior.js";
import { mixinBehaviors } from "@polymer/polymer/lib/legacy/class.js";
import "@lrnwebcomponents/a11y-tabs/a11y-tabs.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status";
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
            margin-bottom: 15px;
          }
          :host ([hidden]) {
            display: none;
          }
          :host a11y-tabs {
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
          :host a11y-tabs:focus,
          :host a11y-tabs:focus-within {
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
      <a11y-tabs id$="[[schema.property]]">
        <template
          is="dom-repeat"
          items="[[schema.properties]]"
          as="item"
          restamp
        >
          <a11y-tab
            id$="item-[[index]]"
            icon$="[[item.icon]]"
            label$="[[item.label]]"
          >
            <div hidden$="[[!item.description]]">[[item.description]]</div>
            <div
              id$="[[item.property]]"
              class="item-fields"
              data-index$="[[index]]"
            ></div>
          </a11y-tab>
        </template>
      </a11y-tabs>
    `;
  }
  static get properties() {
    return {
      propertyName: {
        type: String,
        value: null
      },
      schema: {
        type: Object,
        value: {}
      }
    };
  }
  ready() {
    super.ready();
    this._schemaChanged();
  }
  /**
   * updates the array fields if the schema (which includes values) changes
   */
  _schemaChanged() {
    //make sure the content is there first
    afterNextRender(this, () => {
      this.shadowRoot.querySelectorAll(".item-fields").forEach(item => {
        let index = item.getAttribute("data-index"),
          propertyName = this.propertyName,
          tab = this.schema.properties[index],
          prop = tab.name,
          prefix = `${propertyName}.${prop}`,
          path = `${propertyName}.properties.${index}`;
        this.dispatchEvent(
          new CustomEvent("build-fieldset", {
            bubbles: false,
            cancelable: true,
            composed: true,
            detail: {
              container: item,
              path: path,
              prefix: prefix,
              properties: tab.schema.properties,
              type: EcoJsonSchemaTabs.tag
            }
          })
        );
      });
    });
  }
}
window.customElements.define(EcoJsonSchemaTabs.tag, EcoJsonSchemaTabs);
export { EcoJsonSchemaTabs };
