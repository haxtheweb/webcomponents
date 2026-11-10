import { css, html, nothing } from "lit";
import { SimpleToastEl } from "@haxtheweb/simple-toast/lib/simple-toast-el.js";
import "@haxtheweb/future-terminal-text/future-terminal-text.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import {
  HaxUiAdminTokens,
  HaxUiAdminPrimitives,
  HaxUiDarkChromeDeclarations,
} from "@haxtheweb/d-d-d/lib/HaxUiAdminTokens.js";
import { HaxUiAdminIcons } from "@haxtheweb/d-d-d/lib/HaxUiAdminIcons.js";
import {
  merlinTraveler,
  MerlinWandStyles,
  SAY_STOP_LISTENING,
  SAY_DISABLE_SANTA,
} from "./super-daemon-hax-ui.js";

/**
 * The voice state the toast shows, from what callers already send.
 * - listening: Merlin is waiting for speech (awaitingMerlinInput)
 * - speaking: Merlin is talking (a merlin toast that is not waiting yet)
 * - message: anything else, such as the default "Saved"
 * @param {Object} toast the toast (or a detail-shaped object)
 * @returns {string} listening, speaking or message
 */
export function superDaemonToastVoiceState(toast) {
  const t = toast || {};
  if (t.awaitingMerlinInput) {
    return "listening";
  }
  if (t.merlin) {
    return "speaking";
  }
  return "message";
}

/**
 * `super-daemon-toast`
 * Merlin's voice card in the HAX UI admin style: the World Traveler mark,
 * a state pill (Listening, Speaking, Santa mode), the message, a hint of
 * what can be said, and a way to stop. Sits bottom left, apart from the
 * haxcms-toast that drops from the top bar.
 *
 * Same API as before: the super-daemon-toast-show / super-daemon-toast-hide
 * events and every detail field (text, duration, merlin, future,
 * awaitingMerlinInput, alwaysvisible, slot, eventCallback, accentColor,
 * fire, hat, walking, classStyle). Santa mode is read from the Merlin
 * instance, so callers send nothing new.
 * @element super-daemon-toast
 */
export class SuperDaemonToast extends I18NMixin(SimpleToastEl) {
  static get tag() {
    return "super-daemon-toast";
  }

  constructor() {
    super();
    this.t = {
      saved: "Saved",
      merlin: "Merlin",
      listeningState: "Listening",
      speakingState: "Speaking",
      santaModeState: "Santa mode",
      dismiss: "Dismiss",
      stopListening: "Stop listening",
      turnOffSantaMode: "Turn off Santa mode",
      sayACommand: "Say a command, or",
      toStopSay: "To stop, say",
    };
    this.registerLocalization({
      context: this,
      namespace: "super-daemon",
      basePath: import.meta.url + "/../../",
    });
    this.awaitingMerlinInput = false;
    this.windowControllers = new AbortController();
    this.text = "Saved";
    this.merlin = false;
    this.classStyle = "";
    this.future = false;
    this.duration = 3000;
    this.accentColor = "grey";
    this.dark = false;
    this.eventCallback = null;
    this.fire = false;
    this.hat = "coffee";
    this.walking = false;
    this.voiceState = "message";
    this.santa = false;
    // drawn once: each draw makes new mask ids
    this._mark = merlinTraveler();
  }

  static get styles() {
    return [
      super.styles,
      ...HaxUiAdminTokens,
      ...HaxUiAdminPrimitives,
      MerlinWandStyles,
      css`
        :host {
          --simple-toast-z-index: 100000003;
          --super-daemon-toast-gap: var(--hax-ui-gap-lg, 12px);
          position: fixed;
          top: auto;
          right: auto;
          left: var(--simple-toast-left, var(--super-daemon-toast-gap));
          bottom: var(--simple-toast-bottom, var(--super-daemon-toast-gap));
          z-index: var(--simple-toast-z-index, 100000003);
          width: min(400px, calc(100vw - 2 * var(--super-daemon-toast-gap)));
          min-width: 0;
          height: auto;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          /* HAX UI dark in every theme, like the top bar and Merlin */
          ${HaxUiDarkChromeDeclarations}
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--hax-ui-admin-font-size);
          font-weight: var(--ddd-font-weight-regular, 400);
          text-align: left;
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-surface);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius-lg);
          box-shadow: var(--hax-ui-shadow-popover);
          overflow: hidden;
          /* the state colour: the stripe, the tile, the timer */
          --super-daemon-toast-tone: var(--hax-ui-text-muted);
          --super-daemon-toast-tone-soft: var(--hax-ui-hover);
          --merlin-traveler-size: 28px;
        }
        :host([hidden]) {
          display: none;
        }
        :host([opened]) {
          display: block;
        }
        :host([voice-state="listening"]) {
          --super-daemon-toast-tone: var(--hax-ui-accent-strong);
          --super-daemon-toast-tone-soft: var(--hax-ui-accent-soft);
        }
        :host([voice-state="speaking"]) {
          --super-daemon-toast-tone: var(--hax-ui-info);
          --super-daemon-toast-tone-soft: var(--hax-ui-info-soft);
        }
        @media (max-width: 600px) {
          :host {
            --super-daemon-toast-gap: var(--hax-ui-gap-md, 8px);
            right: var(--super-daemon-toast-gap);
            width: auto;
          }
        }

        .card {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          grid-template-areas:
            "tile head close"
            "tile message message"
            "tile hint hint"
            "tile actions actions";
          column-gap: var(--hax-ui-gap-lg, 12px);
          padding: var(--hax-ui-gap-lg, 12px) var(--hax-ui-gap-md, 8px)
            var(--hax-ui-gap-lg, 12px) var(--hax-ui-gap-lg, 12px);
          box-shadow: inset 3px 0 0 var(--super-daemon-toast-tone);
        }
        .tile {
          grid-area: tile;
          align-self: start;
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border-radius: var(--hax-ui-radius-lg);
          color: var(--hax-ui-text);
          background-color: var(--super-daemon-toast-tone-soft);
        }
        /* Merlin lights up while he speaks, and glows while he listens */
        :host([voice-state="speaking"]) .merlin-traveler .lit,
        :host([voice-state="listening"]) .merlin-traveler .lit {
          opacity: 1;
        }
        @media (prefers-reduced-motion: no-preference) {
          :host([voice-state="listening"]) .merlin-traveler .halo {
            animation: merlin-traveler-glow 2.4s ease-in-out infinite;
          }
          :host([voice-state="listening"]) .merlin-traveler .bulb,
          :host([voice-state="listening"]) .merlin-traveler .lens {
            animation: merlin-traveler-pulse 2.4s ease-in-out infinite;
          }
        }
        .head {
          grid-area: head;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--hax-ui-gap-md, 8px);
          min-height: 28px;
          min-width: 0;
        }
        .who {
          font-size: var(--hax-ui-admin-font-size-xs);
          font-weight: var(--ddd-font-weight-bold, 700);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--hax-ui-text-muted);
        }
        .hax-ui-pill {
          gap: var(--hax-ui-gap);
          padding: 0 var(--hax-ui-gap-md) 0 var(--hax-ui-gap);
          font-weight: var(--ddd-font-weight-bold, 700);
          --simple-icon-width: 12px;
          --simple-icon-height: 12px;
        }
        /* listening is an outline in the accent, so it still reads apart
           from speaking (a fill) in greyscale */
        .hax-ui-pill[data-tone="listening"] {
          color: var(--hax-ui-accent-strong);
          background-color: var(--hax-ui-accent-soft);
          box-shadow: inset 0 0 0 1px currentColor;
        }
        .hax-ui-pill[data-tone="warning"] {
          box-shadow: inset 0 0 0 1px currentColor;
        }
        .message {
          grid-area: message;
          margin: var(--hax-ui-gap, 4px) 0 0;
          padding: 0;
          font-size: var(--ddd-font-size-4xs, 16px);
          font-weight: var(--ddd-font-weight-bold, 700);
          line-height: 1.35;
          white-space: normal;
          overflow-wrap: anywhere;
        }
        /* a plain message is one line beside the mark */
        :host([voice-state="message"]) .card {
          grid-template-areas: "tile message close";
          align-items: center;
        }
        :host([voice-state="message"]) .message {
          margin: 0;
        }
        future-terminal-text {
          display: block;
          min-width: 0;
          max-width: none;
          padding: 0;
          font-size: inherit;
          line-height: inherit;
        }
        .hint {
          grid-area: hint;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--hax-ui-gap-md, 8px);
          margin-top: var(--hax-ui-gap-md, 8px);
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
        }
        .hint .say {
          font-family: var(--ddd-font-mono, monospace);
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-sunken);
          border-radius: var(--hax-ui-radius);
          padding: 0 var(--hax-ui-gap);
        }
        /* activity, not a level reading: the browser speech API gives no
           audio level, so the bars say "the mic is open" */
        .meter {
          display: inline-flex;
          align-items: center;
          gap: var(--hax-ui-gap, 4px);
          height: 14px;
          color: var(--hax-ui-accent-strong);
        }
        .meter span {
          width: 3px;
          height: 6px;
          border-radius: var(--ddd-radius-xs, 4px);
          background-color: currentColor;
        }
        .meter span:nth-child(2) {
          height: 10px;
        }
        @media (prefers-reduced-motion: no-preference) {
          .meter span {
            animation: super-daemon-toast-meter 1s ease-in-out infinite;
          }
          .meter span:nth-child(2) {
            animation-delay: 0.15s;
          }
          .meter span:nth-child(3) {
            animation-delay: 0.3s;
          }
        }
        @keyframes super-daemon-toast-meter {
          0%,
          100% {
            transform: scaleY(0.5);
          }
          50% {
            transform: scaleY(1.3);
          }
        }
        .actions {
          grid-area: actions;
          display: flex;
          flex-wrap: wrap;
          gap: var(--hax-ui-gap-md, 8px);
          margin-top: var(--hax-ui-gap-md, 8px);
        }
        .actions button,
        .close {
          all: unset;
          box-sizing: border-box;
          cursor: pointer;
        }
        .actions button {
          display: inline-flex;
          align-items: center;
          gap: var(--hax-ui-gap, 4px);
          height: 28px;
          padding: 0 var(--hax-ui-gap-lg, 12px) 0 var(--hax-ui-gap-md, 8px);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius);
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--hax-ui-admin-font-size-xs);
          font-weight: var(--ddd-font-weight-bold, 700);
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-surface);
          --simple-icon-width: 14px;
          --simple-icon-height: 14px;
          transition: background-color var(--hax-ui-duration)
            var(--hax-ui-easing);
        }
        .actions button:hover {
          background-color: var(--hax-ui-hover);
        }
        .close {
          grid-area: close;
          align-self: start;
          width: 28px;
          height: 28px;
          display: grid;
          place-items: center;
          border-radius: var(--hax-ui-radius);
          color: var(--hax-ui-text-muted);
          --simple-icon-width: 18px;
          --simple-icon-height: 18px;
        }
        .close:hover {
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-hover);
        }
        .actions button:focus-visible,
        .close:focus-visible {
          outline: var(--hax-ui-focus-width, 2px) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }
        /* time left on a message that closes itself */
        .timer {
          height: 3px;
          background-color: var(--super-daemon-toast-tone-soft);
        }
        .timer span {
          display: block;
          height: 100%;
          width: 100%;
          transform-origin: left center;
          background-color: var(--super-daemon-toast-tone);
        }
        @media (prefers-reduced-motion: no-preference) {
          .timer span {
            animation: super-daemon-toast-time
              var(--super-daemon-toast-duration, 3000ms) linear forwards;
          }
        }
        @keyframes super-daemon-toast-time {
          from {
            transform: scaleX(1);
          }
          to {
            transform: scaleX(0);
          }
        }
        @media (forced-colors: active) {
          :host {
            border: 2px solid CanvasText;
          }
          .timer span,
          .meter span {
            background-color: Highlight;
          }
        }
      `,
    ];
  }

  hideSimpleToast(_e) {
    if (!this.alwaysvisible) {
      // tricks into closing via event in a graceful way
      this.style.animation = "forcedfadeout 0.6s .3s";
      this.awaitingMerlinInput = false;
      setTimeout(() => {
        this.hide();
      }, 0);
    }
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * Kept for compatibility. The card wears the HAX UI dark chrome in
       * every theme, so this no longer changes how it looks.
       */
      darkMode: {
        type: Boolean,
        reflect: true,
        attribute: "dark-mode",
      },
      fire: { type: Boolean },
      hat: { type: String },
      walking: { type: Boolean },
      /**
       * Opened state of the toast, use event to change
       */
      opened: {
        type: Boolean,
        reflect: true,
      },
      awaitingMerlinInput: {
        type: Boolean,
        attribute: "awaiting-merlin-input",
      },
      merlin: {
        type: Boolean,
      },
      future: {
        type: Boolean,
      },
      /**
       * Plain text based message to display
       */
      text: {
        type: String,
      },
      /**
       * Class name, fit-bottom being a useful one
       */
      classStyle: {
        type: String,
        attribute: "class-style",
      },
      /**
       * How long the toast message should be displayed
       */
      duration: {
        type: Number,
      },
      /**
       * Event callback when hide is called
       */
      eventCallback: {
        type: String,
        attribute: "event-callback",
      },
      /**
       * listening, speaking or message; worked out from the fields above
       */
      voiceState: {
        type: String,
        reflect: true,
        attribute: "voice-state",
      },
      /** Merlin is in Santa mode (always listening) */
      santa: {
        type: Boolean,
        reflect: true,
      },
    };
  }

  /**
   * The Merlin instance, when it is on the page. Looked up rather than
   * imported to avoid a circular dependency.
   */
  _merlin() {
    if (
      globalThis.SuperDaemonManager &&
      globalThis.SuperDaemonManager.instance
    ) {
      return globalThis.SuperDaemonManager.instance;
    }
    return null;
  }

  _renderPill() {
    if (this.voiceState === "listening") {
      return html`<span class="hax-ui-pill" data-tone="listening"
        ><simple-icon-lite icon="${HaxUiAdminIcons.voice}"></simple-icon-lite
        >${this.t.listeningState}</span
      >`;
    }
    if (this.voiceState === "speaking") {
      return html`<span class="hax-ui-pill" data-tone="info"
        ><simple-icon-lite icon="av:volume-up"></simple-icon-lite
        >${this.t.speakingState}</span
      >`;
    }
    return nothing;
  }

  _renderHint() {
    if (this.voiceState !== "listening") {
      return nothing;
    }
    return html`<div class="hint">
      <span class="meter" aria-hidden="true"
        ><span></span><span></span><span></span
      ></span>
      ${
        this.santa
          ? html`<span
              >${this.t.toStopSay}
              <span class="say">${SAY_DISABLE_SANTA}</span></span
            >`
          : html`<span
              >${this.t.sayACommand}
              <span class="say">${SAY_STOP_LISTENING}</span></span
            >`
      }
    </div>`;
  }

  _renderActions() {
    const merlin = this._merlin();
    if (!merlin) {
      return nothing;
    }
    if (this.santa) {
      return html`<div class="actions">
        <button type="button" @click="${this._turnOffSanta}">
          <simple-icon-lite icon="av:stop"></simple-icon-lite>
          ${this.t.turnOffSantaMode}
        </button>
      </div>`;
    }
    if (this.voiceState === "listening") {
      return html`<div class="actions">
        <button type="button" @click="${this._stopListening}">
          <simple-icon-lite icon="av:stop"></simple-icon-lite>
          ${this.t.stopListening}
        </button>
      </div>`;
    }
    return nothing;
  }

  _stopListening() {
    const merlin = this._merlin();
    if (merlin) {
      merlin.setListeningStatus(false);
    }
    this.awaitingMerlinInput = false;
    this.hideSimpleToast();
  }

  _turnOffSanta() {
    const merlin = this._merlin();
    if (merlin && merlin.santaMode) {
      merlin.toggleSantaMode();
    }
  }

  _close() {
    if (this.voiceState === "listening") {
      this._stopListening();
    } else {
      this.hideSimpleToast();
    }
  }

  render() {
    // an alwaysvisible (Santa) or listening card stays until stopped; a
    // message that closes itself shows the time it has left
    const timed =
      this.voiceState === "message" && !this.alwaysvisible && this.duration > 0;
    return html`<div class="card" role="status" aria-live="polite">
        <span class="tile" aria-hidden="true">${this._mark}</span>
        ${
          this.voiceState !== "message"
            ? html`<div class="head">
                <span class="who">${this.t.merlin}</span>
                ${this._renderPill()}
                ${
                  this.santa
                    ? html`<span class="hax-ui-pill" data-tone="warning"
                        ><simple-icon-lite icon="av:hearing"></simple-icon-lite
                        >${this.t.santaModeState}</span
                      >`
                    : nothing
                }
              </div>`
            : nothing
        }
        ${
          this.santa
            ? nothing
            : html`<button
                type="button"
                class="close"
                aria-label="${this.t.dismiss}"
                title="${this.t.dismiss}"
                @click="${this._close}"
              >
                <simple-icon-lite
                  icon="${HaxUiAdminIcons.close}"
                ></simple-icon-lite>
              </button>`
        }
        <div class="message">
          <slot name="pre"></slot>
          ${
            this.future
              ? html`<future-terminal-text
                  fadein
                  glitch
                  glitch-max="3"
                  glitch-duration="40"
                ></future-terminal-text>`
              : html`${this.text}`
          }
          <slot></slot>
        </div>
        ${this._renderHint()} ${this._renderActions()}
      </div>
      ${
        timed
          ? html`<div
              class="timer"
              style="--super-daemon-toast-duration: ${this.duration}ms"
              aria-hidden="true"
            >
              <span></span>
            </div>`
          : nothing
      }`;
  }

  willUpdate(changedProperties) {
    if (super.willUpdate) {
      super.willUpdate(changedProperties);
    }
    if (
      changedProperties.has("awaitingMerlinInput") ||
      changedProperties.has("merlin") ||
      changedProperties.has("opened") ||
      changedProperties.has("alwaysvisible")
    ) {
      this.voiceState = superDaemonToastVoiceState(this);
      const merlin = this._merlin();
      this.santa = !!(merlin && merlin.santaMode && this.merlin);
    }
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    // can't write here in template bc it's a vanilla innerHTML which would have Lit
    // directives in it and we don't want to ingest and rewrite those
    if (
      changedProperties.has("text") &&
      this.future &&
      this.shadowRoot.querySelector("future-terminal-text")
    ) {
      this.shadowRoot.querySelector("future-terminal-text").innerText =
        this.text;
      this.shadowRoot.querySelector("future-terminal-text")._doGlitch();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.windowControllers.signal.aborted) {
      this.windowControllers = new AbortController();
    }
    globalThis.addEventListener(
      "super-daemon-toast-hide",
      this.hideSimpleToast.bind(this),
      { signal: this.windowControllers.signal },
    );
    globalThis.addEventListener(
      "super-daemon-toast-show",
      this.showSimpleToast.bind(this),
      { signal: this.windowControllers.signal },
    );
  }

  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    this.windowControllers.abort();
    super.disconnectedCallback();
  }

  /**
   * Show / available callback
   */
  showSimpleToast(e) {
    // wipe slot
    while (this.firstChild !== null) {
      this.removeChild(this.firstChild);
    }
    setTimeout(() => {
      if (e.detail.slot) {
        this.appendChild(e.detail.slot);
      }
    }, 0);
    // force this element to be hidden prior to showing it
    this.duration = e.detail.duration ? e.detail.duration : 4000;
    this.fire = e.detail.fire ? e.detail.fire : false;
    this.hat = e.detail.hat ? e.detail.hat : "coffee";
    this.merlin = e.detail.merlin ? e.detail.merlin : false;
    this.walking = e.detail.walking ? e.detail.walking : false;
    this.text = e.detail.text ? e.detail.text : this.t.saved;
    this.future = e.detail.future ? e.detail.future : false;
    this.classStyle = e.detail.classStyle ? e.detail.classStyle : "";
    this.eventCallback = e.detail.eventCallback ? e.detail.eventCallback : null;
    this.accentColor = e.detail.accentColor ? e.detail.accentColor : "grey";
    this.alwaysvisible = e.detail.alwaysvisible
      ? e.detail.alwaysvisible
      : false;
    // Santa mode can flip between two toasts with the same fields, so read
    // it again on every show
    const merlin = this._merlin();
    this.santa = !!(merlin && merlin.santaMode && this.merlin);
    // already open and waiting for input, don't do anything
    if (e.detail.awaitingMerlinInput && this.duration) {
      // should appear to switch into waiting for input mode prior to closing state
      setTimeout(() => {
        this.style.animation = "none";
        this.awaitingMerlinInput = e.detail.awaitingMerlinInput;
      }, this.duration / 2);
    } else {
      this.awaitingMerlinInput = false;
    }
    this.show();
  }

  show() {
    if (!this.opened) {
      this.style.animation =
        "fadein 0.3s, fadeout 0.6s " + this.duration / 1000 + "s";
      this.opened = true;
    }
  }

  hide() {
    if (!this.awaitingMerlinInput) {
      if (this.eventCallback) {
        const evt = new CustomEvent(this.eventCallback, {
          bubbles: true,
          cancelable: true,
          detail: true,
          composed: true,
        });
        this.dispatchEvent(evt);
      }
      if (!this.alwaysvisible) {
        this.opened = false;
      } else {
        this.style.animation = "fadein 0.3s";
      }
    } else {
      this.style.animation = "fadein 0.3s";
    }
  }
}
globalThis.customElements.define(SuperDaemonToast.tag, SuperDaemonToast);
globalThis.SuperDaemonToast = globalThis.SuperDaemonToast || {};

globalThis.SuperDaemonToast.requestAvailability = () => {
  if (!globalThis.SuperDaemonToast.instance) {
    globalThis.SuperDaemonToast.instance = globalThis.document.createElement(
      SuperDaemonToast.tag,
    );
    if (globalThis.document && globalThis.document.body) {
      globalThis.document.body.appendChild(
        globalThis.SuperDaemonToast.instance,
      );
    }
  }
  return globalThis.SuperDaemonToast.instance;
};
export const SuperDaemonToastInstance =
  globalThis.SuperDaemonToast.requestAvailability();
