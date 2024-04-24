import { I18NMixin } from "@lrnwebcomponents/i18n-manager/lib/I18NMixin.js";
import { html, css } from "lit";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js";

export class FlashCardAnswerBox extends I18NMixin(SimpleColors) {
  static get tag() {
    return "flash-card-answer-box";
  }

  constructor() {
    super();
    this.back = false;
    this.status = "pending";
    this.correctAnswer = "";
    this.showResult = false;
    this.statusIcon = "";
    this.sideToShow = "front";
    this.userAnswer = "";
    this.icon = "";
    this.message = "";
    this.t = {
      yourAnswer: "Your answer",
      checkAnswer: "Check answer",
      retry: "Retry",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("../locales/flash-card-answer-box.es.json", import.meta.url)
          .href + "/../",
      locales: ["es", "fr", "ja"],
    });
  }

  static get properties() {
    return {
      ...super.properties,
      back: { type: Boolean, reflect: true },
      sideToShow: { type: String, reflect: true, attribute: "side-to-show" },
      userAnswer: { type: String, attribute: "user-answer" },
      status: { type: String, reflect: true },
      showResult: { type: Boolean, attribute: "show-result", reflect: true },
      statusIcon: { type: String, attribute: false },
    };
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "status" && oldValue !== undefined) {
        this.dispatchEvent(
          new CustomEvent("flash-card-status-change", {
            detail: this.status,
            bubbles: true,
          }),
        );
      }
      if (propName === "back") {
        this.sideToShow = this[propName] ? "back" : "front";
      }
    });
  }

  // Need this instead of .toUpperCase() for i18n
  equalsIgnoringCase(text) {
    return (
      text.localeCompare(
        this.shadowRoot.querySelector("input").value,
        undefined,
        {
          sensitivity: "base",
        },
      ) === 0
    );
  }

  checkUserAnswer() {
    const side = this.back ? "front" : "back";
    const comparison = this.shadowRoot
      .querySelector(`[name="${side}"]`)
      .assignedNodes({ flatten: true })[0]
      .querySelector(`[name="${side}"]`)
      .assignedNodes({ flatten: true })[0].innerText;
    this.correct = this.equalsIgnoringCase(comparison);
    this.status = this.equalsIgnoringCase(comparison) ? "correct" : "incorrect";
    this.icon = this.equalsIgnoringCase(comparison) ? "check" : "cancel";
    this.message = this.equalsIgnoringCase(comparison)
      ? "Correct!"
      : "Incorrect!";
    this.showResult = !this.equalsIgnoringCase(comparison);
    // reverse so that it swaps which slot is shown
    this.correctAnswer = !this.back
      ? this.shadowRoot
          .querySelector(`[name="back"]`)
          .assignedNodes({ flatten: true })[0]
          .querySelector(`[name="back"]`)
          .assignedNodes({ flatten: true })[0].innerText
      : this.shadowRoot
          .querySelector(`[name="front"]`)
          .assignedNodes({ flatten: true })[0]
          .querySelector(`[name="front"]`)
          .assignedNodes({ flatten: true })[0].innerText;
    this.shadowRoot.querySelector("#check").disabled = true;
    this.shadowRoot.querySelector("input").disabled = true;
  }

  // as the user types input, grab the value
  // this way we can react to disable state among other things
  inputChanged(e) {
    this.userAnswer = e.target.value;
  }

  // reset the interaction to the defaults
  resetCard() {
    this.showResult = false;
    this.correct = false;
    this.userAnswer = "";
    this.status = "pending";
    this.sideToShow = this.back ? "back" : "front";
    this.correctAnswer = "";
    this.shadowRoot.querySelector("input").disabled = false;
    this.shadowRoot.querySelector("input").value = "";
  }

  // CSS - specific to Lit
  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .answer-section {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 300px;
        height: 45px;
        border-radius: 20px;
        border: solid 1px var(--simple-colors-default-theme-accent-5);
        background-color: white;
        padding: 0;
      }
      .answer-section:focus-within {
        border-color: var(--simple-colors-default-theme-accent-6);
        box-shadow: 0 0 10px var(--simple-colors-default-theme-accent-6);
      }
      input {
        border: none;
        padding: 10px;
        font-size: 14px;
        height: 25px;
        border-radius: 19px 0 0 19px;
        margin: 0;
        width: 11em;
        background-color: white;
      }
      input:focus {
        outline: none;
      }
      button#check {
        background-color: var(--simple-colors-default-theme-accent-10);
        color: var(--simple-colors-default-theme-grey-1);
        font-size: 14px;
        margin: none;
        padding: 0px;
        border-radius: 0 19px 19px 0;
        border: none;
        overflow: hidden;
        width: 50em;
        height: 45px;
      }
      .retry simple-icon-button-lite {
        color: red;
        --simple-icon-button-border-radius: none;
        --simple-icon-button-padding: 4px;
      }
      button:hover {
        opacity: 0.8;
      }
      button:disabled {
        opacity: 0.5;
        background-color: #dddddd;
        color: black;
      }
      p {
        font-family: Helvetica;
        color: var(--simple-colors-default-theme-accent-12);
        font-weight: normal;
        font-size: 20px;
        text-align: center;
      }
      :host([side-to-show="front"]) slot[name="back"] {
        display: none;
      }
      :host([side-to-show="back"]) slot[name="front"] {
        display: none;
      }
      :host([status="correct"]) .retry,
      :host([status="incorrect"]) .retry {
        display: flex;
      }

      :host([status="correct"]) #status-message {
        color: green;
      }

      :host([status="correct"]) #status-icon {
        color: green;
      }

      :host([status="incorrect"]) #status-message {
        color: red;
      }

      :host([status="incorrect"]) #status-icon {
        color: red;
      }

      simple-icon-lite {
        --simple-icon-width: 35px;
        --simple-icon-height: 35px;
        color: var(--simple-colors-default-theme-accent-10);
      }

      .sr-only {
        position: absolute;
        left: -10000px;
        top: auto;
        width: 1px;
        height: 1px;
        overflow: hidden;
      }

      .retry {
        display: none;
        width: 100%;
        justify-content: flex-end;
        padding-top: 10px;
      }

      #status-message {
        font-size: 16px;
        margin-right: 15px;
        display: flex;
        align-items: center;
        font-family: Helvetica;
      }

      #status-icon {
        --simple-icon-height: 25px;
        --simple-icon-width: 25px;
      }

      .answer-message {
        font-size: 10pt;
      }
    `;
  }

  // HTML - specific to Lit
  render() {
    return html`
      <div>
        <p id="question">
          <slot name="front" id="front"></slot>
          <slot name="back" id="back"></slot>
        </p>
        ${this.showResult || this.correct
          ? html`<p class="answer-message">
              Correct Answer: ${this.correctAnswer}
            </p>`
          : ``}
      </div>
      <div class="answer-section">
        <input
          id="answer"
          type="text"
          .placeholder="${this.t.yourAnswer}"
          @input="${this.inputChanged}"
          @keypress="${(e) =>
            e.key === "Enter" ? this.checkUserAnswer() : ""}"
          .value="${this.userAnswer}"
        />
        ${this.status === "pending"
          ? html`<button
              id="check"
              ?disabled="${this.userAnswer === ""}"
              @click="${this.checkUserAnswer}"
            >
              ${this.t.checkAnswer}
            </button>`
          : html`<span id="status-message"
              ><simple-icon-lite
                id="status-icon"
                icon="${this.icon}"
              ></simple-icon-lite
              >${this.message}</span
            >`}
      </div>
      <div class="retry">
        <simple-icon-button-lite icon="refresh" @click="${this.resetCard}"
          >${this.t.retry}</simple-icon-button-lite
        >
      </div>
    `;
  }
}

customElements.define(FlashCardAnswerBox.tag, FlashCardAnswerBox);
