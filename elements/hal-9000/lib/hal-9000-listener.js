/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */

/**
 * Hal9000Listener: a small wrapper over the browser SpeechRecognition API.
 *
 * Replaces annyang for hal-9000 and keeps its command phrase syntax:
 *   (optional words)  :named  *splat
 * and adds what annyang hid:
 * - interim text while someone is still talking, at most once per frame
 * - every alternative the engine heard, best first
 * - a no-match callback with those alternatives, so nothing is lost
 * - phrase biasing and on-device recognition when the browser has them
 * - an echo guard, so the assistant does not hear its own voice
 *
 * Pure JS, no globals of its own; hal-9000 owns the single instance.
 */

const OPTIONAL_PARAM = /\s*\((.*?)\)\s*/g;
const OPTIONAL_GROUP = /(\(\?:[^)]+\))\?/g;
const NAMED_PARAM = /(\(\?)?:\w+/g;
const SPLAT_PARAM = /\*\w+/g;
const ESCAPE = /[-{}[\]+?.,\\^$|#]/g;

/** Most phrases a page hands the engine for biasing. */
export const HAL_MAX_BIAS_PHRASES = 100;
/** How strongly biased phrases are preferred (spec range is 0 to 10). */
export const HAL_BIAS_BOOST = 3;
/** Alternatives asked for per result. */
export const HAL_MAX_ALTERNATIVES = 5;

/**
 * Turn a command phrase into an anchored, case-insensitive RegExp, using
 * the same syntax annyang used, so every existing command keeps working.
 * @param {string} command e.g. "(hey) merlin", "select :element", "*anything"
 * @returns {RegExp}
 */
export function halCommandToRegExp(command) {
  const source = String(command)
    .replace(ESCAPE, "\\$&")
    .replace(OPTIONAL_PARAM, "(?:$1)?")
    .replace(NAMED_PARAM, (match, optional) => (optional ? match : "([^\\s]+)"))
    .replace(SPLAT_PARAM, "(.*?)")
    .replace(OPTIONAL_GROUP, "\\s*$1?\\s*");
  return new RegExp("^" + source + "$", "i");
}

/**
 * Trim a transcript and drop the edge punctuation some engines add.
 * @param {string} text
 * @returns {string}
 */
export function halCleanTranscript(text) {
  let s = String(text || "").trim();
  while (s.length && ".,!?;:".indexOf(s.charAt(s.length - 1)) !== -1) {
    s = s.slice(0, -1);
  }
  while (s.length && ".,!?;:".indexOf(s.charAt(0)) !== -1) {
    s = s.slice(1);
  }
  return s.trim();
}

/**
 * True when what was heard is (most of) what the assistant is saying, so
 * its own voice through the speakers is not taken as a command.
 * @param {string} heard
 * @param {string} spoken
 * @returns {boolean}
 */
export function halIsEcho(heard, spoken) {
  const words = (s) =>
    String(s || "")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s']/gu, " ")
      .split(/\s+/)
      .filter(Boolean);
  const said = words(spoken);
  const got = words(heard);
  if (!said.length || !got.length) {
    return false;
  }
  const bag = {};
  said.forEach((w) => {
    bag[w] = true;
  });
  const shared = got.filter((w) => bag[w]).length;
  return shared / got.length >= 0.8;
}

/**
 * The SpeechRecognition constructor for this browser, or null.
 * @returns {Function|null}
 */
export function halRecognitionConstructor() {
  return globalThis.SpeechRecognition || globalThis.webkitSpeechRecognition
    ? globalThis.SpeechRecognition || globalThis.webkitSpeechRecognition
    : null;
}

const nextFrame = (fn) =>
  typeof globalThis.requestAnimationFrame === "function"
    ? globalThis.requestAnimationFrame(fn)
    : setTimeout(fn, 16);

export class Hal9000Listener {
  /**
   * @param {Object} options
   * @param {string} [options.lang] BCP 47 language for recognition
   * @param {Function} [options.onInterim] (text) while speech is in progress
   * @param {Function} [options.onSpeechStart] () when the engine hears speech
   * @param {Function} [options.onMatch] ({ phrase, transcript, params })
   * @param {Function} [options.onNoMatch] (alternatives) nothing matched
   * @param {Function} [options.onStateChange] (state) idle, listening, blocked
   * @param {Function} [options.isEcho] (text) => true to ignore a result
   * @param {boolean} [options.debug]
   */
  constructor(options = {}) {
    this.Ctor = halRecognitionConstructor();
    this.lang = options.lang || "en-US";
    this.onInterim = options.onInterim || (() => {});
    this.onSpeechStart = options.onSpeechStart || (() => {});
    this.onMatch = options.onMatch || (() => {});
    this.onNoMatch = options.onNoMatch || (() => {});
    this.onStateChange = options.onStateChange || (() => {});
    this.isEcho = options.isEcho || (() => false);
    this.debug = !!options.debug;
    this.commands = [];
    this.phrases = [];
    this.continuous = false;
    this.state = "idle";
    this.onDevice = false;
    this._wanted = false;
    this._recognition = null;
    this._restarts = [];
    this._interim = "";
    this._interimQueued = false;
    this._phrasesRejected = false;
    this._onDeviceChecked = {};
  }

  get supported() {
    return !!this.Ctor;
  }

  /**
   * Replace all commands. Keys are phrases, values are callbacks; order is
   * kept, and any splat-only command ("*anything") is tried last.
   * @param {Object} commands
   */
  setCommands(commands = {}) {
    const list = [];
    const last = [];
    Object.keys(commands).forEach((phrase) => {
      if (typeof commands[phrase] !== "function") {
        return;
      }
      const entry = {
        phrase: phrase,
        re: halCommandToRegExp(phrase),
        callback: commands[phrase],
      };
      if (/^\*\w+$/.test(phrase.trim())) {
        last.push(entry);
      } else {
        list.push(entry);
      }
    });
    this.commands = list.concat(last);
  }

  /**
   * Words and phrases to bias recognition toward (command titles, product
   * names). Used only where the browser supports it.
   * @param {Array<string>} phrases
   */
  setPhrases(phrases = []) {
    const seen = {};
    this.phrases = phrases
      .map((p) => halCleanTranscript(p))
      .filter((p) => {
        const key = p.toLowerCase();
        if (!p || seen[key]) {
          return false;
        }
        seen[key] = true;
        return true;
      })
      .slice(0, HAL_MAX_BIAS_PHRASES);
  }

  /**
   * Start listening. Restarts on its own after each result until abort().
   * @param {Object} [options]
   * @param {boolean} [options.continuous] keep one long session (Santa mode)
   */
  start(options = {}) {
    if (!this.supported) {
      return false;
    }
    this.continuous = !!options.continuous;
    this._wanted = true;
    this._restarts = [];
    this._startSession();
    return true;
  }

  /** Stop listening and drop any session in progress. */
  abort() {
    this._wanted = false;
    if (this._recognition) {
      const rec = this._recognition;
      this._recognition = null;
      try {
        rec.abort();
      } catch {
        // already stopped
      }
    }
    this._setState("idle");
  }

  /**
   * Run a transcript through the commands as if it had been heard. Used by
   * the engine for finals, and by tests.
   * @param {Array<string>} alternatives best first
   * @returns {boolean} true when a command ran
   */
  handleAlternatives(alternatives = []) {
    const heard = alternatives
      .map((t) => halCleanTranscript(t))
      .filter(Boolean);
    if (!heard.length) {
      return false;
    }
    if (this.isEcho(heard[0])) {
      this._log("ignored echo", heard[0]);
      return false;
    }
    for (let a = 0; a < heard.length; a++) {
      for (let c = 0; c < this.commands.length; c++) {
        const command = this.commands[c];
        const found = command.re.exec(heard[a]);
        if (found) {
          const params = found.slice(1).map((p) => (p ? p.trim() : p));
          this._log("matched", command.phrase, heard[a]);
          this.onMatch({
            phrase: command.phrase,
            transcript: heard[a],
            params: params,
          });
          command.callback.apply(null, params);
          return true;
        }
      }
    }
    this._log("no match", heard);
    this.onNoMatch(heard);
    return false;
  }

  _log(...args) {
    if (this.debug && globalThis.console) {
      globalThis.console.info("hal-9000:", ...args);
    }
  }

  _setState(state) {
    if (this.state !== state) {
      this.state = state;
      this.onStateChange(state);
    }
  }

  _startSession() {
    if (!this._wanted || this._recognition) {
      return;
    }
    let rec;
    try {
      rec = new this.Ctor();
    } catch {
      this._setState("blocked");
      return;
    }
    rec.lang = this.lang;
    rec.continuous = this.continuous;
    rec.interimResults = true;
    rec.maxAlternatives = HAL_MAX_ALTERNATIVES;
    this._applyPhrases(rec);
    rec.onstart = () => this._setState("listening");
    rec.onspeechstart = () => this.onSpeechStart();
    rec.onresult = (e) => this._onResult(e);
    rec.onerror = (e) => this._onError(e);
    rec.onend = () => this._onEnd(rec);
    this._recognition = rec;
    this._preferOnDevice(rec).then(() => {
      if (this._recognition !== rec) {
        return;
      }
      try {
        rec.start();
      } catch {
        // InvalidStateError: a session is already running
      }
    });
  }

  /**
   * Bias toward known phrases where the engine supports it. Engines that
   * do not support it either lack the field or reject it on start, and
   * plain recognition still works.
   */
  _applyPhrases(rec) {
    const Phrase = globalThis.SpeechRecognitionPhrase;
    if (
      this._phrasesRejected ||
      !this.phrases.length ||
      typeof Phrase !== "function" ||
      !("phrases" in rec)
    ) {
      return;
    }
    try {
      rec.phrases = this.phrases.map((p) => new Phrase(p, HAL_BIAS_BOOST));
    } catch {
      this._phrasesRejected = true;
    }
  }

  /**
   * Prefer recognition on the device (no audio leaves the machine) when
   * the browser says the language is already installed. Never downloads.
   */
  async _preferOnDevice(rec) {
    if (
      !this.Ctor ||
      typeof this.Ctor.available !== "function" ||
      !("processLocally" in rec)
    ) {
      return false;
    }
    if (this._onDeviceChecked[this.lang] === undefined) {
      try {
        const status = await this.Ctor.available({
          langs: [this.lang],
          processLocally: true,
        });
        this._onDeviceChecked[this.lang] = status === "available";
      } catch {
        this._onDeviceChecked[this.lang] = false;
      }
    }
    this.onDevice = this._onDeviceChecked[this.lang];
    if (this.onDevice) {
      try {
        rec.processLocally = true;
      } catch {
        this.onDevice = false;
      }
    }
    return this.onDevice;
  }

  _onResult(e) {
    let interim = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const result = e.results[i];
      if (result.isFinal) {
        const alternatives = [];
        for (let j = 0; j < result.length; j++) {
          alternatives.push(result[j].transcript);
        }
        this._interim = "";
        this.handleAlternatives(alternatives);
      } else if (result.length) {
        interim += result[0].transcript;
      }
    }
    if (interim) {
      this._queueInterim(halCleanTranscript(interim));
    }
  }

  // interim text can arrive many times a second; hand on the latest once
  // per frame so the page only repaints what is visible
  _queueInterim(text) {
    if (text === this._interim) {
      return;
    }
    this._interim = text;
    if (this._interimQueued) {
      return;
    }
    this._interimQueued = true;
    nextFrame(() => {
      this._interimQueued = false;
      if (this._interim && !this.isEcho(this._interim)) {
        this.onInterim(this._interim);
      }
    });
  }

  _onError(e) {
    const error = e && e.error ? e.error : "";
    this._log("error", error);
    if (error === "phrases-not-supported") {
      this._phrasesRejected = true;
      return;
    }
    if (error === "not-allowed" || error === "service-not-allowed") {
      this._wanted = false;
      this._setState("blocked");
    }
  }

  _onEnd(rec) {
    if (this._recognition === rec) {
      this._recognition = null;
    }
    if (!this._wanted) {
      this._setState(this.state === "blocked" ? "blocked" : "idle");
      return;
    }
    // restart, but give up if the engine keeps ending at once (no mic,
    // policy, offline) instead of spinning
    const now = Date.now();
    this._restarts = this._restarts.filter((t) => now - t < 10000);
    this._restarts.push(now);
    if (this._restarts.length > 10) {
      this._wanted = false;
      this._setState("idle");
      return;
    }
    setTimeout(() => this._startSession(), 250);
  }
}
