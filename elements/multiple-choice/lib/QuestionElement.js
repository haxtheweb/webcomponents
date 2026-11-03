// superclass that can be used to more rapidly build question based components
import { LitElement, html, css, nothing } from "lit";
import { cache } from "lit/directives/cache.js";
import { SchemaBehaviors } from "@haxtheweb/schema-behaviors/schema-behaviors.js";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import {
  DDDBlockStyles,
  renderDDDBlockHeader,
} from "@haxtheweb/d-d-d/lib/DDDBlock.js";
import { DDDStatusTokens } from "@haxtheweb/d-d-d/lib/DDDStatusTokens.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-fields/lib/simple-fields-field.js";
import "@haxtheweb/simple-toolbar/lib/simple-toolbar-button.js";
import "@haxtheweb/simple-toast/simple-toast.js";
import "@haxtheweb/grid-plate/grid-plate.js";

// automatic stacks: questions that sit right next to each other (adjacent
// element siblings in the same container, or the same grid-plate column)
// behave as one accordion. One childList observer per container keeps the
// stacks current as HAX inserts, moves and deletes blocks.
const questionStackObservers = new WeakMap();
const isQuestionNode = (el) => Boolean(el && el._isQuestionElement === true);
const stackSlotOf = (el) => (el.getAttribute && el.getAttribute("slot")) || "";
const stackQuestionsIn = (parent) =>
  parent && parent.children
    ? Array.from(parent.children).filter(isQuestionNode)
    : [];
const refreshQuestionStacks = (parent) => {
  stackQuestionsIn(parent).forEach((q) => q._updateStackMembership());
};
const releaseQuestionStackParent = (parent) => {
  const observer = parent && questionStackObservers.get(parent);
  if (observer && stackQuestionsIn(parent).length === 0) {
    observer.disconnect();
    questionStackObservers.delete(parent);
  }
};
const watchQuestionStackParent = (parent) => {
  if (!parent || !parent.children) {
    return;
  }
  if (
    !questionStackObservers.has(parent) &&
    typeof globalThis.MutationObserver === "function"
  ) {
    const observer = new globalThis.MutationObserver(() => {
      if (stackQuestionsIn(parent).length === 0) {
        releaseQuestionStackParent(parent);
        return;
      }
      refreshQuestionStacks(parent);
    });
    observer.observe(parent, { childList: true });
    questionStackObservers.set(parent, observer);
  }
  refreshQuestionStacks(parent);
};

/**
 * Superclass for HAX question types (multiple-choice, true-false-question,
 * short-answer-question, fill-in-the-blanks, mark-the-words,
 * matching-question, sorting-question, tagging-question).
 *
 * Stacking: a question can opt in with `collapsible`, and any run of
 * questions that are adjacent element siblings (same container, same
 * grid-plate column) stacks automatically without attributes. In a stack the
 * first question starts open and the rest collapsed, unless the author set
 * `collapsed`. Opening one closes the others in the run. A correct answer
 * collapses the question after a short pause and opens the next unanswered
 * question in the run. Nothing about a visitor's progress is stored.
 *
 * @fires question-element-state - bubbling, composed; after every answer
 *   check. detail: { tag, question, quizName, status ("correct" or
 *   "incorrect"), correct, attempts, maxAttempts, guess }. Meant for a course
 *   level user data object to listen for; the element stores nothing.
 * @fires user-engagement - prototype engagement data after a check
 */
export class QuestionElement extends SchemaBehaviors(
  I18NMixin(DDDSuper(LitElement)),
) {
  // marker the automatic stacks use to recognise any question type, even
  // when more than one copy of this class is loaded on a page
  get _isQuestionElement() {
    return true;
  }
  // watch the slot attribute too so moving a question between grid-plate
  // columns rebuilds the stacks it leaves and joins
  static get observedAttributes() {
    const attrs = super.observedAttributes || [];
    return attrs.includes("slot") ? attrs : [...attrs, "slot"];
  }
  attributeChangedCallback(name, oldValue, value) {
    super.attributeChangedCallback(name, oldValue, value);
    if (name === "slot" && oldValue !== value && this.isConnected) {
      refreshQuestionStacks(this.parentNode);
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this._stackParent = this.parentNode;
    watchQuestionStackParent(this._stackParent);
  }
  disconnectedCallback() {
    if (this._completionTimer) {
      clearTimeout(this._completionTimer);
      this._completionTimer = null;
    }
    const parent = this._stackParent;
    this._stackParent = null;
    this._inStack = false;
    super.disconnectedCallback();
    if (parent) {
      refreshQuestionStacks(parent);
      releaseQuestionStackParent(parent);
    }
  }
  // delegatesFocus must be declared as a static getter so the shadow root is
  // actually created with it — assigning in the constructor is too late.
  static get shadowRootOptions() {
    return {
      ...super.shadowRootOptions,
      delegatesFocus: true,
    };
  }
  constructor() {
    super();
    this.typeof = "oer:Assessment";
    // default method of storing guess data
    this.guessDataValue = "display";
    this.maxAttempts = 0; // 0 implies unlimited
    this.attempts = 0;
    this.showAnswer = false;
    this.randomize = false;
    this.hideButtons = false;
    this.disabled = false;
    this.singleOption = false;
    this.media = null;
    this.question = "";
    this.answers = [];
    this.displayedAnswers = [];
    // null = use the translatable defaults (see correctText / incorrectText getters)
    this.correctText = null;
    this.incorrectText = null;
    this.quizName = "default";
    this.t = {
      numCorrectLeft: "You have",
      numCorrectRight: "correct",
      checkAnswer: "Check answer",
      tryAgain: "Try again",
      correctFeedback: "You are correct!",
      incorrectFeedback: "Try again!",
      question: "Question",
      feedback: "Feedback",
      legend: "Legend",
      relatedContent: "Related content",
      directions: "Directions",
      defaultDirections:
        "Select the answer you feel answers the question. When you are done, press {checkAnswer}. You will get feedback indicating correctness of your answer and how to proceed.",
      correct: "Correct",
      answerIsCorrect: "Answer is correct",
      incorrect: "Incorrect",
      answerRequiresCorrection: "Answer requires correction",
      needAHint: "Need a hint?",
      evidence: "Evidence",
      relatedContentHeading: "Related Content",
      relatedContentDescription:
        "This creates a collapsed area for content related to this question and is always shown",
      feedbackIncorrectHeading: "Feedback for incorrect answer",
      feedbackCorrectHeading: "Feedback for correct answer",
      hint: "Hint",
      hintDescription: "This is presented if the user gets the answer wrong",
      evidenceDescription:
        "This is presented if the user gets the answer correct",
      addAnswer: "Add answer",
      removeAnswer: "Remove answer",
      toggleEditingFeedbackBlocks: "Toggle editing feedback blocks",
      feedbackEditMode: "Feedback edit mode",
      addContent: "Add content",
      quiz: "Quiz",
      practice: "Practice",
      questionType: "Question",
      attemptsUsed: "Attempt {used} of {max}",
      showDirections: "Show directions",
      hideDirections: "Hide directions",
      showRelatedContent: "Show related content",
      hideRelatedContent: "Hide related content",
      notAttempted: "Not attempted",
    };
    this.edit = false;
    // opt-in stacking: a collapsible question shows a header-only row while
    // collapsed; collapsed is the starting state the author picked
    this.collapsible = false;
    this.collapsed = false;
    // automatic stack membership; internal only, never saved
    this._inStack = false;
    // visitor view disclosure state; related content starts open as it did
    // before, directions start closed but stay announced via aria-describedby
    this._directionsOpen = false;
    this._relatedOpen = true;
  }
  // correct / incorrect feedback text; authored values win, otherwise
  // fall back to the translatable defaults in this.t
  get correctText() {
    return this._correctText != null
      ? this._correctText
      : this.t && this.t.correctFeedback;
  }
  set correctText(value) {
    this._correctText = value;
  }
  get incorrectText() {
    return this._incorrectText != null
      ? this._incorrectText
      : this.t && this.t.incorrectFeedback;
  }
  set incorrectText(value) {
    this._incorrectText = value;
  }
  // quote a translated string so it can be used as a CSS content value
  _cssString(str) {
    return `"${String(str || "")
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/[\r\n]+/g, " ")}"`;
  }
  // render a translated string, swapping {name} placeholders for template parts
  _tParts(str, parts = {}) {
    return String(str)
      .split(/(\{\w+\})/g)
      .map((piece) => {
        const m = piece.match(/^\{(\w+)\}$/);
        return m && m[1] in parts ? parts[m[1]] : piece;
      });
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      let notifiedProps = ["answers", "displayedAnswers"];
      if (notifiedProps.includes(propName)) {
        // notify
        let eventName = `${propName
          .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2")
          .toLowerCase()}-changed`;
        this.dispatchEvent(
          new CustomEvent(eventName, {
            detail: {
              value: this[propName],
            },
          }),
        );
      }
      // remember the collapsed state the author set, so a visitor opening and
      // closing rows (or the stack closing neighbours) is never what HAX saves
      if (
        propName === "collapsed" &&
        (this._haxstate || this.edit || this._authoredCollapsed === undefined)
      ) {
        this._authoredCollapsed = this.collapsed;
      }
      if (propName === "edit" && this.edit && this._haxstate) {
        // ensure we have empty slotted items for these if we're going to need them
        [
          "feedbackIncorrect",
          "feedbackCorrect",
          "content",
          "hint",
          "evidence",
        ].map((slotName) => {
          if (
            this.querySelector &&
            this.querySelector(`[slot="${slotName}"]`) === null
          ) {
            let p = globalThis.document.createElement("p");
            p.setAttribute("slot", slotName);
            this.appendChild(p);
          }
        });
      }
      if (
        propName == "answers" &&
        this.answers &&
        this.answers.length > 0 &&
        !this.__answerLock
      ) {
        this.__answerLock = true;
        // validate answer data structure
        const newAs = this.cleanAnswerData(this.answers);
        this.answers = [...newAs];
        this.displayedAnswers = [
          ...this._computeDisplayedAnswers([...this.answers], this.randomize),
        ];
        // lock ensures that if data is cleaned above it doesn't reload loop
        setTimeout(() => {
          this.__answerLock = false;
        }, 0);
      }
    });
  }
  // return array of all guesses
  getGuess() {
    if (this.guessDataValue == "display") {
      return this.displayedAnswers.filter((item) => item.userGuess === true);
    }
    // see if we have another key that can be used as alternative for where this data is stored
    else if (this[this.guessDataValue]) {
      return this[this.guessDataValue];
    }
    // the alternate storage key can be unset (no guess recorded yet);
    // fall back to an empty list so guess counts stay numeric
    return [];
  }
  // count of all guesses
  guessCount() {
    return this.getGuess().length;
  }
  // see if the interaction is out of attempts (0 implies unlimited)
  attemptsExhausted() {
    return this.maxAttempts > 0 && this.attempts >= this.maxAttempts;
  }

  checkedEvent(e) {
    // ensure there's a match w/ the event data
    this.displayedAnswers[e.target.name].userGuess = e.detail.value;
    this.requestUpdate();
  }

  /**
   * Reset user answers and shuffle the board again.
   */
  resetAnswer(_e) {
    this.showAnswer = false;
    globalThis.dispatchEvent(
      new CustomEvent("simple-toast-hide", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: false,
      }),
    );
    this.displayedAnswers = [];
    this.answers.forEach((el) => {
      el.userGuess = "";
    });
    const answers = JSON.parse(JSON.stringify(this.answers));
    this.answers = [...answers];
  }

  /**
   * Return if the current answers are correct
   */
  isCorrect() {
    let gotRight = true;
    // see that they got them all right
    for (let i in this.displayedAnswers) {
      if (
        gotRight != false &&
        this.displayedAnswers[i].correct &&
        this.displayedAnswers[i].userGuess
      ) {
        gotRight = true;
      } else if (
        this.displayedAnswers[i].correct &&
        !this.displayedAnswers[i].userGuess
      ) {
        gotRight = false;
      } else if (
        !this.displayedAnswers[i].correct &&
        this.displayedAnswers[i].userGuess
      ) {
        gotRight = false;
      }
    }
    return gotRight;
  }

  makeItRain() {
    import("./confetti-container.js").then((_module) => {
      setTimeout(() => {
        this.shadowRoot.querySelector("#confetti").setAttribute("popped", "");
      }, 0);
    });
  }
  /**
   * Verify the answers of the user based on their saying
   * that they want to see how they did.
   */
  checkAnswer(_e) {
    // respect the max attempts limit; once the attempts are spent the
    // interaction no longer accepts checks (0 implies unlimited)
    if (this.attemptsExhausted()) {
      return;
    }
    const reduceMotion =
      globalThis.matchMedia &&
      globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const runCheck = () => {
      this.checkAnswerCallback();
      this._questionChecked();
    };
    if (
      globalThis.document &&
      globalThis.document.startViewTransition &&
      !reduceMotion
    ) {
      const transition = globalThis.document.startViewTransition(runCheck);
      transition.ready.catch(() => {});
    } else {
      runCheck();
    }
  }

  // after every check: report the result for a future course data object
  // and, when correct, collapse a collapsible or stacked question. Runs from
  // checkAnswer so subclasses that replace checkAnswerCallback still get it.
  async _questionChecked() {
    // some types (sorting-question) settle their result in updated()
    for (let i = 0; i < 5; i++) {
      if (await this.updateComplete) {
        break;
      }
    }
    const status = this._shellStatus();
    if (status === "ready") {
      return;
    }
    this.dispatchEvent(
      new CustomEvent("question-element-state", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: {
          tag: this.tagName.toLowerCase(),
          question: this.question,
          quizName: this.quizName,
          status: status,
          correct: status === "correct",
          attempts: this.attempts,
          maxAttempts: this.maxAttempts,
          guess: this._guessSnapshot(),
        },
      }),
    );
    if (status === "correct" && this._isStackable() && !this.edit) {
      this._scheduleCompletionCollapse();
    }
  }

  // plain copy of the current guess; null when it cannot be copied
  _guessSnapshot() {
    try {
      return JSON.parse(JSON.stringify(this.getGuess()));
    } catch {
      return null;
    }
  }

  // pause so the result can be seen before the row closes; none when the
  // visitor prefers reduced motion
  _completionDelay() {
    const reduceMotion =
      globalThis.matchMedia &&
      globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return reduceMotion ? 0 : 1500;
  }

  _scheduleCompletionCollapse() {
    if (this._completionTimer) {
      clearTimeout(this._completionTimer);
    }
    this._completionTimer = setTimeout(() => {
      this._completionTimer = null;
      this._collapseOnCompletion();
    }, this._completionDelay());
  }

  // close a correctly answered question and open the next one in its stack
  // that has not been answered correctly yet
  _collapseOnCompletion() {
    if (
      !this.isConnected ||
      !this._isStackable() ||
      this.collapsed ||
      !this.showAnswer ||
      this._shellStatus() !== "correct"
    ) {
      return;
    }
    const hadFocus = this.matches(":focus-within");
    this.collapsed = true;
    const run = this._inStack ? this._stackRun() : [this];
    const next = run
      .slice(run.indexOf(this) + 1)
      .find(
        (el) =>
          !el._haxstate && !(el.showAnswer && el._shellStatus() === "correct"),
      );
    if (next) {
      run.forEach((el) => {
        if (el !== next && !el._haxstate) {
          el.collapsed = true;
        }
      });
      next.collapsed = false;
    }
    // focus was in the panel that just closed; keep keyboard users on track
    if (hadFocus) {
      const target = next || this;
      target.updateComplete.then(() => {
        const btn =
          target.shadowRoot && target.shadowRoot.querySelector("#disclosure");
        if (btn) {
          btn.focus();
        }
      });
    }
  }

  checkAnswerCallback() {
    globalThis.dispatchEvent(
      new CustomEvent("simple-toast-hide", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: false,
      }),
    );
    let si = globalThis.document.createElement("simple-icon-lite");
    let extras = {};
    let toastShowEventName = "simple-toast-show";
    // support for haxcms toast
    // the haxcms toast shows its status as a badge on the character, so the
    // message stays one line; other toasts still get the icon slotted in
    const haxToast = Boolean(globalThis.HAXCMSToast);
    if (haxToast) {
      toastShowEventName = "haxcms-toast-show";
    }
    this.showAnswer = true;
    this.shadowRoot.querySelector("#feedback").focus();
    // see if they got this correct based on their answers
    let toastColor, toastIcon, toastText;
    let correctness = this.isCorrect();
    if (correctness) {
      toastColor = "green";
      toastIcon = "icons:thumb-up";
      toastText = this.correctText;
      this.makeItRain();
      this.playSound("success");
      extras.hat = "party";
    } else {
      toastColor = "red";
      toastIcon = "icons:thumb-down";
      toastText = this.incorrectText;
      extras.fire = true;
      this.playSound("error");
    }
    si.icon = toastIcon;
    si.style.marginLeft = "16px";
    si.accentColor = toastColor;
    si.dark = true;
    // gets it all the way to the top immediately
    globalThis.dispatchEvent(
      new CustomEvent(toastShowEventName, {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          text: toastText,
          accentColor: toastColor,
          duration: 3000,
          slot: haxToast ? undefined : si,
          tone: haxToast ? (correctness ? "success" : "warning") : undefined,
          ...extras,
        },
      }),
    );
    // start of data passing, this is a prototype atm
    let eventData = {
      activityDisplay: "answered",
      objectName: this.quizName,
      resultSuccess: correctness,
    };
    this.dispatchEvent(
      new CustomEvent("user-engagement", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: eventData,
      }),
    );
    // add to the attempts but AFTER everything runs so we can process if no more attempts exist
    this.attempts++;
  }

  /**
   * Figure out the order of the answers which will be displayed
   */
  _computeDisplayedAnswers(answers, randomize) {
    // if we are editing via HAX, don't randomize the answers
    // as we are actively editing the content and this is amazingly jarring
    if (
      typeof answers !== typeof undefined &&
      answers != null &&
      answers.length > 0 &&
      randomize &&
      !this._haxstate
    ) {
      let random = answers;
      let currentIndex = random.length,
        temporaryValue,
        randomIndex;
      // While there remain elements to shuffle...
      while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = random[currentIndex];
        random[currentIndex] = random[randomIndex];
        random[randomIndex] = temporaryValue;
      }
      return random;
    } else {
      return answers;
    }
  }
  static get properties() {
    return {
      ...super.properties,
      /**
       * OER Schema type. Reflected (rather than set in firstUpdated) so it is
       * also in server rendered HTML.
       */
      typeof: { type: String, reflect: true },
      edit: { type: Boolean, reflect: true },
      // show the solution feedback to the user
      showAnswer: { type: Boolean, reflect: true, attribute: "show-answer" },
      media: { type: String },
      // support for max attempts, default is unlimited
      maxAttempts: { type: Number, reflect: true, attribute: "max-attempts" },
      // track how many times they've tried the interaction
      attempts: { type: Number, reflect: true },
      /**
       * Support disabling interaction with the entire board
       */
      disabled: {
        type: Boolean,
        reflect: true,
      },
      /**
       * Simple option, otherwise allow multiple via checkbox
       */
      singleOption: {
        type: Boolean,
        attribute: "single-option",
      },
      /**
       * Related Resource ID
       */
      relatedResource: {
        type: String,
        attribute: "related-resource",
      },
      /**
       * OER Schema: grading format for this assessment
       */
      gradingFormat: {
        type: String,
        attribute: "grading-format",
      },
      /**
       * OER Schema: learning objective associated with this assessment
       */
      hasLearningObjective: {
        type: String,
        attribute: "has-learning-objective",
      },
      /**
       * OER Schema: course this assessment is for
       */
      forCourse: {
        type: String,
        attribute: "for-course",
      },
      /**
       * Question to ask
       */
      question: {
        type: String,
      },
      /**
       * Array of possible answers
       */
      answers: {
        type: Array,
      },
      /**
       * Displayed Answer set.
       */
      displayedAnswers: {
        type: Array,
      },
      /**
       * Name of the quiz - hardcoded for now from HTML
       */
      quizName: {
        type: String,
        attribute: "quiz-name",
      },
      /**
       * Randomize the display of the answers
       */
      randomize: {
        type: Boolean,
        reflect: true,
      },
      /**
       * flag to hide buttons
       */
      hideButtons: {
        type: Boolean,
        attribute: "hide-buttons",
      },
      /**
       * Opt in to stacking: the question gets a disclosure header and can
       * collapse to a single row showing the question and its status, and
       * collapses on its own once answered correctly. Questions placed right
       * next to each other stack this way automatically; opening one closes
       * the others in that run.
       */
      collapsible: {
        type: Boolean,
        reflect: true,
      },
      /**
       * Whether a collapsible or stacked question is collapsed to its header
       * row. Set by the author it is the starting state; otherwise it has no
       * effect on a question that is neither collapsible nor in a stack.
       */
      collapsed: {
        type: Boolean,
        reflect: true,
      },
      /**
       * Internal: true while an adjacent sibling is another question, which
       * makes this question stack automatically. Never reflected or saved.
       */
      _inStack: {
        type: Boolean,
        state: true,
      },
    };
  }
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      super.styles,
      DDDStatusTokens,
      DDDBlockStyles,
      css`
        :host {
          display: block;
          min-width: 160px;
          text-align: start;
          padding: var(--ddd-spacing-4);
          border: var(--ddd-border-md);
          border-radius: var(--ddd-radius-sm);
          box-shadow: var(--ddd-boxShadow-sm);
          transition: all var(--ddd-duration-normal, 0.3s) ease-in-out;
          --simple-fields-background-color: transparent;
          --simple-toolbar-button-border-color: var(
            --simple-colors-default-theme-grey-4
          );
          --simple-fields-field-color: var(
            --simple-colors-default-theme-grey-12
          );
          --simple-fields-field-ink-color: var(
            --simple-colors-default-theme-grey-12
          );
          --simple-fields-field-checked-color: var(
            --simple-colors-default-theme-accent-8
          );
          --simple-fields-field-checked-ink-color: var(
            --simple-colors-default-theme-accent-8
          );
          --simple-fields-field-checkmark-color: var(
            --simple-colors-default-theme-grey-1
          );
          --simple-fields-field-label-color: var(
            --simple-colors-default-theme-grey-12
          );
          --simple-fields-field-error-color: var(
            --simple-colors-default-theme-red-8
          );
          --simple-fields-border-bottom-size: 0px;
          --simple-fields-border-bottom-focus-size: 0px;

          --simple-fields-margin-small: 42px;
          --grid-plate-item-margin: 0 8px;
          --grid-plate-item-padding: 0 8px;
        }

        /* block header actions keep the DDDBlock button treatment */
        :host button:where(:not(.ddd-block-action)) {
          background-color: var(--simple-colors-default-theme-grey-1);
          color: var(--simple-colors-default-theme-grey-12);
        }
        :host simple-fields-field:hover,
        :host simple-fields-field:focus,
        :host simple-fields-field:focus-within,
        :host simple-fields-field:active {
          cursor: pointer;
        }
        p {
          padding: 0;
          margin: 0;
        }
        grid-plate {
          view-transition-name: grid-shift;
          transition: var(--ddd-duration-normal, 0.3s) ease-in-out height;
        }
        details {
          max-width: unset;
        }
        details[open] {
          view-transition-name: details-open;
          transition: var(--ddd-duration-normal, 0.3s) ease-in-out height;
        }
        details[open] p {
          padding: var(--ddd-spacing-2);
        }
        details[open] .container {
          padding: var(--ddd-spacing-6);
          margin: 0;
          border: var(--ddd-border-sm);
          border-top: none;
        }
        details[open] .container h4 {
          margin-top: 0;
        }
        #legend {
          margin: 0 -26px;
        }
        ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        h3 {
          padding: 0;
          margin: 0 0 var(--ddd-spacing-4) 0;
          font-family: var(--ddd-font-navigation);
        }
        ul li {
          padding: 0;
        }
        img {
          max-width: var(--question-element-img-max-width, 250px);
          height: var(--question-element-img-height, 100px);
          vertical-align: middle;
        }
        simple-icon {
          display: inline-flex;
        }
        #buttons {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          margin: var(--ddd-spacing-4) 0 0 0;
        }
        #check {
          margin-right: var(--ddd-spacing-4);
        }
        .details-icon {
          --simple-icon-height: var(--ddd-icon-xs);
          --simple-icon-width: var(--ddd-icon-xs);
          margin-right: var(--ddd-spacing-2);
        }
        simple-fields-field {
          view-transition-name: field;
          border-radius: var(--ddd-radius-xs);
          padding: 8px;
          min-height: 52px;
          width: stretch;
          --simple-fields-min-width: 120px;
          --simple-fields-input-max-width: auto;
          margin-top: var(--ddd-spacing-2);
          margin-bottom: var(--ddd-spacing-2);
          --simple-fields-font-family: var(--ddd-font-navigation);
          --simple-fields-font-size: var(--ddd-font-size-xs);
          --simple-fields-line-height: var(--ddd-font-size-xs);
          --simple-icon-height: var(--ddd-icon-xs);
          --simple-icon-width: var(--ddd-icon-xs);
          --simple-fields-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          --simple-fields-input-background-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-coalyGray)
          );
          --simple-fields-input-border: 1px solid black;
          --simple-fields-background-color: transparent;
          --simple-fields-fieldset-background-color: transparent;
          --simple-fields-border-color: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-primary-5)
          );
          --simple-fields-select-option-background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          --simple-fields-select-option-selected-background-color: light-dark(
            var(--ddd-theme-default-skyBlue),
            var(--ddd-theme-default-potentialMidnight)
          );
          --simple-fields-button-background-color: transparent;
        }
        simple-fields-field[type="textfield"] {
          padding: var(--ddd-spacing-4);
          min-height: var(--ddd-spacing-8);
        }
        simple-fields-field::part(select) {
          padding-top: var(--ddd-spacing-1);
          padding-bottom: var(--ddd-spacing-1);
          padding-left: var(--ddd-spacing-1);
          min-height: var(--ddd-spacing-8);
          line-height: 1.1;
        }
        simple-toolbar-button {
          font-size: var(--ddd-font-size-xs);
          font-family: var(--ddd-font-navigation);
          transition: all var(--ddd-duration-normal, 0.3s) ease-in-out;
          border: none;
          border-radius: var(--ddd-radius-xs);
        }
        simple-toolbar-button {
          background-color: var(
            --ddd-theme-primary,
            var(--ddd-theme-default-link)
          );
          color: var(
            --lowContrast-override,
            var(--ddd-theme-bgContrast, white)
          );
        }
        details[open] > summary {
          border: var(--ddd-border-sm);
        }
        summary {
          background-color: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-potentialMidnight)
          );
        }
        simple-toolbar-button[disabled] {
          background-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          color: light-dark(black, white);
          opacity: var(--ddd-opacity-80, 0.7);
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
        simple-fields-field:not([type="textfield"])::part(option-inner) {
          position: absolute;
          right: 0px;
          color: light-dark(
            var(--ddd-theme-primary, var(--ddd-theme-default-link)),
            var(--ddd-theme-default-link)
          );
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-xs);
          bottom: 50%;
          top: 50%;
          padding: 0px;
          margin: 0px;
        }
        simple-fields-field[disabled]:not(.correct):not(.incorrect) {
          opacity: var(--ddd-opacity-80, 0.7);
          color: unset;
        }
        button[disabled]:not(.correct):not(.incorrect) {
          opacity: var(--ddd-opacity-80, 0.7);
        }

        h4 {
          color: light-dark(
            var(
              --lowContrast-override,
              var(--ddd-theme-primary, var(--ddd-theme-default-nittanyNavy))
            ),
            var(--ddd-theme-default-linkLight)
          );
        }
        simple-icon {
          display: inline-flex;
        }
        .feedback {
          margin: var(--ddd-spacing-2) 0;
          font-size: var(--ddd-font-size-3xs);
          font-weight: bold;
          text-align: center;
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
        dl .correct {
          border-left: 4px solid var(--ddd-theme-default-opportunityGreen);
          padding-left: 8px;
        }
        dl .incorrect {
          border-left: 4px dotted
            light-dark(
              var(--ddd-theme-default-wonderPurple),
              var(--ddd-theme-default-athertonViolet)
            );
          padding-left: 8px;
        }
        .tag-option.correct {
          outline: 3px solid var(--ddd-theme-default-opportunityGreen);
          outline-offset: -3px;
        }

        .tag-option.incorrect {
          outline: 3px dotted
            light-dark(
              var(--ddd-theme-default-wonderPurple),
              var(--ddd-theme-default-athertonViolet)
            );
          outline-offset: -3px;
        }
        /* ---------- visitor shell ---------- */
        :host(:not([edit])) {
          padding: 0;
          border: none;
          box-shadow: none;
        }
        /* frame, header, chip, label, header actions and footer come from
           DDDBlockStyles; only the question states are styled here */
        .shell {
          color: var(--ddd-status-default-ink);
        }
        .shell:focus-within {
          border-color: var(--ddd-status-answered-signal);
        }
        .shell:focus-within .ddd-block-header,
        .shell[data-status="correct"] .ddd-block-header,
        .shell[data-status="incorrect"] .ddd-block-header {
          background-color: var(--ddd-status-answered-bg);
        }
        .shell:focus-within .ddd-block-chip {
          background-color: var(--ddd-status-answered-signal);
        }
        .shell:focus-within .ddd-block-label {
          font-weight: var(--ddd-font-weight-bold);
          color: var(--ddd-status-answered-ink);
        }
        .shell-attempts {
          flex: none;
          margin-inline-end: var(--ddd-spacing-2);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        .shell-strip {
          padding-block: var(--ddd-spacing-3);
          padding-inline: var(--ddd-spacing-4);
          border-bottom: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-150);
        }
        .shell-strip[hidden] {
          display: none;
        }
        .shell-related {
          background-color: light-dark(
            var(--ddd-theme-default-infoLight),
            var(--ddd-theme-default-potentialMidnight)
          );
        }
        .shell-strip p,
        .shell-strip ::slotted(*) {
          margin: 0;
          padding: 0;
        }
        .shell-body {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-3);
          padding: var(--ddd-spacing-4);
        }
        .shell-body h3 {
          margin: 0;
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-theme-h4-font-size);
          font-weight: var(--ddd-font-weight-bold);
          color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
        }
        /* every answer is a full-width row so long answers wrap cleanly */
        .shell fieldset.options {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-2);
          margin: 0;
          padding: 0;
          border: none;
          min-width: 0;
        }
        .shell simple-fields-field.tag-option {
          margin: 0;
          width: 100%;
          min-height: var(--ddd-control-height-md);
          padding-block: var(--ddd-spacing-1);
          padding-inline: var(--ddd-spacing-3);
          border: var(--ddd-border-xs);
          border-color: var(--ddd-status-default-signal);
          border-radius: var(--ddd-radius-sm);
          outline: none;
          box-sizing: border-box;
        }
        .shell simple-fields-field.tag-option {
          --simple-fields-disabled-color: var(--ddd-status-disabled-ink);
          /* checkbox and radio marks keep contrast on light and dark pages */
          --simple-fields-accent-color: var(--ddd-status-answered-signal);
        }
        .shell simple-fields-field.tag-option.correct,
        .shell simple-fields-field.tag-option.incorrect {
          --simple-fields-disabled-color: var(--ddd-status-default-ink);
        }
        .shell simple-fields-field.tag-option::part(field-main) {
          align-items: center;
          gap: var(--ddd-spacing-3);
          min-height: var(--ddd-control-height-sm);
        }
        .shell
          simple-fields-field.tag-option:not([type="textfield"])::part(
            option-inner
          ) {
          position: static;
        }
        .shell simple-fields-field.tag-option::part(label) {
          flex: 1 1 auto;
          min-width: 0;
          margin: 0;
          white-space: normal;
          overflow-wrap: anywhere;
          line-height: var(--ddd-lh-140);
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-regular);
        }
        .shell simple-fields-field.tag-option::part(field-inner),
        .shell simple-fields-field.tag-option::part(field-main-inner) {
          flex: none;
          align-items: center;
        }
        .shell simple-fields-field.tag-option::part(option-icon) {
          color: var(--ddd-status-answered-signal);
        }
        .shell simple-fields-field.tag-option[value],
        .shell simple-fields-field.tag-option.selected {
          border-color: var(--ddd-status-answered-signal);
        }
        .shell simple-fields-field.tag-option:focus-within {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        .shell simple-fields-field.tag-option.correct {
          border-width: var(--ddd-border-size-sm);
          border-style: var(--ddd-status-correct-line);
          border-color: var(--ddd-status-correct-signal);
          opacity: 1;
        }
        .shell simple-fields-field.tag-option.incorrect {
          border-width: var(--ddd-border-size-sm);
          border-style: var(--ddd-status-incorrect-line);
          border-color: var(--ddd-status-incorrect-signal);
          opacity: 1;
        }
        .option-status {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
          margin-inline-start: var(--ddd-spacing-2);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          white-space: nowrap;
          --simple-icon-width: var(--ddd-icon-3xs);
          --simple-icon-height: var(--ddd-icon-3xs);
        }
        .option-status.correct {
          color: var(--ddd-status-correct-ink);
        }
        .option-status.incorrect {
          color: var(--ddd-status-incorrect-ink);
        }
        .shell-feedback-panel {
          padding-block: var(--ddd-spacing-2);
          padding-inline: var(--ddd-spacing-4);
          border-top: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          font-size: var(--ddd-font-size-4xs);
        }
        .shell-feedback-panel:not(:has(> :not(simple-toolbar-button))) {
          display: none;
        }
        /* the action bar carries the retry button for every question type */
        .shell-feedback-panel simple-toolbar-button {
          display: none;
        }
        .shell-feedback-panel p.feedback {
          margin: var(--ddd-spacing-1) 0;
          text-align: start;
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-medium);
        }
        .shell-feedback-panel h4 {
          margin: var(--ddd-spacing-2) 0 var(--ddd-spacing-1);
          font-size: var(--ddd-font-size-4xs);
        }
        /* the action bar is the block footer: status left, buttons right */
        .shell-action-bar {
          background-color: var(--ddd-status-answered-bg);
        }
        .shell[data-status="correct"] .shell-action-bar {
          border-top: var(--ddd-border-size-md) var(--ddd-status-correct-line)
            var(--ddd-status-correct-signal);
        }
        .shell[data-status="incorrect"] .shell-action-bar {
          border-top: var(--ddd-border-size-md) var(--ddd-status-incorrect-line)
            var(--ddd-status-incorrect-signal);
        }
        .shell-status {
          display: flex;
          align-items: flex-start;
          gap: var(--ddd-spacing-2);
          flex: 1 1 220px;
          min-height: var(--ddd-icon-xxs);
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-140);
        }
        .shell-status:focus {
          outline: none;
        }
        .shell-status:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        .shell-status-chip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: none;
          width: var(--ddd-icon-xxs);
          height: var(--ddd-icon-xxs);
          border-radius: var(--ddd-radius-circle);
          color: var(--ddd-status-default-bg);
          --simple-icon-width: var(--ddd-icon-4xs);
          --simple-icon-height: var(--ddd-icon-4xs);
        }
        .shell[data-status="correct"] .shell-status-chip {
          background-color: var(--ddd-status-correct-signal);
        }
        .shell[data-status="incorrect"] .shell-status-chip {
          background-color: var(--ddd-status-incorrect-signal);
        }
        .shell[data-status="correct"] .shell-status-word {
          color: var(--ddd-status-correct-ink);
        }
        .shell[data-status="incorrect"] .shell-status-word {
          color: var(--ddd-status-incorrect-ink);
        }
        .shell #buttons {
          margin: 0;
          margin-inline-start: auto;
          gap: var(--ddd-spacing-2);
        }
        .shell #buttons [hidden] {
          display: none;
        }
        .shell #check {
          margin-right: 0;
        }
        .shell simple-toolbar-button {
          background-color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-linkLight)
          );
          color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
        }
        .shell simple-toolbar-button[disabled] {
          background-color: var(--ddd-status-disabled-bg);
          color: var(--ddd-status-disabled-ink);
          opacity: 1;
        }
        .shell simple-toolbar-button::part(button) {
          min-height: var(--ddd-control-height-sm);
          padding-block: 0;
          padding-inline: var(--ddd-spacing-4);
          border-color: transparent;
        }
        .shell simple-toolbar-button[disabled]::part(button) {
          border: var(--ddd-border-xs);
          border-style: var(--ddd-status-disabled-line);
          border-color: var(--ddd-status-disabled-signal);
        }
        .shell simple-toolbar-button::part(label) {
          font-size: var(--ddd-font-size-4xs);
        }
        /* ---------- collapsible stack (opt in via collapsible) ---------- */
        .shell-panel[hidden],
        .shell-title[hidden] {
          display: none;
        }
        .shell[data-stack] .ddd-block-header {
          padding-inline: var(--ddd-spacing-2);
        }
        .shell[data-stack="collapsed"] .ddd-block-header {
          border-bottom: none;
        }
        .ddd-block-header h3.shell-heading {
          flex: 1 1 auto;
          min-width: 0;
          margin: 0;
          padding: 0;
          font: inherit;
        }
        .shell .shell-disclosure {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-3);
          width: 100%;
          min-height: var(--ddd-control-height-sm);
          margin: 0;
          padding-block: var(--ddd-spacing-1);
          padding-inline: var(--ddd-spacing-2);
          border: none;
          border-radius: var(--ddd-radius-sm);
          background-color: transparent;
          color: inherit;
          font: inherit;
          text-align: start;
          cursor: pointer;
        }
        .shell .shell-disclosure:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        /* the row title stays quiet until its question is open */
        .shell-title {
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-regular);
          line-height: var(--ddd-lh-140);
          color: var(--ddd-status-default-ink);
          overflow-wrap: anywhere;
        }
        .shell-chevron {
          flex: none;
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
          --simple-icon-width: var(--ddd-icon-3xs);
          --simple-icon-height: var(--ddd-icon-3xs);
        }
        .shell-pill {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
          flex: none;
          padding-block: 0;
          padding-inline: var(--ddd-spacing-2);
          border: var(--ddd-border-size-xs) solid
            var(--ddd-status-disabled-signal);
          border-radius: var(--ddd-radius-rounded);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-5xs);
          font-weight: var(--ddd-font-weight-medium);
          white-space: nowrap;
          color: var(--ddd-status-disabled-ink);
          --simple-icon-width: var(--ddd-icon-4xs);
          --simple-icon-height: var(--ddd-icon-4xs);
        }
        .shell-pill[data-pill="correct"] {
          border: var(--ddd-border-size-sm) var(--ddd-status-correct-line)
            var(--ddd-status-correct-signal);
          font-weight: var(--ddd-font-weight-bold);
          color: var(--ddd-status-correct-ink);
        }
        .shell-pill[data-pill="incorrect"] {
          border: var(--ddd-border-size-sm) var(--ddd-status-incorrect-line)
            var(--ddd-status-incorrect-signal);
          font-weight: var(--ddd-font-weight-bold);
          color: var(--ddd-status-incorrect-ink);
        }
        /* the open question in a stack is the active one: heavier navy
           frame, tinted header, bold navy title and eyebrow, navy chip */
        .shell[data-stack="expanded"] {
          border: var(--ddd-border-size-sm) solid
            var(--ddd-status-answered-signal);
          box-shadow: var(--ddd-boxShadow-sm);
        }
        .shell[data-stack="expanded"] .ddd-block-header {
          background-color: var(--ddd-status-answered-bg);
        }
        .shell[data-stack="expanded"] .ddd-block-label {
          font-weight: var(--ddd-font-weight-bold);
          color: var(--ddd-status-answered-ink);
        }
        .shell[data-stack="expanded"] .shell-title {
          font-size: var(--ddd-font-size-3xs);
          font-weight: var(--ddd-font-weight-bold);
          color: var(--ddd-status-answered-ink);
        }
        .shell[data-stack="expanded"] .ddd-block-chip {
          background-color: var(--ddd-status-answered-signal);
        }
        .shell[data-stack="expanded"] .shell-chevron {
          color: var(--ddd-status-answered-ink);
        }
        /* closed rows stay quiet so only one heading reads as current */
        .shell[data-stack="collapsed"] .ddd-block-header {
          background-color: transparent;
        }
        .shell[data-stack="collapsed"] .shell-disclosure:hover .shell-title {
          text-decoration: underline;
        }
        /** edit mode, hax, etc */
        :host([edit]) .edit-wrapper {
          border: 2px dashed #999999;
          box-sizing: border-box;
          padding: 16px;
          background-color: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-potentialMidnight)
          );
        }
        :host([edit]) .edit-wrapper::before {
          content: attr(data-feedback-label);
          display: block;
          font-size: 16px;
        }
        :host([edit]) .edit-wrapper ::slotted(*) {
          display: block;
          width: 100%;
          border: var(--ddd-border-sm);
          border-style: dashed;
        }
        :host([edit]) .edit-wrapper ::slotted(*:empty)::before {
          display: block;
          font-size: 12px;
          content: var(--question-element-add-content-label, "Add content");
        }
        @media (max-width: 600px) {
          :host {
            padding: 4px;
            margin: 0;
            --grid-plate-item-margin: 0;
            --grid-plate-item-padding: 0;
            font-size: var(--ddd-font-size-4xs);
          }
          h3 {
            margin: 4px;
          }
          :host .column ::slotted(*) {
            padding: 0;
            margin: 0;
          }
        }
      `,
    ];
  }

  // fire event about wanting to play a sound
  playSound(sound) {
    globalThis.dispatchEvent(
      new CustomEvent("playaudio", {
        detail: {
          sound: sound,
        },
      }),
    );
  }

  /**
   * HAX preprocess Node to Content hook
   */
  async haxpreProcessNodeToContent(node) {
    // save the collapsed state the author set, never one left by a visitor
    // or by an automatic stack
    if (
      node._authoredCollapsed !== undefined &&
      (node.collapsible || node._inStack) &&
      node.collapsed !== node._authoredCollapsed
    ) {
      node.collapsed = node._authoredCollapsed;
      node.toggleAttribute("collapsed", node._authoredCollapsed);
    }
    // ensure we don't accidentally have the answer displayed!
    // this also rips the data into the lightDom for saving
    // so that we can unset the array data on the object at save time
    // this helps improve SEO / compatibility with CMS solutions
    if (node.answers) {
      // ensure this is null before generating new answers
      // otherwise page to page saves we could lose statefulness
      // these should not actually exist..
      let inputs = Array.from(this.querySelectorAll("input:not([slot])"));
      for (let i in inputs) {
        inputs[i].remove();
      }
      for (let i in node.answers) {
        if (node.answers[i]) {
          let answer = globalThis.document.createElement("input");
          answer.setAttribute("type", "checkbox");
          answer.value = node.answers[i].label;
          if (node.answers[i].correct) {
            // canonical serialization; data-* attributes survive storage
            // sanitizers by default. The legacy bare correct attribute stays
            // readable via inputIsCorrect for existing content but is no
            // longer written (#3113)
            answer.setAttribute("data-correct", "true");
          }
          if (node.answers[i].image) {
            answer.setAttribute("data-image", node.answers[i].image);
          }
          if (node.answers[i].alt) {
            answer.setAttribute("data-image-alt", node.answers[i].alt);
          }
          if (node.answers[i].selectedFeedback) {
            answer.setAttribute(
              "data-selected",
              node.answers[i].selectedFeedback,
            );
          }
          if (node.answers[i].unselectedFeedback) {
            answer.setAttribute(
              "data-unselected",
              node.answers[i].unselectedFeedback,
            );
          }
          node.appendChild(answer);
        }
      }
    }
    return node;
  }

  /**
   * HAX preprocess insert content hook
   */
  haxpreProcessInsertContent(detail, _activeNode) {
    // ensure we don't accidentally have the answer displayed!
    if (
      detail.properties.answers &&
      detail.properties.answers.length > 0 &&
      detail.properties.answers.map
    ) {
      detail.properties.answers = detail.properties.answers.map(function (val) {
        if (val.userGuess) {
          delete val.userGuess;
        }
        return val;
      });
    }
    return detail;
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    // check lightdom on setup for answers to be read in
    // this only happens on initial paint
    // defer a microtask so the reactive answers set inside loadLightDomData
    // does not schedule a second update from within firstUpdated
    // (Lit change-in-update warning) while keeping post-createElement timing
    queueMicrotask(() => {
      this.loadLightDomData();
    });
  }

  render() {
    return html`
      <meta property="oer:assessing" content="${this.relatedResource}" />
      ${this.gradingFormat
        ? html`<meta
            property="oer:gradingFormat"
            content="${this.gradingFormat}"
          />`
        : nothing}
      ${this.hasLearningObjective
        ? html`<meta
            property="oer:hasLearningObjective"
            content="${this.hasLearningObjective}"
          />`
        : nothing}
      ${this.forCourse
        ? html`<meta property="oer:forCourse" content="${this.forCourse}" />`
        : nothing}
      ${cache(this.edit ? this.renderEditView() : this.renderShell())}
    `;
  }

  // status of the interaction for the visitor shell
  _shellStatus() {
    if (!this.showAnswer) {
      return "ready";
    }
    return this.isCorrect() ? "correct" : "incorrect";
  }

  // eyebrow label: activity kind from the existing OER typeof, then the
  // question type from this.t so both translate with the element
  renderEyebrow() {
    const kind = this.typeof === "oer:Practice" ? this.t.practice : this.t.quiz;
    return html`${kind} · ${this.t.questionType}`;
  }

  _toggleDirections() {
    this._directionsOpen = !this._directionsOpen;
    this.requestUpdate();
  }

  _toggleRelated() {
    this._relatedOpen = !this._relatedOpen;
    this.requestUpdate();
  }

  // collapsible questions stack only in the visitor view; while HAX is
  // editing the full shell always shows so authoring is unchanged
  _isStackable() {
    return (
      (Boolean(this.collapsible) || Boolean(this._inStack)) && !this._haxstate
    );
  }

  // the contiguous run of questions this one belongs to, in DOM order.
  // Siblings in another grid-plate column (slot) render elsewhere, so they
  // are stepped over; any other element in the same column ends the run.
  _stackRun() {
    const slot = stackSlotOf(this);
    const walk = (dir) => {
      const found = [];
      let el = this[dir];
      while (el) {
        if (stackSlotOf(el) === slot) {
          if (!isQuestionNode(el)) {
            break;
          }
          found.push(el);
        }
        el = el[dir];
      }
      return found;
    };
    return [
      ...walk("previousElementSibling").reverse(),
      this,
      ...walk("nextElementSibling"),
    ];
  }

  // called for every question in a container when its children change
  _updateStackMembership() {
    const run = this.isConnected ? this._stackRun() : [this];
    const inStack = run.length > 1;
    if (this._inStack !== inStack) {
      this._inStack = inStack;
    }
    // starting state the first time a question lands in a stack: the first
    // one open, the rest collapsed, unless the author set collapsed. Never
    // while HAX is editing, so authoring and saving are untouched.
    if (inStack && !this._stackInitialized && !this._haxstate) {
      this._stackInitialized = true;
      const authored = this.hasAttribute("collapsed");
      if (this._authoredCollapsed === undefined) {
        this._authoredCollapsed = authored;
      }
      if (!authored) {
        this.collapsed = run[0] !== this;
      }
    }
  }

  // the other questions in this question's stack; a lone collapsible
  // question has none
  _stackPeers() {
    return this._inStack ? this._stackRun().filter((el) => el !== this) : [];
  }

  _toggleCollapsed() {
    if (this._completionTimer) {
      clearTimeout(this._completionTimer);
      this._completionTimer = null;
    }
    this.collapsed = !this.collapsed;
    // accordion: opening one question closes the rest of its stack
    if (!this.collapsed) {
      this._stackPeers().forEach((el) => {
        if (!el._haxstate) {
          el.collapsed = true;
        }
      });
    }
  }

  // attempts counter plus the directions and related content toggles
  renderHeaderTools(hasRelated) {
    return html`${this.maxAttempts > 0
        ? html`<span class="shell-attempts"
            >${this._tParts(this.t.attemptsUsed, {
              used: Math.min(
                this.attempts + (this.showAnswer ? 0 : 1),
                this.maxAttempts,
              ),
              max: this.maxAttempts,
            })}</span
          >`
        : nothing}
      <button
        class="ddd-block-action"
        id="directions-toggle"
        aria-controls="directions"
        aria-expanded="${this._directionsOpen ? "true" : "false"}"
        aria-label="${this._directionsOpen
          ? this.t.hideDirections
          : this.t.showDirections}"
        title="${this.t.directions}"
        @click="${this._toggleDirections}"
      >
        <simple-icon-lite
          icon="icons:info-outline"
          aria-hidden="true"
        ></simple-icon-lite>
      </button>
      ${hasRelated
        ? html`<button
            class="ddd-block-action"
            id="related-toggle"
            aria-controls="related"
            aria-expanded="${this._relatedOpen ? "true" : "false"}"
            aria-label="${this._relatedOpen
              ? this.t.hideRelatedContent
              : this.t.showRelatedContent}"
            title="${this.t.relatedContent}"
            @click="${this._toggleRelated}"
          >
            <simple-icon-lite
              icon="av:library-books"
              aria-hidden="true"
            ></simple-icon-lite>
          </button>`
        : nothing}`;
  }

  // status pill for a collapsed row: icon, word and line style so the
  // result never relies on colour alone
  renderStackStatus(status) {
    if (status === "ready") {
      return html`<span class="shell-pill" data-pill="ready"
        >${this.t.notAttempted}</span
      >`;
    }
    return html`<span class="shell-pill" data-pill="${status}"
      ><simple-icon-lite
        icon="${status === "correct" ? "icons:check" : "icons:close"}"
        aria-hidden="true"
      ></simple-icon-lite
      >${status === "correct" ? this.t.correct : this.t.incorrect}</span
    >`;
  }

  // header for a collapsible question: the whole title row is one
  // disclosure button inside a heading (the accordion pattern); the
  // directions and related toggles stay beside it while expanded
  renderStackHeader(status, expanded, hasRelated) {
    return html`<div class="ddd-block-header" part="block-header">
      <h3 class="shell-heading">
        <button
          class="shell-disclosure"
          id="disclosure"
          aria-expanded="${expanded ? "true" : "false"}"
          aria-controls="shell-panel"
          @click="${this._toggleCollapsed}"
        >
          <span class="ddd-block-chip" aria-hidden="true">
            <simple-icon-lite icon="hax:head-question"></simple-icon-lite>
          </span>
          <span class="ddd-block-text">
            <span class="ddd-block-label" id="eyebrow"
              >${this.renderEyebrow()}</span
            >
            <span
              class="ddd-block-title shell-title"
              id="question-heading"
              property="oer:name"
              ?hidden="${!this.question}"
              >${this.question}</span
            >
          </span>
          ${expanded ? nothing : this.renderStackStatus(status)}
          <simple-icon-lite
            class="shell-chevron"
            icon="${expanded ? "icons:expand-less" : "icons:expand-more"}"
            aria-hidden="true"
          ></simple-icon-lite>
        </button>
      </h3>
      ${expanded
        ? html`<span class="ddd-block-actions"
            >${this.renderHeaderTools(hasRelated)}</span
          >`
        : nothing}
    </div>`;
  }

  // the compact visitor view: one header row, the question, the interaction
  // and a single action bar. Section headings that used to be visible
  // (Question, Feedback, Legend, Directions, Related content) are kept as
  // accessible names, descriptions and a visually hidden legend.
  renderShell() {
    const status = this._shellStatus();
    const hasRelated =
      this.querySelector && this.querySelector('[slot="content"]');
    const stack = this._isStackable();
    const expanded = !stack || !this.collapsed;
    const panel = html`${hasRelated
        ? html`<div
            id="related"
            class="shell-strip shell-related"
            role="region"
            aria-label="${this.t.relatedContent}"
            ?hidden="${!this._relatedOpen}"
          >
            <slot name="content"></slot>
          </div>`
        : nothing}
      <div
        id="directions"
        class="shell-strip shell-directions"
        ?hidden="${!this._directionsOpen}"
      >
        <span class="sr-only">${this.t.directions}: </span
        >${this.renderDirections()}
      </div>
      <div class="ddd-block-body shell-body">
        ${stack
          ? nothing
          : html`<h3
              id="question-heading"
              property="oer:name"
              ?hidden="${!this.question}"
            >
              ${this.question}
            </h3>`}
        ${this.renderInteraction()}
      </div>
      ${this.showAnswer
        ? html`<div class="shell-feedback-panel">${this.renderFeedback()}</div>`
        : nothing}
      <div id="legend" class="sr-only">${this.renderLegend()}</div>
      <div class="ddd-block-footer shell-action-bar">
        <div
          id="feedback"
          class="shell-status"
          tabindex="-1"
          role="status"
          aria-live="polite"
          aria-atomic="true"
          aria-label="${this.t.feedback}"
        >
          ${status !== "ready"
            ? html`<span class="shell-status-chip" aria-hidden="true"
                  ><simple-icon-lite
                    icon="${status === "correct"
                      ? "icons:check"
                      : "icons:close"}"
                  ></simple-icon-lite></span
                ><span
                  ><strong class="shell-status-word"
                    >${status === "correct"
                      ? this.t.correct
                      : this.t.incorrect}</strong
                  >
                  ${status === "correct"
                    ? this.correctText
                    : this.incorrectText}</span
                >`
            : nothing}
        </div>
        ${!this.hideButtons ? this.renderButtons() : nothing}
      </div>`;
    return html`
      <confetti-container id="confetti">
        <div
          class="shell ddd-block"
          role="group"
          aria-labelledby="eyebrow question-heading"
          aria-describedby="directions"
          data-status="${status}"
          data-stack="${stack
            ? expanded
              ? "expanded"
              : "collapsed"
            : nothing}"
        >
          ${stack
            ? this.renderStackHeader(status, expanded, hasRelated)
            : renderDDDBlockHeader({
                id: "eyebrow",
                icon: "hax:head-question",
                label: this.renderEyebrow(),
                actions: this.renderHeaderTools(hasRelated),
              })}
          ${stack
            ? html`<div
                id="shell-panel"
                class="shell-panel"
                ?hidden="${!expanded}"
              >
                ${panel}
              </div>`
            : panel}
        </div>
      </confetti-container>
    `;
  }

  // the original disclosure layout, kept for HAX edit mode so authoring
  // works exactly as it always has
  renderEditView() {
    return html`
      <confetti-container id="confetti">
        <details open>
          <summary id="question">
            <simple-icon-lite
              class="details-icon"
              icon="hax:head-question"
            ></simple-icon-lite
            >${this.t.question}
          </summary>
          <div class="container">
            <h3 property="oer:name" ?hidden="${!this.question}">
              ${this.question}
            </h3>
            ${this.renderInteraction()}
            ${!this.hideButtons ? this.renderButtons() : nothing}
          </div>
        </details>
        <details
          tabindex="${!this.showAnswer ? "-1" : ""}"
          ?disabled="${!this.showAnswer && !this.edit}"
          ?open="${this.showAnswer}"
        >
          <summary id="feedback" tabindex="0">
            <simple-icon-lite
              class="details-icon"
              icon="icons:feedback"
              aria-hidden="true"
            ></simple-icon-lite
            >${this.t.feedback}
            <span class="sr-only" aria-live="polite" aria-atomic="true"
              >${this.showAnswer
                ? this.isCorrect()
                  ? this.correctText
                  : this.incorrectText
                : ""}</span
            >
          </summary>
          <div class="container">
            <details id="legend">
              <summary>
                <simple-icon-lite
                  class="details-icon"
                  icon="hax:map-legend"
                ></simple-icon-lite
                >${this.t.legend}
              </summary>
              <div class="container">${this.renderLegend()}</div>
            </details>
            ${this.renderFeedback()}
          </div>
        </details>
        ${this.querySelector &&
        this.querySelector('[slot="content"]') &&
        !this.edit
          ? html` <details ?open="${!this.showAnswer}" id="related">
              <summary>
                <simple-icon-lite
                  class="details-icon"
                  icon="lrn:content"
                ></simple-icon-lite
                >${this.t.relatedContent}
              </summary>
              <div class="container">
                <slot name="content"></slot>
              </div>
            </details>`
          : nothing}
        <details
          ?open="${this.querySelector &&
          !this.querySelector('[slot="content"]')}"
          id="directions"
        >
          <summary>
            <simple-icon-lite
              class="details-icon"
              icon="maps:directions"
            ></simple-icon-lite
            >${this.t.directions}
          </summary>
          <div class="container">${this.renderDirections()}</div>
        </details>
      </confetti-container>
    `;
  }

  // render the area the user will interact with the question
  // our default implementation is a multiple-choice element
  renderInteraction() {
    return html`
      <fieldset class="options">
        ${this.displayedAnswers.map(
          (answer, index) => html`
            <simple-fields-field
              type="${this.singleOption ? "radio" : "checkbox"}"
              ?disabled="${this.showAnswer || this.disabled}"
              property="oer:answer"
              name="${index}"
              @mousedown="${this.clickSingle}"
              @keydown="${this.clickSingle}"
              class="tag-option ${answer && this.showAnswer && answer.userGuess
                ? answer.correct
                  ? "correct"
                  : "incorrect"
                : ""}"
              aria-invalid="${this.showAnswer &&
              answer &&
              answer.userGuess &&
              !answer.correct
                ? "true"
                : "false"}"
              .value="${answer ? answer.userGuess : ""}"
              @value-changed="${this.checkedEvent}"
              label="${answer && answer.label ? answer.label : ""}"
              >${answer.image
                ? html`<img
                    src="${answer.image}"
                    alt="${answer.alt}"
                    slot="label-prefix"
                    part="image"
                  />`
                : nothing}${answer && this.showAnswer && answer.userGuess
                ? this.renderOptionStatus(answer.correct)
                : nothing}</simple-fields-field
            >
          `,
        )}
      </fieldset>
    `;
  }
  // status word and icon shown on an answered option once checked, so
  // correctness never relies on colour alone
  renderOptionStatus(correct) {
    return html`<span
      slot="suffix"
      class="option-status ${correct ? "correct" : "incorrect"}"
      ><simple-icon-lite
        icon="${correct ? "icons:check" : "icons:close"}"
        aria-hidden="true"
      ></simple-icon-lite
      >${correct ? this.t.correct : this.t.incorrect}</span
    >`;
  }
  // the case for whether or not this is inactive based on user input
  inactiveCase() {
    return this.guessCount() !== 0;
  }

  renderButtons() {
    return html`
      <div id="buttons">
        <simple-toolbar-button
          id="check"
          ?hidden="${!this.edit && this.showAnswer}"
          ?disabled="${this.disabled ||
          !this.inactiveCase() ||
          this.showAnswer ||
          this.attemptsExhausted()}"
          @click="${this.checkAnswer}"
          label="${this.t.checkAnswer}"
        >
        </simple-toolbar-button>
        <simple-toolbar-button
          id="reset"
          ?hidden="${!this.edit && !this.showAnswer}"
          ?disabled="${this.disabled ||
          !this.inactiveCase() ||
          (this.inactiveCase() && !this.showAnswer)}"
          @click="${this.resetAnswer}"
          label="${this.t.tryAgain}"
        >
        </simple-toolbar-button>
      </div>
    `;
  }

  // this manages the directions that are rendered and hard coded for the interaction
  renderDirections() {
    return html`<p>
      ${this._tParts(this.t.defaultDirections, {
        checkAnswer: html`<strong>${this.t.checkAnswer}</strong>`,
      })}
    </p>`;
  }

  // legend so user understands color relation to correctness
  renderLegend() {
    return html` <dl>
      <dt class="correct">${this.t.correct}</dt>
      <dd>${this.t.answerIsCorrect}</dd>
      <dt class="incorrect">${this.t.incorrect}</dt>
      <dd>${this.t.answerRequiresCorrection}</dd>
    </dl>`;
  }

  // this manages the output of the feedback area
  renderFeedback() {
    return html`${!this.edit
      ? html`
          ${this.showAnswer && !this.isCorrect()
            ? html`${this.querySelector &&
              this.querySelector('[slot="feedbackIncorrect"]')
                ? html`<slot
                    name="feedbackIncorrect"
                    property="oer:incorrectFeedback"
                  ></slot>`
                : nothing}`
            : nothing}
          ${this.showAnswer && this.isCorrect()
            ? html`${this.querySelector &&
              this.querySelector('[slot="feedbackCorrect"]')
                ? html`<slot
                    name="feedbackCorrect"
                    property="oer:correctFeedback"
                  ></slot>`
                : nothing}`
            : nothing}
          ${this.querySelector &&
          this.querySelector('[slot="hint"]') &&
          this.showAnswer &&
          !this.isCorrect()
            ? html`
                <h4>${this.t.needAHint}</h4>
                <div>
                  <slot name="hint"></slot>
                </div>
              `
            : nothing}
          ${this.querySelector &&
          this.querySelector('[slot="evidence"]') &&
          this.showAnswer &&
          this.isCorrect()
            ? html`
                <h4>${this.t.evidence}</h4>
                <div>
                  <slot name="evidence"></slot>
                </div>
              `
            : nothing}
        `
      : this.renderEditModeFeedbackAreas()}`;
  }

  clickSingle(e) {
    // single option shortcut only bc we have to wipe all others
    if (this.singleOption) {
      let proceed = false;
      // ensure if it's a keyboard it was enter or space
      if (e.key) {
        if (e.key === " " || e.key === "Enter") {
          proceed = true;
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          if (e.target.previousElementSibling) {
            e.target.previousElementSibling.focus();
          } else {
            e.target.parentNode.lastElementChild.focus();
          }
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          if (e.target.nextElementSibling) {
            e.target.nextElementSibling.focus();
          } else {
            e.target.parentNode.firstElementChild.focus();
          }
        }
      }
      // if click then we process regardless
      else {
        proceed = true;
      }
      // wipe answer data, THEN update will happen later when all the values change
      if (proceed) {
        for (let i in this.displayedAnswers) {
          if (i === e.target.name) {
            if (e.key) {
              if (this.displayedAnswers[i].userGuess) {
                this.displayedAnswers[i].userGuess = "";
              } else {
                this.displayedAnswers[i].userGuess = true;
              }
            }
          } else {
            this.displayedAnswers[i].userGuess =
              i === e.target.name ? true : "";
          }
        }
      }
    } else {
      if (e.key) {
        if (e.key === "ArrowUp") {
          e.preventDefault();
          if (e.target.previousElementSibling) {
            e.target.previousElementSibling.focus();
          } else {
            e.target.parentNode.lastElementChild.focus();
          }
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          if (e.target.nextElementSibling) {
            e.target.nextElementSibling.focus();
          } else {
            e.target.parentNode.firstElementChild.focus();
          }
        } else if (e.key === "Enter") {
          this.displayedAnswers[e.target.name].userGuess = this
            .displayedAnswers[e.target.name].userGuess
            ? ""
            : true;
        }
      }
    }
    this.requestUpdate();
  }
  // ensure data model of the answers is normalized
  cleanAnswerData(answers) {
    let newAnswers = [];
    // force reset bc data changed
    this.showAnswer = false;
    for (let i in answers) {
      let tmpA = { ...this.answerPrototype(), ...answers[i] };
      tmpA.order = parseInt(i);
      newAnswers.push({
        ...this.cleanAnswerDataBeforeSend(tmpA, parseInt(i), answers),
      });
    }
    return newAnswers;
  }

  cleanAnswerDataBeforeSend(answer, _index, _answers) {
    // stub for advanced element usage where items are relative to each other
    return answer;
  }
  // answer object so we can verify answer structure given that we have many things
  // working up above and we don't want to have to constantly provide hidden UI elements just for
  // things like order which is calculated
  answerPrototype() {
    return {
      order: null,
      label: "",
      correct: false,
      image: null,
      alt: "",
      selectedFeedback: null,
      unselectedFeedback: null,
    };
  }
  // read the correct flag off a light dom input; data-correct is the
  // canonical form (any value other than "false" counts as correct) while
  // the legacy bare `correct` attribute remains supported so existing
  // content keeps working (#3113)
  inputIsCorrect(input) {
    const dataCorrect = input.getAttribute("data-correct");
    if (dataCorrect !== null) {
      return dataCorrect.toLowerCase() !== "false";
    }
    return input.getAttribute("correct") !== null;
  }
  // convert the input to data
  processInput(index, inputs, _answers) {
    let input = inputs[index];
    // guard against missing input (e.g. index out of range)
    if (!input) {
      return { ...this.answerPrototype(), order: parseInt(index) };
    }
    // support passing pre-computed answer-like data objects directly,
    // in addition to real light dom <input> elements
    if (typeof input.getAttribute !== "function") {
      return {
        ...this.answerPrototype(),
        ...input,
        order: parseInt(index),
        correct: !!input.correct,
      };
    }
    return {
      order: parseInt(index), // stores the original order this was in for things that leverage this piece of data
      label: input.value,
      correct: this.inputIsCorrect(input),
      image: input.getAttribute("data-image") || null, // support for image prop in questions that want it
      alt: input.getAttribute("data-image-alt") || "", // support for image alt w/ prop question, "" for default to ignore
      selectedFeedback: input.getAttribute("data-selected") || null,
      unselectedFeedback: input.getAttribute("data-unselected") || null,
    };
  }
  // load data off the light dom so that we don't show the answer
  // this also makes it a lot more portable / readable and have better SEO (in theory)
  loadLightDomData() {
    if (this.children.length > 0) {
      let inputs = Array.from(this.querySelectorAll("input:not([slot])"));
      let answers = [];
      for (let i in inputs) {
        let answer = this.processInput(i, inputs, answers);
        answers.push(answer);
      }
      this.answers = answers;
      // wipe lightdom after reading it in for data. This makes it harder for someone
      // to just inspect the document and get at the underlying data
      // remove just the inputs we found
      for (let i in inputs) {
        inputs[i].remove();
      }
    }
  }

  haxactiveElementChanged(element, value) {
    if (value) {
      this._haxstate = value;
      if (this.collapsible || this._inStack) {
        this.requestUpdate();
      }
    }
  }

  haxeditModeChanged(value) {
    this._haxstate = value;
    if (this.collapsible || this._inStack) {
      // editing starts from the collapsed state the author set, never one a
      // visitor left behind, and shows the full authoring view
      if (value && this._authoredCollapsed !== undefined) {
        this.collapsed = this._authoredCollapsed;
      }
      this.requestUpdate();
    }
    // leaving edit mode: automatic stacks rebuild their visitor starting
    // state from what the author left in place
    if (!value) {
      this._stackInitialized = false;
      if (this.isConnected) {
        refreshQuestionStacks(this.parentNode);
      }
    }
  }

  renderEditModeFeedbackAreas() {
    return html`
      <div
        class="edit-wrapper"
        data-feedback-label="${this.t.feedbackEditMode}"
        style="--question-element-add-content-label: ${this._cssString(
          this.t.addContent,
        )};"
      >
        <h4>${this.t.relatedContentHeading}</h4>
        <p>${this.t.relatedContentDescription}</p>
        <slot name="content"></slot>
        <h4>${this.t.feedbackIncorrectHeading}</h4>
        <slot name="feedbackIncorrect"></slot>
        <h4>${this.t.feedbackCorrectHeading}</h4>
        <slot name="feedbackCorrect"></slot>
        <h4>${this.t.hint}</h4>
        <p>${this.t.hintDescription}</p>
        <slot name="hint"></slot>
        <h4>${this.t.evidence}</h4>
        <p>${this.t.evidenceDescription}</p>
        <slot name="evidence"></slot>
      </div>
    `;
  }

  /**
   * Implements haxHooks to tie into life-cycle if hax exists.
   */
  haxHooks() {
    return {
      editModeChanged: "haxeditModeChanged",
      activeElementChanged: "haxactiveElementChanged",
      preProcessNodeToContent: "haxpreProcessNodeToContent",
      preProcessInsertContent: "haxpreProcessInsertContent",
      inlineContextMenu: "haxinlineContextMenu",
    };
  }

  /**
   * add buttons when it is in context
   */
  haxinlineContextMenu(ceMenu) {
    ceMenu.ceButtons = [
      {
        icon: "lrn:edit",
        callback: "haxToggleEdit",
        label: this.t.toggleEditingFeedbackBlocks,
      },
    ];
  }
  haxToggleEdit(_e) {
    this.edit = !this.edit;
    return true;
  }
}
