import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { html, css } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-toolbar/lib/simple-toolbar-button.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";

export class FlashCardAnswerBox extends I18NMixin(DDD) {
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
      correct: "Correct!",
      incorrect: "Incorrect!",
      correctAnswer: "Correct Answer: {answer}",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("../locales/flash-card-answer-box.es.json", import.meta.url)
          .href + "/../",
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
    // guard: simple-toolbar-button still emits click while disabled and
    // Enter can fire on an empty / already answered field
    if (this.status !== "pending" || !this.userAnswer) {
      return;
    }
    const side = this.back ? "front" : "back";
    const comparison = this.shadowRoot
      .querySelector(`[name="${side}"]`)
      .assignedNodes({ flatten: true })[0]
      .querySelector(`[name="${side}"]`)
      .assignedNodes({ flatten: true })[0].innerText;
    this.correct = this.equalsIgnoringCase(comparison);
    this.status = this.correct ? "correct" : "incorrect";
    this.icon = this.correct ? "check" : "cancel";
    this.message = this.correct ? this.t.correct : this.t.incorrect;
    this.showResult = !this.correct;
    // the answer is whichever side the user is guessing
    this.correctAnswer = comparison;
  }

  // as the user types input, grab the value
  // this way we can react to disable state among other things
  inputChanged(e) {
    this.userAnswer = e.target.value;
  }

  // reset the interaction to the defaults
  resetCard() {
    if (this.status === "pending") {
      return;
    }
    this.showResult = false;
    this.correct = false;
    this.userAnswer = "";
    this.status = "pending";
    this.sideToShow = this.back ? "back" : "front";
    this.correctAnswer = "";
    this.updateComplete.then(() => {
      const input = this.shadowRoot.querySelector("input");
      input.value = "";
      input.focus();
    });
  }

  // CSS - specific to Lit
  // mirrors the input + button treatment in multiple-choice/QuestionElement
  // so flash-card reads as part of the same question family
  static get styles() {
    return css`
      :host {
        display: block;
        width: 100%;
      }
      #question {
        font-family: var(--ddd-font-navigation);
        font-weight: normal;
        font-size: var(--ddd-font-size-ms);
        text-align: center;
        margin: 0 0 var(--ddd-spacing-4) 0;
        color: light-dark(
          var(
            --lowContrast-override,
            var(--ddd-theme-primary, var(--ddd-theme-default-nittanyNavy))
          ),
          var(--ddd-theme-default-linkLight)
        );
      }
      :host([side-to-show="front"]) slot[name="back"] {
        display: none;
      }
      :host([side-to-show="back"]) slot[name="front"] {
        display: none;
      }
      input {
        display: block;
        box-sizing: border-box;
        width: 100%;
        min-height: var(--ddd-spacing-12);
        margin: var(--ddd-spacing-2) 0;
        padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
        font-family: var(--ddd-font-navigation);
        font-size: var(--ddd-font-size-xs);
        border: var(--ddd-border-sm);
        border-color: light-dark(
          var(--ddd-theme-default-limestoneGray),
          var(--ddd-primary-5)
        );
        border-radius: var(--ddd-radius-xs);
        background-color: light-dark(
          var(--ddd-theme-default-limestoneLight),
          var(--ddd-theme-default-coalyGray)
        );
        color: light-dark(
          var(--ddd-theme-default-coalyGray),
          var(--ddd-theme-default-white)
        );
        transition: all 0.3s ease-in-out;
      }
      input:focus-visible {
        outline: var(--ddd-border-md);
        outline-color: light-dark(
          var(--ddd-theme-primary, var(--ddd-theme-default-link)),
          var(--ddd-theme-default-linkLight)
        );
        outline-offset: 0;
      }
      input:disabled:not(.correct):not(.incorrect) {
        opacity: 0.7;
      }
      input.correct {
        outline: 3px solid var(--ddd-theme-default-opportunityGreen);
        outline-offset: -3px;
      }
      input.incorrect {
        outline: 3px dotted
          light-dark(
            var(--ddd-theme-default-wonderPurple),
            var(--ddd-theme-default-athertonViolet)
          );
        outline-offset: -3px;
      }
      .feedback {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--ddd-spacing-2);
        margin: var(--ddd-spacing-2) 0;
        font-family: var(--ddd-font-navigation);
        font-size: var(--ddd-font-size-3xs);
        font-weight: bold;
        text-align: center;
      }
      #status-icon {
        --simple-icon-height: var(--ddd-icon-xs);
        --simple-icon-width: var(--ddd-icon-xs);
      }
      :host([status="correct"]) #status-icon {
        color: var(--ddd-theme-default-opportunityGreen);
      }
      :host([status="incorrect"]) #status-icon {
        color: light-dark(
          var(--ddd-theme-default-wonderPurple),
          var(--ddd-theme-default-athertonViolet)
        );
      }
      .answer-message {
        margin: 0;
        font-family: var(--ddd-font-navigation);
        font-size: var(--ddd-font-size-3xs);
        text-align: center;
      }
      #buttons {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: var(--ddd-spacing-4);
        margin: var(--ddd-spacing-4) 0 0 0;
      }
      simple-toolbar-button {
        font-size: var(--ddd-font-size-xs);
        font-family: var(--ddd-font-navigation);
        transition: all 0.3s ease-in-out;
        border: none;
        border-radius: var(--ddd-radius-xs);
        background-color: var(
          --ddd-theme-primary,
          var(--ddd-theme-default-link)
        );
        color: var(--lowContrast-override, var(--ddd-theme-bgContrast, white));
      }
      simple-toolbar-button[disabled] {
        background-color: light-dark(
          var(--ddd-theme-default-limestoneLight),
          var(--ddd-theme-default-slateGray)
        );
        color: light-dark(black, white);
        opacity: 0.7;
      }
      simple-toolbar-button:hover::part(button),
      simple-toolbar-button:focus::part(button),
      simple-toolbar-button:focus-within::part(button),
      simple-toolbar-button:active::part(button) {
        cursor: pointer;
        box-shadow: var(--ddd-boxShadow-sm);
        border-color: black;
      }
      simple-toolbar-button::part(button) {
        border: var(--ddd-border-sm);
        border-radius: var(--ddd-radius-xs);
        padding: var(--ddd-spacing-2);
      }
      simple-toolbar-button::part(label) {
        font-size: var(--ddd-font-size-s);
        font-family: var(--ddd-font-navigation);
        padding: 0;
        margin: 0;
      }
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
    `;
  }

  // HTML - specific to Lit
  render() {
    return html`
      <p id="question">
        <slot name="front" id="front"></slot>
        <slot name="back" id="back"></slot>
      </p>
      <!-- ARIA live region for status announcements -->
      <div aria-live="polite" aria-atomic="true" class="sr-only">
        ${this.status !== "pending" ? this.message : ""}
      </div>
      <label for="answer" class="sr-only">${this.t.yourAnswer}</label>
      <input
        id="answer"
        type="text"
        class="${this.status !== "pending" ? this.status : ""}"
        .placeholder="${this.t.yourAnswer}"
        aria-describedby="status-message"
        aria-invalid="${this.status === "incorrect"}"
        ?disabled="${this.status !== "pending"}"
        @input="${this.inputChanged}"
        @keydown="${(e) => (e.key === "Enter" ? this.checkUserAnswer() : "")}"
        .value="${this.userAnswer}"
      />
      ${this.status !== "pending"
        ? html`<p id="status-message" class="feedback">
              <simple-icon-lite
                id="status-icon"
                icon="${this.icon}"
                aria-hidden="true"
              ></simple-icon-lite
              >${this.message}
            </p>
            <p class="answer-message">
              ${this.t.correctAnswer.replace("{answer}", () => this.correctAnswer)}
            </p>`
        : ``}
      <div id="buttons">
        <simple-toolbar-button
          id="check"
          ?disabled="${this.status !== "pending" || this.userAnswer === ""}"
          @click="${this.checkUserAnswer}"
          label="${this.t.checkAnswer}"
        ></simple-toolbar-button>
        <simple-toolbar-button
          id="reset"
          ?disabled="${this.status === "pending"}"
          @click="${this.resetCard}"
          label="${this.t.retry}"
        ></simple-toolbar-button>
      </div>
    `;
  }
}

globalThis.customElements.define(FlashCardAnswerBox.tag, FlashCardAnswerBox);
