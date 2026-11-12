/**
 * Copyright 2023 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { html, css } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-toolbar/lib/simple-toolbar-button.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { DDDStatusTokens } from "@haxtheweb/d-d-d/lib/DDDStatusTokens.js";

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
  // the same treatment as the QuestionElement shell (short answer field,
  // footer action bar with a status chip, navy buttons) so flash-card reads
  // as part of the instructional family
  static get styles() {
    return [
      super.styles,
      DDDStatusTokens,
      css`
        :host {
          display: block;
          width: 100%;
        }
        #question {
          font-family: var(--ddd-font-navigation);
          font-weight: var(--ddd-font-weight-bold);
          font-size: var(--ddd-font-size-s);
          line-height: var(--ddd-lh-120);
          text-align: center;
          text-wrap: balance;
          margin: 0 0 var(--ddd-spacing-3) 0;
          color: light-dark(
            var(
              --lowContrast-override,
              var(--ddd-theme-primary, var(--ddd-theme-default-nittanyNavy))
            ),
            var(--ddd-theme-default-white)
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
          min-height: var(--ddd-textfield-height-sm, 40px);
          margin: 0;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-xs);
          border: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-theme-default-slateGray)
          );
          border-radius: var(--ddd-radius-sm);
          background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          transition: border-color var(--ddd-duration-fast) ease;
        }
        input::placeholder {
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneGray)
          );
        }
        input:hover:not(:disabled) {
          border-color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-linkLight)
          );
        }
        input:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        input:disabled {
          opacity: 1;
        }
        input.correct {
          border-color: var(--ddd-status-correct-signal);
          background-color: var(--ddd-status-correct-bg);
        }
        input.incorrect {
          border-color: var(--ddd-status-incorrect-signal);
          border-style: var(--ddd-status-incorrect-line);
          background-color: var(--ddd-status-incorrect-bg);
        }
        /* action bar: status on the left, buttons on the right */
        .action-bar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-3);
          margin-block: var(--ddd-spacing-3) 0;
          padding-block: var(--ddd-spacing-2);
          padding-inline: var(--ddd-spacing-3) var(--ddd-spacing-2);
          border-radius: var(--ddd-radius-sm);
          border-top: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          background-color: var(--ddd-status-answered-bg);
        }
        :host([status="correct"]) .action-bar {
          --_fc-signal: var(--ddd-status-correct-signal);
          --_fc-ink: var(--ddd-status-correct-ink);
          border-top: var(--ddd-border-size-md) var(--ddd-status-correct-line)
            var(--_fc-signal);
        }
        :host([status="incorrect"]) .action-bar {
          --_fc-signal: var(--ddd-status-incorrect-signal);
          --_fc-ink: var(--ddd-status-incorrect-ink);
          border-top: var(--ddd-border-size-md) var(--ddd-status-incorrect-line)
            var(--_fc-signal);
        }
        .feedback {
          display: flex;
          align-items: flex-start;
          gap: var(--ddd-spacing-2);
          flex: 1 1 200px;
          margin: 0;
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-140);
        }
        #status-icon {
          display: inline-flex;
          flex: none;
          width: var(--ddd-icon-xxs);
          height: var(--ddd-icon-xxs);
          border-radius: var(--ddd-radius-circle);
          background-color: var(--_fc-signal);
          color: var(--ddd-status-default-bg);
          --simple-icon-width: var(--ddd-icon-4xs);
          --simple-icon-height: var(--ddd-icon-4xs);
          justify-content: center;
          align-items: center;
        }
        .feedback strong {
          color: var(--_fc-ink);
        }
        .answer-message {
          display: block;
          margin: 0;
          font-weight: var(--ddd-font-weight-regular);
        }
        #buttons {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: var(--ddd-spacing-2);
          margin: 0;
          margin-inline-start: auto;
        }
        #buttons [hidden] {
          display: none;
        }
        simple-toolbar-button {
          font-family: var(--ddd-font-navigation);
          border-radius: var(--ddd-radius-xs);
          background-color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-linkLight)
          );
          color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
        }
        simple-toolbar-button[disabled] {
          background-color: var(--ddd-status-disabled-bg);
          color: var(--ddd-status-disabled-ink);
          opacity: 1;
        }
        simple-toolbar-button::part(button) {
          min-height: var(--ddd-control-height-sm);
          padding-block: 0;
          padding-inline: var(--ddd-spacing-4);
          border: var(--ddd-border-xs);
          border-color: transparent;
          border-radius: var(--ddd-radius-xs);
          cursor: pointer;
        }
        simple-toolbar-button[disabled]::part(button) {
          border-style: var(--ddd-status-disabled-line);
          border-color: var(--ddd-status-disabled-signal);
          cursor: default;
        }
        simple-toolbar-button:focus-within::part(button) {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        simple-toolbar-button::part(label) {
          font-size: var(--ddd-font-size-4xs);
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
      `,
    ];
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
        aria-describedby="status-message answer-message"
        aria-invalid="${this.status === "incorrect"}"
        ?disabled="${this.status !== "pending"}"
        @input="${this.inputChanged}"
        @keydown="${(e) => (e.key === "Enter" ? this.checkUserAnswer() : "")}"
        .value="${this.userAnswer}"
      />
      <div class="action-bar">
        ${
          this.status !== "pending"
            ? html`<p class="feedback">
                <span id="status-icon" aria-hidden="true"
                  ><simple-icon-lite icon="${this.icon}"></simple-icon-lite
                ></span>
                <span
                  ><strong id="status-message">${this.message}</strong>
                  <span id="answer-message" class="answer-message"
                    >${this.t.correctAnswer.replace(
                      "{answer}",
                      () => this.correctAnswer,
                    )}</span
                  ></span
                >
              </p>`
            : html`<span class="feedback"></span>`
        }
        <div id="buttons">
          <simple-toolbar-button
            id="check"
            ?hidden="${this.status !== "pending"}"
            ?disabled="${this.status !== "pending" || this.userAnswer === ""}"
            @click="${this.checkUserAnswer}"
            label="${this.t.checkAnswer}"
          ></simple-toolbar-button>
          <simple-toolbar-button
            id="reset"
            ?hidden="${this.status === "pending"}"
            ?disabled="${this.status === "pending"}"
            @click="${this.resetCard}"
            label="${this.t.retry}"
          ></simple-toolbar-button>
        </div>
      </div>
    `;
  }
}

globalThis.customElements.define(FlashCardAnswerBox.tag, FlashCardAnswerBox);
