/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement } from "lit";
import { Hal9000Listener, halIsEcho } from "./lib/hal-9000-listener.js";

/**
 * `hal-9000`
 * @element hal-9000
 * `Robot assistant tag, hopefully not evil`
 *
 * Listens for spoken commands and speaks back. Commands use the phrase
 * syntax `(optional words)`, `:named` and `*splat`, keyed by phrase with a
 * callback as the value.
 *
 * Beyond running commands it reports what it hears, so a page can react
 * to speech that is not a command:
 * - `hal-9000-interim` detail { text }: words so far, at most once a frame
 * - `hal-9000-no-match` detail { alternatives }: a final result no command
 *   took, best guess first
 * - `hal-9000-matched` detail { phrase, transcript, params }
 * - `hal-9000-listening-state` detail { state }: idle, listening, blocked
 *   (mic permission denied) or unavailable (the browser has the API but
 *   cannot recognize speech, as in Brave; lasts until the page reloads)
 *
 * @demo demo/index.html
 */
class Hal9000 extends LitElement {
  // properties available to the custom element for data binding
  static get properties() {
    return {
      toast: {
        type: Boolean,
        reflect: true,
      },
      /**
       * Commands to listen for and take action on
       */
      commands: {
        name: "commands",
        type: Object,
      },
      /**
       * Words and phrases to favor when recognizing speech, such as command
       * names. Used only where the browser supports phrase biasing.
       */
      phrases: {
        type: Array,
      },
      /**
       * The name that HAL 9000 should respond to.
       */
      respondsTo: {
        name: "respondsTo",
        type: String,
        attribute: "responds-to",
        reflect: true,
      },
      /**
       * Log what is heard and matched to the console
       */
      debug: {
        name: "debug",
        type: Boolean,
      },
      /**
       * Start automatically
       */
      auto: {
        name: "auto",
        type: Boolean,
        reflect: true,
      },
      /**
       * Status of listening
       */
      enabled: {
        name: "enabled",
        type: Boolean,
        reflect: true,
      },
      /**
       * Pitch of speech
       */
      pitch: {
        name: "pitch",
        type: Number,
        reflect: true,
      },
      /**
       * Rate of speech
       */
      rate: {
        name: "rate",
        type: Number,
        reflect: true,
      },
      /**
       * Language of the speaker
       */
      language: {
        name: "language",
        type: String,
        reflect: true,
      },
      /**
       * True while speaking; reflected for styling
       */
      speaking: {
        type: Boolean,
        reflect: true,
      },
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "hal-9000";
  }
  /**
   * Establish the element
   */
  constructor() {
    super();
    this.toast = false;
    this.auto = false;
    this.enabled = false;
    this.speaking = false;
    this.windowControllers = new AbortController();
    this.commands = {};
    this.phrases = [];
    this.respondsTo = "(merlin)";
    this.debug = false;
    this.pitch = 0.9;
    this.rate = 0.9;
    this.language = globalThis.navigator.language;
    this.__text = "";
    this.__echoUntil = 0;
    // ensure singleton is set
    globalThis.Hal9000 = globalThis.Hal9000 || {};
    globalThis.Hal9000.instance = this;
    this.listener = new Hal9000Listener({
      lang: this.language,
      debug: this.debug,
      isEcho: (text) => this._isEcho(text),
      onSpeechStart: () => this._bargeIn(""),
      onInterim: (text) => {
        this._bargeIn(text);
        this._fire("hal-9000-interim", { text: text });
      },
      onMatch: (detail) => this._fire("hal-9000-matched", detail),
      onNoMatch: (alternatives) =>
        this._fire("hal-9000-no-match", { alternatives: alternatives }),
      onStateChange: (state) => {
        // nothing more to listen for here; keep enabled honest
        if (state === "unavailable" || state === "blocked") {
          this.enabled = false;
        }
        this._fire("hal-9000-listening-state", { state: state });
      },
    });
    // check for speech synthesis API
    if (typeof globalThis.speechSynthesis !== "undefined") {
      this.synth = globalThis.speechSynthesis;
    }
  }
  /**
   * The browser can listen: it has SpeechRecognition and it has not
   * proven unusable in this session
   */
  get canListen() {
    return this.listener.available;
  }
  _fire(name, detail) {
    this.dispatchEvent(
      new CustomEvent(name, {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: detail,
      }),
    );
  }
  /**
   * Our own voice coming back through the speakers is not a command. Holds
   * for a moment after speech ends, since engines report late.
   */
  _isEcho(text) {
    if (!this.__text) {
      return false;
    }
    if (!this.speaking && Date.now() > this.__echoUntil) {
      return false;
    }
    return halIsEcho(text, this.__text);
  }
  /**
   * Someone started talking over us: stop talking so they can be heard.
   * Only when what we hear is not our own voice.
   */
  _bargeIn(text) {
    if (!this.speaking || !this.synth) {
      return;
    }
    if (text && !this._isEcho(text)) {
      this.synth.cancel();
    }
  }
  /**
   * Notice new voice commands added
   */
  _commandsChanged(newValue) {
    this.addCommands(newValue);
  }
  /**
   * Replace the commands being listened for
   */
  addCommands(commands) {
    this.listener.setCommands(commands || {});
  }
  /**
   * And the word was good.
   */
  speak(text, alwaysvisible = false, awaitingInput = true) {
    return new Promise((resolve) => {
      this.__text = text;
      if (this.synth) {
        this.utter = new SpeechSynthesisUtterance(this.__text);
        this.utter.pitch = this.pitch;
        this.utter.rate = this.rate;
        this.utter.lang = this.language;
        if (globalThis.HAXCMS) {
          globalThis.HAXCMS.instance.setCursor("hax:wizard-hat");
          globalThis.HAXCMS.instance.setFavicon("hax:wizard-hat");
        }
        this.speaking = true;
        let done = false;
        const finish = (event) => {
          if (done) {
            return;
          }
          done = true;
          this.speaking = false;
          this.__echoUntil = Date.now() + 1200;
          if (globalThis.HAXCMS) {
            globalThis.HAXCMS.instance.resetCursor();
            globalThis.HAXCMS.instance.resetFavicon();
          }
          if (!alwaysvisible && !awaitingInput) {
            globalThis.dispatchEvent(
              new CustomEvent("super-daemon-toast-hide", {
                bubbles: true,
                composed: true,
                cancelable: false,
                detail: false,
              }),
            );
          }
          resolve(event);
        };
        // ends normally, or is cut off (barge-in, cancel): resolve either way
        this.utter.onend = finish;
        this.utter.onerror = finish;
        // THOU SPEAKITH
        this.synth.speak(this.utter);
        if (this.toast) {
          this.setToast(text, alwaysvisible, awaitingInput);
        }
      } else {
        resolve(false);
      }
    });
  }
  /**
   * Send a toast message to match what is said. This is good for a11y
   */
  setToast(text, alwaysvisible = false, awaitingInput = true) {
    // gets it all the way to the top immediately
    globalThis.dispatchEvent(
      new CustomEvent("super-daemon-toast-show", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          text: text,
          future: true,
          merlin: true,
          accentColor: "purple",
          duration: 4000,
          alwaysvisible: alwaysvisible,
          awaitingMerlinInput: awaitingInput,
        },
      }),
    );
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.listener.setCommands(this.commands || {});
    this.listener.setPhrases(this.phrases || []);
    if (this.canListen) {
      if (this.enabled || this.auto) {
        this.listener.start({ continuous: this.auto });
      }
      // alert alert we are ready
      this._fire("hal-9000-online", true);
    }
  }
  /**
   * Change the key name that is responded to
   */
  _respondsToChanged(newValue, oldValue) {
    let commands = {};
    for (let i in this.commands) {
      if (i.replace(oldValue, newValue) !== i) {
        commands[i.replace(oldValue, newValue)] = this.commands[i];
      } else {
        commands[i] = this.commands[i];
      }
    }
    // commands is an object keyed by phrase, so check its keys
    if (Object.keys(commands).length > 0) {
      this.commands = { ...commands };
    }
  }
  /**
   * Notice auto state changed so we start listening
   */
  _autoChanged(newValue) {
    this.enabled = newValue;
  }
  /**
   * React to enabled state changing
   */
  _enabledChanged(newValue) {
    if (newValue) {
      this.listener.start({ continuous: this.auto });
    } else {
      this.listener.abort();
    }
  }
  /**
   * LitElement properties changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      // only react to changes away from a defined previous value so the
      // constructor defaults never clobber attribute-set initial values
      if (propName === "commands" && typeof oldValue !== typeof undefined) {
        this._commandsChanged(this[propName]);
      }
      if (propName === "phrases" && typeof oldValue !== typeof undefined) {
        this.listener.setPhrases(this.phrases || []);
      }
      if (propName === "respondsTo" && typeof oldValue !== typeof undefined) {
        this._respondsToChanged(this[propName], oldValue);
      }
      if (propName === "debug") {
        this.listener.debug = this.debug;
      }
      if (propName === "language") {
        this.listener.lang = this.language;
      }
      if (propName === "auto" && typeof oldValue !== typeof undefined) {
        this._autoChanged(this[propName], oldValue);
      }
      if (propName === "enabled" && typeof oldValue !== typeof undefined) {
        this._enabledChanged(this[propName], oldValue);
      }
    });
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    this.listener.abort();
    this.windowControllers.abort();
    super.disconnectedCallback();
  }
}

// ensure we can generate a singleton
globalThis.customElements.define(Hal9000.tag, Hal9000);
export { Hal9000 };
globalThis.Hal9000 = globalThis.Hal9000 || {};

globalThis.Hal9000.requestAvailability = () => {
  if (!globalThis.Hal9000.instance) {
    const hal = globalThis.document.createElement("hal-9000");
    if (globalThis.document && globalThis.document.body) {
      globalThis.document.body.appendChild(hal);
    }
    globalThis.Hal9000.instance = hal;
  }
  return globalThis.Hal9000.instance;
};

export const HAL9000Instance = globalThis.Hal9000.requestAvailability();
