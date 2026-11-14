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
import {
  activityId,
  buildStatement,
  interactionComponents,
  XAPI_EXTENSIONS,
  XAPI_ITEM_DELIMITER,
} from "@haxtheweb/user-action/lib/xapi.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";

// when results may be shown to the learner
const SHOW_RESULTS = ["after", "closed", "never"];
// longest delay a timer accepts
const MAX_TIMEOUT = 2147483647;

/**
 * `quick-poll`
 * `A question with no right answer where the point is seeing how everyone answered.`
 *
 * Nothing is judged (unlike multiple-choice) and no answer is revealed
 * (unlike self-check). The learner picks one option and votes; results are
 * an aggregate across learners, so they come from the host: either the
 * `results` property (an object of option id to count) or an `endpoint`
 * that answers `{ counts: { <optionId>: <number> } }`. With neither, the
 * poll still works and shows the learner their own vote only.
 *
 * The poll is anonymous: it never sends a name or any identity, only the
 * activity id and the id of the option chosen.
 *
 * Options are light DOM `<input>` children, the shape question elements
 * read, and are left in place:
 * ```html
 * <quick-poll question="When a layout breaks, what do you do first?">
 *   <input value="Open DevTools" />
 *   <input value="Rewrite the CSS" />
 * </quick-poll>
 * ```
 *
 * @fires quick-poll-vote - bubbling, composed; detail { activityId, choice,
 *   label, previous }: the vote just cast, for a host that collects votes
 *   its own way. previous is the option id being replaced when a vote is
 *   changed, otherwise an empty string.
 * @fires user-engagement - bubbling, composed; detail carries the xAPI
 *   statement (verb answered, choice interaction, no success).
 * @fires learner-progress-request - on window when the visitor view loads,
 *   to restore the learner's vote.
 * @demo demo/index.html
 * @element quick-poll
 */
export class QuickPoll extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "quick-poll";
  }

  constructor() {
    super();
    this.typeof = "oer:Activity";
    this.question = "";
    this.options = [];
    this.showResults = "after";
    this.closes = "";
    this.allowChange = false;
    this.endpoint = "";
    this._results = null;
    // bumped whenever results is set or a request starts, so a response
    // that arrives after something newer is dropped
    this._resultsSeq = 0;
    this._components = [];
    this._choice = "";
    this._voted = "";
    this._changing = false;
    this._status = "";
    this._closed = false;
    this._closesLabel = "";
    this._resultsUnavailable = false;
    this._directionsOpen = false;
    this._restored = false;
    this._celebrated = false;
    this._haxstate = false;
    this._lightLoaded = false;
    this._observer = null;
    this._listeners = null;
    this._loads = new Set();
    this._closeTimer = null;
    this.t = this.t || {};
    this.t = {
      ...this.t,
      poll: "Poll",
      anonymous: "anonymous",
      directions: "Directions",
      showDirections: "Show directions",
      hideDirections: "Hide directions",
      pickOne: "Pick one. There's no right answer.",
      resultsAfterVoting: "Results show after you vote.",
      resultsAfterClosing: "Results show after the poll closes.",
      resultsFromInstructor: "Your instructor will share the results.",
      vote: "Vote",
      changeVote: "Change vote",
      keepVote: "Keep my vote",
      needsInput: "Needs input",
      pickFirst: "Pick an option first.",
      voted: "Voted",
      thanks: "Thanks, your vote counted.",
      voteIsIn: "Your vote is in: {option}.",
      yourVote: "your vote",
      votes: "votes",
      oneResponse: "1 response",
      responses: "{count} responses",
      resultsUnavailable: "Results are unavailable right now.",
      resultsWhenClosed: "Results open when the poll closes.",
      resultsWhenClosedOn: "Results open when the poll closes on {date}.",
      closed: "This poll is closed.",
      noOptions: "Add at least two options to this poll.",
      votingOffWhileEditing: "Voting is off while editing.",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("./locales/", import.meta.url).href,
    });
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * OER Schema type. Reflected so it is also in server rendered HTML.
       */
      typeof: { type: String, reflect: true },
      /**
       * The question, shown as the title of the block.
       */
      question: { type: String },
      /**
       * The options, [{ label }]. Read from and written to the light DOM
       * `<input value="...">` children.
       */
      options: { type: Array },
      /**
       * When the learner sees results: "after" (after voting), "closed"
       * (after the closes date-time passes) or "never" (instructor only).
       */
      showResults: { type: String, attribute: "show-results", reflect: true },
      /**
       * Date-time the poll closes (anything Date.parse reads, e.g.
       * 2026-12-01T17:00). Voting stops then.
       */
      closes: { type: String },
      /**
       * Let the learner change their vote in the same visit.
       */
      allowChange: { type: Boolean, attribute: "allow-change", reflect: true },
      /**
       * Optional http(s) address that counts votes. POST { activityId,
       * choice } on vote, GET ?activityId=... on load; both answer
       * { counts: { <optionId>: <number> } }.
       */
      endpoint: { type: String },
      /**
       * Counts set by a host or plugin: an object of option id to number.
       */
      results: { attribute: false, noAccessor: true },
      /**
       * Optional accent for the chip, markers and Vote button, using the
       * accent-color names DDD maps (see DDDAccent.js).
       */
      accentColor: { type: String, attribute: "accent-color", reflect: true },
      _choice: { state: true },
      _voted: { state: true },
      _changing: { state: true },
      _status: { state: true },
      _closed: { state: true },
      _closesLabel: { state: true },
      _resultsUnavailable: { state: true },
      _directionsOpen: { state: true },
      _haxstate: { state: true },
    };
  }

  get results() {
    return this._results;
  }

  set results(value) {
    const old = this._results;
    this._results = value;
    this._resultsSeq++;
    this.requestUpdate("results", old);
  }

  /**
   * The options with their stable ids: [{ id, label }]. A host uses the ids
   * as the keys of `results`.
   */
  get choices() {
    return this._components.map((c) => ({ id: c.id, label: c.description }));
  }

  /**
   * Id of the option the learner voted for, "" until they vote.
   */
  get vote() {
    return this._voted;
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
          font-family: var(--ddd-font-primary);
          line-height: var(--ddd-lh-150);
          color: var(--ddd-status-default-ink);
          /* accent roles, decoration only: accent-color on the element,
             then the palette role, then the DDD default */
          --ddd-component-quick-poll-marker: var(
            --ddd-accent-color,
            var(--ddd-palette-marker, var(--ddd-theme-default-skyBlue))
          );
          --ddd-component-quick-poll-chosen: var(
            --ddd-accent-color,
            var(--ddd-palette-marker, var(--ddd-status-answered-signal))
          );
          --ddd-component-quick-poll-tint: var(
            --ddd-accent-color-tint,
            var(
              --ddd-palette-tint,
              light-dark(
                var(--ddd-theme-default-skyMaxLight),
                var(--ddd-theme-default-nittanyNavy)
              )
            )
          );
          --ddd-component-quick-poll-button: var(
            --ddd-accent-color,
            var(
              --ddd-palette-accent,
              light-dark(
                var(--ddd-theme-default-nittanyNavy),
                var(--ddd-theme-default-linkLight)
              )
            )
          );
          --ddd-component-quick-poll-button-ink: var(
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
        :host([accent-color]) .ddd-block {
          --ddd-block-chip-background: var(--ddd-accent-color);
          --ddd-block-chip-color: var(--ddd-accent-color-ink);
        }
        .ddd-block {
          color: var(--ddd-status-default-ink);
          container-type: inline-size;
        }
        /* the response count sits in the header; on a narrow block it
           moves under the results so the question keeps its room */
        .responses-below {
          display: none;
        }
        @container (max-width: 480px) {
          .ddd-block-actions .responses {
            display: none;
          }
          .ddd-block-body .responses-below {
            display: block;
            margin-top: var(--ddd-spacing-2);
            margin-inline-end: var(--ddd-spacing-0);
            text-align: end;
          }
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip-path: inset(50%);
          white-space: nowrap;
        }
        .responses {
          flex: none;
          margin-inline-end: var(--ddd-spacing-2);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        .directions {
          padding-block: var(--ddd-spacing-3);
          padding-inline: var(--ddd-surface-padding, var(--ddd-spacing-4));
          border-bottom: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          font-size: var(--ddd-font-size-4xs);
        }
        .directions ul {
          margin: var(--ddd-spacing-0);
          padding-inline-start: var(--ddd-spacing-5);
        }
        .directions li {
          margin: var(--ddd-spacing-0);
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-150);
        }
        .directions li::marker {
          color: var(--ddd-component-quick-poll-marker);
        }
        .ddd-block-body {
          padding: var(--ddd-surface-padding, var(--ddd-spacing-4));
          font-size: var(--ddd-font-size-4xs);
        }
        .ddd-block-body p {
          margin: var(--ddd-spacing-0);
        }
        .ddd-block-body p + p {
          margin-top: var(--ddd-spacing-2);
        }
        /* every option is a full-width row, as on multiple choice */
        .options {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-2);
        }
        .option {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-3);
          box-sizing: border-box;
          min-height: var(--ddd-control-height-md);
          padding-block: var(--ddd-spacing-2);
          padding-inline: var(--ddd-spacing-3);
          border: var(--ddd-border-xs);
          border-color: var(--ddd-status-default-signal);
          border-radius: var(--ddd-radius-sm);
          line-height: var(--ddd-lh-140);
          cursor: pointer;
        }
        .option:hover {
          border-color: var(--ddd-component-quick-poll-chosen);
        }
        .option input {
          flex: none;
          width: var(--ddd-icon-4xs);
          height: var(--ddd-icon-4xs);
          margin: var(--ddd-spacing-0);
          accent-color: var(--ddd-status-answered-signal);
          cursor: pointer;
        }
        .option-text {
          flex: 1 1 auto;
          min-width: 0;
          overflow-wrap: anywhere;
        }
        /* chosen: marker edge and tint fill plus the checked radio */
        .option:has(input:checked) {
          border-color: var(--ddd-component-quick-poll-chosen);
          box-shadow: inset 0 0 0 var(--ddd-border-size-xs)
            var(--ddd-component-quick-poll-chosen);
          background-color: var(--ddd-component-quick-poll-tint);
        }
        .option:has(input:focus-visible) {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        /* results: label, percent and count are text; the bar is decoration */
        .bars {
          display: grid;
          gap: var(--ddd-spacing-2);
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-0);
          list-style: none;
        }
        .bar {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: var(--ddd-spacing-3);
          align-items: center;
          margin: var(--ddd-spacing-0);
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-140);
        }
        .track {
          position: relative;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-1) var(--ddd-spacing-2);
          min-height: var(--ddd-control-height-sm);
          padding-block: var(--ddd-spacing-1);
          padding-inline: var(--ddd-spacing-3);
          border-radius: var(--ddd-radius-xs);
          background-color: var(--ddd-status-answered-bg);
          overflow: hidden;
        }
        .fill {
          position: absolute;
          inset-block: var(--ddd-spacing-0);
          inset-inline-start: var(--ddd-spacing-0);
          box-sizing: border-box;
          width: var(--quick-poll-share, 0%);
          border-inline-end: var(--ddd-border-size-md) solid
            var(--ddd-component-quick-poll-marker);
          background-color: var(--ddd-component-quick-poll-tint);
        }
        .label,
        .mine {
          position: relative;
          overflow-wrap: anywhere;
        }
        .mine {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
          font-weight: var(--ddd-font-weight-bold);
          white-space: nowrap;
          --simple-icon-color: currentColor;
          --simple-icon-width: var(--ddd-icon-4xs);
          --simple-icon-height: var(--ddd-icon-4xs);
        }
        .bar[data-mine] .track {
          box-shadow: inset 0 0 0 var(--ddd-border-size-xs)
            var(--ddd-component-quick-poll-chosen);
        }
        .num {
          min-width: var(--ddd-spacing-15);
          text-align: end;
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        .ddd-block-footer {
          background-color: var(--ddd-status-answered-bg);
        }
        .status {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          flex: 1 1 200px;
          min-width: 0;
          min-height: var(--ddd-icon-xxs);
          line-height: var(--ddd-lh-140);
        }
        .status:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        .status-chip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: none;
          width: var(--ddd-icon-xxs);
          height: var(--ddd-icon-xxs);
          border-radius: var(--ddd-radius-circle);
          background-color: var(--ddd-status-correct-signal);
          color: var(--ddd-status-default-bg);
          --simple-icon-color: currentColor;
          --simple-icon-width: var(--ddd-icon-4xs);
          --simple-icon-height: var(--ddd-icon-4xs);
        }
        .status[data-status="needs"] .status-chip {
          background-color: var(--ddd-status-missing-signal);
        }
        .buttons {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-2);
        }
        .buttons button {
          display: inline-flex;
          align-items: center;
          box-sizing: border-box;
          min-height: var(--ddd-control-height-sm);
          margin: var(--ddd-spacing-0);
          padding-block: var(--ddd-spacing-0);
          padding-inline: var(
            --ddd-control-padding-inline,
            var(--ddd-spacing-4)
          );
          border-radius: var(--ddd-radius-xs);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-medium);
          cursor: pointer;
        }
        /* the filled action takes the accent */
        #vote {
          border: var(--ddd-border-xs);
          border-color: var(--ddd-component-quick-poll-button);
          background-color: var(--ddd-component-quick-poll-button);
          color: var(--ddd-component-quick-poll-button-ink);
        }
        #change,
        #keep {
          border: var(--ddd-border-xs);
          border-color: var(--ddd-status-answered-signal);
          background-color: var(--ddd-status-answered-bg);
          color: var(--ddd-status-answered-ink);
        }
        .buttons button:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        @media (forced-colors: active) {
          .fill {
            border-inline-end-color: Highlight;
          }
        }
      `,
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    // HAX (or any script) can change the options after first paint
    if (!this._observer) {
      this._observer = new MutationObserver(() => this.loadLightDomData());
      this._observer.observe(this, {
        childList: true,
        attributes: true,
        subtree: true,
        attributeFilter: ["value"],
      });
    }
    if (!this._listeners) {
      this._listeners = new AbortController();
      const opts = { signal: this._listeners.signal };
      globalThis.addEventListener(
        "learner-progress-ready",
        () => this._requestLearnerProgress(),
        opts,
      );
      globalThis.addEventListener(
        "learner-progress-cleared",
        () => this._forgetVote(),
        opts,
      );
    }
    this._checkClosed();
    // the light DOM may have changed while the element was disconnected
    if (this.hasUpdated) {
      this.loadLightDomData();
    }
  }

  disconnectedCallback() {
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
    if (this._listeners) {
      this._listeners.abort();
      this._listeners = null;
    }
    if (this._closeTimer) {
      clearTimeout(this._closeTimer);
      this._closeTimer = null;
    }
    this._loads.forEach((ctrl) => ctrl.abort());
    this._loads.clear();
    super.disconnectedCallback();
  }

  willUpdate(changedProperties) {
    if (super.willUpdate) {
      super.willUpdate(changedProperties);
    }
    if (
      changedProperties.has("showResults") &&
      !SHOW_RESULTS.includes(this.showResults)
    ) {
      this.showResults = "after";
    }
    if (changedProperties.has("options")) {
      const labels = (Array.isArray(this.options) ? this.options : [])
        .map((o) => (typeof o === "string" ? o : (o && o.label) || ""))
        .map((label) => String(label).trim())
        .filter((label) => label !== "");
      this._components = interactionComponents(labels);
      // a choice or vote for an option that is gone no longer counts
      const ids = this._components.map((c) => c.id);
      if (this._choice && !ids.includes(this._choice)) {
        this._choice = "";
      }
      if (this._voted && !ids.includes(this._voted)) {
        this._voted = "";
        this._changing = false;
        this._status = "";
      }
    }
    if (changedProperties.has("closes") && this.isConnected) {
      this._checkClosed();
    }
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    // defer a microtask so setting options does not schedule a second
    // update from within firstUpdated; ask for the saved vote once the
    // options are known
    queueMicrotask(() => {
      this.loadLightDomData();
      this.updateComplete.then(() => this._requestLearnerProgress());
    });
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    // ?checked in the template only sets the default state (and is what the
    // server renders), so keep the live state of the radios in step
    this.shadowRoot.querySelectorAll("input[type='radio']").forEach((radio) => {
      radio.checked = radio.value === this._choice;
    });
    if (
      this.hasUpdated &&
      changedProperties.has("endpoint") &&
      changedProperties.get("endpoint") !== undefined
    ) {
      this._loadResults();
    }
  }

  /**
   * Read the options off the light DOM `<input>` children. They are left in
   * place (nothing about a poll is secret) and never slotted, so they are
   * not shown twice.
   */
  loadLightDomData() {
    const inputs = this._optionInputs(this);
    this._lightLoaded = true;
    if (inputs.length === 0) {
      return;
    }
    const options = inputs.map((input) => ({
      label: input.getAttribute("value") || "",
    }));
    // avoid a re-render when the data did not change
    if (JSON.stringify(options) !== JSON.stringify(this.options)) {
      this.options = options;
    }
  }

  // the authored option inputs of a node (direct children, not slotted)
  _optionInputs(node) {
    return Array.from(node.children).filter(
      (child) => child.tagName === "INPUT" && !child.hasAttribute("slot"),
    );
  }

  _mode() {
    return SHOW_RESULTS.includes(this.showResults) ? this.showResults : "after";
  }

  // may this learner see results now
  _resultsVisible() {
    const mode = this._mode();
    if (mode === "never") {
      return false;
    }
    if (mode === "closed") {
      return this._closed;
    }
    return Boolean(this._voted) || this._closed;
  }

  // counts for the current options from whatever the host supplied; null
  // when there is no usable results object
  _counts() {
    const source = this._results;
    if (!source || typeof source !== "object" || Array.isArray(source)) {
      return null;
    }
    return this._components.map((c) => {
      const n = Object.prototype.hasOwnProperty.call(source, c.id)
        ? Number(source[c.id])
        : 0;
      return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
    });
  }

  // browser only: whether the closes date-time has passed, how to say it,
  // and a timer for the moment it does
  _checkClosed() {
    if (this._closeTimer) {
      clearTimeout(this._closeTimer);
      this._closeTimer = null;
    }
    const at = this.closes ? Date.parse(this.closes) : NaN;
    if (Number.isNaN(at)) {
      this._closed = false;
      this._closesLabel = "";
      return;
    }
    const now = Date.now();
    this._closed = now >= at;
    let label = "";
    try {
      label = new Date(at).toLocaleString(
        globalThis.document.documentElement.lang || undefined,
        { dateStyle: "medium", timeStyle: "short" },
      );
    } catch {
      label = new Date(at).toLocaleString();
    }
    this._closesLabel = label;
    if (!this._closed && at - now < MAX_TIMEOUT) {
      this._closeTimer = setTimeout(() => {
        this._closeTimer = null;
        this._checkClosed();
        this._loadResults();
      }, at - now);
    }
  }

  // HAX is editing: no votes, no learner data, no saved state
  _isEditing() {
    const store =
      globalThis.HaxStore &&
      typeof globalThis.HaxStore.requestAvailability === "function"
        ? globalThis.HaxStore.requestAvailability()
        : null;
    return Boolean(this._haxstate || (store && store.editMode));
  }

  _toggleDirections() {
    this._directionsOpen = !this._directionsOpen;
  }

  _optionChanged(e) {
    this._choice = e.target.value;
    if (this._status === "needs") {
      this._status = "";
    }
  }

  async _startChange() {
    this._choice = this._voted;
    this._changing = true;
    this._status = "";
    await this.updateComplete;
    const radio = this.shadowRoot.querySelector("input[type='radio']:checked");
    if (radio) {
      radio.focus();
    }
  }

  async _keepVote() {
    this._changing = false;
    this._choice = this._voted;
    await this.updateComplete;
    this._focusStatus();
  }

  _focusStatus() {
    const status = this.shadowRoot.querySelector("#status");
    if (status) {
      status.focus();
    }
  }

  /**
   * Cast the vote for the picked option.
   */
  async submitVote() {
    if (this._isEditing()) {
      this._status = "editing";
      return;
    }
    if (this._closed) {
      return;
    }
    const choice = this._components.find((c) => c.id === this._choice);
    if (!choice) {
      this._status = "needs";
      return;
    }
    const previous = this._voted;
    this._changing = false;
    this._status = "thanks";
    if (previous !== choice.id) {
      this._voted = choice.id;
      this._restored = false;
      this._resultsUnavailable = false;
      this._announceVote(choice, previous);
      this._sendVote(choice.id, previous);
    }
    await this.updateComplete;
    // the Vote button is gone: put focus on the message, never on <body>
    this._focusStatus();
    if (!this._celebrated) {
      this._celebrated = true;
      celebrateDDDCompletion(
        this.shadowRoot.querySelector(".ddd-block-chip[data-done]"),
      );
    }
  }

  /**
   * xAPI statements this element sends (see scripts/generate-xapi-vocabulary.mjs)
   */
  static get xapiVocabulary() {
    return {
      tag: "quick-poll",
      event: "user-engagement",
      verbs: ["answered"],
      objectType: "http://adlnet.gov/expapi/activities/cmi.interaction",
      interactionType: "choice",
      definition: ["name", "interactionType", "choices"],
      response: "the id of the option voted for (never judged, so no success)",
      result: ["completion", "response"],
      countsTowardCompletion: true,
      done: "voted",
    };
  }

  /**
   * Author content that identifies this poll when it has no id; used for
   * its xAPI activity id. The question only, so rewording an option does
   * not start a new poll.
   */
  xapiFingerprint() {
    return `quick-poll\u0001${this.question || ""}`;
  }

  // tell the page: the plain vote event for a host that counts votes, and
  // the learner record (a choice interaction with nothing judged)
  _announceVote(choice, previous) {
    const id = activityId(this, this.xapiFingerprint());
    const name = String(this.question || this.t.poll).slice(0, 120);
    this.dispatchEvent(
      new CustomEvent("quick-poll-vote", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: {
          activityId: id,
          choice: choice.id,
          label: choice.description,
          previous: previous || "",
        },
      }),
    );
    this.dispatchEvent(
      new CustomEvent("user-engagement", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: {
          activityDisplay: "answered",
          objectName: name,
          statement: buildStatement({
            verb: "answered",
            object: {
              id,
              name,
              interactionType: "choice",
              choices: this._components.map(({ id: cid, description }) => ({
                id: cid,
                description,
              })),
            },
            result: { completion: true, response: choice.id },
            context: {
              extensions: { [XAPI_EXTENSIONS.element]: QuickPoll.tag },
            },
          }),
        },
      }),
    );
  }

  // the endpoint as a URL, or null: http(s) only, resolved against the
  // page, no credentials in the address
  _endpointUrl() {
    if (!this.endpoint || typeof this.endpoint !== "string") {
      return null;
    }
    try {
      const url = new URL(this.endpoint.trim(), globalThis.document.baseURI);
      if (
        (url.protocol !== "http:" && url.protocol !== "https:") ||
        url.username ||
        url.password
      ) {
        return null;
      }
      return url;
    } catch {
      return null;
    }
  }

  // cookies and HTTP auth go only to the page's own origin
  _credentials(url) {
    return url.origin === globalThis.location.origin ? "same-origin" : "omit";
  }

  // POST the vote; the answer carries the new counts
  _sendVote(choice, previous) {
    const url = this._endpointUrl();
    if (!url || typeof globalThis.fetch !== "function") {
      return;
    }
    const body = {
      activityId: activityId(this, this.xapiFingerprint()),
      choice,
    };
    if (previous) {
      body.previous = previous;
    }
    // not aborted on disconnect: a vote already cast should still arrive
    this._readCounts(
      globalThis.fetch(url.href, {
        method: "POST",
        credentials: this._credentials(url),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        keepalive: true,
      }),
    );
  }

  // GET the counts, only for a learner who may see them
  _loadResults() {
    const url = this._endpointUrl();
    if (
      !url ||
      typeof globalThis.fetch !== "function" ||
      !this.isConnected ||
      this._isEditing() ||
      !this._resultsVisible()
    ) {
      return;
    }
    url.searchParams.set(
      "activityId",
      activityId(this, this.xapiFingerprint()),
    );
    const ctrl = new AbortController();
    this._loads.add(ctrl);
    this._readCounts(
      globalThis.fetch(url.href, {
        method: "GET",
        credentials: this._credentials(url),
        headers: { Accept: "application/json" },
        signal: ctrl.signal,
      }),
    ).then(() => this._loads.delete(ctrl));
  }

  // take { counts } from a response unless results changed (or a newer
  // request started) while this one was in flight; failures are quiet: the
  // vote stays and the poll says results are unavailable
  async _readCounts(request) {
    const seq = ++this._resultsSeq;
    let counts = null;
    try {
      const response = await request;
      if (!response || !response.ok) {
        throw new Error("quick-poll: results request failed");
      }
      const data = await response.json();
      counts = data && data.counts;
      if (!counts || typeof counts !== "object" || Array.isArray(counts)) {
        throw new Error("quick-poll: results response has no counts");
      }
    } catch {
      counts = null;
    }
    if (seq !== this._resultsSeq || !this.isConnected) {
      return;
    }
    if (!counts) {
      this._resultsUnavailable = true;
      return;
    }
    // instructor only: the counts are never kept on the learner's page
    if (this._mode() === "never") {
      return;
    }
    const clean = {};
    this._components.forEach((c) => {
      const n = Object.prototype.hasOwnProperty.call(counts, c.id)
        ? Number(counts[c.id])
        : 0;
      clean[c.id] = Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
    });
    this._resultsUnavailable = false;
    this.results = clean;
  }

  // ask a learner progress listener for this visitor's earlier vote
  _requestLearnerProgress() {
    if (!this.isConnected || this._isEditing() || this._voted) {
      return;
    }
    const detail = {
      activityId: activityId(this, this.xapiFingerprint()),
      tag: QuickPoll.tag,
      record: null,
    };
    globalThis.dispatchEvent(
      new CustomEvent("learner-progress-request", { detail }),
    );
    const record = detail.record;
    if (record && typeof record.response === "string" && record.response) {
      this.restoreLearnerResponse(record.response);
    }
  }

  /**
   * Put the learner's saved vote back. response: the option id (ids no
   * longer in the poll are ignored). Nothing is sent again.
   * @param {String} response
   * @returns {Boolean} true when the vote was restored
   */
  restoreLearnerResponse(response) {
    if (typeof response !== "string" || this._isEditing()) {
      return false;
    }
    const ids = response.split(XAPI_ITEM_DELIMITER);
    const found = this._components.find((c) => ids.includes(c.id));
    if (!found) {
      return false;
    }
    this._voted = found.id;
    this._choice = found.id;
    this._restored = true;
    // already done on an earlier visit: the chip shows it without a burst
    this._celebrated = true;
    this._loadResults();
    return true;
  }

  // drop the vote: progress was cleared, or HAX started editing
  _forgetVote() {
    this._voted = "";
    this._choice = "";
    this._changing = false;
    this._status = "";
    this._restored = false;
    this._celebrated = false;
    this._resultsUnavailable = false;
  }

  render() {
    const editing = this._haxstate;
    const voted = this._components.find((c) => c.id === this._voted) || null;
    const counts = this._resultsVisible() ? this._counts() : null;
    const total = counts ? counts.reduce((sum, n) => sum + n, 0) : 0;
    const enough = this._components.length > 1;
    const voting = enough && !this._closed && (!voted || this._changing);
    const directions = [
      this.t.pickOne,
      this._mode() === "never"
        ? this.t.resultsFromInstructor
        : this._mode() === "closed"
          ? this.t.resultsAfterClosing
          : this.t.resultsAfterVoting,
    ];
    const canChange =
      voted && this.allowChange && !this._closed && !this._changing && !editing;
    const hasButtons = voting || canChange;
    const responses = counts
      ? total === 1
        ? this.t.oneResponse
        : this.t.responses.replace("{count}", String(total))
      : "";
    return html`
      <div class="ddd-block" role="group" aria-labelledby="hdr">
        ${renderDDDBlockHeader({
          id: "hdr",
          icon: "social:poll",
          done: Boolean(voted),
          doneLabel: this.t.voted,
          label: `${this.t.poll} · ${this.t.anonymous}`,
          title: this.question
            ? html`<span id="question" property="oer:name"
                >${this.question}</span
              >`
            : nothing,
          titleTag: "h3",
          actions: html`${
              counts
                ? html`<span class="responses">${responses}</span>`
                : nothing
            }<button
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
            ${directions.map((line) => html`<li>${line}</li>`)}
          </ul>
        </div>
        <div class="ddd-block-body">
          ${
            !enough
              ? html`<p class="empty">${this.t.noOptions}</p>`
              : voting
                ? this._renderOptions()
                : counts
                  ? html`${this._renderResults(counts, total, voted)}
                      <p class="responses responses-below">${responses}</p>`
                  : this._renderReceipt(voted)
          }
        </div>
        <div class="ddd-block-footer" ?hidden="${!hasButtons && !this._status}">
          <div
            id="status"
            class="status"
            data-status="${this._status || nothing}"
            tabindex="-1"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            ${this._renderStatus()}
          </div>
          <div class="buttons">
            ${
              voting
                ? html`${
                      this._changing
                        ? html`<button
                            type="button"
                            id="keep"
                            @click="${this._keepVote}"
                          >
                            ${this.t.keepVote}
                          </button>`
                        : nothing
                    }<button
                      type="button"
                      id="vote"
                      @click="${this.submitVote}"
                    >
                      ${this.t.vote}
                    </button>`
                : canChange
                  ? html`<button
                      type="button"
                      id="change"
                      @click="${this._startChange}"
                    >
                      ${this.t.changeVote}
                    </button>`
                  : nothing
            }
          </div>
        </div>
      </div>
    `;
  }

  // a real radio group: arrow keys move, Space selects
  _renderOptions() {
    return html`<div
      class="options"
      role="radiogroup"
      aria-labelledby="${this.question ? "question" : "hdr"}"
    >
      ${this._components.map(
        (c) =>
          html`<label class="option"
            ><input
              type="radio"
              name="choice"
              value="${c.id}"
              ?checked="${this._choice === c.id}"
              @change="${this._optionChanged}"
            /><span class="option-text">${c.description}</span></label
          >`,
      )}
    </div>`;
  }

  // one row per option; the learner's own row says so in words and an icon
  _renderResults(counts, total, voted) {
    return html`<ul class="bars">
      ${this._components.map((c, i) => {
        const percent = total > 0 ? Math.round((counts[i] / total) * 100) : 0;
        const mine = Boolean(voted && voted.id === c.id);
        return html`<li class="bar" ?data-mine="${mine}">
          <span class="track"
            ><span
              class="fill"
              style="--quick-poll-share: ${percent}%"
              aria-hidden="true"
            ></span
            ><span class="label">${c.description}</span>${
              mine
                ? html`<span class="mine"
                    ><simple-icon-lite
                      icon="social:person"
                      aria-hidden="true"
                    ></simple-icon-lite
                    >${this.t.yourVote}</span
                  >`
                : nothing
            }</span
          ><span class="num"
            >${percent}% <span aria-hidden="true">·</span> ${counts[i]}
            <span class="sr-only">${this.t.votes}</span></span
          >
        </li>`;
      })}
    </ul>`;
  }

  // no results to show: the learner's own vote and when results come
  _renderReceipt(voted) {
    const mode = this._mode();
    let note = "";
    if (mode === "never") {
      note = voted ? this.t.resultsFromInstructor : "";
    } else if (mode === "closed" && !this._closed) {
      note = this._closesLabel
        ? this.t.resultsWhenClosedOn.replace("{date}", this._closesLabel)
        : this.t.resultsWhenClosed;
    } else if (this._resultsUnavailable) {
      note = this.t.resultsUnavailable;
    }
    return html`${
      voted
        ? html`<p class="receipt">
            <strong
              >${this.t.voteIsIn.replace("{option}", voted.description)}</strong
            >
          </p>`
        : nothing
    }${this._closed ? html`<p class="closed">${this.t.closed}</p>` : nothing}${
      note ? html`<p class="note">${note}</p>` : nothing
    }`;
  }

  _renderStatus() {
    if (this._status === "needs") {
      return html`<span
          class="status-chip"
          title="${this.t.needsInput}"
          aria-hidden="true"
          ><simple-icon-lite
            icon="icons:error-outline"
          ></simple-icon-lite></span
        ><span>${this.t.pickFirst}</span>`;
    }
    if (this._status === "thanks") {
      return html`<span
          class="status-chip"
          title="${this.t.voted}"
          aria-hidden="true"
          ><simple-icon-lite icon="icons:check"></simple-icon-lite></span
        ><span>${this.t.thanks}</span>`;
    }
    if (this._status === "editing") {
      return html`<span>${this.t.votingOffWhileEditing}</span>`;
    }
    return nothing;
  }

  /**
   * Implements haxHooks to tie into the HAX life-cycle if HAX exists.
   */
  haxHooks() {
    return {
      editModeChanged: "haxeditModeChanged",
      activeElementChanged: "haxactiveElementChanged",
      preProcessNodeToContent: "haxpreProcessNodeToContent",
      preProcessInsertContent: "haxpreProcessInsertContent",
    };
  }

  // a learner's vote (cast or restored) never reaches authoring
  haxeditModeChanged(value) {
    this._haxstate = Boolean(value);
    if (value) {
      this._forgetVote();
    } else {
      this._requestLearnerProgress();
    }
  }

  haxactiveElementChanged(_element, value) {
    if (value && !this._haxstate) {
      this._haxstate = true;
      this._forgetVote();
    }
  }

  /**
   * HAX preprocess Node to Content hook: the options edited in the HAX form
   * are written to the light DOM `<input>` children at save time, so the
   * array is never an attribute. Inputs that already say the same thing
   * are left exactly as authored.
   */
  haxpreProcessNodeToContent(node) {
    if (!node || !node._lightLoaded || !Array.isArray(node.options)) {
      return node;
    }
    const labels = node.options
      .map((o) => (typeof o === "string" ? o : (o && o.label) || ""))
      .map((label) => String(label).trim())
      .filter((label) => label !== "");
    const inputs = this._optionInputs(node);
    const current = inputs.map((input) => input.getAttribute("value") || "");
    if (JSON.stringify(labels) !== JSON.stringify(current)) {
      inputs.forEach((input) => input.remove());
      labels.forEach((label) => {
        const input = globalThis.document.createElement("input");
        input.setAttribute("value", label);
        node.appendChild(input);
      });
    }
    return node;
  }

  /**
   * HAX preprocess insert content hook: learner and host state is never
   * part of inserted content.
   */
  haxpreProcessInsertContent(detail, _activeNode) {
    if (detail && detail.properties) {
      delete detail.properties.results;
    }
    return detail;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(QuickPoll.tag, QuickPoll);
