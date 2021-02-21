import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleFieldsContainer } from "./simple-fields-container.js";
import { normalizeEventPath } from "@lrnwebcomponents/utils/utils.js";
import "./simple-tag.js";

/**
 *`simple-fields-tag-list`
 * input tags and validate an array of input
 * can return as a string or object based on
 * requirements of the implementing element
 *
 * @group simple-fields
 * @extends simple-fields-container
 * @element simple-fields-code
 * @demo ./demo/field.html
 */
class SimpleFieldsTagList extends SimpleFieldsContainer {
  static get tag() {
    return "simple-fields-tag-list";
  }
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
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
   * template label and field
   *
   * @readonly
   * @returns {object}
   * @memberof SimpleFieldsContainer
   */
  get fieldMainTemplate() {
    return html`
      <div class="field-main" part="field-main">
        ${this.tagList.map(
          (tag) => html`
            <simple-tag
              value="${tag}"
              @simple-tag-remove-clicked="${this.removeTag}"
            ></simple-tag>
          `
        )}
        <simple-fields-field
          @keydown="${this._handleKeydown}"
          ?disabled="${this.disabled}"
          name="${this.id}"
          value="${this.value}"
          type="text"
          label="${this.label}"
          required
        ></simple-fields-field>
      </div>
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
      this.shadowRoot.querySelector("simple-fields-field").value != ""
    ) {
      // @todo prevent same tag from being added twice
      let tagList = this.tagList;
      tagList.push(this.shadowRoot.querySelector("simple-fields-field").value);
      this.tagList = [...tagList];
      this.shadowRoot.querySelector("simple-fields-field").value = "";
    }
  }
  /**
   * overridden mutation observer
   *
   * @readonly
   * @memberof SimpleFieldsContainer
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
   * @memberof SimpleFieldsContainer
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
  /**
   * generates a unique id
   * @returns {string } unique id
   */
  _generateUUID() {
    return "ss-s-s-s-sss".replace(
      /s/g,
      Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
    );
  }
}
window.customElements.define(SimpleFieldsTagList.tag, SimpleFieldsTagList);
export { SimpleFieldsTagList };
