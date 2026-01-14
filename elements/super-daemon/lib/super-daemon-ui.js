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
      insertBlocks: "Insert blocks",
      findMedia: "Find media",
      submitIdeas: "Submit your ideas",
      dropFilesHere: "Drop files here",
      typeWhatYouWant: "Type what you want to do",
      opensMemoryPalace: "opens Merlin",
      clickToDoAnything: "Click to do anything!",
    };
    this.registerLocalization({
      context: this,
      namespace: "super-daemon",
      basePath: import.meta.url + "/../../",
    });
    this.opened = false;
    this.items = [];
    this.mini = false;
    this.wand = false;
    this.loading = true;
    this.listeningForInput = false;
    this.programSearch = "";
    this.commandContext = "*";
    this.programName = null;
    this.programPlaceholder = null;
    this.shadowRootOptions = {
      ...SimpleColors.shadowRootOptions,
      delegatesFocus: true,
    };
    this.activeDrag = false;
    this.activeType = null;
    this.where = "index";
    this.icon = "hardware:keyboard-return";
    // Accessibility properties for ARIA management
    this._selectedIndex = -1;
    this._activeDescendant = "";
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
      programPlaceholder: { type: String, attribute: "program-placeholder" },
      commandContext: { type: String, attribute: "command-context" },
      opened: { type: Boolean, reflect: true },
      focused: { type: Boolean, reflect: true },
      // Accessibility properties for ARIA management
      _selectedIndex: { type: Number, state: true },
      _activeDescendant: { type: String, state: true },
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
          margin: var(--ddd-spacing-4);
        }
        :host([wand]) super-daemon-search {
          margin: calc(-1 * var(--ddd-spacing-6)) 0 0 0;
          height: var(--ddd-spacing-12);
        }
        .voice {
          --simple-icon-height: 50px;
          --simple-icon-width: 100px;
          --simple-icon-button-border-radius: 0;
          color: var(--simple-colors-default-theme-grey-10, grey);
          transition: color 0.6s ease-in-out;
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

        .search .user-context-icon {
          display: inline-flex;
          --simple-icon-height: 50px;
          --simple-icon-width: 30px;
        }
        :host([mini]) .search .user-context-icon {
          --simple-icon-height: var(--ddd-icon-xxs);
          --simple-icon-width: var(--ddd-icon-xxs);
          margin-top: 0;
        }
        .loading {
          font-size: 12px;
          font-style: italic;
          margin: var(--ddd-spacing-4);
        }
        .results-stats {
          font-size: 12px;
          color: var(--simple-colors-default-theme-grey-10, black);
          padding: var(--ddd-spacing-2);
          float: right;
        }
        :host([focused][wand]) .results {
          display: block;
        }
        .results {
          width: 100%;
          padding: var(--ddd-spacing-4) 0;
        }
        :host([mini]) .results lit-virtualizer {
          max-height: unset;
          height: unset;
        }
        .results lit-virtualizer {
          max-height: 50vh;
          min-height: 264px !important;
          width: 100%;
          display: block;
          height: 50vh;
          border: var(--ddd-border-sm) solid
            var(--simple-colors-default-theme-grey-10, black);
        }
        .results super-daemon-row {
          scroll-snap-align: start;
          scroll-snap-stop: always;
          width: -webkit-fill-available;
        }
        .no-results {
          font-size: var(--ddd-font-size-3xs);
          font-weight: bold;
          word-break: break-all;
          overflow: hidden;
          line-height: var(--ddd-spacing-8);
          margin: var(--ddd-spacing-8);
          border: var(--ddd-border-xs) solid transparent;
          box-shadow: none;
          outline: 0;
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
          margin: var(--ddd-spacing-4);
        }

        @media screen and (max-width: 800px) {
          .voice {
            --simple-icon-height: 30px;
            --simple-icon-width: 30px;
          }
          super-daemon-search {
            margin: var(--ddd-spacing-2);
          }
          .results-stats {
            display: none;
          }
          .results {
            padding: 0px;
          }
          super-daemon-row {
            --super-daemon-row-icon: 30px;
            margin: var(--ddd-spacing-1);
          }

          super-daemon-row::part(label-wrap) {
            min-width: 70%;
          }
          super-daemon-row::part(button) {
            padding: var(--ddd-spacing-1);
          }
          super-daemon-row::part(action) {
            max-width: unset;
          }
          super-daemon-row::part(tags) {
            display: none;
          }
          super-daemon-row::part(path) {
            font-size: 10px;
          }
        }
        :host([mini]) {
          color: var(--simple-colors-default-theme-grey-12, black);
          background-color: var(--simple-colors-default-theme-grey-1, white);
        }
        :host([mini]) super-daemon-row {
          --super-daemon-row-icon: var(--ddd-icon-xxs);
          border-radius: 0;
          margin: var(--ddd-spacing-1);
        }
        :host([mini]) .results-stats {
          display: none;
        }
        .mini-results-counter {
          font-size: 11px;
          color: var(
            --ddd-theme-default-keystoneYellow,
            var(--simple-colors-default-theme-grey-8, #666)
          );
          padding: var(--ddd-spacing-1);
          text-align: center;
          border-top: 1px solid
            var(
              --ddd-theme-default-limestoneGray,
              var(--simple-colors-default-theme-grey-4, #ddd)
            );
          background: var(
            --ddd-theme-default-coalyGray,
            var(--simple-colors-default-theme-grey-2, #f8f8f8)
          );
          display: none;
        }
        :host([mini]) .mini-results-counter {
          display: block;
        }
        :host([dark][mini]) .mini-results-counter {
          color: var(
            --ddd-theme-default-coalyGray,
            var(--simple-colors-default-theme-grey-4, #ccc)
          );
          border-top-color: var(
            --ddd-theme-default-coalyGray,
            var(--simple-colors-default-theme-grey-8, #444)
          );
          background: var(
            --ddd-theme-default-slateMaxLight,
            var(--simple-colors-default-theme-grey-10, #222)
          );
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
        // Announce results count for screen readers and reset selection
        this._announceResults();
        this._updateActiveDescendant(-1); // Reset selection

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
            // reset to top of results
            this.shadowRoot.querySelector(".results").scrollTo(0, 0);
          }
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

  setupProgram(initialProgramSearch = "") {
    // Set programSearch from the passed parameter if provided
    // This avoids timing issues with property propagation from parent to child
    this.programSearch = initialProgramSearch;
    this.focusInput();
    this.selectInput();
    // reset to top of results
    this.shadowRoot.querySelector(".results").scrollTo(0, 0);
  }

  /**
   * Update aria-activedescendant and manage selection state for accessibility
   * @param {number} index - The index of the selected item (-1 for none)
   */
  _updateActiveDescendant(index) {
    this._selectedIndex = index;
    this._activeDescendant = index >= 0 ? `option-${index}` : "";

    // Trigger re-render to update aria-selected attributes in the template
    this.requestUpdate();

    // Use requestAnimationFrame to ensure DOM is updated before setting active state
    requestAnimationFrame(() => {
      // Update active property on all options after re-render
      this.shadowRoot.querySelectorAll("super-daemon-row").forEach((row, i) => {
        const isSelected = i === index;
        row.active = isSelected; // This controls the visual highlighting
      });

      // Scroll the selected item into view
      if (index >= 0 && this.shadowRoot.querySelector("lit-virtualizer")) {
        this.shadowRoot
          .querySelector("lit-virtualizer")
          .scrollToIndex(index, "center");
      }
    });
  }

  /**
   * Announce results count to screen readers
   */
  _announceResults() {
    const count = this.filtered.length;
    const message = `${count} ${count === 1 ? "result" : "results"} available`;

    // Create a live region announcement
    const announcement = globalThis.document.createElement("div");
    announcement.setAttribute("aria-live", "polite");
    announcement.setAttribute("aria-atomic", "true");
    announcement.style.position = "absolute";
    announcement.style.left = "-10000px";
    announcement.style.width = "1px";
    announcement.style.height = "1px";
    announcement.style.overflow = "hidden";
    announcement.textContent = message;

    globalThis.document.body.appendChild(announcement);
    setTimeout(() => {
      if (announcement.parentNode) {
        globalThis.document.body.removeChild(announcement);
      }
    }, 1000);
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
    const value =
      e.target && typeof e.target.value === "string" ? e.target.value : "";

    if (this.programName) {
      // don't set like if we're in a program; the active program is
      // responsible for filtering its own results based on input, and
      // SimpleFilterMixin should see all programResults unfiltered.
      this.programSearch = value;
    } else {
      this.like = value;
    }

    // Bubble a normalized value-changed event so the top-level super-daemon
    // instance always has the live input text (used for create-page titles
    // and other programs that depend on the raw input).
    this.dispatchEvent(
      new CustomEvent("value-changed", {
        bubbles: true,
        composed: true,
        detail: {
          value: value,
        },
      }),
    );
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
          e.preventDefault();
          if (this._selectedIndex >= 0) {
            // Select the currently highlighted item
            this.shadowRoot
              .querySelectorAll("super-daemon-row")
              [this._selectedIndex].selected();
          } else {
            // No selection, select first item
            this.shadowRoot.querySelector("super-daemon-row").selected();
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          const prevIndex =
            this._selectedIndex <= 0
              ? this.filtered.length - 1
              : this._selectedIndex - 1;
          this._updateActiveDescendant(prevIndex);
          break;
        case "ArrowDown":
          e.preventDefault();
          const nextIndex =
            this._selectedIndex >= this.filtered.length - 1
              ? 0
              : this._selectedIndex + 1;
          this._updateActiveDescendant(nextIndex);
          break;
        case "Escape":
          e.preventDefault();
          this._updateActiveDescendant(-1);
          this.dispatchEvent(
            new CustomEvent("super-daemon-close", {
              bubbles: true,
              composed: true,
              cancelable: true,
            }),
          );
          break;
      }
    } else if (
      e.key === "Enter" &&
      this.programName &&
      this.programSearch.trim() !== ""
    ) {
      // Handle Enter key for programs when no filtered results are available
      // This enables direct program execution on Enter press
      this.dispatchEvent(
        new CustomEvent("super-daemon-program-enter", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: {
            programName: this.programName,
            input: this.programSearch.trim(),
          },
        }),
      );
      e.preventDefault();
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
        role="combobox"
        aria-expanded="${this.filtered.length > 0 ? "true" : "false"}"
        aria-haspopup="listbox"
        aria-autocomplete="list"
        aria-controls="results-listbox"
        aria-activedescendant="${this._activeDescendant || ""}"
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
        program-placeholder="${this.programPlaceholder || ""}"
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
          ? html`<div class="loading">
              ${this.t.loadingResults || "Loading results"}..
            </div>`
          : html`
              ${!this.filtered.length || this.filtered.length === 0
                ? html`<div class="no-results">
                    ${this.t.noResultsForThisTerm || "No results for this term"}
                    <div class="slotted"><slot></slot></div>
                  </div> `
                : html`
                    <lit-virtualizer
                      role="listbox"
                      id="results-listbox"
                      aria-label="${this.t.results || "Results"}"
                      scroller
                      .items=${this.filtered}
                      .renderItem=${(item, i) =>
                        item
                          ? html`<super-daemon-row
                              role="option"
                              id="option-${i}"
                              tabindex="-1"
                              aria-selected="${this._selectedIndex === i}"
                              data-row-index="${i}"
                              .value="${item.value || {}}"
                              icon="${item.icon}"
                              image="${item.image}"
                              ?dark="${this.dark}"
                              text-character="${item.textCharacter}"
                              title="${item.title}"
                              .tags="${item.tags || []}"
                              event-name="${item.eventName}"
                              path="${item.path}"
                              ?more="${item.more && (!this.mini || this.wand)}"
                              ?mini="${this.mini}"
                              >${item.more
                                ? item.more
                                : nothing}</super-daemon-row
                            >`
                          : nothing}
                    ></lit-virtualizer>
                  `}
            `}
        <div class="results-stats">
          ${this.filtered.length} / ${this.items.length}
          ${this.t.results || "Results"}
        </div>
        ${this.mini && this.filtered.length > 1
          ? html`<div class="mini-results-counter">
              ${this.filtered.length} results
            </div>`
          : nothing}
      </div>
      <div id="bottom"></div>
    `;
  }
}

globalThis.customElements.define(SuperDaemonUI.tag, SuperDaemonUI);
