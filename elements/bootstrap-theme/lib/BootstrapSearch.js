import { LitElement, html, css } from "lit-element/lit-element.js";
import { autorun, toJS } from "mobx";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";

class BootstrapSearch extends LitElement {
  constructor() {
    super();
    let basePath = this.getBasePath(decodeURIComponent(import.meta.url));
    this._bootstrapPath = basePath + "bootstrap/dist/css/bootstrap.min.css";
    this.searchText = "";
  }

  static get tag() {
    return "bootstrap-search";
  }

  static get properties() {
    return {
      colorTheme: {
        type: String,
        reflect: true,
        attribute: "color-theme",
      },
      searchText: {
        type: String,
      },
    };
  }

  static get styles() {
    return [
      css`
        :host {
          float: right;
        }
        input {
          max-width: var(--bootstrap-search-max-width, 300px);
          width: var(--bootstrap-search-width, 300px);
        }
      `,
    ];
  }

  render() {
    return html`
      <link rel="stylesheet" href="${this._bootstrapPath}" />
      <form class="d-flex">
        <input
          class="form-control me-2"
          type="search"
          placeholder="Type to search"
          aria-label="Search"
          @input=${this.inputChanged}
        />
      </form>
    `;
  }

  inputChanged(evt) {
    this.searchText = evt.target.value;
    this.dispatchEvent(
      new CustomEvent("searchChanged", {
        bubbles: true,
        composed: true,
        detail: this,
      })
    );
  }

  getBasePath(url) {
    return url.substring(0, url.lastIndexOf("/@lrnwebcomponents/") + 1);
  }
}
customElements.define(BootstrapSearch.tag, BootstrapSearch);
export { BootstrapSearch };
