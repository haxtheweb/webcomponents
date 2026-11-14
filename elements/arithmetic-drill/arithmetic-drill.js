/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import {
  DDDBlockStyles,
  renderDDDBlockHeader,
  celebrateDDDCompletion,
} from "@haxtheweb/d-d-d/lib/DDDBlock.js";
import { DDDStatusTokens } from "@haxtheweb/d-d-d/lib/DDDStatusTokens.js";
import { DDDAccentStyles } from "@haxtheweb/d-d-d/lib/DDDAccent.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import {
  activityId,
  buildStatement,
  xapiDuration,
  XAPI_ACTIVITY_TYPES,
  XAPI_EXTENSIONS,
} from "@haxtheweb/user-action/lib/xapi.js";
import {
  OPERATION_SIGNS,
  makeProblems,
  normalizeSettings,
  parseAnswer,
} from "./lib/arithmetic-drill-problems.js";

/**
 * `arithmetic-drill`
 * A short run of generated arithmetic problems with instant feedback: a
 * start screen, one problem at a time, then the score. Practice, not a
 * test: nothing is authored but the settings, and every run is new.
 *
 * - Subtraction never goes below zero; division always has a whole number
 *   answer and never divides by zero (lib/arithmetic-drill-problems.js).
 * - The timer is off unless an author sets `time-limit`, and the learner
 *   can always turn it off for themselves.
 * - Learner record (xAPI through `user-engagement`): attempted on Start,
 *   progressed after each answer, completed once per run with the score.
 *   Nothing is sent while HAX is editing.
 *
 * @fires user-engagement - bubbles, composed. detail: { activityDisplay
 *   ("attempted", "progressed" or "completed"), objectName,
 *   resultCompletion, resultScore (completed only, 0 to 1), statement }
 * @fires learner-progress-request - on window when the visitor view loads.
 *   detail: { activityId, tag, record } where a listener sets record
 * @demo demo/index.html
 * @element arithmetic-drill
 */
export class ArithmeticDrill extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "arithmetic-drill";
  }

  constructor() {
    super();
    this.title = "";
    this.operations = "add subtract multiply";
    this.min = 2;
    this.max = 12;
    this.count = 10;
    this.timeLimit = 0;
    this._phase = "start";
    this._ops = [];
    this._problems = [];
    this._index = 0;
    this._answered = 0;
    this._right = 0;
    this._feedback = null;
    this._timerOn = true;
    this._remaining = 0;
    this._timeUp = false;
    this._announcement = "";
    this._directionsOpen = false;
    this._done = false;
    this._doneBefore = false;
    this._haxstate = false;
    this.t = this.t || {};
    this.t = {
      ...this.t,
      label: "Game · Arithmetic",
      arithmeticDrill: "Arithmetic drill",
      directions: "Directions",
      showDirections: "Show directions",
      hideDirections: "Hide directions",
      directionsStart: "Choose the operations, then start.",
      directionsAnswer: "Type each answer and press Enter.",
      directionsTimer:
        "If there is a timer, you can turn it off and take the time you need.",
      summary: "{count} problems with numbers from {min} to {max}.",
      operationsLabel: "Operations",
      add: "Addition",
      subtract: "Subtraction",
      multiply: "Multiplication",
      divide: "Division",
      plus: "plus",
      minus: "minus",
      times: "times",
      dividedBy: "divided by",
      useTimer: "Use the timer ({seconds} seconds for the whole run)",
      start: "Start {count} problems",
      problemOf: "Problem {n} of {count}",
      enter: "Enter",
      correct: "Correct",
      incorrect: "Incorrect",
      isAnswer: "{problem} is {answer}.",
      typeNumber: "Type a whole number to answer.",
      timeLeft: "Time left: {time}",
      timerStarted: "Timer started: {seconds} seconds.",
      secondsLeft: "{seconds} seconds left.",
      turnOffTimer: "Turn off timer",
      timerOff: "Timer off. Take the time you need.",
      timeUp: "Time is up.",
      answeredOf: "You answered {answered} of {count}.",
      rightOf: "{right} of {count}",
      rightWord: "right.",
      perfect: "Perfect run.",
      goAgain: "Go again",
      finished: "Finished",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("./locales/", import.meta.url).href,
    });
  }

  static get properties() {
    return {
      ...super.properties,
      /** Name of this drill, shown in the header */
      title: { type: String },
      /**
       * Operations asked, space separated: any of add, subtract, multiply,
       * divide
       */
      operations: { type: String },
      /** Smallest operand (a whole number, 0 or more) */
      min: { type: Number },
      /** Largest operand */
      max: { type: Number },
      /** Number of problems in a run */
      count: { type: Number },
      /**
       * Seconds allowed for a whole run. 0 means no timer. Learners can
       * always turn the timer off for themselves.
       */
      timeLimit: { type: Number, attribute: "time-limit" },
      /** Accent for the chip and buttons (a SimpleColors name) */
      accentColor: { type: String, attribute: "accent-color", reflect: true },
      _phase: { state: true },
      _ops: { state: true },
      _index: { state: true },
      _feedback: { state: true },
      _timerOn: { state: true },
      _remaining: { state: true },
      _announcement: { state: true },
      _directionsOpen: { state: true },
      _done: { state: true },
      _doneBefore: { state: true },
    };
  }

  static get styles() {
    return [
      super.styles,
      DDDStatusTokens,
      DDDBlockStyles,
      DDDAccentStyles,
      css`
        :host {
          display: block;
          margin: var(--ddd-stack-gap, var(--ddd-spacing-4)) 0;
          /* accent priority, last match wins: DDD default, theme palette
             (data-palette), accent-color on the element */
          --ddd-component-arithmetic-drill-accent: var(
            --ddd-accent-color,
            var(
              --ddd-palette-accent,
              light-dark(
                var(--ddd-theme-default-nittanyNavy),
                var(--ddd-theme-default-linkLight)
              )
            )
          );
          --ddd-component-arithmetic-drill-accent-ink: var(
            --ddd-accent-color-ink,
            var(
              --ddd-palette-accent-ink,
              light-dark(
                var(--ddd-theme-default-white),
                var(--ddd-theme-default-potentialMidnight)
              )
            )
          );
        }
        :host([hidden]),
        [hidden] {
          display: none !important;
        }
        .ddd-block {
          color: var(--ddd-status-default-ink);
        }
        :host([accent-color]) .ddd-block {
          --ddd-block-chip-background: var(--ddd-accent-color);
          --ddd-block-chip-color: var(--ddd-accent-color-ink);
        }
        .directions {
          padding-block: var(--ddd-spacing-3);
          padding-inline: var(--ddd-surface-padding, var(--ddd-spacing-4));
          border-bottom: var(--ddd-border-xs);
          border-color: var(--ddd-status-default-signal);
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-150);
        }
        .directions ul {
          margin: var(--ddd-spacing-0);
          padding-inline-start: var(--ddd-spacing-5);
        }
        .directions li {
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-150);
        }
        .directions li::marker {
          color: var(--ddd-palette-marker, currentColor);
        }
        .body {
          padding: var(--ddd-surface-padding, var(--ddd-spacing-4));
        }
        .body p {
          margin: var(--ddd-spacing-0) var(--ddd-spacing-0) var(--ddd-spacing-3);
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-150);
        }
        .ops {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-2);
          margin: var(--ddd-spacing-0) var(--ddd-spacing-0) var(--ddd-spacing-3);
          font-size: var(--ddd-font-size-4xs);
        }
        .ops-label {
          font-weight: var(--ddd-font-weight-bold);
        }
        .btn,
        .op {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--ddd-spacing-2);
          box-sizing: border-box;
          min-height: var(--ddd-control-height-sm);
          margin: var(--ddd-spacing-0);
          padding-block: var(--ddd-spacing-0);
          padding-inline: var(--ddd-spacing-4);
          border: var(--ddd-border-xs);
          border-color: var(--ddd-component-arithmetic-drill-accent);
          border-radius: var(--ddd-radius-xs);
          background-color: var(--ddd-component-arithmetic-drill-accent);
          color: var(--ddd-component-arithmetic-drill-accent-ink);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-medium);
          cursor: pointer;
          --simple-icon-color: currentColor;
          --simple-icon-width: var(--ddd-icon-3xs);
          --simple-icon-height: var(--ddd-icon-3xs);
        }
        /* an operation that is off: outline only, no check mark */
        .op[aria-pressed="false"],
        .btn.quiet {
          border-color: var(--ddd-status-answered-signal);
          background-color: var(--ddd-block-background, transparent);
          color: var(--ddd-status-answered-ink);
        }
        .op[aria-pressed="false"] {
          border-style: dashed;
        }
        .op .sign {
          font-size: var(--ddd-font-size-3xs);
          font-weight: var(--ddd-font-weight-bold);
        }
        .btn:focus-visible,
        .op:focus-visible,
        input:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        .timer-choice {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          min-height: var(--ddd-spacing-6);
          font-size: var(--ddd-font-size-4xs);
        }
        .timer-choice input {
          flex: none;
          width: var(--ddd-spacing-6);
          height: var(--ddd-spacing-6);
          margin: var(--ddd-spacing-0);
          accent-color: var(--ddd-component-arithmetic-drill-accent);
        }
        .meta {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: var(--ddd-spacing-2) var(--ddd-spacing-4);
          margin: var(--ddd-spacing-0) var(--ddd-spacing-0) var(--ddd-spacing-3);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
        }
        .meta p {
          margin: var(--ddd-spacing-0);
        }
        form {
          margin: var(--ddd-spacing-0);
        }
        .problem {
          display: block;
          margin: var(--ddd-spacing-0) var(--ddd-spacing-0) var(--ddd-spacing-3);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-m);
          font-weight: var(--ddd-font-weight-bold);
          line-height: var(--ddd-lh-120);
          overflow-wrap: anywhere;
        }
        .answer-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-2);
        }
        input.answer {
          box-sizing: border-box;
          width: 10ch;
          max-width: 100%;
          min-height: var(--ddd-control-height-sm);
          margin: var(--ddd-spacing-0);
          padding-block: var(--ddd-spacing-0);
          padding-inline: var(--ddd-spacing-3);
          border: var(--ddd-border-sm);
          border-color: var(--ddd-status-answered-signal);
          border-radius: var(--ddd-radius-xs);
          background-color: var(--ddd-status-default-bg);
          color: var(--ddd-status-default-ink);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-3xs);
        }
        .hint {
          margin: var(--ddd-spacing-2) var(--ddd-spacing-0) var(--ddd-spacing-0);
        }
        .body .score {
          width: fit-content;
          font-size: var(--ddd-font-size-xs);
        }
        .score:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        .action-bar {
          justify-content: flex-end;
          background-color: var(--ddd-status-answered-bg);
        }
        .status {
          flex: 1 1 auto;
          min-width: 0;
        }
        /* answer status: colour, line style, icon and the word together */
        .res {
          display: inline-flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-1) var(--ddd-spacing-2);
          padding-block: var(--ddd-spacing-1);
          padding-inline: var(--ddd-spacing-2);
          --simple-icon-color: currentColor;
          --simple-icon-width: var(--ddd-icon-3xs);
          --simple-icon-height: var(--ddd-icon-3xs);
        }
        .res-correct {
          border: var(--ddd-border-size-sm) var(--ddd-status-correct-line)
            var(--ddd-status-correct-signal);
          background-color: var(--ddd-status-correct-bg);
          color: var(--ddd-status-correct-ink);
        }
        .res-incorrect {
          border: var(--ddd-border-size-sm) var(--ddd-status-incorrect-line)
            var(--ddd-status-incorrect-signal);
          background-color: var(--ddd-status-incorrect-bg);
          color: var(--ddd-status-incorrect-ink);
        }
        .res .math {
          color: var(--ddd-status-default-ink);
        }
      `,
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    // the resource the author saved, read before anything can write one
    if (typeof this._xapiAuthoredResource !== "string") {
      this._xapiAuthoredResource = this.getAttribute("resource") || "";
    }
    if (!this._progressListeners) {
      this._progressListeners = new AbortController();
      const opts = { signal: this._progressListeners.signal };
      globalThis.addEventListener(
        "learner-progress-ready",
        () => this._requestLearnerProgress(),
        opts,
      );
      globalThis.addEventListener(
        "learner-progress-cleared",
        () => {
          this._doneBefore = false;
        },
        opts,
      );
    }
    Promise.resolve().then(() => this._requestLearnerProgress());
  }

  disconnectedCallback() {
    this._stopTimer();
    if (this._progressListeners) {
      this._progressListeners.abort();
      this._progressListeners = null;
    }
    const chip =
      this.shadowRoot && this.shadowRoot.querySelector(".ddd-block-chip");
    if (chip && chip.__dddCelebrate) {
      clearTimeout(chip.__dddCelebrate);
    }
    super.disconnectedCallback();
  }

  willUpdate(changedProperties) {
    if (super.willUpdate) {
      super.willUpdate(changedProperties);
    }
    // the learner starts with every operation the author allows
    if (changedProperties.has("operations")) {
      this._ops = this._settings().operations;
    }
  }

  // the authored settings, made safe
  _settings() {
    return normalizeSettings({
      operations: this.operations,
      min: this.min,
      max: this.max,
      count: this.count,
      timeLimit: this.timeLimit,
    });
  }

  // "{key}" placeholders in a translated string
  _fill(text, values) {
    let out = String(text == null ? "" : text);
    Object.keys(values).forEach((key) => {
      out = out.split(`{${key}}`).join(String(values[key]));
    });
    return out;
  }

  _problemText(p) {
    return `${p.a} ${OPERATION_SIGNS[p.operation]} ${p.b}`;
  }

  _problemSpoken(p) {
    const words = {
      add: this.t.plus,
      subtract: this.t.minus,
      multiply: this.t.times,
      divide: this.t.dividedBy,
    };
    return `${p.a} ${words[p.operation]} ${p.b}`;
  }

  _clock(seconds) {
    const s = Math.max(0, seconds);
    const rest = String(s % 60).padStart(2, "0");
    return `${Math.floor(s / 60)}:${rest}`;
  }

  _editing() {
    if (this._haxstate) {
      return true;
    }
    const store =
      globalThis.HaxStore &&
      typeof globalThis.HaxStore.requestAvailability === "function"
        ? globalThis.HaxStore.requestAvailability()
        : null;
    return Boolean(store && store.editMode);
  }

  _say(text) {
    this._announcement = text;
  }

  _toggleDirections() {
    this._directionsOpen = !this._directionsOpen;
  }

  _toggleOperation(e) {
    const op = e.currentTarget.getAttribute("data-op");
    const on = this._ops.includes(op);
    // at least one operation stays on
    if (on && this._ops.length < 2) {
      return;
    }
    this._ops = this._settings().operations.filter((o) =>
      o === op ? !on : this._ops.includes(o),
    );
  }

  _toggleTimerChoice(e) {
    this._timerOn = e.currentTarget.checked;
  }

  /**
   * Begin a run: make the problems, show the first one. Does nothing while
   * HAX is editing.
   */
  async start() {
    if (this._editing()) {
      return;
    }
    const s = this._settings();
    this._problems = makeProblems({
      operations: this._ops.length ? this._ops : s.operations,
      min: s.min,
      max: s.max,
      count: s.count,
    });
    this._index = 0;
    this._answered = 0;
    this._right = 0;
    this._feedback = null;
    this._timeUp = false;
    this._runCompleted = false;
    this._startedAt = Date.now();
    this._phase = "run";
    const timed = s.timeLimit > 0 && this._timerOn;
    if (timed) {
      this._startTimer(s.timeLimit);
    }
    const first = `${this._fill(this.t.problemOf, {
      n: 1,
      count: s.count,
    })}: ${this._problemSpoken(this._problems[0])}`;
    this._say(
      timed
        ? `${this._fill(this.t.timerStarted, { seconds: s.timeLimit })} ${first}`
        : first,
    );
    this._send("attempted");
    await this.updateComplete;
    this._focus("#answer");
  }

  _focus(selector) {
    const target = this.shadowRoot && this.shadowRoot.querySelector(selector);
    if (target) {
      target.focus();
    }
  }

  _startTimer(seconds) {
    this._stopTimer();
    this._limit = seconds;
    this._deadline = Date.now() + seconds * 1000;
    this._remaining = seconds;
    this._saidHalf = false;
    this._saidTen = false;
    this._timerId = setInterval(() => this._tick(), 250);
  }

  _stopTimer() {
    if (this._timerId) {
      clearInterval(this._timerId);
      this._timerId = null;
    }
  }

  _tick() {
    const left = Math.max(0, Math.ceil((this._deadline - Date.now()) / 1000));
    if (left === this._remaining) {
      return;
    }
    this._remaining = left;
    if (left <= 0) {
      this._finish(true);
      return;
    }
    // spoken three times in a run, never every second
    const half = Math.floor(this._limit / 2);
    if (!this._saidTen && left <= 10 && this._limit > 10) {
      this._saidTen = true;
      this._saidHalf = true;
      this._say(this._fill(this.t.secondsLeft, { seconds: left }));
    } else if (!this._saidHalf && left <= half) {
      this._saidHalf = true;
      this._say(this._fill(this.t.secondsLeft, { seconds: left }));
    }
  }

  /**
   * The learner turns the timer off for the rest of the run.
   */
  async turnOffTimer() {
    this._stopTimer();
    this._timerOn = false;
    this._say(this.t.timerOff);
    await this.updateComplete;
    this._focus("#answer");
  }

  _submit(e) {
    e.preventDefault();
    if (this._phase !== "run") {
      return;
    }
    const input = this.shadowRoot.querySelector("#answer");
    const value = parseAnswer(input.value);
    if (value === null) {
      this._feedback = { hint: true };
      this._say(this.t.typeNumber);
      input.focus();
      return;
    }
    const s = this._settings();
    const problem = this._problems[this._index];
    const ok = value === problem.answer;
    this._answered += 1;
    if (ok) {
      this._right += 1;
    }
    this._feedback = { ok, problem };
    input.value = "";
    this._send("progressed");
    if (this._answered >= this._problems.length) {
      this._finish(false);
      return;
    }
    this._index += 1;
    this._say(
      `${this._feedbackSpoken()} ${this._fill(this.t.problemOf, {
        n: this._index + 1,
        count: s.count,
      })}: ${this._problemSpoken(this._problems[this._index])}`,
    );
    input.focus();
  }

  _feedbackSpoken() {
    const f = this._feedback;
    if (!f || !f.problem) {
      return "";
    }
    return `${f.ok ? this.t.correct : this.t.incorrect}. ${this._fill(
      this.t.isAnswer,
      {
        problem: this._problemSpoken(f.problem),
        answer: f.problem.answer,
      },
    )}`;
  }

  async _finish(timeUp) {
    if (this._phase !== "run") {
      return;
    }
    this._stopTimer();
    this._timeUp = Boolean(timeUp);
    this._phase = "done";
    const total = this._problems.length;
    const parts = [];
    if (timeUp) {
      parts.push(this.t.timeUp);
      parts.push(
        this._fill(this.t.answeredOf, {
          answered: this._answered,
          count: total,
        }),
      );
    } else {
      parts.push(this._feedbackSpoken());
    }
    parts.push(
      `${this._fill(this.t.rightOf, { right: this._right, count: total })} ${
        this.t.rightWord
      }`,
    );
    if (this._right === total) {
      parts.push(this.t.perfect);
    }
    this._say(parts.filter((p) => p).join(" "));
    const first = !this._done && !this._doneBefore;
    if (!this._editing()) {
      this._done = true;
    }
    if (!this._runCompleted) {
      this._runCompleted = true;
      this._send("completed");
    }
    await this.updateComplete;
    this._focus(".score");
    if (first && this._done) {
      celebrateDDDCompletion(this.shadowRoot.querySelector(".ddd-block-chip"));
    }
  }

  _resetState() {
    this._stopTimer();
    this._phase = "start";
    this._feedback = null;
    this._timeUp = false;
    this._timerOn = true;
    this._problems = [];
    this._index = 0;
    this._answered = 0;
    this._right = 0;
    this._say("");
  }

  /**
   * Back to the start screen for another run.
   */
  async reset() {
    this._resetState();
    await this.updateComplete;
    this._focus("#start");
  }

  /**
   * xAPI statements this element sends (see
   * scripts/generate-xapi-vocabulary.mjs)
   */
  static get xapiVocabulary() {
    return {
      tag: "arithmetic-drill",
      event: "user-engagement",
      verbs: ["attempted", "progressed", "completed"],
      objectType: "http://adlnet.gov/expapi/activities/simulation",
      result: [
        "completion",
        "score",
        "duration",
        "extensions.https://haxtheweb.org/xapi/extensions/progress",
      ],
      countsTowardCompletion: true,
      done: "a run finished: every problem answered, or the timer ran out",
    };
  }

  // what identifies this drill when it has no id
  xapiFingerprint() {
    const s = this._settings();
    return [
      this.title || "",
      s.operations.join(" "),
      `${s.min}-${s.max}`,
      s.count,
    ].join("\u0001");
  }

  // learner data: never while HAX is editing
  _send(verb) {
    if (this._editing()) {
      return;
    }
    const total = this._problems.length;
    const name = (this.title || this.t.arithmeticDrill).slice(0, 120);
    const result = { completion: verb === "completed" };
    const detail = {
      activityDisplay: verb,
      objectName: name,
      resultCompletion: result.completion,
    };
    if (verb === "progressed") {
      result.extensions = {
        [XAPI_EXTENSIONS.progress]:
          total > 0 ? Math.round((this._answered / total) * 10000) / 10000 : 0,
      };
    } else if (verb === "completed") {
      result.score = { raw: this._right, min: 0, max: total };
      result.duration = xapiDuration(Date.now() - this._startedAt);
      detail.resultScore = total > 0 ? this._right / total : 0;
    }
    detail.statement = buildStatement({
      verb,
      object: {
        id: activityId(this, this.xapiFingerprint()),
        name,
        type: XAPI_ACTIVITY_TYPES.simulation,
      },
      result,
      context: {
        extensions: { [XAPI_EXTENSIONS.element]: ArithmeticDrill.tag },
      },
    });
    this.dispatchEvent(
      new CustomEvent("user-engagement", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail,
      }),
    );
  }

  // ask a learner progress listener whether a run was finished before, so
  // the chip shows it; with nothing listening only this visit counts
  _requestLearnerProgress() {
    if (!this.isConnected || this._editing()) {
      return;
    }
    const detail = {
      activityId: activityId(this, this.xapiFingerprint()),
      tag: ArithmeticDrill.tag,
      record: null,
    };
    globalThis.dispatchEvent(
      new CustomEvent("learner-progress-request", { detail }),
    );
    const record =
      detail.record && typeof detail.record === "object" ? detail.record : null;
    this._doneBefore = Boolean(record && record.done);
  }

  /**
   * Implements haxHooks to tie into life-cycle if hax exists.
   */
  haxHooks() {
    return {
      editModeChanged: "haxeditModeChanged",
    };
  }

  /**
   * While authoring there is no run, no timer and no learner state.
   */
  haxeditModeChanged(val) {
    this._haxstate = Boolean(val);
    if (this._haxstate) {
      this._done = false;
      this._doneBefore = false;
      this._resetState();
    } else {
      this._requestLearnerProgress();
    }
  }

  render() {
    const done = this._done || this._doneBefore;
    return html`
      <div class="ddd-block" role="group" aria-labelledby="header">
        ${renderDDDBlockHeader({
          id: "header",
          icon: "image:exposure",
          label: this.t.label,
          title: this.title,
          done,
          doneLabel: this.t.finished,
          actions: html`<button
            type="button"
            class="ddd-block-action"
            id="directions-toggle"
            aria-controls="directions"
            aria-expanded="${this._directionsOpen ? "true" : "false"}"
            aria-label="${
              this._directionsOpen
                ? this.t.hideDirections
                : this.t.showDirections
            }"
            title="${this.t.directions}"
            @click="${this._toggleDirections}"
          >
            <simple-icon-lite
              icon="icons:info-outline"
              aria-hidden="true"
            ></simple-icon-lite>
          </button>`,
        })}
        <div
          id="directions"
          class="directions"
          ?hidden="${!this._directionsOpen}"
        >
          <span class="sr-only">${this.t.directions}: </span>
          <ul>
            <li>${this.t.directionsStart}</li>
            <li>${this.t.directionsAnswer}</li>
            <li>${this.t.directionsTimer}</li>
          </ul>
        </div>
        <div class="ddd-block-body body">${this._renderBody()}</div>
        <div class="ddd-block-footer action-bar">
          <div class="status" id="status">${this._renderFeedback()}</div>
          ${this._renderActions()}
        </div>
        <div class="sr-only" id="live" role="status" aria-live="polite">
          ${this._announcement}
        </div>
      </div>
    `;
  }

  _renderBody() {
    if (this._phase === "run") {
      return this._renderRun();
    }
    if (this._phase === "done") {
      return this._renderDone();
    }
    return this._renderStart();
  }

  _renderStart() {
    const s = this._settings();
    return html`
      <p class="summary">
        ${this._fill(this.t.summary, {
          count: s.count,
          min: s.min,
          max: s.max,
        })}
      </p>
      <div class="ops" role="group" aria-labelledby="ops-label">
        <span class="ops-label" id="ops-label">${this.t.operationsLabel}</span>
        ${s.operations.map((op) => {
          const on = this._ops.includes(op);
          return html`<button
            type="button"
            class="op"
            data-op="${op}"
            aria-pressed="${on ? "true" : "false"}"
            @click="${this._toggleOperation}"
          >
            ${
              on
                ? html`<simple-icon-lite
                    icon="icons:check"
                    aria-hidden="true"
                  ></simple-icon-lite>`
                : nothing
            }<span class="sign" aria-hidden="true">${OPERATION_SIGNS[op]}</span>
            ${this.t[op]}
          </button>`;
        })}
      </div>
      ${
        s.timeLimit > 0
          ? html`<label class="timer-choice"
              ><input
                type="checkbox"
                id="use-timer"
                ?checked="${this._timerOn}"
                @change="${this._toggleTimerChoice}"
              />${this._fill(this.t.useTimer, { seconds: s.timeLimit })}</label
            >`
          : nothing
      }
    `;
  }

  _renderRun() {
    const s = this._settings();
    const problem = this._problems[this._index];
    const timed = s.timeLimit > 0 && this._timerOn;
    return html`
      <div class="meta">
        <p id="progress">
          ${this._fill(this.t.problemOf, {
            n: this._index + 1,
            count: this._problems.length,
          })}
        </p>
        ${
          timed
            ? html`<p id="timer">
                ${this._fill(this.t.timeLeft, {
                  time: this._clock(this._remaining),
                })}
              </p>`
            : nothing
        }
      </div>
      <form novalidate @submit="${this._submit}">
        <label class="problem" for="answer"
          ><span aria-hidden="true">${this._problemText(problem)} = ?</span
          ><span class="sr-only">${this._problemSpoken(problem)}</span></label
        >
        <div class="answer-row">
          <input
            class="answer"
            id="answer"
            type="text"
            inputmode="numeric"
            autocomplete="off"
            enterkeyhint="enter"
          />
          <button type="submit" class="btn" id="enter">${this.t.enter}</button>
        </div>
        ${
          this._feedback && this._feedback.hint
            ? html`<p class="hint" id="hint">${this.t.typeNumber}</p>`
            : nothing
        }
      </form>
    `;
  }

  _renderDone() {
    const total = this._problems.length;
    return html`
      <p class="score" id="score" tabindex="-1">
        <strong
          >${this._fill(this.t.rightOf, {
            right: this._right,
            count: total,
          })}</strong
        >
        ${this.t.rightWord}
        ${this._right === total && total > 0 ? this.t.perfect : nothing}
      </p>
      ${
        this._timeUp
          ? html`<p id="time-up">
              ${this.t.timeUp}
              ${this._fill(this.t.answeredOf, {
                answered: this._answered,
                count: total,
              })}
            </p>`
          : nothing
      }
    `;
  }

  // the answer just given: colour, line style, icon and word, plus the sum
  _renderFeedback() {
    const f = this._feedback;
    if (!f || !f.problem || this._phase === "start") {
      return nothing;
    }
    return html`<span
      class="res ${f.ok ? "res-correct" : "res-incorrect"}"
      id="feedback"
      ><simple-icon-lite
        icon="${f.ok ? "icons:check" : "icons:close"}"
        aria-hidden="true"
      ></simple-icon-lite
      ><strong>${f.ok ? this.t.correct : this.t.incorrect}</strong
      ><span class="math"
        >${this._problemText(f.problem)} = ${f.problem.answer}</span
      ></span
    >`;
  }

  _renderActions() {
    if (this._phase === "run") {
      const timed = this._settings().timeLimit > 0 && this._timerOn;
      return timed
        ? html`<button
            type="button"
            class="btn quiet"
            id="timer-off"
            @click="${this.turnOffTimer}"
          >
            <simple-icon-lite
              icon="image:timer-off"
              aria-hidden="true"
            ></simple-icon-lite
            >${this.t.turnOffTimer}
          </button>`
        : nothing;
    }
    if (this._phase === "done") {
      return html`<button
        type="button"
        class="btn quiet"
        id="again"
        @click="${this.reset}"
      >
        ${this.t.goAgain}
      </button>`;
    }
    return html`<button
      type="button"
      class="btn"
      id="start"
      @click="${this.start}"
    >
      ${this._fill(this.t.start, { count: this._settings().count })}
    </button>`;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(ArithmeticDrill.tag, ArithmeticDrill);
