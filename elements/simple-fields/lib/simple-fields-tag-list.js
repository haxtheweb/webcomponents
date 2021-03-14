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
 * @demo ./demo/tags.html Demo
 */
class SimpleFieldsTagList extends SimpleFieldsFieldBehaviors(LitElement) {
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
        #field-main-inner {
          align-items: center;
          flex-wrap: wrap;
        }
        simple-tag {
          flex: 0 1 auto;
          margin: calc(0.5 * var(--simple-fields-button-padding, 2px))
            var(--simple-fields-button-padding, 2px);
        }
        .drag-focus {
          background-color: var(--simple-fields-accent-color, #3f51b5);
        }
      `,
    ];
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
    this.addEventListener("dragleave", this._handleDragLeave);
    this.addEventListener("dragover", this._handleDragEnter);
    this.addEventListener("drop", this._handleDragDrop);
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
      <slot name="taglist">
        ${this.tagList.map(
          (tag) => html`
            <simple-tag
              cancel-button
              .data=${tag}
              value="${tag.term}"
              accent-color="${tag.color}"
              @simple-tag-clicked="${this.removeTag}"
            ></simple-tag>
          `
        )}
      </slot>
    `;
  }
  getInput() {
    return html`
      <span class="input-option" part="option-inner">
        <input
          @keydown="${this._handleKeydown}"
          @keyup="${this._handleKeyup}"
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
          name="${this.id}"
          .placeholder="${this.placeholder || ""}"
          ?readonly="${this.readonly}"
          ?required="${this.required}"
          tabindex="0"
          type="text"
          value="${this.value}"
          part="option-input"
        />
      </span>
    `;
  }
  removeTag(e) {
    this.tagList = [
      ...this.tagList.filter((i) => {
        if (i.term === e.detail.value) {
          return false;
        }
        return true;
      }),
    ];
  }
  _handleDragLeave(e) {
    this.classList.remove("drag-focus");
  }
  _handleDragEnter(e) {
    e.preventDefault();
    this.classList.add("drag-focus");
  }
  _handleDragDrop(e) {
    e.preventDefault();
    this.classList.remove("drag-focus");
    // sanity check we have text here; this HAS to have been set by
    if (JSON.parse(e.dataTransfer.getData("text"))) {
      let tmp = JSON.parse(e.dataTransfer.getData("text"));
      // ensure there is no duplicate value / term
      this.tagList = [
        ...this.tagList.filter((i) => {
          if (i.term === tmp.term) {
            return false;
          }
          return true;
        }),
      ];
      let tagList = this.tagList;
      tagList.push(tmp);
      this.tagList = [...tagList];
    }
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
    let tag = this.shadowRoot.querySelector("input").value;
    tag = tag.replace(/,$/, "").trim();
    // ensure there is no duplicate value / term
    this.tagList = [
      ...this.tagList.filter((i) => {
        if (i.term === this.shadowRoot.querySelector("input").value) {
          return false;
        }
        return true;
      }),
    ];
    let tagList = this.tagList;
    tagList.push({
      term: tag,
      color: "grey",
    });
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
