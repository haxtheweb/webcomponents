import { LitElement, html, css } from "lit-element/lit-element.js";
import { autorun, toJS } from "mobx";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";

class BootstrapSearch extends LitElement {
  constructor() {
    super();
    let basePath = this.getBasePath(decodeURIComponent(import.meta.url));
    this._bootstrapPath = basePath + "bootstrap/dist/css/bootstrap.min.css";
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
    };
  }

  static get styles() {
    return [css``];
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
        />
      </form>
    `;
  }

  getBasePath(url) {
    return url.substring(0, url.lastIndexOf("/@lrnwebcomponents/") + 1);
  }
}
customElements.define(BootstrapSearch.tag, BootstrapSearch);
export { BootstrapSearch };
