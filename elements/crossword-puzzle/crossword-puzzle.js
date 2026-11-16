/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css, nothing } from "lit";
import {
  QuestionElement,
  fillInResponse,
  fillInText,
  XAPI_ITEM_DELIMITER,
} from "@haxtheweb/multiple-choice/lib/QuestionElement.js";
import { DDDAccentStyles } from "@haxtheweb/d-d-d/lib/DDDAccent.js";
import {
  crosswordLayout,
  crosswordCells,
  CROSSWORD_MAX_LENGTH,
  CROSSWORD_MAX_WORDS,
  CROSSWORD_MIN_LENGTH,
} from "./lib/crossword-layout.js";

// stands for an empty square inside a word of a saved response
const BLANK = "_";
const EMPTY_LAYOUT = { rows: 0, cols: 0, cells: [], words: [], unplaced: [] };

/**
 * `crossword-puzzle`
 * `A crossword generated from a list of words and clues`
 *
 * Words are light DOM inputs, one per word, with the clue beside it:
 * `<input value="HTML" data-clue="Markup language of the web" />`. The grid
 * is generated from them (lib/crossword-layout.js); nothing is hand placed.
 *
 * @demo demo/index.html
 * @element crossword-puzzle
 */
export class CrosswordPuzzle extends QuestionElement {
  static get tag() {
    return "crossword-puzzle";
  }
  /**
   * xAPI statements this element sends (see scripts/generate-xapi-vocabulary.mjs)
   */
  static get xapiVocabulary() {
    return {
      tag: "crossword-puzzle",
      event: "user-engagement",
      verbs: ["answered"],
      objectType: "http://adlnet.gov/expapi/activities/cmi.interaction",
      interactionType: "fill-in",
      definition: ["name", "interactionType", "correctResponsesPattern"],
      response:
        "the word entered for each clue, across clues then down clues in number order, joined by [,]; an empty square inside a word is _",
      result: [
        "success",
        "completion",
        "response",
        "score",
        "extensions.attempts",
        "extensions.max-attempts",
      ],
      countsTowardCompletion: true,
      done: "every word in the grid is correct, or out of attempts",
    };
  }

  constructor() {
    super();
    this.t = {
      ...this.t,
      questionType: "Crossword",
      crosswordDirections:
        "Type one letter in each white square. The arrow keys move between squares. Select a square again, or press Space, to switch between across and down. Select a clue to jump to its word. When you are done, press {checkAnswer}.",
      gridLabel: "Crossword grid",
      across: "Across",
      down: "Down",
      cellAcross: "{number} across, letter {position} of {length}",
      cellDown: "{number} down, letter {position} of {length}",
      activeAcross: "{number} Across",
      activeDown: "{number} Down",
      startHint: "Select a square or a clue to begin.",
      missing: "Missing",
      wordsCorrect: "{correct} of {total} words correct.",
      noWords: "This crossword has no words yet.",
      addWords:
        "Add words and clues in the settings to build the crossword. The grid is made for you.",
      answerKey: "Answer key. Learners never see these letters.",
      unplacedHeading: "Words left out of the grid",
      unplacedHelp:
        "These words could not be placed, so learners will not see them. Change a word so it shares a letter with another word, or remove it.",
      reasonEmpty: "has no letters",
      reasonShort: "needs at least {min} letters",
      reasonLong: "is longer than {max} letters",
      reasonDuplicate: "is already in the list",
      reasonLimit: "is past the limit of {max} words",
      reasonNofit: "shares no usable letter with the grid",
      addWord: "Add word",
      removeWord: "Remove last word",
      newWord: "WORD",
      newClue: "Clue for this word",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("./locales/", import.meta.url).href,
    });
    this.question = "";
    this.accentColor = null;
    // the base reads the learner's guess from this property
    this.guessDataValue = "_letters";
    // what the learner typed: { "row,col": letter }
    this._letters = {};
    // the focused square ("row,col") and the direction being filled
    this._active = "";
    this._dir = "across";
    this._layout = EMPTY_LAYOUT;
    this._layoutKey = "";
    this._cellMap = new Map();
    this._composedAt = -1;
    this._pressing = false;
    this._pressFocused = false;
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * Optional accent for the chip, the active word and the action
       * buttons: a color name such as "blue" or "green" (see DDDAccent.js)
       */
      accentColor: { type: String, attribute: "accent-color", reflect: true },
      _letters: { type: Object, state: true },
      _active: { type: String, state: true },
      _dir: { type: String, state: true },
    };
  }

  // feedback after a wrong check also says how many words are right, so
  // the status region and the toast both carry it
  get incorrectText() {
    const text = super.incorrectText;
    const total = this._layout ? this._layout.words.length : 0;
    if (!this.showAnswer || !total) {
      return text;
    }
    return `${text} ${this._fill(this.t.wordsCorrect, {
      correct: this._wordsCorrect(),
      total,
    })}`;
  }
  set incorrectText(value) {
    super.incorrectText = value;
  }

  willUpdate(changedProperties) {
    super.willUpdate(changedProperties);
    if (changedProperties.has("answers")) {
      this._buildLayout();
    }
  }

  // lay the words out again; what the learner typed only survives when
  // the grid is the same one
  _buildLayout() {
    const layout = crosswordLayout(
      (this.answers || []).map((a) => ({
        word: a && a.label,
        clue: a && a.clue,
      })),
    );
    const layoutKey = layout.words
      .map((w) => `${w.text}@${w.r},${w.c},${w.dir}`)
      .join("|");
    this._layout = layout;
    this._cellMap = new Map(layout.cells.map((c) => [`${c.r},${c.c}`, c]));
    if (layoutKey !== this._layoutKey) {
      this._layoutKey = layoutKey;
      this._letters = {};
      this._active = "";
      this._dir = "across";
    }
  }

  // ---------- answer key (light DOM inputs) ----------

  answerPrototype() {
    return { order: null, label: "", clue: "", correct: false };
  }
  // one word per input: value is the word, data-clue its clue
  processInput(index, inputs) {
    const input = inputs[index];
    const out = { ...this.answerPrototype(), order: parseInt(index) };
    if (input && typeof input.getAttribute === "function") {
      out.label = input.value || "";
      out.clue = input.getAttribute("data-clue") || "";
    } else if (input) {
      out.label = String(input.label || "");
      out.clue = String(input.clue || "");
    }
    return out;
  }
  async haxpreProcessNodeToContent(node) {
    const words = node.answers || [];
    node = await super.haxpreProcessNodeToContent(node);
    Array.from(node.querySelectorAll("input:not([slot])")).forEach(
      (input, i) => {
        if (words[i] && words[i].clue) {
          input.setAttribute("data-clue", words[i].clue);
        }
      },
    );
    return node;
  }

  // ---------- learner answer ----------

  _fill(str, parts) {
    return String(str).replace(/\{(\w+)\}/g, (m, name) =>
      name in parts ? parts[name] : m,
    );
  }
  // the squares of a word, in order: ["row,col", ...]
  _wordCells(word) {
    const down = word.dir === "down";
    return word.cells.map((_ch, i) =>
      down ? `${word.r + i},${word.c}` : `${word.r},${word.c + i}`,
    );
  }
  _wordCorrect(word) {
    return this._wordCells(word).every(
      (at, i) => this._letters[at] === word.cells[i],
    );
  }
  _wordsCorrect() {
    return this._layout.words.filter((w) => this._wordCorrect(w)).length;
  }
  // "correct", "incorrect" or "missing" for a square once checked
  _cellStatus(cell) {
    const letter = this._letters[`${cell.r},${cell.c}`];
    if (!letter) {
      return "missing";
    }
    return letter === cell.ch ? "correct" : "incorrect";
  }
  guessCount() {
    return Object.keys(this._letters).filter((at) => this._letters[at]).length;
  }
  isCorrect() {
    const total = this._layout.words.length;
    return total > 0 && this._wordsCorrect() === total;
  }
  resetAnswer(e) {
    // a solved or spent puzzle starts over; a wrong one keeps its letters
    // so the learner can fix them
    if (this.isCorrect() || this.attemptsExhausted()) {
      this._letters = {};
    }
    super.resetAnswer(e);
  }
  // nothing is checked or sent while the block is being edited
  checkAnswer(e) {
    if (this._authoring() || this._haxEditing()) {
      return Promise.resolve();
    }
    return super.checkAnswer(e);
  }
  _haxEditing() {
    const store =
      globalThis.HaxStore &&
      typeof globalThis.HaxStore.requestAvailability === "function"
        ? globalThis.HaxStore.requestAvailability()
        : null;
    return Boolean(store && store.editMode);
  }

  // ---------- xAPI ----------
  // fill-in: one item per clue, in clue order (across, then down). The
  // typed word is the answer, so there are no component ids.

  xapiDefinition() {
    const words = this._layout.words;
    return words.length
      ? { correctResponsesPattern: [fillInResponse(words.map((w) => w.text))] }
      : {};
  }
  learnerResponse() {
    const items = this._layout.words.map((w) => {
      const letters = this._wordCells(w).map((at) => this._letters[at] || "");
      return letters.some(Boolean)
        ? letters.map((l) => l || BLANK).join("")
        : "";
    });
    return items.some(Boolean) ? fillInResponse(items) : "";
  }
  learnerScore() {
    return {
      raw: this._wordsCorrect(),
      max: Math.max(1, this._layout.words.length),
    };
  }
  // put saved letters back. A word whose saved length no longer fits its
  // place in the grid is ignored; a response for another set of clues is
  // ignored altogether.
  restoreLearnerResponse(response) {
    if (typeof response !== "string" || !response) {
      return false;
    }
    const words = this._layout.words;
    const items = response.split(XAPI_ITEM_DELIMITER);
    if (!words.length || items.length !== words.length) {
      return false;
    }
    const letters = {};
    items.forEach((item, i) => {
      const typed = fillInText(item)
        .split(BLANK)
        .map((part) => crosswordCells(part));
      const cells = [];
      typed.forEach((part, p) => {
        if (p > 0) {
          cells.push("");
        }
        cells.push(...part);
      });
      const at = this._wordCells(words[i]);
      if (cells.length !== at.length) {
        return;
      }
      cells.forEach((letter, k) => {
        if (letter) {
          letters[at[k]] = letter;
        }
      });
    });
    if (!Object.keys(letters).length) {
      return false;
    }
    this._letters = letters;
    return true;
  }
  forgetLearnerResponse() {
    this._letters = {};
  }

  // ---------- HAX ----------

  // editing shows the answer key; the learner's letters never reach it
  _authoring() {
    return Boolean(this._haxstate || this.edit);
  }
  haxeditModeChanged(value) {
    super.haxeditModeChanged(value);
    this._letters = {};
    this._active = "";
    this.showAnswer = false;
    this.requestUpdate();
  }
  haxinlineContextMenu(ceMenu) {
    super.haxinlineContextMenu(ceMenu);
    ceMenu.ceButtons = [
      {
        icon: "icons:add",
        callback: "haxClickInlineAdd",
        label: this.t.addWord,
      },
      {
        icon: "icons:remove",
        callback: "haxClickInlineRemove",
        label: this.t.removeWord,
      },
      ...(ceMenu.ceButtons || []),
    ];
  }
  haxClickInlineAdd() {
    this.answers = [
      ...(this.answers || []),
      {
        ...this.answerPrototype(),
        label: this.t.newWord,
        clue: this.t.newClue,
      },
    ];
    return true;
  }
  haxClickInlineRemove() {
    if (this.answers && this.answers.length) {
      this.answers = this.answers.slice(0, -1);
      return true;
    }
    return false;
  }

  // ---------- moving around the grid ----------

  _locked() {
    return Boolean(this.showAnswer || this.disabled);
  }
  // position of the word being filled in this._layout.words, or -1
  _activeWord() {
    const cell = this._cellMap.get(this._active);
    if (!cell) {
      return -1;
    }
    const other = this._dir === "across" ? "down" : "across";
    return cell[this._dir] !== -1 ? cell[this._dir] : cell[other];
  }
  _input(at) {
    return this.shadowRoot
      ? this.shadowRoot.querySelector(`input[data-at="${at}"]`)
      : null;
  }
  _focusCell(at) {
    const input = this._input(at);
    if (input) {
      input.focus();
      input.select();
    }
    return Boolean(input);
  }
  // make a square the active one, keeping the direction when the square
  // has a word that way
  _activate(at) {
    const cell = this._cellMap.get(at);
    if (!cell) {
      return;
    }
    if (cell[this._dir] === -1) {
      this._dir = this._dir === "across" ? "down" : "across";
    }
    this._active = at;
  }
  _toggleDirection() {
    const cell = this._cellMap.get(this._active);
    if (cell && cell.across !== -1 && cell.down !== -1) {
      this._dir = this._dir === "across" ? "down" : "across";
    }
  }
  // move along the word being filled; false at either end
  _step(delta) {
    const word = this._layout.words[this._activeWord()];
    if (!word) {
      return false;
    }
    const cells = this._wordCells(word);
    const next = cells[cells.indexOf(this._active) + delta];
    return next ? this._focusCell(next) : false;
  }
  // an arrow key: the next square that way, stepping over black squares
  _move(dr, dc) {
    const [r, c] = this._active.split(",").map(Number);
    const { rows, cols } = this._layout;
    let rr = r + dr;
    let cc = c + dc;
    while (rr >= 0 && rr < rows && cc >= 0 && cc < cols) {
      if (this._cellMap.has(`${rr},${cc}`)) {
        this._dir = dr ? "down" : "across";
        this._focusCell(`${rr},${cc}`);
        return;
      }
      rr += dr;
      cc += dc;
    }
    // no square that way: the key still turns to that direction
    const cell = this._cellMap.get(this._active);
    const dir = dr ? "down" : "across";
    if (cell && cell[dir] !== -1) {
      this._dir = dir;
    }
  }
  _setLetter(at, letter) {
    const letters = { ...this._letters };
    if (letter) {
      letters[at] = letter;
    } else {
      delete letters[at];
    }
    this._letters = letters;
  }
  _at(e) {
    const input = e.target;
    return input && input.getAttribute ? input.getAttribute("data-at") : null;
  }
  _onGridFocus(e) {
    const at = this._at(e);
    if (at) {
      if (this._pressing) {
        this._pressFocused = true;
      }
      this._activate(at);
      e.target.select();
    }
  }
  _onGridPointerDown() {
    this._pressing = true;
    this._pressFocused = false;
  }
  // selecting the square that is already active switches across and down
  _onGridClick(e) {
    const at = this._at(e);
    const again = !this._pressFocused && at && at === this._active;
    this._pressing = false;
    this._pressFocused = false;
    if (again) {
      this._toggleDirection();
    }
  }
  _onGridInput(e) {
    // text still being composed (IME) is committed when composing ends,
    // and the input event some browsers send right after is skipped
    if (e.isComposing || e.timeStamp - this._composedAt < 50) {
      return;
    }
    this._commit(e.target);
  }
  _onGridCompositionEnd(e) {
    this._composedAt = e.timeStamp;
    this._commit(e.target);
  }
  // one character per square: keep the letter just typed, then move on
  _commit(input) {
    const at = input && input.getAttribute && input.getAttribute("data-at");
    if (!at) {
      return;
    }
    const before = this._letters[at] || "";
    if (this._locked()) {
      input.value = before;
      return;
    }
    const typed = crosswordCells(input.value);
    // the caret can sit before the old letter; drop that one, keep the new
    if (typed.length > 1 && before && typed.includes(before)) {
      typed.splice(typed.indexOf(before), 1);
    }
    const letter = typed.length ? typed[typed.length - 1] : "";
    input.value = letter;
    this._setLetter(at, letter);
    if (letter) {
      this._step(1);
    }
  }
  _onGridKey(e) {
    const at = this._at(e);
    if (!at || e.isComposing || e.ctrlKey || e.metaKey || e.altKey) {
      return;
    }
    const rtl =
      globalThis.getComputedStyle &&
      globalThis.getComputedStyle(this).direction === "rtl";
    const side = rtl ? -1 : 1;
    const word = this._layout.words[this._activeWord()];
    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        this._move(0, side);
        break;
      case "ArrowLeft":
        e.preventDefault();
        this._move(0, -side);
        break;
      case "ArrowDown":
        e.preventDefault();
        this._move(1, 0);
        break;
      case "ArrowUp":
        e.preventDefault();
        this._move(-1, 0);
        break;
      case "Home":
      case "End":
        if (word) {
          e.preventDefault();
          const cells = this._wordCells(word);
          this._focusCell(
            e.key === "Home" ? cells[0] : cells[cells.length - 1],
          );
        }
        break;
      case " ":
        e.preventDefault();
        this._toggleDirection();
        break;
      case "Backspace":
        e.preventDefault();
        if (this._locked()) {
          break;
        }
        if (this._letters[at]) {
          this._setLetter(at, "");
        } else if (this._step(-1)) {
          // an empty square: go back one and clear that
          this._setLetter(this._active, "");
        }
        break;
      case "Delete":
        e.preventDefault();
        if (!this._locked()) {
          this._setLetter(at, "");
        }
        break;
      default:
        break;
    }
  }
  _onClueClick(e) {
    const index = Number(e.currentTarget.getAttribute("data-word"));
    const word = this._layout.words[index];
    if (word) {
      this._dir = word.dir;
      this._focusCell(`${word.r},${word.c}`);
    }
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    // the value attribute is only a starting value once a field has been
    // typed in, so what each square shows is kept in step here
    if (this.shadowRoot && !this._authoring()) {
      this.shadowRoot.querySelectorAll("input[data-at]").forEach((input) => {
        const letter = this._letters[input.getAttribute("data-at")] || "";
        if (input.value !== letter) {
          input.value = letter;
        }
      });
    }
  }

  // ---------- render ----------

  renderDirections() {
    return html`<p>
      ${this._tParts(this.t.crosswordDirections, {
        checkAnswer: html`<strong>${this.t.checkAnswer}</strong>`,
      })}
    </p>`;
  }

  _statusIconWord(status) {
    if (status === "missing") {
      return { icon: "icons:remove", word: this.t.missing };
    }
    return this._resultIconWord(status === "correct");
  }

  // "1 across, letter 2 of 4; 1 down, letter 1 of 4"
  _cellLabel(cell, status) {
    const parts = ["across", "down"]
      .filter((dir) => cell[dir] !== -1)
      .map((dir) => {
        const word = this._layout.words[cell[dir]];
        return this._fill(
          dir === "across" ? this.t.cellAcross : this.t.cellDown,
          {
            number: word.number,
            position:
              (dir === "across" ? cell.c - word.c : cell.r - word.r) + 1,
            length: word.cells.length,
          },
        );
      });
    const label = parts.join("; ");
    return status ? `${label}. ${this._statusIconWord(status).word}` : label;
  }

  _renderCell(cell, activeWord, first) {
    const at = `${cell.r},${cell.c}`;
    const authoring = this._authoring();
    const status = this.showAnswer && !authoring ? this._cellStatus(cell) : "";
    const mark = status ? this._statusIconWord(status) : null;
    const inWord =
      activeWord !== -1 &&
      (cell.across === activeWord || cell.down === activeWord);
    return html`<div
      class="xw-cell ${inWord ? "xw-in-word" : ""}"
      data-status="${status || nothing}"
    >
      ${
        cell.number
          ? html`<span class="xw-num" aria-hidden="true">${cell.number}</span>`
          : nothing
      }
      ${
        authoring
          ? html`<span class="xw-key">${cell.ch}</span>`
          : html`<input
              type="text"
              data-at="${at}"
              aria-label="${this._cellLabel(cell, status)}"
              aria-invalid="${status === "incorrect" ? "true" : "false"}"
              title="${mark ? mark.word : nothing}"
              value="${this._letters[at] || ""}"
              tabindex="${(this._active ? this._active === at : first) ? "0" : "-1"}"
              inputmode="text"
              enterkeyhint="next"
              autocapitalize="characters"
              autocomplete="off"
              autocorrect="off"
              spellcheck="false"
              ?readonly="${this._locked()}"
            />`
      }
      ${
        mark
          ? html`<simple-icon-lite
              class="xw-mark"
              icon="${mark.icon}"
              aria-hidden="true"
            ></simple-icon-lite>`
          : nothing
      }
    </div>`;
  }

  _renderGrid(activeWord) {
    const { rows, cols } = this._layout;
    const squares = [];
    let first = true;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = this._cellMap.get(`${r},${c}`);
        if (cell) {
          squares.push(this._renderCell(cell, activeWord, first));
          first = false;
        } else {
          squares.push(html`<div class="xw-blk" aria-hidden="true"></div>`);
        }
      }
    }
    return html`<div class="xw-scroll">
      <div
        class="xw-grid"
        role="group"
        aria-label="${this.t.gridLabel}"
        style="--xw-cols: ${cols}"
        @focusin="${this._onGridFocus}"
        @pointerdown="${this._onGridPointerDown}"
        @click="${this._onGridClick}"
        @input="${this._onGridInput}"
        @compositionend="${this._onGridCompositionEnd}"
        @keydown="${this._onGridKey}"
      >
        ${squares}
      </div>
    </div>`;
  }

  _renderClues(dir, activeWord) {
    const authoring = this._authoring();
    const words = this._layout.words
      .map((word, index) => ({ word, index }))
      .filter((entry) => entry.word.dir === dir);
    if (!words.length) {
      return nothing;
    }
    return html`<div class="xw-clue-list">
      <h4 id="xw-${dir}">${dir === "across" ? this.t.across : this.t.down}</h4>
      <ul aria-labelledby="xw-${dir}">
        ${words.map(({ word, index }) => {
          const text = html`<span class="xw-clue-num">${word.number}.</span>
            <span class="xw-clue-text"
              >${word.clue}
              <span class="xw-clue-len">(${word.cells.length})</span></span
            >`;
          if (authoring) {
            return html`<li class="xw-clue">
              ${text}<span class="xw-clue-answer">${word.text}</span>
            </li>`;
          }
          return html`<li>
            <button
              type="button"
              class="xw-clue"
              data-word="${index}"
              aria-current="${index === activeWord ? "true" : nothing}"
              @click="${this._onClueClick}"
            >
              ${text}${
                this.showAnswer
                  ? this.renderOptionStatus(this._wordCorrect(word))
                  : nothing
              }
            </button>
          </li>`;
        })}
      </ul>
    </div>`;
  }

  _renderUnplaced() {
    const reasons = {
      empty: this.t.reasonEmpty,
      short: this._fill(this.t.reasonShort, { min: CROSSWORD_MIN_LENGTH }),
      long: this._fill(this.t.reasonLong, { max: CROSSWORD_MAX_LENGTH }),
      duplicate: this.t.reasonDuplicate,
      limit: this._fill(this.t.reasonLimit, { max: CROSSWORD_MAX_WORDS }),
      nofit: this.t.reasonNofit,
    };
    return html`<div class="xw-unplaced" role="note">
      <p class="xw-unplaced-heading">
        <simple-icon-lite
          icon="icons:warning"
          aria-hidden="true"
        ></simple-icon-lite
        >${this.t.unplacedHeading}
      </p>
      <p>${this.t.unplacedHelp}</p>
      <ul>
        ${this._layout.unplaced.map(
          (item) =>
            html`<li>
              <strong>${item.word || `#${item.index + 1}`}</strong>
              ${reasons[item.reason]}
            </li>`,
        )}
      </ul>
    </div>`;
  }

  renderInteraction() {
    const authoring = this._authoring();
    const layout = this._layout;
    const unplaced =
      authoring && layout.unplaced.length ? this._renderUnplaced() : nothing;
    if (!layout.words.length) {
      return html`<p class="xw-note">
          ${authoring ? this.t.addWords : this.t.noWords}
        </p>
        ${unplaced}`;
    }
    const activeWord = authoring ? -1 : this._activeWord();
    const word = layout.words[activeWord];
    return html`<div class="xw-board">
        <div class="xw-main">
          ${
            authoring
              ? html`<p class="xw-note">${this.t.answerKey}</p>`
              : html`<p class="xw-active" aria-live="polite" aria-atomic="true">
                  ${
                    word
                      ? html`<strong
                            >${this._fill(
                              word.dir === "across"
                                ? this.t.activeAcross
                                : this.t.activeDown,
                              { number: word.number },
                            )}</strong
                          >
                          ${word.clue} (${word.cells.length})`
                      : this.t.startHint
                  }
                </p>`
          }
          ${this._renderGrid(activeWord)}
        </div>
        <div class="xw-clues">
          ${this._renderClues("across", activeWord)}
          ${this._renderClues("down", activeWord)}
        </div>
      </div>
      ${unplaced}`;
  }

  static get styles() {
    return [
      super.styles,
      DDDAccentStyles,
      css`
        :host {
          /* accent priority: accent-color on the element, then the
             palette (data-palette), then the DDD default */
          --crossword-puzzle-tint: var(
            --ddd-accent-color-tint,
            var(
              --ddd-palette-tint,
              light-dark(
                var(--ddd-theme-default-skyMaxLight),
                color-mix(
                  in srgb,
                  var(--ddd-theme-default-pughBlue) 22%,
                  var(--ddd-theme-default-potentialMidnight)
                )
              )
            )
          );
          --crossword-puzzle-line: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneGray)
          );
        }
        :host([accent-color]) {
          --ddd-block-chip-background: var(--ddd-accent-color);
          --ddd-block-chip-color: var(--ddd-accent-color-ink);
        }
        /* the base turns the chip navy while the question has focus; with
           an accent the chip keeps it, so its ink always has contrast */
        :host([accent-color]) .shell:focus-within .ddd-block-chip {
          background-color: var(
            --ddd-accent-color,
            var(--ddd-status-answered-signal)
          );
        }
        :host([accent-color]) .shell simple-toolbar-button:not([disabled]) {
          background-color: var(
            --ddd-accent-color,
            var(
              --ddd-palette-accent,
              light-dark(
                var(--ddd-theme-default-nittanyNavy),
                var(--ddd-theme-default-linkLight)
              )
            )
          );
          color: var(
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
        .xw-board {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          gap: var(--ddd-spacing-4) var(--ddd-spacing-6);
          min-width: 0;
        }
        .xw-main {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-2);
          flex: 0 1 auto;
          min-width: 0;
          max-width: 100%;
        }
        .xw-clues {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-3);
          flex: 1 1 calc(var(--ddd-spacing-30) * 2);
          min-width: 0;
        }
        .xw-active,
        .xw-note {
          margin: var(--ddd-spacing-0);
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-140);
          color: var(--ddd-status-default-ink);
        }
        .xw-active {
          min-height: calc(var(--ddd-font-size-4xs) * 1.4);
          padding-block: var(--ddd-spacing-1);
          padding-inline: var(--ddd-spacing-2);
          border-radius: var(--ddd-radius-xs);
          background-color: var(--crossword-puzzle-tint);
        }
        /* a grid too wide for the page scrolls here, never the page */
        .xw-scroll {
          max-width: 100%;
          overflow-x: auto;
          padding: var(--ddd-spacing-1);
        }
        .xw-grid {
          display: grid;
          grid-template-columns: repeat(
            var(--xw-cols),
            minmax(var(--ddd-spacing-6), var(--ddd-spacing-10))
          );
          gap: var(--ddd-spacing-1);
          width: calc(
            var(--xw-cols) * var(--ddd-spacing-10) + (var(--xw-cols) - 1) *
              var(--ddd-spacing-1)
          );
          max-width: 100%;
          min-width: calc(
            var(--xw-cols) * var(--ddd-spacing-6) + (var(--xw-cols) - 1) *
              var(--ddd-spacing-1)
          );
        }
        .xw-cell,
        .xw-blk {
          position: relative;
          aspect-ratio: 1;
          min-width: var(--ddd-spacing-6);
          border-radius: var(--ddd-radius-xs);
          container-type: inline-size;
        }
        .xw-blk {
          background-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            color-mix(
              in srgb,
              var(--ddd-theme-default-slateGray) 40%,
              var(--ddd-theme-default-potentialMidnight)
            )
          );
        }
        .xw-cell input,
        .xw-key {
          box-sizing: border-box;
          display: block;
          width: 100%;
          height: 100%;
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-0);
          border: var(--ddd-border-xs);
          border-color: var(--crossword-puzzle-line);
          border-radius: var(--ddd-radius-xs);
          background-color: var(--ddd-status-default-bg);
          color: var(--ddd-status-default-ink);
          font-family: var(--ddd-font-navigation);
          font-size: clamp(
            var(--ddd-font-size-5xs),
            50cqi,
            var(--ddd-font-size-xs)
          );
          font-weight: var(--ddd-font-weight-bold);
          line-height: 1;
          text-align: center;
          text-transform: uppercase;
        }
        .xw-key {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .xw-cell.xw-in-word input {
          background-color: var(--crossword-puzzle-tint);
        }
        .xw-cell input:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
          position: relative;
          z-index: 1;
        }
        .xw-num {
          position: absolute;
          z-index: 2;
          top: 6cqi;
          inset-inline-start: 10cqi;
          font-family: var(--ddd-font-navigation);
          font-size: clamp(
            calc(var(--ddd-font-size-6xs) * 0.7),
            26cqi,
            var(--ddd-font-size-6xs)
          );
          line-height: 1;
          color: var(--ddd-status-default-ink);
          pointer-events: none;
        }
        /* checked squares: the status line, colour and icon; the word is
           in the title and the accessible name */
        .xw-cell[data-status] input {
          border-width: var(--ddd-border-size-sm);
        }
        .xw-cell[data-status="correct"] {
          --_xw-signal: var(--ddd-status-correct-signal);
          --_xw-ink: var(--ddd-status-correct-ink);
          --_xw-line: var(--ddd-status-correct-line);
        }
        .xw-cell[data-status="incorrect"] {
          --_xw-signal: var(--ddd-status-incorrect-signal);
          --_xw-ink: var(--ddd-status-incorrect-ink);
          --_xw-line: var(--ddd-status-incorrect-line);
        }
        .xw-cell[data-status="missing"] {
          --_xw-signal: var(--ddd-status-missing-signal);
          --_xw-ink: var(--ddd-status-missing-ink);
          --_xw-line: var(--ddd-status-missing-line);
        }
        .xw-cell[data-status] input {
          border-style: var(--_xw-line);
          border-color: var(--_xw-signal);
          color: var(--_xw-ink);
        }
        .xw-mark {
          position: absolute;
          z-index: 2;
          top: 4cqi;
          inset-inline-end: 4cqi;
          color: var(--_xw-ink);
          --simple-icon-color: currentColor;
          --simple-icon-width: clamp(
            calc(var(--ddd-icon-4xs) * 0.55),
            36cqi,
            var(--ddd-icon-4xs)
          );
          --simple-icon-height: clamp(
            calc(var(--ddd-icon-4xs) * 0.55),
            36cqi,
            var(--ddd-icon-4xs)
          );
          pointer-events: none;
        }
        .xw-clue-list h4 {
          margin: var(--ddd-spacing-0) var(--ddd-spacing-0) var(--ddd-spacing-1);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          letter-spacing: var(--ddd-ls-16-sm);
          text-transform: uppercase;
        }
        .xw-clue-list ul {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-1);
        }
        :host .xw-clue {
          display: flex;
          align-items: baseline;
          gap: var(--ddd-spacing-2);
          box-sizing: border-box;
          width: 100%;
          min-height: var(--ddd-control-height-xs);
          margin: var(--ddd-spacing-0);
          padding-block: var(--ddd-spacing-1);
          padding-inline: var(--ddd-spacing-2);
          border: var(--ddd-border-xs);
          border-color: transparent;
          border-radius: var(--ddd-radius-sm);
          background-color: transparent;
          color: var(--ddd-status-default-ink);
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-140);
          text-align: start;
        }
        :host button.xw-clue {
          cursor: pointer;
        }
        :host button.xw-clue:hover {
          border-color: var(--crossword-puzzle-line);
        }
        :host button.xw-clue[aria-current="true"] {
          background-color: var(--crossword-puzzle-tint);
          font-weight: var(--ddd-font-weight-bold);
        }
        :host button.xw-clue:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        .xw-clue-num {
          flex: none;
          font-family: var(--ddd-font-navigation);
          font-weight: var(--ddd-font-weight-bold);
        }
        .xw-clue-text {
          flex: 1 1 auto;
          min-width: 0;
          overflow-wrap: anywhere;
        }
        .xw-clue-len {
          white-space: nowrap;
        }
        .xw-clue-answer {
          flex: none;
          font-family: var(--ddd-font-navigation);
          font-weight: var(--ddd-font-weight-bold);
          letter-spacing: var(--ddd-ls-16-sm);
        }
        .xw-clue .option-status {
          flex: none;
          margin-inline-start: auto;
        }
        .xw-unplaced {
          padding: var(--ddd-spacing-3);
          border: var(--ddd-border-sm);
          border-style: dashed;
          border-color: var(--crossword-puzzle-line);
          border-radius: var(--ddd-radius-sm);
          background-color: var(--ddd-status-answered-bg);
          color: var(--ddd-status-default-ink);
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-140);
        }
        .xw-unplaced p {
          margin: var(--ddd-spacing-0) var(--ddd-spacing-0) var(--ddd-spacing-2);
        }
        .xw-unplaced-heading {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          font-weight: var(--ddd-font-weight-bold);
          --simple-icon-width: var(--ddd-icon-3xs);
          --simple-icon-height: var(--ddd-icon-3xs);
        }
        .xw-unplaced ul {
          list-style: disc;
          padding-inline-start: var(--ddd-spacing-6);
        }
      `,
    ];
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(CrosswordPuzzle.tag, CrosswordPuzzle);
