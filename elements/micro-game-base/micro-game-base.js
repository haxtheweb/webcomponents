/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { IntersectionObserverMixin } from "@haxtheweb/intersection-element/lib/IntersectionObserverMixin.js";
import { SchemaBehaviors } from "@haxtheweb/schema-behaviors/schema-behaviors.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/rpg-character/rpg-character.js";
import { gameChromeStyles } from "./lib/game-chrome.js";

const KEYS = {
  ArrowLeft: "l",
  a: "l",
  A: "l",
  ArrowRight: "r",
  d: "r",
  D: "r",
  ArrowUp: "u",
  w: "u",
  W: "u",
  ArrowDown: "d",
  s: "d",
  S: "d",
};
const ARROWS = { u: "↑", l: "←", d: "↓", r: "→" };

/**
 * `micro-game-base`
 * Shared shell for short, keyboard driven browser games that live inside a page.
 *
 * A game extends this class, renders an element marked with data-game-stage, and
 * implements gameUpdate(dt). The shell takes care of everything that is not the
 * game itself: the frame loop, arrow and WASD input, tap to move, an on screen
 * pad for touch, pausing on blur, when scrolled away, when the tab is hidden and
 * while the HAX editor is in edit mode, a start overlay, reduced motion, the
 * game-start and game-complete events, progress and OER Schema, the player
 * character (including the signed in user's own character), the finish panel
 * with its copyable prompt and slots, confetti, and translations.
 *
 * Translations: the shell strings live in this.t. A game adds its own strings
 * to this.t in its constructor and points static get localesPath at its
 * locales folder; the base registers that with the i18n manager. The manager
 * allows one registration per element, so the locale files stay per tag.
 *
 * Slots on the finish panel: finish replaces the default prompt box and
 * finish-actions adds buttons or links next to Copy and Play again.
 *
 * @element micro-game-base
 */
export class MicroGameBase extends I18NMixin(
  SchemaBehaviors(IntersectionObserverMixin(DDD)),
) {
  /**
   * Games return the folder that holds their <tag>.<lang>.json files
   * @return {String} absolute url of a locales folder, or empty for English only
   */
  static get localesPath() {
    return "";
  }

  static get properties() {
    return {
      ...super.properties,
      state: { type: String },
      done: { type: Boolean },
      editMode: { type: Boolean },
      // identifies this instance in progress events so a page can tell games apart
      gameId: { type: String, attribute: "game-id" },
      gameTitle: { type: String, attribute: "game-title" },
      // OER Schema class, reflected so it is also in server rendered HTML
      typeof: { type: String, reflect: true },
      // the player character. Same seed as rpg-character, so the seed a person
      // sees for themselves elsewhere makes the same character here
      seed: { type: String },
      hat: { type: String },
      // use the signed in user's own character when there is one
      seedFromUser: { type: Boolean, attribute: "seed-from-user" },
      _userSeed: { type: String, state: true },
      // the panel after the game
      finishTitle: { type: String, attribute: "finish-title" },
      finishText: { type: String, attribute: "finish-text" },
      finishLead: { type: String, attribute: "finish-lead" },
      prompt: { type: String },
      _copied: { type: String, state: true },
      _finishSlotted: { type: Boolean, state: true },
    };
  }

  constructor() {
    super();
    // idle until first started, then playing or paused
    this.state = "idle";
    this.done = false;
    this.editMode = false;
    this.gameId = "";
    this.gameTitle = "";
    this.typeof = "oer:Activity";
    this.seed = "";
    this.hat = "none";
    this.seedFromUser = false;
    this._userSeed = "";
    this.finishTitle = "Finished";
    this.finishText = "";
    this.finishLead = "";
    this.prompt = "";
    this._copied = "";
    this._ms = 0;
    this._ct = 0;
    this._finishSlotted = false;
    this._i18nRegistered = false;
    this.t = {
      ...this.t,
      idleTitle: "Ready?",
      idleSub: "Press start to play.",
      start: "Start",
      paused: "Paused",
      pausedSub: "Click or press Enter to keep going.",
      resume: "Resume",
      editing: "Editing",
      editingSub: "The game is paused while you edit.",
      emptyTitle: "Nothing to play yet",
      emptySub: "Add some content to this game to make it playable.",
      finishLeadDefault: "Copy this to keep going.",
      copy: "Copy prompt",
      copied: "Copied",
      copyNote: "Copied. Paste it where you need it.",
      copyFail: "The text is selected. Copy it with Ctrl or Cmd + C.",
      playAgain: "Play again",
      of: "of",
      inTime: "in",
      seconds: "seconds",
    };
    // currently held direction keys: l r u d
    this.keys = new Set();
    // where the player last tapped, in stage pixels
    this.tapTarget = null;
    this.reduceMotion = false;
    this.coarse = false;
    // keep watching visibility instead of stopping after the first time
    this.IORemoveOnVisible = false;
    this.IOVisibleLimit = 0.25;
    this._raf = 0;
    this._last = 0;
    this._started = false;
    // set by controls outside the stage that must keep keyboard focus
    this._skipFocus = false;
    this._tick = this._tick.bind(this);
    // the user data arrives a moment after sign in
    this._onLogin = () => setTimeout(() => this._syncUserSeed(), 500);
    this._onVisibility = () => {
      if (globalThis.document.hidden) {
        this.gamePause();
      }
    };
    if (globalThis.matchMedia) {
      this.reduceMotion = globalThis.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      this.coarse = globalThis.matchMedia("(pointer: coarse)").matches;
    }
  }

  /**
   * Text used by the overlay. Games override this, usually from this.t
   */
  get labels() {
    return {
      idleTitle: this.t.idleTitle,
      idleSub: this.t.idleSub,
      start: this.t.start,
      paused: this.t.paused,
      pausedSub: this.t.pausedSub,
      resume: this.t.resume,
      editing: this.t.editing,
      editingSub: this.t.editingSub,
    };
  }

  /**
   * The seed the player character is drawn from: the signed in user's when
   * seed-from-user is on and there is one, otherwise the seed property.
   */
  get playerSeed() {
    return (this.seedFromUser && this._userSeed) || this.seed || "";
  }

  /**
   * Name of the signed in user, which HAX also uses as that user's character
   * seed everywhere else. Reads the HAXcms store when a page has one. Games or
   * sites with another source override this. Returns "" when nobody is signed in.
   */
  resolveUserSeed() {
    const cms = globalThis.HAXCMS;
    const store = cms && cms.instance && cms.instance.store;
    const user = store && store.userData;
    return user && user.userName ? String(user.userName) : "";
  }

  _syncUserSeed() {
    if (this.seedFromUser) {
      this._userSeed = this.resolveUserSeed();
    }
  }

  /**
   * The element that receives keyboard focus and defines the play area
   */
  get stage() {
    return this.shadowRoot
      ? this.shadowRoot.querySelector("[data-game-stage]")
      : null;
  }

  connectedCallback() {
    super.connectedCallback();
    globalThis.document.addEventListener(
      "visibilitychange",
      this._onVisibility,
    );
    globalThis.document.addEventListener("jwt-logged-in", this._onLogin);
    this._syncUserSeed();
    // one registration per element, using the folder the game points to
    const path = this.constructor.localesPath;
    if (path && !this._i18nRegistered) {
      this._i18nRegistered = true;
      this.registerLocalization({ context: this, localesPath: path });
    }
  }

  disconnectedCallback() {
    globalThis.document.removeEventListener(
      "visibilitychange",
      this._onVisibility,
    );
    globalThis.document.removeEventListener("jwt-logged-in", this._onLogin);
    clearTimeout(this._ct);
    this._stopLoop();
    super.disconnectedCallback();
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    const stage = this.stage;
    if (stage) {
      stage.addEventListener("keydown", (e) => this._onKey(e, true));
      stage.addEventListener("keyup", (e) => this._onKey(e, false));
      stage.addEventListener("focusout", (e) => this._onFocusOut(e));
      stage.addEventListener("pointerdown", (e) => this._onPointer(e));
      // on touch screens a press and hold would start a text selection or open
      // the context menu; neither is wanted while playing
      stage.addEventListener("contextmenu", (e) => e.preventDefault());
      stage.addEventListener("selectstart", (e) => e.preventDefault());
      stage.addEventListener("pointercancel", () => {
        this.tapTarget = null;
      });
    }
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    // the overlay button that held focus is gone once play starts, so put
    // focus on the stage where the key listeners are
    if (changedProperties.has("state") && this.state === "playing") {
      const stage = this.stage;
      if (stage && !this._skipFocus) {
        stage.focus({ preventScroll: true });
      }
      this._skipFocus = false;
    }
    // scrolled out of view while playing
    if (
      changedProperties.has("elementVisible") &&
      !this.elementVisible &&
      this.state === "playing" &&
      !this.done
    ) {
      this.gamePause();
    }
  }

  /**
   * HAX hooks so the game stays quiet while an author is editing
   */
  haxHooks() {
    return {
      editModeChanged: "haxeditModeChanged",
    };
  }

  haxeditModeChanged(val) {
    this.editMode = val;
    if (val) {
      this.gamePause();
    }
  }

  /**
   * True when the game has no content to play. A blank tag shows a notice
   * instead of a game. Games override this.
   */
  get isEmpty() {
    return false;
  }

  gameStart() {
    if (this.isEmpty || this.editMode || this.state === "playing") {
      return;
    }
    this._syncUserSeed();
    this.state = "playing";
    const stage = this.stage;
    if (stage && !this._skipFocus) {
      stage.focus({ preventScroll: true });
    }
    if (!this._started) {
      this._started = true;
      this.emitGameEvent("game-start", {});
      this.emitProgress("attempted");
    }
    this._startLoop();
  }

  gamePause() {
    if (this.state !== "playing") {
      return;
    }
    this.state = "paused";
    this.keys.clear();
    this.tapTarget = null;
    this._stopLoop();
  }

  /**
   * Clears shared state. Games call this from their own reset.
   */
  gameResetBase() {
    this.keys.clear();
    this.tapTarget = null;
    this.done = false;
    this._started = false;
    this._copied = "";
    this._ms = 0;
  }

  /**
   * Ends the game. Sets done, loads and pops confetti when asked and allowed,
   * emits game-complete and the completed progress event, and moves keyboard
   * and screen reader focus to the finish panel.
   * @param {Object} o ms: how long it took, event: extra detail for
   * game-complete, progress: extra detail for the completed progress event,
   * confetti: false to skip it (default true)
   */
  gameComplete(o) {
    o = o || {};
    this.done = true;
    this._ms = Math.round(o.ms || 0);
    // the confetti element is only needed once, so load it when it is earned
    if (o.confetti !== false && !this.reduceMotion) {
      import("@haxtheweb/multiple-choice/lib/confetti-container.js").then(() =>
        setTimeout(() => this.popConfetti(), 0),
      );
    }
    this.emitGameEvent("game-complete", { ms: this._ms, ...(o.event || {}) });
    this.emitProgress("completed", {
      resultCompletion: true,
      resultDuration: this._ms,
      ...(o.progress || {}),
    });
    this.updateComplete.then(() => {
      const fin = this.shadowRoot.querySelector(".finish");
      if (fin) {
        fin.focus({ preventScroll: true });
      }
    });
    setTimeout(() => {
      const fin = this.shadowRoot && this.shadowRoot.querySelector(".finish");
      if (this.isConnected && fin) {
        fin.scrollIntoView({
          block: "nearest",
          behavior: this.reduceMotion ? "auto" : "smooth",
        });
      }
    }, 1500);
  }

  /**
   * Play again. Games override this to put their own state back, then call
   * gameResetBase() and start.
   */
  _reset() {
    this.gameResetBase();
    this.state = "paused";
    this.gameStart();
  }

  popConfetti() {
    const c = this.shadowRoot && this.shadowRoot.querySelector("#confetti");
    if (!c) {
      return;
    }
    // the container sizes its canvas once when it connects, so match it to now
    if (c.canvas) {
      c.canvas.width = c.offsetWidth;
      c.canvas.height = c.offsetHeight;
    }
    c.setAttribute("popped", "");
  }

  async copyPrompt() {
    try {
      // eslint-disable-next-line baseline-js/use-baseline -- inside try/catch with a text-selection fallback
      await globalThis.navigator.clipboard.writeText(this.prompt);
      this._copied = "ok";
    } catch {
      try {
        const range = globalThis.document.createRange();
        range.selectNodeContents(this.shadowRoot.querySelector("#prompt"));
        const sel = globalThis.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      } catch {
        // selection is a best effort fallback
      }
      this._copied = "fail";
    }
    clearTimeout(this._ct);
    this._ct = setTimeout(() => {
      if (this._copied === "ok") {
        this._copied = "";
      }
    }, 2200);
  }

  /**
   * Called once per frame while playing. dt is in seconds, capped at 0.05.
   */
  // eslint-disable-next-line no-unused-vars
  gameUpdate(dt) {}

  /**
   * Keyboard and switch alternative to steering by hand. Games walk the player
   * to the next goal. Bound to the N key.
   */
  gameNext() {}

  /**
   * Called for the Enter and Space keys. A runner jumps here.
   */
  gameAction() {}

  /**
   * Called for a tap or click on the stage while playing, with the position in
   * stage pixels. The default walks there. A runner jumps instead.
   */
  gameTap(point) {
    this.tapTarget = point;
  }

  emitGameEvent(name, detail) {
    this.dispatchEvent(
      new CustomEvent(name, { detail: detail, bubbles: true, composed: true }),
    );
  }

  /**
   * Name used for this game in progress events and OER Schema markup
   */
  get gameName() {
    return this.gameTitle || this.tagName.toLowerCase();
  }

  /**
   * Progress for learning records, using the same user-engagement event the
   * HAX quiz and checklist elements emit so one listener can capture all of
   * them. activityDisplay is the verb: attempted, experienced, answered,
   * progressed or completed. Anything in extra rides along as detail fields
   * (objectDetail, resultSuccess, resultScore, resultResponse, attempt, ...).
   */
  emitProgress(verb, extra) {
    this.dispatchEvent(
      new CustomEvent("user-engagement", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: {
          activityDisplay: verb,
          objectName: this.gameName,
          objectId: this.gameId || "",
          game: this.tagName.toLowerCase(),
          schemaType: this.typeof,
          timestamp: Date.now(),
          ...(extra || {}),
        },
      }),
    );
  }

  /**
   * OER Schema markup for this game: its name and description plus one
   * learning objective per concept it teaches. Games pass [{label, text}].
   */
  renderSchema(description, objectives) {
    return html`
      <meta property="oer:name" content="${this.gameName}" />
      <meta property="oer:description" content="${description || ""}" />
      ${(objectives || []).map(
        (o) =>
          html`<span
            property="oer:hasLearningObjective"
            typeof="oer:LearningObjective"
            ><meta property="oer:name" content="${o.label}" /><meta
              property="oer:description"
              content="${o.text || ""}"
          /></span>`,
      )}
    `;
  }

  _startLoop() {
    if (this._raf || !this.isConnected) {
      return;
    }
    this._last = 0;
    this._raf = globalThis.requestAnimationFrame(this._tick);
  }

  _stopLoop() {
    if (this._raf) {
      globalThis.cancelAnimationFrame(this._raf);
    }
    this._raf = 0;
  }

  _tick(ts) {
    this._raf = 0;
    if (this.state !== "playing") {
      return;
    }
    const dt = this._last ? Math.min(0.05, (ts - this._last) / 1000) : 0;
    this._last = ts;
    this.gameUpdate(dt);
    this._raf = globalThis.requestAnimationFrame(this._tick);
  }

  _onKey(e, down) {
    if (e.ctrlKey || e.metaKey || e.altKey) {
      return;
    }
    // buttons, links and fields inside the stage (the start button, a question)
    // keep their own keys, so Enter and Space can still activate them
    const origin = e.composedPath()[0];
    if (
      origin &&
      origin !== this.stage &&
      origin.closest &&
      origin.closest("button, a, input, select, textarea")
    ) {
      return;
    }
    const dir = KEYS[e.key];
    if (dir) {
      e.preventDefault();
      if (down) {
        this.gameStart();
        this.keys.add(dir);
        this.tapTarget = null;
      } else {
        this.keys.delete(dir);
      }
      return;
    }
    if (down && (e.key === "n" || e.key === "N")) {
      // keyboard alternative to steering: walk to the next goal
      e.preventDefault();
      this.gameStart();
      this.gameNext();
    } else if (down && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      const wasPlaying = this.state === "playing";
      this.gameStart();
      if (wasPlaying) {
        this.gameAction();
      }
    } else if (down && e.key === "Escape" && !this.done) {
      this.gamePause();
    }
  }

  _onFocusOut(e) {
    this.keys.clear();
    // touch screens have no keyboard focus to lose
    if (
      !this.coarse &&
      !this.done &&
      this.state === "playing" &&
      !this.stage.contains(e.relatedTarget)
    ) {
      this.gamePause();
    }
  }

  _onPointer(e) {
    if (this.state !== "playing") {
      return;
    }
    const path = e.composedPath();
    for (let i = 0; i < path.length; i++) {
      const cl = path[i].classList;
      if (
        cl &&
        (cl.contains("dpad") ||
          cl.contains("overlay") ||
          cl.contains("popover"))
      ) {
        return;
      }
    }
    const r = this.stage.getBoundingClientRect();
    this.gameTap({ x: e.clientX - r.left, y: e.clientY - r.top });
  }

  _dpadDown(e) {
    e.preventDefault();
    const btn = e.currentTarget;
    try {
      btn.setPointerCapture(e.pointerId);
    } catch {
      // pointer capture is a nicety
    }
    this.gameStart();
    this.tapTarget = null;
    this.keys.add(btn.dataset.k);
  }

  _dpadUp(e) {
    this.keys.delete(e.currentTarget.dataset.k);
  }

  /**
   * The player character. Games pass size and speed; fire for a runner.
   */
  renderPlayer(o) {
    o = o || {};
    return html`<rpg-character
      id="player"
      seed="${this.playerSeed}"
      hat="${this.hat}"
      width="${o.width}"
      height="${o.height}"
      speed="${o.speed || 110}"
      ?fire="${o.fire}"
    ></rpg-character>`;
  }

  /**
   * The panel shown when the game is done. The game supplies what it earned:
   * summary text, a stats line, and body (a recap).
   *
   * Slots: finish replaces the default prompt box. finish-actions adds
   * controls beside Copy prompt and Play again. When finish is used the
   * default prompt box and its Copy button are left out.
   */
  renderFinishPanel(o) {
    o = o || {};
    const own = this._finishSlotted;
    const showPrompt = !own && this.prompt;
    return html`
      <section
        class="finish"
        part="finish"
        tabindex="-1"
        aria-labelledby="fin-tag"
      >
        <p class="fin-tag" id="fin-tag">${this.finishTitle}</p>
        <p class="fin-sum">${o.summary || this.finishText}</p>
        <p class="fin-stats">${o.stats || ""}</p>
        ${o.body || ""}
        <slot name="finish" @slotchange="${this._onFinishSlot}">
          ${showPrompt
            ? html`
                <p class="fin-lead">
                  ${this.finishLead || this.t.finishLeadDefault}
                </p>
                <div class="code">
                  <pre><code id="prompt">${this.prompt}</code></pre>
                </div>
              `
            : ""}
        </slot>
        <div class="row">
          ${showPrompt
            ? html`<button
                class="btn"
                type="button"
                @click="${this.copyPrompt}"
              >
                ${this._copied === "ok" ? this.t.copied : this.t.copy}
              </button>`
            : ""}
          <slot name="finish-actions"></slot>
          <button class="btn alt" type="button" @click="${this._reset}">
            ${this.t.playAgain}
          </button>
        </div>
        <p class="status" role="status">
          ${this._copied === "ok"
            ? this.t.copyNote
            : this._copied === "fail"
              ? this.t.copyFail
              : ""}
        </p>
      </section>
    `;
  }

  _onFinishSlot(e) {
    this._finishSlotted = e.target.assignedNodes({ flatten: true }).length > 0;
  }

  /**
   * "in 12.3 seconds", or nothing when there was no timing
   */
  timeText() {
    const secs = Math.round((this._ms || 0) / 100) / 10;
    return secs ? this.t.inTime + " " + secs + " " + this.t.seconds : "";
  }

  /**
   * Start, paused and editing screen drawn over the stage
   */
  renderOverlay() {
    if (this.state === "playing") {
      return "";
    }
    const l = this.labels;
    let title = l.idleTitle;
    let sub = l.idleSub;
    let action = l.start;
    if (this.isEmpty) {
      title = this.t.emptyTitle;
      sub = this.t.emptySub;
    } else if (this.editMode) {
      title = l.editing;
      sub = l.editingSub;
    } else if (this.state === "paused") {
      title = l.paused;
      sub = l.pausedSub;
      action = l.resume;
    }
    return html`
      <div class="overlay" @click="${this.gameStart}">
        <p class="ov-title">${title}</p>
        <p class="ov-sub">${sub}</p>
        ${this.editMode || this.isEmpty
          ? ""
          : html`<button class="btn big" type="button">${action}</button>`}
      </div>
    `;
  }

  /**
   * Four direction pad. Only shown on touch screens by the stylesheet.
   */
  renderDpad() {
    return html`
      <div class="dpad" aria-hidden="true">
        ${["u", "l", "d", "r"].map(
          (k) => html`
            <button
              type="button"
              tabindex="-1"
              class="${k}"
              data-k="${k}"
              @pointerdown="${this._dpadDown}"
              @pointerup="${this._dpadUp}"
              @pointercancel="${this._dpadUp}"
              @contextmenu="${(e) => e.preventDefault()}"
            >
              ${ARROWS[k]}
            </button>
          `,
        )}
      </div>
    `;
  }

  static get styles() {
    return [
      super.styles,
      gameChromeStyles,
      css`
        :host {
          display: block;
          container-type: inline-size;
          max-width: 900px;
          margin-inline: auto;
          color: var(--micro-game-ink);
          font-family: var(--ddd-font-primary);
          --micro-game-ink: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-limestoneMaxLight)
          );
          --micro-game-paper: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-nittanyNavy)
          );
          --micro-game-panel: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          --micro-game-soft: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneGray)
          );
          --micro-game-accent: light-dark(
            var(--ddd-theme-default-beaverBlue),
            var(--ddd-theme-default-pughBlue)
          );
          --micro-game-on-accent: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          --micro-game-shadow: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-black)
          );
        }
        :host([hidden]) {
          display: none;
        }
        [hidden] {
          display: none !important;
        }
        .sr {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
        }
        [data-game-stage],
        .overlay,
        .dpad,
        .nosel {
          -webkit-user-select: none;
          user-select: none;
          -webkit-touch-callout: none;
          -webkit-tap-highlight-color: transparent;
        }
        .overlay {
          position: absolute;
          inset: 0;
          z-index: 5;
          display: grid;
          place-content: center;
          justify-items: center;
          gap: var(--ddd-spacing-3);
          padding: var(--ddd-spacing-5);
          text-align: center;
          cursor: pointer;
          background: var(--micro-game-paper);
          background: color-mix(
            in srgb,
            var(--micro-game-paper) 88%,
            transparent
          );
        }
        .ov-title {
          margin: 0;
          font-family: var(--ddd-font-secondary);
          font-size: var(--ddd-font-size-s);
          font-weight: var(--ddd-font-weight-bold);
          text-wrap: balance;
        }
        .ov-sub {
          margin: 0;
          max-width: 46ch;
          text-wrap: balance;
          font-size: var(--ddd-font-size-4xs);
          color: var(--micro-game-soft);
        }
        .btn {
          min-height: 44px;
          padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
          border: var(--ddd-border-md);
          border-color: var(--micro-game-ink);
          background: var(--micro-game-accent);
          color: var(--micro-game-on-accent);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          cursor: pointer;
          box-shadow: var(--ddd-spacing-1) var(--ddd-spacing-1) 0
            var(--micro-game-shadow);
        }
        .btn:hover {
          transform: translate(1px, 1px);
          box-shadow: 3px 3px 0 var(--micro-game-shadow);
        }
        .btn:active {
          transform: translate(4px, 4px);
          box-shadow: none;
        }
        .btn:focus-visible {
          outline: var(--ddd-border-md);
          outline-color: var(--micro-game-ink);
          outline-offset: 3px;
        }
        .btn.alt {
          background: var(--micro-game-panel);
          color: var(--micro-game-ink);
        }
        .dpad {
          position: absolute;
          right: var(--ddd-spacing-2);
          bottom: var(--ddd-spacing-2);
          z-index: 4;
          display: none;
          grid-template-columns: repeat(3, 44px);
          grid-template-rows: repeat(2, 44px);
          gap: var(--ddd-spacing-1);
          opacity: 0.92;
        }
        @media (pointer: coarse) {
          .dpad {
            display: grid;
          }
        }
        .dpad button {
          width: 44px;
          height: 44px;
          padding: 0;
          border: var(--ddd-border-md);
          border-color: var(--micro-game-ink);
          background: var(--micro-game-panel);
          color: var(--micro-game-ink);
          font-size: var(--ddd-font-size-xs);
          touch-action: none;
        }
        .dpad button:active {
          background: var(--micro-game-accent);
          color: var(--micro-game-on-accent);
        }
        .dpad .u {
          grid-area: 1 / 2;
        }
        .dpad .l {
          grid-area: 2 / 1;
        }
        .dpad .d {
          grid-area: 2 / 2;
        }
        .dpad .r {
          grid-area: 2 / 3;
        }
      `,
    ];
  }
}
