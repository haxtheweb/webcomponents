/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { MicroGameBase } from "../micro-game-base.js";

// the web component specification, plus the things that are not native web
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const slug = (s) =>
  String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// small seeded random so the same seed always makes the same course
function rng(seed) {
  let h = 1779033703 ^ String(seed).length;
  for (let i = 0; i < String(seed).length; i++) {
    h = Math.imul(h ^ String(seed).charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * `concept-runner-game`
 * A side scroller for about 20 seconds. The character runs on fire and never
 * stops. Jump to grab the good concepts and over the bad ones. At the end the
 * recap explains what was good and what was bad.
 *
 * @demo index.html
 * @element concept-runner-game
 */
export class ConceptRunnerGame extends MicroGameBase {
  static get tag() {
    return "concept-runner-game";
  }

  static get localesPath() {
    return new URL("../locales/", import.meta.url).href;
  }

  constructor() {
    super();
    this.items = [];
    this.quest = "";
    this.questTitle = "";
    this.duration = 20;
    this.passScore = 0.7;
    this.slow = this.reduceMotion;
    this.prompt = "";
    this.typeof = "oer:Practice";
    this._seq = [];
    this._dialog = null;
    this._w = 0;
    this._h = 0;
    this._dist = 0;
    this._jy = 0;
    this._vy = 0;
    this._hurt = 0;
    this._walking = false;
    this._doneAt = 0;
    this.t = this.t || {};
    this.t = {
      seconds: "seconds",
      ...this.t,
      idleTitle: "Ready to run?",
      idleSub: "Jump to grab the good ones and over the bad ones.",
      start: "Run",
      pausedSub: "Click or press Enter to keep running.",
      stageLabel:
        "Runner game. The character runs by itself. Jump to grab good concepts and avoid bad ones.",
      stageHow:
        "Press Space, Enter, the up arrow or W to jump. Press Escape to pause. Press Tab to move on. Everything in the game is also listed under Read it without playing.",
      hintKeys: "Space, up arrow or W to jump",
      hintTouch: "Tap to jump",
      caught: "Caught",
      of: "of",
      hits: "Hits",
      slowDown: "Slower",
      guide: "Guide",
      guideText:
        "Grab what is part of the web component specification. Jump over what is not native web.",
      readInstead: "Read it without playing",
      goodList: "Good: native web",
      badList: "Bad: not native web",
      outcomeCollected: "Caught",
      outcomeMissed: "Missed",
      outcomeDodged: "Dodged",
      outcomeHit: "Hit",
      tagCollected: "Good catch",
      tagMissed: "Missed one",
      tagDodged: "Dodged",
      tagHit: "Ouch",
      recapGood: "What was good",
      recapBad: "What was bad",
      recapScore: "You were right on",
      playAgain: "Run again",
      perfect: "A perfect run.",
    };
  }

  static get properties() {
    return {
      ...super.properties,
      items: { type: Array },
      duration: { type: Number },
      passScore: { type: Number, attribute: "pass-score" },
      slow: { type: Boolean, reflect: true },
      quest: { type: String },
      questTitle: { type: String, attribute: "quest-title" },
      _seq: { type: Array, state: true },
      _dialog: { type: Object, state: true },
    };
  }

  get labels() {
    return {
      ...super.labels,
      idleTitle: this.questTitle || this.t.idleTitle,
      idleSub: this.quest || this.t.idleSub,
    };
  }

  get gameName() {
    return this.gameTitle || "Web component runner";
  }

  get isEmpty() {
    return this._list.length === 0;
  }

  get _list() {
    return (Array.isArray(this.items) ? this.items : []).filter(
      (i) => i && i.label,
    );
  }

  get _player() {
    return this.shadowRoot ? this.shadowRoot.querySelector("#player") : null;
  }

  connectedCallback() {
    super.connectedCallback();
    if (this._ro && this.stage) {
      this._ro.observe(this.stage);
    }
  }

  disconnectedCallback() {
    if (this._ro) {
      this._ro.disconnect();
    }
    super.disconnectedCallback();
  }

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this._build();
    this._ro = new ResizeObserver(() => this._resize());
    this._ro.observe(this.stage);
    this._resize();
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (
      changedProperties.has("items") &&
      changedProperties.get("items") !== undefined &&
      this._w
    ) {
      this._build();
      this._resetRun();
      this._resize();
    }
    if (changedProperties.has("slow") && this._w) {
      this._resize();
    }
    if (changedProperties.has("state") || changedProperties.has("done")) {
      this._setWalking(this.state === "playing" && !this.done);
    }
  }

  /* ---------- course ---------- */

  // put the items in a repeatable, mixed order with no long runs of one kind
  _build() {
    const list = this._list;
    const rand = rng(this.seed + ":" + list.length);
    const order = list.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    // break up runs of three of the same kind
    for (let i = 2; i < order.length; i++) {
      const k = list[order[i]].kind === "bad" ? "bad" : "good";
      const a = list[order[i - 1]].kind === "bad" ? "bad" : "good";
      const b = list[order[i - 2]].kind === "bad" ? "bad" : "good";
      if (k === a && a === b) {
        for (let j = i + 1; j < order.length; j++) {
          const kj = list[order[j]].kind === "bad" ? "bad" : "good";
          if (kj !== k) {
            [order[i], order[j]] = [order[j], order[i]];
            break;
          }
        }
      }
    }
    let goods = 0;
    this._seq = order.map((idx, k) => {
      const n = list[idx];
      const kind = n.kind === "bad" ? "bad" : "good";
      // every third good one hangs in the air so it takes a jump to grab
      const air = kind === "good" && goods++ % 3 === 2;
      return {
        k: k,
        idx: idx,
        label: n.label,
        text: n.text,
        kind: kind,
        air: air,
        state: "pending",
      };
    });
  }

  _resize() {
    const stage = this.stage;
    if (!stage) {
      return;
    }
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    if (!w || !h) {
      return;
    }
    this._w = w;
    this._h = h;
    this._s = clamp(Math.round(w * 0.075), 40, 66);
    this._pw = Math.round(this._s * 0.95);
    this._ph = Math.round((this._pw * 142) / 113);
    this._gy = Math.round(h * 0.8);
    this._px = Math.round(w * 0.2);
    const base = w * 0.42;
    this._base = base;
    this._speed = base * (this.slow ? 0.6 : 1);
    // jump that peaks at 1.9 tiles and lasts 0.66 seconds
    const H = this._s * 1.9;
    const T = 0.66;
    this._v0 = (4 * H) / T;
    this._g = (8 * H) / (T * T);
    // lay the items out in pixels so slow mode only changes how fast they arrive
    const n = this._seq.length || 1;
    const lead = base * 1.5;
    const gap = (base * Math.max(4, this.duration - 2.5)) / n;
    this._seq.forEach((it, i) => {
      it.wx = lead + (i + 1) * gap;
    });
    this._end =
      (this._seq.length ? this._seq[this._seq.length - 1].wx : lead) + w * 0.55;
    this.style.setProperty("--rg-s", this._s + "px");
    this.updateComplete.then(() => this._draw());
  }

  _draw() {
    const el = this._player;
    if (el) {
      el.style.transform =
        "translate(" +
        Math.round(this._px - this._pw / 2) +
        "px," +
        Math.round(this._gy - this._ph - this._jy) +
        "px)";
    }
    const items = this.shadowRoot.querySelectorAll(".item");
    items.forEach((node) => {
      const it = this._seq[Number(node.dataset.k)];
      if (!it) {
        return;
      }
      const x = this._px + it.wx - this._dist;
      const s = this._s;
      const top = this._gy - (it.air ? s * 2.45 : s);
      node.style.transform =
        "translate(" + Math.round(x - s / 2) + "px," + Math.round(top) + "px)";
      node.style.visibility = x < -s || x > this._w + s ? "hidden" : "visible";
    });
    const ground = this.shadowRoot.querySelector(".ground");
    if (ground) {
      ground.style.backgroundPositionX = -(this._dist % 48) + "px";
    }
    const hills = this.shadowRoot.querySelector(".hills");
    if (hills) {
      hills.style.backgroundPositionX = -((this._dist * 0.3) % 240) + "px";
    }
    const meter = this.shadowRoot.querySelector(".meter i");
    if (meter) {
      meter.style.width =
        clamp((this._dist / (this._end || 1)) * 100, 0, 100) + "%";
    }
  }

  _setWalking(on) {
    const el = this._player;
    if (!el || on === this._walking) {
      return;
    }
    this._walking = on;
    el.walking = on;
    if (!on) {
      el.leg = "";
    }
  }

  /* ---------- play ---------- */

  _jump() {
    if (this._jy <= 0 && this.state === "playing" && !this.done) {
      this._vy = this._v0;
      this._jy = 0.01;
    }
  }

  gameAction() {
    this._jump();
  }

  gameTap() {
    this._jump();
  }

  renderDpad() {
    return "";
  }

  gameUpdate(dt) {
    if (this.done) {
      return;
    }
    if (!this._t0) {
      this._t0 = globalThis.performance.now();
    }
    if (this.keys.has("u")) {
      this._jump();
    }
    this._dist += this._speed * dt;
    // jump arc
    if (this._jy > 0) {
      this._vy -= this._g * dt;
      this._jy += this._vy * dt;
      if (this._jy <= 0) {
        this._jy = 0;
        this._vy = 0;
      }
    }
    // collisions and passing
    const s = this._s;
    const half = this._pw * 0.2;
    const top = this._ph * 0.85;
    for (let i = 0; i < this._seq.length; i++) {
      const it = this._seq[i];
      if (it.state !== "pending") {
        continue;
      }
      const x = this._px + it.wx - this._dist;
      const near = Math.abs(x - this._px) < half + s * 0.35;
      if (near) {
        const b = it.air ? s * 1.45 : 0;
        const ih = s * 0.8;
        const overlap = this._jy < b + ih && this._jy + top > b;
        if (overlap) {
          this._resolve(it, it.kind === "good" ? "collected" : "hit");
          continue;
        }
      }
      if (x < this._px - half - s * 0.35) {
        this._resolve(it, it.kind === "good" ? "missed" : "dodged");
      }
    }
    if (this._hurt > 0) {
      this._hurt -= dt;
      const el = this._player;
      if (el) {
        el.classList.toggle("hurt", this._hurt > 0);
      }
    }
    this._draw();
    if (this._dist >= this._end) {
      this._finish();
    }
  }

  _resolve(it, outcome) {
    it.state = outcome;
    if (outcome === "hit") {
      this._hurt = 0.5;
    }
    const good = outcome === "collected" || outcome === "dodged";
    this._dialog = {
      kind: it.kind,
      outcome: outcome,
      label: it.label,
      text: it.text,
    };
    this._seq = [...this._seq];
    this.emitGameEvent("item-resolved", {
      id: slug(it.label),
      label: it.label,
      kind: it.kind,
      outcome: outcome,
      success: good,
    });
    this.emitProgress("experienced", {
      objectDetail: it.label,
      resultSuccess: good,
      resultResponse: outcome,
      kind: it.kind,
    });
  }

  get _score() {
    const done = this._seq.filter((i) => i.state !== "pending");
    const right = done.filter(
      (i) => i.state === "collected" || i.state === "dodged",
    ).length;
    return { right: right, total: this._seq.length };
  }

  _finish() {
    // anything still pending counts as passed
    this._seq.forEach((it) => {
      if (it.state === "pending") {
        it.state = it.kind === "good" ? "missed" : "dodged";
      }
    });
    this._seq = [...this._seq];
    this._setWalking(false);
    this._stopLoop();
    const ms = this._t0 ? globalThis.performance.now() - this._t0 : 0;
    const sc = this._score;
    const pct = sc.total ? sc.right / sc.total : 0;
    const hits = this._seq.filter((i) => i.state === "hit").length;
    this.gameComplete({
      ms: ms,
      // confetti is for a perfect run
      confetti: sc.right === sc.total,
      event: { right: sc.right, total: sc.total, hits: hits },
      progress: {
        resultSuccess: pct >= this.passScore,
        resultScore: pct,
        resultScoreRaw: sc.right,
        resultScoreMin: 0,
        resultScoreMax: sc.total,
      },
    });
  }

  _resetRun() {
    this._dist = 0;
    this._jy = 0;
    this._vy = 0;
    this._hurt = 0;
    this._t0 = 0;
    this._dialog = null;
    const el = this._player;
    if (el) {
      el.classList.remove("hurt");
    }
  }

  _reset() {
    this._build();
    this._resetRun();
    this.gameResetBase();
    this._resize();
    this.state = "paused";
    this.gameStart();
  }

  _toggleSlow() {
    this.slow = !this.slow;
  }

  /* ---------- render ---------- */

  _sprite(kind) {
    // generic stand ins, drawn here, not anyone's logo: a gem for what is good
    // and a spiky bug for what is bad
    return kind === "good"
      ? html`<svg viewBox="0 0 64 64" aria-hidden="true">
          <polygon
            points="32,6 56,24 32,58 8,24"
            fill="var(--rg-good)"
            stroke="var(--micro-game-ink)"
            stroke-width="3"
            stroke-linejoin="round"
          />
          <path
            d="M8 24 H56 M20 24 L32 6 L44 24 L32 58 L20 24"
            fill="none"
            stroke="var(--micro-game-ink)"
            stroke-width="2"
            stroke-linejoin="round"
          />
          <polygon points="18,22 28,10 31,20" fill="#fff" opacity="0.55" />
        </svg>`
      : html`<svg viewBox="0 0 64 64" aria-hidden="true">
          <g
            stroke="var(--micro-game-ink)"
            stroke-width="3"
            stroke-linecap="round"
          >
            <line x1="12" y1="52" x2="4" y2="60" />
            <line x1="26" y1="56" x2="24" y2="63" />
            <line x1="38" y1="56" x2="40" y2="63" />
            <line x1="52" y1="52" x2="60" y2="60" />
            <line x1="14" y1="20" x2="6" y2="10" />
            <line x1="50" y1="20" x2="58" y2="10" />
          </g>
          <path
            d="M8 50 Q6 20 32 16 Q58 20 56 50 Q32 60 8 50 Z"
            fill="var(--rg-bad)"
            stroke="var(--micro-game-ink)"
            stroke-width="3"
            stroke-linejoin="round"
          />
          <circle cx="23" cy="32" r="6" fill="#fff" />
          <circle cx="41" cy="32" r="6" fill="#fff" />
          <circle cx="24" cy="33" r="2.5" fill="#1b1b1b" />
          <circle cx="40" cy="33" r="2.5" fill="#1b1b1b" />
          <path
            d="M18 24 L28 28 M46 24 L36 28"
            stroke="var(--micro-game-ink)"
            stroke-width="3"
            stroke-linecap="round"
          />
          <path
            d="M22 44 L26 48 L30 44 L34 48 L38 44 L42 48"
            fill="none"
            stroke="var(--micro-game-ink)"
            stroke-width="2.5"
            stroke-linejoin="round"
          />
        </svg>`;
  }

  _outcomeText(o) {
    return {
      collected: this.t.outcomeCollected,
      missed: this.t.outcomeMissed,
      dodged: this.t.outcomeDodged,
      hit: this.t.outcomeHit,
    }[o];
  }

  _tagText(o) {
    return {
      collected: this.t.tagCollected,
      missed: this.t.tagMissed,
      dodged: this.t.tagDodged,
      hit: this.t.tagHit,
    }[o];
  }

  _renderRecapList(kind, heading) {
    const rows = this._seq.filter((i) => i.kind === kind);
    return html`
      <div class="rc-col">
        <p class="rc-h">${heading}</p>
        <ul class="rc-list">
          ${rows.map((it) => {
            const ok = it.state === "collected" || it.state === "dodged";
            return html`<li class="${ok ? "ok" : "bad"}">
              <span class="rc-label">${it.label}</span>
              <span class="rc-state"
                >${ok ? "✓" : "✗"} ${this._outcomeText(it.state)}</span
              >
              <span class="rc-text">${it.text}</span>
            </li>`;
          })}
        </ul>
      </div>
    `;
  }

  _renderFinish() {
    const sc = this._score;
    return this.renderFinishPanel({
      summary:
        this.t.recapScore +
        " " +
        sc.right +
        " " +
        this.t.of +
        " " +
        sc.total +
        ". " +
        (sc.right === sc.total ? this.t.perfect + " " : "") +
        this.finishText,
      stats: this.timeText(),
      body: html`<div class="recap">
        ${this._renderRecapList("good", this.t.recapGood)}
        ${this._renderRecapList("bad", this.t.recapBad)}
      </div>`,
    });
  }

  render() {
    const d = this._dialog;
    const goods = this._seq.filter((i) => i.kind === "good");
    const caught = goods.filter((i) => i.state === "collected").length;
    const hits = this._seq.filter((i) => i.state === "hit").length;
    return html`
      <section class="frame">
        <header class="bar">
          <div class="count">
            ${this.t.caught} ${caught} ${this.t.of} ${goods.length}
          </div>
          <div class="count">${this.t.hits} ${hits}</div>
          <div class="meter" aria-hidden="true"><i></i></div>
          <button
            class="btn alt small"
            type="button"
            aria-pressed="${this.slow ? "true" : "false"}"
            @click="${this._toggleSlow}"
          >
            ${this.t.slowDown}
          </button>
          <div class="hint" aria-hidden="true">
            ${this.coarse ? this.t.hintTouch : this.t.hintKeys}
          </div>
        </header>
        <confetti-container id="confetti">
          <div
            class="stage"
            data-game-stage
            tabindex="0"
            role="application"
            aria-label="${this.t.stageLabel}"
            aria-describedby="how"
            aria-keyshortcuts="Space Enter ArrowUp W Escape"
          >
            <p class="sr" id="how">${this.t.stageHow}</p>
            <div class="hills" aria-hidden="true"></div>
            <div class="ground" aria-hidden="true"></div>
            ${this._seq.map(
              (it) => html`
                <div
                  class="item ${it.kind} ${it.state}"
                  data-k="${it.k}"
                  aria-hidden="true"
                >
                  <span class="lbl">${it.label}</span>
                  ${this._sprite(it.kind)}
                </div>
              `,
            )}
            ${this.renderPlayer({
              width: this._pw || 56,
              height: this._ph || 70,
              speed: 100,
              fire: true,
            })}
            ${this.renderOverlay()}
          </div>
        </confetti-container>
        <div class="dialog">
          <span
            class="tag"
            style="${d
              ? "--nc:var(" +
                (d.kind === "good" ? "--rg-good" : "--rg-bad") +
                ");--tc:var(--cmg-on)"
              : ""}"
            >${d
              ? this._tagText(d.outcome) + ": " + d.label
              : this.t.guide}</span
          >
          <p class="text" aria-hidden="true">
            ${d ? d.text : this.t.guideText}
          </p>
          <p class="sr" aria-live="polite">
            ${d
              ? this._tagText(d.outcome) + ": " + d.label + ". " + d.text
              : this.t.guideText}
          </p>
        </div>
        <details class="fallback">
          <summary>${this.t.readInstead}</summary>
          <dl>
            ${this._list.map(
              (n) =>
                html`<dt>
                    ${n.label}
                    (${n.kind === "bad" ? this.t.badList : this.t.goodList})
                  </dt>
                  <dd>${n.text}</dd>`,
            )}
          </dl>
        </details>
        ${this.done ? this._renderFinish() : ""}
        ${this.renderSchema(
          this.quest,
          this._list.filter((i) => i.kind !== "bad"),
        )}
      </section>
    `;
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          --rg-good: var(--cmg-c1);
          --rg-bad: var(--cmg-c3);
          --rg-sky: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-potentialMidnight)
          );
        }
        confetti-container {
          display: block;
          position: relative;
        }
        .stage {
          position: relative;
          aspect-ratio: 5 / 3;
          overflow: hidden;
          cursor: pointer;
          touch-action: manipulation;
          outline-offset: -6px;
          background: var(--rg-sky);
        }
        @container (max-width: 600px) {
          .stage {
            aspect-ratio: 4 / 3;
          }
        }
        .stage:focus-visible {
          outline: var(--ddd-border-md);
          outline-color: var(--micro-game-accent);
          outline-offset: -6px;
        }
        .hills {
          position: absolute;
          left: 0;
          right: 0;
          top: 30%;
          height: 50%;
          opacity: 0.35;
          background-image: linear-gradient(
              135deg,
              var(--micro-game-soft) 25%,
              transparent 25%
            ),
            linear-gradient(225deg, var(--micro-game-soft) 25%, transparent 25%);
          background-size: 120px 60px;
          background-position-y: bottom;
          background-repeat: repeat-x;
        }
        .ground {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 20%;
          border-top: var(--ddd-border-md);
          border-color: var(--micro-game-ink);
          background-color: var(--micro-game-panel);
          background-image: repeating-linear-gradient(
            90deg,
            var(--micro-game-soft) 0 4px,
            transparent 4px 48px
          );
          background-size: 48px 6px;
          background-repeat: repeat-x;
          background-position-y: 14px;
        }
        #player {
          position: absolute;
          left: 0;
          top: 0;
          z-index: 3;
          pointer-events: none;
          will-change: transform;
        }
        #player.hurt {
          opacity: 0.45;
        }
        .item {
          position: absolute;
          left: 0;
          top: 0;
          z-index: 2;
          width: var(--rg-s);
          height: var(--rg-s);
          will-change: transform;
          visibility: hidden;
        }
        .item svg {
          width: 100%;
          height: 100%;
          overflow: visible;
          transition:
            opacity var(--ddd-duration-fast),
            transform var(--ddd-duration-fast);
        }
        .item.collected svg,
        .item.hit svg {
          opacity: 0.15;
          transform: scale(1.4);
        }
        .item.missed svg,
        .item.dodged svg {
          opacity: 0.6;
        }
        .lbl {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-bottom: 2px;
          width: max-content;
          max-width: calc(var(--rg-s) * 2.4);
          padding: 1px var(--ddd-spacing-1);
          border: var(--ddd-border-sm);
          border-color: var(--rg-good);
          background: var(--micro-game-panel);
          font-family: var(--ddd-font-navigation);
          font-size: calc(var(--ddd-font-size-4xs) * 0.8);
          font-weight: var(--ddd-font-weight-bold);
          line-height: 1.2;
          text-align: center;
        }
        .item.bad .lbl {
          border-color: var(--rg-bad);
          border-style: dashed;
        }
        .meter {
          flex: 1 1 80px;
          min-width: 60px;
          height: 8px;
          border: var(--ddd-border-sm);
          border-color: var(--micro-game-ink);
          background: var(--cmg-track);
        }
        .meter i {
          display: block;
          height: 100%;
          width: 0;
          background: var(--micro-game-accent);
        }
        .btn.small[aria-pressed="true"] {
          background: var(--micro-game-accent);
          color: var(--micro-game-on-accent);
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

globalThis.customElements.define(ConceptRunnerGame.tag, ConceptRunnerGame);
