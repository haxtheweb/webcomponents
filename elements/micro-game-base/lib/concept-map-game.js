/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { MicroGameBase } from "../micro-game-base.js";

// the seven pillars from the HAX community, used when an author adds no nodes
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const slug = (s) =>
  String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * `concept-map-game`
 * A short game for an interactive infographic. A character walks between the
 * concepts on a map, each one explains itself on touch, and touching all of them
 * pops confetti.
 *
 * @demo index.html
 * @element concept-map-game
 */
export class ConceptMapGame extends MicroGameBase {
  static get tag() {
    return "concept-map-game";
  }

  static get localesPath() {
    return new URL("../locales/", import.meta.url).href;
  }

  constructor() {
    super();
    this.nodes = [];
    this.hubLabel = "";
    this.quest = "";
    this.questTitle = "";
    this.finishLead = "";
    this._visited = new Set();
    this._inside = new Set();
    this._found = 0;
    this._dialog = null;
    this._pos = [];
    this._w = 0;
    this._h = 0;
    this._px = 0;
    this._py = 0;
    this._flip = false;
    this._walking = false;
    this._pw = 48;
    this._ph = 60;
    this._ns = 56;
    this._hd = 112;
    this._t0 = 0;
    this.t = this.t || {};
    this.t = {
      ...this.t,
      idleTitle: "Find every concept",
      idleSub:
        "Walk into each tile to learn what it is. It takes about 20 seconds.",
      stageLabel: "Concept map game. Walk the character into each concept.",
      stageHow:
        "Walk with the arrow keys or W A S D. Press N to walk to the next concept. Press Escape to pause. Press Tab to move on. The full text is also under Read it without playing.",
      hintKeys: "Arrows or WASD to walk. N for the next concept.",
      hintTouch: "Tap the map or use the pad",
      nextConcept: "Next concept",
      learnMore: "Learn more",
      opensNew: "opens in a new tab",
      finishedLabel: "Finished",
      found: "found",
      allFound: "All found",
      guide: "Guide",
      guideText:
        "Walk into a glowing tile to find out what it is. Every tile you touch joins the map.",
      readInstead: "Read it without playing",
      howTheyConnect: "How they connect",
      of: "of",
    };
  }

  static get properties() {
    return {
      ...super.properties,
      nodes: { type: Array },
      hubLabel: { type: String, attribute: "hub-label" },
      quest: { type: String },
      questTitle: { type: String, attribute: "quest-title" },
      _found: { type: Number, state: true },
      _dialog: { type: Object, state: true },
      _pos: { type: Array, state: true },
    };
  }

  get labels() {
    return {
      ...super.labels,
      idleTitle: this.questTitle || this.t.idleTitle,
      idleSub: this.quest || this.t.idleSub,
    };
  }

  get isEmpty() {
    return this._list.length === 0;
  }

  get _list() {
    return Array.isArray(this.nodes) ? this.nodes : [];
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
    this._ro = new ResizeObserver(() => this._resize());
    this._ro.observe(this.stage);
    this._resize();
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    // an author changed the concepts in the HAX form
    if (changedProperties.has("nodes") && this._w) {
      this._visited.clear();
      this._inside.clear();
      this._found = 0;
      this._dialog = null;
      this._resize();
    }
  }

  /* ---------- layout ---------- */

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
    const wide = w >= 595;
    const n = this._list.length || 1;
    const rx = w * (wide ? 0.37 : 0.38);
    const ry = h * 0.36;
    const pos = [];
    for (let i = 0; i < n; i++) {
      const a = (i * 2 * Math.PI) / n;
      pos.push({
        x: Math.round(w / 2 + rx * Math.sin(a)),
        y: Math.round(h / 2 - ry * Math.cos(a)),
      });
    }
    const had = this._w > 0;
    const fx = had ? this._px / this._w : 0.5;
    const fy = had ? this._py / this._h : 0;
    this._w = w;
    this._h = h;
    this._pw = clamp(Math.round(w * 0.065), 40, 56);
    this._ph = Math.round((this._pw * 142) / 113);
    this._ns = clamp(Math.round(w * 0.075), 52, 64);
    this._hd = clamp(Math.round(w * 0.17), 104, 132);
    this._pos = pos;
    if (had) {
      this._px = fx * w;
      this._py = fy * h;
      this.tapTarget = null;
    } else {
      this._placeStart();
    }
    this.updateComplete.then(() => this._placePlayer());
  }

  _placeStart() {
    this._px = this._w / 2;
    this._py = this._h / 2 + this._hd / 2 + this._ph * 0.7;
    this._flip = false;
  }

  _placePlayer() {
    const el = this._player;
    if (!el) {
      return;
    }
    const x = Math.round(this._px - this._pw / 2);
    const y = Math.round(this._py - this._ph);
    el.style.transform =
      "translate(" + x + "px," + y + "px)" + (this._flip ? " scaleX(-1)" : "");
  }

  /* ---------- game ---------- */

  gameUpdate(dt) {
    let dx = 0;
    let dy = 0;
    if (this.keys.has("l")) dx -= 1;
    if (this.keys.has("r")) dx += 1;
    if (this.keys.has("u")) dy -= 1;
    if (this.keys.has("d")) dy += 1;
    if (!dx && !dy && this.tapTarget) {
      const tx = this.tapTarget.x - this._px;
      // aim so the character's body, not its feet, lands on the tapped point
      const ty = this.tapTarget.y + this._ph * 0.45 - this._py;
      const d = Math.hypot(tx, ty);
      if (d < 6) {
        this.tapTarget = null;
      } else {
        dx = tx / d;
        dy = ty / d;
      }
    }
    const len = Math.hypot(dx, dy);
    const moving = len > 0;
    if (moving) {
      dx /= len;
      dy /= len;
      const speed = this._w * 0.52;
      this._px = clamp(
        this._px + dx * speed * dt,
        this._pw / 2,
        this._w - this._pw / 2,
      );
      this._py = clamp(this._py + dy * speed * dt, this._ph, this._h - 4);
      if (dx < -0.2) this._flip = true;
      else if (dx > 0.2) this._flip = false;
      if (!this._t0) this._t0 = globalThis.performance.now();
    }
    this._setWalking(moving);
    this._placePlayer();

    const bx = this._px;
    const by = this._py - this._ph * 0.45;
    const hit = this._ns / 2 + this._pw * 0.6;
    const list = this._list;
    for (let i = 0; i < list.length; i++) {
      const p = this._pos[i];
      if (!p) continue;
      const d = Math.hypot(p.x - bx, p.y - by);
      if (d < hit) {
        if (!this._inside.has(i)) {
          this._inside.add(i);
          this._visit(i);
        }
      } else if (d > hit + 10) {
        this._inside.delete(i);
      }
    }
  }

  _safeUrl(u) {
    return typeof u === "string" && /^(https?:\/\/|\/|\.\/|\.\.\/)/.test(u)
      ? u
      : "";
  }

  /**
   * Letter shown on a tile. Uses the author glyph when there is one, else the
   * first letter, else the first two when another concept starts the same way.
   */
  _glyph(i) {
    const list = this._list;
    const n = list[i] || {};
    if (n.glyph) {
      return String(n.glyph).slice(0, 3);
    }
    const label = String(n.label || "?").trim();
    const first = label.charAt(0).toUpperCase();
    const clash = list.some(
      (o, j) =>
        j !== i &&
        !o.glyph &&
        String(o.label || "")
          .trim()
          .charAt(0)
          .toUpperCase() === first,
    );
    return clash ? label.slice(0, 2) : first;
  }

  /**
   * Walk to the first concept not found yet. Bound to the N key and the
   * Next concept button so the game does not depend on steering.
   */
  gameNext() {
    for (let i = 0; i < this._list.length; i++) {
      if (!this._visited.has(i) && this._pos[i]) {
        this.keys.clear();
        this.tapTarget = { x: this._pos[i].x, y: this._pos[i].y };
        return;
      }
    }
  }

  _nextClick() {
    // keep focus on the button so it can be pressed again
    this._skipFocus = this.state !== "playing";
    this.gameStart();
    this.gameNext();
  }

  _setWalking(moving) {
    const el = this._player;
    if (!el || moving === this._walking) {
      return;
    }
    this._walking = moving;
    el.walking = moving;
    if (!moving) {
      el.leg = "";
    }
  }

  _visit(i) {
    const n = this._list[i];
    this._dialog = {
      i: i,
      label: n.label,
      text: n.text,
      link: n.link,
      url: this._safeUrl(n.url),
    };
    if (this._visited.has(i)) {
      return;
    }
    this._visited.add(i);
    this._found = this._visited.size;
    this.emitGameEvent("concept-visited", {
      id: slug(n.label),
      label: n.label,
      index: i,
      count: this._found,
      total: this._list.length,
    });
    this.emitProgress("experienced", {
      objectDetail: n.label,
      resultSuccess: true,
      resultCompletion: this._found === this._list.length,
      resultScore: this._list.length ? this._found / this._list.length : 0,
    });
    if (this._found === this._list.length) {
      this._complete();
    }
  }

  /**
   * Hooks for games built on this one. Each returns markup that is added to
   * the top bar, over the stage, or into the finish panel.
   */
  renderBarExtras() {
    return "";
  }

  renderStageExtras() {
    return "";
  }

  renderRecap() {
    return "";
  }

  /**
   * Extra fields for the completed progress event. Games built on this one
   * add their own score here.
   */
  completionDetail() {
    return {};
  }

  get gameName() {
    return this.gameTitle || this.hubLabel || "concept-map-game";
  }

  _complete() {
    const ms = this._t0 ? globalThis.performance.now() - this._t0 : 0;
    this.gameComplete({
      ms: ms,
      event: { count: this._found, total: this._list.length },
      progress: {
        resultSuccess: true,
        resultScore: 1,
        ...this.completionDetail(),
      },
    });
  }

  _reset() {
    this._visited.clear();
    this._inside.clear();
    this._found = 0;
    this._dialog = null;
    this._t0 = 0;
    this.gameResetBase();
    this._placeStart();
    this.updateComplete.then(() => this._placePlayer());
    this.state = "paused";
    this.gameStart();
  }

  /* ---------- render ---------- */

  _countText() {
    const total = this._list.length;
    return this._found === total && total > 0
      ? this.t.allFound
      : this._found + " " + this.t.of + " " + total + " " + this.t.found;
  }

  _hubBackground() {
    const n = this._list.length;
    if (!n) {
      return "none";
    }
    const seg = 360 / n;
    const stops = [];
    for (let i = 0; i < n; i++) {
      const c = this._visited.has(i)
        ? "var(--cmg-c" + (i % 7) + ")"
        : "var(--cmg-track)";
      stops.push(c + " " + i * seg + "deg " + (i + 1) * seg + "deg");
    }
    return "conic-gradient(from " + -seg / 2 + "deg, " + stops.join(", ") + ")";
  }

  _renderNode(n, i) {
    const p = this._pos[i] || { x: 0, y: 0 };
    const on = this._visited.has(i);
    const letter = this._glyph(i);
    return html`
      <div
        class="node ${on ? "on" : ""} ${i === 0 ? "up" : ""}"
        style="left:${p.x}px;top:${p.y}px;--nc:var(--cmg-c${i % 7});--ns:${this
          ._ns}px"
      >
        <div class="tile" aria-hidden="true">
          <span>${letter}</span>${on ? html`<i class="check"></i>` : ""}
        </div>
        <div class="nlabel">
          <b>${n.label}</b>${on && n.link ? html`<small>${n.link}</small>` : ""}
        </div>
      </div>
    `;
  }

  _renderFinish() {
    return this.renderFinishPanel({
      stats:
        this._found +
        " " +
        this.t.of +
        " " +
        this._list.length +
        " " +
        this.timeText(),
      body: this.renderRecap(),
    });
  }

  render() {
    const list = this._list;
    const d = this._dialog;
    const cx = this._w / 2;
    const cy = this._h / 2;
    return html`
      <section class="frame">
        <header class="bar">
          <div class="pips" aria-hidden="true">
            ${list.map(
              (n, i) =>
                html`<span
                  class="pip ${this._visited.has(i) ? "on" : ""}"
                  style="--nc:var(--cmg-c${i % 7})"
                ></span>`,
            )}
          </div>
          <div class="count">${this._countText()}</div>
          ${this.done || this.editMode
            ? ""
            : html`<button
                class="btn alt small"
                type="button"
                aria-keyshortcuts="N"
                @click="${this._nextClick}"
              >
                ${this.t.nextConcept}
              </button>`}
          ${this.renderBarExtras()}
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
            aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight W A S D N Escape"
          >
            <p class="sr" id="how">${this.t.stageHow}</p>
            <svg
              class="spokes"
              width="${this._w}"
              height="${this._h}"
              viewBox="0 0 ${this._w} ${this._h}"
              aria-hidden="true"
            >
              ${this._pos.map(
                (p, i) =>
                  html`<line
                    class="${this._visited.has(i) ? "on" : ""}"
                    style="--nc:var(--cmg-c${i % 7})"
                    x1="${cx}"
                    y1="${cy}"
                    x2="${p.x}"
                    y2="${p.y}"
                  ></line>`,
              )}
            </svg>
            <div
              class="hub ${this.done ? "done" : ""}"
              style="width:${this._hd}px;height:${this
                ._hd}px;background:${this._hubBackground()}"
            >
              <span>${this.hubLabel}</span>
            </div>
            ${list.map((n, i) => this._renderNode(n, i))}
            ${this.renderPlayer({
              width: this._pw,
              height: this._ph,
              speed: 110,
            })}
            ${this.renderStageExtras()} ${this.renderOverlay()}
            ${this.renderDpad()}
          </div>
        </confetti-container>
        <div class="dialog">
          <span
            class="tag"
            style="${d
              ? "--nc:var(--cmg-c" + (d.i % 7) + ");--tc:var(--cmg-on)"
              : ""}"
            >${d ? d.label : this.t.guide}</span
          >
          <p class="text">
            <span aria-hidden="true">${d ? d.text : this.t.guideText}</span>
            ${d && d.url
              ? html` <a
                  class="more"
                  href="${d.url}"
                  target="_blank"
                  rel="noopener"
                  >${this.t.learnMore}<span class="sr">
                    ${d.label} (${this.t.opensNew})</span
                  ></a
                >`
              : ""}
          </p>
          <p class="sr" aria-live="polite">
            ${d ? d.label + ". " + d.text : this.t.guideText}
          </p>
        </div>
        <details class="fallback">
          <summary>${this.t.readInstead}</summary>
          <dl>
            ${list.map(
              (n) =>
                html`<dt>${n.label}${n.link ? " (" + n.link + ")" : ""}</dt>
                  <dd>${n.text}</dd>`,
            )}
          </dl>
        </details>
        ${this.done ? this._renderFinish() : ""}
        ${this.renderSchema(this.quest, this._list)}
      </section>
    `;
  }

  static get styles() {
    return [
      super.styles,
      css`
        .pips {
          display: flex;
          gap: var(--ddd-spacing-1);
        }

        .pip {
          width: var(--ddd-spacing-4);
          height: var(--ddd-spacing-4);
          border: var(--ddd-border-sm);
          border-color: var(--micro-game-ink);
        }

        .pip.on {
          background: var(--nc);
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
          touch-action: pan-y;
          outline-offset: -6px;
          background-color: var(--micro-game-paper);
          background-image: linear-gradient(
              var(--cmg-grid) 1px,
              transparent 1px
            ),
            linear-gradient(90deg, var(--cmg-grid) 1px, transparent 1px);
          background-size: 32px 32px;
        }

        @container (max-width: 600px) {
          .stage {
            aspect-ratio: 22 / 27;
          }
        }

        .stage:focus-visible {
          outline: var(--ddd-border-md);
          outline-color: var(--micro-game-accent);
          outline-offset: -6px;
        }

        .spokes {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .spokes line {
          stroke: var(--micro-game-soft);
          stroke-width: 2;
          stroke-dasharray: 4 6;
          opacity: 0.6;
        }

        .spokes line.on {
          stroke: var(--nc);
          stroke-width: 3;
          stroke-dasharray: none;
          opacity: 1;
        }

        .hub {
          position: absolute;
          left: 50%;
          top: 50%;
          z-index: 1;
          transform: translate(-50%, -50%);
          display: grid;
          place-items: center;
          border: var(--ddd-border-md);
          border-color: var(--micro-game-ink);
          border-radius: 50%;
          box-shadow: 3px 3px 0 var(--micro-game-shadow);
        }

        .hub::after {
          content: "";
          position: absolute;
          inset: var(--ddd-spacing-2);
          border-radius: 50%;
          background: var(--micro-game-panel);
        }

        .hub.done::after {
          background: var(--cmg-gold);
        }

        .hub span {
          position: relative;
          z-index: 1;
          max-width: 72%;
          text-align: center;
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          line-height: 1.15;
        }

        .hub.done span {
          color: var(--cmg-on-gold);
        }

        .node {
          position: absolute;
          z-index: 2;
          width: var(--ns);
          height: var(--ns);
          transform: translate(-50%, -50%);
        }

        .tile {
          position: relative;
          display: grid;
          place-items: center;
          width: 100%;
          height: 100%;
          border: var(--ddd-border-md);
          border-color: var(--nc);
          background: var(--micro-game-panel);
          color: var(--nc);
          font-family: var(--ddd-font-secondary);
          font-size: var(--ddd-font-size-ms);
          font-weight: var(--ddd-font-weight-bold);
          box-shadow: 3px 3px 0 var(--micro-game-shadow);
          transition:
            background var(--ddd-duration-fast),
            color var(--ddd-duration-fast);
        }

        .node.on .tile {
          background: var(--nc);
          color: var(--cmg-on);
        }

        .node:not(.on) .tile::before {
          content: "";
          position: absolute;
          inset: -6px;
          border: var(--ddd-border-sm);
          border-color: var(--nc);
          opacity: 0.4;
        }

        @media (prefers-reduced-motion: no-preference) {
          .node:not(.on) .tile::before {
            animation: cmg-pulse 1.6s ease-in-out infinite;
          }
        }

        @keyframes cmg-pulse {
          50% {
            inset: -10px;
            opacity: 0.2;
          }
        }

        .check {
          position: absolute;
          top: -10px;
          right: -10px;
          width: 20px;
          height: 20px;
          background: var(--micro-game-ink);
        }

        .check::after {
          content: "";
          position: absolute;
          left: 6px;
          top: 2px;
          width: 5px;
          height: 10px;
          border: solid var(--micro-game-paper);
          border-width: 0 3px 3px 0;
          transform: rotate(45deg);
        }

        .nlabel {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-top: var(--ddd-spacing-2);
          width: max-content;
          max-width: 130px;
          padding: 2px var(--ddd-spacing-1);
          text-align: center;
          line-height: 1.2;
          font-family: var(--ddd-font-navigation);
          background: var(--micro-game-paper);
          background: color-mix(
            in srgb,
            var(--micro-game-paper) 90%,
            transparent
          );
        }

        .node.up .nlabel {
          top: auto;
          bottom: 100%;
          margin-top: 0;
          margin-bottom: var(--ddd-spacing-2);
        }

        @container (max-width: 600px) {
          .nlabel {
            max-width: 96px;
          }
        }

        .nlabel b {
          display: block;
          font-size: calc(var(--ddd-font-size-4xs) * 0.9);
        }

        .nlabel small {
          display: block;
          font-size: calc(var(--ddd-font-size-4xs) * 0.75);
          color: var(--micro-game-soft);
        }

        #player {
          position: absolute;
          left: 0;
          top: 0;
          z-index: 3;
          pointer-events: none;
          will-change: transform;
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

globalThis.customElements.define(ConceptMapGame.tag, ConceptMapGame);
