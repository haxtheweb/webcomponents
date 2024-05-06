// dependencies / things imported
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@lrnwebcomponents/d-d-d/d-d-d.js";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import { I18NMixin } from "@lrnwebcomponents/i18n-manager/lib/I18NMixin.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-toolbar/lib/simple-toolbar-button.js";
import "@lrnwebcomponents/simple-toast/simple-toast.js";
import "./lib/sorting-option.js";


export class SortingQuestion extends SchemaBehaviors(I18NMixin(DDDSuper(LitElement))) {
  // a convention I enjoy so you can change the tag name in 1 place
  static get tag() {
    return "sorting-question";
  }

  // HTMLElement life-cycle, built in; use this for setting defaults
  constructor() {
    super();
    this.numberOfOptions = this.children.length;
    this.numberCorrrect = 0;
    this.correctOrder = [];
    this.question = "Sort the following in order!";
    this.t = {
      numCorrectLeft: "You Have",
      numCorrectRight: "Correct.",
      checkAnswer: "Check answer",
      reset: "Reset",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("../locales/sorting-question.es.json", import.meta.url).href +
        "/../",
      locales: ["he", "ja", "es"],
    });
    //set order to be orginal order then scramble the options
    this.getCorrectOrder();
    setTimeout(this.randomizeOptions(), 0);
  }

  getCorrectOrder() {
    this.childNodes.forEach((child) => {
      if (child.tagName == "SORTING-OPTION") {
        this.correctOrder.push(child);
      }
    });
  }

  randomizeOptions() {
    //loop through number of options and randomize their indexes
    let indexValues = [];
    for (var i = 0; i < this.numberOfOptions; i++) {
      indexValues.push(i);
    }

    for (var i = 0; i < this.numberOfOptions; i++) {
      var randomIndex1 = Math.floor(
        Math.random() * (this.numberOfOptions - 0) + 0,
      );
      if (randomIndex1 === undefined) {
        randomIndex1 = 0;
      }

      let targetChild = this.children[indexValues[randomIndex1]];

      var randomIndex2 = Math.floor(
        Math.random() * (indexValues.length - 0) + 0,
      );
      if (randomIndex2 === undefined) {
        randomIndex2 = 0;
      }

      this.insertBefore(targetChild, this.children[indexValues[randomIndex2]]);
    }
  }

  _verifyAnswers() {
    this.showAnswer = true;
  }
  resetAnswers() {
    this.showAnswer = false;
    globalThis.dispatchEvent(
      new CustomEvent("simple-toast-hide", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: false,
      }),
    );
    //reset appearance of all options
    this.childNodes.forEach(function (child) {
      if (child.tagName == "SORTING-OPTION") {
        child.shadowRoot.querySelector("#incorrect-icon").style.display =
          "none";
        child.shadowRoot.querySelector("#correct-icon").style.display = "none";
        child.incorrect = null;
        child.correct = null;
      }
    });
    this.numberCorrrect = 0;
    this.randomizeOptions();
  }

  // properties that you wish to use as data in HTML, CSS, and the updated life-cycle
  static get properties() {
    return {
      ...super.properties,
      showAnswer: { type: Boolean},
      question: { type: String },
      correctOrder: { type: Array },
      numberOfOptions: { type: Number },
      numberCorrrect: { type: Number },
      disabled: { type: Boolean },
    };
  }

  // updated fires every time a property defined above changes
  // this allows you to react to variables changing and use javascript to perform logic
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "showAnswer" && this.showAnswer) {
        var numCorrect = 0;
        for (var i = 0; i < this.numberOfOptions; i++) {
          if (this.children[i].isEqualNode(this.correctOrder[i])) {
            numCorrect += 1;
            this.children[i].correct = true;
            this.children[i].incorrect = null;
          } else {
            this.children[i].correct = null;
            this.children[i].incorrect = true;
          }
        }
        this.numberCorrrect = numCorrect;
        if (this.numberCorrrect === this.numberOfOptions) {
          import(
            "@lrnwebcomponents/multiple-choice/lib/confetti-container.js"
          ).then((module) => {
            setTimeout(() => {
              this.shadowRoot.querySelector("#confetti").setAttribute("popped", "");
            }, 0);
          });
        }
      }
      if (propName === "disabled" && this.shadowRoot) {
        if (this.disabled) {
          this.childNodes.forEach((child) => {
            if (child.tagName == "SORTING-OPTION") {
              child.setAttribute("disabled", true);
              child.setAttribute("draggable", false);
              child.removeAttribute("correct");
              child.removeAttribute("incorrect");
              child.shadowRoot.querySelector("#incorrect-icon").style.display =
                "none";
              child.shadowRoot.querySelector("#correct-icon").style.display =
                "none";
              child.style.opacity = "0.5";
            }
          });
        } else {
          this.childNodes.forEach((child) => {
            if (child.tagName == "SORTING-OPTION") {
              child.removeAttribute("disabled");
              child.setAttribute("draggable", true);
              child.style.opacity = "1";
            }
          });
        }  
      }
    });
  }

  // CSS - specific to Lit
  static get styles() {
    return [
      super.styles,
      css`
      :host {
        display: block;
        min-width: 160px;
        padding: var(--ddd-spacing-8);
        border: var(--ddd-border-md);
        background-color: var(--simple-colors-default-theme-accent-1);
        border-radius: var(--ddd-radius-xs);
        transition: all 0.3s ease-in-out;
        color: var(--simple-colors-default-theme-grey-12);
      }
      :host(:focus),
      :host(:focus-within),
      :host(:hover) {
        border-color: var(--simple-colors-default-theme-accent-12);
      }

      :host button {
        background-color: var(--simple-colors-default-theme-grey-1);
        color: var(--simple-colors-default-theme-grey-12);
      }
      simple-toolbar-button {
        font-size: var(--ddd-font-size-xs);
        font-family: var(--ddd-font-navigation);
        transition: all 0.3s ease-in-out;
      }
      :host simple-toolbar-button:hover::part(button),
      :host simple-toolbar-button:focus::part(button),
      :host simple-toolbar-button:focus-within::part(button),
      :host simple-toolbar-button:active::part(button) {
        cursor: pointer;
        background-color: var(--simple-colors-default-theme-accent-3);
        color: var(--simple-colors-default-theme-accent-12);
        box-shadow: var(--ddd-boxShadow-sm);
        border-color: black;
      }
      simple-toolbar-button::part(button) {
        border: var(--ddd-border-md);
        border-radius: var(--ddd-radius-xs);
        padding: var(--ddd-spacing-2);
        transition: all 0.3s ease-in-out;
      }
      simple-toolbar-button::part(label) {
        font-size: var(--ddd-font-size-xs);
        font-family: var(--ddd-font-navigation);
        padding: 0;
        margin: 0;
      }
      .sorting-question-header {
        text-align: center;
        font-size: var(--ddd-font-size-xs);
        font-family: revert;
        margin-bottom: 10px;
      }
      #check {
        margin-right: var(--ddd-spacing-4);
      }
      .options {
        margin-bottom: 10px;
      }

      .sorting-controls {
        display: flex;
        justify-content: space-between;
        font-size: var(--ddd-font-size-xs);
        font-family: revert;
      }

      .button-container {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    `
    ];
  }

  //To Do: add reset option this resets the option color, the score, and randomizes the options

  // HTML - specific to Lit
  render() {
    return html`
      <confetti-container id="confetti">
      <meta property="oer:assessing" content="${this.relatedResource}" />
        <h3 property="oer:name" class="sorting-question-header">${this.question}</h3>
        <fieldset class="options"><slot></slot></fieldset>
        <div class="sorting-controls">
          <h4
            >${this.t.numCorrectLeft}
            ${this.numberCorrrect}/${this.numberOfOptions}
            ${this.t.numCorrectRight}</h4>
          <div class="button-container">
            <simple-toolbar-button
              id="check"
              ?disabled="${this.disabled || this.showAnswer}"
              @click="${this._verifyAnswers}"
              label="${this.t.checkAnswer}">
            </simple-toolbar-button>
            <simple-toolbar-button
              id="reset"
              ?disabled="${this.disabled}"
              @click="${this.resetAnswers}"
              label="${this.t.reset}">
            </simple-toolbar-button>
          </div>
        </div>
      </confetti-container>
    `;
  }

  // HAX specific callback
  // This teaches HAX how to edit and work with your web component
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

window.customElements.define(SortingQuestion.tag, SortingQuestion);
