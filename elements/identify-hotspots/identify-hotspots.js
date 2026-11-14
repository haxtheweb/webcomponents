/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css, nothing } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import {
  QuestionElement,
  choiceResponse,
  XAPI_ITEM_DELIMITER,
} from "@haxtheweb/multiple-choice/lib/QuestionElement.js";
import {
  clampNumber,
  normalizeRegion,
  regionContains,
  safeImageSrc,
} from "./lib/hotspot-regions.js";

// crosshair steps, in percent of the image
const STEP = 2;
const BIG_STEP = 10;
const round1 = (n) => Math.round(n * 10) / 10;

/**
 * `identify-hotspots`
 * The learner finds the right spots on an image: the assessed counterpart
 * to an informational image map. Every answer is a named region (an ellipse
 * inside a box given in percent of the image) that is either a hotspot to
 * find or a named decoy. A click, tap or keyboard probe on a hotspot not
 * found yet marks it found; anything else is a miss.
 *
 * Keyboard: the picture is one tab stop. The arrow keys move a crosshair
 * (Shift for bigger steps) and Enter or Space probes where it sits, so
 * hidden hotspots never have to be tab stops.
 *
 * Answers are light DOM inputs, read once and removed like every question:
 * `<input value="Name" data-correct="true" data-x="25" data-y="50"
 * data-width="12" data-height="14" />`
 *
 * @demo demo/index.html
 * @element identify-hotspots
 * @fires user-engagement - when an attempt ends. detail: { activityDisplay
 *   ("answered"), objectName, resultSuccess, statement (xAPI) }
 */
export class IdentifyHotspots extends QuestionElement {
  static get tag() {
    return "identify-hotspots";
  }
  /**
   * xAPI statements this element sends (see scripts/generate-xapi-vocabulary.mjs)
   */
  static get xapiVocabulary() {
    return {
      tag: "identify-hotspots",
      event: "user-engagement",
      verbs: ["answered"],
      objectType: "http://adlnet.gov/expapi/activities/cmi.interaction",
      interactionType: "choice",
      definition: [
        "name",
        "interactionType",
        "choices",
        "correctResponsesPattern",
      ],
      response: "ids of the hotspots the learner found joined by [,]",
      result: [
        "success",
        "completion",
        "response",
        "score",
        "extensions.attempts",
        "extensions.max-attempts",
      ],
      countsTowardCompletion: true,
      done: "every hotspot found, or out of attempts",
    };
  }

  constructor() {
    super();
    this.t = {
      ...this.t,
      questionType: "Hotspots",
      hotspotDirections:
        "Select each spot in the picture that answers the question. There are {total} to find.",
      keyboardDirections:
        "Keyboard: move to the picture, move the crosshair with the arrow keys (hold Shift for bigger steps), then press Enter or Space to choose that spot.",
      missLimitDirections: "You can miss {max} times before the attempt ends.",
      noMissLimitDirections:
        "Misses are not limited. Press {finish} when you are done looking.",
      stageLabel: "Picture to search",
      stageKeys:
        "Use the arrow keys to move the crosshair, Shift for bigger steps, and Enter or Space to choose that spot.",
      foundCount: "{found} of {total} found",
      found: "Found",
      miss: "Miss",
      revealed: "Revealed",
      missNothing: "Nothing to find at {x}% across, {y}% down.",
      missDecoy: "{name} is not one to find.",
      missAgain: "{name} was already found.",
      lastMiss: "That was the last miss allowed.",
      missesOf: "Misses: {count} of {max}",
      missesCount: "Misses: {count}",
      showMissed: "Show what I missed",
      revealedNote: "Dashed outlines show what you missed: {names}.",
      finish: "Finish",
      hotspot: "Hotspot",
      decoy: "Decoy",
      noImage: "Add an image to this block.",
      noHotspots: "Add at least one hotspot to find in the settings.",
      editHint:
        "Outlines show where each answer sits on the picture. Change the numbers in the settings to move or resize one.",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("./locales/", import.meta.url).href,
    });
    this.question = "";
    this.src = "";
    this.alt = "";
    this.mediaTitle = "";
    this.maxMisses = 4;
    this.guessDataValue = "_found";
    this._found = [];
    this._misses = [];
    this._revealed = false;
    this._note = null;
    this._cross = { x: 50, y: 50 };
    this._crossOn = false;
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * Address of the image learners search
       */
      src: { type: String },
      /**
       * Text alternative of the image; never shown as its title
       */
      alt: { type: String },
      /**
       * Visible title of the image
       */
      mediaTitle: { type: String, attribute: "media-title" },
      /**
       * Misses allowed before the attempt ends; 0 means unlimited
       */
      maxMisses: { type: Number, attribute: "max-misses", reflect: true },
      _found: { type: Array, state: true },
      _misses: { type: Array, state: true },
      _revealed: { type: Boolean, state: true },
      _note: { type: Object, state: true },
      _cross: { type: Object, state: true },
      _crossOn: { type: Boolean, state: true },
    };
  }

  // ---------- answer key ----------

  answerPrototype() {
    return {
      ...super.answerPrototype(),
      correct: true,
      x: 40,
      y: 40,
      width: 20,
      height: 20,
    };
  }
  // numbers typed into the HAX form arrive as text; keep them inside the image
  cleanAnswerDataBeforeSend(answer, _index, _answers) {
    return { ...answer, ...normalizeRegion(answer) };
  }
  processInput(index, inputs, answers) {
    const out = super.processInput(index, inputs, answers);
    const input = inputs[index];
    const get =
      input && typeof input.getAttribute === "function"
        ? (name) => input.getAttribute(`data-${name}`)
        : (name) => (input ? input[name] : undefined);
    ["x", "y", "width", "height"].forEach((name) => {
      out[name] = get(name);
    });
    return { ...out, ...normalizeRegion(out) };
  }
  async haxpreProcessNodeToContent(node) {
    const regions = (node.answers || []).filter(Boolean);
    node = await super.haxpreProcessNodeToContent(node);
    const inputs = Array.from(node.querySelectorAll("input:not([slot])"));
    inputs.forEach((input, i) => {
      const r = normalizeRegion(regions[i]);
      ["x", "y", "width", "height"].forEach((name) => {
        input.setAttribute(`data-${name}`, String(r[name]));
      });
    });
    return node;
  }

  // every authored answer with its component id and shape, in authored order
  _regions() {
    const answers = this.answers || [];
    return this.xapiComponents(answers).map((c, i) => ({
      id: c.id,
      name: c.description,
      ...normalizeRegion(answers[i]),
    }));
  }
  _hotspots() {
    return this._regions().filter((r) => r.correct);
  }
  // ids of the hotspots found, in the order found; stale ids never count
  _foundIds() {
    const ids = this._hotspots().map((r) => r.id);
    return (this._found || []).filter((id) => ids.includes(id));
  }
  _unfound() {
    const found = this._foundIds();
    return this._hotspots().filter((r) => !found.includes(r.id));
  }

  // ---------- learner answer ----------

  getGuess() {
    return this._foundIds();
  }
  guessCount() {
    return this._foundIds().length + this._misses.length;
  }
  isCorrect() {
    const total = this._hotspots().length;
    return total > 0 && this._foundIds().length === total;
  }
  resetAnswer(e) {
    this._clearProbes();
    super.resetAnswer(e);
  }
  _clearProbes() {
    this._found = [];
    this._misses = [];
    this._revealed = false;
    this._note = null;
    this._crossOn = false;
  }
  // the author is working on the block (HAX editing or the feedback view)
  _authoring() {
    return Boolean(this._haxstate || this.edit);
  }
  // nothing can be probed: the attempt is over, or there is nothing to find
  _locked() {
    return (
      this.showAnswer ||
      this.disabled ||
      this._authoring() ||
      this.attemptsExhausted() ||
      this._hotspots().length === 0 ||
      !safeImageSrc(this.src)
    );
  }
  _fill(str, parts) {
    return String(str || "").replace(/\{(\w+)\}/g, (m, k) =>
      k in parts ? String(parts[k]) : m,
    );
  }

  /**
   * Probe the picture at a point, as a click or the crosshair does. A
   * hotspot not found yet is marked found; anything else is a miss. Finding
   * the last hotspot or using the last miss ends the attempt.
   * @param {number} x percent across the image (0 to 100)
   * @param {number} y percent down the image (0 to 100)
   * @returns {Promise<void>} resolved once an attempt this probe ended has
   *   been checked
   */
  probe(x, y) {
    if (this._locked()) {
      return Promise.resolve();
    }
    const px = clampNumber(x, 0, 100, 50);
    const py = clampNumber(y, 0, 100, 50);
    const found = this._foundIds();
    const here = this._regions().filter((r) => regionContains(r, px, py));
    const hit = here.find((r) => r.correct && !found.includes(r.id));
    this._cross = { x: px, y: py };
    let note;
    if (hit) {
      this._found = [...found, hit.id];
      note = { kind: "correct", text: `${hit.name}.` };
    } else {
      this._misses = [...this._misses, { x: round1(px), y: round1(py) }];
      const again = here.find((r) => r.correct);
      let text;
      if (again) {
        text = this._fill(this.t.missAgain, { name: again.name });
      } else if (here.length) {
        text = this._fill(this.t.missDecoy, { name: here[0].name });
      } else {
        text = this._fill(this.t.missNothing, {
          x: Math.round(px),
          y: Math.round(py),
        });
      }
      note = { kind: "incorrect", text };
    }
    const max = Number(this.maxMisses) || 0;
    const out = max > 0 && this._misses.length >= max;
    const done = this.isCorrect();
    if (out && !done) {
      note.text = `${note.text} ${this.t.lastMiss}`;
    }
    this._note = note;
    return done || out ? this.checkAnswer() : Promise.resolve();
  }

  _onStageClick(e) {
    if (this._locked()) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      return;
    }
    // a pointer is aiming now, so the keyboard crosshair steps aside
    this._crossOn = false;
    this.probe(
      ((e.clientX - rect.left) / rect.width) * 100,
      ((e.clientY - rect.top) / rect.height) * 100,
    );
  }
  _onStageKey(e) {
    if (this._locked()) {
      return;
    }
    const step = e.shiftKey ? BIG_STEP : STEP;
    const moves = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this._crossOn = true;
      this.probe(this._cross.x, this._cross.y);
    } else if (moves[e.key]) {
      e.preventDefault();
      this._crossOn = true;
      this._cross = {
        x: clampNumber(this._cross.x + moves[e.key][0], 0, 100, 50),
        y: clampNumber(this._cross.y + moves[e.key][1], 0, 100, 50),
      };
    }
  }
  _onStageBlur() {
    this._crossOn = false;
  }
  // show the hotspots the learner did not find, as revealed (never as wrong)
  async _reveal() {
    const names = this._unfound().map((r) => r.name);
    this._revealed = true;
    this._note = {
      kind: "revealed",
      text: this._fill(this.t.revealedNote, { names: names.join(", ") }),
    };
    // the button that had focus is gone; keep keyboard users in the block
    await this.updateComplete;
    const root = this.shadowRoot;
    const reset = root && root.querySelector("#reset:not([hidden])");
    const target = reset || (root && root.querySelector("#feedback"));
    if (target) {
      target.focus();
    }
  }

  // ---------- xAPI ----------
  // a choice interaction: every region (hotspots and decoys) is a choice,
  // the pattern is the hotspots, the response the hotspots found. The base
  // class builds the definition from the answers; only the response and the
  // score differ.

  learnerResponse() {
    const found = this._foundIds();
    return choiceResponse(
      this._hotspots()
        .filter((r) => found.includes(r.id))
        .map((r) => r.id),
    );
  }
  learnerScore(_correct) {
    return {
      raw: this._foundIds().length,
      max: Math.max(1, this._hotspots().length),
    };
  }
  _canRestoreGuess() {
    return true;
  }
  // put back the hotspots found on an earlier visit; ids that are no longer
  // hotspots are ignored. Where the misses were is not part of the record.
  restoreLearnerResponse(response) {
    if (typeof response !== "string" || !response) {
      return false;
    }
    const tokens = response.split(XAPI_ITEM_DELIMITER);
    const found = this._hotspots()
      .filter((r) => tokens.includes(r.id))
      .map((r) => r.id);
    this._found = found;
    this._misses = [];
    this._revealed = false;
    this._note = null;
    return found.length > 0;
  }
  forgetLearnerResponse() {
    this._clearProbes();
  }

  // ---------- HAX ----------

  haxeditModeChanged(value) {
    super.haxeditModeChanged(value);
    // a learner's marks never reach authoring
    if (value) {
      this._clearProbes();
      this.showAnswer = false;
    }
    this.requestUpdate();
  }
  haxactiveElementChanged(element, value) {
    super.haxactiveElementChanged(element, value);
    this.requestUpdate();
  }

  // ---------- render ----------

  renderDirections() {
    const max = Number(this.maxMisses) || 0;
    return html`<p>
        ${this._fill(this.t.hotspotDirections, {
          total: this._hotspots().length,
        })}
      </p>
      <p>${this.t.keyboardDirections}</p>
      <p>
        ${
          max > 0
            ? this._fill(this.t.missLimitDirections, { max })
            : this._tParts(this.t.noMissLimitDirections, {
                finish: html`<strong>${this.t.finish}</strong>`,
              })
        }
      </p>`;
  }

  _box(r) {
    return `left:${r.x}%;top:${r.y}%;width:${r.width}%;height:${r.height}%`;
  }
  _center(r) {
    return `left:${r.x + r.width / 2}%;top:${r.y + r.height / 2}%`;
  }

  _renderMarks(authoring, locked) {
    const found = this._foundIds();
    return html`<div class="hs-marks" aria-hidden="true">
      ${this._regions().map((r) => {
        const order = found.indexOf(r.id);
        let state = "";
        if (authoring) {
          state = r.correct ? "key" : "decoy";
        } else if (order !== -1) {
          state = "found";
        } else if (this._revealed && r.correct) {
          state = "revealed";
        }
        if (!state) {
          return nothing;
        }
        let badge;
        if (state === "found") {
          badge = html`<simple-icon-lite icon="icons:check"></simple-icon-lite
            >${order + 1}`;
        } else if (state === "revealed") {
          badge = html`<simple-icon-lite
            icon="icons:visibility"
          ></simple-icon-lite>`;
        } else {
          badge = html`${r.name}
            <small>${state === "key" ? this.t.hotspot : this.t.decoy}</small>`;
        }
        return html`<div
            class="hs-region"
            data-state="${state}"
            style="${this._box(r)}"
          ></div>
          <div
            class="hs-badge"
            data-state="${state}"
            style="${this._center(r)}"
          >
            ${badge}
          </div>`;
      })}
      ${this._misses.map(
        (m) =>
          html`<div class="hs-miss" style="left:${m.x}%;top:${m.y}%">
            <simple-icon-lite icon="icons:close"></simple-icon-lite>
          </div>`,
      )}
      ${
        locked
          ? nothing
          : html`<div
              class="hs-cross"
              style="left:${this._cross.x}%;top:${this._cross.y}%"
            ></div>`
      }
    </div>`;
  }

  _renderNote() {
    const note = this._note;
    const words = {
      correct: { icon: "icons:check", word: this.t.found },
      incorrect: { icon: "icons:close", word: this.t.miss },
      revealed: { icon: "icons:visibility", word: this.t.revealed },
    };
    const w = note ? words[note.kind] : null;
    return html`<div
      class="hs-note"
      id="hs-note"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      data-kind="${note ? note.kind : "none"}"
    >
      ${
        w
          ? html`<span class="hs-chip" aria-hidden="true"
                ><simple-icon-lite icon="${w.icon}"></simple-icon-lite></span
              ><span
                ><strong class="hs-word">${w.word}:</strong> ${note.text}</span
              >`
          : nothing
      }
    </div>`;
  }

  // what is found and what was revealed, in words under the picture
  _renderResults() {
    const found = this._foundIds();
    const regions = this._hotspots();
    const rows = found
      .map((id, i) => ({
        state: "found",
        icon: "icons:check",
        word: this.t.found,
        n: i + 1,
        region: regions.find((r) => r.id === id),
      }))
      .concat(
        this._revealed
          ? this._unfound().map((region) => ({
              state: "revealed",
              icon: "icons:visibility",
              word: this.t.revealed,
              n: "",
              region,
            }))
          : [],
      );
    if (!rows.length) {
      return nothing;
    }
    return html`<ul class="hs-results">
      ${rows.map(
        (row) =>
          html`<li data-state="${row.state}">
            <span class="hs-chip" aria-hidden="true"
              ><simple-icon-lite icon="${row.icon}"></simple-icon-lite
              >${row.n}</span
            ><span
              ><strong class="hs-word">${row.word}:</strong> ${
                row.region.name
              }</span
            >
          </li>`,
      )}
    </ul>`;
  }

  renderInteraction() {
    const src = safeImageSrc(this.src);
    const authoring = this._authoring();
    const locked = this._locked();
    const max = Number(this.maxMisses) || 0;
    if (!src) {
      return authoring
        ? html`<p class="hs-hint">${this.t.noImage}</p>`
        : nothing;
    }
    const titled = Boolean(this.mediaTitle);
    return html`<div
      class="hs-figure"
      role="${ifDefined(titled ? "group" : undefined)}"
      aria-labelledby="${ifDefined(titled ? "hs-title" : undefined)}"
    >
      ${
        titled
          ? html`<div class="hs-title" id="hs-title">${this.mediaTitle}</div>`
          : nothing
      }
      ${
        authoring
          ? html`<p class="hs-hint">
              ${this._hotspots().length ? this.t.editHint : this.t.noHotspots}
            </p>`
          : nothing
      }
      <div
        class="hs-stage ${this._crossOn ? "hs-cross-on" : ""}"
        id="stage"
        ?data-live="${!locked}"
        role="${ifDefined(locked ? undefined : "application")}"
        tabindex="${ifDefined(locked ? undefined : "0")}"
        aria-labelledby="${ifDefined(!locked && titled ? "hs-title" : undefined)}"
        aria-label="${ifDefined(
          !locked && !titled ? this.t.stageLabel : undefined,
        )}"
        aria-describedby="${ifDefined(locked ? undefined : "hs-img hs-keys")}"
        @click="${this._onStageClick}"
        @keydown="${this._onStageKey}"
        @blur="${this._onStageBlur}"
      >
        <img
          id="hs-img"
          src="${src}"
          alt="${this.alt || ""}"
          draggable="false"
        />
        ${this._renderMarks(authoring, locked)}
      </div>
      <span id="hs-keys" class="sr-only">${this.t.stageKeys}</span>
      ${
        authoring
          ? nothing
          : html`<div class="hs-meta">
                ${this._renderNote()}
                <span class="hs-misses"
                  ><span class="hs-count"
                    >${this._fill(this.t.foundCount, {
                      found: this._foundIds().length,
                      total: this._hotspots().length,
                    })}</span
                  >
                  ${
                    max > 0
                      ? this._fill(this.t.missesOf, {
                          count: this._misses.length,
                          max,
                        })
                      : this._fill(this.t.missesCount, {
                          count: this._misses.length,
                        })
                  }</span
                >
              </div>
              ${this._renderResults()}`
      }
    </div>`;
  }

  // probing is the answer, so there is no check button unless misses are
  // unlimited; when an attempt ends short the learner can ask to see the rest
  renderButtons() {
    if (this._authoring()) {
      return nothing;
    }
    const max = Number(this.maxMisses) || 0;
    const canReveal =
      this.showAnswer && !this._revealed && this._unfound().length > 0;
    return html`<div id="buttons">
      ${
        canReveal
          ? html`<simple-toolbar-button
              id="reveal"
              @click="${this._reveal}"
              label="${this.t.showMissed}"
            ></simple-toolbar-button>`
          : nothing
      }
      ${
        max > 0
          ? nothing
          : html`<simple-toolbar-button
              id="check"
              ?hidden="${this.showAnswer}"
              ?disabled="${
                this.disabled || !this.inactiveCase() || this._locked()
              }"
              @click="${this.checkAnswer}"
              label="${this.t.finish}"
            ></simple-toolbar-button>`
      }
      <simple-toolbar-button
        id="reset"
        ?hidden="${!this.showAnswer || this.attemptsExhausted()}"
        ?disabled="${this.disabled}"
        @click="${this.resetAnswer}"
        label="${this.t.tryAgain}"
      ></simple-toolbar-button>
    </div>`;
  }

  renderFeedback() {
    if (this.edit || !this.showAnswer) {
      return super.renderFeedback();
    }
    const max = Number(this.maxMisses) || 0;
    return html`<p class="feedback">
        ${this._fill(this.t.foundCount, {
          found: this._foundIds().length,
          total: this._hotspots().length,
        })}.
        ${
          max > 0
            ? this._fill(this.t.missesOf, { count: this._misses.length, max })
            : this._fill(this.t.missesCount, { count: this._misses.length })
        }.
      </p>
      ${super.renderFeedback()}`;
  }

  static get styles() {
    return [
      super.styles,
      css`
        .hs-figure {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-2);
          min-width: 0;
        }
        .hs-title {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          color: var(--ddd-status-default-ink);
        }
        .hs-hint {
          font-size: var(--ddd-font-size-4xs);
          color: var(--ddd-status-default-ink);
        }
        .hs-stage {
          position: relative;
          display: block;
          width: 100%;
          max-width: var(--identify-hotspots-image-max-width, 100%);
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }
        .hs-stage[data-live] {
          cursor: crosshair;
        }
        .hs-stage:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        /* beats the answer image size the question base class sets */
        :host .hs-stage img {
          display: block;
          width: 100%;
          max-width: none;
          height: auto;
          border-radius: var(--ddd-radius-sm);
          user-select: none;
        }
        .hs-marks {
          position: absolute;
          inset: var(--ddd-spacing-0);
          pointer-events: none;
          line-height: var(--ddd-lh-120);
        }
        /* the outline of a region: the line style is the texture that
           tells the states apart without colour */
        .hs-region {
          position: absolute;
          box-sizing: border-box;
          border-radius: var(--ddd-radius-circle);
          border: var(--ddd-border-size-md) var(--_hs-line) var(--_hs-signal);
          box-shadow:
            0 0 0 var(--ddd-border-size-xs) var(--ddd-status-default-bg),
            inset 0 0 0 var(--ddd-border-size-xs) var(--ddd-status-default-bg);
        }
        :is(.hs-region, .hs-badge, .hs-results li)[data-state="found"],
        .hs-note[data-kind="correct"] {
          --_hs-line: var(--ddd-status-correct-line);
          --_hs-signal: var(--ddd-status-correct-signal);
        }
        :is(.hs-region, .hs-badge, .hs-results li)[data-state="revealed"],
        .hs-note[data-kind="revealed"] {
          --_hs-line: var(--ddd-status-revealed-line);
          --_hs-signal: var(--ddd-status-revealed-signal);
        }
        .hs-miss,
        .hs-note[data-kind="incorrect"] {
          --_hs-line: var(--ddd-status-incorrect-line);
          --_hs-signal: var(--ddd-status-incorrect-signal);
        }
        /* the answer key an author sees: hotspots solid, decoys dashed,
           each with its name and kind in words */
        :is(.hs-region, .hs-badge)[data-state="key"] {
          --_hs-line: var(--ddd-status-answered-line);
          --_hs-signal: var(--ddd-status-answered-signal);
        }
        :is(.hs-region, .hs-badge)[data-state="decoy"] {
          --_hs-line: var(--ddd-status-disabled-line);
          --_hs-signal: var(--ddd-status-answered-signal);
        }
        .hs-badge,
        .hs-miss {
          position: absolute;
          transform: translate(-50%, -50%);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          min-width: var(--ddd-icon-xxs);
          min-height: var(--ddd-icon-xxs);
          border-radius: var(--ddd-radius-rounded);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          --simple-icon-width: var(--ddd-icon-4xs);
          --simple-icon-height: var(--ddd-icon-4xs);
        }
        .hs-badge[data-state="found"] {
          padding-inline: var(--ddd-spacing-1);
          background-color: var(--ddd-status-correct-signal);
          color: var(--ddd-status-default-bg);
          border: var(--ddd-border-size-sm) solid var(--ddd-status-default-bg);
        }
        .hs-badge[data-state="revealed"],
        .hs-miss {
          background-color: var(--ddd-status-default-bg);
          border: var(--ddd-border-size-sm) var(--_hs-line) var(--_hs-signal);
        }
        /* the ink of each state, for the marks, chips and status words */
        .hs-badge[data-state="revealed"],
        .hs-results li[data-state="revealed"] :is(.hs-chip, .hs-word),
        .hs-note[data-kind="revealed"] :is(.hs-chip, .hs-word) {
          color: var(--ddd-status-revealed-ink);
        }
        .hs-miss,
        .hs-note[data-kind="incorrect"] :is(.hs-chip, .hs-word) {
          color: var(--ddd-status-incorrect-ink);
        }
        .hs-results li[data-state="found"] :is(.hs-chip, .hs-word),
        .hs-note[data-kind="correct"] :is(.hs-chip, .hs-word) {
          color: var(--ddd-status-correct-ink);
        }
        .hs-badge:is([data-state="key"], [data-state="decoy"]) {
          flex-direction: column;
          max-width: 45%;
          padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
          border-radius: var(--ddd-radius-xs);
          background-color: var(--ddd-status-default-bg);
          color: var(--ddd-status-answered-ink);
          border: var(--ddd-border-size-xs) var(--_hs-line) var(--_hs-signal);
          text-align: center;
          overflow-wrap: anywhere;
        }
        .hs-badge small {
          font-weight: var(--ddd-font-weight-regular);
        }
        /* keyboard crosshair: a dark ring and ticks with a light halo (and
           the reverse in dark mode) so it reads on any picture */
        .hs-cross {
          display: none;
          position: absolute;
          box-sizing: border-box;
          width: var(--ddd-icon-xxs);
          height: var(--ddd-icon-xxs);
          transform: translate(-50%, -50%);
          border: var(--ddd-border-size-sm) solid
            light-dark(
              var(--ddd-theme-default-coalyGray),
              var(--ddd-theme-default-white)
            );
          border-radius: var(--ddd-radius-circle);
          outline: var(--ddd-border-size-sm) solid
            light-dark(
              var(--ddd-theme-default-white),
              var(--ddd-theme-default-coalyGray)
            );
          box-shadow: inset 0 0 0 var(--ddd-border-size-sm)
            light-dark(
              var(--ddd-theme-default-white),
              var(--ddd-theme-default-coalyGray)
            );
          filter: drop-shadow(
              0 0 var(--ddd-border-size-xs)
                light-dark(
                  var(--ddd-theme-default-white),
                  var(--ddd-theme-default-coalyGray)
                )
            )
            drop-shadow(
              0 0 var(--ddd-border-size-xs)
                light-dark(
                  var(--ddd-theme-default-white),
                  var(--ddd-theme-default-coalyGray)
                )
            );
        }
        .hs-stage:focus-visible .hs-cross,
        .hs-stage.hs-cross-on .hs-cross {
          display: block;
        }
        .hs-cross::before,
        .hs-cross::after {
          content: "";
          position: absolute;
          box-sizing: border-box;
          border-style: solid;
          border-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          border-width: var(--ddd-spacing-0);
        }
        .hs-cross::before {
          top: calc(50% - var(--ddd-border-size-sm) / 2);
          inset-inline: calc(-1 * var(--ddd-spacing-4));
          height: var(--ddd-border-size-sm);
          border-inline-width: var(--ddd-spacing-3);
        }
        .hs-cross::after {
          left: calc(50% - var(--ddd-border-size-sm) / 2);
          inset-block: calc(-1 * var(--ddd-spacing-4));
          width: var(--ddd-border-size-sm);
          border-block-width: var(--ddd-spacing-3);
        }
        .hs-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          justify-content: space-between;
          gap: var(--ddd-spacing-2) var(--ddd-spacing-4);
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-140);
        }
        .hs-note {
          display: flex;
          align-items: flex-start;
          gap: var(--ddd-spacing-2);
          flex: 1 1 200px;
          min-height: var(--ddd-icon-xxs);
        }
        .hs-misses {
          display: flex;
          flex-wrap: wrap;
          gap: 0 var(--ddd-spacing-3);
          flex: none;
          font-family: var(--ddd-font-navigation);
          color: var(--ddd-status-default-ink);
        }
        .hs-chip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: none;
          box-sizing: border-box;
          min-width: var(--ddd-icon-xxs);
          height: var(--ddd-icon-xxs);
          padding-inline: var(--ddd-spacing-1);
          border-radius: var(--ddd-radius-rounded);
          background-color: var(--ddd-status-default-bg);
          border: var(--ddd-border-size-sm) var(--_hs-line) var(--_hs-signal);
          font-family: var(--ddd-font-navigation);
          font-weight: var(--ddd-font-weight-bold);
          --simple-icon-width: var(--ddd-icon-4xs);
          --simple-icon-height: var(--ddd-icon-4xs);
        }
        .hs-results {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-1);
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-140);
        }
        .hs-results li {
          display: flex;
          align-items: flex-start;
          gap: var(--ddd-spacing-2);
        }
        .hs-count {
          font-weight: var(--ddd-font-weight-bold);
        }
        /* forced colors: the ring and ticks take the text colour and the
           halo the page colour, so the crosshair keeps two tones */
        @media (forced-colors: active) {
          .hs-cross {
            forced-color-adjust: none;
            border: var(--ddd-border-size-sm) solid CanvasText;
            outline-color: Canvas;
            filter: drop-shadow(0 0 var(--ddd-border-size-xs) Canvas)
              drop-shadow(0 0 var(--ddd-border-size-xs) Canvas);
          }
          .hs-cross::before {
            border-inline: var(--ddd-spacing-3) solid CanvasText;
          }
          .hs-cross::after {
            border-block: var(--ddd-spacing-3) solid CanvasText;
          }
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

globalThis.customElements.define(IdentifyHotspots.tag, IdentifyHotspots);
