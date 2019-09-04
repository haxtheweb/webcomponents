import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import { AppLocalizeBehavior } from "@polymer/app-localize-behavior/app-localize-behavior.js";
import { mixinBehaviors } from "@polymer/polymer/lib/legacy/class.js";
import "@polymer/iron-flex-layout/iron-flex-layout-classes.js";
/**
`eco-json-schema-array` takes in a JSON schema of type array and builds a form,
exposing a `value` property that represents an array described by the schema.

Please see the `eco-json-schema-object` documentation for further information.

@group eco Elements
@element eco-json-schema-array
* @demo demo/index.html
*/
class EcoJsonSchemaArray extends mixinBehaviors(
  [AppLocalizeBehavior],
  PolymerElement
) {
  static get tag() {
    return "eco-json-schema-array";
  }
  constructor() {
    super();
    import("@polymer/iron-icons/iron-icons.js");
    import("@polymer/iron-icons/editor-icons.js");
    import("@polymer/paper-icon-button/paper-icon-button.js");
    import("@lrnwebcomponents/a11y-collapse/a11y-collapse.js");
    import("@lrnwebcomponents/a11y-collapse/lib/a11y-collapse-group.js");
  }
  static get template() {
    return html`
      <style include="iron-flex iron-flex-alignment">
        :host {
          color: var(--eco-json-form-color);
          background-color: var(--eco-json-form-bg);
          font-family: var(--eco-json-form-font-family);
        }
        :host ([hidden]) {
          display: none;
        }
        :host fieldset {
          border-radius: var(--eco-json-form-border-radius);
          border-style: solid;
          border-width: 1px;
          border-color: var(--eco-json-form-faded-color);
          transition: all 0.5s;
        }
        :host legend {
          transition: all 0.5s;
          color: var(--eco-json-form-faded-color);
        }
        :host fieldset:focus #legend,
        :host fieldset:focus-within #legend {
          color: var(--eco-json-form-active-color);
        }
        :host .array-item-button {
          color: var(--eco-json-form-faded-color);
          background-color: var(--eco-json-form-bg);
          text-transform: none;
          margin-bottom: 0;
        }
        :host .array-item-button:focus,
        :host .array-item-button:hover {
          color: var(--eco-json-form-active-color);
        }
        :host .add-array-item iron-icon {
          padding: 8px;
        }
        :host .add-array-item {
          color: var(--eco-json-form-add-color);
          border-radius: 0 0 var(--eco-json-form-border-radius);
          border: 1px solid var(--eco-json-form-bg);
          margin: 0;
          padding: 0 8px 0 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        :host .add-array-item:focus,
        :host .add-array-item:hover {
          color: var(--eco-json-form-add-color);
          background-color: var(--eco-json-form-faded-bg);
          border: 1px solid var(--eco-json-form-faded-color);
        }
        :host .remove-array-item {
          color: var(--eco-json-form-remove-color);
          background-color: var(--eco-json-form-bg);
          margin: 15px 0 0 0;
          border-radius: 100%;
        }
        :host .remove-array-item:focus,
        :host .remove-array-item:hover {
          color: var(--eco-json-form-remove-color);
          background-color: var(--eco-json-form-faded-bg);
        }
        :host a11y-collapse-group {
          margin: 0;
          border-radius: var(--eco-json-form-border-radius);
          --a11y-collapse-border: 1px solid var(--eco-json-form-faded-color);
        }
        :host a11y-collapse {
          --a11y-collapse-padding-right: 8px;
          border: 1px solid var(--eco-json-form-bg);
          --a11y-collapse-heading: {
            color: var(--eco-json-form-faded-color);
            background-color: var(--eco-json-form-bg);
            font-weight: normal;
            margin: 0;
          }
          --a11y-collapse-icon: {
            padding: 8px;
          }
        }
        :host a11y-collapse:focus,
        :host a11y-collapse:hover,
        :host a11y-collapse[expanded] {
          border: 1px solid var(--eco-json-form-faded-color);
          --a11y-collapse-heading: {
            color: var(--eco-json-form-color);
            background-color: var(--eco-json-form-faded-bg);
            font-weight: normal;
            margin: 0;
          }
        }
        :host p[slot="heading"] {
          margin: 0;
        }
        :host div[slot="content"] > div {
          width: 100%;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
        }
        :host .item-fields {
          flex: 1 0 auto;
        }
      </style>
      <fieldset>
        <legend id="legend" class="flex" hidden\$="[[!schema.title]]">
          [[schema.title]]
        </legend>
        <a11y-collapse-group
          id="form"
          icon="settings"
          class="vertical flex layout"
          global-options="[[globalOptions]]"
        >
          <template is="dom-repeat" items="[[schema.value]]" as="item" restamp>
            <a11y-collapse
              accordion
              id$="item-[[index]]"
              icon$="[[globalOptions.icon]]"
              tooltip$="[[globalOptions.tooltip]]"
            >
              <p slot="heading">
                {{_getHeading(__headings.*,schema.label,index)}}
              </p>
              <div slot="content">
                <div>
                  <div
                    id$="value-[[index]]"
                    class="item-fields"
                    data-index$="[[index]]"
                  ></div>
                  <paper-icon-button
                    id="remove-[[index]]"
                    icon="icons:delete"
                    aria-label="Remove this item"
                    aria-describedby="item-[[index]]"
                    class="remove-array-item array-item-button"
                    controls="item-[[index]]"
                    on-tap="_onRemoveItem"
                    role="button"
                  >
                  </paper-icon-button>
                  <paper-tooltip for="remove-[[index]]"
                    >Remove this item</paper-tooltip
                  >
                </div>
              </div>
            </a11y-collapse>
          </template>
        </a11y-collapse-group>
        <paper-button
          class="add-array-item array-item-button"
          on-click="_onAddItem"
          role="button"
        >
          Add an item
          <iron-icon icon="add-circle"></iron-icon>
        </paper-button>
      </fieldset>
    `;
  }
  static get properties() {
    return {
      globalOptions: {
        type: Object,
        value: {
          icon: "settings",
          tooltip: "configure item"
        },
        notify: true
      },
      propertyName: {
        type: String,
        value: null
      },
      schema: {
        type: Object,
        value: {},
        notify: true,
        observer: "_schemaChanged"
      },
      __headings: {
        type: Array,
        value: [],
        notify: true
      }
    };
  }
  ready() {
    super.ready();
    this.__headings = [];
    this._schemaChanged();

    //update the headings if the data changes
    this.addEventListener("form-field-changed", e => {
      this._updateHeadings(e);
    });
  }
  disconnectedCallback() {
    this.removeEventListener("form-field-changed", e => {
      this._updateHeadings(e);
    });
    super.disconnectedCallback();
  }
  /**
   * updates the array fields if the schema (which includes values) changes
   */
  _schemaChanged() {
    //make sure the content is there first
    afterNextRender(this, () => {
      let itemLabel = this.schema.items.itemLabel;
      if (this.schema.value)
        this.schema.value.forEach(val => {
          this.push("__headings", val[itemLabel]);
        });
      this.shadowRoot.querySelectorAll(".item-fields").forEach(item => {
        let index = item.getAttribute("data-index"),
          propertyName = `${this.propertyPrefix}${this.propertyName}`,
          prefix = `${propertyName}.${index}`,
          path = `${propertyName}.properties.${index}`,
          val = this.schema.value[index];

        //for each array item, request the fields frrom eco-json-schema-object
        this.dispatchEvent(
          new CustomEvent("build-fieldset", {
            bubbles: false,
            cancelable: true,
            composed: true,
            detail: {
              container: item,
              path: path,
              prefix: prefix,
              properties: this.schema.properties.map(prop => {
                let newprop = JSON.parse(JSON.stringify(prop));
                newprop.value = val[prop.name];
                return newprop;
              }),
              type: EcoJsonSchemaArray.tag
            }
          })
        );
      });
    });
  }
  /**
   * handles adding an array item
   * @param {event} e the add item button tap event
   */
  _onAddItem(e) {
    let val = {};
    //add default values to the new item
    this.schema.properties.forEach(prop => {
      val[prop.name] = prop.value;
    });
    this.push("schema.value", val);
    this.notifyPath("schema.value.*");
    this._schemaChanged();
  }
  /**
   * handles removing an array item
   * @param {event} e the remove item button tap event
   */
  _onRemoveItem(e) {
    //remove the data for an item at a given index
    let index = e.target.controls.replace(/item-/, "");
    this.splice("schema.value", index, 1);
    this.notifyPath("schema.value.*");
    this._schemaChanged();
  }
  /**
   * updates the list expandable headings for each item
   * @param {event} e the event that triggers an update
   */
  _updateHeadings(e) {
    let propname = e.detail.getAttribute("name"),
      val = e.detail.value,
      pathArr = propname ? propname.split(".") : [],
      index = pathArr.length > 2 ? pathArr[pathArr.length - 2] : null,
      update =
        e.detail.propertyName === this.schema.items.itemLabel
          ? val
          : this.__headings[index];
    if (index) this.set(`__headings.${index}`, update);
  }
  /**
   * labels the collapse heading based on a given property
   * @param {object} headings item the array item
   * @param {string} label prop the property that will populate the collapse heading
   * @param {number} index the index of the item
   * @returns {string} the expanable heading label
   */
  _getHeading(headings, label, index) {
    //if there is no heading, number the item instead
    return this.__headings &&
      this.__headings[index] &&
      typeof this.__headings[index] === "string" &&
      this.__headings[index].trim("") !== ""
      ? this.__headings[index].trim("")
      : label && typeof label === "string" && label.trim("") !== ""
      ? `${label.trim("")} ${index + 1}`
      : `Item ${index + 1}`;
  }
}
window.customElements.define(EcoJsonSchemaArray.tag, EcoJsonSchemaArray);
export { EcoJsonSchemaArray };
