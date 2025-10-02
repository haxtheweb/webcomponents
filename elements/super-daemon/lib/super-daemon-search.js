import { html, css } from "lit";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { mimeTypeToName } from "@haxtheweb/utils/utils.js";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
import "@haxtheweb/simple-fields/lib/simple-fields-field.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";

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
    this.possibleActions = ["🔮 Insert blocks", "🕵 Find media 📺"];
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
      programPlaceholder: { type: String, attribute: "program-placeholder" },
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
        sdi.hal.speak(this.t.howMayIHelp, sdi.santaMode).then((e) => {
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
    return html` ${this.commandContext != "*"
        ? html`<simple-icon-lite
            title="${this.getActiveTitle(this.commandContext)}"
            icon="${this.getActiveIcon(this.commandContext)}"
            class="user-context-icon"
          ></simple-icon-lite>`
        : ``}
      ${this.programName
        ? html`<span class="program">${this.programName}</span>`
        : ``}
      <simple-fields-field
        id="inputfilter"
        role="combobox"
        aria-expanded="false"
        aria-autocomplete="list"
        aria-haspopup="listbox"
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
      ${this.voiceSearch
        ? html`<simple-icon-button-lite
            class="voice ${this.listeningForInput ? "listening" : ""}"
            @click="${this.voiceSearchClick}"
            icon="${this.listeningForInput ? "hax:loading" : "settings-voice"}"
            ?dark="${this.dark}"
            title="${this.t.voiceSearch || "Voice search"}"
            label="${this.t.voiceSearch || "Voice search"}"
          ></simple-icon-button-lite>`
        : ``}`;
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

    // Use program-specific placeholder if available
    if (this.programPlaceholder && this.programPlaceholder.trim() !== "") {
      inputField.placeholder = this.programPlaceholder;
    }
    // Use droppable type suggestion if in droppable state
    else if (this.droppableType) {
      inputField.placeholder = this.suggestPossibleAction(this.droppableType);
    }
    // Use default suggestions
    else {
      inputField.placeholder =
        this.suggestPossibleAction() || "Type to search...";
    }
  }

  fieldFocusLoss(e) {
    this.focused = false;
  }

  fieldFocus(e) {
    this.focused = true;
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
      css`
        :host {
          display: flex;
          margin: 0;
        }
        :host([droppable]) {
          outline-offset: calc(-1 * var(--ddd-spacing-1));
          outline: var(--ddd-border-lg) solid rgba(255, 0, 255, 0.1);
        }
        :host([droppable]),
        :host([droppable]) .voice,
        :host([droppable]) simple-fields-field {
          --simple-fields-placeholder-font-weight: bold;
          --simple-fields-placeholder-opacity: 0.8;
          --simple-fields-placeholder-color: var(--ddd-theme-default-coalyGray);
          background-color: rgba(255, 0, 255, 0.05);
        }
        :host([droppable][dragover]) {
          outline: var(--ddd-border-lg) dashed rgba(255, 0, 255, 0.2);
        }
        :host([droppable][dragover]),
        :host([droppable][dragover]) .voice,
        :host([droppable][dragover]) simple-fields-field {
          background-color: rgba(255, 0, 255, 0.1);
        }
        :host([disabled]) {
          pointer-events: none;
        }
        :host .icon {
          display: inline-flex;
          --simple-icon-height: 50px;
          --simple-icon-width: 100px;
        }
        .voice {
          --simple-icon-height: 50px;
          --simple-icon-width: 100px;
          --simple-icon-button-border-radius: 0;
          color: var(--simple-colors-default-theme-grey-10, grey);
          transition: color 0.6s ease-in-out;
          margin: 0 var(--ddd-spacing-4) 0 var(--ddd-spacing-1);
        }
        :host([mini]) .voice {
          --simple-icon-height: var(--ddd-icon-xxs);
          --simple-icon-width: var(--ddd-icon-xxs);
        }
        .voice:hover,
        .voice:focus {
          color: var(--simple-colors-default-theme-purple-6, purple);
        }
        .voice.listening {
          color: var(--simple-colors-default-theme-purple-4, purple);
        }

        .user-context-icon {
          display: inline-flex;
          --simple-icon-height: 50px;
          --simple-icon-width: 30px;
        }
        :host([mini]) .user-context-icon {
          --simple-icon-height: var(--ddd-icon-xs);
          --simple-icon-width: var(--ddd-icon-xs);
          margin-top: var(--ddd-spacing-2);
          margin-left: var(--ddd-spacing-1);
        }
        .program {
          display: inline-flex;
          font-family: "Roboto Mono", monospace;
          color: var(--simple-colors-default-theme-grey-1, white);
          background-color: var(--simple-colors-default-theme-grey-12, black);
          line-break: anywhere;
          word-break: break-all;
          word-wrap: break-word;
          text-overflow: clip;
          overflow: hidden;
          line-height: var(--ddd-spacing-4);
          height: var(--ddd-spacing-4);
          padding: var(--ddd-spacing-1) var(--ddd-spacing-1);
          margin: var(--ddd-spacing-4) 0 0 calc(-1 * var(--ddd-spacing-1));
          font-size: 10px;
          width: 100%;
          max-width: 100px;
        }
        :host([mini]) .program {
          line-height: var(--ddd-icon-xxs);
          font-size: 12px;
          max-width: var(--ddd-spacing-2);
          height: var(--ddd-icon-xxs);
          margin: 0;
          padding: 0 var(--ddd-spacing-1) 0 var(--ddd-spacing-1);
          font-weight: bold;
          font-style: italic;
        }
        simple-fields-field {
          line-height: var(--ddd-spacing-10);
          padding: var(--ddd-spacing-2);
          color: var(--simple-colors-default-theme-grey-12, black);
          background-color: var(--simple-colors-default-theme-grey-1, white);
          line-height: normal;
          font-family: inherit;
          width: var(--super-daemon-search-width, 240px);
          margin: var(--ddd-spacing-1) 0 0 0;
          min-width: 100px;
          --simple-fields-background-color: transparent;
          --simple-fields-placeholder-opacity: 0.4;
          --simple-fields-placeholder-color: var(
            --simple-colors-default-theme-purple-12,
            purple
          );
        }
        simple-tag:hover,
        simple-tag:focus {
          cursor: pointer;
          outline: var(--ddd-border-xs) solid
            var(--simple-colors-default-theme-grey-10, black);
          outline-offset: var(--ddd-spacing-1);
        }
        :host([mini]) simple-fields-field::part(option-input) {
          font-size: 12px;
          --simple-fields-text-align: left;
        }
        :host([mini][wand]) simple-fields-field::part(option-input) {
          font-size: 14px;
        }
        simple-fields-field::part(option-input) {
          padding: 0 var(--ddd-spacing-1);
          font-size: 24px;
        }
        simple-fields-field::part(label) {
          opacity: 0;
          height: 0;
          width: 0;
          position: absolute;
          pointer-events: none;
        }

        @media screen and (max-width: 800px) {
          .voice {
            --simple-icon-height: 30px;
            --simple-icon-width: 30px;
          }
          .search {
            margin: var(--ddd-spacing-2);
          }
          simple-fields-field::part(option-input) {
            font-size: 14px;
            line-height: var(--ddd-spacing-5);
          }
          simple-fields-field {
            line-height: var(--ddd-spacing-5);
            width: var(--super-daemon-search-width, 100px);
          }
          .search .icon {
            display: none;
          }
        }
        :host([mini]) {
          color: var(--simple-colors-default-theme-grey-12, black);
          background-color: var(--simple-colors-default-theme-grey-1, white);
        }
        :host([mini]) .search .icon {
          display: none;
        }
      `,
    ];
  }

  getActiveTitle(context) {
    switch (context) {
      case "/":
        return this.t.slashCommandsActive || "Slash commands active";
      case ">":
        return this.t.developerConsoleActive || "Developer console active";
    }
    return "";
  }

  getActiveIcon(context) {
    switch (context) {
      case "/":
        return "hax:wand";
      case ">":
        return "hax:console-line";
    }
    return "";
  }
}

globalThis.customElements.define(SuperDaemonSearch.tag, SuperDaemonSearch);
