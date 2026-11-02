import { html, css, nothing } from "lit";
import { SimpleFilterMixin } from "@haxtheweb/simple-filter/simple-filter.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
import { UserScaffoldInstance } from "@haxtheweb/user-scaffold/user-scaffold.js";
import { autorun, toJS } from "mobx";
import "@lit-labs/virtualizer";
import "./super-daemon-row.js";
import "./super-daemon-search.js";
import {
  HaxUiAdminTokens,
  HaxUiAdminScheme,
  HaxUiAdminPrimitives,
  HaxUiAdminControls,
} from "@haxtheweb/d-d-d/lib/HaxUiAdminStyles.js";
import { MerlinDarkScheme } from "./super-daemon-hax-ui.js";

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
      resultsCount: "{count} results",
      loadingResults: "Loading results",
      insertBlocks: "Insert blocks",
      findMedia: "Find media",
      submitIdeas: "Submit your ideas",
      dropFilesHere: "Drop files here",
      typeWhatYouWant: "Type what you want to do",
      opensMemoryPalace: "opens Merlin",
      clickToDoAnything: "Click to do anything!",
      details: "Details",
      preview: "Preview",
      insert: "Insert",
      run: "Run",
      open: "Open",
      move: "Move",
      close: "Close",
      all: "All",
      commands: "Commands",
      developer: "Developer",
      searchIn: "Search in",
      typeSlashOrToSwitch: "Type / or > to switch",
      site: "Site",
      editor: "Editor",
      cheatCodes: "Cheat codes",
      openFullMerlin: "Open full Merlin",
      resultsOfTotal: "{count} of {total} results",
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
    // row shown in the details pane: the keyboard selection or the hovered row
    this._previewIndex = 0;
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
          usAction.type === "drag" &&
          usData.architype === "file"
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
      _previewIndex: { type: Number, state: true },
    };
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
      ...HaxUiAdminPrimitives,
      ...HaxUiAdminControls,
      css`
        /* Merlin is admin chrome: HAX UI tokens throughout, so the modal,
           the top bar popover and the mini popover read as the same
           "admin / editing" surface as site admin and outline-designer. */
        :host {
          display: flex;
          flex-direction: column;
          min-height: 0;
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--hax-ui-admin-font-size);
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-surface);
        }
        :host(:not([mini])) {
          height: 100%;
        }
        :host([mini]) {
          display: block;
        }
        super-daemon-search {
          display: flex;
          margin: var(--hax-ui-gap-lg) var(--ddd-spacing-4, 16px) 0;
        }
        :host([mini]) super-daemon-search {
          margin: var(--hax-ui-gap-md);
        }
        /* wand: the popover's own field sits over the top bar field; the
           popover offset in super-daemon.js lines the two up */
        :host([wand]) super-daemon-search {
          margin: 0;
          height: var(--hax-ui-field-height);
        }
        .loading {
          margin: var(--ddd-spacing-4, 16px);
          color: var(--hax-ui-text-muted);
          font-size: var(--hax-ui-admin-font-size-xs);
        }

        /* All / Commands / Developer: the shared segmented control */
        .contexts {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          margin: var(--hax-ui-gap-md) var(--ddd-spacing-4, 16px);
        }
        .context-key {
          font-family: var(--ddd-font-primary, monospace);
        }
        .contexts-hint {
          margin-left: auto;
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
        }

        /* results + details */
        .body {
          flex: 1 1 auto;
          min-height: 0;
          display: flex;
          border-top: 1px solid var(--hax-ui-line);
        }
        :host([mini]) .body {
          display: block;
          border-top: 1px solid var(--hax-ui-line);
        }
        :host([wand]) .body {
          border-top: none;
        }
        .results {
          flex: 1 1 auto;
          min-width: 0;
          width: 100%;
          display: flex;
          flex-direction: column;
          padding: var(--hax-ui-gap) 0 var(--hax-ui-gap-md);
        }
        :host([focused][wand]) .results {
          display: flex;
        }
        .results lit-virtualizer {
          flex: 1 1 auto;
          min-height: 0;
          width: 100%;
          display: block;
          height: 100%;
        }
        /* Mini/inline Merlin: do NOT use lit-virtualizer. With scroller +
           contain:size it computes viewport via clipping-ancestor
           intersection; absolute-position-behavior often yields an empty
           active range (sizer translates, zero rows). Result sets are small.
           Cap visible height to about 8 mini rows so the popup stays compact. */
        .results-list {
          width: 100%;
          display: block;
          height: auto;
          max-height: calc(8 * var(--hax-ui-row-height) + 48px);
          overflow-x: hidden;
          overflow-y: auto;
        }
        :host([mini]) .results {
          padding: var(--hax-ui-gap) 0;
        }
        .results super-daemon-row {
          scroll-snap-align: start;
          width: -webkit-fill-available;
        }
        .no-results {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          margin: var(--ddd-spacing-8, 32px) var(--ddd-spacing-4, 16px);
          font-weight: var(--ddd-font-weight-bold, 700);
          text-align: center;
          word-break: break-word;
        }
        :host([mini]) .no-results {
          margin: var(--ddd-spacing-4, 16px);
        }
        .slotted {
          display: block;
          font-size: var(--hax-ui-admin-font-size-xs);
          font-weight: var(--ddd-font-weight-regular, 400);
          line-height: 1.4;
        }
        .slotted ::slotted(a) {
          color: var(--hax-ui-accent-strong);
          font-weight: var(--ddd-font-weight-bold, 700);
          text-decoration: none;
          cursor: pointer;
        }
        .slotted ::slotted(a:hover) {
          text-decoration: underline;
        }

        /* details: follows the selected or hovered row */
        .details {
          width: 332px;
          flex: none;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: var(--hax-ui-gap-lg);
          padding: var(--ddd-spacing-4, 16px);
          overflow-y: auto;
          border-left: 1px solid var(--hax-ui-line);
          background-color: var(--hax-ui-sunken);
        }
        .details-head {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-lg);
        }
        .details-icon {
          width: 44px;
          height: 44px;
          flex: none;
          display: grid;
          place-items: center;
          overflow: hidden;
          border-radius: var(--hax-ui-radius-lg);
          color: var(--hax-ui-accent-strong);
          background-color: var(--hax-ui-accent-soft);
          font-size: 24px;
          --simple-icon-width: 28px;
          --simple-icon-height: 28px;
        }
        .details-icon img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .details-title {
          margin: 0;
          font-size: 17px;
          font-weight: var(--ddd-font-weight-bold, 700);
          line-height: 1.2;
        }
        .details-path {
          margin-top: 2px;
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
          overflow-wrap: anywhere;
        }
        .details-desc,
        .details-more {
          margin: 0;
          font-size: 13px;
          line-height: 1.4;
          color: var(--hax-ui-text-muted);
        }
        .details-label {
          display: block;
          margin-bottom: var(--hax-ui-gap);
          font-size: 11px;
          font-weight: var(--ddd-font-weight-bold, 700);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--hax-ui-text-muted);
        }
        /* hax-element-demo is the same preview the blocks menu shows on
           hover (the block's demoSchema at half size); restyled here so it
           sits in the pane as a framed sample of the published block */
        .details hax-element-demo {
          width: 100%;
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-surface);
          border: 1px solid var(--hax-ui-line);
          border-radius: var(--hax-ui-radius);
        }
        .details-tags {
          display: flex;
          flex-wrap: wrap;
          gap: var(--hax-ui-gap);
        }
        /* pills sit on the sunken pane, so they take the line tone */
        .details-tags .hax-ui-pill {
          background-color: var(--hax-ui-line);
        }
        .details-run {
          margin-top: auto;
          width: 100%;
        }

        /* footer: keyboard hints + results count */
        .footer {
          flex: none;
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-4, 16px);
          min-height: 36px;
          padding: 0 var(--ddd-spacing-4, 16px);
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
          border-top: 1px solid var(--hax-ui-line);
          background-color: var(--hax-ui-sunken);
        }
        .hint {
          display: inline-flex;
          align-items: center;
          gap: var(--hax-ui-gap);
        }
        .results-stats {
          margin-left: auto;
          font-variant-numeric: tabular-nums;
        }
        :host([mini]) .footer {
          min-height: 28px;
          gap: var(--hax-ui-gap-lg);
          padding: 0 var(--hax-ui-gap-md);
          font-size: 11px;
        }
        .mini-results-counter {
          font-variant-numeric: tabular-nums;
        }
        .expand {
          all: unset;
          cursor: pointer;
          margin-left: auto;
          display: inline-flex;
          align-items: center;
          gap: var(--hax-ui-gap);
          font-weight: var(--ddd-font-weight-bold, 700);
          color: var(--hax-ui-accent-strong);
          border-radius: var(--hax-ui-radius);
        }
        .expand:hover {
          text-decoration: underline;
        }
        .expand:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }

        @media screen and (max-width: 800px) {
          super-daemon-search {
            margin: var(--hax-ui-gap-md) var(--hax-ui-gap-md) 0;
          }
          .contexts {
            margin: var(--hax-ui-gap-md);
          }
          .contexts-hint,
          .details,
          .footer .hint {
            display: none;
          }
          .footer {
            justify-content: center;
          }
          .results-stats {
            margin-left: 0;
          }
          super-daemon-row {
            --super-daemon-row-icon: 18px;
          }
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
    // Derive loading + selection state in willUpdate so they are part of
    // this update cycle. Setting these reactive properties in updated()
    // scheduled a redundant second update (Lit change-in-update warning).
    if (
      changedProperties.has("filtered") &&
      typeof changedProperties.get("filtered") !== "undefined"
    ) {
      if (this.filtered.length > 0) {
        this.loading = false;
      }
      // Reset selection state so screen readers + keyboard nav start fresh
      this._selectedIndex = -1;
      this._activeDescendant = "";
      this._previewIndex = 0;
    }
    if (changedProperties.has("opened") && this.opened) {
      this.activeType = null;
      this.activeDrag = false;
    }
    // Program result items do not carry an `index` field (they have `title`),
    // so filtering them against `where="index"` made simple-filter warn
    // "unable to find a property in 'index'" for every item AND could false-
    // match the stringified "undefined". Switch `where` to `title` in program
    // mode and back to `index` for the main daemon search (whose items DO
    // carry a built `index`). Driven in willUpdate so the filter recompute
    // (keyed off `where`) batches with the programName/items change.
    if (changedProperties.has("programName")) {
      this.where = this.programName ? "title" : "index";
    }
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "filtered" && typeof oldValue !== "undefined") {
        // Announce results count for screen readers
        this._announceResults();
        // Reset the active-descendant DOM state. The selection index
        // properties are reset in willUpdate to avoid a change-in-update.
        this._applyActiveDescendantDom(-1);

        const sdi = globalThis.SuperDaemonManager.requestAvailability();
        if (sdi.santaMode || this.listeningForInput) {
          clearTimeout(this._selectTimeout);
          this._selectTimeout = setTimeout(() => {
            if (
              this.filtered.length === 1 ||
              (this.filtered &&
                this.filtered[0] &&
                this.filtered[0].title.toLocaleLowerCase() ===
                  sdi.value.toLocaleLowerCase())
            ) {
              this.shadowRoot.querySelector("super-daemon-row").selected();
              sdi.listeningForInput = true;
            }
          }, 600);
        }
      }
      if (propName == "items" && this.shadowRoot && !this.mini) {
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
    // Rows keep their inline details toggle wherever details can show:
    // the wand popover (no pane) and the modal. In the modal the row hides
    // the toggle while the side pane is showing (details-in-pane, wider
    // than 800px); on narrow screens the pane is hidden, so the toggle is
    // how details such as a media source's terms of service stay reachable.
    const inlineMore = !!item.more && (!this.mini || this.wand);
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
      group-label="${this._groupLabelAt(i) || nothing}"
      ?more="${inlineMore}"
      ?details-in-pane="${!this.mini}"
      ?mini="${this.mini}"
      ?external-link="${item.externalLink}"
      >${inlineMore ? item.more : nothing}</super-daemon-row
    >`;
  }

  /**
   * Keep each group's results together (Insert blocks, Site, ...), groups
   * ordered by their best-ranked result and results keeping their order
   * inside a group, so a heading never repeats. Programs and short lists
   * are left as they are.
   */
  _computeFiltered(items, where, like, caseSensitive, multiMatch) {
    const list = super._computeFiltered(
      items,
      where,
      like,
      caseSensitive,
      multiMatch,
    );
    return this._groupTogether(list);
  }

  _groupTogether(list) {
    if (this.programName || !Array.isArray(list) || list.length < 3) {
      return list;
    }
    const order = [];
    const buckets = {};
    list.forEach((item) => {
      const group = this._groupFor(item);
      if (!buckets[group]) {
        buckets[group] = [];
        order.push(group);
      }
      buckets[group].push(item);
    });
    if (order.length < 2) {
      return list;
    }
    return order.reduce((all, group) => all.concat(buckets[group]), []);
  }

  /**
   * Group label for the row at index i, shown only where the group changes
   * so a run of results reads as one section (Insert blocks, Site, ...).
   * Rows are not reordered, so keyboard order matches what is drawn.
   * Programs list their own results, so they are not grouped.
   * @param {number} i
   * @returns {string}
   */
  _groupLabelAt(i) {
    if (this.programName || !this.filtered) {
      return "";
    }
    const label = this._groupFor(this.filtered[i]);
    if (!label) {
      return "";
    }
    if (i > 0 && this._groupFor(this.filtered[i - 1]) === label) {
      return "";
    }
    return label;
  }

  _groupFor(item) {
    if (!item || typeof item.path !== "string" || item.path === "") {
      return "";
    }
    if (item.path.indexOf(">") === 0) {
      return this.t.developer;
    }
    const parts = item.path.split("/").filter((part) => part !== "");
    if (parts.length === 0) {
      return "";
    }
    if (parts[0] === "HAX" && parts[1] === "insert") {
      return this.t.insertBlocks;
    }
    const known = {
      CMS: this.t.site,
      site: this.t.site,
      HAX: this.t.editor,
      cheat: this.t.cheatCodes,
      sources: this.t.findMedia,
    };
    if (known[parts[0]]) {
      return known[parts[0]];
    }
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  }

  /**
   * Hovering a row, or moving focus to it (arrow keys between rows), shows
   * it in the details pane.
   */
  _resultsHover(e) {
    const path = e.composedPath ? e.composedPath() : [];
    const row = path.find(
      (node) => node && node.tagName === "SUPER-DAEMON-ROW",
    );
    if (row) {
      const index = parseInt(row.getAttribute("data-row-index"), 10);
      if (!isNaN(index) && index !== this._previewIndex) {
        this._previewIndex = index;
      }
    }
  }

  /**
   * The row element for a result index, if it is rendered right now.
   * (Look up by data-row-index; the virtualizer only stamps visible rows.)
   * @param {number} index
   */
  _rowAt(index) {
    return this.shadowRoot
      ? this.shadowRoot.querySelector(
          `super-daemon-row[data-row-index="${index}"]`,
        )
      : null;
  }

  _runPreviewed() {
    this._selectAt(this._previewIndex);
  }

  /**
   * Run the result at an index. A rendered row runs itself, as it always
   * has; the virtualizer only stamps rows that are on screen, so a result
   * scrolled out of view runs from its data, sending the same events a
   * row's selected() sends.
   * @param {number} index
   */
  _selectAt(index) {
    const row = this._rowAt(index);
    if (row) {
      row.selected();
      return;
    }
    const item = this.filtered ? this.filtered[index] : null;
    if (!item) {
      return;
    }
    this.itemSelected();
    this.dispatchEvent(
      new CustomEvent(item.eventName, {
        composed: true,
        bubbles: true,
        cancelable: true,
        detail: item.value,
      }),
    );
    if (item.eventName !== "super-daemon-run-program") {
      this.dispatchEvent(
        new CustomEvent("super-daemon-close", {
          composed: true,
          bubbles: true,
          cancelable: true,
          detail: item,
        }),
      );
    }
  }

  _detailsVerb(item) {
    if (item.eventName === "hax-super-daemon-insert-tag") {
      return this.t.insert;
    }
    if (item.externalLink) {
      return this.t.open;
    }
    return this.t.run;
  }

  _setContext(context) {
    this.commandContext = context;
    this.focusInput();
  }

  _expand() {
    this.dispatchEvent(
      new CustomEvent("super-daemon-expand", {
        bubbles: true,
        composed: true,
        cancelable: true,
      }),
    );
  }

  _renderContexts() {
    if (this.mini || this.programName) {
      return nothing;
    }
    const contexts = [
      ["*", this.t.all],
      ["/", this.t.commands],
      [">", this.t.developer],
    ];
    return html`<div class="contexts">
      <div class="hax-ui-seg" role="group" aria-label="${this.t.searchIn}">
        ${contexts.map(
          ([context, label]) =>
            html`<button
              type="button"
              aria-pressed="${this.commandContext === context
                ? "true"
                : "false"}"
              @click="${() => this._setContext(context)}"
            >
              ${context !== "*"
                ? html`<span class="context-key" aria-hidden="true"
                    >${context}</span
                  >`
                : nothing}${label}
            </button>`,
        )}
      </div>
      <span class="contexts-hint">${this.t.typeSlashOrToSwitch}</span>
    </div>`;
  }

  _renderDetails() {
    if (this.mini || !this.filtered || this.filtered.length === 0) {
      return nothing;
    }
    const item = this.filtered[this._previewIndex] || this.filtered[0];
    if (!item) {
      return nothing;
    }
    const row = globalThis.customElements
      ? globalThis.customElements.get("super-daemon-row")
      : null;
    const path =
      row && row.prototype.pathLabel
        ? row.prototype.pathLabel(item.path)
        : item.path || "";
    // the same preview the blocks menu shows on hover, when HAX has
    // loaded it; super-daemon does not depend on hax-body, so it only
    // renders a preview the page already knows how to draw
    const previewTag =
      item.value &&
      item.value.demoSchema &&
      typeof item.value.value === "string" &&
      globalThis.customElements &&
      globalThis.customElements.get("hax-element-demo")
        ? item.value.value
        : null;
    const seen = {};
    const tags = (item.tags || []).filter((tag) => {
      if (typeof tag !== "string" || tag === "") {
        return false;
      }
      const key = tag.toLowerCase();
      if (seen[key]) {
        return false;
      }
      seen[key] = true;
      return true;
    });
    return html`<aside
      class="details"
      aria-label="${this.t.details}"
      aria-live="polite"
    >
      <div class="details-head">
        <span class="details-icon" aria-hidden="true">
          ${item.icon
            ? html`<simple-icon-lite icon="${item.icon}"></simple-icon-lite>`
            : item.image
              ? html`<img src="${item.image}" alt="" />`
              : item.textCharacter
                ? html`${item.textCharacter}`
                : nothing}
        </span>
        <div>
          <h3 class="details-title">${item.title}</h3>
          ${path ? html`<div class="details-path">${path}</div>` : nothing}
        </div>
      </div>
      ${item.description
        ? html`<p class="details-desc">${item.description}</p>`
        : nothing}
      ${item.more
        ? html`<div class="details-more">${item.more}</div>`
        : nothing}
      ${previewTag
        ? html`<div class="details-preview">
            <span class="details-label">${this.t.preview}</span>
            <hax-element-demo render-tag="${previewTag}"></hax-element-demo>
          </div>`
        : nothing}
      ${tags.length > 0
        ? html`<div class="details-tags">
            ${tags
              .slice(0, 5)
              .map((tag) => html`<span class="hax-ui-pill">${tag}</span>`)}
          </div>`
        : nothing}
      <button
        type="button"
        class="hax-ui-btn primary details-run"
        @click="${this._runPreviewed}"
      >
        ${this._detailsVerb(item)}
      </button>
    </aside>`;
  }

  _renderFooter() {
    if (this.mini) {
      if (this.filtered.length <= 1 && !this.wand) {
        return nothing;
      }
      return html`<div class="footer">
        ${this.filtered.length > 1
          ? html`<span class="mini-results-counter"
              >${this.t.resultsCount.replace(
                "{count}",
                () => this.filtered.length,
              )}</span
            >`
          : nothing}
        ${this.wand
          ? html`<button type="button" class="expand" @click="${this._expand}">
              ${this.t.openFullMerlin}
            </button>`
          : nothing}
      </div>`;
    }
    return html`<div class="footer">
      <span class="hint"><kbd class="hax-ui-kbd">↑↓</kbd> ${this.t.move}</span>
      <span class="hint"><kbd class="hax-ui-kbd">⏎</kbd> ${this.t.run}</span>
      <span class="hint"
        ><kbd class="hax-ui-kbd">Esc</kbd> ${this.t.close}</span
      >
      <span class="results-stats"
        >${this.t.resultsOfTotal
          .replace("{count}", () => this.filtered.length)
          .replace("{total}", () => this.items.length)}</span
      >
    </div>`;
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
    this._previewIndex = index >= 0 ? index : 0;

    // Trigger re-render to update aria-selected attributes in the template
    this.requestUpdate();

    this._applyActiveDescendantDom(index);
  }

  /**
   * Apply active-descendant DOM state (row.active flags + scrolling) after
   * render. Split out from _updateActiveDescendant so updated() can reset
   * the DOM without setting reactive properties inside the update cycle.
   */
  _applyActiveDescendantDom(index) {
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
        } else if (
          rows[index] &&
          typeof rows[index].scrollIntoView === "function"
        ) {
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
  itemSelected(_e) {
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
            if (
              virtualizer &&
              typeof virtualizer.scrollToIndex === "function"
            ) {
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
            if (
              virtualizer &&
              typeof virtualizer.scrollToIndex === "function"
            ) {
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
          // Stop the keydown from bubbling to window-level listeners (e.g.
          // hax-body's _onKeyDown) which would split the active paragraph.
          // selected() runs synchronously and calls close() before this
          // event would reach window, so a guard on `opened` there can't help.
          e.stopPropagation();
          // the highlighted result, else the first; by result index, so it
          // holds when the virtualizer has scrolled rows out of the DOM
          this._selectAt(this._selectedIndex >= 0 ? this._selectedIndex : 0);
          break;
        case "ArrowUp": {
          e.preventDefault();
          e.stopPropagation();
          const prevIndex =
            this._selectedIndex <= 0
              ? this.filtered.length - 1
              : this._selectedIndex - 1;
          this._updateActiveDescendant(prevIndex);
          break;
        }
        case "ArrowDown": {
          e.preventDefault();
          e.stopPropagation();
          const nextIndex =
            this._selectedIndex >= this.filtered.length - 1
              ? 0
              : this._selectedIndex + 1;
          this._updateActiveDescendant(nextIndex);
          break;
        }
        case "Escape":
          e.preventDefault();
          e.stopPropagation();
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
      e.stopPropagation();
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
      ${this._renderContexts()}
      <div class="body">
        <div
          class="results"
          @keydown="${this._resultsKeydown}"
          @mouseover="${this._resultsHover}"
          @focusin="${this._resultsHover}"
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
                    .renderItem=${(item, i) => this._renderResultRow(item, i)}
                  ></lit-virtualizer>
                `
            : this.loading
              ? html`<div class="loading">
                  ${this.t.loadingResults || "Loading results"}..
                </div>`
              : html`<div class="no-results">
                  ${this.programName && (this.programSearch || "").trim() === ""
                    ? this.t.typeToSeeResults || "Type something to see results"
                    : this.t.noResultsForThisTerm || "No results for this term"}
                  <div class="slotted"><slot></slot></div>
                </div> `}
        </div>
        ${this._renderDetails()}
      </div>
      ${this._renderFooter()}
      <div id="bottom"></div>
    `;
  }
}

globalThis.customElements.define(SuperDaemonUI.tag, SuperDaemonUI);
