/* eslint-disable no-return-assign */
import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import { store } from "./AppHaxStore.js";
import "./app-hax-use-case.js";
import "./app-hax-search-results.js";
import "./app-hax-filter-tag.js";
import "./app-hax-scroll-button.js";
import "./app-hax-site-creation-modal.js";

export class AppHaxUseCaseFilter extends LitElement {
  static get tag() {
    return "app-hax-use-case-filter";
  }

  constructor() {
    super();
    this.windowControllers = new AbortController();
    this.searchTerm = "";
    this.disabled = false;
    this.showSearch = false;
    this.items = [];
    this.filteredItems = [];
    this.filteredSites = [];
    this.activeFilters = [];
    this.filters = [];
    this.searchQuery = "";
    this.demoLink = "";
    this.errorMessage = "";
    this.loading = false;
    this.selectedCardIndex = null;
    this.returningSites = [];
    this.allFilters = new Set();
    this.dark = false;
    this.isLoggedIn = false;

    // Listen to store changes for dark mode and manifest updates
    if (typeof store !== "undefined") {
      import("mobx").then(({ autorun, toJS }) => {
        autorun(() => {
          this.dark = toJS(store.darkMode);
        });
        // Watch for appReady AND login state to trigger skeleton loading
        let hasLoaded = false;
        autorun(() => {
          const appReady = toJS(store.appReady);
          const loggedIn = toJS(store.isLoggedIn);
          
          this.isLoggedIn = loggedIn;
          
          // Trigger skeleton/theme loading when both app is ready and user is logged in
          // Only load once per session
          if (appReady && loggedIn && !hasLoaded) {
            hasLoaded = true;
            this.updateSkeletonResults();
            this.updateSiteResults();
          }
        });
        // Watch for manifest changes and update site results
        autorun(() => {
          const manifest = toJS(store.manifest);
          if (manifest && manifest.items && manifest.items.length > 0) {
            this.updateSiteResults();
          }
        });
      });
    }
  }

  static get properties() {
    return {
      searchTerm: { type: String },
      showSearch: { type: Boolean, reflect: true, attribute: "show-search" },
      showFilter: { type: Boolean, reflect: true, attribute: "show-filter" },
      disabled: { type: Boolean, reflect: true },
      items: { type: Array },
      filteredItems: { type: Array },
      filteredSites: { type: Array },
      activeFilters: { type: Array },
      filters: { type: Array },
      searchQuery: { type: String },
      demoLink: { type: String },
      errorMessage: { type: String },
      loading: { type: Boolean },
      selectedCardIndex: { type: Number },
      returningSites: { type: Array },
      allFilters: { attribute: false },
      dark: { type: Boolean, reflect: true },
      isLoggedIn: { type: Boolean },
    };
  }

  static get styles() {
    return [
      css`
        :host {
          overflow: hidden;
          display: block;
          max-width: 100%;
          font-family: var(--ddd-font-primary, sans-serif);
        }
        .contentSection {
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          gap: var(--ddd-spacing-12, 48px);
          width: 100%;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        .leftSection,
        .rightSection {
          display: flex;
          flex-direction: column;
          flex: 1 1 0;
        }
        .leftSection {
          width: 240px;
          min-width: 200px;
          max-width: 260px;
          margin-left: 0;
          margin-right: var(--ddd-spacing-1, 4px);
          padding-top: 0;
          box-sizing: border-box;
          align-self: flex-start;
        }
        .rightSection {
          flex: 1;
          min-width: 0;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          overflow: visible;
        }
        .template-results {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          width: 100%;
          min-height: 330px;
          box-sizing: border-box;
          gap: var(--ddd-spacing-2, 16px);
        }
        #returnToSection {
          width: 100%;
        }
        #returnToSection app-hax-search-results {
          width: 100%;
          min-height: 280px;
          box-sizing: border-box;
          height: 300px;
        }
        :host(:not([show-filter])) app-hax-search-results {
          width: 100%;
        }

        h2,
        .returnTo h2,
        .startNew h2 {
          font-family: var(--ddd-font-primary, sans-serif);
          font-size: var(--ddd-font-size-l, 24px);
          color: var(--app-hax-accent-color, var(--accent-color));
          margin: 0 0 var(--ddd-spacing-4, 16px) 0;
        }
        .startNew,
        .returnTo {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
          margin: 0;
        }
        .upper-filter {
          margin-bottom: var(--ddd-spacing-4, 16px);
          position: relative;
          display: inline-block;
          width: 100%;
        }
        input[type="text"] {
          width: 100%;
          padding: var(--ddd-spacing-2, 8px) var(--ddd-spacing-2, 8px)
            var(--ddd-spacing-2, 8px) var(--ddd-spacing-8, 32px);
          font-size: var(--ddd-font-size-xs, 12px);
          border-radius: var(--ddd-radius-sm, 4px);
          border: var(--ddd-border-xs, 1px solid);
          border-color: var(--ddd-theme-default-slateGray, #666);
          background: var(--ddd-theme-default-white, white);
          color: var(--ddd-theme-default-coalyGray, #222);
          transition: all 0.2s ease;
          box-sizing: border-box;
          font-family: var(--ddd-font-primary, sans-serif);
          margin: 0;
          min-height: var(--ddd-spacing-8, 32px);
        }
        :host([dark]) input[type="text"],
        body.dark-mode input[type="text"] {
          background: var(--ddd-theme-default-coalyGray, #333);
          color: var(--ddd-theme-default-white, white);
          border-color: var(--ddd-theme-default-slateGray, #666);
        }
        input[type="text"]:focus {
          border: var(--ddd-border-md, 2px solid);
          border-color: var(--ddd-theme-default-keystoneYellow, #ffd100);
          background: var(--ddd-theme-default-white, white);
          outline: none;
        }
        :host([dark]) input[type="text"]:focus,
        body.dark-mode input[type="text"]:focus {
          background: var(--ddd-theme-default-coalyGray, #333);
          border-color: var(--ddd-theme-default-keystoneYellow, #ffd100);
        }
        .search-icon {
          position: absolute;
          left: var(--ddd-spacing-2, 8px);
          top: 50%;
          transform: translateY(-50%);
          font-size: var(--ddd-font-size-xs, 14px);
          color: var(--ddd-theme-default-nittanyNavy, #001e44);
          pointer-events: none;
          z-index: 1;
          --simple-icon-width: var(--ddd-icon-3xs, 20px);
          --simple-icon-height: var(--ddd-icon-3xs, 20px);
        }
        :host([dark]) .search-icon,
        body.dark-mode .search-icon {
          color: var(--ddd-theme-default-white, white);
        }
        .filter {
          position: relative;
          top: 0;
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-5, 20px);
          background: var(--ddd-theme-default-white, white);
          border-radius: var(--ddd-radius-lg, 12px);
          box-shadow: var(--ddd-boxShadow-lg);
          border: var(--ddd-border-xs, 1px solid);
          border-color: var(--ddd-theme-default-slateGray, #666);
          padding: var(--ddd-spacing-6, 24px);
          margin-top: 0;
          margin-bottom: 0;
          box-sizing: border-box;
          font-family: var(--ddd-font-primary, sans-serif);
          transition: box-shadow 0.2s ease;
        }
        :host([dark]) .filter,
        body.dark-mode .filter {
          background: var(--ddd-theme-default-coalyGray, #222);
          border-color: var(--ddd-theme-default-slateGray, #666);
          color: var(--ddd-theme-default-white, white);
        }
        .filter:hover {
          box-shadow: var(--ddd-boxShadow-xl);
        }
        .filterButtons {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-3, 12px);
          margin-top: 0;
          border: none;
          padding: 0;
          margin: 0;
        }
        .filter-btn {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: var(--ddd-spacing-1, 4px);
          padding: var(--ddd-spacing-2, 8px) var(--ddd-spacing-3, 12px);
          border-radius: var(--ddd-radius-sm, 4px);
          border: var(--ddd-border-xs, 1px solid) transparent;
          background: var(--ddd-theme-default-limestoneGray, #f5f5f5);
          color: var(--ddd-theme-default-nittanyNavy, #001e44);
          font-size: var(--ddd-font-size-3xs, 11px);
          font-family: var(--ddd-font-primary, sans-serif);
          font-weight: var(--ddd-font-weight-medium, 500);
          cursor: pointer;
          box-shadow: var(--ddd-boxShadow-sm);
          transition: all 0.2s ease;
          outline: none;
          min-height: var(--ddd-spacing-7, 28px);
          text-align: left;
        }
        :host([dark]) .filter-btn,
        body.dark-mode .filter-btn {
          background: var(--ddd-theme-default-slateGray, #444);
          color: var(--ddd-theme-default-white, white);
        }
        .filter-btn.active,
        .filter-btn:active {
          background: var(--ddd-theme-default-nittanyNavy, #001e44);
          color: var(--ddd-theme-default-white, white);
          border-color: var(--ddd-theme-default-keystoneYellow, #ffd100);
          box-shadow: var(--ddd-boxShadow-md);
        }
        :host([dark]) .filter-btn.active,
        :host([dark]) .filter-btn:active,
        body.dark-mode .filter-btn.active,
        body.dark-mode .filter-btn:active {
          background: var(--ddd-theme-default-keystoneYellow, #ffd100);
          color: var(--ddd-theme-default-nittanyNavy, #001e44);
          border-color: var(--ddd-theme-default-white, white);
        }
        .filter-btn:hover,
        .filter-btn:focus {
          background: var(--ddd-theme-default-slateGray, #666);
          color: var(--ddd-theme-default-white, white);
          transform: translateY(-1px);
        }
        .filter-btn:focus {
          outline: var(--ddd-border-md, 2px solid)
            var(--ddd-theme-default-keystoneYellow, #ffd100);
          outline-offset: var(--ddd-spacing-1, 2px);
        }
        :host([dark]) .filter-btn:hover,
        :host([dark]) .filter-btn:focus,
        body.dark-mode .filter-btn:hover,
        body.dark-mode .filter-btn:focus {
          background: var(--ddd-theme-default-limestoneGray, #f5f5f5);
          color: var(--ddd-theme-default-nittanyNavy, #001e44);
        }
        .filter-btn .icon {
          font-size: var(--ddd-font-size-3xs, 12px);
          color: inherit;
          display: flex;
          align-items: center;
          flex-shrink: 0;
          width: var(--ddd-icon-3xs, 20px);
          height: var(--ddd-icon-3xs, 20px);
        }
        .filter-btn .icon simple-icon-lite {
          color: inherit;
          --simple-icon-width: var(--ddd-icon-3xs, 20px);
          --simple-icon-height: var(--ddd-icon-3xs, 20px);
        }
        .filter-btn.active .icon,
        .filter-btn.active .icon simple-icon-lite {
          color: inherit;
        }
        :host([dark]) .filter-btn.active .icon,
        :host([dark]) .filter-btn.active .icon simple-icon-lite,
        body.dark-mode .filter-btn.active .icon,
        body.dark-mode .filter-btn.active .icon simple-icon-lite {
          color: inherit;
        }
        .filter-btn:hover .icon simple-icon-lite,
        .filter-btn:focus .icon simple-icon-lite {
          color: inherit;
        }
        input[type="checkbox"] {
          display: none;
        }
        .reset-button {
          margin-top: var(--ddd-spacing-1, 4px);
          background: var(--ddd-theme-default-original87Pink, #e4007c);
          border: var(--ddd-border-xs, 1px solid) transparent;
          color: var(--ddd-theme-default-white, white);
          border-radius: var(--ddd-radius-sm, 4px);
          font-size: var(--ddd-font-size-3xs, 11px);
          font-family: var(--ddd-font-primary, sans-serif);
          font-weight: var(--ddd-font-weight-medium, 500);
          padding: var(--ddd-spacing-2, 8px) var(--ddd-spacing-3, 12px);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--ddd-spacing-1, 4px);
          box-shadow: var(--ddd-boxShadow-sm);
          cursor: pointer;
          transition: all 0.2s ease;
          min-height: var(--ddd-spacing-7, 28px);
        }
        .reset-button:hover,
        .reset-button:focus {
          background: var(--ddd-theme-default-beaver70, #c85c2c);
          transform: translateY(-1px);
        }
        .reset-button:focus {
          outline: var(--ddd-border-md, 2px solid)
            var(--ddd-theme-default-keystoneYellow, #ffd100);
          outline-offset: var(--ddd-spacing-1, 2px);
        }
        :host([dark]) .reset-button,
        body.dark-mode .reset-button {
          background: var(--ddd-theme-default-beaver70, #c85c2c);
        }
        :host([dark]) .reset-button:hover,
        :host([dark]) .reset-button:focus,
        body.dark-mode .reset-button:hover,
        body.dark-mode .reset-button:focus {
          background: var(--ddd-theme-default-original87Pink, #e4007c);
        }
        .collapseFilter {
          display: none;
        }

        /* Visually hidden content for screen readers */
        .visually-hidden {
          position: absolute !important;
          width: 1px !important;
          height: 1px !important;
          padding: 0 !important;
          margin: -1px !important;
          overflow: hidden !important;
          clip: rect(0, 0, 0, 0) !important;
          white-space: nowrap !important;
          border: 0 !important;
        }

        @media (max-width: 780px) {
          .contentSection {
            display: block;
          }
          .leftSection {
            width: 100%;
            max-width: 100%;
            margin-bottom: var(--ddd-spacing-4, 16px);
            position: relative;
          }
          .rightSection {
            width: 100%;
          }
          :host([show-filter]) .filter {
            display: flex;
            width: 250px;
            max-width: 20vw;
          }
          :host .collapseFilter {
            display: flex;
          }
          h4,
          .returnTo h4,
          .startNew h4 {
            font-size: var(--ddd-font-size-m, 20px);
          }
          .template-results {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: var(--ddd-spacing-3, 12px);
          }
        }

        @media (max-width: 600px) {
          .contentSection {
            display: block;
            margin: 0 var(--ddd-spacing-2, 8px);
            padding-right: var(--ddd-spacing-2, 8px);
          }
          .leftSection {
            width: 100%;
            max-width: 100%;
            margin-bottom: var(--ddd-spacing-3, 12px);
            position: relative;
          }
          .rightSection {
            width: 100%;
          }
          :host([show-filter]) .filter {
            display: flex;
            width: 200px;
            max-width: 20vw;
          }
          :host .collapseFilter {
            display: flex;
          }
          h4,
          .returnTo h4,
          .startNew h4 {
            font-size: var(--ddd-font-size-s, 18px);
          }
          .template-results {
            grid-template-columns: 1fr;
            gap: var(--ddd-spacing-2, 8px);
          }
        }

        @media (max-width: 480px) {
          .contentSection {
            margin: 0 var(--ddd-spacing-1, 4px);
            padding-right: var(--ddd-spacing-1, 4px);
          }
          h4,
          .returnTo h4,
          .startNew h4 {
            font-size: var(--ddd-font-size-s, 16px);
            margin: 0 0 var(--ddd-spacing-3, 12px) 0;
          }
          .template-results {
            grid-template-columns: 1fr;
            gap: var(--ddd-spacing-2, 8px);
          }
          #returnToSection app-hax-search-results {
            min-width: 100%;
          }
        }
        .no-results {
          font-size: var(--ddd-font-size-s, 16px);
          color: light-dark(
            var(--ddd-theme-default-coalyGray, #222),
            var(--ddd-theme-default-white, white)
          );
        }
      `,
    ];
  }

  testKeydown(e) {
    if (e.key === "Escape" || e.key === "Enter") {
      this.toggleSearch();
    }
  }

  toggleFilterVisibility() {
    this.showFilter = !this.showFilter;
  }

  handleFilterKeydown(e, filter) {
    // Handle keyboard interaction for filter labels (Space and Enter)
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      this.toggleFilterByButton(filter);
    }
  }

  render() {
    return html`
      <div class="contentSection">
        <div class="leftSection">
          <div
            class="filter"
            role="search"
            aria-label="Filter and search site templates"
          >
            <!-- Search bar -->
            <div class="upper-filter">
              <label for="searchField" class="visually-hidden"
                >Filter Sites</label
              >
              <slot>
                <simple-icon-lite
                  class="search-icon"
                  icon="icons:search"
                  aria-hidden="true"
                ></simple-icon-lite>
              </slot>
              <input
                id="searchField"
                @input="${this.handleSearch}"
                @keydown="${this.testKeydown}"
                type="text"
                placeholder="Filter Sites"
                aria-label="Filter Sites"
                aria-describedby="search-help"
              />
              <div id="search-help" class="visually-hidden">
                Type to search for site templates and existing sites. Press
                Escape to clear.
              </div>
            </div>
            <!-- Filter Buttons -->
            <fieldset class="filterButtons">
              <legend class="visually-hidden">
                Filter templates by category
              </legend>
              ${this.filters.map(
                (filter, i) => html`
                  <input
                    type="checkbox"
                    id="filter-${i}"
                    class="filter-checkbox"
                    .checked=${this.activeFilters.includes(filter)}
                    @change=${() => this.toggleFilterByButton(filter)}
                    aria-describedby="filter-${i}-description"
                  />
                  <label
                    for="filter-${i}"
                    class="filter-btn ${this.activeFilters.includes(filter)
                      ? "active"
                      : ""}"
                    aria-pressed=${this.activeFilters.includes(filter)}
                    role="button"
                    tabindex="0"
                    @keydown=${(e) => this.handleFilterKeydown(e, filter)}
                  >
                    <span class="icon" aria-hidden="true">
                      <simple-icon-lite
                        icon="${this.iconForFilter(filter)}"
                      ></simple-icon-lite>
                    </span>
                    ${filter}
                  </label>
                  <div id="filter-${i}-description" class="visually-hidden">
                    Filter to show only ${filter} templates
                  </div>
                `,
              )}
            </fieldset>
            <button
              class="reset-button"
              @click="${this.resetFilters}"
              aria-describedby="reset-help"
            >
              Reset Filters
            </button>
            <div id="reset-help" class="visually-hidden">
              Clear all active filters and search terms
            </div>
          </div>
        </div>
        <!-- Content Section -->
        <div class="rightSection">
          <!-- Returning Sites -->
          <section
            id="returnToSection"
            class="returnTo"
            aria-labelledby="return-to-heading"
          >
            <h2 id="return-to-heading">Return to...</h2>
            <div
              role="region"
              aria-label="Previously created sites"
              aria-live="polite"
            >
              <app-hax-search-results
                .displayItems=${this.filteredSites}
                .searchTerm=${this.searchTerm}
                ?dark="${this.dark}"
              >
              </app-hax-search-results>
            </div>
          </section>

          <!-- Templates -->
          <section
            id="startJourneySection"
            class="startNew"
            aria-labelledby="create-site-heading"
          >
            <h2 id="create-site-heading">Create New Site</h2>
            <div
              class="template-results"
              role="grid"
              aria-label="Available site templates"
              aria-live="polite"
              aria-describedby="template-count"
            >
              <div id="template-count" class="visually-hidden">
                ${this.filteredItems.length} templates available
              </div>
              ${this.filteredItems.length > 0
                ? this.filteredItems.map(
                    (item, index) => html`
                      <div
                        role="gridcell"
                        aria-rowindex="${index + 1}"
                        aria-colindex="1"
                      >
                        <app-hax-use-case
                          .source=${item.useCaseImage || ""}
                          .title=${item.useCaseTitle || ""}
                          .description=${item.useCaseDescription || ""}
                          .demoLink=${item.demoLink || ""}
                          .iconImage=${item.useCaseIcon || []}
                          .isSelected=${item.isSelected || false}
                          .showContinue=${item.showContinue || false}
                          ?dark="${this.dark}"
                          aria-label="Template: ${item.useCaseTitle}"
                          @toggle-display=${(e) => this.toggleDisplay(index, e)}
                          @continue-action=${() => this.continueAction(index)}
                        ></app-hax-use-case>
                      </div>
                    `,
                  )
                : html`<p role="status" class="no-results" aria-live="polite">
                    No templates match the current filters. Try adjusting your
                    search or clearing filters.
                  </p>`}
            </div>
          </section>
        </div>
      </div>

      <!-- Site Creation Modal -->
      <app-hax-site-creation-modal
        id="siteCreationModal"
        @modal-closed=${this.handleModalClosed}
      ></app-hax-site-creation-modal>
    `;
  }

  iconForFilter(filter) {
    switch (filter.toLowerCase()) {
      case "blog":
        return "lrn:write";
      case "brochure":
        return "icons:description";
      case "course":
        return "hax:lesson";
      case "portfolio":
        return "icons:perm-identity";
      case "blank":
        return "hax:bricks";
      default:
        return "icons:label";
    }
  }
  toggleFilterByButton(filter) {
    if (this.activeFilters.includes(filter)) {
      this.activeFilters = this.activeFilters.filter((f) => f !== filter);
    } else {
      this.activeFilters = [...this.activeFilters, filter];
    }
    this.applyFilters();
    this.requestUpdate();
  }

  connectedCallback() {
    super.connectedCallback();
    globalThis.addEventListener("jwt-logged-in", this._jwtLoggedIn.bind(this), {
      signal: this.windowControllers.signal,
    });
  }

  disconnectedCallback() {
    this.windowControllers.abort();
    super.disconnectedCallback();
  }

  _jwtLoggedIn(e) {
    // When login status changes to true, refresh skeleton list
    if (e.detail === true) {
      this.isLoggedIn = true;
      this.updateSkeletonResults();
      this.updateSiteResults();
    } else if (e.detail === false) {
      this.isLoggedIn = false;
    }
  }

  firstUpdated() {
    super.firstUpdated();
    // Skeleton and site results are loaded via autorun watching appReady + isLoggedIn
  }

  updated(changedProperties) {
    if (
      changedProperties.has("searchQuery") ||
      changedProperties.has("activeFilters") ||
      changedProperties.has("items")
    ) {
      this.applyFilters();
    }
  }

  toggleSearch() {
    if (!this.disabled) {
      this.shadowRoot.querySelector("#searchField").value = "";
      store.appEl.playSound("click");
      this.showSearch = !this.showSearch;
      setTimeout(() => {
        this.shadowRoot.querySelector("#searchField").focus();
      }, 300);
    }
  }

  toggleSelection(index) {
    if (this.activeUseCase === index) {
      this.activeUseCase = false; // Deselect if the same card is clicked
    } else {
      this.activeUseCase = index; // Select the new card
    }
    this.requestUpdate();
  }

  handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    this.searchTerm = searchTerm;
    store.searchTerm = searchTerm; // Update store with search term

    // Filter templates (skeletons and blank themes)
    this.filteredItems = [
      ...this.items.filter(
        (item) =>
          (item.dataType === "skeleton" || item.dataType === "blank") &&
          (item.useCaseTitle.toLowerCase().includes(searchTerm) ||
            (item.useCaseTag &&
              item.useCaseTag.some((tag) =>
                tag.toLowerCase().includes(searchTerm),
              ))),
      ),
    ];

    // Filter returning sites
    this.filteredSites = [
      ...this.items.filter(
        (item) =>
          item.dataType === "site" &&
          ((item.originalData.title &&
            item.originalData.title.toLowerCase().includes(searchTerm)) ||
            (item.useCaseTag &&
              item.useCaseTag.some((tag) =>
                tag.toLowerCase().includes(searchTerm),
              ))),
      ),
    ];

    this.requestUpdate();
  }

  toggleFilter(event) {
    const filterValue = event.target.value;

    if (this.activeFilters.includes(filterValue)) {
      this.activeFilters = [
        ...this.activeFilters.filter((f) => f !== filterValue),
      ];
    } else {
      this.activeFilters = [...this.activeFilters, filterValue];
    }
    this.applyFilters();
  }

  applyFilters() {
    const lowerCaseQuery = this.searchTerm.toLowerCase();

    // Filter skeletons and blank themes (from this.items)
    this.filteredItems = [
      ...this.items.filter((item) => {
        if (item.dataType !== "skeleton" && item.dataType !== "blank")
          return false;
        const matchesSearch =
          lowerCaseQuery === "" ||
          item.useCaseTitle.toLowerCase().includes(lowerCaseQuery) ||
          (item.useCaseTag &&
            item.useCaseTag.some((tag) =>
              tag.toLowerCase().includes(lowerCaseQuery),
            ));

        const matchesFilters =
          this.activeFilters.length === 0 ||
          (item.useCaseTag &&
            this.activeFilters.some((filter) =>
              item.useCaseTag.includes(filter),
            ));

        return matchesSearch && matchesFilters;
      }),
    ];
    // Filter sites (from this.returningSites)
    this.filteredSites = [
      ...this.returningSites.filter((item) => {
        if (item.dataType !== "site") return false;
        const siteCategory =
          (item.originalData.metadata &&
            item.originalData.metadata.site &&
            item.originalData.metadata.site.category) ||
          [];
        const matchesSearch =
          lowerCaseQuery === "" ||
          (item.originalData.category &&
            item.originalData.category &&
            item.originalData.category.includes(lowerCaseQuery)) ||
          (item.useCaseTag &&
            item.useCaseTag.some((tag) =>
              tag.toLowerCase().includes(lowerCaseQuery),
            ));
        const matchesFilters =
          this.activeFilters.length === 0 ||
          this.activeFilters.some((filter) => {
            return siteCategory.includes(filter);
          });
        return matchesSearch && matchesFilters;
      }),
    ];
  }

  removeFilter(event) {
    const filterToRemove = event.detail;
    this.activeFilters = this.activeFilters.filter((f) => f !== filterToRemove);
    this.applyFilters(); // Re-filter results
    this.requestUpdate();
  }

  resetFilters() {
    this.searchTerm = "";
    store.searchTerm = "";
    this.activeFilters = [];
    // Show all templates (skeletons and blank themes) and all sites
    this.filteredItems = [
      ...this.items.filter(
        (item) => item.dataType === "skeleton" || item.dataType === "blank",
      ),
    ];
    this.filteredSites = [...this.returningSites];

    // Clear UI elements
    this.shadowRoot.querySelector("#searchField").value = "";
    this.shadowRoot
      .querySelectorAll('input[type="checkbox"]')
      .forEach((cb) => (cb.checked = false));

    this.requestUpdate();
  }

  updateSkeletonResults() {
    this.loading = true;
    this.errorMessage = "";

    // Require configured endpoint
    if (!store.appSettings || !store.appSettings.skeletonsList) {
      this.errorMessage = "Skeletons endpoint not configured";
      this.loading = false;
      return;
    }

    // Build promises: backend call for skeletons, appSettings themes or fallback fetch
    const skeletonsPromise =
      store.AppHaxAPI && store.AppHaxAPI.makeCall
        ? store.AppHaxAPI.makeCall("skeletonsList")
        : Promise.reject(new Error("API not available"));

    // Prefer themes from appSettings (injected by backend); fallback to static file
    let themesPromise;
    if (store.appSettings && store.appSettings.themes) {
      themesPromise = Promise.resolve(store.appSettings.themes);
    } else {
      const themesUrl = new URL(
        "../../../haxcms-elements/lib/themes.json",
        import.meta.url,
      ).href;
      themesPromise = fetch(themesUrl).then((response) => {
        if (!response.ok) throw new Error(`Failed Themes (${response.status})`);
        return response.json();
      });
    }

    Promise.allSettled([skeletonsPromise, themesPromise])
      .then(([skeletonsData, themesData]) => {
        // Process skeletons data (expects { status, data: [] })
        const skeletonArray =
          skeletonsData.value &&
          skeletonsData.value.data &&
          Array.isArray(skeletonsData.value.data)
            ? skeletonsData.value.data
            : [];
        const skeletonItems =
          skeletonArray.map((item) => {
            let tags = [];
            if (Array.isArray(item.category)) {
              tags = item.category.filter(
                (c) => typeof c === "string" && c.trim() !== "",
              );
            } else if (
              typeof item.category === "string" &&
              item.category.trim() !== ""
            ) {
              tags = [item.category.trim()];
            }
            if (tags.length === 0) tags = ["Empty"];
            tags.forEach((tag) => this.allFilters.add(tag)); // Add to global Set

            const icons = Array.isArray(item.attributes)
              ? item.attributes.map((attr) => ({
                  icon: attr.icon || "",
                  tooltip: attr.tooltip || "",
                }))
              : [];
            let thumbnailPath = item.image || "";
            if (thumbnailPath && thumbnailPath.startsWith("@haxtheweb/")) {
              // Navigate from current file to simulate node_modules structure and resolve path
              // Current file: elements/app-hax/lib/v2/app-hax-use-case-filter.js
              // Need to go up to webcomponents root, then navigate to the package
              // In node_modules: @haxtheweb/package-name becomes ../../../@haxtheweb/package-name
              const packagePath = "../../../../" + thumbnailPath;
              thumbnailPath = new URL(packagePath, import.meta.url).href;
            }
            return {
              dataType: "skeleton",
              useCaseTitle: item.title || "Untitled Template",
              useCaseImage: thumbnailPath || "",
              useCaseDescription: item.description || "",
              useCaseIcon: icons,
              useCaseTag: tags,
              demoLink: item["demo-url"] || "#",
              skeletonUrl: item["skeleton-url"] || "",
              originalData: item,
            };
          }) || [];

        // Process themes data into blank use cases (filter out hidden themes)
        const themeSource = themesData.value || {};
        const themeItems = Object.values(themeSource)
          .filter((theme) => !theme.hidden) // Exclude hidden system/debug themes
          .map((theme) => {
            let tags = [];
            if (Array.isArray(theme.category)) {
              tags = theme.category.filter(
                (c) => typeof c === "string" && c.trim() !== "",
              );
            } else if (
              typeof theme.category === "string" &&
              theme.category.trim() !== ""
            ) {
              tags = [theme.category.trim()];
            }
            if (tags.length === 0) tags = ["Blank"];
            tags.forEach((tag) => this.allFilters.add(tag)); // Add to global Set

            // Simple icon array for blank themes
            const icons = [{ icon: "icons:build", tooltip: "Customizable" }];

            // Resolve thumbnail path using import.meta.url navigation
            let thumbnailPath = theme.thumbnail || "";
            if (thumbnailPath && thumbnailPath.startsWith("@haxtheweb/")) {
              // Navigate from current file to simulate node_modules structure and resolve path
              // Current file: elements/app-hax/lib/v2/app-hax-use-case-filter.js
              // Need to go up to webcomponents root, then navigate to the package
              // In node_modules: @haxtheweb/package-name becomes ../../../@haxtheweb/package-name
              const packagePath = "../../../../" + thumbnailPath;
              thumbnailPath = new URL(packagePath, import.meta.url).href;
            }

            return {
              dataType: "blank",
              useCaseTitle: theme.name || "Untitled Theme",
              useCaseImage: thumbnailPath || "",
              useCaseDescription:
                theme.description || "Start with a blank site using this theme",
              useCaseIcon: icons,
              useCaseTag: tags,
              demoLink: "#", // Blank themes don't have demos
              originalData: theme,
            };
          });
        // Combine skeleton and theme items
        this.items = [...skeletonItems, ...themeItems];
        this.filters = Array.from(this.allFilters).sort(); // Set AFTER all items

        if (this.items.length === 0 && !this.errorMessage) {
          this.errorMessage = "No Templates Found";
        }

        this.resetFilters();
      })
      .catch((error) => {
        this.errorMessage = `Failed to load data: ${error.message}`;
        this.items = [];
        this.filters = [];
      })
      .finally(() => {
        this.loading = false;
      });
  }

  updateSiteResults() {
    this.loading = true;
    this.errorMessage = "";

    try {
      // Use store.manifest data instead of demo JSON
      const sitesData = store.manifest;

      if (!sitesData || !sitesData.items) {
        throw new Error("No manifest data available");
      }

      const siteItems = Array.isArray(sitesData.items)
        ? sitesData.items.map((item) => {
            let categorySource =
              item.metadata && item.metadata.site
                ? item.metadata.site.category
                : null;
            let tags = [];
            if (Array.isArray(categorySource)) {
              tags = categorySource.filter(
                (c) => typeof c === "string" && c.trim() !== "",
              );
            } else if (
              typeof categorySource === "string" &&
              categorySource.trim() !== ""
            ) {
              tags = [categorySource.trim()];
            }
            if (tags.length === 0) tags = ["Empty"];
            tags.forEach((tag) => this.allFilters.add(tag)); // Add to global Set
            return {
              dataType: "site",
              useCaseTag: tags,
              originalData: item,
              ...item, // this spreads every prop into this area that way it can be filtered correctly
            };
          })
        : [];
      this.returningSites = [...siteItems];
      this.filters = Array.from(this.allFilters).sort(); // Set AFTER all items
      this.filteredSites = [...siteItems];

      if (siteItems.length === 0 && !this.errorMessage) {
        this.errorMessage = "No Sites Found";
      }

      this.requestUpdate();
      this.loading = false;
    } catch (error) {
      this.errorMessage = `Failed to load data: ${error.message}`;
      this.returningSites = [];
      this.filteredSites = [];
      this.filters = [];
      this.loading = false;
    }
  }

  toggleDisplay(index, event) {
    const isSelected = event.detail.isSelected;

    if (this.selectedCardIndex !== null && this.selectedCardIndex !== index) {
      // Deselect the previously selected card
      this.filteredItems[this.selectedCardIndex].isSelected = false;
      this.filteredItems[this.selectedCardIndex].showContinue = false;
    }

    if (isSelected) {
      // Select the new card
      this.selectedCardIndex = index;
    } else {
      // Deselect the current card
      this.selectedCardIndex = null;
    }

    this.filteredItems[index].isSelected = isSelected;
    this.filteredItems[index].showContinue = isSelected;
    this.requestUpdate();
  }

  async continueAction(index) {
    const selectedTemplate = this.filteredItems[index];
    const modal = this.shadowRoot.querySelector("#siteCreationModal");

    if (modal && selectedTemplate) {
      // Set the template details in the modal
      modal.title = selectedTemplate.useCaseTitle;
      modal.description = selectedTemplate.useCaseDescription;
      modal.source = selectedTemplate.useCaseImage;
      modal.template = selectedTemplate.useCaseTitle;

      // Handle skeleton templates by loading the skeleton file
      if (
        selectedTemplate.dataType === "skeleton" &&
        selectedTemplate.skeletonUrl
      ) {
        try {
          const skeletonUrl = new URL(
            selectedTemplate.skeletonUrl,
            import.meta.url,
          ).href;
          const response = await fetch(skeletonUrl);
          if (response.ok) {
            const skeletonData = await response.json();
            // Store skeleton data for use in site creation
            modal.skeletonData = skeletonData;
            modal.themeElement =
              (skeletonData.site && skeletonData.site.theme) || "clean-one";
          } else {
            console.warn(`Failed to load skeleton from ${skeletonUrl}`);
            modal.themeElement = "clean-one"; // fallback
          }
        } catch (error) {
          console.warn(`Error loading skeleton:`, error);
          modal.themeElement = "clean-one"; // fallback
        }
      } else if (
        selectedTemplate.dataType === "blank" &&
        selectedTemplate.originalData.element
      ) {
        modal.themeElement = selectedTemplate.originalData.element;
      } else {
        modal.themeElement = "clean-one"; // fallback
      }

      // Open the modal
      modal.openModal();
    }
  }

  handleModalClosed(event) {
    // If modal was cancelled (not completed), reset selected states
    if (event.detail && event.detail.cancelled) {
      // Reset the selected card if one was selected
      if (
        this.selectedCardIndex !== null &&
        this.filteredItems[this.selectedCardIndex]
      ) {
        this.filteredItems[this.selectedCardIndex].isSelected = false;
        this.filteredItems[this.selectedCardIndex].showContinue = false;
        this.selectedCardIndex = null;
        this.requestUpdate();
      }
    }
    console.log("Site creation modal closed", event.detail);
  }
}
customElements.define("app-hax-use-case-filter", AppHaxUseCaseFilter);
