/* eslint-disable no-return-assign */
import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
import { store } from "./AppHaxStore.js";
import "./app-hax-use-case.js";

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
      loading: { type: Boolean }
    };
  }

  static get styles() {
    return [
      css`
        :host {
          overflow: hidden;
          display: block !important;
        }
        input {
          visibility: none;
          opacity: 0;
          width: 0;
          transition: all ease-in-out 0.3s;
          padding: 4px;
          font-family: "Press Start 2P", sans-serif;
          font-size: 20px;
          margin: 2px 0 0 16px;
        }
        :host([show-search]) input {
          visibility: visible;
          opacity: 1;
          width: 250px;
          max-width: 25vw;
        }
        .filter {
          visibility: visible;
          display:flex;
          background-color: white;
          flex-direction: column;
          margin: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-4);
          background-color: var(--ddd-theme-default-white);
          border-radius: var(--ddd-radius-xs);
          width: 300px;
        }
        .filterButtons {
          text-align: start;
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-2);
          max-width: 150px;
        }
      `,
    ];
  }
  testKeydown(e) {
    if (e.key === "Escape" || e.key === "Enter") {
      this.toggleSearch();
    }
  }
  // eslint-disable-next-line class-methods-use-this
  search() {
    store.appEl.playSound("click");
    this.searchTerm = this.shadowRoot.querySelector("#searchField").value;
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

  render() {
    return html`
    <div class="filter">
      <simple-toolbar-button
        id="searchico"
        icon-position="left"
        show-text-label
        ?toggles="${this.showSearch}"
        ?disabled="${this.disabled}"
        label="Search Sites"
        icon="icons:search"
        @click="${this.toggleSearch}"
      ></simple-toolbar-button>
      <simple-tooltip for="searchico" position="bottom"
        >Toggle Search</simple-tooltip
      >
  <!--search bar-->
      <input
        ?disabled="${!this.showSearch}"
        id="searchField"
        @input="${this.handleSearch}"
        @keydown="${this.testKeydown}"
        type="text"
        placeholder="Search Template.."
      />
      <button class="reset-button" @click="${this.resetFilters}">Reset Filters</button>
      <div class="filterButtons">
        <label><input type="checkbox" data-id="portfolio" @change="${() => this.toggleFilter(filter)}">Portfolio</label>
        <label><input type="checkbox" data-id="blog" @change="${() => this.toggleFilter(filter)}">Blog</label>
        <label><input type="checkbox" data-id="research" @change="${() => this.toggleFilter(filter)}">Research Site</label>
        <label><input type="checkbox" data-id="resume" @change="${() => this.toggleFilter(filter)}">Resume</label>
        <label><input type="checkbox" data-id="course" @change="${() => this.toggleFilter(filter)}">Course</label>
      </div>
    </div>

    <div class="results">
      ${this.filteredItems.length > 0
        ? this.filteredItems.map(
        (item, index) => html`
          <div>
            <a href="${item.demoLink}" target="_blank">
            <app-hax-use-case
              .source=${item.useCaseImage || ""}
              .title=${item.useCaseTitle || ""}
              .description=${item.useCaseDescription || ""}
              .demoLink=${item.demoLink || ""}
              .iconImage=${item.useCaseIcon || []}
            ></app-hax-use-case>
            </a>
          </div>
        `
        )
        : html`<p>No templates match the filters specified.</p>`}
    </div>
    `;
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

  handleSearch(event) {
    this.searchQuery = event.target.value.toLowerCase();
  }
  
  toggleFilter(filter) {
    if (this.activeFilters.includes(filter)) {
      this.activeFilters = this.activeFilters.filter((f) => f !== filter);
    } else {
      this.activeFilters = [...this.activeFilters, filter];
    }
  }

  applyFilters() {
    const lowerCaseQuery = this.searchQuery.toLowerCase();
    
    this.filteredItems = this.items.filter((item) => {
      const matchesSearch = item.useCaseTitle.toLowerCase().includes(lowerCaseQuery);
    
      const matchesFilters =
        this.activeFilters.length === 0 || // No filters means match all
        this.activeFilters.some((filter) => item.useCaseTag.includes(filter));
    
      return matchesSearch && matchesFilters;
    }); 
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
    const searchInput = this.shadowRoot.querySelector('#searchField input[type="text"]');
    if (searchInput) {
      searchInput.value = "";
    }
  }

  updateResults() {
    this.loading = true;
    this.errorMessage = ""; // Reset error before fetching
    
    fetch(new URL('./lib/v2/app-hax-receipes.json', import.meta.url).href)  
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
          useCaseTag: item.category
        }));
        this.filteredItems = this.items;
        this.filters = [];
    
        data.item.forEach(item => {
          if (Array.isArray(item.category)) {
            item.category.forEach(tag => {
              if (!this.filters.includes(category)) {
                this.filters = [...this.filters, category];
              }
            });
          }
        });
      } else {
        this.errorMessage = 'No Templates Found';
      }
    })
    .catch(error => {
      this.errorMessage = `Failed to load data: ${error.message}`;
      this.items = [];
      this.filteredItems = [];
    })
    .finally(() => {
      this.loading = false;
    });
  }
}
customElements.define("app-hax-use-case-filter", AppHaxUseCaseFilter);
