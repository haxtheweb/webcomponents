import { autorun, toJS } from "mobx";
import { css, html, nothing } from "lit";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import {
  HaxUiAdminTokens,
  HaxUiAdminPrimitives,
} from "@haxtheweb/hax-body/lib/hax-ui-styles.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import { store } from "./haxcms-site-store.js";
import { RPGCharacterToast } from "./ui/rpg-character-toast/rpg-character-toast.js";

/** tones a toast can take; anything else reads as info */
const TONES = ["info", "success", "warning", "danger", "working", "assistant"];

/**
 * The tone of a toast from what callers already send. An explicit
 * `tone` wins; otherwise the hat and flags that every existing call uses
 * say it: the error hat is a problem, the construction hat or a walking
 * character is work in progress, Merlin is the assistant.
 * @param {Object} detail haxcms-toast-show detail
 * @returns {string} one of TONES
 */
export function haxcmsToastTone(detail) {
  const d = detail || {};
  if (typeof d.tone === "string" && TONES.indexOf(d.tone) !== -1) {
    return d.tone;
  }
  if (d.merlin) {
    return "assistant";
  }
  if (d.hat === "error") {
    return "danger";
  }
  if (d.hat === "construction" || d.walking) {
    return "working";
  }
  if (d.hat === "save" || d.hat === "good") {
    return "success";
  }
  return "info";
}

/**
 * `haxcms-toast`
 * The HAXcms toast in the HAX UI admin style (haxtheweb/issues#3180): a
 * card with the person's RPG character, the message, any actions a caller
 * slots in, a close button and a bar that shows the time left.
 *
 * Same API as before: store.toast() / HAXStore.toast(), the
 * haxcms-toast-show / haxcms-toast-hide events and every detail field
 * (text, duration, hat, fire, walking, speed, merlin, future,
 * awaitingMerlinInput, alwaysvisible, slot, closeText, eventCallback).
 * New and optional: `tone` (info, success, warning, danger, working,
 * assistant), otherwise worked out by haxcmsToastTone().
 *
 * - The timer pauses while the pointer is over the toast or focus is in
 *   it, so there is time to read it and use its actions (WCAG 2.2.1).
 * - duration 0 keeps it open until it is closed.
 * - danger is announced as an alert, everything else as a status.
 * - Esc closes it while focus is inside; it never takes focus itself.
 * @element haxcms-toast
 */
export class HAXCMSToast extends I18NMixin(RPGCharacterToast) {
  static get tag() {
    return "haxcms-toast";
  }

  static get properties() {
    return {
      ...super.properties,
      /** info, success, warning, danger, working or assistant */
      tone: { type: String, reflect: true },
      /** timer paused while hovered or focused */
      paused: { type: Boolean, reflect: true },
      /** fading out */
      leaving: { type: Boolean, reflect: true },
      /** stays until closed (duration 0 or alwaysvisible) */
      sticky: { type: Boolean, reflect: true },
      userName: { type: String },
    };
  }

  static get styles() {
    return [
      super.styles,
      ...HaxUiAdminTokens,
      ...HaxUiAdminPrimitives,
      css`
        :host {
          /* where it sits: under the top bar on the right, or a sheet at
             the bottom of a phone */
          --haxcms-toast-gap: var(--hax-ui-gap-lg, 12px);
          --simple-toast-z-index: 100000004;
          position: fixed;
          top: var(
            --haxcms-toast-top,
            calc(var(--top-bar-height, 64px) + var(--haxcms-toast-gap))
          );
          right: var(--haxcms-toast-right, var(--haxcms-toast-gap));
          left: auto;
          bottom: auto;
          z-index: var(--simple-toast-z-index);
          width: min(420px, calc(100vw - 2 * var(--haxcms-toast-gap)));
          min-width: 0;
          height: auto;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          color-scheme: var(--hax-ui-color-scheme, inherit);
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--hax-ui-admin-font-size);
          text-align: left;
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-surface);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius-lg);
          box-shadow: var(--hax-ui-shadow-popover);
          overflow: hidden;
          /* the tone colour: a stripe on the left, the bar, the icon */
          --haxcms-toast-tone: var(--hax-ui-accent-strong);
          --haxcms-toast-tone-soft: var(--hax-ui-accent-soft);
          /* proposed --hax-ui-warning(-soft) and --hax-ui-success-soft,
             written as DDD values until adopted */
          --haxcms-toast-warning: light-dark(#8a5300, #ffcf80);
          --haxcms-toast-assistant: light-dark(
            var(--ddd-theme-default-wonderPurple, #6e2b9e),
            #d8b4f8
          );
          --simple-toast-slide-offset-y: -12px;
        }
        :host([opened]) {
          display: block;
        }
        :host([tone="success"]) {
          --haxcms-toast-tone: var(--hax-ui-success);
          --haxcms-toast-tone-soft: color-mix(
            in srgb,
            var(--hax-ui-success) 14%,
            transparent
          );
        }
        :host([tone="warning"]) {
          --haxcms-toast-tone: var(--haxcms-toast-warning);
          --haxcms-toast-tone-soft: color-mix(
            in srgb,
            var(--haxcms-toast-warning) 14%,
            transparent
          );
        }
        :host([tone="danger"]) {
          --haxcms-toast-tone: var(--hax-ui-danger);
          --haxcms-toast-tone-soft: var(--hax-ui-danger-soft);
        }
        :host([tone="assistant"]) {
          --haxcms-toast-tone: var(--haxcms-toast-assistant);
          --haxcms-toast-tone-soft: color-mix(
            in srgb,
            var(--haxcms-toast-assistant) 14%,
            transparent
          );
        }
        :host([leaving]) {
          animation: haxcms-toast-out var(--hax-ui-duration, 150ms) ease-in
            forwards;
        }
        @keyframes haxcms-toast-out {
          to {
            opacity: 0;
            transform: translateY(var(--simple-toast-slide-offset-y));
          }
        }
        @media (max-width: 600px) {
          :host {
            --haxcms-toast-gap: var(--hax-ui-gap-md, 8px);
            --simple-toast-slide-offset-y: 16px;
            top: auto;
            right: var(--haxcms-toast-gap);
            left: var(--haxcms-toast-gap);
            bottom: calc(
              var(--haxcms-toast-gap) + env(safe-area-inset-bottom, 0px)
            );
            width: auto;
          }
        }

        .card {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          grid-template-areas:
            "avatar body close"
            "avatar actions actions";
          column-gap: var(--hax-ui-gap-lg, 12px);
          padding: var(--hax-ui-gap-lg, 12px) var(--hax-ui-gap-md, 8px)
            var(--hax-ui-gap-lg, 12px) var(--hax-ui-gap-lg, 12px);
          box-shadow: inset 3px 0 0 var(--haxcms-toast-tone);
        }
        .avatar {
          grid-area: avatar;
          position: relative;
          width: 44px;
          height: 44px;
          border-radius: var(--hax-ui-radius, 6px);
          background-color: var(--haxcms-toast-tone-soft);
          display: grid;
          place-items: center;
          overflow: visible;
        }
        .avatar rpg-character {
          width: 40px;
          height: 40px;
          overflow: hidden;
          border-radius: var(--hax-ui-radius, 6px);
        }
        .avatar rpg-character::part(rpg-character-item) {
          width: 100%;
          height: 100%;
        }
        .avatar .merlin-icon {
          --simple-icon-width: 28px;
          --simple-icon-height: 28px;
          color: var(--haxcms-toast-tone);
        }
        /* the tone, as a small badge on the character's corner */
        .badge {
          position: absolute;
          right: -6px;
          bottom: -6px;
          width: 20px;
          height: 20px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: var(--hax-ui-surface);
          background-color: var(--haxcms-toast-tone);
          box-shadow: 0 0 0 2px var(--hax-ui-surface);
          --simple-icon-width: 13px;
          --simple-icon-height: 13px;
        }
        :host([tone="working"]) .badge simple-icon-lite {
          animation: haxcms-toast-spin 1s linear infinite;
        }
        @keyframes haxcms-toast-spin {
          to {
            transform: rotate(360deg);
          }
        }
        .body {
          grid-area: body;
          align-self: center;
          min-width: 0;
          padding: 2px 0;
        }
        .message {
          margin: 0;
          height: auto;
          max-height: none;
          padding: 0;
          font-size: var(--hax-ui-admin-font-size, 14px);
          font-weight: var(--ddd-font-weight-regular, 400);
          line-height: 1.4;
          text-align: left;
          white-space: normal;
          overflow: visible;
          overflow-wrap: anywhere;
        }
        future-terminal-text {
          display: block;
          min-width: 0;
          max-width: none;
          padding: 0;
          font-size: var(--hax-ui-admin-font-size, 14px);
          line-height: 1.4;
        }
        .thinking {
          display: inline-flex;
          gap: 3px;
          margin-left: var(--hax-ui-gap, 4px);
          vertical-align: middle;
        }
        .thinking span {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background-color: var(--haxcms-toast-tone);
          animation: haxcms-toast-dot 1.2s ease-in-out infinite;
        }
        .thinking span:nth-child(2) {
          animation-delay: 0.15s;
        }
        .thinking span:nth-child(3) {
          animation-delay: 0.3s;
        }
        @keyframes haxcms-toast-dot {
          0%,
          80%,
          100% {
            opacity: 0.25;
          }
          40% {
            opacity: 1;
          }
        }
        .close {
          all: unset;
          grid-area: close;
          box-sizing: border-box;
          cursor: pointer;
          align-self: start;
          width: 28px;
          height: 28px;
          display: grid;
          place-items: center;
          border-radius: var(--hax-ui-radius, 6px);
          color: var(--hax-ui-text-muted);
          --simple-icon-width: 18px;
          --simple-icon-height: 18px;
        }
        .close:hover {
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-hover);
        }
        .close:focus-visible {
          outline: var(--hax-ui-focus-width, 2px) solid var(--hax-ui-focus);
          outline-offset: 1px;
        }
        .actions {
          grid-area: actions;
          display: flex;
          flex-wrap: wrap;
          gap: var(--hax-ui-gap-md, 8px);
          margin-top: var(--hax-ui-gap-md, 8px);
        }
        .actions:not(.has) {
          display: none;
        }
        /* buttons and links a caller slots in look like HAX UI buttons */
        ::slotted(button),
        ::slotted(a) {
          all: unset;
          box-sizing: border-box;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: var(--hax-ui-gap, 4px);
          height: 30px;
          padding: 0 var(--hax-ui-gap-lg, 12px);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius, 6px);
          font-size: 13px;
          font-weight: var(--ddd-font-weight-medium, 500);
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-surface);
        }
        ::slotted(button:hover),
        ::slotted(a:hover) {
          background-color: var(--hax-ui-hover);
        }
        ::slotted(button:focus-visible),
        ::slotted(a:focus-visible) {
          outline: var(--hax-ui-focus-width, 2px) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }
        /* the spinner callers slot for "Processing" is drawn by the
           working tone already */
        :host([tone="working"])
          ::slotted(simple-icon-lite[icon="hax:loading"]) {
          display: none;
        }
        /* time left; paused while hovered or focused */
        .timer {
          height: 3px;
          background-color: var(--haxcms-toast-tone-soft);
        }
        .timer span {
          display: block;
          height: 100%;
          width: 100%;
          transform-origin: left center;
          background-color: var(--haxcms-toast-tone);
          animation: haxcms-toast-time var(--haxcms-toast-duration, 4000ms)
            linear forwards;
        }
        :host([paused]) .timer span {
          animation-play-state: paused;
        }
        @keyframes haxcms-toast-time {
          from {
            transform: scaleX(1);
          }
          to {
            transform: scaleX(0);
          }
        }
        /* working: an indeterminate bar instead of a countdown */
        :host([tone="working"]) .timer span {
          width: 40%;
          animation: haxcms-toast-work 1.4s ease-in-out infinite;
        }
        @keyframes haxcms-toast-work {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(250%);
          }
        }
        :host([sticky]:not([tone="working"])) .timer {
          display: none;
        }
        @media (prefers-reduced-motion: reduce) {
          :host([leaving]),
          .thinking span,
          :host([tone="working"]) .badge simple-icon-lite,
          :host([tone="working"]) .timer span {
            animation: none;
          }
          :host([tone="working"]) .timer span {
            width: 100%;
            opacity: 0.6;
          }
        }
        @media (forced-colors: active) {
          :host {
            border: 2px solid CanvasText;
          }
          .timer span,
          .badge {
            background-color: Highlight;
          }
        }
      `,
    ];
  }

  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      close: "Close",
      info: "Info",
      success: "Done",
      warning: "Warning",
      danger: "Problem",
      working: "Working",
      assistant: "Merlin",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../../locales/", import.meta.url).href,
    });
    this.windowControllers = new AbortController();
    this.characterHeight = 40;
    this.characterWidth = 40;
    this.tone = "info";
    this.paused = false;
    this.leaving = false;
    this.sticky = false;
    this.__remaining = 0;
    this.__startedAt = 0;
    this.__timer = null;
    this.__leaveTimer = null;
    this._onPause = this._onPause.bind(this);
    this._onResume = this._onResume.bind(this);
    this._onKeydown = this._onKeydown.bind(this);
    autorun(() => {
      const _mobx_val_0 = toJS(store.userData.userName);
      Promise.resolve().then(() => {
        this.userName = _mobx_val_0;
      });
    });
    autorun(() => {
      const _mobx_val_0 = toJS(store.darkMode);
      Promise.resolve().then(() => {
        this.darkMode = _mobx_val_0;
      });
    });
  }

  connectedCallback() {
    super.connectedCallback();
    const signal = this.windowControllers.signal;
    globalThis.addEventListener(
      "haxcms-toast-hide",
      this.hideSimpleToast.bind(this),
      { signal },
    );
    globalThis.addEventListener(
      "haxcms-toast-show",
      this.showSimpleToast.bind(this),
      { signal },
    );
    this.addEventListener("pointerenter", this._onPause, { signal });
    this.addEventListener("pointerleave", this._onResume, { signal });
    this.addEventListener("focusin", this._onPause, { signal });
    this.addEventListener("focusout", this._onResume, { signal });
    this.addEventListener("keydown", this._onKeydown, { signal });
  }

  disconnectedCallback() {
    this._clearTimers();
    this.windowControllers.abort();
    super.disconnectedCallback();
  }

  showSimpleToast(e) {
    const detail = e && e.detail ? e.detail : {};
    super.showSimpleToast(e);
    // the base class reads a 0 duration as "use the default"; 0 means
    // "stay until closed", as callers like view-only mode expect
    if (detail.duration === 0) {
      this.duration = 0;
    }
    if (detail.closeText) {
      this.closeText = detail.closeText;
    }
    this.tone = haxcmsToastTone(detail);
    this.sticky = !this.duration || !!this.alwaysvisible;
    this.setAttribute("role", this.tone === "danger" ? "alert" : "status");
    this.setAttribute(
      "aria-live",
      this.tone === "danger" ? "assertive" : "polite",
    );
    this._startTimer(this.duration);
  }

  hideSimpleToast(_e) {
    if (!this.alwaysvisible) {
      this.awaitingMerlinInput = false;
      this.hide();
    }
  }

  /** entrance only; the exit is timed here so it can pause */
  _getAnimation() {
    if (this._prefersReducedMotion()) {
      return "none";
    }
    return "fadein 0.2s";
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    // the base class starts its own dismiss timer on open; this toast
    // keeps one timer that can pause
    if (changedProperties.has("opened") && this.__dismissTimer) {
      clearTimeout(this.__dismissTimer);
      this.__dismissTimer = null;
    }
  }

  _clearTimers() {
    if (this.__timer) {
      clearTimeout(this.__timer);
      this.__timer = null;
    }
    if (this.__leaveTimer) {
      clearTimeout(this.__leaveTimer);
      this.__leaveTimer = null;
    }
  }

  _startTimer(duration) {
    this._clearTimers();
    this.leaving = false;
    this.paused = false;
    this.__remaining = duration || 0;
    this.style.setProperty("--haxcms-toast-duration", `${duration || 0}ms`);
    // restart the bar
    const bar = this.shadowRoot
      ? this.shadowRoot.querySelector(".timer span")
      : null;
    if (bar) {
      bar.style.animation = "none";
      // reading layout restarts the CSS animation
      bar.getBoundingClientRect();
      bar.style.animation = "";
    }
    if (this.sticky) {
      return;
    }
    this.__startedAt = Date.now();
    this.__timer = setTimeout(() => this._expire(), this.__remaining);
  }

  _expire() {
    this.__timer = null;
    if (this.awaitingMerlinInput || this.alwaysvisible) {
      return;
    }
    this._leave();
  }

  /** fade out, then hide (eventCallback and all, as before) */
  _leave() {
    if (this._prefersReducedMotion()) {
      this.hide();
      return;
    }
    this.leaving = true;
    this.__leaveTimer = setTimeout(() => {
      this.__leaveTimer = null;
      this.leaving = false;
      this.hide();
    }, 160);
  }

  _onPause() {
    if (this.sticky || this.paused || !this.__timer) {
      return;
    }
    this.paused = true;
    clearTimeout(this.__timer);
    this.__timer = null;
    this.__remaining = Math.max(
      0,
      this.__remaining - (Date.now() - this.__startedAt),
    );
  }

  _onResume(e) {
    if (!this.paused) {
      return;
    }
    // still inside: focus moving between its parts, or the pointer left
    // while focus stays in it
    if (e && e.type === "pointerleave" && this.matches(":focus-within")) {
      return;
    }
    if (
      e &&
      e.type === "focusout" &&
      ((e.relatedTarget && this.contains(e.relatedTarget)) ||
        this.matches(":hover"))
    ) {
      return;
    }
    this.paused = false;
    this.__startedAt = Date.now();
    this.__timer = setTimeout(() => this._expire(), this.__remaining);
  }

  _onKeydown(e) {
    if (e.key === "Escape") {
      e.stopPropagation();
      this._close();
    }
  }

  _close() {
    this.awaitingMerlinInput = false;
    this._clearTimers();
    this.hide();
  }

  hide() {
    this._clearTimers();
    this.leaving = false;
    this.paused = false;
    // closing sets opened to false, and the base class answers that by
    // calling hide() again: once is enough, so eventCallback fires once
    if (!this.opened) {
      this.classList.remove("show");
      return;
    }
    super.hide();
  }

  _toneIcon() {
    switch (this.tone) {
      // hax:admin-check / -warning / -refresh once the admin icon family
      // is on master
      case "success":
        return "check";
      case "warning":
      case "danger":
        return "notification:priority-high";
      case "working":
        return "autorenew";
      default:
        return "";
    }
  }

  _onSlotChange(e) {
    const slot = e.target;
    const has = slot
      .assignedNodes({ flatten: true })
      .some(
        (n) =>
          n.nodeType === 1 &&
          !(
            this.tone === "working" &&
            n.tagName === "SIMPLE-ICON-LITE" &&
            n.getAttribute("icon") === "hax:loading"
          ),
      );
    const wrap = this.shadowRoot.querySelector(".actions");
    if (wrap) {
      wrap.classList.toggle("has", has);
    }
  }

  render() {
    const icon = this._toneIcon();
    return html`
      <div class="card" part="card">
        <div class="avatar" part="avatar">
          ${this.merlin
            ? html`<simple-icon-lite
                class="merlin-icon"
                icon="hax:wizard-hat"
                aria-hidden="true"
              ></simple-icon-lite>`
            : html`<rpg-character
                height="${this.characterHeight}"
                width="${this.characterWidth}"
                seed="${this.userName || ""}"
                ?fire="${this.fire}"
                hat="${this.hat}"
                speed="${this.speed}"
                part="rpg-character"
                ?walking="${this.walking}"
                aria-hidden="true"
              ></rpg-character>`}
          ${icon
            ? html`<span class="badge" aria-hidden="true"
                ><simple-icon-lite icon="${icon}"></simple-icon-lite
              ></span>`
            : nothing}
        </div>
        <div class="body">
          ${this.tone !== "info"
            ? html`<span class="hax-ui-sr-only">${this.t[this.tone]}:</span>`
            : nothing}
          <slot name="pre"></slot>
          ${this.future
            ? html`<future-terminal-text
                fadein
                glitch
                glitch-max="3"
                glitch-duration="40"
              ></future-terminal-text>`
            : html`<p class="message">
                ${this.text}${this.awaitingMerlinInput
                  ? html`<span class="thinking" aria-hidden="true"
                      ><span></span><span></span><span></span
                    ></span>`
                  : nothing}
              </p>`}
        </div>
        <button
          type="button"
          class="close"
          part="close"
          aria-label="${this.closeText || this.t.close}"
          title="${this.closeText || this.t.close}"
          @click="${this._close}"
        >
          <simple-icon-lite icon="close" aria-hidden="true"></simple-icon-lite>
        </button>
        <div class="actions" part="actions">
          <slot @slotchange="${this._onSlotChange}"></slot>
        </div>
      </div>
      <div class="timer" part="timer" aria-hidden="true"><span></span></div>
    `;
  }
}
globalThis.customElements.define(HAXCMSToast.tag, HAXCMSToast);
globalThis.HAXCMSToast = globalThis.HAXCMSToast || {};

globalThis.HAXCMSToast.requestAvailability = () => {
  if (!globalThis.HAXCMSToast.instance) {
    globalThis.HAXCMSToast.instance = globalThis.document.createElement(
      HAXCMSToast.tag,
    );
    if (globalThis.document && globalThis.document.body) {
      globalThis.document.body.appendChild(globalThis.HAXCMSToast.instance);
    }
  }
  return globalThis.HAXCMSToast.instance;
};
export const HAXCMSToastInstance = globalThis.HAXCMSToast.requestAvailability();
