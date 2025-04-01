/* eslint-disable no-return-assign */
import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
import { store } from "./AppHaxStore.js";
import "./app-hax-use-case.js";
import "./app-hax-search-results.js";
import "./app-hax-filter-tag.js";
import "./app-hax-scroll-button.js";
import "./app-hax-search-bar.js";

export class AppHaxUseCaseFilter extends LitElement {
  // a convention I enjoy so you can change the tag name in 1 place
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
    this.activeFilters = [];
    this.filters = [];
    this.searchQuery = "";
    this.demoLink = "";
    this.errorMessage = "";
    this.loading = false;
    this.selectedCardIndex = null;
  }

  // Site.json is coming from
  
  static get properties() {
    return {
      searchTerm: { type: String },
      showSearch: { type: Boolean, reflect: true, attribute: "show-search" },
      disabled: { type: Boolean, reflect: true },
      items: { type: Array },
      filteredItems: { type: Array },
      activeFilters: { type: Array },
      filters: { type: Array },
      searchQuery: { type: String },
      demoLink: { type: String},
      errorMessage: { type: String },
      loading: { type: Boolean },
      selectedCardIndex: { type: Number },
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
        .rightSection{
          display: block;
          margin-left: 336px;
        }
        .results {
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          flex-wrap: wrap;
        }
        app-hax-search-results {
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          width: 816px;
        }
        .reset-button {
          display: flex;
          font-family: var(--ddd-font-primary);
          font-size: 12px;
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
          display: inline-flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
          margin-left: 48px;
          margin-right: 48px;
          
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
          position: absolute;
          left: 16px;
          height: auto;
          justify-self: flex-start;
          display:flex;
          background-color: var(--simple-colors-default-theme-accent-1, var(--accent-color));
          color: var(--simple-colors-default-theme-accent-12, var(--accent-color));
          border-radius: 8px;
          flex-direction: column;
          margin: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-4);
          border: solid 1px var(--simple-colors-default-theme-accent-12, var(--accent-color));
          width: 300px;
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
        .newJourneySection {
          display: inline-flex;
        }
      `,
    ];
  }

  testKeydown(e) {
    if (e.key === "Escape" || e.key === "Enter") {
      this.toggleSearch();
    }
  }

  render() {
    return html`
  <div class="newJourneySection">
  <div class="filter">
  <!--search bar-->
    <div class="upper-filter">
      <app-hax-search-bar></app-hax-search-bar>
    <!--search bar-->
      <slot>
        <simple-icon class="search-icon" icon="icons:search"></simple-icon>
      </slot>
      <input
        icon="icons:search"
        icon-position="left"
        id="searchField"
        @click="${this.toggleSearch}"
        @input="${this.handleSearch}"
        @keydown="${this.testKeydown}"
        type="text"
        placeholder="Search Templates"
      />
     
    </div>
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

    <div class="rightSection">
    <div class="selectedTags">
      ${this.activeFilters.map(
      (filter) => html`
        <app-hax-filter-tag .label=${filter} @remove-tag=${this.removeFilter}></app-hax-filter-tag>
      `
      )}
    </div>

    <!--returning sites-->
    <div id="returnToSection" class="returnTo">
      <h4>Return to...</h4>
      <app-hax-search-results></app-hax-search-results>
    </div>
    

    <!--templates-->
    <div id="startJourneySection" class="startNew">
      <h4>Start New Journey</h4>
      <div class="results">
      
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
            </a>
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
    this.updateResults();
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
    this.searchQuery = event.target.value.toLowerCase();

    const matchingFilter = this.filters.find(filter => 
      filter.toLowerCase() === this.searchQuery
    );

    const checkbox = this.shadowRoot.querySelector(`input[value="${matchingFilter}"]`);
    if (checkbox) {
      checkbox.checked = true;
    }

    this.applyFilters();
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
    const lowerCaseQuery = this.searchQuery.toLowerCase();
    
    console.log("Active Filters:", this.activeFilters);

    this.filteredItems = this.items.filter((item) => {
      const matchesSearch = lowerCaseQuery === "" ||
        item.useCaseTitle.toLowerCase().includes(lowerCaseQuery) ||
        item.useCaseTag.some(tag => tag.toLowerCase() === lowerCaseQuery);
    
      const matchesFilters = this.activeFilters.length === 0 || 
      this.activeFilters.some(filter => 
        item.useCaseTag.includes(filter));
    
      return matchesSearch && matchesFilters;
    }); 
    this.requestUpdate();
  }
  
  removeFilter(event) {
    const filterToRemove = event.detail;
    this.activeFilters = this.activeFilters.filter((f) => f !== filterToRemove);
    this.applyFilters(); // Re-filter results
    this.requestUpdate();
  }
    
  resetFilters() {
    this.searchQuery = "";
    this.activeFilters = []; // Clear active filters
    this.filteredItems = this.items; // Reset to show all items
    this.requestUpdate(); // Trigger an update
  
    // Uncheck checkboxes
    const checkboxes = this.shadowRoot.querySelectorAll(
      '.filterButtons input[type="checkbox"]'
    );
    checkboxes.forEach((checkbox) => (checkbox.checked = false)); 
  
    // Clear search bar
    const searchInput = this.shadowRoot.querySelector('#searchField');
    if (searchInput) {
      searchInput.value = "";
    }
  }

  updateResults() {
    this.loading = true;
    this.errorMessage = ""; // Reset error before fetching
    
    fetch(new URL('./app-hax-recipes.json', import.meta.url).href)  
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); // Parse JSON data
    })
    .then(data => {
    // Map JSON data to component's items
          
      if (Array.isArray(data.item)) {
        this.items = data.item.map(item => ({
          useCaseTitle: item.title,
          useCaseImage: item.image,
          useCaseDescription: item.description,
          useCaseIcon: item.attributes.map(attributes => ({
            icon: attributes.icon,
            tooltip: attributes.tooltip
          })),
          useCaseTag: Array.isArray(item.category) ? item.category : [item.category],
          demoLink: item["demo-url"],
        }));
        this.filteredItems = this.items;
        this.filters = [];
    
        data.item.forEach(item => {
          if (Array.isArray(item.category)) {
            item.category.forEach(category => {
              if (!this.filters.includes(category)) {
                this.filters = [...this.filters, category];
              }
            });
          }
        });
      } else {
        this.errorMessage = 'No Templates Found';
      }
      console.log(data);
    })
    .catch(error => {
      this.errorMessage = `Failed to load data: ${error.message}`;
      this.items = [];
      this.filteredItems = [];
    })
    .finally(() => {
      this.loading = false;
      this.requestUpdate();
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