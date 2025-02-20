/* eslint-disable no-return-assign */
import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
import { store } from "./AppHaxStore.js";

export class AppHaxFilter extends LitElement {
  // a convention I enjoy so you can change the tag name in 1 place
  static get tag() {
    return "app-hax-filter";
  }

  constructor() {
    super();
    this.searchTerm = "";
    this.disabled = false;
    this.showSearch = false;
    this.searchQuery = "";
    this.activeFilters = [];
    this.filters = [];
  }

  // Site.json is coming from

  static get properties() {
    return {
      searchTerm: { type: String },
      showSearch: { type: Boolean, reflect: true, attribute: "show-search" },
      disabled: { type: Boolean, reflect: true },
      searchQuery: { type: String },
      activeFilters: { type: Array },
      filters: { type: Array },
    };
  }

  static get styles() {
    return [
      css`
        :host {
          overflow: hidden;
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
      <input
        ?disabled="${!this.showSearch}"
        id="searchField"
        @input="${this.search}"
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
}
customElements.define(AppHaxFilter.tag, AppHaxFilter);
