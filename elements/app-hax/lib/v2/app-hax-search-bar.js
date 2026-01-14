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
          position: relative;
          display: inline-block;
        }

        [role="search"] {
          position: relative;
          display: inline-block;
        }

        .search-input-container {
          position: relative;
          display: inline-block;
        }
        input {
          opacity: 1;
          width: 750px;
          transition: all ease-in-out 0.3s;
          padding: 4px;
          padding-left: 35px;
          font-family: sans-serif;
          font-size: 16px;
          margin: 2px 0 0 16px;
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
        .search-icon {
          position: absolute;
          left: 24px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 16px;
          align-self: center;
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
    this.searchTerm = this.shadowRoot.querySelector("#searchField").value;
  }

  render() {
    return html`
      <div role="search" aria-label="Site search">
        <div class="search-input-container">
          <simple-icon
            class="search-icon"
            icon="icons:search"
            aria-hidden="true"
            id="search-icon"
          ></simple-icon>
          <input
            id="searchField"
            @click="${this.toggleSearch}"
            @input="${this.search}"
            @keydown="${this.testKeydown}"
            type="text"
            placeholder="Search Existing Sites"
            aria-label="Search existing sites"
            aria-describedby="search-icon"
            role="searchbox"
          />
        </div>
        <slot></slot>
      </div>
    `;
  }

  toggleSearch() {
    if (!this.disabled) {
      this.shadowRoot.querySelector("#searchField").value = "";
    }
  }
}
customElements.define(AppHaxSearchBar.tag, AppHaxSearchBar);
