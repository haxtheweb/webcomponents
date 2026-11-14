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
import { DDDStatusTokens } from "@haxtheweb/d-d-d/lib/DDDStatusTokens.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import {
  activityId,
  buildStatement,
  componentIds,
  XAPI_ACTIVITY_TYPES,
  XAPI_EXTENSIONS,
  XAPI_ITEM_DELIMITER,
} from "@haxtheweb/user-action/lib/xapi.js";

const FIELDS = ["a", "aImage", "aAlt", "b", "bImage", "bAlt"];

/**
 * An unbiased random integer in [0, max) from the crypto source
 * @param {Number} max
 * @returns {Number}
 */
function randomBelow(max) {
  const limit = Math.floor(4294967296 / max) * max;
  const box = new Uint32Array(1);
  let value = 0;
  do {
    globalThis.crypto.getRandomValues(box);
    value = box[0];
  } while (value >= limit);
  return value % max;
}

/**
 * A shuffled copy of a list (Fisher-Yates over crypto.getRandomValues)
 * @param {Array} list
 * @returns {Array}
 */
export function memoryMatchShuffle(list) {
  const out = Array.isArray(list) ? list.slice() : [];
  for (let i = out.length - 1; i > 0; i--) {
    const j = randomBelow(i + 1);
    const swap = out[i];
    out[i] = out[j];
    out[j] = swap;
  }
  return out;
}

/**
 * An image address that is safe to load: http(s) only, relative allowed
 * @param {String} src
 * @returns {String} the address as authored, or "" when it is not allowed
 */
export function memoryMatchImage(src) {
  const value = String(src == null ? "" : src).trim();
  if (!value) {
    return "";
  }
  try {
    const base =
      (globalThis.document && globalThis.document.baseURI) ||
      "https://haxtheweb.org/";
    const url = new URL(value, base);
    return url.protocol === "http:" || url.protocol === "https:" ? value : "";
  } catch {
    return "";
  }
}

/**
 * `memory-match`
 * Turn over two cards at a time to find the pairs. A pair is a term and its
 * meaning (so a match shows understanding), or two matching texts or images.
 *
 * Pairs are authored in light DOM as a description list, a dt and the dd
 * after it for each pair, and are never changed by play. Cards are dealt in
 * a new order on every visit. Cards that do not match stay face up until
 * the learner chooses any card; nothing is on a timer.
 *
 * @fires user-engagement - bubbling, composed. detail: { activityDisplay
 *   ("progressed" each time a pair is found, "completed" once per visit
 *   when every pair is found), objectName, resultCompletion, statement
 *   (xAPI) }. Never sent while HAX is editing.
 * @fires learner-progress-request - on window when the visitor view loads.
 *   detail: { activityId, tag, record }; a listener sets record and the
 *   pairs in record.response are shown as matched.
 *
 * @demo demo/index.html
 * @element memory-match
 */
export class MemoryMatch extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "memory-match";
  }

  /**
   * xAPI statements this element sends (see scripts/generate-xapi-vocabulary.mjs)
   */
  static get xapiVocabulary() {
    return {
      tag: "memory-match",
      event: "user-engagement",
      verbs: ["progressed", "completed"],
      objectType: "http://adlnet.gov/expapi/activities/simulation",
      response: "ids of the pairs matched so far (c- + 8 hex of each pair)",
      result: [
        "completion",
        "response",
        "extensions.https://haxtheweb.org/xapi/extensions/progress",
      ],
      countsTowardCompletion: true,
      done: "every pair matched",
    };
  }

  constructor() {
    super();
    this.title = "";
    this.pairs = [];
    this.accentColor = "";
    this._order = [];
    this._up = [];
    this._matched = [];
    this._moves = 0;
    this._status = "";
    this._statusFlip = false;
    this._directionsOpen = false;
    this._haxstate = false;
    this._celebrated = false;
    this._completedSent = false;
    this._dealtFor = null;
    this._domPairs = "[]";
    this._pairsSource = this.pairs;
    this._observer = null;
    this._progressListeners = null;
    this.t = {
      ...this.t,
      blockLabel: "Game · Memory",
      memoryGame: "Memory game",
      move: "{moves} move",
      moves: "{moves} moves",
      directions: "Directions",
      showDirections: "Show directions",
      hideDirections: "Hide directions",
      directionsTurn:
        "Turn over two cards. Two cards that belong together make a pair.",
      directionsMismatch:
        "If they do not match they stay face up. Choose any card to turn them back.",
      directionsMatched: "Matched pairs stay face up.",
      cards: "Cards",
      cardFaceDown: "Card {number}, face down",
      cardNumber: "Card {number}",
      matched: "Matched",
      turned: "Card {number}: {text}.",
      match: "Match: {first} and {second}.",
      noMatch:
        "No match: {first} and {second}. Choose any card to turn them back.",
      allFound: "All pairs found in {moves} moves",
      startOver: "Start over",
      startedOver: "Cards dealt again.",
      imageNoText: "Image without a description",
      empty: "Add pairs to make a game.",
      incomplete: "Pairs with an empty side are left out: {count}",
      editing: "Play is paused while you edit. Every pair is shown face up.",
      pairNumber: "Pair {number}",
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
       * Visible title or prompt of the game
       */
      title: { type: String },
      /**
       * The pairs, as [{ a, aImage, aAlt, b, bImage, bAlt }]. Read from the
       * dt / dd elements in light DOM; setting it (the HAX form does)
       * rewrites that list.
       */
      pairs: { type: Array, attribute: false },
      /**
       * Optional accent for the chip, the card backs and the button (the
       * names DDDAccent maps, e.g. blue, teal, purple)
       */
      accentColor: { type: String, attribute: "accent-color", reflect: true },
      _order: { state: true },
      _up: { state: true },
      _matched: { state: true },
      _moves: { state: true },
      _status: { state: true },
      _directionsOpen: { state: true },
      _haxstate: { state: true },
    };
  }

  static get styles() {
    return [
      super.styles,
      DDDStatusTokens,
      DDDAccentStyles,
      DDDBlockStyles,
      css`
        :host {
          display: block;
          margin: var(--ddd-spacing-5) 0;
          /* accent roles: DDD default, then the palette, then accent-color
             on the element */
          --memory-match-marker: var(
            --ddd-accent-color,
            var(
              --ddd-palette-marker,
              light-dark(
                var(--ddd-theme-default-nittanyNavy),
                var(--ddd-theme-default-linkLight)
              )
            )
          );
          --memory-match-accent: var(
            --ddd-accent-color,
            var(
              --ddd-palette-accent,
              light-dark(
                var(--ddd-theme-default-nittanyNavy),
                var(--ddd-theme-default-linkLight)
              )
            )
          );
          --memory-match-accent-ink: var(
            --ddd-accent-color-ink,
            var(
              --ddd-palette-accent-ink,
              light-dark(
                var(--ddd-theme-default-white),
                var(--ddd-theme-default-potentialMidnight)
              )
            )
          );
          --memory-match-surface: light-dark(
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
          color: var(--memory-match-marker);
        }
        .ddd-block-body {
          padding: var(--ddd-surface-padding, var(--ddd-spacing-4));
        }
        .note {
          margin: 0 0 var(--ddd-spacing-3);
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-150);
        }
        .ddd-block-body {
          container-type: inline-size;
        }
        .board {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: var(--ddd-spacing-2);
        }
        .board.editing {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        @container (max-width: 480px) {
          .board {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        .card {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--ddd-spacing-1);
          box-sizing: border-box;
          min-width: 0;
          min-height: var(--ddd-spacing-22);
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-2);
          border: var(--ddd-border-size-sm) solid var(--memory-match-accent);
          border-radius: var(--ddd-radius-sm);
          background-color: var(--memory-match-surface);
          color: var(--ddd-status-default-ink);
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-120);
          text-align: center;
          overflow-wrap: anywhere;
        }
        button.card {
          cursor: pointer;
        }
        .card:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        /* card backs are decoration: they take the accent */
        .card.down {
          background-color: var(--memory-match-accent);
          color: var(--memory-match-accent-ink);
          font-size: var(--ddd-font-size-s);
          font-weight: var(--ddd-font-weight-bold);
        }
        /* matched is the correct status: solid line, check icon, the word */
        .card.matched {
          border: var(--ddd-border-size-md) var(--ddd-status-correct-line)
            var(--ddd-status-correct-signal);
          background-color: var(--ddd-status-correct-bg);
          color: var(--ddd-status-default-ink);
        }
        .card img {
          display: block;
          max-width: 100%;
          max-height: var(--ddd-spacing-16);
          object-fit: contain;
          /* line art is usually dark on transparent: keep it on a light
             plate so it also shows in dark mode */
          padding: var(--ddd-spacing-1);
          border-radius: var(--ddd-radius-xs);
          background-color: var(--ddd-theme-default-white);
        }
        .card .text {
          max-width: 100%;
        }
        .matched-word {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
          color: var(--ddd-status-correct-ink);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-6xs);
          font-weight: var(--ddd-font-weight-bold);
          --simple-icon-color: currentColor;
          --simple-icon-width: var(--ddd-icon-4xs);
          --simple-icon-height: var(--ddd-icon-4xs);
        }
        .pair-label {
          grid-column: 1 / -1;
          margin: var(--ddd-spacing-2) 0 0;
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-6xs);
          font-weight: var(--ddd-font-weight-bold);
        }
        .note.incomplete {
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
          border-color: var(--memory-match-accent);
          border-radius: var(--ddd-radius-xs);
          background-color: var(--memory-match-accent);
          color: var(--memory-match-accent-ink);
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
          .card.down {
            border-style: double;
          }
          .card.matched {
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
        attributes: true,
        attributeFilter: ["src", "alt"],
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

  // every pair as the six plain strings, whatever was set
  _cleanPairs() {
    return (Array.isArray(this.pairs) ? this.pairs : []).map((pair) => {
      const clean = {};
      FIELDS.forEach((field) => {
        const value = pair && pair[field];
        clean[field] = typeof value === "string" ? value.trim() : "";
      });
      return clean;
    });
  }

  /**
   * The pairs that can be played: both sides have text or an image. Each
   * has an id that stays the same while its content does.
   * @returns {Object[]} { id, sides: [{ text, image, alt }, { ... }] }
   */
  get playable() {
    const list = this._cleanPairs()
      .map((pair) => [
        { text: pair.a, image: memoryMatchImage(pair.aImage), alt: pair.aAlt },
        { text: pair.b, image: memoryMatchImage(pair.bImage), alt: pair.bAlt },
      ])
      .filter((sides) => sides.every((side) => side.text || side.image));
    const ids = componentIds(
      list.map((sides) =>
        sides
          .map((side) => [side.text, side.image].join("\u0001"))
          .join("\u0002"),
      ),
    );
    return list.map((sides, index) => ({ id: ids[index], sides }));
  }

  _readSide(node) {
    const img = node ? node.querySelector("img") : null;
    return {
      text: node ? node.textContent.trim() : "",
      image: img ? img.getAttribute("src") || "" : "",
      alt: img ? img.getAttribute("alt") || "" : "",
    };
  }

  // light DOM is the saved content: a dt and the dd after it per pair
  _readLightDom() {
    const pairs = Array.from(this.querySelectorAll("dt")).map((dt) => {
      const next = dt.nextElementSibling;
      const a = this._readSide(dt);
      const b = this._readSide(next && next.tagName === "DD" ? next : null);
      return {
        a: a.text,
        aImage: a.image,
        aAlt: a.alt,
        b: b.text,
        bImage: b.image,
        bAlt: b.alt,
      };
    });
    const key = JSON.stringify(pairs);
    if (key !== this._domPairs) {
      this._domPairs = key;
      this._pairsSource = pairs;
      this.pairs = pairs;
    }
  }

  _writeSide(tag, text, image, alt) {
    const node = globalThis.document.createElement(tag);
    if (image) {
      const img = globalThis.document.createElement("img");
      img.setAttribute("src", image);
      img.setAttribute("alt", alt);
      node.appendChild(img);
    }
    if (text) {
      node.appendChild(globalThis.document.createTextNode(text));
    }
    return node;
  }

  // pairs set from outside (the HAX form): write them back as dt / dd
  _writeLightDom() {
    const pairs = this._cleanPairs();
    const key = JSON.stringify(pairs);
    this._pairsSource = this.pairs;
    if (key === this._domPairs) {
      return;
    }
    this._domPairs = key;
    let list = this.querySelector("dl");
    if (!list) {
      list = globalThis.document.createElement("dl");
      this.appendChild(list);
    }
    Array.from(this.querySelectorAll("dt,dd")).forEach((n) => n.remove());
    pairs.forEach((pair) => {
      list.appendChild(
        this._writeSide("dt", pair.a, memoryMatchImage(pair.aImage), pair.aAlt),
      );
      list.appendChild(
        this._writeSide("dd", pair.b, memoryMatchImage(pair.bImage), pair.bAlt),
      );
    });
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
      changedProperties.has("pairs") &&
      this.pairs !== this._pairsSource &&
      this.isConnected
    ) {
      this._writeLightDom();
    }
    // deal (shuffle) here, never in render, and only when the pairs changed
    const dealKey = this.playable.map((pair) => pair.id).join(" ");
    if (dealKey !== this._dealtFor) {
      this._deal(dealKey);
    }
  }

  // a new order for the cards; matched pairs that still exist stay matched
  _deal(dealKey) {
    const pairs = this.playable;
    this._dealtFor =
      dealKey != null ? dealKey : pairs.map((pair) => pair.id).join(" ");
    const cards = [];
    pairs.forEach((pair) => {
      cards.push({ pair: pair.id, side: 0 }, { pair: pair.id, side: 1 });
    });
    this._order = memoryMatchShuffle(cards);
    this._up = [];
    this._matched = this._matched.filter((id) =>
      pairs.some((pair) => pair.id === id),
    );
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
    const total = this.playable.length;
    return total > 0 && this._matched.length === total;
  }

  /**
   * Author content that identifies this game for its xAPI activity id
   * @returns {String}
   */
  xapiFingerprint() {
    return `${this.title || ""}\u0001${this.playable
      .map((pair) => pair.id)
      .join("\u0001")}`;
  }

  // ask the learner record (when a page has one) which pairs were matched
  _requestLearnerProgress() {
    if (!this.isConnected || this._editing() || !this.playable.length) {
      return;
    }
    const detail = {
      activityId: activityId(this, this.xapiFingerprint()),
      tag: MemoryMatch.tag,
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
   * Show the pairs of a saved response as matched. Ids that no longer name
   * a pair are ignored.
   * @param {String} response pair ids joined by "[,]"
   * @returns {Boolean} true when at least one pair was restored
   */
  restoreLearnerResponse(response) {
    if (this._editing()) {
      return false;
    }
    const ids = String(response || "").split(XAPI_ITEM_DELIMITER);
    const matched = this.playable
      .map((pair) => pair.id)
      .filter((id) => ids.includes(id));
    if (!matched.length) {
      return false;
    }
    this._matched = matched;
    this._up = [];
    // a game that was already finished does not celebrate again
    this._celebrated = this._complete;
    return true;
  }

  /**
   * Forget what the learner matched
   */
  forgetLearnerResponse() {
    this._reset("");
  }

  _reset(message) {
    this._matched = [];
    this._up = [];
    this._moves = 0;
    this._celebrated = false;
    this._say(message);
  }

  _say(text) {
    // the same message twice in a row is still announced
    this._statusFlip = !this._statusFlip;
    this._status = text ? text + (this._statusFlip ? " " : "") : "";
  }

  _statement(verb) {
    const pairs = this.playable;
    const ids = pairs
      .map((pair) => pair.id)
      .filter((id) => this._matched.includes(id));
    return buildStatement({
      verb,
      object: {
        id: activityId(this, this.xapiFingerprint()),
        name: (this.title || this.t.memoryGame).slice(0, 120),
        type: XAPI_ACTIVITY_TYPES.simulation,
      },
      result: {
        completion: pairs.length > 0 && ids.length === pairs.length,
        response: ids.join(XAPI_ITEM_DELIMITER),
        extensions: {
          [XAPI_EXTENSIONS.progress]: pairs.length
            ? ids.length / pairs.length
            : 0,
        },
      },
      context: { extensions: { [XAPI_EXTENSIONS.element]: MemoryMatch.tag } },
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
          objectName: (this.title || this.t.memoryGame).slice(0, 120),
          resultCompletion: this._complete,
          statement: this._statement(verb),
        },
      }),
    );
  }

  // what a card says: its text, else its image description
  _sideText(card) {
    const pair = this.playable.find((p) => p.id === card.pair);
    const side = pair ? pair.sides[card.side] : null;
    return side ? side.text || side.alt || this.t.imageNoText : "";
  }

  /**
   * Turn a card (by its position on the board, from 0)
   * @param {Number} index
   */
  async turnCard(index) {
    const card = this._order[index];
    if (!card || this._editing()) {
      return;
    }
    let up = this._up;
    // two cards that did not match go back when any card is chosen
    if (up.length === 2) {
      up = [];
    }
    if (this._matched.includes(card.pair) || up.includes(index)) {
      this._up = up;
      return;
    }
    up = [...up, index];
    this._up = up;
    if (up.length < 2) {
      this._say(
        this.t.turned
          .replace("{number}", index + 1)
          .replace("{text}", this._sideText(card)),
      );
      return;
    }
    this._moves += 1;
    const first = this._order[up[0]];
    const texts = [this._sideText(first), this._sideText(card)];
    if (first.pair !== card.pair) {
      this._say(
        this.t.noMatch
          .replace("{first}", texts[0])
          .replace("{second}", texts[1]),
      );
      return;
    }
    this._matched = [...this._matched, card.pair];
    this._up = [];
    this._say(
      this.t.match.replace("{first}", texts[0]).replace("{second}", texts[1]),
    );
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
   * Deal the cards again and clear the matches and the move count
   */
  startOver() {
    this._reset(this.t.startedOver);
    this._deal();
  }

  _onCard(e) {
    this.turnCard(Number(e.currentTarget.getAttribute("data-card")));
  }

  _toggleDirections() {
    this._directionsOpen = !this._directionsOpen;
  }

  renderSide(side) {
    return html`${
      side.image ? html`<img src="${side.image}" alt="${side.alt}" />` : nothing
    }${
      side.text
        ? html`<span class="text">${side.text}</span>`
        : side.image && !side.alt
          ? html`<span class="sr-only">${this.t.imageNoText}</span>`
          : nothing
    }`;
  }

  // the board learners play: one button per card, in the dealt order
  renderBoard(pairs) {
    return html`<div class="board" role="group" aria-label="${this.t.cards}">
      ${this._order.map((card, index) => {
        const pair = pairs.find((p) => p.id === card.pair);
        if (!pair) {
          return nothing;
        }
        const matched = this._matched.includes(card.pair);
        const up = matched || this._up.includes(index);
        return html`<button
          type="button"
          class="card ${matched ? "matched" : up ? "up" : "down"}"
          data-card="${index}"
          @click="${this._onCard}"
        >
          ${
            up
              ? html`<span class="sr-only"
                    >${this.t.cardNumber.replace("{number}", index + 1)},
                  </span>
                  ${this.renderSide(pair.sides[card.side])}
                  ${
                    matched
                      ? html`<span class="matched-word"
                          ><simple-icon-lite
                            icon="icons:check-circle"
                            aria-hidden="true"
                          ></simple-icon-lite
                          >${this.t.matched}</span
                        >`
                      : nothing
                  }`
              : html`<span aria-hidden="true">?</span
                  ><span class="sr-only"
                    >${this.t.cardFaceDown.replace("{number}", index + 1)}</span
                  >`
          }
        </button>`;
      })}
    </div>`;
  }

  // the board authors see: every pair face up, side by side, in order
  renderPairs(pairs) {
    return html`<div class="board editing">
      ${pairs.map(
        (pair, index) =>
          html`<p class="pair-label">
              ${this.t.pairNumber.replace("{number}", index + 1)}
            </p>
            <div class="card up">${this.renderSide(pair.sides[0])}</div>
            <div class="card up">${this.renderSide(pair.sides[1])}</div>`,
      )}
    </div>`;
  }

  render() {
    const pairs = this.playable;
    const total = pairs.length;
    const left = this._cleanPairs().length - total;
    const complete = this._complete;
    const editing = this._haxstate;
    const done = this.t.allFound.replace("{moves}", this._moves);
    return html`
      <div
        class="ddd-block"
        role="group"
        aria-labelledby="header"
        ?data-complete="${complete}"
      >
        ${renderDDDBlockHeader({
          id: "header",
          icon: "icons:view-module",
          label: this.t.blockLabel,
          title: this.title,
          titleTag: "h3",
          done: complete,
          doneLabel: done,
          speakDone: false,
          actions: html`<span class="counter"
              >${(this._moves === 1 ? this.t.move : this.t.moves).replace(
                "{moves}",
                this._moves,
              )}</span
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
            <li>${this.t.directionsTurn}</li>
            <li>${this.t.directionsMismatch}</li>
            <li>${this.t.directionsMatched}</li>
          </ul>
        </div>
        <div class="ddd-block-body">
          ${
            editing && left > 0
              ? html`<p class="note incomplete">
                  <simple-icon-lite
                    icon="icons:error-outline"
                    aria-hidden="true"
                  ></simple-icon-lite>
                  ${this.t.incomplete.replace("{count}", left)}
                </p>`
              : nothing
          }
          ${
            !total
              ? html`<p class="note">${this.t.empty}</p>`
              : editing
                ? this.renderPairs(pairs)
                : this.renderBoard(pairs)
          }
        </div>
        <div class="ddd-block-footer">
          <p class="status" role="status">
            ${
              complete
                ? html`<span class="status-chip" aria-hidden="true"
                      ><simple-icon-lite icon="icons:check"></simple-icon-lite
                    ></span>
                    <strong class="status-word">${done}</strong>`
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
      this._deal();
      this._requestLearnerProgress();
    }
  }

  /**
   * Saving: the pairs in light DOM are the content; make sure they hold
   * what the form last set
   * @param {HTMLElement} node
   * @returns {HTMLElement}
   */
  haxpreProcessNodeToContent(node) {
    if (node.pairs !== node._pairsSource) {
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

globalThis.customElements.define(MemoryMatch.tag, MemoryMatch);
