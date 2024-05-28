import { css, html, unsafeCSS } from "lit";
import { SimpleToastEl } from "@haxtheweb/simple-toast/lib/simple-toast-el.js";
import "@haxtheweb/future-terminal-text/future-terminal-text.js";
import "@haxtheweb/simple-icon/lib/simple-icons";
import "@haxtheweb/simple-icon/simple-icon";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";

const SpeechBubbleL = new URL("./images/SpeechBubbleL.svg", import.meta.url)
  .href;
const SpeechBubbleMiddle = new URL(
  "./images/SpeechBubbleMiddle.svg",
  import.meta.url,
).href;
const SpeechBubbleR = new URL("./images/SpeechBubbleR.svg", import.meta.url)
  .href;
export class SuperDaemonToast extends SimpleToastEl {
  static get tag() {
    return "super-daemon-toast";
  }

  constructor() {
    super();
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
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          --simple-toast-z-index: 100000002;
        }
        :host([opened]) {
          display: flex;
        }

        future-terminal-text {
          min-width: 300px;
          overflow-wrap: break-all;
          text-overflow: ellipsis;
          line-height: 36px;
          font-size: 18px;
          text-align: left;
          padding: 36px 0px;
          max-width: 50vw;
        }

        .merlin {
          --simple-icon-height: 100px;
          --simple-icon-width: 100px;
          background-color: var(--simple-colors-default-theme-accent-1, white);
          display: block;
          height: 150px;
          width: 100px;
          margin: 6px 0 0 0;
          padding: 16px;
        }
        .awaiting-input {
          --simple-icon-height: 75px;
          --simple-icon-width: 75px;
          width: 100px;
          margin: 6px 0px 0px;
          padding: 16px;
          background-color: var(--simple-colors-default-theme-accent-2, white);
          color: var(--simple-colors-default-theme-purple-6, purple);
          vertical-align: middle;
          display: inline-flex;
          height: 100px;
        }
        :host([hidden]) {
          display: none;
        }
        :host {
          --simple-toast-bottom: 0px;
          --simple-toast-bottom-offscreen: -284px;
          height: 142px;
          display: none;
          width: var(--simple-toast-width, auto);
          color: var(
            --simple-toast-color,
            var(--simple-colors-default-theme-accent-12, black)
          );
          background-color: transparent;
          top: var(--simple-toast-top);
          margin: var(--simple-toast-margin, 4px);
          padding: var(--simple-toast-padding, 4px);
          bottom: var(--simple-toast-bottom, 36px);
          left: var(--simple-toast-left, 0px);
          border: var(--simple-toast-border);
          z-index: var(--simple-toast-z-index, 100000000);
          font-size: var(--simple-toast-font-size, 18px);
          font-family: "Press Start 2P", sans-serif;
          font-weight: bold;
          text-align: center;
          vertical-align: middle;
        }
        .bubble {
          height: 142px;
          display: inline-flex;
        }
        .mid {
          line-height: 142px;
          background-color: white;
          background-repeat: repeat-x;
          background-image: url("${unsafeCSS(SpeechBubbleMiddle)}");
        }
        .leftedge {
          background-image: url("${unsafeCSS(SpeechBubbleL)}");
          width: 24px;
          background-color: white;
          transform: scaleX(-1);
        }
        .rightedge {
          background-image: url("${unsafeCSS(SpeechBubbleR)}");
          width: 42px;
          background-color: white;
          transform: scaleX(-1.1);
        }
        :host([dark-mode]) .mid,
        :host([dark-mode]) .leftedge,
        :host([dark-mode]) .rightedge {
          filter: invert(1);
        }
      `,
    ];
  }
  hideSimpleToast(e) {
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
    };
  }

  render() {
    return html` <div class="bubble">
      ${this.awaitingMerlinInput
        ? html`<simple-icon-lite
            class="awaiting-input"
            icon="hax:loading"
          ></simple-icon-lite>`
        : html`
            <simple-icon
              class="merlin"
              icon="hax:wizard-hat"
              accent-color="purple"
            ></simple-icon>
          `}
      <span class="bubble rightedge"></span>
      <span class="bubble mid">
        <slot name="pre"></slot>
        ${this.future
          ? html` <future-terminal-text
              fadein
              glitch
              glitch-max="3"
              glitch-duration="40"
            ></future-terminal-text>`
          : html`${this.text}`}
        <slot></slot>
      </span>
      <span class="bubble leftedge"></span>
    </div>`;
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
    this.text = e.detail.text ? e.detail.text : "Saved";
    this.future = e.detail.future ? e.detail.future : false;
    this.classStyle = e.detail.classStyle ? e.detail.classStyle : "";
    this.eventCallback = e.detail.eventCallback ? e.detail.eventCallback : null;
    this.accentColor = e.detail.accentColor ? e.detail.accentColor : "grey";
    this.alwaysvisible = e.detail.alwaysvisible
      ? e.detail.alwaysvisible
      : false;
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
customElements.define(SuperDaemonToast.tag, SuperDaemonToast);
globalThis.SuperDaemonToast = globalThis.SuperDaemonToast || {};

globalThis.SuperDaemonToast.requestAvailability = () => {
  if (!globalThis.SuperDaemonToast.instance) {
    globalThis.SuperDaemonToast.instance = globalThis.document.createElement(
      SuperDaemonToast.tag,
    );
    globalThis.document.body.appendChild(globalThis.SuperDaemonToast.instance);
  }
  return globalThis.SuperDaemonToast.instance;
};
export const SuperDaemonToastInstance =
  globalThis.SuperDaemonToast.requestAvailability();
