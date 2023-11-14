import { html, css } from "lit";
import { I18NMixin } from "@lrnwebcomponents/i18n-manager/lib/I18NMixin.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/simple-fields/lib/simple-fields-field.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";

export class SuperDaemonSearch extends I18NMixin(SimpleColors) {
  static get tag() {
    return 'super-daemon-search';
  }
  constructor() {
    super();
    this.focused = false;
    this.icon = "hardware:keyboard-return";
    this.iconAccent = "purple";
    this.voiceSearch = false;
    this.programSearch = '';
    this.mini = false;
    this.wand = false;
    this.loading = false;
    this.listeningForInput = false;
    this.commandContext = "*";
    this.value = '';
    this.t = this.t || {};
    this.t = {
      ...this.t,
      whatAreYouLookingFor: "Type what you are looking to do here..",
      voiceSearch: "Voice search",
      filterCommands: "Filter commands",
      commands: "Commands",
    };
  }
  static get properties() {
    return {
      icon: { type: String },
      iconAccent: { type: String, attribute: "icon-accent" },
      voiceSearch: { type: Boolean, reflect: true, attribute: "voice-search" },
      listeningForInput: {
        type: Boolean,
        reflect: true,
        attribute: "listening-for-input",
      },
      value: { type: String },
      mini: { type: Boolean, reflect: true },
      wand: { type: Boolean, reflect: true },
      programName: { type: String, attribute: "program-name" },
      commandContext: { type: String, attribute: "command-context" },
      focused: { type: Boolean, reflect: true }
    };
  }

  voiceSearchClick() {
    // refernced this way to avoid circular dependency
    const sdi = window.SuperDaemonManager.requestAvailability();
    if (this.listeningForInput) {
      sdi.listeningForInput = false;
    } else {
      // start talking which listeners in super-daemon will activate
      // after the text is spoken to avoid polluting input
      sdi.hal.speak("How may I help you?", sdi.santaMode).then((e) => {
        sdi.playSound();
        sdi.listeningForInput = true;
      });
      this.focusInput();
    }
  }

  // keydown when we have focus on the input field
  _inputKeydown(e) {
    // account for global override keys
    switch (e.key) {
      case "!":
      case "/":
      case "\\":
      case ">":
      case "<":
      case "?":
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
            })
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

  // feed results to the program as opposed to the global context based on program running
  inputfilterChanged(e) {
    this.value=e.target.value;
  }

  render() {
    return html`
        <!--  <simple-icon
        icon="${this.icon}"
        class="icon"
        accent-color="${this.listeningForInput ? this.iconAccent : "grey"}"
      ></simple-icon> -->
      ${this.voiceSearch
        ? html`<simple-icon-button-lite
            class="voice ${this.listeningForInput ? "listening" : ""}"
            @click="${this.voiceSearchClick}"
            icon="${this.listeningForInput
              ? "hax:loading"
              : "settings-voice"}"
            ?dark="${this.dark}"
            title="${this.t.voiceSearch}"
          ></simple-icon-button-lite>`
        : ``}
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
        @value-changed="${this.inputfilterChanged}"
        @keydown="${this._inputKeydown}"
        @focus="${this.fieldFocus}"
        @blur="${this.fieldFocusLoss}"
        .value="${this.value}"
        aria-controls="filter"
        label="${this.t.filterCommands}"
        placeholder="${this.t.whatAreYouLookingFor}"
        type="text"
        auto-validate=""
        autofocus
        part="filter"
      ></simple-fields-field>`;
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('focused')) {
      this.dispatchEvent(new CustomEvent('focused-changed', {
        composed: true,
        detail: {
          value: this.focused
        }
      }));
    }
    if (changedProperties.has('listeningForInput')) {
      this.dispatchEvent(new CustomEvent('listening-for-input-changed', {
        composed: true,
        detail: {
          value: this.listeningForInput
        }
      }));
    }
    if (changedProperties.has('commandContext')) {
      this.dispatchEvent(new CustomEvent('command-context-changed', {
        composed: true,
        detail: {
          value: this.commandContext
        }
      }));
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
      ...styles,
      css`
        :host {
          display: flex;
          margin: 0;
        }
        :host input {
          display: inline-flex;
          width: 100%;
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
        }
        :host([mini]) .voice {
          --simple-icon-height: 24px;
          --simple-icon-width: 24px;
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
          --simple-icon-height: 24px;
          --simple-icon-width: 24px;
          margin-top: 0px;
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
          line-height: 16px;
          height: 16px;
          padding: 2px 4px;
          margin: 16px 0 0 -2px;
          font-size: 10px;
          width: 100%;
          max-width: 100px;
        }
        :host([mini]) .program {
          line-height: 24px;
          font-size: 12px;
          max-width: 8px;
          height: 24px;
          margin: 0px;
          padding: 0px 4px 0px 2px;
          font-weight: bold;
          font-style: italic;
        }
        .slotted {
          display: block;
          max-width: 90%;
          font-size: 20px;
        }
        .slotted ::slotted(a) {
          color: var(--simple-colors-default-theme-grey-8, blue);
          font-weight: bold;
          text-decoration: underline;
          cursor: pointer;
        }
        simple-fields-field {
          line-height: 40px;
          padding: 8px;
          color: var(--simple-colors-default-theme-grey-12, black);
          background-color: var(--simple-colors-default-theme-grey-1, white);
          line-height: normal;
          font-family: inherit;
          width: 240px;
          margin: 8px 0 0 0;
          min-width: 100px;
        }
        simple-tag:hover,
        simple-tag:focus {
          cursor: pointer;
          outline: 1px solid var(--simple-colors-default-theme-grey-10, black);
          outline-offset: 4px;
        }
        :host([mini]) simple-fields-field::part(option-input) {
          font-size: 12px;
        }
        :host([mini][wand]) simple-fields-field::part(option-input) {
          font-size: 14px;
        }
        simple-fields-field::part(option-input) {
          padding: 0px 2px;
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
            margin: 8px;
          }
          simple-fields-field::part(option-input) {
            font-size: 14px;
            line-height: 20px;
          }
          simple-fields-field {
            line-height: 20px;
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
        return this.t.slashCommandsActive;
      case ">":
        return this.t.developerConsoleActive;
      case "?":
        return this.t.helpActive;
    }
    return "";
  }

  getActiveIcon(context) {
    switch (context) {
      case "/":
        return "hax:slash";
      case ">":
        return "hax:console-line";
      case "?":
        return "icons:help";
    }
    return "";
  }
}

customElements.define(SuperDaemonSearch.tag, SuperDaemonSearch);