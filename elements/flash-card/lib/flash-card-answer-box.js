import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { html, css } from "lit";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import { DDD } from "@haxtheweb/d-d-d";

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
        justify-content: center;
        width: 300px;
        height: 45px;
        border-radius: var(--ddd-radius-md);
        border: var(--ddd-border-sm);
        border-color: var(--simple-colors-default-theme-accent-5);
        background-color: light-dark(
          var(--ddd-theme-default-white),
          var(--ddd-theme-default-coalyGray)
        );
        padding: 0;
        margin: var(--ddd-spacing-4) auto;
      }
      .answer-section:focus-within {
        border-color: var(--simple-colors-default-theme-accent-6);
        box-shadow: 0 0 10px var(--simple-colors-default-theme-accent-6);
      }
      input {
        border: none;
        padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
        font-size: var(--ddd-font-size-s);
        font-family: var(--ddd-font-navigation);
        height: 25px;
        border-radius: var(--ddd-radius-md) 0 0 var(--ddd-radius-md);
        margin: 0;
        width: 11em;
        background-color: light-dark(
          var(--ddd-theme-default-white),
          var(--ddd-theme-default-coalyGray)
        );
        color: light-dark(
          var(--ddd-theme-default-coalyGray),
          var(--ddd-theme-default-white)
        );
      }
      input:focus {
        outline: none;
      }
      button#check {
        background-color: var(
          --ddd-theme-primary,
          var(--ddd-theme-default-link)
        );
        color: var(--lowContrast-override, var(--ddd-theme-bgContrast, white));
        font-size: var(--ddd-font-size-s);
        font-family: var(--ddd-font-navigation);
        margin: none;
        padding: var(--ddd-spacing-2);
        border-radius: 0 var(--ddd-radius-md) var(--ddd-radius-md) 0;
        border: var(--ddd-border-sm);
        overflow: hidden;
        width: 50em;
        height: 45px;
        transition: all 0.3s ease-in-out;
      }

      /* Status-based button background colors */
      :host([status="correct"]) button#check {
        background-color: var(--ddd-theme-default-opportunityGreen);
        color: var(--ddd-theme-default-white);
      }

      :host([status="incorrect"]) button#check {
        background-color: var(--ddd-theme-default-wonderPurple);
        color: var(--ddd-theme-default-white);
      }

      button#check:hover,
      button#check:focus,
      button#check:focus-within,
      button#check:active {
        cursor: pointer;
        box-shadow: var(--ddd-boxShadow-sm);
        border-color: black;
        opacity: 0.9;
      }
      .retry simple-icon-button-lite {
        color: light-dark(
          var(--ddd-theme-default-wonderPurple),
          var(--ddd-theme-default-linkLight)
        );
        background-color: light-dark(
          var(--ddd-theme-default-white),
          var(--ddd-theme-default-coalyGray)
        );
        border: var(--ddd-border-sm);
        --simple-icon-button-border-radius: var(--ddd-radius-xs);
        --simple-icon-button-padding: var(--ddd-spacing-2);
        font-size: var(--ddd-font-size-xs);
        font-family: var(--ddd-font-navigation);
        transition: all 0.3s ease-in-out;
      }
      .retry simple-icon-button-lite:hover,
      .retry simple-icon-button-lite:focus {
        box-shadow: var(--ddd-boxShadow-sm);
        border-color: light-dark(
          var(--ddd-theme-default-wonderPurple),
          var(--ddd-theme-default-linkLight)
        );
        background-color: light-dark(
          var(--ddd-theme-default-accent1),
          var(--ddd-theme-default-accent8)
        );
      }
      button:hover {
        opacity: 0.8;
      }
      button:disabled {
        opacity: 0.7;
        background-color: light-dark(
          var(--ddd-theme-default-limestoneLight),
          var(--ddd-theme-default-slateGray)
        );
        color: light-dark(black, white);
      }
      p {
        font-family: var(--ddd-font-navigation);
        color: var(--ddd-theme-primary);
        font-weight: normal;
        font-size: var(--ddd-font-size-ms);
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
        background-color: var(--ddd-theme-default-opportunityGreen);
        color: var(--ddd-theme-default-white);
        border-radius: var(--ddd-radius-xs);
        padding: var(--ddd-spacing-2) var(--ddd-spacing-4);
      }

      :host([status="correct"]) #status-icon {
        color: var(--ddd-theme-default-white);
      }

      :host([status="incorrect"]) #status-message {
        background-color: var(--ddd-theme-default-wonderPurple);
        color: var(--ddd-theme-default-white);
        border-radius: var(--ddd-radius-xs);
        padding: var(--ddd-spacing-2) var(--ddd-spacing-4);
      }

      :host([status="incorrect"]) #status-icon {
        color: var(--ddd-theme-default-white);
      }

      simple-icon-lite {
        --simple-icon-width: 35px;
        --simple-icon-height: 35px;
        color: light-dark(
          var(--ddd-theme-default-coalyGray),
          var(--ddd-theme-default-white)
        );
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
        justify-content: center;
        padding-top: var(--ddd-spacing-4);
        margin: var(--ddd-spacing-2) 0;
      }

      #status-message {
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        font-family: var(--ddd-font-navigation);
        color: light-dark(
          var(--ddd-theme-default-coalyGray),
          var(--ddd-theme-default-white)
        );
        gap: var(--ddd-spacing-2);
      }

      #status-icon {
        --simple-icon-height: 25px;
        --simple-icon-width: 25px;
      }

      .answer-message {
        font-size: 10pt;
        color: light-dark(
          var(--ddd-theme-default-coalyGray),
          var(--ddd-theme-default-white)
        );
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
      <!-- ARIA live region for status announcements -->
      <div aria-live="polite" aria-atomic="true" class="sr-only">
        ${this.status !== "pending" ? this.message : ""}
      </div>
      <div class="answer-section">
        <label for="answer" class="sr-only">${this.t.yourAnswer}</label>
        <input
          id="answer"
          type="text"
          .placeholder="${this.t.yourAnswer}"
          aria-describedby="status-message"
          aria-invalid="${this.status === "incorrect"}"
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
                aria-hidden="true"
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

globalThis.customElements.define(FlashCardAnswerBox.tag, FlashCardAnswerBox);
