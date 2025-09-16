import { LitElement, html, css } from "lit";
import { autorun, toJS } from "mobx";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";

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
        .visually-hidden {
          position: absolute !important;
          width: 1px !important;
          height: 1px !important;
          padding: 0 !important;
          margin: -1px !important;
          overflow: hidden !important;
          clip: rect(0, 0, 0, 0) !important;
          white-space: nowrap !important;
          border: 0 !important;
        }
      `,
    ];
  }

  render() {
    return html`
      <link rel="stylesheet" href="${this._bootstrapPath}" />
      <form class="d-flex" role="search" @submit=${this.handleSubmit}>
        <label for="bootstrap-search-input" class="visually-hidden">Search site content</label>
        <input
          id="bootstrap-search-input"
          class="form-control mr-2"
          type="search"
          placeholder="Type to search"
          aria-label="Search site content"
          aria-describedby="search-instructions"
          @input=${this.inputChanged}
          @keydown=${this.handleKeydown}
        />
        <div id="search-instructions" class="visually-hidden">
          Type to search site content. Press Enter to search or Escape to clear.
        </div>
      </form>
    `;
  }

  inputChanged(evt) {
    this.searchText = evt.target.value;
    this.dispatchEvent(
      new CustomEvent("search-changed", {
        bubbles: true,
        composed: true,
        detail: { searchText: this.searchText },
      }),
    );
  }

  handleSubmit(evt) {
    evt.preventDefault();
    // Form submission is handled by input change
  }

  handleKeydown(evt) {
    if (evt.key === 'Escape') {
      evt.target.value = '';
      this.searchText = '';
      this.dispatchEvent(
        new CustomEvent("search-changed", {
          bubbles: true,
          composed: true,
          detail: { searchText: '' },
        }),
      );
    }
  }

  getBasePath(url) {
    return url.substring(0, url.lastIndexOf("/@haxtheweb/") + 1);
  }
}
globalThis.customElements.define(BootstrapSearch.tag, BootstrapSearch);
export { BootstrapSearch };
