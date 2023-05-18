/**
 * Copyright 2023 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button.js";
import "web-dialog/index.js";
import "@lrnwebcomponents/absolute-position-behavior/absolute-position-behavior.js";
import "./lib/super-daemon-ui.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
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
      questionTags: { type: Array },
      value: { type: String },
      mini: { type: Boolean },
      activeNode: { type: Object },
      programTarget: { type: Object },
      voiceSearch: { type: Boolean, reflect: true, attribute: "voice-search" },
      voiceCommands: { type: Object },
      listeningForInput: { type: Boolean, reflect: true, attribute: "listening-for-input" },
    };
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    // used when in mini mode to know what to point to and how to focus after the fact
    this.activeSelection = null;
    this.voiceCommands = {};
    this.programTarget = null;
    this.activeRange = null;
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
    this.questionTags = [];
    this.items = [];
    this.loading = false;
    this.like = "";
    this.mini = false;
    this._programValues = {};
    this.programSearch = "";
    this.allItems = [];
    this.programResults = [];
    this.programName = null;
    this.commandContext = "*";
    const isSafari = window.safari !== undefined;
    if (isSafari) {
      this.key1 = "Ctrl";
    } else {
      this.key1 = "Alt";
    }
    this.key2 = "Shift";
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("keydown", this.keyHandler.bind(this), {
      signal: this.windowControllers.signal,
    });

    window.addEventListener(
      "super-daemon-define-option",
      this.defineOptionEvent.bind(this),
      { signal: this.windowControllers.signal }
    );

    window.addEventListener(
      "super-daemon-element-method",
      this.elementMethod.bind(this),
      { signal: this.windowControllers.signal }
    );

    window.addEventListener(
      "super-daemon-element-click",
      this.elementClick.bind(this),
      { signal: this.windowControllers.signal }
    );

    window.addEventListener(
      "super-daemon-run-program",
      this.runProgramEvent.bind(this),
      { signal: this.windowControllers.signal }
    );

    window.addEventListener(
      "super-daemon-voice-command",
      this._addVoiceCommand.bind(this),
      { signal: this.windowControllers.signal }
    );
  }
  disconnectedCallback() {
    this.windowControllers.abort();
    this.windowControllers2.abort();
    super.disconnectedCallback();
  }
  // reset to filter for a specific term with something like runProgram('*',null,null,null, "Insert Blocks");
  // Run wikipedia search with runProgram('/',{method},'Wikipedia','Drupal');
  runProgram(
    context = "/",
    values = {},
    program = null,
    name = null,
    search = "",
    like = null
  ) {
    this.commandContext = context;
    this._programToRun = program;
    this.programSearch = search;
    // used to force a search prepopulation
    if (like != null) {
      this.like = like;
    }
    // ensure we have a program as this could be used for resetting program state
    if (this._programToRun) {
      this.shadowRoot.querySelector("super-daemon-ui").setupProgram();
      setTimeout(async () => {
        try {
          this.loading = true;
          this.programResults = await this._programToRun(
            this.programSearch,
            values
          );
          this.loading = false;
        } catch (e) {
          this.loading = false;
        }
      }, 50);
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
        data.context,
        this._programValues,
        data.program,
        data.name,
        ""
      );
    } else {
      this.runProgram("/");
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
        })
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
            if (!["", "*", "/", " ", "?", ">"].includes(j)) {
              index.push(j.toLowerCase());
            }
          });
        } else if (Array.isArray(i)) {
          i.map((j) => {
            if (!["", "*", "/", " ", "?", ">"].includes(j)) {
              index.push(j.toLowerCase());
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
    console.log("GENERIC SEARCH HIT");
    const field = this.shadowRoot
    .querySelector("super-daemon-ui")
    .shadowRoot.querySelector("simple-fields-field");
    field.value = input;
    field.focus();
    field.select();
    // turn off bc we got a match
    this.listeningForInput = false;
  }

  /**
   * allow uniform method of adding voice commands
   */
  addVoiceCommand(command, context, callback) {
    if (context) {
      command = command.replace(":name:", this.voiceRespondsTo).toLowerCase();
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
          // ensure we're not in mini mode if we are
          if (this.opened) {
            this.mini = false;
          }
        } else if (this.key1 == "Alt" && e.altKey) {
          this.opened = !this.opened;
          // ensure we're not in mini mode if we are
          if (this.opened) {
            this.mini = false;
          }
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
      ...styles,
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
        absolute-position-behavior {
          z-index: var(--simple-modal-z-index, 10000);
          min-width: 280px;
          color: var(--simple-colors-default-theme-grey-12, black);
          background-color: var(--simple-colors-default-theme-grey-1, white);
        }
        absolute-position-behavior super-daemon-ui {
          margin-top: -46px;
          color: var(--simple-colors-default-theme-grey-12, black);
          background-color: var(--simple-colors-default-theme-grey-1, white);
          width: 400px;
          margin-left: 14px;
          padding-top: 8px;
        }
        super-daemon-ui {
          color: var(--simple-colors-default-theme-grey-12, black);
          background-color: var(--simple-colors-default-theme-grey-1, white);
        }
      `,
    ];
  }
  /**
   * Close the modal and do some clean up
   */
  close() {
    // clean up event for click away in mini mode if active
    this.opened = false;
    this.activeNode = null;
    this.loading = false;
    this.like = "";
    this.mini = false;
    this._programValues = {};
    this.programSearch = "";
    this.programResults = [];
    this.programName = null;
    this.commandContext = "*";
    // important we stop listening when the UI goes away
    this.listeningForInput = false;
    const event = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(event);
    this.windowControllers2.abort();
    if (window.ShadyCSS && !window.ShadyCSS.nativeShadow) {
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
        if (this.commandContext == "*") {
          results = context.filter((value) => item.context.includes(value));
        } else {
          results = [this.commandContext].filter((value) =>
            item.context.includes(value)
          );
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
      if (item.title.toLowerCase() == this.value.toLocaleLowerCase()) {
        item.priority = -10000000;
      }
    });
    // then on priority
    return tmpItems.sort((a, b) => {
      return a.priority < b.priority ? -1 : a.priority > b.priority ? 1 : 0;
    });
  }
  playSound(sound = "coin2") {
    let playSound = [
      "coin2",
    ].includes(sound)
      ? sound
      : "coin2";
    this.audio = new Audio(
      new URL(`./lib/assets/sounds/${playSound}.mp3`, import.meta.url).href
    );
    this.audio.volume = 0.8;
    this.audio.play();
  }
  // can't directly set context
  appendContext(context) {
    if (context && !this.context.includes(context)) {
      this.context.push(context);
    }
  }
  // remove from context
  removeContext(context) {
    if (context && this.context.includes(context)) {
      this.context.splice(this.context.indexOf(context), 1);
    }
  }
  // if we click away, take the active value and apply it to the line
  clickOnMiniMode(e) {
    if (e.target !== this) {
      this.miniCancel();
    }
  }
  // if we cancel out of mini mode there's a lot of UX enhancements we can do for the end user
  miniCancel() {
    if (
      this.activeNode &&
      this.activeNode.focus &&
      this.mini &&
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
    this.items = this.filterItems(this.allItems, this.context);
    this.opened = true;
    const wd = this.shadowRoot.querySelector("web-dialog");
    if (wd) {
      // modal mode kills off the ability to close the dialog
      wd.$backdrop.addEventListener("click", wd.onBackdropClick);
      wd.addEventListener("keydown", wd.onKeyDown, {
        capture: true,
        passive: true,
      });
      if (window.ShadyCSS && !window.ShadyCSS.nativeShadow) {
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
    setTimeout(async () => {
      if (this.hal && this.voiceSearch && this.items) {
        await this.items.forEach(async (item) => {
          if (item.title) {
            this.voiceCommands[item.title.toLowerCase()] = (response) => {
              console.log(item);
              this.shadowRoot.querySelector("super-daemon-ui").items = [item];
              this.value = item.title;
              this.shadowRoot.querySelector("super-daemon-ui").filtered = [item];
              setTimeout(() => {
                this.shadowRoot.querySelector("super-daemon-ui").shadowRoot.querySelector
                ('super-daemon-row').selected();
              }, 0);
              // if program, reset input and prompt for more!
              if (item.value.program) {
                this.playSound();
                let field = this.shadowRoot.querySelector("super-daemon-ui")
                .shadowRoot.querySelector("simple-fields-field");
                field.focus();
                field.select();
              }
              else {
                // disable bc we got a hit
                this.listeningForInput = false;
              }
            };
          }
        });
        if (this.voiceSearch && this.hal && this.voiceCommands) {
          // LAST priority
          setTimeout(() => {
            this.addVoiceCommand('*tag', this, "updateSearchInputViaVoice");
            this.hal.commands = {...this.voiceCommands};              
            console.log(this.hal.commands);
          }, 0);
        }
      }
    }, 0);
    setTimeout(() => {
      this.windowControllers2 = new AbortController();
      // ensure if we click away from the UI that we close and clean up
      if (this.mini) {
        window.addEventListener("click", this.clickOnMiniMode.bind(this), {
          once: true,
          passive: true,
          signal: this.windowControllers2.signal,
        });
      }
      this.shadowRoot
        .querySelector("super-daemon-ui")
        .shadowRoot.querySelector("simple-fields-field")
        .focus();
      this.shadowRoot
        .querySelector("super-daemon-ui")
        .shadowRoot.querySelector("simple-fields-field")
        .select();
    }, 0);
  }
  focusout(e) {
    if (e) {
      let parent = e.relatedTarget;
      while (parent !== document.body && parent !== null) {
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
            this.shadowRoot
              .querySelector("super-daemon-ui")
              .shadowRoot.querySelector("simple-fields-field")
              .focus();
            this.shadowRoot
              .querySelector("super-daemon-ui")
              .shadowRoot.querySelector("simple-fields-field")
              .select();
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
            position="bottom"
            allow-overlap
            sticky
            auto
            .target="${this.activeNode}"
            ?hidden="${!this.opened}"
          >
            <super-daemon-ui
              ?open="${this.opened}"
              ?mini="${this.mini}"
              icon="${this.icon}"
              ?dark="${this.dark}"
              .questionTags="${this.questionTags}"
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
            ></super-daemon-ui>
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
              ?open="${this.opened}"
              icon="${this.icon}"
              ?loading="${this.loading}"
              like="${this.like}"
              ?dark="${this.dark}"
              ?voice-search="${this.voiceSearch}"
              ?listening-for-input="${this.listeningForInput}"
              .questionTags="${this.questionTags}"
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
                this.like || this.programSearch
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
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (changedProperties.has("voiceSearch") && this.voiceSearch) {
      import("@lrnwebcomponents/hal-9000/hal-9000.js").then(() => {
        this.hal = window.Hal9000.requestAvailability();
        this.hal.debug = true;
        this.voiceCommands["(run) program"] = (response) => {
          this.commandContextChanged({ detail: { value: "/" } });
        };
        this.voiceCommands["(I need) help"] = (response) => {
          this.commandContextChanged({ detail: { value: "?" } });
        };
        this.voiceCommands["developer (mode)"] = (response) => {
          this.commandContextChanged({ detail: { value: ">" } });
        };
      });
    }
    else if (changedProperties.has("voiceSearch") && !this.voiceSearch) {
      this.hal = null;
    }
    // align state of voice enabled with hal
    if (changedProperties.has("listeningForInput") && this.hal) {
      this.hal.enabled = this.listeningForInput;
    }
  }
  async inputfilterChanged(e) {
    // update this value as far as what's being typed no matter what it is
    this.value = e.detail.value;
    if (this.programName && this._programToRun) {
      this.loading = true;
      this.programResults = await this._programToRun(
        e.detail.value,
        this._programValues
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

  commandContextChanged(e) {
    if (e.detail.value) {
      switch (e.detail.value) {
        case "/":
        case "*": // global context / anything
        case "?":
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
window.SuperDaemonManager = window.SuperDaemonManager || {};
window.SuperDaemonManager.requestAvailability = () => {
  if (!window.SuperDaemonManager.instance) {
    window.SuperDaemonManager.instance = document.createElement("super-daemon");
    document.body.appendChild(window.SuperDaemonManager.instance);
  }
  return window.SuperDaemonManager.instance;
};
export const SuperDaemonInstance =
  window.SuperDaemonManager.requestAvailability();
