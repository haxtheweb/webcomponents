import { LitElement, html, css } from "lit";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

export class CleanOneSearchBox extends I18NMixin(LitElement) {
  static get tag() {
    return "clean-one-search-box";
  }
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        input {
          line-height: normal;
          font-family: inherit;
          font-size: 100%;
          margin: 0;
        }
        input,
        input:focus,
        input:hover {
          background: 0 0;
          border: 1px solid transparent;
          box-shadow: none;
          outline: 0;
          line-height: 22px;
          padding: 7px 7px;
          color: inherit;
        }
      `,
    ];
  }
  constructor() {
    super();
    this.value = "";
    this.t = {
      searchSiteContent: "Search site content",
      typeToSearch: "Type to search",
    };
    this.registerLocalization({
      context: this,
      namespace: "clean-one",
      localesPath:
        new URL("../locales/clean-one.es.json", import.meta.url).href + "/../",
      locales: ["es", "fr", "de", "ja"],
    });
  }
  focus() {
    if (this.shadowRoot && this.shadowRoot.querySelector("input")) {
      this.shadowRoot.querySelector("input").focus();
    }
  }
  select() {
    if (this.shadowRoot && this.shadowRoot.querySelector("input")) {
      this.shadowRoot.querySelector("input").select();
    }
  }
  render() {
    return html`
      <input
        type="text"
        aria-label="${this.t.searchSiteContent}"
        placeholder="${this.t.typeToSearch}"
        .value="${this.value}"
        @input="${this.searchChanged}"
      />
    `;
  }
  static get properties() {
    return {
      value: { type: String },
    };
  }
  searchChanged(e) {
    if (this.shadowRoot) {
      this.dispatchEvent(
        new CustomEvent("input-changed", {
          composed: false,
          bubbles: false,
          cancelable: false,
          detail: {
            value: this.shadowRoot.querySelector("input").value,
          },
        }),
      );
    }
  }
}
customElements.define(CleanOneSearchBox.tag, CleanOneSearchBox);
