/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css, nothing } from "lit";
import {
  QuestionElement,
  matchingResponse,
  XAPI_ITEM_DELIMITER,
} from "@haxtheweb/multiple-choice/lib/QuestionElement.js";
import {
  interactionComponents,
  XAPI_PAIR_DELIMITER,
} from "@haxtheweb/user-action/lib/xapi.js";

const toNumber = (value, fallback) => {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : fallback;
};
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

/**
 * An image address that is safe to put in src: http(s), a relative path, or
 * an inline data:image. Anything with another scheme is dropped.
 * @param {string} src
 * @returns {string} the address, or "" when it is not allowed
 */
export function safeImageSrc(src) {
  const value = String(src || "").trim();
  // browsers ignore control characters and spaces when they read a scheme
  const compact = Array.from(value)
    .filter((ch) => ch.charCodeAt(0) > 32)
    .join("");
  if (!compact) {
    return "";
  }
  if (/^data:/i.test(compact)) {
    return /^data:image\/(png|jpeg|gif|webp|svg\+xml)[;,]/i.test(compact)
      ? value
      : "";
  }
  if (/^[a-z][a-z0-9+.-]*:/i.test(compact)) {
    return /^https?:/i.test(compact) ? value : "";
  }
  return value;
}

/**
 * `image-dropzone`
 * Learners place text labels onto zones laid over an image, then check.
 *
 * The answer key lives in light dom inputs like every QuestionElement: one
 * input per label. A label with a zone is correct on that zone
 * (`<input value="header" data-zone="Top band" data-x="3" data-y="12"
 * data-width="94" data-height="14" />`, numbers are percentages of the
 * image); a label with no `data-zone` is a distractor.
 *
 * @slot caption - optional caption shown below the image
 * @slot content - related content, always available to the learner
 * @slot feedbackCorrect - shown after a correct check
 * @slot feedbackIncorrect - shown after an incorrect check
 * @slot hint - shown after an incorrect check
 * @slot evidence - shown after a correct check
 * @demo demo/index.html
 * @element image-dropzone
 */
export class ImageDropzone extends QuestionElement {
  static get tag() {
    return "image-dropzone";
  }
  /**
   * xAPI statements this element sends (see scripts/generate-xapi-vocabulary.mjs)
   */
  static get xapiVocabulary() {
    return {
      tag: "image-dropzone",
      event: "user-engagement",
      verbs: ["answered"],
      objectType: "http://adlnet.gov/expapi/activities/cmi.interaction",
      interactionType: "matching",
      definition: [
        "name",
        "interactionType",
        "source",
        "target",
        "correctResponsesPattern",
      ],
      response: "label[.]zone id pairs joined by [,]",
      result: [
        "success",
        "completion",
        "response",
        "score",
        "extensions.attempts",
        "extensions.max-attempts",
      ],
      countsTowardCompletion: true,
      done: "answered correctly or out of attempts",
    };
  }

  constructor() {
    super();
    this.src = "";
    this.alt = "";
    this.mediaTitle = "";
    this.guessDataValue = "placed";
    // [{ label, zone }]: the authored order of a label and of the answer
    // whose zone it sits on
    this.placed = [];
    // authored order of the label being carried, or null
    this.held = null;
    this._over = null;
    this._dragLabel = null;
    this._needsInput = "";
    this._announcement = "";
    this.t = {
      ...this.t,
      questionType: "Drag and drop",
      labels: "Labels",
      empty: "empty",
      extra: "extra",
      noImage: "Add an image in the settings.",
      dropzoneDirections:
        "Select a label to pick it up, then select the region of the image it belongs on. Select a placed label to take it back. Some labels may be extra. When every region has a label, press {checkAnswer}.",
      keyboardDirections:
        "With a keyboard: Enter or Space picks up a label, Tab moves between regions, Enter places the label and Escape puts it back.",
      holding: "Holding {label}. Choose a region.",
      placedOn: "{label} placed on {region}.",
      placedOnSwap:
        "{label} placed on {region}. {other} returned to the labels.",
      returned: "{label} returned to the labels.",
      putBack: "{label} put back.",
      pickFirst: "Pick up a label first.",
      placeEvery: "Place a label on every region ({placed} of {total}).",
      regionsCorrect: "{correct} of {total} regions correct.",
      labelOnRegion: "{label} on {region}",
    };
    // QuestionElement's shared strings live in each question type's own namespace
    this.registerLocalization({
      context: this,
      localesPath: new URL("./locales/", import.meta.url).href,
    });
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * Address of the image the zones sit on
       */
      src: { type: String },
      /**
       * Alternative text of the image
       */
      alt: { type: String },
      /**
       * Visible title of the image; never taken from alt
       */
      mediaTitle: { type: String, attribute: "media-title" },
      placed: { state: true },
      held: { state: true },
      _over: { state: true },
      _needsInput: { state: true },
      _announcement: { state: true },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }
        .dz {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-3);
          min-width: 0;
        }
        .dz-figure {
          width: 100%;
          max-width: var(--image-dropzone-max-width, 560px);
        }
        .dz-title {
          margin-block-end: var(--ddd-spacing-2);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          line-height: var(--ddd-lh-140);
          color: var(--ddd-status-default-ink);
        }
        .dz-stage {
          position: relative;
          width: 100%;
          container-type: inline-size;
        }
        /* on a phone a zone is narrow: smaller text */
        @container (max-width: 420px) {
          :host .dz-zone {
            font-size: var(--ddd-font-size-6xs);
          }
          .dz-pill {
            padding-inline: var(--ddd-spacing-1);
          }
        }
        /* the base class sizes every img for answer thumbnails */
        :host .dz-img {
          display: block;
          width: 100%;
          max-width: 100%;
          height: auto;
          border-radius: var(--ddd-radius-sm);
          user-select: none;
        }
        .dz-placeholder {
          display: grid;
          place-items: center;
          aspect-ratio: 16 / 9;
          padding: var(--ddd-spacing-2);
          box-sizing: border-box;
          border: var(--ddd-border-size-xs) var(--ddd-status-disabled-line)
            var(--ddd-status-disabled-signal);
          border-radius: var(--ddd-radius-sm);
          background-color: var(--ddd-status-disabled-bg);
          color: var(--ddd-status-disabled-ink);
          font-size: var(--ddd-font-size-4xs);
          text-align: center;
        }
        .dz-caption {
          margin-block-start: var(--ddd-spacing-2);
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-140);
          color: var(--ddd-status-default-ink);
        }
        .dz-caption ::slotted(*) {
          margin: var(--ddd-spacing-0);
        }

        /* ---------- zones ---------- */
        /* :host lifts these over the shared ":host button" reset; a zone is
           quiet until a label is held */
        :host .dz-zone {
          position: absolute;
          display: grid;
          place-items: center;
          box-sizing: border-box;
          min-width: var(--ddd-spacing-6);
          min-height: var(--ddd-spacing-6);
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-0);
          border: var(--ddd-border-size-xs) dashed
            var(--ddd-status-disabled-signal);
          border-radius: var(--ddd-radius-xs);
          background-color: color-mix(
            in srgb,
            var(--ddd-status-default-bg) 55%,
            transparent
          );
          color: var(--ddd-status-default-ink);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-5xs);
          line-height: var(--ddd-lh-120);
          cursor: default;
          touch-action: manipulation;
        }
        :host .dz-zone.dz-filled {
          cursor: pointer;
        }
        :host .dz-zone:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        /* a zone sits on the author's image, so in forced colors the ring
           needs its own solid ground to stand out from the picture */
        @media (forced-colors: active) {
          :host .dz-zone:focus-visible {
            background-color: Canvas;
            outline: var(--ddd-border-size-md) solid Highlight;
            outline-offset: calc(-1 * var(--ddd-border-size-md));
          }
        }
        /* targeting: the outline takes the palette marker, the fill the
           palette tint */
        :host .dz-stage[data-targeting] .dz-zone {
          border-width: var(--ddd-border-size-sm);
          border-color: var(
            --ddd-palette-marker,
            light-dark(
              var(--ddd-theme-default-nittanyNavy),
              var(--ddd-theme-default-linkLight)
            )
          );
          background-color: var(
            --ddd-palette-tint,
            light-dark(
              var(--ddd-theme-default-skyMaxLight),
              color-mix(
                in srgb,
                var(--ddd-theme-default-pughBlue) 22%,
                var(--ddd-theme-default-potentialMidnight)
              )
            )
          );
          cursor: pointer;
        }
        :host .dz-stage[data-targeting] .dz-zone:hover,
        :host .dz-stage[data-targeting] .dz-zone.dz-over {
          border-style: solid;
        }
        /* checked: status tokens only, never the accent */
        :host .dz-stage .dz-zone.dz-res-correct,
        :host .dz-stage .dz-zone.dz-res-incorrect {
          border-width: var(--ddd-border-size-sm);
          opacity: 1;
          cursor: default;
        }
        :host .dz-stage .dz-zone.dz-res-correct {
          border-style: var(--ddd-status-correct-line);
          border-color: var(--ddd-status-correct-signal);
          background-color: var(--ddd-status-correct-bg);
          color: var(--ddd-status-correct-ink);
        }
        :host .dz-stage .dz-zone.dz-res-incorrect {
          border-style: var(--ddd-status-incorrect-line);
          border-color: var(--ddd-status-incorrect-signal);
          background-color: var(--ddd-status-incorrect-bg);
          color: var(--ddd-status-incorrect-ink);
        }
        .dz-pill {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
          max-width: 100%;
          box-sizing: border-box;
          padding-block: var(--ddd-spacing-0);
          padding-inline: var(--ddd-spacing-2);
          border-radius: var(--ddd-radius-rounded);
          background-color: var(--ddd-status-answered-signal);
          color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          font-weight: var(--ddd-font-weight-medium);
          overflow-wrap: anywhere;
          --simple-icon-width: var(--ddd-icon-4xs);
          --simple-icon-height: var(--ddd-icon-4xs);
        }
        /* the result mark sits on the top edge of its zone so the label
           keeps the room inside */
        .dz-mark {
          position: absolute;
          top: calc(var(--ddd-icon-4xs) * -0.6);
          inset-inline-end: var(--ddd-spacing-1);
          display: grid;
          place-items: center;
          width: var(--ddd-icon-3xs);
          height: var(--ddd-icon-3xs);
          border-radius: var(--ddd-radius-circle);
          --simple-icon-width: var(--ddd-icon-4xs);
          --simple-icon-height: var(--ddd-icon-4xs);
        }
        .dz-res-correct .dz-mark {
          background-color: var(--ddd-status-correct-signal);
          color: var(--ddd-status-correct-bg);
        }
        .dz-res-incorrect .dz-mark {
          background-color: var(--ddd-status-incorrect-signal);
          color: var(--ddd-status-incorrect-bg);
        }
        .dz-res-correct .dz-pill,
        .dz-res-incorrect .dz-pill {
          padding-inline: var(--ddd-spacing-1);
          font-weight: var(--ddd-font-weight-bold);
        }
        .dz-res-correct .dz-pill {
          background-color: var(--ddd-status-correct-bg);
          color: var(--ddd-status-correct-ink);
        }
        .dz-res-incorrect .dz-pill {
          background-color: var(--ddd-status-incorrect-bg);
          color: var(--ddd-status-incorrect-ink);
        }
        /* author view: every zone outlined and named */
        :host .dz-zone.dz-author {
          align-content: center;
          gap: var(--ddd-spacing-1);
          border: var(--ddd-border-size-sm) dashed
            var(--ddd-status-answered-signal);
          background-color: color-mix(
            in srgb,
            var(--ddd-status-default-bg) 80%,
            transparent
          );
          overflow: hidden;
        }
        .dz-zone-name {
          font-weight: var(--ddd-font-weight-bold);
          text-align: center;
          overflow-wrap: anywhere;
        }

        /* ---------- label bank ---------- */
        .dz-bank-label {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-5xs);
          font-weight: var(--ddd-font-weight-medium);
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        .dz-bank {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-2);
          min-height: var(--ddd-control-height-sm);
        }
        :host .dz-label {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
          min-height: var(--ddd-spacing-8);
          margin: var(--ddd-spacing-0);
          padding-block: var(--ddd-spacing-1);
          padding-inline: var(--ddd-spacing-3);
          box-sizing: border-box;
          border: var(--ddd-border-size-xs) solid
            var(--ddd-status-answered-signal);
          border-radius: var(--ddd-radius-rounded);
          background-color: var(--ddd-status-default-bg);
          color: var(--ddd-status-default-ink);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-120);
          overflow-wrap: anywhere;
          text-align: start;
          touch-action: manipulation;
        }
        :host button.dz-label {
          cursor: grab;
          transition: transform var(--ddd-duration-fast, 0.15s) ease-in-out;
        }
        :host button.dz-label:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        /* the held label is the one place a label takes the accent */
        :host button.dz-label[aria-pressed="true"] {
          border-color: var(
            --ddd-palette-accent,
            light-dark(
              var(--ddd-theme-default-nittanyNavy),
              var(--ddd-theme-default-linkLight)
            )
          );
          background-color: var(
            --ddd-palette-accent,
            light-dark(
              var(--ddd-theme-default-nittanyNavy),
              var(--ddd-theme-default-linkLight)
            )
          );
          color: var(
            --ddd-palette-accent-ink,
            light-dark(
              var(--ddd-theme-default-white),
              var(--ddd-theme-default-potentialMidnight)
            )
          );
          transform: translateY(calc(var(--ddd-spacing-1) * -0.5));
        }
        :host .dz-bank button.dz-label[disabled] {
          border-style: var(--ddd-status-disabled-line);
          border-color: var(--ddd-status-disabled-signal);
          background-color: var(--ddd-status-disabled-bg);
          color: var(--ddd-status-disabled-ink);
          opacity: 1;
          cursor: default;
        }
        .dz-extra {
          padding-inline: var(--ddd-spacing-1);
          border: var(--ddd-border-size-xs) var(--ddd-status-disabled-line)
            var(--ddd-status-disabled-signal);
          border-radius: var(--ddd-radius-xs);
          font-size: var(--ddd-font-size-6xs);
          color: var(--ddd-status-disabled-ink);
        }
        @media (prefers-reduced-motion: reduce) {
          :host button.dz-label {
            transition: none;
          }
          :host button.dz-label[aria-pressed="true"] {
            transform: none;
          }
        }

        /* ---------- messages ---------- */
        .dz-missing {
          display: flex;
          align-items: flex-start;
          gap: var(--ddd-spacing-2);
          margin: var(--ddd-spacing-0);
          padding-block: var(--ddd-spacing-1);
          padding-inline: var(--ddd-spacing-2);
          border-inline-start: var(--ddd-border-size-md)
            var(--ddd-status-missing-line) var(--ddd-status-missing-signal);
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-140);
          color: var(--ddd-status-default-ink);
          --simple-icon-width: var(--ddd-icon-3xs);
          --simple-icon-height: var(--ddd-icon-3xs);
        }
        .dz-missing simple-icon-lite {
          flex: none;
          color: var(--ddd-status-missing-ink);
        }
        .dz-results {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-1);
          margin: var(--ddd-spacing-1) 0;
          padding: var(--ddd-spacing-0);
          list-style: none;
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-140);
        }
        .dz-results li {
          font-size: var(--ddd-font-size-4xs);
        }
        .dz-res {
          display: flex;
          align-items: baseline;
          gap: var(--ddd-spacing-2);
        }
        .dz-res > span:last-child {
          min-width: 0;
          overflow-wrap: anywhere;
        }
        .dz-res-mark {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
          padding-inline: var(--ddd-spacing-2);
          border-radius: var(--ddd-radius-rounded);
          flex: none;
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-5xs);
          font-weight: var(--ddd-font-weight-bold);
          white-space: nowrap;
          --simple-icon-width: var(--ddd-icon-4xs);
          --simple-icon-height: var(--ddd-icon-4xs);
        }
        .dz-res.dz-res-correct .dz-res-mark {
          border: var(--ddd-border-size-sm) var(--ddd-status-correct-line)
            var(--ddd-status-correct-signal);
          color: var(--ddd-status-correct-ink);
        }
        .dz-res.dz-res-incorrect .dz-res-mark {
          border: var(--ddd-border-size-sm) var(--ddd-status-incorrect-line)
            var(--ddd-status-incorrect-signal);
          color: var(--ddd-status-incorrect-ink);
        }
      `,
    ];
  }

  // ---------- answer data ----------

  answerPrototype() {
    return {
      ...super.answerPrototype(),
      zone: "",
      x: 0,
      y: 0,
      width: 20,
      height: 15,
    };
  }
  // read the zone of a label off its light dom input
  processInput(index, inputs, answers) {
    const data = super.processInput(index, inputs, answers);
    const input = inputs[index];
    if (input && typeof input.getAttribute === "function") {
      data.zone = input.getAttribute("data-zone") || "";
      ["x", "y", "width", "height"].forEach((key) => {
        const value = input.getAttribute(`data-${key}`);
        if (value !== null) {
          data[key] = value;
        }
      });
    }
    return data;
  }
  // a change to the answers starts the board over
  cleanAnswerData(answers) {
    this.placed = [];
    this.held = null;
    this._needsInput = "";
    return super.cleanAnswerData(answers);
  }
  // a label with a zone name has a zone; its numbers are kept on the image
  cleanAnswerDataBeforeSend(answer) {
    const zone = String(answer.zone || "").trim();
    const x = clamp(toNumber(answer.x, 0), 0, 99);
    const y = clamp(toNumber(answer.y, 0), 0, 99);
    return {
      ...answer,
      zone,
      x,
      y,
      width: clamp(toNumber(answer.width, 20), 1, 100 - x),
      height: clamp(toNumber(answer.height, 15), 1, 100 - y),
      correct: zone !== "",
    };
  }
  // answers a learner can see: an item with no label text is not a label
  _labels() {
    return (this.answers || []).filter(
      (a) => a && String(a.label || "").trim() !== "",
    );
  }
  _zones() {
    return this._labels().filter((a) => a.zone);
  }
  _answer(order) {
    return this._labels().find((a) => a.order === order) || null;
  }
  // the label sitting on a zone, or null
  _labelIn(zoneOrder) {
    const hit = this.placed.find((p) => p.zone === zoneOrder);
    return hit ? this._answer(hit.label) : null;
  }
  _isPlaced(labelOrder) {
    return this.placed.some((p) => p.label === labelOrder);
  }
  _zoneCorrect(zone) {
    return this.placed.some(
      (p) => p.zone === zone.order && p.label === zone.order,
    );
  }

  // ---------- grading ----------

  isCorrect() {
    const zones = this._zones();
    return zones.length > 0 && zones.every((z) => this._zoneCorrect(z));
  }
  // Check is available as soon as there is something to answer; an
  // unfinished board gets a message instead of a disabled button
  inactiveCase() {
    return this._zones().length > 0;
  }
  /**
   * Check the answer. Every zone needs a label first: an unfinished board
   * gets a message and is not counted as an attempt. Nothing is checked or
   * sent while HAX is editing.
   * @returns {Promise<void>}
   */
  checkAnswer(e) {
    if (this._haxstate || this.edit || this.attemptsExhausted()) {
      return Promise.resolve();
    }
    const total = this._zones().length;
    const placed = this.placed.length;
    if (!total || placed < total) {
      this._needsInput = this._fill(this.t.placeEvery, { placed, total });
      this._say(this._needsInput);
      return Promise.resolve();
    }
    this.held = null;
    this._needsInput = "";
    return super.checkAnswer(e);
  }
  resetAnswer() {
    // a correct answer starts over; a wrong one keeps its labels to fix
    if (this.isCorrect() || this.attemptsExhausted()) {
      this.placed = [];
    }
    this.held = null;
    this._needsInput = "";
    this.showAnswer = false;
    globalThis.dispatchEvent(
      new CustomEvent("simple-toast-hide", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: false,
      }),
    );
  }

  // ---------- xAPI ----------
  // matching: the labels (distractors too) are the source, the zones the
  // target. Pairs are "labelId[.]zoneId" joined by "[,]"; the pattern pairs
  // each zone with the label authored on it.

  _xapiMatching() {
    const source = this.xapiComponents(this._labels());
    const owners = source.filter((c) => c.answer.zone);
    const target = interactionComponents(owners.map((c) => c.answer.zone)).map(
      (c, i) => ({ ...c, answer: owners[i].answer, labelId: owners[i].id }),
    );
    return { source, target };
  }
  xapiDefinition() {
    const m = this._xapiMatching();
    const out = {
      source: m.source.map(({ id, description }) => ({ id, description })),
      target: m.target.map(({ id, description }) => ({ id, description })),
    };
    if (m.target.length) {
      out.correctResponsesPattern = [
        matchingResponse(m.target.map((t) => [t.labelId, t.id])),
      ];
    }
    return out;
  }
  learnerResponse() {
    const m = this._xapiMatching();
    return matchingResponse(
      m.target
        .map((t) => {
          const hit = this.placed.find((p) => p.zone === t.answer.order);
          const label =
            hit && m.source.find((c) => c.answer.order === hit.label);
          return label ? [label.id, t.id] : null;
        })
        .filter(Boolean),
    );
  }
  learnerScore() {
    const zones = this._zones();
    return {
      raw: zones.filter((z) => this._zoneCorrect(z)).length,
      max: Math.max(1, zones.length),
    };
  }
  // put a saved answer back: ids that are no longer in the question are
  // ignored, and a label or zone is only used once
  restoreLearnerResponse(response) {
    if (typeof response !== "string" || !response) {
      return false;
    }
    const m = this._xapiMatching();
    const placed = [];
    response.split(XAPI_ITEM_DELIMITER).forEach((pair) => {
      const ids = pair.split(XAPI_PAIR_DELIMITER);
      const label = m.source.find((c) => c.id === ids[0]);
      const zone = m.target.find((c) => c.id === ids[1]);
      if (
        label &&
        zone &&
        !placed.some(
          (p) => p.label === label.answer.order || p.zone === zone.answer.order,
        )
      ) {
        placed.push({ label: label.answer.order, zone: zone.answer.order });
      }
    });
    this.placed = placed;
    this.held = null;
    return placed.length > 0;
  }
  forgetLearnerResponse() {
    this.placed = [];
    this.held = null;
  }

  // ---------- HAX ----------

  // editing never shows or keeps what a learner did
  haxeditModeChanged(value) {
    super.haxeditModeChanged(value);
    this.placed = [];
    this.held = null;
    this._needsInput = "";
    this.showAnswer = false;
    if (value) {
      this.attempts = 0;
    }
    this.requestUpdate();
  }
  // the base class writes one input per answer; add each label's zone
  async haxpreProcessNodeToContent(node) {
    const out = await super.haxpreProcessNodeToContent(node);
    const answers = (out.answers || []).filter(Boolean);
    Array.from(out.children)
      .filter((el) => el.tagName === "INPUT" && !el.hasAttribute("slot"))
      .forEach((input, i) => {
        const answer = answers[i];
        // whether a label is right is its zone, not a flag of its own
        input.removeAttribute("data-correct");
        if (answer && answer.zone) {
          input.setAttribute("data-zone", answer.zone);
          ["x", "y", "width", "height"].forEach((key) => {
            input.setAttribute(`data-${key}`, String(answer[key]));
          });
        }
      });
    return out;
  }
  // authors see where the numbers put every zone instead of the activity
  _authoring() {
    return Boolean(this._haxstate) || Boolean(this.edit);
  }

  // ---------- interaction ----------

  // speak a move; the same sentence twice in a row is still announced
  _say(text) {
    this._announcement =
      text === this._announcement ? `${text}\u00a0` : String(text);
  }
  _fill(str, values) {
    return String(str).replace(/\{(\w+)\}/g, (match, key) =>
      key in values ? values[key] : match,
    );
  }
  // a click with no pointer behind it came from Enter or Space
  _fromKeyboard(e) {
    return Boolean(e) && e.detail === 0;
  }
  async _focus(selector) {
    await this.updateComplete;
    const target = this.shadowRoot && this.shadowRoot.querySelector(selector);
    if (target) {
      target.focus();
    }
  }
  _locked() {
    return this.disabled || this.showAnswer || this._authoring();
  }
  _pickLabel(answer, e) {
    if (this._locked() || this._isPlaced(answer.order)) {
      return;
    }
    this._needsInput = "";
    if (this.held === answer.order) {
      this.held = null;
      this._say(this._fill(this.t.putBack, { label: answer.label }));
      return;
    }
    this.held = answer.order;
    this._say(this._fill(this.t.holding, { label: answer.label }));
    // zones sit before the labels, so carry a keyboard user to them
    if (this._fromKeyboard(e)) {
      this._focus(
        this.placed.length < this._zones().length
          ? ".dz-zone:not(.dz-filled)"
          : ".dz-zone",
      );
    }
  }
  _place(labelOrder, zone) {
    const label = this._answer(labelOrder);
    if (!label) {
      return;
    }
    const evicted = this.placed.find(
      (p) => p.zone === zone.order && p.label !== labelOrder,
    );
    const other = evicted ? this._answer(evicted.label) : null;
    this.placed = [
      ...this.placed.filter(
        (p) => p.label !== labelOrder && p.zone !== zone.order,
      ),
      { label: labelOrder, zone: zone.order },
    ];
    this.held = null;
    this._needsInput = "";
    this._say(
      this._fill(other ? this.t.placedOnSwap : this.t.placedOn, {
        label: label.label,
        region: zone.zone,
        other: other ? other.label : "",
      }),
    );
  }
  _returnLabel(labelOrder) {
    const label = this._answer(labelOrder);
    this.placed = this.placed.filter((p) => p.label !== labelOrder);
    this.held = null;
    this._needsInput = "";
    if (label) {
      this._say(this._fill(this.t.returned, { label: label.label }));
    }
  }
  _zoneClick(zone, e) {
    if (this._locked()) {
      return;
    }
    if (this.held !== null) {
      this._place(this.held, zone);
      // on to the next label still in the bank
      if (this._fromKeyboard(e)) {
        this._focus(".dz-bank .dz-label:not([disabled])");
      }
      return;
    }
    const label = this._labelIn(zone.order);
    if (label) {
      this._returnLabel(label.order);
      return;
    }
    this._say(this.t.pickFirst);
  }
  _keydown(e) {
    if (e.key !== "Escape" || this.held === null) {
      return;
    }
    e.preventDefault();
    const order = this.held;
    const label = this._answer(order);
    this.held = null;
    if (label) {
      this._say(this._fill(this.t.putBack, { label: label.label }));
    }
    this._focus(`.dz-bank .dz-label[data-label="${Number(order)}"]`);
  }
  // mouse drag and drop sits on top of the tap path
  _dragStart(order, e) {
    if (this._locked()) {
      e.preventDefault();
      return;
    }
    const label = this._answer(order);
    this._dragLabel = order;
    this.held = order;
    if (e.dataTransfer && label) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", label.label);
    }
  }
  _dragEnd() {
    this._dragLabel = null;
    this._over = null;
    this.held = null;
  }
  _dragOver(zoneOrder, e) {
    if (this._dragLabel === null) {
      return;
    }
    e.preventDefault();
    this._over = zoneOrder;
  }
  _dragLeave(zoneOrder) {
    if (this._over === zoneOrder) {
      this._over = null;
    }
  }
  _dropOnZone(zone, e) {
    if (this._dragLabel === null) {
      return;
    }
    e.preventDefault();
    const order = this._dragLabel;
    this._dragEnd();
    this._place(order, zone);
  }
  _dropOnBank(e) {
    if (this._dragLabel === null) {
      return;
    }
    e.preventDefault();
    const order = this._dragLabel;
    this._dragEnd();
    if (this._isPlaced(order)) {
      this._returnLabel(order);
    }
  }

  // ---------- render ----------

  renderDirections() {
    return html`<p>
        ${this._tParts(this.t.dropzoneDirections, {
          checkAnswer: html`<strong>${this.t.checkAnswer}</strong>`,
        })}
      </p>
      <p>${this.t.keyboardDirections}</p>`;
  }

  _zoneStyle(zone) {
    return `left:${zone.x}%;top:${zone.y}%;width:${zone.width}%;height:${zone.height}%`;
  }
  // author view of a zone: outlined, with its name and the label it takes
  _renderAuthorZone(zone) {
    return html`<div class="dz-zone dz-author" style="${this._zoneStyle(zone)}">
      <span class="dz-zone-name">${zone.zone}</span>
      <span class="dz-pill">${zone.label}</span>
    </div>`;
  }
  // a zone is a button named by its authored name plus what it holds
  _renderZone(zone) {
    const label = this._labelIn(zone.order);
    const checked = this.showAnswer && label;
    const result = checked
      ? this._resultIconWord(label.order === zone.order)
      : null;
    const classes = ["dz-zone"];
    if (label) {
      classes.push("dz-filled");
    }
    if (checked) {
      classes.push(
        label.order === zone.order ? "dz-res-correct" : "dz-res-incorrect",
      );
    }
    if (this._over === zone.order) {
      classes.push("dz-over");
    }
    return html`<button
      type="button"
      class="${classes.join(" ")}"
      style="${this._zoneStyle(zone)}"
      data-zone="${zone.order}"
      title="${result ? result.word : nothing}"
      ?disabled="${this.disabled || this.showAnswer}"
      draggable="${label && !this._locked() ? "true" : "false"}"
      @click="${(e) => this._zoneClick(zone, e)}"
      @dragstart="${(e) => (label ? this._dragStart(label.order, e) : e.preventDefault())}"
      @dragend="${this._dragEnd}"
      @dragover="${(e) => this._dragOver(zone.order, e)}"
      @dragleave="${() => this._dragLeave(zone.order)}"
      @drop="${(e) => this._dropOnZone(zone, e)}"
    >
      <span class="sr-only">${zone.zone}: </span>${
        result
          ? html`<span class="dz-mark" aria-hidden="true"
                ><simple-icon-lite
                  icon="${result.icon}"
                ></simple-icon-lite></span
              ><span class="sr-only">${result.word}: </span>`
          : nothing
      }${
        label
          ? html`<span class="dz-pill">${label.label}</span>`
          : html`<span class="sr-only">${this.t.empty}</span>`
      }
    </button>`;
  }
  _renderLabel(answer, authoring) {
    if (authoring) {
      return html`<span class="dz-label"
        >${answer.label}${
          answer.zone
            ? nothing
            : html` <span class="dz-extra">${this.t.extra}</span>`
        }</span
      >`;
    }
    const used = this._isPlaced(answer.order);
    const off = used || this.disabled || this.showAnswer;
    return html`<button
      type="button"
      class="dz-label"
      data-label="${answer.order}"
      aria-pressed="${this.held === answer.order ? "true" : "false"}"
      ?disabled="${off}"
      draggable="${off ? "false" : "true"}"
      @click="${(e) => this._pickLabel(answer, e)}"
      @dragstart="${(e) => this._dragStart(answer.order, e)}"
      @dragend="${this._dragEnd}"
    >
      ${answer.label}
    </button>`;
  }

  renderInteraction() {
    const authoring = this._authoring();
    const src = safeImageSrc(this.src);
    const zones = this._zones();
    const labels = (this.displayedAnswers || []).filter(
      (a) => a && String(a.label || "").trim() !== "",
    );
    const hasCaption =
      this.querySelector && this.querySelector('[slot="caption"]');
    return html`<div class="dz" @keydown="${this._keydown}">
      <div
        class="dz-figure"
        role="${this.mediaTitle ? "group" : nothing}"
        aria-labelledby="${this.mediaTitle ? "dz-title" : nothing}"
      >
        ${
          this.mediaTitle
            ? html`<div class="dz-title" id="dz-title">${this.mediaTitle}</div>`
            : nothing
        }
        <div
          class="dz-stage"
          ?data-targeting="${this.held !== null && !authoring}"
        >
          ${
            src
              ? html`<img
                  class="dz-img"
                  src="${src}"
                  alt="${this.alt || ""}"
                  draggable="false"
                />`
              : html`<div class="dz-placeholder">
                  ${authoring ? this.t.noImage : nothing}
                </div>`
          }
          ${zones.map((zone) =>
            authoring ? this._renderAuthorZone(zone) : this._renderZone(zone),
          )}
        </div>
        ${
          hasCaption
            ? html`<div class="dz-caption"><slot name="caption"></slot></div>`
            : nothing
        }
      </div>
      <div class="dz-bank-label" id="dz-bank-label">${this.t.labels}</div>
      <div
        class="dz-bank"
        role="group"
        aria-labelledby="dz-bank-label"
        @dragover="${(e) => this._dragOver(null, e)}"
        @drop="${this._dropOnBank}"
      >
        ${labels.map((answer) => this._renderLabel(answer, authoring))}
      </div>
      ${
        this._needsInput
          ? html`<p class="dz-missing">
              <simple-icon-lite
                icon="icons:error-outline"
                aria-hidden="true"
              ></simple-icon-lite
              ><span>${this._needsInput}</span>
            </p>`
          : nothing
      }
      <div id="dz-live" class="sr-only" role="status" aria-live="polite">
        ${this._announcement}
      </div>
    </div>`;
  }

  // zones carry their own marks once checked; this panel says the count and
  // names each placement in words, then the author's feedback slots
  renderFeedback() {
    if (this.edit) {
      return this.renderEditModeFeedbackAreas();
    }
    if (!this.showAnswer) {
      return nothing;
    }
    const zones = this._zones();
    return html`<p class="feedback">
        ${this._fill(this.t.regionsCorrect, {
          correct: zones.filter((z) => this._zoneCorrect(z)).length,
          total: zones.length,
        })}
      </p>
      <ul class="dz-results">
        ${zones.map((zone) => {
          const label = this._labelIn(zone.order);
          if (!label) {
            return nothing;
          }
          const ok = label.order === zone.order;
          const result = this._resultIconWord(ok);
          return html`<li
            class="dz-res ${ok ? "dz-res-correct" : "dz-res-incorrect"}"
          >
            <span class="dz-res-mark"
              ><simple-icon-lite
                icon="${result.icon}"
                aria-hidden="true"
              ></simple-icon-lite
              >${result.word}</span
            >
            <span
              >${this._fill(this.t.labelOnRegion, {
                label: label.label,
                region: zone.zone,
              })}</span
            >
          </li>`;
        })}
      </ul>
      ${this.renderFeedbackSlots(this.isCorrect())}`;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(ImageDropzone.tag, ImageDropzone);
