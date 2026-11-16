/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { DDDAccentStyles } from "@haxtheweb/d-d-d/lib/DDDAccent.js";
import {
  DDDBlockStyles,
  renderDDDBlockHeader,
  celebrateDDDCompletion,
} from "@haxtheweb/d-d-d/lib/DDDBlock.js";
import { DDDChartStyles } from "@haxtheweb/d-d-d/lib/DDDChart.js";
import { DDDStatusTokens } from "@haxtheweb/d-d-d/lib/DDDStatusTokens.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import {
  activityId,
  buildStatement,
  componentId,
  XAPI_ACTIVITY_TYPES,
  XAPI_EXTENSIONS,
  XAPI_ITEM_DELIMITER,
} from "@haxtheweb/user-action/lib/xapi.js";
import { generateWordSearch } from "./lib/word-search-generator.js";

// found words cycle through the eight DDD chart series
const SERIES = 8;

/**
 * `word-search`
 * A letter grid with hidden words. The learner taps the first letter of a
 * word and then its last letter (or uses the arrow keys with Enter / Space).
 *
 * The words are authored as list items in light DOM and are never changed.
 * The grid is generated from them with a seeded generator, so the same
 * words always give the same grid for every learner.
 *
 * It practices recognising how a term is spelled. It does not practice what
 * the term means.
 *
 * @fires user-engagement - bubbling, composed. detail: { activityDisplay
 *   ("progressed" each time a word is found, "completed" once per visit
 *   when every word is found), objectName, resultCompletion, statement
 *   (xAPI) }. Never sent while HAX is editing.
 * @fires learner-progress-request - on window when the visitor view loads.
 *   detail: { activityId, tag, record }; a listener sets record and the
 *   words in record.response are shown as found.
 *
 * @demo demo/index.html
 * @element word-search
 */
export class WordSearch extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "word-search";
  }

  /**
   * xAPI statements this element sends (see scripts/generate-xapi-vocabulary.mjs)
   */
  static get xapiVocabulary() {
    return {
      tag: "word-search",
      event: "user-engagement",
      verbs: ["progressed", "completed"],
      objectType: "http://adlnet.gov/expapi/activities/simulation",
      response: "ids of the words found so far (c- + 8 hex of each word)",
      result: [
        "completion",
        "response",
        "score",
        "extensions.https://haxtheweb.org/xapi/extensions/progress",
      ],
      countsTowardCompletion: true,
      done: "every word found",
    };
  }

  constructor() {
    super();
    this.title = "";
    this.words = [];
    this.size = null;
    this.diagonal = false;
    this.backwards = false;
    this.accentColor = "";
    this._puzzle = { size: 0, grid: [], placed: [], unplaced: [] };
    this._found = {};
    this._start = null;
    this._focus = [0, 0];
    this._status = "";
    this._statusFlip = false;
    this._directionsOpen = false;
    this._haxstate = false;
    this._celebrated = false;
    this._completedSent = false;
    this._moveFocus = false;
    this._dragFrom = null;
    this._domWords = "[]";
    this._wordsSource = this.words;
    this._observer = null;
    this._progressListeners = null;
    this.t = {
      ...this.t,
      blockLabel: "Game · Word search",
      wordSearch: "Word search",
      counter: "{found} of {total}",
      directions: "Directions",
      showDirections: "Show directions",
      hideDirections: "Hide directions",
      directionsTap:
        "Tap the first letter of a word, then its last letter. Found words are numbered in the grid and crossed off the list.",
      directionsAcrossDown: "Words run across or down.",
      directionsDiagonal: "Words run across, down or diagonally.",
      directionsBackwards: "Some words are written backwards.",
      directionsKeyboard:
        "With a keyboard: move with the arrow keys, press Enter or Space on the first letter and again on the last letter. Escape clears the first letter.",
      letterGrid: "Letter grid",
      wordList: "Words to find",
      startAt:
        "Start at {letter}, row {row} column {column}. Now choose the last letter.",
      startCleared: "Start cleared.",
      foundWord: "Found {word}.",
      noWord: "No word there.",
      allFound: "All {total} words found",
      found: "found",
      foundCell: "found, word {numbers}",
      startCell: "start",
      startOver: "Start over",
      startedOver: "Started over.",
      empty: "Add words to make a puzzle.",
      unplaced: "These words do not fit in the grid and are left out:",
      editing: "Play is paused while you edit.",
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
       * Visible title of the puzzle
       */
      title: { type: String },
      /**
       * The words, as [{ word }]. Read from the list items in light DOM;
       * setting it (the HAX form does) rewrites that list.
       */
      words: { type: Array, attribute: false },
      /**
       * Cells per side (4 to 16). Leave empty to fit the longest word.
       */
      size: { type: Number },
      /**
       * Also hide words diagonally
       */
      diagonal: { type: Boolean, reflect: true },
      /**
       * Also hide words written backwards
       */
      backwards: { type: Boolean, reflect: true },
      /**
       * Optional accent for the chip, the start letter and the button
       * (the names DDDAccent maps, e.g. blue, teal, purple)
       */
      accentColor: { type: String, attribute: "accent-color", reflect: true },
      _puzzle: { state: true },
      _found: { state: true },
      _start: { state: true },
      _focus: { state: true },
      _status: { state: true },
      _directionsOpen: { state: true },
      _haxstate: { state: true },
    };
  }

  static get styles() {
    return [
      super.styles,
      DDDStatusTokens,
      DDDChartStyles,
      DDDAccentStyles,
      DDDBlockStyles,
      css`
        :host {
          display: block;
          margin: var(--ddd-spacing-5) 0;
          /* accent roles: DDD default, then the palette, then accent-color
             on the element */
          --ddd-component-word-search-marker: var(
            --ddd-accent-color,
            var(
              --ddd-palette-marker,
              light-dark(
                var(--ddd-theme-default-nittanyNavy),
                var(--ddd-theme-default-linkLight)
              )
            )
          );
          --ddd-component-word-search-tint: var(
            --ddd-accent-color-tint,
            var(
              --ddd-palette-tint,
              light-dark(
                var(--ddd-theme-default-limestoneMaxLight),
                var(--ddd-theme-default-potentialMidnight)
              )
            )
          );
          --ddd-component-word-search-accent: var(
            --ddd-accent-color,
            var(
              --ddd-palette-accent,
              light-dark(
                var(--ddd-theme-default-nittanyNavy),
                var(--ddd-theme-default-linkLight)
              )
            )
          );
          --ddd-component-word-search-accent-ink: var(
            --ddd-accent-color-ink,
            var(
              --ddd-palette-accent-ink,
              light-dark(
                var(--ddd-theme-default-white),
                var(--ddd-theme-default-potentialMidnight)
              )
            )
          );
          --ddd-component-word-search-line: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-theme-default-slateGray)
          );
          --ddd-component-word-search-surface: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
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
        }
        .counter {
          margin-inline-end: var(--ddd-spacing-2);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
        }
        .directions {
          padding-block: var(--ddd-spacing-3);
          padding-inline: var(--ddd-surface-padding, var(--ddd-spacing-4));
          border-bottom: var(--ddd-border-xs);
          border-color: var(--ddd-status-default-signal);
          background-color: var(--ddd-status-answered-bg);
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-150);
        }
        .directions ul {
          margin: var(--ddd-spacing-0);
          padding-inline-start: var(--ddd-spacing-5);
        }
        .directions li::marker {
          color: var(--ddd-component-word-search-marker);
        }
        .ddd-block-body {
          padding: var(--ddd-surface-padding, var(--ddd-spacing-4));
        }
        .note {
          margin: 0 0 var(--ddd-spacing-3);
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-150);
        }
        .note.unplaced {
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          border: var(--ddd-border-size-sm) var(--ddd-status-missing-line)
            var(--ddd-status-missing-signal);
          border-radius: var(--ddd-radius-xs);
        }
        .note simple-icon-lite {
          --simple-icon-width: var(--ddd-icon-3xs);
          --simple-icon-height: var(--ddd-icon-3xs);
          vertical-align: text-bottom;
        }
        /* the grid scrolls inside its own box when it can not fit, so the
           page never scrolls sideways */
        .grid-scroll {
          max-width: 100%;
          overflow-x: auto;
          padding: var(--ddd-spacing-1);
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(
            var(--ddd-component-word-search-size),
            minmax(var(--ddd-spacing-6), 1fr)
          );
          gap: var(--ddd-border-size-sm);
          box-sizing: border-box;
          width: 100%;
          min-width: calc(
            var(--ddd-component-word-search-size) * var(--ddd-spacing-6) +
              (var(--ddd-component-word-search-size) - 1) *
              var(--ddd-border-size-sm)
          );
          max-width: calc(
            var(--ddd-component-word-search-size) * var(--ddd-spacing-10) +
              (var(--ddd-component-word-search-size) - 1) *
              var(--ddd-border-size-sm)
          );
          user-select: none;
        }
        .row {
          display: contents;
        }
        .cell {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          aspect-ratio: 1;
          min-width: var(--ddd-spacing-6);
          min-height: var(--ddd-spacing-6);
          border: var(--ddd-border-xs);
          border-color: var(--ddd-component-word-search-line);
          border-radius: var(--ddd-radius-xs);
          background-color: var(--ddd-component-word-search-surface);
          color: var(--ddd-status-default-ink);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-medium);
          line-height: 1;
          cursor: pointer;
        }
        .grid[aria-disabled="true"] .cell {
          cursor: default;
        }
        .cell:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-border-size-xs);
          z-index: 1;
        }
        /* the pending first letter: a thick edge in the palette marker */
        .cell[aria-selected="true"] {
          border: var(--ddd-border-size-md) solid
            var(--ddd-component-word-search-marker);
          background-color: var(--ddd-component-word-search-tint);
          font-weight: var(--ddd-font-weight-black);
        }
        /* found words are told apart by their number, not only the colour */
        .cell.found {
          border: var(--ddd-border-size-sm) solid
            var(--ddd-component-word-search-series);
          background-color: color-mix(
            in srgb,
            var(--ddd-component-word-search-series) 16%,
            var(--ddd-component-word-search-surface)
          );
        }
        .cell .number {
          position: absolute;
          top: var(--ddd-spacing-0);
          inset-inline-end: var(--ddd-border-size-sm);
          font-size: 0.6em;
          font-weight: var(--ddd-font-weight-bold);
        }
        .series-1 {
          --ddd-component-word-search-series: var(--ddd-chart-1);
        }
        .series-2 {
          --ddd-component-word-search-series: var(--ddd-chart-2);
        }
        .series-3 {
          --ddd-component-word-search-series: var(--ddd-chart-3);
        }
        .series-4 {
          --ddd-component-word-search-series: var(--ddd-chart-4);
        }
        .series-5 {
          --ddd-component-word-search-series: var(--ddd-chart-5);
        }
        .series-6 {
          --ddd-component-word-search-series: var(--ddd-chart-6);
        }
        .series-7 {
          --ddd-component-word-search-series: var(--ddd-chart-7);
        }
        .series-8 {
          --ddd-component-word-search-series: var(--ddd-chart-8);
        }
        .words {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-2) var(--ddd-spacing-4);
          margin: var(--ddd-spacing-3) 0 0;
          padding: var(--ddd-spacing-0);
          list-style: none;
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-medium);
        }
        .words li {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
          margin: var(--ddd-spacing-0);
          overflow-wrap: anywhere;
        }
        .words .number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: none;
          box-sizing: border-box;
          min-width: var(--ddd-icon-xxs);
          height: var(--ddd-icon-xxs);
          border: var(--ddd-border-xs);
          border-color: var(--ddd-component-word-search-line);
          border-radius: var(--ddd-radius-circle);
          font-size: var(--ddd-font-size-6xs);
        }
        .words .found .number {
          border: var(--ddd-border-size-sm) solid
            var(--ddd-component-word-search-series);
          background-color: color-mix(
            in srgb,
            var(--ddd-component-word-search-series) 16%,
            var(--ddd-component-word-search-surface)
          );
        }
        .words .found .word {
          text-decoration: line-through;
        }
        .ddd-block-footer {
          justify-content: space-between;
          background-color: var(--ddd-status-answered-bg);
        }
        .ddd-block[data-complete] .ddd-block-footer {
          border-top: var(--ddd-border-size-md) var(--ddd-status-correct-line)
            var(--ddd-status-correct-signal);
        }
        .status {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          flex: 1 1 auto;
          min-width: 0;
          min-height: var(--ddd-icon-xxs);
          margin: var(--ddd-spacing-0);
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
        .status-word {
          color: var(--ddd-status-correct-ink);
        }
        .start-over {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          min-height: var(--ddd-control-height-sm);
          margin: var(--ddd-spacing-0);
          padding-block: var(--ddd-spacing-0);
          padding-inline: var(--ddd-spacing-4);
          border: var(--ddd-border-xs);
          border-color: var(--ddd-component-word-search-accent);
          border-radius: var(--ddd-radius-xs);
          background-color: var(--ddd-component-word-search-accent);
          color: var(--ddd-component-word-search-accent-ink);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-medium);
          cursor: pointer;
          --simple-icon-color: currentColor;
          --simple-icon-width: var(--ddd-icon-3xs);
          --simple-icon-height: var(--ddd-icon-3xs);
        }
        .start-over:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        @media (forced-colors: active) {
          .cell[aria-selected="true"] {
            border-color: Highlight;
          }
          .cell.found,
          .words .found .number {
            border-color: CanvasText;
          }
        }
      `,
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    // the resource an author saved keys the learner record; read it before
    // anything can write one
    if (this._xapiAuthoredResource === undefined) {
      this._xapiAuthoredResource = this.getAttribute("resource") || "";
    }
    this._readLightDom();
    if (!this._observer && globalThis.MutationObserver) {
      this._observer = new globalThis.MutationObserver(() =>
        this._readLightDom(),
      );
      this._observer.observe(this, {
        childList: true,
        subtree: true,
        characterData: true,
      });
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
        () => this._reset(""),
        opts,
      );
    }
  }

  disconnectedCallback() {
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
    if (this._progressListeners) {
      this._progressListeners.abort();
      this._progressListeners = null;
    }
    super.disconnectedCallback();
  }

  /**
   * The authored words as plain trimmed strings
   * @returns {String[]}
   */
  _wordTexts() {
    return (Array.isArray(this.words) ? this.words : [])
      .map((item) =>
        typeof item === "string" ? item : (item && item.word) || "",
      )
      .map((text) => String(text).trim())
      .filter(Boolean);
  }

  // light DOM is the saved content: one list item per word
  _readLightDom() {
    const texts = Array.from(this.querySelectorAll("li"))
      .map((li) => li.textContent.trim())
      .filter(Boolean);
    const key = JSON.stringify(texts);
    if (key !== this._domWords) {
      this._domWords = key;
      this._wordsSource = texts.map((word) => ({ word }));
      this.words = this._wordsSource;
    }
  }

  // words set from outside (the HAX form): write them back as list items
  _writeLightDom() {
    const texts = this._wordTexts();
    const key = JSON.stringify(texts);
    this._wordsSource = this.words;
    if (key === this._domWords) {
      return;
    }
    this._domWords = key;
    let list = this.querySelector("ul,ol");
    if (!list) {
      list = globalThis.document.createElement("ul");
      this.appendChild(list);
    }
    Array.from(this.querySelectorAll("li")).forEach((li) => li.remove());
    texts.forEach((text) => {
      const li = globalThis.document.createElement("li");
      li.textContent = text;
      list.appendChild(li);
    });
  }

  _locale() {
    const near =
      typeof this.closest === "function" ? this.closest("[lang]") : null;
    return (near && near.getAttribute("lang")) || "";
  }

  willUpdate(changedProperties) {
    if (super.willUpdate) {
      super.willUpdate(changedProperties);
    }
    if (
      changedProperties.has("words") ||
      changedProperties.has("size") ||
      changedProperties.has("diagonal") ||
      changedProperties.has("backwards")
    ) {
      const puzzle = generateWordSearch(this._wordTexts(), {
        size: this.size,
        diagonal: this.diagonal,
        backwards: this.backwards,
        locale: this._locale(),
      });
      puzzle.placed.forEach((entry) => {
        entry.id = componentId(entry.word);
      });
      this._puzzle = puzzle;
      // found words that are still in the puzzle stay found
      this._found = this._foundFromIds(Object.keys(this._found));
      this._start = null;
      this._focus = [0, 0];
    }
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this._requestLearnerProgress();
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (
      changedProperties.has("words") &&
      this.words !== this._wordsSource &&
      this.isConnected
    ) {
      this._writeLightDom();
    }
    if (this._moveFocus) {
      this._moveFocus = false;
      const cell = this.shadowRoot.querySelector('.cell[tabindex="0"]');
      if (cell) {
        cell.focus();
      }
    }
  }

  // { id: cells } for the ids that name a word in the puzzle
  _foundFromIds(ids) {
    const found = {};
    this._puzzle.placed.forEach((entry) => {
      if (ids.includes(entry.id)) {
        found[entry.id] = (this._found && this._found[entry.id]) || entry.cells;
      }
    });
    return found;
  }

  _editing() {
    const store =
      globalThis.HaxStore &&
      typeof globalThis.HaxStore.requestAvailability === "function"
        ? globalThis.HaxStore.requestAvailability()
        : null;
    return this._haxstate || Boolean(store && store.editMode);
  }

  get _complete() {
    const total = this._puzzle.placed.length;
    return total > 0 && Object.keys(this._found).length === total;
  }

  /**
   * Author content that identifies this puzzle for its xAPI activity id
   * @returns {String}
   */
  xapiFingerprint() {
    return `${this.title || ""}\u0001${this._wordTexts().join("\u0001")}`;
  }

  // ask the learner record (when a page has one) which words were found
  _requestLearnerProgress() {
    if (!this.isConnected || this._editing() || !this._puzzle.placed.length) {
      return;
    }
    const detail = {
      activityId: activityId(this, this.xapiFingerprint()),
      tag: WordSearch.tag,
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
   * Show the words of a saved response as found. Ids that no longer name a
   * word are ignored.
   * @param {String} response word ids joined by "[,]"
   * @returns {Boolean} true when at least one word was restored
   */
  restoreLearnerResponse(response) {
    if (this._editing()) {
      return false;
    }
    const found = this._foundFromIds(
      String(response || "").split(XAPI_ITEM_DELIMITER),
    );
    if (!Object.keys(found).length) {
      return false;
    }
    this._found = found;
    // a puzzle that was already finished does not celebrate again
    this._celebrated = this._complete;
    return true;
  }

  /**
   * Forget what the learner found
   */
  forgetLearnerResponse() {
    this._reset("");
  }

  _reset(message) {
    this._found = {};
    this._start = null;
    this._celebrated = false;
    this._say(message);
  }

  _say(text) {
    // the same message twice in a row is still announced
    this._statusFlip = !this._statusFlip;
    this._status = text ? text + (this._statusFlip ? " " : "") : "";
  }

  _statement(verb) {
    const total = this._puzzle.placed.length;
    const ids = this._puzzle.placed
      .filter((entry) => this._found[entry.id])
      .map((entry) => entry.id);
    const result = {
      completion: total > 0 && ids.length === total,
      response: ids.join(XAPI_ITEM_DELIMITER),
      extensions: {
        [XAPI_EXTENSIONS.progress]: total ? ids.length / total : 0,
      },
    };
    if (verb === "completed") {
      result.score = { raw: ids.length, max: total, min: 0 };
    }
    return buildStatement({
      verb,
      object: {
        id: activityId(this, this.xapiFingerprint()),
        name: (this.title || this.t.wordSearch).slice(0, 120),
        type: XAPI_ACTIVITY_TYPES.simulation,
      },
      result,
      context: { extensions: { [XAPI_EXTENSIONS.element]: WordSearch.tag } },
    });
  }

  _emit(verb) {
    if (this._editing()) {
      return;
    }
    this.dispatchEvent(
      new CustomEvent("user-engagement", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: {
          activityDisplay: verb,
          objectName: (this.title || this.t.wordSearch).slice(0, 120),
          resultCompletion: this._complete,
          statement: this._statement(verb),
        },
      }),
    );
  }

  // the cells on the straight line between two cells, or [] when the two
  // are not on a line this puzzle uses
  _line(from, to) {
    const dr = to[0] - from[0];
    const dc = to[1] - from[1];
    const straight = dr === 0 || dc === 0;
    const diagonal = this.diagonal && Math.abs(dr) === Math.abs(dc);
    if (!straight && !diagonal) {
      return [];
    }
    const steps = Math.max(Math.abs(dr), Math.abs(dc));
    const cells = [];
    for (let i = 0; i <= steps; i++) {
      cells.push([from[0] + Math.sign(dr) * i, from[1] + Math.sign(dc) * i]);
    }
    return cells;
  }

  /**
   * Choose a cell: the first choice sets the start, the second the end.
   * @param {Number} row
   * @param {Number} col
   */
  async selectCell(row, col) {
    const grid = this._puzzle.grid;
    if (this._editing() || !grid[row] || grid[row][col] === undefined) {
      return;
    }
    this._focus = [row, col];
    const start = this._start;
    if (!start) {
      this._start = [row, col];
      this._say(
        this.t.startAt
          .replace("{letter}", grid[row][col])
          .replace("{row}", row + 1)
          .replace("{column}", col + 1),
      );
      return;
    }
    this._start = null;
    if (start[0] === row && start[1] === col) {
      this._say(this.t.startCleared);
      return;
    }
    const cells = this._line(start, [row, col]);
    const spelled = cells.map((cell) => grid[cell[0]][cell[1]]).join("");
    const reversed = cells
      .map((cell) => grid[cell[0]][cell[1]])
      .reverse()
      .join("");
    // the order of the two taps does not matter
    const hit = cells.length
      ? this._puzzle.placed.find(
          (entry) =>
            !this._found[entry.id] &&
            (entry.word === spelled || entry.word === reversed),
        )
      : null;
    if (!hit) {
      this._say(this.t.noWord);
      return;
    }
    this._found = { ...this._found, [hit.id]: cells };
    this._say(this.t.foundWord.replace("{word}", hit.label));
    this._emit("progressed");
    if (this._complete) {
      if (!this._completedSent) {
        this._completedSent = true;
        this._emit("completed");
      }
      if (!this._celebrated) {
        this._celebrated = true;
        await this.updateComplete;
        celebrateDDDCompletion(
          this.shadowRoot.querySelector(".ddd-block-chip"),
        );
      }
    }
  }

  /**
   * Clear the found words and begin again
   */
  startOver() {
    this._reset(this.t.startedOver);
  }

  _cellOf(node) {
    const cell =
      node && typeof node.closest === "function"
        ? node.closest("[data-row]")
        : null;
    return cell
      ? [
          Number(cell.getAttribute("data-row")),
          Number(cell.getAttribute("data-col")),
        ]
      : null;
  }

  _onClick(e) {
    const cell = this._cellOf(e.target);
    if (cell) {
      this.selectCell(cell[0], cell[1]);
    }
  }

  // optional mouse / pen drag from the first letter to the last; touch
  // keeps the two taps so the page can still scroll
  _onPointerDown(e) {
    this._dragFrom =
      e.pointerType !== "touch" && e.button === 0
        ? this._cellOf(e.target)
        : null;
  }

  _onPointerUp(e) {
    const from = this._dragFrom;
    this._dragFrom = null;
    if (!from || this._editing()) {
      return;
    }
    const to = this._cellOf(
      this.shadowRoot.elementFromPoint(e.clientX, e.clientY),
    );
    // released on the same letter: the click that follows handles it
    if (!to || (to[0] === from[0] && to[1] === from[1])) {
      return;
    }
    this._start = from;
    this.selectCell(to[0], to[1]);
  }

  _onPointerCancel() {
    this._dragFrom = null;
  }

  _onKeydown(e) {
    const size = this._puzzle.size;
    if (!size || this._editing()) {
      return;
    }
    const cell = this._cellOf(e.target) || this._focus;
    let row = cell[0];
    let col = cell[1];
    const rtl =
      globalThis.getComputedStyle &&
      globalThis.getComputedStyle(this).direction === "rtl";
    switch (e.key) {
      case "ArrowUp":
        row -= 1;
        break;
      case "ArrowDown":
        row += 1;
        break;
      case "ArrowLeft":
        col += rtl ? 1 : -1;
        break;
      case "ArrowRight":
        col += rtl ? -1 : 1;
        break;
      case "Home":
        col = 0;
        break;
      case "End":
        col = size - 1;
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        this.selectCell(row, col);
        return;
      case "Escape":
        if (this._start) {
          e.preventDefault();
          this._start = null;
          this._say(this.t.startCleared);
        }
        return;
      default:
        return;
    }
    e.preventDefault();
    this._focus = [
      Math.min(size - 1, Math.max(0, row)),
      Math.min(size - 1, Math.max(0, col)),
    ];
    this._moveFocus = true;
  }

  _toggleDirections() {
    this._directionsOpen = !this._directionsOpen;
  }

  renderGrid() {
    const puzzle = this._puzzle;
    const editing = this._haxstate;
    // which found words (by their number in the list) cross each cell
    const marks = {};
    puzzle.placed.forEach((entry, index) => {
      (this._found[entry.id] || []).forEach((cell) => {
        const key = `${cell[0]},${cell[1]}`;
        (marks[key] = marks[key] || []).push(index + 1);
      });
    });
    return html`<div class="grid-scroll">
      <div
        class="grid"
        role="grid"
        aria-label="${this.t.letterGrid}"
        aria-disabled="${editing ? "true" : "false"}"
        style="--ddd-component-word-search-size: ${puzzle.size}"
        @click="${this._onClick}"
        @keydown="${this._onKeydown}"
        @pointerdown="${this._onPointerDown}"
        @pointerup="${this._onPointerUp}"
        @pointercancel="${this._onPointerCancel}"
      >
        ${puzzle.grid.map(
          (letters, row) =>
            html`<div class="row" role="row">
              ${letters.map((letter, col) => {
                const numbers = marks[`${row},${col}`];
                const isStart =
                  this._start &&
                  this._start[0] === row &&
                  this._start[1] === col;
                const isFocus =
                  this._focus[0] === row && this._focus[1] === col;
                return html`<div
                  class="cell ${
                    numbers
                      ? `found series-${((numbers[0] - 1) % SERIES) + 1}`
                      : ""
                  }"
                  role="gridcell"
                  tabindex="${isFocus && !editing ? "0" : "-1"}"
                  aria-selected="${isStart ? "true" : "false"}"
                  data-row="${row}"
                  data-col="${col}"
                >
                  ${letter}${
                    isStart
                      ? html`<span class="sr-only">, ${this.t.startCell}</span>`
                      : nothing
                  }${
                    numbers
                      ? html`<span class="number" aria-hidden="true"
                            >${numbers.join(",")}</span
                          ><span class="sr-only"
                            >,
                            ${this.t.foundCell.replace(
                              "{numbers}",
                              numbers.join(", "),
                            )}</span
                          >`
                      : nothing
                  }
                </div>`;
              })}
            </div>`,
        )}
      </div>
    </div>`;
  }

  renderWords() {
    return html`<ol class="words" role="list" aria-label="${this.t.wordList}">
      ${this._puzzle.placed.map((entry, index) => {
        const found = Boolean(this._found[entry.id]);
        return html`<li
          class="${found ? `found series-${(index % SERIES) + 1}` : ""}"
        >
          <span class="number">${index + 1}</span>
          <span class="word">${entry.label}</span>${
            found
              ? html`<span class="sr-only">, ${this.t.found}</span>`
              : nothing
          }
        </li>`;
      })}
    </ol>`;
  }

  render() {
    const puzzle = this._puzzle;
    const total = puzzle.placed.length;
    const done = Object.keys(this._found).length;
    const complete = this._complete;
    const editing = this._haxstate;
    return html`
      <div
        class="ddd-block"
        role="group"
        aria-labelledby="header"
        ?data-complete="${complete}"
      >
        ${renderDDDBlockHeader({
          id: "header",
          icon: "icons:search",
          label: this.t.blockLabel,
          title: this.title,
          titleTag: "h3",
          done: complete,
          doneLabel: this.t.allFound.replace("{total}", total),
          speakDone: false,
          actions: html`<span class="counter"
              >${this.t.counter
                .replace("{found}", done)
                .replace("{total}", total)}</span
            ><button
              class="ddd-block-action"
              id="directions-toggle"
              type="button"
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
            <li>${this.t.directionsTap}</li>
            <li>
              ${
                this.diagonal
                  ? this.t.directionsDiagonal
                  : this.t.directionsAcrossDown
              }
              ${this.backwards ? this.t.directionsBackwards : nothing}
            </li>
            <li>${this.t.directionsKeyboard}</li>
          </ul>
        </div>
        <div class="ddd-block-body">
          ${
            editing && puzzle.unplaced.length
              ? html`<p class="note unplaced">
                  <simple-icon-lite
                    icon="icons:error-outline"
                    aria-hidden="true"
                  ></simple-icon-lite>
                  ${this.t.unplaced} ${puzzle.unplaced.join(", ")}
                </p>`
              : nothing
          }
          ${
            total
              ? html`${this.renderGrid()}${this.renderWords()}`
              : html`<p class="note">${this.t.empty}</p>`
          }
        </div>
        <div class="ddd-block-footer">
          <p class="status" role="status">
            ${
              complete
                ? html`<span class="status-chip" aria-hidden="true"
                      ><simple-icon-lite icon="icons:check"></simple-icon-lite
                    ></span>
                    <strong class="status-word"
                      >${this.t.allFound.replace("{total}", total)}</strong
                    >`
                : editing
                  ? this.t.editing
                  : this._status
            }
          </p>
          <button
            class="start-over"
            type="button"
            ?hidden="${editing || !total}"
            @click="${this.startOver}"
          >
            <simple-icon-lite
              icon="icons:refresh"
              aria-hidden="true"
            ></simple-icon-lite
            >${this.t.startOver}
          </button>
        </div>
      </div>
    `;
  }

  /**
   * HAX hooks this element implements
   */
  haxHooks() {
    return {
      editModeChanged: "haxeditModeChanged",
      preProcessNodeToContent: "haxpreProcessNodeToContent",
    };
  }

  /**
   * Editing never shows or records learner state
   * @param {Boolean} value true while HAX is editing
   */
  haxeditModeChanged(value) {
    this._haxstate = Boolean(value);
    this._reset("");
    if (!value) {
      this._requestLearnerProgress();
    }
  }

  /**
   * Saving: the word list in light DOM is the content; make sure it holds
   * what the form last set
   * @param {HTMLElement} node
   * @returns {HTMLElement}
   */
  haxpreProcessNodeToContent(node) {
    if (node.words !== node._wordsSource) {
      node._writeLightDom();
    }
    return node;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(WordSearch.tag, WordSearch);
