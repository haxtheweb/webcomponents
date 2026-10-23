/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, svg, css } from "lit";
import { ConceptMapGame } from "./concept-map-game.js";

// the seven pillars again, this time each with a question. The first choice is
// the right one; the game shuffles them.
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const KEYS = "ArrowUp ArrowDown ArrowLeft ArrowRight w a s d W A S D".split(
  " ",
);

/**
 * `concept-quest-game`
 * An overworld you wander. Each concept has a house, and each house is locked
 * until you defeat the concept by answering its question. Concepts also find
 * you at random while you walk. Wrong answers cost a heart and you try again.
 * The end recap shows how many tries it took and what to review.
 *
 * Built on concept-map-game, so everything it does (dialogs, finish panel,
 * confetti, copyable prompt, progress events) works here too.
 *
 * @demo index.html
 * @element concept-quest-game
 */
export class ConceptQuestGame extends ConceptMapGame {
  static get tag() {
    return "concept-quest-game";
  }

  static get localesPath() {
    return new URL("../locales/", import.meta.url).href;
  }

  constructor() {
    super();
    this.nodes = [];
    this.hearts = 3;
    this.typeof = "oer:Quiz";
    this._enc = null;
    this._hp = 3;
    this._tries = [];
    this._wrong = [];
    this._steps = 0;
    this._goal = 0;
    this.t = {
      ...this.t,
      idleSub: "Walk around. Concepts will find you.",
      stageLabel:
        "Overworld game. Walk the character around. Concepts will challenge you with questions.",
      stageHow:
        "Walk with the arrow keys or W A S D. Press N to walk to the next house. When a concept appears, press 1 to 4 or Tab and Enter to answer. Press Tab to move on. The full text is also under Read it without playing.",
      hintKeys: "Arrows or WASD to walk. N for the next house.",
      nextConcept: "Next house",
      found: "unlocked",
      guideText:
        "Walk around. Concepts will find you, or knock on a locked house to meet one.",
      hearts: "Hearts",
      tries: "Tries",
      appears: "A wild {name} appears!",
      defeated: "Defeated! Heading to its house.",
      notQuite: "Not quite.",
      tryAgain: "Try again.",
      knockedOut:
        "Knocked out! It retreated. Your hearts are back, so try again.",
      recapFirst: "Got it first try",
      recapReview: "Review these",
      recapTries: "tries",
      recapTry: "try",
      recapNone: "None. Nothing to review.",
      recapSummary: "It took {tries} tries for {total} concepts.",
      knockedDialog: "{name} got away. Knock on its house to face it again.",
      playAgain: "Play again",
    };
  }

  static get properties() {
    return {
      ...super.properties,
      hearts: { type: Number },
      _enc: { type: Object, state: true },
      _hp: { type: Number, state: true },
      _tries: { type: Array, state: true },
      _wrong: { type: Array, state: true },
    };
  }

  get gameName() {
    return this.gameTitle || this.hubLabel || "concept-quest-game";
  }

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this._hp = this.hearts;
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has("nodes") && this._w) {
      this._clearQuest();
    }
    if (changedProperties.has("hearts")) {
      this._hp = this.hearts;
    }
  }

  _clearQuest() {
    this._enc = null;
    this._tries = [];
    this._wrong = [];
    this._steps = 0;
    this._goal = 0;
    this._hp = this.hearts;
  }

  /* ---------- questions ---------- */

  _qa(i) {
    const n = this._list[i] || {};
    let choices = n.choices;
    if (typeof choices === "string") {
      choices = choices.split(/\r?\n/);
    }
    choices = (Array.isArray(choices) ? choices : [])
      .map((c) => String(c).trim())
      .filter(Boolean);
    if (n.question && choices.length >= 2) {
      return { q: n.question, choices: choices, hint: n.hint || "" };
    }
    // no question written: ask which description belongs to this concept
    const pick = (o) => o.link || o.text;
    const others = this._list
      .filter((_, j) => j !== i)
      .slice(0, 3)
      .map(pick);
    return {
      q: "Which of these describes " + n.label + "?",
      choices: [pick(n), ...others],
      hint: n.hint || "",
    };
  }

  _shuffle(len) {
    const order = Array.from({ length: len }, (_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    // never leave the right answer in the same slot every time
    return order;
  }

  /* ---------- encounters ---------- */

  _startEncounter(i) {
    if (this._enc || this._visited.has(i) || !this._list[i]) {
      return;
    }
    const qa = this._qa(i);
    const py = this._py - this._ph * 0.5;
    const fromRight = this._px < this._w / 2;
    const size = this._ns * 1.3;
    const from = { x: fromRight ? this._w + size : -size, y: py };
    const to = {
      x: this._px + (fromRight ? 1 : -1) * (this._pw + size * 0.55),
      y: py,
    };
    this.keys.clear();
    this.tapTarget = null;
    this._enc = {
      i: i,
      qa: qa,
      order: this._shuffle(qa.choices.length),
      wrong: [],
      fb: "",
      phase: "approach",
      t: 0,
      dur: 0.75,
      from: from,
      to: to,
      size: size,
    };
    this.emitGameEvent("concept-encounter", {
      id: this._slug(this._list[i].label),
      label: this._list[i].label,
      index: i,
    });
    if (this.reduceMotion) {
      this._askStart();
    }
  }

  _slug(s) {
    return String(s)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  _askStart() {
    if (!this._enc) {
      return;
    }
    this._enc = { ...this._enc, phase: "ask" };
    this._focusChoice();
  }

  _focusChoice() {
    this.updateComplete.then(() => {
      const b = this.shadowRoot.querySelector('.choice[aria-disabled="false"]');
      if (b) {
        b.focus({ preventScroll: true });
      }
    });
  }

  _answer(ci) {
    const e = this._enc;
    if (!e || e.phase !== "ask" || e.wrong.includes(ci)) {
      return;
    }
    const i = e.i;
    const n = this._list[i];
    const tries = [...this._tries];
    tries[i] = (tries[i] || 0) + 1;
    this._tries = tries;
    // the first choice written is the right one
    const right = ci === 0;
    this.emitProgress("answered", {
      objectDetail: n.label,
      resultSuccess: right,
      resultResponse: e.qa.choices[ci],
      resultScore: right ? 1 : 0,
      attempt: tries[i],
    });
    this.emitGameEvent("concept-answered", {
      id: this._slug(n.label),
      label: n.label,
      index: i,
      correct: right,
      attempt: tries[i],
    });
    if (right) {
      this._enc = { ...e, phase: "won", fb: this.t.defeated };
      setTimeout(() => this._defeat(i), this.reduceMotion ? 0 : 900);
      return;
    }
    const wrong = [...this._wrong];
    wrong[i] = (wrong[i] || 0) + 1;
    this._wrong = wrong;
    this._hp = Math.max(0, this._hp - 1);
    const fb =
      this.t.notQuite +
      " " +
      (e.qa.hint ? e.qa.hint + " " : "") +
      (this._hp > 0 ? this.t.tryAgain : "");
    if (this._hp <= 0) {
      this._enc = {
        ...e,
        wrong: [...e.wrong, ci],
        phase: "lost",
        fb: this.t.knockedOut,
      };
      setTimeout(() => this._flee(i), this.reduceMotion ? 0 : 1600);
      return;
    }
    this._enc = { ...e, wrong: [...e.wrong, ci], fb: fb };
    this._focusChoice();
  }

  _defeat(i) {
    // take focus before the answer buttons leave so the game does not pause
    if (this.stage) {
      this.stage.focus({ preventScroll: true });
    }
    this._enc = null;
    this._hp = this.hearts;
    // the defeated concept leads you to its house
    const p = this._pos[i];
    this._px = p.x;
    this._py = p.y + this._ns / 2 + this._ph * 0.55;
    this._inside.add(i);
    this._steps = 0;
    this._goal = 0;
    this._placePlayer();
    super._visit(i);
    this._focusStage();
  }

  _flee(i) {
    if (this.stage) {
      this.stage.focus({ preventScroll: true });
    }
    this._enc = null;
    this._hp = this.hearts;
    this._dialog = {
      i: i,
      label: this._list[i].label,
      text: this.t.knockedDialog.replace("{name}", this._list[i].label),
      link: "",
      url: "",
    };
    this._focusStage();
  }

  _focusStage() {
    this.updateComplete.then(() => {
      if (this.stage && !this.done) {
        this.stage.focus({ preventScroll: true });
      }
    });
  }

  /* ---------- overrides ---------- */

  // touching a locked house knocks on its door, which wakes the concept
  _visit(i) {
    if (this._visited.has(i)) {
      super._visit(i);
      return;
    }
    this._startEncounter(i);
  }

  _onKey(e, down) {
    if (this._enc) {
      if (down && this._enc.phase === "ask" && /^[1-9]$/.test(e.key)) {
        const pos = Number(e.key) - 1;
        if (pos < this._enc.order.length) {
          e.preventDefault();
          this._answer(this._enc.order[pos]);
        }
        return;
      }
      if (KEYS.includes(e.key)) {
        e.preventDefault();
      }
      return;
    }
    super._onKey(e, down);
  }

  gameUpdate(dt) {
    const e = this._enc;
    if (e) {
      this.keys.clear();
      this.tapTarget = null;
      this._setWalking(false);
      if (e.phase === "approach") {
        e.t += dt;
        const k = clamp(e.t / e.dur, 0, 1);
        const ease = 1 - Math.pow(1 - k, 3);
        this._placeMonster(
          e.from.x + (e.to.x - e.from.x) * ease,
          e.from.y + (e.to.y - e.from.y) * ease,
          e.size,
        );
        if (k >= 1) {
          this._askStart();
        }
      } else {
        this._placeMonster(e.to.x, e.to.y, e.size);
      }
      return;
    }
    const x0 = this._px;
    const y0 = this._py;
    super.gameUpdate(dt);
    if (this._enc) {
      return;
    }
    // wandering far enough wakes a concept you have not defeated yet
    if (!this._goal) {
      this._goal = this._w * (0.7 + Math.random() * 0.9);
    }
    this._steps += Math.hypot(this._px - x0, this._py - y0);
    if (this._steps >= this._goal) {
      this._steps = 0;
      this._goal = 0;
      const left = this._list
        .map((_, i) => i)
        .filter((i) => !this._visited.has(i));
      if (left.length) {
        this._startEncounter(left[Math.floor(Math.random() * left.length)]);
      }
    }
  }

  _placeMonster(x, y, size) {
    const m = this.shadowRoot.querySelector("#monster");
    if (m) {
      m.style.transform =
        "translate(" +
        Math.round(x - size / 2) +
        "px," +
        Math.round(y - size / 2) +
        "px)";
    }
  }

  _reset() {
    this._clearQuest();
    super._reset();
  }

  completionDetail() {
    const total = this._totalTries();
    const n = this._list.length;
    return {
      resultScore: total ? n / total : 0,
      resultScoreRaw: n,
      resultScoreMax: total,
      tries: total,
      review: this._review().map((r) => r.label),
    };
  }

  _totalTries() {
    return this._list.reduce((sum, _, i) => sum + (this._tries[i] || 0), 0);
  }

  _review() {
    return this._list
      .map((n, i) => ({
        label: n.label,
        text: n.text,
        tries: this._tries[i] || 0,
      }))
      .filter((r) => r.tries > 1);
  }

  /* ---------- render ---------- */

  _monster() {
    return html`<svg viewBox="0 0 64 64" aria-hidden="true">
      <path
        d="M6 54 Q4 18 32 12 Q60 18 58 54 Q32 62 6 54 Z"
        fill="var(--nc)"
        stroke="var(--micro-game-ink)"
        stroke-width="3"
        stroke-linejoin="round"
      />
      <circle cx="22" cy="34" r="7" fill="#fff" />
      <circle cx="42" cy="34" r="7" fill="#fff" />
      <circle cx="23" cy="35" r="3" fill="#1b1b1b" />
      <circle cx="41" cy="35" r="3" fill="#1b1b1b" />
      <path
        d="M14 24 L28 29 M50 24 L36 29"
        stroke="var(--micro-game-ink)"
        stroke-width="3"
        stroke-linecap="round"
      />
      <path
        d="M22 47 L26 51 L30 47 L34 51 L38 47 L42 51"
        fill="none"
        stroke="var(--micro-game-ink)"
        stroke-width="2.5"
        stroke-linejoin="round"
      />
    </svg>`;
  }

  _house(on) {
    return html`<svg viewBox="0 0 64 64" aria-hidden="true">
      <rect
        x="42"
        y="8"
        width="8"
        height="16"
        fill="var(--micro-game-soft)"
        stroke="var(--micro-game-ink)"
        stroke-width="3"
      />
      <polygon
        points="3,30 32,5 61,30"
        fill="var(--nc)"
        stroke="var(--micro-game-ink)"
        stroke-width="3"
        stroke-linejoin="round"
      />
      <rect
        x="10"
        y="30"
        width="44"
        height="28"
        fill="var(--micro-game-panel)"
        stroke="var(--micro-game-ink)"
        stroke-width="3"
      />
      <rect
        x="26"
        y="38"
        width="12"
        height="20"
        fill="${on ? "var(--nc)" : "var(--micro-game-soft)"}"
        stroke="var(--micro-game-ink)"
        stroke-width="2.5"
      />
      ${on
        ? svg`<rect
              x="14"
              y="36"
              width="8"
              height="8"
              fill="var(--cmg-gold)"
              stroke="var(--micro-game-ink)"
              stroke-width="2"
            /><rect
              x="42"
              y="36"
              width="8"
              height="8"
              fill="var(--cmg-gold)"
              stroke="var(--micro-game-ink)"
              stroke-width="2"
            />`
        : svg`<rect
              x="29"
              y="47"
              width="6"
              height="6"
              fill="var(--micro-game-ink)"
            /><path
              d="M30 47 v-2 a2 2 0 0 1 4 0 v2"
              fill="none"
              stroke="var(--micro-game-ink)"
              stroke-width="1.8"
            />`}
    </svg>`;
  }

  _renderNode(n, i) {
    const p = this._pos[i] || { x: 0, y: 0 };
    const on = this._visited.has(i);
    return html`
      <div
        class="node house ${on ? "on" : "locked"} ${i === 0 ? "up" : ""}"
        style="left:${p.x}px;top:${p.y}px;--nc:var(--cmg-c${i % 7});--ns:${this
          ._ns}px"
      >
        <div class="tile" aria-hidden="true">
          ${this._house(on)}${on ? html`<i class="check"></i>` : ""}
        </div>
        <div class="nlabel">
          <b>${n.label}</b>${on && n.link ? html`<small>${n.link}</small>` : ""}
        </div>
      </div>
    `;
  }

  renderBarExtras() {
    const tries = this._totalTries();
    const hearts = Array.from({ length: this.hearts }, (_, i) =>
      i < this._hp ? "♥" : "♡",
    ).join("");
    return html`
      <div
        class="hearts"
        role="img"
        aria-label="${this.t.hearts} ${this._hp} ${this.t.of} ${this.hearts}"
      >
        ${hearts}
      </div>
      <div class="count">${this.t.tries} ${tries}</div>
    `;
  }

  renderStageExtras() {
    const e = this._enc;
    if (!e) {
      return "";
    }
    const n = this._list[e.i];
    const nc = "--nc:var(--cmg-c" + (e.i % 7) + ")";
    const asking = e.phase !== "approach";
    return html`
      <div
        id="monster"
        class="monster ${e.phase}"
        style="${nc};width:${e.size}px;height:${e.size}px;transform:translate(${Math.round(
          e.from.x - e.size / 2,
        )}px,${Math.round(e.from.y - e.size / 2)}px)"
        aria-hidden="true"
      >
        ${this._monster()}
      </div>
      <p class="sr" aria-live="assertive">
        ${this.t.appears.replace("{name}", n.label)}
      </p>
      ${asking
        ? html`<div
            class="popover"
            role="dialog"
            aria-labelledby="enc-title"
            style="${nc}"
          >
            <p class="enc-title" id="enc-title">
              ${this.t.appears.replace("{name}", n.label)}
            </p>
            <p class="enc-q" id="enc-q">${e.qa.q}</p>
            <div class="choices" role="group" aria-labelledby="enc-q">
              ${e.order.map(
                (ci, pos) =>
                  html`<button
                    type="button"
                    class="choice ${e.wrong.includes(ci) ? "wrong" : ""}"
                    aria-disabled="${e.wrong.includes(ci) || e.phase !== "ask"
                      ? "true"
                      : "false"}"
                    @click="${() => this._answer(ci)}"
                  >
                    <span class="key" aria-hidden="true">${pos + 1}</span>
                    <span>${e.qa.choices[ci]}</span>
                  </button>`,
              )}
            </div>
            <p class="enc-fb" role="status">${e.fb}</p>
          </div>`
        : ""}
    `;
  }

  renderRecap() {
    const total = this._totalTries();
    const n = this._list.length;
    const review = this._review();
    const first = this._list.filter((_, i) => this._tries[i] === 1);
    return html`
      <p class="fin-stats">
        ${this.t.recapSummary.replace("{tries}", total).replace("{total}", n)}
      </p>
      <div class="recap">
        <div class="rc-col">
          <p class="rc-h">${this.t.recapFirst}</p>
          <ul class="rc-list">
            ${first.map(
              (c) =>
                html`<li class="ok">
                  <span class="rc-label">${c.label}</span>
                  <span class="rc-state">✓ 1 ${this.t.recapTry}</span>
                </li>`,
            )}
          </ul>
        </div>
        <div class="rc-col">
          <p class="rc-h">${this.t.recapReview}</p>
          ${review.length
            ? html`<ul class="rc-list">
                ${review.map(
                  (r) =>
                    html`<li class="bad">
                      <span class="rc-label">${r.label}</span>
                      <span class="rc-state"
                        >✗ ${r.tries} ${this.t.recapTries}</span
                      >
                      <span class="rc-text">${r.text}</span>
                    </li>`,
                )}
              </ul>`
            : html`<p class="rc-none">${this.t.recapNone}</p>`}
        </div>
      </div>
    `;
  }

  static get styles() {
    return [
      super.styles,
      css`
        .stage {
          background-color: color-mix(
            in srgb,
            var(--ddd-theme-default-futureLime) 16%,
            var(--micro-game-paper)
          );
          background-image: radial-gradient(
              circle at 20% 30%,
              color-mix(in srgb, var(--cmg-c1) 35%, transparent) 0 2px,
              transparent 3px
            ),
            radial-gradient(
              circle at 70% 60%,
              color-mix(in srgb, var(--cmg-c1) 35%, transparent) 0 2px,
              transparent 3px
            );
          background-size:
            46px 46px,
            62px 62px;
        }
        .spokes line {
          stroke: color-mix(
            in srgb,
            var(--ddd-theme-default-landgrantBrown) 70%,
            var(--micro-game-paper)
          );
          stroke-width: 10;
          stroke-dasharray: none;
          opacity: 0.4;
        }
        .spokes line.on {
          stroke: var(--nc);
          stroke-width: 10;
          opacity: 0.55;
        }
        .house .tile {
          border: 0;
          background: none;
          box-shadow: none;
          width: calc(var(--ns) * 1.15);
          height: calc(var(--ns) * 1.15);
          margin: calc(var(--ns) * -0.075);
        }
        .house .tile svg {
          width: 100%;
          height: 100%;
          overflow: visible;
        }
        .house.locked .tile svg {
          opacity: 0.78;
        }
        .node.house:not(.on) .tile::before {
          display: none;
        }
        .hearts {
          color: var(--cmg-c3);
          font-size: var(--ddd-font-size-xs);
          letter-spacing: 0.1em;
          line-height: 1;
        }
        .monster {
          position: absolute;
          left: 0;
          top: 0;
          z-index: 4;
          will-change: transform;
          pointer-events: none;
        }
        .monster svg {
          width: 100%;
          height: 100%;
          overflow: visible;
        }
        .monster.won svg {
          opacity: 0.2;
          transform: scale(1.5) rotate(12deg);
          transition:
            opacity 0.6s,
            transform 0.6s;
        }
        .monster.lost svg {
          transform: translateX(20px);
          transition: transform 0.6s;
        }
        .popover {
          position: absolute;
          z-index: 6;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: min(94%, 560px);
          max-height: 94%;
          overflow: auto;
          box-sizing: border-box;
          display: grid;
          gap: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
          border: var(--ddd-border-md);
          border-color: var(--micro-game-ink);
          background: var(--micro-game-panel);
          box-shadow: var(--ddd-spacing-2) var(--ddd-spacing-2) 0
            var(--micro-game-shadow);
          cursor: default;
        }
        .popover p {
          margin: 0;
        }
        .enc-title {
          justify-self: start;
          padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
          background: var(--nc);
          color: var(--cmg-on);
          font-family: var(--ddd-font-navigation);
          font-size: calc(var(--ddd-font-size-4xs) * 0.9);
          font-weight: var(--ddd-font-weight-bold);
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .enc-q {
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
        }
        .choices {
          display: grid;
          gap: var(--ddd-spacing-2);
        }
        .choice {
          display: flex;
          gap: var(--ddd-spacing-2);
          align-items: baseline;
          min-height: 44px;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          border: var(--ddd-border-sm);
          border-color: var(--micro-game-ink);
          background: var(--micro-game-paper);
          color: var(--micro-game-ink);
          font: inherit;
          font-size: calc(var(--ddd-font-size-4xs) * 0.95);
          text-align: left;
          cursor: pointer;
        }
        .choice[aria-disabled="false"]:hover {
          background: var(--nc);
          color: var(--cmg-on);
        }
        .choice:focus-visible {
          outline: var(--ddd-border-md);
          outline-color: var(--micro-game-accent);
          outline-offset: 2px;
        }
        .choice[aria-disabled="true"] {
          cursor: default;
        }
        .choice.wrong {
          text-decoration: line-through;
          opacity: 0.55;
        }
        .key {
          flex: none;
          width: 1.4em;
          font-family: var(--ddd-font-navigation);
          font-weight: var(--ddd-font-weight-bold);
          color: var(--micro-game-soft);
        }
        .enc-fb {
          min-height: 1.4em;
          color: var(--micro-game-soft);
          font-size: calc(var(--ddd-font-size-4xs) * 0.9);
        }
        .rc-none {
          margin: 0;
          color: var(--micro-game-soft);
        }
      `,
    ];
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./${this.tag}.haxProperties.json`, import.meta.url).href;
  }
}

globalThis.customElements.define(ConceptQuestGame.tag, ConceptQuestGame);
