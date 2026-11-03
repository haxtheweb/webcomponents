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
import {
  HaxUiAdminTokens,
  HaxUiAdminScheme,
} from "@haxtheweb/d-d-d/lib/HaxUiAdminTokens.js";
import { HaxUiAdminIcons } from "@haxtheweb/d-d-d/lib/HaxUiAdminIcons.js";
import {
  MerlinDarkScheme,
  MerlinWandStyles,
  merlinWand,
  MERLIN_ICONS,
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
      ${MERLIN_ICONS.includes(this.icon) ? merlinWand() : ``}
      ${this.commandContext != "*"
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
            icon="${this.listeningForInput
              ? "hax:loading"
              : HaxUiAdminIcons.voice}"
            ?dark="${this.dark}"
            title="${this.t.voiceSearch || "Voice search"}"
            label="${this.t.voiceSearch || "Voice search"}"
          ></simple-icon-button-lite>`
        : ``}
    </div>`;
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
      inputField.placeholder = this.suggestPossibleAction() || "Search..";
    }
  }

  fieldFocusLoss(_e) {
    this.focused = false;
  }

  fieldFocus(_e) {
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
          flex: none;
          width: 28px;
          height: 28px;
          border-radius: var(--hax-ui-radius);
          color: var(--hax-ui-text-muted);
          --simple-icon-height: var(--hax-ui-icon);
          --simple-icon-width: var(--hax-ui-icon);
          --simple-icon-button-border-radius: var(--hax-ui-radius);
          transition:
            color var(--hax-ui-duration) var(--hax-ui-easing),
            background-color var(--hax-ui-duration) var(--hax-ui-easing);
        }
        .voice:hover,
        .voice:focus {
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-hover);
        }
        .voice.listening {
          color: var(--hax-ui-on-accent);
          background-color: var(--hax-ui-accent-strong);
          box-shadow: 0 0 0 4px var(--hax-ui-selected);
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
