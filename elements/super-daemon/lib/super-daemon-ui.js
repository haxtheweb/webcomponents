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
      typeToSeeResults: "Type something to see results",
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
    // search across the combined index (title, tags, description, path/tag name, etc.)
    // built by SuperDaemon.defineOption(), not just the title, so typing a partial
    // HTML tag name (e.g. "grid" for grid-plate, "img" for Basic Image) surfaces results.
    this.where = "index";
    this.icon = "hardware:keyboard-return";
    // Accessibility properties for ARIA management
    this._selectedIndex = -1;
    this._activeDescendant = "";
    // user scaffolding wired up to superDaemon
    autorun(() => {
      const _mobx_val_0 = toJS(UserScaffoldInstance.action);
      const _mobx_val_1 = toJS(UserScaffoldInstance.data);
      Promise.resolve().then(() => {
        const usAction = _mobx_val_0;
        const usData = _mobx_val_1;
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
          margin: 0 var(--ddd-spacing-3);
        }
        /* Modal (non-mini) Merlin: give the search bar breathing room from
           the dialog's top edge / cancel button so it lines up consistently
           with the padded results area below. Mini/wand modes keep their own
           margins and are unaffected. */
        :host(:not([mini])) super-daemon-search {
          margin-top: var(--ddd-spacing-4);
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
        /* Results count footer. Modal (results-stats) and mini
           (mini-results-counter) share the same Merlin-matched treatment —
           light-dark limestone/coaly surface, ddd-font-navigation, consistent
           border-top — so the two read as one component family. Modal is the
           full "X / Y Results" right-aligned bar; mini is the simplified
           "X results" centered bar. */
        .results-stats {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-3xs);
          font-weight: var(--ddd-font-weight-bold);
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-limestoneGray)
          );
          background: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-coalyGray)
          );
          border-top: var(--ddd-border-sm) solid
            light-dark(
              var(--ddd-theme-default-limestoneGray),
              rgba(255, 255, 255, 0.15)
            );
          padding: var(--ddd-spacing-2) var(--ddd-spacing-4);
          text-align: right;
          display: block;
          float: none;
        }
        :host([focused][wand]) .results {
          display: block;
        }
        .results {
          width: 100%;
          padding: var(--ddd-spacing-4) 0;
        }
        .results lit-virtualizer,
        .results-list {
          max-height: 50vh;
          width: 100%;
          display: block;
          height: 50vh;
          border: var(--ddd-border-sm) solid
            var(--simple-colors-default-theme-grey-10, black);
        }
        /* Mini/inline Merlin: do NOT use lit-virtualizer. With scroller +
           contain:size it computes viewport via clipping-ancestor
           intersection; absolute-position-behavior often yields an empty
           active range (sizer translates, zero rows). Result sets are small.
           Cap visible height to ~5 mini rows so the popup stays compact. */
        :host([mini]) .results-list {
          height: auto;
          /* ~5 mini rows: button pad + title + path (see super-daemon-row mini) */
          max-height: calc(
            5 *
              (
                (var(--ddd-spacing-3) * 2) + var(--super-daemon-row-label, 14px) +
                  var(--ddd-spacing-1) + var(--super-daemon-row-path, 10px)
              )
          );
          overflow-x: hidden;
          overflow-y: auto;
          border: none;
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
            margin: 0 var(--ddd-spacing-2);
          }
          .results-stats {
            display: none;
          }
          .results {
            padding: 0px;
          }
          super-daemon-row {
            --super-daemon-row-icon: 30px;
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
        }
        :host([mini]) .results-stats {
          display: none;
        }
        .mini-results-counter {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-limestoneGray)
          );
          background: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-coalyGray)
          );
          border-top: var(--ddd-border-sm) solid
            light-dark(
              var(--ddd-theme-default-limestoneGray),
              rgba(255, 255, 255, 0.15)
            );
          padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
          text-align: center;
          display: none;
        }
        :host([mini]) .mini-results-counter {
          display: block;
        }
        :host([mini]) .results {
          padding: 0;
        }
      `,
    ];
  }

  willUpdate(changedProperties) {
    if (super.willUpdate) {
      super.willUpdate(changedProperties);
    }
    // Immediately recompute filtered when items change so the UI never
    // renders a stale "No results" state while a program's results are
    // already loaded. SimpleFilterMixin debounces the recompute by 250ms
    // which is correct for `like` (rapid typing) but creates a window for
    // `items` where `loading` has flipped to false (parent binding) while
    // `filtered` still reflects the old empty items array — producing a
    // flash of "No results for this term" that only clears once another
    // watched property (like a keystroke in `like`) trips the debounce.
    // Clearing the pending like-debounce here is safe because the immediate
    // recompute already accounts for the current `like` value.
    if (changedProperties.has("items") && this.shadowRoot) {
      clearTimeout(this.__debounce);
      this.filtered = this._computeFiltered(
        this.items,
        this.where,
        this.like,
        this.caseSensitive,
        this.multiMatch,
      );
    }
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
      if (
        propName == "items" &&
        this.shadowRoot &&
        !this.mini
      ) {
        // lit-virtualizer can fail to stamp rows the first time it mounts
        // right after the loading/no-results branch unmounts it (it does not
        // re-measure its viewport until a layout/scroll event). That is why
        // initial program results (e.g. an empty-param NASA search) load but
        // never appear, while typing later works: typing keeps loading false
        // so the virtualizer is never unmounted and updates in place. Nudge
        // it after paint so a freshly mounted virtualizer measures and stamps.
        requestAnimationFrame(() => {
          const v = this.shadowRoot.querySelector("lit-virtualizer");
          if (v && typeof v.requestUpdate === "function") {
            v.requestUpdate();
          }
        });
      }
      if (propName == "opened" && this.shadowRoot) {
        if (this.opened) {
          this.activeType = null;
          this.activeDrag = false;
          this.focusInput();
          // ensure whole recordset is on screen if in mini mode
          if (this.mini && !this.wand) {
            // reset to top of results
            const list = this.shadowRoot.querySelector(".results-list");
            if (list) {
              list.scrollTo(0, 0);
            } else {
              this.shadowRoot.querySelector(".results").scrollTo(0, 0);
            }
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

  /**
   * Shared row template for mini (plain list) and full (lit-virtualizer).
   */
  _renderResultRow(item, i) {
    if (!item) {
      return nothing;
    }
    return html`<super-daemon-row
      role="option"
      id="option-${i}"
      tabindex="-1"
      aria-selected="${this._selectedIndex === i}"
      data-row-index="${i}"
      ?striped="${i % 2 !== 0}"
      .value="${item.value || {}}"
      icon="${item.icon}"
      image="${item.image}"
      ?dark="${this.dark}"
      text-character="${item.textCharacter}"
      title="${item.title}"
      .tags="${item.tags || []}"
      event-name="${item.eventName}"
      path="${item.path}"
      shortcut="${item.shortcutLabel || ""}"
      ?more="${item.more && (!this.mini || this.wand)}"
      ?mini="${this.mini}"
      >${item.more ? item.more : nothing}</super-daemon-row
    >`;
  }

  setupProgram(initialProgramSearch = "") {
    // Set programSearch from the passed parameter if provided
    // This avoids timing issues with property propagation from parent to child
    this.programSearch = initialProgramSearch;
    // Clear any stale `like` left over from the Merlin typing that selected
    // this program (e.g. the user typed "nasa" to find "Search NASA").
    // SimpleFilterMixin filters program results against `where="index"`, but
    // program result objects do not carry an `index` field, so a stale
    // non-empty `like` yields zero matches and the results never render.
    // Programs that supply an initial value (e.g. edit-tags) pass it through
    // and keep their `like`; only truly-empty launches reset it.
    if (!initialProgramSearch) {
      this.like = "";
    }
    // Robustly pre-fill the search input so programs that pass an initial
    // value (e.g. edit-tags passing the page's current tags) actually display
    // it. The Lit property binding alone is not reliable once the input has
    // had prior user interaction, so mirror the value into the search element
    // and its inner input field (same approach as the Konami clear sequence).
    const search = this.shadowRoot.querySelector("super-daemon-search");
    if (search) {
      search.value = initialProgramSearch;
      const inputField = search.shadowRoot.querySelector("#inputfilter");
      if (inputField) {
        inputField.value = initialProgramSearch;
      }
    }
    this.focusInput();
    // Only select-all when there is no initial value; when pre-filled (e.g.
    // current tags) place the cursor at the end so the user can edit/append
    // instead of accidentally replacing everything on the first keystroke.
    if (!initialProgramSearch) {
      this.selectInput();
    }
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
      const rows = this.shadowRoot.querySelectorAll("super-daemon-row");
      rows.forEach((row, i) => {
        row.active = i === index;
      });

      // Scroll the selected item into view (virtualizer or plain mini list)
      if (index >= 0) {
        const virtualizer = this.shadowRoot.querySelector("lit-virtualizer");
        if (virtualizer && typeof virtualizer.scrollToIndex === "function") {
          virtualizer.scrollToIndex(index, "center");
        } else if (rows[index] && typeof rows[index].scrollIntoView === "function") {
          rows[index].scrollIntoView({ block: "nearest" });
        }
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
      const virtualizer = this.shadowRoot.querySelector("lit-virtualizer");
      switch (e.key) {
        case "ArrowUp":
        case "ArrowLeft":
          // allow wrap around
          if (
            this.shadowRoot.querySelector("super-daemon-row[active]") ===
            this.shadowRoot.querySelector("super-daemon-row")
          ) {
            if (virtualizer && typeof virtualizer.scrollToIndex === "function") {
              virtualizer.scrollToIndex(this.filtered.length - 1, "center");
            }
            requestAnimationFrame(() => {
              const last = this.shadowRoot.querySelector(
                "super-daemon-row:last-of-type",
              );
              if (last) {
                last.focus();
                if (typeof last.scrollIntoView === "function") {
                  last.scrollIntoView({ block: "nearest" });
                }
              }
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
            if (virtualizer && typeof virtualizer.scrollToIndex === "function") {
              virtualizer.scrollToIndex(0, "center");
            }
            requestAnimationFrame(() => {
              const first = this.shadowRoot.querySelector("super-daemon-row");
              if (first) {
                first.focus();
                if (typeof first.scrollIntoView === "function") {
                  first.scrollIntoView({ block: "nearest" });
                }
              }
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
  _isWelcomeProgram() {
    return this.programName === "Show getting started tasks";
  }

  _isInputIntentKey(e) {
    return (
      !!e.key && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey
    );
  }

  // feed results to the program as opposed to the global context based on program running
  inputfilterChanged(e) {
    const value =
      e.target && typeof e.target.value === "string" ? e.target.value : "";
    if (this._isWelcomeProgram() && value !== "") {
      // Welcome program is onboarding-only: typing indicates intent to search globally.
      this.dispatchEvent(
        new CustomEvent("super-daemon-run-program", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: false,
        }),
      );
      this.dispatchEvent(
        new CustomEvent("super-daemon-command-context-changed", {
          detail: {
            value: "*",
          },
        }),
      );
      this.like = value;
      this.programSearch = "";
    } else if (this.programName) {
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
    // In welcome mode, first typed input should leave onboarding and return to general search.
    // Arrow-key navigation remains unchanged and still cycles welcome options.
    if (
      this._isWelcomeProgram() &&
      this.programSearch === "" &&
      this._isInputIntentKey(e)
    ) {
      this.dispatchEvent(
        new CustomEvent("super-daemon-run-program", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: false,
        }),
      );
      // Preserve context-mode key behavior while exiting welcome.
      if (["!", "/", "\\", ">", "<"].includes(e.key)) {
        let value = e.key;
        if (e.key === "\\" || e.key === "!") {
          value = "/";
        } else if (e.key === "<") {
          value = ">";
        }
        this.dispatchEvent(
          new CustomEvent("super-daemon-command-context-changed", {
            detail: {
              value: value,
            },
          }),
        );
        e.preventDefault();
        return;
      }
      this.dispatchEvent(
        new CustomEvent("super-daemon-command-context-changed", {
          detail: {
            value: "*",
          },
        }),
      );
    }
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
        ${this.filtered.length > 0
          ? this.mini
            ? html`
                <div
                  class="results-list"
                  role="listbox"
                  id="results-listbox"
                  aria-label="${this.t.results || "Results"}"
                >
                  ${this.filtered.map((item, i) =>
                    this._renderResultRow(item, i),
                  )}
                </div>
              `
            : html`
                <lit-virtualizer
                  role="listbox"
                  id="results-listbox"
                  aria-label="${this.t.results || "Results"}"
                  scroller
                  .items=${this.filtered}
                  .renderItem=${(item, i) =>
                    this._renderResultRow(item, i)}
                ></lit-virtualizer>
              `
          : this.loading
            ? html`<div class="loading">
                ${this.t.loadingResults || "Loading results"}..
              </div>`
            : html`<div class="no-results">
                ${this.programName &&
                (this.programSearch || "").trim() === ""
                  ? this.t.typeToSeeResults ||
                    "Type something to see results"
                  : this.t.noResultsForThisTerm ||
                    "No results for this term"}
                <div class="slotted"><slot></slot></div>
              </div> `}
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
