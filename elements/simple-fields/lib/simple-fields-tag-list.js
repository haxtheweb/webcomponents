import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleFieldsFieldBehaviors } from "./simple-fields-field.js";
import "./simple-tag.js";

/**
 *`simple-fields-tag-list`
 * input tags and validate an array of input
 * can return as a string or object based on
 * requirements of the implementing element
 *
 * @customElement
 * @group simple-fields
 * @element simple-fields-code
 * @demo ./demo/field.html
 * @class SimpleFieldsTagList
 * @extends {class SimpleFieldsTagList extends SimpleFieldsFieldBehaviors(LitElement) {
(LitElement)}
 */
class SimpleFieldsTagList extends SimpleFieldsFieldBehaviors(LitElement) {
  static get tag() {
    return "simple-fields-tag-list";
  }
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        #field-main-inner {
          align-items: center;
          flex-wrap: wrap;
        }
        simple-tag {
          flex: 0 1 auto;
          margin: calc(0.5 * var(--simple-fields-button-padding, 2px))
            var(--simple-fields-button-padding, 2px);
        }
      `,
    ];
  }
  render() {
    return !this.hasFieldSet ? super.render() : this.fieldsetTemplate;
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * error message when field is required and has no value
       */
      requiredMessage: {
        type: String,
      },
      tagList: {
        type: Array,
        attribute: "tag-list",
      },
      /**
       * Current value of the form control. Submitted with the form as part of a name/value pair.
       */
      value: {
        reflect: true,
      },
      label: {
        type: String,
      },
    };
  }
  constructor() {
    super();
    this.label = "Tags";
    this.value = "";
    this.tagList = [];
    this.id = this._generateUUID();
  }
  disconnectedCallback() {
    this.removeEventListener("click", (e) => this.focus());
    super.disconnectedCallback();
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "id" && !this.id) this.id = this._generateUUID();
      if (propName === "value") this._fireValueChanged();
    });
  }

  /**
   * template for slotted or shadow DOM prefix
   *
   * @readonly
   * @returns {object}
   * @memberof SimpleFieldsContainer
   */
  get prefixTemplate() {
    return html`
      ${super.prefixTemplate}
      ${this.tagList.map(
        (tag) => html`
          <simple-tag
            value="${tag}"
            @simple-tag-clicked="${this.removeTag}"
          ></simple-tag>
        `
      )}
    `;
  }
  getInput() {
    return html`
      <span class="input-option" part="option-inner">
        <input
          ?autofocus="${this.autofocus}"
          aria-descrbedby="${this.describedBy || ""}"
          .aria-invalid="${this.error ? "true" : "false"}"
          @blur="${this._onFocusout}"
          @change="${this._handleFieldChange}"
          class="field box-input"
          ?disabled="${this.disabled}"
          @focus="${this._onFocusin}"
          ?hidden="${this.hidden}"
          id="${this.id}"
          @input="${this._handleFieldChange}"
          @keydown="${this._handleKeydown}"
          @keyup="${this._handleKeyup}"
          name="${this.id}"
          .placeholder="${this.placeholder || ""}"
          ?readonly="${this.readonly}"
          ?required="${this.required}"
          tabindex="0"
          type="${this.type}"
          value="${this.value}"
          part="option-input"
        />
      </span>
    `;
  }
  removeTag(e) {
    this.tagList = [
      ...this.tagList.filter((i) => {
        if (i === e.detail.value) {
          return false;
        }
        return true;
      }),
    ];
  }
  _handleKeydown(e) {
    if (
      e.key === "Enter" &&
      this.shadowRoot.querySelector("input").value != ""
    ) {
      this._updateTaglist();
    }
  }
  _handleKeyup(e) {
    if (e.key === "," && this.shadowRoot.querySelector("input").value != "") {
      this._updateTaglist();
    }
  }
  _updateTaglist() {
    // @todo prevent same tag from being added twice
    let tagList = this.tagList,
      tag = this.shadowRoot.querySelector("input").value;
    tagList.push(tag.replace(/,$/, "").trim());
    this.tagList = [...tagList];
    this.shadowRoot.querySelector("input").value = "";
  }
  /**
   * overridden mutation observer
   *
   * @readonly
   * @memberof SimpleFieldsContainerBehaviors
   */
  get slottedFieldObserver() {}

  /**
   * checks validation constraints and returns error data
   * @memberof SimpleFieldsCode
   */
  validate() {
    if (!this.value && this.required) {
      this.error = true;
      this.errorMessage = this.requiredMessage || `required`;
    }
    // to match container response
    return !this.error;
  }

  /**
   * fires when value changes
   * @event value-changed
   */
  _fireValueChanged() {
    this.dispatchEvent(
      new CustomEvent("value-changed", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this,
      })
    );
  }
  /**
   * listens for focusout
   * overridden for fields in shadow DOM
   *
   * @param {boolean} [init=true] whether to start observing or disconnect observer
   */
  _observeAndListen(init = true) {
    if (init) {
      this.addEventListener("click", this.focus);
      this.addEventListener("focusout", this._onFocusout);
      this.addEventListener("focusin", this._onFocusin);
    } else {
      this.removeEventListener("click", this.focus);
      this.removeEventListener("focusout", this._onFocusout);
      this.removeEventListener("focusin", this._onFocusin);
    }
  }
}
window.customElements.define(SimpleFieldsTagList.tag, SimpleFieldsTagList);
export { SimpleFieldsTagList };
