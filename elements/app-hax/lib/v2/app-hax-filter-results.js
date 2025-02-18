/* eslint-disable no-return-assign */
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
import { html, css } from "lit";
import { autorun, toJS } from "mobx";
import { varGet } from "@haxtheweb/utils/utils.js";
import { store } from "./AppHaxStore.js";
import "./app-hax-filter.js";

export class AppHaxFilterResults extends SimpleColors {
  // a convention I enjoy so you can change the tag name in 1 place
  static get tag() {
    return "app-hax-filter-results";
  }

  constructor() {
    super();
    this.searchItems = [];
    this.displayItems = [];
    this.searchTerm = "";
    this.dark = false;
  }

  // Site.json is coming from

  static get properties() {
    return {
      ...super.properties,
      searchTerm: { type: String, reflect: true },
      searchItems: { type: Array },
      displayItems: { type: Array },
    };
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

  //Izzy's code from hax-use-case-app
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
          useCaseIcon: item.useCaseAttributes.map(attribute => ({
            icon: attribute.icon,
            tooltip: attribute.tooltip
          })),
          useCaseTag: item.template-tag
        }));
        this.filteredItems = this.items;
        this.filters = [];

        data.item.forEach(item => {
          if (Array.isArray(item.tag)) {
            item.tag.forEach(tag => {
              if (!this.filters.includes(tag)) {
                this.filters = [...this.filters, tag];
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

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          overflow: hidden;
        }
      `,
    ];
  }
  render() {
    return html`
      <ul id="results">
        ${this.displayItems.length > 0
          ? this.displayItems.map(
              (item) =>
                html` <li>
                  <app-hax-site-bar
                    @opened-changed="${this.openedChanged}"
                    ?dark="${this.dark}"
                    accent-color="${varGet(
                      item,
                      "metadata.theme.variables.cssVariable",
                      "orange",
                    )
                      .replace("--simple-colors-default-theme-", "")
                      .replace("-7", "")}"
                    icon-link="${item.slug}"
                    icon="${varGet(
                      item,
                      "metadata.theme.variables.icon",
                      "link",
                    )}"
                  >
                    <a href="${item.slug}" slot="heading">${item.title}</a>
                    <span slot="subHeading">${item.author}</span>
                    <app-hax-site-details
                      slot="band"
                      .details="${this.getItemDetails(item)}"
                      site-id="${item.id}"
                    >
                      <div class="description" slot="pre">
                        ${item.description}
                      </div>
                    </app-hax-site-details>
                  </app-hax-site-bar>
                </li>`,
            )
          : html`<div id="noResult">
              No results for
              ${this.searchTerm !== ""
                ? html`<strong>"${this.searchTerm}"</strong>`
                : "your account, try starting a new journey!"}.
            </div>`}
      </ul>
    `;
  }

  getItemDetails(item) {
    const details = {
      created: varGet(item, "metadata.site.created", new Date() / 1000),
      updated: varGet(item, "metadata.site.updated", new Date() / 1000),
      pages: varGet(item, "metadata.pageCount", 0),
      url: item.slug,
    };
    return details;
  }

  openedChanged(e) {
    store.appEl.playSound("click");
    if (!e.detail.value) {
      this.shadowRoot
        .querySelector("app-hax-site-details")
        .setAttribute("tabindex", "-1");
    } else {
      this.shadowRoot
        .querySelector("app-hax-site-details")
        .removeAttribute("tabindex");
    }
  }
}
customElements.define(AppHaxFilterResults.tag, AppHaxFilterResults);
