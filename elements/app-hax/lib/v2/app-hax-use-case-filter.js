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

    // Listen to store changes for dark mode and manifest updates
    if (typeof store !== "undefined") {
      import("mobx").then(({ autorun, toJS }) => {
        autorun(() => {
          this.dark = toJS(store.darkMode);
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
          gap: var(--ddd-spacing-4, 16px);
          width: 100%;
          margin: 0 var(--ddd-spacing-4, 16px);
          padding-right: var(--ddd-spacing-4, 16px);
          box-sizing: border-box;
        }
        .leftSection,
        .rightSection {
          display: flex;
          flex-direction: column;
          flex: 1 1 0;
        }
        .leftSection {
          width: 340px;
          min-width: 260px;
          max-width: 380px;
          margin-left: 0;
          margin-right: var(--ddd-spacing-1, 4px);
          padding-top: 0;
          box-sizing: border-box;
          position: sticky;
        }
        .rightSection {
          flex: 1;
          width: calc(100vw - 420px);
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }
        .template-results {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          width: 100%;
          min-height: 330px;
          box-sizing: border-box;
          gap: var(--ddd-spacing-2, 8px);
        }
        #returnToSection {
          width: 100%;
        }
        #returnToSection app-hax-search-results {
          display: flex;
          gap: var(--ddd-spacing-6, 24px);
          min-width: calc(3 * 264px + 2 * var(--ddd-spacing-6, 24px));
          min-height: 120px;
          box-sizing: border-box;
          justify-content: flex-start;
          align-items: stretch;
          flex-direction: row;
          flex-wrap: nowrap;
          scroll-behavior: smooth;
          overflow: hidden;
          height: 300px;
        }
        :host(:not([show-filter])) app-hax-search-results {
          width: 100%;
        }

        h4,
        .returnTo h4,
        .startNew h4 {
          font-family: var(--ddd-font-primary, sans-serif);
          font-size: var(--ddd-font-size-l, 24px);
          color: var(--app-hax-accent-color, var(--accent-color));
          margin: 0 0 var(--ddd-spacing-4, 16px) 0;
        }
        .startNew,
        .returnTo {
          padding-top: var(--ddd-spacing-2, 8px);
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
          margin-left: 0;
          margin-right: 0;
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
          position: sticky;
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
          width: 100%;
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
        .filter-btn:hover {
          background: var(--ddd-theme-default-slateGray, #666);
          color: var(--ddd-theme-default-white, white);
          transform: translateY(-1px);
        }
        :host([dark]) .filter-btn:hover,
        body.dark-mode .filter-btn:hover {
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
        .reset-button:hover {
          background: var(--ddd-theme-default-beaver70, #c85c2c);
          transform: translateY(-1px);
        }
        :host([dark]) .reset-button,
        body.dark-mode .reset-button {
          background: var(--ddd-theme-default-beaver70, #c85c2c);
        }
        :host([dark]) .reset-button:hover,
        body.dark-mode .reset-button:hover {
          background: var(--ddd-theme-default-original87Pink, #e4007c);
        }
        .collapseFilter {
          display: none;
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

  render() {
    return html`
      <div class="contentSection">
        <div class="leftSection">
          <div class="filter">
            <!-- Search bar -->
            <div class="upper-filter">
              <slot>
                <simple-icon-lite
                  class="search-icon"
                  icon="icons:search"
                ></simple-icon-lite>
              </slot>
              <input
                id="searchField"
                @input="${this.handleSearch}"
                @keydown="${this.testKeydown}"
                type="text"
                placeholder="Search Sites & Templates"
              />
            </div>
            <!-- Filter Buttons -->
            <div class="filterButtons">
              ${this.filters.map(
                (filter, i) => html`
                  <input
                    type="checkbox"
                    id="filter-${i}"
                    class="filter-checkbox"
                    .checked=${this.activeFilters.includes(filter)}
                    @change=${() => this.toggleFilterByButton(filter)}
                  />
                  <label
                    for="filter-${i}"
                    class="filter-btn ${this.activeFilters.includes(filter)
                      ? "active"
                      : ""}"
                    aria-pressed=${this.activeFilters.includes(filter)}
                  >
                    <span class="icon">
                      <simple-icon-lite
                        icon="${this.iconForFilter(filter)}"
                      ></simple-icon-lite>
                    </span>
                    ${filter}
                  </label>
                `,
              )}
            </div>
            <button class="reset-button" @click="${this.resetFilters}">
              Reset
            </button>
          </div>
        </div>
        <!-- Content Section -->
        <div class="rightSection">
          <!-- Returning Sites -->
          <div id="returnToSection" class="returnTo">
            <h4>Return to...</h4>
            <app-hax-search-results
              .displayItems=${this.filteredSites}
              .searchTerm=${this.searchTerm}
              ?dark="${this.dark}"
            >
            </app-hax-search-results>
          </div>

          <!-- Templates -->
          <div id="startJourneySection" class="startNew">
            <h4>Create New Site</h4>
            <div class="template-results">
              ${this.filteredItems.length > 0
                ? this.filteredItems.map(
                    (item, index) => html`
                      <div>
                        <a
                          href="${item.demoLink}"
                          target="_blank"
                          class="${index === this.activeUseCase
                            ? "active-card"
                            : ""}"
                        ></a>
                        <app-hax-use-case
                          .source=${item.useCaseImage || ""}
                          .title=${item.useCaseTitle || ""}
                          .description=${item.useCaseDescription || ""}
                          .demoLink=${item.demoLink || ""}
                          .iconImage=${item.useCaseIcon || []}
                          .isSelected=${item.isSelected || false}
                          .showContinue=${item.showContinue || false}
                          ?dark="${this.dark}"
                          @toggle-display=${(e) => this.toggleDisplay(index, e)}
                          @continue-action=${() => this.continueAction(index)}
                        ></app-hax-use-case>
                      </div>
                    `,
                  )
                : html`<p>No templates match the filters specified.</p>`}
            </div>
          </div>
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

  firstUpdated() {
    super.firstUpdated();
    this.updateRecipeResults();
    this.updateSiteResults();
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

    // Filter templates (recipes)
    this.filteredItems = [
      ...this.items.filter(
        (item) =>
          item.dataType === "recipe" &&
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

    // Filter recipes (from this.items)
    this.filteredItems = [
      ...this.items.filter((item) => {
        if (item.dataType !== "recipe") return false;
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
        const siteCategory = item.originalData.metadata?.site?.category || [];
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
    // Show all templates and all sites
    this.filteredItems = [
      ...this.items.filter((item) => item.dataType === "recipe"),
    ];
    this.filteredSites = [...this.returningSites];

    // Clear UI elements
    this.shadowRoot.querySelector("#searchField").value = "";
    this.shadowRoot
      .querySelectorAll('input[type="checkbox"]')
      .forEach((cb) => (cb.checked = false));

    this.requestUpdate();
  }

  updateRecipeResults() {
    this.loading = true;
    this.errorMessage = "";

    const recipesUrl = new URL("./app-hax-recipes.json", import.meta.url).href;

    fetch(recipesUrl)
      .then((response) => {
        if (!response.ok)
          throw new Error(`Failed Recipes (${response.status})`);
        return response.json();
      })
      .then((recipesData) => {
        const recipeItems = Array.isArray(recipesData.item)
          ? recipesData.item.map((item) => {
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

              return {
                dataType: "recipe",
                useCaseTitle: item.title || "Untitled Template",
                useCaseImage: item.image || "",
                useCaseDescription: item.description || "",
                useCaseIcon: icons,
                useCaseTag: tags,
                demoLink: item["demo-url"] || "#",
                originalData: item,
              };
            })
          : [];

        this.items = recipeItems;
        this.filters = Array.from(this.allFilters).sort(); // Set AFTER all items

        if (this.items.length === 0 && !this.errorMessage) {
          this.errorMessage = "No Recipes Found";
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
            let categorySource = item.metadata && item.metadata.site ? item.metadata.site.category : null;
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

  continueAction(index) {
    const selectedTemplate = this.filteredItems[index];
    const modal = this.shadowRoot.querySelector("#siteCreationModal");

    if (modal && selectedTemplate) {
      // Set the template details in the modal
      modal.title = selectedTemplate.useCaseTitle;
      modal.description = selectedTemplate.useCaseDescription;
      modal.source = selectedTemplate.useCaseImage;
      modal.template = selectedTemplate.useCaseTitle;

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
