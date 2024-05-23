import { html, css, nothing } from "lit";
import { SimpleFilterMixin } from "@haxtheweb/simple-filter/simple-filter.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
import { UserScaffoldInstance } from "@haxtheweb/user-scaffold/user-scaffold.js";
import { autorun, toJS } from "mobx";
import "@lit-labs/virtualizer";
import "./super-daemon-row.js";
import "./super-daemon-search.js";

export class SuperDaemonUI extends SimpleFilterMixin(I18NMixin(SimpleColors)) {
  constructor() {
    super();
    this.focused = false;
    this.like = "";
    this.voiceSearch = false;
    this.iconAccent = "purple";
    this.multiMatch = true;
    this.t = this.t || {};
    this.t = {
      ...this.t,
      noResultsForThisTerm: this._defaultTextEmpty,
      voiceSearch: "Voice search",
      results: "Results",
      loadingResults: "Loading results",
    };
    this.opened = false;
    this.items = [];
    this.mini = false;
    this.wand = false;
    this.loading = true;
    this.listeningForInput = false;
    this.programSearch = "";
    this.commandContext = "*";
    this.programName = null;
    this.shadowRootOptions = {
      ...SimpleColors.shadowRootOptions,
      delegatesFocus: true,
    };
    this.activeDrag = false;
    this.activeType = null;
    this.where = "index";
    this.icon = "hardware:keyboard-return";
    // user scaffolding wired up to superDaemon
    autorun(() => {
      const usAction = toJS(UserScaffoldInstance.action);
      const usData = toJS(UserScaffoldInstance.data);
      const sdi = globalThis.SuperDaemonManager.requestAvailability();
      // try to evaluate typing in merlin
      if (
        UserScaffoldInstance.active &&
        UserScaffoldInstance.memory.isLoggedIn &&
        sdi.programName === null &&
        usAction.type === "drag"
      ) {
        this.activeDrag = true;
        this.activeType = usData.value || usData.architype;
      } else if (
        UserScaffoldInstance.active &&
        UserScaffoldInstance.memory.isLoggedIn &&
        sdi.programName === null &&
        usAction.type === "dragleave"
      ) {
        this.activeDrag = false;
        this.activeType = null;
      }
    });
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
      activeDrag: {
        type: Boolean,
      },
      activeType: {
        type: String,
      },
      mini: { type: Boolean, reflect: true },
      wand: { type: Boolean, reflect: true },
      loading: { type: Boolean, reflect: true },
      programSearch: { type: String, attribute: "program-search" },
      programName: { type: String, attribute: "program-name" },
      commandContext: { type: String, attribute: "command-context" },
      opened: { type: Boolean, reflect: true },
      focused: { type: Boolean, reflect: true },
    };
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
          font-size: 12px;
          font-style: italic;
          margin: 16px;
        }
        .results-stats {
          font-size: 12px;
          color: var(--simple-colors-default-theme-grey-10, black);
          padding: 8px;
          float: right;
        }
        :host([focused][wand]) .results {
          display: block;
        }
        .results {
          width: 100%;
          padding: 16px 0px;
        }
        :host([mini]) .results lit-virtualizer {
          max-height: unset;
          height: unset;
        }
        .results lit-virtualizer {
          max-height: 50vh;
          width: 100%;
          display: block;
          height: 50vh;
          border: 2px solid var(--simple-colors-default-theme-grey-10, black);
        }
        .results super-daemon-row {
          scroll-snap-align: start;
          scroll-snap-stop: always;
          width: -webkit-fill-available;
        }
        .no-results {
          font-size: 32px;
          font-weight: bold;
          word-break: break-all;
          overflow: hidden;
          line-height: 32px;
          margin: 32px;
          border: 1px solid transparent;
          box-shadow: none;
          outline: 0px;
        }
        .slotted {
          display: block;
          font-size: 12px;
          line-height: 18px;
        }
        .slotted ::slotted(a) {
          color: var(--simple-colors-default-theme-grey-8, blue);
          font-weight: bold;
          text-decoration: underline;
          cursor: pointer;
        }
        :host([mini]) .no-results {
          margin: 16px;
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
          margin: 4px;
        }
        :host([mini]) .results-stats {
          display: none;
        }
        :host([mini]) .results {
          padding: 0;
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
        if (this.filtered.length > 0) {
          this.loading = false;
        }
        const sdi = globalThis.SuperDaemonManager.requestAvailability();
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
          this.activeType = null;
          this.activeDrag = false;
          this.focusInput();
          // ensure whole recordset is on screen if in mini mode
          if (this.mini && !this.wand) {
            globalThis.document.body.style.overflow = "hidden";
            // reset to top of results
            this.shadowRoot.querySelector(".results").scrollTo(0, 0);
          }
        } else {
          // only a select mode makes this happen but still worth trapping for
          globalThis.document.body.style.overflow = "";
        }
      }
      if (propName == "commandContext") {
        this.dispatchEvent(
          new CustomEvent("super-daemon-command-context-changed", {
            detail: {
              value: this[propName],
            },
          }),
        );
      }
      if (propName == "like") {
        this.dispatchEvent(
          new CustomEvent("like-changed", {
            detail: {
              value: this[propName],
            },
          }),
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
              .querySelector("lit-virtualizer")
              .scrollToIndex(this.filtered.length - 1, "center");
            requestAnimationFrame(() => {
              this.shadowRoot
                .querySelector("super-daemon-row:last-of-type")
                .focus();
            });
          } else {
            this.shadowRoot
              .querySelector("super-daemon-row[active]")
              .previousElementSibling.focus();
          }
          break;
        case "ArrowDown":
        case "ArrowRight":
          // allow wrap around
          if (
            this.shadowRoot.querySelector("super-daemon-row[active]") ===
            this.shadowRoot.querySelector("super-daemon-row:last-of-type")
          ) {
            this.shadowRoot
              .querySelector("lit-virtualizer")
              .scrollToIndex(0, "center");
            requestAnimationFrame(() => {
              this.shadowRoot.querySelector("super-daemon-row").focus();
            });
          } else {
            this.shadowRoot
              .querySelector("super-daemon-row[active]")
              .nextElementSibling.focus();
          }
          break;
      }
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

  // keydown when we have focus on the input field
  _inputKeydown(e) {
    if (this.filtered.length > 0) {
      switch (e.key) {
        case "Enter":
          this.shadowRoot.querySelector("super-daemon-row").selected();
          break;
        case "ArrowUp":
          this.shadowRoot
            .querySelector("lit-virtualizer")
            .scrollToIndex(this.filtered.length - 1, "center");
          requestAnimationFrame(() => {
            this.shadowRoot
              .querySelector("super-daemon-row:last-of-type")
              .focus();
          });
          break;
        case "ArrowDown":
          this.shadowRoot
            .querySelector("lit-virtualizer")
            .scrollToIndex(0, "center");
          requestAnimationFrame(() => {
            this.shadowRoot.querySelector("super-daemon-row").focus();
          });
          break;
      }
    }
    // account for global override keys
    switch (e.key) {
      case "!":
      case "/":
      case "\\":
      case ">":
      case "<":
        // support variations on "slash" and developer commands that should interpret as same thing
        if (e.key === "\\" && this.like == "") {
          this.commandContext = "/";
          e.preventDefault();
        } else if (e.key === "!" && this.like == "") {
          this.commandContext = "/";
          e.preventDefault();
        } else if (e.key === "<" && this.like == "") {
          this.commandContext = ">";
          e.preventDefault();
        } else if (this.like == "") {
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
          this.like == "" &&
          this.commandContext
        ) {
          this.commandContext = "*";
          e.preventDefault();
        }
        break;
    }
  }

  /**
   * drag / drop event block
   */
  dropEvent(e) {
    e.preventDefault();
    this.activeDrag = false;
    this.activeType = null;
    const sdi = globalThis.SuperDaemonManager.requestAvailability();
    sdi.waveWand(
      ["", "/", e, "hax-agent", "Agent"],
      this.shadowRoot.querySelector("#merlin"),
      "coin2",
    );
  }
  dragenterEvent(e) {
    e.preventDefault();
    this.shadowRoot.querySelector("super-daemon-search").dragover = true;
  }
  dragoverEvent(e) {
    e.preventDefault();
    this.shadowRoot.querySelector("super-daemon-search").dragover = true;
  }
  dragleaveEvent(e) {
    e.preventDefault();
    this.shadowRoot.querySelector("super-daemon-search").dragover = false;
  }

  render() {
    return html`
      <super-daemon-search
        @keydown="${this._inputKeydown}"
        @focused-changed="${this.focusedChanged}"
        @value-changed="${this.inputfilterChanged}"
        @command-context-changed="${this.commandContextChanged}"
        @listening-for-input-changed="${this.listeningForInputChanged}"
        @drop="${this.dropEvent}"
        @dragenter="${this.dragenterEvent}"
        @dragleave="${this.dragleaveEvent}"
        @dragover="${this.dragoverEvent}"
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
        droppable-type="${this.activeType}"
        ?droppable="${this.activeDrag}"
      >
      </super-daemon-search>
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
                    <div class="slotted"><slot></slot></div>
                  </div> `
                : html`
                    <lit-virtualizer
                      scroller
                      .items=${this.filtered}
                      .renderItem=${(item, i) =>
                        item
                          ? html`<super-daemon-row
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
                              >${item.more
                                ? item.more
                                : nothing}</super-daemon-row
                            >`
                          : ``}
                    ></lit-virtualizer>
                  `}
            `}
        <div class="results-stats">
          ${this.filtered.length} / ${this.items.length} ${this.t.results}
        </div>
      </div>
      <div id="bottom"></div>
    `;
  }
}

customElements.define(SuperDaemonUI.tag, SuperDaemonUI);
