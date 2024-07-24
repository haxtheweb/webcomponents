/**
 * Copyright 2023 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icon-button.js";
import "web-dialog/index.js";
import "@haxtheweb/absolute-position-behavior/absolute-position-behavior.js";
import "./lib/super-daemon-ui.js";
import { SuperDaemonToastInstance } from "./lib/super-daemon-toast.js";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";

/**
 * `super-daemon`
 * ``
 * @demo demo/index.html
 * @element super-daemon
 */
class SuperDaemon extends SimpleColors {
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
      allItems: { type: Array },
      context: { type: Array },
      commandContext: { type: String },
      program: { type: String },
      programSearch: { type: String },
      like: { type: String },
      value: { type: String },
      mini: { type: Boolean },
      wand: { type: Boolean, reflect: true },
      activeNode: { type: Object },
      programTarget: { type: Object },
      voiceSearch: { type: Boolean, reflect: true, attribute: "voice-search" },
      voiceCommands: { type: Object },
      listeningForInput: {
        type: Boolean,
        reflect: true,
        attribute: "listening-for-input",
      },
    };
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    // add Santa program
    SuperDaemonInstance.defineOption({
      title: "Toggle Santa Mode",
      textCharacter: "🎅",
      tags: ["Developer", "big-tech", "santa", "all-seeing-eye"],
      eventName: "super-daemon-element-method",
      path: ">settings/hohoho",
      voice: "(toggle) santa (mode)",
      context: [">"],
      more: html`<span
        >He sees you when your sleeping, he knows when your awake, and with this
        command active he is always listening for input ready to respond. He's..
        Santa Merlin. Ho..Ho...Ho.</span
      >`,
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
    this.toastInstance = SuperDaemonToastInstance;
    // used when in mini mode to know what to point to and how to focus after the fact
    this.activeSelection = null;
    this.wandTarget = null; // consistent wand target to fallback on across app
    this.voiceCommands = {};
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
    this._programValues = {};
    this.programSearch = "";
    this.allItems = [];
    this.programResults = [];
    this.programName = null;
    this.commandContext = "*";
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
  }
  disconnectedCallback() {
    this.windowControllers.abort();
    this.windowControllers2.abort();
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
    this.mini = true;
    this.wand = true;
    this.activeNode = target;
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
  ) {
    this.commandContext = context;
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
      } else {
        console.error("Incorrect program called", program);
      }
    } else {
      this._programToRun = program;
    }
    this.programSearch = search;
    // used to force a search prepopulation
    if (like != null) {
      this.like = like;
    }
    // ensure we have a program as this could be used for resetting program state
    if (this._programToRun) {
      setTimeout(() => {
        this.shadowRoot.querySelector("super-daemon-ui").setupProgram();
        setTimeout(async () => {
          try {
            this.loading = true;
            this.programResults = await this._programToRun(
              this.programSearch,
              values,
            );
            this.loading = false;
          } catch (e) {
            this.loading = false;
          }
        }, 50);
      }, 0);
    } else {
      this.programResults = [];
    }
    this.programName = name;
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
          view: window,
        }),
      );
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
      // create new object from existing so we can build an index
      // remove icon, image, value, textCharacter, eventName as these are not searchable values
      // then create an idex by making everything else into a space separated string
      let indexBuilder = { ...option };
      delete indexBuilder.icon;
      delete indexBuilder.image;
      delete indexBuilder.textCharacter;
      delete indexBuilder.value;
      delete indexBuilder.eventName;
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
      this.allItems.push(option);
    }
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
    // modifier required to activate
    if (this.allowedCallback()) {
      // open and close events
      if (this.key2 == "Shift" && e.shiftKey) {
        // platform specific additional modifier
        if (this.key1 == "Ctrl" && e.ctrlKey) {
          this.opened = !this.opened;
          this.keyHandlerCallback();
        } else if (this.key1 == "Alt" && e.altKey) {
          this.opened = !this.opened;
          this.keyHandlerCallback();
        } else if (this.key1 == "Meta" && (e.key === "Meta" || e.metaKey)) {
          this.opened = !this.opened;
          this.keyHandlerCallback();
        }
      }
      if (e.key == "Escape" && this.opened) {
        this.miniCancel();
      }
    }
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
      css`
        :host {
          display: none;
        }
        :host([opened]) {
          display: block;
        }
        web-dialog {
          --dialog-border-radius: var(--simple-modal-border-radius, 2px);
          z-index: var(--simple-modal-z-index, 10000) !important;
          padding: 0;
          color: var(--simple-colors-default-theme-grey-12, black);
        }
        web-dialog::part(dialog) {
          color: var(--simple-colors-default-theme-grey-12, black);
          background-color: var(--simple-colors-default-theme-grey-1, white);
          border: 1px solid var(--simple-modal-border-color, #222);
          min-height: var(--simple-modal-min-height, unset);
          min-width: var(--simple-modal-min-width, unset);
          z-index: var(--simple-modal-z-index, 10000);
          resize: var(--simple-modal-resize, unset);
          padding: 0;
          --dialog-height: var(--simple-modal-height, auto);
          --dialog-width: var(--simple-modal-width, 75vw);
          --dialog-max-width: var(--simple-modal-max-width, 100vw);
          --dialog-max-height: var(--simple-modal-max-height, 100vh);
        }
        web-dialog.style-scope.simple-modal {
          display: none !important;
        }
        web-dialog[open].style-scope.simple-modal {
          display: flex !important;
          position: fixed !important;
          margin: auto;
        }
        web-dialog super-daemon-ui {
          --super-daemon-search-width: 100%;
        }
        :host([resize="none"]) web-dialog[open].style-scope.simple-modal,
        :host([resize="horizontal"]) web-dialog[open].style-scope.simple-modal {
          top: calc(50% - var(--simple-modal-height, auto) / 2);
        }
        :host([resize="none"]) web-dialog[open].style-scope.simple-modal,
        :host([resize="vertical"]) web-dialog[open].style-scope.simple-modal {
          left: calc(50% - var(--simple-modal-width, 75vw) / 2);
        }
        #cancel {
          position: absolute;
          right: 0px;
          top: 0px;
          z-index: 100000000;
          display: block;
          margin: 0;
          --simple-icon-width: 24px;
          --simple-icon-height: 24px;
        }
        :host([wand]) absolute-position-behavior {
          top: 24px !important;
          right: 0;
          position: fixed !important;
          display: table;
        }
        absolute-position-behavior {
          z-index: var(--simple-modal-z-index, 10000);
          min-width: 280px;
          width: 280px;
          color: var(--simple-colors-default-theme-grey-12, black);
        }
        absolute-position-behavior super-daemon-ui[mini][wand] {
          margin: -18px 0 0 0;
          padding: 0px;
        }
        absolute-position-behavior super-daemon-ui {
          width: 280px;
          margin: -64px 0 0 -8px;
          padding: 4px 0 0 0;
          color: var(--simple-colors-default-theme-grey-12, black);
          background-color: var(--simple-colors-default-theme-grey-1, white);
        }
        super-daemon-ui {
          color: var(--simple-colors-default-theme-grey-12, black);
          background-color: var(--simple-colors-default-theme-grey-1, white);
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
    // clean up event for click away in mini mode if active
    this.activeNode = null;
    this.loading = false;
    this.like = "";
    this.opened = false;
    this.mini = false;
    this.wand = false;
    this._programValues = {};
    this.programSearch = "";
    this.voiceCommands = {};
    this.defaultVoiceCommands();
    this.programResults = [];
    this.programName = null;
    this.commandContext = "*";
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
      view: window,
      bubbles: true,
      cancelable: true,
    });
    globalThis.document.dispatchEvent(event);
    this.windowControllers2.abort();
    if (globalThis.ShadyCSS && !globalThis.ShadyCSS.nativeShadow) {
      this.shadowRoot
        .querySelector("web-dialog")
        .shadowRoot.querySelector("#backdrop").style.position = "relative";
    }
  }
  filterItems(items, context) {
    let tmpItems = items.filter((item) => {
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
      var textA = a.title.toUpperCase();
      var textB = b.title.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
    // highest priority if item title is exact match
    tmpItems.forEach((item) => {
      if (item.title.toLocaleLowerCase() == this.value.toLocaleLowerCase()) {
        item.priority = -10000000;
      }
    });
    // then on priority
    return tmpItems.sort((a, b) => {
      return a.priority < b.priority ? -1 : a.priority > b.priority ? 1 : 0;
    });
  }
  playSound(sound = "coin2") {
    return new Promise((resolve) => {
      let playSound = ["coin2"].includes(sound) ? sound : "coin2";
      this.audio = new Audio(
        new URL(`./lib/assets/sounds/${playSound}.mp3`, import.meta.url).href,
      );
      this.audio.volume = 0.3;
      this.audio.onended = (event) => {
        resolve();
      };
      this.audio.play();
      // resolve after 1s if sound failed to load
      setTimeout(() => {
        resolve();
      }, 1000);
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
    if (e.isTrusted) {
      // ensure clicking on us does not disappear but since this is a "once"
      // event application we need to reissue the event if we clicked on us
      if (e.target !== this) {
        this.miniCancel();
      } else {
        globalThis.addEventListener("click", this.clickOnMiniMode.bind(this), {
          once: true,
          passive: true,
          signal: this.windowControllers2.signal,
        });
      }
    }
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
        this.activeNode.textContent = this.value;
        this.activeNode.focus();
        this.activeRange.setStart(this.activeNode, 0);
        this.activeRange.collapse(true);
        this.activeSelection.removeAllRanges();
        this.activeSelection.addRange(this.activeRange);
        this.activeSelection.selectAllChildren(this.activeNode);
        this.activeSelection.collapseToEnd();
      } catch (e) {
        console.warn(e);
      }
    }
    this.close();
  }
  open() {
    // filter to context
    this.opened = true;
    this.items = this.filterItems(this.allItems, this.context);
    const wd = this.shadowRoot.querySelector("web-dialog");
    if (wd) {
      // modal mode kills off the ability to close the dialog
      wd.$backdrop.addEventListener("click", wd.onBackdropClick);
      wd.addEventListener("keydown", wd.onKeyDown, {
        capture: true,
        passive: true,
      });
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
    });
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
  noResultsSlot(searchTerm) {
    return;
  }
  /**
   * LitElement render callback
   */
  render() {
    return html`${this.mini
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
              .items="${this.itemsForDisplay(this.items, this.programResults)}"
              command-context="${this.commandContext}"
              program-name="${this.programName}"
              program-search="${this.programSearch}"
              @value-changed="${this.inputfilterChanged}"
              @super-daemon-close="${this.close}"
              @super-daemon-command-context-changed="${this
                .commandContextChanged}"
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
            aria-label="Super Daemon"
            aria-modal="true"
            ?open="${this.opened}"
            @open="${this.open}"
            @close="${this.close}"
            @focusout="${this.focusout}"
          >
            <super-daemon-ui
              ?opened="${this.opened}"
              icon="${this.icon}"
              ?loading="${this.loading}"
              like="${this.like}"
              ?dark="${this.dark}"
              ?voice-search="${this.voiceSearch}"
              ?listening-for-input="${this.listeningForInput}"
              @like-changed="${this.likeChanged}"
              .items="${this.itemsForDisplay(this.items, this.programResults)}"
              command-context="${this.commandContext}"
              program-name="${this.programName}"
              program-search="${this.programSearch}"
              @value-changed="${this.inputfilterChanged}"
              @super-daemon-close="${this.close}"
              @super-daemon-command-context-changed="${this
                .commandContextChanged}"
              >${this.noResultsSlot(
                this.like || this.programSearch,
              )}</super-daemon-ui
            >
            <simple-icon-button
              id="cancel"
              icon="cancel"
              ?dark="${this.dark}"
              @click="${this.close}"
            ></simple-icon-button>
          </web-dialog>
        `} `;
  }
  likeChanged(e) {
    this.like = e.detail.value;
  }

  randomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
  }
  toggleSantaMode(e) {
    this.santaMode = !this.santaMode;
    setTimeout(() => {
      let say = "Santa mode activated: Watch what you say";
      if (!this.santaMode) {
        say =
          "Santa mode deactivated: Have a nice day believing you are not being watched";
      }
      this.hal.speak(say, this.santaMode).then((e) => {
        this.setListeningStatus(this.santaMode);
        this.hal.setToast("Listening..");
      });
    }, 0);
  }
  merlinSpeak(phrase) {
    this.hal.speak(phrase, false, false).then((e) => {
      this.close();
    });
  }
  promptMerlin(e) {
    if (!this.opened) {
      this.open();
    }
    this.__closeLock = true;
    this.listeningForInput = false;
    this.hal
      .speak(
        this.randomResponse([
          "I'm here",
          "Yes?",
          "What?",
          "What can I do for you?",
          "What do you need?",
          "How can I help?",
        ]),
        this.santaMode,
      )
      .then((e) => {
        this.playSound().then((e) => {
          this.listeningForInput = true;
          this.__closeLock = false;
        });
      });
  }
  stopMerlin(e) {
    if (this.santaMode) {
      this.hal.speak(
        "Please disable Santa mode to stop listening",
        this.santaMode,
      );
    }
    this.setListeningStatus(false);
  }
  closeMerlin(e) {
    if (!this.santaMode) {
      this.hal
        .speak(
          this.randomResponse([
            "thanks for stopping by",
            "See ya",
            "See you soon",
            "Till we meet again",
          ]),
          this.santaMode,
        )
        .then((e) => {
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
    this.addVoiceCommand(`cancel merlin`, this, "closeMerlin");
    this.addVoiceCommand(`disable santa (mode)`, this, "belsnickel");
    this.addVoiceCommand(`belsnickel`, this, "belsnickel");
    this.addVoiceCommand(`scroll`, this, "scroll");

    this.voiceCommands[`scroll up`] = (response) => {
      globalThis.scrollBy({
        top: -(globalThis.innerHeight * 0.5),
        left: 0,
        behavior: "smooth",
      });
    };
    this.voiceCommands[`scroll (down)`] = (response) => {
      globalThis.scrollBy({
        top: globalThis.innerHeight * 0.5,
        left: 0,
        behavior: "smooth",
      });
    };
    this.voiceCommands[`scroll (to) bottom`] = (response) => {
      globalThis.scrollTo(0, globalThis.document.body.scrollHeight);
    };
    this.voiceCommands[`scroll (to) top`] = (response) => {
      globalThis.scrollTo(0, 0);
    };
    this.voiceCommands[`back to top`] = (response) => {
      globalThis.scrollTo(0, 0);
    };

    this.voiceCommands["(run) program"] = (response) => {
      this.commandContextChanged({ detail: { value: "/", label: "program" } });
    };
    this.voiceCommands["developer (mode)"] = (response) => {
      this.commandContextChanged({
        detail: { value: ">", label: "developer" },
      });
    };
    // LAST priority bc it matches ANYTHING, no idea why I need to wait this tho..
    this.addVoiceCommand("*anything", this, "updateSearchInputViaVoice");
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
        const rect = this.activeNode.getBoundingClientRect();
        this.shadowRoot.querySelector("absolute-position-behavior").style.left =
          rect.left + rect.width + "px";
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
        this.defaultVoiceCommands();
      });
    } else if (changedProperties.has("voiceSearch") && !this.voiceSearch) {
      this.hal = null;
    }
    // align state of voice enabled with hal
    if (changedProperties.has("listeningForInput") && this.hal) {
      this.hal.enabled = this.listeningForInput;
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
      this.loading = true;
      this.programResults = await this._programToRun(
        e.detail.value,
        this._programValues,
      );
      this.loading = false;
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
  reprocessVoiceCommands() {
    if (this.hal && this.voiceSearch && this.items) {
      clearTimeout(this._blockRerunTimeout);
      this._blockRerunTimeout = setTimeout(async () => {
        this.defaultVoiceCommands();
        for await (const item of this.items) {
          if (item.title) {
            this.voiceCommands[
              item.voice
                ? item.voice.toLocaleLowerCase()
                : item.title.toLocaleLowerCase()
            ] = (response) => {
              this.shadowRoot.querySelector("super-daemon-ui").items = [item];
              this.value = item.title;
              this.shadowRoot.querySelector("super-daemon-ui").filtered = [
                item,
              ];
              setTimeout(() => {
                this.shadowRoot
                  .querySelector("super-daemon-ui")
                  .shadowRoot.querySelector("super-daemon-row")
                  .selected();
              }, 0);
              // if program, reset input and prompt for more!
              if (item.value.program) {
                this.playSound().then((e) => {
                  this.shadowRoot.querySelector("super-daemon-ui").focusInput();
                });
              } else {
                // disable bc we got a hit
                this.setListeningStatus(false);
              }
            };
          }
        }
        this.hal.commands = { ...this.voiceCommands };
      }, 10);
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
          this.hal.speak(`${e.detail.label} mode activated`).then((e) => {
            this.playSound().then((e) => {
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
customElements.define(SuperDaemon.tag, SuperDaemon);
export { SuperDaemon };

// register globally so we can make sure there is only one
globalThis.SuperDaemonManager = globalThis.SuperDaemonManager || {};
globalThis.SuperDaemonManager.requestAvailability = () => {
  if (!globalThis.SuperDaemonManager.instance) {
    globalThis.SuperDaemonManager.instance =
      globalThis.document.createElement("super-daemon");
    globalThis.document.body.appendChild(
      globalThis.SuperDaemonManager.instance,
    );
  }
  return globalThis.SuperDaemonManager.instance;
};
export const SuperDaemonInstance =
  globalThis.SuperDaemonManager.requestAvailability();
