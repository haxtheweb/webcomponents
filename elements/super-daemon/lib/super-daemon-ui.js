import { html, css, nothing } from "lit";
import { SimpleFilterMixin } from "@lrnwebcomponents/simple-filter/simple-filter.js";
import { I18NMixin } from "@lrnwebcomponents/i18n-manager/lib/I18NMixin.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "./super-daemon-row.js";
import "./super-daemon-search.js";

export class SuperDaemonUI extends SimpleFilterMixin(I18NMixin(SimpleColors)) {
  constructor() {
    super();
    this.focused = false;
    this.like = '';
    this.voiceSearch = false;
    this.iconAccent = "purple";
    this.multiMatch = true;
    this.t = this.t || {};
    this.t = {
      ...this.t,
      noResultsForThisTerm: this._defaultTextEmpty,
      whatAreYouLookingFor: "What are you trying to do?",
      voiceSearch: "Voice search",
      filterCommands: "Filter commands",
      commands: "Commands",
      loadingResults: "Loading results",
    };
    this.opened = false;
    this.items = [];
    this.mini = false;
    this.wand = false;
    this.loading = false;
    this.listeningForInput = false;
    this.programSearch = "";
    this.commandContext = "*";
    this.programName = null;
    this.shadowRootOptions = {
      ...SimpleColors.shadowRootOptions,
      delegatesFocus: true,
    };
    this.where = "index";
    this.icon = "hardware:keyboard-return";
  }
  static get tag() {
    return "super-daemon-ui";
  }

  static get properties() {
    return {
      ...super.properties,
      icon: { type: String },
      iconAccent: { type: String, attribute: "icon-accent" },
      voiceSearch: { type: Boolean, reflect: true, attribute: "voice-search" },
      listeningForInput: {
        type: Boolean,
        reflect: true,
        attribute: "listening-for-input",
      },
      mini: { type: Boolean, reflect: true },
      wand: { type: Boolean, reflect: true },
      loading: { type: Boolean, reflect: true },
      programSearch: { type: String, attribute: "program-search" },
      programName: { type: String, attribute: "program-name" },
      commandContext: { type: String, attribute: "command-context" },
      opened: { type: Boolean, reflect: true },
      focused: { type: Boolean, reflect: true }
    };
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
          display: block;
        }
        super-daemon-search {
          display: flex;
          margin: 16px;
        }
        :host([wand]) super-daemon-search {
          margin: -24px 0 0 0;
          height: 48px;
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

        .search .user-context-icon {
          display: inline-flex;
          --simple-icon-height: 50px;
          --simple-icon-width: 30px;
        }
        :host([mini]) .search .user-context-icon {
          --simple-icon-height: 24px;
          --simple-icon-width: 24px;
          margin-top: 0px;
        }
        .loading {
          font-size: 24px;
          font-family: "Roboto Mono", monospace;
          font-style: italic;
          margin: 16px;
        }
        .results-stats {
          right: 0;
          position: absolute;
          font-size: 12px;
          color: var(--simple-colors-default-theme-grey-10, black);
          padding: 8px;
          margin: 8px;
        }
        :host([focused][wand]) .results {
          display: block;
        }
        .results {
          width: 100%;
          display: block;
          border: 2px solid var(--simple-colors-default-theme-grey-10, black);
          max-height: 50vh;
          min-height: 30vh;
          overflow-y: scroll;
          scroll-snap-align: start;
          scroll-snap-type: y mandatory;
          padding: 32px 0px;
        }
        .no-results {
          font-size: 32px;
          font-weight: bold;
          max-width: 90%;
          word-break: break-all;
          overflow: hidden;
          line-height: 32px;
          height: 32px;
          margin: 16px auto;
          border: 1px solid transparent;
          box-shadow: none;
          outline: 0px;
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
        :host([mini]) .no-results {
          font-size: 14px;
          margin: 8px auto;
          line-height: 14px;
        }

        @media screen and (max-width: 800px) {
          .voice {
            --simple-icon-height: 30px;
            --simple-icon-width: 30px;
          }
          super-daemon-search {
            margin: 8px;
          }
          .results-stats {
            display: none;
          }
          .results {
            padding: 0px;
          }
          super-daemon-row {
            --super-daemon-row-icon: 30px;
            margin: 4px;
          }

          super-daemon-row::part(label-wrap) {
            min-width: 70%;
          }
          super-daemon-row::part(button) {
            padding: 4px;
          }
          super-daemon-row::part(action) {
            font-size: 24px;
            line-height: 24px;
            height: 24px;
            max-width: unset;
          }
          super-daemon-row::part(tags) {
            display: none;
          }
          super-daemon-row::part(path) {
            font-size: 12px;
          }
        }
        :host([mini]) {
          color: var(--simple-colors-default-theme-grey-12, black);
          background-color: var(--simple-colors-default-theme-grey-1, white);
        }
        :host([mini]) super-daemon-row {
          --super-daemon-row-icon: 24px;
          border-radius: 0px;
        }
        :host([mini]) .results-stats {
          display: none;
        }
        :host([mini]) .results {
          padding: 4px 0px;
          max-height: unset;
          min-height: unset;
          height: 200px;
        }
      `,
    ];
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "filtered" && typeof oldValue !== "undefined") {
        const sdi = window.SuperDaemonManager.requestAvailability();
        if (sdi.santaMode || this.listeningForInput) {
          clearTimeout(this._selectTimeout);
          this._selectTimeout = setTimeout(() => {
            if (
              this.filtered.length === 1 ||
              (this.filtered &&
                this.filtered[0] &&
                this.filtered[0].title.toLocaleLowerCase() ==
                  sdi.value.toLocaleLowerCase())
            ) {
              this.shadowRoot.querySelector("super-daemon-row").selected();
              sdi.listeningForInput = true;
            }
          }, 600);
        }
      }
      if (propName == "opened" && this.shadowRoot) {
        if (this.opened) {
          document.body.style.overflow = "hidden";
          this.focusInput();
          // ensure whole recordset is on screen if in mini mode
          if (this.mini && !this.wand) {
            // reset to top of results
            this.shadowRoot.querySelector(".results").scrollTo(0, 0);
            if (typeof this.shadowRoot.querySelector('#bottom').scrollIntoViewIfNeeded === "function") {
              this.shadowRoot.querySelector('#bottom').scrollIntoViewIfNeeded(true);
            } else {
              this.shadowRoot.querySelector('#bottom').scrollIntoView({
                behavior: "smooth",
                inline: "center",
              });
            }  
          }
        }
        else {
          document.body.style.overflow = "";
        }
      }
      if (propName == "commandContext") {
        this.dispatchEvent(
          new CustomEvent("super-daemon-command-context-changed", {
            detail: {
              value: this[propName],
            },
          })
        );
      }
      if (propName == "like") {
        this.dispatchEvent(
          new CustomEvent("like-changed", {
            detail: {
              value: this[propName],
            },
          })
        );
      }
    });
  }

  focusInput() {
    this.shadowRoot.querySelector("super-daemon-search").focusInput();
  }

  selectInput() {
    this.shadowRoot.querySelector("super-daemon-search").selectInput();
  }

  setupProgram() {
    this.programSearch = "";
    this.focusInput();
    this.selectInput();
    // reset to top of results
    this.shadowRoot.querySelector(".results").scrollTo(0, 0);
  }
  // reset search values because we selected something
  itemSelected(e) {
    this.like = "";
    this.programSearch = "";
  }

  _resultsKeydown(e) {
    if (
      this.filtered.length > 0 &&
      this.shadowRoot.querySelector("super-daemon-row[active]")
    ) {
      switch (e.key) {
        case "ArrowUp":
        case "ArrowLeft":
          // allow wrap around
          if (
            this.shadowRoot.querySelector("super-daemon-row[active]") ===
            this.shadowRoot.querySelector("super-daemon-row")
          ) {
            this.shadowRoot
              .querySelector("super-daemon-row:last-child")
              .shadowRoot.querySelector("button")
              .focus();
          } else {
            this.shadowRoot
              .querySelector("super-daemon-row[active]")
              .previousElementSibling.shadowRoot.querySelector("button")
              .focus();
          }
          break;
        case "ArrowDown":
        case "ArrowRight":
          // allow wrap around
          if (
            this.shadowRoot.querySelector("super-daemon-row[active]") ===
            this.shadowRoot.querySelector("super-daemon-row:last-child")
          ) {
            this.shadowRoot
              .querySelector("super-daemon-row")
              .shadowRoot.querySelector("button")
              .focus();
          } else {
            this.shadowRoot
              .querySelector("super-daemon-row[active]")
              .nextElementSibling.shadowRoot.querySelector("button")
              .focus();
          }
          break;
      }
    }
  }

  commonConcepts(value) {
    const sdi = window.SuperDaemonManager.requestAvailability();
    switch (value) {
      case "*":
      case ">":
      case "/":
      case "?":
        sdi.runProgram(value);
        break;
      case "media":
        sdi.runProgram("sources", "/");
        break;
      default:
        sdi.runProgram(value, "*");
        break;
    }
  }

  tagClick(e) {
    this.commonConcepts(e.target.getAttribute("data-value"));
  }

  tagKeydown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.commonConcepts(e.target.getAttribute("data-value"));
    }
  }

  focusedChanged(e) {
    this.focused = e.detail.value;
  }
  
  // feed results to the program as opposed to the global context based on program running
  inputfilterChanged(e) {
    if (this.programName) {
      // don't set like if we're in a program
      this.programSearch = e.target.value;
    } else {
      this.like = e.target.value;
    }
  }

  listeningForInputChanged(e) {
    if (e.detail.value) {
      // reset to top of results
      this.shadowRoot.querySelector(".results").scrollTo(0, 0);
    }
  }

  commandContextChanged(e) {
    this.commandContext = e.detail.value;
  }

  render() {
    return html`
      <super-daemon-search
      @focused-changed="${this.focusedChanged}"
      @value-changed="${this.inputfilterChanged}"
      @command-context-changed="${this.commandContextChanged}"
      @listening-for-input-changed="${this.listeningForInputChanged}"
      icon="${this.icon}"
      icon-accent="${this.iconAccent}"
      value="${this.like}"
      ?voice-search="${this.voiceSearch}"
      ?mini="${this.mini}"
      ?wand="${this.wand}"
      ?loading="${this.loading}"
      program-search="${this.programSearch}"
      ?listening-for-input="${this.listeningForInput}"
      command-context="${this.commandContext}"
      >

      </super-daemon-search>
      <div class="results-stats">
        ${this.filtered.length} / ${this.items.length} ${this.t.commands}
      </div>
      <div
        class="results"
        @keydown="${this._resultsKeydown}"
        @super-daemon-row-selected="${this.itemSelected}"
      >
        ${this.loading
          ? html`<div class="loading">${this.t.loadingResults}..</div>`
          : html`
              ${!this.filtered.length || this.filtered.length === 0
                ? html`<div class="no-results">
                      ${this.t.noResultsForThisTerm}
                    </div>
                    <div class="slotted"><slot></slot></div>`
                : html`
                    ${this.filtered.map(
                      (item, i) => html`
                        <super-daemon-row
                          data-row-index="${i}"
                          .value="${item.value}"
                          icon="${item.icon}"
                          image="${item.image}"
                          ?dark="${this.dark}"
                          text-character="${item.textCharacter}"
                          title="${item.title}"
                          .tags="${item.tags}"
                          event-name="${item.eventName}"
                          path="${item.path}"
                          ?more="${item.more && (!this.mini || this.wand)}"
                          ?mini="${this.mini}"
                          >${item.more ? item.more : nothing}</super-daemon-row
                        >
                      `
                    )}
                  `}
            `}
      </div>
      <div id="bottom"></div>
    `;
  }
}

customElements.define(SuperDaemonUI.tag, SuperDaemonUI);
