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
  }

  // Site.json is coming from

  static get properties() {
    return {
      searchTerm: { type: String },
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
      <input
        id="searchField"
        @input="${this.search}"
        @keydown="${this.testKeydown}"
        type="text"
        placeholder="Search Sites.."
      />
    `;
  }

}
customElements.define(AppHaxSearchBar.tag, AppHaxSearchBar);
