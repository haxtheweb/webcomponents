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
          max-width: 100%;
        }
        .contentSection {
          display: flex; 
          align-items: flex-start; 
          justify-content: flex-start; 
          gap: 16px; 
          width: 100%; 
        }
        .leftSection, .rightSection {
          display: flex;
          flex-direction: column;
          flex: 1 1 0;
        }
        .leftSection {
          width: 340px;
          min-width: 260px;
          max-width: 380px;
          margin-left: 0;
          margin-right: 24px;
          padding-top: 0;
          box-sizing: border-box;
        }
        .rightSection {
          flex: 1 1 0;
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }
        .template-results {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 0.3fr));
          width: 100%;
          min-height: 330px;
          box-sizing: border-box;
        }
        h4,
        .returnTo h4,
        .startNew h4 {
          font-family: var(--ddd-font-primary);
          font-size: 24px;
          color: var(--app-hax-accent-color, var(--accent-color));
          margin: 0 0 var(--ddd-spacing-4) 0;
        }
        .startNew,
        .returnTo {
          padding-top: 8px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
          margin-left: 0;
          margin-right: 0;
        }
        .upper-filter {
          margin-bottom: var(--ddd-spacing-3);
          position: relative;
          display: inline-block;
        }
        input[type="text"] {
          width: 100%;
          max-width: 25vw;
          padding: var(--ddd-spacing-3) var(--ddd-spacing-3) var(--ddd-spacing-3) 44px;
          font-size: 15px;
          border-radius: var(--ddd-radius-md);
          border: var(--ddd-border-xs);
          background: var(--ddd-accent-2, #f2f2f4);
          color: #222;
          transition: border 0.2s;
          box-sizing: border-box;
          font-family: var(--ddd-font-primary);
          margin: 4px 0 0 4px;
          height: 20px;
        } 
        input[type="text"]:focus {
          border: var(--ddd-border-sm);
          background: #fff;
          outline: none;
        }  
        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 22px;
          color: var(--ddd-primary-8, #009cde);
          align-self: center;
        }  
        .filter {
          padding: 24px;
          position: sticky;
          top: 0;
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-4);
          background: var(--ddd-accent-6, #fff);
          border-radius: var(--ddd-radius-lg);
          box-shadow: var(--ddd-boxShadow-lg);
          border: var(--ddd-border-xs);
          padding: var(--ddd-spacing-6) var(--ddd-spacing-5) var(--ddd-spacing-5) var(--ddd-spacing-5);
          margin-top: 0;
          margin-left: 24px;
          margin-bottom: 0;
          width: 100%;
          max-width: 320px;
          box-sizing: border-box;
          font-family: var(--ddd-font-primary);
          transition: box-shadow 0.2s;
        }
        .filter:hover {
          box-shadow: var(--ddd-boxShadow-xl);
        }
        .filterButtons {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-3);
          margin-top: 0;
          width: 100%;
        }
        .filter-btn {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-3);
          padding: var(--ddd-spacing-3) var(--ddd-spacing-5);
          border-radius: var(--ddd-radius-rounded);
          border: none;
          background: var(--ddd-accent-2, #f2f2f4);
          color: var(--ddd-primary-2, #001e44);
          font-size: 1rem;
          font-family: var(--ddd-font-primary);
          font-weight: 600;
          cursor: pointer;
          box-shadow: var(--ddd-boxShadow-sm);
          transition: box-shadow 0.2s;
          outline: none;
          min-height: 44px;
        }
        .filter-btn.active,
        .filter-btn:active {
          background: var(--ddd-primary-8, #009cde);
          color: #fff;
          box-shadow: var(--ddd-boxShadow-md);
        }
        .filter-btn:hover {
          background: var(--ddd-accent-3, #e4e5e7);
        }
        .filter-btn .icon {
          font-size: 22px;
          color: inherit;
          display: flex;
          align-items: center;
        }
        input[type="checkbox"] {
          display: none;
        }
        .reset-button {
          margin-top: var(--ddd-spacing-5);
          background: var(--ddd-primary-2, #001e44);
          border: none;
          color: #fff;
          border-radius: var(--ddd-radius-rounded);
          font-size: 1rem;
          font-family: var(--ddd-font-primary);
          font-weight: 600;
          padding: var(--ddd-spacing-3) var(--ddd-spacing-5);
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-3);
          box-shadow: var(--ddd-boxShadow-sm);
        }  
        .reset-button:hover {
          background: var(--ddd-primary-8, #009cde);
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
                    class="filter-btn"
                    aria-pressed=${this.activeFilters.includes(filter)}
                  >
                    <span class="icon">
                      <simple-icon icon="${this.iconForFilter(filter)}"></simple-icon>
                    </span>
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
              .displayItems=${this.filteredSites.slice(0, 3)}
              .searchTerm=${this.searchTerm}>
            </app-hax-search-results>
          </div>
  
          <!-- Templates -->
          <div id="startJourneySection" class="startNew">
            <h4>Create New Site</h4>
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
    this.filteredItems = [...this.items.filter(
      item =>
        item.dataType === "recipe" &&
        (
          item.useCaseTitle.toLowerCase().includes(searchTerm) ||
          (item.useCaseTag && item.useCaseTag.some(tag => tag.toLowerCase().includes(searchTerm)))
        )
    )];

    // Filter returning sites
    this.filteredSites = [...this.items.filter(
      item =>
        item.dataType === "site" &&
        (
          (item.originalData.title && item.originalData.title.toLowerCase().includes(searchTerm)) ||
          (item.useCaseTag && item.useCaseTag.some(tag => tag.toLowerCase().includes(searchTerm)))
        )
    )];

    this.requestUpdate();
  }

  toggleFilter(event) {
    const filterValue = event.target.value;

    if (this.activeFilters.includes(filterValue)) {
      this.activeFilters = [...this.activeFilters.filter((f) => f !== filterValue)];
    } else {
      this.activeFilters = [...this.activeFilters, filterValue];
    }
    this.applyFilters();
  }

  applyFilters() {
    const lowerCaseQuery = this.searchTerm.toLowerCase();
  
    // Filter recipes (from this.items)
    this.filteredItems = [...this.items.filter((item) => {
      if (item.dataType !== "recipe") return false;
      const matchesSearch = 
        lowerCaseQuery === "" ||
        item.useCaseTitle.toLowerCase().includes(lowerCaseQuery) ||
        (item.useCaseTag && item.useCaseTag.some(tag => tag.toLowerCase().includes(lowerCaseQuery)));
  
      const matchesFilters = 
        this.activeFilters.length === 0 ||
        (item.useCaseTag && this.activeFilters.some(filter => item.useCaseTag.includes(filter)));
  
      return matchesSearch && matchesFilters;
    })];
    // Filter sites (from this.returningSites)
    this.filteredSites = [...this.returningSites.filter((item) => {
      if (item.dataType !== "site") return false;
      const siteCategory = item.originalData.metadata?.site?.category || [];
      const matchesSearch =
        lowerCaseQuery === "" ||
        (item.originalData.category && item.originalData.category && item.originalData.category.includes(lowerCaseQuery)) ||
        (item.useCaseTag && item.useCaseTag.some(tag => tag.toLowerCase().includes(lowerCaseQuery)));
      const matchesFilters =
        this.activeFilters.length === 0 ||
        this.activeFilters.some((filter) => {
          return siteCategory.includes(filter);
        });
      return matchesSearch && matchesFilters;
    })];
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
    this.filteredItems = [...this.items.filter(item => item.dataType === "recipe")];
    this.filteredSites = [...this.returningSites];

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
        const siteItems = Array.isArray(sitesData.data.items) ? sitesData.data.items.map(item => {
          let categorySource = item.metadata.site.category;
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
            originalData: item,
            ...item // this spreads every prop into this area that way it can be filtered correctly
          };
        }) : [];
        this.returningSites = [...siteItems];
        this.filters = Array.from(this.allFilters).sort(); // Set AFTER all items
        this.filteredSites = [...siteItems];
  
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