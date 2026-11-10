/**
 * Copyright 2023 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icon-button.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "web-dialog/index.js";
import "@haxtheweb/absolute-position-behavior/absolute-position-behavior.js";
import "./lib/super-daemon-ui.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import {
  HaxUiAdminTokens,
  HaxUiAdminScheme,
} from "@haxtheweb/d-d-d/lib/HaxUiAdminTokens.js";
import { HaxUiAdminIcons } from "@haxtheweb/d-d-d/lib/HaxUiAdminIcons.js";
import { HaxUiDialogTitlebarStyles } from "@haxtheweb/d-d-d/lib/HaxUiDialogFrame.js";
import {
  MerlinDarkScheme,
  MerlinWandStyles,
  merlinMark,
} from "./lib/super-daemon-hax-ui.js";
import { SuperDaemonToastInstance } from "./lib/super-daemon-toast.js";
import {
  MERLIN_VOICE_VOCAB_EN,
  merlinVoiceVocab,
  merlinVoiceEntries,
  merlinRankVoice,
  merlinVoiceBand,
  merlinParseVoiceGrammar,
  merlinWordList,
} from "./lib/merlin-voice-match.js";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { KeyboardShortcutManagerInstance } from "@haxtheweb/utils/utils.js";

/**
 * `super-daemon`
 * ``
 * @demo demo/index.html
 * @element super-daemon
 */
class SuperDaemon extends I18NMixin(SimpleColors) {
  static get properties() {
    return {
      ...super.properties,
      santaMode: { type: Boolean, reflect: true, attribute: "santa-mode" },
      opened: { type: Boolean, reflect: true },
      loading: { type: Boolean, reflect: true },
      key1: { type: String },
      key2: { type: String },
      icon: { type: String },
      items: { type: Array },
      programResults: { type: Array },
      programName: { type: String },
      programPlaceholder: { type: String },
      allItems: { type: Array },
      context: { type: Array },
      commandContext: { type: String },
      program: { type: String },
      programSearch: { type: String },
      like: { type: String },
      value: { type: String },
      mini: { type: Boolean },
      wand: { type: Boolean, reflect: true },
      inlineMode: { type: Boolean, attribute: "inline-mode" },
      activeNode: { type: Object },
      programTarget: { type: Object },
      voiceSearch: { type: Boolean, reflect: true, attribute: "voice-search" },
      voiceCommands: { type: Object },
      listeningForInput: {
        type: Boolean,
        reflect: true,
        attribute: "listening-for-input",
      },
      /** Results chosen by voice ("did you mean"), shown instead of all */
      voiceRanked: { type: Array, attribute: false },
    };
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    // add Santa program
    SuperDaemonInstance.defineOption({
      title: this.t.toggleSantaMode,
      textCharacter: "🎅",
      tags: ["Developer", "big-tech", "santa", "all-seeing-eye"],
      eventName: "super-daemon-element-method",
      path: ">settings/hohoho",
      voice: "(toggle) santa (mode)",
      context: [">"],
      more: html`<span>${this.t.santaModeDescription}</span>`,
      value: {
        target: this,
        method: "toggleSantaMode",
        args: [],
      },
    });
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.t = {
      // product name; no locale entries, so it stays "Super Daemon" unless a language adds one
      superDaemon: "Super Daemon",
      toggleSantaMode: "Toggle Santa Mode",
      santaModeDescription:
        "He sees you when your sleeping, he knows when your awake, and with this command active he is always listening for input ready to respond. He's.. Santa Merlin. Ho..Ho...Ho.",
      santaModeActivated: "Santa mode activated: Watch what you say",
      santaModeDeactivated:
        "Santa mode deactivated: Have a nice day believing you are not being watched",
      disableSantaModeToStop: "Please disable Santa mode to stop listening",
      imHere: "I'm here",
      yes: "Yes?",
      what: "What?",
      whatCanIDo: "What can I do for you?",
      whatDoYouNeed: "What do you need?",
      howCanIHelp: "How can I help?",
      thanksForStopping: "thanks for stopping by",
      seeYa: "See ya",
      seeYouSoon: "See you soon",
      tillWeMeetAgain: "Till we meet again",
      howMayIHelp: "How may I help you?",
      listening: "Listening..",
      programModeActivated: "program mode activated",
      developerModeActivated: "developer mode activated",
      merlin: "Merlin",
      closeMerlin: "Close Merlin",
      // spoken search vocabulary: pipe separated, translated per language
      voiceFillers:
        "please|can you|could you|would you|will you|i want to|i'd like to|i would like to|let's|let me|go ahead and|um|uh|hey|merlin|ok|okay",
      voiceStopWords: "a|an|the|to|my|this|for|of|me",
      voiceNumbers: "zero|one|two|three|four|five|six|seven|eight|nine|ten",
      voiceOrdinals:
        "zeroth|first|second|third|fourth|fifth|sixth|seventh|eighth|ninth",
      voicePickPrefixes: "number|option|item|result|pick|choose|select|the",
      voicePickSuffix: "one",
      voiceNumberSoundalikes:
        "won=1|to=2|too=2|tu=2|tree=3|free=3|for=4|fore=4|ate=8",
      voiceNext: "next|down|next one",
      voiceBack: "back|previous|up|go back",
      voiceRun: "run|go|yes|do it|run it|open it|that one",
      voiceClear: "clear|start over|reset",
      voiceCancel: "cancel|never mind|nevermind",
      voiceHelp: "help|what can i say|what can i do",
      // spoken commands Merlin always knows, in the user's language
      sayStopListening: "stop listening",
      sayCloseMerlin: "close merlin",
      sayDisableSanta: "disable santa mode",
      // what the voice card says after hearing something
      voiceDidYouMean: "{title}? To run it, say",
      voiceShowingMatches: "Showing matches. To run one, say",
      voiceNoMatches: "Nothing matched. Try other words, or say",
      voiceNoSuchResult: "There is no result {number}. Try",
      voiceYouCanSay: "You can say",
      voiceMicBlocked:
        "The microphone is blocked. Allow it in your browser to talk to Merlin.",
      voiceUnavailable:
        "Voice isn't available in this browser. You can still type to Merlin.",
      voiceTipPick: "To run a result, say",
      voiceTipNext: "To move down the list, say",
      voiceTipClear: "To start over, say",
      voiceTipHelp: "To see what you can say, say",
      voiceRunResult: "Run a result",
      voiceMoveDown: "Move down",
      voiceMoveUp: "Move up",
      voiceRunHighlighted: "Run the highlighted result",
      voiceStartOver: "Start over",
      voiceStopListeningLabel: "Stop listening",
      voiceCloseLabel: "Close Merlin",
    };
    // Konami Code detection
    this.konamiSequence = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "KeyB",
      "KeyA",
    ];
    this.konamiProgress = [];
    this.konamiTimeout = null;
    // Expose reset method globally for debugging
    this.resetKonamiCode = this.resetKonamiCode.bind(this);
    this.registerLocalization({
      context: this,
      namespace: "super-daemon",
      basePath: import.meta.url,
    });
    this.toastInstance = SuperDaemonToastInstance;
    // used when in mini mode to know what to point to and how to focus after the fact
    this.activeSelection = null;
    this.wandTarget = null; // consistent wand target to fallback on across app
    this.voiceCommands = {};
    this.voiceRanked = null;
    this._voiceEntries = [];
    this._voiceTip = 0;
    this.programTarget = null;
    this.activeRange = null;
    this.santaMode = false;
    this.activeNode = null;
    this.voiceSearch = false;
    this.listeningForInput = false;
    this.voiceRespondsTo = "merlin";
    this.hal = null;
    // manages GLOBAL events for the whole thing
    this.windowControllers = new AbortController();
    // this one is specific to mini mode management
    this.windowControllers2 = new AbortController();
    this.value = "";
    this.icon = "hardware:keyboard-return";
    this.context = [];
    this.opened = false;
    this.items = [];
    this.loading = false;
    this.like = "";
    this.mini = false;
    this.wand = false;
    this.inlineMode = false;
    this._programValues = {};
    this.programSearch = "";
    this.allItems = [];
    this.programResults = [];
    this.programName = null;
    this.programPlaceholder = null;
    this.commandContext = "*";
    this._programDebounceTimeout = null;
    const isSafari = globalThis.safari !== undefined;
    if (isSafari) {
      this.key1 = "Meta";
    } else {
      this.key1 = "Alt";
    }
    this.key2 = "Shift";
  }

  connectedCallback() {
    super.connectedCallback();
    // recreate the AbortControllers when a previous disconnectedCallback
    // aborted them. addEventListener with an aborted signal silently never
    // registers the listener, so reconnecting without recreating them left
    // every globalThis listener below dead after a disconnect/reconnect.
    if (this.windowControllers.signal.aborted) {
      this.windowControllers = new AbortController();
    }
    if (this.windowControllers2.signal.aborted) {
      this.windowControllers2 = new AbortController();
    }
    globalThis.addEventListener("keydown", this.keyHandler.bind(this), {
      signal: this.windowControllers.signal,
    });

    globalThis.addEventListener(
      "super-daemon-define-option",
      this.defineOptionEvent.bind(this),
      { signal: this.windowControllers.signal },
    );

    globalThis.addEventListener(
      "super-daemon-element-method",
      this.elementMethod.bind(this),
      { signal: this.windowControllers.signal },
    );

    globalThis.addEventListener(
      "super-daemon-element-click",
      this.elementClick.bind(this),
      { signal: this.windowControllers.signal },
    );

    globalThis.addEventListener(
      "super-daemon-run-program",
      this.runProgramEvent.bind(this),
      { signal: this.windowControllers.signal },
    );

    globalThis.addEventListener(
      "super-daemon-voice-command",
      this._addVoiceCommand.bind(this),
      { signal: this.windowControllers.signal },
    );
    globalThis.addEventListener("super-daemon-close", this.close.bind(this), {
      signal: this.windowControllers.signal,
    });

    globalThis.addEventListener(
      "super-daemon-program-enter",
      this.handleProgramEnter.bind(this),
      { signal: this.windowControllers.signal },
    );
  }
  disconnectedCallback() {
    this.windowControllers.abort();
    this.windowControllers2.abort();
    // Clear any pending program execution timeouts
    clearTimeout(this._programDebounceTimeout);
    super.disconnectedCallback();
  }
  // waving the magic wand is a common feedback loop combination
  // we have a target as far as location to position
  // we are in mini / wand mode
  // we run a program
  // we play a sound (optional)
  // we open merlin
  // this is to save on this continuous interaction pattern
  waveWand(params, target = null, sound = null) {
    if (!target) {
      target = this.wandTarget;
    }
    this.inlineMode = false;

    // Check if we're on mobile and if this is a page creation program
    const isMobile =
      globalThis.matchMedia &&
      globalThis.matchMedia("(max-width: 768px)").matches;
    const isPageCreation =
      params &&
      params.length > 0 &&
      (params[0] === "create-page" ||
        (params[3] && params[3] === "create-page"));

    // On mobile, use full popup mode for page creation instead of mini mode
    if (isMobile && isPageCreation) {
      this.mini = false;
      this.wand = false;
      this.activeNode = null;
    } else {
      this.mini = true;
      this.wand = true;
      this.activeNode = target;
    }

    this.runProgram(...params);
    if (sound) {
      this.playSound(sound);
    }
    this.open();
  }
  // reset to filter for a specific term with something like runProgram('blocks','*',null,null,null);

  async runProgram(
    like = null,
    context = "/",
    values = {},
    program = null,
    name = null,
    search = "",
    placeholder = null,
  ) {
    this._programValues = values;
    this.commandContext = context;
    // initialValue can come from the registered option (machineName launch,
    // resolved below) or from the values bag itself: selecting a program row
    // in Merlin dispatches the option's whole value object as `values`.
    let initialValueFn =
      values && typeof values.initialValue === "function"
        ? values.initialValue
        : null;
    // resolve program as string based name vs function passed in
    if (typeof program === "string") {
      const itemMatch = await this.allItems.find((item) => {
        if (item.value.machineName === program) {
          return true;
        }
        return false;
      });
      if (itemMatch) {
        this._programToRun = itemMatch.value.program;
        // Extract placeholder from the program definition if not explicitly provided
        if (!placeholder && itemMatch.value.placeholder) {
          placeholder = itemMatch.value.placeholder;
        }
        // Allow a program to supply an initial input value when it is
        // launched generically (e.g. via Merlin search/voice) with no
        // explicit like/search. The search input is rendered bound to
        // `like` (value="${this.like}" in super-daemon-ui), so to actually
        // display a pre-filled value we must set `like` -- exactly what
        // callers like page-break._editTags already do. Mirror that path
        // by promoting initialValue to `like` so the existing like != null
        // branch propagates it to this.like / programSearch / value and
        // the input field renders it.
        if (typeof itemMatch.value.initialValue === "function") {
          initialValueFn = itemMatch.value.initialValue;
        }
      } else {
        console.error("Incorrect program called", program);
      }
    } else {
      this._programToRun = program;
    }
    if (like == null && (!search || search === "") && initialValueFn) {
      const initialValue = await initialValueFn(values);
      if (
        initialValue &&
        typeof initialValue === "string" &&
        initialValue.trim() !== ""
      ) {
        like = initialValue;
      }
    }
    this.programSearch = search;
    // used to force a search prepopulation
    if (like != null) {
      this.like = like;
      // If we're setting 'like' and programSearch is empty, use 'like' as the initial programSearch
      // This ensures the program executes with the pre-filled value on first run
      if (!this.programSearch && like) {
        this.programSearch = like;
      }
    }
    // Keep the top-level value in sync with the initial program input so
    // handlers that read this.value (e.g. handleProgramEnter) don't see stale
    // text from a previous Merlin session.
    this.value = this.programSearch;
    // ensure we have a program as this could be used for resetting program state
    if (this._programToRun) {
      // Show the loading state immediately so the results area never renders
      // a stale No results message during the window between launching the
      // program and the async programResults arriving. The program execution
      // itself is still deferred (via setTimeout) so setupProgram can wire up
      // the search input first, but loading must be true up front to keep the
      // UI in a Loading results state until results land. Without this, the
      // nested setTimeout(0) then setTimeout(50) chain leaves loading false
      // while programResults is still empty, so super-daemon-ui render falls
      // into the no-results branch even though a search is actively running.
      this.loading = true;
      setTimeout(() => {
        this.shadowRoot
          .querySelector("super-daemon-ui")
          .setupProgram(this.programSearch);
        setTimeout(async () => {
          try {
            this.programResults = await this._programToRun(
              this.programSearch,
              values,
            );
            this.loading = false;
          } catch {
            this.loading = false;
          }
        }, 50);
      }, 0);
    } else {
      this.programResults = [];
    }
    this.programName = name;
    this.programPlaceholder = placeholder;

    // Reset placeholder when no program is active
    if (!this._programToRun && !name) {
      this.programPlaceholder = null;
    }
  }
  // run "program"
  runProgramEvent(e) {
    if (e.detail) {
      let data = e.detail;
      this._programValues = data;
      this.like = "";
      this.runProgram(
        null,
        data.context,
        this._programValues,
        data.program,
        data.name,
        "",
        data.placeholder,
      );
    } else {
      this.runProgram("", "/");
      this._programValues = {};
    }
  }
  // allow generating an event on a target
  elementMethod(e) {
    if (e.detail) {
      let data = e.detail;
      if (!data.args) {
        data.args = [];
      }
      data.target[data.method](...data.args);
    }
  }
  // allow generating an event on a target
  elementClick(e) {
    if (e.detail) {
      e.detail.target.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: globalThis,
        }),
      );
    }
  }

  // handle Enter key press in programs when no filtered results
  handleProgramEnter(e) {
    if (e.detail && e.detail.programName && e.detail.input) {
      const programName = e.detail.programName;
      let input = e.detail.input;

      // Prefer the live Merlin input value at the moment Enter is pressed
      const SuperDaemonInstance =
        globalThis.SuperDaemonManager &&
        globalThis.SuperDaemonManager.requestAvailability();
      if (SuperDaemonInstance && SuperDaemonInstance.value) {
        input = SuperDaemonInstance.value;
      }

      // Special handling for the create-page program
      if (programName === "create-page") {
        // Find the site editor UI to call createPageWithTitle
        const siteEditorUI = globalThis.document.querySelector(
          "haxcms-site-editor-ui",
        );
        if (siteEditorUI && siteEditorUI.createPageWithTitle) {
          // Respect requested page creation type when Enter is pressed
          const createType =
            this._programValues && this._programValues.type
              ? this._programValues.type
              : "sibling";
          siteEditorUI.createPageWithTitle(
            input,
            createType,
            this._programValues && this._programValues.templateContent
              ? this._programValues.templateContent
              : null,
          );
        }
      }
    }
  }
  // take in via event
  defineOptionEvent(e) {
    this.defineOption(e.detail);
  }

  // minor validation of option; as we have a singleton this is faster when required
  defineOption(option) {
    if (option && option.value && option.title && option.eventName) {
      if (!option.tags) {
        option.tags = [];
      }
      if (!option.path) {
        option.path = "";
      }
      if (!option.priority) {
        option.priority = 0;
      }
      // no context means it's pervasive
      if (!option.context) {
        option.context = "*";
      }
      if (typeof option.inline === typeof undefined) {
        option.inline = false;
      }
      // Resolve optional shortcut metadata linking this option to the shared
      // KeyboardShortcutManager registry. `shortcut` may be a registry id
      // string (e.g. 'cms-save') or an inline descriptor object. The resolved
      // human-readable label is stored on option.shortcutLabel for the UI;
      // both fields are excluded from the search index to preserve existing
      // search behavior.
      if (option.shortcut) {
        option.shortcutLabel = this._resolveShortcutLabel(option.shortcut);
      }
      // translated fields (option.i18n) stay in sync with the defining element
      if (option.i18n) {
        this._bindOptionI18n(option);
      }
      this._indexOption(option);
      this.allItems.push(option);
    }
  }
  /**
   * Keep an option's text translated. option.i18n is
   * { context: <element using I18NMixin>, field: tKey, "value.name": tKey }
   * and fields are re-translated (and re-indexed) as that element's
   * translations load.
   */
  _bindOptionI18n(option) {
    const { context, ...fields } = option.i18n;
    if (!context || typeof context.i18nBind !== "function") {
      return;
    }
    Object.keys(fields).forEach((fieldPath) => {
      const parts = fieldPath.split(".");
      const field = parts.pop();
      const target = parts.reduce((o, p) => (o ? o[p] : o), option);
      if (target && typeof target === "object") {
        context.i18nBind(target, field, fields[fieldPath], () =>
          this._indexOption(option),
        );
      }
    });
  }
  // build the searchable index for an option
  _indexOption(option) {
    // create new object from existing so we can build an index
    // remove icon, image, value, textCharacter, eventName as these are not searchable values
    // then create an idex by making everything else into a space separated string
    let indexBuilder = { ...option };
    delete indexBuilder.icon;
    delete indexBuilder.image;
    delete indexBuilder.textCharacter;
    delete indexBuilder.value;
    delete indexBuilder.eventName;
    delete indexBuilder.shortcut;
    delete indexBuilder.shortcutLabel;
    delete indexBuilder.i18n;
    delete indexBuilder.index;
    indexBuilder = Object.values(indexBuilder).filter((i) => {
      if (
        !["boolean", "number"].includes(typeof i) &&
        i !== "" &&
        i !== null &&
        i !== undefined
      ) {
        return true;
      }
    });
    let index = [];
    indexBuilder.map((i) => {
      if (typeof i === "string") {
        // helps w/ splitting on / or else it's just a single item anyway
        let q = i.split("/");
        q.map((j) => {
          if (!["", "*", "/", " ", ">"].includes(j)) {
            index.push(j.toLocaleLowerCase());
          }
        });
      } else if (Array.isArray(i)) {
        i.map((j) => {
          if (!["", "*", "/", " ", ">"].includes(j)) {
            index.push(j.toLocaleLowerCase());
          }
        });
      } else {
        // this shouldn't be possible so ignore the value..
      }
    });
    // combine all the values into a single string removing silly things that might slip through
    let tmp = index.join(" ").replace(/\*/g, "").replace(/\?/g, "");
    // use a set to remove duplicates
    index = [...new Set(tmp.split(" "))];
    // clean index of words :) but also include path as a whole phrase
    option.index = index.join(" ") + " " + option.path;
  }

  /**
   * Resolve a `shortcut` value on a defineOption into a display label via
   * the shared KeyboardShortcutManager registry. Accepts a registry id
   * string or an inline descriptor object. Returns "" when no label resolves
   * so the UI can treat absent/empty labels uniformly.
   */
  _resolveShortcutLabel(shortcut) {
    if (!shortcut) return "";
    if (typeof shortcut === "string") {
      const descriptor = KeyboardShortcutManagerInstance.getById(shortcut);
      return descriptor
        ? KeyboardShortcutManagerInstance.getLabel(descriptor)
        : "";
    }
    return KeyboardShortcutManagerInstance.getLabel(shortcut);
  }
  updateSearchInputViaVoice(input) {
    this.shadowRoot.querySelector("super-daemon-ui").like = input;
    this.shadowRoot.querySelector("super-daemon-ui").focusInput();
    // turn off bc we got a match
    setTimeout(() => {
      this.setListeningStatus(false);
    }, 0);
  }

  /**
   * allow uniform method of adding voice commands
   */
  addVoiceCommand(command, context, callback) {
    if (context) {
      command = command
        .replace(":name:", this.voiceRespondsTo)
        .toLocaleLowerCase();
      this.voiceCommands[command] = context[callback].bind(context);
    }
  }
  /**
   * event driven version
   */
  _addVoiceCommand(e) {
    // without context it's almost worthless so try to fallback on where it came from
    let target = e.detail.context;
    if (!target) {
      target = e.target;
    }
    this.addVoiceCommand(e.detail.command, target, e.detail.callback);
  }

  keyHandler(e) {
    // Check for Konami Code sequence first (global detection)
    this.checkKonamiCode(e);

    // modifier required to activate
    if (this.allowedCallback()) {
      // open and close events
      if (this.key2 == "Shift" && e.shiftKey) {
        // platform specific additional modifier
        if (
          (this.key1 == "Ctrl" && e.ctrlKey) ||
          (this.key1 == "Alt" && e.altKey) ||
          (this.key1 == "Meta" && (e.key === "Meta" || e.metaKey))
        ) {
          this._toggleFromKeyboard();
        }
      }
      if (e.key == "Escape" && this.opened) {
        this.miniCancel();
      }
    }
  }
  /**
   * The open / close shortcut. Closing goes through close() so every mode
   * (mini popover or full dialog) is torn down the same way it is from the
   * close button; only opening runs keyHandlerCallback, which picks the
   * mode and anchor. Flipping opened alone left a closed full Merlin set up
   * as a mini popover with no anchor, so the next open drew it in the top
   * left corner.
   */
  _toggleFromKeyboard() {
    if (this.opened) {
      this.close();
      return;
    }
    this.opened = true;
    this.keyHandlerCallback();
  }
  /**
   * LitElement style callback
   */
  static get styles() {
    // support for using in other classes
    let styles = [];
    if (super.styles) {
      styles = super.styles;
    }
    return [
      styles,
      ...HaxUiAdminTokens,
      ...HaxUiAdminScheme,
      ...HaxUiDialogTitlebarStyles,
      MerlinDarkScheme,
      MerlinWandStyles,
      css`
        :host {
          display: none;
        }
        :host([opened]) {
          display: block;
        }
        /* Modal Merlin: the one admin dialog look (site admin titlebar,
           HAX UI surface), sized for a results list plus a details pane. */
        web-dialog {
          --dialog-border-radius: var(
            --super-daemon-modal-radius,
            var(--hax-ui-radius-lg, 8px)
          );
          z-index: var(--simple-modal-z-index, 10000) !important;
          padding: 0;
          color: var(--hax-ui-text);
        }
        web-dialog::part(dialog) {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-surface);
          border: none;
          box-shadow: var(--super-daemon-modal-shadow, var(--ddd-boxShadow-xl));
          z-index: var(--simple-modal-z-index, 10000);
          padding: 0;
          --dialog-width: var(
            --super-daemon-modal-width,
            min(880px, calc(100vw - 32px))
          );
          --dialog-height: var(
            --super-daemon-modal-height,
            min(656px, calc(100dvh - 64px))
          );
          --dialog-max-width: 100vw;
          --dialog-max-height: 100dvh;
        }
        web-dialog super-daemon-ui {
          --super-daemon-search-width: 100%;
          flex: 1 1 auto;
          min-height: 0;
        }
        /* the HAX UI dialog frame titlebar (.hax-ui-dialog-*), with the
           wand, the shortcut hint and a little room before close */
        .titlebar {
          --merlin-wand-size: 18px;
        }
        .titlebar .keys {
          font-size: var(--hax-ui-admin-font-size-xs, 12px);
          color: var(--ddd-theme-default-white65, rgba(255, 255, 255, 0.75));
        }
        #cancel {
          margin-left: var(--hax-ui-gap-md, 8px);
        }
        @media screen and (max-width: 768px) {
          web-dialog::part(dialog) {
            --dialog-width: 100vw;
            --dialog-height: 100dvh;
            --dialog-border-radius: 0;
          }
        }
        /* Mini and wand Merlin: a HAX UI popover */
        :host([wand]) absolute-position-behavior {
          top: var(--ddd-spacing-8) !important;
          right: 0;
          position: fixed !important;
          display: table;
          /* Expand to available width when in wand mode at top */
          left: var(--ddd-spacing-6);
          margin-left: 16px;
        }
        absolute-position-behavior {
          z-index: var(--simple-modal-z-index, 10000);
          min-width: var(--super-daemon-width, 300px);
          width: var(--super-daemon-width, 300px);
          color: var(--hax-ui-text);
        }
        /* the wand popover is fixed 32px down; pull it up 20px (plus its
           1px border) so its 40px field covers the top bar field exactly */
        absolute-position-behavior super-daemon-ui[mini][wand] {
          margin: -21px 0 0 0;
          padding: 0;
        }
        absolute-position-behavior super-daemon-ui {
          width: var(--super-daemon-width, 300px);
          margin: calc(-1 * var(--ddd-spacing-16)) 0 0
            calc(-1 * var(--ddd-spacing-2));
          padding: 0;
          overflow: hidden;
          border: 1px solid var(--hax-ui-line);
          border-radius: var(--hax-ui-radius-lg, 8px);
          box-shadow: var(--hax-ui-shadow-popover);
        }
        super-daemon-ui {
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-surface);
        }

        /* Responsive adjustments for wand mode expansion */
        @media screen and (max-width: 1200px) {
          :host([wand]) absolute-position-behavior {
            max-width: calc(
              100vw - 150px
            ); /* Less space for user menu on smaller screens */
          }
        }

        @media screen and (max-width: 768px) {
          :host([wand]) absolute-position-behavior {
            max-width: calc(100vw - 60px); /* Even less space on mobile */
            left: var(--ddd-spacing-2);
          }
        }
      `,
    ];
  }
  setListeningStatus(value) {
    // always override value in santa mode
    if (this.santaMode) {
      this.listeningForInput = true;
    } else {
      this.listeningForInput = value;
    }
  }
  /**
   * Close the modal and do some clean up
   */
  close(e = {}) {
    // Re-entry guard: our own teardown fans back into this method twice --
    // web-dialog's native close event (fired by the ?open binding flip
    // below) and our global super-daemon-close listener both re-enter
    // close() after opened has already flipped false. Both arrive with
    // opened false, while a genuine web-dialog close (backdrop click or
    // Escape inside the dialog) arrives while opened is still true. Skip
    // the pure re-entries so the global super-daemon-close event is
    // dispatched exactly once per user-visible close instead of twice.
    if (
      e &&
      (e.type === "close" || e.type === "super-daemon-close") &&
      !this.opened
    ) {
      return;
    }
    // If an inline-token trigger (:: / :::) was cancelled WITHOUT a
    // selection, restore the stripped token at the strip point before
    // clearing state. _insertTextResult clears inlineTextInsert after a
    // successful insert, so this only fires on Escape / click-away.
    if (
      this.inlineTextInsert &&
      this.__inlineShortcutToken &&
      this.activeRange &&
      this.activeSelection
    ) {
      try {
        if (this.activeNode && this.activeNode.focus) {
          this.activeNode.focus();
        }
        this.activeSelection.removeAllRanges();
        this.activeSelection.addRange(this.activeRange);
        globalThis.document.execCommand(
          "insertHTML",
          false,
          this.__inlineShortcutToken,
        );
      } catch (err) {
        console.warn(err);
      }
      // Suppress the inline-token trigger for the very next keystroke after a
      // cancel. The restored token (e.g. ":: ") still ends with "::" so
      // __maybeTriggerInlineShortcut would immediately re-fire without this.
      this.__inlineShortcutSuppressNext = true;
    }
    // clean up event for click away in mini mode if active
    this.activeNode = null;
    this.loading = false;
    this.like = "";
    this.value = "";
    this.opened = false;
    this.mini = false;
    this.wand = false;
    this.inlineMode = false;
    this._programValues = {};
    this.programSearch = "";
    this.voiceCommands = {};
    this.voiceRanked = null;
    this.defaultVoiceCommands();
    this.programResults = [];
    this.programName = null;
    this.commandContext = "*";
    // reset inline-token trigger state so it does not leak across sessions
    this.inlineTextInsert = false;
    this.__inlineShortcutToken = null;
    // Clear any lingering text in the search input so it does not leak into
    // the next Merlin session (matches the Konami clear sequence).
    const ui =
      this.shadowRoot && this.shadowRoot.querySelector("super-daemon-ui");
    if (ui) {
      // drop any inline line-up so the next open starts from the CSS
      ui.style.marginTop = "";
      ui.like = "";
      ui.programSearch = "";
      // reset the child command context in the same tick so a pending
      // super-daemon-command-context-changed dispatch out of
      // super-daemon-ui.updated() (scheduled before this close ran) cannot
      // land after the reset above and overwrite it with a stale child value
      ui.commandContext = "*";
      const search =
        ui.shadowRoot && ui.shadowRoot.querySelector("super-daemon-search");
      if (search) {
        search.value = "";
        const inputField =
          search.shadowRoot && search.shadowRoot.querySelector("#inputfilter");
        if (inputField) {
          inputField.value = "";
        }
      }
    }
    // Reset Konami Code sequence when closing
    this.resetKonamiCode();
    // important we stop listening when the UI goes away
    this.setListeningStatus(false);
    // hide the toast if it's up.. unless in santa mode..
    if (!this.santaMode) {
      // generate a close event if this wasn't already from a close event
      // this happens when other parts of the program invoke close() directly
      // as opposed to the event of selecting a result
      if (!e || e.type !== "super-daemon-close") {
        globalThis.dispatchEvent(
          new CustomEvent("super-daemon-close", {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: true,
          }),
        );
      }
      // we have an event, but not a close event
      if (e && e.type !== "super-daemon-close" && e.type !== "close") {
        globalThis.dispatchEvent(
          new CustomEvent("super-daemon-toast-hide", {
            bubbles: true,
            composed: true,
            cancelable: false,
            detail: false,
          }),
        );
      }
    }
    const event = new MouseEvent("click", {
      view: globalThis,
      bubbles: true,
      cancelable: true,
    });
    globalThis.document.dispatchEvent(event);
    this.windowControllers2.abort();
    if (this.shadowRoot && this.shadowRoot.querySelector("web-dialog")) {
      const wd = this.shadowRoot.querySelector("web-dialog");
      if (wd.$backdrop && wd.onBackdropClick) {
        wd.$backdrop.removeEventListener("click", wd.onBackdropClick);
      }
      if (wd.onKeyDown) {
        wd.removeEventListener("keydown", wd.onKeyDown, true);
      }
    }
    if (globalThis.ShadyCSS && !globalThis.ShadyCSS.nativeShadow) {
      this.shadowRoot
        .querySelector("web-dialog")
        .shadowRoot.querySelector("#backdrop").style.position = "relative";
    }
  }
  filterItems(items, context) {
    let tmpItems = items.filter((item) => {
      // options can opt out of being listed in Merlin browse / search results
      // (e.g. the emoji + symbol pickers) while remaining registered in
      // allItems so a dedicated shortcut can still invoke them by machineName
      // via runProgram / waveWand.
      if (item.hidden) {
        return false;
      }
      // inlineOnly programs (e.g. the emoji + symbol pickers) are listed in
      // Merlin ONLY when it is invoked inline (slash-in-empty-block, :: / :::
      // token, or RTE toolbar button). They never appear in the global / and
      // > browse / search contexts so they stop polluting media and block
      // searches. They stay registered in allItems so the inline triggers can
      // still resolve them by machineName via runProgram / waveWand.
      // inlineOnly also implies inline-eligibility, so such items do NOT also
      // need inline: true (avoiding dual flags on the same option).
      if (item.inlineOnly && !this.inlineMode) {
        return false;
      }
      if (this.inlineMode && !item.inline && !item.inlineOnly) {
        return false;
      }
      // ensuire we have a context at all
      if (item.context) {
        // if we're in a global context, include all global context results
        let results = [];
        // if we have a context and it's ALL then it shows up for any context
        // system wide commands for example
        if (item.context === "*") {
          return item;
        }
        if (this.commandContext == "*") {
          results = context.filter((value) => item.context.includes(value));
        } else {
          results = [this.commandContext].filter((value) => {
            return item.context.includes(value);
          });
        }
        return results.length !== 0;
      }
      return true;
    });
    // order alphabeticly
    tmpItems.sort((a, b) => {
      let textA = a.title.toUpperCase();
      let textB = b.title.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
    // highest priority if item title is exact match
    tmpItems.forEach((item) => {
      if (item.title.toLocaleLowerCase() === this.value.toLocaleLowerCase()) {
        item.priority = -10000000;
      }
    });
    // then on priority
    return tmpItems.sort((a, b) => {
      return a.priority < b.priority ? -1 : a.priority > b.priority ? 1 : 0;
    });
  }
  /**
   * Reset Konami Code sequence
   */
  resetKonamiCode() {
    this.konamiProgress = [];
    if (this.konamiTimeout) {
      clearTimeout(this.konamiTimeout);
      this.konamiTimeout = null;
    }
  }

  /**
   * Check for Konami Code sequence
   * @param {KeyboardEvent} e - The keyboard event
   */
  checkKonamiCode(e) {
    // Clear timeout if exists
    if (this.konamiTimeout) {
      clearTimeout(this.konamiTimeout);
    }

    // Get the key code for the current key
    let keyCode = e.code || e.key;
    // Handle legacy key names for arrow keys
    if (e.key === "ArrowUp") keyCode = "ArrowUp";
    else if (e.key === "ArrowDown") keyCode = "ArrowDown";
    else if (e.key === "ArrowLeft") keyCode = "ArrowLeft";
    else if (e.key === "ArrowRight") keyCode = "ArrowRight";
    else if (e.key === "b" || e.key === "B") keyCode = "KeyB";
    else if (e.key === "a" || e.key === "A") keyCode = "KeyA";

    // Check if this key matches the next expected key in sequence
    if (keyCode === this.konamiSequence[this.konamiProgress.length]) {
      this.konamiProgress.push(keyCode);

      // Check if sequence is complete
      if (this.konamiProgress.length === this.konamiSequence.length) {
        this.konamiCodeEntered();
        this.konamiProgress = []; // Reset
        return;
      }
    } else {
      // Wrong key, reset sequence
      this.konamiProgress = [];
      // Check if this key could be the start of a new sequence
      if (keyCode === this.konamiSequence[0]) {
        this.konamiProgress.push(keyCode);
      }
    }

    // Set timeout to reset sequence after 3 seconds of inactivity
    this.konamiTimeout = setTimeout(() => {
      this.konamiProgress = [];
    }, 3000);
  }

  /**
   * Handle successful Konami Code entry
   */
  async konamiCodeEntered() {
    // Clear the input if merlin is open to remove 'ba' characters
    if (this.opened && this.shadowRoot.querySelector("super-daemon-ui")) {
      this.value = "";
      const ui = this.shadowRoot.querySelector("super-daemon-ui");
      if (ui) {
        ui.like = "";
        ui.programSearch = "";
        const search = ui.shadowRoot.querySelector("super-daemon-search");
        if (search) {
          search.value = "";
          const inputField = search.shadowRoot.querySelector("#inputfilter");
          if (inputField) {
            inputField.value = "";
          }
        }
      }
    }

    // Play coin sound 3 times, then success sound
    await this.playSound("coin2");
    await this.playSound("coin2");
    await this.playSound("coin2");
    await this.playSound("success");

    // Dispatch event to let HAXcms know Konami Code was entered
    globalThis.dispatchEvent(
      new CustomEvent("super-daemon-konami-code", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          timestamp: Date.now(),
          source: "super-daemon",
        },
      }),
    );
  }

  playSound(sound = "coin2") {
    return new Promise((resolve) => {
      globalThis.dispatchEvent(
        new CustomEvent("playaudio", {
          detail: {
            sound: sound,
          },
        }),
      );
      resolve();
    });
  }
  // can't directly set context
  appendContext(context) {
    if (context && !this.context.includes(context)) {
      let newContext = [...this.context];
      newContext.push(context);
      this.context = [...newContext];
    }
  }
  // remove from context
  removeContext(context) {
    if (context && this.context.includes(context)) {
      let newContext = [...this.context];
      newContext.splice(newContext.indexOf(context), 1);
      this.context = [...newContext];
    }
  }
  // if we click away, take the active value and apply it to the line
  // ensure a synthetic event does not trigger this
  clickOnMiniMode(e) {
    if (!this.mini || !this.opened) {
      return;
    }
    const path = e.composedPath ? e.composedPath() : [];
    const clickedInsideMerlin = path.includes(this);
    // ensure clicking on us does not disappear but since this is a "once"
    // event application we need to reissue the event if we clicked on us.
    // also reissue if the event is synthetic so startup interactions do not
    // consume the one-time listener before a real click-away occurs.
    if (!e.isTrusted || clickedInsideMerlin) {
      globalThis.addEventListener("click", this.clickOnMiniMode.bind(this), {
        once: true,
        passive: true,
        signal: this.windowControllers2.signal,
      });
      return;
    }
    this.miniCancel();
  }
  // if we cancel out of mini mode there's a lot of UX enhancements we can do for the end user
  miniCancel() {
    if (
      this.activeNode &&
      this.activeNode.focus &&
      this.mini &&
      !this.wand &&
      this.activeRange &&
      this.activeSelection
    ) {
      try {
        if (this.inlineTextInsert) {
          // inline-token path: close() restores the stripped token, so do
          // nothing here — just fall through to this.close() below.
        } else {
          this.activeNode.textContent = this.value;
          this.activeNode.focus();
          this.activeRange.setStart(this.activeNode, 0);
          this.activeRange.collapse(true);
          this.activeSelection.removeAllRanges();
          this.activeSelection.addRange(this.activeRange);
          this.activeSelection.selectAllChildren(this.activeNode);
          this.activeSelection.collapseToEnd();
        }
      } catch (e) {
        console.warn(e);
      }
    }
    this.close();
  }
  open() {
    // filter to context
    this.opened = true;
    // Reset Konami Code sequence when opening for fresh start
    this.resetKonamiCode();
    this.items = this.filterItems(this.allItems, this.context);
    const wd = this.shadowRoot.querySelector("web-dialog");
    if (wd) {
      // modal mode kills off the ability to close the dialog
      if (wd.$backdrop && wd.onBackdropClick) {
        wd.$backdrop.removeEventListener("click", wd.onBackdropClick);
        wd.$backdrop.addEventListener("click", wd.onBackdropClick);
      }
      if (wd.onKeyDown) {
        wd.removeEventListener("keydown", wd.onKeyDown, true);
        wd.addEventListener("keydown", wd.onKeyDown, {
          capture: true,
          passive: true,
        });
      }
      if (globalThis.ShadyCSS && !globalThis.ShadyCSS.nativeShadow) {
        this.shadowRoot
          .querySelector("web-dialog")
          .shadowRoot.querySelector("#backdrop").style.position = "fixed";
        this.shadowRoot
          .querySelector("web-dialog")
          .shadowRoot.querySelector("#backdrop").style.top = 0;
        this.shadowRoot
          .querySelector("web-dialog")
          .shadowRoot.querySelector("#backdrop").style.bottom = 0;
        this.shadowRoot
          .querySelector("web-dialog")
          .shadowRoot.querySelector("#backdrop").style.left = 0;
        this.shadowRoot
          .querySelector("web-dialog")
          .shadowRoot.querySelector("#backdrop").style.right = 0;
      }
    }
    this.windowControllers2.abort();
    this.reprocessVoiceCommands();
    requestAnimationFrame(() => {
      this.windowControllers2 = new AbortController();
      // ensure if we click away from the UI that we close and clean up
      if (this.mini) {
        globalThis.addEventListener("click", this.clickOnMiniMode.bind(this), {
          once: true,
          passive: true,
          signal: this.windowControllers2.signal,
        });
      }
      this.shadowRoot.querySelector("super-daemon-ui").focusInput();
      // inline (/ in a text block): once placed, line the field up with
      // the line that was typed on
      if (this.mini && !this.wand) {
        requestAnimationFrame(() => this._alignInlineField());
      }
    });
  }
  /**
   * Inline mini Merlin (opened with / in an empty text block) is pulled up
   * over the block so its search field sits where the text was being typed.
   * A fixed pull-up can't know the block's line height or padding, so it
   * drew the field above the line; measure the real field and the real line
   * and move the popover by the difference.
   */
  _alignInlineField() {
    if (!this.opened || !this.mini || this.wand || !this.activeNode) {
      return;
    }
    const ui = this.shadowRoot
      ? this.shadowRoot.querySelector(
          "absolute-position-behavior super-daemon-ui",
        )
      : null;
    const search =
      ui && ui.shadowRoot
        ? ui.shadowRoot.querySelector("super-daemon-search")
        : null;
    const lineCenter = this._inlineLineCenter();
    if (!ui || !search || lineCenter === null) {
      return;
    }
    const fieldRect = search.getBoundingClientRect();
    if (!fieldRect.height) {
      return;
    }
    const delta = lineCenter - (fieldRect.top + fieldRect.height / 2);
    if (Math.abs(delta) < 1) {
      return;
    }
    const current = parseFloat(globalThis.getComputedStyle(ui).marginTop) || 0;
    ui.style.marginTop = `${Math.round(current + delta)}px`;
  }
  /**
   * Vertical middle of the line the caret is on: the caret's own box when
   * the browser gives one, else (an empty block has none) the block's first
   * line from its padding and line height.
   * @returns {number|null}
   */
  _inlineLineCenter() {
    if (this.activeRange && this.activeRange.getClientRects) {
      const rects = this.activeRange.getClientRects();
      if (rects && rects.length && rects[0].height) {
        return rects[0].top + rects[0].height / 2;
      }
    }
    let el = this.activeNode;
    if (el && el.nodeType === Node.TEXT_NODE) {
      el = el.parentElement;
    }
    if (!el || !el.getBoundingClientRect) {
      return null;
    }
    const rect = el.getBoundingClientRect();
    const cs = globalThis.getComputedStyle(el);
    let lineHeight = parseFloat(cs.lineHeight);
    if (isNaN(lineHeight)) {
      lineHeight = (parseFloat(cs.fontSize) || 16) * 1.2;
    }
    const top =
      rect.top +
      (parseFloat(cs.borderTopWidth) || 0) +
      (parseFloat(cs.paddingTop) || 0);
    return top + lineHeight / 2;
  }
  focusout(e) {
    if (e) {
      let parent = e.relatedTarget;
      while (parent !== globalThis.document.body && parent !== null) {
        if (parent === this.shadowRoot.querySelector("super-daemon-ui")) {
          return;
        }
        if (parent && parent.parentElement) {
          parent = parent.parentElement;
        } else {
          return;
        }
      }
      if (parent !== this.shadowRoot.querySelector("super-daemon-ui")) {
        setTimeout(() => {
          if (this.opened) {
            this.shadowRoot.querySelector("super-daemon-ui").focusInput();
          }
        }, 0);
      }
    }
  }
  // if we have no results, allow for a slot to be applied via someone
  // consuming this in their app. example - providing a link to suggest a
  // new command be added
  noResultsSlot(_searchTerm) {
    return;
  }
  /**
   * LitElement render callback
   */
  render() {
    return html`${
      this.mini
        ? html`
            <absolute-position-behavior
              justify
              position="${this.wand ? "right" : "bottom"}"
              allow-overlap
              sticky
              auto
              .target="${this.activeNode}"
              ?hidden="${!this.opened}"
            >
              <super-daemon-ui
                ?opened="${this.opened}"
                ?mini="${this.mini}"
                ?wand="${this.wand}"
                icon="${this.icon}"
                ?dark="${this.dark}"
                ?loading="${this.loading}"
                like="${this.like}"
                ?listening-for-input="${this.listeningForInput}"
                ?voice-search="${this.voiceSearch}"
                .items="${
                  this.voiceRanked ||
                  this.itemsForDisplay(this.items, this.programResults)
                }"
                command-context="${this.commandContext}"
                program-name="${this.programName}"
                program-placeholder="${this.programPlaceholder || ""}"
                program-search="${this.programSearch}"
                @value-changed="${this.inputfilterChanged}"
                @super-daemon-close="${this.close}"
                @super-daemon-expand="${this.expand}"
                @super-daemon-command-context-changed="${
                  this.commandContextChanged
                }"
                >${this.noResultsSlot(
                  this.like || this.programSearch,
                )}</super-daemon-ui
              >
            </absolute-position-behavior>
          `
        : html`
            <web-dialog
              id="dialog"
              center
              role="dialog"
              part="dialog"
              aria-label="${this.t.superDaemon}"
              aria-modal="true"
              ?open="${this.opened}"
              @open="${this.open}"
              @close="${this.close}"
              @focusout="${this.focusout}"
            >
              <div class="titlebar hax-ui-dialog-titlebar" part="titlebar">
                ${merlinMark(this.icon) || merlinMark("hax:wand")}
                <h2 class="hax-ui-dialog-title">${this.t.merlin}</h2>
                <span class="keys" aria-hidden="true"
                  >${this.key1} + ${this.key2}</span
                >
                <button
                  type="button"
                  id="cancel"
                  class="hax-ui-dialog-close"
                  aria-label="${this.t.closeMerlin}"
                  title="${this.t.closeMerlin}"
                  @click="${this.close}"
                >
                  <simple-icon-lite
                    icon="${HaxUiAdminIcons.close}"
                  ></simple-icon-lite>
                </button>
              </div>
              <super-daemon-ui
                ?opened="${this.opened}"
                icon="${this.icon}"
                ?loading="${this.loading}"
                like="${this.like}"
                ?dark="${this.dark}"
                ?voice-search="${this.voiceSearch}"
                ?listening-for-input="${this.listeningForInput}"
                @like-changed="${this.likeChanged}"
                .items="${
                  this.voiceRanked ||
                  this.itemsForDisplay(this.items, this.programResults)
                }"
                command-context="${this.commandContext}"
                program-name="${this.programName}"
                program-placeholder="${this.programPlaceholder || ""}"
                program-search="${this.programSearch}"
                @value-changed="${this.inputfilterChanged}"
                @super-daemon-close="${this.close}"
                @super-daemon-command-context-changed="${
                  this.commandContextChanged
                }"
                >${this.noResultsSlot(
                  this.like || this.programSearch,
                )}</super-daemon-ui
              >
            </web-dialog>
          `
    } `;
  }
  /**
   * Move from the mini / wand popover to the full Merlin dialog, keeping
   * what has been typed, the context and any running program.
   */
  expand() {
    // the popover's super-daemon-ui is replaced by the dialog's, so carry
    // its live input over: a program's input stays programSearch, global
    // search text stays like (the popover does not report like upward)
    const current = this.shadowRoot
      ? this.shadowRoot.querySelector("super-daemon-ui")
      : null;
    let typed = "";
    if (current) {
      if (this.programName) {
        this.programSearch = current.programSearch || "";
        typed = this.programSearch;
      } else {
        this.like = current.like || "";
        typed = this.like;
      }
    }
    this.mini = false;
    this.wand = false;
    this.activeNode = null;
    // the dialog moves focus to its first control (close) as it opens;
    // put the text and focus back in the search field once it has rendered
    this.updateComplete.then(() => {
      setTimeout(() => {
        const ui = this.shadowRoot.querySelector("super-daemon-ui");
        if (ui) {
          const search = ui.shadowRoot
            ? ui.shadowRoot.querySelector("super-daemon-search")
            : null;
          if (search && typed) {
            search.value = typed;
            const field = search.shadowRoot
              ? search.shadowRoot.querySelector("#inputfilter")
              : null;
            if (field) {
              field.value = typed;
            }
          }
          ui.focusInput();
        }
      }, 50);
    });
  }
  likeChanged(e) {
    this.like = e.detail.value;
  }

  randomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
  }
  toggleSantaMode(_e) {
    this.santaMode = !this.santaMode;
    setTimeout(() => {
      let say = this.t.santaModeActivated;
      if (!this.santaMode) {
        say = this.t.santaModeDeactivated;
      }
      this.hal.speak(say, this.santaMode).then((_e) => {
        this.setListeningStatus(this.santaMode);
        this.hal.setToast(this.t.listening);
      });
    }, 0);
  }
  merlinSpeak(phrase) {
    this.hal.speak(phrase, false, false).then((_e) => {
      this.close();
    });
  }
  promptMerlin(_e) {
    if (!this.opened) {
      this.open();
    }
    this.__closeLock = true;
    this.listeningForInput = false;
    this.hal
      .speak(
        this.randomResponse([
          this.t.imHere,
          this.t.yes,
          this.t.what,
          this.t.whatCanIDo,
          this.t.whatDoYouNeed,
          this.t.howCanIHelp,
        ]),
        this.santaMode,
      )
      .then((_e) => {
        this.playSound().then((_e) => {
          this.listeningForInput = true;
          this.__closeLock = false;
        });
      });
  }
  stopMerlin(_e) {
    if (this.santaMode) {
      this.hal.speak(this.t.disableSantaModeToStop, this.santaMode);
    }
    this.setListeningStatus(false);
  }
  closeMerlin(_e) {
    if (!this.santaMode) {
      this.hal
        .speak(
          this.randomResponse([
            this.t.thanksForStopping,
            this.t.seeYa,
            this.t.seeYouSoon,
            this.t.tillWeMeetAgain,
          ]),
          this.santaMode,
        )
        .then((_e) => {
          this.close();
        });
    } else {
      this.close();
    }
  }
  belsnickel() {
    if (this.santaMode) {
      this.toggleSantaMode();
    }
  }

  // apply default voice commands for when we reset the voice UI
  defaultVoiceCommands() {
    this.addVoiceCommand(`(hey) ${this.voiceRespondsTo}`, this, "promptMerlin");
    this.addVoiceCommand(`(hey) marilyn`, this, "promptMerlin"); // common mispronunciation
    this.addVoiceCommand(`stop listening`, this, "stopMerlin");
    this.addVoiceCommand(`close merlin`, this, "closeMerlin");
    // the same commands in the user's language
    this.addVoiceCommand(this.t.sayStopListening, this, "stopMerlin");
    this.addVoiceCommand(this.t.sayCloseMerlin, this, "closeMerlin");
    this.addVoiceCommand(this.t.sayDisableSanta, this, "belsnickel");
    this.addVoiceCommand(`cancel merlin`, this, "closeMerlin");
    this.addVoiceCommand(`disable santa (mode)`, this, "belsnickel");
    this.addVoiceCommand(`belsnickel`, this, "belsnickel");
    this.addVoiceCommand(`scroll`, this, "scroll");

    this.voiceCommands[`scroll up`] = (_response) => {
      globalThis.scrollBy({
        top: -(globalThis.innerHeight * 0.5),
        left: 0,
        behavior: "smooth",
      });
    };
    this.voiceCommands[`scroll (down)`] = (_response) => {
      globalThis.scrollBy({
        top: globalThis.innerHeight * 0.5,
        left: 0,
        behavior: "smooth",
      });
    };
    this.voiceCommands[`scroll (to) bottom`] = (_response) => {
      globalThis.scrollTo(0, globalThis.document.body.scrollHeight);
    };
    this.voiceCommands[`scroll (to) top`] = (_response) => {
      globalThis.scrollTo(0, 0);
    };
    this.voiceCommands[`back to top`] = (_response) => {
      globalThis.scrollTo(0, 0);
    };

    this.voiceCommands["(run) program"] = (_response) => {
      this.commandContextChanged({
        detail: { value: "/", label: this.t.programModeActivated },
      });
    };
    this.voiceCommands["developer (mode)"] = (_response) => {
      this.commandContextChanged({
        detail: { value: ">", label: this.t.developerModeActivated },
      });
    };
    // anything else is spoken search: hal-9000 reports it as a no-match
    // and _voiceHeard() scores it against the commands
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    // wand hasa to forcibly be near the target
    if (
      changedProperties.has("activeNode") &&
      this.activeNode &&
      this.wand &&
      this.mini
    ) {
      requestAnimationFrame(() => {
        // activeNode can be cleared (e.g. by close()) between this frame
        // being scheduled and it firing; re-check before dereferencing
        if (this.activeNode) {
          const rect = this.activeNode.getBoundingClientRect();
          this.shadowRoot.querySelector(
            "absolute-position-behavior",
          ).style.left = rect.left + rect.width + "px";
        }
      });
    }
    if (changedProperties.has("commandContext")) {
      this.dispatchEvent(
        new CustomEvent("super-daemon-command-context-changed", {
          bubbles: true,
          composed: true,
          detail: {
            value: this.commandContext,
          },
        }),
      );
    }
    if (changedProperties.has("context")) {
      this.dispatchEvent(
        new CustomEvent("super-daemon-context-changed", {
          bubbles: true,
          composed: true,
          detail: {
            value: this.context,
          },
        }),
      );
    }
    if (changedProperties.has("voiceSearch") && this.voiceSearch) {
      import("@haxtheweb/hal-9000/hal-9000.js").then(() => {
        this.hal = globalThis.Hal9000.requestAvailability();
        this.hal.debug = false; // enable to see all available commands in console
        this.hal.toast = true;
        this._listenToHal(this.hal);
        this.defaultVoiceCommands();
      });
    } else if (changedProperties.has("voiceSearch") && !this.voiceSearch) {
      this.hal = null;
    }
    // align state of voice enabled with hal
    if (changedProperties.has("listeningForInput") && this.hal) {
      this.hal.enabled = this.listeningForInput;
      if (this.listeningForInput && this.opened) {
        this._showVoiceTip();
      }
      if (globalThis.HAXCMS) {
        if (this.listeningForInput) {
          globalThis.HAXCMS.instance.setCursor("hax:loading");
          globalThis.HAXCMS.instance.setFavicon("hax:loading");
        } else {
          globalThis.HAXCMS.instance.resetCursor();
          globalThis.HAXCMS.instance.resetFavicon();
        }
      }
      clearTimeout(this._listeningTimeout);
      this._listeningTimeout = setTimeout(() => {
        // if we shut off, ensure we close the toast
        if (!this.listeningForInput && !this.__closeLock) {
          globalThis.dispatchEvent(
            new CustomEvent("super-daemon-toast-hide", {
              bubbles: true,
              composed: true,
              cancelable: false,
              detail: false,
            }),
          );
        }
      }, 100);
    }
  }
  async inputfilterChanged(e) {
    // update this value as far as what's being typed no matter what it is
    this.value = e.detail.value;
    if (this.programName && this._programToRun) {
      // Debounce program execution to prevent flickering on rapid input
      clearTimeout(this._programDebounceTimeout);
      // When the input is cleared, immediately enter loading state so the
      // UI shows we are re-fetching (the empty/default search) instead of
      // leaving the previously typed term's results visible through the
      // entire debounce window. For non-empty typing we keep the prior
      // results visible until the debounced request fires (smoother UX).
      if (e.detail.value === "") {
        this.loading = true;
      }
      this._programDebounceTimeout = setTimeout(async () => {
        this.loading = true;
        this.programResults = await this._programToRun(
          e.detail.value,
          this._programValues,
        );
        this.loading = false;
      }, 150); // 150ms debounce delay
    } else {
      this.programResults = [];
      // we moved back out of a context, reset complete
      this.items = this.filterItems(this.allItems, this.context);
    }
  }

  itemsForDisplay(items, programResults) {
    if (this.programName != null) {
      return programResults;
    }
    return items;
  }
  /**
   * Listen to what hal-9000 hears and reports about the microphone, once
   * per connection (a reconnect makes a new signal and listens again).
   * @param {HTMLElement} hal
   */
  _listenToHal(hal) {
    if (!hal || hal.__merlinSignal === this.windowControllers.signal) {
      return;
    }
    hal.__merlinSignal = this.windowControllers.signal;
    hal.addEventListener(
      "hal-9000-listening-state",
      (e) => this._voiceStateChanged(e.detail.state),
      { signal: this.windowControllers.signal },
    );
    // what is heard beyond the fixed commands is spoken search
    hal.addEventListener(
      "hal-9000-no-match",
      (e) => this._voiceHeard(e.detail.alternatives),
      { signal: this.windowControllers.signal },
    );
    hal.addEventListener(
      "hal-9000-interim",
      (e) => this._voiceInterim(e.detail.text),
      { signal: this.windowControllers.signal },
    );
  }

  /**
   * The mic was refused, or this browser cannot recognize speech: stop
   * listening and say why. When speech is unavailable the mic button also
   * goes away for the rest of the session.
   * @param {string} state idle, listening, blocked or unavailable
   */
  _voiceStateChanged(state) {
    if (state !== "blocked" && state !== "unavailable") {
      return;
    }
    this.setListeningStatus(false);
    globalThis.dispatchEvent(
      new CustomEvent("super-daemon-toast-show", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          text:
            state === "blocked"
              ? this.t.voiceMicBlocked
              : this.t.voiceUnavailable,
          duration: 6000,
        },
      }),
    );
    if (state === "unavailable") {
      this._refreshVoiceControls();
    }
  }

  /** Re-render every Merlin search box so the mic button can hide */
  _refreshVoiceControls() {
    const roots = [this.shadowRoot];
    const ui = this.shadowRoot
      ? this.shadowRoot.querySelector("super-daemon-ui")
      : null;
    if (ui && ui.shadowRoot) {
      roots.push(ui.shadowRoot);
    }
    roots.forEach((root) => {
      if (root) {
        root.querySelectorAll("super-daemon-search").forEach((search) => {
          search.requestUpdate();
        });
      }
    });
  }

  reprocessVoiceCommands() {
    if (this.hal && this.voiceSearch && this.items) {
      clearTimeout(this._blockRerunTimeout);
      this._blockRerunTimeout = setTimeout(() => {
        this.defaultVoiceCommands();
        const vocab = this._voiceVocabulary();
        // built once per item list, so each utterance only scores
        this._voiceEntries = merlinVoiceEntries(this.items, vocab);
        this.hal.commands = { ...this.voiceCommands };
        // bias recognition toward what can be said here, where supported
        const phrases = [];
        this.items.forEach((item) => {
          if (item.title) {
            phrases.push(item.title);
          }
        });
        ["next", "back", "run", "clear", "help"].forEach((key) => {
          phrases.push(...vocab[key]);
        });
        this.hal.phrases = phrases;
      }, 10);
    }
  }

  /**
   * The spoken search words in the user's language. Action words keep the
   * English ones too, since many people say "next" in any language;
   * numbers and ordinals are positional, so they stay one language.
   */
  _voiceVocabulary() {
    const both = (local, en) =>
      merlinWordList(local).concat(merlinWordList(en)).join("|");
    const en = MERLIN_VOICE_VOCAB_EN;
    return merlinVoiceVocab({
      fillers: both(this.t.voiceFillers, en.fillers),
      stopWords: both(this.t.voiceStopWords, en.stopWords),
      numbers: this.t.voiceNumbers,
      ordinals: this.t.voiceOrdinals,
      pickPrefixes: both(this.t.voicePickPrefixes, en.pickPrefixes),
      pickSuffix: both(this.t.voicePickSuffix, en.pickSuffix),
      numberSoundalikes: both(
        this.t.voiceNumberSoundalikes,
        en.numberSoundalikes,
      ),
      next: both(this.t.voiceNext, en.next),
      back: both(this.t.voiceBack, en.back),
      run: both(this.t.voiceRun, en.run),
      clear: both(this.t.voiceClear, en.clear),
      cancel: both(this.t.voiceCancel, en.cancel),
      help: both(this.t.voiceHelp, en.help),
    });
  }

  _ui() {
    return this.shadowRoot
      ? this.shadowRoot.querySelector("super-daemon-ui")
      : null;
  }

  /**
   * Words so far, while someone is still talking. Only the card changes;
   * results are not filtered until the words are final.
   * @param {string} text
   */
  _voiceInterim(text) {
    if (this.listeningForInput && this.toastInstance) {
      this.toastInstance.heard = text;
    }
  }

  /**
   * Update the voice card: what was heard and a tip for what to say next.
   */
  _voiceCard(heard, hint, hintSay, sayList) {
    const toast = this.toastInstance;
    if (!toast) {
      return;
    }
    toast.heard = heard || "";
    toast.hint = hint || "";
    toast.hintSay = hintSay || "";
    toast.sayList = sayList || [];
  }

  /** "second one" in the user's language */
  _voicePickPhrase(vocab) {
    const ordinal = vocab.ordinals[2] || "2";
    return vocab.pickSuffix.length
      ? ordinal + " " + vocab.pickSuffix[0]
      : ordinal;
  }

  /**
   * A different tip each time listening starts, so people learn what
   * they can say without a manual.
   */
  _showVoiceTip() {
    const vocab = this._voiceVocabulary();
    const tips = [
      [this.t.voiceTipPick, this._voicePickPhrase(vocab)],
      [this.t.voiceTipNext, vocab.next[0]],
      [this.t.voiceTipClear, vocab.clear[0]],
      [this.t.voiceTipHelp, vocab.help[0]],
    ];
    const tip = tips[this._voiceTip % tips.length];
    this._voiceTip++;
    this._voiceCard("", tip[0], tip[1]);
  }

  /** Everything that can be said right now, for "help" */
  _voiceHelp(vocab) {
    const ui = this._ui();
    const list = [
      { say: this._voicePickPhrase(vocab), label: this.t.voiceRunResult },
      { say: vocab.next[0], label: this.t.voiceMoveDown },
      { say: vocab.back[0], label: this.t.voiceMoveUp },
      { say: vocab.run[0], label: this.t.voiceRunHighlighted },
      { say: vocab.clear[0], label: this.t.voiceStartOver },
      { say: this.t.sayStopListening, label: this.t.voiceStopListeningLabel },
      { say: this.t.sayCloseMerlin, label: this.t.voiceCloseLabel },
    ];
    // and the first few results by name
    const shown = ui && ui.filtered ? ui.filtered.slice(0, 3) : [];
    shown.forEach((item) => {
      list.push({ say: (item.voice || item.title).toLowerCase(), label: "" });
    });
    this._voiceCard("", this.t.voiceYouCanSay, "", list);
  }

  /**
   * A result ran by voice: stop listening unless it opened a program,
   * which takes spoken input next.
   */
  _voiceAfterRun(item) {
    if (item && item.value && item.value.program) {
      this.playSound().then(() => {
        const ui = this._ui();
        if (ui) {
          ui.focusInput();
        }
      });
      return;
    }
    this.playSound("success");
    this.setListeningStatus(false);
  }

  /** Run the result at an index in what is shown */
  _voicePickAt(index) {
    const ui = this._ui();
    const item = ui && ui.filtered ? ui.filtered[index] : null;
    if (!item || !ui.voicePick(index)) {
      return false;
    }
    this._voiceAfterRun(item);
    return true;
  }

  /**
   * Run one item: show it alone and select it, as the keyboard would.
   * @param {Object} item
   */
  async _voiceRunItem(item) {
    this.like = "";
    this.value = item.title;
    this.voiceRanked = [item];
    await this.updateComplete;
    const ui = this._ui();
    if (ui) {
      ui.like = "";
      await ui.updateComplete;
      ui.voicePick(0);
    }
    this._voiceAfterRun(item);
  }

  /**
   * A navigation phrase: pick, next, back, run, clear, cancel, help.
   * @returns {boolean} true when handled
   */
  _voiceGrammar(alternatives, vocab) {
    const ui = this._ui();
    for (let a = 0; a < alternatives.length; a++) {
      const g = merlinParseVoiceGrammar(alternatives[a], vocab);
      if (!g) {
        continue;
      }
      switch (g.action) {
        case "pick":
          if (!this._voicePickAt(g.index)) {
            this.playSound("error");
            this._voiceCard(
              alternatives[a],
              this.t.voiceNoSuchResult.replace("{number}", g.index + 1),
              this._voicePickPhrase(vocab),
            );
          }
          return true;
        case "next":
        case "back":
          if (ui) {
            ui.voiceMove(g.action === "next" ? 1 : -1);
          }
          this._voiceCard(alternatives[a], this.t.voiceTipPick, vocab.run[0]);
          return true;
        case "run": {
          const index =
            ui && ui.voiceSelectedIndex >= 0 ? ui.voiceSelectedIndex : 0;
          this._voicePickAt(index);
          return true;
        }
        case "clear":
          this.voiceRanked = null;
          this.like = "";
          if (ui) {
            ui.like = "";
          }
          this._showVoiceTip();
          return true;
        case "cancel":
          this.closeMerlin();
          return true;
        case "help":
          this._voiceHelp(vocab);
          return true;
      }
    }
    return false;
  }

  /**
   * Words for a running program. They go in the field like typing, and
   * Merlin keeps listening so the numbered results can be picked by voice.
   * @param {string} heard
   * @param {Object} vocab
   */
  _voiceProgramInput(heard, vocab) {
    const ui = this._ui();
    if (ui) {
      ui.like = heard;
      ui.focusInput();
    }
    this.playSound("click");
    this._voiceCard(
      heard,
      this.t.voiceShowingMatches,
      this._voicePickPhrase(vocab),
    );
  }

  /**
   * Final words that were not a fixed command. Spoken search, no AI:
   * 1. a navigation phrase ("second one", "next", "run") acts on results
   * 2. otherwise score every alternative against the commands here
   *    - high: one clear answer, run it
   *    - medium: likely answers, show them and ask
   *    - low: search with the words, so nothing is lost
   * Inside a program, the words are the program's input.
   * @param {Array<string>} alternatives best guess first
   */
  async _voiceHeard(alternatives) {
    if (!alternatives || !alternatives.length || !this.listeningForInput) {
      return;
    }
    const heard = alternatives[0];
    const vocab = this._voiceVocabulary();
    // a program lists its own options and numbers them too: "option 2",
    // "next" and "run" act on them; anything else is the program's input
    if (this.programName) {
      if (this.opened && this._voiceGrammar(alternatives, vocab)) {
        return;
      }
      this._voiceProgramInput(heard, vocab);
      return;
    }
    if (this.opened && this._voiceGrammar(alternatives, vocab)) {
      return;
    }
    const ranked = merlinRankVoice(alternatives, this._voiceEntries, vocab);
    const band = merlinVoiceBand(ranked);
    // closed (Santa mode) only acts on a clear answer
    if (!this.opened) {
      if (band === "high") {
        this._voiceRunItem(ranked[0].item);
      }
      return;
    }
    if (band === "high") {
      this._voiceCard(ranked[0].transcript);
      this._voiceRunItem(ranked[0].item);
      return;
    }
    const ui = this._ui();
    if (band === "medium") {
      this.like = "";
      this.voiceRanked = ranked.slice(0, 5).map((r) => r.item);
      await this.updateComplete;
      if (ui) {
        ui.like = "";
        await ui.updateComplete;
        ui.voiceHighlight(0);
      }
      this.playSound("click");
      this._voiceCard(
        ranked[0].transcript,
        this.t.voiceDidYouMean.replace("{title}", ranked[0].item.title),
        vocab.run[0],
      );
      return;
    }
    // low: the words become the search, and listening carries on
    this.voiceRanked = null;
    this.value = heard;
    this.like = heard;
    if (ui) {
      ui.like = heard;
      await this.updateComplete;
      await ui.updateComplete;
    }
    const count = ui && ui.filtered ? ui.filtered.length : 0;
    if (count) {
      this.playSound("click");
      this._voiceCard(
        heard,
        this.t.voiceShowingMatches,
        this._voicePickPhrase(vocab),
      );
    } else {
      this.playSound("error");
      this._voiceCard(heard, this.t.voiceNoMatches, vocab.help[0]);
    }
  }

  commandContextChanged(e) {
    if (e.detail.value) {
      switch (e.detail.value) {
        case "/":
        case "*": // global context / anything
        case ">":
          this.commandContext = e.detail.value;
          this.items = this.filterItems(this.allItems, this.context);
          break;
      }
    } else {
      // context removed; most likely via backspace being hit
      this.commandContext = "*";
      this.items = this.filterItems(this.allItems, this.context);
    }
    if (this.voiceSearch) {
      setTimeout(() => {
        if (e.detail.label) {
          this.__closeLock = true;
          this.listeningForInput = false;
          this.hal.speak(`${e.detail.label} mode activated`).then((_e) => {
            this.playSound().then((_e) => {
              this.reprocessVoiceCommands();
              this.__closeLock = false;
              this.listeningForInput = true;
            });
          });
        } else {
          this.reprocessVoiceCommands();
        }
      }, 0);
    }
  }

  // key handler as far as what to do if combo pressed
  // this way application can modify defaults as needed
  keyHandlerCallback() {
    return true;
  }
  // override to block calling from global key commands
  allowedCallback() {
    return true;
  }
  /**
   * Convention we use
   */
  static get tag() {
    return "super-daemon";
  }
}
globalThis.customElements.define(SuperDaemon.tag, SuperDaemon);
export { SuperDaemon };

// register globally so we can make sure there is only one
globalThis.SuperDaemonManager = globalThis.SuperDaemonManager || {};
globalThis.SuperDaemonManager.requestAvailability = () => {
  if (!globalThis.SuperDaemonManager.instance) {
    globalThis.SuperDaemonManager.instance =
      globalThis.document.createElement("super-daemon");
    if (globalThis.document && globalThis.document.body) {
      globalThis.document.body.appendChild(
        globalThis.SuperDaemonManager.instance,
      );
    }
  }
  return globalThis.SuperDaemonManager.instance;
};
export const SuperDaemonInstance =
  globalThis.SuperDaemonManager.requestAvailability();
