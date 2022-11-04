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
          justify-content: space-between;
          opacity: 0.6;
        }
        :host(:hover),
        :host(:focus-within) {
          opacity: 1;
          outline: 1px solid;
        }
        #slot {
          flex: 0 0 auto;
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
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./${this.tag}.haxProperties.json`, import.meta.url).href;
  }

  constructor() {
    super();
    this.correct = false;
    this.type = "checkbox";
    if (!this.__fieldLabel)
      fetch(MultipleChoiceResponse.haxProperties)
        .then((response) => response.json())
        .then((data) => {
          let settings = data.settings || {},
            config = settings.configure || [],
            filter = config.filter((prop) => prop.property === "correct"),
            correct = filter[0] || {};
          this.__fieldLabel = correct.description || correct.title;
        });
  }
  /**
   * handles clicking for indicating response as correct
   *
   * @param {event} e
   * @memberof MultipleChoiceResponse
   */
  _handleClick(e) {
    this.correct = e.detail.value;
  }

  render() {
    return html` <slot id="slot" property="oer:answer"></slot>
      <simple-fields-field
        label="${this.__fieldLabel || "Is this response correct?"}"
        aria-describedby="slot"
        type="${this.type}"
        @value-changed="${this._handleClick}"
        .value="${!!this.correct}"
      ></simple-fields-field>`;
  }
  static get properties() {
    return {
      ...super.properties,
      /**
       * whether the response is correct
       */
      correct: {
        type: Boolean,
      },
      /**
       * whether the response is correct
       */
      disabled: {
        type: Boolean,
      },
      /**
       * text of response
       */
      text: {
        type: String,
      },
      /**
       * unique identifier for response
       */
      answerId: {
        type: String,
        attribute: "answer-id",
        reflect: true,
      },
      __fieldLabel: {
        type: String,
      },
    };
  }
}
customElements.define(MultipleChoiceResponse.tag, MultipleChoiceResponse);
export { MultipleChoiceResponse };
