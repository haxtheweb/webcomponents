/* eslint-disable no-return-assign */
import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
import { store } from "./AppHaxStore.js";
import "./app-hax-use-case.js";
import "./app-hax-search-results.js";
import "./app-hax-filter-tag.js";
import "./app-hax-scroll-button.js";

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
  }

  static get properties() {
    return {
      searchTerm: { type: String },
      showSearch: { type: Boolean, reflect: true, attribute: "show-search" },
      showFilter: {type: Boolean, reflect: true, attribute: "show-filter"},
      disabled: { type: Boolean, reflect: true },
      items: { type: Array },
      filteredItems: { type: Array },
      filteredSites: { type: Array },
      activeFilters: { type: Array },
      filters: { type: Array },
      searchQuery: { type: String },
      demoLink: { type: String},
      errorMessage: { type: String },
      loading: { type: Boolean },
      selectedCardIndex: { type: Number },
      returningSites: { type: Array },
      allFilters: { attribute: false }
    };
  }

  static get styles() {
    return [
      css`
        :host {
          overflow: hidden;
          display: block;
          width: 100%;
        }
        .contentSection {
          display: flex; 
          align-items: flex-start; 
          justify-content: flex-start; 
          gap: 16px; 
          width: 100%; 
        }
        .leftSection {
          display: block;
          width: 460px; 
          margin-left: 12px;
        }
        .rightSection {
          display: block;
        }
        .template-results {
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          flex-wrap: wrap;
        }
        app-hax-search-results {
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          width: 828px;
          z-index: 5;
        }
        .reset-button {
          display: flex;
          font-family: var(--ddd-font-primary);
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          margin-top: 36px;
        }
        h4 {
          font-family: var(--ddd-font-primary);
          font-size: 24px;
          color: var(--app-hax-accent-color, var(--accent-color));
          margin: 16px;
        }
        .startNew, .returnTo {
          padding-top: 40px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
          margin-left: 48px;
          margin-right: 48px;
        }
        .startNew h4, .returnTo h4 {
          flex-shrink: 0;
        }
        .returnTo h4 {
          margin-top: 0px;
        }
        input[type="text"]{
          opacity: 1;
          width: 250px;
          padding: 4px;
          padding-left: 35px;
          max-width: 25vw;
          transition: all ease-in-out 0.3s;
          font-family: var(--ddd-font-primary);
          font-size: 16px;
          margin: 4px 0 0 4px;
          height: 20px;
        }
        .upper-filter {
          position: relative;
          display: inline-block;
        }
        .search-icon {
          position: absolute; 
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 16px;
          align-self: center;
        }
        .filter {
          position: sticky;
          top: 0; 
          height: 280px;
          display: flex;
          background-color: var(--simple-colors-default-theme-accent-1, var(--accent-color));
          color: var(--simple-colors-default-theme-accent-12, var(--accent-color));
          border-radius: 8px;
          flex-direction: column;
          margin: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-4);
          border: solid 1px var(--simple-colors-default-theme-accent-12, var(--accent-color));
          width: 300px;
        }
        .collapseFilter {
          display: none;
        }
        @media (max-width: 780px) {
          :host .filter {
            display: none;
          }
          :host([show-filter]) .filter {
            display: flex;
            width: 250px;
            max-width: 20vw;
          }
          :host .collapseFilter {
            display: flex;
          }
        }
        @media (max-width: 600px) {
          :host .filter {
            display: none;
          }
          :host([show-filter]) .filter {
            display: flex;
            width: 200px;
            max-width: 20vw;
          }
          :host .collapseFilter {
            display: flex;
          }
        }
        .filterButtons {
          margin-top: 8px;
          text-align: left;
          align-items: flex-start;
          justify-self: flex-start;
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-2);
          width: 150px;
        }
        .filterButtons label {
          font-family: var(--ddd-font-primary);
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 8px;
        }
        input[type="checkbox"] {
          width: 30px;
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
                <simple-icon class="search-icon" icon="icons:search"></simple-icon>
              </slot>
              <input
                id="searchField"
                @input="${this.handleSearch}"
                @keydown="${this.testKeydown}"
                type="text"
                placeholder="Search Templates & Sites"
              />
            </div>
            <!-- Filter Buttons -->
            <div class="filterButtons">
              ${this.filters.map(
                (filter) => html`
                  <label>
                    <input
                      type="checkbox"
                      .value=${filter}
                      .checked=${this.activeFilters.includes(filter)}
                      @change=${(e) => this.toggleFilter(e)}
                    />
                    ${filter}
                  </label>
                `
              )}
            </div>
            <button class="reset-button" @click="${this.resetFilters}">Reset</button>
          </div>
        </div>
        <!-- Content Section -->
        <div class="rightSection">
          <!-- Returning Sites -->
          <div id="returnToSection" class="returnTo">
            <h4>Return to...</h4>
            <app-hax-search-results 
              .results=${this.filteredSites}
              .searchTerm=${this.searchTerm}>
            </app-hax-search-results>
          </div>
  
          <!-- Templates -->
          <div id="startJourneySection" class="startNew">
            <h4>Start New Journey</h4>
            <div class="selectedTags">
              ${this.activeFilters.map(
                (filter) => html`
                  <app-hax-filter-tag .label=${filter} @remove-tag=${this.removeFilter}></app-hax-filter-tag>
                `
              )}
            </div>
            <div class="template-results">
              ${this.filteredItems.length > 0
                ? this.filteredItems.map(
                    (item, index) => html`
                      <div>
                        <a href="${item.demoLink}" target="_blank"
                          class="${index === this.activeUseCase ? "active-card" : ""}"></a>
                        <app-hax-use-case
                          .source=${item.useCaseImage || ""}
                          .title=${item.useCaseTitle || ""}
                          .description=${item.useCaseDescription || ""}
                          .demoLink=${item.demoLink || ""}
                          .iconImage=${item.useCaseIcon || []}
                          .isSelected=${item.isSelected || false}
                          .showContinue=${item.showContinue || false}
                          @toggle-display=${(e) => this.toggleDisplay(index, e)}
                          @continue-action=${() => this.continueAction(index)}
                        ></app-hax-use-case>
                      </div>
                    `
                  )
                : html`<p>No templates match the filters specified.</p>`}
            </div>
          </div>
        </div>
      </div>
    `;
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
      changedProperties.has("item")
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
    this.filteredItems = this.items.filter(
      item =>
        item.dataType === "recipe" &&
        (
          item.useCaseTitle.toLowerCase().includes(searchTerm) ||
          (item.useCaseTag && item.useCaseTag.some(tag => tag.toLowerCase().includes(searchTerm)))
        )
    );

    // Filter returning sites
    this.filteredSites = this.items.filter(
      item =>
        item.dataType === "site" &&
        (
          (item.originalData.title && item.originalData.title.toLowerCase().includes(searchTerm)) ||
          (item.useCaseTag && item.useCaseTag.some(tag => tag.toLowerCase().includes(searchTerm)))
        )
    );

    this.requestUpdate();
  }

  toggleFilter(event) {
    const filterValue = event.target.value;

    if (this.activeFilters.includes(filterValue)) {
      this.activeFilters = this.activeFilters.filter((f) => f !== filterValue);
    } else {
      this.activeFilters = [...this.activeFilters, filterValue];
    }
    this.applyFilters();
  }

  applyFilters() {
    const lowerCaseQuery = this.searchTerm.toLowerCase();
  
    // Filter recipes (from this.items)
    this.filteredItems = this.items.filter((item) => {
      if (item.dataType !== "recipe") return false;
      const matchesSearch = 
        lowerCaseQuery === "" ||
        item.useCaseTitle.toLowerCase().includes(lowerCaseQuery) ||
        (item.useCaseTag && item.useCaseTag.some(tag => tag.toLowerCase().includes(lowerCaseQuery)));
  
      const matchesFilters = 
        this.activeFilters.length === 0 ||
        (item.useCaseTag && this.activeFilters.some(filter => item.useCaseTag.includes(filter)));
  
      return matchesSearch && matchesFilters;
    });
  
    // Filter sites (from this.returningSites)
    this.filteredSites = this.returningSites.filter((item) => {
      if (item.dataType !== "site") return false;
      const siteCategory = item.originalData.metadata?.site?.category || [];
      
      const matchesSearch =
        lowerCaseQuery === "" ||
        (item.originalData.title && item.originalData.title.toLowerCase().includes(lowerCaseQuery)) ||
        (item.useCaseTag && item.useCaseTag.some(tag => tag.toLowerCase().includes(lowerCaseQuery)));
  
      const matchesFilters =
        this.activeFilters.length === 0 ||
        this.activeFilters.some(filter => 
          siteCategory.includes(filter)
        );
  
      return matchesSearch && matchesFilters;
    });
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
    this.filteredItems = this.items.filter(item => item.dataType === "recipe");
    this.filteredSites = this.returningSites;

    // Clear UI elements
    this.shadowRoot.querySelector("#searchField").value = "";
    this.shadowRoot.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);

    this.requestUpdate();
  }

  updateRecipeResults() {
    this.loading = true;
    this.errorMessage = "";
  
    const recipesUrl = new URL('./app-hax-recipes.json', import.meta.url).href;
  
    fetch(recipesUrl)
      .then(response => {
        if (!response.ok) throw new Error(`Failed Recipes (${response.status})`);
        return response.json();
      })
      .then(recipesData => {
        const recipeItems = Array.isArray(recipesData.item) ? recipesData.item.map(item => {
          let tags = [];
          if (Array.isArray(item.category)) {
            tags = item.category.filter(c => typeof c === 'string' && c.trim() !== '');
          } else if (typeof item.category === 'string' && item.category.trim() !== '') {
            tags = [item.category.trim()];
          }
          if (tags.length === 0) tags = ['Empty'];
          tags.forEach(tag => this.allFilters.add(tag)); // Add to global Set
  
          const icons = Array.isArray(item.attributes)
            ? item.attributes.map(attr => ({
                icon: attr.icon || '',
                tooltip: attr.tooltip || ''
              }))
            : [];
  
          return {
            dataType: 'recipe',
            useCaseTitle: item.title || 'Untitled Template',
            useCaseImage: item.image || '',
            useCaseDescription: item.description || '',
            useCaseIcon: icons,
            useCaseTag: tags,
            demoLink: item["demo-url"] || '#',
            originalData: item
          };
        }) : [];
  
        this.items = recipeItems;
        this.filters = Array.from(this.allFilters).sort(); // Set AFTER all items
  
        if (this.items.length === 0 && !this.errorMessage) {
          this.errorMessage = 'No Recipes Found';
        }
  
        this.resetFilters();
      })
      .catch(error => {
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
  
    const sitesUrl = new URL('../../demo/sites.json', import.meta.url).href;
  
    fetch(sitesUrl)
      .then(response => {
        if (!response.ok) throw new Error(`Failed Sites (${response.status})`);
        return response.json();
      })
      .then(sitesData => {
        const items = sitesData.data?.items || [];
        const siteItems = Array.isArray(items) ? items.map(item => {
          let categorySource = item?.metadata?.site?.category;
          let tags = [];
          if (Array.isArray(categorySource)) {
            tags = categorySource.filter(c => typeof c === 'string' && c.trim() !== '');
          } else if (typeof categorySource === 'string' && categorySource.trim() !== '') {
            tags = [categorySource.trim()];
          }
          if (tags.length === 0) tags = ['Empty'];
          tags.forEach(tag => this.allFilters.add(tag)); // Add to global Set
  
          return {
            dataType: 'site',
            useCaseTag: tags,
            originalData: item
          };
        }) : [];
  
        this.returningSites = siteItems;
        this.filters = Array.from(this.allFilters).sort(); // Set AFTER all items
        this.filteredSites = siteItems;
  
        if (siteItems.length === 0 && !this.errorMessage) {
          this.errorMessage = 'No Sites Found';
        }
  
        this.requestUpdate();
      })
      .catch(error => {
        this.errorMessage = `Failed to load data: ${error.message}`;
        this.returningSites = [];
        this.filteredSites = [];
        this.filters = [];
      })
      .finally(() => {
        this.loading = false;
      });
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
    console.log(`Continue action for item at index ${index}`);
    // Implement the continue action for the selected item
  }
}
customElements.define("app-hax-use-case-filter", AppHaxUseCaseFilter);
