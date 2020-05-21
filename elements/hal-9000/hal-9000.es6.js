/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";
/**
 * `hal-9000`
 * @element hal-9000
 * `Robot assistant tag, hopefully not evil`
 *

 * @demo demo/index.html
 */
class Hal9000 extends LitElement {
  
  //styles function
  static get styles() {
    return  [
      
      css`
:host {
  display: block;
}
      `
    ];
  }
  // render function
  render() {
    return html`

<slot></slot>`;
  }

  // properties available to the custom element for data binding
    static get properties() {
    return {
  
  ...super.properties,
  
  /**
   * Commands to listen for and take action on
   */
  "commands": {
    "name": "commands",
    "type": Object
  },
  /**
   * The name that HAL 9000 should respond to.
   */
  "respondsTo": {
    "name": "respondsTo",
    "type": String,
    "attribute": "responds-to"
  },
  /**
   * Debug mode for annyang
   */
  "debug": {
    "name": "debug",
    "type": Boolean
  },
  /**
   * Start automatically
   */
  "auto": {
    "name": "auto",
    "type": Boolean,
    "reflect": true
  },
  /**
   * Status of listening
   */
  "enabled": {
    "name": "enabled",
    "type": Boolean,
    "reflect": true
  },
  /**
   * Pitch of speech
   */
  "pitch": {
    "name": "pitch",
    "type": Number,
    "reflect": true
  },
  /**
   * Rate of speech
   */
  "rate": {
    "name": "rate",
    "type": Number,
    "reflect": true
  },
  /**
   * Language of the speaker
   */
  "language": {
    "name": "language",
    "type": String,
    "reflect": true
  }
}
;
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "hal-9000";
  }
  // simple path from a url modifier
  pathFromUrl(url) {
    return url.substring(0, url.lastIndexOf("/") + 1);
  }
  /**
   * Establish the element
   */
  constructor() {
    super();
    this.commands = {};
    this.respondsTo = "(hal)";
    this.debug = false;
    this.pitch = 0.9;
    this.rate = 0.9;
    this.language = "en-US";
    // ensure singleton is set
    window.Hal9000 = window.Hal9000 || {};
    window.Hal9000.instance = this;
    const basePath = this.pathFromUrl(decodeURIComponent(import.meta.url));
    const location = `${basePath}lib/annyang/annyang.min.js`;
    window.addEventListener(
      "es-bridge-annyang-loaded",
      this._annyangLoaded.bind(this)
    );
    window.ESGlobalBridge.requestAvailability();
    window.ESGlobalBridge.instance.load("annyang", location);
    // check for speech synthesis API
    if (typeof window.speechSynthesis !== "undefined") {
      this.synth = window.speechSynthesis;
      this.voices = this.synth.getVoices();
      for (var i = 0; i < this.voices.length; i++) {
        if (this.voices[i].default) {
          this.defaultVoice = this.voices[i].name;
        }
      }
    }
  }
  /**
   * Callback for clicking on whatever was just said
   */
  clickObject(phrase) {
    this.__text = phrase;
    this.commands[phrase].object.click();
    this.commands[phrase].object.focus();
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
      this.annyang.addCommands(commands);
    }
  }
  /**
   * And the word was good.
   */
  speak(text) {
    this.__text = text;
    if (this.synth) {
      this.utter = new SpeechSynthesisUtterance(this.__text);
      this.utter.pitch = this.pitch;
      this.utter.rate = this.rate;
      this.utter.lang = this.language;
      this.utter.voice = this.defaultVoice;
      // THOU SPEAKITH
      this.synth.speak(this.utter);
    } else {
      console.warn("I have no voice...");
    }
  }
  /**
   * Annyang library has been loaded globally so we can use it
   */
  _annyangLoaded() {
    this.annyang = window.annyang;
    // Add our commands to annyang
    if (this.annyang) {
      this.annyang.addCommands(this.commands);
      this.annyang.debug(this.debug);
      // Start listening. You can call this here, or attach this call to an event, button, etc.
      if (this.auto) {
        this.annyang.start({
          autoRestart: true,
          continuous: true
        });
      } else if (this.enabled) {
        this.annyang.start();
      }
      // alert alert we are ready
      const evt = new CustomEvent("hal-9000-online", {
        bubbles: true,
        cancelable: false,
        detail: true
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
            continuous: true
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
      if (propName == "commands") {
        this._commandsChanged(this[propName], oldValue);
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
    window.removeEventListener(
      "es-bridge-annyang-loaded",
      this._annyangLoaded.bind(this)
    );
    super.disconnectedCallback();
  }
}
// ensure we can generate a singleton
window.customElements.define(Hal9000.tag, Hal9000);
export { Hal9000 };
window.Hal9000 = window.Hal9000 || {};

window.Hal9000.requestAvailability = () => {
  if (!window.Hal9000.instance) {
    window.Hal9000.instance = new Hal9000();
  }
};
