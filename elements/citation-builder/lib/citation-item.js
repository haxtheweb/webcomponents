/**
 * Copyright 2026 winstonwumbo
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";

/**
 * `citation-builder`
 * 
 * @demo index.html
 * @element citation-builder
 */
export class CitationItem extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "citation-item";
  }

  constructor() {
    super();
    this.title = "We Will Steal Ze Moon";
    this.authors = [
      { given: 'John Andrew', surname: 'Smith' },
      { given: 'Jane', surname: 'Doe' },
      { given: 'Kevin', surname: 'Brown' },
    ];
    this.publicationDate = {
      month: "June",
      day: "1",
      year: "2025" 
    }
    this.citationType = "web"

    this.source = "HAX PSU"
    this.url = "https://hax.psu.edu"
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      citationType: { type: String },
      source: { type: String },
      authors: { type: Array },
      publicationDate: { type: Object },
      url: { type: String },
      volume: { type: String },
      issue: { type: String },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        color: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
      }
      .wrapper {
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-4);
        border: grey 1px solid;
        display: flex;
        justify-content: space-between;
      }
      .italic-section {
        display: inline;
        font-style: italic;
      }
    `];
  }

  // Lit render the HTML
  render() {
    return html`
    <div class="wrapper">
        <div class="citation">
          ${this._authorsToAPA()}, ${this._dateToAPA()}, ${this.title}, ${this._sourceToAPA()}
        </div>
        <div class="copy-button">
            <simple-icon-button
              part="icon"
              class="icon"
              title="Copy"
              icon="content-copy"
              @click=${this._copyToClipboard}
            ></simple-icon-button>
        </div>
    </div>`;
  }

  /**
  * LitElement lifecycle
  */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "authors" && oldValue !== undefined) {
        this._formatAuthors();
      } else if (propName === "publicationDate" && oldValue !== undefined) {
        this._formattedDate = this._formatDate();
      };
    });
  }

  _authorsToAPA(){
    if (!this.authors) return '';

    // author.given author.surname
    // Can make etAlThreshold and visible total for inline citation part of sidebar
    const formattedArr = this.authors.map((author) => {
      const surname = author.surname.trim()
      const given = author.given.trim().replace(/\b(\w)\w*/g, '$1.').toUpperCase();

      return `${surname}, ${given}`
    });

    if (this.authors.length === 1){
      return formattedArr[0] + ".";
    } else {
      const last = formattedArr.pop();
      return formattedArr.join(', ') + ', & ' + last;
    }
  }

  _dateToAPA(){
    if(!this.publicationDate.year) return "(n.d.)";

    if(this.citationType === 'journal'){
      return `(${this.publicationDate.year})`
    }
    else if(this.citationType === 'web'){
      if (this.publicationDate.month && this.publicationDate.day){
        return `(${this.publicationDate.year}, ${this.publicationDate.month} ${parseInt(this.publicationDate.day)})`;
      } else if (this.publicationDate.month){
        return `(${this.publicationDate.year}, ${this.publicationDate.month})`;
      } else {
        return `(${this.publicationDate.year})`; 
      }
    }
  }

  _sourceToAPA(){
    if(this.citationType === 'journal'){
      const doi = this.url
      return html`${this.source}, <div class="italic-section">${this.volume}</div>(${this.issue}), ${pageStart}-${pageEnd}. ${doi}`
    }
    if(this.citationType === 'web'){
      return html`<div class="italic-section">${this.source}</div>, ${this.url}`
    }
  }

  _copyToClipboard(){
    const target = this.shadowRoot.querySelector(".citation");
    // target.focus()
    navigator.clipboard.writeText(target.textContent)
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }

  haxHooks() {

  }
}

globalThis.customElements.define(CitationItem.tag, CitationItem);