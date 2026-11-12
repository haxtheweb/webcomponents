/**
 * Copyright 2023 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { mimeTypeToName } from "@haxtheweb/utils/utils.js";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
import "@haxtheweb/simple-fields/lib/simple-fields-field.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import {
  HaxUiAdminTokens,
  HaxUiAdminScheme,
} from "@haxtheweb/d-d-d/lib/HaxUiAdminTokens.js";
import { HaxUiAdminIcons } from "@haxtheweb/d-d-d/lib/HaxUiAdminIcons.js";
import {
  MerlinDarkScheme,
  MerlinWandStyles,
  merlinMark,
  merlinVoiceSupported,
} from "./super-daemon-hax-ui.js";

export class SuperDaemonSearch extends I18NMixin(SimpleColors) {
  static get tag() {
    return "super-daemon-search";
  }
  constructor() {
    super();
    this.focused = false;
    this.icon = "hardware:keyboard-return";
    this.iconAccent = "purple";
    this.voiceSearch = false;
    this.programSearch = "";
    this.programPlaceholder = null;
    this.mini = false;
    this.wand = false;
    this.programRunning = false;
    this.showShortcut = false;
    this.loading = false;
    this.listeningForInput = false;
    this.commandContext = "*";
    this.value = null;
    this.disabled = false;
    this.dragover = false;
    this.droppable = false;
    this.droppableType = null;
    this.t = this.t || {};
    this.t = {
      ...this.t,
      voiceSearch: "Voice search",
      listeningState: "Listening",
      listening: "Listening..",
      filterCommands: "Filter commands",
      commands: "Commands",
      howMayIHelp: "How may I help you?",
      slashCommandsActive: "Slash commands active",
      developerConsoleActive: "Developer console active",
    };
    this.registerLocalization({
      context: this,
      namespace: "super-daemon",
      basePath: import.meta.url + "/../../",
    });
    // Initialize with fallback values to prevent undefined during initial render
    this.possibleActions = ["Search.."];
  }
  static get properties() {
    return {
      icon: { type: String },
      disabled: { type: Boolean, reflect: true },
      iconAccent: { type: String, attribute: "icon-accent" },
      voiceSearch: { type: Boolean, reflect: true, attribute: "voice-search" },
      possibleActions: { type: Array },
      listeningForInput: {
        type: Boolean,
        reflect: true,
        attribute: "listening-for-input",
      },
      droppable: { type: Boolean, reflect: true },
      dragover: { type: Boolean, reflect: true },
      droppableType: { type: String, attribute: "droppable-type" },
      value: { type: String },
      mini: { type: Boolean, reflect: true },
      wand: { type: Boolean, reflect: true },
      programName: { type: String, attribute: "program-name" },
      // a program (e.g. Create a page) owns the field, so the slash command
      // mode mark has nothing to add and stays out of the way
      programRunning: { type: Boolean, attribute: "program-running" },
      programPlaceholder: { type: String, attribute: "program-placeholder" },
      // the top bar field shows Merlin's open shortcut while it sits idle,
      // the same chip the other top bar actions and menu rows use
      showShortcut: { type: Boolean, attribute: "show-shortcut" },
      commandContext: { type: String, attribute: "command-context" },
      focused: { type: Boolean, reflect: true },
    };
  }

  voiceSearchClick() {
    if (!this.disabled) {
      // refernced this way to avoid circular dependency
      const sdi = globalThis.SuperDaemonManager.requestAvailability();
      if (this.listeningForInput) {
        sdi.listeningForInput = false;
      } else {
        // start talking which listeners in super-daemon will activate
        // after the text is spoken to avoid polluting input
        sdi.hal.speak(this.t.howMayIHelp, sdi.santaMode).then((_e) => {
          sdi.playSound();
          sdi.listeningForInput = true;
        });
        this.focusInput();
      }
    }
  }

  // keydown when we have focus on the input field
  _inputKeydown(e) {
    if (!this.disabled) {
      // account for global override keys
      switch (e.key) {
        case "!":
        case "/":
        case "\\":
        case ">":
        case "<":
          // support variations on "slash" and developer commands that should interpret as same thing
          if (e.key === "\\" && this.value == "") {
            this.commandContext = "/";
            e.preventDefault();
          } else if (e.key === "!" && this.value == "") {
            this.commandContext = "/";
            e.preventDefault();
          } else if (e.key === "<" && this.value == "") {
            this.commandContext = ">";
            e.preventDefault();
          } else if (this.value == "") {
            this.commandContext = e.key;
            e.preventDefault();
          }
          break;
        case "Backspace":
          // use this to back out of a program context
          if (this.programSearch == "" && this.programName) {
            // run this to unset the program context
            this.dispatchEvent(
              new CustomEvent("super-daemon-run-program", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: false,
              }),
            );
            e.preventDefault();
          } else if (
            !this.programName &&
            this.value == "" &&
            this.commandContext
          ) {
            this.commandContext = "*";
            e.preventDefault();
          }
          break;
      }
    }
  }

  // feed results to the program as opposed to the global context based on program running
  inputfilterChanged(e) {
    switch (e.target.value) {
      case "!":
      case "/":
      case "\\":
      case ">":
      case "<":
        // support variations on "slash" and developer commands that should interpret as same thing
        if (e.target.value === "\\" && this.value == "") {
          this.commandContext = "/";
          e.preventDefault();
        } else if (e.target.value === "!" && this.value == "") {
          this.commandContext = "/";
          e.preventDefault();
        } else if (e.target.value === "<" && this.value == "") {
          this.commandContext = ">";
          e.preventDefault();
        } else if (this.value == "") {
          this.commandContext = e.target.value;
          e.preventDefault();
        }
        e.target.value = "";
        break;
      default:
        if (!this.disabled) {
          e.stopPropagation();
          e.stopImmediatePropagation();
          this.value = e.target.value;
        }
        break;
    }
  }

  render() {
    return html`<div class="field merlin-wand-host" part="field">
      ${merlinMark(this.icon)}
      ${
        this.commandContext != "*" && !this.programRunning
          ? html`<simple-icon-lite
              title="${this.getActiveTitle(this.commandContext)}"
              icon="${this.getActiveIcon(this.commandContext)}"
              class="user-context-icon"
            ></simple-icon-lite>`
          : ``
      }
      ${
        this.programName
          ? html`<span class="program">${this.programName}</span>`
          : ``
      }
      <simple-fields-field
        id="inputfilter"
        ?disabled="${this.disabled}"
        @value-changed="${this.inputfilterChanged}"
        @keydown="${this._inputKeydown}"
        @focus="${this.fieldFocus}"
        @blur="${this.fieldFocusLoss}"
        .value="${this.value}"
        label="${this.t.filterCommands || "Filter commands"}"
        type="text"
        auto-validate=""
        autofocus
        part="filter"
      ></simple-fields-field>
      ${
        this._idleShortcutLabel()
          ? html`<kbd class="shortcut" part="shortcut" aria-hidden="true"
              >${this._idleShortcutLabel()}</kbd
            >`
          : ``
      }
      ${
        this.voiceSearch && merlinVoiceSupported()
          ? html`<button
              type="button"
              class="voice ${this.listeningForInput ? "listening" : ""}"
              @click="${this.voiceSearchClick}"
              ?disabled="${this.disabled}"
              aria-pressed="${this.listeningForInput ? "true" : "false"}"
              title="${this.t.voiceSearch}"
              aria-label="${this.t.voiceSearch}"
            >
              ${
                this.listeningForInput
                  ? html`<span class="meter" aria-hidden="true"
                        ><span></span><span></span><span></span></span
                      ><span class="voice-label"
                        >${this.t.listeningState}</span
                      >`
                  : html`<simple-icon-lite
                      icon="${HaxUiAdminIcons.voice}"
                    ></simple-icon-lite>`
              }
            </button>`
          : ``
      }
    </div>`;
  }

  /**
   * Merlin's open shortcut written the way every other HAX shortcut chip is
   * ("Alt⇧"), shown only while the field is idle: not focused, empty, no
   * program running, not listening and nothing being dragged over it
   */
  _idleShortcutLabel() {
    if (
      !this.showShortcut ||
      this.focused ||
      this.programRunning ||
      this.listeningForInput ||
      this.droppable ||
      (this.value && this.value !== "")
    ) {
      return "";
    }
    const sdi =
      globalThis.SuperDaemonManager &&
      globalThis.SuperDaemonManager.requestAvailability();
    if (!sdi || !sdi.key1) {
      return "";
    }
    return sdi.key2 === "Shift"
      ? `${sdi.key1}\u21e7`
      : `${sdi.key1}+${sdi.key2}`;
  }

  suggestPossibleAction(mimeType = false) {
    if (!mimeType) {
      return this.randomOption(this.possibleActions);
    } else {
      return `📂 Drop '${mimeTypeToName(mimeType)}' here for options`;
    }
  }

  /**
   * random option from and array of options
   * @param {array} options
   * @returns {*}
   */
  randomOption(options = []) {
    return options.length > 0
      ? options[Math.floor(Math.random() * Math.floor(options.length))]
      : undefined;
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    // Set initial placeholder - will be updated when translations load or program changes
    this._updatePlaceholder();
  }
  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has("focused")) {
      this.dispatchEvent(
        new CustomEvent("focused-changed", {
          composed: true,
          detail: {
            value: this.focused,
          },
        }),
      );
    }
    // Update possible actions when wand state changes OR when translations load
    if (changedProperties.has("wand") || changedProperties.has("t")) {
      this._updatePossibleActions();
    }
    if (changedProperties.has("droppableType") && this.shadowRoot) {
      this._updatePlaceholder();
    }
    if (changedProperties.has("droppable") && !this.droppable) {
      this.dragover = false;
    }
    // Update placeholder when translations load or program placeholder changes
    if (
      (changedProperties.has("t") ||
        changedProperties.has("programPlaceholder")) &&
      this.shadowRoot
    ) {
      this._updatePlaceholder();
    }
    if (
      changedProperties.has("value") &&
      changedProperties.get("value") !== undefined
    ) {
      this.dispatchEvent(
        new CustomEvent("value-changed", {
          composed: true,
          detail: {
            value: this.value,
          },
        }),
      );
    }
    if (changedProperties.has("listeningForInput")) {
      this._updatePlaceholder();
      this.dispatchEvent(
        new CustomEvent("listening-for-input-changed", {
          composed: true,
          detail: {
            value: this.listeningForInput,
          },
        }),
      );
    }
    if (changedProperties.has("commandContext")) {
      this.dispatchEvent(
        new CustomEvent("command-context-changed", {
          composed: true,
          detail: {
            value: this.commandContext,
          },
        }),
      );
    }
  }

  _updatePossibleActions() {
    // Only update if translations are available
    if (!this.t.insertBlocks) return;

    if (!this.wand) {
      this.possibleActions = [
        `🔮 ${this.t.insertBlocks}`,
        `🕵 ${this.t.findMedia} 📺`,
      ];
    } else {
      const sdi = globalThis.SuperDaemonManager.requestAvailability();
      // open, then present slightly different options for engagement
      if (sdi.opened) {
        this.possibleActions = [
          `🧑 ${this.t.submitIdeas}💡`,
          `📁 ${this.t.dropFilesHere} 📄`,
          `🕵 ${this.t.typeWhatYouWant}`,
        ];
      } else {
        this.possibleActions = [
          `🧙‍♂️ ${sdi.key1} + ${sdi.key2} ${this.t.opensMemoryPalace}`,
          `🔮 ${this.t.clickToDoAnything}`,
          `📁 ${this.t.dropFilesHere} 📄`,
        ];
      }
    }

    // Update placeholder after updating possible actions
    this._updatePlaceholder();
  }

  /**
   * Update the placeholder text based on current state
   */
  _updatePlaceholder() {
    if (!this.shadowRoot) return;

    const inputField = this.shadowRoot.querySelector("#inputfilter");
    if (!inputField) return;

    // while Merlin listens, say so where the words will land
    if (this.listeningForInput) {
      inputField.placeholder = this.t.listening;
    }
    // Use program-specific placeholder if available
    else if (this.programPlaceholder && this.programPlaceholder.trim() !== "") {
      inputField.placeholder = this.programPlaceholder;
    }
    // Use droppable type suggestion if in droppable state
    else if (this.droppableType) {
      inputField.placeholder = this.suggestPossibleAction(this.droppableType);
    }
    // Use default suggestions
    else {
      inputField.placeholder = this.suggestPossibleAction() || "Search..";
    }
  }

  fieldFocusLoss(_e) {
    this.focused = false;
  }

  fieldFocus(_e) {
    this.focused = true;
  }

  /**
   * The text input that really holds focus (inside simple-fields-field).
   * super-daemon-ui makes it the combobox: role, expanded state and the
   * highlighted result (aria-activedescendant) all live on this element.
   *
   * @readonly
   */
  get inputElement() {
    const field =
      this.shadowRoot && this.shadowRoot.querySelector("#inputfilter");
    return field && field.shadowRoot
      ? field.shadowRoot.querySelector("input")
      : null;
  }

  focusInput() {
    setTimeout(() => {
      this.shadowRoot.querySelector("#inputfilter").focus();
      this.shadowRoot.querySelector("#inputfilter").cursorAtEnd();
    }, 0);
  }

  selectInput() {
    setTimeout(() => {
      this.shadowRoot.querySelector("#inputfilter").select();
    }, 0);
  }

  static get styles() {
    let styles = [];
    if (super.styles) {
      styles = super.styles;
    }
    return [
      styles,
      ...HaxUiAdminTokens,
      ...HaxUiAdminScheme,
      MerlinDarkScheme,
      MerlinWandStyles,
      css`
        :host {
          display: flex;
          margin: 0;
          min-width: 0;
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--hax-ui-admin-font-size);
          color: var(--hax-ui-text);
        }
        :host([disabled]) {
          pointer-events: none;
        }
        /* the HAX UI field: 40px field height, control corners, accent
           ring on focus (same as .hax-ui-input) */
        .field {
          box-sizing: border-box;
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          width: var(--super-daemon-search-width, 30vw);
          max-width: 100%;
          min-width: 100px;
          height: var(--hax-ui-field-height);
          padding: 0 var(--hax-ui-gap-md) 0 var(--hax-ui-gap-lg);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius);
          background-color: var(--hax-ui-surface);
          transition:
            border-color var(--hax-ui-duration) var(--hax-ui-easing),
            box-shadow var(--hax-ui-duration) var(--hax-ui-easing),
            background-color var(--hax-ui-duration) var(--hax-ui-easing);
        }
        .field:hover {
          border-color: var(--hax-ui-text-muted);
        }
        .field:focus-within {
          border-color: var(--hax-ui-accent-strong);
          box-shadow: inset 0 0 0 1px var(--hax-ui-accent-strong);
        }
        :host([mini]) .field {
          height: var(--hax-ui-row-height);
          gap: 6px;
          padding: 0 6px;
          border-radius: var(--hax-ui-radius);
        }
        :host([mini][wand]) .field {
          height: 100%;
          padding: 0 var(--hax-ui-gap-md) 0 var(--hax-ui-gap-lg);
        }
        /* Merlin's mark: purple only here, where it invites you in */
        .field .merlin-wand {
          --merlin-wand-size: 20px;
          color: light-dark(
            var(--ddd-theme-default-wonderPurple, #491d70),
            var(--ddd-theme-default-athertonViolet, #ac8dce)
          );
        }
        :host([mini]:not([wand])) .field .merlin-wand {
          --merlin-wand-size: var(--hax-ui-icon);
        }
        /* the World Traveler takes the field's ink; his lit parts carry
           the color */
        .field .merlin-traveler {
          --merlin-traveler-size: 24px;
          color: var(--hax-ui-text);
        }
        :host([mini]:not([wand])) .field .merlin-traveler {
          --merlin-traveler-size: var(--hax-ui-icon);
        }
        .user-context-icon {
          flex: none;
          display: inline-grid;
          place-items: center;
          width: 22px;
          height: 22px;
          border-radius: var(--hax-ui-radius);
          color: var(--hax-ui-accent-strong);
          background-color: var(--hax-ui-accent-soft);
          --simple-icon-width: 14px;
          --simple-icon-height: 14px;
        }
        /* idle shortcut chip, same look as Merlin row and menu chips */
        .shortcut {
          flex: none;
          display: inline-grid;
          place-items: center;
          height: 20px;
          padding: 0 6px;
          font-family: inherit;
          font-size: 11px;
          font-weight: var(--ddd-font-weight-bold, 700);
          line-height: 1;
          white-space: nowrap;
          border-radius: var(--hax-ui-radius);
          border: 1px solid var(--hax-ui-line-strong);
          color: var(--hax-ui-text-muted);
          background-color: var(--hax-ui-surface);
          pointer-events: none;
        }
        /* phone: no keyboard expected, so no shortcut hints (same media as
           KEYBOARD_SHORTCUTS_HIDDEN_MEDIA in @haxtheweb/utils keyboardShortcuts) */
        @media (max-width: 599px), (pointer: coarse) and (max-height: 599px) {
          .shortcut {
            display: none;
          }
        }
        /* a running program is a chip inside the field */
        .program {
          flex: 0 1 auto;
          max-width: 45%;
          display: inline-flex;
          align-items: center;
          height: 26px;
          padding: 0 var(--hax-ui-gap-md);
          border-radius: var(--hax-ui-radius);
          font-size: 13px;
          font-weight: var(--ddd-font-weight-bold, 700);
          line-height: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: var(--hax-ui-accent-strong);
          background-color: var(--hax-ui-accent-soft);
        }
        :host([mini]) .program {
          height: 20px;
          padding: 0 6px;
          font-size: var(--hax-ui-admin-font-size-xs);
        }
        simple-fields-field {
          flex: 1 1 auto;
          min-width: 0;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          /* the field draws the frame and focus ring; the input inside
             fills it with no box or outline of its own */
          --simple-fields-input-max-width: 100%;
          --simple-fields-row-focus-outline-width: 0;
          --simple-fields-border-radius: 0;
          --simple-fields-margin-small: 0;
          margin: 0;
          padding: 0;
          border: none;
          line-height: normal;
          font-family: inherit;
          color: var(--hax-ui-text);
          background-color: transparent;
          --simple-fields-background-color: transparent;
          --simple-fields-border-bottom-size: 0;
          --simple-fields-border-bottom-focus-size: 0;
          --simple-fields-color: var(--hax-ui-text);
          --simple-fields-placeholder-opacity: 1;
          --simple-fields-placeholder-color: var(--hax-ui-text-muted);
          --simple-fields-placeholder-focus-opacity: 1;
          --simple-fields-placeholder-focus-color: var(--hax-ui-text-muted);
        }
        simple-fields-field::part(option-input) {
          padding: 0;
          font-family: inherit;
          font-size: 16px;
          --simple-fields-text-align: left;
        }
        :host([mini]:not([wand])) simple-fields-field::part(option-input) {
          font-size: var(--hax-ui-admin-font-size);
        }
        /* the input row fills the field and centers the text on it, so
           the empty description row under it can't push the text above
           the field's middle */
        simple-fields-field::part(field-main) {
          flex: 0 0 100%;
          align-items: center;
        }
        simple-fields-field::part(label) {
          opacity: 0;
          height: 0;
          width: 0;
          position: absolute;
          pointer-events: none;
        }
        simple-tag:hover,
        simple-tag:focus {
          cursor: pointer;
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }
        .voice {
          all: unset;
          box-sizing: border-box;
          cursor: pointer;
          flex: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--hax-ui-gap-md);
          min-width: 28px;
          height: 28px;
          padding: 0 var(--hax-ui-gap);
          border-radius: var(--hax-ui-radius);
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--hax-ui-admin-font-size-xs);
          font-weight: var(--ddd-font-weight-bold, 700);
          color: var(--hax-ui-text-muted);
          --simple-icon-height: var(--hax-ui-icon);
          --simple-icon-width: var(--hax-ui-icon);
          transition:
            color var(--hax-ui-duration) var(--hax-ui-easing),
            background-color var(--hax-ui-duration) var(--hax-ui-easing);
        }
        .voice:hover,
        .voice:focus-visible {
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-hover);
        }
        .voice:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }
        .voice[disabled] {
          cursor: default;
          opacity: 0.5;
        }
        /* listening: the button fills with the accent and names the state,
           and the field takes the accent edge */
        .voice.listening {
          padding: 0 var(--hax-ui-gap-md);
          color: var(--hax-ui-on-accent);
          background-color: var(--hax-ui-accent-strong);
          box-shadow: 0 0 0 4px var(--hax-ui-selected);
        }
        :host([listening-for-input]) .field {
          border-color: var(--hax-ui-accent-strong);
          box-shadow: inset 0 0 0 1px var(--hax-ui-accent-strong);
        }
        /* activity, not a level reading: the browser speech API gives no
           audio level, so the bars say the mic is open */
        .meter {
          display: inline-flex;
          align-items: center;
          gap: var(--hax-ui-gap, 4px);
          height: 14px;
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
            animation: super-daemon-search-meter 1s ease-in-out infinite;
          }
          .meter span:nth-child(2) {
            animation-delay: 0.15s;
          }
          .meter span:nth-child(3) {
            animation-delay: 0.3s;
          }
        }
        @keyframes super-daemon-search-meter {
          0%,
          100% {
            transform: scaleY(0.5);
          }
          50% {
            transform: scaleY(1.3);
          }
        }
        @media (forced-colors: active) {
          .voice.listening {
            border: 1px solid Highlight;
          }
        }

        /* dropping a file on Merlin */
        :host([droppable]) .field {
          border-style: dashed;
          border-color: var(--hax-ui-accent-strong);
          background-color: var(--hax-ui-accent-soft);
          --simple-fields-placeholder-color: var(--hax-ui-accent-strong);
          --simple-fields-placeholder-font-weight: bold;
        }
        :host([droppable][dragover]) .field {
          border-width: 2px;
          background-color: var(--hax-ui-selected);
        }
        :host(.window-file-drag) .field {
          border: 2px dashed var(--hax-ui-accent-strong);
          background-color: var(--hax-ui-selected);
        }

        @media (prefers-reduced-motion: reduce) {
          .field,
          .voice {
            transition: none;
          }
        }
        @media screen and (max-width: 800px) {
          simple-fields-field::part(option-input) {
            font-size: var(--hax-ui-admin-font-size);
          }
          .field {
            width: var(--super-daemon-search-width, 100px);
          }
        }
      `,
    ];
  }

  getActiveTitle(context) {
    switch (context) {
      case "CMS":
      case "/":
        return this.t.slashCommandsActive || "Slash commands active";
      case ">":
        return this.t.developerConsoleActive || "Developer console active";
    }
    return "";
  }

  getActiveIcon(context) {
    switch (context) {
      case "CMS":
      case "/":
        return "hax:wand";
      case ">":
        return "hax:console-line";
    }
    return "";
  }
}

globalThis.customElements.define(SuperDaemonSearch.tag, SuperDaemonSearch);
