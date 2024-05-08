// dependencies / things imported
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@lrnwebcomponents/d-d-d/d-d-d.js";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import { I18NMixin } from "@lrnwebcomponents/i18n-manager/lib/I18NMixin.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-toolbar/lib/simple-toolbar-button.js";
import "@lrnwebcomponents/simple-toast/simple-toast.js";
import "./lib/sorting-option.js";

// @TODO
// - area for feedback just like the ones in class
// - add feedback area to multiple choice
// - on save / convert to store in HAX, we need to use a hook to that we put things in the correct order for saving
// - overall feedback for all right or all wrong feedback; do this on all question types
// - whole or item based feedback
// - Max attempts setting that SHOWS # of attempts remaining with a disabled "Reveal answer" button
// - Evidence is AFTER finishing it

export class SortingQuestion extends SchemaBehaviors(I18NMixin(DDDSuper(LitElement))) {
  // a convention I enjoy so you can change the tag name in 1 place
  static get tag() {
    return "sorting-question";
  }

  getOptions(flag = '') {
    if (flag) {
      return this.querySelectorAll(`sorting-option[${flag}]`);
    }
    else {
      return this.querySelectorAll('sorting-option');
    }
  }

  // HTMLElement life-cycle, built in; use this for setting defaults
  constructor() {
    super();
    this.numberOfOptions = this.getOptions().length;
    this.numberCorrrect = 0;
    this.correctOrder = [];
    this.hasHint = this.querySelector('[slot="hint"]');
    this.correctText = "Great job!";
    this.correctIcon = "icons:thumb-up";
    this.incorrectIcon = "icons:thumb-down";
    this.quizName = "default";
    this.question = "Put the following in order";
    this.t = {
      numCorrectLeft: "You Have",
      numCorrectRight: "Correct.",
      checkAnswer: "Check answer",
      tryAgain: "Try again",
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
    this.getOptions().forEach((child) => {
      this.correctOrder.push(child);
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

      let targetChild = this.getOptions()[indexValues[randomIndex1]];

      var randomIndex2 = Math.floor(
        Math.random() * (indexValues.length - 0) + 0,
      );
      if (randomIndex2 === undefined) {
        randomIndex2 = 0;
      }

      this.insertBefore(targetChild, this.getOptions()[indexValues[randomIndex2]]);
    }
  }

  checkAnswer() {
    this.showAnswer = true;
  }
  resetAnswer() {
    if (this.getOptions('incorrect')) {
      const firstWrong = this.getOptions('incorrect')[0];
      if (firstWrong) {
        setTimeout(() => {
          firstWrong.shadowRoot.querySelector('#downArrow').shadowRoot.querySelector('button').focus();
        }, 0);  
      }
    }
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
    this.getOptions().forEach((child) => {
      child.disabled = false;
      child.incorrect = null;
      child.correct = null;
    });
    let gotRight = (this.numberCorrrect === this.numberOfOptions);
    // if we got it right, reset the whole interaction in case they want to take it again
    if (gotRight) {
      this.randomizeOptions();
    }
    this.numberCorrrect = 0;
  }

  // properties that you wish to use as data in HTML, CSS, and the updated life-cycle
  static get properties() {
    return {
      ...super.properties,
      hasHint: { type: Boolean },
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
      if (propName === "showAnswer") {
        if (this.showAnswer) {
          var numCorrect = 0;
          let children = this.getOptions();
          for (var i = 0; i < this.numberOfOptions; i++) {
            if (children[i].isEqualNode(this.correctOrder[i])) {
              numCorrect += 1;
              children[i].correct = true;
              children[i].incorrect = null;
            } else {
              children[i].correct = null;
              children[i].incorrect = true;
            }
            children[i].disabled = true;
          }
          this.numberCorrrect = numCorrect;
          let si = document.createElement("simple-icon-lite");
          let extras = {};
          let toastShowEventName = "simple-toast-show";
          // support for haxcms toast
          if (globalThis.HAXCMSToast) {
            toastShowEventName = "haxcms-toast-show";
            si.style.setProperty("--simple-icon-height", "40px");
            si.style.setProperty("--simple-icon-width", "40px");
            si.style.height = "150px";
            si.style.marginLeft = "8px";
          }
          // regardless, focus the other button since this one will disable
          // @todo max attempts can come into play here
          if (!this.maxAttempts) {
            setTimeout(() => {
              this.shadowRoot.querySelector("#reset").focus();        
            }, 0);
          }
          let gotRight = (this.numberCorrrect === this.numberOfOptions);
          // see if they got this correct based on their answers
          if (gotRight) {
            this.__toastColor = "green";
            this.__toastIcon = this.correctIcon;
            this.__toastText = this.correctText;
            // make it fun... and performant!
            import(
              "@lrnwebcomponents/multiple-choice/lib/confetti-container.js"
            ).then((module) => {
              setTimeout(() => {
                this.shadowRoot.querySelector("#confetti").setAttribute("popped", "");
              }, 0);
            });
            extras.hat = "party";
          } else {
            this.__toastColor = "red";
            this.__toastIcon = this.incorrectIcon;
            this.__toastText = `${this.t.numCorrectLeft} ${this.numberCorrrect} of ${this.numberOfOptions} ${this.t.numCorrectRight}`;
            extras.fire = true;
          }
          si.icon = this.__toastIcon;
          si.style.marginLeft = "16px";
          si.accentColor = this.__toastColor;
          si.dark = true;
          // gets it all the way to the top immediately
          globalThis.dispatchEvent(
            new CustomEvent(toastShowEventName, {
              bubbles: true,
              composed: true,
              cancelable: true,
              detail: {
                text: this.__toastText,
                accentColor: this.__toastColor,
                duration: 3000,
                slot: si,
                ...extras,
              },
            }),
          );
          // start of data passing, this is a prototype atm
          let eventData = {
            activityDisplay: "answered",
            objectName: this.quizName,
            resultSuccess: gotRight,
          };
          this.dispatchEvent(
            new CustomEvent("user-engagement", {
              bubbles: true,
              composed: true,
              cancelable: false,
              detail: eventData,
            }),
          );
        }
        else {
          this.getOptions().forEach((child) => {
            child.disabled = false;
          });
        }
      }
      if (propName === "disabled" && this.shadowRoot) {
        if (this.disabled) {
          this.getOptions().forEach((child) => {
            child.disabled = true;
            child.correct = null;
            child.incorrect = null;
          });
        } else {
          this.getOptions().forEach((child) => {
            child.disabled = false;
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
        border-radius: var(--ddd-radius-xs);
        transition: all 0.3s ease-in-out;
      }
      :host(:focus),
      :host(:focus-within),
      :host(:hover) {
        border-color: var(--simple-colors-default-theme-accent-12);
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
        padding: var(--ddd-spacing-4) 0;
      }

      .button-container {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      h3 {
        padding: 0;
        margin: 0 0 var(--ddd-spacing-8) 0;
        font-family: var(--ddd-font-navigation);
      }
      h4.feedback {
        margin: 0;
        padding-top: 8px;
      }
    `
    ];
  }

  // HTML - specific to Lit
  render() {
    return html`
      <confetti-container id="confetti">
      <meta property="oer:assessing" content="${this.relatedResource}" />
        <h3 property="oer:name">${this.question}</h3>
        <fieldset class="options"><slot></slot></fieldset>
        ${this.hasHint ? html`
        <details>
          <summary>Need a hint?</summary>
          <div>
            <slot name="hint"></slot>
          </div>
        </details>` : ``}
        <div class="sorting-controls">
          ${this.showAnswer ? html`<h4 class="feedback">${this.t.numCorrectLeft}
            ${this.numberCorrrect}/${this.numberOfOptions}
            ${this.t.numCorrectRight}</h4>` : html`<div></div>`}
          <div class="button-container">
            <simple-toolbar-button
              id="check"
              ?disabled="${this.disabled || this.showAnswer}"
              @click="${this.checkAnswer}"
              label="${this.t.checkAnswer}">
            </simple-toolbar-button>
            <simple-toolbar-button
              id="reset"
              ?disabled="${this.disabled}"
              @click="${this.resetAnswer}"
              label="${this.t.tryAgain}">
            </simple-toolbar-button>
          </div>
        </div>
      </confetti-container>
    `;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(SortingQuestion.tag, SortingQuestion);
