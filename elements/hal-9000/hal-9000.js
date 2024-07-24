/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement } from "lit";
import "@haxtheweb/es-global-bridge/es-global-bridge.js";
import "@haxtheweb/super-daemon/lib/super-daemon-toast.js";

/**
 * `hal-9000`
 * @element hal-9000
 * `Robot assistant tag, hopefully not evil`
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
       * The name that HAL 9000 should respond to.
       */
      respondsTo: {
        name: "respondsTo",
        type: String,
        attribute: "responds-to",
      },
      /**
       * Debug mode for annyang
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
    this.windowControllers = new AbortController();
    this.commands = {};
    this.respondsTo = "(merlin)";
    this.debug = false;
    this.pitch = 0.9;
    this.rate = 0.9;
    this.language = globalThis.navigator.language;
    // ensure singleton is set
    globalThis.Hal9000 = globalThis.Hal9000 || {};
    globalThis.Hal9000.instance = this;
    const location = `${
      new URL("./lib/annyang/annyang.min.js", import.meta.url).href
    }`;
    globalThis.addEventListener(
      "es-bridge-annyang-loaded",
      this._annyangLoaded.bind(this),
      { signal: this.windowControllers.signal },
    );
    globalThis.ESGlobalBridge.requestAvailability().load("annyang", location);
    // check for speech synthesis API
    if (
      typeof globalThis.speechSynthesis !== "undefined" &&
      (globalThis.SpeechRecognition ||
        globalThis.webkitSpeechRecognition ||
        globalThis.mozSpeechRecognition ||
        globalThis.msSpeechRecognition ||
        globalThis.oSpeechRecognition)
    ) {
      this.synth = globalThis.speechSynthesis;
      /*this.voices = this.synth.getVoices();
      for (var i = 0; i < this.voices.length; i++) {
        if (this.voices[i].default) {
          this.defaultVoice = this.voices[i].name;
        }
      }*/
    }
  }
  /**
   * Notice new voice commands added
   */
  _commandsChanged(newValue) {
    this.addCommands(newValue);
  }
  /**
   * Just rout add commands call to the right place
   */
  addCommands(commands) {
    if (this.annyang) {
      // ensure we keep registrations to a minimum
      this.annyang.removeCommands();
      if (commands["*anything"]) {
        const anything = commands["*anything"];
        delete commands["*anything"];
        commands["*anything"] = anything;
      }
      this.annyang.addCommands(commands);
    }
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
        //this.utter.voice = this.defaultVoice;
        if (globalThis.HAXCMS) {
          globalThis.HAXCMS.instance.setCursor("hax:wizard-hat");
          globalThis.HAXCMS.instance.setFavicon("hax:wizard-hat");
        }
        // THOU SPEAKITH
        this.synth.speak(this.utter);
        if (this.toast) {
          this.setToast(text, alwaysvisible, awaitingInput);
        }
        this.utter.onend = (event) => {
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
  /**
   * Annyang library has been loaded globally so we can use it
   */
  _annyangLoaded() {
    this.annyang = globalThis.annyang;
    // Add our commands to annyang
    if (this.annyang) {
      this.annyang.addCommands(this.commands);
      this.annyang.debug(this.debug);
      // Start listening. You can call this here, or attach this call to an event, button, etc.
      if (this.auto) {
        this.annyang.start({
          autoRestart: true,
          continuous: true,
        });
      } else if (this.enabled) {
        this.annyang.start();
      }
      // alert alert we are ready
      const evt = new CustomEvent("hal-9000-online", {
        bubbles: true,
        cancelable: false,
        detail: true,
      });
      this.dispatchEvent(evt);
    }
  }
  /**
   * Change the key name that is responded to
   */
  _respondsToChanged(newValue, oldValue) {
    // remove all as our voice changed
    if (this.annyang) {
      this.annyang.removeCommands();
    }
    var commands = {};
    for (var i in this.commands) {
      if (i.replace(oldValue, newValue) !== i) {
        commands[i.replace(oldValue, newValue)] = this.commands[i];
      } else {
        commands[i] = this.commands[i];
      }
    }
    if (commands.length > 0) {
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
    if (this.annyang) {
      if (newValue) {
        if (this.auto) {
          this.annyang.start({
            autoRestart: true,
            continuous: true,
          });
        } else {
          this.annyang.start();
        }
      } else {
        this.annyang.abort();
      }
    }
  }
  /**
   * debug mode changed
   */
  _debugChanged(newValue, oldValue) {
    if (this.annyang) {
      this.annyang.debug(newValue);
    }
  }
  /**
   * LitElement properties changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "commands" && typeof oldValue !== typeof undefined) {
        this._commandsChanged(this[propName]);
      }
      if (propName == "respondsTo") {
        this._respondsToChanged(this[propName], oldValue);
      }
      if (propName == "debug") {
        this._debugChanged(this[propName], oldValue);
      }
      if (propName == "auto") {
        this._autoChanged(this[propName], oldValue);
      }
      if (propName == "enabled") {
        this._enabledChanged(this[propName], oldValue);
      }
    });
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    this.windowControllers.abort();
    super.disconnectedCallback();
  }
}

// ensure we can generate a singleton
customElements.define(Hal9000.tag, Hal9000);
export { Hal9000 };
globalThis.Hal9000 = globalThis.Hal9000 || {};

globalThis.Hal9000.requestAvailability = () => {
  if (!globalThis.Hal9000.instance) {
    const hal = globalThis.document.createElement("hal-9000");
    globalThis.document.body.appendChild(hal);
    globalThis.Hal9000.instance = hal;
  }
  return globalThis.Hal9000.instance;
};

export const HAL9000Instance = globalThis.Hal9000.requestAvailability();
