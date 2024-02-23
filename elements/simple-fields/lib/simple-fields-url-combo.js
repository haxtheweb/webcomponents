import { LitElement, html, css } from "lit";
import { SimpleFieldsFieldBehaviors } from "./simple-fields-field.js";
import { SimpleFieldsCombo } from "./simple-fields-combo.js";
import "./simple-fields-url-combo-item.js";

/**
 *`simple-fields-url-combo`
 * input tags and validate an array of input
 * can return as a string or object based on
 * requirements of the implementing element
 *
 * @customElement
 * @group simple-fields
 * @class SimpleFieldsUrlCombo
 * @extends {SimpleFieldsFieldBehaviors(LitElement)}
 * @demo ./demo/index.html Demo
 */
class SimpleFieldsUrlCombo extends SimpleFieldsCombo {
  static get tag() {
    return "simple-fields-url-combo";
  }
  static get styles() {
    return [
      super.styles,
      css`
        :host([display-as="grid"]) {
          --simple-fields-url-combo-preview-size: var(
            --simple-fields-url-combo-grid-preview-size,
            100px
          );
        }
        ul[role="listbox"] li[role="option"]:not(:last-child) {
          border-bottom: 1px solid var(--simple-fields-border-color-light, #ccc);
        }
        :host([display-as="columns"]) ul[role="listbox"] li[role="option"],
        :host([display-as="grid"]) ul[role="listbox"] li[role="option"] {
          border-radius: var(--simple-fields-border-radius, 2px);
          border: 1px solid var(--simple-fields-border-color-light, #ccc);
        }
        :host([always-expanded]) #field-main-inner {
          flex-wrap: wrap;
          --simple-fields-combo-max-height: var(
            --simple-fields-url-combox-expanded-max-height,
            unset
          );
        }
        .input-bottom,
        :host([always-expanded]) .border-bottom:not(.input-bottom),
        :host([always-expanded]) [part="option-icon"],
        :host([has-suggestions="false"]) [part="option-icon"] {
          display: none;
        }
        :host([always-expanded]) .input-bottom {
          display: block;
        }
        :host([always-expanded]) ul[role="listbox"] {
          border: none;
          position: static;
          opacity: 1;
          flex: 1 0 100%;
          margin: var(--simple-fields-margin-small, 8px) 0;
        }
        :host([display-as="columns"]) ul[role="listbox"] {
          grid-gap: var(--simple-fields-button-padding, 2px);
        }
        :host([display-as="grid"]) ul[role="listbox"] {
          grid-gap: var(--simple-fields-margin-small, 8px);
        }
        :host([display-as="columns"]) ul[role="listbox"],
        :host([display-as="grid"]) ul[role="listbox"] {
          display: grid;
          grid-template-columns: repeat(
            auto-fill,
            minmax(
              calc(
                var(--simple-fields-url-combo-preview-size) + 2 *
                  var(--simple-fields-button-padding, 2px)
              ),
              1fr
            )
          );
        }
        :host([display-as="grid"]) simple-fields-url-combo-item,
        :host([display-as="grid"]) ::slotted(simple-fields-url-combo-item) {
          flex-direction: column;
          align-items: center;
          text-align: center;
          justify-content: space-between;
          padding: var(--simple-fields-margin-small, 8px);
        }
        :host([display-as="grid"]) simple-fields-url-combo-item::part(preview),
        :host([display-as="grid"])
          ::slotted(simple-fields-url-combo-item::part(preview)) {
          display: block;
          margin-right: 0;
        }
      `,
    ];
  }

  static get properties() {
    return {
      ...super.properties,
      displayAs: {
        type: String,
        attribute: "display-as",
        reflect: true,
      },
      alwaysExpanded: {
        type: Boolean,
        attribute: "always-expanded",
        reflect: true,
      },
    };
  }
  constructor() {
    super();
    this.grid = false;
  }
  /**
   * overrides hiding listbox in grid mode
   *
   * @readonly
   * @memberof SimpleFieldsUrlCombo
   */
  get isListboxHidden() {
    return (
      !(this.alwaysExpanded || this.expanded) ||
      this.hidden ||
      this.filteredOptions.length < 1
    );
  }
  get listboxTemplate() {
    return html`
      <div class="border-bottom input-bottom blur"></div>
      <div class="border-bottom input-bottom focus"></div>
      ${super.listboxTemplate}
    `;
  }
  /**
   * overrides default combo list item display
   *
   * @param {*} option
   * @returns
   * @memberof SimpleFieldsUrlCombo
   */
  getListItemInner(option) {
    return html`<simple-fields-url-combo-item
      icon="${option.icon}"
      name="${option.name}"
      preview="${option.preview}"
      type="${option.type}"
      value="${option.value}"
    >
    </simple-fields-url-combo-item>`;
  }
  /**
   * allows for more option data, such as icon, preview, and type
   *
   * @param {*} option
   * @returns
   * @memberof SimpleFieldsUrlCombo
   */
  getOptionData(option, id) {
    return {
      value: typeof option === "object" ? option.value : option,
      name: typeof option === "object" ? option.name : undefined,
      icon: typeof option === "object" ? option.icon : undefined,
      preview: typeof option === "object" ? option.preview : undefined,
      type: typeof option === "object" ? option.type : undefined,
      id: id,
    };
  }
  /**
   * gets a sorted list of option
   *
   * @readonly
   * @memberof SimpleFieldsField
   */
  get sortedOptions() {
    let sorted = (this.itemsList || []).map((item, i) =>
      typeof item === "object" ? item : this.getOptionData(item, i),
    );
    Object.keys(this.options || {})
      .sort((a, b) => (a > b ? 1 : -1))
      .forEach((key) =>
        sorted.push(this.getOptionData(this.options[key], sorted.length)),
      );
    return sorted;
  }
  /**
   * is text an email address?
   *
   * @param {string} text
   * @returns {boolean}
   * @memberof SimpleFieldsUrlCombo
   */
  possibleEmail(text) {
    return text.match(/^\S+@\S+.\S+$/);
  }

  /**
   * is text a telephone number?
   *
   * @param {string} text
   * @returns {boolean}
   * @memberof SimpleFieldsUrlCombo
   */
  possiblePhone(text) {
    return text.match(
      /^(\+\d{1,3}\s?)?((\(\d{3}\)\s?)|(\d{3})(\s|-?))(\d{3}(\s|-?))(\d{4})(\s?(([E|e][X|x][T|t][\:|\.|]?)|x|X)(\s?\d+))?$/,
    );
  }
  /**
   * updates options list
   *
   * @param {event} event
   * @memberof SimpleFieldsCombo
   */
  filterOptions(filter, currentOption) {
    super.filterOptions(filter, currentOption);
    if (this.possibleEmail(filter)) {
      this.filteredOptions = [
        {
          value: `mailto:${filter}`,
          id: "mailto",
        },
        ...this.filteredOptions,
      ];
      this.open();
    } else if (this.possiblePhone(filter)) {
      this.filteredOptions = [
        {
          value: `tel:${filter
            .replace(/[\(\)\-\s\:\.]/g, "")
            .replace(/[a-zA-Z]+/, "p")}`,
          id: "tel",
        },
        ...this.filteredOptions,
      ];
      this.open();
    }
  }
}
customElements.define(SimpleFieldsUrlCombo.tag, SimpleFieldsUrlCombo);
export { SimpleFieldsUrlCombo };
