import { LitElement, html, css } from "lit-element/lit-element.js";

/**
`simple-fields-array` takes in a JSON schema of type array and builds a form,
exposing a `value` property that represents an array described by the schema.

@group simple-fields
@customeElement simple-fields-array
* @demo demo/index.html
*/
class SimpleFieldsArray extends LitElement {
  static get tag() {
    return "simple-fields-array";
  }
  constructor() {
    super();
    setTimeout(() => {
      import("@polymer/iron-icons/iron-icons.js");
      import("@polymer/iron-icons/editor-icons.js");
      import("@polymer/paper-icon-button/paper-icon-button.js");
      import("@lrnwebcomponents/simple-tooltip/simple-tooltip.js");
      import("@lrnwebcomponents/a11y-collapse/a11y-collapse.js");
      import("@lrnwebcomponents/a11y-collapse/lib/a11y-collapse-group.js");
    }, 0);
  }
  static get styles() {
    return [css``];
  }
  render() {
    return html`
      <fieldset>
        <legend id="legend" class="flex" ?hidden="${!this.schema.title}">
          ${this.schema.title}
        </legend>
        <a11y-collapse-group
          id="form"
          icon="settings"
          class="vertical flex layout"
          global-options="${this.globalOptions}"
        >
          ${this.schema.value.map(
            item,
            index => html`
              <a11y-collapse
                accordion
                id="item-${index}"
                .icon="${this.globalOptions.icon}"
                .tooltip="${this.globalOptions.tooltip}"
              >
                <p slot="heading">
                  ${this._getHeading(this.__headings, this.schema.label, index)}
                </p>
                <div slot="content">
                  <div>
                    <div
                      id="value-${index}"
                      class="item-fields"
                      .data-index="${index}"
                    >
                      <slot></slot>
                    </div>
                    <paper-icon-button
                      id="remove-${index}"
                      icon="icons:delete"
                      aria-label="Remove this item"
                      aria-describedby="item-${index}"
                      class="remove-array-item array-item-button"
                      controls="item-${index}"
                      on-tap="_onRemoveItem"
                      role="button"
                    >
                    </paper-icon-button>
                    <simple-tooltip for="remove-${index}">
                      Remove this item
                    </simple-tooltip>
                  </div>
                </div>
              </a11y-collapse>
            `
          )}
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
  _toArray(obj) {
    if (obj == null) {
      return [];
    }
    return Object.keys(obj).map(function(key) {
      return obj[key];
    });
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
    setTimeout(() => {
      let itemLabel = this.schema.items.itemLabel;
      if (this.schema && Array.isArray(this.schema.value)) {
        this.schema.value.forEach(val => {
          this.push("__headings", val[itemLabel]);
        });
      }
      this.shadowRoot.querySelectorAll(".item-fields").forEach(item => {
        let index = item.getAttribute("data-index"),
          propertyName = `${this.propertyPrefix}${this.propertyName}`,
          prefix = `${propertyName}.${index}`,
          //path = `${propertyName}.properties.${index}`,
          val = this.schema.value[index];
        //for each array item, request the fields frrom eco-json-schema-object
        this.dispatchEvent(
          new CustomEvent("build-fieldset", {
            bubbles: false,
            cancelable: true,
            composed: true,
            detail: {
              container: item,
              path: propertyName,
              prefix: prefix,
              properties: this.schema.properties.map(prop => {
                let newprop = JSON.parse(JSON.stringify(prop));
                newprop.value = val[prop.name];
                return newprop;
              }),
              type: SimpleFieldsArray.tag,
              value: this.schema.value || []
            }
          })
        );
      });
    }, 0);
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
    this.notifyPath("schema.*");
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
    this.notifyPath("schema.*");
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
window.customElements.define(SimpleFieldsArray.tag, SimpleFieldsArray);
export { SimpleFieldsArray };
