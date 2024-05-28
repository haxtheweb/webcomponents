/* eslint-disable no-return-assign */
import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
import { store } from "./AppHaxStore.js";

export class AppHaxSearchBar extends LitElement {
  // a convention I enjoy so you can change the tag name in 1 place
  static get tag() {
    return "app-hax-search-bar";
  }

  constructor() {
    super();
    this.searchTerm = "";
    this.disabled = false;
    this.showSearch = false;
  }

  // Site.json is coming from

  static get properties() {
    return {
      searchTerm: { type: String },
      showSearch: { type: Boolean, reflect: true, attribute: "show-search" },
      disabled: { type: Boolean, reflect: true },
    };
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "searchItems") {
        this.displayItems = [...this.searchItems];
      } else if (propName === "searchTerm") {
        store.searchTerm = this.searchTerm;
      } else if (propName === "showSearch" && oldValue !== undefined) {
        if (this[propName] === false) {
          this.searchTerm = "";
        }
      }
    });
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
        @media (max-width: 780px) {
          :host([show-search]) input {
            width: 250px;
            max-width: 20vw;
          }
        }
        @media (max-width: 600px) {
          :host([show-search]) input {
            width: 200px;
            max-width: 20vw;
          }
        }

        simple-toolbar-button[disabled] {
          background-color: #cccccc;
          pointer-events: none;
          cursor: help;
        }
        simple-toolbar-button {
          min-width: 48px;
          margin: 0;
          --simple-toolbar-border-color: #dddddddd;
          height: 48px;
          --simple-toolbar-button-disabled-border-color: transparent;
          --simple-toolbar-button-disabled-opacity: 0.3;
          --simple-toolbar-button-padding: 3px 6px;
          --simple-toolbar-border-radius: 0;
        }
        simple-toolbar-button:hover,
        simple-toolbar-button:active,
        simple-toolbar-button:focus {
          background-color: var(--hax-ui-background-color-accent);
          color: var(--hax-ui-color);
        }
        simple-toolbar-button:hover,
        simple-toolbar-button:active,
        simple-toolbar-button:focus {
          --simple-toolbar-border-color: var(--hax-ui-color-accent);
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
        placeholder="Site name.."
      />
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
}
customElements.define(AppHaxSearchBar.tag, AppHaxSearchBar);
