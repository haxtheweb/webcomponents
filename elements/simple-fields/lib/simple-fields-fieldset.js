import { LitElement, html, css } from "lit";
import {
  SimpleFieldsBaseStyles,
  SimpleFieldsFieldsetStyles,
  SimpleFieldsDescriptionStyles,
} from "./simple-fields-ui.js";
/**
 * @class SimpleFieldsFieldsetBehaviors
 */
const SimpleFieldsFieldsetBehaviors = function (SuperClass) {
  return class extends SuperClass {
    constructor() {
      super();
      this.isSimpleFieldType = true;
    }
    static get tag() {
      return "simple-fields-fieldset";
    }
    static get styles() {
      return [
        ...SimpleFieldsBaseStyles,
        ...SimpleFieldsFieldsetStyles,
        ...SimpleFieldsDescriptionStyles,
        css`
          :host(:last-of-type) {
            margin-bottom: 0;
          }
        `,
      ];
    }
    render() {
      return html`
        <fieldset part="fieldset">
          ${this.legend} ${this.desc} ${this.fields}
        </fieldset>
      `;
    }
    get legend() {
      return html`
        <legend id="label" ?hidden="${!this.label}" part="legend">
          ${this.label}${this.error ? "*" : ""}
        </legend>
      `;
    }
    get desc() {
      return html`
        <div id="description" ?hidden="${!this.description}" part="description">
          ${this.description}
        </div>
      `;
    }
    get fields() {
      return html`
        <div
          id="item-fields"
          part="fields"
          exportparts="option, option-inner, option-label, option-input"
        >
          <slot></slot>
        </div>
      `;
    }
    static get properties() {
      return {
        /**
         * whether the tabbed interface is disabled
         */
        disabled: {
          type: Boolean,
          reflect: true,
        },
        /**
         * a simple boolean so that we can easily select ALL
         * things derived from simple fields regardless of
         * their eventual tag name
         */
        isSimpleFieldType: {
          type: Boolean,
          reflect: true,
          attribute: "is-simple-field-type",
        },
        /**
         * whether fieldset has fields with errors
         */
        error: {
          type: Boolean,
          reflect: true,
        },
        /**
         * whether the tabbed interface is hidden
         */
        hidden: {
          type: Boolean,
          reflect: true,
        },
        /**
         * Whether field and label should be inline
         */
        inline: {
          type: Boolean,
          reflect: true,
        },
        /**
         * whether the tabbed interface is hidden
         */
        readonly: {
          type: Boolean,
          reflect: true,
        },
        /**
         * fieldset legend
         */
        label: {
          type: String,
          reflect: true,
        },
        /**
         * unique name
         */
        name: {
          type: String,
          reflect: true,
          attribute: "name",
        },
        /**
         * optional description
         */
        description: {
          type: String,
        },
      };
    }
  };
};
/**
 *`simple-fields-fieldset` takes in a JSON schema of type fieldset and builds a form,
 * exposing a `value` property that represents an array described by the schema.
 *
 * @group simple-fields
 * @element simple-fields-fieldset
 * @class SimpleFieldsFieldset
 * @extends {SimpleFieldsFieldsetBehaviors(LitElement)}
 */
class SimpleFieldsFieldset extends SimpleFieldsFieldsetBehaviors(LitElement) {}
customElements.define(SimpleFieldsFieldset.tag, SimpleFieldsFieldset);
export { SimpleFieldsFieldset, SimpleFieldsFieldsetBehaviors };
