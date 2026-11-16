/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css, nothing } from "lit";
import { QuestionElement } from "@haxtheweb/multiple-choice/lib/QuestionElement.js";
import {
  activityKey,
  xapiHash,
  XAPI_EXTENSIONS,
} from "@haxtheweb/user-action/lib/xapi.js";
import {
  cleanVariables,
  evaluateFormula,
  fillTokens,
  parseNumber,
  roundTo,
  variableSteps,
  variableValue,
} from "./lib/numeric-formula.js";

/**
 * `numeric-question`
 * `A question answered with a number, correct within a tolerance.`
 *
 * The answer is a fixed number or a formula worked out from variables, so it
 * covers the Numerical and Formula question types of an LMS. The question
 * text can show the variable values with {name} tokens.
 *
 * The key (answer or formula, and the variables) is authored as light DOM
 * inputs that are read once and removed, the same as every QuestionElement:
 *
 *   <numeric-question question="A cyclist rides {d} km in {t} minutes.
 *       What is her average speed?" unit="km/h" tolerance="1"
 *       tolerance-type="percent" decimals="1">
 *     <input type="checkbox" value="d / (t / 60)" data-correct="true" />
 *     <input type="checkbox" data-variable="d" data-min="12" data-max="30"
 *       data-step="1" />
 *     <input type="checkbox" data-variable="t" data-min="30" data-max="90"
 *       data-step="5" />
 *   </numeric-question>
 *
 * @slot hint - shown after a wrong answer
 * @slot feedbackIncorrect - shown after a wrong answer
 * @slot feedbackCorrect - shown after a correct answer
 * @slot evidence - shown after a correct answer
 * @slot content - related content, always available
 * @fires user-engagement - after a check; detail.statement is an xAPI
 *   statement (answered, interactionType numeric)
 * @fires question-element-state - after a check; see QuestionElement
 * @demo demo/index.html
 * @element numeric-question
 */
export class NumericQuestion extends QuestionElement {
  static get tag() {
    return "numeric-question";
  }

  /**
   * xAPI statements this element sends (see scripts/generate-xapi-vocabulary.mjs)
   */
  static get xapiVocabulary() {
    return {
      tag: "numeric-question",
      event: "user-engagement",
      verbs: ["answered"],
      objectType: "http://adlnet.gov/expapi/activities/cmi.interaction",
      interactionType: "numeric",
      definition: ["name", "interactionType", "correctResponsesPattern"],
      response: "the number the learner typed",
      result: [
        "success",
        "completion",
        "response",
        "score",
        "extensions.attempts",
        "extensions.max-attempts",
      ],
      context: ["extensions.variables"],
      countsTowardCompletion: true,
      done: "answered correctly or out of attempts",
    };
  }

  constructor() {
    super();
    this.t = {
      ...this.t,
      questionType: "Numeric",
      numericDirections:
        "Type a number. The unit is shown for you. When you are done, select {checkAnswer}.",
      withinPercent: "Answers within {tolerance}% of the exact value count.",
      withinAbsolute: "Answers within {tolerance} of the exact value count.",
      rerollDirections: "Try again draws new numbers.",
      yourAnswer: "Your answer",
      roundWhole: "Round to a whole number.",
      roundOneDecimal: "Round to 1 decimal place.",
      roundDecimals: "Round to {decimals} decimal places.",
      needsInput: "Needs input",
      enterANumber: "Enter a number, like 18.5.",
      notSetUp: "This question has no answer set up yet.",
      answerIs: "The answer is {answer}.",
      revealed: "Revealed",
      authorViewTitle: "Answer key (only authors see this)",
      answerOrFormula: "Answer or formula",
      formulaHelp:
        "A number, or a formula that uses the variables below, for example d / (t / 60). Formulas can use + - * / ^, parentheses, sqrt() and abs().",
      tokensHelp:
        "Show a variable in the question by writing its name in braces, for example {d}.",
      variablesHeading: "Variables",
      variableName: "Name",
      variableMin: "Lowest",
      variableMax: "Highest",
      variableStep: "Step",
      addVariable: "Add variable",
      removeVariable: "Remove",
      previewValues: "With {values} the answer is {answer}.",
      previewFixed: "The answer is {answer}.",
      keyProblem:
        "This can not be worked out yet. Check that every name in the formula is a variable.",
    };
    // QuestionElement's shared strings live in each question type's own namespace
    this.registerLocalization({
      context: this,
      localesPath: new URL("./locales/", import.meta.url).href,
    });
    this.guessDataValue = "typed";
    this.singleOption = true;
    this.typed = "";
    this.answer = null;
    this.formula = "";
    this.variables = [];
    this.unit = "";
    this.tolerance = 0;
    this.toleranceType = "absolute";
    this.decimals = null;
    this.reroll = false;
    this._note = "";
    this._roll = null;
    this._values = {};
    this._rendering = false;
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * Unit shown as text beside the field, for example "km/h"
       */
      unit: { type: String },
      /**
       * How far from the exact answer still counts; 0 means exact (or
       * rounded to `decimals` when that is set)
       */
      tolerance: { type: Number },
      /**
       * "absolute" (plus or minus the tolerance) or "percent" (plus or minus
       * that percent of the exact answer)
       */
      toleranceType: { type: String, attribute: "tolerance-type" },
      /**
       * Decimal places the answer is rounded to when shown; an answer
       * rounded to this many places always counts
       */
      decimals: { type: Number },
      /**
       * Draw new variable values on every Try again instead of showing the
       * same numbers on every visit
       */
      reroll: { type: Boolean, reflect: true },
      /**
       * Key: the fixed correct answer. Saved as a light DOM input, never as
       * an attribute.
       */
      answer: { type: Number, attribute: false },
      /**
       * Key: a formula worked out from the variables, for example
       * "d / (t / 60)". Used instead of `answer` when set. Saved as a light
       * DOM input, never as an attribute.
       */
      formula: { type: String, attribute: false },
      /**
       * Key: [{ name, min, max, step }] the formula and {name} tokens in the
       * question use. Saved as light DOM inputs, never as an attribute.
       */
      variables: { type: Array, attribute: false },
      /**
       * What the learner typed. Never saved.
       */
      typed: { type: String, attribute: false },
      _note: { type: String, state: true },
      _roll: { type: Object, state: true },
    };
  }

  // The base class renders this.question in its header and body. While it
  // renders, the question reads with its {name} tokens filled in; everywhere
  // else (saving, the HAX form, the xAPI fingerprint) it is what the author
  // wrote. Lit wraps this accessor, so it stays a reactive property.
  get question() {
    return this._rendering
      ? fillTokens(this._question, this._values)
      : this._question;
  }
  set question(value) {
    this._question = value;
  }

  render() {
    this._rendering = true;
    try {
      return super.render();
    } finally {
      this._rendering = false;
    }
  }

  willUpdate(changedProperties) {
    super.willUpdate(changedProperties);
    if (changedProperties.has("reroll") && !this.reroll) {
      this._roll = null;
    }
    if (
      ["variables", "question", "quizName", "reroll", "_roll"].some((name) =>
        changedProperties.has(name),
      )
    ) {
      this._values = this._computeValues();
    }
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    // the field is native, so a value the learner typed has to be replaced
    // by hand when it is cleared or restored
    if (changedProperties.has("typed")) {
      const input = this.shadowRoot && this.shadowRoot.querySelector("#nq-in");
      const typed = this.typed || "";
      if (input && input.value !== typed) {
        input.value = typed;
      }
    }
  }

  // ---------- variables ----------

  // Value of every variable. By default the step is picked from a hash of
  // the activity key (element id, authored resource, or a fingerprint of the
  // question), so the numbers are the same on every visit and a saved answer
  // still fits them. A roll (reroll) holds steps drawn at random instead.
  _computeValues() {
    const values = {};
    const key = activityKey(this);
    cleanVariables(this.variables).forEach((v) => {
      const index =
        this._roll && typeof this._roll[v.name] === "number"
          ? this._roll[v.name]
          : parseInt(xapiHash(`${key}\u0001${v.name}`), 16);
      values[v.name] = variableValue(v, index);
    });
    return values;
  }

  // draw a step for every variable from the crypto source; without one the
  // values stay the deterministic ones
  _drawRoll() {
    const c = globalThis.crypto;
    if (!c || typeof c.getRandomValues !== "function") {
      this._roll = null;
      return;
    }
    const roll = {};
    cleanVariables(this.variables).forEach((v) => {
      const steps = variableSteps(v);
      // reject the top of the range so every step is equally likely
      const limit = Math.floor(4294967296 / steps) * steps;
      const draw = new Uint32Array(1);
      let n = limit;
      for (let tries = 0; tries < 16 && n >= limit; tries++) {
        c.getRandomValues(draw);
        n = draw[0];
      }
      roll[v.name] = n % steps;
    });
    this._roll = roll;
  }

  // ---------- key and scoring ----------

  _decimals() {
    const d = this.decimals;
    return typeof d === "number" && Number.isFinite(d) && d >= 0
      ? Math.min(10, Math.floor(d))
      : null;
  }

  // the exact answer for the values showing now; NaN when there is no key
  _exact() {
    if (typeof this.formula === "string" && this.formula.trim()) {
      return evaluateFormula(this.formula, this._values);
    }
    return this._answerNumber(this);
  }
  // the fixed answer as a number (a form may hand it over as text)
  _answerNumber(node) {
    const a = node.answer;
    return parseNumber(typeof a === "number" ? a : String(a == null ? "" : a));
  }

  // { exact, min, max } a correct answer falls in; null when there is no key
  _range() {
    const exact = this._exact();
    if (!Number.isFinite(exact)) {
      return null;
    }
    let tolerance = Math.max(0, Number(this.tolerance) || 0);
    if (this.toleranceType === "percent") {
      tolerance = (Math.abs(exact) * tolerance) / 100;
    }
    // the answer rounded the way the question asks always counts
    const d = this._decimals();
    if (d !== null) {
      tolerance = Math.max(tolerance, 0.5 * Math.pow(10, -d));
    }
    return { exact, min: exact - tolerance, max: exact + tolerance };
  }

  // the exact answer as shown to people: rounded, with the unit
  _formatAnswer(exact) {
    const d = this._decimals();
    const number =
      d !== null
        ? roundTo(exact, d).toFixed(d)
        : String(Number(exact.toPrecision(10)));
    return this.unit ? `${number} ${this.unit}` : number;
  }

  isCorrect() {
    const value = parseNumber(this.typed);
    const range = this._range();
    if (!range || !Number.isFinite(value)) {
      return false;
    }
    // floating point slack so 0.1 + 0.2 still equals 0.3
    const slack = 1e-9 * Math.max(1, Math.abs(range.exact));
    return value >= range.min - slack && value <= range.max + slack;
  }

  // the check button is always live; an empty or unusable answer gets the
  // needs input message instead of a disabled button
  inactiveCase() {
    return true;
  }

  /**
   * Check the answer. Something that is not a number (or a question with no
   * key) shows a needs input message and is not counted as an attempt.
   * Nothing is checked while HAX is editing.
   * @returns {Promise<void>}
   */
  checkAnswer(e) {
    if (this._haxstate || this.showAnswer || this.attemptsExhausted()) {
      return Promise.resolve();
    }
    const note = !this._range()
      ? "setup"
      : Number.isFinite(parseNumber(this.typed))
        ? ""
        : "input";
    this._note = note;
    if (note) {
      const input = this.shadowRoot && this.shadowRoot.querySelector("#nq-in");
      if (input) {
        input.focus();
      }
      return Promise.resolve();
    }
    return super.checkAnswer(e);
  }

  resetAnswer(e) {
    if (this.reroll) {
      this._drawRoll();
      this.typed = "";
    } else if (this.isCorrect()) {
      // right: start clean in case they want to take it again
      this.typed = "";
    }
    this._note = "";
    super.resetAnswer(e);
  }

  // ---------- xAPI and the learner record ----------

  // xAPI numeric: the correct responses are one range, min[:]max
  xapiDefinition() {
    const range = this._range();
    const n = (value) => String(Number(value.toPrecision(12)));
    return range
      ? { correctResponsesPattern: [`${n(range.min)}[:]${n(range.max)}`] }
      : {};
  }
  // the numbers this attempt drew, so the answer can be checked against
  // what the learner saw; nothing when the question has no variables
  xapiContextExtensions() {
    const names = Object.keys(this._values || {});
    if (!names.length) {
      return {};
    }
    const values = {};
    names.forEach((name) => {
      values[name] = this._values[name];
    });
    return { [XAPI_EXTENSIONS.variables]: values };
  }
  // the header chip matches the block's icon in the block list
  get questionIcon() {
    return "editor:functions";
  }
  // the number typed is the answer, so it is the response
  learnerResponse() {
    const value = parseNumber(this.typed);
    return Number.isFinite(value) ? String(value) : "";
  }
  // with reroll the numbers on screen are not the ones the saved answer was
  // for, so only the status and attempts come back
  _canRestoreGuess() {
    return !this.reroll;
  }
  restoreLearnerResponse(response) {
    if (!this._canRestoreGuess()) {
      return false;
    }
    const value = parseNumber(
      typeof response === "number" ? response : String(response || ""),
    );
    if (!Number.isFinite(value)) {
      return false;
    }
    this.typed = String(value);
    return true;
  }
  forgetLearnerResponse() {
    this.typed = "";
  }

  // ---------- light DOM key ----------

  // a number is a fixed answer; anything else is a formula
  _setKey(text) {
    const value = parseNumber(String(text == null ? "" : text));
    if (Number.isFinite(value)) {
      this.answer = value;
      this.formula = "";
    } else {
      this.answer = null;
      this.formula = String(text == null ? "" : text).trim();
    }
  }
  _keyText(node) {
    if (typeof node.formula === "string" && node.formula.trim()) {
      return node.formula.trim();
    }
    const answer = this._answerNumber(node);
    return Number.isFinite(answer) ? String(answer) : "";
  }
  // read the key off the light DOM inputs once, then remove them so the
  // answer is not sitting in the page
  loadLightDomData() {
    const inputs = Array.from(this.querySelectorAll("input:not([slot])"));
    if (inputs.length) {
      const variables = [];
      inputs.forEach((input) => {
        const name = input.getAttribute("data-variable");
        if (name !== null) {
          variables.push({
            name,
            min: input.getAttribute("data-min"),
            max: input.getAttribute("data-max"),
            step: input.getAttribute("data-step"),
          });
        } else {
          this._setKey(input.getAttribute("value"));
        }
        input.remove();
      });
      if (variables.length) {
        this.variables = cleanVariables(variables);
      }
    }
    if (this.reroll && !this._haxstate) {
      this._drawRoll();
    }
  }

  // ---------- HAX ----------

  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }

  // write the key back as light DOM inputs for saving
  async haxpreProcessNodeToContent(node) {
    node = await super.haxpreProcessNodeToContent(node);
    Array.from(node.querySelectorAll("input:not([slot])")).forEach((input) =>
      input.remove(),
    );
    const add = (attributes) => {
      const input = globalThis.document.createElement("input");
      input.setAttribute("type", "checkbox");
      Object.keys(attributes).forEach((name) =>
        input.setAttribute(name, attributes[name]),
      );
      node.appendChild(input);
    };
    const key = this._keyText(node);
    if (key) {
      add({ value: key, "data-correct": "true" });
    }
    cleanVariables(node.variables).forEach((v) =>
      add({
        "data-variable": v.name,
        "data-min": String(v.min),
        "data-max": String(v.max),
        "data-step": String(v.step),
      }),
    );
    return node;
  }

  // nothing a learner did, and no random roll, reaches authoring
  haxeditModeChanged(value) {
    super.haxeditModeChanged(value);
    this.typed = "";
    this._note = "";
    this.showAnswer = false;
    if (value || !this.reroll) {
      this._roll = null;
    } else {
      this._drawRoll();
    }
    this.requestUpdate();
  }

  _authoring() {
    return Boolean(this._haxstate);
  }

  // ---------- rendering ----------

  renderDirections() {
    const tolerance = Math.max(0, Number(this.tolerance) || 0);
    return html`<ul class="nq-directions">
      <li>
        ${this._tParts(this.t.numericDirections, {
          checkAnswer: html`<strong>${this.t.checkAnswer}</strong>`,
        })}
      </li>
      ${
        tolerance > 0
          ? html`<li>
              ${this._tParts(
                this.toleranceType === "percent"
                  ? this.t.withinPercent
                  : this.t.withinAbsolute,
                { tolerance },
              )}
            </li>`
          : nothing
      }
      ${this.reroll ? html`<li>${this.t.rerollDirections}</li>` : nothing}
    </ul>`;
  }

  _roundingHint() {
    const d = this._decimals();
    if (d === null) {
      return "";
    }
    if (d === 0) {
      return this.t.roundWhole;
    }
    return d === 1
      ? this.t.roundOneDecimal
      : this._tParts(this.t.roundDecimals, { decimals: d });
  }

  renderInteraction() {
    const checked = this.showAnswer;
    const correct = checked && this.isCorrect();
    const range = this._range();
    // the exact answer shows once the learner is done with the question
    const reveal = checked && range && (correct || this.attemptsExhausted());
    const hint = this._roundingHint();
    const describedBy = [
      this.unit ? "nq-unit" : "",
      hint ? "nq-hint" : "",
      "nq-note",
    ]
      .filter(Boolean)
      .join(" ");
    return html`
      <div class="nq-row">
        <label for="nq-in">${this.t.yourAnswer}</label>
        <input
          id="nq-in"
          class="nq-field ${
            checked
              ? correct
                ? "nq-correct"
                : "nq-incorrect"
              : this._note
                ? "nq-missing"
                : ""
          }"
          type="text"
          inputmode="decimal"
          autocomplete="off"
          spellcheck="false"
          property="oer:answer"
          value="${this.typed || ""}"
          ?disabled="${
            this.disabled || this.showAnswer || this.attemptsExhausted()
          }"
          aria-invalid="${
            (checked && !correct) || this._note === "input" ? "true" : "false"
          }"
          aria-describedby="${describedBy}"
          @input="${this._typedInput}"
          @keydown="${this._typedKeydown}"
        />
        ${
          this.unit
            ? html`<span class="nq-unit" id="nq-unit">${this.unit}</span>`
            : nothing
        }
        ${checked ? this.renderOptionStatus(correct) : nothing}
      </div>
      ${hint ? html`<p class="nq-hint" id="nq-hint">${hint}</p>` : nothing}
      <p
        class="nq-note ${this._note ? "nq-note-on" : ""}"
        id="nq-note"
        role="status"
        aria-live="polite"
      >
        ${
          this._note
            ? html`<simple-icon-lite
                  icon="icons:error-outline"
                  aria-hidden="true"
                ></simple-icon-lite
                ><span
                  ><strong>${this.t.needsInput}</strong> ${
                    this._note === "setup"
                      ? this.t.notSetUp
                      : this.t.enterANumber
                  }</span
                >`
            : nothing
        }
      </p>
      ${
        reveal
          ? html`<p class="nq-reveal">
              <simple-icon-lite
                icon="icons:visibility"
                aria-hidden="true"
              ></simple-icon-lite
              ><span
                ><span class="sr-only">${this.t.revealed}: </span
                >${this._tParts(this.t.answerIs, {
                  answer: html`<strong
                    >${this._formatAnswer(range.exact)}</strong
                  >`,
                })}</span
              >
            </p>`
          : nothing
      }
      ${this._authoring() ? this.renderAuthorView(range) : nothing}
    `;
  }

  _typedInput(e) {
    this.typed = e.target.value;
    if (this._note) {
      this._note = "";
    }
  }
  _typedKeydown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      this.checkAnswer(e);
    }
  }

  // ---------- author view (HAX edit mode only) ----------

  // the key is edited here, on the block, beside what learners will see
  renderAuthorView(range) {
    const names = Object.keys(this._values);
    const answer = range ? this._formatAnswer(range.exact) : "";
    const variables = Array.isArray(this.variables) ? this.variables : [];
    return html`<div class="nq-author" @keydown="${this._authorKeydown}">
      <h4 class="nq-author-title">${this.t.authorViewTitle}</h4>
      <label class="nq-author-field" for="nq-key"
        >${this.t.answerOrFormula}</label
      >
      <input
        id="nq-key"
        class="nq-field nq-wide"
        type="text"
        autocomplete="off"
        spellcheck="false"
        aria-describedby="nq-key-help nq-preview"
        value="${this._keyText(this)}"
        @change="${this._keyChanged}"
      />
      <p class="nq-help" id="nq-key-help">${this.t.formulaHelp}</p>
      <p class="nq-preview" id="nq-preview" role="status">
        ${
          range
            ? names.length
              ? this._tParts(this.t.previewValues, {
                  values: names
                    .map((name) => `${name} = ${this._values[name]}`)
                    .join(", "),
                  answer: html`<strong>${answer}</strong>`,
                })
              : this._tParts(this.t.previewFixed, {
                  answer: html`<strong>${answer}</strong>`,
                })
            : this._keyText(this)
              ? this.t.keyProblem
              : this.t.notSetUp
        }
      </p>
      <h4 class="nq-author-title">${this.t.variablesHeading}</h4>
      <p class="nq-help">${this.t.tokensHelp}</p>
      ${variables.map(
        (v, i) =>
          html`<div
            class="nq-variable"
            role="group"
            aria-label="${this.t.variablesHeading} ${i + 1}"
          >
            ${["name", "min", "max", "step"].map(
              (field) =>
                html`<label
                  ><span>${this._variableLabel(field)}</span
                  ><input
                    class="nq-field"
                    type="text"
                    inputmode="${field === "name" ? "text" : "decimal"}"
                    autocomplete="off"
                    spellcheck="false"
                    data-index="${i}"
                    data-field="${field}"
                    value="${v && v[field] != null ? v[field] : ""}"
                    @change="${this._variableChanged}"
                /></label>`,
            )}
            <button
              class="nq-button"
              type="button"
              data-index="${i}"
              @click="${this._removeVariable}"
            >
              ${this.t.removeVariable}<span class="sr-only">
                ${v && v.name ? v.name : i + 1}</span
              >
            </button>
          </div>`,
      )}
      <button class="nq-button" type="button" @click="${this._addVariable}">
        ${this.t.addVariable}
      </button>
    </div>`;
  }
  _variableLabel(field) {
    return {
      name: this.t.variableName,
      min: this.t.variableMin,
      max: this.t.variableMax,
      step: this.t.variableStep,
    }[field];
  }
  // typing in these fields is not a HAX shortcut
  _authorKeydown(e) {
    e.stopPropagation();
  }
  _keyChanged(e) {
    this._setKey(e.target.value);
  }
  _variableChanged(e) {
    const index = Number(e.target.getAttribute("data-index"));
    const field = e.target.getAttribute("data-field");
    const value = String(e.target.value).trim();
    this.variables = (this.variables || []).map((v, i) => {
      if (i !== index) {
        return v;
      }
      const number = parseNumber(value);
      return {
        ...v,
        [field]: field === "name" || !Number.isFinite(number) ? value : number,
      };
    });
  }
  _addVariable() {
    const taken = (this.variables || []).map((v) => v && v.name);
    const name =
      ["a", "b", "c", "d", "x", "y", "z"].find((n) => !taken.includes(n)) ||
      `v${taken.length + 1}`;
    this.variables = [
      ...(this.variables || []),
      { name, min: 1, max: 10, step: 1 },
    ];
  }
  _removeVariable(e) {
    const index = Number(e.currentTarget.getAttribute("data-index"));
    this.variables = (this.variables || []).filter((v, i) => i !== index);
  }

  static get styles() {
    return [
      super.styles,
      css`
        .nq-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-2);
        }
        .nq-row label {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-medium);
        }
        /* the field border only ever says status, never the accent */
        :host .nq-field {
          box-sizing: border-box;
          width: 9ch;
          max-width: 100%;
          min-height: var(--ddd-control-height-sm, 32px);
          margin: var(--ddd-spacing-0);
          padding-block: var(--ddd-spacing-1);
          padding-inline: var(--ddd-spacing-2);
          border: var(--ddd-border-size-xs) solid
            light-dark(
              var(--ddd-theme-default-slateGray),
              var(--ddd-theme-default-limestoneGray)
            );
          border-radius: var(--ddd-radius-sm);
          background-color: var(--ddd-status-default-bg);
          color: var(--ddd-status-default-ink);
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-4xs);
          font-variant-numeric: tabular-nums;
        }
        :host .nq-field:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        :host .nq-field[disabled] {
          opacity: 1;
        }
        :host .nq-field[disabled]:not(.nq-correct):not(.nq-incorrect) {
          border-style: var(--ddd-status-disabled-line);
          border-color: var(--ddd-status-disabled-signal);
          background-color: var(--ddd-status-disabled-bg);
          color: var(--ddd-status-disabled-ink);
        }
        :host .nq-field.nq-correct {
          border: var(--ddd-border-size-sm) var(--ddd-status-correct-line)
            var(--ddd-status-correct-signal);
          background-color: var(--ddd-status-correct-bg);
        }
        :host .nq-field.nq-incorrect {
          border: var(--ddd-border-size-sm) var(--ddd-status-incorrect-line)
            var(--ddd-status-incorrect-signal);
          background-color: var(--ddd-status-incorrect-bg);
        }
        :host .nq-field.nq-missing {
          border: var(--ddd-border-size-sm) var(--ddd-status-missing-line)
            var(--ddd-status-missing-signal);
          background-color: var(--ddd-status-missing-bg);
        }
        .nq-unit {
          font-size: var(--ddd-font-size-4xs);
        }
        .nq-row .option-status {
          margin-inline-start: var(--ddd-spacing-0);
        }
        .nq-hint,
        .nq-help {
          font-size: var(--ddd-font-size-4xs);
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        .nq-note,
        .nq-reveal {
          display: flex;
          align-items: flex-start;
          gap: var(--ddd-spacing-2);
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-140);
          --simple-icon-width: var(--ddd-icon-4xs);
          --simple-icon-height: var(--ddd-icon-4xs);
        }
        .nq-note-on,
        .nq-reveal {
          padding-block: var(--ddd-spacing-1);
          padding-inline: var(--ddd-spacing-2);
          border-radius: var(--ddd-radius-sm);
        }
        .nq-note-on {
          border: var(--ddd-border-size-xs) var(--ddd-status-missing-line)
            var(--ddd-status-missing-signal);
          background-color: var(--ddd-status-missing-bg);
          color: var(--ddd-status-missing-ink);
        }
        .nq-reveal {
          border: var(--ddd-border-size-xs) var(--ddd-status-revealed-line)
            var(--ddd-status-revealed-signal);
          background-color: var(--ddd-status-revealed-bg);
          color: var(--ddd-status-revealed-ink);
        }
        .nq-note simple-icon-lite,
        .nq-reveal simple-icon-lite {
          flex: none;
          margin-block-start: var(--ddd-spacing-1);
        }
        /* the base class turns list bullets off; directions keep theirs,
           in the palette marker role */
        ul.nq-directions {
          margin: var(--ddd-spacing-0);
          padding-inline-start: var(--ddd-spacing-5);
          list-style: disc;
        }
        .nq-directions li::marker {
          color: var(
            --ddd-palette-marker,
            light-dark(
              var(--ddd-theme-default-nittanyNavy),
              var(--ddd-theme-default-linkLight)
            )
          );
        }
        /* ---------- author view ---------- */
        .nq-author {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-2);
          margin-block-start: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-3);
          border: var(--ddd-border-size-xs) dashed
            light-dark(
              var(--ddd-theme-default-slateGray),
              var(--ddd-theme-default-limestoneGray)
            );
          border-radius: var(--ddd-radius-sm);
          font-size: var(--ddd-font-size-4xs);
        }
        :host .nq-author h4.nq-author-title {
          margin: var(--ddd-spacing-0);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          color: var(--ddd-status-default-ink);
        }
        .nq-author-field,
        .nq-variable label span {
          font-family: var(--ddd-font-navigation);
          font-weight: var(--ddd-font-weight-medium);
        }
        :host .nq-field.nq-wide {
          width: 100%;
        }
        .nq-variable {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-end;
          gap: var(--ddd-spacing-2);
        }
        .nq-variable label {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-1);
        }
        :host .nq-button {
          align-self: flex-start;
          min-height: var(--ddd-control-height-sm, 32px);
          padding-block: var(--ddd-spacing-0);
          padding-inline: var(--ddd-spacing-3);
          border: var(--ddd-border-size-xs) solid
            light-dark(
              var(--ddd-theme-default-slateGray),
              var(--ddd-theme-default-limestoneGray)
            );
          border-radius: var(--ddd-radius-sm);
          background-color: var(--ddd-status-default-bg);
          color: var(--ddd-status-default-ink);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          cursor: pointer;
        }
        :host .nq-button:hover {
          border-color: var(
            --ddd-palette-accent,
            light-dark(
              var(--ddd-theme-default-nittanyNavy),
              var(--ddd-theme-default-linkLight)
            )
          );
        }
        :host .nq-button:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
      `,
    ];
  }
}

globalThis.customElements.define(NumericQuestion.tag, NumericQuestion);
