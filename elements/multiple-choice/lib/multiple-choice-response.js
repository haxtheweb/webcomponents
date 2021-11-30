import { html, css, LitElement } from "lit";
import "@lrnwebcomponents/simple-fields/lib/simple-fields-field.js";
/**
 * `multiple-choice-response`
 * `Ask the user a question from a set of possible answers.`
 * @demo demo/index.html
 * @element multiple-choice-response
 */
class MultipleChoiceResponse extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: flex;
          width: 100%;
        }
        #slot {
          flex: 1 0 auto;
        }
        simple-fields-field {
          flex: 0 0 auto;
          margin: 0;
        }
        ::slotted(*) {
          font-size: var(--simple-fields-font-size, 16px);
          text-align: var(--simple-fields-text-align);
          font-family: var(--simple-fields-font-family, sans-serif);
          line-height: var(--simple-fields-line-height, 22px);
        }
      `,
    ];
  }
  static get tag() {
    return "multiple-choice-response";
  }
  constructor() {
    super();
    this.correct = false;
    this.type = "checkbox";
  }
  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {});
    this.slot = "responses";
  }
  _handleClick(e) {
    this.correct = e.detail.value;
  }
  render() {
    return html` <simple-fields-field
        aria-labelledby="slot"
        type="${this.type}"
        @value-changed="${this._handleClick}"
        .value="${!!this.correct}"
      ></simple-fields-field>
      <slot id="slot" property="oer:answer"></slot>`;
  }
  static get properties() {
    return {
      ...super.properties,
      /**
       * whether the answer is correct
       */
      correct: {
        type: Boolean,
      },
      /**
       * whether the answer is correct
       */
      disabled: {
        type: Boolean,
      },
      /**
       * type of answer
       */
      type: {
        type: String,
      },
    };
  }
}
window.customElements.define(
  MultipleChoiceResponse.tag,
  MultipleChoiceResponse
);
export { MultipleChoiceResponse };
